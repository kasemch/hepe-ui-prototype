import {helpIndex} from '../../lib/help/hepe-help';

export default function HelpHome(){
 return <main className="help-shell"><header className="help-hero"><div className="brand-kicker">HEPE · LEARNING & USER SUPPORT</div><h1>Help Center</h1><p>เรียนรู้ระบบจากงานจริง: อ่าน → ทดลอง → ตรวจผล โดยคง NON-PRODUCTION, Human Authority และ Evidence-First boundaries</p><div className="hero-actions"><a className="button" href="/">กลับ My Workspace</a><a className="button secondary" href="/help/my-workspace">Quick Start</a></div></header><section className="help-grid" aria-label="Help articles">{helpIndex.map(a=><a className="help-card" href={`/help/${a.slug}`} key={a.slug}><span className="screen-tag">Help article</span><h2>{a.title}</h2><p>{a.summary}</p><span className="help-open">เปิดบทความ →</span></a>)}</section><div className="firewall">NON-PRODUCTION / TEST DATA ONLY · Help content does not create authority, approve records, admit Audit Evidence, or authorize Production.</div></main>;
}
