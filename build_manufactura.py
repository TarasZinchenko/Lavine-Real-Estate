# -*- coding: utf-8 -*-
import re

def build_manufactura():
    with open(r'C:\Git Projects\Papa-Realtor\archive_v1\manufactura_v1.html', 'r', encoding='utf-8') as f:
        old_html = f.read()

    # Extract meta & head
    head_match = re.search(r'<head>(.*?)</head>', old_html, re.DOTALL)
    head = head_match.group(1) if head_match else ""
    head = re.sub(r'<style>.*?</style>', '', head, flags=re.DOTALL)

    new_html = f"""<!DOCTYPE html>
<html lang="ru" data-theme="manufactura">
<head>
{head}
</head>
<body>

  <!-- NAV -->
  <nav class="nav" id="nav">
    <div class="container">
      <a href="#hero" class="nav-logo">IT-Park <span>•</span> Manufactura</a>
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
      <div class="hero-tag"><div class="dot"></div>Live & Work</div>
      <h1 class="hero-title">Двухкомнатный<br><em>Лофт</em></h1>
      <p class="hero-sub">Бывшая мельница 1886 года на берегу реки. Теперь здесь лофты с высокими потолками, кирпичными стенами и видом на воду. Звучит как Бруклин, а это Харьков.</p>
    </div>
    <div class="scroll-hint">
      Читать историю
      <div class="line"></div>
    </div>
  </header>

  <!-- CHAPTER I: HISTORY & SOUL -->
  <section id="ch1" class="scrolly-section">
    <div class="scrolly-sticky">
      <img src="assets/manufactura/exterior.webp" alt="Фасад Мануфактуры" loading="lazy">
    </div>
    <div class="scrolly-content container">
      <div class="scrolly-step reveal">
        <div class="scrolly-card">
          <span class="section-label">Глава I</span>
          <h3>История одной мельницы</h3>
          <p>В 1886 году здесь построили мукомольную мельницу. Она работала больше ста лет, пережила две войны, а потом заброшенную территорию выкупила компания «Строй Сити» и сделала то, что в Европе делают давно — превратила промышленное здание в жилой комплекс.<br><br>Кирпичные стены оставили как есть, добавили панорамные окна и современные коммуникации.</p>
        </div>
      </div>
      
      <div class="scrolly-step reveal">
        <div class="scrolly-card">
          <h3>Живёшь + работаешь</h3>
          <p>Идея простая: живёшь и работаешь в одном месте. На первых этажах — коворкинги и IT-офисы, наверху — квартиры-лофты. Утренний «комьют» — это лифт. Экономишь 2 часа в день. Для айтишников и фрилансеров — мечта, если честно.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CHAPTER II: ENVIRONMENT -->
  <section id="ch2" class="scrolly-section">
    <div class="scrolly-sticky">
      <img src="assets/manufactura/panorama.webp" alt="Панорама и река" loading="lazy">
    </div>
    <div class="scrolly-content container">
      <div class="scrolly-step reveal">
        <div class="scrolly-card">
          <span class="section-label">Глава II</span>
          <h3>Река за окном</h3>
          <p>Окна выходят на реку Харьков. Это настоящие стены мельницы, которым 140 лет — такое не подделаешь. Летом — зелень и утки за окном, зимой — тихий белый пейзаж. В городе такое редкость.<br><br>
          Кофейня, ресторан, фитнес, супермаркет — всё на территории комплекса. За кофе не надо никуда ехать.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CHAPTER III: DETAILS & TARGET -->
  <section id="ch3" class="scrolly-section">
    <div class="scrolly-sticky">
      <img src="assets/manufactura/closeup.webp" alt="Детали" loading="lazy">
    </div>
    <div class="scrolly-content container">
      <div class="scrolly-step reveal">
        <div class="scrolly-card" style="margin-left: auto;">
          <span class="section-label">Глава III</span>
          <h3>Для кого это?</h3>
          <p>Если вы айтишник, фрилансер или просто любите лофт-эстетику — это ваш вариант. Цена выше панельки, но вы платите за высокие потолки, стены XIX века и комьюнити вокруг.<br><br>
          До метро минут 10-15 пешком. На машине до центра — 15 минут без пробок. Не самый центр, но и не окраина.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- EPILOGUE: CONTACT -->
  <section id="epilogue" style="padding-top: 15vh; padding-bottom: 15vh; background: var(--clr-bg);">
    <div class="container reveal">
      <span class="section-label">Эпилог</span>
      <h2 class="section-title">Давайте созвонимся</h2>
      <p style="max-width: 600px;">Интересно? Напишите или позвоните — покажу всё на месте, расскажу про планировки и цены. Без давления, без «акция только сегодня».</p>
      
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
      <div class="footer-copy">&copy; 2026 IT-Park Manufactura. Все права защищены.</div>
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
    import {{ initBuildingScene }} from './js/scenes/manufactura-scene.js';
    initBuildingScene('hero-canvas');
  </script>
</body>
</html>
"""
    with open(r'C:\Git Projects\Papa-Realtor\manufactura.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Manufactura rewritten to editorial longform.")

build_manufactura()
