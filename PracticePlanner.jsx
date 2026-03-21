import React, { useState, useEffect, useRef } from "react";

// ─── Theme — pulled from Panthers logo ───────────────────────────────────────
// Black: #0e0e0e  Steel blue: #5f8db5  Blue dark: #3d6a94  White: #ffffff
const T = {
  black:     "#0e0e0e",
  navy:      "#111827",
  steel:     "#5f8db5",       // logo's steel blue
  steelDark: "#3d6a94",       // darker steel for hover
  steelLight:"#c2d9ed",       // light tint
  steelPale: "#e8f1f8",       // very pale bg tint
  white:     "#ffffff",
  offWhite:  "#f5f7fa",
  border:    "#d4e2ef",
  text:      "#111827",
  muted:     "#5a7a96",
  danger:    "#c0392b",
  success:   "#1a7a4a",
};

const LOGO_PATH = "/KMBA-Panthers-Logo_U8_Tier_1.png";

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f0f4f8; font-family: 'Source Sans 3', sans-serif; color: #111827; }

  /* ══ SHELL ══════════════════════════════════════════════════════ */
  .pp-shell { display: flex; min-height: 100vh; }

  /* ══ SIDEBAR ════════════════════════════════════════════════════ */
  .pp-sidebar {
    width: 230px;
    background: linear-gradient(180deg, #0a0f1a 0%, #111827 60%, #0e1520 100%);
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; height: 100vh; z-index: 100;
    border-right: 1px solid rgba(95,141,181,0.2);
  }

  .pp-logo {
    padding: 20px 16px 16px;
    display: flex; flex-direction: column; align-items: center;
    border-bottom: 1px solid rgba(95,141,181,0.15);
  }
  .pp-logo img {
    width: 130px; height: 130px; object-fit: contain;
    filter: drop-shadow(0 4px 16px rgba(95,141,181,0.35));
    transition: filter 0.3s;
  }
  .pp-logo img:hover { filter: drop-shadow(0 4px 24px rgba(95,141,181,0.55)); }
  .pp-logo-sub {
    font-size: 10px; color: rgba(255,255,255,0.35);
    margin-top: 8px; text-transform: uppercase; letter-spacing: 1.5px;
    text-align: center;
  }

  .pp-nav { flex: 1; padding: 12px 0; }
  .pp-nav-btn {
    display: flex; align-items: center; gap: 11px;
    width: 100%; padding: 13px 20px; background: none; border: none;
    cursor: pointer; color: rgba(255,255,255,0.55);
    font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 500;
    text-align: left; transition: background 0.15s, color 0.15s;
    border-left: 3px solid transparent;
  }
  .pp-nav-btn:hover { background: rgba(95,141,181,0.1); color: #fff; }
  .pp-nav-btn.active {
    background: rgba(95,141,181,0.15);
    color: #5f8db5;
    border-left-color: #5f8db5;
    font-weight: 600;
  }
  .pp-nav-icon { font-size: 16px; width: 20px; text-align: center; }

  /* ══ MAIN ═══════════════════════════════════════════════════════ */
  .pp-main { margin-left: 230px; flex: 1; padding: 36px 40px; max-width: 980px; }
  .pp-page-header { margin-bottom: 28px; }
  .pp-page-title {
    font-family: 'Oswald', sans-serif; font-size: 30px; font-weight: 700;
    color: #111827;
    display: flex; align-items: center; gap: 10px;
  }
  .pp-page-title-accent { color: #5f8db5; }
  .pp-page-sub { font-size: 14px; color: #5a7a96; margin-top: 4px; }

  /* ══ CARDS ══════════════════════════════════════════════════════ */
  .pp-card {
    background: #fff; border-radius: 10px;
    border: 1px solid #d4e2ef;
    padding: 22px 24px; margin-bottom: 16px;
    box-shadow: 0 2px 10px rgba(95,141,181,0.07);
  }

  /* ══ FORMS ══════════════════════════════════════════════════════ */
  .pp-label {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.9px; color: #5a7a96; display: block; margin-bottom: 6px;
  }
  .pp-input, .pp-select, .pp-textarea {
    width: 100%; padding: 10px 12px; border: 1.5px solid #d4e2ef;
    border-radius: 7px; font-family: 'Source Sans 3', sans-serif;
    font-size: 15px; color: #111827; background: #fff;
    transition: border-color 0.15s, box-shadow 0.15s; margin-bottom: 16px;
  }
  .pp-textarea { resize: vertical; min-height: 90px; }
  .pp-input:focus, .pp-select:focus, .pp-textarea:focus {
    outline: none; border-color: #5f8db5;
    box-shadow: 0 0 0 3px rgba(95,141,181,0.15);
  }
  .pp-select {
    appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235a7a96' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
  }
  .pp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .pp-form-group .pp-input, .pp-form-group .pp-select { margin-bottom: 0; }

  /* ══ BUTTONS ════════════════════════════════════════════════════ */
  .pp-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 7px; border: none;
    font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
  }
  .pp-btn-primary { background: #5f8db5; color: #fff; }
  .pp-btn-primary:hover { background: #3d6a94; }
  .pp-btn-dark { background: #111827; color: #fff; }
  .pp-btn-dark:hover { background: #0a0f1a; }
  .pp-btn-ghost { background: transparent; color: #5a7a96; border: 1.5px solid #d4e2ef; }
  .pp-btn-ghost:hover { border-color: #5f8db5; color: #5f8db5; }
  .pp-btn-success { background: #1a7a4a; color: #fff; }
  .pp-btn-success:hover { background: #145c38; }
  .pp-btn-danger { background: transparent; color: #c0392b; border: 1.5px solid rgba(192,57,43,0.25); padding: 6px 12px; font-size: 13px; }
  .pp-btn-danger:hover { background: rgba(192,57,43,0.06); }
  .pp-btn-sm { padding: 6px 12px; font-size: 13px; }
  .pp-btn-row { display: flex; gap: 10px; margin-top: 4px; flex-wrap: wrap; }

  /* ══ DRILL CARDS ════════════════════════════════════════════════ */
  .pp-drill-card {
    background: #fff; border: 1.5px solid #d4e2ef; border-radius: 10px;
    padding: 18px 20px; margin-bottom: 12px;
    display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .pp-drill-card:hover { border-color: #5f8db5; box-shadow: 0 3px 12px rgba(95,141,181,0.12); }
  .pp-drill-name { font-family: 'Oswald', sans-serif; font-size: 17px; font-weight: 600; color: #111827; margin-bottom: 5px; }
  .pp-drill-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
  .pp-badge { background: #e8f1f8; color: #3d6a94; border-radius: 4px; padding: 2px 9px; font-size: 12px; font-weight: 600; }
  .pp-badge-dark { background: rgba(17,24,39,0.08); color: #111827; }
  .pp-drill-notes { font-size: 13px; color: #5a7a96; list-style: none; padding: 0; }
  .pp-drill-notes li { padding: 2px 0; }
  .pp-drill-notes li::before { content: "· "; color: #5f8db5; font-weight: 700; font-size: 16px; }
  .pp-drill-actions { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }

  /* ══ DRILL PICKER ═══════════════════════════════════════════════ */
  .pp-drill-pick {
    background: #fff; border: 1.5px solid #d4e2ef; border-radius: 9px;
    padding: 14px 18px; margin-bottom: 10px;
    display: flex; justify-content: space-between; align-items: center;
    cursor: pointer; transition: all 0.15s; user-select: none;
  }
  .pp-drill-pick:hover { border-color: #5f8db5; }
  .pp-drill-pick.selected { border-color: #5f8db5; background: rgba(95,141,181,0.05); }
  .pp-drill-pick-info { display: flex; align-items: center; gap: 12px; }
  .pp-drill-pick-check {
    width: 22px; height: 22px; border-radius: 50%; border: 2px solid #d4e2ef;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; flex-shrink: 0; transition: all 0.15s;
  }
  .pp-drill-pick.selected .pp-drill-pick-check {
    background: #5f8db5; border-color: #5f8db5; color: #fff; font-weight: 700;
  }

  /* ══ TIMELINE ═══════════════════════════════════════════════════ */
  .pp-timeline { margin-top: 14px; }
  .pp-timeline-row { display: flex; align-items: center; gap: 14px; padding: 10px 0; border-bottom: 1px solid #e8f1f8; }
  .pp-timeline-row:last-child { border-bottom: none; }
  .pp-timeline-time { font-size: 13px; font-weight: 600; color: #3d6a94; width: 140px; flex-shrink: 0; }
  .pp-timeline-label { font-size: 15px; color: #111827; }
  .pp-timeline-dot { width: 8px; height: 8px; border-radius: 50%; background: #5f8db5; flex-shrink: 0; }

  /* ══ PLAN HEADER ════════════════════════════════════════════════ */
  .pp-plan-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
  .pp-plan-date { font-family: 'Oswald', sans-serif; font-size: 20px; font-weight: 600; color: #111827; }
  .pp-plan-time { font-size: 13px; color: #5a7a96; margin-top: 2px; }

  /* ══ MISC ═══════════════════════════════════════════════════════ */
  .pp-section-label {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.2px; color: #5a7a96; margin: 22px 0 10px;
  }
  .pp-empty { text-align: center; padding: 48px 24px; color: #5a7a96; font-size: 15px; }
  .pp-empty-icon { font-size: 38px; margin-bottom: 12px; }

  .pp-form-card-title {
    margin-bottom: 14px; font-family: 'Oswald', sans-serif;
    font-size: 16px; font-weight: 600; color: #111827;
    display: flex; align-items: center; gap: 8px;
  }

  /* ══ MODAL ══════════════════════════════════════════════════════ */
  .pp-overlay {
    position: fixed; inset: 0; background: rgba(10,15,26,0.6);
    z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .pp-modal {
    background: #fff; border-radius: 12px; padding: 28px;
    width: 100%; max-width: 580px; max-height: 85vh; overflow-y: auto;
    box-shadow: 0 24px 64px rgba(10,15,26,0.3);
  }
  .pp-modal-title { font-family: 'Oswald', sans-serif; font-size: 22px; color: #111827; margin-bottom: 20px; }

  /* ══ TOAST ══════════════════════════════════════════════════════ */
  .pp-toast {
    position: fixed; bottom: 28px; right: 28px;
    background: #111827; color: #fff; padding: 13px 20px;
    border-radius: 8px; font-size: 14px; font-weight: 500;
    border-left: 4px solid #5f8db5;
    box-shadow: 0 8px 24px rgba(10,15,26,0.25);
    z-index: 500; animation: ppSlideUp 0.25s ease;
  }
  @keyframes ppSlideUp {
    from { transform: translateY(16px); opacity: 0; }
    to   { transform: translateY(0);   opacity: 1; }
  }

  /* ════════════════════════════════════════════════════════════════
     MOBILE SHARE VIEW
  ════════════════════════════════════════════════════════════════ */
  .mv-shell { min-height: 100vh; background: #0a0f1a; font-family: 'Source Sans 3', sans-serif; color: #fff; }

  .mv-header {
    background: linear-gradient(160deg, #0a0f1a 0%, #111827 100%);
    padding: 20px 20px 18px;
    border-bottom: 2px solid #5f8db5;
    display: flex; align-items: center; gap: 16px;
  }
  .mv-header-logo { width: 70px; height: 70px; object-fit: contain; flex-shrink: 0; filter: drop-shadow(0 2px 8px rgba(95,141,181,0.4)); }
  .mv-header-text {}
  .mv-team { font-family: 'Oswald', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: #5f8db5; margin-bottom: 3px; }
  .mv-date { font-family: 'Oswald', sans-serif; font-size: 22px; font-weight: 700; color: #fff; line-height: 1.1; }
  .mv-kickoff { font-size: 13px; color: rgba(255,255,255,0.55); margin-top: 5px; }

  /* Timer bar */
  .mv-timer-bar {
    background: #5f8db5;
    padding: 13px 18px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .mv-timer-label { font-family: 'Oswald', sans-serif; font-size: 14px; font-weight: 600; color: #fff; }
  .mv-timer-block { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 1px; }
  .mv-timer-value { font-family: 'Oswald', sans-serif; font-size: 30px; font-weight: 700; color: #fff; letter-spacing: 2px; }
  .mv-timeup-label { font-size: 11px; color: #ffe0e0; font-weight: 700; margin-top: 2px; }
  .mv-timer-btn {
    background: #0a0f1a; color: #c2d9ed; border: none;
    border-radius: 6px; padding: 9px 16px;
    font-family: 'Oswald', sans-serif; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: background 0.15s; white-space: nowrap;
  }
  .mv-timer-btn:hover { background: #1a2640; }
  .mv-timer-btn.mv-success { background: #1a7a4a; color: #fff; }

  .mv-progress-wrap { height: 5px; background: rgba(255,255,255,0.15); }
  .mv-progress-fill { height: 5px; background: #fff; transition: width 1s linear; }

  .mv-start-wrap {
    padding: 16px 20px; background: rgba(95,141,181,0.08);
    border-bottom: 1px solid rgba(95,141,181,0.2);
    display: flex; justify-content: center;
  }
  .mv-start-btn {
    background: #5f8db5; color: #fff; border: none; border-radius: 8px;
    padding: 14px 40px; font-family: 'Oswald', sans-serif; font-size: 18px; font-weight: 600;
    cursor: pointer; transition: background 0.15s;
    box-shadow: 0 4px 16px rgba(95,141,181,0.35);
  }
  .mv-start-btn:hover { background: #3d6a94; }

  /* Blocks */
  .mv-blocks { padding: 14px 14px 48px; }
  .mv-block {
    background: rgba(255,255,255,0.04); border-radius: 12px; margin-bottom: 10px;
    overflow: hidden; border: 1.5px solid rgba(255,255,255,0.07);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .mv-block.mv-current {
    border-color: #5f8db5;
    box-shadow: 0 0 0 3px rgba(95,141,181,0.18);
    background: rgba(95,141,181,0.06);
  }
  .mv-block.mv-done { opacity: 0.4; }

  .mv-block-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; }
  .mv-block-index {
    width: 30px; height: 30px; border-radius: 50%;
    background: rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 700;
    color: rgba(255,255,255,0.6); flex-shrink: 0;
  }
  .mv-block.mv-current .mv-block-index { background: #5f8db5; color: #fff; }
  .mv-block.mv-done   .mv-block-index { background: #1a7a4a; color: #fff; }

  .mv-block-info { flex: 1; min-width: 0; }
  .mv-block-name { font-family: 'Oswald', sans-serif; font-size: 18px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .mv-block.mv-current .mv-block-name { color: #c2d9ed; }
  .mv-block-time { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px; }
  .mv-block-dur { font-family: 'Oswald', sans-serif; font-size: 13px; color: rgba(255,255,255,0.35); flex-shrink: 0; }

  .mv-block-detail {
    padding: 0 16px 16px 58px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .mv-detail-section { margin-top: 12px; }
  .mv-detail-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(255,255,255,0.35); margin-bottom: 7px; }
  .mv-chips { display: flex; gap: 8px; flex-wrap: wrap; }
  .mv-chip { background: rgba(95,141,181,0.2); color: #c2d9ed; border-radius: 4px; padding: 3px 10px; font-size: 12px; font-weight: 600; }
  .mv-detail-notes { list-style: none; padding: 0; }
  .mv-detail-notes li { font-size: 14px; color: rgba(255,255,255,0.8); padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .mv-detail-notes li:last-child { border-bottom: none; }
  .mv-detail-notes li::before { content: "▸ "; color: #5f8db5; }
  .mv-video-link {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(95,141,181,0.15); border: 1px solid rgba(95,141,181,0.3);
    border-radius: 6px; padding: 8px 14px;
    color: #c2d9ed; text-decoration: none; font-size: 14px; font-weight: 500;
    margin-top: 10px; transition: background 0.15s;
  }
  .mv-video-link:hover { background: rgba(95,141,181,0.25); }

  .mv-done-banner {
    margin: 0 14px 16px;
    background: linear-gradient(135deg, #1a3a5a, #0e2040);
    border: 1px solid #5f8db5;
    border-radius: 12px; padding: 24px; text-align: center;
  }
  .mv-done-title { font-family: 'Oswald', sans-serif; font-size: 26px; font-weight: 700; color: #fff; }
  .mv-done-logo { width: 72px; height: 72px; object-fit: contain; margin: 10px auto; display: block; }
  .mv-done-sub { font-size: 14px; color: rgba(255,255,255,0.65); margin-top: 6px; }

  @media (max-width: 480px) {
    .mv-date { font-size: 18px; }
    .mv-timer-value { font-size: 26px; }
    .mv-block-name { font-size: 16px; }
    .mv-timer-bar { gap: 8px; }
    .mv-header-logo { width: 56px; height: 56px; }
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #c2d9ed; border-radius: 3px; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(hour, min) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}:${String(min).padStart(2, "0")} ${suffix}`;
}

function buildSchedule(start = "17:00", drills = []) {
  const [h, m] = start.split(":").map(Number);
  let hour = h, min = m;
  const blocks = [];
  function add(minutes, label, drill = null) {
    const total = hour * 60 + min + minutes;
    const eH = Math.floor(total / 60) % 24, eM = total % 60;
    blocks.push({ start: formatTime(hour, min), end: formatTime(eH, eM), label, duration: minutes, drill });
    hour = eH; min = eM;
  }
  add(15, "Warmup");
  drills.forEach(d => add(20, d.name, d));
  add(15, "Cool Down");
  return blocks;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function encodePractice(plan) {
  try { return btoa(encodeURIComponent(JSON.stringify(plan))); } catch { return ""; }
}
function decodePractice(str) {
  try { return JSON.parse(decodeURIComponent(atob(str))); } catch { return null; }
}
function getShareUrl(plan) {
  const base = window.location.href.split("?")[0];
  return `${base}?practice=${encodePractice(plan)}`;
}
function loadStorage(key, fb) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; }
}
function saveStorage(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
function useToast() {
  const [msg, setMsg] = useState(null);
  const show = (text) => { setMsg(text); setTimeout(() => setMsg(null), 2800); };
  return { msg, show };
}

// ─── MOBILE SHARE VIEW ────────────────────────────────────────────────────────
function MobileView({ plan }) {
  const schedule  = buildSchedule(plan.start || "17:00", plan.drills || []);
  const totalMins = schedule.reduce((s, b) => s + b.duration, 0);

  const [started,      setStarted]      = useState(false);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [secondsLeft,  setSecondsLeft]  = useState(0);
  const [running,      setRunning]      = useState(false);
  const [expanded,     setExpanded]     = useState(null);
  const [done,         setDone]         = useState(false);
  const intervalRef = useRef(null);

  function launchBlock(idx) {
    clearInterval(intervalRef.current);
    setCurrentBlock(idx);
    setSecondsLeft(schedule[idx].duration * 60);
    setRunning(true);
    setExpanded(idx);
  }
  function startPractice() { setStarted(true); launchBlock(0); }
  function advanceBlock() {
    clearInterval(intervalRef.current);
    const next = currentBlock + 1;
    if (next < schedule.length) launchBlock(next);
    else { setRunning(false); setDone(true); }
  }

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => (s <= 1 ? (clearInterval(intervalRef.current), 0) : s - 1));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, currentBlock]);

  const mins     = Math.floor(secondsLeft / 60);
  const secs     = secondsLeft % 60;
  const blockDur = started && !done ? schedule[currentBlock].duration * 60 : 1;
  const progress = started && !done ? ((blockDur - secondsLeft) / blockDur) * 100 : 0;
  const timeUp   = started && !done && secondsLeft === 0;

  return (
    <div className="mv-shell">
      <div className="mv-header">
        <img src={LOGO_PATH} alt="Panthers" className="mv-header-logo" />
        <div className="mv-header-text">
          <div className="mv-team">Kitchener Panthers · U8 Tier 1</div>
          <div className="mv-date">{formatDateDisplay(plan.date)}</div>
          <div className="mv-kickoff">
            Start: {formatTime(...(plan.start || "17:00").split(":").map(Number))} &nbsp;·&nbsp; {totalMins} min total
          </div>
        </div>
      </div>

      {!started && (
        <div className="mv-start-wrap">
          <button className="mv-start-btn" onClick={startPractice}>▶ &nbsp;Start Practice Timer</button>
        </div>
      )}

      {started && !done && (
        <>
          <div className="mv-timer-bar">
            <div>
              <div className="mv-timer-label">{schedule[currentBlock].label}</div>
              <div className="mv-timer-block">Block {currentBlock + 1} of {schedule.length}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="mv-timer-value">{String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}</div>
              {timeUp && <div className="mv-timeup-label">TIME'S UP</div>}
            </div>
            <button className={`mv-timer-btn${timeUp ? " mv-success" : ""}`} onClick={advanceBlock}>
              {currentBlock < schedule.length - 1 ? "Next ▶" : "Finish ✓"}
            </button>
          </div>
          <div className="mv-progress-wrap">
            <div className="mv-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </>
      )}

      <div className="mv-blocks">
        {done && (
          <div className="mv-done-banner">
            <div className="mv-done-title">🏆 Practice Complete!</div>
            <img src={LOGO_PATH} alt="Panthers" className="mv-done-logo" />
            <div className="mv-done-sub">Great work, Kitchener Panthers!</div>
          </div>
        )}

        {schedule.map((block, i) => {
          const isCurrent = started && !done && i === currentBlock;
          const isDone    = started && (done || i < currentBlock);
          const isOpen    = expanded === i;
          const hasDrill  = !!block.drill;

          return (
            <div key={i} className={`mv-block${isCurrent ? " mv-current" : ""}${isDone ? " mv-done" : ""}`}>
              <div className="mv-block-header" onClick={() => hasDrill && setExpanded(isOpen ? null : i)}>
                <div className="mv-block-index">{isDone ? "✓" : i + 1}</div>
                <div className="mv-block-info">
                  <div className="mv-block-name">{block.label}</div>
                  <div className="mv-block-time">{block.start} – {block.end}</div>
                </div>
                <div className="mv-block-dur">{block.duration}m{hasDrill ? (isOpen ? " ▲" : " ▼") : ""}</div>
              </div>

              {hasDrill && isOpen && (
                <div className="mv-block-detail">
                  <div className="mv-detail-section">
                    <div className="mv-chips">
                      <span className="mv-chip">{block.drill.category}</span>
                      <span className="mv-chip">👥 {block.drill.players} players</span>
                    </div>
                  </div>
                  {block.drill.notes && (
                    <div className="mv-detail-section">
                      <div className="mv-detail-label">Instructions</div>
                      <ul className="mv-detail-notes">
                        {block.drill.notes.split("\n").filter(Boolean).map((n, j) => <li key={j}>{n}</li>)}
                      </ul>
                    </div>
                  )}
                  {block.drill.video && (
                    <a href={block.drill.video} target="_blank" rel="noopener noreferrer" className="mv-video-link">
                      ▶ &nbsp;Watch Drill Video
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

// ─── DESKTOP PLANNER ─────────────────────────────────────────────────────────
export default function PracticePlanner() {
  const today      = new Date().toISOString().split("T")[0];
  const categories = ["Hitting", "Fielding", "Throwing", "Base Running", "Warmup"];

  const [sharedPlan] = useState(() => {
    try {
      const p = new URLSearchParams(window.location.search).get("practice");
      return p ? decodePractice(p) : null;
    } catch { return null; }
  });

  const [page,           setPage]           = useState("drills");
  const [drills,         setDrills]         = useState(() => loadStorage("pp_drills", []));
  const [plans,          setPlans]          = useState(() => loadStorage("pp_plans",  []));

  const [editingDrillId, setEditingDrillId] = useState(null);
  const [drillName,      setDrillName]      = useState("");
  const [drillCategory,  setDrillCategory]  = useState("Hitting");
  const [drillPlayers,   setDrillPlayers]   = useState(8);
  const [drillNotes,     setDrillNotes]     = useState("");
  const [drillVideo,     setDrillVideo]     = useState("");

  const [practiceDate,   setPracticeDate]   = useState(today);
  const [startTime,      setStartTime]      = useState("17:00");
  const [selectedDrills, setSelectedDrills] = useState([]);

  const [editPlan,       setEditPlan]       = useState(null);
  const [editDate,       setEditDate]       = useState("");
  const [editStart,      setEditStart]      = useState("");
  const [editSelected,   setEditSelected]   = useState([]);

  const toast = useToast();

  useEffect(() => saveStorage("pp_drills", drills), [drills]);
  useEffect(() => saveStorage("pp_plans",  plans),  [plans]);
  useEffect(() => {
    let el = document.getElementById("pp-styles");
    if (!el) { el = document.createElement("style"); el.id = "pp-styles"; document.head.appendChild(el); }
    el.textContent = GLOBAL_CSS;
  }, []);

  if (sharedPlan) return <MobileView plan={sharedPlan} />;

  // ── Drill CRUD ──
  function resetDrillForm() {
    setEditingDrillId(null); setDrillName(""); setDrillCategory("Hitting");
    setDrillPlayers(8); setDrillNotes(""); setDrillVideo("");
  }
  function startEditDrill(d) {
    setEditingDrillId(d.id); setDrillName(d.name); setDrillCategory(d.category);
    setDrillPlayers(d.players); setDrillNotes(d.notes || ""); setDrillVideo(d.video || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function saveDrill() {
    if (!drillName.trim()) return toast.show("Please enter a drill name.");
    const drill = { id: editingDrillId || Date.now(), name: drillName.trim(), category: drillCategory, players: drillPlayers, notes: drillNotes, video: drillVideo };
    setDrills(prev => editingDrillId ? prev.map(d => d.id === editingDrillId ? drill : d) : [...prev, drill]);
    resetDrillForm();
    toast.show(editingDrillId ? "Drill updated ✓" : "Drill saved ✓");
  }
  function deleteDrill(id) {
    if (!window.confirm("Delete this drill?")) return;
    setDrills(prev => prev.filter(d => d.id !== id));
    toast.show("Drill deleted");
  }

  // ── Practice CRUD ──
  function toggleDrill(d) {
    setSelectedDrills(prev => {
      if (prev.find(p => p.id === d.id)) return prev.filter(p => p.id !== d.id);
      if (prev.length >= 3) { toast.show("Max 3 drills per practice"); return prev; }
      return [...prev, d];
    });
  }
  function savePractice() {
    if (selectedDrills.length === 0) return toast.show("Select at least one drill.");
    const plan = { id: Date.now(), date: practiceDate, start: startTime, drills: selectedDrills };
    setPlans(prev => [plan, ...prev]);
    setSelectedDrills([]); setPracticeDate(today); setStartTime("17:00");
    toast.show("Practice saved ✓"); setPage("plans");
  }
  function deletePlan(id) {
    if (!window.confirm("Delete this practice plan?")) return;
    setPlans(prev => prev.filter(p => p.id !== id));
    toast.show("Practice deleted");
  }
  function openEditPlan(p) {
    setEditPlan(p); setEditDate(p.date); setEditStart(p.start); setEditSelected([...p.drills]);
  }
  function toggleEditDrill(d) {
    setEditSelected(prev => {
      if (prev.find(p => p.id === d.id)) return prev.filter(p => p.id !== d.id);
      if (prev.length >= 3) { toast.show("Max 3 drills per practice"); return prev; }
      return [...prev, d];
    });
  }
  function saveEditPlan() {
    if (editSelected.length === 0) return toast.show("Select at least one drill.");
    setPlans(prev => prev.map(p => p.id === editPlan.id ? { ...p, date: editDate, start: editStart, drills: editSelected } : p));
    setEditPlan(null); toast.show("Practice updated ✓");
  }
  function copyShareLink(plan) {
    const url = getShareUrl(plan);
    navigator.clipboard.writeText(url)
      .then(() => toast.show("Share link copied! 📋"))
      .catch(() => toast.show("Copy: " + url));
  }

  const navItems = [
    { id: "drills", icon: "⚾", label: "Drill Library"    },
    { id: "create", icon: "📋", label: "Create Practice"  },
    { id: "plans",  icon: "📅", label: "Practice Plans"   },
  ];

  return (
    <div className="pp-shell">

      {/* ── Sidebar ── */}
      <aside className="pp-sidebar">
        <div className="pp-logo">
          <img src={LOGO_PATH} alt="Kitchener Panthers" />
          <div className="pp-logo-sub">Practice Planner</div>
        </div>
        <nav className="pp-nav">
          {navItems.map(n => (
            <button key={n.id} className={`pp-nav-btn${page === n.id ? " active" : ""}`} onClick={() => setPage(n.id)}>
              <span className="pp-nav-icon">{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="pp-main">

        {/* ══ DRILL LIBRARY ══════════════════════════════════════ */}
        {page === "drills" && (
          <>
            <div className="pp-page-header">
              <div className="pp-page-title">
                <span className="pp-page-title-accent">⚾</span> Drill Library
              </div>
              <div className="pp-page-sub">Add, edit, and manage your team's drills</div>
            </div>

            <div className="pp-card">
              <div className="pp-form-card-title">
                {editingDrillId ? "✏️  Editing Drill" : "➕  New Drill"}
              </div>
              <div className="pp-form-row">
                <div className="pp-form-group">
                  <label className="pp-label">Drill Name</label>
                  <input className="pp-input" placeholder="e.g. Tee Work" value={drillName} onChange={e => setDrillName(e.target.value)} />
                </div>
                <div className="pp-form-group">
                  <label className="pp-label">Category</label>
                  <select className="pp-select" value={drillCategory} onChange={e => setDrillCategory(e.target.value)}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <label className="pp-label">Number of Players</label>
              <select className="pp-select" value={drillPlayers} onChange={e => setDrillPlayers(Number(e.target.value))}>
                {Array.from({ length: 20 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <label className="pp-label">Instructions (one per line)</label>
              <textarea className="pp-textarea" placeholder={"Stand with feet shoulder-width apart\nKeep your eye on the ball\nFollow through on your swing"} value={drillNotes} onChange={e => setDrillNotes(e.target.value)} />
              <label className="pp-label">Video Link (optional)</label>
              <input className="pp-input" placeholder="https://youtube.com/..." value={drillVideo} onChange={e => setDrillVideo(e.target.value)} />
              <div className="pp-btn-row">
                <button className="pp-btn pp-btn-primary" onClick={saveDrill}>{editingDrillId ? "Update Drill" : "Save Drill"}</button>
                {editingDrillId && <button className="pp-btn pp-btn-ghost" onClick={resetDrillForm}>Cancel</button>}
              </div>
            </div>

            {drills.length === 0 ? (
              <div className="pp-empty"><div className="pp-empty-icon">⚾</div>No drills yet. Add your first above.</div>
            ) : (
              <>
                <div className="pp-section-label">{drills.length} Drill{drills.length !== 1 ? "s" : ""}</div>
                {drills.map(d => (
                  <div key={d.id} className="pp-drill-card">
                    <div style={{ flex: 1 }}>
                      <div className="pp-drill-name">{d.name}</div>
                      <div className="pp-drill-meta">
                        <span className="pp-badge">{d.category}</span>
                        <span className="pp-badge">{d.players} player{d.players !== 1 ? "s" : ""}</span>
                      </div>
                      {d.notes && <ul className="pp-drill-notes">{d.notes.split("\n").filter(Boolean).map((n, i) => <li key={i}>{n}</li>)}</ul>}
                      {d.video && <a href={d.video} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: T.steel, marginTop: 6, display: "inline-block" }}>▶ Watch video</a>}
                    </div>
                    <div className="pp-drill-actions">
                      <button className="pp-btn pp-btn-ghost pp-btn-sm" onClick={() => startEditDrill(d)}>Edit</button>
                      <button className="pp-btn pp-btn-danger" onClick={() => deleteDrill(d.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* ══ CREATE PRACTICE ════════════════════════════════════ */}
        {page === "create" && (
          <>
            <div className="pp-page-header">
              <div className="pp-page-title"><span className="pp-page-title-accent">📋</span> Create Practice</div>
              <div className="pp-page-sub">Choose a date, time, and up to 3 drills</div>
            </div>
            <div className="pp-card">
              <div className="pp-form-row">
                <div className="pp-form-group">
                  <label className="pp-label">Practice Date</label>
                  <input type="date" className="pp-input" value={practiceDate} onChange={e => setPracticeDate(e.target.value)} />
                </div>
                <div className="pp-form-group">
                  <label className="pp-label">Start Time</label>
                  <input type="time" className="pp-input" value={startTime} onChange={e => setStartTime(e.target.value)} />
                </div>
              </div>

              <div className="pp-section-label">Select Drills ({selectedDrills.length}/3)</div>
              {drills.length === 0 ? (
                <div className="pp-empty" style={{ padding: "24px 0" }}>No drills yet — add some in the Drill Library first.</div>
              ) : drills.map(d => {
                const sel = !!selectedDrills.find(p => p.id === d.id);
                return (
                  <div key={d.id} className={`pp-drill-pick${sel ? " selected" : ""}`} onClick={() => toggleDrill(d)}>
                    <div className="pp-drill-pick-info">
                      <div className="pp-drill-pick-check">{sel ? "✓" : ""}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: T.text }}>{d.name}</div>
                        <div style={{ fontSize: 13, color: T.muted }}>{d.category} · {d.players} players</div>
                      </div>
                    </div>
                    <span className="pp-badge">{sel ? `#${selectedDrills.findIndex(p => p.id === d.id) + 1}` : "+"}</span>
                  </div>
                );
              })}

              {selectedDrills.length > 0 && (
                <>
                  <div className="pp-section-label" style={{ marginTop: 20 }}>Schedule Preview</div>
                  {buildSchedule(startTime, selectedDrills).map((s, i) => (
                    <div key={i} className="pp-timeline-row">
                      <div className="pp-timeline-dot" />
                      <div className="pp-timeline-time">{s.start} – {s.end}</div>
                      <div className="pp-timeline-label">{s.label}</div>
                    </div>
                  ))}
                </>
              )}

              <div className="pp-btn-row" style={{ marginTop: 20 }}>
                <button className="pp-btn pp-btn-dark" onClick={savePractice}>Save Practice Plan</button>
              </div>
            </div>
          </>
        )}

        {/* ══ PRACTICE PLANS ═════════════════════════════════════ */}
        {page === "plans" && (
          <>
            <div className="pp-page-header">
              <div className="pp-page-title"><span className="pp-page-title-accent">📅</span> Practice Plans</div>
              <div className="pp-page-sub">Hit Share to send a mobile-friendly link with a live timer to your coaches</div>
            </div>

            {plans.length === 0 ? (
              <div className="pp-empty">
                <div className="pp-empty-icon">📅</div>
                No practice plans yet.
                <br />
                <button className="pp-btn pp-btn-primary" style={{ marginTop: 16 }} onClick={() => setPage("create")}>
                  Create Your First Practice
                </button>
              </div>
            ) : plans.map(p => (
              <div key={p.id} className="pp-card">
                <div className="pp-plan-header">
                  <div>
                    <div className="pp-plan-date">{formatDateDisplay(p.date)}</div>
                    <div className="pp-plan-time">Start: {formatTime(...(p.start || "17:00").split(":").map(Number))}</div>
                  </div>
                  <div className="pp-btn-row">
                    <button className="pp-btn pp-btn-primary pp-btn-sm" onClick={() => copyShareLink(p)}>📱 Share</button>
                    <button className="pp-btn pp-btn-ghost pp-btn-sm" onClick={() => openEditPlan(p)}>Edit</button>
                    <button className="pp-btn pp-btn-danger" onClick={() => deletePlan(p.id)}>Delete</button>
                  </div>
                </div>
                <div className="pp-timeline">
                  {buildSchedule(p.start || "17:00", p.drills || []).map((s, i) => (
                    <div key={i} className="pp-timeline-row">
                      <div className="pp-timeline-dot" />
                      <div className="pp-timeline-time">{s.start} – {s.end}</div>
                      <div className="pp-timeline-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

      </main>

      {/* ── Edit Practice Modal ── */}
      {editPlan && (
        <div className="pp-overlay" onClick={e => { if (e.target === e.currentTarget) setEditPlan(null); }}>
          <div className="pp-modal">
            <div className="pp-modal-title">Edit Practice</div>
            <div className="pp-form-row">
              <div className="pp-form-group">
                <label className="pp-label">Date</label>
                <input type="date" className="pp-input" value={editDate} onChange={e => setEditDate(e.target.value)} />
              </div>
              <div className="pp-form-group">
                <label className="pp-label">Start Time</label>
                <input type="time" className="pp-input" value={editStart} onChange={e => setEditStart(e.target.value)} />
              </div>
            </div>
            <div className="pp-section-label">Drills ({editSelected.length}/3)</div>
            {drills.map(d => {
              const sel = !!editSelected.find(p => p.id === d.id);
              return (
                <div key={d.id} className={`pp-drill-pick${sel ? " selected" : ""}`} onClick={() => toggleEditDrill(d)}>
                  <div className="pp-drill-pick-info">
                    <div className="pp-drill-pick-check">{sel ? "✓" : ""}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: T.text }}>{d.name}</div>
                      <div style={{ fontSize: 13, color: T.muted }}>{d.category}</div>
                    </div>
                  </div>
                  {sel && <span className="pp-badge">#{editSelected.findIndex(p => p.id === d.id) + 1}</span>}
                </div>
              );
            })}
            <div className="pp-btn-row" style={{ marginTop: 20 }}>
              <button className="pp-btn pp-btn-primary" onClick={saveEditPlan}>Save Changes</button>
              <button className="pp-btn pp-btn-ghost" onClick={() => setEditPlan(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast.msg && <div className="pp-toast">{toast.msg}</div>}
    </div>
  );
}
