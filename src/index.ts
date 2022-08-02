import { Thread } from "./Thread"
import { ThreadConstructor } from "./types"
class WorkerBuilder {
  private thread: ThreadConstructor;
  
  constructor() {
    if (!window.Worker) {
      console.error('This browser does not support Workers.')
      return
    }
    if (!window.SharedWorker) {
      console.error('This browser does not support SharedWorker.')
      return
    }
    if (!(window.URL.createObjectURL || window.webkitURL.createObjectURL)) {
      console.error('This browser does not have URL.createObjectURL method.')
      return
    }
    this.thread = Thread
  }
  public build = () => this.thread
}

export default WorkerBuilder