import React, { useState, useEffect } from "react";
import { supabase } from "./AuthApp.jsx";

const P = {
  steel:"#5f8db5", steelDim:"rgba(95,141,181,0.12)", steelLight:"rgba(95,141,181,0.08)",
  steelBorder:"rgba(95,141,181,0.35)", gold:"#e3b440", goldDim:"rgba(227,180,64,0.15)",
  goldBorder:"rgba(227,180,64,0.35)", black:"#111111", text:"#1a2535",
  textMuted:"#7a92a8", textDim:"#a0b4c4", bg:"#f4f6f9", surface:"#ffffff",
  border:"#dde3eb", inputBg:"#f4f6f9", danger:"#e05252", success:"#3dba7a",
};

const CAT = {
  "Hitting":      {bg:"rgba(239,107,54,0.1)",  border:"rgba(239,107,54,0.4)",  text:"#d4581e"},
  "Fielding":     {bg:"rgba(59,185,128,0.1)",  border:"rgba(59,185,128,0.4)",  text:"#2a9e6a"},
  "Throwing":     {bg:"rgba(100,149,237,0.1)", border:"rgba(100,149,237,0.4)", text:"#4a7ed4"},
  "Base Running": {bg:"rgba(200,155,0,0.1)",   border:"rgba(200,155,0,0.4)",   text:"#a07800"},
  "Warmup":       {bg:"rgba(147,119,230,0.1)", border:"rgba(147,119,230,0.4)", text:"#7c5ec8"},
  "Catcher":      {bg:"rgba(220,80,105,0.1)",  border:"rgba(220,80,105,0.4)",  text:"#c0405a"},
  "Pitcher":      {bg:"rgba(20,180,210,0.1)",  border:"rgba(20,180,210,0.4)",  text:"#0d8fa8"},
  "Cool Down":    {bg:"rgba(120,145,165,0.1)", border:"rgba(120,145,165,0.4)", text:"#607585"},
};

function CatChip({cat,small=false}){
  const c=CAT[cat]||CAT["Hitting"];
  return<span style={{display:"inline-flex",alignItems:"center",background:c.bg,border:`1px solid ${c.border}`,color:c.text,borderRadius:5,padding:small?"2px 7px":"3px 9px",fontSize:small?11:12,fontWeight:800,whiteSpace:"nowrap",fontFamily:"'Nunito',sans-serif"}}>{cat}</span>;
}

