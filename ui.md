# UI Design Specification & Token Standard

**Project:** Pak Liew Chinese Muslim Restaurant PWA  
**Tier:** Premium Storefront (Decoupled Fork)  
**Target Device Profile:** Mobile-First Responsive (PWA) with Tablet/Desktop adaptations  
**Design Philosophy:** Nanyang Chinese-Muslim Heritage, Told Subtly -- Indie, Pastel, Editorial  

---

## 0. Design Skill Compliance (`fnb-taste-palette-design`)

This document originally went straight to color tokens under a single
philosophy tag line, without the skill's `situation_scan` step -- the skill's
first rule is "do not start from colors." That's how the implementation
drifted into a candy-bright CTA row dressed up as "high-end gastronomy" (see
`CHANGELOG.md` / the palette-de-childify pass for that fix): the philosophy
was asserted, not derived from what Pak Liew actually is.

That first fix (below, struck through) was itself still leaning on visual
shorthand for "Chinese restaurant" -- a dark forest-green night canvas, a red
chop-stamp emblem, fire/wok CTA language -- borrowed from Woodfire's own
premium-lounge register rather than derived fresh. Superseded 2026-08-26:
same two anchor hues (sage jade + gold), moved to pastel and paper-light by
default, cliché iconography (the red seal, fire emoji, "berapi"/"wok hei"
language) replaced with subtler cues, motion slowed down and Ken-Burns'd
throughout. Recording each classification as it's revised, rather than
overwriting silently, so the next pass has the actual history to check
against instead of a single assertion.

```yaml
situation_scan:
  store_type: family_casual          # high-volume AYCE buffet, not fine dining
  customer_rhythm: order_set_or_package  # 3 fixed buffet sessions/day, not a la carte browsing
  menu_size: large                   # 23 items across 7 categories (data/menu.json)
  order_path: whatsapp                # group booking dispatch + walk-in; FoodPanda for delivery
  media_quality: strong_photos_and_videos  # real storefront/interior photos + a real dining-room clip (2026-08-26)
  customer_group: families            # walk-in families/groups, Chinese-Muslim heritage customers
  desired_vibe: "indie, pastel, Nordic-editorial -- origin shown subtly, not through cliché iconography"
  failure_risk: "pastel read as washed-out/low-energy if contrast or accent weight is undercooked"

resolved_design:
  customer_vibe: indie_nordic_pastel_editorial   # was: heritage_premium_editorial (struck 2026-08-26)
  palette_id: nanyang-pastel-sage       # was: nanyang-jade-ember -- same two anchor hues (sage jade + gold),
                                        # softened to pastel, paper-light by default; alarm-red seal -> dusty clay
  typography_id: fraunces-headline-dmsans-body  # was: cinzel-headline-jakarta-body -- Cinzel read as a
                                        # Roman/imperial "premium fine-dining" signifier borrowed from Woodfire's
                                        # own register; Fraunces is warmer/editorial and gives Pak Liew its own
                                        # identity. DM Sans replaces Plus Jakarta Sans for the same reason.
  layout_archetype: two-column-hero-with-status-card  # unchanged from the original build
  menu_density: large-grid-with-search-and-filters
  media_policy: hero_ambient_background_single_video_plus_card_kenburns  # hero rotator (real still + real
                                        # clip, both Ken Burns'd, clip playback slowed 0.55x -> 0.4x 2026-08-26
                                        # since 0.55x still read as a fast-forward handheld pan, plus the clip's
                                        # own CSS Ken Burns split onto a smaller-amplitude keyframe so it stops
                                        # compounding with the slowed footage) + the same ambient Ken Burns
                                        # ported onto every menu/lightbox/showcase photo (pattern: arh-fnb
                                        # Beelal Coffee's .item-media, index-v2.html)
  motion_level: gentle_and_slow        # was: gentle -- hold/crossfade/drift durations all lengthened 2026-08-26;
                                        # the first pass was calmer than the original but still paced quickly
  contrast_policy: wcag_aa_minimum
  validation_required: true
```

---

## 1. Design Token System

### 1.1 Color Tokens

