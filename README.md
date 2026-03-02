# 뭐부터 (mobuto)

> 오늘, 뭐부터?

아이젠하워 매트릭스 기반 할 일 관리 서비스. 두 가지 질문(긴급한가요? 중요한가요?)으로 할 일의 우선순위를 자동 분류합니다.

## 주요 기능

- **자동 사분면 배치** — 긴급/중요 여부에 따라 4개 사분면에 자동 분류
- **드래그 앤 드롭** — 사분면 간 할 일 이동 (마우스 & 터치 지원)
- **인라인 편집** — 할 일 제목 즉시 수정
- **완료/복원/삭제** — 할 일 상태 관리
- **도움말** — 아이젠하워 매트릭스 설명 모달
- **LocalStorage 영속화** — 새로고침 후에도 데이터 유지
- **모바일 퍼스트** — 반응형 UI (1열 → 2열 그리드)

## 기술 스택

| 구분 | 선택 |
|------|------|
| 프레임워크 | React 19 + TypeScript |
| 빌드 | Vite |
| 스타일링 | Tailwind CSS v4 |
| 상태 관리 | Zustand |
| DnD | @dnd-kit |
| 저장소 | LocalStorage (어댑터 패턴으로 API 전환 가능) |

## 시작하기

```bash
npm install
npm run dev
```

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |

## 프로젝트 구조

```
src/
├── core/                  # 플랫폼 무관 비즈니스 로직
│   ├── models/            # 데이터 모델 (Todo, Quadrant)
│   ├── constants/         # 사분면 메타데이터, 피처 플래그
│   ├── stores/            # Zustand 스토어
│   └── adapters/          # 저장소 어댑터 (LocalStorage / API)
├── ui/                    # UI 레이어
│   ├── components/        # 재사용 컴포넌트
│   └── pages/             # 페이지 컴포넌트
└── App.tsx
```

## 아키텍처

- **어댑터 패턴**: `StorageAdapter` 인터페이스로 LocalStorage ↔ API 전환 용이
- **core/ui 분리**: 비즈니스 로직은 UI에 의존하지 않음
- **피처 플래그**: 분석, 프리미엄, 광고 등 기능별 토글 준비

## 수익화 로드맵

### 1차: 배너 광고 (출시 시점)
- 사분면 그리드 하단에 리스트형 배너 1개
- 할 일 추가/완료 등 핵심 플로우에는 광고 없음
- 앱인토스 인앱 광고 SDK 사용 (`@apps-in-toss/web-framework`)

### 2차: 토스 로그인 + 클라우드 저장 (1차 수익 모델)
- 토스 로그인 연동 (mTLS 인증서 필요)
- 유저별 데이터 서버 저장 — localStorage 데이터 유실 방지가 결제 동기
- `StorageAdapter` → `CloudStorageAdapter` 추가로 전환
- 인앱 결제로 클라우드 저장 기능 유료화

### 3차: 프리미엄 기능 (2차 수익 모델)
- 1~2차 운영 데이터 기반으로 프리미엄 기능 결정
- 후보: 통계/리포트, 카테고리 무제한, 테마, 반복 할 일 등

### 4차: 광고 세분화
- 무료 유저 대상 전면형 광고 추가 (핵심 플로우 외 구간)
- 프리미엄 유저는 광고 제거

## 앱인토스 배포

hakamaka(할까말까)와 동일한 구성으로 앱인토스 출시 예정. 참고: `/app-in-toss/` 문서 및 `/hakamaka/frontend/`

### 필요 작업
- `@apps-in-toss/web-framework` 의존성 추가
- `granite.config.ts` 설정 (appName, brand, web)
- `src/intoss.ts` 환경 감지 유틸 추가
- package.json에 `intoss:dev`, `intoss:build` 스크립트 추가
- `granite build` → `.ait` 파일 생성 후 콘솔 업로드

### 참고사항
- TDS(토스 디자인 시스템) 미사용 — Tailwind CSS 유지 (hakamaka 선례)
- mTLS는 1차 출시에 불필요 (앱인토스 API 미사용 시)
- 2차에서 토스 로그인/결제 붙일 때 mTLS 적용

## 라이선스

Private
