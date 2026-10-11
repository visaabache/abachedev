// The persistent 3D layer: one canvas, one renderer, six service objects.
// Home: the objects ride a ring around the dark disc (auto-rotates, drag to spin, click the front one).
// Service page: the chosen object sits at the bottom centre and rises/tilts with the scroll.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildDevice } from './models.js';

const FOV = 30;
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
const D_RING = 10; // camera distance of the ring centre and of the disc occluder
const D_SERVICE = 9; // camera distance of the selected object on service pages
const TILT = 0.2; // ring plane tilt (front comes down and closer)
const AUTO_SPEED = -0.085; // rad/s — slow idle rotation
const BASE_YAW = -0.28; // every object shows a little of its side
const TAU = Math.PI * 2;

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function makeStage(renderer, scene) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfcbe8, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.35);
  key.position.set(4, 6, 8);
  scene.add(key);
}

export function createScene({ canvas, services, onFrontChange = () => {}, onSelect = () => {} }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  const scene = new THREE.Scene();
  makeStage(renderer, scene);
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);

  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const items = services.map((service, i) => {
    const holder = new THREE.Group();
    holder.add(buildDevice(service, { anisotropy: aniso }));
    holder.visible = false;
    scene.add(holder);
    return {
      i, service, holder,
      pos: new THREE.Vector3(), quat: new THREE.Quaternion(), scale: 0,
      tPos: new THREE.Vector3(), tQuat: new THREE.Quaternion(), tScale: 0,
      k: 6, hover: 0,
    };
  });
  const N = items.length;
  const STEP = TAU / N;

  // Invisible disc that writes depth only: objects passing behind the HTML disc get hidden by it.
  const occluder = new THREE.Mesh(new THREE.CircleGeometry(1, 128), new THREE.MeshBasicMaterial({ colorWrite: false }));
  occluder.renderOrder = -1;
  scene.add(occluder);

  // ---- layout ---------------------------------------------------------------
  let W = 1, H = 1, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let discEl = null;
  const L = { ringX: 0, ringY: 0, R: 0, lift: 0, size: 0, svcSize: 0, disc: null };
  const wpp = (d) => (2 * d * TAN) / H; // world units per CSS pixel at distance d
  const toWorld = (sx, sy, d, out) => out.set((sx - W / 2) * wpp(d), (H / 2 - sy) * wpp(d), -d);

  function layout() {
    W = window.innerWidth;
    H = window.innerHeight;
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    L.ringX = W / 2;
    L.ringY = H * 0.55;
    L.R = Math.min(W * 0.27, H * 0.6);
    L.lift = H * 0.05;
    L.size = Math.min(H * 0.3, W * 0.2);
    L.svcSize = Math.min(H * 0.58, W * 0.4);
    if (discEl) {
      const r = discEl.getBoundingClientRect();
      L.disc = { x: r.left + r.width / 2, y: r.top + r.height / 2 + pageY, r: r.width / 2 };
    }
    placeOccluder();
  }

  function placeOccluder() {
    if (!L.disc) { occluder.visible = false; return; }
    toWorld(L.disc.x, L.disc.y, D_RING, occluder.position);
    occluder.scale.setScalar(L.disc.r * wpp(D_RING));
  }

  // ---- state ------------------------------------------------------------------
  let mode = 'home';
  let selected = -1;
  let angle = 0;
  let velocity = 0;
  let snapTo = null;
  let holdUntil = 0;
  let hoverFront = false;
  let dragging = null;
  let front = -1;
  let pageY = 0; // page scroll (home)
  let svcP = 0; // service scroll progress 0..1 (while pinned)
  let svcExit = 0; // px scrolled after the pin
  let active = true;
  let time = 0;

  const v = new THREE.Vector3();
  const e = new THREE.Euler();
  const ringPos = new THREE.Vector3();

  function ringTarget(it, t) {
    const th = angle + it.i * STEP;
    const c = Math.cos(th), s = Math.sin(th);
    const f = (c + 1) / 2;
    const k = wpp(D_RING);
    const R = L.R * k;
    // ring-local position, then tilt the ring plane
    const lx = R * s, ly = L.lift * k * (1 - c), lz = R * c;
    toWorld(L.ringX, L.ringY, D_RING, ringPos);
    it.tPos.set(
      ringPos.x + lx,
      ringPos.y + ly * Math.cos(TILT) - lz * Math.sin(TILT),
      ringPos.z + ly * Math.sin(TILT) + lz * Math.cos(TILT),
    );
    const drift = 1 - f * 0.75;
    it.tPos.y += Math.sin(t * 0.9 + it.i * 2.1) * 0.035 * L.size * k * drift;
    const grow = 0.3 + 0.7 * smooth(-0.6, 1, c);
    const fadeBack = smooth(-0.98, -0.55, c);
    it.tScale = L.size * k * grow * fadeBack * (1 + it.hover * 0.06);
    e.set(
      0.06 + Math.sin(t * 0.7 + it.i) * 0.05 * drift,
      BASE_YAW + s * 0.75 + Math.sin(t * 0.5 + it.i * 1.3) * 0.06 * drift,
      -s * 0.3 + Math.sin(t * 0.6 + it.i * 0.8) * 0.04 * drift,
    );
    it.tQuat.setFromEuler(e);
  }

  function serviceTarget(it, t) {
    const sy = H - svcP * H * 0.5 - svcExit;
    toWorld(W / 2, sy, D_SERVICE, it.tPos);
    it.tScale = L.svcSize * wpp(D_SERVICE);
    e.set(-0.04 + svcP * 0.2, BASE_YAW + Math.sin(t * 0.45) * 0.07 + svcP * 0.15, -svcP * 0.44);
    it.tQuat.setFromEuler(e);
  }

  function hiddenTarget(it) {
    it.tScale = 0;
  }

  // ---- update -----------------------------------------------------------------
  function update(dt) {
    // Off-screen, the ring freezes so the loop can settle and stop.
    if (active) time += dt;
    const now = performance.now();
    if (mode === 'home') {
      if (dragging) {
        // angle follows the pointer directly
      } else if (snapTo !== null) {
        angle += (snapTo - angle) * (1 - Math.exp(-6 * dt));
        if (Math.abs(snapTo - angle) < 0.002) { angle = snapTo; snapTo = null; }
      } else {
        angle += velocity * dt;
        velocity *= Math.exp(-3.2 * dt);
        if (active && Math.abs(velocity) < 0.02 && !hoverFront && now > holdUntil) angle += AUTO_SPEED * dt;
      }
      camera.position.y = -pageY * wpp(D_RING);
    } else {
      camera.position.y = 0;
    }

    let best = -1, bestC = -2;
    let settled = true;
    for (const it of items) {
      if (mode === 'home') ringTarget(it, time);
      else if (it.i === selected) serviceTarget(it, time);
      else hiddenTarget(it);
      if (mode === 'home') {
        const c = Math.cos(angle + it.i * STEP);
        if (c > bestC) { bestC = c; best = it.i; }
      }
      const a = 1 - Math.exp(-it.k * dt);
      it.pos.lerp(it.tPos, a);
      it.quat.slerp(it.tQuat, a);
      it.scale += (it.tScale - it.scale) * a;
      if (Math.abs(it.tScale - it.scale) > 1e-3 || it.pos.distanceToSquared(it.tPos) > 1e-5) settled = false;
      it.holder.visible = it.scale > 1e-3;
      it.holder.position.copy(it.pos);
      it.holder.quaternion.copy(it.quat);
      it.holder.scale.setScalar(Math.max(it.scale, 1e-4));
      it.hover += ((hoverFront && it.i === best && mode === 'home' ? 1 : 0) - it.hover) * (1 - Math.exp(-10 * dt));
    }
    if (mode === 'home' && best !== front) {
      front = best;
      onFrontChange(front);
    }
    return settled;
  }

  // ---- render loop --------------------------------------------------------------
  let raf = 0, last = 0, settled = false;
  let slow = 0, frames = 0;
  function frame(now) {
    raf = 0;
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    settled = update(dt);
    renderer.render(scene, camera);
    // Adaptive resolution: drop the pixel ratio if frames are consistently slow.
    frames++;
    if (dt > 0.024) slow++;
    if (frames === 90) {
      if (slow > 45 && dpr > 1) { dpr = Math.max(1, dpr - 0.25); layout(); }
      frames = slow = 0;
    }
    if (!document.hidden && (active || !settled)) raf = requestAnimationFrame(frame);
  }
  function kick() {
    if (!raf && !document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }
  document.addEventListener('visibilitychange', kick);
  const onResize = () => { layout(); kick(); };
  window.addEventListener('resize', onResize);

  // ---- pointer (home hero) ---------------------------------------------------------
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function pick(x, y) {
    ndc.set((x / W) * 2 - 1, -(y / H) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(items.filter((it) => it.holder.visible && it.scale > 0.05).map((it) => it.holder), true);
    if (!hits.length) return null;
    let o = hits[0].object;
    while (o && !items.some((it) => it.holder === o)) o = o.parent;
    return items.find((it) => it.holder === o) || null;
  }

  let bound = null;
  function bindPointer(el) {
    unbindPointer();
    const down = (ev) => {
      if (mode !== 'home' || ev.button !== 0 || ev.target.closest('a, button')) return;
      dragging = { id: ev.pointerId, x: ev.clientX, lastX: ev.clientX, lastT: performance.now(), moved: 0 };
      velocity = 0;
      snapTo = null;
      el.setPointerCapture?.(ev.pointerId);
      el.classList.add('is-dragging');
      kick();
    };
    const move = (ev) => {
      if (mode !== 'home') return;
      if (dragging && ev.pointerId === dragging.id) {
        const dx = ev.clientX - dragging.lastX;
        const now = performance.now();
        const da = (dx / W) * Math.PI * 1.25;
        angle += da;
        velocity = da / Math.max(0.008, (now - dragging.lastT) / 1000);
        dragging.lastX = ev.clientX;
        dragging.lastT = now;
        dragging.moved += Math.abs(dx);
        kick();
        return;
      }
      if (ev.pointerType !== 'mouse') return;
      const hit = pick(ev.clientX, ev.clientY);
      hoverFront = !!hit && hit.i === front;
      el.classList.toggle('is-pointing', !!hit);
    };
    const up = (ev) => {
      if (!dragging || ev.pointerId !== dragging.id) return;
      const click = dragging.moved < 6;
      dragging = null;
      el.classList.remove('is-dragging');
      if (click) {
        velocity = 0;
        const hit = pick(ev.clientX, ev.clientY);
        if (hit && hit.i === front) onSelect(hit.i);
        else if (hit) ringTo(hit.i);
      } else {
        velocity = Math.max(-4, Math.min(4, velocity));
        holdUntil = performance.now() + 2500;
      }
    };
    const leave = () => { hoverFront = false; el.classList.remove('is-pointing'); };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', leave);
    bound = { el, down, move, up, leave };
  }
  function unbindPointer() {
    if (!bound) return;
    const { el, down, move, up, leave } = bound;
    el.removeEventListener('pointerdown', down);
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', up);
    el.removeEventListener('pointerleave', leave);
    bound = null;
  }

  // ---- ring control ------------------------------------------------------------------
  function ringTo(i, { instant = false } = {}) {
    // nearest angle that puts item i at the front
    const target = -i * STEP;
    const k = Math.round((angle - target) / TAU);
    snapTo = target + k * TAU;
    velocity = 0;
    holdUntil = performance.now() + 5000;
    if (instant) { angle = snapTo; snapTo = null; }
    kick();
  }

  function snapAll() {
    for (const it of items) {
      it.pos.copy(it.tPos);
      it.quat.copy(it.tQuat);
      it.scale = it.tScale;
    }
  }

  function setMode(next, { slug, instant = false } = {}) {
    const prev = mode;
    const prevSel = selected;
    mode = next;
    if (next === 'service') {
      selected = items.findIndex((it) => it.service.slug === slug);
      svcP = 0;
      svcExit = 0;
      occluder.visible = false;
      for (const it of items) it.k = it.i === selected ? 4.2 : 6;
      if (prev === 'service' && prevSel !== selected && prevSel >= 0) {
        // the new object rises from below while the old one drops away
        const it = items[selected];
        toWorld(W / 2, H * 1.7, D_SERVICE, it.pos);
        it.scale = L.svcSize * wpp(D_SERVICE);
        const old = items[prevSel];
        toWorld(W / 2, H * 1.9, D_SERVICE, old.tPos);
      }
      if (prev === 'home') ringTo(selected, { instant: true });
    } else {
      selected = -1;
      placeOccluder();
      for (const it of items) it.k = 4.5;
      setTimeout(() => items.forEach((it) => (it.k = 7)), 1400);
    }
    if (instant) {
      update(0);
      for (const it of items) {
        if (mode === 'home') ringTarget(it, time);
        else if (it.i === selected) serviceTarget(it, time);
        else it.tScale = 0;
      }
      snapAll();
      for (const it of items) it.k = mode === 'service' ? 10 : 7;
    }
    kick();
  }

  // ---- public API --------------------------------------------------------------------
  layout();
  // first placement (home by default): everything starts at its ring spot
  for (const it of items) ringTarget(it, 0);
  snapAll();
  kick();

  return {
    get front() { return front; },
    setMode,
    ringTo,
    ringNext: () => ringTo((front + 1) % N),
    ringPrev: () => ringTo((front - 1 + N) % N),
    holdAuto: (ms) => { holdUntil = performance.now() + ms; },
    setDisc(el) { discEl = el; layout(); kick(); },
    setScroll(y) { pageY = y; if (mode === 'home') kick(); },
    setServiceProgress(p, exitPx = 0) {
      svcP = p;
      svcExit = exitPx;
      for (const it of items) if (it.i === selected && it.k < 9) it.k = Math.max(it.k, 9);
      kick();
    },
    setActive(on) { active = on; if (on) kick(); },
    bindPointer,
    unbindPointer,
    resize: onResize,
    dispose() {
      cancelAnimationFrame(raf);
      unbindPointer();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', kick);
      renderer.dispose();
    },
  };
}

/** Renders each service object on a transparent background (for the static images). */
export function renderStills(services, size = 900) {
  const canvas = document.createElement('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(size, size, false);
  const scene = new THREE.Scene();
  makeStage(renderer, scene);
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
  camera.position.set(0, 0, 3.4);
  const out = {};
  for (const s of services) {
    const obj = buildDevice(s, { anisotropy: 8 });
    obj.rotation.set(0.06, BASE_YAW, 0);
    obj.scale.setScalar(1.18);
    scene.add(obj);
    renderer.render(scene, camera);
    out[s.slug] = canvas.toDataURL('image/png');
    scene.remove(obj);
  }
  renderer.dispose();
  return out;
}
