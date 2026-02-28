# 뭐부터 (mobuto)

> 아이젠하워 매트릭스 기반 할 일 관리 서비스

## 서비스 컨셉

"뭐부터 해야 하지?" — 누구나 할 일이 쌓이면 하는 고민.
**뭐부터**는 아이젠하워 매트릭스를 활용해 할 일의 우선순위를 직관적으로 정리해주는 모바일 퍼스트 웹 서비스.

## 아이젠하워 매트릭스란?

```
         긴급함              긴급하지 않음
      ┌──────────────┬──────────────────┐
 중요 │  1. 지금 해   │  2. 일정 잡기     │
      │  (DO)        │  (SCHEDULE)      │
      ├──────────────┼──────────────────┤
 안중요│  3. 맡기기    │  4. 버리기        │
      │  (DELEGATE)  │  (DELETE)        │
      └──────────────┴──────────────────┘
```

## 타겟 유저

- 할 일이 많아서 뭐부터 해야 할지 모르는 직장인/대학생
- 단순 투두 앱으로는 우선순위 정리가 안 되는 사람
- 한국어 사용자 (국내 서비스)

## 핵심 기능

### MVP (1차) — 최소 스코프
- [ ] 할 일 추가 ("긴급한가요?" "중요한가요?" 2개 질문 → 자동 사분면 배치)
- [ ] 아이젠하워 매트릭스 4사분면 보기 (2x2 그리드)
- [ ] 할 일 수정/완료/삭제
- [ ] 사분면 이동 (탭 → 선택 방식, DnD 아님)
- [ ] 로컬 스토리지 저장 (비로그인 즉시 사용)
- [ ] 모바일 반응형 UI
- [ ] quadrantHistory 로그 조용히 수집 (UI 노출 없음, 2차 분석용 데이터 축적)

### 2차
- [ ] 드래그 앤 드롭 (데스크탑 중심)
- [ ] 성향 분석 UI + 리포트
- [ ] 기본 통계 (사분면별 완료 비율 등)
- [ ] 회원가입/로그인 (소셜 로그인)
- [ ] 클라우드 동기화
- [ ] PWA 설치 지원

### 3차
- [ ] 알림/리마인더
- [ ] 반복 할 일
- [ ] 앱인토스 Webview 배포
- [ ] 토스 로그인 연동
- [ ] 유료화 (광고 제거 + 리포트)

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | React + Vite |
| 스타일링 | Tailwind CSS |
| 상태관리 | Zustand |
| 저장 | LocalStorage + API (어댑터 패턴으로 전환) |
| 배포 | Vercel / Netlify |
| 앱 전환 | 앱인토스 Webview |

## UI/UX 방향

### 모바일 (메인)
- 기본 뷰: 4사분면 그리드 (2x2)
- 각 사분면 탭하면 해당 영역 할 일 리스트 확장
- 하단 FAB(+) 버튼으로 빠른 할 일 추가
- 스와이프로 완료/삭제

### 데스크탑
- 4사분면 한 눈에 보이는 대시보드
- 드래그 앤 드롭으로 사분면 간 이동

## 경쟁 분석

### 해외
- TASKS, 4todo, Matrix Todo 등 전용 앱 존재
- TickTick, Todoist 등 일반 투두 앱에서 매트릭스 지원
- 메이저 서비스는 없음

### 국내
- 아이젠하워 매트릭스 투두 앱 소수 존재 (코어태스크 등)
- 소규모 개발자 중심, 대규모 서비스 없음
- **기회: UX + 성향 분석 + 데이터 인사이트로 차별화 가능**

## 차별점

- **단순함**: 할 일 추가할 때 "긴급한가요?" "중요한가요?" 두 질문으로 자동 분류
- **시각적**: 매트릭스를 직관적으로 보여주는 UI
- **한국어 최적화**: 한국 사용자 대상 UX
- **성향 분석**: 행동 로그 기반 우선순위 성향 리포트 (단순 투두 앱과의 핵심 차별점)

## 컬러 시스템 (디자인 토큰)

> 모든 컬러는 상수/토큰으로 관리 → 브랜드 컬러 변경 시 한 곳만 수정

### 브랜드 (무채색 미니멀, 사분면 컬러가 주인공)

| 토큰 | 용도 | Tailwind | 헥스 |
|------|------|----------|------|
| `brand-primary` | 주요 텍스트, 헤더 | slate-800 | #1e293b |
| `brand-secondary` | 보조 텍스트 | slate-500 | #64748b |
| `brand-accent` | CTA 버튼, 강조 | slate-700 | #334155 |
| `bg-primary` | 메인 배경 | slate-50 | #f8fafc |
| `bg-surface` | 카드/패널 배경 | white | #ffffff |
| `border-default` | 구분선 | slate-200 | #e2e8f0 |

