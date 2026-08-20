(() => {
  const field = document.querySelector('.field-visual.wct-field');
  const canvas = field?.querySelector('.wct-canvas');
  if (!field || !canvas) return;

  const context = canvas.getContext('2d', { alpha: false });
  if (!context) return;

  const buffer = document.createElement('canvas');
  const size = 168;
  buffer.width = size;
  buffer.height = size;
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
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
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

      const envelope = Math.exp(-2.75 * radius * radius);
      const outerFade = Math.max(0, Math.min(1, (1.42 - radius) * 2.4));

      // Three travelling plane-wave channels. These are the moving background waves.
      let travelling = 0;
      for (let channel = 0; channel < 3; channel++) {
        const direction = channel * Math.PI * 2 / 3 + 0.26;
        const along = x * Math.cos(direction) + y * Math.sin(direction);
        const across = -x * Math.sin(direction) + y * Math.cos(direction);
        const channelEnvelope = 0.45 + 0.55 * Math.exp(-1.9 * across * across);
        travelling += Math.sin(15.2 * along - time * (2.25 + channel * 0.22) + channel * 1.9) * channelEnvelope;
      }

      // A counter-propagating component prevents the field from looking like expanding rings.
      const crossWave =
        0.72 * Math.sin(12.8 * (x + 0.62 * y) + time * 1.7) +
        0.58 * Math.cos(14.4 * (0.7 * x - y) - time * 2.05);

      // Localized curved component around the central mode.
      const locked =
        Math.sin(17.5 * radius - time * 2.35 + 1.25 * Math.sin(angle * 2 - time * 0.55)) +
        0.33 * Math.cos(24.5 * radius + angle * 3 + time * 1.05);

      const interference =
        0.42 * travelling +
        0.30 * crossWave +
        0.90 * envelope * locked;

      const crest = 0.5 + 0.5 * Math.tanh(interference * 1.15);
      const amplitude = Math.min(1, Math.abs(interference) * 0.48 + envelope * 0.20) * outerFade;
      const node = Math.exp(-28 * Math.abs(interference)) * envelope * 0.18;
      const pulse = 0.92 + 0.08 * Math.sin(time * 1.35 - radius * 4.0);
      const glow = amplitude * pulse;

      pixels[i] = Math.round(4 + (98 + 35 * (1 - crest)) * glow + 90 * node);
      pixels[i + 1] = Math.round(10 + (173 + 47 * crest) * glow + 150 * node);
      pixels[i + 2] = Math.round(18 + (225 + 28 * crest) * glow + 135 * node);
      pixels[i + 3] = 255;
    }

    bufferContext.putImageData(image, 0, 0);
    context.imageSmoothingEnabled = true;
    context.drawImage(buffer, 0, 0, canvas.width, canvas.height);
  };

  resize();
  addEventListener('resize', resize, { passive: true });

  let visible = true;
  let running = false;
  let frame = 0;
  let last = 0;
  const start = performance.now();

  const animate = (timestamp) => {
    if (!visible) {
      running = false;
      return;
    }

    // ~30 fps is enough for visible propagation while keeping the hero inexpensive.
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

  render(0);
  play();
})();
