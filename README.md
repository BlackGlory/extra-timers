# extra-timers
Utilities for timers.

## Install
```sh
npm install --save extra-timers
# or
yarn add extra-timers
```

## API
### setTimeout
```ts
function setTimeout(timeout: number, cb: () => unknown): () => void
```

A wrapper for `globalThis.setTimeout`, with the following differences:
- Better order of parameters.
- No function parameters binding.
- The return value is the function to cancel the timer.

### setSchedule
```ts
function setSchedule(timestamp: number, cb: () => unknown): () => void
```

### setInterval
```ts
function setInterval(timeout: number, cb: () => unknown): () => void
```

A wrapper for `globalThis.setInterval`, with the following differences:
- Better order of parameters.
- No function parameters binding.
- The return value is the function to cancel the timer.

### setImmediate
```ts
function setImmediate(cb: () => unknown): () => void
```

A wrapper for `globalThis.setImmedidate`, with the following differences:
- No function parameters binding.
- The return value is the function to cancel the timer.

When `globalThis.setImmediate` does not exist, it will fall back to `setTimeout(cb, 0)`.

### setTimeoutLoop
```ts
function setTimeoutLoop(timeout: number, cb: () => unknown): () => void
```

Create an interval timer using the nested `setTimeout`,
which does not schedule the next run until the callback function returns.

The return value is the function to cancel the timer.

### setDynamicTimeoutLoop
```ts
function setDynamicTimeoutLoop(timeout: number, cb: () => unknown): () => void
```

Create an interval timer using the nested `setTimeout`,
which does not schedule the next run until the callback function returns,
and dynamically adjusts the interval time based on the execution time of the callback function.

The return value is the function to cancel the timer.

### calculateExponentialBackoffTimeout
```ts
function calculateExponentialBackoffTimeout({
  baseTimeout
, retries
, maxTimeout = Infinity
, factor = 2
, jitter = true
}: {
  baseTimeout: number
  retries: number
  maxTimeout?: number
  factor?: number
  jitter?: boolean
}): number
```
