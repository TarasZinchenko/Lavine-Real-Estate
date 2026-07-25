/**
 * Main — Project Core (Listing Loader & Form Handlers)
 * Author: Antigravity
 */
(function () {
  /* --- Contact Form Submissions --- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = '✓ Запрос отправлен!';
      btn.style.background = 'var(--clr-accent)';
      btn.style.color = 'var(--clr-bg)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        contactForm.reset();
      }, 3000);
    });
  }

  /* --- Load Dynamic Listings from LocalStorage --- */
  function loadListings() {
    const listingsSection = document.getElementById('listings');
    const listingsGrid = document.getElementById('listingsGrid');
    if (!listingsSection || !listingsGrid) return;

    const listings = JSON.parse(localStorage.getItem('mfr_listings') || '[]');
    if (listings.length === 0) {
      listingsSection.style.display = 'none';
      return;
    }

    listingsSection.style.display = '';
    listingsGrid.innerHTML = '';

    listings.forEach(listing => {
      const card = document.createElement('div');
      card.className = 'gallery-item';
      card.style.cssText = 'aspect-ratio:4/3;cursor:default';

      const img = listing.images && listing.images.length > 0
        ? listing.images[0]
        : 'assets/manufactura/exterior.webp';

      card.innerHTML = `
        <img src="${img}" alt="${listing.title || 'Квартира'}" style="width:100%;height:100%;object-fit:cover">
        <div class="overlay" style="opacity:1;background:linear-gradient(transparent 30%,rgba(13,14,16,.9))">
          <div style="width:100%">
            <div style="font-size:1.05rem;font-weight:600;margin-bottom:4px;font-family:var(--font-heading);color:var(--clr-accent)">${listing.title || 'Квартира'}</div>
            <div style="font-size:.75rem;color:var(--clr-text-muted)">${listing.area ? listing.area + ' м²' : ''} ${listing.floor ? '• ' + listing.floor + ' этаж' : ''} ${listing.rooms ? '• ' + listing.rooms + ' комн.' : ''}</div>
            ${listing.price ? `<div style="font-size:1.15rem;font-weight:500;color:var(--clr-text);margin-top:8px">$${Number(listing.price).toLocaleString()}</div>` : '<div style="font-size:.85rem;color:var(--clr-accent);margin-top:8px">Цена по запросу</div>'}
          </div>
        </div>
      `;
      listingsGrid.appendChild(card);
    });
  }

  loadListings();
})();
