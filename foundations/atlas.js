(() => {
  'use strict';
  const data=window.__wctFoundationAtlas;
  const root=document.querySelector('#wct-foundation-curated');
  const head=document.querySelector('.foundation-head');
  if(!data || !root || !head || document.getElementById('foundation-atlas-overview')) return;
  const groups=data.groups, core=data.coreWct;
  if(core.length!==8 || groups.length!==4 || groups.reduce((n,g)=>n+g.rows.length,0)!==33) return;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const accents={math:'#67d4ff',geometry:'#b6ffda',physics:'#ffcd5c',information:'#a899ff'};
  const names={math:'PDE & nonlinear waves',geometry:'Geometry & topology',physics:'Physics substrate',information:'Information & entropy'};
  const all=[];
  const make=(tag,cls,html)=>{
    const el=document.createElement(tag);
    if(cls)el.className=cls;
    if(html!==undefined)el.innerHTML=html;
    return el;
  };

  // The existing curated data, bibliography URLs, dates and summaries remain authoritative.
  // Transform the wide table presentation into semantic source lists without re-keying the records.
  groups.forEach(g=>{
    const sec=root.querySelector('#'+g.id);
    if(!sec)return;
    sec.classList.add('external-tier');
    sec.style.setProperty('--tier-accent',accents[g.id]);
    const list=make('ol','foundation-source-list');
    g.rows.forEach((r,i)=>{
      const id='foundation-'+g.id+'-'+(i+1);
      const li=make('li','foundation-source');
      li.id=id;
      li.dataset.group=g.id;
      li.dataset.search=[r[0],r[1],r[2],r[3],r[5],names[g.id]].join(' ').toLocaleLowerCase();
      const number=String(i+1).padStart(2,'0');
      li.innerHTML='<span class="source-no">'+number+'</span>'+
        '<time datetime="'+esc(r[2])+'">'+esc(r[2])+'</time>'+
        '<div class="source-main"><h3><a href="'+esc(r[4])+'" target="_blank" rel="noopener noreferrer">'+esc(r[0])+' ↗</a></h3>'+
        '<p class="source-authors">'+esc(r[1])+'</p><span class="source-domain">'+esc(r[5])+'</span></div>'+
        '<p class="source-why">'+esc(r[3])+'</p>';
      list.appendChild(li);
      all.push({id,group:g.id,year:Number(r[2]),title:r[0],authors:r[1],node:li});
    });
    const table=sec.querySelector('.table-wrap');
    if(table)table.replaceWith(list);else sec.appendChild(list);
  });
  if(all.length!==33)return;

  root.querySelectorAll('.wct-core-card').forEach((card,i)=>{
    card.id='wct-anchor-'+(i+1);
    const a=card.querySelector('h3 a');
    if(!a)return;
    const foot=make('div','core-foot','<span>R. J. REYES / CANONICAL WCT '+String(i+1).padStart(2,'0')+'</span><span>Open DOI ↗</span>');
    card.appendChild(foot);
  });
  head.querySelector('.actions')?.insertAdjacentHTML('beforeend','<a href="#foundation-timeline">Timeline</a><a href="#source-explorer">Search 33 sources</a>');
  const overview=make('section','foundation-overview foundation-atlas',
    '<div class="overview-statement"><span class="overview-kicker">An indexed research substrate, not a validation claim</span>'+
    '<h2>From established mathematics to testable WCT constructions.</h2>'+
    '<p>Read the established literature as the constraints, tools, and physical reference points for WCT. The eight Reyes records define the author’s research program; their inclusion does not promote a proposal to a proven theorem or independently confirmed physical result.</p></div>'+
    '<div class="foundation-metrics">'+
    '<div class="foundation-metric"><strong>08</strong><span>Canonical WCT papers</span></div>'+
    '<div class="foundation-metric"><strong>33</strong><span>External source records</span></div>'+
    '<div class="foundation-metric"><strong>04</strong><span>Established-literature domains</span></div>'+
    '<div class="foundation-metric"><strong>1872–2010</strong><span>External source publication range</span></div></div>');
  overview.id='foundation-atlas-overview';
  head.after(overview);

  const timeline=make('section','foundation-timeline foundation-atlas');
  timeline.id='foundation-timeline';
  timeline.innerHTML='<div class="atlas-head"><div><p class="eyebrow">ESTABLISHED PRIOR LITERATURE / 1872–2010</p><h2>Source chronology</h2></div>'+
    '<p>Every marker is an existing bibliographic record. Select a point to jump to its full citation and role below.</p></div>';
  const legend=make('div','timeline-legend');
  groups.forEach(g=>legend.innerHTML+='<span style="--dot:'+accents[g.id]+'"><i aria-hidden="true"></i>'+esc(names[g.id])+'</span>');
  timeline.appendChild(legend);
  const scroll=make('div','timeline-scroll');
  scroll.setAttribute('role','region');
  scroll.setAttribute('aria-label','Horizontal historical source timeline');
  scroll.setAttribute('tabindex','0');
  const chart=make('div','timeline-chart');
  groups.forEach(g=>{
    const lane=make('div','timeline-lane','<span class="timeline-lane-label">'+esc(names[g.id])+'</span>');
    const line=make('div','timeline-line');
    const collisions={};
    all.filter(x=>x.group===g.id).forEach(item=>{
      const key=String(item.year);
      const j=collisions[key]||0;collisions[key]=j+1;
      const dot=make('button','timeline-mark');
      dot.type='button';dot.dataset.jump=item.id;
      dot.style.setProperty('--x',(3+(item.year-1872)/(2010-1872)*94).toFixed(3)+'%');
      dot.style.setProperty('--dot',accents[g.id]);
      dot.style.setProperty('--offset',[0,-11,11,-5,5][j%5]+'px');
      dot.title=item.year+' · '+item.title;
      dot.setAttribute('aria-label','Go to '+item.title+', '+item.year);
      line.appendChild(dot);
      item.dot=dot;
    });
    lane.appendChild(line);chart.appendChild(lane);
  });
  const tickYears=[1872,1900,1925,1950,1975,2000,2010];
  const tickHTML=tickYears.map(y=>'<span style="--tx:'+(3+(y-1872)/(2010-1872)*94).toFixed(3)+'%">'+y+'</span>').join('');
  chart.appendChild(make('div','timeline-axis','<span></span><div class="timeline-ticks">'+tickHTML+'</div>'));
  scroll.appendChild(chart);timeline.appendChild(scroll);
  timeline.appendChild(make('p','timeline-hint','Swipe horizontally on narrow screens. Timeline markers and every source entry are keyboard accessible.'));

  const explorer=make('section','foundation-explorer foundation-atlas');
  explorer.id='source-explorer';
  explorer.innerHTML='<div class="atlas-head"><div><p class="eyebrow">EXTERNAL SOURCE INDEX</p><h2>Find the underlying work</h2></div>'+
    '<p>Search by author, title, mathematical role, year, or domain. All 33 primary links remain directly accessible.</p></div>';
  const controls=make('div','explorer-controls');
  const searchLabel=make('label','foundation-search','<span aria-hidden="true">⌕</span><input id="foundation-source-search" type="search" placeholder="Search names, concepts, dates…" autocomplete="off" aria-label="Search foundational sources">');
  const filter=make('div','foundation-filter');
  filter.setAttribute('role','group');filter.setAttribute('aria-label','Filter by foundation domain');
  [['all','All 33'],['math','PDE & waves'],['geometry','Geometry'],['physics','Physics'],['information','Information']].forEach((p,i)=>{
    const b=make('button','',esc(p[1]));b.type='button';b.dataset.facet=p[0];b.setAttribute('aria-pressed',i===0?'true':'false');filter.appendChild(b);
  });
  const reset=make('button','foundation-reset','Reset');reset.type='button';
  controls.append(searchLabel,filter,reset);explorer.appendChild(controls);
  const result=make('p','foundation-results','33 of 33 external references visible');result.setAttribute('role','status');result.setAttribute('aria-live','polite');explorer.appendChild(result);
  const empty=make('p','foundation-empty','No references match these filters. Try a broader term or reset the domain.');empty.hidden=true;explorer.appendChild(empty);

  const coreSection=root.querySelector('#wct-core');
  if(coreSection)coreSection.after(timeline,explorer);
  let facet='all';
  const search=searchLabel.querySelector('input');
  const refresh=()=>{
    const tokens=search.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    let visible=0;
    groups.forEach(g=>{
      let n=0;
      all.filter(x=>x.group===g.id).forEach(x=>{
        const match=(facet==='all'||x.group===facet)&&tokens.every(t=>x.node.dataset.search.includes(t));
        x.node.hidden=!match;x.dot?.classList.toggle('is-muted',!match);
        if(match){n++;visible++;}
      });
      const sec=root.querySelector('#'+g.id);
      if(sec)sec.hidden=n===0;
    });
    result.textContent=visible+' of 33 external references visible';
    empty.hidden=visible!==0;
  };
  filter.addEventListener('click',e=>{
    const b=e.target.closest('button[data-facet]');if(!b)return;
    facet=b.dataset.facet;
    filter.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    refresh();
  });
  search.addEventListener('input',refresh);
  reset.addEventListener('click',()=>{
    search.value='';facet='all';
    filter.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.facet==='all')));
    refresh();search.focus();
  });
  chart.addEventListener('click',e=>{
    const dot=e.target.closest('button[data-jump]');if(!dot)return;
    if(facet!=='all'||search.value){
      search.value='';facet='all';
      filter.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.facet==='all')));
      refresh();
    }
    const item=document.getElementById(dot.dataset.jump);
    if(item)item.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  });
  refresh();
  document.documentElement.classList.add('foundation-upgraded');
})();
