import type { Todo } from '../models/todo'

export interface StorageAdapter {
  loadAll(): Todo[]
  save(todos: Todo[]): void
}
