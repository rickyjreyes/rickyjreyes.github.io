#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://rickyjreyes.github.io/"
OVERLAP_DIR = ROOT / "overlap"
OUT_PATH = ROOT / "priority" / "external-convergence.json"
OVERLAP_PAGE = OVERLAP_DIR / "index.html"


def load_overlap_rows() -> list[list[Any]]:
    raw_rows: list[list[Any]] = []
    paths = sorted(OVERLAP_DIR.glob("overlap-data-*.js"))
    if not paths:
        raise RuntimeError("No overlap-data-*.js files found")

    for path in paths:
        text = path.read_text(encoding="utf-8")
        match = re.search(r"\.concat\((\[.*?\])\);", text, flags=re.S)
        if not match:
            raise RuntimeError(f"Could not parse overlap records from {path}")
        raw_rows.extend(json.loads(match.group(1)))

    # Primary URL is the record identity. Overlay files may intentionally repeat
    # records and may also reuse historical display ranks before browser-side
    # normalization. Later files win. Rank is presentation metadata, not a key
    # and not a record count; sparse 1000+ branch-expansion ranks are valid.
    by_url: dict[str, list[Any]] = {}
    for row in raw_rows:
        if len(row) < 9:
            raise RuntimeError(f"Malformed overlap ledger row: {row!r}")
        primary_url = str(row[2]).strip()
        if not primary_url:
            raise RuntimeError(f"Overlap ledger row has no primary URL: {row!r}")
        by_url[primary_url] = row

    return sorted(by_url.values(), key=lambda row: (int(row[0]), str(row[2])))


def load_existing() -> dict[str, Any]:
    if not OUT_PATH.exists():
        return {}
    return json.loads(OUT_PATH.read_text(encoding="utf-8"))


def compact_external_chronology(later_work: dict[str, Any]) -> dict[str, Any]:
    fields: dict[str, Any] = {}
    for key in ("manuscriptDate", "publicationDate", "date", "doi"):
        if later_work.get(key):
            fields[key] = later_work[key]
    return fields


def build_record(row: list[Any], verified: dict[str, Any] | None, candidate: dict[str, Any] | None) -> dict[str, Any]:
    rank, title, primary_url, score, domain, source, authors, identifier, identifier_url = row
    record: dict[str, Any] = {
        "ledgerRank": int(rank),
        "domain": domain,
        "title": title,
        "primaryUrl": primary_url,
        "source": source,
        "authors": [part.strip() for part in str(authors).split(";") if part.strip()],
        "identifier": identifier,
        "identifierUrl": identifier_url,
        "overlapScore": float(score),
        "verificationStatus": "ledger",
        "relationship": "potential_technical_overlap",
        "chronologyStatus": "not_normalized",
        "influenceStatus": "unresolved",
        "derivationStatus": "unresolved",
        "patentScopeStatus": "not_assessed",
        "wctAnchors": [],
        "correspondence": [],
    }

    audit = verified or candidate
    if audit:
        if audit.get("id"):
            record["auditId"] = audit["id"]
        if audit.get("class"):
            record["class"] = audit["class"]
        for key in ("relationship", "chronologyStatus", "influenceStatus", "derivationStatus", "patentScopeStatus"):
            if key in audit:
                record[key] = audit[key]
        record["wctAnchors"] = audit.get("wctAnchors", [])
        record["correspondence"] = audit.get("correspondence", [])
        record["verificationStatus"] = audit.get(
            "verificationStatus",
            "date_checked" if verified else "chronology_prior_art_review",
        )
        if audit.get("lastVerified"):
            record["lastVerified"] = audit["lastVerified"]
        chronology = compact_external_chronology(audit.get("laterWork", {}))
        if chronology:
            record["externalChronology"] = chronology

    return record


def patch_overlap_page(
    total: int,
    physics: int,
    physics_9plus: int,
    ai: int,
    date_checked: int,
    today: str,
) -> None:
    if not OVERLAP_PAGE.exists():
        return
    text = OVERLAP_PAGE.read_text(encoding="utf-8")

    alternate = '<link rel="alternate" type="application/json" title="Full machine-readable overlap ledger" href="../priority/external-convergence.json">'
    if alternate not in text:
        author_link = '<link rel="author" href="https://orcid.org/0009-0005-5975-8718">'
        if author_link in text:
            text = text.replace(author_link, author_link + "\n  " + alternate, 1)
        else:
            text = text.replace("</head>", "  " + alternate + "\n</head>", 1)

    stats = (
        f'<div class="stats"><div><strong>{total}</strong><span>external comparison records</span></div>'
        f'<div><strong>{physics}</strong><span>WCT / physics / photonics records</span></div>'
        f'<div><strong>{physics_9plus}</strong><span>physics records scoring 9.0+</span></div>'
        f'<div><strong>{ai}</strong><span>Recursive AI Drift / AI-system records</span></div>'
        f'<div><strong>{date_checked}</strong><span>date-checked chronology cases</span></div></div>'
    )
    text = re.sub(r'<div class="stats">.*?</div></div>', stats, text, count=1, flags=re.S)

    pretty_date = date.fromisoformat(today).strftime("%B %d, %Y").replace(" 0", " ")
    month_day = pretty_date.rsplit(",", 1)[0]
    text = re.sub(
        r'The August \d{1,2} high-specificity sweep expands the ledger to \d+ records, including \d+ WCT / physics / photonics comparisons and \d+ physics records scoring 9\.0 or above\.',
        f'The {month_day} high-specificity sweep expands the ledger to {total} records, including {physics} WCT / physics / photonics comparisons and {physics_9plus} physics records scoring 9.0 or above.',
        text,
        count=1,
    )
    text = re.sub(
        r'<small>\d+ external records · \d+ physics / photonics \+ \d+ AI-system comparisons · (?:six|\d+) date-checked cases</small>',
        f'<small>{total} external records · {physics} physics / photonics + {ai} AI-system comparisons · {date_checked} date-checked cases</small>',
        text,
        count=1,
    )
    text = re.sub(r'"dateModified":"\d{4}-\d{2}-\d{2}"', f'"dateModified":"{today}"', text, count=1)
    text = re.sub(r'Updated [A-Z][a-z]+ \d{1,2}, \d{4}\.', f'Updated {pretty_date}.', text, count=1)
    OVERLAP_PAGE.write_text(text, encoding="utf-8")


