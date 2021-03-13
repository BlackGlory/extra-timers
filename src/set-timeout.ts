export function setTimeout(cb: () => unknown, timeout: number): () => void {
  const timer = globalThis.setTimeout(cb, timeout)
  return () => clearTimeout(timer)
}
