/**
 * Papa-Realtor — AI Chatbot Assistant & Listing Builder
 */
(function () {
  /* --- Element Bindings --- */
  const tabListingsBtn = document.getElementById('tabListingsBtn');
  const tabChatbotBtn = document.getElementById('tabChatbotBtn');
  const tabListingsContent = document.getElementById('tabListingsContent');
  const tabChatbotContent = document.getElementById('tabChatbotContent');

  const chatMessages = document.getElementById('chatMessages');
  const chatChips = document.getElementById('chatChips');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');

  // Preview elements
  const prevTitle = document.getElementById('prevTitle');
  const prevPrice = document.getElementById('prevPrice');
  const prevArea = document.getElementById('prevArea');
  const prevRooms = document.getElementById('prevRooms');
  const prevFloor = document.getElementById('prevFloor');
  const prevCondition = document.getElementById('prevCondition');
  
  const styleSelector = document.getElementById('styleSelector');
  const previewBeforeImg = document.getElementById('previewBeforeImg');
  const previewAfterImg = document.getElementById('previewAfterImg');
  
  // Slider Controls in Admin Preview
  const prevSliderInput = document.getElementById('prevSliderInput');
  const prevLine = document.getElementById('prevLine');
  const prevHandle = document.getElementById('prevHandle');
  const previewAfterImgContainer = document.querySelector('#tabChatbotContent .foreground-img');

  const saveChatListingBtn = document.getElementById('saveChatListingBtn');
  const shareOutput = document.getElementById('shareOutput');
  const shareUrl = document.getElementById('shareUrl');
  const copyShareLinkBtn = document.getElementById('copyShareLinkBtn');
  const downloadStandaloneBtn = document.getElementById('downloadStandaloneBtn');

  /* --- State --- */
  let currentListing = {
    id: '',
    buildingId: '',
    title: '',
    price: '',
    area: '',
    rooms: '',
    floor: '',
    condition: 'shell', // default
    style: 'minimalist', // default
    description: '',
    beforeImage: 'assets/skazka/rooms/room1_real.webp',
    afterImage: 'assets/skazka/rooms/room1_render.webp'
  };

  const conditionLabels = {
    'shell': 'Черновая отделка',
    'partial': 'Частичная отделка',
    'finished': 'Под ключ'
  };

  /* --- Tab Switcher --- */
  tabListingsBtn.addEventListener('click', () => {
    tabListingsBtn.classList.add('active');
    tabChatbotBtn.classList.remove('active');
    tabListingsContent.style.display = '';
    tabChatbotContent.style.display = 'none';
  });

  tabChatbotBtn.addEventListener('click', () => {
    tabChatbotBtn.classList.add('active');
    tabListingsBtn.classList.remove('active');
    tabChatbotContent.style.display = '';
    tabListingsContent.style.display = 'none';
    if (chatMessages.children.length === 0) {
      initChat();
    }
  });

  /* --- Slider Event for Admin Preview --- */
  if (prevSliderInput && prevLine && prevHandle && previewAfterImgContainer) {
    prevSliderInput.addEventListener('input', (e) => {
      const val = e.target.value;
      previewAfterImgContainer.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
      prevLine.style.left = `${val}%`;
      prevHandle.style.left = `${val}%`;
    });
  }

  /* --- Chatbot Dialog & Parser --- */
  const welcomeMessage = 
    `Привет! Я твой AI-ассистент по недвижимости. Давай помогу подготовить предложение для клиента.\n\n` +
    `Просто опиши объект своими словами на русском или украинском. Например:\n` +
    `*"2-комнатная квартира на Павловом Поле, 54 кв.м, 8 этаж, цена $48,000, состояние под ремонт"*`;

  function initChat() {
    appendMessage(welcomeMessage, 'bot');
    renderChips([
      'Добавить 2-к квартиру в Харькове',
      'Квартира с черновой отделкой',
      'Помоги сделать описание',
      'Очистить чат'
    ]);
  }

  function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    msg.innerHTML = text.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function renderChips(labels) {
    chatChips.innerHTML = '';
    labels.forEach(lbl => {
      const chip = document.createElement('span');
      chip.className = 'chat-chip';
      chip.textContent = lbl;
      chip.addEventListener('click', () => handleUserInput(lbl));
      chatChips.appendChild(chip);
    });
  }

  chatSendBtn.addEventListener('click', () => {
    const val = chatInput.value.trim();
    if (val) {
      handleUserInput(val);
      chatInput.value = '';
    }
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') chatSendBtn.click();
  });

  function handleUserInput(input) {
    appendMessage(input, 'user');
    
    if (input.toLowerCase() === 'очистить чат') {
      chatMessages.innerHTML = '';
      resetPreview();
      initChat();
      return;
    }

    setTimeout(() => {
      processInput(input);
    }, 600);
  }

  /* --- Natural Language Processing --- */
  function processInput(text) {
    const normalized = text.toLowerCase();
    
    // Check if it's a prompt for description
    if (normalized.includes('описание') || normalized.includes('опиши') || normalized.includes('описання')) {
      if (!currentListing.title) {
        appendMessage('Сначала укажи параметры квартиры (комнаты, цену, площадь), чтобы я мог составить хорошее описание.', 'bot');
        return;
      }
      
      const desc = generateBeautifulDescription(currentListing);
      currentListing.description = desc;
      updatePreviewUI();
      appendMessage(`Вот описание, которое я составил для сайта:\n\n*"${desc}"*\n\nОно уже добавлено в карточку!`, 'bot');
      return;
    }

    // Try parsing parameters
    let parsedAny = false;

    // 1. Rooms
    let roomsMatch = normalized.match(/(\d+)\s*(?:комн|комнат|к\b|комнатная|комн\.)/);
    if (!roomsMatch) {
      if (normalized.includes('однокомн') || normalized.includes('1-комн') || normalized.includes('1к')) currentListing.rooms = 1;
      else if (normalized.includes('двухкомн') || normalized.includes('двокімн') || normalized.includes('2-комн') || normalized.includes('2к')) currentListing.rooms = 2;
      else if (normalized.includes('трехкомн') || normalized.includes('трикімн') || normalized.includes('3-комн') || normalized.includes('3к')) currentListing.rooms = 3;
      parsedAny = true;
    } else {
      currentListing.rooms = parseInt(roomsMatch[1]);
      parsedAny = true;
    }

    // 2. Price
    // matches e.g. "45000", "45тыс", "45 тыс", "45к", "45 000"
    let priceMatch = normalized.match(/(?:цена|стоимость|стоит|за)?\s*(\d+[\d\s,.]*(?:тыс|к|т|тис)?)\s*(?:\$|usd|долл|долларов|грн|у\.е\.)?/);
    if (priceMatch) {
      let valStr = priceMatch[1].replace(/\s/g, '');
      let multiplier = 1;
      if (valStr.includes('тыс') || valStr.includes('тис') || valStr.endsWith('к') || valStr.endsWith('т')) {
        multiplier = 1000;
        valStr = valStr.replace(/(?:тыс|тис|к|т)/g, '');
      }
      const val = parseFloat(valStr) * multiplier;
      if (val > 100) { // filter out small numbers that might be area or floor
        currentListing.price = val;
        parsedAny = true;
      }
    }

    // 3. Area
    let areaMatch = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:м2|м²|кв|кв\.м|метров|метра|квадратов)/);
    if (areaMatch) {
      currentListing.area = parseFloat(areaMatch[1].replace(',', '.'));
      parsedAny = true;
    }

    // 4. Floor
    let floorMatch = normalized.match(/(\d+)\s*(?:эт|этаж|этаже|эт\.)/);
    if (floorMatch) {
      currentListing.floor = parseInt(floorMatch[1]);
      parsedAny = true;
    }

    // 5. Condition
    if (normalized.includes('чернов') || normalized.includes('под ремонт') || normalized.includes('без ремонта') || normalized.includes('стройсостоян')) {
      currentListing.condition = 'shell';
      currentListing.beforeImage = 'assets/skazka/rooms/room1_real.webp';
      parsedAny = true;
    } else if (normalized.includes('частичн') || normalized.includes('жилое') || normalized.includes('косметич')) {
      currentListing.condition = 'partial';
      currentListing.beforeImage = 'assets/skazka/rooms/room1_real.webp'; // fallback
      parsedAny = true;
    } else if (normalized.includes('ремонт') || normalized.includes('евроремонт') || normalized.includes('дизайн') || normalized.includes('под ключ')) {
      currentListing.condition = 'finished';
      currentListing.beforeImage = 'assets/skazka/rooms/room1_real.webp'; // fallback
      parsedAny = true;
    }

    // 6. Building Detection
    if (normalized.includes('сказк') || normalized.includes('skazka')) {
      currentListing.buildingId = 'skazka';
      currentListing.beforeImage = 'assets/skazka/rooms/room1_real.webp';
      currentListing.afterImage = 'assets/skazka/rooms/room1_render.webp';
      parsedAny = true;
    } else if (normalized.includes('мануфактур') || normalized.includes('manufactura')) {
      currentListing.buildingId = 'manufactura';
      // For manufactura, we currently fallback to skazka photos
      currentListing.beforeImage = 'assets/skazka/rooms/room1_real.webp'; 
      currentListing.afterImage = 'assets/skazka/rooms/room1_render.webp';
      parsedAny = true;
    }

    // Attempt to extract title or location
    let location = 'Харьков';
    const locMatch = text.match(/(?:на|в|уле)\s+([А-Яа-яЇїЄєіІ’]+(?:\s+[А-Яа-яЇїЄєіІ’]+){0,2})/);
    if (locMatch) {
      location = locMatch[1];
    }
    
    if (currentListing.rooms || currentListing.area) {
      currentListing.title = `${currentListing.rooms ? currentListing.rooms + '-комн.' : 'Комфортная'} квартира, ${currentListing.area ? currentListing.area + ' м²' : ''} (${location})`;
    }

    if (parsedAny) {
      updatePreviewUI();
      
      if (!currentListing.buildingId) {
        let response = `Я обновил параметры, но не понял, в каком это жилом комплексе.\nДля какого ЖК эта квартира? Напиши, например: "ЖК Сказка" или "Мануфактура".`;
        appendMessage(response, 'bot');
        renderChips(['ЖК Сказка', 'Мануфактура', 'Сбросить и очистить']);
        return;
      }

      let response = `Я обновил параметры в карточке справа!\n\n`;
      response += `*Параметры объекта:*\n`;
      if (currentListing.buildingId) response += `• ЖК: ${currentListing.buildingId === 'skazka' ? 'Сказка' : 'Мануфактура'}\n`;
      if (currentListing.rooms) response += `• Комнат: ${currentListing.rooms}\n`;
      if (currentListing.price) response += `• Цена: $${currentListing.price.toLocaleString()}\n`;
      if (currentListing.area) response += `• Площадь: ${currentListing.area} м²\n`;
      if (currentListing.floor) response += `• Этаж: ${currentListing.floor}\n`;
      response += `• Состояние: *${conditionLabels[currentListing.condition]}*\n\n`;
      response += `Хочешь составить красивое описание для клиента? Просто нажми кнопку *"Помоги сделать описание"* или напиши *"Опиши квартиру"*.`;
      
      appendMessage(response, 'bot');
      renderChips([
        'Помоги сделать описание',
        'Сделать стиль: Лофт',
        'Сделать стиль: Уютный',
        'Сбросить и очистить'
      ]);
    } else {
      appendMessage('Не удалось распознать параметры. Пожалуйста, напиши более конкретно, например: "квартира 3 комнаты ЖК Сказка, 72 кв метра, цена 52000 уе".', 'bot');
    }
  }

  function generateBeautifulDescription(list) {
    const loc = list.title.includes('(') ? list.title.split('(')[1].replace(')', '') : 'Харьков';
    const conditionText = list.condition === 'shell' 
      ? 'в строительном состоянии (после строителей, под ваш эксклюзивный ремонт)' 
      : list.condition === 'partial' 
      ? 'в жилом состоянии с косметическим ремонтом' 
      : 'с качественным готовым ремонтом под ключ';

    return `Предлагается к продаже отличная ${list.rooms}-комнатная квартира общей площадью ${list.area} кв.м. ` +
           `Расположена на ${list.floor} этаже в районе ${loc}. Квартира находится ${conditionText}. ` +
           `Отличная планировка с возможностью перепланировки. Мы подготовили 3D-визуализацию возможного дизайн-проекта ` +
           `в современном стиле. Прекрасный вариант как для личного проживания, так и под инвестицию. ` +
           `Звоните для записи на просмотр!`;
  }

  function updatePreviewUI() {
    if (currentListing.buildingId) {
      document.documentElement.dataset.theme = currentListing.buildingId;
    }
    prevTitle.textContent = currentListing.title || 'Квартира';
    prevPrice.textContent = currentListing.price ? `$${Number(currentListing.price).toLocaleString()}` : 'Цена по запросу';
    prevArea.textContent = currentListing.area ? `${currentListing.area} м²` : '—';
    prevRooms.textContent = currentListing.rooms ? `${currentListing.rooms} комн.` : '—';
    prevFloor.textContent = currentListing.floor ? `${currentListing.floor} эт.` : '—';
    prevCondition.textContent = conditionLabels[currentListing.condition];
    
    previewBeforeImg.src = currentListing.beforeImage;
    previewAfterImg.src = currentListing.afterImage;
  }

  function resetPreview() {
    currentListing = {
      id: '',
      buildingId: '',
      title: '',
      price: '',
      area: '',
      rooms: '',
      floor: '',
      condition: 'shell',
      style: 'minimalist',
      description: '',
      beforeImage: 'assets/skazka/rooms/room1_real.webp',
      afterImage: 'assets/skazka/rooms/room1_render.webp'
    };
    updatePreviewUI();
    shareOutput.style.display = 'none';
  }

  /* --- Design Style Selection --- */
  styleSelector.querySelectorAll('.style-option').forEach(opt => {
    opt.addEventListener('click', () => {
      styleSelector.querySelector('.style-option.active').classList.remove('active');
      opt.classList.add('active');
      
      const style = opt.dataset.style;
      currentListing.style = style;
      currentListing.afterImage = `assets/skazka/rooms/room1_render.webp`;
      previewAfterImg.src = currentListing.afterImage;
      
      if (shareOutput.style.display !== 'none') {
        // Regenerate links if listing was already saved
        generateShareLinks();
      }
    });
  });

  /* --- Save & URL Generation --- */
  saveChatListingBtn.addEventListener('click', () => {
    if (!currentListing.title) {
      alert('Сначала добавьте параметры квартиры через чат-ассистент.');
      return;
    }

    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('mfr_listings') || '[]');
    const id = 'apt-' + Math.random().toString(36).substring(2, 9);
    
    const itemToSave = {
      id: id,
      buildingId: currentListing.buildingId,
      title: currentListing.title,
      price: currentListing.price,
      area: currentListing.area,
      rooms: currentListing.rooms,
      floor: currentListing.floor,
      condition: currentListing.condition,
      style: currentListing.style,
      description: currentListing.description,
      beforeImage: currentListing.beforeImage,
      afterImage: currentListing.afterImage,
      createdAt: new Date().toISOString()
    };
    
    saved.push(itemToSave);
    localStorage.setItem('mfr_listings', JSON.stringify(saved));
    
    // Update main listings render in Tab 1 if needed
    if (window.renderListings) {
      window.renderListings();
    }

    // Store active saved listing for sharing actions
    currentListing.id = id;
    
    generateShareLinks();
    
    saveChatListingBtn.textContent = '✓ Сохранено!';
    setTimeout(() => { saveChatListingBtn.textContent = '✓ Сохранить объект'; }, 1500);
  });

  function generateShareLinks() {
    const shareData = {
      buildingId: currentListing.buildingId,
      title: currentListing.title,
      price: currentListing.price,
      area: currentListing.area,
      rooms: currentListing.rooms,
      floor: currentListing.floor,
      condition: currentListing.condition,
      style: currentListing.style,
      description: currentListing.description,
      beforeImage: currentListing.beforeImage,
      afterImage: currentListing.afterImage
    };

    // Compress JSON using base64 URL safe
    const jsonStr = JSON.stringify(shareData);
    const base64Data = btoa(unescape(encodeURIComponent(jsonStr)));
    
    // Create direct URL
    const url = `${window.location.origin}${window.location.pathname.replace('admin.html', 'share.html')}#data=${base64Data}`;
    
    shareUrl.textContent = url;
    shareOutput.style.display = '';
    shareOutput.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  /* --- Copy Share Link --- */
  copyShareLinkBtn.addEventListener('click', () => {
    const text = shareUrl.textContent;
    navigator.clipboard.writeText(text).then(() => {
      copyShareLinkBtn.textContent = '✓ Скопировано!';
      setTimeout(() => { copyShareLinkBtn.textContent = 'Копировать ссылку'; }, 1500);
    });
  });

  /* --- Client-Side Standalone HTML Package & Download --- */
  downloadStandaloneBtn.addEventListener('click', () => {
    downloadStandaloneBtn.textContent = 'Сборка файла...';
    
    // Create base64 loader helper to bundle images
    const getBase64Image = (imgUrl) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
          const canvas = document.createElement('canvas');
          canvas.width = this.width;
          canvas.height = this.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = function () {
          // fallback to raw path
          resolve(imgUrl);
        };
        img.src = imgUrl;
      });
    };

    // Load templates in parallel and bundle
    Promise.all([
      fetch('share.html').then(res => res.text()),
      getBase64Image(currentListing.beforeImage),
      getBase64Image(currentListing.afterImage)
    ]).then(([htmlTemplate, beforeBase64, afterBase64]) => {
      // Modify listing object with embedded base64 images
      const embeddedListing = {
        ...currentListing,
        beforeImage: beforeBase64,
        afterImage: afterBase64
      };

      // Replace the global data placeholder in the HTML
      // We will define a placeholder like "const EMBEDDED_LISTING_DATA = null;" in share.html
      const injectedHtml = htmlTemplate.replace(
        'const EMBEDDED_LISTING_DATA = null;',
        `const EMBEDDED_LISTING_DATA = ${JSON.stringify(embeddedListing)};`
      );

      // Create download blob
      const blob = new Blob([injectedHtml], { type: 'text/html;charset=utf-8' });
      const dlLink = document.createElement('a');
      dlLink.href = URL.createObjectURL(blob);
      dlLink.download = `квартира-${currentListing.rooms}к-${currentListing.area}м.html`;
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);

      downloadStandaloneBtn.textContent = '✓ Скачано!';
      setTimeout(() => { downloadStandaloneBtn.textContent = 'Скачать файл HTML'; }, 1500);
    }).catch(err => {
      console.error(err);
      alert('Ошибка при генерации файла. Попробуйте еще раз.');
      downloadStandaloneBtn.textContent = 'Скачать файл HTML';
    });
  });
})();
