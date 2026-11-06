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
assert 'https://doi.org/10.48550/arXiv.2611.03459' in page
assert '?track=physics&amp;q=2611.03459#complete-ledger' in page
assert 'requestedRecordQuery' in page
assert 'Yannick Fleck, Thomas G. Seidel, Jesús Yelo-Sarrión, Julien Javaloyes, Svetlana V. Gurevich' in page
assert 'Aberration stabilized light bullets in normal dispersion injected Kerr resonators' in page
assert 'class="feature-direct-adoption"' in page
assert ".feature-direct-adoption" in css
assert '"https://arxiv.org/abs/2611.03459": "DIRECT ADOPTION"' in source
assert 'Yannick Fleck; Thomas G. Seidel; Jesús Yelo-Sarrión; Julien Javaloyes; Svetlana V. Gurevich' in source
assert 'status:"verified",source:"arXiv:2611.03459 version 1, submitted November 2, 2026"' in source
print("Overlap feature verified: prominent DIRECT ADOPTION, arXiv record and authors, deep link, removed wording.")
