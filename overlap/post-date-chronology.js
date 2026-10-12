/* Progressive enhancement of the thirteen post-date review cards.
   The original HTML remains readable when JavaScript is unavailable. */
(() => {
  const original = Array.from(document.querySelectorAll('.comparison-card-reviewed'));
  const divider = document.querySelector('.comparison-review-divider#post-date-reviewed');
  if (!divider || original.length !== 13) return;

  const ledger = {'PD-01':193,'PD-02':184,'PD-03':199,'PD-04':178,'PD-05':180,'PD-06':183,'PD-07':8,'PD-08':12,'PD-09':176,'PD-10':187,'PD-11':186,'PD-12':188,'PD-13':185};
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const safeHref = value => /^https:\/\/[a-z0-9.-]+(?:[/:?#]|$)/i.test(value || '') ? value : '#';
  const records = original.map(card => {
    const id = card.querySelector('.comparison-id').textContent.trim();
    const pair = card.querySelectorAll('.comparison-pair > div');
    const early = pair[0], late = pair[1];
    const source = early.querySelector('a'), external = late.querySelector('a');
    const time = late.querySelector('time');
    const limits = Array.from(card.querySelectorAll('.comparison-limit')).map(node => node.textContent.trim());
    return {
      id, ledger:ledger[id], kind:['PD-07','PD-08'].includes(id) ? 'wct' : 'rca',
      date:time.dateTime, days:Number.parseInt(card.querySelector('.priority-lead-value').textContent,10),
      months:card.querySelector('.priority-lead-months').textContent.trim(),
      source:source ? source.textContent.trim() : '', sourceHref:source ? safeHref(source.href) : '#',
      sourceDate:early.querySelector('time').dateTime,
      title:external.textContent.trim(), href:safeHref(external.href),
      description:card.querySelector('.comparison-note').textContent.trim(),
      boundary:limits.find(s => s.startsWith('Evidence boundary:')) || '',
      version:limits.find(s => s.startsWith('Version note:')) || ''
    };
  });
  if (records.some(r => !r.date || !Number.isFinite(r.days) || !r.ledger)) return;

  let filter='all', sort='date', selected='';
  const shell=document.createElement('div');
  shell.className='pd-review';
  shell.id='post-date-reviewed';
  shell.innerHTML=
    '<header class="pd-header">'+
      '<p class="eyebrow">Reviewed October 9, 2026 · additional chronology records</p>'+
      '<h3>Thirteen additional post-date<br>research correspondences</h3>'+
      '<p>These later external papers and the December 2025 OWASP institutional security framework follow the dated WCT or RCA claims linked below. Their source dates and narrow technical correspondences have been reviewed. They remain separate from the six fully promoted cases: verifying exact claim content against the earliest archived Reyes version is still outstanding. Chronology does not establish influence, copying, derivation, or independent validation.</p>'+
    '</header>'+
    '<div class="pd-stats" aria-label="Additional chronology record counts"><div><strong>13</strong><span>post-date chronology-reviewed</span></div><div><strong>11</strong><span>RCA / AI</span></div><div><strong>2</strong><span>WCT / physics</span></div><div><strong>242</strong><span>total catalogue records, unchanged</span></div></div>'+
    '<div class="pd-chartbox"><div class="pd-charthead"><strong>Days from the earliest Reyes record to each later work</strong><span>Each lane starts at its own earlier record (day 0). Select a mark to open that record.</span></div><div class="pd-chartscroll"><div class="pd-chart" id="pd-chart"></div></div><div class="pd-legend"><span><i class="pd-dot"></i> Research paper</span><span><i class="pd-square"></i> Institutional framework</span><span><i class="pd-dash"></i> Version note — compare against v1</span></div></div>'+
    '<div class="pd-toolbar"><div class="pd-filters" role="group" aria-label="Filter post-date records"><button type="button" data-pd-filter="all">All 13</button><button type="button" data-pd-filter="rca">RCA / AI · 11</button><button type="button" data-pd-filter="wct">WCT / physics · 2</button></div><div class="pd-sorts" role="group" aria-label="Order post-date records"><span>Order</span><button type="button" data-pd-sort="date">By date</button><button type="button" data-pd-sort="ledger">By ledger ID</button></div></div>'+
    '<div class="pd-groups" id="pd-groups" aria-live="polite"></div>'+
    '<p class="pd-source">Source of record: machine-readable <a href="../priority/priority.json">priority registry</a> and <a href="../priority/external-convergence.json">external catalogue</a>. These thirteen entries are a reviewed subset of the existing external catalogue, not new additions to the 242-record total.</p>';
  divider.replaceWith(shell);
  original.forEach(card => card.remove());

  const chart=document.getElementById('pd-chart');
  const groups=document.getElementById('pd-groups');
  const prettyDate = d => new Date(d+'T12:00:00Z').toLocaleDateString('en-US',{year:'numeric',month:'short',day:'2-digit',timeZone:'UTC'});
  const pos = days => (days / 480 * 100).toFixed(3)+'%';
  const sorted = data => data.slice().sort(sort === 'date'
    ? (a,b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)
    : (a,b) => a.ledger-b.ledger);
  const sourceMarkup = r => '<a href="'+esc(r.sourceHref)+'" target="_blank" rel="noopener noreferrer">'+esc(r.source)+'</a>';

  function makeChart() {
    const lanes=[{kind:'rca',label:'RCA · later AI research',sub:'Day 0 = 2025-06-13 earliest archive'},
      {kind:'wct',label:'WCT · later physics',sub:'Day 0 = each paper’s own date'}];
    chart.innerHTML = lanes.map(lane => {
      const data=records.filter(r => r.kind === lane.kind).sort((a,b)=>a.days-b.days);
      const occupied=[];
      const points=data.map(r => {
        let level=0;
        while (occupied[level] != null && r.days-occupied[level]<31) level++;
        occupied[level]=r.days;
        const top=5+level*22;
        const special=r.id==='PD-11'?' institutional':'';
        const dim=filter!=='all'&&filter!==r.kind?' is-dim':'';
        return '<button type="button" class="pd-mark '+lane.kind+special+dim+(selected===r.id?' is-selected':'')+'" data-pd-select="'+r.id+'" style="left:'+pos(r.days)+';--mark-top:'+top+'px" title="'+esc(r.id+' · '+r.title+' · '+r.days+' days')+'" aria-label="'+esc('Open '+r.id+': '+r.title+', '+r.days+' days after earlier record')+'"><span>'+r.id.slice(3)+'</span></button>';
      }).join('');
      const highest=occupied.length;
      return '<div class="pd-lane"><div class="pd-lane-title"><strong>'+esc(lane.label)+'</strong><span>'+esc(lane.sub)+'</span></div><div class="pd-track '+lane.kind+'" style="min-height:'+Math.max(67,highest*22+33)+'px"><span class="pd-track-line"></span>'+points+'</div></div>';
    }).join('')+
    '<div class="pd-axis"><span class="pd-axis-pad"></span><div class="pd-axis-ticks">'+[0,90,180,270,365,450].map(d=>'<span style="left:'+pos(d)+'">'+(d===365?'1 year':d===0?'day 0':d+' d')+'</span>').join('')+'</div></div>';
  }
  function makeGroup(kind) {
    const items=sorted(records.filter(r => r.kind === kind));
    const heading=kind==='rca'?'RCA · later AI research':'WCT · later physics research';
    const intro=kind==='rca'?'11 later works · one shared earlier record':'2 later works · two earlier records';
    const anchors=kind==='rca'
      ? '<div class="pd-anchor"><small>Earlier Reyes record · day 0 · 2025-06-13</small><p>'+sourceMarkup(items[0])+'</p><span>Manuscript dated 2025-06-11; earliest identified archive 2025-06-13.</span></div>'
      : items.map(r=>'<div class="pd-anchor"><small>Earlier Reyes record · day 0 · '+esc(r.sourceDate)+'</small><p>'+sourceMarkup(r)+'</p></div>').join('');
    const rows=items.map(r=>{
      const boundary=r.boundary.replace(/^Evidence boundary:\s*/,'');
      const version=r.version.replace(/^Version note:\s*/,'');
      return '<article class="pd-row '+kind+(selected===r.id?' is-selected':'')+'" id="pd-'+r.id.toLowerCase()+'" tabindex="-1">'+
        '<div class="pd-date"><time datetime="'+r.date+'">'+esc(prettyDate(r.date))+'</time><strong>+'+r.days+' days</strong><span>'+esc(r.months)+' after day 0</span></div>'+
        '<div class="pd-content"><div class="pd-meta">'+esc(r.id)+' <span>Ledger #'+r.ledger+'</span> <span>'+esc(kind==='rca'?'RCA / AI':'WCT / physics')+'</span>'+(r.id==='PD-11'?' <span>Institutional</span>':'')+'</div>'+
        '<h4><a href="'+esc(r.href)+'" target="_blank" rel="noopener noreferrer">'+esc(r.title)+'</a></h4>'+
        '<dl><dt>Technical correspondence</dt><dd>'+esc(r.description)+'</dd><dt>Evidence boundary</dt><dd>'+esc(boundary)+'</dd></dl>'+
        (version?'<p class="pd-version"><strong>Version note</strong> '+esc(version)+'</p>':'')+'</div></article>';
    }).join('');
    return '<section class="pd-group" data-pd-kind="'+kind+'" aria-label="'+esc(heading)+'"><div class="pd-grouphead"><div><h4>'+esc(heading)+'</h4><p>'+esc(intro)+'</p></div><div class="pd-anchors">'+anchors+'</div></div>'+rows+'</section>';
  }
  function render(){
    shell.querySelectorAll('[data-pd-filter]').forEach(b=>{const active=b.dataset.pdFilter===filter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
    shell.querySelectorAll('[data-pd-sort]').forEach(b=>{const active=b.dataset.pdSort===sort;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
    makeChart();
    groups.innerHTML=(filter==='all'||filter==='rca'?makeGroup('rca'):'')+(filter==='all'||filter==='wct'?makeGroup('wct'):'');
  }
  shell.addEventListener('click',event=>{
    const filterButton=event.target.closest('[data-pd-filter]');
    if(filterButton){filter=filterButton.dataset.pdFilter;selected='';render();return;}
    const sortButton=event.target.closest('[data-pd-sort]');
    if(sortButton){sort=sortButton.dataset.pdSort;render();return;}
    const mark=event.target.closest('[data-pd-select]');
    if(mark){
      const id=mark.dataset.pdSelect;
      const entry=records.find(r=>r.id===id);
      if(!entry)return;
      filter=entry.kind;selected=id;render();
      const row=document.getElementById('pd-'+id.toLowerCase());
      if(row){row.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});row.focus({preventScroll:true});}
    }
  });
  render();
})();