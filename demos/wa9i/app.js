/* Wa9i — demo phone-case shop by AbacheDev.
   Single-page app with hash routes: #/  #/c/brand  #/c/brand/model  #/p/id  #/panier  #/commande  #/contact  #/recherche/q
   Plain JavaScript, no build, no backend: orders are sent as a WhatsApp message (demo). */
(() => {
  "use strict";

  /* ---------- Config ---------- */
  const CONFIG = {
    currency: { fr: "DH", ar: "درهم" },
    whatsapp: "", // digits only, e.g. 2126XXXXXXXX. Empty = the visitor picks the chat (demo).
    freeShippingFrom: 2, // items
    shipping: 25,
    coupon: { code: "WA9I2", minItems: 2 },
  };

  /* ---------- Storage (safe) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("wa9i:" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("wa9i:" + k, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  /* ---------- i18n ---------- */
  const T = {
    fr: {
      skip: "Aller au contenu", topbar: "Paiement à la livraison partout au Maroc", topbarWa: "Une question ? WhatsApp",
      searchPh: "Votre modèle : iPhone 17, Galaxy S26…", menu: "Menu", yourCart: "Votre panier", cart: "Panier", contact: "Contact",
      footAbout: "Des coques qui protègent pour de vrai, pour plus de 40 modèles. Vous payez à la livraison.",
      footShop: "Boutique", footHelp: "Aide", footDelivery: "Livraison & retours",
      demo: "Site de démonstration : marque fictive, aucune commande réelle.",
      promoA: "Livraison offerte", promoB: "dès 2 coques · code",
      home: "Accueil", all: "Tout voir", accessories: "Accessoires",
      s1k: "Nouvelle collection", s1t: "Le Maroc <em>dans votre poche</em>", s1p: "Motifs zellige, étoile verte et broderie amazighe, imprimés sur des coques antichoc pour iPhone, Samsung et plus encore.",
      s2k: "MagSafe", s2t: "Transparente, <em>aimantée</em>, solide", s2p: "Votre téléphone reste visible, le chargeur sans fil s’accroche tout seul, et les coins absorbent les chutes.",
      s3k: "Cuir & élégance", s3t: "Du cuir qui <em>vieillit bien</em>", s3p: "Coques et étuis portefeuille en cuir, avec emplacements pour cartes et anneau-support.",
      shopNow: "Découvrir", seeAll: "Voir tout",
      tr1: "Paiement à la livraison", tr1s: "Vous payez en recevant", tr2: "Livraison 24–72 h", tr2s: "Dans tout le Maroc", tr3: "Échange 7 jours", tr3s: "Mauvais modèle ? On échange", tr4: "Conseil WhatsApp", tr4s: "7j/7, en darija ou français",
      byBrand: "Choisissez votre marque", models: "modèles", collections: "Nos collections", best: "Les plus commandées", newIn: "Nouveautés",
      cZ: "Zellige & Maroc", cZs: "Motifs d’ici", cC: "Cuir", cCs: "Élégant et durable", cT: "Transparent MagSafe", cTs: "Aimanté et clair", cA: "Antichoc", cAs: "Protection maximale",
      add: "Ajouter", buy: "Commander", added: "Ajouté au panier", products: "produits", sort: "Trier", sortPop: "Popularité", sortLow: "Prix croissant", sortHigh: "Prix décroissant", sortNew: "Nouveautés",
      filterBrand: "Marques", showMore: "Afficher plus", noRes: "Aucun produit trouvé.", noResHint: "Essayez « iPhone 17 » ou « Galaxy ».", resultsFor: "Résultats pour",
      colour: "Couleur", forModel: "Modèle", inStock: "En stock, expédié aujourd’hui", qty: "Quantité", reviews: "avis",
      codTitle: "Commander en 30 secondes", codSub: "Remplissez le formulaire, on vous appelle pour confirmer. Vous payez à la livraison.",
      fName: "Nom complet", fCity: "Ville", fCityPh: "Choisissez votre ville", fAddress: "Adresse", fPhone: "Téléphone", fNote: "Remarque (facultatif)",
      orderBtn: "Confirmer la commande", total: "Total", nPay: "Paiement à la livraison", nCall: "Appel de confirmation", nSwap: "Échange 7 jours",
      dFeat: "Caractéristiques", dShip: "Livraison & paiement", dShipTxt: "Livraison en 24 h à Casablanca, Rabat et Marrakech, 48–72 h ailleurs. Vous payez en espèces au livreur. Livraison offerte dès 2 articles.",
      related: "Vous aimerez aussi",
      cartEmpty: "Votre panier est vide.", continue: "Continuer mes achats", viewCart: "Voir le panier", checkout: "Passer la commande",
      subtotal: "Sous-total", shipping: "Livraison", free: "Offerte", discount: "Réduction", coupon: "Code promo", apply: "Appliquer",
      couponOk: "Code appliqué : livraison offerte", couponBad: "Code invalide", freeLeft: "Encore {n} article pour la livraison offerte", freeYes: "Livraison offerte débloquée",
      remove: "Retirer", summary: "Récapitulatif", product: "Produit",
      coTitle: "Vos informations de livraison", coSub: "Aucun paiement en ligne : vous réglez au livreur.", payCod: "Paiement à la livraison", payCodS: "Espèces, à la réception du colis",
      eName: "Indiquez votre nom", eCity: "Choisissez une ville", eAddress: "Indiquez votre adresse", ePhone: "Numéro marocain : 06 ou 07 suivi de 8 chiffres",
      thanks: "Merci, commande reçue !", thanksTxt: "Votre référence est {ref}. Nous vous appelons au {phone} pour confirmer, puis le colis part.", thanksWa: "Envoyer aussi sur WhatsApp", backShop: "Retour à la boutique",
      waIntro: "Nouvelle commande Wa9i", ctTitle: "Contactez-nous", ctTxt: "Une question sur un modèle, une commande ou un échange ? Écrivez-nous.",
      ctHours: "Horaires", ctHoursV: "Tous les jours, 9h – 22h", ctDel: "Livraison", ctDelV: "Partout au Maroc, 24–72 h", ctSwap: "Échanges", ctSwapV: "Sous 7 jours, produit non utilisé", ctWa: "Écrire sur WhatsApp",
      notFound: "Page introuvable", feat: ["Bords surélevés qui protègent l’écran et les caméras", "Coins renforcés contre les chutes", "Boutons précis, découpes exactes", "Compatible charge sans fil"],
      cartLabel: "Panier", close: "Fermer", langLabel: "Changer de langue",
    },
    ar: {
      skip: "انتقل إلى المحتوى", topbar: "الدفع عند الاستلام في جميع أنحاء المغرب", topbarWa: "عندك سؤال؟ واتساب",
      searchPh: "موديلك: iPhone 17، Galaxy S26…", menu: "القائمة", yourCart: "سلتك", cart: "السلة", contact: "اتصل بنا",
      footAbout: "كوكات كتحمي بصح، لأكثر من 40 موديل. كتخلص ملي توصلك.",
      footShop: "المتجر", footHelp: "مساعدة", footDelivery: "التوصيل والإرجاع",
      demo: "موقع تجريبي: علامة وهمية، لا توجد طلبات حقيقية.",
      promoA: "التوصيل مجاني", promoB: "ابتداءً من كوكتين · الكود",
      home: "الرئيسية", all: "عرض الكل", accessories: "إكسسوارات",
      s1k: "مجموعة جديدة", s1t: "المغرب <em>فجيبك</em>", s1p: "زليج، النجمة الخضراء والطرز الأمازيغي، مطبوعين على كوكات مضادة للصدمات لآيفون وسامسونج وغيرهم.",
      s2k: "MagSafe", s2t: "شفافة، <em>مغناطيسية</em> وقوية", s2p: "التيليفون كيبان، الشاحن اللاسلكي كيتشد بوحدو، والزوايا كتحمي من الطيحات.",
      s3k: "جلد وأناقة", s3t: "جلد كيزيد <em>يزيان مع الوقت</em>", s3p: "كوكات وحافظات جلد بجيوب للبطاقات وحلقة للوقوف.",
      shopNow: "اكتشف", seeAll: "عرض الكل",
      tr1: "الدفع عند الاستلام", tr1s: "كتخلص ملي توصلك", tr2: "توصيل 24–72 ساعة", tr2s: "فجميع المدن", tr3: "تبديل 7 أيام", tr3s: "موديل غالط؟ كنبدلوه", tr4: "نصيحة على واتساب", tr4s: "7/7 بالدارجة أو الفرنسية",
      byBrand: "اختار الماركة ديالك", models: "موديلات", collections: "المجموعات", best: "الأكثر طلباً", newIn: "جديد",
      cZ: "زليج ومغرب", cZs: "نقوش من عندنا", cC: "جلد", cCs: "أنيق ويدوم", cT: "شفاف MagSafe", cTs: "مغناطيسي وواضح", cA: "مضاد للصدمات", cAs: "حماية قصوى",
      add: "أضف", buy: "اطلب", added: "تمت الإضافة للسلة", products: "منتج", sort: "ترتيب", sortPop: "الأكثر شعبية", sortLow: "الثمن تصاعدي", sortHigh: "الثمن تنازلي", sortNew: "الجديد",
      filterBrand: "الماركات", showMore: "عرض المزيد", noRes: "ما لقينا حتى منتج.", noResHint: "جرب « iPhone 17 » أو « Galaxy ».", resultsFor: "نتائج البحث عن",
      colour: "اللون", forModel: "الموديل", inStock: "متوفر، كيتصيفط اليوم", qty: "الكمية", reviews: "تقييم",
      codTitle: "اطلب ف 30 ثانية", codSub: "عمر الفورمولير، غادي نعيطو ليك نأكدو. كتخلص ملي توصلك.",
      fName: "الاسم الكامل", fCity: "المدينة", fCityPh: "اختار المدينة", fAddress: "العنوان", fPhone: "رقم الهاتف", fNote: "ملاحظة (اختياري)",
      orderBtn: "أكد الطلب", total: "المجموع", nPay: "الدفع عند الاستلام", nCall: "مكالمة تأكيد", nSwap: "تبديل 7 أيام",
      dFeat: "المميزات", dShip: "التوصيل والدفع", dShipTxt: "التوصيل ف 24 ساعة للدار البيضاء والرباط ومراكش، و48–72 ساعة لباقي المدن. كتخلص كاش للموزع. التوصيل مجاني ابتداءً من منتجين.",
      related: "غادي يعجبك تاني",
      cartEmpty: "السلة خاوية.", continue: "كمل التسوق", viewCart: "شوف السلة", checkout: "إتمام الطلب",
      subtotal: "المجموع الفرعي", shipping: "التوصيل", free: "مجاني", discount: "تخفيض", coupon: "كود التخفيض", apply: "تطبيق",
      couponOk: "تم تطبيق الكود: التوصيل مجاني", couponBad: "كود غير صالح", freeLeft: "باقي {n} منتج للتوصيل المجاني", freeYes: "التوصيل المجاني مفعل",
      remove: "حذف", summary: "ملخص الطلب", product: "المنتج",
      coTitle: "معلومات التوصيل", coSub: "ما كاين حتى دفع أونلاين: كتخلص للموزع.", payCod: "الدفع عند الاستلام", payCodS: "كاش، ملي يوصلك الكولي",
      eName: "دخل الاسم ديالك", eCity: "اختار مدينة", eAddress: "دخل العنوان ديالك", ePhone: "رقم مغربي: 06 أو 07 و8 أرقام",
      thanks: "شكراً، توصلنا بالطلب!", thanksTxt: "المرجع ديالك هو {ref}. غادي نعيطو ليك على {phone} باش نأكدو، ومن بعد كيتصيفط الكولي.", thanksWa: "صيفط تاني على واتساب", backShop: "رجوع للمتجر",
      waIntro: "طلب جديد Wa9i", ctTitle: "اتصل بنا", ctTxt: "عندك سؤال على موديل، طلب أو تبديل؟ كتب لينا.",
      ctHours: "الأوقات", ctHoursV: "كل يوم، 9 صباحاً – 10 ليلاً", ctDel: "التوصيل", ctDelV: "فجميع المدن، 24–72 ساعة", ctSwap: "التبديل", ctSwapV: "خلال 7 أيام، منتج غير مستعمل", ctWa: "كتب لينا على واتساب",
      notFound: "الصفحة غير موجودة", feat: ["حواف مرتفعة كتحمي الشاشة والكاميرات", "زوايا مقواة ضد الطيحات", "أزرار دقيقة وفتحات مضبوطة", "متوافقة مع الشحن اللاسلكي"],
      cartLabel: "السلة", close: "إغلاق", langLabel: "تغيير اللغة",
    },
  };
  let lang = store.get("lang", "fr") === "ar" ? "ar" : "fr";
  const t = (k, vars) => { let s = (T[lang][k] ?? T.fr[k] ?? k); if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace("{" + a + "}", b); return s; };
  const L = (o) => (o && typeof o === "object" ? (o[lang] ?? o.fr) : o);
  const money = (n) => (lang === "ar" ? `${n.toLocaleString("fr-MA")} ${CONFIG.currency.ar}` : `${n.toLocaleString("fr-MA")} ${CONFIG.currency.fr}`);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Catalogue ---------- */
  const BRANDS = [
    { id: "iphone", name: "iPhone", cam: "tri", models: ["iPhone 18 Pro Max", "iPhone 18 Pro", "iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone 17", "iPhone 16", "iPhone 15"] },
    { id: "samsung", name: "Samsung", cam: "vert", models: ["Galaxy S26 Ultra", "Galaxy S26", "Galaxy A57", "Galaxy A37", "Galaxy A17"] },
    { id: "xiaomi", name: "Xiaomi", cam: "square", models: ["Xiaomi 15T Pro", "Redmi Note 15 Pro", "Redmi 15C"] },
    { id: "huawei", name: "Huawei", cam: "round", models: ["Pura 80 Pro", "Nova 14"] },
    { id: "oppo", name: "Oppo", cam: "round", models: ["Reno 14", "A5 Pro"] },
    { id: "honor", name: "Honor", cam: "round", models: ["Honor 400", "Magic 7 Lite", "X9c"] },
    { id: "google", name: "Google", cam: "bar", models: ["Pixel 10 Pro", "Pixel 10", "Pixel 9a"] },
    { id: "infinix", name: "Infinix", cam: "square", models: ["Note 50 Pro", "Hot 60"] },
  ];
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const DESIGNS = [
    { key: "zellige", coll: "zellige", name: { fr: "Zellige Fès", ar: "زليج فاس" }, pattern: "zellige", colors: ["#0e7a5f", "#1d4ed8", "#9a3412"], price: 189, old: 249, badge: { fr: "Best-seller", ar: "الأكثر مبيعاً" } },
    { key: "najma", coll: "zellige", name: { fr: "Étoile Atlas", ar: "نجمة الأطلس" }, pattern: "star", colors: ["#b91c1c", "#0c1f1a"], price: 169, old: 219 },
    { key: "amazigh", coll: "zellige", name: { fr: "Tissage amazigh", ar: "طرز أمازيغي" }, pattern: "amazigh", colors: ["#f2b33d", "#f6efe2", "#0c1f1a"], price: 179, old: 229, badge: { fr: "Nouveau", ar: "جديد" }, isNew: true },
    { key: "clear", coll: "clear", name: { fr: "Clear MagSafe", ar: "شفافة MagSafe" }, pattern: "clear", colors: ["#cfe3ee", "#e9d5ff", "#0c1f1a"], price: 199, old: 259, badge: { fr: "MagSafe", ar: "MagSafe" } },
    { key: "frost", coll: "clear", name: { fr: "Givrée mate MagSafe", ar: "مطفية MagSafe" }, pattern: "frost", colors: ["#94a3b8", "#86efac", "#fda4af"], price: 189, old: 239, isNew: true },
    { key: "leather", coll: "cuir", name: { fr: "Cuir pleine fleur", ar: "جلد طبيعي" }, pattern: "leather", colors: ["#7c4a21", "#1f1f1f", "#2f4a3a"], price: 279, old: 349, badge: { fr: "Cuir", ar: "جلد" } },
    { key: "wallet", coll: "cuir", name: { fr: "Étui portefeuille", ar: "حافظة محفظة" }, pattern: "wallet", colors: ["#3b2412", "#1f1f1f", "#7f1d1d"], price: 249, old: 299 },
    { key: "armor", coll: "armor", name: { fr: "Armure antichoc + anneau", ar: "مضادة للصدمات + حلقة" }, pattern: "armor", colors: ["#1f2937", "#9a3412", "#1e3a8a"], price: 229, old: 289, badge: { fr: "Antichoc", ar: "مضادة للصدمات" } },
    { key: "carbon", coll: "armor", name: { fr: "Fibre carbone fine", ar: "ألياف الكربون" }, pattern: "carbon", colors: ["#111827", "#374151"], price: 159, old: 199 },
    { key: "marble", coll: "zellige", name: { fr: "Marbre & or", ar: "رخام وذهبي" }, pattern: "marble", colors: ["#f5f0e6", "#1f1f1f"], price: 169, old: 209 },
  ];

  const COLLS = {
    zellige: { name: { fr: "Zellige & Maroc", ar: "زليج ومغرب" } },
    clear: { name: { fr: "Transparent MagSafe", ar: "شفاف MagSafe" } },
    cuir: { name: { fr: "Cuir", ar: "جلد" } },
    armor: { name: { fr: "Antichoc", ar: "مضاد للصدمات" } },
  };

  const ACCESSORIES = [
    { key: "charger", name: { fr: "Chargeur rapide 30 W USB-C", ar: "شاحن سريع 30 واط USB-C" }, icon: "charger", colors: ["#f5f5f4", "#111827"], price: 149, old: 199 },
    { key: "cable", name: { fr: "Câble tressé USB-C 2 m", ar: "كابل مضفور USB-C 2 متر" }, icon: "cable", colors: ["#0e7a5f", "#111827"], price: 79, old: 99 },
    { key: "glass", name: { fr: "Verre trempé 9H (x2)", ar: "زجاج مقوى 9H (x2)" }, icon: "glass", colors: ["#cfe3ee"], price: 69, old: 99, badge: { fr: "Pack x2", ar: "x2" } },
    { key: "magsafe", name: { fr: "Chargeur MagSafe 15 W", ar: "شاحن MagSafe 15 واط" }, icon: "puck", colors: ["#f5f5f4"], price: 179, old: 229 },
    { key: "strap", name: { fr: "Cordon tour de cou", ar: "حبل للعنق" }, icon: "strap", colors: ["#f2b33d", "#0e7a5f", "#111827"], price: 59, old: 79, isNew: true },
    { key: "stand", name: { fr: "Support voiture magnétique", ar: "حامل مغناطيسي للسيارة" }, icon: "stand", colors: ["#111827"], price: 129, old: 169 },
  ];

  // Deterministic pseudo-random so the demo looks the same on every visit
  const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };

  const PRODUCTS = [];
  BRANDS.forEach((b, bi) => b.models.forEach((m, mi) => {
    const ms = slug(m);
    DESIGNS.forEach((d, di) => {
      // Not every design for every model (older models get fewer)
      if ((hash(ms + d.key) % 10) < Math.min(2 + mi, 4) && di > 2) return;
      const h = hash(ms + d.key);
      PRODUCTS.push({
        id: `${d.key}-${ms}`, brand: b.id, model: m, modelSlug: ms, cam: b.cam, design: d.key, coll: d.coll,
        name: d.name, pattern: d.pattern, colors: d.colors, price: d.price + (mi === 0 && bi < 2 ? 20 : 0), old: d.old + (mi === 0 && bi < 2 ? 20 : 0),
        badge: d.badge, isNew: !!d.isNew || mi === 0, pop: (h % 1000) + (d.badge ? 400 : 0) + (b.id === "iphone" ? 300 : 0) + (mi < 2 ? 200 : 0),
        rating: 4.5 + ((h >> 3) % 5) / 10, reviews: 12 + (h % 180), order: bi * 1000 + mi * 50 + di,
      });
    });
  }));
  ACCESSORIES.forEach((a, i) => PRODUCTS.push({
    id: `acc-${a.key}`, brand: "accessoires", model: null, modelSlug: null, accessory: a.icon, name: a.name, colors: a.colors,
    price: a.price, old: a.old, badge: a.badge, isNew: !!a.isNew, pop: 500 - i * 40, rating: 4.6, reviews: 40 + i * 17, order: 90000 + i,
  }));
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const productTitle = (p) => (p.model ? `${L(p.name)} — ${p.model}` : L(p.name));

  const CITIES = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Témara", "Mohammedia", "El Jadida", "Béni Mellal", "Nador", "Safi", "Khouribga", "Settat", "Laâyoune", "Dakhla", "Essaouira", "Ouarzazate", "Errachidia", "Taza", "Larache", "Khémisset", "Berrechid", "Guelmim", "Autre ville"];

  /* ---------- Case art (original SVG drawings) ---------- */
  let uid = 0;
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const f = (v) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
    return "#" + ((1 << 24) + (f(n >> 16) << 16) + (f((n >> 8) & 255) << 8) + f(n & 255)).toString(16).slice(1);
  }
  function camera(cam, dark) {
    const lens = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#0b0f14"/><circle cx="${x}" cy="${y}" r="${r * .62}" fill="#1d2a3a"/><circle cx="${x - r * .25}" cy="${y - r * .25}" r="${r * .18}" fill="#8fb3d9" opacity=".8"/>`;
    const plate = dark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.18)";
    switch (cam) {
      case "vert": return `${lens(30, 30, 9)}${lens(30, 54, 9)}${lens(30, 78, 9)}<circle cx="50" cy="32" r="3" fill="#fde68a"/>`;
      case "square": return `<rect x="14" y="14" width="56" height="56" rx="14" fill="${plate}"/>${lens(31, 31, 9)}${lens(53, 31, 9)}${lens(31, 53, 9)}<circle cx="53" cy="53" r="3" fill="#fde68a"/>`;
      case "round": return `<circle cx="44" cy="44" r="30" fill="${plate}"/>${lens(44, 30, 8)}${lens(32, 52, 8)}${lens(56, 52, 8)}`;
      case "bar": return `<rect x="8" y="24" width="144" height="32" rx="16" fill="#0b0f14" opacity=".85"/>${lens(36, 40, 9)}${lens(62, 40, 9)}<circle cx="122" cy="40" r="3" fill="#fde68a"/>`;
      default: return `<rect x="14" y="14" width="70" height="70" rx="20" fill="${plate}"/>${lens(34, 34, 11)}${lens(34, 64, 11)}${lens(64, 49, 11)}<circle cx="66" cy="26" r="4" fill="#fde68a"/>`;
    }
  }
  function patternDefs(id, pattern, c) {
    const d = shade(c, -.18), l = shade(c, .22);
    switch (pattern) {
      case "zellige": return `<pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="${c}"/><path d="M20 4l4.7 11.3L36 20l-11.3 4.7L20 36l-4.7-11.3L4 20l11.3-4.7z" fill="${l}"/><path d="M20 12l2.3 5.7L28 20l-5.7 2.3L20 28l-2.3-5.7L12 20l5.7-2.3z" fill="#f6efe2"/><circle cx="0" cy="0" r="5" fill="${d}"/><circle cx="40" cy="0" r="5" fill="${d}"/><circle cx="0" cy="40" r="5" fill="${d}"/><circle cx="40" cy="40" r="5" fill="${d}"/></pattern>`;
      case "amazigh": { const fg = c === "#0c1f1a" ? "#f2b33d" : "#0c1f1a"; return `<pattern id="${id}" width="36" height="30" patternUnits="userSpaceOnUse"><rect width="36" height="30" fill="${c}"/><path d="M0 15l9-9 9 9-9 9zM18 15l9-9 9 9-9 9z" fill="none" stroke="${fg}" stroke-width="2.4"/><circle cx="9" cy="15" r="2" fill="#b91c1c"/><circle cx="27" cy="15" r="2" fill="#0e7a5f"/></pattern>`; }
      case "carbon": return `<pattern id="${id}" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="${c}"/><rect width="6" height="6" fill="${l}"/><rect x="6" y="6" width="6" height="6" fill="${l}"/><path d="M0 6h6M6 0v6" stroke="${d}" stroke-width=".8"/></pattern>`;
      case "leather": case "wallet": return `<filter id="${id}n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .35 0"/><feComposite in2="SourceGraphic" operator="in"/></filter><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${l}"/><stop offset="1" stop-color="${d}"/></linearGradient>`;
      case "marble": { const v = c === "#1f1f1f" ? "#d4af37" : "#b8a88a"; return `<pattern id="${id}" width="200" height="200" patternUnits="userSpaceOnUse"><rect width="200" height="200" fill="${c}"/><path d="M-10 40C40 30 60 90 120 70s70 20 100 0M-10 130c50-20 90 30 140 10s50-40 90-30M30 -10c10 60 60 80 40 140" fill="none" stroke="${v}" stroke-width="1.6" opacity=".75"/><path d="M60 -10c-10 50 30 60 20 110M150 60c20 40-10 70 10 140" fill="none" stroke="${v}" stroke-width=".8" opacity=".6"/></pattern>`; }
      case "clear": case "frost": return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".85"/><stop offset=".5" stop-color="${c}" stop-opacity="${pattern === "frost" ? ".75" : ".45"}"/><stop offset="1" stop-color="${d}" stop-opacity="${pattern === "frost" ? ".85" : ".55"}"/></linearGradient>`;
      default: return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${l}"/><stop offset="1" stop-color="${d}"/></linearGradient>`;
    }
  }
  function caseSVG(p, color, opts = {}) {
    if (p.accessory) return accessorySVG(p.accessory, color);
    const id = "g" + (++uid);
    const c = color || p.colors[0];
    const dark = ["#0c1f1a", "#111827", "#1f1f1f", "#1f2937", "#3b2412", "#374151"].includes(c);
    const W = 200, H = 400;
    let body = `<rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="38" fill="url(#${id})"/>`;
    let extra = "";
    if (p.pattern === "star") {
      body = `<rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="38" fill="${c}"/>`;
      const sc = c === "#b91c1c" ? "#0e7a5f" : "#b91c1c";
      extra = `<g transform="translate(100 236)"><path d="M0-58L13.6 18.8-35.6-28.4H35.6L-13.6 18.8z" transform="rotate(180) scale(1.05)" fill="none" stroke="${sc}" stroke-width="7" stroke-linejoin="round"/></g><text x="100" y="352" text-anchor="middle" font-family="Tajawal, sans-serif" font-weight="800" font-size="30" fill="#f6efe2" opacity=".9">المغرب</text>`;
    }
    if (p.pattern === "leather" || p.pattern === "wallet") {
      extra += `<rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="38" fill="${c}" filter="url(#${id}n)"/><rect x="16" y="16" width="${W - 32}" height="${H - 32}" rx="30" fill="none" stroke="${shade(c, .3)}" stroke-width="1.6" stroke-dasharray="5 4"/>`;
      if (p.pattern === "wallet") extra += `<rect x="6" y="170" width="${W - 12}" height="150" rx="4" fill="${shade(c, -.06)}"/><rect x="6" y="170" width="${W - 12}" height="150" fill="none" stroke="${shade(c, .3)}" stroke-width="1.4" stroke-dasharray="5 4"/><rect x="150" y="226" width="40" height="38" rx="8" fill="#c8a24a"/><circle cx="170" cy="245" r="6" fill="#8a6a22"/>`;
    }
    if (p.pattern === "armor") {
      extra += `<path d="M6 120h188M6 300h188" stroke="${shade(c, .15)}" stroke-width="3"/><g fill="${shade(c, -.1)}"><rect x="6" y="6" width="44" height="44" rx="22"/><rect x="150" y="6" width="44" height="44" rx="22"/><rect x="6" y="350" width="44" height="44" rx="22"/><rect x="150" y="350" width="44" height="44" rx="22"/></g><circle cx="100" cy="236" r="40" fill="none" stroke="#c0c6cc" stroke-width="8"/><circle cx="100" cy="236" r="28" fill="${shade(c, -.12)}"/>`;
    }
    if (p.pattern === "clear" || p.pattern === "frost") {
      extra += `<circle cx="100" cy="230" r="46" fill="none" stroke="${shade(c, -.35)}" stroke-width="7" opacity=".7"/><path d="M100 184v-18" stroke="${shade(c, -.35)}" stroke-width="7" opacity=".7" stroke-linecap="round"/>`;
      if (p.pattern === "clear") extra += `<path d="M40 30L150 380" stroke="#fff" stroke-width="18" opacity=".25"/>`;
    }
    const camX = p.cam === "bar" ? 20 : 16, camY = p.cam === "bar" ? 44 : 16;
    const camBox = `<g transform="translate(${camX} ${camY})">${camera(p.cam, dark)}</g>`;
    const brand = `<text x="100" y="${p.pattern === "star" ? 316 : 372}" text-anchor="middle" font-family="Outfit, sans-serif" font-weight="800" font-size="13" letter-spacing="3" fill="${dark || p.pattern === "zellige" ? "#f6efe2" : "#0c1f1a"}" opacity=".45">WA9I</text>`;
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(productTitle(p))}"${opts.cls ? ` class="${opts.cls}"` : ""}><defs>${patternDefs(id, p.pattern, c)}</defs>
      <rect x="0" y="0" width="${W}" height="${H}" rx="44" fill="${shade(c, -.28)}"/>${body}${extra}${camBox}${brand}
      <rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="38" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="2"/></svg>`;
  }
  function accessorySVG(icon, color) {
    const c = color || "#111827";
    const s = (inner) => `<svg viewBox="0 0 200 240" role="img" aria-hidden="true">${inner}</svg>`;
    switch (icon) {
      case "charger": return s(`<rect x="50" y="40" width="100" height="120" rx="22" fill="${c}" stroke="#cbd5e1" stroke-width="3"/><rect x="88" y="150" width="24" height="16" rx="4" fill="#94a3b8"/><rect x="78" y="166" width="10" height="34" rx="3" fill="#94a3b8"/><rect x="112" y="166" width="10" height="34" rx="3" fill="#94a3b8"/><text x="100" y="108" text-anchor="middle" font-family="Outfit" font-weight="800" font-size="26" fill="${c === "#111827" ? "#f2b33d" : "#0e7a5f"}">30W</text>`);
      case "cable": return s(`<path d="M60 50c0 60 80 30 80 90s-70 40-70 70" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round" stroke-dasharray="4 3"/><rect x="48" y="18" width="24" height="40" rx="6" fill="#cbd5e1"/><rect x="58" y="200" width="24" height="34" rx="6" fill="#cbd5e1"/>`);
      case "glass": return s(`<rect x="56" y="18" width="88" height="190" rx="18" fill="#cfe3ee" opacity=".7" stroke="#7aa6bd" stroke-width="3"/><rect x="70" y="30" width="88" height="190" rx="18" fill="#e7f2f8" opacity=".85" stroke="#7aa6bd" stroke-width="3"/><path d="M84 50l40 120" stroke="#fff" stroke-width="10" opacity=".8"/><text x="114" y="136" text-anchor="middle" font-family="Outfit" font-weight="800" font-size="24" fill="#0e7a5f">9H</text>`);
      case "puck": return s(`<circle cx="100" cy="100" r="64" fill="${c}" stroke="#cbd5e1" stroke-width="4"/><circle cx="100" cy="100" r="40" fill="none" stroke="#94a3b8" stroke-width="5"/><path d="M100 164c0 30 30 30 30 66" fill="none" stroke="#e5e7eb" stroke-width="8" stroke-linecap="round"/>`);
      case "strap": return s(`<path d="M50 30c-10 110 30 160 50 170 20-10 60-60 50-170" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/><rect x="84" y="190" width="32" height="40" rx="8" fill="#0c1f1a"/><circle cx="100" cy="210" r="6" fill="#cbd5e1"/>`);
      default: return s(`<rect x="60" y="40" width="80" height="80" rx="40" fill="${c}"/><circle cx="100" cy="80" r="22" fill="none" stroke="#94a3b8" stroke-width="5"/><rect x="92" y="118" width="16" height="50" fill="${c}"/><rect x="60" y="166" width="80" height="22" rx="8" fill="${c}"/><path d="M70 188l-8 30M130 188l8 30" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`);
    }
  }

  /* ---------- Cart ---------- */
  let cart = store.get("cart", []).filter((l) => byId[l.id]);
  let coupon = store.get("coupon", "");
  const saveCart = () => { store.set("cart", cart); store.set("coupon", coupon); updateCartUI(); };
  const cartCount = () => cart.reduce((a, l) => a + l.qty, 0);
  const cartSub = () => cart.reduce((a, l) => a + byId[l.id].price * l.qty, 0);
  const shippingCost = (items) => (items >= CONFIG.freeShippingFrom || (coupon === CONFIG.coupon.code && items >= CONFIG.coupon.minItems) ? 0 : CONFIG.shipping);
  function addToCart(id, color, qty = 1, silent) {
    const p = byId[id]; if (!p) return;
    color = color || p.colors[0];
    const line = cart.find((l) => l.id === id && l.color === color);
    if (line) line.qty = Math.min(20, line.qty + qty); else cart.push({ id, color, qty });
    saveCart();
    if (!silent) { toast(t("added")); const c = $("#cartCount"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
  }

  /* ---------- DOM helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let toastTimer;
  function toast(msg) { const el = $("#toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2200); }

  /* ---------- Shared UI pieces ---------- */
  const ICON = {
    plus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
    cash: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 10v4M18 10v4"/></svg>`,
    truck: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
    swap: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>`,
    chat: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>`,
    bolt: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>`,
    check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>`,
  };
  function card(p) {
    const off = Math.round((1 - p.price / p.old) * 100);
    return `<article class="card">
      <a class="card-img" href="#/p/${p.id}" tabindex="-1" aria-hidden="true">
        ${p.badge ? `<span class="badge">${esc(L(p.badge))}</span>` : ""}<span class="badge off">-${off}%</span>
        ${caseSVG(p)}
      </a>
      <div class="card-body">
        <span class="card-model">${esc(p.model || t("accessories"))}</span>
        <a class="card-title" href="#/p/${p.id}">${esc(L(p.name))}</a>
        ${p.colors.length > 1 ? `<span class="swatches">${p.colors.map((c) => `<i style="background:${c}"></i>`).join("")}</span>` : ""}
        <div class="price"><b>${money(p.price)}</b><s>${money(p.old)}</s></div>
        <div class="card-actions">
          <a class="btn btn-primary" href="#/p/${p.id}#order">${t("buy")}</a>
          <button type="button" class="btn btn-ghost add-ic" data-add="${p.id}" aria-label="${t("add")} : ${esc(productTitle(p))}">${ICON.plus}</button>
        </div>
      </div>
    </article>`;
  }
  const grid = (list) => `<div class="grid">${list.map(card).join("")}</div>`;
  const brandName = (id) => (id === "accessoires" ? t("accessories") : BRANDS.find((b) => b.id === id)?.name || id);
  const crumbs = (items) => `<nav class="crumbs" aria-label="Fil d’Ariane"><a href="#/">${t("home")}</a>${items.map(([href, label]) => ` / ${href ? `<a href="${href}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`}`).join("")}</nav>`;

  function codFields(prefix, light) {
    return `<div class="fields${light ? " light" : ""}">
      <div class="field"><label for="${prefix}name">${t("fName")}</label><input id="${prefix}name" name="name" autocomplete="name" required><span class="err"></span></div>
      <div class="field"><label for="${prefix}phone">${t("fPhone")}</label><input id="${prefix}phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="06 12 34 56 78" required dir="ltr"><span class="err"></span></div>
      <div class="field"><label for="${prefix}city">${t("fCity")}</label><select id="${prefix}city" name="city" required><option value="">${t("fCityPh")}</option>${CITIES.map((c) => `<option>${c}</option>`).join("")}</select><span class="err"></span></div>
      <div class="field"><label for="${prefix}address">${t("fAddress")}</label><input id="${prefix}address" name="address" autocomplete="street-address" required><span class="err"></span></div>
      ${light ? `<div class="field full"><label for="${prefix}note">${t("fNote")}</label><textarea id="${prefix}note" name="note"></textarea></div>` : ""}
    </div>`;
  }
  const normPhone = (v) => { let d = v.replace(/\D/g, ""); if (d.startsWith("00212")) d = d.slice(5); else if (d.startsWith("212")) d = d.slice(3); if (d.length === 9) d = "0" + d; return d; };
  function validate(form) {
    let ok = true;
    const rules = { name: (v) => v.trim().length >= 3 || t("eName"), city: (v) => !!v || t("eCity"), address: (v) => v.trim().length >= 5 || t("eAddress"), phone: (v) => /^0[5-7]\d{8}$/.test(normPhone(v)) || t("ePhone") };
    for (const [k, fn] of Object.entries(rules)) {
      const el = form.elements[k]; const r = fn(el.value); const f = el.closest(".field");
      f.classList.toggle("bad", r !== true); f.querySelector(".err").textContent = r === true ? "" : r;
      if (r !== true && ok) { el.focus(); ok = false; }
    }
    return ok;
  }
  function placeOrder(form, lines) {
    if (!validate(form)) return;
    const data = Object.fromEntries(new FormData(form));
    const items = lines.reduce((a, l) => a + l.qty, 0);
    const sub = lines.reduce((a, l) => a + byId[l.id].price * l.qty, 0);
    const ship = shippingCost(items);
    const ref = "W9-" + Date.now().toString(36).slice(-5).toUpperCase();
    const phone = normPhone(data.phone);
    const msg = [`${t("waIntro")} · ${ref}`, "", ...lines.map((l) => `• ${l.qty} × ${productTitle(byId[l.id])} (${l.color}) — ${money(byId[l.id].price * l.qty)}`), "",
      `${t("shipping")}: ${ship ? money(ship) : t("free")}`, `${t("total")}: ${money(sub + ship)}`, "",
      `${t("fName")}: ${data.name.trim()}`, `${t("fPhone")}: ${phone}`, `${t("fCity")}: ${data.city}`, `${t("fAddress")}: ${data.address.trim()}`, data.note ? `${t("fNote")}: ${data.note.trim()}` : ""].filter((x) => x !== null).join("\n");
    const wa = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    store.set("lastOrder", { ref, phone, wa });
    if (lines === cart) { cart = []; coupon = ""; saveCart(); }
    location.hash = "#/merci";
  }

  /* ---------- Views ---------- */
  const views = {};
  views.home = () => {
    const best = [...PRODUCTS].filter((p) => !p.accessory).sort((a, b) => b.pop - a.pop).filter((p, i, arr) => arr.findIndex((q) => q.design === p.design) === i).slice(0, 10);
    const fresh = PRODUCTS.filter((p) => p.isNew && p.brand !== "accessoires").sort((a, b) => a.order - b.order).filter((p, i, arr) => arr.findIndex((q) => q.design === p.design) === i).slice(0, 5);
    const demoP = (design, model, color) => ({ ...byId[`${design}-${slug(model)}`], _c: color });
    const art = (arr) => arr.map((p) => caseSVG(p, p._c)).join("");
    const zbg = `<svg class="zellige-bg" width="100%" height="100%" aria-hidden="true"><defs>${patternDefs("zbg", "zellige", "#0c1f1a")}</defs><rect width="100%" height="100%" fill="url(#zbg)"/></svg>`;
    return `<section class="hero"><div class="wrap">
      <div class="slider" id="slider" aria-roledescription="carrousel">
        <div class="slide s1 on" aria-roledescription="diapositive">${zbg}<div><span class="slide-kicker">${t("s1k")}</span><h1>${t("s1t")}</h1><p>${t("s1p")}</p><a class="btn btn-gold" href="#/collection/zellige">${t("shopNow")}</a></div>
          <div class="slide-art">${art([demoP("najma", "iPhone 17 Pro", "#b91c1c"), demoP("zellige", "iPhone 18 Pro Max", "#0e7a5f"), demoP("amazigh", "Galaxy S26 Ultra", "#f2b33d")])}</div></div>
        <div class="slide s2" aria-roledescription="diapositive"><div><span class="slide-kicker">${t("s2k")}</span><h2>${t("s2t")}</h2><p>${t("s2p")}</p><a class="btn btn-gold" href="#/collection/clear">${t("shopNow")}</a></div>
          <div class="slide-art">${art([demoP("frost", "iPhone 18 Pro", "#86efac"), demoP("clear", "iPhone 18 Pro Max", "#cfe3ee"), demoP("frost", "iPhone 17 Pro Max", "#fda4af")])}</div></div>
        <div class="slide s3" aria-roledescription="diapositive"><div><span class="slide-kicker">${t("s3k")}</span><h2>${t("s3t")}</h2><p>${t("s3p")}</p><a class="btn btn-gold" href="#/collection/cuir">${t("shopNow")}</a></div>
          <div class="slide-art">${art([demoP("wallet", "Galaxy S26 Ultra", "#7f1d1d"), demoP("leather", "iPhone 18 Pro Max", "#7c4a21"), demoP("leather", "Pixel 10 Pro", "#2f4a3a")])}</div></div>
        <div class="dots" role="tablist">${[0, 1, 2].map((i) => `<button type="button" aria-label="${i + 1}" aria-current="${i === 0}" data-dot="${i}"></button>`).join("")}</div>
      </div>
      <div class="trust">
        <div>${ICON.cash}<p><b>${t("tr1")}</b><span>${t("tr1s")}</span></p></div>
        <div>${ICON.truck}<p><b>${t("tr2")}</b><span>${t("tr2s")}</span></p></div>
        <div>${ICON.swap}<p><b>${t("tr3")}</b><span>${t("tr3s")}</span></p></div>
        <div>${ICON.chat}<p><b>${t("tr4")}</b><span>${t("tr4s")}</span></p></div>
      </div></div></section>
    <section class="section"><div class="wrap">
      <div class="sec-head"><h2>${t("byBrand")}</h2></div>
      <div class="brands">${BRANDS.map((b) => `<a class="brand-tile" href="#/c/${b.id}"><span class="bt-ic">${b.name[0]}</span>${b.name}<small>${b.models.length} ${t("models")}</small></a>`).join("")}<a class="brand-tile" href="#/c/accessoires"><span class="bt-ic">⚡</span>${t("accessories")}<small>${ACCESSORIES.length} ${t("products")}</small></a></div>
    </div></section>
    <section class="section"><div class="wrap">
      <div class="sec-head"><h2>${t("collections")}</h2></div>
      <div class="collections">
        <a class="coll coll-zellige" href="#/collection/zellige">${caseSVG(byId["zellige-iphone-17-pro"], "#0e7a5f")}<b>${t("cZ")}</b><span>${t("cZs")}</span></a>
        <a class="coll coll-cuir" href="#/collection/cuir">${caseSVG(byId["leather-iphone-18-pro-max"], "#7c4a21")}<b>${t("cC")}</b><span>${t("cCs")}</span></a>
        <a class="coll coll-clear" href="#/collection/clear">${caseSVG(byId["clear-iphone-18-pro-max"], "#cfe3ee")}<b>${t("cT")}</b><span>${t("cTs")}</span></a>
        <a class="coll coll-armor" href="#/collection/armor">${caseSVG(byId["armor-galaxy-s26-ultra"], "#9a3412")}<b>${t("cA")}</b><span>${t("cAs")}</span></a>
      </div>
    </div></section>
    <section class="section"><div class="wrap"><div class="sec-head"><h2>${t("best")}</h2><a href="#/c/iphone">${t("seeAll")} →</a></div>${grid(best)}</div></section>
    <section class="section"><div class="wrap"><div class="sec-head"><h2>${t("newIn")}</h2><a href="#/c/accessoires">${t("accessories")} →</a></div>${grid(fresh)}</div></section>`;
  };

  function listing({ title, crumb, list, brand, model, coll, q }) {
    const sort = store.get("sort", "pop");
    const sorters = { pop: (a, b) => b.pop - a.pop, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, new: (a, b) => (b.isNew - a.isNew) || a.order - b.order };
    list = [...list].sort(sorters[sort] || sorters.pop);
    const b = BRANDS.find((x) => x.id === brand);
    const side = `<aside class="side" aria-label="${t("filterBrand")}"><h3>${t("filterBrand")}</h3>
      ${BRANDS.map((x) => `<details${x.id === brand ? " open" : ""}><summary class="${x.id === brand ? "cur" : ""}">${x.name}</summary>
        <a href="#/c/${x.id}" class="${x.id === brand && !model ? "cur" : ""}">${t("all")}</a>
        ${x.models.map((m) => `<a href="#/c/${x.id}/${slug(m)}" class="${model === slug(m) ? "cur" : ""}">${m}</a>`).join("")}</details>`).join("")}
      <a href="#/c/accessoires" class="${brand === "accessoires" ? "cur" : ""}" style="padding-inline-start:10px;font-weight:600">${t("accessories")}</a>
    </aside>`;
    const chips = b ? `<div class="chips"><a class="chip${!model ? " cur" : ""}" href="#/c/${b.id}">${t("all")}</a>${b.models.map((m) => `<a class="chip${model === slug(m) ? " cur" : ""}" href="#/c/${b.id}/${slug(m)}">${m}</a>`).join("")}</div>` : "";
    const PAGE = 12;
    return { html: `<div class="wrap">${crumbs(crumb)}<h1 class="page-title">${q ? `${t("resultsFor")} « ${esc(q)} »` : esc(title)}</h1>
      <div class="cat">${side}<div>
        ${chips}
        <div class="toolbar"><p>${list.length} ${t("products")}</p>
          <label><span class="sr" hidden>${t("sort")}</span><select class="select" id="sortSel" aria-label="${t("sort")}">
            ${[["pop", "sortPop"], ["new", "sortNew"], ["low", "sortLow"], ["high", "sortHigh"]].map(([v, k]) => `<option value="${v}"${v === sort ? " selected" : ""}>${t(k)}</option>`).join("")}
          </select></label></div>
        ${list.length ? `<div id="gridHost">${grid(list.slice(0, PAGE))}</div>${list.length > PAGE ? `<div class="more"><button type="button" class="btn btn-ghost" id="moreBtn">${t("showMore")}</button></div>` : ""}` : `<div class="empty"><p><b>${t("noRes")}</b></p><p>${t("noResHint")}</p><a class="btn btn-primary" href="#/">${t("continue")}</a></div>`}
      </div></div></div>`,
      after() {
        $("#sortSel")?.addEventListener("change", (e) => { store.set("sort", e.target.value); render(); });
        let shown = PAGE;
        $("#moreBtn")?.addEventListener("click", (e) => { shown += PAGE; $("#gridHost").innerHTML = grid(list.slice(0, shown)); if (shown >= list.length) e.target.closest(".more").remove(); });
      } };
  }
  views.brand = ([brand, model]) => {
    if (brand === "accessoires") return listing({ title: t("accessories"), crumb: [[null, t("accessories")]], list: PRODUCTS.filter((p) => p.accessory), brand });
    const b = BRANDS.find((x) => x.id === brand); if (!b) return views.notFound();
    const m = model && b.models.find((x) => slug(x) === model);
    if (model && !m) return views.notFound();
    const list = PRODUCTS.filter((p) => p.brand === brand && (!model || p.modelSlug === model));
    return listing({ title: m ? `${lang === "ar" ? "كوكات" : "Coques"} ${m}` : `${lang === "ar" ? "كوكات" : "Coques"} ${b.name}`, crumb: m ? [[`#/c/${b.id}`, b.name], [null, m]] : [[null, b.name]], list, brand, model });
  };
  views.collection = ([c]) => {
    if (!COLLS[c]) return views.notFound();
    return listing({ title: L(COLLS[c].name), crumb: [[null, L(COLLS[c].name)]], list: PRODUCTS.filter((p) => p.coll === c), coll: c });
  };
  views.search = ([q = ""]) => {
    q = decodeURIComponent(q).trim();
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hay = (p) => `${p.model || ""} ${brandName(p.brand)} ${p.name.fr} ${p.name.ar} ${p.coll || ""}`.toLowerCase();
    const list = terms.length ? PRODUCTS.filter((p) => terms.every((w) => hay(p).includes(w))) : [];
    return listing({ title: q, crumb: [[null, q]], list, q });
  };

  views.product = ([id]) => {
    const p = byId[id]; if (!p) return views.notFound();
    let color = p.colors[0], view = 0;
    const off = Math.round((1 - p.price / p.old) * 100);
    const b = BRANDS.find((x) => x.id === p.brand);
    const siblings = b ? b.models.map((m) => byId[`${p.design}-${slug(m)}`]).filter(Boolean) : [];
    const related = PRODUCTS.filter((x) => x.id !== p.id && (p.accessory ? x.accessory : x.modelSlug === p.modelSlug)).sort((a, c) => c.pop - a.pop).slice(0, 4);
    const stars = "★★★★★".slice(0, Math.round(p.rating)) + "☆☆☆☆☆".slice(0, 5 - Math.round(p.rating));
    return { html: `<div class="wrap">${crumbs(p.model ? [[`#/c/${p.brand}`, brandName(p.brand)], [`#/c/${p.brand}/${p.modelSlug}`, p.model], [null, L(p.name)]] : [[`#/c/accessoires`, t("accessories")], [null, L(p.name)]])}
      <div class="pdp">
        <div class="gallery">
          <div class="g-main" id="gMain">${caseSVG(p, color)}</div>
          ${p.accessory ? "" : `<div class="g-thumbs" id="gThumbs">${[0, 1].map((i) => `<button type="button" aria-pressed="${i === 0}" data-view="${i}" aria-label="Vue ${i + 1}">${caseSVG(p, color)}</button>`).join("")}</div>`}
        </div>
        <div class="pdp-info">
          <span class="card-model">${esc(p.model || t("accessories"))}</span>
          <h1>${esc(productTitle(p))}</h1>
          <div class="rating"><span class="stars" aria-hidden="true">${stars}</span><span>${p.rating.toFixed(1)} · ${p.reviews} ${t("reviews")}</span></div>
          <div class="pdp-price"><b>${money(p.price)}</b><s>${money(p.old)}</s><span class="save">-${off}%</span></div>
          ${p.colors.length > 1 ? `<p class="opt-label">${t("colour")}</p><div class="colors" id="colors">${p.colors.map((c, i) => `<button type="button" style="background:${c}" aria-pressed="${i === 0}" data-color="${c}" aria-label="${t("colour")} ${i + 1}"></button>`).join("")}</div>` : ""}
          ${siblings.length > 1 ? `<p class="opt-label">${t("forModel")}</p><div class="models">${siblings.map((s) => `<a href="#/p/${s.id}"${s.id === p.id ? ' aria-current="page"' : ""}>${s.model}</a>`).join("")}</div>` : ""}
          <p class="stock">${t("inStock")}</p>
          <div class="buy-row">
            <div class="qty"><button type="button" data-q="-1" aria-label="-">−</button><input id="qty" type="number" min="1" max="20" value="1" aria-label="${t("qty")}"><button type="button" data-q="1" aria-label="+">+</button></div>
            <button type="button" class="btn btn-ghost" id="addBtn">${t("add")}</button>
          </div>
          <form class="cod" id="order" novalidate>
            <h2>${ICON.bolt}${t("codTitle")}</h2>
            <p>${t("codSub")}</p>
            ${codFields("o-")}
            <div class="cod-sum"><span>${t("total")} <small id="codShip"></small></span><b id="codTotal"></b></div>
            <button class="btn btn-gold btn-block" type="submit">${t("orderBtn")}</button>
            <div class="cod-note"><span>${t("nPay")}</span><span>${t("nCall")}</span><span>${t("nSwap")}</span></div>
          </form>
          <div class="acc">
            <details open><summary>${t("dFeat")}</summary><ul>${T[lang].feat.map((f) => `<li>${f}</li>`).join("")}</ul></details>
            <details><summary>${t("dShip")}</summary><p>${t("dShipTxt")}</p></details>
          </div>
        </div>
      </div>
      ${related.length ? `<section class="section"><div class="sec-head"><h2>${t("related")}</h2></div>${grid(related)}</section>` : ""}
    </div>`,
      after() {
        const main = $("#gMain"), qtyEl = $("#qty");
        const paint = () => {
          main.innerHTML = caseSVG(p, color); main.classList.toggle("side-v", view === 1);
          $$("#gThumbs button").forEach((b2, i) => { b2.innerHTML = caseSVG(p, color); b2.setAttribute("aria-pressed", i === view); });
        };
        const qty = () => Math.max(1, Math.min(20, parseInt(qtyEl.value, 10) || 1));
        const sum = () => { const q = qty(); const ship = shippingCost(q); $("#codTotal").textContent = money(p.price * q + ship); $("#codShip").textContent = `(${t("shipping")} : ${ship ? money(ship) : t("free")})`; };
        $$("#colors button").forEach((btn) => btn.addEventListener("click", () => { color = btn.dataset.color; $$("#colors button").forEach((x) => x.setAttribute("aria-pressed", x === btn)); paint(); }));
        $$("#gThumbs button").forEach((btn) => btn.addEventListener("click", () => { view = +btn.dataset.view; paint(); }));
        $$("[data-q]").forEach((btn) => btn.addEventListener("click", () => { qtyEl.value = Math.max(1, Math.min(20, qty() + +btn.dataset.q)); sum(); }));
        qtyEl.addEventListener("input", sum);
        $("#addBtn").addEventListener("click", () => addToCart(p.id, color, qty()));
        $("#order").addEventListener("submit", (e) => { e.preventDefault(); placeOrder(e.target, [{ id: p.id, color, qty: qty() }]); });
        sum();
      } };
  };

  function totalsBox(withBtn) {
    const items = cartCount(), sub = cartSub(), ship = shippingCost(items), left = Math.max(0, CONFIG.freeShippingFrom - items);
    return `<div class="totals"><h2>${t("summary")}</h2>
      <div class="progress">${left ? t("freeLeft", { n: left }) : `<span class="free">${t("freeYes")}</span>`}<div class="bar"><i style="width:${Math.min(100, (items / CONFIG.freeShippingFrom) * 100)}%"></i></div></div>
      <div class="trow"><span>${t("subtotal")}</span><span>${money(sub)}</span></div>
      <div class="trow"><span>${t("shipping")}</span><span class="${ship ? "" : "free"}">${ship ? money(ship) : t("free")}</span></div>
      <form class="coupon" id="couponForm"><input name="c" aria-label="${t("coupon")}" placeholder="${t("coupon")}" value="${esc(coupon)}"><button class="btn btn-ghost" type="submit">${t("apply")}</button></form>
      <div class="trow total"><span>${t("total")}</span><span>${money(sub + ship)}</span></div>
      ${withBtn ? `<a class="btn btn-primary btn-block" href="#/commande" style="margin-top:12px">${t("checkout")}</a>` : ""}
      <div class="cod-note" style="color:var(--muted)"><span>${t("nPay")}</span><span>${t("nSwap")}</span></div>
    </div>`;
  }
  function bindCoupon() {
    $("#couponForm")?.addEventListener("submit", (e) => {
      e.preventDefault(); const v = e.target.elements.c.value.trim().toUpperCase();
      if (v === CONFIG.coupon.code) { coupon = v; saveCart(); toast(t("couponOk")); render(); } else { coupon = ""; saveCart(); toast(t("couponBad")); }
    });
  }
  const lineHTML = (l, i) => { const p = byId[l.id]; return `<div class="line">
    <a class="line-img" href="#/p/${p.id}" aria-hidden="true" tabindex="-1">${caseSVG(p, l.color)}</a>
    <div><a class="line-t" href="#/p/${p.id}">${esc(L(p.name))}<small>${esc(p.model || t("accessories"))} · <i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${l.color};vertical-align:middle;border:1px solid #0002"></i></small></a><br><button type="button" class="rm" data-rm="${i}">${t("remove")}</button></div>
    <div class="qty"><button type="button" data-lq="${i}" data-d="-1" aria-label="-">−</button><input value="${l.qty}" readonly aria-label="${t("qty")}"><button type="button" data-lq="${i}" data-d="1" aria-label="+">+</button></div>
    <span class="line-p">${money(p.price * l.qty)}</span></div>`; };
  function bindLines(root = document) {
    $$("[data-rm]", root).forEach((b) => b.addEventListener("click", () => { cart.splice(+b.dataset.rm, 1); saveCart(); render(); }));
    $$("[data-lq]", root).forEach((b) => b.addEventListener("click", () => { const l = cart[+b.dataset.lq]; l.qty = Math.max(1, Math.min(20, l.qty + +b.dataset.d)); saveCart(); render(); }));
  }
  const emptyCart = () => `<div class="empty" style="margin:24px 0 40px"><p><b>${t("cartEmpty")}</b></p><a class="btn btn-primary" href="#/">${t("continue")}</a></div>`;
  views.cart = () => ({ html: `<div class="wrap">${crumbs([[null, t("cart")]])}<h1 class="page-title">${t("yourCart")}</h1>
    ${cart.length ? `<div class="cart-page"><div class="lines">${cart.map(lineHTML).join("")}</div>${totalsBox(true)}</div>` : emptyCart()}</div>`,
    after() { bindLines(); bindCoupon(); } });
  views.checkout = () => {
    if (!cart.length) return { html: `<div class="wrap">${crumbs([[null, t("checkout")]])}${emptyCart()}</div>` };
    return { html: `<div class="wrap">${crumbs([["#/panier", t("cart")], [null, t("checkout")]])}<h1 class="page-title">${t("checkout")}</h1>
      <div class="cart-page"><form class="checkout" id="coForm" novalidate>
        <h2>${t("coTitle")}</h2><p>${t("coSub")}</p>${codFields("c-", true)}
        <div class="pay">${ICON.cash}<p style="margin:0"><b>${t("payCod")}</b><span>${t("payCodS")}</span></p></div>
        <button class="btn btn-primary btn-block" type="submit">${t("orderBtn")} · ${money(cartSub() + shippingCost(cartCount()))}</button>
      </form>
      <div>${totalsBox(false)}<div class="lines" style="margin-top:14px">${cart.map((l) => { const p = byId[l.id]; return `<div class="mini" style="padding:10px 14px"><span class="line-img">${caseSVG(p, l.color)}</span><span class="mini-t">${l.qty} × ${esc(L(p.name))}<small>${esc(p.model || t("accessories"))}</small></span><span class="mini-p">${money(p.price * l.qty)}</span></div>`; }).join("")}</div></div>
      </div></div>`,
      after() { bindCoupon(); $("#coForm").addEventListener("submit", (e) => { e.preventDefault(); placeOrder(e.target, cart); }); } };
  };
  views.thanks = () => {
    const o = store.get("lastOrder", null);
    if (!o) { location.hash = "#/"; return ""; }
    return `<div class="wrap"><div class="done"><div class="tick">${ICON.check}</div><h1>${t("thanks")}</h1>
      <p>${t("thanksTxt", { ref: `<span class="ref">${esc(o.ref)}</span>`, phone: `<b dir="ltr">${esc(o.phone)}</b>` })}</p>
      <div class="actions"><a class="btn btn-primary" href="${esc(o.wa)}" target="_blank" rel="noopener">${t("thanksWa")}</a><a class="btn btn-ghost" href="#/">${t("backShop")}</a></div>
      <p style="font-size:13px;margin-top:20px">${t("demo")}</p></div></div>`;
  };
  views.contact = () => `<div class="wrap">${crumbs([[null, t("contact")]])}<h1 class="page-title">${t("ctTitle")}</h1>
    <div class="contact"><div class="box"><p>${t("ctTxt")}</p><a class="btn btn-primary" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Salam Wa9i")}" target="_blank" rel="noopener">${t("ctWa")}</a></div>
    <div class="box"><dl><div><dt>${t("ctHours")}</dt><dd>${t("ctHoursV")}</dd></div><div><dt>${t("ctDel")}</dt><dd>${t("ctDelV")}</dd></div><div><dt>${t("ctSwap")}</dt><dd>${t("ctSwapV")}</dd></div></dl></div></div></div>`;
  views.notFound = () => `<div class="wrap"><div class="empty" style="margin:40px 0"><p><b>${t("notFound")}</b></p><a class="btn btn-primary" href="#/">${t("continue")}</a></div></div>`;

  /* ---------- Router ---------- */
  let sliderTimer;
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("#")[0].split("/").filter(Boolean);
    const [head, ...rest] = parts;
    switch (head) {
      case undefined: return ["home", views.home()];
      case "c": return ["brand", views.brand(rest), rest[0]];
      case "collection": return ["coll", views.collection(rest)];
      case "p": return ["product", views.product(rest), byId[rest[0]]?.brand];
      case "panier": return ["cart", views.cart()];
      case "commande": return ["checkout", views.checkout()];
      case "merci": return ["thanks", views.thanks()];
      case "contact": return ["contact", views.contact(), "contact"];
      case "recherche": return ["search", views.search(rest)];
      default: return ["404", views.notFound()];
    }
  }
  function render() {
    clearInterval(sliderTimer);
    const [name, out, active] = route();
    const view = typeof out === "string" ? { html: out } : out;
    const main = $("#main");
    main.innerHTML = view.html;
    view.after?.();
    $$("[data-add]", main).forEach((b) => b.addEventListener("click", () => addToCart(b.dataset.add)));
    $$(".nav-link").forEach((a) => a.classList.toggle("active", a.dataset.brand === active));
    if (name === "home") startSlider();
    const titleBits = { home: "Coques & accessoires téléphone", cart: t("cart"), checkout: t("checkout"), contact: t("contact") };
    document.title = `Wa9i — ${titleBits[name] || ($("h1", main)?.textContent || "").trim() || "Wa9i"}`;
    if (location.hash.endsWith("#order")) $("#order")?.scrollIntoView({ block: "start" }); else window.scrollTo(0, 0);
  }
  function startSlider() {
    const slides = $$(".slide"), dots = $$("[data-dot]"); let i = 0;
    const go = (n) => { i = (n + slides.length) % slides.length; slides.forEach((s, k) => s.classList.toggle("on", k === i)); dots.forEach((d, k) => d.setAttribute("aria-current", k === i)); };
    dots.forEach((d) => d.addEventListener("click", () => { go(+d.dataset.dot); clearInterval(sliderTimer); }));
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) sliderTimer = setInterval(() => go(i + 1), 5500);
  }

  /* ---------- Chrome: nav, drawers, language ---------- */
  function buildChrome() {
    $("#navList").innerHTML = BRANDS.map((b) => `<li class="nav-item"><a class="nav-link" data-brand="${b.id}" href="#/c/${b.id}">${b.name}</a>
      <div class="mega"><a class="all" href="#/c/${b.id}">${t("all")} ${b.name}</a>${b.models.map((m) => `<a href="#/c/${b.id}/${slug(m)}">${m}</a>`).join("")}</div></li>`).join("")
      + `<li class="nav-item"><a class="nav-link" data-brand="accessoires" href="#/c/accessoires">${t("accessories")}</a></li><li class="nav-item"><a class="nav-link" data-brand="contact" href="#/contact">${t("contact")}</a></li>`;
    $("#drawerBody").innerHTML = BRANDS.map((b) => `<details class="dm-brand"><summary>${b.name}</summary><a href="#/c/${b.id}"><b>${t("all")}</b></a>${b.models.map((m) => `<a href="#/c/${b.id}/${slug(m)}">${m}</a>`).join("")}</details>`).join("")
      + `<a class="dm-link" href="#/c/accessoires">${t("accessories")}</a><a class="dm-link" href="#/collection/zellige">${t("cZ")}</a><a class="dm-link" href="#/contact">${t("contact")}</a>`;
    $("#footBrands").innerHTML = BRANDS.slice(0, 5).map((b) => `<li><a href="#/c/${b.id}">${b.name}</a></li>`).join("") + `<li><a href="#/c/accessoires">${t("accessories")}</a></li>`;
    $$("[data-t]").forEach((el) => { el.textContent = t(el.dataset.t); });
    $$("[data-tp]").forEach((el) => { el.placeholder = t(el.dataset.tp); });
    $("#langBtn").textContent = lang === "ar" ? "Français" : "العربية";
    $("#langBtn").setAttribute("aria-label", t("langLabel"));
    $("#cartBtn").setAttribute("aria-label", t("cartLabel"));
    $$("[data-close]").forEach((b) => b.setAttribute("aria-label", t("close")));
    document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }
  function updateCartUI() {
    $("#cartCount").textContent = cartCount();
    $("#cartTotal").textContent = money(cartSub());
    const body = $("#cartDrawerBody");
    if (!cart.length) { body.innerHTML = `<div class="empty" style="border:0;background:none"><p><b>${t("cartEmpty")}</b></p><a class="btn btn-primary" href="#/" data-closer>${t("continue")}</a></div>`; }
    else {
      const items = cartCount(), left = Math.max(0, CONFIG.freeShippingFrom - items);
      body.innerHTML = `<div class="progress">${left ? t("freeLeft", { n: left }) : `<span class="free">${t("freeYes")}</span>`}<div class="bar"><i style="width:${Math.min(100, (items / CONFIG.freeShippingFrom) * 100)}%"></i></div></div>`
        + cart.map((l, i) => { const p = byId[l.id]; return `<div class="mini"><span class="line-img">${caseSVG(p, l.color)}</span><span class="mini-t">${esc(L(p.name))}<small>${esc(p.model || t("accessories"))} · ${l.qty} × ${money(p.price)}</small><button type="button" class="rm" data-rm="${i}">${t("remove")}</button></span><span class="mini-p">${money(p.price * l.qty)}</span></div>`; }).join("")
        + `<div class="drawer-foot" style="margin:16px -16px -16px"><div class="trow"><span>${t("subtotal")}</span><span>${money(cartSub())}</span></div><a class="btn btn-ghost" href="#/panier" data-closer>${t("viewCart")}</a><a class="btn btn-primary" href="#/commande" data-closer>${t("checkout")}</a></div>`;
      $$("[data-rm]", body).forEach((b) => b.addEventListener("click", () => { cart.splice(+b.dataset.rm, 1); saveCart(); if (/panier|commande/.test(location.hash)) render(); }));
    }
    $$("[data-closer]", body).forEach((a) => a.addEventListener("click", closeDrawers));
  }
  let lastFocus;
  function openDrawer(el) {
    lastFocus = document.activeElement; closeDrawers(true);
    el.classList.add("open"); el.setAttribute("aria-hidden", "false"); $("#scrim").hidden = false; document.body.style.overflow = "hidden";
    if (el.id === "drawer") $("#menuBtn").setAttribute("aria-expanded", "true");
    el.querySelector("[data-close]").focus();
  }
  function closeDrawers(quiet) {
    $$(".drawer").forEach((d) => { d.classList.remove("open"); d.setAttribute("aria-hidden", "true"); });
    $("#scrim").hidden = true; document.body.style.overflow = ""; $("#menuBtn").setAttribute("aria-expanded", "false");
    if (quiet !== true) lastFocus?.focus?.();
  }

  function init() {
    buildChrome(); updateCartUI();
    $("#menuBtn").addEventListener("click", () => openDrawer($("#drawer")));
    $("#cartBtn").addEventListener("click", () => openDrawer($("#cartDrawer")));
    $("#scrim").addEventListener("click", closeDrawers);
    $$("[data-close]").forEach((b) => b.addEventListener("click", closeDrawers));
    $("#drawerBody").addEventListener("click", (e) => { if (e.target.closest("a")) closeDrawers(true); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawers(); });
    $("#searchForm").addEventListener("submit", (e) => { e.preventDefault(); const q = $("#searchInput").value.trim(); if (q) location.hash = `#/recherche/${encodeURIComponent(q)}`; });
    $("#langBtn").addEventListener("click", () => { lang = lang === "ar" ? "fr" : "ar"; store.set("lang", lang); buildChrome(); updateCartUI(); render(); });
    if (store.get("promoClosed", false)) document.body.classList.add("no-promo");
    $("#promoClose").addEventListener("click", () => { document.body.classList.add("no-promo"); store.set("promoClosed", true); });
    window.addEventListener("hashchange", () => { closeDrawers(true); render(); });
    render();
  }
  init();
})();
