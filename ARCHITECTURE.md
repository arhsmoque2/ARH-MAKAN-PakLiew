# ARCHITECTURE.md — Pak Liew Chinese Muslim Restaurant PWA

## 1. Process & Runtime Model
- **Edge Layer:** Cloudflare Workers V8 Isolate (`worker.mjs`) handles incoming HTTP requests and dispatches to edge static assets via `env.ASSETS`.
- **Client Layer:** Pure Vanilla HTML5, CSS3 Custom Properties, and ES Modules (`app.js`). Zero transpilation or bundling overhead.
- **Data Model:** Declarative JSON data stores (`data/store.json`, `data/menu.json`) providing zero-latency client state.
- **Local Preview Server:** Portable zero-dependency Node.js HTTP server (`scripts/preview.mjs`) with standard MIME dispatch, directory index resolution, and local port fallback.

## 2. Quality Gate & Rendering Harness Architecture
The repository enforces a 6-Gate Quality Doctor Suite (`scripts/quality-gate.mjs`):
1. **Gate 1 (Docs Doctor):** Validates the mandatory ARH 7-document suite integrity and accepted ADR header conformance (`scripts/doctor-docs.mjs`).
2. **Gate 2 (Code Doctor):** Validates JSON schema shape, menu item count, entrypoint syntax, and asset disk existence (`scripts/doctor-code.mjs`).
3. **Gate 3 (UI & Copy Register Doctor):** Enforces Malaysian Proof-Led Copy Register, touch target bounds, and Nanyang Pine Jade & Wok Amber color tokens (`scripts/doctor-ui.mjs`).
4. **Gate 4 (Security Doctor):** Audits zero-plaintext secret guardrails and SOPS + Age compliance (`scripts/doctor-secrets.mjs`).
5. **Gate 5 (Edge Doctor):** Validates `wrangler.toml` assets binding and probes live Cloudflare Workers edge ingress (`scripts/doctor-edge.mjs`).
6. **Gate 6 (Render & DOM Doctor):** Executes headless Playwright across Desktop (1440x900), Tablet (768x1024), and Mobile (375x667), verifying zero console errors, dynamic data hydration, interactive search/pax calculator/lightbox behaviors, horizontal layout containment, and `@axe-core/playwright` WCAG 2.1 AA accessibility (`scripts/doctor-render.mjs`).

## 3. Security Boundaries
- **Secrets Governance:** Mozilla SOPS + Age encryption (`secrets.enc.yaml`). Zero plaintext tokens in Git.
- **Content Security:** Strict sanitization, no external analytics trackers, zero third-party cookie dependencies.