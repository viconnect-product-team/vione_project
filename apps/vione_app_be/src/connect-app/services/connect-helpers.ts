import * as crypto from 'crypto';
import { z } from 'zod';

export function parsePersonId(personId?: string) {
  if (!personId || typeof personId !== 'string') {
    const fallbackGuestId = crypto.randomUUID();
    return {
      targetKind: 'guest_contact',
      targetUserId: null,
      targetCardId: null,
      targetGuestId: fallbackGuestId,
    };
  }
  const clean = personId.trim();
  const kindChar = clean.substring(0, 1);
  const idVal = clean.includes(':') ? clean.substring(2) : clean;
  let targetKind = 'connection';
  let targetUserId: string | null = null;
  let targetCardId: string | null = null;
  let targetGuestId: string | null = null;

  if (clean.startsWith('u:') || (kindChar === 'u' && clean.includes(':'))) {
    targetKind = 'connection';
    targetUserId = idVal;
  } else if (clean.startsWith('c:') || (kindChar === 'c' && clean.includes(':'))) {
    targetKind = 'saved_card';
    targetCardId = idVal;
  } else if (clean.startsWith('g:') || (kindChar === 'g' && clean.includes(':'))) {
    targetKind = 'guest_contact';
    targetGuestId = idVal;
  } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean)) {
    // Nếu là chuỗi UUID chuẩn từ user_connections thì đây là connection
    targetKind = 'connection';
    targetUserId = clean;
  } else {
    targetKind = 'guest_contact';
    targetGuestId = idVal;
  }

  return { targetKind, targetUserId, targetCardId, targetGuestId };
}

export function composePersonId(
  targetKind: string,
  targetUserId: string | null,
  targetCardId: string | null,
  targetGuestId: string | null,
) {
  if (targetKind === 'connection' && targetUserId) return `u:${targetUserId}`;
  if (targetKind === 'saved_card' && targetCardId) return `c:${targetCardId}`;
  if (targetKind === 'guest_contact' && targetGuestId) return `g:${targetGuestId}`;
  return '';
}

export const OCR_MODEL_MAX_LINES = 100;
export const ocrModelOutputSchema = z
  .object({
    isBusinessCard: z.boolean().default(true),
    unusableReason: z.string().max(250).nullish(),
    lines: z
      .array(
        z.object({
          text: z.string().min(1).max(500),
          confidence: z
            .number()
            .nullish()
            .transform((v) => {
              if (v === null || v === undefined) return 0.9;
              return v > 1 ? Math.min(1, v / 100) : Math.max(0, v);
            }),
        }),
      )
      .max(OCR_MODEL_MAX_LINES),
    displayNameLine: z.number().int().min(0).nullish(),
    titleLine: z.number().int().min(0).nullish(),
    companyNameLine: z.number().int().min(0).nullish(),
    addressLine: z.number().int().min(0).nullish(),
    qrPresent: z.boolean().nullish(),
  })
  .passthrough();

export function normalizeText(s: string): string {
  return s.normalize('NFC').replace(/\s+/g, ' ').trim();
}

export function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g;
export const EMAIL_SUSPECT_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*,[A-Za-z]{2,}/g;

export function extractEmails(lines: any[], warnings: string[]): any[] {
  const out: any[] = [];
  const seen = new Set<string>();
  let uncertain = false;
  for (const line of lines) {
    for (const m of line.text.matchAll(EMAIL_RE)) {
      const value = m[0].toLowerCase();
      if (seen.has(value)) continue;
      seen.add(value);
      out.push({ value, confidence: clamp01(line.confidence), sourceText: line.text });
    }
    for (const m of line.text.matchAll(EMAIL_SUSPECT_RE)) {
      const value = m[0].toLowerCase();
      if (seen.has(value)) continue;
      seen.add(value);
      uncertain = true;
      out.push({
        value,
        confidence: round2(clamp01(line.confidence) * 0.5),
        sourceText: line.text,
      });
    }
  }
  if (uncertain) warnings.push('email_uncertain');
  return out;
}

export const PHONE_RE = /\+?\d[\d\s().-]{5,}\d/g;

