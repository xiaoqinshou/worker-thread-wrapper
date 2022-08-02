export default abstract class ThreadBase {
    constructor() {}
    abstract run: <T>(task: Function, args?: any) => (delay?: number) => Promise<T>;
}