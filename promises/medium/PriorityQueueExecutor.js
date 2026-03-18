// Problem Description – Priority Task Queue
//
// You are required to implement a PriorityQueueExecutor that runs async tasks sequentially.
//
// The executor must support push(task, priority), where higher priority runs first.
// If tasks are waiting, newly added high-priority tasks should jump ahead of lower-priority ones.
class PriorityQueueExecutor {
  constructor() {
    this.queue = [];
  }
  push(task, priority = 0) {
    this.queue.push({ task, priority });
    this.queue.sort((a, b) => b.priority - a.priority);
    this._run();
  }
  async _run() {
    if (this.running) return;
    this.running = true;
    while (this.queue.length) {
      const { task } = this.queue.shift();
      await task();
    }
    this.running = false;
  }
}

module.exports = PriorityQueueExecutor;
