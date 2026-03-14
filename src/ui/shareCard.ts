import { shareInIntoss, isIntossRuntime } from '../intoss'

export async function shareReportCard(element: HTMLElement | null): Promise<void> {
  if (!element) return

  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: null,
    useCORS: true,
  })

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) return

  if (isIntossRuntime()) {
    const dataUrl = canvas.toDataURL('image/png')
    await shareInIntoss(`모부터 주간 리포트! ${dataUrl}`)
    return
  }

  if (navigator.share && navigator.canShare) {
    const file = new File([blob], 'mobuto-report.png', { type: 'image/png' })
    const shareData = { files: [file], title: '모부터 주간 리포트' }
    if (navigator.canShare(shareData)) {
      await navigator.share(shareData)
      return
    }
  }

  // 폴백: 다운로드
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'mobuto-report.png'
  a.click()
  URL.revokeObjectURL(url)
}
