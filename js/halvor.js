/**
 * HALVOR 3D SPHERE GALLERY ENGINE (Kanchan Choudhary® Visual Archive)
 * Fixed uniform card frames, 100% uncropped photos (contain fit),
 * true rounded corners in WebGL via alpha-tested offscreen canvas textures,
 * inertia orbit physics, active frame focus, and fullscreen modal inspection.
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
  // 2. LIVE CLOCK (Mumbai / Asia-Kolkata Time)
  // --------------------------------------------------------------------------
  const clockEl = document.getElementById('live-clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
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
  // 3. THEME TOGGLE (Dark Universe vs Light Studio)
  // --------------------------------------------------------------------------
  const themeBtn = document.getElementById('theme-toggle');
  let isDarkTheme = localStorage.getItem('halvor-theme') !== 'light'; // default dark

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
    // Update card textures background for current theme
    refreshAllCardTextures();
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => applyTheme(!isDarkTheme));
  }

  // --------------------------------------------------------------------------
  // 4. THREE.JS 3D CURVED CYLINDER / SPHERE GALLERY
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('sphere-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    console.warn('Canvas or THREE.js not available');
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 10, 5000);
  camera.position.set(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Group containing all curved card meshes
  const sphereGroup = new THREE.Group();
  scene.add(sphereGroup);

  // Geometry & Card Dimensions
  // Fixed uniform portrait frame for all cards
  const CARD_WIDTH = 220;
  const CARD_HEIGHT = 310;
  const RADIUS = 960;
  const CORNER_RADIUS = 28; // on 440x620 retina canvas -> 14px in 3D

  // Creates cylindrical curvature along X so cards wrap seamlessly around radius
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
  const cardMeshes = [];
  const cardTextureHolders = [];

  /**
   * Helper: Paints an uncropped image onto an offscreen Hi-DPI canvas
   * with smooth rounded corners (ctx.roundRect + clip) and subtle luxury border.
   */
  function paintCardToCanvas(canvasEl, img, isDark) {
    const w = canvasEl.width;
    const h = canvasEl.height;
    const r = CORNER_RADIUS;
    const ctx = canvasEl.getContext('2d');

    ctx.clearRect(0, 0, w, h);

    // 1. Smooth Rounded Rectangle Path
    ctx.save();
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(0, 0, w, h, r);
    } else {
      ctx.moveTo(r, 0);
      ctx.lineTo(w - r, 0);
      ctx.quadraticCurveTo(w, 0, w, r);
      ctx.lineTo(w, h - r);
      ctx.quadraticCurveTo(w, h, w - r, h);
      ctx.lineTo(r, h);
      ctx.quadraticCurveTo(0, h, 0, h - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
    }
    ctx.clip();

    // 2. Card Background (Studio Matte Board)
    ctx.fillStyle = isDark ? '#0d0f13' : '#f2f3f6';
    ctx.fillRect(0, 0, w, h);

    // 3. Draw Image Uncropped (Aspect Ratio strictly preserved with contain fit)
    if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      const imgRatio = nw / nh;
      const targetRatio = w / h;

      let drawW, drawH, drawX, drawY;
      if (imgRatio > targetRatio) {
        // Image is wider than 440x620 frame
        drawW = w;
        drawH = w / imgRatio;
        drawX = 0;
        drawY = (h - drawH) / 2;
      } else {
        // Image is taller than or equal to frame
        drawH = h;
        drawW = h * imgRatio;
        drawX = (w - drawW) / 2;
        drawY = 0;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    } else {
      // Sleek loading placeholder shimmer
      ctx.fillStyle = isDark ? '#171a21' : '#e5e7eb';
      ctx.fillRect(w * 0.1, h * 0.1, w * 0.8, h * 0.8);
    }

    // 4. Subtle Inner Luxury Outline with rounded corner
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.09)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  }

  function createCardTexture(item) {
    const c = document.createElement('canvas');
    c.width = 440; // 2x Retina resolution for razor sharpness
    c.height = 620;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    // Initial paint (placeholder matte)
    paintCardToCanvas(c, img, isDarkTheme);

    const texture = new THREE.CanvasTexture(c);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Load actual image
    img.onload = () => {
      paintCardToCanvas(c, img, isDarkTheme);
      texture.needsUpdate = true;
    };
    img.src = item.src;

    const holder = { canvas: c, img, texture };
    cardTextureHolders.push(holder);
    return texture;
  }

  function refreshAllCardTextures() {
    cardTextureHolders.forEach(holder => {
      paintCardToCanvas(holder.canvas, holder.img, isDarkTheme);
      holder.texture.needsUpdate = true;
    });
  }

  // 3 Horizontal Tiers covering all works (Top: +340, Center: 0, Bottom: -340)
  const totalWorks = works.length;
  const countMid = Math.ceil(totalWorks / 3);
  const countTop = Math.floor((totalWorks - countMid) / 2);
  const countBtm = totalWorks - countMid - countTop;

  const tiers = [
    { y: 340,  count: countTop > 0 ? countTop : 21 },
    { y: 0,    count: countMid > 0 ? countMid : 23 },
    { y: -340, count: countBtm > 0 ? countBtm : 21 }
  ];

  let itemIdx = 0;
  tiers.forEach((tier, tierIdx) => {
    const angleStep = (Math.PI * 2) / tier.count;
    // Brick-pattern offset for alternating tiers
    const tierOffset = tierIdx % 2 === 1 ? angleStep * 0.5 : 0;

    for (let i = 0; i < tier.count; i++) {
      const item = works[itemIdx % works.length];
      itemIdx++;

      const angle = i * angleStep + tierOffset;
      const cardTexture = createCardTexture(item);

      const material = new THREE.MeshBasicMaterial({
        map: cardTexture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.05,
        depthWrite: true
      });

      const mesh = new THREE.Mesh(curvedGeometry, material);

      // Position on cylinder
      mesh.position.x = RADIUS * Math.sin(angle);
      mesh.position.z = RADIUS * Math.cos(angle);
      mesh.position.y = tier.y;

      // Face inward towards camera (center 0,0,0)
      mesh.rotation.y = angle + Math.PI;

      // Metadata for raycasting and inspection
      mesh.userData = {
        item: item,
        angle: angle,
        y: tier.y,
        tierIdx: tierIdx,
        indexInTier: i
      };

      sphereGroup.add(mesh);
      cardMeshes.push(mesh);
    }
  });

  // Apply initial theme
  applyTheme(isDarkTheme);

  // --------------------------------------------------------------------------
  // 5. INTERACTION PHYSICS & ORBIT DRAG
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
    // Ignore clicks on bottom toolbar buttons
    if (e.target && e.target.closest('#active-toolbar')) return;
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
    if (e.target && e.target.closest('#active-toolbar')) return;
    isDragging = false;

    // Click event (not a drag)
    if (dragDistance < 8) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cardMeshes);
      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        if (isFocusMode && focusedMesh === clickedMesh) {
          // Double click / re-click opens modal inspection
          openModal(clickedMesh.userData.item);
        } else {
          focusCard(clickedMesh);
        }
      }
    }
  }

  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });

  // Touch Support
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) onPointerDown(e.touches[0]);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) onPointerMove(e.touches[0]);
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    onPointerUp(e);
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 6. FOCUS / ACTIVE FRAME MODE
  // --------------------------------------------------------------------------
  function focusCard(mesh) {
    if (!mesh) return;
    isFocusMode = true;
    focusedMesh = mesh;

    // Calculate rotation Y to align mesh with camera view axis
    focusTargetRotY = -mesh.userData.angle;
    // Slight vertical tilt to center active tier
    focusTargetRotX = -mesh.userData.y * 0.0006;
    focusCameraZ = 330; // Smooth camera zoom closer

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

  if (btnClose) btnClose.addEventListener('click', releaseFocus);

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

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalBackdrop && modalBackdrop.classList.contains('is-open')) {
        closeModal();
      } else if (isFocusMode) {
        releaseFocus();
      }
    } else if (e.key === 'ArrowLeft' && isFocusMode) {
      if (btnPrev) btnPrev.click();
    } else if (e.key === 'ArrowRight' && isFocusMode) {
      if (btnNext) btnNext.click();
    } else if (e.key === 'Enter' && isFocusMode && (!modalBackdrop || !modalBackdrop.classList.contains('is-open'))) {
      if (btnView) btnView.click();
    }
  });

  // --------------------------------------------------------------------------
  // 7. ANIMATION RENDER LOOP
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
        targetRotY += 0.00035;
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
  // 8. FULLSCREEN INSPECTION MODAL (4K Masterclasses, Reels & Stills)
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
        <strong>Costume &amp; Styling:</strong> Kanchan Choudhary &bull; Visual Art Direction
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
          <img src="${item.src}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 12px; background: #000;" />
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

});
