import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base=(process.env.HEPE_BASE_URL||'').replace(/\/$/,'');
const bypass=process.env.VERCEL_BYPASS;
if(!base) throw new Error('HEPE_BASE_URL_MISSING');
if(!bypass) throw new Error('VERCEL_BYPASS_MISSING');

const browser=await chromium.launch({headless:true});
try {
  const viewports=[['desktop',1440,900],['tablet',768,900],['mobile',390,844]];
  for(const [name,width,height] of viewports){
    const context=await browser.newContext({viewport:{width,height},extraHTTPHeaders:{'x-vercel-protection-bypass':bypass}});
    const page=await context.newPage();
    const response=await page.goto(`${base}/help`,{waitUntil:'networkidle',timeout:45000});
    if(!response?.ok()) throw new Error(`HELP_HTTP_FAIL:${name}:${response?.status()}`);
    const body=(await page.locator('body').innerText()).replace(/\s+/g,' ');
    for(const expected of ['Help Center','NON-PRODUCTION','ROSTER_PENDING','No current record','Academic Responsibility vs System Authority','Evidence Candidate / NOT_ADMITTED']){
      if(!body.includes(expected)) throw new Error(`HELP_CONTENT_MISSING:${name}:${expected}`);
    }
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2);
    if(overflow) throw new Error(`HELP_HORIZONTAL_OVERFLOW:${name}`);
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();
    const severe=axe.violations.filter(v=>v.impact==='serious'||v.impact==='critical');
    if(severe.length) throw new Error(`HELP_AXE_SERIOUS_CRITICAL:${name}:${severe.map(v=>v.id).join(',')}`);
    console.log(`HELP_VIEWPORT_PASS:${name}:HTTP=${response.status()}:AXE=0:OVERFLOW=0`);
    await context.close();
  }

  const context=await browser.newContext({viewport:{width:1440,height:900},extraHTTPHeaders:{'x-vercel-protection-bypass':bypass}});
  const page=await context.newPage();
  const response=await page.goto(`${base}/`,{waitUntil:'networkidle',timeout:45000});
  if(!response?.ok()) throw new Error(`COMMAND_CENTER_HTTP_FAIL:${response?.status()}`);
  const text=(await page.locator('body').innerText()).replace(/\s+/g,' ');
  if(!text.includes('Help Center') || !text.includes('Route: /help')) throw new Error('HELP_COMMAND_CENTER_BINDING_MISSING');
  console.log('HELP_COMMAND_CENTER_BINDING_PASS');
  await context.close();
  console.log('HEPE_HELP_READINESS_VISUAL_PASS');
} finally {
  await browser.close();
}
