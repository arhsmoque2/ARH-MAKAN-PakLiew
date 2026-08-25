# GOTCHAS.md — Standardized Failure Capsules

### Gotcha 1: Cloudflare Wrangler TOML String Quotes
- **Symptom:** `Invalid TOML document: invalid value` on `wrangler deploy`.
- **Root Cause:** PowerShell string escaping adding literal backslashes around quotes.
- **Permanent Fix:** Use standard single-quoted PowerShell strings or explicit UTF-8 `Set-Content`.
- **Verification:** `npx wrangler deploy --dry-run` exits 0.

### Gotcha 2: Forbidden Hype Adjectives
- **Symptom:** Overclaiming language ("padu", "giler") triggers consumer skepticism.
- **Root Cause:** Copying generic marketing tropes.
- **Permanent Fix:** Run `node scripts/doctor-ui.mjs` to block forbidden words.