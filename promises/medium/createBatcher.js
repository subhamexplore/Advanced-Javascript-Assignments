// Problem Description – Async Batch Processor (Time or Count)
//
// You are required to implement createBatcher(processorFn, maxBatchSize, maxWaitMs).
//
// The batcher should collect incoming items and process them in batches.
//
// It must return add(item):
// 1. Add items into a buffer
// 2. If buffer reaches maxBatchSize, call processorFn(batch) immediately
// 3. If maxWaitMs passes before reaching maxBatchSize, call processorFn with the partial batch
// 4. After processing, reset the buffer and timer so no items remain stuck

function createBatcher(processorFn, maxBatchSize, maxWaitMs) {
  let buffer = [];
  let timer = null;
  let resolver = [];

  function add(item) {
    return new Promise((resolve, reject) => {
      buffer.push(item);
      resolver.push({ item, resolve, reject });

      if (!timer) {
        timer = setTimeout(() => {
          if (buffer.length > 0) {
            const batch = buffer;
            const currResolver = resolver;

            buffer = [];
            resolver = [];
            timer = null;

            processorFn(batch)
              .then((data) => {
                for (let i = 0; i < currResolver.length; i++) {
                  const { item, resolve } = currResolver[i];
                  if (data)
                    resolve(data[item]); // handles object response
                  else resolve(); // handles no return case
                }
              })
              .catch((err) => {
                for (let i = 0; i < currResolver.length; i++) {
                  currResolver[i].reject(err);
                }
              });
          } else {
            timer = null;
          }
        }, maxWaitMs);
      }

      if (buffer.length === maxBatchSize) {
        const batch = buffer;
        const currResolver = resolver;

        buffer = [];
        resolver = [];

        if (timer) {
          clearTimeout(timer);
          timer = null;
        }

        processorFn(batch)
          .then((data) => {
            for (let i = 0; i < currResolver.length; i++) {
              const { item, resolve } = currResolver[i];
              if (data)
                resolve(data[item]); // handles object response
              else resolve(); // handles no return case
            }
          })
          .catch((err) => {
            for (let i = 0; i < currResolver.length; i++) {
              currResolver[i].reject(err);
            }
          });
      }
    });
  }

  return { add }
}

module.exports = createBatcher;
