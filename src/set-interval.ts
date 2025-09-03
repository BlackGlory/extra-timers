import { setTimeout } from './set-timeout.js'

export function setInterval(timeout: number, cb: () => unknown): () => void {
  let isCancelled = false
  let cancel = setTimeout(timeout, handler)

  return () => {
    isCancelled = true
    cancel()
  }

  async function handler(): Promise<void> {
    if (!isCancelled) {
      cancel = setTimeout(timeout, handler)

      await cb()
    }
  }
}
