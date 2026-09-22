export default function Tqf3ReviewPage() {
  const clos = [
    { code: "CLO1", text: "อธิบายพัฒนาการทางเพศของวัยรุ่น ความหลากหลายทางเพศ บทบาท และสิทธิทางเพศโดยใช้ข้อมูลที่ถูกต้องและเคารพความแตกต่างระหว่างบุคคล" },
    { code: "CLO2", text: "วิเคราะห์สถานการณ์เกี่ยวกับการตั้งครรภ์ไม่พร้อม การป้องกันการตั้งครรภ์ การยุติการตั้งครรภ์ และโรคติดต่อทางเพศสัมพันธ์เพื่อเลือกแนวทางส่งเสริมสุขภาวะทางเพศอย่างเหมาะสม" },
    { code: "CLO3", text: "ประยุกต์หลักการสื่อสารและการให้คำปรึกษาทางเพศในการตอบสนองต่อสถานการณ์ของผู้เรียนโดยคำนึงถึงสิทธิ ความหลากหลาย ความเป็นส่วนตัว และจริยธรรม" },
    { code: "CLO4", text: "ออกแบบแนวทางการจัดการเรียนรู้เพศวิถีและวิธีวัดและประเมินผลที่สอดคล้องกับเนื้อหาและผลลัพธ์การเรียนรู้ของผู้เรียน" }
  ];

  const assessments = [
    ["Role Play: Sexual Counseling", "CLO3", "20%"],
    ["Sexuality Board Game / Case-based Activity", "CLO1, CLO2", "20%"],
    ["Micro-teaching Sexuality Education", "CLO4", "20%"],
    ["Summative Assessment", "CLO1–CLO4", "40%"]
  ];

  const weeks = [
    ["1", "แนวคิดพื้นฐานเพศวิถีศึกษา พัฒนาการทางเพศของวัยรุ่น", "CLO1"],
    ["2", "เพศสภาพ อัตลักษณ์ ความหลากหลายทางเพศ และการเคารพความแตกต่าง", "CLO1"],
    ["3", "บทบาท สิทธิทางเพศ ความยินยอม และความสัมพันธ์ที่เคารพกัน", "CLO1, CLO3"],
    ["4", "การป้องกันการตั้งครรภ์และการตัดสินใจด้านสุขภาวะทางเพศ", "CLO2"],
    ["5", "การตั้งครรภ์ไม่พร้อมและการยุติการตั้งครรภ์", "CLO2, CLO3"],
    ["6", "โรคติดต่อทางเพศสัมพันธ์ การป้องกัน และการสื่อสารความเสี่ยง", "CLO2"],
    ["7", "เจตคติทางเพศ ความเชื่อ อคติ และการรู้เท่าทันข้อมูล", "CLO1, CLO2"],
    ["8", "สรุปและประเมินระหว่างภาค", "CLO1, CLO2"],
    ["9", "หลักการสื่อสารและการให้คำปรึกษาทางเพศ", "CLO3"],
    ["10", "การให้คำปรึกษาทางเพศในสถานการณ์ของผู้เรียน", "CLO3"],
    ["11", "หลักการจัดการเรียนรู้เพศวิถีศึกษาและการสร้างพื้นที่ปลอดภัย", "CLO4"],
    ["12", "การวัดและประเมินผลการเรียนรู้ด้านเพศวิถี", "CLO4"],
    ["13", "การออกแบบ Micro-teaching เพศวิถีศึกษา", "CLO4"],
    ["14", "Micro-teaching และการให้ข้อมูลย้อนกลับ", "CLO4"],
    ["15", "สังเคราะห์การเรียนรู้ การประเมินปลายภาค และการสะท้อนเพื่อปรับปรุง", "CLO1–CLO4"]
  ];

  const card = {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 1px 2px rgba(0,0,0,.04)"
  } as const;

  const badge = (tone: "ok" | "warn" | "block") => ({
    display: "inline-block",
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    background: tone === "ok" ? "#ecfdf5" : tone === "warn" ? "#fffbeb" : "#fef2f2",
    color: tone === "ok" ? "#065f46" : tone === "warn" ? "#92400e" : "#991b1b"
  }) as const;

  return (
    <main style={{maxWidth:1180,margin:"0 auto",padding:"32px 20px 64px"}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div>
          <div style={{fontSize:13,color:"#6b7280",fontWeight:700}}>TQF3-REVIEW-06 · HUMAN REVIEW WORKSPACE</div>
          <h1 style={{margin:"8px 0 4px"}}>HED2503 · เพศวิถีศึกษา</h1>
          <div style={{color:"#6b7280"}}>ภาค 1/2569 · มคอ.3 Version 8 · DESIGN_CANDIDATE</div>
        </div>
        <div style={{textAlign:"right"}}>
          <span style={badge("warn")}>DRAFT / UNDER HUMAN REVIEW</span>
          <div style={{marginTop:8,fontSize:13,color:"#6b7280"}}>Authoritative export: LOCKED</div>
        </div>
      </div>

      <section style={{...card,marginTop:24,borderColor:"#fecaca",background:"#fff7f7"}}>
        <h2 style={{marginTop:0}}>Blocking Human Gates</h2>
        <div style={{display:"grid",gap:10}}>
          <div><span style={badge("block")}>BLOCKING</span> <strong>OFFICIAL_PLO_SOURCE_MISSING</strong> — ยังไม่มี PLO canonical และ CLO–PLO/I-R-M mapping ที่ยืนยันแล้ว</div>
          <div><span style={badge("block")}>BLOCKING</span> <strong>CREDIT_PATTERN_CONFLICT</strong> — canonical 3(3-0-6) ขัดกับ working source 3(2-2-5)</div>
        </div>
      </section>

      <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginTop:18}}>
        <div style={card}><div style={{color:"#6b7280",fontSize:13}}>CLO</div><div style={{fontSize:28,fontWeight:800}}>4</div><span style={badge("ok")}>Complete</span></div>
        <div style={card}><div style={{color:"#6b7280",fontSize:13}}>Assessment Weight</div><div style={{fontSize:28,fontWeight:800}}>100%</div><span style={badge("ok")}>Aligned</span></div>
        <div style={card}><div style={{color:"#6b7280",fontSize:13}}>Teaching Plan</div><div style={{fontSize:28,fontWeight:800}}>15 weeks</div><span style={badge("ok")}>Complete</span></div>
        <div style={card}><div style={{color:"#6b7280",fontSize:13}}>Workload</div><div style={{fontSize:28,fontWeight:800}}>45 + 90</div><span style={badge("ok")}>3(3-0-6)</span></div>
      </section>

      <section style={{...card,marginTop:18}}>
        <h2 style={{marginTop:0}}>Provisional CLO</h2>
        <div style={{display:"grid",gap:12}}>
          {clos.map((clo) => (
            <div key={clo.code} style={{padding:14,border:"1px solid #e5e7eb",borderRadius:12}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
                <strong>{clo.code}</strong><span style={badge("warn")}>PROVISIONAL</span>
              </div>
              <p style={{marginBottom:0,lineHeight:1.7}}>{clo.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{...card,marginTop:18,overflowX:"auto"}}>
        <h2 style={{marginTop:0}}>CLO–Assessment Alignment</h2>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:680}}>
          <thead><tr>
            {["Assessment","CLO","Weight","Status"].map((h)=><th key={h} style={{textAlign:"left",padding:10,borderBottom:"1px solid #d1d5db"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {assessments.map((a)=><tr key={a[0]}>
              <td style={{padding:10,borderBottom:"1px solid #f3f4f6"}}>{a[0]}</td>
              <td style={{padding:10,borderBottom:"1px solid #f3f4f6"}}>{a[1]}</td>
              <td style={{padding:10,borderBottom:"1px solid #f3f4f6"}}>{a[2]}</td>
              <td style={{padding:10,borderBottom:"1px solid #f3f4f6"}}><span style={badge("warn")}>PROVISIONAL</span></td>
            </tr>)}
          </tbody>
        </table>
      </section>

      <section style={{...card,marginTop:18,overflowX:"auto"}}>
        <h2 style={{marginTop:0}}>15-Week Teaching Plan</h2>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:760}}>
          <thead><tr>
            {["Week","Topic","CLO","PLO"].map((h)=><th key={h} style={{textAlign:"left",padding:10,borderBottom:"1px solid #d1d5db"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {weeks.map((w)=><tr key={w[0]}>
              <td style={{padding:10,borderBottom:"1px solid #f3f4f6"}}>{w[0]}</td>
              <td style={{padding:10,borderBottom:"1px solid #f3f4f6"}}>{w[1]}</td>
              <td style={{padding:10,borderBottom:"1px solid #f3f4f6"}}>{w[2]}</td>
              <td style={{padding:10,borderBottom:"1px solid #f3f4f6",color:"#991b1b"}}>Pending official PLO</td>
            </tr>)}
          </tbody>
        </table>
      </section>

      <section style={{...card,marginTop:18}}>
        <h2 style={{marginTop:0}}>Curriculum Improvement</h2>
        <div style={{display:"grid",gap:10}}>
          <div><strong>CLO_GAP</strong> — ทบทวนและรับรอง CLO Candidate ทั้ง 4 ข้อในกระบวนการหลักสูตร</div>
          <div><strong>IRM_GAP</strong> — ยืนยัน PLO ทางการและจัดทำ CLO–PLO / I-R-M mapping ก่อนใช้สรุป PLO attainment</div>
        </div>
      </section>

      <section style={{...card,marginTop:18}}>
        <h2 style={{marginTop:0}}>Human Decision</h2>
        <p style={{color:"#6b7280"}}>Prototype UI only. การตัดสินใจจริงต้องผ่าน authenticated authority และบันทึกลง Supabase review workflow</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {["Accept","Edit","Reject","Request Evidence"].map((label)=>(
            <button key={label} disabled style={{padding:"10px 14px",borderRadius:10,border:"1px solid #d1d5db",background:"#f9fafb",color:"#6b7280",fontWeight:700}}>
              {label}
            </button>
          ))}
          <button disabled style={{padding:"10px 14px",borderRadius:10,border:"1px solid #fecaca",background:"#fef2f2",color:"#991b1b",fontWeight:800}}>
            Export DOCX / PDF — LOCKED
          </button>
        </div>
      </section>

      <footer style={{marginTop:24,color:"#6b7280",fontSize:12}}>
        NON-PRODUCTION · Review session: 8c29c180-7b42-4da7-ae32-663287866dc2
      </footer>
    </main>
  );
}
