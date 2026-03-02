interface FloatingAddButtonProps {
  isOpen: boolean
  onClick: () => void
}

export function FloatingAddButton({ isOpen, onClick }: FloatingAddButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 sm:bottom-8 sm:right-8 ${
        isOpen
          ? 'bg-slate-500 text-white hover:bg-slate-400'
          : 'bg-slate-800 text-white hover:bg-slate-700'
      }`}
      aria-label={isOpen ? '닫기' : '할 일 추가'}
    >
      <svg
        className={`h-7 w-7 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  )
}
