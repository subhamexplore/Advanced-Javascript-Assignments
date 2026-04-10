// Problem Description – Sliding Window Rate Limited Collector
//
// You are required to implement createThrottledCollector(batchFn, batchSize, msLimit).
//
// The collector receives high-frequency data and processes it in batches.
//
// Requirements:
// 1. Collect incoming items into batches of size batchSize
// 2. Process each batch using batchFn(batch)
// 3. Enforce rate limiting: no more than 2 batches per second (msLimit based)
// 4. add(item) must return a Promise that resolves with the result of the batch
//    that item was processed in
//

function createThrottledCollector(batchFn, batchSize, msLimit) {
    let currentBatch = [];        // items waiting to be processed
    let batchResolvers = [];      // resolvers for each item's promise
    let lastProcessedTime = 0;    // when the last batch was processed
    let timer = null;             // scheduled batch timer

    function processBatch() {
        timer = null;

        // Rate limit check — how long since last batch?
        const now = Date.now();
        const timeSinceLast = now - lastProcessedTime;
        const waitTime = msLimit - timeSinceLast;

        if (waitTime > 0) {
            // Too soon — schedule retry after the wait
            timer = setTimeout(processBatch, waitTime);
            return;
        }

        // Grab one batch worth of items
        const batch = currentBatch.splice(0, batchSize);
        const resolvers = batchResolvers.splice(0, batchSize);

        lastProcessedTime = Date.now();

        // Run the batch and resolve all promises with the result
        Promise.resolve(batchFn(batch)).then(result => {
            resolvers.forEach(resolve => resolve(result));
        });

        // If more items are waiting, schedule the next batch
        if (currentBatch.length > 0) {
            timer = setTimeout(processBatch, msLimit);
        }
    }

    function add(item) {
        return new Promise(resolve => {
            currentBatch.push(item);
            batchResolvers.push(resolve);

            // Trigger immediately when batch is full
            if (currentBatch.length >= batchSize) {
                if (timer) clearTimeout(timer);
                processBatch();
            } else if (!timer) {
                // Flush partial batch after msLimit (in case it never fills up)
                timer = setTimeout(processBatch, msLimit);
            }
        });
    }

    return { add };
}

module.exports = createThrottledCollector;
