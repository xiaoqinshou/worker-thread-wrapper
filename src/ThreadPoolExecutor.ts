import SimpleThreadUnitFactory from "./SimpleThreadUnitFactory";
import AbstractThreadPoolExecutor from "./AbstractThreadPoolExecutor";
import { RejectedExecutionHandler, ThreadFactory, ThreadPoolOptions, ThreadPoolTask, ThreadUnit, TimeUnit } from "./types";
import ArrayQueue from "./util/ArrayQueue";
import { Queue } from "./util/types";
import { isValid, argumentError, isValidObjectWith } from "./util/utils";

class ThreadPoolExecutor<W extends AbstractWorker & { postMessage: Function }> extends AbstractThreadPoolExecutor {

  // staitc constant
  private static readonly DEFAULT_INTERVAL = 100

  // defalut options 
  private corePoolSize: number
  private maximumPoolSize: number
  private keepAliveTime: number
  private timeUnit: TimeUnit
  private workQueue: Queue<ThreadPoolTask>
  private workerFactory?: ThreadFactory<W>
  private rejectedExecutionHandler?: RejectedExecutionHandler

  // worker thread and lock
  private workerThread: Array<{ thread: ThreadUnit<W>, lock: boolean }>

  // interval time unit is ms
  private interval: NodeJS.Timer

  // thread timeout handler
  private timeoutHandlers: Array<NodeJS.Timer> = []

  private startConsumer() {
    this.interval = setInterval(this.consumer, ThreadPoolExecutor.DEFAULT_INTERVAL)
  }

  constructor(options?: ThreadPoolOptions<W>) {
    super()
    // init default options
    this.corePoolSize = options?.corePoolSize || 5
    this.maximumPoolSize = options?.maximumPoolSize || 10
    this.keepAliveTime = options?.keepAliveTime || 30
    this.timeUnit = options?.timeUnit || TimeUnit.SECONDS
    this.workQueue = options?.workQueue || new ArrayQueue<ThreadPoolTask>(20)
    // @ts-ignore
    this.workerFactory = options?.workerFactory || new SimpleThreadUnitFactory()
    this.rejectedExecutionHandler = options?.rejectedExecutionHandler || new DefalutHandler()

    // init worker thread
    this.workerThread = new Array<{ thread: ThreadUnit<W>, lock: boolean }>(this.corePoolSize)
    this.initThread()
  }

  private initThread() {
    for (let i = 0; i < this.corePoolSize; i++) {
      this.workerThread[i] = { thread: this.workerFactory.getThread(), lock: false }
    }
  }

  private getIdleWorker(task: ThreadPoolTask): { thread: ThreadUnit<W>, lock: boolean } | undefined {
    // get idle worker
    let workerIndex = this.workerThread.findIndex(item => !item.lock);
    if (workerIndex == -1) {
      // no idle worker
      if (this.workerThread.length < this.maximumPoolSize) {
        // create new worker
        this.workerThread.push({ thread: this.workerFactory.getThread(), lock: false })
        // add timeout handler
        // const that = this
        this.timeoutHandlers.push(setTimeout(() => { this.delayDestroy() }, this.keepAliveTime * this.timeUnit))
      } else {
        // reject task
        return
      }
    }
    // reset timeout handler
    if (workerIndex >= this.corePoolSize) {
      const handlerIndex = workerIndex - this.corePoolSize
      clearTimeout(this.timeoutHandlers[handlerIndex])
      // const that = this
      this.timeoutHandlers.splice(handlerIndex, 1, setTimeout(() => { this.delayDestroy() }, this.keepAliveTime * this.timeUnit))
    }
    return this.workerThread[workerIndex]
  }

  public submit: (task: ThreadPoolTask) => void = (task) => {
    const validTask = isValidObjectWith(['func', 'success'])(task)
    if (!validTask) {
      console.error(argumentError({ expected: "a Object, and has Property ['func', 'success']", received: task }))
      return null
    }
    const validWork = isValid(task.func)('function')
    if (!validWork) {
      console.error(argumentError({ expected: 'a function', received: task.func }))
      return null
    }
    const validArgs = isValid(task.args)(['array', 'undefined'])
    if (!validArgs) {
      console.error(argumentError({ expected: 'an array', received: task.args }))
      return null
    }
    const validSuccess = isValid(task.success)('function')
    if (!validSuccess) {
      console.error(argumentError({ expected: 'a function', received: task.success }))
      return null
    }
    const validError = isValid(task.error)(['function', 'undefined'])
    if (!validError) {
      console.error(argumentError({ expected: 'a function', received: task.error }))
      return null
    }
    return this.run(task)
  }

  private run: (task: ThreadPoolTask, addQueue?: boolean) => boolean = (task, addQueue = true) => {
    // get idle thread
    const thread = this.getIdleWorker(task)
    // send task to worker
    if (thread) {
      try {
        const worker = thread.thread.worker
        function success(event: Event) {
          worker.removeEventListener('message', success)
          // close lock
          thread.lock = false
          // call back
          task.success(event)
        }
        function error(event: Event) {
          worker.removeEventListener('error', error)
          // close lock
          thread.lock = false
          console.error(`Error: Line ${error}`)
          // call back
          task.error && task.error(event)
        }
        worker.addEventListener('message', success)
        worker.addEventListener('error', error)
        worker.postMessage({ message: { task: `(${task.func.toString()})`, args: task.args } });
        // lock worker
        thread.lock = true
        return true
      } catch (error) {
        console.error(`this task ${task.func} error. thread running fails ${error}`)
      }
    }
    if (addQueue) {
      // no idle worker and no create worker
      // add queue
      const res = this.workQueue.add(task)
      if (!res) {
        // reject
        this.rejectedExecutionHandler.rejectedExecution(task, this, new TypeError('task queue is full'))
      }
      // queue is not empty
      // start consumer
      if (!this.interval) {
        this.startConsumer()
      }
    }
    return false
  }

  private consumer = () => {
    // single thread setInterval to consume task
    // Batch consumption tasks
    const tasks = this.workQueue.toArray()
    let removeNums = 0
    tasks.every(item => {
      const res = this.run(item, false)
      if (res) {
        removeNums++
      }
      return res
    })
    // remove consumed tasks
    for (let i = 0; i < removeNums; i++) {
      // remove task
      this.workQueue.poll()
    }
    if (this.workQueue.isEmpty()) {
      // queue is empty
      // stop consumer
      clearInterval(this.interval)
      this.interval = undefined
    }
  }

  private delayDestroy() {
    // find idle thread
    let workerIndex: number = -1
    for (let i = this.workerThread.length - 1; i >= this.corePoolSize; i--) {
      if (!this.workerThread[i].lock) {
        workerIndex = i
        break
      }
    }

    if (workerIndex > -1) {
      const thread = this.workerThread[workerIndex]
      // destroy thread
      this.workerFactory.destroy(thread.thread)
      this.workerThread.splice(workerIndex, 1)
      // remove timeout handler
      const handlerIndex = workerIndex - this.corePoolSize
      this.timeoutHandlers.splice(handlerIndex, 1)
    }
  }
}

class DefalutHandler<T> implements RejectedExecutionHandler {
  rejectedExecution: (task: ThreadPoolTask, poolExecutor: AbstractThreadPoolExecutor, error: TypeError) => void = (task, poolExecutor, error) => {
    console.error(error)
    task.error && task.error(error)
  }
}

export default ThreadPoolExecutor