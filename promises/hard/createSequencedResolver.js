// Problem Description – Ordered Event Emitter Bridge (Sequenced Resolver)
//
// You are required to implement createSequencedResolver() to handle out-of-order events.
//
// The resolver must support:
// 1. push(id, data): provides data for a given id
// 2. waitFor(id): returns a Promise that resolves when data for id is available
//
// Even if data arrives out of order, promises must resolve in strict order.
// Example: waitFor(2) must not resolve until id 1 has been pushed and resolved.
function createSequencedResolver() {
    let next = 1
    let dataStore = new Map()
    let waiter = new Map()
    function execute(){
        while(dataStore.has(next)){
            const data = dataStore.get(next)
            if(waiter.has(next)){
                const resolve = waiter.get(next)
                resolve(data)
                waiter.delete(next)
            }
            dataStore.delete(next)
            next++
        }   
    }
    return {
        push(id, data){
            dataStore.set(id, data)
            execute()
        },
        waitFor(id){
            return new Promise((resolve)=>{
                waiter.set(id, resolve)
                execute()
            })
        }
    }
}

module.exports = createSequencedResolver;
