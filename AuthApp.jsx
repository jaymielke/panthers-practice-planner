import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import PracticePlanner from "./PracticePlanner.jsx";

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(SB_URL, SB_KEY);

// Match PracticePro color palette
const P = {
  steel: "#5f8db5", gold: "#e3b440", surface: "#ffffff", bg: "#f4f6f9",
  border: "#dde3eb", text: "#1a2535", textMuted: "#7a92a8"
};

function LoginScreen({ onLogin }) {
  return (
    <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: P.bg, padding: 20}}>
      <div style={{background: P.surface, padding: 40, borderRadius: 14, width: "100%", maxWidth: 400, border: `1.5px solid ${P.border}`}}>
        <h1 style={{fontFamily: "'Oswald', sans-serif", fontSize: 28, textAlign: "center", color: P.text}}>⚾ PracticePro</h1>
        <p style={{color: P.textMuted, textAlign: "center", marginBottom: 30}}>Sign in</p>
        <button onClick={() => onLogin({ id: "test-user", email: "test@test.com" })} style={{width: "100%", padding: 14, background: P.steel, color: "white", border: "none", borderRadius: 9, fontSize: 16, fontWeight: 700, cursor: "pointer"}}>🔧 SKIP LOGIN (TEST)</button>
      </div>
    </div>
  );
}

function CreateTeam({ user, onCreated }) {
  const [teamName, setTeamName] = useState("");
  const [season, setSeason] = useState("");
  const [players, setPlayers] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const playerList = players.split("\n").filter(l => l.trim()).map((line, i) => {
      const p = line.split(",");
      return { id: "p" + (i+1), jersey: p[0]?.trim(), first: p[1]?.trim(), last: p[2]?.trim() };
    });
    await supabase.from("teams").insert([{ user_id: user.id, team_name: teamName, season, players: playerList }]);
    setLoading(false);
    onCreated();
  };

  return (
    <div style={{minHeight: "100vh", background: P.bg, padding: 16}}>
      <div style={{background: P.surface, padding: 18, borderRadius: 14, border: `1.5px solid ${P.border}`, maxWidth: 500, margin: "0 auto"}}>
        <h1 style={{fontFamily: "'Oswald', sans-serif", fontSize: 24, marginBottom: 14}}>Create Your Team</h1>
        <form onSubmit={handleSubmit}>
          <div className="field"><label className="label">Team Name</label>
          <input className="input" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="e.g., Panthers" required /></div>
          <div className="field"><label className="label">Season</label>
          <input className="input" value={season} onChange={e => setSeason(e.target.value)} placeholder="e.g., 2026 Spring" required /></div>
          <div className="field"><label className="label">Players (jersey, first, last)</label>
          <textarea className="textarea" value={players} onChange={e => setPlayers(e.target.value)} placeholder="25,Lawson,Buck&#10;67,Miles,Bell" rows={5} /></div>
          <button type="submit" disabled={loading} style={{width: "100%", padding: 14, background: P.steel, color: "white", border: "none", borderRadius: 9, fontWeight: 700}}>{loading ? "Saving..." : "Create Team"}</button>
        </form>
      </div>
    </div>
  );
}

function AddDrillForm({ user, onSaved }) {
  const [name, setName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [category, setCategory] = useState("Hitting");
  const [duration, setDuration] = useState(15);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from("drills").insert([{ name, video_url: videoUrl, category, duration: parseInt(duration), notes, user_id: user.id }]);
    setLoading(false);
    onSaved();
  };

  return (
    <div className="card">
      <div className="card-title">Add Your Drill</div>
      <form onSubmit={handleSubmit}>
        <div className="field"><label className="label">Drill Name</label>
        <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Tee Work" required /></div>
        <div className="field"><label className="label">Video Link (TikTok/YouTube)</label>
        <input className="input" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://..." /></div>
        <div className="row2"><div className="field"><label className="label">Category</label>
          <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
            <option>Hitting</option><option>Fielding</option><option>Throwing</option><option>Running</option><option>Warmup</option><option>Cool Down</option>
          </select></div>
          <div className="field"><label className="label">Duration</label>
          <select className="select" value={duration} onChange={e => setDuration(e.target.value)}>
            <option value="10">10 min</option><option value="15">15 min</option><option value="20">20 min</option><option value="30">30 min</option>
          </select></div></div>
        <div className="field"><label className="label">Notes</label>
        <textarea className="textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Tips for this drill..." rows={2} /></div>
        <button type="submit" disabled={loading} style={{padding: "11px 20px", background: P.steel, color: "white", border: "none", borderRadius: 9, fontWeight: 700, width: "100%"}}>{loading ? "Saving..." : "Save Drill"}</button>
      </form>
    </div>
  );
}

