// ==========================================================================
// Kanchan — Photography & Videography Interactivity
// ==========================================================================

// 1. Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('kanchan-theme');
if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);
} else {
  html.setAttribute('data-theme', 'dark');
  updateThemeIcons('dark');
}

function updateThemeIcons(theme) {
  if (theme === 'light') {
    moonIcon.classList.remove('hidden');
    sunIcon.classList.add('hidden');
  } else {
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
  }
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('kanchan-theme', newTheme);
  updateThemeIcons(newTheme);
});

// 2. Mobile Menu Navigation
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

if (mobileToggle && navLinks) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// 3. Category Filter Tabs
const filterTabs = document.querySelectorAll('.filter-tab');
const galleryCards = document.querySelectorAll('.gallery-card');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.getAttribute('data-filter');

    galleryCards.forEach(card => {
      const categories = card.getAttribute('data-category') || '';
      if (filter === 'all' || categories.includes(filter)) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 200);
      }
    });
  });
});

// 4. Lightbox & Cinema Modal
const modalBackdrop = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');
const modalMediaWrap = document.getElementById('modal-media-wrap');
const modalTitle = document.getElementById('modal-title');
const modalMeta = document.getElementById('modal-meta');
const showreelTrigger = document.getElementById('showreel-trigger');

function openModal(title, meta, imgSrc, isVideo = false) {
  modalTitle.textContent = title;
  modalMeta.textContent = meta;

  if (isVideo) {
    modalMediaWrap.innerHTML = `
      <div style="position:relative; width:100%; aspect-ratio:16/9; background:#000; display:flex; align-items:center; justify-content:center; flex-direction:column; padding:2rem; text-align:center;">
        <img src="${imgSrc}" style="position:absolute; width:100%; height:100%; object-fit:cover; opacity:0.35;">
        <div style="position:relative; z-index:2;">
          <div style="font-size:3rem; margin-bottom:1rem;">▶️</div>
          <h4 style="font-size:1.4rem; color:#f8fafc; margin-bottom:0.5rem;">Cinema Reel Preview</h4>
          <p style="color:#94a3b8; font-size:0.9rem; max-width:480px;">Color graded 4K cinematic film sequence with 24fps motion cadence and high dynamic range master audio.</p>
        </div>
      </div>
    `;
  } else {
    modalMediaWrap.innerHTML = `<img src="${imgSrc}" alt="${title}">`;
  }

  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalBackdrop.classList.remove('active');
  modalMediaWrap.innerHTML = '';
  document.body.style.overflow = 'auto';
}

galleryCards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.getAttribute('data-title');
    const meta = card.getAttribute('data-meta');
    const imgSrc = card.getAttribute('data-img');
    const isVideo = card.getAttribute('data-category').includes('videography');
    openModal(title, meta, imgSrc, isVideo);
  });
});

if (showreelTrigger) {
  showreelTrigger.addEventListener('click', () => {
    openModal(
      'Official 2026 Director Showreel',
      'Runtime: 2m 14s • 4K UHD • Anamorphic Master',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=80',
      true
    );
  });
}

modalClose.addEventListener('click', closeModal);

modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
    closeModal();
  }
});

// 5. Booking Inquiry Form Handler
const bookingForm = document.getElementById('booking-form');
const bookingFeedback = document.getElementById('booking-feedback');

if (bookingForm && bookingFeedback) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('client-name').value;
    bookingFeedback.textContent = `Thank you, ${name}! Your production inquiry has been received. Kanchan will review your concept and reply within 24 hours.`;
    bookingFeedback.className = 'feedback-msg success';
    bookingFeedback.classList.remove('hidden');

    bookingForm.reset();

    setTimeout(() => {
      bookingFeedback.classList.add('hidden');
    }, 7000);
  });
}

// 6. Current Year in Footer
const currentYear = document.getElementById('current-year');
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
