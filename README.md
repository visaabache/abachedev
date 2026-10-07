# AbacheDev — Website Creator Service

Live at **[abachedev.com](https://abachedev.com)** · Contact: **contact@abachedev.com**

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
2. **Receive form messages directly (optional)**: create a free form at [formspree.io](https://formspree.io), then paste its endpoint into `formEndpoint` in `script.js`. If you leave it empty, the form opens the visitor's email app with the message pre-filled.
3. **WhatsApp**: `whatsappNumber` in `CONFIG` in `script.js` is set to `212677047171` (+212 677-047171). Use international format, digits only.
4. **Prices & text**: edit `index.html`.
5. **Colors**: change `--primary` and `--accent` at the top of `styles.css`.

## Logo
The `<A>` mark: an HTML anchor tag built around the "A" of Abache, with a blinking cyan text cursor as the crossbar.

| File | Use |
| --- | --- |
| `assets/logo-mark.svg` | Icon (scales to any size) |
| `assets/logo.svg` | Icon + wordmark |
| `assets/logo-512.png` | Social media profile picture, app icon |
| `assets/logo-wide.png` | Email signatures, documents, banners (transparent background) |
| `assets/favicon.svg` | Browser tab icon |

## Preview locally
Open `index.html` in your browser, or run:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publish for free with GitHub Pages
1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under "Build and deployment", choose **Deploy from a branch**, select your branch and the `/ (root)` folder, then click **Save**.
4. Under **Custom domain**, enter `abachedev.com` (the `CNAME` file in this repo already contains it) and tick **Enforce HTTPS** once it's available.
5. At your domain registrar, add these DNS records:
   - `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - a `CNAME` record for `www` pointing to `visaabache.github.io`

DNS changes can take up to 24 hours to take effect.
