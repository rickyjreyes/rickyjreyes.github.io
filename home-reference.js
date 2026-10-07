(() => {
  'use strict';

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));

  // Active header chapter + lightweight scroll-driven state.
  const navLinks = [...document.querySelectorAll('.home-nav a[href^="#"]')];
  const navSections = navLinks.map(link => ({link, section: document.querySelector(link.getAttribute('href'))})).filter(x=>x.section);

  const evidence = document.querySelector('.evidence-spine');
  const theoryVisual = document.querySelector('.theory-visual');
  const theorySteps = [...document.querySelectorAll('.theory-step')];
  const pips = [...document.querySelectorAll('.theory-pips i')];
  const eqBuild = document.querySelector('.equation-build');
  const eqKnot = document.querySelector('.eq-knot');
  const eqSigma = document.querySelector('.eq-sigma');
  const eqPhase = document.querySelector('.eq-phase');
  const eqTangent = document.querySelector('.eq-tangent');
  const eqOsc = document.querySelector('.eq-osc');
  const techMap = document.querySelector('.tech-map');

  let raf = 0;
  let activeStage = 0;
  let eqData = null;

  const nearestStage = () => {
    if (!theorySteps.length) return 0;
    const anchor = innerHeight * .5;
    let best=0, dist=Infinity;
    theorySteps.forEach((step,i)=>{
      const r=step.getBoundingClientRect();
      const d=Math.abs(r.top+r.height*.5-anchor);
      if(d<dist){dist=d;best=i}
    });
    return best;
  };

  const setStage = (stage) => {
    if (!theoryVisual) return;
    activeStage = stage;
    theoryVisual.dataset.stage = String(stage);
    theorySteps.forEach((step,i)=>step.classList.toggle('active',i===stage));
    pips.forEach((pip,i)=>pip.classList.toggle('active',i<=stage));
    const cap=document.querySelector('[data-theory-caption]');
    if(cap) cap.textContent = String(stage+1).padStart(2,'0')+' / 08 · '+[
      'Zero-wave invariant state',
      'Lyapunov descent',
      'Sobolev confinement bound',
      'Finite-k selection',
      'Phase–Flux substrate',
      'Self-emergent eigenmodes',
      'Resonant confinement',
      'Curvature locking'
    ][stage];
  };

  const updateScroll = () => {
    raf=0;
    const vh=innerHeight || 1;

    let active=null;
    navSections.forEach(item=>{
      if(item.section.getBoundingClientRect().top<=110) active=item;
    });
    navSections.forEach(item=>{
      if(active===item) item.link.setAttribute('aria-current','location');
      else item.link.removeAttribute('aria-current');
    });

    if(evidence){
      const r=evidence.getBoundingClientRect();
      const p=clamp((vh*.72-r.top)/Math.max(1,r.height-vh*.18));
      evidence.style.setProperty('--evidence-progress',p.toFixed(4));
    }

    if(theoryVisual && innerWidth>1050 && !reduced.matches) setStage(nearestStage());

    if(eqBuild && eqData){
      const r=eqBuild.getBoundingClientRect();
      const travel=Math.max(1,eqBuild.offsetHeight-vh);
      const p=(innerWidth>1050 && !reduced.matches)?clamp(-r.top/travel):1;
      renderEquationProgress(p);
    }

    if(techMap){
      const r=techMap.getBoundingClientRect();
      if(r.top<vh*.85) techMap.dataset.ready='true';
    }
  };

  const schedule=()=>{if(!raf) raf=requestAnimationFrame(updateScroll)};

  // Hero field: low-resolution computed field, paused off-screen.
  const canvas=document.getElementById('hero-field-canvas');
  let heroRaf=0, heroVisible=true;
  if(canvas){
    const ctx=canvas.getContext('2d',{alpha:false});
    const size=140, buf=document.createElement('canvas');buf.width=buf.height=size;
    const bctx=buf.getContext('2d',{alpha:false});
    const img=bctx.createImageData(size,size), coords=new Float32Array(size*size*4);
    for(let yi=0;yi<size;yi++)for(let xi=0;xi<size;xi++){
      const i=(yi*size+xi)*4,x=xi/(size-1)*2-1,y=yi/(size-1)*2-1;
      coords[i]=x;coords[i+1]=y;coords[i+2]=Math.hypot(x,y);coords[i+3]=Math.atan2(y,x);
    }
    const render=(time)=>{
      const px=img.data;
      for(let p=0;p<size*size;p++){
        const i=p*4,x=coords[i],y=coords[i+1],r=coords[i+2],a=coords[i+3];
        const env=Math.exp(-2.8*r*r),fade=clamp((1.42-r)*2.45);
        let tr=0;
        for(let c=0;c<3;c++){
          const d=c*Math.PI*2/3+.22,al=x*Math.cos(d)+y*Math.sin(d),ac=-x*Math.sin(d)+y*Math.cos(d);
          tr+=Math.sin(14.8*al-time*(2.35+c*.27)+c*1.75)*(.5+.5*Math.exp(-2.1*ac*ac));
        }
        const cr=.68*Math.sin(12.4*(x+.67*y)+time*1.95)+.58*Math.cos(14.1*(.72*x-y)-time*2.2);
        const lk=Math.sin(17.2*r-time*2.55+1.15*Math.sin(a*2-time*.62))+.34*Math.cos(24.2*r+a*3+time*1.08);
        const f=.42*tr+.31*cr+.9*env*lk,crest=.5+.5*Math.tanh(f*1.08);
        const g=Math.min(1,Math.abs(f)*.5+env*.18)*fade,node=Math.exp(-28*Math.abs(f))*env*.16;
        px[i]=4+(90+44*(1-crest))*g+88*node;px[i+1]=10+(168+50*crest)*g+148*node;px[i+2]=18+(222+30*crest)*g+135*node;px[i+3]=255;
      }
      bctx.putImageData(img,0,0);ctx.drawImage(buf,0,0,canvas.width,canvas.height);
    };
    render(.8);
    const start=performance.now();let lastHero=0;
    const loop=(ts)=>{
      if(!heroVisible||reduced.matches){heroRaf=0;return}
      if(ts-lastHero>40){render((ts-start)/1000);lastHero=ts}
      heroRaf=requestAnimationFrame(loop);
    };
    if('IntersectionObserver'in window){
      const io=new IntersectionObserver(([entry])=>{
        heroVisible=entry.isIntersecting;
        if(heroVisible&&!reduced.matches&&!heroRaf)heroRaf=requestAnimationFrame(loop);
      },{rootMargin:'80px'});
      io.observe(canvas);
    }else heroRaf=requestAnimationFrame(loop);
  }

  // Theory scene primitives.
  const waves=[...document.querySelectorAll('[data-wave-line]')];
  const mode1=document.querySelector('[data-mode-one]');
  const mode2=document.querySelector('[data-mode-two]');
  const gamma=document.querySelector('[data-gamma]');
  const marker=document.querySelector('[data-gamma-marker]');
  const tangent=document.querySelector('[data-gamma-tangent]');
  const osc=document.querySelector('[data-gamma-osc]');
  const shellDots=document.querySelector('[data-shell-dots]');
  const fluxOne=document.querySelector('[data-flux-one]');
  const fluxTwo=document.querySelector('[data-flux-two]');

  const gammaPt=(t)=>{
    const r=128+28*Math.cos(3*t);
    return [240+r*Math.cos(t),240+.82*r*Math.sin(t)];
  };
  if(gamma){
    let d='';
    for(let i=0;i<=160;i++){
      const p=gammaPt(i/160*Math.PI*2);
      d+=(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);
    }
    gamma.setAttribute('d',d+'Z');
  }
  if(fluxOne){fluxOne.style.strokeDasharray='8 10'}
  if(fluxTwo){fluxTwo.style.strokeDasharray='5 12'}
  if(shellDots){
    const parts=[];
    for(let i=0;i<80;i++){
      const a=(i*2.399963229728653),rr=112+(i%3)*19;
      const x=240+rr*Math.cos(a),y=240+rr*Math.sin(a),hot=(i%5===0);
      parts.push('<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(hot?3.2:2)+'" fill="'+(hot?'#b6ffda':'#a899ff')+'" opacity="'+(hot?'.85':'.42')+'"/>');
    }
    shellDots.innerHTML=parts.join('');
  }

  const circum=(a,b,c)=>{
    const d=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));
    if(Math.abs(d)<1e-6)return null;
    const aa=a[0]*a[0]+a[1]*a[1],bb=b[0]*b[0]+b[1]*b[1],cc=c[0]*c[0]+c[1]*c[1];
    const ux=(aa*(b[1]-c[1])+bb*(c[1]-a[1])+cc*(a[1]-b[1]))/d;
    const uy=(aa*(c[0]-b[0])+bb*(a[0]-c[0])+cc*(b[0]-a[0]))/d;
    return [ux,uy,Math.hypot(ux-b[0],uy-b[1])];
  };
  let theoryRaf=0,theoryVisible=true,lastTheory=0;
  const theoryLoop=(ts)=>{
    if(reduced.matches||!theoryVisible||innerWidth<=1050){theoryRaf=0;return}
    if(ts-lastTheory<32){theoryRaf=requestAnimationFrame(theoryLoop);return}
    lastTheory=ts;
    const t=ts/1000;
    if(activeStage===4){
      if(fluxOne) fluxOne.style.strokeDashoffset=String(-(t*18)%120);
      if(fluxTwo) fluxTwo.style.strokeDashoffset=String((t*14)%120);
    }else if(activeStage===6){
      const ring=(el,r0,amp,m,ph)=>{
        if(!el)return;let d='';
        for(let k=0;k<=120;k++){
          const a=k/120*Math.PI*2,r=r0+amp*Math.sin(m*a)*Math.cos(1.5*t+ph);
          d+=(k?'L':'M')+(240+r*Math.cos(a)).toFixed(1)+' '+(240+r*Math.sin(a)).toFixed(1);
        }
        el.setAttribute('d',d+'Z');
      };
      ring(mode1,105,20,4,0);ring(mode2,150,12,6,1);
    }else if(activeStage===7 && marker && tangent && osc){
      const th=(t*.45)%(Math.PI*2),p=gammaPt(th),a=gammaPt(th-.05),b=gammaPt(th+.05);
      const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,c=circum(gammaPt(th-.18),p,gammaPt(th+.18));
      marker.setAttribute('cx',p[0].toFixed(1));marker.setAttribute('cy',p[1].toFixed(1));
      tangent.setAttribute('x1',(p[0]-dx/l*44).toFixed(1));tangent.setAttribute('y1',(p[1]-dy/l*44).toFixed(1));
      tangent.setAttribute('x2',(p[0]+dx/l*44).toFixed(1));tangent.setAttribute('y2',(p[1]+dy/l*44).toFixed(1));
      if(c){osc.setAttribute('cx',c[0].toFixed(1));osc.setAttribute('cy',c[1].toFixed(1));osc.setAttribute('r',Math.min(c[2],220).toFixed(1))}
    }
    theoryRaf=requestAnimationFrame(theoryLoop);
  };
  if(theoryVisual){
    if('IntersectionObserver'in window){
      const theoryIo=new IntersectionObserver(([entry])=>{
        theoryVisible=entry.isIntersecting;
        if(theoryVisible&&!reduced.matches&&innerWidth>1050&&!theoryRaf)theoryRaf=requestAnimationFrame(theoryLoop);
      },{rootMargin:'120px'});
      theoryIo.observe(theoryVisual);
    }else if(!reduced.matches&&innerWidth>1050){
      theoryRaf=requestAnimationFrame(theoryLoop);
    }
  }

  // Equation: numerical (2,3) torus knot, curvature/torsion spectral rate.
  const buildEquation=()=>{
    if(!eqKnot||!eqSigma)return;
    const N=280,R=2,r=.72,p=2,q=3,pts=[];
    const f=(t)=>{
      const cq=Math.cos(q*t),sq=Math.sin(q*t),cp=Math.cos(p*t),sp=Math.sin(p*t);
      return [(R+r*cq)*cp,(R+r*cq)*sp,r*sq];
    };
    for(let i=0;i<N;i++) pts.push(f(i/N*Math.PI*2));
    const sub=(a,b)=>a.map((v,i)=>v-b[i]), add=(a,b)=>a.map((v,i)=>v+b[i]), mul=(a,s)=>a.map(v=>v*s);
    const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0), norm=a=>Math.hypot(...a);
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
    let kd='';proj.forEach((v,i)=>kd+=(i?'L':'M')+v[0].toFixed(1)+' '+v[1].toFixed(1));kd+='Z';
    eqKnot.setAttribute('d',kd);eqKnot.setAttribute('pathLength','1');
    const max=Math.max(...sig),min=Math.min(...sig),base=490,amp=88;
    let sd='';
    sig.forEach((v,i)=>{const x=38+i/(N-1)*444,y=base-(v-min)/Math.max(1e-9,max-min)*amp;sd+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)});
    eqSigma.setAttribute('d',sd);eqSigma.setAttribute('pathLength','1');
    const mean=sig.reduce((a,b)=>a+b,0)/N;
    eqData={proj,sig,mean,min,max};
    const meanLine=document.querySelector('[data-eq-mean]');
    if(meanLine){
      const y=base-(mean-min)/Math.max(1e-9,max-min)*amp;
      meanLine.setAttribute('y1',y.toFixed(1));meanLine.setAttribute('y2',y.toFixed(1));
      const label=document.querySelector('[data-eq-mean-label]');if(label)label.setAttribute('y',(y-8).toFixed(1));
    }
    renderEquationProgress(reduced.matches||innerWidth<=1050?1:0);
  };

  const renderEquationProgress=(p)=>{
    if(!eqData)return;
    const knotP=clamp(p/.28),phaseP=clamp((p-.25)/.2),sigP=clamp((p-.48)/.26),meanP=clamp((p-.78)/.12);
    eqKnot.style.strokeDasharray='1';eqKnot.style.strokeDashoffset=String(1-knotP);
    eqSigma.style.strokeDasharray='1';eqSigma.style.strokeDashoffset=String(1-sigP);
    const meanLine=document.querySelector('[data-eq-mean]'),meanLabel=document.querySelector('[data-eq-mean-label]');
    if(meanLine)meanLine.style.opacity=String(meanP);if(meanLabel)meanLabel.style.opacity=String(meanP);
    const idx=Math.min(eqData.proj.length-1,Math.floor(phaseP*(eqData.proj.length-1))),pt=eqData.proj[idx]||eqData.proj[0];
    if(eqPhase){eqPhase.setAttribute('cx',pt[0].toFixed(1));eqPhase.setAttribute('cy',pt[1].toFixed(1));eqPhase.style.opacity=String(phaseP)}
    const a=eqData.proj[(idx-2+eqData.proj.length)%eqData.proj.length],b=eqData.proj[(idx+2)%eqData.proj.length];
    if(eqTangent&&a&&b){
      const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;
      eqTangent.setAttribute('x1',(pt[0]-dx/l*34).toFixed(1));eqTangent.setAttribute('y1',(pt[1]-dy/l*34).toFixed(1));
      eqTangent.setAttribute('x2',(pt[0]+dx/l*34).toFixed(1));eqTangent.setAttribute('y2',(pt[1]+dy/l*34).toFixed(1));
      eqTangent.style.opacity=String(phaseP);
    }
    if(eqOsc&&a&&b){
      const c=circum(a,pt,b);if(c){eqOsc.setAttribute('cx',c[0]);eqOsc.setAttribute('cy',c[1]);eqOsc.setAttribute('r',Math.min(c[2],100));eqOsc.style.opacity=String(phaseP)}
    }
    const cards=[...document.querySelectorAll('.equation-chain article')];
    cards.forEach((card,i)=>{
      const on=p>=[.18,.55,.82][i];
      card.style.setProperty('--eq-color',on?'#b6ffda':'rgba(150,180,205,.14)');
      card.style.setProperty('--eq-bg',on?'rgba(182,255,218,.035)':'transparent');
    });
  };
  buildEquation();

  document.querySelectorAll('.clickable-card[data-card-href]').forEach((card)=>{
    const openCard=()=>{
      const href=card.dataset.cardHref;
      if(!href)return;
      if(/^https?:\/\//.test(href)) window.open(href,'_blank','noopener,noreferrer');
      else location.href=href;
    };
    card.addEventListener('click',(event)=>{
      if(event.target.closest('a,button'))return;
      openCard();
    });
    card.addEventListener('keydown',(event)=>{
      if(event.key==='Enter'||event.key===' '){
        if(event.target.closest('a,button') && event.target!==card)return;
        event.preventDefault();
        openCard();
      }
    });
  });

  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',()=>{
    schedule();
    if(theoryVisible&&!reduced.matches&&innerWidth>1050&&!theoryRaf)theoryRaf=requestAnimationFrame(theoryLoop);
  },{passive:true});
  reduced.addEventListener?.('change',()=>{
    if(reduced.matches){setStage(7);renderEquationProgress(1)}
    else if(theoryVisible&&innerWidth>1050&&!theoryRaf)theoryRaf=requestAnimationFrame(theoryLoop);
    schedule();
  });
  setStage(innerWidth<=1050||reduced.matches?3:0);
  root.classList.add('reference-ready');
  updateScroll();
})();