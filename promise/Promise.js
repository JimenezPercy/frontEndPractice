const PENDING = 'PENDING';//等待态
const FULFILLED = 'FULFILLED';//成功态
const REJECTED = 'REJECTED';//失败态

/**
 * 解析Promise
 * @param promise then返回promise
 * @param x 回调返回值
 * @param resolve promise中的resolve
 * @param reject promise中的reject
 */
function resolvePromise(promise, x, resolve, reject) {
    /**
     * If promise and x refer to the same object, reject promise with a TypeError as the reason.
     */
    if (x === promise) {
        return reject(new TypeError("TypeError:Chaining cycle detected for promise"));
    }
    /**
     * Otherwise, if x is an object or function,
     * 1.Let then be x.then.
     * 2.If retrieving the property x.then results in a thrown exception e,
     *   reject promise with e as the reason.
     * 3.If then is a function, ,call it with x as this first argument resolvePromise,
     *   and second argument rejectPromise, where:
     *   3.1 If/when resolvePromise is called with a value y, run [[Resolve]](promise, y)
     *   3.2 If/when rejectPromise is called with a reason r, reject promise with r.
     *   3.3 If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made,
     *     the first call takes precedence, and any further calls are ignored.
     *   3.4 If calling then throws an exception e,
     *     3.4.1 If resolvePromise or rejectPromise have been called, ignore it.
     *     3.4.2 Otherwise, reject promise with e as the reason.
     *   3.5 If then is not a function, fulfill promise with x.
     * 4. If x is not an object or function, fulfill promise with x.
     */
    if (typeof x === 'object' && x !== null || typeof x === 'function') {
        //取then属性，可能会抛异常
        try {
            let then = x.then;
            //如果x.then是函数，即将x看作是一个promise实例
            if (typeof then === 'function') {
                //调用该函数并改变函数的this指向
                then.call(x, y => {
                    resolve(y);
                }, r => {
                    reject(r);
                });
            } else {
                //x是一个普通对象
                resolve(x);
            }
        } catch (e) {
            //抛异常将状态转为失败，执行失败回调
            reject(e);
        }
    } else {
        //then返回值为非对象非方法的值
        resolve(x);
    }
}

class Promise {
    constructor(executor) {
        //默认等待态
        this.status = PENDING;
        //记录成功的数据
        this.value = undefined;
        //记录失败的原因
        this.reason = undefined;
        //存储异步流程中的成功回调
        this.resolveCallbacks = [];
        //存储异步流程中的失败回调
        this.rejectCallbacks = [];

        //转换成功态
        let resolve = (v) => {
            //判断当前状态是否是等待态，若是，转换为成功态；否则不做操作
            if (this.status === PENDING) {
                this.status = FULFILLED;
                //保存成功数据
                this.value = v;
                //最终确定为成功态，将存储的成功回调依次执行
                this.resolveCallbacks.forEach(fn => fn());
            }
        };

        //转成失败态
        let reject = (r) => {
            //判断当前状态是否是等待态，若是，转换为失败态；否则不做操作
            if (this.status === PENDING) {
                this.status = REJECTED;
                //保存失败原因
                this.reason = r;
                //最终确定为失败态，将存储的失败回调依次执行
                this.rejectCallbacks.forEach(fn => fn());
            }
        }

        //尝试执行并捕获异常，抛错时将状态改为失败态
        try {
            executor(resolve, reject);
        } catch (e) {
            reject();
        }

    }

    /**
     * then为原型函数，根据管理状态进行判断调用哪个回调
     * @param onFulfilled 成功时的回调
     * @param onRejected 失败时的回调
     */
    then(onFulfilled, onRejected) {
        //传递给then的参数不是函数的情况，成功回调直接转为返回传参，失败回调转为抛出传参
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected=typeof onRejected=== 'function' ? onRejected : err => {throw err};

        let p2 = new Promise((resolve, reject) => {
            //将保存的成功的数据传递给成功回调
            if (this.status === FULFILLED) {
                //此时p2还未定义完成，无法取到，可选择使用定时器异步执行获取p2的操作
                //解析x和新的p2的关系，放入定时器中确保能够渠道新的promise实例
                setTimeout(() => {
                    //执行执行成功或失败回调时会抛错
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(p2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
            //将保存的失败的原因传递给失败回调
            if (this.status === REJECTED) {
                setTimeout(() => {
                    //执行执行成功或失败回调时会抛错
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(p2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
            //处理异步流程时，调用then时可能状态还未改变，导致不会调用成功和失败回调，会进入下面的判断
            if (this.status === PENDING) {
                //将回调存储起来，方便将来状态确定后调用，同步流程不会进行该操作
                //存储成功回调，并保存传参
                //链式调用需要保存返回值
                this.resolveCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(p2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                //存储失败回调，并保存传参
                this.rejectCallbacks.push(() => {
                    setTimeout(() => {
                        //执行执行成功或失败回调时会抛错
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(p2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        });

        return p2;
    }
}

//commonJS规范，模块导出成员
module.exports = Promise;
