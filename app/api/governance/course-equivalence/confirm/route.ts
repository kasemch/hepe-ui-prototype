import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROGRAMME_ID = "69e3361e-b342-43e1-b386-ac73b191b9a4";
const REVIEW_CODE = "HEPE-PEOPLE-01B2H-EQUIVALENCE";
const EXPECTED_CODES = [
  "RHE2201",
  "RHE2205",
  "RHE2401",
  "RHE3100",
  "RHE3101",
  "RHE3102",
  "RHE3105",
  "RHE3106",
  "RHE3408",
  "RHE4102",
  "RHE4103",
  "RPE3603",
] as const;

const ALLOWED_DECISIONS = new Set([
  "CONFIRM_EXACT_PREDECESSOR",
  "REJECT",
  "SPLIT",
  "MERGED",
  "REPLACED",
  "NO_EQUIVALENCE",
  "DEFER_NEED_MORE_EVIDENCE",
]);

type PacketBody = {
  decisions?: Record<string, string>;
  rationales?: Record<string, string>;
  references?: Record<string, string>;
  authorityName?: string;
  authorityRole?: string;
  acknowledgement?: boolean;
  idempotencyNonce?: string;
};

function cleanRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      typeof item === "string" ? item.trim().slice(0, 4000) : "",
    ])
  );
}

