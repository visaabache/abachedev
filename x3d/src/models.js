// Simple device models for the six services, built from rounded boxes and canvas-drawn screens.
// Every model is normalised to about 1 unit tall and centred on the origin.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const INK = '#1e1b4b';
const ACCENT = '#4f46e5';
const GREY = '#e9e8f1';

// ---- small helpers ---------------------------------------------------------
const hex = (c) => new THREE.Color(c);
function mix(a, b, t) {
  return '#' + hex(a).lerp(hex(b), t).getHexString();
}
function rr(g, x, y, w, h, r, fill) {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fillStyle = fill;
  g.fill();
}
function dot(g, x, y, r, fill) {
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fillStyle = fill;
  g.fill();
}
function bars(g, x, y, widths, h, gap, fill) {
  widths.forEach((w, i) => rr(g, x, y + i * (h + gap), w, h, h / 2, fill));
}
function stroke(g, color, width, pts, close = false) {
  g.beginPath();
  pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  if (close) g.closePath();
  g.strokeStyle = color;
  g.lineWidth = width;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.stroke();
}

let ANISO = 4;
function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = ANISO;
  return t;
}

const MAT = {};
function materials() {
  if (MAT.shell) return MAT;
  MAT.shell = new THREE.MeshStandardMaterial({ color: 0xf6f5f9, roughness: 0.38, metalness: 0.04 });
  MAT.dark = new THREE.MeshStandardMaterial({ color: 0x1f1d3d, roughness: 0.42, metalness: 0.2 });
  MAT.metal = new THREE.MeshStandardMaterial({ color: 0xd9dae3, roughness: 0.3, metalness: 0.55 });
  return MAT;
}
const tinted = (color, roughness = 0.42) => new THREE.MeshStandardMaterial({ color: hex(color), roughness, metalness: 0.05 });
const screen = (map) => new THREE.MeshBasicMaterial({ map, toneMapped: false });
const box = (w, h, d, r, mat, seg = 4) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, seg, r), mat);
function plane(w, h, mat) {
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
}

// ---- screens ---------------------------------------------------------------
function browserScreen(color) {
  return canvasTexture(1300, 940, (g, w, h) => {
    rr(g, 0, 0, w, h, 0, '#ffffff');
    rr(g, 0, 0, w, 92, 0, color);
    ['#ffffff', '#ffffff', '#ffffff'].forEach((c, i) => dot(g, 52 + i * 40, 46, 12, mix(color, c, 0.55 + i * 0.12)));
    rr(g, 190, 26, 760, 40, 20, mix(color, '#ffffff', 0.78));
    rr(g, 60, 132, 150, 26, 13, INK);
    bars(g, 860, 138, [90], 14, 0, GREY);
    rr(g, 980, 138, 90, 14, 7, GREY);
    rr(g, 1090, 128, 150, 36, 18, color);
    rr(g, 60, 196, 1180, 330, 26, mix(color, '#ffffff', 0.86));
    bars(g, 110, 262, [560, 430], 38, 24, INK);
    rr(g, 110, 410, 190, 56, 28, color);
    dot(g, 1010, 361, 118, color);
    dot(g, 1080, 300, 54, mix(color, '#ffffff', 0.45));
    // palette + type specimen
    [color, INK, ACCENT, mix(color, '#ffffff', 0.55)].forEach((c, i) => dot(g, 110 + i * 92, 640, 34, c));
    g.fillStyle = INK;
    g.font = '700 132px Georgia, "Times New Roman", serif';
    g.fillText('Aa', 560, 690);
    bars(g, 800, 600, [380, 300, 340], 18, 16, GREY);
    for (let i = 0; i < 3; i++) {
      rr(g, 60 + i * 400, 760, 360, 140, 20, '#f4f3f8');
      bars(g, 90 + i * 400, 800, [200, 140], 14, 14, mix(INK, '#ffffff', 0.7));
    }
  });
}

