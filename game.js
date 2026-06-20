(() => {
"use strict";

const STORAGE_KEY = "cybertrace_v11_social_chat_expanded";
const $ = (id) => document.getElementById(id);

const navItems = [
  ["dashboard","Dashboard","⌁"],
  ["quests","Quest","◆"],
  ["terminal","Terminal","▣"],
  ["dungeon","Dungeon","▦"],
  ["battle","Battle","⚔"],
  ["shop","Shop","₿"],
  ["inventory","Inventory","▤"],
  ["skills","Skills","✦"],
  ["map","Network Map","◎"],
  ["achievements","Achievements","★"],
  ["logs","Activity Log","≡"]
];

const ranks = [
  [0,"Script Kiddie"],
  [120,"Packet Rat"],
  [320,"Code Runner"],
  [650,"Ghost Operator"],
  [1100,"Root Phantom"],
  [1700,"Neon Legend"]
];

const questPool = [
  {id:"q1",type:"Side",title:"Akun Streamer Terkunci",desc:"Seorang streamer kehilangan akses ke arsip videonya. Pulihkan token fiktif dan hindari trace.",reward:{crypto:260,exp:65,rep:22},energy:12,heat:8,difficulty:1},
  {id:"q2",type:"Side",title:"Spam Bot di Forum Sekolah",desc:"Forum lokal diserang bot spam. Bersihkan node dan cari sumbernya.",reward:{crypto:340,exp:80,rep:28},energy:14,heat:10,difficulty:1},
  {id:"q3",type:"Daily",title:"Bug Bounty Mini",desc:"Client meminta audit simulasi pada server uji. Cari celah tanpa menaikkan heat.",reward:{crypto:420,exp:100,rep:35},energy:18,heat:13,difficulty:2},
  {id:"q4",type:"Main",title:"The Lost Packet",desc:"MIRA mendeteksi paket data aneh dari Public Net. Paket ini mengarah ke AUREX Shadow Node.",reward:{crypto:560,exp:130,rep:45,story:1},energy:22,heat:16,difficulty:2},
  {id:"q5",type:"Main",title:"Ghost in the Firewall",desc:"AI kecil bernama MIRA meminta bantuan keluar dari firewall AUREX.",reward:{crypto:720,exp:170,rep:60,story:1},energy:26,heat:20,difficulty:3},
  {id:"q6",type:"High Risk",title:"Corporate Cloud Sweep",desc:"Masuki cloud korporat tiruan, ambil bukti manipulasi data, lalu keluar sebelum trace aktif.",reward:{crypto:980,exp:230,rep:90},energy:32,heat:28,difficulty:4}
];

const shopItems = [
  {id:"tool_packet",name:"Packet Sniffer",type:"Tool",price:450,power:7,stealth:4,speed:5,desc:"Meningkatkan peluang sukses puzzle."},
  {id:"tool_decrypt",name:"Decryptor V1",type:"Tool",price:650,power:10,stealth:2,speed:4,desc:"Damage besar ke shield musuh digital."},
  {id:"tool_proxy",name:"Proxy Chain",type:"Security",price:520,power:0,stealth:11,speed:1,desc:"Mengurangi Heat saat menjalankan aktivitas."},
  {id:"tool_cleaner",name:"Trace Cleaner",type:"Security",price:380,power:0,stealth:8,speed:0,desc:"Bonus untuk command clean di Terminal."},
  {id:"tool_gpu",name:"GPU Cluster Mini",type:"Hardware",price:900,power:14,stealth:-2,speed:8,desc:"Menambah damage dan energy maksimum."},
  {id:"tool_ai",name:"MIRA Upgrade Chip",type:"AI",price:1200,power:8,stealth:8,speed:8,desc:"Upgrade serba guna untuk puzzle dan battle."},
  {id:"tool_signal",name:"Signal Stabilizer",type:"Tool",price:760,power:4,stealth:5,speed:10,desc:"Mempermudah mini game Signal Timing."},
  {id:"tool_vault",name:"Vault Backup",type:"Security",price:1050,power:0,stealth:14,speed:0,desc:"Mengurangi penalti saat Trace Lockdown."}
];

const skills = [
  {id:"stealth",name:"Stealth",desc:"Mengurangi Heat dari semua aktivitas.",max:5},
  {id:"cracking",name:"Cracking",desc:"Meningkatkan damage dan peluang sukses quest.",max:5},
  {id:"social",name:"Social",desc:"Meningkatkan reputation dan reward NPC.",max:5},
  {id:"hardware",name:"Hardware",desc:"Meningkatkan energy maksimum dan power.",max:5},
  {id:"defense",name:"Malware Defense",desc:"Mengurangi damage musuh digital.",max:5},
  {id:"ai",name:"AI Sync",desc:"MIRA memberi bonus pada puzzle dan dungeon.",max:5}
];

const enemies = [
  {name:"Spam Bot Swarm",hp:90,shield:20,atk:12,reward:{crypto:130,exp:35,rep:8},icon:"☣"},
  {name:"Firewall Node",hp:135,shield:45,atk:16,reward:{crypto:190,exp:50,rep:12},icon:"▣"},
  {name:"Trace Scanner",hp:155,shield:35,atk:22,reward:{crypto:260,exp:70,rep:18},icon:"⌖"},
  {name:"Black ICE Sentinel",hp:240,shield:80,atk:28,reward:{crypto:420,exp:120,rep:35},icon:"◆"},
  {name:"ORACLE Core Fragment",hp:380,shield:120,atk:36,reward:{crypto:760,exp:220,rep:70},icon:"◉"}
];

const achievements = [
  {id:"first_quest",name:"First Breach",desc:"Selesaikan 1 quest.",check:(s)=>s.stats.quests>=1},
  {id:"ten_quests",name:"Contract Runner",desc:"Selesaikan 10 quest.",check:(s)=>s.stats.quests>=10},
  {id:"first_boss",name:"Firewall Breaker",desc:"Kalahkan boss dungeon.",check:(s)=>s.stats.bosses>=1},
  {id:"rich",name:"Crypto Stacker",desc:"Miliki ₿5.000.",check:(s)=>s.crypto>=5000},
  {id:"rank_root",name:"Root Phantom",desc:"Capai REP 1.100.",check:(s)=>s.rep>=1100},
  {id:"collector",name:"Tool Collector",desc:"Miliki 6 tool.",check:(s)=>Object.keys(s.owned).length>=6},
  {id:"mini_master",name:"Mini Game Master",desc:"Menangkan 15 mini game.",check:(s)=>s.stats.minigames>=15},
  {id:"heat_survivor",name:"Heat Survivor",desc:"Selamat dari 3 Trace Lockdown.",check:(s)=>s.stats.lockdowns>=3},
  {id:"wanted_runner",name:"Wanted Runner",desc:"Masuk status WANTED pertama kali.",check:(s)=>s.heatSystem && s.heatSystem.wanted}
];

const defaultState = {
  alias:"ZeroByte",
  username:"zerobyte",
  bio:"Hacker pemula dari Neon District.",
  level:1,
  exp:0,
  expNeed:100,
  crypto:550,
  energy:100,
  maxEnergy:100,
  heat:0,
  rep:0,
  story:0,
  skillPoints:0,
  activeQuest:null,
  owned:{
    tool_basic:{name:"Basic Laptop",type:"Starter",power:3,stealth:1,speed:2,desc:"Laptop awal. Lemah, tapi cukup buat masuk Public Net."}
  },
  skills:{stealth:0,cracking:0,social:0,hardware:0,defense:0,ai:0},
  dungeonFloor:1,
  dungeonBossDefeated:false,
  battle:null,
  lastDaily:null,
  stats:{quests:0,battles:0,bosses:0,minigames:0,lockdowns:0,raids:0,confiscated:0},
  heatSystem:{wanted:false,wantedUntil:0,raidCooldownUntil:0,lastWarning:0},
  achievements:{},
  logs:["System initialized. Alias ZeroByte masuk ke Neon District."]
};

let state = loadGame();
let currentView = "dashboard";
let miniGame = null;
let signalTimer = null;
let memoryTimer = null;
let terminalBooted = false;

function clone(x){ return JSON.parse(JSON.stringify(x)); }
function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); }
function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function pick(arr){ return arr[rand(0,arr.length-1)]; }
function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function fmt(n){ return Math.floor(n).toLocaleString("id-ID"); }
function todayKey(){ return new Date().toISOString().slice(0,10); }

function mergeDeep(base,saved){
  const out=clone(base);
  if(!saved || typeof saved !== "object") return out;
  for(const k in saved){
    if(saved[k] && typeof saved[k]==="object" && !Array.isArray(saved[k]) && out[k] && typeof out[k]==="object" && !Array.isArray(out[k])){
      out[k]=mergeDeep(out[k],saved[k]);
    }else{
      out[k]=saved[k];
    }
  }
  return out;
}

function loadGame(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return mergeDeep(defaultState, JSON.parse(raw));
  }catch(e){
    console.warn("Save disabled:", e);
  }
  return clone(defaultState);
}

function saveGame(show=false){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if(show) toast("Progress disimpan di browser.");
  }catch(e){
    if(show) toast("Save tidak aktif di browser/sandbox ini.");
  }
}

function resetGame(){
  if(!confirm("Reset semua progress game?")) return;
  try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
  state = clone(defaultState);
  currentView = "dashboard";
  terminalBooted = false;
  showView("dashboard");
  toast("Progress direset.");
}

function log(msg){
  const stamp = new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});
  state.logs.push(`[${stamp}] ${msg}`);
  if(state.logs.length > 100) state.logs.shift();
  saveGame(false);
}

function toast(msg){
  const el = $("toast");
  if(!el) return;
  el.innerHTML = msg;
  el.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(()=>el.classList.remove("show"),2600);
}

function getRank(){
  let r = ranks[0][1];
  for(const [need,name] of ranks){
    if(state.rep >= need) r = name;
  }
  return r;
}

