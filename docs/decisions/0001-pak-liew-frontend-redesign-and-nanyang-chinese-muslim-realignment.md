# 0001: Pak Liew Frontend Redesign & Nanyang Chinese-Muslim Cultural Realignment

**Status**: Accepted  
**Date**: 2026-08-25  
**Authors**: ARH Pair Programming Agent & Operator  
**Governing Standards**: `arh-frontend-design-v1.0.0` & `malaysian-localized-copy-register`

---

## 1. Context & Problem Statement

The Pak Liew Chinese Muslim Restaurant storefront was initially adapted from a generic Woodfire F&B scaffold. While functional, the previous implementation suffered from several architectural, aesthetic, and linguistic misalignments:

1. **Hype-Heavy Copy & Overclaiming:** Slogans like *"Buffet Paling Padu di KL"* and *"Menu Padu"* violated the ARH *Proof Before Persuasion* doctrine and triggered customer skepticism.
2. **Typography & Aesthetic Distance (`Class Without Distance`):** Using the Roman imperial serif font `Cinzel` and harsh metallic casino-gold gradients created an artificial, cold luxury distance that alienated everyday Malaysian families.
3. **Cultural Ambiguity:** The unique identity of the owner—a Malaysian Chinese Muslim bridging Nanyang culinary techniques (Wok Hei, Dim Sum, Pan Mee) with strict Halal integrity—was obscured by generic buffet tropes rather than celebrated with understated Nanyang Kopitiam warmth.
4. **Operational Ambiguity:** Lack of clear distinction between walk-in dining (individuals/families) versus group WhatsApp reservations (>10 pax), omission of the 1-hour dining window during peak rush, and lack of transit/prayer amenities proof.

---

## 2. Decision & Architectural Direction

We formally adopt a complete frontend renovation driven by the **ARH Frontend Design Doctrine** and the **Malaysian Localized Copy Register**:

### A. Cultural & Linguistic Realignment (Nanyang Chinese-Muslim)
- **Identity Formulation:** Standardize on **Malaysian Nanyang Chinese-Muslim Heritage** (Cantonese, Hokkien, Teochew, and Hakka dishes adapted to local Malaysian Halal tastebuds).
- **Dialect-Romanized Dish Pairs:** Use established Malaysian names (*Char Koay Teow*, *Chee Cheong Fun*, *Pan Mee*, *Kam Heong*, *Pau Kukus*) paired respectfully with Chinese characters (`Noto Serif SC`).
- **Linguistic Register:** Adhere to `hospitality_family` for web surfaces and `operational_whatsapp` for booking payloads. Strip unsubstantiated hype words (*padu, giler*).

### B. Visual Grammar & Design Tokens
- **Typography:** Replace `Cinzel` with Humanist **`Plus Jakarta Sans` (700/800)** for headings and **`Noto Serif SC`** for Chinese script.
- **Color Scheme:** 
  - Base: Deep Pine Jade (`#0D281E`) for night mode / Warm Rice Porcelain (`#FAF8F4`) for light mode.
  - Accent: Terracotta / Wok Flame Amber (`#D97706` / `#C2410C`) representing active *Wok Hei*.
  - Ink: Soft Cream (`#F7FAF8`) and Muted Sage (`#A3B8B0`), meeting WCAG 2.2 AA (>= 4.5:1 contrast).
- **Emblem:** Understated Chinese seal stamp (印章) carrying the **刘** (Liew) family mark.

### C. Digital Service Counter & Multi-Channel Ground Truth
- **Structured 2-Column Hero:** Clear value proposition, live operational indicator, and 1-click transit/maps CTAs on the left; authentic dish preview card with transparent pricing on the right.
- **Delivery Integration:** Callout highlighting Pak Liew's FoodPanda rating (**4.9 / 5.0 ⭐**) and a-la-carte sets.
- **Operational Invariants:** 
  - Clear walk-in policy for individuals/small groups.
  - WhatsApp group booking calculator for >10 pax.
  - Transparent Friday closure for Solat Jumaat and deep sanitization.
  - Transit proof (5-min walk to LRT/Monorail Titiwangsa) and surau/family amenities disclosure.

---

## 3. Consequences & Non-Regressions

- **Zero-Build Architecture:** Maintained 100% Vanilla HTML5, CSS3 Custom Properties, and ES Modules with zero bundler dependency.
- **Accessibility Guarantee:** Hardened >= 44x44px touch targets across all interactive steppers and category chips.
- **Multi-Agent Maintainability:** Hard copy of `malaysian-localized-copy-register` installed in `.agents/skills/` and `.claude/skills/`.