(() => {
  'use strict';
  const i18n = window.SimI18n, t = i18n.t;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const figures = window.SimFigures;
  figures.heroArchitecture();
  matchMedia('(max-width: 600px)').addEventListener('change',()=>figures.heroArchitecture());
  const clocks = {
    scale: figures.scale(document.getElementById('scale-demo')),
    framework: figures.framework(document.getElementById('framework-demo')),
    kernel: figures.kernel(document.getElementById('kernel-panel')),
    serving: figures.serving(document.getElementById('serving-demo'))
  };
  // Retain figure controllers for future case modules and precise inspection.
  window.SimulatorPage = { figures: clocks, version: '0.1.0' };

  const tabButtons = [...document.querySelectorAll('[data-model]')];
  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => clocks.kernel.select(button.dataset.model));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabButtons.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabButtons.length) % tabButtons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabButtons.length - 1;
      else return;
      event.preventDefault(); tabButtons[next].focus(); clocks.kernel.select(tabButtons[next].dataset.model);
    });
  });

  const constraintCaptions = {
    memory: '数据到达计算单元之前，容量与带宽都可能成为约束。',
    network: '多芯片之间的带宽、协议与拓扑，影响协同执行的效率。',
    software: '算子实现与调度策略，影响硬件能力能否被充分使用。'
  };
  figures.constraint('memory');
  document.querySelectorAll('[data-constraint]').forEach(button => button.addEventListener('click', () => {
    const kind = button.dataset.constraint;
    document.querySelectorAll('[data-constraint]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    figures.constraint(kind); document.getElementById('constraint-caption').textContent = t(constraintCaptions[kind]);
  }));

  const menu = document.querySelector('.menu-toggle'), nav = document.getElementById('main-nav');
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', t('打开页面导航')); nav.classList.remove('is-open'); }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', t(open ? '关闭页面导航' : '打开页面导航'));
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  matchMedia('(min-width: 601px)').addEventListener('change', closeMenu);

  const progress = document.querySelector('.reading-progress span'), back = document.getElementById('back-to-top');
  const chapters = [
    ['background','background'],['challenges','background'],['framework','framework'],
    ['modeling','modeling'],['serving','modeling'],['modules','framework'],['cases','cases'],['about','about']
  ];
  let scrollQueued = false;
  function onScroll() {
    scrollQueued = false;
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? Math.min(1, scrollY / total) : 0})`;
    back.hidden = scrollY < 600;
    let active = '';
    for (const [id, target] of chapters) { if (document.getElementById(id).getBoundingClientRect().top < innerHeight * .4) active = target; }
    nav.querySelectorAll('a').forEach(a => { if (a.hash === `#${active}`) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); });
  }
  addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  back.addEventListener('click', () => { scrollTo({ top:0, behavior:reduced.matches?'instant':'smooth' }); document.querySelector('.wordmark').focus({ preventScroll:true }); });
  onScroll();

  function caseList() {
    const cases = Array.isArray(window.SIMULATOR_CASES) ? window.SIMULATOR_CASES : [];
    const list = document.getElementById('case-list'), empty = document.getElementById('cases-empty'), escape = figures.escape;
    empty.hidden = cases.length > 0; list.classList.toggle('case-grid', cases.length > 0);
    const safeAsset = value => typeof value === 'string' && (/^https:\/\//.test(value) || /^assets\/[a-zA-Z0-9/_.-]+$/.test(value));
    list.innerHTML = i18n.html(cases.map((item,index) => {
      const study = window.SimCaseStudies?.[item.type];
      if (study) return study.render(item, index);
      const metrics = Array.isArray(item.metrics) ? item.metrics : [];
      const sections = Array.isArray(item.sections) ? item.sections : [];
      const id = typeof item.id === 'string' && /^[a-zA-Z0-9-]+$/.test(item.id) ? item.id : `case-${index+1}`;
      return `<article class="case-card" id="${id}"><p class="micro-label">${escape(item.kicker || `CASE ${String(index+1).padStart(2,'0')}`)}</p><h3>${escape(item.title || '')}</h3><p>${escape(item.summary || '')}</p>${metrics.length?`<div class="case-metrics">${metrics.map(m=>`<div><strong>${escape(m.value)}</strong><span>${escape(m.label)}</span></div>`).join('')}</div>`:''}${sections.length?`<details><summary>查看问题、配置与分析</summary>${sections.map(s=>`<section class="case-detail"><h4>${escape(s.title || '')}</h4><p>${escape(s.body || '')}</p>${safeAsset(s.image)?`<img src="${escape(s.image)}" alt="${escape(s.alt || s.title || '')}" loading="lazy">`:''}</section>`).join('')}</details>`:''}</article>`;
    }).join(''));
    list.querySelectorAll('[data-case-type]').forEach(root => window.SimCaseStudies?.[root.dataset.caseType]?.mount(root));
  }
  caseList();

  // Both languages use the same section IDs and figures; a language link keeps
  // the reader in the section currently on screen, including within a case.
  const languageLink = document.querySelector('.language-toggle');
  function languageTarget() {
    const target = new URL(location.href);
    if (location.protocol === 'file:') {
      target.searchParams.set('lang', i18n.lang === 'en' ? 'zh' : 'en');
    } else {
      target.searchParams.delete('lang');
      const home = new URL(i18n.lang === 'en' ? '../' : './', location.href);
      target.pathname = new URL(i18n.lang === 'en' ? './' : 'en/', home).pathname;
    }
    target.hash = location.hash;
    return target;
  }
  function updateLanguageLink() { languageLink.href = languageTarget().href; }
  languageLink.querySelector('span').textContent = i18n.lang === 'en' ? '中文' : 'English';
  languageLink.lang = languageLink.hreflang = i18n.lang === 'en' ? 'zh-CN' : 'en';
  languageLink.setAttribute('aria-label', i18n.lang === 'en' ? '切换到中文版' : 'Switch to English');
  updateLanguageLink();
  addEventListener('hashchange', updateLanguageLink);
  languageLink.addEventListener('click', () => {
    const target = languageTarget();
    const sections = [...document.querySelectorAll('main section[id], .memory-case[id], .pool-settings[id]')];
    const current = sections.filter(el => el.getBoundingClientRect().top <= innerHeight * .35 && el.getBoundingClientRect().bottom > 75).at(-1);
    if (current) target.hash = current.id;
    languageLink.href = target.href;
  });
  if (location.hash.endsWith('-settings')) document.getElementById(location.hash.slice(1))?.setAttribute('open', '');

  // Decorative background: a sparse fabric whose particles follow existing paths.
  const canvas = document.getElementById('hero-canvas'), hero = canvas.closest('section'), ctx = canvas.getContext('2d');
  let width=0,height=0,edges=[],visible=false,raf=null,previous=null,painted=-Infinity,clock=0;
  function configureCanvas() {
    const box=hero.getBoundingClientRect();width=box.width;height=box.height;
    const ratio=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);
    edges=[];
    for(let side=0;side<2;side++) for(let i=0;i<14;i++) {
      const x0=side===0?width*(.025+i*.019):width*(.73+i*.019),y0=height*.94;
      const x1=side===0?width*(-.08+i*.033):width*(.67+i*.037),y1=height*(.1+(i%4)*.025);
      edges.push({x0,y0,x1,y1,bend:(side===0?-1:1)*width*.08,offset:i*.37+side*.7});
    }
    drawCanvas();
  }
  function drawCanvas() {
    ctx.clearRect(0,0,width,height);ctx.lineWidth=.65;
    for(const e of edges) {
      const cx=(e.x0+e.x1)/2+e.bend,cy=(e.y0+e.y1)/2;
      ctx.strokeStyle='rgba(146,120,184,.13)';ctx.beginPath();ctx.moveTo(e.x0,e.y0);ctx.quadraticCurveTo(cx,cy,e.x1,e.y1);ctx.stroke();
      for(let i=1;i<=5;i++) {const p=i/6,u=1-p,x=u*u*e.x0+2*u*p*cx+p*p*e.x1,y=u*u*e.y0+2*u*p*cy+p*p*e.y1;ctx.fillStyle='rgba(146,120,184,.17)';ctx.beginPath();ctx.arc(x,y,1.1,0,Math.PI*2);ctx.fill();}
      if(!reduced.matches){const p=(clock*.052+e.offset)%1,u=1-p,x=u*u*e.x0+2*u*p*cx+p*p*e.x1,y=u*u*e.y0+2*u*p*cy+p*p*e.y1;ctx.fillStyle='rgba(143,105,184,.28)';ctx.beginPath();ctx.arc(x,y,1.8,0,Math.PI*2);ctx.fill();}
    }
  }
  function canvasTick(now) {raf=null;if(!visible||document.hidden||reduced.matches){previous=null;return;}if(previous!==null)clock+=Math.min((now-previous)/1000,.1);previous=now;if(now-painted>1000/28){drawCanvas();painted=now;}raf=requestAnimationFrame(canvasTick);}
  function scheduleCanvas() {if(raf!==null)cancelAnimationFrame(raf);raf=null;previous=null;if(visible&&!document.hidden&&!reduced.matches)raf=requestAnimationFrame(canvasTick);else drawCanvas();}
  new ResizeObserver(configureCanvas).observe(hero);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;scheduleCanvas();}).observe(hero);
  document.addEventListener('visibilitychange',scheduleCanvas);reduced.addEventListener('change',scheduleCanvas);
  addEventListener('pagehide',()=>{if(raf!==null)cancelAnimationFrame(raf);});
})();