function getAvatarInitial(){
  const raw = String(state.alias || "ZB").trim();
  const parts = raw.split(/\s+/).filter(Boolean);
  if(parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return raw.slice(0,2).toUpperCase();
}

function totalStat(key){
  return Object.values(state.owned).reduce((a,it)=>a+Number(it[key]||0),0);
}

function skillBonus(key){
  return state.skills[key] || 0;
}

function getHeatTier(){
  if(state.heat < 30) return {name:"LOW", color:"green", desc:"Aman"};
  if(state.heat < 60) return {name:"WATCHED", color:"yellow", desc:"Mulai dipantau"};
  if(state.heat < 90) return {name:"HUNTED", color:"red", desc:"Diburu scanner"};
  return {name:"WANTED", color:"red", desc:"Red alert"};
}

function nowMs(){
  return Date.now();
}

function isWantedActive(){
  if(!state.heatSystem) state.heatSystem = {wanted:false,wantedUntil:0,raidCooldownUntil:0,lastWarning:0};
  if(state.heatSystem.wanted && nowMs() > state.heatSystem.wantedUntil){
    state.heatSystem.wanted = false;
    log("Status WANTED mereda. Scanner kehilangan jejak sementara.");
    toast("WANTED berakhir. Heat masih tinggi, tetap hati-hati.");
  }
  return !!state.heatSystem.wanted;
}

function applyHighHeatPunishment(source="activity"){
  if(!state.heatSystem) state.heatSystem = {wanted:false,wantedUntil:0,raidCooldownUntil:0,lastWarning:0};
  const current = nowMs();

  if(state.heat >= 90 && !state.heatSystem.wanted){
    state.heatSystem.wanted = true;
    state.heatSystem.wantedUntil = current + 3 * 60 * 1000;
    state.heatSystem.raidCooldownUntil = current + 25000;
    state.stats.raids = state.stats.raids || 0;
    log("RED ALERT: Heat melewati 90%. Status WANTED aktif selama 3 menit.");
    toast("RED ALERT! Heat > 90%. Status WANTED aktif.");
    checkAchievements();
  }

  if(state.heat >= 90 && state.heatSystem.wanted && current > state.heatSystem.raidCooldownUntil){
    const roll = rand(1,100);
    state.heatSystem.raidCooldownUntil = current + rand(35000,65000);

    if(roll <= 38){
      state.stats.raids = (state.stats.raids || 0) + 1;
      const fine = Math.min(state.crypto, rand(90,220) + state.level*45);
      const energyLoss = Math.min(state.energy, rand(8,18));
      state.crypto -= fine;
      state.energy -= energyLoss;
      state.stats.confiscated = (state.stats.confiscated || 0) + fine;
      log(`TRACE RAID: Scanner menyita ₿${fine} dan Energy -${energyLoss}.`);
      toast(`TRACE RAID! Crypto -₿${fine}, Energy -${energyLoss}.`);
    }else if(roll <= 60){
      state.rep = Math.max(0, state.rep - rand(8,22));
      log("TRACE RAID: Reputasi turun karena jaringan kontak takut membantumu.");
      toast("TRACE RAID! REP turun.");
    }else{
      log("TRACE RAID nyaris terjadi, tapi Proxy Chain menahan scanner.");
      toast("Scanner lewat dekat. Kamu lolos tipis.");
    }
  }

  if(state.heat >= 75 && current - (state.heatSystem.lastWarning || 0) > 45000){
    state.heatSystem.lastWarning = current;
    toast("Peringatan: Heat tinggi. Pakai Terminal clean atau rest.");
  }
}

function getHeatPenalty(){
  const wanted = isWantedActive();
  if(state.heat >= 90 || wanted){
    return {rewardMult:.72, energyExtra:1.35, heatExtra:1.35, failRepLoss:14, label:"WANTED penalty aktif"};
  }
  if(state.heat >= 75){
    return {rewardMult:.86, energyExtra:1.18, heatExtra:1.2, failRepLoss:8, label:"Hunted penalty aktif"};
  }
  if(state.heat >= 60){
    return {rewardMult:.94, energyExtra:1.08, heatExtra:1.1, failRepLoss:5, label:"Watched penalty ringan"};
  }
  return {rewardMult:1, energyExtra:1, heatExtra:1, failRepLoss:5, label:"Normal"};
}

function openSidebar(){
  const sidebar = $("sidebar");
  const overlay = $("overlay");
  if(sidebar) sidebar.classList.add("open");
  if(overlay) overlay.classList.add("show");
}

function closeSidebar(){
  const sidebar = $("sidebar");
  const overlay = $("overlay");
  if(sidebar) sidebar.classList.remove("open");
  if(overlay) overlay.classList.remove("show");
}

function addHeat(amount){
  const penalty = getHeatPenalty();
  const reduction = skillBonus("stealth")*2 + totalStat("stealth")*.15;
  const finalAmount = Math.ceil(amount * penalty.heatExtra - reduction);
  state.heat = clamp(state.heat + finalAmount,0,100);

  if(state.heat >= 100){
    state.heat = 78;
    state.stats.lockdowns++;
    if(!state.heatSystem) state.heatSystem = {wanted:false,wantedUntil:0,raidCooldownUntil:0,lastWarning:0};
    state.heatSystem.wanted = true;
    state.heatSystem.wantedUntil = nowMs() + 4 * 60 * 1000;

    let fine = 220 + state.level*80;
    if(state.owned.tool_vault) fine = Math.floor(fine*.45);
    fine = Math.min(state.crypto,fine);

    const energyLoss = Math.min(state.energy, Math.floor(state.maxEnergy * (state.owned.tool_vault ? .12 : .25)));
    state.crypto -= fine;
    state.energy -= energyLoss;
    state.rep = Math.max(0,state.rep-(state.owned.tool_vault?10:30));

    log(`TRACE LOCKDOWN! Crypto hilang ₿${fmt(fine)}, Energy -${energyLoss}.`);
    toast("TRACE LOCKDOWN! Heat 100%. Crypto, energy, dan REP kena penalti.");
  }

  applyHighHeatPunishment("heat");
}

function spendEnergy(amount){
  if(state.energy < amount){
    toast("Energy tidak cukup. Istirahat dulu.");
    return false;
  }
  state.energy -= amount;
  return true;
}

function gain(reward){
  const socialMult = 1 + skillBonus("social")*.04;
  state.crypto += Math.floor((reward.crypto||0)*socialMult);
  state.exp += Math.floor((reward.exp||0)*(1+skillBonus("hardware")*.02));
  state.rep += Math.floor((reward.rep||0)*socialMult);
  if(reward.story) state.story += reward.story;
  while(state.exp >= state.expNeed){
    state.exp -= state.expNeed;
    state.level++;
    state.skillPoints++;
    state.expNeed = Math.floor(state.expNeed*1.32+45);
    state.maxEnergy += 5 + skillBonus("hardware")*2;
    state.energy = state.maxEnergy;
    log(`Level naik ke ${state.level}. Skill Point +1.`);
    toast(`LEVEL UP! Sekarang level ${state.level}.`);
  }
  checkAchievements();
}

function checkAchievements(){
  achievements.forEach(a=>{
    if(!state.achievements[a.id] && a.check(state)){
      state.achievements[a.id] = true;
      state.crypto += 150;
      state.rep += 10;
      log(`Achievement unlocked: ${a.name}. Bonus ₿150 + 10 REP.`);
      toast(`Achievement: ${a.name}`);
    }
  });
}

function rest(){
  const energyGain = Math.min(state.maxEnergy-state.energy, 35+skillBonus("ai")*4);
  state.energy += energyGain;
  state.heat = clamp(state.heat-6-skillBonus("stealth"),0,100);
  log(`Istirahat: Energy +${energyGain}, Heat turun.`);
  renderAll();
  toast("Istirahat selesai.");
}

function claimDaily(){
  const t = todayKey();
  if(state.lastDaily === t){
    toast("Daily reward hari ini sudah diambil.");
    return;
  }
  state.lastDaily = t;
  state.crypto += 350;
  state.energy = state.maxEnergy;
  state.rep += 15;
  log("Daily reward diambil: ₿350, Energy full, REP +15.");
  renderAll();
  toast("Daily reward diklaim.");
}

function showView(id){
  currentView = id;
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  const target = $(id);
  if(target) target.classList.add("active");
  renderAll();
  if(window.innerWidth <= 1050) closeSidebar();
}

function renderNav(){
  const nav = $("nav");
  if(!nav) return;
  nav.innerHTML = navItems.map(([id,label,ico]) => `
    <button type="button" class="${currentView===id ? "active" : ""}" data-nav-view="${id}">
      <span class="nav-left"><span class="nav-ico">${ico}</span>${label}</span>
      <span>›</span>
    </button>
  `).join("");

  nav.querySelectorAll("[data-nav-view]").forEach(btn=>{
    btn.onclick = (e)=>{
      e.preventDefault();
      e.stopPropagation();
      const view = btn.getAttribute("data-nav-view");
      if(view){
        showView(view);
      }
    };
  });
}

function renderTop(){
  $("aliasText").textContent = state.alias;
  $("rankText").textContent = getRank();
  $("usernameText").textContent = "@" + (state.username || "zerobyte");
  $("avatarText").textContent = getAvatarInitial();
  const tier = getHeatTier();
  isWantedActive();
  $("heatPill").textContent = `HEAT ${Math.floor(state.heat)}% · ${tier.name}`;
  $("heatPill").className = `heat-pill heat-${tier.name.toLowerCase()}`;
  $("ticker").innerHTML = `&gt; ${state.alias}@neon · @${state.username || "zerobyte"} · Lv ${state.level} · REP ${fmt(state.rep)} · ₿${fmt(state.crypto)} · ${state.activeQuest ? "Quest: "+state.activeQuest.title : "No active quest"} <span class="scanline">_</span>`;
}

function statCard(label,value,sub,percent,cls=""){
  return `<div class="card span-3">
    <h3>${label}</h3>
    <div class="value" style="font-size:24px">${value}</div>
    <p>${sub || ""}</p>
    ${percent !== undefined ? `<div class="bar"><div class="fill ${cls}" style="width:${clamp(percent,0,100)}%"></div></div>` : ""}
  </div>`;
}

function renderDashboard(){
  const expPct = state.exp/state.expNeed*100;
  const heatText = state.heat<26 ? "Aman" : state.heat<51 ? "Terpantau" : state.heat<76 ? "Diburu" : "Red Alert";
  $("dashboard").innerHTML = `
  <div class="grid">
    ${statCard("Level",state.level,`${fmt(state.exp)}/${fmt(state.expNeed)} EXP`,expPct,"purple")}
    ${statCard("Crypto",`₿${fmt(state.crypto)}`,"Mata uang underground")}
    ${statCard("Energy",`${Math.floor(state.energy)}/${Math.floor(state.maxEnergy)}`,"Quest & dungeon",state.energy/state.maxEnergy*100)}
    ${statCard("Heat",`${Math.floor(state.heat)}%`,heatText,state.heat,"red")}

    <div class="card span-8">
      <h2>Dashboard Operasi</h2>
      <p>Kamu adalah <b>${state.alias}</b> <span class="value">@${state.username}</span>. ${state.bio || ""}</p>
      <p>Jalankan quest random mini game, masuk dungeon, upgrade skill, beli tool, dan bongkar rahasia AUREX Corp.</p>
      <div class="actions">
        <button class="btn primary" type="button" data-go="quests">Ambil Quest</button>
        <button class="btn purple" type="button" data-go="terminal">Terminal</button>
        <button class="btn" type="button" data-action="profile">Edit Profile</button>
        <button class="btn warn" type="button" data-action="rest">Rest</button>
        <button class="btn" type="button" data-action="daily">Daily Reward</button>
        <button class="btn" type="button" data-action="random">Random Event</button>
      </div>
    </div>

    <div class="card span-4">
      <h2>Profil</h2>
      <div class="stat"><span>Alias</span><span class="value">${state.alias}</span></div>
      <div class="stat"><span>Username</span><span class="value">@${state.username}</span></div>
      <div class="stat"><span>Rank</span><span class="value">${getRank()}</span></div>
      <div class="stat"><span>Reputation</span><span class="value">${fmt(state.rep)}</span></div>
      <div class="stat"><span>Skill Point</span><span class="value">${state.skillPoints}</span></div>
      <div class="stat"><span>Quest Clear</span><span class="value">${state.stats.quests}</span></div>
    </div>

    <div class="card span-12 heat-panel ${getHeatTier().name.toLowerCase()}">
      <h2>Heat System</h2>
      <p><b>Status:</b> ${getHeatTier().name} — ${getHeatTier().desc}. ${getHeatPenalty().label}.</p>
      <div class="heat-rules">
        <div class="heat-rule"><b>60%+</b><span>Energy & Heat cost mulai naik.</span></div>
        <div class="heat-rule"><b>75%+</b><span>Reward turun dan scanner sering memberi warning.</span></div>
        <div class="heat-rule"><b>90%+</b><span>WANTED aktif: random Trace Raid bisa menyita crypto, energy, atau REP.</span></div>
        <div class="heat-rule"><b>100%</b><span>Trace Lockdown: penalti besar lalu Heat turun ke 78%.</span></div>
      </div>
      <div class="actions">
        <button class="btn purple" type="button" data-go="terminal">Clean via Terminal</button>
        <button class="btn warn" type="button" data-action="rest">Rest & Cooldown</button>
        <button class="btn" type="button" data-action="deepClean">Deep Clean ₿250</button>
      </div>
    </div>

    <div class="card span-6">
      <h2>Active Quest</h2>
      ${state.activeQuest ? questHTML(state.activeQuest,true) : `<p>Belum ada quest aktif.</p>`}
    </div>

    <div class="card span-6">
      <h2>Quick Log</h2>
      <div class="logbox">${state.logs.slice(-8).map(x=>`<div class="item">${x}</div>`).join("")}</div>
    </div>
  </div>`;
}

function openProfileModal(){
  $("modalPanel").innerHTML = `
    <h2>Edit Profile</h2>
    <p>Atur identitas hacker kamu.</p>
    <div class="list">
      <label class="item">
        <b>Alias Hacker</b>
        <input id="profileAlias" value="${escapeAttr(state.alias)}" maxlength="24" />
      </label>
      <label class="item">
        <b>Username</b>
        <input id="profileUsername" value="${escapeAttr(state.username)}" maxlength="20" placeholder="tanpa @" />
      </label>
      <label class="item">
        <b>Bio</b>
        <textarea id="profileBio" maxlength="120">${escapeHtml(state.bio || "")}</textarea>
      </label>
    </div>
    <div class="actions">
      <button class="btn primary" type="button" data-action="saveProfile">Save Profile</button>
      <button class="btn danger" type="button" data-action="closeModal">Cancel</button>
    </div>
  `;
  $("modal").classList.add("show");
}

function saveProfile(){
  const alias = ($("profileAlias")?.value || "ZeroByte").trim().slice(0,24) || "ZeroByte";
  const username = ($("profileUsername")?.value || "zerobyte").trim().toLowerCase().replace(/[^a-z0-9_.-]/g,"").slice(0,20) || "zerobyte";
  const bio = ($("profileBio")?.value || "").trim().slice(0,120);
  state.alias = alias;
  state.username = username;
  state.bio = bio;
  log(`Profile updated: ${alias} @${username}.`);
  closeModal();
  renderAll();
  toast("Profile disimpan.");
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

function escapeAttr(str){
  return escapeHtml(str).replace(/`/g,"&#96;");
}

function questHTML(q,active=false){
  return `<div class="item">
    <div class="item-head">
      <div><b>${q.title}</b><p>${q.desc}</p></div>
      <span class="tag ${q.type==="High Risk" ? "red" : q.type==="Main" ? "yellow" : ""}">${q.type}</span>
    </div>
    <div class="stat"><span>Reward</span><span class="value">₿${fmt(q.reward.crypto)} · ${q.reward.exp} EXP · ${q.reward.rep} REP</span></div>
    <div class="stat"><span>Cost / Risk</span><span>Energy ${Math.ceil(q.energy * getHeatPenalty().energyExtra)} · Heat +${Math.ceil(q.heat * getHeatPenalty().heatExtra)} ${getHeatPenalty().rewardMult<1 ? "· Reward penalty" : ""}</span></div>
    <div class="actions">
      ${active
        ? `<button class="btn primary" type="button" data-action="startQuest">Start Random Mini Game</button><button class="btn danger" type="button" data-action="cancelQuest">Cancel</button>`
        : `<button class="btn primary" type="button" data-quest="${q.id}">Accept</button>`
      }
    </div>
  </div>`;
}

function renderQuests(){
  $("quests").innerHTML = `<div class="grid">
    <div class="card span-12">
      <h2>Quest Board</h2>
      <p>Setiap quest memakai mini game random: Breach Sequence, Word Guess, Node Capture, Pipe Flow, Signal Timing, Memory Packet, Data Sorting, Stealth Route, atau Firewall Pattern.</p>
    </div>
    <div class="card span-12">
      <div class="list">${questPool.map(q=>questHTML(q,state.activeQuest && state.activeQuest.id===q.id)).join("")}</div>
    </div>
  </div>`;
}

function acceptQuest(id){
  const q = questPool.find(x=>x.id===id);
  state.activeQuest = clone(q);
  log(`Quest diterima: ${q.title}.`);
  renderAll();
  toast("Quest aktif.");
}

function cancelQuest(){
  if(!state.activeQuest) return;
  log(`Quest dibatalkan: ${state.activeQuest.title}.`);
  state.activeQuest = null;
  renderAll();
}

function startActiveQuest(){
  if(!state.activeQuest){
    toast("Tidak ada quest aktif.");
    return;
  }
  const q = state.activeQuest;
  const penalty = getHeatPenalty();
  const energyCost = Math.ceil(q.energy * penalty.energyExtra);
  if(!spendEnergy(energyCost)) return;
  if(penalty.energyExtra > 1) log(`Heat penalty: biaya energy quest naik menjadi ${energyCost}.`);
  miniGame = createRandomMiniGame(q);
  openMiniGame();
}

/* MINI GAMES */
function createRandomMiniGame(q){
  return pick([
    createBreachSequence,
    createWordGuess,
    createNodeCapture,
    createPipeFlow,
    createSignalTiming,
    createMemoryPacket,
    createDataSorting,
    createStealthRoute,
    createFirewallPattern
  ])(q);
}

function miniHeader(title,type){
  return `<div class="mini-title"><h2 style="margin:0">${title}</h2><span class="mini-badge">${type}</span></div>`;
}

function openMiniGame(){
  clearInterval(signalTimer);
  clearTimeout(memoryTimer);
  const map = {
    breach:renderBreachMiniGame,
    word:renderWordGuessMiniGame,
    node:renderNodeCaptureMiniGame,
    pipe:renderPipeFlowMiniGame,
    signal:renderSignalTimingMiniGame,
    memory:renderMemoryPacketMiniGame,
    sorting:renderDataSortingMiniGame,
    route:renderStealthRouteMiniGame,
    pattern:renderFirewallPatternMiniGame
  };
  if(miniGame && map[miniGame.type]) map[miniGame.type]();
  $("modal").classList.add("show");
}

function finishMiniGame(success,detail=""){
  clearInterval(signalTimer);
  clearTimeout(memoryTimer);
  const q = state.activeQuest;
  if(!q){
    closeModal();
    return;
  }

  const bonus = skillBonus("cracking")*2 + skillBonus("ai")*2 + totalStat("power")*.25;
  if(!success && Math.random()*100 < bonus){
    success = true;
    log("MIRA membantu menyelamatkan mini game yang hampir gagal.");
  }

  const penalty = getHeatPenalty();
  if(success){
    const adjustedReward = {
      crypto: Math.floor((q.reward.crypto || 0) * penalty.rewardMult),
      exp: Math.floor((q.reward.exp || 0) * penalty.rewardMult),
      rep: Math.floor((q.reward.rep || 0) * penalty.rewardMult),
      story: q.reward.story || 0
    };
    gain(adjustedReward);
    addHeat(Math.floor(q.heat*.45));
    state.stats.quests++;
    state.stats.minigames++;
    log(`Quest sukses: ${q.title}. Mini game: ${miniGame.name}. ${detail} ${penalty.rewardMult<1 ? "Reward terkena heat penalty." : ""}`);
    state.activeQuest = null;
    toast(`MISSION SUCCESS: ${miniGame.name}${penalty.rewardMult<1 ? " · reward penalty" : ""}`);
  }else{
    addHeat(q.heat+8);
    state.rep = Math.max(0,state.rep-penalty.failRepLoss);
    log(`Quest gagal: ${q.title}. Mini game: ${miniGame.name}. ${detail} REP -${penalty.failRepLoss}.`);
    state.activeQuest = null;
    toast(`MISSION FAILED: ${miniGame.name}`);
  }

  miniGame = null;
  checkAchievements();
  closeModal();
  renderAll();
}

function closeModal(){
  clearInterval(signalTimer);
  clearTimeout(memoryTimer);
  $("modal").classList.remove("show");
}



function miniGuideBox(label, text){
  return `<div class="guide-box"><b>${label}</b><span>${text}</span></div>`;
}

function miniStatusCard(label, text){
  return `<div class="mini-status-card"><b>${label}</b><span>${text}</span></div>`;
}

function miniThemeIcon(type){
  return ({
    password:"🔐",
    proxy:"🕸",
    port:"🧱",
    packet:"📡",
    forensic:"📜",
    exfil:"💾",
    social:"💬",
    breach:"⌘",
    signal:"📶"
  })[type] || "✦";
}

function miniScaffold({title,badge,subtitle,goal,how,tip,statusHtml="",bodyHtml="",actionsHtml="",progress=0}){
  const type = (miniGame && miniGame.type) ? miniGame.type : "password";
  const icon = miniThemeIcon(type);
  const safeProgress = clamp(progress || 0, 0, 100);
  return `${miniHeader(title,badge)}
    <div class="mini-shell theme-${type} hacker-op">
      <div class="op-hero">
        <div class="op-icon">${icon}</div>
        <div class="op-copy">
          <div class="op-kicker">LIVE OPERATION · ${badge}</div>
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>
      </div>
      <div class="op-progress-wrap">
        <div class="op-progress-top"><span>Operation Sync</span><span>${Math.round(safeProgress)}%</span></div>
        <div class="op-progress"><div class="op-progress-fill" style="width:${safeProgress}%"></div></div>
      </div>
      <div class="mini-guide">
        ${miniGuideBox("Tujuan", goal)}
        ${miniGuideBox("Cara Main", how)}
        ${miniGuideBox("Tips", tip)}
      </div>
      ${statusHtml ? `<div class="mini-status-grid">${statusHtml}</div>` : ""}
      <div class="mini-board hacker-board">
        <div class="mini-section-label">◈ Tactical Interface</div>
        ${bodyHtml}
      </div>
      ${actionsHtml ? `<div class="mini-actions">${actionsHtml}</div>` : ""}
    </div>`;
}

function createRandomMiniGame(q){
  return pick([
    createPasswordBreach,
    createProxyChain,
    createPortIntrusion,
    createPacketSniffer,
    createLogForensics,
    createDataExfiltration,
    createSocialEngineering
  ])(q);
}

function openMiniGame(){
  clearInterval(signalTimer);
  clearTimeout(memoryTimer);
  const map = {
    password:renderPasswordBreach,
    proxy:renderProxyChain,
    port:renderPortIntrusion,
    packet:renderPacketSniffer,
    forensic:renderLogForensics,
    exfil:renderDataExfiltration,
    social:renderSocialEngineering
  };
  if(miniGame && map[miniGame.type]) map[miniGame.type]();
  $("modal").classList.add("show");
}

/* 1. PASSWORD BREACH - Hacknet style terminal attack */
function createPasswordBreach(q){
  const users = [
    {user:"root", pass:"BLACKICE", hint:"highest privilege"},
    {user:"admin", pass:"NEONVAULT", hint:"system owner"},
    {user:"ops", pass:"GHOSTKEY", hint:"operation account"},
    {user:"backup", pass:"COLDSTORAGE", hint:"archive access"}
  ];
  const target = pick(users);
  const methods = [
    {id:"dictionary", name:"Dictionary Attack", clue:"Aman, dapat 1 hint tambahan", risk:8, power:55},
    {id:"bruteforce", name:"Brute Force", clue:"Cepat tapi trace naik", risk:18, power:80},
    {id:"phishing", name:"Social Clue", clue:"Minta clue dari data OSINT", risk:12, power:65}
  ];
  const candidates = shuffle([target.pass,"NEONROOT","SHADOWLOGIN","CACHEKEY","MIRRORPASS","ADMIN404","TOKENVAULT","DARKSHELL"]).slice(0,6);
  if(!candidates.includes(target.pass)) candidates[rand(0,candidates.length-1)] = target.pass;
  return {type:"password", name:"Password Breach", qDiff:q.difficulty, target, methods, candidates:shuffle(candidates), chosenMethod:null, attempts:3+Math.max(0,2-q.difficulty), clue:`Hint awal: ${target.hint}`, trace:0, maxTrace:40+q.difficulty*12};
}

function renderPasswordBreach(){
  const progress = miniGame.chosenMethod ? 45 + (3-miniGame.attempts)*15 : 10;
  const status = [
    miniStatusCard("Target User", miniGame.target.user),
    miniStatusCard("Attempts", `${miniGame.attempts} sisa`),
    miniStatusCard("Trace", `${miniGame.trace}/${miniGame.maxTrace}`)
  ].join("");
  const methodPanel = !miniGame.chosenMethod ? `
    <div class="fake-terminal">
      <div class="term-title">target://auth/${miniGame.target.user}</div>
      <p>> scan account --user ${miniGame.target.user}</p>
      <p>> hash detected: ${"*".repeat(rand(8,14))}</p>
      <p>> choose attack vector...</p>
    </div>
    <div class="op-card-grid">
      ${miniGame.methods.map(m=>`<button class="op-card" type="button" data-pw-method="${m.id}">
        <b>${m.name}</b><span>${m.clue}</span><small>Risk +${m.risk} · Power ${m.power}</small>
      </button>`).join("")}
    </div>` : `
    <div class="fake-terminal">
      <div class="term-title">attack://${miniGame.chosenMethod.name}</div>
      <p>> ${miniGame.chosenMethod.name.toLowerCase().replaceAll(" ","_")} --target ${miniGame.target.user}</p>
      <p>> ${miniGame.clue}</p>
      <p>> select password candidate...</p>
    </div>
    <div class="op-card-grid">
      ${miniGame.candidates.map(c=>`<button class="op-card password-card" type="button" data-pw-user="${c}">
        <b>${c}</b><span>candidate password</span>
      </button>`).join("")}
    </div>`;
  const actions = `<button class="btn danger" type="button" data-action="abortMini">Abort Operation</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Password Breach",
    badge:"AUTH BYPASS",
    subtitle:"Pilih attack vector, lalu tebak password dari candidate list.",
    goal:"Dapatkan password user target tanpa trace penuh.",
    how:"Pilih metode serangan. Setelah itu pilih candidate password yang paling cocok dengan hint.",
    tip:"Brute Force kuat tapi risk tinggi. Social Clue sering memberi petunjuk lebih jelas.",
    statusHtml:status,
    bodyHtml:methodPanel,
    actionsHtml:actions,
    progress
  });
}

function passwordMethod(id){
  const method = miniGame.methods.find(m=>m.id===id);
  if(!method) return;
  miniGame.chosenMethod = method;
  miniGame.trace += method.risk;
  if(id==="dictionary") miniGame.clue += ` · Pola kata: ${miniGame.target.pass.slice(0,2)}***`;
  if(id==="phishing") miniGame.clue += ` · OSINT leak: panjang ${miniGame.target.pass.length} huruf`;
  if(id==="bruteforce") miniGame.clue += " · Brute output tidak memberi clue tambahan";
  if(miniGame.trace>=miniGame.maxTrace) return finishMiniGame(false,"Trace penuh saat memilih attack vector.");
  renderPasswordBreach();
}

function passwordGuess(pass){
  if(pass===miniGame.target.pass) return finishMiniGame(true,`Credential ${miniGame.target.user}:${pass} berhasil didapat.`);
  miniGame.attempts--;
  miniGame.trace += rand(8,16);
  if(miniGame.attempts<=0 || miniGame.trace>=miniGame.maxTrace) return finishMiniGame(false,`Auth breach gagal. Password benar: ${miniGame.target.pass}.`);
  miniGame.clue += ` · ${pass} salah`;
  renderPasswordBreach();
}

/* 2. PROXY CHAIN BUILDER - Uplink / sonar inspired */
function createProxyChain(q){
  const safe = ["VPN-01","PROXY-SG","RELAY-TOR","MIRROR-ID","DARK-GW","CACHE-EU"];
  const bad = ["HONEYPOT","TRACE-NODE","PUBLIC-WIFI","LOG-SINK","MALWARE-GW"];
  const targetPath = shuffle(safe).slice(0,3+Math.min(2,q.difficulty));
  return {type:"proxy", name:"Proxy Chain Builder", qDiff:q.difficulty, safe, bad, nodes:shuffle([...safe,...bad]).slice(0,9), targetPath, selected:[], trace:0, maxTrace:35+q.difficulty*12};
}

function renderProxyChain(){
  const status = [
    miniStatusCard("Chain", `${miniGame.selected.length}/${miniGame.targetPath.length}`),
    miniStatusCard("Trace", `${miniGame.trace}/${miniGame.maxTrace}`),
    miniStatusCard("Goal", "HOME → TARGET")
  ].join("");
  const chosen = miniGame.selected.length ? miniGame.selected.join(" → ") : "HOME";
  const body = `
    <div class="proxy-radar-mini">
      <div class="radar-ring-mini r1"></div><div class="radar-ring-mini r2"></div><div class="radar-ring-mini r3"></div>
      <div class="radar-sweep-mini"></div>
      ${miniGame.nodes.map((n,i)=>{
        const angle = (i/miniGame.nodes.length)*Math.PI*2;
        const r = 34 + (i%3)*18;
        const x = 50 + Math.cos(angle)*r;
        const y = 50 + Math.sin(angle)*r;
        const picked = miniGame.selected.includes(n);
        const danger = miniGame.bad.includes(n);
        return `<button class="radar-dot-mini ${picked?"picked":""} ${danger?"danger":""}" style="left:${x}%;top:${y}%;" type="button" data-proxy-node="${n}"><span>${n}</span></button>`;
      }).join("")}
      <div class="radar-core-mini">HOME</div>
    </div>
    <div class="fake-terminal">
      <p>> build_proxy_chain --target AUREX</p>
      <p>> selected: ${chosen}</p>
      <p>> recommended safe path length: ${miniGame.targetPath.length} hops</p>
    </div>`;
  const actions = `<button class="btn warn" type="button" data-action="proxyUndo">Undo Hop</button><button class="btn primary" type="button" data-action="proxySubmit">Deploy Chain</button><button class="btn danger" type="button" data-action="abortMini">Abort</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Proxy Chain Builder",
    badge:"NETWORK ROUTE",
    subtitle:"Bangun jalur proxy aman di radar network.",
    goal:"Pilih node aman sampai chain cukup panjang, lalu deploy.",
    how:"Tap node di radar. Hindari HONEYPOT, TRACE-NODE, PUBLIC-WIFI, atau node jebakan lain.",
    tip:"Node merah berisiko. Chain panjang mengurangi trace, tapi salah node bisa fatal.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions,
    progress:(miniGame.selected.length/miniGame.targetPath.length)*100
  });
}

function proxyPick(node){
  if(miniGame.selected.includes(node)) return;
  miniGame.selected.push(node);
  if(miniGame.bad.includes(node)){
    miniGame.trace += rand(12,22);
    addHeat(3);
  }else{
    miniGame.trace += rand(2,7);
  }
  if(miniGame.trace>=miniGame.maxTrace) return finishMiniGame(false,"Proxy chain ketahuan scanner.");
  renderProxyChain();
}

function proxyUndo(){
  miniGame.selected.pop();
  renderProxyChain();
}

function proxySubmit(){
  const safeCount = miniGame.selected.filter(n=>!miniGame.bad.includes(n)).length;
  const badCount = miniGame.selected.length-safeCount;
  const ok = safeCount>=miniGame.targetPath.length && badCount===0;
  finishMiniGame(ok, ok ? "Proxy chain bersih dan aktif." : "Chain mengandung node berbahaya atau terlalu pendek.");
}

/* 3. PORT INTRUSION - Firewall / port exploit */
function createPortIntrusion(q){
  const all = [
    {port:22, svc:"SSH", exploit:"KEYSWAP", risk:12},
    {port:80, svc:"HTTP", exploit:"WEB-SHELL", risk:8},
    {port:443, svc:"HTTPS", exploit:"TLS-DOWN", risk:10},
    {port:3306, svc:"MYSQL", exploit:"SQL-DUMP", risk:14},
    {port:21, svc:"FTP", exploit:"ANON-FTP", risk:9}
  ];
  const open = shuffle(all).slice(0,3+Math.min(1,q.difficulty));
  const target = pick(open);
  return {type:"port", name:"Port Intrusion", qDiff:q.difficulty, ports:open, target, scanned:false, selectedPort:null, trace:0, maxTrace:42+q.difficulty*10};
}

function renderPortIntrusion(){
  const status = [
    miniStatusCard("Scan", miniGame.scanned?"Complete":"Needed"),
    miniStatusCard("Trace", `${miniGame.trace}/${miniGame.maxTrace}`),
    miniStatusCard("Target", miniGame.selectedPort?`Port ${miniGame.selectedPort.port}`:"Unknown")
  ].join("");
  const body = `
    <div class="firewall-rings">
      <div class="fw-ring fw1"></div><div class="fw-ring fw2"></div><div class="fw-ring fw3"></div>
      <div class="fw-core">${miniGame.scanned ? "OPEN PORTS FOUND" : "FIREWALL"}</div>
    </div>
    <div class="op-card-grid">
      ${miniGame.ports.map(p=>`<button class="op-card port-card" type="button" ${miniGame.scanned?`data-port-scan="${p.port}"`:"disabled"}>
        <b>${miniGame.scanned?`:${p.port}`:"???"}</b><span>${miniGame.scanned?p.svc:"SCAN REQUIRED"}</span><small>${miniGame.scanned?"tap pilih port":"jalankan scan dulu"}</small>
      </button>`).join("")}
    </div>
    ${miniGame.selectedPort?`<div class="op-card-grid">
      ${["KEYSWAP","WEB-SHELL","TLS-DOWN","SQL-DUMP","ANON-FTP"].map(ex=>`<button class="op-card" type="button" data-port-exploit="${ex}"><b>${ex}</b><span>exploit module</span></button>`).join("")}
    </div>`:""}`;
  const actions = `<button class="btn primary" type="button" data-action="portScan">Scan Ports</button><button class="btn danger" type="button" data-action="abortMini">Abort</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Port Intrusion",
    badge:"FIREWALL",
    subtitle:"Scan port, pilih layanan, lalu gunakan exploit yang cocok.",
    goal:"Masuk melalui port yang tepat dengan exploit yang sesuai.",
    how:"Tekan Scan Ports, pilih port, lalu pilih module exploit berdasarkan service.",
    tip:"SSH biasanya KEYSWAP, HTTP WEB-SHELL, HTTPS TLS-DOWN, MYSQL SQL-DUMP, FTP ANON-FTP.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions,
    progress: miniGame.selectedPort ? 68 : miniGame.scanned ? 35 : 5
  });
}

