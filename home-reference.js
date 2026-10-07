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
  const sobolevContoursGroup=document.querySelector('[data-sobolev-contours]');
  const sobolevParticlesGroup=document.querySelector('[data-sobolev-particles]');
  const sobolevRaysGroup=document.querySelector('[data-sobolev-rays]');
  const sobolevEdgesGroup=document.querySelector('[data-sobolev-topology-edges]');
  const sobolevVerticesGroup=document.querySelector('[data-sobolev-topology-vertices]');
  const sobolevTopologyCount=document.querySelector('[data-sobolev-topology-count]');
  const sobolevPeak=document.querySelector('[data-sobolev-peak]');
  const sobolevPeakFill=document.querySelector('[data-sobolev-peak-fill]');
  const sobolevPeakNode=document.querySelector('[data-sobolev-peak-node]');
  const sobolevGraph=document.querySelector('[data-sobolev-scaling-line]');
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
  const shellSpectrum=document.querySelector('[data-shell-spectrum]');
  const shellStatus=document.querySelector('[data-shell-status]');
  const resonanceForward=document.querySelector('[data-resonance-forward]');
  const resonanceBackward=document.querySelector('[data-resonance-backward]');
  const resonanceStanding=document.querySelector('[data-resonance-standing]');
  const resonanceEnvelopeUpper=document.querySelector('[data-resonance-envelope-upper]');
  const resonanceEnvelopeLower=document.querySelector('[data-resonance-envelope-lower]');
  const resonanceNodesGroup=document.querySelector('[data-resonance-nodes]');
  const resonanceAntinodesGroup=document.querySelector('[data-resonance-antinodes]');
  const resonanceReflection=document.querySelector('[data-resonance-reflection]');
  const phaseSegmentsGroup=document.querySelector('[data-curvature-phase-segments]');
  const phaseDotsGroup=document.querySelector('[data-curvature-phase-dots]');
  const phaseSeam=document.querySelector('[data-curvature-seam]');
  const phaseSeamError=document.querySelector('[data-curvature-seam-error]');
  const phaseErrorValue=document.querySelector('[data-curvature-error-value]');
  const phaseErrorFill=document.querySelector('[data-curvature-error-fill]');
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

  // Stage 04: deterministic broadband Fourier samples.
  // Quartic weighting is a spectral filter visualization, not a PDE solve.
  const spectralSamples=[];
  if(shellDots){
    for(let i=0;i<210;i++){
      const q=.13+(i+.5)/210*1.49;
      const phi=i*2.399963229728653;
      const x=280+119*q*Math.cos(phi),y=222+119*q*Math.sin(phi);
      const el=document.createElementNS('http://www.w3.org/2000/svg','circle');
      el.setAttribute('cx',x.toFixed(2));
      el.setAttribute('cy',y.toFixed(2));
      el.setAttribute('r',i%7===0?'2.65':'1.95');
      el.setAttribute('class','shell-spectral-mode');
      shellDots.appendChild(el);
      spectralSamples.push({el,q});
    }
  }
  let shellStart=performance.now()/1000;

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

  // Stage 03: exact mathematical H² scaling examples, not WCT dynamics.
  // n != 4: Gaussian g_lambda(x) = lambda^((n-4)/2) exp(-lambda² |x|²).
  //         ||Delta g_lambda||_2 is independent of lambda >= 1.
  // n == 4: F_M(x) = c_M sum_{j=0}^{M-1} exp(-4^j |x|²).
  //         Choose c_M to fix ||Delta F_M||_2 exactly for each M.
  //         Then ||F_M||_H² stays bounded but F_M(0) grows as sqrt(M).
  // The cubes below are accurate n-cube graph projections, NOT topology
  // of a curved WCT field or dynamical failure of confinement.

  const sobolevContours=[];
  const sobolevParticles=[];
  const sobolevRays=[];
  if(sobolevContoursGroup)for(let i=0;i<5;i++){
    sobolevContours.push(svgEl('ellipse',{
      class:i%2?'sobolev-contour violet':'sobolev-contour'
    },sobolevContoursGroup));
  }
  if(sobolevParticlesGroup)for(let i=0;i<28;i++){
    sobolevParticles.push(svgEl('circle',{
      class:['fill-accent','fill-accent2','fill-accent3'][i%3],
      r:i%5===0?2.3:1.7,opacity:'.36'
    },sobolevParticlesGroup));
  }
  if(sobolevRaysGroup)for(let i=0;i<12;i++){
    sobolevRays.push(svgEl('line',{class:'sobolev-supercritical-ray'},sobolevRaysGroup));
  }

  const topologyEdgesPath=sobolevEdgesGroup
    ?svgEl('path',{class:'sobolev-cube-edges'},sobolevEdgesGroup):null;
  const topologyVertices=[];
  if(sobolevVerticesGroup)for(let i=0;i<64;i++){
    topologyVertices.push(svgEl('circle',{
      class:'sobolev-cube-vertex',r:1.9,opacity:'0'
    },sobolevVerticesGroup));
  }

  // Exact Gaussian Laplacian inner product in R^4:
  // <Delta exp(-a r²), Delta exp(-b r²)> =
  //   96 (ab/(a+b))² (pi/(a+b))².
  const criticalLevels=18;
  const criticalA=Array.from({length:criticalLevels},(_,i)=>Math.pow(4,i));
  const criticalGram=criticalA.map(a=>criticalA.map(b=>
    96*Math.pow(a*b/(a+b),2)*Math.pow(Math.PI/(a+b),2)));
  const criticalReference=Math.sqrt(criticalGram[0][0]);
  const criticalWeights=new Float64Array(criticalLevels);
  const criticalState=levelCount=>{
    let sum=0,energy=0;
    for(let i=0;i<criticalLevels;i++){
      const weight=clamp(levelCount-i);
      criticalWeights[i]=weight;
      sum+=weight;
    }
    for(let i=0;i<criticalLevels;i++){
      const wi=criticalWeights[i];
      if(wi===0)continue;
      for(let k=0;k<criticalLevels;k++){
        const wk=criticalWeights[k];
        if(wk>0)energy+=wi*wk*criticalGram[i][k];
      }
    }
    const scale=energy>0?criticalReference/Math.sqrt(energy):1;
    return {peak:sum*scale,scale,weights:Float64Array.from(criticalWeights)};
  };

  const sobolevCycle=[[3,2.0],[4,4.5],[5,3.0],[6,3.5],[1,1.6],[2,1.6]];
  const sobolevDuration=sobolevCycle.reduce((total,item)=>total+item[1],0);
  let sobolevPinned=null,sobolevCurrent=0;
  let sobolevStart=performance.now()/1000;
  const sobolevAuto=t=>{
    let elapsed=((t-sobolevStart)%sobolevDuration+sobolevDuration)%sobolevDuration;
    for(const [n,duration] of sobolevCycle){
      if(elapsed<duration)return {n,elapsed,duration};
      elapsed-=duration;
    }
    return {n:3,elapsed:0,duration:2};
  };

  const cubeProjected=n=>{
    const N=1<<n;
    const basis=Array.from({length:n},(_,i)=>{
      const theta=.41+i*2.399963229728653;
      const r=1+.11*i;
      return [r*Math.cos(theta),r*Math.sin(theta)];
    });
    const raw=[];
    let maxX=.0001,maxY=.0001;
    for(let mask=0;mask<N;mask++){
      let x=0,y=0;
      for(let i=0;i<n;i++){
        const dir=(mask&(1<<i))?.5:-.5;
        x+=dir*basis[i][0];y+=dir*basis[i][1];
      }
      raw.push([x,y]);
      maxX=Math.max(maxX,Math.abs(x));maxY=Math.max(maxY,Math.abs(y));
    }
    const scale=Math.min(54/maxX,52/maxY);
    return raw.map(p=>[297+p[0]*scale,269+p[1]*scale]);
  };

  const setSobolevDimension=n=>{
    if(n===sobolevCurrent)return;
    sobolevCurrent=n;
    const critical=n===4,supercritical=n>4;
    if(sobolevDimensionLabel)sobolevDimensionLabel.textContent=n+'D';
    if(sobolevStatus){
      sobolevStatus.textContent=critical?'CRITICAL · UNBOUNDED':supercritical?'SUPERCRITICAL':'SUBCRITICAL';
      for(const cls of ['critical','supercritical','supported'])sobolevStatus.classList.remove(cls);
      sobolevStatus.classList.add(critical?'critical':supercritical?'supercritical':'supported');
    }
    if(sobolevSlope){
      const alpha=(n-4)/2;
      sobolevSlope.textContent=critical?'MULTISCALE':('α = '+(alpha>0?'+':'')+alpha.toFixed(1));
    }
    if(sobolevTopologyCount){
      sobolevTopologyCount.textContent=(1<<n)+' V · '+(n*(1<<(n-1)))+' E';
    }
    for(const el of [sobolevGraph,sobolevMarker,sobolevPeak,
      sobolevPeakFill,sobolevPeakNode,topologyEdgesPath]){
      if(!el)continue;
      el.classList.toggle('critical',critical);
      el.classList.toggle('supercritical',supercritical);
    }
    topologyVertices.forEach(el=>{
      el.classList.toggle('critical',critical);
      el.classList.toggle('supercritical',supercritical);
    });
    sobolevControls.forEach(btn=>{
      const selected=Number(btn.dataset.sobolevDim)===n;
      btn.setAttribute('aria-pressed',String(selected));
      btn.classList.toggle('critical',critical&&selected);
      btn.classList.toggle('supercritical',supercritical&&selected);
    });

    if(sobolevGraph){
      let path='';
      const alpha=(n-4)/2;
      for(let i=0;i<=70;i++){
        const u=i/70;
        const gain=critical
          ?criticalState(1+(criticalLevels-1)*u).peak
          :Math.pow(8,alpha*u);
        const px=416+104*u,py=292-17*Math.log2(gain);
        path+=(i?'L':'M')+px.toFixed(2)+' '+py.toFixed(2);
      }
      sobolevGraph.setAttribute('d',path);
    }
  };

  const drawSobolev=t=>{
    if(!sobolevPeak||!sobolevGraph)return;
    const mode=sobolevPinned===null?sobolevAuto(t):
      {n:sobolevPinned,elapsed:Math.max(0,t-sobolevStart),duration:5};
    const n=mode.n,alpha=(n-4)/2;
    setSobolevDimension(n);
    const progress=reduced.matches?1:clamp(mode.elapsed/Math.max(.7,mode.duration-.16));
    const eased=progress*progress*(3-2*progress);
    const lambda=Math.exp(Math.log(8)*eased);
    const critical=n===4;
    const levelCount=1+(criticalLevels-1)*eased;
    const criticalPacket=critical?criticalState(levelCount):null;
    const amp=critical?criticalPacket.peak:Math.pow(lambda,alpha);
    if(sobolevPeakValue)sobolevPeakValue.textContent='×'+amp.toFixed(2);
    if(sobolevFocusLabel)sobolevFocusLabel.textContent=critical?
      'scales '+levelCount.toFixed(1):'λ ×'+lambda.toFixed(1);

    const baseline=341,center=158;
    // SVG uses a *labeled logarithmic vertical mapping*. Physical profile
    // ordinates are computed from the exact Gaussian family above.
    const visualHeight=value=>192*Math.log1p(Math.max(0,value))/Math.log(9)+18;
    let curve='',fill='M67 341';
    const sampleCount=220;
    for(let i=0;i<=sampleCount;i++){
      const s=i/sampleCount*2-1;
      const physicalR=Math.sign(s)*Math.pow(Math.abs(s),2.35)*1.33;
      const x=center+physicalR*68;
      let v;
      if(critical){
        let sum=0;
        for(let j=0;j<criticalLevels;j++){
          const w=criticalPacket.weights[j];
          if(w>0)sum+=w*Math.exp(-criticalA[j]*physicalR*physicalR);
        }
        v=criticalPacket.scale*sum;
      }else{
        v=amp*Math.exp(-lambda*lambda*physicalR*physicalR);
      }
      const y=baseline-visualHeight(v);
      curve+=(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2);
      fill+='L'+x.toFixed(2)+' '+y.toFixed(2);
    }
    fill+='L249 341Z';
    sobolevPeak.setAttribute('d',curve);
    if(sobolevPeakFill)sobolevPeakFill.setAttribute('d',fill);
    const tipY=baseline-visualHeight(amp);
    if(sobolevPeakNode){
      sobolevPeakNode.setAttribute('cx',String(center));
      sobolevPeakNode.setAttribute('cy',tipY.toFixed(2));
      sobolevPeakNode.setAttribute('r',(n>=4?3.8+1.5*eased:3).toFixed(1));
    }

    sobolevContours.forEach((el,i)=>{
      const rad=critical?Math.max(3,(16+i*16)/Math.sqrt(levelCount))
        :(16+i*15)/Math.pow(lambda,.75);
      el.setAttribute('cx',String(center));
      el.setAttribute('cy',String(baseline-6));
      el.setAttribute('rx',rad.toFixed(2));
      el.setAttribute('ry',(n===1?2:rad*(n===2?.24:.36)).toFixed(2));
      el.style.opacity=critical?String(.15+.25*eased):'.26';
    });
    sobolevParticles.forEach((el,i)=>{
      const angle=i*2.39996323+t*(.13+.013*(i%4));
      const r=(13+(i%7)*10)/(critical?Math.pow(levelCount,.56):Math.pow(lambda,.72));
      const x=center+r*Math.cos(angle);
      const y=baseline-5+(n===1?.08:n===2?.25:.37)*r*Math.sin(angle)-tipY*.015;
      el.setAttribute('cx',x.toFixed(2));el.setAttribute('cy',y.toFixed(2));
      el.setAttribute('opacity',n>=4?(.22+.45*eased).toFixed(2):'.22');
    });
    sobolevRays.forEach((el,i)=>{
      const angle=i/12*Math.PI*2+t*.14;
      const length=(8+17*eased)*(n>=4?1:.16);
      el.setAttribute('x1',(center+6*Math.cos(angle)).toFixed(1));
      el.setAttribute('y1',(tipY+6*Math.sin(angle)).toFixed(1));
      el.setAttribute('x2',(center+(6+length)*Math.cos(angle)).toFixed(1));
      el.setAttribute('y2',(tipY+(6+length)*Math.sin(angle)).toFixed(1));
      el.style.opacity=n>=4?String(Math.max(0,(eased-.22)*.48)):'0';
    });

    // Actual n-cube: 2^n vertices and n*2^(n-1) adjacency edges.
    // This is a linear 2D projection with modest continuous rotation.
    if(topologyEdgesPath){
      const vertices=cubeProjected(n);
      const th=t*.08,co=Math.cos(th),si=Math.sin(th);
      const project=p=>{
        const x=p[0]-297,y=p[1]-269;
        return [297+x*co-y*si,269+x*si+y*co];
      };
      const projected=vertices.map(project);
      let edges='';
      for(let mask=0;mask<(1<<n);mask++)for(let axis=0;axis<n;axis++){
        if(mask&(1<<axis))continue;
        const a=projected[mask],b=projected[mask|(1<<axis)];
        edges+='M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+
          'L'+b[0].toFixed(1)+' '+b[1].toFixed(1);
      }
      topologyEdgesPath.setAttribute('d',edges);
      topologyVertices.forEach((el,i)=>{
        if(i>=projected.length){el.setAttribute('opacity','0');return;}
        const pt=projected[i];
        el.setAttribute('cx',pt[0].toFixed(1));
        el.setAttribute('cy',pt[1].toFixed(1));
        el.setAttribute('opacity',n>=5?'.68':'.82');
      });
    }

    if(sobolevMarker){
      const logGain=Math.log2(amp);
      sobolevMarker.setAttribute('cx',(416+104*eased).toFixed(2));
      sobolevMarker.setAttribute('cy',(292-17*logGain).toFixed(2));
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

  // Stage 07: ideal cavity boundary nodes and oscillating antinodes.
  const resonanceNodes=[];
  const resonanceAntinodes=[];
  const cavityStart=110,cavityEnd=450,cavityMode=3,cavityLength=cavityEnd-cavityStart;
  if(resonanceNodesGroup){
    for(let m=0;m<=cavityMode;m++){
      const x=cavityStart+m*cavityLength/cavityMode;
      resonanceNodes.push(svgEl('circle',{
        class:'resonance-node',cx:x.toFixed(2),cy:333,r:m===0||m===cavityMode?4.4:3.6
      },resonanceNodesGroup));
    }
  }
  if(resonanceAntinodesGroup){
    for(let m=0;m<cavityMode;m++){
      const x=cavityStart+(m+.5)*cavityLength/cavityMode;
      resonanceAntinodes.push(svgEl('circle',{
        class:'resonance-antinode',cx:x.toFixed(2),cy:333,r:4.1
      },resonanceAntinodesGroup));
    }
  }

  const drawShell=t=>{
    if(!shellDots||!shellSpectrum)return;
    const time=Math.max(0,t-shellStart);
    const cycle=time%9.3;
    const selection=reduced.matches?1:clamp((cycle-.7)/4.5);
    const normalized=selection*selection*(3-2*selection);
    // P(|k|,s)=P0 exp[-10s (|k|²-k*²)²] with |k*|=1.
    const response=q=>Math.exp(-10*normalized*Math.pow(q*q-1,2));
    spectralSamples.forEach(({el,q})=>{
      const power=response(q);
      el.setAttribute('opacity',(.025+.89*power).toFixed(3));
      el.setAttribute('r',(1.35+1.0*Math.sqrt(power)).toFixed(2));
    });
    let curve='';
    for(let i=0;i<=110;i++){
      const q=1.62*i/110;
      const x=108+347*i/110,y=432-43*response(q);
      curve+=(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2);
    }
    shellSpectrum.setAttribute('d',curve);
    if(shellStatus){
      shellStatus.textContent=normalized<.06?'BROADBAND':
        normalized>.94?'FINITE-k SELECTED':'QUARTIC FILTERING';
    }
  };

  // Stage 08: planar closed curve, exact local curvature and a prescribed
  // phase correction. Curvature weights shape the illustrative phase gradient;
  // the decay of the seam mismatch is NOT a solved WCT feedback law.
  const gammaGeometry=a=>{
    const ca=Math.cos(a),sa=Math.sin(a);
    const r=128+28*Math.cos(3*a);
    const dr=-84*Math.sin(3*a),ddr=-252*Math.cos(3*a);
    const x=280+r*ca,y=240+.82*r*sa;
    const dx=dr*ca-r*sa,dy=.82*(dr*sa+r*ca);
    const ddx=(ddr-r)*ca-2*dr*sa;
    const ddy=.82*((ddr-r)*sa+2*dr*ca);
    const speed=Math.hypot(dx,dy)||1;
    const kappa=(dx*ddy-dy*ddx)/Math.pow(speed,3);
    return {x,y,dx,dy,kappa,speed};
  };
  const gammaPt=a=>{
    const {x,y}=gammaGeometry(a);
    return [x,y];
  };
  const phaseN=144;
  const pathGeometry=Array.from({length:phaseN+1},(_,i)=>
    gammaGeometry(i/phaseN*Math.PI*2));
  const phaseFractions=[0];
  let totalPhaseWeight=0;
  for(let i=0;i<phaseN;i++){
    const a=pathGeometry[i],b=pathGeometry[i+1];
    const weight=.5*(Math.abs(a.kappa)*a.speed+
      Math.abs(b.kappa)*b.speed)*(Math.PI*2/phaseN);
    totalPhaseWeight+=weight;
    phaseFractions.push(totalPhaseWeight);
  }
  for(let i=0;i<=phaseN;i++)phaseFractions[i]/=totalPhaseWeight||1;
  if(gamma){
    const d=pathGeometry.map((p,i)=>
      (i?'L':'M')+p.x.toFixed(2)+' '+p.y.toFixed(2)).join('')+'Z';
    gamma.setAttribute('d',d);
  }
  const phaseSegments=[];
  if(phaseSegmentsGroup)for(let i=0;i<phaseN;i++){
    const a=pathGeometry[i],b=pathGeometry[i+1];
    phaseSegments.push(svgEl('path',{
      class:'curvature-phase-segment',
      d:'M'+a.x.toFixed(2)+' '+a.y.toFixed(2)+
        'L'+b.x.toFixed(2)+' '+b.y.toFixed(2)
    },phaseSegmentsGroup));
  }
  const phaseDots=[];
  if(phaseDotsGroup)for(let i=0;i<8;i++){
    phaseDots.push(svgEl('circle',{
      class:i%3===0?'curvature-phase-dot green':i%3===1?
        'curvature-phase-dot cyan':'curvature-phase-dot violet',
      r:i%4===0?4.2:2.9
    },phaseDotsGroup));
  }
  let lockStart=performance.now()/1000;
  const locatePhaseFraction=target=>{
    let low=0,high=phaseN;
    while(high-low>1){
      const mid=(low+high)>>1;
      if(phaseFractions[mid]<target)low=mid;else high=mid;
    }
    const a=phaseFractions[low],b=phaseFractions[high];
    return (low+(target-a)/Math.max(1e-12,b-a))/phaseN;
  };

  // Shared three-point circumcircle helper for the independent equation story.
  // Stage 08 uses exact analytical curvature instead.
  const circum=(a,b,c)=>{
    const d=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));
    if(Math.abs(d)<1e-6)return null;
    const aa=a[0]*a[0]+a[1]*a[1];
    const bb=b[0]*b[0]+b[1]*b[1];
    const cc=c[0]*c[0]+c[1]*c[1];
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

  const drawResonance=t=>{
    if(!resonanceStanding||!resonanceForward||!resonanceBackward)return;
    const wavePhase=t*1.65,k=Math.PI*cavityMode,componentAmplitude=19.5;
    const plot=(y,fn)=>{
      let d='';
      for(let i=0;i<=168;i++){
        const x=cavityStart+cavityLength*i/168,u=i/168;
        d+=(i?'L':'M')+x.toFixed(2)+' '+(y+fn(u)).toFixed(2);
      }
      return d;
    };
    resonanceForward.setAttribute('d',plot(165,u=>
      -componentAmplitude*Math.sin(k*u-wavePhase)));
    resonanceBackward.setAttribute('d',plot(237,u=>
      -componentAmplitude*Math.sin(k*u+wavePhase)));
    // sin(ku-wt)+sin(ku+wt)=2 sin(ku) cos(wt); fixed nodes for kL=3π.
    const envelope=2*componentAmplitude;
    const stand=u=>-envelope*Math.sin(k*u)*Math.cos(wavePhase);
    resonanceStanding.setAttribute('d',plot(333,stand));
    if(resonanceEnvelopeUpper)resonanceEnvelopeUpper.setAttribute('d',plot(333,u=>
      -envelope*Math.abs(Math.sin(k*u))));
    if(resonanceEnvelopeLower)resonanceEnvelopeLower.setAttribute('d',plot(333,u=>
      envelope*Math.abs(Math.sin(k*u))));
    resonanceAntinodes.forEach((el,m)=>{
      const u=(m+.5)/cavityMode;
      el.setAttribute('cy',(333+stand(u)).toFixed(2));
      el.setAttribute('opacity',(.58+.35*Math.abs(Math.cos(wavePhase))).toFixed(2));
    });
    if(resonanceReflection){
      // One reflected tracer, purely illustrative; the waveforms above
      // are the exact analytic equal-amplitude counterpropagating pair.
      const f=((t*.13)%2+2)%2,u=f<=1?f:2-f;
      resonanceReflection.setAttribute('cx',(cavityStart+cavityLength*u).toFixed(2));
      resonanceReflection.setAttribute('opacity','0.84');
    }
  };

  const drawCurvature=t=>{
    if(!marker||!tangent||!osc)return;
    const cycle=Math.max(0,t-lockStart)%11;
    const mismatch=reduced.matches?0:2.4*Math.exp(-.74*cycle);
    const phaseRotation=t*.50;
    const winding=3;
    const twopi=Math.PI*2;

    phaseSegments.forEach((el,i)=>{
      // The closed-loop phase advance is 2πm+Δφ.
      // Spatial phase density is curvature-magnitude weighted.
      const u=(i+.5)/phaseN;
      const phase=twopi*winding*(phaseFractions[i]+phaseFractions[i+1])*.5+
        mismatch*u-phaseRotation;
      const mod=((phase%twopi)+twopi)%twopi;
      const color=['cyan','green','violet'][Math.floor(mod/(twopi/3))%3];
      el.setAttribute('class','curvature-phase-segment '+color);
      el.setAttribute('opacity',(.35+.6*(.5+.5*Math.cos(phase))).toFixed(2));
    });

    phaseDots.forEach((el,i)=>{
      const target=((i/8+t*.041)%1+1)%1;
      const u=locatePhaseFraction(target);
      const p=gammaGeometry(twopi*u);
      el.setAttribute('cx',p.x.toFixed(2));
      el.setAttribute('cy',p.y.toFixed(2));
      el.setAttribute('opacity',(.56+.35*Math.sin(Math.PI*target)).toFixed(2));
    });

    const a=t*.40,g=gammaGeometry(a);
    marker.setAttribute('cx',g.x.toFixed(2));
    marker.setAttribute('cy',g.y.toFixed(2));
    const tx=g.dx/g.speed,ty=g.dy/g.speed;
    tangent.setAttribute('x1',(g.x-39*tx).toFixed(2));
    tangent.setAttribute('y1',(g.y-39*ty).toFixed(2));
    tangent.setAttribute('x2',(g.x+39*tx).toFixed(2));
    tangent.setAttribute('y2',(g.y+39*ty).toFixed(2));
    // Signed normal produces the osculating-circle center for a planar path.
    const radius=Math.abs(1/g.kappa);
    if(Number.isFinite(radius)&&radius<190){
      const signedRadius=1/g.kappa;
      const cx=g.x-g.dy/g.speed*signedRadius;
      const cy=g.y+g.dx/g.speed*signedRadius;
      osc.setAttribute('cx',cx.toFixed(2));
      osc.setAttribute('cy',cy.toFixed(2));
      osc.setAttribute('r',radius.toFixed(2));
      osc.setAttribute('opacity','.48');
    }else osc.setAttribute('opacity','0');

    const seam=pathGeometry[0];
    if(phaseSeam){
      phaseSeam.setAttribute('cx',seam.x.toFixed(2));
      phaseSeam.setAttribute('cy',seam.y.toFixed(2));
    }
    if(phaseSeamError){
      const ex=seam.x-26*Math.sin(mismatch);
      const ey=seam.y-22*(1-Math.cos(mismatch));
      phaseSeamError.setAttribute('d',
        'M'+seam.x.toFixed(2)+' '+seam.y.toFixed(2)+
        'L'+ex.toFixed(2)+' '+ey.toFixed(2));
      phaseSeamError.setAttribute('opacity',Math.min(1,mismatch*1.2).toFixed(2));
    }
    if(phaseErrorValue)phaseErrorValue.textContent=mismatch.toFixed(2)+' rad';
    if(phaseErrorFill){
      phaseErrorFill.setAttribute('width',(375*(1-mismatch/2.4)).toFixed(2));
    }
  };

  const drawTheoryFrame=(t)=>{
    if(activeStage===0)drawFold(t);
    else if(activeStage===1)drawBasin(t);
    else if(activeStage===2)drawSobolev(t);
    else if(activeStage===3)drawShell(t);
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
    if(previous!==activeStage && activeStage===3){
      shellStart=performance.now()/1000;
    }
    if(previous!==activeStage && activeStage===7){
      lockStart=performance.now()/1000;
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
  drawShell(performance.now()/1000);
  drawResonance(.8);
  drawCurvature(.8);
  setStage(0);
  renderEquationProgress(innerWidth<=980||reduced.matches?1:0);
  updateScroll();
})();