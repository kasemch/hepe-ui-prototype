import {notFound} from 'next/navigation';
import {helpArticles} from '../../../lib/help/hepe-help';

export function generateStaticParams(){return Object.keys(helpArticles).map(slug=>({slug}))}

export default async function HelpArticle({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const article=helpArticles[slug];if(!article)notFound();
 return <main className="help-shell"><a className="breadcrumb" href="/help">← Help Center</a><header className="help-hero compact"><div className="brand-kicker">HEPE · HELP ARTICLE</div><h1>{article.title}</h1><p>{article.summary}</p></header><div className="help-article-layout"><article className="help-article">{article.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}</article><aside className="help-side"><h2>ใช้งานร่วมกับระบบ</h2><p>กลับไปยังหน้าที่เกี่ยวข้องแล้วกด <strong>Guided tour</strong> เพื่อเรียนรู้ทีละขั้น</p><a className="button" href="/">กลับ My Workspace</a><a className="button help-secondary" href="/help/troubleshooting">Troubleshooting</a></aside></div><div className="firewall">Conversation ≠ Audit Evidence · Save ≠ Approval · Approval ≠ Production Authorization.</div></main>;
}
