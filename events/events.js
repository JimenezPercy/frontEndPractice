// const EventEmitter = require('events');
const EventEmitter = require('./myevents');
const util = require('util')

const events = new EventEmitter();

// function Boy() {
//
// }
//
// util.inherits(Boy, EventEmitter);

//Boy.prototype.__proto__ = EventEmitter.prototype;
//Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
// Boy.prototype = Object.create(EventEmitter.prototype);
// Object.setPrototypeOf(Boy.prototype, EventEmitter.prototype);

// const boy = new Boy();

function drink(who) {
    console.log(who, '喝酒');
}

function crazy(who) {
    console.log(who, '==============asdas');
}

events.on('newListener', (type) => {
    // console.log(type);
    process.nextTick(() => {

        events.emit(type);
    })
});

//订阅
// events.once('辞职', drink);
// events.once('辞职', drink);

events.on('辞职', crazy);
// events.off('辞职',crazy);

events.emit('辞职', 'me');
// events.emit('辞职', 'me');


