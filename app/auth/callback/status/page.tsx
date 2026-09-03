export default async function CallbackStatus({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; reason?: string; detail?: string }>;
}) {
  const p = await searchParams;
  return (
    <main style={{maxWidth:640,margin:"60px auto",padding:24,background:"white",borderRadius:16}}>
      <h1>HEPE Authentication Callback</h1>
      <p><strong>NON-PRODUCTION</strong></p>
      <p>Status: {p.status ?? "unknown"}</p>
      {p.reason ? <p>Reason: {p.reason}</p> : null}
      <p>Authentication success does not itself grant HEPE business authority. Actor binding, role, authority, scope and activation remain separate controlled steps.</p>
    </main>
  );
}
