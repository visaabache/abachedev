// AbacheDev Worker: serves the static site, plus one small API.
// GET /api/reviews?lang=fr|en|ar returns the Google rating and up to 5 reviews of the
// AbacheDev Google Maps listing (Places API, New). The answer is cached at Cloudflare for
// a few hours, so new reviews appear on their own and Google is only asked a few times a day.
//
// Settings (Cloudflare dashboard > Worker > Settings > Variables and Secrets, or wrangler):
//   GOOGLE_PLACES_KEY  secret   Google Cloud API key restricted to the Places API (New)
//   GOOGLE_PLACE_ID    variable Place ID of the listing (starts with "ChIJ")
// Without them the API answers with an empty list and the reviews section stays hidden.

const LANGS = ['fr', 'en', 'ar'];
const CACHE_OK = 6 * 3600; // seconds a good answer is kept
const CACHE_EMPTY = 600; // seconds an empty or failed answer is kept
const FIELDS = 'rating,userRatingCount,googleMapsUri,reviews';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/reviews') return reviews(request, env, ctx, url);
    return env.ASSETS.fetch(request);
  },
};

function json(body, maxAge) {
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': `public, max-age=${Math.min(maxAge, 3600)}, s-maxage=${maxAge}`,
      'x-content-type-options': 'nosniff',
      'access-control-allow-origin': 'https://abachedev.com',
    },
  });
}

async function reviews(request, env, ctx, url) {
  if (request.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: { allow: 'GET' } });
  const lang = LANGS.includes(url.searchParams.get('lang')) ? url.searchParams.get('lang') : 'fr';
  const cache = caches.default;
  const key = new Request(`${url.origin}/api/reviews?lang=${lang}&v=1`);
  const hit = await cache.match(key);
  if (hit) return hit;

  let res;
  if (!env.GOOGLE_PLACES_KEY || !env.GOOGLE_PLACE_ID) {
    res = json({ reviews: [], configured: false }, CACHE_EMPTY);
  } else {
    try {
      const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(env.GOOGLE_PLACE_ID)}?languageCode=${lang}`, {
        headers: { 'X-Goog-Api-Key': env.GOOGLE_PLACES_KEY, 'X-Goog-FieldMask': FIELDS },
      });
      if (!r.ok) throw new Error(`Places API ${r.status}`);
      res = json(shape(await r.json(), env.GOOGLE_PLACE_ID), CACHE_OK);
    } catch (err) {
      console.error('reviews:', err.message); // never echo the key or Google's answer to visitors
      res = json({ reviews: [], error: true }, CACHE_EMPTY);
    }
  }
  ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}

// Keep only what the page shows. Google's texts are returned as plain text; the page
// inserts them with textContent, never as HTML.
export function shape(place, placeId) {
  const list = (place.reviews || []).map((rv) => ({
    rating: Math.max(0, Math.min(5, Math.round(rv.rating || 0))),
    // the reviewer's own words; Google's machine translation would need a "translated" label
    text: (rv.originalText?.text || rv.text?.text || '').slice(0, 1200),
    time: rv.relativePublishTimeDescription || '',
    date: rv.publishTime || '',
    author: rv.authorAttribution?.displayName || '',
    authorUrl: safeUrl(rv.authorAttribution?.uri),
    photo: safePhoto(rv.authorAttribution?.photoUri),
    url: safeUrl(rv.googleMapsUri),
  })).filter((rv) => rv.author);
  list.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
  return {
    rating: typeof place.rating === 'number' ? Math.round(place.rating * 10) / 10 : null,
    count: place.userRatingCount || 0,
    mapsUrl: safeUrl(place.googleMapsUri),
    writeUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
    reviews: list,
  };
}

function safeUrl(u) {
  try {
    const x = new URL(u);
    return x.protocol === 'https:' && /(^|\.)google\.com$/.test(x.hostname) ? x.href : '';
  } catch { return ''; }
}

function safePhoto(u) {
  try {
    const x = new URL(u);
    return x.protocol === 'https:' && x.hostname === 'lh3.googleusercontent.com' ? x.href : '';
  } catch { return ''; }
}
