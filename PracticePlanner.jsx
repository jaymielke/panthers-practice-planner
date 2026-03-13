import React, { useState, useEffect } from "react";

const COLORS = {
  primary: "#5f8db5",
  white: "#ffffff",
  black: "#000000",
  light: "#f5f7fb"
};

const categoryIcons = {
  Hitting: "fa-baseball-bat-ball",
  Fielding: "fa-baseball",
  Throwing: "fa-hand",
  "Base Running": "fa-person-running",
  Warmup: "fa-fire"
};

export default function PracticePlanner() {

  const today = new Date().toISOString().split("T")[0];

  const [page,setPage] = useState("home");
  const [drills,setDrills] = useState([]);
  const [practiceHistory,setPracticeHistory] = useState([]);

  const [practiceDate,setPracticeDate] = useState(today);
  const [startTime,setStartTime] = useState("17:00");
  const [practice,setPractice] = useState([]);

  const [drillName,setDrillName] = useState("");
  const [drillCategory,setDrillCategory] = useState("Hitting");
  const [drillNotes,setDrillNotes] = useState("");
  const [drillVideo,setDrillVideo] = useState("");
  const [players,setPlayers] = useState(1);

  const categories=["Hitting","Fielding","Throwing","Base Running","Warmup"];

  useEffect(()=>{
    const savedDrills=localStorage.getItem("drills");
    const savedPractices=localStorage.getItem("practiceHistory");

    if(savedDrills) setDrills(JSON.parse(savedDrills));
    if(savedPractices) setPracticeHistory(JSON.parse(savedPractices));
  },[]);

  useEffect(()=>{
    localStorage.setItem("drills",JSON.stringify(drills));
  },[drills]);

  useEffect(()=>{
    localStorage.setItem("practiceHistory",JSON.stringify(practiceHistory));
  },[practiceHistory]);

  function addDrill(){

    if(!drillName) return;

    const newDrill={
      id:Date.now(),
      name:drillName,
      category:drillCategory,
      notes:drillNotes,
      video:drillVideo,
      players:players
    };

    setDrills([...drills,newDrill]);

    setDrillName("");
    setDrillNotes("");
    setDrillVideo("");
    setPlayers(1);
  }

  function toggleDrill(d){

    if(practice.find(p=>p.id===d.id)){
      setPractice(practice.filter(p=>p.id!==d.id));
    } else if(practice.length<3){
      setPractice([...practice,d]);
    }
  }

  function savePractice(){

    const entry={
      id:Date.now(),
      date:practiceDate,
      start:startTime,
      drills:practice
    };

    setPracticeHistory([entry,...practiceHistory]);
    setPractice([]);
    setPage("home");
  }

  function deletePractice(id){

    if(!confirm("Delete this practice?")) return;

    setPracticeHistory(practiceHistory.filter(p=>p.id!==id));
  }

  function formatTime(hour,min){

    const suffix=hour>=12?"PM":"AM";
    const h=hour%12||12;

    return `${h}:${String(min).padStart(2,"0")} ${suffix}`;
  }

  function buildSchedule(start,drills){

    const [h,m]=start.split(":").map(Number);

    let hour=h;
    let min=m;

    const blocks=[];

    function add(minutes,label){

      const endHour=hour+Math.floor((min+minutes)/60);
      const endMin=(min+minutes)%60;

      blocks.push({
        start:formatTime(hour,min),
        end:formatTime(endHour,endMin),
        label
      });

      hour=endHour;
      min=endMin;
    }

    add(15,"Dynamic Warmup");
    drills.forEach(d=>add(20,d.name));
    add(15,"Cool Down");

    return blocks;
  }

  const pageStyle={
    backgroundColor:COLORS.primary,
    minHeight:"100vh",
    padding:"25px",
    fontFamily:"system-ui, sans-serif",
    color:COLORS.white
  };

  const card={
    backgroundColor:COLORS.white,
    color:COLORS.black,
    padding:"16px",
    borderRadius:"10px",
    marginBottom:"14px"
  };

  const button={
    padding:"14px",
    width:"100%",
    borderRadius:"10px",
    border:"none",
    marginBottom:"14px",
    fontSize:"18px",
    fontWeight:"600",
    cursor:"pointer",
    backgroundColor:COLORS.white,
    color:COLORS.primary
  };

  const input={
    width:"100%",
    padding:"8px",
    marginBottom:"10px",
    borderRadius:"6px",
    border:"1px solid #ccc"
  };

  const table={
    width:"100%",
    borderCollapse:"collapse",
    marginTop:"10px"
  };

  const td={
    border:"1px solid #ddd",
    padding:"8px",
    backgroundColor:"#fff",
    color:"#000"
  };

  if(page==="home"){

    return(
      <div style={pageStyle}>

        <h1>Practice Planner</h1>

        <button style={button} onClick={()=>setPage("addDrill")}>
        <i class="fa-solid fa-plus"></i> Add Drill
        </button>

        <button style={button} onClick={()=>setPage("createPractice")}>
        <i class="fa-solid fa-clipboard-list"></i> Create Practice Plan
        </button>

        <button style={button} onClick={()=>setPage("viewPractice")}>
        <i class="fa-solid fa-calendar"></i> View Practice Plans
        </button>

      </div>
    );
  }

  if(page==="addDrill"){

    return(
      <div style={pageStyle}>

      <h2>Add Drill</h2>

      <input style={input} placeholder="Drill Name"
      value={drillName}
      onChange={e=>setDrillName(e.target.value)}
      />

      <select style={input}
      value={drillCategory}
      onChange={e=>setDrillCategory(e.target.value)}
      >
      {categories.map(c=><option key={c}>{c}</option>)}
      </select>

      <label>Players Needed</label>

      <select style={input}
      value={players}
      onChange={e=>setPlayers(parseInt(e.target.value))}
      >
      {Array.from({length:20},(_,i)=>i+1).map(n=>
      <option key={n}>{n}</option>)}
      </select>

      <textarea
      style={input}
      placeholder="Notes (separate steps with ; )"
      value={drillNotes}
      onChange={e=>setDrillNotes(e.target.value)}
      />

      <input
      style={input}
      placeholder="Video Link"
      value={drillVideo}
      onChange={e=>setDrillVideo(e.target.value)}
      />

      <button style={button} onClick={addDrill}>
      Save Drill
      </button>

      <button style={button} onClick={()=>setPage("home")}>
      Back
      </button>

      <h3>Existing Drills</h3>

      {drills.map(d=>(
        <div key={d.id} style={card}>

        <strong>
        <i class={`fa-solid ${categoryIcons[d.category]}`}></i> {d.name}
        </strong>

        <div>{d.category} • {d.players} players</div>

        <ul>
        {d.notes.split(";").map((n,i)=>
        <li key={i}>{n.trim()}</li>)}
        </ul>

        {d.video && (
        <a href={d.video} target="_blank">
        Watch Video
        </a>
        )}

        </div>
      ))}

      </div>
    );
  }

  if(page==="createPractice"){

    return(
      <div style={pageStyle}>

      <h2>Create Practice</h2>

      <label>Date</label>
      <input style={input} type="date"
      value={practiceDate}
      onChange={e=>setPracticeDate(e.target.value)}
      />

      <label>Start Time</label>
      <input style={input} type="time"
      value={startTime}
      onChange={e=>setStartTime(e.target.value)}
      />

      <h3>Select Drills</h3>

      {drills.map(d=>(
        <div key={d.id} style={card}
        onClick={()=>toggleDrill(d)}
        >

        <strong>
        <i class={`fa-solid ${categoryIcons[d.category]}`}></i> {d.name}
        </strong>

        </div>
      ))}

      <button style={button} onClick={savePractice}>
      Save Practice
      </button>

      <button style={button} onClick={()=>setPage("home")}>
      Back
      </button>

      </div>
    );
  }

  if(page==="viewPractice"){

    return(
      <div style={pageStyle}>

      <h2>Practice Plans</h2>

      {practiceHistory.map(p=>{

        const schedule=buildSchedule(p.start,p.drills);

        return(

        <div key={p.id} style={card}>

        <strong>
        {new Date(p.date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
        </strong>

        <table style={table}>
        <tbody>

        {schedule.map((s,i)=>(
          <tr key={i}>
          <td style={td}>{s.start}<br/>{s.end}</td>
          <td style={td}>{s.label}</td>
          </tr>
        ))}

        </tbody>
        </table>

        <button style={button} onClick={()=>deletePractice(p.id)}>
        Delete
        </button>

        </div>

        );
      })}

      <button style={button} onClick={()=>setPage("home")}>
      Back
      </button>

      </div>
    );
  }

  return <div style={pageStyle}>Loading...</div>;

}
