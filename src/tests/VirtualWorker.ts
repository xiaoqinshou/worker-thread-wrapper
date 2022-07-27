export default class VirtualWorker {
  private worker: VirtualWorker;
  private task: Function = undefined;
  private delay: number = 100000;
  constructor(task?: Function, delay?: number) {
    this.task = task
    if(!!delay&&delay>0){
      this.delay = delay
    }
  }

  setVirtualWorker(task?: Function, delay?: number) {
    this.worker = new VirtualWorker(task, delay);
  }

  postMessage(obj: any) {
    this.worker.onmessage({ data: obj }, this)
  }

  onmessage = (obj: { data: any }, pointer?: VirtualWorker) => {
    const args = obj.data.message.args
    let timeOver = new Date().getTime() + this.delay
    if (!!pointer) {
      try {
        const res = this.task.apply(null, args)
        // simulation delay return
        if(new Date().getTime() < timeOver) {
          pointer.onmessage({ data: res })
        }else{
          pointer.onmessage({ data: "time over" })
        }
      } catch (error) {
        pointer.onerror(error)
      }
    }
  }

  onerror = (err: any) => { console.error(err, "onerror") }

  terminate = () => { }
}