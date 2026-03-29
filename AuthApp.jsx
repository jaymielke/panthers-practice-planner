import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import PracticePlanner from "./PracticePlanner.jsx";

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(SB_URL, SB_KEY);
const APP_URL = "https://panthers-practice-planner.vercel.app";

function CreateTeam({ user, onTeamCreated }) {
  const [teamName, setTeamName] = useState("");
  const [season, setSeason] = useState("");
  const [playersText, setPlayersText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const players = [];
      const lines = playersText.trim().split("\n");
      lines.forEach((line, index) => {
        const parts = line.split(",").map(p => p.trim());
        if (parts.length >= 3) {
          players.push({ id: "p" + (index + 1), jersey: parts[0], first: parts[1], last: parts[2] });
        }
      });
      const teamData = { user_id: user.id, team_name: teamName, season: season, players: players, created_at: new Date().toISOString() };
      const { data, error } = await supabase.from("teams").insert([teamData]);
      if (error) throw error;
      onTeamCreated(teamData);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{minHeight: "100vh", background: "#f4f6f9", padding: 20}}>
      <div style={{background: "white", padding: 30, borderRadius: 16, maxWidth: 500, margin: "0 auto"}}>
        <h1 style={{fontFamily: "'Oswald', sans-serif", fontSize: 24, marginBottom: 20}}>Create Your Team</h1>
        <form onSubmit={handleCreateTeam}>
          <div style={{marginBottom: 16}}><label style={{display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase"}}>Team Name</label><input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required placeholder="e.g., Panthers" style={{width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 16, background: "#f4f6f9"}}/></div>
          <div style={{marginBottom: 16}}><label style={{display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase"}}>Season/Year</label><input type="text" value={season} onChange={(e) => setSeason(e.target.value)} required placeholder="e.g., 2026 Spring" style={{width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 16, background: "#f4f6f9"}}/></div>
          <div style={{marginBottom: 16}}><label style={{display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase"}}>Players (paste from spreadsheet)</label><textarea value={playersText} onChange={(e) => setPlayersText(e.target.value)} placeholder="25, Lawson, Buck&#10;67, Miles, Bell" rows={6} style={{width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 14, background: "#f4f6f9"}}/></div>
          {error && <div style={{background: "#fee", color: "#c00", padding: 12, borderRadius: 8, marginBottom: 16}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width: "100%", padding: 14, background: "#5f8db5", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700}}>{loading ? "Creating..." : "Create Team"}</button>
        </form>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isSignUp) { const { data, error } = await supabase.auth.signUp({ email, password }); if (error) throw error; alert("Check your email!"); }
      else { const { data, error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; onLogin(data.user); }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9", padding: 20}}>
      <div style={{background: "white", padding: 40, borderRadius: 16, width: "100%", maxWidth: 400}}>
        <h1 style={{fontFamily: "'Oswald', sans-serif", fontSize: 28, textAlign: "center"}}>⚾ PracticePro</h1>
        <p style={{color: "#7a92a8", textAlign: "center", marginBottom: 30}}>{isSignUp ? "Create account" : "Sign in"}</p>
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" style={{width: "100%", padding: 12, borderRadius: 8, border: "1.5px solid #dde3eb", marginBottom: 16}} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Password" style={{width: "100%", padding: 12, borderRadius: 8, border: "1.5px solid #dde3eb", marginBottom: 24}} />
          {error && <div style={{background: "#fee", color: "#c00", padding: 12, borderRadius: 8, marginBottom: 16}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width: "100%", padding: 14, background: "#5f8db5", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700}}>{loading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}</button>
        </form>
        <p style={{textAlign: "center", marginTop: 20}}><button onClick={() => onLogin({ id: "test-user", email: "test@test.com" })} style={{background: "#ddd", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer"}}>🔧 SKIP LOGIN</button></p>
      </div>
    </div>
  );
}

export default function AuthApp() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); };

  if (loading) return <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}><p>Loading...</p></div>;
  if (!user) return <LoginScreen onLogin={(u) => setUser(u)} />;
  if (!team) return <CreateTeam user={user} onTeamCreated={(t) => setTeam(t)} />;

  return <PracticePlanner user={user} team={team} onLogout={handleLogout} />;
}
