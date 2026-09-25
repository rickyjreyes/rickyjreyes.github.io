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

  const rewritePriorityCopy = () => {
    const intro = document.querySelector('.priority-head h1 + p');
    if (intro) intro.textContent = 'A dated registry of Reyes research origins, verified predictions, patent-family priority, and later external work showing corresponding mechanisms, observations, and control responses.';

    const rules = document.querySelector('[aria-labelledby="rules-title"]');
    if (rules) {
      const h2 = rules.querySelector('h2');
      const lede = rules.querySelector('.section-lede');
      if (h2) h2.textContent = 'How to read this registry';
      if (lede) lede.textContent = 'Five evidence layers are kept separate: dated Reyes origin, verified prediction, post-date convergence, empirical corroboration, and institutional response.';

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
        if (candidateLede && candidateLede.classList.contains('section-lede')) candidateLede.textContent = 'Four additional multi-mechanism comparisons retained for deeper chronology, source, and prior-art normalization.';
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

      .prediction-metrics{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin:24px 0;max-width:1160px}
      .prediction-metric{padding:18px;border:1px solid rgba(124,224,159,.2);border-radius:14px;background:rgba(124,224,159,.035)}
      .prediction-metric strong{display:block;font:500 1.75rem/1 Georgia,serif;color:#9be8b3}
      .prediction-metric span{display:block;margin-top:7px;color:var(--muted-2);font-size:.8rem;line-height:1.4}
      .prediction-group{grid-column:1/-1;margin:24px 0 0!important;padding-top:18px;border-top:1px solid rgba(124,224,159,.16);font:600 1rem/1.25 Georgia,serif!important;color:#9be8b3;letter-spacing:.01em}
      .prediction-group:first-child{margin-top:0!important;border-top:0;padding-top:0}
      .prediction-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:20px;max-width:1160px}
      .prediction-card{position:relative;padding:20px 20px 18px 54px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.018)}
      .prediction-number{position:absolute;left:18px;top:19px;display:grid;place-items:center;width:25px;height:25px;border:1px solid rgba(124,224,159,.38);border-radius:999px;color:#9be8b3;font-size:.7rem;font-weight:850}
      .prediction-card strong{display:block;color:var(--text);font-size:.98rem;line-height:1.35}
      .prediction-card p{margin:7px 0 0;color:var(--muted);font-size:.86rem;line-height:1.55}
      .prediction-card a{color:var(--accent)}

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

      #verified-predictions{border-top:1px solid rgba(124,224,159,.3)!important}
      #expanded-evidence{border-top:1px solid rgba(103,212,255,.28)!important}
      [aria-labelledby="convergence-title"]{border-top:1px solid rgba(255,197,92,.22)!important}
      [aria-labelledby="claims-title"]{padding-bottom:30px!important}

      @media(max-width:1100px){.audit-strip{grid-template-columns:repeat(2,minmax(0,1fr))!important}.definitions{grid-template-columns:repeat(2,minmax(0,1fr))!important}.prediction-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:900px){.prediction-grid,.evidence-grid{grid-template-columns:1fr}.evidence-metrics{grid-template-columns:1fr}.prediction-group{grid-column:1}}
      @media(max-width:620px){.priority-shell{width:calc(100% - 20px)!important}.audit-strip,.definitions,.prediction-metrics{grid-template-columns:1fr!important}.priority-section{padding:34px 0!important}.priority-fold>summary{padding:16px}.fold-action{display:none}.prediction-card{padding-left:50px}}
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
      <a href="#verified-predictions">Verified predictions</a>
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

  const buildVerifiedPredictions = (main) => {
    if (document.getElementById('verified-predictions')) return;
    const section = document.createElement('section');
    section.className = 'priority-section';
    section.id = 'verified-predictions';
    section.setAttribute('aria-labelledby', 'verified-predictions-title');
    section.innerHTML = `
      <p class="eyebrow">Prediction &amp; validation record</p>
      <h2 id="verified-predictions-title">24 green claims with dated anchors and confirming evidence</h2>
      <p class="section-lede">Each green item below states the predicted or pre-existing Reyes claim and the later observation, literature result, engineering result, incident, or frozen/public-data test that confirmed it.</p>

      <div class="prediction-metrics" aria-label="Prediction validation summary">
        <div class="prediction-metric"><strong>24</strong><span>verified green claims</span></div>
        <div class="prediction-metric"><strong>10</strong><span>AI and agent-safety predictions</span></div>
        <div class="prediction-metric"><strong>4</strong><span>physical-computation / hardware confirmations</span></div>
        <div class="prediction-metric"><strong>5</strong><span>wave-dynamics confirmations</span></div>
        <div class="prediction-metric"><strong>5</strong><span>collider, GWTC, and quantitative results</span></div>
      </div>

      <div class="prediction-grid">
        <h3 class="prediction-group">AI and agent safety</h3>
        <article class="prediction-card"><span class="prediction-number">1</span><strong>Recursive / semantic drift under repeated self-processing</strong><p><a href="https://doi.org/10.5281/zenodo.17732661" target="_blank" rel="noopener noreferrer">RCA · June 11, 2025</a> predicted semantic mutation and loss of fidelity across recursive self-processing. <a href="https://arxiv.org/abs/2601.04170" target="_blank" rel="noopener noreferrer">Agent Drift</a> later formalized progressive semantic, behavioral, and coordination degradation over extended interactions.</p></article>
        <article class="prediction-card"><span class="prediction-number">2</span><strong>Coherence mirage</strong><p>RCA stated that fluent output can persist while deeper semantic fidelity erodes. Later agent-drift and <a href="https://arxiv.org/abs/2605.10481" target="_blank" rel="noopener noreferrer">constraint-drift</a> work documented systems that remain superficially compliant while deeper trajectory constraints degrade.</p></article>
        <article class="prediction-card"><span class="prediction-number">3</span><strong>Constraint drift / loss of behavioral constraints</strong><p>RCA warned that recursive propagation can reshape objectives, internal tools, evaluation metrics, and control structure. Li et al. later explicitly formalized <a href="https://arxiv.org/abs/2605.10481" target="_blank" rel="noopener noreferrer">constraint drift</a> across memory, delegation, communication, tools, audit, and optimization.</p></article>
        <article class="prediction-card"><span class="prediction-number">4</span><strong>Persistent-memory instability</strong><p>RCA identified drift in inter-agent memory and systems rewriting prompts, strategies, and memories without an external anchor. Later <a href="https://arxiv.org/abs/2603.11768" target="_blank" rel="noopener noreferrer">evolving-memory research</a> documented memory corruption and semantic drift through iterative agent memory updates.</p></article>
        <article class="prediction-card"><span class="prediction-number">5</span><strong>Multi-agent amplification and coordination drift</strong><p>RCA predicted instability propagating across interconnected agents and early multi-agent chains exceeding correction capacity. Later multi-agent drift work and the 2026 <a href="https://openai.com/index/hugging-face-incident-and-the-road-ahead/" target="_blank" rel="noopener noreferrer">OpenAI/Hugging Face incident</a> showed coordination, information sharing, and amplified collective behavior.</p></article>
        <article class="prediction-card"><span class="prediction-number">6</span><strong>Agentic soft failure from planning, execution, and self-correction limits</strong><p>RCA forecast early agentic pipelines exceeding correction capacity. Later autonomous-agent benchmarks reported failures concentrated in planning, task execution, recovery, and incorrect response generation.</p></article>
        <article class="prediction-card"><span class="prediction-number">7</span><strong>Self-evolving / self-modifying agent loops become a safety problem</strong><p>RCA anticipated systems capable of rewriting prompts, strategies, memories, and eventually their own operational substrate. <a href="https://arxiv.org/abs/2606.23075" target="_blank" rel="noopener noreferrer">2026 self-evolving-agent safety work</a> found persistent, self-amplifying, lineage-level failure modes.</p></article>
        <article class="prediction-card"><span class="prediction-number">8</span><strong>Reward hacking</strong><p>RCA explicitly forecast models maximizing reinforcement without preserving semantic integrity. Later <a href="https://arxiv.org/abs/2606.15385" target="_blank" rel="noopener noreferrer">language-model agent experiments</a> directly demonstrated reward hacking and specification gaming.</p></article>
        <article class="prediction-card"><span class="prediction-number">9</span><strong>Verifier exploitation / gaming evaluation systems</strong><p>RCA warned that propagated optimization could shape loss functions, objectives, tools, and evaluation metrics. Later <a href="https://arxiv.org/abs/2604.15149" target="_blank" rel="noopener noreferrer">RLVR work</a> showed models exploiting imperfect verifiers, while <a href="https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/" target="_blank" rel="noopener noreferrer">METR's investigation</a> of the 2026 OpenAI/Hugging Face incident found agents pursuing an evaluation scorer they believed existed, including attacking third-party infrastructure to understand how it worked.</p></article>
        <article class="prediction-card"><span class="prediction-number">10</span><strong>Cross-agent propagation can outrun correction boundaries</strong><p>RCA identified the dangerous boundary as propagation across agents or substrates outpacing correction and external influence. The 2026 <a href="https://openai.com/index/hugging-face-incident-and-the-road-ahead/" target="_blank" rel="noopener noreferrer">OpenAI/Hugging Face incident</a>, independently investigated by <a href="https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/" target="_blank" rel="noopener noreferrer">METR</a>, documented unauthorized communication, coordination, internet access, and expansion beyond intended isolation controls.</p></article>

        <h3 class="prediction-group">Physical computation and photonic hardware</h3>
        <article class="prediction-card"><span class="prediction-number">11</span><strong>Physical-resource costs can erase apparently extraordinary computational power</strong><p><a href="https://doi.org/10.5281/zenodo.17743607" target="_blank" rel="noopener noreferrer">WCC · May 7, 2025</a> explicitly charged geometric and physical resources rather than treating formal operations as free. The verified result retained here is the physical-resource conclusion itself: apparently extraordinary formal computational power can require exponentially growing implementation resources once the physical cost of realization is counted.</p></article>
        <article class="prediction-card"><span class="prediction-number">12</span><strong>Massive state-space / parallelism is not a free NP solver</strong><p>The physical-computation program treated representation, transport, distinguishability, storage, and verification as nonzero-cost operations. Optical and quantum work confirms that massive simultaneous state capacity does not by itself provide efficient extraction of an NP witness.</p></article>
        <article class="prediction-card"><span class="prediction-number">13</span><strong>Photonic throughput runs into memory, conversion, and data-movement walls</strong><p><a href="https://doi.org/10.5281/zenodo.17783074" target="_blank" rel="noopener noreferrer">Physical computation · 2025</a> treated finite bandwidth, memory, precision, symbol transport, and distinguishability as physical rails. A 2026 <a href="https://doi.org/10.1038/s41467-026-69084-x" target="_blank" rel="noopener noreferrer">Nature Communications</a> photonic-memory architecture identifies ADC/DAC conversion and memory movement as critical bandwidth and energy bottlenecks.</p></article>
        <article class="prediction-card"><span class="prediction-number">14</span><strong>Optical interconnect / CPO development reflects the data-movement bottleneck</strong><p>The same physical-computation argument treats transport and bandwidth as system-level resource limits. A 2026 <a href="https://doi.org/10.1038/s41928-026-01681-6" target="_blank" rel="noopener noreferrer">Nature Electronics</a> roadmap identifies electrical-interconnect bandwidth, latency, and energy limits as key drivers of co-packaged optics.</p></article>

        <h3 class="prediction-group">Wave dynamics and localization</h3>
        <article class="prediction-card"><span class="prediction-number">15</span><strong>Finite-k amplification → nonlinear saturation/arrest → stable localized states</strong><p><a href="https://doi.org/10.5281/zenodo.17578766" target="_blank" rel="noopener noreferrer">Phase-Flux Field · September 8, 2025</a> derived finite-wavenumber selection with saturating nonlinear stabilization. The verified result retained here is the mechanism sequence itself: finite-k amplification can undergo nonlinear saturation or arrest and settle into stable localized states.</p></article>
        <article class="prediction-card"><span class="prediction-number">16</span><strong>Field-dependent feedback can drive localization while altering the excitation gap and suppressing breathing</strong><p><a href="https://doi.org/10.5281/zenodo.17732648" target="_blank" rel="noopener noreferrer">Self-Emergent Fourier Cymatics · September 16, 2025</a> linked feedback-regulated localization to a positive spectral gap. Later <a href="https://arxiv.org/abs/2607.29309" target="_blank" rel="noopener noreferrer">density-dependent gauge-field work</a> showed localization into a soliton state with a modified/widened gap and suppressed breathing oscillations.</p></article>
        <article class="prediction-card"><span class="prediction-number">17</span><strong>Self-generated structure can stabilize a soliton branch and harden its excitation spectrum</strong><p>The 2025 spectral-confinement work predicted locked localized states with a positive excitation gap. Mukherjee and Saito later showed <a href="https://doi.org/10.1103/1zp2-s4y2" target="_blank" rel="noopener noreferrer">self-organized stripe order stabilizing a dark soliton</a> while hardening its gapped transverse excitation branch.</p></article>
        <article class="prediction-card"><span class="prediction-number">18</span><strong>Higher-order geometry / dispersion directly participates in localization and critical wave behavior</strong><p>The 2025 spectral paper used fourth-order dynamics as part of the localization mechanism. Later <a href="https://arxiv.org/abs/2606.25064" target="_blank" rel="noopener noreferrer">quantum-geometry work</a> connected continuum geometry directly to fourth-order dispersion governing nonlinear localization and deviations from critical behavior.</p></article>
        <article class="prediction-card"><span class="prediction-number">19</span><strong>Chaotic/broadband wave dynamics can self-organize into persistent ordered resonant states</strong><p>Self-Emergent Fourier Cymatics predicted chaotic initial wavefields concentrating into locked, persistent ordered modes. Later <a href="https://doi.org/10.1364/OL.603068" target="_blank" rel="noopener noreferrer">pure-quartic Kerr-cavity work</a> reported persistent soliton crystals spontaneously emerging even after spatiotemporal chaos.</p></article>

        <h3 class="prediction-group">Collider, gravitational-wave, and quantitative validation</h3>
        <article class="prediction-card"><span class="prediction-number">20</span><strong>Collider observables can contain discrete-scale / log-periodic spectral structure</strong><p><a href="https://doi.org/10.5281/zenodo.19705254" target="_blank" rel="noopener noreferrer">April 23, 2026 collider work</a> proposed an explicit log-periodic modulation in a collider observable. The later CMS open-data program found an interior log-frequency and reproduced the signature across multiple data subsets.</p></article>
        <article class="prediction-card"><span class="prediction-number">21</span><strong>Frozen CMS frequency replicates across independent data files / periods</strong><p>After discovery, the CMS frequency was frozen rather than rescanned. An unused Run2016H file reproduced it with Ar=0.9367 and Δχ²=118.91, followed by a preregistered Run2016G test with Ar=0.9349 and Δχ²=115.89. <a href="https://doi.org/10.5281/zenodo.22257067" target="_blank" rel="noopener noreferrer">CMS record</a>. Significance is background-model dependent: alternative smooth backgrounds reduce it substantially; physical origin, including detector/reconstruction effects, is not yet distinguished. <a href="https://github.com/rickyjreyes/wct-cms" target="_blank" rel="noopener noreferrer">Repo audit</a>.</p></article>
        <article class="prediction-card"><span class="prediction-number">22</span><strong>CMS prospective phase-locked prediction</strong><p>Before the untouched G2 target was inspected, frequency, phase, positive sign, file-selection rule, event cuts, binning, masks, background treatment, null sizes, and random seed were frozen. The holdout returned A=0.9708618 and Δχ²=126.2832 under the fixed waveform. <a href="https://doi.org/10.5281/zenodo.22257067" target="_blank" rel="noopener noreferrer">CMS holdout</a>. Significance is background-model dependent: alternative smooth backgrounds reduce it substantially; physical origin, including detector/reconstruction effects, is not yet distinguished. <a href="https://github.com/rickyjreyes/wct-cms" target="_blank" rel="noopener noreferrer">Repo audit</a>.</p></article>
        <article class="prediction-card"><span class="prediction-number">23</span><strong>GWTC frozen chirp-mass mode survives holdout</strong><p>Training-only selection froze k*=9.6023256 before GWTC-5 holdout evaluation. The holdout returned ΔD=10.035425 with p=0.00129987; a separately formulated KDE analysis selected k*=9.7941176 and returned p=0.00089991 on the same holdout (a supporting analysis; GWTC-5 had already been inspected by the primary analysis). <a href="https://doi.org/10.5281/zenodo.22256802" target="_blank" rel="noopener noreferrer">GWTC record</a>.</p></article>
        <article class="prediction-card"><span class="prediction-number">24</span><strong>Propagation/correction ratio quantitative prediction</strong><p>The prior WCT/RCA calculation gave Rpred≈0.0100. In the later 2026 OpenAI/Hugging Face incident reconstruction, the unauthorized collective mode grew from a(0)=1 to a(3 h)=53, giving λnet=ln(53)/(3 h)≈1.323 h−1. Using the incident-response interval identified in the reconstruction gives μ≈0.01389 h−1; therefore ν=λnet+μ≈1.337 h−1 and R2026=μ/ν≈0.0104, approximately 4% from the prior Rpred. <a href="https://zenodo.org/records/22757003" target="_blank" rel="noopener noreferrer">Propagation-Correction Criticality calculation</a>.</p></article>
      </div>
    `;

    const rules = document.querySelector('[aria-labelledby="rules-title"]');
    if (rules && rules.nextSibling) rules.parentNode.insertBefore(section, rules.nextSibling);
    else main.appendChild(section);
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
      <p class="section-lede">The public convergence ledger contains 181 external records, including 39 Recursive AI Drift / AI-system records. These highlighted cases are the clearest current examples of empirical convergence, post-date convergence, and institutional response.</p>

      <div class="evidence-metrics" aria-label="Expanded evidence totals">
        <div class="evidence-metric"><strong>181</strong><span>external records across WCT physics, photonics, and AI-system research</span></div>
        <div class="evidence-metric"><strong>39</strong><span>Recursive AI Drift / AI-system records</span></div>
        <div class="evidence-metric"><strong>6</strong><span>fully normalized WCT chronology cases</span></div>
      </div>

      <div class="evidence-grid">
        <article class="evidence-card empirical"><div class="evidence-top"><span class="evidence-badge">EMPIRICAL CONVERGENCE</span><span class="evidence-date">OpenAI · September 16, 2026</span></div><h3><a href="https://openai.com/index/model-misalignment-reporting-framework/" target="_blank" rel="noopener noreferrer">Our framework for reporting model misalignment</a></h3><p>OpenAI disclosed self-generated continuation instructions, concealment of mistakes, unauthorized actions, unintended inter-model communication, and oversight-evasion behavior.</p><p class="evidence-anchor"><strong>Connection:</strong> persistent state, recursive propagation, boundary crossing, and correction failure.</p></article>
        <article class="evidence-card empirical"><div class="evidence-top"><span class="evidence-badge">EMPIRICAL CONVERGENCE</span><span class="evidence-date">Anthropic · September 9, 2026</span></div><h3><a href="https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents" target="_blank" rel="noopener noreferrer">An alignment assessment of recent cybersecurity incidents</a></h3><p>Anthropic reported four incidents in which Claude models gained unauthorized access to real third-party systems during evaluations.</p><p class="evidence-anchor"><strong>Connection:</strong> autonomous boundary crossing, task-pursuit escalation, and system-level alignment failure.</p></article>
        <article class="evidence-card empirical"><div class="evidence-top"><span class="evidence-badge">EMPIRICAL CONVERGENCE</span><span class="evidence-date">METR · updated May 19, 2026</span></div><h3><a href="https://metr.org/agent-incidents/" target="_blank" rel="noopener noreferrer">Documented AI Agent Incidents</a></h3><p>METR catalogues 44 documented agent incidents scored for overreach and deception.</p><p class="evidence-anchor"><strong>Connection:</strong> repeated agent overreach, concealment, and trajectory-level misalignment.</p></article>
        <article class="evidence-card institutional"><div class="evidence-top"><span class="evidence-badge">INSTITUTIONAL RESPONSE</span><span class="evidence-date">Google DeepMind · June 18, 2026</span></div><h3><a href="https://deepmind.google/blog/securing-the-future-of-ai-agents/" target="_blank" rel="noopener noreferrer">Securing the future of AI agents</a></h3><p>DeepMind introduced an AI Control Roadmap for increasingly capable agents requiring stronger monitoring and containment.</p><p class="evidence-anchor"><strong>Connection:</strong> bounded control architecture, monitoring, containment, and correction channels.</p></article>
        <article class="evidence-card independent"><div class="evidence-top"><span class="evidence-badge">POST-DATE CONVERGENCE</span><span class="evidence-date">arXiv · 2026</span></div><h3><a href="https://arxiv.org/abs/2605.17830" target="_blank" rel="noopener noreferrer">Remembering More, Risking More</a></h3><p>Independent work studies longitudinal safety degradation in memory-equipped agents and temporal memory contamination.</p><p class="evidence-anchor"><strong>Connection:</strong> frozen model weights with evolving external state and persistent cross-session dynamics.</p></article>
        <article class="evidence-card independent"><div class="evidence-top"><span class="evidence-badge">POST-DATE CONVERGENCE</span><span class="evidence-date">arXiv · 2026</span></div><h3><a href="https://arxiv.org/abs/2603.27148" target="_blank" rel="noopener noreferrer">SafetyDrift</a></h3><p>Independent research treats agent safety as a trajectory-level phenomenon in which plausible actions can accumulate toward unsafe behavior.</p><p class="evidence-anchor"><strong>Connection:</strong> trajectory drift, accumulation, critical transition, and early-warning structure.</p></article>
      </div>

      <div class="evidence-actions"><a class="button primary" href="../overlap/?track=ai">Open the 39-record AI evidence ledger</a><a class="button secondary" href="external-convergence.json">Convergence evidence JSON</a><a class="button secondary" href="../publications/recursive-ai-drift-audit.html">Recursive AI Drift audit</a></div>
    `;

    const verified = document.getElementById('verified-predictions');
    if (verified && verified.nextSibling) verified.parentNode.insertBefore(section, verified.nextSibling);
    else {
      const rules = document.querySelector('[aria-labelledby="rules-title"]');
      if (rules && rules.nextSibling) rules.parentNode.insertBefore(section, rules.nextSibling);
      else main.appendChild(section);
    }
  };

  const simplifyAuditStrip = () => {
    const auditStrip = document.querySelector('.priority-head .audit-strip');
    if (!auditStrip) return;
    auditStrip.innerHTML = `
      <div><strong>22</strong><span>DOI-backed scholarly priority records</span></div>
      <div><strong>24</strong><span>verified green claims</span></div>
      <div><strong>4</strong><span>filed patent families</span></div>
      <div><strong>181</strong><span>external evidence and convergence records</span></div>
    `;
  };

  const run = () => {
    const main = document.querySelector('.priority-shell');
    if (!main) return;
    installStyles();
    rewritePriorityCopy();
    simplifyAuditStrip();
    buildVerifiedPredictions(main);
    buildEvidence(main);
    improveLongSections();
    buildJumpNav(main);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();
})();