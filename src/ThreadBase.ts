export class ThreadBase {
    constructor() {}
    run: <T>(task: Function, args?: any) => (delay?: number) => (Promise<T | string> | undefined)
    = () => () => {
      console.error('This browser does not have the conditions for execution')
      return undefined
    };
}