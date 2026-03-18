// Problem Description – Idempotent Async Execution
//
// You need to ensure that an asynchronous task identified by a key
// runs only once. If the same task is triggered again while it is
// still running, all callers should receive the same result.
//
// This problem tests deduplication and state synchronization.
//

function createIdempotentExecutor() {
  let res = new Map();
  return function(key, fn) {
    if (res.has(key)) {
      return res.get(key);
    }
    const promise = fn().finally(() => {
      res.delete(key);
    });
    res.set(key, promise);
    return promise;
  };
}

module.exports = createIdempotentExecutor;
