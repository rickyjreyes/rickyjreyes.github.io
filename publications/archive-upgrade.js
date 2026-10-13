/* Publications enhancement: preserves the original archive DOM, date rail and scroll engine. */
(() => {
  'use strict';
  const archive=document.getElementById('archive');
  const header=document.querySelector('.pub-index-head');
  const controls=document.querySelector('.pub-controls');
  const rows=[...document.querySelectorAll('.pub-index-item')];
  if(!archive||!header||!controls||rows.length!==28||document.getElementById('pub-date-atlas'))return;

  const tracks=[
    {id:'foundations',name:'Foundations',color:'#b6ffda',expected:11,cats:['Primary WCT foundation','Mass, geometry, and dimensionality','Spectral dynamics','Mass and geometry']},
    {id:'particle',name:'Particle & collider',color:'#a899ff',expected:4,cats:['Mass-spectrum phenomenology','Collider phenomenology','Collider open-data analysis']},
    {id:'detectors',name:'Open data & detectors',color:'#67d4ff',expected:3,cats:['Experiment and detectability','Atomic open-data analysis','Gravitational-wave open-data analysis']},
    {id:'experiment',name:'Experiment',color:'#ffcd5c',expected:2,cats:['Experiment and physical systems','Experiment and protocol']},
    {id:'computation',name:'Computation & crypto',color:'#f29bc4',expected:4,cats:['Computation and complexity','Cryptographic research']},
    {id:'ai',name:'AI & control',color:'#7fd0ef',expected:4,cats:['AI architecture','AI prediction audit','Applied control architecture']}
  ];
  const groups=new Map();
  tracks.forEach(t=>t.cats.forEach(c=>groups.set(c,t)));
  const grouped=rows.map(row=>({row,track:groups.get(row.dataset.category)}));
  if(grouped.some(x=>!x.track)||tracks.some(t=>grouped.filter(x=>x.track===t).length!==t.expected))return;
  grouped.forEach(x=>{x.row.dataset.track=x.track.id;x.row.style.setProperty('--pub-track-color',x.track.color);});
  const label=(node)=>node?.textContent?.trim()||'';
  const originalDate=row=>row.querySelector('.pub-rail-date time')?.getAttribute('aria-label')||label(row.querySelector('.pub-index-date'));
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fullMonths=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const parseDate=s=>{
    const m=/^([A-Za-z]+)(?:\s+(\d{1,2}),)?\s+(\d{4})$/.exec(s);
    if(!m)return null;
    const mo=fullMonths.indexOf(m[1]),year=Number(m[3]),day=m[2]?Number(m[2]):null;
    if(mo<0||![2025,2026].includes(year)||day!==null&&(day<1||day>new Date(year,mo+1,0).getDate()))return null;
    return {year,mo,day,monthOnly:day===null};
  };
  const entries=grouped.map(({row,track})=>({
    row,track,title:label(row.querySelector('h2 a')),
    dateText:originalDate(row),
    date:parseDate(originalDate(row)),
    id:label(row.querySelector('.pub-index-number')).replace(/^Release\s*/,'')||label(row.querySelector(':scope > span'))
  }));
  if(entries.some(e=>!e.date))return;

  // Independent compact map; plot month-only entries at month midpoint for drawing only.
  const atlas=document.createElement('section');
  atlas.className='pub-date-atlas';
  atlas.id='pub-date-atlas';
  atlas.setAttribute('aria-labelledby','pub-atlas-title');
  atlas.innerHTML='<div class="pub-atlas-head"><div><p class="paper-kicker">Release chronology</p><h2 id="pub-atlas-title">An archive in time.</h2></div><p>Explore the original release dates, then continue down the full publication rail. Select any marker to jump to its record.</p></div>'+
    '<div class="pub-atlas-summary"><span><strong>28</strong> research releases</span><span><strong>06</strong> research tracks</span><span><strong>2025—26</strong> chronology range</span></div>';
  const viewport=document.createElement('div');
  viewport.className='pub-atlas-scroll';
  viewport.tabIndex=0;
  viewport.setAttribute('role','region');
  viewport.setAttribute('aria-label','2025 to 2026 research release chronology');
  const grid=document.createElement('div');grid.className='pub-atlas-years';
  [2025,2026].forEach(year=>{
    const first=year===2025?3:0;
    const group=document.createElement('div');
    group.className='pub-atlas-year';
    group.innerHTML='<div class="pub-atlas-year-head"><strong>'+year+'</strong><span>'+(year===2025?'April—December':'January—September')+'</span></div>';
    const lane=document.createElement('div');lane.className='pub-atlas-lane';
    const monthRow=document.createElement('div');monthRow.className='pub-atlas-months';
    for(let i=0;i<9;i++){
      const div=document.createElement('span');div.textContent=months[first+i];monthRow.appendChild(div);
    }
    const marks=document.createElement('div');marks.className='pub-atlas-marks';
    const occupancy={};
    entries.filter(e=>e.date.year===year).forEach(e=>{
      const slot=e.date.mo-first;
      const n=occupancy[slot]||0;occupancy[slot]=n+1;
      const days=new Date(year,e.date.mo+1,0).getDate();
      const fraction=e.date.monthOnly?.5:(e.date.day-.5)/days;
      const x=(slot+fraction)/9*100;
      const y=[19,43,67,30,56][n%5];
      const btn=document.createElement('button');
      btn.type='button';btn.className='pub-atlas-mark';btn.dataset.pubJump=e.id;
      btn.style.setProperty('--pub-x',x.toFixed(3)+'%');
      btn.style.setProperty('--pub-y',y+'px');
      btn.style.setProperty('--pub-mark',e.track.color);
      const note=e.date.monthOnly?' (month-only chronology; marker position approximate)':'';
      btn.setAttribute('aria-label','Go to '+e.title+', '+e.dateText+note);
      btn.title=e.dateText+' · '+e.title+note;
      marks.appendChild(btn);
    });
    lane.append(marks,monthRow);group.appendChild(lane);
    // Native-flow chronology on mobile; share the same unique release IDs as desktop.
    const yearEntries=entries.filter(e=>e.date.year===year)
      .sort((a,b)=>a.date.mo-b.date.mo||((a.date.day??15)-(b.date.day??15))||a.id.localeCompare(b.id));
    const mobile=document.createElement('details');
    mobile.className='pub-atlas-mobile-year';
    mobile.innerHTML='<summary><span>'+year+'</span><span>'+yearEntries.length+' releases</span></summary><ol>'+
      yearEntries.map(e=>'<li><button type="button" data-pub-jump="'+esc(e.id)+'"><time>'+esc(e.dateText)+'</time><span>'+esc(e.title)+'</span><small>Release '+esc(e.id)+'</small></button></li>').join('')+'</ol>';
    group.appendChild(mobile);grid.appendChild(group);
  });
  viewport.appendChild(grid);atlas.appendChild(viewport);
  const mapNote=document.createElement('p');
  mapNote.className='pub-atlas-note';
  mapNote.textContent='Positions follow the stated chronology dates; month-only entries are positioned approximately. DOI deposit dates and later revisions may differ. The original archive order below is preserved.';
  atlas.appendChild(mapNote);
  header.after(atlas);

  // Research-track shortcuts enhance, rather than replace, existing detailed filters.
  const chooser=document.createElement('fieldset');
  chooser.className='pub-track-chooser';
  chooser.innerHTML='<legend>Browse by research track</legend><div class="pub-track-buttons" role="group" aria-label="Research track filters"></div>';
  const buttons=chooser.querySelector('.pub-track-buttons');
  const addButton=(id,name,count,color)=>{
    const b=document.createElement('button');b.type='button';b.dataset.pubTrack=id;
    b.style.setProperty('--pub-track-color',color||'#67d4ff');
    b.setAttribute('aria-pressed',String(id===''));
    b.innerHTML='<span class="pub-track-dot" aria-hidden="true"></span>'+esc(name)+' <span class="pub-track-number">'+count+'</span>';
    buttons.appendChild(b);
  };
  addButton('','All releases',28,'#67d4ff');
  tracks.forEach(t=>addButton(t.id,t.name,t.expected,t.color));
  controls.prepend(chooser);
  const q=document.querySelector('[data-search-input]');
  const cat=document.querySelector('[data-filter-category]');
  const reset=document.querySelector('[data-pub-reset]');
  window.__wctPubTrack='';
  const sync=()=>buttons.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pubTrack===window.__wctPubTrack)));
  const apply=()=>q?.dispatchEvent(new Event('input',{bubbles:true}));
  buttons.addEventListener('click',e=>{
    const b=e.target.closest('button[data-pub-track]');if(!b)return;
    window.__wctPubTrack=b.dataset.pubTrack;
    if(cat)cat.value=''; // avoid contradictory broad-track and exact-category facets
    sync();apply();
  });
  // Original reset and exact-category controls remain in charge of the baseline filters.
  reset?.addEventListener('click',()=>{window.__wctPubTrack='';sync();},true);
  cat?.addEventListener('change',()=>{window.__wctPubTrack='';sync();},true);
  grid.addEventListener('click',e=>{
    const mark=e.target.closest('button[data-pub-jump]');
    if(!mark)return;
    const entry=entries.find(x=>x.id===mark.dataset.pubJump);
    if(!entry)return;
    if(entry.row.hidden)reset?.click(); // reveal hidden target without altering source order
    requestAnimationFrame(()=>{
      entry.row.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
    });
  });

  // Make the original row surface clickable, while keeping its title anchor canonical.
  archive.addEventListener('click',e=>{
    const row=e.target.closest('.pub-index-item');if(!row||e.target.closest('a,button,input,select,summary,details'))return;
    const selection=window.getSelection?.();if(selection&&String(selection).trim())return;
    const anchor=row.querySelector('h2 a');if(anchor)window.location.assign(anchor.href);
  });
  // DOI is a source URI, not a new or independently verified research-status claim.
  rows.forEach(row=>{
    const code=row.querySelector(':scope > div > code');if(!code)return;
    const doi=label(code);
    if(!/^10\.\d{4,9}\/\S+$/.test(doi))return;
    const a=document.createElement('a');
    a.href='https://doi.org/'+encodeURI(doi);a.textContent=doi;
    a.target='_blank';a.rel='noopener noreferrer';
    a.setAttribute('aria-label','Open DOI '+doi+' in a new tab');
    code.replaceChildren(a);
  });

  document.documentElement.classList.add('pub-enhanced');
})();
