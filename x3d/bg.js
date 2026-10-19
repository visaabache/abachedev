// AbacheDev background: one fixed layer behind every page, kept across page changes.
// - Aurora: three soft colour fields (the logo's indigo, cyan and magenta) drifting slowly (CSS).
// - Horizon: a grid floor in perspective that rolls toward the visitor as the page scrolls (CSS, driven by --g).
// - Constellation: points floating at different depths, linked when close. They reach for the
//   pointer, glide with the scroll (near ones faster) and stretch into streaks on a fast scroll (canvas 2D).
// Phones: fewer points at a lower frame rate. Reduced motion: one still frame, nothing moves.

const COLORS = ['79, 70, 229', '79, 70, 229', '79, 70, 229', '6, 182, 212', '217, 70, 239'];
const FAR = 4.2;
const NEAR = 0.7;

export function initBackground({ full = false, reduce = false } = {}) {
  if (document.querySelector('.x-bg')) return;
  const el = document.createElement('div');
  el.className = 'x-bg';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<i class="x-bg-a x-bg-a1"></i><i class="x-bg-a x-bg-a2"></i><i class="x-bg-a x-bg-a3"></i>'
    + '<div class="x-bg-floor"><div class="x-bg-grid"></div></div><canvas class="x-bg-c"></canvas><i class="x-bg-glow"></i>';
  document.body.prepend(el);

  const canvas = el.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const count = full ? 110 : 52;
  const dpr = Math.min(window.devicePixelRatio || 1, full ? 1.5 : 1.25);
  let w = 0, h = 0, focal = 0;

  // seeded, so every visit starts from the same sky
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const spawn = (p, z = NEAR + rnd() * (FAR - NEAR)) => {
    // anywhere inside the view at that depth
    p.x = (rnd() * 2 - 1) * (w / 2 + 40) * z / focal;
    p.y = (rnd() * 2 - 1) * (h / 2 + 40) * z / focal;
    p.z = z;
    p.vx = (rnd() - 0.5) * 0.0006;
    p.vy = (rnd() - 0.5) * 0.0006;
    p.px = null;
    return p;
  };

  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    focal = Math.max(w, h) * 0.42;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  const pts = Array.from({ length: count }, (_, i) => spawn({ c: COLORS[i % COLORS.length], r: 1.1 + rnd() * 1.9 }));

  let mx = -1e4, my = -1e4, gx = 0.5, gy = 0.3;
  let lastY = window.scrollY, speed = 0, gridY = 0;
  const link = full ? 170 : 125;
  const reach = 190;

  const draw = (warp) => {
    ctx.clearRect(0, 0, w, h);
    const s = [];
    for (const p of pts) {
      const k = focal / p.z;
      const sx = w / 2 + p.x * k;
      const sy = h / 2 + p.y * k;
      s.push({ p, sx, sy, a: Math.min(1, (FAR + 0.4 - p.z) / FAR) });
    }
    // links between close points, fainter in the distance
    ctx.lineWidth = 1;
    for (let i = 0; i < s.length; i++) {
      const A = s[i];
      for (let j = i + 1; j < s.length; j++) {
        const B = s[j];
        const dx = A.sx - B.sx, dy = A.sy - B.sy;
        const d2 = dx * dx + dy * dy;
        if (d2 > link * link) continue;
        const o = (1 - Math.sqrt(d2) / link) * 0.34 * Math.min(A.a, B.a);
        ctx.strokeStyle = `rgba(79, 70, 229, ${o.toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(A.sx, A.sy); ctx.lineTo(B.sx, B.sy); ctx.stroke();
      }
      // the pointer pulls nearby points into its own little constellation
      const dx = A.sx - mx, dy = A.sy - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < reach * reach) {
        const o = (1 - Math.sqrt(d2) / reach) * 0.6 * A.a;
        ctx.strokeStyle = `rgba(${A.p.c}, ${o.toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(A.sx, A.sy); ctx.lineTo(mx, my); ctx.stroke();
      }
    }
    // points; on a fast scroll they become streaks
    for (const S of s) {
      const { p, sx, sy, a } = S;
      const r = (p.r * 2.2) / p.z + 0.4;
      if (warp > 0.6 && p.px !== null) {
        ctx.strokeStyle = `rgba(${p.c}, ${(0.6 * a).toFixed(3)})`;
        ctx.lineWidth = r;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(sx, sy); ctx.stroke();
        ctx.lineWidth = 1;
      }
      ctx.fillStyle = `rgba(${p.c}, ${(0.82 * a).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
      p.px = sx; p.py = sy;
    }
  };

  if (reduce) {
    draw(0);
    window.addEventListener('resize', () => { resize(); draw(0); });
    return;
  }

  const step = (dt) => {
    const y = window.scrollY;
    const dy = y - lastY;
    lastY = y;
    speed += (dy - speed) * 0.18;
    gridY = (gridY + dy * 0.35 + dt * 0.012) % 64;
    if (gridY < 0) gridY += 64;
    el.style.setProperty('--g', gridY.toFixed(1));
    gx += ((mx > -1e3 ? mx / w : 0.5) - gx) * 0.06;
    gy += ((my > -1e3 ? my / h : 0.3) - gy) * 0.06;
    el.style.setProperty('--gx', `${(gx * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(gy * 100).toFixed(1)}%`);

    const warp = Math.min(Math.abs(speed) / 14, 3);
    for (const p of pts) {
      // scrolling down flies forward, up flies back; near points glide past faster
      p.z -= Math.sign(speed) * warp * 0.012 * dt / 16 + 0.00015 * dt;
      p.y -= dy * 0.35 / focal; // on screen: 0.35 / z of the scroll
      p.x += p.vx * dt / 16;
      p.y += p.vy * dt / 16;
      if (fine && mx > -1e3) {
        const k = focal / p.z;
        const ddx = mx - (w / 2 + p.x * k), ddy = my - (h / 2 + p.y * k);
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 < reach * reach && d2 > 400) { p.x += (ddx / k) * 0.004; p.y += (ddy / k) * 0.004; }
      }
      if (p.z < NEAR) { spawn(p, FAR); continue; }
      if (p.z > FAR + 0.3) { spawn(p, NEAR + 0.1); continue; }
      const ly = (h / 2 + 40) * p.z / focal, lx = (w / 2 + 40) * p.z / focal;
      if (p.y > ly) { p.y -= ly * 2; p.px = null; }
      else if (p.y < -ly) { p.y += ly * 2; p.px = null; }
      if (p.x > lx) { p.x -= lx * 2; p.px = null; }
      else if (p.x < -lx) { p.x += lx * 2; p.px = null; }
    }
    draw(warp);
  };

  let raf = 0, last = 0;
  const minGap = full ? 0 : 30; // phones: about 30 frames a second
  const loop = (t) => {
    raf = requestAnimationFrame(loop);
    if (!last) { last = t; return; }
    const dt = Math.min(t - last, 50);
    if (dt < minGap) return;
    last = t;
    step(dt);
  };
  const run = () => { if (!raf && !document.hidden) { last = 0; lastY = window.scrollY; raf = requestAnimationFrame(loop); } };
  const halt = () => { cancelAnimationFrame(raf); raf = 0; };
  document.addEventListener('visibilitychange', () => (document.hidden ? halt() : run()));
  window.addEventListener('resize', resize);
  if (fine) {
    window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { mx = my = -1e4; });
  }
  run();
}
