import { describe, it, expect, vi } from 'vitest'
import { Deferred, delay } from 'extra-promise'
import { setInterval } from '@src/set-interval.js'

describe('setInterval', () => {
  it('will call `callback` after `timeout`', async () => {
    const deferred = new Deferred<void>()

    const timing: number[] = [Date.now()]
    const callback = vi.fn()
      .mockImplementationOnce(() => {
        timing.push(Date.now())
      })
      .mockImplementationOnce(() => {
        timing.push(Date.now())
        deferred.resolve()
      })

    const cancel = setInterval(1000, callback)
    await deferred
    cancel()

    expect(timing[1] - timing[0]).toBeGreaterThanOrEqual(1000)
    expect(timing[1] - timing[0]).toBeLessThan(1500)
    expect(timing[2] - timing[1]).toBeGreaterThanOrEqual(1000)
    expect(timing[2] - timing[1]).toBeLessThan(1500)
  })

  it('will call `callback` multiple times', async () => {
    const callback = vi.fn()

    const cancel = setInterval(0, callback)
    await delay(100)

    try {
      expect(callback.mock.calls.length).toBeGreaterThan(1)
    } finally {
      cancel()
    }
  })

  it('can be cancelled', async () => {
    const callback = vi.fn()

    const cancel = setInterval(0, callback)
    cancel()
    await delay(100)

    expect(callback).not.toBeCalled()
  })

  it('can be cancelled multiple times', async () => {
    const callback = vi.fn()

    const cancel = setInterval(0, callback)
    cancel()
    cancel()
    await delay(100)

    expect(callback).not.toBeCalled()
  })

  it('always can be cancelled', async () => {
    const callback = vi.fn().mockImplementation(() => cancel())

    const cancel = setInterval(0, callback)
    await delay(100)

    try {
      expect(callback).toBeCalledTimes(1)
    } finally {
      cancel()
    }
  })
})
