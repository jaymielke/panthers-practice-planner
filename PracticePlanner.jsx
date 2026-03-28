import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Panthers Chalk Palette ───────────────────────────────────────────────────
const P = {
  steel:      "#5f8db5",
  steelDim:   "rgba(95,141,181,0.12)",
  steelLight: "rgba(95,141,181,0.08)",
  steelBorder:"rgba(95,141,181,0.35)",
  gold:       "#e3b440",
  goldDim:    "rgba(227,180,64,0.15)",
  goldBorder: "rgba(227,180,64,0.35)",
  black:      "#111111",
  text:       "#1a2535",
  textMuted:  "#7a92a8",
  textDim:    "#a0b4c4",
  bg:         "#f4f6f9",
  surface:    "#ffffff",
  border:     "#dde3eb",
  borderHi:   "rgba(95,141,181,0.5)",
  inputBg:    "#f4f6f9",
  danger:     "#e05252",
  success:    "#3dba7a",
  navText:    "#b0c4d4",
};

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
    star:      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    trophy:    "M8 21h8M12 17v4M17 3H7l1 7c0 2.21 1.79 4 4 4s4-1.79 4-4l1-7zM4 3h2M18 3h2M4 3c0 3 1 5 3 6M20 3c0 3-1 5-3 6",
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
  "Hitting":      {bg:"rgba(239,107,54,0.1)",  border:"rgba(239,107,54,0.4)",  text:"#d4581e"},
  "Fielding":     {bg:"rgba(59,185,128,0.1)",  border:"rgba(59,185,128,0.4)",  text:"#2a9e6a"},
  "Throwing":     {bg:"rgba(100,149,237,0.1)", border:"rgba(100,149,237,0.4)", text:"#4a7ed4"},
  "Base Running": {bg:"rgba(200,155,0,0.1)",   border:"rgba(200,155,0,0.4)",   text:"#a07800"},
  "Warmup":       {bg:"rgba(147,119,230,0.1)", border:"rgba(147,119,230,0.4)", text:"#7c5ec8"},
  "Catcher":      {bg:"rgba(220,80,105,0.1)",  border:"rgba(220,80,105,0.4)",  text:"#c0405a"},
  "Pitcher":      {bg:"rgba(20,180,210,0.1)",  border:"rgba(20,180,210,0.4)",  text:"#0d8fa8"},
  "Cool Down":    {bg:"rgba(120,145,165,0.1)", border:"rgba(120,145,165,0.4)", text:"#607585"},
};
const CATS=Object.keys(CAT);
const DURATIONS=[10,15,20,30];
const VENUE_OPTIONS=["Both","Indoor","Outdoor"];
const VENUE_ICONS={Indoor:"home",Outdoor:"sun",Both:"star"};
const VENUE_COLORS={
  Indoor: {bg:"rgba(147,119,230,0.1)",border:"rgba(147,119,230,0.35)",text:"#7c5ec8"},
  Outdoor:{bg:"rgba(59,185,128,0.1)", border:"rgba(59,185,128,0.35)", text:"#2a9e6a"},
  Both:   {bg:"rgba(200,155,0,0.1)",  border:"rgba(200,155,0,0.35)",  text:"#a07800"},
};
const PLAYER_FILTERS=["Any","1–4","5–10","10+"];
const BAT_COLOR={bg:"rgba(239,107,54,0.08)",border:"rgba(239,107,54,0.3)",text:"#d4581e"};
const BAT_DRILL={id:"batting",name:"Batting Practice",category:"Hitting",notes:"5 minutes per player hitting\nOn Deck: hitting off tee",players:0,duration:0,venue:"Both",video:""};
const LOGO="/KMBA-Panthers-Logo_U8_Tier_1.png";

// ─── Roster ───────────────────────────────────────────────────────────────────
const ROSTER=[
  {id:"p25", jersey:25, first:"Lawson",   last:"Buck"},
  {id:"p67", jersey:67, first:"Miles",    last:"Bell"},
  {id:"p6",  jersey:6,  first:"Ethan",    last:"Deitner"},
  {id:"p12", jersey:12, first:"Max",      last:"Dorsch"},
  {id:"p7",  jersey:7,  first:"Ryker",    last:"Falconer"},
  {id:"p28", jersey:28, first:"Eli",      last:"Herman"},
  {id:"p22", jersey:22, first:"Leonardo", last:"Hoover"},
  {id:"p11", jersey:11, first:"Riley",    last:"James"},
  {id:"p17", jersey:17, first:"Declan",   last:"Kopysh"},
  {id:"p98", jersey:98, first:"Jacob",    last:"Lannan"},
  {id:"p46", jersey:46, first:"Samuel",   last:"Lannan"},
  {id:"p10", jersey:10, first:"Carter",   last:"Mielke"},
  {id:"p5",  jersey:5,  first:"Kevin",    last:"Puddephatt"},
  {id:"p99", jersey:99, first:"Henri",    last:"Raymond"},
];

function matchesPlayerFilter(d,pf){
  if(pf==="Any")return true;const p=d.players||1;
  if(pf==="1–4")return p>=1&&p<=4;if(pf==="5–10")return p>=5&&p<=10;if(pf==="10+")return p>10;return true;
}
function CatChip({cat,small=false}){
  const c=CAT[cat]||CAT["Hitting"];
  return<span style={{display:"inline-flex",alignItems:"center",gap:3,background:c.bg,border:`1px solid ${c.border}`,color:c.text,borderRadius:5,padding:small?"2px 7px":"3px 9px",fontSize:small?11:12,fontWeight:800,whiteSpace:"nowrap",fontFamily:"'Nunito',sans-serif"}}>{cat}</span>;
}
function VenueChip({venue,small=false}){
  if(!venue||venue==="Both")return null;
  const v=VENUE_COLORS[venue]||VENUE_COLORS["Both"];
  return<span style={{display:"inline-flex",alignItems:"center",gap:4,background:v.bg,border:`1px solid ${v.border}`,color:v.text,borderRadius:5,padding:small?"2px 7px":"3px 9px",fontSize:small?11:12,fontWeight:800,whiteSpace:"nowrap",fontFamily:"'Nunito',sans-serif"}}><Ico name={VENUE_ICONS[venue]||"star"} size={10}/>{venue}</span>;
}

