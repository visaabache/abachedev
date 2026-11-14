# KoraPulse: football news website

A football news site (Morocco, Africa, Europe), with a classic news-site layout: a top bar, a large centred logo, a menu bar that stays at the top with dropdowns, a live-score ticker, a featured story with a sidebar (opinion, league table, most read, newsletter), sections for each competition, ad slots and a large footer.

Plain HTML, CSS and JavaScript. No build step. Open `index.html` in a browser, or serve the folder:

```bash
cd football-news && python3 -m http.server 8000
```

## Pages
| File | What it shows |
| --- | --- |
| `index.html` | Homepage |
| `article.html?id=<article id>` | One article: share buttons, comments box, related articles |
| `category.html?c=<category>` | A category, with sub-category chips (`&t=Results`) and "Load more" |
| `category.html?q=<words>` | Search results (search icon in the menu, or press `/`) |

## Editing content
Everything is in **`js/data.js`**: site name, menu, top links, live scores, the league table and the articles.
To add an article, copy one object in `articles` and change `id`, `cat`, `title`, `author`, `date`, `excerpt` and `body`.
Put a photo path in `image` (e.g. `"images/derby.jpg"`) to replace the generated illustration. Set `featured: true` on the article that should lead the homepage.

The articles, clubs, players and scores in `data.js` are **sample content** for the demo. Replace them before going live.

## Design
- Colours: `--brand` (green) and `--accent` (gold) at the top of `css/style.css`.
- Dark mode follows the visitor's device, and the switch in the menu bar overrides it (remembered on that browser).
- Ad slots are grey placeholders (`.ad-leader` 970×90, `.ad-box` 300×250, `.ad-banner` 728×90): paste your ad code (e.g. Google AdSense) in their place in `js/app.js`.

## Going further
For a newsroom publishing every day, connect this design to a CMS (WordPress, Ghost or a headless CMS) so writers can publish without editing code, and to a football data API for real live scores and tables.

## Deploying
This folder is not part of abachedev.com (it is listed in `.assetsignore`). Deploy it on its own, e.g. Cloudflare Pages with `football-news` as the build output directory and no build command.
