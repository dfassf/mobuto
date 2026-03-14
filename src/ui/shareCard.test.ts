import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  mockShareInIntoss,
  mockIsIntossRuntime,
  mockHtml2Canvas,
} = vi.hoisted(() => ({
  mockShareInIntoss: vi.fn(),
  mockIsIntossRuntime: vi.fn(),
  mockHtml2Canvas: vi.fn(),
}))

vi.mock('../intoss', () => ({
  shareInIntoss: mockShareInIntoss,
  isIntossRuntime: mockIsIntossRuntime,
}))

vi.mock('html2canvas', () => ({
  default: mockHtml2Canvas,
}))

import { shareReportCard } from './shareCard'

function createCanvasMock() {
  return {
    toBlob: (callback: (blob: Blob | null) => void) =>
      callback(new Blob(['x'], { type: 'image/png' })),
    toDataURL: () => 'data:image/png;base64,abc',
  }
}

describe('shareReportCard', () => {
  beforeEach(() => {
    mockShareInIntoss.mockReset()
    mockIsIntossRuntime.mockReset()
    mockHtml2Canvas.mockReset()

    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true })
    Object.defineProperty(navigator, 'canShare', { value: undefined, configurable: true })
  })

  it('element가 없으면 종료한다', async () => {
    await expect(shareReportCard(null)).resolves.toBeUndefined()
    expect(mockHtml2Canvas).not.toHaveBeenCalled()
  })

  it('intoss 런타임이면 dataUrl로 공유한다', async () => {
    mockIsIntossRuntime.mockReturnValue(true)
    mockHtml2Canvas.mockResolvedValue(createCanvasMock())

    const element = document.createElement('div')
    await shareReportCard(element)

    expect(mockShareInIntoss).toHaveBeenCalledWith('모부터 주간 리포트! data:image/png;base64,abc')
  })

  it('web share가 가능하면 파일 공유를 시도한다', async () => {
    mockIsIntossRuntime.mockReturnValue(false)
    mockHtml2Canvas.mockResolvedValue(createCanvasMock())

    const shareSpy = vi.fn().mockResolvedValue(undefined)
    const canShareSpy = vi.fn().mockReturnValue(true)
    Object.defineProperty(navigator, 'share', { value: shareSpy, configurable: true })
    Object.defineProperty(navigator, 'canShare', { value: canShareSpy, configurable: true })

    await shareReportCard(document.createElement('div'))

    expect(canShareSpy).toHaveBeenCalled()
    expect(shareSpy).toHaveBeenCalled()
  })

  it('web share 불가 시 다운로드 폴백을 사용한다', async () => {
    mockIsIntossRuntime.mockReturnValue(false)
    mockHtml2Canvas.mockResolvedValue(createCanvasMock())
    Object.defineProperty(navigator, 'canShare', { value: vi.fn().mockReturnValue(false), configurable: true })

    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:report')
    const revokeObjectURLSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => undefined)
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined)

    await shareReportCard(document.createElement('div'))

    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:report')
  })
})
