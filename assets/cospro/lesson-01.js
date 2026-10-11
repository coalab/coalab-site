/*
 * COS Pro 2급 파이썬 스터디 — 1회차 문제 데이터
 * 화면(player.js)과 분리된 순수 데이터 파일입니다. 나중에 교재 원고로 옮길 때도 이 파일만 쓰면 됩니다.
 * 새 회차는 lesson-02.js … 처럼 같은 형식으로 추가하세요.
 */
window.COSPRO_LESSONS = window.COSPRO_LESSONS || {};
window.COSPRO_LESSONS[1] = {
  n: 1,
  title: '수학 규칙을 파이썬으로 바꾸는 시간',
  eyebrow: '알고리즘을 읽는 연습',
  summary: '문제 해석 → 손 계산 → 변수 설계 → 코드 작성 → 경계값 확인.\n정답을 보기 전에 작은 예제를 직접 풀어보세요.',
  pill: 'PYTHON · 120 MIN',
  disclaimer: 'COS Pro 2급 대비 창작 연습문제 · 공식 기출 아님',
  schedule: [
    ['00–10분', '풀이 방법 안내 · 예제 추적'],
    ['10–50분', '문제 1–4 · 기본 연산과 리스트'],
    ['50–55분', '쉬는 시간'],
    ['55–90분', '문제 5–7 · 규칙과 오류 수정'],
    ['90–105분', '문제 8 · 미니 실전'],
    ['105–120분', '오답 분석 · 다시 풀기']
  ],
  review: {
    title: '마지막 15분, 오답을 내 것으로',
    checklist: [
      '틀린 예제를 손으로 계산하고 변수 변화 표를 썼다.',
      '실수를 조건 / 범위 / 초기값 / 인덱스 / 누적 순서 중 하나로 분류했다.',
      '해설을 닫고 틀린 문제를 다시 작성했다.'
    ]
  },
  teacherGuide: [
    '도입 10분: 문제 1의 23개를 5개씩 묶는 그림을 보여주고, 학생이 몫과 나머지를 말하게 합니다. 각 문제는 2분 손 계산 → 개별 작성 → 짝 설명 → 테스트 확인 순서로 진행하세요. 작성이 막히면 전체 정답 대신 힌트만 열어 줍니다. 문제 8은 먼저 힌트 없이 10분 동안 풀고 마지막 5분에 테스트와 풀이를 점검합니다. 정답 여부뿐 아니라 왜 해당 조건·초기값을 선택했는지 설명할 수 있는지 확인하세요.',
    '외부 Python 환경에서 코드를 실행합니다. 이 페이지는 Python 실행이나 자동 채점 기능을 제공하지 않습니다. 완료 표시는 스스로 확인한 학습 기록입니다.'
  ],
  questions: [
    {
      title: '묶음 수와 남은 개수',
      kind: '워밍업',
      minutes: 8,
      body: '사탕 n개를 한 봉지에 k개씩 넣습니다. 완성된 봉지 수와 남은 사탕 수를 리스트로 반환하세요. n은 0 이상, k는 1 이상입니다.',
      examples: 'n=23, k=5 → [4, 3]',
      code: `def solution(n, k):
    return [____, ____]`,
      hint: '몫은 //, 나머지는 %입니다. 나눗셈 /는 실수를 반환합니다.',
      answer: `def solution(n, k):
    return [n // k, n % k]`,
      explain: '23 = 5 × 4 + 3입니다. 먼저 손으로 묶음을 그려 보고 몫과 나머지의 역할을 구분합니다.',
      tests: `solution(0, 5) → [0, 0]
solution(20, 5) → [4, 0]
solution(23, 5) → [4, 3]`
    },
    {
      title: '조건에 맞는 수의 합',
      kind: '빈칸 완성',
      minutes: 10,
      body: '1부터 n까지의 정수 중 3의 배수이면서 2의 배수가 아닌 수의 합을 반환하세요. n은 1 이상 1000 이하입니다.',
      examples: 'n=15 → 27 (3 + 9 + 15)',
      code: `def solution(n):
    total = 0
    for x in range(1, ____):
        if ____:
            total += x
    return total`,
      hint: '끝값 n을 포함하려면 range의 끝은 n+1입니다. 두 조건은 and로 연결합니다.',
      answer: `def solution(n):
    total = 0
    for x in range(1, n + 1):
        if x % 3 == 0 and x % 2 != 0:
            total += x
    return total`,
      explain: '후보를 1개씩 확인 → 조건 판단 → 합에 추가합니다. or를 쓰면 한 조건만 맞아도 포함되는 오류가 생깁니다.',
      tests: `solution(1) → 0
solution(6) → 3
solution(15) → 27`
    },
    {
      title: '자릿수 합 구하기',
      kind: '빈칸 완성',
      minutes: 12,
      body: '0 이상 999999 이하 정수 n의 각 자릿수를 더한 값을 반환하세요. 문자열 변환 없이 몫과 나머지를 사용해 봅니다.',
      examples: 'n=4072 → 13',
      code: `def solution(n):
    total = 0
    while n > 0:
        total += ____
        n = ____
    return total`,
      hint: 'n % 10으로 마지막 숫자를 얻고 n // 10으로 마지막 숫자를 제거합니다.',
      answer: `def solution(n):
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total`,
      explain: '4072 → 407 → 40 → 4 → 0 순서로 줄어듭니다. 더하는 숫자는 2, 7, 0, 4입니다. 입력 0은 반복하지 않아 합 0이 됩니다.',
      tests: `solution(0) → 0
solution(1000) → 1
solution(4072) → 13`
    },
    {
      title: '가장 큰 값과 작은 값의 차이',
      kind: '오류 수정',
      minutes: 10,
      body: '길이 1 이상인 정수 리스트 nums에서 최댓값과 최솟값의 차이를 반환해야 합니다. 모든 원소가 음수여도 동작하도록 초기값 두 줄을 수정하세요.',
      examples: 'nums=[-8, -3, -10] → 7',
      code: `def solution(nums):
    largest = 0  # 수정
    smallest = 0  # 수정
    for x in nums:
        if x > largest:
            largest = x
        if x < smallest:
            smallest = x
    return largest - smallest`,
      hint: '0이 리스트에 없을 수도 있습니다. 실제 첫 원소를 기준으로 출발하세요.',
      answer: `def solution(nums):
    largest = nums[0]
    smallest = nums[0]
    for x in nums:
        if x > largest:
            largest = x
        if x < smallest:
            smallest = x
    return largest - smallest`,
      explain: '음수 리스트에서 largest=0은 갱신되지 않습니다. 초기값은 데이터 범위에 맞아야 합니다. max(nums)-min(nums)도 같은 결과를 만듭니다.',
      tests: `solution([-8, -3, -10]) → 7
solution([5]) → 0
solution([2, 7, 4]) → 5`
    },
    {
      title: '매일 늘어나는 저축',
      kind: '직접 작성',
      minutes: 12,
      body: '첫날 a원을 저축하고, 다음 날부터 전날보다 d원씩 더 저축합니다. n일 동안의 총액을 반환하세요. a와 d는 0 이상, n은 1 이상 100 이하입니다. 공식을 외우지 않고 반복문으로 해결하세요.',
      examples: 'a=100, d=50, n=4 → 700',
      code: `def solution(a, d, n):
    # 오늘 저축액과 누적 합을 구분하세요.
    pass`,
      hint: '오늘 금액을 먼저 합계에 더한 다음 d만큼 증가시킵니다.',
      answer: `def solution(a, d, n):
    today = a
    total = 0
    for _ in range(n):
        total += today
        today += d
    return total`,
      explain: '날짜별 저축액은 100, 150, 200, 250입니다. 증가를 먼저 하면 첫날 150원이 되어 결과가 달라집니다.',
      tests: `solution(100, 50, 1) → 100
solution(100, 0, 3) → 300
solution(100, 50, 4) → 700`
    },
    {
      title: '연속 성공 최고 기록',
      kind: '빈칸 완성',
      minutes: 13,
      body: '0과 1로 이루어진 기록 records에서 1이 연속으로 나온 가장 긴 길이를 반환하세요. 빈 리스트도 입력될 수 있습니다.',
      examples: 'records=[1,1,0,1,1,1,0] → 3',
      code: `def solution(records):
    current = 0
    best = 0
    for x in records:
        if x == 1:
            current += 1
            best = ____
        else:
            current = ____
    return best`,
      hint: '현재 연속 길이와 지금까지 최고 길이는 별도 변수입니다. 실패하면 현재 길이만 0으로 바꿉니다.',
      answer: `def solution(records):
    current = 0
    best = 0
    for x in records:
        if x == 1:
            current += 1
            best = max(best, current)
        else:
            current = 0
    return best`,
      explain: 'current는 1,2,0,1,2,3,0으로 바뀝니다. best는 마지막 실패 뒤에도 3을 유지합니다.',
      tests: `solution([]) → 0
solution([0,0]) → 0
solution([1,1,1]) → 3
solution([1,1,0,1,1,1,0]) → 3`
    },
    {
      title: '회문 검사 고치기',
      kind: '오류 수정',
      minutes: 10,
      body: '영문 소문자로 이루어진 길이 1 이상 문자열 s가 앞뒤로 같으면 True, 다르면 False를 반환합니다. 인덱스 계산 한 줄을 수정하세요.',
      examples: 's="level" → True / s="ab" → False',
      code: `def solution(s):
    for i in range(len(s) // 2):
        if s[i] != s[len(s) - i]:  # 수정
            return False
    return True`,
      hint: '길이 5인 문자열의 마지막 인덱스는 4입니다. 왼쪽 0과 오른쪽 4를 비교합니다.',
      answer: `def solution(s):
    for i in range(len(s) // 2):
        if s[i] != s[len(s) - 1 - i]:
            return False
    return True`,
      explain: '오른쪽 인덱스는 길이-1-i입니다. 원래 코드는 i=0에서 범위를 벗어납니다. 가운데 문자는 자신과 비교할 필요가 없습니다.',
      tests: `solution("a") → True
solution("abba") → True
solution("ab") → False`
    },
    {
      title: '재시험 대상 찾기',
      kind: '미니 실전 · 직접 작성',
      minutes: 15,
      body: '점수 리스트 scores에서 60점 미만인 학생의 번호를 오름차순으로 반환하세요. 번호는 1부터 시작합니다. scores는 빈 리스트일 수 있고, 점수는 0 이상 100 이하입니다.',
      examples: 'scores=[80,59,60,40] → [2,4]',
      code: `def solution(scores):
    pass`,
      hint: '인덱스는 0부터, 학생 번호는 1부터입니다. 60점은 재시험 대상이 아닙니다.',
      answer: `def solution(scores):
    answer = []
    for i in range(len(scores)):
        if scores[i] < 60:
            answer.append(i + 1)
    return answer`,
      explain: '조건의 경계는 60입니다. <=60으로 쓰거나 i를 그대로 넣는 실수가 흔합니다. 리스트를 앞에서부터 읽으면 번호는 이미 오름차순입니다.',
      tests: `solution([]) → []
solution([60,59]) → [2]
solution([80,59,60,40]) → [2,4]`
    }
  ]
};
