// Problem Description – Concurrency-Limited Task Executor

// You are given an array of asynchronous tasks and a number maxConcurrent. 
// Your task is to execute the tasks while ensuring that no more than maxConcurrent tasks run at the same time. 
// As soon as one task completes, the next pending task should start. 
// The final output must preserve the original task order.
async function taskScheduler(tasks, maxConcurrent) {
    // return new Promise((resolve, reject) => {
    //     let result = []
    //     let completed = 0
    //     let active = 0
    //     let i = 0
    //     function runNext() {
    //         if (completed === tasks.length)
    //             return resolve(result)
    //         while (active < maxConcurrent && i < tasks.length) {
    //             const curr = i
    //             active++
    //             i++
    //             tasks[curr]()
    //             .then((res)=>result[curr]=res)
    //             .catch(reject)
    //             .finally(()=>{
    //                 active--
    //                 completed++
    //                 runNext()
    //             })
    //         }
    //     }
    //     runNext()
    // })
    let res = []
    let active = 0
    let index = 0
    while(active<maxConcurrent && index<tasks.length){
        let curr = index
        active++
        index++
        res[curr] = await tasks[curr]()
        active--
    }
    return res

}

module.exports = taskScheduler;
