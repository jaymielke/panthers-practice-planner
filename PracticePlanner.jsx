import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ name, size = 18, stroke = 1.7 }) => {
  const paths = {
    dumbbell:  "M6.5 6.5h11M6.5 17.5h11M3 9.5l3-3m0 11-3-3m18-5-3-3m0 11 3-3M9 12h6",
    calPlus:   "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM12 15v-4m-2 2h4",
    calDays:   "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01",
    pencil:    "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    trash:     "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
    share:     "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
    play:      "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM10 8l6 4-6 4V8z",
    skipFwd:   "M5 4l10 8-10 8V4zM19 4v16",
    skipBack:  "M19 20L9 12l10-8V20zM5 4v16",
    checkmark: "M7 13l3 3 7-7",
    video:     "M23 7l-7 5 7 5V7zM1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
    users:     "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    plus:      "M12 5v14M5 12h14",
    x:         "M18 6 6 18M6 6l12 12",
    chevDown:  "M6 9l6 6 6-6",
    chevUp:    "M18 15l-6-6-6 6",
    filter:    "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    clock:     "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2",
    home:      "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
    sun:       "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z",
    moon:      "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
    star:      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    bat:       "M3 21l4-4M7 17L19 5a2 2 0 0 0-3-3L4 14M17 3l4 4",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]||""}/>
    </svg>
  );
};

// ─── Categories ───────────────────────────────────────────────────────────────
const CAT = {
  "Hitting":      {bg:"rgba(239,107,54,0.18)",  border:"rgba(239,107,54,0.5)",  text:"#ef6b36"},
  "Fielding":     {bg:"rgba(59,185,128,0.18)",  border:"rgba(59,185,128,0.5)",  text:"#3bb980"},
  "Throwing":     {bg:"rgba(100,149,237,0.18)", border:"rgba(100,149,237,0.5)", text:"#6495ed"},
  "Base Running": {bg:"rgba(255,196,0,0.18)",   border:"rgba(255,196,0,0.5)",   text:"#ffc400"},
  "Warmup":       {bg:"rgba(167,139,250,0.18)", border:"rgba(167,139,250,0.5)", text:"#a78bfa"},
  "Catcher":      {bg:"rgba(251,113,133,0.18)", border:"rgba(251,113,133,0.5)", text:"#fb7185"},
  "Pitcher":      {bg:"rgba(34,211,238,0.18)",  border:"rgba(34,211,238,0.5)",  text:"#22d3ee"},
  "Cool Down":    {bg:"rgba(148,163,184,0.18)", border:"rgba(148,163,184,0.5)", text:"#94a3b8"},
};
const CATS=Object.keys(CAT);
const DURATIONS=[10,15,20,30];
const VENUE_OPTIONS=["Both","Indoor","Outdoor"];
const VENUE_ICONS={Indoor:"home",Outdoor:"sun",Both:"star"};
const VENUE_COLORS={
  Indoor: {bg:"rgba(167,139,250,0.15)",border:"rgba(167,139,250,0.4)",text:"#a78bfa"},
  Outdoor:{bg:"rgba(59,185,128,0.15)", border:"rgba(59,185,128,0.4)", text:"#3bb980"},
  Both:   {bg:"rgba(255,196,0,0.15)",  border:"rgba(255,196,0,0.4)",  text:"#ffc400"},
};
const PLAYER_FILTERS=["Any","1–4","5–10","10+"];
const BAT_COLOR={bg:"rgba(239,107,54,0.15)",border:"rgba(239,107,54,0.45)",text:"#ef6b36"};
const BAT_DRILL={id:"batting",name:"Batting Practice",category:"Hitting",notes:"5 minutes per player hitting\nOn Deck: hitting off tee",players:0,duration:0,venue:"Both",video:""};
const LOGO="/KMBA-Panthers-Logo_U8_Tier_1.png";

function matchesPlayerFilter(d,pf){
  if(pf==="Any")return true;const p=d.players||1;
  if(pf==="1–4")return p>=1&&p<=4;if(pf==="5–10")return p>=5&&p<=10;if(pf==="10+")return p>10;return true;
}
function CatChip({cat,small=false}){
  const c=CAT[cat]||CAT["Hitting"];
  return<span style={{display:"inline-flex",alignItems:"center",gap:3,background:c.bg,border:`1px solid ${c.border}`,color:c.text,borderRadius:5,padding:small?"2px 7px":"3px 9px",fontSize:small?11:12,fontWeight:700,whiteSpace:"nowrap"}}>{cat}</span>;
}
function VenueChip({venue,small=false}){
  if(!venue||venue==="Both")return null;
  const v=VENUE_COLORS[venue]||VENUE_COLORS["Both"];
  return<span style={{display:"inline-flex",alignItems:"center",gap:4,background:v.bg,border:`1px solid ${v.border}`,color:v.text,borderRadius:5,padding:small?"2px 7px":"3px 9px",fontSize:small?11:12,fontWeight:700,whiteSpace:"nowrap"}}><Ico name={VENUE_ICONS[venue]||"star"} size={10}/>{venue}</span>;
}

// ─── Supabase ─────────────────────────────────────────────────────────────────
const SB_URL=import.meta.env.VITE_SUPABASE_URL;
const SB_KEY=import.meta.env.VITE_SUPABASE_KEY;
async function sbGet(table){try{const r=await fetch(`${SB_URL}/rest/v1/${table}?select=id,data`,{headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`}});const rows=await r.json();if(!Array.isArray(rows))return[];return rows.map(r=>r.data);}catch{return[];}}
async function sbUpsert(table,id,data){try{await fetch(`${SB_URL}/rest/v1/${table}`,{method:"POST",headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates"},body:JSON.stringify({id,data})});}catch{}}
async function sbDelete(table,id){try{await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`,{method:"DELETE",headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`}});}catch{}}
async function sbGetPlanByDate(date){try{const r=await fetch(`${SB_URL}/rest/v1/plans?select=id,data`,{headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`}});const rows=await r.json();if(!Array.isArray(rows))return null;const m=rows.find(r=>r.data&&r.data.date===date);return m?m.data:null;}catch{return null;}}
function shareUrl(plan){return`${window.location.href.split("?")[0]}?share=${plan.date}`;}

