#!/usr/bin/env python3
from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EQUATIONS = ROOT / "equations" / "equations.json"
COMPILED = ROOT / "compiled-registry.json"
OUT = ROOT / "lean" / "index.html"

TEMPLATE = r'''<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#07111f">
<meta name="description" content="Kernel-checked Lean coverage map and object browser for all __TOTAL__ canonical WCT objects.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://rickyjreyes.github.io/lean/">
<title>WCT Lean Coverage | Richard J. Reyes</title>
<link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../verification-pages.css">
<script>window.MathJax={tex:{inlineMath:[["\\(","\\)"]],displayMath:[["$$","$$"]]},svg:{fontCache:"global"},startup:{typeset:false}};</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
<style>
:root{
  --lean-formal:#b6ffda;
  --lean-partial:#f0c987;
  --lean-definition:#67d4ff;
  --lean-counter:#f29b8c;
  --lean-todo:#a899ff;
  --lean-unmapped:#7a8b9b;
}
.lean-shell{width:min(calc(100% - 48px),1320px);margin-inline:auto}
.lean-hero{padding:clamp(58px,8vw,92px) 0 38px}
.lean-breadcrumb{margin:0 0 22px;color:var(--muted-2);font-size:.76rem}
.lean-breadcrumb a{text-decoration:none}
.lean-kicker{margin:0 0 13px;color:var(--accent);font-size:.68rem;font-weight:850;letter-spacing:.13em;text-transform:uppercase}
.lean-hero h1{max-width:900px;margin:0;font:500 clamp(2.8rem,6vw,5.5rem)/.98 Georgia,serif;letter-spacing:-.045em}
.lean-hero-grid{display:grid;grid-template-columns:minmax(0,1.38fr) minmax(250px,.62fr);gap:28px 64px;align-items:start;margin-top:24px}
.lean-lede{max-width:64ch;margin:0;color:var(--text);font-size:clamp(1rem,1.55vw,1.15rem);line-height:1.6}
.lean-provenance{max-width:78ch;margin:14px 0 0;color:var(--muted);font-size:.88rem;line-height:1.62}
.lean-provenance strong{color:var(--text);font-weight:650}
.lean-hero-actions{display:grid;gap:11px;justify-items:start}
.lean-primary-link{min-height:44px;display:inline-flex;align-items:center;padding:0 18px;border-radius:8px;background:var(--accent-3);color:#04111a;font-size:.86rem;font-weight:750;text-decoration:none}
.lean-secondary-links{display:flex;flex-wrap:wrap;gap:7px 18px;font-size:.84rem}
.lean-secondary-links a{color:var(--accent-3)}
.lean-version{margin:2px 0 0;color:var(--muted-2);font:600 .68rem/1.4 ui-monospace,SFMono-Regular,Menlo,monospace}
.lean-map{padding:36px 0 42px;border-top:1px solid var(--line)}
.lean-map-head{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:14px 42px}
.lean-map-head h2{margin:0;font:500 clamp(1.75rem,3vw,2.45rem)/1.12 Georgia,serif}
.lean-map-copy{max-width:58ch;margin:0;color:var(--muted);font-size:.88rem;line-height:1.55}
.lean-map-copy strong{color:var(--text)}
.lean-strength-bar{display:flex;height:14px;gap:2px;margin-top:30px;overflow:hidden;border-radius:3px;background:rgba(255,255,255,.025)}
.lean-strength-segment{min-width:0;transition:opacity .18s ease}
.lean-strength-scale{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;margin-top:8px;color:var(--muted-2);font:600 .64rem/1.4 ui-monospace,SFMono-Regular,Menlo,monospace}
.lean-strength-scale span:nth-child(2){text-align:center}.lean-strength-scale span:last-child{text-align:right}
.lean-tier-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:1px;margin-top:24px;border-block:1px solid var(--line);background:var(--line)}
.lean-tier{display:grid;align-content:start;gap:7px;min-height:162px;padding:16px 16px 18px;border:0;border-top:2px solid var(--tier-border,var(--line));background:var(--bg);color:var(--text);font:inherit;text-align:left;cursor:pointer;transition:background .15s ease,opacity .15s ease}
.lean-tier:hover,.lean-tier:focus-visible{background:rgba(255,255,255,.025);outline:none}
.lean-tier[aria-pressed=true]{background:#0d1a28}
.lean-tier-title{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.lean-tier-name{display:inline-flex;align-items:center;gap:8px;font-size:.78rem;font-weight:700}
.lean-tier-mark{width:11px;height:11px;flex:none;box-sizing:border-box;border-radius:2px;border:1.5px solid var(--tier-color)}
.lean-tier-count{color:var(--tier-color);font:500 1.6rem/1 Georgia,serif}
.lean-tier-kicker{color:var(--muted-2);font:700 .61rem/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.075em;text-transform:uppercase}
.lean-tier-desc{color:var(--muted);font-size:.79rem;line-height:1.48}
.lean-cross{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:26px 50px;margin-top:40px;align-items:start}
.lean-cross h3{margin:0;font:500 1.35rem/1.25 Georgia,serif}
.lean-cross p{max-width:47ch;margin:10px 0 0;color:var(--muted);font-size:.84rem;line-height:1.52}
.lean-cross-filter{margin-top:14px!important;color:var(--text)!important}
.lean-cross-filter button{padding:0;border:0;background:none;color:var(--accent-3);font:inherit;text-decoration:underline;cursor:pointer}
.lean-cross-scroll{overflow-x:auto;overflow-y:hidden;overscroll-behavior-inline:contain;scrollbar-gutter:stable;scrollbar-width:thin;scrollbar-color:rgba(150,180,205,.38) transparent;touch-action:pan-x pan-y;padding-bottom:7px}
.lean-cross-scroll::-webkit-scrollbar{height:8px}
.lean-cross-scroll::-webkit-scrollbar-track{background:rgba(255,255,255,.025);border-radius:999px}
.lean-cross-scroll::-webkit-scrollbar-thumb{background:rgba(150,180,205,.34);border-radius:999px}
.lean-cross-scroll::-webkit-scrollbar-thumb:hover{background:rgba(150,180,205,.5)}
.lean-cross-grid{display:grid;grid-template-columns:max-content repeat(4,minmax(68px,1fr));gap:6px 8px;min-width:520px;font-size:.78rem}
.lean-cross-head{align-self:end;color:var(--muted-2);font:700 .61rem/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.075em;text-transform:uppercase;text-align:center}
.lean-cross-head:first-child{text-align:left}
.lean-cross-label{align-self:center;padding-right:8px;color:var(--text);white-space:nowrap}
.lean-cross-cell{display:block;width:100%;height:38px;border:1px solid var(--cell-border);border-radius:4px;background:var(--cell-bg);color:var(--cell-fg);font:700 .8rem/1 ui-monospace,SFMono-Regular,Menlo,monospace;cursor:pointer}
.lean-cross-cell:disabled{cursor:default}
.lean-cross-cell[aria-pressed=true]{outline:1px solid var(--text);outline-offset:1px}
.lean-browser-section{padding:30px 0 72px;border-top:1px solid var(--line)}
.lean-browser-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:12px 24px;margin-bottom:14px}
.lean-browser-head h2{margin:0;font:500 1.55rem/1.2 Georgia,serif}
.lean-count{color:var(--muted-2);font:600 .68rem/1.3 ui-monospace,SFMono-Regular,Menlo,monospace}
.lean-quick-filters{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}
.lean-quick-filters button{display:inline-flex;align-items:center;gap:7px;min-height:34px;padding:0 12px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.012);color:var(--muted);font:700 .72rem/1 ui-monospace,SFMono-Regular,Menlo,monospace;cursor:pointer}
.lean-quick-filters button span{color:var(--muted-2);font-size:.66rem}
.lean-quick-filters button:hover,.lean-quick-filters button:focus-visible{border-color:var(--line-strong);color:var(--text);outline:none}
.lean-quick-filters button[aria-pressed=true]{border-color:rgba(103,212,255,.46);background:rgba(103,212,255,.075);color:var(--text)}
.lean-quick-filters button[aria-pressed=true] span{color:var(--accent-3)}
.lean-search-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;margin-bottom:15px}
.lean-search-row input{width:100%;padding:12px 14px;border:1px solid var(--line);border-radius:7px;background:#081522;color:var(--text);font:inherit}
.lean-search-row input::placeholder{color:var(--muted-2)}
.lean-clear{padding:0 14px;border:1px solid var(--line);border-radius:7px;background:transparent;color:var(--muted);font:inherit;font-size:.78rem;cursor:pointer}
.lean-clear[hidden]{display:none}
.lean-filter-note{margin:-5px 0 14px;color:var(--muted);font-size:.78rem}
.lean-browser{display:grid;grid-template-columns:minmax(310px,380px) minmax(0,1fr);gap:28px 42px;align-items:start}
.lean-index{position:sticky;top:148px;max-height:calc(100vh - 172px);overflow:auto;padding:0 12px 0 0;scrollbar-width:thin;scrollbar-color:rgba(150,180,205,.35) transparent}
.lean-family{margin:0;padding:0;list-style:none}
.lean-family+.lean-family{margin-top:18px}
.lean-family-title{position:sticky;top:0;z-index:2;margin:0;padding:8px 8px 7px;background:linear-gradient(90deg,var(--bg) 80%,transparent);color:var(--muted-2);font:750 .62rem/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase}
.lean-list-row{display:grid;grid-template-columns:48px minmax(0,1fr) 12px;gap:10px;align-items:center;width:100%;padding:8px;border:0;border-left:2px solid transparent;background:transparent;color:var(--muted);font:inherit;text-align:left;cursor:pointer}
.lean-list-row:hover,.lean-list-row:focus-visible{background:rgba(255,255,255,.025);outline:none}
.lean-list-row[aria-pressed=true]{border-left-color:var(--row-color);background:#0d1a28;color:var(--text)}
.lean-list-id{color:var(--row-color);font:700 .7rem/1 ui-monospace,SFMono-Regular,Menlo,monospace}
.lean-list-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.8rem}
.lean-list-mark{width:8px;height:8px;border:1.5px solid var(--row-color);border-radius:2px}
.lean-list-empty{padding:28px 8px;color:var(--muted);font-size:.86rem}
.lean-detail{position:sticky;top:148px;min-width:0;max-height:calc(100vh - 172px);overflow:auto;padding-right:8px;scrollbar-width:thin;scrollbar-color:rgba(150,180,205,.35) transparent;scrollbar-gutter:stable}
.lean-detail-top{display:flex;justify-content:space-between;gap:18px;align-items:start;padding-bottom:14px;border-bottom:1px solid var(--line)}
.lean-detail-id{margin:0;color:var(--accent);font:700 .67rem/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase}
.lean-detail h2{margin:7px 0 0;font:500 clamp(1.8rem,3.4vw,3rem)/1.06 Georgia,serif;letter-spacing:-.025em}
.lean-badge{max-width:46%;padding:6px 10px;border:1px solid currentColor;border-radius:999px;font:750 .61rem/1.25 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.055em;text-align:center;text-transform:uppercase}
.lean-detail-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:14px;border-block:1px solid var(--line)}
.lean-detail-stat{min-width:0;padding:11px 14px 12px;border-right:1px solid var(--line)}
.lean-detail-stat:last-child{border-right:0}
.lean-detail-stat span{display:block;color:var(--muted-2);font:700 .59rem/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase}
.lean-detail-stat strong{display:block;margin-top:4px;color:var(--text);font-size:.78rem;font-weight:600;line-height:1.35}
.lean-status-line{display:flex;flex-wrap:wrap;gap:8px 10px;margin-top:12px}
.lean-status-chip{display:inline-flex;align-items:baseline;gap:7px;padding:7px 10px;border:1px solid var(--line);border-radius:7px;background:rgba(255,255,255,.012)}
.lean-status-chip small{color:var(--muted-2);font:700 .58rem/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.065em;text-transform:uppercase}
.lean-status-chip strong{color:var(--text);font-size:.73rem;font-weight:700}
.lean-definition-text{max-width:92ch;margin:17px 0 0;color:var(--muted);font-size:.92rem;line-height:1.62}
.lean-equation{overflow:auto;margin:16px 0 0;padding:12px 16px;border-left:2px solid var(--badge-color,var(--accent));background:rgba(255,255,255,.018)}
.lean-equation>div{min-width:max-content;padding:4px 0}
.lean-equation>div+div{border-top:1px solid rgba(255,255,255,.05)}
.lean-declarations{margin-top:17px}
.lean-declarations h3{margin:0 0 8px;color:var(--muted-2);font:700 .62rem/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase}
.lean-decl-list{display:grid;gap:5px}
.lean-decl{padding:8px 10px;border:1px solid var(--line);border-radius:5px;background:rgba(255,255,255,.012);color:var(--text);font:600 .75rem/1.35 ui-monospace,SFMono-Regular,Menlo,monospace;overflow-wrap:anywhere}
.lean-source-path{margin:8px 0 0;color:var(--muted-2);font:600 .7rem/1.4 ui-monospace,SFMono-Regular,Menlo,monospace}
.lean-note{margin-top:12px;padding:11px 13px;border:1px solid var(--line);background:rgba(255,255,255,.012);color:var(--muted);font-size:.82rem;line-height:1.5}
.lean-actions{display:flex;flex-wrap:wrap;gap:8px 18px;margin-top:13px}
.lean-actions a{color:var(--accent-3);font-size:.8rem}
.lean-nav{display:flex;justify-content:space-between;gap:12px;margin-top:28px;padding-top:16px;border-top:1px solid var(--line)}
.lean-nav button{min-height:40px;padding:0 14px;border:1px solid var(--line);border-radius:8px;background:transparent;color:var(--text);font:inherit;font-size:.8rem;cursor:pointer}
.lean-nav button:hover{border-color:var(--line-strong);background:rgba(255,255,255,.02)}
.lean-footer{border-top:1px solid var(--line);background:var(--bg-deep)}
.lean-footer-inner{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 32px;padding:26px 0;color:var(--muted-2);font:600 .7rem/1.4 ui-monospace,SFMono-Regular,Menlo,monospace}
.lean-footer a{text-decoration:none}
@media(max-width:1100px){.lean-tier-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:980px){
  .lean-hero-grid,.lean-cross,.lean-browser{grid-template-columns:1fr}
  .lean-index{position:static;max-height:360px;padding-right:8px}
  .lean-detail{position:static;max-height:none;overflow:visible;padding-right:0;scrollbar-gutter:auto}
  .lean-family-title{position:static}
}
@media(max-width:700px){
  .lean-shell{width:min(calc(100% - 28px),1320px)}
  .lean-hero{padding-top:46px}
  .lean-tier-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .lean-tier{min-height:150px;padding:14px 12px}
  .lean-detail-top{flex-direction:column}
  .lean-badge{max-width:100%}
  .lean-detail-strip{grid-template-columns:repeat(2,minmax(0,1fr))}
  .lean-detail-stat:nth-child(2){border-right:0}
  .lean-detail-stat:nth-child(-n+2){border-bottom:1px solid var(--line)}
  .lean-search-row{grid-template-columns:1fr}
  .lean-strength-scale{grid-template-columns:1fr 1fr}.lean-strength-scale span:nth-child(2){display:none}
}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}.lean-tier,.lean-strength-segment{transition:none}}
</style></head><body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" id="top"><div class="nav-wrap"><a class="wordmark" href="../"><span class="mark" aria-hidden="true">R</span><span>Richard J. Reyes</span></a><button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav" aria-label="Primary navigation"><a href="/">Home</a><a href="/publications/">Publications</a><a href="/priority/">Priority</a><a href="/overlap/">Overlap</a><a href="/patents/">Patents</a><a href="/equations/">Equations</a><a href="/sympy/">SymPy</a><a href="/lean/">Lean</a><a href="/reproduce/">Reproduce</a><a href="/tools/">Tools</a></nav></div></header>
<main id="main">
<section class="lean-shell lean-hero">
<p class="lean-breadcrumb"><a href="../">Home</a> / Lean</p>
<p class="lean-kicker">Kernel-checked formal layer</p>
<h1>WCT Lean Coverage</h1>
<div class="lean-hero-grid">
<div>
<p class="lean-lede">Start with proof strength, then drill into individual canonical objects. Lean coverage is kept separate from symbolic checks and empirical validation.</p>
<p class="lean-provenance"><strong>Wave Confinement Theory (WCT) is a research program developed by <a href="../researcher/">Richard J. Reyes</a> beginning in 2025.</strong> This page documents the kernel-checked formal-coverage layer within the public WCT research corpus. Publication dates and DOI records are indexed in the <a href="../publications/">publication archive</a>, with claim-level chronology in the <a href="../priority/">priority registry</a>.</p>
</div>
<div class="lean-hero-actions">
<a class="lean-primary-link" href="https://github.com/rickyjreyes/wct-lean/blob/main/THEOREMS.md" target="_blank" rel="noopener noreferrer">Theorem inventory ↗</a>
<div class="lean-secondary-links"><a href="https://github.com/rickyjreyes/wct-lean" target="_blank" rel="noopener noreferrer">wct-lean repository ↗</a><a href="../compiled-registry.json">Machine-readable registry</a></div>
<p class="lean-version">Registry v__VERSION__ · generated __GENERATED__</p>
</div>
</div>
</section>

<section class="lean-shell lean-map" aria-labelledby="lean-map-title">
<div class="lean-map-head"><div><p class="lean-kicker">Proof-strength map</p><h2 id="lean-map-title">What has actually been formalized?</h2></div><p class="lean-map-copy">These categories describe the <strong>strength of Lean coverage</strong>, not the truth of WCT as a physical theory. Mapped does not mean equal proof strength.</p></div>
<div class="lean-strength-bar" id="lean-strength-bar" role="img"></div>
<div class="lean-strength-scale"><span>Stronger formal coverage</span><span id="lean-mapped-label">__MAPPED__ mapped · __UNMAPPED__ unmapped</span><span>No coverage</span></div>
<div class="lean-tier-grid" id="lean-tier-grid"></div>
<div class="lean-cross">
<div><h3>Lean coverage against symbolic outcome</h3><p>The two layers are independent. A SymPy PASS does not imply a Lean proof, and an absence of formal coverage is not evidence of falsity. Select a cell to list its objects.</p><p class="lean-cross-filter" id="lean-cross-filter" hidden></p></div>
<div class="lean-cross-scroll" tabindex="0" role="region" aria-label="Scrollable Lean and SymPy outcome matrix"><div class="lean-cross-grid" id="lean-cross-grid" role="grid" aria-label="Lean coverage by SymPy outcome"></div></div>
</div>
</section>

<section class="lean-shell lean-browser-section" id="browser" aria-labelledby="lean-browser-title">
<div class="lean-browser-head"><h2 id="lean-browser-title">Object browser</h2><span class="lean-count" id="lean-count">All __TOTAL__ objects</span></div>
<div class="lean-quick-filters" id="lean-quick-filters" aria-label="Coverage shortcuts">
<button type="button" data-quick="" aria-pressed="true">All <span>__TOTAL__</span></button>
<button type="button" data-quick="mapped" aria-pressed="false">Mapped <span>__MAPPED__</span></button>
<button type="button" data-quick="unmapped" aria-pressed="false">Unmapped <span>__UNMAPPED__</span></button>
</div>
<div class="lean-search-row"><input id="lean-search" type="search" placeholder="Search ID, title, declaration, or family" autocomplete="off"><button class="lean-clear" id="lean-clear" type="button" hidden>Clear filters</button></div>
<p class="lean-filter-note" id="lean-filter-note" hidden></p>
<div class="lean-browser">
<aside class="lean-index" id="lean-list" aria-label="Canonical WCT objects"></aside>
<article class="lean-detail" id="lean-detail">
<header class="lean-detail-top"><div><p class="lean-detail-id" id="lean-detail-id">Equation</p><h2 id="lean-detail-title">Select an object</h2></div><span class="lean-badge" id="lean-badge">UNMAPPED</span></header>
<div class="lean-detail-strip">
<div class="lean-detail-stat"><span>Lean</span><strong id="lean-stat-lean">—</strong></div>
<div class="lean-detail-stat"><span>SymPy</span><strong id="lean-stat-sympy">—</strong></div>
<div class="lean-detail-stat"><span>Scope</span><strong id="lean-stat-scope">—</strong></div>
<div class="lean-detail-stat"><span>Empirical</span><strong id="lean-stat-emp">—</strong></div>
</div>
<div class="lean-status-line" aria-label="Canonical status comparison">
<span class="lean-status-chip"><small>Current effective status</small><strong id="lean-current-status">—</strong></span>
<span class="lean-status-chip"><small>Baseline status</small><strong id="lean-baseline-status">—</strong></span>
</div>
<p class="lean-definition-text" id="lean-definition"></p>
<div class="lean-equation" id="lean-equation"></div>
<div class="lean-declarations"><h3 id="lean-decl-head">Lean declarations</h3><div class="lean-decl-list" id="lean-decl-list"></div><p class="lean-source-path" id="lean-source-path"></p></div>
<div class="lean-note" id="lean-note"></div>
<div class="lean-actions"><a id="lean-open-equation" href="../equations/">Open canonical equation</a><a id="lean-source" href="https://github.com/rickyjreyes/wct-lean" target="_blank" rel="noopener noreferrer">Lean source ↗</a><a id="lean-sympy" href="../sympy/">SymPy status</a></div>
<div class="lean-nav"><button type="button" id="lean-prev">← Previous</button><button type="button" id="lean-next">Next →</button></div>
</article>
</div>
</section>
</main>
<footer class="lean-footer"><div class="lean-shell lean-footer-inner"><span>© 2026 Richard J. Reyes</span><a href="#top">Back to top ↑</a></div></footer>
<script>window.LEAN_COVERAGE_DATA=__LEAN_DATA__;</script>
<script>
(() => {
  const data=window.LEAN_COVERAGE_DATA||{};
  const all=Object.values(data);
  const TIERS=[
    {key:'formal',classes:['proved','support'],label:'Exact / formal results',kicker:'Kernel-checked results',color:'#b6ffda',mark:'solid',desc:'Kernel-checked algebraic or dimensional results. Each item still states the exact scope of what Lean proves.'},
    {key:'partial',classes:['partial'],label:'Partial support',kicker:'Supporting formalization',color:'#f0c987',mark:'half',desc:'Supporting lemmas, finite models, or narrowed theorems that do not close the full canonical WCT object.'},
    {key:'definition',classes:['definition'],label:'Definitions',kicker:'Typed objects and contracts',color:'#67d4ff',mark:'dot',desc:'Definitions and proposition contracts accepted by the kernel. Acceptance is not proof of the associated physical claim.'},
    {key:'counterexample',classes:['counterexample'],label:'Counterexamples',kicker:'Constraint and failure results',color:'#f29b8c',mark:'slash',desc:'Kernel-checked counterexamples or failure results that rule out stronger or historically incorrect formulations.'},
    {key:'todo',classes:['todo'],label:'TODO',kicker:'Stated, not proved',color:'#a899ff',mark:'dash',desc:'Statements represented in Lean whose intended proof is not complete. These are obligations, not results.'},
    {key:'unmapped',classes:['unmapped'],label:'Unmapped',kicker:'No maintained direct coverage',color:'#7a8b9b',mark:'dots',desc:'No maintained direct Lean declaration currently closes the object. Missing formal coverage is not evidence of falsity.'}
  ];
  const SYM=['PASS','CONDITIONAL','DEFINITION','OPEN'];
  const state={q:'',quick:'',tier:'',cell:null,sel:(data[decodeURIComponent(location.hash.slice(1))]?decodeURIComponent(location.hash.slice(1)):'E1A')};
  const $=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const tierOf=e=>TIERS.find(t=>t.classes.includes(e.coverageClass))||TIERS[5];
  const human=s=>s?String(s).replace(/_/g,' ').toLowerCase().replace(/^./,c=>c.toUpperCase()):'—';
  const rgba=(hex,a)=>{
    const h=hex.replace('#',''); const n=parseInt(h,16);
    return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')';
  };
  const markStyle=t=>{
    if(t.mark==='half') return 'background:linear-gradient(90deg,'+t.color+' 50%,transparent 50%)';
    if(t.mark==='dot') return 'background:radial-gradient(circle,'+t.color+' 0 28%,transparent 32%)';
    if(t.mark==='slash') return 'background:linear-gradient(135deg,transparent 44%,'+t.color+' 44% 56%,transparent 56%)';
    return t.mark==='solid'?'background:'+t.color:'background:transparent;border-style:'+(t.mark==='dash'?'dashed':'dotted');
  };
  const searchBlob=e=>[e.id,e.title,e.family,e.coverage,e.symbolicStatus,(e.declarations||[]).join(' ')].join(' ').toLowerCase();
  const passes=e=>{
    const t=tierOf(e);
    if(state.quick==='mapped'&&e.coverageClass==='unmapped')return false;
    if(state.quick==='unmapped'&&e.coverageClass!=='unmapped')return false;
    if(state.tier&&t.key!==state.tier)return false;
    if(state.cell&&(t.key!==state.cell[0]||e.symbolicStatus!==state.cell[1]))return false;
    return !state.q||searchBlob(e).includes(state.q);
  };
  const filtered=()=>all.filter(passes);
  function buildTiers(){
    const grid=$('#lean-tier-grid'),bar=$('#lean-strength-bar');
    grid.innerHTML='';bar.innerHTML='';
    TIERS.forEach(t=>{
      const n=all.filter(e=>t.classes.includes(e.coverageClass)).length;
      const active=state.tier===t.key;
      const seg=document.createElement('span');
      seg.className='lean-strength-segment';
      seg.style.flex=Math.max(n,.15)+' 1 0';
      seg.style.opacity=state.tier&&!active?'.22':'1';
      seg.style.background=(t.mark==='dash'||t.mark==='dots')?'repeating-linear-gradient(90deg,'+t.color+' 0 3px,transparent 3px 6px)':t.color;
      seg.setAttribute('aria-hidden','true');
      bar.appendChild(seg);
      const b=document.createElement('button');
      b.type='button';b.className='lean-tier';b.setAttribute('aria-pressed',String(active));
      b.style.setProperty('--tier-color',t.color);
      b.style.setProperty('--tier-border',active?t.color:(n?rgba(t.color,.42):'var(--line)'));
      b.innerHTML='<span class="lean-tier-title"><span class="lean-tier-name"><i class="lean-tier-mark" style="'+markStyle(t)+'"></i>'+esc(t.label)+'</span><span class="lean-tier-count">'+n+'</span></span><span class="lean-tier-kicker">'+esc(t.kicker)+'</span><span class="lean-tier-desc">'+esc(t.desc)+'</span>';
      b.addEventListener('click',()=>{state.tier=active?'':t.key;state.quick='';state.cell=null;render();});
      grid.appendChild(b);
    });
    const mapped=all.filter(e=>e.coverageClass!=='unmapped').length;
    $('#lean-mapped-label').textContent=mapped+' mapped · '+(all.length-mapped)+' unmapped';
    bar.setAttribute('aria-label','Lean coverage of '+all.length+' canonical objects: '+TIERS.map(t=>t.label+' '+all.filter(e=>t.classes.includes(e.coverageClass)).length).join(', '));
  }
  function buildCross(){
    const grid=$('#lean-cross-grid');
    const tiers=TIERS.filter(t=>all.some(e=>t.classes.includes(e.coverageClass)));
    const counts=tiers.flatMap(t=>SYM.map(s=>all.filter(e=>t.classes.includes(e.coverageClass)&&e.symbolicStatus===s).length));
    const max=Math.max(1,...counts);
    grid.innerHTML='<span class="lean-cross-head">Lean ↓ · SymPy →</span>'+SYM.map(s=>'<span class="lean-cross-head">'+s+'</span>').join('');
    tiers.forEach(t=>{
      const label=document.createElement('span');label.className='lean-cross-label';label.textContent=t.label;grid.appendChild(label);
      SYM.forEach(s=>{
        const n=all.filter(e=>t.classes.includes(e.coverageClass)&&e.symbolicStatus===s).length;
        const active=state.cell&&state.cell[0]===t.key&&state.cell[1]===s;
        const a=n?.1+.55*(n/max):0;
        const b=document.createElement('button');b.type='button';b.className='lean-cross-cell';b.disabled=!n;
        b.setAttribute('aria-pressed',String(!!active));b.setAttribute('aria-label',t.label+', SymPy '+s+': '+n);
        b.style.setProperty('--cell-bg',n?rgba(t.color,a):'transparent');
        b.style.setProperty('--cell-border',active?'var(--text)':n?rgba(t.color,.34):'rgba(150,180,205,.08)');
        b.style.setProperty('--cell-fg',n&&a>.4?'#04111a':n?'var(--text)':'#3c4e5f');
        b.textContent=n||'·';
        if(n)b.addEventListener('click',()=>{state.cell=active?null:[t.key,s];state.quick='';state.tier='';render();if(!active)setTimeout(()=>document.getElementById('browser')?.scrollIntoView({behavior:'smooth',block:'start'}),20);});
        grid.appendChild(b);
      });
    });
    const note=$('#lean-cross-filter');
    if(state.cell){
      const t=TIERS.find(x=>x.key===state.cell[0]);
      note.hidden=false;
      note.innerHTML=esc(t.label+' × SymPy '+state.cell[1])+' · <button type="button">clear</button>';
      note.querySelector('button').addEventListener('click',()=>{state.cell=null;render();});
    }else note.hidden=true;
  }
  function buildQuick(){
    document.querySelectorAll('[data-quick]').forEach(b=>{
      const key=b.dataset.quick;
      const active=key ? state.quick===key : !state.quick&&!state.tier&&!state.cell;
      b.setAttribute('aria-pressed',String(active));
    });
  }
  function buildList(){
    const shown=filtered(),wrap=$('#lean-list');
    $('#lean-count').textContent=shown.length===all.length?'All '+all.length+' objects':shown.length+' of '+all.length+' objects';
    const any=!!(state.q||state.quick||state.tier||state.cell);
    $('#lean-clear').hidden=!any;
    const note=$('#lean-filter-note');
    if(state.tier){const t=TIERS.find(x=>x.key===state.tier);note.hidden=false;note.textContent=t.label+' — '+t.desc;}
    else if(state.cell){const t=TIERS.find(x=>x.key===state.cell[0]);note.hidden=false;note.textContent=t.label+' × SymPy '+state.cell[1];}
    else if(state.quick==='mapped'){note.hidden=false;note.textContent='Mapped — objects with maintained Lean definitions or declarations.';}
    else if(state.quick==='unmapped'){note.hidden=false;note.textContent='Unmapped — no maintained direct Lean declaration currently closes the object.';}
    else note.hidden=true;
    const families=[...new Set(all.map(e=>e.family))];
    wrap.innerHTML='';
    families.forEach(fam=>{
      const rows=shown.filter(e=>e.family===fam);if(!rows.length)return;
      const group=document.createElement('div');group.className='lean-family';
      const h=document.createElement('h3');h.className='lean-family-title';h.textContent=fam;group.appendChild(h);
      rows.forEach(e=>{
        const t=tierOf(e),b=document.createElement('button');
        b.type='button';b.className='lean-list-row';b.setAttribute('aria-pressed',String(e.id===state.sel));b.style.setProperty('--row-color',t.color);
        b.innerHTML='<span class="lean-list-id">'+esc(e.id)+'</span><span class="lean-list-title">'+esc(e.title)+'</span><i class="lean-list-mark" style="'+markStyle(t)+'"></i>';
        b.addEventListener('click',()=>pick(e.id,true));group.appendChild(b);
      });
      wrap.appendChild(group);
    });
    if(!shown.length)wrap.innerHTML='<div class="lean-list-empty">No canonical objects match this filter.</div>';
  }
  function typeset(e){
    const box=$('#lean-equation');
    const lines=(e.formula||'').split(/\n\s*\n/).filter(Boolean);
    box.innerHTML=(lines.length?lines:['\\text{No standalone display equation recorded.}']).map(x=>'<div>$$'+esc(x)+'$$</div>').join('');
    const go=n=>{
      const mj=window.MathJax;
      if(mj&&mj.typesetPromise&&mj.startup?.promise)mj.startup.promise.then(()=>{mj.typesetClear&&mj.typesetClear([box]);return mj.typesetPromise([box]);}).catch(()=>{});
      else if(n<160)setTimeout(()=>go(n+1),50);
    };go(0);
  }
  function detail(){
    const shown=filtered();
    let e=data[state.sel]||all[0];
    if(shown.length&&!shown.includes(e)){e=shown[0];state.sel=e.id;}
    const t=tierOf(e);
    $('#lean-detail-id').textContent=e.id+' · '+e.family;
    $('#lean-detail-title').textContent=e.title;
    const badge=$('#lean-badge');badge.textContent=e.coverage;badge.style.color=t.color;badge.style.setProperty('--badge-color',t.color);
    $('#lean-detail').style.setProperty('--badge-color',t.color);
    $('#lean-stat-lean').textContent=t.label;
    $('#lean-stat-sympy').textContent=e.symbolicStatus+' · '+human(e.verificationKind);
    $('#lean-stat-scope').textContent=human(e.verificationScope);
    $('#lean-stat-emp').textContent=human(e.empiricalStatus);
    const statusIcon=s=>s==='PASS'?'✅ ':s==='CONDITIONAL'?'⚠️ ':s==='DEFINITION'?'◇ ':s==='OPEN'?'○ ':'';
    $('#lean-current-status').textContent=statusIcon(e.symbolicStatus)+e.symbolicStatus;
    $('#lean-baseline-status').textContent=statusIcon(e.baselineStatus)+e.baselineStatus;
    $('#lean-definition').textContent=e.definition||'No canonical definition text recorded.';
    typeset(e);
    const dec=e.declarations||[],declWrap=$('#lean-decl-list');
    $('#lean-decl-head').textContent='Lean declarations · '+(dec.length||'none');
    declWrap.innerHTML=dec.length?dec.map(d=>'<div class="lean-decl">'+esc(d)+'</div>').join(''):'';
    $('#lean-source-path').textContent=e.leanSource||'No maintained Lean source path recorded.';
    const rest=(e.note||'').replace(/^Declarations:[^.]*\.\s*/,'');
    $('#lean-note').textContent=rest||e.note||'';
    $('#lean-open-equation').href='../equations/#'+encodeURIComponent(e.id);
    $('#lean-source').href=e.leanSource?'https://github.com/rickyjreyes/wct-lean/blob/main/'+e.leanSource:'https://github.com/rickyjreyes/wct-lean';
    $('#lean-sympy').href='../sympy/#'+encodeURIComponent(e.id);
    const pool=shown.length?shown:all;
    const i=Math.max(0,pool.findIndex(x=>x.id===e.id)),prev=pool[(i-1+pool.length)%pool.length],next=pool[(i+1)%pool.length];
    $('#lean-prev').textContent='← '+prev.id;$('#lean-next').textContent=next.id+' →';
    $('#lean-prev').onclick=()=>pick(prev.id,false);$('#lean-next').onclick=()=>pick(next.id,false);
  }
  function pick(id,scroll){
    state.sel=id;history.replaceState(null,'','#'+encodeURIComponent(id));render(false);
    if(scroll&&innerWidth<980)setTimeout(()=>document.getElementById('lean-detail')?.scrollIntoView({behavior:'smooth',block:'start'}),20);
  }
  function render(rebuild=true){
    buildTiers();buildCross();buildQuick();buildList();detail();
    if(rebuild){
      document.querySelectorAll('.lean-list-row').forEach(b=>b.setAttribute('aria-pressed',String(b.querySelector('.lean-list-id')?.textContent===state.sel)));
    }
  }
  $('#lean-search').addEventListener('input',e=>{state.q=e.target.value.trim().toLowerCase();render();});
  document.querySelectorAll('[data-quick]').forEach(b=>b.addEventListener('click',()=>{
    state.quick=b.dataset.quick;
    state.tier='';
    state.cell=null;
    render();
  }));
  $('#lean-clear').addEventListener('click',()=>{state.q='';state.quick='';state.tier='';state.cell=null;$('#lean-search').value='';render();});
  render();
})();
</script>
<script src="../site-nav.js" defer></script>
</body></html>'''


