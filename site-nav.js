(() => {
  const enhanceNavigation = () => {
    const currentPath = window.location.pathname.replace(/index\.html$/i, '').replace(/\/{2,}/g, '/');
    const foundationsActive = currentPath === '/foundations/' || currentPath.startsWith('/foundations/');
    const toolsActive = currentPath === '/tools/' || currentPath.startsWith('/tools/');
    const sympyActive = currentPath === '/sympy/' || currentPath.startsWith('/sympy/');
    const leanActive = currentPath === '/lean/' || currentPath.startsWith('/lean/');

    if (!document.querySelector('link[data-wct-motion-tokens]')) {
      const tokens = document.createElement('link');
      tokens.rel = 'stylesheet';
      tokens.href = '/motion-tokens.css?v=20260826';
      tokens.dataset.wctMotionTokens = 'true';
      document.head.appendChild(tokens);
    }

    if (!document.querySelector('link[data-wct-favicon]')) {
      const icon = document.createElement('link');
      icon.rel = 'icon';
      icon.type = 'image/svg+xml';
      icon.href = '/favicon.svg';
      icon.dataset.wctFavicon = 'true';
      document.head.appendChild(icon);

      const shortcut = document.createElement('link');
      shortcut.rel = 'shortcut icon';
      shortcut.href = '/favicon.svg';
      shortcut.dataset.wctFavicon = 'true';
      document.head.appendChild(shortcut);

      if (!document.querySelector('link[rel="manifest"]')) {
        const manifest = document.createElement('link');
        manifest.rel = 'manifest';
        manifest.href = '/site.webmanifest';
        document.head.appendChild(manifest);
      }
    }

    if (!document.getElementById('wct-wordmark-clickable-style')) {
      const style = document.createElement('style');
      style.id = 'wct-wordmark-clickable-style';
      style.textContent = `
        .site-header .wordmark{
          display:inline-flex;
          align-items:center;
          gap:9px;
          min-height:124px;
          margin-left:-10px;
          padding:5px 10px;
          border:1px solid transparent;
          border-radius:12px;
          color:var(--text,#e9f0f6);
          text-decoration:none;
          cursor:pointer;
          transition:color 130ms ease;
        }
        .site-header .wordmark span:last-child{
          font-weight:820;
          letter-spacing:.055em;
        }
        .site-header .wordmark:hover{
          color:var(--text,#e9f0f6);
          border-color:transparent;
          background:transparent;
          box-shadow:none;
          transform:none;
        }
        .site-header .wordmark:focus-visible{
          outline:2px solid var(--accent,#67d4ff);
          outline-offset:3px;
          border-color:transparent;
          background:transparent;
        }
        .site-header .wordmark .wct-wordmark-logo{
          width:112px;
          height:112px;
          object-fit:contain;
          transform:none;
          filter:drop-shadow(0 8px 18px rgba(0,0,0,.24));
          transition:none;
        }
        .site-header .wordmark:hover .wct-wordmark-logo,
        .site-header .wordmark:focus-visible .wct-wordmark-logo{
          transform:none;
          filter:drop-shadow(0 8px 18px rgba(0,0,0,.24));
        }

        #site-nav>a::after,
        #site-nav .nav-group>.nav-trigger::after{
          height:3px !important;
          border-radius:999px;
          background:linear-gradient(90deg,#67d4ff 0%,#8b7cff 52%,#b6ffda 100%) !important;
          box-shadow:0 0 10px rgba(103,212,255,.18);
        }
        #site-nav>a:hover::after,
        #site-nav>a:focus-visible::after,
        #site-nav .nav-group>.nav-trigger:hover::after,
        #site-nav .nav-group>.nav-trigger:focus-visible::after{
          position:absolute;
          right:0;
          bottom:2px;
          left:0;
          height:3px;
          content:"";
          border-radius:999px;
          background:linear-gradient(90deg,#67d4ff 0%,#8b7cff 52%,#b6ffda 100%);
        }
        #site-nav .nav-dropdown-link::after,
        #site-nav .nav-dropdown-link:hover::after,
        #site-nav .nav-dropdown-link:focus-visible::after{
          display:none !important;
        }

        @media(max-width:760px){
          .site-header .wordmark{min-height:120px;margin-left:-7px;padding:4px 7px;border-radius:10px}
          .site-header .wordmark .wct-wordmark-logo{width:112px;height:112px}
          #site-nav>a::after,#site-nav .nav-group>.nav-trigger::after{display:none !important}
        }
      `;
      document.head.appendChild(style);
    }

    if (!document.getElementById('site-scroll-behavior-style')) {
      const style = document.createElement('style');
      style.id = 'site-scroll-behavior-style';
      style.textContent = `
        html{
          scroll-behavior:auto !important;
          scroll-padding-top:142px;
        }
        .site-header{
          position:sticky !important;
          top:0 !important;
          z-index:1000 !important;
          transition:background-color .22s ease,border-color .22s ease,box-shadow .22s ease,backdrop-filter .22s ease;
          -webkit-backdrop-filter:blur(18px);
          backdrop-filter:blur(18px);
        }
        main [id],section[id],article[id],header[id],footer[id]{
          scroll-margin-top:142px;
        }
        .table-wrap,
        .status-table-wrap,
        .audit-equation,
        .lean-equation,
        .lean-index,
        .nav-dropdown,
        .nav-dropdown-shell,
        .timeline-scroll,
        [data-scroll],
        [class*="scroll"]{
          scroll-behavior:auto;
          overscroll-behavior:contain;
          scrollbar-gutter:stable;
          -webkit-overflow-scrolling:touch;
        }
        @media(max-width:760px){
          html{scroll-padding-top:134px}
          main [id],section[id],article[id],header[id],footer[id]{scroll-margin-top:134px}
        }
        @media(prefers-reduced-motion:reduce){
          .site-header{transition:none !important}
        }
      `;
      document.head.appendChild(style);
    }

    const initializeLenis = () => {
      if (window.__wctLenis || window.__wctLenisLoading) return;
      window.__wctLenisLoading = true;

      if (!document.getElementById('wct-lenis-css')) {
        const link = document.createElement('link');
        link.id = 'wct-lenis-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/lenis@1.3.26/dist/lenis.css';
        document.head.appendChild(link);
      }

      const start = () => {
        if (!window.Lenis || window.__wctLenis) return;
        window.__wctLenis = new window.Lenis({
          autoRaf: true,
          autoToggle: true,
          anchors: { offset: -142 },
          allowNestedScroll: true,
          stopInertiaOnNavigate: true,
          respectReducedMotion: true,
          smoothWheel: true
        });
        window.__wctLenisLoading = false;
      };

      if (window.Lenis) {
        start();
        return;
      }

      let script = document.getElementById('wct-lenis-script');
      if (!script) {
        script = document.createElement('script');
        script.id = 'wct-lenis-script';
        script.src = 'https://unpkg.com/lenis@1.3.26/dist/lenis.min.js';
        script.async = true;
        script.addEventListener('load', start, { once: true });
        script.addEventListener('error', () => { window.__wctLenisLoading = false; }, { once: true });
        document.head.appendChild(script);
      } else {
        script.addEventListener('load', start, { once: true });
      }
    };
    initializeLenis();

    if (currentPath === '/') {
      const heroEyebrow = document.querySelector('.hero-copy > .eyebrow');
      if (heroEyebrow) heroEyebrow.textContent = 'Richard J. Reyes';

      const aboutSection = document.getElementById('about');
      const statusStrip = document.querySelector('.status-strip');
      if (aboutSection && statusStrip) statusStrip.insertAdjacentElement('afterend', aboutSection);
    }

    const standardHeaderPaths = new Set([
      '/publications/', '/priority/', '/overlap/', '/patents/', '/equations/',
      '/sympy/', '/lean/', '/reproduce/', '/tools/', '/foundations/'
    ]);
    const standardHeaderActive = standardHeaderPaths.has(currentPath) || currentPath.startsWith('/tools/');
    if (standardHeaderActive) {
      const pageTitle = document.querySelector('main h1');
      const pageHero = pageTitle?.closest('header,section');
      if (pageTitle && pageHero) {
        pageHero.classList.add('site-page-hero');

        if (!pageTitle.querySelector('span') && pageTitle.childElementCount === 0) {
          const titleText = pageTitle.textContent.trim();
          const splitAt = titleText.lastIndexOf(' ');
          if (splitAt > 0) {
            pageTitle.textContent = `${titleText.slice(0, splitAt)} `;
            const accent = document.createElement('span');
            accent.className = 'site-page-title-accent';
            accent.textContent = titleText.slice(splitAt + 1);
            pageTitle.appendChild(accent);
          }
        }

        if (!document.getElementById('site-page-hero-style')) {
          const style = document.createElement('style');
          style.id = 'site-page-hero-style';
          style.textContent = `
            .site-page-hero{
              padding-top:88px !important;
              padding-bottom:54px !important;
            }
            .site-page-hero h1{
              max-width:900px;
              margin:0 !important;
              font-family:Georgia,"Times New Roman",serif !important;
              font-size:clamp(3rem,7vw,6rem) !important;
              font-weight:500 !important;
              letter-spacing:-.045em !important;
              line-height:1.02 !important;
            }
            .site-page-hero h1>.site-page-title-accent,
            .site-page-hero.patent-hero h1>span{
              color:transparent !important;
              background:linear-gradient(100deg,var(--accent,#67d4ff) 0%,#8fd8ff 42%,#a899ff 100%);
              background-clip:text;
              -webkit-background-clip:text;
            }
            .site-page-hero>h1+p,
            .site-page-hero .section-heading h1+p,
            .site-page-hero .foundation-head h1+p,
            .site-page-hero .pub-index-head h1+p,
            .site-page-hero .tool-hero-lede,
            .site-page-hero .hero-lede{
              max-width:880px !important;
              margin-top:1.2rem;
              color:var(--muted,#9cb0c1);
              font-size:clamp(1rem,1.55vw,1.16rem);
              line-height:1.75;
            }
            .site-page-hero>.eyebrow,
            .site-page-hero .section-heading>.eyebrow,
            .site-page-hero>.paper-kicker{
              margin-bottom:.75rem;
            }
            @media(max-width:620px){
              .site-page-hero{padding-top:64px !important;padding-bottom:40px !important}
            }
          `;
          document.head.appendChild(style);
        }
      }
    }

    const typesetRawMath = (selector) => {
      let attempts = 0;
      const run = () => {
        const mathJax = window.MathJax;
        const raw = [...document.querySelectorAll(selector)].filter((node) => !node.querySelector('mjx-container'));
        if (!raw.length) return;
        if (mathJax?.startup?.promise && mathJax?.typesetPromise) {
          mathJax.startup.promise.then(() => {
            requestAnimationFrame(() => {
              mathJax.typesetPromise(raw).catch(() => {});
            });
          });
          return;
        }
        if (attempts++ < 100) window.setTimeout(run, 50);
      };
      run();
    };

    if (sympyActive) {
      if (!document.getElementById('sympy-card-width-style')) {
        const style = document.createElement('style');
        style.id = 'sympy-card-width-style';
        style.textContent = `
          #main .audit-grid{
            display:block !important;
          }
          #main .audit-card{
            display:flex;
            width:100%;
            max-width:none;
            min-height:0;
            margin:0 0 1rem;
          }
          #main .audit-card:last-child{margin-bottom:0}
        `;
        document.head.appendChild(style);
      }

      const typesetSympy = () => typesetRawMath('.audit-equation');
      if (document.readyState === 'complete') typesetSympy();
      else window.addEventListener('load', typesetSympy, { once: true });
    }

    if (leanActive) {
      const typesetLeanOnLoad = () => typesetRawMath('.lean-equation');
      if (document.readyState === 'complete') typesetLeanOnLoad();
      else window.addEventListener('load', typesetLeanOnLoad, { once: true });
    }

    if (currentPath === '/tools/glossary/') {
      const glossaryDefinitions = document.createElement('script');
      glossaryDefinitions.src = '/tools/glossary-definitions.js?v=20260826-expanded';
      glossaryDefinitions.async = false;
      document.head.appendChild(glossaryDefinitions);
    }

    if (foundationsActive) {
      if (!document.getElementById('foundation-selectable-style')) {
        const style = document.createElement('style');
        style.id = 'foundation-selectable-style';
        style.textContent = `
          .foundation-shell tbody tr.foundation-selectable-row{cursor:pointer;transition:background 120ms ease,box-shadow 120ms ease}
          .foundation-shell tbody tr.foundation-selectable-row td{transition:background 120ms ease,color 120ms ease}
          .foundation-shell tbody tr.foundation-selectable-row:hover td,
          .foundation-shell tbody tr.foundation-selectable-row:focus-visible td{
            background:linear-gradient(90deg,rgba(103,212,255,.075),rgba(139,124,255,.065),rgba(182,255,218,.045));
          }
          .foundation-shell tbody tr.foundation-selectable-row:hover .work a,
          .foundation-shell tbody tr.foundation-selectable-row:focus-visible .work a{color:#fff}
          .foundation-shell tbody tr.foundation-selectable-row:focus-visible{outline:2px solid rgba(103,212,255,.72);outline-offset:-2px}
          .foundation-shell tbody tr.foundation-selectable-row .rank{position:relative}
          .foundation-shell tbody tr.foundation-selectable-row .rank::after{content:'↗';display:block;margin-top:5px;color:var(--muted-2,#71869a);font-size:.66rem;font-weight:700;opacity:.42;transition:opacity 120ms ease,transform 120ms ease}
          .foundation-shell tbody tr.foundation-selectable-row:hover .rank::after,
          .foundation-shell tbody tr.foundation-selectable-row:focus-visible .rank::after{opacity:1;transform:translate(1px,-1px);color:var(--accent,#67d4ff)}
        `;
        document.head.appendChild(style);
      }

      document.querySelectorAll('.foundation-shell tbody tr').forEach((row) => {
        const primaryLink = row.querySelector('.work a[href]');
        if (!primaryLink || row.classList.contains('foundation-selectable-row')) return;
        const title = primaryLink.textContent.trim();
        row.classList.add('foundation-selectable-row');
        row.tabIndex = 0;
        row.setAttribute('role', 'link');
        row.setAttribute('aria-label', `Open source for ${title} in a new tab`);

        const openPrimary = () => window.open(primaryLink.href, '_blank', 'noopener,noreferrer');
        row.addEventListener('click', (event) => {
          if (event.target.closest('a')) return;
          openPrimary();
        });
        row.addEventListener('keydown', (event) => {
          if (event.target.closest('a')) return;
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          openPrimary();
        });
      });
    }

    const nav = document.querySelector('#site-nav');
    if (nav) {
      const toolsLink = [...nav.children].find((item) => item.matches?.('a[href="/tools/"]'));
      if (toolsLink) {
        const group = document.createElement('div');
        group.className = `nav-group tools-nav-group${toolsActive ? ' is-active' : ''}`;
        group.innerHTML = `
          <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="nav-menu-tools">
            <span>Tools</span><span class="nav-caret" aria-hidden="true">▾</span>
          </button>
          <div class="nav-dropdown" id="nav-menu-tools" role="group" aria-label="Tools">
            <div class="nav-dropdown-shell">
              <a href="/tools/glossary/" class="nav-dropdown-link"><span class="nav-item-label">Glossary</span><span class="nav-item-desc">Alphabetical concepts, definitions, and notation</span></a>
              <a href="/tools/equations/" class="nav-dropdown-link"><span class="nav-item-label">Equations</span><span class="nav-item-desc">Interactive canonical equation explorer</span></a>
              <a href="/tools/timeline/" class="nav-dropdown-link"><span class="nav-item-label">Timeline</span><span class="nav-item-desc">Dated research chronology and releases</span></a>
              <a href="/tools/graph/" class="nav-dropdown-link"><span class="nav-item-label">Graph</span><span class="nav-item-desc">Interactive concept and corpus connections</span></a>
              <a href="/tools/videos/" class="nav-dropdown-link"><span class="nav-item-label">Videos</span><span class="nav-item-desc">Playlist videos with individual descriptions</span></a>
            </div>
          </div>`;
        toolsLink.replaceWith(group);

        const trigger = group.querySelector('.nav-trigger');
        const mobileNav = window.matchMedia('(max-width: 760px)');
        trigger.addEventListener('click', (event) => {
          if (!mobileNav.matches) return;
          event.stopPropagation();
          const willOpen = !group.classList.contains('open');
          nav.querySelectorAll('.nav-group.open').forEach((other) => {
            if (other === group) return;
            other.classList.remove('open');
            other.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
          });
          group.classList.toggle('open', willOpen);
          trigger.setAttribute('aria-expanded', String(willOpen));
        });
        group.addEventListener('mouseenter', () => {
          if (!mobileNav.matches) trigger.setAttribute('aria-expanded', 'true');
        });
        group.addEventListener('mouseleave', () => {
          if (!mobileNav.matches) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    }

    const footerResearch = [...document.querySelectorAll('.site-footer h2')]
      .find((heading) => heading.textContent.trim() === 'Research')?.parentElement;
    if (footerResearch && !footerResearch.querySelector('a[href="/foundations/"]')) {
      const link = document.createElement('a');
      link.href = '/foundations/';
      link.textContent = 'Scientific Foundations';
      const corpus = footerResearch.querySelector('a[href="/research-corpus/"]');
      if (corpus) corpus.insertAdjacentElement('afterend', link);
      else footerResearch.appendChild(link);
    }
  };

  const core = document.createElement('script');
  core.src = '/site-nav-core.js?v=20260826-tools-pages';
  core.async = false;
  core.addEventListener('load', enhanceNavigation);
  document.head.appendChild(core);
})();