// ==========================================================================
// Framehaus — Interactive Enhancements
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const menuBtn = document.querySelector('.nav-menu_button');
  const navMenu = document.querySelector('.nav-menu');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('w--nav-menu-open') || navMenu.style.display === 'block';
      if (isOpen) {
        navMenu.classList.remove('w--nav-menu-open');
        navMenu.style.display = '';
        menuBtn.classList.remove('w--open');
      } else {
        navMenu.classList.add('w--nav-menu-open');
        navMenu.style.display = 'block';
        menuBtn.classList.add('w--open');
      }
    });

    // Close menu when clicking any nav link
    document.querySelectorAll('.nav-link.is-nav').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('w--nav-menu-open');
        navMenu.style.display = '';
        menuBtn.classList.remove('w--open');
      });
    });
  }

  // 2. Smooth Scrolling for Navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 3. Contact Form Submission Handling
  const contactForm = document.getElementById('wf-form-Contact-Form');
  const successMessage = document.querySelector('.success-message');
  const errorMessage = document.querySelector('.error-message');

  if (contactForm && successMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('input[type="submit"]');
      const originalValue = submitBtn ? submitBtn.value : 'Submit';
      if (submitBtn) submitBtn.value = 'Sending...';

      setTimeout(() => {
        contactForm.style.display = 'none';
        successMessage.style.display = 'block';
      }, 600);
    });
  }

  // 4. Hero 3D Typography Layer Effect on Mouse Movement
  const heroWrapper = document.querySelector('.hero_wrapper');
  if (heroWrapper) {
    const layer2 = heroWrapper.querySelectorAll('.hero_heading-wrapper.is-layer2');
    const layer3 = heroWrapper.querySelectorAll('.hero_heading-wrapper.is-layer3');

    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      layer2.forEach((el, index) => {
        const factor = index === 0 ? 1 : -1;
        el.style.transform = `translate3d(${x * 0.4 * factor}px, ${y * 0.4 * factor}px, 0)`;
      });

      layer3.forEach((el, index) => {
        const factor = index === 0 ? 1 : -1;
        el.style.transform = `translate3d(${x * 0.8 * factor}px, ${y * 0.8 * factor}px, 0)`;
      });
    });
  }

  // 5. Image Reveal & Interactive Hover Highlights
  const workCards = document.querySelectorAll('.work-feature_card');
  workCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const img = card.querySelector('.featured-work_image');
      if (img) img.style.transform = 'scale(1.03)';
    });
    card.addEventListener('mouseleave', () => {
      const img = card.querySelector('.featured-work_image');
      if (img) img.style.transform = 'scale(1)';
    });
  });
});