def main() -> None:
    today = date.today().isoformat()
    rows = load_overlap_rows()
    existing = load_existing()

    verified_cases = existing.get("verifiedCases", [])
    audit_candidates = existing.get("auditCandidates", [])
    prior_art_controls = existing.get("priorArtControls", [])

    verified_by_url = {
        item.get("laterWork", {}).get("url"): item
        for item in verified_cases
        if item.get("laterWork", {}).get("url")
    }
    candidate_by_url = {
        item.get("laterWork", {}).get("url"): item
        for item in audit_candidates
        if item.get("laterWork", {}).get("url")
    }

    records = [
        build_record(row, verified_by_url.get(row[2]), candidate_by_url.get(row[2]))
        for row in rows
    ]

    physics_count = sum(1 for record in records if record["domain"] == "physics")
    physics_9plus_count = sum(
        1
        for record in records
        if record["domain"] == "physics" and float(record["overlapScore"]) >= 9.0
    )
    ai_count = sum(1 for record in records if record["domain"] == "ai")
    date_checked = sum(1 for record in records if record["verificationStatus"] == "date_checked")
    chronology_review = sum(
        1 for record in records if record["verificationStatus"] == "chronology_prior_art_review"
    )
    ledger_only = len(records) - date_checked - chronology_review

    source_files = [
        f"{SITE}overlap/{path.name}"
        for path in sorted(OVERLAP_DIR.glob("overlap-data-*.js"))
    ]

    doc = {
        "schemaVersion": "1.4",
        "updated": today,
        "title": "WCT External Literature Convergence Audit and Full Post-Date Overlap Ledger",
        "canonical": f"{SITE}priority/#convergence-title",
        "registry": f"{SITE}priority/",
        "auditSourceOfTruth": f"{SITE}priority/priority.json",
        "ledgerSourceOfTruth": source_files,
        "fullLedger": f"{SITE}overlap/",
        "fullLedgerLabel": "WCT Post-Date Overlap Ledger",
        "interpretation": "This file exposes the complete public overlap ledger plus the smaller promoted chronology-audit subset. Inclusion or overlap score does not establish copying, influence, derivation, misconduct, infringement, scientific correctness, or independent validation.",
        "promotedRule": "A ledger record is promoted to date_checked only after its WCT anchor and date, external manuscript chronology, and older prior art are normalized. Derivation requires separate provenance evidence.",
        "machineSemantics": {
            "ledgerInclusionDoesNotEstablishChronology": True,
            "overlapScoreIsNotProbability": True,
            "chronologyDoesNotEstablishInfluence": True,
            "chronologyDoesNotEstablishDerivation": True,
            "structuralOverlapDoesNotEstablishCopying": True,
            "structuralOverlapDoesNotEstablishInfringement": True,
            "authorGeneratedAuditIsNotIndependentValidation": True,
            "emptyWctAnchorsMeanNotNormalizedNotNoRelationship": True,
        },
        "counts": {
            "totalRecords": len(records),
            "physicsRecords": physics_count,
            "physics9Plus": physics_9plus_count,
            "aiRecords": ai_count,
            "dateChecked": date_checked,
            "chronologyPriorArtReview": chronology_review,
            "ledgerOnly": ledger_only,
            "verifiedCases": len(verified_cases),
            "auditCandidates": len(audit_candidates),
            "priorArtControls": len(prior_art_controls),
        },
        "statusVocabulary": {
            "ledger": "Present in the public overlap ledger; chronology and prior-art normalization have not yet been promoted to the verified subset.",
            "date_checked": "External chronology and WCT anchor dates were checked and the case was promoted to the verified subset.",
            "chronology_prior_art_review": "Candidate remains under chronology normalization and/or older prior-art review.",
            "not_normalized": "No promoted chronology conclusion is asserted for this ledger record.",
            "unresolved": "No conclusion is asserted.",
            "not_assessed": "This audit does not assess the field.",
        },
        "recordFieldSemantics": {
            "ledgerRank": "Display rank from the public overlap ledger; it is not a stable research identifier or a record count and may be sparse or historically reused before browser-side normalization.",
            "overlapScore": "Heuristic 0-10 comparison score for density and specificity of technical correspondence; it is not a probability.",
            "wctAnchors": "Exact dated WCT claim anchors only when chronology normalization has recorded them; an empty array means not yet normalized.",
            "verificationStatus": "Machine-readable audit state for this record.",
        },
        "records": records,
        "verifiedCases": verified_cases,
        "auditCandidates": audit_candidates,
        "priorArtControls": prior_art_controls,
    }

    OUT_PATH.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    patch_overlap_page(
        len(records),
        physics_count,
        physics_9plus_count,
        ai_count,
        date_checked,
        today,
    )
    print(
        f"Generated {OUT_PATH.relative_to(ROOT)} with {len(records)} unique records "
        f"({physics_count} physics, {physics_9plus_count} physics at 9.0+, {ai_count} AI; "
        f"{date_checked} date-checked, {chronology_review} chronology-review)."
    )


if __name__ == "__main__":
    main()
