#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
import urllib.request
from collections import OrderedDict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "equations"
TOOLS_DIR = ROOT / "tools"
SOURCE_URL = "https://raw.githubusercontent.com/rickyjreyes/geometry_of_resonance/main/WCT_FULL_EQUATION_LIST_CORRECTED.md"
SOURCE_PAGE = "https://github.com/rickyjreyes/geometry_of_resonance/blob/main/WCT_FULL_EQUATION_LIST_CORRECTED.md"
ID_RE = re.compile(r"^##\s+((?:M|E|CLE|CM|TOP|CORR)\d+[A-Z]?|G1|EX|EY|EZ|FA)\s+[—-]\s+(.+?)\s*$")
STATUS_RE = re.compile(r"`(PASS|CONDITIONAL|DEFINITION|OPEN|FAIL)`")


def clean_markdown(text: str) -> str:
    text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", text)
    text = re.sub(r"[*_`]+", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def github_slug(text: str) -> str:
    value = text.lower().replace("—", " ").replace("–", " ")
    value = re.sub(r"[^a-z0-9\s-]", "", value)
    return re.sub(r"[-\s]+", "-", value).strip("-")


def parse_registry(markdown: str) -> list[dict]:
    lines = markdown.splitlines()
    family = "Registry"
    current: dict | None = None
    objects: list[dict] = []
    in_math = False
    math_buffer: list[str] = []
    paragraph: list[str] = []

    def flush_paragraph() -> None:
        nonlocal paragraph
        if current is not None and paragraph:
            value = clean_markdown(" ".join(paragraph))
            if value:
                current["paragraphs"].append(value)
        paragraph = []

    def flush_current() -> None:
        nonlocal current
        flush_paragraph()
        if current is None:
            return
        definition_parts = current.pop("paragraphs")
        definition = " ".join(definition_parts[:2]).strip()
        if not definition:
            definition = f"{current['title']}."
        current["definition"] = definition[:900]
        current["formula"] = "\n\n".join(current["formulas"][:4]).strip()
        current["source"] = SOURCE_PAGE + "#" + current["anchor"]
        objects.append(current)
        current = None

    for line in lines:
        if line.startswith("# ") and not line.startswith("## "):
            flush_paragraph()
            heading = clean_markdown(line[2:])
            if heading and not heading.startswith("Wave Confinement Theory"):
                family = heading
            continue

        match = ID_RE.match(line)
        if match:
            flush_current()
            object_id, title = match.groups()
            heading = f"{object_id} — {title}"
            current = {
                "id": object_id,
                "title": clean_markdown(title),
                "family": family,
                "status": "UNCLASSIFIED",
                "formulas": [],
                "paragraphs": [],
                "anchor": github_slug(heading),
            }
            continue

        if current is None:
            continue

        status_match = STATUS_RE.search(line)
        if status_match:
            current["status"] = status_match.group(1)
            flush_paragraph()
            continue

        if "$$" in line:
            parts = line.split("$$")
            for index, part in enumerate(parts):
                if index % 2 == 1:
                    formula = part.strip()
                    if formula:
                        current["formulas"].append(formula)
                elif part.strip() and in_math:
                    math_buffer.append(part.strip())
            if line.count("$$") % 2 == 1:
                in_math = not in_math
                if not in_math and math_buffer:
                    current["formulas"].append("\n".join(math_buffer))
                    math_buffer = []
            flush_paragraph()
            continue

        if in_math:
            math_buffer.append(line)
            continue

        stripped = line.strip()
        if not stripped:
            flush_paragraph()
            continue
        if stripped.startswith(("|", "---", "#", "**Status", "```")):
            flush_paragraph()
            continue
        if stripped.startswith(("- ", "1. ", "2. ", "3. ", "4. ", "5. ", "6. ", "7. ", "8. ", "9. ")):
            flush_paragraph()
            continue
        paragraph.append(stripped)

    flush_current()
    return objects


def family_slug(name: str) -> str:
    return github_slug(name) or "family"


def render_page(objects: list[dict]) -> str:
    families: OrderedDict[str, list[dict]] = OrderedDict()
    for obj in objects:
        families.setdefault(obj["family"], []).append(obj)

    family_links = "".join(
        f'<a href="#{family_slug(name)}">{html.escape(name)} <span>{len(items)}</span></a>'
        for name, items in families.items()
    )

    sections = []
    for family_name, items in families.items():
        cards = []
        for obj in items:
            formula = obj["formula"] or r"\text{No standalone display equation recorded.}"
            search = " ".join([obj["id"], obj["title"], family_name, obj["status"], obj["definition"]]).lower()
            cards.append(
                f'<article class="equation-entry" id="{obj["id"]}" data-family="{html.escape(family_name)}" '
                f'data-status="{obj["status"]}" data-search="{html.escape(search, quote=True)}">'
                f'<header><div><span class="equation-id">{obj["id"]}</span>'
                f'<h3>{html.escape(obj["title"])}</h3></div>'
                f'<span class="equation-status status-{obj["status"].lower()}">{obj["status"]}</span></header>'
                f'<p class="equation-definition">{html.escape(obj["definition"])}</p>'
                f'<div class="equation-formula">$${html.escape(formula)}$$</div>'
                f'<div class="equation-actions"><a href="#{obj["id"]}">Permalink</a>'
                f'<a href="{obj["source"]}" target="_blank" rel="noopener noreferrer">Canonical source ↗</a>'
                f'<a href="../sympy/#{obj["id"]}">SymPy status</a>'
                f'<a href="../lean/#{obj["id"]}">Lean coverage</a></div></article>'
            )
        sections.append(
            f'<section class="equation-family" id="{family_slug(family_name)}">'
            f'<div class="family-heading"><div><p class="eyebrow">Equation family</p>'
            f'<h2>{html.escape(family_name)}</h2></div><span>{len(items)} objects</span></div>'
            f'<div class="equation-list">{"".join(cards)}</div></section>'
        )

    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#07111f">
<meta name="description" content="All 142 canonical WCT equations mapped by family with formula, definition, audit status, and verification links.">
<meta name="robots" content="index,follow"><link rel="canonical" href="https://rickyjreyes.github.io/equations/">
<title>WCT Equation Explorer | Richard J. Reyes</title><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../verification-pages.css">
<script>window.MathJax={{tex:{{inlineMath:[["\\(","\\)"]],displayMath:[["$$","$$"]]}},svg:{{fontCache:"global"}}}};</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
<style>
.equation-hero{{padding-top:clamp(5rem,10vw,8rem)}}.equation-toolbar{{position:sticky;top:72px;z-index:5;display:grid;grid-template-columns:minmax(220px,1fr) repeat(2,minmax(150px,.35fr));gap:.75rem;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:rgba(7,17,31,.94);backdrop-filter:blur(14px)}}.equation-toolbar input,.equation-toolbar select{{width:100%;padding:.8rem;color:var(--text);border:1px solid var(--line-strong);border-radius:.7rem;background:#0a1728;font:inherit}}.family-nav{{display:flex;flex-wrap:wrap;gap:.55rem;margin:1.5rem 0}}.family-nav a{{padding:.45rem .7rem;border:1px solid var(--line);border-radius:999px;text-decoration:none;font-size:.75rem}}.family-nav span{{color:var(--muted-2)}}.equation-family{{padding:3rem 0;border-top:1px solid var(--line)}}.family-heading{{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:1rem}}.family-heading h2{{margin:0;font:500 clamp(1.8rem,4vw,3rem)/1.1 Georgia,serif}}.family-heading>span{{color:var(--muted-2)}}.equation-list{{display:grid;gap:1rem}}.equation-entry{{scroll-margin-top:150px;padding:1.3rem;border:1px solid var(--line);border-radius:1rem;background:rgba(8,18,31,.72)}}.equation-entry[hidden]{{display:none}}.equation-entry>header{{display:flex;align-items:start;justify-content:space-between;gap:1rem}}.equation-entry h3{{margin:.35rem 0 0;font:500 1.35rem/1.2 Georgia,serif}}.equation-id{{color:var(--accent);font:800 .75rem ui-monospace,monospace}}.equation-status{{padding:.35rem .6rem;border:1px solid var(--line);border-radius:999px;font-size:.67rem;font-weight:850}}.status-pass{{border-color:rgba(167,243,208,.45)}}.status-conditional{{border-color:rgba(255,210,120,.45)}}.status-open{{border-color:rgba(139,124,255,.45)}}.equation-definition{{color:var(--muted);max-width:82ch}}.equation-formula{{overflow-x:auto;padding:1rem;border-radius:.75rem;background:rgba(0,0,0,.25)}}.equation-actions{{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1rem}}.equation-actions a{{font-size:.78rem}}.equation-count{{margin:.75rem 0;color:var(--muted-2)}}@media(max-width:760px){{.equation-toolbar{{position:static;grid-template-columns:1fr}}.family-heading,.equation-entry>header{{align-items:start;flex-direction:column}}}}
</style></head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header" id="top"><div class="nav-wrap"><a class="wordmark" href="../"><span class="mark" aria-hidden="true">R</span><span>Richard J. Reyes</span></a><nav></nav></div></header><main id="main"><section class="section section-shell equation-hero"><p class="breadcrumb"><a href="../">Home</a> / Equations</p><div class="section-heading narrow"><p class="eyebrow">Canonical equation layer</p><h1>WCT Equation Explorer</h1><p>Every registered family maps to its actual canonical object. Each entry shows the equation title, current registry status, displayed formula, plain definition, and links into the symbolic and formal verification layers.</p></div><div class="inline-actions"><a class="button primary" href="{SOURCE_PAGE}" target="_blank" rel="noopener noreferrer">Open full corrected registry ↗</a><a class="button secondary" href="../sympy/">SymPy audit</a><a class="button secondary" href="../lean/">Lean coverage</a><a class="button secondary" href="../tools/#equations">Interactive tool</a></div><div class="summary-grid"><div class="summary-card"><strong>{len(objects)}</strong><span>registered objects</span></div><div class="summary-card"><strong>{len(families)}</strong><span>equation families</span></div></div><nav class="family-nav" aria-label="Equation families">{family_links}</nav><div class="equation-toolbar"><input id="equation-search" type="search" placeholder="Search ID, title, formula meaning, or family"><select id="equation-family"><option value="">All families</option>{''.join(f'<option value="{html.escape(name)}">{html.escape(name)}</option>' for name in families)}</select><select id="equation-status"><option value="">All statuses</option><option>PASS</option><option>CONDITIONAL</option><option>DEFINITION</option><option>OPEN</option><option>FAIL</option></select></div><p class="equation-count" id="equation-count">Showing all {len(objects)} objects.</p></section><div class="section-shell">{''.join(sections)}</div></main><footer class="site-footer"><div class="section-shell footer-bottom"><span>© 2026 Richard J. Reyes</span><a href="#top">Back to top ↑</a></div></footer><script>
(() => {{const entries=[...document.querySelectorAll('.equation-entry')],q=document.getElementById('equation-search'),family=document.getElementById('equation-family'),status=document.getElementById('equation-status'),count=document.getElementById('equation-count');function apply(){{const term=q.value.trim().toLowerCase(),f=family.value,s=status.value;let shown=0;entries.forEach(e=>{{const ok=(!term||e.dataset.search.includes(term))&&(!f||e.dataset.family===f)&&(!s||e.dataset.status===s);e.hidden=!ok;if(ok)shown++}});document.querySelectorAll('.equation-family').forEach(section=>section.hidden=![...section.querySelectorAll('.equation-entry')].some(e=>!e.hidden));count.textContent=`Showing ${{shown}} of ${{entries.length}} objects.`}}q.addEventListener('input',apply);family.addEventListener('change',apply);status.addEventListener('change',apply);}})();
</script><script src="../site-nav.js" defer></script></body></html>'''


def main() -> None:
    request = urllib.request.Request(SOURCE_URL, headers={"User-Agent": "rickyjreyes.github.io-builder"})
    with urllib.request.urlopen(request, timeout=30) as response:
        markdown = response.read().decode("utf-8")
    objects = parse_registry(markdown)
    if len(objects) != 142:
        raise RuntimeError(f"Expected 142 equation objects, parsed {len(objects)}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    TOOLS_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "equations.json").write_text(json.dumps(objects, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT_DIR / "index.html").write_text(render_page(objects), encoding="utf-8")
    tool_objects = [
        {
            "id": obj["id"],
            "family": obj["family"],
            "title": obj["title"],
            "meaning": obj["definition"],
            "latex": obj["formula"] or r"\text{No standalone display equation recorded.}",
            "symbols": [],
            "use": ["Canonical source: WCT_FULL_EQUATION_LIST_CORRECTED.md"],
            "status": obj["status"],
            "source": obj["source"],
        }
        for obj in objects
    ]
    (TOOLS_DIR / "equations-data.js").write_text(
        "window.WCT_EQUATIONS = " + json.dumps(tool_objects, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )
    print(f"Generated equation explorer with {len(objects)} objects.")


if __name__ == "__main__":
    main()
