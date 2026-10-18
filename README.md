# AbacheDev — Website Creator Service

Live at **[abachedev.com](https://abachedev.com)** (Français) · **[/en/](https://abachedev.com/en/)** (English) · **[/ar/](https://abachedev.com/ar/)** (العربية) · Contact: **contact@abachedev.com**

A fast, responsive, single-page website for offering website design & development services.

## Sections
- **Hero**: animated background (drifting gradient glows, moving grid, interactive particle network), rotating headline word, 3D-tilting website mockup, cursor spotlight
- **Tech marquee**: scrolling strip of tools and platforms
- **Services**: design, development, e-commerce, SEO, redesigns, maintenance
- **Process**: the 4 steps from discovery to launch
- **Portfolio**: six full-page website design concepts (restaurant, shop, portfolio, local business, startup, blog). Hovering scrolls through the page; clicking opens it full size with a "Get a site like this" button. The designs live in `assets/work/`. Swap in screenshots of real client projects as you complete them (any tall image works).
- **Pricing**: Starter / Business / E-commerce packages
- **FAQ**
- **Contact**: a project inquiry form
- **WhatsApp button**: floating chat toggle with quick-message options that opens a WhatsApp chat with you

Plain HTML, CSS and JavaScript. No build step, no dependencies. Supports dark mode automatically, and turns animations off for visitors who've asked their device for reduced motion.

## Customize
1. **Email**: set to `contact@abachedev.com` in `CONFIG` in `script.js` (and in `index.html`).
2. **Contact form**: submissions go to Formspree (`formEndpoint` in `script.js`, currently `https://formspree.io/f/xyekwdae`), which forwards them to the email address set on that form in your Formspree account. Each message includes the name, email, package, message, the site language and page, with a subject like "Demande de projet de site web — Business". A hidden `_gotcha` field filters spam bots. If you empty `formEndpoint`, the form opens the visitor's email app instead.
   - **Phone / WhatsApp field:** visitors can leave a WhatsApp number, an email, or both (at least one is required). Moroccan numbers like 06 12 34 56 78 are converted to WhatsApp format (212612345678); Formspree and the Sheet get a `wa.me` link to reply in one click.
   - **Automatic thank-you email:** the Apps Script (`integrations/contact-to-sheet.gs`) emails visitors who left an email address a short thank-you in their language (FR/EN/AR) from your Gmail as "AbacheDev", with a WhatsApp button. It never repeats the visitor's message, sends at most one email per mailbox every 6 hours (Gmail "+tags" and dots count as the same mailbox) and at most 20 a day (`AUTO_REPLY_DAILY_LIMIT`); if an email fails the lead is still saved and the error shows in the Auto-reply column; set `AUTO_REPLY = false` to turn it off. The Sheet's "Auto-reply" column shows what happened for each lead.
   - **Google Sheet copy (optional):** every submission can also be saved as a row in the "AbacheDev — Leads" Google Sheet. In the Sheet, open Extensions → Apps Script, paste `integrations/contact-to-sheet.gs`, run `setup` once to grant access, then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone) and copy the `/exec` URL into `sheetEndpoint` in `script.js`. With both set, the email goes through Formspree and a copy lands in the Sheet; with only `sheetEndpoint`, the Sheet alone receives them.
3. **WhatsApp**: `whatsappNumber` in `CONFIG` in `script.js` is set to `212677047171` (+212 677-047171). Use international format, digits only.
4. **Prices & text**: edit `index.html`, `en/index.html` and `ar/index.html`. Prices are in Moroccan dirhams (about 10 MAD per US dollar): Starter 2 990, Business 6 990, E-commerce 12 990, maintenance from 490/month — shown as "DH" in French, "MAD" (with the approximate US$ price) in English and "درهم" in Arabic. When you change a price, update the price cards, the maintenance line, the first FAQ answer and the `"price"` values in the JSON-LD on all three pages, plus the price lines on the service pages (`services/`, `en/services/`, `ar/services/`).
5. **Colors**: change `--primary` and `--accent` at the top of `styles.css`.

## Logo
The `<A>` mark: an HTML anchor tag built around the "A" of Abache, with a blinking cyan text cursor as the crossbar.

| File | Use |
| --- | --- |
| `assets/logo-mark.svg` | Icon (scales to any size) |
| `assets/logo.svg` | Icon + wordmark |
| `assets/logo-512.png` | App icon (for social media, use the kit below) |
| `assets/logo-wide.png` | Email signatures, documents, banners (transparent background) |
| `assets/favicon.svg` | Browser tab icon |

