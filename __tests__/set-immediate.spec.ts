import { describe, it, expect, vi } from 'vitest'
import { delay, Deferred } from 'extra-promise'
import { setImmediate } from '@src/set-immediate.js'

describe('setImmediate', () => {
  it('will call `callback`', async () => {
    const deferred = new Deferred<void>()

    const start = Date.now()
    setImmediate(() => deferred.resolve())
    await deferred

    expect(Date.now() - start).toBeLessThan(500)
  })

  it('will call `callback` once', async () => {
    const callback = vi.fn()

    setImmediate(callback)
    await delay(100)

    expect(callback).toBeCalledTimes(1)
  })

  it('can be cancelled', async () => {
    const callback = vi.fn()

    const cancel = setImmediate(callback)
    cancel()
    await delay(100)

    expect(callback).not.toBeCalled()
  })

  it('can be cancelled multiple times', async () => {
    const callback = vi.fn()

    const cancel = setImmediate(callback)
    cancel()
    cancel()
    await delay(100)

    expect(callback).not.toBeCalled()
  })
})
