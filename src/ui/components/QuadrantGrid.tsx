import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import type { Quadrant, Todo } from '../../core/models/todo'
import { useTodoStore } from '../../core/stores/todoStore'
import { QuadrantPanel } from './QuadrantPanel'
import { TodoCardOverlay } from './TodoCard'

const QUADRANT_ORDER: Quadrant[] = [1, 2, 3, 4]

interface QuadrantGridProps {
  filterCategoryId: string | null
}

function parseQuadrantFromId(id: string | number): Quadrant | null {
  const str = String(id)
  if (str.startsWith('quadrant-')) {
    const num = Number(str.replace('quadrant-', ''))
    if (num >= 1 && num <= 4) return num as Quadrant
  }
  return null
}

export function QuadrantGrid({ filterCategoryId }: QuadrantGridProps) {
  const { todos, moveTodoToQuadrant, reorderTodo } = useTodoStore()
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const todo = todos.find((t) => t.id === event.active.id)
    if (todo) setActiveTodo(todo)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTodo(null)

    if (!over) return

    const todoId = active.id as string
    const todo = todos.find((t) => t.id === todoId)
    if (!todo) return

    // Dropped on a quadrant droppable
    const targetQuadrant = parseQuadrantFromId(over.id)
    if (targetQuadrant) {
      if (todo.quadrant !== targetQuadrant) {
        moveTodoToQuadrant(todoId, targetQuadrant)
      }
      return
    }

    // Dropped on another todo (same-quadrant reorder)
    const overTodo = todos.find((t) => t.id === over.id)
    if (overTodo && overTodo.quadrant === todo.quadrant && overTodo.id !== todo.id) {
      const siblings = todos
        .filter((t) => t.quadrant === todo.quadrant && t.status === 'active')
        .sort((a, b) => a.order - b.order)
      const overIndex = siblings.findIndex((t) => t.id === overTodo.id)
      if (overIndex !== -1) {
        reorderTodo(todoId, overIndex)
      }
    } else if (overTodo && overTodo.quadrant !== todo.quadrant) {
      // Dropped on a todo in a different quadrant
      moveTodoToQuadrant(todoId, overTodo.quadrant)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {QUADRANT_ORDER.map((quadrant) => (
          <QuadrantPanel key={quadrant} quadrant={quadrant} filterCategoryId={filterCategoryId} />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTodo && <TodoCardOverlay todo={activeTodo} />}
      </DragOverlay>
    </DndContext>
  )
}
