import {NextRequest,NextResponse} from 'next/server';
import {createHepeServerClient} from '../../../lib/hepe/server-supabase';

function expose(row:any){return {...row,category:row.category_code,title:row.issue_text,status:row.item_status,priority:row.priority_code,source_status:row.provenance_status,governance_state:'RECOMMENDATION_CANDIDATE'};}

export async function GET(){
 const supabase=await createHepeServerClient();
 if(!supabase)return NextResponse.json({state:'RUNTIME_BINDING_UNAVAILABLE'},{status:503});
 const {data:userData}=await supabase.auth.getUser();
 if(!userData.user)return NextResponse.json({state:'AUTH_REQUIRED'},{status:401});
 const {data,error}=await supabase.from('improvement_items').select('improvement_item_id,programme_id,course_offering_id,category_code,source_kind,source_reference,provenance_status,issue_text,recommendation_text,priority_code,item_status,created_at,updated_at').order('updated_at',{ascending:false}).limit(50);
 if(error)return NextResponse.json({state:'AUTHORITY_DENIED',detail:error.code},{status:403});
 return NextResponse.json({state:'READY',environment:'NON-PRODUCTION',items:(data??[]).map(expose),schemaContract:'HEPE-WORKFLOW-04C',boundary:{production:false,auditEvidenceAdmission:false,canonicalWrite:false,aiAuthority:false}});
}

export async function POST(req:NextRequest){
 const supabase=await createHepeServerClient();
 if(!supabase)return NextResponse.json({state:'RUNTIME_BINDING_UNAVAILABLE'},{status:503});
 const {data:userData}=await supabase.auth.getUser();
 if(!userData.user)return NextResponse.json({state:'AUTH_REQUIRED'},{status:401});
 const body=await req.json().catch(()=>null) as any;
 if(!body?.programme_id||!body?.title||!body?.category)return NextResponse.json({state:'INVALID_INPUT'},{status:400});
 const sourceKind=body.source_kind==='AI_RECOMMENDATION'?'AI_RECOMMENDATION':'HUMAN_RECOMMENDATION';
 const {data,error}=await supabase.from('improvement_items').insert({programme_id:body.programme_id,course_offering_id:body.course_offering_id??null,category_code:String(body.category),source_kind:sourceKind,source_reference:body.source_reference??null,provenance_status:'DESIGN_CANDIDATE',issue_text:String(body.title),recommendation_text:body.description??null,priority_code:body.priority??'MEDIUM',item_status:'OPEN'}).select('improvement_item_id,programme_id,course_offering_id,category_code,source_kind,source_reference,provenance_status,issue_text,recommendation_text,priority_code,item_status').single();
 if(error)return NextResponse.json({state:'AUTHORITY_DENIED',detail:error.code},{status:403});
 return NextResponse.json({state:'CREATED',environment:'NON-PRODUCTION',item:expose(data),schemaContract:'HEPE-WORKFLOW-04C',boundary:{production:false,auditEvidenceAdmission:false,canonicalWrite:false,aiAuthority:false}},{status:201});
}