### Social media kit (`assets/social/`)
Ready to upload, at each platform's recommended size. Text, logos and the URL sit inside the area every platform shows, clear of the spot the profile photo covers.

| File | Size | Use |
| --- | --- | --- |
| `profile-gradient.png` | 1080×1080 | **Main profile picture**: Instagram, Facebook, TikTok, X, YouTube, LinkedIn, WhatsApp Business (built for the circle crop) |
| `profile-dark.png` | 1080×1080 | Alternative profile picture (dark) |
| `profile-light.png` | 1080×1080 | Alternative profile picture (light) |
| `facebook-cover.png` | 1640×624 | Facebook page cover |
| `linkedin-company-cover.png` | 4200×700 | LinkedIn company page cover |
| `linkedin-personal-cover.png` | 1584×396 | LinkedIn personal profile background |
| `x-header.png` | 1500×500 | X (Twitter) header |
| `youtube-banner.png` | 2560×1440 | YouTube channel banner |
| `ig-highlight-*.jpg` | 1080×1920 | Instagram story highlight covers: Services, Réalisations, Méthode, Tarifs, FAQ, Contact, plus Avis for when you have client reviews to share. Post one as a story, add it to a highlight, then pick it as the highlight cover |

Ready-to-paste French bios for each platform are in `docs/social-bios-fr.md`. A month of ready-made Instagram/Facebook posts (images, captions, hashtags and schedule) is in `marketing/instagram-facebook/` (see its README); keep that folder out of the Cloudflare upload when you deploy. Use the same profile picture everywhere so people recognize you, and put your WhatsApp number and abachedev.com in each profile's bio or contact button (people can tap those; they can't tap a number in a cover image).

## 3D design (all three languages)
The French, English and Arabic homepages and their six service pages each use a scroll-driven 3D design.

- **Hero:** a dark disc low in the frame with the brand phrase turning around it, and one 3D object per service on a ring (auto-rotates, drag to spin, click the front object or use the arrows and the link under it).
- **Service pages** (`services/<slug>/index.html` in French, `en/services/<slug>/index.html` in English, `ar/services/<slug>/index.html` in Arabic): `design-site-web`, `developpement-web`, `boutique-en-ligne`, `referencement-seo`, `refonte-site-web`, `maintenance-site-web`. Clicking an object opens its page without reloading: the same object travels to the bottom of the screen, then rises and tilts in front of the big serif headline as you scroll. Below: a short paragraph, a sideways-scrolling strip of designs, "Ce qui est inclus" (what's included, who it's for, the price), "Autres services" and the footer. The language menu on a service page opens the same service in the other languages.
- **Existing sections** (services, method, portfolio, prices, FAQ, contact form) stay on the homepage, restyled in the three-colour palette: pale `#f4f3ef`, accent `#4f46e5` for text, deep `#1e1b4b` for large blocks.
- **Light version:** phones, touch screens and visitors who prefer reduced motion get still images of the same objects (`assets/3d/*.webp`) with simple fades, in the same layout. Every link and button is real HTML, so keyboards and screen readers work without the 3D layer.
- **Performance:** the 3D scene starts on the visitor's first mouse move, scroll or key press (or after 9 seconds), with its code downloaded in the background after the page loads. It renders at most at 2× pixel density (lower automatically on slow machines) and sleeps when it's off screen, behind the menu or paused. Lighthouse: 100 in all four categories on desktop for the homepage and a service page; on mobile, 97 (homepage) and 100 (service page) for performance and 100 for the rest. The Arabic and English pages score the same within a few points (96–100 for performance on mobile).
- **Carousel controls:** previous/next, a pause button (stops all motion), drag to spin, and an announcement for screen readers after each step.
- **Arabic:** right to left, with Amiri for the large headlines (Bodoni stays for Latin words such as the "abachedev" wordmark) and Cairo for the text. The carousel buttons keep a left-to-right layout so the arrows match the way the objects turn; everything else mirrors. The Arabic phrase around the disc is an image of pre-shaped letter outlines (`assets/disc-text-ar.svg`), because Safari on iPhone breaks the joins between Arabic letters in curved SVG text. To change the phrase, edit and run `tools/disc-text-ar.py`. Prices use a narrow no-break space ("2 990") so the digits stay together in right-to-left text.

