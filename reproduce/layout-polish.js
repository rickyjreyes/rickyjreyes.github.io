(() => {
  const path = location.pathname.replace(/index\.html$/i, '');
  if (path !== '/reproduce/') return;
  if (document.getElementById('reproduce-layout-polish')) return;

  const style = document.createElement('style');
  style.id = 'reproduce-layout-polish';
  style.textContent = `
    /* Reproduce uses four release metrics; keep them on one balanced row. */
    #main > .status-strip .status-grid{
      grid-template-columns:repeat(4,minmax(0,1fr)) !important;
      min-height:104px !important;
      align-items:stretch !important;
    }
    #main > .status-strip .status-grid > div{
      min-width:0;
      min-height:104px;
      display:flex !important;
      flex-direction:column;
      justify-content:center;
      gap:5px;
      padding:18px clamp(22px,3vw,42px) !important;
      border-left:1px solid var(--line);
    }
    #main > .status-strip .status-grid > div:first-child{
      padding-left:0 !important;
      border-left:0;
    }
    #main > .status-strip .status-grid strong{
      line-height:1.05;
    }

    /* The global section rhythm is intentionally generous; Reproduce is a
       procedural page and reads better with tighter, consistent intervals. */
    #main > .section.section-shell{
      padding-block:clamp(54px,5.5vw,78px) !important;
    }
    #main > .section.section-shell + .section.section-shell{
      border-top:1px solid rgba(170,201,225,.11);
    }
    #main > .section.section-shell .section-heading{
      margin-bottom:30px !important;
    }
    #main > .section.section-shell .section-heading.narrow{
      margin-bottom:28px !important;
    }
    #main > .status-strip + .section.section-shell{
      padding-top:clamp(46px,4.8vw,68px) !important;
    }
    #main .coverage-note{
      margin-top:22px !important;
    }

    @media(max-width:820px){
      #main > .status-strip .status-grid{
        grid-template-columns:repeat(2,minmax(0,1fr)) !important;
      }
      #main > .status-strip .status-grid > div{
        min-height:88px;
        padding:16px 20px !important;
      }
      #main > .status-strip .status-grid > div:nth-child(odd){
        border-left:0;
        padding-left:0 !important;
      }
      #main > .status-strip .status-grid > div:nth-child(n+3){
        border-top:1px solid var(--line);
      }
      #main > .section.section-shell{
        padding-block:46px !important;
      }
      #main > .section.section-shell .section-heading,
      #main > .section.section-shell .section-heading.narrow{
        margin-bottom:24px !important;
      }
    }

    @media(max-width:520px){
      #main > .status-strip .status-grid{
        grid-template-columns:1fr !important;
      }
      #main > .status-strip .status-grid > div,
      #main > .status-strip .status-grid > div:nth-child(odd){
        min-height:74px;
        padding:14px 0 !important;
        border-left:0;
      }
      #main > .status-strip .status-grid > div + div{
        border-top:1px solid var(--line);
      }
      #main > .section.section-shell{
        padding-block:40px !important;
      }
    }
  `;
  document.head.appendChild(style);
})();
