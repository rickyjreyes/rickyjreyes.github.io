#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
COMPILED = ROOT / "compiled-registry.json"
EQUATIONS_JSON = ROOT / "equations" / "equations.json"
EQUATIONS_HTML = ROOT / "equations" / "index.html"
SYMPY_HTML = ROOT / "sympy" / "index.html"
LEAN_HTML = ROOT / "lean" / "index.html"
CORPUS_JSON = ROOT / "research-corpus.json"
PUBLICATIONS_SOURCE = ROOT / "data" / "publications.json"
TRACEABILITY_SOURCE = ROOT / "data" / "publication_traceability.json"
PUBLICATIONS_DIR = ROOT / "publications"
REPORT = ROOT / "registry-validation-report.json"
EXPECTED_COUNTS = {"PASS": 59, "CONDITIONAL": 27, "DEFINITION": 26, "OPEN": 30, "FAIL": 0}
EXPECTED_SAMPLES = {
    "E5": "PASS",
    "E9": "PASS",
    "E13": "PASS",
    "E14": "PASS",
    "E18": "PASS",
    "E58": "PASS",
    "CM9": "PASS",
    "CM11": "PASS",
    "CM12": "DEFINITION",
    "CM13": "DEFINITION",
    "CM16": "DEFINITION",
    "CM18": "DEFINITION",
    "E70": "CONDITIONAL",
}
EXPECTED_KINDS = {
    "E2": "ALGEBRAIC_IDENTITY",
    "M4": "FORMAL_THEOREM",
    "E24": "FORMAL_THEOREM",
    "E30": "ALGEBRAIC_IDENTITY",
    "E67": "FORMAL_THEOREM",
    "E70": "CONSISTENCY_CHECK",
    "EZ": "ALGEBRAIC_IDENTITY",
}


def extract_card_statuses(path: Path, card_class: str) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(
        rf'<article class="{re.escape(card_class)}[^"]*" id="([^"]+)"[^>]*data-status="([A-Z]+)"'
    )
    return {object_id: status for object_id, status in pattern.findall(text)}


def extract_lean_data() -> dict[str, Any]:
    text = LEAN_HTML.read_text(encoding="utf-8")
    match = re.search(r"window\.LEAN_COVERAGE_DATA=(\{.*?\});</script>", text, flags=re.S)
    if not match:
        raise RuntimeError("Could not locate LEAN_COVERAGE_DATA")
    return json.loads(match.group(1))


def publication_records() -> dict[str, dict[str, Any]]:
    doc = json.loads(PUBLICATIONS_SOURCE.read_text(encoding="utf-8"))
    return {item["slug"]: item for item in doc.get("publications", [])}


def validate_traceability(
    errors: list[str], warnings: list[str], valid_ids: set[str], corpus: dict[str, Any]
) -> tuple[int, int, int]:
    if not TRACEABILITY_SOURCE.exists():
        errors.append("Missing data/publication_traceability.json")
        return 0, 0, 0
    trace_doc = json.loads(TRACEABILITY_SOURCE.read_text(encoding="utf-8"))
    traces = trace_doc.get("publications", {})
    publications = publication_records()
    publication_slugs = set(publications)
    trace_slugs = set(traces)
    if publication_slugs != trace_slugs:
        errors.append(
            f"Publication traceability slug mismatch; missing={sorted(publication_slugs-trace_slugs)}; "
            f"extra={sorted(trace_slugs-publication_slugs)}"
        )
    claim_ids = {str(item.get("claim_id")) for item in corpus.get("claims", []) if item.get("claim_id")}
    equation_links_checked = 0
    claim_links_checked = 0
    evidence_links_checked = 0
    for slug, trace in traces.items():
        for equation_id in trace.get("equation_ids", []):
            equation_links_checked += 1
            if equation_id not in valid_ids:
                errors.append(f"{slug}: nonexistent equation ID {equation_id}")
        for claim_id in trace.get("claim_ids", []):
            claim_links_checked += 1
            if claim_id not in claim_ids:
                errors.append(f"{slug}: nonexistent claim ID {claim_id}")
        if not trace.get("falsifiers"):
            warnings.append(f"{slug}: no explicit falsifier registered")
        if not trace.get("open_obligations"):
            warnings.append(f"{slug}: no open obligations registered")
        replication = str(trace.get("independent_replication", "")).upper()
        if replication not in {"NONE", "NONE_RECORDED", "UNKNOWN", "NOT_APPLICABLE"}:
            errors.append(f"{slug}: independent replication requires an explicit unaffiliated source")
        page = PUBLICATIONS_DIR / f"{slug}.html"
        if not page.exists():
            errors.append(f"{slug}: generated publication page missing")
            continue
        page_text = page.read_text(encoding="utf-8")
        if f'data-traceability="{slug}"' not in page_text:
            errors.append(f"{slug}: generated page lacks Verification and traceability section")
        for equation_id in trace.get("equation_ids", []):
            if f'../equations/#{equation_id}' not in page_text:
                errors.append(f"{slug}: page lacks exact equation link for {equation_id}")
        if trace.get("datasets"):
            evidence_links_checked += len(trace["datasets"])
    if len(traces) != 22:
        errors.append(f"Expected traceability for 22 publications, found {len(traces)}")
    return claim_links_checked, len(traces), evidence_links_checked + equation_links_checked


