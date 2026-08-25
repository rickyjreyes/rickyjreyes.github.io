(() => {
  const enhanceFoundationsNavigation = () => {
    const currentPath = window.location.pathname.replace(/index\.html$/i, '').replace(/\/{2,}/g, '/');
    const foundationsActive = currentPath === '/foundations/' || currentPath.startsWith('/foundations/');

    const nav = document.querySelector('#site-nav');
    if (nav) {
      const researchGroup = [...nav.querySelectorAll('.nav-group')].find((group) => {
        const label = group.querySelector('.nav-trigger > span:first-child')?.textContent?.trim();
        return label === 'Research';
      });
      const shell = researchGroup?.querySelector('.nav-dropdown-shell');
      if (shell && !shell.querySelector('a[href="/foundations/"]')) {
        const link = document.createElement('a');
        link.href = '/foundations/';
        link.className = `nav-dropdown-link${foundationsActive ? ' is-active' : ''}`;
        if (foundationsActive) link.setAttribute('aria-current', 'page');
        link.innerHTML = '<span class="nav-item-label">Scientific Foundations</span><span class="nav-item-desc">Pre-2025 literature and scientific context</span>';
        const corpus = shell.querySelector('a[href="/research-corpus/"]');
        if (corpus) corpus.insertAdjacentElement('afterend', link);
        else shell.prepend(link);
      }
      if (foundationsActive) researchGroup?.classList.add('is-active');
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
  core.src = '/site-nav-core.js?v=20260824-foundations';
  core.async = false;
  core.addEventListener('load', enhanceFoundationsNavigation);
  document.head.appendChild(core);
})();