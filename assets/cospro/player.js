/*
 * COS Pro 2급 스터디 — 회차 플레이어
 * <body data-lesson="N"> 인 페이지에서 window.COSPRO_LESSONS[N] 데이터를 읽어 문제 화면을 만듭니다.
 * 답안·메모·완료 표시는 이 브라우저(localStorage)에만 저장됩니다.
 */
(function () {
  'use strict';

  var root = document.getElementById('cp-root');
  var n = parseInt(document.body.getAttribute('data-lesson'), 10);
  var L = window.COSPRO_LESSONS && window.COSPRO_LESSONS[n];
  if (!root) return;
  if (!L) {
    root.innerHTML = '<div class="cp-panel"><p>문제 데이터를 불러오지 못했습니다. 페이지를 새로 고침해 주세요.</p></div>';
    return;
  }

  var Q = L.questions;
  var KEY = 'coalab-cospro-L' + String(n).padStart(2, '0');
  var index = 0;
  var state = {};
  var seconds = Q[0].minutes * 60;
  var running = false;
  var timerId = null;

  try { state = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { state = {}; }
  if (!state.q) state.q = {};
  if (!state.review) state.review = {};

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function nl(s) { return esc(s).replace(/\n/g, '<br>'); }
  function $(id) { return document.getElementById(id); }

  var saveFailed = false;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) {
      saveFailed = true;
      var st = $('cp-status');
      if (st) st.textContent = '저장 공간을 사용할 수 없습니다. 답안을 복사해 보관하세요.';
    }
  }
  function qs(i) { return state.q[i] || {}; }
  function setQ(i, patch) { state.q[i] = Object.assign({}, state.q[i] || {}, patch); save(); }

  /* ---------- 고정 영역(히어로·레이아웃·마무리) ---------- */
  var seriesHtml = (function () {
    var list = (window.COSPRO_SERIES && window.COSPRO_SERIES.lessons) || [];
    var prev = list.filter(function (x) { return x.n === n - 1; })[0];
    var next = list.filter(function (x) { return x.n === n + 1; })[0];
    return '<div class="cp-series">' +
      (prev ? '<a class="cp-btn" href="' + esc(prev.file) + '">← ' + prev.n + '회차 ' + esc(prev.title) + '</a>' : '<span></span>') +
      '<a class="cp-btn" href="cos-pro.html">전체 회차 보기</a>' +
      (next ? '<a class="cp-btn primary" href="' + esc(next.file) + '">' + next.n + '회차 ' + esc(next.title) + ' →</a>' : '<span class="cp-note">다음 회차는 준비 중입니다.</span>') +
      '</div>';
  })();

  root.innerHTML =
    '<div class="cp-crumb"><a href="cos-pro.html">COS Pro 2급 스터디</a> › ' + n + '회차</div>' +
    '<div class="cp-hero">' +
      '<div>' +
        '<div class="cp-eyebrow">' + esc(L.eyebrow) + '</div>' +
        '<h1>' + esc(L.title) + '</h1>' +
        '<p>' + nl(L.summary) + '</p>' +
        '<span class="cp-pill">' + esc(L.pill) + '</span>' +
        '<span class="cp-pill">' + esc(L.disclaimer) + '</span>' +
      '</div>' +
      '<div class="cp-panel cp-schedule"><b>오늘의 수업 흐름</b>' +
        L.schedule.map(function (r) { return '<div class="cp-row"><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></div>'; }).join('') +
      '</div>' +
    '</div>' +
    '<div class="cp-layout">' +
      '<aside class="cp-panel cp-side" aria-label="문제 목록">' +
        '<b>' + Q.length + '개의 연습 문제</b>' +
        '<p id="cp-ptext" class="cp-note"></p>' +
        '<div class="cp-progress"><div id="cp-bar"></div></div>' +
        '<div id="cp-list" class="cp-list"></div>' +
        '<hr><b>집중 타이머</b>' +
        '<div id="cp-clock" class="cp-timer" aria-live="off"></div>' +
        '<div class="cp-actions" style="margin-top:0"><button class="cp-btn" id="cp-timer" type="button">시작</button><button class="cp-btn" id="cp-reset" type="button">다시</button></div>' +
        '<p class="cp-note">답안·메모·완료 표시는 이 브라우저에 저장됩니다.</p>' +
      '</aside>' +
      '<article class="cp-panel cp-q" id="cp-q"></article>' +
    '</div>' +
    '<div class="cp-panel cp-review">' +
      '<h2>' + esc(L.review.title) + '</h2>' +
      '<div class="cp-check">' +
        L.review.checklist.map(function (t, i) {
          return '<label><input type="checkbox" data-rv="' + i + '"' + (state.review[i] ? ' checked' : '') + '> <span>' + esc(t) + '</span></label>';
        }).join('') +
      '</div>' +
      '<details><summary>강사용 진행 가이드</summary>' +
        L.teacherGuide.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
      '</details>' +
    '</div>' +
    seriesHtml;

  Array.prototype.forEach.call(root.querySelectorAll('[data-rv]'), function (el) {
    el.addEventListener('change', function () {
      state.review[el.getAttribute('data-rv')] = el.checked;
      save();
    });
  });

  /* ---------- 문제 화면 ---------- */
  function renderList() {
    $('cp-list').innerHTML = Q.map(function (x, i) {
      var done = qs(i).done;
      return '<button type="button" data-i="' + i + '" class="' + (i === index ? 'active' : '') + '"' + (i === index ? ' aria-current="true"' : '') + '>' +
        (done ? '✓' : String(i + 1).padStart(2, '0')) + ' ' + esc(x.title) +
        '<small>' + esc(x.kind) + ' · ' + x.minutes + '분</small></button>';
    }).join('');
    Array.prototype.forEach.call($('cp-list').querySelectorAll('button'), function (b) {
      b.addEventListener('click', function () { select(parseInt(b.getAttribute('data-i'), 10)); });
    });
    var done = Q.filter(function (_, i) { return qs(i).done; }).length;
    $('cp-ptext').textContent = '완료 ' + done + ' / ' + Q.length + ' · 자신의 속도로 풀어보세요';
    $('cp-bar').style.width = (done / Q.length * 100) + '%';
  }

  function renderQuestion() {
    var q = Q[index];
    var s = qs(index);
    var code = (s.code !== undefined) ? s.code : q.code;
    $('cp-q').innerHTML =
      '<span class="cp-tag">문제 ' + (index + 1) + ' · ' + esc(q.kind) + ' · ' + q.minutes + '분</span>' +
      '<h2>' + esc(q.title) + '</h2>' +
      '<p>' + esc(q.body) + '</p>' +
      '<b>입력과 출력 예시</b><pre>' + esc(q.examples) + '</pre>' +
      '<h3>먼저 생각하기</h3>' +
      '<p class="cp-note">무엇을 입력받고 반환하나요? 어떤 값을 기억해야 하나요? 예제를 손으로 계산한 뒤 아래에 메모하세요.</p>' +
      '<textarea id="cp-memo" class="memo" placeholder="예: 현재 숫자 / 합계 / 반복을 멈추는 조건">' + esc(s.memo || '') + '</textarea>' +
      '<h3>내 풀이</h3>' +
      '<p class="cp-note">아래 코드를 완성하고 Python 편집기에 복사해 실행하세요.</p>' +
      '<textarea id="cp-code" spellcheck="false">' + esc(code) + '</textarea>' +
      '<div class="cp-actions">' +
        '<button class="cp-btn" id="cp-copy" type="button">내 코드 복사</button>' +
        '<label><input id="cp-done" type="checkbox"' + (s.done ? ' checked' : '') + '> 테스트 확인 완료</label>' +
        '<span id="cp-status" class="cp-status" role="status"></span>' +
      '</div>' +
      '<details><summary>힌트 보기</summary><p>' + esc(q.hint) + '</p></details>' +
      '<details><summary>테스트 예시 확인</summary><pre>' + esc(q.tests) + '</pre><p class="cp-note">일반 입력과 경계값을 모두 확인하세요.</p></details>' +
      '<details class="cp-sol"><summary>정답과 풀이 열기</summary><pre>' + esc(q.answer) + '</pre><p>' + esc(q.explain) + '</p><p class="cp-note">다른 코드도 조건과 테스트를 만족하면 올바른 풀이입니다.</p></details>' +
      '<div class="cp-actions">' +
        '<button class="cp-btn" id="cp-prev" type="button"' + (index === 0 ? ' disabled' : '') + '>이전 문제</button>' +
        '<button class="cp-btn primary" id="cp-next" type="button"' + (index === Q.length - 1 ? ' disabled' : '') + '>다음 문제 →</button>' +
      '</div>';

    $('cp-memo').addEventListener('input', function (e) { setQ(index, { memo: e.target.value }); });
    $('cp-code').addEventListener('input', function (e) { setQ(index, { code: e.target.value }); });
    $('cp-done').addEventListener('change', function (e) { setQ(index, { done: e.target.checked }); renderList(); });
    $('cp-copy').addEventListener('click', copyCode);
    $('cp-prev').addEventListener('click', function () { select(Math.max(0, index - 1)); });
    $('cp-next').addEventListener('click', function () { select(Math.min(Q.length - 1, index + 1)); });
    if (saveFailed) $('cp-status').textContent = '저장 공간을 사용할 수 없습니다. 답안을 복사해 보관하세요.';
  }

  function copyCode() {
    var ta = $('cp-code');
    var st = $('cp-status');
    function fallback() { ta.select(); st.textContent = '선택된 코드를 Ctrl+C로 복사하세요.'; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ta.value).then(function () { st.textContent = '코드를 복사했습니다.'; }, fallback);
    } else { fallback(); }
  }

  /* ---------- 타이머 ---------- */
  function clock() {
    $('cp-clock').textContent = String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
  }
  function stopTimer() { running = false; clearInterval(timerId); $('cp-timer').textContent = '시작'; }
  function select(i) {
    index = i;
    stopTimer();
    seconds = Q[i].minutes * 60;
    clock();
    renderList();
    renderQuestion();
  }
  $('cp-timer').addEventListener('click', function () {
    running = !running;
    $('cp-timer').textContent = running ? '일시정지' : '시작';
    clearInterval(timerId);
    if (running) {
      timerId = setInterval(function () {
        if (seconds > 0) { seconds--; }
        else { running = false; clearInterval(timerId); $('cp-timer').textContent = '완료'; }
        clock();
      }, 1000);
    }
  });
  $('cp-reset').addEventListener('click', function () { select(index); });

  select(0);
})();
