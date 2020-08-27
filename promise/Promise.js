const PENDING = 'PENDING';//等待态
const FULFILLED = 'FULFILLED';//成功态
const REJECTED = 'REJECTED';//失败态

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
        //将保存的成功的数据传递给成功回调
        if (this.status === FULFILLED) {
            onFulfilled(this.value);
        }
        //将保存的失败的原因传递给失败回调
        if (this.status === REJECTED) {
            onRejected(this.reason);
        }
        //处理异步流程时，调用then时可能状态还未改变，导致不会调用成功和失败回调
        if (this.status === PENDING) {
            //将回调存储起来，方便将来状态确定后调用，同步流程不会进行该操作
            //存储成功回调，并保存传参
            this.resolveCallbacks.push(() => {
                onFulfilled(this.value);
            });
            //存储失败回调，并保存传参
            this.rejectCallbacks.push(() => {
                onRejected(this.reason);
            });
        }
    }
}

//commonJS规范，模块导出成员
module.exports = Promise;
