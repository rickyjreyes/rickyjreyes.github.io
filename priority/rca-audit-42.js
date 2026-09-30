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
      #rca-prediction-audit{border-top:1px solid rgba(183,137,255,.3)!important}
      #rca-prediction-audit .rca-audit-summary{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 8px;max-width:1180px}
      #rca-prediction-audit .rca-summary-item{--audit-color:#67d4ff;display:inline-flex;align-items:center;gap:8px;padding:8px 11px;border:1px solid color-mix(in srgb,var(--audit-color) 34%, var(--line));border-radius:999px;background:color-mix(in srgb,var(--audit-color) 6%, transparent);font-size:.73rem;font-weight:800;color:var(--muted)}
      #rca-prediction-audit .rca-summary-item strong{color:var(--audit-color)}
      #rca-prediction-audit .rca-audit-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:22px;max-width:1180px}
      #rca-prediction-audit .rca-audit-card{--audit-color:#67d4ff;position:relative;padding:20px 20px 18px 54px;border:1px solid color-mix(in srgb,var(--audit-color) 30%, var(--line));border-radius:15px;background:color-mix(in srgb,var(--audit-color) 5%, rgba(255,255,255,.015));overflow:hidden}
      #rca-prediction-audit .rca-audit-card::before{content:'';position:absolute;inset:0 auto 0 0;width:4px;background:var(--audit-color)}
      #rca-prediction-audit .status-landed{--audit-color:#7ce09f}
      #rca-prediction-audit .status-convergence{--audit-color:#67d4ff}
      #rca-prediction-audit .status-partial{--audit-color:#ffc55c}
      #rca-prediction-audit .status-open{--audit-color:#b789ff}
      #rca-prediction-audit .status-prospective{--audit-color:#8f9bad}
      #rca-prediction-audit .rca-audit-number{position:absolute;left:18px;top:19px;display:grid;place-items:center;width:25px;height:25px;border:1px solid color-mix(in srgb,var(--audit-color) 62%, transparent);border-radius:999px;color:var(--audit-color);background:color-mix(in srgb,var(--audit-color) 8%, transparent);font-size:.7rem;font-weight:850}
      #rca-prediction-audit .rca-audit-card h3{margin:0;color:var(--text);font-size:1rem;line-height:1.35}
      #rca-prediction-audit .rca-audit-card p{margin:8px 0 0;color:var(--muted);font-size:.86rem;line-height:1.55}
      #rca-prediction-audit .rca-audit-status{display:inline-flex;margin-top:12px;padding:5px 8px;border:1px solid currentColor;border-radius:999px;color:var(--audit-color);font-size:.64rem;font-weight:900;letter-spacing:.045em;text-transform:uppercase}
      #rca-prediction-audit .rca-status-detail{color:var(--text)!important;font-size:.8rem!important}
      #rca-prediction-audit .rca-status-detail strong{color:var(--audit-color)}
      @media(max-width:900px){#rca-prediction-audit .rca-audit-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  };

  const addJumpLink = () => {
    const nav = document.getElementById('priority-jump');
    if (!nav || nav.querySelector('a[href="#rca-prediction-audit"]')) return;
    const link = document.createElement('a');
    link.href = '#rca-prediction-audit';
    link.textContent = 'RCA audit';
    const external = nav.querySelector('a[href="#expanded-evidence"]');
    if (external) nav.insertBefore(link, external);
    else nav.appendChild(link);
  };

  const build = () => {
    const verified = document.getElementById('verified-predictions');
    if (!verified) return false;
    if (document.getElementById('rca-prediction-audit')) {
      addJumpLink();
      return true;
    }

    installStyles();

    const section = document.createElement('section');
    section.className = 'priority-section';
    section.id = 'rca-prediction-audit';
    section.setAttribute('aria-labelledby', 'rca-prediction-audit-title');
    section.innerHTML = `
      <p class="eyebrow">RCA / WCT-AI mechanism and forecast audit · original release June 11, 2025</p>
      <h2 id="rca-prediction-audit-title">42 RCA / WCT-AI items and their current evidence status</h2>
      <p class="section-lede">A separate term-by-term audit of RCA mechanisms, diagnostics, forecast milestones, and later corresponding evidence. These 42 author-side audit items are not counted as external-evidence or adoption records and do not replace the verified-predictions section above.</p>

      <div class="rca-audit-summary" aria-label="RCA audit status summary">
        <span class="rca-summary-item" style="--audit-color:#7ce09f"><strong>${counts.landed}</strong> landed / strong hits</span>
        <span class="rca-summary-item" style="--audit-color:#67d4ff"><strong>${counts.convergence}</strong> convergence</span>
        <span class="rca-summary-item" style="--audit-color:#ffc55c"><strong>${counts.partial}</strong> partial / precursor</span>
        <span class="rca-summary-item" style="--audit-color:#b789ff"><strong>${counts.open}</strong> open validation</span>
        <span class="rca-summary-item" style="--audit-color:#8f9bad"><strong>${counts.prospective}</strong> prospective / unestablished</span>
      </div>

      <div class="rca-audit-grid">
        ${audit.map(([n,title,evidence,status,kind]) => `
          <article class="rca-audit-card status-${kind}">
            <span class="rca-audit-number">${n}</span>
            <h3>${esc(title)}</h3>
            <p>${esc(evidence)}</p>
            <p class="rca-status-detail"><strong>Status:</strong> ${esc(status)}</p>
            <span class="rca-audit-status">${labels[kind]}</span>
          </article>`).join('')}
      </div>
    `;

    const expandedEvidence = document.getElementById('expanded-evidence');
    if (expandedEvidence && expandedEvidence.parentNode) {
      expandedEvidence.parentNode.insertBefore(section, expandedEvidence);
    } else if (verified.nextSibling) {
      verified.parentNode.insertBefore(section, verified.nextSibling);
    } else {
      verified.parentNode.appendChild(section);
    }

    addJumpLink();
    return true;
  };

  if (build()) return;

  const observer = new MutationObserver(() => {
    if (build()) observer.disconnect();
  });
  observer.observe(document.documentElement, {childList:true, subtree:true});

  window.addEventListener('load', () => {
    build();
    setTimeout(() => observer.disconnect(), 5000);
  }, {once:true});
})();