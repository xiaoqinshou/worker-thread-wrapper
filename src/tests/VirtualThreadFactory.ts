import { ThreadFactory, ThreadUnit } from "@/types";
import VirtualWorker from "./VirtualWorker";

export default class VirtualThreadFactory implements ThreadFactory<VirtualWorker>{
  constructor(delay?: number) {
    this.delay = delay
  }
  private delay: number
  getThread: (task?: Function) => ThreadUnit<VirtualWorker> = (task?: Function) => {
    const worker = new VirtualWorker()
    worker.setVirtualWorker(task, this.delay)
    return {
      worker,
      uri: "test"
    }
  }
  destroy: (thread: ThreadUnit<VirtualWorker>) => void = (thread: ThreadUnit<VirtualWorker>) => {
  }
}