import { useTodoStore } from '../../core/stores/todoStore'
import { getCategoryColor } from '../../core/models/category'

interface CategoryFilterProps {
  selected: string | null
  onSelect: (id: string | null) => void
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const categories = useTodoStore((state) => state.categories)

  if (categories.length === 0) return null

  return (
    <div className="mt-4 -mx-1 px-1 py-1 flex gap-2 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          selected === null
            ? 'bg-slate-800 text-white'
            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
        }`}
      >
        전체
      </button>
      {categories.map((cat) => {
        const color = getCategoryColor(cat.color)
        const isActive = selected === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(isActive ? null : cat.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? `${color.bg} ${color.text} ring-2 ring-offset-2 ring-slate-300`
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
