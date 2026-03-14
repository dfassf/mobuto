import { describe, expect, it } from 'vitest'
import { INTOSS_APP_NAME } from './env'

describe('env', () => {
  it('intoss app name이 비어있지 않다', () => {
    expect(INTOSS_APP_NAME).toBeTruthy()
  })
})
