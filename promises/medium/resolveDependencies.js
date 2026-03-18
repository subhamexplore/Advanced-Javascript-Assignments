// Problem Description – Dependency Resolver (Simple DAG)
//
// You are given an object of tasks where each task may depend on other tasks.
// Your task is to implement resolveDependencies(tasks).
//
// Tasks without dependencies should start immediately in parallel.
// Tasks with dependencies must wait until all required parent tasks finish.
//
// Input example:
// { A: { fn }, B: { fn }, C: { fn, deps: ['A','B'] } }
async function resolveDependencies(tasks) {
  let results = {};
  for (let key in tasks) {
    const { fn, deps = [] } = tasks[key];
    const promise = deps.map((d) => results[d]);
    results[key] = Promise.all(promise).then(() => fn());
  }
  const resolved = await Promise.all(
    Object.entries(results).map(async ([key, promise]) => {
      const value = await promise;
      return [key, value];
    }),
  );
  return Object.fromEntries(resolved);
}

module.exports = resolveDependencies;
