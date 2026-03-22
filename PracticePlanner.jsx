import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  dumbbell: "M6.5 6.5h11M6.5 17.5h11M3 9.5l3-3m0 11-3-3m18-5-3-3m0 11 3-3M9 12h6",
  calPlus:  "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM12 15v-4m-2 2h4",
  calDays:  "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01",
  pencil:   "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:    "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  share:    "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
  play:     "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM10 8l6 4-6 4V8z",
  skip:     "M5 4l10 8-10 8V4zM19 4v16",
  check:    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM7 12l3 3 7-7",
  video:    "M23 7l-7 5 7 5V7zM1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  users:    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  tag:      "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  plus:     "M12 5v14M5 12h14",
  x:        "M18 6 6 18M6 6l12 12",
  chevDown: "M6 9l6 6 6-6",
  chevUp:   "M18 15l-6-6-6 6",
  filter:   "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  clock:    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2",
  home:     "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  sun:      "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z",
  moon:     "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  bat:      "M3 21l4-4M7 17L19 5a2 2 0 0 0-3-3L4 14M17 3l4 4M9 15l-4 4",
  layers:   "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
};
const Ico = ({ name, size = 18 }) => <Icon d={Icons[name]} size={size} />;

// ─── Categories ───────────────────────────────────────────────────────────────
const CAT = {
  "Hitting":      { bg:"rgba(239,107,54,0.18)",  border:"rgba(239,107,54,0.5)",  text:"#ef6b36" },
  "Fielding":     { bg:"rgba(59,185,128,0.18)",  border:"rgba(59,185,128,0.5)",  text:"#3bb980" },
  "Throwing":     { bg:"rgba(100,149,237,0.18)", border:"rgba(100,149,237,0.5)", text:"#6495ed" },
  "Base Running": { bg:"rgba(255,196,0,0.18)",   border:"rgba(255,196,0,0.5)",   text:"#ffc400" },
  "Warmup":       { bg:"rgba(167,139,250,0.18)", border:"rgba(167,139,250,0.5)", text:"#a78bfa" },
  "Catcher":      { bg:"rgba(251,113,133,0.18)", border:"rgba(251,113,133,0.5)", text:"#fb7185" },
  "Pitcher":      { bg:"rgba(34,211,238,0.18)",  border:"rgba(34,211,238,0.5)",  text:"#22d3ee" },
  "Cool Down":    { bg:"rgba(148,163,184,0.18)", border:"rgba(148,163,184,0.5)", text:"#94a3b8" },
};
const CATS = Object.keys(CAT);
const DURATIONS = [10,15,20,30];
const VENUE_OPTIONS = ["Both","Indoor","Outdoor"];
const VENUE_ICONS   = { Indoor:"home", Outdoor:"sun", Both:"star" };
const VENUE_COLORS  = {
  Indoor:  { bg:"rgba(167,139,250,0.15)", border:"rgba(167,139,250,0.4)", text:"#a78bfa" },
  Outdoor: { bg:"rgba(59,185,128,0.15)",  border:"rgba(59,185,128,0.4)",  text:"#3bb980" },
  Both:    { bg:"rgba(255,196,0,0.15)",   border:"rgba(255,196,0,0.4)",   text:"#ffc400" },
};
const PLAYER_FILTERS = ["Any","1–4","5–10","10+"];
const BAT_COLOR = { bg:"rgba(239,107,54,0.15)", border:"rgba(239,107,54,0.45)", text:"#ef6b36" };

function matchesPlayerFilter(drill, pf) {
  if (pf === "Any") return true;
  const p = drill.players || 1;
  if (pf === "1–4")  return p >= 1  && p <= 4;
  if (pf === "5–10") return p >= 5  && p <= 10;
  if (pf === "10+")  return p > 10;
  return true;
}

function CatChip({ cat, small=false }) {
  const c = CAT[cat]||CAT["Hitting"];
  return <span style={{display:"inline-flex",alignItems:"center",gap:3,background:c.bg,border:`1px solid ${c.border}`,color:c.text,borderRadius:5,padding:small?"2px 7px":"3px 9px",fontSize:small?11:12,fontWeight:700,whiteSpace:"nowrap"}}>{cat}</span>;
}
function VenueChip({ venue, small=false }) {
  if (!venue||venue==="Both") return null;
  const v=VENUE_COLORS[venue]||VENUE_COLORS["Both"];
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:v.bg,border:`1px solid ${v.border}`,color:v.text,borderRadius:5,padding:small?"2px 7px":"3px 9px",fontSize:small?11:12,fontWeight:700,whiteSpace:"nowrap"}}><Ico name={VENUE_ICONS[venue]||"star"} size={10}/>{venue}</span>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LOGO = "/KMBA-Panthers-Logo_U8_Tier_1.png";

const BAT_DRILL = {
  id:"batting", name:"Batting Practice", category:"Hitting",
  notes:"5 minutes per player hitting\nOn Deck: hitting off tee",
  players:0, duration:0, venue:"Both", video:"",
};

function encodePlan(plan) {
  try {
    const slim = {
      d:plan.date, s:plan.start, bp:plan.battingParallel?1:0,
      x:(plan.drills||[]).map(dr=>({n:dr.name,c:dr.category,p:dr.players,t:dr.notes||"",v:dr.video||"",du:dr.duration||20,ve:dr.venue||"Both"}))
    };
    return btoa(encodeURIComponent(JSON.stringify(slim))).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
  } catch { return ""; }
}
function decodePlan(str) {
  try {
    const slim=JSON.parse(decodeURIComponent(atob(str.replace(/-/g,"+").replace(/_/g,"/"))));
    return {date:slim.d,start:slim.s,battingParallel:!!slim.bp,drills:(slim.x||[]).map((dr,i)=>({id:i,name:dr.n,category:dr.c,players:dr.p,notes:dr.t,video:dr.v,duration:dr.du||20,venue:dr.ve||"Both"}))};
  } catch { return null; }
}
function shareUrl(plan){return `${window.location.href.split("?")[0]}?p=${encodePlan(plan)}`;}

const load=(k,fb)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}catch{return fb;}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};

function fmt(h,m){return `${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`;}

function buildSchedule(start="17:00",drills=[]){
  const [h,m]=start.split(":").map(Number);
  let hr=h,mn=m;
  const blocks=[];
  function add(mins,label,drill=null){
    const t=hr*60+mn+mins,eH=Math.floor(t/60)%24,eM=t%60;
    blocks.push({start:fmt(hr,mn),end:fmt(eH,eM),label,dur:mins,drill});
    hr=eH;mn=eM;
  }
  add(15,"Warmup");
  drills.forEach(d=>add(d.duration||20,d.name,d));
  add(15,"Cool Down");
  return blocks;
}

