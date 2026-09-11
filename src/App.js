import { useState, useEffect } from "react";

const CARDS = [
  { id:1,  emoji:"🌑", en:"Exhausted",    zh:"疲憊"    },
  { id:2,  emoji:"🌫️", en:"Lost",          zh:"迷茫"    },
  { id:3,  emoji:"🌊", en:"Anxious",       zh:"焦慮"    },
  { id:4,  emoji:"🌧️", en:"Sad",           zh:"悲傷"    },
  { id:5,  emoji:"🔥", en:"Angry",         zh:"憤怒"    },
  { id:6,  emoji:"❄️", en:"Numb",          zh:"麻木"    },
  { id:7,  emoji:"🌙", en:"Lonely",        zh:"孤獨"    },
  { id:8,  emoji:"🌪️", en:"Overwhelmed",   zh:"不知所措" },
  { id:9,  emoji:"🌀", en:"Confused",      zh:"困惑"    },
  { id:10, emoji:"🌱", en:"Hopeful",       zh:"希望"    },
  { id:11, emoji:"🍃", en:"Calm",          zh:"平靜"    },
  { id:12, emoji:"🌸", en:"Grateful",      zh:"感恩"    },
  { id:13, emoji:"☀️", en:"Joyful",        zh:"喜悅"    },
  { id:14, emoji:"🪨", en:"Stuck",         zh:"困住了"   },
  { id:15, emoji:"🌬️", en:"Empty",         zh:"空虛"    },
  { id:16, emoji:"🌩️", en:"Worried",       zh:"憂慮"    },
  { id:17, emoji:"🫧", en:"Suppressed",    zh:"壓抑"    },
  { id:18, emoji:"🌠", en:"Longing",       zh:"渴望"    },
  { id:19, emoji:"🍂", en:"Ashamed",       zh:"羞愧"    },
  { id:20, emoji:"⚡", en:"Restless",      zh:"躁動"    },
  { id:21, emoji:"🌺", en:"Content",       zh:"滿足"    },
  { id:22, emoji:"🌴", en:"Peaceful",      zh:"寧靜"    },
];

const POSITIVE_IDS = new Set([10,11,12,13,21,22]);

const MOOD = {
  bright:{ bg:"#0a2016", border:"#1e5a3a", dot:"#4aaa7a", text:"#70cc9a", label:"✨ Lighter", labelZh:"✨ 輕盈" },
  mixed: { bg:"#181606", border:"#4a4a18", dot:"#b0a840", text:"#ccc860", label:"🌤 Mixed",   labelZh:"🌤 混合" },
  heavy: { bg:"#130a22", border:"#4a2a6a", dot:"#8a58aa", text:"#b890d4", label:"🌑 Heavier", labelZh:"🌑 沉重" },
};

const PATTERNS = {
  burnout:    { ids:[1,8,14,15,6],   en:"Burnout / Depletion",          zh:"身心耗竭／倦怠"     },
  anxiety:    { ids:[3,8,16,20,9],   en:"Anxiety / Overwhelm",          zh:"焦慮／不知所措"     },
  lowmood:    { ids:[4,7,15,6,19],   en:"Low Mood / Withdrawal",        zh:"情緒低落／退縮"     },
  anger:      { ids:[5,20,14,17],    en:"Suppressed Anger / Tension",   zh:"壓抑憤怒／內在張力" },
  grief:      { ids:[4,18,19,7,2],   en:"Grief / Longing",              zh:"悲傷／失落渴望"     },
  growth:     { ids:[10,12,21,22,11],en:"Growth / Wellbeing",           zh:"成長／正向狀態"     },
  transition: { ids:[2,9,14,18,20],  en:"Life Transition / Uncertainty",zh:"人生轉變／不確定感" },
};

function detectPattern(cards){
  const ids=new Set(cards.map(c=>c.id));
  let best=null,bestScore=0;
  Object.entries(PATTERNS).forEach(([key,p])=>{
    const score=p.ids.filter(id=>ids.has(id)).length;
    if(score>bestScore){bestScore=score;best=key;}
  });
  return bestScore>0?best:null;
}

