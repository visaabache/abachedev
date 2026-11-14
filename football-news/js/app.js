/* KoraPulse — builds the shared header/footer and each page from js/data.js. */
(function () {
  const D = window.KP;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const params = new URLSearchParams(location.search);
  const page = document.body.dataset.page;

  const preview = params.get("preview") === "1";
  const catBySlug = Object.fromEntries(D.categories.map((c) => [c.slug, c]));
  D.articles.forEach((a) => { a.tags = a.tags || []; if (!catBySlug[a.cat]) catBySlug[a.cat] = { slug: a.cat, name: a.cat, subs: [] }; });
  const articles = D.articles.filter((a) => (a.status || "publish") === "publish").sort((a, b) => b.date.localeCompare(a.date));
  const byId = Object.fromEntries(articles.map((a) => [a.id, a]));
  const comments = D.comments || [];
  const ccount = (id) => comments.filter((c) => c.post === id && c.status === "approved").length;

  // Light formatting written in the admin editor: **bold**, *italic*, [link](url),
  // "## " headings, "> " quotes and ![caption](image) on their own line.
  const safeUrl = (u) => (/^(https?:|data:image\/|\/|\.|#|[\w-]+(\/|\.))/i.test(u) && !/^javascript:/i.test(u) ? u : "#");
  const inline = (t) => esc(t)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, (m, txt, u) => `<a href="${safeUrl(u.replace(/&amp;/g, "&"))}" target="_blank" rel="noopener">${txt}</a>`);
  const block = (p) => {
    const img = p.match(/^!\[(.*?)\]\((.+?)\)$/);
    if (img) return `<figure><img src="${esc(safeUrl(src(img[2])))}" alt="${esc(img[1])}" loading="lazy">${img[1] ? `<figcaption>${esc(img[1])}</figcaption>` : ""}</figure>`;
    if (p.startsWith("## ")) return `<h2>${inline(p.slice(3))}</h2>`;
    if (p.startsWith("> ")) return `<blockquote>${inline(p.slice(2))}</blockquote>`;
    return `<p>${inline(p)}</p>`;
  };

  const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();
  const url = (a) => `article.html?id=${encodeURIComponent(a.id)}`;
  const catUrl = (slug, tag) => `category.html?c=${slug}` + (tag ? `&t=${encodeURIComponent(tag)}` : "");
  const readTime = (a) => Math.max(1, Math.round((a.body || []).join(" ").split(/\s+/).length / 200));

  // ---------- icons ----------
  const icon = {
    search: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    clock: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    chat: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
    chev: '<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>',
    up: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 15l6-6 6 6"/></svg>',
    menu: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    user: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M7 10V7a5 5 0 0110 0v3h1a1 1 0 011 1v9a1 1 0 01-1 1H6a1 1 0 01-1-1v-9a1 1 0 011-1zm2 0h6V7a3 3 0 00-6 0z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.5V11H7v4h3v7h4v-7h3l1-4h-4V8.8c0-.5.3-.8 1-.8z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor"><path d="M22 8.2a3 3 0 00-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 002 8.2 31 31 0 001.6 12 31 31 0 002 15.8a3 3 0 002.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 002.1-2.1 31 31 0 00.4-3.8 31 31 0 00-.4-3.8zM10 15V9l5.2 3z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M16.6 3c.4 2.2 1.8 3.6 4 3.8v3.1a7.4 7.4 0 01-4-1.2V15a6 6 0 11-6-6v3.2a2.8 2.8 0 102.8 2.8V3z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M4 9h3.5v11H4zM5.8 3.5a2 2 0 110 4 2 2 0 010-4zM10 9h3.3v1.5c.5-.9 1.7-1.8 3.4-1.8 3.6 0 4.3 2.3 4.3 5.4V20h-3.5v-5.2c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20H10z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15l-1.4 5 5.1-1.3A10 10 0 1012 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.1.1.7-.1 1.3z"/></svg>',
    link: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/></svg>'
  };

  const logo = (cls = "") => `
    <a class="logo ${cls}" href="index.html" aria-label="${esc(D.site.name)} home">
      <svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" stroke-width="5"/>
        <path d="M5 34 H19 L24 22 L31 44 L37 28 L41 34 H59" fill="none" stroke="var(--accent)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="logo-text"><b>KORA</b><span>PULSE</span></span>
    </a>`;

  // ---------- media ----------
  const src = (u) => (u && u.startsWith("media:") ? ((D.media || []).find((m) => m.id === u.slice(6)) || {}).url || "" : u);
  const media = (a, cls = "") => `<div class="media ${cls}">${a.image && src(a.image) ? `<img src="${esc(src(a.image))}" alt="${esc(a.title)}" loading="lazy">` : window.coverArt(a)}</div>`;
  const tag = (a) => `<a class="tag" href="${catUrl(a.cat)}">${esc(catBySlug[a.cat].name)}</a>`;
  const meta = (a, opts = {}) => `
    <div class="meta">
      ${opts.noAuthor ? "" : `<span class="author">${esc(a.author)}</span>`}
      <span>${icon.clock} ${fmtDate(a.date)}</span>
      ${opts.noComments ? "" : `<span>${icon.chat} ${ccount(a.id)}</span>`}
    </div>`;

  // ---------- header ----------
  function renderHeader() {
    const nav = D.categories.map((c) => `
      <li class="${c.subs.length ? "has-sub" : ""}">
        <a href="${catUrl(c.slug)}">${esc(c.name)}${c.subs.length ? icon.chev : ""}</a>
        ${c.subs.length ? `<ul class="sub">${c.subs.map((s) => `<li><a href="${catUrl(c.slug, s)}">${esc(s)}</a></li>`).join("")}</ul>` : ""}
      </li>`).join("");

    $("#site-header").innerHTML = `
      <a class="skip" href="#main">Skip to content</a>
      <div class="topbar">
        <div class="container topbar-in">
          <a href="#scores" class="tb-live"><span class="dot"></span> Live Scores</a>
          <nav class="tb-links" aria-label="Featured">${D.topLinks.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join("")}</nav>
          <a href="admin/" class="tb-login">${icon.user} Login</a>
        </div>
      </div>
      <header class="masthead">
        <div class="container">${logo("logo-lg")}<p class="tagline">${esc(D.site.tagline)}</p></div>
      </header>
      <div class="navbar" id="navbar">
        <div class="container navbar-in">
          <button class="icon-btn menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="mainmenu">${icon.menu}</button>
          ${logo("logo-sm")}
          <nav aria-label="Main"><ul class="menu" id="mainmenu">${nav}</ul></nav>
          <div class="nav-tools">
            <button class="theme-toggle" aria-label="Toggle dark mode"><span class="knob"></span></button>
            <button class="icon-btn search-btn" aria-label="Search">${icon.search}</button>
          </div>
        </div>
        <div class="ticker" id="scores" aria-label="Live scores" ${D.scores.length ? "" : "hidden"}>
          <span class="ticker-label">SCORES</span>
          <div class="ticker-track"><div class="ticker-row">${tickerItems()}${tickerItems(true)}</div></div>
        </div>
      </div>
      <div class="search-overlay" hidden>
        <form class="search-box" action="category.html" role="search">
          <input type="search" name="q" placeholder="Search players, clubs, competitions…" aria-label="Search" autocomplete="off">
          <button type="submit" class="icon-btn">${icon.search}</button>
          <button type="button" class="icon-btn search-close" aria-label="Close search">${icon.close}</button>
        </form>
      </div>`;
  }

  function tickerItems(dup) {
    return D.scores.map((m) => {
      const live = /LIVE/.test(m.status);
      const score = m.hs == null ? `<span class="ko">${esc(m.status)}</span>` : `<b>${m.hs}</b><i>-</i><b>${m.as}</b>`;
      return `<div class="match ${live ? "is-live" : ""}" ${dup ? 'aria-hidden="true"' : ""}>
        <span class="comp">${esc(m.comp)}</span>
        <span class="team">${esc(m.home)}</span>${score}<span class="team">${esc(m.away)}</span>
        ${m.hs != null ? `<span class="status">${esc(m.status)}</span>` : ""}
      </div>`;
    }).join("");
  }

  // ---------- footer ----------
  function renderFooter() {
    const s = D.site.social;
    $("#site-footer").innerHTML = `
      <footer class="footer">
        <div class="container footer-grid">
          <div>
            <h3>Useful links</h3>
            <ul><li><a href="#">About</a></li><li><a href="#">Contact</a></li><li><a href="#">Advertise</a></li><li><a href="#">Careers</a></li><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms of Use</a></li></ul>
          </div>
          <div>
            <h3>Topics</h3>
            <ul>${D.categories.slice(1, 7).map((c) => `<li><a href="${catUrl(c.slug)}">${esc(c.name)}</a></li>`).join("")}</ul>
          </div>
          <div>
            <h3>Competitions</h3>
            <ul><li><a href="${catUrl("botola")}">Botola Pro</a></li><li><a href="${catUrl("africa", "AFCON")}">AFCON</a></li><li><a href="${catUrl("africa", "CAF Champions League")}">CAF Champions League</a></li><li><a href="${catUrl("europe", "Champions League")}">UEFA Champions League</a></li><li><a href="${catUrl("world-cup-2030")}">World Cup 2030</a></li></ul>
          </div>
          <div class="footer-brand">
            ${logo("logo-footer")}
            <div class="socials">
              ${["instagram", "x", "linkedin", "facebook", "youtube", "tiktok"].map((k) => `<a href="${esc(s[k] || "#")}" aria-label="${k}">${icon[k]}</a>`).join("")}
            </div>
            <p class="app-title">Download our app</p>
            <div class="stores">
              <a href="#" class="store"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="#34d27b" d="M4 3l10 9-10 9z"/><path fill="#ffcb30" d="M14 12l3-3 4 2.3c.8.5.8 1 0 1.4L17 15z"/><path fill="#ff4b5c" d="M4 21l10-9 3 3-11 6.3c-.9.5-1.6.3-2-.3z"/><path fill="#3bb7ff" d="M4 3c.4-.6 1.1-.8 2-.3L17 9l-3 3z"/></svg><span><small>GET IT ON</small>Google Play</span></a>
              <a href="#" class="store"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.6a4.5 4.5 0 00-3.5-1.9c-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.8-3.2-.8A4.8 4.8 0 004 9.7c-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4a10 10 0 001.3-2.8 4.3 4.3 0 01-2.4-4.1zM14 5.4A4.4 4.4 0 0015 2a4.4 4.4 0 00-2.9 1.5A4.1 4.1 0 0011 6.8a3.7 3.7 0 003-1.4z"/></svg><span><small>Download on the</small>App Store</span></a>
            </div>
          </div>
        </div>
        <div class="container copyright">
          <p>Copyright ${new Date().getFullYear()} <b>${esc(D.site.name)}</b>. All rights reserved. ${esc(D.site.name)} is not responsible for the content of external sites.</p>
        </div>
      </footer>
      <button class="to-top" aria-label="Back to top">${icon.up}</button>`;
  }

  // ---------- shared blocks ----------
  const rowCard = (a) => `
    <article class="row-card">
      <a href="${url(a)}" class="row-media" tabindex="-1" aria-hidden="true">${media(a)}</a>
      <div>
        <h3 class="h-serif"><a href="${url(a)}">${esc(a.title)}</a></h3>
        ${meta(a)}
        <p class="excerpt">${esc(a.excerpt)}</p>
      </div>
    </article>`;

  const overlayCard = (a) => `
    <article class="ov-card">
      <a href="${url(a)}">
        ${media(a)}
        <span class="tag tag-abs">${esc(catBySlug[a.cat].name)}</span>
        <div class="ov-text"><h3 class="h-serif">${esc(a.title)}</h3><span class="ov-date">${icon.clock} ${fmtDate(a.date)}</span></div>
      </a>
    </article>`;

  const smallCard = (a) => `
    <article class="sm-card">
      <a href="${url(a)}" class="sm-media" tabindex="-1" aria-hidden="true">${media(a)}<span class="tag tag-abs">${esc(catBySlug[a.cat].name)}</span></a>
      <h4 class="h-serif"><a href="${url(a)}">${esc(a.title)}</a></h4>
      ${meta(a, { noComments: true, noAuthor: true })}
    </article>`;

  const ad = (size, label = "Advertisement") => `<div class="ad ad-${size}"><span>${label}</span><small>${size === "leader" ? "970 × 90" : size === "box" ? "300 × 250" : "728 × 90"}</small></div>`;

  function sidebar(excludeId) {
    const op = articles.filter((a) => a.cat === "opinion" && a.id !== excludeId);
    const [first, ...rest] = op;
    const popular = articles.filter((a) => a.id !== excludeId).slice().sort((a, b) => ccount(b.id) - ccount(a.id)).slice(0, 5);
    return `
      ${ad("box")}
      ${first ? `
      <section class="side-sec">
        <h2 class="sec-title"><a href="${catUrl("opinion")}">Opinion</a></h2>
        <article class="op-lead">
          <a href="${url(first)}" class="op-media" tabindex="-1" aria-hidden="true">${media(first)}<span class="tag tag-abs">Opinion</span></a>
          <h3 class="h-serif"><a href="${url(first)}">${esc(first.title)}</a></h3>
          ${meta(first, { noComments: true })}
          <p class="excerpt">${esc(first.excerpt)}</p>
          <a class="btn-outline" href="${url(first)}">Read more</a>
        </article>
        <div class="two-col">${rest.slice(0, 2).map(smallCard).join("")}</div>
      </section>` : ""}
      <section class="side-sec">
        <h2 class="sec-title"><a href="${catUrl("botola")}">${esc(D.standings.title)}</a></h2>
        <table class="table">
          <thead><tr><th>#</th><th class="l">Club</th><th>P</th><th>GD</th><th>Pts</th></tr></thead>
          <tbody>${D.standings.rows.map((r, i) => `<tr class="${i < 2 ? "top" : ""}"><td>${i + 1}</td><td class="l">${esc(r.club)}</td><td>${r.p}</td><td>${r.gd > 0 ? "+" + r.gd : r.gd}</td><td><b>${r.pts}</b></td></tr>`).join("")}</tbody>
        </table>
      </section>
      <section class="side-sec">
        <h2 class="sec-title">Most read</h2>
        <ol class="popular">${popular.map((a, i) => `<li><span class="num">${i + 1}</span><a href="${url(a)}">${esc(a.title)}</a></li>`).join("")}</ol>
      </section>
      <section class="side-sec newsletter">
        <h2>The Final Whistle</h2>
        <p>The day's football news in your inbox every evening. Free.</p>
        <form class="nl-form"><input type="email" required placeholder="Your email" aria-label="Your email"><button>Subscribe</button></form>
        <p class="nl-ok" hidden>Thanks! Check your inbox to confirm.</p>
      </section>`;
  }

  // ---------- pages ----------
  function renderHome() {
    const featured = articles.find((a) => a.featured) || articles[0];
    const latest = articles.filter((a) => a.id !== featured.id && a.cat !== "opinion").slice(0, 6);
    const sections = ["atlas-lions", "botola", "europe", "africa", "women", "transfers"].map((slug) => {
      const list = articles.filter((a) => a.cat === slug).slice(0, 3);
      if (!list.length) return "";
      return `
        <section class="cat-sec container">
          <h2 class="sec-title"><a href="${catUrl(slug)}">${esc(catBySlug[slug].name)}</a><a class="see-all" href="${catUrl(slug)}">See all →</a></h2>
          <div class="ov-grid">${list.map(overlayCard).join("")}</div>
        </section>`;
    });
    sections.splice(2, 0, `<div class="container">${ad("banner")}</div>`);

    $("#main").innerHTML = `
      <div class="container">${ad("leader")}</div>
      <div class="container layout">
        <div class="col-main">
          <article class="featured">
            <h1 class="h-serif"><a href="${url(featured)}">${esc(featured.title)}</a></h1>
            ${meta(featured)}
            <a href="${url(featured)}" class="feat-media" tabindex="-1" aria-hidden="true">${media(featured)}<span class="tag tag-abs">Headlines</span></a>
            <p class="excerpt">${esc(featured.excerpt)}</p>
          </article>
          <h2 class="sec-title">Latest news</h2>
          <div class="rows">${latest.map(rowCard).join("")}</div>
        </div>
        <aside class="col-side">${sidebar()}</aside>
      </div>
      ${sections.join("")}`;
  }

  function renderArticle() {
    const a = byId[params.get("id")] || (preview && D.articles.find((x) => x.id === params.get("id"))) || articles[0];
    const approved = comments.filter((c) => c.post === a.id && c.status === "approved").sort((x, y) => x.date.localeCompare(y.date));
    const cat = catBySlug[a.cat];
    document.title = `${a.title} | ${D.site.name}`;
    const related = articles.filter((x) => x.id !== a.id && x.cat === a.cat).concat(articles.filter((x) => x.id !== a.id && x.cat !== a.cat)).slice(0, 3);
    const share = encodeURIComponent(location.href), title = encodeURIComponent(a.title);

    $("#main").innerHTML = `
      <div class="container">${ad("leader")}</div>
      <div class="container layout">
        <article class="col-main article">
          <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> › <a href="${catUrl(a.cat)}">${esc(cat.name)}</a>${a.tags[0] ? ` › <a href="${catUrl(a.cat, a.tags[0])}">${esc(a.tags[0])}</a>` : ""}</nav>
          ${tag(a)}
          <h1 class="h-serif article-title">${esc(a.title)}</h1>
          <p class="standfirst">${esc(a.excerpt)}</p>
          <div class="article-meta">
            <span class="avatar">${esc(a.author.split(" ").map((w) => w[0]).join(""))}</span>
            <div><span class="author">By ${esc(a.author)}</span>${meta(a, { noAuthor: true })}</div>
            <span class="read">${readTime(a)} min read</span>
          </div>
          <figure class="article-media">${media(a)}${a.image && src(a.image) ? "" : `<figcaption>Illustration · ${esc(cat.name)}</figcaption>`}</figure>
          ${preview && a.status !== "publish" && a.status ? `<p class="preview-note">Preview: this ${esc(a.status === "trash" ? "trashed post" : "draft")} is not visible to visitors.</p>` : ""}
          <div class="article-body">${(a.body || []).map(block).join("")}</div>
          ${a.tags.length ? `<div class="tag-list">${a.tags.map((t) => `<a href="${catUrl(a.cat, t)}">#${esc(t)}</a>`).join("")}</div>` : ""}
          <div class="share">
            <span>Share</span>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${share}" target="_blank" rel="noopener" aria-label="Share on Facebook" class="sh-fb">${icon.facebook}</a>
            <a href="https://x.com/intent/post?url=${share}&text=${title}" target="_blank" rel="noopener" aria-label="Share on X" class="sh-x">${icon.x}</a>
            <a href="https://wa.me/?text=${title}%20${share}" target="_blank" rel="noopener" aria-label="Share on WhatsApp" class="sh-wa">${icon.whatsapp}</a>
            <button class="sh-copy" aria-label="Copy link">${icon.link}</button>
          </div>
          <section class="comments-box">
            <h2 class="sec-title">${approved.length} comment${approved.length === 1 ? "" : "s"}</h2>
            <ol class="comment-list">${approved.map((c) => `
              <li><span class="avatar">${esc(c.name.trim()[0] || "?")}</span><div><b>${esc(c.name)}</b>${c.admin ? ' <span class="staff">KoraPulse</span>' : ""}<time>${fmtDate(c.date.slice(0, 10))}</time><p>${esc(c.text)}</p></div></li>`).join("")}</ol>
            <form class="comment-form">
              <h3>Leave a comment</h3>
              <textarea name="text" required placeholder="Join the conversation…" aria-label="Comment" rows="4"></textarea>
              <div class="cf-row"><input name="name" required placeholder="Name *" aria-label="Name"><input name="email" type="email" placeholder="Email (not published)" aria-label="Email"></div>
              <button class="btn">Post comment</button>
            </form>
            <p class="cf-ok" hidden>Thanks! Your comment is awaiting moderation.</p>
          </section>
          <section>
            <h2 class="sec-title">Related</h2>
            <div class="ov-grid">${related.map(overlayCard).join("")}</div>
          </section>
        </article>
        <aside class="col-side">${sidebar(a.id)}</aside>
      </div>`;

    $(".sh-copy").addEventListener("click", (e) => {
      navigator.clipboard && navigator.clipboard.writeText(location.href);
      e.currentTarget.classList.add("done");
    });
  }

  function renderCategory() {
    const q = (params.get("q") || "").trim();
    const slug = params.get("c");
    const t = params.get("t");
    const cat = catBySlug[slug];
    let list, heading, subs = "";

    if (q) {
      const terms = q.toLowerCase().split(/\s+/);
      list = articles.filter((a) => {
        const hay = [a.title, a.excerpt, a.author, catBySlug[a.cat].name, ...(a.tags || []), ...(a.body || [])].join(" ").toLowerCase();
        return terms.every((w) => hay.includes(w));
      });
      heading = `Search results for “${esc(q)}”`;
      document.title = `Search: ${q} | ${D.site.name}`;
    } else if (cat) {
      list = articles.filter((a) => a.cat === slug && (!t || (a.tags || []).includes(t)));
      heading = esc(t ? `${cat.name}: ${t}` : cat.name);
      document.title = `${t || cat.name} | ${D.site.name}`;
      if (cat.subs.length) {
        subs = `<div class="chips"><a href="${catUrl(slug)}" class="${!t ? "on" : ""}">All</a>${cat.subs.map((s) => `<a href="${catUrl(slug, s)}" class="${t === s ? "on" : ""}">${esc(s)}</a>`).join("")}</div>`;
      }
    } else {
      list = articles;
      heading = "All news";
    }

    const PAGE = 6;
    let shown = PAGE;
    $("#main").innerHTML = `
      <div class="container">${ad("leader")}</div>
      <div class="container layout">
        <div class="col-main">
          <header class="cat-head">
            <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> › ${q ? "Search" : esc(cat ? cat.name : "News")}</nav>
            <h1 class="h-serif">${heading}</h1>
            <p class="count">${list.length} article${list.length === 1 ? "" : "s"}</p>
            ${subs}
          </header>
          ${q ? `<form class="inline-search" action="category.html" role="search"><input type="search" name="q" value="${esc(q)}" aria-label="Search"><button class="btn">Search</button></form>` : ""}
          <div class="rows" id="cat-rows"></div>
          ${list.length ? "" : `<p class="empty">No articles found. Try another search or <a href="index.html">go back to the homepage</a>.</p>`}
          <button class="btn btn-wide load-more" hidden>Load more</button>
        </div>
        <aside class="col-side">${sidebar()}</aside>
      </div>`;

    const rows = $("#cat-rows"), more = $(".load-more");
    const draw = () => {
      rows.innerHTML = list.slice(0, shown).map(rowCard).join("");
      more.hidden = shown >= list.length;
    };
    more.addEventListener("click", () => { shown += PAGE; draw(); });
    draw();
  }

  // ---------- behaviour ----------
  function wire() {
    // dark mode
    const root = document.documentElement;
    const tgl = $(".theme-toggle");
    const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    const sync = () => tgl.setAttribute("aria-pressed", isDark());
    sync();
    tgl.addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("kp-theme", next); } catch (e) {}
      sync();
    });

    // compact logo once the masthead scrolls away
    const nb = $("#navbar"), mast = $(".masthead");
    new IntersectionObserver(([e]) => nb.classList.toggle("is-stuck", !e.isIntersecting), { threshold: 0 }).observe(mast);

    // mobile menu
    const mb = $(".menu-btn"), menu = $("#mainmenu");
    mb.addEventListener("click", () => {
      menu.style.top = nb.getBoundingClientRect().bottom + "px";
      const open = menu.classList.toggle("open");
      mb.setAttribute("aria-expanded", open);
      mb.innerHTML = open ? icon.close : icon.menu;
      document.body.classList.toggle("no-scroll", open);
    });
    menu.querySelectorAll(".has-sub > a").forEach((a) => {
      a.addEventListener("click", (e) => {
        if (matchMedia("(max-width: 960px)").matches) {
          e.preventDefault();
          a.parentElement.classList.toggle("expanded");
        }
      });
    });

    // search
    const ov = $(".search-overlay"), input = $(".search-box input");
    const openS = () => { ov.hidden = false; requestAnimationFrame(() => ov.classList.add("show")); input.focus(); };
    const closeS = () => { ov.classList.remove("show"); setTimeout(() => (ov.hidden = true), 200); };
    $(".search-btn").addEventListener("click", openS);
    $(".search-close").addEventListener("click", closeS);
    ov.addEventListener("click", (e) => { if (e.target === ov) closeS(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !ov.hidden) closeS();
      if (e.key === "/" && ov.hidden && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); openS(); }
    });

    // back to top
    const top = $(".to-top");
    addEventListener("scroll", () => top.classList.toggle("show", scrollY > 700), { passive: true });
    top.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

    // newsletter (demo)
    document.querySelectorAll(".nl-form").forEach((f) => f.addEventListener("submit", (e) => {
      e.preventDefault();
      f.hidden = true;
      f.nextElementSibling.hidden = false;
    }));
    // comments go to moderation (Admin → Comments). Without a server they are kept in this browser.
    document.querySelectorAll(".comment-form").forEach((f) => f.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = params.get("id") || (articles[0] && articles[0].id);
      try {
        const data = JSON.parse(localStorage.getItem("kp-data") || "null") || JSON.parse(JSON.stringify(D));
        data.comments = data.comments || [];
        data.comments.push({ id: "c" + Date.now(), post: id, name: f.name.value.trim(), email: f.email.value.trim(), text: f.text.value.trim(), date: new Date().toISOString().slice(0, 19), status: "pending" });
        data.updated = new Date().toISOString();
        localStorage.setItem("kp-data", JSON.stringify(data));
      } catch (err) {}
      f.hidden = true;
      f.nextElementSibling.hidden = false;
    }));
  }

  renderHeader();
  if (page === "home") renderHome();
  else if (page === "article") renderArticle();
  else renderCategory();
  renderFooter();
  wire();
})();
