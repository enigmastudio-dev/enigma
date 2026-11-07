/* Loads and saves site content.
   With Supabase configured: one row (id = 'main') in table site_content.
   Without it: demo mode, stored in this browser's localStorage. */
(function () {
  var cfg = window.ENIGMA_CONFIG || {};
  var DEF = window.ENIGMA_DEFAULT;
  var LS_KEY = "enigma-content-demo";
  var client = null;
  if (cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase && window.supabase.createClient) {
    client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function isObj(v) { return v && typeof v === "object" && !Array.isArray(v); }
  // Saved data wins; keys that only exist in the defaults are filled in,
  // so new fields added to the site later still get a value.
  function merge(def, data) {
    if (Array.isArray(def)) return Array.isArray(data) ? clone(data) : clone(def);
    if (!isObj(def)) return data === undefined ? def : data;
    var out = {};
    Object.keys(def).forEach(function (k) { out[k] = merge(def[k], isObj(data) ? data[k] : undefined); });
    if (isObj(data)) Object.keys(data).forEach(function (k) { if (!(k in out)) out[k] = clone(data[k]); });
    return out;
  }

  async function load() {
    if (client) {
      var res = await client.from("site_content").select("data, updated_at").eq("id", "main").maybeSingle();
      if (res.error) { console.warn("Supabase load failed, showing defaults:", res.error.message); return clone(DEF); }
      return res.data && res.data.data ? merge(DEF, res.data.data) : clone(DEF);
    }
    try {
      var s = localStorage.getItem(LS_KEY);
      if (s) return merge(DEF, JSON.parse(s));
    } catch (e) {}
    return clone(DEF);
  }

  async function save(content) {
    if (client) {
      var res = await client.from("site_content").upsert({ id: "main", data: content, updated_at: new Date().toISOString() });
      if (res.error) throw res.error;
      return "supabase";
    }
    localStorage.setItem(LS_KEY, JSON.stringify(content));
    return "demo";
  }

  /* ---------- commission requests (from the public form) ---------- */
  var RQ_KEY = "enigma-requests-demo";
  function demoRequests() { try { return JSON.parse(localStorage.getItem(RQ_KEY) || "[]"); } catch (e) { return []; } }
  function demoWrite(list) { localStorage.setItem(RQ_KEY, JSON.stringify(list)); }

  async function submitRequest(r) {
    if (client) {
      var res = await client.from("requests").insert(r);   // no .select(): visitors may insert but not read
      if (res.error) throw res.error;
      return;
    }
    var list = demoRequests();
    list.unshift(Object.assign({ id: String(Date.now()), created_at: new Date().toISOString(), status: "new" }, r));
    demoWrite(list);
  }
  async function listRequests() {
    if (client) {
      var res = await client.from("requests").select("*").order("created_at", { ascending: false }).limit(200);
      if (res.error) throw res.error;
      return res.data || [];
    }
    return demoRequests();
  }
  async function updateRequest(id, patch) {
    if (client) { var res = await client.from("requests").update(patch).eq("id", id); if (res.error) throw res.error; return; }
    demoWrite(demoRequests().map(function (r) { return String(r.id) === String(id) ? Object.assign(r, patch) : r; }));
  }
  async function deleteRequest(id) {
    if (client) { var res = await client.from("requests").delete().eq("id", id); if (res.error) throw res.error; return; }
    demoWrite(demoRequests().filter(function (r) { return String(r.id) !== String(id); }));
  }

  window.EnigmaStore = {
    client: client,
    mode: client ? "supabase" : "demo",
    load: load,
    save: save,
    submitRequest: submitRequest,
    listRequests: listRequests,
    updateRequest: updateRequest,
    deleteRequest: deleteRequest,
    defaults: function () { return clone(DEF); },
    merge: function (data) { return merge(DEF, data); }
  };
})();
