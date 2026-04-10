// Problem Description – Stale-While-Revalidate Flight Tracker
//
// You are required to implement createSWRManager(fetcherFn, ttl).
//
// The manager should return cached data immediately for fast responses,
// but refresh stale data in the background.
//
// Requirements:
// 1. If cached value exists, return it immediately
// 2. If cache age exceeds ttl, trigger a background refresh
// 3. If refresh fails, keep stale cached data (do not crash)
// 4. If multiple calls happen during refresh, deduplicate and share one refresh promise
//
function createSWRManager(fetcherFn, ttl) {
  let cache = new Map();
  let lastFetch = new Map();
  let result = new Map();
  function refresh(key) {
    if (!result.has(key)) {
      const p = fetcherFn()
        .then((data) => {
          cache.set(key, data)
          lastFetch.set(key, Date.now());
          return data;
        })
        .catch((err) => err)
        .finally(() => {
          result.delete(key)
        });
        result.set(key, p)
    }
    return result.get(key);
  }
  return {
    get(key) {
      const now = Date.now();
      if (!cache.has(key)) return refresh(key);
      if (now - lastFetch.get(key) > ttl) refresh(key);
      return cache.get(key);
    },
  };
}

module.exports = createSWRManager;
