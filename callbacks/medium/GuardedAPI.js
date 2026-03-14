// Problem Description – Async Initialization Gate
//
// You are required to design a mechanism for APIs that depend on an
// asynchronous initialization step.
// Any calls made before initialization completes should be queued and
// executed only after the initialization finishes.
// Calls made after initialization should execute immediately.
//
// The initialization task and API functions must invoke callbacks when
// they complete.
class GuardedAPI {
  constructor() {
    this.queue = [];
    this.complete = false
  }

  init(initTask) {
    this.initTask = initTask;
    this.initTask(() => {
      this.complete = true
      this._flush()
    });
  }

  call(apiFn, onComplete) {
    if(!this.complete){
      this.queue.push({ apiFn, onComplete });
    }else{
      apiFn((err, data)=>{
        onComplete(err, data)
      })
    }
  }

  _flush() {
    while (this.queue.length > 0) {
      const { apiFn, onComplete } = this.queue.shift();
      apiFn((err, data) => {
        onComplete(err, data);
      });
    }
  }
}

module.exports = GuardedAPI;
