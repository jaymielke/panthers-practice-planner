import React, { useState, useEffect } from "react";

// Font Awesome CDN will be loaded in index.html head:
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
  const [selectedPracticeId, setSelectedPracticeId] = useState(null);
  const [practice, setPractice] = useState([]);
  const [startTime, setStartTime] = useState("17:00");

  const [drillName, setDrillName] = useState("");
  const [drillNotes, setDrillNotes] = useState("");
  const [drillVideo, setDrillVideo] = useState("");
  const [drillCategory, setDrillCategory] = useState("Hitting");
  const [drillPlayers, setDrillPlayers] = useState(1);

  const categories = ["Hitting", "Fielding", "Throwing", "Base Running", "Warmup"];

  // Load saved drills and practice history
  useEffect(() => {
    const savedDrills = localStorage.getItem("drills");
    const savedHistory = localStorage.getItem("practiceHistory");
    if (savedDrills) setDrills(JSON.parse(savedDrills));
    if (savedHistory) setPracticeHistory(JSON.parse(savedHistory));
  }, []);

  // Save drills and history
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
    const entry = { id: editId || Date.now(), date: practiceDate, startTime, drills: practice };
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
    backgroundSize: "cover"
  };
  const buttonStyle = { 
    display: "block", margin: "20px auto", padding: "16px", width: "85%", borderRadius: "15px", 
    fontSize: "20px", fontWeight: "700", border: "none", cursor: "pointer", 
    background: "linear-gradient(270deg, #5f8db5, #ffffff, #5f8db5)", 
    backgroundSize: "600% 600%", color: COLORS.white,
    animation: "gradientBG 5s ease infinite"
  };
  const cardStyle = { 
    borderRadius: "12px", padding: "20px", marginBottom: "20px", backgroundColor: COLORS.white, color: COLORS.darkGray, 
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)", position:"relative"
  };
  const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop:"10px", backgroundColor:"rgba(255,255,255,0.1)", borderRadius:"12px" };
  const thTdStyle = { border: "1px solid #ddd", padding: "10px", verticalAlign: "top" };
  const drillTitleStyle = { fontWeight: "800", fontSize: "1.2em", marginBottom: "5px" };
  const drillNoteStyle = { margin: "3px 0", paddingLeft:"12px", listStyleType:"disc" };
  const videoLinkStyle = { color: COLORS.primary, textDecoration: "underline", fontWeight:"600" };

  // --- Pages ---
  if(currentPage === "home") {
    return (
      <div style={{ ...pageStyle, textAlign: "center" }}>
        <img src="/icon-192.png" alt="Logo" style={{ width: "140px", marginBottom: "25px", borderRadius:"25px", boxShadow:"0 10px 25px rgba(0,0,0,0.5)" }} />
        <h1 style={{ fontSize:"2.8em", fontWeight:"900", marginBottom:"40px", textShadow:"2px 2px 8px rgba(0,0,0,0.5)" }}>Practice Planner</h1>
        {["Add a New Drill","Create a New Practice Plan","View a Practice Plan"].map((text, idx) => (
          <button key={idx} onClick={() => setCurrentPage(text.includes("Drill")?"addDrill":text.includes("Create")?"createPractice":"viewPractice")} style={{ ...buttonStyle }}>{text}</button>
        ))}
      </div>
    );
  }

  return <div style={pageStyle}>Loading...</div>;
}
