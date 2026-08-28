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
AUDIT_TIMESTAMP = "2026-08-28T13:31:00-07:00"

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
COINED = {
    "Coherence mirage", "Semantic anchor decay", "Propagation–correction criticality",
    "Collapse score", "Symbolic heartbeat", "Physical Symbolic Kill Logic",
    "Confinement Termination Principle",
}
# Corrections verified against the canonical Obsidian concept-to-paper crosswalk.
FIRST_RELEASE_OVERRIDES = {
    "Curvature Locking": 4,
    "Curvature-Feedback Instability": 6,
    "Density-Weighted Curvature": 10,
    "Geometric Inertia": 9,
    "Geometric Origin of Energy": 10,
    "Geometric Mass Models": 16,
    "Geometric Mass Ratios": 14,
    "Geometric memory": 13,
}

ROW_RE = re.compile(r'\["((?:\\.|[^"\\])*)","((?:\\.|[^"\\])*)","((?:\\.|[^"\\])*)",(\d+),"((?:\\.|[^"\\])*)","((?:\\.|[^"\\])*)"\]')
MAP_RE = re.compile(r'\["((?:\\.|[^"\\])*)",(\d+)\]')


def date_key(value: str) -> str:
    return value + ("-01" if len(value) == 7 else "")


def add_record(records: dict[str, dict], name: str, release: int, provenance: str = "WCT-defined") -> None:
    if name in FIRST_RELEASE_OVERRIDES:
        release = FIRST_RELEASE_OVERRIDES[name]
    date, doi, slug, title = RELEASES[release]
    incoming = {
        "term": name,
        "provenance": "Coined by Reyes" if name in COINED else provenance,
        "sourceRelease": release,
        "publicRecordDate": date,
        "doi": doi,
        "sourceTitle": title,
        "sourceUrl": f"https://rickyjreyes.github.io/publications/{slug}.html",
        "priorityType": "explicit_terminology_priority" if name in COINED else "dated_wct_definition_or_specialization",
    }
    old = records.get(name.casefold())
    if old is None or date_key(date) < date_key(old["publicRecordDate"]):
        records[name.casefold()] = incoming


def parse_terms() -> list[dict]:
    records: dict[str, dict] = {}
    for filename in TERM_FILES:
        text = (GLOSSARY / filename).read_text(encoding="utf-8")
        for m in ROW_RE.finditer(text):
            name = json.loads('"' + m.group(1) + '"')
            release = int(m.group(4))
            provenance = json.loads('"' + m.group(5) + '"')
            add_record(records, name, release, provenance)

    canonical = (GLOSSARY / "paper-terms-canonical.js").read_text(encoding="utf-8")
    segment = canonical.split("const mappings=[", 1)[1].split("];", 1)[0]
    for m in MAP_RE.finditer(segment):
        name = json.loads('"' + m.group(1) + '"')
        add_record(records, name, int(m.group(2)))

    # The May 2026 audit explicitly points back to the June 2025 RCA record for these terms.
    for name in COINED:
        add_record(records, name, 5, "Coined by Reyes")
        records[name.casefold()]["priorityAuditRelease"] = 20
        records[name.casefold()]["priorityAuditDoi"] = RELEASES[20][1]

    return sorted(records.values(), key=lambda r: (date_key(r["publicRecordDate"]), r["term"].casefold()))


def build_registry(terms: list[dict]) -> dict:
    releases = []
    for n, (date, doi, slug, title) in RELEASES.items():
        releases.append({
            "release": n, "date": date, "doi": doi, "title": title,
            "url": f"https://rickyjreyes.github.io/publications/{slug}.html",
            "termCount": sum(1 for t in terms if t["sourceRelease"] == n),
        })
    return {
        "schemaVersion": "1.0",
        "registryName": "Richard J. Reyes WCT Terminology Priority Crosswalk",
        "auditTimestamp": AUDIT_TIMESTAMP,
        "scope": "Paper-by-paper terminology crosswalk for all 22 DOI-archived releases in the public WCT publication corpus.",
        "prioritySemantics": {
            "dated_wct_definition_or_specialization": "The date identifies the mapped DOI-archived WCT public record for this project-specific name, construction, or specialized definition. It does not by itself assert that the underlying words or generic mechanism had no earlier use elsewhere.",
            "explicit_terminology_priority": "The corpus contains an explicit terminology-priority statement tying this RCA-specific wording to the June 2025 record; the May 2026 audit is retained as the public priority-audit anchor.",
            "auditTimestamp": "The audit timestamp records when this crosswalk was assembled. It is not substituted for the earlier DOI/public-record dates.",
        },
        "audit": {
            "releaseCount": 22,
            "termCount": len(terms),
            "explicitCoinedCount": sum(1 for t in terms if t["priorityType"] == "explicit_terminology_priority"),
        },
        "releases": releases,
        "terms": terms,
    }


