import { useState } from 'react'
import { CATEGORY_COLORS } from '../../core/models/category'

interface UseNewCategoryFormParams {
  addCategory: (params: { name: string; color: string }) => void
}

export function useNewCategoryForm({ addCategory }: UseNewCategoryFormParams) {
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState<string>(CATEGORY_COLORS[0].name)

  const handleCreateCategory = () => {
    const trimmed = newCategoryName.trim()
    if (!trimmed) return

    addCategory({ name: trimmed, color: newCategoryColor })
    setShowNewCategory(false)
    setNewCategoryName('')
    setNewCategoryColor(CATEGORY_COLORS[0].name)
  }

  const reset = () => {
    setShowNewCategory(false)
    setNewCategoryName('')
    setNewCategoryColor(CATEGORY_COLORS[0].name)
  }

  return {
    showNewCategory,
    setShowNewCategory,
    newCategoryName,
    setNewCategoryName,
    newCategoryColor,
    setNewCategoryColor,
    handleCreateCategory,
    reset,
  }
}
