#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import re
import urllib.request
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
COMPILED_PATH = ROOT / "compiled-registry.json"
CORPUS_PATH = ROOT / "research-corpus.json"
CORPUS_PAGE_PATH = ROOT / "research-corpus" / "index.html"
WCT_SYMPY_REF = os.environ.get("WCT_SYMPY_REF", "main")
CLAIMS_URL = f"https://raw.githubusercontent.com/rickyjreyes/wct-sympy/{WCT_SYMPY_REF}/claims/initial_claims.yaml"


def fetch_yaml(url: str) -> Any:
    request = urllib.request.Request(url, headers={"User-Agent": "rickyjreyes.github.io-builder"})
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            return yaml.safe_load(response.read().decode("utf-8"))
    except Exception:
        return None


def legacy_object_map() -> dict[str, dict[str, Any]]:
    if not CORPUS_PATH.exists():
        return {}
    try:
        current = json.loads(CORPUS_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}
    return {
        str(obj.get("canonical_id")): obj
        for obj in current.get("objects", [])
        if obj.get("canonical_id")
    }


def build_corpus() -> dict[str, Any]:
    compiled = json.loads(COMPILED_PATH.read_text(encoding="utf-8"))
    legacy = legacy_object_map()
    claims_doc = fetch_yaml(CLAIMS_URL) or {"claims": {}}
    claims = [
        {"claim_id": claim_id, **details}
        for claim_id, details in claims_doc.get("claims", {}).items()
    ]

    objects = []
    for obj in compiled["objects"]:
        object_id = obj["canonical_id"]
        old = legacy.get(object_id, {})
        merged = {
            **obj,
            "dependencies": old.get(
                "dependencies",
                {"equations": [], "assumptions": obj.get("assumptions", []), "claims": [], "papers": []},
            ),
            "source_papers": old.get("source_papers", []),
            "evidence": old.get("evidence", []),
            "cross_layer_consistency": old.get(
                "cross_layer_consistency",
                {
                    "status": "compiled",
                    "notes": [
                        "Symbolic status, verification kind, Lean coverage, and empirical state are generated from the compiled registry."
                    ],
                },
            ),
            "semantic_graph": old.get(
                "semantic_graph",
                {
                    "repository": "https://github.com/rickyjreyes/obsidian",
                    "lookup_keys": [object_id],
                    "status": "lookup_by_stable_id",
                },
            ),
        }
        objects.append(merged)

    return {
        "schema_version": "2.0.0",
        "corpus_id": "wct",
        "name": "Wave Confinement Theory",
        "description": "Machine-readable, provenance-preserving cross-repository manifest for the Wave Confinement Theory research corpus.",
        "author": {
            "name": "Richard J. Reyes",
            "alternate_name": "Ricky Reyes",
            "orcid": "0009-0005-5975-8718",
            "homepage": "https://rickyjreyes.github.io/",
        },
        "canonical_root": "https://rickyjreyes.github.io/research-corpus.json",
        "compiled_registry": "https://rickyjreyes.github.io/compiled-registry.json",
        "generated_at": compiled["generated_at"],
        "status_policy": {
            "PASS": "The assigned executable check succeeds under its declared assumptions.",
            "CONDITIONAL": "Additional mathematical, domain, regularity, model, or empirical assumptions remain required.",
            "DEFINITION": "The object is a definition, ansatz, or bookkeeping object rather than a theorem.",
            "OPEN": "Analysis, formal proof, calibrated simulation, or experiment remains unresolved.",
            "FAIL": "The encoded statement is contradicted by its assigned checker.",
            "PROVED": "A named declaration is accepted by the Lean kernel under the hypotheses in its theorem statement.",
        },
        "repositories": {
            "canonical_equations": {
                "name": "geometry_of_resonance",
                "url": "https://github.com/rickyjreyes/geometry_of_resonance",
                "master_equations": "https://github.com/rickyjreyes/geometry_of_resonance/blob/main/WCT_MASTER_EQUATIONS_UPDATED.md",
                "full_equation_registry": "https://github.com/rickyjreyes/geometry_of_resonance/blob/main/WCT_FULL_EQUATION_LIST_CORRECTED.md",
            },
            "symbolic_audit": {
                "name": "wct-sympy",
                "url": "https://github.com/rickyjreyes/wct-sympy",
                "registry": "https://github.com/rickyjreyes/wct-sympy/blob/main/equations/full_registry.yaml",
                "derived_overrides": "https://github.com/rickyjreyes/wct-sympy/blob/main/equations/derived_overrides.yaml",
                "compiled_registry": "https://github.com/rickyjreyes/wct-sympy/blob/main/compiled-registry.json",
                "lean_map": "https://github.com/rickyjreyes/wct-sympy/blob/main/interoperability/lean_map.yaml",
            },
            "formalization": {
                "name": "wct-lean",
                "url": "https://github.com/rickyjreyes/wct-lean",
                "theorem_inventory": "https://github.com/rickyjreyes/wct-lean/blob/main/THEOREMS.md",
                "compiled_root": "https://github.com/rickyjreyes/wct-lean/blob/main/WCTLean/Main.lean",
            },
            "semantic_graph": {
                "name": "obsidian",
                "url": "https://github.com/rickyjreyes/obsidian",
                "entry_point": "https://github.com/rickyjreyes/obsidian/blob/main/Research/00%20Maps/WCT%20Research%20Command%20Center.md",
            },
        },
        "audit_summary": {
            "registry_size": compiled["total"],
            "source_of_truth": "compiled-registry.json generated from the baseline registry, effective overrides, verification metadata, assumption registry, canonical equations, and Lean map",
            "counts": compiled["counts"],
            "status_conflict_warning": None,
        },
        "assumptions": compiled.get("assumptions", []),
        "claims": claims,
        "objects": objects,
        "machine_reading_guidance": {
            "canonical_id_policy": "Use canonical_id as the primary key. Aliases must not be silently collapsed.",
            "status_precedence": [
                "Per-object derived override",
                "Executable SymPy baseline registry",
                "Canonical equation narrative",
            ],
            "verification_rule": "Read verification.outcome together with verification.kind and verification.scope. PASS alone does not state what kind of check succeeded.",
            "formalization_rule": "Never report a SymPy PASS as a Lean proof. Only named kernel-accepted declarations may be labeled PROVED.",
            "empirical_rule": "Empirical validation is independent of symbolic and formal status.",
            "missing_data_rule": "Use null, empty arrays, UNKNOWN, or OPEN rather than inventing identifiers, proofs, dates, dependencies, or evidence.",
        },
        "content_type": "application/json",
    }


