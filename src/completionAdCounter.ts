const COMPLETION_AD_COUNTER_KEY = 'mobuto_completion_ad_counter_v1'

function loadCounter(): number {
  try {
    const raw = localStorage.getItem(COMPLETION_AD_COUNTER_KEY)
    if (!raw) return 0
    const parsed = Number(raw)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
  } catch {
    return 0
  }
}

function saveCounter(value: number): void {
  try {
    localStorage.setItem(COMPLETION_AD_COUNTER_KEY, String(value))
  } catch {
    // 스토리지 차단 환경
  }
}

export function incrementCompletionAdCounter(): number {
  const next = loadCounter() + 1
  saveCounter(next)
  return next
}
