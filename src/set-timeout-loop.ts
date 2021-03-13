import { setTimeout } from './set-timeout'

export function setTimeoutLoop(cb: () => unknown, timeout: number): () => void {
  let isCancelled = false
  let cancel = setTimeout(loop, timeout)
  return () => {
    isCancelled = true
    cancel()
  }

  async function loop() {
    await cb()
    if (!isCancelled) cancel = setTimeout(loop, timeout)
  }
}
