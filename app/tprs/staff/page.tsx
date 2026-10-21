import { readTprsSessionIdentity } from '../lib/session-identity';
import { readStaffWorkspace } from '../lib/staff-workspace';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StaffPage() {
  const identity = await readTprsSessionIdentity();
  const result = await readStaffWorkspace(identity?.authSubject ?? null);

  if (result.allowed === false) {
    return (
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px', fontFamily: 'system-ui', color: '#0f172a' }}>
        <p>HEPE-TPRS · Protected Staff Workspace</p>
        <h1>{result.reason === 'UNAUTHENTICATED' ? 'Sign-in required' : 'Access unavailable'}</h1>
        <p>This workspace is fail-closed and exposes no learner data outside explicit staff assignments.</p>
        <p>Access state: <strong>{result.reason}</strong></p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 20px', fontFamily: 'system-ui', color: '#0f172a' }}>
      <p>HEPE-TPRS · Protected Staff Workspace · Read-only</p>
      <h1>Assigned participants</h1>
      <p>Only explicit FACILITATOR/ASSESSOR assignments are shown. This page cannot verify, reject, certify, or grant Human Academic Clearance.</p>
      <table style={{ width: '100%', minWidth: 600 }}>
        <thead><tr><th>Participant</th><th>Assigned role</th></tr></thead>
        <tbody>{result.assignments.map(item => (
          <tr key={`${item.learnerId}-${item.role}`}><td>{item.participantReference}</td><td>{item.role}</td></tr>
        ))}</tbody>
      </table>
    </main>
  );
}
