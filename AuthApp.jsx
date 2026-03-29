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

  // First clear any share params from URL
  useEffect(() => {
    if (window.location.search.includes("share=")) {
      window.history.replaceState({}, "", APP_URL);
    }
  }, []);

  if (showForgot) {
    if (forgotSent) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9", padding: 20 }}>
          <div style={{ background: "white", padding: 40, borderRadius: 16, width: "100%", maxWidth: 400, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "#111", marginBottom: 8, textAlign: "center" }}>Check Your Email</h1>
            <p style={{ color: "#7a92a8", textAlign: "center" }}>We sent a password reset link to your email.</p>
            <button onClick={() => { setShowForgot(false); setForgotSent(false); }} style={{ marginTop: 20, width: "100%", padding: 14, background: "#5f8db5", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Back to Login</button>
          </div>
        </div>
      );
    }
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9", padding: 20 }}>
        <div style={{ background: "white", padding: 40, borderRadius: 16, width: "100%", maxWidth: 400, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "#111", marginBottom: 8, textAlign: "center" }}>Reset Password</h1>
          <p style={{ color: "#7a92a8", textAlign: "center", marginBottom: 30 }}>Enter your email and we'll send you a reset link.</p>
          <form onSubmit={handleForgotPassword}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase" }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 16, background: "#f4f6f9" }} />
            </div>
            {error && <div style={{ background: "#fee", color: "#c00", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, background: loading ? "#ccc" : "#5f8db5", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Sending..." : "Send Reset Link"}</button>
          </form>
          <p style={{ textAlign: "center", fontSize: 14, color: "#7a92a8", marginTop: 16 }}>
            <button onClick={() => setShowForgot(false)} style={{ background: "none", border: "none", color: "#5f8db5", fontWeight: 700, cursor: "pointer" }}>Back to Login</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9", padding: 20 }}>
      <div style={{ background: "white", padding: 40, borderRadius: 16, width: "100%", maxWidth: 400, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, color: "#111", marginBottom: 8, textAlign: "center" }}>⚾ PracticePro</h1>
        <p style={{ color: "#7a92a8", textAlign: "center", marginBottom: 30 }}>{isSignUp ? "Create your account" : "Sign in to your account"}</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 16, background: "#f4f6f9" }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase" }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 16, background: "#f4f6f9" }} />
          </div>
          {error && <div style={{ background: "#fee", color: "#c00", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, background: loading ? "#ccc" : "#5f8db5", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginBottom: 16 }}>{loading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}</button>
        </form>
        {!isSignUp && (
          <p style={{ textAlign: "center", fontSize: 14, color: "#7a92a8", marginBottom: 8 }}>
            <button onClick={() => setShowForgot(true)} style={{ background: "none", border: "none", color: "#5f8db5", fontWeight: 700, cursor: "pointer" }}>Forgot Password?</button>
          </p>
        )}
        <p style={{ textAlign: "center", fontSize: 14, color: "#7a92a8" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"} <button type="button" onClick={() => setIsSignUp(!isSignUp)} style={{ background: "none", border: "none", color: "#5f8db5", fontWeight: 700, cursor: "pointer" }}>{isSignUp ? "Sign In" : "Sign Up"}</button>
        </p>
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

  const parsePlayers = () => {
    const lines = playersText.split('\n').filter(l => l.trim() !== "");
    return lines.map(line => {
      const parts = line.split(',').map(p => p.trim());
      const [jersey, first_name, last_name] = parts;
      return { jersey, first_name, last_name };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const players = parsePlayers();
      const { error } = await supabase.from('teams').insert([
        {
          user_id: user.id,
          team_name: teamName,
          season,
          players,
          created_at: new Date().toISOString()
        }
      ]);
      if (error) throw error;
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9", padding: 20 }}>
      <div style={{ background: "white", padding: 40, borderRadius: 16, width: "100%", maxWidth: 500, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 24, color: "#111", marginBottom: 8, textAlign: "center" }}>Create Team</h1>
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase" }}>Team Name</label>
            <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} required style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 16, background: "#f4f6f9" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase" }}>Season / Year</label>
            <input type="text" value={season} onChange={e => setSeason(e.target.value)} required style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 16, background: "#f4f6f9" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase" }}>Add Players (paste rows: jersey, first, last)</label>
            <textarea rows={6} value={playersText} onChange={e => setPlayersText(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 14, background: "#f4f6f9", resize: "vertical" }} />
          </div>
          {error && <div style={{ background: "#fee", color: "#c00", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, background: loading ? "#ccc" : "#5f8db5", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Saving..." : "Save Team"}</button>
        </form>
      </div>
    </div>
  );
}

export default function AuthApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamCreated, setTeamCreated] = useState(null); // null = loading, false = no team, true = has team

  // Check for existing team on load
  useEffect(() => {
    if (!user?.id) return;
    supabase.from('teams').select('*').eq('user_id', user.id).limit(1).then(({ data }) => {
      if (data && data.length > 0) setTeamCreated(true);
      else setTeamCreated(false);
    });
  }, [user]);

  useEffect(() => {
    // Clear the share param on load
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9" }}><p>Loading...</p></div>;
  if (!user) return <LoginScreen onLogin={(u) => setUser(u)} />;
  if (teamCreated === null) return <div style={{padding:50, textAlign:"center"}}>Loading...</div> <CreateTeam user={user} onCreated={() => setTeamCreated(true)} />;

  // Drill form state
  const [showDrillForm, setShowDrillForm] = useState(false);
  const [drillLoading, setDrillLoading] = useState(false);
  const [drillError, setDrillError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [drillName, setDrillName] = useState("");
  const [category, setCategory] = useState("Hitting");
  const [duration, setDuration] = useState(10);
  const [notes, setNotes] = useState("");

  const handleSaveDrill = async (e) => {
    e.preventDefault();
    setDrillLoading(true);
    setDrillError("");
    try {
      const { error } = await supabase.from('drills').insert([
        {
          name: drillName,
          video_url: videoUrl,
          category,
          duration,
          notes,
          // optionally add user reference if needed
        }
      ]);
      if (error) throw error;
      // clear form
      setVideoUrl("");
      setDrillName("");
      setCategory("Hitting");
      setDuration(10);
      setNotes("");
      setShowDrillForm(false);
    } catch (err) {
      setDrillError(err.message);
    } finally {
      setDrillLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", background: "#f4f6f9", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 800, marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => setShowDrillForm(true)} style={{ padding: "10px 20px", background: "#5f8db5", color: "white", border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" }}>Add Drill</button>
      </div>
      {showDrillForm && (
        <div style={{ background: "white", padding: 30, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "100%", maxWidth: 600, marginTop: 20 }}>
          <h2 style={{ marginBottom: 20, color: "#111" }}>Add Drill</h2>
          {drillError && <div style={{ background: "#fee", color: "#c00", padding: 12, borderRadius: 8, marginBottom: 16 }}>{drillError}</div>}
          <form onSubmit={handleSaveDrill}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4 }}>Video URL</label>
              <input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} required style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4 }}>Drill Name</label>
              <input type="text" value={drillName} onChange={e => setDrillName(e.target.value)} required style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4 }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}>
                <option>Hitting</option>
                <option>Fielding</option>
                <option>Throwing</option>
                <option>Running</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4 }}>Duration (min)</label>
              <select value={duration} onChange={e => setDuration(parseInt(e.target.value))} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 4 }}>Notes</label>
              <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }} />
            </div>
            <button type="submit" disabled={drillLoading} style={{ padding: "10px 20px", background: drillLoading ? "#ccc" : "#5f8db5", color: "white", border: "none", borderRadius: 8, cursor: drillLoading ? "not-allowed" : "pointer" }}>{drillLoading ? "Saving..." : "Save Drill"}</button>
            <button type="button" onClick={() => setShowDrillForm(false)} style={{ marginLeft: 10, padding: "10px 20px", background: "#ddd", color: "#333", border: "none", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
          </form>
        </div>
      )}
      <PracticePlanner user={user} onLogout={handleLogout} />
    </div>
  );
}
