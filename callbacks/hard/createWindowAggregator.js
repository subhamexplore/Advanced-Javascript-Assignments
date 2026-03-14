// Problem Description – Sliding Window (Moving Average) Aggregator
//
// You are receiving a stream of numeric values asynchronously
// (e.g., sensor readings).
//
// Your task is to maintain a sliding window of the last N values
// and compute the moving average whenever a new value arrives.
//
// This problem tests state management and async data handling.
//
// Requirements:
// - Maintain only the last N values (fixed-size window).
// - Accept values asynchronously via a callback-style input.
// - On each new value, compute and emit the current average.
// - Before N values are received, compute the average
//   using only the available values.

function createWindowAggregator(windowSize, onWindowReady) {
  let arr = [];

  return function(value) {
    arr.push(value);
    if (arr.length > windowSize) {
      window.shift();
    }
    let sum = 0;
    for (let num of arr)
      sum += num;
    const avg = sum / window.length;
    onWindowReady(avg);
  };
}

module.exports = createWindowAggregator;
