import "./globals.css";

export const metadata = {
  title: "HEPE Department Platform · Visual Pilot",
  description: "NON-PRODUCTION HEPE Department Platform visual and interactive pilot"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
