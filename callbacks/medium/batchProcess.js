// Problem Description – Ordered Parallel Batcher
//
// You need to process many items in parallel, but with a fixed
// concurrency limit to avoid resource exhaustion.
//
// Tasks should start as soon as a slot is free, and the final
// results must preserve the original input order.
//
// Requirements:
// - Run at most `limit` workers in parallel.
// - Preserve the original order of results.
// - Start new work as soon as one finishes.
// - Stop and return an error if any task fails.

function batchProcess(items, limit, worker, onComplete) {
    let results = new Array(items.length)
    let active = 0
    let index = 0 
    let completed = 0

    function runNext(){
        if(completed===items.length)
            return onComplete(null, results)
        while(active<limit && index<items.length){
            let currentIndex = index
            index++
            active++
            worker(items[currentIndex], (err, data)=>{
                if(err)
                    return onComplete(err)
                results[currentIndex] = data
                active--
                completed++
                runNext()
            })
        }
    }
    runNext()
}
    
module.exports = batchProcess;
