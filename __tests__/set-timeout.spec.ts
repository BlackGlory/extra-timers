import { describe, it, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { delay, Deferred, StatefulPromise, StatefulPromiseState } from 'extra-promise'
import { setTimeout } from '@src/set-timeout.js'

describe('setTimeout', () => {
  it('will call `cb` after `timeout`', async () => {
    const deferred = new Deferred<void>()

    const start = Date.now()
    setTimeout(1000, () => deferred.resolve())
    await deferred

    expect(Date.now() - start).toBeGreaterThanOrEqual(1000)
    expect(Date.now() - start).toBeLessThan(1500)
  })

  it('will call `cb` once', async () => {
    const cb = vi.fn()

    setTimeout(0, cb)
    await delay(100)

    expect(cb).toBeCalledTimes(1)
  })

  it('can be cancelled', async () => {
    const cb = vi.fn()

    const cancel = setTimeout(0, cb)
    cancel()
    await delay(100)

    expect(cb).not.toBeCalled()
  })

  it('can be cancelled multiple times', async () => {
    const cb = vi.fn()

    const cancel = setTimeout(0, cb)
    cancel()
    cancel()
    await delay(100)

    expect(cb).not.toBeCalled()
  })

  test('edge: timeout < 0', async () => {
    const cb = vi.fn()

    setTimeout(-1000, cb)
    await delay(100)

    expect(cb).toBeCalledTimes(1)
  })

  test('edge: timeout = Infinity', async () => {
    const cb = vi.fn()

    const cancel = setTimeout(Infinity, cb)
    await delay(100)

    try {
      expect(cb).not.toBeCalled()
    } finally {
      cancel()
    }
  })

  describe('edge: timeout > 2147483647', () => {
    beforeEach(() => vi.useFakeTimers({ now: 0 }))
    afterEach(() => vi.useRealTimers())

    it('will call `cb` after `timeout`', async () => {
      const deferred = new Deferred<void>()
      const statefulPromise = new StatefulPromise<void>((resolve, reject) => {
        deferred.then(resolve, reject)
      })

      setTimeout(2147483648, () => deferred.resolve())
      const state1 = statefulPromise.state
      await vi.advanceTimersByTimeAsync(2147483647)
      const state2 = statefulPromise.state
      await vi.advanceTimersByTimeAsync(1)
      const state3 = statefulPromise.state

      expect(state1).toBe(StatefulPromiseState.Pending)
      expect(state2).toBe(StatefulPromiseState.Pending)
      expect(state3).toBe(StatefulPromiseState.Fulfilled)
    })

    it('will call `cb` once', async () => {
      const cb = vi.fn()

      setTimeout(2147483648, () => cb())
      await vi.advanceTimersByTimeAsync(2147483648)
      await vi.advanceTimersByTimeAsync(100)

      expect(cb).toBeCalledTimes(1)
    })

    it('can be cancelled', async () => {
      const cb = vi.fn()

      const cancel = setTimeout(2147483648, () => cb())
      cancel()
      await vi.advanceTimersByTimeAsync(2147483648)

      expect(cb).not.toBeCalled()
    })

    it('can be cancelled multiple times', async () => {
      const cb = vi.fn()

      const cancel = setTimeout(2147483648, () => cb())
      cancel()
      cancel()
      await vi.advanceTimersByTimeAsync(2147483648)

      expect(cb).not.toBeCalled()
    })
  })
})
