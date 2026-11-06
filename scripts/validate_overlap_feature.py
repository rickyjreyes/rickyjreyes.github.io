#!/usr/bin/env python3
"""Validate the featured fourth-order comparison and evidence-first disclosures."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
page = (ROOT / "overlap/index.html").read_text(encoding="utf-8")
css = (ROOT / "overlap/overlap.css").read_text(encoding="utf-8")
ledger = (ROOT / "overlap/overlap-nov2026.js").read_text(encoding="utf-8")

assert "does not by itself establish historical influence." not in page
assert page.count('id="featured-2611-03459"') == 1
card = page.split('<section class="feature-direct-adoption"', 1)[1].split('<div class="reference-records"', 1)[0]
assert card.count('<section ') == 1 and card.count('</section>') == 2, "Comparison remains inside featured card"
assert 'id="light-bullet-lean-crossmatch"' in card
assert 'class="pill rel-direct">DIRECT ADOPTION</span>' in card
assert "8.7" in card
assert "November 2, 2026" in card
assert "Yannick Fleck, Thomas G. Seidel, Jesús Yelo-Sarrión, Julien Javaloyes, Svetlana V. Gurevich" in card

assert 'Same biharmonic operator' in card
assert 'SHARED Δ²' in card
assert card.count('<div class="light-bullet-equation">') == 2
assert card.count('<mark>') == 2
assert 'iBΔ<sub>⊥</sub>E + iS<mark>Δ<sub>⊥</sub>²</mark>E' in card
assert '(Δ + k²)²u = <mark>Δ²</mark>u + 2k²Δu + k⁴u' in card

assert card.count('<details ') == 4, "Three major evidence disclosures and one additional-results disclosure"
assert card.count('<summary>') == 4
assert card.count('class="light-bullet-evidence-row"') == 3
assert 'id="light-bullet-e57"' in card
assert 'id="light-bullet-e61"' in card
assert 'id="light-bullet-physical-scaling"' in card
assert 'id="light-bullet-further-matches"' in card
assert card.index('class="light-bullet-equation-comparison"') < card.index('id="light-bullet-e57"')
assert card.index('id="light-bullet-e57"') < card.index('id="light-bullet-e61"') < card.index('id="light-bullet-physical-scaling"') < card.index('id="light-bullet-further-matches"')
assert 'open>' not in card, "Native disclosures should be collapsed by default"

# Every key mathematical conclusion remains readable BEFORE its disclosure is opened.
for block_id, marker, claim in (
    ('light-bullet-e57', '04 / EXACT OPERATOR PROOF', 'E57 · Biharmonic expansion and Fourier symbol'),
    ('light-bullet-e61', '05 / PROVEN SPECTRAL THEORY', 'E61 · Exact spectrum and stability threshold'),
    ('light-bullet-physical-scaling', '06 / NUMERICAL PHYSICS MATCH', 'Excess intensity ∝ |S|'),
):
    section = card.split(f'id="{block_id}"', 1)[1].split('</details>', 1)[0]
    summary = section.split('</summary>', 1)[0]
    assert marker in summary and claim in summary, block_id
    assert 'class="light-bullet-evidence-formula"' in summary, block_id

assert '(|ξ|² − k⋆²)²' in card
assert 'Lᵣ = rI − a(Δ + k⋆²)²' in card
assert 'σ(L<sub>r</sub>) = (−∞, r]' in card
assert '‖e<sup>tL<sub>r</sub></sup>‖ = e<sup>rt</sup>' in card
assert '· 2D numerical scan' in card
assert 'Section III and Figure 7' in card
assert 'not a Lean theorem or a measured three-dimensional exponent' in card
assert 'class="light-bullet-secondary-match"' in card
assert card.count('class="light-bullet-secondary-match"') == 2
assert "Fourth-order stabilization" in card and "Localization and stability" in card
assert 'table' not in card.lower(), "No wide feature-comparison table"

for url_part in (
    'rickyjreyes/math/blob/main/lean/MathProofs/E57Certification.lean#L52',
    'rickyjreyes/math/blob/main/lean/MathProofs/E57Certification.lean#L59',
    'rickyjreyes/math/blob/main/lean/MathProofs/E61Certification.lean#L51',
    'rickyjreyes/math/blob/main/lean/MathProofs/E61Certification.lean#L73',
    'rickyjreyes/math/blob/main/lean/MathProofs/OrbitalStability.lean#L281',
    'rickyjreyes/math/blob/main/lean/MathProofs/WholeSpaceMinimizers.lean#L1457',
    'rickyjreyes/math/blob/main/lean/MathProofs/OrbitalStability.lean#L256',
    'rickyjreyes/wct-lean/blob/main/WCTLean/Models/BandPass.lean#L72',
    'rickyjreyes/geometry_of_resonance/blob/main/lean/ReleaseProofs/R07_PhaseFlux.lean#L10',
):
    assert url_part in card, url_part
assert card.count('href="https://arxiv.org/abs/2611.03459"') == 1
assert 'href="https://arxiv.org/html/2611.03459v1"' in card
assert '?track=physics&amp;q=2611.03459#complete-ledger' in card
assert 'Exact shared mathematics does not transfer the stability theorems' in card
assert 'overlap.css?v=20261106-e57-e61-expandables' in page
assert '.light-bullet-evidence-row>summary' in css
assert '.light-bullet-evidence-row:focus-within' in css
assert '.light-bullet-additional>summary' in css
assert '"https://arxiv.org/abs/2611.03459": "DIRECT ADOPTION"' in ledger
assert 'status:"verified",source:"arXiv:2611.03459 version 1, submitted November 2, 2026"' in ledger
print("Featured overlap evidence verified: 01 visible, E57/E61/quarter-root previews and accessible expandables, 3 Lean repositories, classification preserved.")
