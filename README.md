# Pak Liew Chinese Muslim Restaurant PWA (柏刘清真餐厅)

**Production Edge Ingress:** [https://arh-makan-pakliew.arh-homelab.workers.dev](https://arh-makan-pakliew.arh-homelab.workers.dev)  
**Location:** 60, Jalan Lumut, Titiwangsa Sentral, 50400 Kuala Lumpur  
**Cultural Persona:** Malaysian Nanyang Chinese-Muslim Heritage  

---

## 1. System Overview & Status

| Dimension | Specification / Status |
| :--- | :--- |
| **Architecture** | Zero-Build Vanilla HTML5, CSS3 Custom Properties, ES Modules |
| **Edge Runtime** | Cloudflare Workers with Static Assets (`workerd` V8 Isolates) |
| **Delivery Integration** | FoodPanda Direct (4.9 / 5.0 ⭐ Rating) |
| **Quality Suite** | End-to-End Doctor Harness (`npm run doctor`) |
| **Status** | 🟢 Live & Serving in Production |

---

## 2. Quickstart & Operator Runbook

```powershell
# Run the complete Quality Gate
node scripts/quality-gate.mjs

# Deploy to Cloudflare Edge
npx wrangler deploy
```