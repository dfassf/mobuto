import type { Todo } from '../models/todo'
import type { StorageAdapter } from './storageAdapter'

const STORAGE_KEY = 'mobuto_todos'

export class LocalStorageAdapter implements StorageAdapter {
  loadAll(): Todo[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    try {
      return JSON.parse(raw) as Todo[]
    } catch {
      return []
    }
  }

  save(todos: Todo[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}