function CommunityDrills({ user, onAddToMine }) {
  const [drills, setDrills] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    supabase.from("drills").select("*").then(({ data }) => setDrills(data || []));
  }, []);

  const filtered = category === "All" ? drills : drills.filter(d => d.category === category);

  const getCatColor = (cat) => {
    const colors = { Hitting: "#ef6b36", Fielding: "#3bb980", Throwing: "#6495ed", Running: "#c89b00", Warmup: "#9377e6", "Cool Down": "#7891a5" };
    return colors[cat] || "#5f8db5";
  };

  return (
    <div className="card">
      <div className="card-title">🌐 Community Drill Library</div>
      <p style={{color: P.textMuted, fontSize: 13, marginBottom: 14}}>Browse drills other coaches have saved!</p>
      <div style={{marginBottom: 14}}>
        <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Hitting">Hitting</option><option value="Fielding">Fielding</option><option value="Throwing">Throwing</option><option value="Running">Running</option><option value="Warmup">Warmup</option>
        </select>
      </div>
      {filtered.map(drill => (
        <div key={drill.id} style={{padding: 14, border: `1.5px solid ${P.border}`, borderRadius: 10, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10}}>
          <div>
            <div style={{fontWeight: 700, fontSize: 15}}>{drill.name}</div>
            <div style={{display: "flex", gap: 6, marginTop: 4}}>
              <span style={{background: getCatColor(drill.category) + "20", color: getCatColor(drill.category), padding: "3px 8px", borderRadius: 12, fontSize: 11, fontWeight: 800}}>{drill.category}</span>
              <span style={{color: P.textMuted, fontSize: 12}}>{drill.duration} min</span>
            </div>
            {drill.video_url && <a href={drill.video_url} target="_blank" style={{color: P.steel, fontSize: 12, marginTop: 4, display: "block"}}>📺 Watch Video</a>}
          </div>
          <button onClick={() => onAddToMine(drill)} style={{padding: "8px 14px", background: "#4caf50", color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer"}}>+ Add to My Drills</button>
        </div>
      ))}
      {filtered.length === 0 && <p style={{color: P.textMuted, textAlign: "center", padding: 20}}>No drills yet. Be the first to add one!</p>}
    </div>
  );
}

export default function AuthApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasTeam, setHasTeam] = useState(false);
  const [showAddDrill, setShowAddDrill] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, background: P.bg}}>Loading...</div>;
  if (!user) return <LoginScreen onLogin={setUser} />;
  if (!hasTeam) return <CreateTeam user={user} onCreated={() => setHasTeam(true)} />;

  return (
    <div style={{background: P.bg, minHeight: "100vh", maxWidth: 680, margin: "0 auto"}}>
      <div style={{padding: "11px 16px", background: P.surface, borderBottom: `3px solid ${P.gold}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10}}>
        <h1 style={{fontFamily: "'Oswald', sans-serif", fontSize: 17, fontWeight: 700, color: P.text}}>⚾ PracticePro</h1>
        <div style={{display: "flex", gap: 8}}>
          <button onClick={() => { setShowAddDrill(!showAddDrill); setShowCommunity(false); }} style={{padding: "6px 12px", background: showAddDrill ? P.gold : P.steel, color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer"}}>+ Add My Drill</button>
          <button onClick={() => { setShowCommunity(!showCommunity); setShowAddDrill(false); }} style={{padding: "6px 12px", background: showCommunity ? P.gold : "#4caf50", color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer"}}>🌐 Community</button>
        </div>
      </div>
      
      <div style={{padding: 16}}>
        {showAddDrill && <AddDrillForm user={user} onSaved={() => setShowAddDrill(false)} />}
        {showCommunity && <CommunityDrills user={user} onAddToMine={(d) => alert("Added to your drills!")} />}
      </div>
      
      <PracticePlanner user={user} onLogout={() => setUser(null)} />
    </div>
  );
}
