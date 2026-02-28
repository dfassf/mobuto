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

export function QuadrantGrid() {
  const { todos, moveTodoToQuadrant } = useTodoStore()
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
    const targetQuadrant = over.id as Quadrant

    const todo = todos.find((t) => t.id === todoId)
    if (!todo || todo.quadrant === targetQuadrant) return

    moveTodoToQuadrant(todoId, targetQuadrant)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {QUADRANT_ORDER.map((quadrant) => (
          <QuadrantPanel key={quadrant} quadrant={quadrant} />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTodo && <TodoCardOverlay todo={activeTodo} />}
      </DragOverlay>
    </DndContext>
  )
}
