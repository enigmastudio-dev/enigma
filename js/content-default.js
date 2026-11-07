/* Default content for the Enigma Studio site.
   The admin panel edits a copy of this object and stores it in Supabase.
   Everything shown on the public page comes from here or from the saved copy. */
window.ENIGMA_DEFAULT = {
  status: {
    open: true,
    openText: "Commissions open",
    closedText: "Commissions closed",
    tagline: "Every character holds a secret. We draw it out."
  },
  contact: {
    discordHandle: "[discord handle]",
    discordUrl: "",
    twitterHandle: "",
    twitterUrl: "",
    email: "enigma.artstd@gmail.com"
  },
  links: {
    trelloUrl: "",
    tosUrl: ""
  },
  team: {
    a: { name: "DYRAVE", role: "Illustrator", slots: "2 of 3 open", bio: "Bright cel-shaded anime with pastel color and crisp line art. Shines on avatars, emotes, and cute VTuber models.", tags: "CEL SHADING, PASTEL, EXPRESSIVE", style: "Soft cel-shaded anime, pastel color" },
    b: { name: "AXNONS", role: "Illustrator", slots: "1 of 2 open", bio: "Painterly rendering with deep shadows and rim light, close to gacha splash art. Rich detail for dark fantasy designs.", tags: "PAINTERLY, DRAMATIC LIGHT, FANTASY", style: "Painterly, dramatic light and shadow" },
    x: { name: "XYN", role: "Live2D Rigger", slots: "1 of 2 open", bio: "Live2D Cubism rigging with natural hair physics and expressive tracking. Rigs our artists' models, or your own art.", tags: "LIVE2D, VTUBE STUDIO, PHYSICS" }
  },
  prices: {
    currency: "$",
    bundleDiscount: 10,
    ill: [
      { name: "Bust-up", desc: "Head to chest. Made for avatars and profile pictures.", a: 60, b: 80, daysA: "5–7 days", daysB: "7–10 days" },
      { name: "Half body", desc: "Head to waist, with room for a pose, hands, and a prop.", a: 90, b: 120, daysA: "7–10 days", daysB: "10–14 days" },
      { name: "Full body", desc: "Head to toe, full outfit. Great as a reference sheet or key visual.", a: 130, b: 170, daysA: "10–14 days", daysB: "14–21 days" }
    ],
    model: [
      { name: "Standard model art", desc: "1 outfit · 3 expressions · rig-ready layered PSD", a: 450, b: 550, daysA: "3–5 weeks", daysB: "4–6 weeks" },
      { name: "Deluxe model art", desc: "2 outfits or hairstyles · 6 expressions · prop and toggle art", a: 700, b: 850, daysA: "5–7 weeks", daysB: "6–8 weeks" }
    ],
    rig: [
      { name: "Standard rig", desc: "Head and body XYZ · eye and mouth tracking · hair physics · 4 toggles", price: 600, days: "4–6 weeks" },
      { name: "Deluxe rig", desc: "Everything in Standard + arm movement · 10 toggles · idle animation · hotkeys", price: 950, days: "6–8 weeks" }
    ],
    pkg: [
      { name: "Standard package", desc: "Standard model art + Standard rig, debut-ready", daysA: "7–10 weeks", daysB: "8–11 weeks" },
      { name: "Deluxe package", desc: "Deluxe model art + Deluxe rig, with 2 looks and 10 toggles", daysA: "10–14 weeks", daysB: "11–15 weeks" }
    ]
  },
  addons: {
    ill: [
      { label: "Extra character", type: "pct", value: 80 },
      { label: "Detailed background", type: "flat", value: 40 },
      { label: "Commercial license", type: "pct", value: 100 },
      { label: "Rush (half the time)", type: "pct", value: 50 },
      { label: "Private (not posted)", type: "flat", value: 25 }
    ],
    model: [
      { label: "Extra outfit", type: "flat", value: 200 },
      { label: "Emote pack (6)", type: "flat", value: 90 },
      { label: "Merch license", type: "pct", value: 50 },
      { label: "Private (not posted)", type: "flat", value: 50 }
    ],
    rig: [
      { label: "+4 toggles", type: "flat", value: 120 },
      { label: "Expression hotkeys", type: "flat", value: 60 },
      { label: "Private (not posted)", type: "flat", value: 50 }
    ],
    pkg: [
      { label: "Extra outfit (art + rig)", type: "flat", value: 380 },
      { label: "Emote pack (6)", type: "flat", value: 90 },
      { label: "Merch license", type: "pct", value: 50 },
      { label: "Private (not posted)", type: "flat", value: 50 }
    ]
  },
  gallery: {
    v: [
      { title: "Vtuber model", artist: "a", rig: true, img: "" },
      { title: "Vtuber model", artist: "b", rig: true, img: "" },
      { title: "Rig only", artist: "x", rig: false, img: "" },
      { title: "Toggle set", artist: "a", rig: true, img: "" },
      { title: "Vtuber model", artist: "b", rig: true, img: "" },
      { title: "Rig only", artist: "x", rig: false, img: "" }
    ],
    i: [
      { title: "Half body · Original character", artist: "a", rig: false, img: "" },
      { title: "Full body · Reference sheet", artist: "b", rig: false, img: "" },
      { title: "Bust-up · Stream avatar", artist: "a", rig: false, img: "" },
      { title: "Key visual · Dark fantasy", artist: "b", rig: false, img: "" },
      { title: "Couple piece · Two OCs", artist: "a", rig: false, img: "" },
      { title: "Character File card", artist: "b", rig: false, img: "" }
    ]
  },
  queue: [
    { name: "WAITING", items: [{ no: "#0142", what: "Full body", artist: "b" }, { no: "#0143", what: "Standard package", artist: "a" }] },
    { name: "SKETCH", items: [{ no: "#0139", what: "Half body", artist: "a" }, { no: "#0140", what: "Deluxe model art", artist: "b" }] },
    { name: "RENDERING", items: [{ no: "#0136", what: "Bust-up ×2", artist: "a" }] },
    { name: "RIGGING", items: [{ no: "#0131", what: "Standard rig", artist: "x" }, { no: "#0133", what: "Deluxe package", artist: "b" }] },
    { name: "DELIVERED", items: [{ no: "#0128", what: "Half body", artist: "b" }, { no: "#0129", what: "Standard rig", artist: "x" }] }
  ],
  toggles: {
    intro: "Toggles are extra looks you switch on stream with a hotkey. Pick from our suggestions, or describe your own. Standard packages include 4, Deluxe includes 10.",
    pricing: [
      { label: "Extra expression", price: "$15 each" },
      { label: "Extra toggle (art + rig)", price: "$30 each" },
      { label: "Custom prop with physics", price: "from $60" }
    ],
    items: [
      { name: "Blush", kind: "EXPR" }, { name: "Teary eyes", kind: "EXPR" }, { name: "Heart eyes", kind: "EXPR" },
      { name: "Shadow face", kind: "EXPR" }, { name: "Star eyes", kind: "EXPR" }, { name: "Pout", kind: "EXPR" },
      { name: "Glasses", kind: "TOGGLE" }, { name: "Hat on / off", kind: "TOGGLE" }, { name: "Hair down", kind: "TOGGLE" },
      { name: "Jacket off", kind: "TOGGLE" }, { name: "Held mic", kind: "PROP" }, { name: "Pet on head", kind: "PROP" }
    ]
  },
  tos: [
    { title: "PAYMENT", body: "PayPal invoice in USD. 50% upfront, the rest before final files. Live2D can be split into 3 payments." },
    { title: "REFUNDS", body: "Full refund before the sketch. 50% after sketch approval. No refund once line art or rigging has started." },
    { title: "USAGE", body: "Personal use and monetized streaming are included. Merch, ads, and covers need a commercial license." },
    { title: "WON'T DRAW", body: "NSFW, real people, hateful imagery, full mecha, or finishing AI-generated art." }
  ],
  faq: [
    { q: "How do I choose between the two illustrators?", a: "Dyrave is bright, soft, and clean, great for cute or cozy characters. Axnons is painterly and dramatic, great for dark fantasy and detailed outfits. Pick \"Match me\" in the form and we suggest one." },
    { q: "Can I get art from one artist and rigging from Xyn?", a: "Yes, that is the Live2D full package. Booking both together saves money and keeps the hand-off inside the studio." },
    { q: "Can Xyn rig art from another artist?", a: "Yes, with Rig only. Send a properly layered PSD and Xyn checks it before quoting." },
    { q: "Can I pay in installments?", a: "Yes, for every Live2D service: 3 payments at the start, after the art or rig check, and before final files." },
    { q: "What is the Character File card?", a: "A profile poster of your character in our signature style, in 9:16 and 16:9, free with every order." }
  ]
};
