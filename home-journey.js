(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 981px)');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const root = document.documentElement;
  const external = (href) => {
    try { return new URL(href, location.href).origin !== location.origin; }
    catch { return false; }
  };

  let frame = 0;
  const updaters = [];
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      updaters.forEach((fn) => fn());
    });
  };

  /* semantic progress nav -------------------------------------------------- */
  const progressNav = document.querySelector('.home-progress-nav');
  const progressLinks = Array.from(document.querySelectorAll('.home-progress-nav a[href^="#"]'));
  const chapters = progressLinks
    .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter((item) => item.section);

  const updateProgress = () => {
    if (!progressNav || !chapters.length) return;
    const anchor = 130;
    let active = 0;

    chapters.forEach((chapter, index) => {
      if (chapter.section.getBoundingClientRect().top <= anchor) active = index;
    });

    chapters.forEach((chapter, index) => {
      if (index === active) chapter.link.setAttribute('aria-current', 'step');
      else chapter.link.removeAttribute('aria-current');
    });

    const doc = document.documentElement;
    const total = Math.max(1, doc.scrollHeight - innerHeight);
    progressNav.style.setProperty('--chapter-progress', `${(clamp(scrollY / total) * 100).toFixed(2)}%`);
  };
  updaters.push(updateProgress);

  /* equation build -------------------------------------------------------- */
  const equationBuild = document.querySelector('.equation-build');
  const equationDiagram = equationBuild?.querySelector('.equation-diagram');
  const equationSteps = Array.from(equationBuild?.querySelectorAll('.equation-step') || []);

  const updateEquation = () => {
    if (!equationBuild || !equationDiagram || !equationSteps.length) return;

    if (reduced.matches) {
      ['--eq-loop-offset','--eq-phase-offset','--eq-average-offset','--eq-mass-offset']
        .forEach((name) => equationDiagram.style.setProperty(name, '0'));
      equationSteps.forEach((step) => step.dataset.active = 'true');
      return;
    }

    const anchor = innerHeight * .52;
    let active = 0;
    let distance = Infinity;

    equationSteps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const current = Math.abs((rect.top + rect.height * .5) - anchor);
      if (current < distance) {
        distance = current;
        active = index;
      }
    });

    equationSteps.forEach((step, index) => {
      step.dataset.active = String(index === active);
    });

    const offsets = [
      active >= 0 ? 0 : 1,
      active >= 1 ? 0 : 1,
      active >= 2 ? 0 : 1,
      active >= 3 ? 0 : 1
    ];
    ['--eq-loop-offset','--eq-phase-offset','--eq-average-offset','--eq-mass-offset']
      .forEach((name, index) => equationDiagram.style.setProperty(name, String(offsets[index])));
  };
  updaters.push(updateEquation);

  /* visual sequence ------------------------------------------------------- */
  const visualSection = document.querySelector('.cinematic-visuals');
  const visualSteps = Array.from(visualSection?.querySelectorAll('.visual-sequence-step') || []);
  const visualScenes = Array.from(visualSection?.querySelectorAll('.visual-sequence-scene') || []);

  const activateVisual = (index) => {
    const safe = Math.max(0, Math.min(visualSteps.length - 1, index));
    visualSteps.forEach((step, i) => step.dataset.active = String(i === safe));
    visualScenes.forEach((scene, i) => scene.dataset.active = String(i === safe));
  };

  const updateVisual = () => {
    if (!visualSteps.length) return;
    if (reduced.matches || !desktop.matches) {
      visualSteps.forEach((step) => step.dataset.active = 'true');
      visualScenes.forEach((scene) => scene.dataset.active = 'true');
      return;
    }
    const anchor = innerHeight * .5;
    let best = 0;
    let distance = Infinity;
    visualSteps.forEach((step, i) => {
      const r = step.getBoundingClientRect();
      const d = Math.abs((r.top + r.height / 2) - anchor);
      if (d < distance) { distance = d; best = i; }
    });
    activateVisual(best);
  };
  updaters.push(updateVisual);

  const imageReady = (img) => {
    if (!img) return Promise.resolve(false);
    if (img.complete && img.naturalWidth > 0) {
      return typeof img.decode === 'function'
        ? img.decode().then(() => true).catch(() => true)
        : Promise.resolve(true);
    }
    return new Promise((resolve) => {
      const done = () => {
        if (typeof img.decode === 'function') img.decode().catch(() => {}).finally(() => resolve(img.naturalWidth > 0));
        else resolve(img.naturalWidth > 0);
      };
      img.addEventListener('load', done, {once:true});
      img.addEventListener('error', () => resolve(false), {once:true});
    });
  };

  if (visualSection && visualScenes.length) {
    Promise.all(visualScenes.map((scene) => imageReady(scene.querySelector('img'))))
      .then((states) => {
        if (states.every(Boolean)) {
          root.classList.add('visuals-ready');
          schedule();
        }
      });
  }

  /* canonical wct-threejs embed ------------------------------------------ */
  const canonicalScene = document.querySelector('.canonical-scene');
  const sceneTabs = canonicalScene?.querySelector('.canonical-scene-tabs');
  const sceneFrame = canonicalScene?.querySelector('iframe');
  const sceneFallback = canonicalScene?.querySelector('.canonical-scene-frame img');
  const sceneRole = canonicalScene?.querySelector('[data-scene-role]');
  const sceneMetric = canonicalScene?.querySelector('[data-scene-metric]');
  const sceneLoadButton = canonicalScene?.querySelector('[data-load-wct-viewer]');
  const sceneFrameShell = canonicalScene?.querySelector('.canonical-scene-frame');
  let sceneRegistry = null;
  let currentScene = 0;
  let viewerRequested = false;
  let loadStartedAt = 0;

  const sceneUrl = (scene) => `https://rickyjreyes.github.io/wct-threejs/?preset=${encodeURIComponent(scene.preset)}&embed=1`;

  const requestScene = (index, force = false) => {
    if (!sceneRegistry?.scenes?.length || !sceneFrame) return;
    currentScene = Math.max(0, Math.min(sceneRegistry.scenes.length - 1, index));
    const scene = sceneRegistry.scenes[currentScene];

    sceneTabs?.querySelectorAll('button').forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === currentScene));
    });
    if (sceneRole) sceneRole.textContent = `${scene.role} · preset: ${scene.preset}`;
    if (sceneFallback) sceneFallback.src = scene.fallback;

    if (!viewerRequested && !force) return;
    viewerRequested = true;
    loadStartedAt = performance.now();
    if (sceneFrameShell) sceneFrameShell.dataset.viewerState = 'loading';
    sceneFrame.title = `WCT Three.js — ${scene.label}`;
    sceneFrame.src = sceneUrl(scene);
    if (sceneMetric) sceneMetric.textContent = 'Loading canonical viewer…';
  };

  if (canonicalScene && sceneTabs && sceneFrame) {
    fetch('home-wct-scenes.json')
      .then((response) => {
        if (!response.ok) throw new Error(`scene registry ${response.status}`);
        return response.json();
      })
      .then((registry) => {
        sceneRegistry = registry;
        sceneTabs.innerHTML = '';
        registry.scenes.forEach((scene, index) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = scene.label;
          button.setAttribute('aria-pressed', String(index === 0));
          button.addEventListener('click', () => requestScene(index, false));
          sceneTabs.appendChild(button);
        });
        requestScene(0, false);
      })
      .catch(() => {
        if (sceneMetric) sceneMetric.textContent = 'Canonical viewer registry unavailable; static fallback retained.';
      });

    sceneFrame.addEventListener('load', () => {
      if (!viewerRequested || !sceneMetric) return;
      const ms = Math.round(performance.now() - loadStartedAt);
      if (sceneFrameShell) sceneFrameShell.dataset.viewerState = 'live';
      sceneMetric.textContent = `Interactive viewer loaded in ${ms} ms on this device`;
    });

    sceneLoadButton?.addEventListener('click', () => {
      viewerRequested = true;
      requestScene(currentScene, true);
    });
  }

  /* horizontal paper journey --------------------------------------------- */
  const paperJourney = document.querySelector('.paper-journey');
  const paperSticky = paperJourney?.querySelector('.paper-journey-sticky');
  const paperWindow = paperJourney?.querySelector('.paper-journey-window');
  const paperTrack = paperJourney?.querySelector('.paper-track');
  const paperProgress = paperJourney?.querySelector('.paper-journey-progress');
  let paperMaxShift = 0;

  const layoutPapers = () => {
    if (!paperJourney || !paperWindow || !paperTrack) return;
    if (!desktop.matches || reduced.matches) {
      root.classList.remove('papers-ready');
      paperJourney.style.removeProperty('--paper-journey-height');
      paperJourney.style.removeProperty('--paper-x');
      paperMaxShift = 0;
      return;
    }
    paperMaxShift = Math.max(0, paperTrack.scrollWidth - paperWindow.clientWidth);
    paperJourney.style.setProperty('--paper-journey-height', `${Math.max(innerHeight * 1.35, innerHeight + paperMaxShift + 160)}px`);
    root.classList.add('papers-ready');
  };

  const updatePapers = () => {
    if (!paperJourney || !paperTrack || !desktop.matches || reduced.matches || !paperMaxShift) return;
    const rect = paperJourney.getBoundingClientRect();
    const travel = Math.max(1, paperJourney.offsetHeight - innerHeight);
    const p = clamp(-rect.top / travel);
    const x = Math.round(-paperMaxShift * p);
    paperJourney.style.setProperty('--paper-x', `${x}px`);
    paperProgress?.style.setProperty('--paper-progress', `${(p * 100).toFixed(2)}%`);
  };
  updaters.push(updatePapers);

  /* technology network --------------------------------------------------- */
  const networkSection = document.querySelector('.technology-network-shell');
  const networkCanvas = networkSection?.querySelector('.technology-network');
  const networkDetail = networkSection?.querySelector('.technology-network-detail');
  const networkFallback = networkSection?.querySelector('.tech-network-fallback');
  let networkData = null;
  let nodeElements = new Map();
  let edgeElements = [];
  let selectedNodeId = 'wct';

  const renderDetail = (node) => {
    if (!networkDetail || !node) return;
    networkDetail.querySelector('[data-network-kicker]').textContent = node.relationship;
    networkDetail.querySelector('[data-network-title]').textContent = node.label;
    networkDetail.querySelector('[data-network-copy]').textContent = node.description;
    networkDetail.querySelector('[data-network-status]').textContent = `Current status: ${node.status}`;
    const link = networkDetail.querySelector('[data-network-link]');
    link.href = node.href;
    if (external(node.href)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    else { link.removeAttribute('target'); link.removeAttribute('rel'); }
    link.textContent = 'Open canonical source →';

    nodeElements.forEach((element, id) => {
      element.dataset.selected = String(id === node.id);
    });
  };

  const renderNetwork = (data) => {
    if (!networkCanvas || !networkFallback) return;
    networkData = data;
    nodeElements = new Map();
    edgeElements = [];

    const svg = networkCanvas.querySelector('svg');
    const layer = networkCanvas.querySelector('.technology-node-layer');
    svg.innerHTML = '';
    layer.innerHTML = '';
    networkFallback.innerHTML = '';

    const byId = new Map(data.nodes.map((node) => [node.id, node]));

    data.edges.forEach((edge) => {
      const a = byId.get(edge.from), b = byId.get(edge.to);
      if (!a || !b) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg','path');
      const mx = (a.x + b.x) / 2;
      const path = `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
      line.setAttribute('d', path);
      line.setAttribute('pathLength','1');
      line.setAttribute('class','technology-edge');
      line.dataset.step = String(b.step);
      line.dataset.revealed = String(b.step === 0);
      svg.appendChild(line);
      edgeElements.push(line);
    });

    data.nodes.forEach((node) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'technology-node';
      button.style.left = `${node.x / 10}%`;
      button.style.top = `${node.y / 6}%`;
      button.dataset.nodeId = node.id;
      button.dataset.step = String(node.step);
      button.dataset.root = String(node.id === data.root);
      button.dataset.revealed = String(node.step === 0);
      button.dataset.selected = String(node.id === selectedNodeId);
      button.innerHTML = `<strong>${node.short || node.label}</strong><small>${node.relationship}</small>`;
      button.addEventListener('click', () => {
        selectedNodeId = node.id;
        renderDetail(node);
      });
      layer.appendChild(button);
      nodeElements.set(node.id, button);

      if (node.id !== data.root) {
        const li = document.createElement('li');
        const linkAttrs = external(node.href) ? ' target="_blank" rel="noopener noreferrer"' : '';
        li.innerHTML = `<strong>${node.label}</strong><span>${node.relationship} · ${node.status}</span><p>${node.description}</p><a href="${node.href}"${linkAttrs}>Open canonical source →</a>`;
        networkFallback.appendChild(li);
      }
    });

    renderDetail(byId.get(selectedNodeId) || byId.get(data.root));
    root.classList.add('network-ready');
    schedule();
  };

  if (networkSection) {
    fetch('home-technology-network.json')
      .then((response) => {
        if (!response.ok) throw new Error(`network ${response.status}`);
        return response.json();
      })
      .then(renderNetwork)
      .catch(() => {
        if (networkFallback) networkFallback.innerHTML = '<li><strong>Technology network unavailable</strong><p>Use the research branches and patent portfolio below.</p></li>';
      });
  }

  const updateNetwork = () => {
    if (!networkSection || !networkData || !desktop.matches) return;
    if (reduced.matches) {
      nodeElements.forEach((node) => node.dataset.revealed = 'true');
      edgeElements.forEach((edge) => edge.dataset.revealed = 'true');
      return;
    }
    const rect = networkSection.getBoundingClientRect();
    const p = clamp((innerHeight * .72 - rect.top) / Math.max(1, rect.height + innerHeight * .12));
    const maxStep = Math.max(...networkData.nodes.map((node) => node.step));
    const stage = p * (maxStep + .6);
    nodeElements.forEach((node) => {
      node.dataset.revealed = String(Number(node.dataset.step) <= stage);
    });
    edgeElements.forEach((edge) => {
      edge.dataset.revealed = String(Number(edge.dataset.step) <= stage);
    });
  };
  updaters.push(updateNetwork);

  /* lifecycle ------------------------------------------------------------- */
  root.classList.add('journey-ready');

  const relayout = () => {
    layoutPapers();
    schedule();
  };

  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', relayout, {passive:true});
  desktop.addEventListener?.('change', relayout);
  reduced.addEventListener?.('change', relayout);

  layoutPapers();
  activateVisual(0);
  schedule();
})();