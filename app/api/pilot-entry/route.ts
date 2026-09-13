import { NextResponse } from 'next/server';
import { getHepeServerSupabase } from '../../../lib/hepe/server-supabase';

export const dynamic = 'force-dynamic';

type PilotBody = {
  kind?: 'delivery' | 'assessment_evidence';
  learningActivityVersionId?: string;
  assessmentVersionId?: string;
  academicYear?: string;
  termCode?: string;
  startsOn?: string;
  endsOn?: string | null;
  title?: string;
  effectiveFrom?: string;
};

export async function POST(request: Request) {
  const binding = await getHepeServerSupabase();
  if (!binding.ok) return NextResponse.json({ ok: false, code: 'RUNTIME_NOT_CONFIGURED' }, { status: 503 });

  const { data: userData, error: userError } = await binding.supabase.auth.getUser();
  if (userError || !userData.user) return NextResponse.json({ ok: false, code: 'AUTH_REQUIRED' }, { status: 401 });

  let body: PilotBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: 'INVALID_JSON' }, { status: 400 });
  }

  if (body.kind === 'delivery') {
    if (!body.learningActivityVersionId || !body.academicYear?.trim() || !body.termCode?.trim() || !body.startsOn) {
      return NextResponse.json({ ok: false, code: 'DELIVERY_FIELDS_REQUIRED' }, { status: 400 });
    }
    const { data, error } = await binding.supabase.rpc('hepe_pilot_record_delivery', {
      p_learning_activity_version_id: body.learningActivityVersionId,
      p_academic_year: body.academicYear.trim(),
      p_term_code: body.termCode.trim(),
      p_starts_on: body.startsOn,
      p_ends_on: body.endsOn || null,
    });
    if (error) return NextResponse.json({ ok: false, code: error.message || 'DELIVERY_WRITE_DENIED' }, { status: 403 });
    return NextResponse.json({ ok: true, kind: 'delivery', recordId: data });
  }

  if (body.kind === 'assessment_evidence') {
    if (!body.assessmentVersionId || !body.title?.trim()) {
      return NextResponse.json({ ok: false, code: 'ASSESSMENT_EVIDENCE_FIELDS_REQUIRED' }, { status: 400 });
    }
    const { data, error } = await binding.supabase.rpc('hepe_pilot_record_assessment_evidence', {
      p_assessment_version_id: body.assessmentVersionId,
      p_title: body.title.trim(),
      p_effective_from: body.effectiveFrom || null,
    });
    if (error) return NextResponse.json({ ok: false, code: error.message || 'ASSESSMENT_EVIDENCE_WRITE_DENIED' }, { status: 403 });
    return NextResponse.json({ ok: true, kind: 'assessment_evidence', records: data });
  }

  return NextResponse.json({ ok: false, code: 'UNSUPPORTED_PILOT_ENTRY_KIND' }, { status: 400 });
}
