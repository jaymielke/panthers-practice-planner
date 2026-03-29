import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import PracticePlanner from "./PracticePlanner.jsx";

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(SB_URL, SB_KEY);
const APP_URL = "https://panthers-practice-planner.vercel.app";

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
      if (isSignUp) { const { error } = await supabase.auth.signUp({ email, password }); if (error) throw error; alert("Check your email!"); }
      else { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; onLogin({ id: "test", email: email }); }
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
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" style={{width: "100%", padding: 12, borderRadius: 8, border: "1.5px solid #dde3eb", marginBottom: 24}} />
          {error && <div style={{background: "#fee", color: "#c00", padding: 12, borderRadius: 8, marginBottom: 16}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width: "100%", padding: 14, background: "#5f8db5", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700}}>{loading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}</button>
        </form>
        <p style={{textAlign: "center", marginTop: 20}}><button onClick={() => onLogin({ id: "test-user" })} style={{background: "#ddd", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer"}}>🔧 SKIP LOGIN</button></p>
      </div>
    </div>
  );
}

function CreateTeam({ user, onCreated }) {
  const [teamName, setTeamName] = useState("");
  const [season, setSeason] = useState("");
  const [playersText, setPlayersText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const players = [];
      const lines = playersText.trim().split("\n");
      lines.forEach((line, i) => { const p = line.split(","); if (p[0]) players.push({ id: "p"+(i+1), jersey: p[0]?.trim(), first: p[1]?.trim(), last: p[2]?.trim() }); });
      await supabase.from("teams").insert([{ user_id: user.id, team_name: teamName, season, players, created_at: new Date().toISOString() }]);
      onCreated();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{minHeight: "100vh", background: "#f4f6f9", padding: 20}}>
      <div style={{background: "white", padding: 30, borderRadius: 16, maxWidth: 500, margin: "0 auto"}}>
        <h1 style={{fontFamily: "'Oswald', sans-serif", fontSize: 24, marginBottom: 20}}>Create Your Team</h1>
        <form onSubmit={handleSave}>
          <div style={{marginBottom: 16}}><label style={{display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase"}}>Team Name</label><input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} required placeholder="Panthers" style={{width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb"}}/></div>
          <div style={{marginBottom: 16}}><label style={{display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase"}}>Season</label><input type="text" value={season} onChange={e => setSeason(e.target.value)} required placeholder="2026 Spring" style={{width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb"}}/></div>
          <div style={{marginBottom: 16}}><label style={{display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase"}}>Players (jersey,first,last)</label><textarea rows={5} value={playersText} onChange={e => setPlayersText(e.target.value)} placeholder="25,Lawson,Buck&#10;67,Miles,Bell" style={{width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb"}}/></div>
          {error && <div style={{background: "#fee", color: "#c00", padding: 12, borderRadius: 8, marginBottom: 16}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width: "100%", padding: 14, background: "#5f8db5", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700}}>{loading ? "Saving..." : "Save Team"}</button>
        </form>
      </div>
    </div>
  );
}

export default function AuthApp() {
  const [user, setUser] = useState(null);
  const [teamCreated, setTeamCreated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? {id:"test"}); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? {id:"test"}));
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}>Loading...</div>;
  if (!user) return <LoginScreen onLogin={u => setUser(u)} />;
  if (!teamCreated) return <CreateTeam user={user} onCreated={() => setTeamCreated(true)} />;

  return <PracticePlanner user={user} onLogout={() => setUser(null)} />;
}
