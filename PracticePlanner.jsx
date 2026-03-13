import React, { useState, useEffect } from "react";

export default function PracticePlanner() {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  // ---------- State ----------
  const [currentPage, setCurrentPage] = useState("home"); // home | addDrill | createPractice | viewPractice
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

  const categories = ["Hitting", "Fielding", "Throwing", "Base Running", "Warmup"];

  // ---------- Load from localStorage ----------
  useEffect(() => {
    const savedDrills = localStorage.getItem("drills");
    const savedHistory = localStorage.getItem("practiceHistory");
    if (savedDrills) setDrills(JSON.parse(savedDrills));
    if (savedHistory) setPracticeHistory(JSON.parse(savedHistory));

    // Check URL hash for sharable practice
    if (window.location.hash.startsWith("#practice-")) {
      const hash = window.location.hash.replace("#practice-", "");
      const [date, id] = hash.split("-");
      setPracticeDate(date);
      setSelectedPracticeId(parseInt(id));
      setCurrentPage("viewPractice");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("drills", JSON.stringify(drills));
  }, [drills]);

  useEffect(() => {
    localStorage.setItem("practiceHistory", JSON.stringify(practiceHistory));
  }, [practiceHistory]);

  // ---------- Functions ----------
  function addDrill() {
    if (!drillName) return;
    const newDrill = {
      id: Date.now(),
      name: drillName,
      notes: drillNotes,
      video: drillVideo,
      category: drillCategory,
    };
    setDrills([...drills, newDrill]);
    setDrillName("");
    setDrillNotes("");
    setDrillVideo("");
  }

  function togglePractice(drill) {
    if (practice.find((d) => d.id === drill.id)) {
      setPractice(practice.filter((d) => d.id !== drill.id));
    } else if (practice.length < 3) {
      setPractice([...practice, drill]);
    }
  }

  function savePractice() {
    if (practice.length === 0) return;
    const entry = {
      id: Date.now(),
      date: practiceDate,
      drills: practice,
    };
    const filtered = practiceHistory.filter((h) => h.id !== entry.id);
    setPracticeHistory([entry, ...filtered]);
    setPractice([]);
  }

  function getPracticesForDate(date) {
    return practiceHistory.filter((p) => p.date === date);
  }

  function viewPractice(practiceId) {
    setSelectedPracticeId(practiceId);
    setCurrentPage("viewPractice");
  }

  // ---------- Render Pages ----------
  if (currentPage === "home") {
    return (
      <div style={{ padding: "20px", maxWidth: "700px", margin: "auto", fontFamily: "Arial" }}>
        <h1>Kitchener Panthers U8 Practice Planner ⚾</h1>
        <button style={{ display: "block", margin: "10px 0", padding: "15px" }} onClick={() => setCurrentPage("addDrill")}>
          Add a New Drill
        </button>
        <button style={{ display: "block", margin: "10px 0", padding: "15px" }} onClick={() => setCurrentPage("createPractice")}>
          Create a New Practice Plan
        </button>
        <button style={{ display: "block", margin: "10px 0", padding: "15px" }} onClick={() => setCurrentPage("viewPractice")}>
          View a Practice Plan
        </button>
      </div>
    );
  }

  // ---------- Add Drill Page ----------
  if (currentPage === "addDrill") {
    return (
      <div style={{ padding: "20px", maxWidth: "700px", margin: "auto", fontFamily: "Arial" }}>
        <button onClick={() => setCurrentPage("home")}>⬅ Home</button>
        <h2>Add Drill</h2>
        <input placeholder="Drill Name" value={drillName} onChange={(e) => setDrillName(e.target.value)} />
        <br /><br />
        <select value={drillCategory} onChange={(e) => setDrillCategory(e.target.value)}>
          {categories.map((c) => (<option key={c}>{c}</option>))}
        </select>
        <br /><br />
        <textarea placeholder="Drill Instructions" value={drillNotes} onChange={(e) => setDrillNotes(e.target.value)} />
        <br /><br />
        <input placeholder="Video link" value={drillVideo} onChange={(e) => setDrillVideo(e.target.value)} />
        <br /><br />
        <button onClick={addDrill}>Save Drill</button>

        <h2>Existing Drills</h2>
        {drills.map((d) => (
          <div key={d.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <strong>{d.name}</strong> ({d.category})
            <div>{d.notes}</div>
            {d.video && <a href={d.video} target="_blank">Watch Video</a>}
          </div>
        ))}
      </div>
    );
  }

  // ---------- Create Practice Page ----------
  if (currentPage === "createPractice") {
    return (
      <div style={{ padding: "20px", maxWidth: "700px", margin: "auto", fontFamily: "Arial" }}>
        <button onClick={() => setCurrentPage("home")}>⬅ Home</button>
        <h2>Create Practice Plan</h2>
        <label>Date: </label>
        <input type="date" value={practiceDate} onChange={(e) => setPracticeDate(e.target.value)} />
        <br /><br />

        <label>Filter by Drill Type: </label>
        <select onChange={(e) => setDrillCategory(e.target.value)} value={drillCategory}>
          {categories.map((c) => (<option key={c}>{c}</option>))}
        </select>

        <h3>Select up to 3 drills:</h3>
        {drills.filter(d => d.category === drillCategory).map((d) => (
          <div key={d.id}>
            <input type="checkbox" checked={!!practice.find(p => p.id === d.id)} onChange={() => togglePractice(d)} />
            {d.name}
          </div>
        ))}

        <br />
        <button onClick={savePractice}>Save Practice Plan</button>
      </div>
    );
  }

  // ---------- View Practice Page ----------
  if (currentPage === "viewPractice") {
    const practicesForDate = getPracticesForDate(practiceDate);
    const selectedPractice = practicesForDate.find(p => p.id === selectedPracticeId) || practicesForDate[0];

    return (
      <div style={{ padding: "20px", maxWidth: "700px", margin: "auto", fontFamily: "Arial" }}>
        <button onClick={() => setCurrentPage("home")}>⬅ Home</button>
        <h2>View Practice Plan</h2>
        <label>Select Date: </label>
        <input type="date" value={practiceDate} onChange={(e) => setPracticeDate(e.target.value)} />
        <br /><br />

        {practicesForDate.length === 0 && <div>No practices saved for this date.</div>}

        {practicesForDate.map((p) => (
          <button key={p.id} onClick={() => setSelectedPracticeId(p.id)} style={{ display: "block", margin: "5px 0" }}>
            Practice at {p.date}
          </button>
        ))}

        {selectedPractice && (
          <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
            <h3>Practice Drills:</h3>
            {selectedPractice.drills.map((d, idx) => (
              <div key={d.id}>
                {idx + 1}. {d.name} ({d.category})
                <div>{d.notes}</div>
                {d.video && <a href={d.video} target="_blank">Watch Video</a>}
              </div>
            ))}
            <br />
            <small>Sharable link: {window.location.origin + `#practice-${selectedPractice.date}-${selectedPractice.id}`}</small>
          </div>
        )}
      </div>
    );
  }

  return null;
}
