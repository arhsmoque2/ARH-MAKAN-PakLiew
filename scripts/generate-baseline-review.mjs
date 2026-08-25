import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'baseline-review-data');
const BASELINE_DIR = path.join(ROOT, 'tests', 'visual-baselines');
const OUT_FILE = path.join(ROOT, 'baseline-review.html');

function readManifest() {
  const p = path.join(DATA_DIR, 'manifest.json');
  if (!fs.existsSync(p)) {
    throw new Error(`No manifest at ${p} — run "npm run baseline:candidates" first.`);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function toBase64Png(filePath) {
  return fs.readFileSync(filePath).toString('base64');
}

function buildViewports(manifest) {
  return manifest.projects.map((projectName) => {
    const pngPath = path.join(BASELINE_DIR, `storefront-${projectName}.png`);
    const bboxPath = path.join(DATA_DIR, `${projectName}.bboxes.json`);
    if (!fs.existsSync(pngPath)) {
      throw new Error(`Missing candidate screenshot: ${pngPath}`);
    }
    const bboxData = fs.existsSync(bboxPath)
      ? JSON.parse(fs.readFileSync(bboxPath, 'utf8'))
      : { boxes: [], pageSize: null, viewport: null };
    return {
      project: projectName,
      imageBase64: toBase64Png(pngPath),
      boxes: bboxData.boxes || [],
      pageSize: bboxData.pageSize || null,
      viewport: bboxData.viewport || null,
    };
  });
}

function escapeForScript(json) {
  // Prevent premature </script> termination inside embedded JSON.
  return json.replace(/</g, '\\u003c');
}

function render(manifest, viewports) {
  const dataScript = `window.__BASELINE_REVIEW__ = ${escapeForScript(
    JSON.stringify({ manifest, viewports }, null, 0)
  )};`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Pak Liew — Baseline Review (${manifest.commitSha.slice(0, 7)})</title>
<style>${STYLE}</style>
</head>
<body>
<div id="app"></div>
<script>${dataScript}</script>
<script>${APP_JS}</script>
</body>
</html>`;
}

const STYLE = `
:root {
  --bg: #0f1a15; --surface: #16241d; --border: #2a3d31; --text: #eef3ef;
  --muted: #9db3a6; --accent: #f0b849; --danger: #e0574a; --ok: #4caf7d;
  --pending: #6b7f74;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.45 -apple-system, system-ui, sans-serif; }
#app { max-width: 900px; margin: 0 auto; padding: 12px; }
h1 { font-size: 1.1rem; margin: 4px 0; }
.meta { color: var(--muted); font-size: 0.8rem; margin-bottom: 12px; word-break: break-all; }
.summary { position: sticky; top: 0; z-index: 20; background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; padding: 10px 12px; margin-bottom: 14px; display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }
.summary b { font-size: 1rem; }
.summary .count { color: var(--muted); font-size: 0.85rem; }
.export-btn { margin-left: auto; background: var(--accent); color: #221a06; border: none; border-radius: 8px;
  padding: 10px 16px; font-weight: 700; font-size: 0.9rem; min-height: 44px; cursor: pointer; }
.export-btn:disabled { opacity: 0.4; }
.viewport-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px; margin-bottom: 20px; }
.vp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; flex-wrap: wrap; gap: 6px; }
.vp-title { font-weight: 700; }
.vp-dims { color: var(--muted); font-size: 0.8rem; }
.decision-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
.decision-btn { flex: 1 1 auto; min-width: 90px; min-height: 44px; border-radius: 8px; border: 1px solid var(--border);
  background: #1c2b22; color: var(--text); font-size: 0.82rem; cursor: pointer; padding: 6px 8px; }
.decision-btn.active[data-kind="approve"] { background: var(--ok); border-color: var(--ok); color: #06210f; font-weight: 700; }
.decision-btn.active[data-kind="reject"] { background: var(--danger); border-color: var(--danger); color: #2a0806; font-weight: 700; }
.mode-row { display: flex; gap: 6px; margin-bottom: 8px; }
.mode-btn { min-height: 40px; border-radius: 8px; border: 1px solid var(--border); background: #1c2b22; color: var(--muted);
  font-size: 0.8rem; padding: 6px 12px; cursor: pointer; }
.mode-btn.active { border-color: var(--accent); color: var(--accent); }
.img-wrap { position: relative; overflow: auto; border: 1px solid var(--border); border-radius: 8px; max-height: 70vh; touch-action: pan-y pinch-zoom; }
.img-wrap.pin-mode, .img-wrap.exception-mode { touch-action: none; }
.img-wrap img { display: block; width: 100%; height: auto; }
.pin-marker { position: absolute; width: 26px; height: 26px; margin: -13px 0 0 -13px; border-radius: 50%;
  background: var(--danger); color: #fff; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center;
  justify-content: center; border: 2px solid #fff; cursor: pointer; }
.exception-box { position: absolute; border: 2px dashed var(--accent); background: rgba(240,184,73,0.18); cursor: pointer; }
.exception-box.suggested { border-style: dotted; opacity: 0.7; }
.exception-drag { position: absolute; border: 2px dashed var(--accent); background: rgba(240,184,73,0.25); pointer-events: none; }
.popover { position: fixed; left: 12px; right: 12px; bottom: 12px; background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 14px; z-index: 50; max-height: 60vh; overflow-y: auto; box-shadow: 0 -4px 24px rgba(0,0,0,0.5); }
.popover h3 { margin: 0 0 8px; font-size: 0.95rem; }
.chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.chip { min-height: 36px; padding: 6px 10px; border-radius: 999px; border: 1px solid var(--border); background: #1c2b22;
  color: var(--text); font-size: 0.78rem; cursor: pointer; }
.chip.selected { background: var(--accent); color: #221a06; border-color: var(--accent); font-weight: 700; }
textarea { width: 100%; min-height: 60px; background: #0f1a15; border: 1px solid var(--border); border-radius: 8px;
  color: var(--text); padding: 8px; font: inherit; margin-bottom: 10px; }
.popover-actions { display: flex; gap: 8px; }
.btn { flex: 1; min-height: 44px; border-radius: 8px; border: 1px solid var(--border); background: #1c2b22;
  color: var(--text); font-size: 0.9rem; cursor: pointer; }
.btn.primary { background: var(--accent); color: #221a06; font-weight: 700; border-color: var(--accent); }
.btn.danger-outline { color: var(--danger); border-color: var(--danger); }
.item-list { margin-top: 8px; font-size: 0.8rem; }
.item-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; border-radius: 6px;
  background: #1c2b22; margin-bottom: 4px; gap: 8px; }
.item-row .tags { color: var(--muted); flex: 1; }
.item-row button { background: none; border: none; color: var(--danger); font-size: 1rem; cursor: pointer; padding: 4px 8px; }
.hint { color: var(--muted); font-size: 0.75rem; margin: 4px 0 8px; }
.overlay-layer { position: absolute; inset: 0; }
`;

const APP_JS = `
(function () {
  var DATA = window.__BASELINE_REVIEW__;
  var ISSUE_TAGS = ['Overflow/clipped','Element swallowed','Font too small','Font too large','Font/type mismatch','Color/contrast','Misalignment/spacing','Wrong/missing image','Z-index/stacking','Touch target too small','Text truncation','Other'];
  var EXCEPTION_REASONS = ['Time/date-dependent','Live/dynamic data','Third-party embed','Not-yet-designed','Other'];
  var STORAGE_KEY = 'baseline-review:' + DATA.manifest.commitSha;

  var state = loadState();

  function defaultState() {
    var vp = {};
    DATA.viewports.forEach(function (v) {
      vp[v.project] = { decision: null, comment: '', pins: [], exceptions: [] };
    });
    return { viewports: vp };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        var d = defaultState();
        Object.keys(d.viewports).forEach(function (k) {
          if (parsed.viewports && parsed.viewports[k]) d.viewports[k] = parsed.viewports[k];
        });
        return d;
      }
    } catch (e) {}
    return defaultState();
  }

  function findSmallestBoxAt(boxes, px, py) {
    var best = null;
    boxes.forEach(function (b) {
      var x0 = b.box.x, y0 = b.box.y, x1 = b.box.x + b.box.width, y1 = b.box.y + b.box.height;
      if (px >= x0 && px <= x1 && py >= y0 && py <= y1) {
        var area = b.box.width * b.box.height;
        if (!best || area < best._area) { best = Object.assign({}, b, { _area: area }); }
      }
    });
    return best;
  }

  var popoverEl = null;
  function closePopover() { if (popoverEl) { popoverEl.remove(); popoverEl = null; } }

  function openPinPopover(project, relX, relY, hitBox, pendingId) {
    closePopover();
    var el = document.createElement('div');
    el.className = 'popover';
    var selectedTags = [];
    el.innerHTML =
      '<h3>Pin issue' + (hitBox ? ' — ' + escapeHtml(hitBox.tag + (hitBox.classes ? '.' + hitBox.classes.split(' ')[0] : '')) : '') + '</h3>' +
      '<div class="chip-row" data-role="tags"></div>' +
      '<textarea data-role="comment" placeholder="Optional detail (required if you pick Other)"></textarea>' +
      '<div class="popover-actions">' +
      '<button class="btn" data-role="cancel">Cancel</button>' +
      '<button class="btn primary" data-role="save">Save Pin</button>' +
      '</div>';
    var tagRow = el.querySelector('[data-role="tags"]');
    ISSUE_TAGS.forEach(function (tag) {
      var chip = document.createElement('button');
      chip.className = 'chip'; chip.textContent = tag; chip.type = 'button';
      chip.onclick = function () {
        var i = selectedTags.indexOf(tag);
        if (i === -1) selectedTags.push(tag); else selectedTags.splice(i, 1);
        chip.classList.toggle('selected');
      };
      tagRow.appendChild(chip);
    });
    el.querySelector('[data-role="cancel"]').onclick = closePopover;
    el.querySelector('[data-role="save"]').onclick = function () {
      var comment = el.querySelector('[data-role="comment"]').value.trim();
      if (selectedTags.length === 0 && !comment) { alert('Pick at least one tag or add a comment.'); return; }
      if (selectedTags.indexOf('Other') !== -1 && !comment) { alert('"Other" needs a comment.'); return; }
      state.viewports[project].pins.push({
        id: pendingId, x: relX, y: relY,
        selector: hitBox ? hitBox.selector : null,
        elementTag: hitBox ? hitBox.tag : null,
        tags: selectedTags, comment: comment,
        placedAt: new Date().toISOString(),
      });
      closePopover(); persistAndRefresh();
    };
    popoverEl = el; document.body.appendChild(el);
  }

  function openExceptionPopover(project, boxRel, hitBox, pendingId) {
    closePopover();
    var el = document.createElement('div');
    el.className = 'popover';
    var selectedReason = null;
    el.innerHTML =
      '<h3>Mark exception' + (hitBox ? ' — ' + escapeHtml(hitBox.tag) : '') + '</h3>' +
      '<div class="hint">Excluded from pixel-diff inside this box only. Gate still checks everything else, every run.</div>' +
      '<div class="chip-row" data-role="reasons"></div>' +
      '<textarea data-role="comment" placeholder="Optional note"></textarea>' +
      '<div class="popover-actions">' +
      '<button class="btn" data-role="cancel">Cancel</button>' +
      '<button class="btn primary" data-role="save">Save Exception</button>' +
      '</div>';
    var reasonRow = el.querySelector('[data-role="reasons"]');
    EXCEPTION_REASONS.forEach(function (reason) {
      var chip = document.createElement('button');
      chip.className = 'chip'; chip.textContent = reason; chip.type = 'button';
      chip.onclick = function () {
        Array.prototype.forEach.call(reasonRow.children, function (c) { c.classList.remove('selected'); });
        chip.classList.add('selected'); selectedReason = reason;
      };
      reasonRow.appendChild(chip);
    });
    el.querySelector('[data-role="cancel"]').onclick = closePopover;
    el.querySelector('[data-role="save"]').onclick = function () {
      if (!selectedReason) { alert('Pick a reason.'); return; }
      var comment = el.querySelector('[data-role="comment"]').value.trim();
      state.viewports[project].exceptions.push({
        id: pendingId, box: boxRel,
        selector: hitBox ? hitBox.selector : null,
        reason: selectedReason, comment: comment,
        suggestedByAgent: false,
        markedAt: new Date().toISOString(),
      });
      closePopover(); persistAndRefresh();
    };
    popoverEl = el; document.body.appendChild(el);
  }

  function escapeHtml(s) { return (s || '').replace(/[&<>"']/g, function (c) { return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); }

  var uid = 1;

  function attachImageHandlers(wrap, img, overlay, project, vpData) {
    var mode = 'browse';
    var dragStart = null, dragEl = null;

    function setMode(m) {
      mode = m;
      wrap.classList.toggle('pin-mode', m === 'pin');
      wrap.classList.toggle('exception-mode', m === 'exception');
    }
    wrap.__setMode = setMode;

    function toRel(clientX, clientY) {
      var rect = img.getBoundingClientRect();
      var scaleX = img.naturalWidth / rect.width;
      var scaleY = img.naturalHeight / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
        relX: (clientX - rect.left) / rect.width,
        relY: (clientY - rect.top) / rect.height,
      };
    }

    wrap.addEventListener('pointerdown', function (e) {
      if (mode === 'browse') return;
      e.preventDefault();
      var p = toRel(e.clientX, e.clientY);
      dragStart = { clientX: e.clientX, clientY: e.clientY, p: p };
      if (mode === 'exception') {
        dragEl = document.createElement('div');
        dragEl.className = 'exception-drag';
        overlay.appendChild(dragEl);
      }
    });
    wrap.addEventListener('pointermove', function (e) {
      if (!dragStart || mode !== 'exception' || !dragEl) return;
      var rect = img.getBoundingClientRect();
      var x0 = Math.min(dragStart.clientX, e.clientX) - rect.left;
      var y0 = Math.min(dragStart.clientY, e.clientY) - rect.top;
      var w = Math.abs(e.clientX - dragStart.clientX);
      var h = Math.abs(e.clientY - dragStart.clientY);
      dragEl.style.left = x0 + 'px'; dragEl.style.top = y0 + 'px';
      dragEl.style.width = w + 'px'; dragEl.style.height = h + 'px';
    });
    wrap.addEventListener('pointerup', function (e) {
      if (!dragStart) return;
      var p2 = toRel(e.clientX, e.clientY);
      var moved = Math.hypot(e.clientX - dragStart.clientX, e.clientY - dragStart.clientY) > 8;
      if (mode === 'pin') {
        var hit = findSmallestBoxAt(vpData.boxes, dragStart.p.x, dragStart.p.y);
        openPinPopover(project, dragStart.p.relX, dragStart.p.relY, hit, uid++);
      } else if (mode === 'exception') {
        if (dragEl) { dragEl.remove(); dragEl = null; }
        var boxRel;
        if (moved) {
          boxRel = {
            x: Math.min(dragStart.p.relX, p2.relX), y: Math.min(dragStart.p.relY, p2.relY),
            width: Math.abs(p2.relX - dragStart.p.relX), height: Math.abs(p2.relY - dragStart.p.relY),
          };
          openExceptionPopover(project, boxRel, null, uid++);
        } else {
          var hitEx = findSmallestBoxAt(vpData.boxes, dragStart.p.x, dragStart.p.y);
          if (hitEx) {
            boxRel = {
              x: hitEx.box.x / vpData.pageSize.width, y: hitEx.box.y / vpData.pageSize.height,
              width: hitEx.box.width / vpData.pageSize.width, height: hitEx.box.height / vpData.pageSize.height,
            };
            openExceptionPopover(project, boxRel, hitEx, uid++);
          }
        }
      }
      dragStart = null;
    });
  }

  function renderOverlayMarkers(overlay, project, vpData) {
    overlay.innerHTML = '';
    var vp = state.viewports[project];
    vp.pins.forEach(function (pin, idx) {
      var m = document.createElement('div');
      m.className = 'pin-marker';
      m.style.left = (pin.x * 100) + '%'; m.style.top = (pin.y * 100) + '%';
      m.textContent = String(idx + 1);
      m.title = pin.tags.join(', ') + (pin.comment ? ' — ' + pin.comment : '');
      overlay.appendChild(m);
    });
    vp.exceptions.forEach(function (exc) {
      var b = document.createElement('div');
      b.className = 'exception-box' + (exc.suggestedByAgent ? ' suggested' : '');
      b.style.left = (exc.box.x * 100) + '%'; b.style.top = (exc.box.y * 100) + '%';
      b.style.width = (exc.box.width * 100) + '%'; b.style.height = (exc.box.height * 100) + '%';
      b.title = exc.reason + (exc.comment ? ' — ' + exc.comment : '');
      overlay.appendChild(b);
    });
  }

  function summaryCounts() {
    var total = DATA.viewports.length, decided = 0, approved = 0, rejected = 0;
    DATA.viewports.forEach(function (v) {
      var d = state.viewports[v.project].decision;
      if (d) { decided++; if (d.indexOf('approve') === 0) approved++; else rejected++; }
    });
    return { total: total, decided: decided, approved: approved, rejected: rejected };
  }

  function buildExport() {
    var viewportsOut = DATA.viewports.map(function (v) {
      var s = state.viewports[v.project];
      return {
        project: v.project,
        decision: s.decision,
        comment: s.comment,
        pins: s.pins,
        exceptions: s.exceptions,
        imageBase64: v.imageBase64,
      };
    });
    return {
      commitSha: DATA.manifest.commitSha,
      generatedAt: DATA.manifest.generatedAt,
      fixedTime: DATA.manifest.fixedTime,
      exportedAt: new Date().toISOString(),
      viewports: viewportsOut,
    };
  }

  function doExport() {
    var payload = buildExport();
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'baseline-decisions-' + DATA.manifest.commitSha.slice(0, 7) + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  var root = document.getElementById('app');
  var cardRefs = {}; // project -> { decisionBtns, commentTa, wrap, img, overlay, list, exportBtnEl, summaryEl }

  // Built exactly once. State changes after this only ever call refresh(), which
  // updates classes/text/overlay content in place — the <img> element (and its
  // base64 decode) is never recreated, so overlay rendering doesn't depend on
  // onload firing again after every tap, and the page doesn't jump-scroll on
  // every micro-interaction like a chip tick.
  function buildAll() {
    var header = document.createElement('div');
    header.innerHTML = '<h1>Pak Liew Storefront — Baseline Review</h1>' +
      '<div class="meta">Commit ' + DATA.manifest.commitSha + ' &middot; captured ' + DATA.manifest.generatedAt +
      ' &middot; clock fixed to ' + DATA.manifest.fixedTime + '</div>';
    root.appendChild(header);

    var summary = document.createElement('div');
    summary.className = 'summary';
    var summaryLabel = document.createElement('b');
    var summaryCount = document.createElement('span');
    summaryCount.className = 'count';
    summary.appendChild(summaryLabel); summary.appendChild(summaryCount);
    var exportBtn = document.createElement('button');
    exportBtn.className = 'export-btn'; exportBtn.textContent = 'Export Decisions';
    exportBtn.onclick = doExport;
    summary.appendChild(exportBtn);
    root.appendChild(summary);
    cardRefs.__summary = { label: summaryLabel, count: summaryCount, exportBtn: exportBtn };

    DATA.viewports.forEach(function (v) {
      var vp = state.viewports[v.project];
      var card = document.createElement('div');
      card.className = 'viewport-card';

      var vpHeader = document.createElement('div');
      vpHeader.className = 'vp-header';
      vpHeader.innerHTML = '<span class="vp-title">' + v.project + '</span>' +
        '<span class="vp-dims">' + (v.viewport ? v.viewport.width + '\\u00d7' + v.viewport.height : '') + '</span>';
      card.appendChild(vpHeader);

      var decisionRow = document.createElement('div');
      decisionRow.className = 'decision-row';
      var decisionBtns = [];
      [
        ['approve', 'Approve'], ['approve-comment', 'Approve + comment'],
        ['reject', 'Reject'], ['reject-comment', 'Reject + comment'],
      ].forEach(function (pair) {
        var btn = document.createElement('button');
        btn.className = 'decision-btn';
        btn.setAttribute('data-kind', pair[0].indexOf('approve') === 0 ? 'approve' : 'reject');
        btn.setAttribute('data-value', pair[0]);
        btn.textContent = pair[1];
        btn.onclick = function () { vp.decision = pair[0]; persistAndRefresh(); };
        decisionRow.appendChild(btn);
        decisionBtns.push(btn);
      });
      card.appendChild(decisionRow);

      var ta = document.createElement('textarea');
      ta.placeholder = 'Comment for this viewport'; ta.value = vp.comment || '';
      ta.style.display = 'none';
      ta.oninput = function () { vp.comment = ta.value; };
      ta.onblur = function () { saveOnly(); };
      card.appendChild(ta);

      var modeRow = document.createElement('div');
      modeRow.className = 'mode-row';
      var browseBtn = mkModeBtn('Browse', 'browse');
      var pinBtn = mkModeBtn('Pin Issue', 'pin');
      var excBtn = mkModeBtn('Mark Exception', 'exception');
      browseBtn.classList.add('active');
      modeRow.appendChild(browseBtn); modeRow.appendChild(pinBtn); modeRow.appendChild(excBtn);
      card.appendChild(modeRow);

      var hint = document.createElement('div');
      hint.className = 'hint';
      hint.textContent = 'Pin Issue: tap the spot. Mark Exception: tap an element or drag a box.';
      card.appendChild(hint);

      var wrap = document.createElement('div');
      wrap.className = 'img-wrap';
      var img = document.createElement('img');
      img.src = 'data:image/png;base64,' + v.imageBase64;
      img.alt = v.project + ' baseline candidate';
      var overlay = document.createElement('div');
      overlay.className = 'overlay-layer';
      wrap.appendChild(img); wrap.appendChild(overlay);
      card.appendChild(wrap);

      function mkModeBtn(label, mode) {
        var b = document.createElement('button');
        b.className = 'mode-btn'; b.textContent = label; b.type = 'button';
        b.onclick = function () {
          [browseBtn, pinBtn, excBtn].forEach(function (x) { x.classList.remove('active'); });
          b.classList.add('active');
          wrap.__setMode(mode);
        };
        return b;
      }

      attachImageHandlers(wrap, img, overlay, v.project, v);
      img.onload = function () { renderOverlayMarkers(overlay, v.project, v); };
      if (img.complete) renderOverlayMarkers(overlay, v.project, v);

      var list = document.createElement('div');
      list.className = 'item-list';
      card.appendChild(list);

      root.appendChild(card);
      cardRefs[v.project] = { decisionBtns: decisionBtns, commentTa: ta, overlay: overlay, list: list, vpData: v };
    });
  }

  function refreshItemList(project) {
    var refs = cardRefs[project];
    var vp = state.viewports[project];
    refs.list.innerHTML = '';
    vp.pins.forEach(function (pin, idx) {
      var row = document.createElement('div'); row.className = 'item-row';
      row.innerHTML = '<span class="tags">#' + (idx + 1) + ' ' + escapeHtml(pin.tags.join(', ') || 'note') +
        (pin.comment ? ' — ' + escapeHtml(pin.comment) : '') + '</span>';
      var del = document.createElement('button'); del.textContent = '\\u2715';
      del.onclick = function () { vp.pins = vp.pins.filter(function (p) { return p.id !== pin.id; }); persistAndRefresh(); };
      row.appendChild(del); refs.list.appendChild(row);
    });
    vp.exceptions.forEach(function (exc) {
      var row = document.createElement('div'); row.className = 'item-row';
      row.innerHTML = '<span class="tags">exception: ' + escapeHtml(exc.reason) +
        (exc.comment ? ' — ' + escapeHtml(exc.comment) : '') + '</span>';
      var del = document.createElement('button'); del.textContent = '\\u2715';
      del.onclick = function () { vp.exceptions = vp.exceptions.filter(function (e) { return e.id !== exc.id; }); persistAndRefresh(); };
      row.appendChild(del); refs.list.appendChild(row);
    });
  }

  // Updates DOM to match current state — never touches <img> or re-runs the
  // (expensive, async-timing-dependent) image decode.
  function refresh() {
    var counts = summaryCounts();
    var s = cardRefs.__summary;
    s.label.textContent = counts.decided + ' / ' + counts.total + ' decided';
    s.count.textContent = counts.approved + ' approved \\u00b7 ' + counts.rejected + ' rejected';
    s.exportBtn.disabled = counts.decided < counts.total;

    DATA.viewports.forEach(function (v) {
      var refs = cardRefs[v.project];
      var vp = state.viewports[v.project];
      refs.decisionBtns.forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-value') === vp.decision);
      });
      var showComment = vp.decision === 'approve-comment' || vp.decision === 'reject-comment';
      refs.commentTa.style.display = showComment ? 'block' : 'none';
      if (document.activeElement !== refs.commentTa) refs.commentTa.value = vp.comment || '';
      renderOverlayMarkers(refs.overlay, v.project, refs.vpData);
      refreshItemList(v.project);
    });
  }

  function saveOnly() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function persistAndRefresh() { saveOnly(); refresh(); }

  buildAll();
  refresh();
})();
`;

const manifest = readManifest();
const viewports = buildViewports(manifest);
const html = render(manifest, viewports);
fs.writeFileSync(OUT_FILE, html);
console.log(`[generate-baseline-review] Wrote ${OUT_FILE} (${(html.length / 1024 / 1024).toFixed(2)} MB)`);
