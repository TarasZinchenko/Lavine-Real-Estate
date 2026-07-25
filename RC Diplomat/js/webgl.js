/* ===== webgl.js — three.js scenes =====
   Scene A «Monolith»: ~40k golden particles form the tower, shimmer,
   disperse as the manifest scrubs. Mouse parallax on camera.
   Scene B «Flythrough»: camera dollies through a fogged tunnel of
   photo/video planes; scroll scrubs the dolly; HTML captions sync. */
window.GL = (() => {
  const BG = 0x0B190E;
  const GOLD = new THREE.Color(0xFFD700); // Gold for fireflies
  const GOLD_L = new THREE.Color(0xB8860B); // Dark golden rod / bronze

  const GALLERY = [
    { key: 'assets/ai_real_facade_1784983943883.jpg',  title: 'Фасад',        cap: 'Монолитный каркас, кирпич, двор без машин' },
    { key: 'assets/photo_17_2026-07-24_13-12-21.jpg', title: 'Лобби',        cap: 'Ресепшн, камень и дерево' },
    { key: 'assets/ai_real_interior_open_1784983979624.jpg', title: 'Пространство', cap: 'Свободная планировка, несущие колонны' },
    { key: 'assets/ai_real_interior_concrete_1784983999070.jpg', title: 'Свет',         cap: 'Высокие окна, бетон, тишина' },
    { key: 'assets/ai_real_loggia_1784983953753.jpg',  title: 'Лоджия',       cap: 'Панорамное остекление, парк под ногами' },
    { key: 'assets/video_tour_web.mp4', poster: 'assets/poster_tour.jpg', video: true,
      title: 'Видеотур', cap: 'Прогулка по квартире за сорок секунд' },
    { key: 'assets/ai_real_panorama_1784983961513.jpg', title: 'Панорама',     cap: 'Город до самого горизонта' },
    { key: 'assets/ai_real_panorama_1784983961513.jpg',  title: 'Горизонт',     cap: 'Высокий этаж, открытый вид' },
    { key: 'assets/video_exterior_web.mp4', poster: 'assets/poster_exterior.jpg', video: true,
      title: 'Дом снаружи', cap: 'Архитектура квартала в движении' },
    { key: 'assets/ai_real_interior_brick_1784983989437.jpg', title: 'Дипломат',     cap: 'Точка на карте Харькова' }
  ];
  const GAP = 5;          // z distance between gallery planes
  const FOCUS = 3.4;      // camera looks this far ahead

  let renderer, canvas;
  let heroScene, heroCam, heroGroup, heroMat;
  let galScene, galCam, galGroup, galDust;
  let items = [];         // { mesh, z, x, video? }
  let heroP = 0, galP = 0;
  let zone = 'hero', canvasOp = 1;
  let activeIdx = -1;
  let mouse = { x: 0, y: 0 }, smouse = { x: 0, y: 0 };
  let flyTop = 0, flyBottom = 0, manifestBottom = Infinity;
  let ready = false;

  const isMobile = window.matchMedia('(max-width: 600px)').matches;
  const DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75);
  const PARTICLES = isMobile ? 1500 : 4500;

  /* ---------- hero: particle monolith ---------- */
  function buildHero() {
    heroScene = new THREE.Scene();
    heroScene.fog = new THREE.FogExp2(BG, 0.055);
    heroCam = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    heroCam.position.set(0, 0.4, 9.5);

    const pos = new Float32Array(PARTICLES * 3);
    const dir = new Float32Array(PARTICLES * 3);
    const scl = new Float32Array(PARTICLES);
    const mix = new Float32Array(PARTICLES);

    const put = (i, x, y, z) => {
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      const len = Math.hypot(x, y * 0.4, z) || 1;
      dir[i * 3] = (x / len) * (0.6 + Math.random());
      dir[i * 3 + 1] = (y * 0.4 / len) * (0.6 + Math.random()) + 0.35;
      dir[i * 3 + 2] = (z / len) * (0.6 + Math.random());
      scl[i] = 0.4 + Math.random() * Math.random() * 1.6;
      mix[i] = Math.random();
    };

    // scattered forest fireflies / morning dew
    let added = 0;
    while (added < PARTICLES) {
      const x = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 10;
      // keep center clear for text readability
      if (Math.abs(x) < 3.5 && y > -1.5 && y < 4.5 && z > -3) continue;
      put(added++, x, y, z);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aDir', new THREE.BufferAttribute(dir, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scl, 1));
    geo.setAttribute('aMix', new THREE.BufferAttribute(mix, 1));

    heroMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uDisperse: { value: 0 },
        uSize: { value: (isMobile ? 17 : 20) * DPR },
        uColorA: { value: GOLD },
        uColorB: { value: GOLD_L },
        uGain: { value: isMobile ? 0.5 : 1.0 }
      },
      vertexShader: `
        attribute vec3 aDir;
        attribute float aScale, aMix;
        uniform float uTime, uDisperse, uSize;
        varying float vFade, vMix;
        void main() {
          vec3 p = position + aDir * uDisperse * (2.5 + aScale * 4.0);
          p.y += sin(uTime * 0.4 + position.x * 2.0) * 0.05;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float pulse = 0.4 + 0.6 * sin(uTime * 2.0 + aScale * 25.0 + position.x * 4.0);
          gl_PointSize = uSize * aScale * pulse * (10.0 / -mv.z);
          vFade = (1.0 - uDisperse * 0.85) * smoothstep(30.0, 12.0, -mv.z);
          vMix = aMix;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uColorA, uColorB;
        uniform float uGain;
        varying float vFade, vMix;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.06, d);
          gl_FragColor = vec4(mix(uColorA, uColorB, vMix) * uGain, a * vFade);
        }`
    });

    heroGroup = new THREE.Group();
    heroGroup.add(new THREE.Points(geo, heroMat));
    heroGroup.position.y = -0.2;
    heroScene.add(heroGroup);
  }

  /* ---------- gallery: flythrough tunnel ---------- */
  function coverUV(geo, imgAspect, planeAspect) {
    const uv = geo.attributes.uv;
    let sx = 1, sy = 1;
    if (imgAspect > planeAspect) sx = planeAspect / imgAspect;
    else sy = imgAspect / planeAspect;
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, 0.5 + (uv.getX(i) - 0.5) * sx, 0.5 + (uv.getY(i) - 0.5) * sy);
    }
  }

  function makePlane(texture, aspect, i, item) {
    const h = item.video ? (isMobile ? 2.0 : 2.7) : (isMobile ? 1.6 : 2.4);
    let w = h * aspect;
    w = Math.min(w, isMobile ? 3.0 : 4.4);
    const geo = new THREE.PlaneGeometry(w, h);
    coverUV(geo, aspect, w / h);
    const mat = new THREE.MeshBasicMaterial({
      map: texture, transparent: true, opacity: 0, side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geo, mat);
    const xOffset = isMobile ? 0.6 : 1.75;
    const x = item.video ? 0 : (i % 2 ? xOffset : -xOffset);
    mesh.position.set(x, item.video ? 0 : (i % 2 ? -0.12 : 0.12), -i * GAP);
    mesh.rotation.y = -x * 0.15;
    galGroup.add(mesh);
    return { mesh, z: -i * GAP, x, item, opacity: 0 };
  }

  function buildGallery() {
    galScene = new THREE.Scene();
    galScene.fog = new THREE.FogExp2(BG, 0.14);
    galCam = new THREE.PerspectiveCamera(62, 1, 0.1, 60);
    galGroup = new THREE.Group();
    galScene.add(galGroup);

    // depth dust
    const n = isMobile ? 250 : 700;
    const dp = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      dp[i * 3] = (Math.random() - 0.5) * 12;
      dp[i * 3 + 1] = (Math.random() - 0.5) * 7;
      dp[i * 3 + 2] = 4 - Math.random() * (GALLERY.length * GAP + 14);
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3));
    galDust = new THREE.Points(dGeo, new THREE.PointsMaterial({
      color: 0x9C9389, size: 0.035, transparent: true, opacity: 0.5,
      depthWrite: false, blending: THREE.AdditiveBlending
    }));
    galScene.add(galDust);

    const loader = new THREE.TextureLoader();
    const media = window.__MEDIA__ || {};
    GALLERY.forEach((item, i) => {
      if (item.video) {
        const v = document.createElement('video');
        v.src = media[item.key] || item.key;
        v.poster = media[item.poster] || item.poster;
        v.muted = true; v.loop = true; v.playsInline = true;
        v.setAttribute('playsinline', '');
        v.preload = 'metadata';
        const tex = new THREE.VideoTexture(v);
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        item.videoEl = v;
        items[i] = makePlane(tex, 9 / 16, i, item);
        return;
      }
      const src = media[item.key] || item.key;
      loader.load(src, (tex) => {
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        const img = tex.image;
        const aspect = (img && img.width) ? img.width / img.height : 1.5;
        items[i] = makePlane(tex, aspect, i, item);
      });
    });
    // placeholders so indices align before loads finish
    for (let i = 0; i < GALLERY.length; i++) items[i] = items[i] || null;
  }

  /* ---------- zones & frame ---------- */
  function measure() {
    if (!ready) return;
    const fly = document.getElementById('flythrough');
    const man = document.getElementById('manifest');
    if (fly) {
      const r = fly.getBoundingClientRect();
      flyTop = r.top + window.scrollY;
      flyBottom = flyTop + fly.offsetHeight;
    }
    if (man) {
      const r = man.getBoundingClientRect();
      manifestBottom = r.top + window.scrollY + man.offsetHeight;
    }
    resize();
  }

  function resize() {
    if (!renderer) return;
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    for (const cam of [heroCam, galCam]) {
      if (cam) { cam.aspect = aspect; cam.updateProjectionMatrix(); }
    }
    // portrait: pull hero camera back so the tower stays slender
    if (heroCam) heroCam.position.z = 9.5 * Math.max(1, 0.95 / aspect);
  }

  const easeInOut = (t) => t * t * (3 - 2 * t);

  function frame(sy, vh) {
    if (!ready) return;
    const inFly = sy >= flyTop - vh && sy <= flyBottom;
    const inHero = sy < manifestBottom;
    const t = performance.now() * 0.001;

    smouse.x += (mouse.x - smouse.x) * 0.05;
    smouse.y += (mouse.y - smouse.y) * 0.05;

    let targetOp = 0;
    if (inFly) targetOp = 1;
    else if (inHero) targetOp = 1 - heroP * 0.82;
    canvasOp += (targetOp - canvasOp) * 0.08;
    canvas.style.opacity = canvasOp.toFixed(3);

    if (inFly && galScene) {
      const p = easeInOut(galP);
      const startZ = 3.5;
      const endZ = -(GALLERY.length - 1) * GAP + 1.2;
      const camZ = startZ + (endZ - startZ) * p;
      galCam.position.z += (camZ - galCam.position.z) * 0.18;

      // gentle sway toward nearest plane
      let nearest = 0, best = Infinity;
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (!it) continue;
        const d = Math.abs(it.z - (galCam.position.z - FOCUS));
        if (d < best) { best = d; nearest = i; }
        const targetO = Scroll.clamp(1 - d / 6.2, 0, 1);
        it.opacity += (targetO - it.opacity) * 0.12;
        it.mesh.material.opacity = it.opacity;
        if (it.item.videoEl) {
          if (it.opacity > 0.25 && it.item.videoEl.paused) it.item.videoEl.play().catch(() => {});
          else if (it.opacity <= 0.05 && !it.item.videoEl.paused) it.item.videoEl.pause();
        }
      }
      const nx = items[nearest] ? items[nearest].x * 0.42 : 0;
      galCam.position.x += (nx + smouse.x * 0.35 - galCam.position.x) * 0.06;
      galCam.position.y += (smouse.y * 0.25 - galCam.position.y) * 0.06;
      galCam.lookAt(galCam.position.x * 0.6, 0, galCam.position.z - FOCUS * 2);
      galDust.rotation.z = t * 0.008;

      if (nearest !== activeIdx && best < 4) {
        activeIdx = nearest;
        if (GL.onActive) GL.onActive(nearest, GALLERY[nearest].title, GALLERY[nearest].cap);
      }
      renderer.render(galScene, galCam);
    } else if (inHero && heroScene) {
      heroMat.uniforms.uTime.value = t;
      heroMat.uniforms.uDisperse.value += (heroP - heroMat.uniforms.uDisperse.value) * 0.08;
      heroGroup.rotation.y = t * 0.07 + smouse.x * 0.4;
      heroGroup.rotation.x = smouse.y * 0.12;
      heroCam.position.x = smouse.x * 0.7;
      heroCam.position.y = 0.4 - smouse.y * 0.5;
      heroCam.lookAt(0, 0.2, 0);
      renderer.render(heroScene, heroCam);
    }
  }

  function init(canvasEl) {
    canvas = canvasEl;
    renderer = new THREE.WebGLRenderer({
      canvas, antialias: !isMobile, alpha: false, powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(DPR);
    renderer.setClearColor(BG, 1);

    buildHero();
    buildGallery();
    resize();

    window.addEventListener('pointermove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    ready = true;
    measure();
    Scroll.subscribe({ measure, frame });
  }

  return {
    init,
    setHeroP(p) { heroP = p; },
    setGalP(p) { galP = p; },
    onActive: null,
    get activeIndex() { return activeIdx; }
  };
})();
