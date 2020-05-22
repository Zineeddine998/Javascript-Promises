//The promise object has 3 main state


const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED ='REJECTED'

class APromise {
    constructor(executor){
        //initial state 
        this.state = PENDING;
        //the fullfilement value or the rejection reason is mapped internally to value 
        //initially the promise doesn't have the value
        //Add a queue that will constains the handlers until the state of the object changes from pending to fulfilled or rejected 
        this.q = [];
       
        //call the executor imidiately 
        doResolve(this , executor);
    }

    then(onFulfilled, onRejected){

        const promise = new APromise(() => {})
        handle(this, {onFulfilled , onRejected} )
        return promise;
    }
}

//depending on the state of the object promise we can call the handlers or store it until the object is ready
  function handle(promise, handler){
    
     while(promise.state !== REJECTED instanceof APromise){
        promise = promise.value;
    }
      if(promise.state === PENDING){
          promise.q.push(handler);
      }else {
          handleResolved(promise , handler);
      }
  }

  function handleResolved(promise, handler){
      const bananas = promise.state === FULFILLED ? handler.onFulfilled : handler.onRejected;

      if( typeof bananas !== 'funcction'){
          if(promise.state === FULFILLED ){
              fulfill(handler.promise , promise.value);
          }else {
              reject(handler.promsie, promise.value);
          }
          return 
      }
     try {
        const res = bananas(promise.value);
        fulfill(handler.promise , res);
     }catch(err) {
           reject(handler.promise, err);
     }
     
  }
function handleResolved(promise , onFulfilled , onRejected){

    setImediate(() => {
        const bananas = promise.state === FULFILLED ? onFulfilled : onRejected;
        bananas(promise.value);
    })
  
}
//fulfill the 'value'
function  fulfill (promise ,  value ){
    if(value === promise){
        return reject(promise , new TypeError())
    }

    if(value && (typeof value === 'object' || typeof value === 'function' )){
        let then 
        try {
            then = value.then;
        }catch (err){
            return reject(promise, err)
        }
    

    if(then === promise.then && promise instanceof APromise ){
    promise.state = FULFILLED;
    promise.value = value;
    recover(promise);
    }

    //thenable
    if(typeof then === 'function'){
        return doResolve(promise, then.bind(value))
    }
}

promise.state = FULFILLED;
    promise.value = value;
    recover(promise);

}

//or we can reject the reason 
function reject(promise , reason ){
    promise.state = REJECTED;
    promise.value = reason;
}

//Get the handlers storesd in the queue (if any)

function recover(promise){
    const length = promise.q.length;
    for(let i=0 ; i<length ; i++){
            handle(promise, promise.q[i]);
    }
}
// we need to pass the fulfill and the rejcet functions as arguments of the executor 

function deResolve(promise , executor){
    let beencalled = false;
    function wrapFulfill(value)
    {    if(beencalled) { return}
          beencalled = true;
        fulfill(promise, value)
    }
    function wrapReject(reason)
    {      if(beencalled) { return}
          beencalled = true;
        reject(promise, reason)
    }
    
  try{
            excutor(wrapFulfill , wrapReject)
        } catch (err) {
            wrapReject(err);
        }
}
