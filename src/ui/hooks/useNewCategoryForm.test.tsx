import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useNewCategoryForm } from './useNewCategoryForm'

describe('useNewCategoryForm', () => {
  it('trim된 이름으로 카테고리를 생성하고 폼을 초기화한다', () => {
    const addCategory = vi.fn()
    const { result } = renderHook(() => useNewCategoryForm({ addCategory }))

    act(() => {
      result.current.setShowNewCategory(true)
      result.current.setNewCategoryName('  업무  ')
      result.current.setNewCategoryColor('violet')
    })
    act(() => {
      result.current.handleCreateCategory()
    })

    expect(addCategory).toHaveBeenCalledWith({ name: '업무', color: 'violet' })
    expect(result.current.showNewCategory).toBe(false)
    expect(result.current.newCategoryName).toBe('')
    expect(result.current.newCategoryColor).toBe('emerald')
  })

  it('빈 이름이면 생성하지 않는다', () => {
    const addCategory = vi.fn()
    const { result } = renderHook(() => useNewCategoryForm({ addCategory }))

    act(() => {
      result.current.setNewCategoryName('   ')
      result.current.handleCreateCategory()
    })

    expect(addCategory).not.toHaveBeenCalled()
  })
})
