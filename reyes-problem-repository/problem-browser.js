(() => {
  "use strict";
  const base = "https://github.com/rickyjreyes/math/blob/main/reyes-problem-repository/";
  const els = {
    search: document.getElementById("rpr-search"),
    area: document.getElementById("rpr-area"),
    stage: document.getElementById("rpr-stage"),
    reset: document.getElementById("rpr-reset"),
    count: document.getElementById("rpr-results"),
    date: document.getElementById("rpr-snapshot"),
    areas: document.getElementById("rpr-area-list"),
    list: document.getElementById("rpr-list"),
    more: document.getElementById("rpr-more")
  };
  if (Object.values(els).some(el => !el)) return;

  const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const state = { data: [], displayed: 30 };
  const encodedSource = value => {
    const path = String(value || "");
    if (!/^problems\/[a-z0-9-]+\/GC\d{2,3}\.md$/.test(path)) return base + "ROADMAP_300.md";
    return base + path;
  };

  function stageOf(problem) {
    if (problem.status === "partially_resolved") return "Partially resolved GC";
    return problem.source_class === "original_formal_statement"
      ? "Candidate, formal statement" : "Candidate, provisional scope v1";
  }

  function clearActiveAreas() {
    els.areas.querySelectorAll("button[data-area]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.area === els.area.value));
    });
  }

  function filtered() {
    const query = els.search.value.toLocaleLowerCase().trim();
    const area = els.area.value;
    const stage = els.stage.value;
    return state.data.filter(problem => {
      if (area && problem.research_area !== area) return false;
      if (stage === "formal" && problem.source_class !== "original_formal_statement") return false;
      if (stage === "scoped" && problem.source_class !== "roadmap_candidate") return false;
      if (stage === "partial" && problem.status !== "partially_resolved") return false;
      if (!query) return true;
      return [problem.id, problem.title, problem.research_area, problem.question, problem.first_test]
        .some(value => String(value || "").toLocaleLowerCase().includes(query));
    });
  }

  function renderCard(problem) {
    const title = escape(problem.title);
    const summary = problem.question
      ? '<p>' + escape(problem.question) + '</p>'
      : '<p class="rpr-muted">Read the preserved formal mathematical statement and the associated research scope.</p>';
    const dossier = problem.source_class === "roadmap_candidate"
      ? '<a href="' + base + 'scoped/' + escape(problem.id) + '.md" target="_blank" rel="noopener noreferrer">Scope-v1 dossier ↗</a>'
      : '';
    const discussion = /^https:\/\/github\.com\/rickyjreyes\/math\/issues\/\d+$/.test(problem.discussion_issue || "")
      ? '<a href="' + escape(problem.discussion_issue) + '" target="_blank" rel="noopener noreferrer">Discussion ↗</a>' : '';
    return '<article class="rpr-problem" id="' + escape(problem.id) + '">'
      + '<div class="rpr-problem-head"><span class="rpr-id">' + escape(problem.id) + '</span>'
      + '<span class="rpr-stage">' + escape(stageOf(problem)) + '</span></div>'
      + '<h3>' + title + '</h3><p class="rpr-area-text">' + escape(problem.research_area) + '</p>'
      + summary + '<div class="rpr-problem-links">'
      + '<a href="' + encodedSource(problem.file_path) + '" target="_blank" rel="noopener noreferrer">Read question ↗</a>'
      + '<a href="' + base + 'formal-reviews/' + escape(problem.id) + '.md" target="_blank" rel="noopener noreferrer">Research review ↗</a>'
      + dossier + discussion + '</div></article>';
  }

  function render() {
    const matching = filtered();
    const visible = matching.slice(0, state.displayed);
    els.list.innerHTML = visible.map(renderCard).join("");
    els.count.textContent = matching.length + " of " + state.data.length + " questions match"
      + (matching.length > visible.length ? " · showing first " + visible.length : "");
    els.more.hidden = matching.length <= visible.length;
    if (!matching.length) {
      els.list.innerHTML = '<p class="rpr-muted">No matching questions. Try a different keyword or clear filters.</p>';
    }
    clearActiveAreas();
  }

  function resetVisible() {
    state.displayed = 30;
    render();
  }

  function applyHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!/^GC\d{2,3}$/.test(id) || !state.data.some(item => item.id === id)) return;
    els.area.value = "";
    els.stage.value = "";
    els.search.value = id;
    resetVisible();
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ block: "start" });
  }

  els.search.addEventListener("input", resetVisible);
  els.area.addEventListener("change", resetVisible);
  els.stage.addEventListener("change", resetVisible);
  els.reset.addEventListener("click", () => {
    els.search.value = "";
    els.area.value = "";
    els.stage.value = "";
    resetVisible();
    els.search.focus();
  });
  els.more.addEventListener("click", () => {
    state.displayed += 30;
    render();
  });
  els.areas.addEventListener("click", event => {
    const button = event.target.closest("button[data-area]");
    if (!button) return;
    els.area.value = button.dataset.area;
    resetVisible();
    document.getElementById("browse").scrollIntoView({ block: "start" });
  });
  window.addEventListener("hashchange", applyHash);

  fetch("./problem-index.json", { cache: "no-cache" }).then(response => {
    if (!response.ok) throw new Error("HTTP " + response.status);
    return response.json();
  }).then(registry => {
    if (!Array.isArray(registry.entries) || registry.entries.length !== 300
        || !Array.isArray(registry.research_areas) || registry.research_areas.length !== 12) {
      throw new Error("Invalid registry snapshot");
    }
    state.data = registry.entries;
    const options = registry.research_areas;
    options.forEach(({ name, count }, index) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name + " (" + count + ")";
      els.area.appendChild(option);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "rpr-area";
      button.dataset.area = name;
      button.setAttribute("aria-pressed", "false");
      const number = String(index + 1).padStart(2, "0");
      button.innerHTML = '<strong>' + number + '</strong><span>' + escape(name)
        + '</span><small>' + count + '</small>';
      els.areas.appendChild(button);
    });
    els.areas.querySelector("p")?.remove();
    els.date.textContent = "Registry reviewed " + (registry.source_last_reviewed || "2026-10-29")
      + " · Site snapshot " + (registry.snapshot_date || "2026-11-02");
    if (location.hash.startsWith("#GC")) applyHash();
    else render();
  }).catch(() => {
    els.count.textContent = "The local problem index could not be loaded.";
    els.areas.innerHTML = '<p class="rpr-muted">Use the complete source roadmap on GitHub.</p>';
    els.list.innerHTML = '<p class="rpr-muted"><a href="' + base
      + 'ROADMAP_300.md">Read the 300-question index ↗</a></p>';
    els.more.hidden = true;
  });
})();