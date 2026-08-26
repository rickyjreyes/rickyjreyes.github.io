(() => {
  const glossaryGrid = document.getElementById('glossaryGrid');
  const termSearch = document.getElementById('termSearch');
  const termFamily = document.getElementById('termFamily');
  if (!glossaryGrid) return;

  const organizeGlossary = () => {
    glossaryGrid.querySelectorAll('.glossary-letter').forEach((node) => node.remove());
    const cards = [...glossaryGrid.querySelectorAll('.tool-card')];
    cards.sort((a, b) => {
      const aTitle = a.querySelector('h3')?.textContent.trim() || '';
      const bTitle = b.querySelector('h3')?.textContent.trim() || '';
      return aTitle.localeCompare(bTitle, 'en', { sensitivity: 'base' });
    });

    let currentLetter = '';
    cards.forEach((card) => {
      card.classList.add('glossary-card');
      const title = card.querySelector('h3')?.textContent.trim() || '';
      const first = title.charAt(0).toUpperCase();
      const letter = /^[A-Z]$/.test(first) ? first : '#';
      if (!card.hidden && letter !== currentLetter) {
        const divider = document.createElement('div');
        divider.className = 'glossary-letter';
        divider.setAttribute('aria-label', `Glossary terms beginning with ${letter}`);
        divider.textContent = letter;
        glossaryGrid.appendChild(divider);
        currentLetter = letter;
      }
      glossaryGrid.appendChild(card);
    });
  };

  const organizeAfterRender = () => requestAnimationFrame(organizeGlossary);
  termSearch?.addEventListener('input', organizeAfterRender);
  termFamily?.addEventListener('change', organizeAfterRender);
  organizeGlossary();
})();