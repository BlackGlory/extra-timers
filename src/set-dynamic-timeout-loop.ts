import { setTimeout } from './set-timeout.js'

export function setDynamicTimeoutLoop(timeout: number, cb: () => unknown): () => void {
  let isCancelled = false
  let cancel = setTimeout(timeout, handler)

  return () => {
    isCancelled = true
    cancel()
  }

  async function handler(): Promise<void> {
    const start = Date.now()
    await cb()
    const elapsed = Date.now() - start

    if (!isCancelled) {
      cancel = setTimeout(Math.max(timeout - elapsed, 0), handler)
    }
  }
}
