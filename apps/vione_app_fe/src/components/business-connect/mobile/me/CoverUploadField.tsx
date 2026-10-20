// ViOne Cover Photo Upload Field with interactive Pan & Zoom (16:9)
// Tải ảnh bìa trực tiếp từ máy với khả năng kéo di chuyển góc hiển thị và zoom.

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { getNestApiUrl } from "@/lib/api-client";
import { getImageUrl } from "@/lib/image";
import { ImagePanCropModal } from "@/components/common/ImagePanCropModal";
import { toast } from "sonner";

export type CoverUploadFieldProps = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
};

export function CoverUploadField({ value, onChange, disabled }: CoverUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>("cover.jpg");

  const handleFileSelect = (file: File | undefined) => {
    if (!file || busy) return;
    setOriginalFileName(file.name || "cover.jpg");
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setSelectedImageSrc(dataUrl);
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  async function uploadCroppedBlob(blob: Blob) {
    setCropModalOpen(false);
    setFailed(false);
    setBusy(true);
    try {
      const token =
        (typeof window !== "undefined" &&
          (localStorage.getItem("vibe_token") ||
            localStorage.getItem("token") ||
            localStorage.getItem("access_token") ||
            localStorage.getItem("sb-access-token") ||
            localStorage.getItem("vba_token"))) ||
        "";

      const formData = new FormData();
      formData.append("file", blob, originalFileName);

      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      let resData: any = null;
      try {
        const res = await fetch(getNestApiUrl("/upload/file"), {
          method: "POST",
          credentials: "include",
          headers,
          body: formData,
        });
        if (res.ok) {
          resData = await res.json();
        }
      } catch (err) {
        console.warn("[CoverUploadField] /upload/file network error:", err);
      }

      if (resData?.url) {
        onChange(resData.url);
        toast.success("Đã cập nhật ảnh bìa thành công!");
      } else {
        setFailed(true);
        toast.error("Không thể tải ảnh bìa lên máy chủ");
      }
    } catch {
      setFailed(true);
      toast.error("Đã xảy ra lỗi khi xử lý ảnh");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--bc-mobile-border)] bg-[var(--bc-mobile-surface-2)]">
        {value ? (
          <img
            src={getImageUrl(value)}
            alt="Ảnh bìa"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[var(--bc-mobile-muted)] bg-gradient-to-r from-[#182338]/40 to-[#243350]/40">
            <ImagePlus className="h-8 w-8 text-[#D8B282]/60" />
            <span className="text-xs font-medium">Chưa có ảnh bìa</span>
          </div>
        )}

        {/* Floating Action Overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            type="button"
            disabled={disabled || busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 px-3.5 text-xs font-semibold text-white shadow-lg transition hover:bg-black/90 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D8B282]" />
            ) : (
              <ImagePlus className="h-3.5 w-3.5 text-[#D8B282]" />
            )}
            <span>{busy ? "Đang tải..." : value ? "Đổi ảnh bìa" : "Tải ảnh bìa"}</span>
          </button>

          {value ? (
            <button
              type="button"
              disabled={disabled || busy}
              onClick={() => {
                onChange("");
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="inline-flex min-h-9 items-center justify-center rounded-xl bg-black/70 backdrop-blur-md border border-white/20 p-2 text-rose-400 hover:bg-rose-500/20"
              title="Xóa ảnh bìa"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFileSelect(e.target.files?.[0])}
      />

      <p className="mt-2 text-[12px] leading-snug text-[var(--bc-mobile-muted)]">
        {failed ? "Tải ảnh bìa thất bại, vui lòng thử lại." : "Chọn ảnh bìa và kéo thả chọn góc hiển thị chuẩn 16:9 cho danh thiếp."}
      </p>

      {/* Interactive Crop / Pan Modal */}
      <ImagePanCropModal
        isOpen={cropModalOpen}
        imageSrc={selectedImageSrc}
        aspectRatio="16:9"
        circular={false}
        title="Chọn vùng hiển thị Ảnh bìa (16:9)"
        onConfirm={uploadCroppedBlob}
        onCancel={() => {
          setCropModalOpen(false);
          setSelectedImageSrc(null);
        }}
      />
    </div>
  );
}
