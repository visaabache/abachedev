/**
 * AbacheDev contact form → Google Sheet ("AbacheDev — Leads")
 *
 * Setup (once):
 * 1. Paste this file into the Apps Script editor (replace everything) and click Save.
 * 2. Select "setup" in the toolbar and click Run — approve the permissions Google asks for.
 *    The Execution log should say: Connected to "AbacheDev — Leads" → tab "Leads".
 * 3. Deploy → New deployment → type "Web app" — Execute as: Me, Who has access: Anyone → Deploy.
 * 4. Copy the Web app URL (…/exec) into sheetEndpoint in script.js.
 */
const SPREADSHEET_ID = '1Pt1LpkSsVsvTrgPUzCgytM64fx1k2bbu6aAW8fueI3k';
const SHEET_NAME = 'Leads';
const HEADERS = ['Date', 'Name', 'Email', 'Package', 'Message', 'Language', 'Page'];

// Receives each form submission from the website
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data._gotcha) return json({ ok: true }); // spam bot filled the hidden field

    const sheet = getSheet();
    sheet.appendRow([
      new Date(),
      clean(data.name),
      clean(data.email),
      clean(data.package),
      clean(data.message),
      clean(data.language),
      clean(data.page),
    ]);
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
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  if (sheet.getFrozenRows() === 0) sheet.setFrozenRows(1);
  return sheet;
}

// Keep text as text: a value starting with = + - @ would otherwise run as a spreadsheet formula
function clean(value) {
  const s = String(value == null ? '' : value).slice(0, 5000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
