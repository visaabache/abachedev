// AbacheDev 3D experience (French pages): carousel, page transitions, scroll effects.
// Desktop: Three.js scene (lazy-loaded) + GSAP ScrollTrigger + Lenis, one persistent canvas.
// Phones, touch screens and reduced motion: static object images with simple fades, same layout.
import { SERVICES, servicePath } from './services.js?v=2026101101';

const VERSION = '2026101101';
const root = document.documentElement;
const mq = (q) => window.matchMedia(q).matches;
const REDUCE = mq('(prefers-reduced-motion: reduce)');
const SMALL = mq('(max-width: 820px)') || mq('(hover: none) and (pointer: coarse)');
const FULL = !REDUCE && !SMALL && hasWebGL();
root.classList.add(FULL ? 'x-full' : 'x-lite');
if (REDUCE) root.classList.add('x-reduce');

const N = SERVICES.length;
const SVC_RE = /^\/services\/([a-z0-9-]+)\/?(?:index\.html)?$/;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const main = document.getElementById('main');

let scene = null;
let lenis = null;
let gsapReady = null;
let routerReady = false;
let busy = false;
let pageCleanup = [];
let ring = null;

const homeEl = document.querySelector('.page-home');
const heroEl = homeEl?.querySelector('.x-hero') || null;
let current = homeEl
  ? { type: 'home', el: homeEl }
  : { type: 'service', el: document.querySelector('.page-service'), slug: document.querySelector('.page-service')?.dataset.slug };
const homeMeta = homeEl ? readMeta(document) : null;

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.append(s);
  });
}

// ---------------------------------------------------------------------------
// Header: shadow on scroll, language menu, full-screen menu
// ---------------------------------------------------------------------------
const header = document.querySelector('.x-header');
const onScroll = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
  if (scene && current.type === 'home') scene.setScroll(window.scrollY);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

function initLangMenu() {
  const btn = document.querySelector('[data-lang-toggle]');
  const menu = document.getElementById('lang-menu');
  if (!btn || !menu) return;
  const set = (open) => {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    set(menu.hidden);
  });
  document.addEventListener('click', (e) => { if (!menu.hidden && !menu.contains(e.target)) set(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); }
  });
}

function initMenu() {
  const openBtn = document.querySelector('[data-menu-open]');
  const menu = document.getElementById('x-menu');
  if (!openBtn || !menu) return;
  const closeBtn = menu.querySelector('[data-menu-close]');
  const focusables = () => [...menu.querySelectorAll('a[href], button')];
  let lastFocus = null;
  const onKey = (e) => {
    if (e.key === 'Escape') return close();
    if (e.key !== 'Tab') return;
    const f = focusables();
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  };
  function open() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    lenis?.stop();
    document.addEventListener('keydown', onKey);
    closeBtn.focus();
  }
  function close({ restore = true } = {}) {
    if (menu.hidden) return;
    menu.hidden = true;
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    lenis?.start();
    document.removeEventListener('keydown', onKey);
    if (restore) (lastFocus || openBtn).focus();
  }
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', () => close());
  menu.addEventListener('click', (e) => { if (e.target.closest('a[href]')) close({ restore: false }); });
}

