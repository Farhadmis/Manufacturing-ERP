/* ===== plan_calendar.js · Phase 1 — Annual Planning Calendar & Holiday Setup =====
   Load AFTER erp.js and the XLSX library.  Usage (planning page):
     await PlanCal.init({ PS, ME, DAYS: CAL_DAYS, onChange: renderCal });   PlanCal.openSetup();

   DUAL-MODE RULE (Office ⇄ Audit = two completely independent environments)
   • Every read goes through ERP.packed()  → path = ERP.spath(...)  (Audit = "a_" prefix, own IndexedDB key).
   • Every write goes through ERP.spath()  → Office upload can never touch "a_" files and vice-versa.
   • Nothing is kept in localStorage / sessionStorage by this module; in-memory state is reset on mode change.
   • Before EVERY write the active mode is re-read from the DB; if it differs from the mode this page loaded
     with (admin switched in another tab) the write is refused and the page reloads. */
(function () {
  const F = { cal: "plan_cal", mnt: "plan_mnt", chg: "plan_chg" };            // 3 separate stores (never mixed)
  const HT = ["Weekly Off", "Government Holiday", "Festival Holiday", "Factory Holiday"];
  const H = {
    cal: ["Date", "Day", "Week No.", "Month", "Weekly Off?", "Holiday Name", "Holiday Type", "Remarks", "Work Status"],
    mnt: ["Machine No", "Date From", "Date To", "Maintenance Type ", "Shift", "Shift Hrs", "Remarks"],
    chg: ["Date", "Shift", "Shift Hrs", "Machine No", "Tool No", "ART", "From Model", "To Model", " Duration(min)", "Remarks"]
  };
  const SHEET = { cal: "Calendar Master", mnt: "Maintenance", chg: "Changeover" };
  const DN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const nk = s => String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]/g, "");
  const pad = n => String(n).padStart(2, "0");
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const iso = (y, m, d) => y + "-" + pad(m) + "-" + pad(d);
  const parts = k => k.split("-").map(Number);
  const dow = k => { const [y, m, d] = parts(k); return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); };
  function isoWeek(k) {
    const [y, m, d] = parts(k), t = new Date(Date.UTC(y, m - 1, d)), n = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - n); const y0 = Date.UTC(t.getUTCFullYear(), 0, 1);
    return Math.ceil(((t - y0) / 864e5 + 1) / 7);
  }
  function validIso(y, m, d) { const t = new Date(Date.UTC(y, m - 1, d)); return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d; }
  const MON3 = MN.map(x => x.slice(0, 3).toLowerCase());
  function parseDate(v) {
    if (v == null || v === "") return null;
    if (v instanceof Date) return isNaN(v) ? null : iso(v.getFullYear(), v.getMonth() + 1, v.getDate());
    if (typeof v === "number") { if (v < 20000 || v > 80000) return null; const t = new Date(Date.UTC(1899, 11, 30) + Math.floor(v) * 864e5); return iso(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()); }
    const s = String(v).trim(); let m;
    if ((m = s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/))) return validIso(+m[1], +m[2], +m[3]) ? iso(+m[1], +m[2], +m[3]) : null;
    if ((m = s.match(/^(\d{1,2})[-\/. ]([A-Za-z]{3,9}|\d{1,2})[-\/. ,]+(\d{4})$/))) {
      const mo = /\d/.test(m[2]) ? +m[2] : MON3.indexOf(m[2].slice(0, 3).toLowerCase()) + 1;
      return mo && validIso(+m[3], mo, +m[1]) ? iso(+m[3], mo, +m[1]) : null;
    }
    return null;
  }
  const serial = k => { const [y, m, d] = parts(k); return (Date.UTC(y, m - 1, d) - Date.UTC(1899, 11, 30)) / 864e5; };
  const status = r => r.name ? "Holiday" : r.off ? "Weekly Off" : "Working Day";

  /* ---------- state ---------- */
  let X = null, PS = null, ME = null, DAYS = null, onChange = () => { }, LOADED_MODE = null;
  let D = { cal: [], mnt: [], chg: [], meta: {} };
  const isAdmin = () => !!ME && ME.role === "admin";
  const modeName = () => (LOADED_MODE || ERP.mode) === "audit" ? "AUDIT" : "OFFICE";

  function rebuild() {                                     // sheet → calendar colours (holiday/weekly-off = hol, else prod)
    Object.keys(DAYS).forEach(k => delete DAYS[k]);
    D.cal.forEach(r => { DAYS[r.date] = (r.name || r.off) ? "hol" : "prod"; });
    const yrs = new Set(D.cal.map(r => r.date.slice(0, 4)));
    yrs.forEach(y => { for (let m = 1; m <= 12; m++) for (let d = 1; d <= 31; d++) if (validIso(+y, m, d)) { const k = iso(+y, m, d); if (!DAYS[k]) DAYS[k] = "unp"; } });
  }
  async function freshMode() {
    const { data } = await ERP.sb.from("app_settings").select("value").eq("key", "mode").maybeSingle();
    return data && data.value && data.value.active === "audit" ? "audit" : "office";
  }
  async function loadAll() {
    const g = async f => { try { return (await ERP.packed(PS.id, f)) || null } catch (e) { console.error(e); return null } };
    const [c, m, h] = await Promise.all([g(F.cal), g(F.mnt), g(F.chg)]);
    D = { cal: (c && c.rows) || [], mnt: (m && m.rows) || [], chg: (h && h.rows) || [], meta: { cal: c, mnt: m, chg: h } };
    D.cal.sort((a, b) => a.date < b.date ? -1 : 1);
    rebuild();
  }
  const gz = async o => await new Response(new Blob([JSON.stringify(o)]).stream().pipeThrough(new CompressionStream("gzip"))).blob();
  async function save(kinds, file) {                       // kinds ⊂ cal|mnt|chg ; writes ONLY under the active mode's path
    if (!isAdmin()) throw new Error("Admin only");
    const now = await freshMode();
    if (now !== LOADED_MODE) { setTimeout(() => location.reload(), 1200); throw new Error("Mode was switched in another tab — page will reload. Nothing was saved."); }
    const st = ERP.sb.storage.from("erp-data");
    for (const k of kinds) {
      const v = Date.now(), obj = { v, at: new Date().toISOString(), file: file || "holiday-setup", rows: D[k] };
      const base = PS.id + "/" + F[k];
      let r = await st.upload(ERP.spath(base + ".json.gz"), await gz(obj), { upsert: true, contentType: "application/gzip", cacheControl: "0" }); if (r.error) throw r.error;
      r = await st.upload(ERP.spath(base + "_meta.json"), new Blob([JSON.stringify({ v, n: obj.rows.length, at: obj.at, file: obj.file })], { type: "application/json" }), { upsert: true, contentType: "application/json", cacheControl: "0" }); if (r.error) throw r.error;
      await ERP._put("packed:" + ERP.spath(base), obj);    // refresh this mode's own cache only
    }
  }

  /* ---------- Excel: parse + validate ---------- */
  function readSheet(wb, key, E) {
    const name = wb.SheetNames.find(n => nk(n) === nk(SHEET[key]));
    if (!name) { E.push({ s: SHEET[key], r: "-", m: "Sheet not found (expected name: “" + SHEET[key] + "”)" }); return null; }
    const a = X.utils.sheet_to_json(wb.Sheets[name], { header: 1, raw: true, defval: "" });
    const hd = (a[0] || []).map(nk), idx = {};
    H[key].forEach((h, i) => { const p = hd.indexOf(nk(h)); if (p < 0) E.push({ s: SHEET[key], r: 1, m: "Missing column “" + h.trim() + "”" }); idx[i] = p; });
    if (E.some(e => e.s === SHEET[key] && e.r === 1)) return null;
    return a.slice(1).map((row, i) => ({ n: i + 2, v: H[key].map((_, c) => row[idx[c]]) })).filter(x => x.v.some(c => String(c).trim() !== ""));
  }
  function parseWorkbook(wb) {
    const E = [], W = [], out = { cal: [], mnt: [], chg: [] };
    const cs = readSheet(wb, "cal", E), ms = readSheet(wb, "mnt", E), hs = readSheet(wb, "chg", E);
    if (cs) {
      const seen = new Map();
      cs.forEach(({ n, v }) => {
        const date = parseDate(v[0]); if (!date) return E.push({ s: SHEET.cal, r: n, m: "Invalid Date “" + v[0] + "” (use yyyy-mm-dd or dd-Mon-yyyy)" });
        if (seen.has(date)) return E.push({ s: SHEET.cal, r: n, m: "Duplicate date " + date + " (first at row " + seen.get(date) + ")" });
        seen.set(date, n);
        const wo = nk(v[4]); if (wo !== "yes" && wo !== "no") return E.push({ s: SHEET.cal, r: n, m: "Weekly Off? must be Yes or No" });
        const name = String(v[5]).trim(), type = String(v[6]).trim(), rem = String(v[7]).trim();
        if (name && !type) return E.push({ s: SHEET.cal, r: n, m: "Holiday Type required when Holiday Name is given" });
        if (type && !name) return E.push({ s: SHEET.cal, r: n, m: "Conflict: Holiday Type “" + type + "” without Holiday Name" });
        if (type && !HT.some(t => nk(t) === nk(type))) return E.push({ s: SHEET.cal, r: n, m: "Unknown Holiday Type “" + type + "” (allowed: " + HT.join(", ") + ")" });
        if (String(v[1]).trim() && nk(v[1]) !== nk(DN[dow(date)])) W.push({ s: SHEET.cal, r: n, m: "Day “" + v[1] + "” does not match " + date + " (" + DN[dow(date)] + ") — recalculated" });
        out.cal.push({ date, off: wo === "yes", name, type: type ? HT.find(t => nk(t) === nk(type)) : "", remarks: rem });
      });
      const yrs = [...new Set(out.cal.map(r => r.date.slice(0, 4)))];
      yrs.forEach(y => {
        const need = []; for (let m = 1; m <= 12; m++) for (let d = 1; d <= 31; d++) if (validIso(+y, m, d) && !seen.has(iso(+y, m, d))) need.push(iso(+y, m, d));
        if (need.length) E.push({ s: SHEET.cal, r: "-", m: y + ": " + need.length + " day(s) missing — full 01 Jan – 31 Dec required (first: " + need.slice(0, 3).join(", ") + ")" });
      });
      if (!out.cal.length && !E.some(e => e.s === SHEET.cal)) E.push({ s: SHEET.cal, r: "-", m: "No data rows" });
    }
    if (ms) ms.forEach(({ n, v }) => {
      const a = parseDate(v[1]), b = parseDate(v[2]);
      if (!String(v[0]).trim()) return E.push({ s: SHEET.mnt, r: n, m: "Machine No required" });
      if (!a || !b) return E.push({ s: SHEET.mnt, r: n, m: "Invalid Date From / Date To" });
      if (b < a) return E.push({ s: SHEET.mnt, r: n, m: "Date To is before Date From" });
      out.mnt.push({ machine: String(v[0]).trim(), from: a, to: b, type: String(v[3]).trim(), shift: String(v[4]).trim(), hrs: v[5], remarks: String(v[6]).trim() });
    });
    if (hs) hs.forEach(({ n, v }) => {
      const d = parseDate(v[0]);
      if (!d) return E.push({ s: SHEET.chg, r: n, m: "Invalid Date" });
      if (!String(v[3]).trim()) return E.push({ s: SHEET.chg, r: n, m: "Machine No required" });
      out.chg.push({ date: d, shift: String(v[1]).trim(), hrs: v[2], machine: String(v[3]).trim(), tool: v[4], art: v[5], from: String(v[6]).trim(), to: String(v[7]).trim(), dur: v[8], remarks: String(v[9]).trim() });
    });
    return { E, W, out };
  }

  /* ---------- Excel: export (same 3 sheets / headers / formats as the template) ---------- */
  function download() {
    const wb = X.utils.book_new(), dfmt = "dd-mmm-yyyy";
    const mk = (hdr, rows, dateCols, wid) => {
      const ws = X.utils.aoa_to_sheet([hdr, ...rows]);
      rows.forEach((r, i) => dateCols.forEach(c => { const cell = ws[X.utils.encode_cell({ r: i + 1, c })]; if (cell && typeof cell.v === "number") { cell.t = "n"; cell.z = dfmt; } }));
      ws["!cols"] = wid.map(w => ({ wch: w })); return ws;
    };
    const cal = D.cal.map(r => [serial(r.date), DN[dow(r.date)], isoWeek(r.date), MN[+r.date.slice(5, 7) - 1], r.off ? "Yes" : "No", r.name, r.type, r.remarks, status(r)]);
    const mnt = D.mnt.map(r => [r.machine, serial(r.from), serial(r.to), r.type, r.shift, r.hrs, r.remarks]);
    const chg = D.chg.map(r => [serial(r.date), r.shift, r.hrs, r.machine, r.tool, r.art, r.from, r.to, r.dur, r.remarks]);
    X.utils.book_append_sheet(wb, mk(H.cal, cal, [0], [13, 12, 10, 12, 12, 26, 20, 28, 14]), SHEET.cal);
    X.utils.book_append_sheet(wb, mk(H.mnt, mnt, [1, 2], [12, 13, 13, 18, 10, 10, 28]), SHEET.mnt);
    X.utils.book_append_sheet(wb, mk(H.chg, chg, [0], [13, 10, 10, 12, 10, 8, 14, 14, 14, 28]), SHEET.chg);
    X.writeFile(wb, "Calendar_Changeover_Maintenance_Master_" + modeName() + ".xlsx");
  }

  /* ---------- UI ---------- */
  function css() {
    if (document.getElementById("pcm-css")) return;
    const s = document.createElement("style"); s.id = "pcm-css";
    s.textContent = `.pcm-bd{position:fixed;inset:0;background:rgba(3,10,28,.72);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;font-family:Inter,system-ui,sans-serif}
.pcm{background:#0b1b44;color:#e8efff;border:1px solid #2a4a9a;border-radius:16px;width:min(1100px,100%);max-height:92vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.pcm.sm{width:min(560px,100%)}.pcm-h{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid #1f3a7a}.pcm-h b{font-size:17px;flex:1}
.pcm-mode{font-size:11px;font-weight:800;letter-spacing:.08em;padding:3px 10px;border-radius:99px;background:#1f9d55;color:#fff}.pcm-mode.audit{background:#d97706}
.pcm-b{padding:14px 18px;overflow:auto}.pcm-f{display:flex;gap:8px;justify-content:flex-end;padding:12px 18px;border-top:1px solid #1f3a7a}
.pcm input,.pcm select{background:#10285f;color:#fff;border:1px solid #2d4e9e;border-radius:8px;padding:7px 10px;font-size:13px}
.pcm button{background:#1d4ed8;color:#fff;border:0;border-radius:8px;padding:8px 14px;font-weight:600;font-size:13px;cursor:pointer}
.pcm button.g{background:#334e8f}.pcm button.r{background:#b91c1c}.pcm button.o{background:#16a34a}.pcm button.s{padding:4px 9px;font-size:12px}.pcm button[disabled]{opacity:.4;cursor:not-allowed}
.pcm-tb{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;align-items:center}.pcm-tb .sp{flex:1}
.pcm table{width:100%;border-collapse:collapse;font-size:13px}.pcm th,.pcm td{padding:7px 9px;border-bottom:1px solid #1a336f;text-align:left;white-space:nowrap}
.pcm th{position:sticky;top:0;background:#12307a;font-size:12px}.pcm td.w{white-space:normal}
.pcm .st{padding:2px 9px;border-radius:99px;font-size:11px;font-weight:700}.st.H{background:#2563eb}.st.W{background:#6d28d9}.st.K{background:#166534}
.pcm label{display:block;font-size:12px;margin:10px 0 4px;color:#a9bde8}.pcm .fl input,.pcm .fl select{width:100%;box-sizing:border-box}
.pcm .er{color:#fecaca}.pcm .wn{color:#fde68a}.pcm .box{background:#10285f;border-radius:10px;padding:10px 12px;margin:8px 0;font-size:13px}`;
    document.head.appendChild(s);
  }
  function modal(html, sm) {
    css(); const bd = document.createElement("div"); bd.className = "pcm-bd";
    bd.innerHTML = `<div class="pcm${sm ? " sm" : ""}">${html}</div>`; document.body.appendChild(bd);
    bd.close = () => bd.remove(); return bd;
  }
  const badge = () => (css(), "");
  const toast = t => { const e = document.createElement("div"); e.className = "yc-toast"; e.textContent = t; document.body.appendChild(e); setTimeout(() => e.remove(), 2200); };

  function form(title, r, lockDate, onOk) {
    const bd = modal(`<div class="pcm-h"><b>${title}</b>${badge()}</div><div class="pcm-b fl">
      <label>Date</label><input type="date" id="f-d" value="${r.date || ""}" ${lockDate ? "disabled" : ""}>
      <label>Holiday Name</label><input id="f-n" value="${esc(r.name || "")}">
      <label>Holiday Type</label><select id="f-t">${HT.map(t => `<option${t === r.type ? " selected" : ""}>${t}</option>`).join("")}</select>
      <label>Remarks</label><input id="f-r" value="${esc(r.remarks || "")}"><div id="f-e" class="er" style="margin-top:10px"></div></div>
      <div class="pcm-f"><button class="g" id="f-x">Cancel</button><button id="f-ok">Save</button></div>`, true);
    bd.querySelector("#f-x").onclick = bd.close;
    bd.querySelector("#f-ok").onclick = async () => {
      const v = { date: bd.querySelector("#f-d").value, name: bd.querySelector("#f-n").value.trim(), type: bd.querySelector("#f-t").value, remarks: bd.querySelector("#f-r").value.trim() };
      if (!v.date || !v.name) { bd.querySelector("#f-e").textContent = "Date and Holiday Name are required"; return }
      try { await onOk(v); bd.close() } catch (e) { bd.querySelector("#f-e").textContent = e.message || e }
    };
  }
  async function commit(mut, msg) {                        // mutate a COPY → save → swap (memory never diverges from storage)
    const keep = D.cal; D.cal = JSON.parse(JSON.stringify(keep));
    try { mut(); await save(["cal"]); } catch (e) { D.cal = keep; throw e }
    rebuild(); onChange(); if (msg) toast(msg);
  }
  const row = d => D.cal.find(r => r.date === d);

  function openSetup() {
    const yrs = [...new Set(D.cal.map(r => r.date.slice(0, 4)))].sort(), adm = isAdmin();
    const bd = modal(`<div class="pcm-h"><b>Holiday Setup</b>${badge()}<button class="g" id="x">✕</button></div><div class="pcm-b">
      <div class="pcm-tb">
        <select id="y">${yrs.map(y => `<option>${y}</option>`).join("") || "<option value=''>No calendar</option>"}</select>
        <input id="q" placeholder="Search name / date / remarks…" style="min-width:210px">
        <select id="m"><option value="">All months</option>${MN.map((m, i) => `<option value="${i + 1}">${m}</option>`).join("")}</select>
        <select id="t"><option value="">All types</option>${HT.map(t => `<option>${t}</option>`).join("")}</select>
        <select id="s"><option value="H">Holidays</option><option value="W">Weekly Off</option><option value="K">Working Day</option><option value="">All days</option></select>
        <span class="sp"></span>
        ${adm ? `<button id="add" class="o">＋ Add Holiday</button><button id="up">⬆ Upload Excel</button>` : ""}
        <button id="dl" class="g">⬇ Download Excel</button><input type="file" id="fi" accept=".xlsx,.xls" hidden>
      </div><div id="tb"></div></div>`);
    const $q = s => bd.querySelector(s);
    function draw() {
      const y = $q("#y").value, q = $q("#q").value.toLowerCase(), m = $q("#m").value, t = $q("#t").value, s = $q("#s").value;
      const SM = { H: "Holiday", W: "Weekly Off", K: "Working Day" };
      const L = D.cal.filter(r => r.date.startsWith(y + "-") && (!m || +r.date.slice(5, 7) === +m) && (!t || r.type === t) && (!s || status(r) === SM[s]) &&
        (!q || (r.date + " " + r.name + " " + r.remarks + " " + r.type).toLowerCase().includes(q)));
      $q("#tb").innerHTML = D.cal.length ? `<div style="margin-bottom:6px;font-size:12px;color:#a9bde8">${L.length} record(s)</div><table><thead><tr><th>Date</th><th>Day</th><th>Holiday Name</th><th>Type</th><th>Status</th><th>Remarks</th>${adm ? "<th></th>" : ""}</tr></thead><tbody>${L.slice(0, 400).map(r => { const S = status(r); return `<tr><td>${r.date}</td><td>${DN[dow(r.date)]}</td><td class="w">${esc(r.name)}</td><td>${esc(r.type)}</td><td><span class="st ${S[0] === "H" ? "H" : S[0] === "W" && S !== "Working Day" ? "W" : "K"}">${S}</span></td><td class="w">${esc(r.remarks)}</td>${adm ? `<td>${r.name ? `<button class="s" data-a="e" data-d="${r.date}">Edit</button> <button class="s g" data-a="r" data-d="${r.date}">Reschedule</button> <button class="s r" data-a="x" data-d="${r.date}">Delete</button>` : `<button class="s o" data-a="n" data-d="${r.date}">Add</button>`}</td>` : ""}</tr>` }).join("")}</tbody></table>${L.length > 400 ? `<div class="wn" style="margin-top:6px">First 400 shown — refine the filter.</div>` : ""}` : `<div class="box">No calendar in ${modeName()} mode yet. ${adm ? "Click <b>Upload Excel</b> to create it from the Calendar Master sheet." : "Ask an Admin to upload the Calendar Master."}</div>`;
      $q("#tb").querySelectorAll("button[data-a]").forEach(b => b.onclick = () => act(b.dataset.a, b.dataset.d));
    }
    function act(a, d) {
      const r = row(d), refresh = () => { draw() };
      if (a === "n") return form("Add Holiday", { date: d }, true, async v => { await commit(() => { Object.assign(row(d), { name: v.name, type: v.type, remarks: v.remarks }) }, "Holiday added"); refresh() });
      if (a === "e") return form("Edit Holiday", r, true, async v => { await commit(() => { Object.assign(row(d), { name: v.name, type: v.type, remarks: v.remarks }) }, "Holiday updated"); refresh() });
      if (a === "x") { const c = modal(`<div class="pcm-h"><b>Delete holiday?</b></div><div class="pcm-b">${d} — <b>${esc(r.name)}</b><br><small>The date stays in the calendar as ${r.off ? "Weekly Off" : "a Working Day"}.</small></div><div class="pcm-f"><button class="g" id="n">Cancel</button><button class="r" id="y">Delete</button></div>`, true);
        c.querySelector("#n").onclick = c.close; c.querySelector("#y").onclick = async () => { try { await commit(() => { Object.assign(row(d), { name: "", type: "", remarks: "" }) }, "Holiday deleted"); c.close(); refresh() } catch (e) { toast(e.message) } }; return }
      if (a === "r") { const c = modal(`<div class="pcm-h"><b>Reschedule holiday</b></div><div class="pcm-b fl"><b>${esc(r.name)}</b> (${d})<label>New date</label><input type="date" id="nd" value="${d}"><div id="e" class="er" style="margin-top:8px"></div></div><div class="pcm-f"><button class="g" id="n">Cancel</button><button id="y">Move</button></div>`, true);
        c.querySelector("#n").onclick = c.close; c.querySelector("#y").onclick = async () => { const nd = c.querySelector("#nd").value, t = row(nd);
          if (!t) return c.querySelector("#e").textContent = "Target date is not in the loaded calendar";
          if (nd === d) return c.close(); if (t.name) return c.querySelector("#e").textContent = "Target date already has a holiday (" + t.name + ")";
          try { await commit(() => { const o = row(d), n = row(nd); Object.assign(n, { name: o.name, type: o.type, remarks: o.remarks }); Object.assign(o, { name: "", type: "", remarks: "" }) }, "Holiday rescheduled"); c.close(); refresh() } catch (e) { c.querySelector("#e").textContent = e.message } }; }
    }
    ["#y", "#m", "#t", "#s"].forEach(s => $q(s).onchange = draw); $q("#q").oninput = draw;
    $q("#x").onclick = bd.close; $q("#dl").onclick = () => D.cal.length || D.mnt.length || D.chg.length ? download() : toast("Nothing to download in " + modeName() + " mode");
    if (adm) {
      $q("#add").onclick = () => D.cal.length ? form("Add Holiday", {}, false, async v => { const r = row(v.date); if (!r) throw new Error("Date is outside the loaded calendar"); if (r.name) throw new Error("This date already has a holiday — use Edit"); await commit(() => { Object.assign(row(v.date), { name: v.name, type: v.type, remarks: v.remarks }) }, "Holiday added"); draw() }) : toast("Upload Calendar Master first");
      $q("#up").onclick = () => $q("#fi").click();
      $q("#fi").onchange = async e => { const f = e.target.files[0]; e.target.value = ""; if (f) await upload(f, () => { bd.close(); openSetup() }) };
    }
    draw();
  }

  async function upload(file, done) {
    try {
      const wb = X.read(await file.arrayBuffer(), { type: "array" }), { E, W, out } = parseWorkbook(wb);
      const tbl = (L, c) => `<table><thead><tr><th>Sheet</th><th>Row</th><th>Message</th></tr></thead><tbody>${L.slice(0, 200).map(x => `<tr><td>${esc(x.s)}</td><td>${x.r}</td><td class="w ${c}">${esc(x.m)}</td></tr>`).join("")}</tbody></table>${L.length > 200 ? `<div class="wn">+${L.length - 200} more</div>` : ""}`;
      if (E.length) { const m = modal(`<div class="pcm-h"><b>Upload rejected — ${E.length} error(s)</b>${badge()}</div><div class="pcm-b">${tbl(E, "er")}${W.length ? "<h4>Warnings</h4>" + tbl(W, "wn") : ""}<div class="box">Nothing was changed. Fix the Excel file and upload again.</div></div><div class="pcm-f"><button id="c">Close</button></div>`); m.querySelector("#c").onclick = m.close; return }
      const old = new Map(D.cal.map(r => [r.date, r])), nw = new Map(out.cal.map(r => [r.date, r]));
      let add = 0, chg = 0, del = 0;
      nw.forEach((r, k) => { const o = old.get(k); if (r.name && !(o && o.name)) add++; else if (o && o.name && r.name && (o.name !== r.name || o.type !== r.type)) chg++ });
      old.forEach((o, k) => { if (o.name && !(nw.get(k) && nw.get(k).name)) del++ });
      const m = modal(`<div class="pcm-h"><b>Confirm upload</b>${badge()}</div><div class="pcm-b">
        <div class="box">File: <b>${esc(file.name)}</b><br>Calendar Master: <b>${out.cal.length}</b> days · <b>${out.cal.filter(r => r.name).length}</b> holidays<br>Maintenance: <b>${out.mnt.length}</b> rows · Changeover: <b>${out.chg.length}</b> rows</div>
        <div class="box wn"><b>This will replace the existing ${modeName()} mode data</b> (Calendar Master ${D.cal.length} days, Maintenance ${D.mnt.length}, Changeover ${D.chg.length}).<br>Holidays vs current: +${add} new · ${chg} changed · −${del} removed.<br>${modeName() === "AUDIT" ? "Office mode data is not affected." : "Audit mode data is not affected."}</div>
        ${W.length ? "<h4>Warnings</h4>" + tbl(W, "wn") : ""}</div><div class="pcm-f"><button class="g" id="n">Cancel</button><button class="o" id="y">Replace &amp; Upload</button></div>`);
      m.querySelector("#n").onclick = m.close;
      m.querySelector("#y").onclick = async () => {
        const b = m.querySelector("#y"); b.disabled = true; b.textContent = "Uploading…";
        const keep = D; D = { ...D, cal: out.cal, mnt: out.mnt, chg: out.chg };
        try { await save(["cal", "mnt", "chg"], file.name); rebuild(); onChange(); m.close(); toast("Calendar updated"); done && done() }
        catch (e) { D = keep; b.disabled = false; b.textContent = "Replace & Upload"; toast(e.message || e) }
      };
    } catch (e) { console.error(e); toast("Could not read Excel: " + (e.message || e)) }
  }

  async function init(o) {
    PS = o.PS; ME = o.ME; DAYS = o.DAYS; onChange = o.onChange || onChange;
    if (!window.XLSX) await new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"; s.onload = res; s.onerror = rej; document.head.appendChild(s) });
    X = window.XLSX;
    await ERP.modeReady(); LOADED_MODE = ERP.mode;
    await loadAll(); onChange();
    /* stale-tab guard: if admin switched mode elsewhere, reload so NO old-mode data stays on screen */
    document.addEventListener("visibilitychange", async () => { if (document.hidden) return; try { if ((await freshMode()) !== LOADED_MODE) { try { sessionStorage.removeItem("erp:mode") } catch (x) { } location.reload() } } catch (e) { } });
  }
  window.PlanCal = { init, openSetup, badge, download };
})();
