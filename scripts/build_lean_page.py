#!/usr/bin/env python3
from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EQUATIONS = ROOT / "equations" / "equations.json"
COMPILED = ROOT / "compiled-registry.json"
OUT = ROOT / "lean" / "index.html"


def classify_formalization(formal: dict) -> tuple[str, str, str]:
    status = str(formal.get("status", "OPEN")).upper()
    relationship = str(formal.get("relationship") or "").lower()
    if status == "PROVED":
        if "dimensional" in relationship:
            return "PROVED · DIMENSIONAL SUPPORT", "proved", "mapped"
        if "counterexample" in relationship:
            return "PROVED · COUNTEREXAMPLE", "counterexample", "mapped"
        if "supporting" in relationship:
            return "PROVED · PARTIAL SUPPORT", "partial", "mapped"
        return "PROVED · ALGEBRAIC SUPPORT", "support", "mapped"
    if status == "DEFINITION":
        return "DEFINITION", "definition", "mapped"
    if status in {"STATED_TODO", "TODO"}:
        return "TODO", "todo", "mapped"
    return "UNMAPPED", "unmapped", "unmapped"


def main() -> None:
    objects = json.loads(EQUATIONS.read_text(encoding="utf-8"))
    artifact = json.loads(COMPILED.read_text(encoding="utf-8"))
    compiled_by_id = {obj["canonical_id"]: obj for obj in artifact["objects"]}
    if {obj["id"] for obj in objects} != set(compiled_by_id):
        raise RuntimeError("Lean builder object IDs differ from compiled-registry.json")

    rows: list[str] = []
    options: list[str] = []
    lean_data: dict[str, dict] = {}
    mapped_count = 0
    for obj in objects:
        object_id = obj["id"]
        compiled = compiled_by_id[object_id]
        formal = compiled["formalization"]
        label, lean_class, mapped_state = classify_formalization(formal)
        if mapped_state == "mapped":
            mapped_count += 1
        declarations = formal.get("declarations", [])
        limitations = formal.get("limitations", [])
        if mapped_state == "unmapped":
            note = "No maintained direct Lean declaration currently closes this canonical object. This is an absence of formal coverage, not evidence that the equation is false."
        else:
            declaration_text = ", ".join(declarations) if declarations else "No named declaration recorded"
            note = f"Declarations: {declaration_text}."
            if limitations:
                note += " " + " ".join(limitations)
        search = " ".join(
            [object_id, obj["title"], obj["family"], label, obj["status"], obj["verification_kind"]]
        ).lower()
        rows.append(
            f'<button class="lean-row lean-{lean_class}" type="button" data-id="{object_id}" '
            f'data-state="{mapped_state}" data-search="{html.escape(search, quote=True)}">'
            f'<span><strong>{object_id}</strong><small>{html.escape(obj["title"])}</small></span>'
            f'<em>{html.escape(label)}</em></button>'
        )
        options.append(f'<option value="{object_id}">{object_id} — {html.escape(obj["title"])}</option>')
        lean_data[object_id] = {
            "id": object_id,
            "title": obj["title"],
            "family": obj["family"],
            "definition": obj.get("definition", ""),
            "formula": obj.get("formula") or r"\text{No standalone display equation recorded.}",
            "source": obj["source"],
            "coverage": label,
            "coverageClass": lean_class,
            "note": note,
            "mapped": mapped_state == "mapped",
            "declarations": declarations,
            "leanSource": formal.get("source"),
            "symbolicStatus": obj["status"],
            "verificationKind": obj["verification_kind"].replace("_", " "),
            "verificationScope": obj["verification_scope"].replace("_", " "),
            "empiricalStatus": obj["empirical_validation"]["status"].replace("_", " "),
            "baselineStatus": obj["baseline_status"],
            "statusChanged": obj["status_changed"],
        }

    total = len(objects)
    unmapped_count = total - mapped_count
    generated = html.escape(artifact["generated_at"])
    html_page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#07111f"><meta name="description" content="Lean coverage browser for all 142 canonical WCT equations, generated from the compiled effective registry."><meta name="robots" content="index,follow"><link rel="canonical" href="https://rickyjreyes.github.io/lean/"><title>WCT Lean Coverage | Richard J. Reyes</title><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../verification-pages.css"><script>window.MathJax={{tex:{{inlineMath:[["\\(","\\)"]],displayMath:[["$$","$$"]]}},svg:{{fontCache:"global"}},startup:{{typeset:false}}}};</script><script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script><style>
