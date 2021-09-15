import { setTimeout } from './set-timeout'

export function setSchedule(timestamp: number, cb: () => unknown): () => void {
  const timeout = timestamp - Date.now()
  return setTimeout(timeout, cb)
}
