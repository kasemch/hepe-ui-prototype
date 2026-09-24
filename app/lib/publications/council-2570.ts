import {type Publication} from "./panya-fixture";
export type ApprovalDateStatus = "UNCONFIRMED" | "EVIDENCE_VERIFIED";
export type WorkDecision = "OUTSIDE_WINDOW" | "DATE_UNRESOLVED" | "WORK_REVIEW" | "VERIFIED_COUNTABLE";
export type PersonDecision = "MEETS_PUBLICATION_COMPONENT" | "INSUFFICIENT_VERIFIED_WORKS" | "PENDING_EVIDENCE" | "PENDING_APPROVAL_DATE";
export type WorkReview = {publicationId:string; sourceVerified:boolean; eligibilityVerified:boolean; authorshipVerified:boolean; reviewedBy?:string; decisionReference?:string};
const ISO=/^\d{4}-\d{2}-\d{2}$/;
function dateParts(iso:string){if(!ISO.test(iso))return null;const [y,m,d]=iso.split("-").map(Number);const t=new Date(Date.UTC(y,m-1,d));if(t.getUTCFullYear()!==y||t.getUTCMonth()!==m-1||t.getUTCDate()!==d)return null;return t;}
function iso(d:Date){return d.toISOString().slice(0,10)}
/** Proposed continuous 5-year interval: from the day following the fifth anniversary to the council date inclusive.
 * Exact institutional counting convention must be validated before official adoption. */
export function fiveYearWindow(councilDate:string){
 const end=dateParts(councilDate);if(!end)return null;
 const anniversary=new Date(end.getTime());anniversary.setUTCFullYear(end.getUTCFullYear()-5);
 const start=new Date(anniversary.getTime());start.setUTCDate(start.getUTCDate()+1);
 return {start:iso(start),end:iso(end),years:Array.from({length:end.getUTCFullYear()-start.getUTCFullYear()+1},(_,i)=>start.getUTCFullYear()+i+543)};
}
export function assess2570Work(p:Publication,date:string,approvalStatus:ApprovalDateStatus,review?:WorkReview):{status:WorkDecision;reason:string}{
 const w=fiveYearWindow(date);
 if(!w||approvalStatus!=="EVIDENCE_VERIFIED")return {status:"DATE_UNRESOLVED",reason:"วันสภาอนุมัติยังไม่ยืนยันจากมติ/หลักฐาน จึงยังไม่ออกผลคุณสมบัติ"};
 // Known year entirely before/after interval can be excluded without fabricating an exact date.
 const first=`${p.yearBE-543}-01-01`,last=`${p.yearBE-543}-12-31`;
 if(last<w.start||first>w.end)return {status:"OUTSIDE_WINDOW",reason:"ปีเผยแพร่ทั้งปีอยู่นอกช่วงย้อนหลัง"};
 if(!p.publishedOn||!dateParts(p.publishedOn))return {status:"DATE_UNRESOLVED",reason:"ต้องมีวันที่เผยแพร่/วันที่อ้างอิงที่ใช้ได้ตามกฎ พร้อมเอกสารต้นฉบับ"};
 if(p.publishedOn<w.start||p.publishedOn>w.end)return {status:"OUTSIDE_WINDOW",reason:"วันที่เผยแพร่อยู่นอกช่วงย้อนหลัง"};
 if(!review?.sourceVerified||!review?.eligibilityVerified||!review?.authorshipVerified||!review.reviewedBy||!review.decisionReference)return {status:"WORK_REVIEW",reason:"อยู่ในช่วง แต่ยังต้องรับรองการเป็นผู้แต่ง ประเภทผลงาน การเผยแพร่ และผู้ตรวจ"};
 return {status:"VERIFIED_COUNTABLE",reason:"มีผลทวนสอบพร้อมที่มาครบสำหรับส่วนผลงาน (ยังไม่ใช่ผลรับรองคุณสมบัติทั้งหมด)"};
}
export function summarize2570(publications:Publication[],date:string,approvalStatus:ApprovalDateStatus,reviews:WorkReview[]=[],minimum=1){
 const rows=publications.map(p=>({publication:p,...assess2570Work(p,date,approvalStatus,reviews.find(r=>r.publicationId===p.id))}));
 const verified=rows.filter(r=>r.status==="VERIFIED_COUNTABLE").length;
 const uncertain=rows.some(r=>r.status==="DATE_UNRESOLVED"||r.status==="WORK_REVIEW");
 const status:PersonDecision=approvalStatus!=="EVIDENCE_VERIFIED"||!fiveYearWindow(date)?"PENDING_APPROVAL_DATE":verified>=minimum?"MEETS_PUBLICATION_COMPONENT":uncertain?"PENDING_EVIDENCE":"INSUFFICIENT_VERIFIED_WORKS";
 return {rows,verified,status,minimum,notOverallQualification:true};
}
