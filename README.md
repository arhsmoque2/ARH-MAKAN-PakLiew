# Pak Liew Chinese Muslim Restaurant PWA (柏刘清真餐厅)

**Production Edge Ingress:** [https://arh-makan-pakliew.arh-homelab.workers.dev](https://arh-makan-pakliew.arh-homelab.workers.dev)  
**Location:** 60, Jalan Lumut, Titiwangsa Sentral, 50400 Kuala Lumpur  
**Cultural Persona:** Malaysian Nanyang Chinese-Muslim Heritage  

---

## 1. System Overview & Status

| Dimension | Specification / Status |
| :--- | :--- |
| **Architecture** | Zero-Build Vanilla HTML5, CSS3 Custom Properties, ES Modules (`app.js`) |
| **Edge Runtime** | Cloudflare Workers with Static Assets (`workerd` V8 Isolates) |
| **Delivery Integration** | FoodPanda Direct (4.9 / 5.0 ⭐ Rating) |
| **Quality Suite** | 6-Gate Doctor Harness (`npm run doctor` / `scripts/quality-gate.mjs`) |
| **Headless E2E / A11y** | Playwright multi-viewport (Desktop, Tablet, Mobile) + `@axe-core/playwright` WCAG 2.1 AA (`npm test`) |
| **Local Preview** | Portable Node.js Static Server on port 8091 (`npm run preview`) |
| **Status** | 🟢 Live & Serving in Production |

---

## 2. Quickstart & Operator Runbook

```powershell
# 1. Start portable local preview server (cross-platform http://localhost:8091)
npm run preview

# 2. Run Playwright E2E DOM, multi-viewport & accessibility tests
npm test

# 3. Run the complete 6-Gate Quality Doctor Harness
node scripts/quality-gate.mjs

# 4. Deploy to Cloudflare Edge
npx wrangler deploy
```