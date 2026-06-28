#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import os
import re
import urllib.error
import urllib.request
from collections import Counter, OrderedDict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "equations"
TOOLS_DIR = ROOT / "tools"
COMPILED_OUT = ROOT / "compiled-registry.json"
SOURCE_URL = "https://raw.githubusercontent.com/rickyjreyes/geometry_of_resonance/main/WCT_FULL_EQUATION_LIST_CORRECTED.md"
SOURCE_PAGE = "https://github.com/rickyjreyes/geometry_of_resonance/blob/main/WCT_FULL_EQUATION_LIST_CORRECTED.md"
WCT_SYMPY_REF = os.environ.get("WCT_SYMPY_REF", "main")
WCT_SYMPY_RAW = f"https://raw.githubusercontent.com/rickyjreyes/wct-sympy/{WCT_SYMPY_REF}"
BASELINE_URL = WCT_SYMPY_RAW + "/equations/full_registry.yaml"
OVERRIDE_URL = WCT_SYMPY_RAW + "/equations/derived_overrides.yaml"
METADATA_URL = WCT_SYMPY_RAW + "/equations/verification_metadata.yaml"
ASSUMPTIONS_URL = WCT_SYMPY_RAW + "/equations/assumptions.yaml"
LEAN_MAP_URL = WCT_SYMPY_RAW + "/interoperability/lean_map.yaml"
ID_RE = re.compile(r"^##\s+((?:M|E|CLE|CM|TOP|CORR)\d+[A-Z]?|G1|EX|EY|EZ|FA)\s+[—-]\s+(.+?)\s*$")
EXPECTED_COUNTS = {"PASS": 59, "CONDITIONAL": 27, "DEFINITION": 26, "OPEN": 30, "FAIL": 0}


def fetch_text(url: str, required: bool = True) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "rickyjreyes.github.io-builder"})
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            return response.read().decode("utf-8")
    except urllib.error.HTTPError:
        if required:
            raise
        return ""


def fetch_yaml(url: str, required: bool = True) -> Any:
    text = fetch_text(url, required=required)
    return yaml.safe_load(text) if text else None


def clean_markdown(text: str) -> str:
    text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", text)
    text = re.sub(r"[*_`]+", "", text)
    return re.sub(r"\s+", " ", text).strip()


def github_slug(text: str) -> str:
    value = text.lower().replace("—", " ").replace("–", " ")
    value = re.sub(r"[^a-z0-9\s-]", "", value)
    return re.sub(r"[-\s]+", "-", value).strip("-")


def parse_registry(markdown: str) -> list[dict[str, Any]]:
    lines = markdown.splitlines()
    family = "Registry"
    current: dict[str, Any] | None = None
    objects: list[dict[str, Any]] = []
    in_math = False
    math_buffer: list[str] = []
    paragraph: list[str] = []

    def flush_paragraph() -> None:
        nonlocal paragraph
        if current is not None and paragraph:
            value = clean_markdown(" ".join(paragraph))
            if value:
                current["paragraphs"].append(value)
        paragraph = []

    def flush_current() -> None:
        nonlocal current
        flush_paragraph()
        if current is None:
            return
        definition_parts = current.pop("paragraphs")
        definition = " ".join(definition_parts[:2]).strip()
        current["definition"] = (definition or f"{current['title']}.")[:1200]
        current["formula"] = "\n\n".join(current["formulas"][:4]).strip()
        current["source"] = SOURCE_PAGE + "#" + current["anchor"]
        objects.append(current)
        current = None

    for line in lines:
        if line.startswith("# ") and not line.startswith("## "):
            flush_paragraph()
            heading = clean_markdown(line[2:])
            if heading and not heading.startswith("Wave Confinement Theory"):
                family = heading
            continue

        match = ID_RE.match(line)
        if match:
            flush_current()
            object_id, title = match.groups()
            heading = f"{object_id} — {title}"
            current = {
                "id": object_id,
                "title": clean_markdown(title),
                "family": family,
                "formulas": [],
                "paragraphs": [],
                "anchor": github_slug(heading),
            }
            continue

        if current is None:
            continue
        if "$$" in line:
            parts = line.split("$$")
            for index, part in enumerate(parts):
                if index % 2 == 1:
                    formula = part.strip()
                    if formula:
                        current["formulas"].append(formula)
                elif part.strip() and in_math:
                    math_buffer.append(part.strip())
            if line.count("$$") % 2 == 1:
                in_math = not in_math
                if not in_math and math_buffer:
                    current["formulas"].append("\n".join(math_buffer))
                    math_buffer = []
            flush_paragraph()
            continue
        if in_math:
            math_buffer.append(line)
            continue
        stripped = line.strip()
        if not stripped:
            flush_paragraph()
            continue
        if stripped.startswith(("|", "---", "#", "**Status", "```")):
            flush_paragraph()
            continue
        if re.match(r"^(?:- |\d+\. )", stripped):
            flush_paragraph()
            continue
        paragraph.append(stripped)

    flush_current()
    return objects


