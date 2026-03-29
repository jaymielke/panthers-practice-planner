import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import PracticePlanner from "./PracticePlanner.jsx";

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(SB_URL, SB_KEY);
const APP_URL = "https://panthers-practice-planner.vercel.app";

if (typeof window !== "undefined" && window.location.search.includes("share=")) {
  window.location.href = APP_URL;
}

// --- CREATE TEAM COMPONENT ---
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
      // Parse players from pasted text (format: jersey, first, last)
      const players = [];
      const lines = playersText.trim().split("\n");
      lines.forEach((line, index) => {
        const parts = line.split(",").map(p => p.trim());
        if (parts.length >= 3) {
          players.push({
            id: "p" + (index + 1),
            jersey: parts[0],
            first: parts[1],
            last: parts[2]
          });
        }
      });

      const teamData = {
        user_id: user.id,
        team_name: teamName,
        season: season,
        players: players,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase.from("teams").insert([teamData]);
      if (error) throw error;
      
      onTeamCreated(teamData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: "100vh", background: "#f4f6f9", padding: 20}}>
      <div style={{background: "white", padding: 30, borderRadius: 16, maxWidth: 500, margin: "0 auto"}}>
        <h1 style={{fontFamily: "'Oswald', sans-serif", fontSize: 24, marginBottom: 20}}>Create Your Team</h1>
        
        <form onSubmit={handleCreateTeam}>
          <div style={{marginBottom: 16}}>
            <label style={{display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase"}}>Team Name</label>
            <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required placeholder="e.g., Kitchener Panthers" style={{width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 16, background: "#f4f6f9"}} />
          </div>
          
          <div style={{marginBottom: 16}}>
            <label style={{display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase"}}>Season/Year</label>
            <input type="text" value={season} onChange={(e) => setSeason(e.target.value)} required placeholder="e.g., 2026 Spring" style={{width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 16, background: "#f4f6f9"}} />
          </div>
          
          <div style={{marginBottom: 16}}>
            <label style={{display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase"}}>Players (paste from spreadsheet)</label>
            <textarea value={playersText} onChange={(e) => setPlayersText(e.target.value)} placeholder="Format: jersey, first name, last name&#10;25, Lawson, Buck&#10;67, Miles, Bell" rows={6} style={{width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 14, background: "#f4f6f9", fontFamily: "monospace"}} />
            <p style={{fontSize: 11, color: "#999", marginTop: 4}}>One player per line, comma separated</p>
          </div>
          
          {error && <div style={{background: "#fee", color: "#c00", padding: 12, borderRadius: 8, marginBottom: 16}}>{error}</div>}
          
          <button type="submit" disabled={loading} style={{width: "100%", padding: 14, background: loading ? "#ccc" : "#5f8db5", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer"}}>
            {loading ? "Creating..." : "Create Team"}
          </button>
        </form>
      </div>
    </div>
  );
}
// --- LOGIN SCREEN ---
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Check your email for confirmation link!");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin(data.user);
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: APP_URL });
      if (error) throw error;
      setForgotSent(true);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (showForgot) {
    return (
      <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9", padding: 20}}>
        <div style={{background: "white", padding: 40, borderRadius: 16, width: "100%", maxWidth: 400}}>
          <h1 style={{fontFamily: "'Oswald', sans-serif", fontSize: 24}}>Reset Password</h1>
          <p style={{color: "#7a92a8", marginBottom: 20}}>Enter your email and we'll send you a reset link.</p>
          <form onSubmit={handleForgotPassword}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" style={{width: "100%", padding: "12px", borderRadius: 8, border: "1.5px solid #dde3eb", marginBottom: 16}} />
            {error && <div style={{background: "#fee", color: "#c00", padding: 12, borderRadius: 8, marginBottom: 16}}>{error}</div>}
            <button type="submit" disabled={loading} style={{width: "100%", padding: 14, background: "#5f8db5", color: "white", border: "none", borderRadius: 8, fontWeight: 700}}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <button onClick={() => setShowForgot(false)} style={{marginTop: 16, background: "none", border: "none", color: "#5f8db5", cursor: "pointer"}}>Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9", padding: 20}}>
      <div style={{background: "white", padding: 40, borderRadius: 16, width: "100%", maxWidth: 400, boxShadow: "0 4px 20px rgba(0,0,0,0.1)"}}>
        <h1 style={{fontFamily: "'Oswald', sans-serif", fontSize: 28, color: "#111", marginBottom: 8, textAlign: "center"}}>⚾ PracticePro</h1>
        <p style={{color: "#7a92a8", textAlign: "center", marginBottom: 30}}>{isSignUp ? "Create your account" : "Sign in to your account"}</p>
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" style={{width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 16, background: "#f4f6f9", marginBottom: 16}} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Password" style={{width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 16, background: "#f4f6f9", marginBottom: 24}} />
          {error && <div style={{background: "#fee", color: "#c00", padding: 12, borderRadius: 8, marginBottom: 16}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width: "100%", padding: 14, background: "#5f8db5", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer"}}>
            {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}
          </button>
        </form>
        {!isSignUp && <button onClick={() => setShowForgot(true)} style={{background: "none", border: "none", color: "#5f8db5", fontWeight: 700, cursor: "pointer", marginTop: 12, display: "block", width: "100%"}}>Forgot Password?</button>}
        <p style={{textAlign: "center", fontSize: 14, color: "#7a92a8", marginTop: 20}}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"} <button onClick={() => setIsSignUp(!isSignUp)} style={{background: "none", border: "none", color: "#5f8db5", fontWeight: 700, cursor: "pointer"}}>{isSignUp ? "Sign In" : "Sign Up"}</button>
        </p>
      </div>
    </div>
  );
}

// --- MAIN APP ---
export default function AuthApp() {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.location.search.includes("share=")) {
      window.history.replaceState({}, "", APP_URL);
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setTeam(null); };

  if (loading) return <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9"}}><p>Loading...</p></div>;
  if (!user) return <LoginScreen onLogin={(u) => setUser(u)} />;
  if (!team) return <CreateTeam user={user} onTeamCreated={(t) => setTeam(t)} />;

  return <PracticePlanner user={user} team={team} onLogout={handleLogout} />;
}
