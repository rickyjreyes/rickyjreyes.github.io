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
      if (!event.target.closest('a')) return;
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('click', (event) => {
      if (nav.contains(event.target) || menu.contains(event.target)) return;
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    });
  }
  if (year) year.textContent = String(new Date().getFullYear());

  const utilityStyle = document.createElement('style');
  utilityStyle.textContent = `
    .orientation-grid{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))!important}.orientation-grid li:last-child{grid-column:auto!important}
    .clickable-card{position:relative;cursor:pointer;transition:transform 180ms ease,border-color 180ms ease,background 180ms ease}.clickable-card:hover{transform:translateY(-4px);border-color:rgba(103,212,255,.38)!important;background-color:rgba(103,212,255,.035)}.clickable-card:focus-visible{outline:2px solid var(--accent);outline-offset:4px}.clickable-card a{position:relative;z-index:2}`;
  document.head.appendChild(utilityStyle);

  const isExternal = (link) => {
    try {
      const url = new URL(link.href, location.href);
      return /^https?:$/.test(url.protocol) && url.origin !== location.origin;
    } catch { return false; }
  };
  document.querySelectorAll('a[href]').forEach((link) => {
    if (!isExternal(link)) return;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    if (!link.title) link.title = 'Opens in a new tab';
    const label = link.getAttribute('aria-label') || link.textContent.trim();
    if (label && !label.includes('opens in a new tab')) link.setAttribute('aria-label', `${label} (opens in a new tab)`);
  });

  document.querySelectorAll('.orientation-grid li,.branch-card,.release-card,.object-card,.source-card').forEach((card) => {
    const link = card.querySelector('a[href]');
    if (!link) return;
    card.classList.add('clickable-card');
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent.trim());
    const open = () => link.target === '_blank' ? window.open(link.href, '_blank', 'noopener,noreferrer') : location.href = link.href;
    card.addEventListener('click', (event) => { if (!event.target.closest('a,button,input,select,textarea,summary')) open(); });
    card.addEventListener('keydown', (event) => {
      if (event.target !== card || !['Enter', ' '].includes(event.key)) return;
      event.preventDefault(); open();
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
    .wct-wrap{width:min(100%,560px);justify-self:end;align-self:center;display:grid;gap:16px}.field-visual.wct-field{width:100%;justify-self:auto;overflow:hidden;isolation:isolate;border-radius:46% 54% 51% 49%/52% 46% 54% 48%;background:rgba(4,10,18,.72);box-shadow:inset 0 0 120px rgba(103,212,255,.055),var(--shadow)}.field-visual.wct-field:before,.field-visual.wct-field:after{content:none!important}
    .wct-canvas,.wct-svg,.wct-vignette{position:absolute;inset:0;width:100%;height:100%}.wct-canvas{z-index:0;opacity:1;filter:saturate(1.12) contrast(1.08);transition:opacity .14s,filter .14s}.wct-vignette{z-index:1;pointer-events:none;background:radial-gradient(circle,transparent 0 29%,rgba(4,10,18,.035) 50%,rgba(4,10,18,.61) 100%)}.wct-svg{z-index:2;pointer-events:none;overflow:visible}
    .wct-flow,.wct-band,.wct-shell,.wct-core{transition:opacity .14s,transform .14s,filter .14s,stroke-width .14s}.wct-flow{fill:none;stroke:#67d4ff;stroke-width:1.15;stroke-linecap:round;stroke-dasharray:3 11;opacity:.33;vector-effect:non-scaling-stroke}.wct-band{fill:none;stroke:#8b7cff;stroke-width:.9;stroke-dasharray:2 8;opacity:.16;transform-origin:240px 240px;vector-effect:non-scaling-stroke}.wct-shell{fill:none;stroke:#b6ffda;stroke-width:1.25;opacity:.42;transform-origin:240px 240px;vector-effect:non-scaling-stroke}.wct-shell.outer{stroke-dasharray:2 7;opacity:.22}
    .wct-core{position:absolute;left:50%;top:50%;z-index:4;width:148px;transform:translate(-50%,-50%);text-align:center;pointer-events:none;text-shadow:0 0 20px #040a12,0 0 34px rgba(103,212,255,.32)}.wct-core strong{display:block;color:#b9edff;font:500 clamp(2.5rem,7vw,3.8rem)/.95 Georgia,serif}.wct-core span{display:block;margin-top:8px;color:rgba(233,240,246,.72);font-size:.61rem;font-weight:800;letter-spacing:.15em;text-transform:uppercase}
    .wct-hotspot{position:absolute;z-index:6;width:30px;height:30px;padding:0;display:grid;place-items:center;color:rgba(233,240,246,.76);border:1px solid rgba(170,201,225,.3);border-radius:50%;background:rgba(4,10,18,.7);font-size:.64rem;font-weight:800;cursor:pointer;backdrop-filter:blur(8px);transition:.12s}.wct-hotspot:hover,.wct-hotspot:focus-visible,.wct-hotspot[aria-pressed=true]{color:#06111b;background:#b6ffda;border-color:#b6ffda;transform:scale(1.08);outline:0}.wct-hotspot[data-concept=transport]{top:18%;left:13%}.wct-hotspot[data-concept=band]{top:13%;right:18%}.wct-hotspot[data-concept=curvature]{right:9%;bottom:24%}.wct-hotspot[data-concept=lock]{left:18%;bottom:14%}
    .wct-panel{display:grid;gap:11px;padding:14px;border:1px solid rgba(170,201,225,.15);border-radius:15px;background:rgba(4,10,18,.58);backdrop-filter:blur(14px)}.wct-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.wct-tab{min-height:40px;padding:7px 6px;color:var(--muted-2);border:1px solid rgba(170,201,225,.13);border-radius:8px;background:rgba(255,255,255,.02);font-size:.6rem;font-weight:800;letter-spacing:.05em;line-height:1.25;text-transform:uppercase;cursor:pointer;transition:.12s}.wct-tab:hover,.wct-tab:focus-visible,.wct-tab[aria-pressed=true]{color:var(--text);border-color:rgba(103,212,255,.45);background:rgba(103,212,255,.08);transform:translateY(-1px);outline:0}
    .wct-copy{min-height:88px;display:grid;align-content:start;gap:3px}.wct-kicker,.wct-title,.wct-description,.wct-note{margin:0}.wct-kicker{color:var(--accent);font-size:.61rem;font-weight:850;letter-spacing:.11em;text-transform:uppercase}.wct-title{color:var(--text);font:500 1.06rem/1.25 Georgia,serif}.wct-description{color:var(--muted-2);font-size:.75rem;line-height:1.48}.wct-note{color:rgba(113,134,154,.72);font-size:.6rem}
    .wct-field[data-active=transport] .wct-flow{opacity:.95;stroke-width:2;filter:drop-shadow(0 0 4px #67d4ff)}.wct-field[data-active=transport] .wct-band,.wct-field[data-active=transport] .wct-shell{opacity:.08}.wct-field[data-active=band] .wct-band{opacity:.9;stroke-width:1.8;filter:drop-shadow(0 0 5px #8b7cff)}.wct-field[data-active=band] .wct-flow,.wct-field[data-active=band] .wct-shell{opacity:.08}.wct-field[data-active=curvature] .wct-shell{opacity:.95;stroke-width:2.1;filter:drop-shadow(0 0 6px #b6ffda)}.wct-field[data-active=curvature] .wct-flow,.wct-field[data-active=curvature] .wct-band{opacity:.08}.wct-field[data-active=lock] .wct-core{transform:translate(-50%,-50%) scale(1.08);filter:drop-shadow(0 0 12px rgba(103,212,255,.5))}.wct-field[data-active=lock] .wct-shell{opacity:.75;stroke-width:1.8}.wct-field[data-active=lock] .wct-flow,.wct-field[data-active=lock] .wct-band{opacity:.07}.wct-field[data-active]:not([data-active=overview]) .wct-canvas{opacity:.88;filter:saturate(1) contrast(1.11) brightness(.9)}
    .wct-flow{animation:wctFlux 7s linear infinite}.wct-flow:nth-of-type(2n){animation-duration:9s;animation-direction:reverse}.wct-band{animation:wctBand 8s ease-in-out infinite}.wct-shell{animation:wctLock 5.5s ease-in-out infinite}@keyframes wctFlux{to{stroke-dashoffset:-84}}@keyframes wctBand{50%{transform:scale(1.025)}}@keyframes wctLock{0%,100%{transform:scale(.985)}50%{transform:scale(1.025)}}
    @media(max-width:1180px){.wct-wrap{width:min(100%,540px)}}@media(max-width:980px){.wct-wrap{justify-self:center}}@media(max-width:560px){.wct-wrap{width:100%;gap:12px}.wct-tabs{grid-template-columns:repeat(2,minmax(0,1fr))}.wct-copy{min-height:102px}.wct-panel{padding:12px}}`;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.className = 'wct-wrap';
  field.before(wrap); wrap.appendChild(field);
  field.className = 'field-visual wct-field';
  field.dataset.active = 'overview';
  field.setAttribute('aria-label', 'Interactive finite-band wave field converging into a localized curvature-locked mode');
  field.innerHTML = `<canvas class="wct-canvas" aria-hidden="true"></canvas><div class="wct-vignette" aria-hidden="true"></div><svg class="wct-svg" viewBox="0 0 480 480" aria-hidden="true"><path class="wct-flow" d="M-18 158C86 132 121 238 236 239"/><path class="wct-flow" d="M34 390C102 331 151 315 236 243"/><path class="wct-flow" d="M145-18C161 92 198 147 239 236"/><path class="wct-flow" d="M493 99C389 122 332 184 244 238"/><path class="wct-flow" d="M501 355C392 340 332 290 244 243"/><path class="wct-flow" d="M330 500C309 382 282 316 243 245"/><circle class="wct-band" cx="240" cy="240" r="145"/><circle class="wct-band" cx="240" cy="240" r="117"/><circle class="wct-band" cx="240" cy="240" r="92"/><path class="wct-shell outer" d="M240 160C286 158 323 195 322 239C321 286 286 321 240 321C194 322 158 286 159 240C160 195 194 161 240 160Z"/><path class="wct-shell" d="M240 187C270 184 296 208 295 239C296 270 271 296 240 294C209 297 184 270 186 240C184 208 210 186 240 187Z"/></svg><div class="wct-core" aria-hidden="true"><strong>ψ</strong><span>localized mode</span></div><button class="wct-hotspot" type="button" data-concept="transport" aria-label="Wave transport" aria-pressed="false">1</button><button class="wct-hotspot" type="button" data-concept="band" aria-label="Finite-k selection" aria-pressed="false">2</button><button class="wct-hotspot" type="button" data-concept="curvature" aria-label="Curvature feedback" aria-pressed="false">3</button><button class="wct-hotspot" type="button" data-concept="lock" aria-label="Phase locking" aria-pressed="false">4</button>`;

  const panel = document.createElement('div');
  panel.className = 'wct-panel';
  panel.innerHTML = `<div class="wct-tabs" aria-label="WCT field concepts"><button class="wct-tab" data-concept="transport" type="button" aria-pressed="false">Wave transport</button><button class="wct-tab" data-concept="band" type="button" aria-pressed="false">Finite-k selection</button><button class="wct-tab" data-concept="curvature" type="button" aria-pressed="false">Curvature feedback</button><button class="wct-tab" data-concept="lock" type="button" aria-pressed="false">Phase locking</button></div><div class="wct-copy" aria-live="polite"><p class="wct-kicker"></p><h2 class="wct-title"></h2><p class="wct-description"></p></div><p class="wct-note">Illustrative staged field dynamics, not a numerical simulation or empirical result.</p>`;
  wrap.appendChild(panel);

  const controls = wrap.querySelectorAll('[data-concept]');
  const kicker = panel.querySelector('.wct-kicker');
  const title = panel.querySelector('.wct-title');
  const description = panel.querySelector('.wct-description');
  let pinned = 'overview';
  let requestFieldRender = () => {};
  const show = (name, pin = false) => {
    const selected = concepts[name] ? name : 'overview';
    if (pin) pinned = pinned === selected ? 'overview' : selected;
    const active = pin ? pinned : selected;
    [kicker.textContent, title.textContent, description.textContent] = concepts[active];
    field.dataset.active = active;
    controls.forEach((control) => control.setAttribute('aria-pressed', String(control.dataset.concept === pinned)));
    requestFieldRender();
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
  const compact = matchMedia('(max-width:700px)').matches || matchMedia('(pointer:coarse)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const size = compact ? 148 : 168;
  const count = size * size;
  const buffer = document.createElement('canvas'); buffer.width = buffer.height = size;
  const bctx = buffer.getContext('2d', { alpha: false }); if (!bctx) return;
  const image = bctx.createImageData(size, size);
  const x = new Float32Array(count), y = new Float32Array(count), r = new Float32Array(count), a = new Float32Array(count);
  const fade = new Float32Array(count), curveEnv = new Float32Array(count), lockEnv = new Float32Array(count), warpR = new Float32Array(count), lockShape = new Float32Array(count);
  const tAlong = Array.from({ length: 3 }, () => new Float32Array(count));
  const tWeight = Array.from({ length: 3 }, () => new Float32Array(count));
  const bAlong = Array.from({ length: 4 }, () => new Float32Array(count));
  const tDir = Array.from({ length: 3 }, (_, n) => n * Math.PI * 2 / 3 + .22);
  const bDir = Array.from({ length: 4 }, (_, n) => n * Math.PI / 4 + .12);

  for (let iy = 0; iy < size; iy++) for (let ix = 0; ix < size; ix++) {
    const p = iy * size + ix, px = ix / (size - 1) * 2 - 1, py = iy / (size - 1) * 2 - 1;
    const pr = Math.hypot(px, py), pa = Math.atan2(py, px);
    x[p] = px; y[p] = py; r[p] = pr; a[p] = pa;
    fade[p] = Math.max(0, Math.min(1, (1.42 - pr) * 2.45)); curveEnv[p] = Math.exp(-1.45 * pr * pr); lockEnv[p] = Math.exp(-3.05 * pr * pr);
    warpR[p] = pr + .13 * pr * pr + .035 * pr * pr * pr; lockShape[p] = Math.sin(16.8 * pr + 1.08 * Math.sin(2 * pa)) + .34 * Math.cos(23.4 * pr + 3 * pa);
    tDir.forEach((d, n) => { const c = Math.cos(d), s = Math.sin(d), across = -px * s + py * c; tAlong[n][p] = px * c + py * s; tWeight[n][p] = .48 + .52 * Math.exp(-1.85 * across * across); });
    bDir.forEach((d, n) => { bAlong[n][p] = px * Math.cos(d) + py * Math.sin(d); });
  }

  const resize = () => {
    const rect = field.getBoundingClientRect(), ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * ratio)); canvas.height = Math.max(1, Math.round(rect.height * ratio));
  };
  const keys = ['transport', 'band', 'curvature', 'lock'];
  const mix = { transport: 1, band: 0, curvature: 0, lock: 0 };
  let lastMixTime = 0;
  const updateMix = (time) => {
    const target = { transport: 0, band: 0, curvature: 0, lock: 0 }, active = field.dataset.active || 'overview';
    if (active === 'overview') {
      const stage = 3.1, transition = .36, cycle = time % (stage * 4), index = Math.floor(cycle / stage) % 4, phase = cycle - index * stage;
      if (phase < stage - transition) target[keys[index]] = 1;
      else { const q = Math.min(1, (phase - (stage - transition)) / transition), blend = q * q * (3 - 2 * q); target[keys[index]] = 1 - blend; target[keys[(index + 1) % 4]] = blend; }
    } else if (target[active] !== undefined) target[active] = 1; else target.transport = 1;
    const dt = lastMixTime ? Math.min(.08, Math.max(.001, time - lastMixTime)) : 1 / 30; lastMixTime = time;
    const alpha = 1 - Math.exp(-(active === 'overview' ? 20 : 34) * dt);
    keys.forEach((key) => { mix[key] += (target[key] - mix[key]) * alpha; });
  };

  const render = (time) => {
    updateMix(time);
    const mt = mix.transport, mb = mix.band, mc = mix.curvature, ml = mix.lock, pixels = image.data, k0 = 15.4;
    const tPhase = [-time * 2.65, -time * 2.96 + 1.72, -time * 3.27 + 3.44];
    const bPhase = [0, 1, 2, 3].map((n) => .58 * Math.sin(time * .52 + n * 1.17));
    const lockBreath = .88 + .12 * Math.sin(time * 1.18);
    for (let p = 0; p < count; p++) {
      let transport = 0, band = 0, curved = 0, locked = 0;
      if (mt > .002) {
        let travelling = 0; for (let n = 0; n < 3; n++) travelling += Math.sin(13.4 * tAlong[n][p] + tPhase[n]) * tWeight[n][p]; travelling /= 3;
        transport = travelling + .38 * (.48 * Math.sin(9.8 * (x[p] + .72 * y[p]) + time * 1.82) + .42 * Math.cos(18.6 * (.67 * x[p] - y[p]) - time * 2.28));
      }
      if (mb > .002) { for (let n = 0; n < 4; n++) band += Math.cos(k0 * bAlong[n][p] + bPhase[n]); band = band / 4 + .22 * Math.cos(k0 * r[p] - time * .44); }
      if (mc > .002) { const angular = 1.22 * Math.sin(2 * a[p] - time * .42) * (1 - .34 * r[p]) + .36 * Math.sin(3 * a[p] + time * .31) * r[p]; curved = Math.sin(15.8 * warpR[p] - time * 1.28 + angular) + .38 * Math.cos(21.6 * warpR[p] + 3 * a[p] + time * .72); }
      if (ml > .002) locked = lockShape[p] * lockBreath;
      const fieldValue = mt * 1.05 * transport + mb * 1.34 * band + mc * 1.46 * curveEnv[p] * curved + ml * 1.72 * lockEnv[p] * locked;
      const structure = mt * .05 + mb * .12 + mc * .55 * curveEnv[p] + ml * .95 * lockEnv[p];
      const crest = .5 + .5 * Math.tanh(fieldValue * 1.12), amplitude = Math.min(1, Math.abs(fieldValue) * .72 + structure * .24) * fade[p];
      const node = Math.exp(-26 * Math.abs(fieldValue)) * (mt * .035 + mb * .07 + mc * .12 * curveEnv[p] + ml * .2 * lockEnv[p]);
      const pulse = 1 + mt * .025 * Math.sin(time * 1.9 - r[p] * 5.5) + mb * .018 * Math.sin(time * .78) + mc * .035 * Math.sin(time * 1.04 - r[p] * 3.1) + ml * .055 * Math.sin(time * 1.18), glow = amplitude * pulse;
      const i = p * 4; pixels[i] = Math.round(4 + (90 + 44 * (1 - crest)) * glow + 88 * node); pixels[i + 1] = Math.round(10 + (168 + 50 * crest) * glow + 148 * node); pixels[i + 2] = Math.round(18 + (222 + 30 * crest) * glow + 135 * node); pixels[i + 3] = 255;
    }
    bctx.putImageData(image, 0, 0); context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high'; context.drawImage(buffer, 0, 0, canvas.width, canvas.height);
  };

  let frame = 0, visible = true, running = false, lastFrame = 0;
  const start = performance.now(), frameInterval = compact ? 33 : 25;
  requestFieldRender = () => render((performance.now() - start) / 1000);
  const animate = (timestamp) => {
    if (!visible) { running = false; return; }
    if (timestamp - lastFrame >= frameInterval) { render((timestamp - start) / 1000); lastFrame = timestamp; }
    frame = requestAnimationFrame(animate);
  };
  const play = () => { if (running || !visible || reducedMotion) return; running = true; frame = requestAnimationFrame(animate); };
  resize(); render(0); addEventListener('resize', resize, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(field);
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) play(); else { cancelAnimationFrame(frame); running = false; } }, { rootMargin: '120px' }).observe(field);
  play();
})();
