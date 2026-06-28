#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "equations" / "equations.json"
COMPILED_PATH = ROOT / "compiled-registry.json"
HTML_PATH = ROOT / "equations" / "index.html"
TOOLS_PATH = ROOT / "tools" / "equations-data.js"

CURATED_DEFINITIONS = {
    "M1": "A loop-locking variational functional whose stationary configurations relate phase winding to averaged curve curvature. The mass interpretation requires the explicit locking, orientation, and weighting assumptions recorded for E5.",
    "M2": "The complex-safe regularized reciprocal and curvature-feedback operator. Positivity of the modulus-squared denominator removes the historical scalar zero; this does not by itself prove global PDE stability or uniqueness.",
    "M3": "A Swift–Hohenberg-type finite-band selector whose Fourier symbol damps modes away from the preferred shell. It establishes the linear spectral rail, not global nonlinear pattern selection.",
    "M4": "The standard Sobolev threshold H²→L∞ for integer spatial dimension n≤3. This is a regularity threshold and not, by itself, a universal theorem that all stable confinement is impossible above three dimensions.",
    "M5": "A local discrete update architecture proposed for curvature-bounded computation. Complexity conclusions additionally require a fixed encoding, precision model, update cost, and finite physical-resource bound.",
    "E2": "The normalized weighted loop average for a nonnegative weight with nonzero total weight. It preserves the dimension of the averaged quantity but does not select a physical weighting measure.",
    "E3": "A constrained phase-curvature mismatch action. Nonnegative weighting makes its squared mismatch term nonnegative; existence and uniqueness of continuum minimizers require separate analysis.",
    "E5": "The effective-wavenumber identification connecting phase winding, integrated curvature, and the weighted curvature average. The chain is derived only under compatible orientation, exact integrated locking, and a positive constant-weight condition.",
    "E6": "A dimensionally consistent mapping from an effective inverse-length scale to rest energy and mass. The PASS establishes dimensional closure, not that WCT dynamics generates observed particle masses.",
    "E7": "The solenoidal form of the mass-curvature mapping using an averaged curve-curvature magnitude. Its physical prediction requires a specified averaging measure and a dynamically selected geometry.",
    "E9": "The phase-current identity obtained from a supplied polar representation of the complex field. The finite algebraic identity does not replace a function-space proof of full polar differentiation and conservation dynamics.",
    "E12": "The quartic finite-band dispersion relation with a stationary maximum at the selected nonzero wavenumber. It verifies the preferred linear shell and damping sign.",
    "E13": "The registered finite-band amplitude evolution equation. Its gradient-flow form follows under the stated functional and sign convention; nonlinear existence and long-time selection remain separate obligations.",
    "E14": "The energy functional associated with the finite-band amplitude equation. The variational relation is supported under exact negative gradient flow, while full functional-analytic Lyapunov theory remains conditional.",
    "E18": "A WCT energy candidate whose nonnegative terms and exact negative-gradient-flow hypothesis imply monotone descent. The full chain rule and PDE well-posedness are not established by the algebraic PASS.",
    "E19": "A proposed scaling between a spectral gap and curvature scale. Its dimensional structure is consistent, but the proportionality, spectral derivation, and physical calibration remain model dependent.",
    "E24": "The H²-to-L∞ Sobolev embedding threshold used by the dimensionality argument. It supplies a standard regularity condition, not a complete nonlinear stability theorem.",
    "E30": "The normalized Shannon entropy of a finite spectral distribution and its standard bounds. This is a standard information-theoretic identity rather than a WCT-specific physical result.",
    "E36": "The local discrete WCC state-update rule on a prescribed neighborhood. It defines the computational dynamics but does not establish a classical complexity-class equivalence.",
    "E40": "The proposed identification between the WCC resource model and a complexity claim. It remains conditional on encoding, precision, update-cost, and simulation-overhead assumptions.",
    "E49": "The dimensionally corrected relation between an effective spectral gap and squared effective mass. Dimensional consistency does not determine the gap dynamically or calibrate an observed mass spectrum.",
    "E58": "The band-selective Green kernel. A positive spectral offset yields positivity and the bound G(k)≤1/r; the offset and its physical interpretation remain model assumptions.",
    "E67": "The failure, in general, of the H²-to-L∞ embedding above three spatial dimensions. This blocks that regularity route but does not exclude every possible higher-dimensional confinement mechanism.",
    "E70": "The conditional WCT dimensional-stability criterion combining the Sobolev threshold with additional confinement hypotheses. It is not a proved biconditional characterization of all stable WCT solutions.",
    "E71": "A proposed physical computation resource bound. Its use in complexity theory requires an explicit machine model, precision accounting, and proof that all relevant resources are included.",
    "E76": "A conditional equivalence claim between curvature-bounded computation and a classical complexity description. The equivalence is not established without explicit simulation and overhead bounds.",
    "TOP7": "A conditional proportionality between a topological curvature-energy proxy and WCT mass within a fixed normalization and topology class. The absolute scale and broader state-selection rule require calibration and derivation.",
}


def refine(obj: dict) -> str:
    object_id = obj["id"]
    if object_id in CURATED_DEFINITIONS:
        return CURATED_DEFINITIONS[object_id]

    raw = obj.get("definition", "").strip()
    raw = re.sub(r"^(?:Let|Define|Then|Equivalently)\b[\s,.:;-]*", "", raw, flags=re.I)
    raw = re.sub(r"^For\s+\$[^$]+\$,?\s*define\s*", "", raw, flags=re.I)
    raw = re.sub(r"\$([^$]+)\$", r"\\(\1\\)", raw)
    raw = re.sub(r"\s+", " ", raw).strip()
    if len(raw) >= 35:
        return raw[:1200]
    return f"The canonical registered object for {obj['title'].lower()}; consult the source equation and verification metadata for its assumptions and scientific boundary."


def main() -> None:
    objects = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    for obj in objects:
        obj["definition"] = refine(obj)
    JSON_PATH.write_text(json.dumps(objects, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    compiled = json.loads(COMPILED_PATH.read_text(encoding="utf-8"))
    compiled_by_id = {obj["canonical_id"]: obj for obj in compiled["objects"]}
    for obj in objects:
        if obj["id"] not in compiled_by_id:
            raise RuntimeError(f"Compiled registry is missing {obj['id']}")
        compiled_by_id[obj["id"]]["definition"] = obj["definition"]
    COMPILED_PATH.write_text(json.dumps(compiled, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    page = HTML_PATH.read_text(encoding="utf-8")
    for obj in objects:
        pattern = re.compile(
            rf'(<article class="equation-entry[^"]*" id="{re.escape(obj["id"])}".*?'
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
            "verification_kind": obj.get("verification_kind"),
            "source": obj["source"],
        }
        for obj in objects
    ]
    TOOLS_PATH.write_text(
        "window.WCT_EQUATIONS = " + json.dumps(tool_objects, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )
    print(f"Preserved canonical definitions and curated {len(CURATED_DEFINITIONS)} load-bearing objects across HTML and machine-readable registries.")


if __name__ == "__main__":
    main()
