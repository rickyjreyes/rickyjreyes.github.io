#!/usr/bin/env python3
from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EQUATIONS = ROOT / "equations" / "equations.json"
OUT = ROOT / "sympy" / "index.html"

STATUS_IDS = {
    "PASS": "M2 M3 M4 M7 E1A E1B E2 E3 E4 E5 E6 E7 E8 E9 E10 E11 E12 E13 E14 E16 E17 E18 E20 E21 E24 E26 E28 E29 E30 E33 E37 E38 E45 E47 E49 E51 E53 E57 E58 E59 E61 E62 E64 E65 E67 E69 E81 CLE2 CLE4 CLE6 CLE7 CLE9 CLE10 G1 EX EY EZ CM9 CM11".split(),
    "CONDITIONAL": "M1 M5 E15 E19 E22 E23 E31 E32 E40 E41 E48 E50 E54 E56 E66 E68 E70 E71 E72 E76 E80 CLE5 CLE8 FA TOP3 TOP7 CORR2".split(),
    "DEFINITION": "M6A E25 E27 E35 E36 E39 E44 E52 E55 E60 E63 E73 E79 E82 CLE1 CLE3 CM12 CM13 CM16 CM18 TOP1 TOP2 TOP5 CORR1 CORR3 CORR4".split(),
    "OPEN": "M6B M8 E34 E42 E43 E46 E74 E75 E77 E78 CM1 CM2 CM3 CM4 CM5 CM6 CM7 CM8 CM10 CM14 CM15 CM17 CM19 CM20 TOP4 TOP6 TOP8 TOP9 CORR5 CORR6".split(),
}
STATUS_COPY = {
    "PASS": "The encoded symbolic, dimensional, numerical, limiting, or logical check succeeds under its declared assumptions.",
    "CONDITIONAL": "The encoded implication requires additional domain, regularity, model, counting, or empirical assumptions.",
    "DEFINITION": "The object introduces notation, an ansatz, a parameterization, or bookkeeping structure rather than a theorem.",
    "OPEN": "The assigned derivation, proof, calibrated simulation, or empirical test is not closed.",
}


def build() -> str:
    objects = json.loads(EQUATIONS.read_text(encoding="utf-8"))
    by_id = {obj["id"]: obj for obj in objects}
    status_by_id = {
        object_id: status
        for status, ids in STATUS_IDS.items()
        for object_id in ids
    }
    if set(by_id) != set(status_by_id):
        missing = sorted(set(by_id) - set(status_by_id))
        extra = sorted(set(status_by_id) - set(by_id))
        raise RuntimeError(f"SymPy status map mismatch. Missing={missing}; extra={extra}")

    summaries = "".join(
        f'<button class="status-summary status-{status.lower()}" data-status-filter="{status}">'
        f'<strong>{len(STATUS_IDS[status])}</strong><span>{status}</span></button>'
        for status in ("PASS", "CONDITIONAL", "DEFINITION", "OPEN")
    )

    sections = []
    for status in ("PASS", "CONDITIONAL", "DEFINITION", "OPEN"):
        cards = []
        for object_id in STATUS_IDS[status]:
            obj = by_id[object_id]
            formula = obj.get("formula") or r"\text{No standalone display equation recorded.}"
            search = " ".join([
                object_id,
                obj["title"],
                obj["family"],
                status,
                obj.get("definition", ""),
            ]).lower()
            cards.append(
                f'<article class="audit-card status-{status.lower()}" id="{object_id}" '
                f'data-status="{status}" data-family="{html.escape(obj["family"], quote=True)}" '
                f'data-search="{html.escape(search, quote=True)}">'
                f'<header><div><span class="audit-id">{object_id}</span>'
                f'<h3>{html.escape(obj["title"])}</h3>'
                f'<p class="audit-family">{html.escape(obj["family"])}</p></div>'
                f'<span class="audit-status">{status}</span></header>'
                f'<p class="audit-definition">{html.escape(obj.get("definition", ""))}</p>'
                f'<div class="audit-equation">$${html.escape(formula)}$$</div>'
                f'<p class="audit-meaning">{STATUS_COPY[status]}</p>'
                f'<footer><a class="button primary" href="../equations/#{object_id}">Open equation</a>'
                f'<a class="button secondary" href="{obj["source"]}" target="_blank" rel="noopener noreferrer">Canonical source ↗</a>'
                f'<a class="button secondary" href="https://github.com/rickyjreyes/wct-sympy/blob/main/VERIFICATION_INDEX.md" target="_blank" rel="noopener noreferrer">Audit index ↗</a></footer>'
                f'</article>'
            )
        sections.append(
            f'<section class="audit-section" id="{status.lower()}">'
            f'<div class="audit-section-heading status-{status.lower()}"><div>'
            f'<p class="eyebrow">Effective SymPy classification</p><h2>{status}</h2>'
            f'<p>{STATUS_COPY[status]}</p></div><strong>{len(cards)}</strong></div>'
            f'<div class="audit-grid">{"".join(cards)}</div></section>'
        )

    families = sorted({obj["family"] for obj in objects})
    family_options = "".join(
        f'<option value="{html.escape(family, quote=True)}">{html.escape(family)}</option>'
        for family in families
    )

    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#07111f">
