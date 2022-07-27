/* global fixture, test, runTests */
import { ClientFunction, Selector } from 'testcafe'

fixture(`Thread.run`)
  .page(`./config/index.html`)

test('Without args && without =>', async t => {
  const workerResult = await ClientFunction(() => runTests.t1())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run without args and without arrow function'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('Without args && with =>', async t => {
  const workerResult = await ClientFunction(() => runTests.t2())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run without args and with arrow function'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With args && without =>', async t => {
  const workerResult = await ClientFunction(() => runTests.t3())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run with args and without arrow function'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With args && with =>', async t => {
  const workerResult = await ClientFunction(() => runTests.t4())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run with args and with arrow function'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With no args (but expecting args)', async t => {
  const workerResult = await ClientFunction(() => runTests.t5())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run undefined and undefined'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With args === undefined && default arg value', async t => {
  const workerResult = await ClientFunction(() => runTests.t6())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run with default arg value'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With args === undefined && no default', async t => {
  const workerResult = await ClientFunction(() => runTests.t7())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run with undefined'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With args === undefined && delayed', async t => {
  const workerResult = await ClientFunction(() => runTests.t8())()
  const expected = 'timeOver. this worker is closed'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
})

test('With args === undefined && not delayed', async t => {
  const workerResult = await ClientFunction(() => runTests.t9())()
  const testParagraph = Selector('#result').textContent
  const expected = 'Run without args and without arrow function'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With args === number && Concurrency not delayed result', async t => {
  const workerResult = await ClientFunction(() => runTests.t10())()
  for(let i = 0; i < 10; i++) {
    await t.expect(workerResult[i]).typeOf('number')
    await t.expect(workerResult[i]).eql(i)
  }
})

test('With args === undefined && Concurrency not delayed or delayed result', async t => {
  const workerResult = await ClientFunction(() => runTests.t11())()
  const expected = 'timeOver. this worker is closed'
  for(let i = 0; i < 10; i++) {
    const time = 400 * i
    if(time>2000 || time < 1){
      await t.expect(workerResult[i]).typeOf('number')
      await t.expect(workerResult[i]).eql(time)
    }else if(time<2000){
      await t.expect(workerResult[i]).typeOf('string')
      await t.expect(workerResult[i]).eql(expected)
    }else{
      // 2000 maybe success or fail
      const res = workerResult[i]
      if(typeof res == 'string'){
        await t.expect(res).eql(expected)
      }else{
        await t.expect(res).eql(time)
      }
    }
  }
})

test('With args === undefined &&  Concurrency not delayed or delayed result', async t => {
  const workerResult = await ClientFunction(() => runTests.t12())()
  const expected = 'timeOver. this worker is closed'
  for(let i = 0; i < 10; i++) {
    const time = 400 * (10 - i)
    if(time>2000){
      await t.expect(workerResult[i]).typeOf('number')
      await t.expect(workerResult[i]).eql(time)
    }else if(time<2000){
      await t.expect(workerResult[i]).typeOf('string')
      await t.expect(workerResult[i]).eql(expected)
    }else{
      // 2000 maybe success or fail
      const res = workerResult[i]
      if(typeof res == 'string'){
        await t.expect(res).eql(expected)
      }else{
        await t.expect(res).eql(time)
      }
    }
  }
})

test('With args === undefined && critical value result 1999(between -50ms and +50ms. maybe success and error).', async t => {
  const workerResult = await ClientFunction(() => runTests.t13())()
  const expected = 'timeOver. this worker is closed'
  const success = 'hello world'
  await t.expect(workerResult).typeOf('string')
  if(workerResult == success || workerResult == expected){
    await t.expect(workerResult).ok(workerResult)
  }else{
    await t.expect(workerResult).notOk(workerResult)
  }
})

test('With args === undefined && critical value result 2000(between -50ms and +50ms. maybe success and error).', async t => {
  const workerResult = await ClientFunction(() => runTests.t14())()
  const expected = 'timeOver. this worker is closed'
  const success = 'hello world'
  await t.expect(workerResult).typeOf('string')
  if(workerResult == success || workerResult == expected){
    await t.expect(workerResult).ok(workerResult)
  }else{
    await t.expect(workerResult).notOk(workerResult)
  }
})

test('With args === undefined && critical value result 2001(between -50ms and +50ms. maybe success and error).', async t => {
  const workerResult = await ClientFunction(() => runTests.t15())()
  const expected = 'timeOver. this worker is closed'
  const success = 'hello world'
  await t.expect(workerResult).typeOf('string')
  if(workerResult == success || workerResult == expected){
    await t.expect(workerResult).ok(workerResult)
  }else{
    await t.expect(workerResult).notOk(workerResult)
  }
})

test('With args === undefined && critical value result 2050(+50ms. must be completed).', async t => {
  const workerResult = await ClientFunction(() => runTests.t16())()
  const testParagraph = Selector('#result').textContent
  const expected = 'hello world'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
  await t.expect(testParagraph).eql(expected)
})

test('With args === undefined && critical value result 1950(-50ms. must be time out).', async t => {
  const workerResult = await ClientFunction(() => runTests.t17())()
  const expected = 'timeOver. this worker is closed'
  await t.expect(workerResult).typeOf('string')
  await t.expect(workerResult).eql(expected)
})