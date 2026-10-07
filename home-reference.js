(() => {
  'use strict';

  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const theoryVisual=document.querySelector('.wct-theory-visual');
  const theoryWrap=document.querySelector('.wct-theory-visual-wrap');
  const steps=[...document.querySelectorAll('.wct-theory-step')];
  const pips=[...document.querySelectorAll('.wct-theory-pips i')];
  const caption=document.querySelector('[data-theory-caption]');
  const theoryProgress=document.querySelector('[data-theory-progress]');
  const prioritySpine=document.querySelector('[data-priority-spine]');
  const priorityItems=[...document.querySelectorAll('[data-priority-spine] .priority-highlight')];

  const labels=[
    'Zero-wave → ZW1 fold',
    'Lyapunov basin flow',
    'Sobolev three-dimensional bound',
    'Finite-k shell selection',
    'Phase–Flux organization',
    'Self-emergent eigenmode sinkholes',
    'Resonant confinement',
    'Curvature locking'
  ];

  let activeStage=0;
  let scrollRaf=0;
  let theoryRaf=0;
  let theoryVisible=true;
  let lastTheoryFrame=0;

  const zwFold=document.querySelector('[data-zw-fold]');
  const zwFoldInner=document.querySelector('[data-zw-fold-inner]');
  const zwCore=document.querySelector('[data-zw-core]');
  const basinParticlesGroup=document.querySelector('[data-basin-particles]');
  const basinFlows=[...document.querySelectorAll('.basin-flow')];
  const shellDots=document.querySelector('[data-shell-dots]');
  const fluxOne=document.querySelector('[data-flux-one]');
  const fluxTwo=document.querySelector('[data-flux-two]');
  const eigenParticlesGroup=document.querySelector('[data-eigen-particles]');
  const mode1=document.querySelector('[data-mode-one]');
  const mode2=document.querySelector('[data-mode-two]');
  const gamma=document.querySelector('[data-gamma]');
  const marker=document.querySelector('[data-gamma-marker]');
  const tangent=document.querySelector('[data-gamma-tangent]');
  const osc=document.querySelector('[data-gamma-osc]');

  const makeParticles=(group,count,classes)=>{
    if(!group)return [];
    const nodes=[];
    for(let i=0;i<count;i++){
      const el=document.createElementNS('http://www.w3.org/2000/svg','circle');
      el.setAttribute('r','2.5');
      el.setAttribute('class',classes[i%classes.length]);
      el.setAttribute('opacity','.45');
      group.appendChild(el);
      nodes.push(el);
    }
    return nodes;
  };
  const basinParticles=makeParticles(basinParticlesGroup,14,['fill-accent','fill-accent2','fill-accent3']);
  const eigenParticles=makeParticles(eigenParticlesGroup,24,['fill-accent','fill-accent2','fill-accent3']);

  if(shellDots){
    const classes=['fill-accent3','fill-accent2','fill-accent'];
    for(let i=0;i<84;i++){
      const a=i*2.399963229728653,rr=116+(i%3)*20;
      const x=280+rr*Math.cos(a),y=240+rr*Math.sin(a);
      const el=document.createElementNS('http://www.w3.org/2000/svg','circle');
      el.setAttribute('cx',x.toFixed(1));
      el.setAttribute('cy',y.toFixed(1));
      el.setAttribute('r',i%5===0?'3.1':'2');
      el.setAttribute('class',classes[i%3]);
      el.setAttribute('opacity',i%5===0?'.82':'.36');
      shellDots.appendChild(el);
    }
  }
  if(fluxOne)fluxOne.style.strokeDasharray='8 10';
  if(fluxTwo)fluxTwo.style.strokeDasharray='5 12';

  const gammaPt=(t)=>{
    const r=128+28*Math.cos(3*t);
    return [280+r*Math.cos(t),240+.82*r*Math.sin(t)];
  };
  if(gamma){
    let d='';
    for(let i=0;i<=180;i++){
      const p=gammaPt(i/180*Math.PI*2);
      d+=(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);
    }
    gamma.setAttribute('d',d+'Z');
  }

  const circum=(a,b,c)=>{
    const d=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));
    if(Math.abs(d)<1e-6)return null;
    const aa=a[0]*a[0]+a[1]*a[1],bb=b[0]*b[0]+b[1]*b[1],cc=c[0]*c[0]+c[1]*c[1];
    const ux=(aa*(b[1]-c[1])+bb*(c[1]-a[1])+cc*(a[1]-b[1]))/d;
    const uy=(aa*(c[0]-b[0])+bb*(a[0]-c[0])+cc*(b[0]-a[0]))/d;
    return [ux,uy,Math.hypot(ux-b[0],uy-b[1])];
  };

  const drawFold=(t)=>{
    if(!zwFold||!zwFoldInner)return;
    const birth=.2+.8*(.5+.5*Math.sin(t*.72));
    const make=(r0,amp,phase)=>{
      let d='';
      for(let i=0;i<=140;i++){
        const a=i/140*Math.PI*2;
        const fold=amp*birth*Math.sin(3*a+phase);
        const r=r0+fold;
        const x=280+r*Math.cos(a);
        const y=320+.48*r*Math.sin(a)-18*birth*Math.cos(2*a+phase);
        d+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1);
      }
      return d+'Z';
    };
    zwFold.setAttribute('d',make(92,25,0));
    zwFoldInner.setAttribute('d',make(48,14,.8));
    if(zwCore)zwCore.setAttribute('r',(4+birth*4).toFixed(1));
  };

  const drawBasin=(t)=>{
    basinFlows.forEach((flow,i)=>flow.style.strokeDashoffset=String((i%2?-1:1)*t*12));
    basinParticles.forEach((el,i)=>{
      const u=(t*.115+i/basinParticles.length)%1;
      const ease=1-Math.pow(1-u,2.35);
      const angle=i*2.3999632297+ease*5.2;
      const r=212*Math.pow(1-u,1.28)+4;
      const x=280+r*Math.cos(angle);
      const y=282+.64*r*Math.sin(angle);
      el.setAttribute('cx',x.toFixed(1));
      el.setAttribute('cy',y.toFixed(1));
      el.setAttribute('r',(2.1+2.8*ease).toFixed(1));
      el.setAttribute('opacity',(.25+.72*ease).toFixed(2));
    });
  };

  const eigenWells=[[166,184],[382,196],[282,340]];
  const drawEigenSinks=(t)=>{
    eigenParticles.forEach((el,i)=>{
      const well=eigenWells[i%3];
      const u=(t*.095+(i*.079)%1)%1;
      const ease=1-Math.pow(1-u,2.1);
      const ang=i*1.713;
      const sx=280+205*Math.cos(ang);
      const sy=240+150*Math.sin(ang*1.17);
      const swirl=(1-ease)*30;
      const x=sx*(1-ease)+well[0]*ease+Math.sin(u*Math.PI*5+ang)*swirl;
      const y=sy*(1-ease)+well[1]*ease+Math.cos(u*Math.PI*4+ang)*swirl*.55;
      el.setAttribute('cx',x.toFixed(1));
      el.setAttribute('cy',y.toFixed(1));
      el.setAttribute('r',(1.8+2.7*ease).toFixed(1));
      el.setAttribute('opacity',(.18+.78*ease).toFixed(2));
    });
  };

  const drawResonance=(t)=>{
    const ring=(el,r0,amp,m,ph)=>{
      if(!el)return;
      let d='';
      for(let k=0;k<=140;k++){
        const a=k/140*Math.PI*2;
        const r=r0+amp*Math.sin(m*a)*Math.cos(1.45*t+ph);
        d+=(k?'L':'M')+(280+r*Math.cos(a)).toFixed(1)+' '+(240+r*Math.sin(a)).toFixed(1);
      }
      el.setAttribute('d',d+'Z');
    };
    ring(mode1,110,21,4,0);
    ring(mode2,158,12,6,1);
  };

  const drawCurvature=(t)=>{
    if(!marker||!tangent||!osc)return;
    const th=(t*.42)%(Math.PI*2),p=gammaPt(th),a=gammaPt(th-.05),b=gammaPt(th+.05);
    const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;
    const c=circum(gammaPt(th-.18),p,gammaPt(th+.18));
    marker.setAttribute('cx',p[0].toFixed(1));marker.setAttribute('cy',p[1].toFixed(1));
    tangent.setAttribute('x1',(p[0]-dx/l*44).toFixed(1));tangent.setAttribute('y1',(p[1]-dy/l*44).toFixed(1));
    tangent.setAttribute('x2',(p[0]+dx/l*44).toFixed(1));tangent.setAttribute('y2',(p[1]+dy/l*44).toFixed(1));
    if(c){
      osc.setAttribute('cx',c[0].toFixed(1));osc.setAttribute('cy',c[1].toFixed(1));
      osc.setAttribute('r',Math.min(c[2],210).toFixed(1));
    }
  };

  const drawTheoryFrame=(t)=>{
    if(activeStage===0)drawFold(t);
    else if(activeStage===1)drawBasin(t);
    else if(activeStage===3&&shellDots)shellDots.setAttribute('transform','rotate('+((t*4)%360).toFixed(2)+' 280 240)');
    else if(activeStage===4){
      if(fluxOne)fluxOne.style.strokeDashoffset=String(-(t*18)%120);
      if(fluxTwo)fluxTwo.style.strokeDashoffset=String((t*14)%120);
    }else if(activeStage===5)drawEigenSinks(t);
    else if(activeStage===6)drawResonance(t);
    else if(activeStage===7)drawCurvature(t);
  };

  const theoryLoop=(ts)=>{
    if(reduced.matches||!theoryVisible){theoryRaf=0;return}
    if(ts-lastTheoryFrame>32){
      drawTheoryFrame(ts/1000);
      lastTheoryFrame=ts;
    }
    theoryRaf=requestAnimationFrame(theoryLoop);
  };

  const setStage=(stage)=>{
    activeStage=Math.max(0,Math.min(7,stage));
    if(theoryVisual)theoryVisual.dataset.stage=String(activeStage);
    steps.forEach((step,i)=>step.classList.toggle('active',i===activeStage));
    pips.forEach((pip,i)=>pip.classList.toggle('active',i<=activeStage));
    if(caption)caption.textContent=String(activeStage+1).padStart(2,'0')+' / 08 · '+labels[activeStage];
    if(theoryProgress)theoryProgress.style.width=((activeStage+1)/8*100).toFixed(2)+'%';
    drawTheoryFrame(performance.now()/1000);
  };

  const nearestStage=()=>{
    const anchor=innerHeight*.5;
    let best=0,dist=Infinity;
    steps.forEach((step,i)=>{
      const r=step.getBoundingClientRect();
      const d=Math.abs(r.top+r.height*.5-anchor);
      if(d<dist){dist=d;best=i}
    });
    return best;
  };

  if(theoryWrap&&'IntersectionObserver'in window){
    const io=new IntersectionObserver(([entry])=>{
      theoryVisible=entry.isIntersecting;
      if(theoryVisible&&!reduced.matches&&!theoryRaf)theoryRaf=requestAnimationFrame(theoryLoop);
    },{rootMargin:'120px'});
    io.observe(theoryWrap);
  }else if(theoryVisual&&!reduced.matches){
    theoryRaf=requestAnimationFrame(theoryLoop);
  }

  // Scroll-built registered equation chain.
  const eqBuild=document.querySelector('[data-equation-build]');
  const eqKnot=document.querySelector('.eq-knot');
  const eqSigma=document.querySelector('.eq-sigma');
  const eqPhase=document.querySelector('.eq-phase');
  const eqTangent=document.querySelector('.eq-tangent');
  const eqOsc=document.querySelector('.eq-osc');
  const eqMean=document.querySelector('[data-eq-mean]');
  const eqMeanLabel=document.querySelector('[data-eq-mean-label]');
  const eqStage=document.querySelector('[data-eq-stage]');
  const eqProgress=document.querySelector('[data-eq-progress]');
  const eqCards=[...document.querySelectorAll('[data-eq-card]')];
  let eqData=null;

  const buildEquation=()=>{
    if(!eqKnot||!eqSigma)return;
    const N=300,R=2,r=.72,p=2,q=3,pts=[];
    const f=(t)=>{
      const cq=Math.cos(q*t),sq=Math.sin(q*t),cp=Math.cos(p*t),sp=Math.sin(p*t);
      return [(R+r*cq)*cp,(R+r*cq)*sp,r*sq];
    };
    for(let i=0;i<N;i++)pts.push(f(i/N*Math.PI*2));
    const sub=(a,b)=>a.map((v,i)=>v-b[i]);
    const add=(a,b)=>a.map((v,i)=>v+b[i]);
    const mul=(a,s)=>a.map(v=>v*s);
    const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
    const norm=a=>Math.hypot(...a);
    const sig=[];

    for(let i=0;i<N;i++){
      const m2=pts[(i-2+N)%N],m1=pts[(i-1+N)%N],p1=pts[(i+1)%N],p2=pts[(i+2)%N];
      const d1=mul(sub(p1,m1),.5);
      const d2=add(sub(p1,mul(pts[i],2)),m1);
      const d3=mul(add(sub(p2,mul(p1,2)),sub(mul(m1,2),m2)),.5);
      const cr=cross(d1,d2),crn=norm(cr),d1n=norm(d1);
      const k=crn/Math.max(1e-9,d1n*d1n*d1n);
      const tau=dot(cr,d3)/Math.max(1e-9,crn*crn);
      sig.push(Math.sqrt(k*k+tau*tau));
    }

    const proj=pts.map(v=>[260+72*v[0]+22*v[2],210+72*v[1]-18*v[2]]);
    let kd='';
    proj.forEach((v,i)=>kd+=(i?'L':'M')+v[0].toFixed(1)+' '+v[1].toFixed(1));
    eqKnot.setAttribute('d',kd+'Z');
    eqKnot.setAttribute('pathLength','1');

    const max=Math.max(...sig),min=Math.min(...sig),base=490,amp=88;
    let sd='';
    sig.forEach((v,i)=>{
      const x=38+i/(N-1)*444,y=base-(v-min)/Math.max(1e-9,max-min)*amp;
      sd+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1);
    });
    eqSigma.setAttribute('d',sd);
    eqSigma.setAttribute('pathLength','1');

    const mean=sig.reduce((a,b)=>a+b,0)/N;
    const meanY=base-(mean-min)/Math.max(1e-9,max-min)*amp;
    if(eqMean){eqMean.setAttribute('y1',meanY.toFixed(1));eqMean.setAttribute('y2',meanY.toFixed(1))}
    if(eqMeanLabel)eqMeanLabel.setAttribute('y',(meanY-8).toFixed(1));
    eqData={proj,sig,mean,min,max};
  };

  const renderEquationProgress=(p)=>{
    if(!eqData||!eqKnot||!eqSigma)return;
    const knotP=clamp(p/.28);
    const phaseP=clamp((p-.22)/.22);
    const sigP=clamp((p-.48)/.28);
    const meanP=clamp((p-.79)/.14);

    eqKnot.style.strokeDasharray='1';
    eqKnot.style.strokeDashoffset=String(1-knotP);
    eqSigma.style.strokeDasharray='1';
    eqSigma.style.strokeDashoffset=String(1-sigP);
    if(eqMean)eqMean.style.opacity=String(meanP);
    if(eqMeanLabel)eqMeanLabel.style.opacity=String(meanP);

    const idx=Math.min(eqData.proj.length-1,Math.floor(phaseP*(eqData.proj.length-1)));
    const pt=eqData.proj[idx]||eqData.proj[0];
    if(eqPhase){
      eqPhase.setAttribute('cx',pt[0].toFixed(1));eqPhase.setAttribute('cy',pt[1].toFixed(1));
      eqPhase.style.opacity=String(phaseP);
    }
    const a=eqData.proj[(idx-2+eqData.proj.length)%eqData.proj.length],b=eqData.proj[(idx+2)%eqData.proj.length];
    if(eqTangent&&a&&b){
      const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;
      eqTangent.setAttribute('x1',(pt[0]-dx/l*34).toFixed(1));eqTangent.setAttribute('y1',(pt[1]-dy/l*34).toFixed(1));
      eqTangent.setAttribute('x2',(pt[0]+dx/l*34).toFixed(1));eqTangent.setAttribute('y2',(pt[1]+dy/l*34).toFixed(1));
      eqTangent.style.opacity=String(phaseP);
    }
    if(eqOsc&&a&&b){
      const c=circum(a,pt,b);
      if(c){
        eqOsc.setAttribute('cx',c[0].toFixed(1));eqOsc.setAttribute('cy',c[1].toFixed(1));
        eqOsc.setAttribute('r',Math.min(c[2],100).toFixed(1));eqOsc.style.opacity=String(phaseP);
      }
    }

    const thresholds=[.16,.53,.81];
    eqCards.forEach((card,i)=>card.classList.toggle('active',p>=thresholds[i]));

    let stage='01 · closed curve Γ';
    if(p>=.28)stage='02 · tangent + osculating geometry';
    if(p>=.48)stage='03 · σ(s) along arc length';
    if(p>=.79)stage='04 · ⟨σ⟩ → k_eff';
    if(eqStage)eqStage.textContent=stage;
    if(eqProgress)eqProgress.textContent=Math.round(p*100)+'%';
  };

  buildEquation();

  const updatePrioritySpine=()=>{
    if(!prioritySpine||!priorityItems.length)return;
    if(reduced.matches){
      prioritySpine.style.setProperty('--spine-progress','1');
      priorityItems.forEach((item,i)=>{
        item.classList.add('spine-reached');
        item.classList.toggle('spine-current',i===priorityItems.length-1);
      });
      return;
    }

    const vh=innerHeight||1;
    const anchor=vh*.58;
    const spineRect=prioritySpine.getBoundingClientRect();
    const firstRect=priorityItems[0].getBoundingClientRect();
    const lastRect=priorityItems[priorityItems.length-1].getBoundingClientRect();
    const firstY=firstRect.top+firstRect.height*.5;
    const lastY=lastRect.top+lastRect.height*.5;
    const span=Math.max(1,lastY-firstY);
    const progress=clamp((anchor-firstY)/span);
    prioritySpine.style.setProperty('--spine-progress',progress.toFixed(4));

    let current=0;
    let currentDist=Infinity;
    priorityItems.forEach((item,i)=>{
      const r=item.getBoundingClientRect();
      const center=r.top+r.height*.5;
      const reached=center<=anchor+1;
      item.classList.toggle('spine-reached',reached);
      const d=Math.abs(center-anchor);
      if(d<currentDist){currentDist=d;current=i}
    });
    priorityItems.forEach((item,i)=>item.classList.toggle('spine-current',i===current));
  };

  const updateScroll=()=>{
    scrollRaf=0;
    updatePrioritySpine();
    if(theoryVisual&&steps.length&&innerWidth>980&&!reduced.matches)setStage(nearestStage());

    if(eqBuild&&eqData){
      const vh=innerHeight||1;
      const r=eqBuild.getBoundingClientRect();
      const travel=Math.max(1,eqBuild.offsetHeight-vh);
      const p=(innerWidth>980&&!reduced.matches)?clamp((88-r.top)/travel):1;
      renderEquationProgress(p);
    }
  };
  const schedule=()=>{if(!scrollRaf)scrollRaf=requestAnimationFrame(updateScroll)};

  document.querySelectorAll('[data-card-href]').forEach((card)=>{
    const href=card.dataset.cardHref;
    if(!href)return;
    const open=()=>{location.href=href};
    card.addEventListener('click',(event)=>{
      if(event.target.closest('a,button,input,select,textarea,summary'))return;
      open();
    });
    card.addEventListener('keydown',(event)=>{
      if(event.target!==card||!['Enter',' '].includes(event.key))return;
      event.preventDefault();open();
    });
  });

  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  reduced.addEventListener?.('change',()=>{
    if(reduced.matches){
      setStage(0);
      renderEquationProgress(1);
      updatePrioritySpine();
    }else{
      schedule();
      if(theoryVisible&&!theoryRaf)theoryRaf=requestAnimationFrame(theoryLoop);
    }
  });

  drawFold(.8);
  drawBasin(.8);
  drawEigenSinks(.8);
  drawResonance(.8);
  drawCurvature(.8);
  setStage(0);
  renderEquationProgress(innerWidth<=980||reduced.matches?1:0);
  updateScroll();
})();