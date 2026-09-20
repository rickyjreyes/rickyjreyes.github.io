#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://rickyjreyes.github.io/"
AUTHOR = "Richard J. Reyes"
ORCID = "0009-0005-5975-8718"
ORCID_URL = f"https://orcid.org/{ORCID}"
PROFILE_URL = f"{SITE}researcher/"
PROFILE_ID = f"{PROFILE_URL}#richard-j-reyes"
GITHUB_URL = "https://github.com/rickyjreyes"
LINKEDIN_URL = "https://www.linkedin.com/in/rickyjreyes/"
WCT_REPO = "https://github.com/rickyjreyes/geometry_of_resonance"
ZENODO_CORE = "https://zenodo.org/records/15398996"

PROV_START = "<!-- canonical-provenance:start -->"
PROV_END = "<!-- canonical-provenance:end -->"


def esc(value: str) -> str:
    return html.escape(str(value), quote=True)


def replace_marked(text: str, block: str) -> str:
    pattern = re.compile(
        re.escape(PROV_START) + r".*?" + re.escape(PROV_END),
        flags=re.S,
    )
    if pattern.search(text):
        return pattern.sub(block, text, count=1)
    return text


def author_entity() -> dict:
    return {
        "@type": "Person",
        "@id": PROFILE_ID,
        "name": AUTHOR,
        "alternateName": "Ricky Reyes",
        "givenName": "Richard J.",
        "familyName": "Reyes",
        "identifier": ORCID_URL,
        "url": PROFILE_URL,
        "sameAs": [ORCID_URL, GITHUB_URL, LINKEDIN_URL],
    }


def patch_article_schema(text: str) -> str:
    script_re = re.compile(
        r'<script type="application/ld\+json">(.*?)</script>', re.S
    )

    def repl(match: re.Match[str]) -> str:
        raw = match.group(1).strip()
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            return match.group(0)
        if data.get("@type") != "ScholarlyArticle":
            return match.group(0)
        author = author_entity()
        data["author"] = author
        data["creator"] = author
        data["copyrightHolder"] = author
        data["mainEntityOfPage"] = data.get("url")
        data["about"] = {
            "@type": "Thing",
            "name": "Wave Confinement Theory",
            "url": SITE,
        }
        return '<script type="application/ld+json">' + json.dumps(
            data, ensure_ascii=False, separators=(",", ":")
        ) + "</script>"

    return script_re.sub(repl, text)


def publication_provenance(pub: dict) -> str:
    doi = pub["doi"]
    doi_url = f"https://doi.org/{doi}"
    zenodo = f"https://zenodo.org/records/{doi.rsplit('.', 1)[-1]}"
    repo = pub.get("repo") or WCT_REPO
    repo_name = repo.rstrip("/").rsplit("/", 1)[-1]
    title = esc(pub["title"])
    date = esc(pub["date"])
    display_date = esc(pub.get("display_date") or pub["date"])
    return f'''{PROV_START}
<section class="paper-section provenance-card" aria-labelledby="canonical-provenance-title">
<p class="paper-kicker">Canonical provenance</p>
<h2 id="canonical-provenance-title">{AUTHOR} · Wave Confinement Theory</h2>
<p><strong>Wave Confinement Theory (WCT) is a research program developed by <a href="../researcher/">{AUTHOR}</a> beginning in 2025.</strong> This page documents <strong>{title}</strong>, publicly released on <time datetime="{date}">{display_date}</time>, with DOI <a href="{doi_url}">{doi}</a> and source repository <a href="{esc(repo)}">{esc(repo_name)}</a>.</p>
<dl class="asset-list provenance-list">
<div><dt>Researcher</dt><dd><a href="../researcher/">{AUTHOR}</a> · <a href="{ORCID_URL}">ORCID {ORCID}</a></dd></div>
<div><dt>Public release</dt><dd><time datetime="{date}">{display_date}</time></dd></div>
<div><dt>DOI</dt><dd><a href="{doi_url}">{doi}</a></dd></div>
<div><dt>Zenodo record</dt><dd><a href="{zenodo}">{zenodo}</a></dd></div>
<div><dt>Source repository</dt><dd><a href="{esc(repo)}">{esc(repo)}</a></dd></div>
</dl>
</section>
{PROV_END}'''


