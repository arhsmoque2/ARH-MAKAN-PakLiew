# QUALITY-GATES.md — Pak Liew Chinese Muslim Restaurant PWA

**Governing System:** ARH Quality Gate Standard & Continuous Assurance Suite  
**Harness Entrypoint:** `node scripts/quality-gate.mjs` (or `npm run doctor`)  
**CI/CD Pipeline:** `.github/workflows/ci.yml` (GitHub Actions on push/PR to `main`)  
**Current Gate Count:** 6 Active Automated Doctors  
**Overall Status:** 🟢 100% GREEN (Passing all contracts)  

---

## 1. Overview & Operational Contract

The Pak Liew Chinese Muslim Restaurant PWA uses an automated multi-stage Quality Doctor Suite to prevent regression, linguistic drift, security breaches, broken runtime rendering, and mobile layout blowouts before any commit reaches production.

### Execution Model
* **Atomic Execution:** `scripts/quality-gate.mjs` orchestrates all doctor gates sequentially via synchronous child processes.
* **Fail-Fast Contract:** Any non-zero exit code immediately halts execution, prints the failing gate's diagnostic report, and terminates the pipeline with exit code `1`.
* **Zero Mocking In Production Gates:** Real network probes, actual data schema validations, and live headless browser executions are enforced.

```powershell
# Run the complete unified 6-Gate Quality Doctor suite:
node scripts/quality-gate.mjs

# Or run individual gates directly:
npm run doctor:docs
npm run doctor:code
npm run doctor:ui
npm run doctor:secrets
npm run doctor:edge
npm run doctor:render
```

---

## 2. Quality Doctor Gate Matrix

| Gate | Name | Script Target | Primary Verification Scope | Blocking Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **Gate 1** | **Documentation & ADR Doctor** | `scripts/doctor-docs.mjs` | Mandatory ARH 7-document suite presence, minimum size thresholds, and ADR valid status headers. | Missing or hollow (<100B) docs; ADR missing `**Status**: Accepted\|Superseded\|Deprecated`. |
| **Gate 2** | **Codebase Hygiene & Data Schema Doctor** | `scripts/doctor-code.mjs` | JSON structure validation for `store.json` and `menu.json`, verifying menu image existence on disk, app entrypoint syntax. | Malformed JSON; missing required fields; missing referenced images; missing `initApp`/`renderLiveStatus`. |
| **Gate 3** | **Malaysian Copy Register & UI Doctor** | `scripts/doctor-ui.mjs` | Malaysian Proof-Led Copy Register enforcement (no unapproved hype words), CSS token existence (`--pl-pine`, `--pl-amber`), >=44px touch targets. | Presence of forbidden hype adjectives (`padu`, `giler`, `terpaling`); missing brand color tokens or minimum touch rules. |
| **Gate 4** | **Security & Zero-Plaintext Doctor** | `scripts/doctor-secrets.mjs` | Secret scanner auditing for plaintext `.env` files, private keys, Cloudflare tokens, GitHub PATs, and Age secret keys. | Presence of `.env` files or regex matches for secret/token patterns in tracked files. |
| **Gate 5** | **Cloudflare Workers Edge Preflight** | `scripts/doctor-edge.mjs` | Cloudflare Workers asset binding validation (`wrangler.toml`), edge router presence (`worker.mjs`), and live edge endpoint HTTP 200 health probe. | Missing `[assets]` binding; missing `worker.mjs`; live HTTP probe returning non-200 or network error. |
| **Gate 6** | **Headless Browser, DOM & Viewport Doctor** | `scripts/doctor-render.mjs` | Playwright multi-viewport headless execution across Desktop (1440x900), Tablet (768x1024), and Mobile (375x667), zero console errors, dynamic data hydration, interactive search/modal/pax calculator, horizontal layout containment, and `@axe-core/playwright` WCAG 2.1 AA accessibility. | Thrown JS runtime errors; failed asset loads (404); unrendered DOM cards; modal pointer interception; horizontal layout overflow (`scrollWidth > clientWidth`); WCAG 2.1 AA accessibility violations. |

---

