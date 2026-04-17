# Mr. Rollo — Design System

**Naturalnie dla Ciebie.**

Identyfikacja wizualna marki Mr. Rollo — polskiego cateringu dietetycznego działającego od 2007 roku. System identyfikacji oparty na rebrandingu 2026 przygotowanym przez MKWM Studios.

## Źródła

Wszystkie materiały źródłowe są w `uploads/` (pliki od klienta):
- `MRROLLO - brandbook 2026 v2.pdf` — księga znaku (15 stron)
- `colors.pdf`, `colors.txt` — pełny system kolorów (13 rodzin × 9 stopni = 117 tokenów)
- Logo: `Logo_Mr Rollo_CMYK_zielony_3-04 kopia copy.pdf`, `Logo_Mr Rollo_RGB_czarny.png`, `Logo_Mr Rollo_RGB_zielony_y.png`
- Ikony diet: `vege.svg`, `keto.svg`, `niski ig.svg`, `ryba.svg`, `truskawka.svg`, `udko.svg`, `wąs.svg` (maskotka)
- 25 zdjęć posiłków (`DSC07905.jpg` – `DSC08076.jpg`)

## Struktura projektu

```
├── README.md                  ← ten plik
├── SKILL.md                   ← instrukcja użycia jako Agent Skill
├── colors_and_type.css        ← wszystkie tokeny (kolory, typografia, spacing, radii, shadows)
├── assets/
│   ├── logos/                 ← logo PNG (RGB czarny + zielony) i PDF (CMYK)
│   ├── icons/                 ← 7 ikon diet + maskotka
│   └── photos/                ← 25 zdjęć potraw (meals-grid, pasta-salmon, …)
├── preview/                   ← karty Design System tab (do przeglądania)
└── ui_kits/
    └── website/               ← UI kit marketing’owej strony
        ├── index.html
        ├── Components.jsx
        └── Sections.jsx
```

## Indeks

- **Kolory i typografia:** `colors_and_type.css`
- **UI kit strony:** `ui_kits/website/`
- **Podglądy tokenów:** `preview/colors-*.html`, `preview/type-*.html`, `preview/spacing.html`, `preview/radii-shadows.html`
- **Podglądy komponentów:** `preview/buttons.html`, `preview/forms.html`, `preview/badges.html`, `preview/meal-cards.html`
- **Podglądy marki:** `preview/logos.html`, `preview/tagline.html`, `preview/icons.html`, `preview/photography.html`, `preview/voice.html`, `preview/diets.html`

---

## VISUAL FOUNDATIONS

### Kolor
- **Trzy kolory główne:** główny zielony `#C6D359` (primary), pomarańcz `#EF522D` (accent only — **nigdy w logo**), neutralna czerń `#231F20`.
- Pomarańcz pojawia się w siatce konstrukcyjnej logo oraz jako akcent w UI (CTA badge, wyróżniki) — nigdy jako główna powierzchnia.
- **Rozszerzona paleta** (10 rodzin): żółty, morski, chartreuse, szmaragdowy, trawiasty, łososiowy, niebieski, różowy, piaskowy, limonkowy. Każda ma pełną skalę 9-stopniową (50–900) z zaznaczoną kotwicą (★) odpowiadającą oryginalnemu kolorowi firmy.
- **7 kolorów diet** (kotwice 200/300): Z Mięsem `#DDA79E`, Vege `#BAD173`, Vege+ `#71B783`, Wegan `#93D0B4`, Low IG `#F3ABCD`, Keto `#86D0CC`, Fit `#F0ED6E`.
- Tła: biel `#FFFFFF`, kremowy `#F7F6F6`, zielony `#C6D359` dla hero, czerń `#231F20` dla inverse.

