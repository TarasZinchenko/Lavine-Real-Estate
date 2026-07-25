# RC Diplomat — Handoff для следующего агента

> Проект: иммерсивный сторителлинг-сайт квартиры в ЖК «Дипломат» (Харьков, ул. Минская, 3).
> Заказчик: Тарас. Язык контента — русский. Общение с заказчиком — на русском.
> Этот файл — единственный источник контекста. Читать ПЕРЕД любыми правками.

---

## 1. Цель проекта

Один самодостаточный HTML-файл `diplomat_standalone.html` — премиальная презентация
квартиры/дома уровня awwwards/Apple: кинематографичный скролл, WebGL (three.js),
без единой внешней зависимости (офлайн, пересылаемый в Telegram/Viber).

Первая версия (коробочная вёрстка «текст рядом с картинкой») была ОТКЛОНЕНА
заказчиком как копия RC Skazka. Текущая версия «Diplomat: Vertical» — 8 актов,
уникальная структура. НЕ копировать `RC Skazka/skazka_v2.html`.

## 2. Текущий статус: ГОТОВО, QA пройден

- Десктоп QA (1600×900): чисто, ERRORS: none.
- Мобильный QA (390×844): чисто, ERRORS: none. Все найденные дефекты исправлены
  (пересвет hero-частиц на портрете, контраст фактов локации, тени текста пролога).
- Бандл собран: `diplomat_standalone.html` — 11.42 MB, 15 уникальных ассетов.

Если следующий агент меняет `js/*`, `css/*` или `diplomat.html` — ОБЯЗАТЕЛЬНО
пересобрать бандл и прогнать QA (команды ниже).

## 3. Архитектура

Исходники (многофайловые) → бандлер → один standalone-файл.

| Файл | Назначение |
|---|---|
| `diplomat.html` | Разметка 8 актов, подключает `lib/three.min.js` + 4 локальных скрипта |
| `css/tokens.css`, `css/themes/diplomat.css` | Переменные шрифтов + палитра espresso/bronze |
| `css/fonts.css` | 14 @font-face (self-hosted woff2, `../assets/fonts/`) |
| `css/base.css` | Ресет, split-char machinery, `.gl-canvas`, `.grain`, pinning `.scene > .sticky` |
| `css/components.css` | Все 8 актов + preloader/nav/cursor + `.no-webgl` fallback + responsive 968/600 |
| `js/scroll.js` | Нативный скролл + lerped `sy` (EASE 0.095); `Scroll.add/subscribe/refresh` |
| `js/webgl.js` | Две сцены three.js: hero-монолит из частиц + галерея-пролёт (`GL.init/setHeroP/setGalP/onActive`) |
| `js/fx.js` | Preloader, splitChars/Words, курсор, magnetic, нав, счётчики, скрабы (`FX.init/finishLoading`) |
| `js/main.js` | Гидратация `[src^="assets/"]` из `window.__MEDIA__`, boot, no-webgl fallback |
| `lib/three.min.js` | Вендорный three.js r128 UMD (последний не-ESM classic build) |
| `bundle_standalone.py` | Бандлер: инлайнит CSS/JS/three, шрифты → data URI в CSS, ассеты → `window.__MEDIA__` |

Ключевые решения (не ломать без причины):
- Нативный скролл + лерпированное значение анимации (НЕ virtual scroll-jacking) — мобильная безопасность.
- CSS `position: sticky` для пиннинга; JS только считает прогресс.
- Один fixed `<canvas id="gl">` под контентом; сцены переключаются по скролл-зонам с кроссфейдом opacity; рендер скипается вне зон.
- Реестр `window.__MEDIA__`: бандлер сканирует финальный инлайн HTML (включая строки в JS) на `assets/...` и встраивает каждый уникальный файл один раз. `assets/fonts/` исключён из реестра (шрифты идут data URI в CSS).
- Graceful degradation: класс `.no-webgl` → грид картинок `.fly-fallback`, статичный манифест; `prefers-reduced-motion` → EASE=1, конечные состояния скрабов.
- Hero-частицы: объёмный slab (62%) + crown (16%) + пыль (22%); на mobile 12k частиц, uSize 17, uGain 0.5 (гашение аддитивного пересвета), камера отъезжает `z = 9.5 * max(1, 0.95/aspect)` на портрете.
- Галерея-пролёт: 10 планов (GAP=5, FOCUS=3.4, FogExp2 0.14), чередование x=±1.75, видео по центру (VideoTexture, muted/loop/playsinline, play при opacity>0.25), подписи через `GL.onActive`.

## 4. Структура страницы (8 актов)

`#prologue` (mega «ДИПЛОМАТ», split-chars) → `#manifest` (340vh, пословная подсветка) →
`#cinema` (photo_15, clip-path inset → full-bleed) → `#numbers` (счётчики 92 / 3,0 / 17 / 7) →
`#flythrough` (720vh WebGL-пролёт, 10 кадров) → `#interior` (hstrip 420vh, 5 карточек) →
`#location` (plx 190vh параллакс photo_1 + факты) → `#contact` (гигантский телефон, CTA).

## 5. Ассеты (`assets/`) — что и где используется

