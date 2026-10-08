/**
 * AbacheDev contact form → Google Sheet ("AbacheDev — Leads") + automatic thank-you email
 *
 * Setup / update:
 * 1. Paste this file into the Apps Script editor (replace everything) and click Save.
 * 2. Select "setup" in the toolbar and click Run — approve the permissions Google asks for
 *    (spreadsheet access and "send email as you" for the thank-you emails).
 * 3. First time: Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 *    Updating: Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy.
 *    The /exec URL stays the same, so the website doesn't change.
 */
const SPREADSHEET_ID = '1Pt1LpkSsVsvTrgPUzCgytM64fx1k2bbu6aAW8fueI3k';
const SHEET_NAME = 'Leads';

// Your WhatsApp number (shown in the thank-you email) and site address
const OWNER_WHATSAPP = '212677047171';
const OWNER_WHATSAPP_DISPLAY = '+212 677-047171';
const SITE_URL = 'https://abachedev.com';

// Thank-you emails: at most one per address every 6 hours, and at most this many per day
const AUTO_REPLY = true;
const AUTO_REPLY_DAILY_LIMIT = 40;

// Columns are matched by their title, so you can reorder them in the sheet.
// Missing titles are added at the end of the header row.
const COLUMNS = ['Date', 'Name', 'Phone', 'WhatsApp', 'Email', 'Package', 'Message', 'Language', 'Page', 'Auto-reply'];

// Receives each form submission from the website
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data._gotcha) return json({ ok: true });            // spam bot filled the hidden field
    if (!data.name && !data.email && !data.phone && !data.message) return json({ ok: false, error: 'empty' });

    const lang = ['fr', 'en', 'ar'].indexOf(data.language) >= 0 ? data.language : 'fr';
    const phone = waNumber(data.phone);
    const email = isEmail(data.email) ? String(data.email).trim() : '';
    const autoReply = AUTO_REPLY ? sendThankYou(email, lang, data, phone) : 'off';

    const values = {
      'Date': new Date(),
      'Name': clean(data.name),
      'Phone': clean(phone ? formatPhone(phone) : data.phone), // clean() keeps the leading + as text
      'WhatsApp': phone ? 'https://wa.me/' + phone + '?text=' + encodeURIComponent(ownerGreeting(lang, data.name)) : '',
      'Email': clean(data.email),
      'Package': clean(data.package),
      'Message': clean(data.message),
      'Language': lang,
      'Page': clean(data.page),
      'Auto-reply': autoReply,
    };
    const sheet = getSheet();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    sheet.appendRow(headers.map(h => (h in values ? values[h] : '')));
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Opening the Web app URL in a browser shows this — a quick way to check the deployment
function doGet() {
  return json({ ok: true, message: 'AbacheDev contact form endpoint is running.' });
}

// Run once from the editor to grant permissions and check the connection
function setup() {
  const sheet = getSheet();
  Logger.log('Connected to "' + sheet.getParent().getName() + '" → tab "' + sheet.getName() + '"');
  Logger.log('Emails you can still send today: ' + MailApp.getRemainingDailyQuota());
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  if (sheet.getLastColumn() === 0) sheet.appendRow(COLUMNS);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const missing = COLUMNS.filter(c => headers.indexOf(c) < 0);
  if (missing.length) sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
  if (sheet.getFrozenRows() === 0) sheet.setFrozenRows(1);
  return sheet;
}

// ---------- Thank-you email ----------

function sendThankYou(email, lang, data, phone) {
  if (!email) return 'no email';
  const key = 'reply:' + email.toLowerCase();
  const cache = CacheService.getScriptCache();
  if (cache.get(key)) return 'skipped (already sent)';
  const props = PropertiesService.getScriptProperties();
  const today = Utilities.formatDate(new Date(), 'Africa/Casablanca', 'yyyy-MM-dd');
  const count = props.getProperty('replies:' + today) === null ? 0 : Number(props.getProperty('replies:' + today));
  if (count >= AUTO_REPLY_DAILY_LIMIT || MailApp.getRemainingDailyQuota() < 5) return 'skipped (daily limit)';

  const t = TEXT[lang];
  const name = safeName(data.name);
  const pkg = safeName(data.package);
  const lines = [
    t.hello(name),
    t.thanks,
    pkg ? t.pkg(pkg) : '',
    phone ? t.phone(formatPhone(phone)) : '',
    t.faster,
  ].filter(Boolean);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const align = lang === 'ar' ? 'right' : 'left';
  const waLink = 'https://wa.me/' + OWNER_WHATSAPP;
  const htmlBody =
    '<div dir="' + dir + '" style="background:#f5f7fb;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">' +
      '<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border-collapse:collapse;">' +
        '<tr><td style="background:#4f46e5;padding:18px 24px;color:#ffffff;font-size:20px;font-weight:bold;text-align:' + align + ';direction:ltr;">' +
          '&lt;/&gt; AbacheDev</td></tr>' +
        '<tr><td style="padding:24px;color:#0f172a;font-size:15px;line-height:1.7;text-align:' + align + ';">' +
          lines.map(l => '<p style="margin:0 0 14px;">' + escapeHtml(l) + '</p>').join('') +
          '<p style="margin:18px 0;"><a href="' + waLink + '" style="display:inline-block;background:#25d366;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px;">' +
            escapeHtml(t.button) + '</a></p>' +
          '<p style="margin:0;color:#5b6475;">' + escapeHtml(t.signoff) + '<br><strong style="color:#0f172a;">Abache — AbacheDev</strong><br>' +
            '<a href="' + SITE_URL + '" style="color:#4f46e5;">abachedev.com</a> · <span dir="ltr">' + OWNER_WHATSAPP_DISPLAY + '</span></p>' +
        '</td></tr>' +
      '</table>' +
    '</div>';
  const textBody = lines.join('\n\n') + '\n\n' + t.button + ': ' + waLink + '\n\n' + t.signoff + '\nAbache — AbacheDev\n' + SITE_URL;

  MailApp.sendEmail({ to: email, subject: t.subject, body: textBody, htmlBody: htmlBody, name: 'AbacheDev' });
  cache.put(key, '1', 6 * 60 * 60);
  props.setProperty('replies:' + today, String(count + 1));
  return 'sent';
}