const T={
  en:{
    appName:"Inner Mirror",appSub:"A gentle space for self-reflection",
    welcome1:"This is your space.",welcome2:"Pick 3 cards, express your feelings,",
    welcome3:"and let AI gently guide your reflection.",
    begin:"Begin Session",myJourney:"My Journey",switchLang:"切換至繁體中文",
    s1Title:"Choose Your Cards",s1Desc:"Select 3 cards that resonate with how you feel right now. No right or wrong answers.",
    selected:"selected",limitMsg:"Tap a selected card to deselect it.",next:"Continue →",
    s2Title:"Express Yourself",s2Desc:"Anything you'd like to share about how you feel? Optional.",
    placeholder:"Write freely here… there is no judgement.",
    reflect:"Reflect on My Cards",skip:"Skip & Continue",back:"← Back",
    s3Title:"Your Reflection",thinking:"Reading your cards with care…",
    sReflection:"Reflection",sInsight:"Insight",
    sAwareness:"Gentle Awareness",sTechniques:"Evidence-based Techniques",sNote:"A gentle reminder",
    savedMsg:"✨ Session saved to your journey",viewJourney:"View My Journey",
    again:"Begin a New Session",error:"Unable to connect. Please try again.",
    disclaimer:"內觀 is a wellness tool, not a diagnostic or clinical service. If you are in crisis, please contact a mental health professional.",
    hTitle:"My Journey",hBack:"← Back",
    hSessions:"Sessions",hDays:"Days Active",hMostChosen:"Most Chosen Cards",
    hTimeline:"Mood Timeline",hHistory:"Session History",
    hNoSessions:"No sessions yet. Begin your first session to start your journey.",
    hClear:"Clear all history",hConfirmClear:"Clear all session history? This cannot be undone.",
    hExpand:"Tap any session to read its reflection.",hReflection:"AI reflection from that day:",
    patternLabel:"Emotional pattern detected:",
  },
  zh:{
    appName:"內觀",appSub:"一個溫柔的自我反思空間",
    welcome1:"這是屬於你的空間。",welcome2:"選擇3張牌，表達你的感受，",
    welcome3:"讓AI溫柔地陪你自我反思。",
    begin:"開始體驗",myJourney:"我的旅程",switchLang:"Switch to English",
    s1Title:"選擇你的牌",s1Desc:"選擇3張此刻最能觸動你的牌。沒有對錯之分，跟隨直覺。",
    selected:"已選",limitMsg:"點選已選的牌可取消選擇。",next:"繼續 →",
    s2Title:"表達你的感受",s2Desc:"你想分享此刻的感受嗎？在這裡自由書寫，完全可以略過。",
    placeholder:"在這裡自由書寫……這裡沒有評判。",
    reflect:"解讀我的牌",skip:"略過，繼續",back:"← 返回",
    s3Title:"你的領悟",thinking:"正在細讀你的牌……",
    sReflection:"情感反思",sInsight:"心理洞察",
    sAwareness:"溫柔覺察",sTechniques:"實證自助技巧",sNote:"溫柔提醒",
    savedMsg:"✨ 本次體驗已儲存至旅程",viewJourney:"查看我的旅程",
    again:"開始新一輪",error:"無法連接，請稍後再試。",
    disclaimer:"內觀是健康自助工具，並非診斷或臨床服務。如你正處於危機中，請聯絡心理健康專業人士。",
    hTitle:"我的旅程",hBack:"← 返回",
    hSessions:"次體驗",hDays:"活躍天數",hMostChosen:"最常選擇的牌",
    hTimeline:"情緒時間軸",hHistory:"體驗記錄",
    hNoSessions:"尚無記錄。開始你的第一次體驗吧。",
    hClear:"清除所有記錄",hConfirmClear:"確定清除所有記錄？此操作無法復原。",
    hExpand:"點選任何記錄，閱讀當日的AI領悟。",hReflection:"當日AI領悟：",
    patternLabel:"偵測到的情緒模式：",
  }
};

const STORAGE_KEY="neiGuan_v2";
async function loadSessions(){try{const r=await window.storage.get(STORAGE_KEY);return r?JSON.parse(r.value):[];}catch{return[];}}
async function saveSessions(list){try{await window.storage.set(STORAGE_KEY,JSON.stringify(list));}catch{}}
function getMoodType(cards){const p=cards.filter(c=>POSITIVE_IDS.has(c.id)).length;return p>=2?"bright":p===1?"mixed":"heavy";}
function formatDate(iso,lang){const d=new Date(iso);if(lang==="zh")return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;return d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});}
function getTopCards(sessions){const freq={};sessions.forEach(s=>s.cards.forEach(c=>{if(!freq[c.id])freq[c.id]={card:c,count:0};freq[c.id].count++;}));return Object.values(freq).sort((a,b)=>b.count-a.count).slice(0,5);}
function getDaysActive(sessions){return new Set(sessions.map(s=>s.date.split("T")[0])).size;}

