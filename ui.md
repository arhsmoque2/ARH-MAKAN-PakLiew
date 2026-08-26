# UI Design Specification & Token Standard

**Project:** Pak Liew Chinese Muslim Restaurant PWA  
**Tier:** Premium Storefront (Decoupled Fork)  
**Target Device Profile:** Mobile-First Responsive (PWA) with Tablet/Desktop adaptations  
**Design Philosophy:** Traditional Chinese-Muslim Heritage meets Modern High-End Gastronomy  

---

## 0. Design Skill Compliance (`fnb-taste-palette-design`)

This document originally went straight to color tokens under a single
philosophy tag line, without the skill's `situation_scan` step -- the skill's
first rule is "do not start from colors." That's how the implementation
drifted into a candy-bright CTA row dressed up as "high-end gastronomy" (see
`CHANGELOG.md` / PR #2 for the fix): the philosophy was asserted, not
derived from what Pak Liew actually is. Recording the classification here so
future changes have it to check against, instead of re-asserting a vibe.

```yaml
situation_scan:
  store_type: family_casual          # high-volume AYCE buffet, not fine dining
  customer_rhythm: order_set_or_package  # 3 fixed buffet sessions/day, not a la carte browsing
  menu_size: large                   # 23 items across 7 categories (data/menu.json)
  order_path: whatsapp                # group booking dispatch + walk-in; FoodPanda for delivery
  media_quality: strong_photos_and_videos  # real storefront/interior photos + a real dining-room clip (2026-08-26)
  customer_group: families            # walk-in families/groups, Chinese-Muslim heritage customers
  desired_vibe: "calmer heritage-premium -- restrained, not neon/candy"
  failure_risk: "restraint read as generic SaaS instead of premium if overcorrected"

resolved_design:
  customer_vibe: heritage_premium_editorial
  palette_id: nanyang-jade-ember       # own jade/gold/seal family, muted -- not Woodfire's palette copied
  typography_id: cinzel-headline-jakarta-body  # Cinzel serif for h1/h2/h3 + wordmark, Plus Jakarta Sans for body/UI
  layout_archetype: two-column-hero-with-status-card  # unchanged from the original build
  menu_density: large-grid-with-search-and-filters
  media_policy: hero_ambient_background_single_video  # one background rotator: real still + real clip, not per-card autoplay
  motion_level: gentle                # Ken Burns drift on the still, crossfade between layers, no fast/attention-grabbing motion
  contrast_policy: wcag_aa_minimum
  validation_required: true
```

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
  --pl-green-live: #10B981;       /* Live open status pulse -- a small (12px) functional
                                      status dot, not a second accent colour; deliberately
                                      a notch calmer than a pure neon green (was #00E676
                                      in an earlier draft of this doc) to match the classy
                                      rule's "controlled accents" -- see §1.4. */

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

### 1.4 Accessibility & Motion Floor (non-negotiable)

Not previously written down; adding it now rather than leaving it implicit,
so a future change can check against it instead of re-deriving it (or
missing it, the way it got missed the first time -- see below).

* **Contrast:** body text and CTA text must clear WCAG AA against whatever
  they actually render on. This isn't automatic just because a token is
  named `--pl-ink*`: `--pl-ink`/`--pl-ink-muted` flip between light and
  dark ambience mode, so anything sitting on a surface that does **not**
  flip with them (the hero's photo/video backdrop, see §2.2) needs a
  pinned colour instead, or the pairing breaks in one of the two modes.
  Caught live on 2026-08-26: the hero headline, subtitle, the "100% Halal"
  pill and the Waze/FoodPanda hero buttons all went dark-on-dark in light
  ambience mode once the hero background stopped flipping -- fixed by
  pinning those specific elements to their dark-mode colour (`styles.css`,
  `.hero-title`/`.hero-subtitle`/`.pill-green`/`.hero-cta-group .button-waze`/
  `.hero-cta-group .button-foodpanda`). Card-based content (`.hero-showcase-card`,
  `.live-status-card`, `.price-chip`) is unaffected: those are self-contained
  opaque surfaces where background and text flip together correctly.
* **Focus visibility:** any `outline: none` must ship with a replacement
  `:focus-visible` state. Caught live on the same pass: `.qty-stepper input`
  (the pax count in the group-booking calculator -- a real order-path
  control) had `outline: none` with nothing standing in for it; fixed with
  a `:focus-visible` outline. `.search-box input` already did this correctly
  and was the template for the fix.
* **Reduced motion:** `@media (prefers-reduced-motion: reduce)` must exist
  and must stop the hero rotator's Ken Burns drift and crossfade (both the
  CSS animation and the JS timer that starts it). Not present before
  2026-08-26; added alongside the hero rotator itself (`styles.css`, end of
  file; `app.js`'s `initHeroRotator()` checks the media query before
  starting anything).

---

## 2. Component UI Specifications

### 2.1 Header & Brand Wordmark
* **Structure:** Fixed sticky header with dynamic blur (`backdrop-filter: blur(16px)`).
* **Logo Badge:** Circular gradient medallion (`#D49B2A` to `#8E6010`) displaying the Chinese surname logogram `刘` (*Liew*) bordered with a hot pot emoji `🍲`.
* **Wordmark:** Primary serif `PAK LIEW` with gold gradient, paired with bilingual descriptor `CHINESE MUSLIM RESTAURANT • 柏刘清真餐厅`.
* **Actions:** Ambient Day/Night mode button (`data-ambience-toggle`) + direct Table Reservation button (`.button-gold-sm`).

### 2.2 Ambient Hero Section
* **Visual Layer (shipped 2026-08-26, `.hero-rotator`/`.hero-layer`):** crossfades
  a real still of the storefront signage (Ken Burns drift, `data-hero-still`)
  with a real clip of the dining room and buffet counter -- same rotator
  mechanism as Woodfire Premium's hero (`arh-fnb-tier-showroom/premium`):
  a video's own `ended` event drives the advance, a still holds 6s, and
  `prefers-reduced-motion` stops the rotator from starting at all (§1.4).
  `aria-hidden` + empty `alt`: decorative only, the hero text below carries
  the real content. Media policy: this is the one sanctioned ambient
  background loop for the whole page -- menu/item cards stay grid-autoplay
  forbidden per the skill's floor.
* **Overlay:** a flat, fairly dark scrim (not a directional one -- this
  hero's content isn't bottom-anchored the way Woodfire's is) that
  deliberately does not flip with the light/dark ambience toggle, same as
  Woodfire's: a photo/video backdrop doesn't have a "light mode." See §1.4
  for what that means for the text sitting on top of it.
* **Hero Content:** Dual badges (`CITA RASA CINA MUSLIM NANYANG` & `100% HALAL & BERSIH`), serif headline (Cinzel, §1.2) with a gold second line, and a gold primary CTA (view buffet sessions) alongside quiet outlined secondary actions (Waze, FoodPanda) -- one accent colour carrying the row instead of each action in its own brand colour.

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
