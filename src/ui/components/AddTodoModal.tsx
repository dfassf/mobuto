import { useTodoStore } from '../../core/stores/todoStore'
import { QUADRANT_MAP, resolveQuadrant } from '../../core/constants/quadrant'
import { useAddTodoFlow } from '../hooks/useAddTodoFlow'
import { useNewCategoryForm } from '../hooks/useNewCategoryForm'
import { TitleStep } from './TitleStep'
import { CategoryStep } from './CategoryStep'

interface AddTodoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddTodoModal({ isOpen, onClose }: AddTodoModalProps) {
  const { addTodo, categories, addCategory } = useTodoStore()

  const flow = useAddTodoFlow({ onClose, addTodo })
  const categoryForm = useNewCategoryForm({ addCategory })

  const resetAndClose = () => {
    categoryForm.reset()
    flow.resetAndClose()
  }

  if (!isOpen) return null

  const previewYes = flow.step === 'important' ? resolveQuadrant(flow.isUrgent, true) : null
  const previewNo = flow.step === 'important' ? resolveQuadrant(flow.isUrgent, false) : null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={resetAndClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-2xl bg-white p-6 shadow-xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
        <div>
        {flow.step === 'title' && (
          <TitleStep
            title={flow.title}
            onTitleChange={flow.setTitle}
            onKeyDown={flow.handleKeyDown}
            onSubmit={flow.handleTitleSubmit}
            onCancel={resetAndClose}
          />
        )}

        {flow.step === 'category' && (
          <CategoryStep
            categories={categories}
            onSelect={flow.handleCategorySelect}
            onBack={() => flow.setStep('title')}
            showNewCategory={categoryForm.showNewCategory}
            onShowNewCategory={categoryForm.setShowNewCategory}
            newCategoryName={categoryForm.newCategoryName}
            onNewCategoryNameChange={categoryForm.setNewCategoryName}
            newCategoryColor={categoryForm.newCategoryColor}
            onNewCategoryColorChange={categoryForm.setNewCategoryColor}
            onCreateCategory={categoryForm.handleCreateCategory}
          />
        )}

        {flow.step === 'urgent' && (
          <QuestionStep
            question="긴급한가요?"
            description="지금 당장 해야 하는 일인가요?"
            onYes={() => flow.handleUrgentSelect(true)}
            onNo={() => flow.handleUrgentSelect(false)}
            onBack={() => flow.setStep('category')}
          />
        )}

        {flow.step === 'important' && (
            <QuestionStep
              question="중요한가요?"
              description="나중에 봤을 때 의미 있는 일인가요?"
              onYes={() => flow.handleImportantSelect(true)}
              onNo={() => flow.handleImportantSelect(false)}
              onBack={() => flow.setStep('urgent')}
            >
              {previewYes && previewNo && (
                <div className="mb-4 flex flex-col gap-1.5 rounded-lg bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">예를 고르면:</span>
                    <span className={`text-xs font-medium ${QUADRANT_MAP[previewYes].colorClass}`}>
                      {QUADRANT_MAP[previewYes].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">아니오를 고르면:</span>
                    <span className={`text-xs font-medium ${QUADRANT_MAP[previewNo].colorClass}`}>
                      {QUADRANT_MAP[previewNo].label}
                    </span>
                  </div>
                </div>
              )}
            </QuestionStep>
        )}
        </div>
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
  children?: React.ReactNode
}

function QuestionStep({ question, description, onYes, onNo, onBack, children }: QuestionStepProps) {
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
      <p className="mb-4 text-sm text-slate-500">{description}</p>

      {children}

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
