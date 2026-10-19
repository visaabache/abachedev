// AbacheDev "depth": every homepage section in 3D.
// - Sections and their cards fly in from depth as they enter the screen (3 alternating styles).
// - Desktop: each section tilts slightly with the scroll, like pages turning in space.
// - Fine pointers: cards tilt toward the pointer with a soft glare.
// - The workspace photo in "process" straightens with the scroll, its labels floating at different depths.
// Reduced motion: nothing moves. Everything added here is removed by the returned cleanup function.

const CARDS = '.svc-card, .steps > li, .why-list > li, .x-client > a, .work-card, .price-card';
const ITEMS = `.section-head, .why-copy, .x-desk, ${CARDS}, .faq details, #contact .container > *`;
const STYLES = ['d3-rise', 'd3-zoom', 'd3-swing'];

export function initDepth(root, { full = false, reduce = false } = {}) {
  if (reduce || !root || !('IntersectionObserver' in window)) return () => {};
  const off = [];
  const secs = [...root.querySelectorAll('.section')].filter((s) => !s.classList.contains('x-reviews'));

  // 1. entrance from depth, staggered inside each section
  const items = [];
  secs.forEach((sec, k) => {
    sec.classList.add('d3-sec', STYLES[k % STYLES.length]);
    let i = 0;
    sec.querySelectorAll(ITEMS).forEach((el) => {
      if (el.classList.contains('d3-in')) return; // matched twice (a card inside #contact)
      el.classList.add('d3-in');
      el.style.setProperty('--d3i', Math.min(i++, 7));
      items.push(el);
    });
  });
  const timers = [];
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    io.unobserve(el);
    el.classList.add('d3-on');
    // once in place, hand the element back to its normal hover styles
    const delay = 1300 + (Number(el.style.getPropertyValue('--d3i')) || 0) * 90;
    timers.push(setTimeout(() => { el.classList.remove('d3-in', 'd3-on'); el.style.removeProperty('--d3i'); }, delay));
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach((el) => io.observe(el));
  off.push(() => {
    io.disconnect();
    timers.forEach(clearTimeout);
    items.forEach((el) => { el.classList.remove('d3-in', 'd3-on'); el.style.removeProperty('--d3i'); });
    secs.forEach((sec) => { sec.classList.remove('d3-sec', ...STYLES); sec.style.removeProperty('--d3p'); });
  });

  // 2. scroll: sections tilt as they pass (desktop), the workspace photo straightens (all screens)
  const desk = root.querySelector('.x-desk');
  let raf = 0;
  const frame = () => {
    raf = 0;
    const vh = window.innerHeight;
    if (full) {
      secs.forEach((sec) => {
        const r = sec.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) return;
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh * 0.85 + r.height / 2)));
        sec.style.setProperty('--d3p', p.toFixed(3));
      });
    }
    if (desk) {
      const r = desk.getBoundingClientRect();
      const t = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.75)));
      desk.style.setProperty('--t', t.toFixed(3));
    }
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if (desk) desk.style.setProperty('--t', '0');
  frame();
  off.push(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    cancelAnimationFrame(raf);
    desk?.style.removeProperty('--t');
  });

  // 3. pointer: cards tilt with a glare, the workspace follows the pointer
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cards = [...root.querySelectorAll(CARDS)];
    const move = (e) => {
      const el = e.currentTarget;
      if (el.classList.contains('d3-in')) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      const scale = el.classList.contains('featured') && window.innerWidth > 900 ? ' scale(1.03)' : '';
      el.style.transform = `perspective(900px) rotateX(${((0.5 - y) * 10).toFixed(2)}deg) rotateY(${((x - 0.5) * 12).toFixed(2)}deg) translate3d(0, -6px, 0)${scale}`;
    };
    const leave = (e) => { e.currentTarget.style.transform = ''; };
    cards.forEach((el) => {
      el.classList.add('d3-tilt');
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
    });
    const deskMove = (e) => {
      const r = desk.getBoundingClientRect();
      desk.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
      desk.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * -2).toFixed(3));
    };
    const deskLeave = () => { desk.style.setProperty('--px', '0'); desk.style.setProperty('--py', '0'); };
    desk?.addEventListener('pointermove', deskMove);
    desk?.addEventListener('pointerleave', deskLeave);
    off.push(() => {
      cards.forEach((el) => {
        el.classList.remove('d3-tilt');
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
        el.style.transform = '';
      });
      desk?.removeEventListener('pointermove', deskMove);
      desk?.removeEventListener('pointerleave', deskLeave);
    });
  }

  return () => off.forEach((fn) => { try { fn(); } catch {} });
}
