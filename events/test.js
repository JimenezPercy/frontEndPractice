const EventEmitter = require('./myevents');
const event = new EventEmitter();

function Boy() {

}

Object.setPrototypeOf(Boy.prototype, EventEmitter.prototype);
let boy=new Boy();
boy.on('newListener', (type) => {
    process.nextTick(() => {
        boy.emit(type);
    })
});

function test() {
    console.log(123);
}

boy.once('123', test);
boy.once('123', test);
boy.once('123', test);
