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
function setTimeout(cb: () => unknown, timeout: number): () => void
```

A wrapper for `globalThis.setTimeout`, with the following differences:
- No function parameters binding.
- The return value is the function to cancel the timer.

### setInterval

```ts
function setInterval(cb: () => unknown, timeout: number): () => void
```

A wrapper for `globalThis.setInterval`, with the following differences:
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
function setTimeoutLoop(cb: () => unknown, timeout: number): () => void
```

Create an interval timer using the nested `setTimeout`,
which does not schedule the next run until the callback function returns.

The return value is the function to cancel the timer.

### setDynamicTimeoutLoop

```ts
function setDynamicTimeoutLoop(cb: () => unknown, timeout: number): () => void
```

Create an interval timer using the nested `setTimeout`,
which does not schedule the next run until the callback function returns,
and dynamically adjusts the interval time based on the execution time of the callback function.

The return value is the function to cancel the timer.
