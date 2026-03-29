import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import PracticePlanner from "./PracticePlanner.jsx";

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(SB_URL, SB_KEY);

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

  return (
    <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9", padding: 20}}>
      <div style={{background: "white", padding: 40, borderRadius: 16, width: "100%", maxWidth: 400, boxShadow: "0 4px 20px rgba(0,0,0,0.1)"}}>
        <h1 style={{fontFamily: "'Oswald', sans-serif", fontSize: 28, color: "#111", marginBottom: 8, textAlign: "center"}}>⚾ PracticePro</h1>
        <p style={{color: "#7a92a8", textAlign: "center", marginBottom: 30}}>{isSignUp ? "Create your account" : "Sign in to your account"}</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: 16}}>
            <label style={{display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase"}}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 16, background: "#f4f6f9"}} />
          </div>
          <div style={{marginBottom: 24}}>
            <label style={{display: "block", marginBottom: 6, fontSize: 12, fontWeight: 800, color: "#7a92a8", textTransform: "uppercase"}}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={{width: "100%", padding: "12px 16px", borderRadius: 8, border: "1.5px solid #dde3eb", fontSize: 16, background: "#f4f6f9"}} />
          </div>
          {error && <div style={{background: "#fee", color: "#c00", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width: "100%", padding: 14, background: loading ? "#ccc" : "#5f8db5", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginBottom: 16}}>
            {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}
          </button>
        </form>
        <p style={{textAlign: "center", fontSize: 14, color: "#7a92a8"}}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"} <button type="button" onClick={() => setIsSignUp(!isSignUp)} style={{background: "none", border: "none", color: "#5f8db5", fontWeight: 700, cursor: "pointer"}}>{isSignUp ? "Sign In" : "Sign Up"}</button>
        </p>
      </div>
    </div>
  );
}

export default function AuthApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); };

  if (loading) return <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9"}}><p>Loading...</p></div>;
  if (!user) return <LoginScreen onLogin={(u) => setUser(u)} />;

  // After login, show the ORIGINAL app
  return <PracticePlanner user={user} onLogout={handleLogout} />;
}
