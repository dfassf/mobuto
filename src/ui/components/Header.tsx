import { useState } from 'react'
import { useTodoStore } from '../../core/stores/todoStore'
import { QUADRANT_MAP } from '../../core/constants/quadrant'
import { CATEGORY_COLORS, getCategoryColor } from '../../core/models/category'
import type { Quadrant } from '../../core/models/todo'

const QUADRANT_ORDER: Quadrant[] = [1, 2, 3, 4]

export function Header() {
  const todos = useTodoStore((state) => state.todos)
  const activeTodos = todos.filter((t) => t.status === 'active')
  const completedTodos = todos.filter((t) => t.status === 'completed')
  const [showHelp, setShowHelp] = useState(false)
  const [showCategories, setShowCategories] = useState(false)

  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-800">뭐부터</h1>
            <p className="text-sm text-slate-500">오늘, 뭐부터?</p>
          </div>
          <button
            onClick={() => setShowHelp(true)}
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
            onClick={() => setShowCategories(true)}
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

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showCategories && <CategoryModal onClose={() => setShowCategories(false)} />}
    </>
  )
}

function CategoryModal({ onClose }: { onClose: () => void }) {
  const { categories, addCategory, updateCategory, deleteCategory } = useTodoStore()
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0].name)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState<string>(CATEGORY_COLORS[0].name)

  const handleAdd = () => {
    const trimmed = name.trim()
    if (!trimmed) return

    addCategory({ name: trimmed, color })
    setName('')
    setColor(CATEGORY_COLORS[0].name)
    setIsAdding(false)
  }

  const startEdit = (cat: { id: string; name: string; color: string }) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditColor(cat.color)
  }

  const handleSaveEdit = () => {
    if (!editingId) return
    const trimmed = editName.trim()
    if (!trimmed) return

    updateCategory(editingId, { name: trimmed, color: editColor })
    setEditingId(null)
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-2xl bg-white p-6 shadow-xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">카테고리 관리</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {categories.length === 0 && !isAdding && (
          <p className="mb-4 text-sm text-slate-400">카테고리가 아직 없어요</p>
        )}

        <div className="flex flex-col gap-2">
          {categories.map((cat) => {
            const catColor = getCategoryColor(cat.color)

            if (editingId === cat.id) {
              return (
                <div key={cat.id} className="rounded-lg border border-slate-200 p-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSaveEdit()
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    className="mb-3 w-full border-0 border-b border-slate-200 bg-transparent px-1 py-1.5 text-sm text-slate-800 focus:border-slate-800 focus:outline-none"
                    autoFocus
                  />
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {CATEGORY_COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setEditColor(c.name)}
                        className={`h-6 w-6 rounded-full ${c.dot} transition-transform ${
                          editColor === c.name ? 'ring-2 ring-offset-1 ring-slate-400 scale-110' : ''
                        }`}
                        aria-label={c.name}
                      />
                    ))}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded px-3 py-1 text-xs text-slate-400 hover:text-slate-600"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editName.trim()}
                      className="rounded bg-slate-800 px-3 py-1 text-xs text-white hover:bg-slate-700 disabled:bg-slate-300"
                    >
                      저장
                    </button>
                  </div>
                </div>
              )
            }

            return (
              <div key={cat.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                <button
                  onClick={() => startEdit(cat)}
                  className="flex items-center gap-2 hover:opacity-70"
                >
                  <span className={`h-3 w-3 rounded-full ${catColor.dot}`} />
                  <span className="text-sm text-slate-700">{cat.name}</span>
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(cat)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    aria-label="수정"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
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
          })}
        </div>

        {isAdding ? (
          <div className="mt-3 rounded-lg border border-slate-200 p-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAdd()
                if (e.key === 'Escape') setIsAdding(false)
              }}
              placeholder="카테고리 이름"
              className="mb-3 w-full border-0 border-b border-slate-200 bg-transparent px-1 py-1.5 text-sm text-slate-800 placeholder-slate-300 focus:border-slate-800 focus:outline-none"
              autoFocus
            />

            <div className="mb-3 flex flex-wrap gap-1.5">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  className={`h-6 w-6 rounded-full ${c.dot} transition-transform ${
                    color === c.name ? 'ring-2 ring-offset-1 ring-slate-400 scale-110' : ''
                  }`}
                  aria-label={c.name}
                />
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="rounded px-3 py-1 text-xs text-slate-400 hover:text-slate-600"
              >
                취소
              </button>
              <button
                onClick={handleAdd}
                disabled={!name.trim()}
                className="rounded bg-slate-800 px-3 py-1 text-xs text-white hover:bg-slate-700 disabled:bg-slate-300"
              >
                추가
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="mt-3 w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-sm text-slate-400 hover:border-slate-400 hover:text-slate-600"
          >
            + 새 카테고리
          </button>
        )}
      </div>
    </>
  )
}

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-2xl bg-white p-6 shadow-xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">아이젠하워 매트릭스란?</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          미국 대통령 아이젠하워가 사용한 우선순위 결정법입니다.
          모든 할 일을 <strong>긴급한지</strong>와 <strong>중요한지</strong> 두 가지 기준으로 나눠 4개의 사분면에 배치합니다.
        </p>

        <div className="grid grid-cols-2 gap-2">
          {QUADRANT_ORDER.map((q) => {
            const info = QUADRANT_MAP[q]
            return (
              <div
                key={q}
                className={`rounded-lg border ${info.borderClass} ${info.bgClass} p-3`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-xs font-semibold ${info.colorClass}`}>{info.label}</span>
                  <span className="text-[10px] text-slate-400">{info.action}</span>
                </div>
                <p className="text-xs text-slate-500">{info.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <p className="text-xs leading-relaxed text-slate-500">
            <strong className="text-slate-600">사용법:</strong> 할 일을 추가하면 두 가지 질문을 통해 자동으로 사분면에 배치됩니다. 가장 중요한 건 2사분면(계획 세우기)에 시간을 투자하는 것!
          </p>
        </div>
      </div>
    </>
  )
}
