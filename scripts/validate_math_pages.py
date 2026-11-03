#!/usr/bin/env python3
"""Check the two dedicated mathematical pages and the 300-question snapshot."""
from __future__ import annotations

import json
import re
import subprocess
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
    assert 'const stageName = item =>' in script

    # Cross-repository public Lean proof atlas: source presence and proper distinctions.
    fragments = [
        json.loads((ROOT / "math" / f"proofs-0{i}.json").read_text(encoding="utf-8"))
        for i in (1, 2, 3)
    ]
    proofs = sorted(
        (entry for fragment in fragments for entry in fragment["entries"]),
        key=lambda entry: entry["rank"],
    )
    repo_index = json.loads(
        (ROOT / "math" / "public-lean-repositories.json").read_text(encoding="utf-8")
    )
    file_index = json.loads(
        (ROOT / "math" / "lean-files.json").read_text(encoding="utf-8")
    )
    public = {entry["repo"] for entry in repo_index["repositories"]}
    assert [entry["rank"] for entry in proofs] == list(range(1, 28))
    assert public == {
        "rickyjreyes/math", "rickyjreyes/wct-lean",
        "rickyjreyes/geometry_of_resonance",
        "rickyjreyes/Wavelock", "rickyjreyes/photodiode",
    }
    assert len(file_index["files"]) == file_index["count"] == 278
    assert sum(x["lean_files"] for x in repo_index["repositories"]) == 278
    indexed_paths = {(row["repo"], row["path"]) for row in file_index["files"]}
    assert len(indexed_paths) == 278
    assert len(public) == repo_index["repositories_with_lean"] == 5
    assert repo_index["public_repositories_scanned"] == 30
    assert all(entry["repo"] in public for entry in proofs)
    assert all((entry["repo"], entry["path"]) in indexed_paths for entry in proofs)
    assert all(entry["statement"].lstrip().startswith("theorem ")
               and entry["theorem"] in entry["statement"]
               and int(entry["line"]) > 0 for entry in proofs)
    assert all(entry["source_url"].startswith(
        f"https://github.com/{entry['repo']}/blob/"
    ) for entry in proofs)
    assert all(entry["source_url"].endswith(f"#L{entry['line']}")
               for entry in proofs)
    assert 'id="atlas-proof-list"' in math
    assert 'id="atlas-files-list"' in math
    assert 'formal-reviews/' in script
    assert 'id="rpr-list"' in problems
    assert 'id="rpr-area-list"' in problems
    # The public Mathematics view must explain every formal declaration
    # in ordinary language without removing the exact Lean statement.
    readable = json.loads(
        (ROOT / "math" / "proof-guide.json").read_text(encoding="utf-8")
    )
    guide = readable["entries"]
    assert [entry["rank"] for entry in guide] == list(range(1, 28))
    assert all(
        all(isinstance(entry.get(field), str) and entry[field].strip()
            for field in ("plain", "why", "conditions", "math"))
        for entry in guide
    )
    assert len(set(entry["math"] for entry in guide)) == 27
    assert 'href="./readable.css?' in math
    assert 'id="atlas-lean-toggle"' in math
    assert 'class="atlas-glossary"' in math
    assert [int(value) for value in re.findall(
        r'data-atlas-feature-rank="(\d+)"', math
    )] == [1, 4, 3, 2, 10, 27]
    assert math.count('data-atlas-feature-code') == 6
    assert math.count('class="atlas-feature-lean"') == 6
    atlas_js = (ROOT / "math" / "atlas.js").read_text(encoding="utf-8")
    assert '"proof-guide.json"' in atlas_js
    assert 'Show all Lean statements' in math
    assert 'atlas-lean-disclosure' in atlas_js
    assert 'guide.plain' in atlas_js and 'guide.conditions' in atlas_js
    inline_math_scripts = re.findall(
        r"<script>(.*?)</script>", math, flags=re.S
    )
    assert len(inline_math_scripts) == 1
    inline_check = subprocess.run(
        ["node", "--check", "-"],
        input=inline_math_scripts[0], text=True, capture_output=True, check=False
    )
    assert inline_check.returncode == 0, inline_check.stderr
    print("Reader edition validated: 27 explanations, 6 full-featured mathematics examples, exact Lean preserved.")

    print("Lean atlas validated: 27 sourced excerpts; 278 public files in 5 repositories.")

    # Every GC question must have canonical text, individual source and its
    # full research-review dossier. Later drafts must also retain scoped v1.
    details = [
        json.loads((ROOT / "reyes-problem-repository" / f"full-{index:02d}.json")
                   .read_text(encoding="utf-8"))
        for index in range(1, 13)
    ]
    manifest = payload["research_areas"]
    assert all(part["count"] == len(part["entries"]) == 25
               and part["research_area"] == manifest[i]["name"]
               for i, part in enumerate(details))
    references = {part["source_commit"] for part in details}
    assert len(references) == 1 and len(next(iter(references))) == 40
    complete = {entry["id"]: entry for part in details for entry in part["entries"]}
    assert len(complete) == 300
    for entry in entries:
        gc = entry["id"]
        record = complete[gc]
        assert gc in record["source_statement"]
        assert gc in record["individual_record"]
        assert gc in record["formal_review"]
        assert "Resolution criterion" in record["formal_review"]
        assert record["source_paths"]["individual_record"] == entry["file_path"]
        if entry["source_class"] == "original_formal_statement":
            assert record["source_statement"].startswith(f"### {gc}:")
            assert record["scoped_target"] is None
        else:
            assert record["scoped_target"] and gc in record["scoped_target"]
    assert 'id="rpr-reviews-toggle"' in problems
    assert 'full-reader.css' in problems
    # Validate the MathJax setup as JavaScript; misplaced markup is not safe.
    assert "inlineMath:" in problems and "MathJax" in problems
    inline_scripts = re.findall(r"<script>(.*?)</script>", problems, flags=re.S)
    assert len(inline_scripts) == 1, "Expected exactly one inline MathJax script"
    syntax = subprocess.run(
        ["node", "--check", "-"],
        input=inline_scripts[0], text=True, capture_output=True, check=False,
    )
    assert syntax.returncode == 0, f"Invalid inline MathJax script: {syntax.stderr}"

    assert 'id="rpr-list"' in problems
    assert 'full-' in script and 'source_statement' in script
    assert 'full_review' not in script or 'formal_review' in script
    print("Full GC reader validated: all 300 statements, 300 reviews, 235 scope dossiers, 12 subjects.")


    print("Mathematics pages validated: 2 internal pages; 300 questions; 12 subjects.")


if __name__ == "__main__":
    verify()
