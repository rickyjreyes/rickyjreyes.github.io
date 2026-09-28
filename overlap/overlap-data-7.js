window.overlapRecords=(window.overlapRecords||[]).concat([
[1087,"Experimental Observation of Time-Domain Bound States in the Continuum","https://doi.org/10.1364/CLEO_FS.2026.FW1H.3",9.6,"physics","CLEO 2026 / Optica Publishing Group","Zahra Manzoor; Oded Schiller; Yonatan Plotnik; Mordechai Segev; Dimitrios Peroulis","10.1364/CLEO_FS.2026.FW1H.3","https://doi.org/10.1364/CLEO_FS.2026.FW1H.3"],
[1088,"Experimental Realization of Photonic Time-Crystals in Microwaves","https://doi.org/10.1364/CLEO_FS.2026.FW1H.7",9.5,"physics","CLEO 2026 / Optica Publishing Group","Thomas R. Jones; Ludmila J. Prokopeva; Alexander V. Kildishev; Mordechai Segev; Dimitrios Peroulis","10.1364/CLEO_FS.2026.FW1H.7","https://doi.org/10.1364/CLEO_FS.2026.FW1H.7"],
[1089,"Curvature-Induced Magnon Frequency Combs","https://doi.org/10.1103/v6pf-rgv8",9.5,"physics","Physical Review Letters","Hao Zhao; Qianjun Zheng; Peng Yan","10.1103/v6pf-rgv8","https://doi.org/10.1103/v6pf-rgv8"],
[1090,"Electron lattice potentials for ultracold atoms using circular Rydberg orbitals","https://arxiv.org/abs/2609.31267",9.4,"physics","arXiv","Aileen A. T. Durst; Einius Pultinevicius; Homar Rivera-Rodríguez; Tilman Pfau; Matthew T. Eiles; Florian Meinert","10.48550/arXiv.2609.31267","https://doi.org/10.48550/arXiv.2609.31267"],
[1091,"First all-optical photonic time crystal opens a new route to controlling light","https://iramis.cea.fr/en/2026/07/first-all-optical-photonic-time-crystal-opens-a-new-route-to-controlling-light/",9.4,"physics","CEA / CNRS / École Polytechnique / HZDR","CEA IRAMIS; CNRS; École Polytechnique; Collège de France; Thales; HZDR","Institutional experimental program","https://iramis.cea.fr/en/2026/07/first-all-optical-photonic-time-crystal-opens-a-new-route-to-controlling-light/"],
[1092,"Photonic time crystals and timetronics","https://www.southampton.ac.uk/study/postgraduate-research/projects/photonic-time-crystals-timetronics",9.0,"physics","University of Southampton","Optoelectronics Research Centre; Nikolay Zheludev; Kevin Macdonald; Eric Plum","Institutional research programme","https://www.southampton.ac.uk/study/postgraduate-research/projects/photonic-time-crystals-timetronics"]
]);

// Re-normalize after the latest overlay. Primary URL is the stable identity.
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
