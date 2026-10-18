// Theme Toggle & State
const themeToggleBtn = document.getElementById('theme-toggle');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');
const html = document.documentElement;

// Check saved theme or system preference
const savedTheme = localStorage.getItem('kanchan-theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);
} else {
  const initialTheme = systemPrefersDark ? 'dark' : 'light';
  html.setAttribute('data-theme', initialTheme);
  updateThemeIcons(initialTheme);
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

// Mobile Navigation Toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

if (mobileToggle && navLinks) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close mobile nav when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// Dynamic Current Year in Footer
const currentYearSpan = document.getElementById('current-year');
if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}

// Contact Form Submission Feedback
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

if (contactForm && formFeedback) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate successful form submission
    formFeedback.textContent = "Thank you! Your message has been sent successfully. I'll get back to you soon.";
    formFeedback.className = "form-feedback success";
    formFeedback.classList.remove('hidden');
    contactForm.reset();

    setTimeout(() => {
      formFeedback.classList.add('hidden');
    }, 5000);
  });
}
