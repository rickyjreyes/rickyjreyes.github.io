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
            if (!event.shiftKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
            if (wrap.scrollWidth <= wrap.clientWidth) return;
            event.preventDefault();
            event.stopPropagation();
            wrap.scrollLeft += event.deltaY;
          }, { passive: false });
          wrap.dataset.wctWheelBound = 'true';
        }
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enableTableScroll, { once: true });
    } else {
      enableTableScroll();
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

  const headerOffset = () => window.matchMedia('(max-width:760px)').matches ? 134 : 142;
  const pageY = (node) => node.getBoundingClientRect().top + window.scrollY;
  const isVisible = (node) => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.height > 80;
  };

  const getSnapSections = () => {
    const nodes = [
      ...document.querySelectorAll('main > header, main > section, main > article, main > details, main > .status-strip, main section[data-magnetic-block], main [data-snap-section]')
    ];
    const seen = new Set();
    return nodes.filter((node) => {
      if (seen.has(node) || node.matches('[data-magnetic-ignore],[data-snap-ignore]') || !isVisible(node)) return false;
      seen.add(node);
      return true;
    });
  };

  const initializeSectionSnap = () => {
    if (window.__wctSectionSnapReady) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (matchMedia('(pointer: coarse)').matches) return;

    let attempts = 0;
    const connect = () => {
      const lenis = window.__wctLenis;
      if (!lenis) {
        if (attempts++ < 160) setTimeout(connect, 50);
        return;
      }
      if (window.__wctSectionSnapReady) return;
      window.__wctSectionSnapReady = true;

      let snapTimer = 0;
      let snapping = false;
      let lastInputAt = performance.now();

      const markInput = () => {
        lastInputAt = performance.now();
        if (snapping) return;
        clearTimeout(snapTimer);
      };

      ['wheel', 'pointerdown', 'touchstart', 'keydown'].forEach((type) => {
        window.addEventListener(type, markInput, { passive: true, capture: true });
      });

      const snapToNearestTop = () => {
        if (snapping) return;
        const active = document.activeElement;
        if (active?.matches?.('input,textarea,select,[contenteditable="true"]')) return;

        const sections = getSnapSections();
        if (sections.length < 2) return;

        const current = window.scrollY;
        const offset = headerOffset() + 4;
        const targets = sections
          .map((node) => ({ node, y: Math.max(0, pageY(node) - offset) }))
          .sort((a, b) => a.y - b.y);

        let nearest = targets[0];
        let distance = Math.abs(current - nearest.y);
        for (let i = 1; i < targets.length; i++) {
          const d = Math.abs(current - targets[i].y);
          if (d < distance) {
            nearest = targets[i];
            distance = d;
          }
        }

        const magnetRange = Math.min(window.innerHeight * .48, 420);
        if (distance > magnetRange || distance < 10) return;

        snapping = true;
        lenis.scrollTo(nearest.y, {
          duration: .78,
          lock: false,
          force: true,
          easing: (t) => 1 - Math.pow(1 - t, 5),
          onComplete: () => {
            setTimeout(() => { snapping = false; }, 70);
          }
        });
      };

      lenis.on('scroll', () => {
        if (snapping) return;
        clearTimeout(snapTimer);
        snapTimer = setTimeout(() => {
          if (performance.now() - lastInputAt < 90) {
            snapTimer = setTimeout(snapToNearestTop, 100);
            return;
          }
          snapToNearestTop();
        }, 115);
      });
    };

    connect();
  };

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
      if (attempts++ < 120) setTimeout(connect, 50);
    };
    connect();
  };

  const initializeGsap = async () => {
    if (window.__wctGsapReady || window.__wctGsapLoading) return;
    window.__wctGsapLoading = true;

    let coreReady = !!window.gsap;
    if (!coreReady) {
      coreReady = await loadExternalScript('wct-gsap-script', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js');
    }
    if (!coreReady || !window.gsap) {
      window.__wctGsapLoading = false;
      return;
    }

    let triggerReady = !!window.ScrollTrigger;
    if (!triggerReady) {
      triggerReady = await loadExternalScript('wct-scrolltrigger-script', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js');
    }
    if (!triggerReady || !window.ScrollTrigger) {
      window.__wctGsapLoading = false;
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);
    window.__wctGsapReady = true;
    window.__wctGsapLoading = false;
    syncLenisWithScrollTrigger();

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const blocks = getSnapSections();
    blocks.forEach((block) => {
      if (block.dataset.wctParallaxReady) return;
      block.dataset.wctParallaxReady = 'true';

      const layers = [...block.children].filter((child) =>
        !child.matches('.table-wrap,.status-table-wrap,.timeline-scroll,script,style,[data-parallax-ignore]')
      );
      if (!layers.length) return;

      layers.forEach((layer, index) => {
        const depth = Math.min(34, 18 + index * 3);
        window.gsap.fromTo(layer,
          { y: depth },
          {
            y: -depth,
            ease: 'none',
            overwrite: 'auto',
            scrollTrigger: {
              trigger: block,
              start: 'top bottom',
              end: 'bottom top',
              scrub: .65,
              invalidateOnRefresh: true
            }
          }
        );
      });
    });

    window.ScrollTrigger.refresh();
    setTimeout(() => window.ScrollTrigger?.refresh(), 300);
  };

  loadGlossaryBinaryView();
  normalizeWideRegistryTables();
  loadBaseRuntime();
  initializeSectionSnap();
  initializeGsap().catch(() => {
    window.__wctGsapLoading = false;
  });
})();
