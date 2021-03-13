import { setTimeout } from './set-timeout'

export function setDynamicTimeoutLoop(timeout: number, cb: () => unknown): () => void {
  let isCancelled = false
  let cancel = setTimeout(timeout, loop)
  return () => {
    isCancelled = true
    cancel()
  }

  async function loop() {
    const start = Date.now()
    await cb()
    const elapsed = Date.now() - start
    if (!isCancelled) cancel = setTimeout(Math.max(timeout - elapsed, 0), loop)
  }
}
