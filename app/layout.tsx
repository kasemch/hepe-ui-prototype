export const metadata = {
  title: "HEPE Academic Command Center · NON-PRODUCTION",
  description: "HEPE Curriculum Governance & Development — controlled non-production preview"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body style={{margin:0,fontFamily:"system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:"#f4f7fb",color:"#172033"}}>
        {children}
      </body>
    </html>
  );
}
