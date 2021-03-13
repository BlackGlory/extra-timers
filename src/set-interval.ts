export function setInterval(timeout: number, cb: () => unknown): () => void {
  const timer = globalThis.setInterval(cb, timeout)
  return () => clearInterval(timer)
}
