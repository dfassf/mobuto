import { useState, useRef, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Todo } from '../../core/models/todo'
import { getCategoryColor } from '../../core/models/category'
import { useTodoStore } from '../../core/stores/todoStore'

interface TodoCardProps {
  todo: Todo
}

export function TodoCard({ todo }: TodoCardProps) {
  const { completeTodo, restoreTodo, deleteTodo, updateTodoTitle, updateTodoCategory, categories } = useTodoStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showCategoryPicker) return
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowCategoryPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCategoryPicker])

  const isCompleted = todo.status === 'completed'

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
    disabled: isEditing,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim()
    if (!trimmed) return

    updateTodoTitle(todo.id, trimmed)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveEdit()
    if (e.key === 'Escape') {
      setEditTitle(todo.title)
      setIsEditing(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group flex items-center gap-2 rounded-lg bg-white p-3 shadow-sm border border-slate-100 transition-colors hover:border-slate-200 ${
        isDragging ? 'opacity-30' : ''
      }`}
    >
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        className="flex shrink-0 cursor-grab items-center text-slate-300 hover:text-slate-400 active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        aria-label="드래그 핸들"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </div>

      <button
        onClick={() => (isCompleted ? restoreTodo(todo.id) : completeTodo(todo.id))}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          isCompleted
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 hover:border-slate-400'
        }`}
        aria-label={isCompleted ? '복원' : '완료'}
      >
        {isCompleted && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <input
        type="text"
        value={isEditing ? editTitle : todo.title}
        readOnly={!isEditing}
        onChange={(e) => setEditTitle(e.target.value)}
        onBlur={() => isEditing && handleSaveEdit()}
        onKeyDown={(e) => isEditing && handleKeyDown(e)}
        onClick={() => !isCompleted && !isEditing && setIsEditing(true)}
        ref={(el) => { if (el && isEditing) el.focus() }}
        className={`min-w-0 flex-1 border-none bg-transparent p-0 text-sm leading-snug focus:outline-none ${
          isCompleted
            ? 'text-slate-400 line-through pointer-events-none'
            : isEditing
              ? 'text-slate-800 cursor-text'
              : 'text-slate-800 cursor-pointer'
        }`}
      />

      {categories.length > 0 && (
        <div className="relative shrink-0" ref={pickerRef}>
          {(() => {
            const category = categories.find((c) => c.id === todo.categoryId)
            const color = category ? getCategoryColor(category.color) : null
            return (
              <>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    color
                      ? `${color.bg} ${color.text} hover:opacity-80`
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {category ? category.name : '없음'}
                </button>

                {showCategoryPicker && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                    <button
                      onClick={() => { updateTodoCategory(todo.id, undefined); setShowCategoryPicker(false) }}
                      className="w-full rounded px-2 py-1.5 text-left text-xs text-slate-400 hover:bg-slate-50"
                    >
                      없음
                    </button>
                    {categories.map((cat) => {
                      const catColor = getCategoryColor(cat.color)
                      return (
                        <button
                          key={cat.id}
                          onClick={() => { updateTodoCategory(todo.id, cat.id); setShowCategoryPicker(false) }}
                          className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-slate-50 ${
                            cat.id === todo.categoryId ? 'font-medium' : ''
                          }`}
                        >
                          <span className={`h-2.5 w-2.5 rounded-full ${catColor.dot}`} />
                          <span className="text-slate-700">{cat.name}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </>
            )
          })()}
        </div>
      )}

      <div className="flex shrink-0 gap-1">
        {!isCompleted && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="수정"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
            </svg>
          </button>
        )}

        <button
          onClick={() => deleteTodo(todo.id)}
          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
          aria-label="삭제"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function TodoCardOverlay({ todo }: TodoCardProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white p-3 shadow-lg border-2 border-slate-300 opacity-90 rotate-2 scale-105">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300" />
      <span className="text-sm text-slate-800">{todo.title}</span>
    </div>
  )
}
