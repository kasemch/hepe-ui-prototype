"use client";

import { useEffect, useState } from "react";

export default function CallbackStatus() {
  const [state, setState] = useState({
    status: "unknown",
    reason: "",
    detail: "",
  });

  useEffect(() => {
    const p = new URL(window.location.href).searchParams;
    setState({
      status: p.get("status") || "unknown",
      reason: p.get("reason") || "",
      detail: p.get("detail") || "",
    });
  }, []);

  return (
    <main style={{maxWidth:640,margin:"60px auto",padding:24,background:"white",borderRadius:16}}>
      <h1>HEPE Authentication Callback</h1>
      <p><strong>NON-PRODUCTION</strong></p>
      <p>Status: {state.status}</p>
      {state.reason ? <p>Reason: {state.reason}</p> : null}
      {state.detail ? <p>Detail: {state.detail}</p> : null}
      <p>Authentication success does not itself grant HEPE business authority. Actor binding, role, authority, scope and activation remain separate controlled steps.</p>
    </main>
  );
}
