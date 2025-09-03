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
- The return value is the function to cancel the timer.
- It works correctly on Node.js ([nodejs#26578](https://github.com/nodejs/node/issues/26578))
- It works correctly when `timeout` is `Infinity`.
- It works correctly when `timeout` is greater than `2147483647`.

### setSchedule
```ts
function setSchedule(timestamp: number, cb: () => unknown): () => void
```

A wrapper for `setTimeout`.

### setInterval
```ts
function setInterval(timeout: number, cb: () => unknown): () => void
```

A wrapper for `setTimeout` instead of `globalThis.setInterval`.

### setImmediate
```ts
function setImmediate(cb: () => unknown): () => void
```

A wrapper for `gloalThis.setImmediate` and `setTimeout(0, cb)`.

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
