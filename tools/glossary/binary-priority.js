/* WCT glossary attribution view: original work first, lexical priority separately,
   and established vocabulary in its own reference view. This replaces the old
   binary exact-phrase vs general distinction. */
(() => {
  if (!/^\/tools\/glossary(?:\/|$)/.test(location.pathname)) return;
  const grid = document.getElementById('glossaryGrid');
  const guide = document.querySelector('.glossary-provenance-guide');
  if (!grid || !guide) return;

  const registry = window.WCT_TERMINOLOGY_PRIORITY || {};
  const registryTerms = Array.isArray(registry.terms) ? registry.terms : [];
  const byTerm = new Map(registryTerms.map(r => [String(r.term || '').toLocaleLowerCase(), r]));
  const auditedNames = new Set(byTerm.keys());
  for (const t of (window.WCT_GLOSSARY_ALL || [])) {
    const key = String(t.name || '').toLocaleLowerCase();
    if (!key || byTerm.has(key) || !t.doi) continue;
    byTerm.set(key, {
      term:t.name,
      doi:t.doi,
      sourceTitle:t.source_title || '',
      sourceUrl: /^https?:\/\//.test(t.priority_record || '') ? t.priority_record : '',
      publicRecordDate:t.public_record_date || '',
      lexicalAuditStatus:t.lexical_audit_status === 'not_audited'
        ? 'not_audited' : 'not_in_exact_phrase_survivor_set'
    });
  }
  const audit = registry.audit || {};
  const choices = [
    {value:'original', name:'Reyes terms', help:'WCT / RCA definitions'},
    {value:'lexical', name:'Phrase matches', help:'Indexed exact-phrase records'},
    {value:'external', name:'Standard science', help:'Established terminology'},
    {value:'all', name:'All terms', help:'Complete A–Z glossary'}
  ];
  let selected = 'original';
  let paperComparisons = new Map();

  const originFor = card => card.querySelector('.term-origin')?.textContent.trim() || '';
  const original = card => ['Coined by Reyes','WCT-defined'].includes(originFor(card));
  const priority = card => {
    const s = byTerm.get((card.querySelector('h3')?.textContent || '').trim().toLocaleLowerCase())?.lexicalAuditStatus;
    return ['strong_explicit_coinage','exact_phrase_survivor'].includes(s) ||
      card.classList.contains('priority-coinage') || card.classList.contains('priority-survivor');
  };
  const slug = value => String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const doiKey = value => String(value || '').trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i,'').toLowerCase();
  const allowedUrl = value => typeof value === 'string' && /^https?:\/\//i.test(value) ? value : '';
  const appendLink = (parent, label, url) => {
    const safe = allowedUrl(url);
    if (!safe) return;
    const a = document.createElement('a');
    a.href = safe;
    a.textContent = label;
    a.rel = 'noopener noreferrer';
    if (/^https?:\/\/www\.google\.com\//i.test(safe)) a.target = '_blank';
    parent.appendChild(a);
  };
  const statusText = status => ({
    strong_explicit_coinage:'Reyes explicitly claims this phrase as his coinage in the archived audit. No earlier indexed exact use was located',
    exact_phrase_survivor:'No earlier indexed exact-phrase occurrence located',
    prior_phrase_found:'Earlier unrelated phrase use found; WCT definition is separate',
    not_in_exact_phrase_survivor_set:'Reyes-defined or specialized use; no lexical-priority assertion',
    not_audited:'Named in a newer Reyes publication; not yet included in the archived 22-release lexical audit'
  })[status] || 'Dated WCT definition; lexical priority not established';

  function decorateCard(card) {
    if (card.dataset.attributionReady) return;
    card.dataset.attributionReady = 'true';
    const name = card.querySelector('h3')?.textContent.trim() || '';
    const record = byTerm.get(name.toLocaleLowerCase());
    if (!original(card)) return;
    if (!record) {
      const term = card.querySelector('h3')?.textContent || '';
      if (term) card.setAttribute('title', 'WCT-defined term; see the mapped publication record where available.');
      return;
    }

    const body = card.querySelector('.glossary-body');
    if (!body) return;
    const section = document.createElement('details');
    section.className = 'glossary-evidence';
    const label = document.createElement('summary');
    label.className = 'glossary-evidence-label';
    label.textContent = 'Source, DOI & attribution evidence';
    section.appendChild(label);
    const heading = document.createElement('p');
    heading.className = 'glossary-evidence-paper';
    heading.textContent = record.sourceTitle || 'WCT publication record';
    section.appendChild(heading);

    const links = document.createElement('div');
    links.className = 'glossary-evidence-links';
    appendLink(links, 'Publication record', record.sourceUrl);
    if (record.doi) appendLink(links, 'Zenodo DOI', 'https://doi.org/' + doiKey(record.doi));
    if (auditedNames.has(name.toLocaleLowerCase())) appendLink(links, 'Priority audit', 'https://rickyjreyes.github.io/priority/terminology/#term-' + slug(record.term));
    section.appendChild(links);

    const detail = document.createElement('p');
    detail.className = 'glossary-evidence-note';
    detail.textContent = (record.publicRecordDate ? 'Richard J. Reyes · ' + record.publicRecordDate : 'Richard J. Reyes');
    section.appendChild(detail);
    const comparisonSlot = document.createElement('div');
    comparisonSlot.className = 'glossary-paper-comparisons';
    comparisonSlot.dataset.sourceDoi = doiKey(record.doi);
    section.appendChild(comparisonSlot);
    body.appendChild(section);
    fillComparisons(comparisonSlot);
  }

  function fillComparisons(slot) {
    if (!slot || !slot.dataset.sourceDoi) return;
    const records = paperComparisons.get(slot.dataset.sourceDoi) || [];
    slot.replaceChildren();
    if (!records.length) return;
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = records.length + ' paper-level external chronology comparison' + (records.length === 1 ? '' : 's');
    details.appendChild(summary);
    const note = document.createElement('p');
    note.className = 'glossary-evidence-note';
    note.textContent = 'Related paper-level records';
    details.appendChild(note);
    const ul = document.createElement('ul');
    for (const r of records.slice(0, 5)) {
      const li = document.createElement('li');
      const dest = allowedUrl(r.primaryUrl) || allowedUrl(r.identifierUrl);
      if (dest) appendLink(li, r.title || 'External record', dest);
      else li.textContent = r.title || 'External record';
      ul.appendChild(li);
    }
    details.appendChild(ul);
    if (records.length > 5) {
      const extra = document.createElement('p');
      extra.textContent = 'Additional comparisons are in the complete evidence ledger.';
      details.appendChild(extra);
    }
    appendLink(details, 'Complete external evidence ledger', 'https://rickyjreyes.github.io/overlap/');
    slot.appendChild(details);
  }

  const cards = () => [...grid.querySelectorAll(':scope > .glossary-card')];
  function applyView() {
    const all = cards();
    let visible = 0;
    for (const card of all) {
      decorateCard(card);
      const isOriginal = original(card);
      const show = selected === 'all' || (selected === 'original' && isOriginal) ||
        (selected === 'lexical' && isOriginal && priority(card)) ||
        (selected === 'external' && !isOriginal);
      card.hidden = !show;
      if (show) visible++;
    }
    // The alphabetical headings are siblings of the cards. Hide headings with no visible entries.
    let heading = null, hasEntries = false;
    const finishHeading = () => { if (heading) heading.hidden = !hasEntries; };
    for (const child of grid.children) {
      if (child.classList.contains('glossary-letter')) {
        finishHeading(); heading = child; hasEntries = false;
      } else if (child.classList.contains('glossary-card') && !child.hidden) hasEntries = true;
    }
    finishHeading();
    const count = document.getElementById('termCount');
    if (count) count.textContent = visible + ' shown · ' + all.length + ' match search and family filters';
    const empty = document.getElementById('glossaryNoResults');
    if (empty) empty.hidden = visible !== 0;
  }

  function syncTabs() {
    guide.querySelectorAll('[role="tab"]').forEach(tab => {
      const isActive = tab.dataset.value === selected;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.tabIndex = isActive ? 0 : -1;
    });
  }

  function setView(next) {
    if (!choices.some(c => c.value === next)) return;
    selected = next;
    syncTabs();
    applyView();
  }

  function setupTabs() {
    guide.id = 'termClassTabs';
    guide.classList.add('term-class-selector');
    guide.setAttribute('role','tablist');
    guide.setAttribute('aria-label','Glossary view');
    guide.replaceChildren();
    for (const option of choices) {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('role','tab');
      button.dataset.value = option.value;
      const title = document.createElement('strong');
      title.textContent = option.name;
      const hint = document.createElement('span');
      hint.textContent = option.help;
      button.append(title,hint);
      button.addEventListener('click', () => setView(option.value));
      button.addEventListener('keydown', e => {
        const values = choices.map(o=>o.value);
        const idx = values.indexOf(option.value);
        let target = -1;
        if (e.key === 'ArrowRight') target = (idx+1) % values.length;
        if (e.key === 'ArrowLeft') target = (idx-1+values.length) % values.length;
        if (e.key === 'Home') target = 0;
        if (e.key === 'End') target = values.length-1;
        if (target >= 0) {
          e.preventDefault();
          setView(values[target]);
          guide.querySelectorAll('[role="tab"]')[target]?.focus();
        }
      });
      guide.appendChild(button);
    }
    syncTabs();
  }

  function fillSummary() {
    const set = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = String(value); };
    set('registryTermCount', audit.termCount ?? registryTerms.length);
    set('registrySurvivorCount', audit.exactPhraseSurvivorCount ?? '—');
    set('registryCoinageCount', audit.strongExplicitCoinageCount ?? '—');
    set('registryReleaseCount', audit.releaseCount ?? '—');
    const stamp = document.getElementById('registryAuditDate');
    if (stamp && registry.auditTimestamp) {
      stamp.textContent = 'Audit: ' + registry.auditTimestamp.slice(0,10);
    }
  }

  function buildDiscoverySearches() {
    const host = document.getElementById('nameBlindQueries');
    if (!host) return;
    host.replaceChildren();
    const pairs = [
      ['Curvature-derived rest mass','effective rest mass from curvature of confined wavefields','Density-Weighted Loop Curvature','10.5281/zenodo.20533537'],
      ['Geometric curvature and torsion','Frenet Serret curvature torsion geometric soliton mass','Geometric Curvature Rate','10.5281/zenodo.20533537'],
      ['Mass-constrained soliton stability','strict subadditivity concentration compactness nonlinear ground states','Wave Confinement Theory','10.5281/zenodo.15644222'],
      ['Finite-band spectral selection','finite wavenumber Lyapunov spectral selection','Finite-k Lyapunov band-pass','10.5281/zenodo.17578766'],
      ['Atomic log-periodicity','log periodic residuals atomic spectral line lists','Bin-Stable Log-Periodic Structure','10.5281/zenodo.20435463'],
      ['Reactor antineutrino fine structure','JUNO reactor antineutrino logarithmic energy modulation','Ghost-mode modulation','10.5281/zenodo.17715872'],
      ['GWTC chirp-mass modulation','log periodic gravitational wave population residuals','GWTC Chirp-Mass Frozen Holdout','10.5281/zenodo.22256802'],
      ['CMS dimuon residuals','log periodic dimuon mass spectral residual CMS','CMS Phase-Locked Dimuon Holdout','10.5281/zenodo.22257067'],
      ['Scale–winding correspondence','discrete scale invariance integer phase winding log periodic','Exact Scale–Winding Bijection','10.5281/zenodo.22665914'],
      ['AI constraint and correction failure','recursive AI context compaction constraint retention','Propagation–correction criticality','10.5281/zenodo.17732661']
    ];
    const slug = s => String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
    for (const [title,neutral,term,doi] of pairs) {
      const row = document.createElement('div');
      row.className = 'glossary-discovery-row';
      const heading = document.createElement('strong');
      heading.textContent = title;
      const desc = document.createElement('span');
      desc.textContent = neutral;
      const links = document.createElement('div');
      links.className = 'glossary-discovery-actions';
      const make = (label,url,isExternal) => {
        const a = document.createElement('a');a.textContent=label;a.href=url;
        if(isExternal){a.target='_blank';a.rel='noopener noreferrer';}
        links.appendChild(a);
      };
      make('Neutral Google test','https://www.google.com/search?q='+encodeURIComponent(neutral),true);
      make('WCT glossary source','#term-'+slug(term),false);
      make('Original publication DOI','https://doi.org/'+doi,true);
      make('WCT-restricted Google check','https://www.google.com/search?q='+encodeURIComponent('site:rickyjreyes.github.io '+neutral.split(' ').slice(0,5).join(' ')),true);
      row.append(heading,desc,links);
      host.appendChild(row);
    }
  }

  function resolveDeepLink() {
    const hash = location.hash;
    if (!hash.startsWith('#term-')) return;
    let card = null;
    try { card = document.querySelector(hash); } catch (_) { return; }
    if (!card || !card.classList.contains('glossary-card')) return;
    if (card.hidden) setView(original(card) ? 'original' : 'external');
    requestAnimationFrame(() => card.scrollIntoView({block:'start'}));
  }

  async function loadPaperComparisons() {
    try {
      const response = await fetch('../../priority/external-convergence.json', {cache:'no-store'});
      if (!response.ok) return;
      const data = await response.json();
      const maps = new Map();
      for (const r of (data.records || [])) {
        if (r.verificationStatus !== 'date_checked') continue;
        for (const anchor of (r.wctAnchors || [])) {
          const key = doiKey(anchor.doi);
          if (!key) continue;
          if (!maps.has(key)) maps.set(key, []);
          if (!maps.get(key).some(item => item.primaryUrl === r.primaryUrl)) maps.get(key).push(r);
        }
      }
      paperComparisons = maps;
      document.querySelectorAll('.glossary-paper-comparisons').forEach(fillComparisons);
    } catch (_) { /* Glossary works without the optional external ledger. */ }
  }

  // Legacy free-text and family filters re-render the card grid. Reapply the attribution
  // view to the new cards without changing their search logic or permalink IDs.
  setupTabs();
  fillSummary();
  buildDiscoverySearches();
  const oldFilter = document.getElementById('termClass');
  if (oldFilter) oldFilter.remove();
  applyView();
  const observer = new MutationObserver(() => { applyView(); });
  observer.observe(grid, {childList:true});
  window.addEventListener('hashchange', resolveDeepLink);
  resolveDeepLink();
  loadPaperComparisons();
})();