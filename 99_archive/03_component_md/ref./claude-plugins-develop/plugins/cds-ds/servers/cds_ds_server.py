#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "mcp>=1.2",
#   "httpx>=0.27",
# ]
# ///
"""
cds-ds MCP server

도구:
  - ds_list()               카탈로그 이름 목록
  - ds_get(ids)             지정한 카탈로그 fetch
  - ds_dsl_schema()         Weverse DS DSL v2 스킴 정의
  - figma_fetch_design(url) Figma 화면의 시멘틱 노드 트리(nodes[]) 추출

GitHub 인증 (ds_list, ds_get, figma_fetch_design):
  GITHUB_TOKEN 또는 GH_TOKEN 환경변수, 없으면 `gh auth token` fallback.

Figma 인증 (figma_fetch_design):
  FIGMA_TOKEN 환경변수 (Figma Personal Access Token, fallback 없음).
"""

import base64
import json
import os
import subprocess
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse

import httpx
from mcp.server.fastmcp import FastMCP

# ── Config ───────────────────────────────────────────────

REPO = "weversecorp/cds-catalogs"
CATALOG_ROOT = "catalogs"
TOKENS_DIR = "catalogs/tokens"
# 기본값 main. 머지 전 브랜치 참조 시 CATALOG_BRANCH 환경변수로 재정의.
# 예) CATALOG_BRANCH=add-ds-components
CATALOG_BRANCH = os.environ.get("CATALOG_BRANCH", "main")

# catalogs/ 하위에서 컴포넌트 카테고리로 취급하지 않을 디렉터리
_CATALOG_DIR_EXCLUDES = frozenset({"tokens", "reports"})

GH_API_BASE = "https://api.github.com"
FIGMA_API_BASE = "https://api.figma.com/v1"
HTTP_TIMEOUT = 15

_DSL_SCHEMA_PATH = Path(__file__).parent / "dsl_v2.json"
_MANIFEST_SCHEMA_PATH = Path(__file__).parent / "ds_manifest_schema.json"

VALID_PLATFORMS = frozenset({"ios", "android", "web"})

mcp = FastMCP("cds-ds")


# ── GitHub API ──────────────────────────────────────────


def gh_token() -> str:
    """
    GitHub 인증 토큰 조회.
    우선순위: GITHUB_TOKEN env → GH_TOKEN env → gh auth token (gh CLI keychain).

    수동 PAT 생성 불필요. 최초 1회 브라우저 device flow:
        $ gh auth login
    """
    tok = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if tok and tok.strip():
        return tok.strip()
    try:
        r = subprocess.run(
            ["gh", "auth", "token"],
            capture_output=True,
            text=True,
            timeout=5,
        )
        if r.returncode == 0 and r.stdout.strip():
            return r.stdout.strip()
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass
    raise RuntimeError(
        "GitHub 인증 필요. 터미널에서 다음 명령 실행 후 Claude Code 재시작:\n"
        "  $ gh auth login         # 브라우저 device flow (수동 PAT 불필요)\n"
        "gh CLI 가 없다면:\n"
        "  $ brew install gh && gh auth login"
    )


def _gh_headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {gh_token()}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def gh_contents(path: str) -> Any:
    url = f"{GH_API_BASE}/repos/{REPO}/contents/{path}"
    resp = httpx.get(url, headers=_gh_headers(), params={"ref": CATALOG_BRANCH}, timeout=HTTP_TIMEOUT)
    resp.raise_for_status()
    return resp.json()


def gh_list_dir(path: str) -> list[dict]:
    data = gh_contents(path)
    if not isinstance(data, list):
        raise ValueError(f"Expected directory, got file: {path}")
    return data


def gh_file_json(path: str) -> dict:
    data = gh_contents(path)
    if not isinstance(data, dict) or "content" not in data:
        raise ValueError(f"Expected file, got directory: {path}")
    raw = base64.b64decode(data["content"])
    return json.loads(raw)


