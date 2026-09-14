export const metadata = {
  title: "HEPE · BED-HEPE Prototype",
  description: "NON-PRODUCTION HEPE Curriculum Governance & Development prototype"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          input, select, button { min-width: 0; max-width: 100%; }
          @media (max-width: 900px) {
            form { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) !important; }
          }
        `}</style>
      </head>
      <body style={{margin:0,fontFamily:"system-ui,sans-serif",background:"#ffffff",color:"#111827"}}>
        {children}
      </body>
    </html>
  );
}
