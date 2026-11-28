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
  // Price list, ToS and turnaround from the Nov 2026 draft price list (PDF).
  // Bump contentVersion when these change: older saved copies of the keys in
  // resetOnUpgrade are then replaced by these defaults (see js/store.js).
  contentVersion: 2,
  resetOnUpgrade: ["prices", "addons", "priceNotes", "tos", "faq", "toggles.intro", "toggles.pricing"],
  prices: {
    currency: "$",
    payment: "PayPal invoice or Wise",
    ill: [
      { name: "Bust up", desc: "Head to chest, full render, simple background included", price: 80, days: "1–3 weeks" },
      { name: "Half body", desc: "Head to hips, full render, simple background included", price: 150, days: "1–3 weeks" },
      { name: "Full body", desc: "The full character, head to toe, full render, simple background included", price: 250, days: "1–3 weeks" },
      { name: "Chibi", desc: "Chibi-style full character, full render, simple background included", price: 50, days: "1–3 weeks" }
    ],
    model: [
      { name: "Half body", desc: "Head to hips or mid-thigh. Separated PSD + PNG, 3 basic expressions", price: 400, days: "4–6 weeks" },
      { name: "Full body", desc: "Head to toe. Separated PSD + PNG, 3 basic expressions", price: 600, days: "4–6 weeks" },
      { name: "Chibi", desc: "Chibi-style full model. Separated PSD + PNG, 3 basic expressions", price: 250, days: "4–6 weeks" }
    ],
    rig: [
      { name: "Half body", desc: "Head and body XYZ, physics, mouth tracking, 3 basic expressions or toggles", price: 400, days: "4–6 weeks" },
      { name: "Full body", desc: "Head and body XYZ, full physics including hips and legs, mouth tracking, 5 basic expressions or toggles", price: 550, days: "4–6 weeks" },
      { name: "Chibi", desc: "Head and body XYZ, physics, mouth tracking, 3 basic expressions or toggles", price: 250, days: "4–6 weeks" }
    ],
    pkg: [
      { name: "Half body bundle", desc: "Half body model art (separated PSD + PNG) with full Live2D rigging, 3 basic expressions", price: 700, days: "8–12 weeks" },
      { name: "Full body bundle", desc: "Full body model art (separated PSD + PNG) with full Live2D rigging, 5 basic expressions", price: 1000, days: "8–12 weeks" },
      { name: "Chibi bundle", desc: "Chibi model art (separated PSD + PNG) with Live2D rigging, 3 basic expressions", price: 450, days: "8–12 weeks" }
    ]
  },
  // group: picking one add-on clears the others in the same group
  addons: {
    ill: [
      { label: "Simplified scene background", type: "flat", value: 50, group: "bg" },
      { label: "Complex scene background", type: "flat", value: 150, group: "bg" },
      { label: "Extra character", type: "pct", value: 80 },
      { label: "Commercial use", type: "pct", value: 50, group: "use" },
      { label: "Merchandise use", type: "pct", value: 100, group: "use" },
      { label: "Private / NDA", type: "pct", value: 20 },
      { label: "Rush, shortened deadline", type: "pct", value: 30, group: "rush" },
      { label: "Rush, half the turnaround", type: "pct", value: 50, group: "rush" }
    ],
    model: [
      { label: "Extra expression (each)", type: "flat", value: 20 },
      { label: "Extra outfit", type: "flat", value: 400 },
      { label: "Merchandise use", type: "pct", value: 50 },
      { label: "Private / NDA", type: "pct", value: 20 },
      { label: "Rush, shortened deadline", type: "pct", value: 30, group: "rush" },
      { label: "Rush, half the turnaround", type: "pct", value: 50, group: "rush" }
    ],
    rig: [
      { label: "Extra expression (each)", type: "flat", value: 20 },
      { label: "Animated expression (each)", type: "flat", value: 40 },
      { label: "Extra toggle (each)", type: "flat", value: 25 },
      { label: "VBridger setup", type: "flat", value: 125 },
      { label: ".cmo3 project file buyout", type: "pct", value: 200 },
      { label: "Merchandise use", type: "pct", value: 50 },
      { label: "Private / NDA", type: "pct", value: 20 },
      { label: "Rush, shortened deadline", type: "pct", value: 30, group: "rush" },
      { label: "Rush, half the turnaround", type: "pct", value: 50, group: "rush" }
    ],
    pkg: [
      { label: "Extra expression (each)", type: "flat", value: 20 },
      { label: "Animated expression (each)", type: "flat", value: 40 },
      { label: "Extra toggle (each)", type: "flat", value: 25 },
      { label: "VBridger setup", type: "flat", value: 125 },
      { label: "Extra outfit (art + rig)", type: "flat", value: 400 },
      { label: "Merchandise use", type: "pct", value: 50 },
      { label: "Private / NDA", type: "pct", value: 20 },
      { label: "Rush, shortened deadline", type: "pct", value: 30, group: "rush" },
      { label: "Rush, half the turnaround", type: "pct", value: 50, group: "rush" }
    ]
  },
  priceNotes: [
    { title: "STARTING PRICES", body: "All prices are in USD and are fixed starting prices for standard complexity. Highly detailed designs may cost more, and any increase is confirmed with you before work begins. Payment by PayPal invoice or Wise." },
    { title: "TURNAROUND", body: "Illustration 1–3 weeks. Model art only 4–6 weeks. Rigging only 4–6 weeks. Art + rig bundle 8–12 weeks. Counted from the start of work." },
    { title: "RUSH ORDERS", body: "Available when the schedule allows: +30% for a shortened deadline, or +50% to halve the standard turnaround. Rush rigging under 2 weeks is not accepted." },
    { title: "HOW TO ORDER", body: "Send your character reference (or your idea if you don't have one yet), the service you want, and your deadline if you have one. We confirm the final quote, the slot, and the start date before any payment." },
    { title: "BOOKING & UPDATES", body: "Your slot is confirmed once the first payment arrives. Work starts on the agreed date, and progress is shared at the sketch, final art, and rigging stages for your approval." },
    { title: "GOOD TO KNOW", body: "Character design from scratch (no existing reference) is quoted before booking. Rigging needs a properly separated PSD; PSD repairs can be quoted after review. Streaming and monetised content use is included for VTuber models." }
  ],
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
    intro: "Toggles are extra looks you switch on stream with a hotkey. Pick from our suggestions, or describe your own. Half body and chibi rigs include 3 basic expressions or toggles, full body rigs include 5.",
    pricing: [
      { label: "Extra expression", price: "$20 each" },
      { label: "Animated expression", price: "$40 each" },
      { label: "Extra toggle (accessory, pose, item)", price: "$25 each" },
      { label: "VBridger setup", price: "$125" }
    ],
    items: [
      { name: "Blush", kind: "EXPR" }, { name: "Teary eyes", kind: "EXPR" }, { name: "Heart eyes", kind: "EXPR" },
      { name: "Shadow face", kind: "EXPR" }, { name: "Star eyes", kind: "EXPR" }, { name: "Pout", kind: "EXPR" },
      { name: "Glasses", kind: "TOGGLE" }, { name: "Hat on / off", kind: "TOGGLE" }, { name: "Hair down", kind: "TOGGLE" },
      { name: "Jacket off", kind: "TOGGLE" }, { name: "Held mic", kind: "PROP" }, { name: "Pet on head", kind: "PROP" }
    ]
  },
  tos: [
    { title: "1. PAYMENT", body: "50% upfront books your slot. The remaining 50% is paid before the final files are delivered. Payment by PayPal invoice or Wise. Work starts only after the first payment, and final files are sent only after payment is complete." },
    { title: "2. REVISIONS", body: "Each commission includes 2 rounds of major revisions at the sketch stage and 2 rounds of corrections during production. Minor fixes and mistakes made by the studio are always free. Major changes after a stage is approved, or after delivery, are charged as extra work and quoted before they are made." },
    { title: "3. CANCELLATION & REFUNDS", body: "Cancel before work begins: full refund minus payment platform fees. Cancel after work begins: a partial refund may be issued based on the work already done. No refund after the final files are delivered. If the studio cancels your commission for any reason, you get a full refund." },
    { title: "4. COMMERCIAL USE", body: "VTuber models: streaming and monetised content use is included. Merchandise use is +50% of the base price. Other commercial uses (games, ads, agency or corporate projects) are quoted separately. Illustrations: the base price covers personal use only. Commercial use is +50% and merchandise use is +100%." },
    { title: "5. PRIVATE COMMISSIONS", body: "To keep your commission private and unpublished, a privacy / NDA fee of +20% applies. Without it, finished work may be kept confidential until your debut, for up to 12 months." },
    { title: "6. FILES DELIVERED", body: "Model art: a separated, rig-ready PSD and a transparent PNG. Rigging: runtime files only (.moc3, textures, and VTube Studio files). The editable .cmo3 project file is not included and can be bought out for 2x the rigging fee. Illustration: full-resolution PNG." },
    { title: "7. OWNERSHIP & RIGHTS", body: "The studio keeps the copyright to all artwork and rigging. You receive a licence to use the work under these terms. The work may not be resold, redistributed, transferred, or claimed as your own creation without written permission from the studio." },
    { title: "8. CREDIT", body: "For all VTuber model work, credit to Enigma Studio is required in a visible place, such as your channel bio, about page, or stream panels." },
    { title: "9. PROHIBITED USE", body: "The work may not be used for AI training, generative AI editing, NFT, or cryptocurrency projects under any circumstances." },
    { title: "10. PORTFOLIO", body: "The studio may show finished work and work in progress in its portfolio and on social media after your debut or public release, unless the privacy fee in clause 5 has been paid." },
    { title: "11. COMMUNICATION", body: "Please reply to progress updates within a reasonable time. Long delays in approval may move your commission back in the queue and extend the turnaround." },
    { title: "12. AGREEMENT", body: "Sending the first payment confirms that you have read and agreed to these terms and to the final quote for your commission." }
  ],
  faq: [
    { q: "How do I choose an illustrator?", a: "Every illustrator works at the same price, so pick the style you like. Check each artist's samples on the Our Team page, or choose \"Match me\" in the request form and we suggest one." },
    { q: "Is a bundle cheaper than booking art and rigging separately?", a: "Yes. A half body bundle is $700 instead of $800, full body $1,000 instead of $1,150, and chibi $450 instead of $500. The art is also drawn with rigging in mind, so nothing needs to be re-cut later." },
    { q: "Can you rig art from another artist?", a: "Yes, with Live2D rigging only. Send a properly separated PSD. If it needs repairs, we quote them after review." },
    { q: "How does payment work?", a: "50% upfront to book your slot and 50% before the final files, by PayPal invoice or Wise. We confirm the final quote and start date before you pay anything." },
    { q: "How many revisions do I get?", a: "2 rounds of major revisions at the sketch stage and 2 rounds of corrections during production. Minor fixes and our own mistakes are always free." },
    { q: "Which files do I get?", a: "Model art: separated PSD and transparent PNG. Rigging: .moc3, textures, and VTube Studio files. The .cmo3 project file can be bought out for 2x the rigging fee. Illustration: full-resolution PNG." },
    { q: "Which apps does the model work with?", a: "Rigs are delivered ready for VTube Studio. VBridger setup is available as an add-on." },
    { q: "Do I have to credit the studio?", a: "Yes, for VTuber model work. Please credit Enigma Studio in a visible place such as your channel bio, about page, or stream panels." },
    { q: "Can I use the art commercially?", a: "Streaming and monetised content are included for VTuber models; merchandise is +50%. For illustrations, commercial use is +50% and merchandise +100%. Games, ads, and agency projects are quoted separately." },
    { q: "Can I get a rush order?", a: "When the schedule allows: +30% for a shortened deadline or +50% to halve the turnaround. Rush rigging under 2 weeks is not accepted." }
  ]
};