def get_component_category_dirs() -> list[str]:
    """catalogs/ 하위에서 컴포넌트 카테고리 디렉터리를 동적으로 조회한다.

    숨김 디렉터리(.fixtures 등)와 _CATALOG_DIR_EXCLUDES에 정의된 항목을 제외한
    모든 서브디렉터리를 반환한다. atoms·molecules 외에 향후 organisms 등이
    추가되어도 별도 코드 수정 없이 자동 인식된다.
    """
    return [
        f"{CATALOG_ROOT}/{item['name']}"
        for item in gh_list_dir(CATALOG_ROOT)
        if item["type"] == "dir"
        and not item["name"].startswith(".")
        and item["name"] not in _CATALOG_DIR_EXCLUDES
    ]


# ── Figma API ───────────────────────────────────────────


def figma_token() -> str:
    tok = os.environ.get("FIGMA_TOKEN", "").strip()
    if not tok:
        raise RuntimeError(
            "FIGMA_TOKEN 환경변수가 설정되지 않았습니다.\n"
            "Figma → Settings → Security → Personal access tokens 에서 토큰 생성 후\n"
            "환경변수로 설정하세요: export FIGMA_TOKEN=figd_xxx"
        )
    return tok


def _figma_headers() -> dict[str, str]:
    return {"X-Figma-Token": figma_token()}


def _parse_figma_url(url: str) -> tuple[str, str]:
    """Figma URL에서 fileKey와 nodeId를 추출한다.

    지원 형식:
      https://www.figma.com/design/{fileKey}/...?node-id={nodeId}
      https://figma.com/file/{fileKey}/...?node-id={nodeId}

    node-id: URL의 '-' 구분자를 API 형식인 ':' 로 변환 (예: '1-23' → '1:23').
    """
    parsed = urlparse(url)
    parts = [p for p in parsed.path.split("/") if p]

    if len(parts) < 2 or parts[0] not in ("design", "file", "proto"):
        raise ValueError(
            f"Figma URL 형식을 인식할 수 없습니다: {url}\n"
            "예시: https://figma.com/design/{{fileKey}}/...?node-id=1-23"
        )

    file_key = parts[1]

    qs = parse_qs(parsed.query)
    node_id_raw = qs.get("node-id", [""])[0]
    if not node_id_raw:
        raise ValueError(
            f"URL에 node-id 파라미터가 없습니다: {url}\n"
            "Figma에서 프레임/컴포넌트를 선택 후 'Copy link' 로 URL을 복사하세요."
        )

    node_id = node_id_raw.replace("-", ":")
    return file_key, node_id


def _resolve_var_ref(ref: dict, var_map: dict) -> dict:
    """VARIABLE_ALIAS 단일 참조를 figmaKey·tokenName 포함 dict로 변환한다."""
    vid = ref.get("id", "")
    info = var_map.get(vid, {})
    return {
        "variableId": vid,
        "figmaKey": info.get("key", ""),
        "tokenName": info.get("name", ""),
        "resolvedType": info.get("resolvedType", ""),
    }


# ── Figma 시각 속성 헬퍼 ────────────────────────────────


def _rgba_to_hex(color: dict) -> str:
    r = round(color.get("r", 0) * 255)
    g = round(color.get("g", 0) * 255)
    b = round(color.get("b", 0) * 255)
    a = color.get("a", 1.0)
    if a >= 0.999:
        return f"#{r:02X}{g:02X}{b:02X}"
    return f"#{r:02X}{g:02X}{b:02X}{round(a * 255):02X}"


def _token_ref(token_name: str) -> str:
    """Figma boundVariable tokenName(예: 'system/color/button/default') → v2 TokenRef('token:system.color.button.default')."""
    if not token_name:
        return ""
    return f"token:{token_name.replace('/', '.')}"


def _color_to_token_ref(rgba_hex: str) -> str:
    """SOLID 색상 hex → 'hardcoded:#RRGGBB' TokenRef. 토큰 바인딩이 있을 때는 호출하지 않음."""
    return f"hardcoded:{rgba_hex}"


