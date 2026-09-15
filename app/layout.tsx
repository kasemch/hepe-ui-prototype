import './globals.css';
import { headers } from 'next/headers';

async function isProductionRuntime(){
  const h=await headers();
  const host=(h.get('x-forwarded-host')??h.get('host')??'').split(':')[0].toLowerCase();
  return process.env.VERCEL_ENV==='production' || host==='hepe-ui-prototype.vercel.app' || host==='hepe-ui-prototype-kasemch-3467s-projects.vercel.app';
}

export async function generateMetadata(){
  const isProduction=await isProductionRuntime();
  return isProduction
    ? {
        title: 'HEPE Academic Command Center · PRODUCTION',
        description: 'HEPE Curriculum Governance & Development — governed production academic workspace'
      }
    : {
        title: 'HEPE Academic Command Center · CONTROLLED PREVIEW',
        description: 'HEPE Curriculum Governance & Development — controlled non-production preview workspace'
      };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
