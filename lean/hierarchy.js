(() => {
  const rows = [...document.querySelectorAll('.lean-row')];
  const hero = document.querySelector('.lean-hero');
  const browser = document.querySelector('.lean-browser');
  const browserSection = browser?.closest('section.section');
  if (!rows.length || !hero || !browser || !browserSection || document.querySelector('.lean-hierarchy')) return;

  const categories = [
    {
      key: 'formal',
      label: 'Exact / formal results',
      eyebrow: 'Kernel-checked results',
      classes: ['lean-proved', 'lean-support'],
      tone: 'var(--lean-support,#67d4ff)',
      description: 'Kernel-checked algebraic or dimensional results. Each item still states the exact scope of what Lean proves.'
    },
    {
      key: 'partial',
      label: 'Partial support',
      eyebrow: 'Supporting formalization',
      classes: ['lean-partial'],
      tone: 'var(--lean-partial,#fbbf24)',
      description: 'Supporting lemmas, finite models, or narrowed theorems that do not close the full canonical WCT object.'
    },
    {
      key: 'definition',
      label: 'Definitions',
      eyebrow: 'Typed objects and contracts',
      classes: ['lean-definition'],
      tone: 'var(--lean-definition,#60a5fa)',
      description: 'Definitions and proposition contracts accepted by the kernel. Acceptance is not proof of the associated physical claim.'
    },
    {
      key: 'counterexample',
      label: 'Counterexamples',
      eyebrow: 'Constraint and failure results',
      classes: ['lean-counterexample'],
      tone: 'var(--lean-counter,#fb7185)',
      description: 'Kernel-checked counterexamples or failure results that rule out stronger or historically incorrect formulations.'
    },
    {
      key: 'todo',
      label: 'TODO',
      eyebrow: 'Stated, not proved',
      classes: ['lean-todo'],
      tone: 'var(--lean-todo,#c084fc)',
      description: 'Statements represented in Lean whose intended proof is not complete. These are obligations, not results.'
    },
    {
      key: 'unmapped',
      label: 'Unmapped',
      eyebrow: 'No maintained direct coverage',
      classes: ['lean-unmapped'],
      tone: 'var(--lean-unmapped,#64748b)',
      description: 'No maintained direct Lean declaration currently closes the object. Missing formal coverage is not evidence of falsity.'
    }
  ];

  const matches = (row, category) => category.classes.some((name) => row.classList.contains(name));
  categories.forEach((category) => {
    category.rows = rows.filter((row) => matches(row, category));
    category.count = category.rows.length;
  });

  const totalCategorized = categories.reduce((sum, category) => sum + category.count, 0);
  const heroHeading = hero.querySelector('h1');
  const heroLede = hero.querySelector('.section-heading.narrow > p:last-child');
  if (heroHeading) heroHeading.textContent = 'WCT Lean Coverage';
  if (heroLede) heroLede.textContent = 'Start with proof strength, then drill into individual canonical objects. Lean coverage is kept separate from symbolic checks and empirical validation.';

  const style = document.createElement('style');
  style.id = 'lean-hierarchy-style';
  style.textContent = `
    .lean-hierarchy{padding-top:18px}
    .lean-hierarchy-head{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(260px,.7fr);gap:32px;align-items:end;margin-bottom:24px}
    .lean-hierarchy-head h2{margin:.25rem 0 0;font:500 clamp(2rem,4vw,3.25rem)/1.04 Georgia,serif;letter-spacing:-.035em}
    .lean-hierarchy-head>p{margin:0;color:var(--muted);line-height:1.7}
    .lean-category-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
    .lean-category-card{--cat:var(--accent,#67d4ff);position:relative;min-height:178px;padding:19px;border:1px solid var(--line);border-top:2px solid var(--cat);border-radius:13px;background:linear-gradient(155deg,rgba(14,29,48,.82),rgba(7,17,31,.9));color:var(--text);text-align:left;cursor:pointer;transition:transform 120ms ease,border-color 120ms ease,background 120ms ease}
    .lean-category-card:hover,.lean-category-card:focus-visible{transform:translateY(-2px);border-color:color-mix(in srgb,var(--cat) 46%,transparent);background:linear-gradient(155deg,rgba(18,36,58,.96),rgba(8,20,34,.96));outline:none}
    .lean-category-card[aria-pressed="true"]{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--cat) 52%,transparent)}
    .lean-category-kicker{display:block;color:var(--muted-2);font-size:.65rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
    .lean-category-title{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin:12px 0 9px}
    .lean-category-title strong{font:500 1.18rem/1.15 Georgia,serif}
    .lean-category-count{color:var(--cat);font:500 1.6rem/1 Georgia,serif}
    .lean-category-card p{margin:0;color:var(--muted);font-size:.82rem;line-height:1.55}
    .lean-hierarchy-actions{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:20px}
    .lean-hierarchy-total{color:var(--muted-2);font-size:.78rem}
    .lean-inventory-section{padding-top:20px}
    .lean-inventory{border:1px solid var(--line);border-radius:15px;background:rgba(7,17,31,.4)}
    .lean-inventory>summary{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:20px 22px;cursor:pointer;list-style:none}
    .lean-inventory>summary::-webkit-details-marker{display:none}
    .lean-inventory-summary strong{display:block;font-size:.94rem}
    .lean-inventory-summary small{display:block;margin-top:4px;color:var(--muted-2);font-size:.72rem;font-weight:500}
    .lean-inventory-action{color:var(--accent);font-size:.76rem;font-weight:750}
    .lean-inventory-content{padding:0 12px 12px}
    .lean-filter-context{display:none;align-items:center;justify-content:space-between;gap:16px;margin:0 0 12px;padding:12px 14px;border:1px solid var(--line);border-radius:10px;background:rgba(103,212,255,.045)}
    .lean-filter-context.is-active{display:flex}
    .lean-filter-context strong{display:block;font-size:.82rem}
    .lean-filter-context span{display:block;margin-top:2px;color:var(--muted-2);font-size:.7rem}
    .lean-filter-clear{padding:7px 10px;border:1px solid var(--line);border-radius:8px;background:transparent;color:var(--text);cursor:pointer;font:inherit;font-size:.72rem;font-weight:700}
    .lean-inventory .lean-browser{margin-top:0}
    @media(max-width:980px){.lean-category-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.lean-hierarchy-head{grid-template-columns:1fr;gap:12px}}
    @media(max-width:620px){.lean-category-grid{grid-template-columns:1fr}.lean-category-card{min-height:auto}.lean-inventory>summary{align-items:flex-start;padding:17px}.lean-filter-context{align-items:flex-start;flex-direction:column}}
  `;
  document.head.appendChild(style);

  const hierarchy = document.createElement('section');
  hierarchy.className = 'section section-shell lean-hierarchy';
  hierarchy.setAttribute('aria-labelledby', 'lean-hierarchy-title');
  hierarchy.innerHTML = `
    <div class="lean-hierarchy-head">
      <div>
        <p class="eyebrow">Proof-strength map</p>
        <h2 id="lean-hierarchy-title">What has actually been formalized?</h2>
      </div>
      <p>These categories describe the <strong>strength of Lean coverage</strong>, not the truth of WCT as a physical theory. Open a category to inspect the exact theorem, definition, limitation, and source attached to each object.</p>
    </div>
    <div class="lean-category-grid">
      ${categories.map((category) => `
        <button class="lean-category-card" type="button" data-lean-category="${category.key}" aria-pressed="false" style="--cat:${category.tone}">
          <span class="lean-category-kicker">${category.eyebrow}</span>
          <span class="lean-category-title"><strong>${category.label}</strong><span class="lean-category-count">${category.count}</span></span>
          <p>${category.description}</p>
        </button>`).join('')}
    </div>
    <div class="lean-hierarchy-actions">
      <button class="button secondary" type="button" id="lean-browse-all">Browse all ${rows.length} objects</button>
      <span class="lean-hierarchy-total">${totalCategorized === rows.length ? `All ${rows.length} canonical objects are accounted for by these six coverage classes.` : `${totalCategorized} of ${rows.length} objects are represented in the six visible classes.`}</span>
    </div>`;
  hero.insertAdjacentElement('afterend', hierarchy);

  const inventory = document.createElement('details');
  inventory.className = 'lean-inventory';
  inventory.id = 'lean-full-inventory';
  inventory.open = true;
  inventory.innerHTML = `
    <summary>
      <span class="lean-inventory-summary"><strong>Complete Lean object browser</strong><small>Search and inspect all ${rows.length} canonical objects, formalization notes, declarations, symbolic status, and empirical status.</small></span>
      <span class="lean-inventory-action" aria-hidden="true">Close ↑</span>
    </summary>
    <div class="lean-inventory-content">
      <div class="lean-filter-context" id="lean-filter-context">
        <div><strong id="lean-filter-title"></strong><span id="lean-filter-copy"></span></div>
        <button class="lean-filter-clear" id="lean-filter-clear" type="button">Clear category</button>
      </div>
    </div>`;

  const content = inventory.querySelector('.lean-inventory-content');
  content.appendChild(browser);
  browserSection.classList.add('lean-inventory-section');
  browserSection.appendChild(inventory);

  const action = inventory.querySelector('.lean-inventory-action');
  inventory.addEventListener('toggle', () => {
    if (action) action.textContent = inventory.open ? 'Close ↑' : 'Open ↓';
  });

  const context = document.getElementById('lean-filter-context');
  const contextTitle = document.getElementById('lean-filter-title');
  const contextCopy = document.getElementById('lean-filter-copy');
  let activeCategory = null;

  const applyCategory = () => {
    if (!activeCategory) return;
    rows.forEach((row) => {
      if (!matches(row, activeCategory)) row.hidden = true;
    });
  };

  const clearCategory = ({ keepOpen = true } = {}) => {
    activeCategory = null;
    document.querySelectorAll('[data-lean-category]').forEach((card) => card.setAttribute('aria-pressed', 'false'));
    context?.classList.remove('is-active');
    const search = document.getElementById('lean-search');
    if (search) search.dispatchEvent(new Event('input', { bubbles: true }));
    else rows.forEach((row) => { row.hidden = false; });
    if (keepOpen) inventory.open = true;
  };

  const resetAllFilters = () => {
    activeCategory = null;
    document.querySelectorAll('[data-lean-category]').forEach((card) => card.setAttribute('aria-pressed', 'false'));
    context?.classList.remove('is-active');
    const search = document.getElementById('lean-search');
    if (search) search.value = '';
    const allButton = document.querySelector('[data-filter=""]');
    if (allButton) allButton.click();
    else rows.forEach((row) => { row.hidden = false; });
    inventory.open = true;
  };

  const openCategory = (category) => {
    activeCategory = category;
    document.querySelectorAll('[data-lean-category]').forEach((card) => card.setAttribute('aria-pressed', String(card.dataset.leanCategory === category.key)));
    context?.classList.add('is-active');
    if (contextTitle) contextTitle.textContent = `${category.label} · ${category.count} object${category.count === 1 ? '' : 's'}`;
    if (contextCopy) contextCopy.textContent = category.description;
    inventory.open = true;
    applyCategory();
    requestAnimationFrame(() => inventory.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  document.querySelectorAll('[data-lean-category]').forEach((card) => {
    card.addEventListener('click', () => {
      const category = categories.find((item) => item.key === card.dataset.leanCategory);
      if (category) openCategory(category);
    });
  });

  document.getElementById('lean-browse-all')?.addEventListener('click', () => {
    resetAllFilters();
    requestAnimationFrame(() => inventory.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  });
  document.getElementById('lean-filter-clear')?.addEventListener('click', () => clearCategory({ keepOpen: true }));

  const search = document.getElementById('lean-search');
  search?.addEventListener('input', () => requestAnimationFrame(applyCategory));
  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => requestAnimationFrame(applyCategory)));

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      inventory.open = true;
    });
  });

  const initial = decodeURIComponent(location.hash.replace(/^#/, ''));
  if (rows.some((row) => row.dataset.id === initial)) inventory.open = true;
})();