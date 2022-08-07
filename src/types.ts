import AbstractThread from "./AbstractThread";
import AbstractThreadPoolExecutor from "./AbstractThreadPoolExecutor";
import { Queue } from "./util/types";

declare type ThreadPoolTask = {
  func: Function,
  args: ArgumentType,
  success: (event: Event) => void,
  error: (event: Event | TypeError) => void,
  // delay?: number,
}

declare type ThreadUnit<W extends AbstractWorker> = {
  worker: W,
  uri: string,
}

declare interface ThreadFactory<W extends AbstractWorker> {
  getThread: (task?: Function) => ThreadUnit<W>
  destroy: (thread: ThreadUnit<W>) => void
}

declare type ThreadPoolOptions<W extends AbstractWorker> = {
  corePoolSize: number;
  maximumPoolSize: number;
  keepAliveTime: number;
  timeUnit: TimeUnit;
  workQueue: Queue<ThreadPoolTask>;
  workerFactory?: ThreadFactory<W>;
  rejectedExecutionHandler?: RejectedExecutionHandler;
}

declare interface RejectedExecutionHandler {
  rejectedExecution: (task: ThreadPoolTask, poolExecutor: AbstractThreadPoolExecutor, error: TypeError) => void;
}

enum TimeUnit {
  MILLISECONDS = 1,
  SECONDS = 1000 * MILLISECONDS,
  MINUTES = 60 * SECONDS,
  HOURS = 60 * MINUTES,
  DAYS = 24 * HOURS
}

declare interface ThreadPoolExecutorConstructor {
  readonly prototype: AbstractThreadPoolExecutor;
  new(): AbstractThreadPoolExecutor;
}


declare interface ThreadConstructor {
  readonly prototype: AbstractThread;
  new(): AbstractThread;
}

// register task Base
declare interface CollectionWorkerBase {
  register: (tasks: { name: string, task: Function }[]) => boolean;
  unregister: (taskName: string | string[]) => boolean;
}

// independent serial tasks worker
// TODO let me think about this
declare interface WorkerTasksWrapperInterface extends CollectionWorkerBase {
  run<T>(task: { name: string, dealy?: number } | { name: string, dealy?: number }[]): Promise<T>;
}

declare interface WorkerPoolInterface extends CollectionWorkerBase {
  submit<T>(task: string | string[] | Function, dealy?: number): Promise<T>;
  // TODO 暂时没想好
  execption: () => void;
}

declare type BaseObject = Object | Array<BaseObject> | String | Number | Boolean;

declare type ArgumentType = Array<BaseObject>

declare type JavaScriptBaseType = 'object' | 'undefined' | 'string' | 'number' | 'boolean' | 'function' | 'null';

declare type ExtensionType = 'array' | 'action';

declare type ExtensionArrayType = 'actionsArray' | 'arraysArray' | 'objectsArray' | 'postParamsArray' | 'stringsArray';

declare type InferredType = JavaScriptBaseType | ExtensionType | ExtensionArrayType

declare type ExecptionMessage = {
  expected: String;
  received: ArgumentType | Function | Object;
  extraInfo?: String
}

declare type TestArrayType = {
  [key in ExtensionArrayType]: (arr: any[]) => boolean;
}

declare type FuncMessage = { message: String }

declare type CollectionFuncObj = FuncMessage & {
  func: Function;
}

declare type PostParams = FuncMessage & {
  args: Array<any>;
}

export {
  ThreadPoolExecutorConstructor,
  RejectedExecutionHandler,
  ThreadPoolTask,
  ThreadUnit,
  ThreadFactory,
  TimeUnit,
  ThreadPoolOptions,
  ThreadConstructor,
  WorkerTasksWrapperInterface,
  WorkerPoolInterface,
  BaseObject,
  ArgumentType,
  JavaScriptBaseType,
  ExtensionType,
  ExtensionArrayType,
  InferredType,
  ExecptionMessage,
  TestArrayType,
  FuncMessage,
  CollectionFuncObj,
  PostParams
}