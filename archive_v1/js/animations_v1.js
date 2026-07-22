/**
 * Scroll-driven animations — IntersectionObserver based reveals + counter animation
 */
(function () {
  /* --- Reveal on scroll --- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Remove will-change after animation completes to free GPU memory
        setTimeout(() => { entry.target.style.willChange = 'auto'; }, 1000);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* --- Counter animation --- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 1800;
        const start = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* --- Staggered children animation for cards --- */
  const staggerContainers = document.querySelectorAll('.location-cards, .about-features');
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          child.style.transition = `opacity 0.5s ${i * 0.1}s, transform 0.5s ${i * 0.1}s`;
          child.style.opacity = '0';
          child.style.transform = 'translateY(20px)';
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, 50);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  staggerContainers.forEach(el => staggerObserver.observe(el));

  /* --- Parallax effect on about image --- */
  const aboutImg = document.getElementById('aboutImg');
  if (aboutImg) {
    window.addEventListener('scroll', () => {
      const rect = aboutImg.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        aboutImg.style.transform = `scale(1.05) translateY(${(progress - 0.5) * -20}px)`;
      }
    }, { passive: true });
  }
})();
