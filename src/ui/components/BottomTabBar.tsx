export type TabId = 'matrix' | 'stats'

interface BottomTabBarProps {
  current: TabId
  onChange: (tab: TabId) => void
}

export function BottomTabBar({ current, onChange }: BottomTabBarProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white/95 backdrop-blur-sm"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <button
        onClick={() => onChange('matrix')}
        className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-colors ${
          current === 'matrix' ? 'text-slate-800 font-semibold' : 'text-slate-400'
        }`}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        매트릭스
      </button>
      <button
        onClick={() => onChange('stats')}
        className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-colors ${
          current === 'stats' ? 'text-slate-800 font-semibold' : 'text-slate-400'
        }`}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h2v8H3zm6-4h2v12H9zm6-6h2v18h-2zm6 10h2v8h-2z" />
        </svg>
        기록
      </button>
    </nav>
  )
}
