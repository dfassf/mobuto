import { QUADRANT_MAP } from '../../core/constants/quadrant'
import type { Quadrant } from '../../core/models/todo'

const QUADRANT_ORDER: Quadrant[] = [1, 2, 3, 4]

interface HelpModalProps {
  onClose: () => void
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-2xl bg-white p-6 shadow-xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">아이젠하워 매트릭스란?</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          미국 대통령 아이젠하워가 사용한 우선순위 결정법입니다.
          모든 할 일을 <strong>긴급한지</strong>와 <strong>중요한지</strong> 두 가지 기준으로 나눠 4개의 사분면에 배치합니다.
        </p>

        <div className="grid grid-cols-2 gap-2">
          {QUADRANT_ORDER.map((q) => {
            const info = QUADRANT_MAP[q]
            return (
              <div
                key={q}
                className={`rounded-lg border ${info.borderClass} ${info.bgClass} p-3`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-xs font-semibold ${info.colorClass}`}>{info.label}</span>
                  <span className="text-[10px] text-slate-400">{info.action}</span>
                </div>
                <p className="text-xs text-slate-500">{info.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <p className="text-xs leading-relaxed text-slate-500">
            <strong className="text-slate-600">사용법:</strong> 할 일을 추가하면 두 가지 질문을 통해 자동으로 사분면에 배치됩니다. 가장 중요한 건 2사분면(계획 세우기)에 시간을 투자하는 것!
          </p>
        </div>
      </div>
    </>
  )
}
