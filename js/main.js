// ==========================================================================
// Kanchan Choudhary Portfolio — Complete Interactive Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const heroImg = document.getElementById('hero-dynamic-img');
  const heroCaption = document.getElementById('hero-caption-indicator');
  const defaultHeroSrc = heroImg ? heroImg.getAttribute('src') : '';
  const defaultCaption = heroCaption ? heroCaption.textContent : '';

  // 1. Hover Preview Image & Caption Swap
  const workItems = document.querySelectorAll('.list-work-block');
  workItems.forEach(item => {
    const thumb = item.getAttribute('data-thumb');
    const title = item.getAttribute('data-title') || '';

    item.addEventListener('mouseenter', () => {
      if (heroImg && thumb) {
        heroImg.style.opacity = '0.65';
        setTimeout(() => {
          heroImg.src = thumb;
          heroImg.style.opacity = '1';
          if (heroCaption) heroCaption.textContent = `[${title} • Full Frame]`;
        }, 50);
      }
    });

    item.addEventListener('mouseleave', () => {
      if (heroImg && defaultHeroSrc) {
        heroImg.style.opacity = '0.7';
        setTimeout(() => {
          heroImg.src = defaultHeroSrc;
          heroImg.style.opacity = '1';
          if (heroCaption) heroCaption.textContent = defaultCaption;
        }, 80);
      }
    });

    // 2. Click to Open Video / Photo Lightbox
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const videoId = item.getAttribute('data-video-id');
      const itemTitle = item.getAttribute('data-title') || 'Project Preview';
      const photosRaw = item.getAttribute('data-photos');
      let photos = [];
      if (photosRaw) {
        try {
          photos = JSON.parse(photosRaw);
        } catch (err) {
          photos = [thumb];
        }
      }

      openLightbox(videoId, thumb, photos, itemTitle);
    });
  });

  // 3. Tab Switcher ([Selected Works Table] vs [View All Photos (55)])
  const tabBtnTable = document.getElementById('tab-btn-table');
  const tabBtnAll = document.getElementById('tab-btn-all');
  const sectionTable = document.getElementById('section-table');
  const sectionAllPhotos = document.getElementById('section-all-photos');
  const navLinkAll = document.getElementById('nav-link-all');
  const navLinkWorks = document.getElementById('nav-link-works');

  function showTableTab() {
    if (tabBtnTable && tabBtnAll && sectionTable && sectionAllPhotos) {
      tabBtnTable.classList.add('active');
      tabBtnAll.classList.remove('active');
      sectionTable.classList.remove('hidden');
      sectionAllPhotos.classList.remove('active');
    }
  }

  function showAllPhotosTab() {
    if (tabBtnTable && tabBtnAll && sectionTable && sectionAllPhotos) {
      tabBtnAll.classList.add('active');
      tabBtnTable.classList.remove('active');
      sectionTable.classList.add('hidden');
      sectionAllPhotos.classList.add('active');
    }
  }

  if (tabBtnTable) tabBtnTable.addEventListener('click', showTableTab);
  if (tabBtnAll) tabBtnAll.addEventListener('click', showAllPhotosTab);

  if (navLinkAll) {
    navLinkAll.addEventListener('click', (e) => {
      showAllPhotosTab();
    });
  }

  if (navLinkWorks) {
    navLinkWorks.addEventListener('click', (e) => {
      showTableTab();
    });
  }

  // 4. View All Photos Sub-Filters
  const filterPills = document.querySelectorAll('.filter-pill');
  const photoCards = document.querySelectorAll('.photo-card-item');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterTag = pill.getAttribute('data-cat-filter');

      photoCards.forEach(card => {
        const cat = card.getAttribute('data-cat') || '';
        if (filterTag === 'all' || cat === filterTag || cat.includes(filterTag)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Clicking any photo card in the full gallery opens it in lightbox
  photoCards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-src');
      const title = card.getAttribute('data-title') || 'Photograph';
      openLightbox(null, src, [src], title);
    });
  });

  // 5. Lightbox Functionality
  const lightbox = document.getElementById('video-lightbox');
  const lightboxContainer = document.getElementById('lightbox-embed-container');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('close-lightbox');

  function openLightbox(videoId, thumb, photos, title) {
    if (videoId) {
      lightboxContainer.innerHTML = `
        <div style="position:relative; width:100%; aspect-ratio:16/9; background:#000;">
          <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen 
            style="width:100%; height:100%; border:0;">
          </iframe>
        </div>
      `;
    } else if (photos && photos.length > 1) {
      let gridHtml = `<div class="gallery-grid-lightbox">`;
      photos.forEach((p, idx) => {
        gridHtml += `
          <div style="text-align:center;">
            <img src="${p}" alt="${title} frame ${idx+1}" onclick="window.open('${p}', '_blank')">
            <div style="color:#aaa; font-size:11px; margin-top:6px; font-family:'IBM Plex Mono', monospace;">Frame ${idx+1} of ${photos.length}</div>
          </div>
        `;
      });
      gridHtml += `</div>`;
      lightboxContainer.innerHTML = gridHtml;
    } else {
      const singleSrc = (photos && photos[0]) ? photos[0] : thumb;
      lightboxContainer.innerHTML = `
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; padding:1.5rem; background:#000;">
          <img src="${singleSrc}" alt="${title}" style="max-width:100%; max-height:80vh; object-fit:contain; border:1px solid #333;">
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

  // 6. Mobile Menu Toggle
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
