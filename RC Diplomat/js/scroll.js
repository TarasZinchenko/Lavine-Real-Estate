/* ===== scroll.js — central rAF scroll engine =====
   Native scroll (mobile-safe) + lerped smooth value that drives
   all scrubbed animations. Sections register handlers receiving
   progress 0..1 through their height. Sticky CSS does the pinning. */
window.Scroll = (() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const EASE = reduced ? 1 : (isMobile ? 0.12 : 0.095);

  let sy = 0;            // smoothed scroll
  let target = 0;        // real scroll
  let vh = window.innerHeight;
  let docH = 0;
  const handlers = [];   // { el, fn, top, height }
  const subs = [];       // objects with optional measure() / frame(sy, vh)

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function measure() {
    vh = window.innerHeight;
    docH = document.documentElement.scrollHeight;
    for (const h of handlers) {
      const r = h.el.getBoundingClientRect();
      h.top = r.top + window.scrollY;
      h.height = h.el.offsetHeight;
    }
    for (const s of subs) if (s.measure) s.measure();
  }

  function loop() {
    target = window.scrollY;
    sy += (target - sy) * EASE;
    if (Math.abs(target - sy) < 0.08) sy = target;

    for (const h of handlers) {
      const total = h.height - vh;
      const p = total > 0
        ? clamp((sy - h.top) / total, 0, 1)
        : (sy >= h.top ? 1 : 0);
      h.fn(p, sy);
    }
    for (const s of subs) if (s.frame) s.frame(sy, vh);
    requestAnimationFrame(loop);
  }

  let resizeT;
  function onResize() {
    clearTimeout(resizeT);
    resizeT = setTimeout(measure, 120);
  }

  return {
    reduced,
    clamp,
    init() {
      measure();
      window.addEventListener('resize', onResize);
      window.addEventListener('load', measure);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
      requestAnimationFrame(loop);
    },
    refresh: measure,
    add(el, fn) {
      const h = { el, fn, top: 0, height: 0 };
      handlers.push(h);
      const r = el.getBoundingClientRect();
      h.top = r.top + window.scrollY;
      h.height = el.offsetHeight;
      return h;
    },
    subscribe(obj) { subs.push(obj); },
    get y() { return sy; },
    get vh() { return vh; },
    get progress() { return docH > vh ? clamp(sy / (docH - vh), 0, 1) : 0; }
  };
})();
