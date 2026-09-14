import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

const E=process.env;
const admin=createClient(E.NEXT_PUBLIC_SUPABASE_URL,E.SUPABASE_ADMIN,{auth:{persistSession:false,autoRefreshToken:false}});
let prep=null,noauth=null,termId=null,offeringId=null,assignmentId=null,tempChairId=null,docId=null,improvementId=null,failure=null;
const marker=`HEPE-WORKFLOW-04-PREVIEW-${E.GITHUB_RUN_ID}`;
const fail=(m)=>{throw new Error(m)};
const sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));

async function persona(code){const {data,error}=await admin.from('wave6_persona_fixtures').select('persona_code,actor_id,external_identity_subject').eq('persona_code',code).single();if(error||!data)fail(`PERSONA_LOOKUP_FAILED:${code}:${error?.code??''}`);return data;}
async function synthetic(code){const email=`hepe-preview-${code.toLowerCase()}-${E.GITHUB_RUN_ID}-${crypto.randomBytes(4).toString('hex')}@example.invalid`;const password=crypto.randomBytes(32).toString('base64url');const {data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{hepe_synthetic_test:true,hepe_gate:'HEPE-WORKFLOW-04-PREVIEW',hepe_persona:code}});if(error||!data.user)fail(`AUTH_CREATE_FAILED:${code}`);return {uid:data.user.id,email,password};}
async function cookieFor(u){const jar=new Map();const ssr=createServerClient(E.NEXT_PUBLIC_SUPABASE_URL,E.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{cookies:{getAll(){return [...jar].map(([name,value])=>({name,value}))},setAll(v){for(const {name,value} of v)jar.set(name,value)}}});const {data,error}=await ssr.auth.signInWithPassword({email:u.email,password:u.password});if(error||!data.session)fail(`SIGNIN_FAILED:${error?.message??''}`);const cookie=[...jar].map(([k,v])=>`${k}=${v}`).join('; ');if(!cookie)fail('COOKIE_MISSING');return cookie;}
async function http(path,{cookie='',method='GET',body=null}={}){const headers={'cache-control':'no-cache','x-vercel-protection-bypass':E.VERCEL_BYPASS};if(cookie)headers.cookie=cookie;if(body!==null)headers['content-type']='application/json';const r=await fetch(E.PREVIEW_BASE_URL+path,{method,headers,body:body===null?undefined:JSON.stringify(body)});return {code:r.status,body:await r.text()};}

