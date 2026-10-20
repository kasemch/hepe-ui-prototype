import { readTprsSessionIdentity } from '../lib/session-identity';
import { readParticipantWorkspace } from '../lib/participant-workspace';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function Denied({ reason }: { reason: string }) {
  const unauthenticated = reason === 'UNAUTHENTICATED';
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px', fontFamily: 'system-ui', color: '#0f172a' }}>
      <p>HEPE-TPRS · Protected Participant Workspace</p>
      <h1>{unauthenticated ? 'Sign-in required' : 'Access unavailable'}</h1>
      <p>This workspace is fail-closed. It does not expose another participant’s record and it does not infer academic clearance.</p>
      <p>Access state: <strong>{reason}</strong></p>
    </main>
  );
}

export default async function ParticipantPage() {
  const identity = await readTprsSessionIdentity();
  const result = await readParticipantWorkspace(identity?.authSubject ?? null);
  if (result.allowed === false) return <Denied reason={result.reason} />;

  const { workspace } = result;
  const recorded = workspace.stages.reduce((sum, stage) => sum + stage.recordedHours, 0);
  const verified = workspace.stages.reduce((sum, stage) => sum + stage.verifiedHours, 0);

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 20px', fontFamily: 'system-ui', color: '#0f172a' }}>
      <p>HEPE-TPRS · Protected Participant Workspace · Read-only</p>
      <h1>{workspace.participantReference}</h1>
      <p>Recorded {recorded}/24 · Verified {verified}/24. Recorded hours are not academic verification or Human Academic Clearance.</p>

      <h2>E-PLC stages</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 700 }}>
          <thead><tr><th>Stage</th><th>Required</th><th>Recorded</th><th>Verified</th><th>State</th></tr></thead>
          <tbody>{workspace.stages.map(stage => (
            <tr key={stage.stageCode}>
              <td>{stage.stageCode}</td><td>{stage.requiredHours}</td><td>{stage.recordedHours}</td><td>{stage.verifiedHours}</td><td>{stage.state}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <h2>PLC cycles</h2>
      <p>{workspace.plcCycles.map(cycle => `C${cycle.cycleNumber}:${cycle.state}`).join(' · ')}</p>

      <h2>Evidence</h2>
      {workspace.evidence.length === 0 ? <p>No evidence has been recorded.</p> : (
        <ul>{workspace.evidence.map(item => <li key={item.evidenceId}>{item.evidenceType} · {item.status} · version {item.currentVersion}</li>)}</ul>
      )}
      <p>This page cannot submit, verify, reject, certify, or approve academic completion.</p>
    </main>
  );
}
