import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const avatarCodeConnectSource = readFileSync(join(process.cwd(), "src/components/Avatar/Avatar.figma.tsx"), "utf8");

describe("Avatar Code Connect", () => {
  it("maps Figma visibility booleans to Avatar props", () => {
    expect(avatarCodeConnectSource).toContain('badgeDot: figma.boolean("Badge_Dot")');
    expect(avatarCodeConnectSource).toContain('birthdayHat: figma.boolean("Birthday_Hat")');
    expect(avatarCodeConnectSource).toContain('emoji: figma.boolean("Emoji")');
    expect(avatarCodeConnectSource).toContain('host: figma.boolean("Host")');
    expect(avatarCodeConnectSource).toContain('ring: figma.boolean("Ring")');

    expect(avatarCodeConnectSource).toContain("{...{ badgeDot, birthdayHat, emoji, host, ring }}");
  });
});
