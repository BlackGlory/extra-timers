import { describe, it, expect, vi } from 'vitest'
import { delay, Deferred } from 'extra-promise'
import { setDynamicTimeoutLoop } from '@src/set-dynamic-timeout-loop.js'

describe('setDynamicTimeoutLoop', () => {
  it('will call `callback` after `timeout`', async () => {
    const deferred = new Deferred<void>()

    const timing: number[] = [Date.now()]
    const callback = vi.fn()
      .mockImplementationOnce(async () => {
        timing.push(Date.now())
        await delay(1000)
      })
      .mockImplementationOnce(() => {
        timing.push(Date.now())
        deferred.resolve()
      })
    setDynamicTimeoutLoop(1000, callback)
    await deferred

    expect(timing[1] - timing[0]).toBeGreaterThanOrEqual(1000)
    expect(timing[1] - timing[0]).toBeLessThan(1500)
    expect(timing[2] - timing[1]).toBeGreaterThanOrEqual(1000)
    expect(timing[2] - timing[1]).toBeLessThan(1500)
  })

  it('will call `callback` multiple times', async () => {
    const callback = vi.fn()

    setDynamicTimeoutLoop(0, callback)
    await delay(100)

    expect(callback.mock.calls.length).toBeGreaterThan(1)
  })

  it('can be cancelled', async () => {
    const callback = vi.fn()

    const cancel = setDynamicTimeoutLoop(0, callback)
    cancel()
    await delay(100)

    expect(callback).not.toBeCalled()
  })

  it('can be cancelled multiple times', async () => {
    const callback = vi.fn()

    const cancel = setDynamicTimeoutLoop(0, callback)
    cancel()
    cancel()
    await delay(100)

    expect(callback).not.toBeCalled()
  })

  it('always can be cancelled', async () => {
    const callback = vi.fn().mockImplementation(() => cancel())

    const cancel = setDynamicTimeoutLoop(0, callback)
    await delay(100)

    try {
      expect(callback).toBeCalledTimes(1)
    } finally {
      cancel()
    }
  })
})
