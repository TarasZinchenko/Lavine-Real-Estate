/**
 * Reusable Before/After Image Comparison Slider
 * Author: Antigravity
 */
(function () {
  const STYLES = `
    .comparison-slider {
      position: relative;
      width: 100%;
      aspect-ratio: 4/3;
      overflow: hidden;
      border-radius: var(--radius-lg, 12px);
      border: 1px solid var(--clr-border, #2C2E35);
      box-shadow: var(--shadow, 0 10px 40px rgba(0,0,0,.5));
      user-select: none;
      -webkit-user-select: none;
      background: #000;
    }
    .comparison-slider img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      pointer-events: none;
    }
    .comparison-slider .cs-layer-before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      clip-path: inset(0 0 0 0); /* Default fully visible */
    }
    .comparison-slider .cs-layer-after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    .comparison-slider .cs-divider {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 100%;
      width: 2px;
      background: rgba(255, 255, 255, 0.85);
      filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.4));
      z-index: 5;
      pointer-events: none;
    }
    .comparison-slider .cs-handle {
      position: absolute;
      top: 50%;
      left: 100%;
      transform: translate(-50%, -50%);
      width: 28px;
      height: 28px;
      z-index: 6;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /* 48x48px Invisible Hit Target */
    .comparison-slider .cs-handle::before {
      content: '';
      position: absolute;
      width: 48px;
      height: 48px;
      cursor: ew-resize;
      pointer-events: auto;
    }
    .comparison-slider .cs-handle svg {
      width: 14px;
      height: 14px;
      fill: #FFFFFF;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
    }
    .cs-label {
      position: absolute;
      bottom: 16px;
      padding: 6px 12px;
      background: rgba(13, 14, 16, 0.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-radius: 4px;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      z-index: 4;
      border: 1px solid var(--clr-border, #2C2E35);
      color: var(--clr-text, #F3F4F6);
      pointer-events: none;
    }
    .cs-label.before { left: 16px; }
    .cs-label.after { right: 16px; }

    /* Entry Animations via JS class injection to prevent visual jump */
    .cs-animating .cs-divider,
    .cs-animating .cs-handle {
      transition: left 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
    }
    .cs-animating .cs-layer-before {
      transition: clip-path 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
    }
    .cs-settle-animation .cs-divider,
    .cs-settle-animation .cs-handle {
      transition: left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
    }
    .cs-settle-animation .cs-layer-before {
      transition: clip-path 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
    }
    
    /* Chevron bounce hint */
    .cs-bounce-handle {
      animation: cs-arrow-bounce 0.8s ease-in-out 2;
    }
    @keyframes cs-arrow-bounce {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.2); }
    }
  `;

  // Inject CSS styles dynamically
  function injectStyles() {
    if (document.getElementById('comparison-slider-styles')) return;
    const style = document.createElement('style');
    style.id = 'comparison-slider-styles';
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  // Initialize a single slider instance
  function initSlider(slider, index) {
    if (slider.dataset.csInit === 'true') return;
    slider.dataset.csInit = 'true';

    const beforeImg = slider.querySelector('.slider-img-before');
    const afterImg = slider.querySelector('.slider-img-after');
    if (!beforeImg || !afterImg) return;

    // Structure DOM layers
    const layerBefore = document.createElement('div');
    layerBefore.className = 'cs-layer-before';
    slider.insertBefore(layerBefore, beforeImg);
    layerBefore.appendChild(beforeImg);

    const layerAfter = document.createElement('div');
    layerAfter.className = 'cs-layer-after';
    slider.insertBefore(layerAfter, afterImg);
    layerAfter.appendChild(afterImg);

    // Create divider line
    const divider = document.createElement('div');
    divider.className = 'cs-divider';
    slider.appendChild(divider);

    // Create custom arrows handle
    const handle = document.createElement('div');
    handle.className = 'cs-handle';
    handle.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
      </svg>
    `;
    slider.appendChild(handle);

    // Add labels
    const beforeLabelText = slider.dataset.beforeLabel || 'Черновая';
    const afterLabelText = slider.dataset.afterLabel || 'Дизайн-проект';

    const beforeLabel = document.createElement('div');
    beforeLabel.className = 'cs-label before';
    beforeLabel.textContent = beforeLabelText;
    beforeLabel.dataset.i18n = 'slider_before';
    slider.appendChild(beforeLabel);

    const afterLabel = document.createElement('div');
    afterLabel.className = 'cs-label after';
    afterLabel.textContent = afterLabelText;
    afterLabel.dataset.i18n = 'slider_after';
    slider.appendChild(afterLabel);

    let isDragging = false;
    let width = slider.offsetWidth;
    let startX = 0;
    let startY = 0;
    let isHorizontalSwipe = false;
    let touchIntentDetermined = false;

    // Update slider position
    function updatePosition(pct) {
      pct = Math.max(0, Math.min(100, pct));
      layerBefore.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      divider.style.left = `${pct}%`;
      handle.style.left = `${pct}%`;
    }

    // Set default starting position (100% - full "before" visible)
    updatePosition(100);

    // Handle resize
    window.addEventListener('resize', () => {
      width = slider.offsetWidth;
    });

    // Start Drag
    function startDrag(clientX) {
      isDragging = true;
      slider.classList.remove('cs-animating', 'cs-settle-animation');
      handle.classList.remove('cs-bounce-handle');
      const rect = slider.getBoundingClientRect();
      const pct = ((clientX - rect.left) / width) * 100;
      updatePosition(pct);
    }

    // Move Drag
    function moveDrag(clientX) {
      if (!isDragging) return;
      const rect = slider.getBoundingClientRect();
      const pct = ((clientX - rect.left) / width) * 100;
      updatePosition(pct);
    }

    // Stop Drag
    function stopDrag() {
      isDragging = false;
    }

    // Mouse Listeners
    slider.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only left click
      startDrag(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveDrag(e.clientX);
    });

    window.addEventListener('mouseup', stopDrag);

    // Touch Listeners (Intent Detection & Scroll Pass-Through)
    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      touchIntentDetermined = false;
      isHorizontalSwipe = false;
      width = slider.offsetWidth;
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      
      const dx = Math.abs(currentX - startX);
      const dy = Math.abs(currentY - startY);

      if (!touchIntentDetermined) {
        if (dx > 10 || dy > 10) {
          touchIntentDetermined = true;
          if (dx > dy) {
            isHorizontalSwipe = true;
            isDragging = true;
            slider.classList.remove('cs-animating', 'cs-settle-animation');
            handle.classList.remove('cs-bounce-handle');
          }
        }
      }

      if (isHorizontalSwipe) {
        if (e.cancelable) e.preventDefault(); // Prevent page scroll
        moveDrag(currentX);
      }
    }, { passive: false });

    slider.addEventListener('touchend', () => {
      stopDrag();
    }, { passive: true });

    // Entry Hint Animation (once per session per slider ID/Index)
    const sessionKey = `cs_anim_played_slider_${index}`;
    
    function playEntryAnimation() {
      if (sessionStorage.getItem(sessionKey) === 'true') {
        updatePosition(80); // Settle instantly
        return;
      }
      sessionStorage.setItem(sessionKey, 'true');

      // Step 1: Slide to 65% (0.5s delay, 1.5s duration)
      setTimeout(() => {
        slider.classList.add('cs-animating');
        updatePosition(65);

        // Step 2: Settle to 80% (after 1.5s slide + 0.5s pause)
        setTimeout(() => {
          slider.classList.remove('cs-animating');
          slider.classList.add('cs-settle-animation');
          updatePosition(80);

          // Step 3: Handle Arrows Pulse Bounce
          setTimeout(() => {
            slider.classList.remove('cs-settle-animation');
            handle.classList.add('cs-bounce-handle');
          }, 1000);

        }, 2000);

      }, 500);
    }

    // Viewport Intersection Trigger
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          playEntryAnimation();
          observer.unobserve(slider);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(slider);
  }

  // Global Init
  window.initSliders = function () {
    injectStyles();
    const sliders = document.querySelectorAll('.comparison-slider');
    sliders.forEach((slider, i) => initSlider(slider, i));
  };
})();
