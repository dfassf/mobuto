export type Quadrant = 1 | 2 | 3 | 4

export type TodoStatus = 'active' | 'completed' | 'deleted'

export interface QuadrantHistoryEntry {
  from: Quadrant
  to: Quadrant
  at: number
}

export interface Todo {
  id: string
  title: string
  quadrant: Quadrant
  status: TodoStatus
  createdAt: number
  updatedAt: number
  completedAt?: number
  order: number
  quadrantHistory: QuadrantHistoryEntry[]
  categoryId?: string
}

export interface CreateTodoInput {
  title: string
  isUrgent: boolean
  isImportant: boolean
  categoryId?: string
}
