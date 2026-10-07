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
    'Zero-wave turbulence → ZW1 fold',
    'Lyapunov basin flow',
    'Sobolev three-dimensional bound',
    'Finite-k shell selection',
    'Phase–Flux torus · spindle · capacity',
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
  const zwTurbulenceGroup=document.querySelector('[data-zw-turbulence]');
  const zwParticlesGroup=document.querySelector('[data-zw-particles]');
  const pffGridBack=document.querySelector('[data-pff-grid-back]');
  const pffGridFront=document.querySelector('[data-pff-grid-front]');
  const pffFluxThreads=document.querySelector('[data-pff-flux-threads]');
  const pffSpindle=document.querySelector('[data-pff-spindle]');
  const pffSpindleAxis=document.querySelector('[data-pff-spindle-axis]');
  const pffParticlesGroup=document.querySelector('[data-pff-particles]');
  const pffCapacity=document.querySelector('[data-pff-capacity]');
  const sobolevLattice=document.querySelector('[data-sobolev-lattice]');
  const sobolevContours=document.querySelector('[data-sobolev-contours]');
  const sobolevParticleGroup=document.querySelector('[data-sobolev-particles]');
  const sobolevRaysGroup=document.querySelector('[data-sobolev-rays]');
  const sobolevPeak=document.querySelector('[data-sobolev-peak]');
  const sobolevPeakFill=document.querySelector('[data-sobolev-peak-fill]');
  const sobolevPeakNode=document.querySelector('[data-sobolev-peak-node]');
  const sobolevGraph=document.querySelector('[data-sobolev-scaling-line]');
  const sobolevGuides=document.querySelector('[data-sobolev-guides]');
  const sobolevMarker=document.querySelector('[data-sobolev-scaling-marker]');
  const sobolevDimensionLabel=document.querySelector('[data-sobolev-dimension-label]');
  const sobolevStatus=document.querySelector('[data-sobolev-state]');
  const sobolevSlope=document.querySelector('[data-sobolev-slope]');
  const sobolevPeakValue=document.querySelector('[data-sobolev-peak-value]');
  const sobolevFocusLabel=document.querySelector('[data-sobolev-lambda]');
  const sobolevControls=[...document.querySelectorAll('[data-sobolev-dim]')];
  const sobolevControlNote=document.querySelector('[data-sobolev-control-note]');
  const basinParticlesGroup=document.querySelector('[data-basin-particles]');
  const basinFlows=[...document.querySelectorAll('.basin-flow')];
  const shellDots=document.querySelector('[data-shell-dots]');
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

  // Stage 01: deterministic broadband strands around the zero-wave reference.
  // Animated folding is explanatory; no turbulent PDE is being integrated.
  const svgEl=(tag,attrs={},parent)=>{
    const el=document.createElementNS('http://www.w3.org/2000/svg',tag);
    Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,String(value)));
    if(parent)parent.appendChild(el);
    return el;
  };
  const zwStrands=[];
  if(zwTurbulenceGroup){
    for(let i=0;i<15;i++){
      zwStrands.push(svgEl('path',{
        class:i%3===0?'zw-strand zw-strand-violet':i%3===1?'zw-strand zw-strand-cyan':'zw-strand zw-strand-green',
        'stroke-width':i%4===0?1.5:1,
        opacity:i%5===0?.75:.46
      },zwTurbulenceGroup));
    }
  }
  const zwSpecks=[];
  if(zwParticlesGroup){
    for(let i=0;i<30;i++){
      zwSpecks.push(svgEl('circle',{
        class:i%3===0?'fill-accent':i%3===1?'fill-accent2':'fill-accent3',
        r:i%5===0?2.6:1.5,
        opacity:'.55'
      },zwParticlesGroup));
    }
  }

  // Stage 05: illustrative toroidal coordinate grid, circulating flux and
  // spindle channel. No finite-element solution or empirical flux is implied.
  const torusGrid=[];
  const torusThreads=[];
  if(pffGridBack&&pffGridFront){
    for(let i=0;i<10;i++)torusGrid.push({el:svgEl('path',{
      class:i%2===0?'pff-grid-line pff-grid-violet':'pff-grid-line pff-grid-cyan'
    },i<5?pffGridBack:pffGridFront),type:'longitude',i});
    for(let i=0;i<18;i++)torusGrid.push({el:svgEl('path',{
      class:'pff-grid-line pff-grid-meridian'
    },i%2?pffGridBack:pffGridFront),type:'meridian',i});
  }
  if(pffFluxThreads){
    for(let i=0;i<3;i++){
      torusThreads.push(svgEl('path',{
        class:['pff-thread pff-thread-cyan','pff-thread pff-thread-violet','pff-thread pff-thread-green'][i]
      },pffFluxThreads));
    }
  }
  const pffParticles=[];
  if(pffParticlesGroup){
    for(let i=0;i<14;i++){
      pffParticles.push(svgEl('circle',{
        class:['fill-accent','fill-accent2','fill-accent3'][i%3],
        r:i%4===0?3.8:2.7
      },pffParticlesGroup));
    }
  }

  const torusProject=(theta,phi,rotation=0)=>{
    const R=117,r=40;
    const T=theta+rotation;
    const radius=R+r*Math.cos(phi);
    const x=radius*Math.cos(T),y=radius*Math.sin(T),z=r*Math.sin(phi);
    return [280+x+.10*y,239+.45*y-.9*z];
  };

  const drawPffTorus=t=>{
    const rotation=t*.12;
    const polyline=(getPoint,n=84)=>{
      let path='';
      for(let k=0;k<=n;k++){
        const p=getPoint(k/n);
        path+=(k?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);
      }
      return path;
    };
    torusGrid.forEach(({el,type,i})=>{
      if(type==='longitude'){
        const phi=2*Math.PI*i/10;
        el.setAttribute('d',polyline(u=>torusProject(u*Math.PI*2,phi,rotation),90));
      }else{
        const theta=i*Math.PI*2/18;
        el.setAttribute('d',polyline(u=>torusProject(theta,u*Math.PI*2,rotation),46));
      }
    });
    torusThreads.forEach((el,i)=>{
      el.setAttribute('d',polyline(u=>torusProject(
        u*Math.PI*4+i*Math.PI*.45+t*.21,
        u*Math.PI*6+i*Math.PI*.68+t*.28,
        rotation),116));
      el.style.strokeDashoffset=String(-(t*24+i*16)%180);
    });
    if(pffSpindle){
      const swell=8*Math.sin(t*1.08);
      const w=45+swell;
      pffSpindle.setAttribute('d',
        'M280 113C'+(280+w).toFixed(1)+' 171 '+(280+w*1.17).toFixed(1)+
        ' 302 280 371C'+(280-w*1.17).toFixed(1)+' 302 '+
        (280-w).toFixed(1)+' 171 280 113Z');
    }
    if(pffSpindleAxis)pffSpindleAxis.style.strokeDashoffset=String(-(t*14)%60);
    pffParticles.forEach((el,i)=>{
      const u=(t*.085+i/pffParticles.length)%1;
      const phase=i%3;
      const p=torusProject(u*Math.PI*4+phase*Math.PI*.45,
        u*Math.PI*6+phase*Math.PI*.68,rotation);
      el.setAttribute('cx',p[0].toFixed(1));
      el.setAttribute('cy',p[1].toFixed(1));
      el.setAttribute('opacity',(.45+.5*Math.sin(u*Math.PI)).toFixed(2));
    });
    if(pffCapacity){
      // Null-flow normalization: full capacity. Pulse is decorative, not a measured ratio.
      pffCapacity.setAttribute('width','384');
      pffCapacity.style.opacity=(.76+.18*Math.sin(t*.72)).toFixed(2);
    }
  };

  // Stage 03: exact analytic Gaussian H² scaling illustrated as a concentrating packet.
  // g_n(x) Gaussian; ψ_{λ,n}(x) = λ^((n-4)/2) g_n(λx).
  // ∥Δψ_{λ,n}∥₂ stays constant while ∥ψ_{λ,n}∥∞ ∝ λ^((n-4)/2).
  // The full H² norm remains bounded for λ >= 1. At n=4 this particular
  // Gaussian remains amplitude-neutral; nonembedding at n=4 is more subtle.
  // Shapes are schematic projections, not a simulated WCT wavefield.
  const sobolevGridLines=[];
  const sobolevContourLines=[];
  const sobolevParticles=[];
  const sobolevRays=[];
  if(sobolevLattice)for(let i=0;i<84;i++){
    sobolevGridLines.push(svgEl('path',{
      class:i>=12?'sobolev-ghost-line':'sobolev-lattice-line'
    },sobolevLattice));
  }
  if(sobolevContours)for(let i=0;i<5;i++){
    sobolevContourLines.push(svgEl('ellipse',{
      class:i%2?'sobolev-contour violet':'sobolev-contour'
    },sobolevContours));
  }
  if(sobolevParticleGroup)for(let i=0;i<28;i++){
    sobolevParticles.push(svgEl('circle',{
      class:['fill-accent','fill-accent2','fill-accent3'][i%3],
      r:i%5===0?2.5:1.7
    },sobolevParticleGroup));
  }
  if(sobolevRaysGroup)for(let i=0;i<12;i++){
    sobolevRays.push(svgEl('line',{
      class:'sobolev-supercritical-ray'
    },sobolevRaysGroup));
  }
  if(sobolevGuides){
    for(const n of [3,4,6]){
      const alpha=(n-4)/2;
      svgEl('path',{
        class:'sobolev-reference-curve '+(n===6?'supercritical':n===4?'critical':'subcritical'),
        d:'M416 292L520 '+(292-55*alpha).toFixed(1)
      },sobolevGuides);
    }
  }

  const sobolevCycle=[[3,1.3],[4,1.3],[5,2.6],[6,3.5],[1,1.4],[2,1.4]];
  const sobolevDuration=sobolevCycle.reduce((sum,entry)=>sum+entry[1],0);
  let sobolevPinned=null;
  let sobolevCurrent=0;
  let sobolevStart=performance.now()/1000;

  const sobolevAuto=t=>{
    let elapsed=((t-sobolevStart)%sobolevDuration+sobolevDuration)%sobolevDuration;
    for(const [n,duration] of sobolevCycle){
      if(elapsed<duration)return {n,elapsed,duration};
      elapsed-=duration;
    }
    return {n:3,elapsed:0,duration:1.3};
  };

  const selectSobolevDimension=n=>{
    if(n===sobolevCurrent)return;
    sobolevCurrent=n;
    if(sobolevDimensionLabel)sobolevDimensionLabel.textContent=n+'D';
    const supercritical=n>4,critical=n===4;
    if(sobolevStatus){
      sobolevStatus.textContent=supercritical?'SUPERCRITICAL':critical?'CRITICAL':'SUBCRITICAL';
      sobolevStatus.classList.toggle('critical',critical);
      sobolevStatus.classList.toggle('supercritical',supercritical);
      sobolevStatus.classList.toggle('supported',n<4);
    }
    if(sobolevSlope){
      const alpha=(n-4)/2;
      sobolevSlope.textContent='α = '+(alpha>0?'+':'')+alpha.toFixed(1);
    }
    for(const el of [sobolevGraph,sobolevMarker,sobolevPeak,sobolevPeakFill,sobolevPeakNode]){
      if(!el)continue;
      el.classList.toggle('supercritical',supercritical);
      el.classList.toggle('critical',critical);
    }
    sobolevControls.forEach(button=>{
      const chosen=Number(button.dataset.sobolevDim)===n;
      button.setAttribute('aria-pressed',String(chosen));
      button.classList.toggle('supercritical',n>4&&chosen);
      button.classList.toggle('critical',n===4&&chosen);
    });
    if(sobolevGraph){
      const alpha=(n-4)/2;
      sobolevGraph.setAttribute('d',
        'M416 292L520 '+(292-55*alpha).toFixed(2));
    }
  };

  const drawSobolev=t=>{
    if(!sobolevLattice)return;
    const mode=sobolevPinned===null?sobolevAuto(t):{
      n:sobolevPinned,elapsed:Math.max(0,t-sobolevStart),duration:3.25
    };
    const n=mode.n,alpha=(n-4)/2;
    selectSobolevDimension(n);
    const progress=reduced.matches?1:clamp(mode.elapsed/Math.max(.7,mode.duration-.22));
    const eased=progress*progress*(3-2*progress);
    const lambda=Math.exp(Math.log(8)*eased);
    const amplitude=Math.pow(lambda,alpha);
    if(sobolevPeakValue)sobolevPeakValue.textContent='×'+amplitude.toFixed(2);
    if(sobolevFocusLabel)sobolevFocusLabel.textContent='λ ×'+lambda.toFixed(1);

    const baseline=342,center=215;
    const peakHeight=18+196*Math.log1p(amplitude)/Math.log(9);
    const width=88/lambda;
    const tipY=baseline-peakHeight;
    let topPath='',fillPath='M72 342';
    for(let i=0;i<=120;i++){
      const x=72+i/120*296;
      const u=(x-center)/width;
      const y=baseline-peakHeight*Math.exp(-u*u);
      const vertex=(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2);
      topPath+=vertex;
      fillPath+='L'+x.toFixed(2)+' '+y.toFixed(2);
    }
    fillPath+='L368 342Z';
    if(sobolevPeak)sobolevPeak.setAttribute('d',topPath);
    if(sobolevPeakFill)sobolevPeakFill.setAttribute('d',fillPath);
    if(sobolevPeakNode){
      sobolevPeakNode.setAttribute('cx',String(center));
      sobolevPeakNode.setAttribute('cy',tipY.toFixed(2));
      sobolevPeakNode.setAttribute('r',(n>4?3+2.5*eased:3).toFixed(2));
    }

    // Crisp 1D, 2D and 3D subspaces, plus ghost projections of further
    // coordinates in n=4..6. These projected edges do not imply full 4D rendering.
    const rot=t*.11,co=Math.cos(rot),si=Math.sin(rot);
    const project=(x,y,z,extra=0)=>{
      const X=x*co+z*si,Z=z*co-x*si;
      return [216+48*X+23*Z+extra*11,276+14*X-43*y+22*Z-extra*9];
    };
    const edge=(a,b)=>'M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+
      'L'+b[0].toFixed(1)+' '+b[1].toFixed(1);
    const paths=[];
    if(n===1){
      paths.push('M118 301H314');
      for(let i=0;i<9;i++)paths.push('M'+(118+i*24)+' 297V305');
    }else if(n===2){
      for(let i=-3;i<=3;i++){
        const v=i/3;
        paths.push(edge([216-80-30*v,308+22*v-16],[216+80-30*v,308+22*v+16]));
      }
      for(let i=-3;i<=3;i++){
        const v=i/3;
        paths.push(edge([216+80*v+30,308-22+16*v],[216+80*v-30,308+22+16*v]));
      }
    }else{
      const vertices=[];
      for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])vertices.push({x,y,z});
      const count=1+Math.max(0,n-3);
      for(let e=0;e<count;e++){
        for(let i=0;i<vertices.length;i++)for(let j=i+1;j<vertices.length;j++){
          const a=vertices[i],b=vertices[j];
          if(Number(a.x!==b.x)+Number(a.y!==b.y)+Number(a.z!==b.z)===1)
            paths.push(edge(project(a.x,a.y,a.z,e),project(b.x,b.y,b.z,e)));
        }
        if(e>0){
          for(const v of vertices.slice(0,4))
            paths.push(edge(project(v.x,v.y,v.z,e-1),project(v.x,v.y,v.z,e)));
        }
      }
    }
    sobolevGridLines.forEach((el,i)=>{
      el.setAttribute('d',paths[i]||'');
      el.classList.toggle('supercritical',n>4&&i>=12);
      el.setAttribute('opacity',n>4&&i>=12?'.27':'.32');
    });

    sobolevContourLines.forEach((el,i)=>{
      const radius=(58+i*21)/Math.pow(lambda,.68);
      el.setAttribute('cx',String(center));
      el.setAttribute('cy',String(baseline-7));
      el.setAttribute('rx',radius.toFixed(2));
      el.setAttribute('ry',(n===1?2:radius*(n===2?.24:.34)).toFixed(2));
      el.style.opacity=n>4?String(.20+.18*eased):'.30';
    });
    sobolevParticles.forEach((el,i)=>{
      const theta=i*2.39996323+t*(.10+.016*(i%3));
      const radius=(16+(i%7)*11)/Math.pow(lambda,.73);
      const x=center+radius*Math.cos(theta);
      const y=baseline-5+(n===1?.06:n===2?.25:.4)*radius*Math.sin(theta)-
        Math.exp(-radius/29)*peakHeight*.19;
      el.setAttribute('cx',x.toFixed(2));
      el.setAttribute('cy',y.toFixed(2));
      el.setAttribute('opacity',n>4?(.16+.62*eased).toFixed(2):'.24');
    });
    sobolevRays.forEach((el,i)=>{
      const theta=i/12*Math.PI*2+t*.11;
      const length=(12+16*eased)*(n>4?1:.15);
      el.setAttribute('x1',(center+Math.cos(theta)*6).toFixed(1));
      el.setAttribute('y1',(tipY+Math.sin(theta)*6).toFixed(1));
      el.setAttribute('x2',(center+Math.cos(theta)*(6+length)).toFixed(1));
      el.setAttribute('y2',(tipY+Math.sin(theta)*(6+length)).toFixed(1));
      el.style.opacity=n>4?String(Math.max(0,(eased-.23)*.52)):'0';
    });

    if(sobolevMarker){
      sobolevMarker.setAttribute('cx',(416+104*eased).toFixed(2));
      sobolevMarker.setAttribute('cy',(292-55*alpha*eased).toFixed(2));
    }
  };

  sobolevControls.forEach(button=>{
    button.addEventListener('click',()=>{
      const dim=Number(button.dataset.sobolevDim);
      sobolevPinned=sobolevPinned===dim?null:dim;
      sobolevStart=performance.now()/1000;
      if(sobolevControlNote)sobolevControlNote.textContent=sobolevPinned===null?'AUTO':'HOLD';
      drawSobolev(performance.now()/1000);
    });
  });

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
    // One repeating passage from broadband disorder to a coherent folded mode.
    const phase=t*.34;
    const birth=.5-.5*Math.cos(phase); // 0: turbulent, 1: organized fold
    const smooth=birth*birth*(3-2*birth);
    const blend=(a,b)=>a*(1-smooth)+b*smooth;
    const foldCurve=(radius,offset)=>{
      let d='';
      for(let k=0;k<=148;k++){
        const theta=k/148*Math.PI*2;
        const r=radius+22*Math.sin(3*theta+offset+t*.13)*smooth;
        const x=280+r*Math.cos(theta);
        const y=320+.52*r*Math.sin(theta)-22*smooth*Math.cos(2*theta+offset);
        d+=(k?'L':'M')+x.toFixed(1)+' '+y.toFixed(1);
      }
      return d+'Z';
    };
    zwFold.setAttribute('d',foldCurve(98,.15));
    zwFoldInner.setAttribute('d',foldCurve(57,.9));
    zwFold.style.opacity=String(.08+.85*smooth);
    zwFoldInner.style.opacity=String(.05+.55*smooth);
    if(zwCore){
      zwCore.setAttribute('r',(2+5*smooth).toFixed(1));
      zwCore.style.opacity=String(.16+.84*smooth);
    }
    zwStrands.forEach((el,i)=>{
      const n=72,offset=i*.71;
      let d='';
      for(let k=0;k<=n;k++){
        const u=k/n,theta=u*Math.PI*2;
        const chaoticX=86+u*382+14*Math.sin(12*u+t*.76+offset);
        const chaoticY=304+91*Math.sin(u*11+i*.86+t*.58)+
          34*Math.cos(u*28-t*.45-i*1.21)+18*Math.sin(u*41+offset);
        const radius=90+(i%5)*8+16*Math.cos(3*theta+offset);
        const foldedX=280+radius*Math.cos(theta+offset*.22);
        const foldedY=320+.50*radius*Math.sin(theta+offset*.22)-
          16*Math.cos(2*theta+offset);
        const x=blend(chaoticX,foldedX),y=blend(chaoticY,foldedY);
        d+=(k?'L':'M')+x.toFixed(1)+' '+y.toFixed(1);
      }
      el.setAttribute('d',d);
      el.setAttribute('opacity',(.54-.25*smooth+.11*(i%3)).toFixed(2));
    });
    zwSpecks.forEach((el,i)=>{
      const a=i*2.3999632297+t*(.16+.035*(i%4));
      const r=blend(190+24*Math.sin(i*.7+t*.9),72+22*Math.sin(i*1.7+t*.35));
      const x=280+r*Math.cos(a),y=314+.52*r*Math.sin(a)+
        (1-smooth)*45*Math.cos(i*1.18+t*.65);
      el.setAttribute('cx',x.toFixed(1));
      el.setAttribute('cy',y.toFixed(1));
      el.setAttribute('opacity',(.22+.56*(1-smooth)).toFixed(2));
    });
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
    else if(activeStage===2)drawSobolev(t);
    else if(activeStage===3&&shellDots)shellDots.setAttribute('transform','rotate('+((t*4)%360).toFixed(2)+' 280 240)');
    else if(activeStage===4)drawPffTorus(t);
    else if(activeStage===5)drawEigenSinks(t);
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
    const previous=activeStage;
    activeStage=Math.max(0,Math.min(7,stage));
    if(previous!==activeStage && activeStage===2){
      sobolevStart=performance.now()/1000;
      sobolevPinned=null; // Re-entering the chapter restarts the comparison.
      if(sobolevControlNote)sobolevControlNote.textContent='AUTO';
    }
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
  drawPffTorus(.8);
  drawBasin(.8);
  drawSobolev(performance.now()/1000);
  drawEigenSinks(.8);
  drawResonance(.8);
  drawCurvature(.8);
  setStage(0);
  renderEquationProgress(innerWidth<=980||reduced.matches?1:0);
  updateScroll();
})();