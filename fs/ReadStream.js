const fs = require('fs');
const EventEmitter = require('events');

//基于事件发布订阅，继承事件模块
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

        //默认情况是暂停模式
        this.following = false;

        //每次读取文件的偏移量
        this.pos = this.start;

        //打开文件
        this.open();

        //监听是否绑定data事件
        this.on('newListener', (eventName) => {
            if (eventName === 'data') {
                this.following = true;
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
        let howMuchToRead = this.end ? Math.min(this.end - this.pos + 1, this.highWaterMark) : this.highWaterMark;
        fs.read(this.fd, buffer, 0, howMuchToRead, this.pos, (err, bytesRead) => {
            if (bytesRead) {
                //触发data事件
                this.emit('data', buffer.slice(0, bytesRead));
                //重置偏移量
                this.pos += bytesRead;
                //判断是否暂停
                if (this.following) {
                    //递归
                    this.read();
                }
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

    pause() {
        this.following = false;
        //TODO 读取完毕后，要禁止再次执行read
    }

    resume() {
        this.following = true;
        this.read();
    }

    pipe(writeStream) {
        this.on('data', (chunk) => {
            let flag = writeStream.write(chunk);
            if(!flag){
                //暂停
                this.pause();
            }
        })

        writeStream.on('drain',()=>{
            //恢复读取
            this.resume();
        })
    }
}

module.exports = ReadStream;
