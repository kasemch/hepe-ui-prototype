export const metadata = {
  title: "HEPE · BED-HEPE Prototype",
  description: "NON-PRODUCTION HEPE Curriculum Governance & Development prototype"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const scrollRegionScript = `
    (() => {
      const apply = () => {
        document.querySelectorAll('div').forEach((element) => {
          const style = window.getComputedStyle(element);
          const scrollableX = (style.overflowX === 'auto' || style.overflowX === 'scroll') && element.scrollWidth > element.clientWidth + 1;
          if (scrollableX && !element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
          }
        });
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply, { once: true });
      } else {
        apply();
      }
      window.addEventListener('resize', apply);
    })();
  `;

  return (
    <html lang="th">
      <head>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          input, select, button { min-width: 0; max-width: 100%; }
          article, dl, dt, dd { min-width: 0; }
          dd, article, p { overflow-wrap: anywhere; }
          @media (max-width: 900px) {
            form { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) !important; }
          }
          @media (max-width: 600px) {
            dl { grid-template-columns: 1fr !important; }
            dd { margin-left: 0 !important; }
          }
        `}</style>
      </head>
      <body style={{margin:0,fontFamily:"system-ui,sans-serif",background:"#ffffff",color:"#111827"}}>
        {children}
        <script dangerouslySetInnerHTML={{ __html: scrollRegionScript }} />
      </body>
    </html>
  );
}
