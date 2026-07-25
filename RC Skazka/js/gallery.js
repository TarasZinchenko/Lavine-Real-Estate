/**
 * Gallery — Lightbox logic for the visual overview gallery items (images & videos)
 */
(function () {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (!lightbox) return;

  let currentSources = [];
  let currentIndex = 0;

  function collectSources() {
    currentSources = [];
    document.querySelectorAll('.gallery-item[data-src]').forEach(el => {
      currentSources.push({
        src: el.dataset.src,
        type: el.dataset.type || 'image'
      });
    });
  }

  function showMedia(index) {
    const item = currentSources[index];
    if (!item) return;

    if (item.type === 'video') {
      if (lightboxImg) lightboxImg.style.display = 'none';
      if (lightboxVideo) {
        lightboxVideo.src = item.src;
        lightboxVideo.style.display = 'block';
        lightboxVideo.play().catch(e => console.log('Autoplay prevented', e));
      }
    } else {
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
        lightboxVideo.style.display = 'none';
      }
      if (lightboxImg) {
        lightboxImg.src = item.src;
        lightboxImg.style.display = 'block';
      }
    }
  }

  function openLightbox(src) {
    collectSources();
    currentIndex = currentSources.findIndex(item => item.src === src);
    if (currentIndex === -1) currentIndex = 0;

    showMedia(currentIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = '';
    }
  }

  function navigate(dir) {
    if (currentSources.length === 0) return;
    currentIndex = (currentIndex + dir + currentSources.length) % currentSources.length;
    showMedia(currentIndex);
  }

  // Click handlers
  document.querySelectorAll('.gallery-item[data-src]').forEach(el => {
    el.addEventListener('click', () => openLightbox(el.dataset.src));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigate(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
})();
