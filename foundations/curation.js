(() => {
  const path = location.pathname.replace(/index\.html$/i, '');
  if (path !== '/foundations/') return;

  const coreWct = [
    ['The Geometry of Resonance','2025-04-22','Geometric framework for confinement, mass, force, spectra, and emergent spacetime.','https://doi.org/10.5281/zenodo.15644222'],
    ['Structure and Derivation of Physical Constants through Wave Confinement','2025-04-26','Physical-constant derivation program from resonance geometry and confinement.','https://doi.org/10.5281/zenodo.15596159'],
    ['Hard Upper Bound on Spatial Dimensionality in Wave Confinement Theory','2025-08-13','Sobolev-embedding-based dimensional bound under WCT confinement assumptions.','https://doi.org/10.5281/zenodo.17081283'],
    ['Phase-Flux Field (PFF)','2025-09-08','Axiomatic substrate: zero-wave invariance, finite-k Lyapunov band-pass, shell quantization, and D4-to-continuum construction.','https://doi.org/10.5281/zenodo.17578766'],
    ['Self-Emergent Fourier Cymatics','2025-09-16','Finite-band spectral emergence, mode competition, entropy reduction, and eigenmode-like organization.','https://doi.org/10.5281/zenodo.17732648'],
    ['Resonant Cavity of Vector Fields','2025','Finite-band instability, nonlinear mode competition, localization, and emergent-mass structure.','https://doi.org/10.5281/zenodo.17371795'],
    ['Emergence of Effective Mass via Solenoidal Topology of Vibrational Energy','2025-10-27','Effective mass from confined energy on curved, torsional, and solenoidal paths.','https://doi.org/10.5281/zenodo.17459463'],
    ['Rest Energy from Density-Weighted Loop Curvature','2025-11-11','Density-weighted loop-curvature locking relation for rest energy and inertial mass.','https://doi.org/10.5281/zenodo.20533537']
  ];

  const groups = [
    {
      id:'math',
      kicker:'Canonical external substrate · 12 sources',
      title:'Nonlinear waves, localization, PDE, and stability',
      lede:'The mathematical machinery most directly used to ask whether confined nonlinear states exist, remain localized, select finite scales, and avoid collapse or dispersion.',
      rows:[
        ['Derrick — Comments on Nonlinear Wave Equations as Models for Elementary Particles','G. H. Derrick','1964','Scaling obstruction for static localized nonlinear field configurations.','https://doi.org/10.1063/1.1704233','No-go / scaling'],
        ['Swift & Hohenberg — Hydrodynamic Fluctuations at the Convective Instability','J. Swift · P. C. Hohenberg','1977','Finite-wavenumber instability and intrinsic pattern-scale selection.','https://doi.org/10.1103/PhysRevA.15.319','Finite-k selection'],
        ['Cross & Hohenberg — Pattern Formation Outside of Equilibrium','M. C. Cross · P. C. Hohenberg','1993','Bifurcation, nonlinear saturation, wavelength selection, and stability.','https://doi.org/10.1103/RevModPhys.65.851','Pattern formation'],
        ['Aranson & Kramer — The World of the Complex Ginzburg-Landau Equation','I. S. Aranson · L. Kramer','2002','Coherent structures, defects, instability, mode competition, and attractors.','https://doi.org/10.1103/RevModPhys.74.99','Nonlinear dynamics'],
        ['Zakharov & Shabat — Exact Theory of Self-Focusing and Self-Modulation','V. E. Zakharov · A. B. Shabat','1972','Foundational nonlinear-wave precedent for self-focusing and localized soliton behavior.','https://www.jetp.ras.ru/cgi-bin/dn/e_034_01_0062','Self-localization'],
        ['Lions — Concentration-Compactness Principle','P.-L. Lions','1984','Prevents minimizing sequences from vanishing or splitting in localization existence arguments.','https://doi.org/10.1016/S0294-1449(16)30428-0','Existence / compactness'],
        ['Pohozaev — Eigenfunctions of Δu + λf(u) = 0','S. I. Pohozaev','1965','Integral identities that constrain stationary nonlinear PDE solutions.','https://www.mathnet.ru/eng/dan31757','No-go / identity'],
        ['Adams & Fournier — Sobolev Spaces','R. A. Adams · J. J. F. Fournier','2003','Embedding, regularity, compactness, and norm control relevant to H² confinement arguments.','https://shop.elsevier.com/books/sobolev-spaces/adams/978-0-12-044143-3','Sobolev analysis'],
        ['Evans — Partial Differential Equations','L. C. Evans','2010','Weak solutions, variational methods, elliptic/parabolic estimates, and regularity.','https://bookstore.ams.org/gsm-19-r','PDE foundations'],
        ['Pazy — Semigroups of Linear Operators and Applications to PDEs','A. Pazy','1983','Semigroup framework for evolution equations and well-posedness.','https://link.springer.com/book/10.1007/978-1-4612-5561-1','Evolution equations'],
        ['Henry — Geometric Theory of Semilinear Parabolic Equations','D. Henry','1981','Dynamical-systems treatment of semilinear PDE stability and invariant structure.','https://link.springer.com/book/10.1007/BFb0089647','PDE dynamics'],
        ['Reed & Simon — Methods of Modern Mathematical Physics IV','M. Reed · B. Simon','1978','Spectral and operator theory for bound states, discrete modes, and eigenvalue structure.','https://scholars.duke.edu/publication/1163835','Spectral theory']
      ]
    },
    {
      id:'geometry',
      kicker:'Canonical external substrate · 8 sources',
      title:'Geometry, topology, phase, and gauge structure',
      lede:'The established geometric language behind curvature, winding, closed loops, geometric phase, and topological constraints.',
      rows:[
        ['Fenchel — Über Krümmung und Windung geschlossener Raumkurven','W. Fenchel','1929','Classical relation between curvature and closed spatial curves.','https://eudml.org/doc/159330','Closed-curve curvature'],
        ['Fáry — Sur la courbure totale d’une courbe gauche faisant un nœud','I. Fáry','1949','Curvature lower bounds for knotted closed curves.','https://doi.org/10.24033/bsmf.1405','Topological curvature'],
        ['Milnor — On the Total Curvature of Knots','J. W. Milnor','1950','Topological constraints on total curvature for knotted curves.','https://doi.org/10.2307/1969467','Knot curvature'],
        ['Nakahara — Geometry, Topology and Physics','M. Nakahara','2003','Standard bridge from differential geometry and topology to gauge fields, bundles, and winding.','https://www.routledge.com/Geometry-Topology-and-Physics/Nakahara/p/book/9781138413368','Geometry / topology'],
        ['Berry — Quantal Phase Factors Accompanying Adiabatic Changes','M. V. Berry','1984','Geometric phase as a physically observable structure under cyclic evolution.','https://doi.org/10.1098/rspa.1984.0023','Geometric phase'],
        ['Wilczek & Zee — Appearance of Gauge Structure in Simple Dynamical Systems','F. Wilczek · A. Zee','1984','Gauge structure emerging from parameter-dependent dynamical evolution.','https://doi.org/10.1103/PhysRevLett.52.2111','Gauge geometry'],
        ['Aharonov & Bohm — Significance of Electromagnetic Potentials in Quantum Theory','Y. Aharonov · D. Bohm','1959','Phase sensitivity to gauge potentials and nonlocal topological structure.','https://doi.org/10.1103/PhysRev.115.485','Phase / gauge'],
        ['do Carmo — Riemannian Geometry','M. P. do Carmo','1992','Curvature, geodesics, manifolds, and the differential-geometric framework used by WCT constructions.','https://link.springer.com/book/10.1007/978-1-4757-2201-7','Differential geometry']
      ]
    },
    {
      id:'physics',
      kicker:'Canonical external substrate · 9 sources',
      title:'Wave, quantum, relativistic, and field-theory substrate',
      lede:'The established physical framework that fixes the quantities WCT attempts to reproduce, reinterpret, or derive geometrically.',
      rows:[
        ['Einstein — Does the Inertia of a Body Depend Upon Its Energy Content?','A. Einstein','1905','Mass-energy equivalence and the rest-energy target any emergent-mass theory must recover.','https://doi.org/10.1002/andp.19053231314','Mass-energy'],
        ['Planck — Law of Energy Distribution in the Normal Spectrum','M. Planck','1901','Energy quantization and the historical origin of discrete quantum structure.','https://doi.org/10.1002/andp.19013090310','Quantum energy'],
        ['de Broglie — Recherches sur la théorie des quanta','L. de Broglie','1924','Matter-wave relation linking momentum, wavelength, and phase structure.','https://theses.hal.science/tel-00006807','Matter waves'],
        ['Schrödinger — Quantisierung als Eigenwertproblem','E. Schrödinger','1926','Wave-mechanical eigenvalue structure and stationary-state quantization.','https://doi.org/10.1002/andp.19263840404','Wave mechanics'],
        ['Einstein — The Foundation of the General Theory of Relativity','A. Einstein','1916','Spacetime geometry, curvature, and gravitational dynamics.','https://doi.org/10.1002/andp.19163540702','Relativity'],
        ['Dirac — The Quantum Theory of the Electron','P. A. M. Dirac','1928','Relativistic quantum wave equation and spinor structure.','https://doi.org/10.1098/rspa.1928.0023','Relativistic quantum theory'],
        ['Wald — General Relativity','R. M. Wald','1984','Modern mathematical formulation of spacetime geometry and gravitational field equations.','https://press.uchicago.edu/ucp/books/book/chicago/G/bo5952261.html','General relativity'],
        ['Peskin & Schroeder — An Introduction to Quantum Field Theory','M. E. Peskin · D. V. Schroeder','1995','Standard quantum-field-theory framework and particle-interaction baseline.','https://www.routledge.com/An-Introduction-To-Quantum-Field-Theory/Peskin-Schroeder/p/book/9780201503975','Quantum field theory'],
        ['Weinberg — The Quantum Theory of Fields','S. Weinberg','1995','Field-theoretic symmetry, particles, interactions, and effective-description baseline.','https://www.cambridge.org/core/books/quantum-theory-of-fields/','Quantum field theory']
      ]
    },
    {
      id:'information',
      kicker:'Supporting external substrate · 4 sources',
      title:'Information and statistical-mechanical structure',
      lede:'Sources used when WCT discusses entropy, information, ensembles, and physical bounds on state organization.',
      rows:[
        ['Boltzmann — Studies on the Thermal Equilibrium of Gas Molecules','L. Boltzmann','1872','Statistical-mechanical entropy and irreversible macroscopic behavior from microscopic dynamics.','https://doi.org/10.1007/BF01565292','Statistical mechanics'],
        ['Shannon — A Mathematical Theory of Communication','C. E. Shannon','1948','Information entropy and quantitative information structure.','https://doi.org/10.1002/j.1538-7305.1948.tb01338.x','Information theory'],
        ['Jaynes — Information Theory and Statistical Mechanics','E. T. Jaynes','1957','Maximum-entropy connection between information and statistical mechanics.','https://doi.org/10.1103/PhysRev.106.620','Max entropy'],
        ['Bekenstein — Universal Upper Bound on the Entropy-to-Energy Ratio for Bounded Systems','J. D. Bekenstein','1981','Physical bound connecting entropy, energy, and bounded spatial systems.','https://doi.org/10.1103/PhysRevD.23.287','Physical information bound']
      ]
    }
  ];


  // The historical 47-reference table in index.html and the 33-reference curated
  // view overlap, but are not identical. Preserve the union before adding leads.
  const addGroup=(id,title,lede,kicker)=>{
    let g=groups.find(x=>x.id===id);
    if(!g){g={id,title,lede,kicker,rows:[]};groups.push(g);}
    return g;
  };
  const normalizedTitle=s=>String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/^.*?—\s*/,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const normalizedURL=s=>String(s).replace(/^https?:\/\/(dx\.)?doi\.org\//i,'doi:').replace(/\/$/,'').toLowerCase();
  const seenUrls=new Set(groups.flatMap(g=>g.rows.map(r=>normalizedURL(r[4]))));
  const seenTitles=new Set(groups.flatMap(g=>g.rows.map(r=>normalizedTitle(r[0]))));
  const originalIndexRows=(typeof R!=='undefined' && Array.isArray(R))?R:[];
  const destination=rank=>rank<=10?'math':rank<=20?'geometry':rank<=30?'dynamics':rank<=37?'empirical':'physics';
  const destinations={
    math:['Nonlinear waves, localization, PDE and stability','Existence, scaling, critical dimension and numerical stability.'],
    geometry:['Geometry, topology, phase and gauge','Closed-curve geometry, phase, flux and winding.'],
    dynamics:['Confinement mechanisms and wave dynamics','Dynamical, optical and structural mechanisms; analogues are not WCT validation.'],
    empirical:['Empirical inference, measurement and falsification','Experimental anchors and methods for testing background, selection and statistical significance.'],
    physics:['Quantum, relativistic and field-theory substrate','Physical baselines and historically established wave theory.']
  };
  originalIndexRows.forEach(r=>{
    const url=normalizedURL(r[5]), title=normalizedTitle(r[1]);
    if(seenUrls.has(url)||seenTitles.has(title))return;
    const id=destination(r[0]),d=destinations[id],g=addGroup(id,d[0],d[1],'Existing indexed prior literature');
    g.rows.push([r[1],r[2],r[3],r[4],r[5],r[7]]);
    seenUrls.add(url);seenTitles.add(title);
  });
  // Each row: supplement priority, title, author(s), year, contribution, primary
  // URL, domain, bibliography-trace classification, optional companion URL.
  // A verified first-edge citation is not evidence for a later thematic edge.
  const leads=[
    [1,'Grillakis, Shatah & Strauss — Stability theory of solitary waves in the presence of symmetry, I & II','M. Grillakis · J. Shatah · W. Strauss','1987 / 1990','General orbital-stability framework; verify Hamiltonian, spectral and symmetry hypotheses for WCT.','https://doi.org/10.1016/0022-1236(87)90044-9','Orbital stability','Stability-framework extension','https://doi.org/10.1016/0022-1236(90)90016-E'],
    [2,'Cazenave & Lions — Orbital stability of standing waves for some nonlinear Schrödinger equations','T. Cazenave · P.-L. Lions','1982','Variational orbital stability, distinct from persistence of a discrete numerical trajectory.','https://doi.org/10.1007/BF01403504','Orbital stability','Directly cited by Lions (1984)'],
    [3,'Berestycki & Lions — Nonlinear scalar field equations I: Existence of a ground state','H. Berestycki · P.-L. Lions','1983','Assumptions for nontrivial localized stationary states; compare domain, nonlinearity and signs.','https://doi.org/10.1007/BF00250555','Ground states','Directly cited by Lions (1984)'],
    [4,'Weinstein — Sharp interpolation estimates; modulational stability of ground states','M. I. Weinstein','1983 / 1985','Sharp threshold inequalities and modulational stability; check conserved quantities before transferring methods.','https://doi.org/10.1007/BF01208265','Threshold stability','Thematic extension','https://doi.org/10.1137/0516034'],
    [5,'Brezis & Wainger — Limiting cases of Sobolev embeddings and convolution inequalities','H. Brezis · S. Wainger','1980','Critical-endpoint substitutes in 4D; failure of ordinary embedding is not a finite-lifetime theorem.','https://doi.org/10.1080/03605308008820154','Critical embeddings','Thematic extension'],
    [6,'Adams — A sharp inequality of J. Moser for higher order derivatives','D. R. Adams','1988','Higher-order critical regularity estimates with explicit function-space hypotheses.','https://doi.org/10.2307/1971445','Critical embeddings','Thematic extension'],
    [7,'Hairer, Lubich & Wanner — Geometric Numerical Integration (2nd ed.)','E. Hairer · C. Lubich · G. Wanner','2006','Long-time error, geometric integrators and structure preservation under method-specific assumptions.','https://doi.org/10.1007/3-540-30666-8','Numerical verification','Thematic extension'],
    [8,'Kassam & Trefethen — Fourth-order time-stepping for stiff PDEs','A.-K. Kassam · L. N. Trefethen','2005','Independent integrator comparator under matched spatial grid and error tolerance.','https://doi.org/10.1137/S1064827502410633','Numerical verification','Thematic extension'],
    [9,'Dauncey et al. — Handling uncertainties in background shapes: the discrete profiling method','P. D. Dauncey et al.','2015','Account for background-model choice in CMS/ATLAS significance and predictive comparisons.','https://doi.org/10.1088/1748-0221/10/04/P04015','Background uncertainty','Methodological extension'],
    [10,'Mandel, Farr & Gair — Extracting distribution parameters from multiple uncertain observations with selection biases','I. Mandel · W. M. Farr · J. R. Gair','2019','Explicit population/selection functions for hierarchical GWTC inference.','https://doi.org/10.1093/mnras/stz896','Selection bias','Methodological extension'],
    [11,'Gross & Vitells — Trial factors for the look elsewhere effect in high energy physics','E. Gross · O. Vitells','2010','Differentiate searched-frequency trials from truly frozen prospective frequencies.','https://doi.org/10.1140/epjc/s10052-010-1470-8','Trials factors','Bibliography bridge to Davies (1977)'],
    [12,'Davies — Hypothesis testing when a nuisance parameter is present only under the alternative','R. B. Davies','1977','Null calibration when tested frequency or peak position is unidentified under the null.','https://doi.org/10.1093/biomet/64.2.247','Nuisance parameters','Directly cited by Gross & Vitells'],
    [13,'Cowan et al. — Asymptotic formulae for likelihood-based tests of new physics','G. Cowan · K. Cranmer · E. Gross · O. Vitells','2011','Check likelihood asymptotics, boundary effects, small counts and simulation-calibration needs.','https://doi.org/10.1140/epjc/s10052-011-1554-0','Likelihood tests','Methodological extension'],
    [14,'Vaughan — A Bayesian test for periodic signals in red noise','S. Vaughan','2010','Structured-noise controls; red-noise assumptions are not automatically the GWTC null.','https://doi.org/10.1111/j.1365-2966.2009.15868.x','Noise models','Supporting methodology'],
    [15,'Clauset, Shalizi & Newman — Power-law distributions in empirical data','A. Clauset · C. R. Shalizi · M. E. J. Newman','2009','Distribution goodness-of-fit, estimation and alternative-model comparison.','https://doi.org/10.1137/070710111','Distribution tests','Supporting methodology'],
    [16,'Strauss — Existence of solitary waves in higher dimensions','W. A. Strauss','1977','Existence in higher dimensions does not by itself establish stability or lifetime.','https://doi.org/10.1007/BF01626517','Solitary-wave existence','Directly cited by Lions (1984)'],
    [17,'Coleman, Glaser & Martin — Action minima among solutions to a class of Euclidean scalar field equations','S. Coleman · V. Glaser · A. Martin','1978','Variational action minimization; compare stationary functional with actual WCT evolution.','https://doi.org/10.1007/BF01609421','Variational methods','Directly cited by Lions (1984)'],
    [18,'Berestycki & Lions — Nonlinear scalar field equations II: Existence of infinitely many solutions','H. Berestycki · P.-L. Lions','1983','Conditional multiplicity of solutions; not a lifetime or stability result.','https://doi.org/10.1007/BF00250556','Solution multiplicity','Directly cited by Lions (1984)'],
    [19,'Kenig & Merle — Global well-posedness, scattering and blow-up for the energy-critical focusing NLS in the radial case','C. E. Kenig · F. Merle','2006','Threshold dynamics separating global existence, scattering and blow-up in a specified model.','https://doi.org/10.1007/s00222-006-0011-4','Critical dynamics','Thematic extension'],
    [20,'Hochbruck & Ostermann — Exponential integrators','M. Hochbruck · A. Ostermann','2010','Review of exponential-integrator methods and stability/error conditions.','https://doi.org/10.1017/S0962492910000048','Numerical verification','Thematic extension'],
    [21,'Choudalakis — On hypothesis testing, trials factor, hypertests and the BumpHunter','G. Choudalakis','2011','Prespecified whole-search statistics for bump finding; avoid double-charging frozen holdouts.','https://arxiv.org/abs/1101.0390','Hypertests','Methodological extension'],
    [22,'Bovy, Hogg & Roweis — Extreme Deconvolution','J. Bovy · D. W. Hogg · S. T. Roweis','2011','Inference of distributions with noisy, heterogeneous and incomplete observations.','https://doi.org/10.1214/10-AOAS439','Measurement error','Directly cited by Mandel et al. (2019)'],
    [23,'Hogg, Myers & Bovy — Inferring the eccentricity distribution','D. W. Hogg · A. D. Myers · J. Bovy','2010','Hierarchical population modeling as a methodological comparison, not a GWTC-signal prediction.','https://doi.org/10.1088/0004-637X/725/2/2166','Hierarchical inference','Directly cited by Mandel et al. (2019)'],
    [24,'Skyrme — A unified field theory of mesons and baryons','T. H. R. Skyrme','1962','Nonlinear/topological field stabilization as a distinct physical comparator.','https://doi.org/10.1016/0029-5582(62)90775-7','Topological solitons','Physical analogue'],
    [25,'Coleman — Q-balls','S. Coleman','1985','Charge-supported localized field states; requires appropriate symmetry and charge.','https://doi.org/10.1016/0550-3213(85)90286-X','Non-topological solitons','Physical analogue'],
    [26,'Vakhitov & Kolokolov — Stationary solutions of the wave equation in a medium with nonlinearity saturation','N. G. Vakhitov · A. A. Kolokolov','1973','Model-dependent localized-branch stability diagnostic, not generally sufficient alone.','https://doi.org/10.1007/BF01031343','Spectral stability','Physical/mathematical analogue'],
    [27,'Faddeev & Niemi — Stable knot-like structures in classical field theory','L. Faddeev · A. J. Niemi','1997','Knot-like field solutions as a comparative model, not empirical support for WCT.','https://doi.org/10.1038/387058a0','Knot solitons','Supporting physical analogue'],
    [28,'Hsu et al. — Bound states in the continuum','C. W. Hsu et al.','2016','Survey of physical localization inside radiation continua, distinct from claims of nonlinear energy storage.','https://doi.org/10.1038/natrevmats.2016.48','Bound states in continuum','Bibliography bridge to Friedrich–Wintgen and Zhen'],
    [29,'Friedrich & Wintgen — Interfering resonances and bound states in the continuum','H. Friedrich · D. Wintgen','1985','Interference-induced confinement; compare open-channel and symmetry assumptions.','https://doi.org/10.1103/PhysRevA.32.3231','Interference confinement','Directly cited by Hsu et al. (2016)'],
    [30,'Zhen et al. — Topological nature of optical bound states in the continuum','B. Zhen et al.','2014','Topology and robustness of optical BICs under model-specified perturbations.','https://doi.org/10.1103/PhysRevLett.113.257401','Topological BICs','Directly cited by Hsu et al. (2016)'],
    [31,'von Neumann & Wigner — Über merkwürdige diskrete Eigenwerte','J. von Neumann · E. Wigner','1929','Early construction of embedded eigenvalues; historical confinement precedent.','https://www.nature.com/articles/natrevmats201648','Embedded eigenvalues','Historical work cited by Hsu et al. (2016)'],
    [32,'Galiffi et al. — Photonics of time-varying media','E. Galiffi et al.','2022','Time-modulated electromagnetic media; distinguish modulation energy input from passive storage.','https://doi.org/10.1117/1.AP.4.1.014002','Temporal media','Supporting physical analogue'],
    [33,'Lustig, Sharabi & Segev — Topology of photonic time-crystals','E. Lustig · Y. Sharabi · M. Segev','2018','Active time-modulation topology; not equivalent to passive long-term confinement.','https://arxiv.org/abs/1803.08731','Time-crystal topology','Supporting physical analogue'],
    [34,'Chow et al. — A Lyapunov-based Approach to Safe Reinforcement Learning','Y. Chow et al.','2018','Formal constrained-control reference; requires correct constrained-MDP assumptions.','https://arxiv.org/abs/1805.07708','Safe control','RCA methodological analogue'],
    [35,'Leveson — Engineering a Safer World: Systems Thinking Applied to Safety','N. G. Leveson','2012','Systems-theoretic safety constraints, losses and control-loop analysis.','https://doi.org/10.7551/mitpress/8179.001.0001','Systems safety','RCA methodological analogue'],
    [36,'Watts — A simple model of global cascades on random networks','D. J. Watts','2002','Threshold model of network propagation; assumptions differ from autonomous agents.','https://doi.org/10.1073/pnas.082090499','Cascade theory','RCA methodological analogue'],
    [37,'Motter & Lai — Cascade-based attacks on complex networks','A. E. Motter · Y.-C. Lai','2002','Load redistribution and cascading failure as a failure-propagation comparator.','https://doi.org/10.1103/PhysRevE.66.065102','Cascading failure','RCA methodological analogue'],
    [38,'Everitt et al. — Reinforcement learning with a corrupted reward channel','T. Everitt et al.','2017','Reward corruption model relevant to distinguishing feedback integrity from optimization.','https://arxiv.org/abs/1705.08417','Reward integrity','RCA methodological analogue'],
    [39,'Hubinger et al. — Risks from Learned Optimization in Advanced Machine Learning Systems','E. Hubinger et al.','2019','Objective mismatch and learned optimizers as a risk framework, not proof of present capabilities.','https://arxiv.org/abs/1906.01820','Mesa-optimization','RCA conceptual analogue'],
    [40,'Bikhchandani, Hirshleifer & Welch — A Theory of Fads, Fashion, Custom, and Cultural Change as Informational Cascades','S. Bikhchandani · D. Hirshleifer · I. Welch','1992','Information cascades in decision networks; human-agent assumptions differ from LLMs.','https://doi.org/10.1086/261849','Information cascades','RCA conceptual analogue'],
    [41,'Leike et al. — AI Safety Gridworlds','J. Leike et al.','2017','Controlled demonstrations of specification and safety failures; toy setting limitations.','https://arxiv.org/abs/1711.09883','Safety benchmarks','RCA testing method'],
    [42,'Achiam et al. — Constrained Policy Optimization','J. Achiam et al.','2017','Constrained RL optimization; expected constraints are not pointwise physical guarantees.','https://arxiv.org/abs/1705.10528','Constrained optimization','RCA methodological analogue']
  ];
  const mainPriorities=new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,16,17,19,20,21,24,25,26,28,29,30]);
  const extensionDestination=n=>[9,10,11,12,13,21].includes(n)?'empirical':[24,25,26,28,29,30].includes(n)?'dynamics':'math';
  const extensionGroups={
    math:['Nonlinear waves, localization, PDE and stability','Original foundations and new proof obligations for D4 existence, critical regularity, stability, lifetime and temporal refinement.'],
    dynamics:['Confinement mechanisms and wave dynamics','Other mathematically specified ways confined states may arise; analogues are not evidence of WCT equivalence.'],
    empirical:['Empirical inference, measurement and falsification','Measurement references and prespecified tests for background, selection, trials and robust signal inference.']
  };
  const support=addGroup('supporting','Extended technical bibliography','Additional methodological, astrophysical and photonic context, not promoted to independent confirmations.','Nine supporting backward-citation leads');
  const rca=addGroup('rca','RCA: recursive correction, safety and cascading systems','Pre-2025 literature relevant to the separate RCA research program, presented on this same page without treating AI-safety models as WCT validation.','Nine RCA-specific foundational leads');
  leads.forEach(l=>{
    const n=l[0],isMain=mainPriorities.has(n);
    let target;
    if(n>=34)target=rca;
    else if(!isMain)target=support;
    else {
      const id=extensionDestination(n), d=extensionGroups[id];
      target=addGroup(id,d[0],d[1],'Established foundations and high-priority backward-citation additions');
      target.title=d[0];target.lede=d[1];target.kicker='Established foundations and backward-citation additions';
    }
    const suffix='[B'+String(n).padStart(2,'0')+'] ';
    target.rows.push([suffix+l[1],l[2],l[3],l[4]+' Relationship: '+l[7]+'.',l[5],l[6],l[7],l[8]||'']);
  });
  const totalExternal=groups.reduce((n,g)=>n+g.rows.length,0);

  const esc = (s) => String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const renderRows = rows => rows.map((r,i) => `<tr><td class="rank">${i+1}</td><td class="work"><a href="${esc(r[4])}" target="_blank" rel="noopener noreferrer">${esc(r[0])}</a><span>${esc(r[1])}</span></td><td class="year">${esc(r[2])}</td><td class="relevance">${esc(r[3])}</td><td class="source"><span class="tag">${esc(r[5])}</span></td></tr>`).join('');

  const run = () => {
    const main = document.querySelector('.foundation-shell');
    const head = document.querySelector('.foundation-head');
    if (!main || !head || document.getElementById('wct-foundation-curated')) return;
    document.documentElement.dataset.foundationCurated = 'true';
    document.title = 'Scientific Foundations of Wave Confinement Theory | Richard J. Reyes';

    const eyebrow = head.querySelector('.eyebrow');
    const h1 = head.querySelector('h1');
    const intro = head.querySelector('h1 + p');
    if (eyebrow) eyebrow.textContent = 'Canonical substrate · WCT core · established prior literature';
    if (h1) h1.textContent = 'Scientific Foundations of Wave Confinement Theory';
    if (intro) intro.textContent = 'One indexed page for the established mathematical, physical, statistical, and RCA literature relevant to the WCT/RCA research programs, together with the canonical WCT Core papers. New backward-citation leads are explicitly labeled; a methodological resemblance is not independent validation.';

    const boundary = head.querySelector('.boundary');
    if (boundary) boundary.innerHTML = '<strong>Foundation scope.</strong> This single page collects pre-2025 WCT and RCA foundations, empirical testing methods, and the eight WCT Core records. The B01–B42 labels are supplement priorities, not global relevance ranks, independent replications, or claims of intellectual adoption.';

    const actions = head.querySelector('.actions');
    if (actions) actions.innerHTML = '<a class="primary" href="#wct-core">WCT Core</a><a href="#math">PDE & stability</a><a href="#empirical">Empirical tests</a><a href="#dynamics">Confinement</a><a href="#supporting">Further reading</a><a href="#rca">RCA literature</a>'; 

    main.querySelectorAll('.tier').forEach(el => el.remove());
    main.querySelectorAll('.footer-note').forEach(el => el.remove());

    const wrap = document.createElement('div');
    wrap.id = 'wct-foundation-curated';
    wrap.innerHTML = `
      <section class="tier wct-core-tier" id="wct-core">
        <div class="tier-head"><div><p class="eyebrow">8 canonical Reyes anchors</p><h2>WCT Core</h2></div><p>The papers that define the central WCT architecture, mathematical substrate, spectral dynamics, and geometric mass constructions.</p></div>
        <div class="wct-core-grid">${coreWct.map((r,i)=>`<article class="wct-core-card"><span class="core-index">WCT ${String(i+1).padStart(2,'0')}</span><h3><a href="${esc(r[3])}" target="_blank" rel="noopener noreferrer">${esc(r[0])}</a></h3><time>${esc(r[1])}</time><p>${esc(r[2])}</p></article>`).join('')}</div>
      </section>
      ${groups.map(g=>`<section class="tier" id="${g.id}"><div class="tier-head"><div><p class="eyebrow">${esc(g.kicker)}</p><h2>${esc(g.title)}</h2></div><p>${esc(g.lede)}</p></div><div class="table-wrap"><table><thead><tr><th>#</th><th>Foundational work</th><th>Year</th><th>Role in the WCT substrate</th><th>Domain</th></tr></thead><tbody>${renderRows(g.rows)}</tbody></table></div></section>`).join('')}
      <p class="footer-note"><strong>${totalExternal} external records, including 42 backward-citation leads.</strong> The canonical indexed and curated reference sets are preserved with link/title deduplication. B01–B42 denote supplement priorities: 24 main WCT additions, 9 supporting works and 9 RCA references. A verified citation trail identifies a bibliography connection only; no inclusion asserts WCT/RCA validation or priority attribution. All external references are pre-2025.</p>
    `;
    head.after(wrap);

    const style = document.createElement('style');
    style.textContent = `
      .foundation-shell{width:min(1280px,calc(100% - 48px));padding-top:64px}
      .foundation-head{max-width:980px;margin-bottom:34px}
      .foundation-head>p:not(.eyebrow){max-width:78ch;line-height:1.65}
      .boundary{max-width:980px}
      .tier{margin-top:54px}
      .tier-head{grid-template-columns:minmax(0,1fr) minmax(280px,.72fr);gap:38px;margin-bottom:18px}
      .tier-head>p{max-width:54ch}
      .wct-core-tier{padding-top:8px}
      .wct-core-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      .wct-core-card{padding:20px;border:1px solid rgba(103,212,255,.18);border-radius:15px;background:linear-gradient(145deg,rgba(103,212,255,.045),rgba(139,124,255,.025))}
      .core-index{display:block;color:var(--accent);font-size:.67rem;font-weight:850;letter-spacing:.1em;text-transform:uppercase}
      .wct-core-card h3{margin:8px 0 5px;font-size:1.04rem;line-height:1.34}
      .wct-core-card h3 a{text-decoration:none;color:var(--text)}
      .wct-core-card h3 a:hover{color:var(--accent)}
      .wct-core-card time{color:var(--muted-2);font-size:.75rem;font-weight:700}
      .wct-core-card p{margin:10px 0 0;color:var(--muted);font-size:.86rem;line-height:1.55}
      .table-wrap{border-radius:14px}
      table{min-width:980px}
      th,td{padding:13px 14px}
      .source .tag{color:var(--accent);border-color:rgba(103,212,255,.28);background:rgba(103,212,255,.05)}
      .footer-note{max-width:90ch;margin:42px 0 0;padding-top:20px;border-top:1px solid var(--line)}
      @media(max-width:820px){.foundation-shell{width:calc(100% - 24px);padding-top:48px}.tier-head,.wct-core-grid{grid-template-columns:1fr}.tier-head{gap:10px}.tier{margin-top:42px}}
    `;
    document.head.appendChild(style);
    // Share only the already curated, public bibliographic arrays with the progressive atlas.
    window.__wctFoundationAtlas={coreWct,groups};
    if (!document.getElementById('wct-foundation-atlas-css')) {
      const link=document.createElement('link');
      link.id='wct-foundation-atlas-css';
      link.rel='stylesheet';
      link.href='/foundations/atlas.css?v=20261015-backcite1';
      document.head.appendChild(link);
    }
    if (!document.getElementById('wct-foundation-atlas-js')) {
      const script=document.createElement('script');
      script.id='wct-foundation-atlas-js';
      script.src='/foundations/atlas.js?v=20261015-backcite1';
      script.async=false;
      document.head.appendChild(script);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();
})();
