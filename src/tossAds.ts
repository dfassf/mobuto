import { isIntossRuntime } from './intoss'
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework'

const INTERSTITIAL_TEST_ID = 'ait-ad-test-interstitial-id'
const REWARDED_TEST_ID = 'ait-ad-test-rewarded-id'

const INTERSTITIAL_ID = import.meta.env.VITE_AD_INTERSTITIAL_ID || INTERSTITIAL_TEST_ID
const REWARDED_ID = import.meta.env.VITE_AD_REWARDED_ID || REWARDED_TEST_ID

const AD_TIMEOUT_MS = 15_000

export function isAdsSupported(): boolean {
  return isIntossRuntime()
}

function runLoadAndShow(
  adGroupId: string,
  opts: { trackReward?: boolean; timeoutFallback: boolean | string },
): Promise<boolean | string> {
  return new Promise<boolean | string>((resolve) => {
    let earned = false
    let settled = false
    let cleanupLoad: (() => void) | null = null
    let cleanupShow: (() => void) | null = null

    const finish = (result: boolean | string) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      if (cleanupLoad) cleanupLoad()
      if (cleanupShow) cleanupShow()
      resolve(result)
    }

    const timeoutId = window.setTimeout(() => {
      finish(opts.timeoutFallback)
    }, AD_TIMEOUT_MS)

    cleanupLoad = loadFullScreenAd({
      options: { adGroupId },
      onEvent: (event) => {
        if (event.type !== 'loaded') return
        if (cleanupLoad) {
          cleanupLoad()
          cleanupLoad = null
        }
        cleanupShow = showFullScreenAd({
          options: { adGroupId },
          onEvent: (showEvent) => {
            if (showEvent.type === 'userEarnedReward') earned = true
            if (showEvent.type === 'dismissed') {
              finish(opts.trackReward ? earned : true)
              return
            }
            if (showEvent.type === 'failedToShow') {
              finish(false)
            }
          },
          onError: (err) => {
            console.warn('[ad] show error:', err)
            finish(false)
          },
        })
      },
      onError: (err) => {
        finish(err instanceof Error ? `[ad] load: ${err.message}` : '[ad] load failed')
      },
    })
  })
}

export async function loadAndShowInterstitial(): Promise<boolean | string> {
  if (!isAdsSupported()) return false
  try {
    return await runLoadAndShow(INTERSTITIAL_ID, { timeoutFallback: false })
  } catch (err) {
    console.warn('[ad] interstitial failed:', err)
    return false
  }
}

export async function loadAndShowRewarded(): Promise<boolean | string> {
  if (!isAdsSupported()) return '[ad] not intoss runtime'
  try {
    return await runLoadAndShow(REWARDED_ID, { trackReward: true, timeoutFallback: false })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return `[ad] ${msg}`
  }
}
