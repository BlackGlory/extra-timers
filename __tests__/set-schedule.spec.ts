import { delay } from 'extra-promise'
import { setSchedule } from '@src/set-schedule'
import { TIME_ERROR } from '@test/utils'

describe('setSchedule(timestamp: number, cb: () => unknown)', () => {
  it('will call `cb` at `timestamp`', done => {
    const start = Date.now()
    setSchedule(start + 1000, () => {
      expect(Date.now() - start).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
      expect(Date.now() - start).toBeLessThan(1500)
      done()
    })
  })

  it('will call `cb` once', async () => {
    const cb = jest.fn()

    setSchedule(0, cb)
    await delay(1000)

    expect(cb).toBeCalledTimes(1)
  })

  it('can be cancelled', async () => {
    const cb = jest.fn()
    const start = Date.now()

    const cancel = setSchedule(start + 1000, cb)
    cancel()
    await delay(1000)

    expect(cb).not.toBeCalled()
  })
})
