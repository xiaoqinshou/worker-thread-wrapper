import { ArgumentType, ThreadFactory, ThreadUnit } from "./types";
import { DeamonWorker, Deamon } from "./DaemonWorker";
import { isValid, argumentError } from "./util/utils";
import AbstractThread from "./AbstractThread";
import SimpleThreadFactory from "./SimpleThreadFactory";

export class Thread extends AbstractThread {
  constructor(threadFactory?: ThreadFactory<Worker>, deamonWorker?: Deamon) {
    super()
    this.deamonWorker = deamonWorker || DeamonWorker
    this.threadFactory = threadFactory || new SimpleThreadFactory()
  }

  private deamonWorker: Deamon;

  private threadFactory: ThreadFactory<Worker>;

  private thread: ThreadUnit<Worker>;

  private create = (func: Function) => {
    this.thread = this.threadFactory.getThread(func)
  }

  private createDeamonWorker: (delay?: number) => Promise<string> | undefined = (delay) => {
    // deamonWorker is not exsit. init
    const that = this
    if (!!delay && delay > 0) {
      const deammonTiming = that.deamonWorker.getDeamonWorker()
      return new Promise<string>((resolve, reject) => {
        deammonTiming.port.onmessage = (e) => {
          that.destroy()
          reject(`${e.data}. this worker is closed`)
        }
        deammonTiming.port.postMessage([delay])
      })
    }
    return undefined
  }


  private destroy = () => {
    if (this.thread) {
      this.threadFactory.destroy(this.thread)
      this.thread = undefined
    }
  }

  public run = <T>(task: Function, args?: ArgumentType) => {
    const validWork = isValid(task)('function')
    const validArgs = isValid(args)(['array', 'undefined'])
    if (!validWork) {
      console.error(argumentError({ expected: 'a function', received: task }))
      return null
    }
    if (!validArgs) {
      console.error(argumentError({ expected: 'an array', received: args }))
      return null
    }

    const that = this
    this.create(task)
    return (delay?: number) => {
      const deamonPromise = this.createDeamonWorker(delay);
      return new Promise<T>((resolve, reject) => {
        !!deamonPromise && deamonPromise.catch(reject)
        that.thread.worker.onmessage = (event) => {
          that.destroy()
          resolve(event.data)
        }
        that.thread.worker.onerror = (error: ErrorEvent) => {
          console.error(`Error: Line ${error.lineno} in ${error.filename}: ${error.message}`)
          reject(error)
        }
        that.thread.worker.postMessage({ message: { args } })
      })
    }
  }
}