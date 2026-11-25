/**
 * Pro Motors (promotors.pt) — Google Apps Script Web App Backend
 *
 * Zero-cost (€0/month) backend living inside Pro Motors' own Google Account:
 * - POST (Content-Type: text/plain;charset=utf-8): saves booking to "Pedidos" sheet + sends Gmail notifications
 * - GET ?action=instagram: returns active curated work/Instagram cards from "Instagram" sheet
 * - setupSpreadsheet(): one-click initializer creating sheets, formatting, dropdowns, and Config defaults
 */

const TIMEZONE = 'Europe/Lisbon';
const SHEET_PEDIDOS = 'Pedidos';
const SHEET_INSTAGRAM = 'Instagram';
const SHEET_CONFIG = 'Config';

const ALLOWED_STATUSES = ['Novo', 'Confirmado', 'Em curso', 'Concluído', 'Cancelado'];
const WORKSHOP_WHATSAPP_DIGITS = '351968505075';
const WORKSHOP_ADDRESS = 'R. Joaquim de Almeida, 90A, 2870-342 Montijo (Junto à PSP)';
const WORKSHOP_PHONE = '+351 212 314 830';
const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/promotorspt/';

/**
 * Run this function ONCE from the Apps Script editor after pasting Code.gs.
 * It safely creates and formats the Pedidos, Instagram, and Config tabs.
 */
function setupSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Pedidos (Mini-CRM)
  let pedidos = ss.getSheetByName(SHEET_PEDIDOS);
  if (!pedidos) {
    pedidos = ss.insertSheet(SHEET_PEDIDOS);
  }
  const pedidosHeaders = [
    'ID',
    'DataRegisto',
    'Estado',
    'Servicos',
    'Moto',
    'DataPreferida',
    'Horario',
    'Nome',
    'Telefone',
    'Email',
    'Observacoes',
    'Idioma',
    'NotasOficina',
  ];
  if (pedidos.getLastRow() === 0) {
    pedidos.getRange(1, 1, 1, pedidosHeaders.length).setValues([pedidosHeaders]);
  }
  styleHeaderRow_(pedidos, pedidosHeaders.length);
  pedidos.setFrozenRows(1);

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(ALLOWED_STATUSES, true)
    .setAllowInvalid(false)
    .build();
  pedidos.getRange('C2:C1000').setDataValidation(statusRule);

  const statusColors = [
    { value: 'Novo', bg: '#DCFCE7', fg: '#166534' },
    { value: 'Confirmado', bg: '#DBEAFE', fg: '#1E40AF' },
    { value: 'Em curso', bg: '#FEF3C7', fg: '#92400E' },
    { value: 'Concluído', bg: '#E5E7EB', fg: '#1F2937' },
    { value: 'Cancelado', bg: '#FEE2E2', fg: '#991B1B' },
  ];
  const statusRange = pedidos.getRange('C2:C1000');
  const rules = statusColors.map(function (entry) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(entry.value)
      .setBackground(entry.bg)
      .setFontColor(entry.fg)
      .setBold(true)
      .setRanges([statusRange])
      .build();
  });
  pedidos.setConditionalFormatRules(rules);
  pedidos.autoResizeColumns(1, pedidosHeaders.length);

  // 2. Instagram (Curated Showcase CMS)
  let instagram = ss.getSheetByName(SHEET_INSTAGRAM);
  if (!instagram) {
    instagram = ss.insertSheet(SHEET_INSTAGRAM);
  }
  const igHeaders = [
    'Ativo',
    'Ordem',
    'Categoria_PT',
    'Categoria_EN',
    'Legenda_PT',
    'Legenda_EN',
    'ImagemURL',
    'InstagramURL',
  ];
  if (instagram.getLastRow() === 0) {
    instagram.getRange(1, 1, 1, igHeaders.length).setValues([igHeaders]);
    const sampleRows = [
      [
        true,
        1,
        'Travões',
        'Brakes',
        'Substituição de pastilhas e revisão de pinças de travão',
        'Brake pad replacement and caliper servicing',
        '/images/work-brakes.jpg',
        DEFAULT_INSTAGRAM_URL,
      ],
      [
        true,
        2,
        'Scooters',
        'Scooters',
        'Manutenção rápida para scooters urbanas e de entregas',
        'Fast maintenance for urban and delivery scooters',
        '/images/work-scooter.jpg',
        DEFAULT_INSTAGRAM_URL,
      ],
      [
        true,
        3,
        'Pneus',
        'Tires',
        'Montagem e calibragem de pneus novos para moto',
        'New motorcycle tire mounting and wheel balancing',
        '/images/work-tires.jpg',
        DEFAULT_INSTAGRAM_URL,
      ],
      [
        true,
        4,
        'Revisão',
        'Service',
        'Mudança de óleo sintético, filtro original e check-up geral',
        'Synthetic oil change, OEM filter, and safety check',
        '/images/work-oil.jpg',
        DEFAULT_INSTAGRAM_URL,
      ],
    ];
    instagram.getRange(2, 1, sampleRows.length, igHeaders.length).setValues(sampleRows);
  }
  styleHeaderRow_(instagram, igHeaders.length);
  instagram.setFrozenRows(1);
  instagram.getRange('A2:A200').insertCheckboxes();
  instagram.autoResizeColumns(1, igHeaders.length);

  // 3. Config
  let config = ss.getSheetByName(SHEET_CONFIG);
  if (!config) {
    config = ss.insertSheet(SHEET_CONFIG);
  }
  if (config.getLastRow() === 0) {
    config.getRange(1, 1, 4, 2).setValues([
      ['Chave', 'Valor'],
      ['WORKSHOP_EMAIL', 'geral@promotors.pt'],
      ['SEND_CLIENT_CONFIRMATION', 'TRUE'],
      ['MAX_INSTAGRAM_ITEMS', '8'],
    ]);
  }
  styleHeaderRow_(config, 2);
  config.setFrozenRows(1);
  config.autoResizeColumns(1, 2);
}