function portScan(){
  miniGame.scanned = true;
  miniGame.trace += rand(4,10);
  renderPortIntrusion();
}

function portSelect(port){
  miniGame.selectedPort = miniGame.ports.find(p=>String(p.port)===String(port));
  miniGame.trace += rand(2,8);
  renderPortIntrusion();
}

function portExploit(ex){
  const ok = miniGame.selectedPort && ex===miniGame.selectedPort.exploit;
  miniGame.trace += ok ? miniGame.selectedPort.risk : rand(16,26);
  if(miniGame.trace>=miniGame.maxTrace) return finishMiniGame(false,"Firewall trace penuh.");
  finishMiniGame(ok, ok ? `Exploit ${ex} berhasil pada port ${miniGame.selectedPort.port}.` : "Exploit tidak cocok dengan service.");
}

/* 4. PACKET SNIFFER */
function createPacketSniffer(q){
  const packets = ["PING","AUTH","CACHE","IMG","TOKEN","ROOT","MALWARE","LOG","SESSION","DNS"];
  const targets = shuffle(["TOKEN","ROOT","SESSION"]).slice(0,2+Math.min(1,q.difficulty));
  const stream = Array.from({length:10+q.difficulty*2},()=>pick(packets));
  targets.forEach(t=>stream[rand(0,stream.length-1)]=t);
  return {type:"packet", name:"Packet Sniffer", qDiff:q.difficulty, stream, targets, picked:[], trace:0, maxTrace:45+q.difficulty*10};
}

