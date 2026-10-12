/* Progressive mobile enhancement. No catalogue values, scoring, or records are rewritten. */
(() => {
  const start = () => {
    const path = location.pathname.replace(/index\.html$/i,'');
    if (path === '/priority/' || path === '/overlap/') {
      const selectors = path === '/priority/'
        ? '.priority-shell table.patent-table, .priority-shell table.convergence-table, .priority-shell table.candidate-table'
        : '.overlap-shell .table-wrap table';
      const prepared = new WeakSet();
      const labelTable = table => {
        if (!table || !table.tHead) return;
        table.classList.add('mobile-data-cards');
        const headings = Array.from(table.tHead.rows[table.tHead.rows.length - 1]?.cells || [])
          .map(cell => cell.textContent.trim().replace(/\s+/g, ' '));
        const labelRows = () => {
          if (!table.tBodies.length) return;
          for (const body of table.tBodies) for (const row of body.rows) {
            if (row.hasAttribute('data-mobile-labeled')) continue;
            let column = 0;
            for (const cell of row.cells) {
              const label = headings[column] || '';
              if (!cell.hasAttribute('data-mobile-label')) cell.setAttribute('data-mobile-label', label);
              column += Math.max(1,cell.colSpan||1);
            }
            row.setAttribute('data-mobile-labeled','true');
          }
        };
        labelRows();
        if (!prepared.has(table)) {
          prepared.add(table);
          const observer = new MutationObserver(() => labelRows());
          table.tBodies.forEach(body=>observer.observe(body,{childList:true}));
        }
      };
      document.querySelectorAll(selectors).forEach(labelTable);
      // Replacement tables are rare; support them without observing all the changing registry text.
      if (path === '/overlap/') {
        const region = document.querySelector('.overlap-shell');
        if (region) new MutationObserver(changes => {
          for (const change of changes) for (const node of change.addedNodes) {
            if (node.nodeType!==1) continue;
            if (node.matches?.('.table-wrap table')) labelTable(node);
            node.querySelectorAll?.('.table-wrap table').forEach(labelTable);
          }
        }).observe(region,{childList:true,subtree:true});
      }
    }
    // The 760px breakpoint uses a different header height. Keep anchor links usable
    // even if an earlier navigation script loads after the stylesheet.
    if (window.matchMedia('(max-width:760px)').matches) {
      document.querySelectorAll('.table-wrap').forEach(wrap => {
        if (!wrap.hasAttribute('aria-label') && wrap.querySelector('table') && !wrap.querySelector('table.mobile-data-cards'))
          wrap.setAttribute('aria-label','Horizontally scrollable research table');
      });
    }
  };
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();