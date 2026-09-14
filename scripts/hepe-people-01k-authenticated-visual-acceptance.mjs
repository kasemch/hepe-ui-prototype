import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

const E=process.env;
const required=['HEPE_BASE_URL','VERCEL_BYPASS','SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','SUPABASE_ADMIN','SYSTEM_ADMIN_ACTOR_ID','SYSTEM_ADMIN_ORIGINAL_SUBJECT','EXPECTED_APP_SHA'];
for(const k of required){if(!E[k])throw new Error(`ENV_MISSING:${k}`)}
const base=E.HEPE_BASE_URL.replace(/\/$/,'');
const out=path.resolve('artifacts/hepe-global-app-integration-01');
for(const v of ['desktop','tablet','mobile'])fs.mkdirSync(path.join(out,v),{recursive:true});
const admin=createClient(E.SUPABASE_URL,E.SUPABASE_ADMIN,{auth:{persistSession:false,autoRefreshToken:false}});
let createdUserId=null,rebound=false,failure=null;
const evidence={gate:'HEPE-COURSE-REGISTRY-01',environment:'NON-PRODUCTION',applicationSha:E.EXPECTED_APP_SHA,runnerSha:E.GITHUB_SHA||null,startedAt:new Date().toISOString(),actorId:E.SYSTEM_ADMIN_ACTOR_ID,authorityBaseline:null,authorityAfter:null,identityRestore:null,syntheticUserCleanup:null,results:[]};
const fail=m=>{throw new Error(m)};
async function actorSubject(){const {data,error}=await admin.from('actors').select('external_identity_subject').eq('actor_id',E.SYSTEM_ADMIN_ACTOR_ID).single();if(error||!data)fail('ACTOR_READ_FAILED');return data.external_identity_subject}
async function authorityCount(){const {count,error}=await admin.from('authority_assignments').select('*',{head:true,count:'exact'});if(error)fail('AUTHORITY_READ_FAILED');return count??0}
async function makeSession(email,password){const jar=new Map();const ssr=createServerClient(E.SUPABASE_URL,E.SUPABASE_PUBLISHABLE_KEY,{cookies:{getAll(){return [...jar].map(([name,value])=>({name,value}))},setAll(v){for(const {name,value} of v)jar.set(name,value)}}});const {data,error}=await ssr.auth.signInWithPassword({email,password});if(error||!data.user||!data.session)fail(`SIGNIN_FAILED:${error?.message||'unknown'}`);return [...jar].map(([name,value])=>({name,value,url:base}))}
const routes=[['SS-CMD-01','/'],['SS-PRG-01','/governance/programme-curriculum'],['SS-CRS-01','/governance/courses'],['SS-EVD-01','/governance/evidence'],['SS-RSP-01','/governance/responsibilities'],['SS-COV-01','/governance/responsibility-coverage'],['SS-REC-01','/governance/reconciliation'],['SS-EQV-01','/governance/course-equivalence'],['SS-UA-01','/user-access'],['SS-EA-01','/user-access/effective-access'],['SS-ACT-01','/user-access/activate']];
async function diagnostic(page,id,viewportName,body){const dir=path.join(out,viewportName);fs.writeFileSync(path.join(dir,`${id}-diagnostic.txt`),body);await page.screenshot({path:path.join(dir,`${id}-diagnostic.png`),fullPage:true});console.error(`PAGE_BODY_DIAGNOSTIC:${id}:${viewportName}:${body.slice(0,4000)}`)}
async function inspectPage(page,id,route,viewportName){
  const response=await page.goto(base+route,{waitUntil:'networkidle',timeout:45000});if(!response||!response.ok())fail(`HTTP_FAIL:${id}:${response?.status()}`);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2);if(overflow)fail(`HORIZONTAL_OVERFLOW:${id}:${viewportName}`);
  const body=(await page.locator('body').innerText()).replace(/\s+/g,' ').trim();
  if(/AUTH_REQUIRED/.test(body)){await diagnostic(page,id,viewportName,body);fail(`AUTH_REQUIRED_UNEXPECTED:${id}:${viewportName}`)}
  if(route==='/'){
    for(const expected of ['HEPE Curriculum Command Center','NON-PRODUCTION','AVAILABLE','AUTHORITY GATED','READ MODEL NOT AVAILABLE','Programme & Curriculum','Course Registry','PLO / CLO Mapping','Evidence Explorer','Traceability Explorer','Approval Queue','Help Center','Route: /governance/programme-curriculum','Route: /governance/courses','Route: /governance/evidence'])if(!body.includes(expected)){await diagnostic(page,id,viewportName,body);fail(`COMMAND_CENTER_EXPECTED_STATE_MISSING:${expected}:${viewportName}`)}
  }
  if(route==='/governance/programme-curriculum')for(const expected of ['Programme & Curriculum','25510071103503','2567-SOURCEB-VALIDATION','DRAFT','is_current = false','effective_from = —'])if(!body.includes(expected)){await diagnostic(page,id,viewportName,body);fail(`CURRICULUM_EXPECTED_STATE_MISSING:${expected}:${viewportName}`)}
  if(route==='/governance/courses')for(const expected of ['Course Registry','Registered courses','92','2567-SOURCEB-VALIDATION','Controlled-baseline note'])if(!body.includes(expected)){await diagnostic(page,id,viewportName,body);fail(`COURSE_REGISTRY_EXPECTED_STATE_MISSING:${expected}:${viewportName}`)}
  if(route==='/governance/evidence')for(const expected of ['Evidence Explorer','Visible evidence','UNVERIFIED','Current versions','Visibility or presence in this explorer does not admit an item to the Audit Evidence Set'])if(!body.includes(expected)){await diagnostic(page,id,viewportName,body);fail(`EVIDENCE_EXPECTED_STATE_MISSING:${expected}:${viewportName}`)}
  if(route==='/governance/responsibility-coverage'&&!/Source-B courses/.test(body)){await diagnostic(page,id,viewportName,body);fail(`COVERAGE_SUMMARY_MISSING:${viewportName}`)}
  if(route==='/governance/reconciliation'&&!/Reconciliation Queue/.test(body)){await diagnostic(page,id,viewportName,body);fail(`RECONCILIATION_TITLE_MISSING:${viewportName}`)}
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();const severe=axe.violations.filter(v=>v.impact==='serious'||v.impact==='critical');if(severe.length){await diagnostic(page,id,viewportName,body);fail(`AXE_SERIOUS_CRITICAL:${id}:${viewportName}:${severe.map(v=>v.id).join(',')}`)}
  const file=path.join(out,viewportName,`${id}.png`);await page.screenshot({path:file,fullPage:true});evidence.results.push({id,route,viewport:viewportName,httpStatus:response.status(),overflow:false,axeSeriousCritical:0,file});
}
try{
  const original=await actorSubject();if(original!==E.SYSTEM_ADMIN_ORIGINAL_SUBJECT)fail(`ACTOR_SUBJECT_PRECONDITION_FAILED:${original}`);evidence.authorityBaseline=await authorityCount();
  const email=`hepe-course-01-${E.GITHUB_RUN_ID||Date.now()}-${crypto.randomBytes(4).toString('hex')}@example.invalid`;const password=crypto.randomBytes(32).toString('base64url');
  const {data:u,error:ue}=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{hepe_synthetic_test:true,hepe_gate:'HEPE-COURSE-REGISTRY-01'}});if(ue||!u.user)fail(`SYNTHETIC_USER_CREATE_FAILED:${ue?.message||'unknown'}`);createdUserId=u.user.id;
  const reb=await admin.from('actors').update({external_identity_subject:createdUserId}).eq('actor_id',E.SYSTEM_ADMIN_ACTOR_ID);if(reb.error)fail('ACTOR_REBIND_FAILED');rebound=true;const cookies=await makeSession(email,password);const browser=await chromium.launch({headless:true});
  try{for(const [viewportName,viewport] of [['desktop',{width:1440,height:900}],['tablet',{width:768,height:900}],['mobile',{width:390,height:844}]]){const ctx=await browser.newContext({viewport,extraHTTPHeaders:{'x-vercel-protection-bypass':E.VERCEL_BYPASS}});await ctx.addCookies(cookies);for(const [id,route] of routes){const page=await ctx.newPage();await inspectPage(page,id,route,viewportName);await page.close()}await ctx.close()}}finally{await browser.close()}
  console.log('HEPE_COURSE_REGISTRY_01_AUTHENTICATED_VISUAL_PASS');
}catch(e){failure=e;console.error(`HEPE_COURSE_REGISTRY_01_FAIL:${e.message}`)}finally{
  try{if(rebound){const r=await admin.from('actors').update({external_identity_subject:E.SYSTEM_ADMIN_ORIGINAL_SUBJECT}).eq('actor_id',E.SYSTEM_ADMIN_ACTOR_ID);if(r.error)throw new Error('ACTOR_RESTORE_FAILED')}evidence.identityRestore=(await actorSubject())===E.SYSTEM_ADMIN_ORIGINAL_SUBJECT?'PASS':'FAIL'}catch(e){evidence.identityRestore='FAIL';if(!failure)failure=e}
  try{if(createdUserId){const d=await admin.auth.admin.deleteUser(createdUserId);if(d.error)throw new Error('SYNTHETIC_USER_DELETE_FAILED')}evidence.syntheticUserCleanup='PASS'}catch(e){evidence.syntheticUserCleanup='FAIL';if(!failure)failure=e}
  try{evidence.authorityAfter=await authorityCount();if(evidence.authorityAfter!==evidence.authorityBaseline)throw new Error('AUTHORITY_COUNT_CHANGED')}catch(e){if(!failure)failure=e}
  evidence.completedAt=new Date().toISOString();evidence.verdict=!failure&&evidence.identityRestore==='PASS'&&evidence.syntheticUserCleanup==='PASS'&&evidence.authorityAfter===evidence.authorityBaseline?'PASS':'FAIL';fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(evidence,null,2));
  console.log(`IDENTITY_RESTORE=${evidence.identityRestore}`);console.log(`SYNTHETIC_USER_CLEANUP=${evidence.syntheticUserCleanup}`);console.log(`AUTHORITY_BASELINE=${evidence.authorityBaseline}`);console.log(`AUTHORITY_AFTER=${evidence.authorityAfter}`);console.log(`HEPE_COURSE_REGISTRY_01_VERDICT=${evidence.verdict}`);
}
if(failure)throw failure;
