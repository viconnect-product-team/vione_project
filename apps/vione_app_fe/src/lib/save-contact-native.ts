// ViOne Direct Contact Saver — Lưu danh bạ trực tiếp 1-chạm vào điện thoại
// Tối ưu hóa chuyển thẳng vào ứng dụng Danh bạ (Contacts) của máy, không tải file PDF / không mở ứng dụng xem tài liệu.

import { toast } from "sonner";

export interface ContactDataToSave {
  displayName: string;
  phone?: string | null;
  jobTitle?: string | null;
  companyName?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  note?: string | null;
  avatarUrl?: string | null;
  shareUrl?: string | null;
}

/** Chuyển tên người dùng thành tên tệp .vcf an toàn */
export function sanitizeContactFilename(name: string): string {
  const clean = (name || "danh-ba")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 50);
  return `${clean || "danh-ba"}.vcf`;
}

/** Sinh nội dung vCard 3.0 chuẩn quốc tế tương thích 100% iOS & Android Contacts */
export function buildVCardString(card: ContactDataToSave): string {
  const name = (card.displayName || "Doanh Nhân ViOne").trim();
  const cleanPhone = (card.phone || "").replace(/[^\d+]/g, "").trim();

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN;CHARSET=UTF-8:${name}`,
    `N;CHARSET=UTF-8:${name};;;;`,
  ];

  if (card.companyName?.trim()) {
    lines.push(`ORG;CHARSET=UTF-8:${card.companyName.trim()}`);
  }
  if (card.jobTitle?.trim()) {
    lines.push(`TITLE;CHARSET=UTF-8:${card.jobTitle.trim()}`);
  }
  if (cleanPhone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${cleanPhone}`);
  }
  if (card.email?.trim()) {
    lines.push(`EMAIL;TYPE=PREF,INTERNET:${card.email.trim()}`);
  }
  if (card.website?.trim()) {
    lines.push(`URL:${card.website.trim()}`);
  }
  if (card.shareUrl?.trim()) {
    lines.push(`URL;TYPE=ViOne:${card.shareUrl.trim()}`);
  }
  if (card.address?.trim()) {
    lines.push(`ADR;TYPE=WORK;CHARSET=UTF-8:;;${card.address.trim()};;;;VN`);
  }
  if (card.note?.trim()) {
    lines.push(`NOTE;CHARSET=UTF-8:${card.note.trim().replace(/[\r\n]+/g, " ")}`);
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

/**
 * Lưu danh bạ trực tiếp vào điện thoại (iOS / Android / PWA):
 * 1. Web Share API Level 2 với MIME text/x-vcard mở trực tiếp ứng dụng Danh bạ
 * 2. Trên iOS Safari: Data URI hoặc Direct VCF view mở thẻ thêm liên hệ ngay lập tức
 * 3. Fallback: Kích hoạt tải tệp vCard đúng chuẩn text/x-vcard kèm thông báo mở Danh bạ
 */
export async function saveContactDirectly(card: ContactDataToSave): Promise<boolean> {
  const vcfString = buildVCardString(card);
  const filename = sanitizeContactFilename(card.displayName);
  const isIos =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent || "") &&
    !(window as any).MSStream;

  // 1. Thử Web Share API với tệp vCard chuẩn (Ưu tiên số 1 trên Mobile Safari & Chrome Android)
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      const file = new File([vcfString], filename, {
        type: "text/x-vcard",
        lastModified: Date.now(),
      });

      if (
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: `Lưu danh bạ: ${card.displayName}`,
          text: `Liên hệ của ${card.displayName} (${card.jobTitle || "Doanh nhân"} tại ${card.companyName || "ViOne"})`,
        });
        toast.success("✓ Đã mở Danh bạ máy! Nhấn [Lưu] để hoàn tất.");
        return true;
      }
    } catch (shareErr: any) {
      if (shareErr?.name === "AbortError") {
        // Người dùng tự bấm hủy share sheet
        return false;
      }
      console.warn("[SaveContact] Web Share API error, using direct intent/vcf fallback:", shareErr);
    }
  }

  // 2. Trên thiết bị iOS (iPhone/iPad): Điều hướng trực tiếp sang Data URI text/x-vcard
  // Safari trên iOS sẽ ngay lập tức bật popup "Thêm vào Danh bạ" mà không cần tải file
  if (isIos) {
    try {
      const dataUri = `data:text/x-vcard;charset=utf-8,${encodeURIComponent(vcfString)}`;
      window.location.href = dataUri;
      toast.success("✓ Đã mở Danh bạ iPhone! Nhấn [Lưu] để thêm liên hệ.");
      return true;
    } catch (iosErr) {
      console.warn("[SaveContact] iOS Data URI fallback error:", iosErr);
    }
  }

  // 3. Fallback trên Android / Máy tính: Tải tệp .vcf chuẩn MIME text/x-vcard
  try {
    const blob = new Blob([vcfString], { type: "text/x-vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 4000);

    toast.success("✓ Đã mở liên hệ danh bạ! Mở tệp để hoàn tất lưu vào máy.");
    return true;
  } catch (downloadErr) {
    console.error("[SaveContact] Download fallback failed:", downloadErr);
    toast.error("Không thể lưu danh bạ. Vui lòng thử lại!");
    return false;
  }
}
