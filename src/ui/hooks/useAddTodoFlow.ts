import { useState } from 'react'

type Step = 'title' | 'category' | 'urgent' | 'important'

interface UseAddTodoFlowParams {
  onClose: () => void
  addTodo: (params: { title: string; isUrgent: boolean; isImportant: boolean; categoryId?: string }) => void
}

export function useAddTodoFlow({ onClose, addTodo }: UseAddTodoFlowParams) {
  const [step, setStep] = useState<Step>('title')
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [isUrgent, setIsUrgent] = useState(false)

  const resetAndClose = () => {
    setStep('title')
    setTitle('')
    setCategoryId(undefined)
    setIsUrgent(false)
    onClose()
  }

  const handleTitleSubmit = () => {
    if (!title.trim()) return
    setStep('category')
  }

  const handleCategorySelect = (id?: string) => {
    setCategoryId(id)
    setStep('urgent')
  }

  const handleUrgentSelect = (urgent: boolean) => {
    setIsUrgent(urgent)
    setStep('important')
  }

  const handleImportantSelect = (important: boolean) => {
    addTodo({ title: title.trim(), isUrgent, isImportant: important, categoryId })
    resetAndClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleTitleSubmit()
    if (e.key === 'Escape') resetAndClose()
  }

  return {
    step,
    setStep,
    title,
    setTitle,
    categoryId,
    isUrgent,
    resetAndClose,
    handleTitleSubmit,
    handleCategorySelect,
    handleUrgentSelect,
    handleImportantSelect,
    handleKeyDown,
  }
}
