# 📅 Calendiary

React Native 기반의 캘린더 라이브러리와 일기 앱을 포함하는 모노레포 프로젝트입니다.

## 🏗️ 프로젝트 구조

이 프로젝트는 `yarn workspaces`를 활용한 모노레포 구조로 구성되어 있습니다:

```
calendiary-monorepo/
├── packages/
│   ├── calendar/          # @calendiary/calendar 라이브러리
│   └── app/              # Calendiary React Native 앱
├── package.json          # 루트 워크스페이스 설정
└── README.md
```

### 패키지 구성

#### 📦 `@calendiary/calendar`

React Native용 캘린더 라이브러리입니다. Reanimated 3와 Gesture Handler를 활용하여 부드러운 애니메이션과 제스처를 제공합니다.

**주요 특징:**

- 🎨 **Expandable 캘린더**: 주간/월간 뷰 간 부드러운 전환
- ⚡ **애니메이션**: React Native Reanimated & Worklets 기반
- 🌍 **다국어 지원**: LocaleConfig를 통한 로케일 관리
- 🎯 **타입 안전성**: TypeScript로 작성된 타입 지원

#### 📱 `Calendiary` (app)

`@calendiary/calendar` 라이브러리를 사용하는 데모 앱입니다.

---

## 📚 @calendiary/calendar 라이브러리

### 데모

<p style="text-align:center">
  <img src="./packages/calendar/example/demo/calendiary.gif" width="300">
</p>

### 구조

```
src/
├── calendars/              # 최상위 캘린더 컴포넌트
│   ├── Calendar.tsx                # 기본 캘린더
│   └── ExpandableCalendar.tsx      # 확장 가능한 캘린더
│
├── components/             # UI 컴포넌트
│   ├── Day.tsx                     # 개별 날짜 셀
│   ├── Week.tsx                    # 주간 뷰
│   ├── CalendarGrid.tsx            # 월간 그리드
│   ├── CalendarHeader.tsx          # 헤더 (월/년 표시)
│   ├── CalendarWeekDays.tsx        # 요일 헤더
│   ├── AnimatedWeek.tsx            # 애니메이션 주간 뷰
│   ├── WeekCalendar.tsx            # 주간 캘린더
│   └── ExpandableCalendarGrid.tsx  # 확장 가능한 그리드
│
├── hooks/
│   ├── domains/            # 도메인 로직 훅
│   │   ├── types.ts                    # 도메인 타입 정의
│   │   ├── useCalendarState.ts         # 캘린더 상태 관리
│   │   ├── useCalendarHeight.ts        # 높이 계산 로직
│   │   ├── useCalendarMonthsData.ts    # 월별 데이터 생성
│   │   ├── useCalendarWeeksData.ts     # 주별 데이터 생성
│   │   └── useExpandableCalendarState.ts # 확장 캘린더 상태
│   │
│   └── utils/              # 유틸리티 훅
│       ├── useAnimatedHeightTransition.ts  # 높이 애니메이션
│       ├── useInfiniteHorizontalScroll.ts  # 무한 스크롤
│       ├── useIsMounted.ts                 # 마운트 상태 체크
│       └── useVerticalSwipeGesture.ts      # 수직 스와이프 제스처
│
└── utils/                  # 순수 유틸리티 함수
    ├── calendar.ts                 # 캘린더 계산 로직
    ├── date.ts                     # 날짜 유틸리티
    └── locale.ts                   # 로케일 설정
```

### 설계 원칙

#### 1. **관심사의 분리 (Separation of Concerns)**

- **calendars/**: 사용자 대면 API 레이어
- **components/**: 재사용 가능한 UI 컴포넌트
- **hooks/domains/**: 비즈니스 로직 및 상태 관리
- **hooks/utils/**: 범용 유틸리티 훅
- **utils/**: 순수 함수 (사이드 이펙트 없음)

#### 2. **의존성 역전 원칙 (Dependency Inversion)**

- 고수준 컴포넌트는 저수준 구현체에 직접 의존하지 않음
- 인터페이스와 타입을 통한 추상화
- `hooks/domains/types.ts`에 도메인 타입 집중

#### 3. **함수형 프로그래밍**

- 순수 함수 우선 (utils/)
- 불변성 유지
- 사이드 이펙트 격리

### 주요 컴포넌트

#### `Calendar`

기본 월간 캘린더 컴포넌트입니다.

```tsx
import { Calendar } from "@calendiary/calendar";

const today = new Date();

<Calendar selectedDate={today} onDateSelect={(date) => console.log(date)} />;
```

#### `ExpandableCalendar`

주간/월간 뷰를 자유롭게 전환할 수 있는 확장 가능한 캘린더입니다.

```tsx
import { ExpandableCalendar } from "@calendiary/calendar";

const today = new Date();

<ExpandableCalendar
  selectedDate={today}
  onDateSelect={(date) => console.log(date)}
/>;
```

### 로케일 설정

```tsx
import { LocaleConfig } from "@calendiary/calendar";

// 한국어 설정 예시
LocaleConfig.locales["ko"] = {
  monthText: ["1월", "2월", "3월" /* ... */],
  weekDayText: ["일", "월", "화", "수", "목", "금", "토"],
  weekOfMonthText: ["1주차", "2주차", "3주차", "4주차", "5주차", "6주차"],
};
```

### 기술 스택

- **React Native**: 0.81.4+
- **React**: 19.1.0+
- **React Native Reanimated**: 4.1.3+
- **React Native Gesture Handler**: 2.28.0+
- **React Native Worklets**: 0.6.1+
- **TypeScript**: 5.9.2+

---

## 🚀 시작하기

### 필수 요구사항

- Node.js >= 20
- Yarn 3.6.1+

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd calendiary-monorepo

# 의존성 설치
yarn install
```

### 개발 스크립트

#### 앱 실행

```bash
# Metro bundler 시작
yarn app:start

# iOS 앱 실행
yarn app:ios

# Android 앱 실행
yarn app:android
```

#### 라이브러리 개발

```bash
# 라이브러리 빌드
yarn calendar:build

# 테스트 실행
yarn calendar:test
```

---

### Peer Dependencies

다음 패키지들이 필요합니다:

```bash
yarn add react-native-reanimated react-native-gesture-handler react-native-worklets
```

## 🛠️ 개발 워크플로우

### 브랜치 전략

- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정

### 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) 사용:

```bash
# Commitizen 사용 (권장)
yarn commit

# 또는 수동으로
git commit -m "feat: 새로운 기능 추가"
git commit -m "fix: 버그 수정"
git commit -m "docs: 문서 업데이트"
```

### Git Hooks

- **pre-commit**: Lint 및 타입 체크 (lefthook)
- **commit-msg**: 커밋 메시지 검증 (commitlint)