function createSupabase(request: NextRequest, response: NextResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  const supabase = createSupabase(request, response);
  if (!supabase) {
    return NextResponse.json(
      { ok: false, code: "HEPE_01B2H_RUNTIME_NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      {
        ok: false,
        code: "HEPE_01B2H_AUTH_REQUIRED",
        message: "ต้องเข้าสู่ระบบด้วย identity ที่ผูกกับ HEPE actor ก่อนยืนยันผล",
      },
      { status: 401 }
    );
  }

  let body: PacketBody;
  try {
    body = (await request.json()) as PacketBody;
  } catch {
    return NextResponse.json(
      { ok: false, code: "HEPE_01B2H_INVALID_JSON" },
      { status: 400 }
    );
  }

  const decisions = cleanRecord(body.decisions);
  const rationales = cleanRecord(body.rationales);
  const references = cleanRecord(body.references);
  const authorityName = (body.authorityName ?? "").trim().slice(0, 300);
  const authorityRole = (body.authorityRole ?? "").trim().slice(0, 300);
  const nonce = (body.idempotencyNonce ?? "").trim().slice(0, 200);

  const suppliedCodes = Object.keys(decisions).sort();
  const expectedCodes = [...EXPECTED_CODES].sort();
  if (
    suppliedCodes.length !== expectedCodes.length ||
    suppliedCodes.some((code, index) => code !== expectedCodes[index]) ||
    EXPECTED_CODES.some((code) => !ALLOWED_DECISIONS.has(decisions[code]))
  ) {
    return NextResponse.json(
      {
        ok: false,
        code: "HEPE_01B2H_INCOMPLETE_OR_INVALID_PACKET",
        message: "ต้องมีผลตัดสินครบทั้ง 12 รายการและใช้สถานะที่ระบบอนุญาตเท่านั้น",
      },
      { status: 422 }
    );
  }

  if (!authorityName || !authorityRole || body.acknowledgement !== true || !nonce) {
    return NextResponse.json(
      {
        ok: false,
        code: "HEPE_01B2H_AUTHORITY_DECLARATION_INCOMPLETE",
        message: "กรุณาระบุชื่อ บทบาท ยืนยันคำรับรอง และ idempotency nonce ให้ครบ",
      },
      { status: 422 }
    );
  }

  // The typed name/role are declaration metadata only. Actual authority is resolved
  // from the authenticated identity by the database command/RLS layer.
  const { data: reviews, error: reviewError } = await supabase
    .from("reviews")
    .select("review_id,row_version,status_code,programme_id,review_code")
    .eq("programme_id", PROGRAMME_ID)
    .eq("review_code", REVIEW_CODE)
    .eq("status_code", "READY_FOR_DECISION")
    .limit(1);

  if (reviewError) {
    return NextResponse.json(
      {
        ok: false,
        code: "HEPE_01B2H_REVIEW_LOOKUP_DENIED",
        message: "ไม่สามารถอ่าน decision context ภายใต้ authority/RLS ปัจจุบันได้",
      },
      { status: 403 }
    );
  }

  const review = reviews?.[0];
  if (!review) {
    return NextResponse.json(
      {
        ok: false,
        code: "HEPE_01B2H_REVIEW_NOT_READY",
        message:
          "ยังไม่มี controlled review HEPE-PEOPLE-01B2H ที่อยู่สถานะ READY_FOR_DECISION สำหรับหลักสูตรนี้ ระบบจึงไม่เขียนผลโดยข้าม workflow",
      },
      { status: 409 }
    );
  }

  const hasDeferred = EXPECTED_CODES.some(
    (code) => decisions[code] === "DEFER_NEED_MORE_EVIDENCE"
  );
  const commandCode = hasDeferred ? "HEPE_DECIDE_HOLD" : "HEPE_DECIDE_APPROVE";
  const decisionTypeCode = hasDeferred ? "DEFER" : "ACCEPT_WITH_CONDITIONS";
  const timestamp = new Date().toISOString();
  const evidenceCandidateId = `HEPE-EVC-PEOPLE-01B2H-${timestamp.replace(/[-:.TZ]/g, "").slice(0, 14)}`;

  const packet = {
    schema: "HEPE-PEOPLE-01B2H-DECISION-PACKET-v1",
    gate: "HEPE-PEOPLE-01B.2H",
    environment: "NON-PRODUCTION",
    programmeId: PROGRAMME_ID,
    reviewCode: REVIEW_CODE,
    submittedAt: timestamp,
    authenticatedSubject: user.id,
    declaredAuthority: {
      name: authorityName,
      role: authorityRole,
      note: "Declaration only; database authority resolution controls authorization.",
    },
    itemDecisions: EXPECTED_CODES.map((code) => ({
      legacyCode: code,
      decision: decisions[code],
      rationale: rationales[code] ?? "",
      controlledReference: references[code] ?? "",
    })),
    evidenceCandidate: {
      evidenceId: evidenceCandidateId,
      evidenceType: "CONTROLLED HUMAN DECISION RECORD CANDIDATE",
      verificationStatus: "PERSISTED_WITH_DATABASE_AUTHORITY_CHECK",
      admissionStatus: "NOT_ADMITTED",
      createsSystemAuthority: false,
    },
    governance: {
      conversationUsedAsEvidence: false,
      automaticAuditEvidenceAdmission: false,
      productionAuthorization: false,
    },
  };

  const { data: result, error: decideError } = await supabase.rpc("hepe_decide_review", {
    p_review_id: review.review_id,
    p_command_code: commandCode,
    p_expected_row_version: review.row_version,
    p_decision_type_code: decisionTypeCode,
    p_decision_text: JSON.stringify(packet),
    p_idempotency_key: `HEPE-PEOPLE-01B2H:${nonce}`,
  });

  if (decideError) {
    const message = decideError.message || "Database decision command rejected";
    const authorityDenied = /AUTHORITY|DENIED|COI|SOD|PERMISSION|ROW LEVEL|RLS/i.test(message);
    return NextResponse.json(
      {
        ok: false,
        code: authorityDenied
          ? "HEPE_01B2H_AUTHORITY_CHECK_FAILED"
          : "HEPE_01B2H_DECISION_WRITE_FAILED",
        message:
          "ระบบปฏิเสธการบันทึกแบบ fail-closed; ไม่มีการสร้าง authority และไม่มีการรับเข้า Audit Evidence Set",
      },
      { status: authorityDenied ? 403 : 409 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      gate: "HEPE-PEOPLE-01B.2H",
      result,
      evidenceCandidate: packet.evidenceCandidate,
      locked: true,
      auditEvidenceAdmission: "NOT_ADMITTED",
      production: false,
    },
    {
      status: 200,
      headers: response.headers,
    }
  );
}
