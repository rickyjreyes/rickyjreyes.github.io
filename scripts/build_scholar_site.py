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


def paper_page(pub: dict, titles: dict[str, str]) -> str:
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
        "creativeWorkStatus": pub.get("status", "Preprint"),
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

    status = pub.get("status", "Preprint")

    # Plain-language overview ------------------------------------------------
    overview_blocks = []
    if pub.get("question"):
        overview_blocks.append(
            f'<div class="overview-block"><h3>Research question</h3>'
            f'<p>{esc(pub["question"])}</p></div>'
        )
    if pub.get("contributions"):
        items = "".join(f"<li>{esc(c)}</li>" for c in pub["contributions"])
        overview_blocks.append(
            f'<div class="overview-block"><h3>Main contribution</h3>'
            f'<ul class="overview-list">{items}</ul></div>'
        )
    if pub.get("evidence"):
        tags = "".join(f'<span class="evidence-tag">{esc(e)}</span>' for e in pub["evidence"])
        overview_blocks.append(
            f'<div class="overview-block"><h3>Evidence type</h3>'
            f'<div class="evidence-tags">{tags}</div></div>'
        )
    if pub.get("limitations"):
        overview_blocks.append(
            f'<div class="overview-block"><h3>Current limitations</h3>'
            f'<p>{esc(pub["limitations"])}</p></div>'
        )
    overview_html = ""
    if overview_blocks:
        overview_html = (
            '<section class="paper-section"><h2>Plain-language overview</h2>'
            '<div class="overview-grid">' + "".join(overview_blocks) + "</div></section>"
        )

    # Research assets -------------------------------------------------------
    asset_rows = [
        '<div><dt>Read &amp; download</dt>'
        f'<dd><a href="{zenodo}">Zenodo record (manuscript and files)</a></dd></div>',
        '<div><dt>Research program hub</dt>'
        '<dd><a href="https://github.com/rickyjreyes/geometry_of_resonance">'
        'geometry_of_resonance — equations, manuscripts, and simulations</a></dd></div>',
    ]
    if pub.get("repo"):
        repo = pub["repo"]
        repo_name = repo.rstrip("/").rsplit("/", 1)[-1]
        asset_rows.insert(
            1,
            f'<div><dt>Code &amp; data</dt>'
            f'<dd><a href="{repo}">{esc(repo_name)} — source code and data</a></dd></div>',
        )
    assets_html = (
        '<section class="paper-section"><h2>Research assets</h2>'
        '<dl class="asset-list">' + "".join(asset_rows) + "</dl></section>"
    )

    # Related works ---------------------------------------------------------
    related_html = ""
    related = pub.get("related") or []
    if related:
        rows = []
        for rel in related:
            t = titles.get(rel["slug"])
            if not t:
                continue
            rows.append(
                f'<li><span class="rel-tag">{esc(rel["relation"])}</span>'
                f'<a href="{esc(rel["slug"])}.html">{esc(t)}</a></li>'
            )
        if rows:
            related_html = (
                '<section class="paper-section"><h2>Related works</h2>'
                '<ul class="related-list">' + "".join(rows) + "</ul>"
                '<p class="related-note">Relationships reflect the research dependency structure '
                "of the program, not shared keywords.</p></section>"
            )

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
<p class="paper-kicker">Preprint · Release {pub['n']:02d}</p>
<h1 class="citation_title">{esc(pub['title'])}</h1>
<p class="citation_author">{AUTHOR}</p>
<p class="paper-meta">Independent Researcher · {pub['display_date']} · <a href="{doi_url}">{pub['doi']}</a></p>
<div class="paper-tags">
<span class="paper-chip chip-category"><span class="chip-label">Category</span>{esc(pub['category'])}</span>
<span class="paper-chip chip-status"><span class="chip-label">Research status</span>{esc(status)}</span>
</div>
</header>
<section class="paper-section paper-actions-section" aria-label="Primary actions">
<div class="paper-actions">
<a class="button primary" href="{zenodo}">Read on Zenodo</a>
<a class="button secondary" href="{doi_url}">Open DOI</a>
<button class="button secondary" type="button" data-copy-citation aria-label="Copy the recommended citation to the clipboard">Copy citation</button>
<a class="button secondary" href="#cite">View citation</a>
</div>
</section>
<section class="paper-section"><h2>Abstract</h2><p>{esc(pub['summary'])}</p></section>
{overview_html}
{assets_html}
{related_html}
<section class="paper-section" id="cite"><h2>Recommended citation</h2>
<p class="formatted-citation" data-citation-text>{esc(citation)}</p>
<div class="paper-actions">
<button class="button primary" type="button" data-copy-citation aria-label="Copy the recommended citation to the clipboard">Copy citation</button>
<a class="button secondary" href="../publications.bib">BibTeX</a>
<a class="button secondary" href="../publications.ris">RIS</a>
<a class="button secondary" href="{doi_url}">DOI resolver</a>
<a class="button secondary" href="https://orcid.org/{ORCID}">ORCID author</a>
</div>
<p class="copy-feedback" role="status" aria-live="polite" data-copy-feedback hidden>Citation copied to clipboard.</p></section>
<section class="paper-section machine-note"><h2>Machine-readable identifiers</h2><dl>
<div><dt>DOI</dt><dd><a href="{doi_url}">{pub['doi']}</a></dd></div>
<div><dt>Zenodo</dt><dd><a href="{zenodo}">{zenodo}</a></dd></div>
<div><dt>Local metadata</dt><dd><a href="{url}">{url}</a></dd></div>
<div><dt>Author</dt><dd><a href="https://orcid.org/{ORCID}">ORCID {ORCID}</a></dd></div>
</dl>
<p class="machine-disclaimer">This landing page provides accessible summaries and citation metadata for an archival preprint. The authoritative manuscript and downloadable files are maintained on the Zenodo DOI record. Wave Confinement Theory is an evolving independent framework; claims should be evaluated according to the derivations, simulations, experiments, data analyses, assumptions, and limitations stated in the paper itself.</p>
</section>
</article></main>
<footer class="paper-footer"><div class="section-shell"><a href="./">← Publication archive</a><span>Wave Confinement Theory research program</span></div></footer>
<script>
(function(){{
  var text = (document.querySelector('[data-citation-text]') || {{}}).textContent || '';
  var feedback = document.querySelector('[data-copy-feedback]');
  document.querySelectorAll('[data-copy-citation]').forEach(function(btn){{
    btn.addEventListener('click', function(){{
      var done = function(){{
        if (feedback) {{ feedback.hidden = false; }}
        var prev = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function(){{ btn.textContent = prev; if (feedback) feedback.hidden = true; }}, 2400);
      }};
      if (navigator.clipboard && navigator.clipboard.writeText) {{
        navigator.clipboard.writeText(text.trim()).then(done, done);
      }} else {{ done(); }}
    }});
  }});
}})();
</script>
</body></html>
"""


PAPER_CSS = """
.paper-nav{display:flex;gap:22px}.paper-nav a{color:var(--muted);font-size:.84rem;font-weight:700;text-decoration:none}
.paper-shell{width:min(calc(100% - 40px),920px);margin:auto;padding:90px 0 120px}
.paper-header{padding-bottom:40px;border-bottom:1px solid var(--line)}
.paper-kicker{margin:0 0 20px;color:var(--accent);font-size:.74rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
.paper-header h1{margin:0;font:500 clamp(2.4rem,5.4vw,4.6rem)/1.06 Georgia,serif;letter-spacing:-.034em}
.citation_author{margin:28px 0 4px;font-size:1.25rem;font-weight:750}.paper-meta{margin:0;color:var(--muted)}
.paper-tags{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
.paper-chip{display:inline-flex;align-items:center;gap:8px;padding:8px 13px;border:1px solid var(--line-strong);border-radius:999px;font-size:.82rem;font-weight:650;color:var(--text)}
.paper-chip .chip-label{color:var(--muted-2);font-size:.62rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase}
.chip-status{border-color:rgba(103,212,255,.5);background:rgba(103,212,255,.07)}
.paper-section{padding:42px 0;border-bottom:1px solid var(--line)}.paper-section h2{margin:0 0 18px;font:500 1.65rem/1.2 Georgia,serif}
.paper-section>p{color:var(--muted);font-size:1.03rem;max-width:70ch}
.paper-actions-section{padding-top:30px}
.paper-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:0}.paper-section .paper-actions{margin-top:24px}
button.button{cursor:pointer;font-family:inherit}
.overview-grid{display:grid;gap:26px}
.overview-block h3{margin:0 0 8px;font-size:.74rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--accent)}
.overview-block p{margin:0;color:var(--muted);font-size:1.02rem;max-width:70ch}
.overview-list{margin:0;padding-left:1.1em;color:var(--muted);font-size:1.02rem;max-width:70ch}
.overview-list li{margin:0 0 7px}
.evidence-tags{display:flex;flex-wrap:wrap;gap:8px}
.evidence-tag{padding:6px 11px;border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.02);font-size:.8rem;font-weight:650;color:var(--text)}
.asset-list{margin:0}.asset-list div{display:grid;grid-template-columns:160px 1fr;gap:20px;padding:14px 0;border-top:1px solid var(--line)}
.asset-list div:first-child{border-top:0;padding-top:0}
.asset-list dt{color:var(--muted-2);font-size:.72rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
.asset-list dd{margin:0;color:var(--muted)}.asset-list dd a{color:var(--text)}
.related-list{margin:0 0 14px;padding:0;list-style:none;display:grid;gap:12px}
.related-list li{display:flex;flex-wrap:wrap;align-items:baseline;gap:12px}
.rel-tag{flex:none;padding:4px 10px;border:1px solid rgba(139,124,255,.4);border-radius:999px;background:rgba(139,124,255,.08);font-size:.66rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--text)}
.related-list a{color:var(--text);font-weight:600}.related-note{margin:0;color:var(--muted-2);font-size:.82rem}
.formatted-citation{padding:20px;border-left:2px solid var(--accent);background:rgba(103,212,255,.045);overflow-wrap:anywhere}
.copy-feedback{margin:14px 0 0;color:var(--accent-3);font-size:.85rem;font-weight:650}
.machine-note dl{margin:0}.machine-note dl div{display:grid;grid-template-columns:120px 1fr;gap:20px;padding:12px 0;border-top:1px solid var(--line)}
.machine-note dt{color:var(--muted-2);font-size:.72rem;font-weight:800;text-transform:uppercase}.machine-note dd{margin:0;color:var(--muted);overflow-wrap:anywhere}
.machine-disclaimer{margin:24px 0 0;color:var(--muted-2);font-size:.84rem;max-width:75ch}
.paper-footer{padding:28px 0;border-top:1px solid var(--line);background:var(--bg-deep)}.paper-footer .section-shell{display:flex;justify-content:space-between;gap:20px;color:var(--muted-2);font-size:.78rem}
.paper-footer a{text-decoration:none}
@media(max-width:700px){.paper-nav{gap:12px}.paper-shell{width:min(calc(100% - 28px),920px);padding-top:60px}.paper-header h1{font-size:clamp(2.1rem,9vw,3.4rem)}
.asset-list div{grid-template-columns:1fr;gap:4px}.machine-note dl div{grid-template-columns:1fr;gap:4px}.paper-footer .section-shell{flex-direction:column}}
""".strip() + "\n"


PUB_INDEX_CSS = """
.pub-index-head{padding-bottom:42px;border-bottom:1px solid var(--line)}
.pub-index-head h1{margin:0;font:500 clamp(3rem,7vw,6rem)/1 Georgia,serif;letter-spacing:-.04em}
.pub-index-head p{max-width:760px;color:var(--muted)}
.export-links{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
.pub-controls{margin-top:46px;display:grid;gap:18px}
.pub-search label,.pub-facet legend{display:block;margin:0 0 8px;color:var(--muted-2);font-size:.68rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase}
.pub-search input{width:100%;padding:13px 15px;color:var(--text);border:1px solid var(--line-strong);border-radius:10px;background:rgba(255,255,255,.025)}
.pub-search input::placeholder{color:var(--muted-2)}
.pub-facets{display:flex;flex-wrap:wrap;gap:26px}
.pub-facet{margin:0;padding:0;border:0;min-width:200px;flex:1 1 220px}
.pub-facet select{width:100%;padding:11px 13px;color:var(--text);border:1px solid var(--line-strong);border-radius:10px;background:rgba(255,255,255,.025);font:inherit}
.year-buttons{display:flex;flex-wrap:wrap;gap:8px}
.year-buttons button{padding:9px 14px;color:var(--muted);border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.018);cursor:pointer;font-size:.78rem;font-weight:700}
.year-buttons button[aria-pressed=true],.year-buttons button:hover{color:var(--text);border-color:rgba(103,212,255,.45);background:rgba(103,212,255,.08)}
.pub-count{margin:30px 0 0;color:var(--muted-2);font-size:.82rem}
.pub-index-list{border-top:1px solid var(--line);margin-top:16px}
.pub-index-item{display:grid;grid-template-columns:64px 1fr;gap:20px;padding:24px 0;border-bottom:1px solid var(--line)}
.pub-index-item[hidden]{display:none}
.pub-index-item>span{color:var(--muted-2);font-family:Georgia,serif}
.pub-index-meta{margin:0 0 9px;display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px}
.pub-index-cat{color:var(--accent);font-size:.69rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.pub-index-date{color:var(--muted-2);font-size:.74rem}
.pub-status{padding:4px 10px;border:1px solid rgba(103,212,255,.4);border-radius:999px;background:rgba(103,212,255,.07);font-size:.66rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--text)}
.pub-index-item h2{margin:0;font:500 clamp(1.15rem,2.4vw,1.55rem)/1.25 Georgia,serif}
.pub-index-item h2 a{text-decoration:none}
.pub-index-item code{display:inline-block;margin-top:10px;color:var(--muted-2);font-size:.72rem}
.pub-empty{padding:40px 0;color:var(--muted)}
@media(max-width:600px){.pub-index-item{grid-template-columns:40px 1fr}}
""".strip()


def publications_index(pubs: list[dict]) -> str:
    categories = sorted({p["category"] for p in pubs})
    statuses = sorted({p.get("status", "Preprint") for p in pubs})
    years = sorted({p["date"][:4] for p in pubs})

    def search_blob(p: dict) -> str:
        return " ".join([p["title"], p["category"], p.get("status", ""), p["doi"]]).lower()

    items = "\n".join(
        f'<article class="pub-index-item" data-category="{esc(p["category"])}" '
        f'data-status="{esc(p.get("status", "Preprint"))}" data-year="{p["date"][:4]}" '
        f'data-search="{esc(search_blob(p))}">'
        f'<span>{p["n"]:02d}</span><div>'
        f'<p class="pub-index-meta">'
        f'<span class="pub-index-cat">{esc(p["category"])}</span>'
        f'<span class="pub-index-date">{esc(p["display_date"])}</span>'
        f'<span class="pub-status">{esc(p.get("status", "Preprint"))}</span></p>'
        f'<h2><a href="{p["slug"]}.html">{esc(p["title"])}</a></h2>'
        f'<code>{p["doi"]}</code></div></article>'
        for p in pubs
    )

    cat_options = "".join(
        f'<option value="{esc(c)}">{esc(c)}</option>' for c in categories
    )
    status_options = "".join(
        f'<option value="{esc(s)}">{esc(s)}</option>' for s in statuses
    )
    year_btns = "".join(
        f'<button type="button" data-year="{esc(y)}" aria-pressed="false">{esc(y)}</button>'
        for y in years
    )

    return f"""<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#07111f">
