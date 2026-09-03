export const metadata = {
  title: "HEPE · BED-HEPE Prototype",
  description: "NON-PRODUCTION HEPE Curriculum Governance & Development prototype"
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
