# Keep-It — 프로젝트 문서

## 1. 프로젝트 개요

- **프로젝트명**: Keep-It
- **슬로건**: 꾸준함 관리 TODO 리스트
- **문제 정의**: "조금씩 꾸준히"가 어려운 사용자를 위해 시각적인 성취감을 제공하고 할 일을 관리해주는 서비스
- **플랫폼**: 모바일 웹 (React + TypeScript + Vite) — React Native가 아님
- **스택**: React 18, TypeScript, Vite, CSS (no CSS-in-JS, no Tailwind)

---

## 2. UI/UX 디자인 가이드

### 레이아웃
- **형태**: 1열 단일 레이아웃 (Center Aligned)
- **가로 폭**: 320px ~ 480px (max-width 480px 고정)
- **정렬**: 중앙 정렬, 좌우 패딩 12px

### 타이포그래피
- 기본 텍스트: **14px 이상**
- 줄 높이: **1.5em**

### 터치 요소
- 모든 버튼 및 클릭 요소: 최소 **44px × 44px** 확보

### 간격
- 내부 패딩: **8px ~ 12px** 유지

### 컬러 팔레트 (`src/shared/styles/variables.css`)
| 변수 | 값 | 용도 |
|---|---|---|
| `--color-main` | `#96ce46` | 메인 강조색 (연두) |
| `--color-main-light` | `#c8e6a0` | 메인 연한 버전 |
| `--color-main-bg` | `#f0f8e4` | 메인 배경 |
| `--color-coral` | `#FFC9C9` | 중요 / 미완료 표시 |
| `--color-mint` | `#D3F9D8` | 완료 / 성공 표시 |
| `--color-yellow` | `#FFF3BF` | 강조 / 포인트 |
| `--color-text` | `rgb(29,29,28)` | 기본 텍스트 |

---

## 3. 주요 기능 명세

### 3-1. 캘린더 메인 화면
- **뷰 전환**: 월간(Month) / 주간(Week) 탭 토글
- **날짜 클릭**: Bottom Sheet 슬라이드 업 → 해당 날짜 할일 목록 표시
- **Day Cell 시각화**:
  - 할일 없음: 기본 회색 bean 모양
  - 전체 미완료: 점선 테두리
  - 부분 완료: 완료율에 따라 연두 그라데이션 배경 + 남은 개수 표시
  - 전체 완료: 연두 테두리 + ✓ 아이콘
  - 선택된 날짜: 메인 컬러 테두리 인셋
- **'오늘' 버튼**: 클릭 시 오늘 날짜로 이동 + day cell swing 애니메이션

### 3-2. 헤더 — "콩심은데 콩나고" 디자인 컨셉
- 글라스모피즘 배경 (`backdrop-filter: blur(16px)`)
- **좌측**: 🫘 Keep-It 로고 (1행), 월 네비게이션 ‹ 3월 2026 › (2행)
- **우측**: 월/주/오늘 탭 (1행), 성장 식물 일러스트 + 달성 정보 (2행)

**성장 식물 5단계 (월간 누적 완료 개수 기준)**
| 단계 | 개수 | 모습 |
|---|---|---|
| 1 | 0~2개 | 씨앗 — 흙 위 커피콩 |
| 2 | 3~6개 | 발아 — 뿌리 + 싹 |
| 3 | 7~11개 | 새싹 — 줄기 + 두 잎 |
| 4 | 12~19개 | 줄기 — 긴 줄기 + 여러 잎 |
| 5 | 20개+ | 열매 — 커피 체리 + sparkle |
| 보너스 | 30개+ | 열매 3개 추가 + sparkle 풍성 |

- 식물은 SVG로 구현, 단계별 누적 표시 (이전 단계 요소 포함)
- sway(흔들림) / grow(등장) / sparkle 애니메이션 포함
- 달성 수 + "발아까지 N개" 힌트 텍스트 우측 표시

### 3-3. 오늘 할일 패널 (메인 화면 캘린더 하단 상시 노출)
- 오늘 날짜 기준 할일을 **카테고리별 그룹**으로 표시
- 헤더: 날짜 + **오늘** 배지 + "N개 남음 / 모두 완료!" 상태
- 각 카테고리 우측 **+** 버튼 → 인라인 추가 폼 슬라이드 등장
- 추가 폼: 할일 내용 + **시간** : **분** 목표 시간 입력 + 추가 버튼
- 목표 시간 표시: `1시간 30분`, `2시간`, `45분` 포맷

