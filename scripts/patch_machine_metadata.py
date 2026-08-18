#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://rickyjreyes.github.io/"
TRACEABILITY_PATH = ROOT / "data" / "publication_traceability.json"
PRIORITY_PATH = ROOT / "priority" / "priority.json"
PRIORITY_PAGE_URL = f"{SITE}priority/"
PRIORITY_JSON_URL = f"{SITE}priority/priority.json"
TRACEABILITY_URL = f"{SITE}data/publication_traceability.json"
RESEARCH_CORPUS_URL = f"{SITE}research-corpus/"


def add_link(text: str, href: str, title: str) -> str:
    if f'href="{href}"' in text:
        return text
    tag = f'<link rel="alternate" type="application/json" title="{title}" href="{href}">'
    marker = '<link rel="author" href="https://orcid.org/0009-0005-5975-8718">'
    if marker in text:
        return text.replace(marker, marker + "\n" + tag, 1)
    return text.replace("</head>", tag + "\n</head>", 1)


def add_dc_relation(text: str, url: str) -> str:
    tag = f'<meta name="DC.relation" content="{url}">'
    if tag in text:
        return text
    marker = '<meta name="DC.language" content="en">'
    if marker in text:
        return text.replace(marker, marker + "\n" + tag, 1)
    return text.replace("</head>", tag + "\n</head>", 1)


def replace_jsonld(text: str, predicate, transform) -> str:
    pattern = re.compile(r'<script type="application/ld\+json">(.*?)</script>', flags=re.S)
    for match in list(pattern.finditer(text)):
        try:
            data = json.loads(match.group(1))
        except json.JSONDecodeError:
            continue
        if not predicate(data):
            continue
        data = transform(data)
        replacement = '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + '</script>'
        return text[:match.start()] + replacement + text[match.end():]
    return text


def patch_publications() -> None:
    trace_doc = json.loads(TRACEABILITY_PATH.read_text(encoding="utf-8"))
    trace_by_slug = trace_doc.get("publications", {})
    priority_doc = json.loads(PRIORITY_PATH.read_text(encoding="utf-8"))

    priority_by_doi: dict[str, list[dict[str, Any]]] = {}
    for claim in priority_doc.get("claims", []):
        doi = claim.get("doi")
        if doi:
            priority_by_doi.setdefault(doi, []).append(claim)

    pages = [p for p in (ROOT / "publications").glob("*.html") if p.name != "index.html"]
    missing_trace = []

    for path in pages:
        slug = path.stem
        trace_item = trace_by_slug.get(slug)
        if trace_item is None:
            missing_trace.append(slug)
            continue

        text = path.read_text(encoding="utf-8")
        text = add_link(text, "../priority/priority.json", "Claim priority metadata")
        text = add_link(text, "../data/publication_traceability.json", "Publication traceability metadata")
        text = add_dc_relation(text, PRIORITY_JSON_URL)
        text = add_dc_relation(text, TRACEABILITY_URL)

        doi_match = re.search(r'<meta name="citation_doi" content="([^"]+)">', text)
        doi = doi_match.group(1) if doi_match else ""
        priority_claims = priority_by_doi.get(doi, [])
        page_url = f"{SITE}publications/{slug}.html"

        def transform(data: dict[str, Any]) -> dict[str, Any]:
            data["@id"] = f"{page_url}#article"
            data["mainEntityOfPage"] = {"@type": "WebPage", "@id": page_url}
            data["subjectOf"] = [
                {
                    "@type": "Dataset",
                    "@id": f"{PRIORITY_PAGE_URL}#dataset",
                    "name": "Richard J. Reyes Research Priority Registry",
                    "url": PRIORITY_PAGE_URL,
                    "distribution": {
                        "@type": "DataDownload",
                        "encodingFormat": "application/json",
                        "contentUrl": PRIORITY_JSON_URL,
                    },
                },
                {
                    "@type": "Dataset",
                    "@id": TRACEABILITY_URL,
                    "name": "Richard J. Reyes Publication Traceability Registry",
                    "distribution": {
                        "@type": "DataDownload",
                        "encodingFormat": "application/json",
                        "contentUrl": TRACEABILITY_URL,
                    },
                },
            ]

            about: list[dict[str, Any]] = []
            corpus_set = {
                "@type": "DefinedTermSet",
                "@id": RESEARCH_CORPUS_URL,
                "name": "WCT Research Corpus",
            }
            for claim_id in trace_item.get("claim_ids", []):
                about.append(
                    {
                        "@type": "DefinedTerm",
                        "@id": f"{RESEARCH_CORPUS_URL}#{claim_id}",
                        "name": claim_id,
                        "termCode": claim_id,
                        "inDefinedTermSet": corpus_set,
                    }
                )
            for claim in priority_claims:
                claim_id = claim.get("id")
                if not claim_id:
                    continue
                about.append(
                    {
                        "@type": "DefinedTerm",
                        "@id": f"{PRIORITY_PAGE_URL}#{claim_id}",
                        "name": claim_id,
                        "termCode": claim_id,
                        "description": claim.get("claim", ""),
                        "inDefinedTermSet": {
                            "@type": "DefinedTermSet",
                            "@id": f"{PRIORITY_PAGE_URL}#dataset",
                            "name": "Richard J. Reyes Research Priority Registry",
                        },
                    }
                )
            if about:
                data["about"] = about
            return data

        text = replace_jsonld(text, lambda d: d.get("@type") == "ScholarlyArticle", transform)
        path.write_text(text, encoding="utf-8")

    extra_trace = sorted(set(trace_by_slug) - {p.stem for p in pages})
    if missing_trace or extra_trace:
        raise RuntimeError(f"Publication metadata mismatch: missing={missing_trace}; extra={extra_trace}")


