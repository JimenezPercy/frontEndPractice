const fs = require('fs');
const EventEmitter = require('events');

class ReadStream extends EventEmitter {
    constructor(path, options = {}) {
        super();
        this.path = path;
        this.flags = options.flags || 'r';
        this.mode = options.mode || 0x666;
        this.autoClose = options.autoClose || true;
        this.emitClose = options.emitClose || false;
        this.start = options.start || 0;
        this.end = options.end;
        this.highWaterMark = options.highWaterMark || 64 * 1024;

        //每次读取文件的偏移量
        this.pos = this.start;

        //打开文件
        this.open();

        //监听是否绑定data事件
        this.on('newListener', (eventName) => {
            if (eventName === 'data') {
                //开始读取文件
                this.read();
            }
        });
    }

    open() {
        //fs.open()
        fs.open(this.path, this.flags, this.mode, (err, fd) => {
            if (err) {
                return this.emit('error', err);
            }

            //文件打开后，存储文件描述符
            this.fd = fd;
            this.emit('open', fd);
        });
    }

    read() {
        //fs.read()
        //未拿到文件描述符
        if (typeof this.fd !== 'number') {
            //打开文件后再调用读文件
            return this.once('open', this.read)
        }

        //拿到fd才可以读取
        let buffer = Buffer.alloc(this.highWaterMark);
        fs.read(this.fd, buffer, 0, this.highWaterMark, this.pos, (err, bytesRead) => {
            if (bytesRead) {
                //触发data事件
                this.emit('data', buffer.slice(0, bytesRead));
                //重置偏移量
                this.pos += bytesRead;
                //递归
                this.read();
            } else {
                //读取结束触发end
                this.emit('end');
                //关闭文件
                this.close();
            }
        })
    }

    close() {
        fs.close(this.fd, () => {
            //关闭文件后触发close事件
            this.emit('close');
        })
    }
}

module.exports = ReadStream;
