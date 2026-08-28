// Exact title-level and publication-level WCT terminology aliases identified in the 22-release audit.
// These entries make named constructions directly searchable without requiring inference from nearby glossary terms.
(() => {
const titles={
  "7":"Phase-Flux Field (PFF): Axiomatic Substrate for Wave Confinement Theory — Zero-Wave Invariance, Finite-k Lyapunov Band-Pass, Shell Quantization, and D4 to Continuum",
  "8":"Self-Emergent Fourier Cymatics: Entropic Eigenmodes out of Chaos",
  "10":"Rest Energy from Density-Weighted Loop Curvature: A Covariant Locking Principle",
  "11":"JUNO Energy Resolution and Detectability of WCT Ghost-Mode Neutrinos",
  "17":"Nuclear Fusion Tokamak with Self Sustaining Resonance",
  "18":"A Curvature-Induced Log-Periodic Deformation of C9(q²): Wave Confinement Theory and the LHCb B⁰ → K*⁰ μ⁺μ⁻ Anomaly",
  "19":"Log-Spectral Structure and Koide-Like Winding Geometry in Open-Data B⁰ → K*⁰ μ⁺μ⁻ Candidate Spectra",
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
  ["Bin-Stable Log-Periodic Structure","The named atomic open-data result class in which an inferred log-periodic frequency remains stable across declared histogram-bin choices and null checks.","Evidence",21,"WCT-defined",""]
];
const base=Array.isArray(window.WCT_GLOSSARY_ALL)?window.WCT_GLOSSARY_ALL:[];
const map=new Map(base.map(t=>[String(t.name||'').toLocaleLowerCase(),t]));
for(const r of rows){
  const [name,definition,family,release,provenance,notation]=r;
  const incoming={name,definition,family,release,provenance,notation,source_title:titles[String(release)]};
  const key=name.toLocaleLowerCase(),old=map.get(key);
  if(old)Object.assign(old,incoming);else{base.push(incoming);map.set(key,incoming);}
}
base.sort((a,b)=>String(a.name).localeCompare(String(b.name),'en',{sensitivity:'base'}));
window.WCT_GLOSSARY_ALL=base;
})();
