# ARCHITECTURE.md — Pak Liew Chinese Muslim Restaurant PWA

## 1. Process & Runtime Model
- **Edge Layer:** Cloudflare Workers V8 Isolate (`worker.mjs`) handles incoming HTTP requests and dispatches to edge static assets via `env.ASSETS`.
- **Client Layer:** Pure Vanilla HTML5, CSS3 Custom Properties, and ES Modules (`app.js`). Zero transpilation or bundling overhead.
- **Data Model:** Declarative JSON data stores (`data/store.json`, `data/menu.json`) providing zero-latency client state.

## 2. Security Boundaries
- **Secrets Governance:** Mozilla SOPS + Age encryption (`secrets.enc.yaml`). Zero plaintext tokens in Git.
- **Content Security:** Strict sanitization, no external analytics trackers, zero third-party cookie dependencies.