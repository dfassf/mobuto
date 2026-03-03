import { useState, useRef, useEffect } from 'react'
import { getCategoryColor } from '../../core/models/category'
import type { Category } from '../../core/models/category'

interface CategoryPickerProps {
  categories: Category[]
  currentCategoryId?: string
  onSelect: (categoryId: string | undefined) => void
}

export function CategoryPicker({ categories, currentCategoryId, onSelect }: CategoryPickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const category = categories.find((c) => c.id === currentCategoryId)
  const color = category ? getCategoryColor(category.color) : null

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => setOpen(!open)}
        className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
          color
            ? `${color.bg} ${color.text} hover:opacity-80`
            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
        }`}
      >
        {category ? category.name : '없음'}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <button
            onClick={() => { onSelect(undefined); setOpen(false) }}
            className="w-full rounded px-2 py-1.5 text-left text-xs text-slate-400 hover:bg-slate-50"
          >
            없음
          </button>
          {categories.map((cat) => {
            const catColor = getCategoryColor(cat.color)
            return (
              <button
                key={cat.id}
                onClick={() => { onSelect(cat.id); setOpen(false) }}
                className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-slate-50 ${
                  cat.id === currentCategoryId ? 'font-medium' : ''
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${catColor.dot}`} />
                <span className="text-slate-700">{cat.name}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
