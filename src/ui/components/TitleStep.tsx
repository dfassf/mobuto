interface TitleStepProps {
  title: string
  onTitleChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onSubmit: () => void
  onCancel: () => void
}

export function TitleStep({ title, onTitleChange, onKeyDown, onSubmit, onCancel }: TitleStepProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-slate-800">할 일 추가</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="무엇을 해야 하나요?"
        className="w-full border-0 border-b-2 border-slate-200 bg-transparent px-1 py-3 text-lg text-slate-800 placeholder-slate-300 focus:border-slate-800 focus:outline-none transition-colors"
        autoFocus
      />
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm text-slate-500 hover:bg-slate-100"
        >
          취소
        </button>
        <button
          onClick={onSubmit}
          disabled={!title.trim()}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </div>
  )
}
