import { ThreadPoolOptions, ThreadPoolTask } from "./types";

export default abstract class AbstractThreadPoolExecutor<T> {
  constructor(options?: ThreadPoolOptions<void, AbstractWorker>) { }
  abstract submit: (task: ThreadPoolTask<T>) => void;
}