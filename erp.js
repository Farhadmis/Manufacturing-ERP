/* ===== Mainetti ERP · shared Supabase helper (load AFTER supabase-js CDN) ===== */
const SUPABASE_URL = "https://oezwkjvxueyhhkwxaezu.supabase.co";   // <-- Supabase → Settings → API → Project URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lendranZ4dWV5aGhrd3hhZXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MDE1NzYsImV4cCI6MjEwOTE3NzU3Nn0._kChJG8jN8SziSJQU4bFUMKg2DcX9jRl1LHy5w-XBHo";              // <-- Settings → API → anon public key
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ORD_P = Array.from({ length: 11 }, (_, i) => (i == 0 ? "1st" : i == 1 ? "2nd" : i == 2 ? "3rd" : (i + 1) + "th") + "priority");
/* Order Ageing: নতুন Excel header = "1 Week", "2 Weeks" … "11 Weeks" (normalize হলে 1week, 2weeks … 11weeks) */
const ORD_O = Array.from({ length: 11 }, (_, i) => (i + 1) + "week" + (i ? "s" : ""));
/* পুরনো header ("Order-1 Week Older" … "Order-More than 10 Weeks") এখনও চলবে */
const ORD_O_OLD = Array.from({ length: 10 }, (_, i) => "order" + (i + 1) + "week" + (i ? "s" : "") + "older").concat(["ordermorethan10weeks"]);
const ORD_ALIAS = {}; ORD_O.forEach((k, i) => ORD_ALIAS[k] = ORD_O_OLD[i]);
const ORD_S = ["030days", "3160days", "6190days", "91180days", "181365days", "366730days", "730days"];
/* Stock Ageing: Excel header = "Stock 0–30 days" … "Stock 730 days+++" (normalize হলে stock030days … stock730days) */
ORD_S.forEach(k => ORD_ALIAS[k] = "stock" + k);

/* ===== Production & Planning · sub-module packs (source: Production.xlsx, এক সারি = এক machine × shift × দিন) =====
   Ratio (Availability, Performance, OEE, PPPH) জমা করা হয় না — যোগ করা যায় না বলে। বদলে যোগযোগ্য অংশ জমা হয়, পেজ হিসাব করবে:
     Availability = 1 − Σ totalunplanneddt ÷ Σ shiftlengthmin        Quality     = Σ goodproduction ÷ Σ totalproduction
     Performance  = Σ effprod ÷ Σ capacity                            OEE         = Availability × Performance × Quality
     PPPH         = Σ goodproduction ÷ Σ manhours
   (এই সূত্রে আপনার Production.xlsx-এর ৯টা row-র A, Q, P, OEE, PPPH মিলিয়ে দেখা হয়েছে) */
const PP_PLAN = ["nodemandplandt", "trialproductplandt", "machineplandt", "moldchangeplandt", "cavitychangeplandt", "colorchangeplandt", "moldplandt"];
const PP_UNPL = ["machineunplandt", "moldunplandt", "materialunplandt", "systemproblemunplandt", "utilityunplandt", "manpowershortageunplandt"];
const PP_DOWN_M = ["shiftlengthmin", "productiondurationmin", ...PP_PLAN, "totalplandt", ...PP_UNPL, "totalunplanneddt"];
const PP_MACH_M = ["plannedproduction", "finishproduct", "wip", "scrappcs", "totalscrapqty", "goodproduction", "totalproduction", "materialconsumptioninkg",
  "shiftlengthmin", "productiondurationmin", "totalplandt", "totalunplanneddt", "capacity", "effprod"];
