// Problem Description – Block Event Loop
//
// In Node.js, long-running synchronous operations block the event loop,
// preventing other tasks (like timers or I/O) from executing.
//
// Your task is to implement a function `blockEventLoop(ms)` that
// synchronously blocks the execution for the given duration.
//
// Requirements:
// 1. Do NOT use `setTimeout` or Promises (those are non-blocking).
// 2. Use a `while` loop with `Date.now()` or `performance.now()`.
// 3. This is a teaching tool to show how NOT to write async code.

function blockEventLoop(ms) {
    const start = Date.now()
    let curr = Date.now();
    while(curr-start<=ms){
        curr = Date.now()
    }
}

module.exports = blockEventLoop;
