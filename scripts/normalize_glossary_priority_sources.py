#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
G = ROOT / "tools" / "glossary"

# Canonicalize the RCA term spelling and conservative five-term coinage set
# in the public snapshot itself, not only in the rendered runtime registry.
all_terms = G / "all-terms.js"
text = all_terms.read_text(encoding="utf-8")
text = text.replace('"Propagation-correction criticality"', '"Propagation–correction criticality"')
old_seven = '"Coherence mirage","Semantic anchor decay","Propagation–correction criticality","Collapse score","Symbolic heartbeat","Physical Symbolic Kill Logic","Confinement Termination Principle"'
new_five = '"Coherence mirage","Semantic anchor decay","Propagation–correction criticality","Physical Symbolic Kill Logic","Confinement Termination Principle"'
text = text.replace(old_seven, new_five)
all_terms.write_text(text, encoding="utf-8")

# The paper audit retains Collapse score and Symbolic heartbeat as RCA/WCT-defined
# diagnostics, but not as lexical coinages after the external phrase check.
p17 = G / "paper-terms-17-22.js"
text = p17.read_text(encoding="utf-8")
for name in ("Collapse score", "Symbolic heartbeat"):
    pat = rf'(\["{re.escape(name)}","[^"]*","AI / drift",20,)"Coined by Reyes"'
    text = re.sub(pat, r'\1"WCT-defined"', text)
p17.write_text(text, encoding="utf-8")

# The canonical mapping should likewise preserve only the five surviving coinages.
canonical = G / "paper-terms-canonical.js"
text = canonical.read_text(encoding="utf-8")
text = re.sub(
    r"const coinedOrigins=\[[^\]]*\];",
    'const coinedOrigins=["Coherence mirage","Semantic anchor decay","Propagation–correction criticality","Physical Symbolic Kill Logic","Confinement Termination Principle"];',
    text,
)
# Remove the obsolete ASCII-hyphen alias if an older snapshot left it in the base list.
text = text.replace('"Propagation-correction criticality"', '"Propagation–correction criticality"')
canonical.write_text(text, encoding="utf-8")

print("Normalized glossary priority sources: 5 strong coinages; 2 reclassified RCA terms; canonical Propagation–correction spelling")
