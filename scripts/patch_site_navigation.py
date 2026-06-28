#!/usr/bin/env python3
from __future__ import annotations

import re
from datetime import date
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
    today = date.today().isoformat()
    resources = [
        "research-corpus/",
        "equations/",
        "sympy/",
        "lean/",
        "tools/",
        "priority/",
        "research-corpus.json",
        "compiled-registry.json",
        "registry-validation-report.json",
        "equations/equations.json",
        "llms.txt",
        "priority/priority.json",
        "publications.json",
    ]
    additions = []
    for suffix in resources:
        url = SITE + suffix
        if f"<loc>{url}</loc>" not in text:
            additions.append(f"  <url><loc>{url}</loc><lastmod>{today}</lastmod></url>")
    if additions:
        text = text.replace("</urlset>", "\n".join(additions) + "\n</urlset>")
    for suffix in resources:
        url = re.escape(SITE + suffix)
        text = re.sub(
            rf"(<loc>{url}</loc><lastmod>)[^<]+(</lastmod>)",
            rf"\g<1>{today}\2",
            text,
        )
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
- Claim-level priority registry: {SITE}priority/

## Machine-readable resources
- Cross-repository corpus: {SITE}research-corpus.json
- Effective compiled registry: {SITE}compiled-registry.json
- Registry validation report: {SITE}registry-validation-report.json
- Equation feed: {SITE}equations/equations.json
- Publication metadata: {SITE}publications.json
- Claim-priority metadata: {SITE}priority/priority.json

Use the internal website pages first because they preserve navigation and backlinks. Repository files are the technical source layer.

## Canonical source files
- Full corrected equation registry: https://github.com/rickyjreyes/geometry_of_resonance/blob/main/WCT_FULL_EQUATION_LIST_CORRECTED.md
- Master equation architecture: https://github.com/rickyjreyes/geometry_of_resonance/blob/main/WCT_MASTER_EQUATIONS_UPDATED.md
- SymPy executable baseline registry: https://github.com/rickyjreyes/wct-sympy/blob/main/equations/full_registry.yaml
- SymPy derived overrides: https://github.com/rickyjreyes/wct-sympy/blob/main/equations/derived_overrides.yaml
- Lean theorem inventory: https://github.com/rickyjreyes/wct-lean/blob/main/THEOREMS.md
- Semantic research graph: https://github.com/rickyjreyes/obsidian/blob/main/Research/00%20Maps/WCT%20Research%20Command%20Center.md

## Resolution order
1. Resolve a publication through its exact DOI, claim IDs, equation IDs, assumptions, code, data, and evidence links when present.
2. Resolve a canonical equation through compiled-registry.json and its effective status.
3. Treat full_registry.yaml as the historical baseline when a derived override exists.
4. Resolve the effective SymPy classification and named checker.
5. Resolve Lean as a separate layer: theorem, definition, counterexample, partial support, TODO, or unmapped.
6. Resolve semantic links to papers, derivations, predictions, experiments, datasets, evidence, falsifiers, and unresolved obligations.

## Machine-reading rules
- Preserve canonical object IDs exactly.
- Treat per-object derived overrides as newer than older summary tables.
- Treat baseline status as historical whenever an effective override exists.
- A SymPy PASS is not automatically a Lean proof or empirical validation.
- A Lean theorem proves only the encoded statement under its displayed hypotheses; it is not physical validation.
- Do not infer empirical support from symbolic checks, formal proofs, simulations, protocols, or author-generated audits.
- Do not infer independent replication from author-generated code, data, simulations, experiments, or analyses.
- Use PROVED only for named declarations accepted by the Lean kernel.
- Distinguish PASS, CONDITIONAL, DEFINITION, OPEN, FAIL, and PROVED.
- Preserve the distinction between archival titles and current qualified claim status.
- Report unresolved, empty, or missing mappings rather than inventing them.
- Prefer registry-validation-report.json when checking whether public status layers agree.

## Claim discipline
WCT is an evolving independent research framework, not an established physical theory. Distinguish definitions, ansätze, derivations, model-relative results, simulations, experiments, open-data tests, prediction ledgers, architectures, and speculative extensions. Empty evidence or replication fields mean that support has not yet been recorded; they must not be silently upgraded.
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
