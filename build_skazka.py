# -*- coding: utf-8 -*-
import re

def build_skazka():
    with open(r'C:\Git Projects\Papa-Realtor\archive_v1\skazka_v1.html', 'r', encoding='utf-8') as f:
        old_html = f.read()

    # Extract meta & head
    head_match = re.search(r'<head>(.*?)</head>', old_html, re.DOTALL)
    head = head_match.group(1) if head_match else ""
    
    # We remove the old inline messenger button styles from the head
    head = re.sub(r'<style>.*?</style>', '', head, flags=re.DOTALL)

    new_html = f"""<!DOCTYPE html>
<html lang="ru" data-theme="skazka">
<head>
{head}
</head>
<body>

  <!-- NAV -->
  <nav class="nav" id="nav">
    <div class="container">
      <a href="#hero" class="nav-logo">ЖК СКАЗКА <span>•</span> Квартира</a>
      <div class="nav-links" id="navLinks">
        <a href="#hero">Пролог</a>
        <a href="#ch1">Глава I</a>
        <a href="#ch2">Глава II</a>
        <a href="#ch3">Глава III</a>
        <a href="#epilogue">Эпилог</a>
      </div>
      <button class="burger" id="burger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- MOBILE MENU -->
  <div class="mobile-menu" id="mobileMenu">
    <a href="#hero">Пролог</a>
    <a href="#ch1">Глава I</a>
    <a href="#ch2">Глава II</a>
    <a href="#ch3">Глава III</a>
    <a href="#epilogue">Эпилог</a>
  </div>

  <!-- PROLOGUE -->
  <header id="hero">
    <canvas id="hero-canvas"></canvas>
    <div class="hero-overlay"></div>
    <div class="hero-content reveal">
      <div class="hero-tag"><div class="dot"></div>ЖК Сказка</div>
      <h1 class="hero-title">Своя квартира<br>на <em>Холодной Горе</em></h1>
      <p class="hero-sub">Обычная панелька на Холодной Горе, скажете вы. Но послушайте — тихий двор, метро через дорогу, кирпич, потолки три метра. А внутри можно сделать так, что соседи не поверят.</p>
    </div>
    <div class="scroll-hint">
      Листайте вниз
      <div class="line"></div>
    </div>
  </header>

  <!-- CHAPTER I: HISTORY & SOUL -->
  <section id="ch1" class="scrolly-section">
    <div class="scrolly-sticky">
      <img src="assets/skazka/exterior_1.webp" alt="ЖК Сказка Фасад" loading="lazy">
    </div>
    <div class="scrolly-content container">
      <div class="scrolly-step reveal">
        <div class="scrolly-card">
          <span class="section-label">Глава I</span>
          <h3>Честно о доме</h3>
          <p>Давайте честно: это панелька. Но не та советская панелька, которую вы себе представили — а современная, из белого силикатного кирпича, построенная «Трестом Жилстрой-1». ЖС-1 — это тот застройщик, который в Харькове строит уже десятки лет, и дома у них, скажем так, крепкие. Стены утеплены минеральной ватой 100 мм снаружи, так что зимой тепло, а летом не душно. Потолки 3 метра — это вам не хрущёвка.</p>
        </div>
      </div>
      
      <div class="scrolly-step reveal">
        <div class="scrolly-card">
          <h3>Микродетали</h3>
          <p><strong>Кирпич, а не панель:</strong> Белый силикатный кирпич — тише и теплее, чем обычные бетонные панели. Соседей через стену почти не слышно.<br><br>
          <strong>Зимой не мёрзнем:</strong> 100 мм минваты снаружи. Батареи на «тройке» — и в квартире +23. Платёжки за отопление не пугают.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CHAPTER II: NEIGHBORHOOD -->
  <section id="ch2" class="scrolly-section">
    <div class="scrolly-sticky">
      <img src="assets/skazka/exterior_2.webp" alt="Двор и инфраструктура" loading="lazy">
    </div>
    <div class="scrolly-content container">
      <div class="scrolly-step reveal">
        <div class="scrolly-card">
          <span class="section-label">Глава II</span>
          <h3>Где это?</h3>
          <p>Полтавский Шлях, 186. Если вы из Харькова, вы знаете этот район — Холодная Гора. Не центр, но и не окраина. Золотая середина для тех, кому важно быстро добираться, но не платить как за Пушкинскую.<br><br>
          Метро буквально через дорогу, маршрутки во все стороны, рядом Класс и куча магазинов. Район тихий, спальный — тут вечером дети во дворе играют, а не BMW под окнами дрифтят. Если вам важны тишина и транспорт — лучше сложно найти за эти деньги.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CHAPTER III: POTENTIAL (SLIDERS) -->
  <section id="ch3" class="scrolly-section">
    <div class="scrolly-sticky">
      <img src="assets/skazka/exterior_3.webp" alt="Окна" loading="lazy">
    </div>
    <div class="scrolly-content container">
      <div class="scrolly-step reveal">
        <div class="scrolly-card" style="max-width: 100%; width: 100%;">
          <span class="section-label">Глава III</span>
          <h3>А что внутри?</h3>
          <p>Квартира сейчас в черновой отделке — голые стены, бетонный пол. Но в этом и плюс: вы делаете под себя, а не переделываете за кем-то. Потяните ползунок, чтобы увидеть, как это может выглядеть после ремонта.</p>
          
          <div class="slider-wrapper">
            
            <!-- Room 1 -->
            <div class="slider-item">
              <div class="slider-info">
                <h3>Гостиная — 22 квадрата</h3>
                <p>Комната большая, окна выходят во двор — тихо. Потолки 3 метра, так что даже с натяжным потолком будет просторно. Тут реально помещается и диван, и рабочий стол, и не чувствуешь себя в коробке.</p>
              </div>
              <div class="slider-container">
                <div class="comparison-slider">
                  <img src="assets/skazka/rooms/room1_real.webp" alt="Черновая отделка" class="cs-layer-before">
                  <img src="assets/skazka/rooms/room1_render.webp" alt="Визуализация лофт" class="cs-layer-after">
                  <div class="cs-divider"></div>
                  <div class="cs-handle">
                    <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                  </div>
                  <div class="cs-label before">Реальность</div>
                  <div class="cs-label after">Потенциал</div>
                </div>
              </div>
            </div>

            <!-- Room 2 -->
            <div class="slider-item reverse">
              <div class="slider-info">
                <h3>Кухня — не проходная</h3>
                <p>Почти 15 квадратов — это не та кухня, где два человека не могут развернуться. Сюда влезет нормальный гарнитур, холодильник и останется место для маленького стола. Планировка прямоугольная, без коридорных изгибов.</p>
              </div>
              <div class="slider-container">
                <div class="comparison-slider">
                  <img src="assets/skazka/rooms/kitchen_real.webp" alt="Черновая" class="cs-layer-before">
                  <img src="assets/skazka/rooms/kitchen_render.webp" alt="Визуализация" class="cs-layer-after">
                  <div class="cs-divider"></div>
                  <div class="cs-handle">
                    <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                  </div>
                  <div class="cs-label before">Реальность</div>
                  <div class="cs-label after">Потенциал</div>
                </div>
              </div>
            </div>

            <!-- Room 3 -->
            <div class="slider-item">
              <div class="slider-info">
                <h3>Спальня — для сна, не для мебели</h3>
                <p>12 квадратов — кровать, шкаф, тумбочка. Без лишнего. Окно на восток — утром светло, но не жарко. Если работаете из дома, можно поставить маленький стол у окна.</p>
              </div>
              <div class="slider-container">
                <div class="comparison-slider">
                  <img src="assets/skazka/rooms/bedroom_real.webp" alt="Черновая" class="cs-layer-before">
                  <img src="assets/skazka/rooms/bedroom_render.webp" alt="Визуализация" class="cs-layer-after">
                  <div class="cs-divider"></div>
                  <div class="cs-handle">
                    <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                  </div>
                  <div class="cs-label before">Реальность</div>
                  <div class="cs-label after">Потенциал</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- EPILOGUE: CONTACT -->
  <section id="epilogue" style="padding-top: 15vh; padding-bottom: 15vh; background: var(--clr-bg);">
    <div class="container reveal">
      <span class="section-label">Эпилог</span>
      <h2 class="section-title">Поговорим?</h2>
      <p style="max-width: 600px;">Хотите посмотреть квартиру вживую или просто задать вопросы — пишите. Без обязательств, без давления. Расскажу всё как есть, покажу все углы и документы.</p>
      
      <div class="editorial-contact-links">
        <a href="tel:+380996301880" class="ed-link">
          <span>Позвонить</span>
          +38 099 630 18 80
        </a>
        <a href="https://t.me/realtor" target="_blank" class="ed-link">
          <span>Написать</span>
          Telegram
        </a>
        <a href="https://wa.me/380996301880" target="_blank" class="ed-link">
          <span>Написать</span>
          WhatsApp
        </a>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-copy">&copy; 2026 ЖК Сказка. Все права защищены.</div>
    </div>
  </footer>

  <script type="importmap">
    {{
      "imports": {{
        "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
      }}
    }}
  </script>
  <script src="js/animations.js"></script>
  <script type="module">
    import {{ initBuildingScene }} from './js/scenes/skazka-scene.js';
    initBuildingScene('hero-canvas');
  </script>
</body>
</html>
"""
    with open(r'C:\Git Projects\Papa-Realtor\skazka.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Skazka rewritten to editorial longform.")

build_skazka()
