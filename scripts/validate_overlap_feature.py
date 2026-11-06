#!/usr/bin/env python3
"""Verify featured cross-repository Lean matches are obvious and source-linked."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
page = (ROOT / "overlap/index.html").read_text(encoding="utf-8")
css = (ROOT / "overlap/overlap.css").read_text(encoding="utf-8")
source = (ROOT / "overlap/overlap-nov2026.js").read_text(encoding="utf-8")

assert "does not by itself establish historical influence." not in page
assert page.count('id="featured-2611-03459"') == 1
card = page.split('<section class="feature-direct-adoption"', 1)[1].split('<div class="reference-records"', 1)[0]
assert card.count('<section ') == 1 and card.count('</section>') == 2, "Comparison must be inside card"
assert 'id="light-bullet-lean-crossmatch"' in card
assert 'class="pill rel-direct">DIRECT ADOPTION</span>' in card
assert '8.7' in card
assert 'November 2, 2026' in card
assert "Yannick Fleck, Thomas G. Seidel, Jesús Yelo-Sarrión, Julien Javaloyes, Svetlana V. Gurevich" in card
assert card.index('class="light-bullet-equation-comparison"') < card.index('class="light-bullet-secondary-matches"'), "Exact match must be first"
assert card.count('<div class="light-bullet-equation">') == 2
assert card.count('<mark>') == 2, "Visually highlight the shared operator in both equations"
assert 'Same biharmonic operator' in card
assert 'SHARED Δ²' in card
assert 'iBΔ<sub>⊥</sub>E + iS<mark>Δ<sub>⊥</sub>²</mark>E' in card
assert '(Δ + k²)²u = <mark>Δ²</mark>u + 2k²Δu + k⁴u' in card
assert 'Identical operator term, not identical full PDEs' in card
assert card.count('class="light-bullet-secondary-match"') == 2
assert "Fourth-order stabilization" in card
assert "Localization and stability" in card
assert 'table' not in card.lower(), "Do not restore the previous eight-row table"
for lean_src in (
    'rickyjreyes/math/blob/main/lean/MathProofs/OrbitalStability.lean#L281',
    'rickyjreyes/math/blob/main/lean/MathProofs/WholeSpaceMinimizers.lean#L1457',
    'rickyjreyes/math/blob/main/lean/MathProofs/OrbitalStability.lean#L256',
    'rickyjreyes/wct-lean/blob/main/WCTLean/Models/BandPass.lean#L72',
    'rickyjreyes/geometry_of_resonance/blob/main/lean/ReleaseProofs/R07_PhaseFlux.lean#L10',
):
    assert lean_src in card, lean_src
assert card.count('href="https://arxiv.org/abs/2611.03459"') == 1
assert '?track=physics&amp;q=2611.03459#complete-ledger' in card
assert 'F01 is conservative, 2D and cubic–quintic' in card
assert 'not a transfer of the F01 stability theorem' in card
assert 'overlap.css?v=20261106-visual-delta-lean' in page
assert '.light-bullet-equation-comparison' in css
assert '.light-bullet-equation code mark' in css
assert '"https://arxiv.org/abs/2611.03459": "DIRECT ADOPTION"' in source
assert 'status:"verified",source:"arXiv:2611.03459 version 1, submitted November 2, 2026"' in source
print("Verified: visually highlighted exact Δ² comparison, two concise related matches, direct Lean links in three repositories.")
