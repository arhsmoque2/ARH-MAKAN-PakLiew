# RECIPES.md — Operational Playbooks

### Recipe 1: Running Quality Gate Doctor Suite
```powershell
# Run all 6 gates (Docs, Code, UI, Security, Edge, Render & A11y)
node scripts/quality-gate.mjs
```

### Recipe 2: Running Playwright Browser & Accessibility Tests
```powershell
# Run headless multi-viewport E2E tests and axe-core audit
npm test

# Run tests with interactive UI / trace viewer
npx playwright test --ui
```

### Recipe 3: Cross-Platform Local Live Preview
```powershell
# Starts the portable Node.js static server on http://localhost:8091
npm run preview
```

### Recipe 4: Deploying to Cloudflare Workers Edge
```powershell
# Deploy static assets directly to Cloudflare edge
npx wrangler deploy
```