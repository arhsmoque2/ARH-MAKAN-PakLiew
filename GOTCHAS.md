# GOTCHAS.md — Standardized Failure Capsules

### Gotcha 1: Cloudflare Wrangler TOML String Quotes
- **Symptom:** `Invalid TOML document: invalid value` on `wrangler deploy`.
- **Root Cause:** PowerShell string escaping adding literal backslashes around quotes.
- **Permanent Fix:** Use standard single-quoted PowerShell strings or explicit UTF-8 `Set-Content`.
- **Verification:** `npx wrangler deploy --dry-run` exits 0.

### Gotcha 2: Forbidden Hype Adjectives & Regex Escaping
- **Symptom:** Overclaiming language ("padu", "giler") triggers consumer skepticism; unescaped JS regex strings `'\\bpadu\\b'` treated `\b` as backspace control character and missed violations.
- **Root Cause:** In JavaScript string literals passed to `RegExp`, single backslash `\b` is backspace.
- **Permanent Fix:** Use double backslash `'\\\\bpadu\\\\b'` in regex strings and run `node scripts/doctor-ui.mjs`.
- **Verification:** `node scripts/doctor-ui.mjs` correctly detects unapproved hype adjectives in JSON/HTML.

### Gotcha 3: CSS Specificity Overriding `[hidden]` on Modals
- **Symptom:** Elements on the page cannot be clicked; Playwright reports `<div hidden class="modal-backdrop"> intercepts pointer events`.
- **Root Cause:** Class selector `.modal-backdrop { display: flex; ... }` has higher specificity than browser user-agent `[hidden] { display: none; }`, keeping the transparent overlay active.
- **Permanent Fix:** Add explicit `[hidden] { display: none !important; }` and `.modal-backdrop[hidden] { display: none !important; }` in `styles.css`.
- **Verification:** Playwright test `tests/dom-and-rendering.spec.mjs` verifies click actions without pointer interception.

### Gotcha 4: Sandbox Outbound IP 403 vs CI Edge Probe 200
- **Symptom:** Probing the production Workers URL from certain sandboxed cloud agent environments returns `HTTP 403`, while GitHub Actions runners and normal browsers return `HTTP 200`.
- **Root Cause:** Cloudflare WAF/Bot Management rules flagging proxy/datacenter egress IPs or TLS fingerprints, not an application-level downtime.
- **Permanent Fix:** Run authoritative edge preflights from GitHub Actions CI runners and log environmental context in documentation.
- **Verification:** `node scripts/doctor-edge.mjs` executed via GitHub Actions CI.

### Gotcha 5: Long Button Text on Small Viewports (375px)
- **Symptom:** Horizontal page scrollbar appears on mobile devices (e.g. iPhone SE).
- **Root Cause:** `.button` having `white-space: nowrap` on long text like WhatsApp booking CTAs.
- **Permanent Fix:** Add `white-space: normal; text-align: center;` for buttons under `@media (max-width: 600px)`.
- **Verification:** Playwright test `tests/viewport-responsiveness.spec.mjs` asserts `document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1`.