import { describe, it, expect, vi } from 'vitest'
import { delay, Deferred } from 'extra-promise'
import { TIME_ERROR } from '@test/utils.js'
import { setTimeoutLoop } from '@src/set-timeout-loop.js'

describe('setTimeoutLoop', () => {
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
    setTimeoutLoop(1000, cb)
    await deferred

    expect(timing[1] - timing[0]).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
    expect(timing[2] - timing[1]).toBeGreaterThanOrEqual(2000 - TIME_ERROR)
  })

  it('will call `cb` multiple times', async () => {
    const cb = vi.fn()

    setTimeoutLoop(0, cb)
    await delay(1000)

    expect(cb.mock.calls.length).toBeGreaterThan(1)
  })

  it('can be cancelled', async () => {
    const cb = vi.fn()

    const cancel = setTimeoutLoop(0, cb)
    cancel()
    await delay(1000)

    expect(cb).not.toBeCalled()
  })

  it('always can be cancelled', async () => {
    const cb = vi.fn().mockImplementation(() => cancel())

    const cancel = setTimeoutLoop(0, cb)
    await delay(1000)

    expect(cb).toBeCalledTimes(1)
  })
})