### 3-4. 할일 CRUD
- **Create**: 카테고리 선택 + 내용 + 목표 시간(시간/분) 입력
- **Read**: 날짜별 / 카테고리별 조회
- **Update**: 탭으로 완료/미완료 토글
- **Delete**: 오른쪽 스와이프 → 즉시 삭제 + 하단 Snackbar(Undo, 3초 자동 소멸)

### 3-5. Bottom Sheet (날짜 클릭 시)
- 스냅 포인트: 55vh(half) / 90vh(full)
- 위로 드래그 → full 확장, 아래로 드래그 → half 축소 or 닫힘
- 닫힐 때 sheetSlideDown 애니메이션 (0.3s)
- 내부 컨텐츠: DayTodoPanel (오늘 패널과 동일 UI, 선택 날짜 기준)

### 3-6. 설정 페이지 (3단계 화면)
- **Screen 1 — 설정 목록**: 알림, 카테고리(색상 dot + 개수/최대), 테마, 계정
- **Screen 2 — 카테고리 목록**: 색상 dot + 이름 + task 수, 최대 10개, "+ 카테고리 추가" 버튼
- **Screen 3 — 카테고리 생성/수정**: 이름 입력, 10색 팔레트 선택, 미리보기, 취소/완료

---

## 4. 애니메이션 목록

| 이름 | 파일 | 설명 |
|---|---|---|
| `swing` | App.css | 오늘 버튼 클릭 시 day cell 흔들림 |
| `itemSlideUp` | App.css | 할일 아이템 등장 (위로 슬라이드) |
| `groupFadeIn` | App.css | 카테고리 그룹 등장 (순차 딜레이) |
| `formSlideIn` | App.css | 추가 폼 슬라이드 등장 |
| `sheetSlideUp/Down` | App.css | Bottom Sheet 열림/닫힘 |
| `plantSway` | App.css | 식물 일러스트 좌우 흔들림 (무한) |
| `plantGrow` | App.css | 식물 파트 등장 (scale 0→1) |
| `sparkle` | App.css | 열매 반짝임 (무한 alternate) |
| `swipeCollapse` | App.css | 스와이프 삭제 후 높이 축소 |
| `snackbarIn` | App.css | Snackbar 스프링 팝업 등장 |
| `pageFadeIn` | App.css | 페이지 전환 페이드인 |

---

## 5. 폴더 구조

```
src/
├── App.tsx                          # 루트 컴포넌트, 전역 상태 관리
├── App.css                          # 전역 스타일 (모든 CSS 단일 파일)
├── main.tsx
│
├── features/                        # 기능 단위 격리 폴더
│   ├── calendar/
│   │   ├── components/
│   │   │   ├── CalendarHeader.tsx   # 헤더 (로고 + 네비 + GrowthPlant)
│   │   │   ├── GrowthPlant.tsx      # 성장 식물 SVG 일러스트
│   │   │   ├── MonthView.tsx        # 월간 캘린더 그리드
│   │   │   ├── WeekView.tsx         # 주간 캘린더 행
│   │   │   └── DayCell.tsx          # 날짜 셀 (bean 모양)
│   │   ├── hooks/
│   │   │   └── useCalendar.ts       # 날짜 상태, 뷰 전환, 네비게이션
│   │   ├── types/
│   │   │   └── calendar.types.ts    # CalendarDay, ViewType 타입
│   │   └── index.ts                 # barrel export
│   │
│   ├── todo/
│   │   ├── components/
│   │   │   ├── DayTodoPanel.tsx     # 날짜별 할일 패널 (카테고리 그룹 + 추가 폼)
│   │   │   ├── TodoForm.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoList.tsx
│   │   │   └── TodoModal.tsx
│   │   ├── hooks/
│   │   │   └── useTodo.ts           # todos CRUD 상태 관리
│   │   ├── types/
│   │   │   └── todo.types.ts        # Todo, CategoryItem, TodoStatus 타입
│   │   └── index.ts                 # barrel export
│   │
│   ├── settings/
│   │   ├── SettingsPage.tsx         # 설정 메인 (Screen 1)
│   │   ├── CategoryList.tsx         # 카테고리 목록 (Screen 2)
│   │   ├── CategoryForm.tsx         # 카테고리 생성/수정 (Screen 3)
│   │   └── useCategory.ts           # 카테고리 CRUD 상태 관리
│   │
│   └── today/
│       └── TodayPage.tsx            # 오늘 페이지 (하단 탭)
│
└── shared/
    ├── components/
    │   ├── BottomNav.tsx            # 하단 탭 네비게이션 (홈/오늘/설정)
    │   ├── BottomSheet.tsx          # 드래그 가능한 바텀 시트
    │   ├── SwipeToDelete.tsx        # 스와이프 삭제 래퍼 컴포넌트
    │   ├── Snackbar.tsx             # 삭제 확인 + Undo 토스트
    │   └── Button.tsx
    └── styles/
        └── variables.css            # CSS 변수 (컬러, 사이즈, 간격)
```