function renderPacketSniffer(){
  const status = [
    miniStatusCard("Target Packet", miniGame.targets.join(", ")),
    miniStatusCard("Captured", `${miniGame.picked.length}/${miniGame.targets.length}`),
    miniStatusCard("Trace", `${miniGame.trace}/${miniGame.maxTrace}`)
  ].join("");
  const body = `
    <div class="packet-stream">
      ${miniGame.stream.map((p,i)=>`<button class="packet-chip ${miniGame.picked.includes(i)?"picked":""}" type="button" data-sniff-packet="${i}"><b>${p}</b><small>#${String(i+1).padStart(2,"0")}</small></button>`).join("")}
    </div>
    <div class="fake-terminal"><p>> sniff --interface neon0</p><p>> capture target packets only: ${miniGame.targets.join(", ")}</p><p>> avoid noise packets to keep trace low.</p></div>`;
  const actions = `<button class="btn primary" type="button" data-action="sniffSubmit">Extract Packets</button><button class="btn danger" type="button" data-action="abortMini">Abort</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Packet Sniffer",
    badge:"TRAFFIC",
    subtitle:"Tangkap packet penting dari data stream.",
    goal:"Pilih packet target saja, lalu extract.",
    how:"Tap packet yang masuk kategori target. Jangan terlalu banyak memilih noise.",
    tip:"TOKEN, ROOT, dan SESSION biasanya bernilai tinggi. Packet lain bisa menaikkan trace.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions,
    progress:(miniGame.picked.length/miniGame.targets.length)*100
  });
}

