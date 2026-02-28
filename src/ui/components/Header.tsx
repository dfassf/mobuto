import { useState } from 'react'
import { useTodoStore } from '../../core/stores/todoStore'
import { QUADRANT_MAP } from '../../core/constants/quadrant'
import type { Quadrant } from '../../core/models/todo'

const QUADRANT_ORDER: Quadrant[] = [1, 2, 3, 4]

export function Header() {
  const todos = useTodoStore((state) => state.todos)
  const activeTodos = todos.filter((t) => t.status === 'active')
  const completedTodos = todos.filter((t) => t.status === 'completed')
  const [showHelp, setShowHelp] = useState(false)

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

        {todos.length > 0 && (
          <div className="flex gap-3 text-xs text-slate-400">
            <span>할 일 {activeTodos.length}</span>
            <span>완료 {completedTodos.length}</span>
          </div>
        )}
      </header>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
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
            <strong className="text-slate-600">사용법:</strong> 할 일을 추가하면 두 가지 질문을 통해 자동으로 사분면에 배치됩니다. 가장 중요한 건 2사분면(일정 잡기)에 시간을 투자하는 것!
          </p>
        </div>
      </div>
    </>
  )
}
