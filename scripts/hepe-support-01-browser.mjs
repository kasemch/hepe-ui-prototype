import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base=process.env.SUPPORT_BASE_URL||'http://127.0.0.1:3000';
const bypass=process.env.VERCEL_BYPASS||'';
const routes=['/support','/support/new','/support/ticket/SUP-DEMO-001','/support/triage','/support/analytics','/support/known-issues'];
const viewports=[{width:1440,height:900},{width:1024,height:800},{width:768,height:900},{width:390,height:844}];
const browser=await chromium.launch({headless:true});
try{
 for(const vp of viewports){
  const ctx=await browser.newContext({viewport:vp,extraHTTPHeaders:bypass?{'x-vercel-protection-bypass':bypass}:{}});
  for(const route of routes){
   const page=await ctx.newPage();
   const response=await page.goto(base+route,{waitUntil:'networkidle',timeout:30000});
   if(!response||!response.ok()) throw new Error(`HTTP_FAIL ${route} ${response?.status()}`);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2);
   if(overflow) throw new Error(`HORIZONTAL_OVERFLOW ${route} ${vp.width}`);
   const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();
   const severe=result.violations.filter(v=>v.impact==='serious'||v.impact==='critical');
   if(severe.length) throw new Error(`AXE_SERIOUS_CRITICAL ${route} ${vp.width} ${severe.map(v=>v.id).join(',')}`);
   await page.close();
  }
  await ctx.close();
 }
 console.log(`SUPPORT_RESPONSIVE_ACCEPTANCE_PASS base=${base} routes=6 viewports=1440,1024,768,390`);
 console.log('SUPPORT_SCOPED_AUTOMATED_ACCESSIBILITY_ACCEPTANCE PASS wcag2a,wcag2aa serious_critical=0');
}finally{await browser.close()}
