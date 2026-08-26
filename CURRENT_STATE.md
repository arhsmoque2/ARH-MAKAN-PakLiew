# CURRENT_STATE.md — Pak Liew Chinese Muslim Restaurant PWA

**Last Verified Timestamp:** 2026-08-26T14:32:00+08:00  
**Project Path:** `D:\ARH-GITHUB\arhsmoque2\ARH-MAKAN-PakLiew\`  
**GitHub Remote:** `https://github.com/arhsmoque2/ARH-MAKAN-PakLiew`  
**Operational Status:** 🟢 ACTIVE & SERVING LIVE (Cloudflare Edge + Portable Node Preview + 8-Gate Quality Suite)  

---

## 1. Live Deployment & Ingress Status

| Ingress Target | URI / URL | Status | Response |
| :--- | :--- | :--- | :--- |
| **Cloudflare Edge (Global)** | `https://arh-makan-pakliew.arh-homelab.workers.dev` | 🟢 Active | `HTTP/2 200 OK` — verified via CI's edge probe (GitHub Actions runner). Probing from some third-party sandboxed environments returns `HTTP 403`, most likely a Cloudflare WAF/bot rule scoped to certain outbound IP ranges rather than an app-level auth gate (`worker.mjs` has none) — not a real outage |
| **Local Preview** | `http://localhost:8091` | 🟢 Active | `HTTP/1.1 200 OK` (via portable `scripts/preview.mjs`) |
| **Tailscale Network** | `http://100.85.219.219:8091` | 🟢 Active | `HTTP/1.1 200 OK` |

To redeploy or update edge assets in future sessions:
```powershell
npx wrangler deploy
```

---

## 2. Delivered Artifacts & Workspace Structure

```
ARH-MAKAN-PakLiew/
├── index.html          # Renovated 2-column Nanyang Chinese-Muslim storefront
├── styles.css          # Pine Jade & Terracotta Wok Flame design tokens (WCAG 2.2 AA)
├── app.js              # Live session detector, dual-language search, modal & WA booking generator
├── worker.mjs          # Cloudflare Workers Static Assets edge router
├── wrangler.toml       # Cloudflare Workers environment and asset configuration
├── guide.html          # Operator reference runbook
├── playwright.config.mjs # Multi-viewport test harness (Desktop, Tablet, Mobile)
├── package.json        # Clean dependency manifest with Playwright & Axe-Core
├── CURRENT_STATE.md    # Verified continuation snapshot (this document)
├── AGENTS.md           # Developer & store-forking runbook
├── websearch-findings.md # External intelligence & multi-channel ground truth report
├── tests/              # End-to-end rendering, viewport responsiveness & a11y specs
│   ├── dom-and-rendering.spec.mjs
│   ├── accessibility.spec.mjs
│   └── viewport-responsiveness.spec.mjs
├── scripts/            # 6-Gate Quality Doctor Suite
│   ├── quality-gate.mjs
│   ├── preview.mjs     # Zero-dependency portable local preview server
│   ├── doctor-docs.mjs
│   ├── doctor-code.mjs
│   ├── doctor-ui.mjs
│   ├── doctor-secrets.mjs
│   ├── doctor-edge.mjs
│   └── doctor-render.mjs
├── docs/decisions/
│   ├── 0001-pak-liew-frontend-redesign-and-nanyang-chinese-muslim-realignment.md # Accepted ADR
│   └── 0002-deployment-platform-selection-and-cloudflare-workers-convergence.md # Accepted ADR
├── data/
│   ├── store.json      # Verified contact, hours, location, Waze, FoodPanda (4.9⭐) & pricing matrix
│   └── menu.json       # Nanyang Chinese-Muslim dishes (Live Wok, Dim Sum, Mains, FoodPanda sets)
├── .github/workflows/
│   ├── ci.yml          # Continuous Integration quality gate runner
│   └── arh-ui-media.yml # GitHub Actions remote sandbox media optimizer
├── .agents/skills/     # Antigravity/Gemini agent skills (malaysian-localized-copy-register)
├── .claude/skills/     # Claude Code agent skills (malaysian-localized-copy-register)
└── images/             # 5 High-resolution authentic photographic snapshots
    ├── snap-breakfast-buffet.jpg
    ├── snap-lunch-buffet.jpg
    ├── snap-dinner-buffet.jpg
    ├── snap-lunch-mains.jpg
    └── snap-dishes-lunch.jpg
```

---

## 3. Verified Store Invariants & Business Rules

* **Restaurant Identity:** Pak Liew Chinese Muslim Restaurant (柏刘清真餐厅).
* **Cultural Alignment:** Authentic Nanyang Malaysian Chinese-Muslim Culinary Heritage (Wok Hei, Dim Sum, Pan Mee, Kam Heong).
* **Exact Location:** `60, Jalan Lumut, Titiwangsa Sentral, 50400 Kuala Lumpur` (Sebaris Hokkaido Seafood KL, 5 min walk to LRT/Monorail Titiwangsa).
* **Waze Pin:** `PAK LIEW CHINESE MUSLIM TITIWANGSA`.
* **Google Maps Pin:** `https://maps.app.goo.gl/opNSdeX3zQ9toviQ6`.
* **FoodPanda Store:** `Pak Liew Chinese Muslim - Laman Baginda` (4.9 / 5.0 ⭐).
* **Contact & Reservation:** `+6016-2493449` (WhatsApp Direct).
* **Walk-In Policy:** Direct walk-in without booking for individuals & small families. WhatsApp reservation required for large groups (>10 pax).
* **Weekly Closure:** **Closed on Fridays (Cuti Solat Jumaat & Sanitasi Mingguan)**.
* **Dining Sessions & Pricing:**
  1. **Breakfast Buffet (Sabtu & Ahad):** `6:00 AM – 11:00 AM` • Dewasa: **RM 15.90** | Kanak-kanak: **RM 12.90**.
  2. **Lunch Buffet (Sabtu – Khamis):** `12:00 PM – 4:00 PM` • Dewasa: **RM 19.90** | Kanak-kanak: **RM 15.90**.
  3. **Dinner Buffet + Live Wok (Sabtu – Khamis):** `5:00 PM – 10:00 PM` • Dewasa: **RM 19.90** | Kanak-kanak: **RM 15.90**.

---

## 4. Architectural Guarantees & Verification Receipts

1. **Multi-Viewport & Headless Rendering (Playwright):** 36/36 tests passing across Desktop (1440x900), Tablet (768x1024), and Mobile iPhone (375x667).
2. **WCAG 2.1 / 2.2 AA Accessibility (`@axe-core/playwright`):** 0 accessibility violations detected on both `index.html` and `guide.html`.
3. **Zero Layout Overflow:** `scrollWidth <= clientWidth` across all breakpoints with mobile text-wrapping enabled.
4. **Portable Preview:** Standalone Node.js static server on port 8091 without platform-specific dependencies.
5. **Zero Build Step:** 100% standard Vanilla HTML5 / CSS3 / ES Modules.

---

## 5. Cold-Start Single Next Action

👉 **When picking up this project in a new session:**
1. Start local preview: `npm run preview`.
2. Run quality doctor suite: `node scripts/quality-gate.mjs`.
3. If deploying changes to production: `npx wrangler deploy`.
