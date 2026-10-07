import assert from 'node:assert/strict';
const required=[3,5,5,11];
function evaluate({hours,cycles=[true,true,true],fin='VERIFIED',evidence='VERIFIED',human=true,registration='REGISTERED',transfer=false,equivalence=false,versionMatch=true}){const reasons=[];hours.forEach((h,i)=>{if(h<required[i])reasons.push(`EPLC_YEAR${i+1}_INCOMPLETE`)});cycles.forEach((v,i)=>{if(!v)reasons.push(`PLC_CYCLE_${i+1}_INCOMPLETE`)});if(fin==='UNVERIFIED_REQUIREMENT')reasons.push('AUTHORITATIVE_REQUIREMENT_PENDING');if(fin==='INCOMPLETE')reasons.push('FINLIT_INCOMPLETE');if(evidence==='PENDING')reasons.push('EVIDENCE_PENDING');if(evidence==='REJECTED')reasons.push('EVIDENCE_REJECTED');if(transfer&&!equivalence)reasons.push('PROFESSIONAL_EQUIVALENCY_PENDING');if(!versionMatch)reasons.push('REQUIREMENT_VERSION_MISMATCH');const blocking=reasons.some(r=>r.includes('INCOMPLETE')||r==='EVIDENCE_REJECTED');if(blocking)return {status:'HOLD',reasons};if(reasons.length)return {status:'REVIEW',reasons};if(!human)return {status:'REVIEW',reasons:['HUMAN_CLEARANCE_PENDING']};return {status:'READY',reasons};}
const cases=[
 ['canonical pass',{hours:[3,5,5,11]},'READY'],
 ['24h but year1 low',{hours:[2,6,5,11]},'HOLD'],
 ['24h but year4 low',{hours:[3,5,6,10]},'HOLD'],
 ['cycle missing',{hours:[3,5,5,11],cycles:[true,true,false]},'HOLD'],
 ['FinLit authority pending',{hours:[3,5,5,11],fin:'UNVERIFIED_REQUIREMENT'},'REVIEW'],
 ['evidence pending',{hours:[3,5,5,11],evidence:'PENDING'},'REVIEW'],
 ['evidence rejected',{hours:[3,5,5,11],evidence:'REJECTED'},'HOLD'],
 ['human clearance pending',{hours:[3,5,5,11],human:false},'REVIEW'],
 ['interrupted registration alone is not failure',{hours:[3,5,5,11],registration:'INTERRUPTED'},'READY'],
 ['non-registration alone is not professional failure',{hours:[3,5,5,11],registration:'NOT_REGISTERED'},'READY'],
 ['transfer does not auto-equate professional requirement',{hours:[3,5,5,11],transfer:true,equivalence:false},'REVIEW'],
 ['approved professional equivalency may proceed',{hours:[3,5,5,11],transfer:true,equivalence:true},'READY'],
 ['requirement version mismatch requires review',{hours:[3,5,5,11],versionMatch:false},'REVIEW']
];
for(const [name,input,expected] of cases){const result=evaluate(input);assert.equal(result.status,expected,`${name}: expected ${expected}, got ${result.status}`);console.log(`PASS ${name}: ${result.status}`)}
assert.equal(evaluate({hours:[2,6,5,11]}).reasons.includes('EPLC_YEAR1_INCOMPLETE'),true,'stage minimum reason must be explicit');
assert.equal(evaluate({hours:[3,5,5,11],transfer:true}).reasons.includes('PROFESSIONAL_EQUIVALENCY_PENDING'),true,'transfer must require professional equivalency decision');
assert.equal(evaluate({hours:[3,5,5,11],versionMatch:false}).reasons.includes('REQUIREMENT_VERSION_MISMATCH'),true,'version mismatch must be explainable');
console.log(`HEPE-TPRS compliance acceptance: ${cases.length}/${cases.length} PASS + invariant assertions PASS`);
