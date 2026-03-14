import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LocalStorageAdapter } from './localStorageAdapter'

describe('LocalStorageAdapter', () => {
  const adapter = new LocalStorageAdapter()

  beforeEach(() => {
    localStorage.clear()
  })

  it('저장된 todo가 없으면 빈 배열을 반환한다', () => {
    expect(adapter.loadAll()).toEqual([])
  })

  it('손상된 todo JSON이면 빈 배열을 반환한다', () => {
    localStorage.setItem('mobuto_todos', '{invalid')

    expect(adapter.loadAll()).toEqual([])
  })

  it('todo 저장/조회가 동작한다', () => {
    const todos = [
      {
        id: 't1',
        title: '테스트',
        quadrant: 1 as const,
        status: 'active' as const,
        createdAt: 1,
        updatedAt: 1,
        order: 0,
        quadrantHistory: [],
      },
    ]

    adapter.save(todos)
    expect(adapter.loadAll()).toEqual(todos)
  })

  it('save가 localStorage 예외를 삼킨다', () => {
    const setItemSpy = vi
      .spyOn(localStorage, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota exceeded')
      })

    expect(() => adapter.save([])).not.toThrow()
    expect(setItemSpy).toHaveBeenCalled()
  })

  it('카테고리 저장/조회가 동작한다', () => {
    const categories = [{ id: 'c1', name: '업무', color: 'emerald', createdAt: 1 }]

    adapter.saveCategories(categories)
    expect(adapter.loadCategories()).toEqual(categories)
  })

  it('saveCategories가 localStorage 예외를 삼킨다', () => {
    const setItemSpy = vi
      .spyOn(localStorage, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota exceeded')
      })

    expect(() => adapter.saveCategories([])).not.toThrow()
    expect(setItemSpy).toHaveBeenCalled()
  })
})
