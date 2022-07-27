export class Deamon {

  private objectUri: string = undefined

  constructor() {
    // init DeamonWorker
  }

  private buildScript= () => `self.onconnect = function(e) {
    var port = e.ports[0];
    port.onmessage = function(e) {
      const delay = e.data[0]
      setTimeout(() => {
        port.postMessage('timeOver')
        port.close()
      }, delay)
    }
  }`

  private buildUri = (jsScriprt: string) => {
    const URL = window.URL || window.webkitURL
    const blob = new Blob([jsScriprt], { type: 'application/javascript' }) // eslint-disable-line
    this.objectUri = URL.createObjectURL(blob)
  }

  private create = () => {
    if (!this.objectUri) {
      this.buildUri(this.buildScript())
    }
  }

  public getDeamonWorker = () => {
    this.create()
    return new SharedWorker(this.objectUri)
  }
}

export const DeamonWorker = new Deamon()