// ─── Supabase ─────────────────────────────────────────────────────────────────
const SB_URL=import.meta.env.VITE_SUPABASE_URL;
const SB_KEY=import.meta.env.VITE_SUPABASE_KEY;
async function sbGet(table){try{const r=await fetch(`${SB_URL}/rest/v1/${table}?select=id,data`,{headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`}});const rows=await r.json();if(!Array.isArray(rows))return[];return rows.map(r=>r.data);}catch{return[];}}
async function sbUpsert(table,id,data){try{await fetch(`${SB_URL}/rest/v1/${table}`,{method:"POST",headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates"},body:JSON.stringify({id,data})});}catch{}}
async function sbDelete(table,id){try{await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`,{method:"DELETE",headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`}});}catch{}}
async function sbGetMvp(){try{const r=await fetch(`${SB_URL}/rest/v1/mvp?select=id,data`,{headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`}});const rows=await r.json();if(!Array.isArray(rows))return{};const rec=rows[0];return rec?rec.data:{};}catch{return{};}}
async function sbSaveMvp(counts){try{await fetch(`${SB_URL}/rest/v1/mvp`,{method:"POST",headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates"},body:JSON.stringify({id:1,data:counts})});}catch{}}
async function sbGetAttendance(){try{const r=await fetch(`${SB_URL}/rest/v1/attendance?select=id,data`,{headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`}});const rows=await r.json();if(!Array.isArray(rows))return{};const rec=rows[0];return rec?rec.data:{};}catch{return{};}}
async function sbSaveAttendance(data){try{await fetch(`${SB_URL}/rest/v1/attendance`,{method:"POST",headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,"Content-Type":"application/json","Prefer":"resolution=merge-duplicates"},body:JSON.stringify({id:1,data})});}catch{}}
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

// ─── CSS ──────────────────────────────────────────────────────────────────────
const APP_CSS=`
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Oswald:wght@600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:${P.bg};font-family:'Nunito',sans-serif;color:${P.text};min-height:100vh;}
.app{min-height:100vh;display:flex;flex-direction:column;max-width:680px;margin:0 auto;}

/* Top bar */
.top-bar{display:flex;align-items:center;gap:12px;padding:11px 16px;border-bottom:3px solid ${P.gold};background:${P.surface};position:sticky;top:0;z-index:50;}
.top-bar img{width:44px;height:44px;object-fit:contain;}
.top-bar-title{font-family:'Oswald',sans-serif;font-size:17px;font-weight:700;color:${P.black};line-height:1;}
.top-bar-sub{font-size:9px;color:${P.steel};text-transform:uppercase;letter-spacing:2px;margin-top:2px;font-weight:800;}

/* Layout */
.scroll-area{flex:1;overflow-y:auto;padding:16px 16px 100px;}
.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:680px;background:${P.surface};border-top:2px solid ${P.border};display:flex;z-index:100;padding-bottom:env(safe-area-inset-bottom,0px);}
.nav-tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 8px 8px;background:none;border:none;cursor:pointer;color:${P.navText};font-family:'Nunito',sans-serif;font-size:9px;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;transition:color 0.15s;-webkit-tap-highlight-color:transparent;}
.nav-tab.active{color:${P.steel};}
.nav-badge{display:inline-flex;align-items:center;justify-content:center;background:${P.gold};color:${P.black};border-radius:10px;font-size:9px;font-weight:900;padding:1px 5px;min-width:16px;height:16px;margin-left:2px;}

/* Filters */
.filter-bar{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;margin-bottom:10px;scrollbar-width:none;}
.filter-bar::-webkit-scrollbar{display:none;}
.filter-pill{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:20px;border:1.5px solid ${P.border};background:${P.surface};cursor:pointer;white-space:nowrap;font-family:'Nunito',sans-serif;font-size:11px;font-weight:800;color:${P.textMuted};transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
.filter-pill.all-active{background:${P.steel};border-color:${P.steel};color:#fff;}
.filter-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;align-items:center;}
.filter-group-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${P.textDim};margin-right:2px;}
.recent-label{display:flex;align-items:center;gap:7px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.3px;color:${P.gold};margin:4px 0 8px;}
.recent-label::after{content:'';flex:1;height:1.5px;background:${P.goldBorder};}

/* Page headers */
.section-title{font-family:'Oswald',sans-serif;font-size:24px;font-weight:700;color:${P.black};margin-bottom:3px;}
.section-sub{font-size:12px;color:${P.textMuted};font-weight:700;margin-bottom:16px;}

/* Cards */
.card{background:${P.surface};border-radius:14px;border:1.5px solid ${P.border};padding:18px;margin-bottom:12px;}
.card-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${P.textDim};margin-bottom:14px;}

/* Forms */
.field{margin-bottom:14px;}
.label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${P.textDim};display:block;margin-bottom:6px;}
.input,.select,.textarea{width:100%;padding:11px 13px;background:${P.inputBg};border:1.5px solid ${P.border};border-radius:9px;font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;color:${P.text};transition:border-color 0.15s;}
.textarea{resize:vertical;min-height:80px;}
.input::placeholder,.textarea::placeholder{color:${P.textDim};font-weight:600;}
.input:focus,.select:focus,.textarea:focus{outline:none;border-color:${P.steel};box-shadow:0 0 0 3px ${P.steelDim};}
.select{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235f8db5' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;background-color:${P.inputBg};}
.select option{background:${P.surface};color:${P.text};}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}

/* Duration & venue pickers */
.dur-picker{display:flex;gap:8px;}
.dur-btn{flex:1;padding:9px 4px;border-radius:8px;border:1.5px solid ${P.border};background:${P.inputBg};cursor:pointer;font-family:'Oswald',sans-serif;font-size:15px;font-weight:600;color:${P.textMuted};transition:all 0.15s;text-align:center;}
.dur-btn:hover{border-color:${P.steel};color:${P.steel};}
.dur-btn.dur-active{background:${P.steel};border-color:${P.steel};color:#fff;}
.venue-picker{display:flex;gap:8px;}
.venue-btn{flex:1;padding:9px 4px;border-radius:8px;border:1.5px solid ${P.border};background:${P.inputBg};cursor:pointer;font-family:'Nunito',sans-serif;font-size:12px;font-weight:700;color:${P.textMuted};transition:all 0.15s;text-align:center;display:flex;flex-direction:column;align-items:center;gap:4px;}
.venue-btn:hover{border-color:${P.steelBorder};color:${P.steel};}

/* Buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 20px;border-radius:10px;border:none;font-family:'Nunito',sans-serif;font-size:14px;font-weight:800;cursor:pointer;transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
.btn-sm{padding:7px 14px;font-size:12px;}
.btn-primary{background:${P.steel};color:#fff;}
.btn-primary:hover{opacity:0.88;}
.btn-ghost{background:transparent;color:${P.textMuted};border:1.5px solid ${P.border};}
.btn-ghost:hover{border-color:${P.steel};color:${P.steel};}
.btn-full{width:100%;}
.btn-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;}
.icon-btn{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;border:1.5px solid ${P.border};background:${P.inputBg};cursor:pointer;color:${P.textMuted};transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
.icon-btn:hover{border-color:${P.steel};color:${P.steel};}
.icon-btn.danger:hover{border-color:${P.danger};color:${P.danger};}

/* Drill items */
.drill-item{background:${P.surface};border-radius:0 12px 12px 0;padding:14px;margin-bottom:9px;border:1.5px solid ${P.border};border-left-width:3px;transition:border-color 0.15s;}
.drill-item:hover{border-color:${P.steelBorder};}
.drill-item-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.drill-name{font-family:'Oswald',sans-serif;font-size:18px;font-weight:700;color:${P.black};margin-bottom:7px;}
.meta-chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:7px;align-items:center;}
.player-chip{display:inline-flex;align-items:center;gap:4px;background:${P.steelLight};color:${P.steel};border-radius:5px;padding:3px 9px;font-size:11px;font-weight:800;}
.dur-chip{display:inline-flex;align-items:center;gap:4px;background:${P.steelLight};color:${P.steel};border-radius:5px;padding:3px 9px;font-size:11px;font-weight:800;}
.drill-notes{list-style:none;padding:0;margin-top:4px;}
.drill-notes li{font-size:12px;color:${P.textMuted};padding:2px 0;font-weight:600;}
.drill-actions{display:flex;gap:7px;flex-shrink:0;}

/* Pick items */
.pick-item{background:${P.surface};border:1.5px solid ${P.border};border-left-width:3px;border-radius:0 11px 11px 0;margin-bottom:8px;transition:all 0.15s;user-select:none;-webkit-tap-highlight-color:transparent;}
.pick-item:hover{border-color:${P.steelBorder};}
.pick-item.picked{border-color:${P.steel};background:${P.steelLight};}
.pick-header{display:flex;align-items:center;gap:12px;padding:12px 14px;cursor:pointer;}
.pick-circle{width:22px;height:22px;border-radius:50%;border:2px solid ${P.border};display:flex;align-items:center;justify-content:center;flex-shrink:0;color:transparent;transition:all 0.15s;}
.pick-item.picked .pick-circle{background:${P.steel};border-color:${P.steel};color:#fff;}
.pick-info{flex:1;min-width:0;}
.pick-name{font-weight:800;font-size:14px;color:${P.black};margin-bottom:4px;}
.pick-meta{display:flex;gap:5px;flex-wrap:wrap;align-items:center;}
.pick-num{font-family:'Oswald',sans-serif;font-size:18px;font-weight:700;color:${P.steel};flex-shrink:0;}
.pick-expand-btn{display:flex;align-items:center;justify-content:center;padding:4px 10px;border-radius:6px;border:1.5px solid ${P.border};background:${P.inputBg};cursor:pointer;color:${P.textMuted};font-size:11px;font-weight:800;gap:3px;transition:all 0.15s;white-space:nowrap;}
.pick-expand-btn:hover{border-color:${P.steel};color:${P.steel};}
.pick-expanded{padding:0 14px 12px 50px;border-top:1.5px solid ${P.border};}

/* Timeline */
.tl{margin-top:10px;}
.tl-row{display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1.5px solid ${P.bg};}
.tl-row:last-child{border-bottom:none;}
.tl-dot{width:7px;height:7px;border-radius:50%;background:${P.steel};flex-shrink:0;}
.tl-time{font-size:11px;font-weight:800;color:${P.textMuted};width:130px;flex-shrink:0;}
.tl-label{font-size:13px;font-weight:700;color:${P.black};flex:1;}
.tl-dur{font-size:11px;color:${P.textDim};font-weight:700;}

/* Batting toggle */
.bat-toggle{background:${P.surface};border:1.5px solid ${BAT_COLOR.border};border-radius:12px;padding:14px 16px;margin-bottom:12px;cursor:pointer;transition:all 0.15s;user-select:none;}
.bat-toggle.active{background:${BAT_COLOR.bg};}
.bat-toggle-header{display:flex;align-items:center;gap:12px;}
.bat-check{width:24px;height:24px;border-radius:6px;border:2px solid ${BAT_COLOR.border};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.15s;color:transparent;}
.bat-toggle.active .bat-check{background:${BAT_COLOR.text};border-color:${BAT_COLOR.text};color:#fff;}
.bat-title{font-family:'Oswald',sans-serif;font-size:15px;font-weight:700;color:${BAT_COLOR.text};}
.bat-sub{font-size:11px;color:${P.textMuted};margin-top:2px;font-weight:600;}
.bat-detail{margin-top:10px;padding-top:10px;border-top:1px solid ${BAT_COLOR.border};}
.bat-note{font-size:12px;color:${P.textMuted};padding:2px 0;font-weight:600;}
.bat-note::before{content:"· ";color:${BAT_COLOR.text};font-weight:900;}

/* Schedule preview grid */
.schedule-grid{display:grid;grid-template-columns:minmax(0,70fr) minmax(0,30fr);gap:10px;margin-bottom:8px;}
.schedule-col-label{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${P.textDim};margin-bottom:6px;display:flex;align-items:center;gap:5px;}
.bat-station{background:${BAT_COLOR.bg};border:1.5px solid ${BAT_COLOR.border};border-radius:10px;padding:12px;}
.bat-station-title{font-family:'Oswald',sans-serif;font-size:13px;font-weight:700;color:${BAT_COLOR.text};margin-bottom:6px;display:flex;align-items:center;gap:6px;}
.bat-station-note{font-size:11px;color:${P.textMuted};padding:2px 0;font-weight:600;}
.bat-station-note::before{content:"· ";color:${BAT_COLOR.text};font-weight:900;}

/* Misc */
.divider-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.3px;color:${P.textDim};margin:16px 0 10px;display:flex;align-items:center;gap:6px;}
.divider-label::after{content:'';flex:1;height:1.5px;background:${P.border};}
.empty{text-align:center;padding:44px 24px;color:${P.textDim};}
.empty p{font-size:13px;line-height:1.7;margin-top:10px;font-weight:600;}

/* Modal */
.overlay{position:fixed;inset:0;background:rgba(26,37,53,0.45);z-index:200;display:flex;align-items:flex-end;justify-content:center;}
.modal{background:${P.surface};border-radius:20px 20px 0 0;border:1.5px solid ${P.border};border-bottom:none;padding:22px 18px 36px;width:100%;max-width:680px;max-height:88vh;overflow-y:auto;box-shadow:0 -12px 40px rgba(26,37,53,0.12);}
.modal-handle{width:38px;height:4px;background:${P.border};border-radius:2px;margin:0 auto 18px;}
.modal-title{font-family:'Oswald',sans-serif;font-size:20px;font-weight:700;color:${P.black};margin-bottom:16px;}

/* Toast */
.toast{position:fixed;bottom:84px;left:50%;transform:translateX(-50%);background:${P.steel};color:#fff;padding:10px 22px;border-radius:40px;font-size:13px;font-weight:800;white-space:nowrap;box-shadow:0 6px 20px rgba(95,141,181,0.35);z-index:500;animation:toastIn 0.2s ease;}
@keyframes toastIn{from{transform:translateX(-50%) translateY(8px);opacity:0;}to{transform:translateX(-50%) translateY(0);opacity:1;}}

/* ═══ WEEK STRIP ══════════════════════════════════════════════════ */
.week-strip-wrap{background:${P.surface};padding:10px 14px 0;border-bottom:1.5px solid ${P.border};position:sticky;top:61px;z-index:40;transition:transform 0.25s ease,opacity 0.25s ease;}
.week-strip-wrap.strip-hidden{transform:translateY(-100%);opacity:0;pointer-events:none;}
.week-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.week-range{font-family:'Oswald',sans-serif;font-size:13px;font-weight:700;color:${P.textMuted};}
.week-arr{background:none;border:none;color:${P.textDim};font-size:14px;cursor:pointer;padding:2px 8px;border-radius:6px;font-weight:800;}
.week-arr:hover{color:${P.steel};}
.week-days{display:flex;gap:3px;}
.wd{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:7px 2px 9px;border-radius:10px 10px 0 0;cursor:pointer;transition:background 0.15s;-webkit-tap-highlight-color:transparent;}
.wd:hover{background:${P.steelLight};}
.wd.sel{background:${P.steel};}
.wd-lbl{font-size:9px;font-weight:800;text-transform:uppercase;color:${P.textDim};letter-spacing:0.5px;}
.wd.sel .wd-lbl{color:rgba(255,255,255,0.8);}
.wd-num{font-family:'Oswald',sans-serif;font-size:16px;font-weight:700;color:${P.textMuted};}
.wd.sel .wd-num{color:#fff;}
.wd.today .wd-num{color:${P.steel};}
.wd.sel.today .wd-num{color:#fff;}
.wd-dot{width:5px;height:5px;border-radius:50%;background:${P.gold};}
.wd.sel .wd-dot{background:rgba(255,255,255,0.85);}
.wd-empty{width:5px;height:5px;}

/* ═══ TOOLBAR ═════════════════════════════════════════════════════ */
.toolbar{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1.5px solid ${P.border};background:#fafbfd;margin:0 -16px;width:calc(100% + 32px);}
.tb-info{flex:1;min-width:0;}
.tb-date{font-family:'Oswald',sans-serif;font-size:16px;font-weight:700;color:${P.black};line-height:1.1;}
.tb-time{font-size:10px;color:${P.textMuted};margin-top:2px;font-weight:700;}
.tb-btns{display:flex;gap:6px;flex-shrink:0;}
.tb-btn{width:34px;height:34px;border-radius:50%;border:1.5px solid ${P.border};background:${P.surface};display:flex;align-items:center;justify-content:center;cursor:pointer;color:${P.textMuted};transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
.tb-btn:hover{border-color:${P.steel};color:${P.steel};}
.tb-btn.share{background:${P.steelLight};border-color:${P.steelBorder};color:${P.steel};}
.tb-btn.danger:hover{border-color:${P.danger};color:${P.danger};}

/* ═══ PRACTICE SCHEDULE ═══════════════════════════════════════════ */
.ps-start-wrap{padding:12px 14px;background:${P.steelLight};border-bottom:1.5px solid ${P.border};display:flex;justify-content:center;}
.ps-start-btn{display:flex;align-items:center;gap:9px;background:${P.steel};color:#fff;border:none;border-radius:22px;padding:12px 36px;font-family:'Oswald',sans-serif;font-size:16px;font-weight:700;cursor:pointer;transition:opacity 0.15s;}
.ps-start-btn:hover{opacity:0.88;}
.ps-timer{background:${P.steel};padding:11px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.ps-timer-info{flex:1;min-width:0;}
.ps-timer-name{font-family:'Oswald',sans-serif;font-size:14px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ps-timer-of{font-size:10px;color:rgba(255,255,255,0.65);margin-top:1px;font-weight:700;}
.ps-timer-digits{font-family:'Oswald',sans-serif;font-size:30px;font-weight:700;color:#fff;letter-spacing:3px;flex-shrink:0;}
.ps-timeup{font-size:10px;font-weight:800;color:#ffe8a0;text-align:center;margin-top:1px;}
.ps-timer-btns{display:flex;gap:6px;flex-shrink:0;}
.ps-timer-btn{width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.18);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.15s;-webkit-tap-highlight-color:transparent;}
.ps-timer-btn:hover{background:rgba(255,255,255,0.28);}
.ps-timer-btn.finish{background:${P.success};}
.ps-timer-btn:disabled{opacity:0.22;cursor:not-allowed;pointer-events:none;}
.ps-prog-wrap{height:4px;background:rgba(95,141,181,0.15);}
.ps-prog-fill{height:4px;background:${P.gold};transition:width 0.5s linear;}
.col-hdrs{display:grid;grid-template-columns:minmax(0,70fr) minmax(0,30fr);gap:7px;padding:8px 14px 2px;}
.col-hdr{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${P.textDim};display:flex;align-items:center;gap:4px;}
.col-hdr.bat{color:${BAT_COLOR.text};}
.ps-blocks{padding:0 14px 24px;display:flex;flex-direction:column;gap:7px;margin-top:7px;}
.ps-block{background:${P.surface};border:1.5px solid ${P.border};border-left-width:3px;border-radius:0 12px 12px 0;overflow:hidden;transition:border-color 0.2s;}
.ps-block.cur{border-color:${P.steel};background:${P.steelLight};}
.ps-block.done{opacity:0.38;}
.ps-block-hd{display:flex;align-items:center;gap:10px;padding:11px 13px;}
.ps-idx{width:26px;height:26px;border-radius:50%;background:${P.inputBg};display:flex;align-items:center;justify-content:center;font-family:'Oswald',sans-serif;font-size:12px;font-weight:700;color:${P.textMuted};flex-shrink:0;border:1.5px solid ${P.border};}
.ps-block.cur .ps-idx{background:${P.steel};border-color:${P.steel};color:#fff;}
.ps-block.done .ps-idx{background:${P.success};border-color:${P.success};color:#fff;}
.ps-block-info{flex:1;min-width:0;}
.ps-block-name{font-family:'Oswald',sans-serif;font-size:15px;font-weight:700;color:${P.textMuted};line-height:1.2;}
.ps-block.cur .ps-block-name{color:${P.black};}
.ps-block-time{font-size:10px;color:${P.textDim};margin-top:1px;font-weight:700;}
.ps-block-dur{font-size:11px;color:${P.textDim};flex-shrink:0;font-weight:700;}
.ps-expand-btn{display:flex;align-items:center;gap:5px;padding:6px 11px;border-radius:8px;background:${P.steelLight};border:1.5px solid ${P.border};color:${P.steel};font-family:'Nunito',sans-serif;font-size:12px;font-weight:800;cursor:pointer;flex-shrink:0;transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
.ps-expand-btn.open{border-color:${P.steelBorder};}
.ps-block-detail{padding:0 13px 12px 49px;border-top:1.5px solid ${P.border};}
.ps-dl{margin-top:10px;}
.ps-dl-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:${P.textDim};margin-bottom:6px;}
.ps-chips{display:flex;gap:6px;flex-wrap:wrap;}
.ps-chip{display:flex;align-items:center;gap:4px;background:${P.steelLight};color:${P.steel};border-radius:5px;padding:2px 8px;font-size:11px;font-weight:800;}
.ps-notes{list-style:none;padding:0;}
.ps-notes li{font-size:12px;color:${P.textMuted};padding:4px 0;border-bottom:1.5px solid ${P.bg};font-weight:600;}
.ps-notes li:last-child{border-bottom:none;}
.ps-vid{display:inline-flex;align-items:center;gap:7px;background:${P.steelLight};border:1.5px solid ${P.border};border-radius:7px;padding:7px 12px;color:${P.steel};text-decoration:none;font-size:12px;font-weight:800;margin-top:10px;}
.ps-bat-col{background:${BAT_COLOR.bg};border:1.5px solid ${BAT_COLOR.border};border-radius:12px;padding:12px 10px;display:flex;flex-direction:column;gap:6px;}
.ps-bat-title{font-family:'Oswald',sans-serif;font-size:12px;font-weight:700;color:${BAT_COLOR.text};display:flex;align-items:center;gap:5px;}
.ps-bat-sub{font-size:9px;color:${P.textMuted};font-weight:700;}
.ps-bat-divider{height:1.5px;background:${BAT_COLOR.border};}
.ps-bat-note{font-size:10px;color:${P.textMuted};padding:1px 0;font-weight:700;}
.ps-bat-note::before{content:"· ";color:${BAT_COLOR.text};font-weight:900;}
.ps-done-banner{background:rgba(59,186,122,0.08);border:1.5px solid rgba(59,186,122,0.3);border-radius:14px;padding:24px;text-align:center;margin-bottom:8px;}
.ps-done-logo{width:64px;height:64px;object-fit:contain;margin-bottom:10px;}
.ps-done-title{font-family:'Oswald',sans-serif;font-size:22px;font-weight:700;color:${P.black};}
.ps-done-sub{font-size:12px;color:${P.textMuted};margin-top:5px;font-weight:700;}
.ps-empty{text-align:center;padding:40px 16px;color:${P.textDim};}
.ps-empty-title{font-family:'Oswald',sans-serif;font-size:18px;font-weight:700;color:${P.textMuted};margin:12px 0 6px;}
.ps-empty-sub{font-size:12px;margin-bottom:18px;line-height:1.6;font-weight:600;}

@media(max-width:480px){
.ps-timer-digits{font-size:24px;}
.schedule-grid{grid-template-columns:1fr;}
.ps-blocks{padding:0 10px 24px;}
}
.ps-bat-col{min-width:0;word-break:break-word;}
.ps-bat-note{white-space:normal;word-break:break-word;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:${P.border};border-radius:3px;}

/* ═══ MVP TAB ═════════════════════════════════════════════════════ */
.mvp-top3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px;}
.mvp-podium{background:${P.surface};border-radius:12px;border:1.5px solid ${P.border};padding:10px 8px;display:flex;flex-direction:column;align-items:center;gap:4px;}
.mvp-podium.lead{border-color:${P.goldBorder};background:${P.goldDim};}
.mvp-pod-rank{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${P.textDim};display:flex;align-items:center;gap:3px;}
.mvp-podium.lead .mvp-pod-rank{color:#a07800;}
.mvp-avatar{width:36px;height:36px;border-radius:50%;background:${P.inputBg};border:2px solid ${P.border};display:flex;align-items:center;justify-content:center;font-family:'Oswald',sans-serif;font-size:12px;font-weight:700;color:${P.steel};}
.mvp-podium.lead .mvp-avatar{background:rgba(227,180,64,0.15);border-color:${P.goldBorder};color:#a07800;}
.mvp-pod-name{font-family:'Oswald',sans-serif;font-size:12px;font-weight:700;color:${P.black};text-align:center;line-height:1.2;}
.mvp-pod-jersey{font-size:9px;color:${P.textDim};font-weight:700;}
.mvp-pod-count{font-family:'Oswald',sans-serif;font-size:22px;font-weight:700;color:${P.steel};line-height:1;}
.mvp-podium.lead .mvp-pod-count{color:${P.gold};}
.mvp-row{background:${P.surface};border-radius:10px;border:1.5px solid ${P.border};padding:10px 12px;margin-bottom:7px;display:flex;align-items:center;gap:10px;}
.mvp-row.lead{border-color:${P.goldBorder};background:${P.goldDim};}
.mvp-jersey{width:30px;height:30px;border-radius:8px;background:${P.inputBg};display:flex;align-items:center;justify-content:center;font-family:'Oswald',sans-serif;font-size:11px;font-weight:700;color:${P.steel};flex-shrink:0;border:1.5px solid ${P.border};}
.mvp-row.lead .mvp-jersey{background:rgba(227,180,64,0.15);border-color:${P.goldBorder};color:#a07800;}
.mvp-pname{flex:1;min-width:0;}
.mvp-pfirst{font-size:13px;font-weight:800;color:${P.black};line-height:1;}
.mvp-plast{font-size:10px;color:${P.textMuted};font-weight:700;margin-top:1px;}
.mvp-bar-wrap{width:52px;height:5px;background:${P.inputBg};border-radius:3px;overflow:hidden;flex-shrink:0;}
.mvp-bar{height:5px;background:${P.steel};border-radius:3px;transition:width 0.4s ease;}
.mvp-row.lead .mvp-bar{background:${P.gold};}
.mvp-count{font-family:'Oswald',sans-serif;font-size:17px;font-weight:700;color:${P.steel};width:20px;text-align:right;flex-shrink:0;}
.mvp-row.lead .mvp-count{color:#a07800;}
.mvp-award-btn{display:flex;align-items:center;gap:5px;background:${P.steel};color:#fff;border:none;border-radius:20px;padding:7px 13px;font-family:'Nunito',sans-serif;font-size:11px;font-weight:800;cursor:pointer;flex-shrink:0;transition:opacity 0.15s;-webkit-tap-highlight-color:transparent;}
.mvp-award-btn:hover{opacity:0.85;}
.mvp-season-chip{background:${P.goldDim};border:1.5px solid ${P.goldBorder};border-radius:20px;padding:5px 12px;font-size:11px;font-weight:800;color:#a07800;}

/* attendance */
.att-date-bar{display:flex;align-items:center;gap:8px;background:${P.surface};border-radius:12px;border:1.5px solid ${P.border};padding:10px 13px;margin-bottom:12px;}
.att-date-label{font-family:'Oswald',sans-serif;font-size:14px;font-weight:700;color:${P.black};flex:1;}
.att-summary{font-size:11px;font-weight:800;color:${P.steel};background:${P.steelLight};border-radius:20px;padding:4px 10px;white-space:nowrap;}
.att-check{width:32px;height:32px;border-radius:8px;border:1.5px solid ${P.border};background:${P.inputBg};display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all 0.15s;-webkit-tap-highlight-color:transparent;}
.att-check.present{background:${P.success};border-color:${P.success};}
.att-tab-btns{display:flex;gap:0;margin-bottom:14px;background:${P.inputBg};border-radius:10px;padding:3px;}
.att-tab-btn{flex:1;padding:7px;border:none;background:transparent;border-radius:8px;font-family:'Nunito',sans-serif;font-size:12px;font-weight:800;color:${P.textMuted};cursor:pointer;transition:all 0.15s;}
.att-tab-btn.active{background:${P.surface};color:${P.steel};border:1.5px solid ${P.border};}
`;

// ─── Countdown ────────────────────────────────────────────────────────────────
function useCountdown({totalSeconds,running,onExpire}){
  const[secsLeft,setSecsLeft]=useState(totalSeconds);
  const endRef=useRef(null),expRef=useRef(false),rafRef=useRef(null);
  useEffect(()=>{cancelAnimationFrame(rafRef.current);expRef.current=false;if(running&&totalSeconds>0){endRef.current=Date.now()+totalSeconds*1000;setSecsLeft(totalSeconds);}else{endRef.current=null;setSecsLeft(totalSeconds);}},[totalSeconds,running]);
  useEffect(()=>{if(!running)return;function tick(){const r=Math.max(0,Math.ceil((endRef.current-Date.now())/1000));setSecsLeft(r);if(r<=0){if(!expRef.current){expRef.current=true;onExpire&&onExpire();}return;}rafRef.current=requestAnimationFrame(tick);}rafRef.current=requestAnimationFrame(tick);return()=>cancelAnimationFrame(rafRef.current);},[running,onExpire]);
  useEffect(()=>{function onVis(){if(!running||!endRef.current)return;const r=Math.max(0,Math.ceil((endRef.current-Date.now())/1000));setSecsLeft(r);if(r<=0&&!expRef.current){expRef.current=true;onExpire&&onExpire();}}document.addEventListener("visibilitychange",onVis);return()=>document.removeEventListener("visibilitychange",onVis);},[running,onExpire]);
  return secsLeft;
}

// ─── Practice Schedule ────────────────────────────────────────────────────────
function playAlarm(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    function beep(start,freq=880,dur=0.18){
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.frequency.value=freq;o.type="sine";
      g.gain.setValueAtTime(0,start);
      g.gain.linearRampToValueAtTime(0.5,start+0.01);
      g.gain.linearRampToValueAtTime(0,start+dur);
      o.start(start);o.stop(start+dur+0.05);
    }
    beep(ctx.currentTime);
    beep(ctx.currentTime+0.22);
  }catch{}
}

function PracticeSchedule({plan}){
  const blocks=buildSchedule(plan.start||"17:00",plan.drills||[],plan.warmupDrill||null,plan.cooldownDrill||null);
  const hasBat=!!plan.battingParallel;
  const[started,setStarted]=useState(false);
  const[cur,setCur]=useState(0);
  const[running,setRunning]=useState(false);
  const[open,setOpen]=useState(null);
  const[done,setDone]=useState(false);
  const[expired,setExpired]=useState(false);
  const currentDur=started&&!done?blocks[cur].dur*60:0;
  const handleExpire=useCallback(()=>{setExpired(true);playAlarm();},[]);
  const secsLeft=useCountdown({totalSeconds:currentDur,running,onExpire:handleExpire});
  function launch(i){setExpired(false);setCur(i);setRunning(true);setOpen(i);}
  function goNext(){setRunning(false);const n=cur+1;if(n<blocks.length)setTimeout(()=>launch(n),50);else setDone(true);}
  function goBack(){if(cur===0)return;setRunning(false);setTimeout(()=>launch(cur-1),50);}
  const mm=Math.floor(secsLeft/60),ss=secsLeft%60;
  const prog=currentDur>0?((currentDur-secsLeft)/currentDur)*100:0;
  const isFirst=cur===0,isLast=cur===blocks.length-1;

  function BlockDetail({b}){
    if(!b.drill)return null;
    return(
      <div className="ps-block-detail">
        <div className="ps-dl"><div className="ps-chips">
          <CatChip cat={b.drill.category} small/>
          <span className="ps-chip"><Ico name="users" size={11}/>{b.drill.players} players</span>
          <span className="ps-chip"><Ico name="clock" size={11}/>{b.drill.duration||20}m</span>
          {b.drill.venue&&b.drill.venue!=="Both"&&<VenueChip venue={b.drill.venue} small/>}
        </div></div>
        {b.drill.notes&&(<div className="ps-dl"><div className="ps-dl-label">Instructions</div><ul className="ps-notes">{b.drill.notes.split("\n").filter(Boolean).map((n,j)=><li key={j}>{n}</li>)}</ul></div>)}
        {b.drill.video&&<a href={b.drill.video} target="_blank" rel="noopener noreferrer" className="ps-vid"><Ico name="video" size={13}/> Watch Drill Video</a>}
      </div>
    );
  }

  function Block({b,gi}){
    const isCur=started&&!done&&gi===cur,isDone=started&&(done||gi<cur),isOpen=open===gi;
    const hasDr=!!b.drill,c=hasDr?(CAT[b.drill.category]||CAT["Warmup"]):null;
    return(
      <div className={`ps-block${isCur?" cur":""}${isDone?" done":""}`} style={hasDr&&c?{borderLeftColor:c.border}:{borderLeftColor:P.border}}>
        <div className="ps-block-hd" style={{cursor:hasDr?"pointer":"default"}} onClick={()=>hasDr&&setOpen(isOpen?null:gi)}>
          <div className="ps-idx" style={!isCur&&!isDone&&hasDr&&c?{borderColor:c.border,color:c.text,background:c.bg}:{}}>{isDone?<Ico name="checkmark" size={13}/>:gi+1}</div>
          <div className="ps-block-info">
            <div className="ps-block-name" style={hasDr&&c&&!isCur?{color:c.text}:{}}>{b.label}</div>
            <div className="ps-block-time">{b.start} – {b.end}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div className="ps-block-dur">{b.dur}m</div>
            {hasDr&&<button className={`ps-expand-btn${isOpen?" open":""}`} onClick={e=>{e.stopPropagation();setOpen(isOpen?null:gi);}}><Ico name={isOpen?"chevUp":"chevDown"} size={15}/>{isOpen?"Hide":"Details"}</button>}
          </div>
        </div>
        {hasDr&&isOpen&&<BlockDetail b={b}/>}
      </div>
    );
  }

  return(
    <div>
      {!started&&(<div className="ps-start-wrap"><button className="ps-start-btn" onClick={()=>{setStarted(true);launch(0);}}><Ico name="play" size={18}/> Start Practice Timer</button></div>)}
      {started&&!done&&(<>
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
            <button className="ps-timer-btn" onClick={goBack} disabled={isFirst}><Ico name="skipBack" size={26} stroke={2.2}/></button>
            <button className={`ps-timer-btn${isLast?" finish":""}`} onClick={goNext}>{isLast?<Ico name="checkmark" size={26} stroke={2.2}/>:<Ico name="skipFwd" size={26} stroke={2.2}/>}</button>
          </div>
        </div>
        <div className="ps-prog-wrap"><div className="ps-prog-fill" style={{width:`${prog}%`}}/></div>
      </>)}

      {hasBat?(
        <div className="ps-blocks">
          {done&&<div className="ps-done-banner"><img src={LOGO} alt="Panthers" className="ps-done-logo"/><div className="ps-done-title">Practice Complete!</div><div className="ps-done-sub">Great work, Kitchener Panthers!</div></div>}
          <Block b={blocks[0]} gi={0}/>
          <div className="col-hdrs">
            <div className="col-hdr"><Ico name="dumbbell" size={10}/> Main Drills</div>
            <div className="col-hdr bat"><Ico name="bat" size={10}/> Batting</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"minmax(0,70fr) minmax(0,30fr)",gap:7}}>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {blocks.slice(1,-1).map((b,ri)=>{
                const gi=ri+1,isCur=started&&!done&&gi===cur,isDone=started&&(done||gi<cur),isOpen=open===gi,c=b.drill?(CAT[b.drill.category]||CAT["Hitting"]):null;
                return(
                  <div key={gi} className={`ps-block${isCur?" cur":""}${isDone?" done":""}`} style={{marginBottom:0,borderLeftColor:c?c.border:P.border}}>
                    <div className="ps-block-hd" onClick={()=>setOpen(isOpen?null:gi)}>
                      <div className="ps-idx" style={!isCur&&!isDone&&c?{borderColor:c.border,color:c.text,background:c.bg}:{}}>{isDone?<Ico name="checkmark" size={13}/>:gi+1}</div>
                      <div className="ps-block-info">
                        <div className="ps-block-name" style={c&&!isCur?{color:c.text}:{}}>{b.label}</div>
                        <div className="ps-block-time">{b.start} – {b.end} · {b.dur}m</div>
                      </div>
                      <button className={`ps-expand-btn${isOpen?" open":""}`} onClick={e=>{e.stopPropagation();setOpen(isOpen?null:gi);}}><Ico name={isOpen?"chevUp":"chevDown"} size={15}/>{isOpen?"Hide":"Details"}</button>
                    </div>
                    {isOpen&&b.drill&&<BlockDetail b={{...b}}/>}
                  </div>
                );
              })}
            </div>
            <div className="ps-bat-col">
              <div className="ps-bat-title"><Ico name="bat" size={12}/> Batting Practice</div>
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

  // Inject CSS once
  useEffect(()=>{let el=document.getElementById("pp-css");if(!el){el=document.createElement("style");el.id="pp-css";document.head.appendChild(el);}el.textContent=APP_CSS;},[]);

  // App state
  const[tab,setTab]=useState("plans");
  const[drills,setDrills]=useState([]);
  const[plans,setPlans]=useState([]);
  const[mvpCounts,setMvpCounts]=useState({});
  const[undoMvp,setUndoMvp]=useState(null);
  const[attendance,setAttendance]=useState({});
  const[attDate,setAttDate]=useState(()=>new Date().toISOString().split("T")[0]);
  const[mvpSubTab,setMvpSubTab]=useState("mvp");
  const[recentIds,setRecentIds]=useState(()=>load("pp_recent",[]));
  const[loading,setLoading]=useState(true);
  const toast=useToast();
  const[drillFilter,setDrillFilter]=useState("All");
  const[createCatFilter,setCreateCatFilter]=useState("All");
  const[createPlayerFilter,setCreatePlayerFilter]=useState("Any");
  const[expandedPicks,setExpandedPicks]=useState({});
  useEffect(()=>save("pp_recent",recentIds),[recentIds]);
  useEffect(()=>{async function go(){setLoading(true);const[d,p,m,a]=await Promise.all([sbGet("drills"),sbGet("plans"),sbGetMvp(),sbGetAttendance()]);setDrills(d);setPlans(p);setMvpCounts(m||{});setAttendance(a||{});setLoading(false);}go();},[]);

  // Week strip
  const[weekBase,setWeekBase]=useState(()=>{const p=new URLSearchParams(window.location.search).get("share");return p||today;});
  const[selectedDate,setSelectedDate]=useState(()=>{const p=new URLSearchParams(window.location.search).get("share");return p||today;});
  const weekDates=getWeekDates(weekBase);
  const planMap=Object.fromEntries(plans.map(p=>[p.date,p]));

  // URL sync
  useEffect(()=>{if(tab!=="plans")return;const url=new URL(window.location.href);url.searchParams.set("share",selectedDate);window.history.replaceState(null,"",url.toString());},[selectedDate,tab]);
  useEffect(()=>{if(tab==="plans")return;const url=new URL(window.location.href);url.searchParams.delete("share");window.history.replaceState(null,"",url.toString());},[tab]);

  // Scroll hide strip
  const[stripHidden,setStripHidden]=useState(false);
  const scrollRef=useRef(null);
  const lastScrollY=useRef(0);
  useEffect(()=>{
    const el=scrollRef.current;if(!el)return;
    function onScroll(){const y=el.scrollTop;if(y>lastScrollY.current&&y>60)setStripHidden(true);else if(y<lastScrollY.current)setStripHidden(false);lastScrollY.current=y;}
    el.addEventListener("scroll",onScroll,{passive:true});return()=>el.removeEventListener("scroll",onScroll);
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
    <div style={{minHeight:"100vh",background:P.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <img src={LOGO} alt="Panthers" style={{width:72,height:72,objectFit:"contain",animation:"pp-spin 2s linear infinite"}}/>
      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:16,color:P.steel,letterSpacing:1,fontWeight:700}}>{msg}</div>
      <style>{`@keyframes pp-spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>
    </div>
  );
  if(loading)return spinner("Loading your drills...");

  // Drill fns
  function resetForm(){setEditId(null);setDName("");setDCat("Hitting");setDPlay(8);setDDur(20);setDVenue("Both");setDNotes("");setDVideo("");setShowForm(false);}
  function openEdit(d){setEditId(d.id);setDName(d.name);setDCat(d.category);setDPlay(d.players);setDDur(d.duration||20);setDVenue(d.venue||"Both");setDNotes(d.notes||"");setDVideo(d.video||"");setShowForm(true);window.scrollTo({top:0,behavior:"smooth"});}
  async function saveDrill(){
    if(!dName.trim())return toast.show("Enter a drill name");
    const dr={id:editId||Date.now(),name:dName.trim(),category:dCat,players:dPlay,duration:dDur,venue:dVenue,notes:dNotes,video:dVideo};
    setDrills(prev=>editId?prev.map(d=>d.id===editId?dr:d):[...prev,dr]);
    await sbUpsert("drills",dr.id,dr);toast.show(editId?"Drill updated ✓":"Drill saved ✓");resetForm();
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
    toast.show("Practice saved ✓");setSelectedDate(pDate);setWeekBase(pDate);setTab("plans");
  }
  async function delPlan(id){if(!window.confirm("Delete this practice?"))return;setPlans(prev=>prev.filter(p=>p.id!==id));await sbDelete("plans",id);toast.show("Deleted");}
  function openEditPlan(p){setEditPlan(p);setEPDate(p.date);setEPTime(p.start);setEPicked([...p.drills]);setEBat(!!p.battingParallel);setEWarmupDrill(p.warmupDrill||null);setECooldownDrill(p.cooldownDrill||null);}
  function toggleEPick(d){setEPicked(prev=>prev.find(p=>p.id===d.id)?prev.filter(p=>p.id!==d.id):prev.length>=3?(toast.show("Max 3 drills"),prev):[...prev,d]);}
  async function saveEditPlan(){
    if(!ePicked.length)return toast.show("Pick at least one drill");
    const updated={...editPlan,date:ePDate,start:ePTime,drills:ePicked,battingParallel:eBat,warmupDrill:eWarmupDrill||null,cooldownDrill:eCooldownDrill||null};
    setPlans(prev=>prev.map(p=>p.id===editPlan.id?updated:p));await sbUpsert("plans",updated.id,updated);setEditPlan(null);toast.show("Practice updated ✓");
  }
  function copyLink(plan){const url=shareUrl(plan);navigator.clipboard.writeText(url).then(()=>toast.show("Link copied!")).catch(()=>toast.show("Copy: "+url));}
  function togglePickExpand(id){setExpandedPicks(prev=>({...prev,[id]:!prev[id]}));}

  const applyFilters=(list,catF,playerF)=>list.filter(d=>(catF==="All"||d.category===catF)&&matchesPlayerFilter(d,playerF));
  const filteredDrills=applyFilters(drills,drillFilter,"Any");
  const recentDrills=drills.filter(d=>recentIds.includes(d.id)).sort((a,b)=>recentIds.indexOf(a.id)-recentIds.indexOf(b.id));
  const otherDrills=drills.filter(d=>!recentIds.includes(d.id));

  function DrillCard({d}){
    const c=CAT[d.category]||CAT["Hitting"];
    return(<div className="drill-item" style={{borderLeftColor:c.border}}>
      <div className="drill-item-header">
        <div style={{flex:1}}>
          <div className="drill-name">{d.name}</div>
          <div className="meta-chips"><CatChip cat={d.category}/><span className="player-chip"><Ico name="users" size={10}/>{d.players} players</span><span className="dur-chip"><Ico name="clock" size={10}/>{d.duration||20}m</span>{d.venue&&d.venue!=="Both"&&<VenueChip venue={d.venue}/>}</div>
          {d.notes&&<ul className="drill-notes">{d.notes.split("\n").filter(Boolean).slice(0,3).map((n,i)=><li key={i}><span style={{color:c.text,fontWeight:900}}>· </span>{n}</li>)}</ul>}
          {d.video&&<a href={d.video} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,color:c.text,marginTop:6,textDecoration:"none",fontWeight:800}}><Ico name="video" size={12}/> Watch video</a>}
        </div>
        <div className="drill-actions">
          <button className="icon-btn" onClick={()=>openEdit(d)}><Ico name="pencil" size={14}/></button>
          <button className="icon-btn danger" onClick={()=>delDrill(d.id)}><Ico name="trash" size={14}/></button>
        </div>
      </div>
    </div>);
  }

  function PickItem({d,sel,idx,onToggle}){
    const c=CAT[d.category]||CAT["Hitting"],isExp=!!expandedPicks[d.id];
    return(<div className={`pick-item${sel?" picked":""}`} style={{borderLeftColor:sel?P.steelBorder:c.border}}>
      <div className="pick-header" onClick={()=>onToggle(d)}>
        <div className="pick-circle">{sel&&<Ico name="checkmark" size={12}/>}</div>
        <div className="pick-info"><div className="pick-name">{d.name}</div><div className="pick-meta"><CatChip cat={d.category} small/><span className="player-chip" style={{fontSize:10,padding:"1px 6px"}}>{d.players}p</span><span className="dur-chip" style={{fontSize:10,padding:"1px 6px"}}>{d.duration||20}m</span>{d.venue&&d.venue!=="Both"&&<VenueChip venue={d.venue} small/>}</div></div>
        {sel&&<div className="pick-num">#{idx+1}</div>}
        <button className="pick-expand-btn" onClick={e=>{e.stopPropagation();togglePickExpand(d.id);}}><Ico name={isExp?"chevUp":"chevDown"} size={11}/>{isExp?"Less":"More"}</button>
      </div>
      {isExp&&(<div className="pick-expanded">
        {d.notes&&<ul className="drill-notes">{d.notes.split("\n").filter(Boolean).map((n,i)=><li key={i}><span style={{color:c.text,fontWeight:900}}>· </span>{n}</li>)}</ul>}
        {d.video&&<a href={d.video} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,color:c.text,marginTop:8,textDecoration:"none",fontWeight:800}}><Ico name="video" size={12}/> Watch video</a>}
        {!d.notes&&!d.video&&<span style={{fontSize:11,color:P.textDim,fontWeight:600}}>No additional details.</span>}
      </div>)}
    </div>);
  }

  function EndDrillPicker({label,color,val,set,filterCat}){
    const filtered=drills.filter(d=>d.category===filterCat);
    return(
      <div className="card" style={{marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontFamily:"'Oswald',sans-serif",fontSize:14,fontWeight:700,color}}>{label}</div><div style={{fontSize:11,color:P.textMuted,marginTop:2,fontWeight:600}}>{val?val.name:"No drill selected"}</div></div>
          <div style={{display:"flex",gap:6}}>{val&&<button className="icon-btn danger" onClick={()=>set(null)}><Ico name="x" size={13}/></button>}<button className="btn btn-ghost btn-sm" onClick={()=>set(null)}><Ico name="plus" size={12}/>{val?"Change":"Add"}</button></div>
        </div>
        {!val&&filtered.length>0&&(<div style={{maxHeight:180,overflowY:"auto",marginTop:10}}>{filtered.map(d=>{const c=CAT[d.category]||CAT["Hitting"];return(<div key={d.id} className="pick-item" style={{borderLeftColor:c.border,marginBottom:6}} onClick={()=>set(d)}><div className="pick-info" style={{padding:"10px 14px"}}><div className="pick-name" style={{fontSize:13}}>{d.name}</div><div className="pick-meta"><CatChip cat={d.category} small/></div></div></div>);})}</div>)}
        {!val&&filtered.length===0&&<div style={{fontSize:12,color:P.textDim,marginTop:10,fontWeight:600}}>No {filterCat} drills yet — add some in the Drills tab.</div>}
      </div>
    );
  }

  // Attendance fns
  async function toggleAttendance(playerId){
    const dayRec={...(attendance[attDate]||{})};
    dayRec[playerId]=!dayRec[playerId];
    const next={...attendance,[attDate]:dayRec};
    setAttendance(next);
    await sbSaveAttendance(next);
  }

  // MVP fns
  async function awardMvp(playerId){
    const prev={...mvpCounts};
    const next={...mvpCounts,[playerId]:(mvpCounts[playerId]||0)+1};
    setMvpCounts(next);
    await sbSaveMvp(next);
    setUndoMvp(playerId);
    const t=setTimeout(()=>setUndoMvp(null),4000);
    toast.show("MVP awarded! Tap to undo");
    return t;
  }
  async function undoAward(){
    if(!undoMvp)return;
    const next={...mvpCounts,[undoMvp]:Math.max(0,(mvpCounts[undoMvp]||1)-1)};
    setMvpCounts(next);
    await sbSaveMvp(next);
    setUndoMvp(null);
    toast.show("Undone");
  }

  const selectedPlan=planMap[selectedDate]||null;
  const navTabs=[{id:"drills",label:"Drills",icon:"dumbbell"},{id:"create",label:"Create",icon:"calPlus"},{id:"plans",label:"Plans",icon:"calDays"},{id:"mvp",label:"MVP",icon:"trophy"}];

  return(
    <div className="app">
      {/* Top bar */}
      <div className="top-bar">
        <img src={LOGO} alt="Panthers"/>
        <div><div className="top-bar-title">Panthers Planner</div><div className="top-bar-sub">U8 Tier 1 · Kitchener</div></div>
      </div>

      {/* Week strip */}
      {tab==="plans"&&(
        <div className={`week-strip-wrap${stripHidden?" strip-hidden":""}`}>
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

      <div className="scroll-area" ref={scrollRef}>

        {/* ══ DRILLS ══ */}
        {tab==="drills"&&(<>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:14}}>
            <div><div className="section-title">Drill Library</div><div className="section-sub">Build and manage your team's drills</div></div>
            {!showForm&&<button className="btn btn-primary btn-sm" onClick={()=>{resetForm();setShowForm(true);}}><Ico name="plus" size={13}/> Add Drill</button>}
          </div>
          {showForm&&(<div className="card" style={{marginBottom:14}}>
            <div className="card-title">{editId?"Edit Drill":"New Drill"}</div>
            <div className="field"><label className="label">Drill Name</label><input className="input" placeholder="e.g. Tee Work" value={dName} onChange={e=>setDName(e.target.value)}/></div>
            <div className="row2" style={{marginBottom:14}}>
              <div><label className="label">Category</label><select className="select" value={dCat} onChange={e=>setDCat(e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
              <div><label className="label">Players</label><select className="select" value={dPlay} onChange={e=>setDPlay(Number(e.target.value))}>{Array.from({length:20},(_,i)=>i+1).map(n=><option key={n}>{n}</option>)}</select></div>
            </div>
            <div className="field"><label className="label">Duration</label><div className="dur-picker">{DURATIONS.map(d=><button key={d} className={`dur-btn${dDur===d?" dur-active":""}`} onClick={()=>setDDur(d)}>{d}m</button>)}</div></div>
            <div className="field"><label className="label">Venue</label><div className="venue-picker">{VENUE_OPTIONS.map(v=>{const vc=VENUE_COLORS[v],isA=dVenue===v;return<button key={v} className="venue-btn" style={isA?{background:vc.bg,borderColor:vc.border,color:vc.text}:{}} onClick={()=>setDVenue(v)}><Ico name={VENUE_ICONS[v]} size={15}/>{v}</button>;})}</div></div>
            <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}><CatChip cat={dCat}/>{dVenue!=="Both"&&<VenueChip venue={dVenue}/>}<span className="dur-chip">{dDur}m</span></div>
            <div className="field"><label className="label">Instructions (one per line)</label><textarea className="textarea" placeholder={"Keep your eye on the ball\nFollow through on your swing"} value={dNotes} onChange={e=>setDNotes(e.target.value)}/></div>
            <div className="field"><label className="label">Video Link (optional)</label><input className="input" placeholder="https://youtube.com/..." value={dVideo} onChange={e=>setDVideo(e.target.value)}/></div>
            <div className="btn-row"><button className="btn btn-primary" onClick={saveDrill}>{editId?"Update Drill":"Save Drill"}</button><button className="btn btn-ghost" onClick={resetForm}><Ico name="x" size={14}/> Cancel</button></div>
          </div>)}
          <CatFilter active={drillFilter} onChange={setDrillFilter}/>
          {filteredDrills.length===0?(<div className="empty"><Ico name="dumbbell" size={36}/><p>{drills.length===0?"No drills yet.\nTap Add Drill to get started.":`No ${drillFilter} drills found.`}</p></div>):filteredDrills.map(d=><DrillCard key={d.id} d={d}/>)}
        </>)}

        {/* ══ CREATE ══ */}
        {tab==="create"&&(<>
          <div className="section-title">Create Practice</div>
          <div className="section-sub">Pick a date, time and up to 3 drills</div>
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
              {fR.length>0&&(<><div className="recent-label"><Ico name="star" size={11}/> Recently Used</div>{fR.map(d=><PickItem key={d.id} d={d} sel={!!picked.find(p=>p.id===d.id)} idx={picked.findIndex(p=>p.id===d.id)} onToggle={togglePick}/>)}{fO.length>0&&<div className="divider-label" style={{marginTop:12}}>All Drills</div>}</>)}
              {fO.map(d=><PickItem key={d.id} d={d} sel={!!picked.find(p=>p.id===d.id)} idx={picked.findIndex(p=>p.id===d.id)} onToggle={togglePick}/>)}
              {fR.length===0&&fO.length===0&&<div className="empty" style={{padding:"24px 0"}}><Ico name="filter" size={28}/><p>No drills match these filters.</p></div>}
            </>);
          })()}
          <div className="divider-label" style={{marginTop:20}}>Warmup &amp; Cool Down <span style={{color:P.textDim,fontWeight:600,textTransform:"none",letterSpacing:0,fontSize:11}}>(optional)</span></div>
          <EndDrillPicker label="Warmup Drill" color={CAT["Warmup"].text} val={warmupDrill} set={setWarmupDrill} filterCat="Warmup"/>
          <EndDrillPicker label="Cool Down Drill" color={CAT["Cool Down"].text} val={cooldownDrill} set={setCooldownDrill} filterCat="Cool Down"/>
          <div className="divider-label" style={{marginTop:4}}>Parallel Station</div>
          <div className={`bat-toggle${battingParallel?" active":""}`} onClick={()=>setBattingParallel(b=>!b)}>
            <div className="bat-toggle-header"><div className="bat-check">{battingParallel&&<Ico name="checkmark" size={13}/>}</div><div><div className="bat-title"><Ico name="bat" size={14}/> Add Batting Practice Station</div><div className="bat-sub">Runs in parallel with all drills — players rotate through</div></div></div>
            {battingParallel&&(<div className="bat-detail">{BAT_DRILL.notes.split("\n").map((n,i)=><div key={i} className="bat-note">{n}</div>)}</div>)}
          </div>
          {picked.length>0&&(<>
            <div className="divider-label" style={{marginTop:20}}>Schedule Preview</div>
            {battingParallel?(
              <div className="card"><div className="schedule-grid">
                <div><div className="schedule-col-label"><Ico name="dumbbell" size={10}/> Main Drills</div><div className="tl">{buildSchedule(pTime,picked,warmupDrill,cooldownDrill).map((b,i)=>(<div key={i} className="tl-row"><div className="tl-dot" style={b.drill?(()=>{const c=CAT[b.drill.category]||CAT["Hitting"];return{background:c.text};})():{}} /><div className="tl-time">{b.start}</div><div className="tl-label" style={{fontSize:12}}>{b.label}{b.drill&&(b.label==="Warmup"||b.label==="Cool Down")?` · ${b.drill.name}`:""}</div><div className="tl-dur">{b.dur}m</div></div>))}</div></div>
                <div><div className="schedule-col-label" style={{color:BAT_COLOR.text}}><Ico name="bat" size={10}/> Batting</div><div className="bat-station"><div className="bat-station-title"><Ico name="bat" size={12}/> Batting Practice</div><div style={{fontSize:11,color:P.textMuted,marginBottom:6,fontWeight:600}}>Full practice · rotate through</div>{BAT_DRILL.notes.split("\n").map((n,i)=><div key={i} className="bat-station-note">{n}</div>)}</div></div>
              </div></div>
            ):(
              <div className="card"><div className="tl">{buildSchedule(pTime,picked,warmupDrill,cooldownDrill).map((b,i)=>(<div key={i} className="tl-row"><div className="tl-dot" style={b.drill?(()=>{const c=CAT[b.drill.category]||CAT["Hitting"];return{background:c.text};})():{}} /><div className="tl-time">{b.start} – {b.end}</div><div className="tl-label">{b.label}{b.drill&&(b.label==="Warmup"||b.label==="Cool Down")?` · ${b.drill.name}`:""}</div><div className="tl-dur">{b.dur}m</div></div>))}</div></div>
            )}
          </>)}
          <button className="btn btn-primary btn-full" style={{marginTop:8,borderRadius:14,fontFamily:"'Oswald',sans-serif",fontSize:16,letterSpacing:0.5}} onClick={savePractice}><Ico name="calPlus" size={15}/> Save Practice Plan</button>
        </>)}

        {/* ══ PLANS ══ */}
        {tab==="plans"&&(()=>{
          if(!selectedPlan){
            return(
              <div className="ps-empty">
                <Ico name="calDays" size={40}/>
                <div className="ps-empty-title">No practice on {new Date(selectedDate+"T12:00:00").toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric"})}</div>
                <div className="ps-empty-sub">Tap a dot-marked day to view a practice, or create one for this day.</div>
                <button className="btn btn-primary" style={{borderRadius:22,fontFamily:"'Oswald',sans-serif",fontSize:15}} onClick={()=>{setPDate(selectedDate);setTab("create");}}><Ico name="calPlus" size={14}/> Create Practice for This Day</button>
              </div>
            );
          }
          const sched=buildSchedule(selectedPlan.start||"17:00",selectedPlan.drills||[],selectedPlan.warmupDrill||null,selectedPlan.cooldownDrill||null);
          const totalMins=sched.reduce((s,b)=>s+b.dur,0);
          return(
            <>
              <div className="toolbar">
                <div className="tb-info">
                  <div className="tb-date">{dateLabel(selectedPlan.date)}</div>
                  <div className="tb-time">{fmt(...(selectedPlan.start||"17:00").split(":").map(Number))} · {totalMins} min</div>
                </div>
                <div className="tb-btns">
                  <button className="tb-btn share" onClick={()=>copyLink(selectedPlan)} title="Copy share link"><Ico name="share" size={14}/></button>
                  <button className="tb-btn" onClick={()=>openEditPlan(selectedPlan)} title="Edit"><Ico name="pencil" size={14}/></button>
                  <button className="tb-btn danger" onClick={()=>delPlan(selectedPlan.id)} title="Delete"><Ico name="trash" size={14}/></button>
                </div>
              </div>
              <PracticeSchedule key={selectedDate} plan={selectedPlan}/>
            </>
          );
        })()}

        {/* ══ MVP ══ */}
        {tab==="mvp"&&(()=>{
          const maxCount=Math.max(1,...ROSTER.map(p=>mvpCounts[p.id]||0));
          const sorted=[...ROSTER].sort((a,b)=>(mvpCounts[b.id]||0)-(mvpCounts[a.id]||0));
          const top3=sorted.slice(0,3);
          const dayRec=attendance[attDate]||{};
          const presentCount=ROSTER.filter(p=>dayRec[p.id]).length;
          // calc attendance rate per player across all dates
          const allDates=Object.keys(attendance);
          const practiceDates=allDates.filter(d=>attendance[d]&&Object.keys(attendance[d]).length>0);
          return(<>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:12}}>
              <div><div className="section-title">{mvpSubTab==="mvp"?"MVP Awards":"Attendance"}</div><div className="section-sub">{mvpSubTab==="mvp"?`Season leaderboard · ${ROSTER.length} players`:`${practiceDates.length} practice${practiceDates.length!==1?"s":""} tracked`}</div></div>
              {mvpSubTab==="mvp"&&<div className="mvp-season-chip">2026</div>}
            </div>

            {/* Sub-tab switcher */}
            <div className="att-tab-btns">
              <button className={`att-tab-btn${mvpSubTab==="mvp"?" active":""}`} onClick={()=>setMvpSubTab("mvp")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{marginRight:5,verticalAlign:"middle"}}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                MVP
              </button>
              <button className={`att-tab-btn${mvpSubTab==="att"?" active":""}`} onClick={()=>setMvpSubTab("att")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{marginRight:5,verticalAlign:"middle"}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Attendance
              </button>
            </div>

            {/* ── MVP sub-tab ── */}
            {mvpSubTab==="mvp"&&(<>
              <div className="mvp-top3">
                {[top3[1],top3[0],top3[2]].map((player,vi)=>{
                  if(!player)return<div key={vi}/>;
                  const ranks=["2nd","1st","3rd"];
                  const isLead=vi===1;
                  const count=mvpCounts[player.id]||0;
                  return(
                    <div key={player.id} className={`mvp-podium${isLead?" lead":""}`}>
                      <div className="mvp-pod-rank">
                        {isLead&&<svg width="10" height="10" viewBox="0 0 24 24" fill="#e3b440" stroke="#a07800" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
                        {ranks[vi]}
                      </div>
                      <div className="mvp-avatar">{player.first[0]}{player.last[0]}</div>
                      <div className="mvp-pod-name">{player.first}</div>
                      <div className="mvp-pod-jersey">#{player.jersey}</div>
                      <div className="mvp-pod-count">{count}</div>
                    </div>
                  );
                })}
              </div>
              <div className="divider-label">All Players</div>
              {sorted.map((player,idx)=>{
                const count=mvpCounts[player.id]||0;
                const isLead=idx===0&&count>0;
                const barPct=maxCount>0?Math.round((count/maxCount)*100):0;
                return(
                  <div key={player.id} className={`mvp-row${isLead?" lead":""}`}>
                    <div className="mvp-jersey">#{player.jersey}</div>
                    <div className="mvp-pname"><div className="mvp-pfirst">{player.first} {player.last}</div></div>
                    <div className="mvp-bar-wrap"><div className="mvp-bar" style={{width:`${barPct}%`}}/></div>
                    <div className="mvp-count" style={count===0?{color:P.textDim}:{}}>{count}</div>
                    <button className="mvp-award-btn" style={isLead?{background:P.gold,color:"#111"}:{}} onClick={()=>awardMvp(player.id)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                      MVP
                    </button>
                  </div>
                );
              })}
            </>)}

            {/* ── Attendance sub-tab ── */}
            {mvpSubTab==="att"&&(<>
              {/* Date picker + summary */}
              <div className="att-date-bar">
                <div style={{display:"flex",flexDirection:"column",flex:1}}>
                  <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:P.textDim,marginBottom:4}}>Practice Date</div>
                  <input type="date" className="input" style={{padding:"7px 10px",fontSize:13,fontWeight:700}} value={attDate} onChange={e=>setAttDate(e.target.value)}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,flexShrink:0}}>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:700,color:P.steel,lineHeight:1}}>{presentCount}</div>
                  <div style={{fontSize:9,fontWeight:800,color:P.textDim,textTransform:"uppercase",letterSpacing:0.5}}>of {ROSTER.length}</div>
                  <div style={{fontSize:9,fontWeight:800,color:P.textDim,textTransform:"uppercase",letterSpacing:0.5}}>present</div>
                </div>
              </div>

              {/* Mark all / clear all */}
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <button className="btn btn-ghost btn-sm btn-full" onClick={async()=>{const next={...attendance,[attDate]:Object.fromEntries(ROSTER.map(p=>[p.id,true]))};setAttendance(next);await sbSaveAttendance(next);}}>Mark All Present</button>
                <button className="btn btn-ghost btn-sm btn-full" onClick={async()=>{const next={...attendance,[attDate]:{}};setAttendance(next);await sbSaveAttendance(next);}}>Clear All</button>
              </div>

              <div className="divider-label">Tap to mark present</div>

              {ROSTER.map(player=>{
                const isPresent=!!(dayRec[player.id]);
                const totalPresent=practiceDates.filter(d=>attendance[d]&&attendance[d][player.id]).length;
                const rate=practiceDates.length>0?Math.round((totalPresent/practiceDates.length)*100):0;
                return(
                  <div key={player.id} className="mvp-row" style={isPresent?{borderColor:P.success,background:"rgba(61,186,122,0.06)"}:{}}>
                    <div className="mvp-jersey" style={isPresent?{background:"rgba(61,186,122,0.15)",borderColor:P.success,color:"#1a7a4a"}:{}}> #{player.jersey}</div>
                    <div className="mvp-pname">
                      <div className="mvp-pfirst">{player.first} {player.last}</div>
                      <div style={{fontSize:10,color:P.textDim,fontWeight:700,marginTop:2}}>{practiceDates.length>0?`${rate}% attendance · ${totalPresent}/${practiceDates.length}`:"No data yet"}</div>
                    </div>
                    <button className={`att-check${isPresent?" present":""}`} onClick={()=>toggleAttendance(player.id)}>
                      {isPresent&&<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M7 13l3 3 7-7"/></svg>}
                    </button>
                  </div>
                );
              })}

              {practiceDates.length>1&&(<>
                <div className="divider-label" style={{marginTop:16}}>Season Attendance</div>
                {[...ROSTER].sort((a,b)=>{
                  const ra=practiceDates.filter(d=>attendance[d]&&attendance[d][a.id]).length;
                  const rb=practiceDates.filter(d=>attendance[d]&&attendance[d][b.id]).length;
                  return rb-ra;
                }).map(player=>{
                  const totalPresent=practiceDates.filter(d=>attendance[d]&&attendance[d][player.id]).length;
                  const rate=Math.round((totalPresent/practiceDates.length)*100);
                  const barPct=rate;
                  return(
                    <div key={player.id} className="mvp-row" style={{padding:"8px 12px"}}>
                      <div className="mvp-jersey">#{player.jersey}</div>
                      <div className="mvp-pname"><div className="mvp-pfirst">{player.first} {player.last}</div></div>
                      <div className="mvp-bar-wrap" style={{width:60}}><div className="mvp-bar" style={{width:`${barPct}%`,background:rate>=80?P.success:rate>=60?P.steel:P.danger}}/></div>
                      <div className="mvp-count" style={{fontSize:13,color:rate>=80?P.success:rate>=60?P.steel:P.danger}}>{rate}%</div>
                    </div>
                  );
                })}
              </>)}
            </>)}
          </>);
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
          {drills.map(d=>{const sel=!!ePicked.find(p=>p.id===d.id);const c=CAT[d.category]||CAT["Hitting"];return(<div key={d.id} className={`pick-item${sel?" picked":""}`} style={{borderLeftColor:sel?P.steelBorder:c.border}} onClick={()=>toggleEPick(d)}><div className="pick-header"><div className="pick-circle">{sel&&<Ico name="checkmark" size={12}/>}</div><div className="pick-info"><div className="pick-name" style={{marginBottom:3}}>{d.name}</div><div className="pick-meta"><CatChip cat={d.category} small/><span className="dur-chip" style={{fontSize:10,padding:"1px 6px"}}>{d.duration||20}m</span></div></div>{sel&&<div className="pick-num">#{ePicked.findIndex(p=>p.id===d.id)+1}</div>}</div></div>);})}
          <div className="divider-label">Warmup &amp; Cool Down</div>
          {[{label:"Warmup Drill",color:CAT["Warmup"].text,val:eWarmupDrill,set:setEWarmupDrill,fc:"Warmup"},{label:"Cool Down Drill",color:CAT["Cool Down"].text,val:eCooldownDrill,set:setECooldownDrill,fc:"Cool Down"}].map(({label,color,val,set,fc})=>{
            const filtered=drills.filter(d=>d.category===fc);
            return(<div key={label} className="card" style={{marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div><div style={{fontFamily:"'Oswald',sans-serif",fontSize:14,fontWeight:700,color}}>{label}</div><div style={{fontSize:11,color:P.textMuted,marginTop:1,fontWeight:600}}>{val?val.name:"None selected"}</div></div>
                <div style={{display:"flex",gap:5}}>{val&&<button className="icon-btn danger" onClick={()=>set(null)}><Ico name="x" size={13}/></button>}<button className="btn btn-ghost btn-sm" onClick={()=>set(null)}><Ico name="plus" size={12}/>{val?"Change":"Add"}</button></div>
              </div>
              {!val&&filtered.length>0&&(<div style={{maxHeight:150,overflowY:"auto",marginTop:8}}>{filtered.map(d=>{const c=CAT[d.category]||CAT["Hitting"];return(<div key={d.id} className="pick-item" style={{borderLeftColor:c.border,marginBottom:5}} onClick={()=>set(d)}><div className="pick-info" style={{padding:"8px 12px"}}><div className="pick-name" style={{fontSize:13}}>{d.name}</div><div className="pick-meta"><CatChip cat={d.category} small/></div></div></div>);})}</div>)}
              {!val&&filtered.length===0&&<div style={{fontSize:12,color:P.textDim,marginTop:8,fontWeight:600}}>No {fc} drills yet — add some in the Drills tab.</div>}
            </div>);
          })}
          <div className="divider-label">Parallel Station</div>
          <div className={`bat-toggle${eBat?" active":""}`} onClick={()=>setEBat(b=>!b)} style={{marginBottom:14}}>
            <div className="bat-toggle-header"><div className="bat-check">{eBat&&<Ico name="checkmark" size={13}/>}</div><div><div className="bat-title"><Ico name="bat" size={14}/> Batting Practice Station</div><div className="bat-sub">Runs in parallel with all drills</div></div></div>
          </div>
          <div className="btn-row"><button className="btn btn-primary" onClick={saveEditPlan}>Save Changes</button><button className="btn btn-ghost" onClick={()=>setEditPlan(null)}>Cancel</button></div>
        </div>
      </div>)}

      {toast.msg&&<div className="toast" onClick={undoMvp?undoAward:undefined} style={undoMvp?{cursor:"pointer"}:{}}>{toast.msg}</div>}
    </div>
  );
}