def patch_publication_page(path: Path, pub: dict) -> None:
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    block = publication_provenance(pub)
    text = replace_marked(text, block)
    if PROV_START not in text:
        marker = '<section class="paper-section paper-actions-section" aria-label="Primary actions">'
        if marker in text:
            text = text.replace(marker, block + "\n" + marker, 1)
        else:
            text = re.sub(r"(</header>\s*)", r"\1" + block + "\n", text, count=1)
    text = patch_article_schema(text)
    text = re.sub(
        r'<p class="machine-disclaimer">.*?</p>',
        '<p class="machine-disclaimer">This page is the canonical local metadata and provenance record for this DOI-archived release by Richard J. Reyes. Publication date, DOI, Zenodo record, source repository, and research-program relationships are exposed explicitly for retrieval, citation, and attribution.</p>',
        text,
        flags=re.S,
    )
    path.write_text(text, encoding="utf-8")


def patch_publication_index(path: Path) -> None:
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    block = f'''{PROV_START}
<p class="canonical-provenance-intro"><strong>Wave Confinement Theory (WCT) is a research program developed by <a href="../researcher/">{AUTHOR}</a> beginning in 2025.</strong> This archive is the canonical publication chronology linking Reyes-authored releases to their public dates, DOI records, Zenodo records, and source artifacts.</p>
{PROV_END}'''
    text = replace_marked(text, block)
    if PROV_START not in text:
        text = text.replace("<h1>Publications</h1>", "<h1>Publications</h1>\n" + block, 1)
    path.write_text(text, encoding="utf-8")


def patch_homepage(path: Path) -> None:
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    script_re = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)

    def repl(match: re.Match[str]) -> str:
        try:
            data = json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            return match.group(0)
        if data.get("@type") != "Person":
            return match.group(0)
        data.update(author_entity())
        data["subjectOf"] = [
            {"@type": "ProfilePage", "url": PROFILE_URL},
            {"@type": "ScholarlyArticle", "url": ZENODO_CORE},
            {"@type": "CollectionPage", "url": f"{SITE}publications/"},
        ]
        return '<script type="application/ld+json">\n  ' + json.dumps(
            data, ensure_ascii=False, indent=2
        ) + "\n  </script>"

    text = script_re.sub(repl, text, count=1)
    old = '<p class="hero-lede">Papers, equations, simulations, experiments, open-data analyses, and computational extensions organized so new readers can find the central idea before entering the full corpus.</p>'
    new = f'<p class="hero-lede"><strong>Wave Confinement Theory is a research program developed by {AUTHOR} beginning in 2025.</strong> Papers, equations, simulations, experiments, open-data analyses, and computational extensions are organized here with public dates, DOI records, code, and evidence artifacts.</p>'
    if old in text:
        text = text.replace(old, new, 1)
    if 'href="researcher/"' not in text and '<div class="identity-links"' in text:
        text = text.replace(
            '<div class="identity-links" aria-label="External profiles and identifiers">',
            '<div class="identity-links" aria-label="External profiles and identifiers">\n          <a href="researcher/">Canonical researcher profile</a>',
            1,
        )
    path.write_text(text, encoding="utf-8")


