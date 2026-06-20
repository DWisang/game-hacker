(() => {
"use strict";

const STORAGE_KEY = "cybertrace_v8_heat_punishment";
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

function miniScaffold({title,badge,subtitle,goal,how,tip,statusHtml="",bodyHtml="",actionsHtml=""}){
  return `${miniHeader(title,badge)}
    <div class="mini-shell">
      <p class="mini-sub">${subtitle}</p>
      <div class="mini-guide">
        ${miniGuideBox("Tujuan", goal)}
        ${miniGuideBox("Cara Main", how)}
        ${miniGuideBox("Tips", tip)}
      </div>
      ${statusHtml ? `<div class="mini-status-grid">${statusHtml}</div>` : ""}
      <div class="mini-board">${bodyHtml}</div>
      ${actionsHtml ? `<div class="mini-actions">${actionsHtml}</div>` : ""}
    </div>`;
}

function createBreachSequence(q){
  const tokens = ["A1","7X","B4","C9","D2","F0","9Z","K3","R8","N6"];
  const len = clamp(2+q.difficulty,3,6);
  const target = Array.from({length:len},()=>pick(tokens));
  return {type:"breach",name:"Breach Sequence",target,grid:shuffle([...target,...Array.from({length:12},()=>pick(tokens))]).slice(0,12),selected:[]};
}

function renderBreachMiniGame(){
  const status = [
    miniStatusCard("Target", `${miniGame.target.length} kode`),
    miniStatusCard("Progress", `${miniGame.selected.length}/${miniGame.target.length}`),
    miniStatusCard("Mode", "Urut dari kiri ke kanan")
  ].join("");
  const body = `
    <div class="mini-sequence"><b>Target</b><br>${miniGame.target.join(" → ")}</div>
    <div class="mini-sequence"><b>Input Kamu</b><br>${miniGame.selected.length ? miniGame.selected.join(" → ") : "Belum ada input"}</div>
    <div class="mini-grid cols-4">${miniGame.grid.map((t,i)=>`<button class="mini-cell" type="button" data-breach="${i}">${t}<small>Tap pilih</small></button>`).join("")}</div>`;
  const actions = `<button class="btn warn" type="button" data-action="breachUndo">Undo</button><button class="btn danger" type="button" data-action="abortMini">Abort</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Breach Sequence",
    badge:"GRID CODE",
    subtitle:"Susun kode persis seperti urutan target.",
    goal:"Cocokkan semua kode pada urutan target.",
    how:"Tap satu per satu kode di grid. Urutan tap harus sama persis dengan target di atas.",
    tip:"Kalau salah 1 langkah saja, misi gagal. Gunakan tombol Undo kalau mau batal 1 langkah.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions
  });
}

function breachPick(i){
  miniGame.selected.push(miniGame.grid[i]);
  const pos = miniGame.selected.length-1;
  if(miniGame.selected[pos] !== miniGame.target[pos]) return finishMiniGame(false,"Sequence salah.");
  if(miniGame.selected.length === miniGame.target.length) return finishMiniGame(true,"Sequence cocok.");
  renderBreachMiniGame();
}

function breachUndo(){
  miniGame.selected.pop();
  renderBreachMiniGame();
}

function createWordGuess(q){
  const words = ["TRACE","CACHE","LOGIN","PROXY","TOKEN","ROUTE","PATCH","CLOUD","SHELL","CRYPT","VIRUS","QUERY"];
  const answer = pick(words);
  let list = shuffle(words).slice(0,8);
  if(!list.includes(answer)) list[0] = answer;
  return {type:"word",name:"Terminal Word Guess",words:shuffle(list),answer,attempts:4+Math.max(0,2-q.difficulty),hints:[]};
}

function renderWordGuessMiniGame(){
  const status = [
    miniStatusCard("Attempts", `${miniGame.attempts} sisa`),
    miniStatusCard("Panjang Kata", `${miniGame.answer.length} huruf`),
    miniStatusCard("Hint", `${miniGame.hints.length} data`) 
  ].join("");
  const body = `
    <div class="mini-grid cols-2">${miniGame.words.map(w=>`<button class="mini-cell" type="button" data-word="${w}">${w}<small>Pilih password</small></button>`).join("")}</div>
    <div class="mini-history">${miniGame.hints.length ? miniGame.hints.map(h=>`<div class="mini-hint-line">${h}</div>`).join("") : `<div class="mini-hint-line">Belum ada hint. Pilih salah satu kata untuk memulai.</div>`}</div>`;
  const actions = `<button class="btn danger" type="button" data-action="abortMini">Abort</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Terminal Word Guess",
    badge:"PASSWORD",
    subtitle:"Cari password yang benar dari beberapa pilihan.",
    goal:"Pilih 1 kata yang tepat sebelum attempt habis.",
    how:"Tap satu kata. Kalau salah, kamu dapat hint berupa jumlah huruf yang tepat di posisi yang tepat.",
    tip:"Gunakan hint untuk menyaring pilihan. Semakin besar angka match, semakin dekat ke jawaban.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions
  });
}

