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
    for (;;) {
      const to = limit ? Math.min(from + step, limit) - 1 : from + step - 1;
      const { data, error: e2, count } = await sb.from("dataset_rows").select("id,data", from ? {} : { count: "exact" })
        .eq("node_id", id).order("id").range(from, to);
      if (e2) throw e2; if (count != null) total = count; rows.push(...data);
      if (data.length < to - from + 1 || (limit && rows.length >= limit)) break; from += step;
    }
    return { cols: ds.cols, rows, total: total ?? rows.length };
  }
};
