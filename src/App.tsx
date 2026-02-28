import { useEffect } from 'react'
import { useTodoStore } from './core/stores/todoStore'
import { HomePage } from './ui/pages/HomePage'

function App() {
  const loadTodos = useTodoStore((state) => state.loadTodos)
  const loadCategories = useTodoStore((state) => state.loadCategories)

  useEffect(() => {
    loadTodos()
    loadCategories()
  }, [loadTodos, loadCategories])

  return <HomePage />
}

export default App