def patch_corpus_page(corpus: dict[str, Any]) -> None:
    if not CORPUS_PAGE_PATH.exists():
        return
    page = CORPUS_PAGE_PATH.read_text(encoding="utf-8")
    counts = corpus["audit_summary"]["counts"]
    replacements = {
        r'<strong>142</strong><span>registered objects</span>': f'<strong>{corpus["audit_summary"]["registry_size"]}</strong><span>registered objects</span>',
        r'<strong>59</strong><span>PASS</span>': f'<strong>{counts["PASS"]}</strong><span>PASS</span>',
        r'<strong>27</strong><span>CONDITIONAL</span>': f'<strong>{counts["CONDITIONAL"]}</strong><span>CONDITIONAL</span>',
        r'<strong>26</strong><span>DEFINITION</span>': f'<strong>{counts["DEFINITION"]}</strong><span>DEFINITION</span>',
        r'<strong>30</strong><span>OPEN</span>': f'<strong>{counts["OPEN"]}</strong><span>OPEN</span>',
        r'<strong>0</strong><span>FAIL</span>': f'<strong>{counts["FAIL"]}</strong><span>FAIL</span>',
    }
    for old, new in replacements.items():
        page = page.replace(old, new)
    page = page.replace(
        '<a class="card" href="../research-corpus.json"><small>05 · Machine-readable</small><h2>Corpus JSON</h2><p>Structured cross-repository identifiers and source relationships for automated discovery.</p><span class="go">Open JSON →</span></a>',
        '<a class="card" href="../research-corpus.json"><small>05 · Machine-readable</small><h2>Corpus JSON</h2><p>All 142 compiled objects with effective status, verification kind, assumptions, Lean mappings, empirical state, claims, and provenance.</p><span class="go">Open JSON →</span></a>',
    )
    provenance = (
        f'<div class="note"><strong>Registry provenance:</strong> schema {corpus["schema_version"]}; generated '
        f'{corpus["generated_at"]}. <a href="../compiled-registry.json">Open the compiled registry.</a></div>'
    )
    if "Registry provenance:" not in page:
        page = page.replace("</section></main>", provenance + "</section></main>", 1)
    CORPUS_PAGE_PATH.write_text(page, encoding="utf-8")


def main() -> None:
    corpus = build_corpus()
    if len(corpus["objects"]) != 142:
        raise RuntimeError(f"Expected 142 corpus objects, found {len(corpus['objects'])}")
    CORPUS_PATH.write_text(json.dumps(corpus, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    patch_corpus_page(corpus)
    print(f"Generated research-corpus.json with {len(corpus['objects'])} compiled objects and {len(corpus['claims'])} initial claim maps.")


if __name__ == "__main__":
    main()
