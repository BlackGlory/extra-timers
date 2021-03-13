import { delay } from 'extra-promise'
import { setTimeout } from '@src/set-timeout'
import { TIME_ERROR } from '@test/utils'

describe('setTimeout(cb: () => unknown, timeout: number): () => void', () => {
  it('will call `cb` after `timeout`', done => {
    const start = Date.now()
    setTimeout(1000, () => {
      expect(Date.now() - start).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
      expect(Date.now() - start).toBeLessThan(1500)
      done()
    })
  })

  it('will call `cb` once', async () => {
    const cb = jest.fn()

    setTimeout(0, cb)
    await delay(1000)

    expect(cb).toBeCalledTimes(1)
  })

  it('can be cancelled', async () => {
    const cb = jest.fn()

    const cancel = setTimeout(0, cb)
    cancel()
    await delay(1000)

    expect(cb).not.toBeCalled()
  })
})