/**
 * GET endpoint:
 * - ?action=instagram → returns active showcase cards
 * - ?action=health    → basic readiness check
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'health';

    if (action === 'instagram') {
      const items = getInstagramItems_();
      return jsonResponse_({
        ok: true,
        items: items,
        updatedAt: new Date().toISOString(),
      });
    }

    return jsonResponse_({
      ok: true,
      service: 'promotors-gas',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return jsonResponse_({
      ok: false,
      error: 'SERVER_ERROR',
      message: String(err && err.message ? err.message : err),
    });
  }
}

/**
 * POST endpoint: receives JSON string sent as text/plain;charset=utf-8
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ ok: false, error: 'VALIDATION_ERROR' });
    }

    const payload = JSON.parse(e.postData.contents);

    // 1. Honeypot trap — silent success without writing or emailing
    if (payload.website && String(payload.website).trim() !== '') {
      return jsonResponse_({ ok: true, bookingId: 'PM-OK', emailSent: false, ignored: true });
    }

    // 2. Minimum form fill elapsed time guard
    const elapsedMs = Number(payload.elapsedMs || 0);
    if (!isNaN(elapsedMs) && elapsedMs > 0 && elapsedMs < 2000) {
      return jsonResponse_({ ok: false, error: 'TOO_FAST' });
    }

    // 3. Validate and normalize payload
    const validated = validatePayload_(payload);
    if (!validated.ok) {
      return jsonResponse_({ ok: false, error: 'VALIDATION_ERROR', field: validated.field });
    }
    const booking = validated.data;

    // 4. Rate limiting (max 3 bookings per 10 minutes per email/phone)
    if (isRateLimited_(booking.email, booking.phone)) {
      return jsonResponse_({ ok: false, error: 'RATE_LIMITED' });
    }

    // 5. Persist atomically under ScriptLock
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    let bookingId;
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_PEDIDOS);
      if (!sheet) {
        throw new Error('Sheet "Pedidos" not found. Run setupSpreadsheet() first.');
      }

      const now = new Date();
      bookingId = generateNextBookingId_(sheet, now);
      const timestamp = Utilities.formatDate(now, TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
      const slotLabel = formatSlotLabel_(booking.timeSlot, booking.lang);

      const row = [
        bookingId,
        timestamp,
        'Novo',
        escapeCell_(booking.serviceLabels.join(', ')),
        escapeCell_(booking.bike),
        escapeCell_(booking.preferredDate),
        escapeCell_(slotLabel),
        escapeCell_(booking.name),
        escapeCell_(booking.phone),
        escapeCell_(booking.email),
        escapeCell_(booking.notes),
        booking.lang,
        '',
      ];
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    // 6. Send Gmail notifications (quota-resilient — never fails the saved booking)
    const emailSent = sendBookingEmails_(bookingId, booking);

    return jsonResponse_({
      ok: true,
      bookingId: bookingId,
      emailSent: emailSent,
    });
  } catch (err) {
    return jsonResponse_({
      ok: false,
      error: 'SERVER_ERROR',
      message: String(err && err.message ? err.message : err),
    });
  }
}

/* ==================== Helpers ==================== */

