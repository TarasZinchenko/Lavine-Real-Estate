/**
 * Three.js Scene — ЖК Сказка (Skazka) Residential Building
 * Procedural geometry: 9-story grey/white building with yellow entrance accents,
 * randomly lit windows, snow particles, night/twilight atmosphere.
 *
 * Pattern mirrors js/three-scene.js (IIFE, global THREE via CDN script tag).
 */
(function () {
  /* ---- Canvas lookup ---- */
  const canvas = document.getElementById('skazka-canvas') ||
                 document.getElementById('hero-canvas');
  if (!canvas) return;

  /* ---- Mobile detection ---- */
  const isMobile =
    window.innerWidth < 969 ||
    /Mobi|Android/i.test(navigator.userAgent) ||
    (window.innerWidth <= 1024 &&
      (('ontouchstart' in window) || navigator.maxTouchPoints > 0));

  if (isMobile) {
    canvas.style.display = 'none';
    const container = canvas.parentElement;
    if (container) {
      container.classList.add('mobile-hero-fallback');
      container.style.background =
        'linear-gradient(180deg, #0E1117 0%, #181C26 50%, #1A1C22 100%)';
      container.style.backgroundSize = 'cover';
    }
    return;
  }

  /* ---- Load Three.js (same CDN approach as three-scene.js) ---- */
  function boot() {
    if (typeof THREE !== 'undefined') {
      initScene();
    } else {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      s.onload = initScene;
      document.head.appendChild(s);
    }
  }
  boot();

  /* ================================================================
   *  SCENE INITIALISATION
   * ================================================================ */
  function initScene() {
    /* ---- Palette ---- */
    const PAL = {
      bg:       0x0E1117,
      accent:   0xE8B84B,
      body:     0xB8B8B0,
      bodyLt:   0xF0F0EC,
      entrance: 0xE8B84B,
      ground:   0x1A1C22,
      winDark:  0x2A3040,
      winLit:   0xE8B84B,
      snow:     0xFFFFFF,
    };

    /* ---- Renderer ---- */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(PAL.bg, 1);

    /* ---- Scene ---- */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PAL.bg);
    scene.fog = new THREE.FogExp2(PAL.bg, 0.018);

    /* ---- Camera ---- */
    const camera = new THREE.PerspectiveCamera(
      45, window.innerWidth / window.innerHeight, 0.1, 200
    );
    camera.position.set(4, 8, 28);
    camera.lookAt(0, 8, 0);

    /* ---- Lights ---- */
    scene.add(new THREE.AmbientLight(0xCCD0E0, 0.35));

    const moon = new THREE.DirectionalLight(0xAABBDD, 0.55);
    moon.position.set(-8, 20, 10);
    scene.add(moon);

    const warmFill = new THREE.PointLight(PAL.accent, 0.6, 40);
    warmFill.position.set(0, 2, 14);
    scene.add(warmFill);

    /* ================================================================
     *  FACADE CANVAS TEXTURE
     * ================================================================ */
    const TEX_W = 512;
    const TEX_H = 512;
    const facadeCanvas = document.createElement('canvas');
    facadeCanvas.width = TEX_W;
    facadeCanvas.height = TEX_H;
    const ctx = facadeCanvas.getContext('2d');

    /* -- Building dimensions -- */
    const BLDG_W  = 18;
    const BLDG_H  = 22;
    const BLDG_D  = 6;
    const FLOORS  = 9;
    const WIN_COLS = 6;

    /* Fraction of canvas used for main body vs entrance */
    const ENTRANCE_FRAC = 0.08;   // bottom 8 % = entrance zone
    const BODY_TOP = 0;
    const BODY_BOT = TEX_H * (1 - ENTRANCE_FRAC);
    const ENT_TOP  = BODY_BOT;
    const ENT_BOT  = TEX_H;

    /* -- Base concrete fill -- */
    ctx.fillStyle = '#B8B8B0';
    ctx.fillRect(0, 0, TEX_W, TEX_H);

    /* -- Entrance zone -- */
    ctx.fillStyle = '#D4A43D';
    ctx.fillRect(0, ENT_TOP, TEX_W, ENT_BOT - ENT_TOP);

    /* -- Floor seam lines -- */
    ctx.strokeStyle = '#9A9A92';
    ctx.lineWidth = 1;
    const floorH = (BODY_BOT - BODY_TOP) / FLOORS;
    for (let f = 1; f <= FLOORS; f++) {
      const y = BODY_TOP + f * floorH;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(TEX_W, y);
      ctx.stroke();
    }

    /* -- Window grid -- */
    const litWindows = [];            // store { col, row } of lit windows
    const HIGHLIGHT_COL = 4;          // featured apartment column (0-based)
    const HIGHLIGHT_ROW = 5;          // featured apartment row   (0-based, bottom = 0)

    const winW = TEX_W / WIN_COLS * 0.45;
    const winH = floorH * 0.50;
    const winPadX = (TEX_W / WIN_COLS - winW) / 2;
    const winPadTop = floorH * 0.22;

    for (let row = 0; row < FLOORS; row++) {
      for (let col = 0; col < WIN_COLS; col++) {
        const x = col * (TEX_W / WIN_COLS) + winPadX;
        /* row 0 = top floor on canvas (y grows down) */
        const canvasRow = row;                         // 0 = top
        const y = BODY_TOP + canvasRow * floorH + winPadTop;

        const isHighlight = (col === HIGHLIGHT_COL && row === (FLOORS - 1 - HIGHLIGHT_ROW));
        const isLit = isHighlight || Math.random() < 0.30;

        if (isLit) {
          /* warm yellow with slight random hue shift */
          const lum = 60 + Math.floor(Math.random() * 20);
          ctx.fillStyle = isHighlight ? '#F0C050' : `hsl(42, 78%, ${lum}%)`;
          litWindows.push({ col, row: canvasRow, x, y, w: winW, h: winH, highlight: isHighlight });
        } else {
          ctx.fillStyle = '#2A3040';
        }
        ctx.fillRect(x, y, winW, winH);

        /* thin frame */
        ctx.strokeStyle = '#8A8A82';
        ctx.lineWidth = 0.8;
        ctx.strokeRect(x, y, winW, winH);
      }
    }

    /* -- White panel accents (light stripes between some floors) -- */
    ctx.fillStyle = '#F0F0EC';
    for (let f = 2; f < FLOORS; f += 3) {
      const y = BODY_TOP + f * floorH - 2;
      ctx.fillRect(0, y, TEX_W, 4);
    }

    const facadeTexture = new THREE.CanvasTexture(facadeCanvas);
    facadeTexture.needsUpdate = true;

    /* ================================================================
     *  BUILDING MESH
     * ================================================================ */
    const bodyMat = new THREE.MeshStandardMaterial({
      map: facadeTexture,
      roughness: 0.85,
      metalness: 0.05,
    });

    const building = new THREE.Mesh(
      new THREE.BoxGeometry(BLDG_W, BLDG_H, BLDG_D),
      bodyMat
    );
    building.position.set(0, BLDG_H / 2, 0);
    scene.add(building);

    /* -- Flat roof parapet -- */
    const parapetMat = new THREE.MeshStandardMaterial({ color: PAL.bodyLt, roughness: 0.8 });
    const parapet = new THREE.Mesh(
      new THREE.BoxGeometry(BLDG_W + 0.4, 0.5, BLDG_D + 0.4),
      parapetMat
    );
    parapet.position.set(0, BLDG_H + 0.25, 0);
    scene.add(parapet);

    /* -- Entrance canopy -- */
    const canopyMat = new THREE.MeshStandardMaterial({
      color: PAL.entrance, roughness: 0.6, metalness: 0.15,
      emissive: PAL.entrance, emissiveIntensity: 0.15,
    });
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.2, 2.5),
      canopyMat
    );
    canopy.position.set(0, 2.6, BLDG_D / 2 + 1.0);
    scene.add(canopy);

    /* entrance pillars */
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xD0D0C8, roughness: 0.7 });
    [-1.6, 1.6].forEach(function (px) {
      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 2.6, 0.2),
        pillarMat
      );
      pillar.position.set(px, 1.3, BLDG_D / 2 + 1.0);
      scene.add(pillar);
    });

    /* -- Entrance door glow -- */
    const doorGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 2.2),
      new THREE.MeshBasicMaterial({
        color: PAL.accent, transparent: true, opacity: 0.5, side: THREE.DoubleSide,
      })
    );
    doorGlow.position.set(0, 1.2, BLDG_D / 2 + 0.05);
    scene.add(doorGlow);

    /* ================================================================
     *  HIGHLIGHTED APARTMENT — pulsing emissive overlay
     * ================================================================ */
    /* We place a small emissive plane on the front face at the highlighted window position */
    const hlNormX = (HIGHLIGHT_COL + 0.5) / WIN_COLS;  // 0..1
    const hlNormY = 1 - (HIGHLIGHT_ROW + 0.5) / FLOORS; // 0..1 from bottom
    const hlWorldX = (hlNormX - 0.5) * BLDG_W;
    const hlWorldY = hlNormY * BLDG_H;

    const hlMat = new THREE.MeshBasicMaterial({
      color: PAL.accent,
      transparent: true,
      opacity: 0.55,
      side: THREE.FrontSide,
    });
    const hlPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(BLDG_W / WIN_COLS * 0.48, BLDG_H / FLOORS * 0.52),
      hlMat
    );
    hlPlane.position.set(hlWorldX, hlWorldY, BLDG_D / 2 + 0.06);
    scene.add(hlPlane);

    /* ================================================================
     *  GROUND
     * ================================================================ */
    const groundMat = new THREE.MeshStandardMaterial({
      color: PAL.ground, roughness: 0.9, metalness: 0.05,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 80), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.05, 10);
    scene.add(ground);

    /* ================================================================
     *  PLAYGROUND — minimal shapes in front of the building
     * ================================================================ */
    const playMat = new THREE.MeshStandardMaterial({ color: 0x3A5544, roughness: 0.85 });
    /* small bench */
    const bench = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 0.6), playMat);
    bench.position.set(5, 0.15, 8);
    scene.add(bench);
    /* swing frame */
    const swingFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 2.5, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x778899, roughness: 0.6 })
    );
    swingFrame.position.set(-4, 1.25, 9);
    scene.add(swingFrame);
    const swingBar = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.08, 0.08),
      swingFrame.material
    );
    swingBar.position.set(-4, 2.5, 9);
    scene.add(swingBar);

    /* ================================================================
     *  SNOW PARTICLES
     * ================================================================ */
    const SNOW_COUNT = 200;
    const snowGeo = new THREE.BufferGeometry();
    const snowPos = new Float32Array(SNOW_COUNT * 3);
    const snowVel = [];

    for (var i = 0; i < SNOW_COUNT; i++) {
      snowPos[i * 3]     = (Math.random() - 0.5) * 50;        // x
      snowPos[i * 3 + 1] = Math.random() * 30;                 // y
      snowPos[i * 3 + 2] = (Math.random() - 0.5) * 40;        // z
      snowVel.push({
        x: (Math.random() - 0.5) * 0.004,
        y: -(Math.random() * 0.012 + 0.008),       // slow downward
        z: (Math.random() - 0.5) * 0.004,
      });
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));

    const snowMat = new THREE.PointsMaterial({
      color: PAL.snow,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const snow = new THREE.Points(snowGeo, snowMat);
    scene.add(snow);

    /* ================================================================
     *  MOUSE / TOUCH PARALLAX
     * ================================================================ */
    var mouseX = 0;
    var mouseY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;   // -1..1
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    document.addEventListener('touchmove', function (e) {
      if (e.touches.length > 0) {
        var t = e.touches[0];
        mouseX = (t.clientX / window.innerWidth - 0.5) * 1.5;
        mouseY = (t.clientY / window.innerHeight - 0.5) * 1.5;
      }
    }, { passive: true });

    /* ================================================================
     *  ANIMATION LOOP
     * ================================================================ */
    var clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();

      /* -- Camera with parallax -- */
      var camBaseX = 4 + Math.sin(t * 0.1) * 0.6;
      var camBaseY = 8 + Math.sin(t * 0.13) * 0.3;
      var camBaseZ = 28;

      camera.position.x = camBaseX + mouseX * 0.3;
      camera.position.y = camBaseY + mouseY * -0.3;
      camera.position.z = camBaseZ;
      camera.lookAt(0, 9, 0);

      /* -- Highlighted window pulse -- */
      hlMat.opacity = 0.35 + Math.sin(t * 2.5) * 0.25;

      /* -- Door glow gentle pulse -- */
      doorGlow.material.opacity = 0.35 + Math.sin(t * 1.2) * 0.15;

      /* -- Snow update -- */
      var sp = snow.geometry.attributes.position.array;
      for (var i = 0; i < SNOW_COUNT; i++) {
        sp[i * 3]     += snowVel[i].x + Math.sin(t + i) * 0.0008;
        sp[i * 3 + 1] += snowVel[i].y;
        sp[i * 3 + 2] += snowVel[i].z;

        /* recycle at ground */
        if (sp[i * 3 + 1] < -0.5) {
          sp[i * 3]     = (Math.random() - 0.5) * 50;
          sp[i * 3 + 1] = 28 + Math.random() * 4;
          sp[i * 3 + 2] = (Math.random() - 0.5) * 40;
        }
      }
      snow.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }
    animate();

    /* ================================================================
     *  RESIZE
     * ================================================================ */
    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ================================================================
     *  CLEANUP ON UNLOAD
     * ================================================================ */
    window.addEventListener('beforeunload', function () {
      renderer.dispose();
      scene.traverse(function (obj) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
      });
    });
  }
})();