def validate_claims(errors: list[str], warnings: list[str], corpus: dict[str, Any], valid_ids: set[str]) -> int:
    claims = corpus.get("claims", [])
    seen = set()
    links_checked = 0
    required = {
        "CLM-CURVATURE-MASS",
        "CLM-FINITE-BAND-SELECTION",
        "CLM-DIMENSIONALITY",
        "CLM-KOIDE",
        "CLM-CURVATURE-COMPUTATION",
    }
    for claim in claims:
        claim_id = claim.get("claim_id")
        if not claim_id:
            errors.append("Claim without claim_id")
            continue
        seen.add(claim_id)
        for equation_id in claim.get("equations", []):
            links_checked += 1
            if equation_id not in valid_ids:
                errors.append(f"{claim_id}: nonexistent equation ID {equation_id}")
        papers = claim.get("papers", [])
        evidence = claim.get("evidence", [])
        if not papers:
            warnings.append(f"{claim_id}: empty paper mapping")
        if not evidence:
            warnings.append(f"{claim_id}: empty evidence mapping")
        for item in evidence:
            links_checked += 1
            if item.get("independent") is True:
                errors.append(f"{claim_id}: independent evidence requires external-source validation")
        if not claim.get("falsifiers"):
            warnings.append(f"{claim_id}: no falsifiers registered")
        if not claim.get("unresolved_obligations"):
            warnings.append(f"{claim_id}: no unresolved obligations registered")
    if not required.issubset(seen):
        errors.append(f"Missing headline claims: {sorted(required-seen)}")
    koide = next((c for c in claims if c.get("claim_id") == "CLM-KOIDE"), None)
    if koide:
        if koide.get("status") != "OPEN":
            errors.append("CLM-KOIDE must remain OPEN until derivation-versus-imposition obligations are closed")
        if "TOP7" not in koide.get("equations", []):
            errors.append("CLM-KOIDE must map to TOP7")
        if koide.get("selected_state_unique") not in {"UNKNOWN", False, None}:
            errors.append("CLM-KOIDE uniqueness must not be asserted without closure evidence")
    return links_checked


