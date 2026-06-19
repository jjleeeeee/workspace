import json
from collections import defaultdict
import sys

RAW = 'proto-walk/raw-7tuvMuw9gk20QnyHo0iu2e.json'
START = '35:75221'
OUT = 'proto-walk/flow-as-is.json'

print("Loading raw JSON...", file=sys.stderr)
d = json.load(open(RAW))
doc = d['document']

nodes_by_id = {}
parent_of = {}

def index(n, parent=None):
    nodes_by_id[n['id']] = n
    if parent:
        parent_of[n['id']] = parent['id']
    for c in n.get('children', []):
        index(c, n)

print("Indexing nodes...", file=sys.stderr)
index(doc)
print(f"Total nodes: {len(nodes_by_id)}", file=sys.stderr)

def frame_ancestor(nid):
    cur = nid
    while cur:
        n = nodes_by_id.get(cur)
        if n and n.get('type') == 'FRAME':
            parent_id = parent_of.get(cur)
            if parent_id:
                parent_node = nodes_by_id.get(parent_id, {})
                if parent_node.get('type') in ('CANVAS', 'PAGE', 'DOCUMENT'):
                    return cur
        cur = parent_of.get(cur)
    return nid

def visible_text(node, depth=0):
    """재귀적으로 자식 TEXT 노드에서 첫 번째 비어있지 않은 텍스트 반환."""
    if depth > 5:
        return None
    if node.get('type') == 'TEXT':
        chars = node.get('characters', '').strip()
        if chars:
            return chars
    for child in node.get('children', []):
        found = visible_text(child, depth + 1)
        if found:
            return found
    return None

def frame_texts(node, results=None, depth=0):
    """프레임 내 모든 가시 TEXT 노드 텍스트 수집 (최대 50개, depth 10)."""
    if results is None:
        results = []
    if depth > 10 or len(results) >= 50:
        return results
    if node.get('type') == 'TEXT' and node.get('visible', True):
        chars = node.get('characters', '').strip()
        if chars and chars not in results:
            results.append(chars)
    for child in node.get('children', []):
        frame_texts(child, results, depth + 1)
    return results

def hotspot_label(node):
    """hotspot의 화면 표시 텍스트. 없으면 bbox 위치 힌트, 없으면 레이어명."""
    text = visible_text(node)
    if text:
        return text
    bbox = node.get('absoluteBoundingBox')
    layer = node.get('name', '?')
    if bbox:
        # 위치 기반 힌트 (상단/하단, 좌/우)
        x, y, w, h = bbox['x'], bbox['y'], bbox['width'], bbox['height']
        pos = []
        if y < 200: pos.append('상단')
        elif y > 700: pos.append('하단')
        if x < 180: pos.append('좌측')
        elif x > 360: pos.append('우측')
        pos_str = ' '.join(pos) if pos else '중앙'
        return f'[{pos_str} 아이콘]'
    return f'[아이콘]'

print("Extracting interactions...", file=sys.stderr)
edges = []
for nid, n in nodes_by_id.items():
    for it in n.get('interactions', []):
        trig = it.get('trigger', {}).get('type', '?')
        for act in it.get('actions', []):
            dest = act.get('destinationId')
            if dest:
                edges.append({
                    'from_frame': frame_ancestor(nid),
                    'hotspot_id': nid,
                    'hotspot_name': n.get('name', '?'),
                    'hotspot_visible_label': hotspot_label(n),
                    'bbox': n.get('absoluteBoundingBox'),
                    'trigger': trig,
                    'to': dest,
                })

print(f"Total edges: {len(edges)}", file=sys.stderr)

out_edges = defaultdict(list)
for e in edges:
    out_edges[e['from_frame']].append(e)

# BFS from START
visited = {START}
queue = [START]
order = [START]
while queue:
    cur = queue.pop(0)
    for e in out_edges[cur]:
        if e['to'] not in visited:
            visited.add(e['to'])
            queue.append(e['to'])
            order.append(e['to'])

print(f"BFS reachable frames: {len(order)}", file=sys.stderr)

flow = {'startNodeId': START, 'nodes': {}}
for fid in order:
    n = nodes_by_id.get(fid, {})
    click_hotspots = []
    auto_next = []
    back_actions = []

    for e in out_edges[fid]:
        if e['trigger'] == 'ON_CLICK':
            # Check if destination is BACK (None means back)
            if e['to']:
                click_hotspots.append({
                    'id': e['hotspot_id'],
                    'label': e['hotspot_visible_label'],
                    'bbox': e['bbox'],
                    'target': e['to'],
                    'trigger': e['trigger'],
                })
        elif e['trigger'] == 'AFTER_TIMEOUT':
            auto_next.append(e['to'])

    flow['nodes'][fid] = {
        'name': n.get('name', '?'),
        'type': n.get('type', '?'),
        'imageRef': f'frames/{fid.replace(":", "-")}.png',
        'frame_texts': frame_texts(n),
        'hotspots': click_hotspots,
        'auto_next': auto_next,
    }

json.dump(flow, open(OUT, 'w'), ensure_ascii=False, indent=2)
print(f"Written: {OUT}", file=sys.stderr)

# Print summary
print("\n=== FLOW SUMMARY ===")
for fid, fdata in flow['nodes'].items():
    print(f"\n[{fid}] {fdata['name']}")
    for h in fdata['hotspots']:
        target_name = flow['nodes'].get(h['target'], {}).get('name', h['target'])
        print(f"  ON_CLICK '{h['label']}' → [{h['target']}] {target_name}")
    for a in fdata['auto_next']:
        target_name = flow['nodes'].get(a, {}).get('name', a)
        print(f"  AUTO_NEXT → [{a}] {target_name}")