function sniffPick(i){
  i = Number(i);
  if(miniGame.picked.includes(i)) miniGame.picked = miniGame.picked.filter(x=>x!==i);
  else miniGame.picked.push(i);
  renderPacketSniffer();
}

function sniffSubmit(){
  const selected = miniGame.picked.map(i=>miniGame.stream[i]);
  const hit = miniGame.targets.every(t=>selected.includes(t));
  const noise = selected.filter(p=>!miniGame.targets.includes(p)).length;
  miniGame.trace += noise*10;
  if(miniGame.trace>=miniGame.maxTrace) return finishMiniGame(false,"Terlalu banyak noise packet.");
  finishMiniGame(hit && noise<=1, hit ? "Packet penting berhasil diekstrak." : "Packet target belum lengkap.");
}

/* 5. LOG FORENSICS */
function createLogForensics(q){
  const cases = [
    {q:"IP mana yang melakukan privilege escalation?", answer:"10.0.4.66", logs:["09:12 172.16.1.9 login failed","09:13 10.0.4.66 sudo exploit","09:14 10.0.4.66 root shell","09:15 192.168.0.2 ping"]},
    {q:"File mana yang diubah setelah login admin?", answer:"vault.db", logs:["18:02 admin login success","18:04 config.ini read","18:06 vault.db modified","18:08 session closed"]},
    {q:"Event mana yang memicu alarm?", answer:"root shell", logs:["01:22 guest login","01:23 token read","01:24 root shell","01:25 alarm triggered"]}
  ];
  const c = pick(cases);
  return {type:"forensic", name:"Log Forensics", qDiff:q.difficulty, case:c, trace:0, maxTrace:35+q.difficulty*8};
}

function renderLogForensics(){
  const options = shuffle([...new Set([...miniGame.case.logs.flatMap(l=>l.split(" ")).filter(x=>x.length>3), miniGame.case.answer])]).slice(0,7);
  if(!options.includes(miniGame.case.answer)) options[0]=miniGame.case.answer;
  miniGame.options = shuffle(options);
  const status = [
    miniStatusCard("Evidence", `${miniGame.case.logs.length} logs`),
    miniStatusCard("Trace", `${miniGame.trace}/${miniGame.maxTrace}`),
    miniStatusCard("Mode", "Investigation")
  ].join("");
  const body = `
    <div class="log-viewer">
      ${miniGame.case.logs.map(l=>`<div><span>SYSLOG</span>${l}</div>`).join("")}
    </div>
    <div class="mini-sequence"><b>Pertanyaan</b><br>${miniGame.case.q}</div>
    <div class="op-card-grid">${miniGame.options.map(o=>`<button class="op-card" type="button" data-log-answer="${o}"><b>${o}</b><span>evidence answer</span></button>`).join("")}</div>`;
  const actions = `<button class="btn danger" type="button" data-action="abortMini">Abort</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Log Forensics",
    badge:"EVIDENCE",
    subtitle:"Analisis log dan cari bukti yang benar.",
    goal:"Jawab pertanyaan berdasarkan log yang tampil.",
    how:"Baca log baris demi baris, lalu pilih jawaban yang paling cocok.",
    tip:"Cari hubungan sebab-akibat: login, file modified, root shell, atau alarm.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions,
    progress:50
  });
}

function logAnswer(ans){
  finishMiniGame(ans===miniGame.case.answer, ans===miniGame.case.answer ? "Analisis log akurat." : "Analisis log salah.");
}

/* 6. DATA EXFILTRATION */
function createDataExfiltration(q){
  const files = [
    {name:"admin_keys.enc", value:5, trap:false, size:2},
    {name:"finance_dump.csv", value:4, trap:false, size:3},
    {name:"employee_photo.zip", value:1, trap:false, size:2},
    {name:"honeypot_payload.exe", value:0, trap:true, size:2},
    {name:"token_backup.json", value:4, trap:false, size:1},
    {name:"trace_marker.log", value:0, trap:true, size:1}
  ];
  return {type:"exfil", name:"Data Exfiltration", qDiff:q.difficulty, files:shuffle(files), picked:[], capacity:5+Math.max(0,2-q.difficulty), trace:0, maxTrace:45+q.difficulty*10};
}

function renderDataExfiltration(){
  const size = miniGame.picked.reduce((a,i)=>a+miniGame.files[i].size,0);
  const value = miniGame.picked.reduce((a,i)=>a+miniGame.files[i].value,0);
  const status = [
    miniStatusCard("Storage", `${size}/${miniGame.capacity} GB`),
    miniStatusCard("Value", `${value} pts`),
    miniStatusCard("Trace", `${miniGame.trace}/${miniGame.maxTrace}`)
  ].join("");
  const body = `
    <div class="file-grid">
      ${miniGame.files.map((f,i)=>`<button class="file-card ${miniGame.picked.includes(i)?"picked":""} ${f.trap?"trap":""}" type="button" data-file-pick="${i}">
        <b>${f.name}</b><span>${f.size} GB · value ${f.value}</span><small>${f.trap?"suspicious file":"data file"}</small>
      </button>`).join("")}
    </div>
    <div class="fake-terminal"><p>> exfil --max ${miniGame.capacity}GB</p><p>> avoid honeypot and trace marker files.</p></div>`;
  const actions = `<button class="btn primary" type="button" data-action="exfilSubmit">Extract Selected</button><button class="btn danger" type="button" data-action="abortMini">Abort</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Data Exfiltration",
    badge:"LOOT",
    subtitle:"Pilih file bernilai tinggi tanpa melewati kapasitas dan tanpa jebakan.",
    goal:"Kumpulkan value minimal 6 tanpa mengambil file trap.",
    how:"Tap file untuk pilih/batal. Perhatikan ukuran storage dan label suspicious.",
    tip:"File bernama honeypot atau trace biasanya jebakan walau tampak penting.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions,
    progress:Math.min(100,(value/6)*100)
  });
}

function filePick(i){
  i=Number(i);
  if(miniGame.picked.includes(i)) miniGame.picked=miniGame.picked.filter(x=>x!==i);
  else miniGame.picked.push(i);
  renderDataExfiltration();
}

function exfilSubmit(){
  const selected = miniGame.picked.map(i=>miniGame.files[i]);
  const size = selected.reduce((a,f)=>a+f.size,0);
  const value = selected.reduce((a,f)=>a+f.value,0);
  const trap = selected.some(f=>f.trap);
  if(size>miniGame.capacity) return finishMiniGame(false,"Storage penuh, transfer terdeteksi.");
  if(trap) return finishMiniGame(false,"File jebakan ikut diekstrak.");
  finishMiniGame(value>=6, value>=6 ? "Data bernilai berhasil diekstrak." : "Data yang diambil kurang bernilai.");
}

/* 7. SOCIAL ENGINEERING CHAT */
function createSocialEngineering(q){
  const scenario = pick([
    {
      npc:"Helpdesk Rina",
      role:"IT Helpdesk",
      goal:"server key",
      finalKey:"SRV-NEON-7741",
      clue:"Rina takut melanggar SOP, tapi responsif kalau konteksnya maintenance resmi.",
      steps:[
        {
          npc:"Halo, ini helpdesk. Ada tiket yang perlu dicek?",
          good:"Sapa sopan dan sebut tiket maintenance",
          neutral:"Langsung bilang ada gangguan login",
          bad:"Minta password admin sekarang",
          goodNpc:"Oh iya, kalau ada nomor tiket saya bisa bantu cek.",
          neutralNpc:"Gangguan login banyak, perlu detail dulu.",
          badNpc:"Maaf, saya tidak bisa memberikan password. Ini mencurigakan."
        },
        {
          npc:"Nomor tiketnya apa dan sistem mana yang terdampak?",
          good:"Berikan tiket palsu yang terlihat valid",
          neutral:"Bilang tiketnya dibuat oleh supervisor",
          bad:"Tekan dia agar tidak banyak tanya",
          goodNpc:"Format tiketnya benar. Sistem yang sering bermasalah biasanya NeonVault.",
          neutralNpc:"Supervisor siapa? Saya perlu verifikasi.",
          badNpc:"Saya akan laporkan percakapan ini ke security."
        },
        {
          npc:"Untuk NeonVault, biasanya butuh environment dan server tag.",
          good:"Minta server tag untuk memastikan environment",
          neutral:"Tanya semua daftar server internal",
          bad:"Kirim link login palsu",
          goodNpc:"Environment staging memakai tag NV-STG. Production jangan disentuh tanpa approval.",
          neutralNpc:"Saya tidak boleh kirim semua daftar server.",
          badNpc:"Link itu aneh. Saya hentikan chat ini."
        },
        {
          npc:"Apa yang perlu saya tulis di catatan tiket?",
          good:"Minta hanya key staging untuk audit checksum",
          neutral:"Minta file konfigurasi lengkap",
          bad:"Minta akses production root",
          goodNpc:"Baik, untuk staging checksum key-nya bisa dipakai sebentar.",
          neutralNpc:"File konfigurasi lengkap tidak bisa saya bagikan.",
          badNpc:"Permintaan root access dilarang."
        }
      ]
    },
    {
      npc:"Admin Bayu",
      role:"System Admin",
      goal:"OTP seed clue",
      finalKey:"OTP-SEED: KAGUYA-19",
      clue:"Bayu percaya audit resmi, tapi cepat curiga jika diminta akses langsung.",
      steps:[
        {
          npc:"Saya Bayu dari sysadmin. Audit apa ya?",
          good:"Kenalkan diri sebagai auditor internal",
          neutral:"Bilang diminta cek keamanan akun",
          bad:"Menyamar jadi direktur dan memerintah",
          goodNpc:"Oke, audit internal biasanya butuh scope dan window.",
          neutralNpc:"Cek keamanan akun? Scope-nya belum jelas.",
          badNpc:"Gaya bahasanya tidak seperti direktur kami."
        },
        {
          npc:"Scope auditnya mencakup apa?",
          good:"Sebut MFA rotation dan token expiry",
          neutral:"Sebut semua sistem sekaligus",
          bad:"Minta OTP aktif miliknya",
          goodNpc:"MFA rotation memang masuk agenda bulan ini.",
          neutralNpc:"Semua sistem terlalu luas.",
          badNpc:"OTP aktif tidak boleh dibagikan."
        },
        {
          npc:"Saya perlu bukti bahwa request ini bukan phishing.",
          good:"Kirim referensi kebijakan audit fiktif",
          neutral:"Bilang waktunya mendesak",
          bad:"Ancam akan melaporkan dia",
          goodNpc:"Referensinya cocok dengan format policy lama.",
          neutralNpc:"Urgensi bukan bukti valid.",
          badNpc:"Ancaman seperti itu saya catat."
        },
        {
          npc:"Saya bisa bantu dengan data non-production.",
          good:"Minta seed clue sandbox, bukan OTP aktif",
          neutral:"Minta screenshot authenticator",
          bad:"Minta backup MFA semua admin",
          goodNpc:"Untuk sandbox, seed clue lama masih dipakai.",
          neutralNpc:"Screenshot authenticator tetap sensitif.",
          badNpc:"Permintaan itu sangat berbahaya."
        }
      ]
    },
    {
      npc:"Intern Dewa",
      role:"Junior Intern",
      goal:"internal email key",
      finalKey:"MAIL-GATE: dewa.ops@aurex.local",
      clue:"Dewa mudah percaya kalau ngobrol santai, tapi panik kalau ditekan.",
      steps:[
        {
          npc:"Halo kak, maaf aku masih intern. Ini siapa ya?",
          good:"Ngobrol santai dan bilang dari tim dokumentasi",
          neutral:"Bilang dari IT pusat",
          bad:"Bilang akunnya akan diblokir",
          goodNpc:"Oh tim dokumentasi? Aku pernah diminta update wiki juga.",
          neutralNpc:"IT pusat? Aku belum pernah dengar kontak ini.",
          badNpc:"Diblokir? Aku harus tanya mentor dulu."
        },
        {
          npc:"Dokumentasi bagian apa ya kak?",
          good:"Sebut update wiki onboarding karyawan",
          neutral:"Sebut audit semua email",
          bad:"Minta dia forward email rahasia",
          goodNpc:"Onboarding pakai wiki internal, iya aku pernah buka.",
          neutralNpc:"Audit semua email terdengar serem.",
          badNpc:"Aku tidak boleh forward email rahasia."
        },
        {
          npc:"Aku biasanya login pakai akun mentor, bukan akun sendiri.",
          good:"Tanya format email internal untuk wiki",
          neutral:"Tanya akun mentor dan password",
          bad:"Suruh dia pinjamkan akun mentor",
          goodNpc:"Format email internal biasanya nama.tim@aurex.local.",
          neutralNpc:"Password mentor jelas tidak boleh.",
          badNpc:"Itu melanggar aturan kantor."
        },
        {
          npc:"Contoh yang aman boleh aku kasih, tapi jangan yang sensitif.",
          good:"Minta contoh email ops untuk dummy data",
          neutral:"Minta semua kontak tim ops",
          bad:"Minta akses mailbox ops",
          goodNpc:"Contoh dummy ops bisa, jangan dipakai untuk login sungguhan ya.",
          neutralNpc:"Semua kontak tidak bisa aku kasih.",
          badNpc:"Akses mailbox? Aku stop dulu."
        }
      ]
    }
  ]);
  return {
    type:"social",
    name:"Social Engineering Chat",
    qDiff:q.difficulty,
    scenario,
    trust:35,
    suspicion:8,
    step:0,
    chat:[
      {who:"sys", text:`Objective: dapatkan ${scenario.goal}. Intel: ${scenario.clue}`},
      {who:"npc", name:scenario.npc, text:scenario.steps[0].npc}
    ],
    obtained:false
  };
}

