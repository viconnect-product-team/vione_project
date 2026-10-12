export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    const doRegister = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered:", reg.scope);
        })
        .catch((err) => {
          if (err?.name === "SecurityError" || String(err).includes("SSL") || String(err).includes("SecurityError")) {
            console.debug("[PWA] Service Worker registration skipped in current SSL context:", err);
          } else {
            console.warn("[PWA] Service Worker registration failed:", err);
          }
        });
    };

    if (document.readyState === "complete") {
      doRegister();
    } else {
      window.addEventListener("load", doRegister);
    }
  }
}
