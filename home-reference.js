(() => {
  'use strict';

  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const theoryVisual=document.querySelector('.wct-theory-visual');
  const steps=[...document.querySelectorAll('.wct-theory-step')];
  const pips=[...document.querySelectorAll('.wct-theory-pips i')];
  const caption=document.querySelector('[data-theory-caption]');
  const shellDots=document.querySelector('[data-shell-dots]');
  const fluxOne=document.querySelector('[data-flux-one]');
  const fluxTwo=document.querySelector('[data-flux-two]');
  const mode1=document.querySelector('[data-mode-one]');
  const mode2=document.querySelector('[data-mode-two]');
  const gamma=document.querySelector('[data-gamma]');
  const marker=document.querySelector('[data-gamma-marker]');
  const tangent=document.querySelector('[data-gamma-tangent]');
  const osc=document.querySelector('[data-gamma-osc]');

  const labels=[
    'Zero-wave invariant state',
    'Lyapunov descent',
    'Sobolev confinement bound',
    'Finite-k selection',
    'Phase–Flux substrate',
    'Self-emergent eigenmodes',
    'Resonant confinement',
    'Curvature locking'
  ];

  let active=0;
  let raf=0;
  let theoryVisible=true;
  let lastAnim=0;

  const gammaPt=(t)=>{
    const r=128+28*Math.cos(3*t);
    return [240+r*Math.cos(t),240+.82*r*Math.sin(t)];
  };

  const circum=(a,b,c)=>{
    const d=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));
    if(Math.abs(d)<1e-6)return null;
    const aa=a[0]*a[0]+a[1]*a[1],bb=b[0]*b[0]+b[1]*b[1],cc=c[0]*c[0]+c[1]*c[1];
    const ux=(aa*(b[1]-c[1])+bb*(c[1]-a[1])+cc*(a[1]-b[1]))/d;
    const uy=(aa*(c[0]-b[0])+bb*(a[0]-c[0])+cc*(b[0]-a[0]))/d;
    return [ux,uy,Math.hypot(ux-b[0],uy-b[1])];
  };

  if(shellDots){
    const colors=['var(--accent-3)','var(--accent-2)','var(--accent)'];
    const parts=[];
    for(let i=0;i<72;i++){
      const a=i*2.399963229728653,rr=112+(i%3)*19,x=240+rr*Math.cos(a),y=240+rr*Math.sin(a);
      const hot=i%5===0;
      parts.push('<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(hot?3.1:2)+'" fill="'+colors[i%3]+'" opacity="'+(hot?'.82':'.38')+'"/>');
    }
    shellDots.innerHTML=parts.join('');
  }
  if(fluxOne){fluxOne.style.strokeDasharray='8 10'}
  if(fluxTwo){fluxTwo.style.strokeDasharray='5 12'}
  if(gamma){
    let d='';
    for(let i=0;i<=160;i++){
      const p=gammaPt(i/160*Math.PI*2);
      d+=(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);
    }
    gamma.setAttribute('d',d+'Z');
  }

  const setStage=(stage)=>{
    active=Math.max(0,Math.min(7,stage));
    if(theoryVisual)theoryVisual.dataset.stage=String(active);
    steps.forEach((step,i)=>step.classList.toggle('active',i===active));
    pips.forEach((pip,i)=>pip.classList.toggle('active',i<=active));
    if(caption)caption.textContent=String(active+1).padStart(2,'0')+' / 08 · '+labels[active];
  };

  const updateStage=()=>{
    raf=0;
    if(!theoryVisual||!steps.length)return;
    const anchor=innerHeight*.5;
    let best=0,dist=Infinity;
    steps.forEach((step,i)=>{
      const r=step.getBoundingClientRect();
      const d=Math.abs((r.top+r.height*.5)-anchor);
      if(d<dist){dist=d;best=i}
    });
    setStage(best);
  };
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(updateStage)};

  const animate=(ts)=>{
    if(!theoryVisible||reduced.matches){lastAnim=0;return}
    if(ts-lastAnim<34){requestAnimationFrame(animate);return}
    lastAnim=ts;
    const t=ts/1000;

    if(active===4){
      if(fluxOne)fluxOne.style.strokeDashoffset=String(-(t*18)%120);
      if(fluxTwo)fluxTwo.style.strokeDashoffset=String((t*14)%120);
    }else if(active===6){
      const ring=(el,r0,amp,m,ph)=>{
        if(!el)return;
        let d='';
        for(let k=0;k<=120;k++){
          const a=k/120*Math.PI*2,r=r0+amp*Math.sin(m*a)*Math.cos(1.45*t+ph);
          d+=(k?'L':'M')+(240+r*Math.cos(a)).toFixed(1)+' '+(240+r*Math.sin(a)).toFixed(1);
        }
        el.setAttribute('d',d+'Z');
      };
      ring(mode1,105,20,4,0);
      ring(mode2,150,12,6,1);
    }else if(active===7 && marker && tangent && osc){
      const th=(t*.45)%(Math.PI*2),p=gammaPt(th),a=gammaPt(th-.05),b=gammaPt(th+.05);
      const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,c=circum(gammaPt(th-.18),p,gammaPt(th+.18));
      marker.setAttribute('cx',p[0].toFixed(1));marker.setAttribute('cy',p[1].toFixed(1));
      tangent.setAttribute('x1',(p[0]-dx/l*44).toFixed(1));tangent.setAttribute('y1',(p[1]-dy/l*44).toFixed(1));
      tangent.setAttribute('x2',(p[0]+dx/l*44).toFixed(1));tangent.setAttribute('y2',(p[1]+dy/l*44).toFixed(1));
      if(c){osc.setAttribute('cx',c[0].toFixed(1));osc.setAttribute('cy',c[1].toFixed(1));osc.setAttribute('r',Math.min(c[2],220).toFixed(1))}
    }
    requestAnimationFrame(animate);
  };

  if(theoryVisual && 'IntersectionObserver' in window){
    const io=new IntersectionObserver(([entry])=>{
      theoryVisible=entry.isIntersecting;
      if(theoryVisible&&!reduced.matches)requestAnimationFrame(animate);
    },{rootMargin:'120px'});
    io.observe(theoryVisual);
  }else if(theoryVisual&&!reduced.matches){
    requestAnimationFrame(animate);
  }

  // Numerical illustrative torus-knot curve + sigma(s) trace.
  const eqKnot=document.querySelector('.eq-knot');
  const eqSigma=document.querySelector('.eq-sigma');
  if(eqKnot&&eqSigma){
    const N=280,R=2,r=.72,p=2,q=3,pts=[];
    const f=(t)=>{
      const cq=Math.cos(q*t),sq=Math.sin(q*t),cp=Math.cos(p*t),sp=Math.sin(p*t);
      return [(R+r*cq)*cp,(R+r*cq)*sp,r*sq];
    };
    for(let i=0;i<N;i++)pts.push(f(i/N*Math.PI*2));
    const sub=(a,b)=>a.map((v,i)=>v-b[i]),add=(a,b)=>a.map((v,i)=>v+b[i]),mul=(a,s)=>a.map(v=>v*s);
    const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),norm=a=>Math.hypot(...a);
    const sig=[];
    for(let i=0;i<N;i++){
      const m2=pts[(i-2+N)%N],m1=pts[(i-1+N)%N],p1=pts[(i+1)%N],p2=pts[(i+2)%N];
      const d1=mul(sub(p1,m1),.5),d2=add(sub(p1,mul(pts[i],2)),m1),d3=mul(add(sub(p2,mul(p1,2)),sub(mul(m1,2),m2)),.5);
      const cr=cross(d1,d2),crn=norm(cr),d1n=norm(d1);
      const k=crn/Math.max(1e-9,d1n*d1n*d1n),tau=dot(cr,d3)/Math.max(1e-9,crn*crn);
      sig.push(Math.sqrt(k*k+tau*tau));
    }
    const proj=pts.map(v=>[260+72*v[0]+22*v[2],210+72*v[1]-18*v[2]]);
    let kd='';proj.forEach((v,i)=>kd+=(i?'L':'M')+v[0].toFixed(1)+' '+v[1].toFixed(1));eqKnot.setAttribute('d',kd+'Z');
    const max=Math.max(...sig),min=Math.min(...sig),base=490,amp=88;let sd='';
    sig.forEach((v,i)=>{const x=38+i/(N-1)*444,y=base-(v-min)/Math.max(1e-9,max-min)*amp;sd+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)});
    eqSigma.setAttribute('d',sd);
    const mean=sig.reduce((a,b)=>a+b,0)/N,y=base-(mean-min)/Math.max(1e-9,max-min)*amp;
    const meanLine=document.querySelector('[data-eq-mean]'),meanLabel=document.querySelector('[data-eq-mean-label]');
    if(meanLine){meanLine.setAttribute('y1',y.toFixed(1));meanLine.setAttribute('y2',y.toFixed(1))}
    if(meanLabel)meanLabel.setAttribute('y',(y-8).toFixed(1));
  }

  // Whole-card click behavior only for the newly enhanced rows/cards.
  document.querySelectorAll('[data-card-href]').forEach((card)=>{
    const href=card.dataset.cardHref;
    if(!href)return;
    const open=()=>{location.href=href};
    card.addEventListener('click',(event)=>{if(!event.target.closest('a,button,input,select,textarea,summary'))open()});
    card.addEventListener('keydown',(event)=>{
      if(event.target!==card||!['Enter',' '].includes(event.key))return;
      event.preventDefault();open();
    });
  });

  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  reduced.addEventListener?.('change',()=>{schedule()});
  setStage(0);
  updateStage();
})();