import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DAILY_AD_BONUS_LIMIT,
  DAILY_FREE_LIMIT,
  addBonusView,
  canEarnBonus,
  consumeFreeView,
  getRemainingFree,
} from './adQuota'

describe('adQuota', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('초기 무료 조회 수를 반환한다', () => {
    expect(getRemainingFree()).toBe(DAILY_FREE_LIMIT)
  })

  it('무료 조회를 제한 횟수까지만 소모한다', () => {
    for (let i = 0; i < DAILY_FREE_LIMIT; i++) {
      expect(consumeFreeView()).toBe(true)
    }
    expect(consumeFreeView()).toBe(false)
    expect(getRemainingFree()).toBe(0)
  })

  it('보상 조회를 제한 횟수까지만 허용한다', () => {
    for (let i = 0; i < DAILY_AD_BONUS_LIMIT; i++) {
      expect(canEarnBonus()).toBe(true)
      expect(addBonusView()).toBe(true)
    }
    expect(canEarnBonus()).toBe(false)
    expect(addBonusView()).toBe(false)
  })

  it('날짜가 바뀌면 쿼터가 초기화된다', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-14T09:00:00+09:00'))

    expect(consumeFreeView()).toBe(true)
    expect(getRemainingFree()).toBe(DAILY_FREE_LIMIT - 1)

    vi.setSystemTime(new Date('2026-03-15T09:00:00+09:00'))
    expect(getRemainingFree()).toBe(DAILY_FREE_LIMIT)
  })
})