def _extract_layout(node: dict) -> dict | None:
    """Figma node → v2 Layout {kind, axis?, spacing, padding, alignment, size}."""
    mode = node.get("layoutMode", "NONE")
    if mode == "NONE":
        return None
    layout: dict[str, Any] = {"kind": "stack", "axis": mode.lower()}

    gap = node.get("itemSpacing")
    if gap:
        layout["spacing"] = gap

    pl = node.get("paddingLeft", 0)
    pr = node.get("paddingRight", 0)
    pt = node.get("paddingTop", 0)
    pb = node.get("paddingBottom", 0)
    if any([pl, pr, pt, pb]):
        layout["padding"] = {"top": pt, "right": pr, "bottom": pb, "left": pl}

    main_map = {"MIN": "start", "CENTER": "center", "MAX": "end", "SPACE_BETWEEN": "spaceBetween"}
    cross_map = {"MIN": "start", "CENTER": "center", "MAX": "end"}
    primary = node.get("primaryAxisAlignItems", "")
    counter = node.get("counterAxisAlignItems", "")
    alignment: dict[str, Any] = {}
    if primary in main_map:
        alignment["main"] = main_map[primary]
    if counter in cross_map:
        alignment["cross"] = cross_map[counter]
    if alignment:
        layout["alignment"] = alignment

    return layout


def _extract_size(node: dict) -> dict | None:
    """Figma layoutSizing* + bbox → v2 SizePolicy {width: {mode, value?}, height: {mode, value?}}."""
    bbox = node.get("absoluteBoundingBox", {})
    size: dict[str, Any] = {}

    for axis_key, sizing_key, dim in (("width", "layoutSizingHorizontal", "width"),
                                      ("height", "layoutSizingVertical", "height")):
        sizing = node.get(sizing_key, "")
        if sizing == "FIXED":
            val = bbox.get(dim)
            if val is not None:
                size[axis_key] = {"mode": "fixed", "value": round(val)}
        elif sizing == "HUG":
            size[axis_key] = {"mode": "hug"}
        elif sizing == "FILL":
            size[axis_key] = {"mode": "fill"}
        else:
            val = bbox.get(dim)
            if val is not None:
                size[axis_key] = {"mode": "fixed", "value": round(val)}

    return size if size else None


def _extract_fills(fills: list, bound_fills: list) -> list | None:
    """Figma fills + boundVariables.fills → v2 Style.fills 배열."""
    result: list[dict[str, Any]] = []

    # 토큰 바인딩 우선 — boundVariables가 있으면 그것이 ground truth
    if bound_fills:
        tok = bound_fills[0].get("tokenName", "") if isinstance(bound_fills[0], dict) else ""
        if tok:
            result.append({"type": "solid", "color": _token_ref(tok)})
            return result

    if not fills:
        return None

    for fill in fills:
        if not fill.get("visible", True):
            continue
        ftype = fill.get("type", "")
        if ftype == "SOLID":
            color = dict(fill.get("color", {}))
            op = fill.get("opacity", 1.0)
            if op < 0.999:
                color["a"] = color.get("a", 1.0) * op
            result.append({"type": "solid", "color": _color_to_token_ref(_rgba_to_hex(color))})
        elif ftype in ("LINEAR_GRADIENT", "RADIAL_GRADIENT", "ANGULAR_GRADIENT"):
            gt_map = {"LINEAR_GRADIENT": "linear", "RADIAL_GRADIENT": "radial", "ANGULAR_GRADIENT": "angular"}
            stops = fill.get("gradientStops", [])
            result.append({
                "type": "gradient",
                "gradientType": gt_map[ftype],
                "stops": [
                    {"color": _color_to_token_ref(_rgba_to_hex(s["color"])), "position": s["position"]}
                    for s in stops
                ],
            })
        elif ftype == "IMAGE":
            mode_map = {"FILL": "fill", "FIT": "fit", "CROP": "stretch", "TILE": "tile"}
            result.append({"type": "image", "mode": mode_map.get(fill.get("scaleMode", "FILL"), "fill")})

    return result if result else None


def _extract_strokes(node: dict, bound_strokes: list) -> list | None:
    """Figma strokes + boundVariables.strokes → v2 Style.strokes 배열."""
    strokes = node.get("strokes", [])
    if not strokes:
        return None
    stroke = strokes[0]
    if not stroke.get("visible", True):
        return None

    item: dict[str, Any] = {}
    if bound_strokes:
        tok = bound_strokes[0].get("tokenName", "") if isinstance(bound_strokes[0], dict) else ""
        if tok:
            item["color"] = _token_ref(tok)
    if "color" not in item and stroke.get("type") == "SOLID":
        item["color"] = _color_to_token_ref(_rgba_to_hex(stroke.get("color", {})))

    weight = node.get("strokeWeight")
    if weight:
        item["thickness"] = weight

    align_map = {"INSIDE": "inside", "CENTER": "center", "OUTSIDE": "outside"}
    align = node.get("strokeAlign", "")
    if align in align_map:
        item["align"] = align_map[align]

    return [item] if item else None


