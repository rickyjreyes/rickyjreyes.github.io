window.overlapRecords=(window.overlapRecords||[]).concat([
[1000,"Engineering the winding number of a toroidal Bose condensate by accelerating dark solitons","https://doi.org/10.1103/l9b2-pt7r",9.7,"physics","Physical Review A","Xiao-Lin Li; Ming Gong; Yu-Hao Wang; Li-Chen Zhao","10.1103/l9b2-pt7r","https://doi.org/10.1103/l9b2-pt7r"],
[1001,"Charged-Lepton Koide Geometry from a Green-Dressed Compact Family Cycle","https://arxiv.org/abs/2605.10245",9.7,"physics","arXiv","Kirill Shulga","10.48550/arXiv.2605.10245","https://doi.org/10.48550/arXiv.2605.10245"],
[1002,"Torsion-induced gauge structure in curved quantum waveguides","https://arxiv.org/abs/2606.03725",9.6,"physics","arXiv","Xu-Yang Hou; Xianlong Gao; Hao Guo","10.48550/arXiv.2606.03725","https://doi.org/10.48550/arXiv.2606.03725"],
[1003,"Generation and manipulation of multipole and vortex events in (1+1)-dimensional spacetime","https://arxiv.org/abs/2608.00618",9.5,"physics","arXiv","Yiming Pan; Guowei Chen","10.48550/arXiv.2608.00618","https://doi.org/10.48550/arXiv.2608.00618"],
[1004,"Gravitational buckling of the complex ray: A geometric origin of the Schrödinger–Newton Soliton","https://doi.org/10.1016/j.physleta.2026.131477",9.4,"physics","Physics Letters A","Kenneth A. Menard","10.1016/j.physleta.2026.131477","https://doi.org/10.1016/j.physleta.2026.131477"],
[1005,"Mass Generation from Embedding Geometry in Surface Nematics","https://arxiv.org/abs/2605.19183",9.4,"physics","arXiv","J. A. Santiago; F. Monroy","10.48550/arXiv.2605.19183","https://doi.org/10.48550/arXiv.2605.19183"],
[1006,"Quantum statistical-gauge geometry","https://doi.org/10.1103/jb7b-rsfb",9.4,"physics","Physical Review E","Hai Pham-Van","10.1103/jb7b-rsfb","https://doi.org/10.1103/jb7b-rsfb"],
[1007,"Coupling between Phase Separation and Geometry on a Closed Elastic Curve: Free Energy Minimization and Dynamics","https://arxiv.org/abs/2602.22977",9.3,"physics","Journal of Chemical Physics","Hanchun Wang; Ronojoy Adhikari; Michael E. Cates","10.1063/5.0331589","https://doi.org/10.1063/5.0331589"],
[1008,"Topological soliton frequency comb in nanophotonic lithium niobate","https://doi.org/10.1038/s41586-026-10292-2",9.2,"physics","Nature","Nicolas Englebert; Robert M. Gray; Luis Ledezma; Ryoto Sekine; Thomas Zacharias; Rithvik Ramesh; Benjamin K. Gutierrez; Pedro Parra-Rivas; Alireza Marandi","10.1038/s41586-026-10292-2","https://doi.org/10.1038/s41586-026-10292-2"],
[1009,"Mass Law for Lepton Mass Hierarchy: Rubik’s Tetrahedral Spinor Structure and Self-Similar Geometric Origin","https://doi.org/10.20944/preprints202606.0502.v1",9.2,"physics","Preprints.org","Jau Tang; Qiang Tang; Chien-Cheng Chang","10.20944/preprints202606.0502.v1","https://doi.org/10.20944/preprints202606.0502.v1"],
[1010,"Local Sources of Phase Curvature and Rigidity in Finite Quantum Matter","https://arxiv.org/abs/2512.21940",9.1,"physics","arXiv","Riccardo Castagna","10.48550/arXiv.2512.21940","https://doi.org/10.48550/arXiv.2512.21940"],
[1011,"Curvature-amplified angular localization of radially localized states","https://arxiv.org/abs/2607.29174",9.0,"physics","arXiv","Hiroyuki Shima","10.48550/arXiv.2607.29174","https://doi.org/10.48550/arXiv.2607.29174"],
[1012,"Hidden Harmonic Structure of Fermion Masses and Flavor","https://arxiv.org/abs/2606.10405",9.0,"physics","arXiv","Petr Baron","10.48550/arXiv.2606.10405","https://doi.org/10.48550/arXiv.2606.10405"],
[1013,"Tuning the critical current in toroidal superfluids via controllable impurities","https://doi.org/10.1103/316q-596d",9.0,"physics","Physical Review A","K. Xhani; G. Del Pace; N. Grani; D. Hernández-Rajkov; B. Donelli; G. Roati; L. Pezzè","10.1103/316q-596d","https://doi.org/10.1103/316q-596d"]
]);

(() => {
  const records=window.overlapRecords||[];
  const physics=records.filter(r=>r[4]==='physics').sort((a,b)=>(b[3]-a[3])||(a[0]-b[0]));
  const ai=records.filter(r=>r[4]==='ai').sort((a,b)=>a[0]-b[0]);
  physics.forEach((r,i)=>{r[0]=i+1;});
  ai.forEach((r,i)=>{r[0]=physics.length+i+1;});
  window.overlapRecords=[...physics,...ai];
})();