def profile_page() -> str:
    person = author_entity()
    person.update(
        {
            "jobTitle": "Controls Engineer and Independent Researcher",
            "knowsAbout": [
                "Wave Confinement Theory",
                "Nonlinear wave dynamics",
                "Geometric analysis",
                "Scientific computing",
                "Spectral analysis",
                "Controls systems",
            ],
            "subjectOf": [
                {"@type": "ScholarlyArticle", "url": ZENODO_CORE},
                {"@type": "CollectionPage", "url": f"{SITE}publications/"},
                {"@type": "WebPage", "url": f"{SITE}priority/"},
            ],
        }
    )
    schema = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": PROFILE_URL,
        "url": PROFILE_URL,
        "name": f"{AUTHOR} — Researcher Profile",
        "dateModified": "2026-09-19",
        "mainEntity": person,
    }
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#07111f">
<title>{AUTHOR} | Researcher Profile and WCT Provenance</title>
<meta name="description" content="Canonical researcher profile for Richard J. Reyes, originator and primary author of the Wave Confinement Theory research program, with ORCID, GitHub, publication chronology, DOI records, and source repositories.">
<meta name="robots" content="index,follow,max-snippet:-1">
<link rel="canonical" href="{PROFILE_URL}">
<link rel="author" href="{ORCID_URL}">
<link rel="stylesheet" href="../styles.css">
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>
</head>
<body>
<a class="skip-link" href="#profile">Skip to researcher profile</a>
<header class="site-header"><div class="nav-wrap"><a class="wordmark" href="../"><span class="mark" aria-hidden="true">R</span><span>{AUTHOR}</span></a><nav aria-label="Profile navigation"><a href="../publications/">Publications</a><a href="../priority/">Priority</a><a href="{ORCID_URL}">ORCID</a></nav></div></header>
<main id="profile" class="section-shell" style="padding-top:96px;padding-bottom:120px">
<p class="eyebrow">Canonical researcher identity</p>
<h1 style="max-width:900px">{AUTHOR}</h1>
<p style="max-width:780px;font-size:1.2rem"><strong>Originator and primary author of Wave Confinement Theory (WCT).</strong> WCT is a public research program developed by Richard J. Reyes beginning in 2025 across mathematical derivation, formal verification, numerical simulation, experiment, open-data analysis, and engineering implementation.</p>
<section class="section" aria-labelledby="identity-title"><h2 id="identity-title">Identity and attribution</h2><p>This page is the canonical identity node used by the WCT website to connect Richard J. Reyes to the publication chronology, DOI records, repositories, equations, formal checks, experiments, and reproducibility artifacts in the public research corpus.</p>
<ul>
<li><strong>ORCID:</strong> <a href="{ORCID_URL}">{ORCID}</a></li>
<li><strong>GitHub:</strong> <a href="{GITHUB_URL}">{GITHUB_URL}</a></li>
<li><strong>LinkedIn:</strong> <a href="{LINKEDIN_URL}">{LINKEDIN_URL}</a></li>
<li><strong>Canonical research site:</strong> <a href="{SITE}">{SITE}</a></li>
<li><strong>Zenodo core WCT record:</strong> <a href="{ZENODO_CORE}">{ZENODO_CORE}</a></li>
</ul></section>
<section class="section" aria-labelledby="provenance-title"><h2 id="provenance-title">Canonical provenance chain</h2><p><strong>{AUTHOR} → specific contribution → public release date → DOI → Zenodo record → source repository → evidence artifact.</strong></p><p>The <a href="../publications/">publication archive</a> exposes this chain release by release. The <a href="../priority/">priority registry</a> records claim-level chronology, and the <a href="../research-corpus/">research corpus</a> connects equations, publications, code, tests, experiments, and open-data analyses.</p></section>
<section class="section" aria-labelledby="wct-title"><h2 id="wct-title">Wave Confinement Theory</h2><p>Wave Confinement Theory is the named research program under which Reyes publishes work on confined nonlinear wave dynamics, curvature, topology, effective mass, spectral structure, computation, AI confinement, and related mathematical and experimental questions. Individual claims retain their own mathematical, computational, experimental, or open-data evidence records.</p></section>
</main>
<footer class="section-shell" style="padding-bottom:48px"><a href="../">← Research home</a></footer>
</body></html>'''


def patch_major_page(path: Path, description: str) -> None:
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    block = f'''{PROV_START}
<aside class="section-shell canonical-provenance-banner" aria-label="Canonical provenance" style="padding-top:28px;padding-bottom:12px">
<p class="eyebrow">Canonical provenance</p>
<p><strong>Wave Confinement Theory (WCT) is a research program developed by <a href="/researcher/">{AUTHOR}</a> beginning in 2025.</strong> This page documents {esc(description)} within the public WCT research corpus. Publication dates and DOI records are indexed in the <a href="/publications/">publication archive</a>, with claim-level chronology in the <a href="/priority/">priority registry</a>.</p>
</aside>
{PROV_END}'''
    text = replace_marked(text, block)
    if PROV_START not in text:
        main_match = re.search(r"<main\b[^>]*>", text, flags=re.I)
        if main_match:
            pos = main_match.end()
            text = text[:pos] + "\n" + block + text[pos:]
    path.write_text(text, encoding="utf-8")


def main() -> None:
    pubs = json.loads((ROOT / "data" / "publications.json").read_text(encoding="utf-8"))
    if isinstance(pubs, dict):
        pubs = pubs.get("publications", pubs.get("items", []))

    for pub in pubs:
        patch_publication_page(ROOT / "publications" / f"{pub['slug']}.html", pub)

    patch_publication_index(ROOT / "publications" / "index.html")
    patch_homepage(ROOT / "index.html")

    researcher_dir = ROOT / "researcher"
    researcher_dir.mkdir(parents=True, exist_ok=True)
    (researcher_dir / "index.html").write_text(profile_page(), encoding="utf-8")

    major_pages = {
        "priority/index.html": "the claim-level chronology and priority record",
        "overlap/index.html": "documented external overlap and convergence records",
        "equations/index.html": "the canonical WCT equation registry",
        "sympy/index.html": "the executable symbolic-audit layer",
        "lean/index.html": "the kernel-checked formal-coverage layer",
        "reproduce/index.html": "the reproducibility and frozen-release workflow",
        "research-corpus/index.html": "the machine-readable WCT research corpus",
        "foundations/index.html": "the foundational paper and source map",
    }
    for rel, description in major_pages.items():
        patch_major_page(ROOT / rel, description)

    print(f"Strengthened canonical provenance across {len(pubs)} publication pages and major WCT research surfaces.")


if __name__ == "__main__":
    main()
