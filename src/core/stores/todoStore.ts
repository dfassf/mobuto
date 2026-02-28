import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { Todo, Quadrant, CreateTodoInput, QuadrantHistoryEntry } from '../models/todo'
import { resolveQuadrant } from '../constants/quadrant'
import type { StorageAdapter } from '../adapters/storageAdapter'
import { LocalStorageAdapter } from '../adapters/localStorageAdapter'

interface TodoState {
  todos: Todo[]
  loadTodos: () => void
  addTodo: (input: CreateTodoInput) => void
  updateTodoTitle: (id: string, title: string) => void
  completeTodo: (id: string) => void
  restoreTodo: (id: string) => void
  deleteTodo: (id: string) => void
  moveTodoToQuadrant: (id: string, targetQuadrant: Quadrant) => void
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

  loadTodos: () => {
    const loaded = storage.loadAll()
    set({ todos: loaded })
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

  deleteTodo: (id: string) => {
    const updated = get().todos.filter((todo) => todo.id !== id)
    set({ todos: updated })
    storage.save(updated)
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
}))
