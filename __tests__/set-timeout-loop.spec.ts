import { delay } from 'extra-promise'
import { TIME_ERROR } from '@test/utils'
import { setTimeoutLoop } from '@src/set-timeout-loop'

describe('setTimeoutLoop(cb: () => unknown, timeout: number): () => void', () => {
  it('will call `cb` after `timeout`', done => {
    const timing: number[] = [Date.now()]
    const cb = jest.fn()
      .mockImplementationOnce(async () => {
        timing.push(Date.now())
        await delay(1000)
      })
      .mockImplementationOnce(() => {
        timing.push(Date.now())

        expect(timing[1] - timing[0]).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
        expect(timing[2] - timing[1]).toBeGreaterThanOrEqual(2000 - TIME_ERROR)
        done()
      })

    setTimeoutLoop(1000, cb)
  })

  it('will call `cb` multiple times', async () => {
    const cb = jest.fn()

    setTimeoutLoop(0, cb)
    await delay(1000)

    expect(cb.mock.calls.length).toBeGreaterThan(1)
  })

  it('can be cancelled', async () => {
    const cb = jest.fn()

    const cancel = setTimeoutLoop(0, cb)
    cancel()
    await delay(1000)

    expect(cb).not.toBeCalled()
  })

  it('always can be cancelled', async () => {
    const cb = jest.fn().mockImplementation(() => cancel())

    const cancel = setTimeoutLoop(0, cb)
    await delay(1000)

    expect(cb).toBeCalledTimes(1)
  })
})
