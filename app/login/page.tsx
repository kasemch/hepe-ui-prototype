export default function LoginPage() {
  return (
    <main style={{maxWidth:760,margin:"48px auto",padding:24}}>
      <section style={{background:"white",borderRadius:20,padding:28,boxShadow:"0 8px 28px rgba(15,23,42,.08)"}}>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:".08em",color:"#475569"}}>HEPE · IAM-09C</div>
        <h1 style={{marginBottom:8}}>เข้าสู่ระบบ HEPE</h1>
        <p style={{marginTop:0,color:"#475569"}}>Controlled Login UX Preparation · NON-PRODUCTION</p>

        <div style={{marginTop:28,padding:18,border:"1px solid #e2e8f0",borderRadius:14,background:"#f8fafc"}}>
          <label htmlFor="email" style={{display:"block",fontWeight:700,marginBottom:8}}>อีเมลมหาวิทยาลัย</label>
          <input id="email" name="email" type="email" placeholder="name@university.ac.th" disabled
            style={{width:"100%",boxSizing:"border-box",padding:"12px 14px",border:"1px solid #cbd5e1",borderRadius:10,background:"#f1f5f9"}} />
          <button disabled style={{marginTop:14,width:"100%",padding:"12px 16px",border:0,borderRadius:10,fontWeight:700,background:"#cbd5e1",color:"#475569"}}>
            ส่ง Magic Link / OTP (ยังไม่เปิดใช้งานจริง)
          </button>
        </div>

        <div style={{marginTop:24,padding:18,borderLeft:"4px solid #94a3b8",background:"#f8fafc"}}>
          <strong>Controlled behaviour</strong>
          <p style={{marginBottom:0,lineHeight:1.6}}>
            หน้านี้เป็น UX preparation เท่านั้น ไม่มีการสร้างผู้ใช้ ส่งอีเมล หรือเขียนข้อมูลลงฐานข้อมูล.
            Target flow คือ Invitation → Identity Verification → HEPE Profile → Role/Scope → Effective Permission → RLS.
          </p>
        </div>

        <p style={{marginTop:24,fontSize:14,color:"#64748b"}}>
          Authentication สำเร็จไม่ได้หมายถึงมีสิทธิ์ใช้งานระบบโดยอัตโนมัติ (Authenticated ≠ Authorized)
        </p>
      </section>
    </main>
  );
}