// ---------------------------------------------------------------------------
// Home carousel (static images in the light version; drives the 3D ring on desktop)
// ---------------------------------------------------------------------------
function initRing(hero) {
  const ringEl = hero.querySelector('.x-ring');
  const items = [...hero.querySelectorAll('.x-ring-item')];
  const ui = hero.querySelector('.x-ring-ui');
  const link = ui.querySelector('.x-ring-link');
  const num = ui.querySelector('.x-ring-num');
  const name = ui.querySelector('.x-ring-name');
  let index = 0;
  let timer = 0;
  let paused = false;
  let swapT = 0;

  function label(i) {
    const s = SERVICES[i];
    link.href = servicePath(s.slug);
    link.setAttribute('aria-label', `${s.name} — découvrir ce service`);
    clearTimeout(swapT);
    if (REDUCE) {
      num.textContent = `${String(i + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
      name.textContent = s.name;
      return;
    }
    ui.classList.add('is-swapping');
    swapT = setTimeout(() => {
      num.textContent = `${String(i + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
      name.textContent = s.name;
      ui.classList.remove('is-swapping');
    }, 200);
  }
  function slots(i) {
    items.forEach((el, k) => {
      let d = (((k - i) % N) + N) % N;
      if (d > N / 2) d -= N;
      el.dataset.slot = String(d);
    });
  }
  function go(i) {
    index = (i + N) % N;
    if (scene) { scene.ringTo(index); return; }
    label(index);
    if (REDUCE) { slots(index); return; }
    ringEl.classList.add('is-fading');
    setTimeout(() => {
      slots(index);
      ringEl.classList.remove('is-fading');
    }, 320);
  }
  ui.querySelector('[data-ring-prev]').addEventListener('click', () => go(index - 1));
  ui.querySelector('[data-ring-next]').addEventListener('click', () => go(index + 1));
  // keep the label steady while someone is reading or tabbing through it
  ui.addEventListener('pointerenter', () => { paused = true; scene?.holdAuto(60000); });
  ui.addEventListener('pointerleave', () => { paused = false; scene?.holdAuto(1500); });
  ui.addEventListener('focusin', () => { paused = true; scene?.holdAuto(60000); });
  ui.addEventListener('focusout', () => { paused = false; scene?.holdAuto(1500); });

  // light version: slow auto-advance and swipe
  if (!REDUCE) {
    timer = setInterval(() => {
      if (!scene && !paused && !document.hidden && window.scrollY < window.innerHeight) go(index + 1);
    }, 5200);
  }
  let sx = null;
  hero.addEventListener('pointerdown', (e) => { if (!scene && !e.target.closest('a, button')) sx = e.clientX; });
  hero.addEventListener('pointerup', (e) => {
    if (scene || sx === null) return;
    const dx = e.clientX - sx;
    sx = null;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
  });

  slots(0);
  return {
    get index() { return index; },
    attachScene() { clearInterval(timer); },
    frontChanged(i) { index = i; label(i); },
  };
}

// ---------------------------------------------------------------------------
// Scroll effects
// ---------------------------------------------------------------------------
function fades(scope) {
  const els = scope.querySelectorAll('.x-fade');
  if (REDUCE || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  els.forEach((el) => io.observe(el));
  pageCleanup.push(() => io.disconnect());
}

function watchActive(el) {
  if (!scene || !el) return;
  const io = new IntersectionObserver(([en]) => scene.setActive(en.isIntersecting), { rootMargin: '0px 0px 0px 0px' });
  io.observe(el);
  pageCleanup.push(() => io.disconnect());
}

async function initHomePage() {
  fades(homeEl);
  if (scene) {
    scene.setDisc(heroEl.querySelector('.x-disc-body'));
    scene.setScroll(window.scrollY);
    watchActive(heroEl);
  }
}

async function initServicePage(el) {
  fades(el);
  const hero = el.querySelector('.s-hero');
  const move = el.querySelector('.s-move');
  const gallery = el.querySelector('.s-gallery');
  const strip = el.querySelector('.s-strip');
  if (REDUCE) return;
  const ok = await gsapReady;
  if (!ok || !el.isConnected) return;
  const { gsap, ScrollTrigger } = window;
  const triggers = [];
  // Create triggers top to bottom: the pin's spacing shifts everything below it.
  if (scene && hero) {
    // Pinned for one screen: the object rises and tilts in front of the headline, which moves up.
    // After the pin, the object leaves with the page.
    const head = gsap.to(move, { yPercent: -55, ease: 'none', paused: true });
    let pin = null;
    const sync = () => {
      if (!pin) return;
      const exit = Math.max(0, window.scrollY - pin.end);
      scene.setServiceProgress(pin.progress, Math.min(exit, window.innerHeight * 1.5));
    };
    pin = ScrollTrigger.create({ trigger: hero, start: 'top top', end: '+=100%', pin: true, scrub: true, animation: head, onUpdate: sync, onRefresh: sync });
    window.addEventListener('scroll', sync, { passive: true });
    pageCleanup.push(() => window.removeEventListener('scroll', sync));
    triggers.push(pin, head);
    sync();
    watchActive(hero);
  }
  if (strip && gallery) {
    const tw = gsap.fromTo(strip, { x: 0 }, {
      x: () => Math.min(0, window.innerWidth - strip.scrollWidth),
      ease: 'none',
      scrollTrigger: { trigger: gallery, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
    triggers.push(tw.scrollTrigger, tw);
  }
  ScrollTrigger.refresh();
  pageCleanup.push(() => triggers.forEach((t) => t && t.kill && t.kill()));
}

function runCleanup() {
  pageCleanup.forEach((fn) => { try { fn(); } catch {} });
  pageCleanup = [];
}

function loadGsap() {
  if (REDUCE) return Promise.resolve(false);
  return Promise.all([
    loadScript(`/vendor/gsap.min.js?v=${VERSION}`).then(() => loadScript(`/vendor/ScrollTrigger.min.js?v=${VERSION}`)),
    FULL ? loadScript(`/vendor/lenis.min.js?v=${VERSION}`) : Promise.resolve(),
  ]).then(() => {
    const { gsap, ScrollTrigger, Lenis } = window;
    gsap.registerPlugin(ScrollTrigger);
    if (FULL && Lenis) {
      lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    return true;
  }).catch(() => false);
}

// ---------------------------------------------------------------------------
// Router (desktop 3D only): swaps pages without reloading so the canvas persists
// ---------------------------------------------------------------------------
function readMeta(doc) {
  return {
    title: doc.title,
    desc: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
  };
}
function applyMeta(m) {
  document.title = m.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', m.desc);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', m.canonical);
}

const pages = new Map();
function loadPage(path) {
  if (!pages.has(path)) {
    pages.set(path, fetch(path, { credentials: 'same-origin' })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.text(); })
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const page = doc.querySelector('.page-service');
        if (!page) throw new Error('no page');
        return { ...readMeta(doc), page };
      })
      .catch((err) => { pages.delete(path); throw err; }));
  }
  return pages.get(path);
}

function focusHeading(el) {
  const h = el.querySelector('h1');
  if (!h) return;
  h.setAttribute('tabindex', '-1');
  h.focus({ preventScroll: true });
}

function scrollToY(y) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  window.scrollTo(0, y);
}