function codeScreen(color) {
  return canvasTexture(1400, 920, (g, w, h) => {
    rr(g, 0, 0, w, h, 0, '#17152f');
    rr(g, 0, 0, w, 62, 0, '#221f45');
    ['#ff6b6b', '#ffc34d', '#3ddc84'].forEach((c, i) => dot(g, 40 + i * 36, 31, 10, c));
    rr(g, 0, 62, 230, h, 0, '#1c1a3c');
    for (let i = 0; i < 9; i++) rr(g, 32 + (i % 3 ? 24 : 0), 104 + i * 44, 130 - (i % 4) * 18, 14, 7, i === 2 ? color : '#3b3870');
    const tok = [color, '#c7d2fe', '#f9a8d4', '#7dd3fc', '#6b6a99'];
    const rows = [
      [[0, 90, 0], [1, 160, 1], [3, 120, 2]],
      [[1, 60, 4], [0, 200, 1]],
      [[2, 70, 0], [1, 120, 1], [3, 240, 2], [1, 60, 1]],
      [[2, 70, 3], [0, 180, 2]],
      [[2, 70, 1], [4, 300, 4]],
      [[1, 40, 1]],
      [[0, 110, 0], [1, 140, 1], [3, 90, 2]],
      [[1, 60, 3], [0, 150, 1], [2, 200, 2]],
      [[2, 70, 0], [1, 260, 1]],
      [[1, 40, 1]],
      [[0, 80, 4], [3, 330, 4]],
      [[0, 140, 0], [1, 100, 2]],
    ];
    rows.forEach((row, r) => {
      let x = 290;
      row.forEach(([indent, len, t], k) => {
        if (k === 0) x += indent * 48;
        rr(g, x, 104 + r * 52, len, 20, 10, tok[t]);
        x += len + 18;
      });
      g.fillStyle = '#4a477e';
      g.font = '600 18px monospace';
      g.fillText(String(r + 1), 250, 121 + r * 52);
    });
    // big tag glyph
    stroke(g, color, 26, [[1090, 690], [1020, 760], [1090, 830]]);
    stroke(g, color, 26, [[1250, 690], [1320, 760], [1250, 830]]);
    stroke(g, '#c7d2fe', 22, [[1190, 680], [1150, 840]]);
  });
}

function keyboardTexture(color) {
  return canvasTexture(1500, 1000, (g, w, h) => {
    rr(g, 0, 0, w, h, 0, mix(color, '#ffffff', 0.15));
    for (let row = 0; row < 5; row++) {
      for (let k = 0; k < 13; k++) rr(g, 120 + k * 98, 90 + row * 92, 84, 76, 12, mix(color, INK, 0.62));
    }
    rr(g, 300, 104 + 5 * 92, 900, 70, 12, mix(color, INK, 0.62));
    rr(g, 520, 690, 460, 260, 26, mix(color, '#ffffff', 0.35));
  });
}

function boxLabel(color) {
  return canvasTexture(820, 560, (g, w, h) => {
    rr(g, 0, 0, w, h, 54, '#ffffff');
    // cart
    stroke(g, INK, 30, [[150, 120], [215, 120], [280, 330], [560, 330], [615, 175], [240, 175]]);
    dot(g, 320, 410, 30, INK);
    dot(g, 525, 410, 30, INK);
    dot(g, 690, 125, 60, color);
    g.fillStyle = '#ffffff';
    g.font = '800 64px Arial, sans-serif';
    g.textAlign = 'center';
    g.fillText('%', 690, 148);
    // barcode
    let x = 150;
    [6, 3, 9, 3, 4, 8, 3, 6, 3, 10, 4, 3, 7, 3, 5, 9, 3, 6].forEach((bw, i) => {
      if (i % 2 === 0) rr(g, x, 470, bw * 2.4, 52, 0, INK);
      x += bw * 2.4 + 6;
    });
  });
}

function seoScreen(color) {
  return canvasTexture(520, 1100, (g, w, h) => {
    rr(g, 0, 0, w, h, 0, '#ffffff');
    rr(g, 190, 26, 140, 30, 15, '#111111');
    rr(g, 36, 104, 448, 78, 39, '#f1f0f6');
    g.beginPath();
    g.arc(86, 140, 17, 0, Math.PI * 2);
    g.strokeStyle = INK;
    g.lineWidth = 7;
    g.stroke();
    stroke(g, INK, 7, [[99, 154], [114, 169]]);
    bars(g, 128, 133, [220], 16, 0, mix(INK, '#ffffff', 0.6));
    rr(g, 36, 220, 448, 214, 26, color);
    dot(g, 96, 282, 34, '#ffffff');
    g.fillStyle = color;
    g.font = '800 44px Arial, sans-serif';
    g.textAlign = 'center';
    g.fillText('1', 96, 298);
    bars(g, 150, 262, [280, 200], 18, 16, '#ffffff');
    bars(g, 70, 350, [380, 320], 14, 14, mix(color, '#ffffff', 0.55));
    for (let i = 0; i < 3; i++) {
      rr(g, 36, 466 + i * 150, 448, 124, 22, '#f4f3f8');
      bars(g, 66, 496 + i * 150, [260, 340, 200], 13, 12, mix(INK, '#ffffff', 0.72));
    }
    stroke(g, color, 14, [[60, 1030], [170, 960], [260, 990], [440, 900]]);
    stroke(g, color, 14, [[400, 900], [440, 900], [440, 940]]);
  });
}

