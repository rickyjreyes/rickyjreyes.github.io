(() => {
  const corpus = window.WCT_CORPUS;
  const equations = window.WCT_EQUATIONS || corpus.equations || [];
  const terms = corpus.terms || [];

  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  })[char]);

  // Glossary -----------------------------------------------------------------
  const termSearch = document.getElementById('termSearch');
  const termFamily = document.getElementById('termFamily');
  const glossaryGrid = document.getElementById('glossaryGrid');
  const termCount = document.getElementById('termCount');
  [...new Set(terms.map((term) => term[2]))].sort().forEach((family) => termFamily.add(new Option(family, family)));

  function renderTerms() {
    const query = termSearch.value.trim().toLowerCase();
    const family = termFamily.value;
    let shown = 0;
    glossaryGrid.innerHTML = '';
    terms.forEach((term) => {
      const matches = (!query || term.join(' ').toLowerCase().includes(query)) && (!family || term[2] === family);
      if (matches) shown += 1;
      const card = document.createElement('article');
      card.className = 'tool-card';
      card.hidden = !matches;
      card.innerHTML = `<span class="tool-tag">${escapeHTML(term[2])}</span><h3>${escapeHTML(term[0])}</h3><p>${escapeHTML(term[1])}</p>${term[3] ? `<p class="mathline">${escapeHTML(term[3])}</p>` : ''}<p class="tool-note">${escapeHTML(term[4])}</p>`;
      glossaryGrid.appendChild(card);
    });
    termCount.textContent = `${shown} of ${terms.length} terms`;
  }
  termSearch.addEventListener('input', renderTerms);
  termFamily.addEventListener('change', renderTerms);
  renderTerms();

  // Equation explorer ---------------------------------------------------------
  const eqSearch = document.getElementById('eqSearch');
  const eqFamily = document.getElementById('eqFamily');
  const eqList = document.getElementById('eqList');
  const eqCount = document.getElementById('eqCount');
  const eqFamilyOut = document.getElementById('eqFamilyOut');
  const eqTitle = document.getElementById('eqTitle');
  const eqMeaning = document.getElementById('eqMeaning');
  const eqRendered = document.getElementById('eqRendered');
  const eqLatex = document.getElementById('eqLatex');
  const eqStatus = document.getElementById('eqStatus');
  const eqPageLink = document.getElementById('eqPageLink');
  const eqSourceLink = document.getElementById('eqSourceLink');
  [...new Set(equations.map((equation) => equation.family))].sort().forEach((family) => eqFamily.add(new Option(family, family)));

  function selectEquation(id) {
    const equation = equations.find((item) => item.id === id) || equations[0];
    if (!equation) return;
    eqFamilyOut.textContent = `${equation.family} · ${equation.id}`;
    eqTitle.textContent = equation.title;
    eqMeaning.textContent = equation.meaning;
    eqRendered.innerHTML = `$$${equation.latex}$$`;
    eqLatex.textContent = equation.latex;
    eqStatus.textContent = equation.status;
    eqPageLink.href = `../equations/#${encodeURIComponent(equation.id)}`;
    eqSourceLink.href = equation.source || eqPageLink.href;
    document.querySelectorAll('.equation-item').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.id === equation.id)));
    if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([eqRendered]);
  }

  function renderEquationList() {
    const query = eqSearch.value.trim().toLowerCase();
    const family = eqFamily.value;
    let shown = 0;
    eqList.innerHTML = '';
    equations.forEach((equation) => {
      const blob = Object.values(equation).join(' ').toLowerCase();
      if ((query && !blob.includes(query)) || (family && equation.family !== family)) return;
      shown += 1;
      const button = document.createElement('button');
      button.className = 'equation-item';
      button.dataset.id = equation.id;
      button.innerHTML = `<strong>${escapeHTML(equation.id)} — ${escapeHTML(equation.title)}</strong><span>${escapeHTML(equation.family)} · ${escapeHTML(equation.status)}</span>`;
      button.addEventListener('click', () => selectEquation(equation.id));
      eqList.appendChild(button);
    });
    eqCount.textContent = `${shown} of ${equations.length} equations`;
  }
  eqSearch.addEventListener('input', renderEquationList);
  eqFamily.addEventListener('change', renderEquationList);
  renderEquationList();
  selectEquation(location.hash.startsWith('#') && equations.some((item) => item.id === location.hash.slice(1)) ? location.hash.slice(1) : 'E17');

  // Calendar chronology -------------------------------------------------------
  const chronology = (corpus.chronology || []).map(([date, title, summary]) => ({
    date,
    title,
    summary,
    value: new Date(`${date}T12:00:00`)
  })).sort((a, b) => a.value - b.value);
  const calendarRoot = document.getElementById('calendarRoot');
  const calendarControls = document.getElementById('calendarControls');
  const calendarSearch = document.getElementById('calendarSearch');
  const calendarDetail = document.getElementById('calendarDetail');
  const monthNames = Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(2025, month, 1)));
  const years = [...new Set(chronology.map((event) => event.value.getFullYear()))];
  let activeYear = '';

  function dayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    return Math.floor((date - start) / 86400000);
  }

  function showCalendarDetail(event) {
    calendarDetail.hidden = false;
    calendarDetail.innerHTML = `<p class="eyebrow">${escapeHTML(new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(event.value))}</p><h3>${escapeHTML(event.title)}</h3><p>${escapeHTML(event.summary)}</p>`;
    calendarDetail.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function renderCalendar() {
    calendarRoot.innerHTML = '';
    years.forEach((year) => {
      const yearEvents = chronology.filter((event) => event.value.getFullYear() === year);
      const section = document.createElement('section');
      section.className = 'calendar-year';
      section.dataset.year = String(year);
      section.innerHTML = `<div class="calendar-year-header"><h3>${year}</h3><span>${yearEvents.length} dated releases</span></div><div class="year-rail" aria-label="${year} release rail"></div><div class="calendar-grid"></div>`;
      const rail = section.querySelector('.year-rail');
      monthNames.forEach((name, month) => {
        const marker = document.createElement('div');
        marker.className = 'year-rail-month';
        marker.style.left = `${(month / 12) * 100}%`;
        marker.innerHTML = `<label>${name}</label>`;
        rail.appendChild(marker);
      });
      yearEvents.forEach((event) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'year-event';
        dot.style.left = `${(dayOfYear(event.value) / (new Date(year, 11, 31).getDate() === 31 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365)) * 100}%`;
        dot.title = `${event.date} — ${event.title}`;
        dot.dataset.search = `${event.title} ${event.summary}`.toLowerCase();
        dot.addEventListener('click', () => showCalendarDetail(event));
        rail.appendChild(dot);
      });
      const grid = section.querySelector('.calendar-grid');
      for (let month = 0; month < 12; month += 1) {
        const monthEvents = yearEvents.filter((event) => event.value.getMonth() === month);
        const monthCard = document.createElement('article');
        monthCard.className = `calendar-month${monthEvents.length ? '' : ' is-empty'}`;
        monthCard.innerHTML = `<h4>${monthNames[month]}</h4>`;
        monthEvents.forEach((event) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'calendar-event';
          button.dataset.search = `${event.title} ${event.summary}`.toLowerCase();
          button.innerHTML = `<span class="calendar-day">${event.value.getDate()}</span><span><strong>${escapeHTML(event.title)}</strong><small>${escapeHTML(event.summary)}</small></span>`;
          button.addEventListener('click', () => showCalendarDetail(event));
          monthCard.appendChild(button);
        });
        grid.appendChild(monthCard);
      }
      calendarRoot.appendChild(section);
    });
  }

  function applyCalendarFilters() {
    const query = calendarSearch.value.trim().toLowerCase();
    document.querySelectorAll('.calendar-year').forEach((section) => {
      const yearMatches = !activeYear || section.dataset.year === activeYear;
      let visibleEvents = 0;
      section.querySelectorAll('.calendar-event').forEach((button) => {
        const matches = !query || button.dataset.search.includes(query);
        button.hidden = !matches;
        if (matches) visibleEvents += 1;
      });
      section.querySelectorAll('.year-event').forEach((dot) => {
        dot.hidden = !!query && !dot.dataset.search.includes(query);
      });
      section.querySelectorAll('.calendar-month').forEach((month) => {
        const eventButtons = [...month.querySelectorAll('.calendar-event')];
        month.hidden = !!query && eventButtons.length > 0 && !eventButtons.some((button) => !button.hidden);
      });
      section.hidden = !yearMatches || (!!query && visibleEvents === 0);
    });
  }

  calendarControls.innerHTML = `<button type="button" data-year="" aria-pressed="true">All years</button>${years.map((year) => `<button type="button" data-year="${year}" aria-pressed="false">${year}</button>`).join('')}`;
  calendarControls.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-year]');
    if (!button) return;
    activeYear = button.dataset.year;
    calendarControls.querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    applyCalendarFilters();
  });
  calendarSearch.addEventListener('input', applyCalendarFilters);
  renderCalendar();

  // Obsidian-style concept graph ---------------------------------------------
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const graphSvg = document.getElementById('conceptGraph');
  const graphScene = document.getElementById('graphScene');
  const edgeLayer = document.getElementById('graphEdges');
  const nodeLayer = document.getElementById('graphNodes');
  const graphSearch = document.getElementById('graphSearch');
  const graphFamily = document.getElementById('graphFamily');
  const graphInspector = document.getElementById('graphInspector');
  const graphReset = document.getElementById('graphReset');
  const graphLabels = document.getElementById('graphLabels');
  const W = 1200;
  const H = 720;
  const colors = ['#67d4ff', '#8b7cff', '#4ade80', '#fbbf24', '#fb7185', '#38bdf8', '#a78bfa', '#f472b6', '#2dd4bf', '#f97316', '#94a3b8'];
  const termLookup = new Map(terms.map((term) => [term[0], term]));
  const families = [...new Set(terms.map((term) => term[2]))].sort();
  const familyColors = new Map(families.map((family, index) => [family, colors[index % colors.length]]));
  familyColors.set('Master architecture', '#ffffff');
  familyColors.set('Related', '#94a3b8');
  families.forEach((family) => graphFamily.add(new Option(family, family)));
  graphFamily.add(new Option('Master architecture', 'Master architecture'));

  const nodeMap = new Map();
  const links = [];
  function hash(text) {
    let value = 2166136261;
    for (const char of text) value = Math.imul(value ^ char.charCodeAt(0), 16777619);
    return value >>> 0;
  }
  function addNode(id, label, family, definition = '', equation = '', hub = false) {
    if (nodeMap.has(id)) return nodeMap.get(id);
    const seed = hash(id);
    const node = {
      id, label, family, definition, equation, hub,
      x: 120 + (seed % 960),
      y: 90 + ((seed >>> 8) % 540),
      vx: 0, vy: 0, degree: 0
    };
    nodeMap.set(id, node);
    return node;
  }
  function addLink(source, target, explicit = false) {
    if (source === target || links.some((link) => (link.source.id === source && link.target.id === target) || (link.source.id === target && link.target.id === source))) return;
    const sourceNode = nodeMap.get(source);
    const targetNode = nodeMap.get(target);
    if (!sourceNode || !targetNode) return;
    sourceNode.degree += 1;
    targetNode.degree += 1;
    links.push({ source: sourceNode, target: targetNode, explicit });
  }

  families.forEach((family, index) => {
    const angle = (index / families.length) * Math.PI * 2;
    const hub = addNode(`family:${family}`, family, family, `Family hub for ${family}.`, '', true);
    hub.x = W / 2 + Math.cos(angle) * 290;
    hub.y = H / 2 + Math.sin(angle) * 240;
  });
  terms.forEach((term) => {
    const node = addNode(term[0], term[0], term[2], term[1], term[3]);
    const hub = nodeMap.get(`family:${term[2]}`);
    const angle = ((hash(term[0]) % 360) / 180) * Math.PI;
    node.x = hub.x + Math.cos(angle) * (50 + hash(term[0]) % 90);
    node.y = hub.y + Math.sin(angle) * (50 + (hash(term[0]) >>> 5) % 90);
    addLink(hub.id, node.id, false);
  });
  (corpus.maps.conceptEdges || []).forEach(([sourceLabel, targetLabel]) => {
    [sourceLabel, targetLabel].forEach((label) => {
      if (!nodeMap.has(label)) {
        const term = termLookup.get(label);
        addNode(label, label, term?.[2] || 'Related', term?.[1] || 'Connected corpus concept.', term?.[3] || '');
      }
    });
    addLink(sourceLabel, targetLabel, true);
  });
  (corpus.maps.master || []).forEach(([sourceLabel, targetLabel]) => {
    addNode(`master:${sourceLabel}`, sourceLabel, 'Master architecture', 'Master-equation architecture node.', '', true);
    addNode(`master:${targetLabel}`, targetLabel, 'Master architecture', 'Master-equation architecture node.', '', true);
    addLink(`master:${sourceLabel}`, `master:${targetLabel}`, true);
  });

  const nodes = [...nodeMap.values()];
  links.forEach((link) => {
    const line = document.createElementNS(SVG_NS, 'line');
    line.classList.add('graph-edge');
    if (link.explicit) line.classList.add('explicit');
    edgeLayer.appendChild(line);
    link.el = line;
  });
  nodes.forEach((node) => {
    const group = document.createElementNS(SVG_NS, 'g');
    group.classList.add('graph-node');
    if (node.hub) group.classList.add('is-hub');
    group.dataset.id = node.id;
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('r', String(node.hub ? 8 + Math.min(node.degree, 8) : 4.5 + Math.min(node.degree, 5) * .6));
    circle.setAttribute('fill', familyColors.get(node.family) || '#94a3b8');
    const label = document.createElementNS(SVG_NS, 'text');
    label.setAttribute('x', '10');
    label.setAttribute('y', '4');
    label.textContent = node.label;
    label.hidden = !(node.hub || node.degree >= 4);
    group.append(circle, label);
    nodeLayer.appendChild(group);
    node.el = group;
    node.circle = circle;
    node.labelEl = label;
  });

  function updateGraph() {
    links.forEach((link) => {
      link.el.setAttribute('x1', link.source.x);
      link.el.setAttribute('y1', link.source.y);
      link.el.setAttribute('x2', link.target.x);
      link.el.setAttribute('y2', link.target.y);
    });
    nodes.forEach((node) => node.el.setAttribute('transform', `translate(${node.x},${node.y})`));
  }

  let simulationTicks = 0;
  function simulationStep() {
    const alpha = Math.max(.08, 1 - simulationTicks / 260);
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const d2 = dx * dx + dy * dy + 80;
        const force = (a.hub || b.hub ? 1900 : 900) / d2 * alpha;
        const distance = Math.sqrt(d2);
        dx /= distance;
        dy /= distance;
        a.vx -= dx * force;
        a.vy -= dy * force;
        b.vx += dx * force;
        b.vy += dy * force;
      }
    }
    links.forEach((link) => {
      const dx = link.target.x - link.source.x;
      const dy = link.target.y - link.source.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const rest = link.explicit ? 110 : 58;
      const force = (distance - rest) * (link.explicit ? .007 : .011) * alpha;
      const nx = dx / distance;
      const ny = dy / distance;
      link.source.vx += nx * force;
      link.source.vy += ny * force;
      link.target.vx -= nx * force;
      link.target.vy -= ny * force;
    });
    nodes.forEach((node) => {
      node.vx += (W / 2 - node.x) * .0005 * alpha;
      node.vy += (H / 2 - node.y) * .0005 * alpha;
      node.vx *= .83;
      node.vy *= .83;
      node.x = Math.max(20, Math.min(W - 20, node.x + node.vx));
      node.y = Math.max(20, Math.min(H - 20, node.y + node.vy));
    });
    simulationTicks += 1;
    updateGraph();
    if (simulationTicks < 260) requestAnimationFrame(simulationStep);
  }

  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let dragged = null;
  let panning = false;
  let lastPoint = null;
  let showAllLabels = false;
  function updateTransform() {
    graphScene.setAttribute('transform', `translate(${panX},${panY}) scale(${zoom})`);
  }
  function svgPoint(event) {
    const rect = graphSvg.getBoundingClientRect();
    return { x: (event.clientX - rect.left) / rect.width * W, y: (event.clientY - rect.top) / rect.height * H };
  }
  function graphPoint(event) {
    const point = svgPoint(event);
    return { x: (point.x - panX) / zoom, y: (point.y - panY) / zoom };
  }
  function inspectNode(node) {
    nodes.forEach((item) => item.el.classList.toggle('is-selected', item === node));
    const connected = links.filter((link) => link.source === node || link.target === node).map((link) => link.source === node ? link.target.label : link.source.label).sort();
    graphInspector.innerHTML = `<span class="tool-tag">${escapeHTML(node.family)}</span><h3>${escapeHTML(node.label)}</h3><p>${escapeHTML(node.definition || 'Connected corpus concept.')}</p>${node.equation ? `<p class="mathline">${escapeHTML(node.equation)}</p>` : ''}<h4>Connections · ${connected.length}</h4><ul>${connected.map((label) => `<li>${escapeHTML(label)}</li>`).join('')}</ul>`;
  }
  nodeLayer.addEventListener('pointerdown', (event) => {
    const group = event.target.closest('.graph-node');
    if (!group) return;
    dragged = nodeMap.get(group.dataset.id);
    graphSvg.setPointerCapture(event.pointerId);
    inspectNode(dragged);
  });
  graphSvg.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.graph-node')) return;
    panning = true;
    lastPoint = svgPoint(event);
    graphSvg.setPointerCapture(event.pointerId);
  });
  graphSvg.addEventListener('pointermove', (event) => {
    if (dragged) {
      const point = graphPoint(event);
      dragged.x = point.x;
      dragged.y = point.y;
      dragged.vx = 0;
      dragged.vy = 0;
      updateGraph();
    } else if (panning) {
      const point = svgPoint(event);
      panX += point.x - lastPoint.x;
      panY += point.y - lastPoint.y;
      lastPoint = point;
      updateTransform();
    }
  });
  graphSvg.addEventListener('pointerup', () => { dragged = null; panning = false; });
  graphSvg.addEventListener('pointercancel', () => { dragged = null; panning = false; });
  graphSvg.addEventListener('wheel', (event) => {
    event.preventDefault();
    const point = svgPoint(event);
    const oldZoom = zoom;
    zoom = Math.max(.45, Math.min(3.2, zoom * (event.deltaY < 0 ? 1.12 : .89)));
    panX = point.x - (point.x - panX) * (zoom / oldZoom);
    panY = point.y - (point.y - panY) * (zoom / oldZoom);
    updateTransform();
  }, { passive: false });

  function applyGraphFilter() {
    const query = graphSearch.value.trim().toLowerCase();
    const family = graphFamily.value;
    const matches = new Set(nodes.filter((node) => !query || `${node.label} ${node.definition}`.toLowerCase().includes(query)).map((node) => node.id));
    const neighbors = new Set();
    if (query) links.forEach((link) => {
      if (matches.has(link.source.id)) neighbors.add(link.target.id);
      if (matches.has(link.target.id)) neighbors.add(link.source.id);
    });
    nodes.forEach((node) => {
      let opacity = (!family || node.family === family) ? 1 : .08;
      if (query) opacity *= matches.has(node.id) ? 1 : neighbors.has(node.id) ? .55 : .06;
      node.el.style.opacity = opacity;
      node.labelEl.hidden = !(showAllLabels || node.hub || node.degree >= 4 || matches.has(node.id));
    });
    links.forEach((link) => {
      const visible = Number(link.source.el.style.opacity || 1) > .2 && Number(link.target.el.style.opacity || 1) > .2;
      link.el.style.opacity = visible ? 1 : .05;
    });
  }
  graphSearch.addEventListener('input', applyGraphFilter);
  graphFamily.addEventListener('change', applyGraphFilter);
  graphLabels.addEventListener('click', () => {
    showAllLabels = !showAllLabels;
    graphLabels.setAttribute('aria-pressed', String(showAllLabels));
    graphLabels.textContent = showAllLabels ? 'Hide minor labels' : 'Show all labels';
    applyGraphFilter();
  });
  graphReset.addEventListener('click', () => {
    zoom = 1; panX = 0; panY = 0; graphSearch.value = ''; graphFamily.value = ''; updateTransform(); applyGraphFilter();
  });
  const legend = document.getElementById('graphLegend');
  legend.innerHTML = [...familyColors.entries()].map(([family, color]) => `<span><i style="background:${color}"></i>${escapeHTML(family)}</span>`).join('');
  updateGraph();
  requestAnimationFrame(simulationStep);
})();