function wordGuess(word){
  if(word === miniGame.answer) return finishMiniGame(true,"Password benar.");
  let match = 0;
  for(let i=0;i<word.length;i++){
    if(word[i] === miniGame.answer[i]) match++;
  }
  miniGame.attempts--;
  miniGame.hints.push(`${word}: ${match}/${miniGame.answer.length} huruf benar pada posisi yang benar`);
  if(miniGame.attempts <= 0) return finishMiniGame(false,`Jawaban: ${miniGame.answer}.`);
  renderWordGuessMiniGame();
}

function createNodeCapture(q){
  const path = ["HOME","PROXY","CACHE","FIREWALL","ROOT"];
  const decoys = ["TRAP","HONEYPOT","TRACE","MIRROR","NOISE","DECOY"];
  return {type:"node",name:"Node Capture",path,nodes:shuffle([...path.slice(1),...decoys.slice(0,4)]),step:1,trace:0,maxTrace:3+Math.max(0,3-q.difficulty)};
}

function renderNodeCaptureMiniGame(){
  const status = [
    miniStatusCard("Progress", `${miniGame.step}/${miniGame.path.length-1} node`),
    miniStatusCard("Trace", `${miniGame.trace}/${miniGame.maxTrace}`),
    miniStatusCard("Target Akhir", "ROOT")
  ].join("");
  const track = miniGame.path.map((node,idx)=>{
    let cls = "locked";
    if(idx < miniGame.step) cls = "done";
    if(idx === miniGame.step) cls = "current";
    return `<span class="mini-pill ${cls}">${node}</span>`;
  }).join("");
  const body = `
    <div class="mini-node-track">${track}</div>
    <div class="mini-sequence"><b>Node berikutnya</b><br>Pilih node yang benar untuk melanjutkan jalur menuju ROOT.</div>
    <div class="mini-grid cols-3">${miniGame.nodes.map(n=>`<button class="mini-cell" type="button" data-node="${n}">${n}<small>Pilih node</small></button>`).join("")}</div>`;
  const actions = `<button class="btn danger" type="button" data-action="abortMini">Abort</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Node Capture",
    badge:"NETWORK",
    subtitle:"Cari node yang benar tanpa memicu trace berlebihan.",
    goal:"Ikuti jalur yang benar hingga ROOT.",
    how:"Tap node yang menurutmu adalah node berikutnya dalam jalur aman.",
    tip:"Salah pilih akan menambah Trace. Kalau Trace penuh, misi gagal.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions
  });
}

function nodePick(node){
  if(node === miniGame.path[miniGame.step]){
    miniGame.step++;
    if(miniGame.step >= miniGame.path.length) return finishMiniGame(true,"Root node berhasil dikuasai.");
  }else{
    miniGame.trace++;
    addHeat(2);
    if(miniGame.trace >= miniGame.maxTrace) return finishMiniGame(false,"Trace mencapai HOME node.");
  }
  renderNodeCaptureMiniGame();
}

function createPipeFlow(q){
  const pieces = ["─","│","┌","┐","└","┘"];
  const answer = ["─","┐","│","┘"];
  return {type:"pipe",name:"Pipe Data Flow",pieces,answer,current:shuffle(pieces).slice(0,4),moves:8+Math.max(0,3-q.difficulty)};
}

function renderPipeFlowMiniGame(){
  const correctCount = miniGame.current.filter((p,i)=>p===miniGame.answer[i]).length;
  const status = [
    miniStatusCard("Moves", `${miniGame.moves}`),
    miniStatusCard("Benar", `${correctCount}/4 posisi`),
    miniStatusCard("Tujuan", "Samakan 4 ubin")
  ].join("");
  const targetRow = miniGame.answer.map((p,i)=>`<div class="mini-flow-card"><span class="slot-no">Target ${i+1}</span><div class="pipe-big">${p}</div></div>`).join("");
  const currentRow = miniGame.current.map((p,i)=>`<button class="mini-pipe-card ${p===miniGame.answer[i] ? "good" : "bad"}" type="button" data-pipe="${i}"><span class="slot-no">Tile ${i+1}</span><div class="pipe-big">${p}</div><small>${p===miniGame.answer[i] ? "Sudah cocok" : "Tap untuk rotate"}</small></button>`).join("");
  const body = `
    <div class="mini-sequence"><b>Cara baca</b><br>Baris <b>Target</b> adalah susunan akhir. Baris <b>Tile Kamu</b> adalah ubin yang bisa kamu tap untuk diputar. Setiap tap akan mengganti bentuk ubin.</div>
    <div class="mini-legend">Urutan rotate: ─ → │ → ┌ → ┐ → └ → ┘ → kembali ke ─</div>
    <div class="mini-flow-row">${targetRow}</div>
    <div class="mini-flow-grid">${currentRow}</div>`;
  const actions = `<button class="btn primary" type="button" data-action="pipeSubmit">Submit Flow</button><button class="btn danger" type="button" data-action="abortMini">Abort</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Pipe Data Flow",
    badge:"FLOW",
    subtitle:"Susun jalur data dengan memutar 4 ubin sampai sama dengan target.",
    goal:"Buat 4 tile kamu sama persis dengan 4 tile target dari kiri ke kanan.",
    how:"Tap tile pada baris bawah untuk rotate bentuknya. Cocokkan semua tile, lalu tekan Submit Flow.",
    tip:"Kalau kartu berwarna hijau berarti posisi itu sudah benar. Fokus ubah yang merah saja.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions
  });
}

