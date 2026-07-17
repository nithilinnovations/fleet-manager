/* ==============================================================
   Fleet Manager — common.js
   Shared by every page: data layer (localStorage), auth guard,
   utils, reminder engine, mileage calc, toast, theme, nav.
   ============================================================== */

/* ---------------------- tiny utils ---------------------- */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const todayISO = () => new Date().toISOString().slice(0,10);
const fmtDate = (iso) => { if(!iso) return '—'; const d=new Date(iso+'T00:00:00'); return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); };
const fmtMoney = (n) => '₹' + (Number(n)||0).toLocaleString('en-IN', {maximumFractionDigits:0});
const daysBetween = (isoA, isoB) => Math.round((new Date(isoB) - new Date(isoA)) / 86400000);
const esc = (s) => (s==null?'':String(s)).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const qs = (name) => new URLSearchParams(location.search).get(name);

function toast(msg){
  let t = $('#toast');
  if(!t){ t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._h); toast._h = setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ---------------------- data layer ---------------------- */
const DB = {
  _get(key, fallback){ try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }catch(e){ return fallback; } },
  _set(key, val){ localStorage.setItem(key, JSON.stringify(val)); },

  vehicles: { all(){ return DB._get('fleet_vehicles', []); },
    save(list){ DB._set('fleet_vehicles', list); },
    get(id){ return DB.vehicles.all().find(v=>v.id===id); },
    upsert(v){ const list=DB.vehicles.all(); const i=list.findIndex(x=>x.id===v.id);
      if(i>=0) list[i]=v; else list.push(v); DB.vehicles.save(list); return v; },
    remove(id){ DB.vehicles.save(DB.vehicles.all().filter(v=>v.id!==id)); } },
  trips: { all(){ return DB._get('fleet_trips', []); }, save(l){ DB._set('fleet_trips', l); },
    add(t){ const l=DB.trips.all(); l.unshift(t); DB.trips.save(l); },
    byVehicle(vid){ return DB.trips.all().filter(t=>t.vehicleId===vid); },
    remove(id){ DB.trips.save(DB.trips.all().filter(t=>t.id!==id)); } },
  fuel: { all(){ return DB._get('fleet_fuel', []); }, save(l){ DB._set('fleet_fuel', l); },
    add(f){ const l=DB.fuel.all(); l.unshift(f); DB.fuel.save(l); },
    byVehicle(vid){ return DB.fuel.all().filter(f=>f.vehicleId===vid).sort((a,b)=>(a.endOdo||0)-(b.endOdo||0)); },
    remove(id){ DB.fuel.save(DB.fuel.all().filter(f=>f.id!==id)); } },
  ev: { all(){ return DB._get('fleet_ev', []); }, save(l){ DB._set('fleet_ev', l); },
    add(e){ const l=DB.ev.all(); l.unshift(e); DB.ev.save(l); },
    byVehicle(vid){ return DB.ev.all().filter(e=>e.vehicleId===vid).sort((a,b)=>(a.endOdo||0)-(b.endOdo||0)); },
    remove(id){ DB.ev.save(DB.ev.all().filter(e=>e.id!==id)); } },
  maint: { all(){ return DB._get('fleet_maintenance', []); }, save(l){ DB._set('fleet_maintenance', l); },
    add(m){ const l=DB.maint.all(); l.unshift(m); DB.maint.save(l); },
    byVehicle(vid){ return DB.maint.all().filter(m=>m.vehicleId===vid); },
    update(m){ const l=DB.maint.all(); const i=l.findIndex(x=>x.id===m.id); if(i>=0){l[i]=m; DB.maint.save(l);} },
    remove(id){ DB.maint.save(DB.maint.all().filter(m=>m.id!==id)); } },
  settings: { get(){ return DB._get('fleet_settings', {approvalThreshold:5000, driverName:'Navaneethan', theme:'dark'}); },
    save(s){ DB._set('fleet_settings', s); } }
};

const MAINT_CATEGORIES = ['Engine Oil','Oil Filter','Air Filter','Cabin Filter','Fuel Filter (Petrol/Diesel)','Brake Pads','Brake Oil','Coolant','Battery','Tyres','Wheel Alignment','Wheel Balancing','Tyre Rotation','Wiper Blades','Suspension','General Service','Other Repairs'];

/** Categories that only apply to Petrol/Diesel/CNG/Hybrid vehicles, not pure EVs. */
const EV_EXCLUDED_CATEGORIES = ['Fuel Filter (Petrol/Diesel)'];
function categoriesFor(vehicle){
  if(vehicle && vehicle.fuelType === 'Electric (EV)') return MAINT_CATEGORIES.filter(c=>!EV_EXCLUDED_CATEGORIES.includes(c));
  return MAINT_CATEGORIES;
}

