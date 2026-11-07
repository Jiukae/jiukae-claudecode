# JIUKAE — Personal Portfolio

> **Ideas into Reality.**
> 떠오른 아이디어를 코드로 만들고, 새로운 가능성을 실험하는 JIUKAE의 개인 포트폴리오 웹사이트입니다.

순수 **HTML5 · CSS3 · Vanilla JavaScript**만으로 만들었습니다.
React 같은 프레임워크, 라이브러리, 빌드 과정이 전혀 없습니다.

## 실행 방법

`portfolio/index.html` 파일을 브라우저로 열면 바로 실행됩니다. 서버나 설치 과정은 필요 없습니다.

## 폴더 구조

```
portfolio/
├── index.html        # 페이지 구조와 콘텐츠
├── css/
│   └── style.css     # 디자인 (토큰, 레이아웃, 애니메이션, 반응형)
├── js/
│   └── script.js     # 인터랙션 + 사이트 설정(SITE_CONFIG)
└── assets/
    └── favicon.svg   # 파비콘
```

## 이메일 · 프로젝트 링크 설정

`portfolio/js/script.js` 맨 위의 `SITE_CONFIG`만 수정하면 됩니다.

```js
const SITE_CONFIG = {
  email: '',            // 예) 'yourname@example.com'
  projectLinks: {
    dorantalk: '',      // 예) 'https://...'
    'snake-game': '',
    'ai-experiments': '',
    'game-development': '',
  },
};
```

- **email**: 비워 두면 Contact 섹션의 버튼이 '준비 중' 상태로 표시됩니다. 주소를 입력하면 `mailto:` 링크와 '주소 복사' 버튼이 활성화됩니다.
- **projectLinks**: 비워 둔 프로젝트는 '링크 준비 중'으로 표시됩니다. 주소를 입력하면 '프로젝트 보기' 링크가 새 창으로 열립니다.

## 섹션 구성

| 섹션 | 내용 |
| --- | --- |
| Hero | 로고, DIGITAL CREATOR / DEVELOPER, "Ideas into Reality.", 소개, CTA 버튼 2개, CSS 3D 구체와 궤도, 플로팅 태그 |
| About | 만드는 과정이 즐겁습니다. · WEB / AI / GAME / BUILD 키워드 카드 |
| Projects | DoranTalk, Snake Game, AI Experiments, Game Development |
| Skills | 언어(HTML, CSS, JavaScript, Python, Lua) · 관심 분야(AI / LLM, Web Apps, Game Development, UI / UX, Creative Coding) |
| Philosophy | "좋은 아이디어는 머릿속에만 두지 않고, 직접 만들어 볼 때 시작된다." |
| Contact | 무언가를 만들고 있나요? · 이메일 버튼 |

## 주요 기능

- 부드러운 스크롤 이동과 고정 헤더(스크롤 시 글래스 배경 + 진행 표시줄)
- `IntersectionObserver` 기반 스크롤 등장 애니메이션과 현재 섹션 메뉴 표시(Scrollspy)
- CSS 3D 구체: 회전하는 와이어프레임, 빛나는 궤도와 꼬리 빛, 마우스 위치에 따른 은은한 기울기
- 프로젝트 카드 호버(떠오름, 그라데이션 테두리, 마우스를 따라다니는 빛), 버튼 호버(빛 반사)
- 모바일 햄버거 메뉴(ESC로 닫기, 포커스 유지, 스크롤 잠금, 데스크톱 전환 시 자동 닫힘)
- 데스크톱 · 노트북 · 태블릿 · 스마트폰 반응형 레이아웃
- 접근성: 본문 바로가기, 키보드 포커스 표시, `prefers-reduced-motion` 대응(움직임 최소화), JS 미동작 시에도 콘텐츠 표시

## 외부 리소스

웹 폰트(Space Grotesk, Noto Sans KR, JetBrains Mono)만 Google Fonts에서 불러옵니다.
오프라인이면 시스템 폰트로 자동 대체되며, 기능은 모두 그대로 동작합니다.