function getConfigMap_() {
  const defaults = {
    WORKSHOP_EMAIL: 'geral@promotors.pt',
    SEND_CLIENT_CONFIRMATION: 'TRUE',
    MAX_INSTAGRAM_ITEMS: '8',
  };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_CONFIG);
  if (!sheet || sheet.getLastRow() < 2) return defaults;

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  rows.forEach(function (row) {
    const key = String(row[0] || '').trim();
    const val = String(row[1] || '').trim();
    if (key && val) {
      defaults[key] = val;
    }
  });
  return defaults;
}

function getInstagramItems_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_INSTAGRAM);
  if (!sheet || sheet.getLastRow() < 2) return [];

  const config = getConfigMap_();
  const maxItems = Math.max(1, Math.min(24, Number(config.MAX_INSTAGRAM_ITEMS) || 8));
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getValues();

  const items = [];
  for (var i = 0; i < rows.length; i++) {
    const row = rows[i];
    const active = row[0] === true || String(row[0]).toUpperCase() === 'TRUE';
    if (!active) continue;

    const imageUrl = normalizeDriveImageUrl_(String(row[6] || '').trim());
    if (!imageUrl) continue;

    const igUrl = sanitizeHttpUrl_(String(row[7] || '').trim(), DEFAULT_INSTAGRAM_URL);

    items.push({
      id: 'ig-' + (i + 1),
      order: Number(row[1]) || i + 1,
      categoryPt: String(row[2] || '').trim() || 'Oficina',
      categoryEn: String(row[3] || '').trim() || String(row[2] || '').trim() || 'Workshop',
      captionPt: String(row[4] || '').trim(),
      captionEn: String(row[5] || '').trim() || String(row[4] || '').trim(),
      imageUrl: imageUrl,
      instagramUrl: igUrl,
    });
  }

  items.sort(function (a, b) {
    return a.order - b.order;
  });

  return items.slice(0, maxItems).map(function (item) {
    return {
      id: item.id,
      categoryPt: item.categoryPt,
      categoryEn: item.categoryEn,
      captionPt: item.captionPt,
      captionEn: item.captionEn,
      imageUrl: item.imageUrl,
      instagramUrl: item.instagramUrl,
    };
  });
}

function normalizeDriveImageUrl_(rawUrl) {
  if (!rawUrl) return '';
  if (rawUrl.indexOf('/images/') === 0 && rawUrl.indexOf('..') === -1) {
    return rawUrl;
  }

  var patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{10,})/,
    /drive\.google\.com\/(?:open|uc)\?[^#]*[?&]?id=([a-zA-Z0-9_-]{10,})/,
    /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]{10,})/,
  ];
  for (var i = 0; i < patterns.length; i++) {
    var match = rawUrl.match(patterns[i]);
    if (match && match[1]) {
      return 'https://lh3.googleusercontent.com/d/' + match[1] + '=w800';
    }
  }

  if (rawUrl.indexOf('https://') === 0) {
    return rawUrl;
  }
  return '';
}

function sanitizeHttpUrl_(rawUrl, fallback) {
  if (!rawUrl) return fallback;
  if (rawUrl.indexOf('https://') === 0 || rawUrl.indexOf('http://') === 0) {
    return rawUrl;
  }
  return fallback;
}

