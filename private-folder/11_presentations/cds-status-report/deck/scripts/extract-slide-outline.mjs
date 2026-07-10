import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');
const sourcePath = path.join(projectRoot, 'content/cds-status-report-slide-deck.md');
const outlinePath = path.join(projectRoot, 'content/slide-outline.json');
const chartConfigDir = path.join(projectRoot, 'assets/charts/config');

const source = fs.readFileSync(sourcePath, 'utf8');
const slideMatches = [...source.matchAll(/^#(\d+) DECK\s*$/gm)];

const typeByIndex = new Map([
  [1, 'cover'],
  [2, 'context'],
  [3, 'comparison'],
  [4, 'signal-chart'],
  [5, 'cards'],
  [6, 'diagnosis-message'],
  [7, 'lifecycle-flow'],
  [8, 'signal-chart'],
  [9, 'signal-chart'],
  [10, 'cards'],
  [16, 'tag-cluster'],
  [17, 'signal-chart'],
  [27, 'matrix'],
  [28, 'closing-question'],
]);

function getBlock(index) {
  const current = slideMatches[index];
  const next = slideMatches[index + 1];
  return source.slice(current.index, next ? next.index : source.length).trim();
}

function extractTitle(block) {
  const titleMatch = block.match(/타이틀:\s*\n([\s\S]*?)(?:\n\n|컨텐츠 내용 혹은 구성:)/);
  if (!titleMatch) return '';
  return titleMatch[1]
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ');
}

function extractContext(block) {
  return (block.match(/<!--\s*이 페이지의 맥락 설명:\s*([\s\S]*?)-->/) || [])[1]?.trim() || '';
}

function chartInfo(index, block) {
  if (index === 4) return { library: 'Chart.js', kind: 'doughnut', config: 'assets/charts/config/slide-04-doughnut.json' };
  if (index === 8) return { library: 'Chart.js', kind: 'horizontal-bar', config: 'assets/charts/config/slide-08-horizontal-bar.json', denominator: 11 };
  if (index === 9) return { library: 'Chart.js', kind: 'horizontal-bar', config: 'assets/charts/config/slide-09-horizontal-bar.json', denominator: 11 };
  if (index === 17) return { library: 'Chart.js', kind: 'horizontal-bar', config: 'assets/charts/config/slide-17-horizontal-bar.json', denominator: 11 };
  if (index === 16) return { library: null, kind: 'tag-cluster', note: 'Prefer tag cluster; use Chart.js only if quantitative emphasis is needed.' };
  return null;
}

const slides = slideMatches.map((match, i) => {
  const index = Number(match[1]);
  const block = getBlock(i);
  return {
    index,
    title: extractTitle(block),
    type: typeByIndex.get(index) || 'content',
    background: index === 1 ? 'cover-gradient' : index <= 6 ? 'black' : 'cover-gradient',
    context: extractContext(block),
    usesChart: Boolean(chartInfo(index, block)?.library),
    chart: chartInfo(index, block),
    usesLucide: [2, 4, 5, 7, 16, 27, 28].includes(index),
  };
});

const chartConfigs = {
  'slide-04-doughnut.json': {
    slide: 4,
    library: 'Chart.js',
    type: 'doughnut',
    centerLabel: '총 14명',
    data: {
      labels: ['실무자', '파트리드', '팀리드', 'Head of Design'],
      datasets: [{ data: [8, 3, 2, 1] }],
    },
    options: {
      responsive: false,
      plugins: { legend: { position: 'bottom' }, tooltip: { enabled: true } },
      cutout: '68%',
    },
    notes: ['분모 설명은 차트 오른쪽에 별도 카드로 배치한다.'],
  },
  'slide-08-horizontal-bar.json': {
    slide: 8,
    library: 'Chart.js',
    type: 'bar',
    orientation: 'horizontal',
    denominator: 11,
    data: {
      labels: [
        '운영/반복 업무에서 시간 단축 체감',
        '디테치 빈도는 낮다고 보는 자기보고',
        '리스트아이템 관련 어려움 또는 논의',
        '개발 구현 상태 불투명 언급',
        '기획자 통역 비용 언급',
        'LLM 코드 챗봇 실사용',
      ],
      datasets: [{ label: '언급 인원', data: [8, 8, 7, 6, 5, 1] }],
    },
    options: {
      responsive: false,
      indexAxis: 'y',
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: { x: { beginAtZero: true, max: 11 }, y: { ticks: { autoSkip: false } } },
    },
    displayRule: '항목 라벨에는 n=11 기준임을 함께 표기한다.',
  },
  'slide-09-horizontal-bar.json': {
    slide: 9,
    library: 'Chart.js',
    type: 'bar',
    orientation: 'horizontal',
    denominator: 11,
    data: {
      labels: [
        '강한 CDS-first',
        '기존 화면/작업 파일 출발 후 CDS 재확인',
        '자유 시안 후 DS 워싱·디테치',
        '별도 라이브러리 또는 도메인 패턴 출발',
      ],
      datasets: [{ label: '인원', data: [3, 2, 4, 2] }],
    },
    options: {
      responsive: false,
      indexAxis: 'y',
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: { x: { beginAtZero: true, max: 11 }, y: { ticks: { autoSkip: false } } },
    },
    displayRule: 'CDS-first를 5명으로 과장하지 않는다.',
  },
  'slide-17-horizontal-bar.json': {
    slide: 17,
    library: 'Chart.js',
    type: 'bar',
    orientation: 'horizontal',
    denominator: 11,
    data: {
      labels: ['리스트아이템', '버튼', '아바타/갓배지', '텍스트필드', '바텀시트', '툴팁', '타이틀 영역', '테이블/리더보드'],
      datasets: [{ label: '언급 인원', data: [7, 7, 6, 4, 4, 4, 4, 3] }],
    },
    options: {
      responsive: false,
      indexAxis: 'y',
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: { x: { beginAtZero: true, max: 11 }, y: { ticks: { autoSkip: false } } },
    },
    displayRule: '사용량이 아니라 문제/판단/예외/개선 필요로 언급된 인원임을 명시한다.',
  },
};

fs.mkdirSync(chartConfigDir, { recursive: true });
fs.writeFileSync(outlinePath, `${JSON.stringify({
  source: 'content/cds-status-report-slide-deck.md',
  slideCount: slides.length,
  styleKit: '../style-kit/DECK.md',
  chartLibrary: 'Chart.js',
  iconLibrary: 'Lucide',
  slides,
}, null, 2)}\n`);

for (const [filename, config] of Object.entries(chartConfigs)) {
  fs.writeFileSync(path.join(chartConfigDir, filename), `${JSON.stringify(config, null, 2)}\n`);
}

console.log(`Extracted ${slides.length} slides`);
console.log(`Wrote ${Object.keys(chartConfigs).length} chart configs`);
