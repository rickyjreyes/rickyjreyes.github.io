(() => {
  if (!location.pathname.startsWith('/tools/glossary')) return;

  let selectedClass = '';
  const isPriorityCard = card => card.classList.contains('priority-coinage') || card.classList.contains('priority-survivor');

  const setActiveTab = value => {
    selectedClass = value;
    document.querySelectorAll('#termClassTabs [role="tab"]').forEach(tab => {
      const active = tab.dataset.value === selectedClass;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
    });
    applyBinaryView();
  };

  const setupSelector = () => {
    const guide = document.querySelector('.glossary-provenance-guide');
    if (!guide || guide.dataset.binaryReady) return;
    guide.dataset.binaryReady = 'true';
    guide.id = 'termClassTabs';
    guide.classList.add('term-class-selector');
    guide.setAttribute('role', 'tablist');
    guide.setAttribute('aria-label', 'Filter glossary by term class');
    guide.innerHTML = `
      <button type="button" role="tab" data-value="" aria-selected="true" class="active">
        <strong>All terms</strong>
        <span>Show the complete glossary.</span>
      </button>
      <button type="button" role="tab" data-value="priority" aria-selected="false" tabindex="-1">
        <strong>My priority terms</strong>
        <span>175 audited WCT/RCA terms whose public Reyes record predates every indexed external exact-phrase occurrence located in the terminology audit.</span>
      </button>
      <button type="button" role="tab" data-value="general" aria-selected="false" tabindex="-1">
        <strong>General terms</strong>
        <span>Standard external vocabulary plus WCT-used terms for which this glossary does not make an exact-phrase priority claim.</span>
      </button>`;

    const buttons = [...guide.querySelectorAll('[role="tab"]')];
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => setActiveTab(button.dataset.value || ''));
      button.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;
        buttons[next].focus();
        setActiveTab(buttons[next].dataset.value || '');
      });
    });
  };

  const cleanupOldFilter = () => {
    document.getElementById('termClass')?.remove();
    document.querySelector('#glossary .tool-toolbar .term-class-tabs')?.remove();
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
    let visible = 0;
    const cards = [...document.querySelectorAll('#glossaryGrid .glossary-card')];
    cards.forEach(card => {
      const cls = isPriorityCard(card) ? 'priority' : 'general';
      const show = !selectedClass || selectedClass === cls;
      card.hidden = !show;
      if (show) visible += 1;
    });
    const count = document.getElementById('termCount');
    if (count) count.textContent = `${visible} of ${cards.length} terms`;
  }

  const boot = () => {
    cleanupOldFilter();
    setupSelector();
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
