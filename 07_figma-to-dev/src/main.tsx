import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@chord-ds/components/styles";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
