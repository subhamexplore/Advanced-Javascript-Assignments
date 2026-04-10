// Problem Description – Async Mutex with Timeout
//
// You need to acquire a lock before running an async task.
// If the lock cannot be acquired within a given time limit,
// the operation should fail.
//
// This problem tests concurrency control and timeout handling.
//

class TimedMutex {
  constructor() {
    this.locked = false;
    this.queue = [];
  }
  acquire(timeoutMs) {
    return new Promise((resolve, reject) => {
      // If lock is free, take immediately
      if (!this.locked) {
        this.locked = true;
        resolve(this._release());
        return;
      }
      // Otherwise, wait in queue
      const timeout = setTimeout(() => {
        // Remove from queue on timeout
        const idx = this.queue.indexOf(waiter);
        if (idx !== -1) this.queue.splice(idx, 1);
        reject("Lock Timeout");
      }, timeoutMs);
      const waiter = () => {
        clearTimeout(timeout);
        this.locked = true;
        resolve(this._release());
      };
      this.queue.push(waiter);
    });
  }

  _release() {
    return () => {
      if (this.queue.length > 0) {
        // Give lock to next waiting task
        const next = this.queue.shift();
        next();
      } else {
        this.locked = false;
      }
    };
  }
}

module.exports = TimedMutex;
