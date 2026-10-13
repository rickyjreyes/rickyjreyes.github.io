/* Progressive enhancement of Priority's 13 reviewed chronology records.
   Preserves the original source HTML if scripts are disabled. */
(() => {
  const divider=document.getElementById('post-date-reviewed');
  if(!divider) return;
  const original=Array.from(divider.querySelectorAll('.pdr-card'));
  if(original.length!==13) return;
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const safeHref = value => /^https:\/\/[a-z0-9.-]+(?:[/:?#]|$)/i.test(value || '') ? value : '#';
  const daysBetween=(a,b)=>Math.round((Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/86400000);
  const records=original.map(card=>{
    const meta=card.querySelector('.pdr-card-meta')?.textContent || '';
    const id=meta.match(/PD-\d{2}/)?.[0] || '';
    const ledger=Number(meta.match(/LEDGER\s*#(\d+)/i)?.[1]);
    const date=meta.match(/20\d{2}-\d{2}-\d{2}/)?.[0] || '';
    const kind=['PD-07','PD-08'].includes(id)?'wct':'rca';
    const source=card.querySelector('.pdr-anchor a');
    const external=card.querySelector('.pdr-paper');
    const arrow=card.querySelector('.pdr-arrow')?.textContent || '';
    const sourceDate=kind==='rca'?'2025-06-13':(arrow.match(/Earlier Reyes research\s*·\s*(\d{4}-\d{2}-\d{2})/)?.[1] || '');
    const days=daysBetween(sourceDate,date);
    const limits=Array.from(card.querySelectorAll('.pdr-limit')).map(node=>node.textContent.trim());
    return {
      id,ledger,kind,date,days,months:(days/30.44).toFixed(1)+' months',
      source:source?.textContent.trim() || '',sourceHref:source?safeHref(source.href):'#',
      sourceDate:kind==='rca'?'2025-06-11':sourceDate,
      title:external?.textContent.trim() || '',href:external?safeHref(external.href):'#',
      description:card.querySelector('.pdr-mechanism')?.textContent.replace(/^Technical correspondence:\s*/,'').trim() || '',
      boundary:limits.find(x=>x.startsWith('Evidence boundary:')) || '',
      version:limits.find(x=>x.startsWith('Version note:')) || ''
    };
  });
  const expected={ 'PD-01':264,'PD-02':332,'PD-03':325,'PD-04':467,'PD-05':276,'PD-06':356,
    'PD-07':152,'PD-08':218,'PD-09':325,'PD-10':340,'PD-11':179,'PD-12':300,'PD-13':445 };
  if(records.some(r=>!r.id || !r.title || !r.source || !r.ledger || !r.date || r.days!==expected[r.id]) ||
     new Set(records.map(r=>r.id)).size!==13) return;
  
  let filter='all', sort='date', selected='';
  const shell=document.createElement('div');
  shell.className='pd-review';
  shell.id='post-date-reviewed';
  shell.setAttribute('aria-labelledby','post-date-reviewed-title');
  shell.innerHTML=
    '<header class="pd-header">'+
      '<p class="eyebrow">Reviewed October 9, 2026 · additional chronology records</p>'+
      '<h2 id="post-date-reviewed-title">Thirteen additional post-date<br>research correspondences</h2>'+
      '<p>These later external papers and the December 2025 OWASP institutional security framework follow the dated WCT or RCA claims linked below. Their source dates and narrow technical correspondences have been reviewed. They remain separate from the six fully promoted cases: verifying exact claim content against the earliest archived Reyes version is still outstanding. Chronology does not establish influence, copying, derivation, or independent validation.</p>'+
    '</header>'+
    '<div class="pd-stats" aria-label="Additional chronology record counts"><div><strong>13</strong><span>post-date chronology-reviewed</span></div><div><strong>11</strong><span>RCA / AI</span></div><div><strong>2</strong><span>WCT / physics</span></div><div><strong>242</strong><span>total catalogue records, unchanged</span></div></div>'+
    '<p class="pd-reveal-intro">Browse the reviewed records below. Each card enters as you scroll, with the original dated source, technical correspondence and evidence limits kept together.</p>'+
    '<div class="pd-toolbar"><div class="pd-filters" role="group" aria-label="Filter post-date records"><button type="button" data-pd-filter="all">All 13</button><button type="button" data-pd-filter="rca">RCA / AI · 11</button><button type="button" data-pd-filter="wct">WCT / physics · 2</button></div><div class="pd-sorts" role="group" aria-label="Order post-date records"><span>Order</span><button type="button" data-pd-sort="date">By date</button><button type="button" data-pd-sort="ledger">By ledger ID</button></div></div>'+
    '<div class="pd-groups" id="pd-groups" aria-live="polite"></div>'+
    '<p class="pd-source">Source of record: <a href="/priority/">dated priority and claim registry</a> and <a href="/priority/external-convergence.json">machine-readable external catalogue</a>. These thirteen entries are a reviewed subset of the existing external catalogue, not new additions to the 242-record total.</p>';
  divider.replaceWith(shell);

  const groups=document.getElementById('pd-groups');
  const prettyDate = d => new Date(d+'T12:00:00Z').toLocaleDateString('en-US',{year:'numeric',month:'short',day:'2-digit',timeZone:'UTC'});
  const sorted = data => data.slice().sort(sort === 'date'
    ? (a,b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)
    : (a,b) => a.ledger-b.ledger);
  const sourceMarkup = r => '<a href="'+esc(r.sourceHref)+'" target="_blank" rel="noopener noreferrer">'+esc(r.source)+'</a>';

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
      return '<article class="pd-row '+kind+(selected===r.id?' is-selected':'')+'" id="pd-'+r.id.toLowerCase()+'" data-pd-pop tabindex="-1">'+
        '<div class="pd-date"><time datetime="'+r.date+'">'+esc(prettyDate(r.date))+'</time><strong>+'+r.days+' days</strong><span>'+esc(r.months)+' after day 0</span></div>'+
        '<div class="pd-content"><div class="pd-meta">'+esc(r.id)+' <span>Ledger #'+r.ledger+'</span> <span>'+esc(kind==='rca'?'RCA / AI':'WCT / physics')+'</span>'+(r.id==='PD-11'?' <span>Institutional</span>':'')+'</div>'+
        '<h4><a href="'+esc(r.href)+'" target="_blank" rel="noopener noreferrer">'+esc(r.title)+'</a></h4>'+
        '<dl><dt>Technical correspondence</dt><dd>'+esc(r.description)+'</dd><dt>Evidence boundary</dt><dd>'+esc(boundary)+'</dd></dl>'+
        (version?'<p class="pd-version"><strong>Version note</strong> '+esc(version)+'</p>':'')+'</div></article>';
    }).join('');
    return '<section class="pd-group" data-pd-kind="'+kind+'" aria-label="'+esc(heading)+'"><div class="pd-grouphead"><div><h4>'+esc(heading)+'</h4><p>'+esc(intro)+'</p></div><div class="pd-anchors">'+anchors+'</div></div>'+rows+'</section>';
  }
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealObserver=null;
  function revealRows(){
    if(revealObserver){revealObserver.disconnect();revealObserver=null;}
    const cards=[...groups.querySelectorAll('[data-pd-pop]')];
    if(reduceMotion||!('IntersectionObserver' in window)){
      shell.classList.remove('pd-reveal-ready');
      cards.forEach(card=>card.classList.add('is-revealed'));
      return;
    }
    shell.classList.add('pd-reveal-ready');
    revealObserver=new IntersectionObserver(changes=>{
      changes.forEach(change=>{
        if(!change.isIntersecting)return;
        change.target.classList.add('is-revealed');
        revealObserver.unobserve(change.target);
      });
    },{threshold:0.08,rootMargin:'0px 0px -28px 0px'});
    cards.forEach(card=>revealObserver.observe(card));
  }
  function render(){
    shell.querySelectorAll('[data-pd-filter]').forEach(b=>{const active=b.dataset.pdFilter===filter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
    shell.querySelectorAll('[data-pd-sort]').forEach(b=>{const active=b.dataset.pdSort===sort;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
    groups.innerHTML=(filter==='all'||filter==='rca'?makeGroup('rca'):'')+(filter==='all'||filter==='wct'?makeGroup('wct'):'');
    revealRows();
  }
  shell.addEventListener('click',event=>{
    const filterButton=event.target.closest('[data-pd-filter]');
    if(filterButton){filter=filterButton.dataset.pdFilter;selected='';render();return;}
    const sortButton=event.target.closest('[data-pd-sort]');
    if(sortButton){sort=sortButton.dataset.pdSort;render();return;}

  });
  render();
})();