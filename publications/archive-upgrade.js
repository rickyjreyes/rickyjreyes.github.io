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
    status:label(row.querySelector('.pub-status')),
    abstract:label(row.querySelector('.pub-preview-abstract')),
    dateText:originalDate(row),
    date:parseDate(originalDate(row)),
    id:label(row.querySelector('.pub-index-number')).replace(/^Release\s*/,'')||label(row.querySelector(':scope > span'))
  }));
  if(entries.some(e=>!e.date))return;

  // Real monthly calendars. Use release dates as documented: never assign an
  // invented day to a month-only record or collapse multiple releases on one day.
  const atlas=document.createElement('section');
  atlas.className='pub-date-atlas pub-calendar-atlas';
  atlas.id='pub-date-atlas';
  atlas.setAttribute('aria-labelledby','pub-atlas-title');
  atlas.innerHTML='<div class="pub-atlas-head"><div><p class="paper-kicker">Release chronology</p><h2 id="pub-atlas-title">The research calendar.</h2></div><p>Each colored calendar square marks a release date in its research track. Select a day to open that publication below.</p></div>'+
    '<div class="pub-atlas-summary"><span><strong>28</strong> research releases</span><span><strong>06</strong> research tracks</span><span><strong>2025—26</strong> chronology range</span></div>';
  const grid=document.createElement('div');
  grid.className='pub-calendar-years';
  grid.setAttribute('aria-label','Release calendars for 2025 and 2026');
  const calendarCells=new Map();
  const calendarDayEntries=new Map();
  const weekdayNames=['M','T','W','T','F','S','S'];
  const dayKey=(year,mo,day)=>year+'-'+String(mo+1).padStart(2,'0')+'-'+String(day).padStart(2,'0');
  const makeDayButton=(matches,dayText,dayLabel,monthOnly)=>{
    const btn=document.createElement('button');
    btn.type='button';
    btn.className=monthOnly?'pub-calendar-month-only':'pub-calendar-day is-release';
    btn.dataset.pubIds=matches.map(e=>e.id).join(',');
    btn.style.setProperty('--pub-mark',matches[0].track.color);
    const note=monthOnly?' (only the month is recorded; no day is assigned)':'';
    btn.setAttribute('aria-label',matches.length===1?
      'Open release '+matches[0].id+': '+matches[0].title+', '+dayLabel+note:
      'Choose among '+matches.length+' publications dated '+dayLabel+note);
    // A styled, keyboard-accessible hover preview is rendered below; no duplicate native tooltip.
    if(monthOnly){
      btn.innerHTML='<span class="pub-calendar-month-only-label">Month only</span><strong>'+matches.map(e=>'#'+esc(e.id)).join(' · ')+'</strong>';
    }else{
      btn.innerHTML='<span class="pub-calendar-day-number">'+dayText+'</span>'+(matches.length>1?'<span class="pub-calendar-multi">'+matches.length+'</span>':'');
    }
    matches.forEach(e=>calendarCells.set(e.id,btn));
    calendarDayEntries.set(btn,matches);
    return btn;
  };
  [2025,2026].forEach(year=>{
    const yearEntries=entries.filter(e=>e.date.year===year);
    const section=document.createElement('section');
    section.className='pub-calendar-year';
    section.dataset.pubYear=String(year);
    section.innerHTML='<div class="pub-calendar-year-head"><h3>'+year+'</h3><span>'+yearEntries.length+' releases · '+(year===2025?'April—December':'January—September')+'</span></div>';
    const monthsGrid=document.createElement('div');
    monthsGrid.className='pub-calendar-months';
    const first=year===2025?3:0;
    for(let mo=first;mo<first+9;mo++){
      const inMonth=yearEntries.filter(e=>e.date.mo===mo);
      const month=document.createElement('article');
      month.className='pub-calendar-month';
      month.dataset.pubMonth=year+'-'+String(mo+1).padStart(2,'0');
      month.innerHTML='<div class="pub-calendar-month-head"><h4>'+months[mo]+'</h4><span>'+inMonth.length+' '+(inMonth.length===1?'release':'releases')+'</span></div>';
      const weekday=document.createElement('div');
      weekday.className='pub-calendar-weekdays';
      weekday.setAttribute('aria-hidden','true');
      weekdayNames.forEach(n=>{const span=document.createElement('span');span.textContent=n;weekday.appendChild(span);});
      month.appendChild(weekday);
      const days=document.createElement('div');
      days.className='pub-calendar-days';
      const firstWeekday=(new Date(Date.UTC(year,mo,1)).getUTCDay()+6)%7;
      for(let blank=0;blank<firstWeekday;blank++){
        const space=document.createElement('span');space.className='pub-calendar-blank';space.setAttribute('aria-hidden','true');days.appendChild(space);
      }
      const nDays=new Date(Date.UTC(year,mo+1,0)).getUTCDate();
      for(let day=1;day<=nDays;day++){
        const matches=inMonth.filter(e=>e.date.day===day);
        if(matches.length){
          const btn=makeDayButton(matches,String(day),matches[0].dateText,false);
          btn.dataset.pubDate=dayKey(year,mo,day);
          btn.style.setProperty('--pub-delay',Math.min(390,(mo-first)*43+day*2)+'ms');
          days.appendChild(btn);
        }else{
          const span=document.createElement('span');span.className='pub-calendar-day is-empty';span.textContent=String(day);span.setAttribute('aria-hidden','true');days.appendChild(span);
        }
      }
      for(let tail=firstWeekday+nDays;tail<42;tail++){
        const space=document.createElement('span');space.className='pub-calendar-blank';space.setAttribute('aria-hidden','true');days.appendChild(space);
      }
      month.appendChild(days);
      const monthOnly=inMonth.filter(e=>e.date.monthOnly);
      if(monthOnly.length)month.appendChild(makeDayButton(monthOnly,'',monthOnly[0].dateText,true));
      monthsGrid.appendChild(month);
    }
    section.appendChild(monthsGrid);grid.appendChild(section);
  });
  atlas.appendChild(grid);
  const picker=document.createElement('div');
  picker.className='pub-calendar-picker';
  picker.hidden=true;
  picker.setAttribute('role','region');
  picker.setAttribute('aria-label','Choose a publication sharing a release date');
  atlas.appendChild(picker);
  const mapNote=document.createElement('p');
  mapNote.className='pub-atlas-note';
  mapNote.textContent='Filled squares are recorded release days, colored by research track. Month-only entries appear separately without an invented day. The documented chronology may differ from later Zenodo deposits or revisions; the source archive order is preserved.';
  atlas.appendChild(mapNote);
  header.after(atlas);

  // One lightweight floating preview for all 28 release cells. The content is
  // taken from their existing canonical publication rows, not invented copy.
  const hover=document.createElement('div');
  hover.id='pub-calendar-hover';
  hover.className='pub-calendar-hover';
  hover.setAttribute('role','tooltip');
  hover.hidden=true;
  document.body.appendChild(hover);
  let hoverTarget=null;
  const hideHover=()=>{
    if(hoverTarget)hoverTarget.removeAttribute('aria-describedby');
    hoverTarget=null;
    hover.hidden=true;
  };
  const showHover=btn=>{
    const matches=calendarDayEntries.get(btn)||[];
    if(!matches.length)return;
    if(hoverTarget&&hoverTarget!==btn)hoverTarget.removeAttribute('aria-describedby');
    hoverTarget=btn;
    btn.setAttribute('aria-describedby','pub-calendar-hover');
    hover.style.setProperty('--hover-track',matches[0].track.color);
    hover.innerHTML='<div class="pub-hover-head"><strong>'+esc(matches[0].dateText)+'</strong><span>'+matches.length+' '+(matches.length===1?'release':'releases')+'</span></div>'+
      matches.map(entry=>
        '<div class="pub-hover-item" style="--hover-track:'+esc(entry.track.color)+'">'+
          '<div class="pub-hover-meta"><span>Release '+esc(entry.id)+'</span><span>'+esc(entry.track.name)+'</span></div>'+
          '<strong class="pub-hover-title">'+esc(entry.title)+'</strong>'+
          '<p class="pub-hover-status">'+esc(entry.status)+'</p>'+
          '<p class="pub-hover-abstract">'+esc(entry.abstract)+'</p>'+
        '</div>'
      ).join('')+
      '<p class="pub-hover-hint">'+(matches.length===1?'Select the date to view the publication.':'Select the date to choose a publication.')+'</p>';
    hover.hidden=false;
    const rect=btn.getBoundingClientRect();
    const width=hover.offsetWidth,height=hover.offsetHeight;
    const margin=12;
    const roomRight=window.innerWidth-rect.right;
    const left=roomRight>=width+margin ? rect.right+margin :
      rect.left>=width+margin ? rect.left-width-margin :
      Math.min(Math.max(margin,rect.left+rect.width/2-width/2),Math.max(margin,window.innerWidth-width-margin));
    const top=Math.min(Math.max(margin,rect.top-14),Math.max(margin,window.innerHeight-height-margin));
    hover.style.left=Math.round(left)+'px';
    hover.style.top=Math.round(top)+'px';
  };
  calendarDayEntries.forEach((matches,btn)=>{
    btn.addEventListener('mouseenter',()=>showHover(btn));
    btn.addEventListener('mouseleave',()=>{if(hoverTarget===btn)hideHover();});
    btn.addEventListener('focus',()=>showHover(btn));
    btn.addEventListener('blur',()=>{if(hoverTarget===btn)hideHover();});
    btn.addEventListener('pointerdown',hideHover,{passive:true});
  });
  window.addEventListener('scroll',hideHover,{passive:true});
  window.addEventListener('resize',hideHover,{passive:true});

  const syncCalendar=()=>{
    const active=label(archive.querySelector('.pub-index-item.pub-current .pub-index-number')).replace(/^Release\s*/,'');
    calendarCells.forEach((cell,id)=>{
      cell.classList.toggle('is-active',id===active || calendarDayEntries.get(cell)?.some(e=>e.id===active));
      cell.classList.toggle('is-filtered-out',calendarDayEntries.get(cell)?.every(e=>e.row.hidden));
    });
    atlas.querySelectorAll('.pub-calendar-year').forEach(yearSection=>{
      const entry=entries.find(e=>e.id===active);
      const selected=!!entry&&String(entry.date.year)===yearSection.dataset.pubYear;
      yearSection.classList.toggle('is-active',selected);
      yearSection.style.setProperty('--pub-year-active',selected?entry.track.color:'var(--text)');
    });
  };
  const activePicker=(matches)=>{
    picker.hidden=false;
    picker.innerHTML='<div class="pub-calendar-picker-head"><strong>'+esc(matches[0].dateText)+'</strong><span>'+matches.length+' releases on this date</span><button type="button" class="pub-calendar-picker-close" aria-label="Close publication choices">×</button></div><div class="pub-calendar-picker-items">'+
      matches.map(e=>'<button type="button" data-pub-jump="'+esc(e.id)+'" style="--pub-mark:'+esc(e.track.color)+'"><span>Release '+esc(e.id)+'</span><strong>'+esc(e.title)+'</strong></button>').join('')+'</div>';
    picker.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
    picker.querySelector('[data-pub-jump]')?.focus({preventScroll:true});
  };
  const jumpTo=(entry)=>{
    if(entry.row.hidden)reset?.click();
    picker.hidden=true;
    requestAnimationFrame(()=>{
      entry.row.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
    });
  };
  grid.addEventListener('click',e=>{
    const btn=e.target.closest('button[data-pub-ids]');if(!btn)return;
    const matches=calendarDayEntries.get(btn)||[];
    if(matches.length===1)jumpTo(matches[0]);
    else if(matches.length>1)activePicker(matches);
  });
  picker.addEventListener('click',e=>{
    if(e.target.closest('.pub-calendar-picker-close')){picker.hidden=true;return;}
    const btn=e.target.closest('button[data-pub-jump]');if(!btn)return;
    const entry=entries.find(x=>x.id===btn.dataset.pubJump);if(entry)jumpTo(entry);
  });
  document.addEventListener('wct-publication-active',syncCalendar);
  document.addEventListener('wct-publication-filter',syncCalendar);
  syncCalendar();
  // The calendar highlights are a passive visual response to native page scroll.
  // Reveal the date squares upon entrance, never intercept wheel/touch gestures.
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(changes=>{
      if(changes.some(change=>change.isIntersecting)){
        atlas.classList.add('is-revealed');observer.disconnect();
      }
    },{threshold:0.08});
    observer.observe(grid);
  }else atlas.classList.add('is-revealed');

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
  addButton('','All',28,'#67d4ff');
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

  // One stable DOM/layout in both natural and sticky positions. No sentinel,
  // class switching or spacer: CSS position:sticky handles the whole form.
  const facets=controls.querySelector('.pub-facets');
  const yearButtons=controls.querySelector('[data-year-buttons]');
  const resultCount=document.querySelector('[data-pub-count]');
  chooser.id='pub-sticky-tracks';
  facets.id='pub-sticky-facets';
  const bottom=document.createElement('div');
  bottom.className='pub-filter-bottom';
  controls.appendChild(bottom);
  bottom.append(facets,resultCount);
  const filterToggle=document.createElement('button');
  filterToggle.type='button';
  filterToggle.className='pub-sticky-toggle';
  filterToggle.setAttribute('aria-expanded','false');
  filterToggle.setAttribute('aria-controls','pub-sticky-tracks pub-sticky-facets');
  filterToggle.innerHTML='<span>Filters</span><span class="pub-sticky-count" hidden>0</span><span class="pub-sticky-caret" aria-hidden="true">⌄</span>';
  controls.appendChild(filterToggle);
  const setExpanded=expanded=>{
    controls.classList.toggle('is-expanded',expanded);
    filterToggle.setAttribute('aria-expanded',String(expanded));
  };
  filterToggle.addEventListener('click',()=>setExpanded(!controls.classList.contains('is-expanded')));
  controls.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&controls.classList.contains('is-expanded')){
      setExpanded(false);filterToggle.focus();
    }
  });
  const syncFilterBadge=()=>{
    const selectedYear=yearButtons.querySelector('button[aria-pressed="true"]')?.dataset.year||'';
    const active=[(q?.value||'').trim(),window.__wctPubTrack,cat?.value,controls.querySelector('[data-filter-status]')?.value,selectedYear].filter(Boolean).length;
    const indicator=filterToggle.querySelector('.pub-sticky-count');
    indicator.hidden=active===0;
    indicator.textContent=String(active);
    filterToggle.setAttribute('aria-label',active?'Filters, '+active+' active':'Filters');
  };
  document.addEventListener('wct-publication-filter',syncFilterBadge);
  syncFilterBadge();
  // The shared site navigation upgrades asynchronously and can resize.
  // Measure its actual bottom; sticky placement never depends on a 72px guess.
  const siteHeader=document.querySelector('.site-header');
  const syncHeader=()=>{
    const bottom=siteHeader?Math.ceil(siteHeader.getBoundingClientRect().bottom):142;
    document.documentElement.style.setProperty('--pub-nav-bottom',Math.max(0,bottom)+'px');
  };
  syncHeader();
  window.addEventListener('resize',syncHeader,{passive:true});
  if('ResizeObserver' in window&&siteHeader)new ResizeObserver(syncHeader).observe(siteHeader);

})();
