#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "tools" / "glossary" / "all-terms.js"
SOURCE_URL = (
    "https://raw.githubusercontent.com/rickyjreyes/obsidian/main/"
    "Research/03%20Glossary/WCT%20Glossary.md"
)

# These seven terms are explicitly identified in the dated Recursive AI Drift
# priority audit as RCA-specific terminology introduced in the June 2025 record.
COINED_BY_REYES = {
    "coherence mirage",
    "semantic anchor decay",
    "propagation-correction criticality",
    "collapse score",
    "symbolic heartbeat",
    "physical symbolic kill logic",
    "confinement termination principle",
}

# Project-specific names and constructions. This label means the corpus gives
# the term a specific WCT/Reyes definition; it is not a global first-use claim.
WCT_DEFINED = {
    "wave confinement theory",
    "phase-flux field",
    "phase–flux field",
    "wave curvature computation",
    "wave-constrained computation",
    "curvature-bounded computation",
    "curvature capacity",
    "curvature complexity",
    "p_wcc",
    "np_wcc",
    "physical p≠np",
    "wavelock",
    "curvachain",
    "resonance-confinement architecture",
    "recursive ai drift",
    "rca",
    "curvature-koide invariant",
    "curvature-induced mass shift",
    "spin-curvature partition",
    "torsion budget",
    "distinguishability curvature",
    "locked expander",
    "active-domain winding",
    "candidate-spectrum geometry",
    "koide comb",
    "ghost harmonics",
    "intelligent resonance",
    "first law of intelligent resonance",
    "lyapunov band-pass",
    "curvature locking",
    "density-weighted curvature",
    "curvature-based cryptography",
    "wavefield commitment schemes",
    "shell quantization",
    "photodiode harmonic state",
    "swift–hohenberg rail",
    "finite-band selection",
    "ghost-mode modulation",
    "kde baseline repair",
    "koide-like winding",
    "spectral shell",
    "ψ-field",
}

SUPPLEMENTS = [
    {
        "name": "CurvaChain",
        "definition": "CurvaChain is the ledger-oriented branch of the WaveLock research program, using deterministic state evolution, curvature-derived invariants, and chained commitments to record and verify state transitions.",
        "family": "Computation",
        "notation": "curvature-linked ledger",
        "provenance": "WCT-defined",
    },
    {
        "name": "Symbolic heartbeat",
        "definition": "Symbolic heartbeat is an RCA diagnostic concept for periodically checking whether a recursively evolving symbolic system still preserves its defining anchors, constraints, and identity-bearing relationships.",
        "family": "AI / drift",
        "notation": "periodic anchor check",
        "provenance": "Coined by Reyes",
    },
    {
        "name": "Physical Symbolic Kill Logic",
        "definition": "Physical Symbolic Kill Logic is an RCA safety concept in which a recursive symbolic process is terminated when measured drift, collapse, or constraint-loss criteria cross a declared physical or computational boundary.",
        "family": "AI / drift",
        "notation": "termination guard",
        "provenance": "Coined by Reyes",
    },
    {
        "name": "Confinement Termination Principle",
        "definition": "The Confinement Termination Principle states that a recursively evolving system should be halted when it can no longer remain inside its declared semantic, symbolic, or operational confinement bounds.",
        "family": "AI / drift",
        "notation": "terminate outside confinement",
        "provenance": "Coined by Reyes",
    },
    {
        "name": "Photodiode harmonic state",
        "definition": "Photodiode harmonic state is the corpus shorthand for the experimentally monitored long-lived electrical and spectral state associated with waveform, FFT, harmonic-ratio, persistence, and relocking diagnostics in the photodiode program.",
        "family": "Evidence",
        "notation": "photodiode FFT state",
        "provenance": "WCT-defined",
    },
    {
        "name": "Swift–Hohenberg rail",
        "definition": "Swift–Hohenberg rail is the WCT name for using a Swift–Hohenberg-type finite-wavenumber selector as a stabilizing spectral rail that favors a bounded shell of modes over broadband growth.",
        "family": "Spectral",
        "notation": "(Δ+k_*²)²A",
        "provenance": "WCT-defined",
    },
    {
        "name": "ψ-field",
        "definition": "The ψ-field is the complex wavefield used as the central state variable for phase, curvature, confinement, energy, and localization calculations across the WCT mathematical corpus.",
        "family": "Core field",
        "notation": "ψ(x,t)",
        "provenance": "WCT-defined",
    },
]


