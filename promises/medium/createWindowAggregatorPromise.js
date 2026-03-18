// Problem Description – Sliding Window Aggregator
//
// You are required to implement createWindowAggregator(batchProcessFn, size, windowMs).
//
// The aggregator collects items into a batch and processes them together.
//
// It must provide add(item):
// 1. Add item to the current batch
// 2. If batch size reaches size, immediately call batchProcessFn(batch)
// 3. If windowMs expires before reaching size, call batchProcessFn with the partial batch
// 4. After processing, reset the batch and start a new window

function createWindowAggregatorPromise(batchProcessFn, size, windowMs) {
  let buffer = [];
  let timer = null;
  function add(item) {
    buffer.push(item);
    if (buffer.length === 1) {
      timer = setTimeout(() => {
        const batch = buffer;
        buffer = [];
        timer = null;
        batchProcessFn(batch);
      }, windowMs);
    }
    if (buffer.length === size) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      const batch = buffer;
      buffer = [];
      batchProcessFn(batch);
    }
  }
  return { add };
}

module.exports = createWindowAggregatorPromise;
