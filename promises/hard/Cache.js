// Problem Description – Concurrent Cache with Deduplication and TTL
//
// You are required to implement a cache for async data fetching.
//
// The cache must:
// 1. Deduplicate concurrent requests for the same key
// 2. Cache resolved values with a time-to-live (TTL)
// 3. Return cached values if they are still valid
//
// If a cached value is close to expiry, return the current value
// but trigger a background refresh for future requests.
class Cache {
  constructor(ttl) {
    this.ttl = ttl;
    this.store = new Map(); // key -> { value, expiry }
    this.inFlight = new Map(); // key -> Promise
  }
  async get(key, fetcher) {
    const now = Date.now();
    const cached = this.store.get(key);
    // 1️⃣ If valid cache exists
    if (cached && cached.expiry > now) {
      // If near expiry → refresh in background
      if (cached.expiry - now < this.ttl / 2 && !this.inFlight.has(key)) {
        const refresh = fetcher()
          .then((data) => {
            this.store.set(key, {
              value: data,
              expiry: Date.now() + this.ttl,
            });
          })
          .finally(() => {
            this.inFlight.delete(key);
          });

        this.inFlight.set(key, refresh);
      }
      return cached.value;
    }
    // 2️⃣ If request already in progress → dedupe
    if (this.inFlight.has(key)) {
      return this.inFlight.get(key);
    }
    // 3️⃣ Start new fetch
    const promise = fetcher()
      .then((data) => {
        this.store.set(key, {
          value: data,
          expiry: Date.now() + this.ttl,
        });
        return data;
      })
      .finally(() => {
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, promise);
    return promise;
  }
}

module.exports = Cache;
