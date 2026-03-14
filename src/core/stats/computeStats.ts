import type { Todo, Quadrant } from '../models/todo'
import type { Category } from '../models/category'

export type Period = 'today' | 'week' | 'month'

export interface QuadrantCompletionStats {
  quadrant: Quadrant
  count: number
}

export interface QuadrantMovement {
  todoId: string
  todoTitle: string
  from: Quadrant
  to: Quadrant
  at: number
}

export interface TodoTimeSpent {
  todoId: string
  title: string
  quadrant: Quadrant
  durationMs: number
  createdAt: number
  completedAt: number
}

export interface WeeklyReport {
  totalCompleted: number
  byQuadrant: QuadrantCompletionStats[]
  topCategory: { name: string; count: number } | null
  avgTimeMs: number
  weekLabel: string
  streak: number
  bestDay: string | null
  focusScore: number
  longestTodo: { title: string; durationMs: number } | null
  fastestTodo: { title: string; durationMs: number } | null
  comment: string
}

function getPeriodStart(period: Period): number {
  const now = new Date()

  if (period === 'today') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  }

  if (period === 'week') {
    const day = now.getDay()
    const diff = day === 0 ? 6 : day - 1 // 월요일 기준
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff)
    return monday.getTime()
  }

  // month
  return new Date(now.getFullYear(), now.getMonth(), 1).getTime()
}

function getCompletedInPeriod(todos: Todo[], period: Period): Todo[] {
  const start = getPeriodStart(period)
  return todos.filter(
    (t) => t.status === 'completed' && t.completedAt != null && t.completedAt >= start,
  )
}

export function getCompletionByQuadrant(todos: Todo[], period: Period): QuadrantCompletionStats[] {
  const completed = getCompletedInPeriod(todos, period)
  const counts: Record<Quadrant, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }

  for (const todo of completed) {
    counts[todo.quadrant]++
  }

  return ([1, 2, 3, 4] as Quadrant[]).map((q) => ({ quadrant: q, count: counts[q] }))
}

export interface FlowPattern {
  from: Quadrant
  to: Quadrant
  count: number
}

export interface FlowInsight {
  totalMovements: number
  patterns: FlowPattern[]
  topPattern: FlowPattern | null
  insight: string
}

const INSIGHT_MESSAGES: Record<string, string> = {
  '1→2': '긴급한 일을 계획으로 잘 옮기고 있어요!',
  '1→3': '중요한 일을 위임으로 돌리고 있어요. 정말 괜찮은지 확인해보세요.',
  '1→4': '긴급하다 생각했는데 사실 안 중요했어요. 좋은 판단!',
  '2→1': '계획했던 일이 긴급해지는 경우가 많아요. 일정을 넉넉하게 잡아보세요.',
  '2→3': '중요하다 생각했는데 급한 잡일이 되는 경우가 많아요.',
  '2→4': '계획했지만 결국 안 해도 되는 일이 많았어요. 과감한 정리!',
  '3→1': '위임할 일이 결국 직접 하게 되는 경우가 많아요.',
  '3→2': '잡일이라 생각했는데 중요한 일이었어요. 판단력이 좋아지고 있어요.',
  '3→4': '급하다 생각했는데 아니었어요. 불필요한 긴급함에 휘둘리지 마세요.',
  '4→1': '미뤄둔 일이 긴급해지는 패턴이에요. 나중에 칸을 한번 점검해보세요.',
  '4→2': '안 중요하다 생각했는데 결국 계획에 넣었어요. 초기 판단을 다시 해보세요.',
  '4→3': '미뤄뒀다가 급해진 일이에요. 미리 처리하는 습관을 들여보세요.',
}

export function getFlowInsight(todos: Todo[]): FlowInsight {
  const counts = new Map<string, FlowPattern>()

  for (const todo of todos) {
    for (const entry of todo.quadrantHistory) {
      const key = `${entry.from}→${entry.to}`
      const existing = counts.get(key)
      if (existing) {
        existing.count++
      } else {
        counts.set(key, { from: entry.from, to: entry.to, count: 1 })
      }
    }
  }

  const patterns = [...counts.values()].sort((a, b) => b.count - a.count)
  const totalMovements = patterns.reduce((sum, p) => sum + p.count, 0)
  const topPattern = patterns[0] ?? null

  let insight = '아직 이동 기록이 없어요'
  if (topPattern) {
    const key = `${topPattern.from}→${topPattern.to}`
    insight = INSIGHT_MESSAGES[key] ?? `사분면 이동이 총 ${totalMovements}건 있었어요.`
  }

  return { totalMovements, patterns, topPattern, insight }
}

export function getTimeSpent(todos: Todo[], period: Period): TodoTimeSpent[] {
  const completed = getCompletedInPeriod(todos, period)

  return completed
    .filter((t) => t.completedAt != null)
    .map((t) => ({
      todoId: t.id,
      title: t.title,
      quadrant: t.quadrant,
      durationMs: t.completedAt! - t.createdAt,
      createdAt: t.createdAt,
      completedAt: t.completedAt!,
    }))
    .sort((a, b) => b.durationMs - a.durationMs)
}

