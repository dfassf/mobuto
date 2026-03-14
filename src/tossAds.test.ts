import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  mockIsIntossRuntime,
  mockLoadFullScreenAd,
  mockShowFullScreenAd,
} = vi.hoisted(() => ({
  mockIsIntossRuntime: vi.fn(),
  mockLoadFullScreenAd: vi.fn(),
  mockShowFullScreenAd: vi.fn(),
}))

vi.mock('./intoss', () => ({
  isIntossRuntime: mockIsIntossRuntime,
}))

vi.mock('@apps-in-toss/web-framework', () => ({
  loadFullScreenAd: mockLoadFullScreenAd,
  showFullScreenAd: mockShowFullScreenAd,
}))

import { loadAndShowInterstitial, loadAndShowRewarded } from './tossAds'

describe('tossAds', () => {
  beforeEach(() => {
    mockIsIntossRuntime.mockReset()
    mockLoadFullScreenAd.mockReset()
    mockShowFullScreenAd.mockReset()
  })

  it('intoss 런타임이 아니면 interstitial을 스킵한다', async () => {
    mockIsIntossRuntime.mockReturnValue(false)

    await expect(loadAndShowInterstitial()).resolves.toBe(false)
    expect(mockLoadFullScreenAd).not.toHaveBeenCalled()
  })

  it('interstitial dismissed 이벤트면 true를 반환한다', async () => {
    mockIsIntossRuntime.mockReturnValue(true)
    mockLoadFullScreenAd.mockImplementation(({ onEvent }: { onEvent: (event: { type: string }) => void }) => {
      onEvent({ type: 'loaded' })
      return vi.fn()
    })
    mockShowFullScreenAd.mockImplementation(({ onEvent }: { onEvent: (event: { type: string }) => void }) => {
      onEvent({ type: 'dismissed' })
      return vi.fn()
    })

    await expect(loadAndShowInterstitial()).resolves.toBe(true)
  })

  it('interstitial failedToShow 이벤트면 false를 반환한다', async () => {
    mockIsIntossRuntime.mockReturnValue(true)
    mockLoadFullScreenAd.mockImplementation(({ onEvent }: { onEvent: (event: { type: string }) => void }) => {
      onEvent({ type: 'loaded' })
      return vi.fn()
    })
    mockShowFullScreenAd.mockImplementation(({ onEvent }: { onEvent: (event: { type: string }) => void }) => {
      onEvent({ type: 'failedToShow' })
      return vi.fn()
    })

    await expect(loadAndShowInterstitial()).resolves.toBe(false)
  })

  it('rewarded는 보상 이벤트 후 dismissed일 때만 true를 반환한다', async () => {
    mockIsIntossRuntime.mockReturnValue(true)
    mockLoadFullScreenAd.mockImplementation(({ onEvent }: { onEvent: (event: { type: string }) => void }) => {
      onEvent({ type: 'loaded' })
      return vi.fn()
    })
    mockShowFullScreenAd.mockImplementation(({ onEvent }: { onEvent: (event: { type: string }) => void }) => {
      onEvent({ type: 'userEarnedReward' })
      onEvent({ type: 'dismissed' })
      return vi.fn()
    })

    await expect(loadAndShowRewarded()).resolves.toBe(true)
  })

  it('rewarded dismissed만 오면 false를 반환한다', async () => {
    mockIsIntossRuntime.mockReturnValue(true)
    mockLoadFullScreenAd.mockImplementation(({ onEvent }: { onEvent: (event: { type: string }) => void }) => {
      onEvent({ type: 'loaded' })
      return vi.fn()
    })
    mockShowFullScreenAd.mockImplementation(({ onEvent }: { onEvent: (event: { type: string }) => void }) => {
      onEvent({ type: 'dismissed' })
      return vi.fn()
    })

    await expect(loadAndShowRewarded()).resolves.toBe(false)
  })

  it('load error는 문자열 메시지로 반환한다', async () => {
    mockIsIntossRuntime.mockReturnValue(true)
    mockLoadFullScreenAd.mockImplementation(({ onError }: { onError: (err: Error) => void }) => {
      onError(new Error('load failed'))
      return vi.fn()
    })

    await expect(loadAndShowInterstitial()).resolves.toBe('[ad] load: load failed')
  })
})
