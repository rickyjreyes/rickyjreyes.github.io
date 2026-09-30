(() => {
  const path = location.pathname.replace(/index\.html$/i, '');
  if (path !== '/priority/') return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const installStyles = () => {
    if ($('#priority-organization-style')) return;
    const style = document.createElement('style');
    style.id = 'priority-organization-style';
    style.textContent = `
      .canonical-provenance-banner{display:none!important}
      .priority-head{max-width:1080px!important}
      .priority-head>p:not(.eyebrow){max-width:78ch!important}
      .priority-head .audit-strip{gap:0!important;border-top:1px solid var(--line);border-bottom:1px solid var(--line);max-width:1080px!important}
      .priority-head .audit-strip>div{border:0!important;border-radius:0!important;background:transparent!important;padding:15px 18px!important;border-right:1px solid var(--line)!important}
      .priority-head .audit-strip>div:last-child{border-right:0!important}
      .priority-head .audit-strip strong{font:600 1.4rem/1 Georgia,serif!important}
      .priority-head .audit-strip span{font-size:.74rem!important}
      .priority-head .rights-notice{padding:13px 16px!important;margin:16px 0!important;background:rgba(139,124,255,.035)!important}
      .priority-head .rights-notice strong{display:inline!important;margin:0!important}
      .priority-head .toplinks{gap:8px!important;margin-top:16px!important}

      #registry-methods{padding:18px 0!important}
      #registry-methods .priority-fold{margin-top:0!important}
      #registry-methods .priority-fold>summary{padding:14px 2px!important}

      #key-priority-anchors{padding-top:34px!important}
      #key-priority-anchors .priority-timeline{list-style:none;margin:20px 0 0;padding:0;max-width:1080px;border-top:1px solid var(--line)}
      #key-priority-anchors .priority-timeline li{display:grid;grid-template-columns:140px minmax(0,1fr) 145px;gap:18px;align-items:start;padding:16px 2px;border-bottom:1px solid var(--line)}
      #key-priority-anchors .priority-anchor-date{color:var(--accent);font-size:.72rem;font-weight:850;letter-spacing:.035em;text-transform:uppercase;padding-top:2px}
      #key-priority-anchors .priority-anchor-main h3{margin:0 0 4px;font-size:.98rem;line-height:1.35;color:var(--text)}
      #key-priority-anchors .priority-anchor-main p{margin:0;color:var(--muted);font-size:.86rem;line-height:1.5;max-width:72ch}
      #key-priority-anchors .priority-anchor-id{color:var(--muted-2);font:700 .69rem/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;text-align:right}
      #key-priority-anchors .priority-timeline a{color:inherit;text-decoration:none}
      #key-priority-anchors .priority-timeline a:hover h3{color:var(--accent)}
      #key-priority-anchors .rca-priority-row{background:linear-gradient(90deg,rgba(124,224,159,.04),transparent 70%)}
      #key-priority-anchors .rca-priority-row .priority-anchor-date{color:#9be8b3}

      .report-details{margin-top:18px;max-width:1180px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
      .report-details>summary{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 2px;cursor:pointer;list-style:none;color:var(--text)}
      .report-details>summary::-webkit-details-marker{display:none}
      .report-details>summary strong{font-size:.88rem}
      .report-details>summary small{display:block;margin-top:3px;color:var(--muted-2);font-size:.73rem;font-weight:500}
      .report-details .report-action{color:var(--accent);font-size:.68rem;font-weight:850;letter-spacing:.04em;text-transform:uppercase}
      .report-details[open]>summary{border-bottom:1px solid var(--line)}
      .report-details-body{padding:14px 0 6px}

      #verified-predictions .prediction-metrics{display:none!important}
      #verified-predictions .prediction-grid{margin-top:0!important}

      #rca-prediction-audit .rca-audit-summary,#rca-prediction-audit .rca-audit-grid{display:none!important}
      #rca-prediction-audit .rca-model-summary{max-width:1040px;margin:18px 0 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:14px 0}
      #rca-prediction-audit .rca-model-summary p{margin:0 0 7px;color:var(--muted);font-size:.88rem;line-height:1.55}
      #rca-prediction-audit .rca-model-summary p:last-child{margin-bottom:0}
      #rca-prediction-audit .rca-model-summary strong{color:var(--text)}
      #rca-prediction-audit .rca-model-summary code{font-size:.92em;color:var(--accent);background:none;padding:0}
      #rca-prediction-audit .rca-audit-groups{display:grid;gap:0;margin-top:16px;max-width:1080px;border-top:1px solid var(--line)}
      #rca-prediction-audit .rca-group{border:0!important;border-bottom:1px solid var(--line)!important;border-radius:0!important;background:transparent!important;overflow:hidden}
      #rca-prediction-audit .rca-group>summary{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 2px;cursor:pointer;list-style:none}
      #rca-prediction-audit .rca-group>summary::-webkit-details-marker{display:none}
      #rca-prediction-audit .rca-group-title{display:block;color:var(--text);font:600 .96rem/1.3 Georgia,serif}
      #rca-prediction-audit .rca-group-note{display:none!important}
      #rca-prediction-audit .rca-group-count{flex:0 0 auto;color:var(--muted-2);font-size:.68rem;font-weight:800}
      #rca-prediction-audit .rca-group-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:12px 0 16px}

      #expanded-evidence .evidence-metrics{display:none!important}
      #expanded-evidence .evidence-grid{display:block!important;max-width:1080px;margin-top:16px!important;border-top:1px solid var(--line)}
      #expanded-evidence .evidence-card{border:0!important;border-bottom:1px solid var(--line)!important;border-radius:0!important;background:transparent!important;padding:15px 2px!important}
      #expanded-evidence .evidence-card::before{display:none!important}
      #expanded-evidence .evidence-top{margin-bottom:6px!important}
      #expanded-evidence .evidence-actions{margin-top:16px!important}

      #verified-convergence .candidate-table,
      #verified-convergence .audit-status,
      #verified-convergence h3,
      #verified-convergence h3 + .section-lede{display:none!important}

      @media(max-width:900px){
        #key-priority-anchors .priority-timeline li{grid-template-columns:118px minmax(0,1fr)}
        #key-priority-anchors .priority-anchor-id{grid-column:2;text-align:left;margin-top:-6px}
        #rca-prediction-audit .rca-group-grid{grid-template-columns:1fr}
      }
      @media(max-width:620px){
        .priority-head .audit-strip>div{border-right:0!important;border-bottom:1px solid var(--line)!important}
        .priority-head .audit-strip>div:last-child{border-bottom:0!important}
        #key-priority-anchors .priority-timeline li{grid-template-columns:1fr;gap:5px;padding:14px 2px}
        #key-priority-anchors .priority-anchor-id{grid-column:1;margin-top:1px}
      }
    `;
    document.head.appendChild(style);
  };

  const simplifyHeader = () => {
    $('.canonical-provenance-banner')?.remove();
    const head = $('.priority-head');
    if (!head) return;

    const eyebrow = $(':scope > .eyebrow', head);
    if (eyebrow) eyebrow.textContent = 'Research priority and provenance';

    const intro = $(':scope > h1 + p', head);
    if (intro) intro.textContent = 'Dated public record of Richard J. Reyes scholarly claims, patent-family chronology, and selected later technical correspondence.';

    const rights = $('.rights-notice', head);
    if (rights) rights.innerHTML = '<strong>IP notice.</strong> This registry documents asserted authorship and priority; patent rights and claim scope are governed by the corresponding official records.';

    const toplinks = $('.toplinks', head);
    if (toplinks) {
      $$('a', toplinks).forEach(a => {
        const href = a.getAttribute('href') || '';
        const keep = href.endsWith('priority.json') || href.endsWith('publications.bib') || /overlap\/?$/.test(href);
        if (!keep) a.remove();
      });
      const names = $$('a', toplinks);
      names.forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href.endsWith('priority.json')) a.textContent = 'Priority JSON';
        else if (href.endsWith('publications.bib')) a.textContent = 'BibTeX';
        else if (/overlap\/?$/.test(href)) a.textContent = 'External evidence ledger';
      });
    }

    const strip = $('.audit-strip', head);
    if (strip) strip.innerHTML = `
      <div><strong>22</strong><span>scholarly priority records</span></div>
      <div><strong>5</strong><span>key dated anchors</span></div>
      <div><strong>24</strong><span>validation records</span></div>
      <div><strong>4</strong><span>patent families</span></div>
    `;
  };

  const simplifyMethods = () => {
    const rules = $('[aria-labelledby="rules-title"]');
    if (!rules) return;
    rules.id = 'registry-methods';
    const definitions = $('.definitions', rules);
    if (!definitions) return;
    const details = document.createElement('details');
    details.className = 'priority-fold compact-definitions';
    details.innerHTML = '<summary><span><strong>Methods</strong><small>Priority, patent chronology, convergence, and provenance definitions</small></span><span class="fold-action" aria-hidden="true">View</span></summary>';
    const body = document.createElement('div');
    body.className = 'priority-fold-body';
    body.appendChild(definitions);
    details.appendChild(body);
    rules.innerHTML = '';
    rules.appendChild(details);
    details.addEventListener('toggle', () => {
      const action = $('.fold-action', details);
      if (action) action.textContent = details.open ? 'Hide' : 'View';
    });
  };

  const buildAnchors = () => {
    if ($('#key-priority-anchors')) return;
    const verified = $('#verified-predictions');
    if (!verified) return;
    const section = document.createElement('section');
    section.className = 'priority-section';
    section.id = 'key-priority-anchors';
    section.innerHTML = `
      <p class="eyebrow">Dated public record</p>
      <h2>Key Priority Anchors</h2>
      <ol class="priority-timeline">
        <li><span class="priority-anchor-date">Apr 22, 2025</span><div class="priority-anchor-main"><a href="https://doi.org/10.5281/zenodo.15644222" target="_blank" rel="noopener noreferrer"><h3>WCT foundational framework</h3></a><p><em>The Geometry of Resonance</em>.</p></div><span class="priority-anchor-id">WCT-CORE-001</span></li>
        <li><span class="priority-anchor-date">May 7, 2025</span><div class="priority-anchor-main"><a href="https://doi.org/10.5281/zenodo.17743607" target="_blank" rel="noopener noreferrer"><h3>Physical computation framework</h3></a><p>Curvature-bounded wave computation with physical resource costs.</p></div><span class="priority-anchor-id">WCT-COMP-001</span></li>
        <li class="rca-priority-row"><span class="priority-anchor-date">Jun 11, 2025</span><div class="priority-anchor-main"><a href="https://doi.org/10.5281/zenodo.17732661" target="_blank" rel="noopener noreferrer"><h3>Resonance-Confinement Architecture / Recursive AI Drift</h3></a><p>Recursive drift, propagation-versus-correction limits, and physically bounded containment.</p></div><span class="priority-anchor-id">WCT-AI-001</span></li>
        <li><span class="priority-anchor-date">Sep 8–16, 2025</span><div class="priority-anchor-main"><a href="#scholarly-priority"><h3>Phase-Flux Field and spectral confinement</h3></a><p>Finite-k selection, confinement, and emergent spectral structure.</p></div><span class="priority-anchor-id">WCT-PFF-001 · WCT-SPEC-001</span></li>
        <li><span class="priority-anchor-date">Dec 1, 2025</span><div class="priority-anchor-main"><a href="https://doi.org/10.5281/zenodo.19122146" target="_blank" rel="noopener noreferrer"><h3>WaveLock</h3></a><p>Nonlinear-PDE one-way-function construction.</p></div><span class="priority-anchor-id">WCT-CRYPTO-001</span></li>
      </ol>
    `;
    verified.parentNode.insertBefore(section, verified);
  };

  const wrapDetails = (section, selector, title, meta, className) => {
    if (!section || $(`.report-details.${className}`, section)) return;
    const target = $(selector, section);
    if (!target) return;
    const details = document.createElement('details');
    details.className = `report-details ${className}`;
    details.innerHTML = `<summary><span><strong>${title}</strong><small>${meta}</small></span><span class="report-action">Open</span></summary>`;
    const body = document.createElement('div');
    body.className = 'report-details-body';
    target.parentNode.insertBefore(details, target);
    body.appendChild(target);
    details.appendChild(body);
    details.addEventListener('toggle', () => {
      const action = $('.report-action', details);
      if (action) action.textContent = details.open ? 'Close' : 'Open';
    });
  };

  const simplifyValidation = () => {
    const section = $('#verified-predictions');
    if (!section) return;
    $('.report-takeaways', section)?.remove();
    $('.prediction-metrics', section)?.remove();
    const eyebrow = $('.eyebrow', section);
    const h2 = $('#verified-predictions-title', section);
    const lede = $('.section-lede', section);
    if (eyebrow) eyebrow.textContent = 'Validation record';
    if (h2) h2.textContent = 'Independent and Holdout Evidence';
    if (lede) lede.textContent = 'Later observations and tests corresponding to earlier Reyes claims.';
    wrapDetails(section, '.prediction-grid', '24 validation records', 'AI safety, physical computation, wave dynamics, CMS, GWTC, and quantitative results', 'prediction-detail');
  };

  const simplifyRca = () => {
    const section = $('#rca-prediction-audit');
    if (!section) return;
    const h2 = $('#rca-prediction-audit-title', section);
    const lede = $('.section-lede', section);
    if (h2) h2.textContent = 'RCA Mechanism & Forecast Audit';
    if (lede) lede.textContent = 'Mechanism, containment, and forecast record originating from the June 11, 2025 RCA disclosure.';

    let model = $('.rca-model-summary', section);
    if (!model) {
      model = document.createElement('div');
      model.className = 'rca-model-summary';
      const summary = $('.rca-audit-summary', section);
      if (summary) summary.parentNode.insertBefore(model, summary);
      else section.appendChild(model);
    }
    model.innerHTML = '<p><strong>Criticality:</strong> <code>R = μ/ν = τprop/τcorr</code>; <code>λ = ν(1 − R)</code>.</p><p><strong>Status:</strong> early 2025–2026 stages have supporting evidence; later 2027–2030 milestones remain prospective.</p>';

    if (!$('.rca-audit-groups', section)) {
      const sourceGrid = $('.rca-audit-grid', section);
      if (sourceGrid) {
        const cards = new Map();
        $$('.rca-audit-card', sourceGrid).forEach(card => {
          const n = Number(($('.rca-audit-number', card)?.textContent || '').trim());
          if (Number.isFinite(n)) cards.set(n, card);
        });
        const groups = [
          ['Core failure mechanisms',[1,2,3,4,7,8,17,20,21,22]],
          ['Stability, metrics & criticality',[5,6,9,10,11,12,13,14,15,16,28,40,41,42]],
          ['Corrigibility & containment',[18,19,23,24,25,26,27]],
          ['Forecast timeline',[29,30,31,32,33,34,35,36,37,38,39]]
        ];
        const wrapper = document.createElement('div');
        wrapper.className = 'rca-audit-groups';
        groups.forEach(([title, items]) => {
          const details = document.createElement('details');
          details.className = 'rca-group';
          details.innerHTML = `<summary><span class="rca-group-title">${title}</span><span class="rca-group-count">${items.length}</span></summary>`;
          const grid = document.createElement('div');
          grid.className = 'rca-group-grid';
          items.forEach(n => { const card = cards.get(n); if (card) grid.appendChild(card); });
          details.appendChild(grid);
          wrapper.appendChild(details);
        });
        sourceGrid.parentNode.insertBefore(wrapper, sourceGrid);
        sourceGrid.hidden = true;
      }
    }
    $$('.rca-group', section).forEach(d => d.removeAttribute('open'));
  };

  const simplifyEvidence = () => {
    const section = $('#expanded-evidence');
    if (!section) return;
    const h2 = $('#expanded-evidence-title', section);
    const lede = $('.section-lede', section);
    if (h2) h2.textContent = 'External Evidence';
    if (lede) lede.textContent = 'Selected examples; the full corpus is maintained in the external evidence ledger.';
    $('.evidence-metrics', section)?.remove();
    const primary = $('.evidence-actions .button.primary', section);
    if (primary) primary.textContent = 'Full evidence ledger';
  };

  const simplifyComparisons = () => {
    const section = $('#verified-convergence') || $('[aria-labelledby="convergence-title"]');
    if (!section) return;
    section.id = 'verified-convergence';
    const eyebrow = $('.eyebrow', section);
    const h2 = $('#convergence-title', section) || $('h2', section);
    const lede = $('.section-lede', section);
    if (eyebrow) eyebrow.textContent = 'Date-checked comparisons';
    if (h2) h2.textContent = 'Post-Date Comparisons';
    if (lede) lede.textContent = 'Six later works with date-checked mechanism-level correspondence to earlier Reyes disclosures.';
    const candidateHeading = $$('h3', section).find(h => /Additional high-priority comparisons/i.test(h.textContent));
    if (candidateHeading) {
      let node = candidateHeading;
      while (node) {
        const next = node.nextElementSibling;
        node.remove();
        node = next;
      }
    }
  };

  const simplifyLongSections = () => {
    const claims = $('#scholarly-priority') || $('[aria-labelledby="claims-title"]');
    if (claims) {
      claims.id = 'scholarly-priority';
      const h2 = $('h2', claims); const lede = $('.section-lede', claims);
      if (h2) h2.textContent = 'Claim-Level Priority Registry';
      if (lede) lede.textContent = '22 DOI-backed claims linked to their earliest public archival records.';
    }
    const patent = $('#patent-priority') || $('[aria-labelledby="patent-title"]');
    if (patent) {
      patent.id = 'patent-priority';
      const lede = $('.section-lede', patent);
      if (lede) lede.textContent = 'Four filed patent families and their earliest reported priority dates.';
    }
    const controls = $('#historical-controls') || $('[aria-labelledby="controls-title"]');
    if (controls) controls.id = 'historical-controls';
  };

  const rebuildJumpNav = () => {
    const nav = $('#priority-jump');
    if (!nav) return;
    nav.innerHTML = [
      ['#key-priority-anchors','Priority anchors'],
      ['#scholarly-priority','Claim registry'],
      ['#patent-priority','Patents'],
      ['#verified-predictions','Validation'],
      ['#rca-prediction-audit','RCA'],
      ['#expanded-evidence','Evidence']
    ].map(([href,text]) => `<a href="${href}">${text}</a>`).join('');
  };

  const reorder = () => {
    const main = $('.priority-shell');
    const rights = $('[aria-labelledby="rights-title"]', main);
    if (!main || !rights) return;
    [
      $('#registry-methods'),
      $('#key-priority-anchors'),
      $('#scholarly-priority'),
      $('#patent-priority'),
      $('#verified-predictions'),
      $('#rca-prediction-audit'),
      $('#expanded-evidence'),
      $('#verified-convergence'),
      $('#historical-controls')
    ].filter(Boolean).forEach(section => main.insertBefore(section, rights));
  };

  const run = () => {
    installStyles();
    simplifyHeader();
    simplifyMethods();
    buildAnchors();
    simplifyLongSections();
    simplifyValidation();
    simplifyRca();
    simplifyEvidence();
    simplifyComparisons();
    rebuildJumpNav();
    reorder();
    return Boolean($('#key-priority-anchors') && $('#scholarly-priority') && $('#verified-predictions'));
  };

  if (run()) return;
  const observer = new MutationObserver(() => {
    if (run()) observer.disconnect();
  });
  observer.observe(document.documentElement, {childList:true, subtree:true});
  window.addEventListener('load', () => {
    run();
    setTimeout(() => observer.disconnect(), 6000);
  }, {once:true});
})();
