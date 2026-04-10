
// Problem Description – Abortable Promise Wrapper

// You are required to wrap a Promise so that it can be cancelled using an AbortSignal.
// If the signal is aborted before the Promise settles, the wrapper should immediately reject with an appropriate error. 
// If not aborted, it should resolve or reject normally.

function makeCancellable(promise, signal) {
    return new Promise((resolve, reject) => {

        const abortError = () => new Error(signal.reason ?? "Aborted");

        if (signal.aborted) {
            return reject(abortError());
        }

        const onAbort = () => {
            reject(abortError());
        };

        signal.addEventListener("abort", onAbort, { once: true });

        promise
            .then(resolve)
            .catch(reject)
            .finally(() => {
                signal.removeEventListener("abort", onAbort);
            });
    });
}

module.exports = makeCancellable;
