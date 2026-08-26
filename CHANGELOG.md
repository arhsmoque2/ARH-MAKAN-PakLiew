# CHANGELOG.md

All notable changes to this project will be documented in this file.

## [1.4.0] - 2026-08-26
### Changed
- Replaced the emoji used throughout the page (hero badges/CTAs, session
  card icons, category chips, price calculator, WhatsApp button, location
  card, live-status labels, menu card badges) with a single inline SVG
  icon sprite (`#icon-check`, `#icon-clock`, `#icon-pin`, `#icon-phone`,
  `#icon-chat`, `#icon-nav`, `#icon-map`, `#icon-search`, `#icon-sun`,
  `#icon-moon`, `#icon-sunrise`, `#icon-star`, `#icon-calc`) defined once
  at the top of `index.html` and referenced via `<use>` -- emoji read as a
  WhatsApp-chat/toy register rather than a restaurant brand, and don't
  take the surrounding text colour the way `stroke: currentColor` icons
  do. Category chips and calculator `<option>`s dropped their emoji
  outright instead of getting an icon (not every label needs one).
  `.session-icon` went from a bare emoji glyph to a proper 44px circular
  icon badge tinted `var(--pl-amber-glow)`.
- Hero clip's own footage slowed further, 0.55x -> 0.4x playback rate
  (`app.js`): the previous pass's 0.55x still read as a fast-forward
  handheld pan next to the now-calm still. The clip's CSS Ken Burns pan
  was also split off the still's shared keyframe onto its own, smaller-
  amplitude one (`pl-hero-drift-clip`, was reusing `pl-hero-drift`'s
  1.04->1.09 range at 34s) so the CSS pan stops compounding with the
  slowed-down footage into something that reads faster than either alone.
