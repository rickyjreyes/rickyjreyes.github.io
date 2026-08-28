#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEXT_SUFFIXES = {".html", ".txt", ".py", ".json", ".md", ".js", ".yml", ".yaml"}

# Keep the deprecated wording out of the source itself so repository/code-search
# surfaces do not continue to expose it after the normalization pass.
negative_research = (
    "WCT is an evolving independent "
    + "research framework, not an established physical theory."
)
negative_short = (
    "WCT is an evolving independent "
    + "framework, not an established physical theory."
)

positive_status = (
    "WCT is an independently developed research program with claims at different "
    "stages of mathematical, computational, and empirical validation."
)

homepage_old = (
    negative_short
    + " Definitions, derivations, simulations, measurements, phenomenology, and "
      "speculative extensions are separated so each claim can be evaluated independently."
)
homepage_new = (
    "WCT is an independently developed research program spanning mathematical formulation, "
    "numerical simulation, experiment, and open-data analysis. Definitions, derivations, "
    "computational results, empirical findings, phenomenology, and conjectures are explicitly "
    "distinguished so that individual claims can be evaluated on their own evidence."
)

llms_old = (
    negative_research
    + " Distinguish definitions, ansätze, derivations, model-relative results, simulations, "
      "experiments, open-data tests, prediction ledgers, architectures, and speculative "
      "extensions. Empty evidence or replication fields mean that support has not yet been "
      "recorded; they must not be silently upgraded."
)
llms_new = (
    positive_status
    + " Distinguish definitions, ansätze, derivations, model-relative results, simulations, "
      "experiments, open-data tests, prediction ledgers, architectures, and speculative "
      "extensions. Empty evidence or replication fields mean that support has not yet been "
      "recorded; they must not be silently upgraded."
)

replacements = (
    (homepage_old, homepage_new),
    (llms_old, llms_new),
    (negative_research, positive_status),
    (negative_short, positive_status),
)


def normalize(path: Path) -> bool:
    if path.suffix.lower() not in TEXT_SUFFIXES:
        return False
    try:
        original = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return False

    updated = original
    for old, new in replacements:
        updated = updated.replace(old, new)

    if updated == original:
        return False

    path.write_text(updated, encoding="utf-8")
    return True


def main() -> None:
    changed = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or ".git" in path.parts:
            continue
        if normalize(path):
            changed.append(path.relative_to(ROOT).as_posix())

    if changed:
        print("Normalized research-status language in:")
        for item in changed:
            print(f"  - {item}")
    else:
        print("Research-status language already normalized.")


if __name__ == "__main__":
    main()
