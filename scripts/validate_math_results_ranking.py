#!/usr/bin/env python3
"""Validate the public math-page individual Lean ranking and file inventories."""

from __future__ import annotations

import json
import pathlib
import re
from collections import Counter
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parents[1]
MATH = ROOT / "math"
EXPECTED_RANKS = [
    1, 2, 3, 4, 6, 7, 11, 12, 13, 14, 15, 16, 17, 18,
    20, 21, 23, 24, 25, 27, 28, 30, 32, 33, 34, 35, 36, 40,
]
REPOS = {
    "rickyjreyes/math": ("main", "lean/"),
    "rickyjreyes/wct-lean": ("main", "WCTLean/"),
    "rickyjreyes/geometry_of_resonance": ("main", "lean/"),
    "rickyjreyes/photodiode": ("main", "formal/"),
    "rickyjreyes/Wavelock": ("master", "lean/"),
}


def read_json(name: str) -> dict:
    return json.loads((MATH / name).read_text(encoding="utf-8"))


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    ranking = read_json("result-rankings.json")
    files = read_json("lean-files.json")
    inventory = read_json("public-lean-repositories.json")
    html = (MATH / "index.html").read_text(encoding="utf-8")
    script = (MATH / "result-rankings.js").read_text(encoding="utf-8")

    entries = ranking["entries"]
    require(ranking["schema_version"] == 2, "ranking schema mismatch")
    require(ranking["snapshot_date"] == "2026-11-13", "ranking snapshot mismatch")
    require(ranking["public_only"] is True, "ranking must remain public-only")
    require(ranking["global_pool"] == 40, "global editorial pool mismatch")
    require(ranking["private_entries_omitted"] == 12, "private-source count mismatch")
    require([entry["rank"] for entry in entries] == EXPECTED_RANKS, "published rank order changed")
    require(len(set(EXPECTED_RANKS)) == len(entries), "duplicate ranking numbers")

    file_keys = set()
    for item in files["files"]:
        key = (item["repo"], item["branch"], item["path"])
        require(key not in file_keys, "duplicate Lean file " + repr(key))
        require(item["repo"] in REPOS, "non-public repo in source inventory")
        branch, prefix = REPOS[item["repo"]]
        require(item["branch"] == branch, "source-branch mismatch")
        require(item["path"].startswith(prefix) and item["path"].endswith(".lean"),
                "source inventory has invalid Lean path")
        require(item["source_url"] == f'https://github.com/{item["repo"]}/blob/{branch}/{item["path"]}',
                "source inventory URL mismatch")
        file_keys.add(key)

    require(files["count"] == len(file_keys) == 306, "source-file count mismatch")
    require(inventory["total_lean_files"] == 306, "repository total mismatch")
    require(len(inventory["repositories"]) == 5, "public repository inventory mismatch")
    totals = Counter(item[0] for item in file_keys)
    for record in inventory["repositories"]:
        require(record["repo"] in REPOS, "non-public repo in repository cards")
        require(record["lean_files"] == totals[record["repo"]], "repository count mismatch")

    for item in entries:
        require(item["repo"] in REPOS, "private proof included in public ranking")
        branch, prefix = REPOS[item["repo"]]
        require((item["repo"], branch, item["path"]) in file_keys,
                "ranking source is absent from current public-file inventory")
        url = f'https://github.com/{item["repo"]}/blob/{branch}/{item["path"]}'
        require(item["source_url"] == url, "result has invalid GitHub proof link")
        require(urlparse(url).hostname == "github.com", "external result URL")
        require(isinstance(item["score"], int) and 0 <= item["score"] <= 100,
                "invalid editorial score")
        for field in ("title", "category", "group", "summary", "limit"):
            require(isinstance(item[field], str) and len(item[field].strip()) > 2,
                    "missing explanatory field " + field)

    # Every public result needs an actual model, functional, operator or theorem formula.
    for item in entries:
        for field in ("equation_label", "equation_latex", "equation_note"):
            require(isinstance(item.get(field), str) and len(item[field].strip()) >= 12,
                    "missing mathematical formula field " + field)
        tex = item["equation_latex"]
        require("\\" in tex and len(tex) < 1200, "invalid equation LaTeX")
        require(tex.count("{") == tex.count("}"), "unbalanced equation braces")
        require(tex.count(r"\begin{aligned}") == tex.count(r"\end{aligned}"),
                "unbalanced equation alignment")
    shell = next(item for item in entries if item["rank"] == 23)
    require(shell["path"] == "lean/MathProofs/SpectralConcentration.lean",
            "shell concentration must point to the full theorem, not the algebraic precursor")
    historical = next(item for item in entries if item["rank"] == 32)
    corrected = next(item for item in entries if item["rank"] == 13)
    require("historical" in historical["equation_note"].lower() or
            "not the corrected" in historical["equation_note"].lower(),
            "missing historical regularizer distinction")
    require("varepsilon^2" in corrected["equation_latex"] and
            "D_{\\varepsilon" in historical["equation_latex"],
            "the two curvature models must remain distinct")
    require(html.count('class="ranked-equation"') == 4,
            "the four static theorem-card fallbacks need mathematical formulas")
    require("equation_latex" in script and "typesetEquations" in script and
            "MathJax.typesetPromise" in script and
            "data.schema_version !== 2" in script,
            "dynamic equation rendering or schema validation is missing")

    # Scientific-impact ranking must remain distinct from the proved-theorem list.
    impact_ids = re.findall(r'<article class="equation-impact-item" id="equation-impact-(\d+)">', html)
    require(impact_ids == [str(n) for n in range(1, 11)],
            "original equation ranking must contain ten unique ordered entries")
    require(html.count('class="equation-impact-caveat"') == 10,
            "each original equation needs an explicit limitation")
    require(html.count('class="equation-impact-math"') == 10,
            "each original equation needs its defining mathematical formula")
    for expected in (
        'id="equation-impact"', 'equation-impact.css',
        'window.MathJax.typesetPromise([section])',
        'WCT_CORRECTED_VARIATIONAL_CLOSURE_DRAFT.md',
        'rickyjreyes/wct-sympy/blob/main/MASTER_EQUATIONS.md',
        'rickyjreyes/wct-sympy/blob/main/EQUATIONS.md',
        'These 10 entries are priorities within the original WCT equation architecture',
        'The corrected S004 action, the separate cubic–quintic Hamiltonian flow',
    ):
        require(expected in html, "missing original-equation impact provision: " + expected)

    for hook in (
        'id="rankings"', 'id="ranked-query"', 'id="ranked-repository"',
        'id="ranked-area"', 'id="ranked-count"', 'id="ranked-more"',
        'id="ranked-reset"', 'id="ranked-result-list"', 'id="ranked-status"',
        'result-rankings.js', 'result-rankings.css', 'href="#rankings"',
    ):
        require(hook in html, "missing HTML element or asset: " + hook)
    require('id="atlas-file-count">306<' in html, "stale visible file count")
    require("278" not in html and "278" not in (MATH / "atlas.js").read_text(),
            "old 278-file snapshot is still displayed")
    require("trustedRepos" in script and "validEntry" in script and
            "source_url === source" in script, "missing client public-source validation")
    require("theorem-completion percentages" in html, "missing ranking caution")
    print(f"PASS: {len(entries)} public results, {len(file_keys)} Lean files, "
          f"{len(REPOS)} repositories; {ranking['private_entries_omitted']} private items withheld")


if __name__ == "__main__":
    main()