def _extract_effects(effects: list) -> list | None:
    """Figma effects → v2 Style.effects 배열. 색상은 hardcoded TokenRef로."""
    if not effects:
        return None
    result = []
    for e in effects:
        if not e.get("visible", True):
            continue
        etype = e.get("type", "")
        if etype in ("DROP_SHADOW", "INNER_SHADOW"):
            offset = e.get("offset", {})
            result.append({
                "type": "shadow",
                "shadowType": "outer" if etype == "DROP_SHADOW" else "inner",
                "offset": {"x": offset.get("x", 0), "y": offset.get("y", 0)},
                "spread": e.get("spread", 0),
                "blur": e.get("radius", 0),
                "color": _color_to_token_ref(_rgba_to_hex(e.get("color", {}))),
            })
        elif etype == "LAYER_BLUR":
            result.append({"type": "blur", "radius": e.get("radius", 0)})
        elif etype == "BACKGROUND_BLUR":
            result.append({"type": "background_blur", "radius": e.get("radius", 0)})
    return result if result else None


def _fills_contain_image(fills: list) -> bool:
    for fill in fills or []:
        if fill.get("visible", True) and fill.get("type") == "IMAGE":
            return True
    return False


def _design_node_type(figma_type: str, fills: list) -> str:
    """Figma 타입 → figma_fetch_design 트리 노드 type (FRAME|TEXT|INSTANCE|GROUP|IMAGE)."""
    if figma_type == "RECTANGLE" and _fills_contain_image(fills):
        return "IMAGE"
    if figma_type in ("FRAME", "COMPONENT", "COMPONENT_SET"):
        return "FRAME"
    if figma_type == "TEXT":
        return "TEXT"
    if figma_type == "INSTANCE":
        return "INSTANCE"
    if figma_type == "GROUP":
        return "GROUP"
    return "GROUP"


def _extract_bound_variables(node: dict, _vm: dict) -> dict[str, Any]:
    bv: dict[str, Any] = {}
    if "boundVariables" not in node:
        return bv
    for k, v in node["boundVariables"].items():
        if isinstance(v, list):
            resolved = [
                _resolve_var_ref(entry, _vm)
                for entry in v
                if isinstance(entry, dict) and entry.get("type") == "VARIABLE_ALIAS"
            ]
            if resolved:
                bv[k] = resolved
        elif isinstance(v, dict):
            if v.get("type") == "VARIABLE_ALIAS":
                bv[k] = _resolve_var_ref(v, _vm)
            else:
                nested: dict[str, Any] = {}
                for sub_k, sub_v in v.items():
                    if isinstance(sub_v, dict) and sub_v.get("type") == "VARIABLE_ALIAS":
                        nested[sub_k] = _resolve_var_ref(sub_v, _vm)
                if nested:
                    bv[k] = nested
    return bv


