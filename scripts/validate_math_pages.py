#!/usr/bin/env python3
"""Check the two dedicated mathematical pages and the 300-question snapshot."""
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MATH = ROOT / "math" / "index.html"
PROBLEMS = ROOT / "reyes-problem-repository" / "index.html"
INDEX = ROOT / "reyes-problem-repository" / "problem-index.json"
BROWSER = ROOT / "reyes-problem-repository" / "problem-browser.js"
NAV = ROOT / "site-nav-core.js"


def verify() -> None:
    for file in (MATH, PROBLEMS, INDEX, BROWSER, NAV):
        assert file.is_file() and file.stat().st_size > 0, f"Missing file: {file}"

    math = MATH.read_text(encoding="utf-8")
    problems = PROBLEMS.read_text(encoding="utf-8")
    nav = NAV.read_text(encoding="utf-8")
    script = BROWSER.read_text(encoding="utf-8")
    payload = json.loads(INDEX.read_text(encoding="utf-8"))
    entries = payload["entries"]

    for path, html in ((MATH, math), (PROBLEMS, problems)):
        assert "<main" in html and "<h1" in html, f"Missing main heading in {path}"
        assert '<script src="../site-nav.js' in html, f"Shared navigation missing in {path}"

    for target in (
        "/math/",
        "/reyes-problem-repository/",
        "/equations/",
        "/sympy/",
        "/lean/",
    ):
        assert f"'{target}'" in nav, f"Math menu target missing: {target}"

    assert 'href="/reyes-problem-repository/"' in math
    assert 'href="/math/"' in problems
    assert 'href="/math/"' in (ROOT / "index.html").read_text(encoding="utf-8")
    assert 'href="/reyes-problem-repository/"' in (ROOT / "index.html").read_text(encoding="utf-8")
    assert len(entries) == payload["count"] == 300
    assert [entry["id"] for entry in entries] == [
        f"GC{number:02d}" for number in range(1, 301)
    ]
    categories = Counter(entry["research_area"] for entry in entries)
    assert len(categories) == 12 and set(categories.values()) == {25}
    classes = Counter(entry["source_class"] for entry in entries)
    assert classes == {"original_formal_statement": 65, "roadmap_candidate": 235}
    statuses = Counter(entry["status"] for entry in entries)
    assert statuses == {"candidate": 299, "partially_resolved": 1}
    assert all(re.fullmatch(r"problems/[a-z0-9-]+/GC\d{2,3}\.md",
                            entry["file_path"]) for entry in entries)
    assert 'fetch("./problem-index.json"' in script
    assert 'stageOf(problem)' in script
    print("Mathematics pages validated: 2 internal pages; 300 questions; 12 subjects.")


if __name__ == "__main__":
    verify()
