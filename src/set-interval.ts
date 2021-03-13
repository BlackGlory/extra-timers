export function setInterval(cb: () => unknown, timeout: number): () => void {
  const timer = globalThis.setInterval(cb, timeout)
  return () => clearInterval(timer)
}
