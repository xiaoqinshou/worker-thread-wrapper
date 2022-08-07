import { Thread } from "./Thread"
import ThreadPoolExecutor from "./ThreadPoolExecutor";
import { ThreadConstructor, ThreadPoolExecutorConstructor } from "./types"
class WorkerBuilder {
  private thread: ThreadConstructor;
  private threadPoolExecutor: ThreadPoolExecutorConstructor;
  
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
    this.threadPoolExecutor = ThreadPoolExecutor
  }
  public build = () => this.thread

  public buildPoolExecutor = () => this.threadPoolExecutor
}

export default WorkerBuilder