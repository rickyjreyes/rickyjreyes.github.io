(() => {
  const wrap = document.querySelector('.site-header .nav-wrap');
  if (!wrap) return;

  let nav = wrap.querySelector('nav');
  if (!nav) {
    nav = document.createElement('nav');
    wrap.appendChild(nav);
  }

  nav.id = 'site-nav';
  nav.className = '';
  nav.setAttribute('aria-label', 'Primary navigation');

  const links = [
    ['/', 'Home'],
    ['/publications/', 'Publications'],
    ['/equations/', 'Equations'],
    ['/sympy/', 'SymPy'],
    ['/lean/', 'Lean'],
    ['/reproduce/', 'Reproduce'],
    ['/tools/', 'Tools']
  ];

  const currentPath = location.pathname.replace(/index\.html$/, '');
  nav.innerHTML = links.map(([href, label]) => {
    const active = href === '/'
      ? currentPath === '/'
      : currentPath.startsWith(href);
    return `<a href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
  }).join('');

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

  const legacyMenuController = [...document.scripts].some((script) => {
    const src = script.getAttribute('src') || '';
    return /(^|\/)script\.js$/.test(src);
  });

  if (insertedMenu || !legacyMenuController) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !menu.contains(event.target)) {
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (currentPath === '/' && !document.querySelector('.frozen-release-callout')) {
    const hero = document.querySelector('main .hero');
    if (hero) {
      const style = document.createElement('style');
      style.textContent = `
        .frozen-release-callout{border-top:1px solid rgba(103,212,255,.18);border-bottom:1px solid rgba(103,212,255,.18);background:linear-gradient(90deg,rgba(24,101,145,.16),rgba(20,184,166,.08))}
        .frozen-release-inner{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:1rem;padding:1rem 0}
        .frozen-release-dot{width:.7rem;height:.7rem;border-radius:50%;background:#64e19d;box-shadow:0 0 18px rgba(100,225,157,.7)}
        .frozen-release-copy strong{display:block;margin-bottom:.15rem}.frozen-release-copy span{color:var(--muted,#a7b4c6);font-size:.92rem}
        .frozen-release-link{white-space:nowrap;font-weight:700}
        @media(max-width:720px){.frozen-release-inner{grid-template-columns:auto 1fr}.frozen-release-link{grid-column:2}}
      `;
      document.head.appendChild(style);

      const callout = document.createElement('section');
      callout.className = 'frozen-release-callout';
      callout.setAttribute('aria-label', 'Frozen reproducible release');
      callout.innerHTML = `
        <div class="section-shell frozen-release-inner">
          <span class="frozen-release-dot" aria-hidden="true"></span>
          <div class="frozen-release-copy">
            <strong>WCT-2026.1 is frozen and reproducible.</strong>
            <span>Exact commits, Lean, SymPy, registry, simulation, figure regeneration, Docker, Nix, and expected hashes.</span>
          </div>
          <a class="frozen-release-link" href="/reproduce/">Run it →</a>
        </div>`;
      hero.insertAdjacentElement('afterend', callout);
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
