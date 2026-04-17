# Mr. Rollo — Website UI kit

Hi-fi recreation of the Mr. Rollo marketing website in React (inline JSX + Babel).

## Files
- `index.html` — interactive demo of the homepage (hero, diet picker, weekly menu, how-it-works, CTA, footer).
- `Components.jsx` — atomic components: `Logo`, `Button`, `DietChip`, `MealCard`, `Header`, `Footer`.
- `Sections.jsx` — page sections: `HeroSection`, `DietsSection`, `MenuSection`, `HowItWorks`, `CtaSection`.

## Interactions
- Click a diet chip → updates the featured-diet panel.
- Click "Koszyk" in the header → increments cart count.
- Click a meal card's heart → toggles favorite.

## Notes
- All colors come from `../../colors_and_type.css` (CSS vars). No hard-coded brand hex in components.
- Photography uses `assets/photos/*`. Icons use `assets/icons/*.svg`.
- Logo is a circular PNG — never rebuild as SVG/text.
- Orange is used as an accent only (CTA badge, favorite heart). It never appears in the logo or as a primary UI surface.
