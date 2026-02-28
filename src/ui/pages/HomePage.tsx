import { useState } from 'react'
import { Header } from '../components/Header'
import { QuadrantGrid } from '../components/QuadrantGrid'
import { AddTodoModal } from '../components/AddTodoModal'
import { FloatingAddButton } from '../components/FloatingAddButton'

export function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-6 pb-24">
        <Header />

        <div className="mt-6">
          <QuadrantGrid />
        </div>
      </div>

      <FloatingAddButton onClick={() => setIsModalOpen(true)} />
      <AddTodoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
