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
    const saved = storage.loadAll()
    set({ todos: saved })
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
    const saved = storage.loadCategories()
    set({ categories: saved })
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
