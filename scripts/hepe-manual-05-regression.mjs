import fs from 'node:fs';

const requiredFiles=['app/help/page.tsx','app/help/[slug]/page.tsx','components/HelpTools.tsx','lib/help/hepe-help.ts','app/help.css'];
const failures=[];
for(const file of requiredFiles){if(!fs.existsSync(file))failures.push(`missing:${file}`)}

const helpTools=fs.readFileSync('components/HelpTools.tsx','utf8');
const helpCss=fs.readFileSync('app/help.css','utf8');
const root=fs.readFileSync('app/page.tsx','utf8');
const courses=fs.readFileSync('app/my-courses/page.tsx','utf8');
const courseWorkspace=fs.readFileSync('app/course-workspace/[id]/page.tsx','utf8');
const pilot=fs.readFileSync('app/pilot-entry/PilotEntryClient.tsx','utf8');
const teaching=fs.readFileSync('app/teaching/page.tsx','utf8');
const assessment=fs.readFileSync('app/assessment/page.tsx','utf8');
const plan=fs.readFileSync('app/plan-actual/page.tsx','utf8');
const modules=fs.readFileSync('app/[module]/page.tsx','utf8');

const checks=[
 ['dialog role',helpTools.includes('role="dialog"')],
 ['aria modal',helpTools.includes('aria-modal="true"')],
 ['dialog label',helpTools.includes('aria-labelledby="hepe-tour-title"')],
 ['dialog description',helpTools.includes('aria-describedby="hepe-tour-body"')],
 ['help aria label',helpTools.includes('aria-label="Help tools"')],
 ['launcher dialog semantics',helpTools.includes('aria-haspopup="dialog"')&&helpTools.includes('aria-expanded={open}')],
 ['escape closure',helpTools.includes("event.key==='Escape'")],
 ['tab focus containment',helpTools.includes("event.key!=='Tab'")&&helpTools.includes('lastItem.focus()')&&helpTools.includes('firstItem.focus()')],
 ['focus restoration',helpTools.includes('launcherRef.current?.focus()')],
 ['mobile 900 breakpoint',helpCss.includes('@media(max-width:900px)')],
 ['mobile 620 breakpoint',helpCss.includes('@media(max-width:620px)')],
 ['workspace hero anchor',root.includes('data-tour="workspace-hero"')],
 ['my courses anchor',courses.includes('data-tour="courses-state"')],
 ['course workspace anchor',courseWorkspace.includes('data-tour="course-hero"')],
 ['quick entry teaching anchor',pilot.includes('data-tour="delivery-form"')],
 ['quick entry evidence anchor',pilot.includes('data-tour="evidence-form"')],
 ['teaching anchor',teaching.includes('data-tour="teaching-panel"')],
 ['assessment anchor',assessment.includes('data-tour="assessment-panel"')],
 ['plan actual anchor',plan.includes('data-tour="plan-panel"')],
 ['shared governance anchor',modules.includes('data-tour="module-live-panel"')],
 ['non-production disclosure',root.includes('NON-PRODUCTION')],
];
for(const [name,ok] of checks){if(!ok)failures.push(`failed:${name}`)}

if(failures.length){console.error('HEPE-MANUAL-05 REGRESSION FAIL');for(const f of failures)console.error(`- ${f}`);process.exit(1)}
console.log(`HEPE-MANUAL-05 REGRESSION PASS (${checks.length} checks)`);
