// Problem Description – Worker Pool with Backpressure
//
// You are required to implement a WorkerPool that limits concurrent execution
// of async tasks.
//
// The pool should accept tasks via an enqueue() method.
// Only N tasks may run at the same time.
// The internal queue has a maximum capacity.
//
// If enqueue() is called when the queue is full, it must immediately
// return a rejected Promise to signal backpressure.
//
// This pattern is commonly used to prevent overload in high-throughput systems.

class WorkerPool {
  constructor(limit, maxQueue) {
    this.limit = limit;
    this.maxQueue = maxQueue;
    this.queue = [];
    this.running = 0;
  }

  enqueue(task) {
    if (this.maxQueue === 0) {
      return Promise.reject(new Error("Queue is full"));
    }
    // ✅ Free slot → run right away
    if (this.running < this.limit) {
      return new Promise((resolve, reject) => {
        this.queue.push({ task, resolve, reject });
        this.run();
      });
    }

    if (this.queue.length >= this.maxQueue) {
      return Promise.reject(new Error("Queue is full"));
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
    });
  }

  run() {
    while (this.running < this.limit && this.queue.length > 0) {
      this.running++;
      const { task, resolve, reject } = this.queue.shift();
      Promise.resolve(
        task()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.running--;
            this.run();
          }),
      );
    }
  }
}

module.exports = WorkerPool;
