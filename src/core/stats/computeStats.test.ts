import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Category } from '../models/category'
import type { Quadrant, Todo } from '../models/todo'
import {
  buildWeeklyReport,
  formatDuration,
  getCompletionByQuadrant,
  getFlowInsight,
  getTimeSpent,
} from './computeStats'

function makeCompletedTodo(params: {
  id: string
  title: string
  quadrant: Quadrant
  categoryId?: string
  createdAt: string
  completedAt: string
}): Todo {
  return {
    id: params.id,
    title: params.title,
    quadrant: params.quadrant,
    status: 'completed',
    createdAt: new Date(params.createdAt).getTime(),
    updatedAt: new Date(params.completedAt).getTime(),
    completedAt: new Date(params.completedAt).getTime(),
    order: 0,
    quadrantHistory: [],
    categoryId: params.categoryId,
  }
}

describe('computeStats', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('기간 내 완료된 할 일을 사분면별로 집계한다', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-18T09:00:00+09:00'))

    const todos: Todo[] = [
      makeCompletedTodo({
        id: 't1',
        title: 'Q1',
        quadrant: 1,
        createdAt: '2026-03-17T09:00:00+09:00',
        completedAt: '2026-03-17T10:00:00+09:00',
      }),
      makeCompletedTodo({
        id: 't2',
        title: 'Q2',
        quadrant: 2,
        createdAt: '2026-03-18T09:00:00+09:00',
        completedAt: '2026-03-18T10:00:00+09:00',
      }),
      makeCompletedTodo({
        id: 't3',
        title: 'old',
        quadrant: 3,
        createdAt: '2026-03-10T09:00:00+09:00',
        completedAt: '2026-03-10T10:00:00+09:00',
      }),
    ]

    const weekly = getCompletionByQuadrant(todos, 'week')
    expect(weekly).toEqual([
      { quadrant: 1, count: 1 },
      { quadrant: 2, count: 1 },
      { quadrant: 3, count: 0 },
      { quadrant: 4, count: 0 },
    ])
  })

  it('사분면 이동 패턴 인사이트를 계산한다', () => {
    const todos: Todo[] = [
      {
        id: 't1',
        title: '이동',
        quadrant: 2,
        status: 'active',
        createdAt: 1,
        updatedAt: 1,
        order: 0,
        quadrantHistory: [
          { from: 1, to: 2, at: 1 },
          { from: 1, to: 2, at: 2 },
          { from: 4, to: 1, at: 3 },
        ],
      },
    ]

    const result = getFlowInsight(todos)

    expect(result.totalMovements).toBe(3)
    expect(result.topPattern).toEqual({ from: 1, to: 2, count: 2 })
    expect(result.insight).toContain('긴급한 일을 계획으로 잘 옮기고 있어요')
  })

  it('소요 시간 목록을 긴 순서대로 반환한다', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-18T09:00:00+09:00'))

    const todos: Todo[] = [
      makeCompletedTodo({
        id: 'short',
        title: '짧은 일',
        quadrant: 1,
        createdAt: '2026-03-18T09:00:00+09:00',
        completedAt: '2026-03-18T09:30:00+09:00',
      }),
      makeCompletedTodo({
        id: 'long',
        title: '긴 일',
        quadrant: 2,
        createdAt: '2026-03-17T09:00:00+09:00',
        completedAt: '2026-03-18T09:00:00+09:00',
      }),
    ]

    const result = getTimeSpent(todos, 'week')

    expect(result[0].todoId).toBe('long')
    expect(result[1].todoId).toBe('short')
  })

  it('주간 리포트를 계산한다', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-18T09:00:00+09:00'))

    const todos: Todo[] = [
      makeCompletedTodo({
        id: 't1',
        title: '중요1',
        quadrant: 1,
        categoryId: 'c1',
        createdAt: '2026-03-17T08:00:00+09:00',
        completedAt: '2026-03-17T09:00:00+09:00',
      }),
      makeCompletedTodo({
        id: 't2',
        title: '중요2',
        quadrant: 2,
        categoryId: 'c1',
        createdAt: '2026-03-18T08:00:00+09:00',
        completedAt: '2026-03-18T10:00:00+09:00',
      }),
      makeCompletedTodo({
        id: 't3',
        title: '잡일',
        quadrant: 3,
        categoryId: 'c2',
        createdAt: '2026-03-18T10:00:00+09:00',
        completedAt: '2026-03-18T10:30:00+09:00',
      }),
    ]

    const categories: Category[] = [
      { id: 'c1', name: '업무', color: 'emerald', createdAt: 1 },
      { id: 'c2', name: '집안일', color: 'blue', createdAt: 1 },
    ]

    const report = buildWeeklyReport(todos, categories)

    expect(report.totalCompleted).toBe(3)
    expect(report.topCategory).toEqual({ name: '업무', count: 2 })
    expect(report.focusScore).toBe(67)
    expect(report.longestTodo?.title).toBe('중요2')
    expect(report.fastestTodo?.title).toBe('잡일')
    expect(report.comment).toContain('균형')
  })

  it('duration 문자열을 사람이 읽기 쉽게 포맷한다', () => {
    expect(formatDuration(-1)).toBe('-')
    expect(formatDuration(10_000)).toBe('1분 미만')
    expect(formatDuration(30 * 60_000)).toBe('30분')
    expect(formatDuration(2 * 60 * 60_000)).toBe('2시간')
    expect(formatDuration(27 * 60 * 60_000)).toBe('1일 3시간')
  })
})
