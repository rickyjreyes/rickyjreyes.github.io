(() => {
  /* Homepage motion is intentionally disabled for stable, crisp text rendering. */
  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.removeAttribute('data-parallax-ready');
  hero.style.removeProperty('--hero-parallax-progress');
})();