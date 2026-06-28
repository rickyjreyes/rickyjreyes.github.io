#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
from datetime import date
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://rickyjreyes.github.io/"
TRACEABILITY_PATH = ROOT / "data" / "publication_traceability.json"
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


def esc(value: Any) -> str:
    return html.escape(str(value), quote=True)


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


def link_list(values: list[str], href_prefix: str, external: bool = False) -> str:
    if not values:
        return '<span class="trace-empty">None registered</span>'
    target = ' target="_blank" rel="noopener noreferrer"' if external else ""
    return " ".join(
        f'<a class="evidence-tag" href="{esc(href_prefix + value)}"{target}>{esc(value)}</a>'
        for value in values
    )


def list_items(values: list[str]) -> str:
    if not values:
        return '<li>None registered.</li>'
    return "".join(f"<li>{esc(value)}</li>" for value in values)


def render_traceability(slug: str, item: dict[str, Any]) -> str:
    claims = item.get("claim_ids", [])
    equations = item.get("equation_ids", [])
    assumptions = item.get("assumption_ids", [])
    repositories = item.get("repositories", [])
    datasets = item.get("datasets", [])
    rows = [
        '<div><dt>Claim IDs</dt><dd><div class="evidence-tags">' +
        link_list(claims, "../research-corpus/#") + "</div></dd></div>",
        '<div><dt>Equation IDs</dt><dd><div class="evidence-tags">' +
        link_list(equations, "../equations/#") + "</div></dd></div>",
        '<div><dt>SymPy audit</dt><dd><div class="evidence-tags">' +
        link_list(equations, "../sympy/#") + "</div></dd></div>",
        '<div><dt>Lean coverage</dt><dd><div class="evidence-tags">' +
        link_list(equations, "../lean/#") + "</div></dd></div>",
        '<div><dt>Assumptions</dt><dd><div class="evidence-tags">' +
        link_list(assumptions, "../research-corpus/#") + "</div></dd></div>",
        f'<div><dt>Formalization</dt><dd>{esc(item.get("formalization_status", "UNKNOWN"))}</dd></div>',
        f'<div><dt>Empirical state</dt><dd>{esc(item.get("empirical_status", "UNKNOWN"))}</dd></div>',
        f'<div><dt>Independent replication</dt><dd>{esc(item.get("independent_replication", "NONE_RECORDED"))}</dd></div>',
    ]
    if repositories:
        repo_links = " ".join(
            f'<a class="evidence-tag" href="{esc(url)}" target="_blank" rel="noopener noreferrer">{esc(url.rstrip("/").rsplit("/", 1)[-1])}</a>'
            for url in repositories
        )
        rows.append(f'<div><dt>Repositories</dt><dd><div class="evidence-tags">{repo_links}</div></dd></div>')
    if datasets:
        data_links = " ".join(
            f'<a class="evidence-tag" href="{esc(url)}" target="_blank" rel="noopener noreferrer">Data/source</a>'
            for url in datasets
        )
        rows.append(f'<div><dt>Data</dt><dd><div class="evidence-tags">{data_links}</div></dd></div>')
    notes = []
    if item.get("qualification"):
        notes.append(f'<div class="notice"><strong>Current qualification:</strong> {esc(item["qualification"])}</div>')
    if item.get("availability_note"):
        notes.append(f'<div class="notice"><strong>Availability:</strong> {esc(item["availability_note"])}</div>')
    return (
        f'<section class="paper-section" data-traceability="{esc(slug)}">'
        '<h2>Verification and traceability</h2>'
        '<p>This section is generated from the canonical publication traceability registry. Empty fields are reported rather than inferred.</p>'
        '<dl class="asset-list">' + "".join(rows) + '</dl>'
        '<h3>Explicit falsifiers</h3><ul class="overview-list">' + list_items(item.get("falsifiers", [])) + '</ul>'
        '<h3>Open obligations</h3><ul class="overview-list">' + list_items(item.get("open_obligations", [])) + '</ul>'
        + "".join(notes) + '</section>'
    )


def patch_publication_traceability() -> None:
    if not TRACEABILITY_PATH.exists():
        raise RuntimeError(f"Missing traceability source: {TRACEABILITY_PATH}")
    doc = json.loads(TRACEABILITY_PATH.read_text(encoding="utf-8"))
    mappings = doc.get("publications", {})
    publication_pages = [p for p in (ROOT / "publications").glob("*.html") if p.name != "index.html"]
    missing = []
    for path in publication_pages:
        slug = path.stem
        item = mappings.get(slug)
        if item is None:
            missing.append(slug)
            continue
        text = path.read_text(encoding="utf-8")
        text = re.sub(
            r'<section class="paper-section" data-traceability="[^"]+">.*?</section>',
            "",
            text,
            flags=re.S,
        )
        section = render_traceability(slug, item)
        marker = '<section class="paper-section" id="cite">'
        if marker not in text:
            raise RuntimeError(f"Citation marker missing in {path}")
        text = text.replace(marker, section + marker, 1)
        path.write_text(text, encoding="utf-8")
    extra = sorted(set(mappings) - {p.stem for p in publication_pages})
    if missing or extra:
        raise RuntimeError(f"Traceability mismatch: missing={missing}; extra={extra}")


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
- Publication traceability source: {SITE}data/publication_traceability.json
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
    patch_publication_traceability()
    patch_sitemap()
    patch_llms()
    print("Normalized navigation, publication traceability, dimensionality boundary, and discovery files.")


if __name__ == "__main__":
    main()
