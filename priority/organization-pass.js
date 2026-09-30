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

      @media(max-width:900px){
        #rca-prediction-audit .rca-group-grid{grid-template-columns:1fr}
      }
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
    renameVerifiedPredictions();
    groupRcaAudit();
    updateEvidenceHighlights();
    renameConvergence();
    reorderJumpNav();
    reorderSections();

    const ready = $('#verified-predictions') && $('#rca-prediction-audit') && $('#expanded-evidence') && ($('#verified-convergence') || $('[aria-labelledby="convergence-title"]'));
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