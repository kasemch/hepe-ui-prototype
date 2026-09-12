import {NextRequest,NextResponse} from 'next/server';
import {createHepeServerClient} from '../../../lib/hepe/server-supabase';

export async function GET(){
 const supabase=await createHepeServerClient();
 if(!supabase)return NextResponse.json({state:'RUNTIME_BINDING_UNAVAILABLE'},{status:503});
 const {data:userData}=await supabase.auth.getUser();
 if(!userData.user)return NextResponse.json({state:'AUTH_REQUIRED'},{status:401});
 const {data,error}=await supabase.from('improvement_items').select('improvement_item_id,programme_id,course_offering_id,item_type,category,title,status,priority,source_status,created_at,updated_at').order('updated_at',{ascending:false}).limit(50);
 if(error)return NextResponse.json({state:'AUTHORITY_DENIED',detail:error.code},{status:403});
 return NextResponse.json({state:'READY',environment:'NON-PRODUCTION',items:data??[],boundary:{production:false,auditEvidenceAdmission:false,canonicalWrite:false,aiAuthority:false}});
}

export async function POST(req:NextRequest){
 const supabase=await createHepeServerClient();
 if(!supabase)return NextResponse.json({state:'RUNTIME_BINDING_UNAVAILABLE'},{status:503});
 const {data:userData}=await supabase.auth.getUser();
 if(!userData.user)return NextResponse.json({state:'AUTH_REQUIRED'},{status:401});
 const body=await req.json().catch(()=>null) as any;
 if(!body?.programme_id||!body?.title||!body?.category)return NextResponse.json({state:'INVALID_INPUT'},{status:400});
 const {data,error}=await supabase.from('improvement_items').insert({programme_id:body.programme_id,course_offering_id:body.course_offering_id??null,item_type:body.item_type??'IMPROVEMENT_RECOMMENDATION',category:String(body.category),title:String(body.title),description:body.description??null,status:'RECOMMENDATION_CANDIDATE',priority:body.priority??'MEDIUM',source_status:body.source_status??'HUMAN_ENTERED',source_reference:body.source_reference??null}).select('improvement_item_id,programme_id,course_offering_id,item_type,category,title,status,priority,source_status').single();
 if(error)return NextResponse.json({state:'AUTHORITY_DENIED',detail:error.code},{status:403});
 return NextResponse.json({state:'CREATED',environment:'NON-PRODUCTION',item:data,boundary:{production:false,auditEvidenceAdmission:false,canonicalWrite:false,aiAuthority:false}},{status:201});
}