/** Sensible default service intervals (km / days). 0 means "not tracked by that metric". User overrides win. */
const DEFAULT_INTERVALS = {
  'Engine Oil': {km:5000, days:180}, 'Oil Filter': {km:5000, days:180}, 'Air Filter': {km:10000, days:365},
  'Cabin Filter': {km:10000, days:365}, 'Fuel Filter (Petrol/Diesel)': {km:10000, days:365},
  'Brake Pads': {km:20000, days:365}, 'Brake Oil': {km:20000, days:730}, 'Coolant': {km:20000, days:730},
  'Battery': {km:0, days:730}, 'Tyres': {km:40000, days:1095}, 'Wheel Alignment': {km:5000, days:180},
  'Wheel Balancing': {km:5000, days:180}, 'Tyre Rotation': {km:5000, days:180}, 'Wiper Blades': {km:0, days:365},
  'Suspension': {km:20000, days:730}, 'General Service': {km:5000, days:180}, 'Other Repairs': {km:0, days:0}
};
function addDays(iso, days){ const d = new Date(iso+'T00:00:00'); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10); }

/** Compute due status for one vehicle + maintenance category, using vehicle.schedule[category] with defaults as fallback. */
function computeScheduleStatus(vehicle, category) {

  const record = schedules.find(s =>
    s.vehicleId === vehicle.id &&
    s.category === category
  );

  const def = DEFAULT_INTERVALS[category] || { km: 0, days: 0 };

  const intervalKm = Number(record?.intervalKm || def.km || 0);
  const intervalDays = Number(record?.intervalDays || def.days || 0);

  const lastDate = record?.lastDate || null;
  const lastOdo = Number(record?.lastOdo || 0);

  const nextDueKm =
    lastOdo && intervalKm ? lastOdo + intervalKm : null;

  const nextDueDate =
    lastDate && intervalDays
      ? addDays(lastDate, intervalDays)
      : null;

  const remainingKm =
    nextDueKm != null
      ? nextDueKm - Number(vehicle.odometer || 0)
      : null;

  const remainingDays =
    nextDueDate != null
      ? daysBetween(todayISO(), nextDueDate)
      : null;

  let status = "Not Set";

  if (record) {
    const overdue =
      (remainingKm != null && remainingKm < 0) ||
      (remainingDays != null && remainingDays < 0);

    const dueSoon =
      (remainingKm != null && remainingKm <= 500) ||
      (remainingDays != null && remainingDays <= 30);

    status = overdue
      ? "Overdue"
      : dueSoon
      ? "Due Soon"
      : "On Time";
  }

  return {
    category,
    lastDate,
    lastOdo,
    nextDueDate,
    nextDueKm,
    remainingKm,
    remainingDays,
    intervalKm,
    intervalDays,
    status
  };
}
function scheduleStatusLevel(status){ return status==='Overdue' ? 'red' : status==='Due Soon' ? 'orange' : status==='On Time' ? 'green' : 'neutral'; }

/** Record a completed service for a category — updates the schedule's last-service point, keeping any custom interval. */
function recordServiceCompletion(vehicle, category, date, odo){
  vehicle.schedule = vehicle.schedule || {};
  const prev = vehicle.schedule[category] || {};
  const def = DEFAULT_INTERVALS[category] || {km:0, days:0};
  const intervalKm = prev.intervalKm || def.km || 0;
  const intervalDays = prev.intervalDays || def.days || 0;
  vehicle.schedule[category] = {
    lastDate: date, lastOdo: odo, intervalKm, intervalDays,
    nextDueKm: intervalKm ? odo + intervalKm : null,
    nextDueDate: intervalDays ? addDays(date, intervalDays) : null
  };
}

/* ---------------------- auth ---------------------- */
const AUTH = {
  CREDS: { user:'Driver', pass:'Kannan@1990' },
  isLoggedIn(){ return DB._get('fleet_auth', {loggedIn:false}).loggedIn === true; },
  login(u,p){ if((u||'').trim().toLowerCase()===AUTH.CREDS.user.toLowerCase() && p===AUTH.CREDS.pass){ DB._set('fleet_auth',{loggedIn:true}); return true; } return false; },
  logout(){ DB._set('fleet_auth',{loggedIn:false}); location.href = 'index.html'; },
  /** Call at the top of every protected page. Redirects to login if not signed in. */
  guard(){ if(!AUTH.isLoggedIn()){ location.href = 'index.html'; } }
};

