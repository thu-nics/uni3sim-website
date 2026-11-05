/* A separate clock per figure. Drawing functions are deterministic in time. */
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const t = window.SimI18n.t;
  class Timeline {
    constructor({ root, duration, steps, draw, stillTime }) {
      this.root = root; this.duration = duration; this.steps = steps; this.draw = draw;
      this.stillTime = stillTime ?? steps.at(-1).still ?? duration - .4;
      this.time = motion.matches ? this.stillTime : 0;
      this.paused = motion.matches; this.visible = false; this.raf = null; this.previous = null;
      this.stage = -1; this.lastPaint = -Infinity;
      this.playButton = root.querySelector('.play-toggle');
      this.boundTick = this.tick.bind(this);
      this.playButton?.addEventListener('click', () => { this.paused = !this.paused; this.syncButton(); this.schedule(); });
      root.querySelector('.reset-button')?.addEventListener('click', () => this.reset());
      this.bindSteps();
      new IntersectionObserver(entries => { this.visible = entries[0].isIntersecting; this.schedule(); }, { threshold: .08 }).observe(root);
      document.addEventListener('visibilitychange', () => this.schedule());
      motion.addEventListener('change', () => { this.paused = motion.matches; this.time = motion.matches ? this.stillTime : 0; this.stage = -1; this.render(); this.syncButton(); this.schedule(); });
      this.render(); this.syncButton();
    }
    bindSteps() {
      this.root.querySelectorAll('[data-step]').forEach(button => {
        button.onclick = () => this.seek(Number(button.dataset.step));
      });
    }
    seek(index) {
      const step = this.steps[index]; if (!step) return;
      this.time = step.still ?? step.at + .7; this.paused = true; this.stage = -1;
      this.render(); this.syncButton(); this.schedule();
    }
    reset() {
      this.time = motion.matches ? this.steps[0].still ?? 0 : 0;
      this.paused = motion.matches; this.stage = -1; this.render(); this.syncButton(); this.schedule();
    }
    configure({ duration, steps, stillTime }) {
      this.duration = duration; this.steps = steps; this.stillTime = stillTime ?? steps.at(-1).still ?? duration - .4;
      this.time = motion.matches ? this.stillTime : 0; this.paused = motion.matches;
      this.stage = -1; this.bindSteps(); this.render(); this.syncButton(); this.schedule();
    }
    render() {
      const index = Math.max(0, this.steps.findLastIndex(step => this.time >= step.at));
      const step = this.steps[index];
      this.root.dataset.stage = String(index);
      this.root.dataset.time = this.time.toFixed(2);
      this.root.querySelectorAll('[data-step]').forEach(button => {
        const i = Number(button.dataset.step), start = this.steps[i]?.at ?? 0;
        const end = this.steps[i + 1]?.at ?? this.duration;
        if (i === index) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
        button.style.setProperty('--step-progress', String(i < index ? 1 : i === index ? Math.max(.03, Math.min(1, (this.time - start) / (end - start))) : 0));
      });
      if (index !== this.stage) {
        this.stage = index;
        const title = this.root.querySelector('[data-caption-title]');
        const body = this.root.querySelector('[data-caption-body]');
        if (title && step.title) title.textContent = t(step.title);
        if (body && step.body) body.textContent = t(step.body);
        const counter = this.root.querySelector('[data-step-counter]');
        if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(this.steps.length).padStart(2, '0')}`;
      }
      this.draw(this.time, index);
    }
    syncButton() {
      this.root.dataset.paused = String(this.paused);
      if (!this.playButton) return;
      this.playButton.disabled = motion.matches;
      this.playButton.setAttribute('aria-pressed', String(!this.paused));
      this.playButton.setAttribute('aria-label', t(motion.matches ? '减少动态效果已开启，可使用阶段按钮查看图解' : this.paused ? '播放动画' : '暂停动画'));
      this.playButton.title = this.playButton.getAttribute('aria-label');
    }
    schedule() {
      if (this.raf !== null) cancelAnimationFrame(this.raf);
      this.raf = null; this.previous = null;
      if (!this.paused && this.visible && !document.hidden && !motion.matches) this.raf = requestAnimationFrame(this.boundTick);
    }
    tick(now) {
      this.raf = null;
      if (this.paused || !this.visible || document.hidden || motion.matches) { this.previous = null; return; }
      if (this.previous !== null) this.time = (this.time + Math.min((now - this.previous) / 1000, .12)) % this.duration;
      this.previous = now;
      if (now - this.lastPaint >= 1000 / 30) { this.render(); this.lastPaint = now; }
      this.raf = requestAnimationFrame(this.boundTick);
    }
  }
  window.SimTimeline = Timeline;
})();
