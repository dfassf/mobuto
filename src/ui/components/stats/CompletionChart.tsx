import type { QuadrantCompletionStats } from '../../../core/stats/computeStats'
import { QUADRANT_MAP } from '../../../core/constants/quadrant'

interface CompletionChartProps {
  data: QuadrantCompletionStats[]
}

export function CompletionChart({ data }: CompletionChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="space-y-3">
      {data.map(({ quadrant, count }) => {
        const info = QUADRANT_MAP[quadrant]
        const widthPercent = (count / max) * 100

        return (
          <div key={quadrant} className="flex items-center gap-3">
            <span className={`w-16 shrink-0 text-xs font-medium ${info.colorClass}`}>
              {info.label}
            </span>
            <div className="h-6 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${info.bgClass} border ${info.borderClass} transition-all duration-500`}
                style={{ width: `${widthPercent}%`, minWidth: count > 0 ? '1.5rem' : '0' }}
              />
            </div>
            <span className="w-6 text-right text-xs font-semibold text-slate-600">{count}</span>
          </div>
        )
      })}
    </div>
  )
}
