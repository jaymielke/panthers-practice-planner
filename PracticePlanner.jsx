import React, { useState, useEffect } from "react";

const COLORS = {
  blue: "#5f8db5",
  black: "#000000",
  white: "#FFFFFF",
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

  // Add Drill form state
  const [drillName, setDrillName] = useState("");
  const [drillNotes, setDrillNotes] = useState("");
  const [drillVideo, setDrillVideo] = useState("");
  const [drillCategory, setDrillCategory] = useState("Hitting");
  const [drillPlayers, setDrillPlayers] = useState(1);

  const categories = ["Hitting", "Fielding", "Throwing", "Base Running", "Warmup"];

  // ---------- Load from localStorage ----------
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

  // ---------- Functions ----------
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
    const entry = { id: Date.now(), date: practiceDate, drills: practice };
    const filtered = practiceHistory.filter(h => h.id !== entry.id);
    setPracticeHistory([entry, ...filtered]);
    setPractice([]);
  }

  function deletePractice(id) {
    if (!window.confirm("Delete this practice plan?")) return;
    setPracticeHistory(practiceHistory.filter(p => p.id !== id));
  }

  function getPracticesForDate(date) { return practiceHistory.filter(p => p.date === date); }
  function viewPractice(practiceId) { setSelectedPracticeId(practiceId); setCurrentPage("viewPractice"); }

  // ---------- Render Pages ----------
  const pageStyle = { padding: "20px", maxWidth: "700px", margin: "auto", fontFamily: "Arial", minHeight: "100vh" };
  const buttonStyle = { display: "block", margin: "15px auto", padding: "15px", width: "80%", borderRadius: "12px", backgroundColor: COLORS.white, color: COLORS.blue, fontSize: "18px", fontWeight: "bold", border: "none", cursor: "pointer" };
  const cardStyle = { border: "1px solid #ccc", borderRadius: "8px", padding: "10px", marginBottom: "10px" };

  if (currentPage === "home") {
    return (
      <div style={{ ...pageStyle, textAlign: "center", backgroundColor: COLORS.blue, color: COLORS.black }}>
        <img src="/icon-192.png" alt="Panthers Logo" style={{ width: "120px", marginBottom: "20px" }} />
        <h1 style={{ color: COLORS.white }}>Kitchener Panthers U8 Practice Planner ⚾</h1>

        {["Add a New Drill","Create a New Practice Plan","View a Practice Plan"].map((text, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(text.includes("Drill")?"addDrill":text.includes("Create")?"createPractice":"viewPractice")}
            style={buttonStyle}
          >
            {text}
          </button>
        ))}
      </div>
    );
  }

  if (currentPage === "addDrill") {
    return (
      <div style={pageStyle}>
        <button onClick={() => setCurrentPage("home")} style={{ marginBottom: "15px" }}>⬅ Home</button>
        <h2>Add Drill</h2>
        <input placeholder="Drill Name" value={drillName} onChange={e=>setDrillName(e.target.value)} style={{ width: "100%", padding: "8px" }} />
        <br /><br />
        <select value={drillCategory} onChange={e=>setDrillCategory(e.target.value)} style={{ width: "100%", padding: "8px" }}>
          {categories.map(c=><option key={c}>{c}</option>)}
        </select>
        <br /><br />
        <input type="number" min="1" placeholder="Number of Players" value={drillPlayers} onChange={e=>setDrillPlayers(e.target.value)} style={{ width: "100%", padding: "8px" }} />
        <br /><br />
        <textarea placeholder="Drill Instructions (use line breaks for bullet points)" value={drillNotes} onChange={e=>setDrillNotes(e.target.value)} style={{ width: "100%", padding: "8px" }} />
        <br /><br />
        <input placeholder="Video link" value={drillVideo} onChange={e=>setDrillVideo(e.target.value)} style={{ width: "100%", padding: "8px" }} />
        <br /><br />
        <button onClick={addDrill} style={{ padding: "12px 20px", borderRadius:"8px", backgroundColor: COLORS.blue, color: COLORS.white, fontWeight:"bold", border:"none" }}>Save Drill</button>

        <h2>Existing Drills</h2>
        {drills.map(d => (
          <div key={d.id} style={cardStyle}>
            <strong>{d.name}</strong> ({d.category}) — Players Needed: {d.playersNeeded}
            <ul>
              {d.notes.split(/\r?\n/).map((line, i) => line.trim() !== "" && <li key={i}>{line}</li>)}
            </ul>
            {d.video && <a href={d.video} target="_blank">Watch Video</a>}
          </div>
        ))}
      </div>
    );
  }

  if (currentPage === "createPractice") {
    return (
      <div style={pageStyle}>
        <button onClick={() => setCurrentPage("home")} style={{ marginBottom: "15px" }}>⬅ Home</button>
        <h2>Create Practice Plan</h2>
        <label>Date: </label>
        <input type="date" value={practiceDate} onChange={e=>setPracticeDate(e.target.value)} />
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
        <button onClick={savePractice} style={{ padding: "12px 20px", borderRadius:"8px", backgroundColor: COLORS.blue, color: COLORS.white, fontWeight:"bold", border:"none" }}>Save Practice Plan</button>
      </div>
    );
  }

  if (currentPage === "viewPractice") {
    const practicesForDate = getPracticesForDate(practiceDate);
    const selectedPractice = practicesForDate.find(p=>p.id===selectedPracticeId) || practicesForDate[0];

    return (
      <div style={pageStyle}>
        <button onClick={() => setCurrentPage("home")} style={{ marginBottom: "15px" }}>⬅ Home</button>
        <h2>View Practice Plan</h2>
        <label>Select Date: </label>
        <input type="date" value={practiceDate} onChange={e=>setPracticeDate(e.target.value)} />
        <br /><br />
        {practicesForDate.length===0 && <div>No practices saved for this date.</div>}
        {practicesForDate.map(p=>(
          <div key={p.id} style={{ marginBottom:"10px" }}>
            <button onClick={()=>setSelectedPracticeId(p.id)} style={{ display:"inline-block", marginRight:"10px", padding:"5px 10px" }}>Practice at {p.date}</button>
            <button onClick={()=>deletePractice(p.id)} style={{ display:"inline-block", padding:"5px 10px", backgroundColor:"red", color:"white", border:"none", borderRadius:"5px" }}>Delete</button>
          </div>
        ))}
        {selectedPractice && (
          <div style={cardStyle}>
            <h3>Practice Drills:</h3>
            {selectedPractice.drills.map((d,idx)=>(
              <div key={d.id}>
                {idx+1}. {d.name} ({d.category}) — Players Needed: {d.playersNeeded}
                <ul>
                  {d.notes.split(/\r?\n/).map((line,i)=>line.trim()!=="" && <li key={i}>{line}</li>)}
                </ul>
                {d.video && <a href={d.video} target="_blank">Watch Video</a>}
              </div>
            ))}
            <br />
            <small>Sharable link: {window.location.origin+`#practice-${selectedPractice.date}-${selectedPractice.id}`}</small>
          </div>
        )}
      </div>
    );
  }

  return null;
}
