import { setTimeout } from './set-timeout.js'

export function setImmediate(
  callback: () => unknown
): () => void {
  if (globalThis.setImmediate) {
    const timer = globalThis.setImmediate(callback)
    return () => clearImmediate(timer)
  } else {
    return setTimeout(0, callback)
  }
}
