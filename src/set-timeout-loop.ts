import { setTimeout } from './set-timeout.js'

export function setTimeoutLoop(timeout: number, cb: () => unknown): () => void {
  let isCancelled = false
  let cancel = setTimeout(timeout, handler)

  return () => {
    isCancelled = true
    cancel()
  }

  async function handler(): Promise<void> {
    await cb()

    if (!isCancelled) {
      cancel = setTimeout(timeout, handler)
    }
  }
}
