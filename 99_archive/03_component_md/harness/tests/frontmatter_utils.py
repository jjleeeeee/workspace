#!/usr/bin/env python3
"""Small helpers for Component MD YAML-frontmatter checks.

The harness only needs source-of-truth text coverage checks, so it avoids a
runtime dependency on PyYAML and works from the raw frontmatter block.
"""
from __future__ import annotations

import re


def split_frontmatter(content: str) -> tuple[str, str]:
    """Return (frontmatter, body). Empty frontmatter means no YAML contract."""
    if not content.startswith("---\n"):
        return "", content

    end = content.find("\n---", 4)
    if end == -1:
        return "", content

    frontmatter = content[4:end].strip()
    body = content[end + len("\n---") :].lstrip()
    return frontmatter, body


def load_contract(md_path: str) -> tuple[str, str]:
    with open(md_path, encoding="utf-8") as f:
        return split_frontmatter(f.read())


def has_top_level_key(frontmatter: str, key: str) -> bool:
    return bool(re.search(rf"^{re.escape(key)}\s*:", frontmatter, re.MULTILINE))


def contains_all(frontmatter: str, values: list[str]) -> tuple[list[str], list[str]]:
    passed, failed = [], []
    for value in values:
        if value in frontmatter:
            passed.append(value)
        else:
            failed.append(value)
    return passed, failed
