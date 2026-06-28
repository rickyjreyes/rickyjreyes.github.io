#!/usr/bin/env python3
from __future__ import annotations

import html
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EQUATIONS = ROOT / "equations" / "equations.json"
COMPILED = ROOT / "compiled-registry.json"
OUT = ROOT / "sympy" / "index.html"
STATUS_ORDER = ("PASS", "CONDITIONAL", "DEFINITION", "OPEN", "FAIL")
STATUS_COPY = {
    "PASS": "The assigned executable check succeeds under its declared assumptions.",
    "CONDITIONAL": "Additional mathematical, regularity, model, counting, or empirical assumptions remain required.",
    "DEFINITION": "The object introduces notation, an ansatz, a parameterization, or bookkeeping structure rather than a theorem.",
    "OPEN": "The assigned derivation, proof, calibrated simulation, or empirical test is not closed.",
    "FAIL": "The encoded statement is contradicted by its assigned checker.",
}


def build() -> str:
    objects = json.loads(EQUATIONS.read_text(encoding="utf-8"))
    artifact = json.loads(COMPILED.read_text(encoding="utf-8"))
    by_status: dict[str, list[dict]] = {status: [] for status in STATUS_ORDER}
    for obj in objects:
        status = obj["status"]
        if status not in by_status:
            raise RuntimeError(f"{obj['id']}: unsupported status {status}")
        by_status[status].append(obj)

    counts = Counter(obj["status"] for obj in objects)
    if dict(artifact["counts"]) != {status: counts.get(status, 0) for status in STATUS_ORDER}:
        raise RuntimeError("SymPy page counts do not match compiled-registry.json")

    summaries = "".join(
        f'<button class="status-summary status-{status.lower()}" data-status-filter="{status}">'
        f'<strong>{counts.get(status, 0)}</strong><span>{status}</span></button>'
        for status in STATUS_ORDER if counts.get(status, 0) or status != "FAIL"
    )

    sections = []
    for status in STATUS_ORDER:
        items = by_status[status]
        if not items:
            continue
        cards = []
        for obj in items:
            object_id = obj["id"]
            formula = obj.get("formula") or r"\text{No standalone display equation recorded.}"
            kind = obj["verification_kind"].replace("_", " ")
            scope = obj["verification_scope"].replace("_", " ")
            search = " ".join(
                [object_id, obj["title"], obj["family"], status, kind, scope, obj.get("definition", "")]
            ).lower()
            history = (
                f'<p class="audit-history"><strong>Status history:</strong> {obj["baseline_status"]} → {status} '
                f'via {html.escape(obj["status_changed_by"] or "baseline registry")}.</p>'
                if obj.get("status_changed") else ""
            )
            limitations = obj.get("verification_limitations", [])
            limitation_html = (
                '<ul class="audit-limitations">' + "".join(f'<li>{html.escape(item)}</li>' for item in limitations) + '</ul>'
                if limitations else ""
            )
            cards.append(
                f'<article class="audit-card status-{status.lower()}" id="{object_id}" '
                f'data-status="{status}" data-family="{html.escape(obj["family"], quote=True)}" '
                f'data-search="{html.escape(search, quote=True)}">'
                f'<header><div><span class="audit-id">{object_id}</span>'
                f'<h3>{html.escape(obj["title"])}</h3>'
                f'<p class="audit-family">{html.escape(obj["family"])}</p></div>'
                f'<span class="audit-status">{status} · {html.escape(kind)}</span></header>'
                f'<p class="audit-definition">{html.escape(obj.get("definition", ""))}</p>'
                f'<div class="audit-equation">$${html.escape(formula)}$$</div>'
                f'<p class="audit-meaning">{html.escape(obj.get("verification_meaning", STATUS_COPY[status]))}</p>'
                f'<p class="audit-metadata"><strong>Checker:</strong> {html.escape(obj["checker"])} · '
                f'<strong>Scope:</strong> {html.escape(scope)} · '
                f'<strong>Lean:</strong> {html.escape(obj["formalization"]["status"])} · '
                f'<strong>Empirical:</strong> {html.escape(obj["empirical_validation"]["status"].replace("_", " "))}</p>'
                f'{limitation_html}{history}'
                f'<footer><a class="button primary" href="../equations/#{object_id}">Open equation</a>'
                f'<a class="button secondary" href="{obj["source"]}" target="_blank" rel="noopener noreferrer">Canonical source ↗</a>'
                f'<a class="button secondary" href="../lean/#{object_id}">Lean coverage</a></footer>'
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
    generated = html.escape(artifact["generated_at"])

    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#07111f">
<meta name="description" content="All 142 WCT SymPy classifications displayed with effective status, verification kind, provenance, and canonical links.">
<meta name="robots" content="index,follow"><link rel="canonical" href="https://rickyjreyes.github.io/sympy/">
<title>WCT SymPy Audit | Richard J. Reyes</title><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../verification-pages.css">
<script>window.MathJax={{tex:{{inlineMath:[["\\(","\\)"]],displayMath:[["$$","$$"]]}},svg:{{fontCache:"global"}},startup:{{typeset:false}}}};</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
<style>
:root{{--pass:#4ade80;--pass-bg:rgba(74,222,128,.09);--conditional:#fbbf24;--conditional-bg:rgba(251,191,36,.09);--definition:#60a5fa;--definition-bg:rgba(96,165,250,.09);--open:#c084fc;--open-bg:rgba(192,132,252,.09);--fail:#fb7185;--fail-bg:rgba(251,113,133,.09)}}
.audit-hero{{padding-top:clamp(5rem,10vw,8rem)}}.status-summaries{{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:.75rem;margin:2rem 0}}.status-summary{{padding:1rem;border:1px solid var(--line);border-radius:1rem;color:var(--text);background:rgba(255,255,255,.025);cursor:pointer;text-align:left}}.status-summary strong{{display:block;font:500 2rem/1 Georgia,serif}}.status-summary span{{font-size:.72rem;font-weight:850;letter-spacing:.08em}}.audit-toolbar{{position:sticky;top:72px;z-index:6;display:grid;grid-template-columns:minmax(260px,1fr) minmax(180px,.35fr) auto;gap:.75rem;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:rgba(7,17,31,.95);backdrop-filter:blur(14px)}}.audit-toolbar input,.audit-toolbar select{{width:100%;padding:.8rem;color:var(--text);border:1px solid var(--line-strong);border-radius:.7rem;background:#0a1728;font:inherit}}.audit-toolbar button{{padding:.8rem 1rem;border:1px solid var(--line);border-radius:.7rem;background:transparent;color:var(--text);cursor:pointer}}.audit-count,.registry-provenance{{color:var(--muted-2);font-size:.78rem}}.audit-section{{padding:3.5rem 0;border-top:1px solid var(--line)}}.audit-section[hidden]{{display:none}}.audit-section-heading{{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:1.25rem;padding:1rem 1.15rem;border-left:4px solid var(--line)}}.audit-section-heading h2{{margin:.25rem 0;font:500 clamp(2rem,4vw,3.2rem)/1 Georgia,serif}}.audit-section-heading p{{margin:0;max-width:70ch;color:var(--muted)}}.audit-section-heading>strong{{font:500 2.2rem Georgia,serif}}.audit-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:1rem}}.audit-card{{scroll-margin-top:150px;display:flex;min-height:490px;flex-direction:column;padding:1.2rem;border:1px solid var(--line);border-radius:1rem;background:rgba(8,18,31,.78)}}.audit-card[hidden]{{display:none}}.audit-card>header{{display:flex;align-items:start;justify-content:space-between;gap:1rem}}.audit-id{{font:850 .75rem ui-monospace,monospace;color:var(--accent)}}.audit-card h3{{margin:.35rem 0 .25rem;font:500 1.3rem/1.2 Georgia,serif}}.audit-family{{margin:0;color:var(--muted-2);font-size:.72rem}}.audit-status{{max-width:55%;padding:.35rem .55rem;border:1px solid currentColor;border-radius:999px;font-size:.6rem;font-weight:900;text-align:center}}.audit-definition,.audit-meaning,.audit-metadata,.audit-history,.audit-limitations{{color:var(--muted);font-size:.82rem;line-height:1.55}}.audit-equation{{overflow:auto;margin:1rem 0;padding:1rem;border-radius:.75rem;background:rgba(0,0,0,.28)}}.audit-history{{padding:.6rem;border-left:3px solid var(--accent);background:rgba(103,212,255,.04)}}.audit-card footer{{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:auto}}.audit-card footer .button{{padding:.55rem .72rem;font-size:.72rem}}@media(max-width:760px){{.audit-toolbar{{position:static;grid-template-columns:1fr}}.audit-grid{{grid-template-columns:1fr}}.audit-section-heading,.audit-card>header{{align-items:start;flex-direction:column}}.audit-status{{max-width:100%}}}}
</style></head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header" id="top"><div class="nav-wrap"><a class="wordmark" href="../"><span class="mark" aria-hidden="true">R</span><span>Richard J. Reyes</span></a><nav></nav></div></header><main id="main"><section class="section section-shell audit-hero"><p class="breadcrumb"><a href="../">Home</a> / SymPy</p><div class="section-heading narrow"><p class="eyebrow">Executable symbolic layer</p><h1>Complete WCT SymPy Audit</h1><p>Every card is generated from the same effective registry as the equation explorer. PASS remains the outcome; verification kind states what actually passed.</p></div><div class="status-summaries">{summaries}</div><div class="notice"><strong>Boundary:</strong> a SymPy PASS is not automatically a Lean proof or empirical validation. Read the verification kind, scope, assumptions, and limitations on each card.</div><p class="registry-provenance">Registry v{artifact['schema_version']} · generated {generated} · <a href="../compiled-registry.json">machine-readable registry</a></p><div class="audit-toolbar"><input id="audit-search" type="search" placeholder="Search ID, title, verification kind, or family"><select id="audit-family"><option value="">All equation families</option>{family_options}</select><button id="audit-reset" type="button">Reset</button></div><p class="audit-count" id="audit-count">Showing all {len(objects)} equation cards.</p></section><div class="section-shell">{''.join(sections)}</div></main><footer class="site-footer"><div class="section-shell footer-bottom"><span>© 2026 Richard J. Reyes</span><a href="#top">Back to top ↑</a></div></footer><script>
(() => {{const cards=[...document.querySelectorAll('.audit-card')],sections=[...document.querySelectorAll('.audit-section')],search=document.getElementById('audit-search'),family=document.getElementById('audit-family'),count=document.getElementById('audit-count');let status='';function apply(){{const q=search.value.trim().toLowerCase(),f=family.value;let shown=0;cards.forEach(card=>{{const ok=(!q||card.dataset.search.includes(q))&&(!f||card.dataset.family===f)&&(!status||card.dataset.status===status);card.hidden=!ok;if(ok)shown++}});sections.forEach(section=>section.hidden=![...section.querySelectorAll('.audit-card')].some(card=>!card.hidden));count.textContent=`Showing ${{shown}} of ${{cards.length}} equation cards.`}}document.querySelectorAll('[data-status-filter]').forEach(button=>button.addEventListener('click',()=>{{status=status===button.dataset.statusFilter?'':button.dataset.statusFilter;document.querySelectorAll('[data-status-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.statusFilter===status)));apply()}}));search.addEventListener('input',apply);family.addEventListener('change',apply);document.getElementById('audit-reset').addEventListener('click',()=>{{search.value='';family.value='';status='';document.querySelectorAll('[data-status-filter]').forEach(b=>b.setAttribute('aria-pressed','false'));apply()}});}})();
</script><script src="../site-nav.js" defer></script></body></html>'''


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(build(), encoding="utf-8")
    print("Generated SymPy cards from compiled-registry.json.")


if __name__ == "__main__":
    main()
