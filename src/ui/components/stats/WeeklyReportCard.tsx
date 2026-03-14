import { useRef, useCallback } from 'react'
import type { WeeklyReport } from '../../../core/stats/computeStats'
import { formatDuration } from '../../../core/stats/computeStats'
import { QUADRANT_MAP } from '../../../core/constants/quadrant'
import { shareReportCard } from '../../shareCard'

interface WeeklyReportCardProps {
  report: WeeklyReport
}

export function WeeklyReportCard({ report }: WeeklyReportCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleShare = useCallback(() => {
    shareReportCard(cardRef.current)
  }, [])

  const maxQuadrantCount = Math.max(...report.byQuadrant.map((q) => q.count), 1)

  const cardContent = (
    <div
      ref={cardRef}
      className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white"
    >
      <div className="mb-1 text-xs text-slate-400">{report.weekLabel}</div>
      <h3 className="mb-4 text-lg font-bold">주간 리포트</h3>

      {/* 핵심 수치 */}
      <div className="mb-4 flex items-end gap-6">
        <div>
          <span className="text-3xl font-bold">{report.totalCompleted}</span>
          <span className="ml-1 text-base text-slate-400">개 완료</span>
        </div>
        {report.streak > 0 && (
          <div>
            <span className="text-2xl font-bold text-amber-400">{report.streak}</span>
            <span className="ml-1 text-sm text-slate-400">일 연속</span>
          </div>
        )}
      </div>

      {/* 사분면 바 차트 */}
      <div className="mb-4 space-y-1.5">
        {[...report.byQuadrant].sort((a, b) => b.count - a.count).map(({ quadrant, count }) => (
          <div key={quadrant} className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-xs text-slate-400">
              {QUADRANT_MAP[quadrant].label}
            </span>
            <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: count > 0 ? `${(count / maxQuadrantCount) * 100}%` : '0%',
                  minWidth: count > 0 ? '1rem' : '0',
                  backgroundColor: getQuadrantColor(quadrant),
                }}
              />
            </div>
            <span className="w-5 shrink-0 text-right text-xs font-medium">{count}</span>
          </div>
        ))}
      </div>

      {/* 집중 점수 */}
      <div className="mb-4 rounded-lg bg-white/10 p-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-slate-400">집중 점수</span>
          <span className="text-sm font-bold">{report.focusScore}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${report.focusScore}%`,
              backgroundColor:
                report.focusScore >= 70
                  ? '#34d399'
                  : report.focusScore >= 40
                    ? '#fbbf24'
                    : '#f87171',
            }}
          />
        </div>
        <p className="mt-1 text-[10px] text-slate-500">중요한 일(Q1+Q2) 비율</p>
      </div>

      {/* 상세 지표 */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        {report.bestDay && (
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] text-slate-500">최다 완료 요일</p>
            <p className="text-sm font-semibold">{report.bestDay}</p>
          </div>
        )}
        {report.avgTimeMs > 0 && (
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] text-slate-500">평균 소요</p>
            <p className="text-sm font-semibold">{formatDuration(report.avgTimeMs)}</p>
          </div>
        )}
        {report.longestTodo && (
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] text-slate-500">가장 오래 걸린 일</p>
            <p className="truncate text-sm font-semibold">{report.longestTodo.title}</p>
            <p className="text-[10px] text-slate-400">
              {formatDuration(report.longestTodo.durationMs)}
            </p>
          </div>
        )}
        {report.fastestTodo && (
          <div className="rounded-lg bg-white/10 px-3 py-2">
            <p className="text-[10px] text-slate-500">가장 빨리 끝낸 일</p>
            <p className="truncate text-sm font-semibold">{report.fastestTodo.title}</p>
            <p className="text-[10px] text-slate-400">
              {formatDuration(report.fastestTodo.durationMs)}
            </p>
          </div>
        )}
      </div>

      {report.topCategory && (
        <p className="mb-3 text-xs text-slate-400">
          가장 많이 한 카테고리:{' '}
          <span className="text-white">
            {report.topCategory.name} ({report.topCategory.count}개)
          </span>
        </p>
      )}

      {/* 한줄 코멘트 */}
      <p className="mb-3 text-sm font-medium text-slate-300">&ldquo;{report.comment}&rdquo;</p>

      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-[10px] text-slate-500">모부터 — 아이젠하워 매트릭스 할 일</span>
      </div>
    </div>
  )

  return (
    <div>
      {cardContent}
      <button
        onClick={handleShare}
        className="mt-3 w-full rounded-xl bg-slate-800 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700"
      >
        리포트 공유하기
      </button>
    </div>
  )
}

function getQuadrantColor(q: number): string {
  switch (q) {
    case 1:
      return '#f87171' // red
    case 2:
      return '#60a5fa' // blue
    case 3:
      return '#fbbf24' // amber
    case 4:
      return '#94a3b8' // slate
    default:
      return '#94a3b8'
  }
}
