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
  const state = { proofs: [], category: "", repo: "" };
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

  const card = (p) => {
    const source = '<a class="atlas-source-link" href="' + esc(p.source_url) + '" target="_blank" rel="noopener noreferrer">Open theorem in GitHub ↗</a>';
    const exact = p.excerpt_truncated ? 'Declaration excerpt, abbreviated' : 'Exact Lean theorem declaration';
    return '<article class="atlas-proof-card" id="proof-' + p.rank + '">'
      + '<div class="atlas-proof-top"><span class="atlas-index">RESULT ' + String(p.rank).padStart(2,"0")
      + ' / ' + esc(p.category) + '</span><span class="atlas-repo">' + esc(repoName(p.repo)) + '</span></div>'
      + '<h3>' + esc(p.title) + '</h3>'
      + '<p>' + esc(p.summary) + '</p>'
      + '<p class="atlas-code-label">' + exact + ' · ' + esc(p.path.split("/").at(-1)) + ':' + p.line + '</p>'
      + '<pre class="atlas-proof-code"><code>' + esc(short(p.statement,315)) + '</code></pre>'
      + '<div class="atlas-proof-links">' + source + '<span class="atlas-tag">' + esc(p.gc) + '</span></div>'
      + '<details><summary>Read full declaration and proof boundary</summary>'
      + '<pre class="atlas-proof-code"><code>' + esc(p.statement) + '</code></pre>'
      + '<p class="atlas-scope"><strong>What it does not establish:</strong> ' + esc(p.limit) + '</p>'
      + '<p class="atlas-caution" style="margin-top:8px">The code above is the theorem statement and hypotheses, not its full proof term. Follow the source link for the entire Lean file.</p>'
      + '</details></article>';
  };

  function render() {
    const query = search.value.trim().toLocaleLowerCase();
    const subset = state.proofs.filter(p =>
      (!state.category || p.category === state.category)
      && (!state.repo || p.repo === state.repo)
      && (!query || [p.title,p.summary,p.limit,p.theorem,p.path,p.repo,p.gc].some(x => String(x||"").toLocaleLowerCase().includes(query))));
    proofList.innerHTML = subset.length ? subset.map(card).join("") :
      '<p class="atlas-no-results">No proof highlights match those filters. Try another theorem name or repository.</p>';
    countEl.textContent = "Showing " + subset.length + " of " + state.proofs.length + " curated proof highlights";
    renderFilters(categoryBox,"category",state.category,"Mathematical area");
    renderFilters(repoBox,"repo",state.repo,"Proof repository");
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

  const files = ["proofs-01.json","proofs-02.json","proofs-03.json","public-lean-repositories.json"];
  Promise.all(files.map(path=>fetch("./"+path,{cache:"no-cache"}).then(resp=>{
    if(!resp.ok) throw new Error(path+": HTTP "+resp.status);
    return resp.json();
  }))).then(([a,b,c,inventory])=>{
    const proofs = [...a.entries,...b.entries,...c.entries].sort((x,y)=>x.rank-y.rank);
    const ranks = new Set(proofs.map(p=>p.rank));
    if(proofs.length !== 27 || ranks.size !== 27 || ranks.has(0) || ranks.has(28)) throw new Error("Proof dataset must contain 27 unique ranks");
    if(inventory.repositories.length !== 5 || inventory.total_lean_files !== 278) throw new Error("Public inventory mismatch");
    const authorized = new Set(inventory.repositories.map(repo=>repo.repo));
    if(proofs.some(p=>!authorized.has(p.repo))) throw new Error("Proof catalog contains a nonpublic repository");
    state.proofs = proofs;
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
    status.textContent="Source inventory: "+inventory.snapshot_date+" · "+inventory.public_repositories_scanned+" public repos scanned · 27 highlighted declarations";
  }).catch(error=>{
    status.textContent="Source index unavailable: "+error.message;
    countEl.textContent="Browse the public Lean repositories below or open the selected source inventory on GitHub.";
    proofList.innerHTML='<p class="atlas-no-results">The locally indexed theorem list could not load. <a href="https://github.com/rickyjreyes/math/blob/main/reyes-problem-repository/VERIFIED_LEAN_RESULTS.md">Open the verified-results source index ↗</a></p>';
    repoGrid.innerHTML='<p class="atlas-no-results"><a href="https://github.com/rickyjreyes/math">Browse mathematics source ↗</a></p>';
  });
})();