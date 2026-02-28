import type { Todo } from '../models/todo'
import type { Category } from '../models/category'

export interface StorageAdapter {
  loadAll(): Todo[]
  save(todos: Todo[]): void
  loadCategories(): Category[]
  saveCategories(categories: Category[]): void
}