def _apply_layout_and_style(
    node: dict,
    bv: dict[str, Any],
    parent_layout: str,
) -> dict[str, Any]:
    """layout(kind/axis/…/size/frame) + style(fills/strokes/effects/opacity/cornerRadius) 블록."""
    out: dict[str, Any] = {}
    layout = _extract_layout(node)
    size = _extract_size(node)
    if layout or size:
        layout_obj = layout or {"kind": "box"}
        if size:
            layout_obj["size"] = size
        if parent_layout == "NONE":
            bbox = node.get("absoluteBoundingBox", {})
            if bbox.get("width") is not None or bbox.get("height") is not None:
                layout_obj["frame"] = {
                    "x": bbox.get("x", 0),
                    "y": bbox.get("y", 0),
                    "width": round(bbox.get("width", 0)),
                    "height": round(bbox.get("height", 0)),
                }
                layout_obj.setdefault("positioning", "absolute")
        out["layout"] = layout_obj

    style: dict[str, Any] = {}
    fills = _extract_fills(node.get("fills", []), bv.get("fills", []))
    if fills:
        style["fills"] = fills
    strokes = _extract_strokes(node, bv.get("strokes", []))
    if strokes:
        style["strokes"] = strokes
    effects = _extract_effects(node.get("effects", []))
    if effects:
        style["effects"] = effects
    opacity = node.get("opacity", 1.0)
    if opacity < 0.999:
        style["opacity"] = round(opacity, 3)
    cr = node.get("cornerRadius")
    if cr:
        style["cornerRadius"] = cr
    elif any(node.get(k) for k in ("topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius")):
        style["cornerRadius"] = {
            "topLeft": node.get("topLeftRadius", 0),
            "topRight": node.get("topRightRadius", 0),
            "bottomLeft": node.get("bottomLeftRadius", 0),
            "bottomRight": node.get("bottomRightRadius", 0),
        }
    if style:
        out["style"] = style
    return out


def _build_design_subtree(node: dict, var_map: dict, parent_layout: str) -> dict | None:
    """Figma document 서브트리 → FRAME/TEXT/INSTANCE/GROUP/IMAGE 노드 + children 재귀."""
    if not node or not isinstance(node, dict):
        return None
    if node.get("visible") is False:
        return None

    _vm = var_map or {}
    ft = node.get("type", "") or "UNKNOWN"
    if ft == "SLICE":
        return None
    fills = node.get("fills", [])
    dtype = _design_node_type(ft, fills)
    bv = _extract_bound_variables(node, _vm)
    node_layout_mode = node.get("layoutMode", "NONE")

    out: dict[str, Any] = {
        "id": node.get("id", ""),
        "name": node.get("name", ""),
        "type": dtype,
        "figmaType": ft,
    }

    if bv:
        out["boundVariables"] = bv

    if ft == "TEXT":
        out["text"] = {"value": node.get("characters", "")}
        if node.get("style"):
            out["figmaTextStyle"] = node["style"]
        vs = _apply_layout_and_style(node, bv, parent_layout)
        if vs.get("layout"):
            out["layout"] = vs["layout"]
        if vs.get("style"):
            out["style"] = vs["style"]

    elif ft == "INSTANCE":
        if "characters" in node:
            out["text"] = {"value": node["characters"]}
        if "componentProperties" in node:
            props = {}
            for k, v in node["componentProperties"].items():
                if isinstance(v, dict) and "value" in v:
                    props[k] = v["value"]
            if props:
                out["componentProperties"] = props
        if "styles" in node:
            out["styles"] = list(node["styles"].keys())
        out.update(_apply_layout_and_style(node, bv, parent_layout))

    elif dtype == "FRAME" or ft in ("COMPONENT", "COMPONENT_SET"):
        out.update(_apply_layout_and_style(node, bv, parent_layout))

    elif dtype == "IMAGE":
        out.update(_apply_layout_and_style(node, bv, parent_layout))
        img_fill = next((f for f in fills if f.get("visible", True) and f.get("type") == "IMAGE"), None)
        if img_fill:
            out["image"] = {
                "imageRef": img_fill.get("imageRef", ""),
                "scaleMode": img_fill.get("scaleMode", "FILL"),
            }

    children_out: list[dict] = []
    for child in node.get("children", []):
        built = _build_design_subtree(child, _vm, parent_layout=node_layout_mode)
        if built:
            children_out.append(built)
    if children_out:
        out["children"] = children_out

    return out


# ── Tools ───────────────────────────────────────────────