export function detectPhoneLabel(lineText: string): string | undefined {
  const s = lineText.toLowerCase();
  if (s.includes('fax')) return 'fax';
  if (s.includes('hotline')) return 'hotline';
  const tokens = s.split(/[^a-z0-9à-ỹ]+/u).filter(Boolean);
  const has = (set: readonly string[]) => tokens.some((tok) => set.includes(tok));
  if (has(['mobile', 'mobi', 'cell', 'hp']) || s.includes('di động') || s.includes('di dong')) {
    return 'mobile';
  }
  if (
    has(['office', 'tel', 'phone', 'đt', 'dt']) ||
    s.includes('văn phòng') ||
    s.includes('van phong')
  ) {
    return 'office';
  }
  return undefined;
}

export function normalizePhoneDigits(raw: string): string {
  const plus = raw.trimStart().startsWith('+');
  const digits = raw.replace(/\D/g, '');
  return plus ? `+${digits}` : digits;
}

export function extractPhones(lines: any[], warnings: string[]): any[] {
  const out: any[] = [];
  const seen = new Set<string>();
  let uncertain = false;
  for (const line of lines) {
    for (const m of line.text.matchAll(PHONE_RE)) {
      const digits = m[0].replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) continue;
      const value = normalizePhoneDigits(m[0]);
      if (seen.has(value)) continue;
      seen.add(value);
      const label = detectPhoneLabel(line.text);
      if (line.confidence < 0.5 || digits.length < 8) uncertain = true;
      out.push({
        value,
        confidence: clamp01(line.confidence),
        sourceText: line.text,
        ...(label ? { label } : {}),
      });
    }
  }
  if (uncertain) warnings.push('phone_uncertain');
  return out;
}

export const URL_RE = /(?:https?:\/\/|www\.)[^\s<>()"']+/gi;

export function extractWebsite(lines: any[]): any | undefined {
  for (const line of lines) {
    for (const m of line.text.matchAll(URL_RE)) {
      let raw = m[0].replace(/[.,;:!?)}\]]+$/, '');
      if (raw.includes('@')) continue;
      if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
      try {
        const u = new URL(raw);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') continue;
        return { value: u.toString(), confidence: clamp01(line.confidence), sourceText: line.text };
      } catch {
        continue;
      }
    }
  }
  return undefined;
}

