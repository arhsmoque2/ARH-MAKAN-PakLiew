# UI Design Specification & Token Standard

**Project:** Pak Liew Chinese Muslim Restaurant PWA  
**Tier:** Premium Storefront (Decoupled Fork)  
**Target Device Profile:** Mobile-First Responsive (PWA) with Tablet/Desktop adaptations  
**Design Philosophy:** Traditional Chinese-Muslim Heritage meets Modern High-End Gastronomy  

---

## 1. Design Token System

### 1.1 Color Tokens

The visual identity is anchored on the natural palette of Chinese-Muslim culinary culture: deep forest jade/emerald, imperial warm gold, and vibrant Nyonya red accents.

```css
:root {
  /* Chinese-Muslim Emerald Heritage (Backgrounds, Cards & Structural Surfaces) */
  --pl-emerald: #123B2A;          /* Canonical Brand Green */
  --pl-emerald-deep: #0A2218;     /* Background canvas (Dark mode) */
  --pl-emerald-surface: #102E21;  /* Modals & Elevated surfaces */
  --pl-emerald-card: #15392B;     /* Card background */

  /* Imperial Warm Gold / Saffron (Accents, CTAs, Highlights & Wordmarks) */
  --pl-gold: #D49B2A;             /* Primary Gold */
  --pl-gold-bright: #F0B849;      /* Hover & Focus Gold */
  --pl-gold-hover: #DFAC3D;       /* Interactive active states */
  --pl-gold-foil: #E5A93C;        /* Gradient midpoint */

  /* Culinary Accent (Chef Picks & Live Wok Badges) */
  --pl-red: #C2392A;              /* Chili / Nyonya Accent */
  --pl-green-live: #00E676;       /* Live open status pulse */

  /* Typography & Ink Tokens */
  --pl-ink: #FAF7F2;              /* Primary text (Warm porcelain white) */
  --pl-ink-muted: #B8C7C0;        /* Secondary supporting text */
  
  /* Borders & Transparencies */
  --pl-border: rgba(212, 155, 42, 0.22);       /* Subtle gold divider */
  --pl-border-light: rgba(255, 255, 255, 0.1);  /* Card container border */
  --pl-shadow: 0 12px 32px rgba(0, 0, 0, 0.45); /* Elevation depth */

  /* Geometry Tokens */
  --radius-sm: 6px;               /* Buttons & Badges */
  --radius-md: 12px;              /* Item cards & Inputs */
  --radius-lg: 20px;              /* Hero containers & Modals */
}

/* Light / Day Ambience Mode Override */
html[data-mode="light"] {
  --pl-emerald-deep: #F7F5F0;     /* Cream canvas */
  --pl-emerald-surface: #FFFFFF;  /* Crisp white surface */
  --pl-emerald-card: #FFFFFF;     /* White card container */
  --pl-ink: #14241C;              /* Deep dark green ink */
  --pl-ink-muted: #536B60;        /* Mid-tone slate ink */
  --pl-border: rgba(18, 59, 42, 0.15);
  --pl-border-light: rgba(18, 59, 42, 0.08);
  --pl-shadow: 0 8px 24px rgba(18, 59, 42, 0.08);
}
```

---

### 1.2 Typography Hierarchy

| Role | Font Family | Weight | Scale / Size | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Headline Display** | `Cinzel`, serif | 700, 800 | `clamp(2.4rem, 5vw, 4.2rem)` | `1.15` | Hero title, section headers, brand wordmark |
| **Body & UI Text** | `Plus Jakarta Sans`, sans-serif | 400, 500, 600, 700 | `0.85rem – 1.05rem` | `1.6` | Paragraphs, descriptions, stepper inputs, buttons |
| **Chinese Logograms** | `Noto Serif SC`, serif | 600, 700 | `0.76rem – 1.4rem` | `1.0` | Chinese menu subtitles (`炒粿条`, `麦片虾`, `点心`) |
| **Eyebrows & Badges** | `Plus Jakarta Sans` | 800 | `0.68rem – 0.76rem` | `1.0` | Uppercase section indicators, pricing chips |

