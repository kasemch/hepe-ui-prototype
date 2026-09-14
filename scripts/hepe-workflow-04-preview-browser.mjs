import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base=process.env.PREVIEW_BASE_URL;
const bypass=process.env.VERCEL_BYPASS;
const routes=[['/','Academic Command Center'],['/pilot','Controlled Pilot Readiness'],['/programme','Programme Overview'],['/curriculum','Curriculum Structure'],['/study-plan','Study Plan'],['/traceability','PLO / Course Traceability'],['/mapping','PLO × Course / I-R-M'],['/evidence','Evidence Explorer'],['/qa','INSUFFICIENT VERIFIED EVIDENCE'],['/reviews','Review Queue'],['/calendar','Academic Tasks'],['/audit','Provenance'],['/ai','AI ADVISORY'],['/governance','Settings / Governance'],['/curriculum-import','AUTH_REQUIRED'],['/tqf3','มคอ.3'],['/tqf5','มคอ.5'],['/verification','ทวนสอบ'],['/tqf7','มคอ.7'],['/course-review','Course Review'],['/approval','Academic Approval Workflow'],['/documents','Document Preview, Print & Export'],['/improvement-hub','ข้อเสนอเพื่อการปรับปรุงหลักสูตร']];
const viewports=[['desktop',1440,900],['laptop',1024,800],['tablet',768,900],['mobile',390,844]];
const browser=await chromium.launch({headless:true});const failures=[];
for(const [vp,w,h] of viewports){
 const context=await browser.newContext({viewport:{width:w,height:h},extraHTTPHeaders:{'x-vercel-protection-bypass':bypass,'cache-control':'no-cache'}});
 for(const [path,marker] of routes){
  const page=await context.newPage();
  const res=await page.goto(base+path,{waitUntil:'networkidle',timeout:45000});
  const code=res?.status()??0,text=await page.locator('body').innerText();
  if(code!==200)failures.push(`${vp}:${path}:HTTP_${code}`);
  if(!text.includes(marker))failures.push(`${vp}:${path}:MARKER_MISSING`);
  if(!text.includes('NON-PRODUCTION'))failures.push(`${vp}:${path}:NON_PRODUCTION_MISSING`);
  const dims=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
  if(dims.sw>dims.cw+2)failures.push(`${vp}:${path}:HORIZONTAL_OVERFLOW:${dims.sw}/${dims.cw}`);
  if(await page.locator('h1').count()!==1)failures.push(`${vp}:${path}:H1_COUNT`);
  if(await page.locator('main').count()!==1)failures.push(`${vp}:${path}:MAIN_COUNT`);
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();
  const serious=axe.violations.filter(v=>['serious','critical'].includes(v.impact||''));
  if(serious.length)failures.push(`${vp}:${path}:AXE:${serious.map(v=>v.id).join(',')}`);
  await page.close();
 }
 await context.close();
}
await browser.close();
if(failures.length){console.error('PREVIEW_BROWSER_ACCEPTANCE_FAIL\n'+failures.join('\n'));process.exit(1);}
console.log('PREVIEW_RESPONSIVE_ACCEPTANCE_PASS viewports=1440,1024,768,390');
console.log('PREVIEW_SCOPED_AUTOMATED_ACCESSIBILITY_ACCEPTANCE_PASS wcag2a,wcag2aa serious_critical=0');
console.log('PREVIEW_FULL_ROUTE_BROWSER_ACCEPTANCE_PASS routes=23');