:root{{--lean-proved:#4ade80;--lean-support:#67d4ff;--lean-partial:#fbbf24;--lean-counter:#fb7185;--lean-definition:#60a5fa;--lean-todo:#c084fc;--lean-unmapped:#64748b}}.lean-hero{{padding-top:clamp(5rem,10vw,8rem)}}.registry-provenance{{color:var(--muted-2);font-size:.78rem}}.lean-browser{{display:grid;grid-template-columns:minmax(300px,.42fr) minmax(0,1fr);gap:1rem;align-items:start}}.lean-index{{position:sticky;top:92px;max-height:calc(100vh - 115px);overflow:auto;padding:.8rem;border:1px solid var(--line);border-radius:1rem;background:rgba(7,17,31,.93)}}.lean-controls{{display:grid;gap:.55rem;margin-bottom:.7rem}}.lean-controls input,.lean-controls select{{width:100%;padding:.75rem;border:1px solid var(--line-strong);border-radius:.65rem;background:#0a1728;color:var(--text);font:inherit}}.lean-filter-row{{display:grid;grid-template-columns:1fr 1fr;gap:.45rem}}.lean-filter-row button{{padding:.55rem;border:1px solid var(--line);border-radius:.6rem;background:transparent;color:var(--muted);cursor:pointer}}.lean-filter-row button[aria-pressed=true]{{border-color:var(--accent);color:var(--text);background:rgba(103,212,255,.08)}}.lean-list{{display:grid;gap:.4rem}}.lean-row{{display:flex;justify-content:space-between;gap:.75rem;width:100%;padding:.7rem;border:1px solid var(--line);border-left:4px solid var(--lean-unmapped);border-radius:.65rem;background:rgba(255,255,255,.018);color:var(--text);text-align:left;cursor:pointer}}.lean-row[hidden]{{display:none}}.lean-row span,.lean-row strong,.lean-row small{{display:block}}.lean-row small{{margin-top:.18rem;color:var(--muted);font-size:.7rem;line-height:1.25}}.lean-row em{{align-self:start;max-width:45%;color:var(--muted-2);font-style:normal;font-size:.56rem;font-weight:850;letter-spacing:.04em;text-align:right}}.lean-row[aria-pressed=true]{{background:rgba(103,212,255,.1);border-color:rgba(103,212,255,.55)}}.lean-proved{{border-left-color:var(--lean-proved)}}.lean-support{{border-left-color:var(--lean-support)}}.lean-partial{{border-left-color:var(--lean-partial)}}.lean-counterexample{{border-left-color:var(--lean-counter)}}.lean-definition{{border-left-color:var(--lean-definition)}}.lean-todo{{border-left-color:var(--lean-todo)}}.lean-detail{{position:sticky;top:92px;min-height:650px;padding:1.5rem;border:1px solid var(--line);border-radius:1rem;background:linear-gradient(145deg,rgba(12,27,45,.94),rgba(7,17,31,.96))}}.lean-detail header{{display:flex;justify-content:space-between;gap:1rem;align-items:start}}.lean-detail h2{{margin:.35rem 0;font:500 clamp(1.8rem,4vw,3rem)/1.1 Georgia,serif}}.lean-badge{{max-width:48%;padding:.42rem .65rem;border:1px solid currentColor;border-radius:999px;font-size:.62rem;font-weight:900;text-align:center}}.lean-badge.proved{{color:var(--lean-proved)}}.lean-badge.support{{color:var(--lean-support)}}.lean-badge.partial{{color:var(--lean-partial)}}.lean-badge.counterexample{{color:var(--lean-counter)}}.lean-badge.definition{{color:var(--lean-definition)}}.lean-badge.todo{{color:var(--lean-todo)}}.lean-badge.unmapped{{color:var(--lean-unmapped)}}.lean-family,.lean-symbolic{{color:var(--muted-2);font-size:.78rem}}.lean-definition-text{{max-width:88ch;color:var(--muted);font-size:1rem;line-height:1.75}}.lean-equation{{overflow:auto;margin:1.2rem 0;padding:1.35rem;border:1px solid rgba(103,212,255,.2);border-radius:1rem;background:radial-gradient(circle at 50% 0,rgba(103,212,255,.09),transparent 70%),rgba(0,0,0,.28)}}.lean-note{{padding:1rem;border-left:4px solid var(--accent);background:rgba(103,212,255,.05);color:var(--muted)}}.lean-actions{{display:flex;flex-wrap:wrap;gap:.65rem;margin-top:1.2rem}}.lean-nav{{display:flex;gap:.5rem;margin-top:1rem}}.lean-nav button{{padding:.55rem .75rem;border:1px solid var(--line);border-radius:.6rem;background:transparent;color:var(--text);cursor:pointer}}@media(max-width:900px){{.lean-browser{{grid-template-columns:1fr}}.lean-index,.lean-detail{{position:static;max-height:none}}.lean-index{{max-height:520px}}}}@media(max-width:620px){{.lean-detail header{{flex-direction:column}}.lean-badge{{max-width:100%}}}}
</style></head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header" id="top"><div class="nav-wrap"><a class="wordmark" href="../"><span class="mark" aria-hidden="true">R</span><span>Richard J. Reyes</span></a><nav></nav></div></header><main id="main"><section class="section section-shell lean-hero"><p class="breadcrumb"><a href="../">Home</a> / Lean</p><div class="section-heading narrow"><p class="eyebrow">Kernel-checked formal layer</p><h1>Complete WCT Lean Coverage</h1><p>Lean coverage is generated from the same registry used by the equation and SymPy pages. The symbolic outcome remains separate from kernel-checked declarations.</p></div><div class="summary-grid"><div class="summary-card"><strong>{total}</strong><span>canonical objects</span></div><div class="summary-card"><strong>{mapped_count}</strong><span>mapped definitions or declarations</span></div><div class="summary-card"><strong>{unmapped_count}</strong><span>unmapped or incomplete</span></div></div><div class="notice"><strong>Boundary:</strong> mapped does not mean equal proof strength. Dimensional lemmas, algebraic support, definitions, partial theorems, counterexamples, and TODOs remain distinct.</div><p class="registry-provenance">Registry v{artifact['schema_version']} · generated {generated} · <a href="../compiled-registry.json">machine-readable registry</a></p></section><section class="section section-shell"><div class="lean-browser"><aside class="lean-index"><div class="lean-controls"><select id="lean-id"><option value="">Equation ID…</option>{''.join(options)}</select><input id="lean-search" type="search" placeholder="Search ID, title, symbolic status, or Lean coverage"><div class="lean-filter-row"><button type="button" data-filter="" aria-pressed="true">All {total}</button><button type="button" data-filter="mapped" aria-pressed="false">Mapped {mapped_count}</button><button type="button" data-filter="unmapped" aria-pressed="false">Unmapped {unmapped_count}</button></div></div><div class="lean-list" id="lean-list">{''.join(rows)}</div></aside><article class="lean-detail" id="lean-detail"><header><div><p class="eyebrow" id="lean-id-out">Equation</p><h2 id="lean-title">Select an equation</h2><p class="lean-family" id="lean-family-out"></p><p class="lean-symbolic" id="lean-symbolic"></p></div><span class="lean-badge unmapped" id="lean-badge">UNMAPPED</span></header><p class="lean-definition-text" id="lean-definition"></p><div class="lean-equation" id="lean-equation"></div><div class="lean-note" id="lean-note"></div><div class="lean-actions"><a class="button primary" id="lean-open-equation" href="../equations/">Open canonical equation</a><a class="button secondary" id="lean-source" href="https://github.com/rickyjreyes/wct-lean" target="_blank" rel="noopener noreferrer">Lean source ↗</a><a class="button secondary" href="https://github.com/rickyjreyes/wct-lean/blob/main/THEOREMS.md" target="_blank" rel="noopener noreferrer">Theorem inventory ↗</a></div><div class="lean-nav"><button type="button" id="lean-prev">← Previous</button><button type="button" id="lean-next">Next →</button></div></article></div></section></main><footer class="site-footer"><div class="section-shell footer-bottom"><span>© 2026 Richard J. Reyes</span><a href="#top">Back to top ↑</a></div></footer><script>window.LEAN_COVERAGE_DATA={json.dumps(lean_data, ensure_ascii=False)};</script><script>
(() => {{const data=window.LEAN_COVERAGE_DATA,ids=Object.keys(data),rows=[...document.querySelectorAll('.lean-row')],select=document.getElementById('lean-id'),search=document.getElementById('lean-search');let current='',filter='';function render(id,updateHash=true){{const item=data[id];if(!item)return;current=id;select.value=id;document.getElementById('lean-id-out').textContent=id;document.getElementById('lean-title').textContent=item.title;document.getElementById('lean-family-out').textContent=item.family;document.getElementById('lean-symbolic').textContent='SymPy: '+item.symbolicStatus+' · '+item.verificationKind+' · '+item.verificationScope+' | Empirical: '+item.empiricalStatus;document.getElementById('lean-definition').textContent=item.definition;const equation=document.getElementById('lean-equation');equation.innerHTML='$$'+item.formula+'$$';const badge=document.getElementById('lean-badge');badge.className='lean-badge '+item.coverageClass;badge.textContent=item.coverage;document.getElementById('lean-note').textContent=item.note;document.getElementById('lean-open-equation').href='../equations/#'+encodeURIComponent(id);const source=document.getElementById('lean-source');source.href=item.leanSource?'https://github.com/rickyjreyes/wct-lean/blob/main/'+item.leanSource:'https://github.com/rickyjreyes/wct-lean';rows.forEach(row=>row.setAttribute('aria-pressed',String(row.dataset.id===id)));rows.find(row=>row.dataset.id===id)?.scrollIntoView({{block:'nearest'}});if(window.MathJax?.typesetClear)window.MathJax.typesetClear([equation]);if(window.MathJax?.typesetPromise)window.MathJax.typesetPromise([equation]);if(updateHash)history.replaceState(null,'','#'+encodeURIComponent(id));}}function apply(){{const q=search.value.trim().toLowerCase();rows.forEach(row=>{{row.hidden=(q&&!row.dataset.search.includes(q))||(filter&&row.dataset.state!==filter)}})}}rows.forEach(row=>row.addEventListener('click',()=>render(row.dataset.id)));select.addEventListener('change',()=>{{if(select.value)render(select.value)}});search.addEventListener('input',apply);document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));apply()}}));document.getElementById('lean-prev').addEventListener('click',()=>{{const index=Math.max(0,ids.indexOf(current));render(ids[(index-1+ids.length)%ids.length])}});document.getElementById('lean-next').addEventListener('click',()=>{{const index=Math.max(0,ids.indexOf(current));render(ids[(index+1)%ids.length])}});const initial=decodeURIComponent(location.hash.replace(/^#/,''));render(data[initial]?initial:'E1A',false);}})();
</script><script src="../site-nav.js" defer></script></body></html>'''
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html_page, encoding="utf-8")
    print(f"Generated Lean coverage from compiled registry: mapped={mapped_count}, unmapped={unmapped_count}.")


if __name__ == "__main__":
    main()
