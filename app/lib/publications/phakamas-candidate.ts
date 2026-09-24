import {type Publication} from "./panya-fixture";
/** Search candidate, not a verified canonical person record or confirmed identity mapping. */
export const PHAKAMAS_CANDIDATE = {
 key:"candidate:phakamas-ratanabuth",
 nameTh:"ผกามาศ รัตนบุษย์",
 suppliedRomanized:"Phakanas Ratanabuth",
 alternateSearchNames:["Phakanas Ratanabuth","Phakamas Ratanabuth","ผกามาศ รัตนบุษย์"],
 identityStatus:"NEEDS_IDENTITY_RECONCILIATION",
 source:"User-confirmed surname spelling: Ratanabuth; controlled curriculum bibliography has the Thai co-author string",
 notes:"No matching canonical academic_people row confirmed by exact Thai-name query. Existing DR.PHAKAMAS alias points to a separate unverified academic_person_id and must NOT be bound automatically."
} as const;
export const PHAKAMAS_CANDIDATES:Publication[]=[
 {id:"PHAKAMAS-TNCP-2017-CANDIDATE",yearBE:2560,
 title:"แนวโน้มของอัตราการเต้นของหัวใจ และการรับรู้ความอ่อนล้าของกล้ามเนื้อ ขณะทำการพัก การฝึกกีฬายิมนาสติก...",
 kind:"PROCEEDINGS",
 citation:"มณเฑียร อยู่เย็น, อุมาพร งามมีฤทธิ์, วัชระ รุ่งสว่าง, ปัญญา พุดซ้อน และผกามาศ รัตนบุษย์. (2560). TNCP2017, หน้า 338–347.",
 evidence:"SOURCE_VERIFIED",source:"มคอ.2 (7) หน้า 86; co-author name only",
 notes:"ชื่อผู้แต่งตรงตามเอกสารหลักสูตร แต่ยังต้องพิสูจน์ว่าเป็นบุคคลเดียวกัน ตรวจ proceedings ฉบับเต็ม วันเผยแพร่ และเกณฑ์ที่ใช้จริง",requiresSpecialPolicy:true}
];
