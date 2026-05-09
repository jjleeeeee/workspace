import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TextButton } from "./components/TextButton/TextButton";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main style={{ display: "grid", minHeight: "100vh", placeItems: "center" }}>
      <TextButton>Text</TextButton>
    </main>
  </StrictMode>,
);
