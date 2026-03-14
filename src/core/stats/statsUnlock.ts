const STATS_UNLOCK_KEY = 'mobuto_stats_unlock'

function getTodayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function isStatsUnlocked(): boolean {
  try {
    return localStorage.getItem(STATS_UNLOCK_KEY) === getTodayStr()
  } catch {
    return false
  }
}

export function unlockStats(): void {
  try {
    localStorage.setItem(STATS_UNLOCK_KEY, getTodayStr())
  } catch {
    // 스토리지 차단 환경
  }
}