/* ---------------------- reminder / status engine ---------------------- */
function reminderStatus(dueDateISO, warnDays=30){
  if(!dueDateISO) return {level:'neutral', label:'Not set'};
  const d = daysBetween(todayISO(), dueDateISO);
  if(d < 0) return {level:'red', label:`Overdue ${Math.abs(d)}d`};
  if(d <= warnDays) return {level:'orange', label:`Due in ${d}d`};
  return {level:'green', label:`OK (${fmtDate(dueDateISO)})`};
}
function odoStatus(currentOdo, dueOdo, warnKm=500){
  if(!dueOdo) return {level:'neutral', label:'Not set'};
  const diff = dueOdo - currentOdo;
  if(diff < 0) return {level:'red', label:`Overdue ${Math.abs(diff)} km`};
  if(diff <= warnKm) return {level:'orange', label:`Due in ${diff} km`};
  return {level:'green', label:`OK (${dueOdo} km)`};
}
function buildAlerts(){
  const alerts = [];
  DB.vehicles.all().forEach(v => {
    const push = (level,label,text) => alerts.push({level, label, text, vehicle:v.name, vehicleId:v.id});
    if(v.insurance?.expiryDate){ const s=reminderStatus(v.insurance.expiryDate, v.insurance.reminderDays||30);
      if(s.level!=='green') push(s.level, s.label, `${v.name} — Insurance`); }
    if(v.fuelType!=='Electric (EV)' && v.puc?.expiryDate){ const s=reminderStatus(v.puc.expiryDate, 15);
      if(s.level!=='green') push(s.level, s.label, `${v.name} — PUC Certificate`); }
    if(v.fc?.expiryDate){ const s=reminderStatus(v.fc.expiryDate, v.fc?.reminderDays||30);
      if(s.level!=='green') push(s.level, s.label, `${v.name} — Fitness Certificate`); }
    categoriesFor(v).forEach(cat => {
      const st = computeScheduleStatus(v, cat);
      if(st.status==='Overdue' || st.status==='Due Soon'){
        const level = scheduleStatusLevel(st.status);
        const bits = [];
        if(st.remainingKm!=null) bits.push(st.remainingKm<0 ? `${Math.abs(st.remainingKm)} km overdue` : `due in ${st.remainingKm} km`);
        if(st.remainingDays!=null) bits.push(st.remainingDays<0 ? `${Math.abs(st.remainingDays)}d overdue` : `due in ${st.remainingDays}d`);
        push(level, bits.join(' · ') || st.status, `${v.name} — ${cat}`);
      }
    });
  });
  const order = {red:0, orange:1, green:2, neutral:3};
  return alerts.sort((a,b)=>order[a.level]-order[b.level]);
}

/* ---------------------- mileage / efficiency ----------------------
   Each fuel/EV entry now stores its own mileage/efficiency (computed from
   that entry's starting & ending odometer + fuel/units used), so stats
   are just simple aggregates over the vehicle's entries. */
function mileageStats(vid){
  const runs = DB.fuel.byVehicle(vid).map(f=>f.mileage).filter(m=>typeof m==='number' && m>0);
  if(!runs.length) return null;
  return { last: runs[runs.length-1], avg: runs.reduce((a,b)=>a+b,0)/runs.length, best: Math.max(...runs), worst: Math.min(...runs), count: runs.length };
}
function evEfficiencyStats(vid){
  const runs = DB.ev.byVehicle(vid).map(e=>e.efficiency).filter(m=>typeof m==='number' && m>0);
  if(!runs.length) return null;
  return { last: runs[runs.length-1], avg: runs.reduce((a,b)=>a+b,0)/runs.length, best: Math.max(...runs), worst: Math.min(...runs) };
}

/* ---------------------- shared widgets ---------------------- */
function vehicleOptions(selectedId){
  return DB.vehicles.all().map(v=>`<option value="${v.id}" ${v.id===selectedId?'selected':''}>${esc(v.name)} — ${esc(v.regNo)}</option>`).join('');
}
function fileToDataUrl(input){
  return new Promise((resolve) => {
    const f = input.files && input.files[0];
    if(!f){ resolve(null); return; }
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => resolve(null);
    r.readAsDataURL(f);
  });
}

/* ---------------------- theme ---------------------- */
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  const btn = $('#themeToggle'); if(btn) btn.textContent = theme==='dark' ? '🌙' : '☀️';
  const s = DB.settings.get(); s.theme = theme; DB.settings.save(s);
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', theme==='dark' ? '#14171C' : '#F3F4F6');
}
function wireThemeToggle(){
  const btn = $('#themeToggle'); if(!btn) return;
  btn.onclick = () => { const cur = document.documentElement.getAttribute('data-theme'); applyTheme(cur==='dark' ? 'light' : 'dark'); };
}

/* ---------------------- bottom nav active state ---------------------- */
function markActiveNav(pageFile){
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page===pageFile));
}

/* ---------------------- service worker (best-effort) ---------------------- */
if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(()=>{}); });
}

/* ---------------------- boot helper for protected pages ---------------------- */
function initPage(pageFile){
  AUTH.guard();
  applyTheme(DB.settings.get().theme || 'dark');
  wireThemeToggle();
  markActiveNav(pageFile);
}
