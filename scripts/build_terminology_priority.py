#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GLOSSARY = ROOT / "tools" / "glossary"
JSON_OUT = ROOT / "priority" / "terminology-priority.json"
JS_OUT = GLOSSARY / "terminology-priority.js"
INDEX = GLOSSARY / "index.html"
LLMS = ROOT / "llms.txt"
AUDIT_SOURCE = ROOT / "data" / "terminology_exact_phrase_audit.json"
AUDIT_BATCH_SOURCES = [
    ROOT / "data" / "terminology_exact_phrase_audit_44_additions.json",
]

RELEASES = {
  1:("2025-04-22","10.5281/zenodo.15644222","geometry-of-resonance","The Geometry of Resonance: Wave Confinement Theory and the Emergence of Mass, Force, and Spacetime"),
  2:("2025-04-26","10.5281/zenodo.15596159","physical-constants-through-wave-confinement","Structure and Derivation of Physical Constants through Wave Confinement"),
  3:("2025-05-07","10.5281/zenodo.17743607","p-vs-np-curvature-bounded-wave-computation","P vs NP in Curvature-Bounded Wave Computation: A Model-Relative P_WCC ≠ NP_WCC Separation"),
  4:("2025-05-17","10.5281/zenodo.17206381","long-lived-photon-resonance-water-cavities","Observation of Long-Lived Photon Resonance Confinement in Water Cavities"),
  5:("2025-06-11","10.5281/zenodo.17732661","resonance-confinement-architecture","Resonance-Confinement Architecture: A Physically Bounded Substrate for Safe Superintelligence"),
  6:("2025-08-13","10.5281/zenodo.17081283","hard-upper-bound-spatial-dimensionality","Hard Upper Bound on Spatial Dimensionality in Wave Confinement Theory"),
  7:("2025-09-08","10.5281/zenodo.17578766","phase-flux-field","Phase-Flux Field (PFF): Axiomatic Substrate for Wave Confinement Theory — Zero-Wave Invariance, Finite-k Lyapunov Band-Pass, Shell Quantization, and D4 to Continuum"),
  8:("2025-09-16","10.5281/zenodo.17732648","self-emergent-fourier-cymatics","Self-Emergent Fourier Cymatics: Entropic Eigenmodes out of Chaos"),
  9:("2025-10-27","10.5281/zenodo.17459463","effective-mass-solenoidal-topology","Emergence of Effective Mass: Solenoidal Topology of Vibrational Energy"),
 10:("2025-11-11","10.5281/zenodo.20533537","rest-energy-density-weighted-loop-curvature","Rest Energy from Density-Weighted Loop Curvature: A Covariant Locking Principle"),
 11:("2025-11-20","10.5281/zenodo.17715872","juno-ghost-mode-neutrinos","JUNO Energy Resolution and Detectability of WCT Ghost-Mode Neutrinos"),
 12:("2025-11-26","10.5281/zenodo.17732642","discrete-wave-constrained-computation","Discrete Wave-Constrained Computation and Classical Complexity: Turing Equivalence for P and NP"),
 13:("2025-12-01","10.5281/zenodo.17783074","classical-p-vs-np-ill-posed","The Classical P vs NP Problem Is Mathematically and Physically Ill-Posed"),
 14:("2025-12-10","10.5281/zenodo.17887562","wct-koide-mass-relation","Wave Confinement Theory Predicts the Koide Mass Relation: A Curvature–Harmonic Origin of Fermion Mass Triplets"),
 15:("2025-12","10.5281/zenodo.17957713","photodiode-prediction-protocol-ledger","Prediction & Protocol Ledger: Long-Lived Harmonic State Induction in Photodiodes"),
 16:("2026-03-10","10.5281/zenodo.18936949","logarithmic-curvature-flow-lepton-spectrum","Logarithmic Curvature Flow, Filament Localization, and the Geometric Origin of the Lepton Mass Spectrum"),
 17:("2026-04-14","10.5281/zenodo.19578185","nuclear-fusion-tokamak-resonance","Nuclear Fusion Tokamak with Self Sustaining Resonance"),
 18:("2026-04-23","10.5281/zenodo.19705254","curvature-log-periodic-c9-deformation","A Curvature-Induced Log-Periodic Deformation of C9(q²): Wave Confinement Theory and the LHCb B⁰ → K*⁰ μ⁺μ⁻ Anomaly"),
 19:("2026-05-09","10.5281/zenodo.20164333","lhcb-log-spectral-koide-winding","Log-Spectral Structure and Koide-Like Winding Geometry in Open-Data B⁰ → K*⁰ μ⁺μ⁻ Candidate Spectra"),
 20:("2026-05","10.5281/zenodo.20142976","recursive-ai-drift-audit","Recursive AI Drift: A 2025 Prediction Timeline External Validation Audit and Technical Note"),
 21:("2026-05-28","10.5281/zenodo.20435463","nist-bin-stable-log-periodic-structure","Bin-Stable Log-Periodic Structure in Public NIST Atomic Line List"),
 22:("2025-12-01","10.5281/zenodo.19122146","wavelock-curvature-locked-one-way-function","WaveLock: A Curvature-Locked One-Way Function Based on Nonlinear PDE Evolution"),
}

