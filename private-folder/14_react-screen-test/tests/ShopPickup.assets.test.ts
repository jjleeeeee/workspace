import { describe, it, expect } from "vitest";
import { existsSync } from "fs";
import { resolve } from "path";

const ASSET_BASE = resolve(__dirname, "../src/assets/figma/shop-pickup");

describe("ShopPickup assets", () => {
  const required = [
    "product-thumb-1.png",
    "product-thumb-2.png",
    "card-image.png",
    "card-image-2.png",
  ];

  it.each(required)("%s exists", (file) => {
    expect(existsSync(resolve(ASSET_BASE, file))).toBe(true);
  });
});
