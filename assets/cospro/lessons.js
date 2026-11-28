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
    },
    {
      n: 7,
      file: 'cos-pro-07.html',
      title: '실전처럼 풀어 보는 모의고사 시간',
      topic: '짝수의 합 · 회문 · 윤년 · 모음 세기 · 완전수 · 단어 빈도 · 대각선 합 · 괄호 검사 · 이진수 연속 1',
      minutes: 60,
      count: 10,
      locked: false
    },
    {
      n: 8,
      file: 'cos-pro-08.html',
      title: 'COS Pro 2급 예상문제 1세트',
      topic: '숫자 기본 · 3의 배수의 합 · 자릿수의 합 · 팩토리얼 · 최대공약수 · 소수 판별 오류 수정 외',
      minutes: 60,
      count: 10,
      locked: false
    },
    {
      n: 9,
      file: 'cos-pro-09.html',
      title: 'COS Pro 2급 예상문제 2세트',
      topic: '문자열 · 단어 개수 세기 · 대문자 개수 · 가장 긴 단어의 길이 · 모음 제거 · 대소문자 바꾸기 오류 수정 외',
      minutes: 60,
      count: 10,
      locked: false
    },
    {
      n: 10,
      file: 'cos-pro-10.html',
      title: 'COS Pro 2급 예상문제 3세트',
      topic: '리스트 · 최댓값의 위치 · 평균 이상 개수 · 짝수 번째 원소의 합 · 리스트 왼쪽으로 돌리기 · 가장 작은 두 수의 합 오류 수정 외',
      minutes: 60,
      count: 10,
      locked: false
    },
    {
      n: 11,
      file: 'cos-pro-11.html',
      title: 'COS Pro 2급 예상문제 4세트',
      topic: '딕셔너리·집합 · 서로 다른 수의 개수 · 최고 점수 학생 · 키와 값 뒤집기 · 평균이 가장 높은 학생 · 재고 정리 오류 수정 외',
      minutes: 60,
      count: 10,
      locked: false
    },
    {
      n: 12,
      file: 'cos-pro-12.html',
      title: 'COS Pro 2급 예상문제 5세트',
      topic: '2차원 리스트 · 모든 원소의 합 · 행별 합 · 열별 합 · 최댓값의 위치 · 전치 행렬 오류 수정 외',
      minutes: 60,
      count: 10,
      locked: false
    },
    {
      n: 13,
      file: 'cos-pro-13.html',
      title: 'COS Pro 2급 예상문제 6세트',
      topic: '탐색·정렬·재귀 · 마지막으로 나온 위치 · 오름차순인지 확인 · 1부터 n까지의 합 (재귀) · 거듭제곱 (재귀) · 버블 정렬 한 번 오류 수정 외',
      minutes: 60,
      count: 10,
      locked: false
    },
    {
      n: 14,
      file: 'cos-pro-14.html',
      title: 'COS Pro 2급 예상문제 7세트',
      topic: '날짜·시간 · 시간을 초로 바꾸기 · 초를 시:분:초로 바꾸기 · 1년 중 몇 번째 날 · 두 시각 사이의 분 · 윤년 개수 오류 수정 외',
      minutes: 60,
      count: 10,
      locked: false
    },
    {
      n: 15,
      file: 'cos-pro-15.html',
      title: 'COS Pro 2급 예상문제 8세트',
      topic: '스택·큐·패턴 · 스택으로 문자열 뒤집기 · 카드 버리기 · 별 삼각형 · 구구단 한 단 · 괄호의 최대 깊이 오류 수정 외',
      minutes: 60,
      count: 10,
      locked: false
    },
    {
      n: 16,
      file: 'cos-pro-16.html',
      title: 'COS Pro 2급 예상문제 9세트',
      topic: '게임·생활 로직 · 가위바위보 · 학점 계산 · 주차 요금 · 로또 등수 · 숫자 야구 오류 수정 외',
      minutes: 60,
      count: 10,
      locked: false
    },
    {
      n: 17,
      file: 'cos-pro-17.html',
      title: 'COS Pro 2급 예상문제 10세트',
      topic: '종합 마무리 · 연속 합이 n 이하인 최대 개수 · 한 칸 건너 읽기 · 두 수 사이의 합 · 가장 가까운 수 · 단어별 뒤집기 오류 수정 외',
      minutes: 60,
      count: 10,
      locked: false
    }
  ]
};
