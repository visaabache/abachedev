/**
 * AbacheDev contact form → Google Sheet
 *
 * Setup (once):
 * 1. Open the "AbacheDev — Leads" Google Sheet → Extensions → Apps Script.
 * 2. Replace the code in Code.gs with this file and click Save.
 * 3. Deploy → New deployment → type "Web app".
 *      Execute as: Me      Who has access: Anyone
 *    Click Deploy, allow the permissions, and copy the Web app URL (…/exec).
 * 4. Paste that URL into sheetEndpoint in script.js.
 *
 * Every form submission then becomes a new row (in a tab named "Leads" if there is one, otherwise the first tab).
 */
const SHEET_NAME = 'Leads';
const HEADERS = ['Date', 'Name', 'Email', 'Package', 'Message', 'Language', 'Page'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data._gotcha) return json({ ok: true }); // spam bot filled the hidden field

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    if (sheet.getFrozenRows() === 0) sheet.setFrozenRows(1);
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

// Keep text as text: a value starting with = + - @ would otherwise run as a spreadsheet formula
function clean(value) {
  const s = String(value == null ? '' : value).slice(0, 5000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
