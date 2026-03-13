import React, { useState, useEffect } from "react";

const COLORS = {
  primary: "#5f8db5",
  card: "#f7f9fc"
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
  const [practice,setPractice] = useState([]);

  const [practiceDate,setPracticeDate] = useState(today);
  const [startTime,setStartTime] = useState("17:00");

  const [drillName,setDrillName] = useState("");
  const [drillCategory,setDrillCategory] = useState("Hitting");
  const [drillNotes,setDrillNotes] = useState("");
  const [drillVideo,setDrillVideo] = useState("");
  const [players,setPlayers] = useState(1);

  const categories=["Hitting","Fielding","Throwing","Base Running","Warmup"];

  useEffect(()=>{

    const savedDrills=localStorage.getItem("drills");
    const savedPractice=localStorage.getItem("practiceHistory");

    if(savedDrills) setDrills(JSON.parse(savedDrills));
    if(savedPractice) setPracticeHistory(JSON.parse(savedPractice));

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
      players
    };

    setDrills([...drills,newDrill]);

    setDrillName("");
    setDrillNotes("");
    setDrillVideo("");
  }

  function deleteDrill(id){

    if(!confirm("Delete this drill?")) return;

    setDrills(drills.filter(d=>d.id!==id));
  }

  function editDrill(drill){

    setDrillName(drill.name);
    setDrillCategory(drill.category);
    setDrillNotes(drill.notes);
    setDrillVideo(drill.video);
    setPlayers(drill.players);

    setDrills(drills.filter(d=>d.id!==drill.id));
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

    if(!confirm("Delete practice plan?")) return;

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
    fontFamily:"system-ui",
    color:"#fff"
  };

  const button={
    width:"100%",
    padding:"14px",
    borderRadius:"8px",
    border:"none",
    marginBottom:"12px",
    fontSize:"18px",
    fontWeight:"600",
    cursor:"pointer",
    background:"#fff",
    color:COLORS.primary
  };

  const card={
    background:COLORS.card,
    color:"#000",
    padding:"14px",
    borderRadius:"8px",
    marginBottom:"12px"
  };

  const input={
    width:"100%",
    padding:"8px",
    borderRadius:"6px",
    border:"1px solid #ccc",
    marginBottom:"10px"
  };

  const table={
    width:"100%",
    borderCollapse:"collapse",
    marginTop:"10px"
  };

  const td={
    border:"1px solid #ddd",
    padding:"8px",
    background:"#fff",
    color:"#000"
  };

  if(page==="home"){

    return(
      <div style={pageStyle}>

        <div style={{textAlign:"center",marginBottom:"20px"}}>
          <h1>Practice Planner</h1>
        </div>

        <button style={button} onClick={()=>setPage("addDrill")}>
        Add Drill
        </button>

        <button style={button} onClick={()=>setPage("createPractice")}>
        Create Practice
        </button>

        <button style={button} onClick={()=>setPage("viewPractice")}>
        View Practice Plans
        </button>

      </div>
    );
  }

  if(page==="addDrill"){

    return(
      <div style={pageStyle}>

      <h2>Add Drill</h2>

      <input style={input}
      placeholder="Drill name"
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
      placeholder="One instruction per line"
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

        <strong>{d.name}</strong>

        <div>{d.category} • {d.players} players</div>

        <ul>
        {d.notes.split("\n").map((n,i)=>
        <li key={i}>{n}</li>)}
        </ul>

        {d.video && (
        <a href={d.video} target="_blank">
        Watch Video
        </a>
        )}

        <div style={{marginTop:"8px"}}>

        <button onClick={()=>editDrill(d)}>Edit</button>

        <button onClick={()=>deleteDrill(d.id)}>Delete</button>

        </div>

        </div>

      ))}

      </div>
    );
  }

  if(page==="createPractice"){

    return(
      <div style={pageStyle}>

      <h2>Create Practice</h2>

      <input style={input}
      type="date"
      value={practiceDate}
      onChange={e=>setPracticeDate(e.target.value)}
      />

      <input style={input}
      type="time"
      value={startTime}
      onChange={e=>setStartTime(e.target.value)}
      />

      <h3>Select Drills</h3>

      {drills.map(d=>(
        <div
        key={d.id}
        style={card}
        onClick={()=>toggleDrill(d)}
        >
        {d.name}
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

            <td style={td}>
            {s.start}<br/>{s.end}
            </td>

            <td style={td}>
            {s.label}
            </td>

            </tr>

          ))}

          </tbody>
          </table>

          <button style={button} onClick={()=>deletePractice(p.id)}>
          Delete Practice
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

}
