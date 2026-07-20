# Papa-Realtor

Premium real estate showcase platform for an independent realtor in Kharkiv, Ukraine. Each residential complex gets its own dedicated page with unique visual identity, interactive 3D hero scenes, before/after renovation sliders, and instant messenger contact buttons.

## Live Demo

Open index.html in a browser or deploy to any static hosting (GitHub Pages, Netlify, Vercel).

## Quick Start

```bash
# Local development
npx http-server -p 8080
# Open http://localhost:8080
```

## Project Structure

```
Papa-Realtor/
+-- index.html                  # Building selector (split-screen)
+-- skazka.html                 # ZhK Skazka dedicated page
+-- manufactura.html            # IT-Park Manufactura dedicated page  
+-- share.html                  # Client-facing shared listing page
+-- admin.html                  # Admin panel with AI chatbot
+-- css/
|   +-- tokens.css              # Design tokens + theme variables
|   +-- base.css                # Reset, typography, layout
|   +-- components.css          # Reusable UI components
|   +-- admin.css               # Admin panel styles
|   +-- themes/
|       +-- manufactura.css     # Manufactura overrides
|       +-- skazka.css          # Skazka overrides
+-- js/
|   +-- core/
|   |   +-- i18n.js             # Localization (RU/UA)
|   |   +-- slider.js           # Before/after comparison slider
|   |   +-- navigation.js       # Nav scroll behavior + mobile menu
|   +-- scenes/
|   |   +-- skazka-scene.js     # Three.js procedural building (Skazka)
|   +-- three-scene.js          # Three.js procedural building (Manufactura)
|   +-- animations.js           # Scroll reveals + counters
|   +-- gallery.js              # Lightbox
|   +-- main.js                 # Page initialization
|   +-- share.js                # Share page decoder
|   +-- admin-chatbot.js        # Chatbot NLP
|   +-- admin.js                # Admin CRUD
+-- assets/
    +-- manufactura/            # Manufactura photos + video
    +-- skazka/                 # Skazka photos + video + rooms/
    +-- shared/                 # Favicon, OG image
```

## Adding a New Building

1. Create `css/themes/new-building.css` with 60-30-10 color tokens
2. Create `js/scenes/new-building-scene.js` (procedural Three.js)
3. Add NLP triggers in `js/admin-chatbot.js`
4. Update `js/share.js` theme decoder
5. Add building card to `index.html`

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, ES6+ JavaScript
- **3D**: Three.js (procedural BoxGeometry + CanvasTexture)
- **Images**: WebP with JPG fallback
- **Localization**: Custom i18n with `data-i18n` attributes
- **Contact**: WhatsApp, Telegram, Viber deep links