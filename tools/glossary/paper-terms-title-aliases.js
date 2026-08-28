// Exact title-level aliases and supplemental canonical WCT terminology identified in the 22-release audit.
// Supplemental rows make named constructions directly searchable without duplicating existing headwords.
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
  "14":"Wave Confinement Theory Predicts the Koide Mass Relation: A Curvature–Harmonic Origin of Fermion Mass Triplets",
  "17":"Nuclear Fusion Tokamak with Self Sustaining Resonance",
  "18":"A Curvature-Induced Log-Periodic Deformation of C9(q²): Wave Confinement Theory and the LHCb B⁰ → K*⁰ μ⁺μ⁻ Anomaly",
  "19":"Log-Spectral Structure and Koide-Like Winding Geometry in Open-Data B⁰ → K*⁰ μ⁺μ⁻ Candidate Spectra",
  "20":"Recursive AI Drift: A 2025 Prediction Timeline External Validation Audit and Technical Note",
  "21":"Bin-Stable Log-Periodic Structure in Public NIST Atomic Line List"
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

  ["Wave Curvature Scalar","The WCT scalar used to represent local wavefield curvature relative to the field amplitude and to supply the curvature quantity used by later feedback constructions.","Curvature",1,"WCT-defined","W_ψ"],
  ["Regularized Curvature Operator","The regularized WCT curvature operator that stabilizes the curvature-to-field ratio near small-amplitude or nodal regions.","Curvature",1,"WCT-defined","W_{ψ,ε} / Θ_ψ"],
  ["Torque Density","The local WCT torque-density quantity assigned to rotational structure in a confined field configuration.","Curvature",1,"WCT-defined","τ(x)"],
  ["Effective Mass","The effective inertial mass assigned in WCT to a confined resonant state from its energy and geometric or curvature structure.","Curvature",1,"WCT-defined","m_eff"],
  ["Curvature-Overlap Scattering Amplitude","The WCT transition amplitude formed from the overlap of initial and final states with curvature-dependent interaction weighting.","Curvature",1,"WCT-defined","A_fi"],
  ["Topological Charge Quantization","The WCT construction in which charge-like state labels become discrete through winding or other topological data of the confined field.","Topology",1,"WCT-defined",""],
  ["Curvature-Modified Dirac Equation","A Dirac-type field equation augmented by the WCT curvature-feedback contribution used to study spinor dynamics in a confined geometry.","Core field",1,"WCT-defined",""],
  ["Entropy-Action Term","The WCT action contribution used to encode entropy regulation or organization alongside the field and curvature dynamics.","Core field",1,"WCT-defined",""],
  ["Frequency-Domain Path Integral","A WCT path-integral representation written over spectral or frequency-domain histories of the confined field.","Spectral",1,"WCT-defined",""],
  ["Curvature-to-Zeta Transform Cascade","The proposed WCT transform chain that maps curvature-derived spectral information into a zeta-based spectral representation.","Spectral",1,"WCT-defined",""],
  ["Zeta Spectral Lattice of Coherent Standing Waves","The discrete standing-wave spectral lattice associated with the zeta-transform representation of coherent confined modes.","Spectral",1,"WCT-defined",""],
  ["Operator Quantization of Curvature Feedback","The WCT operator-level formulation in which curvature-feedback quantities are promoted into a quantized operator description.","Core field",1,"WCT-defined",""],

  ["Nonlinear Curvature Feedback Coefficient","The WCT coefficient controlling the strength of nonlinear curvature feedback in the physical-constants construction.","Curvature",2,"WCT-defined","θ"],
  ["Resonance Confinement Efficiency","The WCT efficiency parameter describing how effectively a resonant field state is maintained as a confined mode.","Core field",2,"WCT-defined","ρ"],
  ["Topological Resonance Index","The WCT index used to label or weight the topological contribution of a resonant confinement state.","Topology",2,"WCT-defined","β"],
  ["Phase Distortion Scale","The WCT scale parameter controlling the magnitude of phase distortion associated with the confinement geometry.","Core field",2,"WCT-defined","γ"],
  ["Vacuum Coherence Length","The WCT characteristic length scale assigned to coherence of the vacuum or background field in the constants construction.","Core field",2,"WCT-defined","ξ"],
  ["Phase-Speed Curvature Correction Coefficient","The WCT coefficient governing the curvature-dependent correction applied to phase propagation speed.","Curvature",2,"WCT-defined","ζ"],
  ["Resonance Units","The WCT normalization or unit convention used to express quantities derived from resonance-confinement parameters.","Core field",2,"WCT-defined","R"],
  ["Domain-Local Redefinitions from Resonance Confinement","The WCT proposal that selected effective quantities may be re-expressed locally as functions of the resonance-confinement state of a domain.","Core field",2,"WCT-defined",""],

  ["Hard Upper Bound on Spatial Dimensionality","The WCT dimensionality result that, under the paper's stated regularity and confinement assumptions, the admissible spatial dimension satisfies n_max=3.","Stability",6,"WCT-defined","n_max=3"],
  ["Covariant Curvature-Feedback Operator","The covariant form of the WCT curvature-feedback operator used in the dimensionality analysis.","Curvature",6,"WCT-defined","Q[ψ]"],
  ["Six-Route Convergence","The dimensionality paper's convergence of six stated analytical or structural routes on the same three-spatial-dimension bound.","Stability",6,"WCT-defined",""],
  ["Symbolic Entropy Functional","The field-dependent entropy functional used as one route in the WCT dimensional-stability argument.","Stability",6,"WCT-defined","S[ψ]"],
  ["Entropy Localization","The WCT localization condition applied to entropy or entropy-bearing field structure in the dimensionality analysis.","Stability",6,"WCT-defined",""],
  ["Dimensional Collapse Trichotomy","The paper's three-branch classification of how confinement fails, destabilizes, or reduces when the admissible dimensional regime is exceeded.","Stability",6,"WCT-defined",""],
  ["Rotation-Confinement Projector","The WCT projector or locking criterion selecting the fully rotation-confined sector used in the dimensionality argument.","Stability",6,"WCT-defined","W=1"],
  ["Exact Dimensional Scaling Constant","The dimension-dependent constant appearing in the paper's exact scaling estimate for the confinement quantity.","Stability",6,"WCT-defined","C_n(σ)"],
  ["Loss of Link-Locking for n≥4","The WCT dimensionality claim that the declared link-locking confinement mechanism is lost once spatial dimensionality reaches four or higher under the paper's assumptions.","Topology",6,"WCT-defined","n≥4"],

  ["Loop-Quantized Mass Law","The WCT mass law in which closed-loop phase or winding conditions restrict the effective mass to discrete geometric modes.","Curvature",9,"WCT-defined",""],
  ["Geometric Curvature Rate","The local WCT geometric rate combining path curvature and torsion into the invariant scale used by the loop-mass construction.","Curvature",10,"WCT-defined","σ(s)"],
  ["Geometric Index","The WCT geometric mode index used to label discrete topology or winding branches of a confined mass state.","Topology",9,"WCT-defined","n_geo"],
  ["Stable ψ-Identities","The set of WCT ψ-field identities or constraints retained by the stable confined configurations used in the mass-and-geometry construction.","Curvature",9,"WCT-defined","ψ"],
  ["Curvature Gap / Effective Mass Channel","The canonical combined WCT headword for the curvature-gap structure and the associated channel through which that geometric separation contributes to effective mass; aliases: Curvature Gap and Effective Mass Channel.","Curvature",9,"WCT-defined",""],
  ["Möbius Half-Twist Spin-1/2 Realization","The WCT topological realization of spin-1/2 through a half-twist or Möbius-like closed confinement geometry.","Topology",9,"WCT-defined","1/2"],

  ["Curvature Saturation Invariant","The WCT invariant associated with saturation of the selected curvature partition in the Koide/curvature-harmonic construction.","Curvature",14,"WCT-defined",""],
  ["Sobolev Control of the Regularized Denominator","The Sobolev-based estimate used in the WCT derivation to control the regularized curvature denominator and its boundedness assumptions.","Curvature",14,"WCT-defined",""],

  ["Collapse score","An RCA composite diagnostic of semantic coherence loss, entropy distortion, anchor loss, and related recursive degradation.","AI / drift",5,"WCT-defined",""],
  ["Symbolic criticality","The RCA subcritical, critical, and supercritical classification of recursive symbolic propagation relative to available correction.","AI / drift",5,"WCT-defined",""],
  ["Validation Meter","The RCA audit-facing diagnostic used to summarize how strongly later external evidence matches an earlier prediction or mechanism claim.","AI / drift",20,"WCT-defined",""],
  ["Projection Anchor","A fixed earlier RCA prediction or dated statement used as the reference anchor when comparing later observations against the original projection.","AI / drift",20,"WCT-defined",""],
  ["Mechanism-Level vs. Threshold-Level Validation","The RCA audit distinction between evidence supporting the proposed failure mechanism and evidence supporting a specific numerical threshold, timing, or deployment scale.","AI / drift",20,"WCT-defined",""],
  ["10–30 Recursion Window","The RCA projected recursion-count window in which recursive drift or instability was expected to become observable in the stated scenario.","AI / drift",20,"WCT-defined","10–30"],
  ["10+ Interacting-Agent Deployment Projection","The RCA projection that multi-agent recursive drift and correction pressure become operationally significant in deployments involving ten or more interacting agents.","AI / drift",20,"WCT-defined","10+ agents"]
];
const aliases={"Curvature Gap / Effective Mass Channel":["Curvature Gap","Effective Mass Channel"]};
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
