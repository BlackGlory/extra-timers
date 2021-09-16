import { delay } from 'extra-promise'
import { setInterval } from '@src/set-interval'
import { TIME_ERROR } from '@test/utils'

describe('setInterval(timeout: number, cb: () => unknown): () => void', () => {
  it('will call `cb` after `timeout`', done => {
    const timing: number[] = [Date.now()]
    const cb = jest.fn()
      .mockImplementationOnce(() => {
        timing.push(Date.now())
      })
      .mockImplementationOnce(() => {
        timing.push(Date.now())

        try {
          expect(timing[1] - timing[0]).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
          expect(timing[1] - timing[0]).toBeLessThan(1500)
          expect(timing[2] - timing[1]).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
          expect(timing[2] - timing[1]).toBeLessThan(1500)
          done()
        } finally {
          cancel()
        }
      })

    const cancel = setInterval(1000, cb)
  })

  it('will call `cb` multiple times', async () => {
    const cb = jest.fn()

    const cancel = setInterval(0, cb)
    await delay(1000)

    try {
      expect(cb.mock.calls.length).toBeGreaterThan(1)
    } finally {
      cancel()
    }
  })

  it('can be cancelled', async () => {
    const cb = jest.fn()

    const cancel = setInterval(0, cb)
    cancel()
    await delay(1000)

    expect(cb).not.toBeCalled()
  })

  it('always can be cancelled', async () => {
    const cb = jest.fn().mockImplementation(() => cancel())

    const cancel = setInterval(0, cb)
    await delay(1000)

    try {
      expect(cb).toBeCalledTimes(1)
    } finally {
      cancel()
    }
  })
})
