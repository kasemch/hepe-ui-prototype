import assert from 'node:assert/strict';
const required=[3,5,5,11];
function evaluate({hours,cycles=[true,true,true],fin='VERIFIED',evidence='VERIFIED',human=true}){const reasons=[];hours.forEach((h,i)=>{if(h<required[i])reasons.push(`EPLC_YEAR${i+1}_INCOMPLETE`)});cycles.forEach((v,i)=>{if(!v)reasons.push(`PLC_CYCLE_${i+1}_INCOMPLETE`)});if(fin==='UNVERIFIED_REQUIREMENT')reasons.push('AUTHORITATIVE_REQUIREMENT_PENDING');if(fin==='INCOMPLETE')reasons.push('FINLIT_INCOMPLETE');if(evidence==='PENDING')reasons.push('EVIDENCE_PENDING');if(evidence==='REJECTED')reasons.push('EVIDENCE_REJECTED');const blocking=reasons.some(r=>r.includes('INCOMPLETE')||r==='EVIDENCE_REJECTED');if(blocking)return {status:'HOLD',reasons};if(reasons.length)return {status:'REVIEW',reasons};if(!human)return {status:'REVIEW',reasons:['HUMAN_CLEARANCE_PENDING']};return {status:'READY',reasons:[]}}
const cases=[
 ['canonical pass',{hours:[3,5,5,11]},'READY'],
 ['24h but year1 low',{hours:[2,6,5,11]},'HOLD'],
 ['24h but year4 low',{hours:[3,5,6,10]},'HOLD'],
 ['cycle missing',{hours:[3,5,5,11],cycles:[true,true,false]},'HOLD'],
 ['FinLit authority pending',{hours:[3,5,5,11],fin:'UNVERIFIED_REQUIREMENT'},'REVIEW'],
 ['evidence pending',{hours:[3,5,5,11],evidence:'PENDING'},'REVIEW'],
 ['evidence rejected',{hours:[3,5,5,11],evidence:'REJECTED'},'HOLD'],
 ['human clearance pending',{hours:[3,5,5,11],human:false},'REVIEW']
];
for(const [name,input,expected] of cases){const actual=evaluate(input).status;assert.equal(actual,expected,`${name}: expected ${expected}, got ${actual}`);console.log(`PASS ${name}: ${actual}`)}
console.log(`HEPE-TPRS compliance acceptance: ${cases.length}/${cases.length} PASS`);
