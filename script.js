(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('#site-nav');
  const year = document.querySelector('#year');

  const updateHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const fieldVisual = document.querySelector('.field-visual');
  if (!fieldVisual) return;

  const fieldStyles = document.createElement('style');
  fieldStyles.textContent = `
    .field-visual.wct-wave-field {
      overflow: hidden;
      isolation: isolate;
      border-radius: 46% 54% 51% 49% / 52% 46% 54% 48%;
      background:
        radial-gradient(circle at 50% 50%, rgba(103, 212, 255, 0.08), transparent 52%),
        rgba(4, 10, 18, 0.44);
      box-shadow:
        inset 0 0 120px rgba(103, 212, 255, 0.045),
        0 24px 80px rgba(0, 0, 0, 0.26);
    }

    .field-visual.wct-wave-field::before,
    .field-visual.wct-wave-field::after {
      content: none;
    }

    .wct-field-canvas,
    .wct-flow-overlay,
    .wct-field-vignette {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .wct-field-canvas {
      z-index: 0;
      opacity: 0.94;
      filter: saturate(1.08) contrast(1.04);
    }

    .wct-field-vignette {
      z-index: 1;
      pointer-events: none;
      background:
        radial-gradient(circle at center, transparent 0 31%, rgba(4, 10, 18, 0.08) 54%, rgba(4, 10, 18, 0.8) 100%),
        linear-gradient(115deg, rgba(103, 212, 255, 0.035), transparent 42%, rgba(139, 124, 255, 0.045));
    }

    .wct-flow-overlay {
      z-index: 2;
      overflow: visible;
      pointer-events: none;
    }

    .wct-flow-path {
      fill: none;
      stroke: url(#wct-flow-gradient);
      stroke-width: 1.25;
      stroke-linecap: round;
      stroke-dasharray: 3 11;
      opacity: 0.5;
      vector-effect: non-scaling-stroke;
    }

    .wct-shell {
      fill: none;
      stroke: url(#wct-shell-gradient);
      stroke-width: 1.4;
      opacity: 0.6;
      vector-effect: non-scaling-stroke;
      transform-origin: 240px 240px;
    }

    .wct-shell-secondary {
      stroke-dasharray: 2 7;
      opacity: 0.34;
    }

    .wct-mode-label {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 4;
      width: 132px;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none;
      text-shadow: 0 0 18px rgba(4, 10, 18, 0.95), 0 0 30px rgba(103, 212, 255, 0.28);
    }

    .wct-mode-label strong {
      display: block;
      color: #b9edff;
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(2.25rem, 7vw, 3.35rem);
      font-weight: 500;
      line-height: 0.95;
    }

    .wct-mode-label span {
      display: block;
      margin-top: 8px;
      color: rgba(233, 240, 246, 0.7);
      font-size: 0.58rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      line-height: 1.35;
      text-transform: uppercase;
    }

    .wct-field-tag {
      position: absolute;
      z-index: 5;
      padding: 6px 9px;
      color: rgba(233, 240, 246, 0.7);
      border: 1px solid rgba(170, 201, 225, 0.15);
      border-radius: 999px;
      background: rgba(4, 10, 18, 0.68);
      backdrop-filter: blur(8px);
      font-size: 0.6rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      line-height: 1;
      text-transform: uppercase;
      pointer-events: none;
    }

    .wct-tag-transport { top: 13%; left: 8%; }
    .wct-tag-band { top: 17%; right: 7%; }
    .wct-tag-curvature { right: 4%; bottom: 26%; }
    .wct-tag-lock { left: 7%; bottom: 17%; }

    .wct-spectrum-caption {
      position: absolute;
      left: 50%;
      bottom: 5.5%;
      z-index: 5;
      transform: translateX(-50%);
      color: rgba(156, 176, 193, 0.72);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: clamp(0.55rem, 1.5vw, 0.66rem);
      letter-spacing: 0.06em;
      white-space: nowrap;
      pointer-events: none;
    }

    @media (prefers-reduced-motion: no-preference) {
      .wct-flow-path { animation: wct-flux 7s linear infinite; }
      .wct-flow-path:nth-of-type(2n) { animation-duration: 9s; animation-direction: reverse; }
      .wct-shell { animation: wct-lock 5.5s ease-in-out infinite; }
      .wct-shell-secondary { animation-duration: 7.5s; animation-direction: reverse; }

      @keyframes wct-flux {
        to { stroke-dashoffset: -84; }
      }

      @keyframes wct-lock {
        0%, 100% { opacity: 0.4; transform: scale(0.985); }
        50% { opacity: 0.78; transform: scale(1.025); }
      }
    }

    @media (max-width: 480px) {
      .wct-field-tag { font-size: 0.52rem; }
      .wct-tag-transport { left: 5%; }
      .wct-tag-band { right: 4%; }
      .wct-tag-curvature { right: 2%; }
      .wct-tag-lock { left: 4%; }
    }
  `;
  document.head.appendChild(fieldStyles);

  fieldVisual.classList.add('wct-wave-field');
  fieldVisual.setAttribute(
    'aria-label',
    'Animated finite-band wave field converging into a localized curvature-locked mode'
  );
  fieldVisual.innerHTML = `
    <canvas class="wct-field-canvas" aria-hidden="true"></canvas>
    <div class="wct-field-vignette" aria-hidden="true"></div>
    <svg class="wct-flow-overlay" viewBox="0 0 480 480" aria-hidden="true">
      <defs>
        <linearGradient id="wct-flow-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#67d4ff" stop-opacity="0.05" />
          <stop offset="0.48" stop-color="#67d4ff" stop-opacity="0.85" />
          <stop offset="1" stop-color="#8b7cff" stop-opacity="0.15" />
        </linearGradient>
        <linearGradient id="wct-shell-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#b6ffda" stop-opacity="0.3" />
          <stop offset="0.5" stop-color="#67d4ff" stop-opacity="0.95" />
          <stop offset="1" stop-color="#8b7cff" stop-opacity="0.42" />
        </linearGradient>
        <filter id="wct-glow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path class="wct-flow-path" d="M-18 158 C86 132 121 238 236 239" />
      <path class="wct-flow-path" d="M34 390 C102 331 151 315 236 243" />
      <path class="wct-flow-path" d="M145 -18 C161 92 198 147 239 236" />
      <path class="wct-flow-path" d="M493 99 C389 122 332 184 244 238" />
      <path class="wct-flow-path" d="M501 355 C392 340 332 290 244 243" />
      <path class="wct-flow-path" d="M330 500 C309 382 282 316 243 245" />
      <path class="wct-shell wct-shell-secondary" d="M240 160 C286 158 323 195 322 239 C321 286 286 321 240 321 C194 322 158 286 159 240 C160 195 194 161 240 160 Z" />
      <path class="wct-shell" filter="url(#wct-glow)" d="M240 187 C270 184 296 208 295 239 C296 270 271 296 240 294 C209 297 184 270 186 240 C184 208 210 186 240 187 Z" />
    </svg>
    <div class="wct-mode-label" aria-hidden="true">
      <strong>ψ</strong>
      <span>localized mode</span>
    </div>
    <div class="wct-field-tag wct-tag-transport" aria-hidden="true">wave transport</div>
    <div class="wct-field-tag wct-tag-band" aria-hidden="true">finite-k selection</div>
    <div class="wct-field-tag wct-tag-curvature" aria-hidden="true">curvature feedback</div>
    <div class="wct-field-tag wct-tag-lock" aria-hidden="true">phase locking</div>
    <div class="wct-spectrum-caption" aria-hidden="true">distributed field → resonant confinement</div>
  `;

  const canvas = fieldVisual.querySelector('.wct-field-canvas');
  const context = canvas?.getContext('2d', { alpha: false });
  if (!canvas || !context) return;

  const buffer = document.createElement('canvas');
  const bufferSize = 144;
  buffer.width = bufferSize;
  buffer.height = bufferSize;
  const bufferContext = buffer.getContext('2d', { alpha: false });
  if (!bufferContext) return;

  const image = bufferContext.createImageData(bufferSize, bufferSize);
  const pixels = image.data;
  const coordinates = new Float32Array(bufferSize * bufferSize * 4);

  for (let yIndex = 0; yIndex < bufferSize; yIndex += 1) {
    const y = (yIndex / (bufferSize - 1)) * 2 - 1;
    for (let xIndex = 0; xIndex < bufferSize; xIndex += 1) {
      const x = (xIndex / (bufferSize - 1)) * 2 - 1;
      const pixelIndex = yIndex * bufferSize + xIndex;
      const coordinateIndex = pixelIndex * 4;
      coordinates[coordinateIndex] = x;
      coordinates[coordinateIndex + 1] = y;
      coordinates[coordinateIndex + 2] = Math.hypot(x, y);
      coordinates[coordinateIndex + 3] = Math.atan2(y, x);
    }
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let animationFrame = 0;
  let visible = true;
  let running = false;
  const startTime = performance.now();
  let lastFrame = 0;

  const resizeCanvas = () => {
    const rect = fieldVisual.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * pixelRatio));
    canvas.height = Math.max(1, Math.round(rect.height * pixelRatio));
    context.imageSmoothingEnabled = true;
  };

  const renderField = (timeSeconds) => {
    const emergence = 0.72 + 0.18 * Math.sin(timeSeconds * 0.42);

    for (let pixelIndex = 0; pixelIndex < bufferSize * bufferSize; pixelIndex += 1) {
      const coordinateIndex = pixelIndex * 4;
      const x = coordinates[coordinateIndex];
      const y = coordinates[coordinateIndex + 1];
      const radius = coordinates[coordinateIndex + 2];
      const angle = coordinates[coordinateIndex + 3];

      const envelope = Math.exp(-3.35 * radius * radius);
      const outerMask = 1 - Math.exp(-2.2 * radius * radius);

      let transport = 0;
      for (let channel = 0; channel < 3; channel += 1) {
        const direction = channel * (Math.PI * 2 / 3) + 0.18;
        const along = x * Math.cos(direction) + y * Math.sin(direction);
        const across = -x * Math.sin(direction) + y * Math.cos(direction);
        const pathWeight = Math.exp(-5.8 * across * across);
        transport += Math.sin(13.5 * along - timeSeconds * (1.55 + channel * 0.13) + channel * 1.7) * pathWeight;
      }
      transport /= 2.3;

      const selectedBand =
        Math.sin(16.5 * radius - timeSeconds * 1.7) +
        0.42 * Math.sin(23.5 * radius + timeSeconds * 0.92 + angle * 2) +
        0.2 * Math.cos(angle * 3 - timeSeconds * 0.55);

      const lockedMode = selectedBand * envelope * (0.78 + emergence * 0.5);
      const interference = transport * (0.46 + outerMask * 0.76) + lockedMode;
      const node = Math.exp(-38 * Math.abs(interference));
      const energy = Math.min(1, Math.abs(interference) * 0.73 + envelope * 0.12);
      const edgeFade = Math.max(0, Math.min(1, (1.38 - radius) * 2.7));
      const positive = interference * 0.5 + 0.5;

      const baseR = 4;
      const baseG = 10;
      const baseB = 18;
      const cyanR = 103;
      const cyanG = 212;
      const cyanB = 255;
      const violetR = 139;
      const violetG = 124;
      const violetB = 255;
      const mintR = 182;
      const mintG = 255;
      const mintB = 218;

      const waveR = violetR + (cyanR - violetR) * positive;
      const waveG = violetG + (cyanG - violetG) * positive;
      const waveB = violetB + (cyanB - violetB) * positive;
      const glow = energy * edgeFade;
      const nodeGlow = node * envelope * 0.28;

      pixels[coordinateIndex] = baseR + (waveR - baseR) * glow + (mintR - baseR) * nodeGlow;
      pixels[coordinateIndex + 1] = baseG + (waveG - baseG) * glow + (mintG - baseG) * nodeGlow;
      pixels[coordinateIndex + 2] = baseB + (waveB - baseB) * glow + (mintB - baseB) * nodeGlow;
      pixels[coordinateIndex + 3] = 255;
    }

    bufferContext.putImageData(image, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(buffer, 0, 0, canvas.width, canvas.height);
  };

  const animate = (timestamp) => {
    if (!visible || reduceMotion) {
      running = false;
      return;
    }

    if (timestamp - lastFrame >= 50) {
      renderField((timestamp - startTime) / 1000);
      lastFrame = timestamp;
    }

    animationFrame = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (running || reduceMotion || !visible) return;
    running = true;
    animationFrame = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    cancelAnimationFrame(animationFrame);
    running = false;
  };

  resizeCanvas();
  renderField(1.8);
  window.addEventListener('resize', resizeCanvas, { passive: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      if (visible) startAnimation();
      else stopAnimation();
    }, { rootMargin: '120px' });
    observer.observe(fieldVisual);
  }

  startAnimation();
})();