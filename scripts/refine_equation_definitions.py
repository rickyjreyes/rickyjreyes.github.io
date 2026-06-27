#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "equations" / "equations.json"
HTML_PATH = ROOT / "equations" / "index.html"
TOOLS_PATH = ROOT / "tools" / "equations-data.js"


def refine(obj: dict) -> str:
    raw = obj.get("definition", "").strip()
    raw = re.sub(r"^(?:Let|Define|Then|Equivalently)\b[\s,.:;-]*", "", raw, flags=re.I)
    raw = re.sub(r"^For\s+\$[^$]+\$,?\s*define\s*", "", raw, flags=re.I)
    raw = re.sub(r"\b(?:Let|Define)\s*$", "", raw, flags=re.I).strip()
    pieces = [p.strip() for p in re.split(r"(?<=[.!?])\s+", raw) if p.strip()]
    pieces = [p for p in pieces if len(re.sub(r"\$[^$]+\$", "", p).strip()) >= 18]
    explanatory = " ".join(pieces[:2]).strip()
    explanatory = re.sub(r"\$([^$]+)\$", r"\\(\1\\)", explanatory)
    base = (
        f"{obj['title']} is the canonical {obj['id']} object in the "
        f"{obj['family']} family."
    )
    if explanatory and obj["title"].lower() not in explanatory.lower():
        return f"{base} {explanatory}"
    return base


def main() -> None:
    objects = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    for obj in objects:
        obj["definition"] = refine(obj)
    JSON_PATH.write_text(json.dumps(objects, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    page = HTML_PATH.read_text(encoding="utf-8")
    for obj in objects:
        pattern = re.compile(
            rf'(<article class="equation-entry" id="{re.escape(obj["id"])}".*?'
            rf'<p class="equation-definition">)(.*?)(</p>)',
            flags=re.S,
        )
        page, count = pattern.subn(
            lambda match: match.group(1) + html.escape(obj["definition"]) + match.group(3),
            page,
            count=1,
        )
        if count != 1:
            raise RuntimeError(f"Could not update definition for {obj['id']}")
    HTML_PATH.write_text(page, encoding="utf-8")

    tool_objects = [
        {
            "id": obj["id"],
            "family": obj["family"],
            "title": obj["title"],
            "meaning": obj["definition"],
            "latex": obj["formula"] or r"\text{No standalone display equation recorded.}",
            "symbols": [],
            "use": ["Canonical source: WCT_FULL_EQUATION_LIST_CORRECTED.md"],
            "status": obj["status"],
            "source": obj["source"],
        }
        for obj in objects
    ]
    TOOLS_PATH.write_text(
        "window.WCT_EQUATIONS = " + json.dumps(tool_objects, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )
    print(f"Refined {len(objects)} equation definitions.")


if __name__ == "__main__":
    main()
