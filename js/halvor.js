/**
 * HALVOR 3D SPHERE GALLERY & EDITORIAL ARCHIVE ENGINE
 * Recreates the exact 3D curved sphere canvas and Swiss editorial archive of Halvor
 * (https://halvor.framer.website)
 */

document.addEventListener('DOMContentLoaded', async () => {

  // --------------------------------------------------------------------------
  // 1. DATA INITIALIZATION
  // --------------------------------------------------------------------------
  let works = [];
  try {
    const res = await fetch('js/works_data.json');
    works = await res.json();
  } catch (e) {
    console.error('Failed to load works_data.json, falling back', e);
  }

  if (!works || works.length === 0) {
    works = [
      { no: '001', title: 'High-Fashion Editorial Portrait', cat: 'High-Fashion Editorial', format: 'High-Res Still', year: '2024', src: 'assets/slide_10_1.jpg' },
      { no: '002', title: 'Anupam Kher Unfiltered', cat: 'Celebrity Masterclass', format: '4K Video', year: '2024', src: 'assets/yt_anupam_kher.jpg', videoId: 'Sh0jTGE660o' },
      { no: '003', title: 'Mulaqaat | Episode 1: Sab Badhiya Hai', cat: 'Taana Baana Series', format: 'Episodic Reel', year: '2024', src: 'assets/mulaqaat_ep1.jpg', reelUrl: 'https://www.instagram.com/taana__baana_/reel/DevZG4rhivG/' },
      { no: '004', title: 'Sculptural Rim Lighting', cat: 'Studio Lighting Series', format: 'High-Res Still', year: '2024', src: 'assets/slide_5_1.jpg' },
      { no: '005', title: 'Songti Film Production Still', cat: 'Cinematography Stills', format: 'High-Res Still', year: '2024', src: 'assets/slide_7_1.jpg' },
      { no: '006', title: 'Deep Monochrome Contrast', cat: 'Monochromes & Tone', format: 'High-Res Still', year: '2024', src: 'assets/slide_13_1.jpg' }
    ];
  }

  // --------------------------------------------------------------------------
  // 2. LIVE CLOCK (Mumbai / Global Time)
  // --------------------------------------------------------------------------
  const clockEl = document.getElementById('live-clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    // Format to 12-hour time with AM/PM
    const timeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    clockEl.textContent = `MUMBAI ${timeStr}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --------------------------------------------------------------------------
  // 3. THEME TOGGLE (Light Halvor vs Dark Universe)
  // --------------------------------------------------------------------------
  const themeBtn = document.getElementById('theme-toggle');
  let isDarkTheme = localStorage.getItem('halvor-theme') === 'dark';

  function applyTheme(dark) {
    isDarkTheme = dark;
    if (dark) {
      document.body.classList.add('dark-theme');
      if (themeBtn) themeBtn.textContent = '☀ LIGHT';
      localStorage.setItem('halvor-theme', 'dark');
      if (renderer) renderer.setClearColor(0x050608, 1);
    } else {
      document.body.classList.remove('dark-theme');
      if (themeBtn) themeBtn.textContent = '☾ DARK';
      localStorage.setItem('halvor-theme', 'light');
      if (renderer) renderer.setClearColor(0xffffff, 1);
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => applyTheme(!isDarkTheme));
  }

  // --------------------------------------------------------------------------
  // 4. TAB NAVIGATION SWITCHER (3D GALLERY vs WORKS ARCHIVE)
  // --------------------------------------------------------------------------
  const tabGallery = document.getElementById('tab-gallery');
  const tabWorks = document.getElementById('tab-works');
  const galleryView = document.getElementById('gallery-view');
  const worksView = document.getElementById('works-view');
  const bottomBar = document.getElementById('halvor-bottom-container');

  function switchView(viewName) {
    if (viewName === 'works') {
      if (tabGallery) tabGallery.classList.remove('active');
      if (tabWorks) tabWorks.classList.add('active');
      if (galleryView) galleryView.classList.add('is-hidden');
      if (worksView) worksView.classList.add('is-visible');
      if (bottomBar) bottomBar.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (tabWorks) tabWorks.classList.remove('active');
      if (tabGallery) tabGallery.classList.add('active');
      if (worksView) worksView.classList.remove('is-visible');
      if (galleryView) galleryView.classList.remove('is-hidden');
      if (bottomBar) bottomBar.style.display = 'flex';
      if (renderer) onWindowResize();
    }
  }

  if (tabGallery) tabGallery.addEventListener('click', () => switchView('gallery'));
  if (tabWorks) tabWorks.addEventListener('click', () => switchView('works'));

  // --------------------------------------------------------------------------
  // 5. POPULATE WORKS ARCHIVE TABLE
  // --------------------------------------------------------------------------
  const worksTableBody = document.getElementById('works-table-body');
  const hoverPreview = document.getElementById('hover-preview');
  const hoverPreviewImg = document.getElementById('hover-preview-img');

  if (worksTableBody) {
    works.forEach(item => {
      const row = document.createElement('div');
      row.className = 'work-table-row';
      const videoTag = item.videoId || item.reelUrl ? '<span class="row-video-tag">▶ VIDEO</span>' : '';
      row.innerHTML = `
        <span class="row-no">${item.no}</span>
        <span class="row-title">${item.title} ${videoTag}</span>
        <span class="row-cat row-muted">${item.cat}</span>
        <span class="row-format row-muted">${item.format}</span>
        <span class="row-year row-muted">${item.year}</span>
      `;

      row.addEventListener('mouseenter', () => {
        if (hoverPreview && hoverPreviewImg) {
          hoverPreviewImg.src = item.src;
          hoverPreview.classList.add('is-active');
        }
      });

      row.addEventListener('mouseleave', () => {
        if (hoverPreview) {
          hoverPreview.classList.remove('is-active');
        }
      });

      row.addEventListener('mousemove', (e) => {
        if (hoverPreview) {
          hoverPreview.style.left = `${e.clientX + 16}px`;
          hoverPreview.style.top = `${e.clientY + 16}px`;
        }
      });

      row.addEventListener('click', () => {
        openModal(item);
      });

      worksTableBody.appendChild(row);
    });
  }

  // --------------------------------------------------------------------------
  // 6. THREE.JS 3D CURVED SPHERE / CYLINDER GALLERY
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('sphere-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    console.warn('Canvas or THREE.js not available');
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 10, 5000);
  camera.position.set(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Set initial clear color based on theme
  applyTheme(isDarkTheme);

  // Group containing the curved card sphere
  const sphereGroup = new THREE.Group();
  scene.add(sphereGroup);

  // Curvature radius
  const RADIUS = 880;
  const CARD_WIDTH = 280;
  const CARD_HEIGHT = 210;

  // Create curved plane geometry matching cylinder radius
  function createCurvedGeometry(width, height, radius) {
    const geom = new THREE.PlaneGeometry(width, height, 16, 1);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const alpha = x / radius;
      pos.setX(i, radius * Math.sin(alpha));
      pos.setZ(i, radius * (Math.cos(alpha) - 1));
    }
    geom.computeVertexNormals();
    return geom;
  }

  const curvedGeometry = createCurvedGeometry(CARD_WIDTH, CARD_HEIGHT, RADIUS);
  const textureLoader = new THREE.TextureLoader();
  const cardMeshes = [];

  // Arrange in 3 horizontal tiers (Top: +280, Center: 0, Bottom: -280)
  const tiers = [
    { y: 280, count: 14 },
    { y: 0,   count: 16 },
    { y: -280, count: 14 }
  ];

  let itemIdx = 0;
  tiers.forEach((tier, tierIdx) => {
    const angleStep = (Math.PI * 2) / tier.count;
    // Slight offset for alternating brick layout
    const tierOffset = tierIdx % 2 === 1 ? angleStep * 0.5 : 0;

    for (let i = 0; i < tier.count; i++) {
      const item = works[itemIdx % works.length];
      itemIdx++;

      const angle = i * angleStep + tierOffset;

      // Load texture with mipmapping
      const texture = textureLoader.load(item.src);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(curvedGeometry, material);

      // Position on cylinder
      mesh.position.x = RADIUS * Math.sin(angle);
      mesh.position.z = RADIUS * Math.cos(angle);
      mesh.position.y = tier.y;

      // Face towards camera (center 0,0,0)
      mesh.rotation.y = angle + Math.PI;

      // Attach metadata
      mesh.userData = {
        item: item,
        angle: angle,
        y: tier.y,
        baseScale: 1.0,
        tierIdx: tierIdx,
        indexInTier: i
      };

      sphereGroup.add(mesh);
      cardMeshes.push(mesh);
    }
  });

  // --------------------------------------------------------------------------
  // 7. INTERACTION PHYSICS & ORBIT DRAG
  // --------------------------------------------------------------------------
  let isDragging = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let rotY = 0;
  let rotX = 0;
  let targetRotY = 0;
  let targetRotX = 0;
  let dragDistance = 0;

  // Active Focus Mode State
  let isFocusMode = false;
  let focusedMesh = null;
  let focusTargetRotY = 0;
  let focusTargetRotX = 0;
  let focusCameraZ = 0;
  let targetCameraZ = 0;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredMesh = null;

  const watermarkEl = document.getElementById('center-watermark');
  const instructionEl = document.getElementById('gallery-instruction');
  const activeToolbar = document.getElementById('active-toolbar');
  const focusTitleEl = document.getElementById('focus-title');
  const focusCatEl = document.getElementById('focus-cat');

  function onPointerDown(e) {
    if (isFocusMode && e.clientY > window.innerHeight - 70) return; // ignore clicks on bottom bar
    isDragging = true;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
    dragDistance = 0;
  }

  function onPointerMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (isDragging) {
      const deltaX = e.clientX - prevPointerX;
      const deltaY = e.clientY - prevPointerY;
      dragDistance += Math.abs(deltaX) + Math.abs(deltaY);

      if (!isFocusMode) {
        targetRotY += deltaX * 0.0028;
        targetRotX += deltaY * 0.002;
        targetRotX = Math.max(-0.25, Math.min(0.25, targetRotX));
      }

      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    } else if (!isFocusMode) {
      // Raycast to hover card
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cardMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hoveredMesh !== hit) {
          if (hoveredMesh) hoveredMesh.scale.set(1, 1, 1);
          hoveredMesh = hit;
          hoveredMesh.scale.set(1.04, 1.04, 1.04);
          canvas.style.cursor = 'pointer';
        }
      } else {
        if (hoveredMesh) {
          hoveredMesh.scale.set(1, 1, 1);
          hoveredMesh = null;
          canvas.style.cursor = 'grab';
        }
      }
    }
  }

  function onPointerUp(e) {
    isDragging = false;
    // If was a click (not a drag)
    if (dragDistance < 8) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cardMeshes);
      if (intersects.length > 0) {
        focusCard(intersects[0].object);
      }
    }
  }

  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });

  // Touch Support
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      onPointerDown(e.touches[0]);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      onPointerMove(e.touches[0]);
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    onPointerUp(e);
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 8. FOCUS / ACTIVE FRAME MODE
  // --------------------------------------------------------------------------
  function focusCard(mesh) {
    if (!mesh) return;
    isFocusMode = true;
    focusedMesh = mesh;

    // Angle that aligns mesh with camera forward (Z axis)
    // Mesh is at position (R*sin(angle), y, R*cos(angle))
    // To face camera, sphere rotation Y must equal -angle
    focusTargetRotY = -mesh.userData.angle;
    // Elevation alignment
    focusTargetRotX = -mesh.userData.y * 0.0006;
    focusCameraZ = 340; // Zoom camera closer!

    // Update bottom toolbar
    const item = mesh.userData.item;
    if (focusTitleEl) focusTitleEl.textContent = item.title;
    if (focusCatEl) focusCatEl.textContent = `${item.cat} • ${item.format} • ${item.year}`;

    if (instructionEl) instructionEl.classList.add('is-hidden');
    if (activeToolbar) activeToolbar.classList.add('is-active');
    if (watermarkEl) watermarkEl.classList.add('is-faded');
  }

  function releaseFocus() {
    isFocusMode = false;
    focusedMesh = null;
    focusCameraZ = 0;
    targetRotX = 0;

    if (instructionEl) instructionEl.classList.remove('is-hidden');
    if (activeToolbar) activeToolbar.classList.remove('is-active');
    if (watermarkEl) watermarkEl.classList.remove('is-faded');
  }

  // Active Toolbar Button Listeners
  const btnPrev = document.getElementById('toolbar-btn-prev');
  const btnNext = document.getElementById('toolbar-btn-next');
  const btnClose = document.getElementById('toolbar-btn-close');
  const btnView = document.getElementById('toolbar-btn-view');

  if (btnClose) {
    btnClose.addEventListener('click', releaseFocus);
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (!focusedMesh) return;
      const idx = cardMeshes.indexOf(focusedMesh);
      const prevIdx = (idx - 1 + cardMeshes.length) % cardMeshes.length;
      focusCard(cardMeshes[prevIdx]);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (!focusedMesh) return;
      const idx = cardMeshes.indexOf(focusedMesh);
      const nextIdx = (idx + 1) % cardMeshes.length;
      focusCard(cardMeshes[nextIdx]);
    });
  }

  if (btnView) {
    btnView.addEventListener('click', () => {
      if (focusedMesh && focusedMesh.userData.item) {
        openModal(focusedMesh.userData.item);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. ANIMATION RENDER LOOP
  // --------------------------------------------------------------------------
  function animate() {
    requestAnimationFrame(animate);

    if (isFocusMode) {
      // Lerp sphere smoothly to center focused frame
      rotY += (focusTargetRotY - rotY) * 0.085;
      rotX += (focusTargetRotX - rotX) * 0.085;
      targetCameraZ += (focusCameraZ - targetCameraZ) * 0.085;
    } else {
      // Freeform inertia lerp
      rotY += (targetRotY - rotY) * 0.075;
      rotX += (targetRotX - rotX) * 0.075;
      targetCameraZ += (0 - targetCameraZ) * 0.075;

      // Slow ambient drift when not dragging
      if (!isDragging) {
        targetRotY += 0.0004;
      }
    }

    sphereGroup.rotation.y = rotY;
    sphereGroup.rotation.x = rotX;
    camera.position.z = targetCameraZ;

    renderer.render(scene, camera);
  }

  animate();

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize);

  // --------------------------------------------------------------------------
  // 10. MODAL DIALOG (Videos & Full Master Photographs)
  // --------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('halvor-modal');
  const modalMediaWrap = document.getElementById('modal-media-wrap');
  const modalTitle = document.getElementById('modal-title');
  const modalDetails = document.getElementById('modal-details');
  const modalClose = document.getElementById('modal-close');

  function openModal(item) {
    if (!modalBackdrop) return;

    if (modalTitle) modalTitle.textContent = item.title;
    if (modalDetails) {
      modalDetails.innerHTML = `
        <strong>Category:</strong> ${item.cat} &bull; 
        <strong>Format:</strong> ${item.format} &bull; 
        <strong>Archive Year:</strong> ${item.year}<br>
        <strong>Costume & Styling:</strong> Kanchan Choudhary &bull; Visual Art Direction
      `;
    }

    if (modalMediaWrap) {
      if (item.videoId) {
        modalMediaWrap.innerHTML = `
          <iframe 
            src="https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=1&rel=0" 
            title="${item.title}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        `;
      } else if (item.reelUrl) {
        modalMediaWrap.innerHTML = `
          <iframe 
            src="${item.embedUrl || item.reelUrl + 'embed/'}" 
            title="${item.title}" 
            scrolling="no" 
            allowtransparency="true" 
            allowfullscreen>
          </iframe>
        `;
      } else {
        modalMediaWrap.innerHTML = `
          <img src="${item.src}" alt="${item.title}" />
        `;
      }
    }

    modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    if (modalMediaWrap) modalMediaWrap.innerHTML = '';
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalBackdrop && modalBackdrop.classList.contains('is-open')) {
        closeModal();
      } else if (isFocusMode) {
        releaseFocus();
      }
    }
  });

});
