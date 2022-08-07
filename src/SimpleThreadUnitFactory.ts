import AbstractThreadFactory from "./AbstractThreadFactory";
import { ThreadUnit } from "./types";

export default class SimpleThreadUnitFactory extends AbstractThreadFactory<Worker>{
  constructor() {
    super();
  }
  private buildScript: (task: Function) => string = (task: Function) => `
  self.onmessage = function(event) {
    var args = event.data.message.args
    var task = event.data.message.task
    if (args) {
      self.postMessage(eval(task).apply(null, args))
    }else{
      self.postMessage(eval(task)())
    }
  }`
  getThread: (task?: Function) => ThreadUnit<Worker> = (task?: Function) => {
    const uri = this.buildUri(this.buildScript(task))
    const worker = new Worker(uri)
    return {
      worker,
      uri
    }
  }
  destroy: (thread: ThreadUnit<Worker>) => void = ({ worker, uri }: ThreadUnit<Worker>) => {
    if (worker) {
      worker.terminate()
    }
    if (uri) {
      const URL = window.URL || window.webkitURL
      URL.revokeObjectURL(uri)
    }
  }
}