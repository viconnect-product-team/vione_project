export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("data:")) return path;

  // Xử lý chống Mixed Content khi đang chạy HTTPS hoặc rewrite port nội bộ
  if (typeof window !== "undefined") {
    if (
      path.startsWith("http://14.225.217.232") ||
      path.includes(":5001") ||
      path.includes(":5002") ||
      path.includes(":5003") ||
      path.includes(":5004") ||
      path.includes(":5005") ||
      path.includes(":4000") ||
      path.includes(":4001")
    ) {
      try {
        const u = new URL(path);
        return `${window.location.origin}${u.pathname}${u.search}`;
      } catch {
        // fallback
      }
    }
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Static public assets check (files residing in public/ directory)
  const isStaticPublic =
    path.startsWith("/images/") ||
    path.startsWith("/landing/") ||
    path.startsWith("/landing_web_vione/") ||
    path.startsWith("/docs/") ||
    path.startsWith("/assets/") ||
    path.startsWith("/app-icon") ||
    path.startsWith("/brand-") ||
    path.startsWith("/vione-") ||
    path.startsWith("/favicon") ||
    path.endsWith(".ico") ||
    path.endsWith(".webmanifest");

  if (isStaticPublic) {
    return path.startsWith("/") ? path : `/${path}`;
  }

  // Trên trình duyệt, dùng relative URL để Vite dev server hoặc Nginx proxy tự chuyển hướng /api và /upload
  const baseUrl =
    typeof window !== "undefined"
      ? ""
      : import.meta.env.VITE_API_URL || "http://localhost:4001";
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  // If already prefixed with /api/upload
  if (cleanPath.startsWith("/api/upload")) {
    return `${cleanBase}${cleanPath}`;
  }

  if (cleanPath.startsWith("/upload/")) {
    cleanPath = `/api${cleanPath}`;
  } else if (cleanPath.startsWith("/uploads/")) {
    cleanPath = `/api/upload/file${cleanPath.replace(/^\/uploads/, "")}`;
  } else if (cleanPath.startsWith("/avatars/")) {
    cleanPath = `/api/upload/file${cleanPath}`;
  } else if (cleanPath.startsWith("/documents/")) {
    cleanPath = `/api/upload/file${cleanPath}`;
  } else if (!cleanPath.startsWith("/api/")) {
    // If it's a bare uploaded file name like "1719283-abc.png" or "avatar.jpg"
    cleanPath = `/api/upload/file${cleanPath}`;
  }

  return `${cleanBase}${cleanPath}`;
}
