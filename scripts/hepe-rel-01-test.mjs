import assert from 'node:assert/strict';
import {classifyRetry,evaluateIdempotency,nextCommandState,circuitTransition} from '../lib/governance/connector-resilience.mjs';

const tests=[];
const t=(id,fn)=>tests.push([id,fn]);

t('REL01-T01 READ timeout',()=>assert.equal(classifyRetry({operationClass:'READ',failureClass:'TIMEOUT'}),'AUTO-RETRY'));
t('REL01-T02 READ stale response',()=>assert.equal(classifyRetry({operationClass:'READ',failureClass:'STATE_CONFLICT'}),'REVALIDATE'));
t('REL01-T03 WRITE timeout before ack',()=>assert.equal(classifyRetry({operationClass:'WRITE',failureClass:'TIMEOUT'}),'QUEUE'));
t('REL01-T04 WRITE timeout after remote success',()=>assert.equal(evaluateIdempotency({existingRecord:{payloadFingerprint:'p',finalDisposition:'COMPLETED'},payloadFingerprint:'p',destinationMatches:true}).status,'IDEMPOTENT_SUCCESS_NOOP'));
t('REL01-T05 duplicate retry',()=>assert.equal(evaluateIdempotency({existingRecord:{payloadFingerprint:'p',finalDisposition:'COMPLETED'},payloadFingerprint:'p'}).write,false));
t('REL01-T06 idempotency key payload conflict',()=>assert.equal(evaluateIdempotency({existingRecord:{payloadFingerprint:'a'},payloadFingerprint:'b'}).status,'CONFLICT'));
t('REL01-T07 expired queued write',()=>assert.equal(classifyRetry({operationClass:'WRITE',failureClass:'NETWORK',expired:true}),'DENY'));
t('REL01-T08 authentication failure',()=>assert.equal(classifyRetry({operationClass:'READ',failureClass:'AUTHENTICATION'}),'REVALIDATE'));
t('REL01-T09 authorization failure',()=>assert.equal(classifyRetry({operationClass:'WRITE',failureClass:'AUTHORIZATION'}),'REVALIDATE'));
t('REL01-T10 stale human authority',()=>assert.equal(classifyRetry({operationClass:'HUMAN-GATED',failureClass:'STALE_AUTHORITY',authorityCurrent:false}),'HUMAN-RECONFIRM'));
t('REL01-T11 remote 5xx',()=>assert.equal(classifyRetry({operationClass:'READ',failureClass:'REMOTE_5XX'}),'AUTO-RETRY'));
t('REL01-T12 rate limit',()=>assert.equal(classifyRetry({operationClass:'WRITE',failureClass:'RATE_LIMIT'}),'QUEUE'));
t('REL01-T13 connector offline',()=>assert.equal(classifyRetry({operationClass:'WRITE',failureClass:'NETWORK',destinationKnown:false}),'REVALIDATE'));
t('REL01-T14 circuit opens',()=>assert.equal(circuitTransition({state:'CLOSED',consecutiveFailures:3,threshold:3}),'OPEN'));
t('REL01-T15 circuit half-open',()=>assert.equal(circuitTransition({state:'OPEN',cooldownElapsed:true}),'HALF_OPEN'));
t('REL01-T16 reconciliation success',()=>assert.equal(circuitTransition({state:'HALF_OPEN',probeSucceeded:true}),'CLOSED'));
t('REL01-T17 admin replay blocked',()=>assert.equal(classifyRetry({operationClass:'ADMIN',failureClass:'TIMEOUT'}),'NEVER-QUEUE'));
t('REL01-T18 destructive replay blocked',()=>assert.equal(classifyRetry({operationClass:'DESTRUCTIVE',failureClass:'TIMEOUT'}),'NEVER-QUEUE'));
t('REL01-T19 production replay blocked',()=>assert.equal(classifyRetry({operationClass:'PRODUCTION-SENSITIVE',failureClass:'TIMEOUT',productionAuthorized:false}),'DENY'));
t('REL01-T20 ambiguous destination',()=>assert.equal(evaluateIdempotency({existingRecord:null,payloadFingerprint:'p',ambiguous:true}).status,'RECONCILIATION_REQUIRED'));
t('REL01-T21 failed retry requires revalidation',()=>assert.equal(nextCommandState({state:'RETRYABLE_FAILURE',destinationKnown:false}),'REVALIDATION_REQUIRED'));
t('REL01-T22 human gate does not silently reauthorize',()=>assert.equal(nextCommandState({state:'HUMAN_RECONFIRM_REQUIRED',humanReconfirmed:false}),'HUMAN_RECONFIRM_REQUIRED'));
t('REL01-T23 unknown failure never safe retry',()=>assert.equal(classifyRetry({operationClass:'READ',failureClass:'UNKNOWN'}),'REVALIDATE'));

let passed=0;
for (const [id,fn] of tests) {
  try { fn(); console.log(`PASS ${id}`); passed++; }
  catch (e) { console.error(`FAIL ${id}: ${e.message}`); process.exitCode=1; }
}
console.log(`HEPE-REL-01 synthetic regression: ${passed}/${tests.length} PASS`);
if (passed !== tests.length) process.exit(1);
