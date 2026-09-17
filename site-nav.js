(() => {
  /*
   * Global stability pass.
   *
   * The previous runtime layered Lenis smooth scrolling, magnetic settling,
   * GSAP parallax, translateZ(0), and fractional scale transforms across nearly
   * every page. Those effects made headings and body copy move after scroll
   * input and forced text through composited/subpixel rendering, which can look
   * soft or shimmer on Windows/Chromium displays.
   *
   * Keep navigation and page utilities, but make scrolling/content rendering
   * static by default across the entire site.
   */
  window.__wctLenisLoading = true;
  window.__wctFlexibleMagnetReady = true;
  window.__wctMagnetParallaxReady = true;

  const applyStaticRendering = () => {
    if (document.getElementById('wct-static-rendering-style')) return;

    const style = document.createElement('style');
    style.id = 'wct-static-rendering-style';
    style.textContent = `
      html,
      body{
        scroll-behavior:auto !important;
      }

      body{
        -webkit-font-smoothing:antialiased;
        -moz-osx-font-smoothing:grayscale;
        text-rendering:optimizeLegibility;
        font-kerning:normal;
        font-synthesis:none;
      }

      /* Neutralize any stale/runtime parallax classes or inline transforms. */
      main .wct-parallax-child{
        transform:none !important;
        scale:none !important;
        translate:none !important;
        will-change:auto !important;
        backface-visibility:visible !important;
      }

      /* Keep readable text out of GPU/composited transform layers. */
      main h1,
      main h2,
      main h3,
      main h4,
      main p,
      main li,
      main th,
      main td,
      main code,
      main pre{
        will-change:auto !important;
        backface-visibility:visible !important;
        text-rendering:optimizeLegibility;
        font-kerning:normal;
      }

      /* Gradient-clipped serif text is noticeably rougher on Windows Chromium. */
      .site-page-hero h1 > span,
      .patent-hero h1 > span,
      .hero h1 > span{
        color:var(--accent,#67d4ff) !important;
        background:none !important;
        background-image:none !important;
        background-clip:border-box !important;
        -webkit-background-clip:border-box !important;
        -webkit-text-fill-color:currentColor !important;
      }

      html.wct-magnet-moving{
        scroll-behavior:auto !important;
      }

      @media(prefers-reduced-motion:reduce){
        *,*::before,*::after{
          scroll-behavior:auto !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const loadBaseRuntime = () => {
    if (document.getElementById('wct-site-nav-base')) return;
    const script = document.createElement('script');
    script.id = 'wct-site-nav-base';
    script.src = '/site-nav-base.js?v=20260915-static1';
    script.async = false;
    document.head.appendChild(script);
  };

  const loadGlossaryBinaryView = () => {
    if (location.pathname !== '/tools/glossary/' && location.pathname !== '/tools/glossary/index.html') return;
    if (!document.getElementById('wct-glossary-binary-priority')) {
      const link = document.createElement('link');
      link.id = 'wct-glossary-binary-priority';
      link.rel = 'stylesheet';
      link.href = '/tools/glossary/binary-priority.css?v=20260828-fullwidth';
      document.head.appendChild(link);
    }
    if (!document.getElementById('wct-glossary-binary-priority-js')) {
      const script = document.createElement('script');
      script.id = 'wct-glossary-binary-priority-js';
      script.src = '/tools/glossary/binary-priority.js?v=20260828-audit203';
      script.defer = true;
      document.head.appendChild(script);
    }
  };

  const loadPriorityEvidence = () => {
    const path = location.pathname.replace(/index\.html$/i, '');
    if (path !== '/priority/' || document.getElementById('wct-priority-evidence')) return;
    const script = document.createElement('script');
    script.id = 'wct-priority-evidence';
    script.src = '/priority/evidence-panel.js?v=20260917-evidence3';
    script.defer = true;
    document.head.appendChild(script);
  };

  const normalizeWideRegistryTables = () => {
    const path = location.pathname.replace(/index\.html$/i, '');
    const isPriority = path === '/priority/';
    const isOverlap = path === '/overlap/';
    if (!isPriority && !isOverlap) return;

    if (!document.getElementById('wct-registry-table-width-fix')) {
      const style = document.createElement('style');
      style.id = 'wct-registry-table-width-fix';
      style.textContent = `
        .priority-shell .table-wrap,
        .overlap-shell .table-wrap{
          display:block !important;
          width:calc(100% - 32px) !important;
          max-width:calc(100% - 32px) !important;
          min-width:0 !important;
          margin-left:16px !important;
          margin-right:16px !important;
          overflow-x:auto !important;
          overflow-y:visible !important;
          -webkit-overflow-scrolling:touch;
          overscroll-behavior-x:contain;
          overscroll-behavior-y:auto;
          scrollbar-gutter:stable;
          scrollbar-width:thin;
          scrollbar-color:rgba(103,212,255,.5) rgba(255,255,255,.045);
          touch-action:auto;
        }
        .priority-shell .table-wrap::-webkit-scrollbar,
        .overlap-shell .table-wrap::-webkit-scrollbar{height:11px}
        .priority-shell .table-wrap::-webkit-scrollbar-track,
        .overlap-shell .table-wrap::-webkit-scrollbar-track{background:rgba(255,255,255,.035);border-radius:999px}
        .priority-shell .table-wrap::-webkit-scrollbar-thumb,
        .overlap-shell .table-wrap::-webkit-scrollbar-thumb{background:rgba(103,212,255,.42);border-radius:999px}

        .priority-shell .patent-wrap{max-width:1088px !important}
        .priority-shell .patent-table{min-width:960px !important}
        .priority-shell .convergence-table{min-width:1180px !important}
        .priority-shell .candidate-table{min-width:1040px !important}
        .priority-shell .claim-table{min-width:1080px !important}
        .priority-shell .convergence-table th,
        .priority-shell .convergence-table td,
        .priority-shell .candidate-table th,
        .priority-shell .candidate-table td,
        .priority-shell .claim-table th,
        .priority-shell .claim-table td{padding-left:13px !important;padding-right:13px !important}

        .overlap-shell .table-wrap table{min-width:1080px !important}
        .overlap-shell .verified-table table{min-width:1160px !important}
        .overlap-shell td.work{min-width:285px !important}
        .overlap-shell td.domain{min-width:120px !important}
        .overlap-shell td.authors{min-width:220px !important}
        .overlap-shell td.identifier{min-width:180px !important}
        .overlap-shell td.score{width:120px !important}
        .overlap-shell th,
        .overlap-shell td{padding-left:12px !important;padding-right:12px !important}

        @media(max-width:760px){
          .priority-shell .table-wrap,
          .overlap-shell .table-wrap{
            width:calc(100% - 20px) !important;
            max-width:calc(100% - 20px) !important;
            margin-left:10px !important;
            margin-right:10px !important;
          }
          .priority-shell .patent-table{min-width:900px !important}
          .priority-shell .convergence-table{min-width:1080px !important}
          .priority-shell .candidate-table{min-width:960px !important}
          .priority-shell .claim-table{min-width:1000px !important}
          .overlap-shell .table-wrap table{min-width:980px !important}
          .overlap-shell .verified-table table{min-width:1040px !important}
          .overlap-shell td.work{min-width:250px !important}
          .overlap-shell td.authors{min-width:190px !important}
          .overlap-shell td.identifier{min-width:165px !important}
        }
      `;
      document.head.appendChild(style);
    }

    const enableTableScroll = () => {
      document.querySelectorAll('.priority-shell .table-wrap, .overlap-shell .table-wrap').forEach((wrap) => {
        wrap.removeAttribute('data-lenis-prevent');
        wrap.removeAttribute('data-lenis-prevent-wheel');
        wrap.removeAttribute('data-lenis-prevent-touch');
        wrap.tabIndex = wrap.tabIndex >= 0 ? wrap.tabIndex : 0;
        wrap.setAttribute('role', 'region');
        if (!wrap.getAttribute('aria-label')) wrap.setAttribute('aria-label', 'Horizontally scrollable data table');

        if (!wrap.dataset.wctWheelBound) {
          wrap.addEventListener('wheel', (event) => {
            const horizontalIntent = event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);
            if (!horizontalIntent || wrap.scrollWidth <= wrap.clientWidth) return;
            event.preventDefault();
            event.stopPropagation();
            wrap.scrollLeft += event.shiftKey ? event.deltaY : event.deltaX;
          }, { passive:false });
          wrap.dataset.wctWheelBound = 'true';
        }
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enableTableScroll, { once:true });
    } else {
      enableTableScroll();
    }
  };

  applyStaticRendering();
  loadGlossaryBinaryView();
  loadPriorityEvidence();
  normalizeWideRegistryTables();
  loadBaseRuntime();
})();