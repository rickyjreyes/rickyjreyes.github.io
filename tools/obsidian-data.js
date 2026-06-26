/* Load local Obsidian corpus snapshots copied into rickyjreyes.github.io/tools/data.
   Existing embedded page data remains as an offline fallback. */
(function () {
  'use strict';

  const LOCAL = './data/';
  const SOURCES = {
    glossary: LOCAL + 'wct-glossary.md',
    equations: LOCAL + 'equations.md',
    master: LOCAL + 'master-equations.md',
    chronology: LOCAL + 'chronology.md'
  };

  const clean = value => String(value || '')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  function familyForTerm(name, definition) {
    const text = (name + ' ' + definition).toLowerCase();
    if (/ai |agent|alignment|drift|semantic|curriculum|model collapse|autonomous/.test(text)) return 'AI / drift';
    if (/curvature|torsion|soliton|mass|koide|compton|metric|enthalp/.test(text)) return 'Curvature';
    if (/fourier|spectral|harmonic|frequency|band|shell|mode|fft|cymatic/.test(text)) return 'Spectral';
    if (/topolog|winding|loop|knot|phase wall|holonomy/.test(text)) return 'Topology';
    if (/sobolev|lyapunov|stability|regularity|bound|invariant/.test(text)) return 'Stability';
    if (/comput|complexity|wcc|p vs|p versus|3-sat|cryptograph|cellular automata/.test(text)) return 'Computation';
    if (/nist|lhc|juno|photodiode|detector|data|likelihood|null|veto|experiment|signal/.test(text)) return 'Evidence';
    if (/tokamak|plasma|control|fusion|transport|actuator|barrier/.test(text)) return 'Control / fusion';
    if (/cosmolog|gravity|photon|baryon|horizon|acoustic/.test(text)) return 'Cosmology';
    return 'Core field';
  }

  function parseGlossary(markdown) {
    const found = [];
    const seen = new Set();
    const rx = /^\s*-\s+\*\*\[\[[^\]|]+(?:\|([^\]]+))?\]\]\*\*\s+—\s+(.+)$/gm;
    let match;
    while ((match = rx.exec(markdown))) {
      const link = match[0].match(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
      const name = clean((link && (link[2] || link[1])) || match[1]);
      const definition = clean(match[2]);
      if (!name || !definition || seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());
      const family = familyForTerm(name, definition);
      found.push([name, definition, family, '', 'Imported from the local Obsidian snapshot stored in this website repository.']);
    }
    return found.sort((a, b) => a[0].localeCompare(b[0]));
  }

  function equationFamily(id, heading) {
    const key = (id + ' ' + heading).toLowerCase();
    if (/^m\d|master/.test(key)) return 'Master';
    if (/^e(?:1[a-b]?|[2-8])\b|rest energy|loop|mass/.test(key)) return 'Rest energy';
    if (/^e(?:9|1[0-6])\b|phase.flux|cymatic rail/.test(key)) return 'Phase–flux';
    if (/^e(?:1[7-9]|2[0-3])\b|curvature feedback|lyapunov/.test(key)) return 'Curvature feedback';
    if (/^e(?:2[4-7]|6[5-9]|70)\b|dimensional|sobolev/.test(key)) return 'Dimensionality';
    if (/^e(?:2[8-9]|3[0-9]|4[0-3]|7[1-9]|8[0-2])\b|entropy|wcc|complexity|information/.test(key)) return 'Entropy/computation';
    if (/^e4[4-8]\b|cavity|tokamak/.test(key)) return 'Cavity/tokamak';
    if (/^e5[0-6]\b|geometry.of.resonance/.test(key)) return 'Geometry extensions';
    if (/^e(?:5[7-9]|6[0-4])\b|fourier|swift|annulus/.test(key)) return 'Fourier cymatics';
    if (/^cle\d+/i.test(id)) return 'CLE';
    if (/^cm\d+/i.test(id)) return 'Cosmology';
    if (/^t\d+/i.test(id)) return 'Topology';
    if (/^c\d+/i.test(id)) return 'Closure';
    if (/^ey|logarithmic/i.test(key)) return 'Logarithmic flow';
    return 'Other';
  }

  function stripMarkdown(text) {
    return clean(text
      .replace(/^>\s*\[![^\]]+\].*$/gm, '')
      .replace(/^#+\s*/gm, '')
      .replace(/^[-*]\s+/gm, '')
      .replace(/\$\$[\s\S]*?\$\$/g, '')
      .replace(/\\\[[\s\S]*?\\\]/g, ''));
  }

  function parseEquationDocument(markdown, sourceLabel) {
    const rows = [];
    const headingRx = /^###?\s+((?:E\d+[a-z]?|CLE\d+|CM\d+|T\d+|C\d+|EY|G\d+|Master Equation\s+\d+[A-Z]?)[^\n]*)$/gmi;
    const heads = [];
    let match;
    while ((match = headingRx.exec(markdown))) heads.push({ index: match.index, end: headingRx.lastIndex, text: clean(match[1]) });
    heads.forEach((head, i) => {
      const chunk = markdown.slice(head.end, i + 1 < heads.length ? heads[i + 1].index : markdown.length);
      const idMatch = head.text.match(/^(E\d+[a-z]?|CLE\d+|CM\d+|T\d+|C\d+|EY|G\d+|Master Equation\s+\d+[A-Z]?)/i);
      if (!idMatch) return;
      const id = idMatch[1].replace(/Master Equation\s+/i, 'M');
      const title = clean(head.text.replace(idMatch[0], '').replace(/^\s*[—–:-]+\s*/, '')) || id;
      const mathMatches = [...chunk.matchAll(/\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/g)];
      if (!mathMatches.length) return;
      const latex = mathMatches.slice(0, 3).map(m => (m[1] || m[2] || '').trim()).filter(Boolean).join('\\qquad ');
      const beforeMath = chunk.slice(0, mathMatches[0].index);
      const meaning = stripMarkdown(beforeMath) || 'Canonical equation from the local Obsidian snapshot.';
      rows.push({
        id,
        family: equationFamily(id, title),
        title,
        meaning: meaning.slice(0, 420),
        latex,
        symbols: ['See the Obsidian atomic equation note for full symbol and dependency metadata.'],
        use: ['Imported from local tools/data/' + sourceLabel + '.', 'Part of the canonical Obsidian equation corpus.'],
        status: 'Source-preserving import. The website stores a snapshot copied from rickyjreyes/obsidian.'
      });
    });
    return rows;
  }

  function parseChronology(markdown) {
    const rows = [];
    const rx = /^\s*-\s+\*\*(\d{4}-\d{2}-\d{2})\*\*\s+—\s+\[\[[^\]|]+(?:\|([^\]]+))?\]\]/gm;
    let match;
    while ((match = rx.exec(markdown))) {
      const full = match[0].match(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
      rows.push([match[1], clean((full && (full[2] || full[1])) || match[2]), 'Dated archival release from the local Obsidian chronology snapshot.']);
    }
    return rows;
  }

  function addSelectOptions(select, values) {
    const existing = new Set([...select.options].map(o => o.value));
    [...new Set(values)].sort().forEach(value => {
      if (!value || existing.has(value)) return;
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function showSyncStatus(message, error) {
    let node = document.getElementById('obsidianSyncStatus');
    if (!node) {
      node = document.createElement('p');
      node.id = 'obsidianSyncStatus';
      node.setAttribute('role', 'status');
      node.style.cssText = 'margin:14px 0 0;color:var(--muted2);font-size:.84rem';
      document.querySelector('#glossary .head')?.after(node);
    }
    node.textContent = message;
    if (error) node.style.color = 'var(--bad)';
  }

  async function getText(url) {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error(response.status + ' ' + response.statusText);
    return response.text();
  }

  async function sync() {
    showSyncStatus('Loading local Obsidian snapshots from this website repository…');
    try {
      const [glossaryMd, equationsMd, masterMd, chronologyMd] = await Promise.all([
        getText(SOURCES.glossary), getText(SOURCES.equations), getText(SOURCES.master), getText(SOURCES.chronology)
      ]);

      const importedTerms = parseGlossary(glossaryMd);
      if (importedTerms.length) {
        terms.splice(0, terms.length, ...importedTerms);
        addSelectOptions(document.getElementById('termFamily'), importedTerms.map(t => t[2]));
        renderTerms();
      }

      const importedEquations = [
        ...parseEquationDocument(masterMd, 'master-equations.md'),
        ...parseEquationDocument(equationsMd, 'equations.md')
      ];
      const uniqueEquations = [];
      const seen = new Set();
      importedEquations.forEach(e => {
        const key = e.id + '|' + e.title;
        if (seen.has(key)) return;
        seen.add(key);
        uniqueEquations.push(e);
      });
      if (uniqueEquations.length) {
        equations.splice(0, equations.length, ...uniqueEquations);
        addSelectOptions(document.getElementById('eqFamily'), uniqueEquations.map(e => e.family));
        renderEqList();
        selectEq(uniqueEquations.find(e => e.id === 'E17')?.id || uniqueEquations[0].id);
      }

      const importedChronology = parseChronology(chronologyMd);
      if (importedChronology.length) {
        document.getElementById('timelineList').innerHTML = importedChronology.map(e =>
          `<div class="event"><div class="date">${e[0]}</div><article><h3>${e[1]}</h3><p>${e[2]}</p></article></div>`
        ).join('');
      }

      showSyncStatus(`Loaded ${importedTerms.length} glossary terms, ${uniqueEquations.length} rendered equations, and ${importedChronology.length} chronology entries from local rickyjreyes.github.io/tools/data snapshots.`);
    } catch (error) {
      console.error('Local Obsidian snapshot load failed:', error);
      showSyncStatus('The local Obsidian snapshots are not present yet. Run the “Sync Obsidian corpus into tools” GitHub Action; embedded fallback content remains available.', true);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync);
  else sync();
})();