@mcp.tool()
def ds_list(manifest: dict | None = None) -> dict:
    """
    cds-catalogs 레포의 카탈로그 목록 조회.

    manifest 전달 시 해당 플랫폼에서 사용 가능한 항목만 반환한다.
    manifest 는 ds-manifest.json 의 내용을 dict 로 전달한다
    (Claude 가 Read 도구로 파일을 읽은 뒤 직접 전달).

    Args:
      manifest: ds-manifest.json 내용 (optional).
                { platform, tokens: [...], components: [...] }
                전달 시 선언된 항목과 실제 카탈로그의 교집합을 반환한다.

    Returns:
      tokens:     토큰 컬렉션 이름 배열 (catalogs/tokens/*.json 의 파일명에서 .json 제거)
      components: 컴포넌트 이름 배열 (catalogs/atoms·molecules·… 하위 디렉터리명)
      source:     레포 메타 (repo, branch, componentDirs, platform, manifestUsed)
    """
    allowed_tokens: set[str] | None = None
    allowed_components: set[str] | None = None
    platform: str | None = None

    if manifest and isinstance(manifest, dict):
        platform = manifest.get("platform")
        t = manifest.get("tokens")
        c = manifest.get("components")
        if isinstance(t, list):
            allowed_tokens = set(t)
        if isinstance(c, list):
            allowed_components = set(c)

    tokens: list[str] = []
    for item in gh_list_dir(TOKENS_DIR):
        if item["type"] == "file" and item["name"].endswith(".json"):
            name = item["name"].removesuffix(".json")
            if allowed_tokens is None or name in allowed_tokens:
                tokens.append(name)

    components: list[str] = []
    category_dirs = get_component_category_dirs()
    for cat_dir in category_dirs:
        for item in gh_list_dir(cat_dir):
            if item["type"] == "dir":
                name = item["name"]
                if allowed_components is None or name in allowed_components:
                    components.append(name)

    return {
        "tokens": sorted(tokens),
        "components": sorted(components),
        "source": {
            "repo": REPO,
            "branch": CATALOG_BRANCH,
            "tokensPath": TOKENS_DIR,
            "componentDirs": category_dirs,
            "platform": platform,
            "manifestUsed": manifest is not None,
        },
    }


@mcp.tool()
def ds_get(ids: list[str], manifest: dict | None = None) -> dict:
    """
    지정한 카탈로그를 fetch. 이름에 해당하는 토큰 컬렉션 또는 컴포넌트 카탈로그를
    모두 반환한다.

    manifest 전달 시 선언된 허용 목록 외 항목은 fetch 없이 missing 처리된다.

    Resolution:
      1) catalogs/tokens/{name}.json 존재하면 토큰 컬렉션으로 간주
      2) catalogs/{atoms|molecules|…}/{name}/ 디렉터리를 순서대로 탐색,
         발견되면 컴포넌트로 간주 (디렉터리 안의 모든 .json 을 fetch)
      3) 둘 다 없거나 manifest 허용 목록 외 항목이면 missing 으로 반환

    Args:
      ids:      카탈로그 이름 배열. 예) ["textbutton", "WDS_tokens"]
      manifest: ds-manifest.json 내용 (optional). 전달 시 허용 목록 검증 수행.

    Returns:
      tokens:     { name: file_content }
      components: { name: file_content | [file_contents...] }
      missing:    찾지 못한 이름 배열 (허용 목록 외 항목 포함)
    """
    allowed: set[str] | None = None
    if manifest and isinstance(manifest, dict):
        t = manifest.get("tokens", [])
        c = manifest.get("components", [])
        if isinstance(t, list) and isinstance(c, list):
            allowed = set(t) | set(c)

    tokens: dict[str, Any] = {}
    components: dict[str, Any] = {}
    missing: list[str] = []

    for name in ids:
        if allowed is not None and name not in allowed:
            missing.append(f"{name} (manifest 허용 목록 외)")
            continue
        token_path = f"{TOKENS_DIR}/{name}.json"
        try:
            tokens[name] = gh_file_json(token_path)
            continue
        except httpx.HTTPStatusError as e:
            if e.response.status_code != 404:
                raise

        entries = None
        for cat_dir in get_component_category_dirs():
            try:
                entries = gh_list_dir(f"{cat_dir}/{name}")
                break
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 404:
                    continue
                raise

        if entries is None:
            missing.append(name)
            continue

        json_files = [
            e for e in entries
            if e["type"] == "file" and e["name"].endswith(".json")
        ]
        if not json_files:
            missing.append(name)
            continue

        if len(json_files) == 1:
            components[name] = gh_file_json(json_files[0]["path"])
        else:
            components[name] = [gh_file_json(f["path"]) for f in json_files]

    return {
        "tokens": tokens,
        "components": components,
        "missing": missing,
    }