function pipeRotate(i){
  const idx = miniGame.pieces.indexOf(miniGame.current[i]);
  miniGame.current[i] = miniGame.pieces[(idx+1)%miniGame.pieces.length];
  miniGame.moves--;
  if(miniGame.moves < 0) return finishMiniGame(false,"Moves habis.");
  renderPipeFlowMiniGame();
}

function pipeSubmit(){
  const ok = miniGame.current.join("") === miniGame.answer.join("");
  finishMiniGame(ok, ok ? "Data flow tersambung." : "Flow masih rusak.");
}

function createSignalTiming(q){
  const zoneStart = rand(25,60);
  const base = state.owned.tool_signal ? 34 : 28;
  const zoneSize = clamp(base-q.difficulty*4+skillBonus("ai"),12,36);
  return {type:"signal",name:"Signal Timing",cursor:0,dir:1,zoneStart,zoneEnd:zoneStart+zoneSize,speed:4+q.difficulty};
}

function renderSignalTimingMiniGame(){
  const zoneSize = Math.round(miniGame.zoneEnd-miniGame.zoneStart);
  const status = [
    miniStatusCard("Zona Aman", `${zoneSize}%`),
    miniStatusCard("Kecepatan", `${miniGame.speed}`),
    miniStatusCard("Aksi", "Tekan STOP")
  ].join("");
  const body = `
    <div class="mini-sequence"><b>Instruksi</b><br>Tunggu garis putih bergerak masuk ke area hijau, lalu tap tombol STOP.</div>
    <div class="signal-box"><div class="signal-zone" style="left:${miniGame.zoneStart}%;width:${miniGame.zoneEnd-miniGame.zoneStart}%"></div><div class="signal-cursor" id="signalCursor"></div></div>`;
  const actions = `<button class="btn primary" type="button" data-action="signalStop">STOP</button><button class="btn danger" type="button" data-action="abortMini">Abort</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Signal Timing",
    badge:"QUICK HACK",
    subtitle:"Uji timing. Hentikan sinyal tepat di area aman.",
    goal:"Tekan STOP saat garis putih ada di zona hijau.",
    how:"Lihat gerakan garis putih dari kiri ke kanan dan sebaliknya. Tap STOP pada waktu yang pas.",
    tip:"Jangan panik. Zona hijau adalah area aman. Tool Signal Stabilizer membuat zona lebih lebar.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions
  });
  clearInterval(signalTimer);
  signalTimer = setInterval(()=>{
    miniGame.cursor += miniGame.dir*miniGame.speed;
    if(miniGame.cursor >= 100){miniGame.cursor=100;miniGame.dir=-1;}
    if(miniGame.cursor <= 0){miniGame.cursor=0;miniGame.dir=1;}
    const cur = $("signalCursor");
    if(cur) cur.style.left = miniGame.cursor + "%";
  },35);
}

function signalStop(){
  const ok = miniGame.cursor >= miniGame.zoneStart && miniGame.cursor <= miniGame.zoneEnd;
  finishMiniGame(ok, ok ? "Signal tepat." : "Signal miss.");
}

function createMemoryPacket(q){
  const symbols = ["◇","○","△","□","✦","⬡"];
  const len = clamp(3+q.difficulty,3,7);
  return {type:"memory",name:"Memory Packet",symbols,sequence:Array.from({length:len},()=>pick(symbols)),input:[],hidden:false,revealMs:1800+skillBonus("ai")*250};
}

function renderMemoryPacketMiniGame(){
  const status = [
    miniStatusCard("Panjang", `${miniGame.sequence.length} simbol`),
    miniStatusCard("Progress", `${miniGame.input.length}/${miniGame.sequence.length}`),
    miniStatusCard("Status", miniGame.hidden ? "Saatnya input" : "Hafalkan dulu")
  ].join("");
  const body = `
    <div class="mini-sequence"><b>${miniGame.hidden ? "Sequence disembunyikan" : "Hafalkan sequence berikut"}</b><br>${miniGame.hidden ? "Masukkan ulang urutan simbol sesuai yang tadi muncul." : miniGame.sequence.join(" → ")}</div>
    <div class="mini-sequence"><b>Input Kamu</b><br>${miniGame.input.length ? miniGame.input.join(" → ") : "Belum ada input"}</div>
    <div class="mini-grid cols-3 mini-memory-grid">${miniGame.symbols.map(s=>`<button class="mini-cell" type="button" ${miniGame.hidden ? `data-memory="${s}"` : "disabled"}>${s}<small>${miniGame.hidden ? "Tap simbol" : "Tunggu..."}</small></button>`).join("")}</div>`;
  const actions = `<button class="btn danger" type="button" data-action="abortMini">Abort</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Memory Packet",
    badge:"DECRYPT",
    subtitle:"Tes memori untuk membaca paket terenkripsi.",
    goal:"Ingat lalu ulangi urutan simbol yang muncul.",
    how:"Pertama hafalkan sequence. Setelah hilang, tap simbol satu per satu sesuai urutan aslinya.",
    tip:"Fokus ke urutan, bukan cuma simbolnya. Panjang sequence tergantung tingkat kesulitan.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions
  });
  if(!miniGame.hidden){
    clearTimeout(memoryTimer);
    memoryTimer = setTimeout(()=>{
      if(miniGame){
        miniGame.hidden = true;
        renderMemoryPacketMiniGame();
      }
    },miniGame.revealMs);
  }
}

