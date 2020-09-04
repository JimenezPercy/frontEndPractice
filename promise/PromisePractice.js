//管理状态
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class PromisePractice {
  constructor(executor) {
    //状态
    this.status = PENDING;
    //成功数据
    this.value = undefined;
    //失败原因
    this.reason = undefined;
    //成功回调
    this.fulfilledCallbacks = [];
    //失败回调
    this.rejectedCallbacks = [];

    let resolve = (d) => {
      if (this.status === PENDING) {
        //转换为成功态
        this.status = FULFILLED;
        this.value = d;
        //状态确定，依次执行成功回调
        this.fulfilledCallbacks.forEach(f => f());
      }
    };

    let reject = (r) => {
      if (this.status === PENDING) {
        //转换为成功态
        this.status = REJECTED;
        this.reason = r;
        //状态确定，依次执行失败回调
        this.rejectedCallbacks.forEach(f => f());
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    try {
      let result = undefined;
      //成功态，调用成功回调
      if (this.status === FULFILLED) {
        result = onFulfilled(this.value);
      }
      //失败态，调用失败回调
      if (this.status === REJECTED) {
        result = onRejected(this.reason);
      }
      //等待态
      if (this.status === PENDING) {
        this.fulfilledCallbacks.push(() => {
          onFulfilled(this.value);
        });
        this.rejectedCallbacks.push(() => {
          onRejected(this.reason);
        });
      }

      console.log(result);
      if (result instanceof PromisePractice || !result) {
        return result;
      } else {
        return new PromisePractice((resolve, reject) => {
          resolve(result);
        });
      }

    } catch (e) {
      return new PromisePractice((resolve, reject) => {
        reject(e);
      });
    }

  }
}

module.exports = PromisePractice;