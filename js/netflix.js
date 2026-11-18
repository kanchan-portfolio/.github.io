/**
 * NETFLIX CINEMA UI ENGINE FOR KANCHAN CHOUDHARY WORKS ARCHIVE
 * Handles horizontal slider rails, paddle navigation, hover previews,
 * modal dialogs, real-time search, local watchlist ("My List"), and likes.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. DATA INITIALIZATION & REGISTRY
  // --------------------------------------------------------------------------
  const allCards = Array.from(document.querySelectorAll('.netflix-card'));
  const cardDataRegistry = new Map();

  allCards.forEach((card, idx) => {
    const data = {
      id: `card-${idx}`,
      src: card.getAttribute('data-src') || '',
      title: card.getAttribute('data-title') || 'Untitled Work',
      cat: card.getAttribute('data-cat') || 'Editorial Collection',
      videoId: card.getAttribute('data-video-id') || '',
      reelUrl: card.getAttribute('data-reel-url') || '',
      embedUrl: card.getAttribute('data-embed-url') || '',
      year: card.getAttribute('data-year') || '2024',
      match: card.getAttribute('data-match') || `${94 + (idx % 6)}%`,
      rating: card.getAttribute('data-rating') || 'U/A 16+',
      res: card.getAttribute('data-res') || '4K Ultra HD',
      synopsis: card.getAttribute('data-synopsis') || '',
      disciplines: card.getAttribute('data-disciplines') || 'Costume Design • Visual Direction • Editorial Styling'
    };

    if (!data.synopsis) {
      if (data.videoId) {
        data.synopsis = `An intimate in-depth masterclass exploring the craft of performance, cinematic screenwriting, and the synthesis of narrative character design with world-renowned industry veterans.`;
      } else if (data.reelUrl) {
        data.synopsis = `Episode from the episodic visual narrative 'Taana Baana — Mulaqaat'. Explores unspoken human intimacy, tactile garment drapery, and vintage cinema aesthetics through evocative character arcs.`;
      } else {
        data.synopsis = `High-resolution studio and location visual study by Kanchan Choudhary. Focuses on precision fabric textures, architectural silhouettes, chiaroscuro lighting, and character authenticity.`;
      }
    }

    cardDataRegistry.set(card, data);
  });

  // --------------------------------------------------------------------------
  // 2. NAVBAR SCROLL EFFECT
  // --------------------------------------------------------------------------
  const netflixNav = document.querySelector('.netflix-nav');
  function handleNavScroll() {
    if (!netflixNav) return;
    if (window.scrollY > 40) {
      netflixNav.classList.add('scrolled');
    } else {
      netflixNav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // --------------------------------------------------------------------------
  // 3. TOAST NOTIFICATION UTILITY
  // --------------------------------------------------------------------------
  let toastTimer = null;
  const toastEl = document.getElementById('netflix-toast');
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2500);
  }

  // --------------------------------------------------------------------------
  // 4. "MY LIST" & "LIKES" STATE MANAGEMENT (LocalStorage)
  // --------------------------------------------------------------------------
  function getMyList() {
    try {
      return JSON.parse(localStorage.getItem('kc_netflix_my_list') || '[]');
    } catch (e) {
      return [];
    }
  }

  function setMyList(list) {
    try {
      localStorage.setItem('kc_netflix_my_list', JSON.stringify(list));
    } catch (e) {}
    updateMyListUI();
  }

  function getLikes() {
    try {
      return JSON.parse(localStorage.getItem('kc_netflix_likes') || '[]');
    } catch (e) {
      return [];
    }
  }

  function setLikes(list) {
    try {
      localStorage.setItem('kc_netflix_likes', JSON.stringify(list));
    } catch (e) {}
  }

  function updateMyListUI() {
    const list = getMyList();
    const badge = document.getElementById('my-list-count');
    if (badge) {
      badge.textContent = list.length;
      badge.style.display = list.length > 0 ? 'inline-block' : 'none';
    }

    // Update active state on all list buttons across cards
    allCards.forEach(card => {
      const data = cardDataRegistry.get(card);
      if (!data) return;
      const btn = card.querySelector('.btn-add-list');
      if (btn) {
        const inList = list.includes(data.title);
        if (inList) {
          btn.classList.add('is-active');
          btn.innerHTML = '✓';
          btn.title = 'Remove from My List';
        } else {
          btn.classList.remove('is-active');
          btn.innerHTML = '+';
          btn.title = 'Add to My List';
        }
      }
    });

    // Populate or sync the dedicated My List row if present
    const myListRow = document.getElementById('row-my-list');
    const myListTrack = document.getElementById('my-list-track');
    if (myListRow && myListTrack) {
      if (list.length === 0) {
        myListRow.style.display = 'none';
        myListTrack.innerHTML = '';
      } else {
        myListRow.style.display = 'block';
        myListTrack.innerHTML = '';
        allCards.forEach(card => {
          const data = cardDataRegistry.get(card);
          if (data && list.includes(data.title)) {
            const clone = card.cloneNode(true);
            clone.removeAttribute('id');
            attachCardEvents(clone, data);
            myListTrack.appendChild(clone);
          }
        });
      }
    }
  }

  function updateLikesUI() {
    const likes = getLikes();
    allCards.forEach(card => {
      const data = cardDataRegistry.get(card);
      if (!data) return;
      const btn = card.querySelector('.btn-like');
      if (btn) {
        const isLiked = likes.includes(data.title);
        if (isLiked) {
          btn.classList.add('is-active');
          btn.title = 'Rated (Click to undo)';
        } else {
          btn.classList.remove('is-active');
          btn.title = 'I like this';
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. HORIZONTAL SLIDER PADDLE NAVIGATION
  // --------------------------------------------------------------------------
  const sliderWraps = document.querySelectorAll('.netflix-slider-wrap');
  sliderWraps.forEach(wrap => {
    const track = wrap.querySelector('.netflix-slider-track');
    const prevBtn = wrap.querySelector('.slider-paddle.prev');
    const nextBtn = wrap.querySelector('.slider-paddle.next');

    if (!track) return;

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const scrollAmount = Math.max(300, track.clientWidth * 0.75);
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const scrollAmount = Math.max(300, track.clientWidth * 0.75);
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }
  });

  // --------------------------------------------------------------------------
  // 6. NETFLIX DETAIL MODAL ("MORE INFO")
  // --------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('netflix-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalMediaHeader = document.getElementById('modal-media-header');
  const modalTitleText = document.getElementById('modal-title-text');
  const modalMatchPct = document.getElementById('modal-match-pct');
  const modalCertBox = document.getElementById('modal-cert-box');
  const modalResBox = document.getElementById('modal-res-box');
  const modalSynopsis = document.getElementById('modal-synopsis');
  const modalSidebarCol = document.getElementById('modal-sidebar-col');
  const modalRecsGrid = document.getElementById('modal-recommendations-grid');
  const modalPlayBtn = document.getElementById('modal-play-btn');
  const modalAddListBtn = document.getElementById('modal-add-list-btn');
  const modalLikeBtn = document.getElementById('modal-like-btn');

  let currentModalData = null;

  function openNetflixModal(data) {
    if (!modalBackdrop || !data) return;
    currentModalData = data;

    // Title
    if (modalTitleText) modalTitleText.textContent = data.title;

    // Badges
    if (modalMatchPct) modalMatchPct.textContent = data.match;
    if (modalCertBox) modalCertBox.textContent = data.rating;
    if (modalResBox) modalResBox.textContent = data.res;

    // Synopsis
    if (modalSynopsis) {
      modalSynopsis.innerHTML = `
        <p style="margin: 0 0 16px 0;">${data.synopsis}</p>
        <p style="margin: 0; color: rgba(255, 255, 255, 0.65); font-size: 0.88rem;">
          Captured in high-fidelity 4K format with uncompromised artistic integrity. Designed and styled exclusively for narrative impact.
        </p>
      `;
    }

    // Sidebar credits
    if (modalSidebarCol) {
      modalSidebarCol.innerHTML = `
        <div style="margin-bottom: 12px;"><strong>Costume & Styling:</strong> <span>Kanchan Choudhary</span></div>
        <div style="margin-bottom: 12px;"><strong>Curated Category:</strong> <span>${data.cat}</span></div>
        <div style="margin-bottom: 12px;"><strong>Visual Disciplines:</strong> <span>${data.disciplines}</span></div>
        <div style="margin-bottom: 12px;"><strong>Master Quality:</strong> <span>${data.res} Master</span></div>
        <div><strong>Archive Year:</strong> <span>${data.year}</span></div>
      `;
    }

    // Media Player / Still Header
    if (modalMediaHeader) {
      if (data.videoId) {
        modalMediaHeader.innerHTML = `
          <div class="modal-video-frame-wrap">
            <iframe 
              src="https://www.youtube-nocookie.com/embed/${data.videoId}?autoplay=1&rel=0&modestbranding=1" 
              title="${data.title}" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
          <div class="modal-header-gradient"></div>
        `;
      } else if (data.reelUrl) {
        modalMediaHeader.innerHTML = `
          <div class="modal-video-frame-wrap" style="background:#0a0a0a;">
            <iframe 
              src="${data.embedUrl || data.reelUrl + 'embed/'}" 
              title="${data.title}" 
              scrolling="no" 
              allowtransparency="true" 
              allowfullscreen 
              style="width:100%; max-width:420px; height:100%; border:none;">
            </iframe>
          </div>
          <div class="modal-header-gradient"></div>
        `;
      } else {
        modalMediaHeader.innerHTML = `
          <img src="${data.src}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover; display:block;"/>
          <div class="modal-header-gradient"></div>
        `;
      }
    }

    // Modal action buttons state
    const myList = getMyList();
    const isSaved = myList.includes(data.title);
    if (modalAddListBtn) {
      if (isSaved) {
        modalAddListBtn.classList.add('is-active');
        modalAddListBtn.innerHTML = '✓ In My List';
      } else {
        modalAddListBtn.classList.remove('is-active');
        modalAddListBtn.innerHTML = '+ My List';
      }
    }

    const likes = getLikes();
    const isLiked = likes.includes(data.title);
    if (modalLikeBtn) {
      if (isLiked) {
        modalLikeBtn.classList.add('is-active');
      } else {
        modalLikeBtn.classList.remove('is-active');
      }
    }

    // Render "More Like This" Recommendations
    if (modalRecsGrid) {
      modalRecsGrid.innerHTML = '';
      // Pick other cards from the same category or random
      const sameCat = allCards
        .map(c => cardDataRegistry.get(c))
        .filter(d => d && d.title !== data.title && d.cat === data.cat);

      const pool = sameCat.length >= 3 ? sameCat : allCards.map(c => cardDataRegistry.get(c)).filter(d => d && d.title !== data.title);
      const recs = pool.slice(0, 6);

      recs.forEach(rec => {
        const item = document.createElement('div');
        item.className = 'modal-rec-card';
        item.innerHTML = `
          <div class="modal-rec-thumb">
            <img src="${rec.src}" alt="${rec.title}" loading="lazy"/>
            ${rec.videoId || rec.reelUrl ? '<span class="card-video-indicator" style="top:6px; right:6px;">▶ VIDEO</span>' : ''}
          </div>
          <div class="modal-rec-body">
            <div class="modal-rec-meta">
              <span class="meta-match-pct">${rec.match}</span>
              <span class="meta-cert-box">${rec.rating}</span>
            </div>
            <h5 class="modal-rec-title">${rec.title}</h5>
          </div>
        `;
        item.addEventListener('click', () => {
          openNetflixModal(rec);
          modalBackdrop.scrollTo({ top: 0, behavior: 'smooth' });
        });
        modalRecsGrid.appendChild(item);
      });
    }

    modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeNetflixModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    if (modalMediaHeader) {
      modalMediaHeader.innerHTML = ''; // Stop video playback
    }
    document.body.style.overflow = '';
    currentModalData = null;
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeNetflixModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeNetflixModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-open')) {
      closeNetflixModal();
    }
  });

  // Modal Action Listeners
  if (modalPlayBtn) {
    modalPlayBtn.addEventListener('click', () => {
      if (!currentModalData) return;
      if (currentModalData.reelUrl) {
        window.open(currentModalData.reelUrl, '_blank', 'noopener,noreferrer');
      } else if (currentModalData.videoId) {
        window.open(`https://www.youtube.com/watch?v=${currentModalData.videoId}`, '_blank', 'noopener,noreferrer');
      } else {
        showToast('Viewing High-Resolution Master Still');
      }
    });
  }

  if (modalAddListBtn) {
    modalAddListBtn.addEventListener('click', () => {
      if (!currentModalData) return;
      const list = getMyList();
      const idx = list.indexOf(currentModalData.title);
      if (idx > -1) {
        list.splice(idx, 1);
        setMyList(list);
        modalAddListBtn.classList.remove('is-active');
        modalAddListBtn.innerHTML = '+ My List';
        showToast(`Removed "${currentModalData.title}" from My List`);
      } else {
        list.push(currentModalData.title);
        setMyList(list);
        modalAddListBtn.classList.add('is-active');
        modalAddListBtn.innerHTML = '✓ In My List';
        showToast(`Added "${currentModalData.title}" to My List`);
      }
    });
  }

  if (modalLikeBtn) {
    modalLikeBtn.addEventListener('click', () => {
      if (!currentModalData) return;
      const likes = getLikes();
      const idx = likes.indexOf(currentModalData.title);
      if (idx > -1) {
        likes.splice(idx, 1);
        setLikes(likes);
        modalLikeBtn.classList.remove('is-active');
        showToast(`Rating removed for "${currentModalData.title}"`);
      } else {
        likes.push(currentModalData.title);
        setLikes(likes);
        modalLikeBtn.classList.add('is-active');
        showToast(`Rated "${currentModalData.title}": I like this`);
      }
      updateLikesUI();
    });
  }

  // --------------------------------------------------------------------------
  // 7. CARD EVENT ATTACHMENT
  // --------------------------------------------------------------------------
  function attachCardEvents(card, data) {
    // Click on thumbnail opens modal
    const thumb = card.querySelector('.netflix-card-thumb');
    if (thumb) {
      thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        openNetflixModal(data);
      });
    }

    // Play button
    const playBtn = card.querySelector('.drawer-btn.play-circle');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openNetflixModal(data);
      });
    }

    // Add to list button
    const addBtn = card.querySelector('.btn-add-list');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const list = getMyList();
        const idx = list.indexOf(data.title);
        if (idx > -1) {
          list.splice(idx, 1);
          setMyList(list);
          showToast(`Removed "${data.title}" from My List`);
        } else {
          list.push(data.title);
          setMyList(list);
          showToast(`Added "${data.title}" to My List`);
        }
      });
    }

    // Like button
    const likeBtn = card.querySelector('.btn-like');
    if (likeBtn) {
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const likes = getLikes();
        const idx = likes.indexOf(data.title);
        if (idx > -1) {
          likes.splice(idx, 1);
          setLikes(likes);
          showToast(`Rating removed for "${data.title}"`);
        } else {
          likes.push(data.title);
          setLikes(likes);
          showToast(`Rated "${data.title}": I like this`);
        }
        updateLikesUI();
      });
    }

    // More info button
    const moreBtn = card.querySelector('.btn-more-info');
    if (moreBtn) {
      moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openNetflixModal(data);
      });
    }
  }

  allCards.forEach(card => {
    const data = cardDataRegistry.get(card);
    if (data) attachCardEvents(card, data);
  });

  // Initial Sync of My List & Likes
  updateMyListUI();
  updateLikesUI();

  // --------------------------------------------------------------------------
  // 8. BILLBOARD HERO CONTROLS
  // --------------------------------------------------------------------------
  const billboardPlayBtn = document.getElementById('billboard-play-btn');
  const billboardInfoBtn = document.getElementById('billboard-info-btn');
  const billboardMuteBtn = document.getElementById('billboard-mute-btn');

  // Featured billboard item: Taana Baana Episode 1
  const featuredItem = {
    title: 'Taana Baana — Mulaqaat | Episode 1',
    cat: 'Original Series',
    reelUrl: 'https://www.instagram.com/taana__baana_/reel/DevZG4rhivG/',
    embedUrl: 'https://www.instagram.com/reel/DevZG4rhivG/embed/',
    src: 'assets/mulaqaat_ep1.jpg',
    match: '99% Match',
    rating: 'U/A 16+',
    res: '4K Ultra HD',
    year: '2024',
    disciplines: 'Narrative Cinema • Period Costume • Auteur Styling',
    synopsis: 'A poetic three-episode visual anthology tracing unresolved memories, unspoken intimacy, and fragile threads of fate — directed with meticulous costume curation and atmospheric lighting by Kanchan Choudhary.'
  };

  if (billboardPlayBtn) {
    billboardPlayBtn.addEventListener('click', () => {
      openNetflixModal(featuredItem);
    });
  }

  if (billboardInfoBtn) {
    billboardInfoBtn.addEventListener('click', () => {
      openNetflixModal(featuredItem);
    });
  }

  let isMuted = true;
  if (billboardMuteBtn) {
    billboardMuteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (isMuted) {
        billboardMuteBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        `;
        showToast('Billboard Audio: Muted');
      } else {
        billboardMuteBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        `;
        showToast('Billboard Audio: Active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. REAL-TIME SEARCH FILTER
  // --------------------------------------------------------------------------
  const searchInput = document.getElementById('netflix-search');
  const billboardEl = document.querySelector('.netflix-billboard');
  const searchBanner = document.getElementById('search-banner');
  const searchBannerQuery = document.getElementById('search-query-text');
  const searchNoResults = document.getElementById('search-no-results');
  const allRows = Array.from(document.querySelectorAll('.netflix-row'));

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();

      if (query.length > 0) {
        if (billboardEl) billboardEl.style.display = 'none';
        if (searchBanner) {
          searchBanner.classList.add('active');
          if (searchBannerQuery) searchBannerQuery.textContent = query;
        }

        let totalVisibleCards = 0;

        allRows.forEach(row => {
          const cardsInRow = row.querySelectorAll('.netflix-card');
          let visibleInRow = 0;

          cardsInRow.forEach(card => {
            const data = cardDataRegistry.get(card);
            if (!data) return;

            const textToMatch = `${data.title} ${data.cat} ${data.disciplines} ${data.synopsis}`.toLowerCase();
            if (textToMatch.includes(query)) {
              card.style.display = 'block';
              visibleInRow++;
              totalVisibleCards++;
            } else {
              card.style.display = 'none';
            }
          });

          // Hide row if zero matching cards
          if (visibleInRow > 0) {
            row.style.display = 'block';
          } else {
            row.style.display = 'none';
          }
        });

        if (searchNoResults) {
          if (totalVisibleCards === 0) {
            searchNoResults.classList.add('active');
          } else {
            searchNoResults.classList.remove('active');
          }
        }
      } else {
        // Reset to initial state
        if (billboardEl) billboardEl.style.display = 'flex';
        if (searchBanner) searchBanner.classList.remove('active');
        if (searchNoResults) searchNoResults.classList.remove('active');

        allRows.forEach(row => {
          row.style.display = 'block';
          row.querySelectorAll('.netflix-card').forEach(card => {
            card.style.display = 'block';
          });
        });

        updateMyListUI(); // keep My List row state accurate
      }
    });
  }

  // Smooth scroll for nav anchor links
  document.querySelectorAll('.netflix-menu-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#my-list') {
        const myListRow = document.getElementById('row-my-list');
        if (myListRow && myListRow.style.display !== 'none') {
          e.preventDefault();
          myListRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          showToast('Your Watchlist is currently empty. Click "+" on any card to add items!');
        }
        return;
      }

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
});
