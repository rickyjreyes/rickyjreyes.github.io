/* Minimal glossary controls: one disclosure per term; two views only. */
(() => {
  if (!/^\/tools\/glossary(?:\/|$)/.test(location.pathname)) return;
  const grid=document.getElementById('glossaryGrid');
  const tabs=document.querySelector('.glossary-provenance-guide');
  if(!grid||!tabs) return;

  let view='reyes';
  const choices=[
    ['reyes','Reyes terms','WCT / RCA definitions'],
    ['all','All terms','Including standard science']
  ];
  const isReyes=card=>!card.querySelector('.term-origin.external');

  function apply(){
    const cards=Array.from(grid.querySelectorAll(':scope > .glossary-card'));
    let count=0;
    for(const card of cards){
      card.hidden=view==='reyes'&&!isReyes(card);
      if(!card.hidden)count++;
    }
    let letter=null,contains=false;
    function finish(){if(letter)letter.hidden=!contains}
    for(const item of grid.children){
      if(item.classList.contains('glossary-letter')){finish();letter=item;contains=false}
      else if(item.classList.contains('glossary-card')&&!item.hidden)contains=true;
    }
    finish();
    const counter=document.getElementById('termCount');
    if(counter)counter.textContent=count+(view==='reyes'?' Reyes terms':' total terms');
    const empty=document.getElementById('glossaryNoResults');
    if(empty)empty.hidden=count!==0;
    for(const tab of tabs.querySelectorAll('[role="tab"]')){
      const selected=tab.dataset.view===view;
      tab.classList.toggle('active',selected);
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
    }
  }

  function change(value){
    if(value!=='reyes'&&value!=='all')return;
    view=value;apply();
  }

  tabs.replaceChildren();
  tabs.classList.add('term-class-selector');
  tabs.setAttribute('role','tablist');
  tabs.setAttribute('aria-label','Term categories');
  for(let i=0;i<choices.length;i++){
    const [value,title,caption]=choices[i];
    const button=document.createElement('button');
    button.type='button';button.dataset.view=value;button.setAttribute('role','tab');
    const heading=document.createElement('strong');heading.textContent=title;
    const small=document.createElement('span');small.textContent=caption;
    button.append(heading,small);
    button.addEventListener('click',()=>change(value));
    button.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const pos=(event.key==='ArrowLeft'||event.key==='Home')?0:1;
      change(choices[pos][0]);tabs.querySelectorAll('[role="tab"]')[pos].focus();
    });
    tabs.append(button);
  }

  // The A-Z renderer recreates its cards after a search; reapply visibility
  // without recreating DOM or modifying the disclosure structure.
  const observer=new MutationObserver(()=>apply());
  observer.observe(grid,{childList:true});

  function openTermHash(){
    if(!location.hash.startsWith('#term-'))return;
    let card=null;
    try{card=document.querySelector(location.hash)}catch(_){return}
    if(!card||!card.classList.contains('glossary-card'))return;
    if(!isReyes(card))change('all');
    card.open=true;
    requestAnimationFrame(()=>card.scrollIntoView({block:'start'}));
  }
  window.addEventListener('hashchange',openTermHash);
  apply();openTermHash();
})();