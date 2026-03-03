import type { Todo } from '../models/todo'
import type { Category } from '../models/category'

export function createSeedTodos(): Todo[] {
  const now = Date.now()
  const hour = 3600000

  return [
    { id: 's01', title: '월세 이체하기', quadrant: 1, status: 'active', createdAt: now - hour * 2, updatedAt: now - hour * 2, order: 0, quadrantHistory: [], categoryId: 'cat-money' },
    { id: 's02', title: '건강검진 예약 (이번 주 마감)', quadrant: 1, status: 'active', createdAt: now - hour * 3, updatedAt: now - hour * 3, order: 1, quadrantHistory: [], categoryId: 'cat-health' },
    { id: 's03', title: '엄마 생신 선물 주문', quadrant: 1, status: 'active', createdAt: now - hour * 5, updatedAt: now - hour * 5, order: 2, quadrantHistory: [], categoryId: 'cat-personal' },
    { id: 's04', title: '관리비 납부', quadrant: 1, status: 'completed', createdAt: now - hour * 10, updatedAt: now - hour * 1, completedAt: now - hour * 1, order: 3, quadrantHistory: [], categoryId: 'cat-money' },
    { id: 's05', title: '자격증 공부 계획 세우기', quadrant: 2, status: 'active', createdAt: now - hour * 24, updatedAt: now - hour * 24, order: 0, quadrantHistory: [], categoryId: 'cat-selfdev' },
    { id: 's06', title: '주 3회 운동 루틴 만들기', quadrant: 2, status: 'active', createdAt: now - hour * 48, updatedAt: now - hour * 48, order: 1, quadrantHistory: [], categoryId: 'cat-health' },
    { id: 's07', title: '여행 경비 계획 짜기', quadrant: 2, status: 'active', createdAt: now - hour * 36, updatedAt: now - hour * 36, order: 2, quadrantHistory: [], categoryId: 'cat-money' },
    { id: 's08', title: '독서 목록 정리 (3월)', quadrant: 2, status: 'active', createdAt: now - hour * 12, updatedAt: now - hour * 12, order: 3, quadrantHistory: [], categoryId: 'cat-selfdev' },
    { id: 's09', title: '이력서 업데이트', quadrant: 2, status: 'completed', createdAt: now - hour * 72, updatedAt: now - hour * 6, completedAt: now - hour * 6, order: 4, quadrantHistory: [], categoryId: 'cat-selfdev' },
    { id: 's10', title: '택배 수령 — 오늘 도착', quadrant: 3, status: 'active', createdAt: now - hour * 1, updatedAt: now - hour * 1, order: 0, quadrantHistory: [], categoryId: 'cat-personal' },
    { id: 's11', title: '친구 결혼식 축의금 준비', quadrant: 3, status: 'active', createdAt: now - hour * 4, updatedAt: now - hour * 4, order: 1, quadrantHistory: [], categoryId: 'cat-personal' },
    { id: 's12', title: '장보기 — 우유, 계란, 양파', quadrant: 3, status: 'active', createdAt: now - hour * 2, updatedAt: now - hour * 2, order: 2, quadrantHistory: [], categoryId: 'cat-personal' },
    { id: 's13', title: '세탁물 찾아오기', quadrant: 3, status: 'completed', createdAt: now - hour * 8, updatedAt: now - hour * 3, completedAt: now - hour * 3, order: 3, quadrantHistory: [], categoryId: 'cat-personal' },
    { id: 's14', title: 'SNS 피드 정리', quadrant: 4, status: 'active', createdAt: now - hour * 48, updatedAt: now - hour * 48, order: 0, quadrantHistory: [] },
    { id: 's15', title: '넷플릭스 보관함 정리', quadrant: 4, status: 'active', createdAt: now - hour * 72, updatedAt: now - hour * 72, order: 1, quadrantHistory: [] },
    { id: 's16', title: '옷장 정리', quadrant: 4, status: 'completed', createdAt: now - hour * 24, updatedAt: now - hour * 12, completedAt: now - hour * 12, order: 2, quadrantHistory: [], categoryId: 'cat-personal' },
  ]
}

export function createSeedCategories(): Category[] {
  return [
    { id: 'cat-personal', name: '생활', color: 'emerald', createdAt: 1709200000000 },
    { id: 'cat-money', name: '돈', color: 'orange', createdAt: 1709200000000 },
    { id: 'cat-health', name: '건강', color: 'pink', createdAt: 1709200000000 },
    { id: 'cat-selfdev', name: '자기계발', color: 'violet', createdAt: 1709200000000 },
  ]
}
