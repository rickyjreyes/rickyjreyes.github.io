(() => {
  if (!location.pathname.startsWith('/tools/glossary')) return;

  const isPriorityCard = card => card.classList.contains('priority-coinage') || card.classList.contains('priority-survivor');

  const setupGuide = () => {
    const guide = document.querySelector('.glossary-provenance-guide');
    if (!guide || guide.dataset.binaryReady) return;
    guide.dataset.binaryReady = 'true';
    guide.setAttribute('aria-label', 'Glossary term classes');
    guide.innerHTML = `
      <div><strong>My priority terms</strong><span>175 audited WCT/RCA terms whose public Reyes record predates every indexed external exact-phrase occurrence located in the terminology audit.</span></div>
      <div><strong>General terms</strong><span>Standard external vocabulary plus WCT-used terms for which this glossary does not make an exact-phrase priority claim.</span></div>`;
  };

  const setupFilter = () => {
    const toolbar = document.querySelector('#glossary .tool-toolbar');
    if (!toolbar || document.getElementById('termClass')) return;
    const count = document.getElementById('termCount');
    const select = document.createElement('select');
    select.id = 'termClass';
    select.setAttribute('aria-label', 'Filter glossary by priority class');
    select.innerHTML = '<option value="">All terms</option><option value="priority">My priority terms</option><option value="general">General terms</option>';
    toolbar.insertBefore(select, count || null);
    select.addEventListener('change', applyBinaryView);
  };

  const decorateCards = () => {
    document.querySelectorAll('#glossaryGrid .glossary-card').forEach(card => {
      const badges = card.querySelector('.glossary-badges');
      if (!badges) return;
      let badge = badges.querySelector('.term-binary');
      const priority = isPriorityCard(card);
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'term-binary';
        const release = badges.querySelector('.term-release');
        badges.insertBefore(badge, release || null);
      }
      badge.classList.toggle('priority', priority);
      badge.classList.toggle('general', !priority);
      badge.textContent = priority ? 'My priority term' : 'General';
    });
  };

  function applyBinaryView() {
    decorateCards();
    const selected = document.getElementById('termClass')?.value || '';
    let visible = 0;
    const cards = [...document.querySelectorAll('#glossaryGrid .glossary-card')];
    cards.forEach(card => {
      const cls = isPriorityCard(card) ? 'priority' : 'general';
      const show = !selected || selected === cls;
      card.hidden = !show;
      if (show) visible += 1;
    });
    const count = document.getElementById('termCount');
    if (count) count.textContent = `${visible} of ${cards.length} terms`;
  }

  const boot = () => {
    setupGuide();
    setupFilter();
    applyBinaryView();
    const grid = document.getElementById('glossaryGrid');
    if (grid && !grid.dataset.binaryObserver) {
      grid.dataset.binaryObserver = 'true';
      const observer = new MutationObserver(() => applyBinaryView());
      observer.observe(grid, { childList: true });
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
