#!/usr/bin/env python3
"""
Fix indentation issues in description YAML files.

Three patterns:
1. implementation_order: list items at col 0 → col 2
2. rules.do / rules.dont: list items at col 2 → col 4
3. source_gaps: list items and their sub-keys at col 0/2 → col 2/4
"""
import re
import sys
from pathlib import Path

DESC_DIR = Path(__file__).parent.parent / "_workspace/outputs/draft-descriptions"


def fix_file(path: Path) -> bool:
    original = path.read_text(encoding="utf-8")
    lines = original.splitlines(keepends=True)
    out = []
    i = 0
    changed = False

    while i < len(lines):
        line = lines[i]
        stripped = line.rstrip("\n")

        # ── implementation_order section ──────────────────────────
        if re.match(r"^implementation_order:\s*$", stripped):
            out.append(line)
            i += 1
            while i < len(lines):
                l = lines[i]
                s = l.rstrip("\n")
                # list item at col 0
                if re.match(r"^- ", s):
                    out.append("  " + l)
                    changed = True
                # already-indented item or empty
                elif re.match(r"^\s{2,}-", s) or s == "":
                    out.append(l)
                else:
                    break
                i += 1
            continue

        # ── rules.do / rules.dont sub-items ──────────────────────
        # Detect "  do:" or "  dont:" at indent=2
        if re.match(r"^  (do|dont):\s*$", stripped):
            out.append(line)
            i += 1
            while i < len(lines):
                l = lines[i]
                s = l.rstrip("\n")
                # item at col 2 (  - ...)
                if re.match(r"^  - ", s):
                    out.append("  " + l)
                    changed = True
                # already at col 4, or empty line
                elif re.match(r"^\s{4,}-", s) or s == "":
                    out.append(l)
                else:
                    break
                i += 1
            continue

        # ── source_gaps section ───────────────────────────────────
        if re.match(r"^source_gaps:\s*$", stripped):
            out.append(line)
            i += 1
            while i < len(lines):
                l = lines[i]
                s = l.rstrip("\n")
                if s == "":
                    out.append(l)
                    i += 1
                    continue
                # list item at col 0: "- part/field/item:"
                if re.match(r"^- (part|field|item):", s):
                    out.append("  " + l)
                    changed = True
                    i += 1
                    # sub-keys at col 2 → col 4
                    while i < len(lines):
                        sl = lines[i]
                        ss = sl.rstrip("\n")
                        if ss == "":
                            out.append(sl)
                            i += 1
                            continue
                        if re.match(r"^  \S", ss):   # sub-key at col 2
                            out.append("  " + sl)
                            changed = True
                            i += 1
                        elif re.match(r"^- (part|field|item):", ss):
                            break  # next item, don't advance i
                        elif re.match(r"^\S", ss):
                            break  # back to top-level
                        else:
                            out.append(sl)
                            i += 1
                    continue
                # already indented at col 2+
                elif re.match(r"^\s{2,}", s):
                    out.append(l)
                    i += 1
                    continue
                else:
                    break  # different top-level section
            continue

        out.append(line)
        i += 1

    result = "".join(out)
    if changed:
        path.write_text(result, encoding="utf-8")
    return changed


def main():
    targets = [Path(p) for p in sys.argv[1:]] if sys.argv[1:] else sorted(DESC_DIR.glob("*.description.yaml"))
    fixed = 0
    for p in targets:
        if fix_file(p):
            print(f"fixed: {p.name}")
            fixed += 1
        else:
            print(f"ok:    {p.name}")
    print(f"\n{fixed}/{len(targets)} files updated.")


if __name__ == "__main__":
    main()