@mcp.tool()
def ds_manifest_schema() -> dict:
    """
    Weverse DS 모듈 매니페스트(ds-manifest.json) 스킴 정의를 반환한다.

    플랫폼 팀이 ds-manifest.json 을 처음 작성할 때 참조한다.
    스킴 원본: servers/ds_manifest_schema.json

    ds-manifest.json 배치 위치: DS module 최상위 폴더 고정.
    """
    return json.loads(_MANIFEST_SCHEMA_PATH.read_text(encoding="utf-8"))


@mcp.tool()
def ds_dsl_schema() -> dict:
    """
    Weverse DS DSL v2 스킴 정의를 반환한다.

    figma_fetch_design + ds_get 결과를 조합해 DSL을 생성할 때
    이 스킴을 참조해 출력 형식을 준수한다.
    스킴 원본: servers/dsl_v2.json
    """
    return json.loads(_DSL_SCHEMA_PATH.read_text(encoding="utf-8"))


@mcp.tool()
def figma_fetch_design(url: str) -> dict:
    """
    Figma URL에서 화면의 시멘틱 디자인 트리를 추출한다 (DSL v2 트리 정렬).

    Figma REST API로 node-id 루트의 document 서브트리를 내려받아, FRAME /
    TEXT / INSTANCE / GROUP / IMAGE 타입의 `nodes[]` 트리로 재구성한다.
    각 노드는 DSL v2와 정합한 layout·style·text 블록과 `figmaType`(원본
    Figma 타입)을 포함한다. 토큰 바인딩은 `token:dotted.path` TokenRef,
    원시 SOLID는 `hardcoded:#RRGGBB`. 이미지 바이너리·벡터 기하는 제외하고
    IMAGE 노드에는 `image.imageRef` 메타만 둔다.

    인증: FIGMA_TOKEN 환경변수 (Figma Personal Access Token).

    Args:
      url: Figma 디자인 URL.
           예) https://figma.com/design/{fileKey}/Screen?node-id=1-23

    Returns:
      frame:   루트 노드 요약 (id, name, figmaType=원본 type)
      nodes:   길이 1의 배열 — 루트에서 시작하는 설계 트리
               노드: { id, name, type, figmaType, children?, text?, layout?, style?,
                      boundVariables?, componentProperties?, image?, ... }
      source:  Figma 파일 메타 (fileKey, nodeId, variablesResolved)
    """
    file_key, node_id = _parse_figma_url(url)
    headers = _figma_headers()

    # 노드 데이터
    resp = httpx.get(
        f"{FIGMA_API_BASE}/files/{file_key}/nodes",
        headers=headers,
        params={"ids": node_id},
        timeout=HTTP_TIMEOUT,
    )
    resp.raise_for_status()
    data = resp.json()

    nodes = data.get("nodes", {})
    node_data = nodes.get(node_id, {})
    document = node_data.get("document", {})

    if not document:
        raise ValueError(
            f"Figma 노드를 찾을 수 없습니다: node-id={node_id}\n"
            "URL의 node-id가 올바른지 확인하세요."
        )

    # Variables API — VariableID → {key, name, resolvedType} 맵
    var_map: dict = {}
    try:
        var_resp = httpx.get(
            f"{FIGMA_API_BASE}/files/{file_key}/variables/local",
            headers=headers,
            timeout=HTTP_TIMEOUT,
        )
        if var_resp.status_code == 200:
            var_map = var_resp.json().get("meta", {}).get("variables", {})
    except Exception:
        pass  # Variables API 실패 시 boundVariables는 variableId만 보존

    root_tree = _build_design_subtree(document, var_map, parent_layout="NONE")
    if not root_tree:
        raise ValueError("Figma 노드 트리를 변환할 수 없습니다.")

    frame = {
        "id": document.get("id", ""),
        "name": document.get("name", ""),
        "figmaType": document.get("type", ""),
    }

    return {
        "frame": frame,
        "nodes": [root_tree],
        "source": {
            "fileKey": file_key,
            "nodeId": node_id,
            "variablesResolved": len(var_map) > 0,
        },
    }


if __name__ == "__main__":
    mcp.run()
