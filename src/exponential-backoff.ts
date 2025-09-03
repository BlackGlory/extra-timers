import { randomIntInclusive } from 'extra-rand'

export function calculateExponentialBackoffTimeout({
  baseTimeout
, retries
, maxTimeout = Infinity
, factor = 2
, jitter = true
}: {
  baseTimeout: number
  retries: number
  maxTimeout?: number
  factor?: number
  jitter?: boolean
}): number {
  const timeout = Math.min(factor ** retries * baseTimeout, maxTimeout)
  return jitter
       ? randomIntInclusive(0, timeout)
       : timeout
}
