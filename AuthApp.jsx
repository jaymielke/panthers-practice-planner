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

export default function AuthApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasTeam, setHasTeam] = useState(false);
  const [showDrill, setShowDrill] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  const handleAddDrill = async (e) => {
    e.preventDefault();
    const form = e.target;
    await supabase.from("drills").insert([{
      name: form.drillName.value,
      video_url: form.videoUrl.value,
      category: form.category.value,
      duration: parseInt(form.duration.value),
      notes: form.notes.value
    }]);
    setShowDrill(false);
  };

  if (loading) return <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24}}>Loading...</div>;
  if (!user) return <LoginScreen onLogin={setUser} />;
  if (!hasTeam) return <CreateTeam user={user} onCreated={() => setHasTeam(true)} />;

  return (
    <div style={{background: "#f4f6f9", minHeight: "100vh"}}>
      <div style={{padding: 16, background: "white", borderBottom: "3px solid #e3b440", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h1 style={{fontFamily: "'Oswald', sans-serif", fontSize: 20}}>⚾ PracticePro</h1>
        <button onClick={() => setShowDrill(!showDrill)} style={{padding: "8px 16px", background: "#5f8db5", color: "white", border: "none", borderRadius: 8}}>+ Add Drill</button>
      </div>
      
      {showDrill && (
        <div style={{margin: 20, padding: 20, background: "white", borderRadius: 12}}>
          <h2>Add Drill</h2>
          <form onSubmit={handleAddDrill}>
            <input name="videoUrl" placeholder="Video URL" required style={{width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd"}} />
            <input name="drillName" placeholder="Drill Name" required style={{width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd"}} />
            <select name="category" style={{width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd"}}>
              <option>Hitting</option><option>Fielding</option><option>Throwing</option><option>Running</option>
            </select>
            <select name="duration" style={{width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd"}}>
              <option value="10">10 min</option><option value="15">15 min</option><option value="20">20 min</option><option value="30">30 min</option>
            </select>
            <textarea name="notes" placeholder="Notes" rows={3} style={{width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd"}} />
            <button type="submit" style={{padding: "10px 20px", background: "#5f8db5", color: "white", border: "none", borderRadius: 8}}>Save Drill</button>
          </form>
        </div>
      )}
      
      <PracticePlanner user={user} onLogout={() => setUser(null)} />
    </div>
  );
}
