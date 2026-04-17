---
name: mr-rollo-design
description: Use this skill to generate well-branded interfaces and assets for Mr. Rollo (polska marka cateringu dietetycznego, rebrand 2026), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Key entry points:
- `colors_and_type.css` — all design tokens (colors, typography, spacing, radii, shadows, motion). Link directly from any HTML you produce.
- `assets/logos/` — logo PNGs (RGB black + green) and CMYK PDF. **Never redraw the logo as SVG or text; always use the PNG.**
- `assets/icons/` — 7 hand-drawn diet icons + the Mr. Rollo mustache mascot.
- `assets/photos/` — 25 food photographs (top-down, natural light, neutral backgrounds).
- `ui_kits/website/` — React (inline JSX) homepage UI kit — copy components from here when building new pages.
- `preview/` — renderable token + component cards for reference.

Brand rules to internalize:
- Three brand colors: green `#C6D359` (primary), orange `#EF522D` (**accent only, never in the logo**), black `#231F20`.
- Seven diets, each with a color + icon (see README "Diety"): Z Mięsem, Vege, Vege+, Wegan, Low IG, Keto, Fit.
- Type: **Jost** (display, UI), **Open Sans** (body), **Caveat** (handwritten accent, used sparingly).
- Tagline: „Naturalnie dla Ciebie." always in Caveat.
- Copy is Polish by default, "Ty" not "Państwo", short, warm, no emoji, minimal exclamation marks.
- No gradients, no glassmorphism, no heavy shadows, no icon fonts. Photography is top-down / 45°, warm, natural light.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