| File | What it does |
| --- | --- |
| `x3d/x3d.css` | Styles for the new design |
| `x3d/app.js` | Carousel, page transitions, scroll effects, light version |
| `x3d/services.js` | The six services (French, English and Arabic names, page, 3D model, colours) |
| `x3d/src/scene.js`, `x3d/src/models.js` | 3D scene and device models (source) |
| `x3d/scene.js` | Built bundle of the scene + three.js (generated) |
| `vendor/` | GSAP, ScrollTrigger and Lenis (copied by the build) |
| `tools/render-objects.html` | Renders the still images of the objects |
| `tools/disc-text-ar.py` | Builds the Arabic phrase around the disc (`assets/disc-text-ar.svg`) |

After editing anything in `x3d/src/`, rebuild with `npm install && npm run build` (pinned versions: three.js 0.186.1, GSAP 3.15.0, Lenis 1.3.26, esbuild 0.28.1), then re-save the still images from `/tools/render-objects.html` (and `?size=1800` for the `-1800` versions used on phones and tablets) into `assets/3d/` as WebP if the models changed. Bump the `?v=` version in the HTML files and in `x3d/app.js`.

**Still to replace with your real content:** the gallery strips use the six design concepts from `assets/work/`; swap in screenshots of client projects as you complete them. The service page paragraphs are short; you can expand them with your own wording (change all three languages together).

