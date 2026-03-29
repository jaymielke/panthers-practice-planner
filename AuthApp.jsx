import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import PracticePlanner from "./PracticePlanner.jsx";

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(SB_URL, SB_KEY);

function LoginScreen({ onLogin }) {
  return (
    <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9", padding: 20}}>
      <div style={{background: "white", padding: 40, borderRadius: 16, width: "100%", maxWidth: 400}}>
        <h1 style={{fontFamily: "'Oswald', sans-serif", fontSize: 28, textAlign: "center"}}>⚾ PracticePro</h1>
        <p style={{color: "#7a92a8", textAlign: "center", marginBottom: 30}}>Sign in</p>
        <button onClick={() => onLogin({ id: "test-user", email: "test@test.com" })} style={{width: "100%", padding: 14, background: "#5f8db5", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer"}}>🔧 SKIP LOGIN (TEST)</button>
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
    <div style={{minHeight: "100vh", background: "#f4f6f9", padding: 20}}>
      <div style={{background: "white", padding: 30, borderRadius: 16, maxWidth: 500, margin: "0 auto"}}>
        <h1 style={{fontFamily: "'Oswald', sans-serif", fontSize: 24}}>Create Your Team</h1>
        <form onSubmit={handleSubmit}>
          <input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Team Name" required style={{width: "100%", padding: 12, marginBottom: 12, borderRadius: 8, border: "1px solid #ddd"}} />
          <input value={season} onChange={e => setSeason(e.target.value)} placeholder="Season" required style={{width: "100%", padding: 12, marginBottom: 12, borderRadius: 8, border: "1px solid #ddd"}} />
          <textarea value={players} onChange={e => setPlayers(e.target.value)} placeholder="jersey, first, last" rows={5} style={{width: "100%", padding: 12, marginBottom: 12, borderRadius: 8, border: "1px solid #ddd"}} />
          <button type="submit" disabled={loading} style={{width: "100%", padding: 14, background: "#5f8db5", color: "white", border: "none", borderRadius: 8, fontWeight: 700}}>{loading ? "Saving..." : "Create Team"}</button>
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
    <div style={{background: "white", padding: 20, borderRadius: 12, marginTop: 20}}>
      <h2>Add Your Drill</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Drill Name" required style={{width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd"}} />
        <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="TikTok/YouTube/Instagram Link" style={{width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd"}} />
        <select value={category} onChange={e => setCategory(e.target.value)} style={{width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd"}}>
          <option>Hitting</option><option>Fielding</option><option>Throwing</option><option>Running</option><option>Warmup</option><option>Cool Down</option>
        </select>
        <select value={duration} onChange={e => setDuration(e.target.value)} style={{width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd"}}>
          <option value="10">10 min</option><option value="15">15 min</option><option value="20">20 min</option><option value="30">30 min</option>
        </select>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" rows={2} style={{width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd"}} />
        <button type="submit" disabled={loading} style={{padding: "10px 20px", background: "#5f8db5", color: "white", border: "none", borderRadius: 8}}>{loading ? "Saving..." : "Save Drill"}</button>
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

  return (
    <div style={{background: "white", padding: 20, borderRadius: 12, marginTop: 20}}>
      <h2>🌐 Community Drills</h2>
      <p style={{color: "#666", marginBottom: 15}}>Browse drills other coaches have saved!</p>
      <select value={category} onChange={e => setCategory(e.target.value)} style={{padding: 8, marginBottom: 15, borderRadius: 6, border: "1px solid #ddd"}}>
        <option value="All">All Categories</option>
        <option value="Hitting">Hitting</option><option value="Fielding">Fielding</option><option value="Throwing">Throwing</option>
      </select>
      <div style={{display: "grid", gap: 10}}>
        {filtered.map(drill => (
          <div key={drill.id} style={{padding: 12, border: "1px solid #ddd", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div>
              <strong>{drill.name}</strong> <span style={{background: "#e8f5e9", padding: "2px 8px", borderRadius: 4, fontSize: 12}}>{drill.category}</span>
              <br/><small style={{color: "#666"}}>{drill.duration} min</small>
              {drill.video_url && <a href={drill.video_url} target="_blank" style={{marginLeft: 10}}>📺 Watch</a>}
            </div>
            <button onClick={() => onAddToMine(drill)} style={{padding: "8px 12px", background: "#4caf50", color: "white", border: "none", borderRadius: 6, cursor: "pointer"}}>+ Add to My Drills</button>
          </div>
        ))}
        {filtered.length === 0 && <p>No drills yet. Be the first to add one!</p>}
      </div>
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

  if (loading) return <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24}}>Loading...</div>;
  if (!user) return <LoginScreen onLogin={setUser} />;
  if (!hasTeam) return <CreateTeam user={user} onCreated={() => setHasTeam(true)} />;

  return (
    <div style={{background: "#f4f6f9", minHeight: "100vh"}}>
      <div style={{padding: 16, background: "white", borderBottom: "3px solid #e3b440", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10}}>
        <h1 style={{fontFamily: "'Oswald', sans-serif", fontSize: 20}}>⚾ PracticePro</h1>
        <div style={{display: "flex", gap: 10}}>
          <button onClick={() => { setShowAddDrill(!showAddDrill); setShowCommunity(false); }} style={{padding: "8px 16px", background: showAddDrill ? "#e3b440" : "#5f8db5", color: "white", border: "none", borderRadius: 8}}>+ Add My Drill</button>
          <button onClick={() => { setShowCommunity(!showCommunity); setShowAddDrill(false); }} style={{padding: "8px 16px", background: showCommunity ? "#e3b440" : "#4caf50", color: "white", border: "none", borderRadius: 8}}>🌐 Community Library</button>
        </div>
      </div>
      
      {showAddDrill && <div style={{maxWidth: 600, margin: "0 auto", padding: 20}}><AddDrillForm user={user} onSaved={() => setShowAddDrill(false)} /></div>}
      {showCommunity && <div style={{maxWidth: 800, margin: "0 auto", padding: 20}}><CommunityDrills user={user} onAddToMine={(d) => alert("Added to your drills!")} /></div>}
      
      <PracticePlanner user={user} onLogout={() => setUser(null)} />
    </div>
  );
}
