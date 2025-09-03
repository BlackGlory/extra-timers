import { setTimeout } from './set-timeout.js'

export function setTimeoutLoop(timeout: number, cb: () => unknown): () => void {
  let isCancelled = false
  let cancel = setTimeout(timeout, loop)
  return () => {
    isCancelled = true
    cancel()
  }

  async function loop() {
    await cb()
    if (!isCancelled) {
      cancel = setTimeout(timeout, loop)
    }
  }
}
