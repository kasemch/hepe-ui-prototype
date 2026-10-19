"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function ReviewActions({
  sessionId,
  previewStatus,
  blockerCount,
  authoritativeExportAllowed,
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const canSubmit =
    ["READY_FOR_REVIEW", "REVISION_REQUIRED"].includes(previewStatus) &&
    blockerCount === 0;

  const canDecide = ["SUBMITTED", "UNDER_REVIEW"].includes(previewStatus);

  const canExport =
    previewStatus === "APPROVED_FOR_CONTROLLED_EXPORT" &&
    blockerCount === 0 &&
    authoritativeExportAllowed;

  async function runRpc(name, args) {
    if (!supabaseUrl || !supabaseKey) {
      setMessage("Runtime is not configured.");
      return;
    }

    setBusy(true);
    setMessage("");

    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.rpc(name, args);

    if (error) {
      setMessage(error.message || "Action failed.");
      setBusy(false);
      return;
    }

    setMessage("Action completed.");
    setBusy(false);
    router.refresh();
  }

  return (
    <section style={{ borderTop: "1px solid #e2e8f0", paddingTop: 22 }}>
      <h2>Human Review Actions</h2>
      <p style={{ color: "#64748b" }}>
        ทุก action ผ่าน Supabase RPC และ authority gate เดิมของระบบ
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          disabled={!canSubmit || busy}
          onClick={() =>
            runRpc("hepe_submit_document_preview", {
              p_document_preview_session_id: sessionId,
            })
          }
          style={{ padding: "10px 14px", borderRadius: 10 }}
        >
          Submit for Review
        </button>

        <button
          disabled={!canDecide || busy}
          onClick={() =>
            runRpc("hepe_decide_document_preview", {
              p_document_preview_session_id: sessionId,
              p_decision: "APPROVE_CONTROLLED_EXPORT",
              p_note: "Approved through HEPE TQF3 Human Review Workspace",
            })
          }
          style={{ padding: "10px 14px", borderRadius: 10 }}
        >
          Accept
        </button>

        <button
          disabled={!canDecide || busy}
          onClick={() =>
            runRpc("hepe_decide_document_preview", {
              p_document_preview_session_id: sessionId,
              p_decision: "REQUEST_REVISION",
              p_note: "Revision requested through HEPE TQF3 Human Review Workspace",
            })
          }
          style={{ padding: "10px 14px", borderRadius: 10 }}
        >
          Request Revision
        </button>

        <button
          disabled={!canDecide || busy}
          onClick={() =>
            runRpc("hepe_decide_document_preview", {
              p_document_preview_session_id: sessionId,
              p_decision: "REJECT",
              p_note: "Rejected through HEPE TQF3 Human Review Workspace",
            })
          }
          style={{ padding: "10px 14px", borderRadius: 10 }}
        >
          Reject
        </button>

        <button
          disabled={!canExport || busy}
          style={{ padding: "10px 14px", borderRadius: 10 }}
        >
          Export DOCX / PDF {canExport ? "" : "· LOCKED"}
        </button>
      </div>

      {message ? (
        <p style={{ marginTop: 12, color: "#475569" }}>{message}</p>
      ) : null}
    </section>
  );
}
