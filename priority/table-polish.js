(() => {
  const path = location.pathname.replace(/index\.html$/i, '');
  if (path !== '/priority/') return;

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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();
})();
