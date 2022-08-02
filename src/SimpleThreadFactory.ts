import AbstractThreadFactory from "./AbstractThreadFactory";
import { ThreadUnit } from "./types";

export default class SimpleThreadFactory extends AbstractThreadFactory<Worker> {
  constructor() {
    super()
   }
  private buildScript: (task: Function) => string = (task: Function) => `
  self.onmessage = function(event) {
    var args = event.data.message.args
    if (args) {
      self.postMessage((${task}).apply(null, args))
      return close()
    }
    self.postMessage((${task})())
    return close()
  }`
  getThread: (task: Function) => ThreadUnit<Worker> = (task: Function) => {
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