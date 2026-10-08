// October 2026 WCT / physics literature additions.
// Relationship categories are assigned explicitly in relationship-data-2.js.
window.overlapRecords=(window.overlapRecords||[]).concat([
[1301,"Carrier drift modulation and hyperbolic time crystals","https://doi.org/10.1038/s44455-026-00043-8",9.6,"physics","npj Metamaterials","Evgenii Narimanov; Boris Shapiro","10.1038/s44455-026-00043-8","https://doi.org/10.1038/s44455-026-00043-8"],
[1302,"Real-Time Observation of Soliton Buildup and Self-Organization in a GHz Harmonic Mode Locked Fiber Laser","https://doi.org/10.1002/lpor.72012",9.5,"physics","Laser & Photonics Reviews","Qianqian Huang; Aurélien Coillet; Lilong Dai; Zinan Huang; Haochen Tian; Chengbo Mou; Philippe Grelu","10.1002/lpor.72012","https://doi.org/10.1002/lpor.72012"],
[1303,"Single-pump thermally stabilized access to dissipative Kerr solitons via orthogonally polarized fundamental modes","https://doi.org/10.1063/5.0339700",9.4,"physics","APL Photonics","Seungwon Kim; Yongbeom Kim; Yoonhyuk Rah; Rizki Arif Pradono; Kyoungsik Yu","10.1063/5.0339700","https://doi.org/10.1063/5.0339700"],
[1304,"Q-balls, neural networks, and galaxy rotation curves","https://doi.org/10.1103/tz41-5qcp",8.9,"physics","Physical Review D","Alexandre M. Pombo; Lorenzo Pizzuti; Alessandra di Giacomo","10.1103/tz41-5qcp","https://doi.org/10.1103/tz41-5qcp"]
]);

// Re-normalize after this overlay. Primary URL remains the stable identity.
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