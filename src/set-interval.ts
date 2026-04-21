import { setTimeout } from './set-timeout.js'

export function setInterval(
  timeout: number
, callback: () => unknown
): () => void {
  let isCancelled = false
  let cancel = setTimeout(timeout, handler)

  return () => {
    isCancelled = true
    cancel()
  }

  function handler(): void {
    if (!isCancelled) {
      cancel = setTimeout(timeout, handler)

      callback()
    }
  }
}
