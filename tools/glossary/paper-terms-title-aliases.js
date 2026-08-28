// Exact title-level aliases and supplemental canonical WCT terminology identified in the 22-release audit.
// These rows expose named objects directly: equations, invariants, scales, diagnostics, and canonical constructions should not be hidden behind nearby umbrella terms.
(() => {
const titles={
  "1":"The Geometry of Resonance: Wave Confinement Theory and the Emergence of Mass, Force, and Spacetime",
  "2":"Structure and Derivation of Physical Constants through Wave Confinement",
  "5":"Resonance-Confinement Architecture: A Physically Bounded Substrate for Safe Superintelligence",
  "6":"Hard Upper Bound on Spatial Dimensionality in Wave Confinement Theory",
  "7":"Phase-Flux Field (PFF): Axiomatic Substrate for Wave Confinement Theory — Zero-Wave Invariance, Finite-k Lyapunov Band-Pass, Shell Quantization, and D4 to Continuum",
  "8":"Self-Emergent Fourier Cymatics: Entropic Eigenmodes out of Chaos",
  "9":"Emergence of Effective Mass: Solenoidal Topology of Vibrational Energy",
  "10":"Rest Energy from Density-Weighted Loop Curvature: A Covariant Locking Principle",
  "11":"JUNO Energy Resolution and Detectability of WCT Ghost-Mode Neutrinos",
  "12":"Discrete Wave-Constrained Computation and Classical Complexity: Turing Equivalence for P and NP",
  "14":"Wave Confinement Theory Predicts the Koide Mass Relation: A Curvature–Harmonic Origin of Fermion Mass Triplets",
  "16":"Logarithmic Curvature Flow, Filament Localization, and the Geometric Origin of the Lepton Mass Spectrum",
  "17":"Nuclear Fusion Tokamak with Self Sustaining Resonance",
  "18":"A Curvature-Induced Log-Periodic Deformation of C9(q²): Wave Confinement Theory and the LHCb B⁰ → K*⁰ μ⁺μ⁻ Anomaly",
  "19":"Log-Spectral Structure and Koide-Like Winding Geometry in Open-Data B⁰ → K*⁰ μ⁺μ⁻ Candidate Spectra",
  "20":"Recursive AI Drift: A 2025 Prediction Timeline External Validation Audit and Technical Note",
  "21":"Bin-Stable Log-Periodic Structure in Public NIST Atomic Line List",
  "22":"WaveLock: A Curvature-Locked One-Way Function Based on Nonlinear PDE Evolution"
};
const rows=[
  ["Zero-Wave Invariant State","The PFF reference state whose zero-wave configuration remains invariant under the declared minimal substrate dynamics.","Core field",7,"WCT-defined","ZW₀"],
  ["Self-Emergent Fourier Cymatics","The WCT spectral-dynamics construction in which broadband or chaotic initial fields self-organize into finite-band, eigenmode-like structure under the declared evolution.","Spectral",8,"WCT-defined",""],
  ["Density-Weighted Loop Curvature","The WCT closed-loop curvature–torsion scale averaged with local field/energy density and used in the covariant rest-energy locking construction.","Curvature",10,"WCT-defined","⟨σ⟩_w"],
  ["WCT Ghost-Mode Neutrinos","The detector-facing WCT phenomenology in which a small ghost-mode/log-energy modulation is superposed on standard neutrino-oscillation structure and propagated through detector resolution.","Evidence",11,"WCT-defined",""],
  ["Self-Sustaining Resonance","The named tokamak-control objective in which resonance/coherence feedback maintains the declared burn or confinement state through a controlled handoff and invariant operating region.","Control / fusion",17,"WCT-defined",""],
  ["Self-Sustaining Resonance-Control Architecture","The WCT fusion-control architecture coupling coherence estimation, transport mapping, safety gates, actuator allocation, and latch/handoff logic for tokamak operation.","Control / fusion",17,"WCT-defined",""],
  ["Curvature-Induced Log-Periodic Deformation of C9(q²)","The WCT flavor-phenomenology construction in which C₉(q²) receives a curvature-motivated log-periodic q²-dependent deformation rather than only a constant shift.","Evidence",18,"WCT-defined","C₉(q²)"],
  ["Koide-Like Winding Geometry","The WCT/open-data interpretation that selected residual frequencies or wells can be represented through a winding geometry tested for Koide-like relations.","Evidence",19,"WCT-defined",""],
  ["Bin-Stable Log-Periodic Structure","The named atomic open-data result class in which an inferred log-periodic frequency remains stable across declared histogram-bin choices and null checks.","Evidence",21,"WCT-defined",""],

  ["Wave Curvature Scalar","The WCT scalar used to represent local wavefield curvature relative to field amplitude and to supply the curvature quantity used by later feedback constructions.","Curvature",1,"WCT-defined","W_ψ"],
  ["Regularized Curvature Operator","The WCT curvature-feedback operator with the nodal regularization retained explicitly so the curvature-to-field ratio remains defined near small |ψ|.","Curvature",1,"WCT-defined","Θ[ψ]=−∇²ψ/D(ψ)"],
  ["Regularized Denominator","The nonlinear denominator that regularizes the WCT curvature operator near nodes and small field amplitude; it is the object that keeps Θ[ψ] finite under the stated ε, α regularization assumptions.","Curvature",1,"WCT-defined","D(ψ)=ψ+εe^(−α|ψ|²)"],
  ["Torque Density","The local WCT torque-density quantity assigned to rotational structure in a confined field configuration.","Curvature",1,"WCT-defined","τ(x)"],
  ["Effective Mass","The WCT effective inertial mass obtained from the confined state’s curvature-weighted energy content rather than introduced only as an external particle parameter.","Curvature",1,"WCT-defined","m_eff"],
  ["Curvature-Overlap Scattering Amplitude","The WCT transition amplitude formed from overlap of initial and final states with curvature-dependent interaction weighting.","Curvature",1,"WCT-defined","A_fi"],
  ["Topological Charge Quantization","The WCT quantization rule in which charge-like state labels arise from integer topological winding of the confined field.","Topology",1,"WCT-defined",""],
  ["Curvature-Modified Dirac Equation","A Dirac-type field equation augmented by the WCT curvature-feedback contribution used to study spinor dynamics in a confined geometry.","Core field",1,"WCT-defined",""],
  ["Entropy-Action Term","The WCT action contribution that couples entropy regulation to the phase/coherence dynamics and acts as a stabilizing contribution in the confined-field construction.","Core field",1,"WCT-defined",""],
  ["Frequency-Domain Path Integral","The WCT frequency-domain sum over filtered spectral states used as the path-integral representation of admissible confined histories.","Spectral",1,"WCT-defined",""],
  ["Curvature-to-Zeta Transform Cascade","The proposed WCT transform chain that maps curvature-derived spectral information into a zeta-based spectral representation.","Spectral",1,"WCT-defined",""],
  ["Zeta Spectral Lattice of Coherent Standing Waves","The discrete standing-wave spectral lattice associated with the zeta-transform representation of coherent confined modes.","Spectral",1,"WCT-defined",""],
  ["Operator Quantization of Curvature Feedback","The WCT operator-level formulation in which curvature-feedback quantities are promoted into a quantized operator description.","Core field",1,"WCT-defined",""],
  ["SU(2)/SU(3) curvature-mode mapping","The Release 01 mapping between curvature/confinement mode structure and SU(2)- and SU(3)-type internal symmetry channels used in the proposed spin and interaction construction.","Topology",1,"WCT-defined","SU(2) / SU(3)"],

  ["Nonlinear Curvature Feedback Coefficient","The WCT coefficient controlling the strength of nonlinear curvature feedback in the physical-constants construction.","Curvature",2,"WCT-defined","θ"],
  ["Resonance Confinement Efficiency","The WCT efficiency parameter describing how effectively a resonant field state is maintained as a confined mode.","Core field",2,"WCT-defined","ρ"],
  ["Topological Resonance Index","The WCT index used to label or weight the topological contribution of a resonant confinement state.","Topology",2,"WCT-defined","β"],
  ["Phase-coherence distortion scale","The Release 02 structural constant γ controlling the phase-coherence distortion scale in the constants construction; the quoted order is approximately 10⁻¹²⁰.","Core field",2,"WCT-defined","γ ≈ 10⁻¹²⁰"],
  ["Vacuum coherence scale","The Release 02 vacuum/background coherence scale ξ, numerically specified as 85.4 μm and used as a concrete falsifiable scale prediction in the constants construction.","Core field",2,"WCT-defined","ξ = 85.4 μm"],
  ["Phase-Speed Curvature Correction Coefficient","The WCT coefficient governing the curvature-dependent correction applied to phase propagation speed.","Curvature",2,"WCT-defined","ζ"],
  ["Resonance Units","The dimensionless WCT convention R in which the seven Release 02 structural constants are quoted and compared within the resonance-confinement normalization.","Core field",2,"WCT-defined","R"],
  ["Domain-Local Redefinitions from Resonance Confinement","The WCT proposal that selected effective quantities may be re-expressed locally as functions of the resonance-confinement state of a domain.","Core field",2,"WCT-defined",""],

  ["Hard Upper Bound on Spatial Dimensionality","The WCT dimensionality result that, under the paper's stated regularity and confinement assumptions, the admissible spatial dimension satisfies n_max=3.","Stability",6,"WCT-defined","n_max=3"],
  ["Covariant Curvature-Feedback Operator","The covariant form of the WCT curvature-feedback operator used in the dimensionality analysis.","Curvature",6,"WCT-defined","Q[ψ]"],
  ["Six-Route Convergence","The dimensionality paper's convergence of six stated analytical or structural routes on the same three-spatial-dimension bound.","Stability",6,"WCT-defined",""],
  ["Symbolic Entropy Functional","Route (iii) of the Release 06 dimensionality argument: the normalized gradient-energy density ρ is inserted into an entropy functional whose localization behavior is used as an independent dimensional-stability rail.","Stability",6,"WCT-defined","S[ψ]=−∫ρ logρ, ρ=|∇ψ|²/∫|∇ψ|²"],
  ["Entropy Localization","The WCT localization condition applied to entropy or entropy-bearing field structure in the dimensionality analysis.","Stability",6,"WCT-defined",""],
  ["Dimensional Collapse Trichotomy","The paper's three-branch classification of how confinement fails, destabilizes, or reduces when the admissible dimensional regime is exceeded.","Stability",6,"WCT-defined",""],
  ["Rotation-Confinement Projector","The WCT projector or locking criterion selecting the fully rotation-confined sector used in the dimensionality argument.","Stability",6,"WCT-defined","W=1"],
  ["Exact Dimensional Scaling Constant","The dimension-dependent constant appearing in the paper's exact scaling estimate for the confinement quantity.","Stability",6,"WCT-defined","C_n(σ)"],
  ["Loss of Link-Locking for n≥4","The WCT dimensionality claim that the declared link-locking confinement mechanism is lost once spatial dimensionality reaches four or higher under the paper's assumptions.","Topology",6,"WCT-defined","n≥4"],
  ["Curvature-Feedback Instability","The Release 06 instability mechanism in which curvature feedback ceases to preserve the declared confinement/stability rail as the dimensional or regularity conditions are violated.","Stability",6,"WCT-defined",""],

  ["Swift–Hohenberg rail","The WCT use of a Swift–Hohenberg-type finite-wavenumber selector as a spectral stabilization rail for finite-k mode selection.","Spectral",8,"WCT-defined",""],

  ["Loop-Quantized Mass Law","The WCT mass law in which closed-loop phase or winding conditions restrict effective mass to discrete geometric modes.","Curvature",9,"WCT-defined",""],
  ["Geometric Index","The WCT geometric index n_geo labeling the effective phase-velocity/topological branch of a confined mass state.","Topology",9,"WCT-defined","n_geo"],
  ["Effective Phase Velocity","The phase-propagation quantity associated with the geometric index n_geo in the Release 09 mass construction; it connects the confined path geometry to the effective propagation/mass channel.","Curvature",9,"WCT-defined","v_phase,eff"],
  ["Stable ψ-Identities","The set of WCT ψ-field identities or constraints retained by the stable confined configurations used in the mass-and-geometry construction.","Curvature",9,"WCT-defined","ψ"],
  ["Curvature Gap / Effective Mass Channel","The canonical WCT headword for the curvature-gap structure and the associated effective-mass channel through which geometric separation contributes to the confined state's inertial scale.","Curvature",9,"WCT-defined",""],
  ["Möbius Half-Twist Spin-1/2 Realization","The WCT topological realization of spin-1/2 through a half-twist or Möbius-like closed confinement geometry.","Topology",9,"WCT-defined","1/2"],

  ["Geometric Curvature Rate","The local WCT geometric rate combining path curvature and torsion into the invariant scale used by the loop-mass construction.","Curvature",10,"WCT-defined","σ(s)=√(κ²+τ²)"],
  ["Locking Functional","The Release 10 variational locking object whose minimizer enforces phase–geometry matching; the locked extremum satisfies θ′(s)=σ(s) under the stated assumptions.","Curvature",10,"WCT-defined","F_lock"],

  ["Wave-Constrained Computation","The WCC local-update computation model in which admissible computation is bounded by explicit wave, curvature, locality, precision, time, and resource rails and compared with classical Turing computation.","Computation",12,"WCT-defined","WCC"],

  ["Curvature Saturation Invariant","The Release 14 spin-dependent saturation relation fixing the allowed curvature partition in the Koide/curvature-harmonic construction.","Curvature",14,"WCT-defined","η²m² = 2s/(2s+1)"],
  ["Sobolev Control of the Regularized Denominator","The Sobolev-based estimate used in the WCT derivation to control D(ψ)=ψ+εe^(−α|ψ|²) and its boundedness/nonvanishing assumptions.","Curvature",14,"WCT-defined","D(ψ)=ψ+εe^(−α|ψ|²)"],
  ["Mass-Phase Geometry","The WCT geometric relation connecting confined phase/winding structure to the mass ratios and curvature harmonics used in the Koide-family construction.","Curvature",14,"WCT-defined",""],

  ["Logarithmic Curvature Operator","The WCT curvature-feedback operator expressed after the logarithmic field transform, used to expose the Hamilton–Jacobi/KPZ-like structure and analyze filament localization.","Curvature",16,"WCT-defined",""],

  ["Inverse-Koide square-root dilation","The Release 19 square-root dilation derived from the Koide-like geometry and tested as a candidate multiplicative spacing relation across the active-domain spectral structure.","Evidence",19,"WCT-defined",""],

  ["Collapse score","The Release 05 RCA composite diagnostic of semantic-coherence loss, entropy distortion, anchor loss, and related recursive degradation; Release 20 audits later evidence against that earlier diagnostic.","AI / drift",5,"WCT-defined",""],
  ["Symbolic criticality","The Release 05 RCA subcritical/critical/supercritical classification of recursive symbolic propagation relative to available correction; Release 20 treats it as an earlier RCA mechanism under validation audit.","AI / drift",5,"WCT-defined",""],
  ["Validation Meter","The Release 20 calibrated 0–10 evidence-strength scale used to grade how strongly later observations support an earlier RCA prediction or mechanism claim.","AI / drift",20,"WCT-defined","0–10"],
  ["Projection Anchor","A Release 20 audit convention that treats earlier milestone dates as trajectory windows for comparison, not as literal hard deadlines.","AI / drift",20,"WCT-defined",""],
  ["Mechanism-Level vs. Threshold-Level Validation","The RCA audit distinction between evidence supporting the proposed failure mechanism and evidence supporting a specific numerical threshold, timing, or deployment scale.","AI / drift",20,"WCT-defined",""],
  ["10–30 Recursion Window","The RCA projected recursion-count window in which recursive drift or instability was expected to become observable in the stated scenario.","AI / drift",20,"WCT-defined","10–30"],
  ["10+ Interacting-Agent Deployment Projection","The RCA projection that multi-agent recursive drift and correction pressure become operationally significant in deployments involving ten or more interacting agents.","AI / drift",20,"WCT-defined","10+ agents"],

  ["Wavefield commitment schemes","The WaveLock class of commitment constructions that bind an output to deterministic nonlinear wavefield evolution, serialization, and path-dependent geometric state before the final commitment/hash stage.","Computation",22,"WCT-defined",""]
];
const aliases={
  "Phase-coherence distortion scale":["Phase Distortion Scale"],
  "Vacuum coherence scale":["Vacuum Coherence Length"],
  "Topological Charge Quantization":["Quantized charge from topological winding"],
  "Regularized Denominator":["D(ψ)"],
  "Geometric Index":["n_geo"],
  "Effective Phase Velocity":["effective phase velocity"],
  "Curvature Gap / Effective Mass Channel":["Curvature Gap","Effective Mass Channel"],
  "Locking Functional":["F_lock"]
};
const base=Array.isArray(window.WCT_GLOSSARY_ALL)?window.WCT_GLOSSARY_ALL:[];
const map=new Map(base.map(t=>[String(t.name||'').toLocaleLowerCase(),t]));
for(const r of rows){
  const [name,definition,family,release,provenance,notation]=r;
  const incoming={name,definition,family,release,provenance,notation,source_title:titles[String(release)],aliases:aliases[name]||[]};
  const key=name.toLocaleLowerCase(),old=map.get(key);
  if(old)Object.assign(old,incoming);else{base.push(incoming);map.set(key,incoming);}
}
base.sort((a,b)=>String(a.name).localeCompare(String(b.name),'en',{sensitivity:'base'}));
window.WCT_GLOSSARY_ALL=base;
})();
