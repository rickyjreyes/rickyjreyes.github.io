(() => {
  const loadBaseRuntime = () => {
    if (document.getElementById('wct-site-nav-base')) return;
    const script = document.createElement('script');
    script.id = 'wct-site-nav-base';
    script.src = '/site-nav-base.js?v=20260829-snap3';
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
    if (path !== '/priority/' && path !== '/overlap/') return;

    if (!document.getElementById('wct-registry-table-width-fix')) {
      const style = document.createElement('style');
      style.id = 'wct-registry-table-width-fix';
      style.textContent = `
        .priority-shell .table-wrap,.overlap-shell .table-wrap{
          display:block!important;width:calc(100% - 32px)!important;max-width:calc(100% - 32px)!important;min-width:0!important;
          margin-left:16px!important;margin-right:16px!important;overflow-x:auto!important;overflow-y:visible!important;
          -webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;overscroll-behavior-y:auto;scrollbar-gutter:stable;
          scrollbar-width:thin;scrollbar-color:rgba(103,212,255,.5) rgba(255,255,255,.045);touch-action:auto;
        }
        .priority-shell .table-wrap::-webkit-scrollbar,.overlap-shell .table-wrap::-webkit-scrollbar{height:11px}
        .priority-shell .table-wrap::-webkit-scrollbar-track,.overlap-shell .table-wrap::-webkit-scrollbar-track{background:rgba(255,255,255,.035);border-radius:999px}
        .priority-shell .table-wrap::-webkit-scrollbar-thumb,.overlap-shell .table-wrap::-webkit-scrollbar-thumb{background:rgba(103,212,255,.42);border-radius:999px}
        .priority-shell .patent-wrap{max-width:1088px!important}.priority-shell .patent-table{min-width:960px!important}
        .priority-shell .convergence-table{min-width:1180px!important}.priority-shell .candidate-table{min-width:1040px!important}.priority-shell .claim-table{min-width:1080px!important}
        .overlap-shell .table-wrap table{min-width:1080px!important}.overlap-shell .verified-table table{min-width:1160px!important}
        .overlap-shell td.work{min-width:285px!important}.overlap-shell td.domain{min-width:120px!important}.overlap-shell td.authors{min-width:220px!important}.overlap-shell td.identifier{min-width:180px!important}.overlap-shell td.score{width:120px!important}
        @media(max-width:760px){
          .priority-shell .table-wrap,.overlap-shell .table-wrap{width:calc(100% - 20px)!important;max-width:calc(100% - 20px)!important;margin-left:10px!important;margin-right:10px!important}
          .priority-shell .patent-table{min-width:900px!important}.priority-shell .convergence-table{min-width:1080px!important}.priority-shell .candidate-table{min-width:960px!important}.priority-shell .claim-table{min-width:1000px!important}
          .overlap-shell .table-wrap table{min-width:980px!important}.overlap-shell .verified-table table{min-width:1040px!important}
        }
      `;
      document.head.appendChild(style);
    }

    const enable = () => {
      document.querySelectorAll('.priority-shell .table-wrap,.overlap-shell .table-wrap').forEach((wrap) => {
        wrap.removeAttribute('data-lenis-prevent');
        wrap.removeAttribute('data-lenis-prevent-wheel');
        wrap.removeAttribute('data-lenis-prevent-touch');
        wrap.tabIndex = wrap.tabIndex >= 0 ? wrap.tabIndex : 0;
        wrap.setAttribute('role', 'region');
        if (!wrap.getAttribute('aria-label')) wrap.setAttribute('aria-label', 'Horizontally scrollable data table');
        if (wrap.dataset.wctWheelBound) return;
        wrap.addEventListener('wheel', (event) => {
          if (!event.shiftKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX) || wrap.scrollWidth <= wrap.clientWidth) return;
          event.preventDefault();
          event.stopPropagation();
          wrap.scrollLeft += event.deltaY;
        }, { passive:false });
        wrap.dataset.wctWheelBound = 'true';
      });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enable, { once:true });
    else enable();
  };

  const loadExternalScript = (id, src) => new Promise((resolve) => {
    const existing = document.getElementById(id);
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve(true);
      else {
        existing.addEventListener('load', () => resolve(true), { once:true });
        existing.addEventListener('error', () => resolve(false), { once:true });
      }
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.addEventListener('load', () => { script.dataset.loaded = 'true'; resolve(true); }, { once:true });
    script.addEventListener('error', () => resolve(false), { once:true });
    document.head.appendChild(script);
  });

  const headerOffset = () => matchMedia('(max-width:760px)').matches ? 134 : 142;
  const pageY = (node) => node.getBoundingClientRect().top + window.scrollY;
  const visible = (node) => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return rect.height > 80 && style.display !== 'none' && style.visibility !== 'hidden';
  };

  const getSections = () => {
    const main = document.querySelector('main');
    if (!main) return [];
    const nodes = [...main.children].filter((node) =>
      node.matches('header,section,article,details,.status-strip,[data-snap-section]') &&
      !node.matches('[data-snap-ignore],[data-magnetic-ignore]') && visible(node)
    );
    return nodes;
  };

  const initializeStrongSectionSnap = () => {
    if (window.__wctSectionSnapV3Ready || matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(pointer: coarse)').matches) return;
    let attempts = 0;
    const connect = () => {
      const lenis = window.__wctLenis;
      if (!lenis) {
        if (attempts++ < 180) setTimeout(connect, 50);
        return;
      }
      if (window.__wctSectionSnapV3Ready) return;
      window.__wctSectionSnapV3Ready = true;

      let settleTimer = 0;
      let snapping = false;
      let lastDirection = 1;
      let lastInput = 0;

      const isHorizontalTableGesture = (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const table = target?.closest('.table-wrap,.status-table-wrap,.timeline-scroll,[data-scroll]');
        return !!table && (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY));
      };

      window.addEventListener('wheel', (event) => {
        if (isHorizontalTableGesture(event)) return;
        if (Math.abs(event.deltaY) > .1) lastDirection = event.deltaY > 0 ? 1 : -1;
        lastInput = performance.now();
      }, { passive:true, capture:true });
      window.addEventListener('keydown', (event) => {
        if (['ArrowDown','PageDown','End',' '].includes(event.key)) lastDirection = 1;
        if (['ArrowUp','PageUp','Home'].includes(event.key)) lastDirection = -1;
        lastInput = performance.now();
      }, { passive:true, capture:true });

      const settle = () => {
        if (snapping || performance.now() - lastInput < 70) return;
        const active = document.activeElement;
        if (active?.matches?.('input,textarea,select,[contenteditable="true"]')) return;
        const sections = getSections();
        if (sections.length < 2) return;

        const offset = headerOffset() + 6;
        const current = lenis.animatedScroll ?? window.scrollY;
        const targets = sections.map((node) => ({ node, y:Math.max(0, pageY(node) - offset) })).sort((a,b) => a.y - b.y);

        let nearest = targets[0];
        let nearestDistance = Math.abs(current - nearest.y);
        for (let i = 1; i < targets.length; i++) {
          const d = Math.abs(current - targets[i].y);
          if (d < nearestDistance) { nearest = targets[i]; nearestDistance = d; }
        }

        // Directional bias makes the next section catch as it approaches the top,
        // while still allowing long sections to be read continuously.
        const ahead = targets.find((t) => t.y > current + 12);
        const behind = [...targets].reverse().find((t) => t.y < current - 12);
        const catchDistance = Math.min(window.innerHeight * .72, 650);
        if (lastDirection > 0 && ahead && ahead.y - current < catchDistance) nearest = ahead;
        if (lastDirection < 0 && behind && current - behind.y < catchDistance) nearest = behind;

        const distance = Math.abs(current - nearest.y);
        if (distance < 4 || distance > catchDistance) return;

        snapping = true;
        document.documentElement.classList.add('wct-section-snapping');
        lenis.scrollTo(nearest.y, {
          duration:.62,
          force:true,
          lock:false,
          easing:(t) => 1 - Math.pow(1 - t, 4),
          onComplete:() => {
            setTimeout(() => {
              snapping = false;
              document.documentElement.classList.remove('wct-section-snapping');
            }, 60);
          }
        });
      };

      lenis.on('scroll', ({ velocity }) => {
        if (snapping) return;
        clearTimeout(settleTimer);
        const delay = Math.abs(velocity || 0) < .12 ? 70 : 115;
        settleTimer = setTimeout(settle, delay);
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
      if (attempts++ < 140) setTimeout(connect, 50);
    };
    connect();
  };

  const initializeGsapParallax = async () => {
    if (window.__wctGsapSnap3Loading || window.__wctGsapSnap3Ready) return;
    window.__wctGsapSnap3Loading = true;
    let coreReady = !!window.gsap;
    if (!coreReady) coreReady = await loadExternalScript('wct-gsap-script', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js');
    if (!coreReady || !window.gsap) { window.__wctGsapSnap3Loading = false; return; }
    let triggerReady = !!window.ScrollTrigger;
    if (!triggerReady) triggerReady = await loadExternalScript('wct-scrolltrigger-script', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js');
    if (!triggerReady || !window.ScrollTrigger) { window.__wctGsapSnap3Loading = false; return; }

    gsap.registerPlugin(ScrollTrigger);
    window.__wctGsapSnap3Ready = true;
    window.__wctGsapSnap3Loading = false;
    syncLenisWithScrollTrigger();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (!document.getElementById('wct-snap3-style')) {
      const style = document.createElement('style');
      style.id = 'wct-snap3-style';
      style.textContent = `
        main>header,main>section,main>article,main>details{scroll-margin-top:148px;position:relative}
        .wct-parallax-layer{will-change:transform;transform:translateZ(0)}
      `;
      document.head.appendChild(style);
    }

    getSections().forEach((section) => {
      if (section.dataset.wctParallaxV3) return;
      section.dataset.wctParallaxV3 = 'true';

      const layers = [...section.children].filter((node) =>
        !node.matches('.table-wrap,.status-table-wrap,.timeline-scroll,script,style,[data-parallax-ignore]')
      );
      layers.forEach((layer, index) => {
        layer.classList.add('wct-parallax-layer');
        const amount = Math.min(window.innerHeight * .105, 105) * (1 + Math.min(index, 3) * .08);
        gsap.fromTo(layer,
          { y:amount, scale:.985 },
          {
            y:-amount,
            scale:1.015,
            ease:'none',
            overwrite:'auto',
            scrollTrigger:{
              trigger:section,
              start:'top bottom',
              end:'bottom top',
              scrub:.45,
              invalidateOnRefresh:true
            }
          }
        );
      });
    });

    ScrollTrigger.refresh();
    setTimeout(() => ScrollTrigger.refresh(), 350);
  };

  loadGlossaryBinaryView();
  normalizeWideRegistryTables();
  loadBaseRuntime();
  initializeStrongSectionSnap();
  initializeGsapParallax().catch(() => { window.__wctGsapSnap3Loading = false; });
})();
