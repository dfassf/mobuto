import type { TodoTimeSpent } from '../../../core/stats/computeStats'
import { formatDuration } from '../../../core/stats/computeStats'
import { QUADRANT_MAP } from '../../../core/constants/quadrant'

interface TimeSpentListProps {
  items: TodoTimeSpent[]
  limit?: number
}

export function TimeSpentList({ items, limit = 10 }: TimeSpentListProps) {
  const visible = items.slice(0, limit)

  if (visible.length === 0) {
    return <p className="text-xs text-slate-400">아직 완료한 할 일이 없어요</p>
  }

  return (
    <div className="space-y-2.5">
      {visible.map((item) => {
        const info = QUADRANT_MAP[item.quadrant]
        return (
          <div key={item.todoId} className="flex items-center gap-2 text-xs">
            <span className={`h-2 w-2 shrink-0 rounded-full ${info.bgClass} border ${info.borderClass}`} />
            <span className="flex-1 truncate text-slate-600">{item.title}</span>
            <span className="shrink-0 font-medium text-slate-500">
              {formatDuration(item.durationMs)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
