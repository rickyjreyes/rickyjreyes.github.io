(() => {
  "use strict";
  const base = "https://github.com/rickyjreyes/math/blob/main/reyes-problem-repository/";
  const original = "https://raw.githubusercontent.com/rickyjreyes/math/main/reyes-problem-repository/";
  const areaOrder = [
    "Nonlinear wave dynamics", "Confinement and curvature geometry",
    "Spectral theory and scattering", "Variational analysis and solitons",
    "Higher-derivative field theory", "Inverse problems, observability and control",
    "Pattern formation and disorder", "Topology and multicomponent fields",
    "Computability and complexity", "Lean formalization and certified analysis",
    "Physical emergence and multiscale limits",
    "Photonic computation and physical information"
  ];
  const els = {
    search: document.getElementById("rpr-search"),
    area: document.getElementById("rpr-area"),
    stage: document.getElementById("rpr-stage"),
    reset: document.getElementById("rpr-reset"),
    count: document.getElementById("rpr-results"),
    date: document.getElementById("rpr-snapshot"),
    areas: document.getElementById("rpr-area-list"),
    list: document.getElementById("rpr-list"),
    more: document.getElementById("rpr-more"),
    reviewAll: document.getElementById("rpr-reviews-toggle")
  };
  if (Object.values(els).some(element => !element)) return;
  const escape = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
  const state = { registry: [], areas: [], cache: new Map(), shown: 25,
    token: 0, sourceSha: "", reviewExpanded: false, focusId: "" };
  const fullLocation = area => {
    const i = state.areas.findIndex(x => x.name === area);
    return i < 0 ? "" : "./full-" + String(i + 1).padStart(2, "0") + ".json";
  };
  const source = (value, fallback = "ROADMAP_300.md") => {
    const path = String(value || fallback);
    if (!/^(?:FORMAL_PROBLEMS\.md|(?:problems\/[a-z0-9-]+\/|scoped\/|formal-reviews\/)[\w.-]+\.md)$/.test(path)) {
      return base + fallback;
    }
    return base + path;
  };
  const isValidGC = value => /^GC(?:0[1-9]|[1-9]\d|[12]\d\d|300)$/.test(value);
  const stageName = item => item.status === "partially_resolved"
    ? "Partially resolved" : item.source_class === "original_formal_statement"
      ? "Formal original" : "Provisional scope v1";

  function safeLink(href, current) {
    try {
      const address = new URL(href, source(current));
      if (address.protocol !== "https:" && address.protocol !== "http:") return null;
      return address.href;
    } catch (_) { return null; }
  }

  function inline(text, path) {
    const replacements = [];
    const hold = html => {
      const index = replacements.length;
      replacements.push(html);
      return "\uE000" + index + "\uE001";
    };
    let data = String(text || "");
    data = data.replace(/`([^`\n]+)`/g, (_, code) => hold('<code>' + escape(code) + '</code>'));
    data = data.replace(/\$([^\$\n]+)\$/g, (_, math) => hold('\\(' + escape(math) + '\\)'));
    data = data.replace(/\[([^\]]+)\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g, (_, label, url) => {
      const address = safeLink(url, path);
      return hold(address
        ? '<a href="' + escape(address) + '" target="_blank" rel="noopener noreferrer">' + escape(label) + '</a>'
        : escape(label));
    });
    data = escape(data);
    data = data.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    data = data.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
    data = data.replace(/\uE000(\d+)\uE001/g, (_, i) => replacements[Number(i)] || "");
    return data;
  }

  function markdown(text, path, hideFirstTitle = false) {
    const lines = String(text || "").replace(/\r\n?/g,"\n").split("\n");
    let html = "", paragraph = [], list = [], fence = null, code = [];
    const flushText = () => {
      if (!paragraph.length) return;
      html += '<p>' + inline(paragraph.join(" "),path) + '</p>';
      paragraph = [];
    };
    const flushList = () => {
      if (!list.length) return;
      html += '<ul>' + list.map(value => '<li>' + inline(value,path) + '</li>').join("") + '</ul>';
      list = [];
    };
    const flushCode = () => {
      if (fence === null) return;
      const body = code.join("\n");
      html += fence === "math" || fence === "latex"
        ? '<div class="rpr-math-block">\\[' + escape(body) + '\\]</div>'
        : '<pre class="rpr-source-code"><code>' + escape(body) + '</code></pre>';
      fence = null;
      code = [];
    };
    for (let j = 0; j < lines.length; j++) {
      const line = lines[j].trimEnd();
      const trimmed = line.trim();
      if (fence !== null) {
        if (/^\`\`\`/.test(trimmed)) flushCode();
        else code.push(line);
        continue;
      }
      const start = /^\`\`\`([\w-]*)/.exec(trimmed);
      if (start) { flushText(); flushList(); fence = start[1]; continue; }
      if (!trimmed) { flushText(); flushList(); continue; }
      const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
      if (heading) {
        flushText(); flushList();
        if (!(hideFirstTitle && j === 0)) {
          const level = Math.min(6, 3 + heading[1].length);
          html += '<h' + level + '>' + inline(heading[2],path) + '</h' + level + '>';
        }
        continue;
      }
      const bullet = /^\s*(?:[-*+]\s+|\d+[.)]\s+)(.+)$/.exec(line);
      if (bullet) { flushText(); list.push(bullet[1]); continue; }
      if (/^---+$/.test(trimmed)) { flushText(); flushList(); html += '<hr>'; continue; }
      if (/^>\s?/.test(trimmed)) {
        flushText(); flushList();
        html += '<blockquote>' + inline(trimmed.replace(/^>\s?/, ""),path) + '</blockquote>';
        continue;
      }
      if (list.length) flushList();
      paragraph.push(trimmed);
    }
    flushText(); flushList(); flushCode();
    return html;
  }

  function findMatches() {
    const query = els.search.value.toLocaleLowerCase().trim();
    const stage = els.stage.value;
    const area = els.area.value;
    return state.registry.filter(item => {
      if (area && item.research_area !== area) return false;
      if (stage === "formal" && item.source_class !== "original_formal_statement") return false;
      if (stage === "scoped" && item.source_class !== "roadmap_candidate") return false;
      if (stage === "partial" && item.status !== "partially_resolved") return false;
      if (!query) return true;
      return [item.id, item.title, item.research_area, item.question, item.first_test]
        .some(value => String(value || "").toLocaleLowerCase().includes(query));
    });
  }

  function renderAreas() {
    els.areas.innerHTML = areaOrder.map((name, i) => {
      const selected = els.area.value === name;
      return '<button type="button" class="rpr-area" data-area="' + escape(name)
        + '" aria-pressed="' + String(selected) + '"><strong>'
        + String(i+1).padStart(2,"0") + '</strong><span>' + escape(name)
        + '</span><small>25 questions</small></button>';
    }).join("");
  }

  async function readArea(area) {
    if (state.cache.has(area)) return state.cache.get(area);
    const promise = fetch(fullLocation(area), {cache:"no-cache"}).then(async response => {
      if (!response.ok) throw new Error("Full dossier file unavailable: " + area);
      const data = await response.json();
      if (!Array.isArray(data.entries) || data.entries.length !== 25 ||
          data.research_area !== area || !data.entries.every(item=>item.id && item.source_statement && item.formal_review)) {
        throw new Error("Incomplete full mathematical dossier for " + area);
      }
      if (data.source_commit) state.sourceSha = data.source_commit;
      return new Map(data.entries.map(item => [item.id, item]));
    });
    state.cache.set(area, promise);
    return promise.catch(err => { state.cache.delete(area); throw err; });
  }

  function links(item, detail) {
    const path = detail?.source_paths || {};
    const out = [
      ['Original question',source(path.individual_record || item.file_path)],
      ['Full mathematical review',source(path.formal_review || 'formal-reviews/'+item.id+'.md')],
    ];
    if (item.source_class === "roadmap_candidate") {
      out.push(['Scope-v1 target',source(path.scoped_target || 'scoped/'+item.id+'.md')]);
    } else {
      out.push(['Canonical formal statement',source('FORMAL_PROBLEMS.md')]);
    }
    if (/^https:\/\/github\.com\/rickyjreyes\/math\/issues\/\d+$/.test(item.discussion_issue || "")) {
      out.push(['Discussion',item.discussion_issue]);
    }
    return out.map(([text,url])=>'<a href="'+escape(url)+'" target="_blank" rel="noopener noreferrer">'+escape(text)+' ↗</a>').join("");
  }

  function card(item, detail) {
    const current = detail?.source_paths?.source_statement
      || (item.source_class === "original_formal_statement" ? "FORMAL_PROBLEMS.md" : item.file_path);
    const fallback = item.question || "The exact mathematical statement is available in the canonical source linked below.";
    const statement = detail
      ? markdown(detail.source_statement,current,true)
      : '<p>'+escape(fallback)+'</p>';
    const scoped = detail?.scoped_target
      ? '<section class="rpr-scope-section"><p class="rpr-column-label">Scoped mathematical target</p>'
        + markdown(detail.scoped_target,detail.source_paths.scoped_target,true)
        + '</section>' : '';
    const review = detail?.formal_review
      ? '<details class="rpr-full-review"' + (state.reviewExpanded ? " open" : "") + '>'
        + '<summary>Read full mathematical review: model, resolution, prior art, milestones and limitations</summary>'
        + '<div class="rpr-rich-text">'+ markdown(detail.formal_review,detail.source_paths.formal_review,true) + '</div>'
        + '</details>' : '<p class="rpr-load-warning">Full review text is temporarily unavailable; use the source links.</p>';
    return '<article class="rpr-question" id="'+escape(item.id)+'">'
      + '<div class="rpr-question-meta"><span class="rpr-id">'+escape(item.id)+'</span>'
      + '<span>'+escape(stageName(item))+'</span><span>Difficulty estimate: '+escape(item.difficulty_estimate ?? "unrated")+'/10</span></div>'
      + '<h3>'+escape(item.title)+'</h3>'
      + '<div class="rpr-primary-text"><p class="rpr-column-label">Original mathematical question and resolution standard</p>'
      + '<div class="rpr-rich-text">'+statement+'</div></div>'
      + scoped + review
      + '<div class="rpr-question-links">'+links(item,detail)+'</div></article>';
  }

  async function render() {
    const token = ++state.token;
    const matching = findMatches();
    renderAreas();
    els.count.textContent = matching.length + " matching questions across 12 research subjects";
    const visible = matching.slice(0,state.shown);
    els.more.hidden = visible.length >= matching.length;
    if (!visible.length) {
      els.list.innerHTML = '<p class="rpr-empty">No matching questions. Try another GC identifier or clear the filters.</p>';
      return;
    }
    els.list.innerHTML = '<p class="rpr-load-status" role="status">Loading complete question statements and review dossiers…</p>';
    const necessary = [...new Set(visible.map(item => item.research_area))];
    const loaded = await Promise.all(necessary.map(async area => {
      try { return [area,await readArea(area)]; }
      catch (error) { return [area,null]; }
    }));
    if (token !== state.token) return;
    const byArea = new Map(loaded);
    let html = "";
    for (const name of areaOrder) {
      const list = visible.filter(item=>item.research_area===name);
      if (!list.length) continue;
      html += '<section class="rpr-subject-group" aria-label="'+escape(name)+'">'
        + '<header class="rpr-subject-head"><div><p class="atlas-kicker">Mathematical subject '
        + String(areaOrder.indexOf(name)+1).padStart(2,"0")+' / 12</p><h3>'
        + escape(name)+'</h3></div><span>'+list.length+' shown / 25</span></header>'
        + list.map(item=>card(item,byArea.get(name)?.get(item.id))).join("")
        + '</section>';
    }
    els.list.innerHTML = html;
    els.date.textContent = state.sourceSha
      ? 'Source commit ' + state.sourceSha.slice(0,10) + ' · dated snapshot'
      : 'Source snapshot · October–November 2026';
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([els.list]).catch(()=>{});
    }
    if (state.focusId) {
      const target = document.getElementById(state.focusId);
      if (target) { target.scrollIntoView({block:"start"}); state.focusId = ""; }
    }
  }

  function resetView() { state.shown = 25; render(); }
  function fromHash() {
    const id=decodeURIComponent(location.hash.slice(1));
    if (!isValidGC(id) || !state.registry.length) return;
    const item=state.registry.find(x=>x.id===id);
    if (!item) return;
    els.area.value=item.research_area;
    els.search.value=id;
    els.stage.value="";
    state.focusId=id;
    resetView();
  }
  els.search.addEventListener("input",()=>{
    if (els.search.value.trim()) els.area.value="";
    resetView();
  });
  els.area.addEventListener("change",resetView);
  els.stage.addEventListener("change",resetView);
  els.reset.addEventListener("click",()=>{
    els.search.value="";els.area.value="Nonlinear wave dynamics";
    els.stage.value="";resetView();els.search.focus();
  });
  els.more.addEventListener("click",()=>{state.shown+=25;render();});
  els.reviewAll.addEventListener("click",()=>{
    state.reviewExpanded=!state.reviewExpanded;
    els.reviewAll.textContent=state.reviewExpanded?"Collapse all detailed reviews":"Expand all detailed reviews";
    els.list.querySelectorAll(".rpr-full-review").forEach(el=>{el.open=state.reviewExpanded;});
    if (state.reviewExpanded && window.MathJax?.typesetPromise)window.MathJax.typesetPromise([els.list]).catch(()=>{});
  });
  els.areas.addEventListener("click",event=>{
    const button=event.target.closest("button[data-area]");
    if (!button) return;
    els.area.value=button.dataset.area;
    els.search.value="";
    els.stage.value="";
    resetView();
    document.getElementById("browse").scrollIntoView({block:"start"});
  });
  els.list.addEventListener("toggle",event=>{
    if (event.target?.matches?.(".rpr-full-review") && event.target.open &&
        window.MathJax?.typesetPromise)window.MathJax.typesetPromise([event.target]).catch(()=>{});
  },true);
  window.addEventListener("hashchange",fromHash);

  fetch("./problem-index.json",{cache:"no-cache"}).then(response=>{
    if (!response.ok)throw new Error("Registry HTTP "+response.status);
    return response.json();
  }).then(data=>{
    if (!Array.isArray(data.entries)||data.entries.length!==300||!Array.isArray(data.research_areas)||data.research_areas.length!==12)throw Error("Invalid registry");
    state.registry=data.entries;state.areas=data.research_areas;
    els.area.innerHTML='<option value="">All 12 subjects</option>';
    areaOrder.forEach(name=>{
      const option=document.createElement("option");option.value=name;option.textContent=name;els.area.append(option);
    });
    els.area.value="Nonlinear wave dynamics";
    if (location.hash.startsWith("#GC"))fromHash();
    else render();
  }).catch(error=>{
    els.count.textContent="Unable to load full problem catalogue: "+error.message;
    els.list.innerHTML='<p class="rpr-empty">The catalogue could not load. <a href="'+base+'ROADMAP_300.md">Open all 300 questions on GitHub ↗</a></p>';
  });
})();