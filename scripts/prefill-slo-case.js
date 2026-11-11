/* Raw windowed busy-time observations, separate from a qualitative queueing illustration. */
(() => {
  const e = value => window.SimFigures.escape(value);
  const C = {p:'#725298',d:'#b57532',ink:'#51465e',muted:'#746980',line:'#e7dfed',amber:'#fbf2e6'};
  const pct = value => `${value.toFixed(1)}%`, num = value => Number(value.toFixed(2));
  const center = 'text-anchor="middle"';
  const text = (x,y,value,size=12,color=C.ink,attrs='',width) => `<text x="${num(x)}" y="${num(y)}" font-size="${window.SimI18n.fitText(value,window.SimFigures.diagramSize(size),width,attrs.match(/font-weight="([^"]+)"/)?.[1]||400)}" fill="${window.SimFigures.diagramColor(color)}" ${attrs}>${e(value)}</text>`;
  const rect = (x,y,w,h,fill='#fff',stroke=C.line,r=8,attrs='') => `<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" rx="${r}" fill="${fill}" stroke="${stroke}" ${attrs}/>`;
  const path = (d,color=C.line,attrs='') => `<path d="${d}" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" ${attrs}/>`;
  const dot = (x,y,r,color) => `<circle cx="${num(x)}" cy="${num(y)}" r="${r}" fill="${color}"/>`;
  const records = new Map();
  const steps = [
    {at:0,still:1.8,tab:'随机到达',title:'相同的平均到达率，也会有短时扎堆。',body:'类泊松到达的间隔不均匀。空闲时，系统不能提前处理尚未到达的请求。'},
    {at:3,still:4.8,tab:'突发与排队',title:'P 缺少余量时，等待会消耗 TTFT 预算。',body:'当一批请求撞上正在忙碌的 P 容量，后来的请求需要等待；尾部 SLO 约束的正是这些较慢的请求。'},
    {at:6,still:7.8,tab:'预留 P 余量',title:'为尾部 SLO 配置容量，往往要保留 P 余量。',body:'额外的 P 容量为突发提供可用执行机会。是否满足具体 SLO，仍要结合逐请求 TTFT 分布与 P/D 配置评估。'},
    {at:9,still:10.8,tab:'空闲与忙碌率',title:'突发过去，预留容量会再次空闲。',body:'忙碌率按整个窗口里的 kernel 执行时间计账。为突发配置的余量，会使平均忙碌率低于满载。'}
  ];
  function render(item) {
    const data=window.SIMULATOR_PREFILL_SLO_DATA,id=item.id;records.set(id,data);
    const metrics=[['p','P 池平均忙碌率'],['d','D 池平均忙碌率']];
    return `<article class="slo-case" id="${id}" data-case-type="prefill-slo">
      <header class="slo-header"><p class="slo-kicker">${e(item.kicker)}</p><h3>${e(item.title)}</h3><p>${e(item.summary)}</p><div class="slo-badges">${item.badges.map(v=>`<span>${e(v)}</span>`).join('')}</div></header>
      <div class="slo-metrics">${metrics.map(([key,label])=>`<div><strong>${pct(data.means[key])}</strong><span>${e(label)}</span></div>`).join('')}</div>
      <nav class="slo-nav" aria-label="${e('Prefill 余量案例目录')}"><a href="#${id}-trace">01 ${e('忙碌率观测')}</a><a href="#${id}-mechanism">02 ${e('为什么要留余量')}</a><a href="#${id}-settings">03 ${e('配置与口径')}</a></nav>

      <section class="slo-section" id="${id}-trace"><div class="slo-section-heading"><div><span class="micro-label">KERNEL BUSY TIME</span><h4>${e('平均值之外，再看短时峰值。')}</h4></div><p>${e('P 池均值为 27.3%，最忙的 0.5 秒桶达到 93.3%。D 池则在这段窗口内更持续地执行 kernel。')}</p></div>
        <figure class="slo-figure"><div class="slo-chart-tools"><button type="button" class="slo-peak-button">${e('查看 P 峰值桶')} · ${pct(data.bins[data.peakPBin].p)}</button></div>
          <div class="slo-legend" data-slo-legend></div><p class="diagram-hint">${e('左右滑动查看完整曲线')} <span aria-hidden="true">↔</span></p>
          <div class="diagram-scroll slo-chart-scroll" tabindex="0" aria-label="${e('忙碌率曲线，可横向滚动')}"><svg data-slo-chart viewBox="0 0 1000 390" role="img" aria-label="${e('观测窗口内 0 至 45 秒的忙碌率阶梯曲线与窗口均值')}"></svg></div>
          <label class="slo-scrubber"><span>${e('选择 0.5 秒时间桶')}</span><input type="range" min="0" max="89" step="1" value="${data.peakPBin}" aria-label="${e('选择忙碌率时间桶')}"></label>
          <div class="slo-bin-readout" aria-live="off"><div><small>${e('选中时间桶')}</small><strong data-slo-bin-time></strong></div><div><small>${e('P 池')}</small><strong data-slo-bin-p></strong></div><div><small>${e('D 池')}</small><strong data-slo-bin-d></strong></div></div>
          <figcaption class="slo-chart-caption">${e('每段线保留对应 0.5 秒桶的原值，不做平滑。右侧柱状图是整个 45 秒窗口的时间加权均值。')}</figcaption>
        </figure>
      </section>

      <section class="slo-section" id="${id}-mechanism"><div class="slo-section-heading"><div><span class="micro-label">ARRIVALS → QUEUES → HEADROOM</span><h4>${e('尾部 SLO，要求系统接住短时扎堆。')}</h4></div><p>${e('资源规划的目标是满足 TTFT 尾部约束，而不是只把 P 的平均忙碌率推高。')}</p></div>
        <figure class="slo-headroom-demo slo-figure interactive-figure"><div class="figure-heading"><span class="micro-label">${e('随机到达与 P 容量余量')}</span><span class="small-tag">${e('机制示意')}</span></div><p class="diagram-hint">${e('左右滑动查看完整图解')} <span aria-hidden="true">↔</span></p>
          <div class="diagram-scroll" tabindex="0" aria-label="${e('随机到达、排队与预留 P 容量的机制示意')}"><svg data-slo-mechanism viewBox="0 0 1000 310" role="img" aria-label="${e('预留 P 余量如何缓冲突发；不是本次运行的请求轨迹')}"></svg></div>
          <div class="stage-tabs compact-tabs" role="group" aria-label="${e('SLO 余量动画阶段')}">${steps.map((s,i)=>`<button type="button" data-step="${i}"><span>0${i+1}</span>${e(s.tab)}<i></i></button>`).join('')}</div>
          <figcaption class="figure-bottom"><div class="figure-caption"><strong data-caption-title></strong><p data-caption-body></p></div><div class="media-controls"><button class="icon-button reset-button" type="button" aria-label="${e('重播 SLO 余量动画')}">↺</button><button class="icon-button play-toggle" type="button" aria-label="${e('暂停 SLO 余量动画')}" aria-pressed="true"><svg viewBox="0 0 20 20" aria-hidden="true"><path class="play-icon" d="m7 4 9 6-9 6z"/><path class="pause-icon" d="M6 4h3v12H6zm5 0h3v12h-3z"/></svg></button></div></figcaption>
          <p class="slo-schematic-note">${e('此图解释余量与等待的关系，不复现本次路由、到达时刻或 TTFT 数值。')}</p>
        </figure>
      </section>

      <details class="slo-settings" id="${id}-settings"><summary>${e('配置、统计口径与解释范围')} <span aria-hidden="true">＋</span></summary><div class="slo-settings-body"><div><h5>${e('观测配置')}</h5><p>${e('2 个 P 实例与 1 个 D 实例，每实例 TP8，共 24 张 GPU。原始仿真窗口为 10–55 秒，共 45 秒；图中以窗口起点为 0 秒，显示 0–45 秒，按 0.5 秒分成 90 个桶。')}</p><p>${e('0.5 秒是统计桶宽，不是请求的平均到达间隔。曲线沿用包内 kernelbusytime，包含窗口内背景工作，没有重新仿真。')}</p></div><div><h5>${e('忙碌时间口径')}</h5><p>${e('单 GPU 忙碌率 = 窗口内有 kernel 执行的时间 / 窗口时长。重叠执行区间只计一次；多 GPU 以累计忙碌 GPU·s / 分配 GPU·s 汇总。')}</p><p>${e('P 池累计 196.79 / 720 GPU·s，D 池为 297.80 / 360 GPU·s，全部为 494.59 / 1080 GPU·s。')}</p></div><div class="slo-scope"><h5>${e('这组数据回答什么')}</h5><p>${e('本包提供忙碌率时间序列，没有逐请求到达时刻、TTFT 分布、SLO 阈值或不同 P 数量的对照。因此，本图不报告具体 SLO 达标率，也不将某个 P/D 配比称为最优。')}</p><p>${e('随机到达与尾部 SLO 解释了为什么资源规划需要余量；是否可以回收 P 资源，还要在同一负载下联合评估 TTFT、TPOT 与路由调度。')}</p></div></div></details>
    </article>`;
  }

  function traceDrawing(data,index) {
    const left=64,top=46,w=650,h=260,x=value=>left+(value-data.window.start)*w/data.window.duration,y=value=>top+h-value*h/100;
    let s=`<title>${e('原始 kernel 忙碌率')}</title>`;
    for(const value of [0,25,50,75,100])s+=path(`M${left} ${y(value)}H714`,value===0?'#cfc4d8':'#eee8f2')+text(51,y(value)+4,`${value}`,11,C.muted,'text-anchor="end"');
    for(let elapsed=0;elapsed<=data.window.duration;elapsed+=5)s+=text(x(data.window.start+elapsed),329,`${elapsed}`,11,C.muted,center);
    s+=text(389,360,'窗口内时间（秒）',12,C.muted,center)+text(64,26,'kernel 忙碌率（%）',12,C.muted,'',650);
    for(const [key,color] of [['p',C.p],['d',C.d]]){
      let d='';data.bins.forEach((b,i)=>{d+=(i?`V${num(y(b[key]))}`:`M${num(x(b.start))} ${num(y(b[key]))}`)+`H${num(x(b.end))}`;});
      s+=path(d,color,'stroke-width="2.3"');
    }
    for(const [key,color] of [['p',C.p],['d',C.d]])s+=path(`M${left} ${num(y(data.means[key]))}H714`,color,'stroke-width="1" stroke-dasharray="5 5" opacity=".48"');
    const selected=data.bins[index],sx=x(selected.start),sw=x(selected.end)-sx;
    s+=rect(sx,top,sw,h,C.p,'none',0,'opacity=".08"')+path(`M${num(sx+sw/2)} ${top}V306`,C.p,'stroke-width="1" stroke-dasharray="3 4"');
    s+=text(888,29,'窗口均值',13,C.ink,`${center} font-weight="600"`,190);
    for(const value of [0,50,100])s+=text(787,y(value)+4,`${value}`,10,C.muted,'text-anchor="end"');
    s+=path('M799 306H974','#d7cddd');
    [['p','P 池','16 GPU',C.p],['d','D 池','8 GPU',C.d]].forEach(([key,name,count,color],i)=>{
      const bx=832+i*74,bh=data.means[key]*h/100;
      s+=rect(bx,306-bh,36,bh,color,'none',3)+text(bx+18,298-bh,pct(data.means[key]),12,C.ink,`${center} font-weight="600"`,58)+text(bx+18,329,name,11,C.muted,center,58)+text(bx+18,349,count,10,C.muted,center);
    });
    s+=text(889,376,'时间与 GPU 数加权',10,C.muted,center,200);
    return s;
  }

  function mechanismDrawing(time,index) {
    const busy=index===1||index===2,extra=index>=2,queue=index===1?4:index===2?2:0;
    let s=`<title>${e('随机到达、排队与 P 余量的定性机制')}</title>`;
    s+=text(158,35,'随机到达（示意）',14,C.ink,center,260)+path('M40 130H335','#cfc0df','stroke-width="1.5"');
    [55,89,97,105,187,197,252].forEach((x,i)=>{s+=dot(x,130,5,index===0?'#a88ac4':'#d7c8e4');if(index===0)s+=dot(x,130+Math.sin(time*2+i)*9,2.4,C.p);});
    s+=text(155,182,'间隔不均匀',12,C.muted,center);
    s+=rect(340,85,137,90,index===1?C.amber:'#fcfafd',index===1?'#dfc49f':C.line,12)+text(408,71,'排队',15,C.ink,center);
    for(let i=0;i<4;i++)s+=rect(354+i*28,112,20,35,i<queue?'#e8cc9f':'#f3eef8',i<queue?'#c49b61':'#e7dfed',4);
    s+=path('M477 130H516V77H550M516 130V192H550','#c6b1d8','stroke-width="1.5"');
    s+=rect(550,42,144,70,busy?'#ece2f5':'#fff','#c6b1d8',12)+text(622,70,'已有 P 容量',14,C.ink,center,130)+text(622,94,busy?'执行 kernel':'等待到达',11,C.muted,center,130);
    s+=rect(550,157,144,70,extra&&busy?'#ece2f5':'#fff',extra?'#b69bcd':'#e4d9ec',12,extra?'':'stroke-dasharray="5 4"')+text(622,185,extra?'额外 P 余量':'余量不足',14,extra?C.p:C.muted,center,130)+text(622,210,extra?(busy?'执行 kernel':'等待到达'):'配置余量',11,C.muted,center,130);
    s+=path('M694 77H730V130H760',C.p,'stroke-width="1.5"');
    if(extra)s+=path('M694 192H730V130',C.p,'stroke-width="1.5"');
    s+=rect(760,87,150,87,'#faf7fc','#d9cce5',12)+text(835,121,'KV 传输',13,C.ink,center,134)+text(835,147,'首步 Decode',13,C.ink,center,134)+path('M910 130H956','#b8a0ce','stroke-width="1.5"')+dot(956,130,5,C.p)+text(953,200,'首 token',12,C.ink,center,90);
    if(busy){const p=(time*.7)%1;s+=dot(694+66*p,77+53*p,3,C.p);if(extra)s+=dot(694+36*p,192-62*p,3,C.p);}
    s+=path('M340 252V261H965V252','#d8c9e4')+text(651,291,'TTFT 包含排队、P 执行、传输和首步 D 执行',11,C.muted,center,640);
    return s;
  }

  function mount(root) {
    const data=records.get(root.id);if(!data)return;
    const svg=root.querySelector('[data-slo-chart]'),range=root.querySelector('.slo-scrubber input'),legend=root.querySelector('[data-slo-legend]');let index=data.peakPBin;
    function selectBin(value) {
      index=Math.max(0,Math.min(89,Math.round(value)));const row=data.bins[index];range.value=index;
      svg.innerHTML=traceDrawing(data,index);
      const time=`${(row.start-data.window.start).toFixed(1)}–${(row.end-data.window.start).toFixed(1)} s`;
      root.querySelector('[data-slo-bin-time]').textContent=time;
      for(const key of ['p','d'])root.querySelector(`[data-slo-bin-${key}]`).textContent=pct(row[key]);
      range.setAttribute('aria-valuetext',`${time}; P ${pct(row.p)}; D ${pct(row.d)}`);
      root.dataset.sloBin=String(index);
    }
    legend.innerHTML=`<span><i class="slo-swatch is-p"></i>${e('P 池')}</span><span><i class="slo-swatch is-d"></i>${e('D 池')}</span><span>${e('浅色虚线：窗口均值')}</span>`;
    range.addEventListener('input',()=>selectBin(Number(range.value)));
    svg.addEventListener('pointermove',event=>{const point=svg.createSVGPoint();point.x=event.clientX;point.y=event.clientY;const local=point.matrixTransform(svg.getScreenCTM().inverse());if(local.x>=64&&local.x<=714&&local.y>=46&&local.y<=306)selectBin(Math.floor((local.x-64)/650*90));});
    root.querySelector('.slo-peak-button').addEventListener('click',()=>selectBin(data.peakPBin));
    const demo=root.querySelector('.slo-headroom-demo'),drawing=demo.querySelector('[data-slo-mechanism]');
    const clock=new SimTimeline({root:demo,duration:12,steps,stillTime:7.8,draw(time,index){drawing.innerHTML=mechanismDrawing(time,index);}});
    root.querySelector(`.slo-nav a[href="#${root.id}-settings"]`).addEventListener('click',()=>{root.querySelector('.slo-settings').open=true;});
    selectBin(index);root.__slo={selectBin,clock};
  }
  window.SimCaseStudies={...(window.SimCaseStudies||{}),'prefill-slo':{render,mount,mechanismDrawing}};
})();
