/**
 * Navigation & Menu UX Handler
 * Author: Antigravity
 */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav');
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    const sections = document.querySelectorAll('section[id]');
    const NAV_HEIGHT = 80;

    // 1. Navigation Scroll State (.scrolled)
    function handleScroll() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init state

    // 2. Mobile Menu Toggle
    if (burger && mobileMenu) {
      burger.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('open');
        burger.querySelectorAll('span').forEach((bar, i) => {
          if (mobileMenu.classList.contains('open')) {
            if (i === 0) bar.style.transform = 'translateY(7.5px) rotate(45deg)';
            if (i === 1) bar.style.opacity = '0';
            if (i === 2) bar.style.transform = 'translateY(-7.5px) rotate(-45deg)';
          } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
          }
        });
      });

      // Auto close mobile menu when link is clicked
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('open');
          burger.querySelectorAll('span').forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
          });
        });
      });

      // Close when clicking outside mobile menu
      document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && e.target !== burger) {
          mobileMenu.classList.remove('open');
          burger.querySelectorAll('span').forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
          });
        }
      });
    }

    // 3. Smooth Scroll with Nav Height Offset
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            e.preventDefault();
            const offsetTop = targetSection.offsetTop - (nav.classList.contains('scrolled') ? 70 : NAV_HEIGHT);
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // 4. Active Navigation Link Highlighting on Scroll
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -80% 0px', // Highlights as section passes through viewport focus
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  });
})();