function validatePayload_(payload) {
  if (!payload || typeof payload !== 'object') return { ok: false, field: 'body' };

  const services = Array.isArray(payload.services)
    ? payload.services.map(function (s) { return String(s || '').trim(); }).filter(Boolean)
    : [];
  if (services.length === 0) return { ok: false, field: 'services' };

  const serviceLabels = Array.isArray(payload.serviceLabels) && payload.serviceLabels.length > 0
    ? payload.serviceLabels.map(function (s) { return String(s || '').trim().slice(0, 60); }).filter(Boolean)
    : services;

  const bike = String(payload.bike || '').trim().slice(0, 120);
  if (bike.length < 2) return { ok: false, field: 'bike' };

  const preferredDate = String(payload.preferredDate || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) return { ok: false, field: 'preferredDate' };

  const todayIso = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd');
  if (preferredDate < todayIso) return { ok: false, field: 'preferredDate' };

  const parts = preferredDate.split('-').map(Number);
  const utcDay = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])).getUTCDay();
  if (utcDay === 0) return { ok: false, field: 'preferredDate' };

  const timeSlot = payload.timeSlot === 'afternoon' ? 'afternoon' : 'morning';
  if (utcDay === 6 && timeSlot === 'afternoon') {
    return { ok: false, field: 'timeSlot' };
  }

  const name = String(payload.name || '').trim().slice(0, 100);
  if (name.length < 2) return { ok: false, field: 'name' };

  const phone = String(payload.phone || '').trim().slice(0, 32);
  const digits = phone.replace(/\D+/g, '');
  if (digits.length < 9 || digits.length > 15) return { ok: false, field: 'phone' };

  const email = String(payload.email || '').trim().slice(0, 160);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, field: 'email' };

  if (payload.gdprAccepted !== true) return { ok: false, field: 'gdprAccepted' };

  return {
    ok: true,
    data: {
      services: services,
      serviceLabels: serviceLabels,
      bike: bike,
      preferredDate: preferredDate,
      timeSlot: timeSlot,
      name: name,
      phone: phone,
      email: email,
      notes: String(payload.notes || '').trim().slice(0, 800),
      lang: payload.lang === 'en' ? 'en' : 'pt',
    },
  };
}

function isRateLimited_(email, phone) {
  const cache = CacheService.getScriptCache();
  const normalizedKey = 'rl_' + Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      email.toLowerCase() + '|' + phone.replace(/\D+/g, '')
    )
  ).slice(0, 32);

  const count = Number(cache.get(normalizedKey) || '0');
  if (count >= 3) {
    return true;
  }
  cache.put(normalizedKey, String(count + 1), 600); // 10 minutes
  return false;
}

