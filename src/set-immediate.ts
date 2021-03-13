import { setTimeout } from './set-timeout'

export function setImmediate(cb: () => unknown): () => void {
  if (globalThis.setImmediate) {
    const timer = globalThis.setImmediate(cb)
    return () => clearImmediate(timer)
  } else {
    return setTimeout(cb, 0)
  }
}
