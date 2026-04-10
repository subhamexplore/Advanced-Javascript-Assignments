// Problem Description – Hedged Circuit Breaker
//
// You are required to implement circuitHedgedFetch(url, options).
//
// The function should perform a hedged request:
// start a primary fetch immediately, and if it does not respond within 200ms,
// start a backup fetch in parallel.
//
// Additionally, the function must include a circuit breaker mechanism.
// If the API fails repeatedly, the circuit breaker should open and future calls
// must fail fast without making network requests.
//
// While the circuit is OPEN, the function should immediately return a cached value
// instead of attempting the hedged network logic.
//
// This combines hedged requests with circuit breaker state management.
// State persisted outside the function call
// State persisted outside
// Persistent circuit breaker state
let cbState = "CLOSED";
let failureCount = 0;
let lastKnownGoodValue = null;

const FAILURE_THRESHOLD = 3;

async function circuitHedgedFetch(url, options = {}) {
  if (cbState === "OPEN") {
    if (lastKnownGoodValue !== null) {
      return lastKnownGoodValue;
    }
    throw new Error("Circuit OPEN");
  }
  const primary = fetch(url, options);
  const backup = new Promise((resolve) => {
    setTimeout(() => {
      resolve(fetch(url, options));
    }, 200);
  });
  try {
    const response = await Promise.race([primary, backup]);
    const data = await response.json();
    failureCount = 0;
    cbState = "CLOSED";
    lastKnownGoodValue = data;
    return data;
  } catch (err) {
    failureCount++;
    if (failureCount >= FAILURE_THRESHOLD) {
      cbState = "OPEN";
    }
    if (lastKnownGoodValue !== null) {
      return lastKnownGoodValue;
    }
    throw err;
  }
}

module.exports = circuitHedgedFetch;
