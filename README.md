# AbacheDev — Website Creator Service

A fast, responsive, single-page website for offering website design & development services.

## Sections
- **Hero**: your headline and calls to action
- **Services**: design, development, e-commerce, SEO, redesigns, maintenance
- **Process**: the 4 steps from discovery to launch
- **Portfolio**: sample website styles by industry (swap in your real projects)
- **Pricing**: Starter / Business / E-commerce packages
- **FAQ**
- **Contact**: a project inquiry form

Plain HTML, CSS and JavaScript. No build step, no dependencies. Supports dark mode automatically.

## Customize
1. **Your email**: open `script.js` and set `contactEmail` in `CONFIG`.
2. **Receive form messages directly (optional)**: create a free form at [formspree.io](https://formspree.io), then paste its endpoint into `formEndpoint` in `script.js`. If you leave it empty, the form opens the visitor's email app with the message pre-filled.
3. **Prices & text**: edit `index.html`.
4. **Colors**: change `--primary` and `--accent` at the top of `styles.css`.

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
4. Your site will be live at `https://<your-username>.github.io/abachedev/` within a minute or two.
