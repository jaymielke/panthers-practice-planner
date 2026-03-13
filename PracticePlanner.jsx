import React, { useState, useEffect } from "react";

export default function PracticePlanner() {

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const [monthOffset, setMonthOffset] = useState(0);

  const [drills, setDrills] = useState([]);
  const [practice, setPractice] = useState([]);
  const [history, setHistory] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [practiceDate, setPracticeDate] = useState(todayString);

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [video, setVideo] = useState("");
  const [category, setCategory] = useState("Hitting");

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const savedDrills = localStorage.getItem("drills");
    const savedHistory = localStorage.getItem("practiceHistory");

    if (savedDrills) setDrills(JSON.parse(savedDrills));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem("drills", JSON.stringify(drills));
  }, [drills]);

  useEffect(() => {
    localStorage.setItem("practiceHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  function addDrill() {
    if (!name) return;

    const newDrill = {
      id: Date.now(),
      name,
      notes,
      video,
      category
    };

    setDrills([...drills, newDrill]);

    setName("");
    setNotes("");
    setVideo("");
  }

  function togglePractice(drill) {
    if (practice.find((d) => d.id === drill.id)) {
      setPractice(practice.filter((d) => d.id !== drill.id));
    } else if (practice.length < 3) {
      setPractice([...practice, drill]);
    }
  }

  function clearPractice() {
    setPractice([]);
  }

  function savePractice() {
    if (practice.length === 0) return;

    const entry = {
      id: Date.now(),
      date: practiceDate,
      drills: practice
    };

    const filtered = history.filter((h) => h.date !== practiceDate);

    setHistory([entry, ...filtered]);
    setPractice([]);
  }

  function copyPractice(dateString) {
    const existing = history.find((h) => h.date === dateString);

    if (!existing) return;

    setPractice(existing.drills);
    setPracticeDate(todayString);
  }

  function startTimer(minutes) {
    setSeconds(minutes * 60);
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;

    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const categories = ["Hitting", "Fielding", "Throwing", "Base Running", "Warmup"];

  const calendarDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  function getPracticeForDate(dateString) {
    return history.find((p) => p.date === dateString);
  }

  function planForDate(dateString) {
    setPracticeDate(dateString);
    setSelectedDate(dateString);
    setPractice([]);
  }

  const drillUsage = {};

  history.forEach((p) => {
    p.drills.forEach((d) => {
      drillUsage[d.name] = (drillUsage[d.name] || 0) + 1;
    });
  });

  const drillStats = drills.map((d) => ({
    name: d.name,
    count: drillUsage[d.name] || 0
  }));

  const monthName = calendarDate.toLocaleString("default", { month: "long" });

  return (
    <div style={{padding:"20px",maxWidth:"700px",margin:"auto",fontFamily:"Arial"}}>

      <h1>Kitchener Panthers U8 Practice Planner ⚾</h1>

      <h2>Add Drill</h2>

      <input placeholder="Drill name" value={name} onChange={(e)=>setName(e.target.value)} />
      <br/><br/>

      <select value={category} onChange={(e)=>setCategory(e.target.value)}>
        {categories.map(c=>(
          <option key={c}>{c}</option>
        ))}
      </select>

      <br/><br/>

      <textarea
        placeholder="Drill instructions"
        value={notes}
        onChange={(e)=>setNotes(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Video link"
        value={video}
        onChange={(e)=>setVideo(e.target.value)}
      />

      <br/><br/>

      <button onClick={addDrill}>Save Drill</button>

      <h2>Drill Library</h2>

      {drills.map(drill=>(
        <div key={drill.id} style={{border:"1px solid #ccc",padding:"10px",marginBottom:"10px"}}>
          <strong>{drill.name}</strong> ({drill.category})

          <div>{drill.notes}</div>

          {drill.video && (
            <div>
              <a href={drill.video} target="_blank">Watch Video</a>
            </div>
          )}

          <button onClick={()=>togglePractice(drill)}>
            {practice.find(d=>d.id===drill.id) ? "Remove from Practice":"Add to Practice"}
          </button>
        </div>
      ))}

      <h2>Practice Builder</h2>

      <div>Planning Practice For: {practiceDate}</div>

      {practice.map((drill,index)=>(
        <div key={drill.id}>
          {index+1}. {drill.name}
        </div>
      ))}

      <br/>

      <button onClick={()=>startTimer(10)}>Start 10 min Drill</button>
      <button onClick={clearPractice}>Clear</button>
      <button onClick={savePractice}>Save Practice</button>

      {seconds>0 && (
        <h2>{formatTime(seconds)}</h2>
      )}

      <h2>Practice Calendar</h2>

      <button onClick={()=>setMonthOffset(monthOffset-1)}>Previous</button>
      <button onClick={()=>setMonthOffset(monthOffset+1)}>Next</button>

      <div>{monthName} {year}</div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"5px"}}>

        {calendarDays.map((day,i)=>{

          if(!day) return <div key={i}></div>;

          const dateString = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const practiceEntry = getPracticeForDate(dateString);

          return (
            <button
              key={i}
              style={{padding:"10px",background:practiceEntry?"lightgreen":""}}
              onClick={()=>setSelectedDate(dateString)}
            >
              {day}
            </button>
          );
        })}

      </div>

      {selectedDate && (
        <div>

          <h3>{selectedDate}</h3>

          {getPracticeForDate(selectedDate) ? (
            <ul>
              {getPracticeForDate(selectedDate).drills.map(d=>(
                <li key={d.id}>{d.name}</li>
              ))}
            </ul>
          ) : (
            <div>No practice saved</div>
          )}

          <button onClick={()=>planForDate(selectedDate)}>
            Plan Practice For This Date
          </button>

          {getPracticeForDate(selectedDate) && (
            <button onClick={()=>copyPractice(selectedDate)}>
              Copy Practice
            </button>
          )}

        </div>
      )}

      <h2>Season Drill Tracker</h2>

      {drillStats.sort((a,b)=>a.count-b.count).map((d,i)=>(
        <div key={i}>
          {d.name} — {d.count} uses
        </div>
      ))}

    </div>
  );
}
