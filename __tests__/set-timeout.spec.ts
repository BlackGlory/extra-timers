import { delay } from 'extra-promise'
import { setTimeout } from '@src/set-timeout'
import { TIME_ERROR } from '@test/utils'

describe('setTimeout(cb: () => unknown, timeout: number): () => void', () => {
  it('will call `cb` after `timeout`', done => {
    const start = Date.now()
    setTimeout(() => {
      expect(Date.now() - start).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
      expect(Date.now() - start).toBeLessThan(1500)
      done()
    }, 1000)
  })

  it('will call `cb` once', async () => {
    const cb = jest.fn()

    setTimeout(cb, 0)
    await delay(1000)

    expect(cb).toBeCalledTimes(1)
  })

  it('can be cancelled', async () => {
    const cb = jest.fn()

    const cancel = setTimeout(cb, 0)
    cancel()
    await delay(1000)

    expect(cb).not.toBeCalled()
  })
})
