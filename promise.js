const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class Promise {
  constructor (func) {
    this.status = PENDING
    this.value = null
    this.reason = null
    this.onFulfilledArr = []
    this.onRejectedArr = []

    try {
      func(this.resolve.bind(this), this.reject.bind(this))
    } catch (reason) {
      this.reject(reason)
    }
  }

  resolve (value) {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value

      this.onFulfilledArr.forEach(onFulfilled => {
        onFulfilled(this.value)
      })
    }
  }

  reject (reason) {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason

      this.onRejectedArr.forEach(onRejected => {
        onRejected(this.reason)
      })
    }
  }

  then (onFulfilled, onRejected) {
    typeof onFulfilled === 'function' || (onFulfilled = value => value)
    typeof onRejected === 'function' || (onRejected = reason => { throw reason })

    const promise = new Promise((resolve, reject) => {
      if (this.status === PENDING) {
        this.onFulfilledArr.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              this.resolvePromise(promise, x, resolve, reject)
            } catch (reason) {
              reject(reason)
            }
          }, 0)
        })
        this.onRejectedArr.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              this.resolvePromise(promise, x, resolve, reject)
            } catch (reason) {
              reject(reason)
            }
          }, 0)
        })
      }

      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            this.resolvePromise(promise, x, resolve, reject)
          } catch (reason) {
            reject(reason)
          }
        }, 0)
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            this.resolvePromise(promise, x, resolve, reject)
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

  resolvePromise (promise, x, resolve, reject) {
    let called = false

    if (promise === x) {
      return reject(new TypeError('circular reference'))
    }

    const xType = Object.prototype.toString.call(x)
    if (xType === '[object Object]' || xType === '[object Function]') {
      try {
        let then = x.then
        if (typeof then === 'function') {
          then.call(x, y => {
            if (called) return
            called = true
            this.resolvePromise(promise, y, resolve, reject)
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
    const dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
      dfd.resolve = resolve
      dfd.reject = reject
    })
    return dfd
  }
}

module.exports = Promise
