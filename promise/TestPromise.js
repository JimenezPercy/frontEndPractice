//管理状态
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

function resolvePromise(x, promise, resolve, reject) {

    if (promise === x) {
        return reject(new TypeError("TypeError:Chaining cycle detected for promise"));
    }

    let called = false;
    if (typeof x === 'object'&& x !== null|| typeof x === 'function') {
        try {
            let then = x.then;

            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    resolvePromise(y, promise, resolve, reject);
                }, r => {
                    if (called) return;
                    called = true;
                    reject(r);
                });
            } else {
                if (called) return;
                called = true;
                resolve(x);
            }
        } catch (e) {
            if(called)return;
            called=true;
            //抛异常将状态转为失败，执行失败回调
            reject(e);
        }
    } else {
        resolve(x);
    }

}

class Promise {
    constructor(executor) {
        //状态
        this.status = PENDING;
        //记录成功的数据
        this.value=undefined;
        //记录失败的原因
        this.reason=undefined;
        //成功回调
        this.fullfillCallbacks = [];
        //失败回调
        this.rejectCallbacks = [];

        const resolve = (v) => {
            if (this.status === PENDING) {
                //转为成功态
                this.status = FULFILLED;
                //成功传入数据
                this.value = v;
                //状态确定后依次执行
                this.fullfillCallbacks.forEach(fn => fn());
            }
        }

        const reject = (r) => {
            if (this.status === PENDING) {
                //转为成功态
                this.status = REJECTED;
                //失败原因
                this.reason = r;
                //状态确定后依次执行
                this.rejectCallbacks.forEach(fn => fn());
            }
        }

        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected = typeof onRejected === 'function' ? onRejected : err => {
            throw err
        };

        let p = new Promise((resolve, reject) => {
            //成功
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(x, p, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            }

            //失败
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(x, p, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }

                })
            }

            //处理异步流程时，此时仍是等待态
            if (this.status === PENDING) {
                this.fullfillCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(x, p, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });

                this.rejectCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(x, p, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    })
                });
            }
        });

        return p;
    }


}

// new Promise((resolve, reject) => {
//     console.log("====")
//     // setTimeout(()=>{
//     //     resolve(123);
//     // })
//     throw new Error('345')
// }).then(v => {
//     console.log('success', v);
// }, (e) => {
//     console.log('error', e);
// })

Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}

//commonJS规范，模�
module.exports = Promise;