## 3. Deep Gate Specifications

### Gate 1: Documentation & ADR Doctor (`doctor-docs.mjs`)
* **Objective:** Ensure the repository complies with the ARH Standard Documentation Suite and Architecture Decision Record (ADR) governance.
* **Checks:**
  1. Verifies the existence of all 7 mandatory documents: `README.md`, `ARCHITECTURE.md`, `CHANGELOG.md`, `CURRENT_STATE.md`, `GOTCHAS.md`, `RECIPES.md`, and `AGENTS.md`.
  2. Ensures no hollow documents (each must be >= 100 bytes of substantive content).
  3. Scans `docs/decisions/*.md` and verifies each ADR contains an explicit `**Status**: Accepted | Superseded | Deprecated` header.
* **Direct Command:** `npm run doctor:docs`

### Gate 2: Codebase Hygiene & Data Schema Doctor (`doctor-code.mjs`)
* **Objective:** Prevent malformed JSON data, missing schema attributes, and broken image disk paths from reaching the client.
* **Checks:**
  1. Parses `data/store.json` and verifies required fields (`name`, `chineseName`, `phone`, `whatsapp`, `address`, `googleMapsUrl`, `foodpandaUrl`, and at least 3 dining sessions).
  2. Parses `data/menu.json` and verifies `categories` and `items` arrays.
  3. Cross-references every item's `image` path against the physical filesystem under `images/` to guarantee zero broken image links on disk.
  4. Confirms `app.js` exports and entrypoint integrity.
* **Direct Command:** `npm run doctor:code`

### Gate 3: Malaysian Copy Register & UI Doctor (`doctor-ui.mjs`)
* **Objective:** Protect cultural persona integrity, prevent hyperbole/overpromising, and verify brand design tokens.
* **Checks:**
  1. Scans `index.html` and `data/menu.json` using word-boundary regex (`\\b(padu|giler|gila|terpaling|mantul|kaw-kaw|power)\\b`) derived from the `malaysian-localized-copy-register` standard.
  2. Audits `styles.css` for minimum touch target bounds (`min-height: 44px`).
  3. Confirms canonical Nanyang color variables (`--pl-pine`, `--pl-amber`) are defined in stylesheet.
* **Direct Command:** `npm run doctor:ui`

### Gate 4: Security & Zero-Plaintext Doctor (`doctor-secrets.mjs`)
* **Objective:** Prevent accidental leakage of credentials, tokens, or unencrypted secrets into Git.
* **Checks:**
  1. Asserts that forbidden plaintext configuration files (`.env`, `.env.local`, `keys.txt`, `id_rsa`, `id_ed25519`) do not exist in the repository root.
  2. Scans tracked files (`wrangler.toml`, `worker.mjs`, `app.js`, `index.html`, `package.json`) against regex signatures for Cloudflare API tokens, GitHub personal access tokens (`ghp_`, `github_pat_`), and Age private keys.
* **Direct Command:** `npm run doctor:secrets`

### Gate 5: Cloudflare Workers Edge Preflight (`doctor-edge.mjs`)
* **Objective:** Verify edge deployment readiness and confirm live production ingress health.
* **Checks:**
  1. Validates `wrangler.toml` syntax and static asset binding configuration (`[assets]`).
  2. Confirms edge routing handler `worker.mjs` is present.
  3. Performs an active HTTP probe to `https://arh-makan-pakliew.arh-homelab.workers.dev` and asserts an `HTTP 200 OK` response. Exits 1 if unreachable or non-200.
* **Direct Command:** `npm run doctor:edge`

