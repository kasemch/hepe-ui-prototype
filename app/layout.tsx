import './globals.css';

export const metadata = {
  title: "HEPE Academic Command Center · NON-PRODUCTION",
  description: "HEPE Curriculum Governance & Development — controlled non-production academic workspace"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