Two anchor hues carried through every revision so far: a sage/jade green and
a warm gold, now softened to pastel on a warm paper canvas by default (light
is the default ambience as of 2026-08-26; dark is the secondary, toggled
state, retuned to a soft charcoal-sage rather than near-black). The token
names below are the actual `:root`/`html[data-mode="dark"]` names in
`styles.css` -- this section previously used a different naming scheme
(`--pl-emerald*`/`--pl-gold*`/`--pl-red`) that never matched the shipped CSS
(`--pl-pine*`/`--pl-amber*`/`--pl-seal`); reconciled here rather than left to
drift further.

```css
:root {
  /* Warm paper canvas & sage-tinted surfaces (default / light) */
  --pl-pine-deep: #FAF5EC;         /* Page canvas -- warm ivory, not stark white */
  --pl-pine: #F1E9DA;              /* Section-alt background */
  --pl-pine-surface: #FFFFFF;      /* Header / elevated surfaces */
  --pl-pine-card: #F6F0E4;         /* Card background */
  --pl-pine-border: rgba(62, 91, 76, 0.20);        /* Sage-tinted divider */
  --pl-pine-border-subtle: rgba(46, 42, 34, 0.08); /* Neutral subtle border */

  /* Pastel oat-gold accent -- one accent hue */
  --pl-amber: #C9A15C;             /* Fill (CTAs, chip backgrounds) */
  --pl-amber-bright: #7D5D28;      /* TEXT use -- AA-safe on the paper canvas (~5.5:1) */
  --pl-amber-hover: #B88A45;       /* Fill-only hover state (not used for text) */
  --pl-amber-glow: rgba(201, 161, 92, 0.20);

  /* Emblem fill (see §2.1's monogram) -- dusty clay, background/border only, never text */
  --pl-seal: #A8674C;
  --pl-seal-border: #8F5038;

  /* Typography inks */
  --pl-ink: #2E2A22;               /* Primary text -- warm near-black, not pure black */
  --pl-ink-muted: #6B6355;         /* Secondary text -- warm taupe */

  /* Geometry Tokens */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 24px;
}

/* Dark ambience (secondary, toggled) -- soft charcoal-sage, not near-black */
html[data-mode="dark"] {
  --pl-pine-deep: #232D28;
  --pl-pine: #2B3530;
  --pl-pine-surface: #333F38;
  --pl-pine-card: #3A473F;
  --pl-pine-border: rgba(243, 239, 230, 0.14);
  --pl-pine-border-subtle: rgba(255, 255, 255, 0.07);

  /* Must re-brighten here: --pl-amber-bright is a deep, paper-safe gold in
     light mode, which would go dark-on-dark once the canvas flips -- see
     §1.4's contrast note. */
  --pl-amber-bright: #F0B849;
  --pl-amber-hover: #DFAC3D;

  --pl-ink: #F3EFE6;
  --pl-ink-muted: #B8C2BB;
}
```

Elements that sit directly on the hero's photo/video backdrop (which does
**not** flip with ambience -- see §2.2) are pinned to fixed hex values
instead of these tokens, for the same reason the dark-mode override above
exists: see §1.4.

---

### 1.2 Typography Hierarchy

| Role | Font Family | Weight | Scale / Size | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Headline Display** | `Fraunces`, serif | 500, 600, 700 | `clamp(2.4rem, 5vw, 4.2rem)` | `1.15` | Hero title, section headers, brand wordmark |
| **Body & UI Text** | `DM Sans`, sans-serif | 400, 500, 600, 700, 800 | `0.85rem – 1.05rem` | `1.6` | Paragraphs, descriptions, stepper inputs, buttons |
| **Chinese Logograms** | `Noto Serif SC`, serif | 600, 700 | `0.76rem – 1.4rem` | `1.0` | Chinese menu subtitles (`炒粿条`, `麦片虾`, `点心`) |
| **Eyebrows & Badges** | `DM Sans` | 800 | `0.68rem – 0.76rem` | `1.0` | Uppercase section indicators, pricing chips |

