# CHANGELOG.md

All notable changes to this project will be documented in this file.

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