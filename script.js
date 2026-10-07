// ===== Site settings — edit these =====
const CONFIG = {
  // The email address that receives project inquiries.
  contactEmail: "your-email@example.com",
  // Optional: paste a Formspree endpoint (https://formspree.io/f/xxxx) to receive
  // form submissions directly in your inbox. Leave empty to open the visitor's
  // email app with the message pre-filled instead.
  formEndpoint: "",
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

// Reveal-on-scroll animation
const revealEls = document.querySelectorAll(".card, .steps li, .work-card, .price-card, .faq details, .section-head");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => {
    el.classList.add("reveal");
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
