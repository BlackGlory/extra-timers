import { describe, it, expect, vi } from 'vitest'
import { delay, Deferred } from 'extra-promise'
import { setDynamicTimeoutLoop } from '@src/set-dynamic-timeout-loop.js'

describe('setDynamicTimeoutLoop', () => {
  it('will call `cb` after `timeout`', async () => {
    const deferred = new Deferred<void>()

    const timing: number[] = [Date.now()]
    const cb = vi.fn()
      .mockImplementationOnce(async () => {
        timing.push(Date.now())
        await delay(1000)
      })
      .mockImplementationOnce(() => {
        timing.push(Date.now())
        deferred.resolve()
      })
    setDynamicTimeoutLoop(1000, cb)
    await deferred

    expect(timing[1] - timing[0]).toBeGreaterThanOrEqual(1000)
    expect(timing[1] - timing[0]).toBeLessThan(1500)
    expect(timing[2] - timing[1]).toBeGreaterThanOrEqual(1000)
    expect(timing[2] - timing[1]).toBeLessThan(1500)
  })

  it('will call `cb` multiple times', async () => {
    const cb = vi.fn()

    setDynamicTimeoutLoop(0, cb)
    await delay(100)

    expect(cb.mock.calls.length).toBeGreaterThan(1)
  })

  it('can be cancelled', async () => {
    const cb = vi.fn()

    const cancel = setDynamicTimeoutLoop(0, cb)
    cancel()
    await delay(100)

    expect(cb).not.toBeCalled()
  })

  it('always can be cancelled', async () => {
    const cb = vi.fn().mockImplementation(() => cancel())

    const cancel = setDynamicTimeoutLoop(0, cb)
    await delay(100)

    expect(cb).toBeCalledTimes(1)
  })
})
