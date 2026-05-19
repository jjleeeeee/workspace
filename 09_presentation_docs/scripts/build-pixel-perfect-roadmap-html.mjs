import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const slideDir = ".frontend-slides/pixel-perfect-render/slides";
const output = "dist/chord-roadmap-frontend-slides.html";
const slideTitles = [
  "Chord Design System 2026 Roadmap",
  "2023-2025 Recap",
  "2026 Chord Design System",
  "2026 Goal",
  "2026 Goal - Maturity Model",
  "2026 Goal - 2 Point",
  "2026 Roadmap - Key Task",
  "2026 Roadmap - Key Task",
  "2026 Roadmap - 2Q Task",
  "2026 Roadmap - 3Q Task",
  "2026 Roadmap - 4Q Task",
  "2026 Member R&R",
  "Appendix",
  "E.O.D",
];

const slides = [];
for (let i = 0; i < slideTitles.length; i += 1) {
  const file = path.join(slideDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
  const data = await readFile(file);
  slides.push({
    index: i + 1,
    title: slideTitles[i],
    dataUrl: `data:image/png;base64,${data.toString("base64")}`,
  });
}

const slideMarkup = slides.map((slide) => `      <article class="slide${slide.index === 1 ? " active" : ""}" id="slide-${slide.index}" aria-label="${escapeHtml(slide.title)}" aria-hidden="${slide.index === 1 ? "false" : "true"}">
        <img src="${slide.dataUrl}" alt="${escapeHtml(slide.title)}">
      </article>`).join("\n");

const dotMarkup = slides.map((slide) => `        <button type="button" class="dot${slide.index === 1 ? " active" : ""}" data-slide="${slide.index - 1}" aria-label="Go to slide ${slide.index}"></button>`).join("\n");

const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Chord Design System 2026 Roadmap</title>
  <style>
    /* === RESET === */
    * {
      box-sizing: border-box;
    }

    html,
    body {
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: hidden;
      background: #000;
      color: #fff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    button {
      font: inherit;
    }

    /* === DECK VIEWPORT === */
    .deck {
      position: relative;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
      background: #000;
    }

    .slide {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transition: opacity 160ms ease;
    }

    .slide.active {
      opacity: 1;
      pointer-events: auto;
    }

    .slide img {
      display: block;
      width: min(100vw, calc(100dvh * 16 / 9));
      height: min(100dvh, calc(100vw * 9 / 16));
      max-width: 100vw;
      max-height: 100dvh;
      object-fit: contain;
      image-rendering: auto;
      user-select: none;
      -webkit-user-drag: none;
      background: #000;
    }

    /* === CONTROLS === */
    .chrome {
      position: fixed;
      right: clamp(10px, 1.4vw, 20px);
      bottom: clamp(10px, 1.4vw, 20px);
      z-index: 20;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 9px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.46);
      color: rgba(255, 255, 255, 0.78);
      font-size: clamp(11px, 1vw, 13px);
      backdrop-filter: blur(10px);
      opacity: 0;
      transition: opacity 180ms ease;
    }

    .deck:hover .chrome,
    .chrome:focus-within {
      opacity: 1;
    }

    .chrome button {
      display: grid;
      place-items: center;
      width: 26px;
      height: 26px;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }

    .chrome button:hover,
    .chrome button:focus-visible {
      background: rgba(255, 255, 255, 0.12);
      outline: none;
    }

    .dots {
      position: fixed;
      top: 50%;
      right: clamp(10px, 1.3vw, 18px);
      z-index: 19;
      display: grid;
      gap: 7px;
      transform: translateY(-50%);
      opacity: 0;
      transition: opacity 180ms ease;
    }

    .deck:hover .dots,
    .dots:focus-within {
      opacity: 1;
    }

    .dot {
      width: 7px;
      height: 7px;
      padding: 0;
      border: 1px solid rgba(255, 255, 255, 0.44);
      border-radius: 999px;
      background: transparent;
      cursor: pointer;
    }

    .dot.active {
      border-color: #fff;
      background: #fff;
    }

    .progress {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 21;
      width: 100vw;
      height: 2px;
      background: rgba(255, 255, 255, 0.16);
    }

    .progress span {
      display: block;
      width: 0;
      height: 100%;
      background: #fff;
      transition: width 160ms ease;
    }

    @media (max-width: 700px) {
      .dots {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .slide,
      .chrome,
      .dots,
      .progress span {
        transition: none;
      }
    }
  </style>
</head>
<body>
  <main class="deck" aria-label="Chord Design System 2026 Roadmap presentation">
${slideMarkup}
    <nav class="dots" aria-label="Slide navigation">
${dotMarkup}
    </nav>
    <nav class="chrome" aria-label="Presentation controls">
      <button type="button" id="prev" aria-label="Previous slide">‹</button>
      <span id="counter">1 / ${slides.length}</span>
      <button type="button" id="next" aria-label="Next slide">›</button>
    </nav>
    <div class="progress" aria-hidden="true"><span id="progress"></span></div>
  </main>

  <script>
    /* === SLIDE CONTROLLER === */
    (() => {
      const slides = Array.from(document.querySelectorAll(".slide"));
      const dots = Array.from(document.querySelectorAll(".dot"));
      const counter = document.getElementById("counter");
      const progress = document.getElementById("progress");
      const prev = document.getElementById("prev");
      const next = document.getElementById("next");
      let current = 0;
      let touchStartX = 0;

      function parseHash() {
        const match = location.hash.match(/^#slide-(\\d+)$/);
        if (!match) return 0;
        const index = Number(match[1]) - 1;
        return Number.isInteger(index) && index >= 0 && index < slides.length ? index : 0;
      }

      function show(index, updateHash = true) {
        current = Math.max(0, Math.min(index, slides.length - 1));
        slides.forEach((slide, i) => {
          const active = i === current;
          slide.classList.toggle("active", active);
          slide.setAttribute("aria-hidden", active ? "false" : "true");
        });
        dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
        counter.textContent = \`\${current + 1} / \${slides.length}\`;
        progress.style.width = \`\${((current + 1) / slides.length) * 100}%\`;
        document.title = \`\${String(current + 1).padStart(2, "0")} · Chord Roadmap\`;
        if (updateHash) history.replaceState(null, "", \`#slide-\${current + 1}\`);
      }

      function move(delta) {
        show(current + delta);
      }

      prev.addEventListener("click", () => move(-1));
      next.addEventListener("click", () => move(1));
      dots.forEach((dot) => dot.addEventListener("click", () => show(Number(dot.dataset.slide))));

      window.addEventListener("keydown", (event) => {
        if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
          event.preventDefault();
          move(1);
        }
        if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
          event.preventDefault();
          move(-1);
        }
        if (event.key === "Home") {
          event.preventDefault();
          show(0);
        }
        if (event.key === "End") {
          event.preventDefault();
          show(slides.length - 1);
        }
      });

      window.addEventListener("wheel", (event) => {
        event.preventDefault();
        move(event.deltaY > 0 ? 1 : -1);
      }, { passive: false });

      window.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].clientX;
      }, { passive: true });

      window.addEventListener("touchend", (event) => {
        const delta = touchStartX - event.changedTouches[0].clientX;
        if (Math.abs(delta) > 44) move(delta > 0 ? 1 : -1);
      }, { passive: true });

      window.addEventListener("hashchange", () => show(parseHash(), false));
      show(parseHash(), false);
    })();
  </script>
</body>
</html>
`;

await writeFile(output, html);
console.log(output);

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
