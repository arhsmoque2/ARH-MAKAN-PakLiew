import fs from 'fs';
import path from 'path';

console.log('\x1b[36m[CODE-DOCTOR]\x1b[0m Auditing Codebase Hygiene, Syntax & Data Schemas...');

const ROOT = process.cwd();
let failed = false;

// 1. Validate data/store.json
try {
  const storePath = path.join(ROOT, 'data', 'store.json');
  const store = JSON.parse(fs.readFileSync(storePath, 'utf8')).store;
  
  const requiredFields = ['name', 'chineseName', 'phone', 'whatsapp', 'address', 'googleMapsUrl', 'foodpandaUrl', 'sessions'];
  for (const f of requiredFields) {
    if (!store[f]) {
      console.error(`  \x1b[31m✗ store.json missing required field:\x1b[0m ${f}`);
      failed = true;
    }
  }
  if (!Array.isArray(store.sessions) || store.sessions.length < 3) {
    console.error(`  \x1b[31m✗ store.json must define at least 3 dining sessions\x1b[0m`);
    failed = true;
  }
  console.log(`  \x1b[32m✓\x1b[0m data/store.json schema valid (${store.sessions.length} sessions)`);
} catch (e) {
  console.error(`  \x1b[31m✗ Malformed data/store.json:\x1b[0m ${e.message}`);
  failed = true;
}

// 2. Validate data/menu.json
try {
  const menuPath = path.join(ROOT, 'data', 'menu.json');
  const menu = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
  
  if (!Array.isArray(menu.categories) || menu.categories.length === 0) {
    console.error(`  \x1b[31m✗ menu.json missing categories array\x1b[0m`);
    failed = true;
  }
  if (!Array.isArray(menu.items) || menu.items.length === 0) {
    console.error(`  \x1b[31m✗ menu.json missing items array\x1b[0m`);
    failed = true;
  }
  
  // Verify images exist
  let missingImages = 0;
  for (const item of menu.items) {
    if (item.image) {
      const cleanPath = item.image.replace(/^\.\//, '');
      const imgPath = path.join(ROOT, cleanPath);
      if (!fs.existsSync(imgPath)) {
        console.error(`  \x1b[31m✗ Missing menu image asset:\x1b[0m ${item.image} (item: ${item.id})`);
        missingImages++;
        failed = true;
      }
    }
  }
  if (missingImages === 0) {
    console.log(`  \x1b[32m✓\x1b[0m data/menu.json valid (${menu.categories.length} categories, ${menu.items.length} items, all images present)`);
  }
} catch (e) {
  console.error(`  \x1b[31m✗ Malformed data/menu.json:\x1b[0m ${e.message}`);
  failed = true;
}

// 3. Validate Core Script syntax
try {
  const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  if (!appJs.includes('initApp') || !appJs.includes('renderLiveStatus')) {
    console.error(`  \x1b[31m✗ app.js missing core entrypoints\x1b[0m`);
    failed = true;
  } else {
    console.log(`  \x1b[32m✓\x1b[0m app.js entrypoint integrity verified`);
  }
} catch (e) {
  console.error(`  \x1b[31m✗ Missing or unreadable app.js\x1b[0m`);
  failed = true;
}

if (failed) {
  console.error('\x1b[31m[CODE-DOCTOR FAILED]\x1b[0m Codebase hygiene or schema checks failed.');
  process.exit(1);
} else {
  console.log('\x1b[32m[CODE-DOCTOR PASSED]\x1b[0m Codebase and data schemas verified.\n');
}