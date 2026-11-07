/* Admin panel: login with Supabase Auth, edit content, save to Supabase. */
(function () {
  var Store = window.EnigmaStore;
  var client = Store.client;
  var cfg = window.ENIGMA_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var S = null, saved = null, section = "requests", dirty = false;

  /* ---------- path helpers ---------- */
  function get(p) { return p.split(".").reduce(function (a, k) { return a == null ? a : a[k]; }, S); }
  function set(p, v) { var ks = p.split("."), a = S; for (var i = 0; i < ks.length - 1; i++) a = a[ks[i]]; a[ks[ks.length - 1]] = v; }
  function markDirty(on) { dirty = on; $("saveBar").classList.toggle("show", on); }
  function toast(t) { var d = document.createElement("div"); d.className = "toast"; d.setAttribute("role", "status"); d.textContent = t; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 2600); }
  var tName = function (k) { return S.team[k].name || k; };

  /* ---------- field builders ---------- */
  function inp(label, path, o) {
    o = o || {};
    var v = get(path);
    return '<label class="f"><span>' + label + '</span><input data-path="' + path + '"' + (o.num ? ' data-type="number" type="number" step="any"' : ' type="' + (o.type || "text") + '"') + ' value="' + esc(v == null ? "" : v) + '"' + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : "") + '></label>';
  }
  function area(label, path, rows) { return '<label class="f"><span>' + label + '</span><textarea data-path="' + path + '" rows="' + (rows || 3) + '">' + esc(get(path)) + '</textarea></label>'; }
  function sel(label, path, opts) {
    var v = get(path);
    return '<label class="f"><span>' + label + '</span><select data-path="' + path + '">' + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(v) === String(o[0]) ? " selected" : "") + '>' + esc(o[1]) + '</option>'; }).join("") + '</select></label>';
  }
  function chk(label, path) { return '<label class="f chk"><input type="checkbox" data-path="' + path + '" data-type="bool"' + (get(path) ? " checked" : "") + '><span>' + label + '</span></label>'; }
  function artists(withX) { var o = [["a", tName("a")], ["b", tName("b")]]; if (withX) o.push(["x", tName("x")]); return o; }

  // A list editor: each row gets move/delete tools; "add" appends a template copy.
  function list(path, rowFn, tpl, addLabel) {
    var arr = get(path) || [];
    return '<div style="display:grid;gap:10px">' + arr.map(function (_, i) {
      return '<div class="row-item"><div class="row-head"><span>#' + (i + 1) + '</span><span class="tools">' +
        '<button type="button" data-act="up" data-path="' + path + '" data-i="' + i + '" aria-label="Naikkan">↑</button>' +
        '<button type="button" data-act="down" data-path="' + path + '" data-i="' + i + '" aria-label="Turunkan">↓</button>' +
        '<button type="button" class="del" data-act="del" data-path="' + path + '" data-i="' + i + '">Hapus</button></span></div>' +
        rowFn(path + "." + i, i) + '</div>';
    }).join("") + '<button type="button" class="add" data-act="add" data-path="' + path + '" data-tpl="' + tpl + '">+ ' + addLabel + '</button></div>';
  }
  var TPL = {
    tierAB: { name: "Tier baru", desc: "", a: 0, b: 0, daysA: "", daysB: "" },
    rig: { name: "Rig baru", desc: "", price: 0, days: "" },
    pkg: { name: "Paket baru", desc: "", daysA: "", daysB: "" },
    addon: { label: "Add-on baru", type: "flat", value: 0 },
    stage: { name: "TAHAP BARU", items: [] },
    qitem: { no: "#", what: "", artist: "a" },
    price: { label: "", price: "" },
    tog: { name: "", kind: "EXPR" },
    tos: { title: "", body: "" },
    faq: { q: "", a: "" },
    gal: { title: "", artist: "a", rig: false, img: "" }
  };

  /* ---------- sections ---------- */
  var SECTIONS = [
    ["requests", "Request masuk"], ["kontak", "Kontak & link"], ["status", "Status & hero"], ["tim", "Tim"], ["harga", "Harga"], ["addons", "Add-on"],
    ["antrean", "Antrean"], ["toggles", "Toggles"], ["tos", "ToS"], ["faq", "FAQ"], ["galeri", "Galeri"], ["backup", "Backup"]
  ];

  var STATUS = [["new", "Baru"], ["replied", "Sudah dibalas"], ["accepted", "Diterima"], ["declined", "Ditolak"]];
  var R = {
    requests: function () {
      return '<h2>Request masuk</h2><p class="hint">Kiriman dari form Request di halaman utama. Status dan hapus langsung tersimpan, tanpa tombol Simpan.</p>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap"><button type="button" class="add" data-rq-act="refresh">Muat ulang</button>' +
        '<label class="f" style="min-width:200px"><span>Tampilkan</span><select id="rqFilter"><option value="">Semua</option>' + STATUS.map(function (s) { return '<option value="' + s[0] + '"' + (rqFilter === s[0] ? " selected" : "") + '>' + s[1] + '</option>'; }).join("") + '</select></label></div>' +
        '<div id="rqList" style="display:grid;gap:12px"><p class="hint">Memuat…</p></div>';
    },
    kontak: function () {
      return '<h2>Kontak & link</h2><p class="hint">Ikon di bagian Contact Us dan link di footer hanya muncul kalau link-nya diisi. Link harus diawali https://</p>' +
        '<div class="box"><h3>Discord</h3><div class="grid2">' + inp("Nama / handle", "contact.discordHandle", { ph: "enigmastudio" }) + inp("Link (invite atau profil)", "contact.discordUrl", { type: "url", ph: "https://discord.gg/..." }) + '</div></div>' +
        '<div class="box"><h3>X / Twitter</h3><div class="grid2">' + inp("Handle", "contact.twitterHandle", { ph: "@enigmastudio" }) + inp("Link profil", "contact.twitterUrl", { type: "url", ph: "https://x.com/..." }) + '</div></div>' +
        '<div class="box"><h3>Email</h3>' + inp("Alamat email", "contact.email", { type: "email" }) + '</div>' +
        '<div class="box"><h3>Link lain</h3><div class="grid2">' + inp("Trello board (tombol Open Trello board)", "links.trelloUrl", { type: "url", ph: "https://trello.com/b/..." }) + inp("ToS lengkap (opsional)", "links.tosUrl", { type: "url", ph: "https://..." }) + '</div></div>';
    },
    status: function () {
      return '<h2>Status & hero</h2><div class="box">' + chk("Commission sedang dibuka", "status.open") +
        '<div class="grid2">' + inp("Teks saat buka", "status.openText") + inp("Teks saat tutup", "status.closedText") + '</div>' + area("Tagline di bawah judul", "status.tagline", 2) + '</div>';
    },
    tim: function () {
      return '<h2>Tim</h2><p class="hint">Nama anggota otomatis dipakai di price builder, galeri, antrean, dan form.</p>' + ["a", "b", "x"].map(function (k) {
        var p = "team." + k;
        return '<div class="box"><h3>' + (k === "x" ? "Rigger" : "Illustrator " + k.toUpperCase()) + '</h3><div class="grid2">' + inp("Nama", p + ".name") + inp("Peran", p + ".role") + inp("Status slot", p + ".slots", { ph: "2 of 3 open" }) +
          (k === "x" ? "" : inp("Gaya singkat (price builder)", p + ".style")) + '</div>' + area("Bio", p + ".bio", 3) + inp("Tag (pisahkan dengan koma)", p + ".tags") + '</div>';
      }).join("");
    },
    harga: function () {
      var A = tName("a"), B = tName("b");
      var tierAB = function (p) { return '<div class="grid2">' + inp("Nama", p + ".name") + inp("Harga " + A, p + ".a", { num: true }) + inp("Harga " + B, p + ".b", { num: true }) + inp("Durasi " + A, p + ".daysA") + inp("Durasi " + B, p + ".daysB") + '</div>' + area("Deskripsi", p + ".desc", 2); };
      return '<h2>Harga</h2><p class="hint">Harga paket Live2D dihitung otomatis: (model art + rig dengan urutan yang sama) dikurangi diskon bundle.</p>' +
        '<div class="box"><h3>Umum</h3><div class="grid2">' + inp("Simbol mata uang", "prices.currency") + inp("Diskon bundle paket (%)", "prices.bundleDiscount", { num: true }) + '</div></div>' +
        '<div class="box"><h3>Ilustrasi</h3>' + list("prices.ill", tierAB, "tierAB", "Tambah tier ilustrasi") + '</div>' +
        '<div class="box"><h3>Model art (Live2D)</h3>' + list("prices.model", tierAB, "tierAB", "Tambah tier model art") + '</div>' +
        '<div class="box"><h3>Rig only (' + esc(tName("x")) + ')</h3>' + list("prices.rig", function (p) { return '<div class="grid2">' + inp("Nama", p + ".name") + inp("Harga", p + ".price", { num: true }) + inp("Durasi", p + ".days") + '</div>' + area("Deskripsi", p + ".desc", 2); }, "rig", "Tambah tier rig") + '</div>' +
        '<div class="box"><h3>Paket Live2D</h3><p class="hint">Paket ke-1 = model art ke-1 + rig ke-1, dan seterusnya.</p>' + list("prices.pkg", function (p) { return '<div class="grid2">' + inp("Nama", p + ".name") + inp("Durasi " + A, p + ".daysA") + inp("Durasi " + B, p + ".daysB") + '</div>' + area("Deskripsi", p + ".desc", 2); }, "pkg", "Tambah paket") + '</div>';
    },
    addons: function () {
      var row = function (p) { return '<div class="grid2">' + inp("Nama", p + ".label") + sel("Jenis", p + ".type", [["flat", "Harga tetap"], ["pct", "Persen dari tier"]]) + inp("Nilai", p + ".value", { num: true }) + '</div>'; };
      return '<h2>Add-on</h2>' + [["ill", "Ilustrasi"], ["pkg", "Live2D full package"], ["model", "Model art only"], ["rig", "Rig only"]].map(function (s) {
        return '<div class="box"><h3>' + s[1] + '</h3>' + list("addons." + s[0], row, "addon", "Tambah add-on") + '</div>';
      }).join("");
    },
    antrean: function () {
      var stages = S.queue || [];
      var stageOpts = stages.map(function (st, i) { return [String(i), st.name || "Tahap " + (i + 1)]; });
      return '<h2>Antrean · Where\'s my file?</h2><p class="hint">Pengunjung bisa mencari nomor order di halaman. Pindahkan order ke tahap lain lewat pilihan "Pindah ke".</p>' +
        list("queue", function (p, si) {
          var items = stages[si].items || [];
          return inp("Nama tahap", p + ".name") + '<div class="stage-items">' + items.map(function (_, ii) {
            var ip = p + ".items." + ii;
            return '<div class="row-item" style="background:var(--card)"><div class="row-head"><span>Order ' + (ii + 1) + '</span><span class="tools"><button type="button" class="del" data-act="del" data-path="' + p + '.items" data-i="' + ii + '">Hapus</button></span></div><div class="grid2">' +
              inp("Nomor order", ip + ".no") + inp("Pesanan", ip + ".what") + sel("Dikerjakan", ip + ".artist", artists(true)) +
              '<label class="f"><span>Pindah ke</span><select data-move="' + si + "." + ii + '">' + stageOpts.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === String(si) ? " selected" : "") + '>' + esc(o[1]) + '</option>'; }).join("") + '</select></label></div></div>';
          }).join("") + '<button type="button" class="add" data-act="add" data-path="' + p + '.items" data-tpl="qitem">+ Tambah order</button></div>';
        }, "stage", "Tambah tahap");
    },
    toggles: function () {
      return '<h2>Toggles</h2><div class="box">' + area("Paragraf pengantar", "toggles.intro", 3) + '</div>' +
        '<div class="box"><h3>Daftar harga</h3>' + list("toggles.pricing", function (p) { return '<div class="grid2">' + inp("Nama", p + ".label") + inp("Harga (teks)", p + ".price", { ph: "$15 each" }) + '</div>'; }, "price", "Tambah baris harga") + '</div>' +
        '<div class="box"><h3>Saran toggle & ekspresi</h3>' + list("toggles.items", function (p) { return '<div class="grid2">' + inp("Nama", p + ".name") + sel("Jenis", p + ".kind", [["EXPR", "Ekspresi"], ["TOGGLE", "Toggle"], ["PROP", "Prop"]]) + '</div>'; }, "tog", "Tambah item") + '</div>';
    },
    tos: function () {
      return '<h2>Terms of Service</h2><p class="hint">Isi kartu ToS di halaman. Tekan Enter di kolom isi untuk membuat baris baru.</p>' +
        list("tos", function (p) { return inp("Judul", p + ".title") + area("Isi", p + ".body", 4); }, "tos", "Tambah poin ToS") +
        '<div class="box">' + inp("Link ToS lengkap (opsional)", "links.tosUrl", { type: "url", ph: "https://..." }) + '</div>';
    },
    faq: function () { return '<h2>FAQ</h2>' + list("faq", function (p) { return inp("Pertanyaan", p + ".q") + area("Jawaban", p + ".a", 3); }, "faq", "Tambah pertanyaan"); },
    galeri: function () {
      var row = function (p) { return '<div class="grid2">' + inp("Judul", p + ".title") + sel("Artist", p + ".artist", artists(true)) + inp("Link gambar (opsional)", p + ".img", { type: "url", ph: "https://..." }) + '</div>' + chk("Di-rig oleh " + esc(tName("x")), p + ".rig"); };
      return '<h2>Galeri</h2><p class="hint">Link gambar bisa dari layanan hosting gambar mana pun (misalnya Imgur atau Supabase Storage). Kosongkan untuk kotak placeholder.</p>' +
        '<div class="box"><h3>Tab Vtuber</h3>' + list("gallery.v", row, "gal", "Tambah karya") + '</div><div class="box"><h3>Tab Illustrations</h3>' + list("gallery.i", row, "gal", "Tambah karya") + '</div>';
    },
    backup: function () {
      return '<h2>Backup</h2><div class="box"><h3>Unduh salinan</h3><p class="hint">Simpan file JSON ini sebelum perubahan besar.</p><button type="button" class="add" data-act="export">Unduh backup (.json)</button></div>' +
        '<div class="box"><h3>Pulihkan dari file</h3><label class="f"><span>Pilih file backup .json</span><input type="file" accept="application/json,.json" id="importFile"></label></div>' +
        '<div class="box"><h3>Kembali ke isi awal</h3><p class="hint">Mengganti semua isi dengan contoh bawaan. Belum terbit sampai kamu menekan Simpan.</p><button type="button" class="add" data-act="reset" style="color:var(--red)">Pakai isi awal</button></div>';
    }
  };

  function renderNav() {
    $("sideNav").innerHTML = SECTIONS.map(function (s) { return '<button type="button" data-sec="' + s[0] + '" aria-current="' + (s[0] === section) + '">' + s[1] + '</button>'; }).join("");
  }
  function render() { renderNav(); $("panel").innerHTML = R[section](); if (section === "requests") loadRequests(); }

  /* ---------- requests inbox ---------- */
  var rqFilter = "", rqCache = [];
  function fmtDate(s) { try { return new Date(s).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }); } catch (e) { return s || ""; } }
  function drawRequests() {
    var box = $("rqList"); if (!box) return;
    var rows = rqCache.filter(function (r) { return !rqFilter || r.status === rqFilter; });
    if (!rows.length) { box.innerHTML = '<p class="hint">' + (rqCache.length ? "Tidak ada request dengan status ini." : "Belum ada request masuk.") + '</p>'; return; }
    box.innerHTML = rows.map(function (r) {
      var art = r.artist === "match" ? "Match me" : (S.team[r.artist] ? S.team[r.artist].name : (r.artist || "-"));
      var refs = /^https?:\/\//i.test(r.references || "") ? '<a href="' + esc(r.references) + '" target="_blank" rel="noopener" style="color:var(--accent-text);word-break:break-all">' + esc(r.references) + '</a>' : '<span style="color:var(--muted2)">-</span>';
      return '<div class="box"><h3><span>' + esc(r.name) + '</span><span class="mono" style="font-weight:400;font-size:12px;letter-spacing:0;color:var(--muted2)">' + esc(fmtDate(r.created_at)) + '</span></h3>' +
        '<div class="grid2" style="font-size:14px;line-height:1.5">' +
        '<div><span style="color:var(--muted)">Kontak</span><br><b style="word-break:break-all">' + esc(r.contact) + '</b></div>' +
        '<div><span style="color:var(--muted)">Artist</span><br><b>' + esc(art) + '</b></div>' +
        '<div style="grid-column:1/-1"><span style="color:var(--muted)">Estimasi</span><br>' + esc(r.estimate || "-") + '</div>' +
        '<div style="grid-column:1/-1"><span style="color:var(--muted)">Referensi</span><br>' + refs + '</div>' +
        (r.notes ? '<div style="grid-column:1/-1"><span style="color:var(--muted)">Catatan</span><br><span style="white-space:pre-line">' + esc(r.notes) + '</span></div>' : "") +
        '</div><div style="display:flex;flex-wrap:wrap;gap:10px;align-items:end">' +
        '<label class="f" style="min-width:200px"><span>Status</span><select data-rq-status="' + esc(r.id) + '">' + STATUS.map(function (s) { return '<option value="' + s[0] + '"' + (r.status === s[0] ? " selected" : "") + '>' + s[1] + '</option>'; }).join("") + '</select></label>' +
        '<span class="tools"><button type="button" class="del" data-rq-act="del" data-id="' + esc(r.id) + '">Hapus</button></span></div></div>';
    }).join("");
  }
  async function loadRequests() {
    try { rqCache = await Store.listRequests(); drawRequests(); }
    catch (e) { var b = $("rqList"); if (b) b.innerHTML = '<p class="msg err">Gagal memuat: ' + esc(e.message || e) + '</p>'; }
  }
  $("panel").addEventListener("change", async function (e) {
    var el = e.target;
    if (el.id === "rqFilter") { rqFilter = el.value; drawRequests(); return; }
    if (el.dataset.rqStatus) {
      try { await Store.updateRequest(el.dataset.rqStatus, { status: el.value }); rqCache.forEach(function (r) { if (String(r.id) === el.dataset.rqStatus) r.status = el.value; }); toast("Status diperbarui."); }
      catch (err) { toast("Gagal: " + (err.message || err)); }
    }
  });
  $("panel").addEventListener("click", async function (e) {
    var b = e.target.closest("[data-rq-act]"); if (!b) return;
    if (b.dataset.rqAct === "refresh") { loadRequests(); return; }
    if (b.dataset.rqAct === "del") {
      if (!window.confirm("Hapus request ini?")) return;
      try { await Store.deleteRequest(b.dataset.id); rqCache = rqCache.filter(function (r) { return String(r.id) !== b.dataset.id; }); drawRequests(); toast("Request dihapus."); }
      catch (err) { toast("Gagal: " + (err.message || err)); }
    }
  });

  /* ---------- events ---------- */
  $("sideNav").addEventListener("click", function (e) { var b = e.target.closest("[data-sec]"); if (!b) return; section = b.dataset.sec; render(); window.scrollTo(0, 0); });

  $("panel").addEventListener("input", function (e) {
    var el = e.target, p = el.dataset.path;
    if (!p) return;
    var v = el.dataset.type === "number" ? (el.value === "" ? 0 : Number(el.value)) : el.dataset.type === "bool" ? el.checked : el.value;
    set(p, v); markDirty(true);
  });
  $("panel").addEventListener("change", function (e) {
    var el = e.target;
    if (el.dataset.type === "bool") { set(el.dataset.path, el.checked); markDirty(true); }
    if (el.tagName === "SELECT" && el.dataset.path) { set(el.dataset.path, el.value); markDirty(true); if (/^team\./.test(el.dataset.path)) render(); }
    if (el.dataset.move) {
      var parts = el.dataset.move.split("."), from = +parts[0], idx = +parts[1], to = +el.value;
      var item = S.queue[from].items.splice(idx, 1)[0];
      S.queue[to].items.push(item); markDirty(true); render();
    }
    if (el.id === "importFile" && el.files && el.files[0]) {
      var r = new FileReader();
      r.onload = function () {
        try { S = Store.merge(JSON.parse(r.result)); markDirty(true); render(); toast("Backup dimuat. Tekan Simpan untuk menerbitkan."); }
        catch (err) { toast("File tidak bisa dibaca: " + err.message); }
      };
      r.readAsText(el.files[0]);
    }
  });
  $("panel").addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var act = b.dataset.act, p = b.dataset.path, i = +b.dataset.i, arr = p ? get(p) : null;
    if (act === "add") { arr.push(JSON.parse(JSON.stringify(TPL[b.dataset.tpl]))); }
    else if (act === "del") { arr.splice(i, 1); }
    else if (act === "up" && i > 0) { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); }
    else if (act === "down" && i < arr.length - 1) { arr.splice(i + 1, 0, arr.splice(i, 1)[0]); }
    else if (act === "export") {
      var blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = "enigma-content-" + new Date().toISOString().slice(0, 10) + ".json"; a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      return;
    }
    else if (act === "reset") { if (!window.confirm("Ganti semua isi dengan contoh bawaan?")) return; S = Store.defaults(); }
    else return;
    markDirty(true); render();
  });

  $("saveBtn").addEventListener("click", async function () {
    var btn = this; btn.disabled = true; $("saveMsg").textContent = "Menyimpan…";
    try {
      var where = await Store.save(S);
      saved = JSON.parse(JSON.stringify(S)); markDirty(false);
      toast(where === "supabase" ? "Tersimpan. Situs sudah memakai isi terbaru." : "Tersimpan di browser ini (mode demo).");
    } catch (err) {
      $("saveMsg").textContent = "Gagal menyimpan: " + (err.message || err) + ". Pastikan email kamu terdaftar di tabel admins.";
    }
    btn.disabled = false;
  });
  $("discardBtn").addEventListener("click", function () { S = JSON.parse(JSON.stringify(saved)); markDirty(false); render(); $("saveMsg").textContent = "Ada perubahan yang belum disimpan."; });
  window.addEventListener("beforeunload", function (e) { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

  /* ---------- auth ---------- */
  async function openApp(email) {
    $("loginView").classList.add("hidden");
    $("appView").classList.remove("hidden");
    $("whoami").textContent = email || "";
    $("logoutBtn").classList.toggle("hidden", !client);
    S = await Store.load();
    saved = JSON.parse(JSON.stringify(S));
    render();
  }
  function showLogin(msg) {
    $("appView").classList.add("hidden"); $("loginView").classList.remove("hidden");
    $("loginErr").textContent = msg || ""; $("loginErr").classList.toggle("hidden", !msg);
  }
  async function checkAdmin(user) {
    var res = await client.from("admins").select("email").eq("email", user.email).maybeSingle();
    return !res.error && !!res.data;
  }

  $("modeBadge").textContent = client ? "LIVE · Supabase" : "MODE DEMO";
  $("modeBadge").className = "mode " + (client ? "live" : "demo");

  if (!client) {
    $("demoInfo").classList.remove("hidden");
    $("demoBtn").classList.remove("hidden");
    $("loginBtn").classList.add("hidden");
    document.querySelectorAll("#loginForm .f").forEach(function (f) { f.classList.add("hidden"); });
    if (cfg.supabaseUrl && !window.supabase) showLogin("Supabase sudah diisi di config.js, tapi pustakanya gagal dimuat. Periksa koneksi internet lalu muat ulang halaman.");
    $("demoBtn").addEventListener("click", function () { openApp("demo"); });
  } else {
    client.auth.getSession().then(async function (r) {
      var u = r.data && r.data.session && r.data.session.user;
      if (u && await checkAdmin(u)) openApp(u.email);
    });
    $("loginForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      var email = $("loginEmail").value.trim(), pass = $("loginPass").value;
      if (!email || !pass) { showLogin("Isi email dan password."); return; }
      $("loginBtn").disabled = true; $("loginBtn").textContent = "Memeriksa…";
      var res = await client.auth.signInWithPassword({ email: email, password: pass });
      $("loginBtn").disabled = false; $("loginBtn").textContent = "Masuk";
      if (res.error) { showLogin("Email atau password salah."); return; }
      if (!(await checkAdmin(res.data.user))) { await client.auth.signOut(); showLogin("Akun ini belum terdaftar sebagai admin. Tambahkan emailnya ke tabel admins di Supabase."); return; }
      openApp(res.data.user.email);
    });
    $("logoutBtn").addEventListener("click", async function () {
      if (dirty && !window.confirm("Ada perubahan yang belum disimpan. Tetap keluar?")) return;
      await client.auth.signOut(); markDirty(false); showLogin("");
    });
  }
})();
