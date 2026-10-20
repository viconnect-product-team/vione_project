// ViOne Interactive Image Pan & Crop Modal
// Cho phép người dùng kéo thả (drag / pan) di chuyển ảnh và phóng to/thu nhỏ (zoom)
// để chọn chính xác vùng hiển thị đẹp nhất trước khi tải lên (Avatar 1:1 tròn / Ảnh bìa 16:9).

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move, Sparkles } from "lucide-react";

export type ImagePanCropModalProps = {
  isOpen: boolean;
  imageSrc: string | null;
  aspectRatio?: "1:1" | "16:9";
  circular?: boolean;
  title?: string;
  onConfirm: (croppedBlob: Blob) => void;
  onCancel: () => void;
};

export function ImagePanCropModal({
  isOpen,
  imageSrc,
  aspectRatio = "1:1",
  circular = true,
  title = "Căn chỉnh vùng hiển thị ảnh",
  onConfirm,
  onCancel,
}: ImagePanCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Reset state when a new image is loaded
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [isOpen, imageSrc]);

  // Pointer event handlers for Pan/Drag
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.min(Math.max(0.5, prev + delta), 4));
  };

  // Crop and export
  const handleCropAndConfirm = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;
    const img = imageRef.current;
    const container = containerRef.current;

    // Create high-res canvas
    const canvas = document.createElement("canvas");
    const targetWidth = aspectRatio === "1:1" ? 600 : 1200;
    const targetHeight = aspectRatio === "1:1" ? 600 : 675;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background fill
    ctx.fillStyle = "#0A0E18";
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    const containerRect = container.getBoundingClientRect();
    const scaleFactor = targetWidth / containerRect.width;

    ctx.save();
    // Move to canvas center
    ctx.translate(targetWidth / 2, targetHeight / 2);
    // Apply pan translated to high-res scale
    ctx.translate(pan.x * scaleFactor, pan.y * scaleFactor);
    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);
    // Apply zoom
    ctx.scale(zoom, zoom);

    // Draw the image centered
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawWidth = targetWidth;
    let drawHeight = targetWidth / imgAspect;

    if (drawHeight < targetHeight) {
      drawHeight = targetHeight;
      drawWidth = targetHeight * imgAspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onConfirm(blob);
        }
      },
      "image/jpeg",
      0.92,
    );
  }, [aspectRatio, pan, rotation, zoom, onConfirm]);

  if (!isOpen || !imageSrc) return null;

  const isOneToOne = aspectRatio === "1:1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 selection:bg-[#D8B282]/30">
      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[#D8B282]/30 bg-[#0C1220] shadow-2xl shadow-black">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D8B282]/20 text-[#D8B282]">
              <Move className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">
                Kéo để di chuyển góc ảnh · Dùng thanh trượt để phóng to/thu nhỏ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewport Workspace */}
        <div className="relative flex items-center justify-center bg-[#070A12] p-6 overflow-hidden select-none">
          {/* Target Crop Mask Frame */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
            className={`relative overflow-hidden cursor-grab active:cursor-grabbing border-2 border-[#D8B282] shadow-[0_0_30px_rgba(216,178,130,0.25)] touch-none ${
              isOneToOne
                ? `w-64 h-64 sm:w-72 sm:h-72 ${circular ? "rounded-full" : "rounded-2xl"}`
                : "w-full aspect-[16/9] rounded-2xl"
            }`}
          >
            {/* The Image inside the viewport */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.05s ease-out",
              }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                className="max-w-none min-w-full min-h-full object-cover select-none"
                draggable={false}
              />
            </div>

            {/* Grid overlay for golden ratio alignment */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
              <div className="border-r border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-b border-white/40" />
              <div className="border-r border-white/40" />
              <div className="border-r border-white/40" />
              <div />
            </div>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-col gap-3 border-t border-white/10 bg-[#0E1524] px-5 py-4">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <ZoomOut className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min="0.8"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-[#D8B282]"
            />
            <ZoomIn className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="min-w-10 text-right font-mono text-xs text-[#D8B282]">
              {Math.round(zoom * 100)}%
            </span>

            {/* Rotate Button */}
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              title="Xoay ảnh 90 độ"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-400">
            Dùng ngón tay hoặc chuột kéo ảnh để căn giữa khuôn mặt hoặc góc mong muốn.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleCropAndConfirm}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D8B282] to-[#B38E5D] px-5 py-2 text-xs font-bold text-[#070B14] shadow-md shadow-[#D8B282]/20 hover:brightness-105 active:scale-95 transition"
            >
              <Check className="h-4 w-4" />
              <span>Áp dụng vùng chọn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
