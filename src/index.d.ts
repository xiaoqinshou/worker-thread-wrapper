
// a simple wrapper for Worker, faster than using Worker directly
// using WorkerWrapper to running one-time task 
declare interface WorkerWrapper {
  // run worker task
  run: <T>(task: Function, args?: any) => (delay?: number) => Promise<T | string> | null;
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

declare type BaseObject = Object | String | Number | Boolean | Function;

declare type ArgumentType = Array<BaseObject>

declare type JavaScriptBaseType = 'object' | 'undefined' | 'string' | 'number' | 'boolean' | 'function' | 'null';

declare type ExtensionType = 'array' | 'action';

declare type ExtensionArrayType = 'actionsArray' | 'arraysArray' | 'objectsArray' | 'postParamsArray' | 'stringsArray';

declare type InferredType = JavaScriptBaseType | ExtensionType | ExtensionArrayType

declare type ExecptionMessage = {
  expected: String;
  received: ArgumentType | Function;
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
  WorkerWrapper,
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