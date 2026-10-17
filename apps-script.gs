/**
 * Go Woman · Embaixadoras
 * Recebe a ficha da landing page, grava na planilha e avisa por e-mail.
 *
 * COMO USAR (resumo, o passo a passo completo está no LEIAME.md):
 * 1. Crie uma planilha no Google Sheets e abra Extensões > Apps Script.
 * 2. Cole este arquivo inteiro e ajuste EMAIL_AVISO abaixo.
 * 3. Implantar > Nova implantação > App da Web
 *    Executar como: Eu  |  Quem pode acessar: Qualquer pessoa
 * 4. Copie a URL que termina em /exec e cole em CONFIG.ENDPOINT no index.html.
 */
const EMAIL_AVISO = 'goactionwoman@gmail.com'; // aviso só para você, a cada nova ficha (nada é enviado para as embaixadoras)
const ABA = 'Fichas';

const COLUNAS = [
  ['id','ID'],['enviado_em','Enviado em'],['nome','Nome completo'],['nascimento','Nascimento'],
  ['whatsapp','WhatsApp'],['email','E-mail'],['cidade_uf','Cidade / UF'],
  ['igreja','Igreja / Ministério'],['igreja_cidade_uf','Cidade / UF da igreja'],['funcao','Função na igreja'],['tempo_atuacao','Tempo de atuação'],
  ['estado_civil','Estado civil'],['conjuge','Cônjuge'],['aniversario_casamento','Aniversário de casamento'],['filhos','Filhos'],
  ['motivos','Motivos e propósito'],['interesses','Interesses'],['interesse_outro','Outro interesse'],
  ['dia_contribuicao','Dia da contribuição'],['consentimento','Consentimento LGPD'],['origem','Origem']
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const d = JSON.parse(e.postData.contents);
    const err = validar(d);
    if (err) return saida({ ok: false, erro: err });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(ABA);
    if (!sh) {
      sh = ss.insertSheet(ABA);
      sh.appendRow(COLUNAS.map(c => c[1]));
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold').setBackground('#900228').setFontColor('#ffffff');
    }
    // evita duplicar se a página reenviar o mesmo envio
    const last = sh.getLastRow();
    if (last > 1) {
      const from = Math.max(2, last - 199);
      const ids = sh.getRange(from, 1, last - from + 1, 1).getValues().flat();
      if (ids.indexOf(d.id) !== -1) return saida({ ok: true, repetido: true });
    }
    sh.appendRow(COLUNAS.map(c => limpar(d[c[0]], c[0])));

    if (EMAIL_AVISO) {
      MailApp.sendEmail({
        to: EMAIL_AVISO,
        replyTo: d.email,
        subject: 'Nova ficha de embaixadora: ' + d.nome,
        htmlBody: '<p>Chegou uma nova ficha.</p><ul>' +
          '<li><b>Nome:</b> ' + esc(d.nome) + '</li><li><b>WhatsApp:</b> ' + esc(d.whatsapp) + '</li>' +
          '<li><b>E-mail:</b> ' + esc(d.email) + '</li><li><b>Cidade:</b> ' + esc(d.cidade_uf) + '</li>' +
          '<li><b>Igreja:</b> ' + esc(d.igreja) + '</li><li><b>Dia da contribuição:</b> ' + esc(d.dia_contribuicao) + '</li></ul>' +
          '<p>Veja a planilha: ' + ss.getUrl() + '</p>'
      });
    }
    return saida({ ok: true });
  } catch (x) {
    return saida({ ok: false, erro: String(x) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function doGet() { return saida({ ok: true, status: 'online' }); }

function validar(d) {
  if (!d || !d.id) return 'sem id';
  if (!d.nome || !d.whatsapp || !d.email || !d.cidade_uf || !d.igreja) return 'campos obrigatórios';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return 'e-mail inválido';
  if (['10','15','20'].indexOf(String(d.dia_contribuicao)) === -1) return 'dia inválido';
  if (d.consentimento !== 'Sim') return 'sem consentimento';
  return '';
}
// Impede que um texto vire fórmula na planilha (=, +, -, @) e limita o tamanho
function limpar(v, k) {
  let s = String(v == null ? '' : v).slice(0, 2000);
  if (k === 'whatsapp' || k === 'nascimento' || k === 'aniversario_casamento' || k === 'enviado_em') return "'" + s;
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function esc(s) { return String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function saida(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