---

## 6. 데이터 모델

### Todo
```ts
interface Todo {
  id: string;
  content: string;
  category: string;          // CategoryItem.name 참조
  targetTime?: number;       // 목표 시간 (분 단위로 저장, 시간*60+분)
  status: 'pending' | 'in-progress' | 'done';
  date: string;              // YYYY-MM-DD
  createdAt: Date;
}
```

### CategoryItem
```ts
interface CategoryItem {
  id: string;
  name: string;
  color: string;             // hex 색상 (#96ce46 등)
}
```

기본 카테고리: 공부(`#42a5f5`), 운동(`#96ce46`), 업무(`#ef5350`), 개인(`#ab47bc`), 기타(`#8d6e63`)

---

## 7. 상태 관리 구조

모든 상태는 React `useState`로 관리하며, Context/Redux 없이 props drilling 방식으로 전달합니다.

```
App.tsx
├── useCalendar()         — currentDate, viewType, calendarDays, 네비게이션 함수
├── useTodo()             — todos[], addTodo, updateTodo, deleteTodo, getTodosForDate 등
├── useCategory()         — categories[], addCategory, updateCategory, deleteCategory
├── useState: page        — 'home' | 'today' | 'settings'
├── useState: selectedDate — 클릭된 날짜 (Bottom Sheet 트리거)
├── useState: shakeToday  — 오늘 버튼 클릭 시 shake 애니메이션 트리거
└── useState: deletedTodo — 삭제된 Todo (Snackbar Undo용 임시 저장)
```

`categoryAccentMap` — categories 배열에서 매 렌더마다 `{ name: color }` 형태로 파생 계산

---

## 8. 설계 원칙

1. **기능별 폴더 격리**: `features/calendar`, `features/todo`, `features/settings` 각각 독립 유지
2. **단일 CSS 파일**: `App.css` 에서 모든 스타일 관리 (컴포넌트별 CSS 파일 없음)
3. **CSS 변수 활용**: 색상/사이즈는 반드시 `variables.css`의 변수 사용
4. **스타일 네이밍**: BEM 방식 (`block__element--modifier`)
5. **타입 안전성**: `any` 사용 금지, 모든 props에 명시적 타입
6. **상태 최소화**: 파생 가능한 값은 `useState` 대신 렌더 중 계산
7. **애니메이션**: CSS `@keyframes` 우선, JS 애니메이션 지양

---

## 9. 향후 개발 아이디어 (미구현)

- **활동 정리함**: 완료된 할일을 이력서/포트폴리오 포맷으로 자동 정리 및 복사
  - 카테고리별 선별 → 이력서용 편집 → 간단 리스트 / 상세형 / 타임라인형 복사
- **월간 리포트**: 성장 식물 기능과 연계한 월간 활동 자동 요약
- **로컬스토리지 연동**: 현재 메모리 상태를 영속화
- **알림 기능**: 설정 페이지 알림 항목 구현
- **테마**: 라이트/다크 모드 전환


project url : https://pbvgednmqvtjywbuxlzm.supabase.co
Anon key : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidmdlZG5tcXZ0anl3YnV4bHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0OTgwNDIsImV4cCI6MjA5MDA3NDA0Mn0.mMo4MevKSVYwRLzyYl8Y8ISB0mpDLdtzQvUn6hg2oE8