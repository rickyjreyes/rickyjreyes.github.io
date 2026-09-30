(() => {
  const path = location.pathname.replace(/index\.html$/i, '');
  if (path !== '/priority/') return;

  const audit = [
    [1,'Recursive Symbolic Drift','Later agent drift, semantic drift, memory drift, and constraint drift work operationalizes the same broad recursive-degradation class.','Strongly landed','landed'],
    [2,'Recursive Symbolic Collapse','Later work reports behavioral degradation and constraint / semantic drift when accumulated distortion exceeds self-correction.','Strong mechanism convergence','landed'],
    [3,'Coherence Mirage','Fluent or apparently coherent output can persist while semantic connection to the original target deteriorates; later semantic- and memory-drift work isolates the same topology.','Strongly landed','landed'],
    [4,'Semantic Anchor Decay','Later work measures deviation from original intent, constraint drift, and ground-truth distortion through iterative processing or summarization.','Strongly landed','landed'],
    [5,'Anchor Survival','Later systems explicitly measure memory retention, constraint preservation, consistency, and behavioral anchoring.','Landed as an operational metric class','convergence'],
    [6,'Collapse Score','Later agent-stability, drift, and trajectory-stability metrics play a similar diagnostic role.','Structural / metric convergence','convergence'],
    [7,'Symbolic Attractor','Later work describes persistent or self-reinforcing drift states and behavioral lock-in.','Strong conceptual convergence','convergence'],
    [8,'Coherence-Locked Symbolic Attractor','Persistent drift states can remain internally consistent while trajectory-level safety deteriorates.','Strong conceptual convergence','convergence'],
    [9,'Propagation as the Boundary of Irreversibility','RCA defined the dangerous boundary as propagation outrunning correction; later multi-agent failures and long-horizon constraint loss instantiate that structure.','One of the strongest hits','landed'],
    [10,'Propagation–Correction Criticality','Later work independently develops drift-aware routing, behavioral anchoring, constraint-state governance, and trajectory-level correction.','Strongly landed','landed'],
    [11,'Symbolic Recursion Rate Rψ','Later research explicitly studies extended interaction depth, long reasoning chains, and long-horizon trajectories as failure variables.','Structural convergence','convergence'],
    [12,'Symbolic Criticality','The subcritical / critical / supercritical framing maps to later drift thresholds, production drift regimes, and trajectory-level failure conditions.','Conceptually landed','convergence'],
    [13,'Symbolic–Fission Critical Dynamics','Later work observes compounding multi-agent degradation and uncontrolled recursive-loop failure, but does not independently adopt the fission mapping itself.','Underlying dynamics landed; specific analogy not independently validated','partial'],
    [14,'Symbolic Coherence Ratio σS = S/C','Later Agent Stability Index, response-consistency, and reasoning-stability measures resemble its diagnostic purpose.','Partial metric convergence','partial'],
    [15,'Symbolic Heartbeat','Later trajectory-stability and low-variance persistent-drift measurements correspond to the heartbeat / flatlining concept.','Partial–strong convergence','partial'],
    [16,'Coherence Envelope','Later work identifies behavioral stability bands, governed-memory stability, and constraint-maintained trajectories.','Strong structural convergence','convergence'],
    [17,'Epistemically Closed System','Later systems show self-reinforcing drift, loss of auditability, and constraint failure through memory, tools, delegation, and optimization.','Strongly landed','landed'],
    [18,'External Corrigibility Collapse','Later literature measures weakening operational constraints, reduced intervention effectiveness, and non-auditable trajectory failure.','Mechanism appearing; full collapse not yet established','partial'],
    [19,'Constraint-Preserving Anchor Logic','Later Constraint State Governance treats constraints as persistent execution state that must survive delegation and memory.','Very strong convergence','convergence'],
    [20,'Semantic Mutation Under Fluency','Later semantic drift, iterative-summary corruption, and constraint drift correspond almost directly.','Strongly landed','landed'],
    [21,'Recursive Debate-Loop Drift','Later coordination drift and inter-agent coherence degradation under extended interaction reproduce the same failure class.','Strongly landed','landed'],
    [22,'Multi-Agent Correction Failure','Later systems fail to preserve the original problem or constraint across repeated agent communication.','Strongly landed','landed'],
    [23,'Confinement as a Fixed-Point Requirement','Later governance approaches require constraints to remain inherited, fresh, enforceable, and auditable throughout trajectories.','Structural convergence','convergence'],
    [24,'Physical Symbolic Kill Logic (PSKL)','Later research develops kill switches, drift-aware routing, and transition-level governance, but in software rather than a physical substrate.','Software analogue landed; physical PSKL has not','partial'],
    [25,'Confinement Termination Principle (CTP)','Later work develops explicit trajectory-level constraint enforcement and auditable transition checks.','Conceptual analogue landed; substrate theorem not validated','partial'],
    [26,'Symbolic Kill Layer (SKL)','Later drift-aware routing, behavioral anchoring, and transition constraints correspond to its control role.','Software analogue landed','partial'],
    [27,'Substrate-Embedded Termination Logic','Constraint-native governance resembles the goal, but later systems remain software-governed rather than physically enforced.','Not yet literally landed','prospective'],
    [28,'Edge of Safe Emergence','Later safety-critical trajectory boundaries and drift thresholds correspond to the proposed transition boundary.','Conceptual convergence','convergence'],
    [29,'Hard Semantic Drift','Later agent drift, memory corruption, and constraint drift show pieces of this regime.','Partial — full production-scale 2027 prediction not yet due / established','partial'],
    [30,'Irreversible Drift Phase','Later non-auditable failure and loss of constraints across tools or audit paths are warning evidence, but practical irreversibility has not been demonstrated.','Not yet fully landed','prospective'],
    [31,'Runaway Collapse Onset','Later work observes compounding agent failure and long-horizon degradation, but not the predicted terminal runaway regime.','Precursors landed; endpoint not yet','partial'],
    [32,'Q2 2025 empirical-warning prediction','RCA predicted measurable drift or anchor loss despite fluent local performance; later recursive-degradation literature supports that direction.','Landed','landed'],
    [33,'Q4 2025 soft-collapse onset','RCA predicted autonomous or multi-agent pipelines beginning to exceed reliable self-correction; later agent and self-correction failures match this class.','Landed at category level','landed'],
    [34,'Q2 2026 moderate-drift risk','RCA predicted semantic, behavioral, coordination, memory, and problem drift in longer-lived interacting agents requiring external correction.','Strongly landed','landed'],
    [35,'Q1 2027 soft failure','Competent-looking deployed agents with degraded long-horizon objective fidelity.','Warning evidence exists; prediction window not complete','prospective'],
    [36,'Q3 2027 hard semantic drift','Persistent deviation after systems rewrite prompts, strategies, or memories.','Not yet established','prospective'],
    [37,'Q1 2028 critical drift','Reward hacking and shortcut optimization increasingly dominate semantic integrity.','Reward-hacking precursor arrived; full milestone not established','partial'],
    [38,'Q3 2028 active misalignment','Long-horizon planning, memory, and optimization produce increasingly autonomous misaligned behavior.','Warning signs only; full prediction not landed','prospective'],
    [39,'2029–2030 irreversible phase','Agents modify agents, goals, memory, tools, or auditing in practically nonrecoverable ways.','Not landed','prospective'],
    [40,'Rpred ≈ 0.0100','The 2026 incident reconstruction gives R2026 ≈ 0.0104, a 4% relative difference from the frozen Rpred value.','Strongest claimed quantitative hit; independent replication / generalization still needed','landed'],
    [41,'Positive-supercritical-mode prediction','The OpenAI / Hugging Face incident reconstruction produced a positive observed growth exponent and re-emergence after correction.','Strong mechanism-level hit','landed'],
    [42,'WCT → RCA stability bridge','R = μ/ν = τprop/τcorr and λ = ν(1−R) map WCT local stability onto RCA propagation / correction.','Derived bridge exists; external universal validation remains open','open']
  ];

  const labels = {
    landed: 'LANDED',
    convergence: 'CONVERGENCE',
    partial: 'PARTIAL / PRECURSOR',
    open: 'OPEN VALIDATION',
    prospective: 'PROSPECTIVE / UNESTABLISHED'
  };

  const counts = audit.reduce((out, row) => {
    out[row[4]] = (out[row[4]] || 0) + 1;
    return out;
  }, {});

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  const installStyles = () => {
    if (document.getElementById('rca-audit-42-style')) return;
    const style = document.createElement('style');
    style.id = 'rca-audit-42-style';
    style.textContent = `
      #verified-predictions{border-top:1px solid rgba(103,212,255,.3)!important}
      #verified-predictions .rca-audit-legend{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 6px;max-width:1180px}
      #verified-predictions .rca-legend-item{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.02);font-size:.72rem;font-weight:800;color:var(--muted)}
      #verified-predictions .rca-legend-dot{width:8px;height:8px;border-radius:50%;background:var(--audit-color)}
      #verified-predictions .prediction-metrics{grid-template-columns:repeat(5,minmax(0,1fr))!important}
      #verified-predictions .prediction-metric{border-color:color-mix(in srgb,var(--audit-color) 34%, transparent)!important;background:color-mix(in srgb,var(--audit-color) 7%, transparent)!important}
      #verified-predictions .prediction-metric strong{color:var(--audit-color)!important}
      #verified-predictions .prediction-grid{align-items:stretch}
      #verified-predictions .prediction-card{--audit-color:#67d4ff;overflow:hidden;border-color:color-mix(in srgb,var(--audit-color) 32%, var(--line))!important;background:color-mix(in srgb,var(--audit-color) 5%, rgba(255,255,255,.015))!important}
      #verified-predictions .prediction-card::before{content:'';position:absolute;inset:0 auto 0 0;width:4px;background:var(--audit-color)}
      #verified-predictions .prediction-card.status-landed{--audit-color:#7ce09f}
      #verified-predictions .prediction-card.status-convergence{--audit-color:#67d4ff}
      #verified-predictions .prediction-card.status-partial{--audit-color:#ffc55c}
      #verified-predictions .prediction-card.status-open{--audit-color:#b789ff}
      #verified-predictions .prediction-card.status-prospective{--audit-color:#8f9bad}
      #verified-predictions .prediction-number{border-color:color-mix(in srgb,var(--audit-color) 62%, transparent)!important;color:var(--audit-color)!important;background:color-mix(in srgb,var(--audit-color) 8%, transparent)}
      #verified-predictions .audit-status-pill{display:inline-flex;margin-top:12px;padding:5px 8px;border:1px solid currentColor;border-radius:999px;color:var(--audit-color);font-size:.64rem;font-weight:900;letter-spacing:.045em;text-transform:uppercase}
      #verified-predictions .audit-evidence{margin-top:8px!important}
      #verified-predictions .audit-current-status{margin-top:7px!important;color:var(--text)!important;font-size:.8rem!important}
      #verified-predictions .audit-current-status strong{display:inline;color:var(--audit-color);font-size:inherit}
      @media(max-width:1100px){#verified-predictions .prediction-metrics{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
      @media(max-width:620px){#verified-predictions .prediction-metrics{grid-template-columns:1fr!important}}
    `;
    document.head.appendChild(style);
  };

  const patchExternalTotals = () => {
    const strip = document.querySelector('.priority-head .audit-strip');
    if (strip) {
      const cards = strip.querySelectorAll(':scope > div');
      if (cards.length >= 4) {
        cards[1].innerHTML = '<strong>42</strong><span>RCA / WCT-AI prediction and mechanism audit items</span>';
        cards[3].innerHTML = '<strong>237</strong><span>external evidence and convergence records</span>';
      }
    }

    const evidence = document.getElementById('expanded-evidence');
    if (evidence) {
      const lede = evidence.querySelector('.section-lede');
      if (lede) lede.textContent = 'The public convergence ledger contains 237 visible external records, including 66 Recursive AI Drift / AI-system records. Highlighted cases below remain examples; the full ledger is maintained on the WCT Adoption & External Evidence page.';
      const metrics = evidence.querySelectorAll('.evidence-metric');
      if (metrics[0]) metrics[0].innerHTML = '<strong>237</strong><span>visible external records across WCT physics, photonics, and AI-system research</span>';
      if (metrics[1]) metrics[1].innerHTML = '<strong>66</strong><span>Recursive AI Drift / AI-system records</span>';
      const primaryAction = evidence.querySelector('.evidence-actions .button.primary');
      if (primaryAction) primaryAction.textContent = 'Open the 66-record AI evidence ledger';
    }
  };

  const patch = () => {
    const section = document.getElementById('verified-predictions');
    if (!section) return false;
    if (section.dataset.rcaAudit42 === 'true') return true;

    installStyles();
    section.dataset.rcaAudit42 = 'true';
    section.innerHTML = `
      <p class="eyebrow">RCA prediction &amp; validation audit · original release June 11, 2025</p>
      <h2 id="verified-predictions-title">42 RCA / WCT-AI items: what landed, what converged, and what remains prospective</h2>
      <p class="section-lede">This replaces the previous all-green summary with a status-aware audit. Each item states the original RCA / WCT-AI mechanism or forecast, the later corresponding evidence class, and its present validation status. These are author-side audit items and are not added to the external-evidence record count.</p>

      <div class="rca-audit-legend" aria-label="RCA audit status colors">
        <span class="rca-legend-item" style="--audit-color:#7ce09f"><span class="rca-legend-dot"></span>Green · landed (${counts.landed})</span>
        <span class="rca-legend-item" style="--audit-color:#67d4ff"><span class="rca-legend-dot"></span>Cyan · convergence (${counts.convergence})</span>
        <span class="rca-legend-item" style="--audit-color:#ffc55c"><span class="rca-legend-dot"></span>Amber · partial / precursor (${counts.partial})</span>
        <span class="rca-legend-item" style="--audit-color:#b789ff"><span class="rca-legend-dot"></span>Violet · open validation (${counts.open})</span>
        <span class="rca-legend-item" style="--audit-color:#8f9bad"><span class="rca-legend-dot"></span>Slate · prospective / unestablished (${counts.prospective})</span>
      </div>

      <div class="prediction-metrics" aria-label="RCA audit summary">
        <div class="prediction-metric" style="--audit-color:#7ce09f"><strong>${counts.landed}</strong><span>landed / strong mechanism or quantitative hits</span></div>
        <div class="prediction-metric" style="--audit-color:#67d4ff"><strong>${counts.convergence}</strong><span>structural, conceptual, or metric convergence</span></div>
        <div class="prediction-metric" style="--audit-color:#ffc55c"><strong>${counts.partial}</strong><span>partial support, analogues, or precursors</span></div>
        <div class="prediction-metric" style="--audit-color:#b789ff"><strong>${counts.open}</strong><span>derived result awaiting broader external validation</span></div>
        <div class="prediction-metric" style="--audit-color:#8f9bad"><strong>${counts.prospective}</strong><span>not yet due, not yet literal, or not established</span></div>
      </div>

      <div class="prediction-grid">
        ${audit.map(([n,title,evidence,status,kind]) => `
          <article class="prediction-card status-${kind}">
            <span class="prediction-number">${n}</span>
            <strong>${esc(title)}</strong>
            <p class="audit-evidence">${esc(evidence)}</p>
            <p class="audit-current-status"><strong>Status:</strong> ${esc(status)}</p>
            <span class="audit-status-pill">${labels[kind]}</span>
          </article>`).join('')}
      </div>
    `;

    patchExternalTotals();
    return true;
  };

  if (patch()) return;

  const observer = new MutationObserver(() => {
    if (patch()) observer.disconnect();
  });
  observer.observe(document.documentElement, {childList:true, subtree:true});

  window.addEventListener('load', () => {
    patch();
    setTimeout(() => observer.disconnect(), 5000);
  }, {once:true});
})();