(() => {
  const wrap = document.querySelector('.site-header .nav-wrap');
  if (!wrap) return;

  const wordmark = wrap.querySelector('.wordmark');
  if (wordmark) {
    wordmark.href = '/#top';
    wordmark.setAttribute('aria-label', 'Wave Confinement Theory home');
    wordmark.innerHTML = `<img class="wct-wordmark-logo" src="/assets/Wavelock_transparent.png" alt="" aria-hidden="true"><span>WCT</span>`;
  }

  const normalizePath = (value) => {
    let path = value || '/';
    path = path.replace(/index\.html$/i, '');
    if (!path.startsWith('/')) path = `/${path}`;
    if (path !== '/' && !path.endsWith('/')) path += '/';
    return path.replace(/\/{2,}/g, '/');
  };

  const currentPath = normalizePath(window.location.pathname);
  const isActivePath = (href) => {
    const target = normalizePath(href);
    return target === '/' ? currentPath === '/' : currentPath === target || currentPath.startsWith(target);
  };

  const navItems = [
    { type: 'link', href: '/publications/', label: 'Publications' },
    { type: 'link', href: '/priority/', label: 'Priority' },
    { type: 'link', href: '/overlap/', label: 'WCT Adoption' },
    { type: 'link', href: '/patents/', label: 'Patents' },
    { type: 'link', href: '/equations/', label: 'Equations' },
    {
      type: 'menu', label: 'Verify', items: [
        ['/sympy/', 'SymPy Audit', 'Executable symbolic checks'],
        ['/lean/', 'Lean Coverage', 'Formal definitions and proof coverage']
      ]
    },
    { type: 'link', href: '/reproduce/', label: 'Reproduce' },
    { type: 'link', href: '/tools/', label: 'Tools' },
    { type: 'link', href: '/foundations/', label: 'Foundations' }
  ];

  let nav = wrap.querySelector('nav');
  if (!nav) {
    nav = document.createElement('nav');
    wrap.appendChild(nav);
  }

  const renderLink = (href, label, className = '', description = '') => {
    const active = isActivePath(href);
    const classes = [className, active ? 'is-active' : ''].filter(Boolean).join(' ');
    const body = description
      ? `<span class="nav-item-label">${label}</span><span class="nav-item-desc">${description}</span>`
      : label;
    return `<a href="${href}"${classes ? ` class="${classes}"` : ''}${active ? ' aria-current="page"' : ''}>${body}</a>`;
  };

  nav.id = 'site-nav';
  nav.className = '';
  nav.setAttribute('aria-label', 'Primary navigation');
  nav.innerHTML = navItems.map((item, index) => {
    if (item.type === 'link') return renderLink(item.href, item.label);
    const groupActive = item.items.some(([href]) => isActivePath(href));
    const menuId = `nav-menu-${index}`;
    return `
      <div class="nav-group${groupActive ? ' is-active' : ''}">
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="${menuId}">
          <span>${item.label}</span><span class="nav-caret" aria-hidden="true">▾</span>
        </button>
        <div class="nav-dropdown" id="${menuId}" role="group" aria-label="${item.label}">
          <div class="nav-dropdown-shell">
            ${item.items.map(([href, label, description]) => renderLink(href, label, 'nav-dropdown-link', description)).join('')}
          </div>
        </div>
      </div>`;
  }).join('');

  if (!document.getElementById('site-enhancement-style')) {
    const style = document.createElement('style');
    style.id = 'site-enhancement-style';
    style.textContent = `
      .site-header .wordmark{font-size:.97rem;font-weight:750;letter-spacing:.002em}
      .site-header .mark{width:34px;height:34px;border-color:rgba(103,212,255,.52);box-shadow:0 0 0 1px rgba(103,212,255,.04),0 8px 28px rgba(0,0,0,.2)}
      .site-header .wct-wordmark-logo{display:block;width:38px;height:38px;object-fit:contain;filter:drop-shadow(0 8px 18px rgba(0,0,0,.24))}
      #site-nav{gap:clamp(24px,2.35vw,38px)}
      #site-nav>a,#site-nav .nav-trigger{position:relative;color:var(--muted,#9cb0c1);font-size:.82rem;font-weight:560;letter-spacing:.012em;text-decoration:none;transition:color 120ms ease}
      #site-nav>a{padding-block:10px}
      #site-nav .nav-group{position:relative}
      #site-nav .nav-trigger{display:inline-flex;align-items:center;gap:5px;padding:10px 0;border:0;background:transparent;color:var(--muted,#9cb0c1);cursor:default}
      #site-nav .nav-caret{position:relative;top:-1px;color:var(--muted-2,#71869a);font-size:.62rem;line-height:1;transition:transform 90ms ease,color 120ms ease}
      #site-nav>a:hover,#site-nav>a:focus-visible,#site-nav .nav-trigger:hover,#site-nav .nav-trigger:focus-visible,#site-nav .nav-group.is-active>.nav-trigger{color:var(--text,#e9f0f6)}
      #site-nav .nav-trigger:hover .nav-caret,#site-nav .nav-trigger:focus-visible .nav-caret{color:var(--accent,#67d4ff)}
      #site-nav>a.is-active,#site-nav>a[aria-current="page"],#site-nav .nav-group.is-active>.nav-trigger{color:var(--text,#e9f0f6)}
      #site-nav>a.is-active::after,#site-nav>a[aria-current="page"]::after,#site-nav .nav-group.is-active>.nav-trigger::after{position:absolute;right:0;bottom:3px;left:0;height:1px;content:"";background:rgba(103,212,255,.82);box-shadow:none}
      @media(min-width:761px){
        #site-nav .nav-dropdown{position:absolute;top:100%;left:0;z-index:120;display:none;min-width:272px;padding-top:9px;transform:none}
        #site-nav .nav-dropdown-shell{padding:7px;border:1px solid rgba(170,201,225,.18);border-radius:10px;background:rgba(5,12,21,.995);box-shadow:0 22px 64px rgba(0,0,0,.34)}
        #site-nav .nav-group:hover>.nav-dropdown,#site-nav .nav-group.hover-open>.nav-dropdown,#site-nav .nav-group:focus-within>.nav-dropdown{display:block}
        #site-nav .nav-group:hover>.nav-trigger .nav-caret,#site-nav .nav-group.hover-open>.nav-trigger .nav-caret,#site-nav .nav-group:focus-within>.nav-trigger .nav-caret{transform:rotate(180deg);color:var(--accent,#67d4ff)}
      }
      #site-nav .nav-dropdown-link{display:block;padding:10px 11px;border-radius:7px;color:var(--text,#e9f0f6);text-decoration:none;white-space:normal;transition:background 100ms ease}
      #site-nav .nav-dropdown-link:hover,#site-nav .nav-dropdown-link:focus-visible,#site-nav .nav-dropdown-link.is-active{color:var(--text,#e9f0f6);background:rgba(103,212,255,.075)}
      #site-nav .nav-dropdown-link.is-active{box-shadow:inset 2px 0 0 rgba(103,212,255,.72)}
      #site-nav .nav-dropdown-link.is-active::after{display:none}
      #site-nav .nav-item-label{display:block;font-size:.81rem;font-weight:680;line-height:1.25}
      #site-nav .nav-item-desc{display:block;margin-top:3px;color:var(--muted-2,#71869a);font-size:.68rem;font-weight:450;letter-spacing:0;line-height:1.35}
      #site-nav .nav-dropdown-link:hover .nav-item-desc,#site-nav .nav-dropdown-link:focus-visible .nav-item-desc{color:var(--muted,#9cb0c1)}

      .identity-links.profile-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;max-width:650px;margin-top:24px}
      .profile-link-card{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:11px;min-height:64px;padding:10px 12px;border:1px solid var(--line,rgba(170,201,225,.16));border-radius:13px;color:var(--text,#e9f0f6);background:rgba(11,23,39,.72);text-decoration:none;transition:transform 140ms ease,border-color 140ms ease,background 140ms ease}
      .profile-link-card:hover,.profile-link-card:focus-visible{color:var(--text,#e9f0f6);border-color:rgba(103,212,255,.38);background:rgba(14,29,48,.96);transform:translateY(-2px)}
      .profile-icon{display:grid;width:42px;height:42px;place-items:center;border:1px solid rgba(255,255,255,.12);border-radius:11px;font-size:.8rem;font-weight:900;letter-spacing:-.02em;background:rgba(255,255,255,.055)}
      .profile-link-card[data-brand="github"] .profile-icon{font-size:.72rem}
      .profile-link-card[data-brand="linkedin"] .profile-icon{font-family:Arial,sans-serif;font-size:1rem}
      .profile-link-card[data-brand="zenodo"] .profile-icon{font-size:1rem}
      .profile-link-card[data-brand="orcid"] .profile-icon{font-size:.78rem}
      .profile-copy{min-width:0}
      .profile-copy strong{display:block;font-size:.87rem;line-height:1.2}
      .profile-copy span{display:block;margin-top:4px;overflow:hidden;color:var(--muted-2,#71869a);font-size:.7rem;line-height:1.25;text-overflow:ellipsis;white-space:nowrap}
      .profile-arrow{color:var(--accent,#67d4ff);font-size:1rem}

      .about-section.has-portrait{grid-template-columns:minmax(230px,.68fr) minmax(0,1.2fr) minmax(220px,.82fr);gap:clamp(30px,5vw,72px);align-items:start}
      .about-portrait{position:sticky;top:108px;margin:0}
      .about-portrait-frame{position:relative;overflow:hidden;border:1px solid var(--line-strong,rgba(170,201,225,.3));border-radius:22px;background:linear-gradient(145deg,rgba(103,212,255,.08),rgba(139,124,255,.05));box-shadow:var(--shadow,0 24px 80px rgba(0,0,0,.26))}
      .about-portrait-frame::after{position:absolute;inset:0;content:"";pointer-events:none;box-shadow:inset 0 0 0 1px rgba(255,255,255,.035)}
      .about-portrait img{display:block;width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;object-position:center top}
      .about-portrait figcaption{margin-top:13px;color:var(--muted-2,#71869a);font-size:.75rem;line-height:1.55}
      .about-portrait figcaption strong{display:block;color:var(--text,#e9f0f6);font-size:.86rem}

      .wavelock-card-logo{display:block;width:86px;height:86px;margin:-10px -8px 6px auto;object-fit:contain;filter:drop-shadow(0 12px 24px rgba(0,0,0,.28))}
      .patent-home-brand{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;min-height:78px}
      .patent-wavelock-logo{display:block;width:min(100%,230px);height:auto;margin:0 0 18px;border:1px solid rgba(103,212,255,.16);border-radius:22px;background:#080d14;object-fit:contain;box-shadow:0 18px 48px rgba(0,0,0,.24)}
      .patent-experiment-image{display:block;width:100%;aspect-ratio:16/10;margin:0 0 18px;border:1px solid rgba(103,212,255,.16);border-radius:18px;object-fit:cover;box-shadow:0 18px 48px rgba(0,0,0,.2)}

      .frozen-release-callout{border-top:1px solid rgba(103,212,255,.18);border-bottom:1px solid rgba(103,212,255,.18);background:linear-gradient(90deg,rgba(24,101,145,.16),rgba(20,184,166,.08))}
      .frozen-release-inner{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:1rem;padding:1rem 0}
      .frozen-release-dot{width:.7rem;height:.7rem;border-radius:50%;background:#64e19d;box-shadow:0 0 18px rgba(100,225,157,.7)}
      .frozen-release-copy strong{display:block;margin-bottom:.15rem}
      .frozen-release-copy span{color:var(--muted,#a7b4c6);font-size:.92rem}
      .frozen-release-link{white-space:nowrap;font-weight:700}

      .patent-home-section{padding-block:88px;border-top:1px solid var(--line,rgba(170,201,225,.16));border-bottom:1px solid var(--line,rgba(170,201,225,.16));background:linear-gradient(180deg,rgba(8,19,33,.32),rgba(14,29,48,.52))}
      .patent-home-heading{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(260px,.85fr);gap:40px;align-items:end;margin-bottom:30px}
      .patent-home-heading h2{margin:0;font-family:Georgia,"Times New Roman",serif;font-size:clamp(2.25rem,5vw,4.6rem);font-weight:500;letter-spacing:-.04em;line-height:1.04}
      .patent-home-heading p:last-child{margin:0;color:var(--muted,#9cb0c1)}
      .patent-home-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
      .patent-home-card{display:flex;flex-direction:column;min-height:220px;padding:22px;border:1px solid var(--line,rgba(170,201,225,.16));border-radius:16px;background:linear-gradient(155deg,rgba(14,29,48,.96),rgba(8,19,33,.93))}
      .patent-home-card>span,.patent-home-brand>span{color:var(--accent,#67d4ff);font-size:.7rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase}
      .patent-home-card h3{margin:13px 0 10px;font-family:Georgia,"Times New Roman",serif;font-size:1.28rem;font-weight:500;line-height:1.15}
      .patent-home-card p{margin:0;color:var(--muted,#9cb0c1);font-size:.9rem}
      .patent-home-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}

      @media(max-width:1050px){.about-section.has-portrait{grid-template-columns:minmax(220px,.76fr) minmax(0,1.24fr)}.about-section.has-portrait .about-facts{grid-column:1/-1}.about-portrait{top:94px}}
      @media(max-width:980px){.patent-home-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:760px){
        .site-header .wordmark{font-size:.94rem}
        .site-header .wct-wordmark-logo{width:34px;height:34px}
        #site-nav{gap:0}
        #site-nav>a,#site-nav .nav-trigger{font-size:.86rem;font-weight:620}
        #site-nav>a{padding:12px 11px}
        #site-nav>a.is-active,#site-nav>a[aria-current="page"],#site-nav .nav-group.is-active>.nav-trigger{padding-inline:10px;border-radius:8px;background:rgba(103,212,255,.065);box-shadow:none}
        #site-nav>a.is-active::after,#site-nav>a[aria-current="page"]::after,#site-nav .nav-group.is-active>.nav-trigger::after{display:none}
        #site-nav .nav-group{width:100%}
        #site-nav .nav-trigger{width:100%;justify-content:space-between;padding:12px 11px;border-radius:8px;cursor:pointer}
        #site-nav .nav-trigger:hover{background:rgba(103,212,255,.045)}
        #site-nav .nav-dropdown{position:static;display:none;width:100%;padding:0}
        #site-nav .nav-dropdown-shell{margin:0 0 5px;padding:4px 5px 6px;border:0;border-left:1px solid rgba(103,212,255,.16);border-radius:0;background:transparent;box-shadow:none}
        #site-nav .nav-group.open>.nav-dropdown{display:block}
        #site-nav .nav-group.open>.nav-trigger .nav-caret{transform:rotate(180deg);color:var(--accent,#67d4ff)}
        #site-nav .nav-dropdown-link{margin-left:8px;padding:9px 12px 9px 16px;border-radius:7px;white-space:normal}
        #site-nav .nav-item-label{font-size:.8rem}
        #site-nav .nav-item-desc{font-size:.67rem}
        .identity-links.profile-links{grid-template-columns:1fr;max-width:480px}
        .about-section.has-portrait{grid-template-columns:1fr}.about-section.has-portrait .about-facts{grid-column:auto}.about-portrait{position:static;width:min(100%,390px)}.wavelock-card-logo{width:76px;height:76px}.frozen-release-inner{grid-template-columns:auto 1fr}.frozen-release-link{grid-column:2}
      }
      @media(max-width:700px){.patent-home-heading{grid-template-columns:1fr;gap:16px}.patent-home-grid{grid-template-columns:1fr}.patent-home-card{min-height:auto}}
    `;
    document.head.appendChild(style);
  }

  let menu = wrap.querySelector('.menu-button');
  const insertedMenu = !menu;
  if (!menu) {
    menu = document.createElement('button');
    menu.className = 'menu-button';
    menu.type = 'button';
    menu.textContent = 'Menu';
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-controls', 'site-nav');
    wrap.insertBefore(menu, nav);
  } else {
    menu.setAttribute('aria-controls', 'site-nav');
  }

  const closeDropdowns = (except = null) => {
    nav.querySelectorAll('.nav-group.open').forEach((group) => {
      if (group === except) return;
      group.classList.remove('open');
      group.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
    });
  };

  const mobileNav = window.matchMedia('(max-width: 760px)');
  nav.querySelectorAll('.nav-trigger').forEach((trigger) => {
    const group = trigger.closest('.nav-group');
    group.addEventListener('mouseenter', () => {
      if (mobileNav.matches) return;
      group.classList.add('hover-open');
      trigger.setAttribute('aria-expanded', 'true');
    });
    group.addEventListener('mouseleave', () => {
      if (mobileNav.matches) return;
      group.classList.remove('hover-open');
      trigger.setAttribute('aria-expanded', 'false');
    });
    group.addEventListener('focusin', () => {
      if (!mobileNav.matches) trigger.setAttribute('aria-expanded', 'true');
    });
    group.addEventListener('focusout', () => {
      if (mobileNav.matches) return;
      requestAnimationFrame(() => {
        if (!group.contains(document.activeElement)) trigger.setAttribute('aria-expanded', 'false');
      });
    });
    trigger.addEventListener('click', (event) => {
      if (!mobileNav.matches) {
        if (event.detail > 0) trigger.blur();
        return;
      }
      event.stopPropagation();
      const willOpen = !group.classList.contains('open');
      closeDropdowns(group);
      group.classList.toggle('open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
    });
  });

  mobileNav.addEventListener?.('change', () => {
    closeDropdowns();
    nav.querySelectorAll('.nav-group').forEach((group) => group.classList.remove('hover-open'));
  });

  const legacyMenuController = [...document.scripts].some((script) => /(^|\/)script\.js$/.test(script.getAttribute('src') || ''));
  if (insertedMenu || !legacyMenuController) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      if (!open) closeDropdowns();
    });
  }

  nav.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return;
    closeDropdowns();
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target)) closeDropdowns();
    if (menu && !nav.contains(event.target) && !menu.contains(event.target)) {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeDropdowns();
    nav.querySelectorAll('.nav-group').forEach((group) => group.classList.remove('hover-open'));
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  });

  if (currentPath === '/lean/' && !document.getElementById('lean-hierarchy-loader')) {
    const script = document.createElement('script');
    script.id = 'lean-hierarchy-loader';
    script.src = '/lean/hierarchy.js?v=20260819a';
    script.async = false;
    document.body.appendChild(script);
  }

  if (currentPath === '/') {
    const heroActions = document.querySelector('.hero-actions');
    if (heroActions) {
      heroActions.innerHTML = `
        <a class="button primary" href="#start">Start reading</a>
        <a class="button secondary" href="/publications/">Publications</a>
        <a class="button secondary" href="/research-corpus/">Explore research</a>`;
    }

    const identityLinks = document.querySelector('.identity-links');
    if (identityLinks) {
      identityLinks.classList.add('profile-links');
      identityLinks.innerHTML = `
        <a class="profile-link-card" data-brand="github" href="https://github.com/rickyjreyes" target="_blank" rel="noopener noreferrer" aria-label="Richard J. Reyes on GitHub (opens in a new tab)"><span class="profile-icon" aria-hidden="true">GH</span><span class="profile-copy"><strong>GitHub</strong><span>github.com/rickyjreyes</span></span><span class="profile-arrow" aria-hidden="true">↗</span></a>
        <a class="profile-link-card" data-brand="linkedin" href="https://www.linkedin.com/in/rickyjreyes/" target="_blank" rel="noopener noreferrer" aria-label="Richard J. Reyes on LinkedIn (opens in a new tab)"><span class="profile-icon" aria-hidden="true">in</span><span class="profile-copy"><strong>LinkedIn</strong><span>linkedin.com/in/rickyjreyes</span></span><span class="profile-arrow" aria-hidden="true">↗</span></a>
        <a class="profile-link-card" data-brand="zenodo" href="https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Reyes%2C+Richard+J.%22" target="_blank" rel="noopener noreferrer" aria-label="Richard J. Reyes publications on Zenodo (opens in a new tab)"><span class="profile-icon" aria-hidden="true">Z</span><span class="profile-copy"><strong>Zenodo</strong><span>DOI publication archive</span></span><span class="profile-arrow" aria-hidden="true">↗</span></a>
        <a class="profile-link-card" data-brand="orcid" href="https://orcid.org/0009-0005-5975-8718" target="_blank" rel="noopener noreferrer" aria-label="Richard J. Reyes ORCID record (opens in a new tab)"><span class="profile-icon" aria-hidden="true">iD</span><span class="profile-copy"><strong>ORCID</strong><span>0009-0005-5975-8718</span></span><span class="profile-arrow" aria-hidden="true">↗</span></a>`;
    }

    const orientationCards = [...document.querySelectorAll('.orientation-grid li')];
    const zenodoCard = orientationCards.find((card) => card.querySelector('.orientation-tag')?.textContent.trim() === 'Zenodo');
    const zenodoLink = zenodoCard?.querySelector('a');
    if (zenodoLink) {
      zenodoLink.href = 'https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Reyes%2C+Richard+J.%22';
      zenodoLink.target = '_blank';
      zenodoLink.rel = 'noopener noreferrer';
      zenodoLink.innerHTML = 'View Zenodo archive <span aria-hidden="true">→</span>';
    }

    const publicationHeadingLink = document.querySelector('.publications-heading .text-link');
    if (publicationHeadingLink) publicationHeadingLink.innerHTML = 'Browse all publications <span aria-hidden="true">→</span>';

    const archiveActions = document.querySelector('.archive-cta-actions');
    if (archiveActions) {
      archiveActions.innerHTML = `
        <a class="button primary" href="/publications/">Browse all publications</a>
        <a class="button secondary" href="https://github.com/rickyjreyes/geometry_of_resonance" target="_blank" rel="noopener noreferrer">Code &amp; data on GitHub</a>`;
    }

    const hero = document.querySelector('main .hero');
    if (hero && !document.querySelector('.frozen-release-callout')) {
      const callout = document.createElement('section');
      callout.className = 'frozen-release-callout';
      callout.setAttribute('aria-label', 'Frozen reproducible release');
      callout.innerHTML = `<div class="section-shell frozen-release-inner"><span class="frozen-release-dot" aria-hidden="true"></span><div class="frozen-release-copy"><strong>WCT-2026.2 is frozen and reproducible.</strong><span>Exact commits, Lean, SymPy, registry, simulation, figure regeneration, Docker, Nix, and expected hashes.</span></div><a class="frozen-release-link" href="/reproduce/">Run it →</a></div>`;
      hero.insertAdjacentElement('afterend', callout);
    }

    const branches = document.querySelector('#branches');
    if (branches && !document.querySelector('.patent-home-section')) {
      const section = document.createElement('section');
      section.className = 'patent-home-section';
      section.setAttribute('aria-labelledby', 'patent-home-title');
      section.innerHTML = `
        <div class="section-shell">
          <div class="patent-home-heading"><div><p class="eyebrow">Inventions and intellectual property</p><h2 id="patent-home-title">Four filed technology families.</h2></div><p>Public, non-enabling summaries connect the filing chronology to related papers, repositories, experiments, and evidence-status labels without publishing confidential application material.</p></div>
          <div class="patent-home-grid" aria-label="Filed technology families">
            <article class="patent-home-card"><div class="patent-home-brand"><span>Patent pending</span><img class="wavelock-card-logo" src="/assets/Wavelock_transparent.png" alt="WaveLock wave-shaped logo" loading="lazy" decoding="async"></div><h3>WaveLock and drift detection</h3><p>Curvature-regulated commitments, replay verification, protocol binding, attestation, and runtime drift analysis.</p></article>
            <article class="patent-home-card"><span>Patent pending</span><h3>Persistent wave memory</h3><p>Wave-state storage, spectral confinement, readout, reset control, physical cells, arrays, and software emulation.</p></article>
            <article class="patent-home-card"><span>Application filed</span><h3>Solid-state frequency reference</h3><p>Optically programmed semiconductor resonance with harmonic readout and oscillator-integration concepts.</p></article>
            <article class="patent-home-card"><span>Application filed</span><h3>Coherent field generator</h3><p>Structured excitation, controlled confinement geometry, harmonic stabilization, relocking, and detector feedback.</p></article>
          </div>
          <div class="patent-home-actions"><a class="button primary" href="/patents/">Open patent portfolio</a><a class="button secondary" href="/patents.json">View machine-readable metadata</a></div>
        </div>`;
      branches.insertAdjacentElement('afterend', section);
    }

    const about = document.querySelector('.about-section');
    if (about && !about.querySelector('.about-portrait')) {
      about.classList.add('has-portrait');
      const portrait = document.createElement('figure');
      portrait.className = 'about-portrait';
      portrait.innerHTML = `<div class="about-portrait-frame"><img src="/assets/richardjreyes.png" alt="Richard J. Reyes, controls engineer and independent researcher" loading="lazy" decoding="async"></div><figcaption><strong>Richard J. Reyes</strong>Controls engineer, software developer, independent researcher, and founder of WaveLock.</figcaption>`;
      about.insertAdjacentElement('afterbegin', portrait);
    }

    const footerResearch = [...document.querySelectorAll('.site-footer h2')].find((heading) => heading.textContent.trim() === 'Research')?.parentElement;
    const addFooterLink = (href, label) => {
      if (!footerResearch || footerResearch.querySelector(`a[href="${href}"]`)) return;
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      footerResearch.appendChild(link);
    };
    addFooterLink('/priority/', 'Priority & convergence');
    addFooterLink('/overlap/', 'Post-date overlap ledger');
    addFooterLink('/patents/', 'Patent applications');
  }

  if (currentPath === '/priority/') {
    const topLinks = document.querySelector('.toplinks');
    if (topLinks && !topLinks.querySelector('a[href="/overlap/"]')) {
      const link = document.createElement('a');
      link.className = 'button secondary';
      link.href = '/overlap/';
      link.textContent = 'Post-Date Overlap Ledger';
      topLinks.appendChild(link);
    }
  }

  if (currentPath === '/patents/') {
    const patentCards = document.querySelectorAll('.patent-card');
    const waveLockCard = patentCards[0];
    if (waveLockCard && !waveLockCard.querySelector('.patent-wavelock-logo')) {
      const logo = document.createElement('img');
      logo.className = 'patent-wavelock-logo';
      logo.src = '/assets/Wavelock.png';
      logo.alt = 'WaveLock wave-shaped logo';
      logo.loading = 'lazy';
      logo.decoding = 'async';
      waveLockCard.querySelector('h2')?.insertAdjacentElement('beforebegin', logo);
    }
    const generatorCard = patentCards[3];
    if (generatorCard && !generatorCard.querySelector('.patent-experiment-image')) {
      const experiment = document.createElement('img');
      experiment.className = 'patent-experiment-image';
      experiment.src = '/assets/laser_experiment.jpg';
      experiment.alt = 'Laser experiment associated with curvature-locked wave confinement research';
      experiment.loading = 'lazy';
      experiment.decoding = 'async';
      generatorCard.querySelector('h2')?.insertAdjacentElement('beforebegin', experiment);
    }
  }

  document.querySelectorAll('.id-list span').forEach((span) => {
    const id = span.textContent.trim();
    if (!id) return;
    const link = document.createElement('a');
    link.id = id;
    link.href = `/equations/#${encodeURIComponent(id)}`;
    link.textContent = id;
    link.title = `Open ${id} in the equation explorer`;
    span.replaceWith(link);
  });
})();