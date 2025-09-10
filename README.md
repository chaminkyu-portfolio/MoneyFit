# 머니핏 (MoneyFit)

> 대학생의 건전한 생활 및 소비 습관 형성을 돕는 AI 기반 루틴 관리 서비스

---

## 🛠️ 기술 스택 (Tech Stack)

### Front-end

- TypeScript
- React-Native (with Expo)
- React-Query (Server State)
- Zustand (Client State)
- Styled-Components

---

## 🚀 시작하기 (Getting Started)

1.  **저장소 복제 (Clone)**

    ```bash
    git clone https://github.com/HeyRoutine/HeyRoutine-FE.git
    cd shinhan-HeyRoutine
    ```

2.  **의존성 설치 (Install Dependencies)**

    ```bash
    npm install
    ```

3.  **개발 서버 실행 (Run)**
    ```bash
    npx expo start
    ```

---

## 📂 폴더 구조 (Folder Structure)

`src` 폴더는 직접 작성하는 소스코드를, 루트 폴더는 프로젝트 설정 파일을 관리합니다.

```
src/
├── api/             # API 요청 함수
├── assets/          # 이미지, 폰트 등 정적 파일
├── components/      # 재사용 컴포넌트
│   ├── common/        # 앱 전체에서 쓰이는 범용 컴포넌트
│   └── domain/        # 특정 도메인에만 쓰이는 컴포닌트
├── hooks/           # 커스텀 훅
├── navigation/      # 화면 이동(Navigation) 설정
├── screens/         # 화면 단위 컴포넌트
├── store/           # 전역 상태 관리
├── styles/          # 공통 스타일 관리
├── types/           # 공통 TypeScript 타입
├── App.tsx          # 앱 최상위 컴포넌트
└── index.ts         # 앱 진입점
```

---

## ✨ 코드 컨벤션 (Code Convention)

### 파일명 규칙

- **컴포넌트/화면:** `PascalCase.tsx` (예: `RoutineCard.tsx`)
- **그 외 (hooks, api 등):** `camelCase.ts` (예: `useAuth.ts`)

### 컴포넌트 규칙

- 함수형 컴포넌트와 화살표 함수 사용을 원칙으로 합니다.

  ```tsx
  import React from 'react';

  const MyComponent = () => {
    return <View />;
  };

  export default MyComponent;
  ```

- Props 타입은 `interface IComponentProps` 형식으로 정의합니다.

  ```tsx
  interface IRoutineCardProps {
    title: string;
    completed: boolean;
  }

  const RoutineCard = ({ title, completed }: IRoutineCardProps) => {
    // ...
  };
  ```

### 스타일링 규칙

- `styled-components/native` 사용을 원칙으로 합니다.
- 색상, 폰트 등 모든 디자인 요소는 `styles/theme.ts` 파일을 참조합니다.
- 컴포넌트 파일 내 최상위 `Wrapper` 컴포넌트의 이름은 `Container`로 통일합니다.
  ```tsx
  const Container = styled.View`
    flex: 1;
    background-color: ${theme.colors.background};
  `;
  ```

---

## 🤝 Git 컨벤션 (Git Convention)

### 브랜치 전략

- `feature/기능명`: 기능 개발 (예: `feature/login-screen`)
- `fix/수정내용`: 버그 수정 (예: `fix/header-style-bug`)

1.  **브랜치 생성:** `develop` 브랜치에서 시작하여, 자신의 작업에 맞는 이름으로 새 브랜치를 만듭니다.
    ```bash
    # main 브랜치에서 최신 코드를 받아온 후, 새 브랜치를 생성합니다.
    git checkout develop
    git pull origin develop
    git checkout -b feature/my-new-feature
    ```
2.  **개발:** 새로 만든 브랜치 안에서 자유롭게 코드를 작성하고 커밋합니다.
3.  **Push:** 작업이 끝나면 자신의 브랜치를 원격 저장소(GitHub)에 올립니다.
    ```bash
    git push origin feature/my-new-feature
    ```
4.  **Pull Request (PR):** GitHub에서 `develop` 브랜치로 합쳐달라는 Pull Request를 생성합니다.
5.  **코드 리뷰 및 Merge:** 다른 팀원이 코드를 검토하고, 이상이 없으면 `develop` 브랜치에 최종적으로 병합(Merge)합니다.

### 커밋 메시지 규칙

`타입: 제목` 형식으로 작성합니다.

- **`feat`**: 새로운 기능 추가
- **`fix`**: 버그 수정
- **`style`**: 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
- **`chore`**: 빌드 업무, 패키지 매니저 설정 등 (라이브러리 설치, 폴더 구조 설정 등)
- **`docs`**: 문서 수정

**예시:**

```
feat: 로그인 화면 UI 구현
chore: React Navigation 라이브러리 추가
```

---

## 확장 프로그램

`Expo Tools`: Expo 전용 기능. app.json이나 app.config.js 파일 자동완성, 디버깅 설정 등 Expo 개발에 특화된 기능들을 제공

`ES7+ React/Redux/React-Native snippets`: 코드 자동 완성. rfc (컴포넌트), useState, useEffect 등 자주 사용하는 리액트 및 리액트 네이티브 코드 조각을 단축키로 빠르게 생성

`Prettier - Code formatter`: 코드 자동 정렬. 저장할 때마다 코드를 설정된 스타일 가이드에 맞춰 자동으로 정리해 줘서, 항상 일관된 코드 스타일을 유지할 수 있음

`ESLint`: 문법 교정 및 에러 감지. 코드를 작성하는 동안 잠재적인 버그나 안티 패턴을 실시간으로 찾아내고, 일부는 자동으로 수정해 줘서 코드 품질을 높여줌. Prettier와 조합

`vscode-styled-components`: 만약 Styled Components를 사용한다면, CSS 문법 하이라이팅과 자동완성을 지원해서 스타일 작성이 훨씬 편해짐

`Path Intellisense`: 파일 경로 자동완성

`GitLens — Git supercharged`: Git 연동 강화. 코드 한 줄 한 줄마다 누가, 언제, 왜 수정했는지 바로 확인할 수 있어 협업하거나 코드 히스토리를 추적할 때 유용함

`DotENV`: API 키 등을 관리할 때 편리
