# SKILL - Malaysian Localized Copy Register

Version: v0.1

Use when producing, repairing, evaluating, or expanding Malaysian-localized copy for hospitality, weekday events, SME/GLC/corporate-facing events, social captions, WhatsApp booking, and institutional-light announcements.

## Activation

Use this skill for:

```text
Malaysian localized copy
Malay-English hospitality copy
homestay / private pool / family gathering copy
weekday event venue positioning
SME event copy
GLC / agency-style event wording
corporate luncheon / seminar / workshop / meeting copy
social captions using Malaysian local slang
loanword or retained-English decisions
brownfield copy repair
```

## Core rule

Do not translate isolated words.

Translate:

```text
intent + object + register + surface + audience
```

A phrase is acceptable only if it is grammatical, locally natural, register-compatible, object-compatible, surface-compatible, and truthful to venue scale.

Examples:

```text
private + pool       -> kolam renang persendirian
private + courtyard  -> laman tertutup
private + event      -> majlis tertutup
private + data       -> maklumat peribadi
exclusive + space    -> ruang eksklusif
exclusive + package  -> pakej eksklusif
exclusive + access   -> akses eksklusif
```

Avoid loose dictionary behavior:

```text
private = peribadi
exclusive = eksklusif
space = ruang
```

This causes awkward copy such as `laman peribadi`, `kolam eksklusif`, `ruang private`.

## Fast route

```text
Family / stay / pool / weekend -> hospitality_family or hospitality_refined
Weekday / seminar / luncheon / book club / association / small event -> weekday_event_venue
SME / vendor / client / staff / corporate / GLC / agency -> corporate_refined or sme_business_friendly
Taklimat / perasmian / pelancaran / MoU / CSR / anugerah -> institutional_light
Instagram / TikTok / WhatsApp blast / promo -> social_caption or operational_whatsapp
```

When unsure, use `weekday_event_venue`.

Safe line:

```text
Ruang tertutup untuk mesyuarat kecil, seminar, luncheon dan majlis berskala kecil dalam suasana yang lebih privasi dan selesa.
```

## Runtime load

Load first:

```text
runtime-handbook/agent-runtime-handbook.md
runtime-handbook/register-routing-quickmap.md
runtime-handbook/phrase-repair-cheatsheet.md
runtime-handbook/pressure-debug-cards.md
```

## Corpus loading

```yaml
corpus_loading:
  leisure_or_family:
    - corpus/hospitality-register-corpus.yml
    - corpus/loanword-collocation-corpus.yml
  weekday_events:
    - corpus/weekday-event-register-corpus.yml
    - corpus/corporate-event-register-corpus.yml
  sme_glc_agency:
    - corpus/corporate-event-register-corpus.yml
    - corpus/source-register-map.md
  social_caption:
    - corpus/social-caption-register-corpus.yml
    - corpus/forbidden-and-gated-phrases.yml
  phrase_debug:
    - corpus/loanword-collocation-corpus.yml
    - corpus/forbidden-and-gated-phrases.yml
```

Consult corpus when a new domain appears, official/GLC tone matters, phrase compatibility is uncertain, many examples are requested, copy must be source-backed, loanword decisions matter, or leisure/corporate intent is mixed.

## Brownfield repair discipline

```text
Preserve useful intent.
Repair phrase compatibility.
Remove wrong register.
Replace generic claims with proof.
Do not overclaim venue scale.
```

## Hard gates

```text
laman peribadi        -> laman tertutup
kolam eksklusif       -> kolam renang persendirian
ruang private         -> ruang tertutup / ruang eksklusif
perkarangan rumah     -> pekarangan rumah
tandas eksklusif      -> bilik air bersih / selesa
dapur eksklusif       -> dapur lengkap
parking premium       -> parking mudah / ruang parking luas
healing korporat      -> retreat korporat / sesi offsite
port meeting          -> ruang mesyuarat kecil
business lepak        -> sesi networking / jaringan perniagaan
staycation korporat   -> retreat korporat / tempahan hari bekerja
```

Do not claim unless true: `conference centre`, `grand ballroom`, `convention hall`, `dewan persidangan`, `five-star venue`, `luxury event hall`.

Safer replacements: `ruang seminar kecil`, `ruang majlis tertutup`, `ruang acara berskala kecil`, `ruang perbincangan tertutup`, `private weekday venue`.
