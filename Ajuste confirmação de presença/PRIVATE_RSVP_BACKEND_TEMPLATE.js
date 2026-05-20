/*
Backend privado para a lista de presença.
Vincule este script à planilha ou mantenha o ID fixo abaixo.

Planilha: 1yris-3UVTpuQHsBgSX7HilnxK593jOs1fjm4GZRPF1M
Chave privada do painel: TROQUE_SUA_CHAVE_AQUI
*/

const SPREADSHEET_ID = '1yris-3UVTpuQHsBgSX7HilnxK593jOs1fjm4GZRPF1M';
const SHEET_NAME = 'Confirmados';
const ADMIN_TOKEN = 'TROQUE_SUA_CHAVE_AQUI';

function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Nome', 'Telefone', 'Acompanhantes', 'Observações', 'Criado em']);
  }
  return sheet;
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || '';
  const token = (e && e.parameter && e.parameter.token) || '';
  if (token !== ADMIN_TOKEN) {
    return json_({ error: 'unauthorized' });
  }
  if (action === 'list') {
    const values = getSheet().getDataRange().getValues();
    const rows = values.slice(1).map(r => ({
      name: r[0] || '',
      phone: r[1] || '',
      guests: r[2] || '',
      message: r[3] || '',
      createdAt: r[4] || '',
    }));
    return json_(rows.reverse());
  }
  return json_({ ok: true });
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action !== 'submit' || !body.entry) {
      return json_({ error: 'bad_request' });
    }
    const entry = body.entry;
    getSheet().appendRow([
      String(entry.name || '').trim(),
      String(entry.phone || '').trim(),
      String(entry.guests || '').trim(),
      String(entry.message || '').trim(),
      String(entry.createdAt || new Date().toISOString()),
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ error: 'server_error', message: String(err) });
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
