import React, { useState, useEffect, useRef } from "react";

// ─── Inline SVG Icons (no dependencies) ──────────────────────────────────────
const Icon = ({ d, size = 18, stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  dumbbell:    "M6.5 6.5h11M6.5 17.5h11M3 9.5l3-3m0 11-3-3m18-5-3-3m0 11 3-3M9 12h6",
  calPlus:     "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM12 15v-4m-2 2h4",
  calDays:     "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01",
  pencil:      "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:       "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  share:       "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
  play:        "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM10 8l6 4-6 4V8z",
  skip:        "M5 4l10 8-10 8V4zM19 4v16",
  check:       "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM7 12l3 3 7-7",
  video:       "M23 7l-7 5 7 5V7zM1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  users:       "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  tag:         "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  plus:        "M12 5v14M5 12h14",
  x:           "M18 6 6 18M6 6l12 12",
  chevDown:    "M6 9l6 6 6-6",
  chevUp:      "M18 15l-6-6-6 6",
};

const Ico = ({ name, size = 18 }) => <Icon d={Icons[name]} size={size} />;

// ─── Palette ──────────────────────────────────────────────────────────────────
const LOGO = "/KMBA-Panthers-Logo_U8_Tier_1.png";

// ─── Compressed URL encoding ──────────────────────────────────────────────────
function encodePlan(plan) {
  try {
    const slim = {
      d: plan.date,
      s: plan.start,
      x: (plan.drills || []).map(dr => ({
        n: dr.name, c: dr.category, p: dr.players,
        t: dr.notes || "", v: dr.video || "",
      }))
    };
    return btoa(encodeURIComponent(JSON.stringify(slim)))
      .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  } catch { return ""; }
}
function decodePlan(str) {
  try {
    const padded = str.replace(/-/g, "+").replace(/_/g, "/");
    const slim = JSON.parse(decodeURIComponent(atob(padded)));
    return {
      date: slim.d, start: slim.s,
      drills: (slim.x || []).map((dr, i) => ({
        id: i, name: dr.n, category: dr.c,
        players: dr.p, notes: dr.t, video: dr.v,
      }))
    };
  } catch { return null; }
}
function shareUrl(plan) {
  return `${window.location.href.split("?")[0]}?p=${encodePlan(plan)}`;
}

// ─── Storage ──────────────────────────────────────────────────────────────────
const load = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const save = (k, v)  => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(h, m) {
  const s = h >= 12 ? "PM" : "AM", hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, "0")} ${s}`;
}
function buildSchedule(start = "17:00", drills = []) {
  const [h, m] = start.split(":").map(Number);
  let hr = h, mn = m;
  const blocks = [];
  function add(mins, label, drill = null) {
    const t = hr * 60 + mn + mins, eH = Math.floor(t / 60) % 24, eM = t % 60;
    blocks.push({ start: fmt(hr, mn), end: fmt(eH, eM), label, dur: mins, drill });
    hr = eH; mn = eM;
  }
  add(15, "Warmup");
  drills.forEach(d => add(20, d.name, d));
  add(15, "Cool Down");
  return blocks;
}
function dateLabel(str) {
  if (!str) return "";
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}
function useToast() {
  const [msg, setMsg] = useState(null);
  const show = t => { setMsg(t); setTimeout(() => setMsg(null), 2600); };
  return { msg, show };
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #090e1a; font-family: 'Source Sans 3', sans-serif; color: #f0f4f8; min-height: 100vh; }

.app { min-height: 100vh; display: flex; flex-direction: column; max-width: 680px; margin: 0 auto; }

/* Top bar */
.top-bar {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px; border-bottom: 1px solid rgba(95,141,181,0.18);
  background: #090e1a; position: sticky; top: 0; z-index: 50;
}
.top-bar img { width: 46px; height: 46px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(95,141,181,0.4)); }
.top-bar-title { font-family: 'Oswald', sans-serif; font-size: 18px; font-weight: 700; color: #f0f4f8; line-height: 1; }
.top-bar-sub { font-size: 11px; color: rgba(95,141,181,0.85); text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px; }

/* Scroll area */
.scroll-area { flex: 1; overflow-y: auto; padding: 20px 16px 96px; }

/* Bottom nav */
.bottom-nav {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 680px;
  background: #111827; border-top: 1px solid rgba(95,141,181,0.2);
  display: flex; z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.nav-tab {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 11px 8px 9px; background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.3); font-family: 'Source Sans 3', sans-serif;
  font-size: 11px; font-weight: 500; transition: color 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.nav-tab:hover { color: rgba(255,255,255,0.6); }
.nav-tab.active { color: #5f8db5; }

/* Page headers */
.section-title { font-family: 'Oswald', sans-serif; font-size: 22px; font-weight: 600; color: #f0f4f8; margin-bottom: 3px; }
.section-sub { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 18px; }

/* Cards */
.card { background: #111827; border-radius: 14px; border: 1px solid rgba(95,141,181,0.18); padding: 18px; margin-bottom: 12px; }
.card-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.35); margin-bottom: 14px; }

/* Forms */
.field { margin-bottom: 14px; }
.label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.9px; color: rgba(255,255,255,0.38); display: block; margin-bottom: 6px; }
.input, .select, .textarea {
  width: 100%; padding: 11px 13px;
  background: rgba(255,255,255,0.05); border: 1.5px solid rgba(95,141,181,0.22);
  border-radius: 9px; font-family: 'Source Sans 3', sans-serif;
  font-size: 15px; color: #f0f4f8; transition: border-color 0.15s, box-shadow 0.15s;
}
.textarea { resize: vertical; min-height: 80px; }
.input::placeholder, .textarea::placeholder { color: rgba(255,255,255,0.22); }
.input:focus, .select:focus, .textarea:focus {
  outline: none; border-color: #5f8db5; box-shadow: 0 0 0 3px rgba(95,141,181,0.15);
}
.select {
  appearance: none; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235f8db5' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center;
  background-color: rgba(255,255,255,0.05);
}
.select option { background: #111827; color: #f0f4f8; }
.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  padding: 11px 20px; border-radius: 9px; border: none;
  font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 0.15s; -webkit-tap-highlight-color: transparent;
}
.btn-primary { background: #5f8db5; color: #fff; }
.btn-primary:hover { background: #3d6a94; }
.btn-ghost { background: transparent; color: rgba(255,255,255,0.5); border: 1.5px solid rgba(255,255,255,0.14); }
.btn-ghost:hover { border-color: #5f8db5; color: #5f8db5; }
.btn-full { width: 100%; }
.btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }

/* Icon buttons */
.icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: 8px;
  border: 1.5px solid rgba(255,255,255,0.1);
  background: transparent; cursor: pointer;
  color: rgba(255,255,255,0.45); transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.icon-btn:hover { border-color: #5f8db5; color: #5f8db5; }
.icon-btn.danger:hover { border-color: #e05252; color: #e05252; }

/* Drill items */
.drill-item {
  background: #111827; border: 1.5px solid rgba(95,141,181,0.18);
  border-radius: 12px; padding: 16px; margin-bottom: 10px;
  transition: border-color 0.15s;
}
.drill-item:hover { border-color: rgba(95,141,181,0.4); }
.drill-item-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.drill-name { font-family: 'Oswald', sans-serif; font-size: 18px; font-weight: 600; color: #f0f4f8; margin-bottom: 6px; }
.chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
.chip {
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(95,141,181,0.14); color: #c2d9ed;
  border-radius: 5px; padding: 3px 9px; font-size: 12px; font-weight: 600;
}
.drill-notes { list-style: none; padding: 0; margin-top: 4px; }
.drill-notes li { font-size: 13px; color: rgba(255,255,255,0.55); padding: 2px 0; }
.drill-notes li::before { content: "· "; color: #5f8db5; font-weight: 700; }
.drill-actions { display: flex; gap: 7px; flex-shrink: 0; }

/* Drill picker */
.pick-item {
  background: #111827; border: 1.5px solid rgba(95,141,181,0.18);
  border-radius: 11px; padding: 13px 15px; margin-bottom: 9px;
  display: flex; align-items: center; gap: 13px;
  cursor: pointer; transition: all 0.15s; user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.pick-item:hover { border-color: rgba(95,141,181,0.4); }
.pick-item.picked { border-color: #5f8db5; background: rgba(95,141,181,0.08); }
.pick-circle {
  width: 24px; height: 24px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.18);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-size: 12px; font-weight: 700;
  transition: all 0.15s; color: transparent;
}
.pick-item.picked .pick-circle { background: #5f8db5; border-color: #5f8db5; color: #fff; }
.pick-info { flex: 1; }
.pick-name { font-weight: 600; font-size: 15px; color: #f0f4f8; }
.pick-sub  { font-size: 12px; color: rgba(255,255,255,0.38); margin-top: 2px; }
.pick-num  { font-family: 'Oswald', sans-serif; font-size: 18px; font-weight: 700; color: #5f8db5; }

/* Timeline */
.tl { margin-top: 10px; }
.tl-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.tl-row:last-child { border-bottom: none; }
.tl-dot { width: 7px; height: 7px; border-radius: 50%; background: #5f8db5; flex-shrink: 0; }
.tl-time { font-size: 12px; font-weight: 600; color: #5f8db5; width: 130px; flex-shrink: 0; }
.tl-label { font-size: 14px; color: rgba(255,255,255,0.75); }

/* Plan card */
.plan-card { background: #111827; border: 1.5px solid rgba(95,141,181,0.18); border-radius: 14px; padding: 18px; margin-bottom: 12px; }
.plan-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; gap: 12px; }
.plan-date { font-family: 'Oswald', sans-serif; font-size: 18px; font-weight: 600; color: #f0f4f8; line-height: 1.15; }
.plan-time { font-size: 12px; color: rgba(255,255,255,0.38); margin-top: 3px; }
.plan-actions { display: flex; gap: 7px; flex-shrink: 0; }

/* Misc */
.divider-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.3px; color: rgba(255,255,255,0.28); margin: 18px 0 10px; }
.empty { text-align: center; padding: 52px 24px; color: rgba(255,255,255,0.28); }
.empty svg { margin-bottom: 12px; }
.empty p { font-size: 14px; line-height: 1.6; }

/* Modal / bottom sheet */
.overlay { position: fixed; inset: 0; background: rgba(6,10,20,0.78); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
.modal {
  background: #111827; border-radius: 20px 20px 0 0;
  border: 1px solid rgba(95,141,181,0.2); border-bottom: none;
  padding: 22px 18px 36px; width: 100%; max-width: 680px;
  max-height: 88vh; overflow-y: auto;
  box-shadow: 0 -16px 48px rgba(6,10,20,0.5);
}
.modal-handle { width: 38px; height: 4px; background: rgba(255,255,255,0.14); border-radius: 2px; margin: 0 auto 18px; }
.modal-title { font-family: 'Oswald', sans-serif; font-size: 20px; color: #f0f4f8; margin-bottom: 16px; }

/* Toast */
.toast {
  position: fixed; bottom: 84px; left: 50%; transform: translateX(-50%);
  background: #1a2540; border: 1px solid #5f8db5; color: #f0f4f8;
  padding: 10px 20px; border-radius: 40px; font-size: 14px; font-weight: 500;
  white-space: nowrap; box-shadow: 0 8px 24px rgba(6,10,20,0.4);
  z-index: 500; animation: toastIn 0.2s ease;
}
@keyframes toastIn { from { transform: translateX(-50%) translateY(8px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }

/* ══════════════════════════════════════════════
   MOBILE / SHARE VIEW
══════════════════════════════════════════════ */
.mv-shell { min-height: 100vh; background: #090e1a; font-family: 'Source Sans 3', sans-serif; }

.mv-header {
  background: linear-gradient(160deg, #090e1a 0%, #111827 100%);
  padding: 18px; border-bottom: 2px solid #5f8db5;
  display: flex; align-items: center; gap: 14px;
}
.mv-logo { width: 64px; height: 64px; object-fit: contain; flex-shrink: 0; filter: drop-shadow(0 2px 8px rgba(95,141,181,0.4)); }
.mv-team { font-family: 'Oswald', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: #5f8db5; margin-bottom: 3px; }
.mv-date { font-family: 'Oswald', sans-serif; font-size: 20px; font-weight: 700; color: #fff; line-height: 1.15; }
.mv-kick { font-size: 13px; color: rgba(255,255,255,0.48); margin-top: 4px; }

.mv-start-wrap { padding: 14px 18px; background: rgba(95,141,181,0.07); border-bottom: 1px solid rgba(95,141,181,0.18); display: flex; justify-content: center; }
.mv-start-btn {
  display: flex; align-items: center; gap: 9px;
  background: #5f8db5; color: #fff; border: none; border-radius: 10px;
  padding: 13px 36px; font-family: 'Oswald', sans-serif; font-size: 18px; font-weight: 600;
  cursor: pointer; transition: background 0.15s; box-shadow: 0 4px 20px rgba(95,141,181,0.3);
}
.mv-start-btn:hover { background: #3d6a94; }

.mv-timer {
  background: #5f8db5; padding: 12px 18px;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
}
.mv-timer-block-name { font-family: 'Oswald', sans-serif; font-size: 15px; font-weight: 600; color: #fff; }
.mv-timer-of { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 1px; }
.mv-timer-digits { font-family: 'Oswald', sans-serif; font-size: 32px; font-weight: 700; color: #fff; letter-spacing: 2px; text-align: center; }
.mv-timeup { font-size: 10px; font-weight: 700; color: #ffe0e0; text-align: center; margin-top: 1px; }
.mv-next-btn {
  display: flex; align-items: center; gap: 6px;
  background: rgba(0,0,0,0.25); color: #fff; border: none;
  border-radius: 8px; padding: 9px 14px;
  font-family: 'Oswald', sans-serif; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: background 0.15s; white-space: nowrap;
}
.mv-next-btn:hover { background: rgba(0,0,0,0.4); }
.mv-next-btn.finish { background: #3dba7a; }

.mv-prog-wrap { height: 4px; background: rgba(255,255,255,0.15); }
.mv-prog-fill { height: 4px; background: #fff; transition: width 1s linear; }

.mv-blocks { padding: 12px 14px 48px; }

.mv-block {
  background: rgba(255,255,255,0.04); border-radius: 12px; margin-bottom: 9px;
  border: 1.5px solid rgba(255,255,255,0.07); overflow: hidden; transition: border-color 0.2s;
}
.mv-block.current { border-color: #5f8db5; background: rgba(95,141,181,0.07); box-shadow: 0 0 0 3px rgba(95,141,181,0.15); }
.mv-block.done { opacity: 0.38; }

.mv-block-hd { display: flex; align-items: center; gap: 11px; padding: 13px 15px; cursor: pointer; }
.mv-idx {
  width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.08);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 700;
  color: rgba(255,255,255,0.5); flex-shrink: 0;
}
.mv-block.current .mv-idx { background: #5f8db5; color: #fff; }
.mv-block.done    .mv-idx { background: #3dba7a; color: #fff; }
.mv-block-info { flex: 1; min-width: 0; }
.mv-block-name { font-family: 'Oswald', sans-serif; font-size: 17px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mv-block.current .mv-block-name { color: #c2d9ed; }
.mv-block-time { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 2px; }
.mv-block-dur { font-size: 13px; color: rgba(255,255,255,0.3); flex-shrink: 0; display: flex; align-items: center; gap: 3px; }

.mv-block-detail { padding: 0 15px 14px 54px; border-top: 1px solid rgba(255,255,255,0.06); }
.mv-dl { margin-top: 10px; }
.mv-dl-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(255,255,255,0.3); margin-bottom: 6px; }
.mv-chips { display: flex; gap: 7px; flex-wrap: wrap; }
.mv-chip { display: flex; align-items: center; gap: 4px; background: rgba(95,141,181,0.18); color: #c2d9ed; border-radius: 5px; padding: 3px 9px; font-size: 12px; font-weight: 600; }
.mv-notes { list-style: none; padding: 0; }
.mv-notes li { font-size: 13px; color: rgba(255,255,255,0.75); padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.mv-notes li:last-child { border-bottom: none; }
.mv-notes li::before { content: "· "; color: #5f8db5; font-weight: 700; }
.mv-vid {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(95,141,181,0.14); border: 1px solid rgba(95,141,181,0.28);
  border-radius: 7px; padding: 8px 13px; color: #c2d9ed;
  text-decoration: none; font-size: 13px; font-weight: 500;
  margin-top: 10px; transition: background 0.15s;
}
.mv-vid:hover { background: rgba(95,141,181,0.25); }

.mv-done {
  margin: 0 14px 14px;
  background: linear-gradient(135deg, rgba(61,186,122,0.12), rgba(26,120,74,0.18));
  border: 1px solid rgba(61,186,122,0.35); border-radius: 14px;
  padding: 24px; text-align: center;
}
.mv-done-logo { width: 68px; height: 68px; object-fit: contain; margin-bottom: 10px; }
.mv-done-title { font-family: 'Oswald', sans-serif; font-size: 24px; font-weight: 700; color: #fff; }
.mv-done-sub { font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 6px; }

@media (max-width: 400px) {
  .mv-date { font-size: 17px; }
  .mv-timer-digits { font-size: 26px; }
}

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(95,141,181,0.3); border-radius: 3px; }
`;

