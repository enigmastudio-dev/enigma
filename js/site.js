/* Public page: renders everything from the saved content. */
(function () {
  var C = null;                       // current content
  var st = { gal: "v", svc: "ill", art: "a", tier: 1, add: {}, faq: 0 };
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var safeUrl = function (u) { u = String(u || "").trim(); return /^(https?:|mailto:)/i.test(u) ? u : ""; };
  var COLOR = { a: "var(--c-a)", b: "var(--c-b)", x: "var(--c-x)" };
  var title = function (s) { s = String(s || ""); return s.charAt(0) + s.slice(1).toLowerCase(); };
  var money = function (n) { return (C.prices.currency || "$") + Number(n || 0).toLocaleString("en-US"); };
  var tags = function (s) { return String(s || "").split(",").map(function (t) { return t.trim(); }).filter(Boolean); };
  var nameOf = function (k) { return (C.team[k] && C.team[k].name) || k; };

  /* ---------- theme ---------- */
  var SUN = '<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
  var MOON = '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>';
  function paintThemeBtn() {
    var light = document.documentElement.getAttribute("data-theme") === "light";
    $("themeBtn").innerHTML = light ? MOON : SUN;
    $("themeBtn").setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  }
  $("themeBtn").addEventListener("click", function () {
    var light = document.documentElement.getAttribute("data-theme") === "light";
    var next = light ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("enigma-theme", next); } catch (e) {}
    paintThemeBtn();
  });

  /* ---------- static-ish sections ---------- */
  function renderStatus() {
    var s = C.status;
    $("statusText").textContent = s.open ? s.openText : s.closedText;
    $("statusPill").classList.toggle("closed", !s.open);
    $("tagline").textContent = s.tagline;
  }

  function renderTeam() {
    var files = { a: "◇ FILE A · ILLUSTRATOR", b: "◇ FILE B · ILLUSTRATOR", x: "◇ FILE C · LIVE2D RIGGER" };
    $("teamGrid").innerHTML = ["a", "b", "x"].map(function (k) {
      var m = C.team[k], n = String(m.name || "");
      return '<article class="member"><div class="member-art" style="background:var(--tint-' + k + ')">' +
        '<div class="ph">' + (k === "x" ? "RIG DEMO CLIP" : esc(n) + " STYLE SAMPLE") + '</div>' +
        '<span class="file">' + files[k] + '</span><span class="slots">' + esc(m.slots) + '</span></div>' +
        '<div class="member-body"><div style="display:grid;gap:4px"><span class="member-name"><span style="color:' + COLOR[k] + '">' + esc(n.charAt(0)) + '</span>' + esc(n.slice(1)) + '</span>' +
        '<span class="member-role">' + esc(m.role) + '</span></div>' +
        '<p class="member-bio">' + esc(m.bio) + '</p>' +
        '<div class="tags">' + tags(m.tags).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + '</div>' +
        '<a class="btn btn-solid" style="border-radius:12px" href="#price" data-pick="' + k + '">' + (k === "x" ? "Price a rig with " : "Price a piece by ") + esc(title(n)) + '</a></div></article>';
    }).join("");
  }

  function renderGallery() {
    document.querySelectorAll("[data-gal]").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.gal === st.gal)); });
    $("galGrid").innerHTML = (C.gallery[st.gal] || []).map(function (g, i) {
      var by = nameOf(g.artist) + (g.rig && g.artist !== "x" ? " × " + nameOf("x") : "");
      var img = safeUrl(g.img);
      return '<figure><div class="gal-box" style="background:var(--tint-' + esc(g.artist) + ')">' +
        (img ? '<img src="' + esc(img) + '" alt="' + esc(g.title) + '" loading="lazy">' : "ARTWORK " + String(i + 1).padStart(2, "0")) +
        '</div><figcaption><b>' + esc(g.title) + '</b><span><i class="dot" style="background:' + COLOR[g.artist] + '"></i>' + esc(by) + '</span></figcaption></figure>';
    }).join("");
  }

  function renderQueue() {
    var q = ($("findNo").value || "").trim().replace(/^#/, "").toLowerCase();
    var found = null;
    $("board").innerHTML = (C.queue || []).map(function (col) {
      var items = col.items || [];
      return '<div class="col"><h3>' + esc(col.name) + '<span>' + items.length + '</span></h3>' + items.map(function (it) {
        var hit = q && String(it.no || "").replace(/^#/, "").toLowerCase() === q;
        if (hit) found = col.name;
        var who = it.artist === "x" ? nameOf("x") : nameOf(it.artist);
        return '<div class="card-q' + (hit ? " hit" : "") + '"><span class="no">' + esc(it.no) + '</span><b>' + esc(it.what) + '</b><span><i class="dot" style="background:' + (COLOR[it.artist] || "var(--nav)") + '"></i>' + esc(who) + '</span></div>';
      }).join("") + '</div>';
    }).join("");
    $("findMsg").textContent = q ? (found ? "Order #" + q + " is in " + found + "." : "No order #" + q + " found. Check the number or message us.") : "";
    var t = safeUrl(C.links.trelloUrl);
    $("trelloBtn").classList.toggle("hidden", !t);
    if (t) $("trelloBtn").href = t;
  }

  function renderToggles() {
    var T = C.toggles;
    $("togIntro").textContent = T.intro;
    $("togPrices").innerHTML = (T.pricing || []).map(function (p) { return "<div><span>" + esc(p.label) + "</span><strong>" + esc(p.price) + "</strong></div>"; }).join("");
    $("togGrid").innerHTML = (T.items || []).map(function (t, i) {
      var code = (t.kind === "EXPR" ? "EX-" : t.kind === "PROP" ? "PR-" : "TG-") + String(i + 1).padStart(2, "0");
      return '<div class="tog-card"><div class="th">' + code + '</div><div><b>' + esc(t.name) + '</b><small>' + esc(t.kind) + '</small></div></div>';
    }).join("");
  }

  function renderTos() {
    $("tosGrid").innerHTML = (C.tos || []).map(function (t) { return '<div class="tos-card"><h3>' + esc(t.title) + '</h3><p>' + esc(t.body) + '</p></div>'; }).join("");
    var u = safeUrl(C.links.tosUrl);
    $("tosLink").classList.toggle("hidden", !u);
    if (u) $("tosLink").href = u;
  }

  function renderFaq() {
    $("faqList").innerHTML = (C.faq || []).map(function (f, i) {
      var open = st.faq === i + 1;
      return '<div class="faq-item"><button type="button" aria-expanded="' + open + '" data-faq="' + (i + 1) + '">' + esc(f.q) + '<span aria-hidden="true">' + (open ? "−" : "+") + '</span></button>' + (open ? "<p>" + esc(f.a) + "</p>" : "") + '</div>';
    }).join("");
  }

  var ICON = {
    discord: '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7c3-1.5 7-1.5 10 0l2 9c-2 2-4 2.5-5 2.5l-1-2M7 7L5 16c2 2 4 2.5 5 2.5l1-2"/><circle cx="9.5" cy="12.5" r="1"/><circle cx="14.5" cy="12.5" r="1"/></svg>',
    twitter: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4l16 16M20 4L4 20"/></svg>',
    email: '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>'
  };
  function renderContact() {
    var c = C.contact, items = [];
    var d = safeUrl(c.discordUrl), t = safeUrl(c.twitterUrl), e = String(c.email || "").trim();
    if (d) items.push({ k: "discord", label: "Discord", href: d });
    if (t) items.push({ k: "twitter", label: "X / Twitter", href: t });
    if (e) items.push({ k: "email", label: "Email", href: "mailto:" + e });
    $("socials").innerHTML = items.map(function (i) { return '<a href="' + esc(i.href) + '" aria-label="' + i.label + '"' + (i.k === "email" ? "" : ' target="_blank" rel="noopener"') + '>' + ICON[i.k] + '</a>'; }).join("");
    var text = [c.discordHandle ? "Discord: " + c.discordHandle : "", c.twitterHandle ? "X: " + c.twitterHandle : "", e].filter(Boolean).join(" · ");
    $("contactText").textContent = text;
    $("footLinks").innerHTML = items.filter(function (i) { return i.k !== "email"; }).map(function (i) { return '<a href="' + esc(i.href) + '" target="_blank" rel="noopener">' + i.label + '</a>'; }).join("") + '<a href="#tos">TOS</a>';
    document.querySelectorAll("[data-name]").forEach(function (el) { el.textContent = nameOf(el.dataset.name); });
  }

  /* ---------- price builder ---------- */
  function tiersFor(svc) {
    var P = C.prices;
    if (svc === "ill" || svc === "model") return P[svc].map(function (t) { return { name: t.name, desc: t.desc, a: +t.a, b: +t.b, days: { a: t.daysA, b: t.daysB } }; });
    if (svc === "rig") return P.rig.map(function (t) { return { name: t.name, desc: t.desc, a: +t.price, b: +t.price, days: { a: t.days, b: t.days } }; });
    var disc = Math.max(0, Math.min(90, +P.bundleDiscount || 0)) / 100;
    return P.pkg.map(function (p, i) {
      var m = P.model[i] || P.model[P.model.length - 1], r = P.rig[i] || P.rig[P.rig.length - 1];
      if (!m || !r) return null;
      var fa = +m.a + +r.price, fb = +m.b + +r.price;
      return { name: p.name, desc: p.desc, a: Math.round(fa * (1 - disc) / 5) * 5, b: Math.round(fb * (1 - disc) / 5) * 5, full: { a: fa, b: fb }, days: { a: p.daysA, b: p.daysB } };
    }).filter(Boolean);
  }

  function renderBuilder() {
    var P = C.prices;
    var SV = [
      { id: "ill", name: "Illustration", desc: "Bust-up to full body, by " + title(nameOf("a")) + " or " + title(nameOf("b")) },
      { id: "pkg", name: "Live2D full package", desc: "Model art by your artist, rigged by " + title(nameOf("x")), badge: (+P.bundleDiscount ? "Save " + P.bundleDiscount + "%" : "") },
      { id: "model", name: "Model art only", desc: "Rig-ready layered art for your own rigger" },
      { id: "rig", name: "Rig only", desc: title(nameOf("x")) + " rigs the layered PSD you already have" }
    ];
    var isRig = st.svc === "rig", key = isRig ? "a" : st.art;
    var tiers = tiersFor(st.svc);
    if (!tiers.length) tiers = [{ name: "—", desc: "", a: 0, b: 0, days: { a: "", b: "" } }];
    var ti = Math.min(st.tier, tiers.length - 1), tier = tiers[ti], base = tier[key];

    $("svcOpts").innerHTML = SV.map(function (s) {
      var t = tiersFor(s.id), from = t.length ? Math.min.apply(null, t.map(function (x) { return Math.min(x.a, x.b); })) : 0;
      return '<button type="button" class="opt" data-svc="' + s.id + '" aria-pressed="' + (s.id === st.svc) + '"><span class="row"><span class="name">' + s.name + '</span><span class="radio"></span></span><span class="desc">' + esc(s.desc) + '</span><span class="row" style="justify-content:flex-start;margin-top:4px"><span class="mono" style="font-size:13px">from ' + money(from) + '</span>' + (s.badge ? '<span class="badge">' + esc(s.badge) + '</span>' : "") + '</span></button>';
    }).join("");

    $("step2Title").textContent = "02 · " + (isRig ? "RIGGER" : "ARTIST");
    var x = C.team.x;
    if (isRig) {
      $("step2").innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:18px;padding:18px;border-radius:0 0 24px 0;border:2px solid var(--c-x);background:var(--teal-bg)"><div style="flex:1 1 200px;display:grid;gap:6px;align-content:start"><span style="font-family:var(--f-hud);font-weight:600;font-size:11px;letter-spacing:.16em;color:var(--teal-text)">YOUR RIGGER</span><span class="member-name" style="font-size:34px">' + esc(x.name) + '</span><span style="font-size:14px;color:var(--muted)">' + esc(x.role) + ' · ' + esc(x.slots) + '</span></div><div style="flex:2 1 280px;display:grid;gap:8px;align-content:start"><b style="font-size:14px">Please send with your request</b><ul style="margin:0;padding-left:18px;display:grid;gap:4px;font-size:14px;line-height:1.5;color:var(--soft)"><li>Layered PSD, every moving part on its own layer</li><li>Canvas of at least 4000 px tall</li><li>Closed eyes, open mouth, and back hair drawn in full</li><li>Expression and toggle references, if you want them</li></ul></div></div>';
    } else {
      $("step2").innerHTML = '<div class="opt-grid">' + ["a", "b"].map(function (k) {
        var m = C.team[k];
        return '<button type="button" class="opt artist-opt" style="--sel:' + COLOR[k] + '" data-art="' + k + '" aria-pressed="' + (k === st.art) + '"><span class="swatch"></span><span class="in"><span class="row"><span class="an">' + esc(m.name) + '</span><span class="radio"></span></span><span class="desc">' + esc(m.style || m.role) + '</span><span style="font-size:12.5px;color:var(--green);font-weight:600">' + esc(m.slots) + '</span></span></button>';
      }).join("") + '</div>' + (st.svc === "pkg" ? '<div class="callout" style="margin-top:12px"><i class="dot" style="background:var(--c-x)"></i><span><strong>Rigged by ' + esc(title(x.name)) + '.</strong> Your artist designs the model with rigging in mind, then hands the PSD straight to ' + esc(title(x.name)) + '.</span></div>' : "");
    }

    $("tierOpts").innerHTML = tiers.map(function (t, i) {
      return '<button type="button" class="opt tier" data-tier="' + i + '" aria-pressed="' + (i === ti) + '"><span class="radio"></span><span class="tmain"><span class="name">' + esc(t.name) + '</span><span class="desc">' + esc(t.desc) + '</span></span><span class="tprice"><b>' + money(t[key]) + '</b><small>' + esc(t.days[key]) + '</small></span></button>';
    }).join("");

    var total = base, lines = [];
    var adds = (C.addons[st.svc] || []);
    $("addOpts").innerHTML = adds.map(function (a, i) {
      var on = !!st.add[i], cost = a.type === "pct" ? Math.round(base * (+a.value) / 100) : +a.value;
      if (on) { total += cost; lines.push({ label: a.label, price: "+" + money(cost) }); }
      return '<button type="button" class="chip" data-add="' + i + '" aria-pressed="' + on + '"><span class="box">' + (on ? "✓" : "") + '</span><span>' + esc(a.label) + '</span><span class="p">' + (a.type === "pct" ? "+" + a.value + "%" : "+" + money(a.value)) + '</span></button>';
    }).join("");

    var team = [];
    if (!isRig) team.push({ n: title(nameOf(key)), r: "Illustration", c: COLOR[key] });
    if (st.svc === "pkg" || isRig) team.push({ n: title(nameOf("x")), r: "Rigging", c: COLOR.x });
    $("sumTeam").innerHTML = team.map(function (m) { return '<span class="team-chip"><i class="dot" style="background:' + m.c + '"></i><strong>' + esc(m.n) + '</strong><span class="muted">' + m.r + '</span></span>'; }).join("");
    var svcName = SV.filter(function (s) { return s.id === st.svc; })[0].name;
    $("sumSvc").textContent = svcName;
    $("sumCode").textContent = { ill: "ILL", pkg: "L2D", model: "ART", rig: "RIG" }[st.svc] + "-" + (isRig ? "XY" : String(nameOf(key)).slice(0, 2).toUpperCase()) + "-0" + (ti + 1);
    var html = '<div class="line"><span>' + esc(tier.name) + (st.svc === "pkg" ? " (art + rig " + money(tier.full[key]) + ")" : "") + '</span><span class="mono">' + money(st.svc === "pkg" ? tier.full[key] : base) + '</span></div>';
    if (st.svc === "pkg") html += '<div class="line gold"><span>Bundle saving (' + esc(P.bundleDiscount) + '%)</span><span class="mono">−' + money(tier.full[key] - base) + '</span></div>';
    lines.forEach(function (l) { html += '<div class="line muted"><span>' + esc(l.label) + '</span><span class="mono">' + l.price + '</span></div>'; });
    html += '<div class="line muted"><span>Character File card</span><span class="mono gold">Free</span></div>';
    $("sumLines").innerHTML = html;
    $("sumTotal").textContent = money(total);
    $("sumDays").textContent = tier.days[key] || "";
    $("sumPay").textContent = total < 100 ? "Paid in full upfront" : st.svc === "ill" ? "50% now · 50% before files" : "3 payments of ~" + money(Math.ceil(total / 3));
    var who = isRig ? title(nameOf("x")) : title(nameOf(key)) + (st.svc === "pkg" ? " × " + title(nameOf("x")) : "");
    var summary = tier.name + " · " + who + " · est. " + money(total);
    $("formSummary").textContent = summary;
    $("estimateField").value = svcName + " | " + summary + (lines.length ? " | add-ons: " + lines.map(function (l) { return l.label; }).join(", ") : "");
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-svc],[data-art],[data-tier],[data-add],[data-gal],[data-faq],[data-pick]");
    if (!t) return;
    if (t.dataset.svc) { st.svc = t.dataset.svc; st.tier = st.svc === "ill" ? 1 : 0; st.add = {}; renderBuilder(); }
    else if (t.dataset.art) { st.art = t.dataset.art; renderBuilder(); }
    else if (t.dataset.tier) { st.tier = +t.dataset.tier; renderBuilder(); }
    else if (t.dataset.add) { st.add[t.dataset.add] = !st.add[t.dataset.add]; renderBuilder(); }
    else if (t.dataset.gal) { st.gal = t.dataset.gal; renderGallery(); }
    else if (t.dataset.faq) { var n = +t.dataset.faq; st.faq = st.faq === n ? 0 : n; renderFaq(); }
    else if (t.dataset.pick) {
      if (t.dataset.pick === "x") { st.svc = "rig"; st.tier = 0; st.add = {}; }
      else { st.art = t.dataset.pick; if (st.svc === "rig") { st.svc = "ill"; st.tier = 1; } }
      renderBuilder();
    }
  });
  $("findNo").addEventListener("input", renderQueue);

  /* ---------- request form → Supabase table "requests" ---------- */
  var form = $("requestForm");
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    var fd = new FormData(form), err = $("formErr");
    err.textContent = "";
    if (fd.get("website")) return;                       // honeypot: bots fill hidden fields
    var name = String(fd.get("name") || "").trim(), contact = String(fd.get("contact") || "").trim();
    if (!name || !contact) { err.textContent = "Please add your name and where we should reply."; return; }
    if (!form.querySelector('[name="agree_tos"]').checked) { err.textContent = "Please confirm you have read the Terms of Service."; return; }
    var refs = String(fd.get("references") || "").trim();
    if (refs && !/^https?:\/\//i.test(refs)) { err.textContent = "The reference link should start with https://"; return; }
    var btn = $("formSubmit"); btn.disabled = true; btn.textContent = "Sending…";
    try {
      await window.EnigmaStore.submitRequest({
        name: name.slice(0, 120), contact: contact.slice(0, 200),
        artist: String(fd.get("artist") || ""), references: refs.slice(0, 500),
        notes: String(fd.get("notes") || "").slice(0, 4000), estimate: String(fd.get("estimate") || "").slice(0, 500)
      });
      form.reset(); form.classList.add("hidden"); $("formDone").classList.remove("hidden");
      renderBuilder();
    } catch (ex) {
      console.warn(ex);
      err.textContent = "Your request could not be sent. Please try again, or message us on Discord or email.";
    }
    btn.disabled = false; btn.textContent = "Send request";
  });
  $("formAgain").addEventListener("click", function () { $("formDone").classList.add("hidden"); form.classList.remove("hidden"); });

  function renderAll() {
    renderStatus(); renderTeam(); renderGallery(); renderBuilder(); renderQueue(); renderToggles(); renderTos(); renderFaq(); renderContact();
  }

  $("year").textContent = new Date().getFullYear();
  paintThemeBtn();
  window.EnigmaStore.load()
    .then(function (data) { C = data; })
    .catch(function (err) { console.warn(err); C = window.EnigmaStore.defaults(); })
    .then(renderAll);
})();
