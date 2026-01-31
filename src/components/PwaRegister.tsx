  "use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && window.location.protocol === "https:") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            // console.log("SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }
    // Also allow localhost for testing
    if ("serviceWorker" in navigator && window.location.hostname === "localhost") {
       navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return null;
}