- Card makeover, closer to the rounded/glass card + photo-hover-reveal
  pattern of the reference sites this pass was checked against
  (mythikana.vercel.app, themelooper.com/html/foodpoint, verde-resturant.
  netlify.app -- all three blocked by this session's network egress, so
  the makeover follows the well-established version of that pattern
  rather than each site's exact CSS): `.menu-item-card`, `.session-card`,
  `.location-card`, and `.location-map-wrap` corner radius bumped
  `--radius-md` (14px) -> `--radius-lg` (24px). `.hero-showcase-card`
  (the one card sitting directly on the hero's photo/video canvas) moved
  from an opaque panel to real frosted glass (translucent fill +
  `backdrop-filter: blur(20px) saturate(140%)`), with its text pinned to
  fixed light-on-dark values the same way `.hero-title` already was (see
  `ui.md` §1.4 for why). Menu-card and showcase-card photos now reveal a
  soft dark gradient on hover in addition to the existing zoom, and
  `.menu-item-card`/`.session-card` hover states pick up the amber border
  + `--shadow-md` treatment `.session-card.is-highlight` already used.
  `.visual-card`'s single booking-section photo gained the same hover
  zoom the other photo cards have.
- `ui.md` updated in the same pass: the icon system, the video-pacing
  follow-up, and the card-glass treatment (with an explicit note that
  `.hero-showcase-card` no longer belongs in §1.4's "self-contained
  opaque surface" list now that it's glass on the hero's non-flipping
  canvas).

## [1.3.0] - 2026-08-26
### Changed
- Palette moved from a dark forest-green + gold night canvas to a pastel,
  paper-light-by-default register: same two anchor hues (sage jade + gold),
  softened, warm cream `--pl-pine-deep` canvas as the default ambience;
  dark mode retuned to a softer charcoal-sage (was near-black) and kept as
  the secondary, toggled state. Alarm-red `--pl-seal` -> dusty clay.
- Typography: Cinzel -> Fraunces (headline), Plus Jakarta Sans -> DM Sans
  (body) -- Cinzel's Roman/imperial letterforms read as a generic
  "premium fine-dining" signifier borrowed from Woodfire's own register;
  Fraunces is warmer/editorial and gives Pak Liew its own identity.
- Logo badge (`.seal-stamp`): hard-cornered red chop-stamp box with a
  glowing red shadow -> soft circular clay monogram -- the "official
  Chinese seal" visual cliché replaced with a boutique-badge treatment.
- Copy: removed "berapi"/"wok hei"/🔥 fire-wok framing throughout
  (`index.html`, `app.js`, `data/menu.json`, `data/store.json`) --
  "Sajian Kuali Panas Berapi" -> "Bufet Segar, Setiap Sesi"; "Live Wok" ->
  "Stesen Live" wherever it appeared as a label. The live-cooking value
  proposition ("cooked fresh in front of you") is kept; the fire/wok
  iconography specifically is not.
- Hero rotator paced slower: crossfade 1.6s -> 2.6s, still-hold 6s -> 9s,
  drift durations lengthened (18s -> 26s/34s); the clip's own playback
  slowed to 0.55x (`app.js`) since the handheld pan itself, not just the
  rotator's timing, was the "too fast" complaint. Both hero layers now
  carry Ken Burns (previously only the still did).
- `ui.md` updated in the same pass -- palette/typography tables, the
  hero/logo-badge component descriptions, and §1.4's accessibility notes
  now match what's actually shipped (also reconciled a long-standing
  mismatch: §1.1 documented `--pl-emerald*`/`--pl-gold*` token names that
  never matched the real `--pl-pine*`/`--pl-amber*` names in `styles.css`).

### Added
- Ambient Ken Burns on every menu-grid photo, the hero showcase card's
  photo, and the item-detail lightbox's photo -- ported from the arh-fnb
  Beelal Coffee storefront's `.item-media` pattern (`index-v2.html`):
  continuous slow drift, not just a hover effect, plus a `scale(1.06)`
  hover lift on the wrapper (kept separate from the animated `img` itself,
  since animating and hover-transitioning the same property on one
  element fights).

### Fixed
- Two more instances of the hero-canvas contrast bug from the previous
  release (`.pill-amber`, `.amber-gradient`): both used
  `var(--pl-amber-bright)`, which the palette redesign turned into a deep,
  paper-safe gold for light-mode text-on-cream elsewhere on the page --
  exactly the value that goes low-contrast on the hero's non-flipping dark
  canvas. Pinned to a fixed bright gold, same fix as the previous release.

## [1.2.0] - 2026-08-26
### Added
- Ambient hero background rotator (`.hero-rotator`): a real storefront still
  (Ken Burns drift) crossfading with a real dining-room/buffet clip, same
  mechanism as Woodfire Premium's hero. Muted, looped, `prefers-reduced-motion`
  stops it from starting at all.
- `ui.md` §0: `situation_scan`/`resolved_design` classification per the
  `fnb-taste-palette-design` skill (previously absent -- the doc went
  straight to color tokens). §1.4: written accessibility/motion floor.

### Changed
- Retoned `--pl-amber`/`--pl-amber-bright`/`--pl-pine-border`/`--pl-amber-glow`
  to the calmer gold `ui.md` already specified, replacing the more neon
  values the implementation had drifted to.
- Hero CTA row: Waze/FoodPanda buttons (solid brand-colour fills) -> quiet
  outline buttons, so one gold primary CTA carries the row instead of three
  competing brand hues. `pill-green` badge: neon mint -> neutral/quiet.
- Added Cinzel (serif) to `h1`/`h2`/`h3`/`.brand-name` per `ui.md`'s
  already-documented headline face; `h4` keeps `Plus Jakarta Sans`.

### Fixed
- `.qty-stepper input` (pax count, group booking calculator) had
  `outline: none` with no `:focus-visible` replacement -- keyboard users
  got no focus indicator on a real order-path control.
- Missing `@media (prefers-reduced-motion: reduce)` block (present in
  Woodfire Premium's stylesheet, absent here) -- added, covers the new
  hero rotator.
- Hero headline/subtitle/badge/button text went dark-on-dark in light
  ambience mode once the hero background was pinned dark (a photo/video
  backdrop can't sensibly flip with a light/dark toggle) -- pinned those
  specific elements to their dark-mode colour; card-based hero content
  (`.hero-showcase-card`, `.live-status-card`) was already correct since
  background and text flip together there.

## [1.1.0] - 2026-08-26
### Added
- Gate 6: Headless Browser, DOM & Viewport Doctor (`scripts/doctor-render.mjs`) powered by Playwright.
- Cross-viewport automated testing across Desktop Chrome (1440x900), Tablet iPad (768x1024), and Mobile iPhone (375x667).
- Automated accessibility audit with `@axe-core/playwright` verifying WCAG 2.1 / 2.2 AA compliance.
- Portable static preview server (`scripts/preview.mjs`) replacing hardcoded Windows machine path in `package.json`.
- Automated Playwright artifact uploading and Chromium installation in GitHub Actions (`.github/workflows/ci.yml`).

### Fixed
- Fixed critical `.modal-backdrop` CSS specificity bug where hidden modals intercepted pointer events across the page.
- Fixed `guide.html` header button styling and contrast ratio (1.88:1 -> 4.5:1 WCAG AA compliant).
- Fixed mobile button `white-space: nowrap` layout overflow on 375px screens.
- Fixed regex escaping in `doctor-ui.mjs` hype-word filter.
- Fixed `doctor-edge.mjs` to exit with failure status on non-200 responses.
- Removed 30MB of unreferenced duplicate image files.

## [1.0.0] - 2026-08-25
### Added
- Complete Nanyang Chinese-Muslim frontend redesign (ADR 0001).
- Cloudflare Workers Static Assets edge deployment (ADR 0002).
- Dual-language search engine (Malay Romanization + Chinese characters).
- End-to-End 5-Gate Quality Doctor Harness (`scripts/quality-gate.mjs`).
- Automated GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`).