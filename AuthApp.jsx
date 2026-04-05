import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import PracticePlanner from "./PracticePlanner.jsx";

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(SB_URL, SB_KEY);

const P = {
  steel:"#5f8db5", steelDim:"rgba(95,141,181,0.12)", steelLight:"rgba(95,141,181,0.08)",
  gold:"#e3b440", goldDim:"rgba(227,180,64,0.15)", goldBorder:"rgba(227,180,64,0.35)",
  black:"#111111", text:"#1a2535", textMuted:"#7a92a8", textDim:"#a0b4c4",
  bg:"#f4f6f9", surface:"#ffffff", border:"#dde3eb", inputBg:"#f4f6f9",
  danger:"#e05252", success:"#3dba7a",
};

const AUTH_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Oswald:wght@600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:${P.bg};font-family:'Nunito',sans-serif;color:${P.text};min-height:100vh;}
.auth-wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;}
.auth-card{background:${P.surface};border-radius:20px;border:1.5px solid ${P.border};padding:32px 28px;width:100%;max-width:400px;}
.auth-logo{width:72px;height:72px;object-fit:contain;margin:0 auto 8px;display:block;}
.auth-brand{font-family:'Oswald',sans-serif;font-size:28px;font-weight:700;color:${P.black};text-align:center;line-height:1;}
.auth-tagline{font-size:12px;color:${P.steel};text-transform:uppercase;letter-spacing:2px;font-weight:800;text-align:center;margin-top:4px;margin-bottom:28px;}
.auth-title{font-family:'Oswald',sans-serif;font-size:20px;font-weight:700;color:${P.black};margin-bottom:20px;}
.auth-field{margin-bottom:14px;}
.auth-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:${P.textDim};display:block;margin-bottom:5px;}
.auth-input{width:100%;padding:11px 13px;background:${P.inputBg};border:1.5px solid ${P.border};border-radius:9px;font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;color:${P.text};transition:border-color 0.15s;}
.auth-input:focus{outline:none;border-color:${P.steel};box-shadow:0 0 0 3px ${P.steelDim};}
.auth-input::placeholder{color:${P.textDim};font-weight:600;}
.auth-btn{width:100%;padding:13px;background:${P.steel};color:#fff;border:none;border-radius:12px;font-family:'Oswald',sans-serif;font-size:16px;font-weight:700;cursor:pointer;transition:opacity 0.15s;margin-top:4px;}
.auth-btn:hover{opacity:0.88;}
.auth-btn:disabled{opacity:0.5;cursor:not-allowed;}
.auth-switch{text-align:center;margin-top:18px;font-size:13px;color:${P.textMuted};font-weight:600;}
.auth-switch span{color:${P.steel};font-weight:800;cursor:pointer;}
.auth-switch span:hover{text-decoration:underline;}
.auth-error{background:rgba(224,82,82,0.08);border:1.5px solid rgba(224,82,82,0.3);border-radius:8px;padding:10px 13px;font-size:12px;color:${P.danger};font-weight:700;margin-bottom:14px;}
.auth-divider{height:1.5px;background:${P.border};margin:20px 0;}
.onboard-step{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:${P.steel};margin-bottom:4px;}
.onboard-hint{font-size:12px;color:${P.textMuted};font-weight:600;margin-bottom:20px;line-height:1.5;}
.skip-btn{width:100%;padding:11px;background:transparent;color:${P.textMuted};border:1.5px solid ${P.border};border-radius:12px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;cursor:pointer;margin-top:10px;transition:all 0.15s;}
.skip-btn:hover{border-color:${P.steel};color:${P.steel};}
.logo-upload{border:2px dashed ${P.border};border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:all 0.15s;margin-bottom:14px;}
.logo-upload:hover{border-color:${P.steel};background:${P.steelLight};}
.logo-upload-img{width:72px;height:72px;object-fit:contain;border-radius:10px;margin:0 auto 8px;display:block;}
.logo-upload-text{font-size:12px;font-weight:700;color:${P.textMuted};}
.logo-upload-sub{font-size:11px;color:${P.textDim};margin-top:3px;}
.roster-hint{font-size:11px;color:${P.textDim};font-weight:600;margin-top:6px;line-height:1.6;}
.age-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;}
.age-btn{padding:10px 8px;border-radius:9px;border:1.5px solid ${P.border};background:${P.inputBg};cursor:pointer;font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;color:${P.textMuted};text-align:center;transition:all 0.15s;}
.age-btn:hover{border-color:${P.steel};color:${P.steel};}
.age-btn.sel{background:${P.steel};border-color:${P.steel};color:#fff;}
`;

function injectCSS() {
  let el = document.getElementById("auth-css");
  if (!el) { el = document.createElement("style"); el.id = "auth-css"; document.head.appendChild(el); }
  el.textContent = AUTH_CSS;
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <img src="/KMBA-Panthers-Logo_U8_Tier_1.png" alt="PracticePro" className="auth-logo"/>
        <div className="auth-brand">PracticePro</div>
        <div className="auth-tagline">Baseball Practice Planner</div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" placeholder="coach@yourteam.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"/>
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"/>
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <div className="auth-switch">Don't have an account? <span onClick={() => onSwitch("signup")}>Sign up free</span></div>
      </div>
    </div>
  );
}

// ─── Signup Screen ────────────────────────────────────────────────────────────
function SignupScreen({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords don't match");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true); setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <img src="/KMBA-Panthers-Logo_U8_Tier_1.png" alt="PracticePro" className="auth-logo"/>
        <div className="auth-brand">PracticePro</div>
        <div className="auth-tagline">Create your free account</div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSignup}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" placeholder="coach@yourteam.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"/>
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password"/>
          </div>
          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <input className="auth-input" type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password"/>
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create Free Account"}</button>
        </form>
        <div className="auth-switch">Already have an account? <span onClick={() => onSwitch("login")}>Sign in</span></div>
      </div>
    </div>
  );
}

// ─── Onboarding Step 1: Team Info ─────────────────────────────────────────────
function OnboardTeam({ userId, onNext }) {
  const [teamName, setTeamName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [season, setSeason] = useState("2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const AGE_GROUPS = ["U7","U8","U9","U10","U11","U12","U13","U14","U15","U16","U17","U18"];

  async function handleNext(e) {
    e.preventDefault();
    if (!teamName.trim()) return setError("Please enter your team name");
    if (!ageGroup) return setError("Please select an age group");
    setLoading(true); setError("");
    const { data, error } = await supabase.from("teams").insert([{
      user_id: userId, team_name: teamName.trim(), coach_name: coachName.trim(),
      age_group: ageGroup, season: season.trim(), logo_url: null, roster: []
    }]).select().single();
    if (error) { setError(error.message); setLoading(false); return; }
    onNext(data);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="onboard-step">Step 1 of 3 — Team Info</div>
        <div className="auth-brand" style={{textAlign:"left",fontSize:22,marginBottom:4}}>Tell us about your team</div>
        <div className="onboard-hint">This is how your app will be personalised.</div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleNext}>
          <div className="auth-field">
            <label className="auth-label">Team Name</label>
            <input className="auth-input" placeholder="e.g. Panthers, Eagles, Trojans" value={teamName} onChange={e => setTeamName(e.target.value)} required/>
          </div>
          <div className="auth-field">
            <label className="auth-label">Your Name</label>
            <input className="auth-input" placeholder="e.g. Jay Mielke" value={coachName} onChange={e => setCoachName(e.target.value)}/>
          </div>
          <div className="auth-field">
            <label className="auth-label">Age Group</label>
            <div className="age-grid">
              {AGE_GROUPS.map(a => (
                <button key={a} type="button" className={`age-btn${ageGroup===a?" sel":""}`} onClick={() => setAgeGroup(a)}>{a}</button>
              ))}
            </div>
          </div>
          <div className="auth-field">
            <label className="auth-label">Season Year</label>
            <input className="auth-input" placeholder="e.g. 2026" value={season} onChange={e => setSeason(e.target.value)}/>
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>{loading ? "Saving..." : "Continue →"}</button>
        </form>
      </div>
    </div>
  );
}

// ─── Onboarding Step 2: Logo ───────────────────────────────────────────────────
function OnboardLogo({ team, onNext, onSkip }) {
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) return setError("Image must be under 2MB");
    setLogoFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  }

  async function handleUpload() {
    if (!logoFile) return onSkip();
    setLoading(true); setError("");
    const ext = logoFile.name.split(".").pop();
    const path = `${team.id}.${ext}`;
    const { error: upErr } = await supabase.storage.from("logos").upload(path, logoFile, { upsert: true });
    if (upErr) { setError(upErr.message); setLoading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(path);
    const { error: upTeam } = await supabase.from("teams").update({ logo_url: publicUrl }).eq("id", team.id);
    if (upTeam) { setError(upTeam.message); setLoading(false); return; }
    onNext({ ...team, logo_url: publicUrl });
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="onboard-step">Step 2 of 3 — Team Logo</div>
        <div className="auth-brand" style={{textAlign:"left",fontSize:22,marginBottom:4}}>Upload your logo</div>
        <div className="onboard-hint">PNG or JPG, under 2MB. You can always change this later.</div>
        {error && <div className="auth-error">{error}</div>}
        {preview && (
          <div style={{textAlign:"center",marginBottom:14}}>
            <img src={preview} alt="Logo preview" style={{width:90,height:90,objectFit:"contain",borderRadius:12,border:`1.5px solid ${P.border}`}}/>
          </div>
        )}
        <label style={{display:"block",width:"100%",padding:"11px 20px",background:P.inputBg,border:`1.5px solid ${P.border}`,borderRadius:12,fontFamily:"'Nunito',sans-serif",fontSize:14,fontWeight:800,color:P.steel,textAlign:"center",cursor:"pointer",marginBottom:14}}>
          {preview ? "Change Logo" : "Choose Logo File"}
          <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleFile} style={{display:"none"}}/>
        </label>
        <button className="auth-btn" onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : preview ? "Save Logo →" : "Skip for now →"}
        </button>
        {preview && <button className="skip-btn" onClick={onSkip}>Skip for now</button>}
      </div>
    </div>
  );
}

// ─── Onboarding Step 3: Roster ────────────────────────────────────────────────
function OnboardRoster({ team, onDone }) {
  const [rosterText, setRosterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function parseRoster(text) {
    return text.split("\n").filter(l => l.trim()).map((line, i) => {
      const parts = line.split(",").map(p => p.trim());
      const jersey = parseInt(parts[0]);
      return {
        id: `p${parts[0]?.replace(/\s/g,"")}`,
        jersey: isNaN(jersey) ? i + 1 : jersey,
        first: parts[1] || "",
        last: parts[2] || ""
      };
    }).filter(p => p.first);
  }

  async function handleSave() {
    setLoading(true); setError("");
    const roster = rosterText.trim() ? parseRoster(rosterText) : [];
    const { error } = await supabase.from("teams").update({ roster }).eq("id", team.id);
    if (error) { setError(error.message); setLoading(false); return; }
    onDone({ ...team, roster });
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="onboard-step">Step 3 of 3 — Roster</div>
        <div className="auth-brand" style={{textAlign:"left",fontSize:22,marginBottom:4}}>Add your players</div>
        <div className="onboard-hint">One player per line. You can edit this anytime in Settings.</div>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-field">
          <label className="auth-label">Roster</label>
          <textarea
            className="auth-input" rows={8}
            style={{resize:"vertical",lineHeight:1.7}}
            placeholder={"25, Lawson, Buck\n6, Ethan, Deitner\n7, Ryker, Falconer"}
            value={rosterText}
            onChange={e => setRosterText(e.target.value)}
          />
          <div className="roster-hint">Format: Jersey #, First Name, Last Name</div>
        </div>
        <button className="auth-btn" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Go to App →"}
        </button>
        <button className="skip-btn" onClick={() => onDone({ ...team, roster: [] })}>Skip — I'll add players later</button>
      </div>
    </div>
  );
}

// ─── Main AuthApp ─────────────────────────────────────────────────────────────
export default function AuthApp() {
  const [screen, setScreen] = useState("login");
  const [session, setSession] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardStep, setOnboardStep] = useState(1);
  const [pendingTeam, setPendingTeam] = useState(null);

  useEffect(() => { injectCSS(); }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadTeam(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadTeam(session.user.id);
      else { setTeam(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadTeam(userId) {
    setLoading(true);
    const { data } = await supabase.from("teams").select("*").eq("user_id", userId).order("created_at", { ascending: true }).limit(1).single();
    setTeam(data || null);
    setLoading(false);
  }

  function handleSignOut() {
    supabase.auth.signOut();
  }

  // Loading spinner
  if (loading) return (
    <div style={{minHeight:"100vh",background:P.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <img src="/KMBA-Panthers-Logo_U8_Tier_1.png" alt="PracticePro" style={{width:72,height:72,objectFit:"contain",animation:"pp-spin 2s linear infinite"}}/>
      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:16,color:P.steel,letterSpacing:1,fontWeight:700}}>Loading...</div>
      <style>{`@keyframes pp-spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>
    </div>
  );

  // Not logged in — show login or signup
  if (!session) {
    if (screen === "signup") return <SignupScreen onSwitch={setScreen}/>;
    return <LoginScreen onSwitch={setScreen}/>;
  }

  // Logged in but no team — show onboarding
  if (!team) {
    if (onboardStep === 1) return (
      <OnboardTeam userId={session.user.id} onNext={t => { setPendingTeam(t); setOnboardStep(2); }}/>
    );
    if (onboardStep === 2) return (
      <OnboardLogo team={pendingTeam} onNext={t => { setPendingTeam(t); setOnboardStep(3); }} onSkip={() => setOnboardStep(3)}/>
    );
    if (onboardStep === 3) return (
      <OnboardRoster team={pendingTeam} onDone={t => setTeam(t)}/>
    );
  }

  // Fully set up — show the app
  return <PracticePlanner user={session.user} team={team} onTeamUpdate={setTeam} onSignOut={handleSignOut}/>;
}