export function buildWeeklyReport(todos: Todo[], categories: Category[]): WeeklyReport {
  const byQuadrant = getCompletionByQuadrant(todos, 'week')
  const totalCompleted = byQuadrant.reduce((sum, d) => sum + d.count, 0)

  const timeSpent = getTimeSpent(todos, 'week')
  const avgTimeMs =
    timeSpent.length > 0
      ? timeSpent.reduce((sum, t) => sum + t.durationMs, 0) / timeSpent.length
      : 0

  // 가장 많이 완료한 카테고리
  const completed = getCompletedInPeriod(todos, 'week')
  const catCounts = new Map<string, number>()
  for (const t of completed) {
    if (t.categoryId) {
      catCounts.set(t.categoryId, (catCounts.get(t.categoryId) ?? 0) + 1)
    }
  }

  let topCategory: WeeklyReport['topCategory'] = null
  if (catCounts.size > 0) {
    let maxId = ''
    let maxCount = 0
    for (const [id, count] of catCounts) {
      if (count > maxCount) {
        maxId = id
        maxCount = count
      }
    }
    const cat = categories.find((c) => c.id === maxId)
    if (cat) {
      topCategory = { name: cat.name, count: maxCount }
    }
  }

  // 주간 라벨
  const start = getPeriodStart('week')
  const startDate = new Date(start)
  const endDate = new Date(start + 6 * 24 * 60 * 60 * 1000)
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`
  const weekLabel = `${fmt(startDate)} - ${fmt(endDate)}`

  // 연속 완료일 (이번 주 내 연속으로 완료한 날 수)
  const DAY_MS = 24 * 60 * 60 * 1000
  const dayNames = ['월', '화', '수', '목', '금', '토', '일']
  const dayCounts = new Array(7).fill(0)
  for (const t of completed) {
    const dayIndex = Math.floor((t.completedAt! - start) / DAY_MS)
    if (dayIndex >= 0 && dayIndex < 7) dayCounts[dayIndex]++
  }

  let streak = 0
  let currentStreak = 0
  for (const count of dayCounts) {
    if (count > 0) {
      currentStreak++
      streak = Math.max(streak, currentStreak)
    } else {
      currentStreak = 0
    }
  }

  // 가장 많이 완료한 요일
  let bestDayIndex = -1
  let bestDayCount = 0
  for (let i = 0; i < 7; i++) {
    if (dayCounts[i] > bestDayCount) {
      bestDayCount = dayCounts[i]
      bestDayIndex = i
    }
  }
  const bestDay = bestDayIndex >= 0 ? `${dayNames[bestDayIndex]}요일` : null

  // 집중 점수: Q1+Q2 비율 (중요한 일에 집중한 정도)
  const importantCount =
    (byQuadrant.find((q) => q.quadrant === 1)?.count ?? 0) +
    (byQuadrant.find((q) => q.quadrant === 2)?.count ?? 0)
  const focusScore = totalCompleted > 0 ? Math.round((importantCount / totalCompleted) * 100) : 0

  // 가장 오래/빨리 걸린 일
  const longestTodo =
    timeSpent.length > 0
      ? { title: timeSpent[0].title, durationMs: timeSpent[0].durationMs }
      : null
  const fastestTodo =
    timeSpent.length > 0
      ? {
          title: timeSpent[timeSpent.length - 1].title,
          durationMs: timeSpent[timeSpent.length - 1].durationMs,
        }
      : null

  // 한줄 코멘트
  let comment = '이번 주도 화이팅!'
  if (totalCompleted === 0) {
    comment = '이번 주는 아직 시작 전이에요. 하나씩 해봐요!'
  } else if (focusScore >= 80) {
    comment = '중요한 일에 확실히 집중했어요. 대단해요!'
  } else if (focusScore >= 50) {
    comment = '중요한 일과 잡일 사이 균형을 잘 잡고 있어요.'
  } else if (totalCompleted >= 10) {
    comment = '많이 처리했지만 잡일 비중이 높아요. 우선순위를 점검해보세요.'
  } else if (streak >= 5) {
    comment = `${streak}일 연속 완료! 꾸준함이 비결이에요.`
  }

  return {
    totalCompleted,
    byQuadrant,
    topCategory,
    avgTimeMs,
    weekLabel,
    streak,
    bestDay,
    focusScore,
    longestTodo,
    fastestTodo,
    comment,
  }
}

export function formatDuration(ms: number): string {
  if (ms < 0) return '-'
  const minutes = Math.floor(ms / 60_000)
  if (minutes < 1) return '1분 미만'
  if (minutes < 60) return `${minutes}분`
  const hours = Math.floor(minutes / 60)
  const remainMin = minutes % 60
  if (hours < 24) return remainMin > 0 ? `${hours}시간 ${remainMin}분` : `${hours}시간`
  const days = Math.floor(hours / 24)
  const remainHours = hours % 24
  return remainHours > 0 ? `${days}일 ${remainHours}시간` : `${days}일`
}
