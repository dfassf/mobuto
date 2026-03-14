import { useState, useCallback } from 'react'
import { useTodoStore } from '../../core/stores/todoStore'
import {
  getCompletionByQuadrant,
  getFlowInsight,
  getTimeSpent,
  buildWeeklyReport,
  type Period,
} from '../../core/stats/computeStats'
import { isStatsUnlocked, unlockStats } from '../../core/stats/statsUnlock'
import { loadAndShowRewarded, isAdsSupported } from '../../tossAds'
import { PeriodSelector } from '../components/stats/PeriodSelector'
import { CompletionChart } from '../components/stats/CompletionChart'
import { QuadrantFlowList } from '../components/stats/QuadrantFlowList'
import { TimeSpentList } from '../components/stats/TimeSpentList'
import { WeeklyReportCard } from '../components/stats/WeeklyReportCard'
import { StatsPreview } from '../components/stats/StatsPreview'

export function StatsPage() {
  const todos = useTodoStore((state) => state.todos)
  const categories = useTodoStore((state) => state.categories)
  const [period, setPeriod] = useState<Period>('week')
  const [statsLocked, setStatsLocked] = useState(() => isAdsSupported() && !isStatsUnlocked())

  const handleUnlockStats = useCallback(async () => {
    const result = await loadAndShowRewarded()
    if (result !== true) return
    unlockStats()
    setStatsLocked(false)
  }, [])

  if (statsLocked) {
    return <StatsPreview onUnlock={handleUnlockStats} />
  }

  const completionData = getCompletionByQuadrant(todos, period)
  const flowInsight = getFlowInsight(todos)
  const timeSpent = getTimeSpent(todos, period)
  const weeklyReport = buildWeeklyReport(todos, categories)

  const totalCompleted = completionData.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-6 pb-[calc(6rem+env(safe-area-inset-bottom))]">
        <h1 className="text-xl font-bold text-slate-800 mb-1">기록</h1>
        <p className="text-sm text-slate-500 mb-4">완료한 할 일을 돌아볼 수 있어요</p>

        <PeriodSelector selected={period} onChange={setPeriod} />

        <section className="mt-6">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-slate-700">사분면별 완료</h2>
            <span className="text-xs text-slate-400">총 {totalCompleted}개</span>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <CompletionChart data={completionData} />
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">사분면 이동 인사이트</h2>
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <QuadrantFlowList flowInsight={flowInsight} />
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">소요 시간</h2>
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <TimeSpentList items={timeSpent} />
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">주간 리포트</h2>
          <WeeklyReportCard report={weeklyReport} />
        </section>
      </div>
    </div>
  )
}
