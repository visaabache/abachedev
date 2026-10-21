# Meta ads pack — AbacheDev (launch: Thursday 5 November 2026)

Goal: turn the content you posted (Oct 13 → Nov 4) into **WhatsApp conversations → quotes → clients**.
Everything runs from **Meta Ads Manager** (not the "Boost" button) so you control audiences, budgets and placements.

- **8 static ads**, each in two sizes: `feed.jpg` (1080×1350, 4:5) and `story.jpg` (1080×1920, 9:16, text kept inside the Reels/Stories safe zone). 6 in French, 2 in Arabic. Previews: `apercu-feed.png`, `apercu-story.png`.
- **Your Reels as video ads** (files on your phone/Drive): Reel 01 concurrent, Reel 10 offre, Reel 08 4 étapes, Reel 03 avant/après, Pin 1 se code tout seul, Pin 2 mettez pause, Pin 3 pendant que vous dormez.
- Budget: **about 95 DH/day in week 1, 120–130 DH/day after** → roughly **3 500 DH for the first 4 weeks**. One Business site (6 990 DH) pays for the whole month.

---

## 1. Before launch (Mon 2 → Wed 4 November)

1. **Meta Business Suite**: the Facebook Page and the Instagram account are linked, and you are admin of the ad account.
2. **WhatsApp ↔ Page**: Facebook Page → Settings → Linked accounts → WhatsApp → connect **+212 677-047171** (WhatsApp Business app). Without this you cannot pick "WhatsApp" as the conversion location.
3. **Ad account**: country Morocco, time zone Casablanca, currency **MAD** if offered (currency can't be changed later), add a payment card.
4. **WhatsApp Business app**:
   - Greeting message: *« Bonjour 👋 Merci pour votre message ! Je vous réponds dans quelques minutes. Pour aller plus vite : quelle est votre activité et votre ville ? »*
   - Away message (21:00–09:00): *« Merci ! Je vous réponds demain dès 9 h. Vous pouvez aussi réserver un appel gratuit sur abachedev.com. »*
   - Labels: `Pub-Concurrent`, `Pub-Prix`, `Pub-5jours`, `Pub-Nuit`, `Pub-Appel`, `Pub-Retarget`, `Pub-AR`, `Devis envoyé`, `Client`.
   - Quick replies (see §7).
5. **Custom audiences** (Ads Manager → Audiences → Create → Custom audience). Create them now so they fill up:
   - `IG engagés 90 j`: everyone who engaged with @abachedev in the last 90 days.
   - `FB engagés 90 j`: same for the Facebook Page.
   - `Vidéo 50 % 30 j`: people who watched ≥ 50 % of any of your Reels (choose all of them), last 30 days.
   - `Ont écrit WhatsApp 60 j`: people who messaged the Page/WhatsApp, last 60 days (used as an **exclusion**).
6. **Tracking sheet** (Google Sheets): `Date · Ad (label) · Name · City · Activity · Has a site? · Budget · Status (new / quote sent / won / lost) · Amount`.

---

## 2. Campaign structure

| # | Campaign | Objective → goal | Budget | Starts | Ads |
| --- | --- | --- | --- | --- | --- |
| **C1** | `C1 · Messages WhatsApp · FR` | **Engagement → Messaging apps → WhatsApp**, goal *Maximise conversations* | 70 DH/day (2 ad sets × 35) | Thu 5 Nov | Reel 01, Reel 10, A1, A2, A4 (+ A3 from week 2) |
| **C2** | `C2 · Vues vidéo · audience chaude` | **Engagement → Video views**, goal *ThruPlay* | 25 DH/day | Thu 5 Nov | Pin 1, Pin 2, Pin 3, Reel 08, Reel 03 |
| **C3** | `C3 · Retargeting · Messages` | **Engagement → WhatsApp**, *Maximise conversations* | 30–40 DH/day | Thu 12 Nov | A6, A5, A2, Reel 10 |
| **C4** | `C4 · Messages WhatsApp · AR` (test) | same as C1 | 25 DH/day | Thu 26 Nov | A7, A8 |

Why this shape: **C1** gets conversations from people who don't know you yet. **C2** costs very little per view and fills the retargeting pool with people who watched your Reels. **C3** goes back to those people with reassurance and offer ads, which is where most quotes usually come from. **C4** tests the Arabic-speaking market without touching what already works.

Common settings (all campaigns):
- Special ad category: **none**. Advantage campaign budget: **off** in week 1 (budgets set per ad set so each audience gets a fair test).
- Placements: **Advantage+ placements**. For every static ad, use *placement asset customisation*: `feed.jpg` for Feeds/Explore/Search, `story.jpg` for Stories/Reels.
- Schedule: run all day (people message in the evening; your away message covers the night).
- Naming: `C1 · AS-A Villes · A1-concurrent` so the reports read on their own.

### C1 · Messages WhatsApp · FR

**Ad set A — `AS-A · Grandes villes · intérêts` (35 DH/day)**
- Locations (+25 km): Casablanca, Rabat, Salé, Témara, Kénitra, Marrakech, Agadir, Tanger, Tétouan, Fès, Meknès, Oujda. These are the cities you now have blog guides for.
- Age 25–55, all genders.
- Detailed targeting (any of): *Small business owners*, *Entrepreneurship*, *Small business*, *Business page admins* (if listed), *Restaurants*, *Beauty salons*, *Real estate*, *Retail*.
- Advantage detailed targeting: on.

**Ad set B — `AS-B · Maroc · Advantage+ audience` (35 DH/day)**
- Location: Morocco. Advantage+ audience with suggestions: age 25–55, interest *Small business owners*. Meta finds the buyers itself.

**Both ad sets**: exclude `Ont écrit WhatsApp 60 j`. Ads: **Reel 01, Reel 10, A1, A2, A4** (5 ads; Meta pushes the winners).

### C2 · Vues vidéo · audience chaude
- One ad set, Morocco, 22–55, Advantage+ placements limited to **Reels + Stories + Feeds**.
- Ads: Pin 1, Pin 2, Pin 3, Reel 08, Reel 03. No call to action button needed, just the videos.
- Purpose: fill `Vidéo 50 % 30 j` cheaply. Don't judge it on messages.

### C3 · Retargeting (from 12 Nov)
- Audience: `Vidéo 50 % 30 j` + `IG engagés 90 j` + `FB engagés 90 j`. Exclude `Ont écrit WhatsApp 60 j`.
- Ads: **A6 (toujours en réflexion), A5 (appel gratuit), A2 (prix), Reel 10**.
- Frequency up to 3–4 per week is fine here: small, warm audience.

### C4 · Arabic test (from 26 Nov)
- Same as C1 ad set B, plus **language: Arabic**. Ads **A7, A8**. Compare its cost per conversation with C1 after 7 days.

---

## 3. The ads (creatives + copy)

Each ad uses the **WhatsApp prefilled message** field to tag where the lead came from: you see it in the first message and label the chat.

| Ad | File | Campaign | Prefilled WhatsApp message |
| --- | --- | --- | --- |
| A1 · Il appelle votre concurrent | `creatives/a01-concurrent/` | C1 | Bonjour ! Je viens de la pub « concurrent ». Je voudrais un devis pour mon site. |
| A2 · Prix affichés | `creatives/a02-prix-affiches/` | C1, C3 | Bonjour ! Je viens de la pub « prix ». Quelle formule pour mon activité ? |
| A3 · En ligne en 5 jours | `creatives/a03-en-ligne-5-jours/` | C1 (week 2) | Bonjour ! Je viens de la pub « 5 jours ». Je suis intéressé(e) par la formule Starter. |
| A4 · Même la nuit | `creatives/a04-meme-la-nuit/` | C1 | Bonjour ! Je viens de la pub « nuit ». Je voudrais un site qui prend des demandes. |
| A5 · Appel gratuit | `creatives/a05-appel-gratuit/` | C3 | Bonjour ! Je voudrais réserver l’appel découverte gratuit. |
| A6 · Toujours en réflexion | `creatives/a06-toujours-en-reflexion/` | C3 | Bonjour ! J’ai quelques questions avant de me lancer. |
| A7 · Concurrent (AR) | `creatives/a07-concurrent-ar/` | C4 | مرحبًا! رأيت إعلان « المنافس » وأريد عرض سعر لموقعي. |
| A8 · Prix (AR) | `creatives/a08-prix-affiches-ar/` | C4 | مرحبًا! رأيت إعلان « الأسعار ». أي باقة تناسب نشاطي؟ |
| Reel 01 · concurrent | your phone | C1 | Bonjour ! Je viens de la vidéo « concurrent ». Je voudrais un devis. |
| Reel 10 · offre | your phone | C1, C3 | Bonjour ! Je viens de la vidéo « offre ». Je voudrais un devis. |

### Copy — write 2 primary texts per ad (Meta rotates them)

**A1 · Il appelle votre concurrent** · button **Send WhatsApp message**
- Primary text 1: *Un client cherche votre métier sur Google… et tombe sur votre concurrent. 😬 Avec un site rapide et bien référencé, c’est vous qu’on trouve, et c’est vous qu’on appelle. Devis gratuit, réponse sous 24 h.*
- Primary text 2: *Pas de site = invisible sur Google. Vos clients ne vous trouvent pas, ils trouvent les autres. On règle ça : site professionnel, adapté aux mobiles, référencement inclus. 👉 Écrivez-nous sur WhatsApp.*
- Headline: **Soyez trouvé sur Google** · Description: *Devis gratuit sous 24 h*

**A2 · Prix affichés** · button **Send WhatsApp message**
- Primary text 1: *Un site web, combien ça coûte ? Chez AbacheDev, les prix sont affichés : Starter 2 990 DH, Business 6 990 DH, E-commerce 12 990 DH. Devis fixe, paiement en deux fois, aucun frais caché.*
- Primary text 2: *Fini les devis flous. Vous savez tout avant de commencer : prix fixe, délais clairs, 50 % à la commande et 50 % à la mise en ligne. Dites-nous votre activité, on vous conseille la bonne formule.*
- Headline: **Site pro dès 2 990 DH** · Description: *Paiement en 2 fois*

**A3 · En ligne en 5 jours** · button **Send WhatsApp message**
- Primary text 1: *Votre site professionnel en ligne en 5 jours avec la formule Starter : une page complète, parfaite sur mobile, SEO de base et bouton WhatsApp. Dès 2 990 DH.*
- Primary text 2: *Vous voulez être en ligne vite ? Envoyez-nous votre activité et vos photos, on s’occupe du reste. Livraison en 5 jours environ, devis gratuit.*
- Headline: **En ligne en 5 jours** · Description: *Formule Starter · 2 990 DH*

**A4 · Même la nuit** · button **Send WhatsApp message**
- Primary text 1: *23 h, vous fermez. Votre site, lui, continue : réservations, messages WhatsApp, demandes de devis. Un site, c’est un employé qui ne dort jamais. 🌙*
- Primary text 2: *Vos clients ne vous cherchent pas seulement aux heures d’ouverture. Avec un site clair, ils réservent, écrivent et demandent un devis, même la nuit.*
- Headline: **Un site qui travaille 24 h/24** · Description: *Devis gratuit sous 24 h*

**A5 · Appel gratuit** · button **Book now** → https://abachedev.com/#contact (or **Send WhatsApp message**)
- Primary text 1: *Vous avez un projet de site mais ne savez pas par où commencer ? Réservez un appel découverte gratuit : on parle de votre activité, de vos objectifs et du budget. Sans engagement.*
- Primary text 2: *Un appel pour y voir clair : quelle formule, quels délais, quel prix. Choisissez un créneau en 30 secondes.*
- Headline: **Appel découverte gratuit** · Description: *Sans engagement*

**A6 · Toujours en réflexion** (retargeting) · button **Send WhatsApp message**
- Primary text 1: *Vous hésitez encore ? Voici ce qui est garanti : devis fixe, paiement 50/50, en ligne en 1 à 3 semaines, support offert et un seul interlocuteur.*
- Primary text 2: *Une question avant de vous lancer ? Délais, prix, contenu : écrivez-nous sur WhatsApp, réponse sous 24 h.*
- Headline: **Posez-nous vos questions** · Description: *Réponse sous 24 h*

**A7 · المنافس (AR)** · button **Send WhatsApp message**
- النص: *يبحث زبون عن نشاطك على Google… فيجد منافسك. 😬 مع موقع سريع وظاهر على Google، أنت من يجدونه وأنت من يتصلون به. عرض سعر مجاني وردّ خلال 24 ساعة.*
- العنوان: **اظهر على Google** · الوصف: *عرض سعر مجاني*

**A8 · الأسعار (AR)** · button **Send WhatsApp message**
- النص: *كم يكلف موقع إلكتروني؟ عندنا الأسعار معلنة: الباقة الأساسية 2 990 درهم، باقة الأعمال 6 990 درهم، المتجر الإلكتروني 12 990 درهم. سعر ثابت، الدفع على دفعتين، بدون تكاليف خفية.*
- العنوان: **موقع احترافي ابتداءً من 2 990 درهم** · الوصف: *الدفع على دفعتين*

**Video ads (Reels)**: reuse each Reel’s Instagram caption as primary text, headline **Devis gratuit sous 24 h**, button **Send WhatsApp message** (C1/C3). For C2 (views), no button needed.

---

## 4. Four-week plan

| Week | Dates | What you do |
| --- | --- | --- |
| **1 · Test** | Thu 5 → Wed 11 Nov | Launch C1 (A + B) and C2. **Don’t touch anything for 3 days** (learning phase). Day 4: pause ads that spent 60 DH with 0 conversations. Answer every message within 15 min (09:00–21:00). |
| **2 · Focus** | Thu 12 → Wed 18 Nov | Compare ad sets A and B on **cost per conversation**: move the loser’s budget to the winner (or keep both if close). Add A3 to C1. Launch **C3 retargeting** (30 DH/day). |
| **3 · Scale** | Thu 19 → Wed 25 Nov | If cost per conversation is stable, raise the winning ad set **+20 % every 3 days**. Replace any ad with frequency > 3 or a CTR down 30 % from its first days. |
| **4 · Expand** | Thu 26 Nov → Wed 2 Dec | Launch **C4 Arabic test** (25 DH/day). Review the sheet: which ads brought **quotes and clients**, not just messages. Cut the rest, keep the winners for December. |

Total ≈ 665 DH (week 1) + ~850 DH/week after ≈ **3 200–3 600 DH** for the month.

---

## 5. What to watch (and when to act)

Add these columns in Ads Manager (Columns → Customise): *Results (messaging conversations started), Cost per result, Amount spent, Impressions, CPM, CTR (link), Frequency, ThruPlays, Cost per ThruPlay, 3-second video plays.*

| Metric | Starting target (adjust after week 1) | If it’s worse |
| --- | --- | --- |
| Cost per WhatsApp conversation | ≤ 20 DH good · 20–40 DH OK | > 40 DH after 3 days: pause the weakest ads, test A3/A5 |
| CTR (link) | ≥ 1 % | < 0.6 %: the hook isn’t working → swap creative |
| Video hook rate (3-s plays ÷ impressions) | ≥ 25 % | Lower: the first second of the Reel isn’t stopping the scroll |
| Frequency (C1) | ≤ 2.5 per week | Higher: widen the audience or add new ads |
| Cost per ThruPlay (C2) | as low as possible | It only feeds retargeting; cap at 25 DH/day |

**Rules of thumb**
- The learning phase needs time: no edits for **72 h** after launch or after any big change.
- Change **one thing at a time** (budget *or* audience *or* ads).
- Budget increases: **+20 %** max every 3 days. Bigger jumps restart learning.
- The real score is in your sheet: **messages → quotes → clients**. An ad with cheap messages that never buy is worse than a pricier one that brings clients.

---

## 6. Ad policy notes (to avoid rejections)

- Don’t say “you” + a personal trait (*“Vous êtes endetté ?”*, *“Vous êtes malade ?”*). Business questions like *“Pas encore de site ?”* are fine.
- No guaranteed results (“1ère place sur Google garantie”). The copy above never promises rankings.
- Text on images is fine but keep it short (the creatives are already designed that way).
- The landing (WhatsApp / abachedev.com) must match the ad: prices, delays and offers above match the site.

---

## 7. Turning conversations into clients

**Reply within 15 minutes.** Messaging ads lose most of their value after an hour.

Quick replies (WhatsApp Business → Tools → Quick replies):
- `/bienvenue`: *Bonjour et merci pour votre message ! 😊 Pour vous conseiller : 1) quelle est votre activité ? 2) dans quelle ville ? 3) avez-vous déjà un site ou une page Instagram ? 4) votre objectif principal : appels, réservations, ventes en ligne ?*
- `/formules`: *Nos formules : Starter 2 990 DH (1 page, ~5 jours) · Business 6 990 DH (jusqu’à 5 pages, design sur mesure, ~2 semaines, 1 mois de support) · E-commerce 12 990 DH (boutique, 3 mois de support). Paiement 50 % à la commande, 50 % à la mise en ligne.*
- `/appel`: *Le plus simple : un court appel pour cadrer votre projet. Choisissez votre créneau ici : abachedev.com (bouton « Réserver un appel »).*
- `/relance` (send 48 h after a quote with no reply): *Bonjour ! Avez-vous pu regarder le devis ? Je peux l’ajuster si besoin, ou répondre à vos questions.*

Arabic equivalents for C4 leads:
- `/مرحبا`: *مرحبًا وشكرًا على رسالتك! 😊 لنقترح عليك الأنسب: 1) ما هو نشاطك؟ 2) في أي مدينة؟ 3) هل لديك موقع أو صفحة Instagram؟ 4) هدفك: مكالمات، حجوزات، أم بيع عبر الإنترنت؟*

Label every chat with its ad label and update the sheet the same day.

---

## 8. Optional next step: Meta Pixel on abachedev.com

Right now the ads send people straight to WhatsApp, which needs no tracking code. If you later want **website-visitor retargeting** or **Leads (website)** campaigns, the Meta Pixel can be added to the site. The site’s strict security policy (CSP) has to be updated to allow `connect.facebook.net`, so ask before adding it.
