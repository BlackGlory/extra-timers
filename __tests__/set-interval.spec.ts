import { describe, it, expect, vi } from 'vitest'
import { Deferred, delay } from 'extra-promise'
import { setInterval } from '@src/set-interval.js'

describe('setInterval', () => {
  it('will call `cb` after `timeout`', async () => {
    const deferred = new Deferred<void>()

    const timing: number[] = [Date.now()]
    const cb = vi.fn()
      .mockImplementationOnce(() => {
        timing.push(Date.now())
      })
      .mockImplementationOnce(() => {
        timing.push(Date.now())
        deferred.resolve()
      })

    const cancel = setInterval(1000, cb)
    await deferred
    cancel()

    expect(timing[1] - timing[0]).toBeGreaterThanOrEqual(1000)
    expect(timing[1] - timing[0]).toBeLessThan(1500)
    expect(timing[2] - timing[1]).toBeGreaterThanOrEqual(1000)
    expect(timing[2] - timing[1]).toBeLessThan(1500)
  })

  it('will call `cb` multiple times', async () => {
    const cb = vi.fn()

    const cancel = setInterval(0, cb)
    await delay(100)

    try {
      expect(cb.mock.calls.length).toBeGreaterThan(1)
    } finally {
      cancel()
    }
  })

  it('can be cancelled', async () => {
    const cb = vi.fn()

    const cancel = setInterval(0, cb)
    cancel()
    await delay(100)

    expect(cb).not.toBeCalled()
  })

  it('always can be cancelled', async () => {
    const cb = vi.fn().mockImplementation(() => cancel())

    const cancel = setInterval(0, cb)
    await delay(100)

    try {
      expect(cb).toBeCalledTimes(1)
    } finally {
      cancel()
    }
  })
})