def classify_formalization(formal: dict) -> tuple[str, str, str]:
    status = str(formal.get("status", "OPEN")).upper()
    relationship = str(formal.get("relationship") or "").lower()
    if status == "PROVED":
        if "dimensional" in relationship:
            return "PROVED · DIMENSIONAL SUPPORT", "proved", "mapped"
        if "counterexample" in relationship:
            return "PROVED · COUNTEREXAMPLE", "counterexample", "mapped"
        if "supporting" in relationship:
            return "PROVED · PARTIAL SUPPORT", "partial", "mapped"
        return "PROVED · ALGEBRAIC SUPPORT", "support", "mapped"
    if status == "DEFINITION":
        return "DEFINITION", "definition", "mapped"
    if status in {"STATED_TODO", "TODO"}:
        return "TODO", "todo", "mapped"
    return "UNMAPPED", "unmapped", "unmapped"


def main() -> None:
    objects = json.loads(EQUATIONS.read_text(encoding="utf-8"))
    artifact = json.loads(COMPILED.read_text(encoding="utf-8"))
    compiled_by_id = {obj["canonical_id"]: obj for obj in artifact["objects"]}
    if {obj["id"] for obj in objects} != set(compiled_by_id):
        raise RuntimeError("Lean builder object IDs differ from compiled-registry.json")

    lean_data: dict[str, dict] = {}
    mapped_count = 0
    for obj in objects:
        object_id = obj["id"]
        compiled = compiled_by_id[object_id]
        formal = compiled["formalization"]
        label, lean_class, mapped_state = classify_formalization(formal)
        if mapped_state == "mapped":
            mapped_count += 1

        declarations = formal.get("declarations", [])
        limitations = formal.get("limitations", [])
        if mapped_state == "unmapped":
            note = (
                "No maintained direct Lean declaration currently closes this canonical object. "
                "This is an absence of formal coverage, not evidence that the equation is false."
            )
        else:
            declaration_text = ", ".join(declarations) if declarations else "No named declaration recorded"
            note = f"Declarations: {declaration_text}."
            if limitations:
                note += " " + " ".join(limitations)

        lean_data[object_id] = {
            "id": object_id,
            "title": obj["title"],
            "family": obj["family"],
            "definition": obj.get("definition", ""),
            "formula": obj.get("formula") or r"\text{No standalone display equation recorded.}",
            "source": obj["source"],
            "coverage": label,
            "coverageClass": lean_class,
            "note": note,
            "mapped": mapped_state == "mapped",
            "declarations": declarations,
            "leanSource": formal.get("source"),
            "symbolicStatus": obj["status"],
            "verificationKind": obj["verification_kind"].replace("_", " "),
            "verificationScope": obj["verification_scope"].replace("_", " "),
            "empiricalStatus": obj["empirical_validation"]["status"].replace("_", " "),
            "baselineStatus": obj["baseline_status"],
            "statusChanged": obj["status_changed"],
        }

    total = len(objects)
    unmapped_count = total - mapped_count
    page = (
        TEMPLATE
        .replace("__TOTAL__", str(total))
        .replace("__MAPPED__", str(mapped_count))
        .replace("__UNMAPPED__", str(unmapped_count))
        .replace("__VERSION__", html.escape(str(artifact["schema_version"])))
        .replace("__GENERATED__", html.escape(str(artifact["generated_at"])))
        .replace("__LEAN_DATA__", json.dumps(lean_data, ensure_ascii=False))
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(page, encoding="utf-8")
    print(
        f"Generated Lean proof-strength map and object browser: "
        f"total={total}, mapped={mapped_count}, unmapped={unmapped_count}."
    )


if __name__ == "__main__":
    main()
