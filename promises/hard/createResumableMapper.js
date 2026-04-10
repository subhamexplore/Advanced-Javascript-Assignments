// Problem Description – Resumable Async Map
//
// You are given an array of async tasks and a concurrency limit.
// Your task is to implement createResumableMapper(tasks, limit).
//
// The function must return an object with:
// 1. start(): starts/resumes processing and resolves when all tasks complete
// 2. pause(): stops scheduling new tasks (running tasks may finish)
// 3. getStatus(): returns progress info (completed, pending, running)
//
// When resumed, processing must continue from where it paused
// without re-running already completed tasks.
function createResumableMapper(tasks, limit) {
  let completed = 0;
  let running = 0;
  let paused = false;
  let i = 0;
  const results = new Array(tasks.length);

  let resolveFinal;
  let finalPromise = new Promise((res) => {
    resolveFinal = res;
  });
  function schedule() {
    if (paused) return;
    while (running < limit && i < tasks.length) {
      const curr = i++;
      running++;
      tasks[curr]()
        .then((res) => {
          results[curr] = res;
          completed++;
        })
        .catch(() => {
          completed++;
        })
        .finally(() => {
          running--;
          if (completed === tasks.length) resolveFinal(results);
          else schedule();
        });
    }
  }
  return {
    start() {
      paused = false;
      schedule();
      return finalPromise;
    },
    pause() {
      paused = true;
    },
    getStatus() {
      return {
        completed,
        running,
        pending: tasks.length - completed - running,
      };
    },
  };
}

module.exports = createResumableMapper;
