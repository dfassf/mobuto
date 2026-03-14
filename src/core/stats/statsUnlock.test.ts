import { afterEach, describe, expect, it, vi } from 'vitest'
import { isStatsUnlocked, unlockStats } from './statsUnlock'

describe('statsUnlock', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('오늘 날짜로 unlock되면 true를 반환한다', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-14T08:00:00+09:00'))

    unlockStats()

    expect(isStatsUnlocked()).toBe(true)
  })

  it('다른 날짜의 unlock 값이면 false를 반환한다', () => {
    localStorage.setItem('mobuto_stats_unlock', '2026-03-13')

    expect(isStatsUnlocked()).toBe(false)
  })

  it('localStorage 접근 예외 시 false를 반환한다', () => {
    const getItemSpy = vi
      .spyOn(localStorage, 'getItem')
      .mockImplementation(() => {
        throw new Error('blocked')
      })

    expect(isStatsUnlocked()).toBe(false)
    expect(getItemSpy).toHaveBeenCalled()
  })
})
