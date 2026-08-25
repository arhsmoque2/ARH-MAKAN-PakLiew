# Visual Baseline Review Workflow

Gate 7 (`scripts/doctor-visual.mjs`) diffs every future page render against a
human-approved screenshot baseline. It is a documented **no-op, not a pass**,
until a baseline actually exists — see `scripts/doctor-visual.mjs`'s own output
if you're checking whether it's currently active.

This is how a baseline gets created or updated. Every step that writes to the
repo happens only after a human has looked at real pixels and said so —
nothing here promotes a screenshot to "correct" on an agent's say-so.

## 1. Generate candidates (manual trigger, never automatic)

Run the **"Generate Visual Baseline Candidates"** GitHub Actions workflow
(`workflow_dispatch` on `ci.yml`) against the branch/commit you want to
baseline. It:

1. Freezes the page clock to `tests/fixed-time.mjs`'s `BASELINE_FIXED_TIME`
   (a fixed Saturday-lunch instant) — the storefront's live session banner
   (`app.js` → `renderLiveStatus()`) reads real wall-clock time, so without
   this every candidate would differ from the last by whatever the banner
   text says right now, and the whole review would be noise.
2. Runs `playwright test --grep=@visual-regression --update-snapshots`,
   which writes fresh screenshots into `tests/visual-baselines/` **inside
   that disposable CI checkout only** — nothing is committed by this step.
3. Captures a bounding-box map of key elements per viewport, for the
   review page's tap-to-pin hit-testing.
4. Bundles everything into one self-contained `baseline-review.html` —
   images embedded as base64, zero external references — and uploads it
   as a workflow artifact.

Download that artifact. It's a plain file: open it in any browser, on any
device, with no network connection required. That's deliberate — review
happens wherever you actually are, offline included.

## 2. Review

Per viewport (desktop / tablet / mobile), pick one:
**Approve** · **Approve + comment** · **Reject** · **Reject + comment**.

- **Pin an issue** (only meaningful on a candidate you're rejecting): tap the
  spot on the screenshot. The tool resolves it against the embedded
  bounding-box map, so you get a real CSS selector, not just a coordinate.
  Tick preset tags (overflow, swallowed, font size, contrast, z-index, touch
  target, truncation, misalignment, wrong image, "other") — ticking tells
  the agent what's wrong without you writing a paragraph. Comment box stays
  available for anything a tag can't capture; required only if you pick
  "Other" with nothing else selected.
- **Mark an exception**: switch to that mode, then either tap an element or
  drag a box over a region that's *expected* to vary (not a defect —
  something genuinely dynamic we haven't anticipated). Pick a reason chip
  (time/date-dependent, live/dynamic data, third-party embed,
  not-yet-designed, other). This is **not a gate bypass**: it excludes only
  that region from pixel comparison. Everything else on the page is still
  diffed, every run, forever. Since you drew it yourself in the tool, your
  tap/drag plus its captured timestamp *is* the provenance record — no
  further ceremony. (If an agent proposes an exception on your behalf
  instead of you drawing it, that requires your verbatim quoted
  instruction + timestamp before it can be added — see `CLAUDE.md` /
  session norms. An agent-suggested box may appear pre-drawn as a dashed
  "suggested" outline, but it isn't real until you tap to confirm it.)

Everything persists to the browser's local storage as you go — closing the
page mid-review loses nothing. When every viewport has a decision, **Export
Decisions** becomes enabled; it downloads one JSON file containing your
decisions, tags, comments, exceptions, and the exact candidate image bytes
you reviewed (so what gets promoted is provably what you looked at, not a
regenerated approximation of it).

## 3. Send the export back

Attach the exported JSON in your session with the agent, or paste its
contents directly.

## 4. Promotion

`node scripts/promote-baseline.mjs <path-to-export>`:

- If **any** viewport is Rejected → **nothing is written**. The script
  prints every rejected viewport's pins (tag + selector + comment) as a
  fix list. The agent fixes those, a new round of candidates gets
  generated, and review starts again — rounds are numbered so there's
  never ambiguity about which set is current.
- If **all** viewports are Approved →
  - The exact reviewed PNG bytes are written to `tests/visual-baselines/`
    (this *is* the new baseline Gate 7 diffs against from now on).
  - Any exceptions drawn this round are merged into
    `tests/baseline-exceptions.json`, which `tests/visual-regression.spec.mjs`
    reads to build the `mask` list on every future run.
  - `tests/BASELINE-APPROVALS.md` gets a new `## Round N` entry: commit
    screenshotted, every timestamp in the chain, decision + comment per
    viewport, and a SHA-256 of each promoted PNG so the record is
    independently checkable — `sha256sum tests/visual-baselines/storefront-<project>.png`
    should always match what's logged.
  - The full decision record (minus duplicate image bytes, which are
    already the committed PNGs) is saved to
    `tests/baseline-approval-records/round-N-decision.json`.
  - Everything gets `git add`-ed. Commit and push to activate/update Gate 7.

## Why this shape

Every prior "quality gate" bug found in this repo shared one root cause: a
check that could report green without anyone having verified anything —
a live-endpoint warning that never failed the build, a regex that silently
never matched, a `disableRules(['color-contrast'])` with an unverified
comment, a CSS bug that shipped to production because nothing ever rendered
the page. This workflow is built specifically so that can't happen again for
visual regressions: the baseline is real bytes a human looked at, the
approval record is hash-verifiable, and an exception is a scoped, visible,
timestamped mask — never a silent rule disable.
