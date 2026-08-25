# 0002: Deployment Platform Selection & Cloudflare Workers Convergence

**Status**: Accepted  
**Date**: 2026-08-25  
**Authors**: ARH Pair Programming Agent & Operator  
**Governing Standards**: rh-frontend-design-v1.0.0 & rh-infra-devtooling

---

## 1. Context & Greenfield Evaluation

When selecting a hosting and runtime platform for the **Pak Liew Chinese Muslim Restaurant PWA** (ARH-MAKAN-PakLiew), we conducted a comprehensive greenfield architectural trade-off analysis across four major cloud hosting models:

1. **Cloudflare Workers with Workers Static Assets** (Edge V8 Isolates)
2. **Vercel** (AWS Lambda / Node.js Serverless + Edge Network)
3. **Netlify** (AWS Lambda / S3 JAMstack)
4. **Self-Hosted VPS / Container Platforms** (Coolify, Fly.io, Docker)

The evaluation was judged through the lenses of **cold-start latency**, **egress bandwidth costs**, **framework agnosticism**, **local reproducibility**, and **edge database proximity**.

---

## 2. Comparative Analysis Matrix

| Dimension | Cloudflare Workers (Selected) | Vercel | Netlify | Self-Hosted (Coolify/VPS) |
|---|---|---|---|---|
| **Runtime Model** | **V8 Isolates** (Lightweight shared process) | **Node.js Containers** (AWS Lambda) | **Node.js Containers** (AWS Lambda) | Docker containers / VM |
| **Cold Starts** | **0ms** globally across 330+ PoPs | **250ms – 1,500ms** on idle functions | **300ms – 2,000ms** on idle functions | 0ms (Single region) |
| **Egress Bandwidth Cost** | ** / GB** (Zero egress alliance) | .15 / GB commercial markup | Steep overage tiers | Capped / Metered VPS bandwidth |
| **Asset Delivery** | Direct edge asset binding ([assets]) | Cloud container build queue | Cloud container build queue | Local Nginx / Caddy server |
| **Data Proximity** | Native D1 (SQLite), KV, R2, Hyperdrive | Third-party resellers (Neon, Upstash) | Third-party integrations | Local Docker DBs |
| **Deployment Speed** | **< 2 seconds** via wrangler deploy | 30s – 2min remote build queue | 45s – 3min remote build queue | 1min – 5min Docker build |
| **Framework Lock-in** | **Zero lock-in** (Vanilla, Hono, Astro) | Biased toward **Next.js & RSC** | Framework-neutral | Zero lock-in |

---

## 3. Decision Drivers & Rationale

We selected **Cloudflare Workers (with Workers Static Assets)** as the canonical production runtime for the following reasons:

1. **0ms Cold-Start Performance:** Food discovery and dining decision-making require instantaneous page rendering (<100ms TTI) for diners scanning QR codes or clicking links from TikTok/Instagram reels in Malaysia.
2. **Zero Egress Bandwidth Risk:** High-resolution food photography (buffet line spreads, wok hei dishes) can trigger unexpected bandwidth costs on metered platforms during viral traffic spikes. Cloudflare eliminates egress fees entirely.
3. **Edge Programmability (worker.mjs):** Enables custom edge headers, dynamic session time checking, Zero Trust access gates, and runtime API proxying directly in code without server maintenance.
4. **Zero-Build Portability:** Pure web standards (HTML5/CSS3/ESM) deploy instantly via wrangler.toml with no reliance on proprietary cloud build pipelines.

---

## 4. Secrets Management & Automation Standard

In accordance with ARH security doctrine:
- All Cloudflare API tokens and account credentials are recovered exclusively from the canonical SOPS vault (ARH-OS-Central/arh-secrets-vault/).
- No plaintext credentials are committed to Git.
- Continuous deployment is driven via GitHub Secrets and local wrangler CLI injection.