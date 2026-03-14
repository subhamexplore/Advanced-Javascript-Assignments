// Problem Description – Task Execution with Dependencies
//
// You are given a set of asynchronous tasks where some tasks depend
// on the completion of others.
// Your goal is to execute each task only after all of its dependencies
// have been successfully completed.
// The solution should ensure correct execution order and handle
// dependency relationships properly.
//
// Each task is asynchronous and must invoke a callback when finished.
// Invoke finalCallback after all tasks have completed, or with an error
// if any task fails.

function runWithDependencies(tasks, finalCallback) {
    let done = new Set();
    let started = new Set();
    let results = {}

    function run() {
        for (let obj of tasks) {
            const {id, deps, run: taskFn} = obj
            if (started.has(id)) continue;
            if (deps.every(d => done.has(d))) {
                started.add(id);
                taskFn((err, data) => {
                    if (err) 
                        return finalCallback(err);
                    results[id] = data
                    done.add(id);
                    if (done.size === tasks.length)
                        return finalCallback(null, results);
                    run();
                });
            }
        }
    }
    run();
}

module.exports = runWithDependencies;