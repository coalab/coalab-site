## COALAB Site##
https://coalab.github.io/coalab-site/
간단한 포트폴리오/홍보용 정적 웹사이트입니다. HTML/CSS/JS로 구성되어 있으며 브라우저에서 바로 열어 확인할 수 있습니다.

## 파일 구조(요약)

- `index.html` - 메인 페이지
- `login.html`, `mypage.html`, `course.html` - 추가 페이지(있을 경우)
- `assets/css/style.css` - 스타일시트
- `assets/js/loadPrograms.js` - 사이트 동작용 JavaScript
- `assets/img/` - 이미지 파일들
- `supabase db 패스워드.txt` - **민감 정보(업로드 금지)**

`.gitignore`에 민감 파일을 추가해 GitHub에 업로드되지 않도록 설정했습니다.

## 로컬에서 보기

1. 파일을 복사한 후, 프로젝트 폴더에서 `index.html`을 더블클릭하거나 브라우저에서 엽니다.
2. 특별한 빌드 도구는 필요하지 않습니다.

Windows `cmd` 예시:
```
cd /d "d:\수업자료백업\2025 coalab\newHome"
start index.html
```

## GitHub에 올리기 (간단 요약)

1. GitHub에 새 저장소를 만든다 (예: `coalab-site`).
2. 로컬에서 Git 초기화, 커밋, 원격 추가 후 `git push` 수행.
3. GitHub 저장소의 `Settings` → `Pages`에서 `Branch: main`과 `Folder: / (root)`를 선택해 Pages를 활성화하면 사이트가 배포됩니다.

## 주의사항

- `supabase db 패스워드.txt` 같은 민감 정보는 절대 공개 저장소에 올리지 마세요. 이미 올라간 경우 즉시 비밀번호를 변경하세요.
- 이미지 파일이나 CSS가 누락되면 페이지가 정상적으로 보이지 않을 수 있습니다. 전체 `assets/` 폴더를 함께 업로드하세요.

---

원하시면 이 README에 프로젝트 설명(회사/연락처), 라이선스, 배포된 URL 등을 추가해 드리겠습니다.


