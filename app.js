let storeConfig = null;
let menuData = null;
let activeCategory = 'all';
let searchQuery = '';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Initialize Application
async function initApp() {
  try {
    const [storeRes, menuRes] = await Promise.all([
      fetch('./data/store.json').then(r => r.json()),
      fetch('./data/menu.json').then(r => r.json())
    ]);

    storeConfig = storeRes.store;
    menuData = menuRes;

    renderLiveStatus();
    renderMenuGrid();
    setupEventListeners();
    setupAmbienceToggle();
    setupCalculator();
  } catch (err) {
    console.error('Gagal memuat data kedai:', err);
  }
}

// Live Session Detection with Respectful Friday Solat Notice
function renderLiveStatus() {
  const now = new Date();
  const day = now.getDay(); // 0: Sun, 1: Mon, ..., 5: Fri, 6: Sat
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeNum = hour + minute / 60;

  const sessionLabel = $('[data-current-session-label]');
  const sessionHours = $('[data-current-session-hours]');
  const chipAdult = $('[data-chip-adult]');
  const chipChild = $('[data-chip-child]');

  if (day === 5) {
    // Friday
    sessionLabel.textContent = 'CUTI HARI INI (SOLAT JUMAAT & SANITASI)';
    sessionHours.textContent = 'Dibuka semula esok (Sabtu) seawal jam 6:00 AM';
    chipAdult.textContent = 'RM 19.90';
    chipChild.textContent = 'RM 15.90';
    return;
  }

  if (timeNum >= 6 && timeNum < 11 && (day === 0 || day === 6)) {
    // Weekend Breakfast
    sessionLabel.textContent = 'BUFET SARAPAN PAGI SEDANG DIBUKA';
    sessionHours.textContent = 'Dibuka sehingga 11:00 AM • Terus Walk-In';
    chipAdult.textContent = 'RM 15.90';
    chipChild.textContent = 'RM 12.90';
  } else if (timeNum >= 12 && timeNum < 16) {
    // Lunch
    sessionLabel.textContent = 'BUFET MAKAN TENGAH HARI SEDANG DIBUKA';
    sessionHours.textContent = 'Dibuka sehingga 4:00 PM • Terus Walk-In';
    chipAdult.textContent = 'RM 19.90';
    chipChild.textContent = 'RM 15.90';
  } else if (timeNum >= 17 && timeNum < 22) {
    // Dinner
    sessionLabel.textContent = 'BUFET MALAM & STESEN LIVE SEDANG DIBUKA';
    sessionHours.textContent = 'Dibuka sehingga 10:00 PM (Char Koay Teow Panas)';
    chipAdult.textContent = 'RM 19.90';
    chipChild.textContent = 'RM 15.90';
  } else {
    // Outside direct buffet window
    sessionLabel.textContent = 'PERSIAPAN SESI SETERUSNYA';
    sessionHours.textContent = 'Tengah Hari 12pm-4pm • Malam 5pm-10pm';
    chipAdult.textContent = 'RM 19.90';
    chipChild.textContent = 'RM 15.90';
  }
}

