import { delay } from 'extra-promise'
import { setImmediate } from '@src/set-immediate'

describe('setImmediate(cb: () => unknown): () => void', () => {
  it('will call `cb`', done => {
    const start = Date.now()
    setImmediate(() => {
      expect(Date.now() - start).toBeLessThan(500)
      done()
    })
  })

  it('will call `cb` once', async () => {
    const cb = jest.fn()

    setImmediate(cb)
    await delay(1000)

    expect(cb).toBeCalledTimes(1)
  })

  it('can be cancelled', async () => {
    const cb = jest.fn()

    const cancel = setImmediate(cb)
    cancel()
    await delay(1000)

    expect(cb).not.toBeCalled()
  })
})
