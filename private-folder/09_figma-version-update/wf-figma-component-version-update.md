---
type: Workflow
status: Done
version: 0.1
date: 2026-05-22
project: "Chord Design System"
owner: 이정주B
source: "https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA/branch/w8085VYJSVXKEQbbTAuOYa/Chord-Design-System"
related:
  - "98_workflow/wf-template.md"
---

# Figma 컴포넌트 버전 description 일괄 업데이트 워크플로우

`Figma 컴포넌트 버전 description 일괄 업데이트 워크플로우`는 Figma 파일 내 특정 prefix(💠)가 붙은 컴포넌트의 description 버전 태그를 일괄 변경하는 절차다.

## 1. 목적

Chord Design System 버전이 올라갈 때, 💠 prefix가 붙은 모든 컴포넌트의 description에 기록된 버전 태그(예: `v.0.5.2`)를 새 버전(예: `v.0.5.3`)으로 한 번에 교체한다.

이 워크플로우를 완료하면 대상 Figma 파일(또는 브랜치) 내 모든 💠 컴포넌트의 description이 새 버전 태그로 갱신된다.

## 2. 사용 시점

사용한다:

- Chord DS 버전이 올라가 컴포넌트 description의 버전 태그를 일괄 교체해야 할 때
- 브랜치 또는 메인 파일에서 특정 prefix가 붙은 컴포넌트를 일괄 수정해야 할 때

사용하지 않는다:

- description 외 다른 속성(이름, 구조, 토큰 등)을 바꿔야 할 때
- 개별 컴포넌트만 수정할 때 (Figma UI에서 직접 수정이 빠름)
- 컴포넌트가 라이브러리 발행 상태일 때 (REST API로 직접 확인 가능하나, 쓰기는 Plugin API 필요)

## 3. 입력 / 산출물

| 구분 | 경로 또는 이름 | 설명 |
| --- | --- | --- |
| 입력 | Figma 파일 URL (브랜치 또는 메인) | 수정 대상 파일. fileKey, branchKey 필요 |
| 입력 | 구버전 태그 문자열 | 예: `v.0.5.2` |
| 입력 | 신버전 태그 문자열 | 예: `v.0.5.3` |
| 산출물 | Figma 파일 내 컴포넌트 description | 신버전 태그로 갱신된 상태 |

산출물 이름 규칙:

- 별도 파일 없음. 변경은 Figma 파일에 직접 반영됨
- 작업 후 Figma 브랜치 커밋 또는 머지 필요

## 4. 필요한 도구

| 도구 | 사용 목적 | 설치/확인 | 대체 방법 |
| --- | --- | --- | --- |
| Figma REST API | 대상 컴포넌트 node_id 목록 수집 | `curl` + `FIGMA_ACCESS_TOKEN` 환경변수 | Figma UI에서 수동 확인 |
| `curl` + `python3` | REST API 응답 파싱 및 node_id 추출 | `curl --version` / `python3 --version` | `jq`, Node.js |
| figma-console MCP (`figma_execute`) | Plugin API로 description 쓰기 | Desktop Bridge 플러그인 연결 확인 (`figma_get_status probe:true`) | 해당 없음 (REST API는 쓰기 미지원) |
| figma-console MCP (`figma_get_status`) | Figma Desktop Bridge 연결 확인 | MCP 연결 상태 확인 | 해당 없음 |

## 5. 환경 준비

작업 위치:

```bash
cd /Users/jj.iee/Desktop/workspace
```

환경변수 확인:

```bash
echo $FIGMA_ACCESS_TOKEN | cut -c1-10  # 토큰 앞 10자만 확인
```

Figma Desktop Bridge 연결 확인:

- Figma 데스크탑 실행
- `Plugins → Development → Figma Desktop Bridge` → **Run**
- 3초 대기 후 `figma_get_status probe:true` 로 연결 확인

필요 권한:

- Figma 파일 읽기 권한 (REST API용 Personal Access Token)
- Figma 파일 쓰기 권한 (Plugin API로 description 수정)
- Desktop Bridge 플러그인 실행 권한

## 6. 전체 흐름

1. Figma URL에서 fileKey(메인)와 branchKey(브랜치) 파싱
2. REST API로 대상 파일의 component_sets + components 조회
3. 💠 prefix + 구버전 태그 description 기준으로 node_id 목록 필터링
4. figma-console MCP Desktop Bridge 연결 확인
5. `figma_execute`로 node_id 직접 접근해 description 일괄 업데이트

