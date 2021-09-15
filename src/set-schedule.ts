import { setTimeout } from './set-timeout'

export function setSchedule(timestamp: number, cb: () => unknown): () => void {
  const timeout = Math.max(timestamp - Date.now(), 0)
  return setTimeout(timeout, cb)
}
