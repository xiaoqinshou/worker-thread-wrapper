import { ArgumentType } from "./types";
import { DeamonWorker, Deamon } from "./DaemonWorker";
import { isValid, argumentError } from "./utils";
import { ThreadBase } from "./ThreadBase";

export class Thread extends ThreadBase {
  constructor(threadOptions?: { objectUri?: string, worker?: Worker, deamonWorker?: Deamon }) {
    super()
    this.objectUri = threadOptions?.objectUri;
    this.worker = threadOptions?.worker;
    this.deamonWorker = threadOptions?.deamonWorker || DeamonWorker
  }

  private deamonWorker: Deamon;

  private objectUri: string;

  private worker: Worker;

  private buildScript = (task: Function) => `
  self.onmessage = function(event) {
    const args = event.data.message.args
    if (args) {
      self.postMessage((${task}).apply(null, args))
      return close()
    }
    self.postMessage((${task})())
    return close()
  }`

  // private buildTimingScript = (task: Function, sharedUri: string, delay: number) => `
  // self.onmessage = function(event) {
  //   var sharedWorker = new SharedWorker('${sharedUri}');
  //   sharedWorker.port.onmessage = function(e) {
  //     console.log(e, 'Message received from DaemonWorker');
  //     self.postMessage(e.data + \`. this worker (${task}) is close\`)
  //     return close()
  //   }
  //   sharedWorker.port.postMessage([${delay}])
  //   const args = event.data.message.args
  //   if (args) {
  //     self.postMessage((${task}).apply(null, args))
  //     return close()
  //   }
  //   self.postMessage((${task})())
  //   return close()
  // }`// woker堆栈问题, onmessage一定会在该方法执行完之后执行, 没办法取到一个监听作用

  private buildUri = (jsScriprt: string) => {
    const URL = window.URL || window.webkitURL
    const blob = new Blob([jsScriprt], { type: 'application/javascript' }) // eslint-disable-line
    this.objectUri = URL.createObjectURL(blob)
  }

  private create = (func: Function, delay?: number) => {
    // objectUri is not exsit. init
    const that = this
    if (!that.objectUri) {
      let jsScriprtStr = this.buildScript(func)
      that.buildUri(jsScriprtStr)
    }
    // worker is not exsit. init
    if (!that.worker) {
      that.worker = new Worker(this.objectUri)
    }
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
    if (this.worker) {
      this.worker.terminate()
      this.worker = undefined
    }
    if (this.objectUri !== "testUri") {
      const URL = window.URL || window.webkitURL
      URL.revokeObjectURL(this.objectUri)
      this.objectUri = undefined
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
      return new Promise<T | string>((resolve, reject) => {
        !!deamonPromise && deamonPromise.catch(reject)
        that.worker.onmessage = (event) => {
          that.destroy()
          resolve(event.data)
        }
        that.worker.onerror = (error: ErrorEvent) => {
          console.error(`Error: Line ${error.lineno} in ${error.filename}: ${error.message}`)
          reject(error)
        }
        that.worker.postMessage({ message: { args } })
      })
    }
  }
}