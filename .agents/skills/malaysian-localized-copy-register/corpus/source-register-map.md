# Source Register Map

Version: v0.1

Role: Evidence map for register design, greenfield expansion, and source-backed validation.

## Source hierarchy

```yaml
source_hierarchy:
  official_institutional:
    authority: high
    use_for: [agency tone, GLC tone, corporate BM structure, event naming, official announcement grammar]
    examples: [JKR, LLM, KWSP, PETRONAS, SME Corp, MDEC]
  official_tourism_hospitality:
    authority: high
    use_for: [hospitality warmth, domestic tourism language, campaign invitation, cultural destination copy]
  market_platform:
    authority: medium
    use_for: [practical booking terms, SEO-friendly phrasing, user-facing travel commerce, retained English terms]
  social_market:
    authority: low_for_formal_copy
    use_for: [captions, WhatsApp blasts, casual local hooks, slang detection]
```

## Institutional / agency grammar

```text
Majlis + ceremonial event
Sesi + briefing / dialogue / discussion / engagement
Program + initiative / recurring structured activity
Bengkel + hands-on or improvement session
Seminar + knowledge/professional session
Taklimat + briefing or explanation
Perhimpunan + internal gathering
Amanat + leadership address
```

Examples to model:

```text
Majlis Pelancaran Program
Majlis Perasmian Penutupan Program
Majlis Apresiasi Program
Majlis Menandatangani Memorandum Persefahaman (MoU)
Sesi Taklimat
Sesi Taklimat Tender
Sesi Dialog
Bengkel Kolaborasi Strategik
Bengkel Penambahbaikan
Program CSR
Program Gotong-Royong
Program Kesedaran
```

## LLM / highway-authority style

Useful patterns: `sesi taklimat`, `majlis perhimpunan`, `amanat tahun baharu`, `sesi dialog`, `majlis menandatangani MoU`, `memorandum persefahaman`, `hala tuju`, `pandangan dan nasihat`.

Safe adapted copy:

```text
Sesi taklimat ini bertujuan memberi penerangan kepada peserta serta membuka ruang perbincangan berhubung pelaksanaan program.
```

## JKR / public works style

Useful patterns: `Majlis Pelancaran Program`, `Program CSR`, `Bengkel Kolaborasi Strategik`, `Bengkel Penambahbaikan Tatacara`, `Bengkel Pengurusan Risiko`, `Sesi Taklimat Tender`, `Lawatan Tapak`, `Kursus`, `Majlis Perasmian Penutup`, `Program Gotong-Royong`, `Program Kesedaran`.

Safe adapted copy:

```text
Ruang yang sesuai untuk bengkel, sesi taklimat, kursus dalaman dan perbincangan teknikal berskala kecil.
```

## KWSP recognition register

Useful patterns: `Majlis Makan Malam Tahunan Anugerah`, `mengiktiraf prestasi cemerlang`, `pencapaian`, `kecekapan`, `daya tahan`, `nilai jangka panjang`, `ekosistem pelaburan`.

Safe adapted copy:

```text
Majlis penghargaan ini sesuai untuk meraikan pencapaian warga kerja, pelanggan atau rakan niaga dalam suasana yang lebih tertutup dan selesa.
```

## PETRONAS corporate hybrid register

Useful patterns: `Majlis Berbuka Puasa`, `Pratonton Eksklusif`, `Filem Web`, `Bersama Media`, `memperkukuh hubungan`, `program komuniti`, `pembangunan keusahawanan`.

Safe adapted copy:

```text
Ruang sesuai untuk majlis berbuka puasa korporat, pratonton kecil, sesi bersama media, jamuan penghargaan dan program komuniti berskala kecil.
```

## SME Corp / MDEC business ecosystem register

Useful patterns: `PMKS`, `PKS`, `usahawan`, `akses pasaran`, `pemadanan perniagaan`, `jaringan perniagaan`, `platform MatchMe`, `khidmat nasihat perniagaan`, `latihan keusahawanan`, `pembiayaan`, `pembangunan kapasiti`, `pendigitalan`, `penyelesaian digital`, `rakan strategik`, `kolaborasi`, `ekosistem`, `inisiatif`, `transformasi digital`.

Safe adapted copy:

```text
Ruang sesuai untuk sesi networking, pemadanan perniagaan, latihan keusahawanan dan bengkel pendigitalan PMKS.
```

## Retained-English decision map

Retain English when a term is an acronym, branded, a familiar business-event format, stiff when translated, searched in English, or common in Malaysian corporate ecosystem.

Usually retain: SME, PMKS, PKS, GLC, MoU, CSR, ESG, KPI, SOP, CPD, vendor, client, platform, digital, networking, business matching, luncheon, offsite, retreat, team building, webinar, roadshow, townhall.

Usually localize or pair: briefing -> sesi taklimat / sesi penerangan; workshop -> bengkel; launch -> majlis pelancaran; appreciation -> majlis penghargaan / majlis apresiasi; stakeholders -> pihak berkepentingan; business network -> jaringan perniagaan; business matching -> pemadanan perniagaan.
