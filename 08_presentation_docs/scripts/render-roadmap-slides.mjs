import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const input = ".frontend-slides/pixel-perfect-render/roadmap-repaired.pptx";
const outputDir = ".frontend-slides/pixel-perfect-render/slides";

await mkdir(outputDir, { recursive: true });

try {
  const pptx = await FileBlob.load(input);
  const presentation = await PresentationFile.importPptx(pptx);

  for (let i = 0; i < presentation.slides.count; i += 1) {
    const slide = presentation.slides.getItem(i);
    const png = await presentation.export({ slide, format: "png", scale: 2 });
    const out = path.join(outputDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
    if (typeof png.save === "function") {
      await png.save(out);
    } else if (typeof png.arrayBuffer === "function") {
      await writeFile(out, Buffer.from(await png.arrayBuffer()));
    } else if (png instanceof Uint8Array) {
      await writeFile(out, png);
    } else {
      throw new Error(`Unexpected export result for slide ${i + 1}: ${Object.keys(png || {}).join(", ")}`);
    }
    console.log(out);
  }
} catch (error) {
  console.error("render-roadmap-slides failed");
  console.error(error?.message || error);
  if (error?.stack) console.error(error.stack.split("\n").slice(0, 10).join("\n"));
  process.exit(1);
}
