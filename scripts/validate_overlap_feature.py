#!/usr/bin/env python3
"""Validate the public featured-direct-adoption record against its source ledger."""
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
assert 'class="pill rel-direct">DIRECT ADOPTION</span>' in page
assert '8.7 / 10' in page
assert 'November 2, 2026' in page
assert 'https://arxiv.org/abs/2611.03459' in page
assert 'https://doi.org/10.48550/arXiv.2611.03459' in source
assert '?track=physics&amp;q=2611.03459#complete-ledger' in page
assert 'requestedRecordQuery' in page
assert 'Yannick Fleck, Thomas G. Seidel, Jesús Yelo-Sarrión, Julien Javaloyes, Svetlana V. Gurevich' in page
assert 'Aberration stabilized light bullets in normal dispersion injected Kerr resonators' in page
assert 'class="feature-direct-adoption"' in page
assert ".feature-direct-adoption" in css
assert 'id="light-bullet-lean-crossmatch"' in page

# Regression check: the comparison must be nested INSIDE the featured paper
# card, not merely placed immediately after it as a sibling section.
card = page.split('<section class="feature-direct-adoption"', 1)[1].split('<div class="reference-records"', 1)[0]
assert card.index('<section class="light-bullet-lean-crossmatch"') < card.index('</section>'), "Comparison is outside its feature card"
assert card.count('<section ') == 1 and card.count('</section>') == 2
assert card.index('class="feature-direct-lean-bar"') < card.index('<section class="light-bullet-lean-crossmatch"')
for source in (
    'rickyjreyes/math/blob/main/lean/MathProofs/OrbitalStability.lean#L256',
    'rickyjreyes/wct-lean/blob/main/WCTLean/Models/BandPass.lean#L72',
    'rickyjreyes/geometry_of_resonance/blob/main/lean/ReleaseProofs/R07_PhaseFlux.lean#L10'
):
    assert source in card, source
assert '<table class="light-bullet-comparison-table">' in card
assert ".feature-direct-lean-bar" in css
assert ".feature-direct-adoption>.light-bullet-lean-crossmatch" in css

assert page.index('id="featured-2611-03459"') < page.index('id="light-bullet-lean-crossmatch"') < page.index('class="reference-records"')
assert '<a class="feature-direct-primary" href="#light-bullet-lean-crossmatch">' in page
assert page.count('href="https://arxiv.org/abs/2611.03459"') == 1, "Avoid duplicate paper links"
assert 'href="https://doi.org/10.48550/arXiv.2611.03459"' not in page, "Remove redundant DOI button"
assert '<h2 id="feature-direct-title">Aberration stabilized light bullets' in page
assert '<table class="light-bullet-comparison-table">' in page
comparison = page.split('<table class="light-bullet-comparison-table">', 1)[1].split('</table>', 1)[0]
assert comparison.count('<tr>') == 9, "Eight data rows plus one header"
for term in ('Biharmonic operator', 'Fourth-order spatial stabilization',
             'Cubic nonlinearity', 'Quintic saturation', 'Localized coherent states',
             'Orbital stability', 'Nonlinear curvature quotient',
             'Dissipative cavity forcing'):
    assert term in comparison, term
for src in (
    'rickyjreyes/math/blob/main/lean/MathProofs/StrictBinding.lean#L531',
    'rickyjreyes/math/blob/main/lean/MathProofs/WholeSpaceMinimizers.lean#L1457',
    'rickyjreyes/math/blob/main/lean/MathProofs/OrbitalStability.lean#L256',
    'rickyjreyes/wct-lean/blob/main/WCTLean/Models/BandPass.lean#L72',
    'rickyjreyes/wct-lean/blob/main/WCTLean/Models/CurvatureOperator.lean#L17',
    'rickyjreyes/geometry_of_resonance/blob/main/lean/ReleaseProofs/R07_PhaseFlux.lean#L10',
    'rickyjreyes/geometry_of_resonance/blob/main/lean/ReleaseProofs/R16_EnergyAndConstraints.lean#L59'
):
    assert src in page, src
assert '<strong>Δ² operator term</strong>' in page
assert 'theorem transfer not established' in page
assert '.light-bullet-lean-crossmatch' in css

assert '"https://arxiv.org/abs/2611.03459": "DIRECT ADOPTION"' in source
assert 'Yannick Fleck; Thomas G. Seidel; Jesús Yelo-Sarrión; Julien Javaloyes; Svetlana V. Gurevich' in source
assert 'status:"verified",source:"arXiv:2611.03459 version 1, submitted November 2, 2026"' in source
print("Overlap card validated: nested 8-row Lean comparison, prominent source links in three repos, one paper link and preserved DIRECT ADOPTION.")
