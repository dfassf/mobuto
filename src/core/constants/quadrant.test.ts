import { describe, expect, it } from 'vitest'
import { QUADRANT_MAP, resolveQuadrant } from './quadrant'

describe('quadrant constants', () => {
  it('모든 사분면 메타정보가 존재한다', () => {
    expect(QUADRANT_MAP[1].label).toBeTruthy()
    expect(QUADRANT_MAP[2].label).toBeTruthy()
    expect(QUADRANT_MAP[3].label).toBeTruthy()
    expect(QUADRANT_MAP[4].label).toBeTruthy()
  })

  it('긴급/중요 조합을 올바른 사분면으로 매핑한다', () => {
    expect(resolveQuadrant(true, true)).toBe(1)
    expect(resolveQuadrant(false, true)).toBe(2)
    expect(resolveQuadrant(true, false)).toBe(3)
    expect(resolveQuadrant(false, false)).toBe(4)
  })
})
