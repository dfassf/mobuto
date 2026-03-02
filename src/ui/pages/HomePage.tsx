import { useState } from 'react'
import { Header } from '../components/Header'
import { CategoryFilter } from '../components/CategoryFilter'
import { QuadrantGrid } from '../components/QuadrantGrid'
import { AddTodoModal } from '../components/AddTodoModal'
import { FloatingAddButton } from '../components/FloatingAddButton'

export function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null)

  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-6 pb-24">
        <Header />
        <CategoryFilter selected={filterCategoryId} onSelect={setFilterCategoryId} />

        <div className="mt-4">
          <QuadrantGrid filterCategoryId={filterCategoryId} />
        </div>
      </div>

      <FloatingAddButton isOpen={isModalOpen} onClick={() => setIsModalOpen(!isModalOpen)} />
      <AddTodoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