try{
 const {data:p,error:pe}=await admin.from('programmes').select('programme_id').eq('programme_code',E.TARGET_PROGRAMME_CODE).single();if(pe||!p)fail('PROGRAMME_NOT_FOUND');
 const {data:v,error:ve}=await admin.from('curriculum_versions').select('curriculum_version_id').eq('programme_id',p.programme_id).eq('version_code',E.TARGET_VERSION_CODE).single();if(ve||!v)fail('VERSION_NOT_FOUND');
 const {data:c,error:ce}=await admin.from('courses').select('course_id').eq('course_code',E.TARGET_COURSE_CODE).single();if(ce||!c)fail('COURSE_NOT_FOUND');
 prep={fixture:await persona('PREPARER_A'),user:await synthetic('PREPARER_A')};noauth={fixture:await persona('NO_AUTHORITY'),user:await synthetic('NO_AUTHORITY')};
 for(const x of [prep,noauth]){const {error}=await admin.from('actors').update({external_identity_subject:x.user.uid}).eq('actor_id',x.fixture.actor_id);if(error)fail(`ACTOR_REBIND_FAILED:${error.code}`);}
 const {data:t,error:te}=await admin.from('academic_terms').insert({academic_year:`SYN-PREVIEW-${E.GITHUB_RUN_ID}`,term_code:'SYN',term_label:'Synthetic Preview Closure',status:'DRAFT',source_type:'SYNTHETIC_TEST',source_reference:marker}).select('academic_term_id').single();if(te||!t)fail(`TERM_CREATE_FAILED:${te?.code??''}`);termId=t.academic_term_id;
 const {data:o,error:oe}=await admin.from('course_offerings').insert({programme_id:p.programme_id,curriculum_version_id:v.curriculum_version_id,course_id:c.course_id,academic_term_id:termId,offering_status:'DRAFT',source_status:'SYNTHETIC_TEST',source_reference:marker}).select('course_offering_id').single();if(oe||!o)fail(`OFFERING_CREATE_FAILED:${oe?.code??''}`);offeringId=o.course_offering_id;
 const {data:ia,error:iae}=await admin.from('instructor_assignments').insert({course_offering_id:offeringId,actor_id:prep.fixture.actor_id,assignment_role:'INSTRUCTOR',status:'ACTIVE',source_reference:marker}).select('instructor_assignment_id').single();if(iae||!ia)fail(`ASSIGNMENT_CREATE_FAILED:${iae?.code??''}`);assignmentId=ia.instructor_assignment_id;
 const {data:role,error:re}=await admin.from('roles').select('role_id').eq('role_code','PROGRAMME_CHAIR').single();if(re||!role)fail('CHAIR_ROLE_NOT_FOUND');
 const {data:ta,error:ae}=await admin.from('authority_assignments').insert({actor_id:prep.fixture.actor_id,role_id:role.role_id,authority_level_code:'A4',scope_type:'PROGRAMME',programme_id:p.programme_id,status:'ACTIVE',valid_from:new Date(Date.now()-2*60*1000).toISOString(),valid_until:new Date(Date.now()+20*60*1000).toISOString(),assignment_source:'DIRECT'}).select('authority_assignment_id,valid_from,valid_until').single();if(ae||!ta)fail(`TEMP_CHAIR_FAILED:${ae?.code??''}`);tempChairId=ta.authority_assignment_id;
 await sleep(2500);
 const prepCookie=await cookieFor(prep.user), noCookie=await cookieFor(noauth.user);
 const unauth=await http('/api/workflow-documents');if(unauth.code!==401||!unauth.body.includes('AUTH_REQUIRED'))fail(`DOC_UNAUTH_BOUNDARY_FAIL:${unauth.code}`);
 const d=await http('/api/workflow-documents',{cookie:prepCookie,method:'POST',body:{programme_id:p.programme_id,course_offering_id:offeringId,document_type:'TQF3',title:`Synthetic Preview Document ${E.GITHUB_RUN_ID}`,source_reference:marker}});if(d.code!==201||!d.body.includes('"state":"CREATED"')||!d.body.includes('"status":"DRAFT"'))fail(`DOC_POST_FAIL:${d.code}:${d.body.slice(0,200)}`);docId=JSON.parse(d.body).record.document_record_id;
 const dg=await http('/api/workflow-documents',{cookie:prepCookie});if(dg.code!==200||!dg.body.includes(docId))fail('DOC_GET_AUTH_FAIL');
 const ng=await http('/api/workflow-documents',{cookie:noCookie});if(ng.code!==200||ng.body.includes(docId))fail(`DOC_NOAUTH_BOUNDARY_FAIL:${ng.code}`);
 const imp=await http('/api/workflow-improvements',{cookie:prepCookie,method:'POST',body:{programme_id:p.programme_id,course_offering_id:offeringId,title:'Synthetic Preview Recommendation',category:'ASSESSMENT',description:'Synthetic preview acceptance only',priority:'MEDIUM',source_reference:marker}});if(imp.code!==201||!imp.body.includes('RECOMMENDATION_CANDIDATE'))fail(`IMPROVEMENT_POST_FAIL:${imp.code}:${imp.body.slice(0,200)}`);improvementId=JSON.parse(imp.body).item.improvement_item_id;
 const ni=await http('/api/workflow-improvements',{cookie:noCookie});if(ni.code!==200||ni.body.includes(improvementId))fail(`IMPROVEMENT_NOAUTH_BOUNDARY_FAIL:${ni.code}`);
 console.log('PREVIEW_AUTHENTICATED_RUNTIME_ACCEPTANCE_PASS documents=POST_GET_RLS improvements=POST_RLS noauthority=no_leak');
}catch(e){failure=e;console.error(`PREVIEW_AUTH_RUNTIME_FAIL:${e.message}`)}finally{
 if(improvementId)await admin.from('improvement_items').delete().eq('improvement_item_id',improvementId);
 if(docId)await admin.from('document_records').delete().eq('document_record_id',docId);
 if(tempChairId)await admin.from('authority_assignments').delete().eq('authority_assignment_id',tempChairId);
 if(assignmentId)await admin.from('instructor_assignments').delete().eq('instructor_assignment_id',assignmentId);
 if(offeringId)await admin.from('course_offerings').delete().eq('course_offering_id',offeringId);
 if(termId)await admin.from('academic_terms').delete().eq('academic_term_id',termId);
 for(const x of [prep,noauth])if(x){await admin.from('actors').update({external_identity_subject:x.fixture.external_identity_subject}).eq('actor_id',x.fixture.actor_id);await admin.auth.admin.deleteUser(x.user.uid);}
 const [dr,ir,or,tr]=await Promise.all([admin.from('document_records').select('*',{count:'exact',head:true}).eq('source_snapshot_reference',marker),admin.from('improvement_items').select('*',{count:'exact',head:true}).eq('source_reference',marker),admin.from('course_offerings').select('*',{count:'exact',head:true}).eq('source_reference',marker),admin.from('academic_terms').select('*',{count:'exact',head:true}).eq('source_reference',marker)]);
 for(const [name,r] of [['documents',dr],['improvements',ir],['offerings',or],['terms',tr]])if(r.error&&!failure)failure=new Error(`CLEANUP_COUNT_ERROR:${name}:${r.error.code}`);
 const dc=dr.count??0,ic=ir.count??0,oc=or.count??0,tc=tr.count??0;if((dc!==0||ic!==0||oc!==0||tc!==0)&&!failure)failure=new Error('CLEANUP_RESIDUAL');
 console.log(`PREVIEW_MANDATORY_CLEANUP_VERIFIED documents=${dc} improvements=${ic} offerings=${oc} terms=${tc}`);
}
if(failure)throw failure;
