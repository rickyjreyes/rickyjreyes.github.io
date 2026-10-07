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
      /* Report-style hierarchy: chronology and source record first, supporting evidence second. */
      .priority-head .audit-strip{gap:0!important;border-top:1px solid var(--line);border-bottom:1px solid var(--line);max-width:1120px!important}
      .priority-head .audit-strip>div{border:0!important;border-radius:0!important;background:transparent!important;padding:16px 18px!important;border-right:1px solid var(--line)!important}
      .priority-head .audit-strip>div:last-child{border-right:0!important}
      .priority-head .audit-strip strong{font:600 1.45rem/1 Georgia,serif!important}
      .priority-head .audit-strip span{font-size:.76rem!important}

      #key-priority-anchors{border-top:1px solid rgba(103,212,255,.28)!important}
      #key-priority-anchors .priority-timeline{list-style:none;margin:26px 0 0;padding:0;max-width:1120px;border-top:1px solid var(--line)}
      #key-priority-anchors .priority-timeline li{display:grid;grid-template-columns:150px minmax(0,1fr) 150px;gap:20px;align-items:start;padding:18px 4px;border-bottom:1px solid var(--line)}
      #key-priority-anchors .priority-anchor-date{color:var(--accent);font-size:.74rem;font-weight:850;letter-spacing:.04em;text-transform:uppercase;padding-top:2px}
      #key-priority-anchors .priority-anchor-main h3{margin:0 0 5px;font-size:1rem;line-height:1.35;color:var(--text)}
      #key-priority-anchors .priority-anchor-main p{margin:0;color:var(--muted);font-size:.88rem;line-height:1.58;max-width:74ch}
      #key-priority-anchors .priority-anchor-id{color:var(--muted-2);font:700 .7rem/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;text-align:right}
      #key-priority-anchors .priority-timeline a{color:inherit;text-decoration:none}
      #key-priority-anchors .priority-timeline a:hover h3{color:var(--accent)}
      #key-priority-anchors .priority-anchor-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px}
      #key-priority-anchors .rca-priority-row{background:linear-gradient(90deg,rgba(124,224,159,.045),transparent 72%)}
      #key-priority-anchors .rca-priority-row .priority-anchor-date{color:#9be8b3}

      .report-takeaways{max-width:1060px;margin:22px 0 0;border-top:1px solid var(--line)}
      .report-takeaways h3{margin:18px 0 6px;font:600 1rem/1.3 Georgia,serif;color:var(--text)}
      .report-takeaways p{margin:0;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.06);color:var(--muted);font-size:.9rem;line-height:1.58}
      .report-takeaways strong{color:var(--text)}

      .report-details{margin-top:22px;max-width:1220px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
      .report-details>summary{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:16px 2px;cursor:pointer;list-style:none;color:var(--text)}
      .report-details>summary::-webkit-details-marker{display:none}
      .report-details>summary strong{font-size:.9rem}
      .report-details>summary small{display:block;margin-top:3px;color:var(--muted-2);font-size:.75rem;font-weight:500}
      .report-details .report-action{color:var(--accent);font-size:.7rem;font-weight:850;letter-spacing:.04em;text-transform:uppercase}
      .report-details[open]>summary{border-bottom:1px solid var(--line)}
      .report-details-body{padding:16px 0 8px}

      #verified-predictions .prediction-metrics{display:none!important}
      #verified-predictions .prediction-grid{margin-top:0!important}

      #rca-prediction-audit .rca-audit-summary{display:none!important}
      #rca-prediction-audit .rca-audit-grid{display:none!important}
      #rca-prediction-audit .rca-model-summary{max-width:1060px;margin:22px 0 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:16px 0}
      #rca-prediction-audit .rca-model-summary p{margin:0 0 9px;color:var(--muted);font-size:.9rem;line-height:1.6}
      #rca-prediction-audit .rca-model-summary p:last-child{margin-bottom:0}
      #rca-prediction-audit .rca-model-summary strong{color:var(--text)}
      #rca-prediction-audit .rca-model-summary code{font-size:.92em;color:var(--accent);background:none;padding:0}
      #rca-prediction-audit .rca-audit-groups{display:grid;gap:0;margin-top:20px;max-width:1120px;border-top:1px solid var(--line)}
      #rca-prediction-audit .rca-group{border:0!important;border-bottom:1px solid var(--line)!important;border-radius:0!important;background:transparent!important;overflow:hidden}
      #rca-prediction-audit .rca-group>summary{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:16px 2px;cursor:pointer;list-style:none;user-select:none}
      #rca-prediction-audit .rca-group>summary::-webkit-details-marker{display:none}
      #rca-prediction-audit .rca-group-title{display:block;color:var(--text);font:600 .98rem/1.3 Georgia,serif}
      #rca-prediction-audit .rca-group-note{display:block;margin-top:3px;color:var(--muted-2);font-size:.76rem;line-height:1.45}
      #rca-prediction-audit .rca-group-count{flex:0 0 auto;color:var(--muted-2);font-size:.7rem;font-weight:800;white-space:nowrap}
      #rca-prediction-audit .rca-group[open]>summary{border-bottom:1px solid rgba(255,255,255,.06);background:transparent!important}
      #rca-prediction-audit .rca-group-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:14px 0 18px}

      #expanded-evidence .evidence-metrics{display:none!important}
      #expanded-evidence .evidence-grid{display:block!important;max-width:1120px;margin-top:22px!important;border-top:1px solid var(--line)}
      #expanded-evidence .evidence-card{border:0!important;border-bottom:1px solid var(--line)!important;border-radius:0!important;background:transparent!important;padding:17px 4px!important}
      #expanded-evidence .evidence-card::before{display:none!important}
      #expanded-evidence .evidence-top{margin-bottom:7px!important}
      #expanded-evidence .evidence-card h3{margin-bottom:5px!important}
      #expanded-evidence .evidence-actions{margin-top:20px}

      #rules-title + .section-lede + .priority-fold{margin-top:18px}
      .priority-fold.compact-definitions{max-width:1120px}
      .priority-fold.compact-definitions .definitions{margin-top:0!important}

      #scholarly-priority,#patent-priority{border-top:1px solid rgba(103,212,255,.18)!important}
      #scholarly-priority .priority-fold,#patent-priority .priority-fold{margin-top:18px}

      @media(max-width:900px){
        #key-priority-anchors .priority-timeline li{grid-template-columns:120px minmax(0,1fr)}
        #key-priority-anchors .priority-anchor-id{grid-column:2;text-align:left;margin-top:-8px}
        #rca-prediction-audit .rca-group-grid{grid-template-columns:1fr}
      }
      .supporting-audit-record{
        margin-top:48px;
        padding-top:10px;
        border-top:1px solid rgba(103,212,255,.22);
      }
      .supporting-audit-record>.priority-section{
        padding:38px 0!important;
        border-top:1px solid var(--line)!important;
      }
      .supporting-audit-record>.priority-section:first-child{
        border-top:0!important;
        padding-top:28px!important;
      }
      .supporting-audit-record #expanded-evidence{
        border-top:0!important;
      }
      .supporting-audit-record #verified-predictions,
      .supporting-audit-record #rca-prediction-audit{
        max-width:none;
      }
      .supporting-audit-record .prediction-grid,
      .supporting-audit-record .evidence-grid{
        max-width:none;
      }

      @media(max-width:620px){
        .priority-head .audit-strip>div{border-right:0!important;border-bottom:1px solid var(--line)!important}
        .priority-head .audit-strip>div:last-child{border-bottom:0!important}
        #key-priority-anchors .priority-timeline li{grid-template-columns:1fr;gap:6px;padding:16px 2px}
        #key-priority-anchors .priority-anchor-id{grid-column:1;margin-top:2px}
      }
    `;
    document.head.appendChild(style);
  };

  const dedupeTopLinks = () => {
    const links = $$('.priority-head .toplinks a');
    const seen = new Set();
    links.forEach(link => {
      const key = link.getAttribute('href') || link.textContent.trim();
      if (seen.has(key)) link.remove();
      else seen.add(key);
    });
  };

  const tightenHero = () => {
    const strip = $('.priority-head .audit-strip');
    if (strip) {
      strip.innerHTML = `
        <div><strong>28</strong><span>DOI-backed research releases</span></div>
        <div><strong>24</strong><span>validation records</span></div>
        <div><strong>242</strong><span>external evidence / convergence records</span></div>
        <div><strong>4</strong><span>filed patent families</span></div>
      `;
    }
    dedupeTopLinks();
  };

  const compactDefinitions = () => {
    const rules = $('[aria-labelledby="rules-title"]');
    if (!rules || $('.priority-fold.compact-definitions', rules)) return;
    const definitions = $('.definitions', rules);
    if (!definitions) return;

    const details = document.createElement('details');
    details.className = 'priority-fold compact-definitions';
    details.open = true;
    const summary = document.createElement('summary');
    summary.innerHTML = '<span><strong>Methods and classification rules</strong><small>Dated origin, earliest public record, patent priority, post-date convergence, and provenance indicators</small></span><span class="fold-action" aria-hidden="true">Hide</span>';
    details.appendChild(summary);
    const body = document.createElement('div');
    body.className = 'priority-fold-body';
    definitions.parentNode.insertBefore(details, definitions);
    body.appendChild(definitions);
    details.appendChild(body);
    details.addEventListener('toggle', () => {
      const action = $('.fold-action', details);
      if (action) action.textContent = details.open ? 'Hide' : 'View';
    });
  };

  const buildKeyPriorityAnchors = () => {
    if ($('#key-priority-anchors')) return;
    const verified = $('#verified-predictions');
    if (!verified) return;

    const section = document.createElement('section');
    section.className = 'priority-section';
    section.id = 'key-priority-anchors';
    section.setAttribute('aria-labelledby', 'key-priority-anchors-title');
    section.innerHTML = `
      <p class="eyebrow">07 · Chronology index</p>
      <h2 id="key-priority-anchors-title">Key Priority Anchors</h2>
      <p class="section-lede">Selected public records that define the main chronology of the WCT research program. The complete registry below preserves the full Claim ID → source → date → DOI chain.</p>
      <ol class="priority-timeline">
        <li>
          <span class="priority-anchor-date">Apr 22, 2025</span>
          <div class="priority-anchor-main"><a href="https://doi.org/10.5281/zenodo.15644222" target="_blank" rel="noopener noreferrer"><h3>WCT foundational framework</h3></a><p><em>The Geometry of Resonance</em>: mass, force, spectra, and effective spacetime geometry from confined oscillatory fields.</p></div>
          <span class="priority-anchor-id">WCT-CORE-001</span>
        </li>
        <li>
          <span class="priority-anchor-date">May 7, 2025</span>
          <div class="priority-anchor-main"><a href="https://doi.org/10.5281/zenodo.17743607" target="_blank" rel="noopener noreferrer"><h3>Physical computation framework</h3></a><p>Curvature-bounded wave-computation classes with physical resource costs built into the computational model.</p></div>
          <span class="priority-anchor-id">WCT-COMP-001</span>
        </li>
        <li class="rca-priority-row">
          <span class="priority-anchor-date">Jun 11, 2025</span>
          <div class="priority-anchor-main"><a href="https://doi.org/10.5281/zenodo.17732661" target="_blank" rel="noopener noreferrer"><h3>Resonance-Confinement Architecture / Recursive AI Drift</h3></a><p>The dated AI-safety anchor for recursive drift, propagation-versus-correction limits, and physically bounded containment.</p></div>
          <span class="priority-anchor-id">WCT-AI-001</span>
        </li>
        <li>
          <span class="priority-anchor-date">Sep 8–16, 2025</span>
          <div class="priority-anchor-main"><a href="#scholarly-priority"><h3>Phase-Flux Field and spectral confinement</h3></a><p>Phase-Flux Field and Self-Emergent Fourier Cymatics establish finite-k selection, confinement, and emergent spectral structure.</p></div>
          <span class="priority-anchor-id">WCT-PFF-001 · WCT-SPEC-001</span>
        </li>
        <li>
          <span class="priority-anchor-date">Dec 1, 2025</span>
          <div class="priority-anchor-main"><a href="https://doi.org/10.5281/zenodo.19122146" target="_blank" rel="noopener noreferrer"><h3>WaveLock nonlinear-PDE one-way function</h3></a><p>WaveLock introduces a one-way-function construction based on bounded nonlinear PDE evolution.</p></div>
          <span class="priority-anchor-id">WCT-CRYPTO-001</span>
        </li>
      </ol>
      <div class="priority-anchor-actions"><a class="button secondary" href="#scholarly-priority">Full claim-level registry</a><a class="button secondary" href="../publications/">Publication archive</a></div>
    `;
    const claims = $('#scholarly-priority') || $('[aria-labelledby="claims-title"]');
    if (claims && claims.parentNode) claims.parentNode.insertBefore(section, claims);
    else verified.parentNode.insertBefore(section, verified);
  };

  const wrapPredictionDetail = (section) => {
    if (!section || $('.report-details.prediction-detail', section)) return;
    const grid = $('.prediction-grid', section);
    if (!grid) return;
    const details = document.createElement('details');
    details.className = 'report-details prediction-detail';
    details.open = true;
    const summary = document.createElement('summary');
    summary.innerHTML = '<span><strong>24 validation records</strong><small>AI and agent safety, physical computation, wave dynamics, collider tests, GWTC, and quantitative results</small></span><span class="report-action">Collapse</span>';
    const body = document.createElement('div');
    body.className = 'report-details-body';
    grid.parentNode.insertBefore(details, grid);
    details.appendChild(summary);
    body.appendChild(grid);
    details.appendChild(body);
    details.addEventListener('toggle', () => {
      const action = $('.report-action', details);
      if (action) action.textContent = details.open ? 'Close record' : 'Open record';
    });
  };

  const refocusVerifiedPredictions = () => {
    const section = $('#verified-predictions');
    if (!section) return;
    const eyebrow = $('.eyebrow', section);
    const h2 = $('#verified-predictions-title', section);
    const lede = $('.section-lede', section);
    if (eyebrow) eyebrow.textContent = '05 · Supporting validation catalogue';
    if (h2) h2.textContent = 'Supporting Validation Catalogue';
    if (lede) lede.textContent = 'A broader reference catalogue mixing external research correspondence, incidents, engineering results, and author-run frozen/public-data tests. The highest-specificity evidence is intentionally surfaced earlier on the page.';

    if (!$('.report-takeaways', section)) {
      const takeaways = document.createElement('div');
      takeaways.className = 'report-takeaways';
      takeaways.innerHTML = `
        <h3>Core findings</h3>
        <p><strong>Recursive AI drift:</strong> later work operationalizes semantic, behavioral, memory, constraint, and coordination drift corresponding to the June 11, 2025 RCA failure architecture.</p>
        <p><strong>Propagation versus correction:</strong> later multi-agent incidents provide mechanism-level evidence for failures in which propagation, coordination, or boundary crossing can exceed corrective control.</p>
        <p><strong>Prospective data tests:</strong> the public record includes frozen or holdout analyses in CMS and GWTC; interpretation remains dependent on the stated background and analysis assumptions.</p>
        <p><strong>Quantitative RCA correspondence:</strong> the later incident reconstruction gives R≈0.0104 versus the earlier Rpred≈0.0100; broader replication and generalization remain open.</p>
      `;
      const metrics = $('.prediction-metrics', section);
      if (metrics) metrics.parentNode.insertBefore(takeaways, metrics);
      else section.appendChild(takeaways);
    }
    wrapPredictionDetail(section);
  };

  const groupRcaAudit = () => {
    const section = $('#rca-prediction-audit');
    if (!section) return;

    const h2 = $('#rca-prediction-audit-title', section);
    const lede = $('.section-lede', section);
    if (h2) h2.textContent = 'RCA Mechanism & Forecast Audit';
    if (lede) lede.textContent = '06 · Author-side reference audit of RCA mechanisms, diagnostics, containment architecture, and frozen forecast milestones. These classifications are supporting audit material, not stronger evidence than the external records and frozen tests above.';

    if (!$('.rca-model-summary', section)) {
      const block = document.createElement('div');
      block.className = 'rca-model-summary';
      block.innerHTML = `
        <p><strong>Core model.</strong> RCA compares propagation and correction through <code>R = μ/ν = τprop/τcorr</code>, with local growth/decay represented by <code>λ = ν(1 − R)</code>.</p>
        <p><strong>Current evidence status.</strong> 42 audit items are retained: 15 strong mechanism or quantitative correspondences, 10 structural/conceptual convergences, 10 partial or precursor cases, 1 open validation item, and 6 prospective or unestablished milestones.</p>
        <p><strong>Forecast status.</strong> Early 2025–2026 stages have empirical or category-level support; the 2027–2030 milestones remain prospective.</p>
      `;
      const summary = $('.rca-audit-summary', section);
      if (summary) summary.parentNode.insertBefore(block, summary);
      else section.appendChild(block);
    }

    if ($('.rca-audit-groups', section)) {
      $('.rca-group', section).forEach(details => { if (!details.hasAttribute('data-user-toggled')) details.open = true; });
      return;
    }

    const sourceGrid = $('.rca-audit-grid', section);
    if (!sourceGrid) return;
    const cards = new Map();
    $$('.rca-audit-card', sourceGrid).forEach(card => {
      const n = Number(($('.rca-audit-number', card)?.textContent || '').trim());
      if (Number.isFinite(n)) cards.set(n, card);
    });

    const groups = [
      {title:'Core failure mechanisms',note:'Recursive drift, semantic loss, attractor lock-in, and multi-agent correction failure.',items:[1,2,3,4,7,8,17,20,21,22]},
      {title:'Stability, metrics & criticality',note:'Anchor survival, diagnostic measures, propagation/correction balance, and quantitative growth.',items:[5,6,9,10,11,12,13,14,15,16,28,40,41,42]},
      {title:'Corrigibility & containment architecture',note:'Constraint preservation, correction failure, termination logic, and proposed substrate-level controls.',items:[18,19,23,24,25,26,27]},
      {title:'Frozen prediction timeline',note:'The staged RCA trajectory from early empirical warning through still-prospective 2027–2030 milestones.',items:[29,30,31,32,33,34,35,36,37,38,39]}
    ];

    const wrapper = document.createElement('div');
    wrapper.className = 'rca-audit-groups';
    groups.forEach(group => {
      const details = document.createElement('details');
      details.className = 'rca-group';
      details.open = true;
      const summary = document.createElement('summary');
      summary.innerHTML = `<span><span class="rca-group-title">${group.title}</span><span class="rca-group-note">${group.note}</span></span><span class="rca-group-count">${group.items.length} items</span>`;
      details.appendChild(summary);
      const grid = document.createElement('div');
      grid.className = 'rca-group-grid';
      group.items.forEach(n => { const card = cards.get(n); if (card) grid.appendChild(card); });
      details.appendChild(grid);
      wrapper.appendChild(details);
    });
    sourceGrid.parentNode.insertBefore(wrapper, sourceGrid);
    sourceGrid.hidden = true;
  };

  const updateEvidenceHighlights = () => {
    const section = $('#expanded-evidence');
    if (!section) return;
    const h2 = $('#expanded-evidence-title', section);
    const lede = $('.section-lede', section);
    if (h2) h2.textContent = 'External Evidence Highlights';
    if (lede) lede.textContent = 'Selected high-specificity examples from the external ledger. The complete corpus remains on the WCT Adoption & External Evidence page rather than being reproduced here.';
    const primary = $('.evidence-actions .button.primary', section);
    if (primary) primary.textContent = 'Open the full AI evidence ledger';
  };

  const renameConvergence = () => {
    const section = $('#verified-convergence') || $('[aria-labelledby="convergence-title"]');
    if (!section) return;
    const eyebrow = $('.eyebrow', section);
    const h2 = $('#convergence-title', section) || $('h2', section);
    if (eyebrow) eyebrow.textContent = '04 · Broader post-date convergence';
    if (h2) h2.textContent = 'Verified Post-Date Comparisons';
  };


  const defaultExpandEvidence = () => {
    [
      '.priority-fold',
      '.report-details',
      '#rca-prediction-audit .rca-group'
    ].forEach(selector => {
      $(selector).forEach(details => {
        if (details.tagName === 'DETAILS' && !details.hasAttribute('data-user-toggled')) details.open = true;
      });
    });

    $('.priority-fold, .report-details, #rca-prediction-audit .rca-group').forEach(details => {
      if (details.dataset.toggleTracking === 'true') return;
      details.dataset.toggleTracking = 'true';
      details.addEventListener('toggle', event => {
        if (event.isTrusted) details.setAttribute('data-user-toggled','true');
      });
    });

    $('.priority-fold[open] .fold-action').forEach(action => action.textContent = 'Hide');
    $('.report-details[open] .report-action').forEach(action => action.textContent = 'Collapse');
  };

  const reorderJumpNav = () => {
    const nav = $('#priority-jump');
    if (!nav) return;
    const labels = [
      ['#rca-confirmation','RCA high-specificity evidence'],
      ['#patent-priority','Patent chronology'],
      ['#detector-evidence','Detector evidence'],
      ['#verified-convergence','Post-date convergence'],
      ['#verified-predictions','Validation catalogue'],
      ['#rca-prediction-audit','RCA audit'],
      ['#key-priority-anchors','Priority anchors'],
      ['#scholarly-priority','Full claim registry']
    ];
    nav.innerHTML = '';
    labels.forEach(([href,text]) => {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      nav.appendChild(a);
    });
  };

  const reorderSections = () => {
    const main = $('.priority-shell');
    if (!main) return;

    const convergence = $('#verified-convergence') || $('[aria-labelledby="convergence-title"]');
    const claims = $('#scholarly-priority') || $('[aria-labelledby="claims-title"]');

    let mount = $('#supporting-audit-record');
    if (!mount) {
      mount = document.createElement('div');
      mount.id = 'supporting-audit-record';
      mount.className = 'supporting-audit-record';
      mount.setAttribute('aria-label', 'Supporting validation and author-side audit record');
    }

    if (convergence && convergence.parentNode === main) {
      main.insertBefore(mount, convergence.nextSibling);
    } else if (claims && claims.parentNode === main) {
      main.insertBefore(mount, claims);
    } else if (!mount.parentNode) {
      main.appendChild(mount);
    }

    const verified = $('#verified-predictions');
    const audit = $('#rca-prediction-audit');
    [verified, audit].filter(Boolean).forEach(section => {
      section.classList.add('supporting-audit-detail');
      mount.appendChild(section);
    });

    const anchors = $('#key-priority-anchors');
    if (anchors && claims && claims.parentNode === main) {
      main.insertBefore(anchors, claims);
    }
  };

  const run = () => {
    installStyles();
    tightenHero();
    compactDefinitions();
    buildKeyPriorityAnchors();
    refocusVerifiedPredictions();
    groupRcaAudit();
    updateEvidenceHighlights();
    renameConvergence();
    defaultExpandEvidence();
    reorderJumpNav();
    reorderSections();

    const ready = $('#key-priority-anchors') && $('#verified-predictions') && $('#rca-prediction-audit') && ($('#scholarly-priority') || $('[aria-labelledby="claims-title"]'));
    return Boolean(ready);
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