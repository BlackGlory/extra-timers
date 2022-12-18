import { calculateExponentialBackoffTimeout } from '@src/exponential-backoff'

describe(`
  calculateExponentialBackoffTimeout({
    baseTimeout: number
    retries: number
    maxTimeout?: number
    factor?: number
    jitter?: boolean
  }): number
`, () => {
  test('maxTimeout', async () => {
    // Math.min(2 ** 2 * 500, 1500) = 1500
    const timeout = calculateExponentialBackoffTimeout({
      baseTimeout: 500
    , retries: 2
    , maxTimeout: 1500
    , factor: 2
    , jitter: false
    })

    expect(timeout).toBeGreaterThanOrEqual(1500)
    expect(timeout).toBeLessThan(2000)
  })

  describe('jitter', () => {
    test('jitter = true', async () => {
      // Math.min(2 ** 2 * 500, Infinity) = 2000
      const timeout = calculateExponentialBackoffTimeout({
        baseTimeout: 500
      , retries: 2
      , maxTimeout: Infinity
      , factor: 2
      , jitter: true
      })

      expect(timeout).toBeLessThanOrEqual(2000)
    })

    test('jitter = false', async () => {
      // Math.min(2 ** 2 * 500, Infinity) = 2000
      const timeout = calculateExponentialBackoffTimeout({
        baseTimeout: 500
      , retries: 2
      , maxTimeout: Infinity
      , factor: 2
      , jitter: false
      })

      expect(timeout).toBeGreaterThanOrEqual(2000)
    })
  })
})
