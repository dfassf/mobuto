import { CATEGORY_COLORS, getCategoryColor } from '../../core/models/category'

interface Category {
  id: string
  name: string
  color: string
}

interface CategoryStepProps {
  categories: Category[]
  onSelect: (id?: string) => void
  onBack: () => void
  showNewCategory: boolean
  onShowNewCategory: (show: boolean) => void
  newCategoryName: string
  onNewCategoryNameChange: (name: string) => void
  newCategoryColor: string
  onNewCategoryColorChange: (color: string) => void
  onCreateCategory: () => void
}

export function CategoryStep({
  categories,
  onSelect,
  onBack,
  showNewCategory,
  onShowNewCategory,
  newCategoryName,
  onNewCategoryNameChange,
  newCategoryColor,
  onNewCategoryColorChange,
  onCreateCategory,
}: CategoryStepProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-3 flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        뒤로
      </button>

      <h2 className="mb-1 text-lg font-semibold text-slate-800">카테고리 선택</h2>
      <p className="mb-4 text-sm text-slate-500">카테고리를 골라주세요</p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(undefined)}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-50"
        >
          없음
        </button>

        {categories.map((cat) => {
          const color = getCategoryColor(cat.color)
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${color.bg} ${color.text} hover:opacity-80`}
            >
              {cat.name}
            </button>
          )
        })}

        {!showNewCategory && (
          <button
            onClick={() => onShowNewCategory(true)}
            className="rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-400 hover:border-slate-400 hover:text-slate-600"
          >
            + 새 카테고리
          </button>
        )}
      </div>

      {showNewCategory && (
        <div className="mt-4 rounded-lg border border-slate-200 p-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => onNewCategoryNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) onCreateCategory()
              if (e.key === 'Escape') onShowNewCategory(false)
            }}
            placeholder="카테고리 이름"
            className="mb-3 w-full border-0 border-b border-slate-200 bg-transparent px-1 py-1.5 text-sm text-slate-800 placeholder-slate-300 focus:border-slate-800 focus:outline-none"
            autoFocus
          />

          <div className="mb-3 flex flex-wrap gap-1.5">
            {CATEGORY_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => onNewCategoryColorChange(color.name)}
                className={`h-6 w-6 rounded-full ${color.dot} transition-transform ${
                  newCategoryColor === color.name ? 'ring-2 ring-offset-1 ring-slate-400 scale-110' : ''
                }`}
                aria-label={color.name}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => onShowNewCategory(false)}
              className="rounded px-3 py-1 text-xs text-slate-400 hover:text-slate-600"
            >
              취소
            </button>
            <button
              onClick={onCreateCategory}
              disabled={!newCategoryName.trim()}
              className="rounded bg-slate-800 px-3 py-1 text-xs text-white hover:bg-slate-700 disabled:bg-slate-300"
            >
              추가
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
