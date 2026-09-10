import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { AuthProvider } from "./context/AuthProvider";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const basePath = import.meta.env.BASE_URL;
    navigator.serviceWorker.register(`${basePath}sw.js`, {
      scope: basePath,
    }).catch(() => {
      // ignore registration errors in unsupported environments
    });
  });
}
