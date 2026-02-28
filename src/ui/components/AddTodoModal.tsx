import { useState } from 'react'
import { useTodoStore } from '../../core/stores/todoStore'
import { QUADRANT_MAP, resolveQuadrant } from '../../core/constants/quadrant'

interface AddTodoModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 'title' | 'urgent' | 'important'

export function AddTodoModal({ isOpen, onClose }: AddTodoModalProps) {
  const addTodo = useTodoStore((state) => state.addTodo)
  const [step, setStep] = useState<Step>('title')
  const [title, setTitle] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)

  if (!isOpen) return null

  const resetAndClose = () => {
    setStep('title')
    setTitle('')
    setIsUrgent(false)
    onClose()
  }

  const handleTitleSubmit = () => {
    if (!title.trim()) return
    setStep('urgent')
  }

  const handleUrgentSelect = (urgent: boolean) => {
    setIsUrgent(urgent)
    setStep('important')
  }

  const handleImportantSelect = (important: boolean) => {
    addTodo({ title: title.trim(), isUrgent, isImportant: important })
    resetAndClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleTitleSubmit()
    if (e.key === 'Escape') resetAndClose()
  }

  const previewQuadrant = step === 'important'
    ? resolveQuadrant(isUrgent, true)
    : null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={resetAndClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-2xl bg-white p-6 shadow-xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
        {step === 'title' && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">할 일 추가</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="무엇을 해야 하나요?"
              className="w-full border-0 border-b-2 border-slate-200 bg-transparent px-1 py-3 text-lg text-slate-800 placeholder-slate-300 focus:border-slate-800 focus:outline-none transition-colors"
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={resetAndClose}
                className="rounded-lg px-4 py-2 text-sm text-slate-500 hover:bg-slate-100"
              >
                취소
              </button>
              <button
                onClick={handleTitleSubmit}
                disabled={!title.trim()}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {step === 'urgent' && (
          <QuestionStep
            question="긴급한가요?"
            description="지금 당장 해야 하는 일인가요?"
            onYes={() => handleUrgentSelect(true)}
            onNo={() => handleUrgentSelect(false)}
            onBack={() => setStep('title')}
          />
        )}

        {step === 'important' && (
          <div>
            <QuestionStep
              question="중요한가요?"
              description="장기적 목표에 기여하는 일인가요?"
              onYes={() => handleImportantSelect(true)}
              onNo={() => handleImportantSelect(false)}
              onBack={() => setStep('urgent')}
            />
            {previewQuadrant && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-400">예를 선택하면:</span>
                <span className={`text-xs font-medium ${QUADRANT_MAP[previewQuadrant].colorClass}`}>
                  {QUADRANT_MAP[previewQuadrant].label}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

interface QuestionStepProps {
  question: string
  description: string
  onYes: () => void
  onNo: () => void
  onBack: () => void
}

function QuestionStep({ question, description, onYes, onNo, onBack }: QuestionStepProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-3 flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        뒤로
      </button>

      <h2 className="mb-1 text-lg font-semibold text-slate-800">{question}</h2>
      <p className="mb-6 text-sm text-slate-500">{description}</p>

      <div className="flex gap-3">
        <button
          onClick={onYes}
          className="flex-1 rounded-lg border-2 border-slate-800 bg-slate-800 py-3 text-sm font-medium text-white hover:bg-slate-700"
        >
          예
        </button>
        <button
          onClick={onNo}
          className="flex-1 rounded-lg border-2 border-slate-300 py-3 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50"
        >
          아니오
        </button>
      </div>
    </div>
  )
}
