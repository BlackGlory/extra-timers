export function setTimeout(timeout: number, cb: () => unknown): () => void {
  const timer = globalThis.setTimeout(cb, timeout)
  return () => clearTimeout(timer)
}
