// Problem Description – Smart Progress Bar (CPU Yielding)
//
// You need to process a large list of items without blocking
// the event loop.
//
// Process the items in small chunks and yield control back
// to the event loop after each chunk so the system stays responsive.
//
// Requirements:
// - Implement chunkedProcessor(items, processFn, onComplete).
// - Process items in fixed-size chunks.
// - Yield using setImmediate after each chunk.
// - Call onComplete after all items are processed.
function chunkedProcessor(items, processFn, onComplete) {
  const limit = 1000;
  let i = 0;
  function process() {
    const end = Math.min(i + limit, items.length);
    while (i < end) {
      processFn(items[i]);
      i++;
    }
    if (i < items.length) setImmediate(process);
    else onComplete();
  }
  process();
}

module.exports = chunkedProcessor;
