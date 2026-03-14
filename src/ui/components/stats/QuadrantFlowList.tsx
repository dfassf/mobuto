import type { FlowInsight } from '../../../core/stats/computeStats'
import { QUADRANT_MAP } from '../../../core/constants/quadrant'

interface QuadrantFlowListProps {
  flowInsight: FlowInsight
}

export function QuadrantFlowList({ flowInsight }: QuadrantFlowListProps) {
  const { totalMovements, patterns, insight } = flowInsight

  if (totalMovements === 0) {
    return <p className="text-xs text-slate-400">아직 이동 기록이 없어요</p>
  }

  const [top, ...rest] = patterns

  return (
    <div className="space-y-4">
      {/* 1위 강조 */}
      <div className="rounded-lg bg-slate-50 p-3">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">1위</span>
          <span className={`font-medium text-xs ${QUADRANT_MAP[top.from].colorClass}`}>
            {QUADRANT_MAP[top.from].label}
          </span>
          <span className="text-xs text-slate-300">→</span>
          <span className={`font-medium text-xs ${QUADRANT_MAP[top.to].colorClass}`}>
            {QUADRANT_MAP[top.to].label}
          </span>
          <span className="text-xs font-bold text-slate-800">{top.count}건</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-500">{insight}</p>
      </div>

      {/* 2위~ */}
      <div className="space-y-2">
        {rest.slice(0, 4).map((p, i) => (
          <div key={`${p.from}-${p.to}`} className="flex items-center gap-2 text-xs">
            <span className="w-4 shrink-0 text-right font-medium text-slate-400">{i + 2}</span>
            <span className={`w-14 shrink-0 text-right font-medium ${QUADRANT_MAP[p.from].colorClass}`}>
              {QUADRANT_MAP[p.from].label}
            </span>
            <span className="shrink-0 text-slate-300">→</span>
            <span className={`w-14 shrink-0 font-medium ${QUADRANT_MAP[p.to].colorClass}`}>
              {QUADRANT_MAP[p.to].label}
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-200 transition-all duration-500"
                style={{ width: `${(p.count / top.count) * 100}%`, minWidth: '0.5rem' }}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-slate-400">{p.count}</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-400">총 {totalMovements}건의 이동</p>
    </div>
  )
}
