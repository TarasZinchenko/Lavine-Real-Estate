/* ===== main.js — media hydration + boot ===== */
(() => {
  function hydrate() {
    const media = window.__MEDIA__ || {};
    if (!Object.keys(media).length) return;
    for (const el of document.querySelectorAll('[src^="assets/"], [poster^="assets/"]')) {
      const src = el.getAttribute('src');
      if (src && media[src]) el.setAttribute('src', media[src]);
      const poster = el.getAttribute('poster');
      if (poster && media[poster]) el.setAttribute('poster', media[poster]);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    hydrate();
    FX.init();

    let gl = false;
    if (window.THREE) {
      try {
        GL.init(document.getElementById('gl'));
        gl = true;
      } catch (err) {
        console.warn('WebGL unavailable, fallback layout:', err);
      }
    }
    if (!gl) document.documentElement.classList.add('no-webgl');

    Scroll.init();
  });

  window.addEventListener('load', () => FX.finishLoading());
  setTimeout(() => FX.finishLoading(), 4500); // safety net
})();
