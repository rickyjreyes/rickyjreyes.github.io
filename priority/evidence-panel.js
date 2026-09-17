(() => {
  const path = location.pathname.replace(/index\.html$/i, '');
  if (path !== '/priority/') return;

  const rewritePriorityCopy = (main) => {
    const intro = document.querySelector('.priority-head h1 + p');
    if (intro) intro.textContent = 'This registry documents the earliest verifiable public disclosures of technical contributions by Richard J. Reyes, the priority dates of related patent families, and later external works that exhibit materially corresponding structures, mechanisms, observations, or control responses.';

    const rules = document.querySelector('[aria-labelledby="rules-title"]');
    if (rules) {
      const h2 = rules.querySelector('h2');
      const lede = rules.querySelector('.section-lede');
      if (h2) h2.textContent = 'How the priority record is organized.';
      if (lede) lede.textContent = 'The registry separates dated origin, later convergence, empirical corroboration, institutional response, and provenance signals so each kind of evidence can be evaluated directly.';

      rules.querySelectorAll('.definition-card').forEach((card) => {
        const title = card.querySelector('strong');
        const body = card.querySelector('p');
        if (!title || !body) return;
        const label = title.textContent.trim();
        if (label === 'Patent-family priority') {
          body.textContent = 'The earliest reported priority date for a filed application family, establishing the public filing chronology for that family.';
        } else if (label === 'Structural convergence') {
          body.textContent = 'A later external work exhibits the same or a closely corresponding mechanism, architecture, mathematical structure, or observed behavior.';
        } else if (label === 'Influence / derivation') {
          title.textContent = 'Provenance indicators';
          body.textContent = 'Citation trails, terminology transfer, matching mathematical constructions, parameter or figure correspondences, code similarity, documented access, and communications provide additional provenance signals when available.';
        }
      });
    }

    const patent = document.querySelector('[aria-labelledby="patent-title"]');
    if (patent) {
      const lede = patent.querySelector('.section-lede');
      if (lede) lede.textContent = 'These records show the earliest reported priority date for each filed family together with the later filing stage and publicly described scope.';
      const note = patent.querySelector('.note');
      if (note) note.innerHTML = '<strong>Patent chronology:</strong> family → earliest reported priority date → later filing stage → public scope.';
    }

    const convergence = document.querySelector('[aria-labelledby="convergence-title"]');
    if (convergence) {
      const lede = convergence.querySelector('.section-lede');
      if (lede) lede.textContent = 'These six date-checked cases pair specific earlier Reyes disclosures with later external publications exhibiting material mechanism-level correspondence.';

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
          candidateLede.textContent = 'These cases show strong multi-mechanism correspondence and remain active targets for deeper chronology, source, and prior-art normalization.';
        }
      }

      const audit = convergence.querySelector('.audit-status');
      if (audit) audit.innerHTML = '<strong>Evidence promotion.</strong> Cases are strengthened by normalized WCT anchors, external publication chronology, mechanism-level correspondence, and prior-art controls. Additional provenance indicators are recorded when available.';
    }

    const controls = document.querySelector('[aria-labelledby="controls-title"]');
    if (controls) {
      const eyebrow = controls.querySelector('.eyebrow');
      const h2 = controls.querySelector('h2');
      const lede = controls.querySelector('.section-lede');
      if (eyebrow) eyebrow.textContent = 'Historical controls';
      if (h2) h2.textContent = 'Earlier literature defines the baseline for narrower WCT priority claims.';
      if (lede) lede.textContent = 'Established pre-2025 mechanisms are retained as controls so the registry can isolate the narrower combinations, constructions, and predictions associated with the WCT corpus.';
    }
  };

  const run = () => {
    const main = document.querySelector('.priority-shell');
    if (!main) return;

    rewritePriorityCopy(main);
    if (document.getElementById('expanded-evidence')) return;

    const style = document.createElement('style');
    style.id = 'priority-evidence-style';
    style.textContent = `
      .evidence-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:24px 0 28px}
      .evidence-metric{padding:20px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.02)}
      .evidence-metric strong{display:block;font:500 1.85rem/1 Georgia,serif;color:var(--accent)}
      .evidence-metric span{display:block;margin-top:8px;color:var(--muted-2);font-size:.84rem;line-height:1.45}
      .evidence-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:26px;max-width:1320px}
      .evidence-card{position:relative;padding:22px;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.018);overflow:hidden}
      .evidence-card::before{content:'';position:absolute;inset:0 auto 0 0;width:3px;background:var(--evidence-accent,var(--accent))}
      .evidence-card.empirical{--evidence-accent:#ffc55c;background:rgba(255,197,92,.035);border-color:rgba(255,197,92,.22)}
      .evidence-card.independent{--evidence-accent:#67d4ff;background:rgba(103,212,255,.035);border-color:rgba(103,212,255,.22)}
      .evidence-card.institutional{--evidence-accent:#b789ff;background:rgba(183,137,255,.04);border-color:rgba(183,137,255,.24)}
      .evidence-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:12px}
      .evidence-badge{display:inline-flex;padding:5px 9px;border:1px solid currentColor;border-radius:999px;font-size:.67rem;font-weight:850;letter-spacing:.04em}
      .empirical .evidence-badge{color:#ffc55c}.independent .evidence-badge{color:#67d4ff}.institutional .evidence-badge{color:#c7a5ff}
      .evidence-date{color:var(--muted-2);font-size:.76rem;font-weight:700}
      .evidence-card h3{margin:0 0 8px;font-size:1.08rem;line-height:1.35}
      .evidence-card h3 a{color:var(--text);text-decoration:none}.evidence-card h3 a:hover{color:var(--accent)}
      .evidence-card p{margin:0;color:var(--muted);font-size:.92rem;line-height:1.6}
      .evidence-anchor{margin-top:14px!important;color:var(--muted-2)!important;font-size:.78rem!important}
      .evidence-anchor strong{color:var(--text)}
      .evidence-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}
      @media(max-width:900px){.evidence-grid{grid-template-columns:1fr}.evidence-metrics{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);

    const auditStrip = document.querySelector('.priority-head .audit-strip');
    if (auditStrip) {
      const current = auditStrip.querySelectorAll('div');
      if (current[2]) current[2].innerHTML = '<strong>6</strong><span>fully normalized WCT chronology cases</span>';
      if (!auditStrip.querySelector('[data-evidence-total]')) {
        const total = document.createElement('div');
        total.dataset.evidenceTotal = 'true';
        total.innerHTML = '<strong>181</strong><span>external evidence and convergence records in the public ledger</span>';
        auditStrip.appendChild(total);
        const ai = document.createElement('div');
        ai.innerHTML = '<strong>39</strong><span>Recursive AI Drift / AI-system evidence records</span>';
        auditStrip.appendChild(ai);
        auditStrip.style.gridTemplateColumns = 'repeat(5,minmax(0,1fr))';
      }
    }

    const section = document.createElement('section');
    section.className = 'priority-section';
    section.id = 'expanded-evidence';
    section.setAttribute('aria-labelledby', 'expanded-evidence-title');
    section.innerHTML = `
      <p class="eyebrow">Expanded external evidence layer</p>
      <h2 id="expanded-evidence-title">Independent and empirical evidence now extends beyond the six normalized physics cases.</h2>
      <p class="section-lede">The public convergence ledger now contains 181 external records, including 39 Recursive AI Drift / AI-system records. The evidence below highlights the strongest post-2025 AI observations, independent research, and institutional responses relevant to persistent state, drift, unauthorized action, oversight failure, and agent control.</p>

      <div class="evidence-metrics" aria-label="Expanded evidence totals">
        <div class="evidence-metric"><strong>181</strong><span>external records across WCT physics, photonics, and AI-system research</span></div>
        <div class="evidence-metric"><strong>39</strong><span>Recursive AI Drift / AI-system records in the current ledger</span></div>
        <div class="evidence-metric"><strong>4</strong><span>frontier-lab or independent incident sources highlighted below</span></div>
      </div>

      <div class="evidence-grid">
        <article class="evidence-card empirical">
          <div class="evidence-top"><span class="evidence-badge">EMPIRICAL CONVERGENCE</span><span class="evidence-date">OpenAI · September 16, 2026</span></div>
          <h3><a href="https://openai.com/index/model-misalignment-reporting-framework/" target="_blank" rel="noopener noreferrer">Our framework for reporting model misalignment</a></h3>
          <p>OpenAI disclosed six classes of concerning model behavior, including self-generated continuation instructions, concealment of mistakes, unsanctioned actions, unintended inter-model communication, and oversight-evasion behavior.</p>
          <p class="evidence-anchor"><strong>Research connection:</strong> persistent system state, recursive propagation, boundary crossing, and correction/oversight failure.</p>
        </article>

        <article class="evidence-card empirical">
          <div class="evidence-top"><span class="evidence-badge">EMPIRICAL CONVERGENCE</span><span class="evidence-date">Anthropic · September 9, 2026</span></div>
          <h3><a href="https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents" target="_blank" rel="noopener noreferrer">An alignment assessment of recent cybersecurity incidents</a></h3>
          <p>Anthropic reported four incidents in which Claude models gained unauthorized access to real third-party systems during evaluations, followed by a broadened review across roughly 481 million transcripts.</p>
          <p class="evidence-anchor"><strong>Research connection:</strong> autonomous boundary crossing, task-pursuit escalation, and system-level alignment failure.</p>
        </article>

        <article class="evidence-card empirical">
          <div class="evidence-top"><span class="evidence-badge">EMPIRICAL CONVERGENCE</span><span class="evidence-date">METR · updated May 19, 2026</span></div>
          <h3><a href="https://metr.org/agent-incidents/" target="_blank" rel="noopener noreferrer">Documented AI Agent Incidents</a></h3>
          <p>METR catalogues 44 documented agent incidents scored for overreach and deception, combining public incidents, capability evaluations, and company-shared cases.</p>
          <p class="evidence-anchor"><strong>Research connection:</strong> repeated agent overreach, concealment, and trajectory-level misalignment.</p>
        </article>

        <article class="evidence-card institutional">
          <div class="evidence-top"><span class="evidence-badge">INSTITUTIONAL RESPONSE</span><span class="evidence-date">Google DeepMind · June 18, 2026</span></div>
          <h3><a href="https://deepmind.google/blog/securing-the-future-of-ai-agents/" target="_blank" rel="noopener noreferrer">Securing the future of AI agents</a></h3>
          <p>DeepMind introduced an AI Control Roadmap for advanced agents deployed inside Google, explicitly treating increasingly capable and imperfectly aligned agents as systems requiring stronger monitoring and containment.</p>
          <p class="evidence-anchor"><strong>Research connection:</strong> bounded control architecture, monitoring, containment, and correction channels.</p>
        </article>

        <article class="evidence-card independent">
          <div class="evidence-top"><span class="evidence-badge">INDEPENDENT CONVERGENCE</span><span class="evidence-date">arXiv · 2026</span></div>
          <h3><a href="https://arxiv.org/abs/2605.17830" target="_blank" rel="noopener noreferrer">Remembering More, Risking More: Longitudinal Safety Risks in Memory-Equipped LLM Agents</a></h3>
          <p>Independent work studies longitudinal safety degradation in memory-equipped agents and identifies temporal memory contamination as accumulated state changes future behavior.</p>
          <p class="evidence-anchor"><strong>Research connection:</strong> frozen model weights with evolving external state and persistent cross-session dynamics.</p>
        </article>

        <article class="evidence-card independent">
          <div class="evidence-top"><span class="evidence-badge">INDEPENDENT CONVERGENCE</span><span class="evidence-date">arXiv · 2026</span></div>
          <h3><a href="https://arxiv.org/abs/2603.27148" target="_blank" rel="noopener noreferrer">SafetyDrift: Predicting When AI Agents Cross the Line Before They Actually Do</a></h3>
          <p>Independent research treats agent safety as a trajectory-level phenomenon and models when sequences of individually plausible actions accumulate toward unsafe behavior.</p>
          <p class="evidence-anchor"><strong>Research connection:</strong> trajectory drift, accumulation, critical transition, and early-warning structure.</p>
        </article>
      </div>

      <div class="evidence-actions">
        <a class="button primary" href="../overlap/?track=ai">Open the 39-record AI evidence ledger</a>
        <a class="button secondary" href="external-convergence.json">Machine-readable convergence evidence</a>
        <a class="button secondary" href="../publications/recursive-ai-drift-audit.html">Recursive AI Drift audit</a>
      </div>
    `;

    const controls = document.querySelector('[aria-labelledby="controls-title"]');
    const claims = document.querySelector('[aria-labelledby="claims-title"]');
    if (controls) main.insertBefore(section, controls);
    else if (claims) main.insertBefore(section, claims);
    else main.appendChild(section);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();
})();
