// ==========================================================================
// Kanchan Choudhary Portfolio — Felix Kern Style Interactivity
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const heroImg = document.getElementById('hero-dynamic-img');
  const defaultHeroSrc = heroImg ? heroImg.getAttribute('src') : '';

  // 1. Hover Preview Image Swap
  const workItems = document.querySelectorAll('.list-work-block');
  workItems.forEach(item => {
    const thumb = item.getAttribute('data-thumb');

    item.addEventListener('mouseenter', () => {
      if (heroImg && thumb) {
        heroImg.style.transition = 'opacity 0.15s ease';
        heroImg.style.opacity = '0.65';
        setTimeout(() => {
          heroImg.src = thumb;
          heroImg.style.opacity = '1';
        }, 80);
      }
    });

    item.addEventListener('mouseleave', () => {
      if (heroImg && defaultHeroSrc) {
        heroImg.style.transition = 'opacity 0.2s ease';
        heroImg.src = defaultHeroSrc;
        heroImg.style.opacity = '1';
      }
    });

    // 2. Click to Open Video / Lightbox Player
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const videoId = item.getAttribute('data-video-id');
      const title = item.getAttribute('data-title') || 'Project Preview';
      const thumb = item.getAttribute('data-thumb');

      openLightbox(videoId, thumb, title);
    });
  });

  // 3. Lightbox Functionality
  const lightbox = document.getElementById('video-lightbox');
  const lightboxContainer = document.getElementById('lightbox-embed-container');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('close-lightbox');

  function openLightbox(videoId, thumb, title) {
    if (videoId) {
      lightboxContainer.innerHTML = `
        <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen 
          style="width:100%; height:100%; border:0;">
        </iframe>
      `;
    } else if (thumb) {
      lightboxContainer.innerHTML = `
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#000;">
          <img src="${thumb}" alt="${title}" style="max-width:100%; max-height:100%; object-fit:contain;">
        </div>
      `;
    }
    lightboxCaption.textContent = `[Project] ${title}`;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
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
      e.stopPropagation();
      isMenuOpen = !isMenuOpen;
      if (isMenuOpen) {
        menuInfo.style.display = 'block';
        menuToggle.querySelector('.body-font').textContent = '[-]';
      } else {
        menuInfo.style.display = '';
        menuToggle.querySelector('.body-font').textContent = '[+]';
      }
    });
  }
});
