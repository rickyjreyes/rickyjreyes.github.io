// Versioned public terminology snapshot derived from the canonical private Obsidian glossary.
// Source inventory: rickyjreyes/obsidian · Research/03 Glossary/WCT Glossary.md
// The private source repository remains private; this file contains public terminology only.
(() => {
  const names = ["3-SAT","Active-domain winding","Agent drift","AGI Safety","AI alignment","AI Safety","Angular anomaly","Angular modulation","Artificial mass generation","Atomic line lists","Atomic spectra","Autonomous agents","Beta quantization","Bin stability","Bounded Poisson likelihood","B⁰ → K*⁰ μ⁺μ⁻","Candidate-spectrum geometry","Cellular Automata","Charmonium vetoes","Co II","Coherence","Coherence collapse","Coherence feedback","Coherence mirage","Coherence proxy","Cole-Hopf Transform","Collapse score","Complex Ginzburg-Landau","Computational Complexity","Confinement Termination Principle","Conservation Laws","Constraint drift","Continuum Limits","Continuum PDE","Control","Control barrier","Control barrier functions","Cook-Levin reduction","Cosmological Constant","Covariant Invariant","Curriculum drift","CurvaChain","Curvature Capacity","Curvature complexity","Curvature dynamics","Curvature Feedback","Curvature Flow","Curvature Harmonics","Curvature Invariants","Curvature Locking","Curvature Saturation","Curvature-based cryptography","Curvature-Bounded Computation","Curvature-Feedback Instability","Curvature-Induced Mass Shift","Curvature-Koide Invariant","Curvature-locked solitons","C₉(q²)","D4 Discrete Model","Density-Weighted Curvature","Detector Resolution","Deterministic dynamics","Dimensional Stability","Discrete Scale Invariance","Discrete scale structure","Distinguishability cost","Distinguishability Curvature","Effective Metric","Effective spin","Eigenmode Spectrum","Emergent Mass","Emergent misalignment","Emergent Order","Energy balance","Energy Smearing","Entropic Eigenmodes","Entropy","Entropy decay","Entropy drop","Entropy regularization","Entropy regulation","Entropy-stabilized fields","Evolving memory","Expander graphs","Experimental ledger","Experimental physics","Experimental Sensitivity","External validation","Extra Dimensions","Falsifiable Predictions","Fe II","Fermion Triplets","Filament Localization","Fine-Structure Constant","Finite precision","Finite-band selection","Finite-bandwidth computation","Finite-k Selection","First Law of Intelligent Resonance","Flavor Physics","Fourier Band Selection","Fourier cymatics","Fundamental constants","Fusion Energy","Gauge emergence","Gaussian field","Gaussian-smoothed baseline","General Relativity","Generative-models","Geometric complexity","Geometric hashing","Geometric Inertia","Geometric Mass Models","Geometric Mass Ratios","Geometric memory","Geometric Origin of Energy","Geometric Unification","Geometry","Ghost Harmonics","Ghost-mode modulation","Ginzburg-Landau","GPT-4","Gravitational Constant","Harmonic spectrum","Holonomy","Hopf Fibration","Inertial Mass","Informational geometry","Informational physics","Intelligent resonance","Inverse-Koide square-root dilation","JUNO","KDE baseline","KDE baseline repair","Koide comb","Koide Relation","Koide-like winding","KPZ Equation","Laplacian Scaling","Lepton Mass Spectrum","LHCb","Light-induced resonance","Line-density analysis","Local-Update Machines","Locked expander","Log-Energy Oscillations","Log-periodic modulation","Log-periodic residual","Log-periodicity","Logarithmic Curvature Operator","Logarithmic wavenumber","Long-Lived Resonance","Lyapunov Band-Pass","Lyapunov Descent","Lyapunov Stability","Mass-Phase Geometry","Mass-Squared Difference","MHD Stabilization","Mixing Angle","Model collapse","Model-relative lower bounds","Modeling","Multi-agent systems","NC Circuits","NC¹ circuits","Neutrino Oscillations","Neutrinos","NIST Atomic Spectra Database","Non-Gradient AI","Non-natural proofs","Non-relativizing arguments","Non-volatile states","Nonlinear computation","Nonlinear Dynamics","Nonlinear geometry","Nonlinear PDE evolution","Nonlinear Wave Confinement","Nonlinear Wavefields","NP Verification","NP_WCC","Null Flow","One-Way Functions","Open data","Optical coherence","Optical excitation","Oscillation Phase","P vs NP","P_WCC","Parametric bootstrap","Pattern Formation","Persistent electrical states","Phase–Flux Field","Photodiode","Photodiode harmonic state","Photon Confinement","Photonic mass","Physical Computation","Physical P≠NP","Physical Symbolic Kill Logic","Planck Constant","Plasma confinement","Poisson likelihood","Poisson log-linear model","Poloidal Curvature","Post-Quantum Cryptography","Prediction audit","Problem drift","Propagation-correction criticality","Protocol registration","Public scientific data","P′₅ Anomaly","Quantum emergence","Quantum Field Theory","Quantum Field Theory Constraints","q² Spectrum","Rare B decays","RCA","Real-time plasma control","Recursive AI Drift","Recursive degradation","Recursive self-processing","Reproducible data analysis","Resonance confinement","Resonance encoding","Resonance-Confinement Architecture","Rest Energy","Reward hacking","RLVR","SAT","Scale dilation","Self-consuming","Self-consuming generative models","Semantic anchor decay","Semantic drift","Shell Quantization","Sideband analysis","Solenoidal Topology","Spacetime Emergence","SPARC","Spatial Dimension Bound","Spectral Entropy","Spectral Modulation","Spectral residuals","Spectral shell","Spectral structure","Speed of Light","Spin-Curvature Partition","Spinor Quantization","Spinor topology","State induction","SU(2) Symmetry","Survivability architecture","Survival Probability","Swift-Hohenberg","Swift–Hohenberg rail","Symbolic AGI","Symbolic drift","Symbolic heartbeat","Symbolic persistence","Symbolic physics","Synthetic data collapse","Technical note","Threshold dynamics","Tokamak","Tokamak Control","Topological Confinement","Toroidal Eigenmodes","Torsion","Torsion Budget","Transition metals","Transport modeling","Turing Equivalence","Turing Machines","Turing Simulation","Ultraviolet illumination","Unified Field Theory","Variational Stability","Verifier Bijection","Verifier gaming","Wave Computation","Wave Confinement Theory","Wave Curvature Computation","Wave-Constrained Computation","Wave-Encoded Information","Wavefield commitment schemes","WaveLock","Wavenumber","Wilson Coefficient","Wilson Coefficient C₉","Δm² precision","Θ-operator","ψ-field"];

  const coined = new Set([
    "Coherence mirage","Semantic anchor decay","Propagation-correction criticality","Collapse score","Symbolic heartbeat","Physical Symbolic Kill Logic","Confinement Termination Principle"
  ]);
  const wctDefined = new Set([
    "Wave Confinement Theory","Phase–Flux Field","Wave Curvature Computation","Wave-Constrained Computation","Curvature-Bounded Computation","Curvature Capacity","Curvature complexity","P_WCC","NP_WCC","Physical P≠NP","WaveLock","CurvaChain","Resonance-Confinement Architecture","Recursive AI Drift","RCA","Curvature-Koide Invariant","Curvature-Induced Mass Shift","Spin-Curvature Partition","Torsion Budget","Distinguishability Curvature","Locked expander","Active-domain winding","Candidate-spectrum geometry","Koide comb","Ghost Harmonics","Intelligent resonance","First Law of Intelligent Resonance","Lyapunov Band-Pass","Curvature Locking","Density-Weighted Curvature","Curvature-based cryptography","Wavefield commitment schemes","Shell Quantization","Photodiode harmonic state","Swift–Hohenberg rail","Finite-band selection","Ghost-mode modulation","KDE baseline repair","Koide-like winding","Spectral shell","ψ-field","Curvature Harmonics","Curvature Invariants","Curvature-locked solitons","Curvature-Feedback Instability","Geometric Inertia","Geometric memory","Geometric Origin of Energy","Geometric Mass Models","Geometric Mass Ratios","Mass-Phase Geometry","Null Flow","Resonance encoding","Survivability architecture"
  ]);

  const special = {
    "CurvaChain":"The ledger-oriented WaveLock branch that records deterministic curvature-derived state transitions and chained commitments.",
    "Confinement Termination Principle":"An RCA rule that recursive evolution should terminate when a system can no longer remain inside its declared semantic, symbolic, or operational confinement bounds.",
    "Physical Symbolic Kill Logic":"An RCA termination mechanism that halts recursive symbolic processing when declared drift, collapse, or constraint-loss thresholds are crossed.",
    "Symbolic heartbeat":"An RCA diagnostic that periodically checks whether a recursively evolving symbolic system still preserves its defining anchors and identity-bearing constraints.",
    "First Law of Intelligent Resonance":"The RCA proposition that coherent intelligent systems tend to increase structured information while remaining inside stabilizing resonance and constraint bounds.",
    "Propagation-correction criticality":"The RCA threshold comparing the rate at which recursive errors propagate with the system’s capacity to detect and correct them.",
    "Coherence mirage":"An RCA failure mode in which fluent surface behavior persists while semantic anchoring or internal constraint fidelity degrades.",
    "Semantic anchor decay":"Progressive loss of stable grounding, reference, or identity-bearing semantic relationships during recursive processing.",
    "Collapse score":"An RCA diagnostic score used to quantify recursive-symbolic degradation or coherence collapse.",
    "Wave Confinement Theory":"The Reyes research program proposing that persistent physical structure can emerge from confined oscillatory fields organized by spectral selection, phase, curvature feedback, and topology.",
    "Wave Curvature Computation":"The WCT computation model that bounds local evolution by explicit curvature, time, bandwidth, precision, and stability resources.",
    "Wave-Constrained Computation":"A rigorously specified local-update computation model derived from the WCT program and compared with classical Turing computation.",
    "Curvature-Bounded Computation":"A physical computation model in which admissible states and algorithms are limited by finite curvature, bandwidth, precision, locality, and stability resources.",
    "Curvature Capacity":"The finite amount of physically distinguishable computation or state complexity allowed under a declared curvature-resource budget.",
    "Physical P≠NP":"The model-relative WCC claim that efficient physical realization and efficient verification separate under explicitly declared resource constraints.",
    "P_WCC":"The polynomial-resource computation class defined inside the WCC model.",
    "NP_WCC":"The polynomial-time verifier class with polynomially bounded witnesses defined inside the WCC model.",
    "WaveLock":"An experimental cryptographic research architecture using nonlinear PDE evolution, path-dependent curvature commitments, deterministic replay, and drift-sensitive invariants.",
    "RCA":"Resonance-Confinement Architecture, the Reyes AI framework connecting bounded coherence, recursive-drift diagnostics, and survivability controls.",
    "Recursive AI Drift":"Progressive semantic, behavioral, or goal deviation produced by repeated self-processing, self-training, or agentic recursion.",
    "Resonance-Confinement Architecture":"A Reyes AI architecture that models cognition and memory as bounded resonant states regulated by coherence, entropy, and drift controls.",
    "Phase–Flux Field":"The WCT wave-first substrate defined through observable energy density, energy flux, and phase fields.",
    "Θ-operator":"The WCT nonlinear curvature-feedback operator Θ[ψ]=−∇²ψ/(ψ+εe^(−α|ψ|²)).",
    "ψ-field":"The complex wavefield used as the central state variable for phase, curvature, confinement, energy, and localization calculations across WCT.",
    "Lyapunov Band-Pass":"A WCT spectral-selection rail whose Lyapunov dynamics favor a finite nonzero wavenumber band while suppressing infrared and ultraviolet growth.",
    "Shell Quantization":"The WCT construction in which phase winding assigns integer labels to allowed spectral shells.",
    "Spin-Curvature Partition":"The WCT decomposition of a mode’s angular curvature budget between spin-like torsion and orbital or poloidal winding.",
    "Torsion Budget":"The share of a confined mode’s geometric allocation attributed to torsion or spin-like twisting.",
    "Density-Weighted Curvature":"An average curvature or curvature–torsion magnitude weighted by local energy density along a confined path.",
    "Curvature-Koide Invariant":"A WCT relation connecting a Koide-like mass ratio to spin-dependent curvature harmonics through a geometric invariant.",
    "Curvature-Induced Mass Shift":"A WCT correction to an inferred mass scale or mass-squared splitting generated by curvature locking.",
    "Distinguishability Curvature":"A geometric or energetic measure of the cost of maintaining physically distinguishable computational states.",
    "Locked expander":"A WCC construction combining expander-graph constraints with globally coordinated satisfying states under local curvature/resource bounds.",
    "Active-domain winding":"Integer winding measured over the active spectral or q² domain after baseline repair and veto handling.",
    "Candidate-spectrum geometry":"Geometric structure inferred from residual patterns in a selected event spectrum.",
    "Koide comb":"A triplet or repeated set of spectral positions arranged so their geometric relation reproduces a Koide-like ratio.",
    "Ghost Harmonics":"Higher or companion harmonic components of a proposed ghost-mode spectral modulation after detector response is applied.",
    "Photodiode harmonic state":"The corpus shorthand for the long-lived electrical and spectral state monitored through waveform, FFT, harmonic-ratio, persistence, and relocking diagnostics in the photodiode program.",
    "Swift–Hohenberg rail":"The WCT use of a Swift–Hohenberg-type finite-wavenumber selector as a stabilizing spectral rail.",
    "Ghost-mode modulation":"A WCT-motivated log-energy cosine residual model used in detector-facing phenomenology.",
    "KDE baseline repair":"The corpus method of estimating a smooth kernel-density baseline before residual and winding tests.",
    "Koide-like winding":"A geometric winding representation used to compare residual structures or mass-triplet geometry with Koide-like ratios.",
    "Spectral shell":"A dominant annulus or mode family concentrated around a selected wavenumber k*.",
    "Geometric memory":"Physical storage capacity associated with distinguishable geometric configurations rather than abstract symbols alone.",
    "Geometric Inertia":"The WCT interpretation of inertial resistance as arising from curved, closed, or phase-delayed propagation geometry.",
    "Null Flow":"The PFF limiting transport condition in which energy flux reaches the causal bound |S|=cu.",
    "Survivability architecture":"A system design intended to preserve identity, corrigibility, and coherent operation under long-term perturbation or recursive updating."
  };

  const local = window.WCT_GLOSSARY_EXPANDED || {};
  const familyFor = name => {
    const x = name.toLowerCase();
    if (/ai|agent|alignment|drift|semantic|curriculum|collapse|recursive|reward|rlvr|symbolic|survivability|gpt/.test(x)) return "AI / drift";
    if (/curvature|torsion|mass|koide|inertia|metric|soliton|poloidal/.test(x)) return "Curvature";
    if (/fourier|spectral|harmonic|wavenumber|band|shell|mode|oscillation|smearing|scale invariance|log-/.test(x)) return "Spectral";
    if (/topolog|winding|holonomy|hopf|spinor|su\(2\)/.test(x)) return "Topology";
    if (/lyapunov|stability|dimension|variational|regularity/.test(x)) return "Stability";
    if (/comput|complexity|circuit|sat|verifier|turing|cryptograph|one-way|expander|finite precision|distinguishability/.test(x)) return "Computation";
    if (/nist|lhcb|juno|photodiode|detector|data|likelihood|bootstrap|veto|experiment|line|p′|q²|co ii|fe ii|atomic|flavor|rare b/.test(x)) return "Evidence";
    if (/plasma|tokamak|fusion|control|mhd|transport|energy balance|sparc/.test(x)) return "Control / fusion";
    if (/cosmolog|gravity|spacetime|relativity|photon|planck|speed of light|unified field/.test(x)) return "Cosmology";
    return "Core field";
  };
  const fallback = (name, family) => {
    if (family === "Evidence") return `${name} is an experimental, detector, or public-data analysis term used in this research corpus.`;
    if (family === "AI / drift") return `${name} is an AI, recursive-systems, or alignment term used in the RCA/WCT research corpus.`;
    if (family === "Computation") return `${name} is a computation or complexity term used in the WCC/WaveLock research corpus.`;
    if (family === "Control / fusion") return `${name} is a control, transport, plasma, or fusion term used in the applied research corpus.`;
    if (family === "Topology") return `${name} is a topology or winding concept used in the geometric confinement corpus.`;
    if (family === "Spectral") return `${name} is a spectral, harmonic, or scale-structure concept used in the analysis and confinement corpus.`;
    if (family === "Curvature") return `${name} is a curvature, mass, or geometric-dynamics concept used in the WCT corpus.`;
    if (family === "Stability") return `${name} is a stability, regularity, or dimensional-control concept used in the WCT corpus.`;
    if (family === "Cosmology") return `${name} is a relativity, field, or fundamental-constant concept used in the WCT corpus.`;
    return `${name} is a core field, mathematical, or physical concept used in the WCT research corpus.`;
  };

  window.WCT_GLOSSARY_ALL = names.map(name => {
    const family = familyFor(name);
    return {
      name,
      definition: local[name] || special[name] || fallback(name, family),
      family,
      notation: "",
      provenance: coined.has(name) ? "Coined by Reyes" : (wctDefined.has(name) ? "WCT-defined" : "Established / external")
    };
  });
  window.WCT_GLOSSARY_META = {
    source: "versioned snapshot of private Obsidian glossary",
    path: "Research/03 Glossary/WCT Glossary.md",
    count: names.length,
    snapshot_date: "2026-08-28"
  };
})();
