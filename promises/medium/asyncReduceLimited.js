// Problem Description – Parallel Chunked Async Reducer

// You are required to process an array using a reducer function where the reduction happens in sequence, but the data fetching or processing for items is performed in parallel chunks.
// Each chunk should be processed concurrently, then reduced before moving to the next chunk.
// The final reduced result must be correct and deterministic.
async function asyncReduceLimited(
  array,
  limit,
  asyncProcessFn,
  reducer,
  initialValue,
) {
  let acc = initialValue;
  const processed = await mapAsyncLimit(array, limit, asyncProcessFn);
  for (let val of processed) acc = reducer(acc, val);
  return acc;
}

async function mapAsyncLimit(array, limit, asyncFn) {
  const result = [];
  for (let i = 0; i < array.length; i += limit) {
    const chunk = array.slice(i, limit + i);
    const chunkResult = await Promise.all(chunk.map(asyncFn));
    result.push(...chunkResult);
  }
  return result;
}

module.exports = asyncReduceLimited;
