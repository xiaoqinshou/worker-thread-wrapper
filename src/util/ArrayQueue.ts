import { Queue } from "./types";

export default class ArrayQueue<E> implements Queue<E>{

  private element: Array<E>
  private length: number
  constructor(size: number) {
    this.length = size
    this.element = []
  }
  public size: () => number = () => {
    return this.element.length
  }
  public isEmpty: () => boolean = () => {
    return this.element.length === 0
  }
  public contains: (e: E) => boolean = (e: E) => {
    return this.element.includes(e)
  }
  public toArray: () => E[] = () => {
    return Array.from(this.element)
  }
  public iterator: () => Iterator<E> = () => {
    return this.element.values()
  }
  public add: (e: E) => boolean = (e: E) => {
    if (this.element.length < this.length) {
      this.element.push(e)
      return true
    }
    return false
  }

  public poll: () => E = () => {
    if (this.element.length > 0) {
      return this.element.shift()
    }
    return null
  }

  public peek: () => E = () => {
    if (this.element.length > 0) {
      return this.element[0]
    }
    return null
  }

}