function renderSocialEngineering(){
  const done = miniGame.step >= miniGame.scenario.steps.length;
  const current = miniGame.scenario.steps[Math.min(miniGame.step, miniGame.scenario.steps.length-1)];
  const status = [
    miniStatusCard("Trust", `${miniGame.trust}%`),
    miniStatusCard("Suspicion", `${miniGame.suspicion}%`),
    miniStatusCard("Progress", `${Math.min(miniGame.step+1,miniGame.scenario.steps.length)}/${miniGame.scenario.steps.length}`)
  ].join("");

  const choices = done ? `
    <div class="op-card-grid">
      <button class="op-card" type="button" data-social-finish="extract"><b>Extract Key</b><span>Ambil intel yang sudah didapat</span></button>
      <button class="op-card danger-card" type="button" data-social-finish="push"><b>Push for More</b><span>Risiko tinggi, coba minta data tambahan</span></button>
    </div>` : `
    <div class="op-card-grid">
      <button class="op-card" type="button" data-social-reply="good"><b>${current.good}</b><span>trust approach</span><small>Trust naik besar · suspicion rendah</small></button>
      <button class="op-card" type="button" data-social-reply="neutral"><b>${current.neutral}</b><span>neutral approach</span><small>Efek sedang</small></button>
      <button class="op-card danger-card" type="button" data-social-reply="bad"><b>${current.bad}</b><span>aggressive approach</span><small>Suspicion naik tinggi</small></button>
    </div>`;

  const body = `
    <div class="chat-window expanded-chat">
      ${miniGame.chat.map(msg=>{
        if(msg.who==="npc") return `<div class="chat-msg npc"><b>${msg.name}</b><span>${msg.text}</span></div>`;
        if(msg.who==="player") return `<div class="chat-msg player"><b>${state.alias}</b><span>${msg.text}</span></div>`;
        return `<div class="chat-msg sys"><span>${msg.text}</span></div>`;
      }).join("")}
    </div>
    ${choices}`;

  const actions = `<button class="btn danger" type="button" data-action="abortMini">Abort Chat</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Social Engineering Chat",
    badge:"OSINT DIALOGUE",
    subtitle:"Bangun kepercayaan lewat beberapa tahap percakapan sampai intel/key terbuka.",
    goal:`Dapatkan ${miniGame.scenario.goal} tanpa membuat NPC curiga.`,
    how:"Pilih respons paling masuk akal di setiap tahap. Respons baik menaikkan trust, respons agresif menaikkan suspicion.",
    tip:"Jangan langsung minta password/key. Buat konteks dulu, validasi alasan, lalu minta data yang terlihat aman.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions,
    progress:(miniGame.step/miniGame.scenario.steps.length)*100
  });

  const chat = document.querySelector(".expanded-chat");
  if(chat) chat.scrollTop = chat.scrollHeight;
}

function socialReply(kind){
  const current = miniGame.scenario.steps[miniGame.step];
  if(!current) return;
  let replyText = current[kind] || current.neutral;
  let npcText = current[`${kind}Npc`] || current.neutralNpc;

  miniGame.chat.push({who:"player", text:replyText});
  miniGame.chat.push({who:"npc", name:miniGame.scenario.npc, text:npcText});

  if(kind==="good"){
    miniGame.trust += rand(18,26);
    miniGame.suspicion += rand(2,6);
  }else if(kind==="neutral"){
    miniGame.trust += rand(5,12);
    miniGame.suspicion += rand(10,18);
  }else{
    miniGame.trust -= rand(10,18);
    miniGame.suspicion += rand(28,42);
    addHeat(3);
  }

  miniGame.trust = clamp(miniGame.trust,0,100);
  miniGame.suspicion = clamp(miniGame.suspicion,0,100);
  miniGame.step++;

  if(miniGame.suspicion >= 70){
    miniGame.chat.push({who:"sys", text:"ALERT: NPC curiga dan meneruskan chat ke security."});
    return finishMiniGame(false,"NPC curiga dan melapor ke security.");
  }

  if(miniGame.step >= miniGame.scenario.steps.length){
    if(miniGame.trust >= 68){
      miniGame.chat.push({who:"npc", name:miniGame.scenario.npc, text:`Oke, ini data yang bisa saya bagikan: ${miniGame.scenario.finalKey}`});
      miniGame.chat.push({who:"sys", text:"KEY READY: pilih Extract Key untuk menyelesaikan operasi."});
      miniGame.obtained = true;
    }else{
      miniGame.chat.push({who:"npc", name:miniGame.scenario.npc, text:"Maaf, saya belum cukup yakin untuk membagikan data itu."});
      miniGame.chat.push({who:"sys", text:"Trust belum cukup. Kamu bisa Push for More, tapi risikonya tinggi."});
    }
  }else{
    miniGame.chat.push({who:"npc", name:miniGame.scenario.npc, text:miniGame.scenario.steps[miniGame.step].npc});
  }

  renderSocialEngineering();
}

function socialFinish(mode){
  if(mode==="extract"){
    if(miniGame.obtained && miniGame.trust >= 68 && miniGame.suspicion < 70){
      return finishMiniGame(true,`Social intel didapat: ${miniGame.scenario.finalKey}.`);
    }
    return finishMiniGame(false,"Trust belum cukup untuk extract key.");
  }

  miniGame.chat.push({who:"player", text:"Saya butuh detail tambahan untuk validasi akhir."});
  miniGame.suspicion += rand(18,30);
  miniGame.trust += rand(0,8);

  if(miniGame.suspicion >= 70){
    return finishMiniGame(false,"Push terlalu agresif. NPC curiga dan chat dihentikan.");
  }

  miniGame.obtained = true;
  miniGame.chat.push({who:"npc", name:miniGame.scenario.npc, text:`Baik, tapi ini terakhir ya: ${miniGame.scenario.finalKey}`});
  miniGame.chat.push({who:"sys", text:"KEY READY: pilih Extract Key untuk menyelesaikan operasi."});
  renderSocialEngineering();
}


/* TERMINAL */
function renderTerminal(){
  if(terminalBooted && currentView==="terminal") return;
  terminalBooted = true;
  $("terminal").innerHTML = `<div class="grid">
    <div class="card span-8">
      <h2>Neon Terminal</h2>
      <div class="terminal" id="termOut">
        <p class="line green">CYBERTRACE NEON SHELL v11.0</p>
        <p class="line">Command fiktif: <span class="yellowtxt">scan</span>, <span class="yellowtxt">clean</span>, <span class="yellowtxt">trace</span>, <span class="yellowtxt">bounty</span>, <span class="yellowtxt">status</span>, <span class="yellowtxt">help</span></p>
        <p class="line bluetxt">Semua command hanya simulasi game.</p>
      </div>
      <div class="input-row"><input id="termInput" placeholder="ketik command..."><button class="btn primary" id="termRun" type="button">Run</button></div>
    </div>
    <div class="card span-4">
      <h2>Command Effect</h2>
      <div class="stat"><span>scan</span><span>reward kecil</span></div>
      <div class="stat"><span>clean</span><span>turunkan Heat</span></div>
      <div class="stat"><span>trace</span><span>cek status Heat</span></div>
      <div class="stat"><span>bounty</span><span>kontrak mini</span></div>
      <div class="stat"><span>status</span><span>lihat profil</span></div>
    </div>
  </div>`;
  $("termRun").addEventListener("click",runTerminal);
  $("termInput").addEventListener("keydown",e=>{ if(e.key==="Enter") runTerminal(); });
}

function termPrint(html){
  const out = $("termOut");
  out.innerHTML += html;
  out.scrollTop = out.scrollHeight;
}

function runTerminal(){
  const input = $("termInput");
  const cmd = (input.value || "").trim().toLowerCase();
  if(!cmd) return;
  input.value = "";
  termPrint(`<p class="line green">&gt; ${escapeHtml(cmd)}</p>`);

  if(cmd==="help"){
    termPrint(`<p class="line">Available: scan, clean, trace, bounty, status, clear</p>`);
  }else if(cmd==="clear"){
    terminalBooted = false;
    renderTerminal();
  }else if(cmd==="status"){
    termPrint(`<p class="line">Lv ${state.level} · @${state.username} · REP ${fmt(state.rep)} · ₿${fmt(state.crypto)} · Heat ${Math.floor(state.heat)}% · Energy ${Math.floor(state.energy)}/${Math.floor(state.maxEnergy)}</p>`);
  }else if(cmd==="trace"){
    termPrint(`<p class="line yellowtxt">${state.heat<30 ? "Trace rendah. Aman." : state.heat<70 ? "Trace aktif. Hati-hati." : "Red Alert. Bersihkan jejak."}</p>`);
  }else if(cmd==="clean"){
    const cost = 80;
    if(state.crypto < cost){
      termPrint(`<p class="line redtxt">Crypto tidak cukup.</p>`);
      return;
    }
    state.crypto -= cost;
    const down = 10 + skillBonus("stealth")*2 + (state.owned.tool_cleaner ? 8 : 0);
    state.heat = clamp(state.heat-down,0,100);
    log(`Terminal clean: Heat -${down}.`);
    termPrint(`<p class="line bluetxt">Trace cleaner aktif. Heat -${down}.</p>`);
    renderTop();
    saveGame(false);
  }else if(cmd==="scan"){
    if(!spendEnergy(5)){
      termPrint(`<p class="line redtxt">Energy tidak cukup.</p>`);
      return;
    }
    const roll = rand(1,100) + skillBonus("ai")*3 + totalStat("speed")*.5;
    if(roll > 46){
      const c = rand(45,130);
      const e = rand(8,22);
      state.crypto += c;
      state.exp += e;
      addHeat(3);
      gain({});
      log(`Terminal scan sukses: ₿${c}, ${e} EXP.`);
      termPrint(`<p class="line green">Scan sukses. Dapat ₿${c} dan ${e} EXP.</p>`);
    }else{
      addHeat(9);
      log("Terminal scan gagal. Heat naik.");
      termPrint(`<p class="line redtxt">Scan gagal. Heat naik.</p>`);
    }
    renderTop();
    saveGame(false);
  }else if(cmd==="bounty"){
    if(!spendEnergy(10)){
      termPrint(`<p class="line redtxt">Energy tidak cukup.</p>`);
      return;
    }
    const reward = {crypto:rand(90,240),exp:rand(20,55),rep:rand(3,12)};
    gain(reward);
    addHeat(rand(5,12));
    log(`Mini bounty selesai: ₿${reward.crypto}.`);
    termPrint(`<p class="line green">Mini bounty selesai. Reward ₿${reward.crypto}, ${reward.exp} EXP.</p>`);
    renderTop();
    saveGame(false);
  }else{
    addHeat(2);
    termPrint(`<p class="line redtxt">Unknown command. Noise terdeteksi. Heat +2.</p>`);
    renderTop();
    saveGame(false);
  }
}

/* DUNGEON & BATTLE */
function renderDungeon(){
  const boss = state.dungeonFloor >= 5;
  $("dungeon").innerHTML = `<div class="grid">
    <div class="card span-7">
      <h2>Abandoned Data Center</h2>
      <p>Dungeon server 5 lantai. Lantai 5 berisi boss Firewall Guardian.</p>
      <div class="stat"><span>Current Floor</span><span class="value">${state.dungeonFloor}/5</span></div>
      <div class="stat"><span>Status Boss</span><span>${state.dungeonBossDefeated ? "Defeated" : "Active"}</span></div>
      <div class="actions"><button class="btn primary" type="button" data-action="enterDungeon">Enter Floor</button><button class="btn warn" type="button" data-action="exitDungeon">Exit / Reset</button></div>
    </div>
    <div class="card span-5">
      <h2>Dungeon Rules</h2>
      <div class="stat"><span>Energy Cost</span><span>18/floor</span></div>
      <div class="stat"><span>Normal Floor</span><span>Random enemy</span></div>
      <div class="stat"><span>Boss Floor</span><span>${boss ? "Ready" : "Locked"}</span></div>
    </div>
    <div class="card span-12">
      <h2>Server Layout</h2>
      <div class="map-nodes">
        ${[1,2,3,4,5].map(n=>`<div class="card node ${state.dungeonFloor<n ? "locked" : ""}">
          <b>Floor ${n}</b>
          <p>${n===5 ? "Boss: Firewall Guardian" : ["Broken Login Gate","Malware Nest","Corrupted Archive","Dark Relay Hall"][n-1]}</p>
          <span class="tag ${n===5 ? "red" : ""}">${state.dungeonFloor>n || state.dungeonBossDefeated ? "Cleared" : state.dungeonFloor===n ? "Current" : "Locked"}</span>
        </div>`).join("")}
      </div>
    </div>
  </div>`;
}

function enterDungeon(){
  const penalty = getHeatPenalty();
  const cost = Math.ceil(18 * penalty.energyExtra);
  if(!spendEnergy(cost)) return;
  if(penalty.energyExtra > 1) log(`Heat penalty: biaya energy dungeon naik menjadi ${cost}.`);
  addHeat(8+state.dungeonFloor*2);
  const enemyIndex = state.dungeonFloor>=5 ? 3 : rand(0,Math.min(2,state.dungeonFloor));
  startBattle(clone(enemies[enemyIndex]),true);
}

function exitDungeon(){
  state.dungeonFloor = 1;
  log("Keluar dungeon. Floor reset ke 1.");
  renderAll();
}

function startBattle(enemy,fromDungeon=false){
  const playerHp = 120+state.level*22+skillBonus("defense")*12;
  state.battle = {
    fromDungeon,
    playerHp,
    playerMaxHp:playerHp,
    enemyHp:enemy.hp+state.level*8,
    enemyMaxHp:enemy.hp+state.level*8,
    enemyShield:enemy.shield,
    enemy
  };
  log(`Battle dimulai melawan ${enemy.name}.`);
  showView("battle");
}

function renderBattle(){
  const b = state.battle;
  if(!b){
    $("battle").innerHTML = `<div class="grid"><div class="card span-12">
      <h2>Battle Simulator</h2>
      <p>Tidak ada battle aktif.</p>
      <div class="actions"><button class="btn primary" type="button" data-train="0">Training Bot</button><button class="btn purple" type="button" data-train="1">Firewall Node</button></div>
    </div></div>`;
    return;
  }

  $("battle").innerHTML = `<div class="grid"><div class="card span-12">
    <h2>Cyber Battle</h2>
    <div class="battle-area">
      <div class="fighter">
        <h3>${state.alias}</h3>
        <div class="bar"><div class="fill" style="width:${b.playerHp/b.playerMaxHp*100}%"></div></div>
        <p>HP ${Math.max(0,Math.floor(b.playerHp))}/${b.playerMaxHp}</p>
        <p>Power ${Math.floor(10+state.level*3+skillBonus("cracking")*5+totalStat("power"))} · Defense ${skillBonus("defense")}</p>
      </div>
      <div class="fighter">
        <div class="enemy-art">${b.enemy.icon}</div>
        <h3>${b.enemy.name}</h3>
        <div class="bar"><div class="fill red" style="width:${b.enemyHp/b.enemyMaxHp*100}%"></div></div>
        <p>HP ${Math.max(0,Math.floor(b.enemyHp))}/${b.enemyMaxHp} · Shield ${Math.max(0,Math.floor(b.enemyShield))}</p>
      </div>
    </div>
    <div class="actions">
      <button class="btn primary" type="button" data-battle="attack">Attack</button>
      <button class="btn purple" type="button" data-battle="decrypt">Decrypt</button>
      <button class="btn warn" type="button" data-battle="hide">Hide</button>
      <button class="btn" type="button" data-battle="patch">Patch</button>
      <button class="btn danger" type="button" data-action="fleeBattle">Flee</button>
    </div>
  </div></div>`;
}

function battleAction(type){
  const b = state.battle;
  if(!b) return;
  let msg = "";
  const power = 10+state.level*3+skillBonus("cracking")*5+totalStat("power");

  if(type==="attack"){
    let dmg = rand(power,power+22);
    if(b.enemyShield>0){
      const s = Math.min(b.enemyShield,Math.floor(dmg*.55));
      b.enemyShield -= s;
      dmg -= s;
    }
    b.enemyHp -= dmg;
    msg = `Attack Script memberi ${dmg} damage.`;
  }

  if(type==="decrypt"){
    let shieldDmg = rand(24,48)+skillBonus("cracking")*6+(state.owned.tool_decrypt?18:0);
    let hpDmg = rand(8,20)+skillBonus("ai")*3;
    b.enemyShield -= shieldDmg;
    if(b.enemyShield<0){
      hpDmg += Math.abs(b.enemyShield);
      b.enemyShield = 0;
    }
    b.enemyHp -= hpDmg;
    msg = `Decrypt Blast: shield -${shieldDmg}, HP -${hpDmg}.`;
  }

  if(type==="hide"){
    const down = 8+skillBonus("stealth")*3+totalStat("stealth")*.4;
    state.heat = clamp(state.heat-down,0,100);
    msg = `Proxy Hide aktif. Heat -${Math.floor(down)}.`;
  }

  if(type==="patch"){
    const heal = 18+skillBonus("defense")*8+skillBonus("ai")*2;
    b.playerHp = clamp(b.playerHp+heal,0,b.playerMaxHp);
    msg = `Patch Defense memulihkan ${heal} HP.`;
  }

  log(msg);
  if(b.enemyHp<=0) return winBattle();
  enemyTurn();
  renderAll();
}

function enemyTurn(){
  const b = state.battle;
  if(!b) return;
  let dmg = b.enemy.atk+rand(0,12)+Math.floor(state.level*1.5);
  dmg = Math.max(3,dmg-skillBonus("defense")*3);
  b.playerHp -= dmg;
  addHeat(rand(2,6));
  log(`${b.enemy.name} menyerang balik: ${dmg} damage.`);
  if(b.playerHp<=0) loseBattle();
}

function winBattle(){
  const b = state.battle;
  const penalty = getHeatPenalty();
  const adjustedReward = {
    crypto: Math.floor((b.enemy.reward.crypto || 0) * penalty.rewardMult),
    exp: Math.floor((b.enemy.reward.exp || 0) * penalty.rewardMult),
    rep: Math.floor((b.enemy.reward.rep || 0) * penalty.rewardMult)
  };
  gain(adjustedReward);
  addHeat(b.fromDungeon?6:3);
  state.stats.battles++;
  log(`Battle menang: ${b.enemy.name}.`);

  if(b.fromDungeon){
    if(state.dungeonFloor>=5){
      state.dungeonBossDefeated = true;
      state.dungeonFloor = 1;
      state.stats.bosses++;
      gain({crypto:900,exp:260,rep:90});
      log("Boss dungeon dikalahkan. Bonus besar diterima.");
      toast("BOSS DEFEATED!");
    }else{
      state.dungeonFloor++;
      toast("Floor cleared.");
    }
  }else{
    toast("Battle menang.");
  }

  state.battle = null;
  checkAchievements();
  renderAll();
}

function loseBattle(){
  state.crypto = Math.max(0,state.crypto-120);
  state.heat = clamp(state.heat+18,0,100);
  state.battle = null;
  log("Battle kalah. Crypto hilang dan Heat naik.");
  toast("Kamu kalah battle.");
  renderAll();
}

function fleeBattle(){
  if(!state.battle) return;
  state.battle = null;
  addHeat(10);
  log("Kabur dari battle. Heat naik.");
  renderAll();
}

/* OTHER RENDER */
function renderShop(){
  $("shop").innerHTML = `<div class="grid">
    <div class="card span-12"><h2>Black Market & Hardware Shop</h2><p>Beli tool fiktif untuk memperkuat karakter.</p></div>
    <div class="card span-12"><div class="shop-grid">
      ${shopItems.map(item=>`<div class="item">
        <div class="item-head"><b>${item.name}</b><span class="tag">${item.type}</span></div>
        <p>${item.desc}</p>
        <div class="stat"><span>Price</span><span class="value">₿${fmt(item.price)}</span></div>
        <div class="stat"><span>Stats</span><span>PWR ${item.power} · STL ${item.stealth} · SPD ${item.speed}</span></div>
        <button class="btn primary" type="button" data-buy="${item.id}" ${state.owned[item.id] ? "disabled" : ""}>${state.owned[item.id] ? "Owned" : "Buy"}</button>
      </div>`).join("")}
    </div></div>
  </div>`;
}

function buyItem(id){
  const item = shopItems.find(x=>x.id===id);
  if(!item) return;
  if(state.owned[id]) return toast("Item sudah dimiliki.");
  if(state.crypto < item.price) return toast("Crypto tidak cukup.");
  state.crypto -= item.price;
  state.owned[id] = clone(item);
  if(id==="tool_gpu") state.maxEnergy += 10;
  log(`Membeli item: ${item.name}.`);
  checkAchievements();
  renderAll();
  toast(`${item.name} dibeli.`);
}

function renderInventory(){
  const items = Object.values(state.owned);
  $("inventory").innerHTML = `<div class="grid">
    <div class="card span-4">
      <h2>Total Stats</h2>
      <div class="stat"><span>Power</span><span class="value">${fmt(totalStat("power"))}</span></div>
      <div class="stat"><span>Stealth</span><span class="value">${fmt(totalStat("stealth"))}</span></div>
      <div class="stat"><span>Speed</span><span class="value">${fmt(totalStat("speed"))}</span></div>
    </div>
    <div class="card span-8">
      <h2>Inventory Tools</h2>
      <div class="list">${items.map(item=>`<div class="item">
        <div class="item-head"><b>${item.name}</b><span class="tag">${item.type}</span></div>
        <p>${item.desc}</p>
        <div class="stat"><span>Stats</span><span>PWR ${item.power||0} · STL ${item.stealth||0} · SPD ${item.speed||0}</span></div>
      </div>`).join("")}</div>
    </div>
  </div>`;
}

function renderSkills(){
  $("skills").innerHTML = `<div class="grid">
    <div class="card span-12"><h2>Skill Tree</h2><p>Skill Point tersedia: <b class="green">${state.skillPoints}</b>.</p></div>
    <div class="card span-12"><div class="skill-grid">
      ${skills.map(skill=>`<div class="item">
        <div class="item-head"><b>${skill.name}</b><span class="tag">${state.skills[skill.id]}/${skill.max}</span></div>
        <p>${skill.desc}</p>
        <div class="bar"><div class="fill purple" style="width:${state.skills[skill.id]/skill.max*100}%"></div></div>
        <div class="actions"><button class="btn primary" type="button" data-skill="${skill.id}" ${state.skills[skill.id]>=skill.max ? "disabled" : ""}>Upgrade</button></div>
      </div>`).join("")}
    </div></div>
  </div>`;
}

function upgradeSkill(id){
  const skill = skills.find(x=>x.id===id);
  if(!skill) return;
  if(state.skillPoints<=0) return toast("Skill Point tidak cukup.");
  if(state.skills[id]>=skill.max) return toast("Skill sudah maksimal.");
  state.skillPoints--;
  state.skills[id]++;
  if(id==="hardware"){
    state.maxEnergy += 8;
    state.energy += 8;
  }
  log(`Skill upgrade: ${skill.name} Lv.${state.skills[id]}.`);
  renderAll();
}

function renderMap(){
  const areas = [
    {name:"Public Net",req:0,desc:"Area awal, quest ringan dan training.",type:"safe",angle:300,dist:26},
    {name:"Local Forum",req:0,desc:"Kontrak NPC dan mini bounty.",type:"safe",angle:35,dist:32},
    {name:"Abandoned Server",req:0,desc:"Dungeon server rusak.",type:"dungeon",angle:115,dist:42},
    {name:"Corporate Cloud",req:250,desc:"Misi menengah dengan Heat lebih tinggi.",type:"corp",angle:200,dist:54},
    {name:"Dark Market",req:450,desc:"Shop risiko tinggi dan item premium.",type:"market",angle:260,dist:64},
    {name:"AUREX Core",req:900,desc:"Area akhir cerita utama.",type:"boss",angle:75,dist:70}
  ];
  const heatClass = getHeatTier().name.toLowerCase();
  const nodes = areas.map((a,i)=>{
    const locked = state.rep < a.req;
    const rad = a.angle * Math.PI / 180;
    const x = 50 + Math.cos(rad) * a.dist * .58;
    const y = 50 + Math.sin(rad) * a.dist * .58;
    return `<button class="sonar-node ${a.type} ${locked?"locked":"unlocked"}" style="left:${x}%;top:${y}%;" type="button" data-area="${i}">
      <span class="node-ping"></span><b>${i+1}</b><em>${a.name}</em>
    </button>`;
  }).join("");

  $("map").innerHTML = `<div class="grid">
    <div class="card span-12">
      <h2>Sonar Network Map</h2>
      <p>Network map sekarang berbentuk sonar. Tap node untuk masuk area. Heat tinggi akan membuat radar terlihat lebih berbahaya.</p>
    </div>
    <div class="card span-8">
      <div class="sonar-map ${heatClass}">
        <div class="sonar-grid"></div>
        <div class="sonar-ring ring-a"></div>
        <div class="sonar-ring ring-b"></div>
        <div class="sonar-ring ring-c"></div>
        <div class="sonar-sweep"></div>
        <div class="sonar-core"><b>NEON HUB</b><span>@${state.username}</span></div>
        ${nodes}
      </div>
    </div>
    <div class="card span-4">
      <h2>Node Intel</h2>
      <p>Pilih titik sonar untuk membuka area. Node terkunci butuh REP sesuai requirement.</p>
      <div class="list">
        ${areas.map((a,i)=>{
          const locked = state.rep < a.req;
          return `<div class="item sonar-intel ${a.type}">
            <div class="item-head"><b>${a.name}</b><span class="tag ${locked?"red":""}">${locked?"LOCKED":"ONLINE"}</span></div>
            <p>${a.desc}</p>
            <div class="stat"><span>REP Req</span><span class="value">${a.req}</span></div>
          </div>`;
        }).join("")}
      </div>
    </div>
  </div>`;
}

function mapVisit(i){
  const areas = [
    {name:"Public Net",req:0},
    {name:"Local Forum",req:0},
    {name:"Abandoned Server",req:0},
    {name:"Corporate Cloud",req:250},
    {name:"Dark Market",req:450},
    {name:"AUREX Core",req:900}
  ];
  const a = areas[i];
  if(state.rep<a.req) return toast("Reputation belum cukup.");

  const reward = rand(20,90);
  const heat = rand(2,10);

  if(a.name==="Dark Market"){
    state.crypto += reward*2;
    addHeat(heat+8);
    log(`Mengunjungi Dark Market: deal rahasia memberi ₿${reward*2}.`);
    toast(`Dark Market deal: +₿${reward*2}.`);
  }else if(a.name==="AUREX Core"){
    startBattle(clone(enemies[4]),false);
  }else{
    state.crypto += reward;
    state.exp += rand(5,20);
    addHeat(heat);
    gain({});
    log(`Mengunjungi ${a.name}: menemukan cache ₿${reward}.`);
    toast(`${a.name}: cache ditemukan +₿${reward}.`);
  }
  renderAll();
}

function renderAchievements(){
  $("achievements").innerHTML = `<div class="grid">
    <div class="card span-12"><h2>Achievements</h2><p>Achievement memberi bonus ₿150 dan 10 REP saat pertama kali terbuka.</p></div>
    <div class="card span-12"><div class="skill-grid">
      ${achievements.map(a=>`<div class="item">
        <div class="item-head"><b>${a.name}</b><span class="tag ${state.achievements[a.id] ? "" : "red"}">${state.achievements[a.id] ? "Unlocked" : "Locked"}</span></div>
        <p>${a.desc}</p>
      </div>`).join("")}
    </div></div>
  </div>`;
}

function renderLogs(){
  $("logs").innerHTML = `<div class="grid"><div class="card span-12">
    <h2>Activity Log</h2>
    <div class="logbox" style="max-height:620px">${state.logs.map(x=>`<div class="item">${x}</div>`).join("")}</div>
  </div></div>`;
}

function deepClean(){
  const cost = 250;
  if(state.crypto < cost){
    toast("Crypto tidak cukup untuk Deep Clean.");
    return;
  }
  state.crypto -= cost;
  const down = 28 + skillBonus("stealth")*3 + (state.owned.tool_cleaner ? 12 : 0);
  state.heat = clamp(state.heat - down, 0, 100);
  if(state.heatSystem){
    state.heatSystem.wanted = false;
    state.heatSystem.wantedUntil = 0;
  }
  log(`Deep Clean aktif. Bayar ₿${cost}, Heat -${down}, status WANTED dimatikan.`);
  renderAll();
  toast(`Deep Clean berhasil. Heat -${down}.`);
}

function randomEvent(){
  pick([
    ()=>{
      const c=rand(80,180);
      state.crypto+=c;
      log(`Random Event: USB misterius berisi cache ₿${c}.`);
      toast(`USB misterius: +₿${c}.`);
    },
    ()=>{
      const h=rand(8,18);
      addHeat(h);
      log(`Random Event: Proxy bocor. Heat +${h}.`);
      toast("Proxy bocor. Heat naik.");
    },
    ()=>{
      const e=rand(18,35);
      state.energy=clamp(state.energy+e,0,state.maxEnergy);
      log(`Random Event: MIRA optimasi rig. Energy +${e}.`);
      toast(`Energy +${e}.`);
    },
    ()=>{
      const r=rand(15,40);
      state.rep+=r;
      log(`Random Event: NPC memuji aksimu. REP +${r}.`);
      toast(`REP +${r}.`);
    },
    ()=>{
      const cost=Math.min(state.crypto,rand(60,160));
      state.crypto-=cost;
      state.heat=clamp(state.heat-14,0,100);
      log(`Random Event: Cleaner anonim dibayar ₿${cost}. Heat turun.`);
      toast("Cleaner anonim menurunkan Heat.");
    }
  ])();
  renderAll();
}

function renderAll(){
  isWantedActive();
  applyHighHeatPunishment("render");
  renderNav();
  renderTop();
  renderDashboard();
  renderQuests();

  if(currentView==="terminal") renderTerminal();
  else terminalBooted = false;

  renderDungeon();
  renderBattle();
  renderShop();
  renderInventory();
  renderSkills();
  renderMap();
  renderAchievements();
  renderLogs();

  saveGame(false);
}

function bindGlobalEvents(){
  $("menuBtn").onclick = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    openSidebar();
  };

  $("closeSidebarBtn").onclick = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    closeSidebar();
  };

  $("overlay").onclick = ()=>{
    closeSidebar();
  };

  $("saveBtn").onclick = ()=>saveGame(true);
  $("resetBtn").onclick = resetGame;
  $("profileBtn").onclick = openProfileModal;

  $("modal").addEventListener("click",(e)=>{
    if(e.target.id==="modal") closeModal();
  });

  document.addEventListener("click",(e)=>{
    const t = e.target.closest("[data-go],[data-action],[data-quest],[data-buy],[data-skill],[data-area],[data-train],[data-battle],[data-pw-method],[data-pw-user],[data-proxy-node],[data-port-scan],[data-port-exploit],[data-sniff-packet],[data-log-answer],[data-file-pick],[data-social-reply],[data-social-finish]");
    if(!t) return;

    if(t.dataset.go) return showView(t.dataset.go);
    if(t.dataset.quest) return acceptQuest(t.dataset.quest);
    if(t.dataset.buy) return buyItem(t.dataset.buy);
    if(t.dataset.skill) return upgradeSkill(t.dataset.skill);
    if(t.dataset.area !== undefined) return mapVisit(Number(t.dataset.area));
    if(t.dataset.train !== undefined) return startBattle(clone(enemies[Number(t.dataset.train)]),false);
    if(t.dataset.battle) return battleAction(t.dataset.battle);
    if(t.dataset.pwMethod) return passwordMethod(t.dataset.pwMethod);
    if(t.dataset.pwUser) return passwordGuess(t.dataset.pwUser);
    if(t.dataset.proxyNode) return proxyPick(t.dataset.proxyNode);
    if(t.dataset.portScan) return portSelect(t.dataset.portScan);
    if(t.dataset.portExploit) return portExploit(t.dataset.portExploit);
    if(t.dataset.sniffPacket !== undefined) return sniffPick(t.dataset.sniffPacket);
    if(t.dataset.logAnswer) return logAnswer(t.dataset.logAnswer);
    if(t.dataset.filePick !== undefined) return filePick(t.dataset.filePick);
    if(t.dataset.socialReply) return socialReply(t.dataset.socialReply);
    if(t.dataset.socialFinish) return socialFinish(t.dataset.socialFinish);

    const a = t.dataset.action;
    if(a==="profile") return openProfileModal();
    if(a==="saveProfile") return saveProfile();
    if(a==="closeModal") return closeModal();
    if(a==="rest") return rest();
    if(a==="daily") return claimDaily();
    if(a==="random") return randomEvent();
    if(a==="deepClean") return deepClean();
    if(a==="startQuest") return startActiveQuest();
    if(a==="cancelQuest") return cancelQuest();
    if(a==="abortMini") return finishMiniGame(false,"Manual abort.");
    if(a==="proxyUndo") return proxyUndo();
    if(a==="proxySubmit") return proxySubmit();
    if(a==="portScan") return portScan();
    if(a==="sniffSubmit") return sniffSubmit();
    if(a==="exfilSubmit") return exfilSubmit();
    if(a==="enterDungeon") return enterDungeon();
    if(a==="exitDungeon") return exitDungeon();
    if(a==="fleeBattle") return fleeBattle();
  });

  window.addEventListener("resize",()=>{
    if(window.innerWidth>1050) closeSidebar();
  });
}

function boot(){
  bindGlobalEvents();
  renderAll();

  setInterval(()=>{
    if(state.energy < state.maxEnergy){
      state.energy = Math.min(state.maxEnergy,state.energy+1);
      renderTop();
      if(currentView==="dashboard") renderDashboard();
      saveGame(false);
    }
  },12000);
}

try{
  boot();
}catch(e){
  console.error("CYBERTRACE BOOT ERROR:",e);
  document.body.innerHTML = `<div style="padding:20px;color:#e8faff;background:#050816;min-height:100vh;font-family:Arial">
    <h2>CYBERTRACE gagal boot</h2>
    <p>Ada error JavaScript. Buka Console untuk detail.</p>
    <pre style="white-space:pre-wrap;background:#111a3f;padding:12px;border-radius:12px;color:#00ffcc">${escapeHtml(String(e && e.message ? e.message : e))}</pre>
  </div>`;
}
})();
