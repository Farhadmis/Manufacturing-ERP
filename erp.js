/* ===== Mainetti ERP · shared Supabase helper (load AFTER supabase-js CDN) ===== */
const SUPABASE_URL = "https://oezwkjvxueyhhkwxaezu.supabase.co";   // <-- Supabase → Settings → API → Project URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lendranZ4dWV5aGhrd3hhZXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MDE1NzYsImV4cCI6MjEwOTE3NzU3Nn0._kChJG8jN8SziSJQU4bFUMKg2DcX9jRl1LHy5w-XBHo";              // <-- Settings → API → anon public key
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ERP = {
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
  async tree() {
    const [a, b] = await Promise.all([
      sb.from("modules").select("*").order("sort").order("id"),
      sb.from("submodules").select("*").order("sort").order("id")]);
    if (a.error) throw a.error; if (b.error) throw b.error;
    return a.data.map(m => ({ ...m, subs: b.data.filter(s => s.module_id === m.id) }));
  },
  /* dataset of a module/sub-module → {cols, rows:[{id,data:[..]}], total} | null.  limit = max rows (omit = all) */
  async dataset(id, limit) {
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
    const { data, error } = await sb.storage.from("erp-data").createSignedUrl(path, 120);
    if (error) throw error;
    const r = await fetch(data.signedUrl, { cache: "no-store" });
    if (!r.ok) throw new Error("Storage: " + path + " (" + r.status + ")");
    return r;
  },
  /* id = module id, name = "fg" → {v, dict, c, q} | null */
  async packed(id, name) {
    const base = id + "/" + name;
    let meta;
    try { meta = await (await this._fetchStorage(base + "_meta.json")).json(); }
    catch (e) { return null; }
    const ck = "packed:" + base, hit = await this._get(ck);
    if (hit && hit.v === meta.v) return hit;
    const r = await this._fetchStorage(base + ".json.gz");
    const obj = await new Response(r.body.pipeThrough(new DecompressionStream("gzip"))).json();
    await this._put(ck, obj);
    return obj;
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
      match: /^order\b/i, snap: true,
      dims: ["date", "buyer", "model", "color", "art"],
      upper: ["buyer", "model", "color"],
      meas: ["availablestock", "totaldemand", "totallcrequirement", "productionrequirement"],
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
    }
  }
};


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
        const { data } = await sb.from("datasets").select("updated_at").eq("node_id", id).maybeSingle();
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
