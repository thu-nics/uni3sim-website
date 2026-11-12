/* Adapted from the supplied HBFrame player; trace clocks and state boundaries retained. */
(() => {
  const e=value=>window.SimFigures.escape(value);
  function render(item) {return `<article class="hbframe-case" id="${item.id}" data-case-type="hbframe-tier">
<header class="intro"><div><div class="eyebrow">${e(item.kicker)}</div><h3 class="hb-title">${e(item.title)}</h3><p>${e(item.summary)}</p></div></header>
<div aria-label="逻辑层次定义" class="tier-definitions"><div class="definition"><b>L1</b><span>高性能供给</span><p>HBM 或有效的 HBM/HBF 联合供给。</p></div><div class="definition"><b>L1E</b><span>扩展执行层</span><p>直接访问，或先提升到 L1。</p></div><div class="definition"><b>L2</b><span>Backing</span><p>本例在 Host DRAM，使用前恢复到执行侧。</p></div></div>
<section aria-labelledby="hbframe-scenario-title" data-hb-id="case-hbframe-tier-processes" id="case-hbframe-tier-processes">
<div class="scenario-heading"><h4 data-hb-id="scenario-title" id="hbframe-scenario-title">四种 KV 供给过程。</h4></div>
<div aria-label="选择供给过程" class="scenario-tabs" data-hb-id="scenario-tabs" id="hbframe-scenario-tabs" role="group"></div>
<p class="scenario-description" data-hb-id="scenario-description" id="hbframe-scenario-description"></p>
<figure aria-label="L1 L1E L2 访问过程动画" class="case-figure" data-hb-id="case-figure" id="hbframe-case-figure">
<div class="figure-heading"><span class="eyebrow">H2P / PEER · H2C / CASCADE</span><div class="legend"><span><i style="background:#b39bcb"></i>L1 供给</span><span><i style="background:#87af99"></i>L1E 供给</span><span><i style="background:#d6bc8c"></i>L2 backing</span><span class="badge">真实微型轨迹</span></div></div>
<div class="playback"><button aria-label="两侧回到起点" class="icon-button" data-hb-id="reset" id="hbframe-reset" type="button">↺</button><button aria-label="播放两侧动画" aria-pressed="false" class="icon-button" data-hb-id="play" id="hbframe-play" type="button"></button><input aria-label="两侧共同演示进度" class="scrubber" data-hb-id="scrubber" id="hbframe-scrubber" max="1000" min="0" step="1" type="range" value="0"/><span class="time-readout" data-hb-id="time-readout" id="hbframe-time-readout"></span><label class="visually-hidden" for="hbframe-speed">播放速度</label><select class="speed" data-hb-id="speed" id="hbframe-speed"><option value="0.5">0.5× 演示</option><option selected="" value="1">1× 演示</option><option value="2">2× 演示</option></select><button class="export" data-hb-id="export-frame" id="hbframe-export-frame" type="button">保存双侧当前帧 SVG ↓</button></div>
<div aria-label="定位动画阶段" class="stages" data-hb-id="stages" id="hbframe-stages" role="group"></div>
<figcaption class="caption"><div aria-atomic="true" aria-live="polite"><h5 data-hb-id="caption-title" id="hbframe-caption-title"></h5></div><span class="counter" data-hb-id="step-counter" id="hbframe-step-counter"></span></figcaption>
<p class="scroll-hint">可横向滑动查看完整架构和时间线。</p><div class="pair-grid">
<div aria-label="H2P Peer 动画" class="topology-panel" data-hb-id="panel-h2p" id="hbframe-panel-h2p" role="group"><div class="panel-heading"><div><h5>H2P<span>Peer</span></h5><p>GPU 分别直连 HBM / HBF，同级双分支。</p></div><small data-hb-id="time-h2p" id="hbframe-time-h2p"></small></div><div aria-label="H2P 三角形 peer 架构" class="diagram-scroll" role="region" tabindex="0"><svg aria-label="GPU 在上，HBM 与 HBF 为并列分支" data-hb-id="architecture-h2p" id="hbframe-architecture-h2p" role="img" viewbox="0 0 600 475"></svg></div><div class="state-strip" data-hb-id="state-h2p" id="hbframe-state-h2p"></div><div class="panel-gate"><strong data-hb-id="gate-h2p" id="hbframe-gate-h2p"></strong><span data-hb-id="window-h2p" id="hbframe-window-h2p"></span></div><div class="timeline-title"><b>实际响应区间</b><span>共同模拟时间轴</span></div><div aria-label="H2P 时间线" class="diagram-scroll" role="region" tabindex="0"><svg data-hb-id="timeline-h2p" id="hbframe-timeline-h2p" role="img" viewbox="0 0 600 180"></svg></div></div>
<div aria-label="H2C Cascade 动画" class="topology-panel panel-cascade" data-hb-id="panel-h2c" id="hbframe-panel-h2c" role="group"><div class="panel-heading"><div><h5>H2C<span>Cascade</span></h5><p>GPU → HBM 侧控制器 → HBF，级联路径。</p></div><small data-hb-id="time-h2c" id="hbframe-time-h2c"></small></div><div aria-label="H2C 纵向 cascade 架构" class="diagram-scroll" role="region" tabindex="0"><svg aria-label="GPU、HBM 控制器、HBF 纵向级联" data-hb-id="architecture-h2c" id="hbframe-architecture-h2c" role="img" viewbox="0 0 600 475"></svg></div><div class="state-strip" data-hb-id="state-h2c" id="hbframe-state-h2c"></div><div class="panel-gate"><strong data-hb-id="gate-h2c" id="hbframe-gate-h2c"></strong><span data-hb-id="window-h2c" id="hbframe-window-h2c"></span></div><div class="timeline-title"><b>实际响应区间</b><span>共同模拟时间轴</span></div><div aria-label="H2C 时间线" class="diagram-scroll" role="region" tabindex="0"><svg data-hb-id="timeline-h2c" id="hbframe-timeline-h2c" role="img" viewbox="0 0 600 180"></svg></div></div>
</div>
<p class="playback-note">动效解释供给机制，时间线保留原始事件。四轮交错为示意，持久副本与临时窗口分开记账；微型轨迹不代表完整模型性能排名。</p>
</figure>
</section>



</article>`;}
  function mount(root) {
  'use strict';
  const $ = id => root.querySelector(`[data-hb-id="${id}"]`);
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const data = window.SIMULATOR_HBFRAME_TIER_DATA;
  if (data.schema !== 'hbframe-memory-tier-case-v2' || data.cases.length !== 8) {
    $('scenario-description').textContent = '双架构轨迹缺失，请运行 scripts/export_memory_tier_case.py。';
    return;
  }
  const colors = {ink:'#51465e', muted:'#756b80', line:'#e5ddec', purple:'#82629f',
    pale:'#f4eff9', green:'#4f7d69', greenPale:'#eef6f1', amber:'#927443', amberPale:'#fbf5e9'};
  const esc = value => window.SimFigures.escape(value);
  const clamp = n => Math.max(0,Math.min(1,n));
  const fmt = n => Number(n.toFixed(2));
  const bytes = n => `${fmt(n/1024)} KiB`;
  const us = n => (n/1e6).toFixed(3)+' μs';
  const center = 'text-anchor="middle"';
  const text = (x,y,value,size=12,color=colors.ink,attrs='',width) => {
    const edge=x>600?1260:600;
    const budget=width ?? (attrs.includes('middle')?2*Math.min(x,edge-x)-12:attrs.includes('end')?x-12:edge-x-12);
    const fitted=window.SimI18n.fitText(value,Math.max(11.5,size+1),Math.max(20,budget),attrs.match(/font-weight="([^"]+)"/)?.[1]||400);
    return `<text x="${fmt(x)}" y="${fmt(y)}" font-size="${fitted}" fill="${color}" ${attrs}>${esc(value)}</text>`;
  };
  const box = (x,y,w,h,fill='#fff',stroke=colors.line,r=10,attrs='') => `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="${r}" fill="${fill}" stroke="${stroke}" ${attrs}/>`;
  const path = (points,color=colors.line,attrs='') => `<path d="${points.map((p,i)=>(i?'L':'M')+p.join(' ')).join('')}" fill="none" stroke="${color}" stroke-linejoin="round" stroke-linecap="round" ${attrs}/>`;
  const active = (t,start,end) => t>=start && t<end;
  function pulse(points,progress,color) {
    const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));
    let distance=clamp(progress)*lengths.reduce((a,b)=>a+b,0),point=points.at(-1);
    for(let i=0;i<lengths.length;i++) {
      if(distance<=lengths[i]) {const q=distance/lengths[i];point=[points[i][0]+q*(points[i+1][0]-points[i][0]),points[i][1]+q*(points[i+1][1]-points[i][1])];break;}
      distance-=lengths[i];
    }
    return path(points,color,'stroke-width="2.2" stroke-dasharray="4 4"')+`<circle cx="${fmt(point[0])}" cy="${fmt(point[1])}" r="4" fill="${color}"/>`;
  }
  const scenarios = {
    direct:{tab:'L1E 直接使用',description:'B 驻留 HBF：H2P 直达 GPU，H2C 经 HBM 侧桥接。',
      takeaway:'直接读取，B 仍驻留 HBF。',detail:'桥接改变访问路径，不建立持久 HBM 副本。',
      steps:[['识别层次','两侧 B 都在 HBF，供给档位为 L1E。','A 在 HBM，C 在 Host DRAM；拓扑与逻辑供给分别展示。'],
        ['选择 direct','提交 L1E 直接读取，不建立持久 HBM 目标。','H2P 与 H2C 分别兑现各自的真实访问路径。'],
        ['访问路径','Peer 走直接分支；Cascade 经 HBM 侧桥接。','路径上的活动指示是机制示意，实际响应区间见各侧时间线。'],
        ['完成反馈','各侧按自己的真实完成时间返回结果。','B 仍在 HBF；两侧都没有新增持久 HBM Block。'],
        ['放行消费','所需 Fetch 完成，consumer 才可执行。','这里只显示依赖门，不执行完整 GPU model forward。']]},
    promote:{tab:'L1E → L1 提升',description:'先将完整的 B 复制到 HBM，提交后从 L1 读取。',
      takeaway:'复制完成后，才发布 L1。',detail:'完整复制后发布 HBM 有效副本，保留 HBF backing。',
      steps:[['识别层次','B 尚无有效的 HBM 副本。','两侧选择同一个逻辑转换，交给各自的存储组织兑现。'],
        ['预留目标','先预留完整 HBM Block，目标处于 copying。','虚线目标不可作为 L1 命中；复制源仍然有效。'],
        ['执行复制','按实际路径读取 HBF，再完成目标 HBM 写入。','同一模拟时钟下，一侧可以先完成准备，不强行同时提交。'],
        ['提交 L1','各侧在复制完成后提交目标 resident。','HBM / HBF 是同一个逻辑 Block 的完整双副本。'],
        ['放行消费','完成后续 L1 Fetch，再放行 consumer。','容量预留、复制完成与读取返回是不同边界。']]},
    restore:{tab:'L2 → L1 恢复',description:'将 Host DRAM 中的 C 恢复到 HBM，再供给 GPU。',
      takeaway:'先恢复到 HBM，再消费。',detail:'L2 数据恢复到执行侧后，再放行消费。',
      steps:[['识别 backing','C 的有效内容只在 Host DRAM，属于 KV L2。','SSD 是更深的 backing 介质，本次没有访问。'],
        ['预留目标','预留完整 HBM 目标，不提前发布就绪。','源 backing 在复制期间保持有效。'],
        ['恢复路径','Host 读取、链路服务与目标写入按依赖执行。','时间线保留实际重叠；不累加所有响应区间当作总时长。'],
        ['提交恢复','完成所需动作后，C 的 HBM 副本变为 resident。','本例保留 Host DRAM backing；新增占用来自真实副本。'],
        ['放行消费','恢复后完成 L1 Fetch，consumer 获得数据。','该微型访问不用于推断完整请求的 TTFT 或吞吐收益。']]},
    striped:{tab:'HBM / HBF 联合 L1',description:'A / B 整块分布于 HBM/HBF，比较并行分支与级联预取。',
      takeaway:'联合 L1，按拓扑组织供给。',detail:'H2P 可并行供给；H2C 使用有界窗口交错供给，持久副本保持原位。',
      steps:[['识别组织','A / B 在两个介质完整驻留，共同构成条带 L1。','这是 Block 之间的分配，不是把同一个 Block 拆在两个介质上。'],
        ['选择 L1','按各侧已声明的供给组织准备数据。','H2C 保留有界预取窗口，尚未填好的窗口不能放行 consumer。'],
        ['并行与级联','H2P 同步供给；H2C 连续展示四轮交错供给。','右侧每轮先以 HBM A 供给并准备 HBF B，窗口就绪后切换到 B 供给。轮次为机制示意，原始时序保留在下方。'],
        ['供给就绪','必需的分支与窗口填充完成后才返回。','持久副本仍在原介质；临时窗口有独立生命周期。'],
        ['放行消费','各侧按真实 Fetch 完成时间解除等待。','本微型 case 在消费边界释放窗口，不包含 GPU kernel 执行。']]}
  };
  const topologies=['h2p','h2c'],stageStarts=[0,.16,.3,.8,.93],stagePositions=[0,.2,.54,.86,1];
  let selected,pair,spec,position=0,paused=true,previous=null,frame=null,visible=false,speed=1,lastStage=-1,lastPaint=-Infinity;
  function phaseAt(p) {let stage=0;stageStarts.forEach((at,i)=>{if(p>=at)stage=i;});return stage;}
  const copyEnd = c => c.tasks.find(t=>t.semantic_op==='kv_load')?.end_ps ?? c.duration_ps;
  const maxDuration = () => Math.max(...topologies.map(t=>pair[t].duration_ps));
  const hbmRead = c => c.id==='striped'?c.events.find(e=>e.component==='device'&&e.request_type==='read'):null;
  function cascadeUse(c,read,time,stage) {
    const state=stage<2?'idle':time<c.duration_ps?'active':'complete';
    const cycle=clamp((position-.3)/.5)*4,round=Math.min(3,Math.floor(cycle)),q=cycle-round;
    const phase=q<.45?'local-fill':q<.55?'window-ready':q<.95?'window-supply':'turnover';
    return {read,interleaved:true,state,round,q,phase,
      localProgress:clamp(q/.45),windowProgress:clamp((q-.55)/.4)};
  }
  function hbmUse(c,time,stage) {
    const read=hbmRead(c);
    if(!read)return null;
    if(c.topology==='h2p')return {read,joint:true,progress:((position-.3)*8)%1,
      state:stage<2?'idle':time<c.duration_ps?'active':'complete'};
    if(c.topology==='h2c')return cascadeUse(c,read,time,stage);
    return {read,state:stage<2||time<read.start_ps?'idle':time<read.end_ps?'active':'complete'};
  }
  function clock(p) {
    const boundary=Math.max(...topologies.map(t=>copyEnd(pair[t])));
    if(p<.3)return 0;
    if(p<.8) {
      if(selected==='striped') {
        const early=Math.min(boundary,Math.max(...topologies.map(t=>hbmRead(pair[t])?.end_ps||0)));
        if(early>0&&early<boundary) {
          if(p<.57)return Math.floor(early*(p-.3)/.27);
          return Math.floor(early+(boundary-early)*(p-.57)/.23);
        }
      }
      return Math.floor(boundary*(p-.3)/.5);
    }
    if(p<.93)return boundary;
    return Math.round(boundary+(maxDuration()-boundary)*clamp((p-.93)/.06));
  }
  function localState(c,time,globalStage) {
    const localTime=Math.min(time,c.duration_ps);
    const state=globalStage===0?c.frames[0]:c.frames.filter(f=>f.time_ps<=localTime).at(-1);
    const ready=globalStage>0 && time>=c.duration_ps;
    return {time:localTime,state,ready,stage:globalStage===0?0:ready?4:time>=copyEnd(c)&&c.tasks.length>1?3:globalStage<2?1:2};
  }
  function tile(x,y,block,tier,c,use) {
    const ready=block.replicas[tier]==='resident',color=tier==='hbm'?colors.purple:tier==='hbf'?colors.green:colors.amber;
    const fill=tier==='hbm'?colors.pale:tier==='hbf'?colors.greenPale:colors.amberPale;
    const focused=c.id==='striped'?block.alias!=='C':block.alias===c.target;
    const participates=block.alias==='A'&&tier==='hbm'||(use?.joint||use?.interleaved)&&block.alias==='B'&&tier==='hbf';
    const reading=participates?use:null;
    let label=reading?.state==='active'?(reading.joint?'联合供给':'供给中'):reading?.state==='complete'?(reading.joint?'联合就绪':'已供给'):ready?'resident':'copying';
    if(reading?.interleaved&&reading.state==='active')label=tier==='hbm'?(reading.phase==='local-fill'?'本地供给':'交错等待'):(reading.phase==='local-fill'?'准备窗口':'已入窗口');
    const useState=reading?.interleaved&&reading.state==='active'&&reading.phase!=='local-fill'?'waiting':reading?.state;
    return `<g data-block="${block.alias}" data-tier="${tier}" data-state="${esc(block.replicas[tier])}"${reading?` data-use-state="${useState}" data-use-mode="${reading.interleaved?'interleaved-schematic':reading.joint?'joint-schematic':'observed'}"`:''}>`+
      box(x,y,58,29,ready?fill:'#fff',color,6,`${ready?'':'stroke-dasharray="4 3"'} opacity="${focused?1:.65}"`)+
      text(x+29,y+19,block.alias,14,color,center+' font-weight="600"')+
      (tier==='dram'?'':text(x+29,y+43,label,10,color,center,74))+'</g>';
  }
  function architecture(c,local) {
    const {state,time,stage,ready}=local,peer=c.topology==='h2p',use=hbmUse(c,time,stage);
    const layout=peer?{gpu:[196,35,156,64],hbm:[32,177,220,115],hbf:[302,177,220,115],dram:[380,335,190,90]}
      :{gpu:[75,35,160,64],hbm:[40,177,230,115],hbf:[40,335,230,90],dram:[380,335,190,90]};
    const hbmRoute=peer?[[236,99],[236,132],[142,132],[142,177]]:[[155,99],[155,177]];
    const hbfRoute=peer?[[314,99],[314,132],[412,132],[412,177]]:[[155,292],[155,335]];
    const hostRoute=peer?[[352,66],[582,66],[582,330],[475,330],[475,335]]:[[235,66],[582,66],[582,330],[475,330],[475,335]];
    let s=`<title>${peer?'H2P：GPU 直接连接两个同级存储分支':'H2C：GPU、HBM 侧控制器、HBF 的级联路径'}</title>`;
    s+=path(hbmRoute,colors.purple,'stroke-width="1.7"')+path(hbfRoute,colors.green,'stroke-width="1.7"')+path(hostRoute,colors.amber,'stroke-width="1.3"');
    if(peer) {
      s+=text(132,153,'GPU ↔ HBM',11,colors.purple,center)+text(416,153,'GPU ↔ HBF',11,colors.green,center);
      const status=use?.state==='active'?'A · HBM 同步供给':use?.state==='complete'?'A · 联合供给已就绪':'同级 peer 分支';
      const other=use?.state==='active'?'B · HBF 同步供给':use?.state==='complete'?'B · 联合供给已就绪':'HBF 直接可达 GPU';
      s+=text(140,322,status,11,colors.purple,center)+text(412,322,other,11,colors.green,center);
      s+=text(40,364,use?'HBM / HBF 同时向 GPU 供给数据。':'Peer：HBM / HBF 分别连接 GPU。',12,colors.ink)+
        text(40,386,use?'联合供给机制示意；原始时序见下方。':'Host backing 使用独立路径。',10,colors.muted);
    } else {
      s+=text(175,143,'GPU–HBM 侧 D2D',11,colors.purple)+text(175,320,'HBM 侧–HBF D2D',11,colors.green);
      const note={direct:'直接读取不建立持久副本。',promote:'显式提升后建立 HBM 副本。',restore:'本例 Host 数据经独立路径恢复。',striped:'本例使用有界临时预取窗口。'}[c.id];
      s+=text(316,204,'Cascade',16,colors.green);
      if(use?.interleaved) {
        const phases={'local-fill':'HBM A 供给 + HBF B 填窗','window-ready':'窗口已就绪，切换供给来源','window-supply':'窗口 B → GPU','turnover':use.round===3?'四轮供给结束':'切换到下一轮'};
        s+=`<g data-interleave-round="${use.round+1}" data-interleave-phase="${use.phase}" data-interleave-state="${use.state}">`;
        s+=text(316,230,use.state==='complete'?'四轮交错供给完成':`第 ${use.round+1} / 4 轮 · 机制示意`,12,colors.ink)+
          text(316,252,use.state==='idle'?'HBM 本地供给 / 窗口供给交替':phases[use.phase],11,colors.green)+
          text(316,276,'同一 GPU 侧接口交错传输',11,colors.muted)+text(316,296,'供给轮次（示意）',10,colors.muted);
        const completed=use.state==='complete'?8:use.state==='idle'?0:use.round*2+(use.phase==='local-fill'?0:use.phase==='turnover'?2:1);
        for(let i=0;i<8;i++) {
          const local=i%2===0,color=local?colors.purple:colors.green,fill=local?colors.pale:colors.greenPale;
          const selected=use.state==='active'&&i===completed;
          s+=`<g data-interleave-token="${i}" data-token-state="${i<completed?'complete':selected?'active':'pending'}">`+
            box(316+i*30,304,26,18,i<completed||selected?fill:'#fff',selected?color:colors.line,4)+
            text(329+i*30,317,`${local?'A':'B'}${Math.floor(i/2)+1}`,9,color,center)+'</g>';
        }
        s+='</g>';
      } else s+=text(316,230,'HBF 数据经 HBM 侧桥接。',12,colors.ink)+text(316,252,note,11,colors.muted);
    }
    const g=layout.gpu;
    s+=box(...g,'#fcfbfe',colors.line,12,'data-node="gpu"')+text(g[0]+g[2]/2,g[1]+27,'GPU',19,colors.purple,center+' font-weight="600"')+
      text(g[0]+g[2]/2,g[1]+47,use?.interleaved&&use.state==='active'?(use.phase==='local-fill'?'HBM A → GPU':use.phase==='window-supply'?'窗口 B → GPU':'切换供给来源'):use?.joint&&use.state==='active'?'HBM / HBF 同步供给':ready?'数据依赖已解除':'等待 / 使用就绪数据',10,colors.muted,center,g[2]-12);
    for(const tier of ['hbm','hbf','dram']) {
      const [x,y,w,h]=layout[tier],color=tier==='hbm'?colors.purple:tier==='hbf'?colors.green:colors.amber;
      s+=box(x,y,w,h,'#fff',colors.line,11,`data-node="${tier}"`)+text(x+18,y+25,{hbm:'HBM',hbf:'HBF',dram:'Host DRAM'}[tier],16,color,'font-weight="600"');
      const blocks=state.blocks.filter(b=>b.replicas[tier]);
      blocks.forEach((b,i)=>{s+=tile(x+17+i*76,y+38,b,tier,c,use);});
      if(tier==='hbm') {
        const windowBytes=state.window_used_bytes||0;
        if(use?.interleaved) {
          const windowState=use.state!=='active'?'empty':use.phase==='local-fill'?'filling':use.phase==='window-ready'?'ready':use.phase==='window-supply'?'consuming':'empty';
          const amount=windowState==='filling'?use.localProgress:windowState==='ready'?1:windowState==='consuming'?1-use.windowProgress:0;
          s+=`<g data-window-state="${windowState}" data-window-mode="schematic">`+
            box(x+161,y+36,58,43,'#fff',colors.green,5,'stroke-dasharray="3 3"');
          if(amount>0)s+=box(x+163,y+38,54,39*amount,colors.greenPale,'none',3);
          s+=text(x+190,y+53,'示意窗',10,colors.green,center)+text(x+190,y+68,use.state==='complete'?'已交付':{empty:'待填充',filling:'填充中',ready:'已就绪',consuming:'供给 GPU'}[windowState],9,colors.green,center)+'</g>';
        } else if(windowBytes)s+=box(x+161,y+36,58,43,colors.greenPale,colors.green,5,'stroke-dasharray="3 3"')+text(x+190,y+53,'临时窗',10,colors.green,center)+text(x+190,y+68,bytes(windowBytes),9,colors.green,center);
        if(!peer)s+=box(x+8,y+94,w-16,15,colors.greenPale,'none',4)+text(x+w/2,y+105,'HBM 侧控制器 / 桥接',9,colors.green,center,w-20);
      }
      if(tier==='dram')s+=text(x+12,y+h-8,'SSD：更深 L2，本例未访问',9,colors.muted);
    }
    const task=c.tasks[0].uid;
    if(stage===2&&!use?.interleaved) {
      const sourceEvents=c.events.filter(e=>e.task_uid===task&&e.request_type==='read'&&!e.component.startsWith('fabric:'));
      const end=Math.max(1,...sourceEvents.map(e=>e.end_ps),...c.events.filter(e=>e.task_uid===task&&e.component==='pcie_dram_gpu0').map(e=>e.end_ps));
      if(time<end&&!use?.joint) {
        let points;
        if(c.id==='restore')points=[...hostRoute].reverse();
        else if(peer)points=[...hbfRoute].reverse();
        else points=[[155,335],[155,292],[261,292],[261,177],[155,177],[155,99]];
        s+=pulse(points,time/end,c.id==='restore'?colors.amber:colors.green);
      }
      const write=c.events.find(e=>e.task_uid===task&&e.request_type==='write'&&!e.component.startsWith('fabric:')&&active(time,e.start_ps,e.end_ps));
      if(write) {
        const points=write.reason==='hbm_stage'&&!peer?[[155,292],[261,292],[261,256],[230,256]]:hbmRoute;
        s+=pulse(points,(time-write.start_ps)/Math.max(1,write.end_ps-write.start_ps),write.reason==='hbm_stage'?colors.green:colors.purple);
      }
    }
    if(use?.interleaved) {
      const flowing=use.state==='active',local=flowing&&use.phase==='local-fill',window=flowing&&use.phase==='window-supply';
      const routes=[['hbm',[...hbmRoute].reverse(),local,use.localProgress,colors.purple],
        ['hbf-prepare',[[155,335],[155,292],[261,292],[261,256],[230,256]],local,use.localProgress,colors.green],
        ['window',[[230,213],[230,177],[155,177],[155,99]],window,use.windowProgress,colors.green]];
      for(const [name,route,on,progress,color] of routes) {
        s+=`<g data-supply-path="${name}" data-supply-state="${use.state==='complete'?'complete':on?'active':'waiting'}" data-supply-mode="interleaved-schematic" data-round="${use.round+1}">`;
        if(on)s+=pulse(route,progress,color);
        s+='</g>';
      }
    } else if(use) {
      const routes=[['hbm',hbmRoute,colors.purple],...(use.joint?[['hbf',hbfRoute,colors.green]]:[])];
      for(const [name,route,color] of routes) {
        const progress=use.joint?use.progress:(time-use.read.start_ps)/Math.max(1,use.read.end_ps-use.read.start_ps);
        s+=`<g data-supply-path="${name}" data-supply-state="${use.state}" data-supply-mode="${use.joint?'joint-schematic':'observed'}"${use.joint?` data-flow-phase="${fmt(progress)}"`:` data-start-ps="${use.read.start_ps}" data-end-ps="${use.read.end_ps}"`}><title>${use.joint?'HBM / HBF 同步联合供给机制示意，不表示单次访问持续时长':`A 的 HBM 供给：${use.read.start_ps} → ${use.read.end_ps} ps`}</title>`;
        if(use.state==='active')s+=pulse([...route].reverse(),progress,color);
        else if(use.state==='complete')s+=path([...route].reverse(),color,'stroke-width="2.2" opacity=".6"');
        s+='</g>';
      }
    }
    const names=tier=>state.blocks.filter(b=>b.replicas[tier]==='resident').map(b=>b.alias);
    const hbm=names('hbm'),hbf=names('hbf'),l1=c.id==='striped'?[...new Set([...hbm,...hbf])]:hbm;
    const chips=[[14,182,'L1',l1,colors.purple,colors.pale],[208,180,'L1E',hbf,colors.green,colors.greenPale],[400,184,'L2',names('dram'),colors.amber,colors.amberPale]];
    for(const [x,w,name,content,color,fill] of chips)s+=box(x,441,w,29,fill,'none',7)+text(x+11,460,name,11,color,'font-weight="600"')+text(x+56,460,content.join(' + ')||'—',12,color);
    return s;
  }
  function timeline(c,time,stage) {
    const fetch=c.tasks.find(t=>t.semantic_op==='kv_fetch'),task=c.tasks[0].uid;
    const observed=c.events.filter(e=>e.task_uid===task);
    const resourceRows=[...observed,...(c.resource_intervals||[]).filter(e=>e.task_uid===task)];
    const unique=rows=>[...new Map(rows.map(e=>[`${e.start_ps}:${e.end_ps}:${e.request_type}`,e])).values()];
    const first=resourceRows.filter(e=>e.component.startsWith(c.topology==='h2p'?'fabric:gpu_hbf':'fabric:gpu_memory')||e.component.startsWith('fabric:gpu_hbm')||e.component==='pcie_dram_gpu0');
    const second=resourceRows.filter(e=>e.component.startsWith('fabric:hbm_hbf'));
    const media=observed.filter(e=>e.request_type==='read'&&!e.component.startsWith('fabric:')&&e.component!=='pcie_dram_gpu0').map(e=>({...e,start_ps:e.media_start_ps??e.start_ps,end_ps:e.media_end_ps??e.end_ps}));
    const groups=[['源介质响应',media,colors.green,colors.greenPale],
      ['路径第 1 段',unique(first),colors.amber,colors.amberPale],['路径第 2 段',unique(second),colors.green,colors.greenPale],
      ['HBM 写入 / 窗口',c.events.filter(e=>e.request_type==='write'&&!e.component.startsWith('fabric:')),colors.purple,colors.pale],
      ['最终 Fetch',[{uid:fetch.uid,start_ps:fetch.start_ps,end_ps:fetch.end_ps,component:'MemoryTask'}],colors.purple,colors.pale]];
    if(c.id==='striped') {
      const read=hbmRead(c);
      groups[0]=['B · HBF 响应',media.filter(e=>e.component!=='device'),colors.green,colors.greenPale];
      groups.unshift(['A · HBM 供给',read?[read]:[],colors.purple,colors.pale]);
    }
    const start=125,width=450,end=maxDuration(),bottom=groups.length*28+10;
    let s='<title>同一模拟时钟下的实际事件响应区间，单位微秒</title>';
    for(let i=0;i<=4;i++) {const x=start+width*i/4;s+=path([[x,3],[x,bottom]],'#f0ebf4')+text(x,bottom+19,(end*i/4/1e6).toFixed(2),10,colors.muted,i===4?'text-anchor="end"':center);}
    groups.forEach(([name,events,color,fill],index)=>{
      const y=7+index*28;
      s+=text(115,y+15,name,10,colors.muted,'text-anchor="end"',106);
      if(!events.length)s+=text(136,y+15,'—',10,colors.muted);
      events.forEach(e=>{
        const x=start+e.start_ps/end*width,w=Math.max(.7,(e.end_ps-e.start_ps)/end*width),q=stage===0?0:clamp((time-e.start_ps)/Math.max(1,e.end_ps-e.start_ps));
        s+=`<g><title>${esc(e.component)}：${us(e.start_ps)} → ${us(e.end_ps)}</title>`+box(x,y,w,20,'#fcfbfd',color,Math.min(4,w/2));
        if(q>0)s+=box(x,y,Math.max(.2,w*q),20,fill,color,Math.min(4,w/2));
        if(w>90)s+=text(x+w/2,y+14,us(e.end_ps-e.start_ps),9,color,center);
        s+='</g>';
      });
    });
    const cursor=start+Math.min(clock(position),end)/end*width;
    return s+path([[cursor,0],[cursor,bottom]],colors.purple,'stroke-dasharray="3 4"')+text(590,bottom+19,'μs',10,colors.muted,'text-anchor="end"');
  }
  function ledger(c,local) {
    const {state,ready,stage}=local;
    let s=['hbm','hbf','dram'].map(tier=>{
      const reserved=state.blocks.filter(b=>b.replicas[tier]&&b.replicas[tier]!=='resident').reduce((n,b)=>n+b.size_bytes,0);
      return `<div class="state-cell"><span>${{hbm:'HBM',hbf:'HBF',dram:'Host DRAM'}[tier]} · 持久 KV</span><strong>${bytes(state.used_bytes[tier])}</strong><small>${reserved?'含 '+bytes(reserved)+' 未就绪预留':'有效 Block 副本'}</small></div>`;
    }).join('');
    $(`state-${c.topology}`).innerHTML=s;
    $(`gate-${c.topology}`).textContent=ready?'Fetch 返回 · consumer 可执行':stage===0?'尚未发起访问':stage===3?'目标已就绪 · 等待 Fetch':'等待访问 / 准备完成';
    $(`window-${c.topology}`).textContent=`${c.id==='striped'&&c.topology==='h2c'?'记录中的临时窗口':'临时窗口'}：${bytes(state.window_used_bytes||0)}`;
    $(`time-${c.topology}`).textContent=`本侧完成：${us(c.duration_ps)}`;
    const panel=$(`panel-${c.topology}`);
    panel.dataset.stage=String(stage);panel.dataset.timePs=String(local.time);panel.dataset.ready=String(ready);
    panel.dataset.scenario=c.id;
  }
  function syncPlay() {
    $('play').disabled=motion.matches;
    $('play').setAttribute('aria-label',paused?'播放两侧动画':'暂停两侧动画');$('play').setAttribute('aria-pressed',String(!paused));
    $('play').innerHTML=paused?'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6z"/></svg>':'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4h3v12H6zm5 0h3v12h-3z"/></svg>';
  }
  function render() {
    const stage=phaseAt(position),time=clock(position);
    $('case-figure').dataset.stage=String(stage);$('case-figure').dataset.scenario=selected;
    for(const topology of topologies) {
      const c=pair[topology],local=localState(c,time,stage);
      $(`architecture-${topology}`).innerHTML=architecture(c,local);
      $(`timeline-${topology}`).setAttribute('viewBox',`0 0 600 ${c.id==='striped'?208:180}`);
      $(`timeline-${topology}`).innerHTML=timeline(c,local.time,stage);ledger(c,local);
    }
    $('scrubber').value=String(Math.round(position*1000));$('time-readout').textContent=us(time)+' / '+us(maxDuration());
    $('stages').querySelectorAll('[data-stage]').forEach((button,i)=>{
      if(i===stage)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
      button.style.setProperty('--fill',i<stage?'100%':i===stage?`${100*clamp((position-stageStarts[i])/((stageStarts[i+1]??1.01)-stageStarts[i]))}%`:'0%');
    });
    if(lastStage!==stage) {lastStage=stage;$('caption-title').textContent=spec.steps[stage][1];$('step-counter').textContent=`0${stage+1} / 05`;}
    syncPlay();
    window.SimI18n.apply(root);
  }
  function schedule() {if(frame!==null)cancelAnimationFrame(frame);frame=null;previous=null;if(!paused&&!document.hidden&&visible&&!motion.matches)frame=requestAnimationFrame(tick);}
  function tick(timestamp) {
    frame=null;if(paused||document.hidden||!visible||motion.matches){previous=null;return;}
    if(previous!==null)position=clamp(position+Math.min(.15,(timestamp-previous)/1000)*speed/(selected==='striped'?24:16));
    previous=timestamp;if(position>=1)paused=true;if(timestamp-lastPaint>=1000/30||paused){render();lastPaint=timestamp;}if(!paused)frame=requestAnimationFrame(tick);
  }
  function seek(value) {position=clamp(value);paused=true;render();schedule();}
  function selectCase(id) {
    selected=scenarios[id]?id:'direct';spec=scenarios[selected];pair=Object.fromEntries(topologies.map(topology=>[topology,data.cases.find(c=>c.id===selected&&c.topology===topology)]));
    position=0;paused=true;lastStage=-1;
    $('scenario-description').textContent=spec.description;
    $('case-figure').querySelector('.badge').textContent=selected==='striped'?'联合供给示意 / 原始轨迹':'真实微型轨迹';
    $('panel-h2p').querySelector('.panel-heading p').textContent=selected==='striped'?'HBM / HBF 同步供给 · 上图为联合供给机制示意':'GPU 分别直连 HBM / HBF，同级双分支。';
    $('panel-h2c').querySelector('.panel-heading p').textContent=selected==='striped'?'级联路径 · 四轮交错供给机制示意':'GPU → HBM 侧控制器 → HBF，级联路径。';
    $('stages').innerHTML=spec.steps.map((s,i)=>`<button type="button" data-stage="${i}"><small>0${i+1}</small>${esc(s[0])}</button>`).join('');
    $('stages').querySelectorAll('button').forEach((button,i)=>button.addEventListener('click',()=>seek(selected==='striped'&&i===2 ? .34 : stagePositions[i])));
    $('scenario-tabs').querySelectorAll('[data-case]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.case===selected)));




    render();schedule();
  }
  $('scenario-tabs').innerHTML=Object.entries(scenarios).map(([id,s])=>`<button type="button" data-case="${id}" aria-pressed="false">${esc(s.tab)}</button>`).join('');
  $('scenario-tabs').querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>selectCase(button.dataset.case)));
  $('play').addEventListener('click',()=>{if(position>=1)position=0;paused=!paused;render();schedule();});
  $('reset').addEventListener('click',()=>seek(0));$('scrubber').addEventListener('input',e=>seek(Number(e.target.value)/1000));
  $('speed').addEventListener('change',e=>{speed=Number(e.target.value);});document.addEventListener('visibilitychange',schedule);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.02}).observe($('case-figure'));
  $('export-frame').addEventListener('click',()=>{
    let content=box(0,0,1260,870,'#fff','none',0)+text(20,30,'HBFrame · H2P / H2C · '+spec.tab,19);
    topologies.forEach((topology,i)=>{const x=20+i*630;content+=text(x+8,65,topology.toUpperCase()+(i?' / Cascade':' / Peer'),17,colors.purple)+`<g transform="translate(${x} 78)">${$(`architecture-${topology}`).innerHTML}</g><g transform="translate(${x} 595)">${$(`timeline-${topology}`).innerHTML}</g>`;});
    content+=text(20,814,spec.steps[phaseAt(position)][1],13,colors.ink,'',1220)+text(20,845,window.SimI18n.t('共同模拟时钟')+': '+us(clock(position))+'. '+window.SimI18n.t('路径活动为机制示意，事件条为真实响应区间。'),11,colors.muted,'',1220);
    const source=`<svg xmlns="http://www.w3.org/2000/svg" width="1512" height="1044" viewBox="0 0 1260 870"><style>text{font-family:Arial,'Noto Sans SC','Microsoft YaHei',sans-serif}</style>${content}</svg>`;
    const url=URL.createObjectURL(new Blob([source],{type:'image/svg+xml;charset=utf-8'})),anchor=document.createElement('a');
    anchor.href=url;anchor.download=`hbframe-h2p-h2c-${selected}-stage-${phaseAt(position)+1}.svg`;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  root.__hbframe=window.HBFrameTierCase={selectCase,seek,data,getState:()=>({scenario:selected,position,paused,stage:phaseAt(position),time_ps:clock(position),
    panels:Object.fromEntries(topologies.map(topology=>{const c=pair[topology],s=localState(c,clock(position),phaseAt(position));return [topology,{time_ps:s.time,stage:s.stage,ready:s.ready,duration_ps:c.duration_ps}];}))})};
  motion.addEventListener('change',()=>{if(motion.matches)paused=true;render();schedule();});
  selectCase(new URLSearchParams(location.search).get('hbcase')||'direct');

  }
  window.SimCaseStudies={...(window.SimCaseStudies||{}),'hbframe-tier':{render,mount}};
})();
