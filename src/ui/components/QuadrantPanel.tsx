import React, { useEffect, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Quadrant } from '../../core/models/todo'
import { QUADRANT_MAP } from '../../core/constants/quadrant'
import { useTodoStore } from '../../core/stores/todoStore'
import { TodoCard } from './TodoCard'

interface QuadrantPanelProps {
  quadrant: Quadrant
  filterCategoryId: string | null
}

export function QuadrantPanel({ quadrant, filterCategoryId }: QuadrantPanelProps) {
  const allTodos = useTodoStore((state) => state.todos)
  const deletedTodo = useTodoStore((state) => state.deletedTodo)
  const undoDelete = useTodoStore((state) => state.undoDelete)
  const clearDeletedTodo = useTodoStore((state) => state.clearDeletedTodo)
  const clearCompleted = useTodoStore((state) => state.clearCompleted)
  const { setNodeRef, isOver } = useDroppable({ id: `quadrant-${quadrant}` })

  const showUndo = deletedTodo?.quadrant === quadrant
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!showUndo) {
      setFading(false)
      return
    }
    const fadeTimer = window.setTimeout(() => setFading(true), 4000)
    const clearTimer = window.setTimeout(() => clearDeletedTodo(), 5000)
    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(clearTimer)
    }
  }, [showUndo, deletedTodo?.id, clearDeletedTodo])

  const handleUndo = () => {
    undoDelete()
  }

  const matchesFilter = (t: { categoryId?: string }) =>
    filterCategoryId === null || t.categoryId === filterCategoryId

  const todos = allTodos
    .filter((t) => t.quadrant === quadrant && t.status === 'active' && matchesFilter(t))
    .sort((a, b) => a.order - b.order)

  const completedTodos = allTodos
    .filter((t) => t.quadrant === quadrant && t.status === 'completed' && matchesFilter(t))
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
        <SortableContext items={[...todos, ...completedTodos].map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {todos.map((todo, i) => (
            <React.Fragment key={todo.id}>
              {showUndo && deletedTodo.status === 'active' && deletedTodo.order === i && (
                <UndoBar title={deletedTodo.title} fading={fading} onUndo={handleUndo} />
              )}
              <TodoCard todo={todo} />
            </React.Fragment>
          ))}
        {showUndo && deletedTodo.status === 'active' && deletedTodo.order >= todos.length && (
          <UndoBar title={deletedTodo.title} fading={fading} onUndo={handleUndo} />
        )}

        {completedTodos.length > 0 && (
          <div className="mt-2 border-t border-slate-200/50 pt-2">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs text-slate-400">다 했어요</p>
              <button
                onClick={() => clearCompleted(quadrant)}
                className="rounded px-1.5 py-0.5 text-[11px] text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                모두 지우기
              </button>
            </div>
            {completedTodos.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        )}
        {showUndo && deletedTodo.status === 'completed' && (
          <UndoBar title={deletedTodo.title} fading={fading} onUndo={handleUndo} />
        )}
        </SortableContext>

        {totalCount === 0 && !showUndo && (
          <p className="mt-4 text-center text-xs text-slate-400">
            {info.description}
          </p>
        )}
      </div>
    </div>
  )
}

function UndoBar({ title, fading, onUndo }: { title: string; fading: boolean; onUndo: () => void }) {
  return (
    <div
      className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-2 backdrop-blur-sm border border-slate-200/50"
      style={{
        opacity: fading ? 0 : 0.85,
        transition: 'opacity 1s ease-out',
      }}
    >
      <span className="text-xs text-slate-400">
        <span className="text-slate-500">{title}</span> 지웠어요
      </span>
      <button
        onClick={onUndo}
        className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
      >
        되돌리기
      </button>
    </div>
  )
}
