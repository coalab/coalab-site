async function loadPrograms() {
  // ✅ 1. COALAB API에서 프로그램 목록 불러오기
  const res = await fetch('https://coalab-api.vercel.app/api/programs');
  const programs = await res.json();

  // ✅ 2. HTML 내 리스트 영역 비우고 다시 채우기
  const playlist = document.getElementById('playlist');
  playlist.innerHTML = '';

  // ✅ 3. 받아온 데이터로 리스트 생성
  programs.forEach(p => {
    const li = document.createElement('li');
    li.classList.add('item');
    li.dataset.type = 'program';
    li.dataset.src = p.link_url;
    li.innerHTML = `<span>${p.title}</span><span class="muted">${p.category}</span>`;
    playlist.appendChild(li);
  });
}

// ✅ 4. 페이지 로드 시 자동 실행
loadPrograms();
