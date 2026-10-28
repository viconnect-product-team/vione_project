import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PlatformPwaApp } from "@/components/platform-app/PlatformPwaApp";

export const Route = createFileRoute("/platform-app")({
  head: () => ({
    meta: [
      { title: "ViOne App Premium — Hệ Sinh Thái Di Sản & Giải Chạy Quốc Gia" },
      {
        name: "description",
        content:
          "Ứng dụng di động PWA độc lập: Tham quan di sản VR360, bảo tàng số 3D kèm thuyết minh Audio Guide, giải chạy marathon cấp BIB RFID tự động và ví vé điện tử Napas 24/7.",
      },
      { name: "theme-color", content: "#050C15" },
    ],
  }),
  component: PlatformAppPage,
});

function PlatformAppPage() {
  return <PlatformPwaApp />;
}