def clean(value: str) -> str:
    value = re.sub(r"\[\[([^\]|]+)\|([^\]]+)\]\]", r"\2", value)
    value = re.sub(r"\[\[([^\]]+)\]\]", r"\1", value)
    value = value.replace("**", "").replace("`", "")
    value = re.sub(r"\s+", " ", value).strip()
    value = re.sub(r"^(Description|Overview)\s*", "", value, flags=re.I)
    return value


def concise(value: str) -> str:
    value = clean(value)
    if len(value) <= 460:
        return value
    head = value[:460]
    stops = [head.rfind(". "), head.rfind("; "), head.rfind(", ")]
    cut = max(stops)
    if cut >= 180:
        return head[: cut + 1].strip()
    return head.rstrip() + "…"


def family_for(name: str, definition: str) -> str:
    text = f"{name} {definition}".lower()
    if re.search(r"ai |agent|alignment|drift|semantic|curriculum|model collapse|autonomous|symbolic heartbeat|kill logic", text):
        return "AI / drift"
    if re.search(r"curvature|torsion|soliton|mass|koide|compton|metric|inertia", text):
        return "Curvature"
    if re.search(r"fourier|spectral|harmonic|frequency|band|shell|mode|fft|cymatic|wavenumber", text):
        return "Spectral"
    if re.search(r"topolog|winding|loop|knot|holonomy|spinor", text):
        return "Topology"
    if re.search(r"sobolev|lyapunov|stability|regularity|dimension bound|invariant", text):
        return "Stability"
    if re.search(r"comput|complexity|wcc|p vs|p versus|3-sat|cryptograph|cellular automata|turing|verifier|sat", text):
        return "Computation"
    if re.search(r"nist|lhc|juno|photodiode|detector|data|likelihood|null|veto|experiment|signal|poisson|bootstrap", text):
        return "Evidence"
    if re.search(r"tokamak|plasma|control|fusion|transport|actuator|barrier|mhd", text):
        return "Control / fusion"
    if re.search(r"cosmolog|gravity|photon|horizon|planck|spacetime", text):
        return "Cosmology"
    return "Core field"


def provenance_for(name: str) -> str:
    key = name.casefold()
    if key in COINED_BY_REYES:
        return "Coined by Reyes"
    if key in WCT_DEFINED:
        return "WCT-defined"
    return "Established / external"


def canonical_name(name: str) -> str:
    if name.casefold() == "phase-flux field":
        return "Phase–Flux Field"
    return name


def fetch_source() -> str:
    req = urllib.request.Request(SOURCE_URL, headers={"User-Agent": "wct-glossary-sync/1.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read().decode("utf-8")


def parse(markdown: str) -> list[dict]:
    rx = re.compile(
        r"^\s*-\s+\*\*\[\[([^\]|]+)(?:\|([^\]]+))?\]\]\*\*\s+—\s+(.+)$",
        re.M,
    )
    rows: list[dict] = []
    seen: set[str] = set()
    for match in rx.finditer(markdown):
        name = canonical_name(clean(match.group(2) or match.group(1).split("/")[-1]))
        definition = concise(match.group(3))
        if not name or not definition:
            continue
        key = name.casefold()
        if key in seen:
            continue
        seen.add(key)
        rows.append(
            {
                "name": name,
                "definition": definition,
                "family": family_for(name, definition),
                "notation": "",
                "provenance": provenance_for(name),
            }
        )

    for item in SUPPLEMENTS:
        key = item["name"].casefold()
        if key in seen:
            for row in rows:
                if row["name"].casefold() == key:
                    row.update(item)
                    break
        else:
            rows.append(dict(item))
            seen.add(key)

    rows.sort(key=lambda row: row["name"].casefold())
    return rows


def main() -> None:
    try:
        markdown = fetch_source()
        rows = parse(markdown)
        if len(rows) < 100:
            raise RuntimeError(f"parsed only {len(rows)} terms; refusing to replace complete glossary inventory")
    except Exception as exc:
        if OUT.exists():
            print(f"Glossary sync warning: {exc}. Keeping existing {OUT.relative_to(ROOT)}")
            return
        raise

    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = (
        "// Generated from rickyjreyes/obsidian Research/03 Glossary/WCT Glossary.md.\n"
        "// Do not hand-edit; update the source glossary or sync script instead.\n"
        f"window.WCT_GLOSSARY_ALL = {json.dumps(rows, ensure_ascii=False, indent=2)};\n"
        "window.WCT_GLOSSARY_META = "
        + json.dumps(
            {
                "source": "rickyjreyes/obsidian",
                "path": "Research/03 Glossary/WCT Glossary.md",
                "count": len(rows),
            },
            ensure_ascii=False,
            indent=2,
        )
        + ";\n"
    )
    OUT.write_text(payload, encoding="utf-8")
    print(f"Wrote {len(rows)} glossary terms to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
