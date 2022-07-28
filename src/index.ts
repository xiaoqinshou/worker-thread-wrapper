import { Thread } from "./Thread"
import { ThreadBase } from "./ThreadBase"
import { ThreadConstructor } from "./types"
class WorkerBuilder {
  private thread: ThreadConstructor;
  
  constructor() {
    this.thread = ThreadBase
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


// const WorkerBuilder = () => {
//   let thread: any = class{
//     constructor(){}
//     public run = () => {console.error('This browser does not have the conditions for execution')}
//   }
  
//   if (!window.Worker) {
//     console.error('This browser does not support Workers.')
//   }else if (!window.SharedWorker) {
//     console.error('This browser does not support SharedWorker.')
//   }else if (!(window.URL.createObjectURL || window.webkitURL.createObjectURL)) {
//     console.error('This browser does not have URL.createObjectURL method.')
//   }else{
//     thread = Thread
//   }
//   return thread
// }

// const Test = WorkerBuilder()

// export default WorkerBuilder