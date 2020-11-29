function EventEmitter() {
    this._events = {};
}

//绑定事件,订阅
EventEmitter.prototype.on = function (eventName, callback) {
    //通过继承EventEmitter，调用此方法时，this指向子类的实例
    if (!this._events) {
        this._events = Object.create(null);
    }
    //用户绑定的不是newListener，让newListener的回调执行
    //newListener作为对添加绑定事件on的监听
    //先执行回调，此时还未将事件触发回调存入数组，可使用nextTick转为异步
    if (eventName !== 'newListener') {
        if (this._events['newListener']) {
            this._events['newListener'].forEach(fn => fn.call(this, eventName));
        }
    }
    //绑定事件
    if (this._events[eventName]) {
        this._events[eventName].push(callback);
    } else {
        //首次绑定
        this._events[eventName] = [callback];
    }
}

//绑定事件，当执行后自动删除
EventEmitter.prototype.once = function (eventName, callback) {
    //已绑定事件
    let one = (...args) => {
        callback.call(this, ...args);
        //删除
        this.off(eventName, one);
    }
    this.on(eventName, one);

}

//触发事件，发布
EventEmitter.prototype.emit = function (eventName, ...args) {
    //已绑定事件
    if (this._events[eventName]) {
        this._events[eventName].forEach(fn => fn.call(this, ...args));
    }
}

//移除对应事件的监听
EventEmitter.prototype.off = function (eventName, callback) {
    //已绑定事件
    if (this._events[eventName]) {
        this._events[eventName] = this._events[eventName].filter(fn => {
            return fn !== callback;
        });
    }
}

module.exports = EventEmitter;
