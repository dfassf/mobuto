import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { Todo, Quadrant, CreateTodoInput, QuadrantHistoryEntry } from '../models/todo'
import type { Category, CreateCategoryInput } from '../models/category'
import { resolveQuadrant } from '../constants/quadrant'
import type { StorageAdapter } from '../adapters/storageAdapter'
import { LocalStorageAdapter } from '../adapters/localStorageAdapter'

interface TodoState {
  todos: Todo[]
  categories: Category[]
  deletedTodo: Todo | null

  loadTodos: () => void
  addTodo: (input: CreateTodoInput) => void
  updateTodoTitle: (id: string, title: string) => void
  updateTodoCategory: (id: string, categoryId: string | undefined) => void
  completeTodo: (id: string) => void
  restoreTodo: (id: string) => void
  deleteTodo: (id: string) => void
  undoDelete: () => void
  clearDeletedTodo: () => void
  moveTodoToQuadrant: (id: string, targetQuadrant: Quadrant) => void
  reorderTodo: (id: string, newOrder: number) => void
  clearCompleted: (quadrant: Quadrant) => void

  loadCategories: () => void
  addCategory: (input: CreateCategoryInput) => void
  updateCategory: (id: string, input: CreateCategoryInput) => void
  deleteCategory: (id: string) => void
}

const storage: StorageAdapter = new LocalStorageAdapter()

function createQuadrantHistoryEntry(from: Quadrant, to: Quadrant): QuadrantHistoryEntry {
  return { from, to, at: Date.now() }
}

function getNextOrder(todos: Todo[], quadrant: Quadrant): number {
  const todosInQuadrant = todos.filter(
    (t) => t.quadrant === quadrant && t.status === 'active'
  )
  return todosInQuadrant.length
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  categories: [],
  deletedTodo: null,

  loadTodos: () => {
    const now = Date.now()
    const hour = 3600000
    const seed: Todo[] = [
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
    set({ todos: seed })
    storage.save(seed)
  },

  addTodo: (input: CreateTodoInput) => {
    const quadrant = resolveQuadrant(input.isUrgent, input.isImportant)
    const now = Date.now()

    const newTodo: Todo = {
      id: uuidv4(),
      title: input.title,
      quadrant,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      order: getNextOrder(get().todos, quadrant),
      quadrantHistory: [],
      categoryId: input.categoryId,
    }

    const updated = [...get().todos, newTodo]
    set({ todos: updated })
    storage.save(updated)
  },

  updateTodoTitle: (id: string, title: string) => {
    const updated = get().todos.map((todo) => {
      if (todo.id !== id) return todo
      return { ...todo, title, updatedAt: Date.now() }
    })
    set({ todos: updated })
    storage.save(updated)
  },

  completeTodo: (id: string) => {
    const now = Date.now()
    const updated = get().todos.map((todo) => {
      if (todo.id !== id) return todo
      return { ...todo, status: 'completed' as const, completedAt: now, updatedAt: now }
    })
    set({ todos: updated })
    storage.save(updated)
  },

  restoreTodo: (id: string) => {
    const updated = get().todos.map((todo) => {
      if (todo.id !== id) return todo
      return {
        ...todo,
        status: 'active' as const,
        completedAt: undefined,
        updatedAt: Date.now(),
      }
    })
    set({ todos: updated })
    storage.save(updated)
  },

  updateTodoCategory: (id: string, categoryId: string | undefined) => {
    const updated = get().todos.map((todo) => {
      if (todo.id !== id) return todo
      return { ...todo, categoryId, updatedAt: Date.now() }
    })
    set({ todos: updated })
    storage.save(updated)
  },

  deleteTodo: (id: string) => {
    const target = get().todos.find((todo) => todo.id === id)
    const updated = get().todos.filter((todo) => todo.id !== id)
    set({ todos: updated, deletedTodo: target ?? null })
    storage.save(updated)
  },

  undoDelete: () => {
    const { deletedTodo } = get()
    if (!deletedTodo) return
    const updated = [...get().todos, deletedTodo]
    set({ todos: updated, deletedTodo: null })
    storage.save(updated)
  },

  clearDeletedTodo: () => {
    set({ deletedTodo: null })
  },

  moveTodoToQuadrant: (id: string, targetQuadrant: Quadrant) => {
    const updated = get().todos.map((todo) => {
      if (todo.id !== id) return todo
      if (todo.quadrant === targetQuadrant) return todo

      const historyEntry = createQuadrantHistoryEntry(todo.quadrant, targetQuadrant)

      return {
        ...todo,
        quadrant: targetQuadrant,
        quadrantHistory: [...todo.quadrantHistory, historyEntry],
        order: getNextOrder(get().todos, targetQuadrant),
        updatedAt: Date.now(),
      }
    })
    set({ todos: updated })
    storage.save(updated)
  },

  reorderTodo: (id: string, newOrder: number) => {
    const todo = get().todos.find((t) => t.id === id)
    if (!todo) return

    const siblings = get().todos
      .filter((t) => t.quadrant === todo.quadrant && t.status === 'active' && t.id !== id)
      .sort((a, b) => a.order - b.order)

    siblings.splice(newOrder, 0, todo)

    const updated = get().todos.map((t) => {
      if (t.quadrant !== todo.quadrant || t.status !== 'active') return t
      const idx = siblings.findIndex((s) => s.id === t.id)
      if (idx === -1) return t
      return { ...t, order: idx }
    })

    set({ todos: updated })
    storage.save(updated)
  },

  clearCompleted: (quadrant: Quadrant) => {
    const updated = get().todos.filter(
      (t) => !(t.quadrant === quadrant && t.status === 'completed')
    )
    set({ todos: updated })
    storage.save(updated)
  },

  loadCategories: () => {
    const seedCategories: Category[] = [
      { id: 'cat-personal', name: '생활', color: 'emerald', createdAt: 1709200000000 },
      { id: 'cat-money', name: '돈', color: 'orange', createdAt: 1709200000000 },
      { id: 'cat-health', name: '건강', color: 'pink', createdAt: 1709200000000 },
      { id: 'cat-selfdev', name: '자기계발', color: 'violet', createdAt: 1709200000000 },
    ]
    set({ categories: seedCategories })
    storage.saveCategories(seedCategories)
  },

  addCategory: (input: CreateCategoryInput) => {
    const newCategory: Category = {
      id: uuidv4(),
      name: input.name,
      color: input.color,
      createdAt: Date.now(),
    }

    const updated = [...get().categories, newCategory]
    set({ categories: updated })
    storage.saveCategories(updated)
  },

  updateCategory: (id: string, input: CreateCategoryInput) => {
    const updated = get().categories.map((cat) => {
      if (cat.id !== id) return cat
      return { ...cat, name: input.name, color: input.color }
    })
    set({ categories: updated })
    storage.saveCategories(updated)
  },

  deleteCategory: (id: string) => {
    const updatedCategories = get().categories.filter((cat) => cat.id !== id)
    set({ categories: updatedCategories })
    storage.saveCategories(updatedCategories)

    const updatedTodos = get().todos.map((todo) => {
      if (todo.categoryId !== id) return todo
      return { ...todo, categoryId: undefined, updatedAt: Date.now() }
    })
    set({ todos: updatedTodos })
    storage.save(updatedTodos)
  },
}))
