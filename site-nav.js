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
      link.href = '/tools/glossary/binary-priority.css?v=20260828-tabs';
      document.head.appendChild(link);
    }

    if (!document.getElementById('wct-glossary-binary-priority-js')) {
      const script = document.createElement('script');
      script.id = 'wct-glossary-binary-priority-js';
      script.src = '/tools/glossary/binary-priority.js?v=20260828-tabs';
      script.defer = true;
      document.head.appendChild(script);
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
  loadBaseRuntime();
  initializeGsap().catch(() => {
    window.__wctGsapLoading = false;
  });
})();
