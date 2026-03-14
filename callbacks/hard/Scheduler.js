// Problem Description – Preemptive Priority Task Scheduler
//
// You are required to build a scheduler that executes async tasks
// based on priority.
//
// Higher-priority tasks should be executed before lower-priority ones.
// Long-running tasks must periodically yield control back to the scheduler
// so that newly arrived high-priority tasks can be processed.
//
// True preemption is not possible in JavaScript, so tasks must cooperate
// by yielding execution voluntarily.

class Scheduler {
  constructor() {
    this.queue = [];
  }
  schedule(task, priority = 0) {
    this.queue.push({ task, priority });
    this.queue.sort((a, b) => b.priority - a.priority);
  }
  run(onAllFinished) {
    if (this.queue.length === 0) {
      return onAllFinished(null);
    }
    const { task } = this.queue.shift();
    task((err) => {
      if (err) return onAllFinished(err);
      this.run(onAllFinished);
    });
  }
}

module.exports = Scheduler;
