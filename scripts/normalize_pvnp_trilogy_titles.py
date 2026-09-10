#!/usr/bin/env python3
"""Normalize the three Wave-Constrained P vs NP publication titles.

The scholarly site is generated from data/publications.json. This script keeps
Parts I-III visibly grouped as one proof sequence while preserving each paper's
existing slug, DOI, status, and body metadata.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLICATIONS = ROOT / "data" / "publications.json"

TITLES = {
    3: "Part I — P vs NP in Curvature-Bounded Wave Computation: A Model-Relative P_WCC ≠ NP_WCC Separation",
    12: "Part II — Discrete Wave-Constrained Computation and Classical Complexity: Turing Equivalence for P and NP",
    13: "Part III — The Classical P vs NP Problem Is Mathematically and Physically Ill-Posed",
}


def main() -> None:
    data = json.loads(PUBLICATIONS.read_text(encoding="utf-8"))
    publications = data.get("publications", [])

    seen: set[int] = set()
    changed = False
    for publication in publications:
        number = publication.get("n")
        if number not in TITLES:
            continue
        seen.add(number)
        desired = TITLES[number]
        if publication.get("title") != desired:
            publication["title"] = desired
            changed = True

    missing = sorted(set(TITLES) - seen)
    if missing:
        raise RuntimeError(f"Missing expected publication entries: {missing}")

    if changed:
        PUBLICATIONS.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print("Updated P vs NP trilogy titles in data/publications.json")
    else:
        print("P vs NP trilogy titles already normalized")


if __name__ == "__main__":
    main()
