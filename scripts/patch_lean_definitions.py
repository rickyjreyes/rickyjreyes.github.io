#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EQUATIONS = ROOT / "equations" / "equations.json"
COMPILED = ROOT / "compiled-registry.json"

# The upstream version-4 Lean interoperability map carries 62 canonical IDs.
# This patch remains limited to preserving definition-only cosmology entries.
DEFINITIONS = {
    "CM12": {
        "declarations": ["dimensionlessPowerSpectrum"],
        "source": "WCTLean/DerivedAudit.lean",
        "limitations": ["Kernel acceptance of a definition is not a cosmological derivation."],
    },
    "CM13": {
        "declarations": [
            "peakPowerRatio21",
            "peakPowerRatio31",
            "peakScaleRatio21",
            "peakScaleRatio31",
        ],
        "source": "WCTLean/DerivedAudit.lean",
        "limitations": ["Kernel acceptance of these definitions is not a fit to cosmological data."],
    },
    "CM16": {
        "declarations": ["horizonWavenumber"],
        "source": "WCTLean/DerivedAudit.lean",
        "limitations": ["The horizon integral and cosmological dynamics are not formalized here."],
    },
}


def formalization(value: dict) -> dict:
    return {
        "status": "DEFINITION",
        "relationship": "definition_only",
        "declaration_type": "definition",
        "declarations": value["declarations"],
        "source": value["source"],
        "limitations": value["limitations"],
    }


def main() -> None:
    equations = json.loads(EQUATIONS.read_text(encoding="utf-8"))
    compiled = json.loads(COMPILED.read_text(encoding="utf-8"))
    equation_by_id = {obj["id"]: obj for obj in equations}
    compiled_by_id = {obj["canonical_id"]: obj for obj in compiled["objects"]}
    for object_id, value in DEFINITIONS.items():
        if object_id not in equation_by_id or object_id not in compiled_by_id:
            raise RuntimeError(f"Missing canonical object {object_id}")
        entry = formalization(value)
        equation_by_id[object_id]["formalization"] = entry
        compiled_by_id[object_id]["formalization"] = entry
    EQUATIONS.write_text(json.dumps(equations, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    COMPILED.write_text(json.dumps(compiled, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Preserved Lean definition coverage for CM12, CM13, and CM16.")


if __name__ == "__main__":
    main()
