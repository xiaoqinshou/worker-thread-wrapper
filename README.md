# workerThreadWrapper
* Secondary development based on [simple-web-worker]()
> An utility to simplify the use of web workers. like to java thread class

## Changelog

### **0.0.8**

#### _Highlights:_
* 0.0.1: First upload. and 
* 0.0.2: add typings. dist/index.d.ts
* 0.0.3: modify rollup.config types file. dist/index.d.ts
* 0.0.4: modify types definition. Use when perfecting typescript project references
* 0.0.5: Remove redundant dependencies on npm.
* 0.0.6: Add Thread Pool Executor. Manage the use of workers as a pool
* 0.0.7: Remove .history files on npm
* 0.0.8: Remove yarn.lock and other files on npm
## Why

Create and use [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) can be cumbersome sometimes. This plugin aims to facilitate the use of Web Workers.

## How to install and use

```
yarn add worker-thread-wrapper

// or

npm install worker-thread-wrapper --save
```

Then:

```javascript
import WorkerBuilder from 'worker-thread-wrapper'
// new WorkerBuilder()
const builder = new WorkerBuilder()
// Returns a thread wrapper class
const Thread = builder.build()

// run thread 
new Thread().run(your_task, [args])(delay).then().catch()

// Returns undefined if the browser does not have the execution conditions
const promise = new Thread().run(your_task, [args])(delay)
// promise is undefined
// console.error: This browser does not have the conditions for execution

// Returns a thread pool class
const ThreadPoolExecutor = build.buildPoolExecutor()

// The thread pool is preferably a singleton
const pool = new ThreadPoolExecutor()

// Submit tasks that need to be executed asynchronously
pool.submit({
  func: your_function,
  args: [parm_1,parm_2,parm_3,...],
  success: (event)=>void,
  error: (event)=>void
})
```
Obviously, you don't have to call it `WorkerBuilder` and `Thread`. You are free to use the name you want!

## <font color=red>Warning</font>
* <font color=red>warning...</font>
* <font color=red>warning...</font>
* <font color=red>warning...</font>
* A thread corresponds to a web worker
```js
// like this
new Thread().run(your_task, [args])(delay) ==== new Worker()
```
* reference: 
  *  my computer (MacBook air M1 cpu) run at most 503 webWorker. 504 or more page crashes
  * My friends computer (MacBook pro Intel cpu) run at about 200, less than 300 webWorker, about 300 page crashes
  *  So the maximum number depends on the client


## Class
### Thread
#### run(_func, [args]?_)(delay?_)

> Where:
>* _func_ is the function to be runned in worker
>* _[args]_ is an optional array of arguments that will be used by _func_
>* delay is the max live time on the worker

>This method creates a disposable web worker, runs and returns the result of given function and closes the worker. Or Complete within the time to live
<br>
<br>This method works like Promise.resolve(), but in another thread.

E.g.:
```javascript
// Automatically closes until the function is executed
 new Thread().run(() => 'SWorker run 1: Function in other thread')()?.then(console.log) // logs 'Thread run 1: Function in other thread'
  .catch(console.error) // logs any possible error

new Thread().run((arg1, arg2) => `SWorker run 2: ${arg1} ${arg2}`, ['Another', 'function in other thread'])()?.then(console.log) // logs 'Thread run 2: Another function in other thread'
    .catch(console.error) // logs any possible error

// setting survival time is 2050 ms. 
// The function executes about 2000ms or more
// returns hello world
new Thread().run(index => {
      let start = (new Date()).getTime();
      while (new Date().getTime() - start < 2000) {
        continue;
      }
      return index
    }, ["hello world"])(2050)?.then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => {
        return err
      })

// setting survival time is 1950 ms
// The function executes about 2000ms or more
// returns timeOver. this woker is closed
new thread().run(index => {
      let start = (new Date()).getTime();
      while (new Date().getTime() - start < 2000) {
        continue;
      }
      return index
    }, ["hello world"])(1950)?.then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => {
        return err
      }) 

// setting survival time is 1950~2050 ms
// The function executes about 2000ms or more
// maybe returns `hello world` or `timeOver. this woker is closed`
new thread().run(index => {
      let start = (new Date()).getTime();
      while (new Date().getTime() - start < 2000) {
        continue;
      }
      return index
    }, ["hello world"])(2000)?.then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => {
        return err
      }) 
```

### ThreadPoolExecutor
#### constructor
* options: 
```typescript
{
  // Number of threads that will not be destroyed.
  // defailt 5
  corePoolSize: number;
  // maximum of threads, 
  // defailt 10
  maximumPoolSize: number;
  // Time to live beyond the number of cores
  // default 30
  keepAliveTime: number;
  // time unit 
  // default TimeUnit.SECONDS
  timeUnit: TimeUnit;
  // task queue
  // default new ArrayQueue<ThreadPoolTask>(20)
  workQueue: Queue<ThreadPoolTask>;
  // Factory for producing threads
  // default new SimpleThreadUnitFactory()
  workerFactory?: ThreadFactory<W>;
  // rejected Handler
  // default new DefalutHandler()
  rejectedExecutionHandler?: RejectedExecutionHandler;
}
```

* extends ThreadFactory. Implement a custom worker script

#### submit: (task: ThreadPoolTask) => void
* options: 
```typescript
{
  func: Function,
  args?: [],
  success: (event: Event) => void,
  error?: (event: Event) => void,
}
```
* func is your_task function
* args: this function arguments
* success: thread success result
* error:  thread error result
---
#### E.G
```ts
const ThreadPool = new WorkerBuilder().buildPoolExecutor();
// default options pool
const pool = new ThreadPool();

// defailt
pool.submit({
        func: function () {
          return 'Run with args and default t1'
        },
        success: function (event) {
          console.log(event.data)
        }
      })
// console.log => Run with args and default t1

// promise
await new Promise((resolve, reject) => {
      pool.submit({
        func: function () {
          return 'Run with args and default t1'
        },
        success: function (event) {
          resolve(event.data)
        }
      })
    }).then(result => result).catch(err => err)

// Run with args and default t1


// arguments
await new Promise((resolve, reject) => {
      pool.submit({
        func: (arg1, arg2) => `Run ${arg1} and ${arg2}. pool t4`,
        args: ['with args', 'with arrow function'],
        success: (event) => {
          resolve(event.data)
        }
      })
    }).then(result => result).catch(err => err)
// Run with args and with arrow function. pool t4

// queue is full
await new Promise((resolve, reject) => {
      pool.submit({
        func: (arg1, arg2) => `Run ${arg1} and ${arg2}. pool t4`,
        args: ['with args', 'with arrow function'],
        success: (event) => {
          resolve(event.data)
        }, 
        error: (error) => reject(error.message)
      })
    }).then(result => result).catch(err => err)
// console.error => new TypeError('task queue is full')
// and Trigger the error method
// So return task queue is full
```