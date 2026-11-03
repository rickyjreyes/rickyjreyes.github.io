#!/usr/bin/env python3
"""Build full on-site GC dossiers from canonical public math repository sources.

Generates one JSON chunk per mathematical subject (25 questions each). No question,
formal statement, review, or scoped dossier is edited or reinterpreted.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import tempfile
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "reyes-problem-repository" / "problem-index.json"
OUTPUT = ROOT / "reyes-problem-repository"
REMOTE = "https://github.com/rickyjreyes/math.git"
SOURCE_BASE = "reyes-problem-repository"


def run(*args: str) -> str:
    result = subprocess.run(args, check=True, text=True, capture_output=True)
    return result.stdout.strip()


def formal_statements(text: str) -> dict[str, str]:
    """Preserve the exact GC01–GC65 Markdown sections from FORMAL_PROBLEMS.md."""
    blocks: dict[str, str] = {}
    found = list(re.finditer(r"(?m)^### (GC\d{2,3}):[^\n]*$", text))
    for i, match in enumerate(found):
        gc = match.group(1)
        start = match.start()
        end = found[i + 1].start() if i + 1 < len(found) else len(text)
        other_heading = re.search(r"(?m)^## ", text[match.end():end])
        if other_heading:
            end = match.end() + other_heading.start()
        blocks[gc] = text[start:end].strip()
    if len(blocks) != 65:
        raise RuntimeError(f"Expected 65 original canonical statements, got {len(blocks)}")
    return blocks


def content(path: Path) -> str:
    if not path.is_file():
        raise FileNotFoundError(f"Required source file absent: {path}")
    return path.read_text(encoding="utf-8").strip()


def build(source: Path, ref: str) -> None:
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    entries = index["entries"]
    areas = index["research_areas"]
    if len(entries) != 300 or len(areas) != 12:
        raise ValueError("The local GC index must contain 300 entries in 12 subjects")

    src = source / SOURCE_BASE
    canonical = formal_statements(content(src / "FORMAL_PROBLEMS.md"))
    counts = Counter()
    totals = Counter()

    for position, area in enumerate(areas, 1):
        name = area["name"]
        group = [item for item in entries if item["research_area"] == name]
        if len(group) != 25:
            raise ValueError(f"{name}: expected 25 questions; found {len(group)}")
        documents = []
        for item in group:
            gc = item["id"]
            original_path = item["file_path"]
            if not re.fullmatch(r"problems/[a-z0-9-]+/GC\d{2,3}\.md", original_path):
                raise ValueError(f"Unexpected source path for {gc}: {original_path}")
            original = content(src / original_path)
            review = content(src / "formal-reviews" / f"{gc}.md")
            scoped = (
                content(src / "scoped" / f"{gc}.md")
                if item["source_class"] == "roadmap_candidate" else None
            )
            if gc not in original or gc not in review:
                raise ValueError(f"ID mismatch in original or formal review for {gc}")
            if scoped is not None and gc not in scoped:
                raise ValueError(f"ID mismatch in scoped mathematical target for {gc}")
            if item["source_class"] == "original_formal_statement" and gc not in canonical:
                raise ValueError(f"Canonical formal statement missing for {gc}")
            primary = canonical.get(gc, original)
            documents.append({
                "id": gc,
                "source_statement": primary,
                "individual_record": original,
                "formal_review": review,
                "scoped_target": scoped,
                "source_paths": {
                    "source_statement": "FORMAL_PROBLEMS.md" if gc in canonical else original_path,
                    "individual_record": original_path,
                    "formal_review": f"formal-reviews/{gc}.md",
                    "scoped_target": f"scoped/{gc}.md" if scoped is not None else None,
                },
            })
            counts[item["source_class"]] += 1
            totals["review"] += 1
            if scoped is not None:
                totals["scoped"] += 1
        output = {
            "schema_version": 1,
            "source_repository": "rickyjreyes/math",
            "source_commit": ref,
            "research_area": name,
            "count": len(documents),
            "entries": documents,
        }
        target = OUTPUT / f"full-{position:02d}.json"
        target.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
        print(f"{target.relative_to(ROOT)}: {len(documents)} complete GC dossiers")

    if counts != {"original_formal_statement": 65, "roadmap_candidate": 235}:
        raise RuntimeError(f"Unexpected source classification: {counts}")
    if totals != {"review": 300, "scoped": 235}:
        raise RuntimeError(f"Missing full GC content: {totals}")
    print(f"Full index complete: 300 original questions, 300 research reviews, 235 scoped targets, source {ref}")


def main() -> None:
    # CI hosts can access the public source repository without credentials. A
    # sparse, blob-filtered checkout limits downloads to mathematical dossiers.
    with tempfile.TemporaryDirectory(prefix="math-gc-source-") as directory:
        run("git", "clone", "--quiet", "--depth=1", "--filter=blob:none",
            "--sparse", "--single-branch", "--branch", "main", REMOTE, directory)
        run("git", "-C", directory, "sparse-checkout", "set",
            "reyes-problem-repository/formal-reviews",
            "reyes-problem-repository/problems",
            "reyes-problem-repository/scoped")
        ref = run("git", "-C", directory, "rev-parse", "HEAD")
        build(Path(directory), ref)


if __name__ == "__main__":
    main()
