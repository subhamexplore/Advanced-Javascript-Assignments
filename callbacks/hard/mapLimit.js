// Problem Description – Parallel Execution with Concurrency Limit
//
// You need to execute many asynchronous tasks (e.g., image downloads),
// but only a fixed number are allowed to run at the same time to avoid
// resource exhaustion.
//
// This problem tests concurrency control and result ordering.
//
// Requirements:
// - Accept an array of tasks and a concurrency limit.
// - Run at most `limit` tasks in parallel until all are completed.
// - Return results in the original task order via onAllFinished.

function mapLimit(tasks, limit, onAllFinished) {
  let results = [];
  let active = 0;
  let i = 0;
  let completed = 0
  function next() {
    if(completed===tasks.length)
        onAllFinished(null, results)
    while (active < limit && i<tasks.length) {
      const current = i;
      i++;
      active++;
      tasks[current]((err, data) => {
        results[current] = data;
        completed++
        active--;
        next()
      });
    }
  }
  next();
}

module.exports = mapLimit;
