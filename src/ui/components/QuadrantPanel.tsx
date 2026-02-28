import { useDroppable } from '@dnd-kit/core'
import type { Quadrant } from '../../core/models/todo'
import { QUADRANT_MAP } from '../../core/constants/quadrant'
import { useTodoStore } from '../../core/stores/todoStore'
import { TodoCard } from './TodoCard'

interface QuadrantPanelProps {
  quadrant: Quadrant
}

export function QuadrantPanel({ quadrant }: QuadrantPanelProps) {
  const allTodos = useTodoStore((state) => state.todos)
  const { setNodeRef, isOver } = useDroppable({ id: quadrant })

  const todos = allTodos
    .filter((t) => t.quadrant === quadrant && t.status === 'active')
    .sort((a, b) => a.order - b.order)

  const completedTodos = allTodos
    .filter((t) => t.quadrant === quadrant && t.status === 'completed')
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))

  const info = QUADRANT_MAP[quadrant]
  const totalCount = todos.length + completedTodos.length

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border-2 transition-colors ${info.bgClass} p-3 min-h-[200px] ${
        isOver
          ? `${info.borderClass} ring-2 ring-offset-1 ${info.colorClass.replace('text-', 'ring-')}`
          : info.borderClass
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${info.colorClass}`}>
            {info.label}
          </span>
          <span className="text-xs text-slate-400">
            {info.action}
          </span>
        </div>
        {totalCount > 0 && (
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs text-slate-500">
            {todos.length}/{totalCount}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} />
        ))}

        {completedTodos.length > 0 && (
          <div className="mt-2 border-t border-slate-200/50 pt-2">
            <p className="mb-1 text-xs text-slate-400">완료됨</p>
            {completedTodos.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        )}

        {totalCount === 0 && (
          <p className="mt-4 text-center text-xs text-slate-400">
            {info.description}
          </p>
        )}
      </div>
    </div>
  )
}
