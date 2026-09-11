import { createHepeServerClient } from './server-supabase';

export const PILOT_PROGRAMME_CODE='25510071103503';
export const PILOT_VERSION_CODE='2567-SOURCEB-VALIDATION';
export const SOURCE_SHA='f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557';

type AnyRow=Record<string,any>;
export async function loadPilotReadModel(){
 const supabase=await createHepeServerClient();
 if(!supabase) return {state:'RUNTIME_BINDING_UNAVAILABLE' as const};
 const {data:userData}=await supabase.auth.getUser();
 if(!userData.user) return {state:'AUTH_REQUIRED' as const};
 const {data:programme}=await supabase.from('programmes').select('programme_id,programme_code,title_th,title_en,status_code').eq('programme_code',PILOT_PROGRAMME_CODE).maybeSingle();
 if(!programme) return {state:'AUTHORITY_DENIED' as const};
 const {data:version}=await supabase.from('curriculum_versions').select('curriculum_version_id,version_code,status_code,is_current,approved_at,activated_at,effective_academic_period_id').eq('programme_id',programme.programme_id).eq('version_code',PILOT_VERSION_CODE).maybeSingle();
 if(!version) return {state:'AUTHORITY_DENIED' as const};
 const [{data:cc},{data:courses},{data:patterns},{data:groups},{data:memberships},{data:study},{data:mappings},{data:outcomes},{data:provenance},{data:summary}]=await Promise.all([
   supabase.from('curriculum_courses').select('curriculum_course_id,course_id,course_role,recommended_year,recommended_term,display_order').eq('curriculum_version_id',version.curriculum_version_id),
   supabase.from('courses').select('course_id,course_code,title_th,title_en,credit_value,status_code'),
   supabase.from('course_credit_patterns').select('curriculum_course_id,raw_credit_notation,credit_units,lecture_hours,practice_hours,self_study_hours,source_page,source_locator,verification_status'),
   supabase.from('curriculum_course_groups').select('course_group_id,group_code,group_name_th,group_name_en,parent_group_id,group_type,sequence_no,required_credits,selection_rule_raw,source_page,source_locator,verification_status').eq('curriculum_version_id',version.curriculum_version_id),
   supabase.from('curriculum_course_group_memberships').select('curriculum_course_id,course_group_id,membership_type,source_page,source_locator,verification_status'),
   supabase.from('study_plan_entries').select('study_plan_entry_id,academic_year_no,term_code,sequence_no,entry_kind,curriculum_course_id,course_group_id,choice_pool_id,raw_entry_text,required_credits,source_page,source_locator,verification_status').eq('curriculum_version_id',version.curriculum_version_id),
   supabase.from('curriculum_course_plo_mappings').select('course_plo_mapping_id,curriculum_course_id,plo_id,irm_level,source_page,source_locator,verification_status').eq('curriculum_version_id',version.curriculum_version_id),
   supabase.from('outcomes').select('outcome_id,canonical_code,outcome_type,status_code').eq('programme_id',programme.programme_id),
   supabase.from('curricular_provenance_bindings').select('entity_type,entity_id,source_document_id,source_sha256,source_locator,ingestion_batch_id,candidate_record_id,verification_status').eq('programme_id',programme.programme_id),
   supabase.from('v_hepe_ingest_validation_summary').select('*').eq('programme_code',PILOT_PROGRAMME_CODE).eq('version_code',PILOT_VERSION_CODE).maybeSingle(),
 ]);
 const ccRows=(cc??[]) as AnyRow[], courseRows=(courses??[]) as AnyRow[], patternRows=(patterns??[]) as AnyRow[], groupRows=(groups??[]) as AnyRow[], memberRows=(memberships??[]) as AnyRow[], outcomeRows=(outcomes??[]) as AnyRow[];
 const courseById=new Map(courseRows.map(x=>[x.course_id,x]));
 const ccById=new Map(ccRows.map(x=>[x.curriculum_course_id,x]));
 const patternByCC=new Map(patternRows.map(x=>[x.curriculum_course_id,x]));
 const groupById=new Map(groupRows.map(x=>[x.course_group_id,x]));
 const memberByCC=new Map(memberRows.map(x=>[x.curriculum_course_id,x]));
 const outcomeById=new Map(outcomeRows.map(x=>[x.outcome_id,x]));
 const courseList=ccRows.map(x=>{const c=courseById.get(x.course_id)||{};const p=patternByCC.get(x.curriculum_course_id)||{};const m=memberByCC.get(x.curriculum_course_id)||{};const g=groupById.get(m.course_group_id)||{};return {...x,...c,credit_pattern:p.raw_credit_notation??null,lecture_hours:p.lecture_hours??null,practice_hours:p.practice_hours??null,self_study_hours:p.self_study_hours??null,group_code:g.group_code??null,group_name_th:g.group_name_th??null,group_name_en:g.group_name_en??null,source_page:m.source_page??p.source_page??null,source_locator:m.source_locator??p.source_locator??null,verification_status:m.verification_status??p.verification_status??null};}).sort((a,b)=>String(a.course_code).localeCompare(String(b.course_code)));
 const studyList=((study??[]) as AnyRow[]).map(x=>{const ccx=ccById.get(x.curriculum_course_id)||{};const c=courseById.get(ccx.course_id)||{};const g=groupById.get(x.course_group_id)||{};return {...x,course_code:c.course_code??null,title_th:c.title_th??null,group_name_th:g.group_name_th??null};}).sort((a,b)=>(a.academic_year_no-b.academic_year_no)||String(a.term_code).localeCompare(String(b.term_code))||(a.sequence_no-b.sequence_no));
 const mappingList=((mappings??[]) as AnyRow[]).map(x=>{const ccx=ccById.get(x.curriculum_course_id)||{};const c=courseById.get(ccx.course_id)||{};const o=outcomeById.get(x.plo_id)||{};return {...x,course_code:c.course_code??null,title_th:c.title_th??null,plo_code:o.canonical_code??null};}).sort((a,b)=>String(a.plo_code).localeCompare(String(b.plo_code))||String(a.course_code).localeCompare(String(b.course_code)));
 return {state:'READY' as const,userId:userData.user.id,programme,version,summary,courses:courseList,groups:groupRows,studyPlan:studyList,mappings:mappingList,provenance:(provenance??[]) as AnyRow[]};
}