export const CONTACT_PATTERN = /@|\(?\+?\d[\d\s().-]{6,}\d/;

export function pickClassifiedLine(
  lines: any[],
  index: number | null,
  opts: { maxLen: number; forbidContactPattern?: boolean },
): any | undefined {
  if (index === null) return undefined;
  const line = lines[index];
  if (!line) return undefined;
  const value = normalizeText(line.text);
  if (!value || value.length > opts.maxLen) return undefined;
  if (opts.forbidContactPattern && CONTACT_PATTERN.test(value)) return undefined;
  return { value, confidence: clamp01(line.confidence), sourceText: line.text };
}

export function buildCandidateFromModel(model: any, scanId: string): any {
  if (!model.isBusinessCard) return { ok: false, code: 'unusable' };

  const lines: any[] = model.lines
    .map((l: any) => ({ text: normalizeText(l.text), confidence: clamp01(l.confidence) }))
    .filter((l: any) => l.text.length > 0);
  if (lines.length === 0) return { ok: false, code: 'unusable' };

  const warnings: string[] = [];
  if (model.qrPresent) warnings.push('qr_present');

  let displayName = pickClassifiedLine(lines, model.displayNameLine, {
    maxLen: 80,
    forbidContactPattern: true,
  });
  if (model.displayNameLine !== null && !displayName) warnings.push('name_needs_review');

  let title = pickClassifiedLine(lines, model.titleLine, { maxLen: 120 });
  if (model.titleLine !== null && !title) warnings.push('title_needs_review');

  let companyName = pickClassifiedLine(lines, model.companyNameLine, { maxLen: 120 });
  if (model.companyNameLine !== null && !companyName) warnings.push('company_needs_review');

  // Nếu title hoặc companyName chứa dấu phân cách kết hợp | hoặc - (vd: "CEO | VŨ LAND DEVELOPMENT")
  if (title && (title.value.includes('|') || title.value.includes(' - '))) {
    const sep = title.value.includes('|') ? '|' : ' - ';
    const parts = title.value.split(sep).map((p: string) => p.trim());
    for (const part of parts) {
      if (TITLE_REGEX.test(part)) {
        title = { ...title, value: part };
      } else if (COMPANY_REGEX.test(part) && (!companyName || companyName.value === title.value)) {
        companyName = { ...title, value: part };
      }
    }
  }

  if (companyName && (companyName.value.includes('|') || companyName.value.includes(' - '))) {
    const sep = companyName.value.includes('|') ? '|' : ' - ';
    const parts = companyName.value.split(sep).map((p: string) => p.trim());
    for (const part of parts) {
      if (COMPANY_REGEX.test(part)) {
        companyName = { ...companyName, value: part };
      } else if (TITLE_REGEX.test(part) && !title) {
        title = { ...companyName, value: part };
      }
    }
  }

  const address = pickClassifiedLine(lines, model.addressLine, { maxLen: 160 });
  if (model.addressLine !== null && !address) warnings.push('address_needs_review');

  const emails = extractEmails(lines, warnings);
  const phones = extractPhones(lines, warnings);
  const website = extractWebsite(lines);

  if (!displayName) warnings.push('no_name');
  const hasChannel = phones.length > 0 || emails.length > 0 || website !== undefined;
  if (!hasChannel) warnings.push('no_contact_channel');
  if (!displayName && !hasChannel) {
    if (lines.length > 0) {
      const fallbackLine = lines.find((l) => l.text && l.text.trim().length > 0);
      if (fallbackLine) {
        displayName = { value: fallbackLine.text.trim().slice(0, 80), confidence: 0.6, sourceText: fallbackLine.text };
        warnings.push('low_confidence_name');
      } else {
        return { ok: false, code: 'unusable' };
      }
    } else {
      return { ok: false, code: 'unusable' };
    }
  }

  const present: any[] = [
    ...(displayName ? [displayName] : []),
    ...(title ? [title] : []),
    ...(companyName ? [companyName] : []),
    ...(website ? [website] : []),
    ...(address ? [address] : []),
    ...phones,
    ...emails,
  ];
  const overallConfidence =
    present.length === 0
      ? 0
      : round2(present.reduce((sum, f) => sum + f.confidence, 0) / present.length);

  return {
    ok: true,
    candidate: {
      schemaVersion: 1,
      scanId,
      status: 'candidate',
      fields: {
        ...(displayName ? { displayName } : {}),
        ...(title ? { title } : {}),
        ...(companyName ? { companyName } : {}),
        phones,
        emails,
        ...(website ? { website } : {}),
        ...(address ? { address } : {}),
      },
      warnings,
      overallConfidence,
    },
  };
}

export function candidateFromRawModelOutput(raw: unknown, scanId: string): any {
  let dataToUse: any = null;
  const parsed = ocrModelOutputSchema.safeParse(raw);
  if (parsed.success) {
    dataToUse = { ...parsed.data };
  } else if (raw && typeof raw === 'object') {
    const rawObj = raw as any;
    const lines = Array.isArray(rawObj.lines)
      ? rawObj.lines
          .map((l: any) => ({
            text: String(l?.text || l || '').trim(),
            confidence: typeof l?.confidence === 'number' ? (l.confidence > 1 ? l.confidence / 100 : l.confidence) : 0.85,
          }))
          .filter((l: any) => l.text.length > 0)
      : [];

    if (lines.length > 0) {
      dataToUse = {
        isBusinessCard: true,
        unusableReason: null,
        lines,
        displayNameLine: typeof rawObj.displayNameLine === 'number' ? rawObj.displayNameLine : null,
        titleLine: typeof rawObj.titleLine === 'number' ? rawObj.titleLine : null,
        companyNameLine: typeof rawObj.companyNameLine === 'number' ? rawObj.companyNameLine : null,
        addressLine: typeof rawObj.addressLine === 'number' ? rawObj.addressLine : null,
        qrPresent: Boolean(rawObj.qrPresent),
      };
    }
  }

  if (!dataToUse || !Array.isArray(dataToUse.lines) || dataToUse.lines.length === 0) {
    return { ok: false, code: 'unusable' };
  }

  // Tự động phân tích thực thể tiếng Việt nếu chưa có dòng xác định
  if (
    dataToUse.displayNameLine === null ||
    dataToUse.titleLine === null ||
    dataToUse.companyNameLine === null
  ) {
    const enriched = extractVietnameseCardEntities(dataToUse.lines.map((l: any) => l.text));
    if (dataToUse.displayNameLine === null && enriched.displayNameLine !== null) {
      dataToUse.displayNameLine = enriched.displayNameLine;
    }
    if (dataToUse.titleLine === null && enriched.titleLine !== null) {
      dataToUse.titleLine = enriched.titleLine;
    }
    if (dataToUse.companyNameLine === null && enriched.companyNameLine !== null) {
      dataToUse.companyNameLine = enriched.companyNameLine;
    }
    if (dataToUse.addressLine === null && enriched.addressLine !== null) {
      dataToUse.addressLine = enriched.addressLine;
    }
  }

  const built = buildCandidateFromModel(dataToUse, scanId);
  if (!built.ok) return { ok: false, code: 'unusable' };
  return { ok: true, candidate: built.candidate };
}

// Từ khóa chức vụ tiếng Việt & quốc tế
const TITLE_REGEX = /(?:giám đốc|tổng giám đốc|chủ tịch|hđqt|phó giám đốc|trưởng phòng|phó phòng|ceo|founder|co-founder|cố vấn|quản lý|trợ lý|kỹ sư|luật sư|bác sĩ|chuyên viên|director|manager|president|head|leader|officer|executive|partner)/i;

// Từ khóa công ty / doanh nghiệp
const COMPANY_REGEX = /(?:công ty|tnhh|cổ phần|cp\b|tập đoàn|corporation|group|holdings|chi nhánh|doanh nghiệp|viện|xây dựng|thương mại|dịch vụ|invest|jsc|ltd|co\.,?ltd)/i;

// Từ khóa địa chỉ (sử dụng word boundary \b cho tp để không nhầm với http trong URL)
const ADDRESS_REGEX = /(?:địa chỉ|trụ sở|tầng|tòa nhà|số\s+\d+|đường|phố|ngõ|ngách|phường|quận|huyện|\bthành phố\b|\btp\.?\b|tỉnh|hà nội|hồ chí minh|đà nẵng|hải phòng|bình dương|đồng nai|cần thơ|việt nam|address|floor|bldg|building|street|ward|dist)/i;

// Họ người Việt Nam phổ biến
const VN_SURNAMES_REGEX = /^(?:nguyễn|trần|lê|phạm|hoàng|huỳnh|phan|vũ|võ|đặng|bùi|đỗ|hồ|ngô|dương|lý|đào|đoàn|đinh|lâm|mai|trịnh|cao|lưu|lương|thái|châu|tạ|phùng|vương|tô)\b/i;

export function extractVietnameseCardEntities(rawLines: string[]): any {
  const cleanLines = rawLines
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/^[\s-_=+*#.,:;/\\]+$/.test(l));

  const lines: { text: string; confidence: number }[] = [];
  let displayNameLine: number | null = null;
  let titleLine: number | null = null;
  let companyNameLine: number | null = null;
  let addressLine: number | null = null;

  for (const text of cleanLines) {
    lines.push({ text, confidence: 0.92 });
  }

  // 1. Kiểm tra các dòng kết hợp có dấu phân cách | hoặc - (vd: "CEO | VŨ LAND DEVELOPMENT")
  for (let i = 0; i < lines.length; i++) {
    const text = lines[i].text;
    if (text.includes('|') || text.includes(' - ')) {
      const separator = text.includes('|') ? '|' : ' - ';
      const parts = text.split(separator).map((p) => p.trim());
      for (const part of parts) {
        if (TITLE_REGEX.test(part) && titleLine === null) {
          titleLine = i;
        }
        if (COMPANY_REGEX.test(part) && companyNameLine === null) {
          companyNameLine = i;
        }
      }
    }
  }

  // 2. Tìm dòng Chức vụ (Title) nếu chưa thấy
  if (titleLine === null) {
    for (let i = 0; i < lines.length; i++) {
      const text = lines[i].text;
      if (TITLE_REGEX.test(text) && !EMAIL_RE.test(text)) {
        titleLine = i;
        break;
      }
    }
  }

  // 3. Tìm dòng Tên công ty (Company Name) nếu chưa thấy
  if (companyNameLine === null) {
    for (let i = 0; i < lines.length; i++) {
      const text = lines[i].text;
      if (COMPANY_REGEX.test(text) && i !== titleLine && !EMAIL_RE.test(text)) {
        companyNameLine = i;
        break;
      }
    }
  }

  // 4. Tìm dòng Địa chỉ (Address) - Bỏ qua URL và Email
  for (let i = 0; i < lines.length; i++) {
    const text = lines[i].text;
    if (EMAIL_RE.test(text) || URL_RE.test(text)) continue;
    if (ADDRESS_REGEX.test(text) && i !== companyNameLine && i !== titleLine) {
      addressLine = i;
      break;
    }
  }

  // 5. Tìm dòng Họ và Tên (Display Name)
  // Ưu tiên dòng có họ Việt Nam hoặc viết hoa toàn bộ, độ dài 2-5 từ, không chứa số/email/url/chức vụ
  for (let i = 0; i < lines.length; i++) {
    if (i === titleLine || i === companyNameLine || i === addressLine) continue;
    const text = lines[i].text;
    if (EMAIL_RE.test(text) || URL_RE.test(text)) continue;
    const digitsCount = (text.match(/\d/g) || []).length;
    if (digitsCount > 2) continue;

    const words = text.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && words.length <= 5) {
      if (VN_SURNAMES_REGEX.test(text) || text === text.toUpperCase() || /^[A-ZÀ-Ỹ]/.test(text)) {
        if (!TITLE_REGEX.test(text) && !COMPANY_REGEX.test(text)) {
          displayNameLine = i;
          break;
        }
      }
    }
  }

  // Nếu vẫn chưa tìm được tên, chọn dòng chữ ngắn đầu tiên hợp lệ
  if (displayNameLine === null) {
    for (let i = 0; i < lines.length; i++) {
      if (i === titleLine || i === companyNameLine || i === addressLine) continue;
      const text = lines[i].text;
      if (EMAIL_RE.test(text) || URL_RE.test(text)) continue;
      if ((text.match(/\d/g) || []).length > 2) continue;
      const words = text.split(/\s+/).filter(Boolean);
      if (words.length >= 2 && words.length <= 5) {
        displayNameLine = i;
        break;
      }
    }
  }

  return {
    isBusinessCard: true,
    unusableReason: null,
    lines,
    displayNameLine,
    titleLine,
    companyNameLine,
    addressLine,
    qrPresent: false,
  };
}

async function callOcrSpaceApi(imageDataUrl: string): Promise<string[] | null> {
  try {
    const preparedBase64 = imageDataUrl;

    const apiKeys = [
      process.env['OCR_SPACE_API_KEY'],
      'K88533814688957',
      'helloworld',
      'K87899142388957',
      'K83478988988957',
      'K82729916888957',
    ].filter(Boolean) as string[];

    // Ưu tiên Engine 1 (hỗ trợ tiếng Việt với language: 'vnm') trước Engine 2
    for (const apiKey of apiKeys) {
      for (const engine of ['1', '2']) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);

          const formData = new FormData();
          formData.append('apikey', apiKey);
          formData.append('base64Image', preparedBase64);
          if (engine === '1') {
            formData.append('language', 'vnm');
          }
          formData.append('isOverlayRequired', 'true');
          formData.append('detectOrientation', 'true');
          formData.append('scale', 'true');
          formData.append('OCREngine', engine);

          const res = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          });
          clearTimeout(timeout);

          if (!res.ok) continue;
          const json = (await res.json()) as any;
          if (json.IsErroredOnProcessing || !Array.isArray(json.ParsedResults)) continue;

          const parsed = json.ParsedResults[0];
          const extractedLines: string[] = [];

          // Ưu tiên ParsedText vì giữ nguyên định dạng ngắt dòng tự nhiên của danh thiếp
          if (parsed.ParsedText && typeof parsed.ParsedText === 'string') {
            const splitLines = parsed.ParsedText.split(/\r?\n/).map((l: string) => l.trim()).filter(Boolean);
            if (splitLines.length > 0) {
              extractedLines.push(...splitLines);
            }
          }

          if (extractedLines.length === 0 && parsed.TextOverlay && Array.isArray(parsed.TextOverlay.Lines)) {
            for (const lineObj of parsed.TextOverlay.Lines) {
              const lineStr = (lineObj.LineText || '').trim();
              if (lineStr) extractedLines.push(lineStr);
            }
          }

          if (extractedLines.length > 0) {
            return extractedLines;
          }
        } catch (keyErr: any) {
          console.warn(`[callOcrSpaceApi] Engine ${engine} with key failed:`, keyErr?.message || keyErr);
        }
      }
    }

    return null;
  } catch (err: any) {
    console.warn('[callOcrSpaceApi] OCR.space request failed or timed out:', err?.message || err);
    return null;
  }
}

