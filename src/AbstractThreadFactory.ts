import { ThreadFactory, ThreadUnit } from "./types";

/**
 * this class is abstract
 */
export default abstract class AbstractThreadFactory<W extends AbstractWorker> implements ThreadFactory<W>{
  abstract getThread: (task?: Function) => ThreadUnit<W>;
  abstract destroy: (thread: ThreadUnit<W>) => void;
  protected buildUri: (jsScriprt: string) => string = (jsScriprt: string) => {
    const URL = window.URL || window.webkitURL
    const blob = new Blob([jsScriprt], { type: 'application/javascript' }) // eslint-disable-line
    return URL.createObjectURL(blob)
  }
}