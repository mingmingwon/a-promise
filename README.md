<style>
  * {
    font-family: Consolas, 'Courier New', monospace;
    font-size: 15px;
  }
</style>

<a href="http://promisesaplus.com/">
  <img src="http://promisesaplus.com/assets/logo-small.png" alt="Promises/A+ Logo" title="Promises/A+" align="right" width="75px" />
</a>

# Introduction

An implementation of [Promises/A+](http://promisesaplus.com/) using ES6, and [Chinese specification](https://github.com/mingmingwon/a-promise/blob/master/spec_cn.md) of Promises/A+.

# Install
[![NPM](https://nodei.co/npm/a-promise.png)](https://nodei.co/npm/a-promise/)

```node
npm i a-promise
```
# Usage

```js
let Promise = require('a-promise')

let promise = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, 'Success')
}).then(res => {
  console.log(res)
  return Promise.resolve('Yeah')
})

;(async () => {
  const ret = await promise
  console.log(ret)
})()
```

# API
This library has achieved all the APIs same as JavaScript Standard built-in [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), including static methods:

- `Promise.resolve`
- `Promise.reject`
- `Promise.all`
- `Promise.race`

and prototype methods:

- `Promise.prototype.then`
- `Promise.prototype.catch`
- `Promise.prototype.finally`

and others:

- `Promise.deferred`
- `Promise.prototype.done`

# Compliances Test

Refer to [Promises/A+ Compliance Test Suite](https://github.com/promises-aplus/promises-tests).

```node
npm run test
```

will see the result like this:

```bash
872 passing (17s)
```


# License

The MIT License (MIT)