## 7. 상세 절차

### Step 1. URL 파싱

목표:

- fileKey(메인)와 branchKey(브랜치) 확보

실행:

```
URL 형식:
https://www.figma.com/design/{fileKey}/branch/{branchKey}/{fileName}?node-id={nodeId}

예시:
https://www.figma.com/design/DWEduE6GfxYMlyxKPNJ8jA/branch/w8085VYJSVXKEQbbTAuOYa/Chord-Design-System

fileKey   = DWEduE6GfxYMlyxKPNJ8jA   (메인 파일 — REST API 조회용)
branchKey = w8085VYJSVXKEQbbTAuOYa   (브랜치 — Plugin API 쓰기용)
```

판단 기준:

- REST API 컴포넌트 조회는 **메인 fileKey** 사용 (브랜치는 발행 컴포넌트 0개로 조회됨)
- Plugin API(`figma_execute`) 쓰기는 현재 Figma에서 열린 파일(브랜치) 기준

결과물:

- fileKey, branchKey 확보

### Step 2. REST API로 대상 node_id 수집

목표:

- 💠 prefix + 구버전 태그(`v.0.5.2`) description을 가진 컴포넌트의 node_id 목록 추출

실행:

```bash
python3 << 'EOF'
import json, subprocess, os

OLD_VERSION = 'v.0.5.2'
PREFIX = '💠'
FILE_KEY = 'DWEduE6GfxYMlyxKPNJ8jA'  # 메인 파일 키
TOKEN = os.environ['FIGMA_ACCESS_TOKEN']

def fetch(endpoint):
    raw = subprocess.check_output([
        "curl", "-s",
        f"https://api.figma.com/v1/files/{FILE_KEY}/{endpoint}",
        "-H", f"X-Figma-Token: {TOKEN}"
    ])
    return json.loads(raw)

cs = fetch('component_sets').get('meta', {}).get('component_sets', [])
c  = fetch('components').get('meta', {}).get('components', [])

targets = [
    x for x in cs + c
    if PREFIX in x.get('name', '') and x.get('description', '') == OLD_VERSION
]

print(f"업데이트 대상: {len(targets)}개")
for t in targets:
    print(f"  {t['node_id']} | {t['name'][:60]}")

ids = [t['node_id'].replace('-', ':') for t in targets]
print("\nIDs:", ids)
EOF
```

판단 기준:

- component_sets와 components 모두 조회 (component_set만 조회하면 단독 COMPONENT 누락)
- description이 정확히 구버전 태그인 것만 대상 (빈 description은 제외)

결과물:

- node_id 목록 (Python list 형태)

### Step 3. Desktop Bridge 연결 확인

목표:

- figma_execute 실행 가능 상태 확인

실행:

```
figma_get_status probe:true
→ "✅ Connected" 확인
```

판단 기준:

- `probeResult.success: true` + `latencyMs` 값 정상이면 진행
- 연결 안 되면 Figma에서 Desktop Bridge 플러그인 재실행

결과물:

- 연결된 파일명, fileKey 확인 (브랜치가 열려 있는지 확인)

### Step 4. figma_execute로 일괄 업데이트

목표:

- 수집한 node_id 목록으로 description 직접 교체

실행:

```javascript
// figma_execute에 전달할 코드
const ids = [/* Step 2에서 추출한 node_id 목록 */];
const OLD = 'v.0.5.2';
const NEW = 'v.0.5.3';

const updated = [];
const failed = [];

for (const id of ids) {
  const node = await figma.getNodeByIdAsync(id);
  if (node && 'description' in node) {
    if (node.description === OLD) {
      node.description = NEW;
      updated.push(node.name);
    } else {
      failed.push({ id, name: node.name, desc: node.description });
    }
  } else {
    failed.push({ id, reason: 'not found or no description' });
  }
}

return { updated: updated.length, updatedNames: updated, failed };
```

판단 기준:

- `figma.getNodeByIdAsync(id)` 사용 — 페이지 전체 스캔(`findAllWithCriteria`) 대신 node_id 직접 접근 (스캔은 대형 파일에서 타임아웃 발생)
- `failed` 배열이 비어 있으면 정상 완료
- `failed`에 항목이 있으면 해당 node를 Figma UI에서 수동 확인

결과물:

- `{ updated: N, updatedNames: [...], failed: [] }` 반환

## 8. 판단 기준

우선순위:

