// ==========================================================================
// Felix Kern Portfolio — Interactive Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Project Image Mapping for Interactive Hover Swap
  const projectImages = {
    'Scarlet energy': 'https://cdn.prod.website-files.com/6ab6692b52b5a2110575e145/6aba5bf481518bc8071b7636_1%20(3).jpg',
    'Canal morning': 'https://cdn.prod.website-files.com/6ab6692b52b5a2110575e145/6ab6692b52b5a2110575e231_2.jpg',
    'Chromatic mood': 'https://cdn.prod.website-files.com/6ab6692b52b5a2110575e145/6ab6692b52b5a2110575e236_3.jpg',
    'Coastal contrast': 'https://cdn.prod.website-files.com/6ab6692b52b5a2110575e145/6ab6692b52b5a2110575e235_4.jpg',
    'Architectural motion': 'https://cdn.prod.website-files.com/6ab6692b52b5a2110575e145/6ab6692b52b5a2110575e234_6.jpg',
    'Thrown moment': 'https://cdn.prod.website-files.com/6ab6692b52b5a2110575e145/6ab6692b52b5a2110575e233_7.jpg',
    'Pool geometry': 'https://cdn.prod.website-files.com/6ab6692b52b5a2110575e145/6ab6692b52b5a2110575e232_5.jpg',
    'Classical power': 'https://cdn.prod.website-files.com/6ab6692b52b5a2110575e145/6ab6692b52b5a2110575e237_8.jpg'
  };

  const heroImg = document.querySelector('.hero-image-wrapper .image.bg-image');
  const defaultHeroSrc = heroImg ? heroImg.getAttribute('src') : '';

  const workItems = document.querySelectorAll('.list-work-block');
  workItems.forEach(item => {
    const nameEl = item.querySelector('.name-wrapper h3');
    const projectName = nameEl ? nameEl.textContent.trim() : '';

    item.addEventListener('mouseenter', () => {
      if (heroImg && projectImages[projectName]) {
        heroImg.style.transition = 'opacity 0.2s ease';
        heroImg.style.opacity = '0.7';
        setTimeout(() => {
          heroImg.src = projectImages[projectName];
          heroImg.style.opacity = '1';
        }, 100);
      }
    });

    item.addEventListener('mouseleave', () => {
      if (heroImg && defaultHeroSrc) {
        heroImg.style.transition = 'opacity 0.2s ease';
        heroImg.src = defaultHeroSrc;
        heroImg.style.opacity = '1';
      }
    });

    // Lightbox modal preview on click
    item.addEventListener('click', (e) => {
      e.preventDefault();
      if (projectImages[projectName]) {
        openModal(projectName, projectImages[projectName]);
      }
    });
  });

  // 2. Menu [+] and [-] Toggle
  const menuButton = document.querySelector('.menu-button.plus');
  const menuInfo = document.querySelector('.menu-info');
  let isMenuOpen = false;

  if (menuButton && menuInfo) {
    menuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      isMenuOpen = !isMenuOpen;
      if (isMenuOpen) {
        menuInfo.style.display = 'block';
        menuButton.querySelector('.body-font').textContent = '[-]';
      } else {
        menuInfo.style.display = '';
        menuButton.querySelector('.body-font').textContent = '[+]';
      }
    });
  }

  // 3. Simple Minimalist Lightbox Modal
  const modal = document.createElement('div');
  modal.id = 'minimal-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.92);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: pointer;
    padding: 2rem;
  `;
  modal.innerHTML = `
    <div style="position: relative; max-width: 900px; width: 100%; text-align: center;">
      <span style="position: absolute; top: -35px; right: 0; color: #fff; font-family: 'IBM Plex Mono', monospace; font-size: 14px; cursor: pointer;">[ESC / CLOSE]</span>
      <img id="modal-img" src="" style="max-height: 80vh; max-width: 100%; border: 1px solid #333; display: inline-block;">
      <div id="modal-caption" style="color: #aaa; font-family: 'IBM Plex Mono', monospace; font-size: 12px; margin-top: 12px;"></div>
    </div>
  `;
  document.body.appendChild(modal);

  function openModal(title, imgSrc) {
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    modalImg.src = imgSrc;
    modalCaption.textContent = `[Project: ${title}]`;
    modal.style.display = 'flex';
  }

  modal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.style.display = 'none';
  });
});
