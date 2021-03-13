import { setTimeout } from './set-timeout'

export function setDynamicTimeoutLoop(cb: () => unknown, timeout: number): () => void {
  let isCancelled = false
  let cancel = setTimeout(loop, timeout)
  return () => {
    isCancelled = true
    cancel()
  }

  async function loop() {
    const start = Date.now()
    await cb()
    const elapsed = Date.now() - start
    if (!isCancelled) cancel = setTimeout(loop, Math.max(timeout - elapsed, 0))
  }
}