<meta name="description" content="All 142 WCT SymPy classifications displayed as colorized equation cards with formulas, definitions, and canonical links.">
<meta name="robots" content="index,follow"><link rel="canonical" href="https://rickyjreyes.github.io/sympy/">
<title>WCT SymPy Audit | Richard J. Reyes</title><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../verification-pages.css">
<script>window.MathJax={{tex:{{inlineMath:[["\\(","\\)"]],displayMath:[["$$","$$"]]}},svg:{{fontCache:"global"}}}};</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
<style>
:root{{--pass:#4ade80;--pass-bg:rgba(74,222,128,.09);--conditional:#fbbf24;--conditional-bg:rgba(251,191,36,.09);--definition:#60a5fa;--definition-bg:rgba(96,165,250,.09);--open:#c084fc;--open-bg:rgba(192,132,252,.09)}}
.audit-hero{{padding-top:clamp(5rem,10vw,8rem)}}.status-summaries{{display:grid;grid-template-columns:repeat(4,minmax(130px,1fr));gap:.75rem;margin:2rem 0}}.status-summary{{padding:1rem;border:1px solid var(--line);border-radius:1rem;color:var(--text);background:rgba(255,255,255,.025);cursor:pointer;text-align:left}}.status-summary strong{{display:block;font:500 2rem/1 Georgia,serif}}.status-summary span{{font-size:.72rem;font-weight:850;letter-spacing:.08em}}.status-summary.status-pass{{border-color:color-mix(in srgb,var(--pass) 55%,transparent);background:var(--pass-bg)}}.status-summary.status-conditional{{border-color:color-mix(in srgb,var(--conditional) 55%,transparent);background:var(--conditional-bg)}}.status-summary.status-definition{{border-color:color-mix(in srgb,var(--definition) 55%,transparent);background:var(--definition-bg)}}.status-summary.status-open{{border-color:color-mix(in srgb,var(--open) 55%,transparent);background:var(--open-bg)}}
.audit-toolbar{{position:sticky;top:72px;z-index:6;display:grid;grid-template-columns:minmax(260px,1fr) minmax(180px,.35fr) auto;gap:.75rem;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:rgba(7,17,31,.95);backdrop-filter:blur(14px)}}.audit-toolbar input,.audit-toolbar select{{width:100%;padding:.8rem;color:var(--text);border:1px solid var(--line-strong);border-radius:.7rem;background:#0a1728;font:inherit}}.audit-toolbar button{{padding:.8rem 1rem;border:1px solid var(--line);border-radius:.7rem;background:transparent;color:var(--text);cursor:pointer}}.audit-count{{color:var(--muted-2);font-size:.82rem}}
.audit-section{{padding:3.5rem 0;border-top:1px solid var(--line)}}.audit-section[hidden]{{display:none}}.audit-section-heading{{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:1.25rem;padding:1rem 1.15rem;border-left:4px solid var(--line)}}.audit-section-heading h2{{margin:.25rem 0;font:500 clamp(2rem,4vw,3.2rem)/1 Georgia,serif}}.audit-section-heading p{{margin:0;max-width:70ch;color:var(--muted)}}.audit-section-heading>strong{{font:500 2.2rem Georgia,serif}}.audit-section-heading.status-pass{{border-color:var(--pass);background:var(--pass-bg)}}.audit-section-heading.status-conditional{{border-color:var(--conditional);background:var(--conditional-bg)}}.audit-section-heading.status-definition{{border-color:var(--definition);background:var(--definition-bg)}}.audit-section-heading.status-open{{border-color:var(--open);background:var(--open-bg)}}
.audit-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:1rem}}.audit-card{{scroll-margin-top:150px;display:flex;min-height:430px;flex-direction:column;padding:1.2rem;border:1px solid var(--line);border-radius:1rem;background:rgba(8,18,31,.78)}}.audit-card[hidden]{{display:none}}.audit-card.status-pass{{border-top:4px solid var(--pass)}}.audit-card.status-conditional{{border-top:4px solid var(--conditional)}}.audit-card.status-definition{{border-top:4px solid var(--definition)}}.audit-card.status-open{{border-top:4px solid var(--open)}}.audit-card>header{{display:flex;align-items:start;justify-content:space-between;gap:1rem}}.audit-id{{font:850 .75rem ui-monospace,monospace;color:var(--accent)}}.audit-card h3{{margin:.35rem 0 .25rem;font:500 1.3rem/1.2 Georgia,serif}}.audit-family{{margin:0;color:var(--muted-2);font-size:.72rem}}.audit-status{{padding:.35rem .55rem;border:1px solid currentColor;border-radius:999px;font-size:.65rem;font-weight:900}}.status-pass .audit-status{{color:var(--pass)}}.status-conditional .audit-status{{color:var(--conditional)}}.status-definition .audit-status{{color:var(--definition)}}.status-open .audit-status{{color:var(--open)}}.audit-definition,.audit-meaning{{color:var(--muted);font-size:.86rem}}.audit-equation{{overflow:auto;margin:1rem 0;padding:1rem;border-radius:.75rem;background:rgba(0,0,0,.28)}}.audit-card footer{{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:auto}}.audit-card footer .button{{padding:.55rem .72rem;font-size:.72rem}}
@media(max-width:760px){{.status-summaries{{grid-template-columns:repeat(2,1fr)}}.audit-toolbar{{position:static;grid-template-columns:1fr}}.audit-grid{{grid-template-columns:1fr}}.audit-section-heading,.audit-card>header{{align-items:start;flex-direction:column}}}}
</style></head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header" id="top"><div class="nav-wrap"><a class="wordmark" href="../"><span class="mark" aria-hidden="true">R</span><span>Richard J. Reyes</span></a><nav></nav></div></header><main id="main"><section class="section section-shell audit-hero"><p class="breadcrumb"><a href="../">Home</a> / SymPy</p><div class="section-heading narrow"><p class="eyebrow">Executable symbolic layer</p><h1>Complete WCT SymPy Audit</h1><p>Each classification is now attached to the actual equation, its definition, and its canonical source. The colors encode effective audit status after derived overrides.</p></div><div class="status-summaries">{summaries}</div><div class="notice"><strong>Status precedence:</strong> the current effective distribution is 59 PASS, 27 CONDITIONAL, 26 DEFINITION, and 30 OPEN. PASS confirms the encoded check under declared assumptions; it is not automatically a Lean proof or empirical validation.</div><div class="audit-toolbar"><input id="audit-search" type="search" placeholder="Search ID, title, definition, or family"><select id="audit-family"><option value="">All equation families</option>{family_options}</select><button id="audit-reset" type="button">Reset</button></div><p class="audit-count" id="audit-count">Showing all 142 equation cards.</p></section><div class="section-shell">{''.join(sections)}</div></main><footer class="site-footer"><div class="section-shell footer-bottom"><span>© 2026 Richard J. Reyes</span><a href="#top">Back to top ↑</a></div></footer><script>
(() => {{const cards=[...document.querySelectorAll('.audit-card')],sections=[...document.querySelectorAll('.audit-section')],search=document.getElementById('audit-search'),family=document.getElementById('audit-family'),count=document.getElementById('audit-count');let status='';function apply(){{const q=search.value.trim().toLowerCase(),f=family.value;let shown=0;cards.forEach(card=>{{const ok=(!q||card.dataset.search.includes(q))&&(!f||card.dataset.family===f)&&(!status||card.dataset.status===status);card.hidden=!ok;if(ok)shown++}});sections.forEach(section=>section.hidden=![...section.querySelectorAll('.audit-card')].some(card=>!card.hidden));count.textContent=`Showing ${{shown}} of ${{cards.length}} equation cards.`}}document.querySelectorAll('[data-status-filter]').forEach(button=>button.addEventListener('click',()=>{{status=status===button.dataset.statusFilter?'':button.dataset.statusFilter;document.querySelectorAll('[data-status-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.statusFilter===status)));apply()}}));search.addEventListener('input',apply);family.addEventListener('change',apply);document.getElementById('audit-reset').addEventListener('click',()=>{{search.value='';family.value='';status='';document.querySelectorAll('[data-status-filter]').forEach(b=>b.setAttribute('aria-pressed','false'));apply()}});}})();
</script><script src="../site-nav.js" defer></script></body></html>'''


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(build(), encoding="utf-8")
    print("Generated colorized SymPy equation cards.")


if __name__ == "__main__":
    main()