// ─── MOBILE VIEW ──────────────────────────────────────────────────────────────
function MobileView({ plan }) {
  const blocks    = buildSchedule(plan.start || "17:00", plan.drills || []);
  const totalMins = blocks.reduce((s, b) => s + b.dur, 0);

  const [started, setStarted] = useState(false);
  const [cur,     setCur]     = useState(0);
  const [secs,    setSecs]    = useState(0);
  const [running, setRunning] = useState(false);
  const [open,    setOpen]    = useState(null);
  const [done,    setDone]    = useState(false);
  const iRef = useRef(null);

  function launch(i) {
    clearInterval(iRef.current);
    setCur(i); setSecs(blocks[i].dur * 60); setRunning(true); setOpen(i);
  }
  function start() { setStarted(true); launch(0); }
  function next()  {
    clearInterval(iRef.current);
    const n = cur + 1;
    if (n < blocks.length) launch(n); else { setRunning(false); setDone(true); }
  }
  useEffect(() => {
    if (!running) return;
    iRef.current = setInterval(() => setSecs(s => s <= 1 ? (clearInterval(iRef.current), 0) : s - 1), 1000);
    return () => clearInterval(iRef.current);
  }, [running, cur]);

  const mm     = Math.floor(secs / 60), ss = secs % 60;
  const dur    = started && !done ? blocks[cur].dur * 60 : 1;
  const prog   = started && !done ? ((dur - secs) / dur) * 100 : 0;
  const timeUp = started && !done && secs === 0;

  return (
    <div className="mv-shell">
      <div className="mv-header">
        <img src={LOGO} alt="Panthers" className="mv-logo" />
        <div>
          <div className="mv-team">Kitchener Panthers · U8 Tier 1</div>
          <div className="mv-date">{dateLabel(plan.date)}</div>
          <div className="mv-kick">
            {fmt(...(plan.start || "17:00").split(":").map(Number))} · {totalMins} min
          </div>
        </div>
      </div>

      {!started && (
        <div className="mv-start-wrap">
          <button className="mv-start-btn" onClick={start}>
            <Ico name="play" size={20} /> Start Practice Timer
          </button>
        </div>
      )}

      {started && !done && (
        <>
          <div className="mv-timer">
            <div>
              <div className="mv-timer-block-name">{blocks[cur].label}</div>
              <div className="mv-timer-of">Block {cur + 1} / {blocks.length}</div>
            </div>
            <div>
              <div className="mv-timer-digits">{String(mm).padStart(2,"0")}:{String(ss).padStart(2,"0")}</div>
              {timeUp && <div className="mv-timeup">TIME'S UP</div>}
            </div>
            <button className={`mv-next-btn${timeUp ? " finish" : ""}`} onClick={next}>
              <Ico name={cur < blocks.length - 1 ? "skip" : "check"} size={15} />
              {cur < blocks.length - 1 ? "Next" : "Finish"}
            </button>
          </div>
          <div className="mv-prog-wrap">
            <div className="mv-prog-fill" style={{ width: `${prog}%` }} />
          </div>
        </>
      )}

      <div className="mv-blocks">
        {done && (
          <div className="mv-done">
            <img src={LOGO} alt="Panthers" className="mv-done-logo" />
            <div className="mv-done-title">Practice Complete!</div>
            <div className="mv-done-sub">Great work, Kitchener Panthers!</div>
          </div>
        )}

        {blocks.map((b, i) => {
          const isCur = started && !done && i === cur;
          const isDone = started && (done || i < cur);
          const isOpen = open === i;
          const hasDr = !!b.drill;

          return (
            <div key={i} className={`mv-block${isCur ? " current" : ""}${isDone ? " done" : ""}`}>
              <div className="mv-block-hd" onClick={() => hasDr && setOpen(isOpen ? null : i)}>
                <div className="mv-idx">
                  {isDone ? <Ico name="check" size={14} /> : i + 1}
                </div>
                <div className="mv-block-info">
                  <div className="mv-block-name">{b.label}</div>
                  <div className="mv-block-time">{b.start} – {b.end}</div>
                </div>
                <div className="mv-block-dur">
                  {b.dur}m {hasDr && <Ico name={isOpen ? "chevUp" : "chevDown"} size={13} />}
                </div>
              </div>

              {hasDr && isOpen && (
                <div className="mv-block-detail">
                  <div className="mv-dl">
                    <div className="mv-chips">
                      <span className="mv-chip"><Ico name="tag" size={11} />{b.drill.category}</span>
                      <span className="mv-chip"><Ico name="users" size={11} />{b.drill.players} players</span>
                    </div>
                  </div>
                  {b.drill.notes && (
                    <div className="mv-dl">
                      <div className="mv-dl-label">Instructions</div>
                      <ul className="mv-notes">
                        {b.drill.notes.split("\n").filter(Boolean).map((n, j) => <li key={j}>{n}</li>)}
                      </ul>
                    </div>
                  )}
                  {b.drill.video && (
                    <a href={b.drill.video} target="_blank" rel="noopener noreferrer" className="mv-vid">
                      <Ico name="video" size={14} /> Watch Drill Video
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function PracticePlanner() {
  const today = new Date().toISOString().split("T")[0];
  const cats  = ["Hitting", "Fielding", "Throwing", "Base Running", "Warmup"];

  const [shared] = useState(() => {
    try { const p = new URLSearchParams(window.location.search).get("p"); return p ? decodePlan(p) : null; }
    catch { return null; }
  });

  useEffect(() => {
    let el = document.getElementById("pp-css");
    if (!el) { el = document.createElement("style"); el.id = "pp-css"; document.head.appendChild(el); }
    el.textContent = CSS;
  }, []);

  const [tab,    setTab]    = useState("drills");
  const [drills, setDrills] = useState(() => load("pp_drills", []));
  const [plans,  setPlans]  = useState(() => load("pp_plans",  []));
  const toast = useToast();

  useEffect(() => save("pp_drills", drills), [drills]);
  useEffect(() => save("pp_plans",  plans),  [plans]);

  // Drill form
  const [editId,   setEditId]   = useState(null);
  const [dName,    setDName]    = useState("");
  const [dCat,     setDCat]     = useState("Hitting");
  const [dPlay,    setDPlay]    = useState(8);
  const [dNotes,   setDNotes]   = useState("");
  const [dVideo,   setDVideo]   = useState("");
  const [showForm, setShowForm] = useState(false);

  // Practice form
  const [pDate,  setPDate]  = useState(today);
  const [pTime,  setPTime]  = useState("17:00");
  const [picked, setPicked] = useState([]);

  // Edit plan modal
  const [editPlan, setEditPlan] = useState(null);
  const [ePDate,   setEPDate]   = useState("");
  const [ePTime,   setEPTime]   = useState("");
  const [ePicked,  setEPicked]  = useState([]);

  if (shared) return <MobileView plan={shared} />;

  // ── Drill fns ──
  function resetForm() { setEditId(null); setDName(""); setDCat("Hitting"); setDPlay(8); setDNotes(""); setDVideo(""); setShowForm(false); }
  function openEdit(d) { setEditId(d.id); setDName(d.name); setDCat(d.category); setDPlay(d.players); setDNotes(d.notes || ""); setDVideo(d.video || ""); setShowForm(true); }
  function saveDrill() {
    if (!dName.trim()) return toast.show("Enter a drill name");
    const dr = { id: editId || Date.now(), name: dName.trim(), category: dCat, players: dPlay, notes: dNotes, video: dVideo };
    setDrills(prev => editId ? prev.map(d => d.id === editId ? dr : d) : [...prev, dr]);
    toast.show(editId ? "Drill updated" : "Drill saved");
    resetForm();
  }
  function delDrill(id) {
    if (!window.confirm("Delete this drill?")) return;
    setDrills(prev => prev.filter(d => d.id !== id));
    toast.show("Drill deleted");
  }

  // ── Practice fns ──
  function togglePick(d) {
    setPicked(prev => prev.find(p => p.id === d.id)
      ? prev.filter(p => p.id !== d.id)
      : prev.length >= 3 ? (toast.show("Max 3 drills"), prev)
      : [...prev, d]);
  }
  function savePractice() {
    if (!picked.length) return toast.show("Pick at least one drill");
    setPlans(prev => [{ id: Date.now(), date: pDate, start: pTime, drills: picked }, ...prev]);
    setPicked([]); setPDate(today); setPTime("17:00");
    toast.show("Practice saved"); setTab("plans");
  }
  function delPlan(id) {
    if (!window.confirm("Delete this plan?")) return;
    setPlans(prev => prev.filter(p => p.id !== id));
    toast.show("Deleted");
  }
  function openEditPlan(p) { setEditPlan(p); setEPDate(p.date); setEPTime(p.start); setEPicked([...p.drills]); }
  function toggleEPick(d) {
    setEPicked(prev => prev.find(p => p.id === d.id)
      ? prev.filter(p => p.id !== d.id)
      : prev.length >= 3 ? (toast.show("Max 3 drills"), prev)
      : [...prev, d]);
  }
  function saveEditPlan() {
    if (!ePicked.length) return toast.show("Pick at least one drill");
    setPlans(prev => prev.map(p => p.id === editPlan.id ? { ...p, date: ePDate, start: ePTime, drills: ePicked } : p));
    setEditPlan(null); toast.show("Practice updated");
  }
  function copyLink(plan) {
    const url = shareUrl(plan);
    navigator.clipboard.writeText(url).then(() => toast.show("Link copied! 📋")).catch(() => toast.show("Link: " + url));
  }

  const navTabs = [
    { id: "drills", label: "Drills",  icon: "dumbbell" },
    { id: "create", label: "Create",  icon: "calPlus"  },
    { id: "plans",  label: "Plans",   icon: "calDays"  },
  ];

  return (
    <div className="app">
      {/* Top bar */}
      <div className="top-bar">
        <img src={LOGO} alt="Panthers" />
        <div>
          <div className="top-bar-title">Panthers Planner</div>
          <div className="top-bar-sub">U8 Tier 1 · Kitchener</div>
        </div>
      </div>

      {/* Page content */}
      <div className="scroll-area">

        {/* ══ DRILLS ══════════════════════════════════════════════ */}
        {tab === "drills" && (
          <>
            <div className="section-title">Drill Library</div>
            <div className="section-sub">Build and manage your team's drills</div>

            {!showForm && (
              <button className="btn btn-primary btn-full" style={{ marginBottom: 16 }}
                onClick={() => { resetForm(); setShowForm(true); }}>
                <Ico name="plus" size={16} /> Add New Drill
              </button>
            )}

            {showForm && (
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-title">{editId ? "Edit Drill" : "New Drill"}</div>
                <div className="field">
                  <label className="label">Drill Name</label>
                  <input className="input" placeholder="e.g. Tee Work" value={dName} onChange={e => setDName(e.target.value)} />
                </div>
                <div className="row2" style={{ marginBottom: 14 }}>
                  <div>
                    <label className="label">Category</label>
                    <select className="select" value={dCat} onChange={e => setDCat(e.target.value)}>
                      {cats.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Players</label>
                    <select className="select" value={dPlay} onChange={e => setDPlay(Number(e.target.value))}>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Instructions (one per line)</label>
                  <textarea className="textarea" placeholder={"Keep your eye on the ball\nFollow through on your swing"} value={dNotes} onChange={e => setDNotes(e.target.value)} />
                </div>
                <div className="field">
                  <label className="label">Video Link (optional)</label>
                  <input className="input" placeholder="https://youtube.com/..." value={dVideo} onChange={e => setDVideo(e.target.value)} />
                </div>
                <div className="btn-row">
                  <button className="btn btn-primary" onClick={saveDrill}>{editId ? "Update" : "Save Drill"}</button>
                  <button className="btn btn-ghost" onClick={resetForm}><Ico name="x" size={15} /> Cancel</button>
                </div>
              </div>
            )}

            {drills.length === 0 && !showForm && (
              <div className="empty">
                <Ico name="dumbbell" size={38} />
                <p>No drills yet.<br />Tap Add to create your first.</p>
              </div>
            )}

            {drills.map(d => (
              <div key={d.id} className="drill-item">
                <div className="drill-item-header">
                  <div style={{ flex: 1 }}>
                    <div className="drill-name">{d.name}</div>
                    <div className="chips">
                      <span className="chip"><Ico name="tag" size={11} />{d.category}</span>
                      <span className="chip"><Ico name="users" size={11} />{d.players} players</span>
                    </div>
                    {d.notes && (
                      <ul className="drill-notes">
                        {d.notes.split("\n").filter(Boolean).slice(0, 3).map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    )}
                    {d.video && (
                      <a href={d.video} target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#5f8db5", marginTop: 6, textDecoration: "none" }}>
                        <Ico name="video" size={13} /> Watch video
                      </a>
                    )}
                  </div>
                  <div className="drill-actions">
                    <button className="icon-btn" onClick={() => openEdit(d)} title="Edit"><Ico name="pencil" size={15} /></button>
                    <button className="icon-btn danger" onClick={() => delDrill(d.id)} title="Delete"><Ico name="trash" size={15} /></button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ══ CREATE ══════════════════════════════════════════════ */}
        {tab === "create" && (
          <>
            <div className="section-title">Create Practice</div>
            <div className="section-sub">Pick a date, time, and up to 3 drills</div>

            <div className="card">
              <div className="row2">
                <div>
                  <label className="label">Date</label>
                  <input type="date" className="input" value={pDate} onChange={e => setPDate(e.target.value)} />
                </div>
                <div>
                  <label className="label">Start Time</label>
                  <input type="time" className="input" value={pTime} onChange={e => setPTime(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="divider-label">Select Drills ({picked.length}/3)</div>

            {drills.length === 0 ? (
              <div className="empty" style={{ padding: "28px 0" }}>
                <Ico name="dumbbell" size={32} />
                <p>Add drills in the Drills tab first.</p>
              </div>
            ) : drills.map(d => {
              const sel = !!picked.find(p => p.id === d.id);
              const idx = picked.findIndex(p => p.id === d.id);
              return (
                <div key={d.id} className={`pick-item${sel ? " picked" : ""}`} onClick={() => togglePick(d)}>
                  <div className="pick-circle">{sel ? "✓" : ""}</div>
                  <div className="pick-info">
                    <div className="pick-name">{d.name}</div>
                    <div className="pick-sub">{d.category} · {d.players} players</div>
                  </div>
                  {sel && <div className="pick-num">#{idx + 1}</div>}
                </div>
              );
            })}

            {picked.length > 0 && (
              <>
                <div className="divider-label" style={{ marginTop: 20 }}>Schedule Preview</div>
                <div className="card">
                  <div className="tl">
                    {buildSchedule(pTime, picked).map((b, i) => (
                      <div key={i} className="tl-row">
                        <div className="tl-dot" />
                        <div className="tl-time">{b.start} – {b.end}</div>
                        <div className="tl-label">{b.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} onClick={savePractice}>
              <Ico name="calPlus" size={16} /> Save Practice Plan
            </button>
          </>
        )}

        {/* ══ PLANS ═══════════════════════════════════════════════ */}
        {tab === "plans" && (
          <>
            <div className="section-title">Practice Plans</div>
            <div className="section-sub">Tap the share icon to send coaches a mobile link with live timer</div>

            {plans.length === 0 ? (
              <div className="empty">
                <Ico name="calDays" size={38} />
                <p>No plans yet.<br />Create your first in the Create tab.</p>
              </div>
            ) : plans.map(p => (
              <div key={p.id} className="plan-card">
                <div className="plan-header">
                  <div>
                    <div className="plan-date">{dateLabel(p.date)}</div>
                    <div className="plan-time">{fmt(...(p.start || "17:00").split(":").map(Number))}</div>
                  </div>
                  <div className="plan-actions">
                    <button className="icon-btn" onClick={() => copyLink(p)} title="Share"><Ico name="share" size={15} /></button>
                    <button className="icon-btn" onClick={() => openEditPlan(p)} title="Edit"><Ico name="pencil" size={15} /></button>
                    <button className="icon-btn danger" onClick={() => delPlan(p.id)} title="Delete"><Ico name="trash" size={15} /></button>
                  </div>
                </div>
                <div className="tl">
                  {buildSchedule(p.start || "17:00", p.drills || []).map((b, i) => (
                    <div key={i} className="tl-row">
                      <div className="tl-dot" />
                      <div className="tl-time">{b.start} – {b.end}</div>
                      <div className="tl-label">{b.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Bottom nav */}
      <nav className="bottom-nav">
        {navTabs.map(({ id, label, icon }) => (
          <button key={id} className={`nav-tab${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>
            <Ico name={icon} size={22} />
            {label}
          </button>
        ))}
      </nav>

      {/* Edit plan bottom sheet */}
      {editPlan && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setEditPlan(null); }}>
          <div className="modal">
            <div className="modal-handle" />
            <div className="modal-title">Edit Practice</div>
            <div className="row2" style={{ marginBottom: 14 }}>
              <div>
                <label className="label">Date</label>
                <input type="date" className="input" value={ePDate} onChange={e => setEPDate(e.target.value)} />
              </div>
              <div>
                <label className="label">Time</label>
                <input type="time" className="input" value={ePTime} onChange={e => setEPTime(e.target.value)} />
              </div>
            </div>
            <div className="divider-label">Drills ({ePicked.length}/3)</div>
            {drills.map(d => {
              const sel = !!ePicked.find(p => p.id === d.id);
              return (
                <div key={d.id} className={`pick-item${sel ? " picked" : ""}`} onClick={() => toggleEPick(d)}>
                  <div className="pick-circle">{sel ? "✓" : ""}</div>
                  <div className="pick-info">
                    <div className="pick-name">{d.name}</div>
                    <div className="pick-sub">{d.category}</div>
                  </div>
                  {sel && <div className="pick-num">#{ePicked.findIndex(p => p.id === d.id) + 1}</div>}
                </div>
              );
            })}
            <div className="btn-row">
              <button className="btn btn-primary" onClick={saveEditPlan}>Save Changes</button>
              <button className="btn btn-ghost" onClick={() => setEditPlan(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast.msg && <div className="toast">{toast.msg}</div>}
    </div>
  );
}