function redesignScreen(color) {
  return canvasTexture(1240, 880, (g, w, h) => {
    const half = w / 2;
    rr(g, 0, 0, half, h, 0, '#e7e4dc');
    rr(g, 30, 30, half - 60, 70, 0, '#b9b4a7');
    g.fillStyle = '#8e887a';
    g.font = '400 54px "Times New Roman", serif';
    g.fillText('Bienvenue !', 50, 220);
    bars(g, 50, 270, [460, 500, 420, 480], 16, 18, '#c4beb1');
    rr(g, 50, 470, 240, 180, 0, '#cfc9bc');
    rr(g, 320, 470, 240, 180, 0, '#cfc9bc');
    bars(g, 50, 700, [500, 380], 16, 18, '#c4beb1');
    // new
    rr(g, half, 0, half, h, 0, '#ffffff');
    rr(g, half + 40, 40, 120, 24, 12, INK);
    rr(g, w - 170, 34, 130, 36, 18, color);
    rr(g, half + 40, 110, half - 80, 300, 28, mix(color, '#ffffff', 0.85));
    bars(g, half + 80, 170, [380, 300], 34, 20, INK);
    rr(g, half + 80, 300, 170, 52, 26, color);
    for (let i = 0; i < 2; i++) {
      rr(g, half + 40 + i * 280, 450, 260, 200, 22, '#f4f3f8');
      dot(g, half + 100 + i * 280, 510, 26, i ? mix(color, '#ffffff', 0.4) : color);
      bars(g, half + 76 + i * 280, 570, [180, 130], 14, 14, mix(INK, '#ffffff', 0.7));
    }
    bars(g, half + 40, 700, [460, 360], 16, 18, GREY);
    // slider
    rr(g, half - 5, 0, 10, h, 0, '#ffffff');
    dot(g, half, h / 2, 52, '#ffffff');
    stroke(g, INK, 9, [[half - 14, h / 2 - 18], [half - 30, h / 2], [half - 14, h / 2 + 18]]);
    stroke(g, INK, 9, [[half + 14, h / 2 - 18], [half + 30, h / 2], [half + 14, h / 2 + 18]]);
  });
}

function careScreen(color) {
  return canvasTexture(1360, 840, (g, w, h) => {
    rr(g, 0, 0, w, h, 0, '#f7f7fb');
    rr(g, 0, 0, w, 76, 0, '#ffffff');
    dot(g, 48, 38, 12, '#22c55e');
    bars(g, 74, 31, [180], 14, 0, mix(INK, '#ffffff', 0.55));
    rr(g, w - 230, 22, 190, 32, 16, mix(color, '#ffffff', 0.7));
    // check badge
    dot(g, 250, 330, 140, color);
    stroke(g, '#ffffff', 30, [[180, 335], [235, 390], [325, 280]]);
    bars(g, 120, 520, [260, 200], 18, 16, mix(INK, '#ffffff', 0.55));
    // gear
    g.save();
    g.translate(1180, 210);
    g.fillStyle = INK;
    for (let i = 0; i < 8; i++) {
      g.rotate(Math.PI / 4);
      rr(g, -16, -78, 32, 40, 6, INK);
    }
    dot(g, 0, 0, 56, INK);
    dot(g, 0, 0, 22, '#f7f7fb');
    g.restore();
    // uptime bars
    for (let i = 0; i < 26; i++) {
      const bh = 120 + ((i * 37) % 70);
      rr(g, 470 + i * 30, 700 - bh, 20, bh, 6, i === 17 ? mix(color, '#ffffff', 0.55) : color);
    }
    stroke(g, mix(INK, '#ffffff', 0.3), 10, [[480, 380], [600, 330], [720, 360], [860, 260], [1000, 290]]);
    bars(g, 480, 140, [420, 300], 18, 18, mix(INK, '#ffffff', 0.7));
  });
}

