#!/usr/bin/env python3
"""
Add 'confirmed: true' to source_gaps items that have 'reason:' but no 'confirmed:'.
"""
import re
import sys
from pathlib import Path

DESC_DIR = Path(__file__).parent.parent / "_workspace/outputs/draft-descriptions"


def fix_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    out = []
    i = 0
    changed = False

    in_gaps = False
    in_item = False

    while i < len(lines):
        line = lines[i]
        s = line.rstrip("\n")

        # Enter source_gaps section
        if re.match(r"^source_gaps:\s*$", s):
            in_gaps = True
            out.append(line)
            i += 1
            continue

        # Exit source_gaps on new top-level section
        if in_gaps and re.match(r"^[A-Za-z0-9_]", s) and not re.match(r"^\s", s):
            in_gaps = False
            in_item = False

        if in_gaps:
            # New item: "  - part/field/item:"
            if re.match(r"^\s{2}-\s+(part|field|item):", s):
                in_item = True
                # Collect the whole item block to check if confirmed exists
                item_lines = [line]
                j = i + 1
                while j < len(lines):
                    nl = lines[j]
                    ns = nl.rstrip("\n")
                    if re.match(r"^\s{2}-\s+(part|field|item):", ns):
                        break  # next item
                    if re.match(r"^[A-Za-z0-9_]", ns) and not re.match(r"^\s", ns):
                        break  # new top-level section
                    if ns == "" or re.match(r"^\s", ns):
                        item_lines.append(nl)
                        j += 1
                    else:
                        break

                item_text = "".join(item_lines)
                has_confirmed = bool(re.search(r"^\s+confirmed:", item_text, re.M))
                has_reason = bool(re.search(r"^\s+reason:", item_text, re.M))

                if has_reason and not has_confirmed:
                    # Insert confirmed: true after the first line of the item
                    out.append(item_lines[0])
                    out.append("    confirmed: true\n")
                    out.extend(item_lines[1:])
                    changed = True
                else:
                    out.extend(item_lines)

                i = j
                continue

        out.append(line)
        i += 1

    if changed:
        path.write_text("".join(out), encoding="utf-8")
    return changed


def main():
    targets = [Path(p) for p in sys.argv[1:]] if sys.argv[1:] else sorted(DESC_DIR.glob("*.description.yaml"))
    fixed = 0
    for p in targets:
        if fix_file(p):
            print(f"confirmed: {p.name}")
            fixed += 1
        else:
            print(f"ok:        {p.name}")
    print(f"\n{fixed}/{len(targets)} files updated.")


if __name__ == "__main__":
    main()