const S={
  wrap:{minHeight:"100vh",background:"linear-gradient(160deg,#0d0825 0%,#160d3a 60%,#0a1a2e 100%)",color:"#e2d4f8",fontFamily:"'Segoe UI','PingFang TC','Helvetica Neue',sans-serif",padding:"24px 16px",boxSizing:"border-box"},
  center:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"90vh",textAlign:"center",maxWidth:440,margin:"0 auto"},
  logo:{fontSize:52,marginBottom:8},
  appName:{fontSize:34,fontWeight:700,color:"#c8aaff",margin:"4px 0 6px",letterSpacing:2},
  appSub:{color:"#8b6fc4",fontSize:15,marginBottom:24},
  divider:{width:48,height:1,background:"linear-gradient(90deg,transparent,#c8aaff,transparent)",margin:"0 auto 24px"},
  welcomeLines:{color:"#b8a0e4",fontSize:16,lineHeight:2,marginBottom:32},
  primaryBtn:{background:"linear-gradient(135deg,#6b35d4,#4a2080)",border:"1.5px solid #c8aaff",borderRadius:50,color:"#e8d8ff",padding:"13px 0",fontSize:16,cursor:"pointer",width:"100%",maxWidth:260,marginTop:8},
  secondaryBtn:{background:"linear-gradient(135deg,#1a1050,#2a1870)",border:"1.5px solid #5a3aa0",borderRadius:50,color:"#c8aaff",padding:"12px 0",fontSize:15,cursor:"pointer",width:"100%",maxWidth:260,marginTop:8},
  ghostBtn:{background:"transparent",border:"none",color:"#7a5faa",fontSize:13,cursor:"pointer",padding:"10px",marginTop:4},
  langWrap:{display:"flex",gap:16,marginTop:8,flexWrap:"wrap",justifyContent:"center"},
  langBtn:{background:"linear-gradient(135deg,#1e1050,#2d1870)",border:"1.5px solid #5a3aa0",borderRadius:20,color:"#c8aaff",padding:"18px 36px",fontSize:17,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6},
  langEmoji:{fontSize:28},
  stepWrap:{maxWidth:560,margin:"0 auto",paddingBottom:100},
  stepHeader:{textAlign:"center",marginBottom:20},
  dots:{display:"flex",justifyContent:"center",gap:8,marginBottom:16},
  dot:{width:9,height:9,borderRadius:"50%",transition:"all .3s"},
  stepTitle:{fontSize:22,color:"#c8aaff",margin:"4px 0 8px",fontWeight:600},
  stepDesc:{color:"#8b6fc4",fontSize:14,lineHeight:1.7},
  countBadge:{background:"#2a1560",border:"1px solid #5a3aa0",borderRadius:50,padding:"4px 14px",fontSize:13,color:"#c8aaff",display:"inline-block",marginTop:10},
  limitMsg:{fontSize:12,color:"#7a5faa",marginTop:6,textAlign:"center"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(96px,1fr))",gap:10,marginTop:12},
  card:{borderRadius:16,padding:"14px 6px 10px",cursor:"pointer",textAlign:"center",transition:"all .2s",border:"1.5px solid",position:"relative",userSelect:"none"},
  cardEmoji:{fontSize:24,marginBottom:6,display:"block"},
  cardLabel:{fontSize:12,lineHeight:1.3,color:"#d4beff"},
  check:{position:"absolute",top:6,right:8,fontSize:11,color:"#ffd700",fontWeight:700},
  stickyFooter:{position:"fixed",bottom:0,left:0,right:0,padding:"16px 24px 20px",background:"linear-gradient(0deg,#0d0825 60%,transparent)",display:"flex",justifyContent:"center"},
  miniCardRow:{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:20},
  miniCard:{background:"linear-gradient(135deg,#1e1050,#2d1870)",border:"1px solid #5a3aa0",borderRadius:14,padding:"10px 14px",display:"flex",flexDirection:"column",alignItems:"center",gap:4,fontSize:18,color:"#d4beff",minWidth:64},
  miniLabel:{fontSize:11,color:"#9d7fd4"},
  textarea:{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid #3a2570",borderRadius:14,color:"#e2d4f8",padding:"14px",fontSize:15,lineHeight:1.7,resize:"vertical",fontFamily:"inherit",boxSizing:"border-box",outline:"none"},
  btnRow:{display:"flex",flexDirection:"column",alignItems:"center",gap:4,marginTop:16},
  spinner:{fontSize:40,display:"block",textAlign:"center",animation:"spin 2s linear infinite",marginBottom:12},
  loadTxt:{color:"#9d7fd4",fontSize:15,textAlign:"center"},
  rCard:{background:"linear-gradient(135deg,#150d38,#1e1450)",border:"1px solid #3a2570",borderRadius:20,padding:"18px 20px",marginBottom:14,width:"100%",boxSizing:"border-box"},
  rIcon:{fontSize:20,marginBottom:6,display:"block"},
  rLabel:{color:"#c8aaff",fontSize:12,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:6},
  rText:{color:"#cdbcf0",fontSize:14.5,lineHeight:1.8,whiteSpace:"pre-wrap",margin:0},
  awarenessCard:{background:"linear-gradient(135deg,#0d1a30,#0d1038)",border:"1px solid #2a4a7a",borderRadius:20,padding:"18px 20px",marginBottom:14,width:"100%",boxSizing:"border-box"},
  techniquesCard:{background:"linear-gradient(135deg,#0d2220,#0d1a30)",border:"1px solid #1a5a50",borderRadius:20,padding:"18px 20px",marginBottom:14,width:"100%",boxSizing:"border-box"},
  noteCard:{background:"linear-gradient(135deg,#0d2018,#0d2030)",border:"1px solid #1e5a3a",borderRadius:20,padding:"16px 20px",marginBottom:14},
  patternBadge:{display:"inline-flex",alignItems:"center",gap:6,background:"#1a0a38",border:"1px solid #5a3aa0",borderRadius:50,padding:"5px 14px",fontSize:12,color:"#b890d4",marginTop:8},
  disclaimer:{fontSize:12,color:"#5a4a7a",textAlign:"center",marginTop:16,lineHeight:1.6,fontStyle:"italic"},
  errMsg:{color:"#ff8080",textAlign:"center",fontSize:14,margin:"12px 0"},
  savedMsg:{color:"#6fcca0",textAlign:"center",fontSize:13,margin:"0 0 12px"},
  statCard:{background:"linear-gradient(135deg,#150d38,#1e1450)",border:"1px solid #3a2570",borderRadius:16,padding:"16px",textAlign:"center"},
  sectionLabel:{color:"#c8aaff",fontSize:12,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:12,display:"block"},
};

