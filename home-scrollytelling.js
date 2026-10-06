(() => {
  'use strict';

  /*
   * Homepage visual-only motion runtime.
   * Issues #24, #16, #17, #19.
   *
   * Native scroll remains untouched. Readable HTML is never translated,
   * scaled, or placed on a continuously transformed layer.
   */

  const root = document.documentElement;
  const body = document.body;
  const hero = document.querySelector('.hero');
  const evidence = document.querySelector('#current-evidence');
  const idea = document.querySelector('#idea');
  const start = document.querySelector('#start');

  const scrollyVisual = document.querySelector('.wct-scrolly-visual');
  const scrollySteps = Array.from(document.querySelectorAll('.wct-scrolly-step'));
  const stageLabel = scrollyVisual?.querySelector('[data-scene-label]');
  const stageNumber = scrollyVisual?.querySelector('[data-stage-number]');

  const evidenceSpine = document.querySelector('.evidence-spine');
  const evidenceItems = Array.from(document.querySelectorAll('.evidence-spine__item'));
  const evidenceDashboard = document.querySelector('.evidence-dashboard');
  const evidenceName = evidenceDashboard?.querySelector('[data-evidence-name]');
  const evidenceState = evidenceDashboard?.querySelector('[data-evidence-state]');

  if (!hero || !evidence || !idea || !start) return;

  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactQuery = window.matchMedia('(max-width: 980px)');

  let reducedMotion = reducedQuery.matches;
  let compact = compactQuery.matches;
  let backbone = null;
  let frame = 0;
  let activeStep = 0;
  let activeEvidence = 0;
  let pageVisible = !document.hidden;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  const backboneMarkup = `
    <div class="home-motion-backbone" data-stage="psi" data-visible="false" aria-hidden="true">
      <div class="home-motion-backbone__frame">
        <svg viewBox="0 0 720 720" focusable="false" aria-hidden="true">
          <defs>
            <radialGradient id="backbone-core">
              <stop offset="0" stop-color="#d9f7ff" stop-opacity=".92"/>
              <stop offset=".24" stop-color="#67d4ff" stop-opacity=".42"/>
              <stop offset="1" stop-color="#67d4ff" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="backbone-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#67d4ff" stop-opacity=".08"/>
              <stop offset=".5" stop-color="#d5f6ff" stop-opacity=".60"/>
              <stop offset="1" stop-color="#9b8cff" stop-opacity=".08"/>
            </linearGradient>
          </defs>

          <g class="story-grid" fill="none" stroke="#67d4ff" stroke-opacity=".10">
            <circle cx="360" cy="360" r="105"/><circle cx="360" cy="360" r="215"/><circle cx="360" cy="360" r="325"/>
            <path d="M35 360H685M360 35V685"/>
          </g>

          <g class="story-state story-psi">
            <circle class="story-orbit" cx="360" cy="360" r="258" fill="none" stroke="#67d4ff" stroke-opacity=".18" stroke-dasharray="6 24" stroke-width="3"/>
            <circle cx="360" cy="360" r="178" fill="none" stroke="url(#backbone-line)" stroke-width="3"/>
            <circle cx="360" cy="360" r="126" fill="url(#backbone-core)"/>
          </g>

          <g class="story-state story-evidence" fill="none">
            <path d="M70 470 C155 400 215 450 280 350 S420 225 495 335 S585 425 660 185" stroke="url(#backbone-line)" stroke-width="5"/>
            <circle cx="280" cy="350" r="11" fill="#7ce09f" stroke="none"/>
            <circle cx="495" cy="335" r="11" fill="#ffc55c" stroke="none"/>
            <circle cx="660" cy="185" r="11" fill="#ff8f8f" stroke="none"/>
          </g>

          <g class="story-state story-wave" fill="none">
            <path class="story-wave-path" d="M55 360 C105 220 155 500 205 360 S305 220 355 360 S455 500 505 360 S605 220 680 360" stroke="url(#backbone-line)" stroke-width="5"/>
          </g>

          <g class="story-state story-shell" fill="none">
            <circle class="story-orbit" cx="360" cy="360" r="275" stroke="#67d4ff" stroke-opacity=".20" stroke-width="48"/>
            <circle cx="360" cy="360" r="275" stroke="#d5f6ff" stroke-opacity=".48" stroke-width="3" stroke-dasharray="5 24"/>
            <circle cx="360" cy="360" r="112" fill="url(#backbone-core)" stroke="none"/>
          </g>

          <g class="story-state story-loop" fill="none">
            <path d="M105 360 C105 175 615 175 615 360 S105 545 105 360Z" stroke="url(#backbone-line)" stroke-width="6"/>
            <path d="M190 360 C190 265 530 265 530 360 S190 455 190 360Z" stroke="#67d4ff" stroke-opacity=".16" stroke-width="3"/>
          </g>

          <g class="story-state story-curvature" fill="none">
            <ellipse cx="360" cy="360" rx="270" ry="140" stroke="#67d4ff" stroke-opacity=".13" stroke-width="64"/>
            <ellipse class="story-orbit" cx="360" cy="360" rx="270" ry="140" stroke="#d5f6ff" stroke-opacity=".54" stroke-width="3" stroke-dasharray="7 20"/>
            <path d="M96 360 C155 250 235 228 360 286 C485 228 565 250 624 360 C565 470 485 492 360 434 C235 492 155 470 96 360Z" stroke="url(#backbone-line)" stroke-width="5"/>
          </g>
        </svg>
      </div>
    </div>
  `;

  const mountBackbone = () => {
    if (backbone || reducedMotion || compact) return;
    document.body.insertAdjacentHTML('beforeend', backboneMarkup);
    backbone = document.querySelector('.home-motion-backbone');
    body.classList.add('home-story-enabled');
  };

  const unmountBackbone = () => {
    backbone?.remove();
    backbone = null;
    body.classList.remove('home-story-enabled');
  };

  const setBackboneStage = (stage) => {
    if (backbone && backbone.dataset.stage !== stage) backbone.dataset.stage = stage;
  };

  const setScrollyStage = (index) => {
    if (!scrollyVisual || !scrollySteps.length) return;

    const next = Math.max(0, Math.min(scrollySteps.length - 1, index));
    activeStep = next;

    scrollySteps.forEach((step, i) => {
      step.dataset.active = i === next ? 'true' : 'false';
    });

    const step = scrollySteps[next];
    const stage = step.dataset.stage || 'wave';
    const label = step.dataset.label || stage;

    scrollyVisual.dataset.stage = stage;
    scrollyVisual.dataset.stageIndex = String(next);

    if (stageLabel) stageLabel.textContent = label;
    if (stageNumber) stageNumber.textContent = String(next + 1).padStart(2, '0');

    setBackboneStage(stage);
  };

  const evidenceMeta = [
    {name:'GWTC', state:'Frozen positive'},
    {name:'CMS', state:'Conditional'},
    {name:'ATLAS', state:'Non-replication'},
    {name:'Core claims', state:'Theory-level'}
  ];

  const setEvidenceStage = (index) => {
    if (!evidenceItems.length) return;

    const next = Math.max(0, Math.min(evidenceItems.length - 1, index));
    activeEvidence = next;

    evidenceItems.forEach((item, i) => {
      item.dataset.active = i === next ? 'true' : 'false';
    });

    const item = evidenceItems[next];
    const status = item.dataset.evidenceStatus || 'open';
    const meta = evidenceMeta[next] || evidenceMeta[evidenceMeta.length - 1];

    if (evidenceDashboard) evidenceDashboard.dataset.evidenceStage = status;
    if (evidenceName) evidenceName.textContent = meta.name;
    if (evidenceState) evidenceState.textContent = meta.state;

    setBackboneStage('evidence');
  };

  const updateEvidenceProgress = () => {
    if (!evidenceSpine) return;
    const rect = evidenceSpine.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const progress = clamp((vh * .58 - rect.top) / Math.max(1, rect.height - vh * .32));
    evidenceSpine.style.setProperty('--evidence-progress', progress.toFixed(4));
  };

  const nearestIndex = (elements, anchorY) => {
    if (!elements.length) return 0;

    let best = 0;
    let bestDistance = Infinity;

    elements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const center = rect.top + rect.height * .5;
      const distance = Math.abs(center - anchorY);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });

    return best;
  };

  const updateActiveStates = () => {
    const vh = window.innerHeight || 1;

    const ideaRect = idea.getBoundingClientRect();
    if (ideaRect.top < vh * .72 && ideaRect.bottom > vh * .25 && scrollySteps.length) {
      setScrollyStage(nearestIndex(scrollySteps, vh * .48));
    }

    const evidenceRect = evidence.getBoundingClientRect();
    if (evidenceRect.top < vh * .72 && evidenceRect.bottom > vh * .25 && evidenceItems.length) {
      setEvidenceStage(nearestIndex(evidenceItems, vh * .5));
    }
  };

  const updateBackbone = () => {
    if (!backbone || reducedMotion || compact || !pageVisible) return;

    const vh = window.innerHeight || 1;
    const heroRect = hero.getBoundingClientRect();
    const evidenceRect = evidence.getBoundingClientRect();
    const ideaRect = idea.getBoundingClientRect();
    const startRect = start.getBoundingClientRect();

    const withinStory = heroRect.bottom > 0 || startRect.top > vh * .08;
    backbone.dataset.visible = withinStory ? 'true' : 'false';

    if (ideaRect.top <= vh * .62 && ideaRect.bottom >= vh * .28) {
      const stage = scrollySteps[activeStep]?.dataset.stage || 'wave';
      setBackboneStage(stage);
    } else if (evidenceRect.top <= vh * .70 && evidenceRect.bottom >= vh * .20) {
      setBackboneStage('evidence');
    } else {
      setBackboneStage('psi');
    }
  };

  const render = () => {
    frame = 0;
    updateEvidenceProgress();
    updateActiveStates();
    updateBackbone();
  };

  const schedule = () => {
    if (frame || !pageVisible) return;
    frame = requestAnimationFrame(render);
  };

  const applyMode = () => {
    reducedMotion = reducedQuery.matches;
    compact = compactQuery.matches;

    root.dataset.homeMotion = reducedMotion ? 'reduced' : compact ? 'compact' : 'full';

    if (reducedMotion || compact) unmountBackbone();
    else mountBackbone();

    if (reducedMotion) {
      evidenceSpine?.style.setProperty('--evidence-progress', '1');
      evidenceItems.forEach((item) => { item.dataset.active = 'true'; });
      scrollySteps.forEach((step) => { step.dataset.active = 'true'; });
      if (scrollyVisual) {
        scrollyVisual.dataset.stage = 'curvature';
        scrollyVisual.dataset.stageIndex = '3';
      }
      if (stageLabel) stageLabel.textContent = 'Curvature locking';
      if (stageNumber) stageNumber.textContent = '04';
    } else {
      setScrollyStage(activeStep);
      setEvidenceStage(activeEvidence);
      schedule();
    }
  };

  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    if (pageVisible) schedule();
  }, {passive:true});

  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule, {passive:true});

  reducedQuery.addEventListener?.('change', applyMode);
  compactQuery.addEventListener?.('change', applyMode);

  window.addEventListener('pagehide', () => {
    if (frame) cancelAnimationFrame(frame);
  }, {once:true});

  applyMode();
  render();
})();
