import { useEffect, useState } from 'react'
import { useTodoStore } from './core/stores/todoStore'
import { HomePage } from './ui/pages/HomePage'
import { StatsPage } from './ui/pages/StatsPage'
import { BottomTabBar, type TabId } from './ui/components/BottomTabBar'

function App() {
  const loadTodos = useTodoStore((state) => state.loadTodos)
  const loadCategories = useTodoStore((state) => state.loadCategories)
  const [currentTab, setCurrentTab] = useState<TabId>('matrix')

  useEffect(() => {
    loadTodos()
    loadCategories()
  }, [loadTodos, loadCategories])

  return (
    <>
      {currentTab === 'matrix' && <HomePage />}
      {currentTab === 'stats' && <StatsPage />}
      <BottomTabBar current={currentTab} onChange={setCurrentTab} />
    </>
  )
}

export default App
