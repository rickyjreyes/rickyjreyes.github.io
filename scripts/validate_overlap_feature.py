#!/usr/bin/env python3
"""Validate the compact direct-adoption card and its exact Lean links."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OVERLAP = ROOT / "overlap"
page = (OVERLAP / "index.html").read_text(encoding="utf-8")
source = (OVERLAP / "overlap-nov2026.js").read_text(encoding="utf-8")
css = (OVERLAP / "overlap.css").read_text(encoding="utf-8")

assert "does not by itself establish historical influence." not in page
assert page.count('id="featured-2611-03459"') == 1
assert page.index('id="featured-2611-03459"') < page.index('class="reference-records"')
assert page.index('id="featured-2611-03459"') < page.index('class="relationship-section"')

card = page.split('<section class="feature-direct-adoption"', 1)[1].split('<div class="reference-records"', 1)[0]
assert card.count('<section ') == 1 and card.count('</section>') == 2, "Lean must be INSIDE the card"
assert card.index('id="light-bullet-lean-crossmatch"') < card.index('</section>')
assert card.count('<article class="light-bullet-proof') == 3, "Show only the three strongest matches"
assert '<table class="light-bullet-comparison-table">' not in card
assert 'class="light-bullet-source-index"' not in card
assert 'class="feature-direct-lean-bar"' not in card

for label in ("Biharmonic Δ²", "Fourth-order stabilization", "Localization &amp; stability"):
    assert label in card, label
for match_type in ("EXACT OPERATOR", "MECHANISM MATCH", "RELATED RESULT"):
    assert match_type in card, match_type
assert 'class="pill rel-direct">DIRECT ADOPTION</span>' in card
assert "8.7" in card
assert "November 2, 2026" in card
assert "Yannick Fleck, Thomas G. Seidel, Jesús Yelo-Sarrión, Julien Javaloyes, Svetlana V. Gurevich" in card

lean_sources = (
    "rickyjreyes/math/blob/main/lean/MathProofs/OrbitalStability.lean#L281",
    "rickyjreyes/math/blob/main/lean/MathProofs/WholeSpaceMinimizers.lean#L1457",
    "rickyjreyes/math/blob/main/lean/MathProofs/OrbitalStability.lean#L256",
    "rickyjreyes/wct-lean/blob/main/WCTLean/Models/BandPass.lean#L72",
    "rickyjreyes/geometry_of_resonance/blob/main/lean/ReleaseProofs/R07_PhaseFlux.lean#L10",
)
for lean_src in lean_sources:
    assert lean_src in card, lean_src
assert card.count('href="https://arxiv.org/abs/2611.03459"') == 1
assert '?track=physics&amp;q=2611.03459#complete-ledger' in card
assert 'conservative, 2D and cubic–quintic' in card
assert 'the F01 stability theorem does not transfer directly' in card
assert 'https://doi.org/10.48550/arXiv.2611.03459' in source
assert '"https://arxiv.org/abs/2611.03459": "DIRECT ADOPTION"' in source
assert 'status:"verified",source:"arXiv:2611.03459 version 1, submitted November 2, 2026"' in source
assert '.light-bullet-proof-grid' in css
assert '.feature-direct-adoption' in css
assert 'overlap.css?v=20261106-compact-lean-match' in page
print("Compact light-bullet card verified: 3 findings, 3 Lean repositories, 1 paper URL, correct model scope.")