const PP_MAN_M = ["manpower", "manhours", "goodproduction", "totalproduction", "finishproduct", "shiftlengthmin", "productiondurationmin"];
function ppFixDown(vals, raw) {                          // Total ঘর ফাঁকা থাকলে অংশগুলো যোগ করে বসায়
  const I = k => PP_DOWN_M.indexOf(k), sum = a => a.reduce((s, k) => s + vals[I(k)], 0);
  if (raw[I("totalplandt")] === "") vals[I("totalplandt")] = sum(PP_PLAN);
  if (raw[I("totalunplanneddt")] === "") vals[I("totalunplanneddt")] = sum(PP_UNPL);
}
function ppFixMach(vals) {                               // capacity = Planned × Availability ; effprod = min(Total, capacity)
  const I = k => PP_MACH_M.indexOf(k), sh = vals[I("shiftlengthmin")];
  const cap = sh > 0 ? Math.max(0, vals[I("plannedproduction")] * (1 - vals[I("totalunplanneddt")] / sh)) : 0;
  vals[I("capacity")] = cap; vals[I("effprod")] = Math.min(vals[I("totalproduction")], cap);
}
function ppFixMan(vals) {                                // manhours = Manpower × Shift Length ÷ 60
  const I = k => PP_MAN_M.indexOf(k);
  vals[I("manhours")] = vals[I("manpower")] * vals[I("shiftlengthmin")] / 60;
}
/* Manpower Performance (Excel: Date, Criteria, Shift Time, M/C NO., Model Name, Casual/Permanent-Manpower, Tool, process columns…, Total, Unit Name, MC Type, Bay Name) */
const PP_MANP_PROC = ["machine", "flashcutting", "automation", "manualhooking", "manualclip", "semiautoclip", "printing", "tubetissuefitting", "hangercleancheck", "notchfitting", "underlegfitting", "foamfitting", "packing"];
const PP_MANP_M = ["casualmanpower", "permanentmanpower", "total", ...PP_MANP_PROC];
function ppFixManP(vals, raw) {                          // Total ঘর ফাঁকা থাকলে = Casual + Permanent
  const I = k => PP_MANP_M.indexOf(k);
  if (raw[I("total")] === "") vals[I("total")] = vals[I("casualmanpower")] + vals[I("permanentmanpower")];
}
const PP_SCRAP = ["scrapshortmold", "scrapcolorchange", "scrapflowmark", "scrapotherscrap", "scrapoilgrease", "scrapexcessflash", "scrapmoldclean", "scrapstartup", "scrapburnpinmark", "scrapwatermark"];
const PP_SHOP_M = ["plannedproduction", "finishproduct", "wip", "scrappcs", "goodproduction", "totalproduction", "totalscrapqty", "lostcavity",
  "materialconsumptioninkg", "materialrecycled", "totalmaterialusedgm", "shiftlengthmin", "productiondurationmin", "manpower", "manhours",
  ...PP_PLAN, "totalplandt", ...PP_UNPL, "totalunplanneddt", ...PP_SCRAP, "capacity", "effprod"];
