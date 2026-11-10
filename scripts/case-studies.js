/* Case renderers preserve source figures and use a separate schematic clock. */
(() => {
  const t = window.SimI18n.t;
  const e = value => window.SimFigures.escape(value);
  const asset = name => window.SIM_INLINE_ASSETS?.[name] || window.SimI18n.asset(name);
  const records = new Map();
  const center = 'text-anchor="middle"';
  const number = value => Number(value.toFixed(2));
  const limit = value => Math.max(0, Math.min(1, value));
  const box = (x,y,w,h,fill='#fff',stroke='#e5ddec',r=8,extra='') => `<rect x="${number(x)}" y="${number(y)}" width="${number(w)}" height="${number(h)}" rx="${r}" fill="${fill}" stroke="${stroke}" ${extra}/>`;
  const label = (x,y,text,size=12,color='#8c7998',extra='',maxWidth) => `<text x="${number(x)}" y="${number(y)}" font-size="${window.SimI18n.fitText(text,window.SimFigures.diagramSize(size),maxWidth)}" fill="${window.SimFigures.diagramColor(color)}" ${extra}>${e(text)}</text>`;
  const route = (d,color='#d7cadf',extra='') => `<path d="${d}" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const point = (x,y,r,color) => `<circle cx="${number(x)}" cy="${number(y)}" r="${r}" fill="${color}"/>`;
  const media = name => `<div class="media-controls"><button class="icon-button reset-button" type="button" aria-label="重播${name}">↺</button><button class="icon-button play-toggle" type="button" aria-label="暂停${name}" aria-pressed="true"><svg viewBox="0 0 20 20" aria-hidden="true"><path class="play-icon" d="m7 4 9 6-9 6z"/><path class="pause-icon" d="M6 4h3v12H6zm5 0h3v12h-3z"/></svg></button></div>`;
  const sparseSteps = [
    {at:0,still:1.7,tab:'索引就绪',title:'先得到稀疏索引，再发起所选 KV 的读取。',body:'GLM-5.2 的四层共用一组索引选择；各层仍读取各自的 KV 状态。'},
    {at:2,still:3.7,tab:'远端读取',title:'读取 Batch A 的 KV，同时执行另一 batch。',body:'远端内存服务与 GPU 上已经具备数据的工作交叠。'},
    {at:5,still:6.6,tab:'批间交叠',title:'另一 batch 的四层执行，提供可用交叠窗口。',body:'能否掩盖读取，取决于实际 KV 规模、持续传输带宽和执行依赖。'},
    {at:9,still:14.1,tab:'切回执行',title:'数据就绪后，继续执行对应的层。',body:'减少暴露的远端等待，使额外 KV 容量更有机会转化为服务吞吐。'}
  ];
  const denseSteps = [
    {at:0,still:1.2,tab:'逐层读取',title:'每个 Attention 层都需要加载所需 KV。',body:'图中展示稠密访问的简化关键路径；读取与计算可以部分交叠。'},
    {at:2,still:3.5,tab:'等待暴露',title:'当所需数据尚未到达，计算会等待。',body:'较大的 KV 传输可能超出可用的计算交叠窗口。'},
    {at:5,still:7.3,tab:'下一层',title:'下一层继续产生 KV 读取。',body:'无法直接沿用稀疏索引带来的四层预取窗口。'},
    {at:9,still:14.1,tab:'关键路径',title:'容量增加之后，还要付出传输与竞争的代价。',body:'池化是否有利，需要回到包含计算、内存与互连的端到端服务指标。'}
  ];

  function render(item,index) {
    const id=/^[a-z0-9-]+$/.test(item.id||'')?item.id:`case-${index+1}`;records.set(id,item);
    const links=[['results','三模型对比'],['flow','访问与交叠'],['settings','实验设置']];
    return `<article class="memory-case" id="${id}" data-case-type="memory-pool">
      <header class="pool-header"><div class="pool-kicker">${e(item.kicker)}</div><h3>${e(item.title)}</h3><p>${e(item.summary)}</p><div class="pool-badges">${item.badges.map(v=>`<span>${e(v)}</span>`).join('')}</div></header>
      <div class="pool-metrics">${item.metrics.map(v=>`<div><strong>${e(v.value)}</strong><span>${e(v.label)}</span><small>${e(v.detail)}</small></div>`).join('')}</div>
      <nav class="pool-nav" aria-label="内存池案例目录">${links.map((v,i)=>`<a href="#${id}-${v[0]}"><span>0${i+1}</span>${v[1]}</a>`).join('')}</nav>

      <section class="pool-section" id="${id}-results"><div class="pool-section-title"><div><span class="micro-label">SERVING FRONTIERS</span><h4>三模型服务前沿</h4></div><p>横轴是单用户交互性（1 / TPOT），纵轴是 TGS：每 GPU 每秒处理的输入与输出 token。两项指标共同描述服务取舍。</p></div>
        <figure class="pool-results is-overview pool-results-comparison"><div class="pool-result-plot"><div class="pool-legend"><span><i class="pool-dot"></i>池化设计</span><span><i class="baseline-dot"></i>无池设计</span><span><i class="pool-diamond"></i>池化前沿</span><span><i class="baseline-circle"></i>无池前沿</span></div><p class="diagram-hint">左右滑动查看三模型完整对比图 <span aria-hidden="true">↔</span></p><div class="diagram-scroll pool-comparison-scroll" tabindex="0" aria-label="三模型服务前沿对比图，可横向滚动"><img src="${e(asset(item.comparison.image))}" alt="${e(item.comparison.alt)}" width="1084" height="360" loading="lazy"></div></div></figure>
      </section>

      <section class="pool-section" id="${id}-flow"><div class="pool-section-title"><div><span class="micro-label">WHY IT WORKS</span><h4>容量走出 HBM，<br>先看数据怎样回来。</h4></div><p>池化读取与 collective 共用 scale-up fabric。除了能放下多少，还要看读多少，以及读取何时暴露在关键路径上。</p></div>
        <p class="pool-flow-intro">GLM-5.2 的 78 层中有 <strong>75 层采用稀疏注意力</strong>。百万上下文下，每个稀疏层只读取选中的 <strong>2,048 tokens 与索引摘要</strong>，对应该层 KV 的 <strong>0.54%</strong>。四层共用的是索引选择，各层仍有自己的 KV。G1 使用 46 个 HBF 节点，支持 8 个 TP16 副本、每副本 batch64。</p>
        <div class="pool-baseline-setup"><div class="pool-placement"><b>无池配置</b><span>HBM <i>→</i> Host DRAM <i>→</i> SSD</span></div><div class="pool-placement"><b class="has-pool">池化配置</b><span>HBM <i>→</i> <em>Scale-up 池</em> <i>→</i> Host DRAM <i>→</i> SSD</span></div></div>
        <div class="segmented pool-mode-buttons" role="group" aria-label="比较 KV 访问方式"><button type="button" data-pool-mode="sparse" aria-pressed="true">稀疏 KV 访问</button><button type="button" data-pool-mode="dense" aria-pressed="false">稠密 KV 访问</button></div>
        <figure class="pool-flow-demo interactive-figure"><div class="figure-heading"><span class="micro-label" data-pool-flow-label>稀疏索引 / 跨 BATCH 交叠</span><div class="figure-legend"><span><i class="legend-compute"></i>GPU 计算</span><span><i class="legend-pool"></i>KV 读取</span><span><i class="legend-wait"></i>暴露的等待</span><span class="small-tag">机制示意</span></div></div><p class="diagram-hint">左右滑动查看完整图解 <span aria-hidden="true">↔</span></p><div class="diagram-scroll" tabindex="0" aria-label="内存池读取与计算交叠时间线，可横向滚动"><svg viewBox="0 0 1000 470" role="img" aria-label="共享 fabric 上的稀疏读取与跨 batch 计算交叠；时间长度不代表实测"></svg></div><div class="stage-tabs compact-tabs" role="group" aria-label="内存池机制动画阶段"></div><figcaption class="figure-bottom"><div class="figure-caption"><strong data-caption-title></strong><p data-caption-body></p></div>${media('内存池机制动画')}</figcaption></figure>
        <details class="pool-operator-detail"><summary>展开算子与通信时间线 <span aria-hidden="true">＋</span></summary><p class="diagram-hint">左右滑动查看完整时间线 <span aria-hidden="true">↔</span></p><div class="diagram-scroll" tabindex="0" aria-label="稀疏与稠密注意力的详细算子时间线"><img src="${e(asset('assets/cases/memory-pool/paper-timeline.svg'))}" alt="稀疏与稠密注意力的算子、通信和 KV 池读取时间线；稀疏索引使四层 KV 读取可与另一 batch 的执行交叠。" loading="lazy"></div></details>
      </section>


      <details class="pool-settings" id="${id}-settings"><summary>实验设置与指标定义 <span aria-hidden="true">＋</span></summary><div class="pool-settings-body"><div class="pool-settings-grid"><div><h5>工作负载与部署</h5><p>DeepSeek-V3、GLM-5.2、Qwen3-235B；128 张 H200，每张 141 GB HBM。</p><p>每个请求：100 万 token 上下文、8,192 input tokens、1,024 output tokens。每副本 batch 范围为 1–512。</p><p>同时搜索同置与 P/D 分离。G1 中 P/D=128/128 表示同一组 128 张 GPU 被两个阶段共用；8 个 TP16 副本，每副本 batch64。</p></div><div><h5>设计空间与评估方法</h5><p>151 个设计点，含覆盖 10 类拓扑的 23 个无池配置；池化设计在 NVL-style 和 rail-optimized fat tree 上展开。三模型共搜索 2,353 种合法并行组合。</p><p>每 GPU 为 18 条链路，每条每方向 200 Gb/s。池化介质包括 LPDDR5X、NVMe 和 HBF，规模为 1–46 节点，存放溢出的 KV、专家权重或两者。</p><p>计算与 HBM 用 Roofline 建模，ASTRA-sim 调度系统依赖。surrogate 全空间评估后，ProtoBridge 精化 TGS 与交互性排名前 15% 的候选并集。本案例耗时 58 分钟：51 分钟评估、7 分钟包级精化。</p></div></div><div class="pool-table-scroll" tabindex="0" role="region" aria-label="本次仿真使用的内存参数"><table><thead><tr><th>存储层级</th><th>容量</th><th>读带宽</th><th>固定时延</th></tr></thead><tbody>${item.memoryTiers.map(row=>`<tr>${row.map(v=>`<td>${e(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p style="margin-top:14px">上述参数是本次仿真的存储设定。池节点的可达读带宽还受到接入链路与 fabric 的限制；数据优先留在 HBM，剩余数据依次使用池、Host DRAM 和 SSD。</p><div class="metric-definition"><p><b>交互性</b> = 1 / TPOT，单位为单用户输出 tokens/s。<b>TGS</b> = <code>R × B × (P + O) / [G × (TTFT + Tdecode)]</code>，输入与输出 token 均计入。</p><p>R 是活跃副本数，B 是每副本同步 batch，G 是 GPU 数，P / O 是输入 / 输出 token 数。G1 的 1.31× 属于该模型与选定设计点；具体效果随模型、部署与互连配置而变化，其他设计需比较各自的完整前沿。</p></div></div></details>
      <div class="pool-takeaways"><div><b>容量决定能否放下</b><p>更大的可用 KV 空间，支持新的 batch 与副本配置。</p></div><div><b>访问模式决定搬多少</b><p>稀疏读取控制进入共享互连的数据规模。</p></div><div><b>流水与互连决定等待</b><p>读取的交叠窗口与共享链路竞争，共同影响关键路径。</p></div></div>
    </article>`;
  }

  function drawArchitecture(t) {
    let s=box(30,17,202,76,'#fbf9fd','#dfd4e9',13)+label(131,47,'GPU / HBM',18,'#866b9b',`${center} font-weight="550"`)+label(131,71,'计算与本地容量',10,'#b19dbc',center);
    s+=box(336,17,234,76,'#f6f8f6','#d4e2da',13)+label(453,47,'共享 scale-up fabric',16,'#668c79',`${center} font-weight="550"`)+label(453,71,'数据与通信共同竞争',10,'#9cb09f',center);
    s+=box(764,17,207,76,'#fbf9fd','#e2d8ec',13)+label(867,47,'其他 GPU',16,'#967ba9',center)+label(867,71,'Collective 参与方',10,'#b6a1c2',center);
    s+=box(764,118,207,63,'#f4f9f5','#d0e1d4',12)+label(867,145,'Scale-up 内存池',15,'#6f957f',center)+label(867,164,'远端 KV 容量',10,'#a0b5a7',center);
    s+=route('M232 42H336M570 42H764','#c6b1d7','stroke-width="1.6"')+route('M232 70H336M570 70H661Q675 70 675 84V150H764','#a0c3ac','stroke-width="1.6"');
    s+=label(668,30,'Collective',10,'#b09ac0',center)+label(608,116,'KV read',10,'#94b19f',center);
    const p=(t*.22)%1;s+=point(232+104*p,42,3,'#b19ac3')+point(336-104*p,70,3,'#91b69f');
    s+=route('M29 204H971','#eee7f3');return s;
  }
  function job(t,start,end,y,name,kind='compute',extra='') {
    const x=174+start*56,w=(end-start)*56-3,p=limit((t-start)/(end-start));
    const colors=kind==='read'?['#d9e9df','#a4c6af','#648a73']:kind==='wait'?['#faf1e2','#dcc79f','#b79a66']:['#e9dff2','#c4acd6','#9274a6'];
    let s=box(x,y,w,31,'#fdfcfe','#eee6f3',6,extra);
    if(p>0)s+=box(x,y,Math.max(.1,w*p),31,colors[0],colors[1],6);
    s+=label(x+w/2,y+20,name,10,colors[2],center,w-8);return s;
  }
  function scene(mode,t) {
    let s=`<title>${e(mode==='sparse'?'稀疏 KV 读取与另一 batch 的四层执行交叠':'稠密 KV 访问中，未被计算覆盖的读取形成等待')}</title>`+drawArchitecture(t);
    s+=label(30,225,mode==='sparse'?'跨 batch 执行与远端读取':'逐层读取与暴露的等待',11,'#aa98b5');
    for(const y of [258,326,394])s+=route(`M166 ${y}H971`,'#f0e9f5');
    if(mode==='sparse'){
      s+=box(286,233,305,211,'#f7faf6','#d8e7db',9,'stroke-dasharray="4 5"')+label(438,253,'另一 batch 的四层窗口',10,'#a1b49e',center);
      s+=label(143,282,'Batch A',12,'#aa92b9','text-anchor="end"')+label(143,350,'Batch B · KV 就绪',10,'#aa92b9','text-anchor="end"')+label(143,418,'KV 池读取',12,'#96ae9a','text-anchor="end"');
      s+=job(t,0,2,264,'Indexer','compute','data-compute="A-index"');
      for(let i=0;i<4;i++){s+=job(t,2+i*1.375,2+(i+1)*1.375,332,`层 i${i?'+'+i:''}`,'compute',`data-compute="B-${i}"`);s+=job(t,7.5+i*1.375,7.5+(i+1)*1.375,264,`层 i${i?'+'+i:''}`,'compute',`data-compute="A-${i}"`);}
      s+=job(t,2,6.5,400,'Batch A：四层各自的 KV','read');
      s+=route('M286 297V314','#c2aed1','stroke-dasharray="3 4"')+route('M594 365V383','#c2aed1','stroke-dasharray="3 4"');
    }else{
      s+=label(143,282,'GPU 工作',12,'#aa92b9','text-anchor="end"')+label(143,350,'Attention 层',12,'#aa92b9','text-anchor="end"')+label(143,418,'KV 池读取',12,'#96ae9a','text-anchor="end"');
      const work=[[.2,1.4],[2.6,4],[5,6.5],[7,8],[9.2,10.7],[11.8,13.2]],wait=[[1.4,2.6],[4,5],[8,9.2],[10.7,11.8]];
      work.forEach(([a,b])=>{s+=job(t,a,b,264,'计算');});wait.forEach(([a,b])=>{s+=job(t,a,b,264,'等待','wait');});
      s+=box(174,332,361,31,'#faf7fc','#e3d8ed',7)+label(354,352,'层 i · FlashMLA',11,'#b19abd',center);
      s+=box(555,332,358,31,'#faf7fc','#e3d8ed',7)+label(734,352,'层 i+1 · FlashMLA',11,'#b19abd',center);
      s+=job(t,0,6.2,400,'本层所需 KV','read')+job(t,6.8,13,400,'下一层所需 KV','read');
    }
    const cursor=174+Math.min(t,13.5)*56;s+=route(`M${number(cursor)} 259V435`,'#c4b1d2','stroke-dasharray="3 5"')+point(cursor,259,2.8,'#b6a0c5');
    s+=label(971,459,'执行顺序 →  /  非比例机制示意',10,'#baadc5','text-anchor="end"');return s;
  }

  function mount(root) {
    if(!records.has(root.id))return;
    const flow=root.querySelector('.pool-flow-demo'),drawing=flow.querySelector('svg'),tabs=flow.querySelector('.stage-tabs');let mode='sparse',painted='';
    function stepsForMode(){const steps=mode==='sparse'?sparseSteps:denseSteps;tabs.innerHTML=steps.map((s,i)=>`<button type="button" data-step="${i}"><span>0${i+1}</span>${e(s.tab)}<i></i></button>`).join('');return steps;}
    const clock=new SimTimeline({root:flow,duration:16,steps:stepsForMode(),draw(t){const content=scene(mode,t);if(content!==painted){drawing.innerHTML=content;painted=content;}}});
    root.querySelectorAll('[data-pool-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.poolMode;root.dataset.poolMode=mode;root.querySelectorAll('[data-pool-mode]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));flow.querySelector('[data-pool-flow-label]').textContent=t(mode==='sparse'?'稀疏索引 / 跨 BATCH 交叠':'稠密访问 / 读取可能暴露');drawing.setAttribute('aria-label',t(mode==='sparse'?'四层共用稀疏索引，读取可与另一 batch 的执行交叠':'稠密 KV 访问的简化关键路径；计算与读取可以部分交叠，数据未就绪会产生等待'));clock.configure({duration:16,steps:stepsForMode()});}));
    root.dataset.poolMode='sparse';root.__caseClock=clock;
    root.querySelector(`.pool-nav a[href="#${root.id}-settings"]`)?.addEventListener('click',()=>{root.querySelector('.pool-settings').open=true;});
  }
  window.SimCaseStudies={...(window.SimCaseStudies||{}),'memory-pool':{render,mount,scene}};
})();
