import {NextRequest,NextResponse} from 'next/server';
import {createHepeServerClient} from '../../../lib/hepe/server-supabase';

export async function GET(){
 const supabase=await createHepeServerClient();
 if(!supabase)return NextResponse.json({state:'RUNTIME_BINDING_UNAVAILABLE'},{status:503});
 const {data:userData}=await supabase.auth.getUser();
 if(!userData.user)return NextResponse.json({state:'AUTH_REQUIRED'},{status:401});
 const {data,error}=await supabase.from('document_records').select('document_record_id,programme_id,course_offering_id,document_type,title,status,current_version_no,created_at,updated_at').order('updated_at',{ascending:false}).limit(50);
 if(error)return NextResponse.json({state:'AUTHORITY_DENIED',detail:error.code},{status:403});
 return NextResponse.json({state:'READY',environment:'NON-PRODUCTION',records:data??[],boundary:{production:false,auditEvidenceAdmission:false,canonicalWrite:false}});
}

export async function POST(req:NextRequest){
 const supabase=await createHepeServerClient();
 if(!supabase)return NextResponse.json({state:'RUNTIME_BINDING_UNAVAILABLE'},{status:503});
 const {data:userData}=await supabase.auth.getUser();
 if(!userData.user)return NextResponse.json({state:'AUTH_REQUIRED'},{status:401});
 const body=await req.json().catch(()=>null) as any;
 if(!body?.programme_id||!body?.document_type||!body?.title)return NextResponse.json({state:'INVALID_INPUT'},{status:400});
 const {data,error}=await supabase.from('document_records').insert({programme_id:body.programme_id,course_offering_id:body.course_offering_id??null,document_type:String(body.document_type),title:String(body.title),status:'DRAFT',source_status:'WORKING_RUNTIME',source_reference:body.source_reference??null}).select('document_record_id,programme_id,course_offering_id,document_type,title,status,current_version_no').single();
 if(error)return NextResponse.json({state:'AUTHORITY_DENIED',detail:error.code},{status:403});
 return NextResponse.json({state:'CREATED',environment:'NON-PRODUCTION',record:data,boundary:{production:false,auditEvidenceAdmission:false,canonicalWrite:false}},{status:201});
}