### Typografia
- **Jost** (Google Variable) — główny krój; nagłówki, UI, przyciski. Wagi 300/400/500/600/700. Letter-spacing `-0.02em` dla dużych tytułów.
- **Open Sans** (Google) — dodatkowy; treść, paragrafy.
- **Caveat** (Google) — ręczny akcent; tylko tagline’y, krótkie wyróżniki, napisy ozdobne. Często z lekkim obrotem (-3°).
- **Mr. Rollo Custom Letters** — dedykowane pismo ręczne; **tylko w logo**. Nie ma webfonta — używaj PNG z `assets/logos/`.

### Backgrounds
- Biel i kremowy (`#FFFFFF`, `#F7F6F6`) jako domyślne tła sekcji.
- Full-bleed zielony `#C6D359` dla hero i CTA — kolor jest na tyle czysty, że jest sam w sobie bohaterem.
- Czarny `#231F20` dla finalnego CTA i stopki.
- **Bez gradientów.** Bez wzorów. Bez tekstur. System jest płaski, czysty, „usystematyzowany, gotowy na każde medium”.
- Zdjęcia potraw (top-down lub pod kątem, naturalne światło, neutralne tła) pełnią rolę wizualnej narracji.

### Zaokrąglenia
- `4 / 8 / 12 / 20 / 28 / 40 / 999 (pill) / 50% (coin)`.
- Karty posiłków: `20–24px`. Przyciski: zawsze `pill` (999px). Inputy: `12px`. Duże panele: `28px`.
- Logo i niektóre elementy dekoracyjne: `50%` — kołowe „monety”.

### Shadows
- 5-stopniowy system, wszystkie oparte na `rgba(35,31,32, α)` — cień ma ciepły czarny podtonu.
- `xs → xl`: `0 1px 2px / 6% → 0 28px 80px / 18%`.
- Focus ring: `0 0 0 3px rgba(198, 211, 89, 0.45)` — zielony, 3px, zawsze widoczny.
- **Bez inner shadows.** Bez glow. Bez neonów.

### Spacing
- Baza 4px. Skala: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128`.
- Sekcje landing page: `padding: 80px 40px` vertical/horizontal.
- Karty: `padding: 14–28px` zależnie od rozmiaru.

### Animacje
- Subtelne. `translateY(-1px)` na hover przycisku + `shadow-sm`. `scale(0.98)` na active.
- Easing: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`. Duration: `120ms` dla mikro-interakcji, `200ms` domyślnie, `360ms` dla większych transitionów.
- **Bez bounce** poza `ease-spring` zarezerwowanym dla wyjątkowych momentów (np. dodanie do koszyka).

### Borders & transparency
- Borders: `1–1.5px` na inputach i cichych kartach (`--neutral-100/200`).
- Brak szkła/blur. Transparentność używana tylko dla nakładek na zdjęciach (`rgba(255,255,255,0.88–0.92)` dla tagów/przycisków).

### Fotografia
- **Top-down lub pod kątem 45°.** Naturalne światło. Neutralne, surowe tła (jasny kamień, drewno, ciemna deska).
- Ciepła paleta — żywe, świeże kolory potraw kontrastują z neutralnym tłem.
- **Nigdy b&w.** Nigdy ciężkiego koloru/filtra. Nigdy ziarna.
- Kompozycja zostawia pustą przestrzeń (copy-space) na tekst.

### Layout rules
- Container: `max-width: 1200px` centrowany.
- Grid 12-kolumnowy implicite (trzy karty w rzędzie dla menu tygodnia).
- Sticky header na scrollu. Footer czarny, cztery kolumny.

---

## CONTENT FUNDAMENTALS

### Język
- **Domyślnie polski.** Formy osobowe „Ty/Tobie”, nie „Państwo”. Ton koleżeński, ale z szacunkiem.
- **Krótko.** Zdania 5–12 słów. Akapity do 3 zdań.
- **Zwięźle.** Brak wypełniaczy. Jeśli nie niesie znaczenia — usuń.
- **Ciepło, naturalnie.** Unikamy korporacyjnych kalek („synergia”, „ekosystem”, „innowacyjne rozwiązanie”).

