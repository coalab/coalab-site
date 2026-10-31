/*
 * COS Pro 2급 파이썬 스터디 — 5회차 문제 데이터
 * 화면(player.js)과 분리된 순수 데이터 파일입니다. 나중에 교재 원고로 옮길 때도 이 파일만 쓰면 됩니다.
 */
window.COSPRO_LESSONS = window.COSPRO_LESSONS || {};
window.COSPRO_LESSONS[5] = {
  n: 5,
  title: '표와 격자를 읽고 다루는 시간',
  eyebrow: '2차원 리스트를 읽는 연습',
  summary: '격자 그리기 → 행·열 번호 짚기 → 반복 범위 정하기 → 경계 확인.\n정답을 보기 전에 작은 격자를 직접 그려 보세요.',
  pill: 'PYTHON · 120 MIN',
  disclaimer: 'COS Pro 2급 대비 창작 연습문제 · 공식 기출 아님',
  schedule: [
    ['00–10분', '풀이 방법 안내 · 격자 위치 읽기'],
    ['10–50분', '문제 1–4 · 행·열·대각선·테두리'],
    ['50–55분', '쉬는 시간'],
    ['55–90분', '문제 5–7 · 주변 탐색·회전·오류 수정'],
    ['90–105분', '문제 8 · 미니 실전'],
    ['105–120분', '오답 분석 · 다시 풀기']
  ],
  review: {
    title: '마지막 15분, 오답을 내 것으로',
    checklist: [
      '틀린 예제의 격자를 직접 그리고 칸의 행·열 번호를 짚어 가며 계산했다.',
      '실수를 조건 / 범위 / 초기값 / 인덱스 / 누적 순서 중 하나로 분류했다.',
      '해설을 닫고 틀린 문제를 다시 작성했다.'
    ]
  },
  teacherGuide: [
    '도입 10분: 3×3 격자를 칠판에 그리고 grid[1][2]가 어느 칸인지 학생이 직접 가리키게 합니다. 행 번호가 먼저, 열 번호가 나중이라는 점을 고정한 뒤 시작하세요. 각 문제는 2분 손 계산 → 개별 작성 → 짝 설명 → 테스트 확인 순서로 진행하고, 막히면 전체 정답 대신 힌트만 열어 줍니다. 문제 6은 문제 3의 풀이에서 무엇을 바꿨는지 설명하게 하세요. 문제 8은 먼저 힌트 없이 10분 동안 풀고 마지막 5분에 테스트와 풀이를 점검합니다. 정답 여부뿐 아니라 왜 해당 범위·초기값을 선택했는지 설명할 수 있는지 확인하세요.',
    '외부 Python 환경에서 코드를 실행합니다. 이 페이지는 Python 실행이나 자동 채점 기능을 제공하지 않습니다. 완료 표시는 스스로 확인한 학습 기록입니다.'
  ],
  questions: [
    {
      title: '행별 합 중 가장 큰 값',
      kind: '워밍업',
      minutes: 8,
      body: '2차원 리스트 grid의 각 행(가로줄)의 합을 구하고, 그중 가장 큰 값을 반환하세요. 행은 1개 이상이고 모든 행의 길이가 같으며, 음수도 포함될 수 있습니다.',
      examples: 'grid=[[1, 2, 3], [4, 5, 6], [0, 1, 2]] → 15',
      code: `def solution(grid):
    best = sum(grid[0])
    for row in grid:
        total = ____
        if total > best:
            best = ____
    return best`,
      hint: 'sum(row)로 한 행의 합을 구합니다. 지금까지의 최댓값보다 큰 합을 만나면 best를 바꿉니다.',
      answer: `def solution(grid):
    best = sum(grid[0])
    for row in grid:
        total = sum(row)
        if total > best:
            best = total
    return best`,
      explain: '행마다 합을 구해 최댓값과 비교합니다. 모든 합이 음수일 수도 있으니 best를 0이 아니라 첫 행의 합으로 시작합니다.',
      tests: `solution([[5]]) → 5
solution([[-1, -2], [-3, -4]]) → -3
solution([[1, 1], [1, 1], [2, 0]]) → 2`
    },
    {
      title: '두 대각선 합의 차이',
      kind: '빈칸 완성',
      minutes: 10,
      body: 'n × n 정사각형 2차원 리스트 grid에서 왼쪽 위 → 오른쪽 아래 대각선의 합과 오른쪽 위 → 왼쪽 아래 대각선의 합을 구하고, 두 합의 차이(절댓값)를 반환하세요. n은 1 이상입니다.',
      examples: 'grid=[[2, 0, 9], [1, 5, 3], [4, 6, 7]] → 4',
      code: `def solution(grid):
    n = len(grid)
    first = 0
    second = 0
    for i in range(n):
        first += grid[i][____]
        second += grid[i][____]
    return abs(first - second)`,
      hint: '두 번째 대각선은 행이 내려갈수록 열 번호가 줄어듭니다. 마지막 열 번호는 n - 1입니다.',
      answer: `def solution(grid):
    n = len(grid)
    first = 0
    second = 0
    for i in range(n):
        first += grid[i][i]
        second += grid[i][n - 1 - i]
    return abs(first - second)`,
      explain: '첫 번째 대각선은 (i, i), 두 번째 대각선은 (i, n-1-i) 칸입니다. 예제에서 2+5+7=14, 9+5+4=18이므로 차이는 4입니다. 두 합의 크기를 알 수 없어 abs()로 절댓값을 구합니다.',
      tests: `solution([[1]]) → 0
solution([[1, 2], [3, 4]]) → 0
solution([[1, 2], [3, 9]]) → 5`
    },
    {
      title: '행과 열 바꾸기',
      kind: '빈칸 완성',
      minutes: 12,
      body: '직사각형 모양의 2차원 리스트 grid의 행과 열을 서로 바꾼 새 2차원 리스트를 반환하세요. 원래 grid[r][c]에 있던 값이 결과의 [c][r] 위치에 오면 됩니다. 행과 열은 각각 1개 이상입니다.',
      examples: 'grid=[[1, 2, 3], [4, 5, 6]] → [[1, 4], [2, 5], [3, 6]]',
      code: `def solution(grid):
    rows = len(grid)
    cols = len(grid[0])
    answer = []
    for c in range(____):
        new_row = []
        for r in range(____):
            new_row.append(grid[____][____])
        answer.append(new_row)
    return answer`,
      hint: '결과의 행 수는 원래의 열 수입니다. 열 하나를 읽을 때마다 새 리스트를 만들어 answer에 붙입니다.',
      answer: `def solution(grid):
    rows = len(grid)
    cols = len(grid[0])
    answer = []
    for c in range(cols):
        new_row = []
        for r in range(rows):
            new_row.append(grid[r][c])
        answer.append(new_row)
    return answer`,
      explain: '결과의 i번째 행은 원래의 i번째 열입니다. 바깥 반복은 열 번호 c, 안쪽 반복은 행 번호 r로 돌리며 grid[r][c]를 읽습니다. 2행 3열이 3행 2열이 되는 것을 손으로 먼저 확인하세요.',
      tests: `solution([[7]]) → [[7]]
solution([[1], [2], [3]]) → [[1, 2, 3]]
solution([[1, 2], [3, 4]]) → [[1, 3], [2, 4]]`
    },
    {
      title: '테두리 칸의 합',
      kind: '직접 작성',
      minutes: 10,
      body: '2차원 리스트 grid에서 가장 바깥 테두리(첫 행, 마지막 행, 첫 열, 마지막 열)에 있는 칸의 합을 반환하세요. 한 칸을 두 번 더하면 안 됩니다. 한 줄짜리 격자나 칸이 1개뿐인 격자도 입력될 수 있습니다.',
      examples: 'grid=[[1, 2, 3], [4, 5, 6], [7, 8, 9]] → 40',
      code: `def solution(grid):
    # 모든 칸을 한 번씩만 검사하세요.
    pass`,
      hint: 'r이 0이거나 rows - 1이거나, c가 0이거나 cols - 1이면 테두리입니다. 조건을 or로 묶으면 한 칸을 두 번 더하지 않습니다.',
      answer: `def solution(grid):
    rows = len(grid)
    cols = len(grid[0])
    answer = 0
    for r in range(rows):
        for c in range(cols):
            if r == 0 or r == rows - 1 or c == 0 or c == cols - 1:
                answer += grid[r][c]
    return answer`,
      explain: '모든 칸을 한 번씩 보며 테두리 조건에 맞을 때만 더합니다. 행이나 열이 1개뿐이면 첫 행과 마지막 행이 같은 줄인데, 칸 단위로 판단하면 중복 없이 처리됩니다.',
      tests: `solution([[5]]) → 5
solution([[1, 2, 3]]) → 6
solution([[1], [2]]) → 3
solution([[1, 2], [3, 4]]) → 10`
    },
    {
      title: '주변 지뢰 개수 세기',
      kind: '직접 작성',
      minutes: 12,
      body: '지뢰 찾기 판을 나타내는 2차원 리스트 grid에서 값 1은 지뢰, 0은 빈칸입니다. 위치 (r, c)의 칸을 둘러싼 8방향 칸에 있는 지뢰 수를 반환하세요. 그 칸 자신은 세지 않으며, 모서리 칸은 판 밖을 확인하지 않도록 주의합니다.',
      examples: 'grid=[[1, 0, 1], [0, 0, 0], [1, 1, 0]], r=1, c=1 → 4',
      code: `def solution(grid, r, c):
    # 주변 8칸의 위치가 판 안인지 확인하세요.
    pass`,
      hint: '행 변화량 dr과 열 변화량 dc를 -1, 0, 1로 돌리면 주변 9칸을 모두 볼 수 있습니다. (0, 0)은 자기 자신이므로 건너뛰고, 새 위치가 판 안일 때만 더합니다.',
      answer: `def solution(grid, r, c):
    rows = len(grid)
    cols = len(grid[0])
    answer = 0
    for dr in (-1, 0, 1):
        for dc in (-1, 0, 1):
            if dr == 0 and dc == 0:
                continue
            nr = r + dr
            nc = c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                answer += grid[nr][nc]
    return answer`,
      explain: '이웃 위치를 (r+dr, c+dc)로 만들고 0 <= nr < rows, 0 <= nc < cols일 때만 읽습니다. 범위 확인을 빼면 모서리에서 인덱스 오류가 나거나, 음수 인덱스가 반대편 칸을 읽는 실수가 생깁니다.',
      tests: `solution([[1, 0, 1], [0, 0, 0], [1, 1, 0]], 0, 0) → 0
solution([[1, 0, 1], [0, 0, 0], [1, 1, 0]], 2, 2) → 1
solution([[1]], 0, 0) → 0`
    },
    {
      title: '시계 방향으로 90도 돌리기',
      kind: '빈칸 완성',
      minutes: 13,
      body: '직사각형 모양의 2차원 리스트 grid를 시계 방향으로 90도 회전한 새 2차원 리스트를 반환하세요. 행과 열은 각각 1개 이상입니다. 3번 문제의 행·열 바꾸기를 떠올려 보세요.',
      examples: 'grid=[[1, 2, 3], [4, 5, 6]] → [[4, 1], [5, 2], [6, 3]]',
      code: `def solution(grid):
    rows = len(grid)
    cols = len(grid[0])
    answer = []
    for c in range(cols):
        new_row = []
        for r in range(____, -1, -1):
            new_row.append(grid[r][c])
        answer.append(new_row)
    return answer`,
      hint: '새 격자의 한 행은 원래 격자의 한 열을 아래에서 위로 읽은 것입니다. 행 번호 r을 마지막 행부터 0까지 거꾸로 돕니다.',
      answer: `def solution(grid):
    rows = len(grid)
    cols = len(grid[0])
    answer = []
    for c in range(cols):
        new_row = []
        for r in range(rows - 1, -1, -1):
            new_row.append(grid[r][c])
        answer.append(new_row)
    return answer`,
      explain: '3번과 같은 반복에서 행 번호만 거꾸로 읽으면 시계 방향 회전이 됩니다. 예제에서 첫 번째 열 1, 4를 아래에서 위로 읽은 [4, 1]이 결과의 첫 번째 행입니다. 즉 \'행·열 바꾸기 후 각 행 뒤집기\'와 같습니다.',
      tests: `solution([[1, 2], [3, 4]]) → [[3, 1], [4, 2]]
solution([[1, 2, 3]]) → [[1], [2], [3]]
solution([[1], [2]]) → [[2, 1]]
solution([[9]]) → [[9]]`
    },
    {
      title: '모든 행과 열의 합이 같은지 확인하기',
      kind: '오류 수정',
      minutes: 10,
      body: 'n × n 정사각형 2차원 리스트 grid의 모든 행의 합과 모든 열의 합이 전부 같은 값이면 True, 하나라도 다르면 False를 반환합니다. \'# 수정\' 표시가 있는 두 줄을 고치세요.',
      examples: 'grid=[[2, 7, 6], [9, 5, 1], [4, 3, 8]] → True',
      code: `def solution(grid):
    n = len(grid)
    target = sum(grid[0])
    for i in range(n):
        if sum(grid[i]) != target:
            return False
    column = 0  # 수정
    for j in range(n):
        for i in range(n):
            column += grid[i][j]
        if column == target:  # 수정
            return False
    return True`,
      hint: '열 합 column은 새 열을 시작할 때마다 0으로 되돌려야 합니다. 그리고 열의 합이 기준값과 \'다를 때\' False를 반환해야 합니다.',
      answer: `def solution(grid):
    n = len(grid)
    target = sum(grid[0])
    for i in range(n):
        if sum(grid[i]) != target:
            return False
    for j in range(n):
        column = 0
        for i in range(n):
            column += grid[i][j]
        if column != target:
            return False
    return True`,
      explain: '오류는 두 가지입니다. column을 열 반복 바깥에서 한 번만 0으로 만들어 이전 열의 합이 계속 쌓입니다. 또 열의 합이 기준과 같을 때 False를 반환해 조건이 거꾸로입니다. 고친 코드는 열마다 column = 0으로 시작하고 != 로 비교합니다.',
      tests: `solution([[1, 2], [3, 4]]) → False
solution([[1, 2], [2, 1]]) → True
solution([[1]]) → True
solution([[1, 2], [1, 2]]) → False`
    },
    {
      title: '합이 가장 큰 2×2 구역',
      kind: '미니 실전 · 직접 작성',
      minutes: 15,
      body: '2차원 리스트 grid에서 가로 2칸, 세로 2칸으로 붙은 정사각형 구역을 하나 고를 때, 네 칸의 합이 가장 큰 값을 반환하세요. 행과 열은 각각 2개 이상이고 음수도 포함될 수 있습니다.',
      examples: 'grid=[[1, 2, 0], [3, 4, 1], [0, 5, 6]] → 16',
      code: `def solution(grid):
    pass`,
      hint: '구역의 왼쪽 위 칸 (r, c)가 될 수 있는 범위는 r이 0부터 rows - 2까지, c가 0부터 cols - 2까지입니다. 합이 모두 음수일 수 있으니 최댓값을 0으로 시작하지 마세요.',
      answer: `def solution(grid):
    rows = len(grid)
    cols = len(grid[0])
    best = grid[0][0] + grid[0][1] + grid[1][0] + grid[1][1]
    for r in range(rows - 1):
        for c in range(cols - 1):
            total = grid[r][c] + grid[r][c + 1] + grid[r + 1][c] + grid[r + 1][c + 1]
            if total > best:
                best = total
    return best`,
      explain: '왼쪽 위 칸의 범위를 rows-1, cols-1로 줄여야 r+1, c+1이 판 밖으로 나가지 않습니다. 첫 구역의 합으로 best를 시작하면 모든 합이 음수여도 올바릅니다. 범위를 한 칸 넓게 잡거나 best를 0으로 두는 실수가 흔합니다.',
      tests: `solution([[1, 1], [1, 1]]) → 4
solution([[-1, -2], [-3, -4]]) → -10
solution([[0, 0, 0], [0, 5, 0], [0, 0, 0]]) → 5`
    }
  ]
};
