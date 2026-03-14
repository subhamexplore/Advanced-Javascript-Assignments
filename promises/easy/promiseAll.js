// Problem Description – Custom Implementation of Promise.all

// You are required to implement your own version of Promise.all without using the built-in method.
// The function should accept an array of values that may include Promises or plain constants.
// It must resolve with an array of results in the same order once all inputs resolve, or reject immediately if any input rejects.
function promiseAll(promises) {
  if (!Array.isArray(promises)) {
    return Promise.reject(new TypeError("Input must be an array"));
  }
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }
    let count = 0;
    let results = [];
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i])
        .then((data) => {
          results[i] = data;
          count++;

          if (count === promises.length) resolve(results);
        })
        .catch(reject);
    }
  });
}

module.exports = promiseAll;
