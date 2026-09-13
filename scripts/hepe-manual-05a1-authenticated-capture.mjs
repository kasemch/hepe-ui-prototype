import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

const E=process.env;
const required=['HEPE_BASE_URL','VERCEL_BYPASS','SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','SUPABASE_ADMIN','PREPARER_ACTOR_ID','PREPARER_ORIGINAL_SUBJECT'];
for(const k of required){if(!E[k])throw new Error(`ENV_MISSING:${k}`)}

const base=E.HEPE_BASE_URL.replace(/\/$/,'');
const out=path.resolve('artifacts/hepe-manual-05a1');
fs.mkdirSync(path.join(out,'desktop'),{recursive:true});
fs.mkdirSync(path.join(out,'mobile'),{recursive:true});
const admin=createClient(E.SUPABASE_URL,E.SUPABASE_ADMIN,{auth:{persistSession:false,autoRefreshToken:false}});
let createdUserId=null;
let rebound=false;
let failure=null;
const evidence={gate:'HEPE-MANUAL-05A.1',environment:'NON-PRODUCTION',applicationSha:E.GITHUB_SHA||null,startedAt:new Date().toISOString(),actorId:E.PREPARER_ACTOR_ID,authorityBaseline:null,authorityAfter:null,identityRestore:null,syntheticUserCleanup:null,results:[]};

const fail=m=>{throw new Error(m)};
async function actorSubject(){const {data,error}=await admin.from('actors').select('external_identity_subject').eq('actor_id',E.PREPARER_ACTOR_ID).single();if(error||!data)fail('ACTOR_READ_FAILED');return data.external_identity_subject}
async function authorityCount(){const {count,error}=await admin.from('authority_assignments').select('*',{head:true,count:'exact'}).eq('actor_id',E.PREPARER_ACTOR_ID).eq('status','ACTIVE');if(error)fail('AUTHORITY_READ_FAILED');return count??0}
async function makeSession(email,password){const jar=new Map();const ssr=createServerClient(E.SUPABASE_URL,E.SUPABASE_PUBLISHABLE_KEY,{cookies:{getAll(){return [...jar].map(([name,value])=>({name,value}))},setAll(v){for(const {name,value} of v)jar.set(name,value)}}});const {data,error}=await ssr.auth.signInWithPassword({email,password});if(error||!data.user||!data.session)fail(`SIGNIN_FAILED:${error?.message||'unknown'}`);return [...jar].map(([name,value])=>({name,value,url:base}))}

async function inspectPage(page,id,route,viewportName){
  const response=await page.goto(base+route,{waitUntil:'networkidle',timeout:45000});
  if(!response||!response.ok())fail(`HTTP_FAIL:${id}:${response?.status()}`);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2);
  if(overflow)fail(`HORIZONTAL_OVERFLOW:${id}:${viewportName}`);
  const authRequired=await page.getByText('AUTH_REQUIRED',{exact:true}).count();
  if(authRequired)fail(`AUTH_REQUIRED_UNEXPECTED:${id}:${viewportName}`);
  const state=await page.locator('.live-state').first().textContent().catch(()=>null);
  if(state&&state.trim()!=='VERIFIED')fail(`STATE_NOT_VERIFIED:${id}:${viewportName}:${state.trim()}`);
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();
  const severe=axe.violations.filter(v=>v.impact==='serious'||v.impact==='critical');
  if(severe.length)fail(`AXE_SERIOUS_CRITICAL:${id}:${viewportName}:${severe.map(v=>v.id).join(',')}`);
  const file=path.join(out,viewportName,`${id}.png`);
  await page.screenshot({path:file,fullPage:true});
  evidence.results.push({id,route,viewport:viewportName,state:state?.trim()||'NO_LIVE_STATE',overflow:false,axeSeriousCritical:0,file});
}

