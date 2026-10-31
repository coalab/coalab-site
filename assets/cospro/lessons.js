/*
 * COS Pro 2급 파이썬 스터디 — 회차 목록
 * 새 회차를 공개할 때 아래 lessons 배열에 한 줄만 추가하면 목록 페이지와 이전/다음 회차 링크에 반영됩니다.
 * locked: true 인 회차는 접근 코드가 있어야 열립니다(문제는 암호화되어 assets/cospro/locked/ 에 있습니다).
 * 제목과 주제는 안내용으로 공개됩니다.
 */
window.COSPRO_SERIES = {
  title: 'COS Pro 2급 파이썬 스터디',
  lessons: [
    {
      n: 1,
      file: 'cos-pro-01.html',
      title: '수학 규칙을 파이썬으로 바꾸는 시간',
      topic: '기본 연산 · 반복문 · 리스트 · 경계값',
      minutes: 120,
      count: 8,
      locked: false
    },
    {
      n: 2,
      file: 'cos-pro-02.html',
      title: '글자와 기록을 세고 정리하는 시간',
      topic: '문자열 · 딕셔너리 · 개수 세기 · 동률 처리',
      minutes: 120,
      count: 8,
      locked: true
    },
    {
      n: 3,
      file: 'cos-pro-03.html',
      title: '날짜와 숫자의 규칙을 찾는 시간',
      topic: '윤년 · 날짜 계산 · 요일 · 제곱수 · 한 번만 나오는 숫자',
      minutes: 120,
      count: 8,
      locked: true
    },
    {
      n: 4,
      file: 'cos-pro-04.html',
      title: '리스트를 분석하고 규칙을 찾는 시간',
      topic: '최댓값·최솟값 · 중복 제거 · 평균 비교 · 구간 합 · 회전 · 두 수의 합',
      minutes: 120,
      count: 8,
      locked: false
    },
    {
      n: 5,
      file: 'cos-pro-05.html',
      title: '표와 격자를 읽고 다루는 시간',
      topic: '2차원 리스트 · 행·열 합 · 대각선 · 행열 바꾸기 · 테두리 · 주변 칸 탐색 · 회전 · 구역 합',
      minutes: 120,
      count: 8,
      locked: false
    },
    {
      n: 6,
      file: 'cos-pro-06.html',
      title: '알맞은 도구를 골라 빠르게 푸는 시간',
      topic: '소수 · 괄호 검사 · 누적 합 · 이진 탐색 · 계단 오르기 · 투 포인터 · 최대 연속 부분합 · 슬라이딩 윈도우',
      minutes: 120,
      count: 8,
      locked: false
    }
  ]
};