function generateNextBookingId_(sheet, now) {
  const year = Utilities.formatDate(now, TIMEZONE, 'yyyy');
  const prefix = 'PM-' + year + '-';
  const lastRow = sheet.getLastRow();
  let maxSeq = 0;

  if (lastRow >= 2) {
    const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      const id = String(ids[i][0] || '');
      if (id.indexOf(prefix) === 0) {
        const num = parseInt(id.slice(prefix.length), 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    }
  }

  return prefix + ('0000' + (maxSeq + 1)).slice(-4);
}

function escapeCell_(value) {
  const str = String(value || '').replace(/[\t\r]+/g, ' ').trim();
  if (!str) return '';
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str;
  }
  return str;
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatSlotLabel_(timeSlot, lang) {
  if (lang === 'en') {
    return timeSlot === 'afternoon' ? 'Afternoon (14:00–19:00)' : 'Morning (09:00–13:00)';
  }
  return timeSlot === 'afternoon' ? 'Tarde (14:00–19:00)' : 'Manhã (09:00–13:00)';
}

function sendBookingEmails_(bookingId, booking) {
  const config = getConfigMap_();
  const workshopEmail = config.WORKSHOP_EMAIL || 'geral@promotors.pt';
  const sendClientConfirmation =
    String(config.SEND_CLIENT_CONFIRMATION || 'TRUE').toUpperCase() === 'TRUE';

  const quota = MailApp.getRemainingDailyQuota();
  if (quota < 1) {
    return false;
  }

  const slotLabelPt = formatSlotLabel_(booking.timeSlot, 'pt');
  const clientDigits = booking.phone.replace(/\D+/g, '');
  const clientWaHref = 'https://wa.me/' + (clientDigits.length === 9 ? '351' + clientDigits : clientDigits);

  // 1. Workshop email
  const workshopSubject =
    '[Pro Motors] Nova marcação ' + bookingId + ' — ' + booking.bike + ' (' + booking.preferredDate + ')';
  const workshopHtml =
    '<div style="font-family:Arial,sans-serif;max-width:600px;background:#0B0D0E;color:#F5F7F6;padding:24px;border-radius:12px;">' +
    '<h2 style="margin:0 0 12px;color:#52AF3D;">Nova Marcação — ' + escapeHtml_(bookingId) + '</h2>' +
    '<table style="width:100%;border-collapse:collapse;font-size:14px;">' +
    rowHtml_('Cliente', booking.name) +
    rowHtml_('Telemóvel / WhatsApp', booking.phone) +
    rowHtml_('E-mail', booking.email) +
    rowHtml_('Moto / Scooter', booking.bike) +
    rowHtml_('Serviços', booking.serviceLabels.join(', ')) +
    rowHtml_('Data & Período', booking.preferredDate + ' · ' + slotLabelPt) +
    rowHtml_('Observações', booking.notes || '—') +
    rowHtml_('Idioma', booking.lang.toUpperCase()) +
    '</table>' +
    '<div style="margin-top:20px;">' +
    '<a href="' + escapeHtml_(clientWaHref) + '" style="display:inline-block;background:#52AF3D;color:#0B0D0E;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:8px;">Responder no WhatsApp</a>' +
    '</div>' +
    '</div>';

  try {
    MailApp.sendEmail({
      to: workshopEmail,
      replyTo: booking.email,
      subject: workshopSubject,
      htmlBody: workshopHtml,
    });
  } catch (err) {
    Logger.log('Workshop email failed: ' + err);
    return false;
  }

  // 2. Client confirmation email
  if (!sendClientConfirmation || quota < 2) {
    return true;
  }

  const isEn = booking.lang === 'en';
  const slotLabelClient = formatSlotLabel_(booking.timeSlot, booking.lang);
  const clientSubject = isEn
    ? 'Pro Motors — We received your booking request (' + bookingId + ')'
    : 'Pro Motors — Recebemos o seu pedido de marcação (' + bookingId + ')';

  const clientHtml =
    '<div style="font-family:Arial,sans-serif;max-width:600px;background:#0B0D0E;color:#F5F7F6;padding:24px;border-radius:12px;">' +
    '<div style="font-size:20px;font-weight:800;letter-spacing:1px;margin-bottom:16px;"><span style="color:#52AF3D;">PRO</span> MOTORS</div>' +
    '<h2 style="margin:0 0 8px;color:#F5F7F6;">' +
    (isEn ? 'Booking Request Received' : 'Pedido de Marcação Recebido') +
    '</h2>' +
    '<p style="color:#9BA6A1;margin:0 0 18px;">' +
    (isEn
      ? 'Hello ' + escapeHtml_(booking.name) + ', we have logged your booking request. Please note this request is subject to final slot availability confirmation by our workshop.'
      : 'Olá ' + escapeHtml_(booking.name) + ', registámos o seu pedido de marcação. Este pedido aguarda confirmação final de disponibilidade pela oficina.') +
    '</p>' +
    '<table style="width:100%;border-collapse:collapse;font-size:14px;">' +
    rowHtml_(isEn ? 'Reference' : 'Referência', bookingId) +
    rowHtml_(isEn ? 'Bike / Scooter' : 'Moto / Scooter', booking.bike) +
    rowHtml_(isEn ? 'Services' : 'Serviços', booking.serviceLabels.join(', ')) +
    rowHtml_(isEn ? 'Preferred Date' : 'Data & Período', booking.preferredDate + ' · ' + slotLabelClient) +
    '</table>' +
    '<p style="color:#9BA6A1;font-size:13px;margin:20px 0 12px;">' +
    '<strong>' + (isEn ? 'Address:' : 'Morada:') + '</strong> ' + WORKSHOP_ADDRESS + '<br>' +
    '<strong>' + (isEn ? 'Hours:' : 'Horário:') + '</strong> Seg–Sex 09:00–19:00 · Sáb 09:00–13:00<br>' +
    '<strong>' + (isEn ? 'Phone:' : 'Telefone:') + '</strong> ' + WORKSHOP_PHONE +
    '</p>' +
    '<a href="https://wa.me/' + WORKSHOP_WHATSAPP_DIGITS + '" style="display:inline-block;background:#52AF3D;color:#0B0D0E;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:8px;">WhatsApp Pro Motors</a>' +
    '</div>';

  try {
    MailApp.sendEmail({
      to: booking.email,
      replyTo: workshopEmail,
      subject: clientSubject,
      htmlBody: clientHtml,
    });
  } catch (err) {
    Logger.log('Client confirmation email failed: ' + err);
  }

  return true;
}

function rowHtml_(label, value) {
  return (
    '<tr>' +
    '<td style="padding:8px 0;border-bottom:1px solid #262C2E;color:#9BA6A1;width:38%;">' + escapeHtml_(label) + '</td>' +
    '<td style="padding:8px 0;border-bottom:1px solid #262C2E;color:#F5F7F6;font-weight:600;">' + escapeHtml_(value) + '</td>' +
    '</tr>'
  );
}

function styleHeaderRow_(sheet, colCount) {
  sheet
    .getRange(1, 1, 1, colCount)
    .setBackground('#14181A')
    .setFontColor('#52AF3D')
    .setFontWeight('bold');
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