## Google Maps (contact section)
The contact section on the three homepages shows the AbacheDev Google Maps listing, with an "Open in Google Maps" link (https://maps.app.goo.gl/QShYikzVJ9CDYdoB6). The map itself only loads when the visitor clicks "Show the map": Google's map is heavy and sets Google cookies, so the page stays fast and nothing is sent to Google before that click. The privacy policy mentions it, the security policy allows it (`frame-src https://www.google.com` in `_headers`) and the homepage structured data links to it (`hasMap`). To change the location, replace the embed address and the link at the top of the page generator, or in the `data-map-src` and `.x-map-open` link of the three homepages.

## Google reviews (homepage)
A "Client reviews" section between the portfolio and the prices shows the Google rating, the number of reviews and up to 5 reviews from the AbacheDev Google Maps listing, with "See all reviews on Google" and "Leave a review" links. It stays hidden until the listing has reviews.

How it works: `worker/index.js` (the Cloudflare Worker, run only for `/api/*`) asks Google's Places API (New) for the listing and keeps the answer in Cloudflare's cache for 6 hours, so new reviews appear on their own and Google is only asked a few times a day per language. `script.js` loads `/api/reviews?lang=…` after the page and builds the cards (texts are inserted as plain text, never as HTML). Google's API gives at most 5 reviews, the ones it considers most relevant; showing every review would need the Google Business Profile API, which requires Google's approval.

Setup (once):
1. In Google Cloud Console (console.cloud.google.com), create a project, enable billing and the **Places API (New)**. With the 6-hour cache the site makes about 360 requests a month, within Google's free monthly allowance; set a budget alert anyway.
2. Create an API key (APIs & Services → Credentials) and restrict it to the **Places API (New)**.
3. Find the listing's Place ID (starts with `ChIJ`) with Google's Place ID Finder, and put it in `GOOGLE_PLACE_ID` in `wrangler.jsonc`.
4. Store the key as a secret, never in the code: `npx wrangler secret put GOOGLE_PLACES_KEY`, then `npx wrangler deploy`.

The security policy allows reviewers' profile pictures from `lh3.googleusercontent.com`, and the privacy policy mentions the reviews.

## About, Privacy and Terms pages
Each language has an About page, a privacy policy and terms and conditions, in the same design as the rest of the site (no 3D scene). They're linked from the menu (About) and the footer (all three), and the contact form says that sending it means accepting the privacy policy.

| Page | French | English | Arabic |
| --- | --- | --- | --- |
| About | `/a-propos/` | `/en/about/` | `/ar/about/` |
| Privacy policy | `/confidentialite/` | `/en/privacy/` | `/ar/privacy/` |
| Terms and conditions | `/conditions/` | `/en/terms/` | `/ar/terms/` |

The privacy policy describes what the site actually does: the contact form (Formspree, Google Sheet and the automatic thank-you email), WhatsApp, Cloudflare hosting, Google Fonts, and the language choice stored in the browser. It follows Moroccan Law 09-08 (CNDP) and mentions the GDPR for visitors in the EU. **Update it whenever you add a service that handles visitor data** (analytics, a chat widget, a newsletter, online payment), and change the "last updated" date on all three languages.

The terms cover quotes, prices, the 50/50 payment, timelines, ownership after full payment, support and liability. A few points are standard choices you should confirm or adjust: quotes valid for 30 days, the deposit kept if a project is cancelled after work starts, liability limited to the amount paid, and how long requests are kept (3 years). If you register a legal status (auto-entrepreneur, company) with an ICE number, add it to section 1 of the terms. These pages are a solid starting point, not legal advice: have them checked by a professional if your business grows.

## Preview locally
Open `index.html` in your browser, or run:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Languages
| Language | File | URL | Share image |
| --- | --- | --- | --- |
| French (main, `x-default`) | `index.html` | `/` | `assets/og-image-fr.png` |
| English | `en/index.html` | `/en/` | `assets/og-image-en.png` |
| Arabic (right-to-left) | `ar/index.html` | `/ar/` | `assets/og-image-ar.png` |

- The FR · EN · عربي switch sits in the menu. If a visitor's browser prefers another language the site offers, a small banner suggests that version (in that language). Picking a language with the switch, or closing the banner, is remembered. There is no automatic redirect, so Google can crawl every version.
- Every page has `hreflang` links to the other two (`x-default` is French), its own canonical URL, translated structured data and FAQ schema, and all three are listed in `sitemap.xml` with alternates.
- Text generated by JavaScript (rotating headline words, WhatsApp messages, form messages, the language banner) lives in `STRINGS` at the top of `script.js`, one set per language, picked from `<html lang>`.
- Arabic: `<html lang="ar" dir="rtl">`, the Cairo font, and CSS logical properties (`inset-inline-*`, `margin-inline-*`) so the layout mirrors automatically. Letter-spacing is disabled for Arabic text (it breaks the joins between letters). Phone numbers and email addresses inside Arabic text are wrapped in `dir="ltr"`.
- **When you change text, change it on all three pages** (each language also has its six service pages). Shared files (`styles.css`, `script.js`, `assets/`) serve every language; the pages reference them with absolute paths (`/styles.css`), because the address changes while the 3D scene stays on screen.

## SEO
- Keyword-focused title, meta description, H1 and section headings ("web design", "website development", "website pricing"…)
- Structured data (JSON-LD): `ProfessionalService` with contact details, service area and priced offers, plus `WebSite`, `WebPage` and `FAQPage` (generated from the visible FAQ — keep them in sync if you edit questions)
- Open Graph and Twitter cards with a 1200×630 share image per language (`assets/og-image-fr.png`, `og-image-en.png`, `og-image-ar.png`)
- `robots.txt`, `sitemap.xml`, a web app manifest per language (`site.webmanifest`, `en/site.webmanifest`, `ar/site.webmanifest`), `favicon.ico`, Apple touch icon, canonical URL and a branded `404.html` (marked `noindex`)
- Performance: non-blocking web fonts, deferred script, no layout shift; Lighthouse scores 100 for SEO, Accessibility and Best Practices, and 92–100 for Performance
- `_headers` sets security headers and cache rules on Cloudflare, including a Content-Security-Policy that only allows this site, Google Fonts, Formspree, the Google Apps Script endpoint, Cloudflare Web Analytics and the Google Maps embed. If you add an outside service (a chat widget, maps, a video, another form tool), add its address to the policy or the browser will block it; `styles.css` and `script.js` are linked with a `?v=` version so visitors get updates right away — bump it (e.g. `?v=2026101201`) on every HTML file when you change either file

**After launch:** add the site to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters), submit `https://abachedev.com/sitemap.xml`, and create a Google Business Profile. When you edit the page, update `<lastmod>` in `sitemap.xml`.

## Deploy
Cloudflare Workers static assets, configured in `wrangler.jsonc`. `_headers` (security headers, cache rules) and `404.html` are picked up automatically. `.assetsignore` keeps everything that isn't part of the website out of the upload (`marketing/`, `tools/`, `docs/`, `integrations/`, `node_modules/`, the 3D sources in `x3d/src/`, the README and package files).

- **From GitHub (recommended):** in Cloudflare, Workers & Pages → Create → Import a repository → `visaabache/abachedev`. Leave the build command empty (the 3D bundle and `vendor/` are committed) and keep the deploy command `npx wrangler deploy`. Every push to the production branch then redeploys the site.
- **From your computer:** `npx wrangler login`, then `npx wrangler deploy`.
- **Domain:** `abachedev.com` is registered at Namecheap with Cloudflare's nameservers. In the Worker, Settings → Domains & Routes → add `abachedev.com` and `www.abachedev.com`, and a Redirect Rule sends `www` to `abachedev.com`.
- **Email:** Cloudflare Email Routing forwards `contact@abachedev.com` to your Gmail.
