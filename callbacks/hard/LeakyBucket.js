// Problem Description – Leaky Bucket Rate Limiter
//
// You are required to implement a RateLimiter based on the Leaky Bucket algorithm.
//
// The rate limiter has a fixed capacity and processes tasks at a constant rate.
// Tasks are executed in the exact order they are received.
//
// Requirements:
// 1. The bucket has a maximum capacity
// 2. Tasks are processed at a fixed interval (leak rate)
// 3. If the bucket is full, new tasks must be rejected immediately
// 4. Fairness must be preserved (FIFO execution)

class LeakyBucket {
  constructor(capacity, leakRateMs) {
    this.bucket = [];
    this.capacity = capacity;
    this.leakRateMs = leakRateMs;
    this.timer = null;
  }

  add(task, onComplete) {
    if (this.bucket.length === this.capacity) {
      task((err) => {
        err = {};
        err.message = "Rate Limit Exceeded";
        onComplete(err);
      });
    }
    if (this.bucket.length < this.capacity) {
      this.bucket.push({ task, onComplete });
      if (!this.timer)
        this.timer = setInterval(() => this._process(), this.leakRateMs);
    }
  }

  _process() {
    if (this.bucket.length === 0) {
      clearInterval(this.timer);
      return;
    }
    const { task, onComplete } = this.bucket.shift();
    task((err, data) => {
      onComplete(err, data);
    });
  }
}

module.exports = LeakyBucket;