function ppFixShop(vals, raw) {                          // Production-Shopfloor: পুরো Production.xlsx ফরম্যাট
  const I = k => PP_SHOP_M.indexOf(k), sum = a => a.reduce((s, k) => s + vals[I(k)], 0);
  if (raw[I("totalplandt")] === "") vals[I("totalplandt")] = sum(PP_PLAN);
  if (raw[I("totalunplanneddt")] === "") vals[I("totalunplanneddt")] = sum(PP_UNPL);
  const sh = vals[I("shiftlengthmin")];
  const cap = sh > 0 ? Math.max(0, vals[I("plannedproduction")] * (1 - vals[I("totalunplanneddt")] / sh)) : 0;
  vals[I("capacity")] = cap; vals[I("effprod")] = Math.min(vals[I("totalproduction")], cap);
  vals[I("manhours")] = vals[I("manpower")] * sh / 60;
}
const ERP = {
  /* ===== DUAL MODE · centralized data resolver =====
     mode: "office" (default, existing behaviour) | "audit" (data under "a_<id>", only enabled modules visible)
     Every data read below goes through nid()/spath(), so pages need no mode logic. */
  mode: "office", auditIds: null, _force: null,
  nid(id, m) { m = m || this._force || this.mode; id = String(id); return m === "audit" && !id.startsWith("a_") ? "a_" + id : id; },
  spath(path, m) { m = m || this._force || this.mode; return m === "audit" && !path.startsWith("a_") ? "a_" + path : path; },
  modeReady() {
    return this._mr || (this._mr = (async () => {
      try {
        const { data } = await sb.from("app_settings").select("key,value");
        (data || []).forEach(r => { if (r.key === "mode") this.mode = r.value && r.value.active === "audit" ? "audit" : "office"; if (r.key === "audit_modules") this.auditIds = (r.value && r.value.ids) || []; });
      } catch (e) { console.error("mode load failed → office", e); }
    })());
  },
  async setMode(m) { const { error } = await sb.from("app_settings").upsert({ key: "mode", value: { active: m }, updated_at: new Date().toISOString() }); if (error) throw error; this.mode = m; },
  async setAuditIds(ids) { const { error } = await sb.from("app_settings").upsert({ key: "audit_modules", value: { ids }, updated_at: new Date().toISOString() }); if (error) throw error; this.auditIds = ids; },
  sb,
  email: id => { id = String(id).trim().toLowerCase(); return id.includes("@") ? id : id + "@mainetti.app"; },
  /* session + profile guard. ERP.require() → profile | null (redirects when not allowed) */
  async require(adminOnly) {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { location.replace("index.html"); return null; }
    const { data: p, error } = await sb.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
    if (error || !p || !p.active) { await sb.auth.signOut(); location.replace("index.html"); return null; }
    if (adminOnly && p.role !== "admin") { location.replace("portal.html"); return null; }
    return p;
  },
  async signOut() { await sb.auth.signOut(); location.replace("index.html"); },
  /* permission: admin = all; else own flag; sub-module view also inherits parent module view */
  can(p, id, k = "v", parentId) {
    if (!p) return false; if (p.role === "admin") return true;
    const g = x => !!(p.perm && p.perm[x] && p.perm[x][k]);
    return g(id) || (k === "v" && !!parentId && g(parentId));
  },
  /* modules with their sub-modules: [{id,name,sort,subs:[{id,name,sort}]}] */
  async tree(raw) {
    await this.modeReady();
    const [a, b] = await Promise.all([
      sb.from("modules").select("*").order("sort").order("id"),
      sb.from("submodules").select("*").order("sort").order("id")]);
    if (a.error) throw a.error; if (b.error) throw b.error;
    let T = a.data.map(m => ({ ...m, subs: b.data.filter(s => s.module_id === m.id) }));
    if (!raw && this.mode === "audit") {   /* Audit: only ticked modules/sub-modules. Tick a module = all its subs; tick only some subs = just those */
      const on = new Set(this.auditIds || []);
      T = T.filter(m => on.has(m.id) || m.subs.some(s => on.has(s.id)))
        .map(m => ({ ...m, subs: m.subs.filter(s => on.has(s.id) || (on.has(m.id) && !m.subs.some(x => on.has(x.id)))) }));
    }
    return T;
  },
  /* dataset of a module/sub-module → {cols, rows:[{id,data:[..]}], total} | null.  limit = max rows (omit = all) */
  async dataset(id, limit) {
    await this.modeReady(); id = this.nid(id);
    const { data: ds, error } = await sb.from("datasets").select("cols").eq("node_id", id).maybeSingle();
    if (error) throw error; if (!ds) return null;
    const rows = [], step = 1000; let from = 0, total = null;
    for (; ;) {
      const to = limit ? Math.min(from + step, limit) - 1 : from + step - 1;
      const { data, error: e2, count } = await sb.from("dataset_rows").select("id,data", from ? {} : { count: "exact" })
        .eq("node_id", id).order("id").range(from, to);
      if (e2) throw e2; if (count != null) total = count; rows.push(...data);
      if (data.length < to - from + 1 || (limit && rows.length >= limit)) break; from += step;
    }
    return { cols: ds.cols, rows, total: total ?? rows.length };
  },

  /* ===== Storage packed file + IndexedDB cache ===== */
  _idb() {
    return this._db || (this._db = new Promise((res, rej) => {
      const r = indexedDB.open("erp-cache", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("m");
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    }));
  },
  async _get(k) {
    try {
      const db = await this._idb();
      return await new Promise(res => {
        const q = db.transaction("m").objectStore("m").get(k);
        q.onsuccess = () => res(q.result); q.onerror = () => res(null);
      });
    } catch (e) { return null; }
  },
  async _put(k, v) {
    try {
      const db = await this._idb();
      await new Promise(res => {
        const t = db.transaction("m", "readwrite");
        t.objectStore("m").put(v, k); t.oncomplete = res; t.onerror = res;
      });
    } catch (e) { }
  },
  async _fetchStorage(path) {
    await this.modeReady(); path = this.spath(path);
    const { data, error } = await sb.storage.from("erp-data").createSignedUrl(path, 120);
    if (error) throw error;
    const r = await fetch(data.signedUrl, { cache: "no-store" });
    if (!r.ok) throw new Error("Storage: " + path + " (" + r.status + ")");
    return r;
  },
  /* id = module id, name = "fg" → {v, dict, c, q} | null
     দ্রুত লোড: cache থাকলে meta চেক সর্বোচ্চ 2.5 সেকেন্ড অপেক্ষা, তারপর cache থেকেই দেখাবে */
  async packed(id, name) {
    await this.modeReady();
    const base = id + "/" + name, ck = "packed:" + this.spath(base);
    const metaP = this._fetchStorage(base + "_meta.json").then(r => r.json()).catch(() => null);
    const hit = await this._get(ck);
    let meta;
    if (hit) {
      meta = await Promise.race([metaP, new Promise(r => setTimeout(() => r(undefined), 2500))]);
      if (meta === undefined || (meta && hit.v === meta.v)) return hit;
    } else meta = await metaP;
    if (!meta) return null;
    const r = await this._fetchStorage(base + ".json.gz");
    const obj = await new Response(r.body.pipeThrough(new DecompressionStream("gzip"))).json();
    await this._put(ck, obj);
    return obj;
  },
  /* Portal খোলার পর ব্যাকগ্রাউন্ডে অনুমতি-পাওয়া module-গুলোর ডেটা cache-এ আনে, ক্লিক করলে সাথে সাথে দেখায় */
  prefetch(p, tree) {
    const run = async () => {
      for (const m of tree || []) {
        for (const n of [m, ...m.subs]) {                 // module + sub-module দুটোরই প্যাক cache-এ আনে
          const k = ERP.packKey(n.name); if (!k) continue;
          const ok = n === m ? (ERP.can(p, m.id) || m.subs.some(s => ERP.can(p, s.id, "v", m.id))) : ERP.can(p, n.id, "v", m.id);
          if (!ok) continue;
          try { await ERP.packed(n.id, k) } catch (e) { }
        }
      }
    };
    (window.requestIdleCallback || (f => setTimeout(f, 800)))(run);
  },

  /* ===== কোন module-এর ডেটা কীভাবে প্যাক হবে (নতুন module এখানে যোগ হবে) ===== */
  PACK: {
    fg: {
      match: /finish|\bfg\b/i,
      dims: ["date", "unit", "article", "model", "buyer", "color", "shift", "prodtype", "mctype", "process", "category", "timesofprocess"],
      upper: ["model", "buyer", "color", "shift", "mctype", "process", "timesofprocess"],
      meas: ["totalqty"], need: ["date", "totalqty"], legacyQ: true
    },
    /* Order module · Outstanding snapshot (তারিখ নেই; প্রতি upload-এ আগেরটা বদলে যায়) */
    order: {
      match: /^order\b/i, snap: true, alias: ORD_ALIAS,
      dims: ["date", "buyer", "model", "color", "art", "category", "stockstatus", "process", "timesofprocess", "hook", "print", "accessories", "other"],
      upper: ["buyer", "model", "color", "category", "process", "timesofprocess"],
      meas: ["availablestock", "totaldemand", "totallcrequirement", "productionrequirement", ...ORD_P, ...ORD_O, ...ORD_S],
      need: ["buyer", "availablestock", "totaldemand", "totallcrequirement", "productionrequirement"]
    },
    delivery: {
      match: /deliver/i,
      dims: ["date", "customername", "buyer", "model", "modelcolor", "paymentterms", "region", "prodtype", "ordertype", "unitprice"],
      upper: ["buyer", "model", "modelcolor", "paymentterms", "region"],
      meas: ["hangerqty", "sizerqty", "hangervalue", "sizervalue"], need: ["date", "hangerqty"],
      /* Value ফাঁকা থাকলে Qty × Unit Price ÷ 100 (আগের পেজের নিয়মই) */
      fix(v, raw, d) {
        const up = parseFloat(String(d.unitprice).replace(/,/g, "")) || 0;
        if (raw[2] === "") v[2] = v[0] * up / 100;
        if (raw[3] === "") v[3] = v[1] * up / 100;
      }
    },

    /* ===== Production & Planning · 3 sub-module (প্রতিটার আলাদা Upload — Admin → Data Manager) ===== */
    downtime: {   /* Breakdown.xlsx (event-wise): Date, Shift, Bay Name, M/C No., Tool No, Stop/Start Date/Time, Duration(Min), Category, Reason, Details Occurrence, MC Type */
      match: /downtime/i,
      dims: ["date", "shift", "bayname", "mcno", "toolno", "category", "reason", "detailsoccurrence", "mctype"],
      upper: ["shift", "bayname", "mcno", "toolno", "category", "reason", "detailsoccurrence", "mctype"],
      meas: ["durationmin", "events"], need: ["date", "durationmin"],
      fix(v) { v[1] = 1; }          /* প্রতিটি Excel row = ১টি failure/event */
    },
    machine: {
      match: /machine\s*overview/i,
      dims: ["date", "bayname", "shifttime", "mcno", "modelname", "colorname", "toolno", "group", "productcategory", "materialtype", "standardcavity", "runningcavity", "standardcycle", "runningcycle"],
      upper: ["bayname", "shifttime", "mcno", "modelname", "colorname", "toolno", "group"],
      meas: PP_MACH_M, need: ["date", "mcno"], fix: ppFixMach
    },
    manpower: {
      match: /manpower/i,
      dims: ["date", "bayname", "criteria", "shifttime", "mcno", "modelname", "tool", "unitname", "mctype"],
      upper: ["bayname", "criteria", "shifttime", "mcno", "modelname", "unitname", "mctype"],
      meas: PP_MANP_M, need: ["date", "casualmanpower", "permanentmanpower"], fix: ppFixManP
    },
    /* Production-Shopfloor · পুরো Production.xlsx (সব column) */
    shopfloor: {
      match: /shop\s*-?\s*floor|shopfoor/i,
      dims: ["date", "bayname", "shifttime", "mcno", "modelname", "colorname", "toolno", "group", "productcategory", "materialtype",
        "standardcavity", "runningcavity", "standardcycle", "runningcycle", "productshotweight", "perpcsweight", "runnerweight",
        "masterbatch", "rubber", "materials", "mctype"],
      upper: ["bayname", "shifttime", "mcno", "modelname", "colorname", "toolno", "group", "mctype"],
      meas: PP_SHOP_M, need: ["date", "mcno"], fix: ppFixShop
    }
  }
};
ERP.packKey = n => Object.keys(ERP.PACK).find(k => ERP.PACK[k].match.test(String(n).trim()));


/* ===== Sidebar banner card (shared by all module pages) ===== */
ERP.sideBanner = async function (ids, packs) {
  const sd = document.getElementById("sd"); if (!sd || sd.querySelector(".sbc")) return;
  if (!document.getElementById("sbc-css")) {
    const st = document.createElement("style"); st.id = "sbc-css";
    st.textContent =
      "aside.sbx{display:flex;flex-direction:column;overflow-x:hidden;overflow-y:auto}" +
      "aside.sbx>.nv{flex:none}" +
      /* বাকি জায়গা কার্ড নেবে; জায়গা কম হলে min-height রেখে সাইডবার স্ক্রল হবে */
      ".sbc{flex:0 1 auto;min-height:0;margin:auto 12px 12px;border-radius:14px;position:relative;overflow:hidden;" +
      "display:flex;flex-direction:column;" +
      "background:#fff;box-shadow:0 4px 14px rgba(16,44,92,.12)}" +
      ".sbc img{flex:0 1 auto;min-height:0;width:100%;height:auto;object-fit:cover;object-position:center top;display:block;" +
      "image-rendering:auto;-webkit-backface-visibility:hidden;backface-visibility:hidden}" +
      ".sbc .sbf{flex:none;display:flex;align-items:center;gap:10px;padding:12px;" +
      "color:#fff;background:linear-gradient(180deg,#0c3a8f,#052a72);font-family:Inter,sans-serif}" +
      ".sbc .sbf svg{width:20px;height:20px;flex:none;fill:none;stroke:#fff;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}" +
      ".sbc .sbf small{display:block;font-size:10px;font-weight:500;opacity:.92;line-height:1.3}" +
      ".sbc .sbf b{display:block;font-size:11px;font-weight:700;line-height:1.35}" +
      "aside.col .sbc{display:none}" +
      "@media(max-width:900px){.sbc{display:none}}";
    document.head.appendChild(st);
  }
  sd.classList.add("sbx");
  const c = document.createElement("div"); c.className = "sbc";
  c.innerHTML =
    '<img src="sidebar-banner.jpg" alt="" decoding="async" loading="eager" onerror="this.remove()">' +
    '<div class="sbf"><svg viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/>' +
    '<path d="M4.5 5.5v6.5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V5.5M4.5 12v6.5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V12"/></svg>' +
    '<div><small>Data Updated:</small><b class="sbd">…</b></div></div>';
  sd.appendChild(c);

  const MNs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const label = c.querySelector(".sbd");

  /* সর্বশেষ upload-এর সময় = সব dataset/pack-এর মধ্যে সবচেয়ে নতুনটা */
  async function refresh() {
    let best = 0;
    try {
      for (const id of ids || []) {
        const { data } = await sb.from("datasets").select("updated_at").eq("node_id", ERP.nid(id)).maybeSingle();
        if (data && data.updated_at) best = Math.max(best, new Date(data.updated_at).getTime() || 0);
      }
      for (const [id, nm] of packs || []) {
        try {
          const m = await (await ERP._fetchStorage(id + "/" + nm + "_meta.json")).json();
          const t = (m && m.at && new Date(m.at).getTime()) || (m && +m.v) || 0;
          best = Math.max(best, t);
        } catch (e) { }
      }
    } catch (e) { console.error(e); }
    const d = best ? new Date(best) : null;
    label.textContent = d ? d.getDate() + " " + MNs[d.getMonth()] + " " + d.getFullYear() + ", by import-xlsx" : "—";
  }
  await refresh();
  /* অন্য ট্যাবে নতুন upload হলে, এই ট্যাবে ফিরলেই ডেট নিজে বদলাবে */
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
};
