#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://rickyjreyes.github.io/"
NAV_HTML = (
    '<button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>'
    '<nav id="site-nav" aria-label="Primary navigation">'
    '<a href="/">Home</a>'
    '<a href="/publications/">Publications</a>'
    '<a href="/equations/">Equations</a>'
    '<a href="/sympy/">SymPy</a>'
    '<a href="/lean/">Lean</a>'
    '<a href="/tools/">Tools</a>'
    '</nav>'
)


def normalize_navbar(text: str) -> str:
    pattern = re.compile(
        r'(<header\s+class="site-header"[^>]*>\s*<div\s+class="nav-wrap">\s*'
        r'<a\s+class="wordmark".*?</a>)\s*'
        r'(?:<button\s+class="menu-button".*?</button>\s*)?'
        r'<nav[^>]*>.*?</nav>',
        flags=re.S,
    )
    return pattern.sub(lambda match: match.group(1) + NAV_HTML, text, count=1)


def patch_html(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    text = normalize_navbar(text)
    text = re.sub(r'\s*<script\s+src="(?:\.\./)*site-nav\.js"\s+defer></script>', "", text)
    depth = len(path.relative_to(ROOT).parts) - 1
    src = "../" * depth + "site-nav.js"
    tag = f'<script src="{src}" defer></script>'
    if "</body>" in text:
        text = text.replace("</body>", f"{tag}\n</body>")
    else:
        text += f"\n{tag}\n"
    path.write_text(text, encoding="utf-8")


def clarify_dimensionality_page() -> None:
    path = ROOT / "publications" / "hard-upper-bound-spatial-dimensionality.html"
    text = path.read_text(encoding="utf-8")
    old_summary = "This work argues that stable curvature-locked confinement in the stated WCT framework is restricted to at most three spatial dimensions. It combines Sobolev control, Lyapunov scaling, entropy localization, topology, and curvature-feedback behavior into several routes toward the same dimensional stability bound."
    new_summary = "This work develops a three-dimensional stability threshold under the stated WCT H²-confinement and regularity hypotheses. The verified Sobolev result establishes the H²-to-L∞ threshold for integer n≤3; the broader claim that every admissible higher-dimensional confinement mechanism is unstable remains conditional."
    old_limit = "The bound is derived within the stated WCT assumptions; its scope is conditional on that framework and its modeling choices."
    new_limit = "The registered E70 claim is CONDITIONAL. Failure of the general H²-to-L∞ embedding route above three dimensions does not by itself prove a universal impossibility theorem for every conceivable WCT confinement mechanism. The archival title and DOI citation are preserved unchanged."
    if old_summary in text:
        text = text.replace(old_summary, new_summary)
    if old_limit in text:
        text = text.replace(old_limit, new_limit)
    notice = '<div class="notice"><strong>Current registry boundary:</strong> E70 is CONDITIONAL. The n≤3 Sobolev threshold supports the declared H² regularity route; it is not a proved biconditional characterization of all stable WCT solutions. <a href="../equations/#E70">Open E70.</a></div>'
    marker = '<section class="paper-section"><h2>Abstract</h2>'
    if "Current registry boundary:" not in text and marker in text:
        text = text.replace(marker, notice + marker, 1)
    path.write_text(text, encoding="utf-8")


def patch_sitemap() -> None:
    path = ROOT / "sitemap.xml"
    text = path.read_text(encoding="utf-8")
    pages = [
        ("research-corpus/", "0.95"),
        ("equations/", "0.95"),
        ("sympy/", "0.90"),
        ("lean/", "0.90"),
        ("tools/", "0.90"),
        ("research-corpus.json", "0.80"),
        ("priority/", "0.85"),
    ]
    additions = []
    for suffix, priority in pages:
        url = SITE + suffix
        if f"<loc>{url}</loc>" not in text:
            additions.append(
                f"  <url><loc>{url}</loc><lastmod>2026-06-27</lastmod>"
                f"<changefreq>weekly</changefreq><priority>{priority}</priority></url>"
            )
    if additions:
        text = text.replace("</urlset>", "\n".join(additions) + "\n</urlset>")
        path.write_text(text, encoding="utf-8")


def patch_llms() -> None:
    text = f"""# Richard J. Reyes Research Archive

> Public discovery map for Wave Confinement Theory (WCT), related experiments, open-data analyses, computation, AI architecture, and resonance-control research.

## Preferred website navigation
- Research home: {SITE}
- Publications: {SITE}publications/
- Equations and definitions: {SITE}equations/
- Complete SymPy audit: {SITE}sympy/
- Complete Lean coverage: {SITE}lean/
- Research tools: {SITE}tools/
- Equations and verification map: {SITE}research-corpus/
- Machine-readable WCT corpus: {SITE}research-corpus.json

Use the internal website pages first because they preserve navigation and backlinks. Repository files are the technical source layer.

## Canonical source files
- Full corrected equation registry: https://github.com/rickyjreyes/geometry_of_resonance/blob/main/WCT_FULL_EQUATION_LIST_CORRECTED.md
- Master equation architecture: https://github.com/rickyjreyes/geometry_of_resonance/blob/main/WCT_MASTER_EQUATIONS_UPDATED.md
- SymPy executable registry: https://github.com/rickyjreyes/wct-sympy/blob/main/equations/full_registry.yaml
- SymPy derived overrides: https://github.com/rickyjreyes/wct-sympy/blob/main/equations/derived_overrides.yaml
- Lean theorem inventory: https://github.com/rickyjreyes/wct-lean/blob/main/THEOREMS.md
- Semantic research graph: https://github.com/rickyjreyes/obsidian/blob/main/Research/00%20Maps/WCT%20Research%20Command%20Center.md

## Resolution order
1. Canonical equation ID, formula, and definition.
2. Effective SymPy classification and checker.
3. Lean theorem, definition, counterexample, TODO, or unmapped status.
4. Semantic graph links to papers, derivations, predictions, experiments, and evidence.

## Machine-reading rules
- Preserve canonical object IDs exactly.
- Treat per-object derived overrides as newer than older summary tables.
- A SymPy PASS is not automatically a Lean proof or empirical validation.
- Use PROVED only for named declarations accepted by the Lean kernel.
- Distinguish PASS, CONDITIONAL, DEFINITION, OPEN, FAIL, and PROVED.
- Report unresolved or missing mappings rather than inventing them.

## Claim discipline
WCT is an evolving independent research framework, not an established physical theory. Distinguish definitions, ansätze, derivations, simulations, experiments, open-data tests, prediction ledgers, architectures, and speculative extensions.
"""
    (ROOT / "llms.txt").write_text(text, encoding="utf-8")


def main() -> None:
    for path in ROOT.rglob("*.html"):
        if ".git" not in path.parts:
            patch_html(path)
    clarify_dimensionality_page()
    patch_sitemap()
    patch_llms()
    print("Normalized shared navbar, dimensionality boundary, and discovery files.")


if __name__ == "__main__":
    main()
