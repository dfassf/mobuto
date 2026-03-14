import type { Period } from '../../../core/stats/computeStats'

interface PeriodSelectorProps {
  selected: Period
  onChange: (period: Period) => void
}

const PERIODS: { id: Period; label: string }[] = [
  { id: 'today', label: '오늘' },
  { id: 'week', label: '이번 주' },
  { id: 'month', label: '이번 달' },
]

export function PeriodSelector({ selected, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-2">
      {PERIODS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            selected === id
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
