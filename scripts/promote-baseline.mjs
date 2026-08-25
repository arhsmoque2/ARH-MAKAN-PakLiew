import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const BASELINE_DIR = path.join(ROOT, 'tests', 'visual-baselines');
const EXCEPTIONS_PATH = path.join(ROOT, 'tests', 'baseline-exceptions.json');
const APPROVALS_LOG = path.join(ROOT, 'tests', 'BASELINE-APPROVALS.md');
const RECORDS_DIR = path.join(ROOT, 'tests', 'baseline-approval-records');

const decisionFilePath = process.argv[2];
if (!decisionFilePath) {
  console.error('Usage: node scripts/promote-baseline.mjs <path-to-baseline-decisions.json>');
  process.exit(1);
}
if (!fs.existsSync(decisionFilePath)) {
  console.error(`No such file: ${decisionFilePath}`);
  process.exit(1);
}

const decision = JSON.parse(fs.readFileSync(decisionFilePath, 'utf8'));

const rejected = decision.viewports.filter((v) => !v.decision || v.decision.indexOf('approve') !== 0);
if (rejected.length > 0) {
  console.error('\x1b[31m[promote-baseline] BLOCKED — not all viewports are approved:\x1b[0m\n');
  rejected.forEach((v) => {
    console.error(`  ✗ ${v.project}: decision=${v.decision || '(none)'}${v.comment ? ` — "${v.comment}"` : ''}`);
    (v.pins || []).forEach((pin, i) => {
      console.error(`      pin #${i + 1} [${pin.tags.join(', ') || 'note'}]${pin.selector ? ` on ${pin.selector}` : ''}${pin.comment ? ` — "${pin.comment}"` : ''}`);
    });
  });
  console.error('\nNothing was committed. Fix the flagged issues, regenerate candidates, and try again.');
  process.exit(1);
}

fs.mkdirSync(BASELINE_DIR, { recursive: true });
fs.mkdirSync(RECORDS_DIR, { recursive: true });

const promotedFiles = [];
for (const v of decision.viewports) {
  const outPath = path.join(BASELINE_DIR, `storefront-${v.project}.png`);
  const buf = Buffer.from(v.imageBase64, 'base64');
  fs.writeFileSync(outPath, buf);
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  promotedFiles.push({ project: v.project, path: path.relative(ROOT, outPath), sha256, bytes: buf.length });
}

// Merge exceptions (each already carries its own provenance: the reviewer's direct
// tap/drag + timestamp, captured client-side in the review tool — no additional
// ceremony added here, per the "you drew it, that's the record" rule).
let exceptionsDoc = { _comment: '', exceptions: [] };
if (fs.existsSync(EXCEPTIONS_PATH)) {
  exceptionsDoc = JSON.parse(fs.readFileSync(EXCEPTIONS_PATH, 'utf8'));
}
let newExceptionCount = 0;
for (const v of decision.viewports) {
  for (const exc of v.exceptions || []) {
    exceptionsDoc.exceptions.push({
      project: exc.selector ? null : v.project, // selector-based exceptions apply cross-project; box-only ones are per-project
      selector: exc.selector || null,
      box: exc.selector ? null : exc.box,
      reason: exc.reason,
      comment: exc.comment || '',
      markedAt: exc.markedAt,
      promotedAt: new Date().toISOString(),
      sourceRound: null, // filled in below once round number is known
    });
    newExceptionCount++;
  }
}

// Round number = count of existing "## Round" headers + 1.
let roundNumber = 1;
let existingLog = '';
if (fs.existsSync(APPROVALS_LOG)) {
  existingLog = fs.readFileSync(APPROVALS_LOG, 'utf8');
  const matches = existingLog.match(/^## Round \d+/gm) || [];
  roundNumber = matches.length + 1;
}
exceptionsDoc.exceptions.forEach((e) => { if (e.sourceRound === null) e.sourceRound = roundNumber; });
fs.writeFileSync(EXCEPTIONS_PATH, JSON.stringify(exceptionsDoc, null, 2));

// Stripped audit-trail copy (no duplicate image bytes — those are the committed PNGs,
// referenced here by hash).
const strippedRecord = {
  round: roundNumber,
  commitSha: decision.commitSha,
  generatedAt: decision.generatedAt,
  fixedTime: decision.fixedTime,
  exportedAt: decision.exportedAt,
  promotedAt: new Date().toISOString(),
  viewports: decision.viewports.map((v) => ({
    project: v.project,
    decision: v.decision,
    comment: v.comment,
    pins: v.pins,
    exceptions: v.exceptions,
  })),
};
const recordPath = path.join(RECORDS_DIR, `round-${roundNumber}-decision.json`);
fs.writeFileSync(recordPath, JSON.stringify(strippedRecord, null, 2));

// Append to the human-readable approval log.
const logEntry = `
## Round ${roundNumber}

- **Commit screenshotted:** \`${decision.commitSha}\`
- **Candidates generated:** ${decision.generatedAt}
- **Clock fixed to:** ${decision.fixedTime}
- **Decisions exported:** ${decision.exportedAt}
- **Promoted:** ${strippedRecord.promotedAt}
- **Full record:** \`tests/baseline-approval-records/round-${roundNumber}-decision.json\`

| Viewport | Decision | SHA-256 | Comment |
| :--- | :--- | :--- | :--- |
${decision.viewports
  .map((v) => {
    const f = promotedFiles.find((p) => p.project === v.project);
    return `| ${v.project} | ${v.decision} | \`${f.sha256.slice(0, 16)}…\` | ${v.comment ? v.comment.replace(/\|/g, '\\|') : '—'} |`;
  })
  .join('\n')}
${newExceptionCount > 0 ? `\nException(s) added this round: ${newExceptionCount} — see \`tests/baseline-exceptions.json\`.` : ''}
`;

const header = existingLog
  ? existingLog
  : `# BASELINE-APPROVALS.md — Visual Regression Approval Log

Every entry below is generated exclusively by \`scripts/promote-baseline.mjs\` from a
decision file exported directly by a human out of \`baseline-review.html\`. The
SHA-256 in each row is computed from the exact PNG bytes committed as the baseline —
verify it matches \`sha256sum tests/visual-baselines/storefront-<project>.png\` if you
ever doubt what's actually on disk. Never hand-edit this file.
`;
fs.writeFileSync(APPROVALS_LOG, header + logEntry);

// Stage everything for commit — this script writes files, the caller decides the
// commit message and whether/when to push.
try {
  execSync(
    `git add "${BASELINE_DIR}" "${EXCEPTIONS_PATH}" "${APPROVALS_LOG}" "${recordPath}"`,
    { cwd: ROOT, stdio: 'inherit' }
  );
} catch (e) {
  console.warn('[promote-baseline] git add failed — stage the files manually.');
}

console.log(`\n\x1b[32m[promote-baseline] Round ${roundNumber} promoted.\x1b[0m`);
promotedFiles.forEach((f) => console.log(`  ✓ ${f.path} (${f.sha256.slice(0, 16)}…, ${(f.bytes / 1024).toFixed(0)} KB)`));
if (newExceptionCount > 0) console.log(`  ✓ ${newExceptionCount} exception(s) merged into tests/baseline-exceptions.json`);
console.log(`  ✓ tests/BASELINE-APPROVALS.md updated`);
console.log(`  ✓ ${recordPath}`);
console.log('\nFiles are staged. Commit and push to activate Gate 7.');
