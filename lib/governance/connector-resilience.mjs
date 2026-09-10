export const OPERATION_CLASSES = Object.freeze(['READ','WRITE','ADMIN','DESTRUCTIVE','PRODUCTION-SENSITIVE','HUMAN-GATED']);
export const DISPOSITIONS = Object.freeze(['AUTO-RETRY','QUEUE','REVALIDATE','NEVER-QUEUE','HUMAN-RECONFIRM','DENY']);
export const FAILURE_CLASSES = Object.freeze(['TRANSIENT','AUTHENTICATION','AUTHORIZATION','RATE_LIMIT','REMOTE_5XX','NETWORK','TIMEOUT','STATE_CONFLICT','STALE_AUTHORITY','DUPLICATE_RISK','UNKNOWN']);
export const COMMAND_STATES = Object.freeze(['CREATED','VALIDATED','AUTHORIZED','READY','DISPATCHED','ACKNOWLEDGED','VERIFIED','COMPLETED','RETRYABLE_FAILURE','REVALIDATION_REQUIRED','HUMAN_RECONFIRM_REQUIRED','CONFLICT','EXPIRED','DENIED','ABORTED']);
export const CIRCUIT_STATES = Object.freeze(['CLOSED','OPEN','HALF_OPEN']);
export const CONNECTOR_STATES = Object.freeze(['CONNECTED','DEGRADED','OFFLINE','RECONCILING']);

export function classifyRetry({operationClass,failureClass,authorityCurrent=true,destinationKnown=true,idempotent=true,productionAuthorized=false,humanReconfirmed=false,expired=false}) {
  if (expired) return 'DENY';
  if (failureClass === 'UNKNOWN') return 'REVALIDATE';
  if (operationClass === 'PRODUCTION-SENSITIVE') return productionAuthorized ? 'HUMAN-RECONFIRM' : 'DENY';
  if (operationClass === 'DESTRUCTIVE' || operationClass === 'ADMIN') return 'NEVER-QUEUE';
  if (operationClass === 'HUMAN-GATED') return authorityCurrent && humanReconfirmed ? 'REVALIDATE' : 'HUMAN-RECONFIRM';
  if (failureClass === 'AUTHENTICATION' || failureClass === 'AUTHORIZATION' || failureClass === 'STALE_AUTHORITY' || failureClass === 'STATE_CONFLICT' || failureClass === 'DUPLICATE_RISK') return 'REVALIDATE';
  if (operationClass === 'WRITE') {
    if (!authorityCurrent || !destinationKnown || !idempotent) return 'REVALIDATE';
    if (['TRANSIENT','RATE_LIMIT','REMOTE_5XX','NETWORK','TIMEOUT'].includes(failureClass)) return 'QUEUE';
    return 'DENY';
  }
  if (operationClass === 'READ') {
    if (['TRANSIENT','RATE_LIMIT','REMOTE_5XX','NETWORK','TIMEOUT'].includes(failureClass)) return 'AUTO-RETRY';
    return 'REVALIDATE';
  }
  return 'DENY';
}

export function evaluateIdempotency({existingRecord,payloadFingerprint,destinationMatches=false,ambiguous=false}) {
  if (ambiguous) return {status:'RECONCILIATION_REQUIRED',write:false};
  if (!existingRecord) return {status:'NEW',write:true};
  if (existingRecord.payloadFingerprint !== payloadFingerprint) return {status:'CONFLICT',write:false};
  if (existingRecord.finalDisposition === 'COMPLETED' || destinationMatches) return {status:'IDEMPOTENT_SUCCESS_NOOP',write:false};
  return {status:'REVALIDATION_REQUIRED',write:false};
}

export function nextCommandState({state,authorityCurrent=true,destinationKnown=true,idempotencyValid=true,expired=false,humanReconfirmed=false}) {
  if (expired) return 'EXPIRED';
  if (state === 'RETRYABLE_FAILURE') {
    if (!authorityCurrent || !destinationKnown || !idempotencyValid) return 'REVALIDATION_REQUIRED';
    return 'READY';
  }
  if (state === 'HUMAN_RECONFIRM_REQUIRED') return humanReconfirmed ? 'AUTHORIZED' : 'HUMAN_RECONFIRM_REQUIRED';
  return state;
}

export function circuitTransition({state,consecutiveFailures=0,threshold=3,cooldownElapsed=false,probeSucceeded=false}) {
  if (state === 'CLOSED' && consecutiveFailures >= threshold) return 'OPEN';
  if (state === 'OPEN' && cooldownElapsed) return 'HALF_OPEN';
  if (state === 'HALF_OPEN' && probeSucceeded) return 'CLOSED';
  if (state === 'HALF_OPEN' && !probeSucceeded) return 'OPEN';
  return state;
}

export const CONNECTOR_REGISTRY = Object.freeze([
  {id:'MCP-GH-01',system:'GitHub',purpose:'Engineering governance/source control',status:'PARTIALLY_VERIFIED',criticality:'CORE'},
  {id:'MCP-VER-01',system:'Vercel',purpose:'Preview/deployment platform',status:'UNVERIFIED',criticality:'IMPORTANT'},
  {id:'MCP-SB-01',system:'Supabase',purpose:'Database/Auth platform',status:'UNVERIFIED',criticality:'CORE'},
  {id:'MCP-DRV-01',system:'Google Drive',purpose:'Controlled document access',status:'UNVERIFIED',criticality:'IMPORTANT'},
  {id:'MCP-CAL-01',system:'Google Calendar',purpose:'Academic scheduling',status:'UNVERIFIED',criticality:'IMPORTANT'},
  {id:'MCP-GML-01',system:'Gmail',purpose:'Email read/draft/send',status:'UNVERIFIED',criticality:'IMPORTANT'},
  {id:'MCP-FUT-00',system:'Future connector',purpose:'Undefined',status:'NOT_APPROVED',criticality:'OPTIONAL'}
]);
