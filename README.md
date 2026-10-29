# 하이미디어아카데미 수강 후기

K-Digital 심화과정 수강 후기 7건을 제공된 `kdigital-reviews.html`에서 원문 그대로 옮긴 정적 사이트입니다. 후기 제목·본문·날짜는 원본 데이터를 유지합니다. 작성자 4명은 요청받은 마스킹 이름으로 수정했습니다.

## 파일

- `index.html`: 페이지 구조와 공유 정보
- `styles.css`: 반응형 디자인
- `reviews.js`: 후기 데이터 (`window.HIMEDIA_REVIEWS`)
- `app.js`: 검색, 주제 필터, 정렬, 상세 보기
- `assets/`: 하이미디어 로고, 프로젝트 발표 사진, 한글 폰트

빌드 단계나 서버, 별도의 API 없이 작동합니다. `index.html`을 열거나 정적 웹 서버에서 확인할 수 있습니다. 자산 경로는 상대 경로로 작성되어 GitHub Pages의 프로젝트 하위 경로에서도 작동합니다.

## GitHub Pages

저장소 `Settings → Pages`에서 `Deploy from a branch`, `main`, `/ (root)`를 선택합니다.

게시 주소: https://sio60.github.io/sio60.github.io-review/

## 후기 추가

`reviews.js`의 `reviews` 배열에 고유한 `id`, `title`, `body`, `course`, `author`, `publishedAt`, `tags`를 추가합니다. 본문 문단은 `\n\n`으로 구분합니다. 지원하는 주제는 `커리큘럼`, `프로젝트`, `강사진`, `성장 이야기`입니다. 게시 전 후기 사용 동의와 개인정보를 확인하세요.

상단 인용문은 제공된 후기 본문의 일부입니다. 발표 사진은 프로젝트 현장 자료이며 특정 후기 작성자의 사진으로 연결하지 않습니다.

## 취업 스토리 카테고리

고졸 / 비전공자 / 전공자 카테고리가 준비되어 있습니다. 현재는 카테고리만 추가해 기존 후기에는 분류를 임의로 부여하지 않았습니다. 분류를 정한 후 `reviews.js`의 해당 후기에 `background`를 `highschool`, `nonmajor`, `major` 중 하나로 지정하면 됩니다.

## 프로젝트와 커리큘럼

- `projects.js`: 공식 홈페이지의 AI 심화과정 15기·14기 프로젝트 6건.
- `assets/projects/`: 공식 포트폴리오 대표 이미지와 발표 자료 원본. 프로젝트 상세 모달을 열 때만 전체 자료를 불러옵니다.
- 출처: https://www.himedia.co.kr/Portfolio/it (개별 게시물 448, 447, 446, 445, 444, 443)
- 커리큘럼은 제공받은 고용24의 생성형 AI 활용 Java 풀스택 개발자 6회차 과정으로 연결합니다. 기초 개발자 과정과 8주 심화과정을 구분해 안내합니다.
