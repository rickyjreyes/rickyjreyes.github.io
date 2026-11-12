(() => {
  "use strict";
  const mount = document.getElementById("ranked-result-list");
  const query = document.getElementById("ranked-query");
  const repoFilter = document.getElementById("ranked-repository");
  const areaFilter = document.getElementById("ranked-area");
  const count = document.getElementById("ranked-count");
  const loadMore = document.getElementById("ranked-more");
  const reset = document.getElementById("ranked-reset");
  const alert = document.getElementById("ranked-status");
  if (![mount, query, repoFilter, areaFilter, count, loadMore, reset, alert].every(Boolean)) return;

  const trustedRepos = new Set([
    "rickyjreyes/math", "rickyjreyes/geometry_of_resonance",
    "rickyjreyes/wct-lean", "rickyjreyes/photodiode", "rickyjreyes/Wavelock"
  ]);
  const esc = value => String(value ?? "").replace(/[&<>"']/g, chr =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[chr]);
  const state = { entries: [], expanded: false };
  const shortRepo = repo => repo.split("/")[1];

  function validEntry(item) {
    if (!Number.isInteger(item.rank) || item.rank < 1 || item.rank > 40 ||
        !Number.isInteger(item.score) || item.score < 0 || item.score > 100 ||
        !trustedRepos.has(item.repo)) return false;
    const branch = shortRepo(item.repo) === "Wavelock" ? "master" : "main";
    const source = "https://github.com/" + item.repo + "/blob/" + branch + "/" + item.path;
    return /^([\w.-]+\/)+[\w.-]+\.lean$/.test(item.path) &&
      item.source_url === source &&
      ["title", "category", "summary", "limit", "group"].every(key =>
        typeof item[key] === "string" && item[key].trim().length > 0);
  }

  function optionize(select, values) {
    const label = select.options[0].textContent;
    select.textContent = "";
    const first = document.createElement("option");
    first.value = "";
    first.textContent = label;
    select.appendChild(first);
    values.forEach(value => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function row(item) {
    const prominent = item.rank <= 6 ? " ranked-item-strong" : "";
    return '<article class="ranked-item' + prominent + '" id="rank-result-' + item.rank + '">'
      + '<div class="ranked-position"><strong>#' + item.rank + '</strong>'
      + '<span>of 40</span></div>'
      + '<div class="ranked-copy"><div class="ranked-meta">'
      + '<span>' + esc(shortRepo(item.repo)) + '</span><span aria-hidden="true">·</span>'
      + '<span>' + esc(item.category) + '</span></div>'
      + '<h3>' + esc(item.title) + '</h3>'
      + '<p>' + esc(item.summary) + '</p>'
      + '<details class="ranked-detail"><summary>Proof scope and limitations</summary><p>' + esc(item.limit) + '</p></details>'
      + '<div class="ranked-links"><a href="' + esc(item.source_url) + '" target="_blank" rel="noopener noreferrer">Read Lean source ↗</a>'
      + '<span>' + esc(item.group) + '</span></div></div>'
      + '<div class="ranked-assessment" title="Editorial comparison only, not mathematical completeness">'
      + '<strong>' + item.score + '</strong><span>editorial /100</span></div></article>';
  }

  function render() {
    const q = query.value.trim().toLocaleLowerCase();
    const repository = repoFilter.value, area = areaFilter.value;
    const filtered = state.entries.filter(item =>
      (!repository || item.repo === repository) &&
      (!area || item.category === area) &&
      (!q || [item.title, item.repo, item.category, item.summary, item.limit, item.group]
        .join(" ").toLocaleLowerCase().includes(q)));
    const activeFilter = Boolean(q || repository || area);
    const visible = state.expanded || activeFilter ? filtered : filtered.slice(0, 8);
    mount.innerHTML = visible.length ? visible.map(row).join("") :
      '<p class="ranked-empty">No results match these filters. Try another theorem, topic or repository.</p>';
    count.textContent = "Showing " + visible.length + " of " + filtered.length +
      " matching public results (" + state.entries.length + " in the audited ranking).";
    loadMore.hidden = activeFilter || state.expanded || filtered.length <= visible.length;
    loadMore.textContent = "Show remaining " + (filtered.length - visible.length) + " results";
    reset.hidden = !activeFilter;
  }

  [query, repoFilter, areaFilter].forEach(control =>
    control.addEventListener(control === query ? "input" : "change", render));
  loadMore.addEventListener("click", () => { state.expanded = true; render(); });
  reset.addEventListener("click", () => {
    query.value = ""; repoFilter.value = ""; areaFilter.value = "";
    state.expanded = false; render(); query.focus();
  });

  fetch("./result-rankings.json", { cache: "no-cache" })
    .then(response => {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(data => {
      if (!data.public_only || data.global_pool !== 40 ||
          !Array.isArray(data.entries) || data.entries.length !== 27 ||
          data.private_entries_omitted !== 13 ||
          !data.entries.every(validEntry)) throw new Error("invalid source inventory");
      const ranks = data.entries.map(item => item.rank);
      if (new Set(ranks).size !== ranks.length || ranks.some((n,i) => i && n <= ranks[i-1])) {
        throw new Error("ranking order is invalid");
      }
      state.entries = data.entries;
      optionize(repoFilter, [...new Set(state.entries.map(item => item.repo))].sort());
      optionize(areaFilter, [...new Set(state.entries.map(item => item.category))].sort());
      alert.textContent = "Snapshot " + data.snapshot_date + " · " + data.entries.length +
        " public-source results · " + data.private_entries_omitted +
        " private-source entries withheld. Editorial comparison, not a theorem-completion score.";
      render();
    }).catch(() => {
      alert.textContent = "The public results index is temporarily unavailable.";
      count.textContent = "Use the existing theorem explorer and repository links below.";
      mount.innerHTML = '<p class="ranked-empty">The ranking file did not load. ' +
        '<a href="#proofs">Browse the verified Lean theorem highlights ↗</a>.</p>';
      loadMore.hidden = true; reset.hidden = true;
    });
})();
