import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');
const outPath = path.join(projectRoot, 'deck/index.html');

const outline = JSON.parse(fs.readFileSync(path.join(projectRoot, 'content/slide-outline.json'), 'utf8'));
const chartConfigDir = path.join(projectRoot, 'assets/charts/config');
const chartConfigs = {};
for (const name of fs.readdirSync(chartConfigDir).filter((file) => file.endsWith('.json'))) {
  chartConfigs[name.replace('.json', '')] = JSON.parse(fs.readFileSync(path.join(chartConfigDir, name), 'utf8'));
}

const slideData = {
  1: {
    subtitle: 'PD 업무 흐름에서 CDS가 작동하는 지점과 다시 해석되는 지점',
    keywords: ['운영', '선행', '확정/구축', '개발 구현', '도메인 반복 패턴', '예외 판단', '레거시/마이그레이션'],
  },
  2: {
    timeline: ['CDS 교육과 학습 워크샵 진행', '운영/신규 업무에서 룰이 깨지는 상황 반복', '개인별 인터뷰 8명', '파트리드 3명 인터뷰', '팀리드 2명 검증', 'Head of Design 리더십 검증'],
    question: 'PD들은 CDS를 어디까지 기준으로 보고, 어느 순간부터 예외로 판단하는가?',
  },
  3: {
    left: { title: '준수 여부 프레임', items: ['누가 지켰는가', '누가 깼는가', '교육이 부족했는가', '컴포넌트가 더 필요했는가'] },
    right: { title: '판단 흐름 프레임', items: ['어떤 화면에서 CDS가 기본값이 되는가', '어떤 전환점에서 CDS 맵핑이 다시 필요한가', '예외 판단은 누가 어떤 기준으로 하는가', '레거시/개발 구현 상태는 어떤 영향을 주는가'] },
    message: '핵심은 “안 지킨 사람”이 아니라, 조직이 예외를 처리하는 방식이다.',
  },
  4: {
    denominators: ['n=14 전체 조사 범위', 'n=13 HoD 제외 발견 구조', 'n=11 실무자+파트리드 사용 방식', 'n=8 개인 실무자 관점', 'n=2 팀리드 검증 레이어', 'n=1 HoD 리더십 검증'],
  },
  5: {
    cards: [
      ['언급 인원', '특정 이슈를 직접 말했거나 사례로 확인된 사람 수'],
      ['자기보고', '본인이 느낀 사용 방식이나 빈도'],
      ['리드 보정', '리드가 조직 관점에서 다시 설명한 현상'],
      ['반박/보정 신호', '결론을 뒤집기보다 조건을 붙이는 근거'],
    ],
    message: '차트는 결론 증명이 아니라 반복 신호를 읽기 위한 지도다.',
  },
  6: {
    statement: 'CDS는 이미 DS에 맞춰진 운영/치환성 업무에서는 효용이 크다. 그러나 선행이 확정되고 구축/운영으로 넘어가거나, 기존 화면이 레거시화되는 순간에는 DS 맵핑·마이그레이션·예외 판단 비용이 다시 발생한다.',
    items: ['문제는 단순히 운영 vs 선행의 차이가 아니다.', '문제는 화면이 다음 단계로 넘어갈 때 CDS 기준이 다시 연결되는 방식이다.', '이 연결 방식이 약하면 확정된 선행도 운영 진입 시점에 예외 또는 레거시 후보가 된다.'],
  },
  7: {
    stages: [
      ['선행 탐색', '탐색 폭을 넓히기 위해 CDS를 일부러 보지 않음'],
      ['확정/구축', '늦게 적용하면 재싱크 비용 발생'],
      ['DS 맵핑', '코드 구현/플랫폼 차이를 확인해야 함'],
      ['운영', 'DS-first가 강하지만 구축 상태에 의존'],
      ['레거시/마이그레이션', '과거 화면과 외주 구조가 기준을 흔듦'],
      ['예외·도메인 패턴', '반복되면 별도 규칙처럼 작동'],
    ],
  },
  8: { message: 'CDS는 무력한 시스템이 아니다. 효용이 큰 구간과 비용이 다시 발생하는 구간이 분리되어 있다.' },
  9: { message: '“CDS 먼저 조립”은 5명이 아니라 3명에 가깝다. 나머지는 기존 작업물에서 출발해 CDS 기준으로 재확인한다.' },
  10: {
    cards: [
      ['빠른 조립', '반복 운영 화면에서 속도를 만든다.'],
      ['일관성 확보', '공통 UI가 이미 맞춰진 화면에서 강하다.'],
      ['커뮤니케이션 절감', '디자인-개발 간 설명 비용을 줄인다.'],
    ],
  },
  11: {
    cards: [
      ['선행 → 구축', '방향 확정 뒤 CDS 복귀 기준이 필요해진다.'],
      ['운영 → 레거시', '기존 화면 히스토리가 즉시 치환을 막는다.'],
      ['도메인 반복', '예외가 반복되면 별도 기준처럼 작동한다.'],
    ],
  },
  12: {
    message: '선행의 질문은 “처음부터 CDS를 쓰는가”가 아니라, “어느 시점에 운영 기준으로 돌아오는가”다.',
  },
  13: {
    cards: [
      ['확정 전', '아이데이션을 막지 않는다.'],
      ['30% 지점', '개발 영향과 컴포넌트 후보를 점검한다.'],
      ['구축 전', 'CDS 복귀와 예외 사유를 명확히 한다.'],
    ],
  },
  14: {
    cards: [
      ['운영 DS-first', '기본 방향은 확인된다.'],
      ['구축 상태 의존', '이미 DS 친화적으로 만들어진 화면에서 특히 강하다.'],
      ['예외 판단', '레거시와 개발 구현 상태가 개입한다.'],
    ],
  },
  15: {
    message: '선행 결과가 CDS로 흡수되지 않으면, 운영 진입과 동시에 새로운 레거시 후보가 된다.',
  },
  16: {
    tags: ['기능 한계', '정의 불일치', '개발 미구현', '도메인 톤', '선행 검증', '레거시 구조'],
    message: '반복되는 예외의 문제는 예외가 있다는 사실보다, 예외를 판단하고 흡수하는 기준이 약하다는 점이다.',
  },
  17: { message: '이 수치는 사용량이 아니라 인터뷰에서 문제, 판단, 예외, 개선 필요로 언급된 인원이다.' },
  18: {
    message: '리스트아이템은 “없는 컴포넌트”라기보다, 맥락에 따라 정의가 흔들리는 컴포넌트에 가깝다.',
  },
  19: {
    cards: [
      ['Figma에는 있음', '그러나 코드 상태가 다를 수 있다.'],
      ['구현 여부 불명확', '판단이 다시 사람에게 돌아간다.'],
      ['기획 통역 비용', '컴포넌트 기준이 제품 언어로 번역되어야 한다.'],
    ],
  },
  20: {
    message: '디테치는 빈도가 아니라 흔적이 문제다. 예외가 남으면 이후 개발·운영 판단의 기준을 흐린다.',
  },
  21: {
    cards: [
      ['커머스', '상품/결제 맥락의 반복 패턴'],
      ['음악', '콘텐츠 탐색과 재생 맥락'],
      ['공연', '예매/상태/알림 맥락'],
      ['커뮤니티', '멤버십과 상호작용 맥락'],
    ],
  },
  22: {
    message: '반복 패턴은 모두 중앙 CDS로 흡수할 필요가 없다. 공통으로 남길 것과 도메인에 둘 것을 나눠야 한다.',
  },
  23: {
    cards: [
      ['CDS 언어', '컴포넌트, 상태값, 스펙'],
      ['기획 언어', '목적, 정책, 사용자 맥락'],
      ['개발 언어', '구현 가능성, 범위, 리스크'],
    ],
  },
  24: {
    message: '사람에게 묻기 전에 확인할 수 있는 기준이 부족하면, CDS 판단은 계속 개인 경험에 의존하게 된다.',
  },
  25: {
    cards: [
      ['실무자의 불안', '내가 바꿔도 되는지 모르겠다.'],
      ['리드의 번역', '이건 목적상 예외로 볼 수 있다.'],
      ['조직의 과제', '그 판단 언어를 공식 기준으로 남겨야 한다.'],
    ],
  },
  26: {
    cards: [
      ['CDS 보수형', '기준을 지키는 안전장치'],
      ['선행/웹 사각지대 감지형', '중앙 CDS 밖의 조건을 감지'],
      ['운영/선행 구분형', '사용 방식의 차이를 번역'],
    ],
  },
  27: {
    message: '팀리드와 HoD는 발견을 뒤집기보다, 선행을 어디서부터 운영 기준으로 되돌릴지에 대한 리더십 판단을 보강했다.',
  },
  28: {
    questions: ['공통 CDS에 반드시 남길 기준은 무엇인가?', '도메인/로컬 시스템으로 풀어도 되는 패턴은 무엇인가?', 'CDS 체크포인트를 어느 시점에 둘 것인가?', '반복 예외는 언제 재흡수 후보로 볼 것인가?', '커스텀 허용 시 개발 영향은 누가 확인할 것인가?'],
    message: '결론은 “더 지켜라”가 아니다. 공통 기준을 경량화하고 도메인/로컬 시스템과 재흡수 루프를 함께 설계해야 한다.',
  },
};

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function icon(name) {
  return `<i data-lucide="${name}" aria-hidden="true"></i>`;
}

