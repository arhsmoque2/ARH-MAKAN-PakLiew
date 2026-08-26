import fs from 'fs';
import path from 'path';

console.log('\x1b[36m[MEDIA-DOCTOR]\x1b[0m Auditing Hero Video Banner, Poster Framing & Streaming Budgets...');

const ROOT = process.cwd();
let failed = false;

const MAX_VIDEO_BYTES = 2.5 * 1024 * 1024;  // 2.5 MB maximum per video stream
const MAX_HERO_STILL_BYTES = 150 * 1024;    // 150 KB maximum for ambient poster/still

// 1. Audit Video Stream Payloads
const videoFiles = ['images/hero-video-1.mp4', 'images/hero-video-1.webm'];
for (const relPath of videoFiles) {
  const fullPath = path.join(ROOT, relPath);
  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    const sizeMb = (stat.size / 1024 / 1024).toFixed(2);
    if (stat.size > MAX_VIDEO_BYTES) {
      console.error(`  \x1b[31m✗ Video stream exceeds 2.5MB payload budget:\x1b[0m ${relPath} (${sizeMb} MB)`);
      failed = true;
    } else {
      console.log(`  \x1b[32m✓\x1b[0m Video stream payload within budget: ${relPath} (${sizeMb} MB <= 2.5 MB)`);
    }
  } else {
    console.error(`  \x1b[31m✗ Expected video stream missing:\x1b[0m ${relPath}`);
    failed = true;
  }
}

// 2. Audit Poster & Hero Still Framing
const heroStills = ['images/hero-storefront.jpg', 'images/hero-video-1-poster.jpg'];
for (const relPath of heroStills) {
  const fullPath = path.join(ROOT, relPath);
  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    const sizeKb = (stat.size / 1024).toFixed(1);
    if (stat.size > MAX_HERO_STILL_BYTES) {
      console.error(`  \x1b[31m✗ Hero still exceeds 150KB budget:\x1b[0m ${relPath} (${sizeKb} KB)`);
      failed = true;
    } else {
      console.log(`  \x1b[32m✓\x1b[0m Hero still payload within budget: ${relPath} (${sizeKb} KB <= 150 KB)`);
    }
  } else {
    console.error(`  \x1b[31m✗ Expected hero still/poster missing:\x1b[0m ${relPath}`);
    failed = true;
  }
}

// 3. Audit HTML5 <video> Declarations in index.html
try {
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  // Assert video tags contain muted, playsinline, and poster
  const videoTagMatches = indexHtml.match(/<video[^>]*>/g) || [];
  if (videoTagMatches.length === 0) {
    console.warn(`  \x1b[33m⚠ No <video> tag found in index.html\x1b[0m`);
  } else {
    for (const tag of videoTagMatches) {
      if (!tag.includes('muted')) {
        console.error(`  \x1b[31m✗ Video tag missing required 'muted' attribute (blocks autoplay):\x1b[0m ${tag}`);
        failed = true;
      }
      if (!tag.includes('playsinline')) {
        console.error(`  \x1b[31m✗ Video tag missing required 'playsinline' attribute (causes iOS fullscreen pop):\x1b[0m ${tag}`);
        failed = true;
      }
      if (!tag.includes('poster=')) {
        console.error(`  \x1b[31m✗ Video tag missing 'poster' attribute (causes layout shift & black frame flash):\x1b[0m ${tag}`);
        failed = true;
      }
    }
    console.log(`  \x1b[32m✓\x1b[0m HTML5 video element attributes conform to zero-jank autoplay contract`);
  }
} catch (e) {
  console.error(`  \x1b[31m✗ Failed to parse index.html for media audit:\x1b[0m ${e.message}`);
  failed = true;
}

if (failed) {
  console.error('\x1b[31m[MEDIA-DOCTOR FAILED]\x1b[0m Media assets or video performance standards violated.');
  process.exit(1);
} else {
  console.log('\x1b[32m[MEDIA-DOCTOR PASSED]\x1b[0m Hero video banner quality, streaming budgets & poster framing verified.\n');
  process.exit(0);
}
