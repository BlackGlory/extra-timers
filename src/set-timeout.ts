import { isPositiveInfinity } from 'extra-utils'
import { pass } from '@blackglory/pass'

/**
 * `globalThis.setTimeout`支持的timeout仅支持到32位有符号整数的最大值.
 * 当超过此值时, 在不同平台上具有不同的非预期表现:
 * - 在浏览器上, 将溢出后的值视作timeout进行处理.
 * - 在Node.js上, 将timeout重置为1进行处理.
 */
const MAX_TIMEOUT = 2147483647

export function setTimeout(timeout: number, cb: () => unknown): () => void {
  if (isPositiveInfinity(timeout)) return pass

  /**
   * 用于处理超出最大值的timeout和[Node.js的bug](https://github.com/nodejs/node/issues/26578).
   */
  const targetTimestamp = Date.now() + timeout

  let cancel: () => void
  const timer = globalThis.setTimeout(
    () => {
      const elapsedTime = Date.now() - targetTimestamp
      if (elapsedTime >= 0) {
        cb()
      } else {
        cancel = setTimeout(-elapsedTime, cb)
      }
    }
  , Math.min(timeout, MAX_TIMEOUT)
  )
  cancel = () => clearTimeout(timer)

  return () => cancel()
}
