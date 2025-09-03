import { describe, it, test, expect, vi } from 'vitest'
import { delay, Deferred } from 'extra-promise'
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

  test('edge: timeout < 0', async () => {
    const cb = vi.fn()

    setTimeout(-1000, cb)
    await delay(100)

    expect(cb).toBeCalledTimes(1)
  })
})
