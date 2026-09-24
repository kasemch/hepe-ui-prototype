export type PublicationKind = "JOURNAL" | "PROCEEDINGS" | "TEXTBOOK" | "OTHER";
export type EvidenceState = "SOURCE_VERIFIED" | "BIBLIOGRAPHIC_FOUND" | "NEEDS_ORIGINAL";
export type RuleDecision = "COUNTABLE" | "OUTSIDE_WINDOW" | "NEEDS_POLICY_REVIEW" | "NEEDS_EVIDENCE";
export type Publication = {
  id: string; yearBE: number; publishedOn?: string; title: string; kind: PublicationKind;
  citation: string; evidence: EvidenceState; source: string; url?: string;
  notes: string; requiresSpecialPolicy?: boolean;
};
export const PANYA_PERSON = {
  id:"10102cb3-3395-41a0-a3ff-73ad53c63fff",name:"ผศ.ปัญญา พุดซ้อน",
  identity:"VERIFIED_CONTROLLED_DOCUMENT", source:"Supabase academic_people", asOf:"2026-09-24"
} as const;
export const PANYA_PUBLICATIONS: Publication[] = [
  {id:"P-2022",yearBE:2565,title:"Enhancing Health and Well-Being with Buddhism Yoga Program for Autistic Students: A Case Study of Ramkhamhaeng University Demonstration School (Secondary Education)",kind:"PROCEEDINGS",citation:"Bootpo, W., Putsorn, P., Getmaro, C., & Bhungob, W. (2022). EDULEARN22 Proceedings, 8316–8323. DOI 10.21125/edulearn.2022.1976.",evidence:"BIBLIOGRAPHIC_FOUND",source:"EDULEARN22 / bibliographic DOI; original full-paper eligibility and conference organizer not adjudicated",url:"https://doi.org/10.21125/edulearn.2022.1976",notes:"2022 proceedings found; exact full-paper publication/acceptance date and applicable organizer rule require review",requiresSpecialPolicy:true},
  {id:"P-2021",yearBE:2564,title:"การจัดการความรู้สำหรับอาจารย์มหาวิทยาลัยของรัฐในเขตกรุงเทพมหานคร",kind:"JOURNAL",citation:"ชมสุภัค ครุฑกะ, วาสนา บุตรโพธิ์ และปัญญา พุดซ้อน. (2564). วารสารบัณฑิตวิทยาลัย มหาวิทยาลัยรามคำแหง ฉบับเทคโนโลยีการศึกษา 5(1), 89–102 (ม.ค.–มิ.ย. 2564).",evidence:"SOURCE_VERIFIED",source:"หลักสูตรวิทยาศาสตร์การกีฬา ปรับปรุง 2565 เล่มประทับตรา / มคอ.2 (8)",notes:"Full journal metadata in controlled curriculum PDF; journal/index eligibility and original publication date may need verification."},
  {id:"P-2017",yearBE:2560,title:"แนวโน้มของอัตราการเต้นของหัวใจ และการรับรู้ความอ่อนล้าของกล้ามเนื้อ ขณะทำการพัก การฝึกกีฬายิมนาสติก...",kind:"PROCEEDINGS",citation:"มณเฑียร อยู่เย็น และคณะ. (2560). TNCP2017, 6–7 กรกฎาคม 2560, หน้า 338–347.",evidence:"SOURCE_VERIFIED",source:"มคอ.2 (7), รายการประวัติผลงาน หน้า 86",notes:"Listed in controlled TQF2; original full proceedings and conference eligibility need review.",requiresSpecialPolicy:true},
  {id:"P-2016",yearBE:2559,title:"เทนนิส 1",kind:"TEXTBOOK",citation:"ปัญญา พุดซ้อน. (2559). เทนนิส 1. สำนักพิมพ์มหาวิทยาลัยรามคำแหง. ISBN 978-616-414-095-0.",evidence:"SOURCE_VERIFIED",source:"มคอ.2 (7), รายการประวัติผลงาน หน้า 86",notes:"Textbook record from curriculum; academic classification and approval require supporting original."}
];
export type WindowMode = "CALENDAR" | "ACADEMIC" | "FISCAL";
export function assess(item:Publication,yearBE:number,mode:WindowMode,policyConfirmed:boolean):{status:RuleDecision;reason:string} {
 const startYear=yearBE-4;
 if(mode==="FISCAL" && !item.publishedOn) return {status:"NEEDS_EVIDENCE",reason:"ไม่ทราบวันเผยแพร่ที่แน่นอนสำหรับรอบปีงบประมาณ"};
 const start=mode==="FISCAL"?`${startYear-544}-10-01`:null;
 const end=mode==="FISCAL"?`${yearBE-543}-09-30`:null;
 const inside=mode==="FISCAL" ? !!item.publishedOn&&item.publishedOn>=start!&&item.publishedOn<=end! : item.yearBE>=startYear&&item.yearBE<=yearBE;
 if(!inside)return {status:"OUTSIDE_WINDOW",reason:"อยู่นอกช่วงเวลา 5 ปีที่เลือก"};
 if(item.evidence==="NEEDS_ORIGINAL")return {status:"NEEDS_EVIDENCE",reason:"ต้องตรวจสอบหลักฐานต้นฉบับ"};
 if(item.requiresSpecialPolicy && !policyConfirmed)return {status:"NEEDS_POLICY_REVIEW",reason:"ต้องตรวจ Full paper วันเผยแพร่ และเกณฑ์การประชุมที่ใช้กับหลักสูตร"};
 return {status:"NEEDS_POLICY_REVIEW",reason:"ต้องตรวจประเภทผลงาน ความสัมพันธ์สาขา หลักฐานฉบับเต็ม และผู้มีอำนาจรับรองก่อนนับอย่างเป็นทางการ"};
}
export const defaultRule={degree:"BACHELOR_ACADEMIC_2565",minimum:1,reference:"เกณฑ์มาตรฐานหลักสูตรระดับปริญญาตรี พ.ศ. 2565 ข้อ 10.1.1",note:"Only publication component, not all teacher qualifications. Formal review date may differ."} as const;
