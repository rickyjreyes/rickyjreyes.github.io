#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EQUATION_JSON = ROOT / "equations" / "equations.json"

PRESENTATION_CSS = r'''
/* verification-presentation-v2 */
:root{--pass:#4ade80;--pass-bg:rgba(74,222,128,.09);--conditional:#fbbf24;--conditional-bg:rgba(251,191,36,.09);--definition:#60a5fa;--definition-bg:rgba(96,165,250,.09);--open:#c084fc;--open-bg:rgba(192,132,252,.09);--fail:#fb7185;--fail-bg:rgba(251,113,133,.09)}
.equation-entry.status-pass,.audit-card.status-pass{border-left:5px solid var(--pass);background:linear-gradient(90deg,var(--pass-bg),rgba(8,18,31,.78) 24%)}
.equation-entry.status-conditional,.audit-card.status-conditional{border-left:5px solid var(--conditional);background:linear-gradient(90deg,var(--conditional-bg),rgba(8,18,31,.78) 24%)}
.equation-entry.status-definition,.audit-card.status-definition{border-left:5px solid var(--definition);background:linear-gradient(90deg,var(--definition-bg),rgba(8,18,31,.78) 24%)}
.equation-entry.status-open,.audit-card.status-open{border-left:5px solid var(--open);background:linear-gradient(90deg,var(--open-bg),rgba(8,18,31,.78) 24%)}
.equation-entry.status-fail,.audit-card.status-fail{border-left:5px solid var(--fail);background:linear-gradient(90deg,var(--fail-bg),rgba(8,18,31,.78) 24%)}
.equation-entry.status-pass .equation-status,.audit-card.status-pass .audit-status{color:var(--pass);border-color:var(--pass)}
.equation-entry.status-conditional .equation-status,.audit-card.status-conditional .audit-status{color:var(--conditional);border-color:var(--conditional)}
.equation-entry.status-definition .equation-status,.audit-card.status-definition .audit-status{color:var(--definition);border-color:var(--definition)}
.equation-entry.status-open .equation-status,.audit-card.status-open .audit-status{color:var(--open);border-color:var(--open)}
.equation-entry.status-fail .equation-status,.audit-card.status-fail .audit-status{color:var(--fail);border-color:var(--fail)}
.status-summary.status-pass,.audit-section-heading.status-pass{border-color:rgba(74,222,128,.46);color:var(--pass);background:var(--pass-bg)}
.status-summary.status-conditional,.audit-section-heading.status-conditional{border-color:rgba(251,191,36,.46);color:var(--conditional);background:var(--conditional-bg)}
.status-summary.status-definition,.audit-section-heading.status-definition{border-color:rgba(96,165,250,.46);color:var(--definition);background:var(--definition-bg)}
.status-summary.status-open,.audit-section-heading.status-open{border-color:rgba(192,132,252,.46);color:var(--open);background:var(--open-bg)}
.status-summary.status-fail,.audit-section-heading.status-fail{border-color:rgba(251,113,133,.46);color:var(--fail);background:var(--fail-bg)}
.status-summary[aria-pressed="true"]{box-shadow:0 0 0 2px currentColor inset,0 12px 30px rgba(0,0,0,.2)}
.equation-formula,.audit-equation{position:relative;color:var(--text);border:1px solid rgba(103,212,255,.13);background:linear-gradient(180deg,rgba(3,10,18,.78),rgba(5,14,24,.62));box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
.equation-formula .math-line,.audit-equation .math-line{min-width:max-content;padding:.15rem 0}
.equation-formula .math-line+.math-line,.audit-equation .math-line+.math-line{margin-top:.7rem;padding-top:.8rem;border-top:1px solid rgba(255,255,255,.055)}
.equation-formula mjx-container[display="true"],.audit-equation mjx-container[display="true"]{margin:.55rem 0!important;font-size:108%!important}
@media(max-width:760px){.equation-formula mjx-container[display="true"],.audit-equation mjx-container[display="true"]{font-size:100%!important}}
'''


def split_display_math(text: str, class_name: str) -> str:
    pattern = re.compile(
        rf'(<div class="{re.escape(class_name)}">)\$\$(.*?)\$\$(</div>)',
        flags=re.S,
    )

    def replacement(match: re.Match[str]) -> str:
        chunks = [chunk.strip() for chunk in re.split(r"\n\s*\n+", match.group(2)) if chunk.strip()]
        if len(chunks) <= 1:
            return match.group(0)
        rendered = "".join(f'<div class="math-line">$${chunk}$$</div>' for chunk in chunks)
        return match.group(1) + rendered + match.group(3)

    return pattern.sub(replacement, text)


def inject_presentation_css(text: str) -> str:
    if "verification-presentation-v2" not in text:
        text = text.replace("</style>", PRESENTATION_CSS + "\n</style>", 1)
    return text


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
    text = split_display_math(text, "equation-formula")
    text = inject_presentation_css(text)
    path.write_text(text, encoding="utf-8")


def enhance_sympy(objects: list[dict]) -> None:
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
    text = split_display_math(text, "audit-equation")
    text = inject_presentation_css(text)
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
    enhance_sympy(objects)
    print("Enhanced equation and SymPy verification views with status colors and readable display math.")


if __name__ == "__main__":
    main()
