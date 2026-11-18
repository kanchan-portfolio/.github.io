/**
 * COSMOS — Kanchan Choudhary Portfolio Interactive Engine
 * Recreates the exact micro-interactions and smooth physics of Cosmos (cosmos.so)
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. CINEMATIC SPLIT-SHUTTER PRELOADER (Jason Bergh Director UI Style)
  // =========================================================================
  const loader = document.getElementById('cosmos-loader');
  const loaderPhrase = document.getElementById('loader-phrase');
  const counter = document.getElementById('loader-counter');
  const logoLeft = document.getElementById('shutter-logo-left');
  const logoRight = document.getElementById('shutter-logo-right');
  const skipBtn = document.getElementById('loader-skip-btn');

  let isDismissed = false;

  function dismissLoaderInstant() {
    if (isDismissed || !loader) return;
    isDismissed = true;
    loader.classList.add('is-opening');
    if (logoLeft) logoLeft.classList.add('visible');
    if (logoRight) logoRight.classList.add('visible');
    if (loaderPhrase) loaderPhrase.classList.remove('visible');
    if (counter) counter.classList.remove('visible');

    setTimeout(() => {
      loader.classList.add('loaded');
    }, 700);
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissLoaderInstant();
    });
  }

  if (loader) {
    loader.addEventListener('click', () => {
      dismissLoaderInstant();
    });

    // Step 1: Fade in phrase "Intimate, Raw / Human Storytelling"
    setTimeout(() => {
      if (isDismissed) return;
      if (loaderPhrase) loaderPhrase.classList.add('visible');
    }, 150);

    // Step 2: Fade out phrase, show counter
    setTimeout(() => {
      if (isDismissed) return;
      if (loaderPhrase) loaderPhrase.classList.remove('visible');
    }, 1400);

    setTimeout(() => {
      if (isDismissed) return;
      if (counter) {
        counter.classList.add('visible');
        let count = 1;
        const countInterval = setInterval(() => {
          if (isDismissed) {
            clearInterval(countInterval);
            return;
          }
          count += Math.floor(Math.random() * 8) + 4;
          if (count >= 100) {
            count = 100;
            counter.textContent = '100';
            clearInterval(countInterval);

            // Step 3: Counter fades out, reveal split logotype "Kanchan" & "Choudhary"
            setTimeout(() => {
              if (isDismissed) return;
              counter.classList.remove('visible');
              if (logoLeft) logoLeft.classList.add('visible');
              if (logoRight) logoRight.classList.add('visible');

              // Step 4: Shutter splits open!
              setTimeout(() => {
                if (isDismissed) return;
                loader.classList.add('is-opening');

                // Step 5: Complete dismiss
                setTimeout(() => {
                  isDismissed = true;
                  loader.classList.add('loaded');
                }, 850);

              }, 500);

            }, 250);

          } else {
            counter.textContent = count < 10 ? `0${count}` : `${count}`;
          }
        }, 32);
      }
    }, 1750);
  }


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
  const clickables = Array.from(document.querySelectorAll('[data-lightbox="true"], .orbit-card, .moodboard-card, .resurface-item, .world-card, .reel-card'));
  let currentIndex = 0;

  function openLightbox(item) {
    if (!item || !lightbox) return;
    currentIndex = clickables.indexOf(item);
    if (currentIndex === -1) currentIndex = 0;

    const src = item.getAttribute('data-src') || (item.querySelector('img') ? item.querySelector('img').src : '');
    const title = item.getAttribute('data-title') || 'Work Exhibition';
    const videoId = item.getAttribute('data-video-id');
    const reelUrl = item.getAttribute('data-reel-url');
    const embedUrl = item.getAttribute('data-embed-url');

    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCounter) lightboxCounter.textContent = '';

    if (reelUrl) {
      if (lightboxImg) lightboxImg.style.display = 'none';
      if (lightboxVideo) {
        lightboxVideo.style.display = 'block';
        lightboxVideo.className = 'lightbox-video-container is-reel';
        lightboxVideo.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; gap:14px; padding:10px 0;">
            <iframe src="${embedUrl || reelUrl + 'embed/'}" 
              title="${title}"
              frameborder="0"
              scrolling="no"
              allowtransparency="true"
              allowfullscreen="true"
              style="width: 100%; max-width: 380px; height: 520px; border-radius: 12px; border: 1px solid var(--card-border); background: #000;">
            </iframe>
            <a href="${reelUrl}" target="_blank" rel="noopener noreferrer" class="craft-pill" style="padding:10px 24px; font-size:13px; font-weight:600; text-decoration:none; background:linear-gradient(45deg, #f09433, #dc2743, #bc1888); color:#fff; border:none; display:inline-flex; align-items:center; gap:8px;">
              <span>Watch Episode on Instagram</span> &rarr;
            </a>
          </div>
        `;
      }
    } else if (videoId) {
      if (lightboxImg) lightboxImg.style.display = 'none';
      if (lightboxVideo) {
        lightboxVideo.style.display = 'block';
        lightboxVideo.className = 'lightbox-video-container';
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
        lightboxVideo.className = 'lightbox-video-container';
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
    if (lightboxVideo) {
      lightboxVideo.innerHTML = '';
      lightboxVideo.className = 'lightbox-video-container';
    }
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


  // =========================================================================
  // 12. 3D CYLINDRICAL CURVED PANORAMA EXHIBITION (Dusk & Moss Inspired)
  // =========================================================================
  const panoramaViewport = document.getElementById('panorama-viewport');
  const panoramaCards = document.querySelectorAll('.panorama-card');
  const panoramaPrevBtn = document.getElementById('panorama-prev-btn');
  const panoramaNextBtn = document.getElementById('panorama-next-btn');
  const dotsContainer = document.getElementById('panorama-dots-container');
  const activeTitle = document.getElementById('panorama-active-title');
  const activeTag = document.getElementById('panorama-active-tag');
  const activeDesc = document.getElementById('panorama-active-desc');
  const activeBtn = document.getElementById('panorama-active-btn');

  if (panoramaViewport && panoramaCards.length > 0) {
    const totalCards = panoramaCards.length;
    const angleStep = 360 / totalCards; // 36 deg per card
    let currentAngle = 0;
    let targetAngle = 0;
    let isDragging = false;
    let startX = 0;
    let lastActiveIdx = -1;
    let isHovered = false;

    // Create Navigation Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('button');
        dot.className = `panorama-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to scene ${i + 1}`);
        dot.addEventListener('click', () => {
          targetAngle = -i * angleStep;
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updatePlaque(card, idx) {
      if (idx === lastActiveIdx) return;
      lastActiveIdx = idx;

      const title = card.getAttribute('data-title') || '';
      const tag = card.getAttribute('data-tag') || '';
      const desc = card.getAttribute('data-desc') || '';
      const src = card.getAttribute('data-src') || '';

      if (activeTitle) activeTitle.textContent = title;
      if (activeTag) activeTag.innerHTML = tag;
      if (activeDesc) activeDesc.textContent = desc;
      if (activeBtn) {
        activeBtn.setAttribute('data-src', src);
        activeBtn.setAttribute('data-title', title);
      }

      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.panorama-dot');
        dots.forEach((d, dIdx) => {
          d.classList.toggle('active', dIdx === idx);
        });
      }
    }

    function renderCylinder() {
      const radius = window.innerWidth < 768 ? 480 : (window.innerWidth < 1200 ? 620 : 720);

      // Autoplay drift when user is not dragging or hovering
      if (!isDragging && !isHovered) {
        targetAngle -= 0.04;
      }

      // Smooth Lerp
      currentAngle += (targetAngle - currentAngle) * 0.1;

      let closestIdx = 0;
      let minDiff = 9999;

      panoramaCards.forEach((card, idx) => {
        // Angular difference from 0 (center)
        let diff = ((idx * angleStep + currentAngle) % 360 + 540) % 360 - 180;
        const absDiff = Math.abs(diff);

        if (absDiff < minDiff) {
          minDiff = absDiff;
          closestIdx = idx;
        }

        if (absDiff > 96) {
          card.style.display = 'none';
        } else {
          card.style.display = 'block';
          const rad = diff * (Math.PI / 180);
          const x = Math.sin(rad) * radius;
          const z = (Math.cos(rad) - 1) * radius;
          const rotY = -diff;

          card.style.transform = `translateX(${x.toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg)`;

          const opacity = Math.max(0.12, 1 - Math.pow(absDiff / 96, 1.6) * 0.78);
          card.style.opacity = opacity.toFixed(2);

          if (absDiff < angleStep / 2) {
            card.classList.add('is-center');
          } else {
            card.classList.remove('is-center');
          }
        }
      });

      updatePlaque(panoramaCards[closestIdx], closestIdx);
      requestAnimationFrame(renderCylinder);
    }

    renderCylinder();

    // Drag / Touch Event Listeners
    panoramaViewport.addEventListener('mouseenter', () => { isHovered = true; });
    panoramaViewport.addEventListener('mouseleave', () => { 
      isHovered = false; 
      isDragging = false; 
    });

    panoramaViewport.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      targetAngle += deltaX * 0.22;
      startX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        // Snap to nearest scene
        targetAngle = Math.round(targetAngle / angleStep) * angleStep;
      }
    });

    // Touch Support for Mobile / iPad
    panoramaViewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - startX;
      targetAngle += deltaX * 0.24;
      startX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        targetAngle = Math.round(targetAngle / angleStep) * angleStep;
      }
    });

    // Click on Card
    panoramaCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (!card.classList.contains('is-center')) {
          targetAngle = -idx * angleStep;
        }
      });
    });

    // Arrow Buttons
    if (panoramaPrevBtn) {
      panoramaPrevBtn.addEventListener('click', () => {
        targetAngle = Math.round(targetAngle / angleStep) * angleStep + angleStep;
      });
    }

    if (panoramaNextBtn) {
      panoramaNextBtn.addEventListener('click', () => {
        targetAngle = Math.round(targetAngle / angleStep) * angleStep - angleStep;
      });
    }
  }

});
