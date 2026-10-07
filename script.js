// ===== Site settings — edit these =====
const CONFIG = {
  // The email address that receives project inquiries.
  contactEmail: "contact@abachedev.com",
  // Optional: paste a Formspree endpoint (https://formspree.io/f/xxxx) to receive
  // form submissions directly in your inbox. Leave empty to open the visitor's
  // email app with the message pre-filled instead.
  formEndpoint: "",
  // Your WhatsApp number in international format, digits only — no "+", spaces
  // or leading zeros (e.g. "212612345678" for +212 6 12 34 56 78).
  // While empty, the WhatsApp buttons take visitors to the contact form instead.
  whatsappNumber: "212677047171",
};

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Contact email link
const emailLink = document.getElementById("contact-email-link");
emailLink.textContent = CONFIG.contactEmail;
emailLink.href = `mailto:${CONFIG.contactEmail}`;

// Mobile navigation
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Pricing buttons pre-select the package in the contact form
const packageSelect = document.getElementById("package");
document.querySelectorAll("[data-package]").forEach((btn) =>
  btn.addEventListener("click", () => {
    packageSelect.value = btn.dataset.package;
  })
);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Scroll progress bar + header shadow
const progress = document.querySelector(".scroll-progress");
const header = document.querySelector(".site-header");
let scrollTicking = false;
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  header.classList.toggle("scrolled", window.scrollY > 10);
  scrollTicking = false;
}
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(onScroll);
  }
}, { passive: true });
onScroll();

// Rotating headline word
const rotatorWord = document.getElementById("rotator-word");
const words = ["customers.", "clients.", "sales.", "attention.", "growth."];
let wordIndex = 0;
if (!reduceMotion) {
  setInterval(() => {
    rotatorWord.classList.add("out");
    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      rotatorWord.textContent = words[wordIndex];
      rotatorWord.classList.remove("out");
      rotatorWord.classList.add("in");
      void rotatorWord.offsetWidth; // restart transition from the "in" position
      rotatorWord.classList.remove("in");
    }, 350);
  }, 2600);
}

// Hero: 3D tilt on the mockup and a cursor spotlight
const hero = document.querySelector(".hero");
const tilt = document.getElementById("tilt");
const finePointer = window.matchMedia("(pointer: fine)").matches;
if (finePointer && !reduceMotion) {
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    hero.style.setProperty("--mx", `${x * 100}%`);
    hero.style.setProperty("--my", `${y * 100}%`);
    tilt.style.transform = `rotateY(${(x - 0.5) * 14}deg) rotateX(${(0.5 - y) * 10}deg)`;
  });
  hero.addEventListener("pointerleave", () => {
    tilt.style.transform = "";
  });
}

// Hero: animated particle network background
(function particles() {
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas.getContext("2d");
  const mouse = { x: -9999, y: -9999 };
  let w, h, dpr, dots = [], running = false, visible = true;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(70, (w * h) / 16000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.8,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const link = 130;
    for (let i = 0; i < dots.length; i++) {
      const a = dots[i];
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;

      // gently push dots away from the cursor
      const mdx = a.x - mouse.x, mdy = a.y - mouse.y;
      const md = Math.hypot(mdx, mdy);
      if (md < 120 && md > 0) {
        a.x += (mdx / md) * 1.2;
        a.y += (mdy / md) * 1.2;
      }

      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(99, 102, 241, 0.55)";
      ctx.fill();

      for (let j = i + 1; j < dots.length; j++) {
        const b = dots[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.18 * (1 - d / link)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    if (running) requestAnimationFrame(draw);
  }

  function start() {
    if (!running && visible && !document.hidden) {
      running = true;
      requestAnimationFrame(draw);
    }
  }
  function stop() { running = false; }

  resize();
  if (reduceMotion) { draw(); return; }
  start();

  window.addEventListener("resize", resize);
  hero.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    }).observe(hero);
  }
})();

// Reveal-on-scroll animation
const revealEls = document.querySelectorAll(".card, .steps li, .work-card, .price-card, .faq details, .section-head");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add("visible");
          io.unobserve(el);
          // drop the stagger delay once revealed so hover effects respond instantly
          setTimeout(() => (el.style.transitionDelay = ""), 1100);
        }
      }),
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => {
    el.classList.add("reveal");
    // stagger siblings in the same grid
    const index = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.transitionDelay = `${Math.min(index, 5) * 80}ms`;
    io.observe(el);
  });
}

// Contact form
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

function setStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = `form-status ${type || ""}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fields = ["name", "email", "message"].map((id) => document.getElementById(id));
  let valid = true;
  fields.forEach((f) => {
    const ok = f.value.trim() !== "" && f.checkValidity();
    f.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    setStatus("Please fill in your name, a valid email and a message.", "err");
    return;
  }

  const data = Object.fromEntries(new FormData(form));

  if (CONFIG.formEndpoint) {
    setStatus("Sending…");
    try {
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(res.statusText);
      form.reset();
      setStatus("Thanks! Your message was sent — I'll reply within 24 hours.", "ok");
    } catch {
      setStatus(`Something went wrong. Please email me at ${CONFIG.contactEmail}.`, "err");
    }
    return;
  }

  const subject = `Website project inquiry — ${data.package}`;
  const body = `Name: ${data.name}\nEmail: ${data.email}\nPackage: ${data.package}\n\n${data.message}`;
  window.location.href = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  setStatus("Opening your email app to send the message…", "ok");
});

// WhatsApp chat widget
(function whatsapp() {
  const wa = document.getElementById("wa");
  const toggleBtn = document.getElementById("wa-toggle");
  const panel = document.getElementById("wa-panel");
  const input = document.getElementById("wa-text");
  const defaultMsg = "Hi AbacheDev! I'm interested in a website.";

  function openChat(message) {
    const text = encodeURIComponent((message || "").trim() || defaultMsg);
    if (CONFIG.whatsappNumber) {
      window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${text}`, "_blank", "noopener");
    } else {
      // No number configured yet: fall back to the contact form
      setOpen(false);
      document.getElementById("message").value = decodeURIComponent(text);
      document.getElementById("contact").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  }

  function setOpen(open) {
    wa.classList.toggle("open", open);
    panel.hidden = !open;
    toggleBtn.setAttribute("aria-expanded", String(open));
    toggleBtn.setAttribute("aria-label", open ? "Close WhatsApp chat" : "Chat on WhatsApp");
    if (open) {
      wa.classList.add("seen");
      wa.classList.remove("hint");
      try { sessionStorage.setItem("wa-seen", "1"); } catch {}
      if (finePointer) setTimeout(() => input.focus(), 50);
    }
  }

  toggleBtn.addEventListener("click", () => setOpen(panel.hidden));
  document.getElementById("wa-close").addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) {
      setOpen(false);
      toggleBtn.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (!panel.hidden && !wa.contains(e.target)) setOpen(false);
  });

  document.querySelectorAll("#wa-quick button").forEach((btn) =>
    btn.addEventListener("click", () => openChat(btn.dataset.msg))
  );
  document.getElementById("wa-form").addEventListener("submit", (e) => {
    e.preventDefault();
    openChat(input.value);
    input.value = "";
  });
  document.querySelectorAll(".wa-link").forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    })
  );

  // Gently point out the button once per visit
  let seen = false;
  try { seen = sessionStorage.getItem("wa-seen") === "1"; } catch {}
  if (seen) {
    wa.classList.add("seen");
  } else {
    setTimeout(() => {
      if (panel.hidden) wa.classList.add("hint");
      setTimeout(() => wa.classList.remove("hint"), 4000);
    }, 4000);
  }
})();