### 사분면 (기능 컬러)

| 토큰 | 사분면 | Tailwind | 헥스 |
|------|--------|----------|------|
| `quadrant-do` | 1. 지금 해 (긴급+중요) | red-500 | #ef4444 |
| `quadrant-schedule` | 2. 일정 잡기 (중요+안긴급) | blue-500 | #3b82f6 |
| `quadrant-delegate` | 3. 맡기기 (긴급+안중요) | amber-500 | #f59e0b |
| `quadrant-delete` | 4. 버리기 (안긴급+안중요) | slate-400 | #94a3b8 |

### 시맨틱 (상태)

| 토큰 | 용도 | Tailwind | 헥스 |
|------|------|----------|------|
| `status-success` | 완료 | emerald-500 | #10b981 |
| `status-warning` | 경고/리마인더 | amber-500 | #f59e0b |
| `status-error` | 에러/삭제 | red-500 | #ef4444 |
| `status-info` | 안내 | blue-500 | #3b82f6 |

## 저장소 아키텍처 (어댑터 패턴)

```
Zustand Store
    │
    ▼
StorageAdapter (interface)
    ├── LocalStorageAdapter   ← 비로그인 / 오프라인
    └── ApiStorageAdapter     ← 로그인 유저 / 분석 데이터 수집
```

- 동일한 인터페이스(`save`, `load`, `delete`, `sync`)로 저장소 전환
- 비로그인 → LocalStorage, 로그인 → API, 전환 시 로컬 데이터 마이그레이션
- API 저장 시 분석용 데이터(생성/완료 시간, 사분면 이동 이력 등) 함께 수집

## 성향 분석 (핵심 차별화 기능)

### 수집 로그
- 할 일 생성 시점
- 사분면 이동 이력
- 완료까지 걸린 시간
- 삭제 비율
- 1→2분면 이동 여부

### 파생 지표
| 지표 | 산출 방식 |
|------|-----------|
| 긴급 편중도 | 1,3분면 완료 비율 |
| 중요 회피도 | 2분면 생성 후 미완료 비율 |
| 미루기 지수 | 생성~완료 평균 시간 |
| 재정렬 빈도 | 우선순위 변경 횟수 |

### 성향 유형
- 긴급 대응형
- 중요 회피형
- 계획 안정형
- 과잉 정리형

## 수익화 모델

### 무료
- 기본 투두 (사분면)
- 최근 7일 분석
- 광고 (배너 하단 고정 + 리포트 열람 전 전면 1회)

### 유료
- 광고 제거
- 전체 리포트 (30일/90일)
- 성향 히스토리
- 데이터 백업
- 테마/커스터마이징

### 플랫폼별 가격 전략
| 플랫폼 | 결제 방식 | 가격 |
|--------|-----------|------|
| 토스 미니앱 | 단건 결제 | 2,900원 |
| 웹 | 월 구독 | 2,900원/월 |
| 앱스토어 | 구독 + 평생 | 2,900원/월 또는 9,900원 |

### 광고 전략
- 투두 사용 흐름은 방해하지 않음
- 분석/리포트 쪽에 자연스럽게 배치
- 과도한 노출 금지 (이탈 방지)

## 아키텍처 설계 (확장성)

### 레이어 분리 원칙

```
src/
  ├── core/              ← 플랫폼 무관 핵심 로직
  │   ├── models/        ← Todo 타입, 인터페이스 정의
  │   ├── stores/        ← Zustand 스토어 (도메인별 분리)
  │   ├── adapters/      ← Storage 어댑터
  │   ├── analytics/     ← 성향 분석 로직
  │   └── constants/     ← 사분면 정의, Feature Flag
  ├── ui/
  │   ├── components/    ← 공통 UI 컴포넌트
  │   ├── pages/         ← 라우트별 페이지
  │   └── layouts/       ← 모바일/데스크탑 레이아웃
  ├── platform/
  │   └── toss/          ← 앱인토스 전용 코드 (격리)
  └── App.tsx
```

> core / ui / platform 3개 레이어 분리 → 어디로 확장해도 기존 코드 안 건드림

### 데이터 모델

```typescript
interface Todo {
  id: string
  title: string
  quadrant: 1 | 2 | 3 | 4
  status: 'active' | 'completed' | 'deleted'
  createdAt: number
  updatedAt: number
  completedAt?: number
  order: number
  // 2차 확장용
  tags?: string[]
  dueDate?: number
  repeatRule?: string
  // 성향 분석용 (1차부터 로컬에 축적)
  quadrantHistory?: { from: number; to: number; at: number }[]
}
```

### Zustand 스토어 분리

