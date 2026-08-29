(() => {
  const loadBaseRuntime = () => {
    if (document.getElementById('wct-site-nav-base')) return;
    const script = document.createElement('script');
    script.id = 'wct-site-nav-base';
    script.src = '/site-nav-base.js?v=20260826-gsap';
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
          width:100% !important;
          max-width:100% !important;
          min-width:0 !important;
          overflow-x:auto !important;
          overflow-y:hidden !important;
          -webkit-overflow-scrolling:touch;
          overscroll-behavior-x:contain;
          scrollbar-gutter:stable;
          scrollbar-width:thin;
          scrollbar-color:rgba(103,212,255,.5) rgba(255,255,255,.045);
          touch-action:pan-x pan-y;
        }
        .priority-shell .table-wrap::-webkit-scrollbar,
        .overlap-shell .table-wrap::-webkit-scrollbar{height:11px}
        .priority-shell .table-wrap::-webkit-scrollbar-track,
        .overlap-shell .table-wrap::-webkit-scrollbar-track{background:rgba(255,255,255,.035);border-radius:999px}
        .priority-shell .table-wrap::-webkit-scrollbar-thumb,
        .overlap-shell .table-wrap::-webkit-scrollbar-thumb{background:rgba(103,212,255,.42);border-radius:999px}

        .priority-shell .patent-wrap{max-width:1120px !important}
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

    const enableNestedScroll = () => {
      document.querySelectorAll('.priority-shell .table-wrap, .overlap-shell .table-wrap').forEach((wrap) => {
        wrap.setAttribute('data-lenis-prevent', '');
        wrap.setAttribute('data-lenis-prevent-wheel', '');
        wrap.setAttribute('data-lenis-prevent-touch', '');
        wrap.tabIndex = wrap.tabIndex >= 0 ? wrap.tabIndex : 0;
        wrap.setAttribute('role', 'region');
        if (!wrap.getAttribute('aria-label')) wrap.setAttribute('aria-label', 'Scrollable data table');
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enableNestedScroll, { once: true });
    } else {
      enableNestedScroll();
    }
  };

  const loadExternalScript = (id, src) => new Promise((resolve) => {
    const existing = document.getElementById(id);
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve(true);
      else {
        existing.addEventListener('load', () => resolve(true), { once: true });
        existing.addEventListener('error', () => resolve(false), { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve(true);
    }, { once: true });
    script.addEventListener('error', () => resolve(false), { once: true });
    document.head.appendChild(script);
  });

  const syncLenisWithScrollTrigger = () => {
    let attempts = 0;
    const connect = () => {
      if (window.__wctLenis && window.ScrollTrigger) {
        if (!window.__wctLenisScrollTriggerBound) {
          window.__wctLenis.on('scroll', window.ScrollTrigger.update);
          window.__wctLenisScrollTriggerBound = true;
        }
        window.ScrollTrigger.refresh();
        return;
      }
      if (attempts++ < 120) window.setTimeout(connect, 50);
    };
    connect();
  };

  const initializeGsap = async () => {
    if (window.__wctGsapReady || window.__wctGsapLoading) return;
    window.__wctGsapLoading = true;

    let coreReady = !!window.gsap;
    if (!coreReady) {
      coreReady = await loadExternalScript(
        'wct-gsap-script',
        'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js'
      );
    }

    if (!coreReady || !window.gsap) {
      window.__wctGsapLoading = false;
      return;
    }

    let triggerReady = !!window.ScrollTrigger;
    if (!triggerReady) {
      triggerReady = await loadExternalScript(
        'wct-scrolltrigger-script',
        'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js'
      );
    }

    if (!triggerReady || !window.ScrollTrigger) {
      window.__wctGsapLoading = false;
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);
    window.__wctGsapReady = true;
    window.__wctGsapLoading = false;

    syncLenisWithScrollTrigger();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sections = [...document.querySelectorAll('main section')]
      .filter((section) => !section.classList.contains('hero'));

    sections.forEach((section) => {
      if (section.dataset.wctGsapIntro) return;
      section.dataset.wctGsapIntro = 'true';

      window.gsap.from(section, {
        y: 48,
        scale: 0.985,
        autoAlpha: 0.28,
        duration: 1.05,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: section,
          start: 'top 92%',
          once: true
        }
      });
    });

    window.ScrollTrigger.refresh();
    window.setTimeout(() => window.ScrollTrigger?.refresh(), 300);
  };

  loadGlossaryBinaryView();
  normalizeWideRegistryTables();
  loadBaseRuntime();
  initializeGsap().catch(() => {
    window.__wctGsapLoading = false;
  });
})();