### Casing
- Nagłówki: zdaniowy („Wybierz swoją dietę”), nie Title Case.
- Przyciski: zdaniowy, czasownik na początku („Zamów teraz”, „Zobacz menu”).
- Eyebrow / kapitaliki: UPPERCASE z `letter-spacing: 0.12em`.

### Przykłady — robimy
- „Świeże składniki, naturalny smak.”
- „Wybierz dietę — resztą zajmiemy się my.”
- „Zamów do wtorku, dostawa od poniedziałku.”
- „Dieta Keto · 1800 kcal”
- „Naturalnie dla Ciebie.” (hasło)

### Przykłady — unikamy
- „Zrewolucjonizuj swoje odżywianie już dziś!” (korpo-bełkot)
- „Innowacyjne rozwiązanie dietetyczne 4.0” (buzzwordy)
- „🔥🚀 Mega promka tylko teraz!!!” (emoji + wykrzykniki)
- „Nasz zespół specjalistów oferuje kompleksową obsługę…” (nieosobowe)

### Emoji i ikony w tekście
- **Emoji: nie używamy.** Zamiast tego ikony z `assets/icons/` (line-art, ręcznie rysowane) lub symbole `·`, `→`, `✓`.
- Symbole dozwolone: `·` (separator), `→` (CTA), `✓` (checklist), `★` (anchor w tokenach).

### Wykrzykniki
- Bardzo oszczędnie. Jeden na sekcję maksymalnie. Hasło marki *nie* kończy się wykrzyknikiem.

---

## ICONOGRAPHY

Mr. Rollo używa **wyłącznie własnego zestawu ikon** rysowanych ręcznie w stylu line-art, przypisanych do konkretnych diet:

| Plik (`assets/icons/`) | Znaczenie | Diety |
|---|---|---|
| `chicken-leg.svg` | udko | Z Mięsem |
| `vege.svg` | warzywa | Vege |
| `fish.svg` | ryba | Vege+ |
| `strawberry.svg` | truskawka | Wegan, Fit |
| `low-ig.svg` | indeks glikemiczny | Low IG |
| `keto.svg` | keto | Keto |
| `mustache.svg` | wąs Mr. Rollo | maskotka, akcent brand |

- **Brak icon fontu.** Wszystkie ikony jako pliki SVG — importuj jako `<img src="assets/icons/....svg" />`.
- **Emoji: zakazane** w finalnych produkcjach (UI, print, social copy).
- **Unicode jako ikony:** dozwolone `·`, `→`, `✓`, `★`, `♡/♥` (favorite heart), `×` (close). Strzałki `←↑→↓`.
- **Substytucje:** gdy potrzeba ikony spoza zestawu (np. zamknij, user, koszyk), używamy [Lucide](https://lucide.dev/) jako najbliższego dopasowania (1.5–2px stroke, zaokrąglone końcówki) — **flagujemy każdą substytucję**.

Maskotka — szef kuchni z wąsem (`mustache.svg`) — używana oszczędnie, jako akcent marki, nigdy jako główny element w UI. Logo (`assets/logos/mr-rollo-*.png`) jest kołowym „coin’em” — **nie próbuj go odtworzyć w SVG ani tekstem** — zawsze używaj PNG.

---

## CAVEATS

- **Mr. Rollo Custom Letters** nie ma webfonta. Gdziekolwiek widzisz ten krój — logo — używaj obrazów z `assets/logos/`. W CSS ustawiłem Jost jako zastępnik w `--font-logo`, ale to tylko fallback na krańcowe przypadki.
- **Jost + Caveat** — variable TTF w `fonts/` (dostarczone przez klienta).
- **Open Sans** — ładowane z Google Fonts (CDN). Jeśli potrzebujesz self-host, poproś o pliki `.woff2`.
- **Tylko jeden produkt** — marketing website. Mr. Rollo ma też sklep / checkout / panel klienta, ale w materiałach nie ma ich projektów. Jeśli dostaniesz zrzuty lub kod, dołożę kolejne UI kity.