function memoryPick(symbol){
  miniGame.input.push(symbol);
  const pos = miniGame.input.length-1;
  if(miniGame.input[pos] !== miniGame.sequence[pos]) return finishMiniGame(false,"Sequence memory salah.");
  if(miniGame.input.length === miniGame.sequence.length) return finishMiniGame(true,"Packet berhasil didekripsi.");
  renderMemoryPacketMiniGame();
}

function createDataSorting(q){
  const packets = [
    {name:"MALWARE",cat:"Quarantine"},
    {name:"TOKEN",cat:"Vault"},
    {name:"LOG",cat:"Archive"},
    {name:"CACHE",cat:"Clean"},
    {name:"ROOTKEY",cat:"Vault"},
    {name:"SPAM",cat:"Quarantine"}
  ];
  return {type:"sorting",name:"Data Sorting",packets:shuffle(packets).slice(0,clamp(3+q.difficulty,3,6)),index:0,mistakes:0,maxMistakes:2};
}

function renderDataSortingMiniGame(){
  const p = miniGame.packets[miniGame.index];
  const status = [
    miniStatusCard("Progress", `${miniGame.index+1}/${miniGame.packets.length}`),
    miniStatusCard("Mistake", `${miniGame.mistakes}/${miniGame.maxMistakes}`),
    miniStatusCard("Packet", p.name)
  ].join("");
  const body = `
    <div class="mini-sorting-target">${p.name}</div>
    <div class="mini-sequence"><b>Pilih kategori yang benar</b><br>Kirim packet <b>${p.name}</b> ke folder yang sesuai.</div>
    <div class="mini-grid cols-2">${["Quarantine","Vault","Archive","Clean"].map(cat=>`<button class="mini-cell mini-answer-option" type="button" data-sort="${cat}"><div><b>${cat}</b><small>Tap untuk kirim ke sini</small></div></button>`).join("")}</div>`;
  const actions = `<button class="btn danger" type="button" data-action="abortMini">Abort</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Data Sorting",
    badge:"CLEANUP",
    subtitle:"Sortir data ke folder yang tepat.",
    goal:"Pilih kategori yang cocok untuk setiap packet.",
    how:"Lihat nama packet di atas, lalu tap salah satu kategori di bawahnya.",
    tip:"Terlalu banyak salah kategori akan membuat misi gagal.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions
  });
}

function sortPick(cat){
  const p = miniGame.packets[miniGame.index];
  if(cat !== p.cat){
    miniGame.mistakes++;
    addHeat(2);
    if(miniGame.mistakes > miniGame.maxMistakes) return finishMiniGame(false,"Terlalu banyak paket salah kategori.");
  }
  miniGame.index++;
  if(miniGame.index >= miniGame.packets.length) return finishMiniGame(true,"Semua paket disortir.");
  renderDataSortingMiniGame();
}

function createStealthRoute(q){
  const routes = [
    {name:"HOME → PROXY → DARK RELAY → TARGET",safe:true,risk:"Low"},
    {name:"HOME → PUBLIC WIFI → TARGET",safe:false,risk:"High"},
    {name:"HOME → TRACE NODE → TARGET",safe:false,risk:"Critical"},
    {name:"HOME → CACHE → MIRROR → TARGET",safe:true,risk:"Medium"}
  ];
  const answer = pick(routes.filter(r=>r.safe)).name;
  return {type:"route",name:"Stealth Route",routes:shuffle(routes),answer};
}

function renderStealthRouteMiniGame(){
  const status = [
    miniStatusCard("Pilihan", `${miniGame.routes.length} route`),
    miniStatusCard("Tujuan", "Capai TARGET"),
    miniStatusCard("Fokus", "Cari jalur aman")
  ].join("");
  const body = `<div class="mini-grid">${miniGame.routes.map(r=>`<button class="mini-cell mini-route-option" type="button" data-route="${encodeURIComponent(r.name)}"><div><b>${r.name}</b><small>Risk: ${r.risk}</small></div></button>`).join("")}</div>`;
  const actions = `<button class="btn danger" type="button" data-action="abortMini">Abort</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Stealth Route",
    badge:"PATHFINDING",
    subtitle:"Pilih rute infiltrasi paling aman.",
    goal:"Pilih satu route yang paling aman menuju TARGET.",
    how:"Baca setiap jalur dan level risikonya, lalu tap route yang menurutmu paling aman.",
    tip:"Route dengan node berbahaya seperti PUBLIC WIFI atau TRACE NODE biasanya lebih berisiko.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions
  });
}

