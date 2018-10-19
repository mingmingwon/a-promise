本文翻译基于 [Promises/A+ 官网原文](https://promisesaplus.com/) 和自己的理解，其格式和 [Github 原文](https://github.com/promises-aplus/promises-spec) 略有不同。若有纰漏还望指出。

[![Promises/A+](https://promisesaplus.com/assets/logo-small.png "Promises/A+")](https://promisesaplus.com/)

**一份通用可交互操作的 JavaScript promises 开放标准，由实现者制定，供实现者参考。**

*`promise`* 对象代表异步操作的最终结果。与 *`promise`* 对象交互的主要方式是通过它的 **`then`** 方法，用该方法注册回调函数，可以接收 *`promise`* 完成的最终值 *`value`* 或不能完成的原因 *`reason`*。

本规范详细定义了 **`then`** 方法的行为，给所有遵循 `promise/A+` 实现规范的方案提供了一份实现基础。因此，本规范是非常稳定的。然而 *`Promises/A+`* 组织可能会为解决一些新发现的边界情况，对本规范进行微小的向后兼容修正，但是只有经过仔细考虑、讨论和测试，我们才会加入较大的、不兼容的改动。

从历史上看，`Promises/A+` 澄清了早期  [`Promises/A`](http://wiki.commonjs.org/wiki/Promises/A)  建议的行为条款，并扩展它以覆盖 *`事实上`* 的行为，移除其中未指定或有问题的部分。

最后，核心 `Promises/A+` 规范并不处理如何创建、实现或拒绝 *`promises`*，而是专注于提供一种可交互操作的 **`then`** 方法。未来和规范相关的工作可能会涉及这些主题。


## 1. 术语 Terminology

1.1 *`"promise"`* 是拥有 **`then`** 方法，行为遵循本规范的对象或函数。

1.2 *`"thenable"`* 是定义了 **`then`** 方法的对象或函数。

1.3 *`"value"`* 是任何合法的 JavaScript 值（包括 **`undefined`**，*`thenable`* 以及 *`promise`*）。

1.4 *`"exception"`* 是使用 **`throw`** 语句抛出的值。

1.5 *`"reason"`* 代表 *`promise`* 被拒绝的原因。


## 2. 要求 Requirements

### 2.1 Promise 状态

*`promise`* 必须是以下三种状态之一：等待状态 *`pending`*、完成状态 *`fulfilled`* 或拒绝状态 *`rejected`*。

2.1.1 等待状态 *`pending`* 时，*`promise`* 对象：

- 2.1.1.1 可以转变为完成状态 *`fulfilled`* 或拒绝状态 *`rejected`*。

2.1.2 完成状态 *`fulfilled`* 时，*`promise`* 对象：

- 2.1.2.1 不能转变为任何其它状态。

- 2.1.2.2 必须拥有一个固定不变的值 *`value`*。

2.1.3 拒绝状态 *`rejected`* 时，*`promise`* 对象：

- 2.1.3.1 不能转变为任何其它状态。

- 2.1.3.2 必须拥有一个固定不变的原因 *`reason`*。

在这里，“固定不变”是指恒等标识符（例如：**`===`**），但并不代表深层的值恒定不变。

### 2.2 **`then`** 方法

*`promise`* 对象必须提供 **`then`** 方法来访问其当前值、最终值或原因。

*`promise`* 对象的 **`then`** 方法接收两个参数：

```
promise.then(onFulfilled, onRejected)
```

2.2.1 **`onFulfilled`** 和 **`onRejected`** 均是可选参数：

- 2.2.1.1 如果 **`onFulfilled`** 不是函数，它必须被忽略

- 2.2.1.2 如果 **`onRejected`** 不是函数，它必须被忽略

2.2.2 如果 **`onFulfilled`** 是一个函数：

- 2.2.2.1 *`promise`* 对象完成 *`fulfilled`* 后必须对其调用，并且将 *`promise`* 对象的最终值 *`value`* 作为其第一个参数。

- 2.2.2.2  *`promise`* 对象完成 *`fulfilled`* 前，不能对其调用。

- 2.2.2.3  对其调用次数不能超过一次。

2.2.3 如果 *`onRejected`* 是一个函数：

- 2.2.3.1 *`promise`* 对象拒绝 *`rejected`* 后必须对其调用，并且将 *`promise`* 对象的原因 *`reason`* 作为其第一个参数。

- 2.2.3.2 *`promise`* 对象拒绝 *`rejected`* 前，不能对其调用。

- 2.2.3.3 对其调用次数不能超过一次。

2.2.4 **`onFulfilled`** 和 **`onRejected`** 只有在 [执行上下文](https://es5.github.io/#x10.3) 堆栈仅包含平台代码时才能被调用 [[3.1](#3.1)]。

2.2.5 **`onFulfilled`** 和 **`onRejected`**  必须被作为函数调用（例如：没有 **`this`** 值）[[3.2](#3.2)]。

2.2.6 **`then`** 方法可以被同一个 *`promise`* 对象调用多次。

- 2.2.6.1 如果/当 **`promise`** 对象完成后，所有 **`onFulfilled`** 回调函数，必须按照其初始调用 **`then`** 的顺序依次执行。

- 2.2.6.2 如果/当 **`promise`** 对象拒绝后，所有 **`onRejected`** 回调函数，必须按照其初始调用 **`then`** 的顺序依次执行。

2.2.7 **`then`** 方法必须返回一个 *`promise`* 对象 [[3.3](#3.3)]。

```
promise2 = promise1.then(onFulfilled, onRejected)
```

- 2.2.7.1 如果 **`onFulfilled`** 或 **`onRejected`** 返回值为 **`x`** ，运行 `Promise Resolution Procedure` **`[[Resolve]](promise2, x)`** 函数。

- 2.2.7.2 如果 **`onFulfilled`** 或 **`onRejected`** 抛出异常 **`e`**，则 **`promise2`** 必须拒绝，并以 **`e`** 作为拒绝原因。

- 2.2.7.3 如果 **`onFulfilled`** 不是函数，且 **`promise1`** 已完成，**`promise2`** 必须完成并返回相同的值 *`value`*。

- 2.2.7.4 如果 **`onRejected`** 不是函数，且 **`promise1`** 已拒绝，**`promise2`** 必须拒绝并返回相同的原因 *`reason`*。

### 2.3 处理流程 Promise Resolution Procedure（PRP）

**`Promise Resolution Procedure`** 是一个抽象的操作，接收一个 *`promise`* 对象和一个值 *`value`* 作为参数，我们将其表示为 **`[[Resolve]](promise, x)`**。如果 **`x`** 是一个 **`thenable`** 对象，且其行为类似于 *`promise`* 对象，**`PRP`** 就会尝试让 **`promise`** 接收 **`x`** 的状态；否则就以 **`x`** 完成 **`promise`**。

这种处理 **`thenables`** 对象的方式使得各种 *`promise`* 的实现可以互通操作，只要它们暴露一个 `Promise/A+` 协议兼容的 **`then`** 方法即可。这也使得遵循 `Promise/A+` 规范的实现可以“接收”那些未遵循规范，但拥有合理 **`then`** 方法的实现。

运行 **`[[Resolve]](promise, x)`**，执行以下步骤：

- 2.3.1 如果 **`promise`** 和 **`x`** 引用同一对象，以 **`TypeError`** 为原因拒绝 **`promise`**。

 
- 2.3.2 如果 **`x`** 是 *`promise`* 对象，则采用它的状态 [[3.4](#3.4)]：


  - 2.3.2.1 如果 **`x`** 处于等待状态 *`pending`*，**`promise`** 必须保持等待状态 *`pending`* 直到 **`x`** 完成 *`fulfilled`* 或 拒绝 *`rejected`*。

  - 2.3.2.2 如果/当 **`x`** 已完成 *`fulfilled`*，则使用相同的值完成 **`promise`**。

  - 2.3.2.3 如果/当 **`x`** 已拒绝 *`rejected`*，则使用相同的原因拒绝 **`promise`**。

- 2.3.3 否则，如果 **`x`** 是对象或函数：

  - 2.3.3.1 将变量 **`then`** 赋值为 **`x.then`** [[3.5](#3.5)]。

  - 2.3.3.2 如果获取 **`x.then`** 的结果时抛出异常 **`e`**，则使用 **`e`** 作为原因拒绝 **`promise`**。

  - 2.3.3.3 如果 **`then`** 是函数，则以 **`this`** 为 **`x`** 的上下文进行调用，以 **`resolvePromise`** 为第一个参数，**`rejectPromise`** 为第二个参数，其中:
  
    - 2.3.3.3.1 如果/当以值 **`y`** 为参数调用 **`resolvePromise`** 时，则运行 **`[[Resolve]](promise, y)`** 。
  
    - 2.3.3.3.2 如果/当以原因 **`r`** 为参数调用 **`rejectPromise`** 时，则使用 **`r`** 拒绝 **`promise`** 。
  
    - 2.3.3.3.3 如果 **`resolvePromise`** 和 **`rejectPromise`** 都被调用，或被使用相同的参数调用多次，则优先采用首次调用，其它调用将被忽略。
  
    - 2.3.3.3.4 如果调用 **`then`** 方法抛出异常 **`e`** ：
    
      - 2.3.3.3.4.1 如果 **`resolvePromise`** 或 **`rejectPromise`** 已经被调用，则忽略它。
    
      - 2.3.3.3.4.2 否则，使用 **`e`** 为原因拒绝 **`promise`** 。

  - 2.3.3.4 如果 **`then`** 不是函数，以 **`x`** 为值完成 **`promise`** 。

- 2.3.4 如果 **`x`** 不是对象或函数，以 **`x`** 为值完成 **`promise`**。

如果 *`promise`* 对象被一个处于循环的 *`thenable chain`* 中的 *`thenable`* 对象完成 *`resolved`*，由于 **`[[Resolve]](promise, thenable)`** 递归的本性会使得其再次被调用，按照上面的算法，这种情况将导致无限递归。本规范鼓励但不强制实现者检测这种递归情况的出现，并使用带有一定信息的 **`TypeError`** 作为原因拒绝 **`promise`** [[3.6](#3.6)]。

## 3. 注释

- <a id="3.1">3.1</a> 这里的“平台代码” 是指引擎、环境以及 *`promise`* 的实现代码。在实践中，要求确保 **`onFulfilled`** 和 **`onRejected`** 方法能够异步执行，即在调用 **`then`** 方法的那个事件循环 `event loop` 之后的新执行栈中异步执行。可以通过“宏任务”机制如：[**`setTimeout`**](https://html.spec.whatwg.org/multipage/webappapis.html#timers)、[**`setImmediate`**](https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html#processingmodel)或“微任务”机制如： [**`MutationObserver`**](https://dom.spec.whatwg.org/#interface-mutationobserver)、[**`process.nextTick`**](http://nodejs.org/api/process.html#process_process_nexttick_callback)来实现。既然 *`promise`* 的实现本身也被认为是“平台代码”，所以其本身也应包含一个任务调度队列或“trampoline”来调用其中的处理程序。

- <a id="3.2">3.2</a> 也就是说，**`this`** 的值在严格模式下为 **`undefined`**；在非严格模式下为全局对象 `global object`。

- <a id="3.3">3.3</a> 在满足所有要求的情况下，实现中允许出现 **`promise2 === promise1`** 的情况。每种实现都应该说明其是否允许出现 **`promise2 === promise1`**，以及在什么条件下允许出现。

- <a id="3.4">3.4</a> 通常来讲，只有当 **`x`** 是从当前实现中定义出来的，我们才知道它是一个真正的 *`promise`* 对象。这条规则使得使用特定实现的方法可以接收符合规范的 *`promises`* 的状态。

- <a id="3.5">3.5</a> 这一步骤中，首先存储一个指向 **`x.then`** 的引用，然后检测该引用，之后再调用该引用，避免 **`x.then`** 属性多次被访问调用。这些预防措施对于确保访问器属性的一致性非常重要，因为其值可能在多次取值期间发生变化。

- <a id="3.6">3.6</a> 本规范的实现 `不应该` 限定 *`thenable chains`* 的深度，假设超出任意限定，递归将是无限的。只有真正的循环才会导致 **`TypeError`**；如果遇到一条长度无限且 *`thenable`* 对象均不相同链，则无限递归就是正确的行为。
