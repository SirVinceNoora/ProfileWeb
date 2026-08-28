const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('is-open', !isOpen);
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.project-card, .section-heading').forEach((element, index) => {
  element.style.setProperty('--reveal-delay', `${index * 70}ms`);
  element.classList.add('reveal');
  revealObserver.observe(element);
});

const videoLightbox = document.createElement('div');
videoLightbox.className = 'video-lightbox';
videoLightbox.hidden = true;
videoLightbox.innerHTML = '<button class="video-lightbox-close" type="button" aria-label="Close video">Close</button><video controls playsinline></video>';
document.body.append(videoLightbox);

const lightboxVideo = videoLightbox.querySelector('video');
const closeVideoLightbox = () => {
  lightboxVideo.pause();
  lightboxVideo.removeAttribute('src');
  lightboxVideo.load();
  videoLightbox.hidden = true;
  document.body.classList.remove('video-lightbox-open');
};

document.querySelectorAll('.project-video video').forEach((video) => {
  const openVideoLightbox = (event) => {
    event.preventDefault();
    event.stopPropagation();
    lightboxVideo.src = video.currentSrc || video.querySelector('source').src;
    videoLightbox.hidden = false;
    document.body.classList.add('video-lightbox-open');
    lightboxVideo.play();
  };

  video.addEventListener('click', openVideoLightbox);
  video.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') openVideoLightbox(event);
  });
});

videoLightbox.querySelector('.video-lightbox-close').addEventListener('click', closeVideoLightbox);
videoLightbox.addEventListener('click', (event) => {
  if (event.target === videoLightbox) closeVideoLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !videoLightbox.hidden) closeVideoLightbox();
});
