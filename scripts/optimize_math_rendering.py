#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

LAZY_SCRIPT = r'''<script>
(() => {
  const selector = '__SELECTOR__';
  const blocks = [...document.querySelectorAll(selector)];
  const typeset = (block) => {
    if (block.dataset.typeset) return;
    block.dataset.typeset = 'pending';
    const ready = window.MathJax?.startup?.promise || Promise.resolve();
    ready.then(() => window.MathJax?.typesetPromise ? window.MathJax.typesetPromise([block]) : null)
      .then(() => { block.dataset.typeset = 'true'; })
      .catch(() => { delete block.dataset.typeset; });
  };
  if (!('IntersectionObserver' in window)) {
    blocks.forEach(typeset);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      typeset(entry.target);
    });
  }, { rootMargin: '500px 0px' });
  blocks.forEach((block) => observer.observe(block));
})();
</script>'''


def optimize(path: Path, selector: str) -> None:
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        'svg:{fontCache:"global"}};',
        'svg:{fontCache:"global"},startup:{typeset:false}};'
    )
    marker = '<script src="../site-nav.js" defer></script>'
    script = LAZY_SCRIPT.replace('__SELECTOR__', selector)
    if script not in text:
        text = text.replace(marker, script + marker)
    path.write_text(text, encoding="utf-8")


def main() -> None:
    optimize(ROOT / "equations" / "index.html", ".equation-formula")
    optimize(ROOT / "sympy" / "index.html", ".audit-equation")
    print("Enabled viewport-based MathJax rendering.")


if __name__ == "__main__":
    main()
