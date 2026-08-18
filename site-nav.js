(() => {
  const wrap = document.querySelector('.site-header .nav-wrap');
  if (!wrap) return;

  const normalizePath = (value) => {
    let path = value || '/';
    path = path.replace(/index\.html$/i, '');
    if (!path.startsWith('/')) path = `/${path}`;
    if (path !== '/' && !path.endsWith('/')) path += '/';
    return path.replace(/\/{2,}/g, '/');
  };

  const currentPath = normalizePath(window.location.pathname);
  const links = [
    ['/', 'Home'],
    ['/publications/', 'Publications'],
    ['/priority/', 'Priority'],
    ['/overlap/', 'Overlap'],
    ['/patents/', 'Patents'],
    ['/equations/', 'Equations'],
    ['/sympy/', 'SymPy'],
    ['/lean/', 'Lean'],
    ['/reproduce/', 'Reproduce'],
    ['/tools/', 'Tools']
  ];

  let nav = wrap.querySelector('nav');
  if (!nav) {
    nav = document.createElement('nav');
    wrap.appendChild(nav);
  }

  nav.id = 'site-nav';
  nav.className = '';
  nav.setAttribute('aria-label', 'Primary navigation');
  nav.innerHTML = links.map(([href, label]) => {
    const target = normalizePath(href);
    const active = target === '/'
      ? currentPath === '/'
      : currentPath === target || currentPath.startsWith(target);
    return `<a href="${href}"${active ? ' class="is-active" aria-current="page"' : ''}>${label}</a>`;
  }).join('');

  if (!document.getElementById('site-enhancement-style')) {
    const style = document.createElement('style');
    style.id = 'site-enhancement-style';
    style.textContent = `
      #site-nav a{position:relative;padding-block:8px;transition:color 160ms ease,background 160ms ease,box-shadow 160ms ease}
      #site-nav a.is-active,#site-nav a[aria-current="page"]{color:var(--text,#e9f0f6)}
      #site-nav a.is-active::after,#site-nav a[aria-current="page"]::after{position:absolute;right:0;bottom:1px;left:0;height:2px;content:"";border-radius:999px;background:linear-gradient(90deg,var(--accent,#67d4ff),var(--accent-2,#8b7cff));box-shadow:0 0 14px rgba(103,212,255,.45)}

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
      @media(max-width:760px){#site-nav a.is-active,#site-nav a[aria-current="page"]{padding-inline:10px;border-radius:8px;background:rgba(103,212,255,.08);box-shadow:inset 0 0 0 1px rgba(103,212,255,.2)}#site-nav a.is-active::after,#site-nav a[aria-current="page"]::after{right:10px;left:10px}.about-section.has-portrait{grid-template-columns:1fr}.about-section.has-portrait .about-facts{grid-column:auto}.about-portrait{position:static;width:min(100%,390px)}.wavelock-card-logo{width:76px;height:76px}.frozen-release-inner{grid-template-columns:auto 1fr}.frozen-release-link{grid-column:2}}
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

  const legacyMenuController = [...document.scripts].some((script) => /(^|\/)script\.js$/.test(script.getAttribute('src') || ''));
  if (insertedMenu || !legacyMenuController) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', (event) => {
      const selected = event.target.closest('a');
      if (!selected) return;
      nav.querySelectorAll('a').forEach((link) => {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      });
      selected.classList.add('is-active');
      selected.setAttribute('aria-current', 'page');
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !menu.contains(event.target)) {
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (currentPath === '/') {
    const hero = document.querySelector('main .hero');
    if (hero && !document.querySelector('.frozen-release-callout')) {
      const callout = document.createElement('section');
      callout.className = 'frozen-release-callout';
      callout.setAttribute('aria-label', 'Frozen reproducible release');
      callout.innerHTML = `
        <div class="section-shell frozen-release-inner">
          <span class="frozen-release-dot" aria-hidden="true"></span>
          <div class="frozen-release-copy">
            <strong>WCT-2026.2 is frozen and reproducible.</strong>
            <span>Exact commits, Lean, SymPy, registry, simulation, figure regeneration, Docker, Nix, and expected hashes.</span>
          </div>
          <a class="frozen-release-link" href="/reproduce/">Run it →</a>
        </div>`;
      hero.insertAdjacentElement('afterend', callout);
    }

    const heroActions = document.querySelector('.hero-actions');
    if (heroActions && !heroActions.querySelector('a[href="/priority/"]')) {
      const priorityButton = document.createElement('a');
      priorityButton.className = 'button secondary';
      priorityButton.href = '/priority/';
      priorityButton.textContent = 'View priority & convergence';
      heroActions.appendChild(priorityButton);
    }
    if (heroActions && !heroActions.querySelector('a[href="/overlap/"]')) {
      const overlapButton = document.createElement('a');
      overlapButton.className = 'button secondary';
      overlapButton.href = '/overlap/';
      overlapButton.textContent = 'Post-date overlap ledger';
      heroActions.appendChild(overlapButton);
    }
    if (heroActions && !heroActions.querySelector('a[href="/patents/"]')) {
      const patentButton = document.createElement('a');
      patentButton.className = 'button secondary';
      patentButton.href = '/patents/';
      patentButton.textContent = 'View patent applications';
      heroActions.appendChild(patentButton);
    }

    const branches = document.querySelector('#branches');
    if (branches && !document.querySelector('.patent-home-section')) {
      const section = document.createElement('section');
      section.className = 'patent-home-section';
      section.setAttribute('aria-labelledby', 'patent-home-title');
      section.innerHTML = `
        <div class="section-shell">
          <div class="patent-home-heading">
            <div>
              <p class="eyebrow">Inventions and intellectual property</p>
              <h2 id="patent-home-title">Four filed technology families.</h2>
            </div>
            <p>Public, non-enabling summaries connect the filing chronology to related papers, repositories, experiments, and evidence-status labels without publishing confidential application material.</p>
          </div>
          <div class="patent-home-grid" aria-label="Filed technology families">
            <article class="patent-home-card"><div class="patent-home-brand"><span>Patent pending</span><img class="wavelock-card-logo" src="/assets/Wavelock_transparent.png" alt="WaveLock wave-shaped logo" loading="lazy" decoding="async"></div><h3>WaveLock and drift detection</h3><p>Curvature-regulated commitments, replay verification, protocol binding, attestation, and runtime drift analysis.</p></article>
            <article class="patent-home-card"><span>Patent pending</span><h3>Persistent wave memory</h3><p>Wave-state storage, spectral confinement, readout, reset control, physical cells, arrays, and software emulation.</p></article>
            <article class="patent-home-card"><span>Application filed</span><h3>Solid-state frequency reference</h3><p>Optically programmed semiconductor resonance with harmonic readout and oscillator-integration concepts.</p></article>
            <article class="patent-home-card"><span>Application filed</span><h3>Coherent field generator</h3><p>Structured excitation, controlled confinement geometry, harmonic stabilization, relocking, and detector feedback.</p></article>
          </div>
          <div class="patent-home-actions">
            <a class="button primary" href="/patents/">Open patent portfolio</a>
            <a class="button secondary" href="/patents.json">View machine-readable metadata</a>
          </div>
        </div>`;
      branches.insertAdjacentElement('afterend', section);
    }

    const about = document.querySelector('.about-section');
    if (about && !about.querySelector('.about-portrait')) {
      about.classList.add('has-portrait');
      const portrait = document.createElement('figure');
      portrait.className = 'about-portrait';
      portrait.innerHTML = `
        <div class="about-portrait-frame">
          <img src="/assets/richardjreyes.png" alt="Richard J. Reyes, controls engineer and independent researcher" loading="lazy" decoding="async">
        </div>
        <figcaption><strong>Richard J. Reyes</strong>Controls engineer, software developer, independent researcher, and founder of WaveLock.</figcaption>`;
      about.insertAdjacentElement('afterbegin', portrait);
    }

    const footerResearch = [...document.querySelectorAll('.site-footer h2')].find((heading) => heading.textContent.trim() === 'Research')?.parentElement;
    if (footerResearch && !footerResearch.querySelector('a[href="/priority/"]')) {
      const link = document.createElement('a');
      link.href = '/priority/';
      link.textContent = 'Priority & convergence';
      footerResearch.appendChild(link);
    }
    if (footerResearch && !footerResearch.querySelector('a[href="/overlap/"]')) {
      const link = document.createElement('a');
      link.href = '/overlap/';
      link.textContent = 'Post-date overlap ledger';
      footerResearch.appendChild(link);
    }
    if (footerResearch && !footerResearch.querySelector('a[href="/patents/"]')) {
      const link = document.createElement('a');
      link.href = '/patents/';
      link.textContent = 'Patent applications';
      footerResearch.appendChild(link);
    }
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
      const heading = waveLockCard.querySelector('h2');
      if (heading) heading.insertAdjacentElement('beforebegin', logo);
    }

    const generatorCard = patentCards[3];
    if (generatorCard && !generatorCard.querySelector('.patent-experiment-image')) {
      const experiment = document.createElement('img');
      experiment.className = 'patent-experiment-image';
      experiment.src = '/assets/laser_experiment.jpg';
      experiment.alt = 'Laser experiment associated with curvature-locked wave confinement research';
      experiment.loading = 'lazy';
      experiment.decoding = 'async';
      const heading = generatorCard.querySelector('h2');
      if (heading) heading.insertAdjacentElement('beforebegin', experiment);
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
