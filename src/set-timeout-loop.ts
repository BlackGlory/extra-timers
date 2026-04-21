import { Awaitable } from 'justypes'
import { setTimeout } from './set-timeout.js'

export function setTimeoutLoop(
  timeout: number
, callback: () => Awaitable<unknown>
): () => void {
  let isCancelled = false
  let cancel = setTimeout(timeout, handler)

  return () => {
    isCancelled = true
    cancel()
  }

  async function handler(): Promise<void> {
    await callback()

    if (!isCancelled) {
      cancel = setTimeout(timeout, handler)
    }
  }
}
