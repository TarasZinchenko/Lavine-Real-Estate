/**
 * i18n Localization Engine — RU/UA Dictionaries
 * Author: Antigravity
 */
(function () {
  const DICTIONARY = {
    ru: {
      // Navigation
      nav_logo: 'Админ',
      nav_about: 'О комплексе',
      nav_space: 'Пространство',
      nav_gallery: 'Галерея',
      nav_video: 'Видео',
      nav_location: 'Расположение',
      nav_contact: 'Контакты',
      nav_back_to_site: '← Вернуться на сайт',

      // Hero Section
      hero_tag: 'Эксклюзивное предложение',
      hero_title_manufactura: 'IT-Park <em>Manufactura</em>',
      hero_title_skazka: 'ЖК <em>Сказка</em>',
      hero_sub_manufactura: 'Современные лофт-апартаменты в историческом центре Харькова. Идеальный баланс работы, жизни и отдыха на благоустроенной набережной.',
      hero_sub_skazka: 'Новый жилой комплекс комфорт-класса на Холодной Горе. Развитая инфраструктура, надежные кирпичные стены и тихое место для вашей семьи.',
      hero_cta_consult: 'Консультация',
      hero_cta_price: 'Узнать стоимость',
      hero_cta_interior: 'Интерьерные решения',
      hero_stat_area: 'Площадь',
      hero_stat_rooms: 'Комнат',
      hero_stat_floor: 'Этаж',
      hero_stat_condition: 'Состояние',

      // About Section
      about_label: 'О проекте',
      about_title_manufactura: 'Историческое наследие и современный комфорт',
      about_title_skazka: 'Уют и надежность в зеленом районе Харькова',
      about_desc_manufactura: 'Manufactura — это уникальный проект реновации исторического здания мукомольной мельницы 1886 года в современный комплекс в стиле лофт. Кирпичные стены толщиной до 1 метра обеспечивают идеальную шумо- и теплоизоляцию.',
      about_desc_skazka: 'ЖК Сказка построен по надежной кирпичной технологии с внешним утеплением минеральной ватой. Это тихий, обжитой район с отличной транспортной доступностью и обилием зелени вокруг.',
      about_feat_walls_title: 'Толстые стены',
      about_feat_walls_desc_manufactura: 'Надежная кирпичная кладка XIX века сохраняет прохладу летом и тепло зимой.',
      about_feat_walls_desc_skazka: 'Толстые кирпичные стены с утеплением 100мм гарантируют тишину и энергоэффективность.',
      about_feat_location_title: 'Удобная локация',
      about_feat_location_desc_manufactura: 'Всего 10 минут пешком до станции метро Архитектора Бекетова и центра города.',
      about_feat_location_desc_skazka: 'Всего 10 минут пешком до станции метро Холодная Гора и ключевых транспортных развязок.',
      about_feat_safety_title: 'Безопасность',
      about_feat_safety_desc_manufactura: 'Закрытая охраняемая территория, круглосуточное видеонаблюдение.',
      about_feat_safety_desc_skazka: 'Благоустроенные дворы, качественное освещение, близость к бомбоубежищам.',
      about_feat_parking_title: 'Паркинг',
      about_feat_parking_desc: 'Наземный паркинг для жильцов и гостей комплекса.',
      about_badge_val_manufactura: '1886 год',
      about_badge_lbl_manufactura: 'Год постройки мельницы',
      about_badge_val_skazka: 'Кирпич',
      about_badge_lbl_skazka: 'Материал постройки',

      // Apartment Details / Slider Section
      apartment_label: 'Сравнение',
      apartment_title: 'Визуализация вашего будущего интерьера',
      apartment_desc: 'Посмотрите, как выглядит квартира в строительном состоянии (bare shell) по сравнению с готовым дизайн-проектом в современном стиле. Перетаскивайте слайдер, чтобы увидеть разницу.',
      slider_before: 'Черновая',
      slider_after: 'Дизайн-проект',
      slider_room1: 'Гостиная зона',
      slider_room1_desc: 'Просторная комната с большими окнами. Дизайн-проект предусматривает светлые тона, встроенное светодиодное освещение по периметру потолка и паркетную доску.',
      slider_kitchen: 'Зона кухни',
      slider_kitchen_desc: 'Компактная, но функциональная L-образная кухня с матовыми белыми фасадами, деревянной столешницей и встроенной техникой.',
      slider_bedroom: 'Спальная зона',
      slider_bedroom_desc: 'Уютная ниша под спальню, отделенная несущей бетонной колонной, которая подчеркивает текстуру и индустриальный характер здания.',

      // Location Section
      location_label: 'Расположение',
      location_title: 'Инфраструктура рядом с вами',
      location_card_transport: 'Транспорт',
      location_card_transport_desc_manufactura: 'Метро «Архитектора Бекетова» (1.2 км) и остановки трамваев в пешей доступности.',
      location_card_transport_desc_skazka: 'Станция метро «Холодная Гора» (1.0 км) и крупный автовокзал пригородного сообщения.',
      location_card_park: 'Парковые зоны',
      location_card_park_desc_manufactura: 'Благоустроенная Харьковская набережная прямо у выхода из комплекса.',
      location_card_park_desc_skazka: 'Парк «Юность» (после реконструкции) и исторический Карповский сад неподалеку.',
      location_card_shops: 'Магазины и услуги',
      location_card_shops_desc_manufactura: 'Рядом супермаркеты, кафе, коворкинг на территории IT-Park.',
      location_card_shops_desc_skazka: 'Крупные супермаркеты Класс и Рост, рынок Холодногорский, аптеки и банки.',

      // Gallery Section
      gallery_label: 'Галерея',
      gallery_title: 'Фотографии и видео объекта',
      gallery_item_ext: 'Фасад здания',
      gallery_item_int_shell: 'Строительное состояние',
      gallery_item_int_design: 'Проект интерьера',
      gallery_item_vid: 'Видео-обзор',

      // Contact Section
      contact_label: 'Контакты',
      contact_title: 'Связаться с агентом',
      contact_agent_desc: 'Получите квалифицированную консультацию, запишитесь на просмотр или задайте любой интересующий вас вопрос в мессенджерах.',
      contact_messenger_tg: 'Написать в Telegram',
      contact_messenger_viber: 'Написать в Viber',
      contact_messenger_wa: 'Написать в WhatsApp',
      contact_messenger_call: 'Позвонить агенту',
      contact_form_title: 'Или оставьте заявку',
      contact_form_name: 'Ваше имя',
      contact_form_phone: 'Ваш телефон',
      contact_form_msg: 'Ваше сообщение',
      contact_form_submit: 'Отправить заявку',

      // Footer
      footer_copy: '© 2026 Papa-Realtor. Все права защищены.',
      footer_admin_link: 'Панель управления',

      // Admin & Share Specific Details
      share_details_title: 'Детали предложения',
      share_details_price: 'Цена',
      share_details_area: 'Площадь',
      share_details_rooms: 'Количество комнат',
      share_details_floor: 'Этаж',
      share_details_condition: 'Состояние',
      share_details_desc: 'Описание объекта',
      share_cta_view: 'Записаться на просмотр'
    },
    ua: {
      // Navigation
      nav_logo: 'Адмін',
      nav_about: 'Про комплекс',
      nav_space: 'Простір',
      nav_gallery: 'Галерея',
      nav_video: 'Відео',
      nav_location: 'Розташування',
      nav_contact: 'Контакти',
      nav_back_to_site: '← Повернутися на сайт',

      // Hero Section
      hero_tag: 'Ексклюзивна пропозиція',
      hero_title_manufactura: 'IT-Park <em>Manufactura</em>',
      hero_title_skazka: 'ЖК <em>Казка</em>',
      hero_sub_manufactura: 'Сучасні лофт-апартаменти в історичному центрі Харкова. Ідеальний баланс роботи, життя та відпочинку на впорядкованій набережній.',
      hero_sub_skazka: 'Новий житловий комплекс комфорт-класу на Холодній Горі. Розвинена інфраструктура, надійні цегляні стіни та тихе місце для вашої родини.',
      hero_cta_consult: 'Консультація',
      hero_cta_price: 'Дізнатися вартість',
      hero_cta_interior: 'Інтер\'єрні рішення',
      hero_stat_area: 'Площа',
      hero_stat_rooms: 'Кімнат',
      hero_stat_floor: 'Поверх',
      hero_stat_condition: 'Стан',

      // About Section
      about_label: 'Про проект',
      about_title_manufactura: 'Історична спадщина та сучасний комфорт',
      about_title_skazka: 'Затишок та надійність у зеленому районі Харкова',
      about_desc_manufactura: 'Manufactura — це унікальний проект реновації історичної будівлі борошномельного млина 1886 року в сучасний комплекс у стилі лофт. Цегляні стіни завтовшки до 1 метра забезпечують ідеальну шумо- та теплоізоляцію.',
      about_desc_skazka: 'ЖК Казка побудований за надійною цегляною технологією із зовнішнім утепленням мінеральною ватою. Це тихий, обжитий район з чудовою транспортною доступністю та великою кількістю зелені навколо.',
      about_feat_walls_title: 'Товсті стіни',
      about_feat_walls_desc_manufactura: 'Надійна цегляна кладка XIX століття зберігає прохолоду влітку та тепло взимку.',
      about_feat_walls_desc_skazka: 'Товсті цегляні стіни з утепленням 100мм гарантують тишу та енергоефективність.',
      about_feat_location_title: 'Зручна локація',
      about_feat_location_desc_manufactura: 'Всього 10 хвилин пішки до станції метро Архітектора Бекетова та центру міста.',
      about_feat_location_desc_skazka: 'Всього 10 хвилин пішки до станції метро Холодна Гора та ключових транспортних розв\'язок.',
      about_feat_safety_title: 'Безпека',
      about_feat_safety_desc_manufactura: 'Закрита охоронювана територія, цілодобове відеоспостереження.',
      about_feat_safety_desc_skazka: 'Благоустроєні двори, якісне освітлення, близькість до бомбосховищ.',
      about_feat_parking_title: 'Паркінг',
      about_feat_parking_desc: 'Наземний паркінг для мешканців та гостей комплексу.',
      about_badge_val_manufactura: '1886 рік',
      about_badge_lbl_manufactura: 'Рік побудови млина',
      about_badge_val_skazka: 'Цегла',
      about_badge_lbl_skazka: 'Матеріал будівництва',

      // Apartment Details / Slider Section
      apartment_label: 'Порівняння',
      apartment_title: 'Візуалізація вашого майбутнього інтер\'єру',
      apartment_desc: 'Подивіться, як виглядає квартира в будівельному стані (bare shell) у порівнянні з готовим дизайн-проектом в сучасному стилі. Перетягуйте слайдер, щоб побачити різницю.',
      slider_before: 'Чорнова',
      slider_after: 'Дизайн-проект',
      slider_room1: 'Вітальня зона',
      slider_room1_desc: 'Простора кімната з великими вікнами. Дизайн-проект передбачає світлі тони, вбудоване світлодіодне освітлення по периметру стелі та паркетну дошку.',
      slider_kitchen: 'Зона кухні',
      slider_kitchen_desc: 'Компактна, але функціональна L-подібна кухня з матовими білими фасадами, дерев\'яною стільницею та вбудованою технікою.',
      slider_bedroom: 'Спальна зона',
      slider_bedroom_desc: 'Затишна ніша під спальню, відокремлена несучою бетонною колоною, яка підкреслює текстуру та індустріальний характер будівлі.',

      // Location Section
      location_label: 'Розташування',
      location_title: 'Інфраструктура поруч з вами',
      location_card_transport: 'Транспорт',
      location_card_transport_desc_manufactura: 'Метро «Архітектора Бекетова» (1.2 км) та зупинки трамваїв у пішій доступності.',
      location_card_transport_desc_skazka: 'Станція метро «Холодна Гора» (1.0 км) та великий автовокзал приміського сполучення.',
      location_card_park: 'Паркові зони',
      location_card_park_desc_manufactura: 'Благоустроєна Харківська набережна прямо біля виходу з комплексу.',
      location_card_park_desc_skazka: 'Парк «Юність» (після реконструкції) та історичний Карповський сад неподалік.',
      location_card_shops: 'Магазини та послуги',
      location_card_shops_desc_manufactura: 'Поруч супермаркети, кафе, коворкінг на території IT-Park.',
      location_card_shops_desc_skazka: 'Великі супермаркети Клас та Рост, ринок Холодногірський, аптеки та банки.',

      // Gallery Section
      gallery_label: 'Галерея',
      gallery_title: 'Фотографії та відео об\'єкта',
      gallery_item_ext: 'Фасад будівлі',
      gallery_item_int_shell: 'Будівельний стан',
      gallery_item_int_design: 'Проект інтер\'єру',
      gallery_item_vid: 'Відео-огляд',

      // Contact Section
      contact_label: 'Контакти',
      contact_title: 'Зв\'язатися з агентом',
      contact_agent_desc: 'Отримайте кваліфіковану консультацію, запишіться на перегляд або задайте будь-яке питання, що вас цікавить, у месенджерах.',
      contact_messenger_tg: 'Написати в Telegram',
      contact_messenger_viber: 'Написати в Viber',
      contact_messenger_wa: 'Написати в WhatsApp',
      contact_messenger_call: 'Зателефонувати агенту',
      contact_form_title: 'Або залиште заявку',
      contact_form_name: 'Ваше ім\'я',
      contact_form_phone: 'Ваш телефон',
      contact_form_msg: 'Ваше повідомлення',
      contact_form_submit: 'Надіслати заявку',

      // Footer
      footer_copy: '© 2026 Papa-Realtor. Всі права захищені.',
      footer_admin_link: 'Панель управління',

      // Admin & Share Specific Details
      share_details_title: 'Деталі пропозиції',
      share_details_price: 'Ціна',
      share_details_area: 'Площа',
      share_details_rooms: 'Кількість кімнат',
      share_details_floor: 'Поверх',
      share_details_condition: 'Стан',
      share_details_desc: 'Опис об\'єкта',
      share_cta_view: 'Записатися на перегляд'
    }
  };

  const LANG_TOGGLE_STYLE = `
    .lang-toggle {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-left: 20px;
    }
    .lang-btn {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--clr-text-muted);
      cursor: pointer;
      padding: 4px;
      transition: var(--transition);
      border: none;
      background: none;
    }
    .lang-btn:hover {
      color: var(--clr-text);
    }
    .lang-btn.active {
      color: var(--clr-accent);
    }
    .lang-sep {
      font-size: 0.7rem;
      color: var(--clr-border);
    }
  `;

  function injectToggleStyles() {
    if (document.getElementById('lang-toggle-styles')) return;
    const style = document.createElement('style');
    style.id = 'lang-toggle-styles';
    style.textContent = LANG_TOGGLE_STYLE;
    document.head.appendChild(style);
  }

  function applyTranslations(lang) {
    const dict = DICTIONARY[lang];
    if (!dict) return;

    // Translate texts
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });

    // Update lang attribute on html tag
    document.documentElement.lang = lang;
  }

  window.setLanguage = function (lang) {
    if (!DICTIONARY[lang]) lang = 'ru';
    localStorage.setItem('mfr_lang', lang);
    applyTranslations(lang);

    // Update toggle buttons active class
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  window.getCurrentLanguage = function () {
    return localStorage.getItem('mfr_lang') || 'ru';
  };

  // Helper to dynamically build UI switch
  function createLanguageSwitcher() {
    injectToggleStyles();
    
    // Find nav container
    const navContainer = document.querySelector('.nav .container, nav .container');
    if (!navContainer) return;

    // Check if toggle already exists
    if (navContainer.querySelector('.lang-toggle')) return;

    const toggle = document.createElement('div');
    toggle.className = 'lang-toggle';
    toggle.innerHTML = `
      <button class="lang-btn" data-lang="ru">RU</button>
      <span class="lang-sep">|</span>
      <button class="lang-btn" data-lang="ua">UA</button>
    `;

    // Append right before the contact/burger elements
    const phoneBtn = navContainer.querySelector('.nav-phone');
    if (phoneBtn) {
      navContainer.insertBefore(toggle, phoneBtn);
    } else {
      navContainer.appendChild(toggle);
    }

    // Add click events
    toggle.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.setLanguage(btn.dataset.lang);
      });
    });
  }

  // Load language preference on page initialization
  document.addEventListener('DOMContentLoaded', () => {
    createLanguageSwitcher();
    const currentLang = window.getCurrentLanguage();
    window.setLanguage(currentLang);
  });
})();