export function parseCardHeuristicFallback(imageDataUrl: string): any {
  let rawText = '';
  try {
    if (imageDataUrl.includes('data:')) {
      const base64Part = imageDataUrl.split(',')[1] || '';
      if (base64Part.length > 64) {
        const sampleBuffer = Buffer.from(base64Part.slice(0, 32768), 'base64');
        const textSample = sampleBuffer.toString('utf8');
        if (textSample.includes('VCARD') || textSample.includes('FN:') || textSample.includes('TEL:')) {
          rawText = textSample;
        }
      }
    }
  } catch {
    // ignore
  }

  const lines: { text: string; confidence: number }[] = [];
  let displayNameLine: number | null = null;
  let titleLine: number | null = null;
  let companyNameLine: number | null = null;
  let addressLine: number | null = null;
  let qrPresent = false;

  if (rawText.includes('VCARD')) {
    qrPresent = true;
    const vcardLines = rawText.split(/\r?\n/);
    for (const vline of vcardLines) {
      const trimmed = vline.trim();
      if (trimmed.startsWith('FN:')) {
        displayNameLine = lines.length;
        lines.push({ text: trimmed.slice(3).trim(), confidence: 0.95 });
      } else if (trimmed.startsWith('TITLE:')) {
        titleLine = lines.length;
        lines.push({ text: trimmed.slice(6).trim(), confidence: 0.92 });
      } else if (trimmed.startsWith('ORG:')) {
        companyNameLine = lines.length;
        lines.push({ text: trimmed.slice(4).trim(), confidence: 0.92 });
      } else if (trimmed.startsWith('TEL')) {
        const val = trimmed.split(':')[1]?.trim();
        if (val) lines.push({ text: val, confidence: 0.95 });
      } else if (trimmed.startsWith('EMAIL')) {
        const val = trimmed.split(':')[1]?.trim();
        if (val) lines.push({ text: val, confidence: 0.95 });
      } else if (trimmed.startsWith('ADR')) {
        const val = trimmed.split(':')[1]?.trim();
        if (val) {
          addressLine = lines.length;
          lines.push({ text: val.replace(/;/g, ' ').trim(), confidence: 0.88 });
        }
      }
    }
  }

  // Tuyệt đối không gán dữ liệu dummy cứng! Nếu không tìm thấy chữ, trả về unusable truthfully
  return {
    isBusinessCard: lines.length > 0,
    unusableReason: lines.length === 0 ? 'no_text_detected' : null,
    lines,
    displayNameLine,
    titleLine,
    companyNameLine,
    addressLine,
    qrPresent,
  };
}