### Gate 6: Headless Browser, DOM & Viewport Doctor (`doctor-render.mjs`)
* **Objective:** Replace static assumption with actual browser execution, verifying rendering, interactivity, accessibility, and responsiveness.
* **Harness:** Playwright (`playwright.config.mjs`) + `@axe-core/playwright` using local portable web server (`scripts/preview.mjs`).
* **Checks:**
  1. **Zero Console Errors:** Asserts 0 thrown JS exceptions, syntax errors, or uncaught rejections during page boot and interaction.
  2. **DOM Hydration:** Asserts that `data/store.json` and `data/menu.json` hydrate into the live DOM (all 23 dish cards rendered with badges, images, and session tags).
  3. **Multi-Viewport Layout Containment:** Runs headlessly across 3 distinct viewport projects:
     - **Desktop Chrome:** 1440 × 900
     - **Tablet iPad:** 768 × 1024
     - **Mobile iPhone SE:** 375 × 667
     Asserts zero horizontal scroll overflow (`document.documentElement.scrollWidth <= clientWidth + 1`).
  4. **Interactive Workflows:**
     - Category filtering (switching between "Semua", "Live Wok", etc. updates item count dynamically).
     - Live search input with real-time filtering, debounce, and empty state rendering.
     - Food item lightbox modal dialog open/close lifecycle (verifying backdrop click and close button).
     - Pax & Pricing Calculator stepper controls (updating adult/child counters, calculating total RM estimate, and generating WhatsApp booking URL).
     - Light/Dark Ambience mode toggle switching `html[data-mode]`.
  5. **Automated Accessibility Audit:** Executes `axe-core` across `index.html` and `guide.html`, enforcing WCAG 2.1 / 2.2 AA standards (color contrast >= 4.5:1, button accessible names, landmark structure).
  6. **Asset Network Integrity:** Asserts that rendered image elements load with non-zero natural dimensions (`naturalWidth > 0`) and zero 404 HTTP errors.
  7. **`[hidden]` Attribute Integrity (regression guard):** Asserts every `[hidden]` element in the DOM actually computes to `display: none`, and that the element sitting at the exact viewport center on load is real page content — not a stray full-screen overlay. Deterministic, no visual baseline required; directly catches the CSS-specificity-overrides-`[hidden]` bug class (see §4.3) regardless of which selector or property causes it next time.
* **Direct Command:** `npm test` or `npm run doctor:render`

---

## 4. Historical Fixes & Hardened Gotchas

1. **Gate 3 Word-Boundary Regex Escaping:**  
   *Symptom:* The forbidden hype word check previously missed occurrences because strings were passed as plain `'\bpadu\b'`, where JavaScript interpreted `\b` as the ASCII backspace character rather than a regex word boundary.  
   *Fix:* Converted patterns to properly escaped `'\\bpadu\\b'`.
2. **Gate 5 Non-200 Failure Enforcement:**  
   *Symptom:* Non-200 responses previously emitted `console.warn` without failing the gate.  
   *Fix:* Updated `doctor-edge.mjs` to set `failed = true` and `process.exit(1)` on any non-200 status.
3. **Modal Backdrop CSS Specificity Overriding `[hidden]`:**  
   *Symptom:* In `styles.css`, `.modal-backdrop { display: flex; position: fixed; inset: 0 }` overrode the user agent `[hidden] { display: none }` default (author styles win regardless of specificity ties), leaving a full-screen `rgba(0,0,0,0.75)` + `blur(8px)` overlay rendering on every page load and intercepting all clicks — this shipped to production undetected because no gate rendered the page at all until Gate 6 existed.  
   *Fix:* Added explicit `[hidden] { display: none !important; }` and `.modal-backdrop[hidden] { display: none !important; }`.  
   *Regression guard:* `tests/dom-and-rendering.spec.mjs` → *"No `[hidden]` element renders visibly or intercepts pointer events on initial load"* (Gate 6, check 7) — asserts computed `display` for every `[hidden]` element and that viewport-center hit-testing lands on real content, so this bug class fails CI deterministically next time, on any selector.
4. **Mobile 375px Button Overflow:**  
   *Symptom:* Buttons with long text (`.button-whatsapp`) had `white-space: nowrap`, overflowing 375px screens.  
   *Fix:* Added `white-space: normal; text-align: center;` under `@media (max-width: 600px)` in `styles.css`.
5. **Portable Preview Server:**  
   *Symptom:* `package.json` previously referenced a hardcoded Windows path `D:/_ARH-AGENT-OS/...` for previewing.  
   *Fix:* Implemented `scripts/preview.mjs` as a cross-platform static HTTP server running on port 8091.