def patch_priority_page() -> None:
    path = ROOT / "priority" / "index.html"
    if not path.exists():
        return

    text = path.read_text(encoding="utf-8")
    text = add_link(text, "priority.json", "Machine-readable priority registry")
    text = add_link(text, "external-convergence.json", "External convergence audit")
    text = add_link(text, "../patents.json", "Patent portfolio metadata")
    text = add_link(text, "../data/publication_traceability.json", "Publication traceability metadata")

    def transform(_: dict[str, Any]) -> dict[str, Any]:
        author = {
            "@type": "Person",
            "name": "Richard J. Reyes",
            "identifier": "https://orcid.org/0009-0005-5975-8718",
            "sameAs": [
                "https://orcid.org/0009-0005-5975-8718",
                "https://github.com/rickyjreyes",
            ],
        }
        page_node = {
            "@type": "CollectionPage",
            "@id": f"{PRIORITY_PAGE_URL}#page",
            "name": "Richard J. Reyes Intellectual Property, Priority and Provenance Registry",
            "description": "Human-auditable and machine-readable registry of documented scholarly origin, public disclosure chronology, claimed patent-family priority, attribution anchors, later external technical overlap, and prior-art controls.",
            "url": PRIORITY_PAGE_URL,
            "dateModified": date.today().isoformat(),
            "author": author,
            "about": [
                "Wave Confinement Theory",
                "technical provenance",
                "scholarly priority",
                "patent-family priority",
                "WaveLock",
                "Phase-Flux Field",
            ],
            "isPartOf": {"@type": "WebSite", "url": SITE},
            "mainEntity": {"@id": f"{PRIORITY_PAGE_URL}#dataset"},
        }
        dataset_node = {
            "@type": "Dataset",
            "@id": f"{PRIORITY_PAGE_URL}#dataset",
            "name": "Richard J. Reyes Research Priority Registry",
            "description": "Claim-level chronology linking dated public research disclosures and filed patent-family chronology to canonical identifiers, DOIs, provenance notes, later comparison cases, and prior-art controls.",
            "url": PRIORITY_PAGE_URL,
            "dateModified": date.today().isoformat(),
            "creator": author,
            "isAccessibleForFree": True,
            "distribution": [
                {
                    "@type": "DataDownload",
                    "encodingFormat": "application/json",
                    "contentUrl": PRIORITY_JSON_URL,
                },
                {
                    "@type": "DataDownload",
                    "encodingFormat": "application/json",
                    "contentUrl": f"{SITE}priority/external-convergence.json",
                },
            ],
            "subjectOf": {
                "@type": "Dataset",
                "@id": TRACEABILITY_URL,
                "name": "Richard J. Reyes Publication Traceability Registry",
            },
        }
        return {"@context": "https://schema.org", "@graph": [page_node, dataset_node]}

    text = replace_jsonld(
        text,
        lambda d: d.get("@type") == "CollectionPage" or "@graph" in d,
        transform,
    )
    path.write_text(text, encoding="utf-8")


def patch_sitemap() -> None:
    path = ROOT / "sitemap.xml"
    text = path.read_text(encoding="utf-8")
    today = date.today().isoformat()
    resources = [
        "priority/priority.json",
        "priority/external-convergence.json",
        "data/publication_traceability.json",
        "publications.json",
        "patents.json",
        "CITATION.cff",
        "publications.bib",
        "publications.ris",
    ]
    additions = []
    for suffix in resources:
        url = SITE + suffix
        if f"<loc>{url}</loc>" not in text:
            additions.append(f"  <url><loc>{url}</loc><lastmod>{today}</lastmod></url>")
    if additions:
        text = text.replace("</urlset>", "\n".join(additions) + "\n</urlset>")
    path.write_text(text, encoding="utf-8")


def main() -> None:
    patch_publications()
    patch_priority_page()
    patch_sitemap()
    print("Patched publication-to-priority metadata, priority Dataset JSON-LD, and machine-readable discovery links.")


if __name__ == "__main__":
    main()
