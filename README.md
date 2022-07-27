# wokerThreadWrapper
* Secondary development based on [simple-web-worker]()
> An utility to simplify the use of web workers. like to java thread class

## Changelog

### **0.0.1**

#### _Highlights:_
* Added tests
* Fixed `object URL`'s not being revoked when worker is not being used anymore.

See full changelog [here](https://github.com/israelss/simple-web-worker/blob/master/changelog.md#120).

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
// Returns a thread wrapper class
const Thread = new WorkerBuilder().build()
```
Obviously, you don't have to call it `WorkerBuilder`. You are free to use the name you want!

## API

### Thread.run(_func, [args]?_)(delay?_)

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
 new Thread().run(() => 'SWorker run 1: Function in other thread')()
  .then(console.log) // logs 'Thread run 1: Function in other thread'
  .catch(console.error) // logs any possible error

new Thread().run((arg1, arg2) => `SWorker run 2: ${arg1} ${arg2}`, ['Another', 'function in other thread'])()
    .then(console.log) // logs 'SWorker run 2: Another function in other thread'
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
    }, ["hello world"])(2050)
      .then(result => {
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
    }, ["hello world"])(1950)
      .then(result => {
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
    }, ["hello world"])(2000)
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => {
        return err
      }) 
```