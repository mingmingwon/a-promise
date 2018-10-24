/**
 * Keep variable names same as Promises/A+ spec as possible
 */

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

// promise belongs micro-task, it's more like process.nextTick
// rather than macro-task setImmediate and setTimeout
let nextTick = setTimeout
if (typeof process === 'object' && typeof process.nextTick === 'function') {
  nextTick = process.nextTick
} else if (typeof setImmediate === 'function') {
  nextTick = setImmediate
}

class Promise {
  constructor (executor) {
    this.status = PENDING
    this.value = null
    this.reason = null
    this.onFulfilleds = []
    this.onRejecteds = []

    try {
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (reason) {
      this.reject(reason)
    }
  }

  resolve (value) {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value

      nextTick(() => { // ensure execute asynchronously
        this.onFulfilleds.forEach(onFulfilled => {
          onFulfilled(this.value)
        })
      }, 0)
    }
  }

  reject (reason) {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason

      nextTick(() => { // ensure execute asynchronously
        this.onRejecteds.forEach(onRejected => {
          onRejected(this.reason)
        })
      }, 0)
    }
  }

  then (onFulfilled, onRejected) {
    typeof onFulfilled === 'function' || (onFulfilled = value => value)
    typeof onRejected === 'function' || (onRejected = reason => { throw reason })

    let promise = new Promise((resolve, reject) => {
      if (this.status === PENDING) {
        this.onFulfilleds.push(value => {
          try {
            let x = onFulfilled(value)
            Promise.resolvePromise(promise, x, resolve, reject)
          } catch (reason) {
            reject(reason)
          }
        })
        this.onRejecteds.push(reason => {
          try {
            let x = onRejected(reason)
            Promise.resolvePromise(promise, x, resolve, reject)
          } catch (reason) {
            reject(reason)
          }
        })
      }

      if (this.status === FULFILLED) {
        nextTick(() => {
          try {
            let x = onFulfilled(this.value)
            Promise.resolvePromise(promise, x, resolve, reject)
          } catch (reason) {
            reject(reason)
          }
        }, 0)
      }

      if (this.status === REJECTED) {
        nextTick(() => {
          try {
            let x = onRejected(this.reason)
            Promise.resolvePromise(promise, x, resolve, reject)
          } catch (reason) {
            reject(reason)
          }
        }, 0)
      }
    })

    return promise
  }

  catch (onRejected) {
    return this.then(undefined, onRejected)
  }

  finally (fn) {
    return this.then(res => {
      fn.call(this, res)
      return res
    }, err => {
      fn.call(this, err)
      return err
    })
  }

  done (fn) {
    this.catch(err => {
      throw err
    })
  }

  static resolvePromise (promise, x, resolve, reject) {
    let called = false

    if (promise === x) {
      return reject(new TypeError('Circular reference'))
    }

    let xType = Object.prototype.toString.call(x)
    if (xType === '[object Object]' || xType === '[object Function]') {
      try {
        let then = x.then
        if (typeof then === 'function') {
          then.call(x, y => {
            if (called) return
            called = true
            Promise.resolvePromise(promise, y, resolve, reject)
          }, r => {
            if (called) return
            called = true
            reject(r)
          })
        } else {
          if (called) return
          called = true
          resolve(x)
        }
      } catch (e) {
        if (called) return
        called = true
        reject(e)
      }
    } else {
      resolve(x)
    }
  }

  static deferred () {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
      dfd.resolve = resolve
      dfd.reject = reject
    })
    return dfd
  }

  static resolve (value) {
    let promise
    promise = new Promise((resolve, reject) => {
      Promise.resolvePromise(promise, value, resolve, reject)
    })
    return promise
  }

  static reject (reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  static all (promises) {
    if (!Array.isArray(promises)) {
      throw new TypeError('Argument is not iterable')
    }

    return new Promise((resolve, reject) => {
      let result = []
      let count = 0
      promises.forEach((promise, index) => {
        promise.then(res => {
          result[index] = res
          count++
          if (count === promises.length) {
            resolve(result)
          }
        }, reject)
      })
    })
  }

  static race (promises) {
    if (!Array.isArray(promises)) {
      throw new TypeError('Argument is not iterable')
    }

    return new Promise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(res => {
          resolve(res)
        }, reject)
      })
    })
  }
}

module.exports = Promise
