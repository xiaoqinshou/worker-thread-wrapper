import { Thread as WorkerWrapper } from "../../../Thread";
import VirtualWorker from "../../VirtualWorker";

const sleep = (delay: Number) => {
  let start = (new Date()).getTime();
  //只要现在时间 - 开始时间 < 延迟时间，则继续睡眠
  while (new Date().getTime() - start < delay) {
    continue;
  }
}

const virtualWorker = new VirtualWorker()

const workerWrapper = () => new WorkerWrapper({
  objectUri: "testUri",
  worker: virtualWorker as any,
  deamonWorker: { getDeamonWorker: () => { return { port: { onmessage: undefined as any, postMessage: () => { } } } } } as any
});



describe('run - Correct use cases\n  Run:', () => {
  describe('Calls `WorkerWrapper.run` once when', () => {
    test('called without arrow function', async () => {
      const task = jest.fn(function () {
        return 'Run without args and without arrow function'
      })
      virtualWorker.setVirtualWorker(task)
      workerWrapper().run(task)()
      expect(task).toHaveBeenCalledTimes(1)
    })
    test('called with arrow function', async () => {
      const task = jest.fn(() => 'Run without args and with arrow function')
      virtualWorker.setVirtualWorker(task)
      workerWrapper().run(task)()
      expect(task).toHaveBeenCalledTimes(1)
    })
    test('expecting args as input', async () => {
      const task = jest.fn((arg1: any, arg2: any) => `Run ${arg1} and ${arg2}`)
      virtualWorker.setVirtualWorker(task)
      workerWrapper().run(task)()
      expect(task).toHaveBeenCalledTimes(1)
    })
    test('expecting a string as return', async () => {
      const task = jest.fn(() => `Returned string`)
      virtualWorker.setVirtualWorker(task)
      workerWrapper().run(task)()
      expect(task).toHaveBeenCalledTimes(1)
    })
    test('expecting a number as return', async () => {
      const task = jest.fn(() => 1 + 2)
      virtualWorker.setVirtualWorker(task)
      workerWrapper().run(task)()
      expect(task).toHaveBeenCalledTimes(1)
    })
    test('expecting an object as return', async () => {
      const task = jest.fn(() => { return { ret: 'Returned object' } })
      virtualWorker.setVirtualWorker(task)
      workerWrapper().run(task)()
      expect(task).toHaveBeenCalledTimes(1)
    })
    test('expecting an array as return', async () => {
      const task = jest.fn(() => ['Returned array'])
      virtualWorker.setVirtualWorker(task)
      workerWrapper().run(task)()
      expect(task).toHaveBeenCalledTimes(1)
    })
  })

  describe('Returns correctly when called', () => {
    describe('without args and', () => {
      test('without arrow function', () => {
        const expected = 'Run without args and without arrow function'
        const task = function () {
          return 'Run without args and without arrow function'
        }
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task)()
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('with arrow function', () => {
        const expected = 'Run without args and with arrow function'
        const task = () => 'Run without args and with arrow function'
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task)()
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('expecting args as input', () => {
        const expected = 'Run undefined and undefined'
        const task = (arg1: any, arg2: any) => `Run ${arg1} and ${arg2}`
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task)()
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('expecting a string as return', () => {
        const expected = 'Returned string'
        const task = () => 'Returned string'
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task)()
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('expecting a number as return', () => {
        const expected = 3
        const task = () => 1 + 2
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task)()
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('expecting an object as return', () => {
        const expected = { ret: 'Returned object' }
        const task = () => { return { ret: 'Returned object' } }
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task)()
        expect.assertions(1)
        return expect(actual).resolves.toStrictEqual(expected)
      })
      test('expecting an array as return', () => {
        const expected = ['Returned array']
        const task = () => ['Returned array']
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task)()
        expect.assertions(1)
        return expect(actual).resolves.toStrictEqual(expected)
      })
    })
    describe('with args and', () => {
      test('without arrow function', () => {
        const expected = 'Run with args and without arrow function'
        const task = function (arg1: any, arg2: any) {
          return `Run ${arg1} and ${arg2}`
        }
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task, ['with args', 'without arrow function'])()
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('with arrow function', () => {
        const expected = 'Run with args and with arrow function'
        const task = (arg1: any, arg2: any) => `Run ${arg1} and ${arg2}`
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task, ['with args', 'with arrow function'])()
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('have default arg value && args === undefined', () => {
        const expected = 'Run with default arg value'
        const task = (arg1 = 'default arg value') => `Run with ${arg1}`
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task, undefined)()
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('does not have default arg value && args === undefined', () => {
        const expected = 'Run with undefined'
        const task = (arg1: any) => `Run with ${arg1}`
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task, undefined)()
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('expecting a string as return', () => {
        const expected = 'Returned string'
        const task = (arg: any) => `Returned ${arg}`
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task, ['string'])()
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('expecting a number as return', () => {
        const expected = 3
        const task = (arg: any) => arg + 2
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task, [1])()
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('expecting an object as return', () => {
        const expected = { ret: 'object' }
        const task = (arg: any) => arg
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task, [{ ret: 'object' }])()
        expect.assertions(1)
        return expect(actual).resolves.toStrictEqual(expected)
      })
      test('expecting an array as return', () => {
        const expected = ['array']
        const task = (arg: any) => arg
        virtualWorker.setVirtualWorker(task)
        const actual = workerWrapper().run(task, [['array']])()
        expect.assertions(1)
        return expect(actual).resolves.toStrictEqual(expected)
      })
    })
  })

  describe('Calls `WorkerWrapper.run` once not delayed when', () => {
    describe('without args and', () => {
      test('called without arrow function', () => {
        const expected = 'Run without args and without arrow function'
        const task = function () {
          return 'Run without args and without arrow function'
        }
        virtualWorker.setVirtualWorker(task, 1000)
        const promise = workerWrapper().run(task)(1000)
        expect.assertions(1)
        return expect(promise).resolves.toBe(expected)
      })
      test('called with arrow function', () => {
        const expected = 'Run without args and with arrow function'
        const task = () => {
          return 'Run without args and with arrow function'
        }
        virtualWorker.setVirtualWorker(task, 1000)
        const promise = workerWrapper().run(task)(1000)
        expect.assertions(1)
        return expect(promise).resolves.toBe(expected)
      })
      test('expecting args as input', () => {
        const expected = 'Run apple and banana'
        const task = (arg1: any, arg2: any) => {
          return `Run ${arg1} and ${arg2}`
        }
        virtualWorker.setVirtualWorker(task, 1000)
        const promise = workerWrapper().run(task, ['apple', 'banana'])(1000)
        expect.assertions(1)
        return expect(promise).resolves.toBe(expected)
      })
      test('expecting a string as return', () => {
        const expected = 'Returned string'
        const task = () => {
          return 'Returned string'
        }
        virtualWorker.setVirtualWorker(task, 1000)
        const promise = workerWrapper().run(task)(1000)
        expect.assertions(1)
        return expect(promise).resolves.toBe(expected)
      })
      test('expecting a number as return', () => {
        const expected = 3
        const task = () => {
          return 1 + 2
        }
        virtualWorker.setVirtualWorker(task, 1000)
        const promise = workerWrapper().run(task)(1000)
        expect.assertions(1)
        return expect(promise).resolves.toBe(expected)
      })
      test('expecting an object as return', () => {
        const expected = { ret: 'Returned object' }
        const task = () => {
          return { ret: 'Returned object' }
        }
        virtualWorker.setVirtualWorker(task, 1000)
        const promise = workerWrapper().run(task)(1000)
        expect.assertions(1)
        return expect(promise).resolves.toStrictEqual(expected)
      })
      test('expecting an array as return', () => {
        const expected = ['Returned array']
        const task = () => {
          return ['Returned array']
        }
        virtualWorker.setVirtualWorker(task, 1000)
        const promise = workerWrapper().run(task)(1000)
        expect.assertions(1)
        return expect(promise).resolves.toStrictEqual(expected)
      })
    })

    describe('with args and', () => {
      test('without arrow function', () => {
        const expected = 'Run with args and without arrow function'
        const task = function (arg1: any, arg2: any) {
          return `Run ${arg1} and ${arg2}`
        }
        virtualWorker.setVirtualWorker(task, 1000)
        const actual = workerWrapper().run(task, ['with args', 'without arrow function'])(1000)
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('with arrow function', () => {
        const expected = 'Run with args and with arrow function'
        const task = (arg1: any, arg2: any) => `Run ${arg1} and ${arg2}`
        virtualWorker.setVirtualWorker(task, 1000)
        const actual = workerWrapper().run(task, ['with args', 'with arrow function'])(1000)
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('have default arg value && args === undefined', () => {
        const expected = 'Run with default arg value'
        const task = (arg1: any = 'default arg value') => `Run with ${arg1}`
        virtualWorker.setVirtualWorker(task, 1000)
        const actual = workerWrapper().run(task, undefined)(1000)
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('does not have default arg value && args === undefined', () => {
        const expected = 'Run with undefined'
        const task = (arg1: any) => `Run with ${arg1}`
        virtualWorker.setVirtualWorker(task, 1000)
        const actual = workerWrapper().run(task, undefined)(1000)
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('expecting a string as return', () => {
        const expected = 'Returned string'
        const task = (arg: any) => `Returned ${arg}`
        virtualWorker.setVirtualWorker(task, 1000)
        const actual = workerWrapper().run(task, ['string'])(1000)
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('expecting a number as return', () => {
        const expected = 3
        const task = (arg: any) => arg + 2
        virtualWorker.setVirtualWorker(task, 1000)
        const actual = workerWrapper().run(task, [1])(1000)
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('expecting an object as return', () => {
        const expected = { ret: 'object' }
        const task = (arg: any) => arg
        virtualWorker.setVirtualWorker(task, 1000)
        const actual = workerWrapper().run(task, [{ ret: 'object' }])(1000)
        expect.assertions(1)
        return expect(actual).resolves.toStrictEqual(expected)
      })
      test('expecting an array as return', () => {
        const expected = ['array']
        const task = (arg: any) => arg
        virtualWorker.setVirtualWorker(task, 1000)
        const actual = workerWrapper().run(task, [['array']])(1000)
        expect.assertions(1)
        return expect(actual).resolves.toStrictEqual(expected)
      })
    })
  })

  describe('Calls `WorkerWrapper.run` once delayed when', () => {
    describe('without args and', () => {
      test('called without arrow function', () => {
        const expected = 'time over'
        const task = function () {
          sleep(10)
          return 'Run without args and without arrow function'
        }
        virtualWorker.setVirtualWorker(task, 10)
        const promise = workerWrapper().run(task)(10)
        expect.assertions(1)
        return expect(promise).resolves.toBe(expected)
      })
      test('called with arrow function', () => {
        const expected = 'time over'
        const task = () => {
          sleep(10)
          return 'Run without args and with arrow function'
        }
        virtualWorker.setVirtualWorker(task, 10)
        const promise = workerWrapper().run(task)(10)
        expect.assertions(1)
        return expect(promise).resolves.toBe(expected)
      })
      test('expecting args as input', () => {
        const expected = 'time over'
        const task = (arg1: any, arg2: any) => {
          sleep(10)
          return `Run ${arg1} and ${arg2}`
        }
        virtualWorker.setVirtualWorker(task, 10)
        const promise = workerWrapper().run(task, ['apple', 'banana'])(10)
        expect.assertions(1)
        return expect(promise).resolves.toBe(expected)
      })
      test('expecting a string as return', () => {
        const expected = 'time over'
        const task = () => {
          sleep(10)
          return 'Returned string'
        }
        virtualWorker.setVirtualWorker(task, 10)
        const promise = workerWrapper().run(task)(10)
        expect.assertions(1)
        return expect(promise).resolves.toBe(expected)
      })
      test('expecting a number as return', () => {
        const expected = 'time over'
        const task = () => {
          sleep(10)
          return 1 + 2
        }
        virtualWorker.setVirtualWorker(task, 10)
        const promise = workerWrapper().run(task)(10)
        expect.assertions(1)
        return expect(promise).resolves.toBe(expected)
      })
      test('expecting an object as return', () => {
        const expected = 'time over'
        const task = () => {
          sleep(10)
          return { ret: 'Returned object' }
        }
        virtualWorker.setVirtualWorker(task, 10)
        const promise = workerWrapper().run(task)(10)
        expect.assertions(1)
        return expect(promise).resolves.toBe(expected)
      })
      test('expecting an array as return', () => {
        const expected = 'time over'
        const task = () => {
          sleep(10)
          return ['Returned array']
        }
        virtualWorker.setVirtualWorker(task, 10)
        const promise = workerWrapper().run(task)(10)
        expect.assertions(1)
        return expect(promise).resolves.toBe(expected)
      })
    })

    describe('with args and', () => {
      test('without arrow function', () => {
        const expected = 'time over'
        const task = function (arg1: any, arg2: any) {
          sleep(10)
          return `Run ${arg1} and ${arg2}`
        }
        virtualWorker.setVirtualWorker(task, 10)
        const actual = workerWrapper().run(task, ['with args', 'without arrow function'])(10)
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('with arrow function', () => {
        const expected = 'time over'
        const task = (arg1: any, arg2: any) => {
          sleep(10)
          return `Run ${arg1} and ${arg2}`
        }
        virtualWorker.setVirtualWorker(task, 10)
        const actual = workerWrapper().run(task, ['with args', 'with arrow function'])(10)
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('have default arg value && args === undefined', () => {
        const expected = 'time over'
        const task = (arg1: any = 'default arg value') => {
          sleep(10)
          return `Run with ${arg1}`
        }
        virtualWorker.setVirtualWorker(task, 10)
        const actual = workerWrapper().run(task, undefined)(10)
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('does not have default arg value && args === undefined', () => {
        const expected = 'time over'
        const task = (arg1: any) => {
          sleep(10)
          return `Run with ${arg1}`
        }
        virtualWorker.setVirtualWorker(task, 10)
        const actual = workerWrapper().run(task, undefined)(10)
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('expecting a string as return', () => {
        const expected = 'time over'
        const task = (arg: any) => {
          sleep(10)
          return `Returned ${arg}`
        }
        virtualWorker.setVirtualWorker(task, 10)
        const actual = workerWrapper().run(task, ['string'])(10)
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('expecting a number as return', () => {
        const expected = 'time over'
        const task = (arg: any) => {
          sleep(10)
          return arg + 2
        }
        virtualWorker.setVirtualWorker(task, 10)
        const actual = workerWrapper().run(task, [1])(10)
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('expecting an object as return', () => {
        const expected = 'time over'
        const task = (arg: any) => {
          sleep(10)
          return arg
        }
        virtualWorker.setVirtualWorker(task, 10)
        const actual = workerWrapper().run(task, [{ ret: 'object' }])(10)
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
      test('expecting an array as return', () => {
        const expected = 'time over'
        const task = (arg: any) => {
          sleep(10)
          return arg
        }
        virtualWorker.setVirtualWorker(task, 10)
        const actual = workerWrapper().run(task, [['array']])(10)
        expect.assertions(1)
        return expect(actual).resolves.toBe(expected)
      })
    })
  })
})