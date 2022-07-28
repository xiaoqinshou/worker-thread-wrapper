import { InferredType, ExtensionArrayType, CollectionFuncObj, TestArrayType, PostParams, ExecptionMessage } from "./types"

const isValid = (argument: any) => (types: InferredType | InferredType[]) => {
  if (Array.isArray(types)) {
    return types.some(type => isValidArg(argument)(type))
  }
  if (isValidArg(argument)(types)) {
    return true
  }
  return false
}

const isValidArg = (arg: any) => (type: InferredType) => {
  if (type === 'null') {
    return arg === null
  }
  if (type === 'undefined') {
    return arg === undefined
  }
  if (type === 'action') {
    return isValidAction(arg)
  }
  if (Array.isArray(arg)) {
    if (type !== 'array' && !testArray[type as ExtensionArrayType]) return false
    if (type === 'array') return true
    return testArray[type as ExtensionArrayType](arg)
  }
  if (arg) {
    return typeof arg === type.toString() // eslint-disable-line
  }
  return false
}

const isValidAction = (obj:CollectionFuncObj) => {
  return isValidObjectWith(['message', 'func'])(obj) &&
    typeof obj.func === 'function' && typeof obj.message === 'string'
}

// Verify that the fields exists in the Object
const isValidObjectWith = (fields: string[]) => (obj:Object) =>
  !!obj && !Array.isArray(obj) && fields.every(field => obj.hasOwnProperty(field))

const testArray:TestArrayType = {
  'actionsArray': (arr): boolean => isValidActionsArray(arr),
  'arraysArray': (arr) => arr.every(item => Array.isArray(item)),
  'objectsArray': (arr) => isValidObjectsArray(arr)(),
  'postParamsArray': (arr) => isValidPostParamsArray(arr),
  'stringsArray': (arr) => arr.every(item => typeof item === 'string')
}

const isValidActionsArray:(arr:CollectionFuncObj[]) => boolean = (arr) => arr.every(isValidAction)

const isValidObjectsArray = (arr:Object[]) => (fields:string[] = []) =>
  arr.every(isValidObjectWith(fields))

const isValidPostParamsArray = (arr:any[]) => arr.every(isValidPostParams)

const isValidPostParams = (obj: PostParams) => {
  return isValidObjectWith(['message', 'args'])(obj) &&
    Array.isArray(obj.args) && typeof obj.message === 'string'
}

// Argument error builder
const argumentError = ({ expected = '', received, extraInfo = '' }:ExecptionMessage) => {
  try {
    return new TypeError(`${'You should provide ' + expected}${'\n' + extraInfo}${'\nReceived: ' + JSON.stringify(received)}`)
  } catch (err: unknown) {
    if ((err as DOMException).message === 'Converting circular structure to JSON') {
      return new TypeError(`${'You should provide ' + expected}${'\n' + extraInfo}${'\nReceived a circular structure: ' + received}`)
    }
    throw err
  }
}

export {
  argumentError,
  isValid
}