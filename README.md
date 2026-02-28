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

## 라이선스

Private
