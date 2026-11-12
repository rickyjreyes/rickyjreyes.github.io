(() => {
  "use strict";
  const proofList = document.getElementById("atlas-proof-list");
  if (!proofList) return;
  const search = document.getElementById("atlas-query");
  const categoryBox = document.getElementById("atlas-category-filter");
  const repoBox = document.getElementById("atlas-repo-filter");
  const countEl = document.getElementById("atlas-count");
  const repoGrid = document.getElementById("atlas-source-repos");
  const status = document.getElementById("atlas-data-status");
  const state = { proofs: [], category: "", repo: "", leanExpanded: false };
  const escapes = { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" };
  const esc = str => String(str == null ? "" : str).replace(/[&<>"']/g, c => escapes[c]);
  const short = (s, n=280) => String(s || "").length <= n ? String(s||"") : String(s).slice(0,n).trimEnd() + " …";
  const unique = arr => [...new Set(arr)];
  const repoName = s => String(s || "").split("/").at(-1);

  const renderFilters = (element, field, current, label) => {
    const items = field === "category"
      ? unique(state.proofs.map(x => x.category)).sort()
      : unique(state.proofs.map(x => x.repo)).sort();
    const itemCount = x => state.proofs.filter(y => y[field] === x).length;
    element.innerHTML = '<p class="atlas-filter-heading">' + esc(label) + '</p>'
      + '<button class="atlas-filter" type="button" data-field="' + field + '" data-value="" aria-pressed="' + String(!current)
      + '"><span>All ' + esc(field==="repo"?"repositories":"subjects") + '</span><span>' + state.proofs.length + '</span></button>'
      + items.map(value => '<button class="atlas-filter" type="button" data-field="' + field + '" data-value="' + esc(value)
        + '" aria-pressed="' + String(current===value) + '"><span>' + esc(field==="repo"?repoName(value):value)
        + '</span><span>' + itemCount(value) + '</span></button>').join("");
  };

  const mathQueue = { pending: Promise.resolve() };
  function typesetMath(root) {
    if (!window.MathJax || typeof window.MathJax.typesetPromise !== "function") return;
    mathQueue.pending = mathQueue.pending
      .then(() => window.MathJax.typesetPromise([root]))
      .catch(() => {});
  }
  const card = (p) => {
    const guide = p.guide;
    const source = '<a class="atlas-source-link" href="' + esc(p.source_url) + '" target="_blank" rel="noopener noreferrer">Read the source proof in GitHub ↗</a>';
    const exact = p.excerpt_truncated ? 'Lean theorem declaration, excerpt' : 'Exact Lean theorem declaration';
    return '<article class="atlas-proof-card atlas-readable-card" id="proof-' + p.rank + '">'
      + '<div class="atlas-proof-top"><span class="atlas-index">RESULT ' + String(p.rank).padStart(2, "0")
      + ' / ' + esc(p.category) + '</span><span class="atlas-repo">' + esc(repoName(p.repo)) + '</span></div>'
      + '<h3>' + esc(p.title) + '</h3>'
      + '<div class="atlas-reader-label">What it proves</div>'
      + '<p class="atlas-reader-summary">' + esc(guide.plain) + '</p>'
      + '<div class="atlas-math-statement" aria-label="Mathematical statement">\\[' + esc(guide.math) + '\\]</div>'
      + '<div class="atlas-reading-notes">'
      + '<div><div class="atlas-reader-label">Why it matters</div><p>' + esc(guide.why) + '</p></div>'
      + '<div><div class="atlas-reader-label">Under which assumptions</div><p>' + esc(guide.conditions) + '</p></div>'
      + '</div>'
      + '<p class="atlas-reader-boundary"><strong>Limit of this result:</strong> ' + esc(p.limit) + '</p>'
      + '<div class="atlas-proof-links">' + source + '<span class="atlas-tag">' + esc(p.gc) + '</span></div>'
      + '<details class="atlas-lean-disclosure"><summary>Show Lean 4 statement and formal hypotheses</summary>'
      + '<p class="atlas-code-label">' + exact + ' · ' + esc(p.path) + ':' + p.line + '</p>'
      + '<pre class="atlas-proof-code"><code>' + esc(p.statement) + '</code></pre>'
      + '<p class="atlas-lean-note">This is the formal declaration, not the complete proof body. The source link above opens the full .lean file.</p>'
      + '</details></article>';
  };

  function render() {
    const query = search.value.trim().toLocaleLowerCase();
    const subset = state.proofs.filter(p =>
      (!state.category || p.category === state.category)
      && (!state.repo || p.repo === state.repo)
      && (!query || [p.title,p.summary,p.limit,p.theorem,p.path,p.repo,p.gc,p.guide.plain,p.guide.why,p.guide.conditions].some(x => String(x||"").toLocaleLowerCase().includes(query))));
    proofList.innerHTML = subset.length ? subset.map(card).join("") :
      '<p class="atlas-no-results">No proof highlights match those filters. Try another theorem name or repository.</p>';
    proofList.querySelectorAll(".atlas-lean-disclosure").forEach(detail => { detail.open = state.leanExpanded; });
    countEl.textContent = "Showing " + subset.length + " of " + state.proofs.length + " curated proof highlights";
    renderFilters(categoryBox,"category",state.category,"Mathematical area");
    renderFilters(repoBox,"repo",state.repo,"Proof repository");
    typesetMath(proofList);
  }
  document.addEventListener("click", evt => {
    const button = evt.target.closest(".atlas-filter");
    if (!button || (!categoryBox.contains(button) && !repoBox.contains(button))) return;
    state[button.dataset.field] = button.dataset.value;
    render();
  });
  search.addEventListener("input", render);
  document.getElementById("atlas-clear").addEventListener("click", () => {
    search.value = ""; state.category = ""; state.repo = ""; render(); search.focus();
  });

  const leanToggle = document.getElementById("atlas-lean-toggle");
  if (leanToggle) leanToggle.addEventListener("click", () => {
    state.leanExpanded = !state.leanExpanded;
    leanToggle.setAttribute("aria-pressed", String(state.leanExpanded));
    leanToggle.textContent = state.leanExpanded ? "Collapse all Lean statements" : "Show all Lean statements";
    proofList.querySelectorAll(".atlas-lean-disclosure").forEach(detail => { detail.open = state.leanExpanded; });
  });

  const files = ["proofs-01.json","proofs-02.json","proofs-03.json","public-lean-repositories.json","proof-guide.json"];
  Promise.all(files.map(path=>fetch("./"+path,{cache:"no-cache"}).then(resp=>{
    if(!resp.ok) throw new Error(path+": HTTP "+resp.status);
    return resp.json();
  }))).then(([a,b,c,inventory,guide])=>{
    const proofs = [...a.entries,...b.entries,...c.entries].sort((x,y)=>x.rank-y.rank);
    const ranks = new Set(proofs.map(p=>p.rank));
    if(proofs.length !== 27 || ranks.size !== 27 || ranks.has(0) || ranks.has(28)) throw new Error("Proof dataset must contain 27 unique ranks");
    if(inventory.repositories.length !== 5 || inventory.total_lean_files !== 303) throw new Error("Public inventory mismatch");
    const authorized = new Set(inventory.repositories.map(repo=>repo.repo));
    if(proofs.some(p=>!authorized.has(p.repo))) throw new Error("Proof catalog contains a nonpublic repository");
    if (!Array.isArray(guide.entries) || guide.entries.length !== 27) {
      throw new Error("The readable theorem guide must have 27 entries");
    }
    const guides = new Map(guide.entries.map(item => [item.rank,item]));
    if (guides.size !== 27 || proofs.some(p => !guides.has(p.rank))) {
      throw new Error("Every Lean theorem needs an exact-rank reader guide");
    }
    if (proofs.some(p => ["plain","why","conditions","math"].some(key => !String(guides.get(p.rank)[key] || "").trim()))) {
      throw new Error("An explanatory field is missing from a Lean proof");
    }
    state.proofs = proofs.map(p => ({...p,guide:guides.get(p.rank)}));
    render();
    const features = document.querySelectorAll("[data-atlas-feature-rank]");
    features.forEach(el=>{
      const p=proofs.find(v=>v.rank===Number(el.dataset.atlasFeatureRank));
      const code=el.querySelector("[data-atlas-feature-code]");
      const link=el.querySelector("[data-atlas-feature-link]");
      if(p && code) code.textContent=p.statement;
      if(p && link) link.href=p.source_url;
    });
    repoGrid.innerHTML = inventory.repositories
      .sort((x,y)=>y.lean_files-x.lean_files)
      .map(repo=>'<a class="atlas-repo-card" href="https://github.com/'+esc(repo.repo)+'/tree/'+esc(repo.branch)+'/'+esc(repo.path)
        +'" target="_blank" rel="noopener noreferrer"><div><span class="atlas-kicker">'+esc(repo.repo.split("/").at(-1))+'</span>'
        +'<h3>'+esc(repo.repo)+'</h3><p>'+esc(repo.focus)+'</p></div><strong>'+repo.lean_files+'</strong></a>').join("");
    document.getElementById("atlas-file-count").textContent=String(inventory.total_lean_files);
    document.getElementById("atlas-repo-count").textContent=String(inventory.repositories.length);
    status.textContent="Lean source-tree snapshot: "+inventory.snapshot_date+" · "+inventory.repositories.length+" public repo trees refreshed · 27 curated theorem highlights";
  }).catch(error=>{
    status.textContent="Source index unavailable: "+error.message;
    countEl.textContent="Browse the public Lean repositories below or open the selected source inventory on GitHub.";
    proofList.innerHTML='<p class="atlas-no-results">The locally indexed theorem list could not load. <a href="https://github.com/rickyjreyes/math/blob/main/reyes-problem-repository/VERIFIED_LEAN_RESULTS.md">Open the verified-results source index ↗</a></p>';
    repoGrid.innerHTML='<p class="atlas-no-results"><a href="https://github.com/rickyjreyes/math">Browse mathematics source ↗</a></p>';
  });

  window.addEventListener("load", () => { typesetMath(document.getElementById("highlights")); typesetMath(proofList); });

  // All source files in the audited public repositories, separate from proof highlights.
  const fileSearch = document.getElementById("atlas-files-search");
  const fileList = document.getElementById("atlas-files-list");
  const fileCount = document.getElementById("atlas-files-count");
  const fileMore = document.getElementById("atlas-files-more");
  const fileState = { files: [], shown: 24 };
  const fileCard = item =>
    '<div class="atlas-file-item"><div class="atlas-file-path">'
    + '<span>' + esc(item.repo) + '</span>'
    + '<a href="' + esc(item.source_url) + '" target="_blank" rel="noopener noreferrer">' + esc(item.path) + '</a>'
    + '</div><strong>.lean ↗</strong></div>';

  function renderFiles() {
    const q = fileSearch.value.toLocaleLowerCase().trim();
    const rows = fileState.files.filter(x => !q ||
      (x.repo + " " + x.path).toLocaleLowerCase().includes(q));
    fileList.innerHTML = rows.length ? rows.slice(0,fileState.shown).map(fileCard).join("") :
      '<p class="atlas-no-results">No public Lean file matches your search.</p>';
    fileMore.hidden = rows.length <= fileState.shown;
    fileCount.textContent = rows.length + " of " + fileState.files.length
      + " public .lean files match" + (fileMore.hidden ? "" : " · displaying first " + fileState.shown);
  }
  fileSearch.addEventListener("input", () => { fileState.shown = 24; renderFiles(); });
  fileMore.addEventListener("click", () => { fileState.shown += 24; renderFiles(); });
  fetch("./lean-files.json", {cache:"no-cache"}).then(response => {
    if (!response.ok) throw new Error("HTTP " + response.status);
    return response.json();
  }).then(data => {
    if (!Array.isArray(data.files) || data.files.length !== 303 || data.count !== 303)
      throw new Error("Public file inventory is incomplete");
    fileState.files = data.files;
    renderFiles();
  }).catch(() => {
    fileCount.textContent = "Local .lean file index unavailable.";
    fileList.innerHTML = '<p class="atlas-no-results"><a href="https://github.com/rickyjreyes/math/tree/main/lean">Browse primary Lean sources on GitHub ↗</a></p>';
  });
})();