function scrollToHash(hash) {
  const target = hash && document.querySelector(hash);
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { offset: -72 });
  else target.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth' });
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

async function goService(path, slug, push) {
  if (busy || (current.type === 'service' && current.slug === slug)) return;
  busy = true;
  const data = loadPage(path);
  const from = current;
  if (push) history.pushState({ x3d: 1 }, '', path);
  if (from.type === 'home') {
    if (window.scrollY > 4) {
      from.el.style.transition = 'opacity .3s';
      from.el.style.opacity = '0';
      await wait(300);
      scrollToY(0);
      scene.setScroll(0);
    }
    heroEl.classList.add('is-leaving');
    scene.setMode('service', { slug });
    await wait(700);
  } else {
    scene.setMode('service', { slug });
    from.el.style.transition = 'opacity .35s';
    from.el.style.opacity = '0';
    await wait(380);
  }
  let d;
  try { d = await data; } catch { location.href = path; return; }
  runCleanup();
  if (from.type === 'home') {
    homeEl.hidden = true;
    homeEl.style.opacity = '';
    heroEl.classList.remove('is-leaving');
  } else {
    from.el.remove();
  }
  const el = d.page.cloneNode(true);
  el.classList.add('x-page-enter');
  main.append(el);
  scrollToY(0);
  applyMeta(d);
  current = { type: 'service', el, slug };
  setTimeout(() => el.classList.remove('x-page-enter'), 1500);
  await initServicePage(el);
  focusHeading(el);
  busy = false;
}

