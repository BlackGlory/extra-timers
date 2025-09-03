import { describe, it, expect, vi } from 'vitest'
import { delay, Deferred } from 'extra-promise'
import { setImmediate } from '@src/set-immediate.js'

describe('setImmediate', () => {
  it('will call `cb`', async () => {
    const deferred = new Deferred<void>()

    const start = Date.now()
    setImmediate(() => deferred.resolve())
    await deferred

    expect(Date.now() - start).toBeLessThan(500)
  })

  it('will call `cb` once', async () => {
    const cb = vi.fn()

    setImmediate(cb)
    await delay(100)

    expect(cb).toBeCalledTimes(1)
  })

  it('can be cancelled', async () => {
    const cb = vi.fn()

    const cancel = setImmediate(cb)
    cancel()
    await delay(100)

    expect(cb).not.toBeCalled()
  })

  it('can be cancelled multiple times', async () => {
    const cb = vi.fn()

    const cancel = setImmediate(cb)
    cancel()
    cancel()
    await delay(100)

    expect(cb).not.toBeCalled()
  })
})
