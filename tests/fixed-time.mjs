// Single source of truth for the deterministic clock used by visual-regression
// baseline capture AND the permanent gate. Both MUST use the same instant, or
// baseline candidates and future gate runs render different live-status banner
// text (see app.js renderLiveStatus()) and every diff becomes a false positive.
//
// Saturday 12:30pm — Lunch Buffet session is active, so the banner shows real
// pricing/hours content rather than the Friday-closure message, which is the
// more representative state for a baseline.
export const BASELINE_FIXED_TIME = '2026-08-29T12:30:00+08:00';
