"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    // Development assets change on every edit; caching them hides local changes.
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator) || !window.isSecureContext) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Offline support could not be initialized:", error);
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);
  return null;
}
