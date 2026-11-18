/**
 * AREN VALE HERO & 3D BEND CAROUSEL ENGINE
 * Recreates the exact Bend Loader preloader and 3D curved perspective ribbon
 * from arenvale.framer.photos
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. AREN VALE BEND LOADER PRELOADER
  // --------------------------------------------------------------------------
  const loaderEl = document.getElementById('arenvale-loader');
  const loaderImg = document.getElementById('arenvale-loader-img');
  const loaderCounter = document.getElementById('arenvale-counter');

  const montageImages = [
    'assets/slide_10_1.jpg',
    'assets/slide_5_1.jpg',
    'assets/mulaqaat_ep1.jpg',
    'assets/slide_7_1.jpg',
    'assets/slide_13_1.jpg',
    'assets/slide_6_1.jpg',
    'assets/slide_8_1.jpg',
    'assets/yt_anupam_kher.jpg',
    'assets/slide_10_2.jpg',
    'assets/slide_5_2.jpg',
    'assets/mulaqaat_ep2.jpg',
    'assets/slide_1_1.jpg'
  ];

  let montageIdx = 0;
  const montageInterval = setInterval(() => {
    if (!loaderImg) return;
    montageIdx = (montageIdx + 1) % montageImages.length;
    loaderImg.src = montageImages[montageIdx];
  }, 68);

  let currentCount = 0;
  const countInterval = setInterval(() => {
    currentCount += Math.floor(Math.random() * 8) + 5;
    if (currentCount >= 100) {
      currentCount = 100;
      if (loaderCounter) loaderCounter.textContent = '100';
      clearInterval(countInterval);
      clearInterval(montageInterval);

      setTimeout(() => {
        if (loaderEl) loaderEl.classList.add('is-loaded');
      }, 150);
    } else {
      if (loaderCounter) {
        loaderCounter.textContent = currentCount < 10 ? `00${currentCount}` : (currentCount < 100 ? `0${currentCount}` : `${currentCount}`);
      }
    }
  }, 32);

  // --------------------------------------------------------------------------
  // 2. THEME SWITCHER SYNC (Light Gallery vs Dark Galaxy)
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('arenvale-theme-toggle');
  let isDark = localStorage.getItem('arenvale-theme') === 'dark';

  function setTheme(dark) {
    isDark = dark;
    if (dark) {
      document.body.classList.add('dark-theme');
      if (themeToggle) themeToggle.textContent = '☀ LIGHT';
      localStorage.setItem('arenvale-theme', 'dark');
      if (renderer) renderer.setClearColor(0x050608, 1);
    } else {
      document.body.classList.remove('dark-theme');
      if (themeToggle) themeToggle.textContent = '☾ DARK';
      localStorage.setItem('arenvale-theme', 'light');
      if (renderer) renderer.setClearColor(0xffffff, 1);
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => setTheme(!isDark));
  }

  // --------------------------------------------------------------------------
  // 3. 3D BEND CAROUSEL RIBBON (Three.js WebGL)
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('bend-carousel-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 10, 5000);
  camera.position.set(0, 0, 950);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Initialize clear color
  setTheme(isDark);

  // Project cards data for the 3D ribbon
  const ribbonProjects = [
    { title: 'High-Fashion Editorial Portrait', cat: 'Haute Couture', src: 'assets/slide_10_1.jpg', year: '2024' },
    { title: 'Anupam Kher Unfiltered — KIFF Masterclass', cat: 'Celebrity Masterclass', src: 'assets/yt_anupam_kher.jpg', videoId: 'Sh0jTGE660o', year: '2024' },
    { title: 'Mulaqaat | Episode 1: Sab Badhiya Hai', cat: 'Taana Baana Series', src: 'assets/mulaqaat_ep1.jpg', reelUrl: 'https://www.instagram.com/taana__baana_/reel/DevZG4rhivG/', year: '2024' },
    { title: 'Sculptural Rim Lighting', cat: 'Studio Lighting', src: 'assets/slide_5_1.jpg', year: '2024' },
    { title: 'Songti Film Production Still', cat: 'Cinematography', src: 'assets/slide_7_1.jpg', year: '2024' },
    { title: 'Deep Monochrome Contrast', cat: 'Monochrome', src: 'assets/slide_13_1.jpg', year: '2024' },
    { title: 'Natural Daylight Mood', cat: 'Mood & Styling', src: 'assets/slide_6_1.jpg', year: '2024' },
    { title: 'Contemporary Haute Couture', cat: 'Editorial', src: 'assets/slide_10_2.jpg', year: '2024' },
    { title: 'Saurabh Shukla — Screenwriting', cat: 'Celebrity Masterclass', src: 'assets/yt_saurabh_shukla.jpg', videoId: 'ojgap437XT8', year: '2024' },
    { title: 'Organic Daylight Reflections', cat: 'Ambient Light', src: 'assets/slide_8_1.jpg', year: '2024' },
    { title: 'Mulaqaat | Episode 2', cat: 'Taana Baana Series', src: 'assets/mulaqaat_ep2.jpg', reelUrl: 'https://www.instagram.com/taana__baana_/reel/De3Hg0VBuUY/', year: '2024' },
    { title: 'Dramatic Chiaroscuro Form', cat: 'Studio Lighting', src: 'assets/slide_5_2.jpg', year: '2024' }
  ];

  const CARD_WIDTH = 340;
  const CARD_HEIGHT = 460;
  const CARD_SPACING = 390;
  const TOTAL_LENGTH = ribbonProjects.length * CARD_SPACING;

  // Create curved plane geometry
  function createCurvedCardGeometry(w, h) {
    const geom = new THREE.PlaneGeometry(w, h, 16, 8);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // Subtle inward cylindrical bending
      pos.setZ(i, -(x * x) * 0.00028);
    }
    geom.computeVertexNormals();
    return geom;
  }

  const cardGeom = createCurvedCardGeometry(CARD_WIDTH, CARD_HEIGHT);
  const textureLoader = new THREE.TextureLoader();
  const cardMeshes = [];

  ribbonProjects.forEach((proj, idx) => {
    const texture = textureLoader.load(proj.src);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;

    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(cardGeom, mat);
    mesh.userData = {
      project: proj,
      index: idx
    };

    scene.add(mesh);
    cardMeshes.push(mesh);
  });

  // --------------------------------------------------------------------------
  // 4. RIBBON UNDULATING S-CURVE MATH & PHYSICS
  // --------------------------------------------------------------------------
  let scrollOffset = 0;
  let scrollVelocity = 0;
  let isDragging = false;
  let prevPointerX = 0;
  let dragDist = 0;

  function updateRibbonPositions() {
    cardMeshes.forEach(mesh => {
      const idx = mesh.userData.index;

      // Virtual position along loop
      let virtualX = (idx * CARD_SPACING - scrollOffset) % TOTAL_LENGTH;
      if (virtualX < 0) virtualX += TOTAL_LENGTH;

      // Shift to centered coordinate range [-TOTAL_LENGTH/2, TOTAL_LENGTH/2]
      let centeredX = virtualX;
      if (centeredX > TOTAL_LENGTH / 2) centeredX -= TOTAL_LENGTH;

      // Map to screen normalized space t in [0, 1]
      const screenSpan = 2100;
      const t = (centeredX + screenSpan * 0.5) / screenSpan;

      if (t < -0.15 || t > 1.15) {
        mesh.visible = false;
      } else {
        mesh.visible = true;

        // Parametric Aren Vale curve:
        // Left (t=0): lower, pushed back Z, smaller scale
        // Center (t=0.5): rising, mid-depth
        // Right (t=1): sweeping up, flaring forward Z, large scale
        const clampedT = Math.max(0, Math.min(1, t));

        const posX = centeredX;
        const posY = -60 + 120 * Math.pow(clampedT, 1.8) + 60 * Math.sin(clampedT * Math.PI);
        const posZ = -450 + 700 * Math.pow(clampedT, 1.4);
        const scaleVal = 0.55 + 0.85 * Math.pow(clampedT, 1.3);

        mesh.position.set(posX, posY, posZ);
        mesh.scale.set(scaleVal, scaleVal, 1);

        mesh.rotation.y = -0.35 + 0.70 * clampedT;
        mesh.rotation.z = -0.08 + 0.22 * Math.pow(clampedT, 1.5);
      }
    });
  }

  // Interaction Listeners
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredMesh = null;

  function onPointerDown(e) {
    if (e.clientY < 60 || e.clientY > window.innerHeight - 60) return; // ignore clicks on header/footer
    isDragging = true;
    prevPointerX = e.clientX;
    dragDist = 0;
  }

  function onPointerMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (isDragging) {
      const deltaX = e.clientX - prevPointerX;
      dragDist += Math.abs(deltaX);
      scrollVelocity = deltaX * 1.6;
      scrollOffset -= scrollVelocity;
      prevPointerX = e.clientX;
    } else {
      // Raycasting for hover
      raycaster.setFromCamera(mouse, camera);
      const visibleMeshes = cardMeshes.filter(m => m.visible);
      const intersects = raycaster.intersectObjects(visibleMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hoveredMesh !== hit) {
          hoveredMesh = hit;
          canvas.style.cursor = 'pointer';
        }
      } else {
        if (hoveredMesh) {
          hoveredMesh = null;
          canvas.style.cursor = 'grab';
        }
      }
    }
  }

  function onPointerUp(e) {
    isDragging = false;
    if (dragDist < 6) {
      raycaster.setFromCamera(mouse, camera);
      const visibleMeshes = cardMeshes.filter(m => m.visible);
      const intersects = raycaster.intersectObjects(visibleMeshes);
      if (intersects.length > 0) {
        openProjectModal(intersects[0].object.userData.project);
      }
    }
  }

  function onWheel(e) {
    // Horizontal and vertical scrolling drives the ribbon
    const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.85;
    scrollOffset += delta;
  }

  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  canvas.addEventListener('wheel', onWheel, { passive: true });

  // Touch handlers
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) onPointerDown(e.touches[0]);
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) onPointerMove(e.touches[0]);
  }, { passive: true });

  canvas.addEventListener('touchend', (e) => {
    onPointerUp(e);
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 5. ANIMATION LOOP
  // --------------------------------------------------------------------------
  function animate() {
    requestAnimationFrame(animate);

    if (!isDragging) {
      // Exponential velocity decay
      scrollVelocity *= 0.93;
      scrollOffset -= scrollVelocity;

      // Ambient forward drift when idle
      if (Math.abs(scrollVelocity) < 0.05) {
        scrollOffset += 0.35;
      }
    }

    updateRibbonPositions();
    renderer.render(scene, camera);
  }

  animate();

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onResize);

  // --------------------------------------------------------------------------
  // 6. PROJECT MODAL (4K Masterclasses & Stills)
  // --------------------------------------------------------------------------
  const modal = document.getElementById('cosmos-lightbox');
  const modalImg = document.getElementById('lightbox-img');
  const modalVideo = document.getElementById('lightbox-video');
  const modalTitle = document.getElementById('lightbox-title');

  function openProjectModal(proj) {
    if (!modal) {
      // Redirect to work.html if on standalone
      window.location.href = 'work.html';
      return;
    }

    if (modalTitle) modalTitle.textContent = proj.title;

    if (proj.videoId) {
      if (modalImg) modalImg.style.display = 'none';
      if (modalVideo) {
        modalVideo.style.display = 'block';
        modalVideo.innerHTML = `
          <iframe 
            src="https://www.youtube-nocookie.com/embed/${proj.videoId}?autoplay=1&rel=0" 
            title="${proj.title}"
            style="width: 100%; height: 100%; border-radius: 8px; border: none;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        `;
      }
    } else if (proj.reelUrl) {
      if (modalImg) modalImg.style.display = 'none';
      if (modalVideo) {
        modalVideo.style.display = 'block';
        modalVideo.innerHTML = `
          <iframe 
            src="${proj.reelUrl}embed/" 
            title="${proj.title}"
            scrolling="no"
            style="width: 100%; max-width: 380px; height: 520px; border-radius: 8px; border: none; margin: auto; display: block;"
            allowtransparency="true"
            allowfullscreen>
          </iframe>
        `;
      }
    } else {
      if (modalVideo) {
        modalVideo.style.display = 'none';
        modalVideo.innerHTML = '';
      }
      if (modalImg) {
        modalImg.style.display = 'block';
        modalImg.src = proj.src;
        modalImg.alt = proj.title;
      }
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

});
