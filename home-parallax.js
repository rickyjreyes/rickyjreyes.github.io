(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const desktop = window.matchMedia('(min-width: 761px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;

  const enabled = () => desktop.matches && !reducedMotion.matches;

  const update = () => {
    frame = 0;

    if (!enabled()) {
      hero.removeAttribute('data-parallax-ready');
      hero.style.setProperty('--hero-parallax-progress', '0');
      return;
    }

    hero.dataset.parallaxReady = 'true';
    const travel = Math.max(hero.offsetHeight * 0.9, 1);
    const progress = Math.min(Math.max(window.scrollY / travel, 0), 1);
    hero.style.setProperty('--hero-parallax-progress', progress.toFixed(4));
  };

  const requestUpdate = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  desktop.addEventListener?.('change', requestUpdate);
  reducedMotion.addEventListener?.('change', requestUpdate);

  requestUpdate();
})();
