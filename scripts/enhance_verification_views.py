#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EQUATION_JSON = ROOT / "equations" / "equations.json"

STATUS_CSS = r'''
:root{--pass:#4ade80;--pass-bg:rgba(74,222,128,.08);--conditional:#fbbf24;--conditional-bg:rgba(251,191,36,.08);--definition:#60a5fa;--definition-bg:rgba(96,165,250,.08);--open:#c084fc;--open-bg:rgba(192,132,252,.08);--fail:#fb7185;--fail-bg:rgba(251,113,133,.08)}
.equation-entry.status-pass{border-left:5px solid var(--pass);background:linear-gradient(90deg,var(--pass-bg),rgba(8,18,31,.76) 22%)}
.equation-entry.status-conditional{border-left:5px solid var(--conditional);background:linear-gradient(90deg,var(--conditional-bg),rgba(8,18,31,.76) 22%)}
.equation-entry.status-definition{border-left:5px solid var(--definition);background:linear-gradient(90deg,var(--definition-bg),rgba(8,18,31,.76) 22%)}
.equation-entry.status-open{border-left:5px solid var(--open);background:linear-gradient(90deg,var(--open-bg),rgba(8,18,31,.76) 22%)}
.equation-entry.status-fail{border-left:5px solid var(--fail);background:linear-gradient(90deg,var(--fail-bg),rgba(8,18,31,.76) 22%)}
.equation-entry.status-pass .equation-status{color:var(--pass);border-color:var(--pass)}
.equation-entry.status-conditional .equation-status{color:var(--conditional);border-color:var(--conditional)}
.equation-entry.status-definition .equation-status{color:var(--definition);border-color:var(--definition)}
.equation-entry.status-open .equation-status{color:var(--open);border-color:var(--open)}
.equation-entry.status-fail .equation-status{color:var(--fail);border-color:var(--fail)}
'''


def colorize_equations(objects: list[dict]) -> None:
    path = ROOT / "equations" / "index.html"
    text = path.read_text(encoding="utf-8")
    text = re.sub(
        r'<article class="equation-entry(?: status-[a-z]+)?" id="([^"]+)"([^>]*?)data-status="([A-Z]+)"',
        lambda match: (
            f'<article class="equation-entry status-{match.group(3).lower()}" '
            f'id="{match.group(1)}"{match.group(2)}data-status="{match.group(3)}"'
        ),
        text,
    )
    if "--pass:#4ade80" not in text:
        text = text.replace("</style>", STATUS_CSS + "\n</style>", 1)
    path.write_text(text, encoding="utf-8")


def add_sympy_selector(objects: list[dict]) -> None:
    path = ROOT / "sympy" / "index.html"
    text = path.read_text(encoding="utf-8")
    options = "".join(
        f'<option value="{html.escape(obj["id"], quote=True)}">'
        f'{html.escape(obj["id"])} — {html.escape(obj["title"])}</option>'
        for obj in objects
    )
    selector = (
        '<select id="audit-id" aria-label="Jump to equation ID">'
        '<option value="">Equation ID…</option>' + options + '</select>'
    )
    if 'id="audit-id"' not in text:
        text = text.replace(
            '<div class="audit-toolbar"><input id="audit-search"',
            f'<div class="audit-toolbar">{selector}<input id="audit-search"',
            1,
        )
    text = text.replace(
        'grid-template-columns:minmax(260px,1fr) minmax(180px,.35fr) auto',
        'grid-template-columns:minmax(210px,.55fr) minmax(260px,1fr) minmax(180px,.35fr) auto',
    )
    helper = r'''<script id="sympy-id-selector-script">
(() => {
  const select = document.getElementById('audit-id');
  const search = document.getElementById('audit-search');
  const reset = document.getElementById('audit-reset');
  if (!select || !search || !reset) return;
  const jump = (id, smooth = true) => {
    if (!id) return;
    reset.click();
    search.value = id;
    search.dispatchEvent(new Event('input', { bubbles: true }));
    requestAnimationFrame(() => {
      const card = document.getElementById(id);
      if (!card) return;
      card.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' });
      history.replaceState(null, '', `#${encodeURIComponent(id)}`);
    });
  };
  select.addEventListener('change', () => jump(select.value));
  const initial = decodeURIComponent(location.hash.replace(/^#/, ''));
  if (initial && document.getElementById(initial)) {
    select.value = initial;
    jump(initial, false);
  }
})();
</script>'''
    if 'id="sympy-id-selector-script"' not in text:
        text = text.replace('<script src="../site-nav.js" defer></script>', helper + '<script src="../site-nav.js" defer></script>', 1)
    path.write_text(text, encoding="utf-8")


def main() -> None:
    objects = json.loads(EQUATION_JSON.read_text(encoding="utf-8"))
    if len(objects) != 142:
        raise RuntimeError(f"Expected 142 equations, found {len(objects)}")
    colorize_equations(objects)
    add_sympy_selector(objects)
    print("Enhanced equation and SymPy verification views.")


if __name__ == "__main__":
    main()
