(() => {
  const equations = window.WCT_EQUATIONS || [];
  const corpus = window.WCT_CORPUS || {};

  // Equation ID selector without page navigation.
  const equationToolbar = document.querySelector('#equations .tool-toolbar');
  const equationList = document.getElementById('eqList');
  const equationSearch = document.getElementById('eqSearch');
  const equationFamily = document.getElementById('eqFamily');
  if (equationToolbar && equationList && equations.length) {
    const selector = document.createElement('select');
    selector.id = 'eqIdSelect';
    selector.className = 'equation-id-select';
    selector.setAttribute('aria-label', 'Select equation ID');
    selector.innerHTML = '<option value="">Equation ID…</option>' + equations.map((equation) =>
      `<option value="${equation.id}">${equation.id} — ${equation.title}</option>`
    ).join('');
    equationToolbar.prepend(selector);

    const nav = document.createElement('div');
    nav.className = 'equation-nav-buttons';
    nav.innerHTML = '<button type="button" data-direction="-1">← Previous</button><button type="button" data-direction="1">Next →</button>';
    document.querySelector('.equation-links')?.after(nav);

    const selectEquation = (id) => {
      if (!id) return;
      equationSearch.value = '';
      equationFamily.value = '';
      equationSearch.dispatchEvent(new Event('input', { bubbles: true }));
      equationFamily.dispatchEvent(new Event('change', { bubbles: true }));
      requestAnimationFrame(() => {
        const button = [...equationList.querySelectorAll('.equation-item')].find((item) => item.dataset.id === id);
        button?.click();
        selector.value = id;
        history.replaceState(null, '', `#${encodeURIComponent(id)}`);
      });
    };

    selector.addEventListener('change', () => selectEquation(selector.value));
    equationList.addEventListener('click', (event) => {
      const button = event.target.closest('.equation-item');
      if (button) selector.value = button.dataset.id;
    });
    nav.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-direction]');
      if (!button) return;
      const current = Math.max(0, equations.findIndex((equation) => equation.id === selector.value));
      const next = (current + Number(button.dataset.direction) + equations.length) % equations.length;
      selectEquation(equations[next].id);
    });

    const initial = decodeURIComponent(location.hash.replace(/^#/, ''));
    selector.value = equations.some((equation) => equation.id === initial) ? initial : 'E17';
  }

  // Continuous chronology scale spanning the full corpus date range.
  const chronology = (corpus.chronology || []).map(([date, title, summary]) => ({
    date,
    title,
    summary,
    value: new Date(`${date}T12:00:00`)
  })).sort((a, b) => a.value - b.value);
  const controls = document.getElementById('calendarControls');
  const calendarRoot = document.getElementById('calendarRoot');
  if (controls && calendarRoot && chronology.length) {
    const start = chronology[0].value;
    const end = chronology[chronology.length - 1].value;
    const span = Math.max(1, end - start);
    const scale = document.createElement('section');
    scale.className = 'chronology-scale';
    scale.setAttribute('aria-label', 'Continuous research chronology timescale');
    scale.innerHTML = '<div class="chronology-scale-title"><strong>Continuous release timescale</strong><span>Exact position from first to latest dated release</span></div><div class="chronology-scale-inner"><div class="chronology-axis"></div></div><div class="chronology-range"></div>';
    const inner = scale.querySelector('.chronology-scale-inner');
    const range = scale.querySelector('.chronology-range');
    const formatMonth = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
    const formatDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const monthCursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const finalMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    while (monthCursor <= finalMonth) {
      const position = ((monthCursor - start) / span) * 100;
      const tick = document.createElement('div');
      tick.className = 'chronology-tick';
      tick.style.left = `${Math.max(0, Math.min(100, position))}%`;
      tick.innerHTML = `<span>${formatMonth.format(monthCursor)}</span>`;
      inner.appendChild(tick);
      monthCursor.setMonth(monthCursor.getMonth() + 1);
    }

    chronology.forEach((event, index) => {
      const position = ((event.value - start) / span) * 100;
      const point = document.createElement('button');
      point.type = 'button';
      point.className = 'chronology-point';
      point.style.left = `${position}%`;
      point.title = `${formatDate.format(event.value)} — ${event.title}`;
      point.setAttribute('aria-label', point.title);
      point.addEventListener('click', () => {
        const target = [...document.querySelectorAll('.calendar-event strong')].find((node) => node.textContent.trim() === event.title)?.closest('.calendar-event');
        target?.click();
      });
      inner.appendChild(point);

      if (index === 0 || index === chronology.length - 1 || index % 3 === 0) {
        const label = document.createElement('span');
        label.className = 'chronology-point-label';
        label.style.left = `${position}%`;
        label.style.bottom = `${102 + (index % 2) * 22}px`;
        label.textContent = event.title;
        inner.appendChild(label);
      }
    });

    range.innerHTML = `<span>${formatDate.format(start)}</span><span>${formatDate.format(end)}</span>`;
    controls.after(scale);
  }
})();
