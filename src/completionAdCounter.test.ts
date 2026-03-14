import { describe, expect, it } from 'vitest'
import { incrementCompletionAdCounter } from './completionAdCounter'

describe('completionAdCounter', () => {
  it('완료 카운터를 1씩 증가시킨다', () => {
    expect(incrementCompletionAdCounter()).toBe(1)
    expect(incrementCompletionAdCounter()).toBe(2)
    expect(localStorage.getItem('mobuto_completion_ad_counter_v1')).toBe('2')
  })

  it('손상된 값이면 0에서 다시 시작한다', () => {
    localStorage.setItem('mobuto_completion_ad_counter_v1', 'NaN')

    expect(incrementCompletionAdCounter()).toBe(1)
  })
})
