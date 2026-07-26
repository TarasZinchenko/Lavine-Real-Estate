/**
 * Industrial Waterfront & Loft Architecture Scene (IT-Park Manufactura V2)
 * Replaces abstract spheres with a stylized 3D River Wave Mesh & 1886 Brick Mill Blueprint.
 */
(function () {
  const canvas = document.getElementById('hero-canvas');
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
    camera.position.set(0, 10, 30);
    camera.rotation.x = -0.15;
    window.ManufacturaCamera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 1. RIVER KHARKIV WATERFRONT WAVE MESH
    const riverGeo = new THREE.PlaneGeometry(80, 45, 36, 20);
    const riverMat = new THREE.MeshBasicMaterial({
      color: 0xc5a880,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.rotation.x = -Math.PI / 2.3;
    riverMesh.position.set(0, -9, -4);
    scene.add(riverMesh);

    // 2. 1886 HISTORICAL BRICK MILL LOFT ARCHITECTURE WIREFRAME
    const millGroup = new THREE.Group();

    // Main Mill Structure
    const m1Geo = new THREE.BoxGeometry(14, 12, 8);
    const m1Mat = new THREE.MeshBasicMaterial({ color: 0xc5a880, wireframe: true, transparent: true, opacity: 0.22 });
    const m1 = new THREE.Mesh(m1Geo, m1Mat);
    m1.position.set(6, 0, -14);
    millGroup.add(m1);

    // Chimney / Tower Pillar
    const m2Geo = new THREE.CylinderGeometry(1.2, 1.8, 18, 12);
    const m2Mat = new THREE.MeshBasicMaterial({ color: 0xc5a880, wireframe: true, transparent: true, opacity: 0.25 });
    const m2 = new THREE.Mesh(m2Geo, m2Mat);
    m2.position.set(-6, 2, -16);
    millGroup.add(m2);

    scene.add(millGroup);

    // 3. AMBIENT PARTICLES
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
      color: 0xe6d3b8,
      size: 0.35,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // GSAP Scroll Interface
    window.Manufactura3D = {
      setCameraProgress: function (progress) {
        camera.position.z = 30 - progress * 10;
        riverMesh.rotation.z = progress * 0.1;
        millGroup.rotation.y = progress * 0.2;
        particles.rotation.y = progress * 0.25;
      }
    };

    // Animation Loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // River wave simulation
      const rPos = riverGeo.attributes.position;
      for (let i = 0; i < rPos.count; i++) {
        const u = rPos.getX(i);
        const v = rPos.getY(i);
        const z = Math.sin(u * 0.2 + elapsedTime * 1.5) * Math.cos(v * 0.2 + elapsedTime * 1.2) * 1.2;
        rPos.setZ(i, z);
      }
      riverGeo.computeVertexNormals();
      riverGeo.attributes.position.needsUpdate = true;

      millGroup.rotation.y = elapsedTime * 0.03;
      particles.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
})();