function dateLabel(str){
  if(!str)return "";
  const [y,m,d]=str.split("-").map(Number);
  return new Date(y,m-1,d).toLocaleDateString("en-CA",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
}
function useToast(){const[msg,setMsg]=useState(null);const show=t=>{setMsg(t);setTimeout(()=>setMsg(null),2600);};return{msg,show};}

// ─── Theme ────────────────────────────────────────────────────────────────────
function makeTheme(dark){
  return dark?{
    bg:"#090e1a",surface:"#111827",surfaceUp:"#1a2540",
    border:"rgba(95,141,181,0.18)",borderHi:"rgba(95,141,181,0.45)",
    steel:"#5f8db5",steelDim:"rgba(95,141,181,0.12)",steelLight:"#c2d9ed",
    text:"#f0f4f8",textMuted:"rgba(255,255,255,0.4)",textDim:"rgba(255,255,255,0.28)",
    inputBg:"rgba(255,255,255,0.05)",inputBorder:"rgba(95,141,181,0.22)",
    navBg:"#111827",navBorder:"rgba(95,141,181,0.2)",navText:"rgba(255,255,255,0.3)",
    pillBorder:"rgba(255,255,255,0.1)",pillText:"rgba(255,255,255,0.4)",
    playerChip:"rgba(255,255,255,0.07)",playerText:"rgba(255,255,255,0.5)",
    noteText:"rgba(255,255,255,0.5)",toastBg:"#1a2540",modalBg:"#111827",
    overlayBg:"rgba(6,10,20,0.78)",danger:"#e05252",success:"#3dba7a",
    recentCol:"#ffc400",isDark:true,
  }:{
    bg:"#f0f4f8",surface:"#ffffff",surfaceUp:"#e8f0f8",
    border:"rgba(95,141,181,0.2)",borderHi:"rgba(95,141,181,0.5)",
    steel:"#3d6a94",steelDim:"rgba(61,106,148,0.08)",steelLight:"#1a4a8a",
    text:"#111827",textMuted:"rgba(17,24,39,0.55)",textDim:"rgba(17,24,39,0.35)",
    inputBg:"#ffffff",inputBorder:"rgba(95,141,181,0.35)",
    navBg:"#ffffff",navBorder:"rgba(95,141,181,0.2)",navText:"rgba(17,24,39,0.35)",
    pillBorder:"rgba(17,24,39,0.15)",pillText:"rgba(17,24,39,0.45)",
    playerChip:"rgba(17,24,39,0.07)",playerText:"rgba(17,24,39,0.55)",
    noteText:"rgba(17,24,39,0.55)",toastBg:"#1a4a8a",modalBg:"#ffffff",
    overlayBg:"rgba(17,24,39,0.55)",danger:"#c0392b",success:"#1a7a4a",
    recentCol:"#c98f00",isDark:false,
  };
}

function makeCSS(T){return `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:${T.bg};font-family:'Source Sans 3',sans-serif;color:${T.text};min-height:100vh;transition:background 0.25s,color 0.25s;}
.app{min-height:100vh;display:flex;flex-direction:column;max-width:680px;margin:0 auto;}
.top-bar{display:flex;align-items:center;gap:14px;padding:14px 18px;border-bottom:1px solid ${T.border};background:${T.bg};position:sticky;top:0;z-index:50;transition:background 0.25s;}
.top-bar img{width:46px;height:46px;object-fit:contain;filter:drop-shadow(0 2px 8px rgba(95,141,181,0.4));}
.top-bar-title{font-family:'Oswald',sans-serif;font-size:18px;font-weight:700;color:${T.text};line-height:1;}
.top-bar-sub{font-size:11px;color:${T.steel};text-transform:uppercase;letter-spacing:1.5px;margin-top:2px;}
.theme-btn{margin-left:auto;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9px;border:1.5px solid ${T.border};background:${T.steelDim};cursor:pointer;color:${T.steel};transition:all 0.15s;flex-shrink:0;}
.theme-btn:hover{border-color:${T.steel};}
.scroll-area{flex:1;overflow-y:auto;padding:20px 16px 100px;}
.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:680px;background:${T.navBg};border-top:1px solid ${T.navBorder};display:flex;z-index:100;padding-bottom:env(safe-area-inset-bottom,0px);transition:background 0.25s;}
.nav-tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:11px 8px 9px;background:none;border:none;cursor:pointer;color:${T.navText};font-family:'Source Sans 3',sans-serif;font-size:11px;font-weight:500;transition:color 0.15s;-webkit-tap-highlight-color:transparent;}
.nav-tab:hover{color:${T.isDark?"rgba(255,255,255,0.6)":"rgba(17,24,39,0.7)"};}
.nav-tab.active{color:${T.steel};}
.nav-badge{display:inline-flex;align-items:center;justify-content:center;background:${T.steel};color:#fff;border-radius:10px;font-size:10px;font-weight:700;padding:0 5px;min-width:16px;height:16px;margin-left:2px;}
.filter-bar{display:flex;gap:7px;overflow-x:auto;padding-bottom:4px;margin-bottom:10px;scrollbar-width:none;}
.filter-bar::-webkit-scrollbar{display:none;}
.filter-pill{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:20px;border:1.5px solid ${T.pillBorder};background:transparent;cursor:pointer;white-space:nowrap;font-family:'Source Sans 3',sans-serif;font-size:12px;font-weight:600;color:${T.pillText};transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
.filter-pill:hover{color:${T.isDark?"rgba(255,255,255,0.7)":"rgba(17,24,39,0.7)"};border-color:${T.isDark?"rgba(255,255,255,0.22)":"rgba(17,24,39,0.25)"};}
.filter-pill.all-active{background:${T.steel};border-color:${T.steel};color:#fff;}
.filter-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;align-items:center;}
.filter-group-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${T.textDim};margin-right:2px;}
.recent-label{display:flex;align-items:center;gap:7px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.3px;color:${T.recentCol};margin:4px 0 8px;}
.recent-label::after{content:'';flex:1;height:1px;background:${T.isDark?"rgba(255,196,0,0.2)":"rgba(201,143,0,0.25)"};}
.section-title{font-family:'Oswald',sans-serif;font-size:22px;font-weight:600;color:${T.text};margin-bottom:3px;}
.section-sub{font-size:13px;color:${T.textMuted};margin-bottom:16px;}
.card{background:${T.surface};border-radius:14px;border:1px solid ${T.border};padding:18px;margin-bottom:12px;transition:background 0.25s,border-color 0.25s;}
.card-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${T.textDim};margin-bottom:14px;}
.field{margin-bottom:14px;}
.label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.9px;color:${T.textDim};display:block;margin-bottom:6px;}
.input,.select,.textarea{width:100%;padding:11px 13px;background:${T.inputBg};border:1.5px solid ${T.inputBorder};border-radius:9px;font-family:'Source Sans 3',sans-serif;font-size:15px;color:${T.text};transition:border-color 0.15s,box-shadow 0.15s;}
.textarea{resize:vertical;min-height:80px;}
.input::placeholder,.textarea::placeholder{color:${T.textDim};}
.input:focus,.select:focus,.textarea:focus{outline:none;border-color:${T.steel};box-shadow:0 0 0 3px ${T.steelDim};}
.select{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235f8db5' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;background-color:${T.inputBg};}
.select option{background:${T.surface};color:${T.text};}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.dur-picker{display:flex;gap:8px;}
.dur-btn{flex:1;padding:9px 4px;border-radius:8px;border:1.5px solid ${T.inputBorder};background:${T.inputBg};cursor:pointer;font-family:'Oswald',sans-serif;font-size:15px;font-weight:600;color:${T.textDim};transition:all 0.15s;text-align:center;}
.dur-btn:hover{border-color:${T.steel};color:${T.steel};}
.dur-btn.dur-active{background:${T.steel};border-color:${T.steel};color:#fff;}
.venue-picker{display:flex;gap:8px;}
.venue-btn{flex:1;padding:9px 4px;border-radius:8px;border:1.5px solid ${T.inputBorder};background:${T.inputBg};cursor:pointer;font-family:'Source Sans 3',sans-serif;font-size:12px;font-weight:600;color:${T.textDim};transition:all 0.15s;text-align:center;display:flex;flex-direction:column;align-items:center;gap:4px;}
.venue-btn:hover{border-color:${T.borderHi};color:${T.text};}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 20px;border-radius:9px;border:none;font-family:'Source Sans 3',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
.btn-sm{padding:7px 14px;font-size:13px;}
.btn-primary{background:${T.steel};color:#fff;}
.btn-primary:hover{opacity:0.88;}
.btn-ghost{background:transparent;color:${T.textMuted};border:1.5px solid ${T.border};}
.btn-ghost:hover{border-color:${T.steel};color:${T.steel};}
.btn-full{width:100%;}
.btn-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;}
.icon-btn{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;border:1.5px solid ${T.border};background:transparent;cursor:pointer;color:${T.textMuted};transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
.icon-btn:hover{border-color:${T.steel};color:${T.steel};}
.icon-btn.danger:hover{border-color:${T.danger};color:${T.danger};}
.drill-item{background:${T.surface};border-radius:12px;padding:15px;margin-bottom:10px;border:1.5px solid ${T.border};transition:border-color 0.15s,background 0.25s;}
.drill-item:hover{border-color:${T.borderHi};}
.drill-item-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.drill-name{font-family:'Oswald',sans-serif;font-size:18px;font-weight:600;color:${T.text};margin-bottom:7px;}
.drill-name-sm{font-family:'Oswald',sans-serif;font-size:16px;font-weight:600;color:${T.text};margin-bottom:6px;}
.meta-chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:7px;align-items:center;}
.player-chip{display:inline-flex;align-items:center;gap:4px;background:${T.playerChip};color:${T.playerText};border-radius:5px;padding:3px 9px;font-size:12px;font-weight:600;}
.dur-chip{display:inline-flex;align-items:center;gap:4px;background:${T.steelDim};color:${T.steel};border-radius:5px;padding:3px 9px;font-size:12px;font-weight:700;}
.drill-notes{list-style:none;padding:0;margin-top:4px;}
.drill-notes li{font-size:13px;color:${T.noteText};padding:2px 0;}
.drill-actions{display:flex;gap:7px;flex-shrink:0;}

/* Pick items */
.pick-item{background:${T.surface};border:1.5px solid ${T.border};border-radius:11px;margin-bottom:9px;transition:all 0.15s;user-select:none;-webkit-tap-highlight-color:transparent;}
.pick-item:hover{border-color:${T.borderHi};}
.pick-item.picked{border-color:${T.steel};background:${T.steelDim};}
.pick-header{display:flex;align-items:center;gap:12px;padding:13px 15px;cursor:pointer;}
.pick-circle{width:24px;height:24px;border-radius:50%;border:2px solid ${T.border};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;font-weight:700;color:transparent;transition:all 0.15s;}
.pick-item.picked .pick-circle{background:${T.steel};border-color:${T.steel};color:#fff;}
.pick-info{flex:1;min-width:0;}
.pick-name{font-weight:600;font-size:15px;color:${T.text};margin-bottom:4px;}
.pick-meta{display:flex;gap:5px;flex-wrap:wrap;align-items:center;}
.pick-num{font-family:'Oswald',sans-serif;font-size:18px;font-weight:700;color:${T.steel};flex-shrink:0;}
.pick-expand-btn{display:flex;align-items:center;justify-content:center;padding:4px 10px;border-radius:6px;border:1px solid ${T.border};background:transparent;cursor:pointer;color:${T.textDim};font-size:11px;font-weight:600;gap:3px;transition:all 0.15s;white-space:nowrap;}
.pick-expand-btn:hover{border-color:${T.steel};color:${T.steel};}
.pick-expanded{padding:0 15px 13px 51px;border-top:1px solid ${T.border};}
.pick-expanded .drill-notes{margin-top:8px;}

/* Batting toggle */
.bat-toggle{background:${T.surface};border:1.5px solid ${BAT_COLOR.border};border-radius:12px;padding:15px 16px;margin-bottom:12px;cursor:pointer;transition:all 0.15s;user-select:none;}
.bat-toggle.active{background:${BAT_COLOR.bg};}
.bat-toggle-header{display:flex;align-items:center;gap:12px;}
.bat-check{width:24px;height:24px;border-radius:6px;border:2px solid ${BAT_COLOR.border};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:13px;transition:all 0.15s;}
.bat-toggle.active .bat-check{background:${BAT_COLOR.text};border-color:${BAT_COLOR.text};color:#fff;}
.bat-title{font-family:'Oswald',sans-serif;font-size:16px;font-weight:600;color:${BAT_COLOR.text};}
.bat-sub{font-size:12px;color:${T.textMuted};margin-top:2px;}
.bat-detail{margin-top:10px;padding-top:10px;border-top:1px solid ${BAT_COLOR.border};}
.bat-note{font-size:13px;color:${T.noteText};padding:2px 0;}
.bat-note::before{content:"· ";color:${BAT_COLOR.text};font-weight:700;}

/* Parallel schedule */
.schedule-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px;}
.schedule-col-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${T.textDim};margin-bottom:6px;display:flex;align-items:center;gap:5px;}
.bat-station{background:${BAT_COLOR.bg};border:1.5px solid ${BAT_COLOR.border};border-radius:10px;padding:12px;}
.bat-station-title{font-family:'Oswald',sans-serif;font-size:14px;font-weight:700;color:${BAT_COLOR.text};margin-bottom:6px;display:flex;align-items:center;gap:6px;}
.bat-station-note{font-size:12px;color:${T.noteText};padding:2px 0;}
.bat-station-note::before{content:"· ";color:${BAT_COLOR.text};font-weight:700;}

/* Timeline */
.tl{margin-top:10px;}
.tl-row{display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid ${T.border};}
.tl-row:last-child{border-bottom:none;}
.tl-dot{width:7px;height:7px;border-radius:50%;background:${T.steel};flex-shrink:0;}
.tl-time{font-size:12px;font-weight:600;color:${T.steel};width:130px;flex-shrink:0;}
.tl-label{font-size:14px;color:${T.text};flex:1;}
.tl-dur{font-size:11px;color:${T.textDim};}

/* Plan cards */
.plan-card{background:${T.surface};border:1.5px solid ${T.border};border-radius:14px;padding:18px;margin-bottom:12px;transition:background 0.25s;}
.plan-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;gap:12px;}
.plan-date{font-family:'Oswald',sans-serif;font-size:18px;font-weight:600;color:${T.text};line-height:1.15;}
.plan-time-sub{font-size:12px;color:${T.textDim};margin-top:3px;}
.plan-actions{display:flex;gap:7px;flex-shrink:0;}
.plan-meta-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px;}
.drill-count-badge{display:inline-flex;align-items:center;gap:5px;background:${T.steelDim};border:1px solid ${T.border};color:${T.steel};border-radius:5px;padding:3px 9px;font-size:12px;font-weight:700;}
.plan-drills{}
.plan-drill-row{padding:12px 0;border-bottom:1px solid ${T.border};}
.plan-drill-row:last-child{border-bottom:none;}
.plan-drill-time-row{display:flex;align-items:center;gap:10px;margin-bottom:6px;}
.plan-drill-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.plan-drill-time{font-size:12px;font-weight:600;color:${T.steel};width:130px;flex-shrink:0;}
.plan-drill-name{font-family:'Oswald',sans-serif;font-size:16px;font-weight:600;color:${T.text};}
.plan-drill-meta{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:5px 0 5px 18px;}
.plan-drill-notes{list-style:none;padding:0;margin:4px 0 0 18px;}
.plan-drill-notes li{font-size:13px;color:${T.noteText};padding:2px 0;}

/* Parallel plan layout */
.plan-parallel-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;}
.plan-parallel-col{}
.plan-parallel-col-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${T.textDim};margin-bottom:6px;display:flex;align-items:center;gap:5px;}
.plan-bat-card{background:${BAT_COLOR.bg};border:1.5px solid ${BAT_COLOR.border};border-radius:10px;padding:12px;}
.plan-bat-title{font-family:'Oswald',sans-serif;font-size:14px;font-weight:700;color:${BAT_COLOR.text};margin-bottom:6px;display:flex;align-items:center;gap:5px;}
.plan-bat-note{font-size:12px;color:${T.noteText};padding:2px 0;}
.plan-bat-note::before{content:"· ";color:${BAT_COLOR.text};font-weight:700;}

.divider-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.3px;color:${T.textDim};margin:18px 0 10px;}
.empty{text-align:center;padding:48px 24px;color:${T.textDim};}
.empty p{font-size:14px;line-height:1.7;margin-top:10px;}
.overlay{position:fixed;inset:0;background:${T.overlayBg};z-index:200;display:flex;align-items:flex-end;justify-content:center;}
.modal{background:${T.modalBg};border-radius:20px 20px 0 0;border:1px solid ${T.border};border-bottom:none;padding:22px 18px 36px;width:100%;max-width:680px;max-height:88vh;overflow-y:auto;box-shadow:0 -16px 48px rgba(6,10,20,0.4);}
.modal-handle{width:38px;height:4px;background:${T.border};border-radius:2px;margin:0 auto 18px;}
.modal-title{font-family:'Oswald',sans-serif;font-size:20px;color:${T.text};margin-bottom:16px;}
.toast{position:fixed;bottom:84px;left:50%;transform:translateX(-50%);background:${T.toastBg};border:1px solid ${T.steel};color:#fff;padding:10px 20px;border-radius:40px;font-size:14px;font-weight:500;white-space:nowrap;box-shadow:0 8px 24px rgba(6,10,20,0.3);z-index:500;animation:toastIn 0.2s ease;}
@keyframes toastIn{from{transform:translateX(-50%) translateY(8px);opacity:0;}to{transform:translateX(-50%) translateY(0);opacity:1;}}

/* ═══ MOBILE SHARE VIEW ═══════════════════════════════════════════ */
.mv-shell{min-height:100vh;background:${T.bg};font-family:'Source Sans 3',sans-serif;}
.mv-inner{max-width:680px;margin:0 auto;}
.mv-header{background:${T.isDark?"linear-gradient(160deg,#090e1a 0%,#111827 100%)":T.surface};padding:18px;border-bottom:2px solid ${T.steel};display:flex;align-items:center;gap:14px;}
.mv-logo{width:64px;height:64px;object-fit:contain;flex-shrink:0;filter:drop-shadow(0 2px 8px rgba(95,141,181,0.4));}
.mv-team{font-family:'Oswald',sans-serif;font-size:10px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:${T.steel};margin-bottom:3px;}
.mv-date{font-family:'Oswald',sans-serif;font-size:20px;font-weight:700;color:${T.text};line-height:1.15;}
.mv-kick{font-size:13px;color:${T.textMuted};margin-top:4px;}
.mv-start-wrap{padding:14px 18px;background:${T.steelDim};border-bottom:1px solid ${T.border};display:flex;justify-content:center;}
.mv-start-btn{display:flex;align-items:center;gap:9px;background:${T.steel};color:#fff;border:none;border-radius:10px;padding:13px 36px;font-family:'Oswald',sans-serif;font-size:18px;font-weight:600;cursor:pointer;transition:background 0.15s;box-shadow:0 4px 20px rgba(95,141,181,0.3);}
.mv-start-btn:hover{opacity:0.88;}
.mv-timer{background:${T.steel};padding:12px 18px;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.mv-timer-block-name{font-family:'Oswald',sans-serif;font-size:15px;font-weight:600;color:#fff;}
.mv-timer-of{font-size:12px;color:rgba(255,255,255,0.65);margin-top:1px;}
.mv-timer-digits{font-family:'Oswald',sans-serif;font-size:32px;font-weight:700;color:#fff;letter-spacing:2px;text-align:center;}
.mv-timeup{font-size:10px;font-weight:700;color:#ffe0e0;text-align:center;margin-top:1px;}
.mv-next-btn{display:flex;align-items:center;gap:6px;background:rgba(0,0,0,0.22);color:#fff;border:none;border-radius:8px;padding:9px 14px;font-family:'Oswald',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:background 0.15s;white-space:nowrap;}
.mv-next-btn:hover{background:rgba(0,0,0,0.35);}
.mv-next-btn.finish{background:#3dba7a;}
.mv-prog-wrap{height:4px;background:${T.isDark?"rgba(255,255,255,0.15)":T.border};}
.mv-prog-fill{height:4px;background:${T.steel};transition:width 0.5s linear;}
.mv-blocks{padding:12px 14px 48px;}
.mv-block{background:${T.surface};border-radius:12px;margin-bottom:10px;border:1.5px solid ${T.border};overflow:hidden;transition:border-color 0.2s;}
.mv-block.current{box-shadow:0 0 0 3px ${T.steelDim};}
.mv-block.done{opacity:0.42;}
.mv-block-hd{display:flex;align-items:center;gap:11px;padding:13px 15px;cursor:pointer;}
.mv-idx{width:28px;height:28px;border-radius:50%;background:${T.steelDim};display:flex;align-items:center;justify-content:center;font-family:'Oswald',sans-serif;font-size:13px;font-weight:700;color:${T.textMuted};flex-shrink:0;}
.mv-block.current .mv-idx{background:${T.steel};color:#fff;}
.mv-block.done    .mv-idx{background:#3dba7a;color:#fff;}
.mv-block-info{flex:1;min-width:0;}
.mv-block-name{font-family:'Oswald',sans-serif;font-size:17px;font-weight:600;color:${T.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.mv-block.current .mv-block-name{color:${T.steel};}
.mv-block-time{font-size:12px;color:${T.textMuted};margin-top:2px;}
.mv-block-dur{font-size:13px;color:${T.textDim};flex-shrink:0;display:flex;align-items:center;gap:3px;}
.mv-block-detail{padding:0 15px 14px 54px;border-top:1px solid ${T.border};}
.mv-dl{margin-top:10px;}
.mv-dl-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:${T.textDim};margin-bottom:6px;}
.mv-chips{display:flex;gap:7px;flex-wrap:wrap;}
.mv-chip{display:flex;align-items:center;gap:4px;background:${T.steelDim};color:${T.steel};border-radius:5px;padding:3px 9px;font-size:12px;font-weight:600;}
.mv-notes{list-style:none;padding:0;}
.mv-notes li{font-size:13px;color:${T.noteText};padding:4px 0;border-bottom:1px solid ${T.border};}
.mv-notes li:last-child{border-bottom:none;}
.mv-vid{display:inline-flex;align-items:center;gap:7px;background:${T.steelDim};border:1px solid ${T.border};border-radius:7px;padding:8px 13px;color:${T.steel};text-decoration:none;font-size:13px;font-weight:500;margin-top:10px;transition:background 0.15s;}
.mv-vid:hover{opacity:0.8;}

/* Batting station on share page */
.mv-bat-station{background:${BAT_COLOR.bg};border:1.5px solid ${BAT_COLOR.border};border-radius:12px;padding:15px;margin-bottom:10px;}
.mv-bat-header{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
.mv-bat-icon{width:28px;height:28px;border-radius:50%;background:${BAT_COLOR.text};display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.mv-bat-title{font-family:'Oswald',sans-serif;font-size:17px;font-weight:700;color:${BAT_COLOR.text};}
.mv-bat-sub{font-size:12px;color:${T.textMuted};}
.mv-bat-notes{list-style:none;padding:0;margin-top:8px;}
.mv-bat-notes li{font-size:13px;color:${T.noteText};padding:4px 0;border-bottom:1px solid ${BAT_COLOR.border};}
.mv-bat-notes li:last-child{border-bottom:none;}
.mv-bat-notes li::before{content:"· ";color:${BAT_COLOR.text};font-weight:700;}
.mv-parallel-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.3px;color:${T.textDim};margin:16px 0 8px;display:flex;align-items:center;gap:6px;}
.mv-parallel-label::after{content:'';flex:1;height:1px;background:${T.border};}

.mv-done{margin:0 0 14px;background:${T.isDark?"linear-gradient(135deg,rgba(61,186,122,0.12),rgba(26,120,74,0.18))":"rgba(26,120,74,0.08)"};border:1px solid rgba(61,186,122,0.35);border-radius:14px;padding:24px;text-align:center;}
.mv-done-logo{width:68px;height:68px;object-fit:contain;margin-bottom:10px;}
.mv-done-title{font-family:'Oswald',sans-serif;font-size:24px;font-weight:700;color:${T.text};}
.mv-done-sub{font-size:13px;color:${T.textMuted};margin-top:6px;}

@media(max-width:400px){.mv-date{font-size:17px;}.mv-timer-digits{font-size:26px;}.schedule-grid{grid-template-columns:1fr;}.plan-parallel-grid{grid-template-columns:1fr;}}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px;}
`;}

// ─── Tab-safe countdown ───────────────────────────────────────────────────────
function useCountdown({totalSeconds,running,onExpire}){
  const[secsLeft,setSecsLeft]=useState(totalSeconds);
  const endTimeRef=useRef(null),expiredRef=useRef(false),rafRef=useRef(null);
  useEffect(()=>{
    cancelAnimationFrame(rafRef.current);expiredRef.current=false;
    if(running&&totalSeconds>0){endTimeRef.current=Date.now()+totalSeconds*1000;setSecsLeft(totalSeconds);}
    else{endTimeRef.current=null;setSecsLeft(totalSeconds);}
  },[totalSeconds,running]);
  useEffect(()=>{
    if(!running)return;
    function tick(){
      const r=Math.max(0,Math.ceil((endTimeRef.current-Date.now())/1000));setSecsLeft(r);
      if(r<=0){if(!expiredRef.current){expiredRef.current=true;onExpire&&onExpire();}return;}
      rafRef.current=requestAnimationFrame(tick);
    }
    rafRef.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(rafRef.current);
  },[running,onExpire]);
  useEffect(()=>{
    function onVis(){
      if(!running||!endTimeRef.current)return;
      const r=Math.max(0,Math.ceil((endTimeRef.current-Date.now())/1000));setSecsLeft(r);
      if(r<=0&&!expiredRef.current){expiredRef.current=true;onExpire&&onExpire();}
    }
    document.addEventListener("visibilitychange",onVis);
    return()=>document.removeEventListener("visibilitychange",onVis);
  },[running,onExpire]);
  return secsLeft;
}

// ─── MOBILE VIEW ──────────────────────────────────────────────────────────────
function MobileView({plan,T}){
  const blocks=buildSchedule(plan.start||"17:00",plan.drills||[]);
  const totalMins=blocks.reduce((s,b)=>s+b.dur,0);
  const hasBat=!!plan.battingParallel;

  const[started,setStarted]=useState(false);
  const[cur,setCur]=useState(0);
  const[running,setRunning]=useState(false);
  const[open,setOpen]=useState(null);
  const[done,setDone]=useState(false);
  const[expired,setExpired]=useState(false);

  const currentDur=started&&!done?blocks[cur].dur*60:0;
  const handleExpire=useCallback(()=>setExpired(true),[]);
  const secsLeft=useCountdown({totalSeconds:currentDur,running,onExpire:handleExpire});

  function launch(i){setExpired(false);setCur(i);setRunning(true);setOpen(i);}
  function start(){setStarted(true);launch(0);}
  function next(){setRunning(false);const n=cur+1;if(n<blocks.length){setTimeout(()=>launch(n),50);}else{setDone(true);}}

  const mm=Math.floor(secsLeft/60),ss=secsLeft%60;
  const prog=currentDur>0?((currentDur-secsLeft)/currentDur)*100:0;

  return(
    <div className="mv-shell">
      <div className="mv-inner">
        <div className="mv-header">
          <img src={LOGO} alt="Panthers" className="mv-logo"/>
          <div>
            <div className="mv-team">Kitchener Panthers · U8 Tier 1</div>
            <div className="mv-date">{dateLabel(plan.date)}</div>
            <div className="mv-kick">{fmt(...(plan.start||"17:00").split(":").map(Number))} · {totalMins} min</div>
          </div>
        </div>

        {!started&&<div className="mv-start-wrap"><button className="mv-start-btn" onClick={start}><Ico name="play" size={20}/> Start Practice Timer</button></div>}

        {started&&!done&&(
          <>
            <div className="mv-timer">
              <div><div className="mv-timer-block-name">{blocks[cur].label}</div><div className="mv-timer-of">Block {cur+1} / {blocks.length}</div></div>
              <div><div className="mv-timer-digits">{String(mm).padStart(2,"0")}:{String(ss).padStart(2,"0")}</div>{expired&&<div className="mv-timeup">TIME'S UP</div>}</div>
              <button className={`mv-next-btn${expired?" finish":""}`} onClick={next}>
                <Ico name={cur<blocks.length-1?"skip":"check"} size={15}/>{cur<blocks.length-1?"Next":"Finish"}
              </button>
            </div>
            <div className="mv-prog-wrap"><div className="mv-prog-fill" style={{width:`${prog}%`}}/></div>
          </>
        )}

        <div className="mv-blocks">
          {done&&(
            <div className="mv-done">
              <img src={LOGO} alt="Panthers" className="mv-done-logo"/>
              <div className="mv-done-title">Practice Complete!</div>
              <div className="mv-done-sub">Great work, Kitchener Panthers!</div>
            </div>
          )}

          {/* Batting parallel station — shown at top */}
          {hasBat&&(
            <>
              <div className="mv-parallel-label"><Ico name="layers" size={12}/> Parallel Station — Runs All Practice</div>
              <div className="mv-bat-station">
                <div className="mv-bat-header">
                  <div className="mv-bat-icon"><Ico name="bat" size={14}/></div>
                  <div>
                    <div className="mv-bat-title">Batting Practice</div>
                    <div className="mv-bat-sub">Runs simultaneously with all drills · rotate through</div>
                  </div>
                </div>
                <ul className="mv-bat-notes">
                  {BAT_DRILL.notes.split("\n").map((n,i)=><li key={i}>{n}</li>)}
                </ul>
              </div>
              <div className="mv-parallel-label" style={{marginTop:16}}><Ico name="dumbbell" size={12}/> Main Drill Rotation</div>
            </>
          )}

          {blocks.map((b,i)=>{
            const isCur=started&&!done&&i===cur;
            const isDone=started&&(done||i<cur);
            const isOpen=open===i;
            const hasDr=!!b.drill;
            const c=hasDr?(CAT[b.drill.category]||CAT["Hitting"]):null;
            return(
              <div key={i} className={`mv-block${isCur?" current":""}${isDone?" done":""}`}
                style={hasDr&&c?{borderLeftColor:c.border,borderLeftWidth:3}:{}}>
                <div className="mv-block-hd" onClick={()=>hasDr&&setOpen(isOpen?null:i)}>
                  <div className="mv-idx" style={isCur?{}:hasDr&&c?{background:c.bg,color:c.text}:{}}>
                    {isDone?<Ico name="check" size={14}/>:i+1}
                  </div>
                  <div className="mv-block-info">
                    <div className="mv-block-name" style={hasDr&&c&&!isCur?{color:c.text}:{}}>{b.label}</div>
                    <div className="mv-block-time">{b.start} – {b.end}</div>
                  </div>
                  <div className="mv-block-dur">{b.dur}m {hasDr&&<Ico name={isOpen?"chevUp":"chevDown"} size={13}/>}</div>
                </div>
                {hasDr&&isOpen&&(
                  <div className="mv-block-detail">
                    <div className="mv-dl">
                      <div className="mv-chips">
                        <CatChip cat={b.drill.category} small/>
                        <span className="mv-chip"><Ico name="users" size={11}/>{b.drill.players} players</span>
                        <span className="mv-chip"><Ico name="clock" size={11}/>{b.drill.duration||20}m</span>
                        {b.drill.venue&&b.drill.venue!=="Both"&&<VenueChip venue={b.drill.venue} small/>}
                      </div>
                    </div>
                    {b.drill.notes&&(
                      <div className="mv-dl">
                        <div className="mv-dl-label">Instructions</div>
                        <ul className="mv-notes">{b.drill.notes.split("\n").filter(Boolean).map((n,j)=><li key={j}>{n}</li>)}</ul>
                      </div>
                    )}
                    {b.drill.video&&<a href={b.drill.video} target="_blank" rel="noopener noreferrer" className="mv-vid"><Ico name="video" size={14}/> Watch Drill Video</a>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Filter bars ──────────────────────────────────────────────────────────────
function CatFilter({active,onChange}){
  return(
    <div className="filter-bar">
      <button className={`filter-pill${active==="All"?" all-active":""}`} onClick={()=>onChange("All")}>All</button>
      {CATS.map(cat=>{const c=CAT[cat],isA=active===cat;return(
        <button key={cat} className="filter-pill" onClick={()=>onChange(isA?"All":cat)}
          style={isA?{background:c.bg,borderColor:c.border,color:c.text}:{}}>{cat}</button>
      );})}
    </div>
  );
}
function PlayerFilter({active,onChange}){
  return(
    <div className="filter-row">
      <span className="filter-group-label"><Ico name="users" size={11}/> Players:</span>
      {PLAYER_FILTERS.map(f=>{const isA=active===f;return(
        <button key={f} className={`filter-pill${isA?" all-active":""}`} onClick={()=>onChange(isA&&f!=="Any"?"Any":f)}
          style={{padding:"4px 10px",fontSize:11}}>{f}</button>
      );})}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function PracticePlanner(){
  const today=new Date().toISOString().split("T")[0];

  const[shared]=useState(()=>{try{const p=new URLSearchParams(window.location.search).get("p");return p?decodePlan(p):null;}catch{return null;}});
  const[dark,setDark]=useState(()=>load("pp_dark",true));
  const T=makeTheme(dark);

  useEffect(()=>{
    let el=document.getElementById("pp-css");
    if(!el){el=document.createElement("style");el.id="pp-css";document.head.appendChild(el);}
    el.textContent=makeCSS(T);
  },[dark]);
  useEffect(()=>save("pp_dark",dark),[dark]);

  const[tab,setTab]=useState("drills");
  const[drills,setDrills]=useState(()=>load("pp_drills",[]));
  const[plans,setPlans]=useState(()=>load("pp_plans",[]));
  const[recentIds,setRecentIds]=useState(()=>load("pp_recent",[]));
  const toast=useToast();

  const[drillFilter,setDrillFilter]=useState("All");
  const[createCatFilter,setCreateCatFilter]=useState("All");
  const[createPlayerFilter,setCreatePlayerFilter]=useState("Any");
  const[expandedPicks,setExpandedPicks]=useState({});

  useEffect(()=>save("pp_drills",drills),[drills]);
  useEffect(()=>save("pp_plans",plans),[plans]);
  useEffect(()=>save("pp_recent",recentIds),[recentIds]);

  // Drill form
  const[editId,setEditId]=useState(null);
  const[dName,setDName]=useState("");
  const[dCat,setDCat]=useState("Hitting");
  const[dPlay,setDPlay]=useState(8);
  const[dDur,setDDur]=useState(20);
  const[dVenue,setDVenue]=useState("Both");
  const[dNotes,setDNotes]=useState("");
  const[dVideo,setDVideo]=useState("");
  const[showForm,setShowForm]=useState(false);

  // Practice form
  const[pDate,setPDate]=useState(today);
  const[pTime,setPTime]=useState("17:00");
  const[picked,setPicked]=useState([]);
  const[battingParallel,setBattingParallel]=useState(false);

  // Edit plan
  const[editPlan,setEditPlan]=useState(null);
  const[ePDate,setEPDate]=useState("");
  const[ePTime,setEPTime]=useState("");
  const[ePicked,setEPicked]=useState([]);
  const[eBat,setEBat]=useState(false);

  if(shared)return<MobileView plan={shared} T={T}/>;

  // Drill fns
  function resetForm(){setEditId(null);setDName("");setDCat("Hitting");setDPlay(8);setDDur(20);setDVenue("Both");setDNotes("");setDVideo("");setShowForm(false);}
  function openEdit(d){setEditId(d.id);setDName(d.name);setDCat(d.category);setDPlay(d.players);setDDur(d.duration||20);setDVenue(d.venue||"Both");setDNotes(d.notes||"");setDVideo(d.video||"");setShowForm(true);window.scrollTo({top:0,behavior:"smooth"});}
  function saveDrill(){
    if(!dName.trim())return toast.show("Enter a drill name");
    const dr={id:editId||Date.now(),name:dName.trim(),category:dCat,players:dPlay,duration:dDur,venue:dVenue,notes:dNotes,video:dVideo};
    setDrills(prev=>editId?prev.map(d=>d.id===editId?dr:d):[...prev,dr]);
    toast.show(editId?"Drill updated":"Drill saved");resetForm();
  }
  function delDrill(id){if(!window.confirm("Delete this drill?"))return;setDrills(prev=>prev.filter(d=>d.id!==id));setRecentIds(prev=>prev.filter(x=>x!==id));toast.show("Drill deleted");}

  // Practice fns
  function togglePick(d){setPicked(prev=>prev.find(p=>p.id===d.id)?prev.filter(p=>p.id!==d.id):prev.length>=3?(toast.show("Max 3 drills"),prev):[...prev,d]);}
  function savePractice(){
    if(!picked.length)return toast.show("Pick at least one drill");
    setPlans(prev=>[{id:Date.now(),date:pDate,start:pTime,drills:picked,battingParallel},...prev]);
    setRecentIds(prev=>[...new Set([...picked.map(d=>d.id),...prev])].slice(0,6));
    setPicked([]);setPDate(today);setPTime("17:00");setBattingParallel(false);
    toast.show("Practice saved");setTab("plans");
  }
  function delPlan(id){if(!window.confirm("Delete this plan?"))return;setPlans(prev=>prev.filter(p=>p.id!==id));toast.show("Deleted");}
  function openEditPlan(p){setEditPlan(p);setEPDate(p.date);setEPTime(p.start);setEPicked([...p.drills]);setEBat(!!p.battingParallel);}
  function toggleEPick(d){setEPicked(prev=>prev.find(p=>p.id===d.id)?prev.filter(p=>p.id!==d.id):prev.length>=3?(toast.show("Max 3 drills"),prev):[...prev,d]);}
  function saveEditPlan(){
    if(!ePicked.length)return toast.show("Pick at least one drill");
    setPlans(prev=>prev.map(p=>p.id===editPlan.id?{...p,date:ePDate,start:ePTime,drills:ePicked,battingParallel:eBat}:p));
    setEditPlan(null);toast.show("Practice updated");
  }
  function copyLink(plan){const url=shareUrl(plan);navigator.clipboard.writeText(url).then(()=>toast.show("Link copied! 📋")).catch(()=>toast.show("Copy: "+url));}

  function togglePickExpand(id){setExpandedPicks(prev=>({...prev,[id]:!prev[id]}));}

  const applyFilters=(list,catF,playerF)=>list.filter(d=>(catF==="All"||d.category===catF)&&matchesPlayerFilter(d,playerF));
  const filteredDrills=applyFilters(drills,drillFilter,"Any");
  const recentDrills=drills.filter(d=>recentIds.includes(d.id)).sort((a,b)=>recentIds.indexOf(a.id)-recentIds.indexOf(b.id));
  const otherDrills=drills.filter(d=>!recentIds.includes(d.id));

  function DrillCard({d}){
    const c=CAT[d.category]||CAT["Hitting"];
    return(
      <div className="drill-item" style={{borderLeftColor:c.border,borderLeftWidth:3}}>
        <div className="drill-item-header">
          <div style={{flex:1}}>
            <div className="drill-name">{d.name}</div>
            <div className="meta-chips">
              <CatChip cat={d.category}/>
              <span className="player-chip"><Ico name="users" size={11}/>{d.players} players</span>
              <span className="dur-chip"><Ico name="clock" size={11}/>{d.duration||20}m</span>
              {d.venue&&d.venue!=="Both"&&<VenueChip venue={d.venue}/>}
            </div>
            {d.notes&&<ul className="drill-notes">{d.notes.split("\n").filter(Boolean).slice(0,3).map((n,i)=><li key={i}><span style={{color:c.text}}>· </span><span style={{color:T.noteText}}>{n}</span></li>)}</ul>}
            {d.video&&<a href={d.video} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,color:c.text,marginTop:6,textDecoration:"none"}}><Ico name="video" size={13}/> Watch video</a>}
          </div>
          <div className="drill-actions">
            <button className="icon-btn" onClick={()=>openEdit(d)}><Ico name="pencil" size={15}/></button>
            <button className="icon-btn danger" onClick={()=>delDrill(d.id)}><Ico name="trash" size={15}/></button>
          </div>
        </div>
      </div>
    );
  }

  function PickItem({d,sel,idx,onToggle}){
    const c=CAT[d.category]||CAT["Hitting"];
    const isExpanded=!!expandedPicks[d.id];
    return(
      <div className={`pick-item${sel?" picked":""}`} style={sel?{}:{borderLeftColor:c.border,borderLeftWidth:3}}>
        <div className="pick-header" onClick={()=>onToggle(d)}>
          <div className="pick-circle">{sel?"✓":""}</div>
          <div className="pick-info">
            <div className="pick-name">{d.name}</div>
            <div className="pick-meta">
              <CatChip cat={d.category} small/>
              <span className="player-chip" style={{fontSize:11,padding:"2px 7px"}}>{d.players}p</span>
              <span className="dur-chip" style={{fontSize:11,padding:"2px 7px"}}>{d.duration||20}m</span>
              {d.venue&&d.venue!=="Both"&&<VenueChip venue={d.venue} small/>}
            </div>
          </div>
          {sel&&<div className="pick-num">#{idx+1}</div>}
          <button className="pick-expand-btn" onClick={e=>{e.stopPropagation();togglePickExpand(d.id);}}>
            <Ico name={isExpanded?"chevUp":"chevDown"} size={11}/>
            {isExpanded?"Less":"Details"}
          </button>
        </div>
        {isExpanded&&(
          <div className="pick-expanded">
            {d.notes&&<ul className="drill-notes">{d.notes.split("\n").filter(Boolean).map((n,i)=><li key={i}><span style={{color:c.text}}>· </span><span style={{color:T.noteText}}>{n}</span></li>)}</ul>}
            {d.video&&<a href={d.video} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,color:c.text,marginTop:8,textDecoration:"none"}}><Ico name="video" size={13}/> Watch video</a>}
            {!d.notes&&!d.video&&<span style={{fontSize:12,color:T.textDim}}>No additional details.</span>}
          </div>
        )}
      </div>
    );
  }

  const navTabs=[{id:"drills",label:"Drills",icon:"dumbbell"},{id:"create",label:"Create",icon:"calPlus"},{id:"plans",label:"Plans",icon:"calDays"}];

  return(
    <div className="app">
      <div className="top-bar">
        <img src={LOGO} alt="Panthers"/>
        <div><div className="top-bar-title">Panthers Planner</div><div className="top-bar-sub">U8 Tier 1 · Kitchener</div></div>
        <button className="theme-btn" onClick={()=>setDark(d=>!d)} title="Toggle light/dark"><Ico name={dark?"sun":"moon"} size={17}/></button>
      </div>

      <div className="scroll-area">

        {/* ══ DRILLS ══════════════════════════════════════════════ */}
        {tab==="drills"&&(
          <>
            <div className="section-title">Drill Library</div>
            <div className="section-sub">Build and manage your team's drills</div>

            {/* Small "add" button */}
            {!showForm&&(
              <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
                <button className="btn btn-primary btn-sm" onClick={()=>{resetForm();setShowForm(true);}}>
                  <Ico name="plus" size={14}/> Add Drill
                </button>
              </div>
            )}

            {showForm&&(
              <div className="card" style={{marginBottom:14}}>
                <div className="card-title">{editId?"Edit Drill":"New Drill"}</div>
                <div className="field"><label className="label">Drill Name</label><input className="input" placeholder="e.g. Tee Work" value={dName} onChange={e=>setDName(e.target.value)}/></div>
                <div className="row2" style={{marginBottom:14}}>
                  <div><label className="label">Category</label><select className="select" value={dCat} onChange={e=>setDCat(e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
                  <div><label className="label">Players</label><select className="select" value={dPlay} onChange={e=>setDPlay(Number(e.target.value))}>{Array.from({length:20},(_,i)=>i+1).map(n=><option key={n}>{n}</option>)}</select></div>
                </div>
                <div className="field"><label className="label">Duration</label><div className="dur-picker">{DURATIONS.map(d=><button key={d} className={`dur-btn${dDur===d?" dur-active":""}`} onClick={()=>setDDur(d)}>{d}m</button>)}</div></div>
                <div className="field"><label className="label">Venue</label><div className="venue-picker">{VENUE_OPTIONS.map(v=>{const vc=VENUE_COLORS[v],isA=dVenue===v;return<button key={v} className="venue-btn" style={isA?{background:vc.bg,borderColor:vc.border,color:vc.text}:{}} onClick={()=>setDVenue(v)}><Ico name={VENUE_ICONS[v]} size={16}/>{v}</button>;})}</div></div>
                <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><CatChip cat={dCat}/>{dVenue!=="Both"&&<VenueChip venue={dVenue}/>}<span className="dur-chip">{dDur}m</span></div>
                <div className="field"><label className="label">Instructions (one per line)</label><textarea className="textarea" placeholder={"Keep your eye on the ball\nFollow through on your swing"} value={dNotes} onChange={e=>setDNotes(e.target.value)}/></div>
                <div className="field"><label className="label">Video Link (optional)</label><input className="input" placeholder="https://youtube.com/..." value={dVideo} onChange={e=>setDVideo(e.target.value)}/></div>
                <div className="btn-row">
                  <button className="btn btn-primary" onClick={saveDrill}>{editId?"Update":"Save Drill"}</button>
                  <button className="btn btn-ghost" onClick={resetForm}><Ico name="x" size={15}/> Cancel</button>
                </div>
              </div>
            )}

            <CatFilter active={drillFilter} onChange={setDrillFilter}/>
            {filteredDrills.length===0?(
              <div className="empty"><Ico name="dumbbell" size={36}/><p>{drills.length===0?"No drills yet.\nTap Add Drill to create your first.":`No ${drillFilter} drills found.`}</p></div>
            ):filteredDrills.map(d=><DrillCard key={d.id} d={d}/>)}
          </>
        )}

        {/* ══ CREATE ══════════════════════════════════════════════ */}
        {tab==="create"&&(
          <>
            <div className="section-title">Create Practice</div>
            <div className="section-sub">Pick a date, time, and up to 3 drills</div>
            <div className="card">
              <div className="row2">
                <div><label className="label">Date</label><input type="date" className="input" value={pDate} onChange={e=>setPDate(e.target.value)}/></div>
                <div><label className="label">Start Time</label><input type="time" className="input" value={pTime} onChange={e=>setPTime(e.target.value)}/></div>
              </div>
            </div>

            <div className="divider-label">Select Drills ({picked.length}/3)</div>

            {/* Filters */}
            <CatFilter active={createCatFilter} onChange={setCreateCatFilter}/>
            <PlayerFilter active={createPlayerFilter} onChange={setCreatePlayerFilter}/>

            {drills.length===0?(
              <div className="empty" style={{padding:"28px 0"}}><Ico name="dumbbell" size={32}/><p>Add drills in the Drills tab first.</p></div>
            ):(()=>{
              const filtRecent=applyFilters(recentDrills,createCatFilter,createPlayerFilter);
              const filtOther=applyFilters(otherDrills,createCatFilter,createPlayerFilter);
              return(
                <>
                  {filtRecent.length>0&&(
                    <>
                      <div className="recent-label"><Ico name="star" size={12}/> Recently Used</div>
                      {filtRecent.map(d=><PickItem key={d.id} d={d} sel={!!picked.find(p=>p.id===d.id)} idx={picked.findIndex(p=>p.id===d.id)} onToggle={togglePick}/>)}
                      {filtOther.length>0&&<div className="divider-label" style={{marginTop:12}}>All Drills</div>}
                    </>
                  )}
                  {filtOther.map(d=><PickItem key={d.id} d={d} sel={!!picked.find(p=>p.id===d.id)} idx={picked.findIndex(p=>p.id===d.id)} onToggle={togglePick}/>)}
                  {filtRecent.length===0&&filtOther.length===0&&<div className="empty" style={{padding:"24px 0"}}><Ico name="filter" size={28}/><p>No drills match these filters.</p></div>}
                </>
              );
            })()}

            {/* Batting parallel toggle */}
            <div className="divider-label" style={{marginTop:20}}>Parallel Station</div>
            <div className={`bat-toggle${battingParallel?" active":""}`} onClick={()=>setBattingParallel(b=>!b)}>
              <div className="bat-toggle-header">
                <div className="bat-check">{battingParallel?"✓":""}</div>
                <div>
                  <div className="bat-title"><Ico name="bat" size={15}/> Add Batting Practice Station</div>
                  <div className="bat-sub">Runs in parallel with all drills — players rotate through</div>
                </div>
              </div>
              {battingParallel&&(
                <div className="bat-detail">
                  <ul style={{listStyle:"none",padding:0}}>
                    {BAT_DRILL.notes.split("\n").map((n,i)=><li key={i} className="bat-note">{n}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Schedule preview */}
            {picked.length>0&&(
              <>
                <div className="divider-label" style={{marginTop:20}}>Schedule Preview</div>
                {battingParallel?(
                  <div className="card">
                    <div className="schedule-grid">
                      <div>
                        <div className="schedule-col-label"><Ico name="dumbbell" size={11}/> Main Drills</div>
                        <div className="tl">
                          {buildSchedule(pTime,picked).map((b,i)=>(
                            <div key={i} className="tl-row">
                              <div className="tl-dot" style={b.drill?(()=>{const c=CAT[b.drill.category]||CAT["Hitting"];return{background:c.text};})():{}}/>
                              <div className="tl-time">{b.start}</div>
                              <div className="tl-label" style={{fontSize:13}}>{b.label}</div>
                              <div className="tl-dur">{b.dur}m</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="schedule-col-label" style={{color:BAT_COLOR.text}}><Ico name="bat" size={11}/> Batting Station</div>
                        <div className="bat-station">
                          <div className="bat-station-title"><Ico name="bat" size={13}/> Batting Practice</div>
                          <div style={{fontSize:12,color:T.textMuted,marginBottom:6}}>Full practice · rotate through</div>
                          {BAT_DRILL.notes.split("\n").map((n,i)=><div key={i} className="bat-station-note">{n}</div>)}
                        </div>
                      </div>
                    </div>
                  </div>
                ):(
                  <div className="card">
                    <div className="tl">
                      {buildSchedule(pTime,picked).map((b,i)=>(
                        <div key={i} className="tl-row">
                          <div className="tl-dot" style={b.drill?(()=>{const c=CAT[b.drill.category]||CAT["Hitting"];return{background:c.text};})():{}}/>
                          <div className="tl-time">{b.start} – {b.end}</div>
                          <div className="tl-label">{b.label}</div>
                          <div className="tl-dur">{b.dur}m</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <button className="btn btn-primary btn-full" style={{marginTop:8}} onClick={savePractice}>
              <Ico name="calPlus" size={16}/> Save Practice Plan
            </button>
          </>
        )}

        {/* ══ PLANS ═══════════════════════════════════════════════ */}
        {tab==="plans"&&(
          <>
            <div className="section-title">Practice Plans</div>
            <div className="section-sub">Tap the share icon to send coaches a mobile link with a live timer</div>
            {plans.length===0?(
              <div className="empty"><Ico name="calDays" size={36}/><p>No plans yet.<br/>Create your first in the Create tab.</p></div>
            ):plans.map(p=>{
              const schedule=buildSchedule(p.start||"17:00",p.drills||[]);
              const totalMins=schedule.reduce((s,b)=>s+b.dur,0);
              const hasBat=!!p.battingParallel;
              return(
                <div key={p.id} className="plan-card">
                  <div className="plan-header">
                    <div>
                      <div className="plan-date">{dateLabel(p.date)}</div>
                      <div className="plan-time-sub">{fmt(...(p.start||"17:00").split(":").map(Number))} · {totalMins} min</div>
                    </div>
                    <div className="plan-actions">
                      <button className="icon-btn" onClick={()=>copyLink(p)} title="Share"><Ico name="share" size={15}/></button>
                      <button className="icon-btn" onClick={()=>openEditPlan(p)} title="Edit"><Ico name="pencil" size={15}/></button>
                      <button className="icon-btn danger" onClick={()=>delPlan(p.id)} title="Delete"><Ico name="trash" size={15}/></button>
                    </div>
                  </div>
                  <div className="plan-meta-row">
                    <span className="drill-count-badge"><Ico name="dumbbell" size={12}/>{(p.drills||[]).length} drill{(p.drills||[]).length!==1?"s":""}</span>
                    {(p.drills||[]).map((d,i)=><CatChip key={i} cat={d.category} small/>)}
                    {hasBat&&<span style={{display:"inline-flex",alignItems:"center",gap:4,background:BAT_COLOR.bg,border:`1px solid ${BAT_COLOR.border}`,color:BAT_COLOR.text,borderRadius:5,padding:"2px 8px",fontSize:11,fontWeight:700}}><Ico name="bat" size={10}/> Batting</span>}
                  </div>

                  {/* Expanded drill list */}
                  {hasBat?(
                    <div className="plan-parallel-grid">
                      {/* Main drills col */}
                      <div className="plan-parallel-col">
                        <div className="plan-parallel-col-label"><Ico name="dumbbell" size={11}/> Main Drills</div>
                        <div className="plan-drills">
                          <div className="plan-drill-row">
                            <div className="plan-drill-time-row">
                              <div className="plan-drill-dot" style={{background:T.steel}}/>
                              <div className="plan-drill-time">{schedule[0].start}</div>
                              <div style={{fontSize:13,color:T.textMuted}}>Warmup · 15m</div>
                            </div>
                          </div>
                          {(p.drills||[]).map((d,i)=>{
                            const c=CAT[d.category]||CAT["Hitting"];
                            const blk=schedule[i+1];
                            return(
                              <div key={i} className="plan-drill-row">
                                <div className="plan-drill-time-row">
                                  <div className="plan-drill-dot" style={{background:c.text}}/>
                                  <div className="plan-drill-time">{blk.start}</div>
                                </div>
                                <div style={{paddingLeft:18}}>
                                  <div className="plan-drill-name">{d.name}</div>
                                  <div className="plan-drill-meta"><CatChip cat={d.category} small/><span className="dur-chip" style={{fontSize:11,padding:"2px 6px"}}>{d.duration||20}m</span></div>
                                  {d.notes&&<ul className="plan-drill-notes">{d.notes.split("\n").filter(Boolean).map((n,j)=><li key={j}><span style={{color:c.text}}>· </span><span style={{color:T.noteText}}>{n}</span></li>)}</ul>}
                                </div>
                              </div>
                            );
                          })}
                          <div className="plan-drill-row">
                            <div className="plan-drill-time-row">
                              <div className="plan-drill-dot" style={{background:T.steel}}/>
                              <div className="plan-drill-time">{schedule[schedule.length-1].start}</div>
                              <div style={{fontSize:13,color:T.textMuted}}>Cool Down · 15m</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Batting col */}
                      <div className="plan-parallel-col">
                        <div className="plan-parallel-col-label" style={{color:BAT_COLOR.text}}><Ico name="bat" size={11}/> Batting Station</div>
                        <div className="plan-bat-card">
                          <div className="plan-bat-title"><Ico name="bat" size={13}/> Batting Practice</div>
                          <div style={{fontSize:11,color:T.textMuted,marginBottom:6}}>Full practice · rotate through</div>
                          {BAT_DRILL.notes.split("\n").map((n,i)=><div key={i} className="plan-bat-note">{n}</div>)}
                          {(p.drills||[]).some(d=>d.video)&&<a href={(p.drills||[]).find(d=>d.video)?.video} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,color:BAT_COLOR.text,marginTop:8,textDecoration:"none"}}><Ico name="video" size={11}/> Video</a>}
                        </div>
                      </div>
                    </div>
                  ):(
                    <div className="plan-drills">
                      <div className="plan-drill-row">
                        <div className="plan-drill-time-row"><div className="plan-drill-dot" style={{background:T.steel}}/><div className="plan-drill-time">{schedule[0].start} – {schedule[0].end}</div><div className="plan-drill-name" style={{color:T.textMuted,fontSize:14}}>Warmup · 15m</div></div>
                      </div>
                      {(p.drills||[]).map((d,i)=>{
                        const c=CAT[d.category]||CAT["Hitting"];const blk=schedule[i+1];
                        return(
                          <div key={i} className="plan-drill-row">
                            <div className="plan-drill-time-row"><div className="plan-drill-dot" style={{background:c.text}}/><div className="plan-drill-time">{blk.start} – {blk.end}</div></div>
                            <div style={{paddingLeft:18}}>
                              <div className="plan-drill-name">{d.name}</div>
                              <div className="plan-drill-meta"><CatChip cat={d.category} small/><span className="player-chip"><Ico name="users" size={11}/>{d.players} players</span><span className="dur-chip"><Ico name="clock" size={11}/>{d.duration||20}m</span>{d.venue&&d.venue!=="Both"&&<VenueChip venue={d.venue} small/>}</div>
                              {d.notes&&<ul className="plan-drill-notes">{d.notes.split("\n").filter(Boolean).map((n,j)=><li key={j}><span style={{color:c.text}}>· </span><span style={{color:T.noteText}}>{n}</span></li>)}</ul>}
                              {d.video&&<a href={d.video} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,color:c.text,marginTop:6,textDecoration:"none"}}><Ico name="video" size={13}/> Watch video</a>}
                            </div>
                          </div>
                        );
                      })}
                      <div className="plan-drill-row">
                        <div className="plan-drill-time-row"><div className="plan-drill-dot" style={{background:T.steel}}/><div className="plan-drill-time">{schedule[schedule.length-1].start} – {schedule[schedule.length-1].end}</div><div className="plan-drill-name" style={{color:T.textMuted,fontSize:14}}>Cool Down · 15m</div></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      <nav className="bottom-nav">
        {navTabs.map(({id,label,icon})=>(
          <button key={id} className={`nav-tab${tab===id?" active":""}`} onClick={()=>setTab(id)}>
            <Ico name={icon} size={22}/>{label}
            {id==="plans"&&plans.length>0&&<span className="nav-badge">{plans.length}</span>}
          </button>
        ))}
      </nav>

      {editPlan&&(
        <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)setEditPlan(null);}}>
          <div className="modal">
            <div className="modal-handle"/>
            <div className="modal-title">Edit Practice</div>
            <div className="row2" style={{marginBottom:14}}>
              <div><label className="label">Date</label><input type="date" className="input" value={ePDate} onChange={e=>setEPDate(e.target.value)}/></div>
              <div><label className="label">Time</label><input type="time" className="input" value={ePTime} onChange={e=>setEPTime(e.target.value)}/></div>
            </div>
            <div className="divider-label">Drills ({ePicked.length}/3)</div>
            {drills.map(d=>{const sel=!!ePicked.find(p=>p.id===d.id);return(
              <div key={d.id} className={`pick-item${sel?" picked":""}`} onClick={()=>toggleEPick(d)}>
                <div className="pick-header">
                  <div className="pick-circle">{sel?"✓":""}</div>
                  <div className="pick-info"><div className="pick-name" style={{marginBottom:4}}>{d.name}</div><div className="pick-meta"><CatChip cat={d.category} small/><span className="dur-chip" style={{fontSize:11,padding:"2px 7px"}}>{d.duration||20}m</span></div></div>
                  {sel&&<div className="pick-num">#{ePicked.findIndex(p=>p.id===d.id)+1}</div>}
                </div>
              </div>
            );})}
            <div className="divider-label">Parallel Station</div>
            <div className={`bat-toggle${eBat?" active":""}`} onClick={()=>setEBat(b=>!b)} style={{marginBottom:14}}>
              <div className="bat-toggle-header">
                <div className="bat-check">{eBat?"✓":""}</div>
                <div><div className="bat-title"><Ico name="bat" size={15}/> Batting Practice Station</div><div className="bat-sub">Runs in parallel with all drills</div></div>
              </div>
            </div>
            <div className="btn-row">
              <button className="btn btn-primary" onClick={saveEditPlan}>Save Changes</button>
              <button className="btn btn-ghost" onClick={()=>setEditPlan(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast.msg&&<div className="toast">{toast.msg}</div>}
    </div>
  );
}