<title>Publications | Richard J. Reyes</title>
<meta name="description" content="Searchable, machine-readable publication archive for the Wave Confinement Theory research program, with research-status labels, DOIs, and citation exports.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="{SITE}publications/">
<link rel="author" href="https://orcid.org/{ORCID}">
<link rel="alternate" type="application/atom+xml" href="{SITE}feed.xml">
<link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="paper.css">
<style>{PUB_INDEX_CSS}</style>
</head><body>
<a class="skip-link" href="#archive">Skip to publication list</a>
<header class="site-header"><div class="nav-wrap"><a class="wordmark" href="../"><span class="mark" aria-hidden="true">R</span><span>{AUTHOR}</span></a><nav class="paper-nav" aria-label="Publication navigation"><a href="../#start">Start here</a><a href="../#about">About</a></nav></div></header>
<main class="paper-shell"><header class="pub-index-head"><p class="paper-kicker">Scholarly archive</p><h1>Publications</h1>
<p>The complete, chronological archive of {len(pubs)} archival releases. Each release has its own landing page with a plain-language overview, a research-status label, DOI links, and Highwire Press, Dublin Core, and Schema.org ScholarlyArticle metadata.</p>
<div class="export-links"><a class="button secondary" href="../publications.bib">BibTeX</a><a class="button secondary" href="../publications.ris">RIS</a><a class="button secondary" href="../publications.json">JSON</a><a class="button secondary" href="../feed.xml">Atom feed</a></div></header>
<form class="pub-controls" role="search" aria-label="Filter publications" onsubmit="return false">
<div class="pub-search"><label for="pub-q">Search titles, categories, and status</label>
<input type="search" id="pub-q" data-search-input placeholder="e.g. Koide, open data, foundational proposal, 10.5281…" autocomplete="off"></div>
<div class="pub-facets">
<fieldset class="pub-facet"><legend><label for="pub-cat">Category</label></legend>
<select id="pub-cat" data-filter-category><option value="">All categories</option>{cat_options}</select></fieldset>
<fieldset class="pub-facet"><legend><label for="pub-status">Research status</label></legend>
<select id="pub-status" data-filter-status><option value="">All statuses</option>{status_options}</select></fieldset>
<fieldset class="pub-facet"><legend>Publication year</legend>
<div class="year-buttons" data-year-buttons><button type="button" data-year="" aria-pressed="true">All</button>{year_btns}</div></fieldset>
</div></form>
<p class="pub-count" role="status" aria-live="polite" data-pub-count>Showing all {len(pubs)} releases.</p>
<section class="pub-index-list" id="archive">{items}
<p class="pub-empty" data-pub-empty hidden>No publications match the current filters. <button type="button" class="button secondary" data-pub-reset>Clear filters</button></p></section></main>
<footer class="paper-footer"><div class="section-shell"><a href="../">← Research home</a><span>{len(pubs)} archival releases</span></div></footer>
<script>
(function(){{
  var items=[].slice.call(document.querySelectorAll('.pub-index-item'));
  var q=document.querySelector('[data-search-input]');
  var cat=document.querySelector('[data-filter-category]');
  var status=document.querySelector('[data-filter-status]');
  var yearWrap=document.querySelector('[data-year-buttons]');
  var count=document.querySelector('[data-pub-count]');
  var empty=document.querySelector('[data-pub-empty]');
  var total=items.length;
  var year='';
  function apply(){{
    var term=(q.value||'').trim().toLowerCase();
    var c=cat.value, s=status.value, shown=0;
    items.forEach(function(it){{
      var ok=(!term||it.dataset.search.indexOf(term)>-1)
        &&(!c||it.dataset.category===c)
        &&(!s||it.dataset.status===s)
        &&(!year||it.dataset.year===year);
      it.hidden=!ok; if(ok)shown++;
    }});
    if(empty)empty.hidden=shown!==0;
    if(count)count.textContent=shown===total?('Showing all '+total+' releases.'):('Showing '+shown+' of '+total+' releases.');
  }}
  q&&q.addEventListener('input',apply);
  cat&&cat.addEventListener('change',apply);
  status&&status.addEventListener('change',apply);
  yearWrap&&yearWrap.addEventListener('click',function(e){{
    var b=e.target.closest('button[data-year]'); if(!b)return;
    year=b.dataset.year;
    yearWrap.querySelectorAll('button').forEach(function(x){{x.setAttribute('aria-pressed',String(x===b));}});
    apply();
  }});
  var reset=document.querySelector('[data-pub-reset]');
  reset&&reset.addEventListener('click',function(){{
    q.value='';cat.value='';status.value='';year='';
    yearWrap.querySelectorAll('button').forEach(function(x){{x.setAttribute('aria-pressed',String(x.dataset.year===''));}});
    apply();
  }});
}})();
</script>
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
                "status": p.get("status", "Preprint"),
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

    titles = {p["slug"]: p["title"] for p in pubs}
    for pub in pubs:
        (PUB_DIR / f"{pub['slug']}.html").write_text(paper_page(pub, titles), encoding="utf-8")
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