async function goHome(hash, push) {
  if (busy || !homeEl) return;
  busy = true;
  if (push) history.pushState({ x3d: 1 }, '', `/${hash || ''}`);
  const from = current;
  from.el.style.transition = 'opacity .3s';
  from.el.style.opacity = '0';
  await wait(320);
  runCleanup();
  from.el.remove();
  homeEl.hidden = false;
  homeEl.classList.add('x-page-enter');
  setTimeout(() => homeEl.classList.remove('x-page-enter'), 1500);
  applyMeta(homeMeta);
  current = { type: 'home', el: homeEl };
  scrollToY(0);
  scene.setMode('home');
  await initHomePage();
  window.gsap && window.ScrollTrigger?.refresh();
  if (hash) { await wait(450); scrollToHash(hash); } else focusHeading(homeEl);
  busy = false;
}

function initRouter() {
  history.replaceState({ x3d: 1 }, '');
  document.addEventListener('click', (e) => {
    if (!routerReady || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    const m = url.pathname.match(SVC_RE);
    if (m) { e.preventDefault(); goService(`/services/${m[1]}/`, m[1], true); return; }
    if (url.pathname === '/' && homeEl) {
      if (current.type === 'service') { e.preventDefault(); goHome(url.hash, true); }
      else if (url.hash) { e.preventDefault(); history.pushState({ x3d: 1 }, '', url.hash); scrollToHash(url.hash); }
      else { e.preventDefault(); lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' }); }
    }
  });
  window.addEventListener('popstate', () => {
    if (!routerReady) return;
    const m = location.pathname.match(SVC_RE);
    if (m) goService(`/services/${m[1]}/`, m[1], false);
    else if (location.pathname === '/' && homeEl) {
      if (current.type === 'service') goHome(location.hash, false);
      else if (location.hash) scrollToHash(location.hash);
    } else location.reload();
  });
  // warm the cache when a service link is about to be used
  document.addEventListener('pointerover', (e) => {
    const a = e.target.closest?.('a[href^="/services/"]');
    const m = a && new URL(a.href).pathname.match(SVC_RE);
    if (m && routerReady) loadPage(`/services/${m[1]}/`).catch(() => {});
  });
}

// ---------------------------------------------------------------------------
// 3D scene (lazy)
// ---------------------------------------------------------------------------
async function loadScene() {
  const { createScene } = await import(`./scene.js?v=${VERSION}`);
  const canvas = document.createElement('canvas');
  canvas.className = 'x-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  scene = createScene({
    canvas,
    services: SERVICES,
    onFrontChange: (i) => ring?.frontChanged(i),
    onSelect: (i) => goService(servicePath(SERVICES[i].slug), SERVICES[i].slug, true),
  });
  if (current.type === 'home') {
    scene.bindPointer(heroEl);
    ring.attachScene();
    scene.ringTo(ring.index, { instant: true });
    await initHomePage();
  } else {
    scene.setMode('service', { slug: current.slug, instant: true });
    runCleanup();
    await initServicePage(current.el);
  }
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('x-3d-on')));
  routerReady = true;
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
initLangMenu();
initMenu();
if (heroEl) ring = initRing(heroEl);
gsapReady = loadGsap();
if (current.type === 'home') initHomePage();
else if (current.el) initServicePage(current.el);

if (FULL) {
  initRouter();
  const start = () => loadScene().catch((err) => {
    console.warn('3D scene unavailable, using the light version.', err);
    root.classList.replace('x-full', 'x-lite');
  });
  if (document.readyState === 'complete') (window.requestIdleCallback || setTimeout)(start, { timeout: 1200 });
  else window.addEventListener('load', () => (window.requestIdleCallback || setTimeout)(start, { timeout: 1200 }), { once: true });
}
