export const metadata = {
  title: "HEPE-TPRS · E-PLC & Financial Literacy",
  description: "HEPE Teacher Professional Readiness System — governed E-PLC, evidence, and Financial Literacy operations"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body style={{margin:0,fontFamily:"system-ui,sans-serif",background:"#f6f7f9",color:"#111827"}}>
        {children}
      </body>
    </html>
  );
}
