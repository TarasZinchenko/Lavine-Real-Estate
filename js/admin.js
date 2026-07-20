/**
 * Admin Panel — CRUD for apartment listings stored in localStorage
 */
(function () {
  const STORAGE_KEY = 'mfr_listings';
  const ADMIN_PASS = 'manufactura2026'; // Simple password for demo

  /* --- Elements --- */
  const loginGate = document.getElementById('loginGate');
  const adminContent = document.getElementById('adminContent');
  const loginBtn = document.getElementById('loginBtn');
  const adminPass = document.getElementById('adminPass');
  const loginError = document.getElementById('loginError');
  const addNewBtn = document.getElementById('addNewBtn');
  const listingForm = document.getElementById('listingForm');
  const formTitle = document.getElementById('formTitle');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const adminListings = document.getElementById('adminListings');
  const emptyState = document.getElementById('emptyState');
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const previewImages = document.getElementById('previewImages');

  let uploadedImages = [];
  let editingId = null;

  /* --- Auth --- */
  function checkAuth() {
    return sessionStorage.getItem('mfr_admin') === 'true';
  }

  function showAdmin() {
    loginGate.style.display = 'none';
    adminContent.style.display = '';
    renderListings();
  }

  if (checkAuth()) showAdmin();

  loginBtn.addEventListener('click', () => {
    if (adminPass.value === ADMIN_PASS) {
      sessionStorage.setItem('mfr_admin', 'true');
      showAdmin();
    } else {
      loginError.style.display = '';
      adminPass.style.borderColor = 'var(--clr-red)';
      setTimeout(() => { loginError.style.display = 'none'; adminPass.style.borderColor = ''; }, 2000);
    }
  });

  adminPass.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginBtn.click();
  });

  /* --- CRUD --- */
  function getListings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  function saveListings(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function renderListings() {
    const listings = getListings();
    adminListings.innerHTML = '';

    if (listings.length === 0) {
      emptyState.style.display = '';
      return;
    }
    emptyState.style.display = 'none';

    listings.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'admin-listing';
      const thumb = item.images && item.images.length > 0
        ? item.images[0]
        : 'assets/manufactura/exterior.webp';

      el.innerHTML = `
        <img src="${thumb}" alt="">
        <div class="admin-listing-info">
          <h4 style="margin-bottom:4px">${item.title || 'Без названия'}</h4>
          <p style="font-size:.8rem;color:var(--clr-text-muted)">
            ${item.area ? item.area + ' м²' : '—'} • ${item.floor ? item.floor + ' эт.' : '—'} • ${item.rooms ? item.rooms + ' комн.' : '—'}
            ${item.price ? ' • <strong style="color:var(--clr-accent)">$' + Number(item.price).toLocaleString() + '</strong>' : ''}
          </p>
        </div>
        <div class="admin-listing-actions">
          <button class="btn-edit" data-index="${index}">Изменить</button>
          <button class="btn-delete" data-index="${index}">Удалить</button>
        </div>
      `;
      adminListings.appendChild(el);
    });

    // Bind edit/delete
    adminListings.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => editListing(parseInt(btn.dataset.index)));
    });
    adminListings.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Удалить этот объект?')) {
          const listings = getListings();
          listings.splice(parseInt(btn.dataset.index), 1);
          saveListings(listings);
          renderListings();
        }
      });
    });
  }

  /* --- Form --- */
  function resetForm() {
    document.getElementById('fTitle').value = '';
    document.getElementById('fPrice').value = '';
    document.getElementById('fArea').value = '';
    document.getElementById('fFloor').value = '';
    document.getElementById('fRooms').value = '';
    document.getElementById('fDesc').value = '';
    document.getElementById('fCondition').value = 'shell';
    uploadedImages = [];
    previewImages.innerHTML = '';
    editingId = null;
    formTitle.textContent = 'Новый объект';
  }

  addNewBtn.addEventListener('click', () => {
    resetForm();
    listingForm.style.display = '';
    listingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  cancelBtn.addEventListener('click', () => {
    listingForm.style.display = 'none';
    resetForm();
  });

  saveBtn.addEventListener('click', () => {
    const listing = {
      title: document.getElementById('fTitle').value,
      price: document.getElementById('fPrice').value,
      area: document.getElementById('fArea').value,
      floor: document.getElementById('fFloor').value,
      rooms: document.getElementById('fRooms').value,
      description: document.getElementById('fDesc').value,
      condition: document.getElementById('fCondition').value,
      images: uploadedImages,
      createdAt: new Date().toISOString()
    };

    if (!listing.title) {
      alert('Введите название объекта');
      return;
    }

    const listings = getListings();
    if (editingId !== null) {
      listings[editingId] = { ...listings[editingId], ...listing };
    } else {
      listings.push(listing);
    }
    saveListings(listings);
    listingForm.style.display = 'none';
    resetForm();
    renderListings();

    // Success feedback
    saveBtn.textContent = '✓ Сохранено!';
    setTimeout(() => { saveBtn.textContent = 'Сохранить'; }, 1500);
  });

  function editListing(index) {
    const listings = getListings();
    const item = listings[index];
    editingId = index;
    formTitle.textContent = 'Редактирование';

    document.getElementById('fTitle').value = item.title || '';
    document.getElementById('fPrice').value = item.price || '';
    document.getElementById('fArea').value = item.area || '';
    document.getElementById('fFloor').value = item.floor || '';
    document.getElementById('fRooms').value = item.rooms || '';
    document.getElementById('fDesc').value = item.description || '';
    document.getElementById('fCondition').value = item.condition || 'shell';

    uploadedImages = item.images || [];
    renderPreviews();

    listingForm.style.display = '';
    listingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* --- Image Upload (base64) --- */
  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        // Resize to max 800px to save localStorage space
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxW = 800;
          let w = img.width, h = img.height;
          if (w > maxW) { h = (maxW / w) * h; w = maxW; }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
          uploadedImages.push(dataUrl);
          renderPreviews();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function renderPreviews() {
    previewImages.innerHTML = '';
    uploadedImages.forEach((src, i) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:relative;display:inline-block';
      wrap.innerHTML = `
        <img src="${src}" class="thumb" alt="Preview">
        <button style="position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;background:var(--clr-red);color:#fff;font-size:.65rem;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer" data-idx="${i}">✕</button>
      `;
      wrap.querySelector('button').addEventListener('click', () => {
        uploadedImages.splice(i, 1);
        renderPreviews();
      });
      previewImages.appendChild(wrap);
    });
  }
})();