function StarRating({rating, onRate, userRating}){
  const[hover,setHover]=useState(0);
  return(
    <div style={{display:"flex",gap:2}}>
      {[1,2,3,4,5].map(s=>(
        <button key={s} onClick={()=>onRate&&onRate(s)}
          onMouseEnter={()=>onRate&&setHover(s)} onMouseLeave={()=>setHover(0)}
          style={{background:"none",border:"none",cursor:onRate?"pointer":"default",padding:"1px",lineHeight:1}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={(hover||userRating||0)>=s?"#e3b440":"none"} stroke="#e3b440" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function CommunityLibrary({user, userDrills, teamName, onAddDrill, toast}){
  const[drills,setDrills]=useState([]);
  const[ratings,setRatings]=useState({});
  const[loading,setLoading]=useState(true);
  const[catFilter,setCatFilter]=useState("All");
  const[sortBy,setSortBy]=useState("rating");
  const[expanded,setExpanded]=useState(null);
  const[adding,setAdding]=useState(null);

  useEffect(()=>{loadDrills();},[]);

  async function loadDrills(){
    setLoading(true);
    const{data:drillData}=await supabase.from("community_drills").select("*").order("avg_rating",{ascending:false});
    setDrills(drillData||[]);
    if(user&&drillData?.length){
      const{data:ratingData}=await supabase.from("community_ratings").select("drill_id,rating").eq("user_id",user.id);
      const rMap={};(ratingData||[]).forEach(r=>{rMap[r.drill_id]=r.rating;});
      setRatings(rMap);
    }
    setLoading(false);
  }

  async function rateDrill(drillId, rating){
    const prev=ratings[drillId];
    setRatings(r=>({...r,[drillId]:rating}));
    await supabase.from("community_ratings").upsert({user_id:user.id,drill_id:drillId,rating},{onConflict:"user_id,drill_id"});
    // Recalculate avg
    const{data:allRatings}=await supabase.from("community_ratings").select("rating").eq("drill_id",drillId);
    if(allRatings){
      const avg=allRatings.reduce((s,r)=>s+r.rating,0)/allRatings.length;
      await supabase.from("community_drills").update({avg_rating:Math.round(avg*10)/10,rating_count:allRatings.length}).eq("id",drillId);
      setDrills(ds=>ds.map(d=>d.id===drillId?{...d,avg_rating:Math.round(avg*10)/10,rating_count:allRatings.length}:d));
    }
  }

  async function addToMyLibrary(communityDrill){
    setAdding(communityDrill.id);
    const drill={...communityDrill.drill, id:Date.now()};
    await onAddDrill(drill);
    // Increment times_added
    await supabase.from("community_drills").update({times_added:(communityDrill.times_added||0)+1}).eq("id",communityDrill.id);
    setDrills(ds=>ds.map(d=>d.id===communityDrill.id?{...d,times_added:(d.times_added||0)+1}:d));
    setAdding(null);
    toast&&toast.show(`"${communityDrill.drill.name}" added to your library ✓`);
  }

  const alreadyHave=(communityDrill)=>userDrills.some(d=>d.name===communityDrill.drill?.name);

  const filtered=drills
    .filter(d=>catFilter==="All"||(d.drill?.category===catFilter))
    .sort((a,b)=>sortBy==="rating"?(b.avg_rating||0)-(a.avg_rating||0):(b.times_added||0)-(a.times_added||0));

  if(loading) return(
    <div style={{textAlign:"center",padding:"60px 20px",color:P.textDim,fontFamily:"'Nunito',sans-serif",fontWeight:700}}>
      Loading community drills...
    </div>
  );

  return(
    <div style={{paddingBottom:24}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:14}}>
        <div>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:24,fontWeight:700,color:P.black,lineHeight:1}}>Community</div>
          <div style={{fontSize:12,color:P.textMuted,fontWeight:700,marginTop:3}}>{drills.length} drill{drills.length!==1?"s":""} shared by coaches</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setSortBy("rating")} style={{padding:"5px 10px",borderRadius:8,border:`1.5px solid ${sortBy==="rating"?P.steel:P.border}`,background:sortBy==="rating"?P.steelDim:P.inputBg,color:sortBy==="rating"?P.steel:P.textMuted,fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:800,cursor:"pointer"}}>
            ★ Rating
          </button>
          <button onClick={()=>setSortBy("added")} style={{padding:"5px 10px",borderRadius:8,border:`1.5px solid ${sortBy==="added"?P.steel:P.border}`,background:sortBy==="added"?P.steelDim:P.inputBg,color:sortBy==="added"?P.steel:P.textMuted,fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:800,cursor:"pointer"}}>
            + Most Added
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:12,scrollbarWidth:"none"}}>
        {["All","Hitting","Fielding","Throwing","Base Running","Warmup","Catcher","Pitcher","Cool Down"].map(cat=>{
          const c=CAT[cat];const isA=catFilter===cat;
          return(<button key={cat} onClick={()=>setCatFilter(cat)} style={{flexShrink:0,padding:"5px 12px",borderRadius:20,border:`1.5px solid ${isA?(c?c.border:P.steelBorder):P.border}`,background:isA?(c?c.bg:P.steelDim):P.inputBg,color:isA?(c?c.text:P.steel):P.textMuted,fontFamily:"'Nunito',sans-serif",fontSize:12,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>{cat}</button>);
        })}
      </div>

      {/* Empty state */}
      {filtered.length===0&&(
        <div style={{textAlign:"center",padding:"48px 20px"}}>
          <div style={{fontSize:32,marginBottom:12,color:P.textDim}}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:18,color:P.textMuted,fontWeight:700}}>No drills here yet</div>
          <div style={{fontSize:12,color:P.textDim,marginTop:6,fontWeight:600}}>Be the first to share one from your Drills tab!</div>
        </div>
      )}

      {/* Drill cards */}
      {filtered.map(cd=>{
        const drill=cd.drill||{};
        const c=CAT[drill.category]||CAT["Hitting"];
        const isExp=expanded===cd.id;
        const have=alreadyHave(cd);
        return(
          <div key={cd.id} style={{background:P.surface,borderRadius:12,border:`1.5px solid ${P.border}`,marginBottom:10,borderLeft:`3px solid ${c.border}`,overflow:"hidden"}}>
            {/* Main row */}
            <div style={{padding:"12px 14px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:16,fontWeight:700,color:P.black,lineHeight:1.2,marginBottom:5}}>{drill.name}</div>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                    <CatChip cat={drill.category} small/>
                    {drill.duration&&<span style={{fontSize:11,color:P.textDim,fontWeight:700}}>{drill.duration}m</span>}
                    {drill.players>0&&<span style={{fontSize:11,color:P.textDim,fontWeight:700}}>{drill.players}p</span>}
                  </div>
                </div>
                <button onClick={()=>!have&&adding!==cd.id&&addToMyLibrary(cd)} style={{flexShrink:0,padding:"7px 13px",borderRadius:20,border:`1.5px solid ${have?P.border:P.steel}`,background:have?P.inputBg:P.steel,color:have?P.textDim:"#fff",fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:800,cursor:have?"default":"pointer",whiteSpace:"nowrap"}}>
                  {adding===cd.id?"Adding...":(have?"✓ Added":"+ Add")}
                </button>
              </div>

              {/* Rating + meta row */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <StarRating rating={cd.avg_rating||0} userRating={ratings[cd.id]} onRate={(r)=>rateDrill(cd.id,r)}/>
                  <span style={{fontSize:11,color:P.textDim,fontWeight:700}}>
                    {cd.avg_rating>0?`${cd.avg_rating} (${cd.rating_count})`:"No ratings yet"}
                  </span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:10,color:P.textDim,fontWeight:700}}>by {cd.team_name||"Anonymous"}</span>
                  {cd.times_added>0&&<span style={{fontSize:10,color:P.steel,fontWeight:800,background:P.steelDim,padding:"2px 7px",borderRadius:10}}>{cd.times_added}x added</span>}
                </div>
              </div>
            </div>

            {/* Expandable details */}
            {drill.notes&&(
              <div>
                <button onClick={()=>setExpanded(isExp?null:cd.id)} style={{width:"100%",padding:"8px 14px",background:P.inputBg,border:"none",borderTop:`1px solid ${P.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:800,color:P.textMuted,cursor:"pointer"}}>
                  {isExp?"Hide details":"Show details"}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={isExp?"M18 15l-6-6-6 6":"M6 9l6 6 6-6"}/></svg>
                </button>
                {isExp&&(
                  <div style={{padding:"10px 14px",borderTop:`1px solid ${P.border}`}}>
                    <ul style={{listStyle:"none",padding:0,margin:0}}>
                      {drill.notes.split("\n").filter(Boolean).map((n,i)=>(
                        <li key={i} style={{fontSize:12,color:P.text,fontWeight:600,padding:"3px 0",display:"flex",gap:6}}>
                          <span style={{color:c.text,fontWeight:900}}>·</span>{n}
                        </li>
                      ))}
                    </ul>
                    {drill.video&&<a href={drill.video} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,color:P.steel,marginTop:8,textDecoration:"none",fontWeight:800}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 7l-7 5 7 5V7zM1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>
                      Watch video
                    </a>}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
