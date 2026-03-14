import { useState } from 'react'
import { useTodoStore } from '../../core/stores/todoStore'
import { HelpModal } from './HelpModal'
import { CategoryModal } from './CategoryModal'

interface HeaderProps {
  onModalChange?: (isOpen: boolean) => void
}

export function Header({ onModalChange }: HeaderProps) {
  const todos = useTodoStore((state) => state.todos)
  const activeTodos = todos.filter((t) => t.status === 'active')
  const completedTodos = todos.filter((t) => t.status === 'completed')
  const [showHelp, setShowHelp] = useState(false)
  const [showCategories, setShowCategories] = useState(false)

  const openModal = (setter: typeof setShowHelp) => {
    setter(true)
    onModalChange?.(true)
  }
  const closeModal = (setter: typeof setShowHelp) => {
    setter(false)
    onModalChange?.(false)
  }

  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-800">모부터</h1>
            <p className="text-sm text-slate-500">오늘, 모부터?</p>
          </div>
          <button
            onClick={() => openModal(setShowHelp)}
            className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors"
            aria-label="도움말"
          >
            <span className="text-xs font-medium leading-none">?</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {todos.length > 0 && (
            <div className="flex gap-3 text-xs text-slate-400">
              <span>할 일 {activeTodos.length}</span>
              <span>완료 {completedTodos.length}</span>
            </div>
          )}
          <button
            onClick={() => openModal(setShowCategories)}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="카테고리 관리"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
          </button>
        </div>
      </header>

      {showHelp && <HelpModal onClose={() => closeModal(setShowHelp)} />}
      {showCategories && <CategoryModal onClose={() => closeModal(setShowCategories)} />}
    </>
  )
}
