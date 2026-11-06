#!/usr/bin/env python3
"""Validate the restrained journal-style overlap feature and MathJax equations."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
page = (ROOT / "overlap/index.html").read_text(encoding="utf-8")
css = (ROOT / "overlap/overlap.css").read_text(encoding="utf-8")
ledger = (ROOT / "overlap/overlap-nov2026.js").read_text(encoding="utf-8")

assert "does not by itself establish historical influence." not in page
assert page.count('id="featured-2611-03459"') == 1
card = page.split('<section class="feature-direct-adoption"', 1)[1].split('<div class="reference-records"', 1)[0]
assert card.count('<section ') == 1 and card.count('</section>') == 2
assert 'id="light-bullet-lean-crossmatch"' in card
assert 'class="pill rel-direct">DIRECT ADOPTION</span>' in card
assert "8.7" in card
assert "November 2, 2026" in card
assert "Yannick Fleck, Thomas G. Seidel, Jesús Yelo-Sarrión, Julien Javaloyes, Svetlana V. Gurevich" in card

# A professional equation-led layout, with visible results and expandable derivations.
assert 'The shared biharmonic operator' in card
assert 'Common mathematical structure:' in card
assert card.count('class="light-bullet-equation"') == 2
assert card.index('class="light-bullet-equation-comparison"') < card.index('id="light-bullet-e57"')
assert card.count('<details ') == 4
assert card.count('<summary>') == 4
assert card.count('class="light-bullet-evidence-row"') == 3
assert 'id="light-bullet-e57"' in card
assert 'id="light-bullet-e61"' in card
assert 'id="light-bullet-physical-scaling"' in card
assert 'id="light-bullet-further-matches"' in card
assert card.index('id="light-bullet-e57"') < card.index('id="light-bullet-e61"') < card.index('id="light-bullet-physical-scaling"') < card.index('id="light-bullet-further-matches"')
assert not re.search(r'<details\b[^>]*\bopen(?:\s|=|>)', card)
assert '<table' not in card

for math in (
    r'\mathrm{i}B\Delta_{\perp}E+\mathrm{i}S\Delta_{\perp}^{2}E',
    r'(\Delta+k_*^{2})^{2}u=\Delta^{2}u+2k_*^{2}\Delta u+k_*^{4}u',
    r'(\Delta+k_*^{2})^{2}=\Delta^{2}+2k_*^{2}\Delta+k_*^{4}',
    r'\widehat{\mathcal{A}u}(\xi)=(|\xi|^{2}-k_*^{2})^{2}\widehat{u}(\xi)',
    r'\sigma(L_r)=(-\infty,r]',
    r'\|e^{tL_r}\|=e^{rt}',
    r'L_r=rI-a(\Delta+k_*^{2})^{2}',
    r'\Delta I \propto |S|^{1/4}',
):
    assert math in card, math
assert card.count(r'\(') >= 10 and card.count(r'\(') == card.count(r'\)')
assert 'math-typeset' in card
assert '<mark>' not in card and 'light-bullet-evidence-formula"><code>' not in card

# The user sees each mathematical conclusion before expanding.
for block_id, label, formula in (
    ('light-bullet-e57', 'E57 · Biharmonic expansion and Fourier symbol', r'(\Delta+k_*^{2})^{2}=\Delta^{2}'),
    ('light-bullet-e61', 'E61 · Spectrum and semigroup stability threshold', r'\sigma(L_r)=(-\infty,r]'),
    ('light-bullet-physical-scaling', 'Aberration-dependent localized intensity', r'\Delta I \propto |S|^{1/4}'),
):
    summary = card.split(f'id="{block_id}"', 1)[1].split('</summary>', 1)[0]
    assert label in summary and formula in summary
    assert 'light-bullet-evidence-formula math-typeset' in summary

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
assert 'two-dimensional numerical scaling result' in card
assert 'common operator does not transfer the F01 stability theorem' in card
assert '?track=physics&amp;q=2611.03459#complete-ledger' in card

# MathJax is pinned, limited to the research card, and loaded after its config.
assert 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-chtml.js' in page
assert "startup: { elements: ['#featured-2611-03459'] }" in page
assert page.index('window.MathJax = {') < page.index('src="https://cdn.jsdelivr.net/npm/mathjax')
assert 'overlap.css?v=20261106-dark-journal-mathjax' in page

feature_css = css.split('/* Scientific publication treatment:', 1)[1]
# The feature must respect the site's dark tokens, not introduce a bright paper card.
assert 'background: var(--panel-soft)' in feature_css
assert 'color: var(--text)' in feature_css
assert 'border: 1px solid var(--line-strong)' in feature_css
assert 'background: var(--panel)' in feature_css
assert 'color: var(--muted)' in feature_css
assert '#fdfdfc' not in feature_css and '#f4f6f8' not in feature_css
assert '#8bf4c1' not in feature_css and '#92ffd0' not in feature_css
assert '.light-bullet-typeset mjx-container' in feature_css
assert '.light-bullet-evidence-formula mjx-container' in feature_css
assert 'grid-template-columns: 1fr;' in feature_css
assert '"https://arxiv.org/abs/2611.03459": "DIRECT ADOPTION"' in ledger
assert 'status:"verified",source:"arXiv:2611.03459 version 1, submitted November 2, 2026"' in ledger

print("Site-themed dark journal card validated: native palette, scoped MathJax, E57/E61/scaling, accessible expanders, unchanged classification.")