const TEXT = {
  fr: {
    subject: 'Merci pour votre message — AbacheDev',
    hello: n => (n ? 'Bonjour ' + n + ',' : 'Bonjour,'),
    thanks: 'Merci pour votre message ! Je l’ai bien reçu et je reviens vers vous sous 24 heures avec des idées et un devis gratuit pour votre projet.',
    pkg: p => 'Formule choisie : ' + p + '.',
    phone: p => 'Je peux aussi vous répondre sur WhatsApp au ' + p + '.',
    faster: 'Besoin d’une réponse plus rapide ? Écrivez-moi directement sur WhatsApp.',
    button: 'Écrire sur WhatsApp',
    signoff: 'À très vite,',
  },
  en: {
    subject: 'Thanks for your message — AbacheDev',
    hello: n => (n ? 'Hi ' + n + ',' : 'Hi,'),
    thanks: 'Thanks for your message! I’ve received it and will get back to you within 24 hours with ideas and a free quote for your project.',
    pkg: p => 'Package selected: ' + p + '.',
    phone: p => 'I can also reply on WhatsApp at ' + p + '.',
    faster: 'Need a faster answer? Message me directly on WhatsApp.',
    button: 'Message me on WhatsApp',
    signoff: 'Talk soon,',
  },
  ar: {
    subject: 'شكرًا على رسالتك — AbacheDev',
    hello: n => (n ? 'مرحبًا ' + n + '،' : 'مرحبًا،'),
    thanks: 'شكرًا على رسالتك! لقد استلمتها، وسأعود إليك خلال 24 ساعة بأفكار وعرض سعر مجاني لمشروعك.',
    pkg: p => 'الباقة المختارة: ' + p + '.',
    phone: p => 'يمكنني أيضًا الردّ عليك عبر واتساب على الرقم ⁦' + p + '⁩.',
    faster: 'تحتاج إلى ردّ أسرع؟ راسلني مباشرةً على واتساب.',
    button: 'راسلني على واتساب',
    signoff: 'إلى اللقاء قريبًا،',
  },
};

// Greeting pre-filled in the WhatsApp link in the sheet, so you can answer a lead in one click
function ownerGreeting(lang, name) {
  const n = safeName(name);
  if (lang === 'ar') return 'مرحبًا' + (n ? ' ' + n : '') + '، شكرًا على طلبك عبر abachedev.com. ';
  if (lang === 'en') return 'Hi' + (n ? ' ' + n : '') + ', thanks for your request on abachedev.com. ';
  return 'Bonjour' + (n ? ' ' + n : '') + ', merci pour votre demande sur abachedev.com. ';
}

// ---------- Helpers ----------

// Same rules as the website: Moroccan 06…/07… numbers get the 212 prefix
function waNumber(raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (d.indexOf('00') === 0) d = d.slice(2);
  if (d.length === 10 && d.charAt(0) === '0') d = '212' + d.slice(1);
  else if (d.length === 9 && /^[5-7]/.test(d)) d = '212' + d;
  return d.length >= 9 && d.length <= 15 ? d : '';
}

// +212 6 12 34 56 78 for Moroccan numbers, +<digits> otherwise
function formatPhone(d) {
  if (d.length === 12 && d.indexOf('212') === 0) return '+212 ' + d.charAt(3) + ' ' + d.slice(4).replace(/(\d{2})(?=\d)/g, '$1 ');
  return '+' + d;
}

function isEmail(v) {
  return /^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[A-Za-z]{2,}$/.test(String(v || '').trim()) && String(v).length <= 254;
}

// Names go into an email sent to an address typed by the visitor: keep letters, spaces,
// apostrophes and hyphens only (no links, digits or symbols) and cut to 40 characters.
function safeName(v) {
  return String(v || '').replace(/<[^>]*>?/g, ' ').replace(/[^\p{L}\p{M}\s'’-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 40);
}

// Keep text as text: a value starting with = + - @ would otherwise run as a spreadsheet formula
function clean(value) {
  const s = String(value == null ? '' : value).slice(0, 5000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
