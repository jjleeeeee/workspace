"""fetch_icons.py — Chord DS 아이콘을 Figma에서 일괄 다운로드하고
                   SVGO 최적화 후 src/svg/*.svg + src/index.ts 를 재생성한다.

생성되는 index.ts 는 아이콘마다 트리쉐이킹 가능한 per-icon 컴포넌트를 export 한다:

    import { createIcon } from './createIcon';
    import RawLike from './svg/like.svg?react';
    export const LikeIcon = /*#__PURE__*/ createIcon(RawLike);

Usage:
  python3 packages/icons/scripts/fetch_icons.py [options]
  yarn fetch-icons   # repo root or @weverse-web/cds-icons workspace

Options:
  --file-key          Figma file key (default: DWEduE6GfxYMlyxKPNJ8jA)
  --node-id           아이콘 컨테이너 프레임 Node ID (생략 시 자동 탐색)
  --sizes             다운받을 사이즈 (comma-separated: 16,24,64 / default: 24)
  --force             이미 존재하는 SVG도 덮어씀 (기본: 신규만 다운로드)
  --no-svgo           SVGO 최적화 스킵
  --dry-run           파일 쓰기 없이 출력만
  --regen-index-only  Figma 호출 없이 기존 src/svg/*.svg 로 index.ts 만 재생성
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from icon_names import (
    ICONS_ROOT,
    INDEX_FILE,
    SVG_DIR,
    component_name,
    derive_name,
    gen_index_ts,
    raw_var,
    svg_filename,
    to_file_stem,
)

FIGMA_FILE_KEY = 'DWEduE6GfxYMlyxKPNJ8jA'
FIGMA_ICONOGRAPHY_PAGE_ID = '5:23828'
FIGMA_API_BASE = 'https://api.figma.com/v1'

# size label → frame size (px)
SIZE_LABELS = {'small': 16, 'medium': 24, 'large': 64}

REPO_ROOT = ICONS_ROOT.parent  # repo root (assets/../ = repo root)

REGENERATE_HINT = 'python3 scripts/fetch_icons.py'


def figma_get(token: str, path: str) -> dict:
    url = f'{FIGMA_API_BASE}{path}'
    req = urllib.request.Request(url, headers={'X-Figma-Token': token})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def _is_icon_node(name: str, sizes: list[int]) -> tuple[bool, int]:
    """'{size}/em/ic_*' 패턴 검사. (matched, frame_size) 반환."""
    if not (re.match(r'^\d+/', name) and '/ic_' in name):
        return False, 0
    try:
        frame_size = int(name.split('/')[0])
    except ValueError:
        return False, 0
    return frame_size in sizes, frame_size


def find_icons_in_page(token: str, file_key: str, page_id: str, sizes: list[int]) -> list[dict]:
    """페이지 전체를 재귀 탐색해 아이콘 COMPONENT 목록을 반환한다.

    Figma REST API는 depth 제한이 있어 한 번에 전체를 가져올 수 없다.
    페이지의 top-level 자식을 chunk로 나눠 nodes API로 재귀 탐색한다.
    """
    page_data = figma_get(token, f'/files/{file_key}/nodes?ids={page_id}&depth=1')
    page_doc = page_data['nodes'][page_id]['document']
    top_ids = [c['id'] for c in page_doc.get('children', [])]

    results: list[dict] = []
    batch = 20
    for i in range(0, len(top_ids), batch):
        chunk = ','.join(top_ids[i:i + batch])
        data = figma_get(token, f'/files/{file_key}/nodes?ids={chunk}&depth=5')
        for node_data in data.get('nodes', {}).values():
            _collect_icon_nodes(node_data['document'], sizes, results)
        time.sleep(0.2)

    return results


def _collect_icon_nodes(node: dict, sizes: list[int], acc: list):
    """재귀적으로 아이콘 패턴 노드를 수집한다."""
    name = node.get('name', '')
    matched, frame_size = _is_icon_node(name, sizes)
    if matched:
        acc.append({
            'nodeId': node['id'],
            'sourceName': name,
            'frameSize': frame_size,
        })
        return  # 아이콘 노드 아래는 더 탐색하지 않음
    for child in node.get('children', []):
        _collect_icon_nodes(child, sizes, acc)


def fetch_svgs(token: str, file_key: str, node_ids: list[str]) -> dict[str, str]:
    """Figma export API로 SVG URL 배치 조회 (최대 100개씩)."""
    urls: dict[str, str] = {}
    batch = 100
    for i in range(0, len(node_ids), batch):
        chunk = node_ids[i: i + batch]
        ids_param = ','.join(chunk)
        print(f'  SVG URL 조회 중 ({i + 1}~{i + len(chunk)}/{len(node_ids)})...', file=sys.stderr)
        data = figma_get(token, f'/images/{file_key}?ids={ids_param}&format=svg')
        urls.update(data.get('images') or {})
        time.sleep(0.3)  # rate limit 완화
    return urls


def _postprocess_svg(raw: bytes) -> str:
    """Figma SVG에서 불필요한 속성을 제거하고 currentColor를 표준화한다."""
    text = raw.decode('utf-8')
    text = re.sub(r'\s+width="[^"]*"', '', text)
    text = re.sub(r'\s+height="[^"]*"', '', text)
    text = re.sub(r'fill="(black|#000000|#000)"', 'fill="currentColor"', text)
    return text


def _optimize_svgo_batch(svg_paths: list[Path]) -> None:
    """다운로드된 SVG 파일 목록을 svgo로 일괄 최적화한다. svgo 없으면 스킵."""
    if not svg_paths or not shutil.which('svgo'):
        if not shutil.which('svgo'):
            print('  [info] svgo CLI 없음 — SVGO 스킵', file=sys.stderr)
        return
    print(f'  SVGO 최적화 중 ({len(svg_paths)}개)...', file=sys.stderr)
    subprocess.run(
        ['svgo', '--quiet', *[str(p) for p in svg_paths]],
        check=False,
    )


def _download_svg(url: str) -> bytes | None:
    if not url:
        return None
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'fetch-icons/1.0'})
        with urllib.request.urlopen(req) as resp:
            return resp.read()
    except Exception as e:
        print(f'  [warn] 다운로드 실패: {url} — {e}', file=sys.stderr)
        return None


def _existing_stems() -> list[str]:
    return sorted(p.stem for p in SVG_DIR.glob('*.svg'))


def regen_index(dry_run: bool = False) -> None:
    stems = _existing_stems()
    if not stems:
        raise SystemExit(f'{SVG_DIR.relative_to(REPO_ROOT)} 에 SVG가 없습니다.')
    index_text = gen_index_ts(stems, regenerate_hint=REGENERATE_HINT)
    if dry_run:
        print(f'[dry] {INDEX_FILE.relative_to(REPO_ROOT)} 재생성 예정 ({len(stems)}개 아이콘)')
        return
    INDEX_FILE.write_text(index_text, encoding='utf-8')
    print(f'  {INDEX_FILE.relative_to(REPO_ROOT)} 재생성 ({len(stems)}개 아이콘)')


def parse_args(argv):
    p = argparse.ArgumentParser(description='Chord DS 아이콘 일괄 다운로드 및 코드 재생성')
    p.add_argument('--file-key', default=FIGMA_FILE_KEY)
    p.add_argument('--node-id', default='', help='아이콘 컨테이너 Node ID (생략 시 자동 탐색)')
    p.add_argument('--sizes', default='24', help='다운받을 사이즈 (예: 16,24,64)')
    p.add_argument('--force', action='store_true', help='이미 존재하는 SVG도 덮어씀 (기본: 신규만 다운로드)')
    p.add_argument('--no-svgo', action='store_true')
    p.add_argument('--dry-run', action='store_true')
    p.add_argument('--regen-index-only', action='store_true',
                   help='Figma 호출 없이 기존 src/svg 로 index.ts 만 재생성')
    return p.parse_args(argv)


def _parse_env_line(line: str) -> tuple[str, str] | None:
    line = line.strip()
    if not line or line.startswith('#') or '=' not in line:
        return None
    key, _, value = line.partition('=')
    key = key.strip()
    if key.startswith('export '):
        key = key.removeprefix('export ').strip()
    value = value.strip().strip('"').strip("'")
    if not key:
        return None
    return key, value


def _load_env(repo_root: Path) -> None:
    """repo root의 .env 파일을 읽어 환경변수에 주입한다."""
    env_file = repo_root / '.env'
    if not env_file.exists():
        return
    for line in env_file.read_text().splitlines():
        parsed = _parse_env_line(line)
        if not parsed:
            continue
        key, value = parsed
        if not os.environ.get(key):
            os.environ[key] = value


def main(argv):
    args = parse_args(argv)

    if args.regen_index_only:
        regen_index(dry_run=args.dry_run)
        return

    _load_env(REPO_ROOT)
    token = os.environ.get('FIGMA_ACCESS_TOKEN') or os.environ.get('FIGMA_API_TOKEN', '')
    if not token:
        raise SystemExit(
            'FIGMA_ACCESS_TOKEN이 없습니다. repo root .env 또는 환경변수에 설정해 주세요.'
        )

    sizes = [int(s.strip()) for s in args.sizes.split(',')]
    print(f'대상 사이즈: {sizes}', file=sys.stderr)

    page_id = args.node_id or FIGMA_ICONOGRAPHY_PAGE_ID
    print(f'  Iconography 페이지 탐색 중 (node: {page_id})...', file=sys.stderr)

    icons_meta = find_icons_in_page(token, args.file_key, page_id, sizes)
    if not icons_meta:
        raise SystemExit('아이콘 노드를 찾지 못했습니다. --node-id 로 컨테이너를 직접 지정해 보세요.')

    print(f'  아이콘 {len(icons_meta)}개 발견', file=sys.stderr)

    # name 파생 및 중복 제거 (name 기준)
    seen: set[str] = set()
    icons: list[dict] = []
    for m in icons_meta:
        name = derive_name(m['sourceName'])
        if name in seen:
            continue
        seen.add(name)
        icons.append({**m, 'name': name})

    if not args.dry_run:
        if args.force and SVG_DIR.exists():
            old_count = len(list(SVG_DIR.glob('*.svg')))
            shutil.rmtree(SVG_DIR)
            print(f'  기존 SVG {old_count}개 삭제 (--force)', file=sys.stderr)
        SVG_DIR.mkdir(parents=True, exist_ok=True)

    succeeded: list[dict] = []
    failed: list[str] = []
    skipped = 0

    if not args.force:
        new_icons = [i for i in icons if not (SVG_DIR / svg_filename(i['name'])).exists()]
        existing = [i for i in icons if (SVG_DIR / svg_filename(i['name'])).exists()]
        skipped = len(existing)
        if skipped:
            print(f'  기존 아이콘 {skipped}개 스킵 (--force 로 강제 갱신 가능)', file=sys.stderr)
        succeeded.extend(existing)
    else:
        new_icons = icons

    svg_urls = fetch_svgs(token, args.file_key, [i['nodeId'] for i in new_icons]) if new_icons else {}

    if args.dry_run:
        for icon in new_icons:
            dest = SVG_DIR / svg_filename(icon['name'])
            print(f"  [dry] {icon['name']} → {dest.relative_to(REPO_ROOT)}")
        succeeded.extend(new_icons)
    elif new_icons:
        print(f'  병렬 다운로드 중 ({len(new_icons)}개)...', file=sys.stderr)
        downloaded_paths: list[Path] = []

        def _fetch_one(icon: dict) -> tuple[dict, Path | None]:
            url = svg_urls.get(icon['nodeId'], '')
            raw = _download_svg(url)
            if raw is None:
                return icon, None
            dest = SVG_DIR / svg_filename(icon['name'])
            dest.write_text(_postprocess_svg(raw), encoding='utf-8')
            return icon, dest

        with ThreadPoolExecutor(max_workers=30) as pool:
            futures = {pool.submit(_fetch_one, icon): icon for icon in new_icons}
            done = 0
            for future in as_completed(futures):
                icon, dest = future.result()
                done += 1
                if dest is None:
                    failed.append(icon['name'])
                else:
                    succeeded.append(icon)
                    downloaded_paths.append(dest)
                if done % 50 == 0:
                    print(f'    {done}/{len(new_icons)} 완료…', file=sys.stderr)

        if not args.no_svgo:
            _optimize_svgo_batch(downloaded_paths)

    downloaded = len(succeeded) - skipped
    print(f'  완료: {downloaded}개 신규 / {skipped}개 스킵 / {len(failed)}개 실패', file=sys.stderr)
    if failed:
        print(f'  [WARN] 실패: {", ".join(failed)}', file=sys.stderr)

    # index.ts 재생성 — 디스크의 실제 SVG 파일 기준 (멱등)
    if args.dry_run:
        stems = sorted({to_file_stem(i['name']) for i in succeeded})
        print(f'[dry] {INDEX_FILE.relative_to(REPO_ROOT)} 재생성 예정 ({len(stems)}개 아이콘)')
    else:
        regen_index()
        print('\n결과물:')
        print(f'  {SVG_DIR.relative_to(REPO_ROOT)}/ ({len(_existing_stems())}개 SVG)')
        print(f'  {INDEX_FILE.relative_to(REPO_ROOT)}')


if __name__ == '__main__':
    main(sys.argv[1:])