---

### 1.3 Layout & Elevation Grid

* **Content Frame (`.frame`):** `width: min(1200px, calc(100% - 40px)); margin: 0 auto;`
* **Grid Breakpoints:**
  * Desktop ($>900	ext{px}$): 3-column session matrix, 2-column calculator layout, 4-column menu cards.
  * Tablet ($600	ext{px} - 900	ext{px}$): 2-column menu grid, stacked calculator.
  * Mobile ($<600	ext{px}$): 1-column cards, full-width steppers, horizontally scrollable category chip rail (`overflow-x: auto`).

---

## 2. Component UI Specifications

### 2.1 Header & Brand Wordmark
* **Structure:** Fixed sticky header with dynamic blur (`backdrop-filter: blur(16px)`).
* **Logo Badge:** Circular gradient medallion (`#D49B2A` to `#8E6010`) displaying the Chinese surname logogram `刘` (*Liew*) bordered with a hot pot emoji `🍲`.
* **Wordmark:** Primary serif `PAK LIEW` with gold gradient, paired with bilingual descriptor `CHINESE MUSLIM RESTAURANT • 柏刘清真餐厅`.
* **Actions:** Ambient Day/Night mode button (`data-ambience-toggle`) + direct Table Reservation button (`.button-gold-sm`).

### 2.2 Ambient Hero Section
* **Visual Layer:** Multi-layer ambient background cross-fader (`.hero-bg-img`) rotating between authentic photographic snapshots (Dinner live wok, Lunch spread, Weekend breakfast).
* **Overlay:** 3-stop vertical gradient scrim guaranteeing 100% WCAG 2.2 AA text contrast over background imagery.
* **Hero Content:** Dual badges (`BUFFET PALING PADU DI KL` & `ALL-YOU-CAN-EAT HALAL`), high-impact headline with gold gradient clipping, and triple action buttons (Menu jump, Google Maps, Waze).

### 2.3 Live Session Floating Card (`.live-status-card`)
* **Real-time Status Pill:** Glowing green pulse dot (`animation: pulse-glow 2s infinite`) paired with active session label (Breakfast / Lunch / Dinner / Closed Friday).
* **Session Price Badges:** Dual Adult and Child pricing chips synced to current or upcoming session.

### 2.4 Buffet Sessions Tier Matrix (`.sessions-grid`)
* **Cards:** 3 distinct cards representing **Breakfast**, **Lunch**, and **Dinner + Live Stalls**.
* **Highlight State:** Lunch card carries an elevated `.card-ribbon` with gold border framing.
* **Pricing Blocks:** Formatted price rows (`Dewasa: RM 19.90`, `Kanak-kanak: RM 15.90`) and checkmark bullet lists of signature dishes.

### 2.5 Menu Controls & Card Grid
* **Search Input:** Rounded pill search bar with instant client-side filtering.
* **Category Chip Rail:** Horizontally scrollable chip bar supporting active state highlighting.
* **Menu Cards:** Aspect-ratio locked media container with zoom on hover (`transform: scale(1.06)`), category badge, dual language name (Malay + Chinese), dish description, session tag, and `ALL YOU CAN EAT ✓` badge.

### 2.6 Group Booking & Pax Calculator Card
* **Interactive Steppers:** Plus/minus buttons for adults and children count.
* **Session Selector:** Live dropdown adjusting adult/child rate multiplication.
* **Calculation Display:** Dashed gold border total box showing estimated pricing.
* **WhatsApp Dispatch CTA:** Full-width green button with WhatsApp icon generating pre-filled reservation payloads.

### 2.7 Interactive Modal Lightbox
* **Overlay:** Glassmorphic dark backdrop (`backdrop-filter: blur(8px)`).
* **Modal Body:** Hero dish photography, session badge, bilingual title, descriptive copy, and direct WhatsApp inquiry trigger.
