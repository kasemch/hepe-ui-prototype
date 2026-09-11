import { NextResponse } from 'next/server';
import { createHepeServerClient } from '../../../lib/hepe/server-supabase';

const PROGRAMME_CODE = '25510071103503';
const VERSION_CODE = '2567-SOURCEB-VALIDATION';

export async function GET() {
  const supabase = await createHepeServerClient();
  if (!supabase) {
    return NextResponse.json({ status: 'RUNTIME_NOT_CONFIGURED' }, { status: 503 });
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return NextResponse.json({ status: 'AUTH_REQUIRED' }, { status: 401 });
  }

  const { data: programmeAccess, error: programmeAccessError } = await supabase
    .from('programmes')
    .select('programme_id,programme_code')
    .eq('programme_code', PROGRAMME_CODE)
    .maybeSingle();

  if (programmeAccessError || !programmeAccess) {
    return NextResponse.json(
      { status: 'READ_MODEL_DENIED_OR_UNAVAILABLE', programmeAccess: 'DENIED' },
      { status: 403 },
    );
  }

  const [summaryResult, importResult] = await Promise.all([
    supabase
      .from('v_hepe_ingest_validation_summary')
      .select('*')
      .eq('programme_code', PROGRAMME_CODE)
      .eq('version_code', VERSION_CODE)
      .maybeSingle(),
    supabase
      .from('v_hepe_ingest_import_status')
      .select('*')
      .eq('programme_code', PROGRAMME_CODE)
      .eq('version_code', VERSION_CODE)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  if (summaryResult.error || importResult.error || !summaryResult.data) {
    return NextResponse.json(
      {
        status: 'READ_MODEL_DENIED_OR_UNAVAILABLE',
        summaryError: summaryResult.error?.code ?? null,
        importError: importResult.error?.code ?? null,
      },
      { status: 403 },
    );
  }

  return NextResponse.json(
    {
      status: 'VALIDATION_MODE',
      environment: 'NON-PRODUCTION',
      programmeCode: PROGRAMME_CODE,
      versionCode: VERSION_CODE,
      canonicalActivation: 'NOT_ATTEMPTED',
      publication: 'NOT_ATTEMPTED',
      auditEvidenceAdmission: 'NOT_ATTEMPTED',
      summary: summaryResult.data,
      importBatches: importResult.data ?? [],
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
