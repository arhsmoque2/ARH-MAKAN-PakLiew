# RECIPES.md — Operational Playbooks

### Recipe 1: Running Quality Gate
```powershell
node scripts/quality-gate.mjs
```

### Recipe 2: Deploying to Cloudflare Edge
```powershell
npx wrangler deploy
```

### Recipe 3: Local Live Preview
```powershell
node D:/_ARH-AGENT-OS/_AGENT-CAPABILITIES/arh-server-bootstrap/bin/arh-server-deploy-bootstrap.mjs .
```