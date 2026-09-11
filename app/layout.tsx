import './globals.css';

export const metadata = {
  title: "HEPE Academic Command Center · NON-PRODUCTION",
  description: "HEPE Curriculum Governance & Development — evidence-first non-production academic governance platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <div className="environment-bar" role="status" aria-label="Environment status">
          <strong>NON-PRODUCTION</strong><span>·</span><span>TEST DATA ONLY</span><span>·</span><span>Production authorization not granted</span>
        </div>
        {children}
      </body>
    </html>
  );
}
