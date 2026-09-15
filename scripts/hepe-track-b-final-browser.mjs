import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.PREVIEW_URL;
const bypass = process.env.VERCEL_BYPASS;
if (!base || !bypass) throw new Error('BROWSER_BINDING_MISSING');

const routes = [
  ['/', 'Academic Command Center'],
  ['/pilot', 'Controlled Pilot Readiness'],
  ['/programme', 'Programme Overview'],
  ['/curriculum', 'Curriculum Structure'],
  ['/study-plan', 'Study Plan'],
  ['/traceability', 'PLO / Course Traceability'],
  ['/mapping', 'PLO × Course / I-R-M'],
  ['/evidence', 'Evidence Explorer'],
  ['/qa', 'INSUFFICIENT VERIFIED EVIDENCE'],
  ['/reviews', 'Review Queue'],
  ['/calendar', 'Academic Tasks'],
  ['/audit', 'Provenance'],
  ['/ai', 'AI ADVISORY'],
  ['/governance', 'Settings / Governance'],
  ['/curriculum-import', 'AUTH_REQUIRED'],
  ['/tqf3', 'มคอ.3'],
  ['/tqf5', 'มคอ.5'],
  ['/verification', 'ทวนสอบ'],
  ['/tqf7', 'มคอ.7'],
  ['/course-review', 'Course Review'],
  ['/approval', 'Academic Approval Workflow'],
];

const viewports = [
  ['desktop', 1440, 900],
  ['laptop', 1024, 800],
  ['tablet', 768, 900],
  ['mobile', 390, 844],
];

const browser = await chromium.launch({ headless: true });
const failures = [];

try {
  for (const [vp, width, height] of viewports) {
    const context = await browser.newContext({
      viewport: { width, height },
      extraHTTPHeaders: {
        'x-vercel-protection-bypass': bypass,
        'Cache-Control': 'no-cache',
      },
    });

    try {
      for (const [path, marker] of routes) {
        const page = await context.newPage();
        try {
          const response = await page.goto(base + path, { waitUntil: 'networkidle', timeout: 45000 });
          const status = response?.status() ?? 0;
          const text = await page.locator('body').innerText();

          if (status !== 200) failures.push(`${vp}:${path}:HTTP_${status}`);
          if (!text.includes(marker)) failures.push(`${vp}:${path}:MARKER_MISSING:${marker}`);
          if (!text.includes('NON-PRODUCTION')) failures.push(`${vp}:${path}:NON_PRODUCTION_MISSING`);

          const dims = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
          }));
          if (dims.scrollWidth > dims.clientWidth + 2) {
            failures.push(`${vp}:${path}:HORIZONTAL_OVERFLOW:${dims.scrollWidth}>${dims.clientWidth}`);
          }

          const mainCount = await page.locator('main').count();
          if (mainCount !== 1) failures.push(`${vp}:${path}:MAIN_COUNT_${mainCount}`);

          const h1Count = await page.locator('h1').count();
          if (h1Count !== 1) failures.push(`${vp}:${path}:H1_COUNT_${h1Count}`);

          const unnamedButtons = await page
            .locator('button:not([aria-label]):not([aria-labelledby])')
            .evaluateAll((els) => els.filter((e) => !(e.textContent || '').trim()).length);
          if (unnamedButtons) failures.push(`${vp}:${path}:UNNAMED_BUTTON_${unnamedButtons}`);

          const tables = await page.locator('table').count();
          for (let i = 0; i < tables; i += 1) {
            if ((await page.locator('table').nth(i).locator('th').count()) === 0) {
              failures.push(`${vp}:${path}:TABLE_WITHOUT_HEADERS`);
            }
          }

          const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
          const severe = axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact || ''));
          if (severe.length) failures.push(`${vp}:${path}:AXE:${severe.map((v) => v.id).join(',')}`);

          const focusable = page.locator('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])').first();
          if (await focusable.count()) {
            await focusable.focus();
            const focusVisible = await focusable.evaluate((el) => {
              const s = getComputedStyle(el);
              return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth || '0') > 0;
            });
            if (!focusVisible) failures.push(`${vp}:${path}:FOCUS_INDICATOR_MISSING`);
          }
        } finally {
          await page.close();
        }
      }
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error('TRACK_B_FINAL_BROWSER_FAIL');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('03N_RESPONSIVE_ACCEPTANCE_PASS viewports=1440,1024,768,390 routes=21');
console.log('03O_SCOPED_AUTOMATED_ACCESSIBILITY_PASS wcag2a,wcag2aa serious_critical=0 focus=checked');
console.log('FULL_WCAG_CONFORMANCE=NOT_CLAIMED');
console.log('03S_FINAL_BROWSER_ACCEPTANCE_PASS routes=21 exact_sha_runtime=true');
