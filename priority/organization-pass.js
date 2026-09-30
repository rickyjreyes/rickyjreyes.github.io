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
      #key-priority-anchors{border-top:1px solid rgba(103,212,255,.32)!important}
      #key-priority-anchors .priority-anchor-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-top:24px;max-width:1240px}
      #key-priority-anchors .priority-anchor-card{position:relative;padding:18px;border:1px solid var(--line);border-radius:15px;background:rgba(255,255,255,.018);overflow:hidden}
      #key-priority-anchors .priority-anchor-card::before{content:'';position:absolute;inset:0 auto 0 0;width:3px;background:var(--accent)}
      #key-priority-anchors .priority-anchor-card.rca-anchor{border-color:rgba(124,224,159,.34);background:rgba(124,224,159,.045)}
      #key-priority-anchors .priority-anchor-card.rca-anchor::before{background:#7ce09f;width:4px}
      #key-priority-anchors .priority-anchor-date{display:block;color:var(--accent);font-size:.72rem;font-weight:850;letter-spacing:.045em;text-transform:uppercase}
      #key-priority-anchors .rca-anchor .priority-anchor-date{color:#9be8b3}
      #key-priority-anchors .priority-anchor-card h3{margin:9px 0 6px;font-size:1rem;line-height:1.3;color:var(--text)}
      #key-priority-anchors .priority-anchor-card p{margin:0;color:var(--muted);font-size:.82rem;line-height:1.5}
      #key-priority-anchors .priority-anchor-id{display:block;margin-top:10px;color:var(--muted-2);font-size:.69rem;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
      #key-priority-anchors .priority-anchor-card a{color:inherit;text-decoration:none}
      #key-priority-anchors .priority-anchor-card a:hover h3{color:var(--accent)}
      #key-priority-anchors .priority-anchor-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:20px}

      #rca-prediction-audit .rca-audit-grid{display:none!important}
      #rca-prediction-audit .rca-audit-groups{display:grid;gap:12px;margin-top:22px;max-width:1180px}
      #rca-prediction-audit .rca-group{border:1px solid var(--line);border-radius:15px;background:rgba(255,255,255,.012);overflow:hidden}
      #rca-prediction-audit .rca-group>summary{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:18px 20px;cursor:pointer;list-style:none;user-select:none}
      #rca-prediction-audit .rca-group>summary::-webkit-details-marker{display:none}
      #rca-prediction-audit .rca-group>summary:hover{background:rgba(103,212,255,.025)}
      #rca-prediction-audit .rca-group-title{display:block;color:var(--text);font:600 1.05rem/1.25 Georgia,serif}
      #rca-prediction-audit .rca-group-note{display:block;margin-top:4px;color:var(--muted-2);font-size:.77rem;line-height:1.45}
      #rca-prediction-audit .rca-group-count{flex:0 0 auto;padding:5px 9px;border:1px solid rgba(103,212,255,.28);border-radius:999px;color:var(--accent);font-size:.68rem;font-weight:850;white-space:nowrap}
      #rca-prediction-audit .rca-group[open]>summary{border-bottom:1px solid var(--line);background:rgba(103,212,255,.018)}
      #rca-prediction-audit .rca-group-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:14px}
      #rca-prediction-audit .rca-group-grid .rca-audit-card{margin:0}

      #rules-title + .section-lede + .priority-fold{margin-top:18px}
      .priority-fold.compact-definitions{max-width:1120px}
      .priority-fold.compact-definitions .definitions{margin-top:0!important}

      #expanded-evidence .evidence-metrics{margin-bottom:18px}
      #expanded-evidence .evidence-actions{margin-top:20px}

      @media(max-width:1100px){#key-priority-anchors .priority-anchor-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:900px){
        #rca-prediction-audit .rca-group-grid{grid-template-columns:1fr}
        #key-priority-anchors .priority-anchor-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      }
      @media(max-width:620px){#key-priority-anchors .priority-anchor-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  };

  const dedupeTopLinks = () => {
    const links = $$('.priority-head .toplinks a');
    const seen = new Set();
    links.forEach(link => {
      const key = `${link.getAttribute('href') || ''}|${link.textContent.trim()}`;
      if (seen.has(key)) link.remove();
      else seen.add(key);
    });
  };

  const tightenHero = () => {
    const strip = $('.priority-head .audit-strip');
    if (strip) {
      strip.innerHTML = `
        <div><strong>22</strong><span>DOI-backed scholarly priority records</span></div>
        <div><strong>24</strong><span>verified predictions &amp; confirmations</span></div>
        <div><strong>42</strong><span>RCA / WCT-AI mechanism &amp; forecast audit items</span></div>
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
    const summary = document.createElement('summary');
    summary.innerHTML = '<span><strong>View evidence definitions</strong><small>Dated origin, earliest public record, patent priority, post-date convergence, and provenance indicators</small></span><span class="fold-action" aria-hidden="true">View</span>';
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
    const main = $('.priority-shell');
    const verified = $('#verified-predictions');
    if (!main || !verified) return;

    const section = document.createElement('section');
    section.className = 'priority-section';
    section.id = 'key-priority-anchors';
    section.setAttribute('aria-labelledby', 'key-priority-anchors-title');
    section.innerHTML = `
      <p class="eyebrow">Key dated priority anchors</p>
      <h2 id="key-priority-anchors-title">The claims a reader should see first</h2>
      <p class="section-lede">Five dated public records define the main chronology of the WCT research program. The detailed claim registry below preserves the complete Claim ID → source → date → DOI chain.</p>
      <div class="priority-anchor-grid">
        <article class="priority-anchor-card">
          <a href="https://doi.org/10.5281/zenodo.15644222" target="_blank" rel="noopener noreferrer">
            <span class="priority-anchor-date">Apr 22, 2025</span>
            <h3>WCT foundational framework</h3>
            <p><em>The Geometry of Resonance</em>: mass, force, spectra, and effective spacetime geometry from confined oscillatory fields.</p>
            <span class="priority-anchor-id">WCT-CORE-001</span>
          </a>
        </article>
        <article class="priority-anchor-card">
          <a href="https://doi.org/10.5281/zenodo.17743607" target="_blank" rel="noopener noreferrer">
            <span class="priority-anchor-date">May 7, 2025</span>
            <h3>Physical computation framework</h3>
            <p>Curvature-bounded wave-computation classes with physical resource costs built into the computational model.</p>
            <span class="priority-anchor-id">WCT-COMP-001</span>
          </a>
        </article>
        <article class="priority-anchor-card rca-anchor">
          <a href="https://doi.org/10.5281/zenodo.17732661" target="_blank" rel="noopener noreferrer">
            <span class="priority-anchor-date">Jun 11, 2025</span>
            <h3>RCA / recursive AI drift architecture</h3>
            <p><em>Resonance-Confinement Architecture</em>: the dated AI-safety anchor for recursive drift, correction limits, and physically bounded containment.</p>
            <span class="priority-anchor-id">WCT-AI-001</span>
          </a>
        </article>
        <article class="priority-anchor-card">
          <a href="#scholarly-priority">
            <span class="priority-anchor-date">Sep 8–16, 2025</span>
            <h3>Phase-flux &amp; spectral confinement</h3>
            <p>Phase-Flux Field and Self-Emergent Fourier Cymatics establish finite-k selection, confinement, and emergent spectral structure.</p>
            <span class="priority-anchor-id">WCT-PFF-001 · WCT-SPEC-001</span>
          </a>
        </article>
        <article class="priority-anchor-card">
          <a href="https://doi.org/10.5281/zenodo.19122146" target="_blank" rel="noopener noreferrer">
            <span class="priority-anchor-date">Dec 1, 2025</span>
            <h3>WaveLock nonlinear-PDE one-way function</h3>
            <p>WaveLock introduces a one-way-function construction based on bounded nonlinear PDE evolution.</p>
            <span class="priority-anchor-id">WCT-CRYPTO-001</span>
          </a>
        </article>
      </div>
      <div class="priority-anchor-actions"><a class="button secondary" href="#scholarly-priority">View all 22 claim-level priority records</a><a class="button secondary" href="../publications/">Open publication archive</a></div>
    `;
    verified.parentNode.insertBefore(section, verified);
  };

  const renameVerifiedPredictions = () => {
    const section = $('#verified-predictions');
    if (!section) return;
    const eyebrow = $('.eyebrow', section);
    const h2 = $('#verified-predictions-title', section);
    const lede = $('.section-lede', section);
    if (eyebrow) eyebrow.textContent = 'Verified prediction record';
    if (h2) h2.textContent = '24 Verified Predictions & Confirmations';
    if (lede) lede.textContent = 'Dated Reyes predictions and pre-existing technical claims paired with later observations, literature results, engineering results, incidents, or frozen/public-data tests that provide confirming evidence.';
    const firstMetric = $('.prediction-metric span', section);
    if (firstMetric) firstMetric.textContent = 'verified predictions & confirmations';
  };

  const groupRcaAudit = () => {
    const section = $('#rca-prediction-audit');
    if (!section || $('.rca-audit-groups', section)) return;
    const sourceGrid = $('.rca-audit-grid', section);
    if (!sourceGrid) return;

    const cards = new Map();
    $$('.rca-audit-card', sourceGrid).forEach(card => {
      const n = Number(($('.rca-audit-number', card)?.textContent || '').trim());
      if (Number.isFinite(n)) cards.set(n, card);
    });

    const groups = [
      {
        title: 'Core failure mechanisms',
        note: 'The recursive-drift failure geometry: semantic loss, attractor lock-in, propagation, and multi-agent correction failure.',
        items: [1,2,3,4,7,8,17,20,21,22],
        open: true
      },
      {
        title: 'Stability, metrics & criticality',
        note: 'Diagnostics and stability laws used to measure anchor survival, criticality, propagation/correction balance, and quantitative growth.',
        items: [5,6,9,10,11,12,13,14,15,16,28,40,41,42]
      },
      {
        title: 'Corrigibility & containment architecture',
        note: 'Constraint preservation, correction failure, termination logic, and the proposed substrate-level containment architecture.',
        items: [18,19,23,24,25,26,27]
      },
      {
        title: 'Frozen prediction timeline',
        note: 'The staged RCA trajectory from early empirical warning through the still-prospective 2027–2030 milestones.',
        items: [29,30,31,32,33,34,35,36,37,38,39]
      }
    ];

    const wrapper = document.createElement('div');
    wrapper.className = 'rca-audit-groups';

    groups.forEach(group => {
      const details = document.createElement('details');
      details.className = 'rca-group';
      if (group.open) details.open = true;
      const summary = document.createElement('summary');
      summary.innerHTML = `<span><span class="rca-group-title">${group.title}</span><span class="rca-group-note">${group.note}</span></span><span class="rca-group-count">${group.items.length} items</span>`;
      details.appendChild(summary);
      const grid = document.createElement('div');
      grid.className = 'rca-group-grid';
      group.items.forEach(n => {
        const card = cards.get(n);
        if (card) grid.appendChild(card);
      });
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
    if (lede) lede.textContent = 'Selected high-specificity examples from the full external ledger. The public convergence dataset currently contains 237 visible records, including 66 Recursive AI Drift / AI-system records.';
    const metrics = $$('.evidence-metric', section);
    if (metrics[0]) metrics[0].innerHTML = '<strong>237</strong><span>visible external records across WCT physics, photonics, and AI-system research</span>';
    if (metrics[1]) metrics[1].innerHTML = '<strong>66</strong><span>Recursive AI Drift / AI-system records</span>';
    if (metrics[2]) metrics[2].innerHTML = '<strong>6</strong><span>date-checked WCT comparison cases highlighted on this page</span>';
    const primary = $('.evidence-actions .button.primary', section);
    if (primary) primary.textContent = 'Open the 66-record AI evidence ledger';
  };

  const renameConvergence = () => {
    const section = $('#verified-convergence') || $('[aria-labelledby="convergence-title"]');
    if (!section) return;
    const eyebrow = $('.eyebrow', section);
    const h2 = $('#convergence-title', section) || $('h2', section);
    if (eyebrow) eyebrow.textContent = 'Verified post-date comparisons';
    if (h2) h2.textContent = 'Verified Post-Date Comparisons';
  };

  const reorderJumpNav = () => {
    const nav = $('#priority-jump');
    if (!nav) return;
    const labels = [
      ['#key-priority-anchors','Key anchors'],
      ['#verified-predictions','Verified predictions'],
      ['#rca-prediction-audit','RCA audit'],
      ['#expanded-evidence','External evidence'],
      ['#verified-convergence','Verified comparisons'],
      ['#scholarly-priority','Scholarly priority'],
      ['#patent-priority','Patent families'],
      ['#historical-controls','Historical controls']
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
    const rights = $('[aria-labelledby="rights-title"]', main);
    if (!rights) return;
    const order = [
      $('#key-priority-anchors'),
      $('#verified-predictions'),
      $('#rca-prediction-audit'),
      $('#expanded-evidence'),
      $('#verified-convergence') || $('[aria-labelledby="convergence-title"]'),
      $('#scholarly-priority') || $('[aria-labelledby="claims-title"]'),
      $('#patent-priority') || $('[aria-labelledby="patent-title"]'),
      $('#historical-controls') || $('[aria-labelledby="controls-title"]')
    ].filter(Boolean);
    order.forEach(section => main.insertBefore(section, rights));
  };

  const run = () => {
    installStyles();
    tightenHero();
    compactDefinitions();
    buildKeyPriorityAnchors();
    renameVerifiedPredictions();
    groupRcaAudit();
    updateEvidenceHighlights();
    renameConvergence();
    reorderJumpNav();
    reorderSections();

    const ready = $('#key-priority-anchors') && $('#verified-predictions') && $('#rca-prediction-audit') && $('#expanded-evidence') && ($('#verified-convergence') || $('[aria-labelledby="convergence-title"]'));
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