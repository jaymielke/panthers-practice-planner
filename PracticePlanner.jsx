import React, { useState, useEffect } from "react";

// Font Awesome CDN must be in your index.html <head>:
// <script src="https://kit.fontawesome.com/YOUR_KIT_ID.js" crossorigin="anonymous"></script>

const COLORS = {
  primary: "#5f8db5",
  black: "#000000",
  white: "#FFFFFF",
  lightGray: "#f4f4f4",
  darkGray: "#333333",
  hitting: "#f9c74f",
  fielding: "#90be6d",
  throwing: "#f94144",
  baserunning: "#577590",
  warmup: "#f3722c",
};

export default function PracticePlanner() {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const [currentPage, setCurrentPage] = useState("home");

  const [drills, setDrills] = useState([]);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [practiceDate, setPracticeDate] = useState(todayString);
  const [startTime, setStartTime] = useState("17:00");
  const [practice, setPractice] = useState([]);
  const [editPracticeId, setEditPracticeId] = useState(null);

  // Add Drill form state
  const [drillName, setDrillName] = useState("");
  const [drillNotes, setDrillNotes] = useState("");
  const [drillVideo, setDrillVideo] = useState("");
  const [drillCategory, setDrillCategory] = useState("Hitting");
  const [drillPlayers, setDrillPlayers] = useState(1);

  const categories = ["Hitting", "Fielding", "Throwing", "Base Running", "Warmup"];

  useEffect(() => {
    const savedDrills = localStorage.getItem("drills");
    const savedHistory = localStorage.getItem("practiceHistory");
    if (savedDrills) setDrills(JSON.parse(savedDrills));
    if (savedHistory) setPracticeHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => { localStorage.setItem("drills", JSON.stringify(drills)); }, [drills]);
  useEffect(() => { localStorage.setItem("practiceHistory", JSON.stringify(practiceHistory)); }, [practiceHistory]);

  // --- Helper Functions ---
  function addDrill() {
    if (!drillName) return;
    const newDrill = {
      id: Date.now(),
      name: drillName,
      notes: drillNotes,
      video: drillVideo,
      category: drillCategory,
      playersNeeded: drillPlayers,
    };
    setDrills([...drills, newDrill]);
    setDrillName(""); setDrillNotes(""); setDrillVideo(""); setDrillPlayers(1);
  }

  function togglePractice(drill) {
    if (practice.find(d => d.id === drill.id)) setPractice(practice.filter(d => d.id !== drill.id));
    else if (practice.length < 3) setPractice([...practice, drill]);
  }

  function savePractice() {
    if (practice.length === 0) return;
    const entry = { id: editPracticeId || Date.now(), date: practiceDate, startTime, drills: practice };
    const filtered = practiceHistory.filter(h => h.id !== entry.id);
    setPracticeHistory([entry, ...filtered]);
    setPractice([]); setEditPracticeId(null); setCurrentPage("home");
  }

  function deletePractice(id) {
    if (!window.confirm("Delete this practice plan?")) return;
    setPracticeHistory(practiceHistory.filter(p => p.id !== id));
  }

  function editPractice(id) {
    const p = practiceHistory.find(p => p.id === id);
    if (!p) return;
    setPracticeDate(p.date);
    setStartTime(p.startTime);
    setPractice(p.drills);
    setEditPracticeId(p.id);
    setCurrentPage("createPractice");
  }

  function format12Hour(hour24, minute) {
    let suffix = hour24 >= 12 ? "PM" : "AM";
    let hour12 = hour24 % 12 || 12;
    return `${hour12}:${String(minute).padStart(2,"0")} ${suffix}`;
  }

  function generateSchedule(start, drills) {
    const [hourStr, minStr] = start.split(":");
    let hour = parseInt(hourStr);
    let min = parseInt(minStr);
    const schedule = [];
    function addBlock(duration, title) {
      let endHour = hour + Math.floor((min + duration)/60);
      let endMin = (min + duration)%60;
      schedule.push({ start: format12Hour(hour,min), end: format12Hour(endHour,endMin), title });
      hour = endHour;
      min = endMin;
    }
    addBlock(15, "Dynamic Warmup");
    drills.forEach(d => addBlock(20, d.name));
    addBlock(15, "Cool Down");
    return schedule;
  }

  // --- Styles ---
  const pageStyle = { 
    padding: "20px", maxWidth: "800px", margin: "auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
    minHeight: "100vh", backgroundColor: COLORS.primary, color: COLORS.white,
    backgroundImage: "url('https://i.ibb.co/CPHkR4n/baseball-diamond-pattern.png')",
    backgroundSize: "cover",
    textShadow:"1px 1px 3px rgba(0,0,0,0.4)"
  };
  const buttonStyle = { 
    display: "block", margin: "20px auto", padding: "16px", width: "85%", borderRadius: "15px", 
    fontSize: "20px", fontWeight: "700", border: "none", cursor: "pointer", 
    background: "linear-gradient(270deg, #5f8db5, #ffffff, #5f8db5)", 
    backgroundSize: "600% 600%", color: COLORS.white,
    animation: "gradientBG 5s ease infinite", boxShadow:"0 6px 20px rgba(0,0,0,0.3)"
  };
  const cardStyle = { 
    borderRadius: "12px", padding: "20px", marginBottom: "20px", backgroundColor: COLORS.white, color: COLORS.darkGray, 
    boxShadow: "0 8px 25px rgba(0,0,0,0.4)", position:"relative"
  };
  const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop:"10px", backgroundColor:"rgba(255,255,255,0.2)", borderRadius:"12px" };
  const thTdStyle = { border: "1px solid #ddd", padding: "10px", verticalAlign: "top", textAlign:"left" };
  const drillTitleStyle = { fontWeight: "800", fontSize: "1.2em", marginBottom: "5px" };
  const drillNoteStyle = { margin: "3px 0", paddingLeft:"12px", listStyleType:"disc" };
  const videoLinkStyle = { color: COLORS.primary, textDecoration: "underline", fontWeight:"600" };
  const inputStyle = { padding:"8px", margin:"5px 0", borderRadius:"8px", border:"1px solid #ccc", width:"100%" };

  // --- Pages ---
  if(currentPage === "home") {
    return (
      <div style={{ ...pageStyle, textAlign: "center" }}>
        <img src="/icon-192.png" alt="Logo" style={{ width: "140px", marginBottom: "25px", borderRadius:"25px", boxShadow:"0 10px 25px rgba(0,0,0,0.5)" }} />
        <h1 style={{ fontSize:"2.8em", fontWeight:"900", marginBottom:"40px", textShadow:"2px 2px 8px rgba(0,0,0,0.5)" }}>Practice Planner</h1>
        {["Add a New Drill","Create a New Practice Plan","View Practice Plans"].map((text, idx) => (
          <button key={idx} onClick={() => setCurrentPage(text.includes("Drill")?"addDrill":text.includes("Create")?"createPractice":"viewPractice")} style={{ ...buttonStyle }}>{text}</button>
        ))}
      </div>
    );
  }

  // --- Add Drill Page ---
  if(currentPage === "addDrill") {
    return (
      <div style={pageStyle}>
        <h2>Add a New Drill</h2>
        <label>Drill Name</label>
        <input style={inputStyle} value={drillName} onChange={e=>setDrillName(e.target.value)} placeholder="e.g. Belly Up Drill" />
        <label>Category</label>
        <select style={inputStyle} value={drillCategory} onChange={e=>setDrillCategory(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <label>Number of Players</label>
        <select style={inputStyle} value={drillPlayers} onChange={e=>setDrillPlayers(parseInt(e.target.value))}>
          {Array.from({length:20},(_,i)=>i+1).map(n=><option key={n}>{n}</option>)}
        </select>
        <label>Notes (bullet points separated by ; )</label>
        <textarea style={inputStyle} value={drillNotes} onChange={e=>setDrillNotes(e.target.value)} placeholder="e.g. Players lying on belly; roll ball; jump up and throw"></textarea>
        <label>Video Link</label>
        <input style={inputStyle} value={drillVideo} onChange={e=>setDrillVideo(e.target.value)} placeholder="YouTube, TikTok, etc." />
        <button style={{...buttonStyle, width:"50%", marginTop:"15px"}} onClick={addDrill}>Add Drill</button>
        <button style={{...buttonStyle, width:"50%", marginTop:"15px", backgroundColor:"#333"}} onClick={()=>setCurrentPage("home")}>Back Home</button>

        <h3 style={{marginTop:"40px"}}>Existing Drills</h3>
        {drills.map(d=>(
          <div key={d.id} style={cardStyle}>
            <div style={drillTitleStyle}><i className={`fas fa-baseball-ball`}></i> {d.name} ({d.category}) - {d.playersNeeded} Players</div>
            <ul>{d.notes.split(";").map((n,i)=><li key={i} style={drillNoteStyle}>{n.trim()}</li>)}</ul>
            {d.video && <a style={videoLinkStyle} href={d.video} target="_blank">Watch Video</a>}
          </div>
        ))}
      </div>
    )
  }

  // --- Create Practice Page ---
  if(currentPage === "createPractice") {
    return (
      <div style={pageStyle}>
        <h2>Create Practice Plan</h2>
        <label>Date</label>
        <input style={inputStyle} type="date" value={practiceDate} onChange={e=>setPracticeDate(e.target.value)} />
        <label>Start Time</label>
        <input style={inputStyle} type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} />

        <h3>Select Drills (up to 3)</h3>
        {drills.map(d=>(
          <div key={d.id} style={{...cardStyle, backgroundColor: practice.find(p=>p.id===d.id)?COLORS.lightGray:"#fff", cursor:"pointer"}} onClick={()=>togglePractice(d)}>
            <div style={drillTitleStyle}>{d.name} ({d.category})</div>
            <ul>{d.notes.split(";").map((n,i)=><li key={i} style={drillNoteStyle}>{n.trim()}</li>)}</ul>
            {d.video && <a style={videoLinkStyle} href={d.video} target="_blank">Watch Video</a>}
          </div>
        ))}
        <button style={{...buttonStyle, width:"50%", marginTop:"15px"}} onClick={savePractice}>Save Practice</button>
        <button style={{...buttonStyle, width:"50%", marginTop:"15px", backgroundColor:"#333"}} onClick={()=>setCurrentPage("home")}>Back Home</button>
      </div>
    )
  }

  // --- View Practice Plans ---
  if(currentPage === "viewPractice") {
    return (
      <div style={pageStyle}>
        <h2>View Practice Plans</h2>
        {practiceHistory.map(p=>(
          <div key={p.id} style={cardStyle}>
            <div style={{...drillTitleStyle, fontSize:"1.1em"}}>{new Date(p.date).toLocaleDateString("en-US",{weekday:"long", month:"long", day:"numeric"})} | Start: {format12Hour(parseInt(p.startTime.split(":")[0]),parseInt(p.startTime.split(":")[1]))}</div>
            <table style={tableStyle}>
              <tbody>
                {generateSchedule(p.startTime,p.drills).map((b,i)=>(
                  <tr key={i}>
                    <td style={thTdStyle}>{b.start} - {b.end}</td>
                    <td style={thTdStyle}>
                      <b>{b.title}</b>
                      {p.drills.map(d=>d.name===b.title && <>
                        <ul>{d.notes.split(";").map((n,j)=><li key={j}>{n.trim()}</li>)}</ul>
                        {d.video && <a style={videoLinkStyle} href={d.video} target="_blank">Watch Video</a>}
                      </>)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{marginTop:"10px"}}>
              <button style={{...buttonStyle, width:"40%", fontSize:"16px"}} onClick={()=>editPractice(p.id)}>Edit</button>
              <button style={{...buttonStyle, width:"40%", fontSize:"16px", backgroundColor:"#f94144"}} onClick={()=>deletePractice(p.id)}>Delete</button>
            </div>
          </div>
        ))}
        <button style={{...buttonStyle, width:"50%", marginTop:"15px", backgroundColor:"#333"}} onClick={()=>setCurrentPage("home")}>Back Home</button>
      </div>
    )
  }

  return <div style={pageStyle}>Loading...</div>;
}
