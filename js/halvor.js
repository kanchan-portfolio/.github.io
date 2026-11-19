/**
 * HALVOR 3D FLOATING GLOBE & PHOTOGRAPH VIEWER ENGINE
 * Recreates the exact starting 3D floating globe (sphere of cards),
 * dual-axis inertia orbit physics, card focus zoom, and photograph viewer of
 * https://halvor.framer.website
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
  // 2. LIVE CLOCK & HEADER BREADCRUMB
  // --------------------------------------------------------------------------
  const clockEl = document.getElementById('live-clock');
  let currentActiveTitle = '';

  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    if (currentActiveTitle) {
      clockEl.textContent = `MUMBAI ${timeStr} · ${currentActiveTitle}`;
    } else {
      clockEl.textContent = `MUMBAI ${timeStr}`;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --------------------------------------------------------------------------
  // 3. THEME TOGGLE (Default: Halvor Swiss White)
  // --------------------------------------------------------------------------
  const themeBtn = document.getElementById('theme-toggle');
  let isDarkTheme = localStorage.getItem('halvor-theme') === 'dark';
  // Ensure default is Halvor's signature Swiss White
  if (!localStorage.getItem('halvor-theme-v2')) {
    isDarkTheme = false;
    localStorage.setItem('halvor-theme-v2', 'true');
    localStorage.setItem('halvor-theme', 'light');
  }

  function applyTheme(dark) {
    isDarkTheme = dark;
    if (dark) {
      document.body.classList.add('dark-theme');
      if (themeBtn) themeBtn.textContent = '☀ LIGHT';
      localStorage.setItem('halvor-theme', 'dark');
      if (renderer) renderer.setClearColor(0x07080a, 1);
      if (scene) scene.fog = new THREE.Fog(0x07080a, 900, 1800);
    } else {
      document.body.classList.remove('dark-theme');
      if (themeBtn) themeBtn.textContent = '☾ DARK';
      localStorage.setItem('halvor-theme', 'light');
      if (renderer) renderer.setClearColor(0xffffff, 1);
      if (scene) scene.fog = new THREE.Fog(0xffffff, 900, 1800);
    }
    refreshAllCardTextures();
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => applyTheme(!isDarkTheme));
  }

  // --------------------------------------------------------------------------
  // 4. THREE.JS 3D FLOATING GLOBE SCENE SETUP
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('sphere-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    console.warn('Canvas or THREE.js not available');
    return;
  }

  const scene = new THREE.Scene();
  // Atmospheric depth fog to blend back cards naturally
  scene.fog = new THREE.Fog(isDarkTheme ? 0x07080a : 0xffffff, 900, 1800);

  // Camera placed OUTSIDE the globe at Z = 1260 to show the full floating 3D ball/globe!
  const START_CAMERA_Z = 1260;
  const FOCUS_CAMERA_Z = 490;
  let targetCameraZ = START_CAMERA_Z;

  const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 10, 4000);
  camera.position.set(0, 0, START_CAMERA_Z);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // RenderTarget for Post-Processing Radial Chromatic Aberration
  let renderTarget = new THREE.WebGLRenderTarget(
    window.innerWidth * Math.min(window.devicePixelRatio, 2),
    window.innerHeight * Math.min(window.devicePixelRatio, 2),
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    }
  );

  // Post-Processing Scene & Fullscreen Quad with Halvor Shader 5
  const postScene = new THREE.Scene();
  const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const postShader = {
    uniforms: {
      tDiffuse: { value: renderTarget.texture },
      uStrength: { value: 0.07 },
      uRadius: { value: 0.38 },
      uSmoothness: { value: 0.28 },
      uDispersion: { value: 0.32 },
      uMotion: { value: 0.0 },
      uMotionStrength: { value: 0.12 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform sampler2D tDiffuse;
      uniform float uStrength;
      uniform float uRadius;
      uniform float uSmoothness;
      uniform float uDispersion;
      uniform float uMotion;
      uniform float uMotionStrength;
      varying vec2 vUv;
      const int SAMPLES = 18;

      void main() {
        vec2 toCenter = vUv - 0.5;
        float d = length(toCenter);
        float radius = uRadius * (1.0 - 0.65 * uMotion);
        float mask = smoothstep(radius, radius + uSmoothness, d);
        float amount = mask * mask * uStrength + mask * uMotion * uMotionStrength;

        if (amount <= 0.0) {
          gl_FragColor = texture2D(tDiffuse, vUv);
          return;
        }

        vec3 color = vec3(0.0);
        float total = 0.0;
        for (int i = 0; i < SAMPLES; i++) {
          float progress = float(i) / float(SAMPLES - 1);
          float weight = 1.0 - progress * 0.55;
          float scale = 1.0 - amount * progress;
          float spread = uDispersion * amount * progress;
          color.r += texture2D(tDiffuse, 0.5 + toCenter * (scale + spread)).r * weight;
          color.g += texture2D(tDiffuse, 0.5 + toCenter * scale).g * weight;
          color.b += texture2D(tDiffuse, 0.5 + toCenter * (scale - spread)).b * weight;
          total += weight;
        }
        gl_FragColor = vec4(color / total, 1.0);
      }
    `
  };

  const postMaterial = new THREE.ShaderMaterial({
    uniforms: postShader.uniforms,
    vertexShader: postShader.vertexShader,
    fragmentShader: postShader.fragmentShader,
    depthTest: false,
    depthWrite: false
  });
  const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);
  postScene.add(postQuad);

  // Group containing the entire 3D Globe of cards
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // Globe dimensions: exactly calibrated to show the full spherical globe ball
  const GLOBE_RADIUS = 340;
  const CARD_WIDTH = 86;
  const CARD_HEIGHT = 118;
  const CORNER_RADIUS = 18; // on 344x472 retina texture

  /**
   * Helper: Generates a curved plane geometry that hugs the spherical curvature
   * around both longitude and latitude at a given latitude angle.
   */
  function createSphericalCurvedGeometry(width, height, radius, latDeg) {
    const geom = new THREE.PlaneGeometry(width, height, 12, 12);
    const pos = geom.attributes.position;
    const latRad = (latDeg * Math.PI) / 180;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      const dLon = x / (radius * Math.max(0.15, Math.cos(latRad)));
      const dLat = y / radius;
      const curLat = latRad + dLat;

      // Project onto sphere surface relative to card center
      const px = radius * Math.cos(curLat) * Math.sin(dLon);
      const py = radius * Math.sin(curLat) - radius * Math.sin(latRad);
      const pz = radius * (Math.cos(curLat) * Math.cos(dLon) - Math.cos(latRad));

      pos.setXYZ(i, px, py, pz);
    }
    geom.computeVertexNormals();
    return geom;
  }

  const cardMeshes = [];
  const cardTextureHolders = [];

  /**
   * Helper: Paints an uncropped image onto an offscreen canvas
   * with smooth rounded corners (ctx.roundRect + clip) and subtle luxury plate border.
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

    // 2. Card Plate Background
    ctx.fillStyle = isDark ? '#14171d' : '#f4f4f4';
    ctx.fillRect(0, 0, w, h);

    // 3. Draw Image Uncropped (Aspect ratio strictly preserved with contain fit)
    if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      const imgRatio = nw / nh;
      const targetRatio = w / h;

      let drawW, drawH, drawX, drawY;
      if (imgRatio > targetRatio) {
        drawW = w;
        drawH = w / imgRatio;
        drawX = 0;
        drawY = (h - drawH) / 2;
      } else {
        drawH = h;
        drawW = h * imgRatio;
        drawX = (w - drawW) / 2;
        drawY = 0;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    } else {
      // Shimmer loading placeholder
      ctx.fillStyle = isDark ? '#1d212a' : '#e6e6e6';
      ctx.fillRect(w * 0.1, h * 0.1, w * 0.8, h * 0.8);
    }

    // 4. Subtle Outer Border
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.06)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();
  }

  function createCardTexture(item) {
    const c = document.createElement('canvas');
    c.width = 360;
    c.height = 480;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    paintCardToCanvas(c, img, isDarkTheme);

    const texture = new THREE.CanvasTexture(c);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

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

  // --------------------------------------------------------------------------
  // 5. ASSEMBLE 65 WORKS ACROSS 5 SPHERICAL BANDS FORMING THE 3D GLOBE
  // --------------------------------------------------------------------------
  // 5 Latitude Bands matching Halvor's exact Globe structure
  const tiers = [
    { latDeg: 46,  count: 8 },   // Top Cap
    { latDeg: 23,  count: 15 },  // Upper Mid
    { latDeg: 0,   count: 18 },  // Equator (Center)
    { latDeg: -23, count: 15 },  // Lower Mid
    { latDeg: -46, count: 9 }    // Bottom Cap
  ];

  let itemIdx = 0;
  tiers.forEach((tier, tierIdx) => {
    const latRad = (tier.latDeg * Math.PI) / 180;
    const geom = createSphericalCurvedGeometry(CARD_WIDTH, CARD_HEIGHT, GLOBE_RADIUS, tier.latDeg);
    const angleStep = (Math.PI * 2) / tier.count;
    // Brick pattern offset for alternating bands
    const tierOffset = tierIdx % 2 === 1 ? angleStep * 0.5 : 0;

    for (let i = 0; i < tier.count; i++) {
      const item = works[itemIdx % works.length];
      itemIdx++;

      const lonRad = i * angleStep + tierOffset;
      const cardTexture = createCardTexture(item);

      const material = new THREE.MeshBasicMaterial({
        map: cardTexture,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.02,
        depthWrite: true
      });

      const mesh = new THREE.Mesh(geom, material);

      // Spherical coordinates for outward-facing globe
      const x = GLOBE_RADIUS * Math.cos(latRad) * Math.sin(lonRad);
      const y = GLOBE_RADIUS * Math.sin(latRad);
      const z = GLOBE_RADIUS * Math.cos(latRad) * Math.cos(lonRad);

      mesh.position.set(x, y, z);

      // Orient mesh to face outward from globe center (0,0,0)
      mesh.lookAt(mesh.position.clone().multiplyScalar(2));

      mesh.userData = {
        item: item,
        lon: lonRad,
        lat: latRad,
        latDeg: tier.latDeg,
        tierIdx: tierIdx,
        indexInTier: i,
        globalIdx: cardMeshes.length
      };

      globeGroup.add(mesh);
      cardMeshes.push(mesh);
    }
  });

  applyTheme(isDarkTheme);

  // --------------------------------------------------------------------------
  // 6. INTERACTION PHYSICS & DUAL-AXIS GLOBE ROTATION
  // --------------------------------------------------------------------------
  let isDragging = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let rotY = 0;
  let rotX = 0;
  let targetRotY = 0;
  let targetRotX = 0;
  let dragDistance = 0;
  let dragSpeed = 0;

  // Active Focus Mode State
  let isFocusMode = false;
  let focusedMesh = null;
  let focusTargetRotY = 0;
  let focusTargetRotX = 0;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredMesh = null;

  const watermarkEl = document.getElementById('center-watermark');
  const instructionEl = document.getElementById('gallery-instruction');
  const activeToolbar = document.getElementById('active-toolbar');
  const focusTitleEl = document.getElementById('focus-title');
  const focusCatEl = document.getElementById('focus-cat');

  function onPointerDown(e) {
    if (e.target && (e.target.closest('#active-toolbar') || e.target.closest('#halvor-viewer'))) return;
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
      const moveDist = Math.abs(deltaX) + Math.abs(deltaY);
      dragDistance += moveDist;
      dragSpeed = Math.min(1.0, dragSpeed + moveDist * 0.0035);

      if (!isFocusMode) {
        targetRotY += deltaX * 0.0032;
        targetRotX += deltaY * 0.0024;
        // Pitch limits so globe doesn't flip completely upside down
        targetRotX = Math.max(-0.65, Math.min(0.65, targetRotX));
      }

      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    } else if (!isFocusMode) {
      // Raycasting for card hover
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
    if (e.target && (e.target.closest('#active-toolbar') || e.target.closest('#halvor-viewer'))) return;
    isDragging = false;

    // Detect Click vs Drag
    if (dragDistance < 7) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cardMeshes);
      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        if (isFocusMode && focusedMesh === clickedMesh) {
          // Clicking already-focused card opens full Photograph Viewer
          openViewer(clickedMesh.userData.item);
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
  // 7. CARD FOCUS & ZOOM ANIMATION
  // --------------------------------------------------------------------------
  function focusCard(mesh) {
    if (!mesh) return;
    isFocusMode = true;
    focusedMesh = mesh;

    // Rotate globe so target card faces straight at camera (0, 0, 1)
    focusTargetRotY = -mesh.userData.lon;
    focusTargetRotX = -mesh.userData.lat;
    targetCameraZ = FOCUS_CAMERA_Z; // Zoom closer to inspect frame

    const item = mesh.userData.item;
    currentActiveTitle = item.title;
    updateClock();

    if (focusTitleEl) focusTitleEl.textContent = item.title;
    if (focusCatEl) focusCatEl.textContent = `${item.cat} · ${item.year}`;

    if (instructionEl) instructionEl.classList.add('is-hidden');
    if (activeToolbar) activeToolbar.classList.add('is-active');
    if (watermarkEl) watermarkEl.classList.add('is-faded');
  }

  function releaseFocus() {
    isFocusMode = false;
    focusedMesh = null;
    targetCameraZ = START_CAMERA_Z; // Zoom out to full globe view!
    targetRotX = 0;
    currentActiveTitle = '';
    updateClock();

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
        openViewer(focusedMesh.userData.item);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. FULLSCREEN PHOTOGRAPH VIEWER
  // --------------------------------------------------------------------------
  const viewerBackdrop = document.getElementById('halvor-viewer');
  const viewerStage = document.getElementById('viewer-stage');
  const viewerCounter = document.getElementById('viewer-counter');
  const viewerClose = document.getElementById('viewer-close');
  const viewerPrev = document.getElementById('viewer-prev');
  const viewerNext = document.getElementById('viewer-next');
  const viewerMetaInfo = document.getElementById('viewer-meta-info');

  let currentViewerIdx = 0;

  function openViewer(item) {
    if (!viewerBackdrop) return;

    let targetIdx = works.findIndex(w => w.src === item.src || w.title === item.title);
    if (targetIdx === -1) targetIdx = 0;
    currentViewerIdx = targetIdx;

    renderViewerItem();
    viewerBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function renderViewerItem() {
    const item = works[currentViewerIdx];
    if (!item) return;

    if (viewerCounter) {
      viewerCounter.textContent = `${currentViewerIdx + 1} / ${works.length}`;
    }

    if (viewerMetaInfo) {
      viewerMetaInfo.textContent = `${item.title} · ${item.cat} · ${item.year}`;
    }

    if (viewerStage) {
      if (item.videoId) {
        viewerStage.innerHTML = `
          <iframe 
            src="https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=1&rel=0" 
            title="${item.title}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        `;
      } else if (item.reelUrl) {
        viewerStage.innerHTML = `
          <iframe 
            src="${item.embedUrl || item.reelUrl + 'embed/'}" 
            title="${item.title}" 
            scrolling="no" 
            allowtransparency="true" 
            allowfullscreen>
          </iframe>
        `;
      } else {
        viewerStage.innerHTML = `
          <img src="${item.src}" alt="${item.title}" id="viewer-active-img" />
        `;
        const imgEl = document.getElementById('viewer-active-img');
        if (imgEl) {
          imgEl.addEventListener('click', () => {
            currentViewerIdx = (currentViewerIdx + 1) % works.length;
            renderViewerItem();
          });
        }
      }
    }
  }

  function closeViewer() {
    if (!viewerBackdrop) return;
    viewerBackdrop.classList.remove('is-open');
    if (viewerStage) viewerStage.innerHTML = '';
    document.body.style.overflow = '';
  }

  if (viewerClose) viewerClose.addEventListener('click', closeViewer);

  if (viewerPrev) {
    viewerPrev.addEventListener('click', () => {
      currentViewerIdx = (currentViewerIdx - 1 + works.length) % works.length;
      renderViewerItem();
    });
  }

  if (viewerNext) {
    viewerNext.addEventListener('click', () => {
      currentViewerIdx = (currentViewerIdx + 1) % works.length;
      renderViewerItem();
    });
  }

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (viewerBackdrop && viewerBackdrop.classList.contains('is-open')) {
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') viewerNext && viewerNext.click();
      if (e.key === 'ArrowLeft') viewerPrev && viewerPrev.click();
    } else if (isFocusMode) {
      if (e.key === 'Escape') releaseFocus();
      if (e.key === 'ArrowRight') btnNext && btnNext.click();
      if (e.key === 'ArrowLeft') btnPrev && btnPrev.click();
      if (e.key === 'Enter') btnView && btnView.click();
    }
  });

  // --------------------------------------------------------------------------
  // 9. ANIMATION RENDER LOOP WITH REAL-TIME GLOBE ORBIT & POST-PROCESSING
  // --------------------------------------------------------------------------
  function animate() {
    requestAnimationFrame(animate);

    // Decay drag momentum speed
    dragSpeed *= 0.92;

    if (isFocusMode) {
      // Smooth lerp to focused card and zoom in
      rotY += (focusTargetRotY - rotY) * 0.08;
      rotX += (focusTargetRotX - rotX) * 0.08;
    } else {
      // Freeform momentum orbit
      rotY += (targetRotY - rotY) * 0.07;
      rotX += (targetRotX - rotX) * 0.07;

      // Gentle ambient floating spin when idle
      if (!isDragging) {
        targetRotY += 0.0004;
      }
    }

    camera.position.z += (targetCameraZ - camera.position.z) * 0.08;

    globeGroup.rotation.y = rotY;
    globeGroup.rotation.x = rotX;

    // Post-processing dynamic motion blur
    postMaterial.uniforms.uMotion.value = Math.min(1.0, dragSpeed * 2.0);

    // 1. Render 3D Scene into RenderTarget
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);

    // 2. Render Fullscreen Quad with Chromatic Aberration Shader to Canvas
    renderer.setRenderTarget(null);
    renderer.render(postScene, postCamera);
  }

  animate();

  function onWindowResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const pr = Math.min(window.devicePixelRatio, 2);

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
    renderTarget.setSize(w * pr, h * pr);
  }

  window.addEventListener('resize', onWindowResize);

});
