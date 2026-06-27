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
