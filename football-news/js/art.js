/* Generated cover illustrations (SVG), used when an article has no `image`.
   Each article gets a stable picture from its id, in its category's colours. */
(function () {
  const palettes = {
    "news":           ["#0d4f34", "#062a1c", "#f2b705"],
    "botola":         ["#11643f", "#073523", "#ffd23f"],
    "atlas-lions":    ["#b3121f", "#4a0610", "#2fa864"],
    "africa":         ["#b4560f", "#3d1a04", "#ffcc4d"],
    "europe":         ["#1b3a8a", "#0a1638", "#7cc4ff"],
    "transfers":      ["#5b2a86", "#1d0b33", "#ff7ab6"],
    "women":          ["#a3196b", "#3a0724", "#ffb3d9"],
    "world-cup-2030": ["#0f6e74", "#05282b", "#f2b705"],
    "opinion":        ["#33403a", "#121815", "#f2b705"]
  };

  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let clipN = 0;
  const f = (n) => Math.round(n * 10) / 10;

  function pitch(r, p, uid) {
    const angle = f(-25 + r() * 50);
    const stripes = [];
    for (let i = 0; i < 12; i++) {
      stripes.push(`<rect x="${-400 + i * 133}" y="-400" width="67" height="1300" fill="#fff" opacity="0.05"/>`);
    }
    return `
      <rect width="800" height="450" fill="url(#g${uid})"/>
      <g transform="translate(400 225) rotate(${angle}) scale(${f(1.1 + r() * 0.5)}) translate(-400 -225)">
        ${stripes.join("")}
        <g fill="none" stroke="#fff" stroke-width="3" opacity="0.55">
          <rect x="60" y="40" width="680" height="370"/>
          <line x1="400" y1="40" x2="400" y2="410"/>
          <circle cx="400" cy="225" r="62"/>
          <circle cx="400" cy="225" r="4" fill="#fff"/>
          <rect x="60" y="130" width="100" height="190"/>
          <rect x="60" y="180" width="38" height="90"/>
          <rect x="640" y="130" width="100" height="190"/>
          <rect x="702" y="180" width="38" height="90"/>
          <path d="M160 190 A45 45 0 0 1 160 260"/>
          <path d="M640 190 A45 45 0 0 0 640 260"/>
        </g>
        ${ball(f(220 + r() * 360), f(120 + r() * 210), 16, p[0])}
      </g>
      <circle cx="${f(r() * 800)}" cy="${f(r() * 200)}" r="260" fill="${p[2]}" opacity="0.10"/>`;
  }

  function stadium(r, p, uid) {
    const lights = [];
    const xs = [90 + r() * 60, 330 + r() * 140, 650 + r() * 60];
    xs.forEach((x) => {
      x = f(x);
      lights.push(`
        <circle cx="${x}" cy="70" r="140" fill="url(#l${uid})"/>
        <rect x="${x - 3}" y="80" width="6" height="140" fill="#000" opacity="0.5"/>
        <rect x="${x - 26}" y="58" width="52" height="24" rx="3" fill="#fffbe8"/>
        <g fill="${p[1]}" opacity="0.35">
          <rect x="${x - 22}" y="62" width="10" height="6"/><rect x="${x - 6}" y="62" width="10" height="6"/><rect x="${x + 10}" y="62" width="10" height="6"/>
          <rect x="${x - 22}" y="72" width="10" height="6"/><rect x="${x - 6}" y="72" width="10" height="6"/><rect x="${x + 10}" y="72" width="10" height="6"/>
        </g>`);
    });
    const crowd = [];
    for (let i = 0; i < 160; i++) {
      crowd.push(`<circle cx="${f(r() * 800)}" cy="${f(205 + r() * 70)}" r="${f(1.5 + r() * 2)}" fill="${r() > 0.85 ? p[2] : "#fff"}" opacity="${f(0.15 + r() * 0.35)}"/>`);
    }
    return `
      <rect width="800" height="450" fill="url(#g${uid})"/>
      ${lights.join("")}
      <path d="M0 190 L800 175 L800 300 L0 300 Z" fill="#000" opacity="0.45"/>
      <path d="M0 230 L800 220 L800 300 L0 300 Z" fill="#000" opacity="0.25"/>
      ${crowd.join("")}
      <path d="M-100 450 L130 285 L670 285 L900 450 Z" fill="#1f7a3e"/>
      <g opacity="0.18" fill="#fff">
        <path d="M130 285 L196 285 L40 450 L-100 450 Z"/>
        <path d="M262 285 L328 285 L270 450 L130 450 Z"/>
        <path d="M394 285 L460 285 L500 450 L360 450 Z"/>
        <path d="M526 285 L592 285 L730 450 L590 450 Z"/>
      </g>
      <g fill="none" stroke="#fff" stroke-width="2.5" opacity="0.7">
        <path d="M-100 450 L130 285 L670 285 L900 450"/>
        <ellipse cx="400" cy="372" rx="120" ry="34"/>
        <line x1="400" y1="285" x2="400" y2="450"/>
      </g>`;
  }

  function ball(cx, cy, rad, dark) {
    const pent = (x, y, s, rot) => {
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const a = (rot + i * 72) * Math.PI / 180;
        pts.push(`${f(x + Math.sin(a) * s)},${f(y - Math.cos(a) * s)}`);
      }
      return `<polygon points="${pts.join(" ")}" fill="${dark}"/>`;
    };
    const outer = [];
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 + 36) * Math.PI / 180;
      outer.push(pent(cx + Math.sin(a) * rad * 0.95, cy - Math.cos(a) * rad * 0.95, rad * 0.32, i * 72 + 36 + 180));
    }
    const cid = "c" + (clipN++);
    return `
      <g>
        <circle cx="${cx}" cy="${cy + rad * 0.15}" r="${rad}" fill="#000" opacity="0.25"/>
        <clipPath id="${cid}"><circle cx="${cx}" cy="${cy}" r="${rad}"/></clipPath>
        <circle cx="${cx}" cy="${cy}" r="${rad}" fill="#fff"/>
        <g clip-path="url(#${cid})">
          ${pent(cx, cy, rad * 0.36, 0)}${outer.join("")}
        </g>
        <circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${dark}" stroke-width="${f(rad * 0.04)}" opacity="0.6"/>
        <circle cx="${f(cx - rad * 0.35)}" cy="${f(cy - rad * 0.4)}" r="${f(rad * 0.3)}" fill="#fff" opacity="0.35"/>
      </g>`;
  }

  function ballScene(r, p, uid) {
    const cx = f(470 + r() * 160), cy = f(190 + r() * 60);
    const lines = [];
    for (let i = 0; i < 7; i++) {
      const y = f(cy - 90 + i * 30 + r() * 10);
      const len = f(160 + r() * 220);
      lines.push(`<rect x="${f(cx - 150 - len)}" y="${y}" width="${len}" height="${f(4 + r() * 6)}" rx="4" fill="#fff" opacity="${f(0.12 + r() * 0.25)}"/>`);
    }
    return `
      <rect width="800" height="450" fill="url(#g${uid})"/>
      <circle cx="${cx}" cy="${cy}" r="230" fill="${p[2]}" opacity="0.14"/>
      <circle cx="${cx}" cy="${cy}" r="160" fill="${p[2]}" opacity="0.12"/>
      ${lines.join("")}
      <path d="M0 400 Q400 360 800 400 L800 450 L0 450 Z" fill="#000" opacity="0.25"/>
      ${ball(cx, cy, 110, p[1])}`;
  }

  function trophy(r, p, uid) {
    const confetti = [];
    for (let i = 0; i < 70; i++) {
      const x = f(r() * 800), y = f(r() * 450), rot = f(r() * 180);
      confetti.push(`<rect x="${x}" y="${y}" width="${f(5 + r() * 8)}" height="${f(3 + r() * 4)}" fill="${r() > 0.5 ? p[2] : "#fff"}" opacity="${f(0.3 + r() * 0.5)}" transform="rotate(${rot} ${x} ${y})"/>`);
    }
    return `
      <rect width="800" height="450" fill="url(#g${uid})"/>
      <circle cx="400" cy="200" r="230" fill="url(#l${uid})"/>
      ${confetti.join("")}
      <g transform="translate(400 70)">
        <path d="M-80 0 H80 C80 110 45 160 0 165 C-45 160 -80 110 -80 0 Z" fill="url(#t${uid})"/>
        <path d="M-80 18 C-140 18 -140 105 -55 115" fill="none" stroke="url(#t${uid})" stroke-width="13"/>
        <path d="M80 18 C140 18 140 105 55 115" fill="none" stroke="url(#t${uid})" stroke-width="13"/>
        <rect x="-14" y="160" width="28" height="55" fill="url(#t${uid})"/>
        <rect x="-60" y="212" width="120" height="22" rx="3" fill="url(#t${uid})"/>
        <rect x="-78" y="232" width="156" height="40" rx="4" fill="#2a1c06"/>
        <rect x="-50" y="244" width="100" height="14" rx="2" fill="#d9a514" opacity="0.6"/>
        <path d="M-58 10 C-58 80 -40 120 -20 135" fill="none" stroke="#fff" stroke-width="7" opacity="0.4" stroke-linecap="round"/>
      </g>`;
  }

  function net(r, p, uid) {
    const g = [];
    for (let i = -10; i < 30; i++) {
      g.push(`<line x1="${i * 40}" y1="0" x2="${i * 40 + 450}" y2="450"/>`);
      g.push(`<line x1="${i * 40}" y1="450" x2="${i * 40 + 450}" y2="0"/>`);
    }
    const bx = f(220 + r() * 360), by = f(250 + r() * 40);
    return `
      <rect width="800" height="450" fill="url(#g${uid})"/>
      <g stroke="#fff" stroke-width="2" opacity="0.22">${g.join("")}</g>
      <rect x="0" y="0" width="800" height="26" fill="#fff" opacity="0.9"/>
      <rect x="0" y="0" width="26" height="450" fill="#fff" opacity="0.9"/>
      <rect x="774" y="0" width="26" height="450" fill="#fff" opacity="0.9"/>
      <circle cx="${bx}" cy="${by}" r="200" fill="${p[2]}" opacity="0.12"/>
      ${ball(bx, by, 80, p[1])}
      <path d="M0 410 L800 410 L800 450 L0 450 Z" fill="#1f7a3e"/>`;
  }

  const motifs = { pitch, stadium, ball: ballScene, trophy, net };
  const names = Object.keys(motifs);
  let counter = 0;

  window.coverArt = function (article) {
    const seed = hash(article.id);
    const r = rng(seed);
    const p = palettes[article.cat] || palettes.news;
    const motif = motifs[article.motif] ? article.motif : names[seed % names.length];
    const uid = "a" + (counter++);
    const ang = Math.round(r() * 360);
    return `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${article.title.replace(/"/g, "&quot;")}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g${uid}" gradientTransform="rotate(${ang} .5 .5)">
          <stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/>
        </linearGradient>
        <radialGradient id="l${uid}"><stop offset="0" stop-color="#fffbe0" stop-opacity="0.55"/><stop offset="1" stop-color="#fffbe0" stop-opacity="0"/></radialGradient>
        <linearGradient id="t${uid}" x1="0" x2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="0.5" stop-color="#e2a90f"/><stop offset="1" stop-color="#9c6b06"/></linearGradient>
      </defs>
      ${motifs[motif](r, p, uid)}
    </svg>`;
  };
})();
