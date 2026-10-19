"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function MappingReviewActions({ mappingId, status, irmLevel, rationale }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(rationale || "");
  const [irm, setIrm] = useState(irmLevel || "R");
  const [message, setMessage] = useState("");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  async function act(action, extra = {}) {
    if (!supabaseUrl || !supabaseKey) {
      setMessage("Runtime is not configured.");
      return;
    }
    setBusy(true);
    setMessage("");
    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.rpc("hepe_review_working_mapping", {
      p_working_mapping_proposal_id: mappingId,
      p_action: action,
      p_irm_level: extra.irm ?? null,
      p_rationale: extra.rationale ?? null,
    });
    if (error) {
      setMessage(error.message || "Action failed.");
      setBusy(false);
      return;
    }
    setMessage("Action completed.");
    setBusy(false);
    router.refresh();
  }

  const canCourseReview = ["PROPOSED", "WORKING"].includes(status);
  const canProgrammeReview = status === "WORKING";
  const canReject = ["PROPOSED", "WORKING", "PROGRAMME_REVIEWED"].includes(status);

  return (
    <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <select value={irm} onChange={(e) => setIrm(e.target.value)} disabled={!canCourseReview || busy}>
          <option value="I">I</option>
          <option value="R">R</option>
          <option value="M">M</option>
        </select>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={!canCourseReview || busy}
          style={{ flex: "1 1 320px", minWidth: 220, padding: 8 }}
          aria-label="Mapping rationale"
        />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button disabled={!canCourseReview || busy} onClick={() => act("EDIT", { irm, rationale: note })}>
          Save Edit
        </button>
        <button disabled={!canCourseReview || busy} onClick={() => act("ACCEPT_WORKING", { irm, rationale: note })}>
          Accept for Working
        </button>
        <button disabled={!canProgrammeReview || busy} onClick={() => act("PROGRAMME_REVIEW")}>
          Programme Review
        </button>
        <button disabled={!canReject || busy} onClick={() => act("REJECT", { rationale: note })}>
          Reject
        </button>
      </div>

      {message ? <div style={{ fontSize: 12, color: "#475569" }}>{message}</div> : null}
    </div>
  );
}
