#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "publications" / "hard-upper-bound-spatial-dimensionality.html"

OLD_SUMMARY = "This work argues that stable curvature-locked confinement in the stated WCT framework is restricted to at most three spatial dimensions. It combines Sobolev control, Lyapunov scaling, entropy localization, topology, and curvature-feedback behavior into several routes toward the same dimensional stability bound."
NEW_SUMMARY = "This work develops a three-dimensional stability threshold under the stated WCT H²-confinement and regularity hypotheses. The verified Sobolev result establishes the H²-to-L∞ threshold for integer n≤3; the broader claim that every admissible higher-dimensional confinement mechanism is unstable remains conditional."
OLD_LIMIT = "The bound is derived within the stated WCT assumptions; its scope is conditional on that framework and its modeling choices."
NEW_LIMIT = "The registered E70 claim is CONDITIONAL. Failure of the general H²-to-L∞ embedding route above three dimensions does not by itself prove a universal impossibility theorem for every conceivable WCT confinement mechanism. The archival title and DOI citation are preserved unchanged."


def main() -> None:
    text = PAGE.read_text(encoding="utf-8")
    if OLD_SUMMARY not in text and NEW_SUMMARY not in text:
        raise RuntimeError("Dimensionality summary text not found")
    if OLD_LIMIT not in text and NEW_LIMIT not in text:
        raise RuntimeError("Dimensionality limitations text not found")
    text = text.replace(OLD_SUMMARY, NEW_SUMMARY)
    text = text.replace(OLD_LIMIT, NEW_LIMIT)
    notice = '<div class="notice"><strong>Current registry boundary:</strong> E70 is CONDITIONAL. The n≤3 Sobolev threshold supports the declared H² regularity route; it is not a proved biconditional characterization of all stable WCT solutions. <a href="../equations/#E70">Open E70.</a></div>'
    marker = '<section class="paper-section"><h2>Abstract</h2>'
    if "Current registry boundary:" not in text:
        if marker not in text:
            raise RuntimeError("Abstract section marker not found")
        text = text.replace(marker, notice + marker, 1)
    PAGE.write_text(text, encoding="utf-8")
    print("Clarified the dimensionality landing page while preserving archival title and DOI metadata.")


if __name__ == "__main__":
    main()
