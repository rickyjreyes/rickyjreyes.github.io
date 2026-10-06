(() => {
  'use strict';

  /*
   * Homepage visual-only motion runtime.
   * Issues #24, #16, #17, #19.
   *
   * This module intentionally never applies transforms to headings, paragraphs,
   * tables, code, or other readable HTML. Native scrolling is untouched.
   */

  const root = document.documentElement;
  const body = document.body;
  const hero = document.querySelector('.hero');
  const evidence = document.querySelector('#current-evidence');
  const idea = document.querySelector('#idea');
  const start = document.querySelector('#start');
  const scrolly = document.querySelector('.wct-scrolly');
  const scrollyVisual = document.querySelector('.wct-scrolly-visual');
  const scrollySteps = Array.from(document.querySelectorAll('.wct-scrolly-step'));
  const evidenceSpine = document.querySelector('.evidence-spine');
  const evidenceItems = Array.from(document.querySelectorAll('.evidence-spine__item'));

  if (!hero || !evidence || !idea || !start) return;

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactQuery = window.matchMedia('(max-width: 980px)');

  let reducedMotion = reducedMotionQuery.matches;
  let compact = compactQuery.matches;
  let backbone = null;
  let rafId = 0;
  let pageVisible = !document.hidden;
  let activeStep = 0;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  const backboneMarkup = `
    <div class="home-motion-backbone" data-stage="psi" data-visible="false" aria-hidden="true">
      <div class="home-motion-backbone__frame">
        <svg viewBox="0 0 600 600" focusable="false" aria-hidden="true">
          <defs>
            <radialGradient id="story-core-gradient">
              <stop offset="0" stop-color="#b9ecff" stop-opacity=".98"/>
              <stop offset=".28" stop-color="#67d4ff" stop-opacity=".55"/>
              <stop offset="1" stop-color="#67d4ff" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="story-line-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#67d4ff" stop-opacity=".18"/>
              <stop offset=".5" stop-color="#b7e9ff" stop-opacity=".9"/>
              <stop offset="1" stop-color="#67d4ff" stop-opacity=".18"/>
            </linearGradient>
          </defs>

          <g class="story-grid" fill="none" stroke="#67d4ff" stroke-opacity=".12">
            <circle cx="300" cy="300" r="74"/><circle cx="300" cy="300" r="150"/><circle cx="300" cy="300" r="228"/>
            <path d="M72 300H528M300 72V528"/>
          </g>

          <g class="story-state story-psi">
            <circle cx="300" cy="300" r="165" fill="none" stroke="url(#story-line-gradient)" stroke-width="2"/>
            <circle class="story-orbit" cx="300" cy="300" r="205" fill="none" stroke="#67d4ff" stroke-opacity=".35" stroke-dasharray="6 20" stroke-width="2"/>
            <circle cx="300" cy="300" r="106" fill="url(#story-core-gradient)"/>
            <text x="300" y="323" text-anchor="middle" fill="#dff7ff" font-size="72" font-family="Georgia,serif">ψ</text>
          </g>

          <g class="story-state story-evidence" fill="none">
            <path d="M92 385 C150 335 195 360 232 304 S315 210 362 270 S445 340 510 175" stroke="url(#story-line-gradient)" stroke-width="4"/>
            <path d="M92 414 C170 370 220 398 268 348 S360 272 510 286" stroke="#67d4ff" stroke-opacity=".25" stroke-width="2" stroke-dasharray="8 12"/>
            <circle class="story-evidence-pulse" cx="232" cy="304" r="10" fill="#7ce09f" stroke="none"/>
            <circle class="story-evidence-pulse" cx="362" cy="270" r="10" fill="#ffc55c" stroke="none" style="animation-delay:.7s"/>
            <circle cx="510" cy="175" r="10" fill="#ff8f8f" stroke="none"/>
          </g>

          <g class="story-state story-wave" fill="none">
            <path class="story-wave-path" d="M70 300 C105 210 140 390 175 300 S245 210 280 300 S350 390 385 300 S455 210 530 300" stroke="url(#story-line-gradient)" stroke-width="4"/>
            <path d="M70 344 C105 254 140 434 175 344 S245 254 280 344 S350 434 385 344 S455 254 530 344" stroke="#67d4ff" stroke-opacity=".18" stroke-width="2"/>
          </g>

          <g class="story-state story-shell" fill="none">
            <circle class="story-orbit" cx="300" cy="300" r="190" stroke="#67d4ff" stroke-opacity=".14" stroke-width="22"/>
            <circle class="story-orbit" cx="300" cy="300" r="190" stroke="#bdefff" stroke-opacity=".76" stroke-width="2" stroke-dasharray="3 18"/>
            <circle cx="300" cy="300" r="72" fill="url(#story-core-gradient)" stroke="none"/>
          </g>

          <g class="story-state story-loop" fill="none">
            <path d="M146 300 C146 180 454 180 454 300 S146 420 146 300Z" stroke="url(#story-line-gradient)" stroke-width="5"/>
            <path d="M185 300 C185 225 415 225 415 300 S185 375 185 300Z" stroke="#67d4ff" stroke-opacity=".22" stroke-width="2"/>
            <circle cx="146" cy="300" r="8" fill="#bdefff" stroke="none"/>
          </g>

          <g class="story-state story-curvature" fill="none">
            <ellipse cx="300" cy="300" rx="185" ry="96" stroke="#67d4ff" stroke-opacity=".24" stroke-width="36"/>
            <ellipse class="story-orbit" cx="300" cy="300" rx="185" ry="96" stroke="#c7f2ff" stroke-opacity=".82" stroke-width="2" stroke-dasharray="6 16"/>
            <ellipse cx="300" cy="300" rx="84" ry="42" stroke="#67d4ff" stroke-opacity=".45" stroke-width="2"/>
            <path d="M119 300 C160 230 215 218 300 258 C385 218 440 230 481 300 C440 370 385 382 300 342 C215 382 160 370 119 300Z" stroke="url(#story-line-gradient)" stroke-width="3"/>
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
    if (backbone) backbone.remove();
    backbone = null;
    body.classList.remove('home-story-enabled');
  };

  const setBackboneStage = (stage) => {
    if (!backbone || backbone.dataset.stage === stage) return;
    backbone.dataset.stage = stage;
  };

  const setScrollyStage = (index) => {
    if (!scrollyVisual || !scrollySteps.length) return;
    const safeIndex = Math.max(0, Math.min(scrollySteps.length - 1, index));
    activeStep = safeIndex;

    scrollySteps.forEach((step, i) => {
      step.dataset.active = i === safeIndex ? 'true' : 'false';
    });

    const stage = scrollySteps[safeIndex].dataset.stage || 'wave';
    scrollyVisual.dataset.stage = stage;
    setBackboneStage(stage);

    const label = scrollyVisual.querySelector('[data-scene-label]');
    if (label) label.textContent = scrollySteps[safeIndex].dataset.label || stage;
  };

  const updateEvidenceProgress = () => {
    if (!evidenceSpine) return;
    const rect = evidenceSpine.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const progress = clamp((vh * .62 - rect.top) / Math.max(1, rect.height - vh * .25));
    evidenceSpine.style.setProperty('--evidence-progress', progress.toFixed(4));
  };

  const updateBackbone = () => {
    if (!backbone || reducedMotion || compact || !pageVisible) return;

    const heroRect = hero.getBoundingClientRect();
    const evidenceRect = evidence.getBoundingClientRect();
    const ideaRect = idea.getBoundingClientRect();
    const startRect = start.getBoundingClientRect();
    const vh = window.innerHeight || 1;

    const inStoryRange = heroRect.bottom > 0 || startRect.top > vh * .18;
    const pastStoryStart = heroRect.top < vh;
    backbone.dataset.visible = inStoryRange && pastStoryStart ? 'true' : 'false';

    if (ideaRect.top <= vh * .56 && ideaRect.bottom >= vh * .35) {
      const stage = scrollySteps[activeStep]?.dataset.stage || 'wave';
      setBackboneStage(stage);
    } else if (evidenceRect.top <= vh * .62 && evidenceRect.bottom >= vh * .28) {
      setBackboneStage('evidence');
    } else {
      setBackboneStage('psi');
    }
  };

  const runFrame = () => {
    rafId = 0;
    updateEvidenceProgress();
    updateBackbone();
  };

  const scheduleFrame = () => {
    if (rafId || reducedMotion || !pageVisible) return;
    rafId = requestAnimationFrame(runFrame);
  };

  const stepObserver = scrollySteps.length
    ? new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top - window.innerHeight * .42) - Math.abs(b.boundingClientRect.top - window.innerHeight * .42));

        if (!visible.length) return;
        const index = scrollySteps.indexOf(visible[0].target);
        if (index >= 0) setScrollyStage(index);
      }, {rootMargin:'-30% 0px -46% 0px',threshold:[0,.15,.5]})
    : null;

  scrollySteps.forEach((step) => stepObserver?.observe(step));

  const evidenceObserver = evidenceItems.length
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.dataset.active = entry.isIntersecting ? 'true' : 'false';
        });
      }, {rootMargin:'-30% 0px -48% 0px',threshold:[0,.25,.55]})
    : null;

  evidenceItems.forEach((item) => evidenceObserver?.observe(item));

  const storyVisibilityObserver = new IntersectionObserver((entries) => {
    if (!backbone) return;
    const anyVisible = entries.some((entry) => entry.isIntersecting);
    if (!anyVisible) backbone.dataset.visible = 'false';
    scheduleFrame();
  }, {rootMargin:'120px 0px 120px 0px'});

  storyVisibilityObserver.observe(hero);
  storyVisibilityObserver.observe(evidence);
  storyVisibilityObserver.observe(idea);

  const applyMotionMode = () => {
    reducedMotion = reducedMotionQuery.matches;
    compact = compactQuery.matches;
    root.dataset.homeMotion = reducedMotion ? 'reduced' : compact ? 'compact' : 'full';

    if (reducedMotion || compact) unmountBackbone();
    else mountBackbone();

    if (reducedMotion) {
      evidenceSpine?.style.setProperty('--evidence-progress', '1');
      scrollySteps.forEach((step) => { step.dataset.active = 'true'; });
      if (scrollyVisual) scrollyVisual.dataset.stage = 'curvature';
    } else {
      setScrollyStage(activeStep);
      scheduleFrame();
    }
  };

  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    if (pageVisible) scheduleFrame();
  }, {passive:true});

  window.addEventListener('scroll', scheduleFrame, {passive:true});
  window.addEventListener('resize', scheduleFrame, {passive:true});

  reducedMotionQuery.addEventListener?.('change', applyMotionMode);
  compactQuery.addEventListener?.('change', applyMotionMode);

  window.addEventListener('pagehide', () => {
    if (rafId) cancelAnimationFrame(rafId);
    stepObserver?.disconnect();
    evidenceObserver?.disconnect();
    storyVisibilityObserver.disconnect();
  }, {once:true});

  applyMotionMode();
  updateEvidenceProgress();
})();
