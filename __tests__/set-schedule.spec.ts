import { describe, it, expect, vi } from 'vitest'
import { delay, Deferred } from 'extra-promise'
import { setSchedule } from '@src/set-schedule.js'

describe('setSchedule', () => {
  it('will call `cb` at `timestamp`', async () => {
    const deferred = new Deferred<void>()

    const start = Date.now()
    setSchedule(start + 1000, () => deferred.resolve())
    await deferred

    expect(Date.now() - start).toBeGreaterThanOrEqual(1000)
    expect(Date.now() - start).toBeLessThan(1500)
  })

  it('will call `cb` once', async () => {
    const cb = vi.fn()

    setSchedule(0, cb)
    await delay(100)

    expect(cb).toBeCalledTimes(1)
  })

  it('can be cancelled', async () => {
    const cb = vi.fn()
    const start = Date.now()

    const cancel = setSchedule(start + 100, cb)
    cancel()
    await delay(1000)

    expect(cb).not.toBeCalled()
  })
})
