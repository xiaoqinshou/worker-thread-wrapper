const thread = new WorkerBuilder().build();
const resultEl = document.querySelector('#result')
const runTests = {
  // Run without args and without arrow function
  t1() {
    return new thread().run(function () { return 'Run without args and without arrow function' })()
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  // Run without args and with arrow function
  t2() {
    return new thread().run(() => 'Run without args and with arrow function')()
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  // Run with args and without arrow function
  t3() {
    return new thread().run(function (arg1, arg2) { return `Run ${arg1} and ${arg2}` }, ['with args', 'without arrow function'])()
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  // Run with args and with arrow function
  t4() {
    return new thread().run((arg1, arg2) => `Run ${arg1} and ${arg2}`, ['with args', 'with arrow function'])()
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  // Run without args but expecting them
  t5() {
    return new thread().run((arg1, arg2) => `Run ${arg1} and ${arg2}`)()
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  // Run without args but with default arg value
  t6() {
    /** REASON FOR THAT UGLY FUNCTION (TIP: I CAN'T USE DEFAULT VALUES FOR ARGUMENTS IN THESE TESTS!):
      * I don't know why, but it is not possible to use default arguments in this test, like:
      *     (arg1 = 'default arg value') => `Run with ${arg1}`
      *
      * That returns a TypeError:
      *     An error occurred in ClientFunction code:
      *
      *     TypeError: se[u.type] is not a function
      *
      * So I just put in the LOOOONG TRANSPILED version of that, which is:
      *     function () {
      *       const arg1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default arg value'
      *       return 'Run with ' + arg1
      *     }
      *
      * Even the slightly shorter version of that ugly function, i.e., an arrow function, can not be used:
      *     () => {
      *       const arg1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default arg value'
      *       return 'Run with ' + arg1
      *     }
      * Returns an ReferenceError:
      *     ReferenceError: arguments is not defined
      * And an AssertionError (well, that's an error raised by the assertion test itself, so it's ok, I guess):
      *     AssertionError: expected { isTrusted: true } to be a string
      *
      * The bottom line is:
      *     I CAN'T USE DEFAULT VALUES FOR ARGUMENTS IN THESE TESTS!
      */
    return new thread().run(function () {
      const arg1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default arg value'
      return 'Run with ' + arg1
    }, undefined)()
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  // Run without args but without default
  t7() {
    return new thread().run((arg1) => `Run with ${arg1}`, undefined)()
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => err)
  },

  // Run without delayed result
  t8() {
    return new thread().run(function () {
      let start = (new Date()).getTime();
      while (new Date().getTime() - start < 1000) {
        continue;
      }
      return 'Run without args and without arrow function'
    }
    )(900)
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => {
        return err
      })
  },

  // Run without not delayed result
  t9() {
    return new thread().run(function () {
      let start = (new Date()).getTime();
      while (new Date().getTime() - start < 500) {
        continue;
      }
      return 'Run without args and without arrow function'
    }
    )(900)
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => {
        return err
      })
  },

  // Run without Concurrency not delayed result
  async t10() {
    const pro = []
    for (let i = 0; i < 10; i++) {
      pro.push(new thread().run(index => index, [i])(900)
        .then(result => {
          resultEl.innerHTML = result
          return result
        })
        .catch(err => {
          return err
        }))
    }
    const res = []
    for(let item of pro) {
      const resolve = await item
      res.push(resolve)
    }
    return res
  },
  // Run without Concurrency not delayed or delayed result
  async t11() {
    const pro = []
    for (let i = 0; i < 10; i++) {
      pro.push(new thread().run(index => {
        let start = (new Date()).getTime();
        while (new Date().getTime() - start < 2000) {
          continue;
        }
        return index
      }, [i * 400])(400 * i)
        .then(result => {
          resultEl.innerHTML = result
          return result
        })
        .catch(err => {
          return err
        }))
    }
    const res = []
    for(let item of pro) {
      const resolve = await item
      res.push(resolve)
    }
    return res
  },
  // Run without Concurrency not delayed or delayed result
  async t12() {
    const pro = []
    for (let i = 0; i < 10; i++) {
      pro.push(new thread().run(index => {
        let start = (new Date()).getTime();
        while (new Date().getTime() - start < 2000) {
          continue;
        }
        return index
      }, [(10 - i) * 400])(400 * (10 - i))
        .then(result => {
          resultEl.innerHTML = result
          return result
        })
        .catch(err => {
          return err
        }))
    }
    const res = []
    for(let item of pro) {
      const resolve = await item
      res.push(resolve)
    }
    return res
  },
  // Run without critical value result 2000 meybe success or failure
  t13() {
    return new thread().run(index => {
      let start = (new Date()).getTime();
      while (new Date().getTime() - start < 2000) {
        continue;
      }
      return index
    }, ["hello world"])(2000)
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => {
        return err
      })
  },
  // Run without critical value result 1999 meybe success or failure
  t14() {
    return new thread().run(index => {
      let start = (new Date()).getTime();
      while (new Date().getTime() - start < 2000) {
        continue;
      }
      return index
    }, ["hello world"])(1999)
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => {
        return err
      })
  },
  // Run without critical value result 2001 meybe success or failure
  t15() {
    return new thread().run(index => {
      let start = (new Date()).getTime();
      while (new Date().getTime() - start < 2000) {
        continue;
      }
      return index
    }, ["hello world"])(2001)
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => {
        return err
      })
  },
  // Because there is a delay in the communication in workers, the actual time limit is about 50ms to the right.
  // SO When the difference between the task execution time and the monitoring time is less than 50ms, the task cannot be accurately terminated or completed.
  // must be completed, larger than 50ms
  t16() {
    return new thread().run(index => {
      let start = (new Date()).getTime();
      while (new Date().getTime() - start < 2000) {
        continue;
      }
      return index
    }, ["hello world"])(2050)
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => {
        return err
      })
  },
  // must be failure, less than 50ms
  t17() {
    return new thread().run(index => {
      let start = (new Date()).getTime();
      while (new Date().getTime() - start < 2000) {
        continue;
      }
      return index
    }, ["hello world"])(1950)
      .then(result => {
        resultEl.innerHTML = result
        return result
      })
      .catch(err => {
        return err
      })
  }
}
console.log(runTests, "runTests")