// Render Menu Cards
function renderMenuGrid() {
  const grid = $('[data-menu-grid]');
  if (!grid || !menuData) return;

  const items = menuData.items.filter(item => {
    const matchCat = activeCategory === 'all' || item.categoryId === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchQuery = !query || 
      item.name.toLowerCase().includes(query) ||
      (item.chineseName && item.chineseName.includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query));
    return matchCat && matchQuery;
  });

  if (items.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--pl-ink-muted);">
      <p style="font-size: 1.1rem; margin-bottom: 8px; color: var(--pl-ink);">Tiada hidangan dijumpai untuk "${searchQuery}"</p>
      <p style="font-size: 0.85rem;">Cuba cari "Char Koay Teow", "Udang Nestum", "Dim Sum", atau "Salted Egg".</p>
    </div>`;
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="menu-item-card" data-item-id="${item.id}">
      <div class="card-media">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
        <span class="card-badge-top">${item.badge || 'Pilihan Bufet'}</span>
      </div>
      <div class="card-body">
        <div class="item-name">${item.name}</div>
        ${item.chineseName ? `<div class="chinese-sub">${item.chineseName}</div>` : ''}
        <p class="item-desc">${item.description}</p>
        <div class="card-footer">
          <span class="session-label">${getSessionBadge(item.session, item.categoryId)}</span>
          <span class="all-you-can-eat">${item.categoryId === 'foodpanda-sets' ? 'DELIVERY DIRECT' : 'TANPA HAD <svg class="icon" aria-hidden="true"><use href="#icon-check"></use></svg>'}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Attach card click handlers for Modal Lightbox
  $$('.menu-item-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-item-id');
      const item = menuData.items.find(i => i.id === id);
      if (item) openItemModal(item);
    });
  });
}

function getSessionBadge(session, categoryId) {
  if (categoryId === 'foodpanda-sets') return 'FoodPanda 4.9★';
  if (session === 'dinner') return 'Malam (Stesen Live)';
  if (session === 'lunch') return 'Tengah Hari';
  if (session === 'breakfast') return 'Sarapan Weekend';
  return 'Semua Sesi Bufet';
}

// Lightbox Modal
function openItemModal(item) {
  const backdrop = $('[data-modal-backdrop]');
  const body = $('[data-modal-body]');
  
  body.innerHTML = `
    <div class="modal-media">
      <img src="${item.image}" alt="${item.name}" />
    </div>
    <div class="modal-info">
      <span class="eyebrow">${getSessionBadge(item.session, item.categoryId)}</span>
      <h2 id="modal-item-title" style="margin: 4px 0 2px 0;">${item.name}</h2>
      ${item.chineseName ? `<div class="chinese-sub" style="font-size: 1rem; margin-bottom: 12px;">${item.chineseName}</div>` : ''}
      <p style="color: var(--pl-ink-muted); font-size: 0.95rem; margin-bottom: 16px;">${item.description}</p>
      
      <div style="background: var(--pl-pine-card); padding: 14px; border-radius: var(--radius-sm); margin-bottom: 16px; border: 1px solid var(--pl-pine-border-subtle);">
        <div style="font-size: 0.85rem; color: var(--pl-amber-bright); font-weight: 700; margin-bottom: 4px;"><svg class="icon" aria-hidden="true"><use href="#icon-check"></use></svg> Jaminan Kualiti Cina Muslim:</div>
        <p style="font-size: 0.8rem; color: var(--pl-ink-muted);">Disediakan 100% Halal menggunakan bahan masakan segar tanpa sebarang perasa tiruan meragukan.</p>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <a class="button button-primary button-sm" href="#booking" onclick="document.querySelector('[data-modal-backdrop]').hidden = true;">Tempah Meja Rombongan</a>
        <a class="button button-foodpanda button-sm" href="${storeConfig.foodpandaUrl}" target="_blank" rel="noopener">Pesan di FoodPanda</a>
      </div>
    </div>
  `;

  backdrop.hidden = false;
}

// Event Listeners
function setupEventListeners() {
  // Category filter chips
  $$('[data-cat]').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('[data-cat]').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      activeCategory = chip.getAttribute('data-cat');
      renderMenuGrid();
    });
  });

  // Search input
  const searchInput = $('[data-search-input]');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderMenuGrid();
    });
  }

  // Session Card Buttons
  $$('[data-filter-session]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sess = btn.getAttribute('data-filter-session');
      let targetCat = 'all';
      if (sess === 'dinner') targetCat = 'live-stalls';
      if (sess === 'lunch') targetCat = 'lunch-mains';
      if (sess === 'breakfast') targetCat = 'breakfast-mains';

      const chip = $(`[data-cat="${targetCat}"]`);
      if (chip) chip.click();
      
      const menuSection = $('#menu');
      if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Modal Close
  const closeBtn = $('[data-modal-close]');
  const backdrop = $('[data-modal-backdrop]');
  if (closeBtn && backdrop) {
    closeBtn.addEventListener('click', () => backdrop.hidden = true);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.hidden = true;
    });
  }
}

// Group Booking Pax Calculator
function setupCalculator() {
  const sessionSelect = $('[data-pax-session]');
  const adultsInput = $('[data-pax-adults]');
  const childrenInput = $('[data-pax-children]');
  const totalDisplay = $('[data-calc-total]');
  const sendWaBtn = $('[data-send-group-wa]');

  const prices = {
    lunch: { adult: 19.90, child: 15.90, label: 'Bufet Makan Tengah Hari' },
    dinner: { adult: 19.90, child: 15.90, label: 'Bufet Malam & Stesen Live' },
    breakfast: { adult: 15.90, child: 12.90, label: 'Bufet Sarapan Pagi' }
  };

  function updateCalc() {
    const session = sessionSelect ? sessionSelect.value : 'lunch';
    const adults = Math.max(0, parseInt(adultsInput.value) || 0);
    const children = Math.max(0, parseInt(childrenInput.value) || 0);

    const price = prices[session] || prices.lunch;
    const total = (adults * price.adult) + (children * price.child);

    if (totalDisplay) {
      totalDisplay.textContent = `RM ${total.toFixed(2)}`;
    }
  }

  if (sessionSelect) sessionSelect.addEventListener('change', updateCalc);
  if (adultsInput) adultsInput.addEventListener('input', updateCalc);
  if (childrenInput) childrenInput.addEventListener('input', updateCalc);

  // Steppers
  $$('[data-step-adult]').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.getAttribute('data-step-adult'));
      const val = Math.max(0, (parseInt(adultsInput.value) || 0) + step);
      adultsInput.value = val;
      updateCalc();
    });
  });

  $$('[data-step-child]').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.getAttribute('data-step-child'));
      const val = Math.max(0, (parseInt(childrenInput.value) || 0) + step);
      childrenInput.value = val;
      updateCalc();
    });
  });

  // WhatsApp Group Booking Generator
  if (sendWaBtn) {
    sendWaBtn.addEventListener('click', () => {
      const session = sessionSelect ? sessionSelect.value : 'lunch';
      const adults = parseInt(adultsInput.value) || 0;
      const children = parseInt(childrenInput.value) || 0;
      const price = prices[session] || prices.lunch;
      const total = (adults * price.adult) + (children * price.child);

      const msg = `Assalamualaikum / Salam Sejahtera Pak Liew,%0A%0ASaya ingin membuat pertanyaan tempahan meja rombongan:%0A• Sesi: ${price.label}%0A• Bilangan: ${adults} Dewasa, ${children} Kanak-kanak%0A• Anggaran Jumlah: RM ${total.toFixed(2)}%0A%0AMohon maklumat kekosongan meja pada tarikh yang sesuai. Terima kasih!`;
      const waUrl = `https://wa.me/60162493449?text=${msg}`;
      window.open(waUrl, '_blank');
    });
  }

  updateCalc();
}

