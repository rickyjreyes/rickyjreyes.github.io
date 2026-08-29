(() => {
  const stabilizeNavbar = () => {
    if (document.getElementById('wct-navbar-stability-style')) return;
    const style = document.createElement('style');
    style.id = 'wct-navbar-stability-style';
    style.textContent = `
      :root{--wct-fixed-header-height:124px}
      html{scroll-padding-top:142px!important}
      body{padding-top:var(--wct-fixed-header-height)!important}
      .site-header,
      .site-header.scrolled{
        position:fixed!important;
        top:0!important;
        right:0!important;
        left:0!important;
        z-index:2000!important;
        width:100%!important;
        height:var(--wct-fixed-header-height)!important;
        min-height:var(--wct-fixed-header-height)!important;
        margin:0!important;
        transform:translate3d(0,0,0)!important;
        -webkit-transform:translate3d(0,0,0)!important;
        backface-visibility:hidden!important;
        -webkit-backface-visibility:hidden!important;
        contain:paint!important;
        isolation:isolate!important;
        transition:none!important;
        -webkit-backdrop-filter:none!important;
        backdrop-filter:none!important;
        background:rgba(4,10,18,.985)!important;
        border-bottom:1px solid var(--line,rgba(170,201,225,.16))!important;
        box-shadow:0 1px 0 rgba(255,255,255,.018),0 10px 36px rgba(0,0,0,.16)!important;
      }
      .site-header .nav-wrap{
        height:var(--wct-fixed-header-height)!important;
        min-height:var(--wct-fixed-header-height)!important;
        transform:none!important;
      }
      .site-header .wordmark,
      .site-header #site-nav,
      .site-header .menu-button{
        transform:translateZ(0)!important;
        backface-visibility:hidden!important;
        -webkit-backface-visibility:hidden!important;
      }
      html.wct-magnet-moving .site-header,
      html.wct-magnet-moving .site-header.scrolled{
        transform:translate3d(0,0,0)!important;
        transition:none!important;
      }
      main [id],section[id],article[id],header[id],footer[id]{scroll-margin-top:142px}
      @media(max-width:760px){
        :root{--wct-fixed-header-height:120px}
        html{scroll-padding-top:134px!important}
        main [id],section[id],article[id],header[id],footer[id]{scroll-margin-top:134px}
      }
    `;
    document.head.appendChild(style);
  };

  const loadBaseRuntime = () => {
    if (document.getElementById('wct-site-nav-base')) return;
    const script = document.createElement('script');
    script.id = 'wct-site-nav-base';
    script.src = '/site-nav-base.js?v=20260829-magnet5-navfix';
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
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve(true);
    }, { once:true });
    script.addEventListener('error', () => resolve(false), { once:true });
    document.head.appendChild(script);
  });

  const headerOffset = () => matchMedia('(max-width:760px)').matches ? 134 : 142;
  const pageY = (node) => node.getBoundingClientRect().top + window.scrollY;

  const isVisible = (node) => {
    if (!(node instanceof Element)) return false;
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return rect.height > 56 && rect.width > 40 && style.display !== 'none' && style.visibility !== 'hidden';
  };

  const collectMagneticStops = () => {
    const main = document.querySelector('main');
    if (!main) return [];

    const selectors = [
      ':scope > header',
      ':scope > section',
      ':scope > article',
      ':scope > details',
      'section',
      '.definition-card',
      '.control-item',
      '.audit-strip > div',
      '.stats > div',
      '.publication',
      '.publication-card',
      '.branch-card',
      '.audit-card',
      '.tool-card',
      '.paper-card',
      '.result-card',
      '[data-snap-card]',
      '[data-snap-section]'
    ];

    const candidates = [];
    selectors.forEach((selector) => {
      try {
        main.querySelectorAll(selector).forEach((node) => candidates.push(node));
      } catch (_) {}
    });

    const offset = headerOffset() + 6;
    const raw = [...new Set(candidates)]
      .filter((node) => isVisible(node) && !node.matches('[data-snap-ignore],[data-magnetic-ignore]'))
      .filter((node) => !node.closest('.table-wrap,.status-table-wrap,.timeline-scroll'))
      .map((node) => ({ node, y:Math.max(0, pageY(node) - offset) }))
      .sort((a,b) => a.y - b.y);

    const stops = [];
    raw.forEach((stop) => {
      const previous = stops[stops.length - 1];
      if (!previous || Math.abs(stop.y - previous.y) > 28) {
        stops.push(stop);
      }
    });

    return stops;
  };

  const initializeDiscreteMagnetScroll = () => {
    if (window.__wctDiscreteMagnetReady) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (matchMedia('(pointer: coarse)').matches) return;

    let attempts = 0;
    const connect = () => {
      const lenis = window.__wctLenis;
      if (!lenis) {
        if (attempts++ < 180) setTimeout(connect, 50);
        return;
      }
      if (window.__wctDiscreteMagnetReady) return;
      window.__wctDiscreteMagnetReady = true;

      let locked = false;
      let unlockTimer = 0;
      let idleTimer = 0;
      let lastWheel = 0;

      const currentScroll = () => lenis.animatedScroll ?? window.scrollY;

      const nearestIndex = (stops) => {
        const y = currentScroll();
        let best = 0;
        let distance = Infinity;
        stops.forEach((stop, index) => {
          const d = Math.abs(y - stop.y);
          if (d < distance) {
            distance = d;
            best = index;
          }
        });
        return best;
      };

      const goTo = (stops, index, duration = .72) => {
        if (!stops[index]) return;
        locked = true;
        clearTimeout(unlockTimer);
        document.documentElement.classList.add('wct-magnet-moving');
        lenis.scrollTo(stops[index].y, {
          duration,
          lock:true,
          force:true,
          easing:(t) => 1 - Math.pow(1 - t, 4),
          onComplete:() => {
            locked = false;
            document.documentElement.classList.remove('wct-magnet-moving');
          }
        });
        unlockTimer = setTimeout(() => {
          locked = false;
          document.documentElement.classList.remove('wct-magnet-moving');
        }, Math.max(900, duration * 1400));
      };

      const isHorizontalGesture = (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const table = target?.closest('.table-wrap,.status-table-wrap,.timeline-scroll,[data-scroll]');
        return !!table && (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY));
      };

      window.addEventListener('wheel', (event) => {
        if (event.ctrlKey || event.metaKey || isHorizontalGesture(event)) return;
        if (Math.abs(event.deltaY) < .5) return;

        const target = event.target instanceof Element ? event.target : null;
        if (target?.closest('input,textarea,select,[contenteditable="true"],.nav-dropdown,.nav-dropdown-shell')) return;

        const stops = collectMagneticStops();
        if (stops.length < 2) return;

        event.preventDefault();
        event.stopPropagation();

        if (locked) return;

        const now = performance.now();
        if (now - lastWheel < 55) return;
        lastWheel = now;

        const direction = event.deltaY > 0 ? 1 : -1;
        const y = currentScroll();
        const nearest = nearestIndex(stops);
        let index = nearest;

        if (Math.abs(y - stops[nearest].y) < 24) {
          index = nearest + direction;
        } else if (direction > 0) {
          index = stops.findIndex((stop) => stop.y > y + 12);
          if (index < 0) index = stops.length - 1;
        } else {
          index = [...stops].map((stop, i) => ({...stop, i})).reverse().find((stop) => stop.y < y - 12)?.i ?? 0;
        }

        index = Math.max(0, Math.min(stops.length - 1, index));
        goTo(stops, index);
      }, { passive:false, capture:true });

      const snapNearestAfterScrollbarDrag = () => {
        if (locked) return;
        const stops = collectMagneticStops();
        if (stops.length < 2) return;
        const index = nearestIndex(stops);
        const distance = Math.abs(currentScroll() - stops[index].y);
        if (distance > 6 && distance < Math.min(window.innerHeight * .65, 620)) {
          goTo(stops, index, .5);
        }
      };

      lenis.on('scroll', () => {
        if (locked) return;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(snapNearestAfterScrollbarDrag, 160);
      });

      window.addEventListener('resize', () => {
        clearTimeout(idleTimer);
      }, { passive:true });
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

  const initializeParallax = async () => {
    if (window.__wctMagnetParallaxLoading || window.__wctMagnetParallaxReady) return;
    window.__wctMagnetParallaxLoading = true;

    let coreReady = !!window.gsap;
    if (!coreReady) coreReady = await loadExternalScript('wct-gsap-script', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js');
    if (!coreReady || !window.gsap) {
      window.__wctMagnetParallaxLoading = false;
      return;
    }

    let triggerReady = !!window.ScrollTrigger;
    if (!triggerReady) triggerReady = await loadExternalScript('wct-scrolltrigger-script', 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js');
    if (!triggerReady || !window.ScrollTrigger) {
      window.__wctMagnetParallaxLoading = false;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    window.__wctMagnetParallaxReady = true;
    window.__wctMagnetParallaxLoading = false;
    syncLenisWithScrollTrigger();

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (!document.getElementById('wct-magnet-parallax-style')) {
      const style = document.createElement('style');
      style.id = 'wct-magnet-parallax-style';
      style.textContent = `
        main section,main article,main details,main [class*="card"]{position:relative}
        .wct-parallax-child{will-change:transform;transform:translateZ(0)}
        html.wct-magnet-moving{scroll-behavior:auto!important}
      `;
      document.head.appendChild(style);
    }

    document.querySelectorAll('main > header, main section, main article, main details').forEach((block) => {
      if (block.dataset.wctParallaxMagnet) return;
      block.dataset.wctParallaxMagnet = 'true';

      const children = [...block.children].filter((node) =>
        !node.matches('.table-wrap,.status-table-wrap,.timeline-scroll,script,style,[data-parallax-ignore]')
      );
      children.forEach((child, index) => {
        child.classList.add('wct-parallax-child');
        const amount = Math.min(120, Math.max(58, innerHeight * .11)) * (1 + Math.min(index, 3) * .08);
        gsap.fromTo(child,
          { y:amount * .55, scale:.99 },
          {
            y:-amount * .45,
            scale:1.01,
            ease:'none',
            scrollTrigger:{
              trigger:block,
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
    setTimeout(() => ScrollTrigger.refresh(), 300);
  };

  stabilizeNavbar();
  loadGlossaryBinaryView();
  normalizeWideRegistryTables();
  loadBaseRuntime();
  initializeDiscreteMagnetScroll();
  initializeParallax().catch(() => {
    window.__wctMagnetParallaxLoading = false;
  });
})();
