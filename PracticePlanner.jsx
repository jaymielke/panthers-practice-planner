import React, { useState, useEffect } from "react";

const COLORS = {
  panthersBlue: "#5f8db5",
  black: "#000000",
  white: "#FFFFFF",
  lightGray: "#f4f4f4",
  darkGray: "#333333",
};

export default function PracticePlanner() {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const [currentPage, setCurrentPage] = useState("home");
  const [drills, setDrills] = useState([]);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [practiceDate, setPracticeDate] = useState(todayString);
  const [selectedPracticeId, setSelectedPracticeId] = useState(null);
  const [practice, setPractice] = useState([]);
  const [startTime, setStartTime] = useState("17:00");

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

    if (window.location.hash.startsWith("#practice-")) {
      const hash = window.location.hash.replace("#practice-", "");
      const [date, id] = hash.split("-");
      setPracticeDate(date);
      setSelectedPracticeId(parseInt(id));
      setCurrentPage("viewPractice");
    }
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

  function savePractice(editId = null) {
    if (practice.length === 0) return;
    const entry = {
      id: editId || Date.now(),
      date: practiceDate,
      startTime,
      drills: practice
    };
    const filtered = practiceHistory.filter(h => h.id !== entry.id);
    setPracticeHistory([entry, ...filtered]);
    setPractice([]);
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
    setCurrentPage("createPractice");
  }

  function getPracticesForDate(date) { return practiceHistory.filter(p => p.date === date); }

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
  const pageStyle = { padding: "20px", maxWidth: "700px", margin: "auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", minHeight: "100vh", backgroundColor: COLORS.panthersBlue, color: COLORS.white };
  const buttonStyle = { display: "block", margin: "20px auto", padding: "16px", width: "85%", borderRadius: "15px", background: "linear-gradient(90deg, #FFFFFF, #f0f0f0)", color: COLORS.panthersBlue, fontSize: "20px", fontWeight: "700", border: "none", cursor: "pointer", transition: "all 0.2s" };
  const buttonHover = { transform: "scale(1.03)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" };
  const cardStyle = { borderRadius: "12px", padding: "15px", marginBottom: "15px", backgroundColor: COLORS.white, color: COLORS.darkGray, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" };
  const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop:"10px" };
  const thTdStyle = { border: "1px solid #ddd", padding: "10px", verticalAlign: "top" };
  const drillTitleStyle = { fontWeight: "700", fontSize: "1.15em", marginBottom: "5px", color: COLORS.panthersBlue };
  const drillNoteStyle = { margin: "2px 0" };
  const videoLinkStyle = { color: COLORS.panthersBlue, textDecoration: "underline" };

  // --- Pages ---

  // --- Home Page ---
  if(currentPage === "home") {
    return (
      <div style={{ ...pageStyle, textAlign: "center" }}>
        <img src="/icon-192.png" alt="Logo" style={{ width: "130px", marginBottom: "25px", borderRadius:"20px" }} />
        <h1 style={{ fontSize:"2.5em", fontWeight:"900", marginBottom:"30px" }}>Practice Planner</h1>
        {["Add a New Drill","Create a New Practice Plan","View a Practice Plan"].map((text, idx) => (
          <button key={idx} onClick={() => setCurrentPage(text.includes("Drill")?"addDrill":text.includes("Create")?"createPractice":"viewPractice")} style={{ ...buttonStyle }} onMouseOver={e=>Object.assign(e.currentTarget.style, buttonHover)} onMouseOut={e=>Object.assign(e.currentTarget.style, buttonStyle)}>{text}</button>
        ))}
      </div>
    );
  }

  // --- Add Drill Page ---
  if(currentPage === "addDrill") {
    return (
      <div style={pageStyle}>
        <button onClick={() => setCurrentPage("home")} style={{ marginBottom: "15px" }}>⬅ Home</button>
        <h1 style={{ marginBottom: "20px" }}>Add Drill</h1>
        <input placeholder="Drill Name" value={drillName} onChange={e=>setDrillName(e.target.value)} style={{ width:"100%", padding:"10px", borderRadius:"8px" }} />
        <br /><br />
        <select value={drillCategory} onChange={e=>setDrillCategory(e.target.value)} style={{ width:"100%", padding:"10px", borderRadius:"8px" }}>
          {categories.map(c=><option key={c}>{c}</option>)}
        </select>
        <br /><br />
        <select value={drillPlayers} onChange={e=>setDrillPlayers(e.target.value)} style={{ width:"100%", padding:"10px", borderRadius:"8px" }}>
          {[...Array(15)].map((_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
        </select>
        <small>Number of players recommended for this drill</small>
        <br /><br />
        <textarea placeholder="Drill Instructions (bullet points)" value={drillNotes} onChange={e=>setDrillNotes(e.target.value)} style={{ width:"100%", padding:"10px", borderRadius:"8px", minHeight:"80px" }} />
        <br /><br />
        <input placeholder="Video link" value={drillVideo} onChange={e=>setDrillVideo(e.target.value)} style={{ width:"100%", padding:"10px", borderRadius:"8px" }} />
        <br /><br />
        <button onClick={addDrill} style={{ padding:"14px 25px", borderRadius:"12px", backgroundColor: COLORS.darkGray, color: COLORS.white, fontWeight:"700", border:"none" }}>Save Drill</button>

        <h2 style={{ marginTop:"30px", marginBottom:"15px" }}>Existing Drills</h2>
        {drills.map(d => (
          <div key={d.id} style={cardStyle}>
            <div style={{ fontWeight:"700", fontSize:"1.1em", color: COLORS.panthersBlue }}>{d.name} ({d.category}) - {d.playersNeeded} Players</div>
            <ul>{d.notes.split(/\r?\n/).map((line,i)=>line.trim()!=="" && <li key={i} style={drillNoteStyle}>{line}</li>)}</ul>
            {d.video && <a href={d.video} target="_blank" style={videoLinkStyle}>Watch Video</a>}
          </div>
        ))}
      </div>
    );
  }

  // --- Create Practice Page ---
  if(currentPage === "createPractice") {
    return (
      <div style={pageStyle}>
        <button onClick={() => setCurrentPage("home")} style={{ marginBottom: "15px" }}>⬅ Home</button>
        <h1 style={{ marginBottom:"20px" }}>Create Practice Plan</h1>
        <label>Date: </label>
        <input type="date" value={practiceDate} onChange={e=>setPracticeDate(e.target.value)} />
        <br /><br />
        <label>Start Time: </label>
        <input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} />
        <br /><br />
        <label>Filter by Drill Type: </label>
        <select onChange={e=>setDrillCategory(e.target.value)} value={drillCategory}>
          {categories.map(c=><option key={c}>{c}</option>)}
        </select>
        <h3>Select up to 3 drills:</h3>
        {drills.filter(d=>d.category===drillCategory).map(d=>(
          <div key={d.id}>
            <input type="checkbox" checked={!!practice.find(p=>p.id===d.id)} onChange={()=>togglePractice(d)} /> {d.name}
          </div>
        ))}
        <br />
        <button onClick={()=>savePractice()} style={{ padding:"14px 25px", borderRadius:"12px", backgroundColor: COLORS.darkGray, color: COLORS.white, fontWeight:"700", border:"none" }}>Save Practice Plan</button>
      </div>
    );
  }

  // --- View Practice Page ---
  if(currentPage === "viewPractice") {
    const practicesForDate = getPracticesForDate(practiceDate);
    const selectedPractice = practicesForDate.find(p=>p.id===selectedPracticeId) || practicesForDate[0];

    return (
      <div style={pageStyle}>
        <button onClick={() => setCurrentPage("home")} style={{ marginBottom: "15px" }}>⬅ Home</button>
        <h1 style={{ marginBottom:"20px" }}>View Practice Plan</h1>
        <label>Select Date: </label>
        <input type="date" value={practiceDate} onChange={e=>setPracticeDate(e.target.value)} />
        <br /><br />
        {practicesForDate.length===0 && <div>No practices saved for this date.</div>}
        {practicesForDate.map(p=>(
          <div key={p.id} style={{ marginBottom:"10px" }}>
            <button onClick={()=>setSelectedPracticeId(p.id)} style={{ display:"inline-block", marginRight:"10px", padding:"5px 10px" }}>Practice at {new Date(p.date).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })} {format12Hour(parseInt(p.startTime.split(":")[0]), parseInt(p.startTime.split(":")[1]))}</button>
            <button onClick={()=>editPractice(p.id)} style={{ display:"inline-block", marginRight:"10px", padding:"5px 10px", backgroundColor:"orange", color:"white", border:"none", borderRadius:"5px" }}>Modify</button>
            <button onClick={()=>deletePractice(p.id)} style={{ display:"inline-block", padding:"5px 10px", backgroundColor:"red", color:"white", border:"none", borderRadius:"5px" }}>Delete</button>
          </div>
        ))}

        {selectedPractice && (
          <div style={cardStyle}>
            <h3 style={{ marginBottom:"15px" }}>
              Date: {new Date(selectedPractice.date).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })} | 
              Start Time: {format12Hour(parseInt(selectedPractice.startTime.split(":")[0]), parseInt(selectedPractice.startTime.split(":")[1]))}
            </h3>
            <table style={tableStyle}>
              <tbody>
                {generateSchedule(selectedPractice.startTime, selectedPractice.drills).map((s,i)=> {
                  const drill = selectedPractice.drills.find(d=>d.name===s.title);
                  return (
                    <tr key={i}>
                      <td style={thTdStyle}>
                        <div>{s.start}</div>
                        <div style={{ textAlign:"center" }}>-</div>
                        <div>{s.end}</div>
                      </td>
                      <td style={thTdStyle}>
                        <div style={drillTitleStyle}>{s.title}</div>
                        {drill && drill.notes && <ul>{drill.notes.split(/\r?\n/).map((line,j)=><li key={j} style={drillNoteStyle}>{line}</li>)}</ul>}
                        {drill && drill.video && <a href={drill.video} target="_blank" style={videoLinkStyle}>Watch Video</a>}
                        {(s.title==="Dynamic Warmup" || s.title==="Cool Down") && <em>{s.title}</em>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <br />
            <small>Sharable link: {window.location.origin+`#practice-${selectedPractice.date}-${selectedPractice.id}`}</small>
          </div>
        )}
      </div>
    );
  }

  return null;
}
