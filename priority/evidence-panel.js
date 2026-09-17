(() => {
  const path = location.pathname.replace(/index\.html$/i, '');
  if (path !== '/priority/') return;

  const makeDetails = (section, summaryTitle, summaryMeta) => {
    if (!section || section.querySelector(':scope > details.priority-fold')) return;
    const h2 = section.querySelector(':scope > h2');
    const lede = section.querySelector(':scope > .section-lede');
    if (!h2) return;

    const details = document.createElement('details');
    details.className = 'priority-fold';
    const summary = document.createElement('summary');
    summary.innerHTML = `<span><strong>${summaryTitle}</strong>${summaryMeta ? `<small>${summaryMeta}</small>` : ''}</span><span class="fold-action" aria-hidden="true">View</span>`;
    details.appendChild(summary);

    const body = document.createElement('div');
    body.className = 'priority-fold-body';
    let node = lede ? lede.nextElementSibling : h2.nextElementSibling;
    while (node) {
      const next = node.nextElementSibling;
      body.appendChild(node);
      node = next;
    }
    details.appendChild(body);
    section.appendChild(details);
    details.addEventListener('toggle', () => {
      const action = details.querySelector('.fold-action');
      if (action) action.textContent = details.open ? 'Hide' : 'View';
    });
  };

  const rewritePriorityCopy = (main) => {
    const intro = document.querySelector('.priority-head h1 + p');
    if (intro) intro.textContent = 'A dated registry of Reyes research origins, patent-family priority, and later external work showing corresponding mechanisms, observations, and control responses.';

    const rules = document.querySelector('[aria-labelledby="rules-title"]');
    if (rules) {
      const h2 = rules.querySelector('h2');
      const lede = rules.querySelector('.section-lede');
      if (h2) h2.textContent = 'How to read this registry';
      if (lede) lede.textContent = 'Four evidence layers are kept separate: dated Reyes origin, post-date convergence, empirical corroboration, and institutional response.';

      rules.querySelectorAll('.definition-card').forEach((card) => {
        const title = card.querySelector('strong');
        const body = card.querySelector('p');
        if (!title || !body) return;
        const label = title.textContent.trim();
        if (label === 'Scholarly / technical priority') {
          title.textContent = 'Dated Reyes origin';
          body.textContent = 'A specific architecture, mechanism, terminology, prediction, or construction appears in a verifiable Reyes public record.';
        } else if (label === 'Documented origin') {
          title.textContent = 'Earliest public record';
          body.textContent = 'The earliest currently identified archival source in this registry containing the listed contribution.';
        } else if (label === 'Patent-family priority') {
          body.textContent = 'The earliest reported priority date for a filed application family and its public filing chronology.';
        } else if (label === 'Structural convergence') {
          title.textContent = 'Post-date convergence';
          body.textContent = 'A later external work exhibits the same or a closely corresponding mechanism, architecture, mathematical structure, or observed behavior.';
        } else if (label === 'Influence / derivation') {
          title.textContent = 'Provenance indicators';
          body.textContent = 'Citation trails, terminology transfer, mathematical correspondence, code similarity, documented access, and communications provide additional provenance signals when available.';
        }
      });
    }

    const patent = document.querySelector('[aria-labelledby="patent-title"]');
    if (patent) {
      const lede = patent.querySelector('.section-lede');
      if (lede) lede.textContent = 'Four filed families with their earliest reported priority date, later filing stage, and public scope.';
      const note = patent.querySelector('.note');
      if (note) note.innerHTML = '<strong>Patent chronology:</strong> family → earliest reported priority date → later filing stage → public scope.';
    }

    const convergence = document.querySelector('[aria-labelledby="convergence-title"]');
    if (convergence) {
      const lede = convergence.querySelector('.section-lede');
      if (lede) lede.textContent = 'Six date-checked cases pairing specific earlier Reyes disclosures with later external publications showing material mechanism-level correspondence.';

      convergence.querySelectorAll('.status-pill').forEach((pill) => {
        const text = pill.textContent.trim();
        if (text === 'INFLUENCE UNRESOLVED') {
          pill.textContent = 'POST-DATE CONVERGENCE';
          pill.classList.remove('muted-status');
        } else if (/Chronology\s*\/\s*prior-art review/i.test(text)) {
          pill.textContent = 'HIGH-PRIORITY COMPARISON';
          pill.classList.remove('muted-status');
        }
      });

      const candidateHeading = Array.from(convergence.querySelectorAll('h3')).find((el) => /Additional high-priority comparisons/i.test(el.textContent));
      if (candidateHeading) {
        candidateHeading.textContent = 'Additional high-priority comparisons';
        const candidateLede = candidateHeading.nextElementSibling;
        if (candidateLede && candidateLede.classList.contains('section-lede')) {
          candidateLede.textContent = 'Four additional multi-mechanism comparisons retained for deeper chronology, source, and prior-art normalization.';
        }
      }

      const audit = convergence.querySelector('.audit-status');
      if (audit) audit.innerHTML = '<strong>Evidence promotion.</strong> Stronger cases combine normalized Reyes anchors, external publication chronology, mechanism-level correspondence, and historical controls.';
    }

    const controls = document.querySelector('[aria-labelledby="controls-title"]');
    if (controls) {
      const eyebrow = controls.querySelector('.eyebrow');
      const h2 = controls.querySelector('h2');
      const lede = controls.querySelector('.section-lede');
      if (eyebrow) eyebrow.textContent = 'Historical controls';
      if (h2) h2.textContent = 'Earlier literature defines the baseline';
      if (lede) lede.textContent = 'Pre-2025 mechanisms are retained as controls so narrower WCT combinations, constructions, and predictions can be isolated clearly.';
    }
  };

  const installStyles = () => {
    if (document.getElementById('priority-evidence-style')) return;
    const style = document.createElement('style');
    style.id = 'priority-evidence-style';
    style.textContent = `
      .priority-shell{width:min(1480px,calc(100% - 48px))!important}
      .priority-head{max-width:1040px!important;margin-bottom:26px!important}
      .priority-head h1{max-width:12ch}
      .priority-head>p,.section-lede{max-width:78ch!important;line-height:1.62!important}
      .identity,.rights-notice{max-width:1040px!important}
      .audit-strip{grid-template-columns:repeat(4,minmax(0,1fr))!important;max-width:1040px}
      .definitions{grid-template-columns:repeat(3,minmax(0,1fr))!important;max-width:1120px}
      .definition-card{padding:18px!important}
      .priority-section{padding:42px 0!important}
      .priority-section>h2{max-width:24ch}
      .priority-section>h3{max-width:34ch}

      .priority-jump{display:flex;flex-wrap:wrap;gap:8px;margin:26px 0 8px;max-width:1120px}
      .priority-jump a{padding:8px 12px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.02);color:var(--muted);font-size:.78rem;font-weight:750;text-decoration:none}
      .priority-jump a:hover{border-color:rgba(103,212,255,.38);color:var(--text);background:rgba(103,212,255,.05)}

      .evidence-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:22px 0 24px;max-width:1120px}
      .evidence-metric{padding:18px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.02)}
      .evidence-metric strong{display:block;font:500 1.75rem/1 Georgia,serif;color:var(--accent)}
      .evidence-metric span{display:block;margin-top:7px;color:var(--muted-2);font-size:.82rem;line-height:1.4}
      .evidence-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:22px;max-width:1160px}
      .evidence-card{position:relative;padding:20px 20px 18px;border:1px solid var(--line);border-radius:15px;background:rgba(255,255,255,.018);overflow:hidden}
      .evidence-card::before{content:'';position:absolute;inset:0 auto 0 0;width:3px;background:var(--evidence-accent,var(--accent))}
      .evidence-card.empirical{--evidence-accent:#ffc55c;background:rgba(255,197,92,.035);border-color:rgba(255,197,92,.22)}
      .evidence-card.independent{--evidence-accent:#67d4ff;background:rgba(103,212,255,.035);border-color:rgba(103,212,255,.22)}
      .evidence-card.institutional{--evidence-accent:#b789ff;background:rgba(183,137,255,.04);border-color:rgba(183,137,255,.24)}
      .evidence-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:10px}
      .evidence-badge{display:inline-flex;padding:4px 8px;border:1px solid currentColor;border-radius:999px;font-size:.64rem;font-weight:850;letter-spacing:.035em}
      .empirical .evidence-badge{color:#ffc55c}.independent .evidence-badge{color:#67d4ff}.institutional .evidence-badge{color:#c7a5ff}
      .evidence-date{color:var(--muted-2);font-size:.74rem;font-weight:700}
      .evidence-card h3{margin:0 0 7px;font-size:1.03rem;line-height:1.32}
      .evidence-card h3 a{color:var(--text);text-decoration:none}.evidence-card h3 a:hover{color:var(--accent)}
      .evidence-card p{margin:0;color:var(--muted);font-size:.88rem;line-height:1.55}
      .evidence-anchor{margin-top:11px!important;color:var(--muted-2)!important;font-size:.76rem!important}
      .evidence-anchor strong{color:var(--text)}
      .evidence-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:22px}

      .priority-fold{margin-top:22px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.012);overflow:hidden;max-width:1240px}
      .priority-fold>summary{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 20px;cursor:pointer;list-style:none;user-select:none}
      .priority-fold>summary::-webkit-details-marker{display:none}
      .priority-fold>summary:hover{background:rgba(103,212,255,.03)}
      .priority-fold>summary strong{display:block;color:var(--text);font-size:.94rem}
      .priority-fold>summary small{display:block;margin-top:4px;color:var(--muted-2);font-size:.75rem;line-height:1.4}
      .fold-action{flex:0 0 auto;padding:5px 9px;border:1px solid rgba(103,212,255,.28);border-radius:999px;color:var(--accent);font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em}
      .priority-fold[open]>summary{border-bottom:1px solid var(--line);background:rgba(103,212,255,.02)}
      .priority-fold-body{padding:0 12px 18px}
      .priority-fold-body .table-wrap{margin-top:14px!important}
      .priority-fold-body .note,.priority-fold-body .audit-status{margin-top:18px!important}

      #expanded-evidence{border-top:1px solid rgba(103,212,255,.28)!important}
      [aria-labelledby="convergence-title"]{border-top:1px solid rgba(255,197,92,.22)!important}
      [aria-labelledby="claims-title"]{padding-bottom:30px!important}

      @media(max-width:1100px){.audit-strip{grid-template-columns:repeat(2,minmax(0,1fr))!important}.definitions{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
      @media(max-width:900px){.evidence-grid{grid-template-columns:1fr}.evidence-metrics{grid-template-columns:1fr}}
      @media(max-width:620px){.priority-shell{width:calc(100% - 20px)!important}.audit-strip,.definitions{grid-template-columns:1fr!important}.priority-section{padding:34px 0!important}.priority-fold>summary{padding:16px}.fold-action{display:none}}
    `;
    document.head.appendChild(style);
  };

  const buildJumpNav = (main) => {
    if (document.getElementById('priority-jump')) return;
    const nav = document.createElement('nav');
    nav.id = 'priority-jump';
    nav.className = 'priority-jump';
    nav.setAttribute('aria-label', 'Priority registry sections');
    nav.innerHTML = `
      <a href="#expanded-evidence">External evidence</a>
      <a href="#verified-convergence">Verified convergence</a>
      <a href="#patent-priority">Patent families</a>
      <a href="#scholarly-priority">Scholarly claims</a>
      <a href="#historical-controls">Historical controls</a>
    `;
    const head = main.querySelector('.priority-head');
    if (head) head.appendChild(nav);
  };

  const improveLongSections = () => {
    const patent = document.querySelector('[aria-labelledby="patent-title"]');
    if (patent) {
      patent.id = 'patent-priority';
      makeDetails(patent, 'View 4 patent families', 'Priority dates, filing stages, public scope, and status');
    }

    const controls = document.querySelector('[aria-labelledby="controls-title"]');
    if (controls) {
      controls.id = 'historical-controls';
      makeDetails(controls, 'View historical controls', 'Three pre-2025 baseline mechanisms used to isolate narrower WCT claims');
    }

    const claims = document.querySelector('[aria-labelledby="claims-title"]');
    if (claims) {
      claims.id = 'scholarly-priority';
      makeDetails(claims, 'View 22 claim-level priority records', 'Claim ID, contribution, earliest public record, date, and DOI');
    }

    const convergence = document.querySelector('[aria-labelledby="convergence-title"]');
    if (convergence) {
      convergence.id = 'verified-convergence';
      const h3 = Array.from(convergence.querySelectorAll('h3')).find((el) => /Additional high-priority comparisons/i.test(el.textContent));
      if (h3 && !h3.closest('details')) {
        const details = document.createElement('details');
        details.className = 'priority-fold';
        const summary = document.createElement('summary');
        summary.innerHTML = '<span><strong>View 4 additional high-priority comparisons</strong><small>Multi-mechanism comparisons retained for deeper normalization</small></span><span class="fold-action" aria-hidden="true">View</span>';
        details.appendChild(summary);
        const body = document.createElement('div');
        body.className = 'priority-fold-body';
        let node = h3;
        while (node) {
          const next = node.nextElementSibling;
          body.appendChild(node);
          node = next;
        }
        details.appendChild(body);
        convergence.appendChild(details);
        details.addEventListener('toggle', () => {
          const action = details.querySelector('.fold-action');
          if (action) action.textContent = details.open ? 'Hide' : 'View';
        });
      }
    }
  };

  const buildEvidence = (main) => {
    if (document.getElementById('expanded-evidence')) return;
    const section = document.createElement('section');
    section.className = 'priority-section';
    section.id = 'expanded-evidence';
    section.setAttribute('aria-labelledby', 'expanded-evidence-title');
    section.innerHTML = `
      <p class="eyebrow">External evidence</p>
      <h2 id="expanded-evidence-title">Post-2025 evidence now spans research papers, frontier-lab observations, and institutional controls</h2>
      <p class="section-lede">The public convergence ledger contains 181 external records, including 39 Recursive AI Drift / AI-system records. These highlighted cases are the clearest current examples of empirical convergence, independent convergence, and institutional response.</p>

      <div class="evidence-metrics" aria-label="Expanded evidence totals">
        <div class="evidence-metric"><strong>181</strong><span>external records across WCT physics, photonics, and AI-system research</span></div>
        <div class="evidence-metric"><strong>39</strong><span>Recursive AI Drift / AI-system records</span></div>
        <div class="evidence-metric"><strong>6</strong><span>fully normalized WCT chronology cases</span></div>
      </div>

      <div class="evidence-grid">
        <article class="evidence-card empirical">
          <div class="evidence-top"><span class="evidence-badge">EMPIRICAL CONVERGENCE</span><span class="evidence-date">OpenAI · September 16, 2026</span></div>
          <h3><a href="https://openai.com/index/model-misalignment-reporting-framework/" target="_blank" rel="noopener noreferrer">Our framework for reporting model misalignment</a></h3>
          <p>OpenAI disclosed self-generated continuation instructions, concealment of mistakes, unauthorized actions, unintended inter-model communication, and oversight-evasion behavior.</p>
          <p class="evidence-anchor"><strong>Connection:</strong> persistent state, recursive propagation, boundary crossing, and correction failure.</p>
        </article>

        <article class="evidence-card empirical">
          <div class="evidence-top"><span class="evidence-badge">EMPIRICAL CONVERGENCE</span><span class="evidence-date">Anthropic · September 9, 2026</span></div>
          <h3><a href="https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents" target="_blank" rel="noopener noreferrer">An alignment assessment of recent cybersecurity incidents</a></h3>
          <p>Anthropic reported four incidents in which Claude models gained unauthorized access to real third-party systems during evaluations.</p>
          <p class="evidence-anchor"><strong>Connection:</strong> autonomous boundary crossing, task-pursuit escalation, and system-level alignment failure.</p>
        </article>

        <article class="evidence-card empirical">
          <div class="evidence-top"><span class="evidence-badge">EMPIRICAL CONVERGENCE</span><span class="evidence-date">METR · updated May 19, 2026</span></div>
          <h3><a href="https://metr.org/agent-incidents/" target="_blank" rel="noopener noreferrer">Documented AI Agent Incidents</a></h3>
          <p>METR catalogues 44 documented agent incidents scored for overreach and deception.</p>
          <p class="evidence-anchor"><strong>Connection:</strong> repeated agent overreach, concealment, and trajectory-level misalignment.</p>
        </article>

        <article class="evidence-card institutional">
          <div class="evidence-top"><span class="evidence-badge">INSTITUTIONAL RESPONSE</span><span class="evidence-date">Google DeepMind · June 18, 2026</span></div>
          <h3><a href="https://deepmind.google/blog/securing-the-future-of-ai-agents/" target="_blank" rel="noopener noreferrer">Securing the future of AI agents</a></h3>
          <p>DeepMind introduced an AI Control Roadmap for increasingly capable agents requiring stronger monitoring and containment.</p>
          <p class="evidence-anchor"><strong>Connection:</strong> bounded control architecture, monitoring, containment, and correction channels.</p>
        </article>

        <article class="evidence-card independent">
          <div class="evidence-top"><span class="evidence-badge">INDEPENDENT CONVERGENCE</span><span class="evidence-date">arXiv · 2026</span></div>
          <h3><a href="https://arxiv.org/abs/2605.17830" target="_blank" rel="noopener noreferrer">Remembering More, Risking More</a></h3>
          <p>Independent work studies longitudinal safety degradation in memory-equipped agents and temporal memory contamination.</p>
          <p class="evidence-anchor"><strong>Connection:</strong> frozen model weights with evolving external state and persistent cross-session dynamics.</p>
        </article>

        <article class="evidence-card independent">
          <div class="evidence-top"><span class="evidence-badge">INDEPENDENT CONVERGENCE</span><span class="evidence-date">arXiv · 2026</span></div>
          <h3><a href="https://arxiv.org/abs/2603.27148" target="_blank" rel="noopener noreferrer">SafetyDrift</a></h3>
          <p>Independent research treats agent safety as a trajectory-level phenomenon in which plausible actions can accumulate toward unsafe behavior.</p>
          <p class="evidence-anchor"><strong>Connection:</strong> trajectory drift, accumulation, critical transition, and early-warning structure.</p>
        </article>
      </div>

      <div class="evidence-actions">
        <a class="button primary" href="../overlap/?track=ai">Open the 39-record AI evidence ledger</a>
        <a class="button secondary" href="external-convergence.json">Convergence evidence JSON</a>
        <a class="button secondary" href="../publications/recursive-ai-drift-audit.html">Recursive AI Drift audit</a>
      </div>
    `;

    const rules = document.querySelector('[aria-labelledby="rules-title"]');
    if (rules && rules.nextSibling) rules.parentNode.insertBefore(section, rules.nextSibling);
    else main.appendChild(section);
  };

  const simplifyAuditStrip = () => {
    const auditStrip = document.querySelector('.priority-head .audit-strip');
    if (!auditStrip) return;
    auditStrip.innerHTML = `
      <div><strong>22</strong><span>DOI-backed scholarly priority records</span></div>
      <div><strong>4</strong><span>filed patent families</span></div>
      <div><strong>181</strong><span>external evidence and convergence records</span></div>
      <div><strong>39</strong><span>AI-system evidence records</span></div>
    `;
  };

  const run = () => {
    const main = document.querySelector('.priority-shell');
    if (!main) return;

    installStyles();
    rewritePriorityCopy(main);
    simplifyAuditStrip();
    buildEvidence(main);
    improveLongSections();
    buildJumpNav(main);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();
})();
