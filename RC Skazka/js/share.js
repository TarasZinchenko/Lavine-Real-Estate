const EMBEDDED_LISTING_DATA = null;

(function() {
  const errorState = document.getElementById('errorState');
  const mainContent = document.getElementById('mainContent');

  function initSharePage() {
    let data = null;

    if (EMBEDDED_LISTING_DATA) {
      data = EMBEDDED_LISTING_DATA;
    } else {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#data=')) {
        try {
          const base64 = hash.replace('#data=', '');
          const jsonStr = decodeURIComponent(escape(atob(base64)));
          data = JSON.parse(jsonStr);
        } catch (e) {
          console.error("Failed to decode share data", e);
        }
      }
    }

    if (!data) {
      errorState.style.display = 'block';
      return;
    }

    // Apply Theme
    if (data.buildingId) {
      document.documentElement.dataset.theme = data.buildingId;
    }

    // Populate Data
    const conditionLabels = {
      'shell': 'Черновая',
      'partial': 'Под ремонт',
      'finished': 'Под ключ'
    };

    document.getElementById('shBuilding').textContent = data.buildingId === 'skazka' ? 'ЖК Сказка' : 'Manufactura';
    document.getElementById('shTitle').textContent = data.title || 'Квартира';
    document.getElementById('shPrice').textContent = data.price ? `$${Number(data.price).toLocaleString()}` : 'Цена по запросу';
    
    document.getElementById('shArea').textContent = data.area || '—';
    document.getElementById('shFloor').textContent = data.floor || '—';
    document.getElementById('shRooms').textContent = data.rooms || '—';
    document.getElementById('shCondition').textContent = conditionLabels[data.condition] || 'Черновая';
    
    // Description formatting
    if (data.description) {
      document.getElementById('shDesc').innerHTML = data.description.replace(/\n/g, '<br>');
    } else {
      document.getElementById('shDesc').textContent = 'Описание отсутствует.';
    }

    // Images
    document.getElementById('shImgBefore').src = data.beforeImage || '';
    document.getElementById('shImgAfter').src = data.afterImage || '';

    // WhatsApp Message
    const waText = `Здравствуйте! Меня заинтересовала квартира: ${data.title} (${data.price ? '$'+data.price : ''})`;
    document.getElementById('waLink').href = `https://wa.me/380951570179?text=${encodeURIComponent(waText)}`;

    // Show content
    mainContent.style.display = 'block';

    // Initialize UI components
    if (window.initSliders) window.initSliders();

    // Load appropriate 3D scene (skip on mobile to save battery/perf, let CSS background take over, or load 3js? Wait, scenes have their own mobile check!)
    const script = document.createElement('script');
    script.src = data.buildingId === 'skazka' ? 'js/scenes/skazka-scene.js' : 'js/three-scene.js';
    document.body.appendChild(script);
    
    // Update document title
    document.title = `${data.title} | Papa Realtor`;
  }

  document.addEventListener('DOMContentLoaded', initSharePage);
})();
