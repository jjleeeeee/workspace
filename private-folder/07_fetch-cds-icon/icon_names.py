"""icon_names.py — 아이콘 이름 변환 유틸리티.

chord-design-system repo 구조 기준:
  scripts/fetch_icons.py  (이 파일과 같은 위치)
  assets/svg/*.svg
  assets/index.ts
"""
from __future__ import annotations

import re
from pathlib import Path

# scripts/ → repo root → assets/
ICONS_ROOT = Path(__file__).resolve().parent.parent / 'assets'
SVG_DIR = ICONS_ROOT / 'svg'
INDEX_FILE = ICONS_ROOT / 'index.ts'


def derive_name(source_name: str) -> str:
    """Figma 노드 이름 → 정규 아이콘 이름.

    '24/em/ic_like_medium' → 'like_medium'
    '16/special/ic_badge_close' → 'badge_close'
    """
    # 마지막 세그먼트 추출 후 ic_ 접두사 제거
    last = source_name.rsplit('/', 1)[-1]
    if last.startswith('ic_'):
        last = last[3:]
    return last


def to_file_stem(name: str) -> str:
    """아이콘 이름 → SVG 파일 stem (소문자 kebab)."""
    return name.lower()


def svg_filename(name: str) -> str:
    """아이콘 이름 → SVG 파일명."""
    return f'{to_file_stem(name)}.svg'


def _to_pascal(s: str) -> str:
    return ''.join(w.capitalize() for w in re.split(r'[_\-\s]+', s) if w)


def component_name(name: str) -> str:
    """아이콘 이름 → React 컴포넌트 이름. 'like_medium' → 'LikeMediumIcon'"""
    return f'{_to_pascal(name)}Icon'


def raw_var(name: str) -> str:
    """아이콘 이름 → SVG raw import 변수명. 'like_medium' → 'RawLikeMedium'"""
    return f'Raw{_to_pascal(name)}'


def gen_index_ts(stems: list[str], regenerate_hint: str = '') -> str:
    """SVG stem 목록 → index.ts 내용."""
    lines: list[str] = []
    if regenerate_hint:
        lines.append(f'// ⚠️ AUTO-GENERATED — do not edit manually.')
        lines.append(f'// Regenerate: {regenerate_hint}')
        lines.append('')
    lines.append("import { createIcon } from './createIcon';")
    lines.append('')

    sorted_stems = sorted(stems)
    for stem in sorted_stems:
        rv = raw_var(stem)
        lines.append(f"import {rv} from './svg/{svg_filename(stem)}?react';")

    lines.append('')
    for stem in sorted_stems:
        rv = raw_var(stem)
        cn = component_name(stem)
        lines.append(f'export const {cn} = /*#__PURE__*/ createIcon({rv});')

    lines.append('')
    return '\n'.join(lines)
