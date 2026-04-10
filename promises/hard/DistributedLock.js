// Problem Description – Distributed Mutex with Expiry (TTL Lock)
//
// You are required to implement a DistributedLock that provides exclusive access
// to a resource identified by a lockKey.
//
// Only one client can hold a lock at a time.
// If the lock is already held, new acquire requests must wait in a FIFO queue.
//
// Requirements:
// 1. Exclusive Access: only one active lock holder per lockKey
// 2. FIFO Queue: waiting acquire() calls must be served in order
// 3. TTL Expiry (Deadlock Guard):
//    - each lock is granted with a ttl (ms)
//    - after ttl expires, lock must auto-expire and be granted to next waiter
// 4. Safe Unlock:
//    - unlock() should release the lock immediately
//    - if unlock() is called after ttl already expired, ignore it
// 5. Lock Extension:
//    - extend(additionalMs) should increase ttl only if caller still owns the lock
//    - if caller lost ownership, ignore / reject
//
class DistributedLock {
  constructor() {
    // lockKey → { owner, timer, queue: [] }
    this.locks = {};
  }

  async acquire(lockKey, ttlMs) {
    // Initialize lock state if first time
    if (!this.locks[lockKey]) {
      this.locks[lockKey] = { owner: null, timer: null, queue: [] };
    }

    const state = this.locks[lockKey];

    // If no one holds the lock, grab it immediately
    if (!state.owner) {
      return this._grant(lockKey, ttlMs);
    }

    // Otherwise wait in FIFO queue
    return new Promise(resolve => {
      state.queue.push({ resolve, ttlMs });
    });
  }

  _grant(lockKey, ttlMs) {
    const state = this.locks[lockKey];

    // Create a unique token to identify this lock holder
    const token = Symbol();
    state.owner = token;

    // Auto-expire after ttlMs (deadlock guard)
    state.timer = setTimeout(() => {
      if (state.owner === token) {
        this._release(lockKey);
      }
    }, ttlMs);

    // Return handle to the caller
    return {
      unlock: () => {
        // Only release if still the owner
        if (state.owner === token) {
          clearTimeout(state.timer);
          this._release(lockKey);
        }
        // else: TTL already expired, ignore
      },

      extend: (additionalMs) => {
        // Only extend if still the owner
        if (state.owner !== token) return;

        clearTimeout(state.timer);
        state.timer = setTimeout(() => {
          if (state.owner === token) {
            this._release(lockKey);
          }
        }, additionalMs);
      }
    };
  }

  _release(lockKey) {
    const state = this.locks[lockKey];
    state.owner = null;
    state.timer = null;

    // Hand off to next waiter in queue (FIFO)
    if (state.queue.length > 0) {
      const { resolve, ttlMs } = state.queue.shift();
      resolve(this._grant(lockKey, ttlMs));
    }
  }
}

module.exports = DistributedLock;