```
stores/
  ├── todoStore        ← 할 일 CRUD + 사분면 관리
  ├── analyticsStore   ← 성향 분석 데이터
  ├── uiStore          ← 테마, 모달, 토스트 등
  └── authStore        ← 2차에서 추가
```

### Storage 어댑터 확장

```
StorageAdapter (interface)
  ├── LocalStorageAdapter    ← MVP
  ├── ApiStorageAdapter      ← 2차 (자체 백엔드)
  ├── TossStorageAdapter     ← 앱인토스 전용 (필요 시)
  └── SyncAdapter            ← 로컬 + API 병행 (오프라인 대응)
```

### 멀티 플랫폼 대응

```
                    mobuto
                      │
        ┌─────────────┼─────────────┐
        웹             앱인토스        PWA/앱
     (Vercel)       (Webview)     (Capacitor)
        │              │              │
        └──────────────┴──────────────┘
                       │
              공통 코어 로직
         (hooks, store, adapter)
```

### Feature Flag

```typescript
const FEATURES = {
  analytics: true,        // 성향 분석
  premium: false,         // 유료 기능
  ads: true,              // 광고
  tossIntegration: false,  // 앱인토스 전용
}
```

### 확장 시 영향 범위

| 확장 시나리오 | 안 건드림 | 추가/수정 |
|---|---|---|
| 백엔드 연동 | todoStore, UI | adapter 추가 |
| 앱인토스 배포 | core 전체 | platform/toss/ 추가 |
| 성향 분석 고도화 | todoStore, adapter | analytics/ 수정 |
| 유료 결제 | core, UI | 결제 모듈 + Feature Flag |
| 다국어 | 로직 전체 | i18n 리소스 추가 |
| 다크모드 | 로직 전체 | Tailwind config + uiStore |

## 코딩 컨벤션

### 원칙
- **SOLID 준수**: 특히 SRP(단일 책임), DIP(의존성 역전 - 어댑터 패턴) 중심
- **주석 없이 읽히는 코드**: 네이밍뿐 아니라 로직 흐름 자체가 읽혀야 함
- **Early Return**: 중첩 인덴트 최소화, 실패 조건 먼저 걸러내기
- **UI/UX 일관성**: 디자인 토큰 + 공통 컴포넌트로 통일

### 네이밍
```
컴포넌트:  PascalCase     → QuadrantGrid, TodoCard
함수:      camelCase      → addTodo, moveToQuadrant
상수:      UPPER_SNAKE    → QUADRANT_COLORS, FEATURES
타입:      PascalCase     → Todo, QuadrantType, StorageAdapter
파일:      컴포넌트는 PascalCase, 나머지 camelCase
```

### 컴포넌트 구조
```typescript
// 1. 타입/인터페이스
// 2. 컴포넌트 (early return으로 예외 먼저 처리)
// 3. 내부 서브 컴포넌트 (있을 경우)

function TodoCard({ todo, onComplete }: TodoCardProps) {
  if (!todo) return null                    // early return

  const isOverdue = todo.dueDate < Date.now()

  return (...)
}
```

### 읽히는 로직 흐름
```typescript
// BAD: 주석 없이는 뭘 하는지 모름
function handle(t: Todo, q: number) {
  const old = t.quadrant
  if (old !== q) {
    t.quadrant = q
    t.quadrantHistory = [...(t.quadrantHistory || []), { from: old, to: q, at: Date.now() }]
    t.updatedAt = Date.now()
    save(t)
  }
}

// GOOD: 코드 자체가 문장처럼 읽힘
function moveTodoToQuadrant(todo: Todo, targetQuadrant: Quadrant) {
  if (todo.quadrant === targetQuadrant) return

  const historyEntry = createQuadrantHistoryEntry(todo.quadrant, targetQuadrant)

  const movedTodo = {
    ...todo,
    quadrant: targetQuadrant,
    quadrantHistory: [...todo.quadrantHistory, historyEntry],
    updatedAt: Date.now(),
  }

  saveTodo(movedTodo)
}
```

**핵심**: 위에서 아래로 읽으면 "이 함수가 뭘 하는지" 자연어처럼 이해되어야 함

### 함수 설계
- 한 함수 = 한 가지 일
- 파라미터 3개 초과 시 객체로 묶기
- 부수효과(side effect) 명확히 분리
- 복잡한 조건은 의미 있는 변수로 추출

### 금지 사항
- `any` 타입 사용 금지
- 매직 넘버/스트링 금지 → 상수화
- 불필요한 주석 금지 (코드로 설명)
- 과도한 추상화 금지 (3회 이상 반복될 때만 추상화)

## 서비스 슬로건

**"오늘, 뭐부터?"**