def write_outputs(registry: dict) -> None:
    JSON_OUT.parent.mkdir(parents=True, exist_ok=True)
    JSON_OUT.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    js = "window.WCT_TERMINOLOGY_PRIORITY = " + json.dumps(registry, ensure_ascii=False, separators=(",", ":")) + ";\n"
    js += """(() => {\nconst reg=window.WCT_TERMINOLOGY_PRIORITY||{};\nconst by=new Map((reg.terms||[]).map(r=>[String(r.term).toLocaleLowerCase(),r]));\nconst terms=Array.isArray(window.WCT_GLOSSARY_ALL)?window.WCT_GLOSSARY_ALL:[];\nfor(const t of terms){const r=by.get(String(t.name||'').toLocaleLowerCase());if(!r)continue;t.public_record_date=r.publicRecordDate;t.doi=r.doi;t.priority_type=r.priorityType;t.priority_record='/priority/terminology/#term-'+String(t.name||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}\nwindow.WCT_GLOSSARY_META={...(window.WCT_GLOSSARY_META||{}),terminology_priority_count:(reg.audit||{}).termCount||0,terminology_priority_audit:reg.auditTimestamp||''};\n})();\n"""
    JS_OUT.write_text(js, encoding="utf-8")


def patch_index() -> None:
    text = INDEX.read_text(encoding="utf-8")
    if '<script src="terminology-priority.js"></script>' not in text:
        text = text.replace('<script src="paper-terms-canonical.js"></script>', '<script src="paper-terms-canonical.js"></script>\n<script src="paper-terms-title-aliases.js"></script>\n<script src="terminology-priority.js"></script>')
    elif '<script src="paper-terms-title-aliases.js"></script>' not in text:
        text = text.replace('<script src="terminology-priority.js"></script>', '<script src="paper-terms-title-aliases.js"></script>\n<script src="terminology-priority.js"></script>')
    if 'Terminology priority' not in text:
        text = text.replace('<a href="../graph/">Graph</a>', '<a href="../graph/">Graph</a><a href="../../priority/terminology/">Terminology priority</a>')
    text = text.replace("source_title:t.source_title||prior.source_title||''", "source_title:t.source_title||prior.source_title||'',public_record_date:t.public_record_date||prior.public_record_date||'',doi:t.doi||prior.doi||'',priority_type:t.priority_type||prior.priority_type||'',priority_record:t.priority_record||prior.priority_record||''")
    text = text.replace("t.source_title,t.release].join(' ')", "t.source_title,t.release,t.public_record_date,t.doi].join(' ')")
    old = "${t.notation?`<div class=\"glossary-notation\"><strong>Notation</strong><code>${esc(t.notation)}</code></div>`:''}<a class=\"glossary-equation-link\" href=\"../equations/?q=${encodeURIComponent(t.name)}\">Find related equations →</a>"
    new = "${t.notation?`<div class=\"glossary-notation\"><strong>Notation</strong><code>${esc(t.notation)}</code></div>`:''}${t.public_record_date?`<div class=\"glossary-notation\"><strong>Public WCT record</strong><a href=\"${esc(t.priority_record||'../../priority/terminology/')}\">${esc(t.public_record_date)}</a>${t.doi?`<code>${esc(t.doi)}</code>`:''}</div>`:''}<a class=\"glossary-equation-link\" href=\"../equations/?q=${encodeURIComponent(t.name)}\">Find related equations →</a>"
    text = text.replace(old, new)
    text = text.replace("${meta.audited_wct_terms||0} WCT-defined/priority terminology records are mapped to source releases.", "${meta.terminology_priority_count||meta.audited_wct_terms||0} timestamped terminology records are mapped to source releases and DOI anchors.${meta.terminology_priority_audit?` Priority crosswalk audited ${meta.terminology_priority_audit}.`:''}")
    INDEX.write_text(text, encoding="utf-8")


def patch_llms() -> None:
    text = LLMS.read_text(encoding="utf-8")
    nav = "- Terminology priority crosswalk: https://rickyjreyes.github.io/priority/terminology/\n"
    machine = "- Terminology-priority metadata: https://rickyjreyes.github.io/priority/terminology-priority.json\n"
    if nav not in text:
        text = text.replace("- Claim-level priority registry: https://rickyjreyes.github.io/priority/\n", "- Claim-level priority registry: https://rickyjreyes.github.io/priority/\n" + nav)
    if machine not in text:
        text = text.replace("- Claim-priority metadata: https://rickyjreyes.github.io/priority/priority.json\n", "- Claim-priority metadata: https://rickyjreyes.github.io/priority/priority.json\n" + machine)
    rule = "- For glossary provenance, distinguish an explicit coined-term priority record from a WCT-specific definition or specialization of older vocabulary; use terminology-priority.json for the dated DOI/public-record anchor.\n"
    if rule not in text:
        text = text.replace("- Preserve the distinction between archival titles and current qualified claim status.\n", "- Preserve the distinction between archival titles and current qualified claim status.\n" + rule)
    LLMS.write_text(text, encoding="utf-8")


def main() -> None:
    terms = parse_terms()
    registry = build_registry(terms)
    write_outputs(registry)
    patch_index()
    patch_llms()
    print(f"Wrote terminology priority registry with {len(terms)} dated records; audit {AUDIT_TIMESTAMP}")


if __name__ == "__main__":
    main()
