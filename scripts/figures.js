/* Native vector illustrations. Teaching examples use the supplied slide values. */
(() => {
  const C = { ink:'#51465e', muted:'#a395b0', line:'#e3daee', purple:'#8b6db4', purpleDark:'#725298', pale:'#f3eef9', blue:'#86a6cb', bluePale:'#edf3fa', green:'#91a884', greenPale:'#edf3e8', amber:'#c6a46b', amberPale:'#faf3e6', white:'#fff' };
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const clamp = n => Math.max(0, Math.min(1, n));
  const ease = n => { const p = clamp(n); return p * p * (3 - 2 * p); };
  const phase = (t, at, length = .6) => ease((t - at) / length);
  const fmt = n => Number(n.toFixed(2));
  const rect = (x,y,w,h,fill=C.white,stroke=C.line,r=10,attrs='') => `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="${r}" fill="${fill}" stroke="${stroke}" ${attrs}/>`;
  const text = (x,y,value,size=13,color=C.ink,attrs='') => `<text x="${fmt(x)}" y="${fmt(y)}" font-size="${size}" fill="${color}" ${attrs}>${esc(value)}</text>`;
  const centered = 'text-anchor="middle"';
  const line = (x1,y1,x2,y2,color=C.line,attrs='') => `<path d="M${fmt(x1)} ${fmt(y1)}L${fmt(x2)} ${fmt(y2)}" fill="none" stroke="${color}" ${attrs}/>`;
  const path = (d,color=C.line,attrs='') => `<path d="${d}" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" ${attrs}/>`;
  const circle = (x,y,r,fill,attrs='') => `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${r}" fill="${fill}" ${attrs}/>`;
  const title = value => `<title>${esc(value)}</title>`;
  const mount = (el, html) => { if (el && el.__markup !== html) { el.innerHTML = html; el.__markup = html; } };
  const pill = (x,y,w,value,fill=C.pale,color=C.purpleDark) => rect(x,y,w,25,fill,'none',12.5)+text(x+w/2,y+17,value,10,color,centered);
  function chip(x,y,size=44,active=false,label='') {
    let s=rect(x,y,size,size,active?C.pale:'#fff',active?'#ad96cc':C.line,8);
    s+=rect(x+size*.25,y+size*.25,size*.5,size*.5,active?'#d9cceb':'#f6f3f9','none',4);
    for(let i=1;i<=3;i++) {const d=size*i/4;s+=line(x+d,y-4,x+d,y,C.line)+line(x+d,y+size,x+d,y+size+4,C.line)+line(x-4,y+d,x,y+d,C.line)+line(x+size,y+d,x+size+4,y+d,C.line);}
    if(label)s+=text(x+size/2,y+size/2+3,label,Math.max(8,size*.19),C.purpleDark,centered);
    return s;
  }
  function heroArchitecture() {
    const el=document.getElementById('hero-architecture');
    if(matchMedia('(max-width: 600px)').matches){
      el.setAttribute('viewBox','0 0 380 200');
      let mobile=title('计算、互连、存储连接到系统评估');
      const parts=[{x:7,label:'计算',kind:'compute'},{x:137,label:'互连',kind:'network'},{x:267,label:'存储',kind:'memory'}];
      parts.forEach(item=>{
        mobile+=rect(item.x,12,106,98,'#ffffffec','#e3d9ed',14);
        if(item.kind==='compute')mobile+=chip(item.x+36,30,34,true);
        if(item.kind==='network'){
          for(let row=0;row<2;row++)for(let col=0;col<2;col++){const x=item.x+36+col*35,y=37+row*23;if(row===0)mobile+=line(x,y,x,y+23,'#bba6d0');if(col===0)mobile+=line(x,y,x+35,y,'#bba6d0');mobile+=circle(x,y,3.5,'#b69acb');}
        }
        if(item.kind==='memory')for(let i=2;i>=0;i--)mobile+=path(`M${item.x+25} ${35+i*10}l28-9 28 9-28 9Z`,'#b69acb');
        mobile+=text(item.x+53,91,item.label,13,'#806791',`${centered} font-weight="550"`);
      });
      mobile+=path('M60 110V130H320V110M190 110V146','#d3c3e2','stroke-width="1"');
      mobile+=rect(123,146,134,36,'#f3eef9','#ddcfea',12)+text(190,169,'系统评估',12,'#9173aa',centered);
      mount(el,mobile);return;
    }
    el.setAttribute('viewBox','0 0 1100 280');
    let s=title('计算、互连、存储协同建模，连接到系统指标');
    const blocks=[{x:60,label:'计算',sub:'Kernel 与资源能力',kind:'compute'},{x:332,label:'互连',sub:'协议、拓扑与执行依赖',kind:'network'},{x:604,label:'存储',sub:'容量、流量与数据调度',kind:'memory'}];
    for(const b of blocks){
      s+=rect(b.x,49,232,144,'#ffffffea','#e7e0ef',19);
      s+=text(b.x+21,77,b.kind.toUpperCase(),8,'#aaa0b7','letter-spacing="1.4"');
      if(b.kind==='compute') {for(let i=0;i<3;i++)s+=chip(b.x+26+i*60,92,33,i===1);}
      if(b.kind==='network'){for(let i=0;i<3;i++)for(let j=0;j<2;j++){const x=b.x+51+i*65,y=101+j*34;if(i<2)s+=line(x,y,x+65,y,'#cfc0e2');if(j===0)s+=line(x,y,x,y+34,'#cfc0e2');s+=circle(x,y,5,'#d7c8e8')+circle(x,y,2.5,'#a288bb');}}
      if(b.kind==='memory'){for(let i=2;i>=0;i--){const y=94+i*12;s+=path(`M${b.x+55} ${y}l60 -16 60 16 -60 16Z`,'#b7a2d0','stroke-width="1.2"')+path(`M${b.x+55} ${y}v9l60 16 60-16v-9`,'#c5b5d8');}}
      s+=text(b.x+116,165,b.label,16,'#746281',`${centered} font-weight="550"`);
      s+=text(b.x+116,217,b.sub,10,'#a494b0',centered);
    }
    s+=path('M292 121H332M564 121H604','#cdbde0','stroke-width="1.4"');
    s+=circle(312,121,3,'#b29ac9')+circle(584,121,3,'#b29ac9');
    s+=path('M836 121H877Q894 121 894 137V153H928','#cdbde0','stroke-width="1.4"');
    s+=rect(925,106,133,94,'#f4f0fa','#d8cae8',17)+text(991.5,143,'系统评估',17,'#806398',`${centered} font-weight="550"`)+text(991.5,166,'指标 · 时间线 · 瓶颈',9,'#a08cac',centered);
    s+=path('M176 237H719','#e7deef','stroke-width="1"')+text(447,262,'在同一系统中，理解跨层设计的影响',10,'#ad9dbb',centered);
    mount(el,s);
  }
  const scaleSteps=[
    {at:0,still:3.2,title:'从一颗芯片的效率开始。',body:'关注算子执行和数据访问，让计算单元与存储层次更好地配合。',focus:['算子级性能','计算图与访存优化']},
    {at:5,still:8.2,title:'通信进入关键路径。',body:'一个模型实例跨越多张卡，计算、通信与并行策略需要共同考虑。',focus:['计算通信流水','多维并行策略']},
    {at:10,still:13.2,title:'资源协同成为系统问题。',body:'规模进一步扩大后，调度、互连、存储与可靠性都进入设计空间。',focus:['集群协同与调度','存储、互连与稳定性']}
  ];
  function scale(root) {
    const svg=root.querySelector('svg');let last=-1;
    return new SimTimeline({root,duration:15,steps:scaleSteps,draw(t,index){
      if(index!==last){const list=root.querySelector('[data-focus-list]');list.innerHTML=scaleSteps[index].focus.map(v=>`<li>${esc(v)}</li>`).join('');last=index;}
      let s=title('计算系统规模演进示意');
      s+=path('M37 290H626','#f0ebf5');
      if(index===0){s+=rect(202,40,246,230,'#faf8fd','#e8dff1',24)+text(325,69,'一个计算实例',11,C.muted,centered);s+=chip(281,105,88,true,'xPU');s+=pill(257,219,137,'算子 · 访存 · 计算图');s+=path('M243 99V203M406 99V203','#e4d8ee','stroke-dasharray="3 6"');}
      else if(index===1){s+=rect(83,40,490,230,'#fbfafd','#e8dff1',24)+text(328,69,'一个模型实例，跨多卡执行',11,C.muted,centered);for(let row=0;row<2;row++)for(let col=0;col<4;col++){const x=130+col*118,y=94+row*83;if(col<3)s+=line(x+44,y+22,x+118,y+22,'#d1c1e2');if(row===0)s+=line(x+22,y+44,x+22,y+83,'#d1c1e2');s+=chip(x,y,44,true);if(col<3){const p=(t*.32+row*.2+col*.2)%1;s+=circle(x+44+74*p,y+22,2.7,'#a287bf');}}s+=pill(242,231,173,'计算 ↔ 通信 ↔ 并行');}
      else {const centers=[{x:35,y:42},{x:265,y:42},{x:495,y:42}];for(let i=0;i<2;i++)s+=line(centers[i].x+140,150,centers[i+1].x,150,'#ccb9de','stroke-width="2"');centers.forEach((b,j)=>{s+=rect(b.x,b.y,140,221,'#fcfbfe','#e1d6eb',16)+text(b.x+70,66,`资源组 ${String.fromCharCode(65+j)}`,10,C.muted,centered);for(let row=0;row<4;row++)for(let col=0;col<2;col++)s+=chip(b.x+25+col*54,b.y+45+row*36,27,(row+j)%2===0);s+=pill(b.x+24,236,92,'系统资源池','#f1edf8','#9c86b2');});s+=pill(245,293,180,'调度 · 互连 · 存储','#f6f3fa');}
      mount(svg,s);
    }});
  }
  function constraint(kind='memory') {
    const svg=document.getElementById('constraint-diagram');
    const locations={memory:{x:235,y:67,label:'存储层次',sub:'容量 · 带宽'},network:{x:370,y:294,label:'互连系统',sub:'协议 · 拓扑'},software:{x:100,y:294,label:'软件栈',sub:'编译 · 调度'}};
    let s=title('计算系统中的存储、互连和软件约束');
    s+=`<defs><radialGradient id="dark-glow"><stop stop-color="#9f7ad2" stop-opacity=".12"/><stop offset="1" stop-color="#9f7ad2" stop-opacity="0"/></radialGradient></defs><circle cx="235" cy="215" r="180" fill="url(#dark-glow)"/>`;
    for(const [key,p] of Object.entries(locations)){const active=kind===key;s+=path(`M235 211Q${p.x} 211 ${p.x} ${p.y}`,active?'#b093d6':'#4b4256',`stroke-width="${active?2:1}" stroke-dasharray="${active?'4 6':'3 8'}"`);s+=circle(p.x,p.y,44,active?'#342c42':'#26232b',`stroke="${active?'#9476b6':'#514358'}"`)+text(p.x,p.y+1,p.label,13,active?'#d5c0ef':'#aaa0b7',`${centered} font-weight="550"`)+text(p.x,p.y+19,p.sub,9,active?'#ad95c6':'#73697e',centered);}
    s+=rect(179,155,112,112,'#30283b','#8c72ab',25)+rect(203,179,64,64,'#3d304c','#9e80bd',14)+text(235,216,'计算',23,'#d5c4eb',`${centered} font-weight="550"`);
    for(let i=0;i<4;i++){s+=line(170,174+i*25,179,174+i*25,'#806894')+line(291,174+i*25,300,174+i*25,'#806894');}
    s+=text(235,389,'有效性能来自整个系统的协同',11,'#7f6d90',centered);
    mount(svg,s);
  }
  const frameworkSteps=[
    {at:0,still:2.8,title:'描述硬件、工作负载和部署。',body:'同一组输入约定，连接硬件规格、Kernel 实现和服务请求。'},
    {at:4,still:7.5,title:'用物理中间量求解算子时间。',body:'工作量、分层流量与并发，结合资源能力和依赖，决定一次 Kernel 调用的时间。'},
    {at:9,still:12.6,title:'让系统随完成事件推进。',body:'调度、主机准备、设备执行与传输相互作用；完成事件会影响后续组批。'},
    {at:14,still:18,title:'观测服务指标，并解释它们。',body:'在声明的测量边界与观测窗口内，得到 TTFT、TPOT 和输出吞吐等指标。'}
  ];
  function framework(root) {
    const svg=root.querySelector('svg');
    return new SimTimeline({root,duration:20,steps:frameworkSteps,draw(t,index){
      let s=title('计算模型与系统执行反馈框架');const xs=[22,268,514,760],w=218;
      const items=[{name:'输入描述',en:'INPUT',lines:['硬件规格与微基准','算子 / Kernel 执行方式','工作负载与部署配置']},{name:'算子性能模型',en:'KERNEL MODEL',lines:['计算工作量 F','各层流量 D 与并发 Q','资源能力与阶段依赖']},{name:'推理服务系统',en:'SERVING',lines:['原生调度与组批','CPU / Device 时间线','资源竞争与完成事件']},{name:'系统观测',en:'OBSERVATION',lines:['TTFT / TPOT','输出吞吐 / SLO goodput','利用率与瓶颈解释']}];
      items.forEach((b,i)=>{const active=i===index;s+=rect(xs[i],65,w,202,active?'#fbf8ff':'#fff',active?'#b09acb':'#e7e0ef',15)+text(xs[i]+20,94,b.en,9,active?C.purple:'#b0a5ba','letter-spacing="1"')+text(xs[i]+20,124,b.name,20,active?C.purpleDark:C.ink,'font-weight="550"');b.lines.forEach((v,j)=>{s+=circle(xs[i]+22,160+j*31,2,active?'#b49acb':'#cfc4db')+text(xs[i]+34,164+j*31,v,12,'#93819f');});if(i<3){s+=line(xs[i]+w,166,xs[i+1],166,'#cfbfdf','stroke-width="1.4"')+path(`M${xs[i+1]-6} 162l6 4-6 4`,'#b9a1cd');if(index>i){const p=(t*.5)%1;s+=circle(xs[i]+w+28*p,166,3.4,'#a38abe');}}});
      s+=path('M692 267V304Q692 318 678 318H552Q538 318 538 304V267','#b8a0d0','stroke-width="1.5" stroke-dasharray="4 5"');
      s+=path('M534 273l4-6 4 6','#ac91c8','stroke-width="1.4"');
      s+=text(615,344,'完成 / token / KV / 队列状态',10,'#a18bb1',centered);
      s+=text(615,364,'反馈到调度器',10,'#9374ac',centered);
      s+=text(132,36,'描述设计',10,C.muted,centered)+text(377,36,'硬件 → Kernel',10,C.muted,centered)+text(623,36,'Kernel → Serving',10,C.muted,centered)+text(869,36,'回答系统问题',10,C.muted,centered);
      mount(svg,s);
    }});
  }
  const computeSteps=[
    {at:0,still:2.5,title:'第一波：4 个 SM 同时处理 4 个任务。',body:'任务按可用计算单元分配；矩阵形状与切块决定任务总数。'},
    {at:4,still:6.5,title:'第二波：继续分配接下来的 4 个任务。',body:'前两波都能占满 4 个 SM，但任务总数不一定是单元数的整数倍。'},
    {at:8,still:10.6,title:'第三波：只剩 2 个任务，形成尾波。',body:'最后一波仅 2 个 SM 参与；有效计算能力不能直接等同于标称峰值。'}
  ];
  const sequence=['A0','B0','A0','B1','A1','B0','A1','B1'];
  const tilePalette={A0:['#fff2de','#d3ae72'],B0:['#e8efdf','#9fb580'],A1:['#e9f0fa','#91add1'],B1:['#eee5f6','#b39aca']};
  const cacheStates=[];let slots=[],hitCount=0;
  sequence.forEach((request,index)=>{const before=[...slots],hit=slots.includes(request),evicted=!hit&&slots.length===2?slots.at(-1):null;if(hit)hitCount++;slots=[request,...slots.filter(v=>v!==request)].slice(0,2);cacheStates.push({request,before,after:[...slots],hit,evicted,hits:hitCount,misses:index+1-hitCount});});
  const cacheSteps=cacheStates.map((state,index)=>({at:index*2.2,still:index*2.2+1.55,title:`读取 ${state.request}：${state.hit?'命中，移到最近使用端。':state.evicted?`未命中，淘汰 ${state.evicted}。`:'未命中，装入缓存。'}`,body:state.hit?'直接复用缓存中的 tile，不需要再次从 HBM 读入。':state.evicted?'缓存容量为 2 个等大小 tile；先淘汰最久未使用的 tile，再装入新数据。':'从冷缓存开始；未命中的输入 tile 需要从 HBM 读入。'}));
  const pipelineSteps=[
    {at:0,still:2.7,title:'同一 tile 的计算有先后依赖。',body:'QK 完成后，才能进行 softmax，随后才能计算 PV。'},
    {at:3,still:5.3,title:'不同资源可以重叠，共享资源需要仲裁。',body:'另一 tile 的 QK 可以与 Vector softmax 重叠；图中的 Tensor 操作始终不互相重叠。'},
    {at:7,still:8.7,title:'总时间由资源和依赖共同决定。',body:'执行时间是满足约束的 makespan，不能把所有阶段简单相加，也不能全局取最大值。'}
  ];
  const kernelModes={
    compute:{duration:12,steps:computeSteps,eyebrow:'计算工作量 / COMPUTE',title:'10 个任务，怎样分给 4 个 SM？',label:'计算任务分波次执行示意'},
    cache:{duration:19.6,steps:cacheSteps,eyebrow:'缓存与物理流量 / MEMORY',title:'同一组读取，哪些数据可以复用？',label:'冷缓存和两个等大小 tile 容量下的 LRU 命中过程'},
    pipeline:{duration:10,steps:pipelineSteps,eyebrow:'资源与依赖 / PIPELINE',title:'依赖决定串行，独立资源才可能重叠。',label:'两个 tile 的 QK、softmax、PV 依赖与资源重叠示意'}
  };
  function readouts(el,values) {const key=JSON.stringify(values);if(el.__values===key)return;el.__values=key;el.innerHTML=values.map(v=>`<div><small>${esc(v[0])}</small><strong>${esc(v[1])}${v[2]?`<em>${esc(v[2])}</em>`:''}</strong><span>${esc(v[3]||'')}</span></div>`).join('');}
  function computeDrawing(t,index) {
    const p=phase(t,computeSteps[index].at+.6,1.7),first=index*4,count=index===2?2:4;
    let s=title('10 个任务分配给 4 个 SM，需要 3 个波次');
    s+=text(47,29,'待执行的 10 个任务',12,C.muted)+text(47,191,'4 个计算单元',12,C.muted);
    for(let i=0;i<10;i++){const x=49+(i%5)*102,y=49+Math.floor(i/5)*57;const active=i>=first&&i<first+count,done=i<first||(active&&p>.88);s+=rect(x,y,82,41,done?'#f2eef8':active?'#ece3f6':'#fff',active?'#ac8dc7':'#e6deee',8)+text(x+41,y+25,`Task ${i+1}`,11,active?C.purpleDark:'#b5a7bf',centered);}
    for(let i=0;i<4;i++){const x=55+i*124,active=i<count;s+=chip(x,211,68,active,`SM ${i+1}`);s+=text(x+34,301,active?`Task ${first+i+1}`:'空闲',11,active?C.purpleDark:'#bcaec6',centered);if(active){s+=line(x+34,174,x+34,205,'#d0bcdf','stroke-dasharray="3 4"')+circle(x+34,174+31*p,3,'#a082be');}}
    s+=rect(651,51,298,246,'#faf8fd','#eee7f4',17)+text(677,85,'从工作量到计算时间',15,C.purpleDark,'font-weight="550"')+text(677,126,'F = 2MNK',26,'#9780b1')+text(677,153,'GEMM 的浮点运算量',11,C.muted)+line(677,175,920,175,'#e8dfef')+text(677,204,'Tcompute = F / Peff',20,C.purpleDark)+text(677,231,'Peff 与实际活跃的计算单元有关',11,C.muted)+pill(677,250,153,`当前第 ${index+1} 波 / 共 3 波`);
    return s;
  }
  function cacheDrawing(t,index) {
    const state=cacheStates[index],p=phase(t,cacheSteps[index].at+.15,.8);
    let s=title('A0 B0 A0 B1 A1 B0 A1 B1 的 LRU 缓存读取过程');
    s+=text(35,29,'固定的 tile 读取序列',12,C.muted);
    sequence.forEach((item,i)=>{const x=35+i*119,active=i===index,[fill,edge]=tilePalette[item];s+=rect(x,48,96,42,i<=index?fill:'#fff',active?C.purple: i<=index?edge:'#eee8f3',8,active?'stroke-width="2"':'');s+=text(x+48,74,item,14,i<=index?'#7a658c':'#c3b7cd',`${centered} font-weight="550"`);if(i<index)s+=text(x+48,109,cacheStates[i].hit?'Hit':'Miss',9,cacheStates[i].hit?'#91a777':'#baa88a',centered);if(active)s+=pill(x+15,98,66,state.hit?'HIT':'MISS',state.hit?'#edf3e7':'#faf2e3',state.hit?'#889f70':'#bd9d67');});
    s+=rect(300,161,415,148,'#faf8fd','#e9e0f2',17)+text(328,189,'L2 CACHE',9,C.muted,'letter-spacing="1.3"')+text(686,189,'容量：2 个 tile',10,C.muted,'text-anchor="end"');
    state.after.forEach((item,i)=>{const x=330+i*186,[fill,edge]=tilePalette[item];s+=`<g opacity="${i===0?.4+.6*p:1}">`+rect(x,207,160,57,fill,edge,10)+text(x+80,242,item,20,'#79628b',`${centered} font-weight="550"`)+'</g>'+text(x+80,288,i===0?'MRU · 最近使用':'LRU · 最久未使用',10,C.muted,centered);});
    if(state.after.length<2)s+=rect(516,207,160,57,'#fff','#ded4e9',10,'stroke-dasharray="4 5"')+text(596,242,'空',13,'#bdafc8',centered);
    s+=rect(35,178,176,106,'#f8f5ec','#e9dfcb',13)+text(123,215,'HBM',19,'#b49c75',`${centered} font-weight="550"`)+text(123,240,state.hit?'本次无需读取':'本次读入 1 个 tile',10,'#baa987',centered);
    s+=line(211,231,300,231,state.hit?'#eee9e0':'#c5b28d','stroke-width="1.3" stroke-dasharray="4 5"');
    if(!state.hit)s+=circle(211+89*p,231,4,'#c2a775');
    if(state.evicted)s+=text(776,220,'本次淘汰',11,C.muted)+rect(776,235,154,46,'#fff','#e9e2f0',9,'stroke-dasharray="4 5"')+text(853,264,state.evicted,16,'#bfafcc',centered);
    else s+=text(791,242,state.hit?'复用已有数据':'缓存仍有空位',12,'#b4a4c0');
    return s;
  }
  function pipelineDrawing(t) {
    let s=title('FlashAttention 中 QK、softmax、PV 的依赖与跨 tile 资源重叠');
    const x=v=>155+v*91;
    s+=text(35,30,'同一 tile：QK → softmax → PV',12,C.muted)+pill(678,13,121,'Tensor / 矩阵计算',C.pale,C.purpleDark)+pill(811,13,147,'Vector / 向量处理',C.bluePale,'#7895b9');
    for(let v=0;v<=8;v++)s+=line(x(v),58,x(v),291,'#f0eaf5')+text(x(v),319,String(v),10,C.muted,centered);
    s+=text(55,126,'Tile 0',14,C.ink)+text(55,243,'Tile 1',14,C.ink);
    const jobs=[{row:0,start:0,end:2,name:'QK',kind:'tensor'},{row:0,start:2,end:3,name:'softmax',kind:'vector'},{row:0,start:4,end:6,name:'PV',kind:'tensor'},{row:1,start:2,end:4,name:'QK',kind:'tensor'},{row:1,start:4,end:5,name:'softmax',kind:'vector'},{row:1,start:6,end:8,name:'PV',kind:'tensor'}];
    jobs.forEach(j=>{const y=94+j.row*117,fill=j.kind==='tensor'?'#e9dff4':'#e5eef9',stroke=j.kind==='tensor'?'#baa1d1':'#9eb6d6',w=x(j.end)-x(j.start)-6,p=clamp((t-j.start)/(j.end-j.start));s+=rect(x(j.start),y,w,52,'#fcfaff','#e9e3f0',9);if(p>0)s+=rect(x(j.start),y,w*p,52,fill,stroke,9);s+=text(x(j.start)+w/2,y+31,j.name,j.name==='softmax'?11:15,j.kind==='tensor'?C.purpleDark:'#7792b4',centered);});
    s+=path(`M${x(3)-3} 120H${x(4)-7}`,'#c6b5d7','stroke-dasharray="3 4"')+path(`M${x(5)-3} 237H${x(6)-7}`,'#c6b5d7','stroke-dasharray="3 4"');
    const cursor=x(Math.min(t,8));s+=line(cursor,62,cursor,284,'#c7b8d6','stroke-dasharray="3 5"');
    s+=text(970,341,'相对时间 →',10,C.muted,'text-anchor="end"');
    return s;
  }
  function kernel(root) {
    let mode='compute';const svg=root.querySelector('svg'),readout=root.querySelector('#kernel-readouts'),stepsBar=root.querySelector('.mini-steps');
    function buildSteps(){stepsBar.innerHTML=kernelModes[mode].steps.map((s,i)=>`<button type="button" data-step="${i}" aria-label="${esc(s.title)}">${i+1}</button>`).join('');}
    buildSteps();
    const clock=new SimTimeline({root,...kernelModes[mode],draw(t,index){
      if(mode==='compute'){mount(svg,computeDrawing(t,index));readouts(readout,[['当前波次',String(index+1),' / 3','10 个任务共分 3 波'],['当前活跃单元',index===2?'2':'4',' / 4 SM',index===2?'尾波未占满所有单元':'当前波占满计算单元'],['计算时间','F / Peff','','工作量 ÷ 有效计算能力']]);}
      else if(mode==='cache'){const v=cacheStates[index],average=Math.round((v.hits*100+v.misses*400)/(index+1));mount(svg,cacheDrawing(t,index));readouts(readout,[['累计命中',String(v.hits),` / ${index+1} 次读取`,index===7?'最终命中率 25%':'命中时复用已有数据'],['累计未命中',String(v.misses),' 次',`从 HBM 读入 ${v.misses} 个输入 tile`],['平均完整往返时间',String(average),' ns','按命中 / 未命中路径加权']]);}
      else{mount(svg,pipelineDrawing(t));readouts(readout,[['同一 tile 的依赖','QK → softmax → PV','','按依赖顺序执行'],['共享资源','Tensor 不重叠','','同一物理资源需要仲裁'],['总执行时间','Makespan','','满足资源与依赖的完成时间']]);}
    }});
    function select(next){if(!kernelModes[next])return;mode=next;const meta=kernelModes[mode];document.querySelectorAll('[data-model]').forEach(b=>{const active=b.dataset.model===mode;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});root.setAttribute('aria-labelledby',`tab-${mode}`);document.getElementById('kernel-eyebrow').textContent=meta.eyebrow;document.getElementById('kernel-title').textContent=meta.title;svg.setAttribute('aria-label',meta.label);root.dataset.mode=mode;buildSteps();clock.configure(meta);}
    root.dataset.mode=mode;
    return {clock,select};
  }
  const servingSteps=[
    {at:0,still:.8,title:'两种方式都先准备并提交 Batch A。',body:'CPU 准备与提交需要 1 格，Device 执行每批需要 3 格。'},
    {at:1,still:2.7,title:'Depth=2：计算 A 时，CPU 可以提前准备 B。',body:'B 提交后仍需等待 Device；两个批次不会同时占用图中的设备计算资源。'},
    {at:4,still:4.7,title:'Depth=1 的 Device 要等 CPU 准备 B。',body:'Depth=2 已经准备好 B，因此 A 结束后可直接执行 B，减少这一格空档。'},
    {at:7,still:8.7,title:'计算时长相同，等待关系不同。',body:'异步准备节省的是 Device 等待 CPU 的空档。实际服务还需要考虑 token、KV 与执行依赖。'}
  ];
  function serving(root) {
    const svg=root.querySelector('svg');
    return new SimTimeline({root,duration:11,steps:servingSteps,draw(time){
      const t=Math.min(time,8),x=v=>161+v*91;
      let s=title('两批计算保持串行，提前准备减少设备等待');
      for(let v=0;v<=8;v++){s+=line(x(v),49,x(v),365,'#f1ecf6')+text(x(v),393,String(v),11,C.muted,centered);}
      const configs=[{y:0,name:'Depth = 1',sub:'A 完成后，再准备 B',jobs:[['cpu',0,1,'准备 A'],['device',1,4,'计算 A'],['cpu',4,5,'准备 B'],['device',5,8,'计算 B']],end:8},{y:202,name:'Depth = 2',sub:'A 计算时，提前准备 B',jobs:[['cpu',0,1,'准备 A'],['device',1,4,'计算 A'],['cpu',1,2,'准备 B'],['device',4,7,'计算 B']],end:7}];
      configs.forEach((v,i)=>{s+=text(28,25+v.y,v.name,16,C.purpleDark,'font-weight="550"')+text(165,25+v.y,v.sub,11,C.muted);s+=text(95,87+v.y,'CPU',12,C.muted,'text-anchor="end"')+text(95,143+v.y,'Device',12,C.muted,'text-anchor="end"');s+=line(142,90+v.y,910,90+v.y,'#eee8f4')+line(142,146+v.y,910,146+v.y,'#eee8f4');v.jobs.forEach(j=>{const y=v.y+(j[0]==='cpu'?60:116),w=x(j[2])-x(j[1])-4,p=clamp((t-j[1])/(j[2]-j[1])),color=j[0]==='cpu'?'#e4edf9':'#e9dff4',edge=j[0]==='cpu'?'#9db6d6':'#b59bce';s+=rect(x(j[1]),y,w,41,'#fcfaff','#e8e0f0',7);if(p>0)s+=rect(x(j[1]),y,w*p,41,color,edge,7);s+=text(x(j[1])+w/2,y+25,j[3],12,j[0]==='cpu'?'#7997bd':C.purpleDark,centered);});if(i===0){s+=rect(x(4),116,x(5)-x(4)-4,41,'#fbf6ed','#dfcaa5',7,'stroke-dasharray="4 4"')+text((x(4)+x(5))/2-2,141,'空等',11,'#bda575',centered);}if(t>=v.end)s+=pill(x(v.end)-45,166+v.y,90,'两批完成',i===0?'#f1eef6':'#ede5f8',i===0?'#a797b4':'#9073ac');});
      s+=line(x(t),45,x(t),361,'#b6a2ca','stroke-width="1.3" stroke-dasharray="3 5"');s+=circle(x(t),45,3,'#b6a2ca')+text(967,414,'相对时间 →',10,C.muted,'text-anchor="end"');
      mount(svg,s);
    }});
  }
  window.SimFigures={heroArchitecture,scale,constraint,framework,kernel,serving,escape:esc};
})();
