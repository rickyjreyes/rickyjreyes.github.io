(() => {
  "use strict";
  const list = document.getElementById("math-paper-list");
  const queryInput = document.getElementById("math-paper-search");
  const familyFilter = document.getElementById("math-paper-category");
  const status = document.getElementById("math-paper-status");
  if (!list || !queryInput || !familyFilter || !status) return;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, chr => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[chr]);
  const source = "https://github.com/rickyjreyes/math/blob/main/";
  const trusted = value => {
    const str = String(value || "");
    return /^(?:preprints|compendium|papers)\/[\w-]+\/(?:[\w-]+\/)*[\w.-]+\.(?:pdf|tex|md)$/.test(str);
  };
  let sections = [];
  const group = section => section.name.startsWith("F") && /^F\d{2}\b/.test(section.name)
    ? "F-series" : section.name.startsWith("Compendium")
    ? "compendium" : "supplementary";
  const link = (path,label) => path && trusted(path)
    ? '<a href="'+esc(source+path)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' ↗</a>' : "";
  function render() {
    const q = queryInput.value.trim().toLocaleLowerCase();
    const selected = familyFilter.value;
    const matching = sections.map((section,index) => {
      if (selected && group(section) !== selected) return null;
      const titleMatch = section.name.toLocaleLowerCase().includes(q);
      const papers = section.papers.filter(p => !q || titleMatch ||
        [p.title,p.pdf,p.tex,p.notes].some(v=>String(v||"").toLocaleLowerCase().includes(q)));
      return papers.length ? {section,papers,index} : null;
    }).filter(Boolean);
    const paperCount = matching.reduce((sum,x)=>sum+x.papers.length,0);
    status.textContent = paperCount+' manuscript PDFs in '+matching.length+' source catalogue sections match';
    if (!paperCount) {
      list.innerHTML = '<p class="atlas-no-results">No paper matches these filters. Try a title, family, or mathematical topic.</p>';
      return;
    }
    list.innerHTML = matching.map(({section,papers,index}) => {
      const open = q || (section.name.startsWith("F01")) ? " open" : "";
      return '<details class="math-hub-manuscript-family"'+open+'>'
        +'<summary><span><span class="math-hub-family-number">'+String(index+1).padStart(2,"0")+'</span>'
        +esc(section.name)+'</span><span class="math-hub-family-count">'+papers.length+' PDF'+(papers.length===1?'':'s')+'</span></summary>'
        +'<div class="math-hub-paper-entries">'+papers.map(p=>'<article class="math-hub-paper">'
          +'<strong>'+esc(p.title)+'</strong>'
          +'<nav aria-label="Manuscript sources">'+[link(p.pdf,"Read PDF"),link(p.tex,"LaTeX source"),link(p.notes,"Research notes")].filter(Boolean).join('')
          +'</nav></article>').join('')+'</div></details>';
    }).join("");
  }
  const params = new URLSearchParams(location.search);
  const initialPaper = params.get("paper");
  if(initialPaper) queryInput.value = initialPaper.slice(0,100);
  queryInput.addEventListener("input",render);
  familyFilter.addEventListener("change",render);
  fetch("./manuscripts.json",{cache:"no-cache"}).then(async response=>{
    if(!response.ok)throw Error("HTTP "+response.status);
    return response.json();
  }).then(data=>{
    if(!Array.isArray(data.sections)||data.section_count!==21||data.paper_count!==28||
       data.sections.reduce((n,x)=>n+x.papers.length,0)!==28)throw Error("Invalid manuscript source index");
    sections = data.sections;
    render();
  }).catch(err=>{
    status.textContent="Local manuscript index unavailable: "+err.message;
    list.innerHTML='<p class="atlas-no-results">Read the full <a href="https://github.com/rickyjreyes/math/blob/main/CONTENTS.md">source manuscript catalogue on GitHub ↗</a>.</p>';
  });
})();