// ---- devices ---------------------------------------------------------------
function browser(color) {
  const m = materials();
  const g = new THREE.Group();
  g.add(box(1.36, 1.0, 0.07, 0.05, m.shell));
  const s = plane(1.3, 0.94, screen(browserScreen(color)));
  s.position.z = 0.037;
  g.add(s);
  return g;
}

function laptop(color) {
  const m = materials();
  const g = new THREE.Group();
  const base = box(1.5, 0.055, 1.0, 0.025, tinted(color, 0.5));
  g.add(base);
  const keys = plane(1.42, 0.94, new THREE.MeshStandardMaterial({ map: keyboardTexture(color), roughness: 0.6 }));
  keys.rotation.x = -Math.PI / 2;
  keys.position.y = 0.029;
  g.add(keys);
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.028, -0.48);
  hinge.rotation.x = -0.24;
  const lid = box(1.5, 0.98, 0.04, 0.025, m.dark);
  lid.position.y = 0.49;
  hinge.add(lid);
  const s = plane(1.4, 0.9, screen(codeScreen(color)));
  s.position.set(0, 0.49, 0.021);
  hinge.add(s);
  g.add(hinge);
  return g;
}

function parcel(color) {
  const g = new THREE.Group();
  g.add(box(0.95, 0.8, 0.8, 0.035, tinted(color, 0.55)));
  const label = plane(0.62, 0.42, new THREE.MeshStandardMaterial({ map: boxLabel(color), roughness: 0.5, transparent: true }));
  label.position.set(0, -0.02, 0.402);
  g.add(label);
  const tape = plane(0.2, 0.8, tinted(mix(color, INK, 0.18), 0.35));
  tape.rotation.x = -Math.PI / 2;
  tape.position.y = 0.401;
  g.add(tape);
  const tapeFront = plane(0.2, 0.16, tinted(mix(color, INK, 0.18), 0.35));
  tapeFront.position.set(0, 0.32, 0.401);
  g.add(tapeFront);
  return g;
}

function phone(color) {
  const g = new THREE.Group();
  g.add(box(0.56, 1.14, 0.075, 0.075, tinted(color, 0.35), 6));
  const bezel = plane(0.52, 1.1, new THREE.MeshBasicMaterial({ color: 0x111111 }));
  bezel.position.z = 0.0385;
  g.add(bezel);
  const s = plane(0.5, 1.06, screen(seoScreen(color)));
  s.position.z = 0.039;
  g.add(s);
  return g;
}

function tablet(color) {
  const g = new THREE.Group();
  g.add(box(1.3, 0.92, 0.06, 0.06, tinted(color, 0.35), 6));
  const bezel = plane(1.25, 0.87, new THREE.MeshBasicMaterial({ color: 0x111111 }));
  bezel.position.z = 0.0305;
  g.add(bezel);
  const s = plane(1.22, 0.84, screen(redesignScreen(color)));
  s.position.z = 0.031;
  g.add(s);
  return g;
}

function monitor(color) {
  const m = materials();
  const g = new THREE.Group();
  const head = box(1.4, 0.86, 0.06, 0.035, m.dark);
  head.position.y = 0.22;
  g.add(head);
  const s = plane(1.33, 0.79, screen(careScreen(color)));
  s.position.set(0, 0.22, 0.031);
  g.add(s);
  const neck = box(0.13, 0.36, 0.06, 0.02, m.metal);
  neck.position.set(0, -0.33, -0.05);
  g.add(neck);
  const foot = box(0.58, 0.045, 0.34, 0.02, tinted(color, 0.4));
  foot.position.set(0, -0.5, -0.02);
  g.add(foot);
  return g;
}

// fit: per-device size tweak so they read as the same visual weight
const BUILDERS = {
  browser: [browser, 0.96],
  laptop: [laptop, 0.84],
  box: [parcel, 0.74],
  phone: [phone, 1.06],
  tablet: [tablet, 0.94],
  monitor: [monitor, 0.98],
};

/** Builds the model for a service, normalised to ~1 unit and centred. */
export function buildDevice(service, { anisotropy = 4 } = {}) {
  ANISO = anisotropy;
  const [build, fit] = BUILDERS[service.device];
  const model = build(service.color);
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const s = fit / Math.max(size.y, size.x * 0.8);
  model.position.copy(center).multiplyScalar(-s);
  model.scale.setScalar(s);
  const wrap = new THREE.Group();
  wrap.add(model);
  return wrap;
}
