import {NextRequest,NextResponse} from 'next/server';
import {loadPilotReadModel} from '../../../lib/hepe/pilot-read';

export async function GET(req:NextRequest){
 const model=await loadPilotReadModel();
 if(model.state!=='READY') return NextResponse.json({state:model.state},{status:model.state==='AUTH_REQUIRED'?401:403});
 const code=req.nextUrl.searchParams.get('courseCode');
 const course=code?model.courses.find((c:any)=>String(c.course_code)===code):model.courses[0];
 if(!course) return NextResponse.json({state:'COURSE_NOT_FOUND'},{status:404});
 const mappings=model.mappings.filter((m:any)=>String(m.course_code)===String(course.course_code)).map((m:any)=>({plo_code:m.plo_code,irm_level:m.irm_level,verification_status:m.verification_status??null}));
 return NextResponse.json({
  state:'READY',environment:'NON-PRODUCTION',readOnly:true,
  programme:{programme_code:model.programme.programme_code,title_th:model.programme.title_th,version_code:model.version.version_code},
  course:{course_code:course.course_code,title_th:course.title_th,title_en:course.title_en,credit_value:course.credit_value,credit_pattern:course.credit_pattern,course_role:course.course_role,group_name_th:course.group_name_th,verification_status:course.verification_status??null,description_th:null,description_status:'CONTROLLED_DESCRIPTION_NOT_AVAILABLE'},
  mappings,
  courses:model.courses.map((c:any)=>({course_code:c.course_code,title_th:c.title_th,title_en:c.title_en,credit_value:c.credit_value})),
  boundary:{canonicalWrite:false,aiAuthority:false,auditEvidenceAdmission:false,production:false}
 });
}
