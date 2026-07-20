/**
 * Three.js Hero Scene — Stylized IT-Park Manufactura Building
 * Procedural geometry: brick wings + glass center + highlighted apartment window
 */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Mobile optimization: Skip WebGL on mobile devices/small screens and show static background image
  const isMobile = window.innerWidth <= 968 || 
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                   (window.innerWidth <= 1024 && (('ontouchstart' in window) || navigator.maxTouchPoints > 0));

  if (isMobile) {
    canvas.style.display = 'none';
    const hero = document.getElementById('hero');
    if (hero && hero.dataset.bg) {
      hero.style.backgroundImage = `url('${hero.dataset.bg}')`;
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
    }
    return;
  }

  // Load Three.js dynamically only on desktop
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = initThree;
  document.head.appendChild(script);

  function initThree() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x121212, 0.015);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 6, 22);
    camera.lookAt(0, 4, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x121212, 1);

    /* --- Lights --- */
    const ambient = new THREE.AmbientLight(0xfff0e0, 0.4);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffeedd, 0.8);
    dirLight.position.set(10, 15, 8);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0xd4a574, 1.2, 30);
    pointLight.position.set(-5, 8, 10);
    scene.add(pointLight);

    /* --- Materials --- */
    const brickMat = new THREE.MeshStandardMaterial({
      color: 0xc49a6c, roughness: 0.85, metalness: 0.05
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x3a6b8c, roughness: 0.1, metalness: 0.6,
      transparent: true, opacity: 0.75
    });
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x1a2a3a, roughness: 0.3, metalness: 0.4
    });
    const highlightMat = new THREE.MeshStandardMaterial({
      color: 0xff3333, emissive: 0xff2222, emissiveIntensity: 0.8,
      roughness: 0.3, metalness: 0.2
    });
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x2a4a3a, roughness: 0.6, metalness: 0.3,
      transparent: true, opacity: 0.6
    });

    /* --- Building geometry --- */
    // Left brick wing
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(5, 11, 4), brickMat);
    leftWing.position.set(-5.5, 5.5, 0);
    scene.add(leftWing);

    // Right brick wing
    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(5, 11, 4), brickMat);
    rightWing.position.set(5.5, 5.5, 0);
    scene.add(rightWing);

    // Center glass section
    const glassCenter = new THREE.Mesh(new THREE.BoxGeometry(6, 12, 3.8), glassMat);
    glassCenter.position.set(0, 6, 0);
    scene.add(glassCenter);

    /* --- Windows grid (left wing) --- */
    function addWindows(parentX, cols, rows, offsetY) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const w = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.1), windowMat);
          w.position.set(
            parentX - (cols - 1) * 0.5 + c * 1.0,
            offsetY + r * 1.1,
            2.01
          );
          scene.add(w);
        }
      }
    }
    addWindows(-5.5, 4, 9, 1.5);
    addWindows(5.5, 4, 9, 1.5);

    /* --- Glass grid lines --- */
    for (let i = 0; i < 11; i++) {
      const hLine = new THREE.Mesh(
        new THREE.BoxGeometry(5.8, 0.03, 0.05),
        new THREE.MeshBasicMaterial({ color: 0x556677 })
      );
      hLine.position.set(0, 1 + i * 1.0, 1.95);
      scene.add(hLine);
    }
    for (let i = 0; i < 6; i++) {
      const vLine = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 11.5, 0.05),
        new THREE.MeshBasicMaterial({ color: 0x556677 })
      );
      vLine.position.set(-2.5 + i * 1.0, 5.75, 1.95);
      scene.add(vLine);
    }

    /* --- Highlighted apartment window (red frame) --- */
    const hlFrame = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.15), highlightMat);
    hlFrame.position.set(4.0, 4.8, 1.98);
    scene.add(hlFrame);
    // inner dark
    const hlInner = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.75, 0.05),
      new THREE.MeshBasicMaterial({ color: 0x0a1520 })
    );
    hlInner.position.set(4.0, 4.8, 2.1);
    scene.add(hlInner);

    /* --- Ground / Water --- */
    const water = new THREE.Mesh(new THREE.PlaneGeometry(60, 20), groundMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -0.1, 8);
    scene.add(water);

    /* --- Historic mill (small building on left) --- */
    const mill = new THREE.Mesh(
      new THREE.BoxGeometry(3, 6, 3),
      new THREE.MeshStandardMaterial({ color: 0x7a4a2a, roughness: 0.9 })
    );
    mill.position.set(-10, 3, 0);
    scene.add(mill);
    // chimney
    const chimney = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.25, 4, 8),
      new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8 })
    );
    chimney.position.set(-9, 8, 0);
    scene.add(chimney);

    /* --- Particles --- */
    const particleCount = 300;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      velocities.push({ x: (Math.random() - 0.5) * 0.005, y: Math.random() * 0.008 + 0.002, z: (Math.random() - 0.5) * 0.005 });
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xd4a574, size: 0.08, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* --- Mouse & Touch parallax --- */
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseX = (touch.clientX / window.innerWidth - 0.5) * 1.5;
        mouseY = (touch.clientY / window.innerHeight - 0.5) * 1.5;
      }
    }, { passive: true });

    /* --- Animation --- */
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      const aspect = window.innerWidth / window.innerHeight;
      const aspectFactor = aspect < 1 ? (1 + (1 - aspect) * 0.8) : 1;

      // Camera orbit
      const baseX = Math.sin(t * 0.12) * (aspect < 1 ? 1.0 : 3.0);
      const baseZ = (22 + Math.cos(t * 0.08) * 2) * aspectFactor;
      
      camera.position.x = baseX + mouseX * (aspect < 1 ? 0.8 : 1.5);
      camera.position.y = 5.5 + mouseY * -0.6 + Math.sin(t * 0.15) * 0.3;
      camera.position.z = baseZ;
      camera.lookAt(0, 5, 0);

      // Highlight pulse
      hlFrame.material.emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.4;

      // Particles
      const pos = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;
        if (pos[i * 3 + 1] > 20) {
          pos[i * 3 + 1] = 0;
          pos[i * 3] = (Math.random() - 0.5) * 40;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Water shimmer
      water.material.opacity = 0.5 + Math.sin(t * 0.5) * 0.1;

      renderer.render(scene, camera);
    }
    animate();

    /* --- Resize --- */
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
})();
