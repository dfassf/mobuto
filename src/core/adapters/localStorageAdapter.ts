import type { Todo } from '../models/todo'
import type { Category } from '../models/category'
import type { StorageAdapter } from './storageAdapter'

const TODOS_KEY = 'mobuto_todos'
const CATEGORIES_KEY = 'mobuto_categories'

export class LocalStorageAdapter implements StorageAdapter {
  loadAll(): Todo[] {
    const raw = localStorage.getItem(TODOS_KEY)
    if (!raw) return []

    try {
      return JSON.parse(raw) as Todo[]
    } catch {
      return []
    }
  }

  save(todos: Todo[]): void {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos))
  }

  loadCategories(): Category[] {
    const raw = localStorage.getItem(CATEGORIES_KEY)
    if (!raw) return []

    try {
      return JSON.parse(raw) as Category[]
    } catch {
      return []
    }
  }

  saveCategories(categories: Category[]): void {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  }
}
