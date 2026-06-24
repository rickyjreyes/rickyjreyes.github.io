#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "publications.json"
PUB_DIR = ROOT / "publications"
SITE = "https://rickyjreyes.github.io/"
ORCID = "0009-0005-5975-8718"
AUTHOR = "Richard J. Reyes"


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def record_url(doi: str) -> str:
    return f"https://zenodo.org/records/{doi.rsplit('.', 1)[-1]}"


def local_url(slug: str) -> str:
    return f"{SITE}publications/{slug}.html"


def bib_key(pub: dict) -> str:
    words = re.findall(r"[A-Za-z0-9]+", pub["slug"])
    return f"Reyes{pub['date'][:4]}{''.join(w.capitalize() for w in words[:3])}"


def paper_page(pub: dict) -> str:
    url = local_url(pub["slug"])
    doi_url = f"https://doi.org/{pub['doi']}"
    zenodo = record_url(pub["doi"])
    schema = {
        "@context": "https://schema.org",
        "@type": "ScholarlyArticle",
        "headline": pub["title"],
        "name": pub["title"],
        "abstract": pub["summary"],
        "datePublished": pub["date"],
        "inLanguage": "en",
        "author": {
            "@type": "Person",
            "name": AUTHOR,
            "givenName": "Richard J.",
            "familyName": "Reyes",
            "identifier": f"https://orcid.org/{ORCID}",
            "url": SITE,
        },
        "publisher": {"@type": "Organization", "name": "Zenodo", "url": "https://zenodo.org/"},
        "identifier": pub["doi"],
        "url": url,
        "sameAs": [doi_url, zenodo],
        "isPartOf": {
            "@type": "CreativeWorkSeries",
            "name": "Wave Confinement Theory research program",
            "url": f"{SITE}publications/",
        },
    }
    citation = (
        f"Reyes, R. J. ({pub['display_date']}). {pub['title']}. "
        f"Zenodo. {doi_url}"
    )
    citation_date = pub["date"].replace("-", "/")
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#07111f">
<title>{esc(pub['title'])} | Richard J. Reyes</title>
<meta name="description" content="{esc(pub['summary'])}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<link rel="canonical" href="{url}"><link rel="cite-as" href="{doi_url}">
<link rel="author" href="https://orcid.org/{ORCID}">
<link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="paper.css">
<meta name="citation_title" content="{esc(pub['title'])}">
<meta name="citation_author" content="Reyes, Richard J.">
<meta name="citation_publication_date" content="{citation_date}">
<meta name="citation_doi" content="{pub['doi']}">
<meta name="citation_technical_report_institution" content="Independent Researcher">
<meta name="citation_technical_report_number" content="{pub['doi']}">
<meta name="citation_language" content="en">
<meta name="DC.title" content="{esc(pub['title'])}">
<meta name="DC.creator" content="Reyes, Richard J.">
<meta name="DC.date" content="{pub['date']}">
<meta name="DC.identifier" content="{doi_url}">
<meta name="DC.type" content="Text.Preprint">
<meta name="DC.publisher" content="Zenodo">
<meta name="DC.language" content="en">
<meta name="DC.relation" content="{zenodo}">
<meta property="og:type" content="article">
<meta property="og:title" content="{esc(pub['title'])}">
<meta property="og:description" content="{esc(pub['summary'])}">
<meta property="og:url" content="{url}">
<meta property="article:published_time" content="{pub['date']}">
<meta property="article:author" content="{AUTHOR}">
<meta name="twitter:card" content="summary">
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>
</head>
<body>
<a class="skip-link" href="#paper">Skip to article metadata</a>
<header class="site-header"><div class="nav-wrap">
<a class="wordmark" href="../"><span class="mark" aria-hidden="true">R</span><span>{AUTHOR}</span></a>
<nav class="paper-nav" aria-label="Publication navigation"><a href="./">Publications</a><a href="{zenodo}">Zenodo</a></nav>
</div></header>
<main id="paper" class="paper-shell"><article>
<header class="paper-header">
<p class="paper-kicker">Preprint · {esc(pub['category'])} · Release {pub['n']:02d}</p>
<h1 class="citation_title">{esc(pub['title'])}</h1>
<p class="citation_author">{AUTHOR}</p>
<p class="paper-meta">Independent Researcher · {pub['display_date']} · <a href="{doi_url}">{pub['doi']}</a></p>
</header>
<section class="paper-section"><h2>Abstract</h2><p>{esc(pub['summary'])}</p></section>
<section class="paper-section"><h2>Research status</h2><p>This page is a machine-readable discovery and citation landing page for the archival preprint. The DOI record and downloadable files are maintained by Zenodo. Claims should be evaluated according to the derivations, simulations, experiments, data analyses, assumptions, and limitations stated in the paper.</p></section>
<section class="paper-section"><h2>Recommended citation</h2><p class="formatted-citation">{esc(citation)}</p>
<div class="paper-actions"><a class="button primary" href="{doi_url}">Open DOI</a><a class="button secondary" href="{zenodo}">Zenodo record</a><a class="button secondary" href="../publications.bib">BibTeX</a><a class="button secondary" href="../publications.ris">RIS</a></div></section>
<section class="paper-section machine-note"><h2>Machine-readable identifiers</h2><dl>
<div><dt>DOI</dt><dd><a href="{doi_url}">{pub['doi']}</a></dd></div>
<div><dt>Zenodo</dt><dd><a href="{zenodo}">{zenodo}</a></dd></div>
<div><dt>Local metadata</dt><dd><a href="{url}">{url}</a></dd></div>
<div><dt>Author</dt><dd><a href="https://orcid.org/{ORCID}">ORCID {ORCID}</a></dd></div>
</dl></section>
</article></main>
<footer class="paper-footer"><div class="section-shell"><a href="./">← Publication archive</a><span>Wave Confinement Theory research program</span></div></footer>
</body></html>
"""


PAPER_CSS = """
.paper-nav{display:flex;gap:22px}.paper-nav a{color:var(--muted);font-size:.84rem;font-weight:700;text-decoration:none}
.paper-shell{width:min(calc(100% - 40px),920px);margin:auto;padding:90px 0 120px}
.paper-header{padding-bottom:46px;border-bottom:1px solid var(--line)}
.paper-kicker{margin:0 0 20px;color:var(--accent);font-size:.74rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
.paper-header h1{margin:0;font:500 clamp(2.6rem,6vw,5.35rem)/1.04 Georgia,serif;letter-spacing:-.038em}
.citation_author{margin:28px 0 4px;font-size:1.25rem;font-weight:750}.paper-meta{margin:0;color:var(--muted)}
.paper-section{padding:42px 0;border-bottom:1px solid var(--line)}.paper-section h2{margin:0 0 18px;font:500 1.65rem/1.2 Georgia,serif}
.paper-section>p{color:var(--muted);font-size:1.03rem}.formatted-citation{padding:20px;border-left:2px solid var(--accent);background:rgba(103,212,255,.045)}
.paper-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.machine-note dl{margin:0}.machine-note dl div{display:grid;grid-template-columns:120px 1fr;gap:20px;padding:12px 0;border-top:1px solid var(--line)}
.machine-note dt{color:var(--muted-2);font-size:.72rem;font-weight:800;text-transform:uppercase}.machine-note dd{margin:0;color:var(--muted);overflow-wrap:anywhere}
.paper-footer{padding:28px 0;border-top:1px solid var(--line);background:var(--bg-deep)}.paper-footer .section-shell{display:flex;justify-content:space-between;gap:20px;color:var(--muted-2);font-size:.78rem}
.paper-footer a{text-decoration:none}@media(max-width:700px){.paper-nav{gap:12px}.paper-shell{width:min(calc(100% - 28px),920px);padding-top:60px}.paper-header h1{font-size:clamp(2.25rem,12vw,4rem)}
.machine-note dl div{grid-template-columns:1fr;gap:4px}.paper-footer .section-shell{flex-direction:column}}
""".strip() + "\n"


def publications_index(pubs: list[dict]) -> str:
    items = "\n".join(
        f'<article class="pub-index-item"><span>{p["n"]:02d}</span><div>'
        f'<p>{esc(p["category"])} · {p["display_date"]}</p>'
        f'<h2><a href="{p["slug"]}.html">{esc(p["title"])}</a></h2>'
        f'<code>{p["doi"]}</code></div></article>'
        for p in pubs
    )
    return f"""<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Publications | Richard J. Reyes</title>
<meta name="description" content="Machine-readable publication landing pages for the Wave Confinement Theory research program.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="{SITE}publications/">
<link rel="alternate" type="application/atom+xml" href="{SITE}feed.xml">
<link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="paper.css">
<style>.pub-index-head{{padding-bottom:42px;border-bottom:1px solid var(--line)}}.pub-index-head h1{{margin:0;font:500 clamp(3rem,7vw,6rem)/1 Georgia,serif;letter-spacing:-.04em}}.pub-index-head p{{max-width:760px;color:var(--muted)}}.export-links{{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}}.pub-index-list{{border-top:1px solid var(--line);margin-top:48px}}.pub-index-item{{display:grid;grid-template-columns:64px 1fr;gap:20px;padding:24px 0;border-bottom:1px solid var(--line)}}.pub-index-item>span{{color:var(--muted-2);font-family:Georgia,serif}}.pub-index-item p{{margin:0 0 7px;color:var(--accent);font-size:.69rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase}}.pub-index-item h2{{margin:0;font:500 clamp(1.15rem,2.4vw,1.55rem)/1.25 Georgia,serif}}.pub-index-item h2 a{{text-decoration:none}}.pub-index-item code{{display:inline-block;margin-top:9px;color:var(--muted-2);font-size:.72rem}}@media(max-width:600px){{.pub-index-item{{grid-template-columns:40px 1fr}}}}</style>
</head><body>
<header class="site-header"><div class="nav-wrap"><a class="wordmark" href="../"><span class="mark">R</span><span>{AUTHOR}</span></a><nav class="paper-nav"><a href="../#start">Start here</a><a href="../#about">About</a></nav></div></header>
<main class="paper-shell"><header class="pub-index-head"><p class="paper-kicker">Scholarly archive</p><h1>Publications</h1>
<p>Each release has a separate HTML landing page with visible citation data, DOI links, Highwire Press metadata, Dublin Core metadata, and Schema.org ScholarlyArticle markup.</p>
<div class="export-links"><a class="button secondary" href="../publications.bib">BibTeX</a><a class="button secondary" href="../publications.ris">RIS</a><a class="button secondary" href="../publications.json">JSON</a><a class="button secondary" href="../feed.xml">Atom feed</a></div></header>
<section class="pub-index-list">{items}</section></main>
<footer class="paper-footer"><div class="section-shell"><a href="../">← Research home</a><span>{len(pubs)} archival releases</span></div></footer>
</body></html>"""


def build_bibtex(pubs: list[dict]) -> str:
    entries = []
    for p in pubs:
        entries.append(
            f"""@misc{{{bib_key(p)},
  author       = {{Reyes, Richard J.}},
  title        = {{{p['title']}}},
  year         = {{{p['date'][:4]}}},
  publisher    = {{Zenodo}},
  doi          = {{{p['doi']}}},
  url          = {{https://doi.org/{p['doi']}}},
  note         = {{Preprint}}
}}"""
        )
    return "\n\n".join(entries) + "\n"


def build_ris(pubs: list[dict]) -> str:
    lines = []
    for p in pubs:
        lines.extend(
            [
                "TY  - PREPRINT",
                "AU  - Reyes, Richard J.",
                f"TI  - {p['title']}",
                f"PY  - {p['date'][:4]}",
                f"DA  - {p['date']}",
                "PB  - Zenodo",
                f"DO  - {p['doi']}",
                f"UR  - https://doi.org/{p['doi']}",
                "ER  - ",
                "",
            ]
        )
    return "\n".join(lines)


def build_json(pubs: list[dict]) -> str:
    works = []
    for p in pubs:
        works.append(
            {
                "id": p["n"],
                "type": "ScholarlyArticle",
                "title": p["title"],
                "author": [{"name": AUTHOR, "orcid": ORCID}],
                "datePublished": p["date"],
                "publisher": "Zenodo",
                "doi": p["doi"],
                "doiUrl": f"https://doi.org/{p['doi']}",
                "zenodoRecord": record_url(p["doi"]),
                "landingPage": local_url(p["slug"]),
                "category": p["category"],
                "abstract": p["summary"],
            }
        )
    return json.dumps(
        {"schemaVersion": "1.0", "author": AUTHOR, "orcid": ORCID, "works": works},
        ensure_ascii=False,
        indent=2,
    ) + "\n"


def build_sitemap(pubs: list[dict]) -> str:
    urls = [SITE, f"{SITE}publications/"] + [local_url(p["slug"]) for p in pubs]
    body = []
    for url in urls:
        change = "monthly" if url.endswith("/") else "yearly"
        priority = "1.0" if url == SITE else "0.8"
        body.append(
            f"  <url><loc>{url}</loc><lastmod>2026-06-24</lastmod>"
            f"<changefreq>{change}</changefreq><priority>{priority}</priority></url>"
        )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(body)
        + "\n</urlset>\n"
    )


def build_feed(pubs: list[dict]) -> str:
    entries = []
    for p in pubs:
        updated = p["date"] if len(p["date"]) == 10 else p["date"] + "-01"
        entries.append(
            f'<entry><title>{esc(p["title"])}</title>'
            f'<id>https://doi.org/{p["doi"]}</id>'
            f'<link href="{local_url(p["slug"])}"/>'
            f'<link rel="alternate" href="https://doi.org/{p["doi"]}"/>'
            f'<updated>{updated}T00:00:00Z</updated>'
            f'<author><name>{AUTHOR}</name><uri>https://orcid.org/{ORCID}</uri></author>'
            f'<summary>{esc(p["summary"])}</summary></entry>'
        )
    return (
        '<?xml version="1.0" encoding="utf-8"?>'
        '<feed xmlns="http://www.w3.org/2005/Atom">'
        f'<title>{AUTHOR} — Research Releases</title><id>{SITE}</id>'
        f'<link href="{SITE}feed.xml" rel="self"/><link href="{SITE}"/>'
        '<updated>2026-06-24T00:00:00Z</updated>'
        f'<author><name>{AUTHOR}</name><uri>https://orcid.org/{ORCID}</uri></author>'
        + "".join(entries)
        + "</feed>"
    )


def build_llms() -> str:
    return f"""# Richard J. Reyes Research Archive

> Public discovery map for Wave Confinement Theory (WCT), related experiments, open-data analyses, computation, AI architecture, and resonance-control research.

## Canonical entry points
- Research home: {SITE}
- Publication archive: {SITE}publications/
- Main code and paper hub: https://github.com/rickyjreyes/geometry_of_resonance
- ORCID: https://orcid.org/{ORCID}
- Machine-readable publication metadata: {SITE}publications.json
- BibTeX: {SITE}publications.bib
- RIS: {SITE}publications.ris

## Claim discipline
WCT is an evolving independent research framework, not an established physical theory. Distinguish definitions, ansätze, derivations, simulations, experiments, open-data tests, prediction ledgers, architectures, and speculative extensions.

## DOI authority
Zenodo is the archival publisher and DOI landing-page authority for the listed releases. Use the DOI URLs on each publication page for citation.
"""


def build_cff() -> str:
    return f"""cff-version: 1.2.0
message: "Please cite the specific Zenodo release used. The complete publication list is available in publications.bib and publications.ris."
title: "Richard J. Reyes Research Archive"
type: website
authors:
  - family-names: Reyes
    given-names: "Richard J."
    orcid: "https://orcid.org/{ORCID}"
url: "{SITE}"
repository-code: "https://github.com/rickyjreyes/rickyjreyes.github.io"
date-released: 2026-06-24
license: CC-BY-4.0
preferred-citation:
  type: article
  title: "The Geometry of Resonance: Wave Confinement Theory and the Emergence of Mass, Force, and Spacetime"
  authors:
    - family-names: Reyes
      given-names: "Richard J."
      orcid: "https://orcid.org/{ORCID}"
  year: 2025
  doi: "10.5281/zenodo.15644222"
"""


def build_codemeta() -> str:
    obj = {
        "@context": "https://w3id.org/codemeta/3.0",
        "@type": "SoftwareSourceCode",
        "name": "Richard J. Reyes Research Site",
        "description": "Static research discovery site and machine-readable publication archive for Wave Confinement Theory and related work.",
        "codeRepository": "https://github.com/rickyjreyes/rickyjreyes.github.io",
        "url": SITE,
        "author": {
            "@type": "Person",
            "givenName": "Richard J.",
            "familyName": "Reyes",
            "@id": f"https://orcid.org/{ORCID}",
        },
        "dateCreated": "2026-06-24",
        "programmingLanguage": ["HTML", "CSS", "JavaScript", "Python"],
        "license": "https://creativecommons.org/licenses/by/4.0/",
    }
    return json.dumps(obj, indent=2) + "\n"


def patch_home() -> None:
    path = ROOT / "index.html"
    text = path.read_text(encoding="utf-8")
    head_marker = '  <link rel="stylesheet" href="styles.css">'
    head_add = (
        '  <link rel="alternate" type="application/atom+xml" title="Research releases" href="feed.xml">\n'
        '  <link rel="author" href="https://orcid.org/0009-0005-5975-8718">\n'
        '  <link rel="stylesheet" href="styles.css">'
    )
    if "feed.xml" not in text:
        text = text.replace(head_marker, head_add)
    old = "<p>All releases are authored by R. J. Reyes and linked to their archival Zenodo records.</p>"
    new = (
        old
        + '\n          <p><a class="text-link" href="publications/">'
        + "Open machine-readable publication archive "
        + '<span aria-hidden="true">→</span></a></p>'
    )
    if "Open machine-readable publication archive" not in text:
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")


def main() -> None:
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    pubs = data["publications"]
    PUB_DIR.mkdir(parents=True, exist_ok=True)

    for pub in pubs:
        (PUB_DIR / f"{pub['slug']}.html").write_text(paper_page(pub), encoding="utf-8")
    (PUB_DIR / "paper.css").write_text(PAPER_CSS, encoding="utf-8")
    (PUB_DIR / "index.html").write_text(publications_index(pubs), encoding="utf-8")

    (ROOT / "publications.bib").write_text(build_bibtex(pubs), encoding="utf-8")
    (ROOT / "publications.ris").write_text(build_ris(pubs), encoding="utf-8")
    (ROOT / "publications.json").write_text(build_json(pubs), encoding="utf-8")
    (ROOT / "sitemap.xml").write_text(build_sitemap(pubs), encoding="utf-8")
    (ROOT / "feed.xml").write_text(build_feed(pubs), encoding="utf-8")
    (ROOT / "llms.txt").write_text(build_llms(), encoding="utf-8")
    (ROOT / "CITATION.cff").write_text(build_cff(), encoding="utf-8")
    (ROOT / "codemeta.json").write_text(build_codemeta(), encoding="utf-8")

    patch_home()

    expected = len(pubs)
    actual = len(list(PUB_DIR.glob("*.html"))) - 1
    if actual != expected:
        raise RuntimeError(f"Expected {expected} paper pages, generated {actual}.")
    print(f"Generated {actual} scholarly publication pages.")


if __name__ == "__main__":
    main()