Fraunces replaces Cinzel (2026-08-26): Cinzel's Roman/imperial letterforms
read as a generic "premium fine-dining" signifier, borrowed wholesale from
Woodfire Premium's own register rather than derived for Pak Liew. Fraunces
is a softer, warmer editorial serif -- the indie/Nordic register this pass
is going for -- and gives Pak Liew its own typographic identity instead of
a reskin of Woodfire's. DM Sans replaces Plus Jakarta Sans for the same
reason (and matches the arh-fnb Beelal Coffee storefront's body font).

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
  Caught live on 2026-08-26 (twice, across two passes the same day): the
  hero headline, subtitle, both hero badge pills (`CITA RASA...` and
  `100% Halal`), the amber accent line in the headline, and the Waze/
  FoodPanda hero buttons all went dark-on-dark in one ambience mode or the
  other once the hero background was pinned to the non-flipping video
  canvas -- fixed by pinning those specific elements to fixed hex values
  instead of the ambience-flipping tokens (`styles.css`: `.hero-title`,
  `.hero-subtitle`, `.pill-amber`, `.pill-green`, `.amber-gradient`,
  `.hero-cta-group .button-waze`, `.hero-cta-group .button-foodpanda`).
  The second pass's palette redesign made `--pl-amber-bright` a *deep*,
  paper-safe gold in light mode specifically for AA text-on-cream
  elsewhere on the page -- exactly the value that goes low-contrast on the
  hero's dark canvas, so this class of bug will keep recurring for any new
  gold-accented hero element unless it's pinned the same way. `.live-status-card`
  and `.price-chip` are unaffected: self-contained opaque surfaces where
  background and text flip together correctly. `.hero-showcase-card` is no
  longer in that safe category as of the 2026-08-26 card-glass pass below --
  it moved from an opaque, flipping `var(--pl-pine-card)` panel to frosted
  glass (translucent fill + `backdrop-filter: blur`) over the same
  non-flipping photo/video canvas as the hero text, so `.showcase-title`,
  `.showcase-desc`, `.showcase-price`, and `.showcase-features` are now
  pinned to fixed light-on-dark values the same way `.hero-title` is. Any
  future glass treatment applied to a card sitting on the hero canvas needs
  the same pin, not the flipping ink tokens.
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
* **Logo Badge (`.seal-stamp`, restyled 2026-08-26):** a soft circular monogram in the clay accent, showing the Chinese surname logogram `刘` (*Liew*). Was a hard-cornered red chop-stamp box with a glowing red shadow -- the "official Chinese seal" visual cliché; a plain circular mark in the restrained clay tone reads as a boutique badge instead, closer to how a Western indie cafe would present a founder's initial than to government-document iconography. No emoji border -- an earlier draft of this doc described a hot-pot-emoji border that was never actually built, and would itself be another decorative food-emoji cliché if added now.
* **Wordmark:** `PAK LIEW` in the Fraunces headline serif (§1.2), paired with bilingual descriptor `CHINESE MUSLIM RESTAURANT • 柏刘清真餐厅`.
* **Actions:** Ambient Day/Night mode button (`data-ambience-toggle`; light/"Cerah" is the default as of 2026-08-26, `#icon-sun`/`#icon-moon` from the icon sprite rather than an emoji) + direct Table Reservation button (`.button-primary.button-sm`).

### 2.2 Ambient Hero Section
* **Visual Layer (`.hero-rotator`/`.hero-layer`, shipped 2026-08-26, paced
  slower 2026-08-26):** crossfades a real still of the storefront signage
  with a real clip of the dining room and buffet counter -- same rotator
  mechanism as Woodfire Premium's hero (`arh-fnb-tier-showroom/premium`): a
  video's own `ended` event drives the advance, and `prefers-reduced-motion`
  stops the rotator from starting at all (§1.4). Both layers now carry the
  Ken Burns drift (previously only the still did) at slow, staggered
  durations (26s / 34s), the still holds 9s (was 6s -- read as pacy), the
  crossfade itself is slower (2.6s, was 1.6s), and the clip's own playback
  is slowed to 0.55x in `app.js` -- the handheld pan itself was the "too
  fast" complaint, not just the rotator's pacing. `aria-hidden` + empty
  `alt`: decorative only, the hero text below carries the real content.
  Media policy: this is the one sanctioned ambient background loop for the
  whole page -- menu/item cards get the same Ken Burns treatment (§2.5) but
  never autoplaying video, which stays grid-autoplay forbidden per the
  skill's floor.
* **Overlay:** a flat, fairly dark scrim (not a directional one -- this
  hero's content isn't bottom-anchored the way Woodfire's is) that
  deliberately does not flip with the light/dark ambience toggle, same as
  Woodfire's: a photo/video backdrop doesn't have a "light mode." Retinted
  2026-08-26 from a cold near-black-green to a warmer charcoal, matching
  the new dark-ambience tokens (§1.1). See §1.4 for what the non-flipping
  canvas means for the text sitting on top of it.
* **Hero Content:** Dual badges (`CITA RASA CINA MUSLIM NANYANG` & `100% HALAL & BERSIH`), serif headline (Fraunces, §1.2) with a gold second line, and a gold primary CTA (view buffet sessions) alongside quiet outlined secondary actions (Waze, FoodPanda) -- one accent colour carrying the row instead of each action in its own brand colour. Copy softened 2026-08-26: "Sajian Kuali Panas Berapi" ("Fire-Hot Wok Dish") and the "(Wok Hei)" fire-mythology framing replaced with "Bufet Segar, Setiap Sesi" / "Warisan Nanyang Cina Muslim" -- the live-cooking value proposition ("cooked fresh in front of you") is kept, the fire/wok imagery specifically is not; same change applied to the showcase card, session cards, category filter chip, and `data/menu.json`'s live-stalls category and Char Koay Teow item.

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
* **Menu Cards:** Aspect-ratio locked media container, category badge, dual language name (Malay + Chinese), dish description, session tag, and a `TANPA HAD` badge (`#icon-check` from the icon sprite, not the `✓` glyph inline with it). Photo motion (2026-08-26, ported from the arh-fnb Beelal Coffee storefront's `.item-media` pattern, `index-v2.html`): every dish photo carries a continuous ambient Ken Burns drift (`pl-card-kenburns`, 16s), not just a hover effect, so the grid reads as quietly alive rather than static tiles; hovering the card adds a `scale(1.06)` lift on top of that (on `.card-media`, the wrapper -- not the animated `img` itself, since animating and hover-transitioning the same property on one element fights), plus (added in the same 2026-08-26 card-glass pass as the rest of this section) a soft dark gradient that fades in over the photo on hover so the card visibly "answers back" rather than just zooming. Card corner radius bumped `--radius-md` (14px) -> `--radius-lg` (24px) in the same pass, along with `.session-card`/`.location-card`/`.location-map-wrap`, for the rounder, softer silhouette the redesign was going for. Same media pattern applied to the hero showcase card's photo (now also frosted glass, see §1.4 above) and the item-detail lightbox's photo (§2.7). `prefers-reduced-motion` stops all of it (§1.4's global rule, not scoped per-component).
* **Icon system (added 2026-08-26):** a single inline `<svg>` sprite of `<symbol>` defs at the top of `index.html`'s `<body>` (`#icon-check`, `#icon-clock`, `#icon-pin`, `#icon-phone`, `#icon-chat`, `#icon-nav`, `#icon-map`, `#icon-search`, `#icon-sun`, `#icon-moon`, `#icon-sunrise`, `#icon-star`, `#icon-calc`), referenced everywhere via `<svg class="icon"><use href="#icon-..."></use></svg>`. Replaces the emoji that were previously scattered through the hero badges/CTAs, session-card icons, category chips, the price calculator, the WhatsApp button, and the location card -- emoji read as a WhatsApp-chat/toy register rather than a restaurant brand, and (being raster-colour glyphs) don't take the surrounding text colour the way `.icon`'s `stroke: currentColor` does. `.session-icon` (breakfast/lunch/dinner) went from a bare emoji glyph at `font-size: 1.8rem` to a proper icon badge: a 44px circle tinted `var(--pl-amber-glow)` with the sprite icon centred inside at 22px. Session-highlight bullets (`✓ ...`) and the visual/quality-guarantee badges became `<svg class="icon">` + text the same way. Category chips and calculator `<option>`s dropped their emoji outright rather than getting an icon -- not every label needs one, and a chip rail of plain text reads calmer than one of mismatched food emoji.

### 2.6 Group Booking & Pax Calculator Card
* **Interactive Steppers:** Plus/minus buttons for adults and children count.
* **Session Selector:** Live dropdown adjusting adult/child rate multiplication.
* **Calculation Display:** Dashed gold border total box showing estimated pricing.
* **WhatsApp Dispatch CTA:** Full-width green button with WhatsApp icon generating pre-filled reservation payloads.

### 2.7 Interactive Modal Lightbox
* **Overlay:** Glassmorphic dark backdrop (`backdrop-filter: blur(8px)`).
* **Modal Body:** Hero dish photography, session badge, bilingual title, descriptive copy, and direct WhatsApp inquiry trigger.