// Ambience Mode Toggle
function setupAmbienceToggle() {
  const btn = $('[data-ambience-toggle]');
  if (!btn) return;

  // Swap the icon's <use href> and the trailing text node in place rather
  // than btn.textContent/innerHTML -- keeps the sun/moon <svg class="icon">
  // markup intact instead of nuking and re-typing it as a string every click.
  const icon = btn.querySelector('[data-ambience-icon] use');

  btn.addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-mode') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-mode', next);
    if (icon) icon.setAttribute('href', next === 'dark' ? '#icon-moon' : '#icon-sun');
    btn.lastChild.textContent = next === 'dark' ? ' Gelap' : ' Cerah';
  });
}

/* Hero background rotator: crossfades the storefront still (Ken Burns drift,
   CSS-driven) with the dining-room/buffet clip. Same mechanism as Woodfire
   Premium's initHeroRotator() (arh-fnb-tier-showroom/premium/app.js) --
   a video's own "ended" event drives the advance, not a guessed timer, and
   prefers-reduced-motion skips starting it at all (CSS backstops this too,
   see styles.css). Independent of initApp()'s data fetch so the ambient
   background still runs even if store/menu data fails to load. */
function initHeroRotator() {
  const root = $('[data-hero-rotator]');
  if (!root) return;
  const layers = [...root.querySelectorAll('[data-hero-layer]')];
  if (!layers.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Lengthened from 6000ms and the clip below slowed to 0.55x -- the
  // rotator read as pacy rather than the calm, unhurried indie pace this
  // pass is going for (2026-08-26). 0.55x still read as a fast-forward
  // handheld pan next to the now-calm still, so slowed further to 0.4x in
  // the same pass -- the raw footage's own pan speed, not just the
  // rotator's crossfade/hold timing, was still the "too fast" complaint.
  const STILL_HOLD_MS = 9000;
  const CLIP_PLAYBACK_RATE = 0.4;
  layers.forEach((layer) => { if (layer.tagName === 'VIDEO') layer.playbackRate = CLIP_PLAYBACK_RATE; });

  let activeIndex = Math.max(0, layers.findIndex((el) => el.classList.contains('is-active')));
  let holdTimer = null;

  function advance() { activate((activeIndex + 1) % layers.length); }

  function activate(index) {
    const previous = layers[activeIndex];
    const next = layers[index];
    next.classList.add('is-active');
    previous.classList.remove('is-active');
    activeIndex = index;
    clearTimeout(holdTimer);
    if (previous.tagName === 'VIDEO') { previous.pause(); previous.currentTime = 0; }
    if (next.tagName === 'VIDEO') {
      next.currentTime = 0;
      next.playbackRate = CLIP_PLAYBACK_RATE; // some browsers reset this on currentTime=0 -- reassert it
      next.play().catch(advance); // couldn't play (e.g. still decoding) -- skip on rather than stall the rotation
    } else {
      holdTimer = setTimeout(advance, STILL_HOLD_MS);
    }
  }

  layers.forEach((layer) => { if (layer.tagName === 'VIDEO') layer.addEventListener('ended', advance); });
  holdTimer = setTimeout(advance, STILL_HOLD_MS);
}

document.addEventListener('DOMContentLoaded', initApp);
document.addEventListener('DOMContentLoaded', initHeroRotator);