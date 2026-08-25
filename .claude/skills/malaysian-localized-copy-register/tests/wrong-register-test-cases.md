# Wrong Register Test Cases

For each case, identify intended register, wrong-register terms, and repair copy.

## Test 1

Input: `Port meeting untuk SME healing weekday dengan boss dan client.`

Acceptable repair:
```text
Ruang tertutup untuk mesyuarat SME, sesi perbincangan bersama pelanggan dan luncheon korporat pada hari bekerja.
```

## Test 2

Input: `Laman peribadi dengan kolam eksklusif untuk private event.`

Acceptable repair:
```text
Laman tertutup dengan kolam renang persendirian, sesuai untuk majlis tertutup dan perjumpaan keluarga berskala kecil.
```

## Test 3

Input: `Cuti-cuti weekday untuk company staycation dan vendor briefing.`

Acceptable repair:
```text
Ruang tempahan hari bekerja untuk vendor briefing, sesi taklimat, retreat korporat dan jamuan pasukan kecil.
```

## Test 4

Input: `Majlis perhimpunan keluarga dengan amanat hujung minggu dan penyampaian aspirasi.`

Acceptable repair:
```text
Ruang berkumpul keluarga untuk hujung minggu yang lebih santai, tertutup dan selesa.
```

## Test 5

Input: `Grand conference centre for corporate workshops, seminars and award dinners.`

Acceptable repair:
```text
Ruang seminar kecil dan ruang majlis tertutup untuk bengkel, sesi taklimat, luncheon korporat dan majlis penghargaan berskala kecil.
```

## Test 6

Input: `A luxurious retreat with peace, comfort and tranquility for everyone.`

Acceptable repair:
```text
Penginapan eksklusif dengan kolam renang persendirian, laman tertutup dan ruang santai untuk keluarga serta majlis kecil.
```

## Test 7

Input: `Business lepak for stakeholders and rakan strategik.`

Acceptable repair:
```text
Sesi jaringan perniagaan bersama pihak berkepentingan dan rakan strategik dalam suasana tertutup dan teratur.
```

## Test 8

Input: `Jom plan family day - private pool, OOTD corner dan ruang makan semua ada.`

Pass if surface is social. If used on website, repair to:
```text
Ruang family day dengan kolam renang persendirian, sudut bergambar dan ruang makan bersama.
```
