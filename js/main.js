// ==========================================================================
// Kanchan Choudhary Portfolio — Interactive Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const heroImg = document.getElementById('hero-dynamic-img');
  const heroCaption = document.getElementById('hero-caption-indicator');
  const defaultHeroSrc = heroImg ? heroImg.getAttribute('src') : '';
  const defaultCaption = heroCaption ? heroCaption.textContent : '';

  // Preload preview images for seamless hovering/touching
  const preloadThumbs = [
    'assets/slide_10_1.jpg',
    'assets/yt_anupam_kher.jpg',
    'assets/yt_saurabh_shukla.jpg',
    'assets/yt_subhash_sehgal.jpg',
    'assets/yt_deepshikha_nagpal.jpg',
    'assets/slide_5_1.jpg',
    'assets/slide_6_1.jpg',
    'assets/slide_8_1.jpg',
    'assets/slide_11_1.jpg',
    'assets/slide_13_1.jpg',
    'assets/slide_15_1.jpg',
    'assets/slide_1_1.jpg',
    'assets/slide_7_1.jpg'
  ];
  preloadThumbs.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // 1. Hover & Touch Preview Image Swap
  const workItems = document.querySelectorAll('.list-work-block');
  workItems.forEach(item => {
    const thumb = item.getAttribute('data-thumb');
    const title = item.getAttribute('data-title') || '';

    function activatePreview() {
      if (heroImg && thumb) {
        heroImg.src = thumb;
        if (heroCaption) heroCaption.textContent = `[${title} • Full Frame]`;
      }
    }

    item.addEventListener('mouseenter', activatePreview);
    item.addEventListener('touchstart', activatePreview, { passive: true });

    item.addEventListener('mouseleave', () => {
      if (heroImg && defaultHeroSrc) {
        heroImg.src = defaultHeroSrc;
        if (heroCaption) heroCaption.textContent = defaultCaption;
      }
    });

    // 2. Click behavior: videos open 4K modal player; photos navigate to category page
    item.addEventListener('click', (e) => {
      const videoId = item.getAttribute('data-video-id');
      if (videoId) {
        e.preventDefault();
        const itemTitle = item.getAttribute('data-title') || 'KIFF Masterclass Video';
        openLightbox(videoId, itemTitle);
      }
      // If photoshoot row, browser naturally follows the href to work.html#cat-...
    });
  });

  if (heroImg) {
    heroImg.style.cursor = 'pointer';
    heroImg.title = 'Click to open Work Exhibition';
    heroImg.addEventListener('click', () => {
      window.location.href = 'work.html';
    });
  }

  // 3. Responsive 4K Video Lightbox Modal
  const lightbox = document.getElementById('video-lightbox');
  const lightboxContainer = document.getElementById('lightbox-embed-container');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('close-lightbox');

  function openLightbox(videoId, title) {
    if (!lightbox || !lightboxContainer) return;
    lightboxContainer.innerHTML = `
      <div style="position:relative; width:100%; aspect-ratio:16/9; background:#000;">
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1" 
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen 
          style="width:100%; height:100%; border:0; display:block;">
        </iframe>
      </div>
      <div style="padding:12px 18px; background:#0d0e12; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #222; flex-wrap:wrap; gap:8px;">
        <span style="color:#aaa; font-size:12px; font-family:'IBM Plex Mono', monospace;">KIFF 4K Broadcast Masterclass</span>
        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer" style="color:#fff; text-decoration:underline; font-size:12px; font-family:'IBM Plex Mono', monospace;">[Watch Directly on YouTube &rarr;]</a>
      </div>
    `;

    if (lightboxCaption) lightboxCaption.textContent = `[Project] ${title}`;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox || !lightboxContainer) return;
    lightbox.style.display = 'none';
    lightboxContainer.innerHTML = '';
    document.body.style.overflow = 'auto';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // 4. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle-btn');
  const menuInfo = document.getElementById('menu-info');
  let isMenuOpen = false;

  if (menuToggle && menuInfo) {
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      isMenuOpen = !isMenuOpen;
      menuInfo.style.display = isMenuOpen ? 'block' : '';
      const textEl = menuToggle.querySelector('.body-font');
      if (textEl) textEl.textContent = isMenuOpen ? '[-]' : '[+]';
    });
  }
});