def main() -> None:
    errors: list[str] = []
    warnings: list[str] = []
    compiled = json.loads(COMPILED.read_text(encoding="utf-8"))
    equations = json.loads(EQUATIONS_JSON.read_text(encoding="utf-8"))
    corpus = json.loads(CORPUS_JSON.read_text(encoding="utf-8"))

    compiled_by_id = {obj["canonical_id"]: obj for obj in compiled["objects"]}
    equations_by_id = {obj["id"]: obj for obj in equations}
    corpus_by_id = {obj["canonical_id"]: obj for obj in corpus["objects"]}
    id_sets = {
        "compiled": set(compiled_by_id),
        "equations_json": set(equations_by_id),
        "corpus_json": set(corpus_by_id),
    }
    if any(len(ids) != 142 for ids in id_sets.values()):
        errors.append("Every machine-readable layer must contain exactly 142 unique IDs")
    if len({frozenset(ids) for ids in id_sets.values()}) != 1:
        errors.append("Machine-readable layers contain different canonical ID sets")

    compiled_status = {object_id: obj["status"]["effective"] for object_id, obj in compiled_by_id.items()}
    equation_status = {object_id: obj["status"] for object_id, obj in equations_by_id.items()}
    corpus_status = {object_id: obj["status"]["effective"] for object_id, obj in corpus_by_id.items()}
    equation_page_status = extract_card_statuses(EQUATIONS_HTML, "equation-entry")
    sympy_page_status = extract_card_statuses(SYMPY_HTML, "audit-card")
    lean_data = extract_lean_data()
    lean_symbolic_status = {object_id: item["symbolicStatus"] for object_id, item in lean_data.items()}

    layers = {
        "equations_json": equation_status,
        "equations_page": equation_page_status,
        "sympy_page": sympy_page_status,
        "lean_page": lean_symbolic_status,
        "research_corpus": corpus_status,
    }
    for layer_name, statuses in layers.items():
        if set(statuses) != set(compiled_status):
            errors.append(
                f"{layer_name}: ID mismatch; missing={sorted(set(compiled_status)-set(statuses))}; "
                f"extra={sorted(set(statuses)-set(compiled_status))}"
            )
            continue
        mismatches = [
            object_id for object_id, status in compiled_status.items() if statuses[object_id] != status
        ]
        if mismatches:
            errors.append(f"{layer_name}: status mismatch for {mismatches}")

    computed_counts = Counter(compiled_status.values())
    normalized_counts = {
        status: computed_counts.get(status, 0)
        for status in ("PASS", "CONDITIONAL", "DEFINITION", "OPEN", "FAIL")
    }
    if normalized_counts != EXPECTED_COUNTS:
        errors.append(f"Effective counts differ from required totals: {normalized_counts}")
    if normalized_counts != compiled["counts"]:
        errors.append(f"Compiled counts disagree with objects: {normalized_counts}")
    if corpus["audit_summary"]["counts"] != compiled["counts"]:
        errors.append("research-corpus.json counts differ from compiled-registry.json")
    if corpus.get("schema_version") != compiled.get("schema_version"):
        errors.append("research-corpus.json schema version differs from compiled-registry.json")
    if corpus.get("generated_at") != compiled.get("generated_at"):
        errors.append("research-corpus.json generation timestamp differs from compiled-registry.json")

    for object_id, expected in EXPECTED_SAMPLES.items():
        actual = compiled_status.get(object_id)
        if actual != expected:
            errors.append(f"{object_id}: expected {expected}, found {actual}")
    for object_id, expected_kind in EXPECTED_KINDS.items():
        actual_kind = compiled_by_id.get(object_id, {}).get("verification", {}).get("kind")
        if actual_kind != expected_kind:
            errors.append(f"{object_id}: expected verification kind {expected_kind}, found {actual_kind}")

    for object_id, obj in compiled_by_id.items():
        verification = obj["verification"]
        if obj["status"]["effective"] == "PASS":
            if not verification.get("checker"):
                errors.append(f"{object_id}: PASS has no checker")
            if verification.get("kind") == "UNRESOLVED":
                errors.append(f"{object_id}: PASS has unresolved verification kind")
        if obj["status"].get("changed") and not obj["status"].get("changed_by"):
            errors.append(f"{object_id}: changed status lacks provenance")
        formal = obj.get("formalization", {})
        if formal.get("status") == "PROVED" and not formal.get("declarations"):
            errors.append(f"{object_id}: Lean PROVED has no declarations")
        if not obj.get("definition"):
            warnings.append(f"{object_id}: empty definition")

    claim_links = validate_claims(errors, warnings, corpus, set(compiled_by_id))
    trace_claim_links, publication_links, trace_evidence_links = validate_traceability(
        errors, warnings, set(compiled_by_id), corpus
    )

    report = {
        "schema_version": compiled["schema_version"],
        "generated_at": compiled["generated_at"],
        "valid": not errors,
        "errors": errors,
        "warnings": warnings,
        "counts": compiled["counts"],
        "layers_checked": list(layers),
        "sample_statuses": EXPECTED_SAMPLES,
        "sample_verification_kinds": EXPECTED_KINDS,
        "claim_links_checked": claim_links + trace_claim_links,
        "publication_links_checked": publication_links,
        "evidence_links_checked": trace_evidence_links,
        "source_hashes_checked": 0,
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if errors:
        raise SystemExit("Registry synchronization validation failed: " + "; ".join(errors))
    print(
        "Registry synchronization and publication traceability validated: "
        + ", ".join(f"{status}={count}" for status, count in compiled["counts"].items())
    )


if __name__ == "__main__":
    main()