Фото (19 шт.):
- `photo_1.jpg` — лоджия со стеклопакетами, вид на Саржин Яр → пролёт кадр 5, локация (parallax)
- `photo_2/5/7/13.jpg` — open space, кирпич, колонны → hstrip (13,11,2,5,7)
- `photo_4.jpg` — панорама города с высокого этажа → пролёт кадр 8
- `photo_6.jpg` — ЛУЧШИЙ экстерьер с вывеской «ДИПЛОМАТ» → пролёт кадр 1
- `photo_11.jpg` — бетонная комната → пролёт кадр 4, hstrip
- `photo_15.jpg` — панорама с высокого этажа → cinema (акт 3), пролёт кадр 7
- `photo_17.jpg` — лобби → пролёт кадр 2
- `photo_19.jpg` — экстерьер → пролёт кадр 10 (финал)
- `photo_3/8/9/10/12/14/16/18.jpg` — прочие интерьеры/экстерьеры, сейчас НЕ используются (резерв)

Видео:
- `video_tour_web.mp4` (4.23 MB) — видеотур → пролёт кадр 6
- `video_exterior_web.mp4` (0.41 MB) — экстерьер → пролёт кадр 9
- Оба с poster-картинками (poster-файлы рядом в assets/)

Шрифты: `assets/fonts/` — 14 woff2 (cyrillic+latin): Cormorant Garamond 500/600/500i
(заголовки) + Montserrat 300–600 (текст). Сгенерированы в `css/fonts.css`
скриптом `fetch_fonts.py` (лежит в Temp\kilo, может быть утерян — перегенерировать
с Google Fonts API при необходимости).

Порядок кадров пролёта и подписи — в массиве `GALLERY` в `js/webgl.js`
(Фасад → Лобби → … → Дипломат).

## 6. Команды: сборка и QA

Сборка (из `RC Diplomat/`):
```
python bundle_standalone.py
# ожидаемый вывод: OK  diplomat_standalone.html: 11.42 MB, 15 unique assets embedded
```

QA-скрипт: `C:\Users\zinta\AppData\Local\Temp\kilo\cdp_story_qa.js`
(ЕСЛИ УТЕРЯН — восстановить: CDP через `ws`, Chrome headless на порту 9222 с
`--enable-unsafe-swiftshader` и `--remote-debugging-port=9222`, профиль
`chromeprof_story`; скрипт делает реальные scrollTo + 1600ms settle +
viewport captureScreenshot, пишет SANITY/пер-стоп состояние/OVERFLOW/ERRORS).

Запуск (из `C:\Users\zinta\AppData\Local\Temp\kilo`, там же `node_modules\ws`):
```
node cdp_story_qa.js 1600 900 desk    # десктоп, 13 стопов → story_desk_*.png
node cdp_story_qa.js 390 844 mob      # мобильный → story_mob_*.png
```
Норма: `three=true webglSupport=true ready=true`, OVERFLOW только `DIV.grain`
(намеренный inset −50%), ERRORS: none. Скриншоты обязательно просмотреть глазами.

PowerShell 5.1 quirks: `Invoke-WebRequest` → `-UseBasicParsing`; `python -c` с кавычками
не работает (писать .py файлом); редирект `>` даёт 0-байт файлы (юзать `cmd /c`);
headless Chrome с persistent-профилем кеширует file:// (убивать старые инстансы).

## 7. TODO (что осталось)

1. **Площадь ≈92 м² — ВЫДУМАННАЯ цифра** (счётчик в акте «numbers»). Уточнить у Тараса
   реальную площадь и поправить в `diplomat.html` (+ пересборка). Можно заодно уточнить
   остальные цифры (3,0м потолки, 17 этажей, 7 мин до метро — последнее подтверждено картой).
2. **Проверка на реальном устройстве** (iPhone Safari + Android Chrome): touch-скролл,
   перф частиц, автоплей видео (muted → должен работать), `100svh` высоты.
3. Опциональный полироль (НЕ делать без запроса заказчика): x-offset планов пролёта
   на портрете (сейчас ±1.75, планы слегка смещены в сторону на узком экране —
   признано приемлемым), preloader при медленной сети, буква «ЛО» в «ЛОКАЦИЯ»
   мерцает в середине reveal-перехода (transient, by design).
4. Чистка хвостов (не критично): фоновый Chrome `chromeprof_story` на порту 9222
   (можно убить), старый профиль `chromeprof_cdp2`, временные файлы в Temp\kilo.

## 8. Факты об объекте (контент)

ЖК «Дипломат», ул. Минская, 3, Шатиловка (Шевченковский район), Харьков. Сдан 2021.
17 этажей, монолитный каркас. Метро «Ботанический сад» — 7 мин. Вид на Саржин Яр.
Контакт: +38 (099) 630-18-80, Telegram: https://t.me/+380996301880.

Палитра: espresso `#14110F` фон, бронза `#C08A4C` / `#E4BC8A` акцент (60-30-10).
Тон: сдержанная премиальность, короткие фразы, русский язык, цифры с запятой (3,0).

## 9. Предпочтения заказчика

- Никаких коробочных блоков «текст | картинка». Только кинематографичный скролл.
- three.js обязателен (не vanilla canvas).
- Сначала объяснить дизайн-решение, потом писать код.
- Не добавлять фичи сверх запроса. Минимальные правки, стиль проекта сохранять.