function title(slide) {
  return `<div class="slide-head reveal"><h2>${esc(slide.title)}</h2></div>`;
}

function pillList(items) {
  return `<div class="pill-list">${items.map((item) => `<span>${esc(item)}</span>`).join('')}</div>`;
}

function cardGrid(cards) {
  return `<div class="card-grid">${cards.map(([head, body], index) => `<article class="info-card reveal" style="--delay:${index * 70}ms"><strong>${esc(head)}</strong><p>${esc(body)}</p></article>`).join('')}</div>`;
}

function bullets(items) {
  return `<ul class="bullet-list">${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
}

function chartKey(slide) {
  return path.basename(slide.chart.config, '.json');
}

function renderChart(slide, message = '') {
  const key = chartKey(slide);
  const isDoughnut = slide.chart.kind === 'doughnut';
  const noteContent = slideData[slide.index]?.denominators
    ? `<ul class="denominator-list">${slideData[slide.index].denominators.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`
    : `<p>${esc(message || slide.context)}</p>`;
  return `<div class="chart-layout ${isDoughnut ? 'chart-layout--doughnut' : ''}">
    <div class="chart-panel ${isDoughnut ? 'chart-panel--doughnut' : ''} reveal">
      <canvas id="chart-${slide.index}" data-chart-key="${key}" aria-label="${esc(slide.title)}"></canvas>
    </div>
    <aside class="chart-note reveal">
      <span class="note-label">${slide.chart.denominator ? `n=${slide.chart.denominator}` : 'n=14'}</span>
      ${noteContent}
    </aside>
  </div>`;
}

const tocItems = [
  ['01', '조사 관점과 분석 범위'],
  ['02', '핵심 진단과 라이프사이클'],
  ['03', '반복 신호와 사용 방식'],
  ['04', '효용과 전환 비용'],
  ['05', '예외, 구현 상태, 도메인 패턴'],
  ['06', '리더십 검증과 의사결정 질문'],
];

function renderContentsSlide() {
  return `<section class="slide slide--black slide--contents" data-index="contents">
    <div class="toc-left reveal">
      <p class="toc-label">CONTENTS</p>
      <h2>CDS가 작동하는 지점과<br>다시 해석되는 지점</h2>
      <p class="toc-sub">준수 여부가 아니라, 업무 흐름 속 판단이 바뀌는 순간을 따라갑니다.</p>
    </div>
    <div class="toc-list reveal">
      ${tocItems.map(([num, label]) => `<div class="toc-item"><span>${num}</span><p>${esc(label)}</p></div>`).join('')}
    </div>
  </section>`;
}

function renderSlide(slide) {
  const data = slideData[slide.index] || {};
  const bg = slide.index === 1 ? 'slide--gradient' : 'slide--black';
  const type = `slide--${slide.type}`;

  if (slide.index === 1) {
    return `<section class="slide ${bg} slide--cover active" data-index="${slide.index}">
      <div class="cover-copy">
        <h1 class="reveal">${esc(slide.title)}</h1>
        <p class="cover-sub reveal">${esc(data.subtitle)}</p>
        <div class="cover-keywords reveal">${pillList(data.keywords)}</div>
      </div>
    </section>`;
  }

  if (slide.usesChart && slide.chart?.config) {
    return `<section class="slide ${bg} ${type}" data-index="${slide.index}">
      <div class="slide-content">
        ${title(slide)}
        ${renderChart(slide, data.message)}
      </div>
    </section>`;
  }

  let body = '';
  if (data.timeline) {
    body = `<div class="split">
      <div class="timeline reveal">${data.timeline.map((item, i) => `<div><span>${i + 1}</span>${esc(item)}</div>`).join('')}</div>
      <blockquote class="question-card reveal">${icon('search-check')}<p>${esc(data.question)}</p></blockquote>
    </div>`;
  } else if (data.left && data.right) {
    body = `<div class="compare-grid">
      <article class="compare-card reveal"><h3>${esc(data.left.title)}</h3>${bullets(data.left.items)}</article>
      <article class="compare-card compare-card--accent reveal"><h3>${esc(data.right.title)}</h3>${bullets(data.right.items)}</article>
    </div><p class="bottom-message reveal">${esc(data.message)}</p>`;
  } else if (data.statement) {
    body = `<div class="diagnosis reveal">${esc(data.statement)}</div>${bullets(data.items)}`;
  } else if (data.stages) {
    body = `<div class="lifecycle">${data.stages.map(([stage, risk], i) => `<article class="stage reveal" style="--delay:${i * 60}ms"><span>${i + 1}</span><h3>${esc(stage)}</h3><p>${esc(risk)}</p></article>`).join('')}</div>`;
  } else if (data.cards) {
    body = cardGrid(data.cards);
  } else if (data.tags) {
    body = `<div class="tag-cloud reveal">${data.tags.map((tag) => `<span>${esc(tag)}</span>`).join('')}</div><p class="bottom-message reveal">${esc(data.message)}</p>`;
  } else if (data.questions) {
    body = `<div class="question-list">${data.questions.map((q, i) => `<article class="question-item reveal" style="--delay:${i * 70}ms"><span>${i + 1}</span><p>${esc(q)}</p></article>`).join('')}</div><p class="bottom-message reveal">${esc(data.message)}</p>`;
  } else if (data.message) {
    body = `<div class="center-message reveal">${esc(data.message)}</div>`;
  } else {
    body = `<div class="center-message reveal">${esc(slide.context)}</div>`;
  }

  return `<section class="slide ${bg} ${type}" data-index="${slide.index}">
    <div class="slide-content">
      ${title(slide)}
      ${body}
    </div>
  </section>`;
}

const slidesHtml = [
  renderSlide(outline.slides[0]),
  renderContentsSlide(),
  ...outline.slides.slice(1).map(renderSlide),
].join('\n');
const chartConfigsJson = JSON.stringify(chartConfigs);

const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CDS 인식 및 사용 현황 리포트</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Jost:wght@300;400;500&family=JetBrains+Mono:wght@300;400&family=Noto+Serif+KR:wght@400;500&family=Noto+Sans+KR:wght@300;400;500&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js"></script>
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <style>
    :root {
      --bg:#192b1b;
      --bg-alt:#1e3221;
      --bg-light:#e8e4d6;
      --bg-light-alt:#dedad0;
      --text:#d4cfbf;
      --muted:rgba(212,207,191,.62);
      --ink:#192b1b;
      --ink-muted:rgba(25,43,27,.62);
      --accent:#c8524a;
      --surface:rgba(212,207,191,.055);
      --line:rgba(212,207,191,.16);
      --line-light:rgba(25,43,27,.16);
      --card:rgba(212,207,191,.06);
      --ease:cubic-bezier(.16,1,.3,1);
      --slide-padding:clamp(34px,5vw,92px);
      --content-gap:clamp(20px,2.8vw,52px);
      --cover-title-size:clamp(54px,7vw,126px);
      --section-title-size:clamp(42px,4.7vw,86px);
      --content-title-size:clamp(34px,3.5vw,64px);
      --subtitle-size:clamp(23px,2.05vw,38px);
      --body-size:clamp(18px,1.45vw,27px);
      --body-strong-size:clamp(26px,2.45vw,46px);
      --dense-body-size:clamp(16px,1.15vw,22px);
      --label-size:clamp(13px,.82vw,16px);
      --toc-label-size:clamp(18px,1.25vw,24px);
      --caption-size:clamp(15px,1vw,19px);
      --micro-size:clamp(12px,.78vw,15px);
    }
    *{box-sizing:border-box}
    html,body{height:100%;overflow:hidden;margin:0}
    body{font-family:'Jost','Noto Sans KR',-apple-system,BlinkMacSystemFont,sans-serif;background:var(--bg);color:var(--text);font-weight:300}
    .deck{width:100vw;height:100vh;position:relative;overflow:hidden;background:var(--bg)}
    .slide{position:absolute;inset:0;width:100vw;height:100vh;height:100dvh;overflow:hidden;display:flex;flex-direction:column;padding:var(--slide-padding);opacity:0;pointer-events:none;transition:opacity .55s var(--ease);background:var(--bg);color:var(--text)}
    .slide.active{opacity:1;pointer-events:auto}
    .slide--black{background:var(--bg);color:var(--text)}
    .slide--gradient{background:var(--bg-light);color:var(--ink)}
    .slide--gradient::before{content:'';position:absolute;right:7vw;bottom:-.2em;font-family:'Playfair Display','Noto Serif KR',serif;font-size:42vw;line-height:1;color:rgba(25,43,27,.055);z-index:0}
    .slide>*{position:relative;z-index:1}
    .slide-content{height:100%;display:flex;flex-direction:column;gap:var(--content-gap);justify-content:flex-start;overflow:hidden}
    .slide-head{max-width:1220px}
    h1,h2,h3,p{margin:0}
    h1,h2,h3{font-family:'Playfair Display','Noto Serif KR',Georgia,serif;font-weight:400;letter-spacing:0;text-wrap:balance}
    h1{font-size:var(--cover-title-size);line-height:1.02;color:var(--ink);max-width:1120px}
    h2{font-size:var(--content-title-size);line-height:1.13}
    h3{font-size:var(--subtitle-size);line-height:1.22}
    p,li{font-size:var(--body-size);line-height:1.56;font-weight:300}
    .cover-copy{height:100%;display:flex;flex-direction:column;justify-content:center;gap:32px;max-width:1280px}
    .cover-sub{font-size:var(--subtitle-size);line-height:1.55;font-weight:300;color:var(--ink-muted);max-width:920px}
    .cover-keywords{max-width:1180px}
    .pill-list{display:flex;flex-wrap:wrap;gap:12px}
    .pill-list span{padding:9px 14px;border-radius:0;background:transparent;border:1px solid var(--line-light);font-family:'JetBrains Mono',monospace;font-size:var(--label-size);line-height:1.4;font-weight:300;letter-spacing:.08em;color:var(--ink);text-transform:uppercase}
    .slide--contents{display:grid;grid-template-columns:.78fr 1.22fr;align-items:center;gap:46px}
    .toc-label{font-family:'JetBrains Mono',monospace;font-size:var(--label-size);line-height:1.4;font-weight:300;letter-spacing:.16em;color:var(--accent);margin-bottom:28px}
    .toc-left h2{font-size:var(--content-title-size);line-height:1.13;font-weight:400;letter-spacing:0}
    .toc-sub{margin-top:28px;max-width:620px;color:var(--muted);font-size:var(--body-size);font-weight:300;line-height:1.6}
    .toc-list{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:28px 34px;min-width:0}
    .toc-item{display:grid;grid-template-columns:42px minmax(0,1fr);align-items:start;gap:16px;min-width:0}
    .toc-item span{font-family:'JetBrains Mono',monospace;font-size:var(--toc-label-size);line-height:1.4;font-weight:300;color:var(--accent)}
    .toc-item p{min-width:0;font-size:var(--toc-label-size);line-height:1.45;font-weight:300;color:var(--text);word-break:keep-all;overflow-wrap:anywhere}
    .split{display:grid;grid-template-columns:1.05fr .95fr;gap:44px;align-items:center}
    .timeline{display:grid;gap:12px}
    .timeline div{display:grid;grid-template-columns:42px 1fr;align-items:center;gap:18px;padding:15px 0;border-bottom:1px solid var(--line);font-size:var(--body-size);line-height:1.48;font-weight:300}
    .timeline span,.stage span,.question-item span{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--accent);color:#fff;font-family:'JetBrains Mono',monospace;font-size:var(--label-size);line-height:1.4;font-weight:300}
    .question-card{margin:0;padding:42px;border:1px solid var(--line);border-radius:0;background:var(--surface);display:grid;gap:24px}
    .question-card svg{width:42px;height:42px;color:var(--accent);stroke-width:2.2}
    .question-card p{font-family:'Playfair Display','Noto Serif KR',serif;font-size:var(--body-strong-size,32px);line-height:1.32;font-weight:400}
    .compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:stretch}
    .compare-card,.info-card{padding:32px;border-radius:0;background:var(--surface);border:1px solid var(--line)}
    .compare-card--accent{background:rgba(200,82,74,.12);border-color:rgba(200,82,74,.46)}
    .bullet-list{display:grid;gap:14px;margin:22px 0 0;padding:0;list-style:none}
    .bullet-list li{position:relative;padding-left:24px;color:var(--muted);font-weight:300}
    .bullet-list li::before{content:'';position:absolute;left:0;top:.72em;width:26px;height:1px;background:var(--accent)}
    .bottom-message{font-family:'Playfair Display','Noto Serif KR',serif;font-size:var(--body-strong-size,32px);line-height:1.32;font-weight:400;max-width:1180px}
    .diagnosis,.center-message{font-family:'Playfair Display','Noto Serif KR',serif;font-size:var(--section-title-size);line-height:1.18;font-weight:400;letter-spacing:0;max-width:1420px;text-wrap:balance}
    .diagnosis+.bullet-list{max-width:1180px}
    .lifecycle{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;align-items:stretch}
    .stage{display:flex;flex-direction:column;gap:18px;min-height:320px;padding:24px 18px;border-radius:0;border:1px solid var(--line-light);background:rgba(232,228,214,.62);text-align:center;align-items:center;justify-content:center}
    .stage p{font-size:var(--caption-size);line-height:1.46;color:var(--ink-muted);font-weight:300}
    .card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px;align-items:stretch}
    .info-card{background:rgba(255,255,255,.08)}
    .slide--gradient .info-card,.slide--gradient .compare-card{background:rgba(232,228,214,.64);border-color:var(--line-light);box-shadow:none}
    .info-card strong{display:block;font-family:'Playfair Display','Noto Serif KR',serif;font-size:var(--subtitle-size);line-height:1.25;font-weight:400;margin-bottom:14px}
    .info-card p{color:inherit;opacity:.72;font-weight:300}
    .chart-layout{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(280px,.55fr);gap:30px;align-items:stretch;min-height:520px}
    .chart-layout--doughnut{grid-template-columns:minmax(0,1fr) minmax(360px,.72fr);min-height:460px}
    .chart-panel{background:rgba(232,228,214,.72);border:1px solid var(--line-light);border-radius:0;padding:34px;box-shadow:none}
    .slide--black .chart-panel{background:var(--surface);border-color:var(--line);box-shadow:none}
    .chart-panel canvas{width:100%!important;height:100%!important;min-height:420px}
    .chart-panel--doughnut{display:grid;place-items:center;min-height:0}
    .chart-panel--doughnut canvas{width:100%!important;height:380px!important;min-height:0;max-height:380px}
    .chart-note{border-radius:0;padding:30px;background:var(--bg);color:var(--text);display:flex;flex-direction:column;justify-content:space-between;border:1px solid var(--line)}
    .slide--black .chart-note{background:var(--bg-light);color:var(--ink);border-color:var(--line-light)}
    .note-label{width:max-content;border-radius:0;padding:8px 12px;background:var(--accent);color:#fff;font-family:'JetBrains Mono',monospace;font-weight:300;font-size:var(--micro-size);line-height:1.4;letter-spacing:.08em}
    .chart-note p{font-family:'Playfair Display','Noto Serif KR',serif;font-size:var(--subtitle-size);font-weight:400;line-height:1.32}
    .denominator-list{display:grid;gap:13px;margin:26px 0 0;padding:0;list-style:none}
    .denominator-list li{font-size:var(--caption-size);line-height:1.48;font-weight:300;color:inherit;padding-bottom:10px;border-bottom:1px solid rgba(25,43,27,.12)}
    .tag-cloud{display:flex;flex-wrap:wrap;gap:18px;max-width:1320px}
    .tag-cloud span{font-family:'Playfair Display','Noto Serif KR',serif;font-size:var(--body-strong-size,32px);line-height:1.3;font-weight:400;padding:18px 28px;border-radius:0;background:rgba(232,228,214,.7);border:1px solid var(--line-light)}
    .question-list{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}
    .question-item{min-height:260px;padding:24px;border-radius:0;background:rgba(232,228,214,.68);border:1px solid var(--line-light);display:flex;flex-direction:column;gap:30px}
    .question-item p{font-weight:300;color:var(--ink)}
    .reveal{opacity:0;transform:translateY(20px);transition:opacity .58s var(--ease),transform .58s var(--ease);transition-delay:var(--delay,0ms)}
    .active .reveal{opacity:1;transform:translateY(0)}
    @media (max-width:900px){
      html,body{overflow:hidden}
      .slide{padding:24px}
      .split,.compare-grid,.chart-layout{grid-template-columns:1fr}
      .slide--contents,.toc-list{grid-template-columns:1fr}
      .lifecycle{grid-template-columns:repeat(2,1fr)}
      .stage{min-height:150px;border-radius:30px}
      .question-list{grid-template-columns:1fr}
      .chart-layout{min-height:0}
      .chart-panel canvas{min-height:300px}
    }
    @media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
  </style>
</head>
<body>
  <main class="deck" id="deck">
    ${slidesHtml}
  </main>
  <script>
    const chartConfigs = ${chartConfigsJson};
    const slides = [...document.querySelectorAll('.slide')];
    let current = Math.max(0, Math.min(slides.length - 1, (Number(location.hash.replace('#','')) || 1) - 1));
    const chartInstances = new Map();

    function show(index) {
      current = Math.max(0, Math.min(slides.length - 1, index));
      slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
      location.hash = String(current + 1);
      renderCharts(slides[current]);
    }

    function renderCharts(slide) {
      slide.querySelectorAll('canvas[data-chart-key]').forEach((canvas) => {
        const key = canvas.dataset.chartKey;
        if (chartInstances.has(canvas.id) || !window.Chart) return;
        const cfg = chartConfigs[key];
        const isDark = slide.classList.contains('slide--black');
        const textColor = isDark ? '#d4cfbf' : '#192b1b';
        const gridColor = isDark ? 'rgba(212,207,191,.14)' : 'rgba(25,43,27,.12)';
        const chart = new Chart(canvas, {
          type: cfg.type,
          data: {
            labels: cfg.data.labels,
            datasets: cfg.data.datasets.map((dataset, i) => ({
              ...dataset,
              backgroundColor: cfg.type === 'doughnut'
                ? ['#c8524a', '#d4cfbf', 'rgba(212,207,191,.5)', 'rgba(212,207,191,.25)']
                : i === 0 ? '#c8524a' : 'rgba(212,207,191,.2)',
              borderColor: cfg.type === 'doughnut' ? '#192b1b' : '#c8524a',
              borderWidth: cfg.type === 'doughnut' ? 2 : 0,
              borderRadius: 8,
              barThickness: 24,
            })),
          },
          options: {
            ...cfg.options,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              ...(cfg.options?.plugins || {}),
              legend: { ...(cfg.options?.plugins?.legend || {}), labels: { color: textColor, font: { family: 'Jost, Noto Sans KR', size: 14, weight: '300' } } },
            },
            scales: cfg.type === 'doughnut' ? undefined : {
              x: { ...(cfg.options?.scales?.x || {}), grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Jost, Noto Sans KR', weight: '300' } } },
              y: { ...(cfg.options?.scales?.y || {}), grid: { display: false }, ticks: { color: textColor, font: { family: 'Jost, Noto Sans KR', weight: '300', size: 13 } } },
            },
          },
          plugins: cfg.type === 'doughnut' ? [{
            id: 'centerLabel',
            afterDraw(chart) {
              const { ctx, chartArea } = chart;
              ctx.save();
              ctx.fillStyle = textColor;
              ctx.font = '400 30px Playfair Display';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(cfg.centerLabel || '', (chartArea.left + chartArea.right) / 2, (chartArea.top + chartArea.bottom) / 2);
              ctx.restore();
            },
          }] : [],
        });
        chartInstances.set(canvas.id, chart);
      });
    }

    window.addEventListener('keydown', (event) => {
      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) show(current + 1);
      if (['ArrowLeft', 'PageUp'].includes(event.key)) show(current - 1);
      if (event.key === 'Home') show(0);
      if (event.key === 'End') show(slides.length - 1);
    });
    window.addEventListener('hashchange', () => show((Number(location.hash.replace('#','')) || 1) - 1));
    document.addEventListener('click', () => show(current + 1));
    let touchStart = 0;
    window.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
    window.addEventListener('touchend', (event) => {
      const delta = event.changedTouches[0].clientX - touchStart;
      if (Math.abs(delta) > 50) show(current + (delta < 0 ? 1 : -1));
    }, { passive: true });
    if (window.lucide) window.lucide.createIcons();
    show(current);
  </script>
</body>
</html>`;

fs.writeFileSync(outPath, html);
console.log(outPath);
