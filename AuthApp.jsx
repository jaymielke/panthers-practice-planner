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

export default function AuthApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple - just check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24}}>Loading...</div>;
  if (!user) return <LoginScreen onLogin={setUser} />;

  return <PracticePlanner user={user} onLogout={() => setUser(null)} />;
}
