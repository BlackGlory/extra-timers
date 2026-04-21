import { describe, it, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { delay, Deferred, StatefulPromise, StatefulPromiseState } from 'extra-promise'
import { setTimeout } from '@src/set-timeout.js'

describe('setTimeout', () => {
  it('will call `callback` after `timeout`', async () => {
    const deferred = new Deferred<void>()

    const start = Date.now()
    setTimeout(1000, () => deferred.resolve())
    await deferred

    expect(Date.now() - start).toBeGreaterThanOrEqual(1000)
    expect(Date.now() - start).toBeLessThan(1500)
  })

  it('will call `callback` once', async () => {
    const callback = vi.fn()

    setTimeout(0, callback)
    await delay(100)

    expect(callback).toBeCalledTimes(1)
  })

  it('can be cancelled', async () => {
    const callback = vi.fn()

    const cancel = setTimeout(0, callback)
    cancel()
    await delay(100)

    expect(callback).not.toBeCalled()
  })

  it('can be cancelled multiple times', async () => {
    const callback = vi.fn()

    const cancel = setTimeout(0, callback)
    cancel()
    cancel()
    await delay(100)

    expect(callback).not.toBeCalled()
  })

  test('edge: timeout < 0', async () => {
    const callback = vi.fn()

    setTimeout(-1000, callback)
    await delay(100)

    expect(callback).toBeCalledTimes(1)
  })

  test('edge: timeout = Infinity', async () => {
    const callback = vi.fn()

    const cancel = setTimeout(Infinity, callback)
    await delay(100)

    try {
      expect(callback).not.toBeCalled()
    } finally {
      cancel()
    }
  })

  describe('edge: timeout > 2147483647', () => {
    beforeEach(() => vi.useFakeTimers({ now: 0 }))
    afterEach(() => vi.useRealTimers())

    it('will call `callback` after `timeout`', async () => {
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

    it('will call `callback` once', async () => {
      const callback = vi.fn()

      setTimeout(2147483648, () => callback())
      await vi.advanceTimersByTimeAsync(2147483648)
      await vi.advanceTimersByTimeAsync(100)

      expect(callback).toBeCalledTimes(1)
    })

    it('can be cancelled', async () => {
      const callback = vi.fn()

      const cancel = setTimeout(2147483648, () => callback())
      cancel()
      await vi.advanceTimersByTimeAsync(2147483648)

      expect(callback).not.toBeCalled()
    })

    it('can be cancelled multiple times', async () => {
      const callback = vi.fn()

      const cancel = setTimeout(2147483648, () => callback())
      cancel()
      cancel()
      await vi.advanceTimersByTimeAsync(2147483648)

      expect(callback).not.toBeCalled()
    })
  })
})
