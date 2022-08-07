import { ThreadPoolOptions, ThreadPoolTask } from "./types";

export default abstract class AbstractThreadPoolExecutor {
  constructor(options?: ThreadPoolOptions<AbstractWorker>) { }
  abstract submit: (task: ThreadPoolTask) => void;
}