def load_compact_rows(url: str) -> dict[str, dict[str, str]]:
    rows = fetch_yaml(url) or []
    result: dict[str, dict[str, str]] = {}
    for row in rows:
        if not isinstance(row, list) or len(row) != 3:
            raise RuntimeError(f"Invalid compact registry row from {url}: {row!r}")
        object_id, checker, status = map(str, row)
        if object_id in result:
            raise RuntimeError(f"Duplicate registry ID: {object_id}")
        result[object_id] = {"checker": checker, "status": status}
    return result


def infer_verification_kind(checker: str, status: str) -> str:
    name = checker.lower()
    if status == "DEFINITION" or name.startswith("classify_definition"):
        return "DEFINITION_CHECK"
    if status in {"OPEN", "CONDITIONAL"} and name.startswith("classify_"):
        return "UNRESOLVED"
    if any(token in name for token in ("dimension", "units", "_dim", "embedding")):
        return "DIMENSIONAL_CHECK"
    if any(token in name for token in ("variation", "gradient_flow", "lyapunov")):
        return "VARIATIONAL_DERIVATION"
    if any(token in name for token in ("counterexample", "uniqueness")):
        return "COUNTEREXAMPLE_TEST"
    if any(token in name for token in ("residual", "numerical")):
        return "NUMERICAL_RESIDUAL"
    if any(token in name for token in ("limit", "bounded", "denominator", "green_kernel")):
        return "LIMIT_CHECK"
    if any(token in name for token in ("stationary", "sign", "threshold", "maximum", "minimum")):
        return "SIGN_OR_EXTREMUM_CHECK"
    if "consistency" in name:
        return "CONSISTENCY_CHECK"
    if any(token in name for token in ("identity", "reduction", "equivalence", "derived")):
        return "ALGEBRAIC_IDENTITY"
    return "SYMBOLIC_DERIVATION" if name.startswith("check_") else "UNRESOLVED"


def load_lean_map() -> dict[str, dict[str, Any]]:
    raw = fetch_yaml(LEAN_MAP_URL) or {}
    result: dict[str, dict[str, Any]] = {}
    for row in raw.get("mappings", []):
        if row.get("registry") != "full":
            continue
        object_id = str(row["sympy_id"])
        result[object_id] = {
            "status": str(row.get("lean_status", "open")).upper(),
            "relationship": row.get("relationship"),
            "declarations": row.get("lean_declarations", []),
            "source": row.get("lean_source"),
            "limitations": [row["caveat"]] if row.get("caveat") else [],
        }
    return result


