// Established cross-disciplinary reference vocabulary for name-blind discovery.
// These are not WCT coinages and are not additions to the archival terminology-priority registry.
// Preserve the existing 22-release source mappings and lexical audit.
(() => {
  const rows = [
  [
    "Frenet–Serret frame",
    "The tangent, normal, and binormal frame of a sufficiently regular space curve. Its evolution is described by curvature κ and torsion τ when curvature is nonzero.",
    "Curvature",
    "T, N, B"
  ],
  [
    "Darboux vector",
    "The angular-velocity vector describing rotation of a moving curve frame. For the Frenet–Serret frame its magnitude is √(κ²+τ²); this geometric identity is not by itself a particle-mass law.",
    "Curvature",
    "|Ω|=√(κ²+τ²)"
  ],
  [
    "Total curvature",
    "The integral of the magnitude of a curve's curvature along arclength; a geometric measure of overall bending, distinct from locally density-weighted curvature.",
    "Curvature",
    "∫κ ds"
  ],
  [
    "Elastic rod energy",
    "A variational energy for a slender filament involving bending and sometimes twist or stretching; a classical comparison model for geometric filament dynamics.",
    "Curvature",
    ""
  ],
  [
    "Geometric phase",
    "A phase contribution determined by a path through parameter or configuration space, rather than solely by elapsed time; includes Berry-phase and related holonomy settings.",
    "Topology",
    ""
  ],
  [
    "Berry phase",
    "The geometric phase acquired during an adiabatic cyclic evolution of a quantum eigenstate, subject to its assumptions.",
    "Topology",
    ""
  ],
  [
    "Parallel-transport holonomy",
    "The net transformation of a vector or spinor after parallel transport around a closed curve under a specified connection.",
    "Topology",
    ""
  ],
  [
    "Antiperiodic boundary conditions",
    "Boundary conditions under which a field changes sign after one period or circuit, as can occur in certain spinorial descriptions.",
    "Topology",
    "ψ(s+L)=−ψ(s)"
  ],
  [
    "Topological soliton",
    "A localized field configuration protected, in an appropriate field theory, by nontrivial topology or conserved topological charge; not all localized solitons have such protection.",
    "Topology",
    ""
  ],
  [
    "Geometric quantization",
    "Mathematical methods connecting symplectic geometry with quantum state spaces and operators; distinct from generic quantization of a curved loop.",
    "Topology",
    ""
  ],
  [
    "Closed-loop phase winding",
    "The integer count of phase turns around a loop for a continuous nonvanishing complex field; winding quantization requires its stated boundary conditions.",
    "Topology",
    "n=(1/2π)∮dθ"
  ],
  [
    "Concentration–compactness principle",
    "A framework for controlling loss of compactness in variational problems by distinguishing vanishing, splitting (dichotomy), and concentration of minimizing sequences.",
    "Stability",
    ""
  ],
  [
    "Strict subadditivity of constrained energy",
    "The inequality that a fixed-mass energy infimum lies below the sum of infima for every nontrivial mass split; a standard route to excluding dichotomy.",
    "Stability",
    "I(m)<I(μ)+I(m−μ)"
  ],
  [
    "Mass-constrained energy minimizer",
    "A state minimizing a specified energy functional subject to a conserved mass or norm constraint; the conclusion depends on the actual functional and admissible function space.",
    "Stability",
    ""
  ],
  [
    "Compactness modulo translations",
    "Precompactness after selecting suitable spatial translations, used when translation symmetry prevents ordinary compactness of a minimizing sequence.",
    "Stability",
    ""
  ],
  [
    "Orbital stability",
    "Persistence of closeness to the symmetry orbit of a stationary or traveling state under small perturbations for all times covered by a well-posed dynamics.",
    "Stability",
    ""
  ],
  [
    "Spectral stability",
    "Absence of eigenvalues or spectral modes causing exponential growth in an appropriate linearized evolution; does not by itself prove nonlinear stability.",
    "Stability",
    ""
  ],
  [
    "Nonlinear stability",
    "A dynamical assertion that sufficiently small perturbations remain controlled in a specified norm; stronger than merely checking a linearized spectrum.",
    "Stability",
    ""
  ],
  [
    "Ground-state solution",
    "A stationary solution selected by a lowest-energy or variational principle within a precisely specified class; the admissible class matters.",
    "Stability",
    ""
  ],
  [
    "Derrick scaling argument",
    "A spatial-rescaling test providing constraints or obstructions to finite-energy static localized solutions, depending on the field model and dimension.",
    "Stability",
    ""
  ],
  [
    "Pohozaev identity",
    "An integral identity for solutions of certain stationary elliptic PDEs; often yields nonexistence or parameter constraints when combined with variational bounds.",
    "Stability",
    ""
  ],
  [
    "Sobolev embedding H² to L∞",
    "The embedding H²(ℝⁿ) into bounded continuous functions for n≤3, under standard Sobolev assumptions; it is a regularity fact, not a universal ban on higher-dimensional localization.",
    "Stability",
    "H²(ℝⁿ)↪L∞, n≤3"
  ],
  [
    "Gagliardo–Nirenberg inequality",
    "An interpolation inequality bounding function norms by combinations of derivative and lower-order norms; central to nonlinear PDE energy estimates.",
    "Stability",
    ""
  ],
  [
    "Coercive energy functional",
    "An energy whose controlled value forces a useful bound on the state norm within a specified constraint set; a common ingredient in compactness and stability proofs.",
    "Stability",
    ""
  ],
  [
    "Critical mass threshold",
    "A mass or norm level separating different qualitative properties, such as bounded energy and collapse, in a specified nonlinear equation.",
    "Stability",
    ""
  ],
  [
    "Vakhitov–Kolokolov criterion",
    "A slope-based stability test for solitary-wave families in certain nonlinear dispersive models; its implications require the accompanying spectral assumptions.",
    "Stability",
    ""
  ],
  [
    "Metastable lifetime",
    "The characteristic persistence time of a temporarily localized state before decay, escape, or transition, distinct from proving all-time stability.",
    "Stability",
    ""
  ],
  [
    "Floquet stability",
    "Linear stability of periodic solutions evaluated from the spectrum of the evolution map over one period.",
    "Stability",
    ""
  ],
  [
    "Nonlinear eigenvalue problem",
    "An eigenvalue relation in which the operator or solution equation depends nonlinearly on the unknown state; solution branches can require separate existence and stability arguments.",
    "Core field",
    ""
  ],
  [
    "Finite-wavenumber instability",
    "A pattern-forming instability preferentially amplifying disturbances in a band centered at nonzero spatial frequency.",
    "Spectral",
    "k*≠0"
  ],
  [
    "Swift–Hohenberg equation",
    "A canonical pattern-forming PDE with finite-wavelength selection, useful as a comparison for nonlinear spectral band-pass mechanisms.",
    "Spectral",
    ""
  ],
  [
    "Mode locking",
    "Synchronization or fixed-ratio locking among oscillatory frequencies or phases under coupling; not sufficient evidence of topological confinement by itself.",
    "Spectral",
    ""
  ],
  [
    "Spectral entropy",
    "An entropy computed from normalized spectral power across frequency bins, used to quantify spectral concentration or dispersion.",
    "Spectral",
    ""
  ],
  [
    "Log-periodic oscillation",
    "An oscillatory pattern periodic in the logarithm of a variable, commonly expressed as A cos(k ln(x/x₀)+φ).",
    "Spectral",
    "A cos(k ln(x/x₀)+φ)"
  ],
  [
    "Spectral comb",
    "A series of peaks or lines separated by a regular spacing in a declared coordinate such as frequency or log-frequency.",
    "Spectral",
    ""
  ],
  [
    "Residual-spectrum baseline sensitivity",
    "The dependence of an apparent spectral feature on the smooth background model, fit procedure, masking, or preprocessing choices.",
    "Evidence",
    ""
  ],
  [
    "Look-elsewhere effect",
    "Inflation of false-alarm probability when many frequencies, locations, models, or cuts are searched; global significance accounts for the search procedure.",
    "Evidence",
    ""
  ],
  [
    "Blind holdout validation",
    "Testing a frozen analysis or prediction on observations withheld from model development to reduce selection and overfitting bias.",
    "Evidence",
    ""
  ],
  [
    "Detector response convolution",
    "The transformation of a theoretical spectrum into a predicted measured spectrum by folding in detector resolution, efficiency, and response.",
    "Evidence",
    ""
  ],
  [
    "Parametric bootstrap",
    "Repeated simulation from a fitted null or reference model to estimate sampling variation, calibration, or test-statistic significance.",
    "Evidence",
    ""
  ],
  [
    "Binned Poisson likelihood",
    "A count-data likelihood assigning Poisson probabilities to observed bin counts given their predicted means.",
    "Evidence",
    ""
  ],
  [
    "Cross-resolution convergence",
    "Agreement of numerical estimates or solutions as the spatial or temporal discretization is refined; required when excluding numerical artifacts.",
    "Evidence",
    ""
  ],
  [
    "Hierarchical background model",
    "A statistical background specification sharing or varying parameters across data groups, with uncertainty propagated into signal inference.",
    "Evidence",
    ""
  ],
  [
    "Atomic line-list spectroscopy",
    "Analysis of tabulated atomic transition wavelengths, wavenumbers, and intensities; selection functions and line-list completeness affect population patterns.",
    "Evidence",
    ""
  ],
  [
    "Gravitational-wave event catalog",
    "A collection of detected gravitational-wave candidates or events with measured parameter and selection uncertainties used in population studies.",
    "Evidence",
    ""
  ],
  [
    "Reactor antineutrino spectral fine structure",
    "Energy-dependent features in a measured reactor antineutrino spectrum, influenced by source physics, oscillations, detector response, and statistical fluctuations.",
    "Evidence",
    ""
  ],
  [
    "Neutrino mass-ordering sensitivity",
    "The ability of an oscillation experiment to distinguish possible neutrino mass orderings through its predicted energy- and baseline-dependent signatures.",
    "Evidence",
    ""
  ],
  [
    "Wilson-coefficient deformation",
    "A momentum- or energy-dependent change to a coefficient in an effective field-theory description, evaluated against the applicable theory and data.",
    "Evidence",
    ""
  ],
  [
    "Flavor-changing neutral-current transition",
    "A particle transition that changes quark flavor without electric-charge change; rare decays such as b→sℓ⁺ℓ⁻ probe effective interactions.",
    "Evidence",
    "b→sℓ⁺ℓ⁻"
  ],
  [
    "Context compaction",
    "Compression or summarization of a model's working context to fit resource limits; important constraints can be lost or distorted.",
    "AI / drift",
    ""
  ],
  [
    "Long-horizon agent reliability",
    "The ability of an autonomous or tool-using AI system to preserve goals, constraints, and correct behavior across extended action sequences.",
    "AI / drift",
    ""
  ],
  [
    "Constraint retention",
    "Preservation and correct application of instructions or safety constraints across context windows, delegation, memory updates, and tool calls.",
    "AI / drift",
    ""
  ],
  [
    "Corrigibility",
    "A system property describing responsiveness to authorized human correction, intervention, or shutdown; definitions differ across alignment frameworks.",
    "AI / drift",
    ""
  ],
  [
    "Agent rollback and recovery",
    "The capacity to restore a controlled state or undo effects after an agent makes an error; external-world actions may not be reversible.",
    "AI / drift",
    ""
  ],
  [
    "Finite-precision physical computation",
    "Study of computation with bounded numerical precision, energy, time, bandwidth, or other explicit physical resources.",
    "Computation",
    ""
  ],
  [
    "Model-relative complexity separation",
    "A complexity-class separation proved under a particular model's definitions and resource assumptions, not automatically a theorem about unrestricted classical P versus NP.",
    "Computation",
    ""
  ],
  [
    "Physical Church–Turing thesis",
    "A family of claims about which physical processes can be simulated by standard computation; formulations and resource assumptions must be specified.",
    "Computation",
    ""
  ],
  [
    "Formal proof kernel",
    "A small trusted checker that validates formal proofs against explicit logical rules and axioms, distinct from unverified generated proof scripts.",
    "Computation",
    ""
  ],
  [
    "Cryptographic one-way function",
    "A function easy to evaluate but hard to invert on average under a stated complexity assumption; chaotic or lossy dynamics alone do not establish cryptographic one-wayness.",
    "Computation",
    ""
  ],
  [
    "Tokamak energy-confinement time",
    "The ratio of stored plasma energy to its effective loss power, commonly used to characterize magnetic-confinement performance.",
    "Control / fusion",
    "τ_E"
  ],
  [
    "Edge-localized mode",
    "A transient instability of the edge transport barrier in certain tokamak regimes; control strategies must account for its effect on diagnostics and actuators.",
    "Control / fusion",
    "ELM"
  ],
  [
    "Control-barrier invariant set",
    "A state region that a controller aims to keep forward invariant under specified dynamics and disturbances using a barrier condition.",
    "Control / fusion",
    ""
  ],
  [
    "Supervisory control",
    "High-level logic that coordinates lower-level controllers, manages operating modes, and enforces transition or safety gates.",
    "Control / fusion",
    ""
  ],
  [
    "Resonator quality factor",
    "A measure of resonance sharpness or stored-energy-to-loss ratio; high Q need not imply sustained response after external driving stops.",
    "Evidence",
    "Q"
  ],
  [
    "Ring-down decay time",
    "The characteristic decay time of an oscillatory resonator after excitation is removed; material and instrumental artifacts must be excluded when interpreting persistence.",
    "Evidence",
    ""
  ],
  [
    "Phase-coherence time",
    "A measure of how long an oscillator or wave process retains a reproducible phase relationship under a declared measurement method.",
    "Evidence",
    ""
  ]
];
  const base = Array.isArray(window.WCT_GLOSSARY_ALL) ? window.WCT_GLOSSARY_ALL : [];
  const existing = new Set(base.map(term => String(term.name || '').toLocaleLowerCase()));
  let added = 0;
  for (const [name, definition, family, notation] of rows) {
    const key = name.toLocaleLowerCase();
    if (existing.has(key)) continue;
    base.push({name, definition, family, notation, provenance:'Established / external', lexical_audit_status:'not_in_exact_phrase_survivor_set'});
    existing.add(key);
    added++;
  }
  base.sort((a,b) => String(a.name).localeCompare(String(b.name),'en',{sensitivity:'base'}));
  window.WCT_GLOSSARY_ALL = base;
  window.WCT_GLOSSARY_META = {...(window.WCT_GLOSSARY_META || {}), established_context_terms_added: added};
})();