1. 사용자 요청 (버전 태그, 대상 prefix 지정)
2. REST API 조회 결과 (node_id 목록의 기준)
3. Figma Plugin API 실행 결과 (`failed` 배열)
4. 기존 repo 패턴
5. LLM 추론

금지:

- REST API 브랜치 키로 컴포넌트 조회하지 않는다 (브랜치는 발행 컴포넌트 0개 반환)
- `findAllWithCriteria`로 전체 페이지 스캔하지 않는다 (45+ 페이지 파일에서 타임아웃)
- description이 비어 있는 컴포넌트는 건드리지 않는다
- node_id를 추측하지 않는다 (반드시 REST API로 확인)

## 9. 예외 / 실패 대응

| 상황 | 대응 |
| --- | --- |
| REST API 브랜치 키로 조회 시 컴포넌트 0개 | 메인 fileKey로 조회. 브랜치는 REST API에 발행 컴포넌트 미노출 |
| `findAllWithCriteria` 타임아웃 | node_id를 REST API로 먼저 수집 후 `getNodeByIdAsync`로 직접 접근 |
| Desktop Bridge 미연결 | Figma에서 `Plugins → Development → Figma Desktop Bridge → Run` 후 재시도 |
| `failed`에 누락 node 존재 | 해당 node_id를 Figma UI에서 직접 확인. 브랜치에서 삭제됐거나 node_id 불일치 가능 |
| description이 구버전 태그와 정확히 불일치 | REST API 조회 결과의 description 값 직접 확인 후 필터 조건 조정 |

## 10. 검증

실행:

```bash
# REST API로 업데이트 후 동일 쿼리 재실행 — 구버전 태그 잔존 여부 확인
python3 << 'EOF'
import json, subprocess, os

FILE_KEY = 'DWEduE6GfxYMlyxKPNJ8jA'
TOKEN = os.environ['FIGMA_ACCESS_TOKEN']

def fetch(endpoint):
    raw = subprocess.check_output([
        "curl", "-s",
        f"https://api.figma.com/v1/files/{FILE_KEY}/{endpoint}",
        "-H", f"X-Figma-Token: {TOKEN}"
    ])
    return json.loads(raw)

cs = fetch('component_sets').get('meta', {}).get('component_sets', [])
c  = fetch('components').get('meta', {}).get('components', [])

remaining = [x for x in cs + c if '💠' in x.get('name','') and x.get('description','') == 'v.0.5.2']
print(f"구버전 태그 잔존: {len(remaining)}개")
for r in remaining:
    print(f"  {r['node_id']} | {r['name']}")
EOF
```

기대 결과:

- 구버전 태그(`v.0.5.2`) 잔존 컴포넌트 0개
- `figma_execute` 반환값의 `failed` 배열 비어 있음
- Figma UI에서 임의 컴포넌트 선택 후 description 확인

> **주의:** REST API 캐시로 인해 업데이트 직후 조회 시 구버전 태그가 여전히 보일 수 있음. Figma UI에서 직접 확인이 우선.

## 11. 완료 보고

완료:

- 산출물: Figma 브랜치 내 💠 컴포넌트 description 갱신
- 대상: 39개 컴포넌트 (component_sets 38개 + components 1개)
- 변경: `v.0.5.2` → `v.0.5.3`
- 사용 도구: Figma REST API, figma-console MCP (`figma_execute`, `figma_get_status`), `curl`, `python3`
- 검증: `figma_execute` 반환 `{ updated: 39, failed: [] }` 확인
- 남은 한계:
  - REST API 조회는 메인 파일 기준 (브랜치 발행 전 컴포넌트는 미반영)
  - 업데이트 후 REST API 캐시로 인해 즉시 재조회 시 구버전 태그 잔존처럼 보일 수 있음
  - 브랜치 머지 전 Figma UI에서 변경 확인 권장

## 12. 체크리스트

- [x] 목적이 한 문장으로 설명되어 있다.
- [x] 입력 자료와 산출물이 분리되어 있다.
- [x] 필요한 도구와 확인 명령이 있다.
- [x] 환경 준비 단계가 있다.
- [x] 전체 흐름이 5단계로 정리되어 있다.
- [x] 상세 절차에 목표/실행/판단 기준/결과물이 있다.
- [x] 판단 기준과 금지 규칙이 있다.
- [x] 예외와 실패 대응이 있다.
- [x] 검증 명령과 기대 결과가 있다.
- [x] 완료 보고 형식이 있다.
