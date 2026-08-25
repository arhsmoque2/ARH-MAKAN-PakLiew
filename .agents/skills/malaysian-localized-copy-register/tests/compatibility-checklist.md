# Compatibility Checklist

A copy passes only if it is register-compatible, object-compatible, surface-compatible, audience-compatible, truthful to venue scale, and locally natural.

## Register check

Choose one primary register:

```text
hospitality_refined
hospitality_family
weekday_event_venue
corporate_refined
institutional_light
sme_business_friendly
social_caption
operational_whatsapp
```

Fail if social slang appears in corporate/institutional copy, holiday language appears in corporate weekday copy, or government-style phrasing appears in family hero copy.

## Object compatibility

```yaml
private_check:
  pool: kolam renang persendirian
  courtyard: laman tertutup
  room: bilik persendirian
  event: majlis tertutup
  discussion: perbincangan tertutup
  data: maklumat peribadi
  belongings: barangan peribadi
exclusive_check:
  valid: [ruang eksklusif, penginapan eksklusif, akses eksklusif, pakej eksklusif, majlis eksklusif]
  invalid: [kolam eksklusif, dapur eksklusif, tandas eksklusif]
space_check:
  family_gathering: ruang berkumpul keluarga
  dining: ruang makan bersama
  seminar: ruang seminar kecil
  workshop: ruang bengkel
  discussion: ruang perbincangan tertutup
  event: ruang majlis tertutup
  courtyard: laman tertutup
  compound: pekarangan rumah
  photo: sudut bergambar / laman bergambar
```

## Scale check

Reject unsupported claims: conference centre, convention hall, grand ballroom, five-star venue, luxury event hall, dewan persidangan.

Use: ruang seminar kecil, ruang majlis tertutup, ruang acara berskala kecil, ruang perbincangan tertutup, private weekday venue.

## Final pass

```yaml
final_pass:
  register_selected: true
  phrase_composed_by_object: true
  wrong_register_removed: true
  unsupported_grandeur_removed: true
  generic_luxury_replaced_with_proof: true
  social_slang_gated: true
  retained_english_is_intentional: true
  copy_has_clear_user_benefit: true
  copy_has_booking_or_action_path_if_needed: true
```