function routePick(encoded){
  const route = decodeURIComponent(encoded);
  finishMiniGame(route === miniGame.answer, route === miniGame.answer ? "Route aman dipilih." : "Route terkena scanner.");
}

function createFirewallPattern(){
  const patterns = [
    {prompt:"2, 5, 10, 17, 26, ?",answer:"37",options:["32","35","37","42"]},
    {prompt:"4, 8, 12, 16, ?",answer:"20",options:["18","20","22","24"]},
    {prompt:"1, 1, 2, 3, 5, ?",answer:"8",options:["7","8","9","10"]},
    {prompt:"A1 → B2 → C3 → ?",answer:"D4",options:["C4","D4","E3","B4"]}
  ];
  const p = pick(patterns);
  return {type:"pattern",name:"Firewall Pattern",prompt:p.prompt,answer:p.answer,options:shuffle(p.options)};
}

function renderFirewallPatternMiniGame(){
  const status = [
    miniStatusCard("Tipe", "Logic Pattern"),
    miniStatusCard("Pilihan", `${miniGame.options.length} jawaban`),
    miniStatusCard("Target", "Cari lanjutan pola")
  ].join("");
  const body = `
    <div class="mini-sequence"><b>Pola Firewall</b><br>${miniGame.prompt}</div>
    <div class="mini-answer-grid">${miniGame.options.map(o=>`<button class="mini-cell mini-answer-option" type="button" data-pattern="${o}"><div><b>${o}</b><small>Pilih jawaban</small></div></button>`).join("")}</div>`;
  const actions = `<button class="btn danger" type="button" data-action="abortMini">Abort</button>`;
  $("modalPanel").innerHTML = miniScaffold({
    title:"Firewall Pattern",
    badge:"LOGIC",
    subtitle:"Pecahkan pola logika untuk menembus firewall.",
    goal:"Pilih jawaban yang paling tepat untuk melanjutkan pola.",
    how:"Amati urutan angka atau simbol, cari pola perubahannya, lalu pilih jawaban yang cocok.",
    tip:"Coba lihat selisih angka, urutan huruf, atau pola penomoran untuk menemukan jawaban.",
    statusHtml:status,
    bodyHtml:body,
    actionsHtml:actions
  });
}

