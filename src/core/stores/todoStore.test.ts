import { beforeEach, describe, expect, it } from 'vitest'
import { useTodoStore } from './todoStore'

function resetStore() {
  useTodoStore.setState(useTodoStore.getInitialState(), true)
}

describe('todoStore', () => {
  beforeEach(() => {
    localStorage.clear()
    resetStore()
  })

  it('할 일을 추가하고 사분면/정렬값을 설정한다', () => {
    useTodoStore.getState().addTodo({
      title: '중요하고 긴급한 일',
      isUrgent: true,
      isImportant: true,
    })

    const [todo] = useTodoStore.getState().todos
    expect(todo.title).toBe('중요하고 긴급한 일')
    expect(todo.quadrant).toBe(1)
    expect(todo.order).toBe(0)
    expect(todo.status).toBe('active')
  })

  it('완료 후 복원하면 상태와 completedAt이 갱신된다', () => {
    useTodoStore.getState().addTodo({
      title: '테스트',
      isUrgent: false,
      isImportant: true,
    })
    const id = useTodoStore.getState().todos[0].id

    useTodoStore.getState().completeTodo(id)
    let todo = useTodoStore.getState().todos[0]
    expect(todo.status).toBe('completed')
    expect(todo.completedAt).toBeTypeOf('number')

    useTodoStore.getState().restoreTodo(id)
    todo = useTodoStore.getState().todos[0]
    expect(todo.status).toBe('active')
    expect(todo.completedAt).toBeUndefined()
  })

  it('삭제 후 되돌리기가 동작한다', () => {
    useTodoStore.getState().addTodo({
      title: '삭제 대상',
      isUrgent: false,
      isImportant: false,
    })
    const id = useTodoStore.getState().todos[0].id

    useTodoStore.getState().deleteTodo(id)
    expect(useTodoStore.getState().todos).toHaveLength(0)
    expect(useTodoStore.getState().deletedTodo?.id).toBe(id)

    useTodoStore.getState().undoDelete()
    expect(useTodoStore.getState().todos).toHaveLength(1)
    expect(useTodoStore.getState().deletedTodo).toBeNull()
  })

  it('사분면 이동 시 이력과 order를 갱신한다', () => {
    useTodoStore.getState().addTodo({
      title: '이동할 일',
      isUrgent: true,
      isImportant: true,
    })
    const id = useTodoStore.getState().todos[0].id

    useTodoStore.getState().moveTodoToQuadrant(id, 2)
    const todo = useTodoStore.getState().todos[0]

    expect(todo.quadrant).toBe(2)
    expect(todo.quadrantHistory).toHaveLength(1)
    expect(todo.quadrantHistory[0].from).toBe(1)
    expect(todo.quadrantHistory[0].to).toBe(2)
  })

  it('같은 사분면 내 reorder가 동작한다', () => {
    useTodoStore.getState().addTodo({
      title: '첫 번째',
      isUrgent: true,
      isImportant: true,
    })
    useTodoStore.getState().addTodo({
      title: '두 번째',
      isUrgent: true,
      isImportant: true,
    })

    const todos = useTodoStore.getState().todos
    const firstId = todos[0].id
    useTodoStore.getState().reorderTodo(firstId, 1)

    const reordered = useTodoStore
      .getState()
      .todos
      .filter((t) => t.quadrant === 1)
      .sort((a, b) => a.order - b.order)

    expect(reordered[0].title).toBe('두 번째')
    expect(reordered[1].title).toBe('첫 번째')
  })

  it('카테고리 삭제 시 연결된 todo categoryId를 해제한다', () => {
    useTodoStore.getState().addCategory({ name: '업무', color: 'emerald' })
    const categoryId = useTodoStore.getState().categories[0].id

    useTodoStore.getState().addTodo({
      title: '카테고리 달린 일',
      isUrgent: false,
      isImportant: true,
      categoryId,
    })

    useTodoStore.getState().deleteCategory(categoryId)
    const todo = useTodoStore.getState().todos[0]

    expect(useTodoStore.getState().categories).toHaveLength(0)
    expect(todo.categoryId).toBeUndefined()
  })
})
