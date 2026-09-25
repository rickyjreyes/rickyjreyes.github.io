(() => {
  const path = location.pathname.replace(/index\.html$/i, '');
  if (path !== '/priority/') return;

  const patchVerifiedPredictionCards = () => {
    const cards = Array.from(document.querySelectorAll('#verified-predictions .prediction-card'));
    if (!cards.length) return false;

    const byNumber = (number) => cards.find((card) => card.querySelector('.prediction-number')?.textContent.trim() === String(number));

    const card11 = byNumber(11);
    if (card11 && !card11.dataset.evidenceRefined) {
      const body = card11.querySelector('p');
      if (body) {
        body.innerHTML = '<a href="https://doi.org/10.5281/zenodo.17743607" target="_blank" rel="noopener noreferrer">WCC · May 7, 2025</a> explicitly charged geometric and physical resources rather than treating formal operations as free. The verified result retained here is the physical-resource conclusion itself: apparently extraordinary formal computational power can require exponentially growing implementation resources once the physical cost of realization is counted.';
      }
      card11.dataset.evidenceRefined = 'true';
    }

    const card15 = byNumber(15);
    if (card15 && !card15.dataset.evidenceRefined) {
      const body = card15.querySelector('p');
      if (body) {
        body.innerHTML = '<a href="https://doi.org/10.5281/zenodo.17578766" target="_blank" rel="noopener noreferrer">Phase-Flux Field · September 8, 2025</a> derived finite-wavenumber selection with saturating nonlinear stabilization. The verified result retained here is the mechanism sequence itself: finite-k amplification can undergo nonlinear saturation or arrest and settle into stable localized states.';
      }
      card15.dataset.evidenceRefined = 'true';
    }

    const card24 = byNumber(24);
    if (card24 && !card24.dataset.evidenceRefined) {
      const body = card24.querySelector('p');
      if (body) {
        body.innerHTML = 'The prior WCT/RCA calculation gave R<sub>pred</sub>≈0.0100. In the later 2026 multi-agent event, the unauthorized collective mode grew from a(0)=1 to a(3 h)=53, giving λ<sub>net</sub>=ln(53)/(3 h)≈1.323 h<sup>−1</sup>. Using the reported incident-response interval gives μ≈0.01389 h<sup>−1</sup>; with ν=λ<sub>net</sub>+μ≈1.337 h<sup>−1</sup>, the reconstructed event ratio is R<sub>2026</sub>=μ/ν≈0.0104. Compared with R<sub>pred</sub>=0.0100, the relative difference is approximately 4%. <a href="https://zenodo.org/records/22757003" target="_blank" rel="noopener noreferrer">Propagation-Correction Criticality calculation</a>.';
      }
      card24.dataset.evidenceRefined = 'true';
    }

    return Boolean(card11 && card15 && card24);
  };

  const run = () => {
    const table = document.querySelector('.convergence-table');
    if (table && !table.dataset.polished) {
      const headers = table.querySelectorAll('thead th');
      const labels = ['Case','Earlier Reyes record','External work','Technical correspondence','Relationship','Verification'];
      headers.forEach((th,i) => { if (labels[i]) th.textContent = labels[i]; });

      table.querySelectorAll('tbody tr').forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells[4]) cells[4].innerHTML = '<span class="priority-rel priority-rel-convergence">POST-DATE CONVERGENCE</span>';
        if (cells[5]) cells[5].innerHTML = '<span class="priority-verify">DATE VERIFIED</span>';
      });
      table.dataset.polished = 'true';
    }

    const candidate = document.querySelector('.candidate-table');
    if (candidate && !candidate.dataset.polished) {
      const headers = candidate.querySelectorAll('thead th');
      if (headers[2]) headers[2].textContent = 'Technical correspondence';
      if (headers[3]) headers[3].textContent = 'Relationship';
      candidate.querySelectorAll('tbody tr').forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells[3]) cells[3].innerHTML = '<span class="priority-rel priority-rel-priority">HIGH-PRIORITY COMPARISON</span>';
      });
      candidate.dataset.polished = 'true';
    }

    patchVerifiedPredictionCards();

    if (!document.getElementById('priority-table-polish-style')) {
      const style = document.createElement('style');
      style.id = 'priority-table-polish-style';
      style.textContent = `
        /* Keep tables aligned with the same left/right content edge as their headings. */
        .priority-shell .table-wrap{
          width:100% !important;
          max-width:100% !important;
          margin-left:0 !important;
          margin-right:0 !important;
          box-sizing:border-box;
        }
        .priority-shell .priority-fold-body .table-wrap{
          width:100% !important;
          max-width:100% !important;
          margin-left:0 !important;
          margin-right:0 !important;
        }
        .priority-rel,.priority-verify{display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;font-size:.66rem;font-weight:850;letter-spacing:.035em;white-space:nowrap}
        .priority-rel-convergence{color:#67d4ff;border:1px solid rgba(103,212,255,.5);background:rgba(103,212,255,.09)}
        .priority-rel-priority{color:#c7a5ff;border:1px solid rgba(183,137,255,.48);background:rgba(183,137,255,.09)}
        .priority-verify{color:#76e2a8;border:1px solid rgba(118,226,168,.5);background:rgba(118,226,168,.08)}
        .convergence-table th:nth-child(1){width:5%}
        .convergence-table th:nth-child(2){width:19%}
        .convergence-table th:nth-child(3){width:24%}
        .convergence-table th:nth-child(4){width:30%}
        .convergence-table th:nth-child(5){width:13%}
        .convergence-table th:nth-child(6){width:9%}
      `;
      document.head.appendChild(style);
    }
  };

  const start = () => {
    run();
    if (patchVerifiedPredictionCards()) return;

    const observer = new MutationObserver(() => {
      if (patchVerifiedPredictionCards()) observer.disconnect();
    });
    observer.observe(document.documentElement, {childList:true, subtree:true});
    window.setTimeout(() => observer.disconnect(), 10000);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
