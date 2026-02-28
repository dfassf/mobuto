import { useEffect } from 'react'
import { useTodoStore } from './core/stores/todoStore'
import { HomePage } from './ui/pages/HomePage'

function App() {
  const loadTodos = useTodoStore((state) => state.loadTodos)

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  return <HomePage />
}

export default App