function patternPick(o){
  finishMiniGame(o === miniGame.answer, o === miniGame.answer ? "Pattern benar." : "Pattern salah.");
}

/* TERMINAL */
function renderTerminal(){
  if(terminalBooted && currentView==="terminal") return;
  terminalBooted = true;
  $("terminal").innerHTML = `<div class="grid">
    <div class="card span-8">
      <h2>Neon Terminal</h2>
      <div class="terminal" id="termOut">
        <p class="line green">CYBERTRACE NEON SHELL v8.0</p>
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
    {name:"Public Net",req:0,desc:"Area awal, quest ringan dan training."},
    {name:"Local Forum",req:0,desc:"Kontrak NPC dan mini bounty."},
    {name:"Abandoned Server",req:0,desc:"Dungeon server rusak."},
    {name:"Corporate Cloud",req:250,desc:"Misi menengah dengan Heat lebih tinggi."},
    {name:"Dark Market",req:450,desc:"Shop risiko tinggi dan item premium."},
    {name:"AUREX Core",req:900,desc:"Area akhir cerita utama."}
  ];

  $("map").innerHTML = `<div class="grid">
    <div class="card span-12"><h2>Network Map</h2><p>Area terbuka berdasarkan reputation. Klik node untuk event singkat.</p></div>
    <div class="card span-12"><div class="map-nodes">
      ${areas.map((a,i)=>{
        const locked = state.rep<a.req;
        return `<div class="card node ${locked ? "locked" : ""}" data-area="${i}">
          <b>${a.name}</b><p>${a.desc}</p><span class="tag ${locked ? "red" : ""}">${locked ? "Need REP "+a.req : "Unlocked"}</span>
        </div>`;
      }).join("")}
    </div></div>
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
    const t = e.target.closest("[data-go],[data-action],[data-quest],[data-buy],[data-skill],[data-area],[data-train],[data-battle],[data-breach],[data-word],[data-node],[data-pipe],[data-memory],[data-sort],[data-route],[data-pattern]");
    if(!t) return;

    if(t.dataset.go) return showView(t.dataset.go);
    if(t.dataset.quest) return acceptQuest(t.dataset.quest);
    if(t.dataset.buy) return buyItem(t.dataset.buy);
    if(t.dataset.skill) return upgradeSkill(t.dataset.skill);
    if(t.dataset.area !== undefined) return mapVisit(Number(t.dataset.area));
    if(t.dataset.train !== undefined) return startBattle(clone(enemies[Number(t.dataset.train)]),false);
    if(t.dataset.battle) return battleAction(t.dataset.battle);
    if(t.dataset.breach !== undefined) return breachPick(Number(t.dataset.breach));
    if(t.dataset.word) return wordGuess(t.dataset.word);
    if(t.dataset.node) return nodePick(t.dataset.node);
    if(t.dataset.pipe !== undefined) return pipeRotate(Number(t.dataset.pipe));
    if(t.dataset.memory) return memoryPick(t.dataset.memory);
    if(t.dataset.sort) return sortPick(t.dataset.sort);
    if(t.dataset.route) return routePick(t.dataset.route);
    if(t.dataset.pattern) return patternPick(t.dataset.pattern);

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
    if(a==="breachUndo") return breachUndo();
    if(a==="pipeSubmit") return pipeSubmit();
    if(a==="signalStop") return signalStop();
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
