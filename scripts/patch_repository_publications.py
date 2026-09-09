#!/usr/bin/env python3
"""Keep current repository-backed and newly archived studies in the publication index.

The main scholarly builder generates DOI/Zenodo-backed landing pages from
``data/publications.json``. New empirical studies can be public and citable from
source repositories before an archival DOI is minted. This patch keeps those
studies visible in ``publications/index.html`` and also makes newly minted Zenodo
records visible immediately while their richer canonical metadata is being folded
into the main publication registry.
"""
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "publications" / "index.html"

STUDIES = [
    {
        "title": "Log-Periodic Structure in the GWTC Chirp-Mass Distribution: Frozen Holdout Evidence and a Prospective Prediction",
        "date": "August 26, 2026",
        "year": "2026",
        "category": "Gravitational-wave open-data analysis",
        "status": "Open-data analysis",
        "href": "https://github.com/rickyjreyes/GWTC",
        "source": "github.com/rickyjreyes/GWTC",
        "search": "log-periodic structure in the gwtc chirp-mass distribution frozen holdout evidence and a prospective prediction gravitational-wave open-data analysis open-data analysis gwtc chirp mass",
        "archived": False,
    },
    {
        "title": "Log-Periodic Dimuon Residual in CMS Open Data: Cross-Period Replication and a Prospective Phase-Locked Holdout",
        "date": "August 31, 2026",
        "year": "2026",
        "category": "Collider open-data analysis",
        "status": "Open-data analysis",
        "href": "https://github.com/rickyjreyes/wct-cms",
        "source": "github.com/rickyjreyes/wct-cms",
        "search": "log-periodic dimuon residual in cms open data cross-period replication and a prospective phase-locked holdout collider open-data analysis open-data analysis cms dimuon",
        "archived": False,
    },
    {
        "title": "Exact Scale-Winding Bijection Between Discrete Scale Invariance and WCT Active-Domain Phase Closure",
        "date": "September 8, 2026",
        "year": "2026",
        "category": "Primary WCT foundation",
        "status": "Mathematical derivation",
        "href": "https://zenodo.org/records/22665914",
        "source": "10.5281/zenodo.22665914",
        "search": "exact scale-winding bijection discrete scale invariance dsi wct active-domain phase closure log-periodicity logarithmic coordinates scale invariance winding number mathematical derivation",
        "archived": True,
    },
    {
        "title": "Filament Reduction and Phase Quantization of Curvature-Locked Modes",
        "date": "September 8, 2026",
        "year": "2026",
        "category": "Spectral dynamics",
        "status": "Mathematical derivation",
        "href": "https://zenodo.org/records/22666758",
        "source": "10.5281/zenodo.22666758",
        "search": "filament reduction phase quantization curvature-locked modes wave confinement theory wct filament localization winding spectrum phase closure mathematical derivation",
        "archived": True,
    },
    {
        "title": "Geometric Turbulence in Wave Confinement Theory: Phase-Locked Curvature Filaments and the Soliton-Gas Regime",
        "date": "September 8, 2026",
        "year": "2026",
        "category": "Spectral dynamics",
        "status": "Numerical study",
        "href": "https://zenodo.org/records/22666935",
        "source": "10.5281/zenodo.22666935",
        "search": "geometric turbulence wave confinement theory wct phase-locked curvature filaments soliton-gas regime nonlinear wavefields narrow-band spectral forcing filament localization numerical study",
        "archived": True,
    },
]


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def render_article(study: dict[str, object], number: int) -> str:
    return (
        f'<article class="pub-index-item" data-category="{esc(str(study["category"]))}" '
        f'data-status="{esc(str(study["status"]))}" data-year="{study["year"]}" '
        f'data-search="{esc(str(study["search"]))}">'
        f'<span>{number:02d}</span><div><p class="pub-index-meta">'
        f'<span class="pub-index-cat">{esc(str(study["category"]))}</span>'
        f'<span class="pub-index-date">{esc(str(study["date"]))}</span>'
        f'<span class="pub-status">{esc(str(study["status"]))}</span></p>'
        f'<h2><a href="{esc(str(study["href"]))}">{esc(str(study["title"]))}</a></h2>'
        f'<code>{esc(str(study["source"]))}</code></div></article>'
    )


def main() -> None:
    text = INDEX.read_text(encoding="utf-8")

    # Add the gravitational-wave category to the archive filter when needed.
    category = str(STUDIES[0]["category"])
    option = f'<option value="{esc(category)}">{esc(category)}</option>'
    if option not in text:
        marker = '<option value="Mass and geometry">Mass and geometry</option>'
        if marker in text:
            text = text.replace(marker, option + marker, 1)

    base_count = text.count('class="pub-index-item"')
    additions: list[str] = []
    for study in STUDIES:
        if str(study["title"]) in text:
            continue
        additions.append(render_article(study, base_count + len(additions) + 1))

    if additions:
        empty_marker = '<p class="pub-empty" data-pub-empty hidden>'
        insertion = "\n".join(additions) + "\n"
        text = text.replace(empty_marker, insertion + empty_marker, 1)

    total = text.count('class="pub-index-item"')
    repository_backed = sum(1 for study in STUDIES if not bool(study.get("archived")))
    archived = max(0, total - repository_backed)

    description = (
        f'<p>The complete, chronological archive of {total} research releases. '
        f'{archived} are DOI-archived releases; {repository_backed} current repository-backed '
        'open-data studies link directly to their source repositories while '
        'archival identifiers are pending.</p>'
    )
    text = re.sub(
        r'<p>The complete, chronological archive of \d+ (?:archival|research) releases\.[^<]*</p>',
        description,
        text,
        count=1,
    )
    text = re.sub(
        r'Showing all \d+ releases\.',
        f'Showing all {total} releases.',
        text,
        count=1,
    )
    text = re.sub(
        r'<span>\d+ (?:archival|research) releases</span>',
        f'<span>{total} research releases</span>',
        text,
        count=1,
    )

    INDEX.write_text(text, encoding="utf-8")
    print(
        f"Publication index includes {total} releases "
        f"({archived} DOI-archived; {repository_backed} repository-backed studies)."
    )


if __name__ == "__main__":
    main()
