# External Findings & Intelligence: Pak Liew Chinese Muslim Restaurant

**Document Version:** 1.0.0  
**Timestamp:** 2026-08-25T18:36:00+08:00  
**Project:** pak-liew-chinese-muslim-pwa  
**Sources:** Google Maps (https://maps.app.goo.gl/opNSdeX3zQ9toviQ6), FoodPanda Malaysia, Instagram (@pak_liew_cm_restaurant), and TikTok (@ezlokal.food / @pakliewbuffet).

---

## 1. Executive Summary & Verified Ground Truth

Pak Liew Chinese Muslim Restaurant (柏刘清真餐厅) is a high-volume, highly popular Chinese-Muslim dining destination located in Titiwangsa Sentral, Kuala Lumpur. Known for its affordable buffet pricing structure, live cooking stations, and authentic halal Chinese recipes, the restaurant commands strong social proof across platforms (4.9/5 rating on FoodPanda, viral TikTok coverage by local food portals).

`
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           STORE IDENTITY MATRIX                                 │
├──────────────────────┬──────────────────────────────────────────────────────────┤
│ Restaurant Name      │ Pak Liew Chinese Muslim Restaurant (柏刘清真餐厅)        │
│ Exact Address        │ 60, Jalan Lumut, Titiwangsa Sentral, 50400 Kuala Lumpur  │
│ Google Maps Link     │ https://maps.app.goo.gl/opNSdeX3zQ9toviQ6                │
│ Public Transit       │ 5-min walk from LRT / Monorail / MRT Titiwangsa          │
│ Landmark             │ Sebaris Hokkaido Seafood KL (Grand Seasons vicinity)    │
│ Weekly Closure       │ Closed every Friday (Cuti Setiap Jumaat)                 │
│ Contact / WhatsApp   │ +6016-2493449                                            │
└──────────────────────┴──────────────────────────────────────────────────────────┘
`

---

## 2. Google Maps Store Profile & Customer Feedback

* **Google Maps Reference:** https://maps.app.goo.gl/opNSdeX3zQ9toviQ6
* **Waze Pin:** PAK LIEW CHINESE MUSLIM TITIWANGSA

### Key Verified Invariants:
1. **Operating Schedule & Weekly Rhythm:**
   * **Breakfast Buffet:** 6:00 AM – 11:00 AM (Weekend specialty, RM 15.90 Adult / RM 12.90 Child).
   * **Lunch Buffet:** 12:00 PM – 4:00 PM (Daily except Friday, RM 19.90 Adult / RM 15.90 Child).
   * **Dinner Buffet & Live Wok:** 5:00 PM – 10:00 PM (Daily except Friday, RM 19.90 Adult / RM 15.90 Child).
   * **Friday Rule:** Strictly closed for Friday prayers and weekly deep sanitization/prep.
2. **Customer Policies & Rules of Entry:**
   * **Walk-In Direct:** Individuals, couples, and small families do not need advance booking.
   * **Group Reservations:** WhatsApp booking is required for tables >10 pax.
   * **Dining Time Limit:** 1 hour per session during peak hours to ensure smooth table turnover.
3. **Sentiment & Feedback Summary:**
   * **High Value-for-Money:** Overwhelming positive reception of the RM19.90 lunch rate for unlimited chicken/beef/fish mains.
   * **Crowd Notice:** Lunch hours (12:30 PM – 2:00 PM) experience peak office crowd; early arrivals (12:00 PM) get optimal dish freshness.

---

## 3. FoodPanda Malaysia Profile & A-la-carte Architecture

* **Listing Title:** *Pak Liew Chinese Muslim - Laman Baginda*
* **Platform Rating:** ⭐️ **4.9 / 5.0** (92+ customer reviews)
* **Delivery Role:** Caters to individual lunch orders with single-portion rice bowls and noodle comfort dishes.

### Menu Catalog Snapshot:
* **Set Nasi (Rice Bowls with Fried Egg):**
  * Salted Egg Chicken Rice
  * Buttermilk Chicken Rice
  * Kam Heong Chicken Rice
  * Nestum Chicken Rice
  * Black Pepper Beef Rice
* **Noodle Specialties:**
  * Spicy Beef Noodle Soup
  * Dry Chili Pan Mee (*Mee Halus*)
  * Chili Pan Mee Soup
  * Wantan Mee Kering
* **Side Orders & Dim Sum:**
  * Fried Wantan (5 pcs)
  * Steamed Dim Sum (3 pcs mixed)
  * Chee Cheong Fun
  * Karipap Pusing Rangup Inti Ayam

---

## 4. Social Media Intelligence: Video & Caption Patterns

### Channels Analyzed:
* **Instagram:** @pak_liew_cm_restaurant
* **TikTok Influencer Feature:** @ezlokal.food (ideo/7650156137018445077)
* **TikTok Official:** @pakliewbuffet

### Storytelling & Video Upload Rhythm:
Food review reels follow a tightly choreographed 5-step video loop:
1. **Price-Anchor Hook (<3s):** *'Buffet Chinese Muslim serendah RM15.90 kat KL!'* (Immediate value hook).
2. **Buffet Bain-Marie Scan:** Wide panning shot across 40+ steaming stainless steel trays.
3. **Appetite Drivers (B-Roll):**
   * Sizzling *Ayam Gepuk* with fiery sambal.
   * Golden *Ikan Nestum* & *Daging Masak Hitam*.
   * Steaming bamboo dim sum towers.
4. **Action & Interactivity:** Live wok hei tossing of Char Koay Teow, self-serve ice cream churns, drink dispensers.
5. **Operational Overlay:** Transparent graphical breakdown of operating hours, RM pricing, Friday closure, and Google Maps pin.

---

## 5. Architectural Implications for Pak Liew PWA

Applying the **ARH Frontend Design Doctrine** (rh-frontend-design-v1.0.0) and **Malaysian Localized Copy Register**:

1. **Proof-Led Hero:** Showcase actual photography of the live wok stations and buffet lines rather than generic stock imagery.
2. **Transparent Operational State:** Display real-time session status (Breakfast, Lunch, Dinner, or Closed on Fridays) with explicit timeframes.
3. **Bilingual Clarity:** Pair authentic Malay descriptions with clear Chinese dish subtitles (e.g., 炒粿条, 沙爹鸡肉串) to preserve Chinese-Muslim culinary heritage.
4. **Zero-Friction WhatsApp Payload:** Include date, session choice, pax breakdown (Adults/Children), and estimated RM total for group bookings.
