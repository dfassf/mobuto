import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAddTodoFlow } from './useAddTodoFlow'

describe('useAddTodoFlow', () => {
  it('title -> category -> urgent -> important 흐름으로 진행된다', () => {
    const addTodo = vi.fn()
    const onClose = vi.fn()

    const { result } = renderHook(() => useAddTodoFlow({ addTodo, onClose }))

    act(() => {
      result.current.setTitle('  해야 할 일  ')
    })
    act(() => {
      result.current.handleTitleSubmit()
    })
    expect(result.current.step).toBe('category')

    act(() => {
      result.current.handleCategorySelect('c1')
    })
    expect(result.current.step).toBe('urgent')

    act(() => {
      result.current.handleUrgentSelect(true)
    })
    expect(result.current.step).toBe('important')

    act(() => {
      result.current.handleImportantSelect(false)
    })

    expect(addTodo).toHaveBeenCalledWith({
      title: '해야 할 일',
      isUrgent: true,
      isImportant: false,
      categoryId: 'c1',
    })
    expect(onClose).toHaveBeenCalled()
    expect(result.current.step).toBe('title')
    expect(result.current.title).toBe('')
  })
})
