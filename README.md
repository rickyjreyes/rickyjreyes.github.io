# Richard J. Reyes — Research Site

Source for [rickyjreyes.github.io](https://rickyjreyes.github.io/), the public research portal for Richard J. Reyes's work on Wave Confinement Theory (WCT) and related research.

## Purpose

The site is optimized for readability, access, and research navigation. A new reader can quickly answer:

- Who is Richard J. Reyes, and what is Wave Confinement Theory?
- Which paper should I read first? (a four-paper "Start here" path)
- What does each paper ask, claim, and rely on for evidence?
- What is established, preliminary, proposed, or unresolved?
- How can the work be cited or reproduced?

Three destinations are kept distinct throughout:

- **This website** — accessible summaries, research-status labels, and publication discovery.
- **GitHub research hub** ([`geometry_of_resonance`](https://github.com/rickyjreyes/geometry_of_resonance)) — equations, manuscripts, simulations, and the technical archive.
- **Zenodo** — permanent DOI records and downloadable releases.

## Structure

- `index.html` — homepage: identity, the WCT idea, the four-paper reading path, research branches, latest releases, and the archive link.
- `publications/` — generated per-publication landing pages plus the searchable archive (`publications/index.html`).
- `data/publications.json` — the single source of truth for every publication (title, date, DOI, category, research-status label, plain-language overview, evidence type, limitations, assets, and related works).
- `scripts/build_scholar_site.py` — generates the publication pages, archive index, and all machine-readable exports.
- `styles.css`, `publications/paper.css` — responsive visual design.
- `script.js` — mobile navigation and the scrolled-header state.
- `404.html` — fallback page.
- `robots.txt`, `sitemap.xml`, `feed.xml`, `llms.txt` — indexing and discovery support.

## Generated outputs

Running the build script regenerates these from `data/publications.json`:

- `publications/*.html` — one machine-readable landing page per release, with visible citation data, a research-status label, a plain-language overview, research assets, related works, Highwire Press metadata, Dublin Core metadata, and Schema.org `ScholarlyArticle` markup.
- `publications/index.html` — the complete chronological archive with search, category/status/year filters, and DOI display.
- `publications.bib`, `publications.ris`, `publications.json` — BibTeX, RIS, and JSON exports.
- `sitemap.xml`, `feed.xml`, `llms.txt`, `CITATION.cff`, `codemeta.json`.

## Building locally

```sh
python3 scripts/build_scholar_site.py
```

No external dependencies are required (standard library only). On `main`, the
GitHub Actions workflow in `.github/workflows/build-scholar-site.yml` runs the
same script and commits any regenerated files. The site deploys through GitHub
Pages.

## Editing publications

Edit `data/publications.json` and rerun the build script — do not hand-edit the
generated files in `publications/`. DOI values, titles, and dates are
authoritative and should match the Zenodo records exactly.
