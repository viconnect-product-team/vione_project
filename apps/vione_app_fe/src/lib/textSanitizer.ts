/**
 * Utility: Tự động chữa lành (auto-heal/sanitize) các chuỗi tiếng Việt bị lỗi font/mã hóa
 * (ví dụ "Gia ??nh" hay "H? sinh th?i k?t n?i & chuy?n ??i s? Gia ??nh ViOne")
 */

export function sanitizeVietnameseText(text?: string | null): string {
  if (!text || typeof text !== "string") return "";

  let result = text;

  result = result
    .replace(/Gia\s*\?\?nh\s*ViOne/gi, "Gia Đình ViOne")
    .replace(/Gia\s*\?nh\s*ViOne/gi, "Gia Đình ViOne")
    .replace(/Gia\s*\?\?nh/gi, "Gia Đình")
    .replace(/Gia\s*\?nh/gi, "Gia Đình")
    .replace(/H\?\s*sinh\s*th\?i\s*k\?t\s*n\?i\s*&\s*chuy\?n\s*\?\?i\s*s\?\s*Gia\s*\?\?nh\s*ViOne/gi, "Hệ sinh thái kết nối & chuyển đổi số Gia Đình ViOne")
    .replace(/H\?\s*sinh\s*th\?i\s*k\?t\s*n\?i\s*&\s*chuy\?n\s*\?i\s*s\?\s*Gia\s*\?nh\s*ViOne/gi, "Hệ sinh thái kết nối & chuyển đổi số Gia Đình ViOne")
    .replace(/H\?\s*sinh\s*th\?i/gi, "Hệ sinh thái")
    .replace(/k\?t\s*n\?i/gi, "kết nối")
    .replace(/chuy\?n\s*\?\?i\s*s\?/gi, "chuyển đổi số")
    .replace(/chuy\?n\s*\?i\s*s\?/gi, "chuyển đổi số")
    .replace(/chuy\?n\s*đổi\s*s\?/gi, "chuyển đổi số")
    .replace(/chuy\?n/gi, "chuyển")
    .replace(/th\?i/gi, "thái")
    .replace(/\?\?i\s*s\?/gi, "đổi số")
    .replace(/\?i\s*s\?/gi, "đổi số");

  return result;
}
