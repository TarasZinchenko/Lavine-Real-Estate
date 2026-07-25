/* ===== fx.js — preloader, split-text, cursor, magnetic, scrubs ===== */
window.FX = (() => {
  const fine = window.matchMedia('(pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const lerp = (a, b, t) => a + (b - a) * t;
  let loadDone = false;

  /* ---------- split text ---------- */
  function splitChars(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    let idx = 0;
    for (const word of words) {
      const mask = document.createElement('span');
      mask.className = 'w-mask';
      const w = document.createElement('span');
      w.className = 'w';
      for (const ch of word) {
        const c = document.createElement('span');
        c.className = 'ch';
        c.textContent = ch;
        c.style.transitionDelay = (idx++ * 26) + 'ms';
        w.appendChild(c);
      }
      mask.appendChild(w);
      el.appendChild(mask);
      el.appendChild(document.createTextNode(' '));
    }
  }

  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((word, i) => {
      const w = document.createElement('span');
      w.className = 'mw';
      w.textContent = word;
      w.dataset.i = i;
      el.appendChild(w);
      el.appendChild(document.createTextNode(' '));
    });
    return words.length;
  }

  /* ---------- preloader ---------- */
  function initPreloader() {
    const pre = $('#preloader'), count = $('#preCount'), bar = $('#preBar');
    let shown = 0, targetV = 0;
    const t0 = performance.now();
    (function tick() {
      if (loadDone) targetV = 100;
      else targetV = Math.min(90, ((performance.now() - t0) / 1300) * 90);
      shown = lerp(shown, targetV, 0.12);
      const v = Math.round(shown);
      count.textContent = v;
      bar.style.transform = `scaleX(${v / 100})`;
      if (loadDone && shown > 99.4) {
        count.textContent = '100';
        bar.style.transform = 'scaleX(1)';
        setTimeout(() => {
          pre.classList.add('done');
          document.body.removeAttribute('data-loading');
          document.body.classList.add('ready');
          Scroll.refresh();
          setTimeout(() => pre.remove(), 1200);
        }, 180);
        return;
      }
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- cursor + magnetic ---------- */
  const magnets = [];
  function initCursor() {
    if (!fine) return;
    const cur = $('#cursor'), dot = $('.cursor-dot'), ring = $('.cursor-ring');
    let mx = innerWidth / 2, my = innerHeight / 2, dx = mx, dy = my, rx = mx, ry = my;
    document.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    document.addEventListener('mouseover', (e) => {
      cur.classList.toggle('hovering', !!e.target.closest('a, button, .magnetic'));
    });
    Scroll.subscribe({
      frame() {
        dx = lerp(dx, mx, 0.4); dy = lerp(dy, my, 0.4);
        rx = lerp(rx, mx, 0.16); ry = lerp(ry, my, 0.16);
        dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
        for (const m of magnets) {
          m.cx = lerp(m.cx, m.tx, 0.18);
          m.cy = lerp(m.cy, m.ty, 0.18);
          m.el.style.transform = `translate(${m.cx.toFixed(2)}px, ${m.cy.toFixed(2)}px)`;
        }
      }
    });
    $$('.magnetic').forEach((el) => {
      const m = { el, cx: 0, cy: 0, tx: 0, ty: 0, str: 12 };
      magnets.push(m);
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        m.tx = ((e.clientX - r.left) / r.width - 0.5) * m.str;
        m.ty = ((e.clientY - r.top) / r.height - 0.5) * m.str;
      });
      el.addEventListener('pointerleave', () => { m.tx = 0; m.ty = 0; });
    });
  }

  /* ---------- nav ---------- */
  function initNav() {
    const nav = $('#nav'), line = $('#progressLine');
    const burger = $('#burger'), menu = $('#mmenu');
    let last = 0;
    Scroll.subscribe({
      frame(sy) {
        nav.classList.toggle('solid', sy > 40);
        nav.classList.toggle('hidden', sy > last + 2 && sy > 160 && !menu.classList.contains('open'));
        if (sy < last - 2) nav.classList.remove('hidden');
        last = sy;
        line.style.transform = `scaleX(${Scroll.progress})`;
      }
    });
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a', menu).forEach((a) => a.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- reveals & counters ---------- */
  function initObservers() {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      }
    }, { threshold: 0.35 });
    $$('[data-split]').forEach((el) => { if (!el.closest('#prologue')) io.observe(el); });

    const fmt = (v, dec) => v.toFixed(dec).replace('.', ',');
    const cio = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        cio.unobserve(en.target);
        const row = en.target;
        const target = parseFloat(row.dataset.value);
        const dec = parseInt(row.dataset.decimals, 10);
        const b = $('.num-value b', row);
        const t0 = performance.now(), dur = 1600;
        (function cnt() {
          const t = Math.min(1, (performance.now() - t0) / dur);
          const e = 1 - Math.pow(1 - t, 3);
          b.textContent = fmt(target * e, dec);
          if (t < 1) requestAnimationFrame(cnt);
          else b.textContent = fmt(target, dec);
        })();
      }
    }, { threshold: 0.5 });
    $$('.num-row').forEach((r) => cio.observe(r));
  }

  /* ---------- scrub scenes ---------- */
  function initScrubs() {
    /* manifest — words light up one by one */
    const manifest = $('#manifest');
    const mwords = $$('.mw', manifest);
    const W = mwords.length;
    Scroll.add(manifest, (p) => {
      GL.setHeroP(Scroll.clamp(p * 1.25, 0, 1));
      const litFloat = p * 1.08 * W;
      mwords.forEach((w, i) => w.classList.toggle('lit', reduced || litFloat > i + 0.4));
    });

    /* cinema — frame grows to full-bleed */
    const cinema = $('#cinema');
    const frameEl = $('#cinemaFrame'), img = $('#cinemaImg'), cap = $('#cinemaCaption');
    const mob = window.matchMedia('(max-width: 600px)').matches;
    const iV = mob ? 30 : 26, iH = mob ? 14 : 32;
    Scroll.add(cinema, (p) => {
      const t = reduced ? 1 : Scroll.clamp(p / 0.72, 0, 1);
      const e = 1 - (t * t * (3 - 2 * t));
      const r = 6 * e;
      frameEl.style.clipPath = `inset(${(iV * e).toFixed(2)}vh ${(iH * e).toFixed(2)}vw ${(iV * e).toFixed(2)}vh ${(iH * e).toFixed(2)}vw round ${r.toFixed(1)}px)`;
      img.style.transform = `scale(${(1.28 - 0.28 * t).toFixed(3)})`;
      const co = reduced ? 1 : Scroll.clamp((p - 0.78) / 0.16, 0, 1);
      cap.style.opacity = co.toFixed(3);
      cap.style.transform = `translateY(${(30 * (1 - co)).toFixed(1)}px)`;
    });

    /* flythrough — camera + UI */
    const fly = $('#flythrough');
    const flyBar = $('#flyBar'), flyUI = $('.fly-ui'), flyTitle = $('#flyTitle'), flyCap = $('#flyCap');
    Scroll.add(fly, (p) => {
      GL.setGalP(p);
      flyBar.style.transform = `scaleX(${p})`;
    });
    let switchT;
    GL.onActive = (i, title, capText) => {
      if (flyTitle.textContent === title) return;
      flyUI.classList.add('switching');
      clearTimeout(switchT);
      switchT = setTimeout(() => {
        flyTitle.textContent = title;
        flyCap.textContent = capText;
        flyUI.classList.remove('switching');
      }, 200);
    };

    /* interior — horizontal strip */
    const strip = $('#interior');
    const track = $('#hTrack'), hIndex = $('#hIndex');
    const cards = $$('.hcard', track).length;
    let overflow = 0;
    const measureStrip = () => { overflow = Math.max(0, track.scrollWidth - window.innerWidth); };
    measureStrip();
    Scroll.subscribe({ measure: measureStrip });
    Scroll.add(strip, (p) => {
      track.style.transform = `translate3d(${(-overflow * p).toFixed(1)}px, 0, 0)`;
      const idx = Math.min(cards, 1 + Math.floor(p * cards));
      const label = String(idx).padStart(2, '0');
      if (hIndex.textContent !== label) hIndex.textContent = label;
    });

    /* location — parallax */
    const plx = $('#location'), plxImg = $('#plxImg');
    Scroll.add(plx, (p) => {
      plxImg.style.transform = `translate3d(0, ${((p - 0.5) * -14).toFixed(2)}%, 0)`;
    });
  }

  /* ---------- boot ---------- */
  return {
    init() {
      $$('[data-split]').forEach(splitChars);
      $$('#manifest .mline').forEach(splitWords);
      initPreloader();
      initCursor();
      initNav();
      initObservers();
      initScrubs();
    },
    finishLoading() { loadDone = true; }
  };
})();
