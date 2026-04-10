// Problem Description – Request Batcher
//
// You are required to implement a batcher that groups multiple requests
// within a short time window into a single bulk request.
//
// Requirements:
// 1. Requests added within the batch window must be sent together
// 2. Each caller must receive only its own result
// 3. Only one network call should be made per batch window

function createBatcher(fetchBulk, delayMs = 50) {

  let queue = [];
  let resolvers = new Map();
  let timer = null;
  return function batchRequest(id) {
    return new Promise((resolve, reject) => {
      queue.push(id);
      if (!resolvers.has(id)) {
        resolvers.set(id, []);
      }
      resolvers.get(id).push({ resolve, reject });
      if (!timer) {
        timer = setTimeout(async () => {
          const currentQueue = queue;
          const currentResolvers = resolvers;
          queue = [];
          resolvers = new Map();
          timer = null;
          try {
            const results = await fetchBulk(currentQueue);
            currentResolvers.forEach((handlers, id) => {
              handlers.forEach(({ resolve }) => {
                resolve(results[id]);
              });
            });
          } catch (err) {
            currentResolvers.forEach((handlers) => {
              handlers.forEach(({ reject }) => reject(err));
            });
          }
        }, delayMs);
      }
    });
  };
}

module.exports = createBatcher;
