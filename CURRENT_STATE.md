# CURRENT_STATE.md — Pak Liew Chinese Muslim Restaurant PWA

**Last Verified Timestamp:** 2026-08-25T19:20:00+08:00  
**Project Path:** `D:\ARH-GITHUB\arhsmoque2\ARH-MAKAN-PakLiew\`  
**GitHub Remote:** `https://github.com/arhsmoque2/ARH-MAKAN-PakLiew`  
**Operational Status:** 🟢 ACTIVE & SERVING LIVE (Cloudflare Edge + Local Bootstrap)  

---

## 1. Live Deployment & Ingress Status

| Ingress Target | URI / URL | Status | Response |
| :--- | :--- | :--- | :--- |
| **Cloudflare Edge (Global)** | `https://arh-makan-pakliew.arh-homelab.workers.dev` | 🟢 Active | `HTTP/2 200 OK` (0ms cold start) |
| **Local Preview** | `http://localhost:8091` | 🟢 Active | `HTTP/1.1 200 OK` |
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
├── CURRENT_STATE.md    # Verified continuation snapshot (this document)
├── AGENTS.md           # Developer & store-forking runbook
├── websearch-findings.md # External intelligence & multi-channel ground truth report
├── docs/decisions/
│   ├── 0001-pak-liew-frontend-redesign-and-nanyang-chinese-muslim-realignment.md # Accepted ADR
│   └── 0002-deployment-platform-selection-and-cloudflare-workers-convergence.md # Accepted ADR
├── data/
│   ├── store.json      # Verified contact, hours, location, Waze, FoodPanda (4.9⭐) & pricing matrix
│   └── menu.json       # Nanyang Chinese-Muslim dishes (Live Wok, Dim Sum, Mains, FoodPanda sets)
├── .agents/skills/     # Antigravity/Gemini agent skills (malaysian-localized-copy-register)
├── .claude/skills/     # Claude Code agent skills (malaysian-localized-copy-register)
└── images/             # 5 High-resolution authentic photographic snapshots
```
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

## 4. Architectural Guarantees & Non-Regressions

1. **Zero Woodfire Coupling:** The repository operates in complete isolation from `D:\ARH-GITHUB\arh-fnb-tier-showroom\` and `ARH-FNB-Webapp`.
2. **Zero Build Step:** 100% standard Vanilla HTML5 / CSS3 / ES Modules. No bundlers or Node build steps required for deployment.
3. **Declarative Reusability:** Store identity is driven entirely by `data/store.json`, menu by `data/menu.json`, and theme by `:root` custom properties in `styles.css`.
4. **Governing Standards:** Conforms to `arh-frontend-design-v1.0.0` (Proof-Led, Class Without Distance) and `malaysian-localized-copy-register` (Object Collocation, Gated Slang).

---

## 5. Cold-Start Single Next Action

👉 **When picking up this project in a new session:**
1. Verify live server responsiveness on `http://localhost:8091` or relaunch via `arh-server-deploy-bootstrap`.
2. Open in browser to inspect the renovated Nanyang Chinese-Muslim aesthetic.
3. If ready for production deployment: Run `wrangler deploy` using Workers Assets under target domain.
3. If ready for production deployment: Initialize standalone Cloudflare Workers project (`wrangler deploy` using Workers Assets) under account domain.
