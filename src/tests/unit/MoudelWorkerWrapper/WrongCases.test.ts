
import { Thread as WorkerWrapper } from "../../../Thread";
import VirtualWorker from "../../VirtualWorker";

const virtualWorker = new VirtualWorker()

const workerWrapper = () => new WorkerWrapper({
  objectUri: "testUri",
  worker: virtualWorker as any
});

describe('run - Wrong use cases\n  Run:', () => {
  describe('Logs an error when', () => {
    describe('work is', () => {
      test('a string', async () => {
        const error = new TypeError(`You should provide a function\n\nReceived: "Run with string"`)
        const spy = console.error = jest.fn()
        workerWrapper().run('Run with string' as any)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('an object', async () => {
        const error = new TypeError(`You should provide a function\n\nReceived: {"work":"Run with object"}`)
        const spy = console.error = jest.fn()
        workerWrapper().run({ work: 'Run with object' } as any)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('undefined', async () => {
        const error = new TypeError(`You should provide a function\n\nReceived: undefined`)
        const spy = console.error = jest.fn()
        workerWrapper().run(undefined)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('null', async () => {
        const error = new TypeError(`You should provide a function\n\nReceived: null`)
        const spy = console.error = jest.fn()
        workerWrapper().run(null)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
    })

    describe('args is', () => {
      test('a string', async () => {
        const error = new TypeError(`You should provide an array\n\nReceived: "undefined"`)
        const spy = console.error = jest.fn()
        workerWrapper().run((arg1: any) => `Run with ${arg1}`, 'undefined' as any)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('an object', async () => {
        const error = new TypeError(`You should provide an array\n\nReceived: {"arg1":"undefined"}`)
        const spy = console.error = jest.fn()
        workerWrapper().run((arg1: any) => `Run with ${arg1}`, { arg1: 'undefined' } as any)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('null', async () => {
        const error = new TypeError(`You should provide an array\n\nReceived: null`)
        const spy = console.error = jest.fn()
        workerWrapper().run((arg1: any) => `Run with ${arg1}`, null)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
    })
  })

  describe('Returns null when', () => {
    describe('work is', () => {
      test('a string', async () => expect(workerWrapper().run('Run with string' as any)).toBeNull())

      test('an object', async () => expect(workerWrapper().run({ work: 'Run with object' } as any)).toBeNull())

      test('undefined', async () => expect(workerWrapper().run(undefined)).toBeNull())

      test('null', async () => expect(workerWrapper().run(null)).toBeNull())
    })

    describe('args is', () => {
      test('a string', async () => expect(workerWrapper().run((arg1: any) => `Run with ${arg1}`, 'undefined' as any)).toBeNull())

      test('an object', async () => expect(workerWrapper().run((arg1: any) => `Run with ${arg1}`, { arg1: 'undefined' } as any)).toBeNull())

      test('null', async () => expect(workerWrapper().run((arg1: any) => `Run with ${arg1}`, null)).toBeNull())
    })
  })

  describe('Doesn\'t calls `start other thread` when', () => {
    describe('work is', () => {
      test('a string', async () => expect(jest.fn(workerWrapper().run("a string" as any))).not.toHaveBeenCalled())

      test('an object', async () => expect(jest.fn(workerWrapper().run({ test: "1" } as any))).not.toHaveBeenCalled())

      test('undefined', async () => expect(jest.fn(workerWrapper().run(undefined))).not.toHaveBeenCalled())

      test('null', async () => expect(jest.fn(workerWrapper().run(null))).not.toHaveBeenCalled())
    })

    describe('args is', () => {
      test('a string', async () => expect(jest.fn(workerWrapper().run((args: any) => args, "a string" as any))).not.toHaveBeenCalled())

      test('an object', async () => expect(jest.fn(workerWrapper().run((args: any) => args, { a: "b" } as any))).not.toHaveBeenCalled())

      test('null', async () => expect(jest.fn(workerWrapper().run((args: any) => args, null))).not.toHaveBeenCalled())
    })
  })
})