TERM_FILES = [
    "paper-terms-01-04.js", "paper-terms-05.js", "paper-terms-06-11.js",
    "paper-terms-12-16.js", "paper-terms-17-22.js", "paper-terms-title-aliases.js",
]

# Corrections verified against the canonical concept-to-paper crosswalk.
FIRST_RELEASE_OVERRIDES = {
    "Curvature Locking": 4,
    "Curvature-Feedback Instability": 6,
    "Density-Weighted Curvature": 10,
    "Geometric Inertia": 9,
    "Geometric Origin of Energy": 10,
    "Geometric Mass Models": 16,
    "Geometric Mass Ratios": 14,
    "Geometric memory": 13,
    "Collapse score": 5,
    "Symbolic heartbeat": 5,
}

ROW_RE = re.compile(r'\["((?:\\.|[^"\\])*)","((?:\\.|[^"\\])*)","((?:\\.|[^"\\])*)",(\d+),"((?:\\.|[^"\\])*)","((?:\\.|[^"\\])*)"\]')
MAP_RE = re.compile(r'\["((?:\\.|[^"\\])*)",(\d+)\]')


def date_key(value: str) -> str:
    return value + ("-01" if len(value) == 7 else "")


def unique(items: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for item in items:
        key = item.casefold()
        if key not in seen:
            seen.add(key)
            out.append(item)
    return out


def load_audit() -> dict:
    audit = json.loads(AUDIT_SOURCE.read_text(encoding="utf-8"))
    batches: list[dict] = []
    survivors = list(audit.get("survivors", []))
    prior_phrase = list(audit.get("reclassifiedPriorPhrase", []))
    latest_timestamp = audit.get("auditTimestamp", "")
    latest_method = audit.get("method", "")

    for path in AUDIT_BATCH_SOURCES:
        if not path.exists():
            continue
        batch = json.loads(path.read_text(encoding="utf-8"))
        batch_survivors = list(batch.get("survivors", []))
        batch_prior = list(batch.get("priorPhraseFound", []))
        if set(x.casefold() for x in batch_survivors) & set(x.casefold() for x in batch_prior):
            raise ValueError(f"Audit batch {path.name} classifies a term as both survivor and prior-phrase")
        expected_candidates = batch.get("candidateCount")
        if expected_candidates is not None and len(batch_survivors) + len(batch_prior) != expected_candidates:
            raise ValueError(f"Audit batch {path.name} candidate count does not match classifications")
        survivors.extend(batch_survivors)
        prior_phrase.extend(batch_prior)
        batches.append({
            "source": path.name,
            "batchId": batch.get("batchId", path.stem),
            "auditTimestamp": batch.get("auditTimestamp", ""),
            "candidateCount": batch.get("candidateCount", len(batch_survivors) + len(batch_prior)),
            "survivorCount": len(batch_survivors),
            "priorPhraseCount": len(batch_prior),
        })
        if batch.get("auditTimestamp", "") > latest_timestamp:
            latest_timestamp = batch["auditTimestamp"]
            latest_method = batch.get("method", latest_method)

    audit["survivors"] = unique(survivors)
    audit["priorPhraseFound"] = unique(prior_phrase)
    audit["auditTimestamp"] = latest_timestamp
    audit["method"] = latest_method
    audit["auditBatches"] = batches

    overlap = set(x.casefold() for x in audit["survivors"]) & set(x.casefold() for x in audit["priorPhraseFound"])
    if overlap:
        raise ValueError("Merged exact-phrase audit contains survivor/prior-phrase overlap")
    if len(audit.get("strongCoined", [])) != 5:
        raise ValueError("Strong coinage set must contain exactly five terms")
    if not set(x.casefold() for x in audit["strongCoined"]).issubset(set(x.casefold() for x in audit["survivors"])):
        raise ValueError("All strong coinages must also be exact-phrase survivors")
    return audit


def add_record(records: dict[str, dict], name: str, release: int, provenance: str, audit: dict) -> None:
    if name in FIRST_RELEASE_OVERRIDES:
        release = FIRST_RELEASE_OVERRIDES[name]
    date, doi, slug, title = RELEASES[release]
    survivors = set(audit["survivors"])
    strong = set(audit["strongCoined"])
    prior_phrase = set(audit.get("priorPhraseFound", audit.get("reclassifiedPriorPhrase", [])))

    if name in strong:
        final_provenance = "Coined by Reyes"
        lexical_status = "strong_explicit_coinage"
        priority_type = "explicit_terminology_priority"
    elif name in survivors:
        final_provenance = "WCT-defined"
        lexical_status = "exact_phrase_survivor"
        priority_type = "exact_phrase_priority_survivor"
    elif name in prior_phrase:
        final_provenance = "WCT-defined"
        lexical_status = "prior_phrase_found"
        priority_type = "dated_wct_definition_or_specialization"
    else:
        final_provenance = "WCT-defined" if provenance != "Established / external" else provenance
        lexical_status = "not_in_exact_phrase_survivor_set"
        priority_type = "dated_wct_definition_or_specialization"

    incoming = {
        "term": name,
        "provenance": final_provenance,
        "sourceRelease": release,
        "publicRecordDate": date,
        "doi": doi,
        "sourceTitle": title,
        "sourceUrl": f"https://rickyjreyes.github.io/publications/{slug}.html",
        "priorityType": priority_type,
        "lexicalAuditStatus": lexical_status,
    }
    old = records.get(name.casefold())
    if old is None or date_key(date) < date_key(old["publicRecordDate"]):
        records[name.casefold()] = incoming


def parse_terms(audit: dict) -> list[dict]:
    records: dict[str, dict] = {}
    for filename in TERM_FILES:
        text = (GLOSSARY / filename).read_text(encoding="utf-8")
        for m in ROW_RE.finditer(text):
            name = json.loads('"' + m.group(1) + '"')
            release = int(m.group(4))
            provenance = json.loads('"' + m.group(5) + '"')
            add_record(records, name, release, provenance, audit)

    canonical = (GLOSSARY / "paper-terms-canonical.js").read_text(encoding="utf-8")
    segment = canonical.split("const mappings=[", 1)[1].split("];", 1)[0]
    for m in MAP_RE.finditer(segment):
        name = json.loads('"' + m.group(1) + '"')
        add_record(records, name, int(m.group(2)), "WCT-defined", audit)

    # The May 2026 RCA audit points back to the June 2025 RCA record for the five surviving explicit coinages.
    for name in audit["strongCoined"]:
        add_record(records, name, 5, "Coined by Reyes", audit)
        records[name.casefold()]["priorityAuditRelease"] = 20
        records[name.casefold()]["priorityAuditDoi"] = RELEASES[20][1]

    # Only the two historical RCA badge corrections need their release forced back to Release 05.
    for name in audit.get("reclassifiedPriorPhrase", []):
        add_record(records, name, 5, "WCT-defined", audit)

    missing = [name for name in audit["survivors"] if name.casefold() not in records]
    if missing:
        raise ValueError("Exact-phrase survivors missing from terminology crosswalk: " + "; ".join(missing))

    return sorted(records.values(), key=lambda r: (date_key(r["publicRecordDate"]), r["term"].casefold()))


def build_registry(terms: list[dict], audit: dict) -> dict:
    releases = []
    for n, (date, doi, slug, title) in RELEASES.items():
        releases.append({
            "release": n, "date": date, "doi": doi, "title": title,
            "url": f"https://rickyjreyes.github.io/publications/{slug}.html",
            "termCount": sum(1 for t in terms if t["sourceRelease"] == n),
        })
    survivor_count = sum(1 for t in terms if t["lexicalAuditStatus"] in {"exact_phrase_survivor", "strong_explicit_coinage"})
    strong_count = sum(1 for t in terms if t["lexicalAuditStatus"] == "strong_explicit_coinage")
    prior_count = sum(1 for t in terms if t["lexicalAuditStatus"] == "prior_phrase_found")
    return {
        "schemaVersion": "1.2",
        "registryName": "Richard J. Reyes WCT Terminology Priority Crosswalk",
        "auditTimestamp": audit["auditTimestamp"],
        "scope": "Paper-by-paper terminology crosswalk for all 22 DOI-archived releases, augmented by exact-phrase lexical-priority audits.",
        "prioritySemantics": {
            "explicit_terminology_priority": "A term is explicitly claimed by the Reyes corpus as a coinage and no earlier indexed exact-phrase occurrence was located in the recorded lexical audit. This remains an evidence-bounded historical priority claim, not proof that the phrase never appeared anywhere.",
            "exact_phrase_priority_survivor": "The WCT/RCA public record predates every indexed external exact-phrase occurrence located in the recorded search. Obvious hyphen/dash variants are treated as equivalent. Canonical alias bundles are checked against their named aliases so a synthetic combined label cannot manufacture lexical priority. This is reported as no earlier indexed exact occurrence located, not as universal proof of coinage.",
            "dated_wct_definition_or_specialization": "The date identifies the mapped DOI-archived WCT public record for a project-specific name, construction, or specialized definition. It does not itself assert lexical priority.",
            "prior_phrase_found": "The phrase has an earlier unrelated external use; the WCT/RCA-specific definition remains attributable to this corpus, but the words are not claimed as coined by Reyes.",
            "auditTimestamp": "The audit timestamp records when the latest lexical-priority batch was assembled; it is not substituted for the earlier DOI/public-record dates.",
        },
        "lexicalAuditMethod": audit["method"],
        "audit": {
            "releaseCount": 22,
            "termCount": len(terms),
            "exactPhraseSurvivorCount": survivor_count,
            "exactPhraseNonCoinedCount": survivor_count - strong_count,
            "strongExplicitCoinageCount": strong_count,
            "priorPhraseFoundCount": prior_count,
            "priorPhraseReclassifiedCount": len(audit.get("reclassifiedPriorPhrase", [])),
            "notInSurvivorSetCount": len(terms) - survivor_count,
        },
        "auditBatches": audit.get("auditBatches", []),
        "priorPhraseFound": audit.get("priorPhraseFound", []),
        "reclassifiedPriorPhrase": audit.get("reclassifiedPriorPhrase", []),
        "releases": releases,
        "terms": terms,
    }


def write_outputs(registry: dict) -> None:
    JSON_OUT.parent.mkdir(parents=True, exist_ok=True)
    JSON_OUT.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    js = "window.WCT_TERMINOLOGY_PRIORITY = " + json.dumps(registry, ensure_ascii=False, separators=(",", ":")) + ";\n"
    js += """(() => {\nconst reg=window.WCT_TERMINOLOGY_PRIORITY||{};\nconst by=new Map((reg.terms||[]).map(r=>[String(r.term).toLocaleLowerCase(),r]));\nconst terms=Array.isArray(window.WCT_GLOSSARY_ALL)?window.WCT_GLOSSARY_ALL:[];\nfor(const t of terms){const r=by.get(String(t.name||'').toLocaleLowerCase());if(!r)continue;t.provenance=r.provenance;t.public_record_date=r.publicRecordDate;t.doi=r.doi;t.priority_type=r.priorityType;t.lexical_audit_status=r.lexicalAuditStatus;t.priority_record='/priority/terminology/#term-'+String(r.term||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}\n// Collapse the obsolete ASCII-hyphen alias into the canonical en-dash RCA term.\nconst alias='Propagation-correction criticality',canonical='Propagation–correction criticality';\nconst ai=terms.findIndex(t=>t.name===alias),ci=terms.findIndex(t=>t.name===canonical);\nif(ai>=0&&ci>=0){if(!terms[ci].notation&&terms[ai].notation)terms[ci].notation=terms[ai].notation;terms.splice(ai,1);}\nwindow.WCT_GLOSSARY_META={...(window.WCT_GLOSSARY_META||{}),terminology_priority_count:(reg.audit||{}).termCount||0,exact_phrase_survivor_count:(reg.audit||{}).exactPhraseSurvivorCount||0,strong_coinage_count:(reg.audit||{}).strongExplicitCoinageCount||0,terminology_priority_audit:reg.auditTimestamp||''};\n})();\n"""
    JS_OUT.write_text(js, encoding="utf-8")


def patch_index() -> None:
    text = INDEX.read_text(encoding="utf-8")
    if '<script src="terminology-priority.js"></script>' not in text:
        text = text.replace('<script src="paper-terms-canonical.js"></script>', '<script src="paper-terms-canonical.js"></script>\n<script src="paper-terms-title-aliases.js"></script>\n<script src="terminology-priority.js"></script>')
    elif '<script src="paper-terms-title-aliases.js"></script>' not in text:
        text = text.replace('<script src="terminology-priority.js"></script>', '<script src="paper-terms-title-aliases.js"></script>\n<script src="terminology-priority.js"></script>')
    if 'Terminology priority' not in text:
        text = text.replace('<a href="../graph/">Graph</a>', '<a href="../graph/">Graph</a><a href="../../priority/terminology/">Terminology priority</a>')
    INDEX.write_text(text, encoding="utf-8")


def patch_llms() -> None:
    text = LLMS.read_text(encoding="utf-8")
    nav = "- Terminology priority crosswalk: https://rickyjreyes.github.io/priority/terminology/\n"
    machine = "- Terminology-priority metadata: https://rickyjreyes.github.io/priority/terminology-priority.json\n"
    lexical = "- Exact-phrase terminology audit source: https://rickyjreyes.github.io/data/terminology_exact_phrase_audit.json\n"
    lexical_batch = "- Supplemental 44-term exact-phrase audit: https://rickyjreyes.github.io/data/terminology_exact_phrase_audit_44_additions.json\n"
    if nav not in text:
        text = text.replace("- Claim-level priority registry: https://rickyjreyes.github.io/priority/\n", "- Claim-level priority registry: https://rickyjreyes.github.io/priority/\n" + nav)
    if machine not in text:
        text = text.replace("- Claim-priority metadata: https://rickyjreyes.github.io/priority/priority.json\n", "- Claim-priority metadata: https://rickyjreyes.github.io/priority/priority.json\n" + machine)
    if lexical not in text:
        text = text.replace(machine, machine + lexical)
    if lexical_batch not in text:
        text = text.replace(lexical, lexical + lexical_batch)
    rule = "- Terminology priority has separate levels: five audit-surviving explicit Reyes coinages; additional exact-phrase survivors for which no earlier indexed exact occurrence was located; WCT-defined specializations without lexical-priority claims; and established/external vocabulary. Do not promote an exact-phrase survivor to universal historical coinage.\n"
    if rule not in text:
        text = text.replace("- Preserve the distinction between archival titles and current qualified claim status.\n", "- Preserve the distinction between archival titles and current qualified claim status.\n" + rule)
    LLMS.write_text(text, encoding="utf-8")


def main() -> None:
    audit = load_audit()
    terms = parse_terms(audit)
    registry = build_registry(terms, audit)
    write_outputs(registry)
    patch_index()
    patch_llms()
    print(
        f"Wrote terminology registry: {len(terms)} records; "
        f"{registry['audit']['exactPhraseSurvivorCount']} exact-phrase survivors; "
        f"{registry['audit']['priorPhraseFoundCount']} prior-phrase findings; "
        f"{registry['audit']['strongExplicitCoinageCount']} strong explicit coinages; "
        f"audit {audit['auditTimestamp']}"
    )


if __name__ == "__main__":
    main()
