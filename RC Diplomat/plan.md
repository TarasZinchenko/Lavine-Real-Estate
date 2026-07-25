# RC Diplomat: Premium Web Presentation Plan

Based on our recent breakthroughs with the "Skazka" project, this plan outlines the creation of a high-end, storytelling-driven web presentation for **RC Diplomat**.

## User Review Required
> [!IMPORTANT]  
> Please review the proposed color palette and thematic direction below. Because RC Diplomat is a premium object, I want to ensure the "vibe" perfectly aligns with the physical architecture before I start coding.

## Open Questions
> [!QUESTION]
> 1. **Color Palette:** Do we want to stick to a Dark Premium theme (Slate Black `#0D0E10` + Champagne Gold `#C5A880`) for RC Diplomat, or does the building's facade dictate a different dominant color (e.g., Deep Navy Blue or Marble White)?
> 2. **Before/After Sliders:** Do the assets in the `RC Diplomat/assets` folder contain "Before/After" renovation photos that need the custom slider, or is this a purely "As-Is" premium showcase?
> 3. **Video Integration:** I see two `.mp4` videos in the assets. Should we use one as a cinematic looping background for the Hero section instead of the 3D Topography canvas?

## Proposed Architecture & Design

### 1. Thematic & Vibe Modularity
- **Theme File:** `css/themes/diplomat.css`
- **60-30-10 Rule:** 
  - 60% Background: Deep rich darks (or whites, pending Taras's confirmation).
  - 30% Structure: Subdued mid-tones for cards.
  - 10% Accent: Gold or metallic accent for CTAs and interactive elements.

### 2. Editorial Storytelling Layout
Applying our newly established `.clinerules`:
- **Narrative Flow:** The page will not be a dry spec sheet. It will be a story (e.g., Location, Architecture, Lifestyle).
- **Unboxed Text:** Hero quotes and expert opinions will float directly on the background without heavy glass panels, creating an airy, premium editorial magazine feel.
- **1:1 Equalized Heights:** All image cards and adjacent text cards w/lo

### 4. Zero-Dependency Bundling
- The final product will be compiled using our `bundle_standalone.py` script into a single `diplomat_standalone.html` file.
- All CSS, JS, and essential images (Base64) will be inlined so the presentation can be sent via Telegram/Viber and opened instantly, offline, with zero latency.

## Verification Plan
### Automated & Scripted Tests
- Run `bundle_standalone.py` to ensure the final HTML size is manageable and contains no broken local links.
### Manual Verification
- Test on mobile (Chrome/Safari) to verify that 1:1 aspect ratios hold up on small screens and that unboxed text remains legible against the background.
- Verify smooth playback of video assets.