export default function App(){
  const [lang,setLang]=useState(null);
  const [screen,setScreen]=useState("lang");
  const [selected,setSelected]=useState([]);
  const [expr,setExpr]=useState("");
  const [ai,setAi]=useState(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [sessions,setSessions]=useState([]);
  const [saved,setSaved]=useState(false);
  const [expanded,setExpanded]=useState(null);
  const [pattern,setPattern]=useState(null);

  useEffect(()=>{loadSessions().then(setSessions);},[]);

  const t=lang?T[lang]:T.en;
  const isZh=lang==="zh";

  const toggleCard=c=>{
    if(selected.find(x=>x.id===c.id))setSelected(selected.filter(x=>x.id!==c.id));
    else if(selected.length<3)setSelected([...selected,c]);
  };

  const callAI=async()=>{
    setLoading(true);setErr("");setSaved(false);
    const names=selected.map(c=>isZh?c.zh:c.en).join("、");
    const detectedPattern=detectPattern(selected);
    setPattern(detectedPattern);
    const patternHint=detectedPattern&&PATTERNS[detectedPattern]
      ?isZh?PATTERNS[detectedPattern].zh:PATTERNS[detectedPattern].en:"";

    const prompt=isZh
      ?`你是一位溫柔的心理健康伴侶。用戶選擇了：${names}。${patternHint?`情緒模式：${patternHint}。`:""}${expr?`他們分享：「${expr}」`:""}

請以繁體中文，嚴格只回傳以下JSON格式，不加任何其他文字：
{
"reflection": "以溫暖非評判方式承認感受，2-3句",
"insight": "輕柔說明情緒模式心理意義，2-3句",
"awareness": "說明這些感受常見的相關狀況，讓用戶知道不孤單，2-3句",
"techniques": "1. 技巧名稱：具體說明\n2. 技巧名稱：具體說明\n3. 技巧名稱：具體說明",
"note": "如感受持續，溫柔建議尋求專業支持，1句"
}`
      :`You are a warm mental wellness companion. Cards: ${names}. ${patternHint?`Pattern: ${patternHint}.`:""} ${expr?`Shared: "${expr}"`:""}

Respond ONLY with this exact JSON, no other text:
{
"reflection": "Acknowledge feelings warmly, 2-3 sentences",
"insight": "Gently explain psychological meaning of these patterns, 2-3 sentences",
"awareness": "Explain what these feelings are sometimes associated with, normalise it, 2-3 sentences",
"techniques": "1. Technique name: how-to description\n2. Technique name: how-to description\n3. Technique name: how-to description",
"note": "One warm sentence suggesting professional support if needed"
}`;

    try{
      const key=process.env.REACT_APP_GEMINI_KEY;
      const res=await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            contents:[{parts:[{text:prompt}]}],
            generationConfig:{maxOutputTokens:1400,temperature:0.7}
          })
        }
      );
      const d=await res.json();

      // Check for API-level errors
      if(d.error){throw new Error(d.error.message||"API error");}

      const rawTxt=d.candidates?.[0]?.content?.parts?.[0]?.text||"";

      // Try to extract JSON — handle cases where Gemini wraps in markdown
      let parsed={reflection:"",insight:"",awareness:"",techniques:"",note:""};
      try{
        const jsonStr=rawTxt.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
        const start=jsonStr.indexOf("{");
        const end=jsonStr.lastIndexOf("}");
        if(start!==-1&&end!==-1){
          const attempt=JSON.parse(jsonStr.slice(start,end+1));
          // Only use if fields actually have content
          if(attempt.reflection&&attempt.reflection.length>10){
            parsed=attempt;
          } else {
            throw new Error("Empty fields");
          }
        } else {
          throw new Error("No JSON found");
        }
      }catch(parseErr){
        // Smart fallback: split raw text into sections
        const lines=rawTxt.split("\n").filter(l=>l.trim().length>0);
        const total=lines.length;
        parsed={
          reflection: lines.slice(0, Math.ceil(total*0.2)).join("\n"),
          insight:    lines.slice(Math.ceil(total*0.2), Math.ceil(total*0.4)).join("\n"),
          awareness:  lines.slice(Math.ceil(total*0.4), Math.ceil(total*0.6)).join("\n"),
          techniques: lines.slice(Math.ceil(total*0.6), Math.ceil(total*0.85)).join("\n"),
          note:       lines.slice(Math.ceil(total*0.85)).join("\n"),
        };
        // If still empty, put everything in reflection
        if(!parsed.reflection) parsed.reflection=rawTxt;
      }

      setAi(parsed);
      const newSession={
        id:Date.now().toString(),date:new Date().toISOString(),
        lang,cards:selected,expression:expr,
        reflection:parsed.reflection,moodType:getMoodType(selected),
        pattern:detectedPattern,
      };
      const updated=[newSession,...sessions].slice(0,100);
      setSessions(updated);saveSessions(updated);setSaved(true);
    }catch(e){
      console.error("Gemini error:",e);
      setErr(t.error);
    }
    setLoading(false);
  };

  const reset=()=>{setScreen("welcome");setSelected([]);setExpr("");setAi(null);setErr("");setSaved(false);setPattern(null);};
  const dot=(i,active)=>active.includes(i)?"#c8aaff":"#2d1870";

  if(screen==="lang")return(
    <div style={S.wrap}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} button:hover{opacity:.85}`}</style>
      <div style={S.center}>
        <div style={S.logo}>🪞</div>
        <h1 style={S.appName}>內觀 · Inner Mirror</h1>
        <p style={S.appSub}>Choose your language · 選擇語言</p>
        <div style={S.langWrap}>
          {[["en","🌏","English"],["zh","🌸","繁體中文"]].map(([l,e,n])=>(
            <button key={l} style={S.langBtn} onClick={()=>{setLang(l);setScreen("welcome");}}>
              <span style={S.langEmoji}>{e}</span><span>{n}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if(screen==="welcome")return(
    <div style={S.wrap}>
      <div style={S.center}>
        <div style={S.logo}>🪞</div>
        <h1 style={S.appName}>{t.appName}</h1>
        <p style={S.appSub}>{t.appSub}</p>
        <div style={S.divider}/>
        <div style={S.welcomeLines}>
          <div>{t.welcome1}</div><div>{t.welcome2}</div><div>{t.welcome3}</div>
        </div>
        <button style={S.primaryBtn} onClick={()=>setScreen("cards")}>{t.begin}</button>
        {sessions.length>0&&(
          <button style={S.secondaryBtn} onClick={()=>setScreen("history")}>🌙 {t.myJourney} ({sessions.length})</button>
        )}
        <button style={S.ghostBtn} onClick={()=>setLang(isZh?"en":"zh")}>{t.switchLang}</button>
      </div>
    </div>
  );

  if(screen==="cards")return(
    <div style={S.wrap}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={S.stepWrap}>
        <div style={S.stepHeader}>
          <div style={S.dots}>{[1,2,3].map(i=><div key={i} style={{...S.dot,background:dot(i,[1])}}/>)}</div>
          <h2 style={S.stepTitle}>{t.s1Title}</h2>
          <p style={S.stepDesc}>{t.s1Desc}</p>
          <div style={S.countBadge}>{selected.length}/3 {t.selected}</div>
          {selected.length===3&&<p style={S.limitMsg}>{t.limitMsg}</p>}
        </div>
        <div style={S.grid}>
          {CARDS.map(c=>{
            const sel=!!selected.find(x=>x.id===c.id);
            return(
              <div key={c.id} style={{...S.card,
                background:sel?"linear-gradient(135deg,#2d1870,#4a2090)":"linear-gradient(135deg,#150d38,#1e1050)",
                borderColor:sel?"#c8aaff":"#2d1870",
                transform:sel?"scale(1.06)":"scale(1)",
                boxShadow:sel?"0 0 18px rgba(200,170,255,0.35)":"none",
              }} onClick={()=>toggleCard(c)}>
                <span style={S.cardEmoji}>{c.emoji}</span>
                <span style={S.cardLabel}>{isZh?c.zh:c.en}</span>
                {sel&&<span style={S.check}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={S.stickyFooter}>
        <button style={{...S.primaryBtn,opacity:selected.length===3?1:0.35,maxWidth:220}}
          disabled={selected.length!==3} onClick={()=>setScreen("express")}>{t.next}</button>
      </div>
    </div>
  );

  if(screen==="express")return(
    <div style={S.wrap}>
      <div style={S.stepWrap}>
        <div style={S.stepHeader}>
          <div style={S.dots}>{[1,2,3].map(i=><div key={i} style={{...S.dot,background:dot(i,[1,2])}}/>)}</div>
          <div style={S.miniCardRow}>
            {selected.map(c=>(
              <div key={c.id} style={S.miniCard}>
                <span>{c.emoji}</span><span style={S.miniLabel}>{isZh?c.zh:c.en}</span>
              </div>
            ))}
          </div>
          <h2 style={S.stepTitle}>{t.s2Title}</h2>
          <p style={S.stepDesc}>{t.s2Desc}</p>
        </div>
        <textarea style={S.textarea} rows={6} placeholder={t.placeholder}
          value={expr} onChange={e=>setExpr(e.target.value)}/>
        <div style={S.btnRow}>
          <button style={S.primaryBtn} onClick={()=>{setScreen("result");callAI();}}>{t.reflect}</button>
          <button style={S.ghostBtn} onClick={()=>{setScreen("result");callAI();}}>{t.skip}</button>
          <button style={S.ghostBtn} onClick={()=>setScreen("cards")}>{t.back}</button>
        </div>
      </div>
    </div>
  );

  if(screen==="result")return(
    <div style={S.wrap}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={S.stepWrap}>
        <div style={S.stepHeader}>
          <div style={S.dots}>{[1,2,3].map(i=><div key={i} style={{...S.dot,background:"#c8aaff"}}/>)}</div>
          <div style={S.miniCardRow}>
            {selected.map(c=>(
              <div key={c.id} style={S.miniCard}>
                <span>{c.emoji}</span><span style={S.miniLabel}>{isZh?c.zh:c.en}</span>
              </div>
            ))}
          </div>
          {pattern&&PATTERNS[pattern]&&(
            <div style={{display:"flex",justifyContent:"center"}}>
              <div style={S.patternBadge}>🔮 {t.patternLabel} {isZh?PATTERNS[pattern].zh:PATTERNS[pattern].en}</div>
            </div>
          )}
          <h2 style={S.stepTitle}>{t.s3Title}</h2>
        </div>
        {loading&&(
          <div style={{textAlign:"center",padding:"32px 0"}}>
            <span style={S.spinner}>🌀</span>
            <p style={S.loadTxt}>{t.thinking}</p>
          </div>
        )}
        {err&&<p style={S.errMsg}>{err}</p>}
        {ai&&!loading&&(<>
          {saved&&<p style={S.savedMsg}>{t.savedMsg}</p>}
          <div style={S.rCard}>
            <span style={S.rIcon}>🌿</span>
            <div style={S.rLabel}>{t.sReflection}</div>
            <p style={S.rText}>{ai.reflection}</p>
          </div>
          <div style={S.rCard}>
            <span style={S.rIcon}>🔍</span>
            <div style={S.rLabel}>{t.sInsight}</div>
            <p style={S.rText}>{ai.insight}</p>
          </div>
          <div style={S.awarenessCard}>
            <span style={S.rIcon}>💙</span>
            <div style={{...S.rLabel,color:"#7ab8f5"}}>{t.sAwareness}</div>
            <p style={{...S.rText,color:"#a8ccf0"}}>{ai.awareness}</p>
          </div>
          <div style={S.techniquesCard}>
            <span style={S.rIcon}>🌿</span>
            <div style={{...S.rLabel,color:"#6fcca0"}}>{t.sTechniques}</div>
            <p style={{...S.rText,color:"#a8e4c8"}}>{ai.techniques}</p>
          </div>
          <div style={{...S.rCard,...S.noteCard}}>
            <span style={S.rIcon}>💛</span>
            <div style={{...S.rLabel,color:"#6fcca0"}}>{t.sNote}</div>
            <p style={{...S.rText,fontStyle:"italic",color:"#a8e4c8"}}>{ai.note}</p>
          </div>
          <p style={S.disclaimer}>{t.disclaimer}</p>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginTop:16}}>
            <button style={S.primaryBtn} onClick={reset}>{t.again}</button>
            <button style={S.secondaryBtn} onClick={()=>setScreen("history")}>🌙 {t.viewJourney}</button>
          </div>
        </>)}
      </div>
    </div>
  );

  if(screen==="history"){
    const topCards=getTopCards(sessions);
    const daysActive=getDaysActive(sessions);
    const reversed=[...sessions].reverse();
    return(
      <div style={S.wrap}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{...S.stepWrap,paddingBottom:40}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
            <button style={{...S.ghostBtn,padding:"4px 0"}} onClick={()=>setScreen("welcome")}>{t.hBack}</button>
            <h2 style={{...S.stepTitle,margin:0}}>🌙 {t.hTitle}</h2>
            <div style={{width:60}}/>
          </div>
          {sessions.length===0?(
            <div style={{textAlign:"center",padding:"60px 20px",color:"#7a5faa"}}>
              <div style={{fontSize:48,marginBottom:16}}>🪞</div>
              <p style={{lineHeight:1.7}}>{t.hNoSessions}</p>
              <button style={{...S.primaryBtn,margin:"20px auto 0"}} onClick={()=>setScreen("cards")}>{t.begin}</button>
            </div>
          ):(<>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
              {[{icon:"🎴",val:sessions.length,label:t.hSessions},{icon:"📅",val:daysActive,label:t.hDays}].map((s,i)=>(
                <div key={i} style={S.statCard}>
                  <div style={{fontSize:26,marginBottom:4}}>{s.icon}</div>
                  <div style={{fontSize:30,fontWeight:700,color:"#c8aaff"}}>{s.val}</div>
                  <div style={{fontSize:12,color:"#7a5faa",marginTop:2}}>{s.label}</div>
                </div>
              ))}
            </div>
            {topCards.length>0&&(
              <div style={{...S.rCard,marginBottom:20}}>
                <span style={S.sectionLabel}>✨ {t.hMostChosen}</span>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {topCards.map(({card,count})=>(
                    <div key={card.id} style={{background:"#2a1560",border:"1px solid #5a3aa0",borderRadius:12,padding:"7px 12px",display:"flex",alignItems:"center",gap:6,fontSize:13,color:"#d4beff"}}>
                      <span style={{fontSize:18}}>{card.emoji}</span>
                      <span>{isZh?card.zh:card.en}</span>
                      <span style={{background:"#4a2090",borderRadius:50,padding:"1px 7px",fontSize:11,color:"#c8aaff"}}>×{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{...S.rCard,marginBottom:20}}>
              <span style={S.sectionLabel}>🌊 {t.hTimeline}</span>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"flex-end",minHeight:56,marginBottom:12}}>
                {reversed.map((s)=>{
                  const m=MOOD[s.moodType||"heavy"];
                  const h=s.moodType==="bright"?52:s.moodType==="mixed"?36:22;
                  const isExp=expanded===s.id;
                  return(
                    <div key={s.id} title={formatDate(s.date,lang)}
                      style={{width:13,height:h,borderRadius:7,background:m.dot,opacity:isExp?1:0.7,cursor:"pointer",transition:"all .2s",transform:isExp?"scaleY(1.15)":"scaleY(1)",flexShrink:0}}
                      onClick={()=>setExpanded(isExp?null:s.id)}/>
                  );
                })}
              </div>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                {Object.entries(MOOD).map(([k,m])=>(
                  <div key={k} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#7a5faa"}}>
                    <div style={{width:9,height:9,borderRadius:"50%",background:m.dot}}/>{isZh?m.labelZh:m.label}
                  </div>
                ))}
              </div>
              <p style={{fontSize:11,color:"#5a3a7a",marginTop:8,marginBottom:0}}>{t.hExpand}</p>
            </div>
            <span style={{...S.sectionLabel,display:"block",marginBottom:12}}>📖 {t.hHistory}</span>
            {sessions.map(s=>{
              const m=MOOD[s.moodType||"heavy"];
              const isExp=expanded===s.id;
              return(
                <div key={s.id}
                  style={{background:`linear-gradient(135deg,${m.bg},#120a20)`,border:`1px solid ${m.border}`,borderRadius:20,padding:"14px 16px",marginBottom:10,cursor:"pointer",transition:"all .2s"}}
                  onClick={()=>setExpanded(isExp?null:s.id)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",gap:6}}>{s.cards.map(c=><span key={c.id} style={{fontSize:22}}>{c.emoji}</span>)}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:12,color:"#7a5faa"}}>{formatDate(s.date,lang)}</span>
                      <span style={{color:"#5a3aa0",fontSize:11}}>{isExp?"▲":"▼"}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:8}}>
                    {s.cards.map(c=>(
                      <span key={c.id} style={{fontSize:11,color:m.text,background:"rgba(255,255,255,0.06)",borderRadius:50,padding:"2px 9px"}}>{isZh?c.zh:c.en}</span>
                    ))}
                  </div>
                  {s.pattern&&PATTERNS[s.pattern]&&(
                    <div style={{marginTop:6}}>
                      <span style={{fontSize:11,color:"#8a58aa",background:"rgba(90,50,130,0.2)",borderRadius:50,padding:"2px 10px"}}>
                        🔮 {isZh?PATTERNS[s.pattern].zh:PATTERNS[s.pattern].en}
                      </span>
                    </div>
                  )}
                  {isExp&&s.reflection&&(
                    <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${m.border}`}}>
                      <p style={{fontSize:12,color:"#9d7fd4",margin:"0 0 6px",fontWeight:600,letterSpacing:0.5}}>{t.hReflection}</p>
                      <p style={{fontSize:13,color:"#cdbcf0",lineHeight:1.7,margin:0,fontStyle:"italic"}}>"{s.reflection}"</p>
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{textAlign:"center",marginTop:20}}>
              <button style={{...S.ghostBtn,color:"#4a2a4a",fontSize:12}}
                onClick={async()=>{if(window.confirm(t.hConfirmClear)){await saveSessions([]);setSessions([]);}}}>
                {t.hClear}
              </button>
            </div>
          </>)}
        </div>
      </div>
    );
  }
}
