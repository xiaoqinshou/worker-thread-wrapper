import ThreadPoolExecutor from '../../../ThreadPoolExecutor'
import SimpleThreadUnitFactory from '../../../SimpleThreadUnitFactory'
const factory = new SimpleThreadUnitFactory()
factory.getThread = jest.fn(response => {
  return{
    worker: {} as Worker,
    uri: "test"
  }
})
const pool = new ThreadPoolExecutor<Worker>({workerFactory: factory} as any)

describe('run - Wrong use cases\n  Run:', () => {
  describe('Logs an error when', () => {
    describe('work is', () => {
      test('a string', async () => {
        const error = new TypeError(`You should provide a Object, and has Property ['func', 'success']\n\nReceived: "Run with string"`)
        const spy = console.error = jest.fn()
        pool.submit('Run with string' as any)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('an object', async () => {
        const error = new TypeError(`You should provide a Object, and has Property ['func', 'success']\n\nReceived: {"work":"Run with object"}`)
        const spy = console.error = jest.fn()
        pool.submit({ work: 'Run with object' } as any)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('undefined', async () => {
        const error = new TypeError(`You should provide a Object, and has Property ['func', 'success']\n\nReceived: undefined`)
        const spy = console.error = jest.fn()
        pool.submit(undefined)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('null', async () => {
        const error = new TypeError(`You should provide a Object, and has Property ['func', 'success']\n\nReceived: null`)
        const spy = console.error = jest.fn()
        pool.submit(null)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
    })

    describe('object incomplete', () => {
      test('func', async () => {
        const error = new TypeError(`You should provide a Object, and has Property ['func', 'success']\n\nReceived: {"args":"undefined"}`)
        const spy = console.error = jest.fn()
        pool.submit({
          args: 'undefined' as any,
          success: function (event: Event): void {
            throw new Error('Function not implemented.')
          },
          error: function (event: Event): void {
            throw new Error('Function not implemented.')
          }
        } as any)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      // test('args', async () => {
      //   const error = new TypeError(`You should provide a Object, and has Property ['func', 'success']\n\nReceived: {}`)
      //   const spy = console.error = jest.fn()
      //   pool.submit({
      //     func: (arg1: any) => `Run with ${arg1}`,
      //     success: function (event: Event): void {
      //       throw new Error('Function not implemented.')
      //     },
      //     error: function (event: Event): void {
      //       throw new Error('Function not implemented.')
      //     }
      //   } as any)
      //   expect(spy).toHaveBeenCalledWith(error)
      //   expect(spy).toHaveBeenCalledTimes(1)
      //   return spy.mockRestore()
      // })
      test('success', async () => {
        const error = new TypeError(`You should provide a Object, and has Property ['func', 'success']\n\nReceived: {"args":[]}`)
        const spy = console.error = jest.fn()
        pool.submit({
          func: (arg1: any) => `Run with ${arg1}`, args: [],
          error: function (event: Event): void {
            throw new Error('Function not implemented.')
          }
        } as any)
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      // test('error', async () => {
      //   const error = new TypeError(`You should provide a Object, and has Property ['func', 'success']\n\nReceived: {"args":[]}`)
      //   const spy = console.error = jest.fn()
      //   pool.submit({
      //     func: (arg1: any) => `Run with ${arg1}`, args: [],
      //     success: function (event: Event): void {
      //       throw new Error('Function not implemented.')
      //     }
      //   } as any)
      //   expect(spy).toHaveBeenCalledWith(error)
      //   expect(spy).toHaveBeenCalledTimes(1)
      //   return spy.mockRestore()
      // })
    })

    describe('func is', () => {
      test('a string', async () => {
        const error = new TypeError(`You should provide a function\n\nReceived: "a string"`)
        const spy = console.error = jest.fn()
        pool.submit({
          func: 'a string' as any,
          args: [],
          success: function (event: Event): void {
            throw new Error('Function not implemented.')
          },
          error: function (event: Event | TypeError): void {
            throw new Error('Function not implemented.')
          }
        })
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('an object', async () => {
        const error = new TypeError(`You should provide a function\n\nReceived: {"arg1":"undefined"}`)
        const spy = console.error = jest.fn()
        pool.submit({
          success: (arg1: any) => `Run with ${arg1}`,
          args: [],
          func: { arg1: 'undefined' } as any,
          error: function (event: Event | TypeError): void {
            throw new Error('Function not implemented.')
          }
        })
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('null', async () => {
        const error = new TypeError(`You should provide a function\n\nReceived: null`)
        const spy = console.error = jest.fn()
        pool.submit({
          success: (arg1: any) => `Run with ${arg1}`,
          args: [],
          func: null,
          error: function (event: Event | TypeError): void {
            throw new Error('Function not implemented.')
          }
        })
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
    })

    describe('args is', () => {
      test('a string', async () => {
        const error = new TypeError(`You should provide an array\n\nReceived: "undefined"`)
        const spy = console.error = jest.fn()
        pool.submit({
          func: (arg1: any) => `Run with ${arg1}`, args: 'undefined' as any,
          success: function (event: Event): void {
            throw new Error('Function not implemented.')
          },
          error: function (event: Event | TypeError): void {
            throw new Error('Function not implemented.')
          }
        })
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('an object', async () => {
        const error = new TypeError(`You should provide an array\n\nReceived: {"arg1":"undefined"}`)
        const spy = console.error = jest.fn()
        pool.submit({
          func: (arg1: any) => `Run with ${arg1}`, args: { arg1: 'undefined' } as any,
          success: function (event: Event): void {
            throw new Error('Function not implemented.')
          },
          error: function (event: Event | TypeError): void {
            throw new Error('Function not implemented.')
          }
        })
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('null', async () => {
        const error = new TypeError(`You should provide an array\n\nReceived: null`)
        const spy = console.error = jest.fn()
        pool.submit({
          func: (arg1: any) => `Run with ${arg1}`, args: null,
          success: function (event: Event): void {
            throw new Error('Function not implemented.')
          },
          error: function (event: Event | TypeError): void {
            throw new Error('Function not implemented.')
          }
        })
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
    })

    describe('success is', () => {
      test('a string', async () => {
        const error = new TypeError(`You should provide a function\n\nReceived: "a string"`)
        const spy = console.error = jest.fn()
        pool.submit({
          func: (arg1: any) => `Run with ${arg1}`,
          args: [],
          success: 'a string' as any,
          error: function (event: Event | TypeError): void {
            throw new Error('Function not implemented.')
          }
        })
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('an object', async () => {
        const error = new TypeError(`You should provide a function\n\nReceived: {"arg1":"undefined"}`)
        const spy = console.error = jest.fn()
        pool.submit({
          func: (arg1: any) => `Run with ${arg1}`,
          args: [],
          success: { arg1: 'undefined' } as any,
          error: function (event: Event | TypeError): void {
            throw new Error('Function not implemented.')
          }
        })
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('null', async () => {
        const error = new TypeError(`You should provide a function\n\nReceived: null`)
        const spy = console.error = jest.fn()
        pool.submit({
          func: (arg1: any) => `Run with ${arg1}`,
          args: [],
          success: null,
          error: function (event: Event | TypeError): void {
            throw new Error('Function not implemented.')
          }
        })
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
    })

    describe('error is', () => {
      test('a string', async () => {
        const error = new TypeError(`You should provide a function\n\nReceived: "a string"`)
        const spy = console.error = jest.fn()
        pool.submit({
          func: (arg1: any) => `Run with ${arg1}`,
          args: [],
          error: 'a string' as any,
          success: function (event: Event): void {
            throw new Error('Function not implemented.')
          }
        })
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('an object', async () => {
        const error = new TypeError(`You should provide a function\n\nReceived: {"arg1":"undefined"}`)
        const spy = console.error = jest.fn()
        pool.submit({
          func: (arg1: any) => `Run with ${arg1}`,
          args: [],
          error: { arg1: 'undefined' } as any,
          success: function (event: Event): void {
            throw new Error('Function not implemented.')
          }
        })
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
      test('null', async () => {
        const error = new TypeError(`You should provide a function\n\nReceived: null`)
        const spy = console.error = jest.fn()
        pool.submit({
          func: (arg1: any) => `Run with ${arg1}`,
          args: [],
          error: null,
          success: function (event: Event): void {
            throw new Error('Function not implemented.')
          }
        })
        expect(spy).toHaveBeenCalledWith(error)
        expect(spy).toHaveBeenCalledTimes(1)
        return spy.mockRestore()
      })
    })
  })
})