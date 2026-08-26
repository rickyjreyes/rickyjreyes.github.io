(() => {
  const enhanceNavigation = () => {
    const currentPath = window.location.pathname.replace(/index\.html$/i, '').replace(/\/{2,}/g, '/');
    const foundationsActive = currentPath === '/foundations/' || currentPath.startsWith('/foundations/');
    const toolsActive = currentPath === '/tools/' || currentPath.startsWith('/tools/');

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

    if (currentPath === '/') {
      const heroEyebrow = document.querySelector('.hero-copy > .eyebrow');
      if (heroEyebrow) heroEyebrow.textContent = 'Richard J. Reyes';

      const aboutSection = document.getElementById('about');
      const statusStrip = document.querySelector('.status-strip');
      if (aboutSection && statusStrip) statusStrip.insertAdjacentElement('afterend', aboutSection);
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