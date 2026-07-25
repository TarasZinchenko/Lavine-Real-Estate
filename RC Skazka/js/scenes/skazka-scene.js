/**
 * Architectural Topography & Skyline Scene (ЖК Сказка — Холодная Гора)
 * Replaces abstract spheres with a stylized 3D Architectural Elevation Hill Mesh & Building Blueprint Grid.
 */
(function () {
  const canvas = document.getElementById('skazka-canvas') || document.getElementById('hero-canvas');
  if (!canvas) return;

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

  function initScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0D0E10, 0.018);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 4, 28);
    camera.rotation.x = -0.1;
    window.SkazkaCamera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. ELEVATION HILL MESH ("ХОЛОДНАЯ ГОРА" TOPOGRAPHY)
    const hillGeo = new THREE.PlaneGeometry(90, 60, 44, 30);
    const pos = hillGeo.attributes.position;

    // Sculpt natural hill elevation
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Gentle undulating hill height
      const z = Math.sin(x * 0.12) * Math.cos(y * 0.15) * 5.5 + Math.sin(x * 0.05) * 3.5;
      pos.setZ(i, z);
    }
    hillGeo.computeVertexNormals();

    const hillMat = new THREE.MeshBasicMaterial({
      color: 0xC5A880,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });

    const hillMesh = new THREE.Mesh(hillGeo, hillMat);
    hillMesh.rotation.x = -Math.PI / 2.3;
    hillMesh.position.set(0, -3, -2);
    scene.add(hillMesh);

    // 2. ARCHITECTURAL BUILDING BLUEPRINT WIREFRAMES (ЖК СКАЗКА TOWERS)
    const buildingsGroup = new THREE.Group();

    // Main Tower
    const b1Geo = new THREE.BoxGeometry(7, 20, 7);
    const b1Mat = new THREE.MeshBasicMaterial({ color: 0xC5A880, wireframe: true, transparent: true, opacity: 0.28 });
    const b1 = new THREE.Mesh(b1Geo, b1Mat);
    b1.position.set(12, 3, -10);
    buildingsGroup.add(b1);

    // Adjacent Block
    const b2Geo = new THREE.BoxGeometry(11, 14, 6);
    const b2Mat = new THREE.MeshBasicMaterial({ color: 0xC5A880, wireframe: true, transparent: true, opacity: 0.2 });
    const b2 = new THREE.Mesh(b2Geo, b2Mat);
    b2.position.set(-12, 1, -12);
    buildingsGroup.add(b2);

    // Background Skyline Block
    const b3Geo = new THREE.BoxGeometry(5, 12, 5);
    const b3Mat = new THREE.MeshBasicMaterial({ color: 0xa8a39a, wireframe: true, transparent: true, opacity: 0.12 });
    const b3 = new THREE.Mesh(b3Geo, b3Mat);
    b3.position.set(-2, -2, -22);
    buildingsGroup.add(b3);

    scene.add(buildingsGroup);

    // 3. ARCHITECTURAL NODES / FLOATING CITY LIGHTS
    const particleCount = 700;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 70;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 40 - 5;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0xE2D3BE,
      size: 0.35,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // GSAP Scroll Camera Interface
    window.Skazka3D = {
      setCameraProgress: function (progress) {
        camera.position.z = 32 - progress * 10;
        camera.position.y = 12 - progress * 6;
        hillMesh.rotation.z = progress * 0.15;
        buildingsGroup.rotation.y = progress * 0.25;
        particles.rotation.y = progress * 0.3;
      }
    };

    // Animation Loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle ambient drift
      hillMesh.position.y = -10 + Math.sin(elapsedTime * 0.4) * 0.4;
      buildingsGroup.rotation.y = elapsedTime * 0.04;
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    }
    animate();

    // Window Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
})();