try{
  const original=await actorSubject();
  if(original!==E.PREPARER_ORIGINAL_SUBJECT)fail(`ACTOR_SUBJECT_PRECONDITION_FAILED:${original}`);
  evidence.authorityBaseline=await authorityCount();

  const {data:la,error:lae}=await admin.from('learning_activities').select('curriculum_course_id').eq('activity_code','SYN-LA01').single();
  if(lae||!la?.curriculum_course_id)fail('SYN_LA01_COURSE_NOT_FOUND');
  const courseId=la.curriculum_course_id;

  const email=`hepe-manual-05a1-${E.GITHUB_RUN_ID||Date.now()}-${crypto.randomBytes(4).toString('hex')}@example.invalid`;
  const password=crypto.randomBytes(32).toString('base64url');
  const {data:u,error:ue}=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{hepe_synthetic_test:true,hepe_gate:'HEPE-MANUAL-05A.1'}});
  if(ue||!u.user)fail(`SYNTHETIC_USER_CREATE_FAILED:${ue?.message||'unknown'}`);
  createdUserId=u.user.id;

  const reb=await admin.from('actors').update({external_identity_subject:createdUserId}).eq('actor_id',E.PREPARER_ACTOR_ID);
  if(reb.error)fail('ACTOR_REBIND_FAILED');
  rebound=true;

  const cookies=await makeSession(email,password);
  const routes=[
    ['SS-CMD-01','/'],
    ['SS-COURSE-01','/my-courses'],
    ['SS-COURSE-02',`/course-workspace/${courseId}`],
    ['SS-ENTRY-01A',`/pilot-entry?course=${courseId}`],
    ['SS-LRN-01','/teaching'],
    ['SS-ASM-01','/assessment'],
    ['SS-EVD-01','/evidence'],
    ['SS-PLAN-01','/plan-actual'],
    ['SS-TRC-01','/traceability']
  ];
  const browser=await chromium.launch({headless:true});
  try{
    for(const [viewportName,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]){
      const ctx=await browser.newContext({viewport,extraHTTPHeaders:{'x-vercel-protection-bypass':E.VERCEL_BYPASS}});
      await ctx.addCookies(cookies);
      for(const [id,route] of routes){const page=await ctx.newPage();await inspectPage(page,id,route,viewportName);await page.close()}
      const tour=await ctx.newPage();
      await tour.goto(base+'/',{waitUntil:'networkidle',timeout:45000});
      const launcher=tour.getByRole('button',{name:'Guided tour'});await launcher.focus();await launcher.click();
      const dialog=tour.getByRole('dialog');if(!(await dialog.isVisible()))fail(`TOUR_DIALOG_NOT_VISIBLE:${viewportName}`);
      const focusInside=await tour.evaluate(()=>Boolean(document.activeElement?.closest('[role="dialog"]')));if(!focusInside)fail(`TOUR_FOCUS_NOT_INSIDE:${viewportName}`);
      await tour.keyboard.press('Escape');if(await dialog.isVisible().catch(()=>false))fail(`TOUR_ESCAPE_FAILED:${viewportName}`);
      const restored=await launcher.evaluate(el=>document.activeElement===el);if(!restored)fail(`TOUR_FOCUS_RESTORE_FAILED:${viewportName}`);
      await tour.close();await ctx.close();
    }
  } finally {await browser.close()}
  console.log('HEPE_MANUAL_05A1_AUTHENTICATED_CAPTURE_PASS');
} catch(e){failure=e;console.error(`HEPE_MANUAL_05A1_FAIL:${e.message}`)} finally {
  try{
    if(rebound){const r=await admin.from('actors').update({external_identity_subject:E.PREPARER_ORIGINAL_SUBJECT}).eq('actor_id',E.PREPARER_ACTOR_ID);if(r.error)throw new Error('ACTOR_RESTORE_FAILED')}
    evidence.identityRestore=(await actorSubject())===E.PREPARER_ORIGINAL_SUBJECT?'PASS':'FAIL';
  }catch(e){evidence.identityRestore='FAIL';if(!failure)failure=e}
  try{
    if(createdUserId){const d=await admin.auth.admin.deleteUser(createdUserId);if(d.error)throw new Error('SYNTHETIC_USER_DELETE_FAILED')}
    evidence.syntheticUserCleanup='PASS';
  }catch(e){evidence.syntheticUserCleanup='FAIL';if(!failure)failure=e}
  try{evidence.authorityAfter=await authorityCount();if(evidence.authorityAfter!==evidence.authorityBaseline)throw new Error('AUTHORITY_COUNT_CHANGED')}catch(e){if(!failure)failure=e}
  evidence.completedAt=new Date().toISOString();evidence.verdict=!failure&&evidence.identityRestore==='PASS'&&evidence.syntheticUserCleanup==='PASS'&&evidence.authorityAfter===evidence.authorityBaseline?'PASS':'FAIL';
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(evidence,null,2));
  console.log(`IDENTITY_RESTORE=${evidence.identityRestore}`);console.log(`SYNTHETIC_USER_CLEANUP=${evidence.syntheticUserCleanup}`);console.log(`AUTHORITY_BASELINE=${evidence.authorityBaseline}`);console.log(`AUTHORITY_AFTER=${evidence.authorityAfter}`);console.log(`HEPE_MANUAL_05A1_VERDICT=${evidence.verdict}`);
}
if(failure)throw failure;
