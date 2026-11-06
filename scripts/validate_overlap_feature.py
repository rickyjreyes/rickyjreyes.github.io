#!/usr/bin/env python3
"""Validate the concise site-themed light-bullet spotlight and complete proof disclosure."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
page = (root / "overlap/index.html").read_text(encoding="utf-8")
css = (root / "overlap/overlap.css").read_text(encoding="utf-8")
ledger = (root / "overlap/overlap-nov2026.js").read_text(encoding="utf-8")

assert page.count('id="featured-2611-03459"') == 1
card = page.split('<section class="feature-direct-adoption"', 1)[1].split('<div class="reference-records"', 1)[0]
assert card.count('<section ') == 1 and card.count('</section>') == 2
assert 'id="light-bullet-lean-crossmatch"' in card
assert 'class="pill rel-direct">DIRECT ADOPTION</span>' in card
assert "8.7" in card
assert "November 2, 2026" in card
assert "Yannick Fleck, Thomas G. Seidel, Jesús Yelo-Sarrión, Julien Javaloyes, Svetlana V. Gurevich" in card

# A featured spotlight must remain short, legible, and genuinely comparative.
assert len(card) < 7500, "Featured card grew back into a full article"
assert card.count('<details ') == 1 and card.count('<summary>') == 1
assert not re.search(r'<details\b[^>]*\bopen(?:\s|=|>)', card), "Proof appendix must be collapsed initially"
assert card.count('class="spotlight-compare-side"') == 2
assert card.count('class="spotlight-finding"') == 2
assert '<table' not in card
assert 'light-bullet-evidence-stack' not in card
assert 'Exact shared operator:' in card
assert 'Same biharmonic term, different full equations' in card

front = card.split('<details class="spotlight-details"', 1)[0]
expanded = card.split('<details class="spotlight-details"', 1)[1]
assert 'FLECK ET AL. · OPTICAL CAVITY' in front
assert 'REYES · E57 LEAN PROOF' in front
for equation in (
    r'\mathrm{i}B\Delta_{\perp}E+\mathrm{i}S\Delta_{\perp}^{2}E',
    r'(\Delta+k_*^{2})^{2}=\Delta^{2}+2k_*^{2}\Delta+k_*^{4}',
    r'\sigma(L_r)=(-\infty,r]',
    r'\|e^{tL_r}\|=e^{rt}',
    r'\Delta I\propto|S|^{1/4}',
):
    assert equation in front, equation
assert 'E57 operator theorem' in front
assert 'Lean theorem' in front
assert '2D numerical scaling, Fig. 7' in front
assert 'Full comparison, Lean proofs and model limits' in card
assert 'No full-PDE or nonlinear stability-theorem transfer is asserted' in expanded
assert 'F01 proves 2D minimizing-state compactness and orbital stability' in expanded
assert 'geometry_of_resonance' in expanded

# The same exact source declarations remain linked and the original paper is not duplicated.
for src in (
    'rickyjreyes/math/blob/main/lean/MathProofs/E57Certification.lean#L52',
    'rickyjreyes/math/blob/main/lean/MathProofs/E57Certification.lean#L59',
    'rickyjreyes/math/blob/main/lean/MathProofs/E61Certification.lean#L51',
    'rickyjreyes/math/blob/main/lean/MathProofs/E61Certification.lean#L73',
    'rickyjreyes/math/blob/main/lean/MathProofs/WholeSpaceMinimizers.lean#L1457',
    'rickyjreyes/math/blob/main/lean/MathProofs/OrbitalStability.lean#L256',
    'rickyjreyes/wct-lean/blob/main/WCTLean/Models/BandPass.lean#L72',
    'rickyjreyes/geometry_of_resonance/blob/main/lean/ReleaseProofs/R07_PhaseFlux.lean#L10',
):
    assert src in card, src
assert card.count('href="https://arxiv.org/abs/2611.03459"') == 1
assert 'href="https://arxiv.org/html/2611.03459v1"' in card
assert '?track=physics&amp;q=2611.03459#complete-ledger' in card
assert '"https://arxiv.org/abs/2611.03459": "DIRECT ADOPTION"' in ledger
assert 'status:"verified",source:"arXiv:2611.03459 version 1, submitted November 2, 2026"' in ledger

# Keep native dark theme and correctly scoped LaTeX rather than code-font formulas.
assert 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-chtml.js' in page
assert "startup: { elements: ['#featured-2611-03459'] }" in page
assert 'overlap.css?v=20261106-spotlight-compact' in page
feature_css = css.split('/* A featured scientific comparator', 1)[1]
for token in ('var(--panel-soft)', 'var(--panel)', 'var(--text)', 'var(--muted)', 'var(--line-strong)'):
    assert token in feature_css, token
assert '#fdfdfc' not in feature_css
assert '.spotlight-compare' in feature_css and '.spotlight-findings' in feature_css
assert len(feature_css) < 7500, "Featured CSS has become too large"
assert card.count(r'\(') == card.count(r'\)')
print("Compact spotlight verified: one side-by-side comparator, E61/Fleck evidence, one collapsed proof section, dark theme, Lean and MathJax intact.")
