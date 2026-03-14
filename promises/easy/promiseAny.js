// Problem Description – promiseAny(promises)

// You are required to implement a function named promiseAny that accepts an array of Promises.
// The function should return a new Promise that resolves immediately when any one of the input promises resolves successfully.
// If all the promises reject, the returned Promise should reject with an error.
function promiseAny(promises) {
  if (!Array.isArray(promises)) {
    return Promise.reject(new TypeError("Input must be an array"));
  }
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      reject(new Error("Empty iterable"));
      return;
    }
    let fail = 0;
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i])
        .then(resolve)
        .catch((err) => {
          fail++;
          if (fail === promises.length) reject(new Error("All promises were rejected"));
        });
    }
  });
}

module.exports = promiseAny;
