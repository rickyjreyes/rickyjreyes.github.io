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

  const initializeMagneticScroll = () => {
    if (window.__wctMagneticScrollReady) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let attempts = 0;
    const connect = () => {
      const lenis = window.__wctLenis;
      if (!lenis) {
        if (attempts++ < 160) window.setTimeout(connect, 50);
        return;
      }
      if (window.__wctMagneticScrollReady) return;
      window.__wctMagneticScrollReady = true;

      let locked = false;
      let impulse = 0;
      let lastWheelAt = 0;
      let unlockTimer = 0;

      const headerOffset = () => window.matchMedia('(max-width:760px)').matches ? 134 : 142;
      const pageY = (node) => node.getBoundingClientRect().top + window.scrollY;
      const visible = (node) => {
        const style = window.getComputedStyle(node);
        return style.display !== 'none' && style.visibility !== 'hidden' && node.getBoundingClientRect().height > 96;
      };

      const getBlocks = () => {
        const main = document.querySelector('main');
        if (!main) return [];
        const blocks = [...main.children].filter((node) =>
          node.matches('header,section,article,details,.hero,.section,.status-strip,[data-magnetic-block]') &&
          !node.matches('[data-magnetic-ignore]') &&
          visible(node)
        );
        const footer = document.querySelector('body > footer.site-footer');
        if (footer && visible(footer)) blocks.push(footer);
        return blocks;
      };

      const metrics = (node) => {
        const top = pageY(node);
        const height = node.getBoundingClientRect().height;
        return { node, top, height, bottom: top + height };
      };

      const currentIndex = (blocks) => {
        const probe = window.scrollY + headerOffset() + Math.min(window.innerHeight * .34, 280);
        let best = 0;
        let bestDistance = Infinity;
        blocks.forEach((node, i) => {
          const m = metrics(node);
          if (probe >= m.top && probe < m.bottom) {
            best = i;
            bestDistance = 0;
            return;
          }
          if (bestDistance !== 0) {
            const distance = Math.min(Math.abs(probe - m.top), Math.abs(probe - m.bottom));
            if (distance < bestDistance) {
              bestDistance = distance;
              best = i;
            }
          }
        });
        return best;
      };

      const shouldFreeScrollInsideLongBlock = (block, direction) => {
        const m = metrics(block);
        const offset = headerOffset();
        const viewportTop = window.scrollY + offset;
        const viewportBottom = window.scrollY + window.innerHeight - 24;
        const longBlock = m.height > Math.max(window.innerHeight * 1.38, 980);
        if (!longBlock) return false;
        const edgeBand = Math.min(window.innerHeight * .24, 220);
        if (direction > 0) return (m.bottom - viewportBottom) > edgeBand;
        return (viewportTop - m.top) > edgeBand;
      };

      const scrollToBlock = (node) => {
        const destination = Math.max(0, pageY(node) - headerOffset() - 4);
        locked = true;
        window.clearTimeout(unlockTimer);
        lenis.scrollTo(destination, {
          duration: .92,
          easing: (t) => 1 - Math.pow(1 - t, 4),
          lock: true,
          force: true,
          onComplete: () => {
            locked = false;
            impulse = 0;
          }
        });
        unlockTimer = window.setTimeout(() => {
          locked = false;
          impulse = 0;
        }, 1150);
      };

      window.addEventListener('wheel', (event) => {
        if (event.ctrlKey || event.metaKey) return;
        const target = event.target instanceof Element ? event.target : null;
        if (target?.closest('input,textarea,select,[contenteditable="true"],.nav-dropdown,.nav-dropdown-shell,[data-magnetic-ignore]')) return;

        const table = target?.closest('.table-wrap,.status-table-wrap,.timeline-scroll,[data-scroll]');
        const horizontalIntent = event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) * .9;
        if (table && horizontalIntent) return;
        if (horizontalIntent) return;
        if (Math.abs(event.deltaY) < .5) return;

        const blocks = getBlocks();
        if (blocks.length < 2) return;

        const now = performance.now();
        if (now - lastWheelAt > 190) impulse = 0;
        lastWheelAt = now;

        if (locked) {
          event.preventDefault();
          return;
        }

        const direction = event.deltaY > 0 ? 1 : -1;
        const index = currentIndex(blocks);
        const current = blocks[index];

        if (shouldFreeScrollInsideLongBlock(current, direction)) {
          impulse = 0;
          return;
        }

        event.preventDefault();
        impulse += event.deltaY;

        const threshold = event.deltaMode === 1 ? 9 : 34;
        if (Math.abs(impulse) < threshold) return;

        const nextIndex = Math.max(0, Math.min(blocks.length - 1, index + direction));
        if (nextIndex === index) {
          impulse = 0;
          lenis.scrollTo(direction > 0 ? document.documentElement.scrollHeight : 0, {
            duration: .7,
            easing: (t) => 1 - Math.pow(1 - t, 3)
          });
          return;
        }

        impulse = 0;
        scrollToBlock(blocks[nextIndex]);
      }, { passive: false, capture: true });
    };

    connect();
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
  initializeMagneticScroll();
  initializeGsap().catch(() => {
    window.__wctGsapLoading = false;
  });
})();
