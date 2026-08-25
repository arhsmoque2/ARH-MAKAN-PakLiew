# CHANGELOG.md

All notable changes to this project will be documented in this file.

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