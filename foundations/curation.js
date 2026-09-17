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
    if (intro) intro.textContent = 'A curated map of the mathematical and physical substrate WCT builds on, followed by the core Reyes papers that define the WCT research program. Application-specific evidence is kept in its own research tracks rather than mixed into the foundation layer.';

    const boundary = head.querySelector('.boundary');
    if (boundary) boundary.innerHTML = '<strong>Foundation rule.</strong> This page contains established external mathematics and physics that form the substrate for WCT, plus a separate WCT Core layer. AI drift, particle-data tests, neutrino studies, fusion, cryptography, and post-2025 convergence are organized elsewhere on the site.';

    const actions = head.querySelector('.actions');
    if (actions) actions.innerHTML = '<a class="primary" href="#wct-core">WCT Core</a><a href="#math">PDE & nonlinear waves</a><a href="#geometry">Geometry & topology</a><a href="#physics">Physics substrate</a><a href="#information">Information & entropy</a>';

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
      <p class="footer-note"><strong>33 canonical external sources.</strong> The list is intentionally selective: foundation means mathematical or physical substrate, not every work cited anywhere in the WCT corpus. Application-specific literature remains with its corresponding research track.</p>
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
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();
})();