export async function runCardOcrVision(imageDataUrl: string): Promise<unknown> {
  // 1. Thử gọi Cloud AI Vision nếu có cấu hình API Key (Gemini Flash / OpenAI GPT-4o-mini)
  const apiKey =
    process.env['GEMINI_API_KEY'] ||
    process.env['OPENAI_API_KEY'] ||
    process.env['LOVABLE_API_KEY'] ||
    process.env['ANTHROPIC_API_KEY'];

  if (apiKey) {
    try {
      let endpoint = 'https://ai.gateway.lovable.dev/v1/chat/completions';
      let model = 'google/gemini-2.5-flash';

      if (apiKey.startsWith('AIza') || process.env['GEMINI_API_KEY']) {
        endpoint = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
        model = process.env['AI_MODEL'] || 'gemini-1.5-flash';
      } else if (process.env['OPENAI_API_KEY'] && !process.env['LOVABLE_API_KEY']) {
        endpoint = 'https://api.openai.com/v1/chat/completions';
        model = 'gpt-4o-mini';
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          temperature: 0.1,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are a high-accuracy Vietnamese business card OCR parser.
Accurately read and extract all text from the business card image (Full Name, Job Title, Company Name, Phones, Emails, Website, Address).
Return STRICT JSON only matching this schema:
{
  "isBusinessCard": true,
  "unusableReason": null,
  "lines": [ { "text": string, "confidence": number } ],
  "displayNameLine": number | null,
  "titleLine": number | null,
  "companyNameLine": number | null,
  "addressLine": number | null,
  "qrPresent": boolean
}`,
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Extract business card data accurately into JSON.' },
                { type: 'image_url', image_url: { url: imageDataUrl } },
              ],
            },
          ],
        }),
      });

      clearTimeout(timeout);

      if (response.ok) {
        const json = (await response.json()) as any;
        const content = json?.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content.replace(/```json/gi, '').replace(/```/g, '').trim());
          if (parsed && Array.isArray(parsed.lines) && parsed.lines.length > 0) {
            return parsed;
          }
        }
      }
    } catch (err: any) {
      console.warn('[runCardOcrVision] Cloud AI vision call error, falling back to OCR engine:', err?.message || err);
    }
  }

  // 2. Nhận diện trực tiếp qua OCR.space Tiếng Việt (Engine 1 với language: 'vnm')
  try {
    const ocrLines = await callOcrSpaceApi(imageDataUrl);
    if (ocrLines && ocrLines.length > 0) {
      const extracted = extractVietnameseCardEntities(ocrLines);
      return extracted;
    }
  } catch (ocrErr: any) {
    console.warn('[runCardOcrVision] OCR engine error, falling back to local heuristic:', ocrErr?.message || ocrErr);
  }

  // 3. Fallback Heuristic cục bộ nếu có dữ liệu vCard/text nhúng
  return parseCardHeuristicFallback(imageDataUrl);
}

export async function callSuggestCustomerTagsAi(input: {
  stageLabel: string;
  displayName: string;
  companyName: string;
  note: string;
  logs: string[];
  needs: string[];
  existingTagNames: string[];
  currentTagNames: string[];
  approvedTagNames?: string[];
  rejectedTagNames?: string[];
}) {
  const apiKey = process.env['LOVABLE_API_KEY'];
  if (!apiKey) return { ok: false, error: 'unavailable' as const };

  const context = [
    `Tên: ${input.displayName || '(không rõ)'}`,
    `Công ty: ${input.companyName || '(không rõ)'}`,
    `Giai đoạn: ${input.stageLabel}`,
    `Ghi chú: ${input.note || '(trống)'}`,
    `Lịch sử chăm sóc:\n${input.logs.length ? input.logs.map((l) => `- ${l}`).join('\n') : '(trống)'}`,
    `Điểm đau & nhu cầu:\n${input.needs.length ? input.needs.map((n) => `- ${n}`).join('\n') : '(trống)'}`,
    `Nhãn đã gắn: ${input.currentTagNames.join(', ') || '(chưa có)'}`,
    `Danh mục nhãn hiện có: ${input.existingTagNames.join(', ') || '(chưa có)'}`,
    `Nhãn người dùng đánh giá ĐÚNG trước đây: ${(input.approvedTagNames ?? []).join(', ') || '(chưa có)'}`,
    `Nhãn người dùng đánh giá SAI trước đây (tuyệt đối không đề xuất lại): ${
      (input.rejectedTagNames ?? []).join(', ') || '(chưa có)'
    }`,
  ].join('\n');

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: `Bạn là trợ lý phân nhóm khách hàng cho một người bán hàng cá nhân.
Đề xuất tối đa 5 NHÃN ngắn để phân nhóm khách hàng.
Trả về DUY NHẤT JSON dạng: {"suggestions":[{"name":"...","reason":"...","confidence":0.8}]}. Không markdown.`,
        },
        { role: 'user', content: context },
      ],
    }),
  });

  if (!response.ok) return { ok: false, error: 'unavailable' as const };
  const json = (await response.json()) as any;
  const content = json?.choices?.[0]?.message?.content ?? '';

  try {
    const text = content.replace(/```json/gi, '').replace(/```/g, '').trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start < 0 || end <= start) return { ok: false, error: 'unavailable' as const };
    const parsed = JSON.parse(text.slice(start, end + 1)) as any;
    const rawSuggestions = (parsed.suggestions ?? [])
      .map((s: any) => ({
        name: String(s.name || '').trim().slice(0, 24),
        reason: String(s.reason || '').trim().slice(0, 120),
        confidence: typeof s.confidence === 'number' ? s.confidence : 0.5,
      }))
      .filter((s: any) => s.name.length > 0)
      .slice(0, 5);

    const existing = new Set(input.existingTagNames.map((n) => n.toLowerCase()));
    const already = new Set(input.currentTagNames.map((n) => n.toLowerCase()));
    const seen = new Set<string>();
    const suggestions: any[] = [];

    for (const s of rawSuggestions) {
      const key = s.name.toLowerCase();
      if (seen.has(key) || already.has(key)) continue;
      seen.add(key);
      suggestions.push({
        name: s.name,
        reason: s.reason,
        existing: existing.has(key),
        confidence: s.confidence,
      });
    }

    return { ok: true, suggestions };
  } catch {
    return { ok: false, error: 'unavailable' as const };
  }
}
