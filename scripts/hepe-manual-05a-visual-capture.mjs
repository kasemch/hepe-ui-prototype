import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base=process.env.HEPE_BASE_URL||'http://127.0.0.1:3000';
const bypass=process.env.VERCEL_BYPASS||'';
const outRoot=path.resolve('artifacts/hepe-manual-05a');
fs.mkdirSync(outRoot,{recursive:true});

const captures=[
  {id:'SS-CMD-01',route:'/'},
  {id:'SS-COURSE-01',route:'/my-courses'},
  {id:'SS-LRN-01',route:'/teaching'},
  {id:'SS-ASM-01',route:'/assessment'},
  {id:'SS-EVD-01',route:'/evidence'},
  {id:'SS-PLAN-01',route:'/plan-actual'},
  {id:'SS-TRC-01',route:'/traceability'},
  {id:'SS-HELP-01',route:'/help'}
];
const viewports=[
  {name:'desktop',width:1440,height:900},
  {name:'mobile',width:390,height:844}
];

const browser=await chromium.launch({headless:true});
const report=[];
try{
  for(const vp of viewports){
    const dir=path.join(outRoot,vp.name);fs.mkdirSync(dir,{recursive:true});
    const ctx=await browser.newContext({viewport:{width:vp.width,height:vp.height},extraHTTPHeaders:bypass?{'x-vercel-protection-bypass':bypass}:{}});
    for(const c of captures){
      const page=await ctx.newPage();
      const response=await page.goto(base+c.route,{waitUntil:'networkidle',timeout:45000});
      if(!response||!response.ok()) throw new Error(`HTTP_FAIL ${c.route} ${response?.status()}`);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2);
      if(overflow) throw new Error(`HORIZONTAL_OVERFLOW ${c.route} ${vp.width}`);
      const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();
      const severe=axe.violations.filter(v=>v.impact==='serious'||v.impact==='critical');
      if(severe.length) throw new Error(`AXE_SERIOUS_CRITICAL ${c.route} ${vp.width} ${severe.map(v=>v.id).join(',')}`);
      const bodyText=await page.locator('body').innerText();
      if(!bodyText.includes('NON-PRODUCTION')) throw new Error(`BOUNDARY_MISSING ${c.route}`);
      const state=(bodyText.match(/\b(AUTH_REQUIRED|VERIFIED|EMPTY|QUERY_ERROR|RUNTIME_NOT_CONFIGURED)\b/)||[])[1]||'NOT_APPLICABLE';
      const file=path.join(dir,`${c.id}.png`);
      await page.screenshot({path:file,fullPage:true});
      report.push({id:c.id,route:c.route,viewport:vp.name,width:vp.width,height:vp.height,state,overflow:false,axeSeriousCritical:0,file:path.relative(process.cwd(),file)});
      await page.close();
    }

    const tour=await ctx.newPage();
    const r=await tour.goto(base+'/',{waitUntil:'networkidle',timeout:45000});
    if(!r||!r.ok()) throw new Error(`HTTP_FAIL / ${r?.status()}`);
    await tour.getByRole('button',{name:'Guided tour'}).click();
    const dialog=tour.getByRole('dialog');
    await dialog.waitFor({state:'visible'});
    const focusInside=await tour.evaluate(()=>{const d=document.querySelector('[role="dialog"]');return !!d&&!!document.activeElement&&d.contains(document.activeElement)});
    if(!focusInside) throw new Error(`TOUR_FOCUS_NOT_INSIDE ${vp.name}`);
    const tourFile=path.join(dir,`SS-TOUR-${vp.name==='desktop'?'01':'02'}.png`);
    await tour.screenshot({path:tourFile,fullPage:true});
    await tour.keyboard.press('Escape');
    if(await dialog.isVisible().catch(()=>false)) throw new Error(`TOUR_ESCAPE_CLOSE_FAIL ${vp.name}`);
    report.push({id:vp.name==='desktop'?'SS-TOUR-01':'SS-TOUR-02',route:'/',viewport:vp.name,width:vp.width,height:vp.height,state:'TOUR_OPEN_VERIFIED',overflow:false,axeSeriousCritical:0,file:path.relative(process.cwd(),tourFile)});
    await tour.close();
    await ctx.close();
  }
  fs.writeFileSync(path.join(outRoot,'visual-capture-report.json'),JSON.stringify({environment:'NON-PRODUCTION',authenticatedHepeSession:false,vercelProtectionBypass:true,records:report},null,2));
  console.log(`HEPE_MANUAL_05A_RENDERED_VISUAL_CAPTURE_PASS records=${report.length}`);
  console.log('HEPE_MANUAL_05A_HEPE_AUTHENTICATED_SESSION=NOT_USED');
  console.log('HEPE_MANUAL_05A_IAM_MUTATION=NONE');
} finally {
  await browser.close();
}
