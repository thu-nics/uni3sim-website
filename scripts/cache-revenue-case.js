/* A paired parameter study of the supplied finite-cohort simulation samples. */
(() => {
  const e=value=>window.SimFigures.escape(value),t=value=>window.SimI18n.t(value);
  const C={hit:'#725298',miss:'#c49455',output:'#4f8777',ink:'#51465e',muted:'#71667c',grid:'#eee8f2'};
  const n=value=>Number(value.toFixed(3)),signed=value=>`${value>0?'+':'−'}${Math.abs(value).toFixed(1)}%`;
  const ratio=value=>`${value.toFixed(2)}×`;
  const text=(x,y,value,size=12,color=C.ink,attrs='',width)=>`<text x="${n(x)}" y="${n(y)}" font-size="${window.SimI18n.fitText(value,size,width,attrs.match(/font-weight="([^"]+)"/)?.[1]||400)}" fill="${color}" ${attrs}>${e(value)}</text>`;
  const line=(d,color=C.grid,attrs='')=>`<path d="${d}" fill="none" stroke="${color}" ${attrs}/>`;
  const circle=(x,y,r,color)=>`<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${color}"/>`;
  const center='text-anchor="middle"';
  function render(item){
    const d=window.SIMULATOR_CACHE_REVENUE_DATA,id=item.id;
    return `<article class="cache-revenue-case" id="${id}" data-case-type="cache-revenue">
      <header class="cr-header"><p class="cr-kicker">${e(item.kicker)}</p><h3>${e(item.title)}</h3><p>${e(item.summary)}</p></header>
      <nav class="cr-nav" aria-label="${e('缓存收益案例目录')}"><a href="#${id}-comparison">01 ${e('吞吐与收入')}</a><a href="#${id}-mechanism">02 ${e('计费机制')}</a><a href="#${id}-settings">03 ${e('配置与口径')}</a></nav>
      <section class="cr-section" id="${id}-comparison">
        <figure class="cr-figure"><div class="cr-toolbar"><span class="cr-normalized-label">${e('归一化：70% = 1')}</span><div class="cr-jumps" role="group" aria-label="${e('跳转到比较采样点')}"><button type="button" data-cr-target="85">85%</button><span aria-hidden="true">→</span><button type="button" data-cr-target="99">99%</button></div></div>
          <div class="cr-legend">${[['hit','缓存输入'],['miss','未缓存输入'],['output','输出']].map(([key,label])=>`<span><i style="background:${C[key]}"></i>${e(label)} <small>$${d.prices[key].toFixed(4)}</small></span>`).join('')}<em>${e('单价：USD / 百万 token')}</em><a class="cr-price-ref" href="https://bigmodel.cn/pricing" target="_blank" rel="noopener noreferrer">${e('价格参考 ↗')}</a></div>
          <div class="cr-panels">${[['throughput','同批请求的 token 吞吐'],['revenue','同批请求的收入 / GPU 小时']].map(([key,label])=>`<div class="cr-panel"><div class="cr-panel-heading"><h5>${e(label)}</h5><strong class="cr-delta ${key}">${signed(d.comparison.changes[key])}<small>85% → 99%</small></strong></div><p class="cr-mode-label" data-cr-unit="${key}"></p><p class="cr-scroll-hint">${e('横向滑动查看完整图表')} ↔</p><div class="cr-chart-scroll" tabindex="0" aria-label="${e(label)}"><svg data-cr-chart="${key}" viewBox="0 0 520 350" role="img" aria-label="${e(label)}"></svg></div></div>`).join('')}</div>
          <label class="cr-scrubber"><span>${e('选择已有采样点')}</span><input type="range" min="0" max="20" step="1" value="6" aria-label="${e('选择缓存命中率采样点')}"></label>
          <div class="cr-readouts" aria-live="off"><div><small>${e('命中率（声明）')}</small><strong data-cr-hit></strong><span data-cr-selected-hit></span></div><div><small>${e('归一化 token 吞吐')}</small><strong data-cr-throughput></strong></div><div><small>${e('归一化收入 / GPU 小时')}</small><strong data-cr-revenue></strong></div></div>
        </figure>
      </section>
      <section class="cr-section" id="${id}-mechanism"><div class="cr-section-heading"><h4>${e('吞吐更高，不一定带来更高的收入效率。')}</h4></div><div class="cr-explanation"><div><span class="micro-label">SAME TOKENS / LESS TIME</span><h5>${e('同样的 token，更快完成。')}</h5><p>${e('输入与输出 token 总数固定。85% → 99% 时，这 19 条请求的完成耗时从 25.85 秒缩短到 23.01 秒，逻辑 token 吞吐随之提高 12.3%。')}</p><div class="cr-equation"><img data-cr-equation="throughput" src="${e(window.SIM_INLINE_ASSETS?.['assets/cases/cache-revenue/throughput.svg'] || window.SimI18n.asset('assets/cases/cache-revenue/throughput.svg'))}" alt="${e('吞吐公式')}: (H + M + O) / T"></div></div><div><span class="micro-label">DIFFERENT TOKEN PRICES</span><h5>${e('缓存输入更便宜，计费结构也在改变。')}</h5><p>${e('给定费率下，缓存输入的单价为未缓存输入的四分之一。命中 token 占比增加，降低了这批请求的账单；吞吐增长未能抵消这部分下降，收入 / GPU 小时减少 21.1%。')}</p><div class="cr-equation"><img data-cr-equation="revenue" src="${e(window.SIM_INLINE_ASSETS?.['assets/cases/cache-revenue/revenue.svg'] || window.SimI18n.asset('assets/cases/cache-revenue/revenue.svg'))}" alt="${e('单位 GPU 小时收入公式')}: 3600 × (H p_H + M p_M + O p_O) / (16 × 10⁶ × T)"></div></div></div><p class="cr-variables">${e('H / M / O 分别为命中输入、未命中输入与输出 token；T 为同批请求全部完成所需的仿真秒数，p 为每百万 token 的美元单价。')}</p><p class="cr-peak-note">${e('本组已有采样的收入峰值约为 85%。收入最高的命中率随负载、请求组合及统计范围变化，并非固定值。')}</p></section>
      <details class="cr-settings" id="${id}-settings"><summary>${e('配置、计价与统计范围')} <span aria-hidden="true">＋</span></summary><div class="cr-settings-body"><div><h5>${e('仿真配置')}</h5><p>${e('GLM-5.3 FP8 解析仿真，16 × H200；P8 + D8，各 TP8，P/D 分离，C64 闭环请求。每个 8 卡节点使用独立 400 Gbit/s 网络端口；不使用 Offload。')}</p><p>${e('D-only MTP5，top1 / greedy；draft 接受率设定为 60%，seed 0。')}</p></div><div><h5>${e('固定同一批完整请求')}</h5><p>${e('生产 trace 共 182 条请求。各点只记账相同前 19 条完整请求：1,200,693 输入 token 与 7,906 输出 token，从首次准入计时到这 19 条全部完成。后续请求继续竞争资源，其 token 和收入不进入本批账本。')}</p><p>${e('GPU 小时 = 16 × 各点完成秒数 / 3600，包含同期整机分配的空闲时间。因此，这里展示有限批次的完成效率与收入效率，不将其扩写为稳态全机吞吐、全机总收入或净利润。')}</p></div><div><h5>${e('价格与币种')}</h5><p>${e('使用给定的 GLM-5.2 参考费率，仿真模型为 GLM-5.3；按 2026-11-11 的给定汇率 1 USD = 6.6707 CNY 换算为美元。三类单价显示在图例中，单位为 USD / 百万 token。')}</p></div><div><h5>${e('横轴与采样')}</h5><p>${e('横轴采用整段 182 条请求的声明命中比例，保留块对齐后的真实数值位置；选定 19 条请求的声明命中比例在读数中单列。这是给定复用分配下的仿真，不是 LRU 命中率预测。')}</p><p>${e('仅使用 70% 和 80%–99% 的 21 个已有点；没有补入 71%–79%、100% 或全预热结果。')}</p></div></div></details>
    </article>`;
  }
  function chart(data,kind,index){
    const rows=data.samples,base=rows[0][kind].total,left=54,top=28,w=432,h=238;
    const factor=base,max=kind==='throughput'?2.1:1.5;
    const ticks=kind==='throughput'?[0,.5,1,1.5,2]:[0,.5,1,1.5];
    const x=value=>left+(value-70)/29.01*w,y=value=>top+h-value/max*h;
    let s=`<title>${e(kind==='throughput'?'同批请求的 token 吞吐':'同批请求的收入 / GPU 小时')}</title><rect x="${n(x(85))}" y="${top}" width="${n(x(99)-x(85))}" height="${h}" fill="#f8f5fb"/>`;
    for(const tick of ticks)s+=line(`M${left} ${n(y(tick))}H486`,C.grid)+text(44,y(tick)+4,tick.toFixed(1),12,C.muted,'text-anchor="end"');
    for(const tick of [70,75,80,85,90,95,99])s+=text(x(tick),292,`${tick}%`,12,C.muted,center);
    s+=text(270,326,'KV Cache 命中率',13,C.muted,center,400);
    let lower=rows.map(()=>0);
    for(const key of ['hit','miss','output']){
      const upper=rows.map((row,i)=>lower[i]+row[kind][key]/factor);
      const edge=upper.map((value,i)=>`${i?'L':'M'}${n(x(rows[i].hitPct))} ${n(y(value))}`).join(' ');
      const bottom=lower.map((value,i)=>[i,value]).reverse().map(([i,value])=>`L${n(x(rows[i].hitPct))} ${n(y(value))}`).join(' ');
      s+=`<g data-cr-series="${key}"><path d="${edge} ${bottom}Z" fill="${C[key]}" fill-opacity=".23"/>`+line(edge,C[key],'stroke-width="1.7"');
      upper.forEach((value,i)=>{s+=circle(x(rows[i].hitPct),y(value),2.3,C[key]);});s+='</g>';lower=upper;
    }
    s+=line(`M${left} ${n(y(1))}H486`,'#9989ac','stroke-dasharray="4 5" stroke-width="1"');
    const row=rows[index],sx=x(row.hitPct);
    s+=line(`M${n(sx)} ${top}V266`,'#766282','stroke-dasharray="3 4" stroke-width="1"')+circle(sx,y(row[kind].total/factor),4,C.output);
    for(const target of [85,99]){
      const point=rows.find(row=>row.target===target),value=point[kind].total/factor;
      s+=text(x(point.hitPct)+(target===99?-3:0),y(value)-11,ratio(value),14,C.ink,`${target===99?'text-anchor="end"':center} font-weight="600"`,100);
    }
    return s;
  }
  function mount(root){
    const data=window.SIMULATOR_CACHE_REVENUE_DATA,range=root.querySelector('input[type=range]');let index=data.samples.findIndex(row=>row.target===85);
    function draw(){
      const row=data.samples[index],baseline=data.samples[0];range.value=index;
      for(const kind of ['throughput','revenue']){
        root.querySelector(`[data-cr-chart=${kind}]`).innerHTML=chart(data,kind,index);
        root.querySelector(`[data-cr-unit=${kind}]`).textContent=t('归一化：70% 命中率 = 1');
      }
      root.querySelector('[data-cr-hit]').textContent=`${row.target}%`;
      root.querySelector('[data-cr-selected-hit]').textContent=t('选定 19 条：')+row.selectedHitPct.toFixed(2)+'%';
      const throughput=ratio(row.throughput.total/baseline.throughput.total),revenue=ratio(row.revenue.total/baseline.revenue.total);
      root.querySelector('[data-cr-throughput]').textContent=throughput;
      root.querySelector('[data-cr-revenue]').textContent=revenue;
      range.setAttribute('aria-valuetext',`${row.target}%; ${t('归一化 token 吞吐')} ${throughput}; ${t('归一化收入 / GPU 小时')} ${revenue}`);
      root.dataset.crTarget=row.target;
      root.querySelectorAll('[data-cr-target]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.crTarget)===row.target)));
    }
    function selectSample(value){index=Math.max(0,Math.min(data.samples.length-1,Math.round(value)));draw();}
    range.addEventListener('input',()=>selectSample(Number(range.value)));
    root.querySelectorAll('[data-cr-target]').forEach(button=>button.addEventListener('click',()=>selectSample(data.samples.findIndex(row=>row.target===Number(button.dataset.crTarget)))));
    root.querySelectorAll('[data-cr-chart]').forEach(svg=>svg.addEventListener('pointermove',event=>{
      const point=svg.createSVGPoint();point.x=event.clientX;point.y=event.clientY;const local=point.matrixTransform(svg.getScreenCTM().inverse());
      if(local.x<54||local.x>486||local.y<28||local.y>266)return;
      const hit=70+(local.x-54)/432*29.01;
      const closest=data.samples.reduce((best,row,i)=>Math.abs(row.hitPct-hit)<Math.abs(data.samples[best].hitPct-hit)?i:best,0);selectSample(closest);
    }));
    root.querySelector(`.cr-nav a[href="#${root.id}-settings"]`).addEventListener('click',()=>{root.querySelector('.cr-settings').open=true;});
    root.__cacheRevenue={selectSample};draw();
  }
  window.SimCaseStudies={...(window.SimCaseStudies||{}),'cache-revenue':{render,mount}};
})();
