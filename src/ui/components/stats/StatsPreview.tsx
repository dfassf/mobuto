import { useState } from 'react'

interface StatsPreviewProps {
  onUnlock: () => void | Promise<void>
}

export function StatsPreview({ onUnlock }: StatsPreviewProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (loading) return
    setLoading(true)
    try {
      await onUnlock()
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-dvh bg-slate-50 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-xl font-bold text-slate-800 mb-1">기록</h1>
        <p className="text-sm text-slate-500 mb-4">완료한 할 일을 돌아볼 수 있어요</p>
      </div>

      <div className="relative mx-auto max-w-2xl px-4 overflow-hidden" style={{ maxHeight: 'calc(100dvh - 12rem)' }}>
        <div className="pointer-events-none select-none blur-[12px]" aria-hidden>
          {/* 바 차트 */}
          <div className="rounded-xl bg-white p-5 shadow-sm space-y-4 mb-5">
            {[
              { w: '75%', color: '#fca5a5' },
              { w: '50%', color: '#93c5fd' },
              { w: '90%', color: '#fcd34d' },
              { w: '30%', color: '#cbd5e1' },
            ].map(({ w, color }, i) => (
              <div key={i} className="h-6 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full" style={{ width: w, backgroundColor: color }} />
              </div>
            ))}
          </div>

          {/* 중간 카드 2열 */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl bg-white p-5 shadow-sm space-y-2">
              <div className="h-3 w-2/3 rounded bg-slate-200" />
              <div className="h-8 w-full rounded bg-amber-50" />
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm space-y-2">
              <div className="h-3 w-1/2 rounded bg-slate-200" />
              <div className="h-8 w-full rounded bg-emerald-50" />
            </div>
          </div>

          {/* 리스트 */}
          <div className="rounded-xl bg-white p-5 shadow-sm space-y-3 mb-5">
            {[
              { dot: 'bg-red-200' },
              { dot: 'bg-blue-200' },
              { dot: 'bg-amber-200' },
              { dot: 'bg-slate-200' },
            ].map(({ dot }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`h-3 w-3 shrink-0 rounded-full ${dot}`} />
                <div className="h-3 flex-1 rounded bg-slate-100" />
                <div className="h-3 w-12 rounded bg-slate-200" />
              </div>
            ))}
          </div>

          {/* 다크 카드 */}
          <div className="rounded-2xl bg-slate-800 p-5">
            <div className="space-y-2">
              {[
                { w: '65%', color: '#fca5a5' },
                { w: '40%', color: '#93c5fd' },
                { w: '80%', color: '#fcd34d' },
                { w: '25%', color: '#cbd5e1' },
              ].map(({ w, color }, i) => (
                <div key={i} className="h-4 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full" style={{ width: w, backgroundColor: color }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오버레이 + 버튼 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handleClick}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-slate-700 disabled:opacity-70"
          >
            {loading && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? '광고 로딩 중...' : '광고 보고 기록 보기'}
          </button>
        </div>
      </div>
    </div>
  )
}
