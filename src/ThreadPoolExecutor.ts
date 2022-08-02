import SimpleThreadUnitFactory from "./SimpleThreadUnitFactory";
import AbstractThreadPoolExecutor from "./AbstractThreadPoolExecutor";
import { ArgumentType, ThreadFactory, ThreadPoolOptions, ThreadPoolTask, ThreadUnit, TimeUnit } from "./types";
import ArrayQueue from "./util/ArrayQueue";
import { Queue } from "./util/types";

export default class ThreadPoolExecutor<T, W extends AbstractWorker & { postMessage: Function }> extends AbstractThreadPoolExecutor<T> {

  // defalut options 
  private corePoolSize: number
  private maximumPoolSize: number
  private keepAliveTime: number
  private timeUnit: TimeUnit
  private workQueue: Queue<ThreadPoolTask<T>>
  private workerFactory?: ThreadFactory<W>
  private rejectedExecutionHandler?: any

  // worker task runner lock
  private taskLock: Array<boolean> = new Array<boolean>()

  // worker thread
  private workerThread: Array<ThreadUnit<W>>

  constructor(options?: ThreadPoolOptions<T, W>) {
    super()
    // init default options
    this.corePoolSize = options.corePoolSize || 5
    this.maximumPoolSize = options.maximumPoolSize || 10
    this.keepAliveTime = options.keepAliveTime || 30
    this.timeUnit = options.timeUnit || TimeUnit.SECONDS
    this.workQueue = options.workQueue || new ArrayQueue<ThreadPoolTask<T>>(20)
    // @ts-ignore
    this.workerFactory = options.workerFactory || new SimpleThreadUnitFactory()
    this.rejectedExecutionHandler = options.rejectedExecutionHandler || ((task: T, pool: AbstractThreadPoolExecutor<T>, error: TypeError) => { console.error(error) })

    // init worker thread
    this.workerThread = new Array<ThreadUnit<W>>(this.corePoolSize)
    this.taskLock = new Array<boolean>(this.corePoolSize).fill(false)
  }

  private initThread() {
    for (let i = 0; i < this.corePoolSize; i++) {
      this.workerThread[i] = this.workerFactory.getThread()
      // this.workerThread[i].worker.addEventListener('message', (event) => {
      //   // close lock
      //   this.taskLock[i] = false
      // })
    }
  }

  submit: (task: ThreadPoolTask<T>) => void = (task) => {
    // get idle worker
    let workerIndex = this.taskLock.findIndex(item => !item);
    if (workerIndex == -1) {
      // no idle worker
      if (this.taskLock.length < this.maximumPoolSize) {
        // create new worker
        const newWorker = this.workerFactory.getThread()
        this.workerThread.push(newWorker)
        this.taskLock.push(false)
        workerIndex = this.taskLock.length - 1
      } else {
        // no idle worker and no create worker
        // add queue
        const res = this.workQueue.add(task)
        if (!res) {
          // reject
          this.rejectedExecutionHandler(task, this, new TypeError('task queue is full'))
        }
        return
      }
    }
    // has idle worker
    // send task to worker
    const worker = this.workerThread[workerIndex].worker
    worker.postMessage({ message: { task: task.func, args: task.args } });
    worker.addEventListener('message', this.messageListener(task.callback))
    // lock worker
    this.taskLock[workerIndex] = true
  }

  private messageListener: (callback: Function) => (event: Event) => void = (callback) => (event) => {
    callback(event)
  }
}