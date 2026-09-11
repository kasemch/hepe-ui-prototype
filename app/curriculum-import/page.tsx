import { createHepeServerClient } from '../../lib/hepe/server-supabase';

const source = {
  title: 'หลักสูตรศึกษาศาสตรบัณฑิต สาขาวิชาสุขศึกษาและพลศึกษา (4 ปี) (หลักสูตรปรับปรุง พ.ศ. 2567)',
  programmeCode: '25510071103503',
  versionCode: '2567-SOURCEB-VALIDATION',
  sha: 'f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557',
  effective: 'ภาคการศึกษาที่ 2 ปีการศึกษา 2567',
  council: 'สภามหาวิทยาลัยรามคำแหง ครั้งที่ 6/2567 วาระที่ 5.13 วันที่ 13 พฤษภาคม 2567',
};

const sections = [
  'Source Document',
  'Extracted Candidate',
  'Validation Results',
  'Course Registry',
  'Course Groups',
  'Study Plan',
  'PLO Registry',
  'I-R-M Matrix',
  'Provenance',
  'Conflict / Human Review',
  'Import Status',
];

export default async function CurriculumImportStudio() {
  const supabase = await createHepeServerClient();
  let authStatus = 'RUNTIME_NOT_CONFIGURED';
  let summary: Record<string, unknown> | null = null;
  let importState: Record<string, unknown> | null = null;

  if (supabase) {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      authStatus = 'AUTH_REQUIRED';
    } else {
      const [{ data: summaryData, error: summaryError }, { data: importData, error: importError }] = await Promise.all([
        supabase
          .from('v_hepe_ingest_validation_summary')
          .select('*')
          .eq('programme_code', source.programmeCode)
          .eq('version_code', source.versionCode)
          .maybeSingle(),
        supabase
          .from('v_hepe_ingest_import_status')
          .select('*')
          .eq('programme_code', source.programmeCode)
          .eq('version_code', source.versionCode)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);
      if (summaryError || importError) authStatus = 'AUTHORITY_DENIED_OR_READ_MODEL_UNAVAILABLE';
      else {
        authStatus = 'AUTHENTICATED_VALIDATION_READ';
        summary = summaryData as Record<string, unknown> | null;
        importState = importData as Record<string, unknown> | null;
      }
    }
  }

  const metrics = [
    ['Courses', summary?.course_count ?? '—', 'Expected controlled count: 92'],
    ['Course Groups', summary?.course_group_count ?? '—', 'Expected controlled count: 16'],
    ['Study Plan', summary?.study_plan_count ?? '—', 'Expected controlled count: 54'],
    ['Study-plan Credits', summary?.study_plan_credits ?? '—', 'Expected: 151'],
    ['PLO', summary?.plo_count ?? '—', 'Expected: 7'],
    ['Course→PLO I-R-M', summary?.irm_pair_count ?? '—', 'Approved controlled pairs: 99'],
  ];

  return (
    <main className="workspace">
      <div className="module-wrap">
        <a className="breadcrumb" href="/curriculum">← Curriculum</a>
        <section className="hero">
          <div className="brand-kicker">HEPE · CURRICULUM IMPORT STUDIO · NON-PRODUCTION</div>
          <h1>Controlled Curriculum Validation</h1>
          <p>{source.title}</p>
        </section>

        <div className="pill">NON-PRODUCTION · CONTROLLED VALIDATION · NOT ACTIVE</div>

        <div className="grid g2">
          <article className="card item-card">
            <div className="label">Source identity</div>
            <h2>{source.programmeCode}</h2>
            <p>Version: {source.versionCode}</p>
            <p>Effective: {source.effective}</p>
            <p>SHA-256: <code>{source.sha}</code></p>
            <p>{source.council}</p>
          </article>
          <article className="card item-card">
            <div className="label">Runtime / authority state</div>
            <h2>{authStatus}</h2>
            <p>Import state: {String(importState?.import_state ?? 'NOT READ')}</p>
            <p>Canonical activation: NOT ATTEMPTED</p>
            <p>Publication: NOT ATTEMPTED</p>
            <p>Audit Evidence admission: NOT ATTEMPTED</p>
          </article>
        </div>

        <div className="grid g2">
          {metrics.map(([name, value, note]) => (
            <article className="card item-card" key={String(name)}>
              <div className="label">Verified read model</div>
              <h2>{String(name)} · {String(value)}</h2>
              <p>{String(note)}</p>
            </article>
          ))}
        </div>

        <section className="card item-card">
          <div className="label">Review workflow</div>
          <h2>Source → Extracted → Normalized → Staged → Verification</h2>
          <p>No value is promoted to ACTIVE, PUBLISHED or Audit Evidence by this screen.</p>
        </section>

        <div className="grid g2">
          {sections.map((item) => (
            <article className="card item-card" key={item}>
              <div className="label">Curriculum Import Studio</div>
              <h2>{item}</h2>
              <p>Authority-aware validation surface. AI may explain, compare and flag discrepancies but cannot approve, activate, publish or admit evidence.</p>
            </article>
          ))}
        </div>

        <div className="firewall">Environment firewall · NON-PRODUCTION only · Validation data is not the active institutional curriculum · Human academic authority preserved.</div>
        <footer className="footer-note">Evidence-first · Source-bound · RLS-scoped · No automatic approval.</footer>
      </div>
    </main>
  );
}
