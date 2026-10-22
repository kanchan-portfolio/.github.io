/**
 * COSMOS — Kanchan Choudhary Portfolio Interactive Engine
 * Recreates the exact micro-interactions and smooth physics of Cosmos (cosmos.so)
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. HIGH-PERFORMANCE PRELOADER (Instant & Non-Blocking)
  // =========================================================================
  const loader = document.getElementById('cosmos-loader');
  const counter = document.getElementById('loader-counter');
  let progress = 0;

  function dismissLoader() {
    if (!loader || loader.classList.contains('loaded')) return;
    if (counter) counter.textContent = '100%';
    loader.classList.add('loaded');
  }

  // Fast smooth progress increment (takes ~80ms instead of 1000ms)
  const loadInterval = setInterval(() => {
    progress += 25;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      dismissLoader();
    } else {
      if (counter) counter.textContent = `${progress}%`;
    }
  }, 18);

  // Fallback: dismiss as soon as page assets are ready
  window.addEventListener('load', dismissLoader, { once: true });


  // =========================================================================
  // 2. THEME SWITCHER (Dark | Light Mode)
  // =========================================================================
  const darkBtn = document.getElementById('theme-btn-dark');
  const lightBtn = document.getElementById('theme-btn-light');

  function setTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      if (lightBtn) lightBtn.classList.add('active');
      if (darkBtn) darkBtn.classList.remove('active');
      localStorage.setItem('cosmos-theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      if (darkBtn) darkBtn.classList.add('active');
      if (lightBtn) lightBtn.classList.remove('active');
      localStorage.setItem('cosmos-theme', 'dark');
    }
  }

  const savedTheme = localStorage.getItem('cosmos-theme') || 'dark';
  setTheme(savedTheme);

  if (darkBtn) darkBtn.addEventListener('click', () => setTheme('dark'));
  if (lightBtn) lightBtn.addEventListener('click', () => setTheme('light'));


  // =========================================================================
  // 3. CANVAS STARFIELD (Optimized with IntersectionObserver)
  // =========================================================================
  const canvas = document.getElementById('cosmos-starfield');
  const worldCanvas = document.getElementById('world-starfield');

  function initStarfield(cvs, count = 120) {
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let width = cvs.width = cvs.offsetWidth || window.innerWidth;
    let height = cvs.height = cvs.offsetHeight || window.innerHeight;

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = cvs.width = cvs.offsetWidth || window.innerWidth;
        height = cvs.height = cvs.offsetHeight || window.innerHeight;
      }, 150);
    }, { passive: true });

    // Adaptive particle count for mobile screens (saves battery & GPU)
    const isMobile = window.innerWidth < 680;
    const actualCount = isMobile ? Math.min(count, 50) : count;

    const stars = Array.from({ length: actualCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.4,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      increasing: Math.random() > 0.5
    }));

    let isVisible = true;
    let animFrame = null;

    function animateStars() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);
      stars.forEach(s => {
        if (s.increasing) {
          s.alpha += s.speed;
          if (s.alpha >= 1) s.increasing = false;
        } else {
          s.alpha -= s.speed;
          if (s.alpha <= 0.1) s.increasing = true;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animFrame = requestAnimationFrame(animateStars);
    }

    // Only render frames when canvas is visible in viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            cancelAnimationFrame(animFrame);
            animateStars();
          } else {
            cancelAnimationFrame(animFrame);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(cvs);
    } else {
      animateStars();
    }
  }

  initStarfield(canvas, 100);
  initStarfield(worldCanvas, 120);


  // =========================================================================
  // 4. HERO 3D ORBIT MOUSE PARALLAX & DRIFT (Viewport-Optimized)
  // =========================================================================
  const orbitLayer = document.querySelector('.orbit-layer');
  const heroSection = document.getElementById('hero');

  if (orbitLayer && heroSection) {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let isHeroVisible = true;
    let orbitFrame = null;

    // Passive listener for non-blocking scrolling
    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetX = (e.clientX - centerX) / centerX;
      targetY = (e.clientY - centerY) / centerY;
    }, { passive: true });

    function renderOrbit() {
      if (!isHeroVisible) return;
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      const rotY = currentX * 12;
      const rotX = -currentY * 12;

      orbitLayer.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      orbitFrame = requestAnimationFrame(renderOrbit);
    }

    // Pause when Hero scrolls out of view
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isHeroVisible = entry.isIntersecting;
          if (isHeroVisible) {
            cancelAnimationFrame(orbitFrame);
            renderOrbit();
          } else {
            cancelAnimationFrame(orbitFrame);
          }
        });
      }, { threshold: 0.05 });
      heroObserver.observe(heroSection);
    } else {
      renderOrbit();
    }
  }


  // =========================================================================
  // 5. CYCLING TYPOGRAPHY (Cosmos Word Flipper)
  // =========================================================================
  function setupWordCycler(elementId, words, interval = 2400) {
    const el = document.getElementById(elementId);
    if (!el || words.length === 0) return;
    let index = 0;

    setInterval(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';

      setTimeout(() => {
        index = (index + 1) % words.length;
        el.textContent = words[index];
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 260);
    }, interval);
  }

  setupWordCycler('hero-cycle', [
    'directors',
    'filmmakers',
    'fashion houses',
    'curators',
    'visual artists'
  ], 2200);

  setupWordCycler('sub-cycle', [
    'cinematography',
    'high-fashion editorials',
    'celebrity podcasts',
    'studio lighting',
    'brand commercials'
  ], 2600);


  // =========================================================================
  // 6. INTERACTIVE TAGGING HOTSPOTS (Section 5)
  // =========================================================================
  const hotspots = document.querySelectorAll('.hotspot-pin');
  hotspots.forEach(pin => {
    pin.addEventListener('mouseenter', () => {
      const tag = pin.querySelector('.pin-tag');
      if (tag) {
        tag.style.transform = 'translateX(6px) scale(1.05)';
      }
    });
    pin.addEventListener('mouseleave', () => {
      const tag = pin.querySelector('.pin-tag');
      if (tag) {
        tag.style.transform = 'translateX(0) scale(1)';
      }
    });
  });


  // =========================================================================
  // 7. LIVE RESURFACE SEARCH & FILTERS (Section 6)
  // =========================================================================
  const searchInput = document.getElementById('resurface-input');
  const filterBtns = document.querySelectorAll('.search-filter-btn');
  const resultCards = document.querySelectorAll('.resurface-item');

  function filterWorks() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const activeBtn = document.querySelector('.search-filter-btn.active');
    const category = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

    resultCards.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const cat = (card.getAttribute('data-cat') || '').toLowerCase();
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();

      const matchesQuery = !query || title.includes(query) || cat.includes(query) || tags.includes(query);
      const matchesCategory = category === 'all' || cat.includes(category);

      if (matchesQuery && matchesCategory) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterWorks);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterWorks();
    });
  });


  // =========================================================================
  // 8. HORIZONTAL DRAGGABLE CAROUSEL (Section 7)
  // =========================================================================
  const carousel = document.querySelector('.world-carousel-wrapper');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (carousel) {
    let isDown = false;
    let startX, scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      carousel.style.cursor = 'grabbing';
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
      isDown = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseup', () => {
      isDown = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.6;
      carousel.scrollLeft = scrollLeft - walk;
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -320, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: 320, behavior: 'smooth' });
      });
    }
  }


  // =========================================================================
  // 9. FLOATING ROCKS MOUSE PARALLAX (Section 9)
  // =========================================================================
  const rocksLayer = document.querySelector('.floating-rocks-layer');
  const rocks = document.querySelectorAll('.cosmic-rock');

  if (rocksLayer && rocks.length > 0) {
    window.addEventListener('mousemove', (e) => {
      const xRatio = (e.clientX / window.innerWidth) - 0.5;
      const yRatio = (e.clientY / window.innerHeight) - 0.5;

      rocks.forEach((rock, idx) => {
        const factor = (idx + 1) * 14;
        rock.style.transform = `translate(${xRatio * factor}px, ${yRatio * factor}px)`;
      });
    });
  }


  // =========================================================================
  // 10. FULLSCREEN LIGHTBOX & 4K VIDEO MODAL
  // =========================================================================
  const lightbox = document.getElementById('cosmos-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');

  // Collect all interactive cards across the page
  const clickables = Array.from(document.querySelectorAll('[data-lightbox="true"], .orbit-card, .moodboard-card, .resurface-item, .world-card'));
  let currentIndex = 0;

  function openLightbox(item) {
    if (!item || !lightbox) return;
    currentIndex = clickables.indexOf(item);
    if (currentIndex === -1) currentIndex = 0;

    const src = item.getAttribute('data-src') || (item.querySelector('img') ? item.querySelector('img').src : '');
    const title = item.getAttribute('data-title') || 'Work Exhibition';
    const videoId = item.getAttribute('data-video-id');

    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCounter) lightboxCounter.textContent = '';

    if (videoId) {
      if (lightboxImg) lightboxImg.style.display = 'none';
      if (lightboxVideo) {
        lightboxVideo.style.display = 'block';
        lightboxVideo.innerHTML = `
          <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1" 
            title="4K Video Player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen 
            style="width:100%; height:100%; border-radius:10px; border:0;">
          </iframe>
        `;
      }
    } else {
      if (lightboxVideo) {
        lightboxVideo.style.display = 'none';
        lightboxVideo.innerHTML = '';
      }
      if (lightboxImg) {
        lightboxImg.style.display = 'block';
        lightboxImg.src = src;
        lightboxImg.alt = title;
      }
    }

    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightboxModal() {
    if (!lightbox) return;
    lightbox.style.display = 'none';
    if (lightboxVideo) lightboxVideo.innerHTML = '';
    document.body.style.overflow = '';
  }

  clickables.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't intercept normal links if they lead elsewhere
      if (card.tagName === 'A' && card.getAttribute('href') && card.getAttribute('href').startsWith('#') === false && !card.getAttribute('data-src') && !card.getAttribute('data-video-id')) {
        return;
      }
      e.preventDefault();
      openLightbox(card);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightboxModal);
  if (lbPrev) {
    lbPrev.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + clickables.length) % clickables.length;
      openLightbox(clickables[currentIndex]);
    });
  }
  if (lbNext) {
    lbNext.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % clickables.length;
      openLightbox(clickables[currentIndex]);
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightboxModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.style.display === 'flex') {
      if (e.key === 'Escape') closeLightboxModal();
      if (e.key === 'ArrowLeft' && lbPrev) lbPrev.click();
      if (e.key === 'ArrowRight' && lbNext) lbNext.click();
    }
  });


  // =========================================================================
  // 11. INTERACTIVE WAITLIST / COLLAB PILL SUBMIT
  // =========================================================================
  const waitlistForms = document.querySelectorAll('.waitlist-form');
  waitlistForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button[type="submit"]');
      if (btn && input && input.value) {
        btn.textContent = 'Connected ✓';
        btn.style.background = '#10b981';
        btn.style.color = '#fff';
        input.value = '';
        setTimeout(() => {
          btn.textContent = 'Let\'s Collab';
          btn.style.background = '';
          btn.style.color = '';
        }, 3500);
      }
    });
  });

});
