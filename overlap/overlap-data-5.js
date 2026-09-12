window.overlapRecords=(window.overlapRecords||[]).concat([
[1041,"Quantum limit cycles with continuous symmetries from coherent parametric driving: Exact solutions and many-body extensions","https://doi.org/10.1103/xb4r-9wxk",9.0,"physics","Physical Review Research","Sihan Chen; Aashish A. Clerk","10.1103/xb4r-9wxk","https://doi.org/10.1103/xb4r-9wxk"],
[1042,"Stabilization of dark states in emitter arrays coupled to a half-waveguide","https://arxiv.org/abs/2609.03040",8.9,"physics","arXiv","Oriol Rubies-Bigorda; Susanne F. Yelin; Ana Asenjo-Garcia; Stuart J. Masson","10.48550/arXiv.2609.03040","https://doi.org/10.48550/arXiv.2609.03040"],
[1043,"Weakly Driven and Finite Detuning Boundary Time Crystals Enabled by Low-Dissipation Dynamical Channels","https://arxiv.org/abs/2609.03491",8.7,"physics","arXiv","Xiang Guo; Xiaojun Zhang; Zhihai Wang","10.48550/arXiv.2609.03491","https://doi.org/10.48550/arXiv.2609.03491"],
[1044,"Precise spectral asymptotics, exponential localization, and spectral gap estimates for the three-boson lattice Schrödinger operator","https://arxiv.org/abs/2609.02488",8.4,"physics","arXiv","Abdikhurayra Toshturdiev; Abdumalik Eshniyozov; Janikul Abdullaev; Mikhail Dolgopolov","10.48550/arXiv.2609.02488","https://doi.org/10.48550/arXiv.2609.02488"],
[1045,"Antiresonances of Wannier-Stark ladders in Su-Schrieffer-Heeger lattices","https://arxiv.org/abs/2609.01363",7.8,"physics","arXiv","Yonatan Betancur-Ocampo; Guillermo Monsivais","10.48550/arXiv.2609.01363","https://doi.org/10.48550/arXiv.2609.01363"],
[1046,"Pattern formation in a Swift-Hohenberg equation with spatially periodic coefficients","https://doi.org/10.1016/j.physd.2026.135239",9.1,"physics","Physica D: Nonlinear Phenomena","Jolien Kamphuis; Martina Chirilus-Bruckner","10.1016/j.physd.2026.135239","https://doi.org/10.1016/j.physd.2026.135239"],
[1047,"Supersolid rotation in an annular Bose-Einstein condensate coupled to a ring cavity","https://doi.org/10.1103/2h27-c8sp",9.0,"physics","Physical Review A","Gunjan Yadav; Nilamoni Daloi; Pardeep Kumar; M. Bhattacharya; Tarak Nath Dey","10.1103/2h27-c8sp","https://doi.org/10.1103/2h27-c8sp"],
[1048,"Cosmological discrete self-similarity in primordial black hole formation","https://doi.org/10.1103/58r5-8zng",8.9,"physics","Physical Review D","Luis E. Padilla; Tomohiro Harada; Ethan Milligan; David Mulryne","10.1103/58r5-8zng","https://doi.org/10.1103/58r5-8zng"]
]);

// Re-normalize after this overlay so newly appended records participate in
// the public rank order. Primary URL is the stable record identity.
(() => {
  const byUrl = new Map();
  (window.overlapRecords || []).forEach(record => byUrl.set(record[2], record));
  const records = [...byUrl.values()];
  const oldRank = record => Number.isFinite(Number(record[0])) ? Number(record[0]) : 999999;
  const ranked = domain => records
    .filter(record => record[4] === domain)
    .sort((a,b) =>
      (Number(b[3]) - Number(a[3])) ||
      (oldRank(a) - oldRank(b)) ||
      String(a[1]).localeCompare(String(b[1])) ||
      String(a[2]).localeCompare(String(b[2]))
    );
  const ordered = [...ranked('physics'), ...ranked('ai')];
  window.overlapRecords = ordered.map((record,index) => [index + 1, ...record.slice(1)]);
})();
