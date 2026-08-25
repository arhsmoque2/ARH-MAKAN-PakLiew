# AGENTS.md — Pak Liew Chinese Muslim PWA & Storefront Fork Guide

## 1. Runtime Orientation & System Purpose

This repository houses the standalone, zero-dependency menu PWA for **Pak Liew Chinese Muslim Restaurant** (Titiwangsa Sentral, Kuala Lumpur). It represents the canonical **Buffet / Multi-Session Tier** of the ARH F&B engine, featuring autonomous time-aware session routing, bilingual menu rendering, group booking calculations, and direct WhatsApp / Waze ingress.

### 🛡️ Isolation Rule
* **Completely Decoupled:** This project lives independently inside `_AGENT-WORKSPACE/projects/pak-liew-chinese-muslim-pwa/`.
* **Zero Cross-Fleet Mutation:** Never mutate or import dependencies from `arh-fnb-tier-showroom` or shared Woodfire repositories. All assets, data schemas, and styles must remain 100% self-contained.

---

## 2. Store Architecture: 3-Tier Declarative Configuration

All store-specific data is isolated from the UI rendering engine (`index.html`, `app.js`) across 3 declarative tiers:

```
pak-liew-chinese-muslim-pwa/
├── data/
│   ├── store.json       # Tier 1: Store identity, location, sessions & pricing rules
│   └── menu.json        # Tier 2: Menu catalog, bilingual names & session tags
├── styles.css           # Tier 3: Brand palette tokens & geometry variables
├── app.js               # Autonomous engine: Clock, Search, Modals, Pax Calculator
├── index.html           # Universal component shell
├── guide.html           # Operator reference runbook
├── ui.md                # UI & design tokens specification
├── design.md            # Functional & architectural design specification
└── images/              # Local high-res photo assets
```

---

## 3. How to Fork This Repo for a New Restaurant

When an operator requests: *"Build another shop by forking from Pak Liew"*, follow this deterministic 5-step runbook:

### Step 1: Clone into an Isolated Workspace
```powershell
Copy-Item -Recurse "D:\_ARH-AGENT-OS\_AGENT-WORKSPACE\projects\pak-liew-chinese-muslim-pwa" "D:\_ARH-AGENT-OS\_AGENT-WORKSPACE\projects\<new-store-slug>-pwa"
```

### Step 2: Configure Store Metadata (`data/store.json`)
Edit only `data/store.json` to define the new brand:
* `store.slug`: Unique identifier (e.g. `restoran-ali-chinese-muslim`).
* `store.name` & `store.tagline`: Display title and marketing slogan.
* `store.phone` & `store.whatsapp`: Owner WhatsApp number (`601...` format without `+` or `-`).
* `store.address`, `store.waze`, `store.googleMapsUrl`: Exact location & navigation deep links.
* `store.sessions`: Array of active meal sessions with custom adult/child prices and day/time schedules:
  ```json
  "sessions": [
    {
      "id": "lunch",
      "name": "Buffet Lunch",
      "days": "Saturday - Thursday",
      "timeRange": "12:00 PM - 4:00 PM",
      "priceAdult": 19.90,
      "priceChild": 15.90
    }
  ]
  ```

### Step 3: Populate Menu Catalog (`data/menu.json`)
Replace or extend categories and items:
* `categoryId`: Matches one of `categories[].id`.
* `name`: Primary dish title (e.g., `Udang Nestum Rangup`).
* `chineseName`: Optional secondary bilingual subtitle (`麦片虾`).
* `session`: Timeframe tag (`"lunch" | "dinner" | "breakfast" | "all"`). The UI uses this to filter active offerings dynamically.
* `image`: Path to photo asset (e.g., `./images/dish-name.jpg`).

### Step 4: Reskin Theme via CSS Tokens (`styles.css`)
Update the 6 primary CSS custom properties in `:root` to match the new client's brand palette:
```css
:root {
  /* Brand Primary & Accent */
  --pl-emerald:        #123B2A;  /* Main brand hue */
  --pl-emerald-deep:   #0A2218;  /* Dark canvas background */
  --pl-gold:           #D49B2A;  /* Button & CTA gold */
  --pl-gold-bright:    #F0B849;  /* Accent hover / highlight */
  --pl-red:            #C2392A;  /* Chef's pick badge */

  /* Typography */
  --font-display:      'Cinzel', serif;
  --font-body:         'Plus Jakarta Sans', sans-serif;
}
```

### Step 5: Test & Preview via ARH Server Deploy Bootstrap
Launch the local and Tailscale preview:
```powershell
node D:/_ARH-AGENT-OS/_AGENT-CAPABILITIES/arh-server-bootstrap/bin/arh-server-deploy-bootstrap.mjs D:/_ARH-AGENT-OS/_AGENT-WORKSPACE/projects/<new-store-slug>-pwa
```

---

## 4. Key Subsystem Contracts

| Subsystem | Contract / Implementation File | Responsibility |
| :--- | :--- | :--- |
| **Live Session Clock** | `app.js` → `renderLiveStatus()` | Computes current day & time against `store.sessions` and alerts customer on active buffet session or Friday closure. |
| **Group Pax Calculator** | `app.js` → `setupCalculator()` | Dynamically multiplies `(Adults × Price) + (Children × Price)` based on selected session and formats WhatsApp booking payload. |
| **Search & Multi-lingual Filter** | `app.js` → `renderMenuGrid()` | Real-time token matching across Malay, English, and Chinese logograms. |
| **Lightbox Modal** | `app.js` → `openItemModal()` | Shows full-res dish photo, descriptions, and direct inquiry link. |
| **Day/Night Switcher** | `app.js` → `setupAmbienceToggle()` | Toggles `html[data-mode="dark"|"light"]` modifying CSS root properties without re-rendering the DOM. |

---

## 5. Deployment & Production Handover

* **Zero Build Step:** Pure Vanilla HTML5/CSS/ES Modules. No `npm install`, webpack, or vite required.
* **Static Host Ready:** Can be dropped directly into Cloudflare Workers (Workers Assets), Cloudflare Pages, Vercel, Netlify, or Apache/Nginx.
* **Wrangler Configuration (Optional for Cloudflare deploy):**
  ```toml
  name = "pak-liew-chinese-muslim"
  main = "worker.js"
  compatibility_date = "2026-08-25"
  [assets]
  directory = "."
  ```
