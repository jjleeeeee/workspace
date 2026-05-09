#!/usr/bin/env bash
# cds-ds MCP server launcher
# 첫 실행 시 uv · gh 자동 설치 (~/.local/bin, sudo 불필요).
# 사용자 수동 작업은 `gh auth login` 브라우저 device flow 한 번뿐.
set -euo pipefail

BIN_DIR="$HOME/.local/bin"
mkdir -p "$BIN_DIR"
export PATH="$BIN_DIR:$HOME/.cargo/bin:$PATH"

# ── uv 자동 설치 ─────────────────────────────────────────
if ! command -v uv >/dev/null 2>&1; then
  echo "[cds-ds] uv not found — installing to ~/.local/bin ..." >&2
  curl -LsSf https://astral.sh/uv/install.sh | sh >&2
fi

if ! command -v uv >/dev/null 2>&1; then
  echo "[cds-ds] uv install failed. See https://docs.astral.sh/uv/" >&2
  exit 1
fi

# ── gh (GitHub CLI) 자동 설치 ────────────────────────────
install_gh_binary() {
  local os_raw os arch_raw arch latest asset_name archive_ext url tmpdir
  os_raw=$(uname -s)
  arch_raw=$(uname -m)
  case "$arch_raw" in
    arm64|aarch64) arch=arm64 ;;
    x86_64|amd64)  arch=amd64 ;;
    *) echo "[cds-ds] Unsupported arch: $arch_raw" >&2; return 1 ;;
  esac
  # macOS 에셋은 gh_X_macOS_<arch>.zip 네이밍(대문자 M), linux 는 gh_X_linux_<arch>.tar.gz
  case "$os_raw" in
    Darwin) os=macOS;   archive_ext=zip ;;
    Linux)  os=linux;   archive_ext=tar.gz ;;
    *) echo "[cds-ds] Unsupported OS: $os_raw" >&2; return 1 ;;
  esac
  latest=$(curl -sSL "https://api.github.com/repos/cli/cli/releases/latest" \
    | sed -n 's/.*"tag_name": *"v\([^"]*\)".*/\1/p' | head -1)
  [ -n "$latest" ] || { echo "[cds-ds] gh latest version lookup failed" >&2; return 1; }
  asset_name="gh_${latest}_${os}_${arch}.${archive_ext}"
  url="https://github.com/cli/cli/releases/download/v${latest}/${asset_name}"
  tmpdir=$(mktemp -d)
  trap 'rm -rf "$tmpdir"' RETURN
  echo "[cds-ds] Downloading gh v${latest} (${os}/${arch}) ..." >&2
  curl -sSL -o "$tmpdir/$asset_name" "$url"
  if [ "$archive_ext" = "zip" ]; then
    unzip -q "$tmpdir/$asset_name" -d "$tmpdir"
  else
    tar -xzf "$tmpdir/$asset_name" -C "$tmpdir"
  fi
  # 추출 디렉터리명은 gh_${latest}_${os}_${arch}
  mv "$tmpdir/gh_${latest}_${os}_${arch}/bin/gh" "$BIN_DIR/gh"
  chmod +x "$BIN_DIR/gh"
  echo "[cds-ds] gh installed → $BIN_DIR/gh" >&2
}

if ! command -v gh >/dev/null 2>&1; then
  echo "[cds-ds] gh not found — installing automatically ..." >&2
  install_gh_binary || {
    echo "[cds-ds] gh auto-install failed. Install manually: https://cli.github.com/" >&2
    # gh 없이도 GITHUB_TOKEN env var 있으면 동작하므로 continue
  }
fi

# ── GitHub 토큰 자동 주입 ───────────────────────────────
# 우선순위: 기존 GITHUB_TOKEN (유효) → gh auth token
# Claude Code 가 .mcp.json 의 ${GITHUB_TOKEN} 치환에 실패해 리터럴이 들어오는
# 케이스도 처리.
if [ -z "${GITHUB_TOKEN:-}" ] || [ "${GITHUB_TOKEN}" = '${GITHUB_TOKEN}' ]; then
  unset GITHUB_TOKEN
  if command -v gh >/dev/null 2>&1; then
    if tok="$(gh auth token 2>/dev/null)" && [ -n "$tok" ]; then
      export GITHUB_TOKEN="$tok"
    else
      echo "[cds-ds] gh CLI 는 있지만 로그인 안됨. 터미널에서 실행:" >&2
      echo "         gh auth login" >&2
    fi
  fi
fi

# ── Figma 토큰 검증 ────────────────────────────────────
# Claude Code 가 .mcp.json 의 ${FIGMA_TOKEN} 치환에 실패해 리터럴이 들어오는 케이스 처리.
# Figma 는 gh 같은 fallback 없음 — 미설정 시 경고만 출력 (서버는 계속 기동).
if [ -z "${FIGMA_TOKEN:-}" ] || [ "${FIGMA_TOKEN}" = '${FIGMA_TOKEN}' ]; then
  unset FIGMA_TOKEN
  echo "[cds-ds] FIGMA_TOKEN 미설정 — figma_fetch_design 도구 사용 불가." >&2
  echo "         Figma → Settings → Security → Personal access tokens 에서 토큰 생성 후" >&2
  echo "         export FIGMA_TOKEN=figd_xxx 를 쉘 설정에 추가하세요." >&2
fi

# ── MCP 서버 실행 (PEP 723 으로 Python + deps 자동) ──────
exec uv run --script "$(dirname "$0")/cds_ds_server.py"
