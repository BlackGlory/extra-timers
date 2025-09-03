import { setTimeout } from './set-timeout.js'

export function setImmediate(cb: () => unknown): () => void {
  if (globalThis.setImmediate) {
    const timer = globalThis.setImmediate(cb)
    return () => clearImmediate(timer)
  } else {
    return setTimeout(0, cb)
  }
}
