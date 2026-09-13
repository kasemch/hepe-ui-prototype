import './globals.css';
import './help.css';
import './accessibility-overrides.css';
import HelpTools from '../components/HelpTools';

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
        <HelpTools />
        {children}
      </body>
    </html>
  );
}
