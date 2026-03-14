import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  mockGetOperationalEnvironment,
  mockGetTossShareLink,
  mockShare,
  mockCloseView,
} = vi.hoisted(() => ({
  mockGetOperationalEnvironment: vi.fn(),
  mockGetTossShareLink: vi.fn(),
  mockShare: vi.fn(),
  mockCloseView: vi.fn(),
}))

vi.mock('@apps-in-toss/web-framework', () => ({
  getOperationalEnvironment: mockGetOperationalEnvironment,
  getTossShareLink: mockGetTossShareLink,
  share: mockShare,
  closeView: mockCloseView,
}))

import {
  closeIntossViewSafe,
  getIntossEnvironment,
  getTossShareLinkSafe,
  isIntossRuntime,
  shareInIntoss,
  toIntossPath,
} from './intoss'

describe('intoss utils', () => {
  beforeEach(() => {
    mockGetOperationalEnvironment.mockReset()
    mockGetTossShareLink.mockReset()
    mockShare.mockReset()
    mockCloseView.mockReset()
    delete window.ReactNativeWebView
  })

  it('브릿지가 없으면 web 환경으로 판단한다', () => {
    mockGetOperationalEnvironment.mockReturnValue('toss')

    expect(getIntossEnvironment()).toBe('web')
    expect(isIntossRuntime()).toBe(false)
  })

  it('브릿지와 toss env가 있으면 intoss 런타임으로 판단한다', () => {
    window.ReactNativeWebView = { postMessage: vi.fn() }
    mockGetOperationalEnvironment.mockReturnValue('toss')

    expect(getIntossEnvironment()).toBe('toss')
    expect(isIntossRuntime()).toBe(true)
  })

  it('intoss 경로를 앱 스킴으로 변환한다', () => {
    expect(toIntossPath()).toBe('intoss://mobuto')
    expect(toIntossPath('/stats/weekly')).toBe('intoss://mobuto/stats/weekly')
  })

  it('런타임이 아니면 share link를 만들지 않는다', async () => {
    const result = await getTossShareLinkSafe('/abc')

    expect(result).toBeNull()
    expect(mockGetTossShareLink).not.toHaveBeenCalled()
  })

  it('런타임이면 share link를 반환한다', async () => {
    window.ReactNativeWebView = { postMessage: vi.fn() }
    mockGetOperationalEnvironment.mockReturnValue('toss')
    mockGetTossShareLink.mockResolvedValue('https://toss.im/share/abc')

    await expect(getTossShareLinkSafe('/abc')).resolves.toBe('https://toss.im/share/abc')
  })

  it('shareInIntoss는 성공 시 true, 실패 시 false를 반환한다', async () => {
    window.ReactNativeWebView = { postMessage: vi.fn() }
    mockGetOperationalEnvironment.mockReturnValue('toss')
    mockShare.mockResolvedValue(undefined)

    await expect(shareInIntoss('hello')).resolves.toBe(true)

    mockShare.mockRejectedValueOnce(new Error('fail'))
    await expect(shareInIntoss('hello')).resolves.toBe(false)
  })

  it('closeIntossViewSafe는 성공 시 true, 실패 시 false를 반환한다', async () => {
    window.ReactNativeWebView = { postMessage: vi.fn() }
    mockGetOperationalEnvironment.mockReturnValue('toss')
    mockCloseView.mockResolvedValue(undefined)

    await expect(closeIntossViewSafe()).resolves.toBe(true)

    mockCloseView.mockRejectedValueOnce(new Error('fail'))
    await expect(closeIntossViewSafe()).resolves.toBe(false)
  })
})