const load=(k,fb)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}catch{return fb;}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(h,m){return`${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`;}
function buildSchedule(start="17:00",drills=[],warmupDrill=null,cooldownDrill=null){
  const[h,m]=start.split(":").map(Number);let hr=h,mn=m;const blocks=[];
  function add(mins,label,drill=null){const t=hr*60+mn+mins,eH=Math.floor(t/60)%24,eM=t%60;blocks.push({start:fmt(hr,mn),end:fmt(eH,eM),label,dur:mins,drill});hr=eH;mn=eM;}
  add(15,"Warmup",warmupDrill);drills.forEach(d=>add(d.duration||20,d.name,d));add(15,"Cool Down",cooldownDrill);
  return blocks;
}
function dateLabel(str){if(!str)return"";const[y,m,d]=str.split("-").map(Number);return new Date(y,m-1,d).toLocaleDateString("en-CA",{weekday:"long",year:"numeric",month:"long",day:"numeric"});}
function shortDateLabel(str){if(!str)return"";const[y,m,d]=str.split("-").map(Number);return new Date(y,m-1,d).toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric"});}
function useToast(){const[msg,setMsg]=useState(null);const show=t=>{setMsg(t);setTimeout(()=>setMsg(null),2600);};return{msg,show};}

// ─── Week helpers ─────────────────────────────────────────────────────────────
const DAY_LABELS=["Su","Mo","Tu","We","Th","Fr","Sa"];
function getWeekDates(base){
  const d=new Date(base+"T12:00:00"),day=d.getDay(),sun=new Date(d);
  sun.setDate(d.getDate()-day);
  return Array.from({length:7},(_,i)=>{const x=new Date(sun);x.setDate(sun.getDate()+i);return x.toISOString().split("T")[0];});
}
function addWeeks(dateStr,n){const d=new Date(dateStr+"T12:00:00");d.setDate(d.getDate()+n*7);return d.toISOString().split("T")[0];}

// ─── Theme ────────────────────────────────────────────────────────────────────
function makeTheme(dark){
  return dark?{
    bg:"#090d18",surface:"#0f1828",surfaceUp:"#1a2540",
    border:"rgba(95,141,181,0.16)",borderHi:"rgba(95,141,181,0.42)",
    steel:"#5f8db5",steelDim:"rgba(95,141,181,0.12)",steelLight:"#c2d9ed",
    text:"#f0f4f8",textMuted:"rgba(255,255,255,0.42)",textDim:"rgba(255,255,255,0.26)",
    inputBg:"rgba(255,255,255,0.05)",inputBorder:"rgba(95,141,181,0.22)",
    navBg:"rgba(9,13,24,0.97)",navBorder:"rgba(95,141,181,0.14)",navText:"rgba(255,255,255,0.28)",
    pillBorder:"rgba(255,255,255,0.1)",pillText:"rgba(255,255,255,0.38)",
    playerChip:"rgba(255,255,255,0.07)",playerText:"rgba(255,255,255,0.5)",
    noteText:"rgba(255,255,255,0.48)",toastBg:"#1a2540",modalBg:"#0f1828",
    overlayBg:"rgba(4,8,18,0.82)",danger:"#e05252",success:"#3dba7a",
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

function makeCSS(T){return`
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:${T.bg};font-family:'DM Sans',sans-serif;color:${T.text};min-height:100vh;transition:background 0.25s,color 0.25s;}
.app{min-height:100vh;display:flex;flex-direction:column;max-width:680px;margin:0 auto;}
.top-bar{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:${T.isDark?"2px solid "+T.steel:"1px solid "+T.border};background:${T.isDark?"linear-gradient(160deg,#090d18 0%,#0f1e38 100%)":T.surface};position:sticky;top:0;z-index:50;}
.top-bar img{width:42px;height:42px;object-fit:contain;filter:drop-shadow(0 2px 8px rgba(95,141,181,0.4));}
.top-bar-title{font-family:'Oswald',sans-serif;font-size:16px;font-weight:700;color:${T.text};line-height:1;}
.top-bar-sub{font-size:10px;color:${T.steel};text-transform:uppercase;letter-spacing:1.5px;margin-top:2px;}
.theme-btn{margin-left:auto;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;border:1.5px solid ${T.border};background:${T.steelDim};cursor:pointer;color:${T.steel};transition:all 0.15s;flex-shrink:0;}
.theme-btn:hover{border-color:${T.steel};}
.scroll-area{flex:1;overflow-y:auto;padding:16px 16px 100px;}
.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:680px;background:${T.navBg};border-top:1px solid ${T.navBorder};display:flex;z-index:100;padding-bottom:env(safe-area-inset-bottom,0px);backdrop-filter:blur(20px);}
.nav-tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:11px 8px 9px;background:none;border:none;cursor:pointer;color:${T.navText};font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;transition:color 0.15s;-webkit-tap-highlight-color:transparent;}
.nav-tab.active{color:${T.steel};}
.nav-badge{display:inline-flex;align-items:center;justify-content:center;background:${T.steel};color:#fff;border-radius:10px;font-size:10px;font-weight:700;padding:0 5px;min-width:16px;height:16px;margin-left:2px;}
.filter-bar{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;margin-bottom:10px;scrollbar-width:none;}
.filter-bar::-webkit-scrollbar{display:none;}
.filter-pill{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:20px;border:1.5px solid ${T.pillBorder};background:transparent;cursor:pointer;white-space:nowrap;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;color:${T.pillText};transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
.filter-pill.all-active{background:${T.steel};border-color:${T.steel};color:#fff;}
.filter-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;align-items:center;}
.filter-group-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${T.textDim};margin-right:2px;}
.recent-label{display:flex;align-items:center;gap:7px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.3px;color:${T.recentCol};margin:4px 0 8px;}
.recent-label::after{content:'';flex:1;height:1px;background:${T.isDark?"rgba(255,196,0,0.2)":"rgba(201,143,0,0.25)"};}
.section-title{font-family:'Oswald',sans-serif;font-size:24px;font-weight:700;color:${T.text};margin-bottom:3px;}
.section-sub{font-size:13px;color:${T.textMuted};margin-bottom:16px;}
.card{background:${T.surface};border-radius:14px;border:1px solid ${T.border};padding:18px;margin-bottom:12px;}
.card-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${T.textDim};margin-bottom:14px;}
.field{margin-bottom:14px;}
.label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.9px;color:${T.textDim};display:block;margin-bottom:6px;}
.input,.select,.textarea{width:100%;padding:11px 13px;background:${T.inputBg};border:1.5px solid ${T.inputBorder};border-radius:9px;font-family:'DM Sans',sans-serif;font-size:15px;color:${T.text};transition:border-color 0.15s;}
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
.venue-btn{flex:1;padding:9px 4px;border-radius:8px;border:1.5px solid ${T.inputBorder};background:${T.inputBg};cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:${T.textDim};transition:all 0.15s;text-align:center;display:flex;flex-direction:column;align-items:center;gap:4px;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 20px;border-radius:9px;border:none;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
.btn-sm{padding:7px 13px;font-size:13px;}
.btn-primary{background:${T.steel};color:#fff;}
.btn-primary:hover{opacity:0.88;}
.btn-ghost{background:transparent;color:${T.textMuted};border:1.5px solid ${T.border};}
.btn-ghost:hover{border-color:${T.steel};color:${T.steel};}
.btn-full{width:100%;}
.btn-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;}
.icon-btn{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;border:1.5px solid ${T.border};background:transparent;cursor:pointer;color:${T.textMuted};transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
.icon-btn:hover{border-color:${T.steel};color:${T.steel};}
.icon-btn.danger:hover{border-color:${T.danger};color:${T.danger};}
.drill-item{background:${T.surface};border-radius:12px;padding:15px;margin-bottom:10px;border:1.5px solid ${T.border};transition:border-color 0.15s;}
.drill-item:hover{border-color:${T.borderHi};}
.drill-item-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.drill-name{font-family:'Oswald',sans-serif;font-size:18px;font-weight:600;color:${T.text};margin-bottom:7px;}
.meta-chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:7px;align-items:center;}
.player-chip{display:inline-flex;align-items:center;gap:4px;background:${T.playerChip};color:${T.playerText};border-radius:5px;padding:3px 9px;font-size:12px;font-weight:600;}
.dur-chip{display:inline-flex;align-items:center;gap:4px;background:${T.steelDim};color:${T.steel};border-radius:5px;padding:3px 9px;font-size:12px;font-weight:700;}
.drill-notes{list-style:none;padding:0;margin-top:4px;}
.drill-notes li{font-size:13px;color:${T.noteText};padding:2px 0;}
.drill-actions{display:flex;gap:7px;flex-shrink:0;}
.pick-item{background:${T.surface};border:1.5px solid ${T.border};border-radius:11px;margin-bottom:9px;transition:all 0.15s;user-select:none;-webkit-tap-highlight-color:transparent;}
.pick-item:hover{border-color:${T.borderHi};}
.pick-item.picked{border-color:${T.steel};background:${T.steelDim};}
.pick-header{display:flex;align-items:center;gap:12px;padding:13px 15px;cursor:pointer;}
.pick-circle{width:24px;height:24px;border-radius:50%;border:2px solid ${T.border};display:flex;align-items:center;justify-content:center;flex-shrink:0;color:transparent;transition:all 0.15s;}
.pick-item.picked .pick-circle{background:${T.steel};border-color:${T.steel};color:#fff;}
.pick-info{flex:1;min-width:0;}
.pick-name{font-weight:600;font-size:15px;color:${T.text};margin-bottom:4px;}
.pick-meta{display:flex;gap:5px;flex-wrap:wrap;align-items:center;}
.pick-num{font-family:'Oswald',sans-serif;font-size:18px;font-weight:700;color:${T.steel};flex-shrink:0;}
.pick-expand-btn{display:flex;align-items:center;justify-content:center;padding:4px 10px;border-radius:6px;border:1px solid ${T.border};background:transparent;cursor:pointer;color:${T.textDim};font-size:11px;font-weight:600;gap:3px;transition:all 0.15s;white-space:nowrap;}
.pick-expand-btn:hover{border-color:${T.steel};color:${T.steel};}
.pick-expanded{padding:0 15px 13px 51px;border-top:1px solid ${T.border};}
.tl{margin-top:10px;}
.tl-row{display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid ${T.border};}
.tl-row:last-child{border-bottom:none;}
.tl-dot{width:7px;height:7px;border-radius:50%;background:${T.steel};flex-shrink:0;}
.tl-time{font-size:12px;font-weight:600;color:${T.steel};width:130px;flex-shrink:0;}
.tl-label{font-size:14px;color:${T.text};flex:1;}
.tl-dur{font-size:11px;color:${T.textDim};}
.bat-toggle{background:${T.surface};border:1.5px solid ${BAT_COLOR.border};border-radius:12px;padding:15px 16px;margin-bottom:12px;cursor:pointer;transition:all 0.15s;user-select:none;}
.bat-toggle.active{background:${BAT_COLOR.bg};}
.bat-toggle-header{display:flex;align-items:center;gap:12px;}
.bat-check{width:24px;height:24px;border-radius:6px;border:2px solid ${BAT_COLOR.border};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.15s;}
.bat-toggle.active .bat-check{background:${BAT_COLOR.text};border-color:${BAT_COLOR.text};color:#fff;}
.bat-title{font-family:'Oswald',sans-serif;font-size:16px;font-weight:600;color:${BAT_COLOR.text};}
.bat-sub{font-size:12px;color:${T.textMuted};margin-top:2px;}
.bat-detail{margin-top:10px;padding-top:10px;border-top:1px solid ${BAT_COLOR.border};}
.bat-note{font-size:13px;color:${T.noteText};padding:2px 0;}
.bat-note::before{content:"· ";color:${BAT_COLOR.text};font-weight:700;}
.schedule-grid{display:grid;grid-template-columns:70fr 30fr;gap:10px;margin-bottom:8px;}
.schedule-col-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${T.textDim};margin-bottom:6px;display:flex;align-items:center;gap:5px;}
.bat-station{background:${BAT_COLOR.bg};border:1.5px solid ${BAT_COLOR.border};border-radius:10px;padding:12px;}
.bat-station-title{font-family:'Oswald',sans-serif;font-size:14px;font-weight:700;color:${BAT_COLOR.text};margin-bottom:6px;display:flex;align-items:center;gap:6px;}
.bat-station-note{font-size:12px;color:${T.noteText};padding:2px 0;}
.bat-station-note::before{content:"· ";color:${BAT_COLOR.text};font-weight:700;}
.divider-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.3px;color:${T.textDim};margin:18px 0 10px;}
.empty{text-align:center;padding:48px 24px;color:${T.textDim};}
.empty p{font-size:14px;line-height:1.7;margin-top:10px;}
.overlay{position:fixed;inset:0;background:${T.overlayBg};z-index:200;display:flex;align-items:flex-end;justify-content:center;}
.modal{background:${T.modalBg};border-radius:20px 20px 0 0;border:1px solid ${T.border};border-bottom:none;padding:22px 18px 36px;width:100%;max-width:680px;max-height:88vh;overflow-y:auto;box-shadow:0 -16px 48px rgba(4,8,18,0.4);}
.modal-handle{width:38px;height:4px;background:${T.border};border-radius:2px;margin:0 auto 18px;}
.modal-title{font-family:'Oswald',sans-serif;font-size:20px;color:${T.text};margin-bottom:16px;}
.toast{position:fixed;bottom:84px;left:50%;transform:translateX(-50%);background:${T.toastBg};border:1px solid ${T.steel};color:#fff;padding:10px 20px;border-radius:40px;font-size:14px;font-weight:500;white-space:nowrap;box-shadow:0 8px 24px rgba(4,8,18,0.3);z-index:500;animation:toastIn 0.2s ease;}
@keyframes toastIn{from{transform:translateX(-50%) translateY(8px);opacity:0;}to{transform:translateX(-50%) translateY(0);opacity:1;}}

/* ═══ WEEK STRIP ══════════════════════════════════════════════════ */
.week-strip-wrap{background:${T.isDark?"#090d18":T.surface};padding:10px 14px 0;border-bottom:1px solid ${T.border};position:sticky;top:58px;z-index:40;}
.week-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.week-range{font-family:'Oswald',sans-serif;font-size:13px;font-weight:700;color:${T.textMuted};}
.week-arr{background:none;border:none;color:${T.textDim};font-size:14px;cursor:pointer;padding:4px 8px;border-radius:6px;transition:color 0.15s;}
.week-arr:hover{color:${T.steel};}
.week-days{display:flex;gap:3px;}
.wd{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:7px 3px 9px;border-radius:10px 10px 0 0;cursor:pointer;transition:background 0.15s;-webkit-tap-highlight-color:transparent;}
.wd:hover{background:${T.steelDim};}
.wd.sel{background:${T.steel};}
.wd-lbl{font-size:9px;font-weight:700;text-transform:uppercase;color:${T.textDim};letter-spacing:0.5px;}
.wd.sel .wd-lbl{color:rgba(255,255,255,0.8);}
.wd-num{font-family:'Oswald',sans-serif;font-size:15px;font-weight:700;color:${T.textMuted};}
.wd.sel .wd-num{color:#fff;}
.wd.today .wd-num{color:${T.steel};}
.wd.sel.today .wd-num{color:#fff;}
.wd-dot{width:5px;height:5px;border-radius:50%;background:${T.steel};}
.wd.sel .wd-dot{background:rgba(255,255,255,0.85);}
.wd-empty{width:5px;height:5px;}

/* ═══ TOOLBAR ═════════════════════════════════════════════════════ */
.toolbar{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid ${T.border};background:${T.surface};}
.tb-info{flex:1;min-width:0;}
.tb-date{font-family:'Oswald',sans-serif;font-size:16px;font-weight:700;color:${T.text};line-height:1.1;}
.tb-time{font-size:11px;color:${T.textDim};margin-top:2px;}
.tb-btns{display:flex;gap:6px;flex-shrink:0;}
.tb-btn{width:34px;height:34px;border-radius:9px;border:1.5px solid ${T.border};background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;color:${T.textMuted};transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
.tb-btn:hover{border-color:${T.steel};color:${T.steel};}
.tb-btn.share{background:${T.steelDim};border-color:${T.borderHi};color:${T.steel};}
.tb-btn.danger:hover{border-color:${T.danger};color:${T.danger};}

/* ═══ PRACTICE SCHEDULE ═══════════════════════════════════════════ */
.ps-start-wrap{padding:12px 14px;background:${T.steelDim};border-bottom:1px solid ${T.border};display:flex;justify-content:center;}
.ps-start-btn{display:flex;align-items:center;gap:9px;background:${T.steel};color:#fff;border:none;border-radius:10px;padding:12px 36px;font-family:'Oswald',sans-serif;font-size:17px;font-weight:600;cursor:pointer;transition:opacity 0.15s;}
.ps-start-btn:hover{opacity:0.88;}
.ps-timer{background:${T.steel};padding:11px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.ps-timer-info{flex:1;min-width:0;}
.ps-timer-name{font-family:'Oswald',sans-serif;font-size:14px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ps-timer-of{font-size:11px;color:rgba(255,255,255,0.65);margin-top:1px;}
.ps-timer-digits{font-family:'Oswald',sans-serif;font-size:30px;font-weight:700;color:#fff;letter-spacing:3px;flex-shrink:0;}
.ps-timeup{font-size:10px;font-weight:700;color:#ffe0e0;text-align:center;margin-top:1px;}
.ps-timer-btns{display:flex;gap:6px;flex-shrink:0;}
.ps-timer-btn{width:48px;height:48px;border-radius:12px;background:rgba(0,0,0,0.22);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.15s;-webkit-tap-highlight-color:transparent;}
.ps-timer-btn:hover{background:rgba(0,0,0,0.38);}
.ps-timer-btn.finish{background:#3dba7a;}
.ps-timer-btn:disabled{opacity:0.22;cursor:not-allowed;pointer-events:none;}
.ps-prog-wrap{height:4px;background:${T.isDark?"rgba(255,255,255,0.15)":T.border};}
.ps-prog-fill{height:4px;background:${T.steel};transition:width 0.5s linear;}
.col-hdrs{display:grid;grid-template-columns:70fr 30fr;gap:7px;padding:8px 14px 3px;}
.col-hdr{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${T.textDim};display:flex;align-items:center;gap:4px;}
.col-hdr.bat{color:${BAT_COLOR.text};}
.ps-blocks{padding:0 14px 24px;display:flex;flex-direction:column;gap:8px;margin-top:8px;}
.ps-block{background:${T.surface};border:1.5px solid ${T.border};border-radius:12px;overflow:hidden;transition:border-color 0.2s;}
.ps-block.cur{border-color:${T.steel};background:${T.isDark?"rgba(95,141,181,0.06)":T.steelDim};box-shadow:0 0 0 3px ${T.steelDim};}
.ps-block.done{opacity:0.42;}
.ps-block-hd{display:flex;align-items:center;gap:10px;padding:12px 14px;}
.ps-idx{width:26px;height:26px;border-radius:50%;background:${T.steelDim};display:flex;align-items:center;justify-content:center;font-family:'Oswald',sans-serif;font-size:12px;font-weight:700;color:${T.textMuted};flex-shrink:0;}
.ps-block.cur .ps-idx{background:${T.steel};color:#fff;}
.ps-block.done .ps-idx{background:#3dba7a;color:#fff;}
.ps-block-info{flex:1;min-width:0;}
.ps-block-name{font-family:'Oswald',sans-serif;font-size:15px;font-weight:600;color:${T.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ps-block.cur .ps-block-name{color:${T.steel};}
.ps-block-time{font-size:11px;color:${T.textMuted};margin-top:1px;}
.ps-block-dur{font-size:12px;color:${T.textDim};flex-shrink:0;}
.ps-expand-btn{display:flex;align-items:center;gap:5px;padding:7px 12px;border-radius:8px;background:${T.steelDim};border:1.5px solid ${T.border};color:${T.steel};font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;flex-shrink:0;transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
.ps-expand-btn.open{border-color:${T.borderHi};}
.ps-block-detail{padding:0 14px 13px 50px;border-top:1px solid ${T.border};}
.ps-dl{margin-top:10px;}
.ps-dl-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:${T.textDim};margin-bottom:6px;}
.ps-chips{display:flex;gap:6px;flex-wrap:wrap;}
.ps-chip{display:flex;align-items:center;gap:4px;background:${T.steelDim};color:${T.steel};border-radius:5px;padding:3px 9px;font-size:12px;font-weight:600;}
.ps-notes{list-style:none;padding:0;}
.ps-notes li{font-size:13px;color:${T.noteText};padding:4px 0;border-bottom:1px solid ${T.border};}
.ps-notes li:last-child{border-bottom:none;}
.ps-vid{display:inline-flex;align-items:center;gap:7px;background:${T.steelDim};border:1px solid ${T.border};border-radius:7px;padding:8px 13px;color:${T.steel};text-decoration:none;font-size:13px;font-weight:500;margin-top:10px;}
.ps-bat-col{background:${BAT_COLOR.bg};border:1.5px solid ${BAT_COLOR.border};border-radius:12px;padding:12px 10px;display:flex;flex-direction:column;gap:6px;}
.ps-bat-title{font-family:'Oswald',sans-serif;font-size:13px;font-weight:700;color:${BAT_COLOR.text};display:flex;align-items:center;gap:5px;}
.ps-bat-sub{font-size:10px;color:${T.textMuted};}
.ps-bat-divider{height:1px;background:${BAT_COLOR.border};}
.ps-bat-note{font-size:11px;color:${T.noteText};padding:1px 0;}
.ps-bat-note::before{content:"· ";color:${BAT_COLOR.text};font-weight:700;}
.ps-done-banner{background:${T.isDark?"rgba(61,186,122,0.1)":"rgba(26,120,74,0.08)"};border:1px solid rgba(61,186,122,0.35);border-radius:14px;padding:24px;text-align:center;margin-bottom:8px;}
.ps-done-logo{width:64px;height:64px;object-fit:contain;margin-bottom:10px;}
.ps-done-title{font-family:'Oswald',sans-serif;font-size:22px;font-weight:700;color:${T.text};}
.ps-done-sub{font-size:13px;color:${T.textMuted};margin-top:5px;}
.ps-empty{text-align:center;padding:40px 16px;color:${T.textDim};}
.ps-empty-title{font-family:'Oswald',sans-serif;font-size:18px;font-weight:600;color:${T.textMuted};margin:12px 0 6px;}
.ps-empty-sub{font-size:13px;margin-bottom:18px;line-height:1.6;}

/* ═══ SHARE VIEW (external URL) ══════════════════════════════════ */
.sv-shell{min-height:100vh;background:${T.bg};}
.sv-inner{max-width:680px;margin:0 auto;}
.sv-header{background:${T.isDark?"linear-gradient(160deg,#090d18 0%,#0f1e38 100%)":T.surface};padding:16px 18px;border-bottom:2px solid ${T.steel};display:flex;align-items:center;gap:14px;}
.sv-logo{width:58px;height:58px;object-fit:contain;flex-shrink:0;filter:drop-shadow(0 2px 8px rgba(95,141,181,0.4));}
.sv-team{font-family:'Oswald',sans-serif;font-size:10px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:${T.steel};margin-bottom:3px;}
.sv-date{font-family:'Oswald',sans-serif;font-size:20px;font-weight:700;color:${T.text};line-height:1.15;}
.sv-kick{font-size:13px;color:${T.textMuted};margin-top:4px;}

@media(max-width:480px){.sv-date{font-size:17px;}.ps-timer-digits{font-size:24px;}.schedule-grid{grid-template-columns:1fr;}}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px;}
`;}

// ─── Countdown ────────────────────────────────────────────────────────────────
function useCountdown({totalSeconds,running,onExpire}){
  const[secsLeft,setSecsLeft]=useState(totalSeconds);
  const endRef=useRef(null),expRef=useRef(false),rafRef=useRef(null);
  useEffect(()=>{cancelAnimationFrame(rafRef.current);expRef.current=false;if(running&&totalSeconds>0){endRef.current=Date.now()+totalSeconds*1000;setSecsLeft(totalSeconds);}else{endRef.current=null;setSecsLeft(totalSeconds);}},[totalSeconds,running]);
  useEffect(()=>{if(!running)return;function tick(){const r=Math.max(0,Math.ceil((endRef.current-Date.now())/1000));setSecsLeft(r);if(r<=0){if(!expRef.current){expRef.current=true;onExpire&&onExpire();}return;}rafRef.current=requestAnimationFrame(tick);}rafRef.current=requestAnimationFrame(tick);return()=>cancelAnimationFrame(rafRef.current);},[running,onExpire]);
  useEffect(()=>{function onVis(){if(!running||!endRef.current)return;const r=Math.max(0,Math.ceil((endRef.current-Date.now())/1000));setSecsLeft(r);if(r<=0&&!expRef.current){expRef.current=true;onExpire&&onExpire();}}document.addEventListener("visibilitychange",onVis);return()=>document.removeEventListener("visibilitychange",onVis);},[running,onExpire]);
  return secsLeft;
}

// ─── Practice Schedule (used in both Plans tab and share view) ────────────────
function PracticeSchedule({plan,T}){
  const blocks=buildSchedule(plan.start||"17:00",plan.drills||[],plan.warmupDrill||null,plan.cooldownDrill||null);
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
  function goNext(){setRunning(false);const n=cur+1;if(n<blocks.length)setTimeout(()=>launch(n),50);else setDone(true);}
  function goBack(){if(cur===0)return;setRunning(false);setTimeout(()=>launch(cur-1),50);}

  const mm=Math.floor(secsLeft/60),ss=secsLeft%60;
  const prog=currentDur>0?((currentDur-secsLeft)/currentDur)*100:0;
  const isFirst=cur===0,isLast=cur===blocks.length-1;

  function BlockDetail({b}){
    if(!b.drill)return null;
    const c=CAT[b.drill.category]||CAT["Hitting"];
    return(
      <div className="ps-block-detail">
        <div className="ps-dl"><div className="ps-chips">
          <CatChip cat={b.drill.category} small/>
          <span className="ps-chip"><Ico name="users" size={11}/>{b.drill.players} players</span>
          <span className="ps-chip"><Ico name="clock" size={11}/>{b.drill.duration||20}m</span>
          {b.drill.venue&&b.drill.venue!=="Both"&&<VenueChip venue={b.drill.venue} small/>}
        </div></div>
        {b.drill.notes&&(<div className="ps-dl"><div className="ps-dl-label">Instructions</div><ul className="ps-notes">{b.drill.notes.split("\n").filter(Boolean).map((n,j)=><li key={j}>{n}</li>)}</ul></div>)}
        {b.drill.video&&<a href={b.drill.video} target="_blank" rel="noopener noreferrer" className="ps-vid"><Ico name="video" size={14}/> Watch Drill Video</a>}
      </div>
    );
  }

  function Block({b,gi}){
    const isCur=started&&!done&&gi===cur,isDone=started&&(done||gi<cur),isOpen=open===gi;
    const hasDr=!!b.drill,c=hasDr?(CAT[b.drill.category]||CAT["Warmup"]):null;
    return(
      <div className={`ps-block${isCur?" cur":""}${isDone?" done":""}`} style={hasDr&&c?{borderLeftColor:c.border,borderLeftWidth:3}:{}}>
        <div className="ps-block-hd" style={{cursor:hasDr?"pointer":"default"}} onClick={()=>hasDr&&setOpen(isOpen?null:gi)}>
          <div className="ps-idx">{isDone?<Ico name="checkmark" size={13}/>:gi+1}</div>
          <div className="ps-block-info">
            <div className="ps-block-name" style={hasDr&&c&&!isCur?{color:c.text}:{}}>{b.label}</div>
            <div className="ps-block-time">{b.start} – {b.end}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div className="ps-block-dur">{b.dur}m</div>
            {hasDr&&<button className={`ps-expand-btn${isOpen?" open":""}`} onClick={e=>{e.stopPropagation();setOpen(isOpen?null:gi);}}><Ico name={isOpen?"chevUp":"chevDown"} size={16}/>{isOpen?"Hide":"Details"}</button>}
          </div>
        </div>
        {hasDr&&isOpen&&<BlockDetail b={b}/>}
      </div>
    );
  }

  return(
    <div>
      {!started&&(
        <div className="ps-start-wrap">
          <button className="ps-start-btn" onClick={()=>{setStarted(true);launch(0);}}><Ico name="play" size={18}/> Start Practice Timer</button>
        </div>
      )}
      {started&&!done&&(
        <>
          <div className="ps-timer">
            <div className="ps-timer-info">
              <div className="ps-timer-name">{blocks[cur].label}</div>
              <div className="ps-timer-of">Block {cur+1} of {blocks.length}</div>
            </div>
            <div>
              <div className="ps-timer-digits">{String(mm).padStart(2,"0")}:{String(ss).padStart(2,"0")}</div>
              {expired&&<div className="ps-timeup">TIME'S UP</div>}
            </div>
            <div className="ps-timer-btns">
              <button className="ps-timer-btn" onClick={goBack} disabled={isFirst}>
                <Ico name="skipBack" size={26} stroke={2.2}/>
              </button>
              <button className={`ps-timer-btn${isLast?" finish":""}`} onClick={goNext}>
                {isLast?<Ico name="checkmark" size={26} stroke={2.2}/>:<Ico name="skipFwd" size={26} stroke={2.2}/>}
              </button>
            </div>
          </div>
          <div className="ps-prog-wrap"><div className="ps-prog-fill" style={{width:`${prog}%`}}/></div>
        </>
      )}

      {hasBat?(
        <div className="ps-blocks">
          {done&&<div className="ps-done-banner"><img src={LOGO} alt="Panthers" className="ps-done-logo"/><div className="ps-done-title">Practice Complete!</div><div className="ps-done-sub">Great work, Kitchener Panthers!</div></div>}
          <Block b={blocks[0]} gi={0}/>
          <div className="col-hdrs">
            <div className="col-hdr"><Ico name="dumbbell" size={10}/> Main Drills</div>
            <div className="col-hdr bat"><Ico name="bat" size={10}/> Batting</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"70fr 30fr",gap:8}}>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {blocks.slice(1,-1).map((b,ri)=>{
                const gi=ri+1,isCur=started&&!done&&gi===cur,isDone=started&&(done||gi<cur),isOpen=open===gi,c=b.drill?(CAT[b.drill.category]||CAT["Hitting"]):null;
                return(
                  <div key={gi} className={`ps-block${isCur?" cur":""}${isDone?" done":""}`} style={{...{marginBottom:0},...(c?{borderLeftColor:c.border,borderLeftWidth:3}:{})}}>
                    <div className="ps-block-hd" onClick={()=>setOpen(isOpen?null:gi)}>
                      <div className="ps-idx" style={isCur?{}:c?{background:c.bg,color:c.text}:{}}>{isDone?<Ico name="checkmark" size={13}/>:gi+1}</div>
                      <div className="ps-block-info"><div className="ps-block-name" style={c&&!isCur?{color:c.text}:{}}>{b.label}</div><div className="ps-block-time">{b.start} – {b.end}</div></div>
                      <div style={{display:"flex",alignItems:"center",gap:6}}><div className="ps-block-dur">{b.dur}m</div><button className={`ps-expand-btn${isOpen?" open":""}`} onClick={e=>{e.stopPropagation();setOpen(isOpen?null:gi);}}><Ico name={isOpen?"chevUp":"chevDown"} size={16}/>{isOpen?"Hide":"Details"}</button></div>
                    </div>
                    {isOpen&&b.drill&&<BlockDetail b={b}/>}
                  </div>
                );
              })}
            </div>
            <div className="ps-bat-col">
              <div className="ps-bat-title"><Ico name="bat" size={13}/> Batting Practice</div>
              <div className="ps-bat-sub">Runs all practice · rotate through</div>
              <div className="ps-bat-divider"/>
              {BAT_DRILL.notes.split("\n").map((n,j)=><div key={j} className="ps-bat-note">{n}</div>)}
            </div>
          </div>
          <Block b={blocks[blocks.length-1]} gi={blocks.length-1}/>
        </div>
      ):(
        <div className="ps-blocks">
          {done&&<div className="ps-done-banner"><img src={LOGO} alt="Panthers" className="ps-done-logo"/><div className="ps-done-title">Practice Complete!</div><div className="ps-done-sub">Great work, Kitchener Panthers!</div></div>}
          {blocks.map((b,i)=><Block key={i} b={b} gi={i}/>)}
        </div>
      )}
    </div>
  );
}

// ─── Filter bars ──────────────────────────────────────────────────────────────
function CatFilter({active,onChange}){
  return(<div className="filter-bar"><button className={`filter-pill${active==="All"?" all-active":""}`} onClick={()=>onChange("All")}>All</button>{CATS.map(cat=>{const c=CAT[cat],isA=active===cat;return(<button key={cat} className="filter-pill" onClick={()=>onChange(isA?"All":cat)} style={isA?{background:c.bg,borderColor:c.border,color:c.text}:{}}>{cat}</button>);})}</div>);
}
function PlayerFilter({active,onChange}){
  return(<div className="filter-row"><span className="filter-group-label"><Ico name="users" size={11}/> Players:</span>{PLAYER_FILTERS.map(f=>{const isA=active===f;return(<button key={f} className={`filter-pill${isA?" all-active":""}`} onClick={()=>onChange(isA&&f!=="Any"?"Any":f)} style={{padding:"4px 10px",fontSize:11}}>{f}</button>);})}</div>);
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function PracticePlanner(){
  const today=new Date().toISOString().split("T")[0];
  const[shared,setShared]=useState(null);
  const[sharedLoading,setSharedLoading]=useState(false);
  const[dark,setDark]=useState(()=>load("pp_dark",true));
  const T=makeTheme(dark);

  useEffect(()=>{
    const p=new URLSearchParams(window.location.search);
    const sd=p.get("share"),old=p.get("p");
    if(sd){setSharedLoading(true);sbGetPlanByDate(sd).then(plan=>{setShared(plan);setSharedLoading(false);});}
    else if(old){try{const s=JSON.parse(decodeURIComponent(atob(old.replace(/-/g,"+").replace(/_/g,"/"))));setShared({date:s.d,start:s.s,battingParallel:!!s.bp,drills:(s.x||[]).map((dr,i)=>({id:i,name:dr.n,category:dr.c,players:dr.p,notes:dr.t,video:dr.v,duration:dr.du||20,venue:dr.ve||"Both"}))});}catch{}}
  },[]);

  useEffect(()=>{let el=document.getElementById("pp-css");if(!el){el=document.createElement("style");el.id="pp-css";document.head.appendChild(el);}el.textContent=makeCSS(T);},[dark]);
  useEffect(()=>save("pp_dark",dark),[dark]);

  const[tab,setTab]=useState("plans");
  const[drills,setDrills]=useState([]);
  const[plans,setPlans]=useState([]);
  const[recentIds,setRecentIds]=useState(()=>load("pp_recent",[]));
  const[loading,setLoading]=useState(true);
  const toast=useToast();
  const[drillFilter,setDrillFilter]=useState("All");
  const[createCatFilter,setCreateCatFilter]=useState("All");
  const[createPlayerFilter,setCreatePlayerFilter]=useState("Any");
  const[expandedPicks,setExpandedPicks]=useState({});
  useEffect(()=>save("pp_recent",recentIds),[recentIds]);
  useEffect(()=>{async function go(){setLoading(true);const[d,p]=await Promise.all([sbGet("drills"),sbGet("plans")]);setDrills(d);setPlans(p);setLoading(false);}go();},[]);

  // Week strip
  const[weekBase,setWeekBase]=useState(()=>{
    const p=new URLSearchParams(window.location.search).get("share");
    return p||today;
  });
  const[selectedDate,setSelectedDate]=useState(()=>{
    // If opened with ?share=date, start on that date
    const p=new URLSearchParams(window.location.search).get("share");
    return p||today;
  });
  const weekDates=getWeekDates(weekBase);
  const planMap=Object.fromEntries(plans.map(p=>[p.date,p]));

  // Keep URL in sync with selected date on Plans tab
  useEffect(()=>{
    if(tab!=="plans")return;
    const url=new URL(window.location.href);
    url.searchParams.set("share",selectedDate);
    window.history.replaceState(null,"",url.toString());
  },[selectedDate,tab]);

  // Clear share param when leaving Plans tab
  useEffect(()=>{
    if(tab==="plans")return;
    const url=new URL(window.location.href);
    url.searchParams.delete("share");
    window.history.replaceState(null,"",url.toString());
  },[tab]);

  // Drill form
  const[editId,setEditId]=useState(null);
  const[dName,setDName]=useState("");const[dCat,setDCat]=useState("Hitting");const[dPlay,setDPlay]=useState(8);
  const[dDur,setDDur]=useState(20);const[dVenue,setDVenue]=useState("Both");const[dNotes,setDNotes]=useState("");const[dVideo,setDVideo]=useState("");
  const[showForm,setShowForm]=useState(false);

  // Practice form
  const[pDate,setPDate]=useState(today);const[pTime,setPTime]=useState("17:00");const[picked,setPicked]=useState([]);const[battingParallel,setBattingParallel]=useState(false);
  const[warmupDrill,setWarmupDrill]=useState(null);const[cooldownDrill,setCooldownDrill]=useState(null);

  // Edit plan modal
  const[editPlan,setEditPlan]=useState(null);const[ePDate,setEPDate]=useState("");const[ePTime,setEPTime]=useState("");const[ePicked,setEPicked]=useState([]);const[eBat,setEBat]=useState(false);
  const[eWarmupDrill,setEWarmupDrill]=useState(null);const[eCooldownDrill,setECooldownDrill]=useState(null);

  const spinner=(msg)=>(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <img src={LOGO} alt="Panthers" style={{width:72,height:72,objectFit:"contain",filter:"drop-shadow(0 2px 12px rgba(95,141,181,0.5))",animation:"pp-spin 2s linear infinite"}}/>
      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:16,color:T.steel,letterSpacing:1}}>{msg}</div>
      <style>{`@keyframes pp-spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if(sharedLoading)return spinner("Loading practice...");

  // External share view — Panthers header + full schedule
  if(shared){
    const sched=buildSchedule(shared.start||"17:00",shared.drills||[],shared.warmupDrill||null,shared.cooldownDrill||null);
    const totalMins=sched.reduce((s,b)=>s+b.dur,0);
    return(
      <div className="sv-shell">
        <div className="sv-inner">
          <div className="sv-header">
            <img src={LOGO} alt="Panthers" className="sv-logo"/>
            <div>
              <div className="sv-team">Kitchener Panthers · U8 Tier 1</div>
              <div className="sv-date">{dateLabel(shared.date)}</div>
              <div className="sv-kick">{fmt(...(shared.start||"17:00").split(":").map(Number))} · {totalMins} min</div>
            </div>
          </div>
          <PracticeSchedule plan={shared} T={T}/>
        </div>
      </div>
    );
  }

  if(loading)return spinner("Loading your drills...");

  // Drill fns
  function resetForm(){setEditId(null);setDName("");setDCat("Hitting");setDPlay(8);setDDur(20);setDVenue("Both");setDNotes("");setDVideo("");setShowForm(false);}
  function openEdit(d){setEditId(d.id);setDName(d.name);setDCat(d.category);setDPlay(d.players);setDDur(d.duration||20);setDVenue(d.venue||"Both");setDNotes(d.notes||"");setDVideo(d.video||"");setShowForm(true);window.scrollTo({top:0,behavior:"smooth"});}
  async function saveDrill(){
    if(!dName.trim())return toast.show("Enter a drill name");
    const dr={id:editId||Date.now(),name:dName.trim(),category:dCat,players:dPlay,duration:dDur,venue:dVenue,notes:dNotes,video:dVideo};
    setDrills(prev=>editId?prev.map(d=>d.id===editId?dr:d):[...prev,dr]);
    await sbUpsert("drills",dr.id,dr);toast.show(editId?"Drill updated":"Drill saved");resetForm();
  }
  async function delDrill(id){if(!window.confirm("Delete this drill?"))return;setDrills(prev=>prev.filter(d=>d.id!==id));setRecentIds(prev=>prev.filter(x=>x!==id));await sbDelete("drills",id);toast.show("Drill deleted");}

  // Practice fns
  function togglePick(d){setPicked(prev=>prev.find(p=>p.id===d.id)?prev.filter(p=>p.id!==d.id):prev.length>=3?(toast.show("Max 3 drills"),prev):[...prev,d]);}
  async function savePractice(){
    if(!picked.length)return toast.show("Pick at least one drill");
    const plan={id:Date.now(),date:pDate,start:pTime,drills:picked,battingParallel,warmupDrill:warmupDrill||null,cooldownDrill:cooldownDrill||null};
    setPlans(prev=>[plan,...prev]);setRecentIds(prev=>[...new Set([...picked.map(d=>d.id),...prev])].slice(0,6));
    await sbUpsert("plans",plan.id,plan);
    setPicked([]);setPDate(today);setPTime("17:00");setBattingParallel(false);setWarmupDrill(null);setCooldownDrill(null);
    toast.show("Practice saved!");setSelectedDate(pDate);setWeekBase(pDate);setTab("plans");
  }
  async function delPlan(id){if(!window.confirm("Delete this practice?"))return;setPlans(prev=>prev.filter(p=>p.id!==id));await sbDelete("plans",id);toast.show("Deleted");}
  function openEditPlan(p){setEditPlan(p);setEPDate(p.date);setEPTime(p.start);setEPicked([...p.drills]);setEBat(!!p.battingParallel);setEWarmupDrill(p.warmupDrill||null);setECooldownDrill(p.cooldownDrill||null);}
  function toggleEPick(d){setEPicked(prev=>prev.find(p=>p.id===d.id)?prev.filter(p=>p.id!==d.id):prev.length>=3?(toast.show("Max 3 drills"),prev):[...prev,d]);}
  async function saveEditPlan(){
    if(!ePicked.length)return toast.show("Pick at least one drill");
    const updated={...editPlan,date:ePDate,start:ePTime,drills:ePicked,battingParallel:eBat,warmupDrill:eWarmupDrill||null,cooldownDrill:eCooldownDrill||null};
    setPlans(prev=>prev.map(p=>p.id===editPlan.id?updated:p));await sbUpsert("plans",updated.id,updated);setEditPlan(null);toast.show("Practice updated");
  }
  function copyLink(plan){const url=shareUrl(plan);navigator.clipboard.writeText(url).then(()=>toast.show("Link copied!")).catch(()=>toast.show("Copy: "+url));}
  function togglePickExpand(id){setExpandedPicks(prev=>({...prev,[id]:!prev[id]}));}

  const applyFilters=(list,catF,playerF)=>list.filter(d=>(catF==="All"||d.category===catF)&&matchesPlayerFilter(d,playerF));
  const filteredDrills=applyFilters(drills,drillFilter,"Any");
  const recentDrills=drills.filter(d=>recentIds.includes(d.id)).sort((a,b)=>recentIds.indexOf(a.id)-recentIds.indexOf(b.id));
  const otherDrills=drills.filter(d=>!recentIds.includes(d.id));

  function DrillCard({d}){
    const c=CAT[d.category]||CAT["Hitting"];
    return(<div className="drill-item" style={{borderLeftColor:c.border,borderLeftWidth:3}}>
      <div className="drill-item-header">
        <div style={{flex:1}}>
          <div className="drill-name">{d.name}</div>
          <div className="meta-chips"><CatChip cat={d.category}/><span className="player-chip"><Ico name="users" size={11}/>{d.players} players</span><span className="dur-chip"><Ico name="clock" size={11}/>{d.duration||20}m</span>{d.venue&&d.venue!=="Both"&&<VenueChip venue={d.venue}/>}</div>
          {d.notes&&<ul className="drill-notes">{d.notes.split("\n").filter(Boolean).slice(0,3).map((n,i)=><li key={i}><span style={{color:c.text}}>· </span><span style={{color:T.noteText}}>{n}</span></li>)}</ul>}
          {d.video&&<a href={d.video} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,color:c.text,marginTop:6,textDecoration:"none"}}><Ico name="video" size={13}/> Watch video</a>}
        </div>
        <div className="drill-actions">
          <button className="icon-btn" onClick={()=>openEdit(d)}><Ico name="pencil" size={15}/></button>
          <button className="icon-btn danger" onClick={()=>delDrill(d.id)}><Ico name="trash" size={15}/></button>
        </div>
      </div>
    </div>);
  }

  function PickItem({d,sel,idx,onToggle}){
    const c=CAT[d.category]||CAT["Hitting"],isExp=!!expandedPicks[d.id];
    return(<div className={`pick-item${sel?" picked":""}`} style={sel?{}:{borderLeftColor:c.border,borderLeftWidth:3}}>
      <div className="pick-header" onClick={()=>onToggle(d)}>
        <div className="pick-circle">{sel&&<Ico name="checkmark" size={13}/>}</div>
        <div className="pick-info"><div className="pick-name">{d.name}</div><div className="pick-meta"><CatChip cat={d.category} small/><span className="player-chip" style={{fontSize:11,padding:"2px 7px"}}>{d.players}p</span><span className="dur-chip" style={{fontSize:11,padding:"2px 7px"}}>{d.duration||20}m</span>{d.venue&&d.venue!=="Both"&&<VenueChip venue={d.venue} small/>}</div></div>
        {sel&&<div className="pick-num">#{idx+1}</div>}
        <button className="pick-expand-btn" onClick={e=>{e.stopPropagation();togglePickExpand(d.id);}}><Ico name={isExp?"chevUp":"chevDown"} size={11}/>{isExp?"Less":"Details"}</button>
      </div>
      {isExp&&(<div className="pick-expanded">
        {d.notes&&<ul className="drill-notes">{d.notes.split("\n").filter(Boolean).map((n,i)=><li key={i}><span style={{color:c.text}}>· </span><span style={{color:T.noteText}}>{n}</span></li>)}</ul>}
        {d.video&&<a href={d.video} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,color:c.text,marginTop:8,textDecoration:"none"}}><Ico name="video" size={13}/> Watch video</a>}
        {!d.notes&&!d.video&&<span style={{fontSize:12,color:T.textDim}}>No additional details.</span>}
      </div>)}
    </div>);
  }

  // Warmup/cooldown picker helper
  function EndDrillPicker({label,color,val,set}){
    return(
      <div className="card" style={{marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontFamily:"'Oswald',sans-serif",fontSize:14,fontWeight:600,color}}>{label}</div><div style={{fontSize:12,color:T.textMuted,marginTop:2}}>{val?val.name:"No drill selected"}</div></div>
          <div style={{display:"flex",gap:6}}>{val&&<button className="icon-btn danger" onClick={()=>set(null)}><Ico name="x" size={14}/></button>}<button className="btn btn-ghost btn-sm" onClick={()=>set(null)} style={{fontSize:12}}><Ico name="plus" size={13}/> {val?"Change":"Add"}</button></div>
        </div>
        {!val&&drills.length>0&&(<div style={{maxHeight:180,overflowY:"auto",marginTop:10}}>{drills.map(d=>{const c=CAT[d.category]||CAT["Hitting"];return(<div key={d.id} className="pick-item" style={{borderLeftColor:c.border,borderLeftWidth:3,marginBottom:6}} onClick={()=>set(d)}><div className="pick-info" style={{padding:"10px 14px"}}><div className="pick-name" style={{fontSize:14}}>{d.name}</div><div className="pick-meta"><CatChip cat={d.category} small/></div></div></div>);})}</div>)}
      </div>
    );
  }

  const selectedPlan=planMap[selectedDate]||null;
  const navTabs=[{id:"drills",label:"Drills",icon:"dumbbell"},{id:"create",label:"Create",icon:"calPlus"},{id:"plans",label:"Plans",icon:"calDays"}];

  return(
    <div className="app">
      {/* Top bar */}
      <div className="top-bar">
        <img src={LOGO} alt="Panthers"/>
        <div><div className="top-bar-title">Panthers Planner</div><div className="top-bar-sub">U8 Tier 1 · Kitchener</div></div>
        <button className="theme-btn" onClick={()=>setDark(d=>!d)}><Ico name={dark?"sun":"moon"} size={16}/></button>
      </div>

      {/* Week strip — Plans tab only */}
      {tab==="plans"&&(
        <div className="week-strip-wrap">
          <div className="week-nav">
            <button className="week-arr" onClick={()=>setWeekBase(addWeeks(weekBase,-1))}>‹</button>
            <div className="week-range">{(()=>{
              const d0=new Date(weekDates[0]+"T12:00:00"),d6=new Date(weekDates[6]+"T12:00:00");
              const m0=d0.toLocaleDateString("en-CA",{month:"short"}),m6=d6.toLocaleDateString("en-CA",{month:"short"});
              return m0===m6?`${m0} ${d0.getDate()}–${d6.getDate()}, ${d0.getFullYear()}`:`${m0} ${d0.getDate()} – ${m6} ${d6.getDate()}, ${d6.getFullYear()}`;
            })()}</div>
            <button className="week-arr" onClick={()=>setWeekBase(addWeeks(weekBase,1))}>›</button>
          </div>
          <div className="week-days">
            {weekDates.map((date,i)=>(
              <div key={date} className={`wd${date===selectedDate?" sel":""}${date===today?" today":""}`} onClick={()=>setSelectedDate(date)}>
                <div className="wd-lbl">{DAY_LABELS[i]}</div>
                <div className="wd-num">{parseInt(date.split("-")[2])}</div>
                {planMap[date]?<div className="wd-dot"/>:<div className="wd-empty"/>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="scroll-area">

        {/* ══ DRILLS ══ */}
        {tab==="drills"&&(<>
          <div className="section-title">Drill Library</div>
          <div className="section-sub">Build and manage your team's drills</div>
          {!showForm&&<div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><button className="btn btn-primary btn-sm" onClick={()=>{resetForm();setShowForm(true);}}><Ico name="plus" size={14}/> Add Drill</button></div>}
          {showForm&&(<div className="card" style={{marginBottom:14}}>
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
            <div className="btn-row"><button className="btn btn-primary" onClick={saveDrill}>{editId?"Update":"Save Drill"}</button><button className="btn btn-ghost" onClick={resetForm}><Ico name="x" size={15}/> Cancel</button></div>
          </div>)}
          <CatFilter active={drillFilter} onChange={setDrillFilter}/>
          {filteredDrills.length===0?(<div className="empty"><Ico name="dumbbell" size={36}/><p>{drills.length===0?"No drills yet.\nTap Add Drill to create your first.":`No ${drillFilter} drills found.`}</p></div>):filteredDrills.map(d=><DrillCard key={d.id} d={d}/>)}
        </>)}

        {/* ══ CREATE ══ */}
        {tab==="create"&&(<>
          <div className="section-title">Create Practice</div>
          <div className="section-sub">Pick a date, time, and up to 3 drills</div>
          <div className="card"><div className="row2">
            <div><label className="label">Date</label><input type="date" className="input" value={pDate} onChange={e=>setPDate(e.target.value)}/></div>
            <div><label className="label">Start Time</label><input type="time" className="input" value={pTime} onChange={e=>setPTime(e.target.value)}/></div>
          </div></div>
          <div className="divider-label">Select Drills ({picked.length}/3)</div>
          <CatFilter active={createCatFilter} onChange={setCreateCatFilter}/>
          <PlayerFilter active={createPlayerFilter} onChange={setCreatePlayerFilter}/>
          {drills.length===0?(<div className="empty" style={{padding:"28px 0"}}><Ico name="dumbbell" size={32}/><p>Add drills in the Drills tab first.</p></div>):(()=>{
            const fR=applyFilters(recentDrills,createCatFilter,createPlayerFilter),fO=applyFilters(otherDrills,createCatFilter,createPlayerFilter);
            return(<>
              {fR.length>0&&(<><div className="recent-label"><Ico name="star" size={12}/> Recently Used</div>{fR.map(d=><PickItem key={d.id} d={d} sel={!!picked.find(p=>p.id===d.id)} idx={picked.findIndex(p=>p.id===d.id)} onToggle={togglePick}/>)}{fO.length>0&&<div className="divider-label" style={{marginTop:12}}>All Drills</div>}</>)}
              {fO.map(d=><PickItem key={d.id} d={d} sel={!!picked.find(p=>p.id===d.id)} idx={picked.findIndex(p=>p.id===d.id)} onToggle={togglePick}/>)}
              {fR.length===0&&fO.length===0&&<div className="empty" style={{padding:"24px 0"}}><Ico name="filter" size={28}/><p>No drills match these filters.</p></div>}
            </>);
          })()}
          <div className="divider-label" style={{marginTop:20}}>Warmup &amp; Cool Down <span style={{color:T.textDim,fontWeight:400,textTransform:"none",letterSpacing:0}}>(optional)</span></div>
          <EndDrillPicker label="Warmup Drill" color={CAT["Warmup"].text} val={warmupDrill} set={setWarmupDrill}/>
          <EndDrillPicker label="Cool Down Drill" color={CAT["Cool Down"].text} val={cooldownDrill} set={setCooldownDrill}/>
          <div className="divider-label" style={{marginTop:4}}>Parallel Station</div>
          <div className={`bat-toggle${battingParallel?" active":""}`} onClick={()=>setBattingParallel(b=>!b)}>
            <div className="bat-toggle-header"><div className="bat-check">{battingParallel&&<Ico name="checkmark" size={13}/>}</div><div><div className="bat-title"><Ico name="bat" size={15}/> Add Batting Practice Station</div><div className="bat-sub">Runs in parallel with all drills — players rotate through</div></div></div>
            {battingParallel&&(<div className="bat-detail">{BAT_DRILL.notes.split("\n").map((n,i)=><div key={i} className="bat-note">{n}</div>)}</div>)}
          </div>
          {picked.length>0&&(<>
            <div className="divider-label" style={{marginTop:20}}>Schedule Preview</div>
            {battingParallel?(
              <div className="card"><div className="schedule-grid">
                <div><div className="schedule-col-label"><Ico name="dumbbell" size={11}/> Main Drills</div><div className="tl">{buildSchedule(pTime,picked,warmupDrill,cooldownDrill).map((b,i)=>(<div key={i} className="tl-row"><div className="tl-dot" style={b.drill?(()=>{const c=CAT[b.drill.category]||CAT["Hitting"];return{background:c.text};})():{}} /><div className="tl-time">{b.start}</div><div className="tl-label" style={{fontSize:13}}>{b.label}{b.drill&&(b.label==="Warmup"||b.label==="Cool Down")?` · ${b.drill.name}`:""}</div><div className="tl-dur">{b.dur}m</div></div>))}</div></div>
                <div><div className="schedule-col-label" style={{color:BAT_COLOR.text}}><Ico name="bat" size={11}/> Batting</div><div className="bat-station"><div className="bat-station-title"><Ico name="bat" size={13}/> Batting Practice</div><div style={{fontSize:12,color:T.textMuted,marginBottom:6}}>Full practice · rotate through</div>{BAT_DRILL.notes.split("\n").map((n,i)=><div key={i} className="bat-station-note">{n}</div>)}</div></div>
              </div></div>
            ):(
              <div className="card"><div className="tl">{buildSchedule(pTime,picked,warmupDrill,cooldownDrill).map((b,i)=>(<div key={i} className="tl-row"><div className="tl-dot" style={b.drill?(()=>{const c=CAT[b.drill.category]||CAT["Hitting"];return{background:c.text};})():{}} /><div className="tl-time">{b.start} – {b.end}</div><div className="tl-label">{b.label}{b.drill&&(b.label==="Warmup"||b.label==="Cool Down")?` · ${b.drill.name}`:""}</div><div className="tl-dur">{b.dur}m</div></div>))}</div></div>
            )}
          </>)}
          <button className="btn btn-primary btn-full" style={{marginTop:8}} onClick={savePractice}><Ico name="calPlus" size={16}/> Save Practice Plan</button>
        </>)}

        {/* ══ PLANS — Week strip + schedule ══ */}
        {tab==="plans"&&(()=>{
          if(!selectedPlan){
            return(
              <div className="ps-empty">
                <Ico name="calDays" size={40}/>
                <div className="ps-empty-title">No practice on {new Date(selectedDate+"T12:00:00").toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric"})}</div>
                <div className="ps-empty-sub">Tap a dot-marked day above to view a practice,<br/>or create one for this day.</div>
                <button className="btn btn-primary" onClick={()=>{setPDate(selectedDate);setTab("create");}}><Ico name="calPlus" size={15}/> Create Practice for This Day</button>
              </div>
            );
          }
          const sched=buildSchedule(selectedPlan.start||"17:00",selectedPlan.drills||[],selectedPlan.warmupDrill||null,selectedPlan.cooldownDrill||null);
          const totalMins=sched.reduce((s,b)=>s+b.dur,0);
          return(
            <>
              <div className="toolbar" style={{margin:"0 -16px",width:"calc(100% + 32px)"}}>
                <div className="tb-info">
                  <div className="tb-date">{dateLabel(selectedPlan.date)}</div>
                  <div className="tb-time">{fmt(...(selectedPlan.start||"17:00").split(":").map(Number))} · {totalMins} min</div>
                </div>
                <div className="tb-btns">
                  <button className="tb-btn share" onClick={()=>copyLink(selectedPlan)} title="Copy share link"><Ico name="share" size={15}/></button>
                  <button className="tb-btn" onClick={()=>openEditPlan(selectedPlan)} title="Edit"><Ico name="pencil" size={15}/></button>
                  <button className="tb-btn danger" onClick={()=>delPlan(selectedPlan.id)} title="Delete"><Ico name="trash" size={15}/></button>
                </div>
              </div>
              <PracticeSchedule key={selectedDate} plan={selectedPlan} T={T}/>
            </>
          );
        })()}

      </div>

      <nav className="bottom-nav">
        {navTabs.map(({id,label,icon})=>(<button key={id} className={`nav-tab${tab===id?" active":""}`} onClick={()=>setTab(id)}><Ico name={icon} size={22}/>{label}{id==="plans"&&plans.length>0&&<span className="nav-badge">{plans.length}</span>}</button>))}
      </nav>

      {/* Edit plan modal */}
      {editPlan&&(<div className="overlay" onClick={e=>{if(e.target===e.currentTarget)setEditPlan(null);}}>
        <div className="modal">
          <div className="modal-handle"/>
          <div className="modal-title">Edit Practice</div>
          <div className="row2" style={{marginBottom:14}}>
            <div><label className="label">Date</label><input type="date" className="input" value={ePDate} onChange={e=>setEPDate(e.target.value)}/></div>
            <div><label className="label">Time</label><input type="time" className="input" value={ePTime} onChange={e=>setEPTime(e.target.value)}/></div>
          </div>
          <div className="divider-label">Drills ({ePicked.length}/3)</div>
          {drills.map(d=>{const sel=!!ePicked.find(p=>p.id===d.id);return(<div key={d.id} className={`pick-item${sel?" picked":""}`} onClick={()=>toggleEPick(d)}><div className="pick-header"><div className="pick-circle">{sel&&<Ico name="checkmark" size={13}/>}</div><div className="pick-info"><div className="pick-name" style={{marginBottom:4}}>{d.name}</div><div className="pick-meta"><CatChip cat={d.category} small/><span className="dur-chip" style={{fontSize:11,padding:"2px 7px"}}>{d.duration||20}m</span></div></div>{sel&&<div className="pick-num">#{ePicked.findIndex(p=>p.id===d.id)+1}</div>}</div></div>);})}
          <div className="divider-label">Warmup &amp; Cool Down</div>
          {[{label:"Warmup Drill",color:CAT["Warmup"].text,val:eWarmupDrill,set:setEWarmupDrill},{label:"Cool Down Drill",color:CAT["Cool Down"].text,val:eCooldownDrill,set:setECooldownDrill}].map(({label,color,val,set})=>(
            <div key={label} className="card" style={{marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div><div style={{fontFamily:"'Oswald',sans-serif",fontSize:13,fontWeight:600,color}}>{label}</div><div style={{fontSize:11,color:T.textMuted,marginTop:1}}>{val?val.name:"None selected"}</div></div>
                <div style={{display:"flex",gap:5}}>{val&&<button className="icon-btn danger" onClick={()=>set(null)}><Ico name="x" size={13}/></button>}<button className="btn btn-ghost btn-sm" style={{fontSize:11}} onClick={()=>set(null)}><Ico name="plus" size={12}/>{val?"Change":"Add"}</button></div>
              </div>
              {!val&&drills.length>0&&(<div style={{maxHeight:150,overflowY:"auto",marginTop:8}}>{drills.map(d=>{const c=CAT[d.category]||CAT["Hitting"];return(<div key={d.id} className="pick-item" style={{borderLeftColor:c.border,borderLeftWidth:3,marginBottom:5}} onClick={()=>set(d)}><div className="pick-info" style={{padding:"8px 12px"}}><div className="pick-name" style={{fontSize:13}}>{d.name}</div><div className="pick-meta"><CatChip cat={d.category} small/></div></div></div>);})}</div>)}
            </div>
          ))}
          <div className="divider-label">Parallel Station</div>
          <div className={`bat-toggle${eBat?" active":""}`} onClick={()=>setEBat(b=>!b)} style={{marginBottom:14}}>
            <div className="bat-toggle-header"><div className="bat-check">{eBat&&<Ico name="checkmark" size={13}/>}</div><div><div className="bat-title"><Ico name="bat" size={15}/> Batting Practice Station</div><div className="bat-sub">Runs in parallel with all drills</div></div></div>
          </div>
          <div className="btn-row"><button className="btn btn-primary" onClick={saveEditPlan}>Save Changes</button><button className="btn btn-ghost" onClick={()=>setEditPlan(null)}>Cancel</button></div>
        </div>
      </div>)}

      {toast.msg&&<div className="toast">{toast.msg}</div>}
    </div>
  );
}