def compile_objects(objects: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    baseline = load_compact_rows(BASELINE_URL)
    overrides = load_compact_rows(OVERRIDE_URL)
    unknown = sorted(set(overrides) - set(baseline))
    if unknown:
        raise RuntimeError(f"Derived overrides reference unknown IDs: {unknown}")

    metadata_doc = fetch_yaml(METADATA_URL, required=False) or {}
    metadata = metadata_doc.get("objects", {})
    assumption_doc = fetch_yaml(ASSUMPTIONS_URL, required=False) or {"assumptions": {}, "object_links": {}}
    assumption_links = assumption_doc.get("object_links", {})
    lean = load_lean_map()
    by_id = {obj["id"]: obj for obj in objects}
    if set(by_id) != set(baseline):
        raise RuntimeError(
            "Canonical/effective registry mismatch. "
            f"Missing={sorted(set(baseline)-set(by_id))}; extra={sorted(set(by_id)-set(baseline))}"
        )

    for object_id, obj in by_id.items():
        base = baseline[object_id]
        effective = overrides.get(object_id, base)
        meta = metadata.get(object_id, {})
        changed = effective != base
        kind = meta.get("verification_kind", infer_verification_kind(effective["checker"], effective["status"]))
        scope = meta.get(
            "scope",
            "DEFINITIONAL" if effective["status"] == "DEFINITION"
            else "UNRESOLVED" if effective["status"] == "OPEN"
            else "MODEL_CONDITIONAL" if effective["status"] == "CONDITIONAL"
            else "INTERNAL_CONSISTENCY",
        )
        empirical = meta.get(
            "empirical_status",
            "NOT_APPLICABLE" if effective["status"] == "DEFINITION" or kind in {"ALGEBRAIC_IDENTITY", "DIMENSIONAL_CHECK"}
            else "NOT_TESTED",
        )
        obj.update(
            {
                "status": effective["status"],
                "baseline_status": base["status"],
                "status_changed": changed,
                "status_changed_by": f"derived_overrides.yaml:{effective['checker']}" if changed else None,
                "checker": effective["checker"],
                "baseline_checker": base["checker"],
                "verification_kind": kind,
                "verification_scope": scope,
                "verification_meaning": meta.get("meaning", "The assigned executable check is reported under its declared assumptions."),
                "verification_limitations": meta.get("limitations", []),
                "assumptions": assumption_links.get(object_id, []),
                "formalization": lean.get(
                    object_id,
                    {
                        "status": "OPEN",
                        "relationship": None,
                        "declarations": [],
                        "source": None,
                        "limitations": [],
                    },
                ),
                "empirical_validation": {
                    "status": empirical,
                    "evidence_ids": meta.get("evidence_ids", []),
                    "independent_replication": meta.get("independent_replication", "NONE"),
                },
            }
        )

    counts = Counter(obj["status"] for obj in objects)
    effective_counts = {status: counts.get(status, 0) for status in ("PASS", "CONDITIONAL", "DEFINITION", "OPEN", "FAIL")}
    if effective_counts != EXPECTED_COUNTS:
        raise RuntimeError(f"Effective totals mismatch: {effective_counts}")
    for obj in objects:
        if obj["status"] == "PASS" and obj["verification_kind"] == "UNRESOLVED":
            raise RuntimeError(f"{obj['id']}: PASS has unresolved verification kind")
        formal = obj["formalization"]
        if formal["status"] == "PROVED" and not formal["declarations"]:
            raise RuntimeError(f"{obj['id']}: Lean PROVED has no named declaration")

    artifact = {
        "schema_version": "2.0.0",
        "registry_id": "wct-effective-registry",
        "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "source_ref": {"wct_sympy": WCT_SYMPY_REF, "geometry_of_resonance": "main"},
        "counts": effective_counts,
        "total": len(objects),
        "assumptions": [
            {"assumption_id": assumption_id, **details}
            for assumption_id, details in assumption_doc.get("assumptions", {}).items()
        ],
        "objects": [
            {
                "canonical_id": obj["id"],
                "name": obj["title"],
                "family": obj["family"],
                "formula": obj["formula"],
                "definition": obj["definition"],
                "status": {
                    "baseline": obj["baseline_status"],
                    "effective": obj["status"],
                    "changed": obj["status_changed"],
                    "changed_by": obj["status_changed_by"],
                },
                "verification": {
                    "outcome": obj["status"],
                    "kind": obj["verification_kind"],
                    "scope": obj["verification_scope"],
                    "checker": [obj["checker"]],
                    "baseline_checker": obj["baseline_checker"],
                    "meaning": obj["verification_meaning"],
                    "limitations": obj["verification_limitations"],
                },
                "assumptions": obj["assumptions"],
                "formalization": obj["formalization"],
                "empirical_validation": obj["empirical_validation"],
                "sources": {"canonical_equation": obj["source"]},
            }
            for obj in objects
        ],
    }
    return objects, artifact


def family_slug(name: str) -> str:
    return github_slug(name) or "family"


def badge_text(obj: dict[str, Any]) -> str:
    return f"{obj['status']} · {obj['verification_kind'].replace('_', ' ')}"


def render_page(objects: list[dict[str, Any]], artifact: dict[str, Any]) -> str:
    families: OrderedDict[str, list[dict[str, Any]]] = OrderedDict()
    for obj in objects:
        families.setdefault(obj["family"], []).append(obj)
    family_links = "".join(
        f'<a href="#{family_slug(name)}">{html.escape(name)} <span>{len(items)}</span></a>'
        for name, items in families.items()
    )
    sections = []
    for family_name, items in families.items():
        cards = []
        for obj in items:
            formula = obj["formula"] or r"\text{No standalone display equation recorded.}"
            search = " ".join(
                [obj["id"], obj["title"], family_name, obj["status"], obj["verification_kind"], obj["definition"]]
            ).lower()
            history = (
                f'<p class="equation-history"><strong>Status history:</strong> baseline '
                f'{obj["baseline_status"]} → effective {obj["status"]} via '
                f'{html.escape(obj["status_changed_by"] or "baseline registry")}.</p>'
                if obj["status_changed"] else ""
            )
            assumptions = (
                '<p class="equation-meta"><strong>Assumptions:</strong> '
                + ", ".join(html.escape(value) for value in obj["assumptions"])
                + "</p>"
                if obj["assumptions"] else ""
            )
            lean_status = obj["formalization"]["status"]
            empirical_status = obj["empirical_validation"]["status"]
            cards.append(
                f'<article class="equation-entry status-{obj["status"].lower()}" id="{obj["id"]}" '
                f'data-family="{html.escape(family_name, quote=True)}" data-status="{obj["status"]}" '
                f'data-search="{html.escape(search, quote=True)}">'
                f'<header><div><span class="equation-id">{obj["id"]}</span>'
                f'<h3>{html.escape(obj["title"])}</h3></div>'
                f'<span class="equation-status status-{obj["status"].lower()}">{html.escape(badge_text(obj))}</span></header>'
                f'<p class="equation-definition">{html.escape(obj["definition"])}</p>'
                f'<div class="equation-formula">$${html.escape(formula)}$$</div>'
                f'<p class="equation-meta"><strong>Checker:</strong> {html.escape(obj["checker"])} · '
                f'<strong>Scope:</strong> {html.escape(obj["verification_scope"].replace("_", " "))} · '
                f'<strong>Lean:</strong> {html.escape(lean_status)} · '
                f'<strong>Empirical:</strong> {html.escape(empirical_status.replace("_", " "))}</p>'
                f'{assumptions}{history}'
                f'<div class="equation-actions"><a href="#{obj["id"]}">Permalink</a>'
                f'<a href="{obj["source"]}" target="_blank" rel="noopener noreferrer">Canonical source ↗</a>'
                f'<a href="../sympy/#{obj["id"]}">SymPy status</a>'
                f'<a href="../lean/#{obj["id"]}">Lean coverage</a></div></article>'
            )
        sections.append(
            f'<section class="equation-family" id="{family_slug(family_name)}">'
            f'<div class="family-heading"><div><p class="eyebrow">Equation family</p>'
            f'<h2>{html.escape(family_name)}</h2></div><span>{len(items)} objects</span></div>'
            f'<div class="equation-list">{"".join(cards)}</div></section>'
        )

    counts = artifact["counts"]
    generated = html.escape(artifact["generated_at"])
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#07111f">
<meta name="description" content="All 142 canonical WCT equations mapped by family with effective status, verification kind, assumptions, and formal coverage.">
<meta name="robots" content="index,follow"><link rel="canonical" href="https://rickyjreyes.github.io/equations/">
<title>WCT Equation Explorer | Richard J. Reyes</title><link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../verification-pages.css">
<script>window.MathJax={{tex:{{inlineMath:[["\\(","\\)"]],displayMath:[["$$","$$"]]}},svg:{{fontCache:"global"}},startup:{{typeset:false}}}};</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
<style>
.equation-hero{{padding-top:clamp(5rem,10vw,8rem)}}.equation-toolbar{{position:sticky;top:72px;z-index:5;display:grid;grid-template-columns:minmax(220px,1fr) repeat(2,minmax(150px,.35fr));gap:.75rem;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:rgba(7,17,31,.94);backdrop-filter:blur(14px)}}.equation-toolbar input,.equation-toolbar select{{width:100%;padding:.8rem;color:var(--text);border:1px solid var(--line-strong);border-radius:.7rem;background:#0a1728;font:inherit}}.family-nav{{display:flex;flex-wrap:wrap;gap:.55rem;margin:1.5rem 0}}.family-nav a{{padding:.45rem .7rem;border:1px solid var(--line);border-radius:999px;text-decoration:none;font-size:.75rem}}.family-nav span{{color:var(--muted-2)}}.equation-family{{padding:3rem 0;border-top:1px solid var(--line)}}.family-heading{{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:1rem}}.family-heading h2{{margin:0;font:500 clamp(1.8rem,4vw,3rem)/1.1 Georgia,serif}}.family-heading>span{{color:var(--muted-2)}}.equation-list{{display:grid;gap:1rem}}.equation-entry{{scroll-margin-top:150px;padding:1.3rem;border:1px solid var(--line);border-radius:1rem;background:rgba(8,18,31,.72)}}.equation-entry[hidden]{{display:none}}.equation-entry>header{{display:flex;align-items:start;justify-content:space-between;gap:1rem}}.equation-entry h3{{margin:.35rem 0 0;font:500 1.35rem/1.2 Georgia,serif}}.equation-id{{color:var(--accent);font:800 .75rem ui-monospace,monospace}}.equation-status{{max-width:56%;padding:.35rem .6rem;border:1px solid var(--line);border-radius:999px;font-size:.63rem;font-weight:850;text-align:center}}.equation-definition{{color:var(--muted);max-width:82ch}}.equation-formula{{overflow-x:auto;padding:1rem;border-radius:.75rem;background:rgba(0,0,0,.25)}}.equation-meta,.equation-history{{color:var(--muted-2);font-size:.77rem;line-height:1.55}}.equation-history{{padding:.65rem;border-left:3px solid var(--accent);background:rgba(103,212,255,.04)}}.equation-actions{{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1rem}}.equation-actions a{{font-size:.78rem}}.equation-count,.registry-provenance{{margin:.75rem 0;color:var(--muted-2);font-size:.78rem}}@media(max-width:760px){{.equation-toolbar{{position:static;grid-template-columns:1fr}}.family-heading,.equation-entry>header{{align-items:start;flex-direction:column}}.equation-status{{max-width:100%}}}}
</style></head><body><a class="skip-link" href="#main">Skip to content</a><header class="site-header" id="top"><div class="nav-wrap"><a class="wordmark" href="../"><span class="mark" aria-hidden="true">R</span><span>Richard J. Reyes</span></a><nav></nav></div></header><main id="main"><section class="section section-shell equation-hero"><p class="breadcrumb"><a href="../">Home</a> / Equations</p><div class="section-heading narrow"><p class="eyebrow">Canonical equation layer</p><h1>WCT Equation Explorer</h1><p>Every object is rendered from one compiled effective registry. Outcome, verification kind, Lean coverage, empirical state, assumptions, and status history remain separate.</p></div><div class="inline-actions"><a class="button primary" href="{SOURCE_PAGE}" target="_blank" rel="noopener noreferrer">Open full corrected registry ↗</a><a class="button secondary" href="../sympy/">SymPy audit</a><a class="button secondary" href="../lean/">Lean coverage</a><a class="button secondary" href="../compiled-registry.json">Compiled registry</a></div><div class="summary-grid"><div class="summary-card"><strong>{len(objects)}</strong><span>registered objects</span></div><div class="summary-card"><strong>{counts['PASS']}</strong><span>effective PASS</span></div><div class="summary-card"><strong>{counts['CONDITIONAL']}</strong><span>conditional</span></div><div class="summary-card"><strong>{counts['OPEN']}</strong><span>open</span></div></div><p class="registry-provenance">Registry v{artifact['schema_version']} · generated {generated} · WCT SymPy ref {html.escape(WCT_SYMPY_REF)}</p><nav class="family-nav" aria-label="Equation families">{family_links}</nav><div class="equation-toolbar"><input id="equation-search" type="search" placeholder="Search ID, title, verification kind, or family"><select id="equation-family"><option value="">All families</option>{''.join(f'<option value="{html.escape(name)}">{html.escape(name)}</option>' for name in families)}</select><select id="equation-status"><option value="">All statuses</option><option>PASS</option><option>CONDITIONAL</option><option>DEFINITION</option><option>OPEN</option><option>FAIL</option></select></div><p class="equation-count" id="equation-count">Showing all {len(objects)} objects.</p></section><div class="section-shell">{''.join(sections)}</div></main><footer class="site-footer"><div class="section-shell footer-bottom"><span>© 2026 Richard J. Reyes</span><a href="#top">Back to top ↑</a></div></footer><script>
(() => {{const entries=[...document.querySelectorAll('.equation-entry')],q=document.getElementById('equation-search'),family=document.getElementById('equation-family'),status=document.getElementById('equation-status'),count=document.getElementById('equation-count');function apply(){{const term=q.value.trim().toLowerCase(),f=family.value,s=status.value;let shown=0;entries.forEach(e=>{{const ok=(!term||e.dataset.search.includes(term))&&(!f||e.dataset.family===f)&&(!s||e.dataset.status===s);e.hidden=!ok;if(ok)shown++}});document.querySelectorAll('.equation-family').forEach(section=>section.hidden=![...section.querySelectorAll('.equation-entry')].some(e=>!e.hidden));count.textContent=`Showing ${{shown}} of ${{entries.length}} objects.`}}q.addEventListener('input',apply);family.addEventListener('change',apply);status.addEventListener('change',apply);}})();
</script><script src="../site-nav.js" defer></script></body></html>'''


def main() -> None:
    markdown = fetch_text(SOURCE_URL)
    parsed = parse_registry(markdown)
    if len(parsed) != 142:
        raise RuntimeError(f"Expected 142 equation objects, parsed {len(parsed)}")
    objects, artifact = compile_objects(parsed)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    TOOLS_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "equations.json").write_text(json.dumps(objects, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    COMPILED_OUT.write_text(json.dumps(artifact, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT_DIR / "index.html").write_text(render_page(objects, artifact), encoding="utf-8")
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
            "verification_kind": obj["verification_kind"],
            "source": obj["source"],
        }
        for obj in objects
    ]
    (TOOLS_DIR / "equations-data.js").write_text(
        "window.WCT_EQUATIONS = " + json.dumps(tool_objects, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )
    print(
        "Generated synchronized equation explorer and compiled registry: "
        + ", ".join(f"{key}={value}" for key, value in artifact["counts"].items())
    )


if __name__ == "__main__":
    main()
