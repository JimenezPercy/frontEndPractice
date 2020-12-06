const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const LinkedList = require('../DataStructure/LinkedList');

//队列
class Queue {
    constructor() {
        this.linkedList = new LinkedList();
    }

    //入队
    enQueue(data) {
        this.linkedList.add(data);
    }

    //出队
    deQueue() {
        let node = this.linkedList.remove(0);
        return node;
    }
}

class WriteStream extends EventEmitter {
    constructor(path, options = {}) {
        super();
        this.path = path;
        this.flags = options.flags || 'w';
        this.autoClose = options.autoClose || true;
        this.encoding = options.encoding || 'utf8';
        this.start = options.start || 0;
        this.highWaterMark = options.highWaterMark || 16 * 1024;

        //打开文件
        this.open();

        //是否需要触发drain事件
        this.isNeedDrain = false;
        this.isNeedDrain = false;
        //写入偏移量
        this.offset = this.start;
        //缓存结构，保存还未调用的write
        this.cache = new Queue();
        //正在写入的个数
        this.len = 0;
        //是否正在写入
        this.writting = false;
    }

    open() {
        fs.open(this.path, this.flags, (err, fd) => {
            if (err) {
                return this.emit('error', err);
            } else {
                this.fd = fd;
                this.emit('open', fd);
            }
        });
    }

    write(chunck, encoding='utf8', callback=()=>{}) {
        //fs.write
        //将接收的数据转为Buffer
        chunck = Buffer.isBuffer(chunck) ? chunck : Buffer.from(chunck);
        this.len += chunck.length;
        let flag = this.len < this.highWaterMark;
        //当写入内容达到或超过预估量，需要触发drain事件
        this.isNeedDrain = !flag;

        if (this.writting) {
            //排队
            this.cache.enQueue({
                chunck,
                encoding,
                callback
            });
        } else {
            this.writting = true;
            //真正去写，写完后清空队列
            this._write(chunck, encoding, () => {
                callback();
                this.clearBuffer();
            });
        }

        return flag;
    }

    clearBuffer() {
        let node = this.cache.deQueue();
        if (node) {
            let data = node.element;
            this._write(data.chunck, data.encoding, () => {
                data.callback();
                this.clearBuffer();
            });
        } else {
            this.writting = false;
            if (this.isNeedDrain) {
                this.emit('drain');
                this.isNeedDrain = false;
            }
        }
    }

    _write(chunck, encoding, callback) {
        //open中是异步流程，此时还未拿到文件描述符
        if (typeof this.fd !== 'number') {
            return this.once('open', () => {
                this._write(chunck, encoding, callback);
            });
        }
        fs.write(this.fd, chunck, 0, chunck.length, this.offset, (err, written) => {
            if (err) {
                return this.emit('error', err);
            }
            this.offset += written;
            this.len -= written;
            callback();
        })
    }
}

module.exports = WriteStream;
