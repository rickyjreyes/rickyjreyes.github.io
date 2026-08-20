(() => {
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-button');
  const nav = document.querySelector('#site-nav');
  const year = document.querySelector('#year');

  const updateHeader = () => header?.classList.toggle('scrolled', scrollY > 12);
  updateHeader();
  addEventListener('scroll', updateHeader, { passive: true });

  if (menu && nav) {
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

  if (year) year.textContent = String(new Date().getFullYear());

  const navigationStyle = document.createElement('style');
  navigationStyle.textContent = `
    .orientation-grid{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))!important}
    .orientation-grid li:last-child{grid-column:auto!important}
    .clickable-card{position:relative;cursor:pointer;transition:transform 180ms ease,border-color 180ms ease,background 180ms ease}
    .clickable-card:hover{transform:translateY(-4px);border-color:rgba(103,212,255,.38)!important;background-color:rgba(103,212,255,.035)}
    .clickable-card:focus-visible{outline:2px solid var(--accent);outline-offset:4px}
    .clickable-card a{position:relative;z-index:2}
  `;
  document.head.appendChild(navigationStyle);

  const isExternal = (link) => {
    try {
      const url = new URL(link.href, location.href);
      return /^https?:$/.test(url.protocol) && url.origin !== location.origin;
    } catch {
      return false;
    }
  };

  document.querySelectorAll('a[href]').forEach((link) => {
    if (!isExternal(link)) return;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    if (!link.title) link.title = 'Opens in a new tab';
    const label = link.getAttribute('aria-label') || link.textContent.trim();
    if (label && !label.includes('opens in a new tab')) {
      link.setAttribute('aria-label', `${label} (opens in a new tab)`);
    }
  });

  const cardSelectors = [
    '.orientation-grid li',
    '.branch-card',
    '.release-card',
    '.object-card',
    '.source-card'
  ];

  document.querySelectorAll(cardSelectors.join(',')).forEach((card) => {
    const primaryLink = card.querySelector('a[href]');
    if (!primaryLink) return;

    card.classList.add('clickable-card');
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.setAttribute('aria-label', primaryLink.getAttribute('aria-label') || primaryLink.textContent.trim());

    const openCard = () => {
      if (primaryLink.target === '_blank') window.open(primaryLink.href, '_blank', 'noopener,noreferrer');
      else location.href = primaryLink.href;
    };

    card.addEventListener('click', (event) => {
      if (event.target.closest('a,button,input,select,textarea,summary')) return;
      openCard();
    });
    card.addEventListener('keydown', (event) => {
      if (event.target !== card || !['Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      openCard();
    });
  });

  const field = document.querySelector('.field-visual');
  if (!field) return;

  const concepts = {
    overview: ['Interactive WCT field map', 'Distributed field → localized mode', 'Hover, focus, or tap a label to isolate each stage of the proposed confinement sequence.'],
    transport: ['01 · Wave transport', 'Energy and phase remain field-distributed', 'Multiple propagating components carry phase and energy before persistent localized structure appears.'],
    band: ['02 · Finite-k selection', 'A preferred spectral band organizes scale', 'Compatible wavenumbers are emphasized while unrestricted long- and short-scale growth is suppressed in the WCT proposal.'],
    curvature: ['03 · Curvature feedback', 'Field geometry feeds back on localization', 'The selected mode changes its effective structural curvature, which reshapes and tightens the evolving pattern.'],
    lock: ['04 · Phase locking', 'Coherent phase closes into a persistent mode', 'Compatible phases organize into the localized standing-wave structure represented by the central ψ mode.']
  };

  const style = document.createElement('style');
  style.textContent = `
    .wct-wrap{width:min(100%,470px);justify-self:end;align-self:center;display:grid;gap:14px}
    .field-visual.wct-field{width:100%;justify-self:auto;overflow:hidden;isolation:isolate;border-radius:46% 54% 51% 49%/52% 46% 54% 48%;background:rgba(4,10,18,.72);box-shadow:inset 0 0 100px rgba(103,212,255,.05),var(--shadow)}
    .field-visual.wct-field:before,.field-visual.wct-field:after{content:none!important}
    .wct-canvas,.wct-svg,.wct-vignette{position:absolute;inset:0;width:100%;height:100%}
    .wct-canvas{z-index:0;opacity:1;filter:saturate(1.12) contrast(1.08);transition:opacity .22s,filter .22s}
    .wct-vignette{z-index:1;pointer-events:none;background:radial-gradient(circle,transparent 0 27%,rgba(4,10,18,.04) 48%,rgba(4,10,18,.62) 100%)}
    .wct-svg{z-index:2;pointer-events:none;overflow:visible}
    .wct-flow,.wct-band,.wct-shell,.wct-core{transition:opacity .22s,transform .22s,filter .22s,stroke-width .22s}
    .wct-flow{fill:none;stroke:#67d4ff;stroke-width:1.15;stroke-linecap:round;stroke-dasharray:3 11;opacity:.33;vector-effect:non-scaling-stroke}
    .wct-band{fill:none;stroke:#8b7cff;stroke-width:.9;stroke-dasharray:2 8;opacity:.16;transform-origin:240px 240px;vector-effect:non-scaling-stroke}
    .wct-shell{fill:none;stroke:#b6ffda;stroke-width:1.25;opacity:.42;transform-origin:240px 240px;vector-effect:non-scaling-stroke}
    .wct-shell.outer{stroke-dasharray:2 7;opacity:.22}
    .wct-core{position:absolute;left:50%;top:50%;z-index:4;width:132px;transform:translate(-50%,-50%);text-align:center;pointer-events:none;text-shadow:0 0 18px #040a12,0 0 30px rgba(103,212,255,.3)}
    .wct-core strong{display:block;color:#b9edff;font:500 clamp(2.25rem,7vw,3.35rem)/.95 Georgia,serif}
    .wct-core span{display:block;margin-top:8px;color:rgba(233,240,246,.72);font-size:.58rem;font-weight:800;letter-spacing:.15em;text-transform:uppercase}
    .wct-hotspot{position:absolute;z-index:6;width:28px;height:28px;padding:0;display:grid;place-items:center;color:rgba(233,240,246,.76);border:1px solid rgba(170,201,225,.3);border-radius:50%;background:rgba(4,10,18,.7);font-size:.62rem;font-weight:800;cursor:pointer;backdrop-filter:blur(8px);transition:.18s}
    .wct-hotspot:hover,.wct-hotspot:focus-visible,.wct-hotspot[aria-pressed=true]{color:#06111b;background:#b6ffda;border-color:#b6ffda;transform:scale(1.08);outline:0}
    .wct-hotspot[data-concept=transport]{top:18%;left:13%}.wct-hotspot[data-concept=band]{top:13%;right:18%}.wct-hotspot[data-concept=curvature]{right:9%;bottom:24%}.wct-hotspot[data-concept=lock]{left:18%;bottom:14%}
    .wct-panel{display:grid;gap:10px;padding:13px;border:1px solid rgba(170,201,225,.15);border-radius:14px;background:rgba(4,10,18,.58);backdrop-filter:blur(14px)}
    .wct-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
    .wct-tab{min-height:38px;padding:7px 5px;color:var(--muted-2);border:1px solid rgba(170,201,225,.13);border-radius:8px;background:rgba(255,255,255,.02);font-size:.58rem;font-weight:800;letter-spacing:.05em;line-height:1.25;text-transform:uppercase;cursor:pointer;transition:.18s}
    .wct-tab:hover,.wct-tab:focus-visible,.wct-tab[aria-pressed=true]{color:var(--text);border-color:rgba(103,212,255,.45);background:rgba(103,212,255,.08);transform:translateY(-1px);outline:0}
    .wct-copy{min-height:84px;display:grid;align-content:start;gap:3px}.wct-kicker,.wct-title,.wct-description,.wct-note{margin:0}
    .wct-kicker{color:var(--accent);font-size:.59rem;font-weight:850;letter-spacing:.11em;text-transform:uppercase}
    .wct-title{color:var(--text);font:500 1rem/1.25 Georgia,serif}.wct-description{color:var(--muted-2);font-size:.72rem;line-height:1.45}.wct-note{color:rgba(113,134,154,.72);font-size:.58rem}
    .wct-field[data-active=transport] .wct-flow{opacity:.95;stroke-width:2;filter:drop-shadow(0 0 4px #67d4ff)}
    .wct-field[data-active=transport] .wct-band,.wct-field[data-active=transport] .wct-shell{opacity:.08}
    .wct-field[data-active=band] .wct-band{opacity:.9;stroke-width:1.8;filter:drop-shadow(0 0 5px #8b7cff)}
    .wct-field[data-active=band] .wct-flow,.wct-field[data-active=band] .wct-shell{opacity:.08}
    .wct-field[data-active=curvature] .wct-shell{opacity:.95;stroke-width:2.1;filter:drop-shadow(0 0 6px #b6ffda)}
    .wct-field[data-active=curvature] .wct-flow,.wct-field[data-active=curvature] .wct-band{opacity:.08}
    .wct-field[data-active=lock] .wct-core{transform:translate(-50%,-50%) scale(1.08);filter:drop-shadow(0 0 12px rgba(103,212,255,.5))}
    .wct-field[data-active=lock] .wct-shell{opacity:.75;stroke-width:1.8}.wct-field[data-active=lock] .wct-flow,.wct-field[data-active=lock] .wct-band{opacity:.07}
    .wct-field[data-active]:not([data-active=overview]) .wct-canvas{opacity:.82;filter:saturate(.96) contrast(1.12) brightness(.86)}
    .wct-flow{animation:wctFlux 7s linear infinite}.wct-flow:nth-of-type(2n){animation-duration:9s;animation-direction:reverse}.wct-band{animation:wctBand 8s ease-in-out infinite}.wct-shell{animation:wctLock 5.5s ease-in-out infinite}
    @keyframes wctFlux{to{stroke-dashoffset:-84}}@keyframes wctBand{50%{transform:scale(1.025)}}@keyframes wctLock{0%,100%{transform:scale(.985)}50%{transform:scale(1.025)}}
    @media(max-width:980px){.wct-wrap{justify-self:center}}@media(max-width:480px){.wct-tabs{grid-template-columns:repeat(2,minmax(0,1fr))}.wct-copy{min-height:100px}}
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.className = 'wct-wrap';
  field.before(wrap);
  wrap.appendChild(field);
  field.className = 'field-visual wct-field';
  field.dataset.active = 'overview';
  field.setAttribute('aria-label', 'Interactive finite-band wave field converging into a localized curvature-locked mode');
  field.innerHTML = `
    <canvas class="wct-canvas" aria-hidden="true"></canvas><div class="wct-vignette" aria-hidden="true"></div>
    <svg class="wct-svg" viewBox="0 0 480 480" aria-hidden="true">
      <path class="wct-flow" d="M-18 158C86 132 121 238 236 239"/><path class="wct-flow" d="M34 390C102 331 151 315 236 243"/><path class="wct-flow" d="M145-18C161 92 198 147 239 236"/><path class="wct-flow" d="M493 99C389 122 332 184 244 238"/><path class="wct-flow" d="M501 355C392 340 332 290 244 243"/><path class="wct-flow" d="M330 500C309 382 282 316 243 245"/>
      <circle class="wct-band" cx="240" cy="240" r="145"/><circle class="wct-band" cx="240" cy="240" r="117"/><circle class="wct-band" cx="240" cy="240" r="92"/>
      <path class="wct-shell outer" d="M240 160C286 158 323 195 322 239C321 286 286 321 240 321C194 322 158 286 159 240C160 195 194 161 240 160Z"/><path class="wct-shell" d="M240 187C270 184 296 208 295 239C296 270 271 296 240 294C209 297 184 270 186 240C184 208 210 186 240 187Z"/>
    </svg>
    <div class="wct-core" aria-hidden="true"><strong>ψ</strong><span>localized mode</span></div>
    <button class="wct-hotspot" type="button" data-concept="transport" aria-label="Wave transport" aria-pressed="false">1</button><button class="wct-hotspot" type="button" data-concept="band" aria-label="Finite-k selection" aria-pressed="false">2</button><button class="wct-hotspot" type="button" data-concept="curvature" aria-label="Curvature feedback" aria-pressed="false">3</button><button class="wct-hotspot" type="button" data-concept="lock" aria-label="Phase locking" aria-pressed="false">4</button>`;

  const panel = document.createElement('div');
  panel.className = 'wct-panel';
  panel.innerHTML = `<div class="wct-tabs" aria-label="WCT field concepts"><button class="wct-tab" data-concept="transport" type="button" aria-pressed="false">Wave transport</button><button class="wct-tab" data-concept="band" type="button" aria-pressed="false">Finite-k selection</button><button class="wct-tab" data-concept="curvature" type="button" aria-pressed="false">Curvature feedback</button><button class="wct-tab" data-concept="lock" type="button" aria-pressed="false">Phase locking</button></div><div class="wct-copy" aria-live="polite"><p class="wct-kicker"></p><h2 class="wct-title"></h2><p class="wct-description"></p></div><p class="wct-note">Illustrative field map, not a numerical simulation or empirical result.</p>`;
  wrap.appendChild(panel);

  const controls = wrap.querySelectorAll('[data-concept]');
  const kicker = panel.querySelector('.wct-kicker');
  const title = panel.querySelector('.wct-title');
  const description = panel.querySelector('.wct-description');
  let pinned = 'overview';

  const show = (name, pin = false) => {
    const selected = concepts[name] ? name : 'overview';
    if (pin) pinned = pinned === selected ? 'overview' : selected;
    const active = pin ? pinned : selected;
    [kicker.textContent, title.textContent, description.textContent] = concepts[active];
    field.dataset.active = active;
    controls.forEach((control) => control.setAttribute('aria-pressed', String(control.dataset.concept === pinned)));
  };

  controls.forEach((control) => {
    const name = control.dataset.concept;
    control.addEventListener('mouseenter', () => show(name));
    control.addEventListener('focus', () => show(name));
    control.addEventListener('mouseleave', () => show(pinned));
    control.addEventListener('blur', () => show(pinned));
    control.addEventListener('click', () => show(name, true));
  });
  show('overview');

  const canvas = field.querySelector('.wct-canvas');
  const context = canvas?.getContext('2d', { alpha: false });
  if (!context) return;

  const buffer = document.createElement('canvas');
  const size = 168;
  buffer.width = buffer.height = size;
  const bufferContext = buffer.getContext('2d', { alpha: false });
  if (!bufferContext) return;
  const image = bufferContext.createImageData(size, size);
  const coordinates = new Float32Array(size * size * 4);

  for (let yIndex = 0; yIndex < size; yIndex++) {
    for (let xIndex = 0; xIndex < size; xIndex++) {
      const i = (yIndex * size + xIndex) * 4;
      const x = xIndex / (size - 1) * 2 - 1;
      const y = yIndex / (size - 1) * 2 - 1;
      coordinates[i] = x;
      coordinates[i + 1] = y;
      coordinates[i + 2] = Math.hypot(x, y);
      coordinates[i + 3] = Math.atan2(y, x);
    }
  }

  const resize = () => {
    const rect = field.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
  };

  const render = (time) => {
    const pixels = image.data;

    for (let p = 0; p < size * size; p++) {
      const i = p * 4;
      const x = coordinates[i];
      const y = coordinates[i + 1];
      const radius = coordinates[i + 2];
      const angle = coordinates[i + 3];

      const envelope = Math.exp(-2.8 * radius * radius);
      const outerFade = Math.max(0, Math.min(1, (1.42 - radius) * 2.45));

      // Travelling wave packets. The phase term changes every frame so the actual background propagates.
      let travelling = 0;
      for (let channel = 0; channel < 3; channel++) {
        const direction = channel * Math.PI * 2 / 3 + .22;
        const along = x * Math.cos(direction) + y * Math.sin(direction);
        const across = -x * Math.sin(direction) + y * Math.cos(direction);
        const channelEnvelope = .5 + .5 * Math.exp(-2.1 * across * across);
        travelling += Math.sin(14.8 * along - time * (2.35 + channel * .27) + channel * 1.75) * channelEnvelope;
      }

      // Counter-propagating components create moving interference rather than simple expanding rings.
      const crossing =
        .68 * Math.sin(12.4 * (x + .67 * y) + time * 1.95) +
        .58 * Math.cos(14.1 * (.72 * x - y) - time * 2.2);

      // Curved localized wave structure around the center.
      const locked =
        Math.sin(17.2 * radius - time * 2.55 + 1.15 * Math.sin(angle * 2 - time * .62)) +
        .34 * Math.cos(24.2 * radius + angle * 3 + time * 1.08);

      const interference = .42 * travelling + .31 * crossing + .9 * envelope * locked;
      const crest = .5 + .5 * Math.tanh(interference * 1.08);
      const amplitude = Math.min(1, Math.abs(interference) * .5 + envelope * .18) * outerFade;
      const node = Math.exp(-28 * Math.abs(interference)) * envelope * .16;
      const pulse = .94 + .06 * Math.sin(time * 1.25 - radius * 4.2);
      const glow = amplitude * pulse;

      pixels[i] = Math.round(4 + (90 + 44 * (1 - crest)) * glow + 88 * node);
      pixels[i + 1] = Math.round(10 + (168 + 50 * crest) * glow + 148 * node);
      pixels[i + 2] = Math.round(18 + (222 + 30 * crest) * glow + 135 * node);
      pixels[i + 3] = 255;
    }

    bufferContext.putImageData(image, 0, 0);
    context.imageSmoothingEnabled = true;
    context.drawImage(buffer, 0, 0, canvas.width, canvas.height);
  };

  let frame = 0;
  let visible = true;
  let running = false;
  let last = 0;
  const start = performance.now();

  const animate = (timestamp) => {
    if (!visible) {
      running = false;
      return;
    }
    if (timestamp - last >= 33) {
      render((timestamp - start) / 1000);
      last = timestamp;
    }
    frame = requestAnimationFrame(animate);
  };

  const play = () => {
    if (running || !visible) return;
    running = true;
    frame = requestAnimationFrame(animate);
  };

  resize();
  render(0);
  addEventListener('resize', resize, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else {
        cancelAnimationFrame(frame);
        running = false;
      }
    }, { rootMargin: '120px' }).observe(field);
  }

  play();
})();
