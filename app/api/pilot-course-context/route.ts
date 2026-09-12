import {NextRequest,NextResponse} from 'next/server';
import {loadPilotReadModel} from '../../../lib/hepe/pilot-read';

type Snap={course_code:string;title_th:string;title_en:string;credit_value:number;credit_pattern:string;course_role:string;group_name_th:string;verification_status:string;mappings:{plo_code:string;irm_level:string;verification_status:string}[]};
const SNAPSHOT:Snap[]=[
 {course_code:'HED1501',title_th:'การสร้างเสริมสุขภาพส่วนบุคคล',title_en:'Personal Health Promotion',credit_value:3,credit_pattern:'3 (3-0-6)',course_role:'REQUIRED',group_name_th:'สุขศึกษา วิชาเอกบังคับ',verification_status:'VALIDATED',mappings:[{plo_code:'PLO3',irm_level:'I',verification_status:'SOURCE_VERIFIED'}]},
 {course_code:'HED2503',title_th:'เพศวิถีศึกษา',title_en:'Sexuality Education',credit_value:3,credit_pattern:'3 (3-0-6)',course_role:'REQUIRED',group_name_th:'สุขศึกษา วิชาเอกบังคับ',verification_status:'VALIDATED',mappings:[{plo_code:'PLO3',irm_level:'R',verification_status:'SOURCE_VERIFIED'}]},
 {course_code:'HED2504',title_th:'การจัดการเรียนรู้สุขศึกษา',title_en:'Health Education Learning Management',credit_value:3,credit_pattern:'3 (2-2-5)',course_role:'REQUIRED',group_name_th:'สุขศึกษา วิชาเอกบังคับ',verification_status:'VALIDATED',mappings:[{plo_code:'PLO4',irm_level:'R',verification_status:'SOURCE_VERIFIED'}]},
 {course_code:'HED3502',title_th:'ยาและยาเสพติด',title_en:'Drugs and Substance Abuse',credit_value:3,credit_pattern:'3 (3-0-6)',course_role:'REQUIRED',group_name_th:'สุขศึกษา วิชาเอกบังคับ',verification_status:'VALIDATED',mappings:[{plo_code:'PLO3',irm_level:'M',verification_status:'SOURCE_VERIFIED'}]},
 {course_code:'HED3504',title_th:'การส่งเสริมสุขภาพจิต',title_en:'Mental Health Promotion',credit_value:3,credit_pattern:'3 (3-0-6)',course_role:'REQUIRED',group_name_th:'สุขศึกษา วิชาเอกบังคับ',verification_status:'VALIDATED',mappings:[{plo_code:'PLO3',irm_level:'M',verification_status:'SOURCE_VERIFIED'}]},
 {course_code:'HED3505',title_th:'โปรแกรมสุขภาพในโรงเรียนและการประเมินผล',title_en:'School Health Program and Evaluation',credit_value:3,credit_pattern:'3 (3-0-6)',course_role:'REQUIRED',group_name_th:'สุขศึกษา วิชาเอกบังคับ',verification_status:'VALIDATED',mappings:[{plo_code:'PLO3',irm_level:'M',verification_status:'SOURCE_VERIFIED'}]},
 {course_code:'PED1101',title_th:'ปรัชญาพลศึกษาและกีฬา',title_en:'Physical Education and Sport Philosophy',credit_value:3,credit_pattern:'3 (3-0-6)',course_role:'REQUIRED',group_name_th:'พลศึกษา วิชาเอกบังคับ',verification_status:'VALIDATED',mappings:[{plo_code:'PLO3',irm_level:'I',verification_status:'SOURCE_VERIFIED'}]},
 {course_code:'PED1501',title_th:'การสอนยิมนาสติก',title_en:'Gymnastic Instructions',credit_value:2,credit_pattern:'2 (1-2-3)',course_role:'REQUIRED',group_name_th:'พลศึกษา วิชาเอกบังคับ',verification_status:'VALIDATED',mappings:[{plo_code:'PLO3',irm_level:'I',verification_status:'SOURCE_VERIFIED'}]}
];

function snapshotResponse(req:NextRequest){
 const code=req.nextUrl.searchParams.get('courseCode');
 const course=SNAPSHOT.find(c=>c.course_code===code)??SNAPSHOT[0];
 return NextResponse.json({
  state:'READY',environment:'NON-PRODUCTION',readOnly:true,sourceMode:'VERIFIED_CONTROLLED_SNAPSHOT',snapshotScope:'UAT_SUBSET',snapshotVersion:'2026-09-12',
  programme:{programme_code:'25510071103503',title_th:'ศษ.บ. สุขศึกษาและพลศึกษา',version_code:'2567-SOURCEB-VALIDATION'},
  course:{...course,description_th:null,description_status:'CONTROLLED_DESCRIPTION_NOT_AVAILABLE'},
  mappings:course.mappings,
  courses:SNAPSHOT.map(c=>({course_code:c.course_code,title_th:c.title_th,title_en:c.title_en,credit_value:c.credit_value})),
  boundary:{canonicalWrite:false,aiAuthority:false,auditEvidenceAdmission:false,production:false,rlsChanged:false}
 });
}

export async function GET(req:NextRequest){
 const model=await loadPilotReadModel();
 if(model.state==='AUTH_REQUIRED') return snapshotResponse(req);
 if(model.state!=='READY') return NextResponse.json({state:model.state},{status:403});
 const code=req.nextUrl.searchParams.get('courseCode');
 const course=code?model.courses.find((c:any)=>String(c.course_code)===code):model.courses[0];
 if(!course) return NextResponse.json({state:'COURSE_NOT_FOUND'},{status:404});
 const mappings=model.mappings.filter((m:any)=>String(m.course_code)===String(course.course_code)).map((m:any)=>({plo_code:m.plo_code,irm_level:m.irm_level,verification_status:m.verification_status??null}));
 return NextResponse.json({
  state:'READY',environment:'NON-PRODUCTION',readOnly:true,sourceMode:'AUTHENTICATED_LIVE_READ_MODEL',
  programme:{programme_code:model.programme.programme_code,title_th:model.programme.title_th,version_code:model.version.version_code},
  course:{course_code:course.course_code,title_th:course.title_th,title_en:course.title_en,credit_value:course.credit_value,credit_pattern:course.credit_pattern,course_role:course.course_role,group_name_th:course.group_name_th,verification_status:course.verification_status??null,description_th:null,description_status:'CONTROLLED_DESCRIPTION_NOT_AVAILABLE'},
  mappings,
  courses:model.courses.map((c:any)=>({course_code:c.course_code,title_th:c.title_th,title_en:c.title_en,credit_value:c.credit_value})),
  boundary:{canonicalWrite:false,aiAuthority:false,auditEvidenceAdmission:false,production:false,rlsChanged:false}
 });
}
